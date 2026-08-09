import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Pages deployment workflow", () => {
  it("tests exact root and project outputs before rebuilding with real Pages values", () => {
    const workflow = readFileSync(".github/workflows/deploy.yml", "utf8");
    const rootCheck = workflow.indexOf("name: Verify root Pages output");
    const projectCheck = workflow.indexOf("name: Verify project Pages output");
    const productionBuild = workflow.indexOf("name: Build production Pages artifact");
    const artifactUpload = workflow.indexOf("uses: actions/upload-pages-artifact@v3");

    expect(rootCheck).toBeGreaterThan(-1);
    expect(projectCheck).toBeGreaterThan(rootCheck);
    expect(productionBuild).toBeGreaterThan(projectCheck);
    expect(artifactUpload).toBeGreaterThan(productionBuild);
    expect(workflow.slice(rootCheck, projectCheck)).toContain(
      "SITE_URL: https://example.github.io",
    );
    expect(workflow.slice(rootCheck, projectCheck)).toContain('BASE_PATH: "/"');
    expect(workflow.slice(projectCheck, productionBuild)).toContain(
      'BASE_PATH: "/academic-homepage"',
    );
    expect(workflow.slice(productionBuild, artifactUpload)).toContain(
      "SITE_URL: ${{ steps.pages.outputs.origin }}",
    );
    expect(workflow.slice(productionBuild, artifactUpload)).toContain(
      "BASE_PATH: ${{ steps.pages.outputs.base_path }}",
    );
  });
});
