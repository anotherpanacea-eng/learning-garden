# 334 · The Design Table: a first slice, two bags and the brief

Proposed 2026-10-31. Base inspected: `36c1552b51b306212c7c421890556ba6ac73872e`. A bounded first runtime slice of [176](176-design-table.md), serving backlog card LG-48. **Specification, not implementation or release clearance.** Every child-facing line is in the [copy sheet](../content/334-design-table-first-slice-text.md), which ships the named lines of [176's companion](../content/176-design-table-text.md) unchanged and adds a commission table. Sources stay in [176's source audit](../source-audits/176-design-table.md).

## Purpose and boundary

176 proposes seven stations and two problem sets. Its commissioning boundary suggests the first slice: **stations 2 and 3 with problem set A**. This slice builds **station 2, Two bags, one test**, and **station 3, Write the brief**, with the set A items that practice them (A4 to A8), the arrival, the Mary Anderson card read at station 3, the key terms those stations use, the grown-up panel and a saved root that later slices extend.

Out of scope: stations 1, 4, 5, 6 and 7; set A's A1 to A3 (station 1) and A9 to A11 (station 4); set B; the story scenes and every act or chapter adapter; Keeper's Desk; number chips on the brief; the off-screen footbridge. The page does not list, tease or count unbuilt stations. Later slices extend this route, controller and root, and must not build a second Design Table page.

This is supported practice with a made-up model. It claims no real test, no building and no unaided design.

## Experience

Route `#workshop/design`, open from the start. Link it from the Storm Workshop's table list (`#workshop`) as **The Design Table**. Neither station requires the other. 176's further links (Fair Test Bench, Post Office) wait for a later slice.

1. **Arrival.** The companion's place title and Short first-visit text on a first visit; its later-visit line once a `designTable` root exists. Then two station entries, **Two bags, one test** and **Write the brief**, each with a progress line from the copy sheet. Every station 2 screen and every station 3 screen that uses crate numbers carries **A made-up model**.
2. **Teach first, once per station.** Opening a station the first time shows its teach card with **Show me**, which reveals the worked example one step per tap, and **Start**. Start is available at once; the card never gates play. **What is this station for?** reopens the card later. The first Start on each station records `taught`.
3. **Two bags, one test.**
   - **Run the rain test** reveals one authored try for both bags per tap, three tries in all; the table fills row by row and the button then shows the copy sheet's done line. **Show totals** fills the total row and shows the carry test line. Reveals are view state; they make no write and replay from the start on a new visit.
   - The **guided item** (the companion's prompt, step and three choices) answers with one tap.
   - **Strength and weakness tags:** four slots (satchel strength, satchel weakness, basket strength, basket weakness) and a tray of five tags, placed by tap-then-tap with a visible "picked up" marker; **Check** shows the first line that applies in the copy sheet's order.
   - **Recommendation frame:** two gaps, each filled from two chips; **Check** shows the first line that applies, and a right frame is read back as one sentence.
   - **Improve it:** three choices, each with the companion's line.
   - **Side door:** Bramble's unfair test, its prompt and two choices.
   - **Practice:** A4, A5 and A6.
4. **Write the brief.**
   - The **brief board** has four slots, **Need**, **Who it's for**, **Musts** and **Limits**, holding 1, 1, 3 and 3 tiles. A tray holds ten tiles: the need, the user, one checkable must, three vague tiles, three limits and one solution tile. Tiles are placed by tap-then-tap; tapping a placed tile returns it.
   - **Check my brief** shows the first line in the copy sheet's order. Each vague tile carries a **Can we check it?** button, and a vague tile also flips when Check my brief finds it placed (that check's line): "Really strong" and "Not too heavy" turn into their checkable tiles, and "Nice" shows its line and stays flipped and unplaceable. A right brief is read back as the companion's brief card.
   - The **guided item** (must or limit) and the **Mary Anderson card** (A true thing from history), shown after the brief or from a button on the station.
   - **Practice:** A7 (sort four cards into Musts or Limits) and A8.
   - Authoring is tile assembly, not writing, and the spec claims no more.
5. **Answers and feedback.** A choice item answers on one tap. A5 takes a whole number from 0 to 99 in a labeled numeric field with **Check**. A7 uses the same tap-then-tap placement. Each answer shows its authored feedback line; the item's explanation shows after its first right answer and stays available after that. A wrong answer can be changed and tried again.
6. **"I'm stuck"** on A4 to A8: rung 1, the item's hint; rung 2, the item's I'm stuck line (an easier example and how to start); rung 3, **Skip for now**, which leaves the item untried and records nothing. Opening rung 1 or rung 2 is an explicit write: the item's support rises, through preflight, before the rung's text shows. If preflight refuses, the capacity line shows and the rung stays closed. Guided items show their steps from the start and have no ladder.
7. **Key terms** for this slice (brief, criteria, constraints, trade-off) sit in a **Key terms** panel on both stations.
8. **Grown-up notes.** The companion's grown-up panel, trimmed as the copy sheet sets out, and the grown-up line from the copy sheet.

No score, timer, lock, mastery label or unlock. Every action has a keyboard path; nothing uses drag.

## Saved work

Optional root `designTable` per explorer, the first part of 176's root. It stays absent until the first explicit write: a Start, an answer, a Check, a Check my brief, or opening rung 1 or 2. Rendering, opening a teach card, revealing tries, placing tiles or chips, flipping a vague tile with **Can we check it?** before a check, and opening the Mary Anderson card or key terms make no write.

```
designTable: {
  v: 1,
  taught: { bags: bool, brief: bool },
  items: { [itemId]: {
    prompt: text,                        // as first shown, kept once
    options: [Opt],                      // choices, tiles or cards in their shown order, kept once; [] for A5
    slots: [Opt],                        // placement slots as shown, kept once; [] otherwise
    first: Answer | null,                // the first answer, kept once
    latest: Answer | null,
    tries: n, right: bool, support: 'none' | 'hint' | 'example', at
  } },
  briefs: { [briefId]: {
    tray: [Opt], slots: [Opt],           // as first shown, kept once
    first: Brief | null, latest: Brief | null,
    checks: n, right: bool, at
  } }
}
Opt    = { id, label }
Answer = { choice: Opt | null, entry: int | null,
           placed: [{ item: Opt, slot: Opt }] | null, line: { id, text } }
Brief  = { placed: [{ item: Opt, slot: Opt }], flipped: [id], line: { id, text } }
```

Item ids are `bags-guided`, `bags-tags`, `bags-frame`, `bags-improve`, `bags-unfair`, `brief-guided`, `a4` to `a8`; the brief id is `ways-crate`.

- **Codes plus what was shown.** 176 sketches a codes-only root. This slice also keeps the authored labels, slots and lines exactly as displayed with each record, so kept work renders as saved after the content module's labels, lines or order change, or after an id leaves it. Nothing typed is stored except A5's whole number. No name, photo or audio.
- **Evidence.** The first answer and the first brief check are kept once. Later answers and checks change `latest`, `right`, the count and `at`. Counts saturate at 9999: a later answer at the cap still updates `latest`, `right` and `at`. `right` turns on with the first right answer and never turns off. `support` only rises (`none`, then `hint`, then `example`) and records the highest rung opened, before or after the first answer, without rewriting `first`. Opening a rung on an untried item writes a support-only record (`first` and `latest` null, count 0), which stays unobserved. A skipped or never-tried item is unobserved.
- **Resuming.** A kept item shows its kept prompt, options and slots in their kept order. A new answer uses the current module's rules; if the item or any kept option id is no longer in the module, the kept record shows read-only from its kept labels.
- **Validation and preservation.** Validate shape, not catalogue membership: ids are strings of 1 to 40 characters from `a-z`, `0-9` and `-`; labels, prompts and lines are strings of 1 to 300 characters; option lists hold at most 12 entries with distinct ids, and chosen or placed entries come from the record's own lists; `entry` is an integer 0 to 99; counts are integers 0 to 9999; `first` is null exactly when the count is 0. An unreadable entry stays raw and exportable, its item shows the copy sheet's unavailable line and is read-only, and the rest of the table stays open. An unknown `v` keeps the whole root raw, shows the copy sheet's version line and a Notes link, and makes both stations read-only.
- **Preflight.** Every explicit write is cloned and checked against `dist/progress-limits.mjs` and the real Notes export before it commits. A refusal shows the capacity line and leaves the save and the view unchanged.
- Notes export, import, reset and explorer switching carry `designTable` through the existing transfer. Add `designTable: 'The Design Table'` to `progress-transfer.mjs`'s destination names.

Later slices add 176's `sketches`, `picks`, `predictions` and `reports` beside these keys under `v: 1`, and further items and briefs under these maps; this slice must accept and preserve unknown sibling keys exactly.

## Integration

New modules `dist/design-table-content.mjs`, `-core.mjs`, `-ui.mjs` and `design-table.css`, with a drawn SVG of the two bags (no photographs). In `dist/app.mjs`, add the exact `#workshop/design` branch with the current exact-route conventions (explorer initialization, switch, restoration, welcome-film exclusion and route cleanup, as spec 320 lists them; the new route joins the six long route lists only), the link in `workshop-ui.mjs`'s table list, and `designTableNotes(state)` in the Notes assembly. That function returns safely for any JSON value at `designTable`. Add an atlas game entry and two `manualReferences` (below), regenerate `docs/learning-atlas.md`, and add a README entry.

At 320×600, 820×1000 and 1024×768: no horizontal page scroll; 44 px targets; visible keyboard focus. The rain table is a real table with a caption and scrolls inside its own box at 320 px. On the brief board, the four slots and the tray are visible together at 820×1000 once scrolled to. A placement returns focus to the placed tile; a check moves focus to its line, which is also announced in a polite status region. Each revealed try is announced. Slots and tags never use color alone. Reduced motion reveals rows and flips tiles without animation.

## Upstream study and curriculum place

**Jane**, refreshed 2026-10-31 at `e88f81a00553fb87818ef84c77a8800f0dcb33e4`. Adopted from `LESSONS.md`: teach, then guided, then practice; worked examples one step per tap; the three-rung "I'm stuck" ladder ending in a skip with no penalty; misconception-tagged three-option questions; short second-person prompts; a key-terms glossary. Not adopted: points, medals, bosses, review gates, mastery labels, timers or requeued skips. No Jane code or lesson text is copied.

**Marble**, refreshed 2026-10-31 at `5e23196fa60050433f1440057f65a978d39e63fc`, with the pinned copy in `curriculum/marble/` unchanged. Paraphrased from `data/teaching-research.json` (CC BY-SA; no text copied):

| Target | What the research asks, and how this slice does it |
| --- | --- |
| Comparing Design Solutions (`mt_nNYo5A-7Bl`) | Test two designs for the same problem the same way; record simply; name each one's strengths and weaknesses; recommend from what the results showed, never from liking or making it; then suggest an improvement. The same-way rain test, the tags, the because-the-data frame, Improve it, the unfair side door, A4 to A6. |
| Simple Design Problems (`mt_Z5-fSCOBep`) | Define the problem before making: who it is for, checkable success criteria and real constraints; turn vague wishes into testable criteria; sort criteria from constraints; start from a bounded need with a named user. The brief board, Can we check it?, the guided item, A7, A8. The research favors the child writing the brief; here it is tile assembly, and the claim stays that narrow. |

**Hard-prerequisite crosswalk ([49 §8](49-six-act-curriculum.md#8-existing-plans-bounded-next-increment-and-delivery-order)),** from the pinned `curriculum/marble/dependencies.json` and `curriculum/topic-coverage.csv`:

| Target | Hard prerequisite | How it is met |
| --- | --- | --- |
| Comparing Design Solutions | Modelling with Sketches (`mt_hi8cVycbwn`), *not yet mapped* | Not met in this slice: 176's station 1 teaches it and is the next slice. A documented gap. The bags are supplied designs; the child models nothing, and the scope text says so. |
| Comparing Design Solutions | Recording Data (`mt_ZFwPZaDJ0_`), *scoped practice reference* | Met elsewhere in part: the Fair Test Bench, plant study, Field Notebook, Rain Paths and Rain Notebook references. The rain table here is supplied and filled by the app. |
| Simple Design Problems | Comparing Design Solutions (`mt_nNYo5A-7Bl`) | Taught here (station 2). |

Hard edges are authoring context, never locks. `topic-coverage.csv` stays unchanged: both targets remain *not yet mapped* until a reviewed build earns a scoped reference. The atlas adds two `manualReferences` of kind `scoped-practice`, one per target, with scope text that says what is observed (choices, tag and tile placements on a supplied made-up model) and what is not (running a test, recording data, sketching or modelling, writing a brief unaided, building).

**Strands and acts.** S1-II (compare with a measure), S1-III (fair comparison, repeats) and S6-VI (define and defend a small engineered thing), with M6-II's supplied table. The slice serves 176's Act II and Act VI chapter 2 beats as setting only; it issues no chapter offer or receipt and changes no act state. Standalone entry stays open regardless of story position.

**Teaching contract ([49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)).**

| Part | In this slice |
| --- | --- |
| Target | Compare two designs from same-way data, naming strengths and weaknesses and recommending from the data; define a need, user, criteria and constraints, with every must checkable. |
| Teaching encounter | The two teach cards, with worked examples one step per tap, before the first item. |
| Contrast | Same test vs unfair test; winner vs strengths and weaknesses; liking vs data; criterion vs constraint; checkable vs vague; problem first vs favorite first. |
| Supported practice | The guided items; misconception-specific lines; the frame and chips; Can we check it?; the stuck ladder. |
| New application | The Ways crate brief, after the two bags. |
| Purposeful revisit | The Fair Test Bench (56, 60) for same-way testing; later 176 slices reuse the kept brief at station 4. Kept work reloads exactly. |
| Data boundary | Codes plus the authored display copy kept with each record, and A5's whole number, local. No question about the child's home, belongings or family. |

## Acceptance

1. Pure checks:
   - The rain table's shipped data gives damp totals 1 and 9 of 30 (difference 8) and parcels 6 and 10; A5's answer is 8, and 9 and 3 give their tagged notes.
   - Every Check line on the tags, the frame and the brief, in the copy sheet's order, including the solution tile, each vague tile (placed and in the tray), a swapped must or limit, a need or user tile in the wrong slot, a short slot, a mismatched frame pair, the "best at everything" tag, an empty slot and right.
   - Both right frames are accepted; a right brief reads back as the companion's brief card exactly.
   - Every choice item's right answer and every tagged wrong answer give the copy sheet's lines; the explanation appears only after the first right answer.
   - First answer and first brief check are kept once; `latest`, `right`, counts and `support` change without rewriting `first`; `right` never turns off; a skipped item stays unobserved; an answer at a count of 9999 updates `latest` and leaves the count at 9999.
   - Opening rung 1 or 2 writes support through preflight before its text shows, including a support-only record on an untried item that stays unobserved; a refused support write keeps the rung closed and the notebook unchanged.
   - Rendering, teach cards, reveals, placements, a pre-check flip, the Mary Anderson card and key terms make no write; the root stays absent until the first Start, answer, check or rung.
   - Kept prompts, options, slots and lines render as saved after the content module's labels, lines and order change, and after an item or option id is removed (those records read-only).
   - Unreadable entries, unknown sibling keys and an unknown `v` stay exact in the export, and the rest of the table stays open (or read-only for an unknown `v`).
   - A real-transfer refusal leaves the whole notebook unchanged.
   - Choice positions: across the slice's choice items the fitting choice is not always in one position (copy sheet table).
   - Source check: every child-facing string is in the copy sheet, the lines marked 176 match 176's companion exactly, every station 2 screen and every crate-number screen shows *A made-up model*, and none has an em-dash.
2. Native browser journeys at the three viewports: real taps and the keyboard run the rain test and totals, the guided item, a wrong and a right tag check, a mismatched and a right frame, the side door, A5 with a tagged wrong number, a brief with a vague tile, a swap and the solution tile, then a right brief; the stuck ladder to Skip; kept work after reload; Notes download and import; reset; two explorers; stale controls after navigation; and a forced preflight refusal. Inspect rendered screenshots of both stations.
3. The Storm Workshop, Fair Test Bench and existing suites stay green, and the source runner passes. Independent review of the exact candidate and the repository's landing procedure follow. Physical iPad and VoiceOver stay unqualified until checked.

## Review asks

- **Content:** the brief tray adds one solution tile ("Use the oak chest") so the companion's solution-first line has a trigger, and tile labels capitalize the brief card's words. Default: yes.
- **Content:** Improve it lists the oilcloth lining last, where 176 lists it first, to vary the fitting choice's position. Default: yes.
- **Owner:** none. 176's owner asks (story link, off-screen bridge, scope of reports) do not arise in this slice.
