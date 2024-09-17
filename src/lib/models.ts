export type SongInfo = {
    sourceId: string;
    artist: string;
    title: string;
    tempo: number;
    tempoVariable: boolean;
    duration: string;
    key: string;
    slug: string;
    stems?: {
        index: number;
        name: string;
        slug: string;
        color: string;
        order: number;
    }[];
    mixes?: {
        id: string;
        name: string;
        slug: string;
    }[];
}

export type Track = {
    id: string;
    artist: string;
    title: string;
    slug: string;
    source: {
        url: string;
        users: string[];
        id: string;
    },
    tempo: {
        bpm: number;
        variable: boolean;
    };
    duration: string;
    songKey: string;
    created: Date;
    updated?: Date;
    fullMix?: Mix;
    stems?: Stem[];
    mixes?: Mix[];
}

export type Stem = {
    color: string;
    order: number;
} & TrackItem

export type Mix = {
} & TrackItem

export type TrackItem = {
    name: string;
    slug: string;
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

export type Account = {
    id: string;
    username: string;
    password: string;
    created: Date;
    updated?: Date;
}

export type ImportRequest = {
    import: 'all' | 'mixes' | 'stems' | 'full-mix';
    url: string;
    users: string[];
}