import { describe, expect, it } from "vitest";
import { withBase } from "../../src/lib/urls";

describe("withBase", () => {
  it("builds a root-site URL", () => {
    expect(withBase("cv/Yuling-Shen-CV.pdf", "/")).toBe(
      "/cv/Yuling-Shen-CV.pdf",
    );
  });

  it("builds a project-site URL without duplicate slashes", () => {
    expect(withBase("/cv/Yuling-Shen-CV.pdf", "/homepage/")).toBe(
      "/homepage/cv/Yuling-Shen-CV.pdf",
    );
  });
});
