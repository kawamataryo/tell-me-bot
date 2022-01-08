export const extractMessageFromText = (text: string) => {
  const regex = /(?<botName>@.+)>(?<message>[\s\S]*)/;
  const match = regex.exec(text);
  return match?.groups?.message.trim() || "";
};

export const randomIcon = () => {
  const bookIcons = ["📓", "📕", "📗", "📙", "📔", "📖", "📚"];
  return bookIcons[Math.floor(Math.random() * bookIcons.length)];
};
