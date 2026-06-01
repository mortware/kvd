# CLI Architecture

This project follows a feature-first CLI architecture.

## Folder Structure

- src/cli.ts: thin bootstrap (error handling, parse lifecycle, shutdown).
- src/commands/: command registration modules and shared CLI utilities.
- src/features/: Domain features with service modules and feature barrels.
- src/data/: Infrastructure clients (CosmosDB and Blob).
- src/browser/: Playwright page objects for karaoke-version flows.
- src/lib/: Shared runtime utilities (logging, automation lifecycle, helpers).
- src/types/: Domain and persistence types.

## Feature Pattern

Each feature is structured as:

- src/features/{feature}/services/*.ts: focused use-case functions.
- src/features/{feature}/index.ts: explicit feature exports.

Current features:

- accounts: account CRUD and listing.
- catalog: purchase retrieval and catalog comparisons.
- tracks: track queries, import orchestration, and import status refresh.
- lyrics: lyrics fetch and persistence updates.

## CLI Coding Pattern

Use thin command handlers in src/commands/*:

- Parse and validate arguments close to command definitions.
- Delegate business logic to feature services.
- Keep command handlers focused on UX concerns:
  - prompt/interactive decisions
  - formatting and output
  - mapping runtime flags to service arguments

## Service Coding Rules

- One service file should own one use-case.
- Services should avoid CLI concerns (prompts, table rendering, ANSI formatting).
- Services can compose other services across features through explicit imports.
- Prefer explicit return types for service functions.
- Keep infrastructure calls behind src/data and src/browser modules.

## Export Surface

- src/features/index.ts is the primary application export barrel.
- src/index.ts re-exports src/features for library consumers.
- Avoid creating catch-all utility buckets like a generic tools folder.

## Refactor Guidance

When adding new behavior:

1. Pick the target feature or add a new feature folder.
2. Add/update a service in that feature.
3. Export through the feature index.
4. Wire command behavior in src/commands/* and compose in src/commands/program.ts.
5. Keep tests and future test harnesses aligned to service boundaries.
