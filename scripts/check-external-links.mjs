import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { isAcceptedLinkStatus } from "./link-status-policy.mjs";

const dataDirectory = new URL("../src/data/", import.meta.url);
const dataPath = fileURLToPath(dataDirectory);
const files = (await readdir(dataDirectory)).filter((name) =>
  name.endsWith(".json"),
);
const urls = new Set();

function collect(value) {
  if (typeof value === "string" && value.startsWith("https://")) {
    urls.add(value);
  } else if (Array.isArray(value)) {
    value.forEach(collect);
  } else if (value && typeof value === "object") {
    Object.values(value).forEach(collect);
  }
}

for (const file of files) {
  const contents = await readFile(join(dataPath, file), "utf8");
  collect(JSON.parse(contents));
}

const failures = [];
for (const url of urls) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "Yuling-Shen-homepage-link-check" },
    });
    if (!isAcceptedLinkStatus(response.status)) {
      failures.push(url + " -> HTTP " + response.status);
    } else {
      console.log("OK " + response.status + " " + url);
    }
  } catch (error) {
    failures.push(url + " -> " + error.message);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
