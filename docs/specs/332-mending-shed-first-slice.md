# 332 · The Mending Shed: a first slice, the Mending Pile and the Shape Bench

Proposed 2026-10-31. Base inspected: `36c1552b51b306212c7c421890556ba6ac73872e`. A bounded first runtime slice of [167](167-mending-shed.md), the roadmap's priority 4E ("materials test-and-choose (167)"), serving backlog card LG-46. **Specification, not implementation or release clearance.** Every child-facing line is in the [copy sheet](../content/332-mending-shed-first-slice-text.md), which ships the named lines of [167's companion](../content/167-mending-shed-text.md) unchanged and adds a short commission table. Sources stay in [167's source audit](../source-audits/167-mending-shed.md).

## Purpose and boundary

167 proposes eight benches. Its commissioning note names the natural first slice: **the Mending Pile** (what is it, and what is it made of?) and **the Shape Bench** (squash, bend, twist, stretch). Build those two, with the arrival, teach cards 1 and 3, an "I'm stuck" ladder on each bench, the grown-up panel and a saved root that later slices extend.

Out of scope: Take it apart, the Job Board, the Test Table, the Sack Test, the Silt Jar, the Scrap Box, the story scenes, teach cards 2, 4 and 5, problem sets A to E, Keeper's Desk, Macintosh, and every act or chapter adapter. The page does not list, tease or count unbuilt benches. Later slices extend this route, controller and root, and must not build a second Mending Shed page.

This is supported practice with authored, simplified pictures. It is not a science assessment, and it never claims a child knows a material from a pick.

## Experience

Route `#workshop/mending`, open from the start. Link it from the Storm Workshop page (`#workshop`) beside the Fair Test Bench link, labeled **The Mending Shed**. No bench requires another.

1. **Arrival.** The companion's place title and first-visit text on a first visit; its later-visit line once a `mendingShed` root exists. The always-shown line (*These are simplified pictures. Real materials can behave differently.*) sits under the title on every view. Then two bench entries, **The Mending Pile** and **The Shape Bench**, each with a progress line from the copy sheet.
2. **Teach first, once per bench.** Opening a bench the first time shows its teach card (card 1 for the pile, card 3 for the shape bench) with **Show me**, which reveals the worked example one step per tap, and **Start**. Start is available at once; the card never gates play. A **What is this bench for?** button reopens the card later. Opening and closing a card makes no write until **Start** is pressed the first time, which records `taught` for that bench.
3. **The Mending Pile.** Twelve object cards from the companion, as native buttons with text labels and a drawn picture. Tap a card to work on it. Two labeled rows appear, **What is it?** and **What is it made of?**, with the card's chip tray from the copy sheet. Tap a chip, then a row, to place it (the same pick-then-place pattern as 324, with a visible "picked up" marker). Tapping a placed chip lifts it back to the tray. **Check** shows one line, the first that applies in the copy sheet's order. A card is **sorted** once a check comes back right. The first card offered is the metal bucket, and it is **guided**: the two questions show as numbered steps beside the rows. The board (heading **Object · made of**) lists each sorted card with its kept chips.
4. **The Shape Bench.** Six samples and four actions from the companion. Choose a sample and an action, then **predict** with one of the three chips. Only then does **Try it** run the action, and **Let go** shows the authored result picture, its result line and the prediction line (matched or not). Slate's bend shows the companion's snap line. The willow note shows whenever the willow rod is chosen. A results grid (sample by action, 6 × 4) fills with each kept outcome as text, never color alone, and scrolls inside its own box at 320 px.
5. **"I'm stuck"** on both benches: rung 1, the bench's teach-card text; rung 2, the companion's worked example for that set, with "how to start this one"; rung 3, **Skip for now**, which leaves the item unsorted and records nothing as a miss. Opening a rung is an explicit write: the current item is marked supported, through preflight, before the rung's text shows. If preflight refuses, the capacity line shows and the rung stays closed.
6. **Grown-up notes.** The companion's *What this teaches* and *What it does not claim* paragraphs, trimmed to this slice as the copy sheet sets out, and the grown-up line from the copy sheet.

No score, timer, lock, mastery label or unlock. Every action has a keyboard path; nothing uses drag.

## Saved work

Optional root `mendingShed` per explorer, the first part of 167's root. It stays absent until the first explicit write: a Start, a check, a Let go or opening a stuck-ladder rung. Rendering, opening a teach card, choosing a card or a sample, placing chips and predicting make no write; the working rows and the open prediction are view state.

```
mendingShed: {
  v: 1,
  taught: { pile: bool, shapes: bool },
  pile: { [cardId]: {
    card: label,                          // as first shown, kept once
    tray: [Chip],                         // order and labels as first shown, kept once
    first: Check | null,                  // the first check, kept once
    latest: Check | null,
    checks: n, sorted: bool, supported: bool, at
  } },
  shapes: { [sampleId]: {
    sample: label,                        // kept once
    actions: { [actionId]: {
      action: label,                      // kept once
      first: Try | null,                  // the first Let go, kept once
      latest: Try | null,
      tries: n, supported: bool, at
    } }
  } }
}
Chip  = { id: chipId, label }
Check = { object: Chip | null, materials: [Chip], line: { id: lineId, text } }
Try   = { predicted: { id: outcomeId, label }, shown: { id: outcomeId, label },
          result: text, prediction: text }
```

- **Codes plus what was shown.** Each record keeps its ids and the authored labels and lines exactly as displayed at that moment: the card's tray in its order, the chips placed, the Check line, the shape outcome, its result line and the prediction line. Nothing typed, no name, photo or audio. Nothing is recomputed on load, so kept work renders as saved after the content module's labels, outcomes, lines or order change, or after an id leaves it.
- **Evidence.** The first check and the first Let go are kept once. Later checks and tries change `latest` and the count. Counts saturate at 9999: a later check or try at the cap still updates `latest`, `sorted` and `at` and leaves the count at 9999. `supported` only turns on, and it records whether any ladder rung was opened for that item before or after the first check, without rewriting `first`. Opening a rung on an item never checked or tried writes a support-only record (`first` and `latest` null, count 0), which stays unobserved. A card skipped or never checked is unobserved.
- **Resuming.** Reopening a kept card shows its kept tray, in its kept order and with its kept labels. A new check uses the current module's rules; if the card or any kept chip id is no longer in the module, the card shows on the board from its kept labels and is read-only. A kept shape cell whose sample or action has left the module stays in the grid from its kept labels and is read-only.
- **Validation and preservation.** Validate shape, not catalogue membership: ids are strings of 1 to 40 characters from `a-z`, `0-9` and `-`; labels and lines are strings of 1 to 200 characters; a tray holds 2 to 12 chips with distinct ids, and placed chips come from the record's own tray; counts are integers 0 to 9999; `first` is null exactly when the count is 0. An unreadable entry stays raw and exportable, its item shows the copy sheet's unavailable line and is read-only, and the rest of the shed stays open. An unknown `v` keeps the whole root raw, shows the copy sheet's version line and a Notes link, and makes the benches read-only.
- **Preflight.** Every explicit write is cloned and checked against `dist/progress-limits.mjs` and the real Notes export before it commits. A refusal shows the capacity line and leaves the save and the view unchanged.
- Notes export, import, reset and explorer switching carry `mendingShed` through the existing transfer. Add `mendingShed: 'The Mending Shed'` to `progress-transfer.mjs`'s destination names.

Later slices add 167's `jobs`, `tables`, `sack` and `scrap` beside these keys under `v: 1`; this slice must accept and preserve unknown sibling keys exactly.

## Integration

New modules `dist/mending-shed-content.mjs`, `-core.mjs`, `-ui.mjs` and `mending-shed.css`, with drawn SVG pictures for the twelve cards and six samples (no photographs). In `dist/app.mjs`, add the exact `#workshop/mending` branch with the current exact-route conventions (explorer initialization, switch, restoration, welcome-film exclusion and route cleanup, as spec 320 lists them; the new route joins the six long route lists only), the link in `workshop-ui.mjs`, and `mendingShedNotes(state)` in the Notes assembly. That function returns safely for any JSON value at `mendingShed`. Add an atlas game entry and two `manualReferences` (below), regenerate `docs/learning-atlas.md`, and add a README entry.

At 320×600, 820×1000 and 1024×768: no horizontal page scroll; 44 px targets; visible keyboard focus. On the pile, the card's picture, both rows and the tray are visible together at 820×1000 once the bench is scrolled to. A chip placement returns focus to the placed chip; a check moves focus to the line, which is also announced in a polite status region. On the shape bench, Let go announces the result and prediction lines. Reduced motion shows each result picture without animation; a snap is a still picture of two pieces.

## Upstream study and curriculum place

**Jane**, refreshed 2026-10-31 at `e88f81a00553fb87818ef84c77a8800f0dcb33e4`. Adopted from `LESSONS.md`: teach, then guided, then practice; worked examples one step per tap; the three-rung "I'm stuck" ladder ending in a skip with no penalty; misconception-specific feedback lines; short second-person prompts. Not adopted: points, medals, bosses, review gates, mastery labels, timers or requeued skips. No Jane code or lesson text is copied.

**Marble**, refreshed 2026-10-31 at `5e23196fa60050433f1440057f65a978d39e63fc`, with the pinned copy in `curriculum/marble/` unchanged. Paraphrased from `data/teaching-research.json` (CC BY-SA; no text copied):

| Target | What the research asks, and how this slice does it |
| --- | --- |
| Objects vs Materials (`mt_5r47Pvstyn`) | Keep "what is it?" and "what is it made of?" as two visibly separate questions; show one kind of object in several materials and one object made of several materials; ground the naming in looking, not definitions. Two labeled rows; three buckets; the lantern and the mailbag; the wooden bucket's hoops. |
| Changing Shapes of Solids (`mt_wf-SJhZ1kC`) | Teach the four actions precisely; predict before testing; include samples that spring back and samples that keep the new shape, side by side; keep the enquiry on the material; say that the material stays the same. Predict-first bench; rubber and sponge beside clay and rope; slate's "Still slate." line. |

**Hard-prerequisite crosswalk ([49 §8](49-six-act-curriculum.md#8-existing-plans-bounded-next-increment-and-delivery-order)),** from the pinned `curriculum/marble/dependencies.json` and `curriculum/topic-coverage.csv`:

| Target | Hard prerequisite | How it is met |
| --- | --- | --- |
| Objects vs Materials | none | n/a |
| Changing Shapes of Solids | Describing Material Properties (`mt_auVZZEuXjs`), *not yet mapped* | Supported inline: the three outcome chips and result lines name the behavior (springs back, keeps the new shape, hardly changes or snaps). No topic claim. Its own prerequisites (Naming Everyday Materials `mt_ZAJvTcroFO`, which needs Objects vs Materials) sit on this slice's other bench. |

Hard edges are authoring context, never locks. `topic-coverage.csv` stays unchanged: both targets remain *not yet mapped* until a reviewed build earns a scoped reference. The atlas adds two `manualReferences` of kind `scoped-practice`, one per target, with scope text that says what is observed (a supported sort or a predicted test on authored pictures) and what is not (unaided naming, real materials, property vocabulary, grouping).

**Strands and acts.** S5-I (object vs material, the behavior of materials) and S1 (predict, then test). The slice serves 49's Act I recovery and 167's Act I chapter 4, *mend the village*, as setting only; it issues no chapter offer or receipt and changes no act state. Standalone entry stays open regardless of story position.

**Teaching contract ([49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)).**

| Part | In this slice |
| --- | --- |
| Target | Name an object and, separately, its materials; predict and see how six materials answer four shape changes. |
| Teaching encounter | Teach cards 1 and 3, with worked examples one step per tap, before the first item. |
| Contrast | Object vs material; one object in three materials; several materials in one object; springs back vs keeps the shape vs hardly changes or snaps. |
| Supported practice | The guided metal bucket; misconception-specific lines on Check; predict-then-try; the stuck ladder. |
| New application | The multi-material cards (lantern, mailbag, wooden bucket); the soaked willow rod and the willow note. |
| Purposeful revisit | Deferred to later 167 slices (the Job Board reuses the kept materials). The kept board and grid reload exactly. |
| Data boundary | Codes plus the authored display copy kept with each record, local, as above. 167 sketches a codes-only root; this slice also keeps what was shown so saved work survives content changes. Nothing typed is stored. No question about the child's home, clothes or belongings. |

## Acceptance

1. Pure checks:
   - Every card's chip tray, needed and accepted materials, and every Check line in the copy sheet's order, including a material chip in the object row, an object chip in the material row, a missing material on each multi-material card, a wrong material, an empty row, and right.
   - The wooden bucket is sorted with wood alone and with wood and metal; the lantern needs all three.
   - Every one of the 24 shape cells shows the companion's outcome; rubber and sponge never stay squashed; clay never springs back; slate's bend shows the snap line.
   - A prediction is required before Try it; matched and not-matched lines follow the kept prediction.
   - First check and first Let go are kept once; `latest`, counts and `supported` change without rewriting `first`; a skipped item stays unobserved; a check or try at a count of 9999 updates `latest` and leaves the count at 9999.
   - Opening a rung writes support through preflight before its text shows, including a support-only record on an unchecked item that stays unobserved; a refused support write keeps the rung closed and the notebook unchanged.
   - Rendering, opening teach cards, choosing, placing and predicting make no write; the root stays absent until the first Start, check, Let go or rung.
   - Kept results, trays and orders render as saved after the content module's labels, outcomes, lines and order change, and after a card, chip, sample or action id is removed from it (those items read-only).
   - No tray puts its card's object chip, or a needed material, in the same position on every card.
   - Unreadable entries, unknown sibling keys and an unknown `v` stay exact in the export, and the rest of the shed stays open (or read-only for an unknown `v`).
   - A real-transfer refusal leaves the whole notebook unchanged.
   - Source check: every child-facing string is in the copy sheet, the copy sheet's lines marked 167 match 167's companion exactly, the adapted Check line renders the metal bucket's bucket case as 167's line, and none has an em-dash.
2. Native browser journeys at the three viewports: real taps and the keyboard sort the guided bucket, a multi-material card and a wrong row; run the shape bench through a match, a surprise and slate's snap; the stuck ladder to Skip; the board and grid after reload; Notes download and import; reset; two explorers; stale controls after navigation; and a forced preflight refusal. Inspect rendered screenshots of both benches.
3. The Storm Workshop, Fair Test Bench and existing suites stay green, and the source runner passes. Independent review of the exact candidate and the repository's landing procedure follow. Physical iPad and VoiceOver stay unqualified until checked.

## Review asks

- **Science:** the copy sheet's added Check lines and result lines are short and plain; is "hardly changes" honest for rope under squash and stretch, as 167 already defaults? Default: yes, labeled a simplified picture.
- **Owner:** none. 167's open owner asks (host route, Keeper's Desk recycling) do not arise in this slice; the route follows 167's default.
