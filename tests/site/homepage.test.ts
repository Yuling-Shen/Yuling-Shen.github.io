import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { siteData } from "../../src/data/site";

const html = readFileSync("dist/index.html", "utf8");
const $ = load(html);
const expectedOrigin = (process.env.SITE_URL || "http://localhost:4321").replace(
  /\/$/,
  "",
);
const rawBase = process.env.BASE_PATH || "/";
const expectedBase =
  rawBase === "/" ? "/" : `/${rawBase.replace(/^\/+|\/+$/g, "")}/`;
const expectedHomeUrl = `${expectedOrigin}${expectedBase}`;

function expectOnlyApprovedScripts(markup: string): void {
  const document = load(markup);
  expect(document("astro-island")).toHaveLength(0);

  const scripts = document("script");
  expect(scripts).toHaveLength(1);
  const script = scripts.first();
  expect(script.attr("type")).toBe("application/ld+json");
  expect(script.attr("src")).toBeUndefined();
  expect(() => JSON.parse(script.html() ?? "")).not.toThrow();
}

describe("built homepage", () => {
  it("renders the compact profile header, education, and linked advisors", () => {
    expect($("h1").text()).toBe("Yuling Shen");
    expect($("body").text()).toContain("Associate Professor");
    expect($("body").text()).toContain("Texas A&M University");
    expect($("a[href^=\"mailto:\"]").attr("href")).toBe(
      "mailto:ylshen07@suda.edu.cn",
    );
    expect($(".advisor-line > a").map((_, element) => ({
      name: $(element).text(),
      url: $(element).attr("href"),
    })).get()).toEqual([
      {
        name: "Manoranjan Majji",
        url: "https://engineering.tamu.edu/aerospace/profiles/majji-manoranjan.html",
      },
      {
        name: "Robert E. Skelton",
        url: "https://bobskelton.github.io/",
      },
    ]);
  });

  it("renders the approved profile portrait", () => {
    const portrait = $(".profile-portrait img");

    expect(portrait).toHaveLength(1);
    expect(portrait.attr("src")).toBe(`${expectedBase}images/profile.jpg`);
    expect(portrait.attr("alt")).toBe(`Portrait of ${siteData.profile.name}`);
    expect(portrait.attr("width")).toBe("112");
    expect(portrait.attr("height")).toBe("136");
    expect($(".profile-initials")).toHaveLength(0);
    expect(() => readFileSync("dist/images/profile.jpg")).not.toThrow();
  });

  it("does not render navigation or excluded contact details", () => {
    expect($("nav")).toHaveLength(0);
    const text = $("body").text();
    expect(text).not.toContain("yulingshen@hotmail.com");
    expect(text).not.toContain("+1 213 880 8476");
  });

  it("uses the approved font stack and blue", () => {
    const css = readdirSync("dist/_astro")
      .filter((name) => name.endsWith(".css"))
      .map((name) => readFileSync(join("dist/_astro", name), "utf8"))
      .join("\n");
    expect(css).toContain("Microsoft YaHei");
    expect(css.toLowerCase()).toContain("#155b82");
  });

  it("separates four research areas from four complete publication groups", () => {
    expect($("#research-areas .research-area")).toHaveLength(4);
    expect($("#publications .publication-group")).toHaveLength(4);
    const publicationGroupTitles =
      $("#publications .publication-group > h3")
        .map((_, element) => $(element).text().trim())
        .get();
    expect(publicationGroupTitles).toEqual([
      "Dynamics Modeling",
      "Dynamics Simulation",
      "Dynamics Control",
      "Structural Design",
    ]);
    expect(publicationGroupTitles).toEqual(
      $("#research-areas .research-area > h3")
        .map((_, element) => $(element).text().trim())
        .get(),
    );
    expect(
      $("#publications .publication-group .publication-list")
        .map((_, element) => $(element).find(".publication").length)
        .get(),
    ).toEqual([4, 2, 3, 4]);
    expect($("#selected-publications")).toHaveLength(0);
    expect($("#research-areas img")).toHaveLength(0);
  });

  it("rejects an injected inline classic script", () => {
    const injectedHtml = html.replace(
      "</head>",
      "<script>window.injected = true;</script></head>",
    );

    expect(() => expectOnlyApprovedScripts(injectedHtml)).toThrow();
  });

  it("renders 13 publication rows, 12 DOI links, and one unlinked accepted item", () => {
    expect($("#publications .publication")).toHaveLength(13);
    const renderedIds = $("#publications .publication")
      .map((_, element) => $(element).attr("data-publication-id"))
      .get();
    expect(renderedIds).toEqual(siteData.publications.map(({ id }) => id));
    expect(new Set(renderedIds).size).toBe(13);
    expect($("#publications .publication-title").first().text()).toContain(
      "Model-Based and Markov Data-Based Linearized",
    );
    expect($("#publications a[href^='https://doi.org/']")).toHaveLength(12);
    expect($("#publications .profile-author")).toHaveLength(13);
    const acceptedTitle = $("#publications .publication-title")
      .filter((_, element) =>
        $(element).text().includes("Inverse-Kinematic Design"),
      )
      .first();
    expect(acceptedTitle).toHaveLength(1);
    expect(acceptedTitle[0].tagName).toBe("span");
    expect(acceptedTitle.attr("href")).toBeUndefined();
    expect($("#publications").text()).toContain("Accepted for oral presentation");
    expect($("#publications img, #publications button, #publications [role='tab']"))
      .toHaveLength(0);
    expectOnlyApprovedScripts(html);
  });

  it("renders four PI projects without amounts", () => {
    expect($("#funding .dated-item")).toHaveLength(4);
    expect($("#funding").text()).toContain("PI");
    expect($("#funding").text()).not.toMatch(/CNY|\d{3},\d{3}/);
    expect($("#patents-software .patent")).toHaveLength(3);
    expect($("#patents-software").text()).not.toContain(
      "Five granted Chinese invention patents; first inventor on four and second inventor on one.",
    );
  });

  it("renders teaching, supervision, recognition, media, and footer", () => {
    expect($("#teaching-supervision .course")).toHaveLength(5);
    expect($("#teaching-supervision .supervision-item")).toHaveLength(3);
    expect($("#awards-service .dated-list")).toHaveLength(2);
    expect($("#media a")).toHaveLength(4);
    expect($("footer").text()).toContain("Last updated: August 2026");
  });

  it("contains none of the excluded landing-page labels", () => {
    const text = $("body").text();
    expect(text).not.toMatch(/\bNASA\b|\bNIAC\b|\bNews\b/i);
    expect(text).not.toMatch(/\bORCID\b/i);
    expect($("nav")).toHaveLength(0);
    expect($("main img").length).toBeLessThanOrEqual(1);
  });

  it("ships discoverability metadata and retains the unlinked CV asset", () => {
    const cssFiles = readdirSync("dist/_astro").filter((name) =>
      name.endsWith(".css"),
    );
    expect(cssFiles).toHaveLength(1);
    expect($(".profile-links a").map((_, element) => $(element).text()).get()).toEqual([
      "ylshen07@suda.edu.cn",
      "Google Scholar",
    ]);
    expect($("a[href*='/cv/'], a[href$='.pdf']")).toHaveLength(0);
    expect($("link[rel='stylesheet']").attr("href")).toBe(
      `${expectedBase}_astro/${cssFiles[0]}`,
    );
    expect($("link[rel='icon']").attr("href")).toBe(
      `${expectedBase}favicon.svg`,
    );
    expect($("link[rel='canonical']").attr("href")).toBe(expectedHomeUrl);
    expect($("meta[property='og:title']")).toHaveLength(1);
    expect($("meta[property='og:url']").attr("content")).toBe(expectedHomeUrl);
    expect($("script[type='application/ld+json']")).toHaveLength(1);
    expect(() => readFileSync("dist/cv/Yuling-Shen-CV.pdf")).not.toThrow();
    expect(readFileSync("dist/robots.txt", "utf8")).toBe(
      `User-agent: *\nAllow: /\nSitemap: ${expectedHomeUrl}sitemap-index.xml\n`,
    );

    const sitemapIndex = load(readFileSync("dist/sitemap-index.xml", "utf8"), {
      xmlMode: true,
    });
    expect(sitemapIndex("sitemap > loc").text()).toBe(
      `${expectedHomeUrl}sitemap-0.xml`,
    );
    const sitemap = load(readFileSync("dist/sitemap-0.xml", "utf8"), {
      xmlMode: true,
    });
    expect(sitemap("url > loc").text()).toBe(expectedHomeUrl);
  });

  it("exposes header, main, and footer as sibling page landmarks", () => {
    const landmarks = $(".reading-column").children();
    expect(landmarks.toArray().map((element) => element.tagName)).toEqual([
      "header",
      "main",
      "footer",
    ]);
    expect($("main > section").length).toBeGreaterThan(0);
    expect($("main header, main footer")).toHaveLength(0);
  });

  it("derives visible and machine-readable profile metadata", () => {
    expect($("title").text()).toBe(`${siteData.profile.name} | Academic Homepage`);
    expect($("meta[name='description']").attr("content")).toBe(
      `${siteData.profile.name} is an ${siteData.profile.role} at ${siteData.profile.institution} working on data-driven dynamics, control, and structural design.`,
    );
    expect($(".profile-copy > .supporting").first().text()).toBe(
      [siteData.profile.locality, siteData.profile.region, siteData.profile.country].join(
        ", ",
      ),
    );

    const jsonLd = JSON.parse(
      $("script[type='application/ld+json']").html() || "null",
    );
    expect(jsonLd).toMatchObject({
      name: siteData.profile.name,
      jobTitle: siteData.profile.role,
      address: {
        addressLocality: siteData.profile.locality,
        addressRegion: siteData.profile.region,
        addressCountry: siteData.profile.country,
      },
      affiliation: { name: siteData.profile.institution },
    });
  });
});
