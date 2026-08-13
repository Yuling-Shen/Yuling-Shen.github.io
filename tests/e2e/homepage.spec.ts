import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage is accessible and complete at its project viewport", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Yuling Shen",
  );
  await expect(
    page.getByRole("heading", { level: 2, name: "Publications" }),
  ).toBeVisible();
  await expect(page.locator("#publications .publication-group")).toHaveCount(4);
  await expect(page.locator("#publications .publication")).toHaveCount(13);
  await expect(page.locator("#funding .dated-item")).toHaveCount(4);
  await expect(page.locator("#patents .patent-group")).toHaveCount(2);
  await expect(page.locator("#patents .patent-group > h3")).toHaveText([
    "2026",
    "2025",
  ]);
  await expect(page.locator("#patents .patent")).toHaveCount(5);
  await expect(page.locator("#research-software .software-line > a")).toHaveText(
    "TsgDMC",
  );
  await expect(page.locator(".advisor-line > a")).toHaveText([
    "Robert E. Skelton",
    "Manoranjan Majji",
  ]);
  await expect(
    page.getByRole("img", { name: "Portrait of Yuling Shen", exact: true }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("homepage has no horizontal overflow at its project viewport", async ({ page }) => {
  await page.goto("/");
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);
  await expect(page.locator(".profile-header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});

test("keyboard focus outline has accessible non-text contrast", async ({ page }) => {
  await page.goto("/");
  const scholarLink = page.getByRole("link", {
    name: "Google Scholar",
    exact: true,
  });
  await scholarLink.focus();

  await expect(scholarLink).toBeFocused();
  expect(
    await scholarLink.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        color: style.outlineColor,
        style: style.outlineStyle,
        width: style.outlineWidth,
      };
    }),
  ).toEqual({
    color: "rgb(21, 91, 130)",
    style: "solid",
    width: "3px",
  });
});
