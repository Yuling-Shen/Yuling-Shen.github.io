# Homepage Contact and Section Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the email and Google Scholar links beside the profile identity and split patents/software and awards/service into independent, correctly ordered homepage sections.

**Architecture:** Preserve the existing Astro static-site architecture and data schemas. Move the existing contact markup within `ProfileHeader.astro`, replace the combined patent/software component with two focused components, and render awards and academic service as sibling sections in `index.astro`. Lock the information hierarchy with built-HTML and Playwright tests.

**Tech Stack:** Astro, TypeScript, CSS, Vitest, Cheerio, Playwright, axe-core, GitHub Pages

## Global Constraints

- Keep the visible email text and `mailto:` destination as `ylshen07@suda.edu.cn`.
- Keep the existing Google Scholar label and URL.
- Do not add icons, buttons, badges, backgrounds, navigation, CV links, or a new typography size.
- Keep all existing profile, patent, software, award, and academic-service wording and data unchanged.
- Use this exact top-level order: Research Areas, Publications, Research Funding and Projects, Patents, Research Software, Teaching and Supervision, Awards, Academic Service, Media.
- Every top-level section must have a unique `id`, heading `id`, and matching `aria-labelledby`.
- Preserve desktop/mobile wrapping, keyboard focus styling, axe accessibility, and zero horizontal overflow.

---

### Task 1: Move profile links below the name

**Files:**
- Modify: `tests/site/homepage.test.ts:31-62`
- Modify: `src/components/ProfileHeader.astro:21-54`
- Modify: `src/styles/global.css:103-140`

**Interfaces:**
- Consumes: `Profile.email: string` and `Profile.scholarUrl: string`.
- Produces: `.profile-copy` whose first three element children are `h1`, `.profile-links`, and `.appointment`.

- [ ] **Step 1: Add the failing placement assertion**

Add this block after the existing email `href` assertion in the first built-homepage test:

```ts
const profileChildren = $(".profile-copy").children();
expect(profileChildren.eq(0).is("h1")).toBe(true);
expect(profileChildren.eq(1).is(".profile-links")).toBe(true);
expect(profileChildren.eq(2).is(".appointment")).toBe(true);
expect(profileChildren.eq(1).find("a").map((_, element) =>
  $(element).text(),
).get()).toEqual(["ylshen07@suda.edu.cn", "Google Scholar"]);
```

- [ ] **Step 2: Run the built-page test and verify red**

Run: `npm run test:site`

Expected: FAIL because `.profile-links` is currently the last child of `.profile-copy`, not child index 1.

- [ ] **Step 3: Move the existing links and add compact spacing**

Change the beginning of `.profile-copy` in `ProfileHeader.astro` to:

```astro
<div class="profile-copy">
  <h1>{profile.name}</h1>
  <div class="profile-links">
    <a href={`mailto:${profile.email}`}>{profile.email}</a>
    <a href={profile.scholarUrl}>Google Scholar</a>
  </div>
  <p class="appointment">
    {profile.role}, {profile.unit}, {profile.institution}, {profile.country}
    <span class="supporting">{" \u00b7 "}{profile.appointmentDates}</span>
  </p>
```

Remove the old `.profile-links` block after `</ul>`. Update the existing CSS rule to:

```css
.profile-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1rem;
  margin-bottom: 0.55rem;
  font-size: var(--supporting-size);
}
```

- [ ] **Step 4: Verify the focused change**

Run: `npm run test:site`

Expected: 1 site test file passes with 14 tests, and the new ordering assertion passes.

Run: `npm run test:e2e`

Expected: 6 tests pass across desktop and mobile; the Google Scholar focus outline test still passes.

- [ ] **Step 5: Commit the header change**

```bash
git add src/components/ProfileHeader.astro src/styles/global.css tests/site/homepage.test.ts
git commit -m "feat: place profile links beside name"
```

---

### Task 2: Split Patents and Research Software

**Files:**
- Create: `src/components/PatentList.astro`
- Create: `src/components/ResearchSoftware.astro`
- Delete: `src/components/PatentSoftware.astro`
- Modify: `src/pages/index.astro:2-37`
- Modify: `tests/site/homepage.test.ts:160-194`
- Modify: `tests/e2e/homepage.spec.ts:15-20`

**Interfaces:**
- Consumes: `siteData.patents: Patents`, where `selected` supplies patents and `software` supplies TsgDMC.
- Produces: sibling `#patents` and `#research-software` sections; `PatentList` accepts `{ patents: Patents }`, and `ResearchSoftware` accepts `{ software: Patents["software"] }`.

- [ ] **Step 1: Rewrite the built-page expectations for separate sections**

Replace the patent/software test with:

```ts
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
```

- [ ] **Step 2: Run the focused built-page test and verify red**

Run: `npm run test:site`

Expected: FAIL because `#patents`, `#research-software`, and their headings do not exist.

- [ ] **Step 3: Create the focused components**

Create `PatentList.astro`:

```astro
---
import type { Patents } from "../data/schema";
import SectionHeading from "./SectionHeading.astro";

interface Props {
  patents: Patents;
}

const { patents } = Astro.props;
const patentGroups = [...new Set(patents.selected.map(({ year }) => year))].map(
  (year) => ({
    year,
    id: `patent-year-${year}`,
    patents: patents.selected.filter((patent) => patent.year === year),
  }),
);
---

<section id="patents" aria-labelledby="patents-title">
  <SectionHeading title="Patents" id="patents-title" />
  <div class="patent-groups">
    {
      patentGroups.map((group) => (
        <section class="patent-group" aria-labelledby={group.id}>
          <h3 id={group.id}>{group.year}</h3>
          <ol class="patent-list">
            {group.patents.map((patent) => (
              <li class="patent" data-patent-id={patent.id}>
                <em>{patent.title}</em>.
                <span class="supporting">
                  {" "}&middot; {patent.number} &middot; {patent.role}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))
    }
  </div>
</section>
```

Create `ResearchSoftware.astro`:

```astro
---
import type { Patents } from "../data/schema";
import SectionHeading from "./SectionHeading.astro";

interface Props {
  software: Patents["software"];
}

const { software } = Astro.props;
---

<section id="research-software" aria-labelledby="research-software-title">
  <SectionHeading title="Research Software" id="research-software-title" />
  <p class="software-line">
    <a href={software.url}>{software.name}</a>: {software.description}
  </p>
</section>
```

- [ ] **Step 4: Replace the combined component in the page assembly**

Replace the `PatentSoftware` import and call in `index.astro` with:

```astro
import PatentList from "../components/PatentList.astro";
import ResearchSoftware from "../components/ResearchSoftware.astro";
```

```astro
<PatentList patents={siteData.patents} />
<ResearchSoftware software={siteData.patents.software} />
```

Delete `src/components/PatentSoftware.astro`.

- [ ] **Step 5: Update the end-to-end selectors**

Replace the old `#patents-software` assertions with:

```ts
await expect(page.locator("#patents .patent-group")).toHaveCount(2);
await expect(page.locator("#patents .patent-group > h3")).toHaveText([
  "2026",
  "2025",
]);
await expect(page.locator("#patents .patent")).toHaveCount(5);
await expect(page.locator("#research-software .software-line > a")).toHaveText(
  "TsgDMC",
);
```

- [ ] **Step 6: Verify and commit the section split**

Run: `npm run check`

Expected: zero errors.

Run: `npm run test:site && npm run test:e2e`

Expected: 14 built-page tests and 6 Playwright tests pass.

```bash
git add src/components/PatentList.astro src/components/ResearchSoftware.astro src/components/PatentSoftware.astro src/pages/index.astro tests/site/homepage.test.ts tests/e2e/homepage.spec.ts
git commit -m "feat: separate patents and research software"
```

---

### Task 3: Split Awards and Academic Service and lock section order

**Files:**
- Modify: `src/pages/index.astro:38-55`
- Modify: `src/styles/global.css:284-308`
- Modify: `tests/site/homepage.test.ts:196-202,249-258`
- Modify: `tests/e2e/homepage.spec.ts:4-30`

**Interfaces:**
- Consumes: `siteData.recognition.awards` and `siteData.recognition.service`.
- Produces: sibling `#awards` and `#academic-service` sections, and the exact nine-section main-page order.

- [ ] **Step 1: Add failing recognition and section-order assertions**

Replace the recognition assertions in the built-page test with:

```ts
expect($("#awards .dated-item")).toHaveLength(
  siteData.recognition.awards.length,
);
expect($("#academic-service .dated-item")).toHaveLength(
  siteData.recognition.service.length,
);
expect($("#awards-service")).toHaveLength(0);
```

In the landmark test, replace the loose top-level section count with:

```ts
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
```

- [ ] **Step 2: Run the built-page tests and verify red**

Run: `npm run test:site`

Expected: FAIL because `#awards` and `#academic-service` do not exist and the old combined ID remains.

- [ ] **Step 3: Render separate recognition sections**

Replace the combined recognition section in `index.astro` with:

```astro
<section id="awards" aria-labelledby="awards-title">
  <SectionHeading title="Awards" id="awards-title" />
  <DatedList
    items={siteData.recognition.awards.map((item) => ({
      date: item.date,
      title: item.title,
    }))}
  />
</section>
<section id="academic-service" aria-labelledby="academic-service-title">
  <SectionHeading title="Academic Service" id="academic-service-title" />
  <DatedList
    items={siteData.recognition.service.map((item) => ({
      date: item.date,
      title: item.title,
      url: item.url,
    }))}
  />
</section>
```

In `global.css`, replace:

```css
.two-column-details h3,
#awards-service h3 {
```

with:

```css
.two-column-details h3 {
```

Delete the unused rule:

```css
.subsection-heading {
  margin-top: 1rem;
}
```

- [ ] **Step 4: Extend end-to-end visibility checks**

After the research-software assertion, add:

```ts
for (const heading of ["Patents", "Research Software", "Awards", "Academic Service"]) {
  await expect(
    page.getByRole("heading", { level: 2, name: heading, exact: true }),
  ).toBeVisible();
}
```

- [ ] **Step 5: Verify and commit the recognition split**

Run: `npm run check`

Expected: zero errors.

Run: `npm run test && npm run test:e2e`

Expected: 32 unit tests, 14 built-page tests, and 6 Playwright tests pass.

Run: `git diff --check`

Expected: no output.

```bash
git add src/pages/index.astro src/styles/global.css tests/site/homepage.test.ts tests/e2e/homepage.spec.ts
git commit -m "feat: separate awards and academic service"
```

---

### Task 4: Final review and publication

**Files:**
- Review: all files changed since `bad3e80`
- No source file changes expected unless review finds a concrete defect.

**Interfaces:**
- Consumes: the completed static homepage and GitHub Pages workflow.
- Produces: a deployed public page at `https://yuling-shen.github.io/` matching the confirmed design.

- [ ] **Step 1: Review the aggregate diff against the design**

Run:

```bash
git diff --stat bad3e80..HEAD
git diff --check bad3e80..HEAD
git diff bad3e80..HEAD -- src/components src/pages/index.astro src/styles/global.css tests
```

Expected: only the contact placement, section splits, CSS cleanup, and corresponding tests changed; no profile data or copy changed.

- [ ] **Step 2: Run the fresh completion gate**

Run: `npm run check && npm test && npm run test:e2e`

Expected: Astro reports zero errors; 32 unit tests, 14 built-page tests, and 6 Playwright tests pass.

- [ ] **Step 3: Publish the validated main branch**

Run: `git status --short --branch`

Expected: clean `main` branch ahead of `origin/main` only by the new design and implementation commits.

Run: `git push origin main`

Expected: `main` advances successfully and triggers `Deploy academic homepage`.

- [ ] **Step 4: Verify the deployment and public DOM**

Use `gh run list`/`gh run view` to confirm the workflow for the pushed `HEAD` completed with `success`. Then verify `https://yuling-shen.github.io/` returns HTTP 200 and contains:

```text
Yuling Shen
ylshen07@suda.edu.cn
Google Scholar
Patents
Research Software
Awards
Academic Service
```

Check the live DOM order is the nine-section order in the Global Constraints and that the email/Scholar line is directly after the name. Keep the deployed homepage open for the user.
