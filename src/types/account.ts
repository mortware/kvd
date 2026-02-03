export type CatalogCache = {
  fetchedAt: Date;
  tracks: {
    sourceId: string;
    slug: string;
    artist: string;
    title: string;
    sourceUrl: string;
  }[];
};

export type Account = {
  id: string;
  name?: string;
  username: string;
  password: string;
  created: Date;
  updated?: Date;
  catalog?: CatalogCache;
}