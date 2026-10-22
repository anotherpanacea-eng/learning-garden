# Balance Stall: independent specification and content review

**Verdict: BUILD-READY. No P1/P2 findings.**

This separate reviewer context read the workspace/project instructions, CONTRIBUTING.md, spec64 and audit64; inspected the actual Workshop routing/notes/binding seam, Coin Counter and Cartographer saved-work/action patterns, generic transfer and host rendering; and compared the full vendored Marble descriptions, evidence and incoming dependencies. The six spec-review lenses below were completed as focused passes in this reviewer context. No Balance Stall runtime exists or was reviewed. This review changes only this document. Audit64's fresh upstream download and byte-comparison claims were not independently repeated.

## Complete cases and intermediate mathematics

All eight starting arrangements are equal. Independent calculation gives the following complete progressions. A paired removal is one explicit removal of one actual loose unit from each pan, so each arrow below is a separate tap rather than a hidden multi-unit transformation.

| Case | Starting totals | Successive paired removals relevant to the question |
| --- | --- | --- |
| Two ways to arrange five | 3+2 = 4+1 = 5 units | 3+1 = 4+0; then 3+0 = 3+0. Both remain equal; neither side contains a mystery parcel. |
| Seven on each side | 5+2 = 3+4 = 7 units | 5+1 = 3+3; then 5+0 = 3+2. Both remain equal despite their group arrangements. |
| Folded leaf parcel | 5+2 = 7 units | parcel+1 = 6; then parcel = 5. |
| Paper-star parcel | 3+1 = 4 units | parcel = 3. |
| Ribbon parcel | 7+3 = 10 units | parcel+2 = 9; parcel+1 = 8; then parcel = 7. |
| Tiny card parcel | 1+2 = 3 units | parcel+1 = 2; then parcel = 1. |
| Story parcel on the right | 11 = 9+2 units | 10 = parcel+1; then 9 = parcel. |
| Puppet parcel | 12+1 = 13 units | parcel = 12. |

The known cases can continue to zero units on both pans while remaining level. The parcel cases stop permitting paired removal when the parcel side has no loose unit, even though that pan still has positive mass. That boundary is essential: it distinguishes removing an available weight from removing the parcel or subtracting an absent object. A parcel of mass one is still a parcel with a fixed whole mass, rather than a unit weight merely because it is one pictured object.

An independent temporary arithmetic oracle enumerated **66,150** combinations: every pair of loose totals 0–20, all six actions, and all 25 model placements (no parcel, or a left/right parcel with mass 1–12). There are **62,000 enabled changes** and **4,150 refusals**. For every enabled action, the signed difference changes by precisely the change on the left minus the change on the right. All 20,000 enabled paired actions preserve the difference: 688 begin equal and 19,312 begin unequal. A separate enumeration of all **231** valid two-group arrays checked the specified last-group addition and last-nonempty-group removal, with 440 successful changes. These calculations validate the design's arithmetic, not a future implementation.

Concrete counterexamples distinguish the observations the spec must keep separate:

- Leaf starts parcel+2 = 7. Removing left alone gives parcel+1 < 7, with totals 6 and 7. Removing both next gives parcel < 6, with totals 5 and 6. The parcel is alone, but the balance is unequal; paired removal did not repair it. Adding left once, or removing right once, restores equality through a visible compensating action.
- A correct proposal of five at the untouched leaf start is value-match=true, isolated=false and paired-removal-while-level=false. It must remain recordable.
- After two paired removals from the leaf start, a blank proposal is value-match=null, isolated=true and paired-removal-while-level=true. Isolation supplies an opportunity to infer mass without inventing a submitted answer.
- Adding both once and then removing both returns to the original arrangement. Paired-action flags describe actions actually tried, without proving how a later proposal was inferred. Reset clears those current flags while retained checks preserve them.
- From the right-parcel start, removing right alone makes the left heavier; the left pan must be lower. The corresponding left-parcel experiment makes the right heavier. Position and text must agree in both directions.
- An imported source with parcel+0 versus zero loose units is representable and unequal. Paired removal is refused even though the parcel has positive mass. At loose totals 20 and 19, paired addition is likewise refused without changing the right to 20. Group [3,0] removes to [2,0], while [3,1] removes to [3,0].

The spec explicitly handles all of these cases. Including concrete paired removal is a defensible bounded departure from PR47: the learner sees every available-object removal and an unchanged relation. It does not require general algebra, negative quantities, parcel division or an abstract subtraction rule to be taught first. Paired addition and one-sided experiments remain open, so this does not prescribe a single successful button sequence.

## Six review lenses

**Completeness — clean; blocking=false.** The first pack, model units, parcel identity, live bounds, six atomic actions, optional proposal, reset, support, frozen checks, admissions, capacities and failure cases are specified. “Isolated on a level balance” has an operational meaning: a mystery source, no loose units on the parcel pan, and equal total masses. Known cases have no parcel-isolation achievement. The builder can choose field spelling and original explanatory copy without deciding a missing mathematical rule. No permanent action log or provenance mechanism is needed.

**Dependency/integration — clean; blocking=false.** `workshopPage`, `bindWorkshop` and `workshopNotes` provide actual slug dispatch, binding and notes composition. Generic transfer restores and preserves arbitrary bounded state rather than requiring a new destination registry for storage; round validation remains the balance module's responsibility. Existing Coin/Map helpers sometimes allocate through an `active()` fallback, and old help listeners can attribute an event to whichever round is current. Those are patterns to adapt, not requirements to copy: spec64 explicitly requires Start-only allocation and connected-origin event binding. No hosted model, remote storage, identity system or physics engine is required. Existing host connection-panel behavior must be observed during browser verification; the new module need not create or suppress it.

**Scope/overlap — clean; blocking=false.** Missing-number questions already exist, but they do not enact two-sided changes. Equal Groups preserves object quantity and Coin Counter preserves currency value; neither represents the whole mass of one unknown object. The new capability is narrow and useful: change the two represented quantities and observe their relation. Existing routes, evidence roots, Café stock and graph pin remain separate. The full two-step/general-equation topics are appropriately excluded.

**Project commitments — clean; blocking=false.** The most material risk is converting supplied feedback or a correct guessed mass into evidence of an independently demonstrated method. The schema and kept-check contract defend this through separate proposal-match, isolation, descriptive action, familiarity and support fields, with no solved/mastered aggregate. Explanations are supplied mathematical support. Fixed model mass, optional help, all cases open, no learner prose, synthetic fixtures and no new transmission also fit the project's stated boundaries. These are implementation obligations; this document does not establish their eventual enforcement.

**Mechanical validatability — clean; blocking=false.** Arithmetic, availability, atomic refusal, proposal independence, isolation, flags, relevance, safe allocation and preservation all admit deterministic tests. Historical source and outcome admission is deliberately shape-based: it establishes readability, not that an imported answer, feedback or relation is true. The spec is explicit that later load must not recompute those records. A fresh live check must instead use the admitted frozen source and current apparatus. Educational gain, physical measuring, independent explanation, real-device audio and physical iPad/Safari quality are honestly outside what those tests establish.

**Adversarial review — clean; blocking=false.** Unequal imported starts, broken equality followed by paired actions, correct answers without method, method without a proposal, unsafe IDs, duplicate/raw siblings, oversized readable histories, changed frozen wording/mass, reset and support changes are covered. Recorded contradictory outcomes must stay visible as recorded outcomes rather than becoming live feedback. A prior check whose apparatus matches but whose support or descriptive flags differ is earlier work. No hostile case found here requires a new feature, state machine or spec-level redesign.

## Source fit and representation gates

The independently traversed hard dependency union has **nine unique nodes**, matching audit64. The equality target's full evidence includes recognizing a false equation and rejecting “the answer comes next”; the two known arrangements and the unequal one-sided contrasts support that connection without claiming an independently composed explanation. The unknown target includes unknown positions and subtraction forms beyond this pack; a single whole-parcel-plus-units task is therefore a partial reference, not coverage of all its evidence. Supplied reading, counting pictures and controls do not establish numeral writing, digit formation or physical enactment. The audit states these exceptions accurately. No new runtime graph closure or access restriction is warranted.

The actual build must keep three visual contracts together: visible individual units, visible grouping, and visible attachment to the correct pan. A compact schematic with full-size external expressions can meet the phone constraint; shrinking a large illustration until the unit marks or group boundaries become unreadable cannot. The heavier pan must be lower with its represented contents, and an unequal apparatus must not retain an unqualified equals sign in its current expression. Parcel labels must remain distinct from unit counts; an unrevealed parcel need not display its authored numerical mass to render its relation. Six native step controls can fit a compact labelled group without adding drag mechanics, a second selection mode or hidden action steps. Exact geometry and legibility remain browser gates rather than facts established by this specification review.

Proceed to implementation, then independent implementation review and root browser verification. In particular, test both pan directions; all eight cases; a changed proposal that never changes tilt; empty/20-unit refusals; local focus at a newly disabled action; closed help after support; old queued toggle/audio events after switching visits; actual transfer/reload/explorer/save-off behavior; and compact phone/tablet/desktop layouts with 44px controls and no overflow. Successful local checks will establish implementation behavior within those tested limits, not learning gain, mastery or physical-device quality. No merge or deployment is cleared by this review.
