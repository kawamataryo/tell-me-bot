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

        // スレッドで返したいためスレッドの情報を取得する
        const conversations = await client.conversations.replies({
          channel: body.channel!.id,
          ts: body.message!.ts,
        });

        await client.chat.postMessage({
          channel: body.channel!.id,
          thread_ts: conversations.messages![0].thread_ts,
          blocks: searchResultBlock(searchResult),
        });
      } catch (e) {
        logger.error(e);
      }
    }
  );
};
