# After the Storm: science and language roadmap

This is the delivery roadmap for the next six increments. It is a plan for this small, parent-guided app, not a complete curriculum or a promise of measured learning gains. Each step has a bounded specification and will receive independent review before implementation. Delivery order does not lock a child's access: every built destination remains open. Existing math, stories, companions, and the replayable café remain available.

## Teaching direction

Check [Jane and Marble opportunities](upstream-opportunities.md) before building each learning capability. The first reviewed story pack and tap-to-order response format are implemented, using Jane's pack/publisher conventions and a small validation adaptation. The document distinguishes current reuse from proposed extensions and records upstream revisions.

Begin with a purpose worth exploring, build an idea through a controllable visual explanation, invite a change or prediction, and offer a new situation with less support. Children can pause, replay, skip familiar steps, choose another representation, or explore with a grown-up. No timer, grades, streaks, placement claim, or compulsory sequence. Animations explain a change and stay under the learner's control; reduced-motion and keyboard/touch alternatives work throughout.

Keep reading, comprehension, composition, investigation, support, familiarity, and unobserved skills distinct. A prediction is an idea to test, not a scored fact. Clicking an external link does not establish that an experiment was used. Selecting an observation reports what someone noticed; it is not proof of scientific understanding. Word chunks and response choices can support expression without demonstrating independent free writing. Off-screen projects remain invitations.

## Current addition

[Café expeditions and the multiplication garden](specs/07-cafe-expeditions-and-facts.md) is implemented, inserted before the Post Office in response to play feedback. It adds one Cloud Orchard, three new foods, contextual repair questions, original visual food and order representations, optional local speech, and full ordered multiplication coverage through12×12. The six-step science/language roadmap below remains planned as stated.

[Gather the cupboard](specs/08-gather-the-cupboard.md) replaces instant refills with repeatable pictured searches and harvests for every known ingredient. Actual supplies are required before serving.

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

## Number Garden refresh

A review of the Number Garden destination on 2026-10-18 found pictures that contradict their questions, too few fresh examples for children who play often, help that is easy to miss, and one shared record for every child on a device. These steps can be interleaved with the sequence above; none changes another destination's content.

| Step | Purpose | Smallest useful release | Status |
| --- | --- | --- | --- |
| A | [Picture and text corrections](specs/15-number-garden-corrections.md) | Matched examples, labeled "Pip's example", no answer in check-in readouts, copy fixes | Implemented |
| B | [Explorer profiles and progress safety](specs/16-explorer-profiles-and-progress-safety.md) | Separate records per child without names; failed restores keep the saved value | Implemented |
| C | [Question variants](specs/17-number-garden-variants.md) | Seeded templates for all 49 items; first encounter unchanged | Implemented |
| D | [Helpers and targeted feedback](specs/18-number-garden-help-and-feedback.md) | Responsive-help helpers, partial steps, and misconception responses for every item | Implemented |
| E | [Interaction and wording](specs/19-number-garden-interaction-and-wording.md) | Visible help, question-first phone layout, tap-on-model, fold and compass, child wording | Implemented |
| F | [Read-aloud and art](specs/20-number-garden-voice-and-art.md) | Local speech with math-aware text, illustrated Pip and Dot, area scenes, story objects | Implemented |
| G | [Regrowing the garden](specs/21-regrowing-the-garden.md) | Participation replants the storm garden; unscored open number tasks | Implemented |

Delivered together after independent spec review and implementation review. Original suggested order: A and B first (A fixes content that teaches the wrong thing; B protects progress already saved on family devices), then C and D, then E to G. B applies to every destination because all records share one saved value. G depends on B and F.

## Scope shared by all steps

Use the existing static app and public origin. Preserve prior records and the original shared storage value during explorer migration. Browser-local drafts, optional persistence, export, reset, and the chosen guide/explorer apply to every addition. New records stay distinct from original math assessment records. No child-specific source, family stories, identifying fields, uploads, analytics, server learner records, live AI, or background generation. Public examples and tests are fictional or synthetic. Authored content is reviewed before release. Use Marble topic IDs for selected learning connections when a genuine content match is established; do not copy its age labels into a placement system.

Marble's taxonomy is openly licensed data with attribution obligations. Its Water Lab and Ecosystem Simulator are separate external applications; no source-reuse license was found during the current review. Link out explicitly, do not embed or copy their code/assets, and do not transmit garden records. External sites have their own availability and data handling. Local explanation pictures remain original, labeled illustrations, never claimed as observations from another site.

## Release procedure

Each spec is independently reviewed; resolve concrete findings before building that step. Implement only the selected increment. Check its learning content, state transitions, migration, save-off/export/reset, touch/keyboard interaction, and responsive layout. Independent implementation review and root browser QA precede publishing the reviewed static files through the existing Sites workflow. Keep the GitHub PR draft and unmerged until exact-candidate Claude clearance and a separately authorized merge. Future content details, external controls, and scientific models must be refreshed before those steps are built.

## Sources informing the direction

- [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy): learning connections and topic scope; not an assessment instrument.
- [IES foundational reading](https://ies.ed.gov/ncee/wwc/PracticeGuide/21), [reading comprehension](https://ies.ed.gov/ncee/wwc/PracticeGuide/14), and [elementary writing](https://ies.ed.gov/ncee/wwc/PracticeGuide/17): explicit teaching targets and the distinction between word reading, meaning, and composition.
- [NGSS elementary engineering investigations](https://www.nextgenscience.org/pe/3-5-ets1-3-engineering-design): fair comparisons, repeated trials, evidence, and design revision.

Implemented: [Orchard map hunts](specs/09-orchard-map-hunts.md) give new gathering trips arithmetic location clues, persistent covered-plot inspections, counter help, and the existing equal-basket harvest. Older trips keep their original search.

Implemented: [The Paris Postcard](specs/10-paris-reading-visit.md) adds six English connected-text reading targets, sentence focus and optional local narration, smaller text examples, rereading/evidence practice, and an unscored postcard/retelling invitation. This is guided practice, not a reading-level assessment.

Implemented: [Paris exploration](specs/11-paris-exploration.md) adds three destinations, six original story errands at three passage lengths, local practice suggestions, open manual choices, and persistent short-errand routes. All content is authored; familiar stories are offered as rereading.

Implemented: [Reviewed story packs](specs/12-reviewed-story-packs.md) adds a rooftop puppet-show pack, tap-to-place ordering, validation before publication, scoped Marble sequencing connections, and retained Jane MIT attribution. [Authoring guide](story-packs.md).

Implemented: [French Paris and plate return](specs/13-french-paris-and-plate-return.md) adds three short French errands with English meaning help and local French narration, separate practice records, and a return to the café plate from multiplication without restarting. That initial release is extended by French exploration below.

Implemented: [French exploration](specs/14-french-exploration.md) adds nine original stories with three authored text choices, conservative French-only practice suggestions, manual story selection, and persistent routes. The initial three French errands remain available. More language content can extend the reviewed library; there is no live story generator or French proficiency assessment.

Implemented: [Café welcome-back dinner and New Game Plus](specs/22-cafe-welcome-supper.md). Six served tables light the café for neighbors returning after the storm; a visible ending offers ongoing service or another six-table gathering without resetting the game. This draws on the participation/world-regrowth direction proposed in [PR #2](https://github.com/anotherpanacea-eng/learning-garden/pull/2). Its Number Garden refresh specs remain proposed; picture/question corrections and saved-progress protection are the first priorities for their own review.
