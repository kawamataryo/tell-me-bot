export const REGION = "asia-northeast1";

export const FUSE_OPTIONS = {
    threshold: 0.4,
    useExtendedSearch: true,
    distance: 300,
    shouldSort: true,
    keys: [
      {
        name: "word",
        weight: 0.4,
      },
      {
        name: "description",
        weight: 0.3,
      }
    ],
}
