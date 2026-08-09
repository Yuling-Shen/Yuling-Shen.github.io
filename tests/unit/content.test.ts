import { describe, expect, it } from "vitest";
import playwrightConfig from "../../playwright.config";
import { siteDataSchema } from "../../src/data/schema";
import { siteData } from "../../src/data/site";

type FundingCandidate = Omit<typeof siteData, "funding"> & {
  funding: Array<Record<string, unknown>>;
};

const expectedPublicationIds = [
  "chen-2024-linearized-dynamics",
  "shen-2024-markov-identification",
  "shen-2023-qmarkov-identification",
  "shen-2023-qmarkov-unstable",
  "shi-2025-markov-parameters",
  "shen-2024-finite-word-length",
  "chen-2026-resource-efficient",
  "shen-2024-sensor-fault",
  "shen-2023-reference-tracking",
  "su-2026-inverse-kinematic",
  "su-2025-hoberman-topology",
  "zhang-2025-lightweight",
  "chen-2018-space-habitat",
] as const;

const expectedPublicationCategories = [
  "Dynamics Modeling",
  "Dynamics Modeling",
  "Dynamics Modeling",
  "Dynamics Modeling",
  "Dynamics Simulation",
  "Dynamics Simulation",
  "Dynamics Control",
  "Dynamics Control",
  "Dynamics Control",
  "Structural Design",
  "Structural Design",
  "Structural Design",
  "Structural Design",
] as const;

const expectedCanonicalPublicationDetails = {
  "shen-2024-markov-identification": "112(9), 7215–7231",
  "shen-2023-qmarkov-identification":
    "22nd IFAC World Congress, 56(2), 108–113",
  "shi-2025-markov-parameters": "3831–3837",
  "shen-2024-sensor-fault": "584–593",
  "su-2025-hoberman-topology":
    "IAF Materials and Structures Symposium, Sydney, Australia, 143–152",
} as const;

const expectedPublicationCategoryOrder = [
  "Dynamics Modeling",
  "Dynamics Simulation",
  "Dynamics Control",
  "Structural Design",
] as const;

describe("CV-derived site data", () => {
  it("keeps Astro in the foreground for the isolated Playwright server", () => {
    expect(playwrightConfig.webServer).toMatchObject({
      command: expect.stringMatching(
        /^npm run dev -- --host 127\.0\.0\.1 --port \d+$/,
      ),
      env: { ASTRO_DEV_BACKGROUND: "0" },
    });
  });

  it("uses the latest approved source and exact curated counts", () => {
    expect(siteData.profile.sourceDate).toBe("2026-08-09");
    expect(siteData.patents.sourceDate).toBe("2026-08-09");
    expect(siteData.teaching.sourceDate).toBe("2026-08-09");
    expect(siteData.recognition.sourceDate).toBe("2026-08-09");
    expect(siteData.publications).toHaveLength(13);
    expect(siteData.publications.map(({ id }) => id)).toEqual(
      expectedPublicationIds,
    );
    expect(siteData.funding).toHaveLength(4);
    expect(siteData.funding.map(({ id }) => id)).toEqual([
      "nsfc-young-2026",
      "jiangsu-young-2024",
      "jiangsu-industry-2025",
      "soochow-startup-2023",
    ]);
    expect(siteData.patents).not.toHaveProperty("summary");
    expect(siteData.patents.selected).toHaveLength(3);
    expect(siteData.teaching.courses).toHaveLength(5);
  });

  it("stores the two approved advisor links and no CV path", () => {
    expect(siteData.profile.advisors).toEqual([
      {
        name: "Manoranjan Majji",
        url: "https://engineering.tamu.edu/aerospace/profiles/majji-manoranjan.html",
      },
      {
        name: "Robert E. Skelton",
        url: "https://bobskelton.github.io/",
      },
    ]);
    expect(siteData.profile).not.toHaveProperty("cvPath");
  });

  it("locks the profile research areas to the canonical publication order", () => {
    expect(siteData.profile.researchAreas.map(({ title }) => title)).toEqual(
      expectedPublicationCategoryOrder,
    );

    const source = structuredClone(siteData);
    const reordered = {
      ...source,
      profile: {
        ...source.profile,
        researchAreas: [
          source.profile.researchAreas[1],
          source.profile.researchAreas[0],
          source.profile.researchAreas[2],
          source.profile.researchAreas[3],
        ],
      },
    };
    expect(siteDataSchema.safeParse(reordered).success).toBe(false);
  });

  it("stores funding roles and programmes without monetary amounts", () => {
    expect(siteData.funding).toEqual([
      {
        id: "nsfc-young-2026",
        dates: "2026–2028",
        role: "PI",
        programme:
          "National Natural Science Foundation of China (NSFC), Young Scientists Fund",
      },
      {
        id: "jiangsu-young-2024",
        dates: "2024–2027",
        role: "PI",
        programme:
          "Natural Science Foundation of Jiangsu Province, Young Scientists Fund",
      },
      {
        id: "jiangsu-industry-2025",
        dates: "2025–2027",
        role: "PI",
        programme: "Jiangsu University–Industry Collaborative Research Project",
      },
      {
        id: "soochow-startup-2023",
        dates: "2023–2029",
        role: "PI",
        programme:
          "Excellent Young Scientist Start-up Research Fund, Soochow University",
      },
    ]);
    for (const item of siteData.funding) {
      expect(item).not.toHaveProperty("amount");
    }
    expect(JSON.stringify(siteData.funding)).not.toMatch(/CNY|\d{3},\d{3}/);
  });

  it("rejects altered canonical funding metadata and embedded monetary text", () => {
    const alteredDate = structuredClone(siteData) as FundingCandidate;
    alteredDate.funding[0].dates = "2026–2029";
    expect(siteDataSchema.safeParse(alteredDate).success).toBe(false);

    const alteredProgramme = structuredClone(siteData) as FundingCandidate;
    alteredProgramme.funding[1].programme = "Replacement programme";
    expect(siteDataSchema.safeParse(alteredProgramme).success).toBe(false);

    const programmeWithAmount = structuredClone(siteData) as FundingCandidate;
    programmeWithAmount.funding[2].programme += " (CNY 300,000)";
    expect(siteDataSchema.safeParse(programmeWithAmount).success).toBe(false);
  });

  it("rejects reintroduced CV and funding amount fields", () => {
    const profileCandidate = structuredClone(siteData) as typeof siteData & {
      profile: Record<string, unknown>;
    };
    profileCandidate.profile.cvPath = "cv/Yuling-Shen-CV.pdf";
    expect(siteDataSchema.safeParse(profileCandidate).success).toBe(false);

    const fundingCandidate = structuredClone(siteData) as FundingCandidate;
    fundingCandidate.funding[0].amount = "CNY 300,000";
    expect(siteDataSchema.safeParse(fundingCandidate).success).toBe(false);
  });

  it("contains no excluded NASA records or private contact details", () => {
    const data = JSON.stringify(siteData);
    expect(data).not.toMatch(/\bNASA\b|\bNIAC\b/i);
    expect(data).not.toContain("yulingshen@hotmail.com");
    expect(data).not.toContain("+1 213 880 8476");
  });

  it("rejects excluded content in the research summary", () => {
    const result = siteDataSchema.safeParse({
      ...siteData,
      researchSummary: "NASA data-driven modeling",
    });

    expect(result.success).toBe(false);
  });

  it("rejects excluded project terms in structured URLs", () => {
    const candidate = structuredClone(siteData);
    candidate.recognition.media.links[0].url =
      "https://example.com/NASA-project";

    expect(siteDataSchema.safeParse(candidate).success).toBe(false);
  });

  it("rejects unknown fields that could expose omitted homepage data", () => {
    for (const extraProfileField of [
      { secondaryEmail: "yulingshen@hotmail.com" },
      { telephone: "+86 123 4567 8901" },
      { presentations: ["Invited presentation"] },
      { orcid: "0000-0000-0000-0000" },
    ]) {
      const candidate = structuredClone(siteData) as typeof siteData & {
        profile: Record<string, unknown>;
      };
      Object.assign(candidate.profile, extraProfileField);

      expect(siteDataSchema.safeParse(candidate).success).toBe(false);
    }
  });

  it("rejects a visible News label without rejecting legitimate news URL paths", () => {
    expect(siteDataSchema.safeParse(siteData).success).toBe(true);
    const candidate = structuredClone(siteData);
    candidate.recognition.media.links[0].label = "News";

    expect(siteDataSchema.safeParse(candidate).success).toBe(false);
  });

  it("rejects replacement publication and funding IDs", () => {
    const publicationReplacement = structuredClone(siteData);
    publicationReplacement.publications[0].id = "excluded-publication";
    expect(siteDataSchema.safeParse(publicationReplacement).success).toBe(false);

    const fundingReplacement = structuredClone(siteData) as FundingCandidate;
    fundingReplacement.funding[0].id = "excluded-project";
    expect(siteDataSchema.safeParse(fundingReplacement).success).toBe(false);
  });

  it("stores location components instead of a repeated display string", () => {
    expect(siteData.profile.locality).toBe("Suzhou");
    expect(siteData.profile.region).toBe("Jiangsu");
    expect(siteData.profile).not.toHaveProperty("location");
  });

  it("assigns every publication once in the canonical category order", () => {
    const ids = siteData.publications.map(({ id }) => id);
    expect(new Set(ids).size).toBe(13);
    expect(siteData.publications.map(({ category }) => category)).toEqual(
      expectedPublicationCategories,
    );
    expect(
      Object.fromEntries(
        [
          "Dynamics Modeling",
          "Dynamics Simulation",
          "Dynamics Control",
          "Structural Design",
        ].map((category) => [
          category,
          siteData.publications.filter((item) => item.category === category).length,
        ]),
      ),
    ).toEqual({
      "Dynamics Modeling": 4,
      "Dynamics Simulation": 2,
      "Dynamics Control": 3,
      "Structural Design": 4,
    });
  });

  it("preserves the five canonical publication page ranges", () => {
    expect(
      Object.fromEntries(
        siteData.publications
          .filter(({ id }) => id in expectedCanonicalPublicationDetails)
          .map(({ id, details }) => [id, details]),
      ),
    ).toEqual(expectedCanonicalPublicationDetails);
  });

  it("allows exactly one accepted publication without a DOI", () => {
    const withDoi = siteData.publications.filter(({ doi }) => doi);
    const withoutDoi = siteData.publications.filter(({ doi }) => !doi);
    expect(withDoi).toHaveLength(12);
    expect(withDoi.every(({ doi }) => /^https:\/\/doi\.org\//.test(doi!))).toBe(
      true,
    );
    expect(withoutDoi.map(({ id }) => id)).toEqual([
      "su-2026-inverse-kinematic",
    ]);
    expect(withoutDoi[0].details).toContain("Accepted for oral presentation");
    expect(withoutDoi[0].details).toContain("IAC-26,C2,2,9,x111788");
  });

  it("allows only the canonical IAC accepted-presentation status", () => {
    expect(siteDataSchema.safeParse(siteData).success).toBe(true);

    const unrelatedPresentation = structuredClone(siteData);
    unrelatedPresentation.publications[0].details = "Invited presentation";
    expect(siteDataSchema.safeParse(unrelatedPresentation).success).toBe(false);

    const alteredAcceptedStatus = structuredClone(siteData);
    const accepted = alteredAcceptedStatus.publications.find(
      ({ id }) => id === "su-2026-inverse-kinematic",
    );
    expect(accepted).toBeDefined();
    if (!accepted) return;
    accepted.details =
      "Antalya, Türkiye; Accepted for poster presentation; Paper ID IAC-26,C2,2,9,x111788";
    expect(siteDataSchema.safeParse(alteredAcceptedStatus).success).toBe(false);
  });

  it("rejects changed publication metadata, category, DOI, authors, and order", () => {
    const changedTitle = structuredClone(siteData);
    changedTitle.publications[0].title = "Replacement publication title";
    expect(siteDataSchema.safeParse(changedTitle).success).toBe(false);

    const changedVenue = structuredClone(siteData);
    changedVenue.publications[0].venue = "Replacement venue";
    expect(siteDataSchema.safeParse(changedVenue).success).toBe(false);

    const changedDetails = structuredClone(siteData);
    changedDetails.publications[0].details = "AIAA Paper 2024-2348";
    expect(siteDataSchema.safeParse(changedDetails).success).toBe(false);

    const changedCategory = structuredClone(siteData);
    changedCategory.publications[0].category = "Dynamics Control";
    expect(siteDataSchema.safeParse(changedCategory).success).toBe(false);

    const swappedDois = structuredClone(siteData);
    [swappedDois.publications[0].doi, swappedDois.publications[1].doi] = [
      swappedDois.publications[1].doi,
      swappedDois.publications[0].doi,
    ];
    expect(siteDataSchema.safeParse(swappedDois).success).toBe(false);

    const reorderedAuthors = structuredClone(siteData);
    reorderedAuthors.publications[0].authors.reverse();
    expect(siteDataSchema.safeParse(reorderedAuthors).success).toBe(false);

    const wrongProfileMarker = structuredClone(siteData);
    wrongProfileMarker.publications[0].authors[0].profile = true;
    expect(siteDataSchema.safeParse(wrongProfileMarker).success).toBe(false);

    const missingPublishedDoi = structuredClone(siteData);
    delete missingPublishedDoi.publications[0].doi;
    expect(siteDataSchema.safeParse(missingPublishedDoi).success).toBe(false);

    const inventedAcceptedDoi = structuredClone(siteData);
    const accepted = inventedAcceptedDoi.publications.find(
      ({ id }) => id === "su-2026-inverse-kinematic",
    );
    expect(accepted).toBeDefined();
    if (!accepted) return;
    accepted.doi = "https://doi.org/10.0000/not-assigned";
    expect(siteDataSchema.safeParse(inventedAcceptedDoi).success).toBe(false);

    const reordered = structuredClone(siteData);
    [reordered.publications[0], reordered.publications[1]] = [
      reordered.publications[1],
      reordered.publications[0],
    ];
    expect(siteDataSchema.safeParse(reordered).success).toBe(false);
  });
});
