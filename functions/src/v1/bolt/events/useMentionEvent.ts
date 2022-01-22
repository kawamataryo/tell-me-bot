import { App } from "@slack/bolt";
import { search } from "../../../lib/search";
import { extractMessageFromText } from "../../../lib/utils";
import { SpreadsheetClient } from "../../../lib/spreadsheetClient";
import * as functions from "firebase-functions";
import { searchResultBlock } from "../blocks/searchResultBlock";

const config = functions.config();

export const useMentionEvent = (app: App) => {
  app.event("app_mention", async ({ event, client, logger }) => {
    try {
      const spreadsheetClient = await SpreadsheetClient.build();
      const searchItems = await spreadsheetClient.getValues(config.sheet.id);
      const searchResult = search(
        searchItems,
        extractMessageFromText(event.text)
      );

      await client.chat.postMessage({
        channel: event.channel,
        blocks: searchResultBlock(searchResult),
      });
    } catch (e) {
      logger.error(e);
    }
  });
};
