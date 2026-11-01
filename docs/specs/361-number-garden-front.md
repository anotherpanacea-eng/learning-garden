# 361 · A calmer Number Garden front page

Proposed 2026-11-01 on branch `claude/lg57-post-front` (specs 358–360, not yet on main), under LG-58. Fleet issue anotherpanacea-eng/fleet-coordination#1416. Spec 359 named the Number Garden's "Pick a patch of possibility" areas as out of scope; this is that follow-up.

## Purpose

The owner reports that pages feel busy. After spec 360, the Number Garden front page (`#numbers`) is the longest place page: about 5,860 px at 820 px.

| Section | Height at 820 px |
| --- | --- |
| Hero ("Count what we have. Plan what can grow.") | 745 px |
| "On Moss's planning table" and the Living Garden and multiplication strips | about 880 px |
| "Pick a patch of possibility": seven area cards | 1,464 px |
| "More rooms in the Number Garden" shelf (spec 359) | 1,555 px |
| Growing-garden link | 86 px |
| "Where could this take us?" | 500 px |

Each area card stacks a 73 px picture, the title, a sentence, a story line and two links, so it is about 340 px tall. Seven of them take four rows at tablet width and seven rows on a phone.

## Changes

1. **Area cards put the picture beside the title.** In `.paths .area-card`, the picture is 64 px wide in a left column next to the title and the first sentence. The story line and the two links sit below. The card padding goes from 25 px to 20 px. All text, links, order, the seven cards and the grid's column count are unchanged. This applies at every width, phones included.
2. **"Where could this take us?" folds on `#numbers`**, as it does on the Post Office: `<details class="place-onward"><summary>Explore somewhere else</summary>…</details>`. The invitations' markup inside the fold is unchanged. Other places, and Number Garden pages with a slug, keep today's open invitations.

The CSS lives in a new `dist/number-garden-front.css`, linked from `index.html`. The fold reuses the Post Office fold's look: a top rule, a 44 px summary, no other styling.

## Out of scope

- The hero, the planning table, the room shelf and the growing-garden link.
- Folding invitations on other places.
- The area cards' wording.

## Verification

- `test/numbers-front-browser.py`, against the real app at 375 and 820 px:
  - seven area cards, each with its picture to the left of its title (the picture's right edge is left of the title's left edge, and their tops overlap);
  - each card keeps its two links;
  - the invitations sit in a closed `details.place-onward` on `#numbers` and keep their links; `#science` still shows them open;
  - no sideways scroll, and nothing spills out of a card;
  - at 820 px the area grid is at least 15% shorter than 1,384 px, and at 375 px at least 15% shorter than its height on `claude/lg57-post-front` (measured at build).
- The existing suites that visit the Number Garden still pass: map-startup-browser (seven open patches), room-shelves, new-for-you, home-entry and learning-journeys. `node scripts/run-checks.mjs` passes.
