# French Paris: more places to read

## Outcome

Expand `#french` with nine original story errands across the bookstall, river, and rooftops. Stories involve small mysteries, practical choices, art, and helping others; simple French need not imply nursery subject matter. Each has three authored language/text variants and two questions. Start with short sentences; all variants and stories remain manually available. Retain the original three French errands, all IDs, and paused visits.

## Bounded design

Reuse the English Paris pattern of a frozen three-stop visit (two questions and an unscored postcard), implemented as a separate French catalog/selector and `visit.french` metadata. Reuse the existing story renderer, French voice selection, sentence focus, smaller examples, tap-to-order interaction, save/export/reset and support records. Do not merge English/French evidence or introduce learner accounts. The browser notebook stays shared.

New French visits use entrance `french`, immutable story ID, destination, variant (1/2/3), reason, route and prior-story exposure. Validate the exact authored route and metadata during restore; invalid visits/associated observations cannot inform suggestions. Preserve legacy French regular entrances untouched. Record French story/destination/variant/selection reason in observations, derived and checked against the frozen visit and authored node. Unknown exposure never counts as new.

The existing English detector treats any own `route` as exploration. Visit and observation restoration must therefore dispatch to the French validator when French metadata is present, before the English validation path. Stray routes on legacy visits remain invalid. French inherited `meaningUsed` is explicit support for suggestions as well as for recorded answers.

The next story at a place favors fewer displayed encounters (not mere generated plans); manually chosen stories are supported. A task's second question is rereading. Other variants of a familiar story cannot manufacture a new-story result. Choosing another story preserves the unfinished visit and asks which visit to continue using the existing visit-choice pattern. Landing page exposes unfinished visits and manual story choices.

## Practice suggestions

Use only validated new French exploration visits and their recorded task observations, across the three French destinations. Begin at variant 1. Examine up to the latest eight answered observations; skips and unobserved reading do not lower suggestions. Use the latest observed variant as the starting point. A recent retry or recorded support (translation, hints/explanation, smaller example, listening, sentence focus, together reading/method, uncertain support) suggests one smaller step, bounded at 1. Both questions of the latest visit share a support barrier, so a later answer cannot erase its help.

After that support barrier, two first-try correct first questions on different previously unseen stories, at the same variant, reported independently read without recorded support, can suggest one larger step, bounded at 3. Other variants, rereading, duplicate observations, unsupported provenance, and the second question never qualify. Keep the current amount when evidence is sparse. These are invitations about French practice, not age bands, grade levels, CEFR estimates, decoding/fluency measures, or mastery. Parent-facing copy explains each reason; manual choices stay open. English and legacy French work do not change these suggestions.

## Content and support

Three variants have progressively more connected French, not merely extra unrelated sentences: short direct sentences; more context and connectors; a short paragraph with a reason/inference. The two questions remain answerable in every version, with no translated English prefix tasks. Include detail, context meaning, simple reasons/evidence, and explicitly ordered actions. Use multiple choice and at least one tap-to-order question; no keyboard typing or timed response is required. Full passage stays visible. English meaning/glosses are authored per variant and opening them supports both questions of that passage. Smaller examples match the task's skill and remain distinct from its answer. Existing local French audio remains optional and never falls back to English.

## Reuse and delivery

Refreshed Jane `LESSONS.md` and Marble `data/topics.json` on 2026-10-18. Study Jane's short quests, ordered responses and glossary/support conventions; reuse our existing Jane-attributed validator/order renderer where applicable. Reuse the existing English Paris planning structure rather than adding a second platform. These design references add no copied upstream prose/data and no French taxonomy/mastery mapping. Retain licenses and no learner-data transfer.

Independent spec review, then build and independent content/implementation review. Focus tests on suggestion changes, source isolation, support barrier, familiarity across variants, stable planning, route/record tampering, ordering, reload and preservation of legacy visits. Run relevant existing suites. Browser-test complete play, visible support, new-story selection, manual variant/story choice, pause/reload, narrow/tablet layouts, and older French/English continuation. Update existing draft PR and publish to current public Site after resolving review findings; do not merge the PR.

## Review and verification

Independent spec review required French-first validation dispatch and explicit inherited-translation support; both are implemented. Independent content review cleared all 27 passages and the stable answers/ordering at every variant. Independent implementation review cleared the selector, restore/observation provenance, support barriers, manual-choice wiring, and legacy separation. A final browser check also corrected the general French Continue action to resume the waiting errand. Synthetic checks and phone/tablet play cover progress suggestions in both directions, partial ordering reload, exact manual selection, multiple unfinished visits, and original French/English continuation.
