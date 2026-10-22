# Same Amount, New Cuts: independent specification/content review

**Verdict: BUILD-READY. Outstanding P1:0. P2:0.** All six current relationships and the separate amount/naming judgements are sound. The proposed directed extension adds enough beyond existing Fraction Trail practice. The author resolved the one admission ambiguity; focused recheck accepted below.

Reviewed the full [spec70](../specs/70-same-amount-new-cuts.md), [audit70](../source-audits/70-same-amount-new-cuts.md), `dist/fraction-trail-content.mjs`, `fraction-trail-core.mjs`, `fraction-trail-art.mjs`, `fraction-trail-ui.mjs`, Workshop/shared-app seams and spec52's existing keep/current comparison. The root authored this specification; this reviewer previously authored only its source audit and has not built the new capability. Used the spec-review skill through six focused sequential passes. The independent bounded arithmetic probe below evaluates the specification, not an implementation.

## Resolved admission finding and focused recheck

Initial **P2**: requiring different denominators that each divide12 did not ensure a supplied reference was representable in the working partition. Reference1/2 with working thirds was admitted despite having no matching index.

**Resolved.** The author added `(referenceNumerator * workingDenominator) % referenceDenominator === 0` as a numeric source invariant. Impossible historical goals remain exact raw/unreadable work without snapping, repair or regrading. This is a mathematical-format invariant, not a current-case catalogue gate: an older1/2→sixths source remains admissible, and a whole2/2→thirds source has matching index3. The six current cases satisfy the invariant. No full review rerun is needed for this bounded fold.

## Six focused lenses

**1. Completeness — clean after focused fold; blocking=false.** Six complete supplied sources, exact target indices, reference/working roles, index/proposal/numerator states, native transitions, optional reveal, three pages, retention caps, source/string bounds, picture dispatch, recorded snapshots and separate outcomes are specified. No parser, cut editor or algorithm instruction is missing: the working partition is intentionally supplied. The representability fold resolves the broader historical-source admission question.

**2. Dependency/integration — clean; blocking=false.** Shared app identifies `#cafe/fractions` and calls `renderFractionTrail(state)` without forwarding a child slug. Workshop accepts a slug and already composes sibling page/notes/bindings. Therefore `#workshop/fractions` plus an ordinary Fraction Trail invitation/return is a real integration seam without shared-app routing changes. Old `validSource` is tied to catalogue constants, cut edits clear old flags and old saved outcome admission recomputes current logic; preserving that root unchanged is load-bearing. The separate `ribbonMatches` source model avoids reinterpreting old cut/reading/kept records. Runtime graph actually has87 nodes, matching the spec; no repin/graph expansion is required.

**3. Scope/overlap — accepted; blocking=false.** Existing same-half already accepts numeric equivalence, accepts different partitions and compares kept/current ribbons simultaneously. The spec acknowledges all of this and claims neither a new parser nor a first introduction to equivalent fractions. New value is a directed, supplied-reference task requiring a different specified partition, particularly1/3↔2/6 and2/3↔4/6 in both directions, plus naming the actual constructed flag independently of matching the requested amount. This is a useful intermediate authored lesson, not a new general manipulation mechanic. Given that bounded claim, it is sufficient to proceed. Supplying partitions narrows evidence further: it observes endpoint reconstruction/counting in provided units, not independently constructing equal cuts. No extra division/whole/improper-fraction scope is needed.

**4. Project commitments / mathematical firewall — clean; blocking=false.** The greatest risk is passing an equivalent fixed label or intended answer while the actual working flag represents something else. The spec mechanically separates amount equality from actual-index naming and forbids automatic working-numerator labels before optional teaching. Reference label/partition are deliberately supplied, so neither reference decoding nor independent drawing is claimed. Same length, width, origin, scale and one shared figure defend the equal-whole comparison. Accessible descriptions remain available rather than concealed to manufacture independence. Support, familiarity and answer-bearing feedback remain distinguishable from fresh independent evidence. No stock, timing, private data, free-prose grading or rewards are introduced.

**5. Mechanical validatability — clean after focused fold; blocking=false.** Denominators divide12, so endpoint/cross-product checks and all flag transitions are exact integers. No tolerance, parser, fraction reduction or external model is needed. `amountMatch` is determined by a definite proposal and own source relationship; `namingMatch` by an existing actual index and definite numerator. Historical outcome admission is intentionally shape/range-based, not a current-catalog truth check. Known drawingVersion1 derives geometry from admitted numeric quantities while preserving supplied reference text; future versions explicitly fall back to source text/numeric labels with supplied-label qualification. Saved labels/descriptions/outcomes remain frozen. Final visual consistency and accessible wording require independent art/browser review; numeric correctness alone does not establish them.

**6. Adversarial — clean after focused fold; blocking=false.** An absent flag with selected zero cannot be named correctly; Use without a flag and outward endpoint movement refuse without activating a response. Retained geometry with unsure amount can still receive a correct name. Moving away/back is actual flag input, not an untouched-zero proposal. Different own historical IDs/labels/expected numbers cannot be replaced with today's case; future pictures cannot silently borrow a current illustration. Support changes make a check stale, page navigation does not, and detached events must not change a later visit. The representability counterexample is now excluded by the numeric source invariant, preserving its raw record.

## Independent finite arithmetic probe

Enumerated all six sources, every bounded index plus absent, proposal null/flag/unsure with flag allowed only when an index exists, and every numerator0..workingDenominator plus blank/unsure. This includes type-admitted historical response combinations, even where the present UI does not generate every combination. There are **756 valid input tuples**, not a guessed Cartesian product:

| Case | Working denominator | Matching index / endpoint | Valid tuples |
| --- | --- | --- | --- |
| half-quarters |4|2 /6|119|
| quarters-half |2|1 /6|55|
| third-sixths |6|2 /4|207|
| thirds-sixths |6|4 /8|207|
| sixths-third |3|1 /4|84|
| sixths-thirds |3|2 /8|84|

Used independent rational equality `index * referenceDenominator == referenceNumerator * workingDenominator`; naming compares the chosen numerator directly with the actual index. Combined distribution:

| amountMatch / namingMatch | Tuples |
| --- | --- |
| null / null |204|
| null / false |268|
| null / true |60|
| false / null |48|
| false / false |110|
| false / true |24|
| true / null |12|
| true / false |24|
| true / true |6|

There is exactly one fully fitting input per source, and24 wrong-amount/right-name inputs across the pack. Examples that must remain distinct:

- Reference1/3, working sixths, index3, numerator3, definite flag: **false/true**. The flag is3/6, accurately named, but does not match1/3.
- Reference2/3, working sixths, index4, numerator2, definite flag: **true/false**. The amount matches, but the actual flag is4/6 rather than2/6.
- Reference1/3, working sixths, index2, numerator2, unsure proposal: **null/true**. Accurate naming does not turn uncertainty into an amount proposal.
- No flag, numerator0, null proposal: **null/null**. Numerator selection alone cannot create an actual zero endpoint.
- A historical whole reference with numerator=denominator can fit the final working endpoint. This is valid restoration without claiming new whole-fraction coverage.

These probes establish internal mathematical consistency of the specified current cases and outcomes. They do not test persistence, actions, visual art or any future implementation.

## Visual and delivery boundaries

Equal-width/length reference and working ribbons within one figure keep area/length and phone scale consistent. All fitting endpoints, zero/one/blank states, equal partition spacing and labels require actual independent image inspection after build. A half/quarter pair must not be manufactured by independently stretching two diagrams. Default Name view must show honest parts/flag evidence while leaving the complete working label to the optional supplied-label action; accessible text/future fallback qualification remains explicit.

Frozen source/input/labels/descriptions and raw sibling preservation are specified. Existing Fraction Trail work, Café guest/stock and connected games need actual out/back probes, not a claim based solely on links. Current review gives no art, browser, accessibility, physical-device, learning-effect, hosted-CI or release clearance. Proceed to build and independent implementation review within this bounded specification.
