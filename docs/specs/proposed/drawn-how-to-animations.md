# Drawn how-tos: short pencil-drawn animations for instructions

Status: **proposal with a first build** (2026-10-24). Unnumbered: the builder assigns a spec number. The owner asked for the first three drawn how-tos to be built from this draft; they are in the same PR (see "First build" below). Independent Codex and Claude review of the spec and the build is still needed. Roadmap fit: priority 3 (clear instruction text and graphics) and the "short how-to demonstrations" row of the [film timing table](../../roadmap.md#films-and-songs-when-each-is-needed) under priority 5.

## Purpose

The owner asked for quick animations for instruction instead of complicated videos. A **drawn how-to** is a short picture that draws itself, one step at a time, in a pencil-and-ink style that suits the garden. It replaces a film wherever a game or idea needs a demonstration, and it costs about as much to author as a diagram.

The inspiration is [Diagrams, drawn with JavaScript](https://pele-art-diagrams.vercel.app/), a showcase for [Pele](https://github.com/obsidianmd/pele), the MIT-licensed Mermaid renderer from Obsidian. Each picture there starts as a few lines of Mermaid text. Pele lays it out, then a program redraws its shapes stroke by stroke with a simulated pen and coloured pencils, using single-stroke engraving letters. Nothing is an image file. This proposal takes the same three layers and fits them to this app's rules.

A drawn how-to is optional presentation, like every film. A still picture and short text always carry the same instruction, and no drawing gates play.

## What the child sees

A "Show me" button inside an existing help fold opens a drawing panel in place. The panel has the drawing, one caption line under it, and native buttons: **Pause** (which becomes **Play**), **Back**, **Next**, **Watch again** and **Close**.

- **It plays, then you can step.** Opening the panel plays the whole drawing once, step by step. Each step draws in one to two seconds while the caption changes to say what was just drawn, with a short rest before the next step. The whole play-through lasts about 15 seconds at most. There is no sound and no timeline scrubber.
- **Stepping at any time.** Back and Next move one step at a time; using either pauses playback. Play resumes from the current step. This keeps Jane's worked-example rule (each step can be revealed one at a time) while letting the first viewing run on its own.
- **Short.** At most six steps. A caption is one sentence of 15 words or fewer, in the second person, using the shared glossary names from Push C.
- **Finished picture stays.** When playback ends, the whole drawing remains as a still, with every caption listed beneath it as a numbered list, so a reader can review without replaying. Back and Next still step through it from there.
- **Watch again** clears and plays from step one. Close returns focus to the "Show me" button.

## Two kinds of drawn how-to

1. **How to play.** The steps of a turn or a task in a game that is still confusing after the Push C text fixes. Mermaid flowcharts and state diagrams fit this: "spin, then step, then the turn passes". Which games get one is decided case by case from Push C findings, as the roadmap already says for demonstrations.
2. **How an idea works.** A concept whose diagram *is* the lesson. The first candidate is a life-cycle ring (see "First pilot" below). Timelines, simple flows and sorting trees are later candidates.

## First pilot: a life-cycle ring

Marble's teaching research for **Drawing Life Cycle Diagrams** (`mt_7EqhgErJyU`, representational, ages 7 to 8) says the diagram's grammar is the content. Its points, paraphrased:

- A life cycle is a closed loop; the adult produces the next egg or seed, so the last arrow returns to the start.
- Each arrow means "turns into".
- Comparing two species with one diagram grammar teaches the grammar and the difference: a butterfly has a pupa stage and a grasshopper doesn't.
- The commonest error is drawing a straight line with an end.
- Children should read finished diagrams as well as draw them.

Its suggested activity even ends with the ring animating once around to make "no end" visible.

A drawn how-to can show exactly that. The pilot is one panel in two parts:

1. Draw a butterfly's stages (egg, caterpillar, chrysalis, butterfly) one per step, with a "turns into" arrow before each new stage.
2. Draw the closing arrow last, on its own step, with the caption "The butterfly lays eggs, so the ring starts again."
3. Draw a grasshopper ring beside it (egg, nymph, adult), closing it the same way.
4. A final step marks the stage the grasshopper does not have.

The pilot is a demonstration only. It asks no question and records nothing. Interpreting, labelling and building rings are later activities that need their own spec. The garden setting fits Act II (community making: the market and garden), which has room for life-cycle content.

**Layout risk, answered by the build.** Pele's state-diagram layout drew a five-state test cycle as a vertical column with one long return edge (local test, Pele 1.10.0). That reads like a line with a back arrow, which is the misconception the pilot exists to correct. The prototype must show a layout that reads as a ring. Pele can't produce one, so the authoring script places the ring on an upright ellipse, and Pele lays out only the flowcharts.

## How a drawn how-to is made

All drawing work happens when the content is authored, so the shipped game stays static, offline and dependency-free.

1. **Source.** A content module holds each how-to as frozen data: `{version:1, id, mermaid, steps:[{caption, draws:[ids]}], alt}`. `mermaid` is the diagram text. `draws` lists the Pele node and edge ids (Pele's SVG carries a `data-id` on each) that appear at that step. Captions are child text, stored as text.
2. **Layout.** An authoring script under `scripts/` runs Pele in Node with a pinned version. It uses a custom text measurer so labels are sized for the drawn lettering. Pele is a dev-time tool only and is never shipped or loaded by the game.
3. **Drawing.** The same script turns Pele's shapes into hand-drawn strokes: slightly wobbled lines from a fixed seed, pencil fills and single-stroke letters for in-picture labels. It writes one static output per how-to (SVG path data grouped by step) into `dist/`. The fixed seed makes the output identical on every run, so a diff shows real changes.
4. **Playback.** A small player module animates each step's strokes with `stroke-dashoffset`, in drawing order. No canvas, no runtime layout, no font loading.

A check script confirms each output still matches its source text, and fails if someone edits one without the other.

**Lettering.** Pencil-style single-stroke letters are what make labels "draw". They must stay easy for early readers: plain upright letterforms only, never script, at the same minimum size as body text. Captions stay real HTML text in the app's own font. The license audit confirms the terms for any stroke font used (the inspiration site used A. V. Hershey's 1967 letters by way of the MIT `hersheytext` package).

## Accessibility and motion

- The drawing has `role="img"` and an `aria-label` describing the finished picture. Each caption is announced through a polite live region as its step draws.
- With `prefers-reduced-motion`, nothing plays on open. The panel opens on step one with its strokes complete, and Back and Next show each step complete at once, with no drawing motion. Play is still offered and shows the steps complete one after another.
- Buttons are native, at least 44 px, keyboard reachable, with visible focus. Opening the panel moves focus to Pause, so a keyboard or switch user can stop playback at once. Focus stays on Next while stepping.
- Meaning never depends on colour alone. Pencil colours come from the app's light and dark tokens and pass contrast in both themes.
- Layout holds from 320 px wide with no horizontal scroll. Wide diagrams scale down; if a diagram can't stay legible at 320 px, it is redesigned for portrait, and a phone never gets a sideways-scrolling picture.

## Saved state and records

None. Opening, stepping through or replaying a drawn how-to saves nothing and is not recorded as support, familiarity or anything else about the child. Grown-up notes don't mention it. This matches the app's rule that help is always open and using it says nothing about the child.

## Upstream study

- **Jane** ([kentlangley/Jane](https://github.com/kentlangley/Jane) at `27264f47`, `LESSONS.md`): reused the short second-person wording limits and adapted the worked-example rule (one idea plus steps revealed one tap at a time). Here the drawing plays once on its own first, and each step can then be revisited one at a time. A drawn how-to is the "show me" rung that sits before guided practice and inside the stuck-help ladder. Not adopted: quests, bosses, medals or timers. No Jane code or content is incorporated.
- **Marble** ([withmarbleapp/os-taxonomy](https://github.com/withmarbleapp/os-taxonomy) at `a8719737` via Jane's `data/marble/teaching-research.json`; the app's pinned copy is in `curriculum/marble/`): the pilot follows the teaching research for `mt_7EqhgErJyU` as summarized above, paraphrased with no research text copied (CC BY-SA). Its hard prerequisite is Sorting into categories (`mt_xppl18avyY`), which `topic-coverage.csv` lists as not yet mapped. The pilot is a demonstration, so no coverage is claimed for either topic.
- **Pele** ([obsidianmd/pele](https://github.com/obsidianmd/pele) at `4eff76f9`, version 1.10.0, MIT, author kepano): studied as a dev-time layout tool. Its own website animates diagrams for a social video; that is a design reference only. Nothing is incorporated until the build records the exact version and license in `NOTICE`.
- **The inspiration site** is a design reference only. Its drawing code is not available to reuse and none is copied.

## Candidate references

Candidates only, to be confirmed by a source audit. A demonstration observes nothing, so none is claimed as taught:

| Topic | ID | Fit |
| --- | --- | --- |
| Drawing Life Cycle Diagrams | `mt_7EqhgErJyU` | the pilot's ring and its two conventions |
| Animal Life Cycles | `mt_A1Xfu5p5KT` | later: comparing more animals |
| Life Cycles of Organisms | `mt_4IVWRAZoNC` | later: plants and more species |
| Breaking Tasks into Steps | `mt_miGrca8zaS` | how-to-play steps model a task broken into steps |

## Six-act reconciliation

Spec 49's six acts are recovery, community making, wider exchange, evidence and disagreement, learner-originated projects, and the Opening of the Ways. Drawn how-tos are presentation that serves every act and creates no act of its own. The life-cycle pilot sits in Act II's garden, in strand S2 (life cycles, organism needs) of [six-act strands](../../six-act-strands.md). How-to-play drawings attach to whichever game needs one. A later act may return to the same ring grammar, for example a learner drawing their own ring as an Act V project, but that is a separate spec.

## Out of scope

- Video files, narration, music, characters acting out scenes and story films. Those stay in the film timing table.
- Any question, score, check or recorded outcome inside a drawn how-to.
- Learner-drawn diagrams.
- Shipping Pele, or any Mermaid renderer, to the browser.
- Generated images from hosted tools.

## Acceptance and gates

**Before build:**
- independent Codex and Claude specification review;
- a license audit of Pele, the stroke font and any helper package;
- a prototype of the authoring script that renders the life-cycle pilot. That prototype answers the ring-layout risk above.

**Tests** (from synthetic content only):
- every step's `draws` ids exist in the rendered layout;
- each id is drawn exactly once;
- the check script fails when source text and output drift;
- the authoring script gives identical output on repeat runs;
- the player draws nothing beyond the current step;
- opening plays every step once in order, then stops on the finished still;
- Back, Next and Pause stop playback and Play resumes from the current step;
- reduced motion plays nothing on open and shows complete strokes;
- Watch again resets to step one and plays;
- nothing is written to saved state.

**Browser checks:**
- legibility and no horizontal overflow at 320, 820 and desktop widths in both themes;
- keyboard-only pausing and stepping;
- screen-reader announcement of each caption;
- the still-and-captions view after the last step.

Passing these shows the player works as specified, not that any child learned anything.

## First build (2026-10-24)

The owner asked for the first three to be built. What shipped, and where it differs from the text above:

- **Life-cycle ring** in the help fold of "One butterfly, changing bodies" (`#living/stages`). It is the small white only, since that is the species the game teaches; the grasshopper comparison waits for its own reviewed content. The ring is placed by the script, as described above, and the last step traces the ring again in green.
- **How to play Shutters** and **How to play Ribbon Rows**, Pele flowcharts of a turn. Neither game has a help fold, so the "Show me how to play" button sits under the rules on the setup and game screens. Ribbon Rows leaves it out of strategy practice. The two-row and three-row variations share one turn rule, so one drawing serves both.
- **Player.** A small custom element, `<drawn-howto>`, builds its own panel and stops any drawing when the page re-renders or the child leaves. Pages add it with one tag, and no game's saved state or binder changed.
- **Lettering.** In-picture labels use Hershey's single-stroke sans letters, drawn at a 24 px layout size. At 820 px they are about full size. On a 320 px phone the Shutters drawing, the widest, scales its labels to about 11 to 14 px, below body text. Captions carry every instruction in 18 px text, so nothing depends on the small labels, but a narrower Shutters layout is worth trying in review.
- **Themes.** The game has one light theme, so the pencil colors use its tokens and no dark palette was added.
- **Checks.** `test/drawn-howtos-checks.mjs` covers content limits, the generated art and the playback rules. `test/drawn-howtos-browser.js` covers play-through timing, Pause, Back, Next, Watch again, Close, focus, reduced motion, leaving mid-play, 44 px targets, no overflow and no saved change at 320 and 820 px. The existing Shutters, Ribbon Rows, three-row and life-stages browser checks still pass.

