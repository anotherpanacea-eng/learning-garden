# 363 · Living Garden front page: the main activity first

Proposed 2026-11-01 on branch `claude/lg59-water-lab-shelf` (specs 358–362, not yet on main), under LG-60. Fleet issue anotherpanacea-eng/fleet-coordination#1418.

## Purpose

The owner reports that pages feel busy and that players cannot tell what to try. On the Living Garden front page (`#living`), four room strips sit between the heading and the page's main activity, "Who shall we look for?". They are Food links, Build a food-link fork, One butterfly and Body clues, about 450 px at 820 px. The animal choice starts below them, and the same page already ends with spec 359's "More Living Garden rooms" shelf.

## Change

On bare `#living` only, the four strips move from above "Who shall we look for?" to the front of the "More Living Garden rooms" shelf, which goes from 7 entries to 11. The shelf's new-first order (spec 359) applies.

- `dist/living-spiral-ui.mjs` exports `livingHubRooms()`, which returns the four strips' markup unchanged, byte for byte, as a list. `spiralPage(state, slug)` still renders them in place when it shows its hub with a slug (for example `#living/visit` with no visit waiting), because those routes have no shelf.
- `dist/app.mjs` puts `...livingHubRooms()` first in the bare-`#living` `roomShelf` list.

No text, link or CSS changes. Every link on today's `#living` is still there, once each.

## Out of scope

- The heading, the animal choice, settings, the adaptive and grown-up panels, and the invitations.
- Slugged Living pages.

## Verification

- `test/living-front-browser.py`, against the real app at 375 and 820 px:
  - on `#living`, "Who shall we look for?" is the first section after the heading and "Show me how", and no strip sits above it;
  - the shelf has 11 entries, and `#living/food`, `#living/fork`, `#living/stages` and `#living/bodies` are each linked once on it;
  - no sideways scroll, and nothing spills out of a shelf card;
  - on `#living/visit` with no visit waiting, the four strips are still in the page.
- `test/room-shelves-browser.py` expects 11 Living Garden entries.
- The body-clues, food-links and life-stages integration checks asserted each strip's link inside `adaptivePage(s)`. They now assert it in `livingHubRooms()`, because on bare `#living` the app puts the strips on the shelf.
- The existing Living suites that use the front page still pass: fossil-close, feeding-board, room-shelves, new-for-you and learning-journeys. `node scripts/run-checks.mjs` passes.
