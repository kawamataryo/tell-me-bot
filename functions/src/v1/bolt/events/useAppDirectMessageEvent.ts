import { App } from "@slack/bolt";
import { SpreadsheetClient } from "../../../lib/spreadsheetClient";
import { search } from "../../../lib/search";
import { extractMessageFromText, isMentionMessage } from "../../../lib/utils";
import { searchResultBlock } from "../blocks/searchResultBlock";

import * as functions from "firebase-functions";

const config = functions.config();
export const useAppDirectMessageEvent = (app: App) => {
  app.event("message", async ({ event, logger, client }) => {
    try {
      if (event.channel_type === "im") {
        const text = (event as any).text;
        const spreadsheetClient = await SpreadsheetClient.build();
        const searchItems = await spreadsheetClient.getValues(config.sheet.id);
        const searchText = isMentionMessage(text)
          ? extractMessageFromText(text)
          : text;
        const searchResult = search(searchItems, searchText);

        await client.chat.postMessage({
          channel: event.channel,
          blocks: searchResultBlock(searchResult),
        });
      }
    } catch (e) {
      logger.error(e);
    }
  });
};
