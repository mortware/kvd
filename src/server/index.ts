#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  listAccounts,
  getStoredTracks,
  getPurchases,
  compareCatalog,
  syncTrack,
  syncIncomplete,
  getSyncStatus,
  refreshStatus,
} from "../tools";
import db from "../data/db";

const server = new McpServer({
  name: "kvd",
  version: "0.0.1",
});

// Helper to wrap tool handlers with error handling and db cleanup
function wrapTool<T>(fn: () => Promise<T>, format: (result: T) => string) {
  return async () => {
    try {
      const result = await fn();
      return { content: [{ type: "text" as const, text: format(result) }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
    } finally {
      await db.close();
    }
  };
}

server.registerTool(
  "list_accounts",
  {
    description: "Lists all stored karaoke-version.com accounts.",
    inputSchema: {},
  },
  wrapTool(
    () => listAccounts(),
    (accounts) => `Found ${accounts.length} accounts:\n${JSON.stringify(accounts, null, 2)}`
  )
);

server.registerTool(
  "get_purchases",
  {
    description: "Scrapes the user's purchased tracks from karaoke-version.com. Uses cached catalog if < 24h old unless skipCache is true.",
    inputSchema: { 
      username: z.string().describe("The karaoke-version.com username"),
      skipCache: z.boolean().optional().describe("Force refresh from website (default: false)")
    },
  },
  async ({ username, skipCache }) => wrapTool(
    () => getPurchases({ username, skipCache }),
    (result) => {
      const header = result.cached 
        ? `📦 Cached catalog (${result.cacheAgeHours}h old, fetched ${result.fetchedAt.toISOString()})`
        : `✨ Fresh catalog (fetched ${result.fetchedAt.toISOString()})`;
      return `${header}\n\nFound ${result.tracks.length} tracks:\n${JSON.stringify(result.tracks, null, 2)}`;
    }
  )()
);

server.registerTool(
  "get_stored_tracks",
  {
    description: "Lists tracks stored in the database for a user.",
    inputSchema: { username: z.string().describe("The username to list tracks for") },
  },
  async ({ username }) => wrapTool(
    () => getStoredTracks(username),
    (tracks) => `Found ${tracks.length} tracks:\n${JSON.stringify(tracks, null, 2)}`
  )()
);

server.registerTool(
  "compare_catalog",
  {
    description: "Compares purchased tracks on website with database. Shows what's missing.",
    inputSchema: { username: z.string().describe("The karaoke-version.com username") },
  },
  async ({ username }) => wrapTool(
    () => compareCatalog(username),
    (c) => `Catalog comparison:\n- In both: ${c.inBoth.length}\n- Only on website: ${c.onlyOnWebsite.length}\n- Only in database: ${c.onlyInDatabase.length}\n\nMissing:\n${JSON.stringify(c.onlyOnWebsite, null, 2)}`
  )()
);

server.registerTool(
  "sync_track",
  {
    description: "Syncs a single track by downloading missing stems/mixes to blob storage.",
    inputSchema: { slug: z.string().describe("The track slug to sync") },
  },
  async ({ slug }) => wrapTool(
    () => syncTrack(slug),
    (r) => `Sync '${slug}': ${r.status}\nFull mix: ${r.fullMix}\nStems: ${r.stems.map(s => `${s.slug}:${s.status}`).join(', ')}\nMixes: ${r.mixes.map(m => `${m.slug}:${m.status}`).join(', ')}${r.errors.length ? `\nErrors: ${r.errors.join(', ')}` : ''}`
  )()
);

server.registerTool(
  "sync_incomplete",
  {
    description: "Syncs all incomplete tracks for a user.",
    inputSchema: { username: z.string().describe("The karaoke-version.com username") },
  },
  async ({ username }) => wrapTool(
    () => syncIncomplete(username),
    (r) => `Sync incomplete: ${r.synced}/${r.totalIncomplete} synced, ${r.failed} failed\n${r.results.map(t => `  ${t.slug}: ${t.status}`).join('\n')}`
  )()
);

server.registerTool(
  "get_sync_status",
  {
    description: "Shows sync status summary for a user.",
    inputSchema: { username: z.string().describe("The username to get status for") },
  },
  async ({ username }) => wrapTool(
    () => getSyncStatus(username),
    (s) => `Sync status: ${s.complete}/${s.totalTracks} complete (${s.percentComplete}%)\nPartial: ${s.partial}, Pending: ${s.pending}, Error: ${s.error}`
  )()
);

server.registerTool(
  "refresh_status",
  {
    description: "Checks blob storage and updates status fields in database.",
    inputSchema: { username: z.string().describe("The username to refresh status for") },
  },
  async ({ username }) => wrapTool(
    () => refreshStatus(username),
    (r) => `Refresh complete: ${r.tracksUpdated}/${r.tracksProcessed} updated${r.errors.length ? `\nErrors: ${r.errors.join(', ')}` : ''}`
  )()
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
