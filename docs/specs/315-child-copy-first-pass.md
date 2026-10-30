# 315 · Clear actions, quieter record notes

Proposed 2026-10-30. First bounded delivery of lane A in [PR262](https://github.com/anotherpanacea-eng/learning-garden/pull/262). This is copy/authoring support, not a new game, level, curriculum evaluator or general JavaScript parser. French placement is deferred behind the newly adopted lanes; no French runtime work has begun.

## Observed problem and scope

Current Parcel Labels says “The base and pieces were supplied: this is supported spelling practice” beside the child’s last check; its failure message talks about an “exportable notebook.” Linear adds “These are supported practice responses” to number-entry syntax, describes selection evidence in the chooser, and says a fitting answer “does not set a level.” These are useful record explanations for grown-ups, but they compete with the action a learner needs now.

Deliver one author-facing [child-copy glossary](../child-copy-glossary.md), one small source checker, and a copy pass on **Parcel Labels and Linear only**. Record PR261’s actual delivery and narrow plural foothold in the strand/course maps. `docs/roadmap.md` is still held by PR262’s author under issue1248; do not edit that path until its reservation is released. The existing roadmap already names this lane. No release requires silently taking someone else’s grant.

## Glossary contract

Name the app After the Storm, the town Willowbank, and the destinations by their actual UI labels. Document the current actions: Check, Keep, Another…, Hint/Different example, English meaning and Grown-up notes. Explain what each action actually does, especially that Keep is a notebook version and device persistence depends on the saving setting/result. Prefer a concrete object/action in new copy; don't introduce a universal renaming pass.

Use US spelling for original English UI (color, center, practice, math). Preserve French/Spanish, proper names, exact source quotations, exact original writing, frozen teaching and saved historical feedback. Do not simplify the intellectual task by an age guess. Terms such as model, evidence, rate, inference and source can be legitimate taught concepts; explain them when needed rather than banning them. Recordkeeping vocabulary belongs in a labelled grown-up panel. Scientific limitations belong with the child’s model: invented data, restricted domains/axes, units and model-versus-real-observation distinctions must remain visible.

## Exact pilot copy decisions

Parcel Labels:
- Remove the record-classification sentence from the ordinary check response. Add a **Grown-up practice notes** native disclosure below the working/check area with the same qualification: base/pieces are supplied, help/corrections remain supported, and no independent decoding/writing/transfer is established. Keep the original feedback, spelling explanations, real-word discoveries and first/latest draft labels unchanged.
- Replace the visible snapshot count with “1 check kept with this version” / “{n} checks kept with this version.” Keep its count and data identical. Support is explained in the grown-up panel and Notes, not removed from records.
- Replace “This change could not be kept in an exportable notebook. Your earlier work is unchanged.” with “We couldn't keep this change. Your earlier work is still here.” This is candidate refusal, not a claim of successful device storage. Do not change the distinct actual persistence-failure/saving-off messages, cap/collision/counter explanations or restoring/refused-text behavior in this slice.
- The existing `parcelLabelsNotes` remains adult-facing and may keep its technical qualifiers. No stored source/check/own-message text is rewritten.

Linear:
- Keep the precise number syntax and examples; remove only “These are supported practice responses.” from the ordinary input instruction.
- In the chooser, use “Choose any question type. Quantities can rise, stay steady, or fall. Older visits keep their original rules, and familiar cases can return.” Move the existing suggestion reason and the first-response/support explanation into **Grown-up practice notes**. The selected default, manual choices and suggestion calculation are unchanged.
- Move “A fitting answer describes this supplied task; it does not set a level” and the visited-pages record qualification into that adult disclosure. The child can still see which pages have been visited; do not remove the page navigation or make completion claims.
- In `linearRefusal`, replace the exportability wording with “We couldn't open this page and keep your work safe. Your earlier work is still here.” Notes and other subjects remain available.
- Keep every source teaching paragraph, task prompt, table/graph, numerical feedback, unit/domain/axis/model limitation and original/reference-context distinction. Existing Notes remain adult-facing. This pass neither modifies the generator/core nor changes first/latest work.

Both new adult disclosures are native, initially closed and contain explanatory text only. Toggling them must preserve actual working input DOM, pending refused words and all notebook/storage values, with no save, exposure, response or render. They add no learner setting or saved field; a controller redraw/reload may return them to closed. Existing outer chooser preservation remains unchanged. Keep the main work and Check visible in the already qualified tablet viewports. Summaries get44px targets and clear focus using existing styling; no new global layout or new stylesheet.

## Small, honest source checker

Add `scripts/check-child-copy.mjs`. It is a read-only, deterministic lexical review aid for the **two named renderer files**, not proof about every rendered string or the whole app. Export the scanner for unit checks and run it as a CLI. Flag whole-word/phrase occurrences, case-insensitively, of supplied, provenance, recorded as support, supported practice, supported spelling practice and exportable. Do not flag supplies, a supported bridge, ordinary help labels, or identifiers containing the letters as a substring. Ignore comment-only lines.

An in-code scope table names each renderer and the exact boundaries of its adult Notes reader and new Grown-up helper. Require each boundary marker exactly once and in the correct order; missing/ambiguous markers fail the check with an explanation rather than silently skipping a file. Excluded blocks are explicitly human-classified adult copy, not mechanically proven adult-only at runtime. Do not invent a generic AST/string parser, hash baseline, registry, external dependency or per-string manifest.

Provide an exact-quotation allowlist with a reason for deliberate source/fiction/taught-term exceptions. No current exception is required if the pilot is clean. An exception must match exactly one bounded source fragment; missing or duplicate exceptions fail with an update-needed diagnostic. It must not become a blanket path/token exemption. Test an intentional fiction quote and a second unallowed occurrence of the same term outside it. Markers/allowlist classification still need human review.

Default CLI checks the actual two files, prints path/line/excerpt for unallowed candidates and exits nonzero when there are candidates or invalid configuration. Offer concise JSON output for tools without writing a report file. It is a spelling/jargon lint in a bounded source region, not an automated child-reading judgement. It does not evaluate interpolated data, user prose, old frozen sources, translations, every DOM state or all helpers in other modules. State those limits in its output/docs. A clean run must never be described as “the whole app contains no jargon.”

`test/child-copy-checks.mjs` exercises matching boundaries, case/word boundaries, comment-only lines, adult-block exclusion, malformed configuration, exact quotation exceptions and an unallowed duplicate elsewhere, plus a real CLI/scoped-source run. Existing source-suite discovery includes the new check without runner changes. Test the concrete failure modes, not a copy of the implementation's regex.

## Map update and non-goals

In `strand-map.md` and `course-routes.md`, link PR261’s receipt and identify the built twelve-noun, count1–5 supplied plural-construction opportunity and optional human-read message. Keep the systematic decoding/phonics, fluency, transcription and broad spelling progression gaps. Also correct the detailed French map’s stale blanket “purposeful message missing”: Rooms221/226 already have bounded human-read original/revised messages. Broader correspondence/oral interaction remains missing. No bulk “covered” topic/CSV/atlas update, new source edge or unverified curriculum percentage.

No new learning content, theme, route, state schema, score, placement, audio, recording or film. PR254’s whole-film hold continues. This UI/authoring repair uses the existing Jane/Marble boundaries; it copies no new upstream material. The lane-A glossary is a guide for current/future authors, not retroactive permission to alter exact historical sources or stored learner records.

## Review, acceptance and release

Six independent spec lenses before implementation. Independent exact-head Claude implementation review after the folds. Author source checks and native evidence remain separate from reviewer reading.

Source: scoped checker reports zero unallowed candidates; fixtures expose each stated failure mode; pure render/Notes calls retain fresh/known/partial/unsupported/additive roots exactly; map links resolve. Confirm runtime edits are confined to the two UI renderers and no generator/evaluator/core/store changed.

Native isolated synthetic Chrome320×600,820×1000,1024×768: existing active question/model and controls visible as before; adult disclosures contain the qualifiers yet those qualifiers do not interrupt ordinary visible instructions; mouse/touch/keyboard summaries;44px targets/no overflow; exact actual input-element identity and zero writes on disclosure toggles, including refused text; existing lesson/parcel source, first/latest writing, checks/support and actual Notes transfer unchanged. Extend existing Parcel/Linear focus journeys only for these new behaviors and adjusted copy; preserve all their substantive assertions. A150%root-font stand-in is distinct from physical text zoom. Physical iPad/Safari/VoiceOver and learning effectiveness remain unqualified.

After proportionate affected/source regressions and exact-head clearance: PR, merge commit, reviewed/merged runtime equality, canonical deployment, matching static assets and hosted affected replay, with receipt. Keep future text-review areas and lane-B/C work planned rather than claiming a whole-app sweep.
