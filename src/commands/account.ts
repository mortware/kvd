import { CommandModule } from 'yargs';
import db from '../data/db';
import { Account } from '../types';
import { logError, logInfo, logWarning } from '../lib/logger';

export const accountCommand: CommandModule = {
  command: 'account <action>',
  describe: 'Manage accounts',
  builder: (yargs) => {
    return yargs
      .command({
        command: 'add',
        describe: 'Add a new account',
        builder: {
          u: {
            alias: 'username',
            describe: 'Username for the account',
            type: 'string',
            demandOption: true,
          },
          p: {
            alias: 'password',
            describe: 'Password for the account',
            type: 'string',
            demandOption: true,
          },
        },
        handler: async (argv) => {
          try {
            const account = {
              username: argv.username,
              password: argv.password,
            }
            await db.accounts.create(account);

            logInfo(`Account '${account.username}' created successfully.`);
          } catch (error) {
            logError(`Error creating account: ${error}`);
          }
        },
      })
      .command({
        command: 'query',
        describe: 'Query account information',
        builder: {
          u: {
            alias: 'username',
            describe: 'Username to query',
            type: 'string',
            demandOption: true,
          },
        },
        handler: async (argv) => {
          try {
            const account = await db.accounts.find(argv.username);
            if (!account) {
              logWarning(`Account '${argv.username}' not found.`);
              return;
            }
            logInfo(`Account '${account.username}' found.`);
            console.log(account);
          } catch (error) {
            logError(`Error querying account: ${error}`);
          }
        },
      });
  },
  handler: (argv) => {
    // This handler is not needed as we have subcommand handlers
  },
};