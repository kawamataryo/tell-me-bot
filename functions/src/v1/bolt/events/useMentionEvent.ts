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

      // スレッドで返したいためスレッドの情報を取得する
      const conversations = await client.conversations.replies({
        channel: event.channel,
        ts: event.event_ts,
      });

      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: conversations.messages![0].thread_ts,
        blocks: searchResultBlock(searchResult),
      });
    } catch (e) {
      logger.error(e);
    }
  });
};
