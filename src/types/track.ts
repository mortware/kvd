export type SyncStatus = 'pending' | 'synced' | 'missing' | 'error';
export type TrackSyncStatus = 'pending' | 'partial' | 'complete' | 'error';

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
  status?: TrackSyncStatus;
  lastSync?: Date;
  fullMix?: Mix;
  stems?: Stem[];
  mixes?: Mix[];
}

export type Stem = {
  color: string;
  order: number;
  status?: SyncStatus;
} & TrackItem

export type Mix = {
  status?: SyncStatus;
} & TrackItem

export type TrackItem = {
  name: string;
  slug: string;
}
