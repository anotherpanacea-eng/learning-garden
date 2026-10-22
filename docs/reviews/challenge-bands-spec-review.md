# Challenge starting choices: independent specification review

Proposal: [challenge-bands.md](../specs/proposed/challenge-bands.md).

## Review and resolution

The initial proposal at `455e1916ae4b7b27112b3d6258cd49801e96417b` received six distinct sequential review passes: completeness, dependencies, scope overlap, project commitments, mechanical validity and adversarial cases. The review found a blocking legacy-choice preservation contradiction: a newly absent provenance map could not distinguish a deliberate prior control selection from a materialized default. Other gaps included missing mappings, Two Windows having no reusable saved form preference, and Living Garden lifecycle decisions.

The revision at `61d0a3156f9cb85cc65cd42de4474fccdd879c67` narrowed the first increment to explicit opt-in Café amounts, preserved existing choices by default, supplied a finite mapping and acceptance cases, and deferred the other controls. A separate read-only Claude review confirmed those resolutions and raised one P2: follow mode could show the stored range selected while allocating a different effective range.

The reviewed revision at **`5c8a03aab8e18648a431ac6442def1b4505edaf1`** specifies the same read-only effective-range function for allocation, selected controls and their explanation. An actual range-button click establishes a local override even when that button was already selected. It also clarifies the existing normalized `garden` boundary and preserves the connected-order cursor.

## Independent follow-up receipt

Reviewer: Claude, in a separate read-only context from the author. The reviewer read the complete revised proposal and checked Café core/UI, learning connections and explorer storage. **Verdict: Approve; no P1 or P2 findings.** No tests or runtime execution were claimed by the reviewer.

The optional P3 suggestion was to confirm that a local range-button redraw recomputes the effective range; acceptance check 7 already covers selected state and local override behavior.

This clears the bounded specification for implementation. It does not establish runtime correctness, learner suitability, device behavior or release readiness. No runtime code is included in this proposal revision. Implementation still needs the upstream refresh, focused source/browser checks and independent implementation review described in the specification and project instructions.
