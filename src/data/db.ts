import sql from 'mssql';
import { logDebug, logError } from '../lib/logger';
import { TrackRepository } from './repositories/track';
import { StemRepository } from './repositories/stem';
import { MixRepository } from './repositories/mix';
import KvdConfiguration from '../config';

let pool: sql.ConnectionPool | null = null;

const config: sql.config = {
  server: KvdConfiguration.azure.sql.server,
  database: KvdConfiguration.azure.sql.database,
  options: {
    encrypt: true,
    enableArithAbort: true
  },
  authentication: {
    type: 'azure-active-directory-default',
    options: {}
  }
}

async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool) {
    return pool;
  }

  try {
    pool = await sql.connect(config);
    logDebug('Connected to database');
  } catch (err) {
    logError('Error connecting to database');
    throw err;
  }

  return pool;
}

async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close();
    logDebug('Closed database connection');
    pool = null;
  }
}

const db = {
  tracks: new TrackRepository(getConnection),
  stems: new StemRepository(getConnection),
  mixes: new MixRepository(getConnection),
  close: closeConnection
};

export default db;