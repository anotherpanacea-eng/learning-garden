# After the Storm: science and language roadmap

This is the delivery roadmap for the next six increments. It is a plan for this small, parent-guided app, not a complete curriculum or a promise of measured learning gains. Each step has a bounded specification and will receive independent review before implementation. Delivery order does not lock a child's access: every built destination remains open. Existing math, stories, companions, and the replayable café remain available.

## Teaching direction

Begin with a purpose worth exploring, build an idea through a controllable visual explanation, invite a change or prediction, and offer a new situation with less support. Children can pause, replay, skip familiar steps, choose another representation, or explore with a grown-up. No timer, grades, streaks, placement claim, or compulsory sequence. Animations explain a change and stay under the learner's control; reduced-motion and keyboard/touch alternatives work throughout.

Keep reading, comprehension, composition, investigation, support, familiarity, and unobserved skills distinct. A prediction is an idea to test, not a scored fact. Clicking an external link does not establish that an experiment was used. Selecting an observation reports what someone noticed; it is not proof of scientific understanding. Word chunks and response choices can support expression without demonstrating independent free writing. Off-screen projects remain invitations.

## Delivery sequence

| Step | Place and purpose | Smallest useful release | Status |
| --- | --- | --- | --- |
| 1 | [Water Lab expeditions](specs/01-water-expeditions.md): predict, explore, return and explain | Three short missions; an external Marble destination; original controllable explanation pictures; private notebook | Implemented in this increment |
| 2 | [Willow Post Office](specs/02-willow-post-office.md): read and write for a recipient | Six deliveries and a word-chunk instruction builder with visible consequences and several valid messages | Planned |
| 3 | [Storm Workshop](specs/03-storm-workshop.md): choose a fair comparison and investigate | One original cart/ramp experiment family; repeatable trials and a comparison notebook | Planned |
| 4 | [Word Workshop](specs/04-word-workshop.md): sound, spelling and meaning work together | A small reviewed sequence of word families, pronunciation support, and meaningful messages | Planned |
| 5 | [Ecosystem expeditions](specs/05-ecosystem-expeditions.md): explore interacting causes | Three guided visits to Marble's simulator, with predictions, repeat comparisons, and careful model conclusions | Planned |
| 6 | [Story Loft](specs/06-story-loft.md): stories, viewpoints and expression | Six original short stories, linked perspectives, evidence-based interpretations, retelling and composition | Planned |

Step 2 can be built independently of step 1. Step 3 introduces tools useful for step 5; these are implementation dependencies, not learner prerequisites. Step 4 needs reviewed pronunciation/content before release. Step 6 can reuse Post Office composition controls where useful, without turning open interpretation into one-answer grading.

## Scope shared by all steps

Use the existing static app and public origin. Preserve storage keys and all prior records. Browser-local drafts, optional persistence, export, reset, and the chosen guide/explorer apply to every addition. New records stay distinct from original math assessment records. No child-specific source, family stories, identifying fields, uploads, analytics, server learner records, live AI, or background generation. Public examples and tests are fictional or synthetic. Authored content is reviewed before release. Use Marble topic IDs for selected learning connections when a genuine content match is established; do not copy its age labels into a placement system.

Marble's taxonomy is openly licensed data with attribution obligations. Its Water Lab and Ecosystem Simulator are separate external applications; no source-reuse license was found during the current review. Link out explicitly, do not embed or copy their code/assets, and do not transmit garden records. External sites have their own availability and data handling. Local explanation pictures remain original, labelled illustrations, never claimed as observations from another site.

## Release procedure

Each spec is independently reviewed; resolve concrete findings before building that step. Implement only the selected increment. Check its learning content, state transitions, migration, save-off/export/reset, touch/keyboard interaction, and responsive layout. Independent implementation review and root browser QA precede publishing the reviewed static files through the existing Sites workflow. Keep the GitHub PR draft and unmerged until exact-candidate Claude clearance and a separately authorized merge. Future content details, external controls, and scientific models must be refreshed before those steps are built.

## Sources informing the direction

- [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy): learning connections and topic scope; not an assessment instrument.
- [IES foundational reading](https://ies.ed.gov/ncee/wwc/PracticeGuide/21), [reading comprehension](https://ies.ed.gov/ncee/wwc/PracticeGuide/14), and [elementary writing](https://ies.ed.gov/ncee/wwc/PracticeGuide/17): explicit teaching targets and the distinction between word reading, meaning, and composition.
- [NGSS elementary engineering investigations](https://www.nextgenscience.org/pe/3-5-ets1-3-engineering-design): fair comparisons, repeated trials, evidence, and design revision.
