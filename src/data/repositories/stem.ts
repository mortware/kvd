import sql from 'mssql';
import { v4 as uuidv4 } from "uuid";
import { logInfo } from '../../lib/logger';
import { Stem } from '../../lib/models';

export class StemRepository {
  private getConnection: () => Promise<sql.ConnectionPool>;

  constructor(getConnection: () => Promise<sql.ConnectionPool>) {
    this.getConnection = getConnection;
  }

  async create(trackId: string, name: string, slug: string, color: string, filename: string, order: number): Promise<void> {
    if (!trackId) {
      throw new Error('TrackId cannot be null or undefined');
    }

    const db = await this.getConnection();
    const existingStem = await this.find(slug, trackId);

    if (existingStem) {
      logInfo(`Stem '${name}' for track '${trackId}' already exists.`);
      return;
    }

    await db.request()
      .input("Id", sql.UniqueIdentifier, uuidv4())
      .input("TrackId", sql.UniqueIdentifier, trackId)
      .input("Name", sql.NVarChar, name)
      .input("Slug", sql.NVarChar, slug)
      .input("Color", sql.NVarChar, color)
      .input("Filename", sql.NVarChar, filename)
      .input("Order", sql.Int, order)
      .query(`
        INSERT INTO Stems (Id, TrackId, Name, Slug, Color, Filename, [Order])
        VALUES (@Id, @TrackId, @Name, @Slug, @Color, @Filename, @Order)
      `);

    logInfo(`Inserted new stem '${name}' for track '${trackId}' into the database.`);
  }

  async find(slug: string, trackId: string): Promise<Stem | null> {
    const db = await this.getConnection();
    const result = await db.request()
      .input("Slug", sql.NVarChar, slug)
      .input("TrackId", sql.UniqueIdentifier, trackId)
      .query<Stem>(`SELECT * FROM Stems WHERE Slug = @Slug AND TrackId = @TrackId`);

    return result.recordset[0] || null;
  }
}
