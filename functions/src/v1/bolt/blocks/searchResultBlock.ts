import { Block, KnownBlock } from "@slack/bolt";
import * as functions from "firebase-functions";
import { randomIcon } from "../../../lib/utils";

const config = functions.config();

export const searchResultBlock = (
  searchResult: SearchResult
): (Block | KnownBlock)[] => {
  const searchItems = searchResult.searchItems;

  // perfect match case
  if (searchResult.isExactMatch) {
    const searchItem = searchItems[0];
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "おっけ〜。これだよ！",
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
  }

  // fuzzy match case
  if (searchResult.searchItems.length) {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "関係ありそうな用語が見つかったヨ！",
        },
      },
      {
        type: "actions",
        elements: [
          ...searchItems.slice(0, 4).map((item, i) => ({
            type: "button",
            text: {
              type: "plain_text",
              text: item.word,
              emoji: true,
            },
            value: item.word,
            action_id: `search_${i}`,
          })),
        ],
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "もし新しい用語の場合は、こちらで対応してね。",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "用語を追加する",
              emoji: true,
            },
            action_id: "show_add_item_modal",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `スプレッドシートを直接開く場合は<https://docs.google.com/spreadsheets/d/${config.sheet.id}|こちら>`,
          },
        ],
      },
      {
        type: "divider",
      },
    ];
  }

  // unmatch case
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "ごめ〜ん... 見つからなかった...",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "新しい用語だと思うから追加してね",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "用語を追加する",
            emoji: true,
          },
          action_id: "show_add_item_modal",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `スプレッドシートを直接開く場合は<https://docs.google.com/spreadsheets/d/${config.sheet.id}|こちら>`,
        },
      ],
    },
    {
      type: "divider",
    },
  ];
};
