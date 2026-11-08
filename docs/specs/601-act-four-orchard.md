# 601 · The Town Has Two Stories: chapter 2, the wet corner

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `ec057c7c`. **Specification and a bounded build, not release clearance.** The finite text is in [the 601 companion](../content/601-act-four-orchard-text.md); the chapter text and Keeper's note come from the reviewed script, [act-4.md](../content/120-story/act-4.md) chapter 2. This is the second bounded Act IV commission after [352](352-act-four-opening.md), which named chapters 2 to 4 as separate commissions. It follows 352 everywhere this spec does not say otherwise, and through it [326](326-both-ways-across-willow-bridge.md) and [248](248-a-town-of-our-own.md)'s contribution, state and recovery contract. Numbered 601, outside the run Codex uses for new benches.

**Commission.** The owner, 2026-11-07: "do a deep dive into the Learning Garden and do some creative work. Build animations, story beats, games … Identify stuff further down the roadmap and spec, build, and PR it." Roadmap lane B (LG-G2).

## Purpose and boundary

Chapter 2 of Act IV goes live:
1. A chapter page at `#almanac/two-stories/orchard`, with the chapter text at both frame amounts, the Keeper's note and a read-aloud button, as chapter 1 has.
2. An original **animated scene of the low corner**: three old apple trees in a puddle that never dries, reeds coming up between them, the rest of the orchard up the slope, and rain that falls a few times and stops. It is story art, not a model: it shows what the orchard keeper sees and claims nothing about how water moves or how much. Reduced motion shows the finished picture after the rain.
3. A chapter reader that takes a **kept Rain Paths result**, the Sprout and Sapling jobs' host in act-4.md.
4. After an offer, a kept line from the script and one new guide line. The guide's pinned guess from [366](366-guide-changes-their-mind.md) stays pinned; the guide is still checking it. The change of mind belongs to the ending, not here.
5. A **Bring work to The Town Has Two Stories** link on Rain Paths once Act IV has started, as 352 added to the ledger case.

Out of scope, each a separate commission: chapters 3 and 4, the meeting board, the ending *The Map We Changed*, `story.plan`, and chapter 2's Seedling job. That job needs a new authored source pack on the Water Evidence Shelf, whose current visit is not saved, so there is nothing for a reader to take. No change to Rain Paths' own saved work, routes or teaching.

Reaching the chapter or offering a result is story progress. It is not a curriculum milestone or a learning measure.

## Route

`#almanac/two-stories/orchard` opens chapter 2 inside the existing `almanac` family; `actFourRoute` returns `{part:'chapter',chapter:'orchard'}`. Chapters 3 and 4 still fall back to the hub without a write, as 352 requires. The hub lists both live chapters. The chapter page needs Act IV started, as chapter 1 does.

## Chapter 2 reader (saved-shape research)

352 requires a later reader to name which saved artifact counts, its frozen identity and its exported validator.

- **Artifact.** A Rain Paths case's `keptResult`. `keepRainResult` writes it only while it is `null`, so the first keep is frozen; a later run and keep leave it unchanged (checked).
- **Identity.** The case id. Rain Paths keeps one result per case, so `{caseId}` names one kept result. The reference holds that id and nothing else: no rows, outcome, support or familiarity.
- **Validator.** The exported `rainResultSourceValid`, the same check Rain charts already uses for a carried result. A kept result also has to carry its own case id.
- **Reading.** The reader is pure and reads `state.rainPaths` directly, not through `rainPaths(state)`, because that view returns nothing when any one case is unreadable. A root that is not a version-1 object with a `cases` object reads as unreadable and offers nothing. Within a readable root, each case is read on its own. An unknown case id, a non-object entry, a missing `keptResult` field, a failing kept result or one filed under the wrong case is omitted, reported as retained-unreadable and left exactly as saved. `null` simply means nothing is kept yet.
- **Candidates.** One per readable kept case, key `JSON.stringify(['orchard',caseId])`, labelled *Kept rain result: {case}* with the case's own label (for example *Cover · 12 new tokens per tray*), never an outcome.

## State

Unchanged from 352 apart from the second chapter. A chapter 2 receipt is `{kind:'act-four-offer', version:1, chapter:'orchard', activity:'rain-paths', artifactKind:'kept-result', ref:{caseId}}`. `validActFourOffer` checks its shape only: the case id is a nonempty string of at most 160 characters, and is never matched against today's case list, so a later version's case stays a readable receipt. `gazette` and `meeting` stay reserved and invalid.

As in 352: the first valid receipt for a chapter counts once and a repeat offer is a no-op; an unreadable known receipt cannot be replaced; host removal or damage never revokes a receipt. Each chapter keeps its own receipt, and offering one never touches the other. `offerActFour` takes the chapter, and its write follows 248's whole-notebook clone, `recoveryFitsProgressLimits` and real Notes preflight; a refusal leaves every byte unchanged. No new scene, preference, root or transfer membership. The Notes line names chapter 2.

## Presentation and integration

- `act-four-content.mjs` gains an `orchard` block; `act-four-core.mjs` gains the reader and `actFourLiveChapters`; `act-four-ui.mjs` renders either chapter from its own copy; `act-four-corner-art.mjs` draws the scene; `act-four.css` animates it.
- Chapter 1's page, copy and receipt are unchanged; an unknown chapter id still renders chapter 1, as before.
- `app.mjs` changes one line: the Rain Paths render appends `actFourReturn(state,'orchard')`, which is empty until Act IV starts.
- The scene is an `svg role="img"` with a one-sentence description and a caption. The rain runs five short cycles and stops; the reeds rise once; the puddle and its glints shimmer gently. Under reduced motion none of it moves and no rain shows. 44 px targets, 16 px text, visible focus, read-aloud of visible prose only, checks at 320 and 820.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, studied only, as in 352: a story hook, then finite stages, with a reached beat that stays reached. No review gates, bosses, medals or mastery locks; no Jane code, prose or assets.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`; the repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. Candidates only, with no new atlas mapping. Chapter 2 claims none of these; Rain Paths owns them through its existing declarations.

| Topic | Strand | Why it is near |
| --- | --- | --- |
| Fair testing `mt_qgb76wHN2X` | S1 | Rain Paths changes one factor between two trays; the Sapling job asks for a fair comparison. Declared by Rain Paths. |
| Observation vs Interpretation `mt_Hw70LI5xza` | S1 | The wet corner and the reeds are observations; *why* is the town's argument. Declared by Rain Paths. |
| Recording Data `mt_ZFwPZaDJ0_` | S1 | A kept result is a recorded table of tokens. Declared by Rain Paths. |
| Modelling with Sketches `mt_hi8cVycbwn` | S1 | The Keeper's note: "A model is a way to ask a better question." Not yet mapped; a future candidate only. |

**Spec 49.** Act IV, evidence and disagreement. Chapter 2 adds no lesson: Rain Paths owns the teaching encounter, contrast and practice (§5 steps 1 to 5), and this chapter is the purposeful revisit (step 6) that gives a kept result a place in the story. No free-text field (step 7); receipts hold ids only.

**Hard-prerequisite crosswalk** against the pinned `curriculum/marble/dependencies.json`. Fair testing and Recording Data each have one hard prerequisite, Simple tests and experiments `mt_Wa44s-f8Ws`; Observation vs Interpretation has none; Modelling with Sketches needs Asking scientific questions `mt_XirhnAB6Ye`. Both prerequisites are *not yet mapped*. Chapter 2 claims none of these topics, so none gates it. A later lesson that claims one must teach or check its hard prerequisites.

**Spec 120.** Act IV's chapter 2 and its jobs (§7, §8), the cast (§4: the orchard keeper, Nuria visiting, Pip), and the state sketch (§12). Nuria's line names *carrizo* in italics, a single word the script already uses; no other Spanish ships, so no language panel is needed. The guide line follows 366's arc: the guess is pinned in the hub, kept under review in chapters 1 and 2, and revised only at the ending.

All new prose and the illustration are original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion.

Pure checks (`test/act-four-orchard-checks.mjs`, fixtures from the real Act IV and Rain Paths APIs):
- No root, or an unfinished, unkept run, offers nothing, and the page says so.
- Real keeps give one candidate per kept case, with deterministic keys and case labels; a later keep leaves the frozen result unchanged.
- Reads and renders write nothing.
- A refused export writes nothing; an unknown key is refused; an offer writes one id-only receipt; a repeat keeps the first; chapter 1 is untouched and still offerable afterwards.
- Removing or breaking Rain Paths never revokes the receipt.
- Unreadable, unknown and wrongly filed cases are omitted, reported and left exactly as saved; an unsupported root offers nothing.
- Receipt validation is shape only, accepts a future case id, and rejects the wrong activity, kind, extra keys, empty ids, versions and chapters; a reserved chapter cannot be offered; nothing can be offered before Act IV starts.
- Rendering: the hub links both chapters; chapter 2 shows the described scene, the Rain Paths link, the kept line and the guide line with the chosen guide named, and not chapter 1's guide line; Notes name chapter 2; the Rain Paths return link appears only once Act IV has started.

The existing `test/act-four-checks.mjs` still passes, with this companion added to its reviewed-source list.

Browser journey (`test/act-four-orchard-browser.py`), at 820 and 320:
- The hub links chapter 2 and writes nothing; the chapter shows its heading, the described scene, the Rain Paths link and case-labelled candidates; 44 px targets and no overflow.
- Offering writes the id-only receipt, moves focus to the offer section, shows the guide line, leaves Rain Paths unchanged and survives a reload.
- Rain Paths shows the way back to chapter 2; chapter 1 still opens.
- Reduced motion shows still reeds and no rain; otherwise the reeds grow and the rain falls.
- With no kept result, the chapter says so and shows no offer button.

Physical iPad, Safari, VoiceOver and learning effects remain unqualified. This is followed by an exact-head implementation review and the repository's landing procedure.
