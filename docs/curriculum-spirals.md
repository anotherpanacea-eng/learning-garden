# Curriculum spirals: turn a familiar game into a new kind of thinking

**Plan checked 2026-10-20.** Increment 1 now has a bounded local implementation in [spec 38](specs/38-equal-group-spiral.md); increments 2–3 remain proposals. It builds on the [full atlas](learning-atlas.md), not a replacement 1,590-topic curriculum. The first increment is built; the remaining two are candidates for independently reviewed builds, in priority order. All destinations stay open.

A useful spiral revisits an idea while changing what the learner has to notice, represent or explain. More numbers, longer passages and new scenery can provide practice, but do not by themselves supply the missing conceptual step. We should sometimes keep the numbers or passage fixed and change the question, representation or audience.

## What Jane and Marble contribute

Public source files checked at exact revisions:

| Reference | What was inspected | Useful here; important contrast |
| --- | --- | --- |
| [Jane `385f644d6ffcd5f80f809888591d871a074b7855`](https://github.com/kentlangley/Jane/tree/385f644d6ffcd5f80f809888591d871a074b7855) | [`LESSONS.md`](https://github.com/kentlangley/Jane/blob/385f644d6ffcd5f80f809888591d871a074b7855/LESSONS.md), [`src/engine.js`](https://github.com/kentlangley/Jane/blob/385f644d6ffcd5f80f809888591d871a074b7855/src/engine.js), [`packs/examples/example-quest.json`](https://github.com/kentlangley/Jane/blob/385f644d6ffcd5f80f809888591d871a074b7855/packs/examples/example-quest.json), `LICENSE`, `LICENSING.md` | Small purposeful quests; examples revealed one step at a time; guided attempts; different response formats; help that progresses from a clue to an example; returning to an idea. Its engine also couples selection to topic states, review boxes, points and access rules. Study the support mechanisms separately; don't import that learner model or its locks and penalties. |
| [Marble `ff9853306ba0c36a3e0045f43054f6039f62b0e5`](https://github.com/withmarbleapp/os-taxonomy/tree/ff9853306ba0c36a3e0045f43054f6039f62b0e5) | `data/topics.json`, `data/dependencies.json`, `README.md`, `LICENSE` | Stable topic identities, descriptions, evidence fields and explicit prerequisite relationships help us find omitted ideas. These are curriculum references, not validated placement or mastery instruments. A named topic can be much broader than a particular activity. |
| [Our pinned Marble `96a7933754af672e1bfdbf7ecb05c325860c6e0d`](https://github.com/withmarbleapp/os-taxonomy/tree/96a7933754af672e1bfdbf7ecb05c325860c6e0d) | Complete vendored topics and dependencies; current atlas; runtime content and connections | The mappings and source-edge examples below use this existing pin so they can be checked against the repository. The latest inspected upstream is 1,616 topics / 3,317 edges; our pin is 1,590 / 3,221. Updating the reference data is a separate small maintenance change, not an automatic curriculum expansion. |

Upstream changes include a new **Line graphs** node (`mt_HlNSurPVDp`) and corrected relationships around writing feedback, representations and forces. For example, current upstream makes **Responding to Writing Feedback** a soft prerequisite of **Reviewing Own Writing**; our pin has that soft edge in the opposite direction. Preserve each source honestly until a reviewed pin refresh updates the derived atlas. Don't silently reverse edges in the current files.

Jane's inspected `LICENSING.md` assigns `src/engine.js` and application code to MIT, lesson packs and `LESSONS.md` to CC BY-SA 4.0, and taxonomy/glossary derivatives to ODbL / CC BY-SA layers. `src/engine.js` imports the generated, uncommitted `src/gen.js`; copying the engine alone would not supply a usable generator. This increment studies design and data; it incorporates no additional Jane code or lesson prose. Our previous small publisher-helper adaptation remains separately attributed. Marble topic names/IDs and source relationships retain the existing [NOTICE](../NOTICE) attribution: Marble Skill Taxonomy v1, © Generative Spark, Inc.; ODbL 1.0 database / CC BY-SA 4.0 content. Separate hosted Water Lab/Ecosystem experiments have no inferred code-reuse permission from the taxonomy license.

## Current footholds, missing steps, and useful contrasts

This inventory is grounded in the current `dist/` modules. “Missing” means missing from these authored loops or their documented scope, not proof the child cannot do it. The broader Number Garden already has fraction, measurement, geometry, place-value and pattern tasks; this plan does not mistake those for absent subjects.

| Strand | What we can already use | Next conceptual step or contrast | A plausible spiral across places |
| --- | --- | --- | --- |
| Equal groups and inverse relations | Café equal plates; Living Garden packs, inverse pack count and tomorrow's adjustment; Bramble arrays/decomposition; full ordered 12×12 fact practice | Deliberately contrast “how many in each?” with “how many groups?” for the same total; connect a rearranged array to an equation and explain what the factors name. Increasing a factor is not that contrast. | Build a delivery → share it at a table → recover the missing quantity at Bramble → explain the relation in a new delivery. |
| Fractions and measurement | Number Garden shares, lengths/borders/area; existing optional café link to fractions | Hold the whole and unit visible. Contrast equal numbers of pieces with equal sizes; compare the same fraction of different wholes; bridge equal-group division to a fraction of a set. Later: actually measure a recipe and compare equivalent amounts. | Café bakery → Number Garden strip/set model → measured recipe → revise a useful recipe message. Separate from the first equal-groups increment. |
| Reading and word meaning | Paris details, sequencing, inference/evidence choices; Word Garden meaning-bearing parts and novel combinations; French Paris has separate evidence | Contrast what the message states with what the reader infers; test whether a chosen clue really supports a claim; move from choosing supplied wording to composing an explanation for someone. A fantasy word can work in a story without being a conventional spelling. | Read a parcel note → repair a post-office message → have a puppet act on it → revise after a reader's question. |
| Writing and audience | Post Office finite word-card instructions and literal execution; Story Loft optional original dialogue and 1–12 scenes with revision | Give the message an actual reader and an intended effect. Longer stories are one option; clearer motives, causality, references and revision are other dimensions. Free text alone establishes neither independent writing nor quality. | A reader asks “Which basket?” → add a useful detail → test the message → reuse that explanatory habit in a story. |
| Decoding and transcription | Word Garden explores morphology, not a systematic sound–letter progression; listening is available in other games | Sound identification, blending and segmenting need explicit reviewed representations/audio and adult observation. Comprehension after narration cannot fill this gap. Handwriting and fluent transcription remain outside current screen evidence. | Future Word Workshop: hear/build/change a word → meet it in a tiny connected text → optional paper spelling. Keep this as an independent door, not a prerequisite lock on Paris or stories. |
| Living things and scientific inquiry | Living Garden compares animal needs/conditions; Workshop controls one ramp variable and displays authored trial distances; Water Lab explains molecule-level changes | Distinguish observed change from explanation; predict and compare repeated conditions over time; record units and variation. Plant requirements and organism interdependence need their own teaching. A damp spot is not automatically an animal's whole habitat. | Predict plant growth → examine dated observations → compare conditions → explain a planting choice → later build a reviewed food chain. |
| Data and evidence | Workshop table and zero-based bars; Living Garden clue/evidence choices | Learner chooses what data answer a question and constructs or interprets a comparison. Displaying a chart is not teaching graph construction. A simulated result is not real-world field evidence. | Compare garden growth → build a small labelled bar chart → question a claim → explain a delivery plan with that evidence. |

Current cross-game arithmetic invitations in `learning-connection-data.mjs` pass a frozen fact pair and distinguish direct, inverse and tomorrow contexts; a successful first match can suggest a nearby pair. That is useful continuity. It does **not** yet select a missing conceptual bridge, establish cross-context transfer, or share a reading/science profile. Retain it while authoring richer tasks rather than replacing it with a global score.

French Paris can eventually reuse a reviewed interaction with separately authored French text, support and observations. English source topic IDs do not become French proficiency mappings, and language complexity must remain independent of the learner's age or interests.

## Keep three kinds of connection separate

In the source file, `topicId` **depends on** `prerequisiteId`. Below, `A → B` reads “A is a source prerequisite for B,” reversing the file's key order only for human reading. These are selected examples, not complete prerequisite lists:

| Kind | Verified example | How to use it |
| --- | --- | --- |
| Existing-pinned Marble hard edge | `mt_PZ909yPrEC` Multiplication as repeated addition → `mt_GRWwTDZ3wD` Arrays for multiplication | Check that a new array task makes equal groups visible; do not claim all array evidence from one total. |
| Existing-pinned Marble hard edge | `mt_LpSuPgL31x` Division as equal sharing → `mt_iNdrM2-oJf` What Division Means → `mt_GDG9_SZmsO` Division as Unknown Factor → `mt_xZvDCYA5Ae` Unknown in Multiplication & Division | Supply the omitted meanings/unknown positions rather than presenting a missing-factor numeral as the whole division pathway. |
| Existing-pinned Marble soft edge | `mt_LpSuPgL31x` Division as equal sharing → `mt_cFltwUQi-d` Fractions of amounts | A candidate conceptual bridge from equal groups to a fraction of a set; notation and other source prerequisites still matter. |
| Existing-pinned Marble hard edge | `mt_3v0VNkwquK` What Plants Need to Grow → `mt_lutxvMlkwS` What Plants Need to Thrive | Start with a bounded comparison before multiple requirements or species differences. |
| Existing-pinned Marble hard edge | `mt_Wa44s-f8Ws` Simple tests and experiments → `mt_qgb76wHN2X` Fair testing | Begin with a supplied comparison; later ask the learner to choose what changes/stays fixed. |
| Existing-pinned Marble hard edge | `mt_nDAcXoPa0c` Simple Stories with Beginning and Ending → `mt_vauULTecMH` Narrative Writing → `mt_BLzNxSSdWu` Writing Character & Dialogue | Offer purposeful development; do not equate 12 scenes with developed narrative or claim the broader advanced dialogue topic. |
| Original proposed teaching bridge | Living Garden parcel quantities → Café two kinds of sharing → Bramble unknown factor | Our deliberate task sequence, **not** a newly discovered Marble edge. |
| Original thematic invitation | Café audience → Story Loft show; Post Office flight → Workshop ramp | A reason to visit, **not** evidence of a common skill or prerequisite. |

Name-only mapping fails in this graph: pinned `mt_HY8Yycu_rz` is titled “Understanding fractions (age 7+)” but describes precise mathematical communication; `mt_IHipFGTFEY` is titled “Understanding fractions” but describes fractional measurement line plots. Likewise `mt_S3XMQOYt_D` includes evaluating an author's arguments, much broader than choosing one supporting sentence. Match descriptions/evidence and task limits before adding a scoped activity reference. Bibliographic evidence fields such as those for inference and writing review are not rubrics to score automatically. Source age fields stay reference metadata, never placement or access conditions.

## First three playable increments

Increment 1 is implemented as an optional bench beside the existing games; the next two remain proposed bounded specifications. Each uses the existing pagination approach: one immediate instruction/question, a persistent relevant model or message, optional stepwise help, Back and a recoverable draft. Preserve inventory, unfinished orders/deliveries, local exports, supported attempts and unfamiliar-task observations. A child may pick any entry, depth or next place.

### 1. Same delivery, three different questions

**Built slice: [same supplies, different questions](specs/38-equal-group-spiral.md).** Café and Bramble now have paired editable benches with six positive quantity families through 12×12, three unknown roles, separate attempts and cloned arrangements on crossing. The original order/rival and inventory remain untouched. This is visual practice, not certified transfer. Broader recipes, fractions and remainders remain later work.

**Extend Café, with a Bramble invitation; no new world.** The small aim is to distinguish the roles of total, group count and group size, using the familiar serving loop.

- Author six reviewed quantity triples with totals at most 144 and factors through 12. Each supports “total?”, “how many on each plate?” and “how many plates?”. Begin with small manipulable quantities; larger totals must offer grouped moves rather than requiring 144 taps. Include a contrasted pair with the same total but different grouping. Never rely on commutativity to erase the units or story roles.
- Offer a pictured tray, movable bites, tap-to-distribute and labelled group/total counters; keyboard buttons provide every move. Keep the same objects available while switching the question. Optional overlays connect the picture to repeated addition, multiplication and the two division meanings; the equation must name the quantity being found.
- Start with a worked example on request, then a changed unknown using the same quantities, then a new-context invitation. A child can also start directly with any question. Ask an optional “What changed? What stayed the same?” explanation rather than manufacturing a right-answer prose grader.
- Reuse a quantity/model snapshot for a Bramble practice invitation, not the café's score or inventory mutation. The original order and plate remain editable. Inventory is spent only by the established serving action; practice and returning to a page never spend it.

**Acceptance:** Review every triple/prompt/model/equation together; test both division meanings and all three unknown positions, not only numeral calculation. Unequal arrangements remain visible and reversible; checking explains the equal-group constraint instead of silently fixing the model. Counters or overlays that supply the sought quantity are recorded as support, not an unaided response. Test reload/back/route change with an unfinished distribution and the original café order intact; verify no double inventory charge. A supported answer stays supported at the destination; narration/counting/self-report is not certified recall. A fresh context can collect its own attempt, without importing success. Verify touch/keyboard and narrow-screen access to the model while the current question is visible.

**Candidate scoped references:** `mt_LpSuPgL31x`, `mt_iNdrM2-oJf`, `mt_GDG9_SZmsO`, `mt_xZvDCYA5Ae`; reuse existing array/repeated-addition references only where those representations are actually used. Do not add full coverage declarations. Bakery fractions are a later contrast once the whole/unit model is authored.

### 2. A message that helps someone act — built slice

[Spec 39](specs/39-message-reader-spiral.md) implements three original storm-recovery notes at `#post/messages` and `#loft/messages`: which basket, which destination and which action. Two useful clear phrasings and a plausible different-purpose alternative accompany each original. Manual before/after playback, exact optional original wording for a human reader, and a separate puppet reason/reply rehearsal preserve ordinary deliveries and shows. Crossings clone the first draft and reopen existing work without replacement. This bounded slice is built; broader composition and paired-perspective reading remain planned.

**Extend Post Office and Story Loft; reuse Paris reading patterns.** Turn comprehension into purposeful composition and revision without turning creative choices into errors.

- Author three short fictional deliveries with a pictured destination and an ambiguous message, plus a contrasting clear version. For example, two baskets make “Bring it there” insufficient. The visible scene supplies the information needed; no obscure travel knowledge or spelling trick.
- Let the learner inspect “the message says” versus “I think it means,” select a clue, then repair the message with supplied cards **or** optional original wording. A reader/puppet can ask a specific question about the referent, destination or intended action. The structured path can run literally; original text is read/discussed with a companion rather than pretended machine comprehension.
- Keep the source message/scene visible through the revision. Before/after playback makes the intended change discussable. Offer the same purpose in a fresh note, then an optional Story Loft invitation to give a character a reason and a response; no minimum story length.
- Help can highlight a relevant scene detail or show a different worked example. It must not silently become an independent response. No automatic spelling correction, creative-quality score or general writing/reading level.

**Acceptance:** Content review checks explicit detail versus inference and plausible alternative readings for all three cases. A selected clue must actually support its stated claim. Test the literal structured runner separately from free text; the UI plainly describes when a human is the reader. Preserve exact optional authored text, scene, draft revision and delivery while changing pages/reloading; escape text in preview/notes/export. Provide meaningful keyboard/touch alternatives and optional narration. Narrated, together-read and independent-read observations remain separate; an author's new sentence is not an independent-writing claim unless support is explicitly observed.

**Candidate scoped references:** `mt_lp3qyEujIv`, `mt_OyOYHlZ2_T` (Responding to Writing Feedback), `mt_U_8iVFZuHH` (Reviewing Own Writing); `mt_vauULTecMH` only for the separate story opportunity. A local clue-selection task remains narrower than `mt_S3XMQOYt_D`. The new post-to-loft link is our teaching bridge, not a source dependency. This slice does not implement paired-perspective reading in spec 06.

[Spec 40](specs/40-changing-letters.md) extends this built slice into a continuing twelve-letter round: six one-detail notes, three paired-detail notes and three reader-knowledge/reason notes. First-kept supplied versions inform open structural suggestions; card experiments, original wording and familiar rereading are distinct. Current letters and their shuffled option order remain frozen, with retained drafts at both desks. This adds narrow audience-aware wording opportunities, not a general writing or reading assessment.

### 3. What would help this garden grow?

**Extend Living Garden with a small plant investigation; reuse Workshop comparison/table controls.** Connect planting plans to evidence instead of making a correct multiplication answer cause a plant to grow.

- Author one plant and a finite, openly labelled **illustrative model**: two light conditions, the same suitable water/temperature/container conditions, four observation days and at least two illustrative specimens per condition. Show more than height (leaf appearance as well as a measured length), so “taller always means healthier” is not taught. All biological relationships and numbers require reviewed sources before build; do not invent realistic-looking experimental results and call them measurements.
- Predict or choose “not sure,” examine the dated picture/measurement cards, put an observation into a small table, compare the conditions, then choose a planting location and explain the evidence. Manual time-step controls, no real waiting. “I saw…” and “I think…” stay visibly distinct.
- A first guided comparison supplies what is held fixed. An optional next question asks the learner which comparison would test water, including a confounded pair to discuss. Describe what the small model cannot establish; it is not an ecosystem simulator or proof about every species.
- Carry a chosen observation/table snapshot to a fictional gardener's note or a planned bed. Keep café parcels as labelled packages found nearby, not biological products grown instantly by solving questions. Later food-chain construction needs reviewed real organisms/energy arrows and a separate spec; a garden food chain must not be generalized to every ecosystem.

**Acceptance:** Before implementation, independently review plant conditions, source provenance, variation, units, leaf/height interpretation and model limitations; replace or defer the data pack if those are not credible. Verify table rows match visible specimen/day cards exactly and revisiting a day never duplicates observations. Compare same-day conditions with all declared controls visible; explain a confounded comparison rather than rewarding a guessed label. A learner's choice of useful data is distinct from copying a supplied row. Preserve prediction timing, table/draft and support flags across steps; no observed-fact claim for unseen days, screenshots or off-screen experiments. Reuse touch/keyboard controls and a text equivalent for every visual result.

**Candidate scoped references:** `mt_3v0VNkwquK`, `mt_ZFwPZaDJ0_` Recording Data, `mt_Hw70LI5xza` Observation vs Interpretation, `mt_qgb76wHN2X`; later `mt_lutxvMlkwS`. This is guided analysis of a supplied model, not evidence of independently designing/carrying out an experiment. Do not map it to the full `mt_ArVBEpMAPk` Controlling variables criteria.

## How suggestions can grow without building a new learner platform

For each new authored task, specify the **idea**, **representation**, **response**, **support available**, and **one contrast** to offer next. Put those fields in the existing content format when implementing a slice; do not create a universal schema or a permanent event ledger merely for this plan.

- After help or a retry: invite another example of the same idea, perhaps with a smaller quantity, a picture or a worked step. Do not assume why the child used help.
- After an apparently unaided response: offer a different representation, unknown position or purpose, with numbers/text that do not also add a second difficulty. A first correct choice is enough to offer a contrast, not enough to label mastery or remove help.
- After familiar material: offer an unfamiliar example of the same concept; record that example's support separately. Repeating a memorized story is a different observation from reading a new one.
- Always offer “try something else” and manual choice. Explanation, invention and audience discussion may have multiple defensible outcomes; preserve them as reflection rather than right/wrong evidence. No compulsory return date, gate, streak or points-to-play arrangement.

Cross-game invitations should carry the **chosen task and relevant work** (quantity/model; message draft; observation snapshot), not a copied success label. Each receiving task asks its own question. Use the existing local state/export/import protections and bounded histories; unknown future extensions remain recoverable. Authored text stays on the device unless the user explicitly exports it; only synthetic examples belong in source, testing, screenshots or review.

## What this leaves for later

The highest missing modality is reviewed sound–letter/blending/segmenting work: [spec 04](specs/04-word-workshop.md) remains the appropriate bounded starting point. Don't expand Word Garden's morphology claims into phonics. Additional future loops include bakery fractions/measurement, food webs, historical-source comparison, mapping, sound/light creation and reflective community conversation, as already sketched in the atlas. Some fit the familiar shells; historical uncertainty, auditory discrimination and making a composition need their own representations and responses.

Before choosing a fourth build, use what the first three reveal about the **activities**: can a child tell what the question is, retain needed materials, choose useful support, and explore the intended contrast? Parent observations can guide private choices. Game participation and a larger taxonomy mapping count are not evidence of learning gains. For each delivered slice, update only the actual task-scoped atlas references and its limits, keep a few synthetic transfer examples for review, and stop short of claiming a complete developmental sequence.

Source refresh for increment 2 (2026-10-20): Jane `385f644d6ffcd5f80f809888591d871a074b7855`, Marble `05af6444ded9c033b0a29ee6a9e842db9c2ba594`. Candidate English descriptions match the bundled pin; the feedback/self-review soft prerequisite has reversed upstream (current self-review depends on responding to feedback). The pinned graph stays unchanged. The Post–Loft connection is an original teaching bridge, not a taxonomy edge. See spec 39 for studied paths and license boundaries.

## Increment 41: the growing shelf

Built: `#living/plants` gives a four-page light investigation. Predictions, inspected days, copied table rows, supplied-question practice and support stay distinct. An exact frozen observation travels to the planting corner without changing the pretend beds or café inventory. Four explicitly invented observation days show why a longer stem alone does not establish a healthier plant; the fair-comparison task is a supplied proposed water test, with no simulated water results.

Next: Field Notebook should ask which observations answer a question, build a labelled chart and interpret it. Copying supplied rows in this release is not that chart/data-selection curriculum. Real plants, independent measurement, ecological interactions and broader growth requirements remain missing. See [spec 41](specs/41-plant-investigation.md).

## Increment 42: an observation becomes a chart

Built: `#living/notebook` revisits eight finite same-day/specimen comparisons. Select useful supplied rows, construct labelled fixed-scale bars, read the actual draft, check it against its source and answer the original question. These outcomes remain separate: a faithful chart can use irrelevant data, and an inaccurate chart can be read correctly. Blank and zero are distinct; unfinished entries, checks, help and kept drafts survive revisiting.

A chart can sit beside the planting plan without awarding ingredients or changing the beds. Model viewing carries across the notebook, growing shelf and expanded notes so a later prediction is never falsely labelled before-looking; unknown recovered viewing stays uncertain. Missing: real measurement, independently chosen scales, time-series graphs, repeated survey data, classification keys and causal growth investigation. The notebook is visible-source practice, not a claim that a whole graph topic has been learned.

## Picnic fractions: same whole, different pieces

The Sharing Counter extends the café equal-group bench through six original visual requests. Equal share count and equal size are separate: an unequal two-piece loaf is not two halves. Changing cuts preserves the whole; one half and two quarters cover the same amount. The number line collects selected amount, including separated pieces, rather than reading the spatial endpoint of the original selection. A basket then changes the whole from one loaf to twelve objects: one quarter is one complete group of three, not one bun. All checks remain pictured practice.

**Built:** repair halves/quarters, select half/three quarters, stepped same-whole equivalence, derive a 0–1 marker, reversibly distribute twelve buns, keep/revise drafts. **Planned:** measured portions in a graduated jug. **Missing:** thirds/eighths, unlike-whole comparison, independent number-line placement, physical measuring and fraction operations. These are original teaching bridges; source prerequisite edges are unchanged. [Spec 43](specs/43-sharing-counter.md).

## Rain Paths: one change, many representations

The Water Lab now invites manually tracing new rain through an invented tabletop machine. A matched comparison changes only the entrance cover or already-stored water. The learner follows one physical phase at a time, compares exact completed counts, selects useful destination columns, optionally finds a difference, then tests a frozen runoff copy through a channel or holding cup. The same quantities become a planning problem: reserve + cup + onward collector stays equal to the source. A cup can overflow.

**Built:** four finite apparatus cases, unscored predictions with recorded prior-result exposure, manual token moves, source-ledger reading, supplied changed-factor practice, relevant columns and editable copied route. **Planned:** real-world observations and broader datasets in Field Notebook. **Missing:** measured rainfall, soil infiltration rates, drainage/evaporation/plant paths, independent experimental design and real flood planning. The water-cycle node remains unmapped. Any pictured 3×4 storage or 2×4 earlier-water arrangement contributes arithmetic familiarity, not a multiplication answer. [Spec 44](specs/44-rain-paths.md).

## Measured portions: read this amount, meet that request

The Measuring Kitchen gives the café a standard-unit counterpart to the Sharing Counter. A share asks how much of a whole; a graduated jug asks how many mL are contained. Six recipe cards keep those targets visible while the child fills, reads, pours and returns. Reading 300 mL correctly remains a correct reading when the recipe requested 250 mL. A wrong unit is separate from the read number. Two matching preparation jars can still leave extra liquid in the jug; readiness is another condition.

**Built:** straight-sided 500 mL jug, ten equal 50 mL intervals, two patterned ingredient identities, reversible transfers, separate volume/unit/target checks and frozen unfinished trays. **Planned:** quantity contrasts across measured recipes and reader-revised instructions. **Missing:** physical measuring, mass, litre conversion, irregular-vessel comparison, mixing, half/double batches and usable cooking recipes. Rain tokens remain arbitrary model quantities; they are never silently relabelled mL. [Spec 45](specs/45-measuring-recipes.md).

## A source for this question, a limit for this reply

Travelers’ Archive revisits Paris through historical evidence. A photograph gives one local view; a modern chronology selects events. The same packet supports place-label matching, date ordering, visible-detail questions, source selection and a prepared reply. The reply uses dates for timing and leaves exact street depth or everyone’s feelings uncertain. A photograph’s production date is not automatically its capture moment.

**Built:** one Paris 1910 pack, full credited CC0 photo, original schematic, three ordinal events, eight finite source questions, prepared evidence/limit choices and exact local human-read writing. **Planned:** more reviewed places/periods and a separately authored French pack. **Missing:** independent archive research, a broad history sequence, geographic distances, source corroboration by independent eyewitnesses and evaluated original writing. [Spec 46](specs/46-travelers-archive-first-visit.md).

## Same results, new representations

The water-chart branch carries an actual completed Rain Paths result into the Field Notebook. A faithful chart of stored tokens can be irrelevant to a runoff question; a wrong runoff chart can still be read correctly. These contrasts give the familiar chart loop a new scientific purpose without treating arbitrary tokens as calibrated water measurements.

**Built in this increment:** four finite completed-source invitations, frozen provenance, reversible data selection and two-bar construction, distinct draft/source/model checks, exact pending text and unfinished keeps. **Missing:** independent scale design, real data collection, causal explanation assessment and water-cycle modelling. Prior viewing remains familiar practice across both games. [Spec 47](specs/47-rain-notebook-spiral.md).
