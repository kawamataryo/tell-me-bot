import { App } from "@slack/bolt";
import { SpreadsheetClient } from "../../../lib/spreadsheetClient";
import { search } from "../../../lib/search";
import {
  extractMessageFromText,
  fetchChannelName,
  isMentionMessage,
} from "../../../lib/utils";
import { searchResultBlock } from "../blocks/searchResultBlock";

import * as functions from "firebase-functions";
import { errorBlock } from "../blocks/errorBlock";

const config = functions.config();
export const useAppDirectMessageEvent = (app: App) => {
  app.event("message", async ({ event, logger, client, say }) => {
    try {
      if (event.channel_type === "im") {
        const text = (event as any).text;
        const spreadsheetClient = await SpreadsheetClient.build();
        const searchItems = await spreadsheetClient.getValues(config.sheet.id);
        const searchWord = isMentionMessage(text)
          ? extractMessageFromText(text)
          : text;
        const searchResult = search(searchItems, searchWord);

        const askChannelName = await fetchChannelName(
          client,
          config.slack.ask_channel_id
        );
        await client.chat.postMessage({
          channel: event.channel,
          blocks: searchResultBlock({
            searchResult,
            searchWord,
            askChannelName,
          }),
        });
        return
      }
    } catch (e) {
      logger.error(e);
      await client.chat.postMessage({
        channel: event.channel,
        blocks: errorBlock(),
      });
    }
  });
};
