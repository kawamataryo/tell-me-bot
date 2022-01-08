import { Block, KnownBlock } from "@slack/bolt";

export const addItemModalBlock = (): (Block | KnownBlock)[] => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "気軽に追加してね。間違っていたら誰かが修正してくれるはず。",
      },
    },
    {
      type: "input",
      block_id: "word",
      label: {
        type: "plain_text",
        text: "用語",
      },
      element: {
        type: "plain_text_input",
        action_id: "word_input",
      },
    },
    {
      type: "input",
      block_id: "description",
      label: {
        type: "plain_text",
        text: "説明",
      },
      element: {
        type: "plain_text_input",
        action_id: "description_input",
        multiline: true,
      },
    },
  ];
};
