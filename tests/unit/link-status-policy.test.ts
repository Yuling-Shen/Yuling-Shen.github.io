import { describe, expect, it } from "vitest";
import { isAcceptedLinkStatus } from "../../scripts/link-status-policy.mjs";

describe("isAcceptedLinkStatus", () => {
  it("accepts successful responses and documented access restrictions", () => {
    expect(isAcceptedLinkStatus(200)).toBe(true);
    expect(isAcceptedLinkStatus(302)).toBe(true);
    expect(isAcceptedLinkStatus(401)).toBe(true);
    expect(isAcceptedLinkStatus(403)).toBe(true);
    expect(isAcceptedLinkStatus(429)).toBe(true);
  });

  it("rejects missing resources and server errors", () => {
    expect(isAcceptedLinkStatus(404)).toBe(false);
    expect(isAcceptedLinkStatus(410)).toBe(false);
    expect(isAcceptedLinkStatus(500)).toBe(false);
  });
});
