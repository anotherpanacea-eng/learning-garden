# Repeat a Delivery Block: source and overlap audit

Source audit for increment71, checked2026-10-22. This document supplies source/content grounding, not independent specification review or implementation clearance. Only this audit was authored in this task. No curriculum/runtime pin, source graph, atlas, code, test or art was changed.

## Fresh references and material source drift

Public GitHub HEAD lookups returned Jane **`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`** and Marble **`3de50367b23be6a03d1a8385daae16d5eed2675d`**. Six files were fetched successfully at those exact revisions and inspected: Jane [LESSONS.md](https://github.com/kentlangley/Jane/blob/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81/LESSONS.md), [src/engine.js](https://github.com/kentlangley/Jane/blob/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81/src/engine.js), [src/stuck.js](https://github.com/kentlangley/Jane/blob/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81/src/stuck.js), [LICENSING.md](https://github.com/kentlangley/Jane/blob/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81/LICENSING.md); Marble [data/topics.json](https://github.com/withmarbleapp/os-taxonomy/blob/3de50367b23be6a03d1a8385daae16d5eed2675d/data/topics.json) and [data/dependencies.json](https://github.com/withmarbleapp/os-taxonomy/blob/3de50367b23be6a03d1a8385daae16d5eed2675d/data/dependencies.json). Retrieved sizes were respectively30,931;59,611;10,783;4,967;2,152,732;881,618 bytes. Temporary downloads are review intermediates, not a new repository source registry.

**The historical21-topic Computing inventory is not current upstream coverage.** The full vendored source at `96a7933754af672e1bfdbf7ecb05c325860c6e0d` contains1,590 topics,21 in Computing. The refreshed source contains1,930 topics,59 in Computing. Inspection of the refreshed Computing names, descriptions and evidence found dedicated repetition topics: **Loops in programs** and **Decisions and repeats in algorithms**, plus the relevant **My first visual program** predecessor. All three are absent from the full vendor and runtime subset. Therefore “Marble has no dedicated repetition topic” would be false for this refreshed source. The proposed activity is an original app task/model, not an original taxonomy concept.

The old Step-by-Step Instructions anchor remains useful: its name, description, evidence array and incoming dependency triple match exactly across refreshed and full vendored copies. Its metadata does not fully match. Upstream now places it in **Algorithms & Programming**, extends the source age range from5–7 to5–10, changes centrality and adds standards identifiers. Computers in Everyday Life moves from **Artificial Intelligence** to **Digital Systems**, extends5–7 to5–8, and changes centrality/standards. These changes are recorded rather than silently imported; ages/centrality/standards are not learner routing or readiness criteria. The app's current pinned classification remains historical.

## Full relevant meanings, evidence and scoped dispositions

The following descriptions and evidence are attributed Marble content, under the existing CC BY-SA4.0 content licence; the graph/database remains ODbL1.0. Exact source language is separated from the original activity disposition.

### Existing pinned anchor: `mt__p5n8z5soJ` — Step-by-Step Instructions

Source description: “Step-by-step instructions for everyday tasks (making a sandwich, brushing teeth); that if instructions are wrong or missing, things go wrong; computers follow instructions exactly”.

Complete evidence:

- “Write or describe step-by-step instructions for a simple everyday task”
- “Predict what goes wrong if a step is missing or in the wrong order”
- “Explain that a computer follows instructions exactly — it cannot guess what you meant”

Disposition: retain this existing pinned partial reference for composing, tracing and revising precise supplied movement instructions. Selecting arrows and observing supplied execution does not establish free written algorithms, independent explanation or all everyday-task evidence. Its **full transitive hard closure contains2 nodes**, including the target and Computers in Everyday Life.

### Upstream-only design reference: `mt_6XbAmdmjDb` — Loops in programs

Source description: “Use repeat (loop) blocks in a visual program to repeat actions a set number of times or forever, and identify where a loop makes a program shorter”.

Complete evidence:

- “Rewrite a program that repeats 'move 10 steps' four times so that it uses one repeat block”
- “Use a repeat block to draw a square with a sprite or robot (repeat 4: move, turn 90 degrees)”
- “Explain the difference between 'repeat 10' and 'forever' blocks with an example of when to use each”

Disposition: this is the closest refreshed conceptual reference for a counted block. The proposed finite2-arrow,2/3-repeat delivery supplies a compact program and expands the whole ordered group; it does not draw a square, use relative90-degree turns, provide arbitrary programs or teach forever loops. It therefore offers partial practice relevant to this topic, not its full evidence. **Keep it an explicitly upstream-only design reference for this slice**, absent from vendor/runtime; do not create a direct runtime/atlas ID reference that the pinned dataset cannot resolve. Its **full hard closure contains4 nodes**: Loops in programs → My first visual program → Step-by-Step Instructions → Computers in Everyday Life.

### Upstream-only design reference: `mt_iqmt8wL26h` — Decisions and repeats in algorithms

Source description: “Follow and describe algorithms that include a sequence of steps, branching (a decision such as 'if it is raining, take an umbrella') and iteration (repeating steps, such as 'hop 3 times')”.

Complete evidence:

- “Follow movement instructions that include a repeat (e.g. 'repeat 3 times: step forward, clap') and describe which part was repeated”
- “Follow an algorithm with a decision (e.g. 'If the card is red, put it in the box; otherwise put it on the table') and explain what the decision did”
- “Describe the steps, decision and repeat in a familiar routine, such as getting ready for school”

Disposition: directly relevant to repeating a group of movement actions. This slice deliberately omits branching and familiar-routine explanation, so the combined topic cannot be treated as complete. The input choice of an arrow/count is not an executed if/else branch. It remains upstream-only, without a pin or runtime graph expansion. Its **full hard closure contains3 nodes**: this topic → Step-by-Step Instructions → Computers in Everyday Life.

### Upstream-only hard ancestor: `mt_sPV503BQnI` — My first visual program

Source description: “Implement a simple algorithm as a visual (block-based) program — a start event, a sequence of blocks, run and observe — in an environment such as Scratch, ScratchJr or a programmable robot app”.

Complete evidence:

- “Drag blocks into a sequence so a character moves, speaks and changes costume when the green flag is clicked”
- “Run the program and check that it does what the planned algorithm said”
- “Swap two blocks and explain how the order of blocks changes what the program does”

Disposition: Start/Step and an ordered two-arrow block provide bounded run/observe/order practice, with native tap/select controls rather than required dragging. This is not a Scratch implementation, speech/costume/event curriculum or evidence of independent block programming. It remains absent from vendor/runtime and is not silently required as a learner access gate.

### Existing pinned hard ancestor: `mt_XbGfVhfiUz` — Computers in Everyday Life

Source description: “Identifying computers in everyday life — not just laptops but phones, tablets, smart speakers, traffic lights, washing machines; what makes something a computer”.

Complete evidence:

- “Point out at least five everyday objects that contain computers”
- “Explain what all computers have in common (they follow instructions and process information)”
- “Sort a set of objects into 'contains a computer' and 'does not contain a computer'”

Disposition: explicitly identify the current computer model as following supplied rules. The proposed activity does not survey devices, sort objects or meet the five-object evidence. This is a scope exception, not a prerequisite quiz.

## Complete incoming relationships and runtime comparison

The union of the three inspected target closures contains **5 nodes**, all described above. Traversal follows `topicId` to `prerequisiteId` for **hard** edges; soft edges are recorded without recursively expanding that union. Complete refreshed incoming triples, including source reasons:

| Topic | Prerequisite | Strength | Source reason |
|---|---|---|---|
| `mt__p5n8z5soJ` | `mt_XbGfVhfiUz` | hard | Must know computers exist before understanding they follow exact instructions |
| `mt_6XbAmdmjDb` | `mt_sPV503BQnI` | hard | 'Loops in programs' builds on 'My first visual program' |
| `mt_6XbAmdmjDb` | `mt_zQfWqImxva` | soft | 'Following number algorithms' supports 'Loops in programs' |
| `mt_iqmt8wL26h` | `mt__p5n8z5soJ` | hard | 'Decisions and repeats in algorithms' builds on 'Step-by-Step Instructions' |
| `mt_sPV503BQnI` | `mt_iqmt8wL26h` | soft | 'Decisions and repeats in algorithms' supports 'My first visual program'; branching and loops are taught in the later loop and decision topics |
| `mt_sPV503BQnI` | `mt_o0vTMl8vj5` | soft | 'Parts of a computer' supports 'My first visual program' |
| `mt_sPV503BQnI` | `mt__p5n8z5soJ` | hard | 'My first visual program' builds on 'Step-by-Step Instructions' (a first program is a start event plus a sequence) |

Computers in Everyday Life has no incoming edges. Outside-union soft context **Following number algorithms** concerns number algorithms with decisions and repeat-until conditions; **Parts of a computer** concerns components and input/output. Neither is authored by this narrow delivery block or added to the hard closure. No source edge becomes an access lock.

For the two already-vendored nodes, refreshed/full-vendor names, descriptions, evidence and **all incoming triples** match. Both are also present in `dist/marble-map.json`, with matching names/descriptions and the complete single hard relationship. Runtime omits evidence arrays and retains the old domains. It cannot establish full metadata/evidence equality with the refreshed source. The three new nodes have no full-vendor/runtime counterparts or incoming triples there; absence is not interpreted as a topic with no prerequisites. Preserve the current pin and existing scoped Step-by-Step anchor; new upstream loop references remain documented design context.

## Jane: useful design study, no adopted interpreter

The refreshed lesson contract supplies purposeful short stages, stable authored items, an idea/worked example before practice, and manual reveal of example steps. Engine `packItem` supports an ordered-item answer by comparing a fixed list; `stuck.js` keeps an authored similar example and how-to-start help separate. Those patterns inform short turns, a separate optional example, and explicit support. They do not supply the proposed counted two-arrow movement semantics: the inspected order format is answer ordering, not a repeat block with a grid execution cursor. No claim is made about every uninspected Jane lesson or repository file.

The proposed model should reuse original Learning Garden geometry/execution helpers, not Jane's grading engine, fuzzy prose handling, mastery/boss thresholds, rewards, age routing or remote learner storage. No new Jane code, lesson prose, diagrams or media is incorporated. Jane `src/` is MIT; `LESSONS.md` and project docs are CC BY-SA4.0; its taxonomy-derived material has separate ODbL/CC BY-SA terms. This is design study, not a blanket MIT-content claim. Existing incorporated-code notices remain unchanged.

## Primary computing references and limits

The author directly read the Department for Education's official [National curriculum in England: computing programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study/national-curriculum-in-england-computing-programmes-of-study). Key stage1 includes precise algorithms, simple program creation/debugging and predicting behavior. Key stage2 explicitly includes repetition alongside sequence/selection and reasoning about errors. This supports the intended relation and trace/revision actions; a four-case finite model does not establish a key-stage curriculum, general programming proficiency, independent explanation, selection, variables or broad input/output competence. The publication is Crown copyright2013 under OGLv3. No curriculum lesson prose is copied into the activity.

The author also directly read the NCCE public [Programming A — Repetition in shapes unit overview](https://teachcomputing.org/curriculum/key-stage-2/programming-a-repetition-in-shapes) and [Patterns and repeats lesson summary](https://teachcomputing.org/curriculum/key-stage-2/programming-a-repetition-in-shapes/patterns-and-repeats). The latter connects identifying repeated parts/counts in a sequence with replacing a longer repeated sequence by a repeat command; its objectives include a counted loop producing an outcome. This is primary educational design support for the group/count distinction. The Learning Garden task uses original cardinal grid deliveries, not their Logo squares or lesson activities. Public summary pages were sufficient; no login-only package was accessed or copied. A direct request for the separate Lesson4 page returnedHTTP429, so its content is not claimed as inspected. No research-effect, age-placement or instructional-efficacy conclusion follows from these curriculum descriptions.

## Actual app seams and four complete original cases

The chosen scope is a **separate optional repeated-routes record/mode** at the existing Cartographer setting. That resolves the inventory's narrow state decision without migrating shared legacy fields. Reuse the pure `walkMap` and known0..5 intersection geometry, absolute cardinal directions, symbol key, model-unit disclosure and local rendering patterns. Preserve existing A/B maps, Post visits and Instructions notebooks unchanged. This is an original app feature with a fixed grammar—two arrows repeated2/3 times—not a universal interpreter.

Actual overlap was read in `cartographer-core.mjs`, `cartographer-ui.mjs`, `cartographer-jobs.mjs`, `post-office-core.mjs` and `instruction-core.mjs`. Post steps a maximum6 named-place clauses, using direct flights rather than equal-unit movement. Instructions has a manual run cursor but allows at most3 unique actions; its source scene rules are not grid movement. Cartographer has flat A/B direction arrays, each up to12; `mapRoutes` computes whole paths immediately, without a repeat group or manual cursor. Keeping only expanded commands would lose whether the learner composed `[East, North]×3` or six individually selected arrows. The new record needs to retain the block/count and cursor, while frozen checks retain their own source/program/results.

For all four original cases, let Post Office be`(1,1)`, Bridge`(k,1)`, Café`(k,k)` and Garden`(1,k)`. Four distinct symbols remain on the same bounded grid. These are direct delivery requests, **not** the existing fixed jobs requiring an intermediate collection stop. The diagonal routes do not visit those job stops, so their IDs/fulfillment claims must not be reused.

| Original case | k | Fixed request | All arriving block/count proposals | Expanded move count |
|---|---:|---|---|---:|
| Small delivery |3|Carry a sign from Post Office to Café.|`[East, North]×2` or `[North, East]×2`|4|
| Larger delivery |4|Carry flowers from Post Office to Café.|`[East, North]×3` or `[North, East]×3`|6|
| Small return |3|Return the sign from Café to Post Office.|`[West, South]×2` or `[South, West]×2`|4|
| Larger return |4|Return the flower basket from Café to Post Office.|`[West, South]×3` or `[South, West]×3`|6|

The four-case finite space contains128 complete proposals:4 cases ×4 first arrows ×4 second arrows ×2 counts. Exactly8 arrive, including both arrow orders per case; all other directions/counts either end elsewhere or meet a grid boundary. Earlier inventory enumeration used the actual pure walker; these are source/content arithmetic facts, not tests of a new implementation. Example larger outward trace: `(1,1)→(2,1)→(2,2)→(3,2)→(3,3)→(4,3)→(4,4)` for`[East, North]×3`.

The new learner action must remain counted repetition, not a text quiz or automatic teleport. Manually advance one expanded arrow while highlighting its iteration and position inside the bracket; keep2 block arrows,2/3 repetitions,4/6 proposed moves and actual travelled moves distinct. In particular:

- `East East East North North North` has the same larger endpoint and6 moves, but is not the ordered expansion of`[East, North]×3`. Endpoint/count alone cannot judge trace agreement.
- `East North North North` repeats only the second arrow and ends`(2,4)` after4 moves.
- `[North, East]×3` is a valid different staircase, not a wrong canonical order.
- `[West, North]×3` from`(1,1)` proposes6 moves, travels2, then blocks at command3. A short travelled prefix is not successful delivery or a6-metre route.
- Using2 repetitions for the larger outward case ends`(3,3)`; changing the count to3 visibly repairs it.

`appendMapMove` refuses boundary additions before storing them. This mode should expand the retained bounded proposal and use pure `walkMap` to explain the blocked prefix, rather than silently discard a mistaken repeat. Optional help, oral participation, incomplete keeps and open destinations remain available; supplied expansion, position labels and feedback cannot be reported as independent counting, reading or general programming. No new source ID, broader coverage, mastery or shared progress inference is warranted by this audit.

Marble attribution remains: **Marble Skill Taxonomy(v1) · © Generative Spark, Inc.(Marble) · https://withmarble.com · database ODbL1.0; content CC BY-SA4.0.** Exact source meanings/edge reasons above are attributed taxonomy content. All proposed case wording, delivery structure and app interaction are original; upstream references are design study, with no copied external lesson, media or new runtime dependency.
