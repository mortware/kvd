#!/usr/bin/env node
import db from './data/db';
import { logError } from './lib/logger';
import { buildProgram } from './commands/program';

async function main() {
  const program = buildProgram();
  await program.parseAsync(process.argv);
}

main()
  .catch((error) => {
    logError('kvd CLI failed:', (error as Error).message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });