import { describe, expect, it } from "vitest";
import { parsePlaywrightPort } from "../../playwright-port";

describe("parsePlaywrightPort", () => {
  it("uses the default port only when no override is provided", () => {
    expect(parsePlaywrightPort(undefined)).toBe(4321);
  });

  it("accepts a valid integer override", () => {
    expect(parsePlaywrightPort("4322")).toBe(4322);
  });

  it.each(["4322junk", "1.5", "0", "-1", "65536"])(
    "rejects invalid raw input %j",
    (rawPort) => {
      expect(() => parsePlaywrightPort(rawPort)).toThrow(
        "PLAYWRIGHT_PORT must be an integer from 1 through 65535",
      );
    },
  );
});
