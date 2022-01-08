import { extractMessageFromText } from "../utils";

describe("extractMessageFromText", () => {
  test.each([
    { text: "@tell-me-bot > foo", expected: "foo" },
    { text: "@tell-me-bot > 真人間", expected: "真人間" },
    { text: "@tell-me-bot > bar", expected: "bar" },
    { text: "@tell-me-bot >\naaa", expected: "aaa" },
  ])(`extract message. %s`, ({ text, expected }) => {
    expect(extractMessageFromText(text)).toBe(expected);
  });
});
