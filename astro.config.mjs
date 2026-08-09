import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const rawBase = process.env.BASE_PATH || "/";
const base =
  rawBase === "/"
    ? "/"
    : "/" + rawBase.replace(/^\/+|\/+$/g, "");

export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
