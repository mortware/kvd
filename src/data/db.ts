import sql from 'mssql';
import { logDebug, logError } from '../lib/logger';
import { TrackRepository } from './repositories/track';
import { StemRepository } from './repositories/stem';
import { MixRepository } from './repositories/mix';

let pool: sql.ConnectionPool | null = null;

const config: sql.config = {
  server: process.env.DB_SERVER as string,
  database: process.env.DB_NAME as string,
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
  mixes: new MixRepository(getConnection), // Add this line
  close: closeConnection
};

export default db;