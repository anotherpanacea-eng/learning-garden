# 608 · The first journey, and someone new: Act VI chapter 4

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `01766fa3`, the head of [607](607-act-six-rain.md)'s branch, on which this is stacked. **Specification and a bounded build, not release clearance.** New finite text is in [the 608 companion](../content/608-act-six-journey-text.md). The rest comes from the reviewed [act-6.md](../content/120-story/act-6.md) chapter 4 and [letters.md](../content/120-story/letters.md) letter 8, in English. It follows 606 and 607. Numbered 608, outside the range Codex uses.

**Commission.** The owner, 2026-11-08: "Build chapter 4". Roadmap lane B (LG-G2).

## Purpose and boundary

Chapter 4 is at `#almanac/opening-ways/journey`. It opens once the warning is sent (607). Before then it explains the gate and links to chapter 3.

1. **The first journey.** The script's text at both frame amounts.
2. **Pack the first parcel** (the Sprout job, played here). Dot's instruction is the script's: apples at the bottom, drawings on top.
   - The explorer puts the three goods from the chapter text (apples, a honey-cake recipe, two of Pip's drawings) into the parcel, bottom first, then ties it up.
   - An unfinished parcel says so. Apples not at the bottom, or drawings not on top, gets its reason.
   - The right order gets the script's kept line.
3. **Jobs.**
   - Seedling links to Cartographer's Table, whose clue-card view is the script's Map Reader Dispatcher.
   - Sapling links to Messages for a Reader.
4. **Send the first parcel.** This is the chapter's one write, open at any depth, with or without a job first.
5. **After sending:**
   - Léon's letter 8, in English.
   - *Someone comes home*, at both frame amounts: Hollis walks up the river path, sees the new mark *Warned in time*, and says "I hear my parcel got a bit wet."
   - An animated heron walks up the path, stops once to look at the brook, and comes to rest beside the flood post.
   - *They stay for supper.*

Packing is play for this visit only. It is not saved, it resets with explorer switches and progress resets (606), and it is not an assessment.

**Out of scope**, each a separate commission:
- **Letter 8's French:** it needs the language panel.
- **Hollis's line about the spec 118 *What did Hollis write?* case:** that case is unbuilt, so there is no kept transcription to acknowledge.
- **Page 6** (Hollis's letter) and **the Act VI ending**, *The Opening of the Ways*.
- **The Keeper's Desk job.**

## State

- **`story.acts.VI.journey: true`** is written by **Send the first parcel**, which needs a sent warning.
  - Sending again is a no-op.
  - A malformed `journey` is neither read as made nor overwritten.
  - A `journey` without `warned` is not read as made.
- **The atomic step.** The write goes through 606's atomic step, so a refusal writes nothing.
- **The ending condition.** Act VI's ending condition (120 §6) is a kept exchange plan, the long rain and the first journey. After this slice all three can be true, but nothing reads them until the ending is built.

## Presentation

- **Code.**
  - `act-six-content.mjs` gains the `journey` block.
  - `act-six-core.mjs` gains the chapter id, the journey view and `sendFirstParcel`.
  - `act-six-ui.mjs` gains the chapter, the packing game and binders, the hub's chapter 4 link and the Notes line.
  - `act-six-home-art.mjs` (`heronScene`) and `act-six.css` add the picture and its animation.
- **Integration.** No other module changes.
- **Hollis's pronouns.** Hollis is they/them, as in spec 120; the script's lines are used as written.
- **Accessibility.**
  - The parcel is an ordered list and a live region. Used goods are disabled.
  - Focus moves to each result, and to the homecoming after sending.
  - Targets are 44 px. Read-aloud covers visible prose only.
  - The scene is an `svg role="img"` with a description.
  - The heron walks once and stops within five seconds; reduced motion shows it already at the post.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, is studied only, as in 606 and 607. No Jane code, prose or assets are used.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. Nothing is mapped or claimed.

**Spec 49.** Act VI's exchange runs for the first time under the kept plan.

**Spec 120.** This slice covers:
- §6, chapter 4: "the first regular exchange goes up the river under the kept plan … Hollis comes home up the river path to see the brook, and stays for supper";
- §10's letters: letter 8 arrives the evening of the first journey.

All new prose and the illustration are original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion.

**Pure checks** (`test/act-six-journey-checks.mjs`):
- **The gate.** The chapter waits for the warning, and no parcel can be sent before it.
- **Before sending.** The chapter text and the parcel appear, the jobs link to their places, and Léon and Hollis wait. No placeholder is left.
- **Sending.**
  - Reads write nothing, and a refused export writes nothing.
  - Send writes only `journey`, and a repeat is a no-op.
- **After sending.** Léon's letter appears, with the described homecoming, Hollis's lines and supper. Notes and the hub update.
- **Saved shapes.** A malformed journey, and a journey without the warning, are not read as made.
- **Text tracing.** Every content string traces to act-6.md, letters.md, or the 606–608 companions (`test/act-six-checks.mjs`).

**Browser journey** (`test/act-six-journey-browser.py`), at 820 and 320:
- **Packing.** An unfinished parcel says so. A wrong order gets its reason. The right order gets the kept line, and focus moves to the result. Packing writes nothing.
- **Sending.** Send records only the journey. Léon's letter, Hollis and supper appear, focus moves to the homecoming, and the result survives a reload.
- **Layout.** Targets are 44 px, with no overflow, before and after sending.
- **Motion.** The heron walks once and stops within five seconds; reduced motion is still.

Existing suites still pass. Physical iPad, Safari, VoiceOver and learning effects remain unqualified. An exact-head implementation review and the repository's landing procedure follow.
