# 53 — Bundle Burrow: exchange without changing the amount

**Status: build-ready after independent specification review and resolved findings; [receipt](../reviews/52-55-independent-spec-review.md). A local implementation now exists on `build/bundle-exchange`; [Independent implementation review](../reviews/53-bundle-exchange-implementation-review.md) and local/browser checks passed. Composed-release verification remains separate; not release-cleared.** This is the missing base-ten conservation bridge in M1-number 1–2. It does not complete written addition/subtraction, multi-digit multiplication/division, or the place-value strand.

## Existing overlap and the specific gap

The Number Garden already has tens/ones questions, pictures, feedback and a model action that trades ten ones for one ten; it also trades ten tens for a hundred. `dist/broad-ui.mjs` lets users add/remove units freely, and `dist/broad-variants.mjs` supplies bundle/value questions. Do not describe base-ten models or all exchange as wholly absent.

What is missing is a bounded, reversible **fixed-quantity** task in which ten ones become one ten and back again, the learner can inspect every constituent one, and a noncanonical arrangement remains the same number. Free add/remove controls change the quantity and cannot establish that invariant. Packing spec51 varies bag capacity and purpose; a bag of five is not a decimal ten. Neither a correct packing answer nor a previous Number Garden visit certifies place-value understanding.

Add an optional exchange table under the existing Bundle Burrow, tentatively `#numbers/exchange`. Neighbors have a fixed collection of imaginary seed counters to put into convenient bundles and label. One counter always counts as one. One wrapped bundle always contains exactly ten. No counters enter/leave the table; regrouping never earns seed inventory or alters the planted garden.

## Numbered teaching encounters

| Step | Action and contrast | Boundary |
| --- | --- | --- |
| 1. Count the collection | Count individual pictured counters once, including ones inside an outlined bundle; distinguish the number of objects from the number of containers. | Optional counted support; no fluency or arbitrary-range counting inference. |
| 2. Compose a teen | From thirteen loose counters, put ten in a visible frame, leaving three outside. Name the whole collection as thirteen. The frame is a grouping of the same counters. | Supplies the teen-composition meaning before naming a wrapped decimal ten; no handwriting requirement. |
| 3. Exchange both ways | Wrap the ten frame counters into one ten-bundle. Unwrap that bundle back into ten frame counters. Track the unchanged collection before/after. | A ten is ten ones; the number of containers changes while quantity does not. |
| 4. Allow several arrangements | For27, compare 2 wrapped tens +7 other ones with1 wrapped ten +17 other ones and27 ones. Partial frame contents remain individual ones. | A noncanonical arrangement is mathematically valid. Do not concatenate physical bundle/one counts into a numeral. |
| 5. Distinguish count, digit and value | Read the actual number of wrapped bundles; then inspect the supplied numeral27. Its tens digit is2, worth20 individual counters, even if only one ten is currently wrapped. | Keep actual-arrangement reading separate from numeral-place reading; no independent recall/decoding claim. |
| 6. Make zero meaningful |20 and30 have zero ones in their conventional tens/ones descriptions.7 has no tens;0 has no counters. Empty space does not add a counter or erase another digit's value. | One-digit numerals need no leading zero. No internal-zero hundreds/subtraction claim. |
| 7. Revisit in another arrangement | Keep a useful label/model, exchange again and compare the frozen earlier arrangement.42 starts with3 tens +12 loose ones and can become4 tens +2 ones. | A changed context in the same supplied model; not independent transfer to a new skill. |

Short open pages **Exchange / Read / Digits / Keep** retain the request and current collection. All tasks and help remain available from the chooser. No need to pass a counting task to reach digit discussion or to complete another destination first.

## Seven finite collections

Model revision1. No procedural quantities or daily regeneration.

| ID | Total individual counters | Initial wrapped tens | Initial loose counters | Initial frame |
| --- | ---: | ---: | ---: | ---: |
| `thirteen` |13|0|13|0|
| `twenty-seven` |27|1|17|0|
| `twenty` |20|2|0|0|
| `thirty` |30|0|30|0|
| `seven` |7|0|7|0|
| `empty` |0|0|0|0|
| `forty-two` |42|3|12|0|

An optional **different example** uses16 individual counters, with a manually advanced frame→wrap→unwrap sequence. It cannot fill or answer the current collection. Source title/request wording may be revised while saved mathematical quantities, units, model revision and IDs remain exact.

## Conservation model

The finite editable model is `(wrapped, loose, frame)` with nonnegative integers, frame0–10, wrapped0–4 and loose0–42. Every valid state satisfies:

`10 × wrapped + loose + frame = frozen total`.

The frame has ten clearly outlined positions, arranged as two rows of five, each with at most one counter. A full frame is ten individual counters waiting to be wrapped, not an additional counter or an extra bundle on the shelf. Every wrapped bundle is visibly made from ten constituent marks; its outline/container has no numerical value of its own. If a compact summary is also shown, label it as a summary, not another collection of counters.

Native controls perform exact atomic actions:

- **Move one loose counter to frame:** loose−1, frame+1, only when loose>0 and frame<10.
- **Return one frame counter:** loose+1, frame−1, only when frame>0.
- **Return the whole frame to the loose pile:** loose+=frame, frame=0; announce the actual number returned. This is a shortcut, not evidence that the user counted that many.
- **Wrap these ten:** only for frame=10, then wrapped+1 and frame=0. Both before/after pictures account for the same ten counters. A partial frame cannot be called or wrapped as a ten.
- **Unwrap one ten into the empty frame:** only when wrapped>0 and frame=0, then wrapped−1 and frame=10. If the frame is occupied, explain that it must first be emptied; do not discard or add counters to make room.
- **Count and fill the frame together:** optional support moves `min(loose,10−frame)` individual counters. Mark support before the move. If only seven remain, a seven-counter frame stays partial; no invented three counters and no automatic wrap.
- **Show another arrangement together:** explicit support may replace only the editable grouping with the conventional wrapped/loose arrangement for the *same frozen total*. Preserve raw drafts and earlier keeps/checks, explain the replacement, and do not create a check or keep.

There is no add/remove-total control, no import from café stock, no silent auto-wrap and no animation required for a state change. A manual before/after illustration may help; reduced motion and a text description give the complete transition. Invalid operations preserve the entire draft and focus a relevant enabled control/container. The mathematical unit remains one counter throughout.

## Separate readings and feedback

All responses are optional pictured practice; the full total may be visible as the source quantity. Do not call a successful label independent computation of a hidden quantity.

**Read:** two distinct forms ask (a) the number of **wrapped bundles currently on the shelf**, and (b) the **total number of individual counters on the whole table**, including the frame and wrapped counters. Asking actual wrapped-bundle count is deliberately narrower than asking how many tens the total contains. With `(1,7,10)` for27, the physical wrapped count is1, while there are27 counters altogether. The full but unwrapped frame does not count as a wrapped shelf bundle.

**Digits:** show the frozen collection's conventional numeral as supplied information. Ask (c) its **tens digit** and (d) the **value of that digit in individual counters**. For27, these are2 and20 regardless of the working grouping. For0 or7, state explicitly that there is no tens digit written; show an optional place-value table with0 tens rather than misidentifying the existing ones digit. These one-digit cases offer the value-of-tens-place prompt (0 counters) with an explicit supplied empty tens place; do not ask the learner to locate an unwritten digit. Thus the `tens-digit` check is unavailable for these two cases, while the other forms and all pages stay open.

Each form has its own raw number draft and selected unit/label. Units are **wrapped bundles**, **individual counters**, or **digit**. Numeric syntax is trimmed ASCII digits only,0–99, up to24 original characters; retain leading zeroes/whitespace. Blank, signed, decimal, exponent, non-ASCII or out-of-range text remains an invalid draft, never a wrong check. An in-range wrong number is a valid response. Save every raw edit without replacing its input node or caret; errors clear on correction and remain linked to the correct form.

Check outcomes recompute numeric match and label/unit match separately. For the digits forms, explain digit versus value if those are confused. A correct wrapped-count response does not answer the tens-digit form; a correct numeral reading does not say that a particular grouping is conventional. No “ready” flag requires canonical grouping. Any conservation-valid arrangement can be kept. Existing correct answers must not turn wrong merely because a counter moves between the loose pile and frame.

Changing grouping invalidates current wrapped-count feedback; other outcomes may stay current only if their relevant source/input target is unchanged. Editing a particular text or unit invalidates only its feedback. Page/help changes clear screen errors only. History remains immutable and explicitly labelled earlier work where its model differs.

## Support, records and actual exposure

Sticky support distinguishes pictured source/model, handling, counted fill, supplied rearrangement, separate example, unit/digit explanation, narration, together and feedback by check kind. Checks freeze support **before feedback**, exact source/model/raw response, separate outcomes, prior-check/familiarity and `practice:true`. Reopening a collection is familiar; none of the finite requests claims unseen transfer. Optional spoken/drawn explanations stay ungraded and need not be recorded. Dictated or adult-entered text is support, not evidence of handwriting or decoding.

**Exact existing-task familiarity bridge:** only a visibly complete canonical **bundle-total** example emits a semantic signature. It must show the conventional tens/ones decomposition and its total together (for example, two tens, seven ones and27); a source numeral alone, a noncanonical grouping or a partial frame does not qualify. A canonical diagram has `frame=0`, `loose<10` and the actual displayed wrapped/loose counts. An explicit conventional readout can emit the same signature even beside a differently labelled noncanonical working diagram, but must actually state both conventional counts and the total. No hidden case emits anything.

Persist unique `bundle:0:tens:ones` strings in `bundleExchange.shownBundleExamples`, bounded to the six possible displayed canonical quantities13,16(example),20,27,30,42. Current zero/seven examples do not match the existing bundle-task domain. Match an existing question only when its authoritative parameters are `{type:'bundle',hundreds:0,tens,ones}` with exactly equal counts. Read generated `question.variant.params` first, otherwise decorated `question.params`/the authored parameter table; never match the freely editable `question.model`, answer alone, ID alone or variant seed alone. Existing three-digit `value` tasks have no matching signature in this release, even if their target digit/value equals a displayed number. This unit does not teach a matching complete value question.

Positive: the authored `number-support` asks two tens/seven ones and matches `bundle:0:2:7`, although its separate playground initially draws four tens/three ones. A generated bundle question with the same exact counts also matches, regardless of seed. Negative:1wrapped ten+17loose ones,27loose ones alone, a two-tens/eight-ones question, or a three-digit digit-value question is not that complete example.

When a signature is actually shown, update only matching paused `state.broad.drafts` familiarity to true, preserving question, raw answer, attempts, support, model and completed observations. Future `familiarity` calls and resumed/open or submitted matching drafts must OR in this semantic exposure instead of trusting a stale saved `familiar:false`; this includes any already-live matching draft. Keep independent reasoning and `familiar:true` separate: this prevents `freshEvidence` without pretending an answer or helping action occurred. Do not mark all variants of a template familiar by pushing its ID into seenItems, and do not rewrite completed observations. If an imported/recovered exchange history cannot establish its prior shown examples, related bundle questions retain `priorExposureUnknown` rather than a fresh claim. The existing `noteBroadExposure` fact-pair loop cannot supply this new semantic bridge unchanged. This is one bounded adapter to current bundle tasks, not a general mastery/semantic registry.

A pure renderer must report literal whole-number facts beside the components that show them. If it displays `2 × 10 = 20` for two wrapped bundles, expose only that exact ordered pair through the existing app hook. Do not record`3 × 10` merely because the total is30 when the current visible grouping has no three complete tens; source numeral30 by itself is not a multiplication demonstration. A full frame may explain`1 × 10` only when that relationship is actually shown; partial frames never do. The sixteen-counter example exposes a whole-number relationship only on its visible full-ten step. Do not scan hidden requests or snapshots for exposure, create math attempts on render, or affect café/Bramble completion.

One optional `bundleExchange` version1 root owns current case/page, a known-ID case map, `shownBundleExamples` (initially empty, unique known six-signature list) and optional raw `recovered` data. A pure renderer reports qualifying visible signatures alongside its HTML; an explicit app exposure hook persists them without creating responses. Unknown/duplicate/out-of-scope signatures make the root unavailable rather than being silently normalized. Reading/render/notes/import keep absent roots absent. Each case freezes source, `(wrapped,loose,frame)`, four text/unit drafts, support, current-error/current-feedback maps, at most24 immutable checks and one latest kept snapshot. The disabled one-digit `tens-digit` kind never acquires a fabricated check. Keep saves the exact model, raw drafts, source/support and relevant derived outcomes; it may be replaced only by explicit Keep.

Validate known shape, integer bounds, conservation against each frozen source, response grammar and enum membership, supported source semantics and every stored result/target. Historical targets come from historical inputs, not from the current grouping. Current selectors must match the latest check's relevant current inputs; source corrections cannot retroactively rewrite saved wording. Retain at least the newest check per available kind when trimming. Earlier support must be consistent with the current sticky record, and feedback cannot masquerade as a new first attempt.

Unknown/future/invalid roots remain exact and unavailable, escaped in notes and retained by import/export. Presence of recovered/unsupported history qualifies subsequent local checks/keeps as prior encounter/check history unknown (or conservatively familiar), survives pruning, and cannot create an unqualified first/unseen claim. Preserve the exact-example bridge’s unknown qualification for related existing bundle tasks; do not reconstruct unsupported histories. Explicit keep-raw/start-fresh retains their complete payload. Explorer isolation, save-off, reload, export/reset and generic transfer must follow the existing optional-destination pattern. Use lazy read plus explicit mutation as in `word-garden-core.mjs`, not an eager initializer in `initializeExplorerState`. No new learner identity, dates, microphone, uploads, server storage, analytics or runtime AI.

## Sources and prerequisite placement

The [source audit and crosswalk](../source-audits/53-bundle-exchange.md) covers three selected targets and their complete six-ID hard predecessor set, seven unique target/ancestor nodes in total. Full descriptions/evidence and incoming edge reasons match refreshed Marble`2e6ced94833f0e48f6c1efad46e5f50c1f420f3c`; the bundled pin remains`96a7933754af672e1bfdbf7ecb05c325860c6e0d`.

| Target | Steps | Scope |
| --- | --- | --- |
|`mt_xmmgAzxe5j` — teen composition|1–3|Thirteen and the separate sixteen example; not every teen numeral or handwriting.|
|`mt_r0VXbfAmsH` — a ten is ten ones|2–4|Exact wrap/unwrap conservation, not a capacity-changing parcel bag.|
|`mt_THl9GLxwoL` — two-digit tens/ones meaning|4–7|Selected quantities to42 and digit-versus-value distinction; not all two-digit tasks or arithmetic.|

The graph has teen composition before naming a ten-bundle; steps2–3 follow that semantic bridge instead of inventing a new source edge. Cardinality/counting can be supported inline. The hard ancestry also includes numeral reading/writing and **English digit formation**. This digital math slice supports numeral-quantity matching but makes an explicit motor/transcription exception: tapping or typing digits is not handwritten digit formation, and a motor skill is not a mathematical access gate. That scoped exception is accepted in the independent specification receipt.

Jane`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81` provides design study of stable supplied items, separate examples and optional help, not new incorporated code/text. The existing original Number Garden is the main reuse candidate: retain its place-value language and correct feedback concepts, but keep this fixed-inventory model separate from its freely adjustable assessment playground. Do not copy the old hundreds model or mutate its drafts to obtain this smaller loop. No new taxonomy mappings until a reviewed implementation exists; preserve all upstream notices.

## Acceptance before release

- Enumerate every conservation-valid `(wrapped,loose,frame)` for every collection and every action boundary. Wrap/unwrap and one-counter moves must conserve total; every supported path should permit returning to all-loose and reaching every other valid grouping.
- For27 check `(2,7,0)`, `(1,17,0)`, `(1,7,10)` and `(0,27,0)`: same total, distinct wrapped counts, same numeral/tens digit/tens value. Reject concatenations such as117 as the total. Do not treat a noncanonical arrangement as incorrect.
- For20 and30, keep a zero ones place when the arrangement is conventional; unwrapping does not change the numeral. For7 and0, no fabricated written tens digit, no wrapping a partial/empty frame, and no blocked access to pages/help/keep.
- Review each counter's countable art and unit labels. Partial frame, full frame and wrapped bundle must not duplicate counters or count an outline as one. Check conservation visually as well as numerically.
- Exercise support chronology, exact shown-fact exposure, repeated checks, raw syntax, input correction/caret, current/earlier feedback, frozen keeps, wording-only source edits, forged outcomes, unavailable recovery and history trimming.
- Use actual synthetic waiting original Number Garden drafts, café/Bramble, gathering/packing, letters and Loft work. Verify preserved tasks and raw histories; only actual visible exposure may update existing familiarity fields. No film, connection or planting reward appears here.
- Browser-test direct entry and links, all pages/collections, keyboard/touch, 44px targets, compact frame/control layout, focus after wrap/unwrap disables controls, feedback/error/keep focus, reload, explorer switching, save-off, import/export and reset. Screen-reader and physical-device/audio claims require their own checks.

Independent specification review is complete in the receipt. Review teaching meaning and the handwriting exception as well as the finite model. Builder enumeration, source accounting and documentation checks are not independent clearance; merge/deploy remain separately authorized.
