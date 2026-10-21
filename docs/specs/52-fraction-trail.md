# 52 — Fraction Trail: build the spaces, place the stop

**Status: authored candidate, awaiting independent specification review. Not build-ready, implemented, or approved for release.** This is the next bounded fraction-number-line candidate in M3-fractions 1–5, with a first beyond-one encounter from item 3. It does not complete the decimal bridge or the still-missing place-value/written-calculation sequence.

## The gap and the purpose

The Sharing Counter lets learners change equal pieces and see a derived number-line marker. It never asks them to construct the line's equal intervals or place their own marker. Turning that derived marker into evidence of independent placement would overstate what was observed.

At a new optional table beside the café, neighbors mark stops along a pretend ribbon trail for a gathering. One complete ribbon is the unit. Learners build its equal intervals, step a flag from zero, compare a labelled number with the flag, and keep a route card. The story gives a reason to place a stop; it does not claim that a physical journey was measured or that a café gathering has been completed.

Use `#cafe/fractions` with a separate optional `fractionTrail` root. Preserve the Sharing Counter, current café guest/plate/stock, gathering trays, packing table, all explorer notebooks and current messages. No route card spends stock, serves a guest, finishes an act, starts a film, or creates an incoming connection. Every request, page, help option and other destination remains open. There is no assessment that unlocks play.

## Numbered teaching encounters

| Step | Concrete teaching and contrast | What the response can establish |
| --- | --- | --- |
| 1. Fix the unit and zero | Bracket the entire 0–1 interval as **one whole ribbon**. Zero is the starting boundary; the line continues to 2. Count spaces separately from boundary marks. | A supplied unit/reference, not independent measurement or ruler reading. |
| 2. Build equal intervals | Add/remove internal division marks. Compare three unequal spaces with three equal spaces in the repair request. Four marks including the endpoints make three spaces, not four thirds. | Separate space-count and equal-length outcomes. Counting pieces alone cannot establish thirds. |
| 3. Name one fractional unit | With a valid equal partition, name each interval as one half, third, quarter or sixth of the same 0–1 unit. On an unequal partition, say **spaces** and retain the actual lengths without naming them equal fractional steps. | Meaning of a unit fraction in this finite length model. No whole-domain notation or shape claim. |
| 4. Iterate from zero | Move the flag one current space forward/back. Three quarter-length steps from zero end at three quarters. One step begins at zero, not at the first positive tick. | Learner placement remains pictured practice; the model is visible. |
| 5. Read the actual flag | Enter a fraction or whole number describing the flag's current location. Check that reading against the actual location, separately from whether it satisfies the requested stop. | A correct reading of an incorrectly placed flag is still correct. |
| 6. Keep the same point while changing units | Keep a half route, then partition the same whole into fourths or sixths and place a new flag. Compare the kept route and new route at the same scale. | One half, two quarters and three sixths can name the same number. This is not a general simplification algorithm. |
| 7. Continue past one | Five quarter-length steps end at 5/4, beyond 1; four quarter-length steps end exactly at 1. The unit does not stretch to make the endpoint become 1. | Improper-fraction meaning in one explicit case; no mixed-number conversion requirement. |
| 8. Notice a changed whole | Optional supplied comparison: a short ribbon and a ribbon twice as long share a physical display scale. Half of each is the same fraction but a different ribbon length. Both original wholes stay outlined. | A separate modelled contrast; no metric-length or broad ratio competence claim. |
| 9. Keep and revisit | Keep an unfinished or checked route; change a request or partition and compare the frozen work. | A local record of choices, exact model and support, not mastery or completed travel. |

Steps are authoring order, not mandatory screens. Keep short **Build / Place / Read / Keep** pages with the current request, 0–1 unit and relevant line visible. A learner can enter any page with an unfinished model and return to change it.

## Six finite requests

All main lines run from 0 to 2, with the 0–1 unit and 1 boundary explicit. Internal coordinates below are implementation-only integers, never centimetres, tokens, scores or words in the child-facing story. Twelve internal ticks represent one unit; they allow exact halves, thirds, quarters and sixths without floating-point tolerances.

| Stable ID | Request | Allowed equal spaces per whole | Initial internal marks in 0–1 | Requested exact number |
| --- | --- | --- | --- | --- |
| `quarter-stop` | Mark the gathering stop three quarters of a ribbon from the start. | 4 | 3, 6, 9 | 3/4 |
| `repair-thirds` | Repair the three spaces, then put the flag two thirds from the start. | 3 | 3, 8 — deliberately unequal | 2/3 |
| `sixth-stop` | Put the flag five sixths from the start. | 6 | 2, 4, 6, 8, 10 | 5/6 |
| `same-half` | Show the halfway stop with halves, quarters or sixths. | 2, 4, 6 | 6 | 1/2 |
| `past-one` | Continue five quarter-length steps from the start. | 4 | none — editable one-space starting model | 5/4 |
| `whole-stop` | Mark four quarter-length steps from zero. | 4 | 3, 6, 9 | 4/4 = 1 |

The initial flag is absent, including on already-partitioned requests. Selecting a request never places its answer. Initial authored marks are supplied model support; a learner who uses them is not credited with constructing that partition independently.

**Boundary encounters:** zero and two remain available flag positions; the first and last controls disable without losing focus. Neither is a seventh hidden request. Reading zero as `0`, `0/4`, or `0/6` is valid. An exact-one request never adds another interval automatically. A wrong stop stays editable; no silent snapping to the answer.

A distinct optional worked example places **one third** on a separate 0–2 line: show the unit; divide its first whole equally into three; take one step from zero; name the result. Advance only on request. Do not substitute the current two-thirds repair request or reuse its answer under an “unseen” label. The example never edits the working line.

## Exact model and actions

The main source freezes `id`, story title/request, model revision 1, target numerator/denominator, allowed space counts, `unitTicks:12`, `maxTicks:24`, and initial marks. Semantic numbers, IDs and model revision must match supported content; saved title/request wording may survive editorial changes.

A working line owns sorted unique integer `cuts` in 1–11, an optional `markerIndex`, a raw reading draft, page/help state, support, history and kept route. The first whole has boundaries `[0, ...cuts, 12]`; the second repeats the *same* intervals with 12 added, ending at 24. Do not create an independently editable second-whole partition in this slice. For n spaces per whole there are 2n spaces and 2n+1 boundary positions over the complete line.

- **Add/remove a cut:** toggle one of the 11 guides through labelled native controls; do not require dragging or a sub-44px line target. Explain the guide as a place to divide the first whole, without exposing internal-coordinate arithmetic as the lesson. Editing cuts removes the working flag, clears current feedback, preserves its raw reading and histories, and announces that the old flag must be placed again on the changed spaces.
- **Start the flag at zero:** explicitly set index 0. **Forward one space / back one space** changes the index by one within the existing boundaries. No move is available until the flag has been started. The rendered line always uses actual boundary coordinates, including unequal spaces. The action says “space” until the partition is equal, then may say the current unit fraction.
- **Equal partitions:** n must be in the request's allowed list, and every first-whole interval must have length 12/n. Count and equality are separate outcomes. A wrong n that happens to be equal remains a valid editable model, but does not satisfy this request's partition constraint.
- **Supplied partition help:** optional buttons prepare 2, 3, 4 or 6 equal spaces, explicitly as support. Preparing an otherwise disallowed count is allowed exploration. Mark support before modifying the line, remove the working flag, retain raw text and prior snapshots, and do not check automatically.
- **A ready example together:** optional explicit replacement prepares an allowed equal partition and target flag, records support first, and leaves prior keeps/history exact. It does not check, keep, or claim an independent response.
- **Request/page changes:** preserve each request's unfinished work and raw draft. Returning to a request labels it familiar. Page/help navigation clears screen-only input errors, not model state or sticky support.

No approximate hit-testing or numeric tolerance determines correctness. Marker location is the selected integer boundary divided by 12; fractional equality uses bounded integer cross multiplication. Responsive changes rescale pixels, not the mathematical unit. At 1, the second whole has exactly the same screen scale as the first.

## Three different checks

All checks are optional, model-visible practice. A check freezes the literal response (if any), exact source, current model, separately recomputed outcomes, support *before feedback*, case familiarity and whether this kind was previously checked. Feedback does not change the model or populate a raw answer.

1. **Check the spaces:** report `spaceCountMatches` and `equalSpaces` separately. A 3/5/4 internal-width arrangement has three spaces but not equal thirds. Endpoints are boundary marks, not additional intervals.
2. **Check the requested stop:** report `flagPresent`, `pointMatches`, and `partitionMatches` separately. For the two-thirds request, a flag at internal position 8 is numerically at the requested point even if the learner left unequal spaces at 3 and 8; acknowledge that location while explaining that the three spaces are unequal. A ready route requires both a valid requested partition and the requested point, not a typed reading.
3. **Check my reading:** compare the raw number against the actual flag boundary divided by 12, irrespective of the requested target or equal-space readiness. With no flag, focus an instruction to start/place one and create no numerical-response check. An accurate `1/4` reading of a flag at internal 3 remains accurate on the unequal-thirds model. Never substitute the target 2/3 for that reading.

**Numeric grammar:** preserve a text draft up to 24 characters. After trimming, accept an ASCII whole number or `numerator/denominator`, with optional spaces around `/`; numerator 0–48 and denominator 1–24. Whole numbers use denominator 1. Leading zeroes are accepted. Blank, signs, decimals, exponent notation, a zero denominator and other forms remain invalid drafts, not wrong mathematical attempts. A syntactically valid number outside 0–2 is an incorrect reading of this line, not a syntax error. Accept equivalent values such as `02/04` and `1/2`; do not require lowest terms, a particular denominator or mixed notation. Retain the original text, including whitespace. Invalid drafts persist across reload. Editing their text clears the linked screen error without replacing the input node or moving its caret.

Feedback must name what was checked: the spaces, the *requested* stop, or the *actual* flag. A correct raw reading never silently completes a requested-stop check. Editing cuts/flag invalidates current feedback that depends on that model. Editing the raw reading invalidates only reading feedback. A historical result stays explicitly earlier work; it must never look like a current success.

## Keeping, help and evidence boundaries

Keep works for all valid editable models, including no flag, unequal cuts, blank or malformed input and wrong stops. The latest keep per request freezes source/model/raw text/support and derived readiness. Keeping does not require a check. On Keep, render the kept route and current route in separate labelled panels on the same mathematical scale. This supplies the comparison for `same-half`: the learner may keep a half, change to fourths, place two steps and inspect both locations. Neither snapshot may borrow the other's marker or source.

Support includes supplied initial partition, visual model, handling, supplied partition, example steps, explanation of units/boundaries, changed-whole comparison, current-request preparation, narration, working together and prior feedback by check kind. Keep flags sticky in current work; do not rewrite earlier attempts when later support is used. A click, a matching value, a kept card or a narration request is never independent recall/decoding evidence. Optional spoken explanations stay unrecorded and ungraded.

Fractional relationships such as four quarter-steps are not whole-number fact pairs such as 4×4. The initial design displays no literal complete whole-number multiplication facts; its renderer must therefore return no new whole-number fact exposure pairs. If later content introduces such an equation, tie exposure to that exact visible component. Do not infer an integer fact from internal grid coordinates. Track exact local task familiarity/support; do not add an inferred fraction-mastery service or alter suggestions in other games.

## State ownership and historical validity

One optional version-1 root, absent until an explicit action. Reading, rendering, notes and import leave absent roots absent. Root fields: `version`, `currentCase`, `page`, `cases`, optional `recovered`. Cases are keyed only by the six stable IDs. Freeze one supported source per case; no generated content or daily task changes.

Each case owns `cuts`, `markerIndex` (null or valid boundary index), `readingText`, help topic/example step, sticky support, checked-kind/current-feedback maps for the three check kinds, screen `inputError`, at most 24 immutable checks and one latest kept route. `markerIndex` must reference the boundaries actually derived from that snapshot's cuts. Reject unknown keys, unsupported sources, out-of-range values, duplicate/unsorted cuts, forged readiness/outcomes and incompatible selector/history relationships without normalizing the payload.

When history is capped, retain the latest check of every kind. Recompute every historical result using its own frozen source, cuts, marker and raw text; do not score it against the current request or a changed model. Current-feedback selectors must match the latest result and its exact relevant current inputs. Support in earlier snapshots must be consistent with current sticky support; histories must not fabricate first attempts after feedback.

Unknown, future or invalid roots remain raw, escaped in notes, importable/exportable, and unavailable to play until the user explicitly chooses keep-raw/start-fresh. Preserve the complete old payload under `recovered`. Import root registration, explorer isolation, save-off, export, reset and unsupported-data paths must use the established optional-destination pattern. No dates, learner identity, microphone, upload, analytics, server records or live AI are introduced.

## Source crosswalk and prerequisite decisions

The [source audit](../source-audits/52-fraction-trail.md) records five selected target descriptions, all 16 hard predecessors (including four selected targets reached through other targets), direct soft edges and 17 unique inspected nodes. The companion [CSV](../source-audits/52-fraction-trail.csv) joins each to these numbered teaching steps and states its proposed disposition and limits. These are author decisions awaiting independent review, not reviewed prerequisites or implemented atlas coverage.

| Selected topic | Numbered steps | Proposed narrow placement |
| --- | --- | --- |
| `mt_Kr3IyA6m-O` — fractions as numbers | 1, 3–5, 7 | Active placement of the six authored targets; actual number separate from the story. |
| `mt_NoB20kVa4w` — partition then iterate 1/b | 2–5, 7 | Construct equal intervals, locate one unit fraction, iterate it from zero. |
| `mt_ndGqFPWyen` — a parts of size 1/b | 2–4 | Length model for halves/thirds/quarters/sixths. No general set/area coverage. |
| `mt_Ep7TDFuYUa` — equivalence as same point | 6 | The one-half family with denominators 2/4/6; not arbitrary fraction generation. |
| `mt_vKcxX6iNOA` — fraction notation | 3–7 | Numerator, denominator, unit fraction and equivalence in these models. Broad mixed/simplest-form vocabulary remains untaught. |

The hard ancestry includes whole-object equal sharing, shapes and fractions of sets. Those source links are retained. Optional inline count-and-separate demonstrations and existing Sharing Counter links can support the needed meanings, but a previous visit is not assumed. Circles, different-shaped equal areas, general fraction-of-quantity calculation and fluent division are explicit scope exceptions for this length slice, not declarations that those topics are completed. The number-line ordering entry whose description is actually inequalities (`mt_i2F1nWxJjv`) is not selected by its misleading title.

Jane was refreshed at `d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`; Marble at `2e6ced94833f0e48f6c1efad46e5f50c1f420f3c` on 2026-10-21. Jane's number-line format, stable items and separate examples are design references. Its drag/tolerance grader and answer-adjacent hint are unsuitable for this exact, keyboard/touch, partition-and-iterate task; no code, lesson prose or assets are copied. The bundled Marble pin stays `96a7933754af672e1bfdbf7ecb05c325860c6e0d`; source-derived audit data retains the existing ODbL database and CC BY-SA text attribution. No new runtime atlas links may be added until the actual content is built and reviewed.

## Acceptance packet for a future build

- Check every initial partition, target, all boundary positions, 0/1/2 endpoints and the correct 5/4 point. Exhaustively verify equal-space checks for all 2^11 cut subsets; the unit never changes.
- Check unequal thirds at 3 and 8: a flag at 8 has the correct target location but fails equal partition; a flag at 3 with raw `1/4` has a correct reading but a wrong requested stop. These outcomes must remain separate in state and visible feedback.
- Keep 1/2, change to fourths, place 2/4, and compare; then change to sixths and place 3/6. Freeze earlier work and preserve the 0–1 bracket. Do not pass merely because the fraction text is equivalent when the flag is elsewhere.
- Verify strict raw syntax, equivalent fractions, valid-but-wrong values, no-flag feedback, error correction/caret, history trimming, frozen source copy edits, forged historical outcomes and unsupported recovery.
- Show the changed-whole comparison at a shared physical display scale, with both whole outlines retained. Review its explanation independently; no false metric units or equal-length claim.
- Trace support timing for initial marks, partition help, separate example, current-ready preparation, narration and checks. No render creates an attempt or silently initializes the optional root.
- Seed actual synthetic waiting café, Post Office/Bramble, gathering, packing, letter and Loft records. Enter directly and via links; verify exact preservation, no film/connection panel, explorer switching, save-off, reload, export/import and reset.
- Browser-test all four pages, cut controls and flag controls with keyboard/touch, 44px targets and narrow portrait. Place the flag controls next to the line. Focus checks at their own feedback, invalid input at its linked error, keep at its artifact and self-disabling controls at a nearby enabled control/container. Inspect screen-reader names, reduced motion and local-narration fallback separately from claims about real-device audio.

Independent spec review must resolve this candidate before runtime implementation. Independent implementation review and real browser QA then apply to the final candidate; separately authorized merge/deployment comes afterwards. A passing finite-model checker cannot replace content, pedagogy or accessibility review.
