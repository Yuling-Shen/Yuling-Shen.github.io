import type { APIRoute } from "astro";
import { withBase } from "../lib/urls";

export const GET: APIRoute = ({ site }) => {
  const origin = site || new URL("http://localhost:4321");
  const sitemapUrl = new URL(
    withBase("sitemap-index.xml", import.meta.env.BASE_URL),
    origin,
  );
  return new Response(
    "User-agent: *\nAllow: /\nSitemap: " + sitemapUrl.href + "\n",
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
