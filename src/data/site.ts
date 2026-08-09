import funding from "./funding.json";
import patents from "./patents.json";
import profile from "./profile.json";
import publications from "./publications.json";
import recognition from "./recognition.json";
import teaching from "./teaching.json";
import researchSummarySource from "../content/profile.md?raw";
import { siteDataSchema } from "./schema";

const parsedSiteData = siteDataSchema.parse({
  profile,
  researchSummary: researchSummarySource.trim(),
  publications,
  funding,
  patents,
  teaching,
  recognition,
});

export const siteData = parsedSiteData;
