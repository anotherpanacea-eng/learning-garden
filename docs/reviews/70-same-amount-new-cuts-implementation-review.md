# Same Amount, New Cuts: independent implementation, content and art review

**CLEARED for this bounded local draft increment. Outstanding P1:0. P2:0.** One P2 about future-drawing description snapshots was reported and repaired by the builder, then independently rechecked. This receipt does not approve merge, deployment or a learning-effect claim.

Reviewed the complete cleared [spec70](../specs/70-same-amount-new-cuts.md), [source audit](../source-audits/70-same-amount-new-cuts.md), [spec review](70-same-amount-new-cuts-spec-review.md), all new `dist/ribbon-matches-{content,core,ui,art}.mjs`, local CSS, the actual Workshop/Fraction Trail/index seams, and both ribbon test files. Reviewer previously authored only the source audit/spec review, not this runtime or art. Only this review receipt is authored here.

## Resolved finding

**P2, resolved: freeze the actual future-picture fallback description.** Initially the future-version UI displayed a full working-ribbon description plus a supplied fraction label, while `evaluateMatch` saved only the shorter label/unavailable sentence. That lost text actually shown at the check. The builder introduced `matchWorkingPictureText`, used by both the visible `.ribbon-match-fallback-working` paragraph and the snapshot. Independently rendered a drawingVersion77 source and compared the actual paragraph text with stored `workingPictureText`: **exact equality**, including description, fraction label and unavailable-picture qualification. Known drawingVersion1 behavior remains intact; earlier snapshots are not rewritten.

## Mathematics, content and source admission

All six supplied sources match the reviewed references:1/2→2/4 and2/4→1/2 end at6/12;1/3→2/6 and2/6→1/3 at4/12;2/3→4/6 and4/6→2/3 at8/12. Denominators/whole dimensions and the representability invariant are enforced numerically, without current-case equality. Understood older1/2→sixths and whole2/2→thirds sources are admitted; half→thirds is retained as raw/unreadable work. Future drawing versions remain readable with explicit text/supplied-label fallback, never a substituted current picture.

Amount and naming use separate inputs/outcomes. A definite index3 in sixths against reference1/3, named numerator3, produces **amount false / naming true**. Actual browser feedback explains3/6 rather than marking the name wrong because2/6 was requested. Absent flag plus chosen zero remains unevaluated; explicit Start at zero creates an actual zero response. Unsure amount preserves the position and permits a definite naming response. Endpoint refusals do not reactivate an uncertain proposal. No flag position is inferred from an untouched draft.

The implementation adds the directed required-partition/actual-naming task, not a new equivalence parser or first simultaneous ribbon comparison. Existing same-half and kept/current behavior is acknowledged and left intact. Reference labels/partitions, accessible descriptions and answer-bearing help remain supplied practice; notes do not claim independent drawing, notation writing, explanation or arbitrary fraction generation.

## Tests and preservation

Executed final test files independently:

- `test/ribbon-matches-checks.mjs`: **6189 assertions passed**, covering756 admitted inputs, six both-fitting inputs and24 wrong-amount/right-name inputs.
- `test/ribbon-matches-integration-checks.mjs`: **132 assertions passed**.
- A separately written reviewer oracle compared the implementation against six literal endpoint/denominator pairs across all756 valid index/proposal/numerator tuples: **zero mismatches**.

Read and checked own-source restoration, frozen labels/descriptions/feedback, contradictory historical outcomes, raw/future/duplicate siblings, missing-current mutation refusal, exact retention notices, atomic unsafe-ID refusal and page/notes purity. Existing integration tests exercise actual old Fraction Trail cuts/flag/raw reading/check/kept work, Clock, Source Trail, Post/Bramble, suggestions, generic import/restore, explorer switching and save-off; unrelated roots remain equal.

In a separate synthetic browser context, prepared old same-half work with raw reading ` 2/4 ` and a kept snapshot, completed new work, followed the actual return link and verified the old current case/raw reading/kept reading persisted. No shared-app, old fraction-core or runtime-graph diff was introduced. Ordinary invitation/footer, Workshop page/notes/binding and local stylesheet/index registration are the actual seams.

## Actual art inspection

**Actually viewed** the rendered contact sheet `review70-art-contact.png`, showing all six fitting pairs plus absent, explicit zero, one and wrong-amount cases. Also viewed the actual390px Name screenshot `review70-phone.png`. These are reviewer-rendered local captures, not source art or a markup-only review.

For all six fitting pairs, counted the equal reference and working spaces and checked selected-prefix counts/endpoints. Both rows share the same left/right whole endpoints, width and height within one SVG coordinate frame. Halves/quarters and thirds/sixths differ in part sizes/counts while matching endpoints. The fixed reference stays unchanged when the working flag moves. The absent case draws no working flag; explicit zero draws a flag at the left boundary without a selected positive length; one fills the working whole and ends at1. Wrong amount remains visibly different. Outlines, cut lines, prefix lower edges and flag poles distinguish the amount without relying only on colour. No unequal-scale or false-whole depiction was found.

## Actual browser observations and limits

Used local headless Chrome against the preview with native controls. Checked wrong-amount/right-name behavior, navigation, default hidden working-fraction label, optional label/help fold closure, queued support status updates, old-work return and future fallback text equality. Label support makes the visible latest-check heading stale after the normal queued toggle event; opening support does not force an immediate rerender/reopen loop. The ordinary Name view does not print the full working fraction by default. Accessible/countable diagram evidence remains available as intended.

Measured prompt-top to first flag-action bottom on Make, and prompt-top to Check/keep bottom on Name:

| Width | Make first action | Name check action | Horizontal overflow |
| --- | --- | --- | --- |
|320px|621px|890px|none|
|390px|658px|845px|none|
|820px|173px|360px|none|
|1440px|175px|362px|none|

The naming turn requires scrolling on a phone; the spec makes no one-viewport promise. At inspected widths, visible Make controls met44px minimum height. Separately opened the390px global speech controls: no undersized controls or horizontal overflow found. Observed focus after native edits and closable support folds. The browser run reported no page errors. These are headless desktop-Chrome viewport probes, not physical Safari/iPad, human screen-reader or audible-quality validation. Root's broader browser/connection-offer checks and any other independent gate remain separately attributable.

No remaining required repair was found after the focused fallback fix. Preserve the stated partial source mapping and all earlier work; do not broaden this clearance into full equivalent-fractions attainment, primary-source asset reuse, independent reasoning or release approval.

## Focused follow-up: recorded support status and exact geometry

**Clearance retained; outstanding P1:0/P2:0.** Independently rechecked the subsequent bounded fixes without repeating the full specification/art review.

Claude identified a P2: restoring an already-recorded help/label fold after Check queued another toggle callback, which called `saveSupport` again and replaced the check-completion status. The builder's early return when that support code is already recorded prevents redundant save/status changes. In actual local Chrome, opened help, checked, waited for the restored fold's queued toggle and verified the status remained **“Matching and naming responses are kept separately.”** The help fold remained open. Repeated the sequence with an already-recorded label fold and verified the identical unchanged check status. First-time support recording and its stale-check behavior remain covered by the earlier probe; this guard changes no historical snapshots.

Reviewed the small multiply-before-divide art fold: reference/working prefix geometry now uses integer multiplication before division. Re-executed final checks: **6189 core assertions and168 integration assertions passed**. The added integration comparison checks actual cut-line coordinates against a12-tick interval oracle for all36 current source/index figures, in addition to shared whole geometry and absent/present flags. No whole dimensions, selected-amount semantics, source facts or saved outcomes changed. The previously viewed six fits/edge-state contact sheet remains the substantive visual review; this focused arithmetic fold does not justify a new art or learning claim.

## Root final verification and actual Claude conditions

Actual restricted local Claude read the implementation/spec/tests and offered local-draft approval conditional on one support-status repair, a successful final root browser pass and root inspection of the actual diagrams. It ran no tests and viewed no images. Root repaired the support helper to ignore already-recorded codes before saving/announcing; the focused independent follow-up above verifies that re-opening an existing help/label fold during render does not overwrite the Check action's status. The final root browser regression explicitly checks that status after queued native toggle processing. No later Claude execution is claimed. Root actually viewed phone Make/Name captures, separately from the independent all-six/edge-state art inspection. All conditional draft requirements are now root-verified.

Root also folded small arithmetic/verification advice: original SVG lengths now multiply before dividing; no geometry or mathematical scope changes. The integration suite checks actual rendered cut-line coordinates against a12-tick interval oracle for all36 current source/index figures, rather than relying only on declared row attributes. Future-picture browser regression compares the exact visible fallback paragraph to recorded workingPictureText. Historical records are not recomputed. Broader fraction algorithms, free explanation, a new parser or a new whole beyond the existing5/4/4/4 cases are not claimed.

Final root results: **104 source scripts pass;6,189 core/168 integration assertions;685 actual-browser assertions**. All six split/join cases, blank/zero/uncertain/wrong/fitting repairs, independent amount/naming outcomes, source/flag/numerator retention across actual Next/back, exact own-source future fallback, current/raw refusal and explicit Resume, native taps/focus, stale original events, closable help/reveal, reload and opened global voice controls are covered. Generic transfer/import/explorer/save-off passes. Actual old Fraction Trail cut/flag/whitespace-bearing raw reading/check/kept snapshot survives its invitation out/back. The broader integration fixture preserves Preparation Clock, Source Trail, pending adaptive Bramble and all other roots/suggestions. A real Café→Living incoming offer is the positive control; Workshop adds no new exposures.

At390px, ordinary question-top→Next heights are **Make838px**; question-top→Check heights are **Name789–845px** by partition size. The independent320px Name measurement is890px; its Make measurement above is to the first flag action, not the root's later Next action. Both measures are labelled distinctly. Complete pages/history need vertical scrolling; no one-viewport promise is made for long historical source text.320/390/820/1440 opened folds and visible global voice controls meet44px and no-horizontal-overflow checks.

Story-pack and deterministic atlas checks pass: **153 scoped references across84 topics**. The only new direct target is narrow diagrammatic Equivalent fractions practice. Full vendor/runtime sources and pins are unchanged. The strand map now acknowledges existing Fraction Trail whole/improper examples and kept/current comparisons, while marking broader comparison, mixed numbers and arithmetic missing. Held app/media/global-style/README/mobile paths remain unchanged. Local draft readiness is distinct from exact-head GitHub release clearance; no merge/deploy or hosted/physical-Safari/audible/screen-reader/learning-effect claim.
