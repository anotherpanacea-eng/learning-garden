# 365 · Workshop: a folded onward list

Proposed 2026-11-01 on branch `claude/lg61-loft-orchard` (specs 358–364, not yet on main), under LG-62. Fleet issue anotherpanacea-eng/fleet-coordination#1421.

## Purpose

The owner reports that pages feel busy. The Post Office, Number Garden, Water Lab, Story Loft and Cloud Orchard now fold "Where could this take us?" into "Explore somewhere else" (specs 360–364). The Workshop front page (`#workshop`, about 3,000 px at 820 px) still shows it open at the bottom of its page, about 400 px.

## Change

`workshopPage` in `dist/workshop-ui.mjs` wraps its `learningInvitations('workshop')` in spec 361's fold: `<details class="place-onward" id="workshop-onward"><summary>Explore somewhere else</summary>…</details>`. The fold applies wherever that render runs: bare `#workshop`, `#workshop/new` and a waiting experiment. This matches the Post Office, which folds in both its front and delivery views. Workshop tables with their own pages (`#workshop/lantern`, `#workshop/maps` and the rest) are unchanged. The invitations' markup inside the fold is unchanged. No new CSS.

## Verification

- `test/workshop-fold-browser.py`, at 375 and 820 px:
  - `#workshop` has one closed `details.place-onward` holding the invitations;
  - after starting a comparison, an opened fold stays open when a setting button redraws the page (the Workshop's redraw keeps only `details[id]` open; Codex build review);
  - opening it shows the links, and one of them opens its place;
  - the three Workshop groups (spec 358) and their 22 tables are unchanged;
  - no sideways scroll.
- The existing suites that use the Workshop front page still pass: new-for-you, room-shelves, home-entry and learning-journeys. `node scripts/run-checks.mjs` passes.
