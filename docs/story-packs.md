# Adding a reviewed Paris story pack

The first pack is [puppet-post.mjs](../dist/packs/puppet-post.mjs). It supplies an original rooftop errand with three passage lengths, a sentence-evidence question, an ordering question, two smaller examples, and a partial Marble sequence connection. It joins the regular Paris rotation and has a direct invitation on the map.

The second pack is the text-only [flood almanac](../dist/packs/flood-almanac.mjs) at Lucie’s bookstall. Its [reviewed prose](library-flood-almanac-content.md) and [historical-source audit](source-audits/library-flood-almanac.md) support one detail question and a reread-for-dates ordering question in three optional lengths. It uses the [English Paris whole-visit source](specs/73-paris-saved-visit-source.md) so a paused passage and its helpers keep their original words after a later catalog edit. The source line in each passage distinguishes real Paris records from the imagined town.

To add another pack using the supported formats:

1. Add a generic plain-data module under `dist/packs/`, following the first pack's shape. Export the pack object; do not add learner data or executable behavior. Give it new stable pack, story, and helper IDs. Keep released IDs and their meaning stable so paused visits remain valid.
2. Import it and add it to `parisPacks` in `dist/packs/index.mjs`. Existing engine and UI code do not need edits for another two-question story using these formats.
3. Run `node scripts/check-story-packs.mjs` and the tests listed in README. Read every passage, choice, correct order, hint, explanation, and helper independently before publishing. Validation checks structure and references; it cannot establish that an answer is educationally sound or unambiguous.
4. Browser-check the new invitation, all passage lengths, both questions, support, pause/reload, ending, and notes before publishing the reviewed source through the existing workflow.

The trusted module is a repository source file. There is no arbitrary pack upload, external fetch, automatic author, or scheduler. Installed packs are compiled together; any invalid pack throws with a field location before the catalogs are returned. The validation command is read-only and does not publish. Only this small two-question Paris shape is supported today.

`type:'mc'` uses text choices and an integer answer index. `type:'order'` uses exactly three unique `items` written in their correct story order; omit `answer`. This follows Jane's authoring convention. The compiler supplies a stable shuffled display order, chosen per task and never already in story order, and internal permutation choices. The child taps cards into empty positions, can remove or clear them, and explicitly submits a complete order. Editing alone is not an attempt. After a correct submission, the chosen answer is locked like an existing choice task.

Both questions retain the complete passage. The second is rereading practice. Read-aloud, sentence focus, hints, explanations, smaller examples, reported reading, and method choices remain separate observations. No packed task produces fresh assessment evidence, decoding/fluency measurements, or mastery labels. Exported numeric ordering attempts map to readable arrangement strings in the observation's `choices`; they are not scores.

Optional `connections` identify a portion of a Marble topic. Verify the actual topic and its evidence first, and state what the question leaves unobserved. The puppet pack connects only to ordering explicit events in `mt_VEwM7ClYYE`; it does not assess central message or retelling. A narrative sentence-evidence question is not a match for Marble's nonfiction argument-evidence topic.

Jane's small unique-string validation helper was adapted from the MIT-licensed publisher; the original pack prose and examples were not copied. See [NOTICE](../NOTICE), [Jane's distributed license](../dist/jane-license.txt), and [the implementation spec](specs/12-reviewed-story-packs.md) for provenance and scope.
