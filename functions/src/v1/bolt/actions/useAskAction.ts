import { App, BlockButtonAction } from "@slack/bolt";
import * as functions from "firebase-functions";
import { askBlock, askCompleteBlock } from "../blocks/askBlock";
import { errorBlock } from "../blocks/errorBlock";
import { fetchChannelName } from "../../../lib/utils";

const config = functions.config();

export const useAskAction = (app: App) => {
  app.action<BlockButtonAction>(
    "ask",
    async ({ ack, client, action, body, logger }) => {
      const channelId = body.channel!.id;
      try {
        await ack();
        await client.chat.postMessage({
          channel: config.slack.ask_channel_id,
          blocks: askBlock(action.value),
        });

        const askChannelName = await fetchChannelName(
          client,
          config.slack.ask_channel_id
        );
        await client.chat.postMessage({
          channel: channelId,
          blocks: askCompleteBlock(action.value, askChannelName),
          link_names: true,
        });
      } catch (e) {
        logger.error(e);
        await client.chat.postMessage({
          channel: channelId,
          blocks: errorBlock(),
          link_names: true,
        });
      }
    }
  );
};
