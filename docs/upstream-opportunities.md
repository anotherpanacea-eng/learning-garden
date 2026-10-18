# Building with Jane and Marble

Checked 2026-10-18. These are implementation opportunities, not completed integrations or a new mandatory build sequence. Refresh the relevant upstream files before adopting a component.

## Current reuse

The app already bundles a pinned Marble math-map subset and its prerequisite relationships, with attribution in the app, README, and NOTICE. Water Lab missions link to Marble's external application. The Ecosystem expedition remains planned. The Paris stories, route selector, and reading-support controls are original. The new puppet-post pack has a partial connection to Marble’s story-sequence topic, with central message and full retelling left unobserved.

Jane now contributes a small MIT-licensed string-list validation adaptation to the story-pack compiler, with its full notice distributed in `dist/jane-license.txt`. Its reviewed-pack and ordered-items authoring conventions informed the first pack. No Jane lesson text or glossary has been incorporated. See [story packs](story-packs.md) and [spec 12](specs/12-reviewed-story-packs.md). Other opportunities below remain proposals.

## Useful overlaps

| Opportunity | Upstream starting point | Small useful extension here |
| --- | --- | --- |
| More stories without editing the engine | Jane's [lesson format](https://github.com/kentlangley/Jane/blob/0d40eb8ee86f88a63a17391e361bdd8d9c9014e4/LESSONS.md), [example quest](https://github.com/kentlangley/Jane/blob/0d40eb8ee86f88a63a17391e361bdd8d9c9014e4/packs/examples/example-quest.json), and [publisher](https://github.com/kentlangley/Jane/blob/0d40eb8ee86f88a63a17391e361bdd8d9c9014e4/publish-lessons.mjs) | First candidate: one additional generic Paris story pack, authored and reviewed before play. Compare its data shape with our catalog and adapt only the required fields. Validate keys, passage references, routes, and helper coverage before release. Keep existing saved story IDs stable. |
| More ways to respond | Jane's lesson formats include ordering, matching, picture choice, number lines, and fraction bars | Begin with tap-to-order sentence cards for a Paris sequence question, with keyboard controls. Retain the passage and record assistance. Reuse suitable rendering/validation code after checking its dependencies. |
| Vocabulary while exploring | Jane's glossary and term-lookup workflow in LESSONS.md | Tap a word for a short definition, then meet it in another story. A lookup is support, not a correct answer. A definition that supplies the answer must prevent an independent first-try claim. |
| Return to useful ideas over time | Jane's [engine](https://github.com/kentlangley/Jane/blob/0d40eb8ee86f88a63a17391e361bdd8d9c9014e4/src/engine.js) and [authoring cycle](https://github.com/kentlangley/Jane/blob/0d40eb8ee86f88a63a17391e361bdd8d9c9014e4/docs/NIGHTLY.md) | Compare its review selection with a small browser-local invitation to revisit a skill using a different passage. Keep rereading separate from transfer to unfamiliar text. Dates can suggest a return without deadlines, streaks, or locked destinations. |
| Reading/science learning connections | Marble's [topics](https://github.com/withmarbleapp/os-taxonomy/blob/96a7933754af672e1bfdbf7ecb05c325860c6e0d/data/topics.json) and [dependencies](https://github.com/withmarbleapp/os-taxonomy/blob/96a7933754af672e1bfdbf7ecb05c325860c6e0d/data/dependencies.json) | Extend the existing math-map approach to authored reading and science targets. Check descriptions, evidence, and actual edges before mapping. Offer adjacent ideas across destinations; a prerequisite link is a suggestion, not evidence that the child has mastered either topic. |

Candidate English topics found in the pinned Marble data include `mt_HrgDjxcWvf` (Prefixes and suffixes), `mt_lp3qyEujIv` (Inference vs Explicit Meaning), `mt_S3XMQOYt_D` (Supporting ideas with evidence), and `mt_VEwM7ClYYE` (Story Sequence and Central Message). These are candidates for closer matching, not implemented mappings or claims that our short questions cover their full evidence criteria.

## A practical next increment

The first story-pack extension is implemented: Jane's example/publisher informed one reviewed rooftop errand with ordering cards, added without resetting existing visits. This directly addresses the finite six-story library. A later authoring workflow could use a parent-selected private summary, but today's app has no automated export to an assistant, scheduled authoring, or learner-data upload. The user has not requested such a schedule or transfer.

## Source and license boundaries

Jane reviewed revision: `0d40eb8ee86f88a63a17391e361bdd8d9c9014e4`. Its [license map](https://github.com/kentlangley/Jane/blob/0d40eb8ee86f88a63a17391e361bdd8d9c9014e4/LICENSING.md) identifies application code as MIT, docs/lesson packs as CC BY-SA 4.0, and taxonomy-derived data/text under their respective ODbL/CC BY-SA licenses. Use the actual path's license and preserve notices when incorporating material. The adapted publisher helper retains its MIT notice in the source and deployed assets; other upstream documents remain references.

Marble reviewed revision: `96a7933754af672e1bfdbf7ecb05c325860c6e0d`, the same revision already used by this app. Marble Skill Taxonomy (v1) · © Generative Spark, Inc. (Marble) · https://withmarble.com · licensed under ODbL 1.0 (database) and CC BY-SA 4.0 (content). See [NOTICE](../NOTICE). The open taxonomy does not establish a source-reuse license for separate hosted experiments; retain explicit links to Water Lab/Ecosystem unless their code and license are independently available.

French Paris (spec 13) refreshes Jane’s `LESSONS.md` short-quest/glossary conventions and Marble’s topic data on 2026-10-18. It reuses our existing story engine and Paris setting with original French content and bilingual support. These upstream files are design references; no additional upstream code or prose is incorporated. French practice is separate from English curriculum suggestions and makes no French proficiency mapping.

French exploration (spec 14) reuses the existing English Paris frozen-route/selection design and Jane-informed tap-to-order renderer, with separate French evidence and original authored stories. Jane `LESSONS.md` and Marble `data/topics.json` were refreshed on 2026-10-18. No additional upstream code, lesson prose, or taxonomy text is copied. Mature situations use accessible French; language load and age are not equated.
