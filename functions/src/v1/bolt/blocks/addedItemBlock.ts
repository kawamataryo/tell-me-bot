import { Block, KnownBlock } from "@slack/bolt";
import * as functions from "firebase-functions";
import { randomIcon } from "../../../lib/utils";

const config = functions.config();

export const addedItemBlock = (
  userId: string,
  searchItem: SearchItem,
): (Block | KnownBlock)[] => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> が新しい用語を登録してくれたよ〜！`,
      },
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${randomIcon()} ${searchItem.word}`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `\`\`\`${searchItem.description}\`\`\``,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `結果を編集する場合は<https://docs.google.com/spreadsheets/d/${config.sheet.id}|こちら>`,
        },
      ],
    },
    {
      type: "divider",
    },
  ];
};
