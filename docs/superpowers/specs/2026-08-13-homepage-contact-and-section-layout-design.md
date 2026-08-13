# Homepage Contact and Section Layout Design

## Goal

Improve information hierarchy without adding visual complexity: place the two primary contact links beside Yuling Shen's identity, and separate content categories that currently share headings.

## Header

- Place the email link and `Google Scholar` directly below the `Yuling Shen` heading.
- Keep both links on one compact, wrapping line separated by the existing flex gap.
- Render the email as `ylshen07@suda.edu.cn`; keep the current `mailto:` target.
- Keep the existing Google Scholar label and URL.
- Put the appointment, location, education, and PhD advisor details below this contact line in their current order.
- Reuse the existing link typography and blue palette. Do not add icons, buttons, badges, backgrounds, or a new font size.

## Main Sections

Use this top-level section order:

1. Research Areas
2. Publications
3. Research Funding and Projects
4. Patents
5. Research Software
6. Teaching and Supervision
7. Awards
8. Academic Service
9. Media

`Patents` contains only the existing two year groups and five patent entries. `Research Software` is a separate compact section containing the existing TsgDMC link and description.

`Awards` contains only the existing awards list. `Academic Service` is a separate section containing only the existing service list. The data and wording do not change.

## Structure and Accessibility

- Give every top-level section its own stable `id`, unique heading `id`, and matching `aria-labelledby`.
- Preserve semantic `<section>` landmarks and existing `SectionHeading` styling.
- Remove the old combined `patents-software` and `awards-service` landmarks.
- Preserve link destinations, keyboard focus styling, responsive wrapping, and the absence of horizontal overflow.

## Scope

This change does not add or remove profile facts, publications, funding items, patents, software, awards, service entries, media links, navigation, icons, or CV links. It does not change the color palette, typography scale, portrait, or spacing system beyond the minimum header spacing needed for the moved links.

## Verification

- Add structural tests for the contact line's direct placement after the name and before the appointment.
- Add structural tests for the nine-section order and separate section landmarks.
- Update patent, software, awards, service, and end-to-end selectors to use the new section IDs.
- Run Astro checks, unit tests, built-page tests, and desktop/mobile Playwright tests before publishing.
