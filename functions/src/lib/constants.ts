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

export const CHAT_START_MESSAGES = ["chatしたい", "チャットしたい", "ちゃっとしたい", "話したい", "chat", "ちゃっと", "チャット", "ちゃとしたい"]

export const CHAT_GPT_SYSTEM_PROMPT = `
You are an excellent AI assistant Slack Bot.
Please output your response message according to following format.

- bold: "*bold*"
- italic: "_italic_"
- strikethrough: "~strikethrough~"
- code: " \`code\` "
- link: "<https://slack.com|link text>"
- block: "\`\`\` code block \`\`\`"
- bulleted list: "* item1"

Be sure to include a space before and after the single quote in the sentence.
ex) word\`code\`word -> word \`code\` word

Let's begin.
`
