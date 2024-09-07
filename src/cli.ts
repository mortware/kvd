#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { catalogCommand } from './commands/catalog.js';
import { downloadCommand } from './commands/download.js';
import { checkCommand } from './commands/check.js';
import db from './data/db.js';
import { logError } from './lib/logger.js';
import { uploadCommand } from './commands/upload.js';
import { importCommand } from './commands/import.js';

yargs(hideBin(process.argv))
  .scriptName("kvd")
  .usage("Usage: $0 <command> [options]")
  .command(catalogCommand)
  .command(downloadCommand)
  .command(checkCommand)
  .command(uploadCommand)
  .command(importCommand)
  .command("$0", "Default command", () => { }, (argv) => {
    yargs.showHelp();
  })
  .help().alias('help', 'h')
  .parse();

function handleExit() {
  console.log("Exiting...");
  db.close().then(() => {
    process.exit(0);
  }).catch((error) => {
    logError(`Error closing database connection: ${error}`);
    process.exit(1);
  });
}

// Set up process signal listeners for graceful shutdown
process.on('SIGINT', handleExit); // Handle Ctrl+C
process.on('SIGTERM', handleExit); // Handle termination signals




