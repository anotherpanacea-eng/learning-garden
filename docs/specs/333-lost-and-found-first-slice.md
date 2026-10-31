# 333 · The Lost and Found Board: a first slice, *Who borrowed what?*

Proposed 2026-10-31. Base inspected: `36c1552b51b306212c7c421890556ba6ac73872e`. A bounded first runtime slice of [122](122-lost-and-found-mysteries.md), the roadmap's priority 4E ("a single clue mystery (122)"), serving backlog card LG-47. **Specification, not implementation or release clearance.** Every child-facing line is in the [copy sheet](../content/333-lost-and-found-first-slice-text.md), which ships the named lines of [122's companion](../content/122-lost-and-found-text.md) unchanged and adds a short commission table.

## Purpose and boundary

Build the Lost and Found Board's arrival and its first mystery, `ladder` (*Who borrowed what?*). It is the case 122 designs as the first grid: a 3 × 3 logic grid, an I THINK sentence that turns out wrong, and two clue rounds, so that **Can we tell yet?** teaches that "not enough evidence yet" is a real answer. The slice also builds the parts later mysteries reuse: the two-kinds-of-sentence teaching, the sort, the frozen case source with ordered clue predicates, the brute-force checker, the grid with list mode, **Does it fit?** and the reveal.

Out of scope: mysteries 2 to 6, I HEARD, the secondhand clue and setting clues aside, the wet corner, Write a mystery, off-screen invitations beyond the first, and every act or chapter adapter. The board shows one note. It does not list, tease or count unbuilt mysteries. Later slices extend this route, controller and root, and must not build a second board.

This is supported reading and reasoning practice. A fitting answer is not a reading or logic assessment.

## Experience

Route `#post/lost-and-found`, open from the start, linked from the post office hub (`#post`) with the companion's link text.

1. **Arrival.** The companion's place title and first-visit text on a first visit; its later-visit line once a `mysteries` root exists. Then the board with one note, *Who borrowed what?*, labeled **Not started**, **Started** or **Solved** (copy sheet).
2. **The board note**, with a drawn picture of the shed by the mill.
3. **The two kinds of sentence,** the companion's four steps, one per tap, with **Next** and **Start sorting**. Shown before the first sort; reopened later from a **What are the two kinds?** button.
4. **Sort.** Each round-1 witness sentence shows with its writer and two native buttons, **I SAW** and **I THINK**, plus **Sort them for me**. A choice is the child's response and stays as chosen. On the first sort, as 122 requires, each choice is followed by that sentence's authored **Why?** line before its clue card opens; showing it records support for that sentence first. Afterwards a **Why?** button under each sorted note reopens the line. **Sort them for me** shows the authored sort with every Why? open and records the round as skipped and supported. The sort never changes the clues.
5. **Clues.** Under the heading **Clues**, the round's authored clue cards, in order, with the companion's line *Only the cards in Clues are used to check an answer.* On a first visit, the companion's worked first clue shows once, beside the grid.
6. **The grid.** Two 3 × 3 grids that share rows (Pip, Bramble, the miller): one against the tools, one against the places. Each cell is a native button cycling empty, no, yes, empty, with the mark shown as text. **Show as a list** gives the companion's list rows with yes, no and not sure as native radio buttons. **Clear my marks** asks the companion's inline confirmation (no browser dialog). Marks belong to the child; the game never fills, corrects or removes one.
7. **Can we tell yet?** After round 1, the companion's question and two choices. *Not yet* gets the companion's line. *Yes, I know* gets the companion's line, with `{arrangement}` filled by a second arrangement that fits every round-1 clue and differs from the child's answer if one is set. Either way, **Get the next clue** opens round 2.
8. **Round 2.** The baker's sentence to sort, with its Why?, and one more clue card.
9. **My answer.** One row per person, each with a thing and a place as native selects. **Does it fit?** first asks for missing answers, then for duplicates, then checks the active clue predicates in clue order and names the first broken clue with the companion's line. Answers can change freely. Marks and incomplete answers never become solver constraints.
10. **The reveal.** Once an answer fits all clues of round 2, **Find out what happened** shows the companion's reveal, then **Looking back** with its two choices and responses. The mystery is **Solved** once the reveal has been seen.

No timer, score or lock. The mystery can be left and resumed with its sort, marks, round and answer.

## The case source and checker

`ladder` follows 122's predicates exactly:

| Order | Clue id | Round | Predicate |
| --- | --- | --- | --- |
| 1 | `roof` | 1 | P(miller) = mill-roof |
| 2 | `rope` | 1 | P(rowWith(rope)) = footbridge |
| 3 | `pip` | 1 | P(Pip) = orchard |
| 4 | `ladder-roof` | 2 | P(rowWith(ladder)) = mill-roof |

An arrangement is two bijections, rows to tools and rows to places (3! × 3! = 36). The checker enumerates all of them for every check. These counts are acceptance facts, recomputed from the frozen source: round 1 leaves 2 arrangements (4 after the first two clues); all four clues leave exactly 1 (Pip, bucket, orchard; Bramble, rope, footbridge; the miller, ladder, mill roof); removing each clue in order leaves 2, 2, 2, 2. Witness sentences, Why? lines, the board note, the worked clue, pictures and the reveal add no predicates.

The frozen source holds the case id and model version, rows, things and places with labels, witness sentences with writers, authored sorts and Why? lines, clue ids, text, predicates, order and rounds, every choice and response, the worked clue, the reveal and Looking back. It is capped at 32 KiB UTF-8. It is finite data with a fixed predicate vocabulary (`P(row)=place`, `P(rowWith(thing))=place`, `T(row)=thing`), never executable code.

## Saved work

Optional root `mysteries` per explorer, following 122's shape for this one case, with a version added. It stays absent until the first explicit write: **Start sorting** the first time. Rendering, reading the teaching steps and opening the board make no write.

```
mysteries: {
  v: 1,
  cases: { ladder?: {
    source,                                   // complete frozen case, ≤ 32 KiB
    sort: { [sentenceId]: 'saw' | 'think' },  // the child's choices; skipped rounds listed below
    skipped: [round], why: [sentenceId],      // support: Sort them for me, Why? opened
    marks: { [cellId]: 'yes' | 'no' },
    round: 1 | 2, tellYet: 'yes' | 'not-yet' | null,
    answer: { [rowId]: [thingId | null, placeId | null] } | null,
    firstCheck: { round, answer, result, support } | null,   // kept once
    checks: n, revealSeen: bool, lookingBack: choiceId | null,
    at
  } }
}
```

- **Evidence.** The first **Does it fit?** is kept once, with its round, answer, result (fits, missing, duplicate, or the broken clue id) and the support at that moment (whether any Why? or Sort them for me was used). Later checks change only the count and the current feedback. Sorts, marks and answers are never corrected, completed or regraded on load. A mystery never checked is unobserved.
- **Validation and preservation.** Validate ids and linkage, bounded counts (0 to 9999) and outcome shapes against the saved source, never today's catalog. Unknown cell, sentence or clue ids and harmless extra fields stay exact. An unreadable or unsupported case is read-only, shows the copy sheet's unavailable line and stays exportable; the board stays open. An unknown root `v` keeps the root raw, with the copy sheet's version line and a Notes link.
- **Preflight.** Every explicit write is cloned and checked against `dist/progress-limits.mjs` and the real Notes export before it commits. A refusal shows the capacity line and leaves the save and the view unchanged.
- Notes export, import, reset and explorer switching carry `mysteries` through the existing transfer. Add `mysteries: 'The Lost and Found Board'` to `progress-transfer.mjs`'s destination names.

Later slices add cases, `setAside`, I HEARD sorts and `written` beside these keys under `v: 1`; this slice accepts and preserves them exactly.

## Integration

New modules `dist/lost-found-content.mjs`, `-core.mjs` (source validation, the predicate evaluator and the 36-arrangement enumerator), `-ui.mjs` and `lost-found.css`, with a drawn SVG board note picture. In `dist/app.mjs`, add the exact `#post/lost-and-found` branch with the current exact-route conventions (explorer initialization, switch, restoration, welcome-film exclusion and route cleanup, as spec 320 lists them; the route joins the six long route lists only), the hub link in `post-office-ui.mjs`, and `lostFoundNotes(state)` in the Notes assembly, which returns safely for any JSON value at `mysteries`. Add an atlas game entry and one `manualReferences` entry (below), regenerate `docs/learning-atlas.md`, and add a README entry.

At 320×600, 820×1000 and 1024×768: no horizontal page scroll; 44 px targets; visible keyboard focus. Both grids fit at 320 px with row and column headers as text; list mode is the alternative. The clue cards and the grid are visible together at 820×1000 once the grid is scrolled to. A mark keeps focus on its cell; **Does it fit?** announces its line in a polite status region and moves focus to it. Reduced motion uses no animation.

## Upstream study and curriculum place

**Jane**, refreshed 2026-10-31 at `e88f81a00553fb87818ef84c77a8800f0dcb33e4`. Adopted from `LESSONS.md`: a short teaching encounter before practice (the four steps and the worked first clue), guided practice (Why?, the pre-sorted option), three-or-fewer-choice questions (*Can we tell yet?*, Looking back), and feedback that names the specific clue an answer breaks. Not adopted: points, medals, bosses, review gates, mastery labels or timers. No Jane code or lesson text is copied.

**Marble**, refreshed 2026-10-31 at `5e23196fa60050433f1440057f65a978d39e63fc`; the pinned copy in `curriculum/marble/` is unchanged. Paraphrased from `data/teaching-research.json` (CC BY-SA; no text copied):

| Target | What the research asks, and how this slice does it |
| --- | --- |
| Observation vs Interpretation (`mt_Hw70LI5xza`) | Split one moment into what was noticed and what is thought about it; use one consistent two-word frame; treat interpretation as valuable and checkable. The I SAW and I THINK sort; step 3's "an idea to check"; Looking back at Pip's guess. |
| Inference vs Explicit Meaning (`mt_lp3qyEujIv`) | No teaching-research record at this Marble commit. The topic description matches the sort and the baker's "a roof", which the reader resolves from the grid. |

**Hard-prerequisite crosswalk ([49 §8](49-six-act-curriculum.md#8-existing-plans-bounded-next-increment-and-delivery-order)),** from the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it is met |
| --- | --- | --- |
| Observation vs Interpretation | none (soft: Feeling of not understanding `mt_klyw-tdlhP`) | n/a |
| Inference vs Explicit Meaning | Monitoring Comprehension (`mt_GugVunb2lI`), *not yet mapped* | Partly supported inline: *Can we tell yet?* asks the child to notice that the clues don't decide yet. No topic claim. |

Hard edges are authoring context, never locks. `curriculum/topic-coverage.csv` is unchanged. Observation vs Interpretation already has a scoped-practice reference from the plant study, so the atlas adds one more `scoped-practice` reference for it here, with scope text that says what is observed (a supported sort of authored sentences) and what is not (the child's own observations, field inquiry).

**Strands and acts.** E3-I (explicit detail versus inference), E3-IV (sufficient evidence: *Can we tell yet?*), S1-I (observation versus interpretation) and M7-II (check and revise: **Does it fit?**, another way that fits). It serves 122's Act II, chapter 1 (the weekly market) as setting only; it issues no chapter offer or receipt and changes no act state. Standalone entry stays open regardless of story position.

**Teaching contract ([49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)).**

| Part | In this slice |
| --- | --- |
| Target | Sort what a witness saw from what they think; eliminate possibilities from clues; say whether the clues decide yet. |
| Teaching encounter | The four sentence steps and the worked first clue. |
| Contrast | I SAW and I THINK; decided and still open; a guess (Pip's) and the answer the clues give. |
| Supported practice | Why?, Sort them for me, list mode, **Does it fit?** naming the first broken clue, another way that fits. |
| New application | Round 2: one more clue turns two possible answers into one. |
| Purposeful revisit | Looking back at Pip's I THINK; later 122 slices reuse the frame. |
| Data boundary | Sorts, marks, answers and choices, as codes, local. No free text and no names collected. |

## Acceptance

1. Pure checks:
   - The enumerator reproduces every count above from the frozen source: 36 arrangements; 4 after two clues; 2 after round 1; 1 after round 2; 2, 2, 2, 2 with each clue removed.
   - **Does it fit?** order: missing, then duplicate, then the first broken clue in clue order; it never reveals the answer, and it uses only the active round's clues.
   - Another way that fits always fits every round-1 clue and differs from the child's answer when one is set.
   - The game never changes a mark on its own; a confirmed Clear my marks removes the marks it names, and a declined one leaves every mark.
   - The sort is preserved as chosen and never becomes a constraint; every first-sort choice shows its Why? before its clue card opens; Why? and Sort them for me record support before the authored line shows; `firstCheck` is kept once with its support.
   - Rendering and reading the teaching steps make no write; the root stays absent until Start sorting.
   - A frozen source resumes unchanged after the content module's labels, wording, clue order and choices change.
   - Unknown ids and fields, an unreadable case and an unknown `v` stay exact in the export.
   - A real-transfer refusal leaves the whole notebook unchanged.
   - Source check: every child-facing string is in the copy sheet, the copy sheet's companion lines match 122's companion exactly, and none has an em-dash.
2. Native browser journeys at the three viewports: real taps and the keyboard through teaching, sort (and Sort them for me), marks in grid and list mode, *Can we tell yet?* both ways, round 2, a missing, a duplicate and a broken-clue check, the fit, the reveal and Looking back; reload mid-mystery; Notes download and import; reset; two explorers; stale controls after navigation; and a forced preflight refusal. Inspect rendered screenshots of the grid at 320 and 820.
3. The post office hub and existing suites stay green, and the source runner passes. Independent review of the exact candidate and the repository's landing procedure follow. Physical iPad and VoiceOver stay unqualified until checked.

## Review asks

- **Content:** the companion gives no clue-card wording for round 2 (`ladder-roof`). The copy sheet adds "Whoever had the ladder was on the mill roof." Is that the right card, given the baker saw the ladder against "a roof" and the mill roof is the only roof on the grid? Default: yes, with the baker's Why? ("Which roof could it be?") pointing at it.
- **Owner:** none.
