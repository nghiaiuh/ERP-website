import { describe, expect, it } from "vitest";
import { resolveLogoUrl } from "./safe-redirect";

describe("resolveLogoUrl", () => {
  it.each([
    ["/logo.png", "/logo.png"],
    ["https://example.com/logo.png", "https://example.com/logo.png"],
    ["http://evil.com/logo.png", undefined],
    ["//evil.com/logo.png", undefined],
    ["/\\evil.com", undefined],
    ["javascript:alert(1)", undefined],
  ])("resolves %s correctly", (input, expected) => {
    expect(resolveLogoUrl(input)).toBe(expected);
  });
});