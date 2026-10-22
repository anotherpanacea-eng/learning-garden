# Fair Test Bench: implementation review and verification

This local build follows [spec56](../specs/56-fair-test-bench.md), its [source audit](../source-audits/56-fair-test-bench.md) and the [independent specification review](56-fair-test-spec-review.md). It is stacked on reviewed `build/reader-instructions` head `13001ea0d75bbf0e45e231c94cdbd6e9bea0e4b5`; the other runtime branches are not composed or deployed here.

## Independent implementation review

A separate reviewer context inspected the actual content/core/UI, Workshop dispatch/binding/notes, stylesheet integration and tests. It exercised reverse-order reveals and forks for all72 question/setup pairs, changed historical measurements, raw contradictory siblings, render purity and escaped notes. It found no P1/P2 and one P3: typing after keeping a note cleared the saved bookmark but left the button, history and status saying it was kept. The fix updates those three indicators locally without rendering or moving the textarea. The independent reviewer rechecked exact leading newline, line endings/trailing spaces, one save and no render/focus callbacks. Root browser checks confirmed the actual input behavior.

The reviewer also applied the maintenance-cost check: this is a small optional activity with narrow existing integration seams, no new storage registry or recovery framework. No unrelated refactor or removal was needed. This review is independent model review; **no Claude review or exact-head Claude clearance is claimed**.

## Checks performed

- All76 `test/*.mjs` scripts pass. New core checks:3,321 assertions, including all72 mission/A/B plans, both sides' fixed source values, first-missing reveal, replay, fork preservation, prediction timing, capacity refusal and explicit eviction, source/number bounds, unrelated data, unreadable siblings and future envelopes.
- New integration checks:33 assertions using actual explorer storage, restore/import, old Workshop/Café/Post/Loft state, save-off, escaped prose/raw work, three page renders and notes without old experiments. Supported historical values are never recomputed against current model numbers. Equal, touching and overlapping saved ranges are explicit fixtures.
- Isolated Chrome:109 assertions across desktop1280×900, touch-enabled tablet820×1180 and phone390×844 with reduced motion. Tested new entry, configuration choices, confounds/focused comparisons, missing/unbalanced/full evidence, replay, prediction timing, preserved fork, exact text/reload, bookmark-edit indicators and retained textarea focus, support, notes, future-root isolation and continuing the original pending cart. Visible controls meet44px; no horizontal overflow. Root inspected tablet trial and phone plan screenshots. Twelve additional browser assertions verify capacity refusal/explicit eviction, raw siblings, keyboard editing and narration routing with a speech API stub (no audibility claim).
- Current Jane/Marble source refresh and six-node description/evidence/incoming-edge comparison passed. No source pin or license changes; no new upstream code/prose/assets. The unchanged graph still has1,590 topics /3,221 edges /54 domains. Three scoped local references bring the atlas to133 references across69 topics; none declares broad attainment.
- Story-pack checks, atlas generation/check,343 changed-document file links, whitespace and staged public-content inspection passed before publication. Only generic original story examples and synthetic observations are used.

## Limits and next step

These distances are finite authored examples, not measured physical data. Original claims/notes are ungraded; the app cannot establish physical experimental competence, causal proof, independent measuring or learning gains. Existing games remain open. Actual Safari/iPad touch, human screen-reader usability and audible narration were not verified. The new buttons route through the existing local-only narration mechanism; no voice-quality claim is made.

The candidate is suitable for a **draft PR**, pending actual Claude review and the existing merge/release gates. Composed-branch testing and deployment remain separate. No merge or production change occurred. A later slice can transfer the comparison pattern into a separately reviewed physical investigation or plant-growth pack; it must keep real observations distinct from these examples.
