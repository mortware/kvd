export type SongInfo = {
    artist: string;
    title: string;
    url: string;
    tempo: number;
    tempoVariable: boolean;
    duration: string;
    key: string;
    source: string;
    slug: string;
    stems?: {
        index: number;
        name: string;
        slug: string;
        color: string;
    }[];
    mixes?: {
        id: string;
        name: string;
        slug: string;
    }[];
}

export type Track = {
    Id: string;
    Artist: string;
    Title: string;
    SourceUrl: string;
    SourceUser: string;
    Tempo: number;
    TempoVariable: boolean;
    Duration: string;
    SongKey: string;
    Slug: string;
    Stems: Stem[];
    Mixes: Mix[];
}

export type Stem = {
    Id: string;
    TrackId: string;
    Name: string;
    Slug: string;
    Color: string;
    Filename: string;
    Order: number;
}

export type Mix = {
    Id: string;
    TrackId: string;
    Name: string;
    Slug: string;
    Filename: string;
}

export type Config = {
    baseUrl: string;
    loginUrl: string;
    username: string;
    password: string;
    downloadPath: string;
    tracks: string[];
}

export type UploadResult = {
    total: number;
    databaseInserts: number;
    filesUploaded: number;
    filesSkipped: number;
    errors: UploadError[];
    details: {
        uploaded: UploadDetail[];
        inserted: UploadDetail[];
        skipped: UploadDetail[];
    };
}

export type UploadError = {
    type: 'file' | 'database';
    item: string;
    message: string;
}

export type UploadDetail = {
    type: 'stem' | 'mix';
    name: string;
    slug: string;
    filename?: string;
    reason?: string;
}
