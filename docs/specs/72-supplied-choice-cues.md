# Supplied choices: reduce position and tone cues

Status: **implemented and independently reviewed as repairs to PR49 and PR58; release composition remains separate**. See [review72](../reviews/72-supplied-choice-spec-review.md). [Source audit72](../source-audits/72-supplied-choice-cues.md) records the fresh six-file check, exact PR59 proposal and actual frozen-source boundaries. This is a bounded content repair, authored on the Repeat Deliveries parent and backported to the two original activity PRs. It adds no new learning capability or standing AGENTS change. See [implementation verification](../reviews/72-supplied-choice-implementation-review.md).

## Problem and bounded repair

All three Help Moss supplied-card answers and all four Source Trail fitting answers currently occupy the first position. Moss’s fitting cards are uniquely longest; Source Trail’s reply also pairs the long qualified answer with short overclaims. Repeated position and phrasing can supply a shortcut that does not require using the model/source facts. We do not claim that any learner used that shortcut, or that revised alternatives prove reasoning or improve learning.

Change only the current authored choices/feedback used by **new explicit Starts** in `dist/fair-test-apprentice-content.mjs` and `dist/source-trail-content.mjs`. Keep seven current case/question IDs, goals, prompts, model/source facts, cards/photograph/rights, routing, controls and assessment semantics. No new shell, random shuffle, balancing service, validation framework, taxonomy mapping/pin, image, research claim or AGENTS edit. Use stable authored order; render/resume must not reorder an old packet.

[PR59](https://github.com/anotherpanacea-eng/learning-garden/pull/59), inspected at `b89afb1fbc3f092ca87f8439008dd804a56a7c17`, proposes varying fitting positions and avoiding a uniquely cautious correct tone. That original proposal was a design reference during specification. PR59 subsequently merged with evidence-specific caution and stable saved-order qualifications; the finite pack below remains this repair’s content contract. The implementation rule is this finite reviewed pack. Match reading load reasonably; do not pad every option to an exact word count or turn a nuanced statement into an absolute merely to look wrong. A true but incomplete practical answer remains incomplete, not falsely described as factually untrue. Waiting for more evidence is not generally wrong; the cautious distractors below fail because these particular supplied observations or declared links already support a bounded statement.

## Complete Help Moss content

The tables define exact new card order, text, fit and response. Each new source still has exactly four cards, one fitting. An omitted current card ID is removed only from future authored packets; all older source-local IDs remain admissible. No unsure card is added to Moss; existing clear/blank behavior remains unchanged.

Original contexts remain exact:

- **height:** low/smooth A12,13,12 versus high/rough B14,15,14; preserve the observation that B went farther and reject height-only causation. Question/claim unchanged. Smooth/smooth or rough/rough repairs remain accepted.
- **surface:** low/rough A5,6,5 versus high/smooth B26,25,26; preserve the observation and reject surface-only causation. Same low/middle/high height on both sides remains accepted.
- **careful:** low/smooth A12,13,12 versus high/smooth B26,25,26; the existing limited message can remain as it is. Unchanged smooth/smooth and rough/rough comparisons remain useful; never force a needless repair.

Same cart, release without a push, ramp-foot origin, model cm and all six frozen setup/trial rows remain unchanged. These are authored model examples, not new physical measurements.

### Moss `height` — Taller ramp, or something else?

| Position / ID | Exact supplied text | Fit | Exact feedback |
| --- | --- | --- | --- |
| 1 · `height-incomplete` | B travelled farther in the shown trials. Tell the crew that observation, without addressing Moss’s explanation of what caused the difference. | does not address the need | Moss: That preserves the observation, but I still need help with my height-only explanation. |
| 2 · `height-useful` | B went farther in these trials. Height and surface both changed; compare low and high ramps on the same surface. | fits | Moss: We can retain the distance observation and repair the comparison before isolating height. |
| 3 · `height-discard` | Keep the distances in our notes, but leave them out of the crew’s message until height’s effect has been isolated. | does not address the need | Moss: We can report the shown distance difference now, while explaining that this comparison does not isolate height. |
| 4 · `height-overclaim` | B travelled farther each time, so tell the crew that raising the ramp caused the difference, even with the changed surface. | does not address the need | Moss: Height and surface changed together. These results do not identify height as the sole cause. |

### Moss `surface` — Which surface helped?

| Position / ID | Exact supplied text | Fit | Exact feedback |
| --- | --- | --- | --- |
| 1 · `surface-overclaim` | Tell the crew the smooth surface caused the extra distance; the high smooth setup went farther in every shown trial. | does not address the need | Moss: Height changed too, so this comparison does not isolate surface. |
| 2 · `surface-incomplete` | Choose A for the porch because its shown stopping distances are shorter; that gives the crew a practical recommendation to use. | does not address the need | Moss: That addresses the porch’s purpose, but does not explain whether surface caused the difference. |
| 3 · `surface-discard` | Since these are model trials, wait for real measurements before saying anything about the shown distances from A and B. | does not address the need | Moss: We can compare these authored model distances without claiming they are physical measurements. |
| 4 · `surface-useful` | B went farther in these trials, but height changed too. Compare rough and smooth at the same height. | fits | Moss: That retains the observation and proposes a comparison that isolates surface within this model. |

### Moss `careful` — A careful message worth keeping

| Position / ID | Exact supplied text | Fit | Exact feedback |
| --- | --- | --- | --- |
| 1 · `careful-cautious` | Hold back this message until more trials are shown; the present results are too limited to describe any distance difference. | does not address the need | Moss: More trials could extend the investigation, but the present message already limits itself to the shown examples. |
| 2 · `careful-overclaim` | Keep the message and extend it: these results show that every real cart should travel farther from any high ramp. | does not address the need | Moss: The model examples do not establish that universal real-cart claim. |
| 3 · `careful-useful` | Keep this message: height changed, the surface stayed smooth, and the distance claim refers only to these shown model examples. | fits | Moss: The comparison changes height while controlling surface, and the wording stays within the supplied evidence. |
| 4 · `careful-wrong` | Choose a different surface for one ramp before keeping the message; identical surfaces prevent a useful comparison of the two heights. | does not address the need | Moss: Keeping surface the same is useful when investigating height. Changing it would introduce another difference. |

The `height-discard`, `surface-discard` and `careful-cautious` alternatives deliberately over-withhold a bounded statement. The useful choice must preserve the observation/control/claim scope, not simply sound confident or cautious. Demonstration results still depend only on the proposed setup pair; supplied-card results still use frozen card metadata; private words remain exact and ungraded. A card check never silently rechecks the repair.

## Complete Source Trail content

Keep the existing three-card packet exactly: A is the complete reviewed PH8646 image with its asset-specific creator/date/CC0 metadata; B is our modern note explicitly derived from A; C is the modern date summary whose underlying records are not supplied. No positive independent-witness example, new historical fact, inferred capture time, exact publication date or general trust hierarchy is introduced.

Keep the four question titles/prompts and their IDs, expected IDs, own-source outcome semantics and source-card viewer defaults. Tables define exact new choice order/labels; `unsure` remains last and is never fitting. Source Trail has one shared authored feedback paragraph per question; retain the existing outcome prefix plus the paragraph below, rather than inventing per-distractor runtime rules.

### Source Trail `origin`

Exact prompt: **Which card was used to make our picture note, Card B?**

| Position / ID | Exact supplied label | Fresh outcome |
| --- | --- | --- |
| 1 · `dates` | Card C · Archive date summary | does not fit |
| 2 · `photo` | Card A · Photograph | fits |
| 3 · `new-witness` | A separate historical witness | does not fit |
| 4 · `unsure` | Not sure yet | unobserved |

Expected ID: `photo`. Exact shared feedback: **B explicitly names photograph PH8646, Card A, as its source. The date summary and a separate witness are not its declared origin.**

### Source Trail `observation`

Exact prompt: **For the note’s water-and-boats detail, what is the underlying evidence?**

| Position / ID | Exact supplied label | Fresh outcome |
| --- | --- | --- |
| 1 · `note-only` | B’s note supplies a new historical observation; A illustrates the scene that the note recorded. | does not fit |
| 2 · `needs-confirmation` | Neither card can support this detail until another photograph confirms that boats and water were there. | does not fit |
| 3 · `photo` | A’s photograph supplies this local detail; B restates what is visible in that same picture. | fits |
| 4 · `unsure` | Not sure yet | unobserved |

Expected ID: `photo`. Exact shared feedback: **The photograph supports the pictured detail, and B draws on it. B adds no separate historical observation. Another photograph could add evidence, but is not required to describe what this supplied photograph shows.**

### Source Trail `independence`

Exact prompt: **What does this packet establish about A and B?**

| Position / ID | Exact supplied label | Fresh outcome |
| --- | --- | --- |
| 1 · `shared` | A and B are two cards using one photograph; B adds no separate historical observation. | fits |
| 2 · `independent` | A and B were made at different times, so their matching detail comes from two independent observations. | does not fit |
| 3 · `unresolved` | We cannot tell whether B uses A until another historical record confirms the account in B. | does not fit |
| 4 · `unsure` | Not sure yet | unobserved |

Expected ID: `shared`. Exact shared feedback: **B’s declared origin establishes its dependence on A for this detail. A second historical record is not needed to trace that supplied origin. This does not make B false or useless.**

### Source Trail `reply`

Exact prompt: **Which label gives the display reader a careful source trail?**

| Position / ID | Exact supplied label | Fresh outcome |
| --- | --- | --- |
| 1 · `witnesses` | A and B agree, and C comes from another publisher. The cards therefore independently confirm the pictured local view. | does not fit |
| 2 · `qualified` | A shows one local view. B draws on A. C summarises dates; this packet leaves C’s independence unresolved. | fits |
| 3 · `withhold` | A and B share one photograph. Leave their local view out of the display until another record independently confirms it. | does not fit |
| 4 · `unsure` | Not sure yet | unobserved |

Expected ID: `qualified`. Exact shared feedback: **We can identify the local photograph and B’s declared dependence without claiming independent confirmation. C supplies dates, not another view of these boats. Its independence is unestablished here; that is not proof of dependence.**

Origin uses short neutral source names and order variation only. A cautious policy choice is unnecessary there and would distort the existing B→chosen-origin strip, whose arrow means “was made using”. Other Source Trail questions contain a plausible over-withholding alternative, so caution alone cannot identify the fitting answer. A/B’s declared dependence is known; C’s independence remains unknown. Neither becomes a claim that the photograph proves everything, that a dependent note is worthless, or that every unknown relationship is dependence.

Fitting positions are Moss **2,4,3** and Source Trail **2,3,1,2**. They are fixed author choices, not a new balanced-distribution requirement. The labels remain available for an adult to read aloud. Existing prompt/help narration remains unchanged; automated answer-label narration is not currently supplied by these UIs and is outside this content repair. Accessible supplied reading is not independent decoding evidence.

## Frozen-source and old-work contract

The actual validators already admit own frozen wording/order/metadata. Do not change either validator merely to repair current content. Do not add catalogue equality, current expected-position checks, new “one fit” requirements on historical packets, version bumps that strand old visits, outcome consistency checks, source rewriting or save migrations.

- **Moss:** `apprenticeSource` freezes the encounter/cards/model once on explicit Start. `validApprenticeSource` checks the four-card shape/local IDs and bounded fields, not equality with current text or fit. `checkApprenticeCard` finds the selected card in the round’s own source and records its own text/fit/feedback. Rendering and resuming old visits must retain their original card order, original `careful-incomplete` or other removed IDs, selected card, prose, model, checks and contradictory recorded outcomes. Fresh checks in an old visit still use that visit’s original metadata. The base Fair Test investigation/page/trials remain unchanged.
- **Source Trail:** explicit Start freezes complete choices/answer/feedback/cards/photo metadata. The existing2–8 own-choice admission, source-local expected ID, historical different wording/order and recorded-label/outcome admission stay intact. Old `both-independent`, `worthless`, `certain` or any other removed new-catalog IDs remain valid in their own historical source. Fresh checks in an old visit use its own expected ID and feedback; rendering prior checks never regrades them. No new current-order assumption may enter the proposed-link strip, notes, narration or selection handling.

Starting the same case after the repair keeps existing familiarity semantics: seen case/question IDs still mean visited before. New wording/order does not become a claim of an unseen independent attempt. Current packet factories and their new visits must not alias/modify retained sources. Preserve unknown/raw/future/duplicate siblings and caps/ID behavior exactly. Generic import/restore, save-off, explorer switching, older games, Source Trail source metadata/rights and optional private prose remain unchanged.

## Build boundary and proportionate acceptance

After independent review, expected product edits are the two content modules only. Add narrow regression assertions in existing tests/browser probes where needed; no generic distractor analyser, shuffle engine or additional framework. No AGENTS, held app/media/global-style/mobile/README edit or new art. If content no longer fits existing phone controls, surface the concrete issue before expanding UI scope.

Independent content review must adjudicate every one of the **28 displayed choices**: Moss12 definite choices (3 fitting/9 other), Source Trail12 definite choices (4 fitting/8 other) plus4 unsure choices. Blank remains independently available: Moss blank supplied-card check produces no new card result; Source Trail blank/unsure may be kept with null outcome under existing behavior. Keep “not useful for this reader’s need” distinct from a factually false statement.

Required checks:

1. Assert the seven exact authored ID orders, expected positions and complete texts/feedback from this spec. New Moss packets have one fitting card; Source Trail expected IDs remain source-local. Exercise every choice plus existing blank/unsure paths. No proof-of-reasoning or novelty label follows.
2. Retain synthetic **pre-change** Moss and Source Trail visits with original first-position answers, original order/labels/fit/feedback, removed IDs, selections, repairs/prose and recorded outputs. New Starts use revised packets while old visits, fresh old-source checks and their exact recorded snapshots still use old sources. Include contradictory recorded outcomes and differently ordered admitted sources; do not regenerate fixtures from the changed catalog and call them old.
3. Check that a new Start does not mutate earlier source arrays/cards/checks, sibling roots or the waiting Fair Test investigation. Existing retention, import/restore, explorer/save-off and future/raw behavior must not regress; use narrow established coverage rather than a new machinery suite.
4. Actual phone/desktop review of all seven choice sets:320/390/820/1440 widths, wrapped complete labels, no clipping/ellipsis/horizontal overflow,44px native targets, selected-state clarity and local focus, unchanged existing prompt/help narration and readable labels for optional adult spoken reading, help that can be closed in the current view, origin proposed-link grammar, and feedback still adjacent/reachable. Record ordinary prompt-to-action/scroll length; no one-viewport promise or fixed equal-length rule. Inspect longest expanded alternatives as well as fitting ones. Long saved-source wording remains readable and unchanged. Record the existing Moss limitation: its saved help-support flag reopens that fold after a rerender. This repair does not promise persistent help closure or change that prior behavior; Source Trail preserves fold closure. Do not claim new automated narration of answer labels.

Independent specification/content review precedes build; independent implementation/content review and root actual browser checks precede a draft. The independent review cleared the two acceptance wording folds and all28 alternatives before build; implementation and browser evidence are recorded separately in review72. The original review did not mutate PR59; its later merge was separately reviewed. No new capability, research-efficacy finding, measured learning gain, physical-device/human-screen-reader claim or release approval is asserted.
