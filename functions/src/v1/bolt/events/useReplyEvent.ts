import { App } from "@slack/bolt";
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import * as functions from "firebase-functions";
import { CHAT_GPT_SYSTEM_PROMPT, GPT_BOT_NAME } from "../../../lib/constants";

const config = functions.config();

const postAsGptBot = async ({
  client,
  channel,
  threadTs,
  text,
}: {
  client: any;
  channel: string;
  threadTs: string;
  text: string;
}) => {
  return await client.chat.postMessage({
    channel,
    thread_ts: threadTs,
    icon_emoji: ":robot_face:",
    username: GPT_BOT_NAME,
    text,
  });
}


export const useReplyEvent = (app: App) => {
  app.event("message", async ({ event, client, logger }) => {
    const { thread_ts: threadTs, bot_id: botId, text } = event as any;
    // botの返信またはスレッドのメッセージでなければ何もしない
    if (botId || !threadTs) {
      return;
    }

    // スレッドのメッセージを取得
    const threadMessagesResponse = await client.conversations.replies({
      channel: event.channel,
      ts: threadTs,
    });
    const messages = threadMessagesResponse.messages?.sort(
      (a, b) => Number(a.ts) - Number(b.ts)
    );

    // GPT Botへの返信でなければ何もしない
    if (!(messages![0].text?.includes(GPT_BOT_NAME) && messages![0].bot_id)) {
      return
    }

    try {
      // OpenAIのレスポンスは時間がかかる場合が多いので、仮のメッセージを投稿する
      const thinkingMessageResponse = await postAsGptBot({
        client,
        channel: event.channel,
        threadTs,
        text: "...",
      });

      // tokenの制限を回避するため、最初のメッセージを除いた最大12件のメッセージで区切る
      const prevMessages =
        messages!.slice(1).slice(-12).map(m => {
          const role = m.bot_id ? ChatCompletionRequestMessageRoleEnum.Assistant : ChatCompletionRequestMessageRoleEnum.User
          return {role: role, content: m.text as string}
        })

      const configuration = new Configuration({
        apiKey: config.openai.key,
      });
      const openAIClient = new OpenAIApi(configuration);

      const response = await openAIClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {role: ChatCompletionRequestMessageRoleEnum.System, content: CHAT_GPT_SYSTEM_PROMPT},
          ...prevMessages,
          {role: ChatCompletionRequestMessageRoleEnum.User, content: text as string}
        ],
        top_p: 0.5,
        frequency_penalty: 0.5,
      })
      const message = response.data.choices[0].message?.content || "";

      // 仮のメッセージを削除する
      await client.chat.delete({
        channel: event.channel,
        ts: thinkingMessageResponse.ts!,
      });

      // 回答メッセージを投稿する
      if (message) {
        await postAsGptBot({
          client,
          channel: event.channel,
          threadTs,
          text: message,
        });
      } else {
        throw new Error("message is empty");
      }
    } catch (e) {
      logger.error(e);
      await postAsGptBot({
        client,
        channel: event.channel,
        threadTs,
        text: "大変申し訳ございません。エラーです。別スレッドでやり直してください。",
      });
    }
  });
};
