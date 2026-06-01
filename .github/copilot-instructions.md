# Copilot Instructions for @mortware/kvd

## Overview

KVD is a CLI tool and library for managing karaoke track metadata from karaoke-version.com. It uses Playwright for browser automation to catalog user purchases, then stores metadata in Azure CosmosDB and audio files in Azure Blob Storage.

## Build & Run Commands

```bash
npm run build       # Compile TypeScript to dist/
npm run dev         # Watch mode compilation
npm link            # Install CLI globally for local testing
kvd --help          # Show available commands
```

No test suite exists.

## CLI Commands

- `kvd account list|create|import`
- `kvd catalog purchases`
- `kvd track list|get|query|import|import-status|refresh-status|download|mix`
- `kvd download` and `kvd mix` as top-level shortcuts
- `kvd lyrics get|update`

## Architecture

### Data Flow

1. **Catalog**: Playwright reads account purchases from karaoke-version.com and updates account catalog cache.
2. **Track Import**: Per-track import resolves metadata + ownership and updates CosmosDB records.
3. **Asset Import**: Missing/overwrite audio assets are fetched via Playwright and uploaded to Blob Storage.
4. **Download/Mix**: CLI downloads imported assets locally and optionally builds WAV outputs via ffmpeg.

### Key Directories

- `src/commands/` - Commander command modules and shared CLI helpers
- `src/features/` - Domain-oriented services and exports (`accounts`, `catalog`, `tracks`, `lyrics`)
- `src/browser/` - Playwright page objects for karaoke-version.com
- `src/data/` - Azure service clients (CosmosDB, Blob)
- `src/lib/` - Utilities (logger, automation context)
- `src/types/` - TypeScript type definitions

### Configuration

Configuration is loaded from `kvd-config.json` in the working directory:

```json
{
  "azure": {
    "blob": { "url": "...", "container": "..." },
    "cosmos": { "url": "..." }
  },
  "headless": true,
  "processDelay": 0
}
```

Config is validated with Zod at startup (`src/config.ts`).

### Azure Authentication

Uses `DefaultAzureCredential` from `@azure/identity` - authenticate via Azure CLI (`az login`) for local development.

## Code Conventions

### Page Object Pattern

Playwright pages use a factory function pattern returning an object with methods:

```typescript
export default function useLoginPage(page: Page) {
  const usernameInput = page.locator("#frm_login");
  
  async function login(username: string, password: string) {
    await usernameInput.fill(username);
    // ...
  }

  return { navigate, login };
}
```

### Repository Pattern

Database access uses a repository pattern in `src/data/db.ts`:

```typescript
db.tracks.find(slug)    // Find track by slug
db.tracks.create(track) // Create new track
db.accounts.find(user)  // Find account by username
```

### Automation Context

Browser context is managed as a singleton via `src/lib/automation.ts`:

```typescript
const context = await automation.getContext(username, password);
// Use context.page for Playwright operations
await automation.close();
```

### Logging

Use the logger from `src/lib/logger.ts`:

```typescript
import { logInfo, logError, logDebug, logWarning } from './lib/logger';
```

## Dual Export

The package exports both a CLI (`dist/cli.js`) and a library (`dist/index.js`). Public feature APIs are exported from `src/features/index.ts`.
