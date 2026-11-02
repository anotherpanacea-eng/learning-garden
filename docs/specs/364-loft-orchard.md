# 364 · Story Loft room shelf; folded onward lists on the Loft and Cloud Orchard

Proposed 2026-11-01 on branch `claude/lg60-living-front` (specs 358–363, not yet on main), under LG-61. Fleet issue anotherpanacea-eng/fleet-coordination#1420.

## Purpose

The owner reports that pages feel busy. Two place pages still end the way the Water Lab and Number Garden did before specs 361 and 362:

- **Story Loft (`#loft`, about 2,840 px at 820 px).** Below the stage it stacks five room entries one after another, about 550 px in all: the changing letter, the instruction notebook, the puppet notice printer, Sentence Bridges and the shadow theatre. Then comes an open "Where could this take us?" of about 400 px.
- **Cloud Orchard (`#orchard`, about 3,040 px).** It ends with an open "Where could this take us?" of 500 px.

## Changes

1. **The Loft's entries go on a room shelf.** Wherever `dist/app.mjs` appends them to the Loft page today, they go to spec 359's `roomShelf('More rooms in the Story Loft', [...])` instead, in today's order: `letterEntry('loft')`, `instructionEntry('loft')`, `noticeEntry()`, `bridgesEntry()`, `shadowEntry()`. Markup is unchanged byte for byte, and new rooms come first.
2. **"Where could this take us?" folds on `#loft` and `#orchard`**, using spec 361's `details.place-onward` fold. The invitation appender's fold condition grows from `#numbers` and `#science` to these two hashes as well.

No new CSS.

## Out of scope

- The Loft stage, ideas, show shelf and grown-up panel; the Orchard game itself and the Bramble invite.
- The Workshop and Word Garden. Their invitations or trailing links are rendered differently.

## Verification

- `test/loft-orchard-browser.py`, against the real app at 375 and 820 px:
  - `#loft` has one "More rooms in the Story Loft" shelf with five entries, each Loft room linked once on it and not outside it;
  - the invitations sit in a closed `details.place-onward` on `#loft` and on `#orchard`, and opening the fold shows the links;
  - no sideways scroll, and nothing spills out of a shelf card.
- `test/numbers-front-browser.py` used `#loft` as a place that keeps open invitations. It now uses `#activities/fractions`.
- The existing suites that use these pages still pass: sentence-bridges, shadow-theatre, act-two, room-shelves, new-for-you and learning-journeys. `node scripts/run-checks.mjs` passes.
