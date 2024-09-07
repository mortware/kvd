import sql from 'mssql';
import { v4 as uuidv4 } from "uuid";
import { logInfo } from '../../lib/logger';
import { Mix } from '../../lib/models';

export class MixRepository {
  private getConnection: () => Promise<sql.ConnectionPool>;

  constructor(getConnection: () => Promise<sql.ConnectionPool>) {
    this.getConnection = getConnection;
  }

  async create(trackId: string, name: string, slug: string, filename: string): Promise<void> {
    const db = await this.getConnection();
    const existingMix = await this.find(slug, trackId);

    if (existingMix) {
      logInfo(`Mix '${name}' for track '${trackId}' already exists.`);
      return;
    }

    await db.request()
      .input("Id", sql.UniqueIdentifier, uuidv4())
      .input("TrackId", sql.UniqueIdentifier, trackId)
      .input("Name", sql.NVarChar, name)
      .input("Slug", sql.NVarChar, slug)
      .input("Filename", sql.NVarChar, filename)
      .query(`
        INSERT INTO Mixes (Id, TrackId, Name, Slug, Filename)
        VALUES (@Id, @TrackId, @Name, @Slug, @Filename)
      `);

    logInfo(`Inserted new mix '${name}' for track '${trackId}' into the database.`);
  }

  async find(slug: string, trackId: string): Promise<Mix | null> {
    const db = await this.getConnection();
    const result = await db.request()
      .input("Slug", sql.NVarChar, slug)
      .input("TrackId", sql.UniqueIdentifier, trackId)
      .query<Mix>(`SELECT * FROM Mixes WHERE Slug = @Slug AND TrackId = @TrackId`);

    return result.recordset[0] || null;
  }
}
