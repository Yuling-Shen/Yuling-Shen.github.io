# Yuling Shen Academic Homepage

Static Astro homepage derived from the academic CV dated 9 August 2026.

## Local development

1. Install Node.js 22 or newer.
2. Run `npm install`.
3. Run `npx playwright install chromium` to install Playwright's bundled
   Chromium for browser tests. If it is unavailable locally, the test
   configuration automatically falls back to an installed Google Chrome.
4. Run `npm run dev`.
5. Open <http://localhost:4321>.

## Content updates

Edit the focused JSON files in `src/data` and the research summary in
`src/content/profile.md`. Every build validates required fields, record
counts, DOI URLs, duplicate IDs, and excluded landing-page data.

Update all existing `sourceDate` values and the visible `lastUpdated` value
together when the source CV changes. The retained
`public/cv/Yuling-Shen-CV.pdf` file is archival and is not linked from the
homepage.

To add a portrait, create `public/images/profile.jpg`. When the file is
absent, the site renders the finished YS initials block.

## Verification

Run:

    npm test
    npm run check
    npm run test:e2e
    npm run check:links

## GitHub Pages

The deployment workflow reads the Pages origin and base path from
`actions/configure-pages`. It therefore supports both `username.github.io`
repositories and project repositories without hard-coded account names. CI
checks example root and project outputs, then rebuilds the uploaded artifact
with the real Pages origin and base path. Enable GitHub Pages with GitHub
Actions as the source, then push `main`.
