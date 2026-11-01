# 359 · Room shelves on long place pages

Proposed 2026-11-01 on branch `claude/lg55-new-for-you` at `0192072c45f994ca66b3989f57c0d34f8cc6c277` (spec 358, not yet on main), under LG-56. Fleet issue anotherpanacea-eng/fleet-coordination#1409. This is the follow-up that spec 358 named as out of scope: "Regrouping other long pages (Post Office, Number Garden, Keeper's Desk)."

## Purpose

The owner reports that pages feel busy. On current main, three place pages end with a long run of separate room entry cards, each a full-width block with its own heading, paragraph and link, stacked one after another:

| Place | Appended entries | Height of that run at 820 px |
| --- | --- | --- |
| Number Garden (`#numbers`) | 15: Mixing Table to Willow Bridge | about 2,200 px of a 6,300 px page |
| Post Office (`#post`) | 8: letter-mending desk to Exchange Manifest | about 980 px |
| Living Garden (`#living`, no slug) | 7: Feeding Board to Fossil Close-Look | about 1,300 px |

These entries are joined in one place, the render function in `dist/app.mjs`. This spec gathers each run into one "room shelf": a labeled section whose entries sit in a compact grid, with rooms that are new for this explorer (spec 358) first.

## Room shelf

A new helper, `roomShelf(title, entries)`, lives in `dist/new-for-you.mjs`:

- `entries` is the existing list of entry HTML strings, in their current order. Each entry is kept byte for byte. No entry function, module, link, text or art changes.
- An entry is new when **any** `href="#…"` in its string is a room that is new for the chosen explorer. Some entries link several rooms: `letterEntry('post')` links Messages first and the changing letter round second, and either may be the new one. New entries move to the front, keeping their relative order, and the rest follow in their current order. An entry with no route, or no explorer chosen (the picker is showing), keeps its place.
- Empty entries (an entry function that returned `''`) are dropped. If nothing is left, the helper returns `''`.
- It returns `<section class="room-shelf" aria-labelledby="…"><h2 id="…">${title}</h2><div class="room-shelf-grid">${entries}</div></section>`.

Titles:

- Number Garden: "More rooms in the Number Garden"
- Post Office: "More rooms at the Post Office"
- Living Garden: "More Living Garden rooms"

Only the joined runs change:

- **Number Garden.** The 15 entries from `mixingTableEntry()` through `willowPathEntry()` go into the shelf. The progress strip and learning invitations after them stay below it, unchanged.
- **Post Office.** The 8 entries from `letterEntry('post')` through `manifestEntry()` go into the shelf. `equalGroupEntry('bramble')` above the page and the page itself are unchanged.
- **Living Garden.** On the bare `#living` page only, the `otherLiving` run goes into the shelf. Slugged Living pages keep today's markup, including the folded "Other Living Garden investigations" on `#living/movement`.

## Layout

`dist/room-shelves.css` (linked from `index.html`):

- The grid uses `repeat(auto-fill, minmax(260px, 1fr))` with a 14 px gap. That gives one column on a phone and two or three on a tablet or desktop.
- Each grid child loses its outer margin and spans one cell. Headings inside an entry are reduced to about 1.15 rem, so a card reads as a card, not a page section.
- Entries keep their own internal classes and styles. Any entry whose own layout breaks in a cell is listed in the build PR and gets one targeted rule. No entry markup changes.
- Nothing is folded or hidden. The shelf shortens the page by placing entries side by side, not by concealing them.

## Out of scope

- The Post Office page body (courier choice, sorting board, Which Hat?, Lantern Codes and the rest), the Number Garden's "Pick a patch of possibility" areas, the Keeper's Desk and the Café. Their structure is owned by their own specs.
- Any change to an entry's wording or to which entries appear.

## Verification

- `test/room-shelves-checks.mjs` covers the helper:
  - entries are kept byte for byte, apart from the new-first order;
  - the order is stable;
  - empty entries are dropped;
  - an entry is promoted when any of its links is new (the real `letterEntry('post')`, with Messages opened and the changing letter round still new);
  - the order is unchanged with no active record;
  - nothing is rendered when there are no entries.
- `test/room-shelves-browser.py` checks the real pages at 375 and 820 px:
  - each shelf holds the expected number of entries, and every expected link is present once;
  - a new room's entry comes first;
  - the page has no sideways scroll;
  - at 820 px the Number Garden is at least 1,000 px shorter than on the base branch.
- The existing browser suites that visit these pages still pass: home-entry, learning-journeys, explorer-concurrency, and those whose rooms sit on the shelves, such as mixing-table, gap-line, ratio-bars, field-strips and feeding-board. `node scripts/run-checks.mjs` passes.
