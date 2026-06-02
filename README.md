# @mortware/kvd

KVD is a CLI for managing karaoke-version track metadata and asset imports using your Azure data stores.

Behavioral requirements and command contracts are documented in `docs/CLI_REQUIREMENTS.md`.

It supports two core workflows:

1. Catalog and import tracks to Azure (CosmosDB + Blob Storage).
2. Download and locally mix imported audio files for playback/production.

## Why CLI-first

This project previously evolved through multiple interfaces. The current intended interface is the `kvd` CLI, with explicit commands and built-in help.

Run this for command discovery:

```bash
kvd help
```

Or command-specific help:

```bash
kvd help track
kvd track import --help
kvd account create --help
```

## Installation

```bash
npm install
npm run build
npm link
kvd help
```

## Configuration

Create `kvd-config.json` in your project working directory.

```json
{
  "azure": {
    "blob": {
      "url": "https://<storage-account>.blob.core.windows.net",
      "container": "<container-name>"
    },
    "cosmos": {
      "url": "https://<cosmos-account>.documents.azure.com:443/"
    }
  },
  "headless": true,
  "processDelay": 0
}
```

Authentication uses `DefaultAzureCredential`, so local `az login` works for development.

## Command Groups

### Audio workflow

- `kvd download` : Search tracks and download selected files from Blob Storage.
- `kvd mix` : Create local backing mixes from imported stems with `ffmpeg` (WAV by default, optional MP3).

Examples:

```bash
kvd download --search "bruno mars" --username your-user --output ./downloads
kvd download --slug bruno-mars-i-just-might
kvd mix --slug bruno-mars-i-just-might
```

Interactive mix example:

```bash
kvd track mix --search "bruno"
```

What this does:

- Finds matching tracks, then prompts you to choose one.
- Shows all available stems for that track, then prompts you to select which stems to include in the backing mix.
- Prompts for target key with the source key as default and +/- semitone options with key names.
- Ensures selected stem MP3s and click MP3 are cached under `downloads/<track-slug>/`.
- Writes final output under `mixes/<track-slug>/`:
  - `<track-slug>-backing.wav` (or `.mp3` with `--mp3`)
- When key is changed, appends the target key and semitone delta to backing filename (example: `-c-sharp+2`).
- Excludes click stems from selection defaults.
- Never pitch-shifts click tracks, even when key transposition is applied.
- Does not render a separate click output by default.
- By default, mutes the first bar in the backing WAV (count-in suppression).
- If click output is enabled, leaves the click file unmodified (no first-bar mute) and validates backing/click duration match.

Optional flags:

```bash
kvd track mix --search "bruno" --keep-count-in
kvd track mix --search "bruno" --include-click-track
kvd track mix --search "bruno" --mp3
```

Use `--keep-count-in` to keep the first-bar count-in audible in the backing WAV.
Use `--include-click-track` to also render `<track-slug>-click.wav` (or `.mp3` with `--mp3`).

### ffmpeg rubberband requirement

Key transposition in `kvd mix` uses the `rubberband` audio filter.

Check support in your local ffmpeg build:

```bash
ffmpeg -hide_banner -filters | Select-String rubberband
ffmpeg -hide_banner -buildconf | Select-String "librubberband|rubberband"
```

If these commands show `rubberband` and `--enable-librubberband`, key shifting is available.

### Accounts and catalog

- `kvd account list`
- `kvd account create --username <name> --password <password> [--name <displayName>]`
- `kvd account import [--username <name>] [--claim-shared] [--action prompt|import-missing|update|overwrite|none]`
- `kvd catalog purchases --username <name> [--skip-cache]`

### Tracks and query

- `kvd track list --username <name>`
- `kvd track get --slug <slug>`
- `kvd track import --slug <slug> [--username <name>] [--skip-cache] [--mode import-missing|update|overwrite]`
- `kvd track query [filters]`

If `--mode` is omitted in an interactive terminal, `kvd track import` shows current track status/owners and prompts for the action to run.

Example query:

```bash
kvd track query --search beatles --status complete --has-lyrics true --sort-by artist --limit 20
kvd track import --slug bruno-mars-i-just-might --username your-user --mode import-missing
kvd track import --slug bruno-mars-i-just-might --username your-user --mode overwrite
```

### Import status operations

- `kvd track import-status --username <name> [--details]`
- `kvd track refresh-status --username <name>`

### Lyrics operations

- `kvd lyrics get --slug <slug>`
- `kvd lyrics update --slug <slug> --lyrics "..."`
- `kvd lyrics update --slug <slug> --file ./lyrics.txt`
- `kvd lyrics update --slug <slug> --clear`

## NPM shortcuts

```bash
npm run build
npm run dev
npm run help
npm run download -- --search "bruno"
```

## Notes

- `kvd mix` requires `ffmpeg` in your PATH.
- `kvd mix` key transposition requires `ffmpeg` built with `librubberband` support.
- `kvd download` and import commands operate on your Azure-hosted data.
- `kvd catalog purchases`, `kvd track import`, and related import commands perform browser automation against karaoke-version.com using stored account credentials.
