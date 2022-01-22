import { Block, KnownBlock } from "@slack/bolt";

export const errorBlock = (): (Block | KnownBlock)[] => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "ごめーん..なんかエラーっぽい..。 Slack管理者に確認してね",
      },
    },
    {
      type: "divider",
    },
  ];
};
