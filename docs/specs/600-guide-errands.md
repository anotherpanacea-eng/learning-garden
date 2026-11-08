# 600 · Guide errands: a reason to go, and a reason to go on

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `ec057c7c`. **Specification and a bounded first build, not release clearance.** The complete finite text is in [the 600 companion](../content/600-guide-errands-text.md). Numbered 600, outside the run Codex is using for new benches, so the two never collide.

## Problem

The owner, 2026-11-07: "more story to get players moving into and out of curricula. It's not always clear WHY they should play another game. This can be something the guide helps with."

Today a child who finishes something has three ways on: the room's own back link, the place page, or Home. Each is a list of destinations. The story gives reasons only at its chapter jobs ([248](248-a-town-of-our-own.md), [326](326-both-ways-across-willow-bridge.md), [352](352-act-four-opening.md)), which a child meets only inside the story. Lane B's "Willowbank reason" ([roadmap](../roadmap.md#next-consolidation-lanes--2026-10-30), step 1) puts one asker on a board's own intro, board by board. Nothing carries a child *between* games with a reason, and nothing says how the next game uses the same idea differently.

## Result

The explorer's guide offers errands from the townsfolk, in one place, outside every activity:
1. **On a room** (an activity route), a closed line under the header: *Where next? {guide} has an idea.* Opening it shows two or three onward errands. Each names who in town is asking and why, links the room that helps, and says in plain words how that room uses the same idea in a new way.
2. **On a place page** (Café, Water Lab, Workshop, Post Office, Living Garden and Keeper's Desk in this slice), *Who needs a hand here?* Opening it shows up to three errands that start in that place.
3. **Errands follow the story.** Each errand names the first act it fits. An explorer who has started Act IV sees the orchard keeper's wet corner; one who has not sees only lines that are safe at the start. No errand names a later-act person, place or page before that act.

Errands are invitations. Every room stays open from every page, as now.

## Boundaries

- **No saved state.** The strip never creates a save root, writes a field, marks a room seen, changes familiarity or exposure, or reads any activity's work. It reads only the explorer's chosen guide (`garden.guide`) and whether Acts II to IV have started, through the existing pure `actTwoView`, `actThreeView` and `actFourView`. An unreadable story reads as Act I.
- **No completion detection.** The onward errands are always there, closed. They never claim the child did, finished or learned anything. Lines say what a neighbor needs, never "now that you've…".
- **No gating, ordering or recommendation by performance.** No progress, support, age or challenge band chooses an errand. The same route shows the same errands to every explorer at the same act.
- **Outside activity markup.** The strip is an `<aside>` between the header and `<main>`. An activity re-render never touches it; the skip link still goes straight to `<main>`. It refreshes after the shell's own route change, and shows nothing on any route without authored errands (Home, Notes, the story routes, the explorer chooser).
- **No duplication of a board's own asker.** Room lines are about where to go *next*, so they never restate or contradict the reason a board gives on its own intro.
- **Not a lesson, map or coverage claim.** Errands add no teaching, no atlas mapping and no course route. They name connections that the linked rooms already teach.

## First slice

Six threads, each a town need that runs across rooms and subjects, plus place-page errands. The companion has every line.

| Thread | Rooms with onward errands |
| --- | --- |
| The gathering | Serving bench, Sharing Counter, Fraction Trail, Whole batches, Gathering Budget, Coin Counter |
| Where the water goes | Water Evidence Shelf, Rain Paths, Rain charts, Seedlings after the storm, Two pots, two kinds of light, Dot's weather notes, My Count Collection |
| Words that reach a reader | Instructions for a reader, Puppet Notice Printer, Letter-mending desk, The Writing Table |
| Bramble's ribbons | Bramble's ribbon bench, Ribbon Recut Table, Ribbon Measures, Same ground, different fence |
| The courier's routes | Cartographer's Table, Same route, different scale, Courier Clock Walk, The Courier's Price, The path to Willow Bridge |

That is 26 rooms and six place pages. Threads cross: an errand may lead from one thread into another, because the town's needs do. Each room shows two or three destinations at every act, one errand per destination.

**Act-tagged errands in this slice:** Ember's birthday and the weekly market (Act II); the reed seeds from Vadoalto, Nuria's thank-you letters and the courier's walk upstream (Act III); the orchard keeper's wet corner, Wren's flood ledger and Room for the River for the low-fields argument (Act IV). Each points at a room that is already the act's chapter host or a fitting bench (spec 120 §7 and §8; Act II, III and IV chapter readers in 248, 326 and 352). An errand never offers work to the story; only the act's own chapter page does that.

**Rooms that wait for an act.** Two Letters names Vadoalto and Nuria throughout, and the flood ledger bench names Hollis and Vadoalto. No errand links to Two Letters before Act III, or to the ledger before Act IV. The rooms stay open from their own place pages, as now.

## Presentation

`dist/guide-errands-content.mjs` (finite copy), `-core.mjs` (pure route and act reads), `-ui.mjs` (HTML and the installer), `guide-errands.css` (scoped to `#guide-errands`, loaded by the installer). `app.mjs` gains one import and one install call at the end of the file; no other shell line changes.

The strip shows the guide's small portrait and a native `<details>`, closed. Opened, the errands are cards, each with a sentence and one link. Targets are 44 px, text 16 px, focus visible. The portrait and cards arrive with a short pin-up animation; reduced motion shows them still. At 320 px the cards stack.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5` (14 commits past the `e88f81a` that 352 studied), studied only. Jane's `LESSONS.md` gives every pack a story hook, and its market lets the learner pick the next quest from two or three ready topics. Errands take the same idea: two or three onward choices, each with a story reason. Jane's points, medals, review gates, bosses, mastery inference and nightly authoring are not adopted. No Jane code, prose or assets are copied.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. Errands claim no topic and add no atlas mapping; they connect rooms whose own declarations already sit in `curriculum/topic-coverage.csv`.

**Spec 49.** Errands add no lesson, so they owe no teaching encounter, contrast or supported practice of their own (§5, steps 1 to 4). What they do is make §5's step 5 (a new application, "a changed representation, unknown, reader, dataset or setting that requires the same idea") and step 6 (a purposeful revisit "in another act/game") visible to the child as a reason, in the guide's voice: each onward line names the same idea in a new setting. They add no free text (step 7). In 49's six-act frame they belong to no single act; act-tagged errands sit in Acts II to IV beside the chapters that already host them.

**Hard-prerequisite crosswalk** against the pinned `curriculum/marble/dependencies.json`, using the routes declared in `topic-coverage.csv`. Of the 61 onward links, 22 join two rooms that both have declared topics. Among those, 8 hard edges run forward (the destination's topic builds on the current room's) and 5 run back (the destination holds a foundation of the current room, for example Ribbon Recut back to Fraction Trail). Both directions are fine for an open invitation: no line calls a room harder, easier or "next", and every room stays open. The other 39 links touch at least one room with no declared topic, so the crosswalk says nothing about them.

**Spec 120.** Errands live in Willowbank's everyday life between chapters: the cast in §4 and the jobs in §8 ("every chapter offers jobs at more than one depth", "any job is a whole contribution"). §11's rules hold: nothing waits for harder work, the town is never broken to make a reason, and no errand claims to advance the story. The act-tagged lines follow §7's chapter events, and the spoiler rule follows §10's arrivals: nothing from a later act shows before that act starts.

**Lane B, step 1.** That step adds one Willowbank reason to the intro of a board that has none. Errands do not replace it: a board's own intro still owns why you are *there*, and errands own why to go somewhere *else*. Where a destination already names an asker (Pip's welcome-back tables, Bramble's knotted ribbons, the orchard keeper's fence wire), the errand uses that same asker.

All new prose is original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion. No language panel is needed; the companion ships no non-English text.

Pure checks (`test/guide-errands-checks.mjs`):
- Every link is a registered room, never the room it sits on, and every place-page errand links a room listed on that place page.
- Every room shows two or three distinct destinations at every act; every place page has three distinct destinations before any act starts.
- A later-act line for a destination is listed before any earlier line for the same destination; place pages list later acts first.
- A line or label that names a later act's person, place or event (Ember's birthday; Nuria, Vadoalto, Léon, Les Saules, upstream, carrizo; the Gazette, the wet corner, the low fields) waits for that act.
- Act reach comes from real saves: a fresh notebook, Act II started through `startActTwo`, Act III through `startActThree`, Act IV through `startActFour`. A missing, unreadable or null story reads as Act I.
- Lookup is exact: Home, Notes, a deeper route, a query, the wrong case and non-strings show nothing.
- Rendering every strip at every act leaves a deep-frozen notebook unchanged, names each guide, falls back to the first guide, and escapes hostile strings.

Browser journey (`test/guide-errands-browser.py`), at 320 and 820:
- The strip sits just before `<main>` and outside it, starts closed, names the chosen guide, and opens to the Act I errands with the right links and 44 px targets.
- No horizontal overflow; the strip survives an activity re-render of `<main>`; opening it writes nothing to storage.
- Following an errand refreshes the strip for the next room; Home and Notes show none; the summary opens with Enter.
- A place page shows the errands that fit a fresh, an Act II and an Act IV notebook.
- Reduced motion shows the strip still; otherwise it arrives with its pin-up animation.

Run before the PR: `node test/guide-errands-checks.mjs`, the browser journey, `node scripts/check-child-copy.mjs`, and the full source runner on the candidate.

Physical iPad, Safari, VoiceOver and learning effects remain unqualified. Whether errands actually move children between games is an owner observation, not something these checks can show. This is followed by an exact-head implementation review and the repository's landing procedure.
