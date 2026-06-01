import { Track, AssetImportStatus } from '../../../types';
import db from '../../../data/db';
import blob from '../../../data/blob';
import automation from '../../../lib/automation';
import songPage from '../../../browser/songPage';
import path from 'path';

export type ImportTrackAssetsResult = {
  slug: string;
  status: 'complete' | 'partial' | 'error';
  fullMix: AssetImportStatus;
  stems: { slug: string; status: AssetImportStatus }[];
  mixes: { slug: string; status: AssetImportStatus }[];
  errors: string[];
};

export type ImportTrackAssetsOptions = {
  forceOverwrite?: boolean;
};

export async function importTrackAssets(slug: string, options?: ImportTrackAssetsOptions): Promise<ImportTrackAssetsResult> {
  const result: ImportTrackAssetsResult = {
    slug,
    status: 'complete',
    fullMix: 'pending',
    stems: [],
    mixes: [],
    errors: [],
  };

  try {
    const track = await db.tracks.find(slug);
    if (!track) {
      throw new Error(`Track '${slug}' not found in database`);
    }

    const username = track.source.users[0];
    if (!username) {
      throw new Error(`Track '${slug}' has no associated user`);
    }

    const account = await db.accounts.find(username);
    if (!account) {
      throw new Error(`Account '${username}' not found`);
    }

    const forceOverwrite = options?.forceOverwrite === true;

    const fullMixBlob = path.join(slug, 'full-mix.mp3');
    const hasFullMix = forceOverwrite ? false : await blob.checkExists(fullMixBlob);
    result.fullMix = hasFullMix ? 'imported' : 'missing';

    for (const stem of track.stems || []) {
      const stemBlob = path.join(slug, `${stem.slug}.mp3`);
      const hasStem = forceOverwrite ? false : await blob.checkExists(stemBlob);
      result.stems.push({
        slug: stem.slug,
        status: hasStem ? 'imported' : 'missing',
      });
    }

    for (const mix of track.mixes || []) {
      const mixBlob = path.join(slug, `${mix.slug}.mp3`);
      const hasMix = forceOverwrite ? false : await blob.checkExists(mixBlob);
      result.mixes.push({
        slug: mix.slug,
        status: hasMix ? 'imported' : 'missing',
      });
    }

    const missingCount =
      (result.fullMix === 'missing' ? 1 : 0) +
      result.stems.filter((s) => s.status === 'missing').length +
      result.mixes.filter((m) => m.status === 'missing').length;

    if (missingCount === 0) {
      result.status = 'complete';
      await updateTrackImportStatus(track, result);
      return result;
    }

    const context = await automation.getContext(account.username, account.password);
    const page = songPage(context.page);
    await page.navigate(track.source.url);

    if (result.fullMix === 'missing') {
      try {
        const stream = await page.getMixStream(undefined);
        await blob.uploadStream(stream, fullMixBlob);
        result.fullMix = 'imported';
      } catch (error) {
        result.fullMix = 'error';
        result.errors.push(`Full mix: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    for (let i = 0; i < result.stems.length; i += 1) {
      const stemResult = result.stems[i];
      if (stemResult && stemResult.status === 'missing') {
        const stem = track.stems?.find((s) => s.slug === stemResult.slug);
        if (!stem) {
          continue;
        }

        try {
          const stream = await page.getStemStream(stem.order);
          await blob.uploadStream(stream, path.join(slug, `${stem.slug}.mp3`));
          stemResult.status = 'imported';
        } catch (error) {
          stemResult.status = 'error';
          result.errors.push(`Stem ${stem.slug}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    for (const mixResult of result.mixes) {
      if (mixResult.status === 'missing') {
        const mix = track.mixes?.find((m) => m.slug === mixResult.slug);
        if (!mix) {
          continue;
        }

        try {
          const stream = await page.getMixStream(mix.name);
          await blob.uploadStream(stream, path.join(slug, `${mix.slug}.mp3`));
          mixResult.status = 'imported';
        } catch (error) {
          mixResult.status = 'error';
          result.errors.push(`Mix ${mix.slug}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    const hasErrors = result.errors.length > 0;
    const allImported =
      result.fullMix === 'imported' &&
      result.stems.every((s) => s.status === 'imported') &&
      result.mixes.every((m) => m.status === 'imported');

    result.status = allImported ? 'complete' : hasErrors ? 'error' : 'partial';

    await updateTrackImportStatus(track, result);
  } catch (error) {
    result.status = 'error';
    result.errors.push(error instanceof Error ? error.message : String(error));
  } finally {
    await automation.close();
  }

  return result;
}

async function updateTrackImportStatus(track: Track, result: ImportTrackAssetsResult) {
  const updatedTrack: Track = {
    ...track,
    status: result.status === 'complete' ? 'complete' : result.status === 'error' ? 'error' : 'partial',
    lastImport: new Date(),
    fullMix: track.fullMix ? { ...track.fullMix, status: result.fullMix } : undefined,
    stems: track.stems?.map((stem) => {
      const stemResult = result.stems.find((s) => s.slug === stem.slug);
      return { ...stem, status: stemResult?.status || 'pending' };
    }),
    mixes: track.mixes?.map((mix) => {
      const mixResult = result.mixes.find((m) => m.slug === mix.slug);
      return { ...mix, status: mixResult?.status || 'pending' };
    }),
  };

  await db.tracks.update(track.id, track.slug, updatedTrack);
}
