# 09 — Orchard map hunts

Status: implemented; independent spec and implementation review clear.

## Problem and scope

Gathering currently asks the player to match a named food to a visibly labelled button. Replace that step for new trips with a small mathematical map hunt. Keep the existing equal-basket harvest and real-stock café loop. This increment teaches arithmetic, reading rows and columns, and checking a location against evidence. It makes no science-knowledge or independent-mastery claim.

## Required experience

- A new trip has a frozen 4 × 4 orchard map. Columns run 1–4 left to right; rows run 1–4 bottom to top, with explicit labels and orientation instructions. Sixteen covered plots can be inspected by tap or keyboard. Foods and the target location are not named on unopened plot buttons.
- Two illustrated field-note clues give the target row and column using small addition/subtraction expressions. The underlying coordinates are 1–4; operations use nonnegative whole numbers, with no negative results. The target moves between trips. No random reroll on render, return, or reload.
- The child solves the clues, chooses a plot, and actually reveals a find. A wrong plot remains revealed with its food and location; feedback refers to the observed location and asks the child to compare it with the clues. It adds no stock and does not count as failure or change the target.
- The correct plot reveals the wanted food and opens its existing pictured equal-basket harvest. Counting, numerical answers, explicit help, and packing remain available. This retains a second mathematical action with a concrete quantity consequence.
- Optional “Walk the clues with me” help explains each calculation with counters and highlights the corresponding row and column. The player still inspects the intersection and packs a harvest. Help is retained as guided support; never classified as independent recall.
- Include an optional spoken clue and readable equivalent; no automatic audio, external speech, microphone, drag, timers, penalties, or learner identity. Touch targets at least 44px. At narrow widths the map remains fully visible with row/column labels.
- Preserve every existing guest, order, recipe, shortage target, stock, and story/science/fact record. Older gathering trips retain their original matching search and can finish unchanged. Existing collected/expired trips cannot award again.

## State and implementation boundary

Extend only new gathering trips with `searchKind: 'map-v1'` plus a versioned hunt containing frozen row/column, inspected plot IDs, and help use. Keep the format marker independent of the hunt payload: marked trips with missing/null/invalid hunt metadata must be retired safely, never reinterpreted as legacy. Derive pictured clues and plot contents from frozen trip parameters. Normalize and cap inspected plots to the 16 valid coordinates; invalid new-hunt metadata must not silently become a legacy search. Existing search choices remain the observed food IDs for compatibility; finding a new target requires its recorded plot inspection as well as its correct food observation. The target food occurs only at the target plot. Map help remains separate from harvest support and cannot enable packing. No stock mutation during clue help or inspection. Existing 24-trip, inventory-capacity, and one-pack bounds remain.

The gathering notebook reports map coordinates inspected and map help separately from harvest attempts and harvest support. These are guided practice records, not assessment scores. No new server or storage layer.

## Verification and delivery

Test every map coordinate, deterministic/frozen clues and targets, correct/wrong/repeated inspections, explicit support, old-trip compatibility, malformed metadata, reload, all 11 food routes, no stock during inspection, packing once, and waiting-order preservation. Run existing café/gathering/exposure suites. Browser-check wrong plot → help → target → harvest → pack → café, interruption/reload, read-aloud, keyboard, and 375/768px layouts. Publish to the existing public Site and update the existing draft PR; leave it unmerged.
