import { App, BlockButtonAction } from "@slack/bolt";
import { search } from "../../../lib/search";
import { SpreadsheetClient } from "../../../lib/spreadsheetClient";
import * as functions from "firebase-functions";
import { searchResultBlock } from "../blocks/searchResultBlock";
import { errorBlock } from "../blocks/errorBlock";
import { fetchChannelName } from "../../../lib/utils";

const config = functions.config();

export const useSearchAction = (app: App) => {
  app.action<BlockButtonAction>(
    /search_\d/,
    async ({ ack, client, body, action, logger }) => {
      const channelId = body.channel!.id;
      try {
        await ack();
        // スプレッドシートからデータを検索
        const spreadsheetClient = await SpreadsheetClient.build();
        const searchItems = await spreadsheetClient.getValues(config.sheet.id);
        const searchResult = search(searchItems, action.value);

        const askChannelName = await fetchChannelName(client, channelId);
        await client.chat.postMessage({
          channel: channelId,
          blocks: searchResultBlock({
            searchResult,
            searchWord: action.value,
            askChannelName,
          }),
        });
      } catch (e) {
        logger.error(e);
        await client.chat.postMessage({
          channel: channelId,
          blocks: errorBlock(),
        });
      }
    }
  );
};
