import { App } from "@slack/bolt";
import { search } from "../../../lib/search";
import { extractMessageFromText, fetchChannelName } from "../../../lib/utils";
import { SpreadsheetClient } from "../../../lib/spreadsheetClient";
import * as functions from "firebase-functions";
import { searchResultBlock } from "../blocks/searchResultBlock";
import { errorBlock } from "../blocks/errorBlock";
import { CHAT_START_MESSAGES, GPT_BOT_NAME } from "../../../lib/constants";

const config = functions.config();

export const useMentionEvent = (app: App) => {
  app.event("app_mention", async ({ event, client, logger }) => {
    const searchWord = extractMessageFromText(event.text);

    // OpenAIのAPIキーが設定されていてかつ指定のメッセージが含まれている場合は、GPT Botを呼ぶ
    if(config.openai?.key && CHAT_START_MESSAGES.includes(searchWord) ) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `おっけー！${GPT_BOT_NAME}を呼ぶね！`,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await client.chat.postMessage({
        channel: event.channel,
        icon_emoji: ":robot_face:",
        username: GPT_BOT_NAME,
        text: `${GPT_BOT_NAME}です。\nこのメッセージにリプライして頂ければ何でもお答えします。`,
      });
      return;
    }

    try {
      const spreadsheetClient = await SpreadsheetClient.build();
      const searchItems = await spreadsheetClient.getValues(config.sheet.id);

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
