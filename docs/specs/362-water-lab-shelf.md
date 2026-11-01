# 362 · Water Lab: a room shelf and a folded onward list

Proposed 2026-11-01 on branch `claude/lg58-numbers-front` (specs 358–361, not yet on main), under LG-59. Fleet issue anotherpanacea-eng/fleet-coordination#1417. This follows specs 359–361 to the next-busiest place page.

## Purpose

The owner reports that pages feel busy. The Water Lab front page (`#science`) runs about 3,740 px at 820 px. Below the lab itself it stacks three room entries one after another (Hundred Cups, "Follow the rain, token by token" and The Measuring Desk, about 530 px together), then an open "Where could this take us?" (500 px).

## Changes

1. **The three entries go on a room shelf.** Wherever the Water Lab shows them today, `dist/app.mjs` passes them to spec 359's `roomShelf('More rooms at the Water Lab', […])` in today's order: `waterEntry()`, `rainPathsEntry()`, `measurementEntry()`. Each keeps today's conditions. Hundred Cups is left out during an active play view, and none of the three shows on `#science/window` or `#science/evidence`. `roomShelf` drops an empty entry, keeps markup byte for byte, and puts new rooms first.
2. **"Where could this take us?" folds on `#science`**, using spec 361's `details.place-onward` fold ("Explore somewhere else"). Other Water Lab routes keep it open, as today.

No new CSS. The shelf uses `room-shelves.css` and the fold uses `number-garden-front.css`.

## Out of scope

- The lab's own hub, guide rail and footnote.
- Folding invitations on other places.

## Verification

- `test/water-lab-front-browser.py`, against the real app at 375 and 820 px:
  - one "More rooms at the Water Lab" shelf with three entries, linking `#science/water-shares`, `#science/rain` and `#science/measure`, each once;
  - no entry outside the shelf, no sideways scroll, and nothing spills out of a card;
  - the invitations sit in a closed `details.place-onward` on `#science`; opening it shows the links;
  - `#science/window` shows no shelf;
  - at 820 px the page is at least 15% shorter than about 3,740 px.
- The existing suites that use the Water Lab still pass: measuring-desk, room-shelves, new-for-you and learning-journeys. `node scripts/run-checks.mjs` passes.
