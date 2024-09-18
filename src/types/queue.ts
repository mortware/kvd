
export type ImportRequest = {
  import: 'all' | 'mixes' | 'stems' | 'full-mix';
  slug: string;
}