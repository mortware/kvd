# KVD CLI Requirements

## 1. Purpose

This document defines required behavior for the `kvd` CLI so that future changes remain consistent, testable, and user-focused.

Scope:

- CLI UX and command behavior.
- Data flow contracts across Karaoke Version, Cosmos DB, Blob Storage, and local filesystem.
- Output, error handling, and automation requirements.

Out of scope:

- Internal implementation details unless needed to define CLI behavior.

## 2. Command Model

The canonical entry point is:

```bash
kvd
```

The CLI MUST organize commands by domain:

- `kvd account` for account lifecycle and account-level catalog import.
- `kvd track` for track retrieval, query, and single-track import operations.
- `kvd mix` for local mix generation from private blob-stored assets.

## 3. Domain Terms

- Account: a Karaoke Version user identity stored in Cosmos DB.
- Catalog: purchased tracks associated with an account on Karaoke Version.
- Track: canonical song record stored in Cosmos DB with import metadata.
- Asset: full mix, stem, or play-along mix audio file.
- Import: process that ensures track info is stored in Cosmos DB and assets exist in Blob Storage.

## 4. Functional Requirements

### 4.1 `kvd account`

`kvd account` MUST support:

- Create account credentials/metadata in Cosmos DB.
- List stored accounts.
- Import and validate an account catalog against stored tracks.
- Optional claim of shared tracks (source id already present under other users).
- Optional action phase after validation.

Action phase modes:

- `import-missing`
- `update`
- `overwrite`
- `none`

Behavior requirements:

- If `--username` is omitted, CLI SHOULD provide an interactive account selector.
- Non-interactive sessions MUST NOT block on prompts.
- Import summary MUST include counts for total catalog tracks, complete tracks, tracks requiring import, website-only tracks not imported, and DB-only tracks.

Data contract:

- Account import MUST use Karaoke Version purchases as source-of-truth for ownership.
- Cosmos DB remains source-of-truth for persistent state used by all downstream commands.

### 4.2 `kvd track`

`kvd track` MUST support:

- List tracks for an account.
- Get detailed metadata for a track by slug.
- Query tracks by filters.
- Import one track by slug.

Import behavior requirements:

- `import-missing` MUST create/fill only what is missing.
- `update` MUST refresh metadata and import missing assets.
- `overwrite` MUST refresh metadata and overwrite all assets.

Pagination requirement:

- Pagination beyond 20 results SHOULD be supported in future versions.

Scope boundary:

- Bulk import operations MUST be performed via `kvd account` commands, not `kvd track`.

Query/filter requirements:

- Search text.
- Owner username.
- Import status.
- Lyrics presence.
- Musical key.
- Tempo range.
- Sort field/direction.
- Result limit with enforced max.

Track detail requirements:

- Track detail output MUST include, when available: artist, title, slug, source id and source URL, duration/key/tempo metadata, track import status and per-asset status, and lyrics presence/content indicator.

Asset action requirements:

- From a track-focused workflow, users MUST be able to trigger asset download actions.
- Existing behavior (`kvd track download`) satisfies this requirement.

### 4.3 `kvd mix`

`kvd mix` MUST:

- Build local WAV outputs from selected stems fetched from private Blob Storage.
- Use ffmpeg for rendering.
- Support interactive stem selection (single, list, range, all).
- Optionally export click track WAV when available.
- Avoid destructive overwrite without explicit user confirmation.

Output requirements:

- Outputs SHOULD default under `mixes/<slug>/`.
- Backing output naming MUST be deterministic.
- Click output naming MUST be deterministic.

Future requirement:

- `kvd mix` SHOULD support optional upload/registration of generated mixes as new track mixes.

## 5. Cross-Cutting CLI Requirements

### 5.1 UX and Help

- Every command MUST provide `--help` with examples.
- Validation errors MUST be explicit and actionable.
- Prompts SHOULD only appear in TTY mode.
- Commands SHOULD have predictable defaults and documented max limits.

### 5.2 Output Modes

- Human-readable table output SHOULD be default for interactive use.
- Commands SHOULD support machine-readable output mode (`--json`) for scripting.
- Summary lines SHOULD remain stable to reduce parser breakage.

### 5.3 Exit Codes

- `0` for successful completion.
- Non-zero for validation/runtime failures.
- Partial-success flows SHOULD clearly communicate failed items and still return non-zero when critical actions fail.

### 5.4 Safety and Security

- Never print plaintext credentials in logs/output.
- Sanitize user-provided slug/path arguments.
- Fail safely when Azure auth is missing or tenant/subscription mismatches occur.

### 5.5 Determinism and Idempotency

- Read/query operations MUST be side-effect free.
- Repeated import/download operations SHOULD skip already-imported/already-downloaded files unless overwrite options are used.

## 6. Data Source Responsibilities

- Karaoke Version: authoritative source for purchased catalog and downloadable assets.
- Cosmos DB: authoritative source for KVD track/account metadata and import status.
- Blob Storage: authoritative source for imported binary audio assets.
- Local filesystem: user workspace cache/output only.

## 7. Assumption Validation Matrix

1. Account management assumption is valid with one clarification: purchases fetch is under `kvd catalog purchases`, while account-level validation/import is under `kvd account import`.
2. Track command assumption is partially valid: track metadata/query operations exist and requirements now target single-track import via `kvd track`, with bulk import under `kvd account`.
3. Mix command assumption is valid and aligned: local mix generation from private storage is implemented and upload/register of generated mixes is future scope.
4. Query assumption is target-valid with a current implementation gap: filtering/query exists, but interactive select-then-action flow is not fully implemented yet.

## 8. Recommended Near-Term Enhancements

1. Add `--json` mode consistently across command groups.
2. Add explicit non-interactive flags for all prompting commands.
3. Add command examples to help output for top 2-3 common workflows.

## 9. Acceptance Criteria

1. A user can complete account import, single-track import, download, and mix workflows using only documented commands.
2. Query flows support both interactive and scripted modes.
3. All prompting commands behave correctly in TTY and non-TTY contexts.
4. Error handling, exit codes, and output format are consistent across command groups.
5. README references this document as the behavioral source of truth.
