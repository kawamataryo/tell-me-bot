import { App } from "@slack/bolt";
import { search } from "../../../lib/search";
import { extractMessageFromText, fetchChannelName } from "../../../lib/utils";
import { SpreadsheetClient } from "../../../lib/spreadsheetClient";
import * as functions from "firebase-functions";
import { searchResultBlock } from "../blocks/searchResultBlock";
import { errorBlock } from "../blocks/errorBlock";

const config = functions.config();

export const useMentionEvent = (app: App) => {
  app.event("app_mention", async ({ event, client, logger }) => {
    try {
      const spreadsheetClient = await SpreadsheetClient.build();
      const searchItems = await spreadsheetClient.getValues(config.sheet.id);
      const searchWord = extractMessageFromText(event.text);

      const searchResult = search(searchItems, searchWord);

      const askChannelName = await fetchChannelName(
        client,
        config.slack.ask_channel_id
      );
      await client.chat.postMessage({
        channel: event.channel,
        blocks: searchResultBlock({ searchResult, searchWord, askChannelName }),
      });
    } catch (e) {
      logger.error(e);
      await client.chat.postMessage({
        channel: event.channel,
        blocks: errorBlock(),
      });
    }
  });
};
