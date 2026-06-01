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
- `kvd mix` : Create WAV backing/click files from imported stems with `ffmpeg`.

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
- Ensures selected stem MP3s and click MP3 are cached under `downloads/<track-slug>/`.
- Writes final WAV outputs under `mixes/<track-slug>/`:
  - `<track-slug>-backing.wav` (selected stems mixed)
  - `<track-slug>-click.wav` (click track only)
- By default, mutes the first bar in the backing WAV (count-in suppression).
- Leaves the click WAV unmodified (no first-bar mute).
- Validates that backing and click WAV durations match and reports pass/fail.

Optional flag:

```bash
kvd track mix --search "bruno" --keep-count-in
```

Use `--keep-count-in` to keep the first-bar count-in audible in the backing WAV.

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
- `kvd download` and import commands operate on your Azure-hosted data.
- `kvd catalog purchases`, `kvd track import`, and related import commands perform browser automation against karaoke-version.com using stored account credentials.
