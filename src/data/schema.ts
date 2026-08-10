import { z } from "zod";

const sourceDate = z.literal("2026-08-09");
const externalUrl = z.string().url().refine(
  (url) => url.startsWith("https://"),
  "External URLs must use HTTPS",
);

const expectedFunding = [
  {
    id: "nsfc-young-2026",
    dates: "2026–2028",
    role: "PI",
    programme: "National Natural Science Foundation of China (NSFC), Young Scientists Fund",
  },
  {
    id: "jiangsu-young-2024",
    dates: "2024–2027",
    role: "PI",
    programme: "Natural Science Foundation of Jiangsu Province, Young Scientists Fund",
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
    programme: "Excellent Young Scientist Start-up Research Fund, Soochow University",
  },
] as const;

const expectedPatents = [
  {
    id: "zl2026100679354",
    year: 2026,
    title:
      "A spatial swing-angle measurement system, method and device for suspended low-gravity simulation",
    number: "ZL2026100679354",
    role: "First inventor",
  },
  {
    id: "zl2025120523857",
    year: 2026,
    title: "A Hoberman ring and its design method and applications",
    number: "ZL2025120523857",
    role: "First inventor",
  },
  {
    id: "zl2026100679797",
    year: 2026,
    title:
      "A control method, system and electronic device for suspended low-gravity simulation",
    number: "ZL2026100679797",
    role: "First inventor",
  },
  {
    id: "zl2024117394697",
    year: 2025,
    title:
      "A data output method and system based on timbre and emotion simulation",
    number: "ZL2024117394697",
    role: "Second inventor",
  },
  {
    id: "zl202510534007x",
    year: 2025,
    title:
      "An energy-efficient pressure-control method and system for cleanrooms using dynamic pipe networks and model predictive control",
    number: "ZL202510534007X",
    role: "First inventor",
  },
] as const;

export const publicationCategoryOrder = [
  "Dynamics Modeling",
  "Dynamics Simulation",
  "Dynamics Control",
  "Structural Design",
] as const;

const expectedPublications = [
  {
    id: "chen-2024-linearized-dynamics",
    category: "Dynamics Modeling",
    year: 2024,
    title: "Model-Based and Markov Data-Based Linearized Tensegrity Dynamics and Analysis of Morphing Airfoils",
    venue: "AIAA SCITECH 2024 Forum",
    details: "AIAA Paper 2024-2347",
    doi: "https://doi.org/10.2514/6.2024-2347",
    authors: ["Muhao Chen:false", "Yuling Shen:true", "Robert E. Skelton:false"],
  },
  {
    id: "shen-2024-markov-identification",
    category: "Dynamics Modeling",
    year: 2024,
    title: "A Markov data-based approach to system identification and output error covariance analysis for tensegrity structures",
    venue: "Nonlinear Dynamics",
    details: "112(9), 7215–7231",
    doi: "https://doi.org/10.1007/s11071-024-09443-9",
    authors: ["Yuling Shen:true", "Muhao Chen:false", "Robert E. Skelton:false"],
  },
  {
    id: "shen-2023-qmarkov-identification",
    category: "Dynamics Modeling",
    year: 2023,
    title: "An Efficient q-Markov Covariance Equivalent Realization Approach to System Identification",
    venue: "IFAC-PapersOnLine",
    details: "22nd IFAC World Congress, 56(2), 108–113",
    doi: "https://doi.org/10.1016/j.ifacol.2023.10.1554",
    authors: ["Yuling Shen:true", "Muhao Chen:false", "Manoranjan Majji:false", "Robert E. Skelton:false"],
  },
  {
    id: "shen-2023-qmarkov-unstable",
    category: "Dynamics Modeling",
    year: 2023,
    title: "Q-Markov Covariance equivalent realizations for unstable and marginally stable systems",
    venue: "Mechanical Systems and Signal Processing",
    details: "196, 110343",
    doi: "https://doi.org/10.1016/j.ymssp.2023.110343",
    authors: ["Yuling Shen:true", "Muhao Chen:false", "Manoranjan Majji:false", "Robert E. Skelton:false"],
  },
  {
    id: "shi-2025-markov-parameters",
    category: "Dynamics Simulation",
    year: 2025,
    title: "Markov Parameters Generation for Data-based Modeling of Tensegrity Robots Considering Finite Word-Length Effects",
    venue: "2025 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)",
    details: "3831–3837",
    doi: "https://doi.org/10.1109/IROS60139.2025.11246139",
    authors: ["Linxuan Shi:false", "Weizhi Cao:false", "Muhao Chen:false", "Yuling Shen:true"],
  },
  {
    id: "shen-2024-finite-word-length",
    category: "Dynamics Simulation",
    year: 2024,
    title: "Finite word-length optimal simulation for high-dimensional dynamical systems: Examples of tensegrity structures",
    venue: "Mechanical Systems and Signal Processing",
    details: "215, 111415",
    doi: "https://doi.org/10.1016/j.ymssp.2024.111415",
    authors: ["Yuling Shen:true", "Muhao Chen:false", "Robert E. Skelton:false"],
  },
  {
    id: "chen-2026-resource-efficient",
    category: "Dynamics Control",
    year: 2026,
    title: "Resource-efficient covariance control with optimal sensor and actuator selection for tensegrity structures",
    venue: "Engineering Structures",
    details: "362, 122908",
    doi: "https://doi.org/10.1016/j.engstruct.2026.122908",
    authors: ["Muhao Chen:false", "Yuling Shen:true"],
  },
  {
    id: "shen-2024-sensor-fault",
    category: "Dynamics Control",
    year: 2024,
    title: "Sensor Fault Detection Approach to Tensegrity Structures Using Markov Parameters",
    venue: "Earth and Space 2024",
    details: "584–593",
    doi: "https://doi.org/10.1061/9780784485736.054",
    authors: ["Yuling Shen:true", "Muhao Chen:false", "Ed Habtour:false", "Robert E. Skelton:false"],
  },
  {
    id: "shen-2023-reference-tracking",
    category: "Dynamics Control",
    year: 2023,
    title: "Markov data-based reference tracking control to tensegrity morphing airfoils",
    venue: "Engineering Structures",
    details: "291, 116430",
    doi: "https://doi.org/10.1016/j.engstruct.2023.116430",
    authors: ["Yuling Shen:true", "Muhao Chen:false", "Robert E. Skelton:false"],
  },
  {
    id: "su-2026-inverse-kinematic",
    category: "Structural Design",
    year: 2026,
    title: "Inverse-Kinematic Design of Deployable Scissor Mechanisms along Arbitrary Curves",
    venue: "77th International Astronautical Congress (IAC 2026)",
    details: "Antalya, Türkiye; Accepted for oral presentation; Paper ID IAC-26,C2,2,9,x111788",
    doi: null,
    authors: ["Liang Su:false", "Muhao Chen:false", "Yuling Shen:true"],
  },
  {
    id: "su-2025-hoberman-topology",
    category: "Structural Design",
    year: 2025,
    title: "Parametric Studies of Hoberman Topology for the Design of Scalable and Deployable Structures",
    venue: "76th International Astronautical Congress (IAC 2025)",
    details: "IAF Materials and Structures Symposium, Sydney, Australia, 143–152",
    doi: "https://doi.org/10.52202/083088-0016",
    authors: ["Liang Su:false", "Muhao Chen:false", "Yuling Shen:true"],
  },
  {
    id: "zhang-2025-lightweight",
    category: "Structural Design",
    year: 2025,
    title: "Lightweight designs of simply supported tensegrity structures and their applications to bridges",
    venue: "Composite Structures",
    details: "357, 118923",
    doi: "https://doi.org/10.1016/j.compstruct.2025.118923",
    authors: ["Guangtao Zhang:false", "Muhao Chen:false", "Daihai Chen:false", "Yuling Shen:true"],
  },
  {
    id: "chen-2018-space-habitat",
    category: "Structural Design",
    year: 2018,
    title: "Energy analysis of growth adaptable artificial gravity space habitat",
    venue: "2018 AIAA SPACE and Astronautics Forum and Exposition",
    details: "AIAA Paper 2018-5109",
    doi: "https://doi.org/10.2514/6.2018-5109",
    authors: ["Muhao Chen:false", "Yuling Shen:true", "Raman Goyal:false", "Manoranjan Majji:false", "Robert E. Skelton:false"],
  },
] as const;

const publicationCategorySchema = z.enum(publicationCategoryOrder);

const acceptedIacPublicationDetails =
  "Antalya, Türkiye; Accepted for oral presentation; Paper ID IAC-26,C2,2,9,x111788";

const researchAreasSchema = z.tuple([
  z.object({
    title: z.literal(publicationCategoryOrder[0]),
    description: z.literal(
      "Data-based system identification and reduced-order models for tensegrity and morphing structures.",
    ),
  }).strict(),
  z.object({
    title: z.literal(publicationCategoryOrder[1]),
    description: z.literal(
      "Finite-word-length and resource-aware simulation of high-dimensional dynamical systems.",
    ),
  }).strict(),
  z.object({
    title: z.literal(publicationCategoryOrder[2]),
    description: z.literal(
      "Reference tracking, covariance control, sensor and actuator selection, and fault detection.",
    ),
  }).strict(),
  z.object({
    title: z.literal(publicationCategoryOrder[3]),
    description: z.literal(
      "Tensegrity, deployable, scissor, and morphing structures for space and civil applications.",
    ),
  }).strict(),
]);

const advisorSchema = z.tuple([
  z.object({
    name: z.literal("Robert E. Skelton"),
    url: z.literal("https://bobskelton.github.io/"),
  }).strict(),
  z.object({
    name: z.literal("Manoranjan Majji"),
    url: z.literal(
      "https://engineering.tamu.edu/aerospace/profiles/majji-manoranjan.html",
    ),
  }).strict(),
]);

const excludedVisibleContent = [
  { label: "NASA", pattern: /\bNASA\b/i },
  { label: "NIAC", pattern: /\bNIAC\b/i },
  { label: "News", pattern: /\bNews\b/i },
  { label: "ORCID", pattern: /\bORCID\b/i },
  { label: "presentations", pattern: /\bpresentations?\b/i },
  { label: "private email", pattern: /yulingshen@hotmail\.com/i },
  { label: "private telephone", pattern: /\+1\s*213\s*880\s*8476/ },
] as const;

function auditRawVisibleContent(
  value: unknown,
  context: z.RefinementCtx,
  path: (string | number)[] = [],
): void {
  if (typeof value === "string") {
    const isUrl = /^https?:\/\//i.test(value);
    for (const excluded of excludedVisibleContent) {
      if (isUrl && excluded.label === "News") {
        continue;
      }
      const isCanonicalAcceptedIacPresentation =
        excluded.label === "presentations" &&
        path.length === 3 &&
        path[0] === "publications" &&
        path[1] === 9 &&
        path[2] === "details" &&
        value === acceptedIacPublicationDetails;
      if (isCanonicalAcceptedIacPresentation) {
        continue;
      }
      if (excluded.pattern.test(value)) {
        context.addIssue({
          code: "custom",
          path,
          message: `Excluded homepage data found: ${excluded.label}`,
        });
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      auditRawVisibleContent(item, context, [...path, index]),
    );
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      auditRawVisibleContent(child, context, [...path, key]);
    }
  }
}

const authorSchema = z.object({
  name: z.string().min(1),
  profile: z.boolean(),
}).strict();

export const profileSchema = z.object({
  sourceDate,
  name: z.literal("Yuling Shen"),
  initials: z.literal("YS"),
  role: z.literal("Associate Professor"),
  appointmentDates: z.literal("2023–present"),
  unit: z.literal("School of Future Science and Engineering"),
  institution: z.literal("Soochow University"),
  locality: z.literal("Suzhou"),
  region: z.literal("Jiangsu"),
  country: z.literal("China"),
  email: z.literal("ylshen07@suda.edu.cn"),
  scholarUrl: externalUrl,
  advisors: advisorSchema,
  lastUpdated: z.literal("August 2026"),
  education: z.array(
    z.object({
      degree: z.string().min(1),
      field: z.string().min(1),
      institution: z.string().min(1),
      completed: z.string().min(1),
    }).strict(),
  ).length(3),
  researchAreas: researchAreasSchema,
}).strict();

const publicationDoi = externalUrl.refine(
  (url) => url.startsWith("https://doi.org/"),
  "Publication links must be DOI URLs",
);

export const publicationsSchema = z.array(
  z.object({
    id: z.string().min(1),
    category: publicationCategorySchema,
    year: z.number().int().min(2018).max(2026),
    title: z.string().min(1),
    authors: z.array(authorSchema).min(1),
    venue: z.string().min(1),
    details: z.string().min(1),
    doi: publicationDoi.optional(),
  }).strict(),
).length(13);

const fundingItemSchema = (funding: (typeof expectedFunding)[number]) =>
  z.object({
    id: z.literal(funding.id),
    dates: z.literal(funding.dates),
    role: z.literal(funding.role),
    programme: z.literal(funding.programme),
  }).strict();

export const fundingSchema = z.tuple([
  fundingItemSchema(expectedFunding[0]),
  fundingItemSchema(expectedFunding[1]),
  fundingItemSchema(expectedFunding[2]),
  fundingItemSchema(expectedFunding[3]),
]);

const patentItemSchema = <
  const Patent extends (typeof expectedPatents)[number],
>(patent: Patent) =>
  z.object({
    id: z.literal(patent.id),
    year: z.literal(patent.year),
    title: z.literal(patent.title),
    number: z.literal(patent.number),
    role: z.literal(patent.role),
  }).strict();

export const patentsSchema = z.object({
  sourceDate,
  selected: z.tuple([
    patentItemSchema(expectedPatents[0]),
    patentItemSchema(expectedPatents[1]),
    patentItemSchema(expectedPatents[2]),
    patentItemSchema(expectedPatents[3]),
    patentItemSchema(expectedPatents[4]),
  ]),
  software: z.object({
    name: z.literal("TsgDMC"),
    description: z.string().min(1),
    url: externalUrl,
  }).strict(),
}).strict();

export const teachingSchema = z.object({
  sourceDate,
  courses: z.array(z.string().min(1)).length(5),
  supervision: z.array(z.string().min(1)).length(3),
}).strict();

export const recognitionSchema = z.object({
  sourceDate,
  awards: z.array(
    z.object({
      date: z.string().min(1),
      title: z.string().min(1),
    }).strict(),
  ).length(3),
  service: z.array(
    z.object({
      date: z.string().min(1),
      title: z.string().min(1),
      url: externalUrl.optional(),
    }).strict(),
  ).length(2),
  media: z.object({
    lead: z.string().min(1),
    links: z.array(
      z.object({
        label: z.string().min(1),
        url: externalUrl,
      }).strict(),
    ).length(4),
  }).strict(),
}).strict();

const parsedSiteDataSchema = z.object({
  profile: profileSchema,
  researchSummary: z.string().min(1),
  publications: publicationsSchema,
  funding: fundingSchema,
  patents: patentsSchema,
  teaching: teachingSchema,
  recognition: recognitionSchema,
}).strict().superRefine((value, context) => {
  const publicationIds = value.publications.map((item) => item.id);
  if (new Set(publicationIds).size !== publicationIds.length) {
    context.addIssue({
      code: "custom",
      path: ["publications"],
      message: "Publication IDs must be unique",
    });
  }
  const publicationSignature = value.publications.map(
    ({ id, category, year, title, venue, details, doi, authors }) =>
      JSON.stringify({
        id,
        category,
        year,
        title,
        venue,
        details,
        doi: doi ?? null,
        authors: authors.map(({ name, profile }) => `${name}:${profile}`),
      }),
  );
  const expectedPublicationSignature = expectedPublications.map((item) =>
    JSON.stringify(item),
  );
  if (publicationSignature.join("|") !== expectedPublicationSignature.join("|")) {
    context.addIssue({
      code: "custom",
      path: ["publications"],
      message:
        "Publication metadata, DOIs, authors, and order must match the curated set",
    });
  }

  const publicationsWithoutDoi = value.publications
    .filter(({ doi }) => !doi)
    .map(({ id }) => id);
  if (
    publicationsWithoutDoi.length !== 1 ||
    publicationsWithoutDoi[0] !== "su-2026-inverse-kinematic"
  ) {
    context.addIssue({
      code: "custom",
      path: ["publications"],
      message: "Only the accepted IAC 2026 publication may omit a DOI",
    });
  }

  const acceptedIacPublication = value.publications.find(
    ({ id }) => id === "su-2026-inverse-kinematic",
  );
  if (acceptedIacPublication?.details !== acceptedIacPublicationDetails) {
    context.addIssue({
      code: "custom",
      path: ["publications"],
      message: "The accepted IAC 2026 status must match the verified CV text",
    });
  }

});

export const siteDataSchema = z
  .unknown()
  .superRefine((value, context) => auditRawVisibleContent(value, context))
  .pipe(parsedSiteDataSchema);

export type SiteData = z.infer<typeof siteDataSchema>;
export type Profile = SiteData["profile"];
export type Publication = SiteData["publications"][number];
export type Funding = SiteData["funding"][number];
export type Patents = SiteData["patents"];
export type Teaching = SiteData["teaching"];
export type Recognition = SiteData["recognition"];
