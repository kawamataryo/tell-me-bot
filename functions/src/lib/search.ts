import Fuse from "fuse.js";
import { FUSE_THRESHOLD } from "./constants";

export const search = (
  searchItems: SearchItem[],
  targetWord = ""
): SearchResult => {
  // perfect match
  const matchItems = searchItems.filter(
    (item) => item.word.toUpperCase() === targetWord.toUpperCase()
  );
  if (matchItems.length) {
    return {
      isExactMatch: true,
      searchItems: matchItems,
    };
  }

  // fuzzy match
  const fuse = new Fuse(searchItems, {
    threshold: FUSE_THRESHOLD,
    keys: ["word", "description"],
  });
  const result = fuse.search(targetWord);
  return {
    isExactMatch: false,
    searchItems: result.map((r) => r.item),
  };
};
