import sql from 'mssql';
import { v4 as uuidv4 } from "uuid";
import { Track } from '../../lib/models';
import { slugify } from '../../lib/utils';
import { logInfo, logError } from '../../lib/logger';

export class TrackRepository {
  private getConnection: () => Promise<sql.ConnectionPool>;

  constructor(getConnection: () => Promise<sql.ConnectionPool>) {
    this.getConnection = getConnection;
  }

  async create(artist: string, title: string, url: string, user: string, tempo: number, tempoVariable: boolean, duration: string, key: string): Promise<Track | null> {
    try {
      const db = await this.getConnection();
      const existingTrack = await this.findByArtistAndTitle(title, artist);

      if (existingTrack) {
        logInfo(`Track exists: '${title} by ${artist}'`);
        return existingTrack;
      }

      const trackId = uuidv4();
      const slug = slugify(`${artist}-${title}`);

      await db.request()
        .input("Id", sql.UniqueIdentifier, trackId)
        .input("Artist", sql.NVarChar, artist)
        .input("Title", sql.NVarChar, title)
        .input("SourceUrl", sql.NVarChar, url)
        .input("SourceUser", sql.NVarChar, user)
        .input("Tempo", sql.Float, tempo)
        .input("TempoVariable", sql.Bit, tempoVariable)
        .input("Duration", sql.NVarChar, duration)
        .input("SongKey", sql.NVarChar, key)
        .input("Slug", sql.NVarChar, slug)
        .query(`INSERT INTO Tracks (Id, Artist, Title, SourceUrl, SourceUser, Tempo, TempoVariable, Duration, SongKey, Slug) 
                VALUES (@Id, @Artist, @Title, @SourceUrl, @SourceUser, @Tempo, @TempoVariable, @Duration, @SongKey, @Slug)`);

      logInfo(`Track created: ${title} by ${artist}`);

      // Return the newly created track
      return {
        Id: trackId,
        Artist: artist,
        Title: title,
        SourceUrl: url,
        SourceUser: user,
        Tempo: tempo,
        TempoVariable: tempoVariable,
        Duration: duration,
        SongKey: key,
        Slug: slug,
        Stems: [],
        Mixes: []
      };
    } catch (err) {
      logError('Error creating track');
      throw err;
    }
  }

  async findBySlug(slug: string): Promise<Track | null> {
    const db = await this.getConnection();
    const result = await db.request()
      .input("Slug", sql.NVarChar, slug)
      .query<Track>(`SELECT TOP 1 * FROM [Tracks] t WHERE t.[Slug] = @Slug`);

    return result.recordset[0] || null;
  }

  async findByArtistAndTitle(title: string, artist: string): Promise<Track | null> {
    const db = await this.getConnection();
    const result = await db.request()
      .input("Title", sql.NVarChar, title)
      .input("Artist", sql.NVarChar, artist)
      .query<Track>(`SELECT TOP 1 * FROM [Tracks] t WHERE t.[Title] = @Title AND t.[Artist] = @Artist`);

    console.log(result.recordset);

    return result.recordset[0] || null;
  }

  async findByUrl(url: string): Promise<Track | null> {
    const db = await this.getConnection();
    const result = await db.request()
      .input("Url", sql.NVarChar, url)
      .query<Track>(`SELECT TOP 1 * FROM [Tracks] t WHERE t.[SourceUrl] LIKE '%${url}%'`);

    return result.recordset[0] || null;
  }

}