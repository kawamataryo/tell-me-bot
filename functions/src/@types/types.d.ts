type SearchItem = {
  word: string;
  description: string;
};
type SearchResult = {
  isExactMatch: boolean;
  searchItems: SearchItem[];
};
