import { App, BlockButtonAction } from "@slack/bolt";
import { search } from "../../../lib/search";
import { SpreadsheetClient } from "../../../lib/spreadsheetClient";
import * as functions from "firebase-functions";
import { searchResultBlock } from "../blocks/searchResultBlock";

const config = functions.config();

export const useSearchAction = (app: App) => {
  app.action<BlockButtonAction>(
    /search_\d/,
    async ({ ack, client, body, action, logger }) => {
      try {
        await ack();
        // スプレッドシートからデータを検索
        const spreadsheetClient = await SpreadsheetClient.build();
        const searchItems = await spreadsheetClient.getValues(config.sheet.id);
        const searchResult = search(searchItems, action.value);

        await client.chat.postMessage({
          channel: body.channel!.id,
          blocks: searchResultBlock(searchResult),
        });
      } catch (e) {
        logger.error(e);
      }
    }
  );
};
