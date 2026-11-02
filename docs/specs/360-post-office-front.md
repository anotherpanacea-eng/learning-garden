# 360 · A calmer Post Office front page

Proposed 2026-11-01 on branch `claude/lg56-room-shelves` at `2765e157` (specs 358 and 359, not yet on main), under LG-57. Fleet issue anotherpanacea-eng/fleet-coordination#1413. Spec 359 named the Post Office page body as out of scope; this is that follow-up.

## Purpose

The owner reports that pages feel busy and that players cannot tell what to do next. The Post Office front page (`#post` with no delivery under way, and `#post/choose`) is the busiest place page left. At 820 px it runs about 5,300 px, in this order:

| Section | Height at 820 px |
| --- | --- |
| Heading, "Show me how" | about 275 px |
| "Who will fly today?" courier picker | 342 px |
| Welcome: map, "The post must fly." and the three steps | 730 px |
| Ferry Deck, Which Hat?, Lantern Codes entries | 482 px |
| "The sorting board" (six orders to take) | 807 px |
| Willow Sorting Desk, Willow Double Check entries | 383 px |
| Link row (Choose any order, Lost and Found Board and others) | 119 px |
| "Where could this take us?" | 394 px |
| "More rooms at the Post Office" shelf (spec 359) | about 1,080 px |

The page's main job, taking a delivery from the sorting board, starts about 1,900 px down, below the courier picker and three other rooms' entries. A child who has flown before sees the full courier picker again on every visit.

## Changes

All four apply to the front page only. The delivery view (a delivery under way) is unchanged, except that its shelf is the same as today's.

1. **The courier picker folds once an explorer has made a delivery.** When the explorer has at least one kept Post Office visit, the front page shows the picker inside the same closed fold the delivery view already uses: `<details class="post-active-courier" id="post-active-courier"><summary>Your courier · change character</summary>…</details>`. An explorer with no visits still sees it open, so the first choice is unchanged. The fold has an id, so the existing redraw keeps it open after a courier, portrait or pronoun button is pressed.
2. **The sorting board follows the welcome.** The six orders come directly after "The post must fly." and its steps.
3. **The five side rooms join the room shelf.** Ferry Deck, Which Hat?, Lantern Codes, Willow Sorting Desk and Willow Double Check leave the page body. On the front page they are the first five entries of "More rooms at the Post Office", ahead of spec 359's eight, giving 13. The shelf's new-first order (spec 359) applies to all 13. Each entry's markup is unchanged, byte for byte. In the delivery view the shelf keeps its eight entries, as today, because these five appear only on the front page now.
   - `dist/post-office-ui.mjs` exports `postFrontRooms(state, slug)`, which returns the five entry strings on the front page and `[]` otherwise. `dist/app.mjs` puts them first in the Post Office `roomShelf` list.
4. **"Where could this take us?" folds**, as it already does in the delivery view: `<details class="post-onward"><summary>Explore somewhere else</summary>…</details>`. The link row stays open.

One layout fix in `dist/room-shelves.css`: the instruction notebook entry's envelope art is capped at 72 px inside a shelf cell, so that card is not twice the height of its neighbours.

Nothing is removed. Every link on today's front page is still on it, once each.

## Out of scope

- The delivery view's own layout (packing, flight plan, Bramble).
- The welcome map, the story text and the sorting board's cards.
- The heading's "Show me how" and the equal-groups strip above the page.

## Verification

- `test/post-front-browser.py`, against the real app at 375 and 820 px:
  - Section order on the front page: welcome, then the sorting board, then the link row; no side-room entry sits in the page body.
  - The shelf has 13 entries on the front page and 8 during a delivery, and every expected link is present once.
  - A fresh explorer sees the courier picker open. An explorer with one kept visit sees it folded; opening the fold and pressing another courier selects that courier, and the fold stays open.
  - "Where could this take us?" is inside a closed fold and its links are unchanged.
  - Each of the five side rooms is linked once on the shelf and not in the page body.
- Once, at build time: the front page's `href`s, counted with repeats, are the same as on `2765e157` for a fresh explorer. The receipt goes in the build PR; it is not a standing test, because it needs the old tree.
  - No sideways scroll. For an explorer with a kept visit at 820 px, the page is at least 15% shorter than at `2765e157` (measured: about 5,300 px before).
- `test/room-shelves-browser.py` expects 13 Post Office entries on the front page. Its first-entry check moves from Exchange Manifest to Ferry Deck: on the test's fixed date both are new, and Ferry Deck now comes first in the stable new-first order (Codex spec review).
- The existing suites that use the Post Office front page still pass: act-two, ferry, which-hat, sorting-desk, willow-double, lost-found, post-flight-button, parcel-packing (allowing for its timeout on main), courier-clock, two-letters, room-shelves, new-for-you. `node scripts/run-checks.mjs` passes.
