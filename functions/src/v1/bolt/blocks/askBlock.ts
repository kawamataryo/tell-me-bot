import { Block, KnownBlock } from "@slack/bolt";

export const askBlock = (targetWord: string): (Block | KnownBlock)[] => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "この用語を聞かれたけどわからなかった〜。誰か用語の説明を追加して〜。",
      },
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: targetWord,
        emoji: true,
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
      type: "divider",
    },
  ];
};

export const askCompleteBlock = (
  targetWord: string,
  channelName = "質問チャネル"
): (Block | KnownBlock)[] => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `おっけ〜。「${targetWord}」について #${channelName} で質問したよー`,
      },
    },
  ];
};
