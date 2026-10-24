# Three-row Ribbon Rows: specification review

An independent tools-disabled Claude context reviewed spec132 against the actual current Ribbon Rows core, content and UI. It confirmed all six authored lines, the winnable1,2,4 practice start, the equivalence of the new plan to matching for two rows, the ordered three-row replies and the21-move bound. Root independently enumerated all512 positions with a recursive game-tree solver before building.

The review requested first bundle-exposure timing so help opened after an ending is not described as available during play; an explicit practice-only exposure boundary; and matching-model practice construction. These are resolved in the spec and implementation: bundlesAt, separate familiarity/timing labels, in-memory-only practice exposure, and practiceStart from the frozen three-row source. Bounded folds did not change the rule or teaching scope. Implementation review must inspect these actual repairs before release.

Optional suggestions folded in include the middle broken-pair picture, a two-matching-rows counterexample, selected-mode preview and ignored hidden Row3 input. Two-row saves retain their own model, frame bounds and earlier wording. Jane and Marble refreshes are recorded in the spec; no additional source code, lesson prose or graph coverage is incorporated.

The reviewer ran no tests and did not verify browser behavior. Root-run model, actual-browser, transfer and screenshot checks are recorded on the release PR; this receipt does not assert implementation clearance or learning effectiveness.
