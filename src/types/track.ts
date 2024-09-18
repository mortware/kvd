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
