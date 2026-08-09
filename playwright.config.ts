import { existsSync } from "node:fs";
import { chromium, defineConfig, devices } from "@playwright/test";
import { parsePlaywrightPort } from "./playwright-port";

const hasBundledChromium = existsSync(chromium.executablePath());
const playwrightPort = parsePlaywrightPort(process.env.PLAYWRIGHT_PORT);
const playwrightBaseUrl = `http://127.0.0.1:${playwrightPort}`;

export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: playwrightBaseUrl,
    channel: hasBundledChromium || process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${playwrightPort}`,
    env: { ASTRO_DEV_BACKGROUND: "0" },
    url: playwrightBaseUrl,
    reuseExistingServer: !process.env.CI && !process.env.PLAYWRIGHT_PORT,
  },
});
