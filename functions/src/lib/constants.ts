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


export const GPT_BOT_NAME = "Paccho GPT";

export const CHAT_START_MESSAGES = ["chatしたい", "チャットしたい", "ちゃっとしたい", "話したい", "chat", "ちゃっと", "チャット"]
