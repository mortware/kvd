#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { logError } from './lib/logger.js';
import { catalogCommand } from './commands/catalog.js';
import { importCommand } from './commands/import.js';
import { migrateCommand } from './commands/migrate.js';
import cosmos from './data/cosmos.js';

yargs(hideBin(process.argv))
  .scriptName("kvd")
  .usage("Usage: $0 <command> [options]")
  .command(catalogCommand) // Catalogs a users account and adds all the tracks their tracks to the database. No files downloaded yet.
  .command(importCommand) // Processes the import queue
  .command(migrateCommand) // Migrates from SQL to Cosmos
  .command("$0", "Default command", () => { }, (argv) => {
    yargs.showHelp();
  })
  .help().alias('help', 'h')
  .parse();

function handleExit() {
  console.log("Exiting...");
  cosmos.close().then(() => {
    process.exit(0);
  }).catch((error) => {
    logError(`Error closing database connection: ${error}`);
    process.exit(1);
  });
}

// Set up process signal listeners for graceful shutdown
process.on('SIGINT', handleExit); // Handle Ctrl+C
process.on('SIGTERM', handleExit); // Handle termination signals


