import { App } from "@slack/bolt";

const MENTION_REGEX = /(?<botName>@.+)>(?<message>[\s\S]*)/;

export const extractMessageFromText = (text: string) => {
  const match = MENTION_REGEX.exec(text);
  return match?.groups?.message.trim() || "";
};

export const isMentionMessage = (text: string) => {
  return MENTION_REGEX.test(text);
};

export const randomIcon = () => {
  const bookIcons = ["ð", "ð", "ð", "ð", "ð", "ð", "ð"];
  return bookIcons[Math.floor(Math.random() * bookIcons.length)];
};

export const fetchChannelName = async (
  client: App["client"],
  channelId: string
) => {
  // ãã£ãã«IDãç©ºæå­ã®å ´åããããã
  if (!channelId) {
    return "";
  }
  const channelInfo = await client.conversations.info({
    channel: channelId,
  });
  return channelInfo.channel?.name || "";
};
