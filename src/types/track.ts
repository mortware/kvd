export type AssetImportStatus = 'pending' | 'imported' | 'missing' | 'error';
export type TrackImportStatus = 'pending' | 'partial' | 'complete' | 'error';

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
  lyrics?: string;        // Plain text lyrics
  created: Date;
  updated?: Date;
  status?: TrackImportStatus;
  lastImport?: Date;
  fullMix?: Mix;
  stems?: Stem[];
  mixes?: Mix[];
}

export type Stem = {
  color: string;
  order: number;
  status?: AssetImportStatus;
} & TrackItem

export type Mix = {
  status?: AssetImportStatus;
} & TrackItem

export type TrackItem = {
  name: string;
  slug: string;
}
