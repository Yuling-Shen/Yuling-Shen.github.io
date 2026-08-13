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
    const profileChildren = $(".profile-copy").children();
    expect(profileChildren.eq(0).is("h1")).toBe(true);
    expect(profileChildren.eq(1).is(".profile-links")).toBe(true);
    expect(profileChildren.eq(2).is(".appointment")).toBe(true);
    expect(profileChildren.eq(1).find("a").map((_, element) =>
      $(element).text(),
    ).get()).toEqual(["ylshen07@suda.edu.cn", "Google Scholar"]);
    const educationItems = $(".education-list > li");
    const phdEducationItem = educationItems.first();
    expect(phdEducationItem.children("strong").first().text()).toBe("PhD");

    const advisorLine = phdEducationItem.children(".advisor-line");
    expect(advisorLine).toHaveLength(1);
    expect(advisorLine.text().replace(/\s+/g, " ").trim()).toBe(
      "Advisors: Robert E. Skelton \u00b7 Manoranjan Majji",
    );
    expect($(".profile-copy > .advisor-line")).toHaveLength(0);
    expect(educationItems.slice(1).find(".advisor-line")).toHaveLength(0);
    expect(advisorLine.children("a").map((_, element) => ({
      name: $(element).text(),
      url: $(element).attr("href"),
    })).get()).toEqual([
      {
        name: "Robert E. Skelton",
        url: "https://bobskelton.github.io/",
      },
      {
        name: "Manoranjan Majji",
        url: "https://engineering.tamu.edu/aerospace/profiles/majji-manoranjan.html",
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
  });

  it("renders patents and research software as separate sections", () => {
    expect($("#patents").attr("aria-labelledby")).toBe("patents-title");
    expect($("#patents-title").text()).toBe("Patents");
    expect($("#research-software").attr("aria-labelledby")).toBe(
      "research-software-title",
    );
    expect($("#research-software-title").text()).toBe("Research Software");
    expect($("#patents-software")).toHaveLength(0);

    const groups = $("#patents .patent-group");
    expect(groups).toHaveLength(2);
    expect(groups.map((_, element) => $(element).find("h3").text()).get()).toEqual([
      "2026",
      "2025",
    ]);
    expect(groups.map((_, element) => $(element).attr("aria-labelledby")).get())
      .toEqual(["patent-year-2026", "patent-year-2025"]);
    expect(groups.map((_, element) => $(element).find(".patent").length).get())
      .toEqual([3, 2]);

    expect($("#patents .patent").map((_, element) =>
      $(element).attr("data-patent-id"),
    ).get()).toEqual(siteData.patents.selected.map(({ id }) => id));

    const patentText = $("#patents").text();
    for (const patent of siteData.patents.selected) {
      expect(patentText).toContain(patent.title);
      expect(patentText).toContain(patent.number);
    }
    expect($("#patents .patent").filter((_, element) =>
      $(element).text().includes("First inventor"),
    )).toHaveLength(4);
    expect($("#patents .patent").filter((_, element) =>
      $(element).text().includes("Second inventor"),
    )).toHaveLength(1);
    expect(patentText).not.toContain(
      "Five granted Chinese invention patents; first inventor on four and second inventor on one.",
    );
    expect($("#patents .software-line")).toHaveLength(0);
    expect($("#research-software .software-line a").text()).toBe("TsgDMC");
    expect($("#research-software .software-line a").attr("href")).toBe(
      siteData.patents.software.url,
    );
  });

  it("renders teaching, supervision, separate recognition sections, media, and footer", () => {
    expect($("#teaching-supervision .course")).toHaveLength(5);
    expect($("#teaching-supervision .supervision-item")).toHaveLength(3);
    expect($("#awards .dated-item")).toHaveLength(
      siteData.recognition.awards.length,
    );
    expect($("#academic-service .dated-item")).toHaveLength(
      siteData.recognition.service.length,
    );
    expect($("#awards-service")).toHaveLength(0);
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
    expect($("main > section").map((_, element) =>
      $(element).attr("id"),
    ).get()).toEqual([
      "research-areas",
      "publications",
      "funding",
      "patents",
      "research-software",
      "teaching-supervision",
      "awards",
      "academic-service",
      "media",
    ]);
    expect($("#awards").attr("aria-labelledby")).toBe("awards-title");
    expect($("#academic-service").attr("aria-labelledby")).toBe(
      "academic-service-title",
    );
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
