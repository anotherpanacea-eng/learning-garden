# 422 · Angle facts become equations

Status: proposed finite addendum to [420](420-angle-chase.md) and [421](421-polygon-chase.md); independent specification and complete mathematics/copy/visual-plan review before implementation. Continues admitted LG-1 / LG-G1, operational custody1627.

## Purpose and boundary

Use the familiar Angle Chase to connect a geometric fact, an equation and substitution. A number t is different from an angle x: if x=(3t+20)°, t=30 gives x=110°, not30°. Children choose an equation with its geometric reason, solve for t, then find an angle. This is recognition of an offered equation, not independent equation writing or a proof grader.

Append two families of three cases (IDs21–26) to the existing21. All27 visit-local boards and both questions on every new board stay open. No new page, destination, module, callback, save schema, learner writer, parser, arbitrary expression engine, adaptive inference, prerequisite lock, grade, timer or reward. Old21 cases retain their source/keys/controls/copy. No replay limit beyond the finite authored catalogue; Start this sketch again retains its existing meaning. Negative/fractional solutions, brackets, identity/no-solution contrasts and broad algebra/geometry fluency remain outside this slice; the built Equality Desk already explores those broader equation contrasts.

Story: the workshop's paper plans include expressions in an old set of notes. Check the number and the angle separately. This serves49/120 Act III ch3 paper-plan reasoning and Act IV ch1 checking a written account; it does not re-break the town, certify a real structure, finish a chapter or trigger a film. M4-IV (substitution and linear equations), M5-III/IV and M7-III/IV are partial candidates, with supporting M1-II. Geometry and algebra are connected without claiming coverage of either strand.

Allowed files: this spec, roadmap, README, existing crossing-angles content/core/UI/CSS and its two existing source/browser suites. No Equality Desk code or records change. No upstream code, prose or art is imported. All examples/data are fictional and anonymous.

## Exact finite source and arithmetic

Source IDs `equationLine` and `equationOpposite`. Each new source has immutable positive integer coefficients in givens and authored keys `{t,x}`. Targets in order: t (scalar number), x (angle). Never calculate a key from a draft, another checked response or SVG dimensions. The current catalogue-length bounds already added in421 apply without a new state abstraction; no historical source validation uses this catalogue length.

| Family/cases | Source operands | Geometry/equation | Keys t,x |
| --- | --- | --- | --- |
|One line, one equation /21–23 |(m3,b20,k70);(m2,b15,k95);(m4,b12,k64) |x=(mt+b)°, k is the other angle on a line; mt+b+k=180 |30,110;35,85;26,116 |
|Opposite expressions /24–26 |(m3,b10,r1,s70);(m4,b8,r2,s52);(m5,b5,r2,s86) |x=(mt+b)°, e=(rt+s)°, x/e vertically opposite; mt+b=rt+s |30,100;22,96;27,140 |

Direct arithmetic: line t=(180−k−b)/m and x=mt+b; opposite t=(s−b)/(m−r) and x=mt+b=rt+s. Every m−r is positive/nonzero. All source angles are strictly between0° and180° and admit actual two-line/straight-line arrangements. t is dimensionless; the expressions give degree numbers, and the final ° belongs to the whole expression. Input accepts whole numbers0–360 here; this is an entry limit, not a claim that every equation has a nonnegative whole-number solution.

Separate examples, same family geometry and target order: line(m2,b10,k50)→t60,x130; opposite(m3,b12,r1,s100)→t44,x144. Each example's target values are disjoint from every practice target value in its own family. Example step0 exposes only its own source; step1 reveals t; step2 reveals x. Example x working uses the already revealed t. No practice equation, draft, check, pose, target or help leaks into its projection.

Family labels above. Variant labels use existing **{family label} · sketch {1|2|3}**. Exactly these coefficient packets, not unchecked generation, arbitrary expressions or a new catalogue framework.

## Teaching encounter and complete new copy

49 §5: teach how the angle relationship becomes an equation in the separate step-revealed example; contrast line versus opposite, a number versus an angle and solving versus substitution; offer hints/example/direct solution; use new coefficients and whole-sketch poses; return to the Equality Desk's same-operation reasoning. Both questions are open from the start; earlier typed/incorrect answers never become mathematical givens.

New-family facts, ordinary spacing in shipped copy:

- line: **A–O–C is straight. x is angle AOB and k is angle BOC.** Then separate visible expression paragraphs: **x = ({m}t + {b})°.** and **k = {k}°. t is a number, not an angle. These sketches have whole-number answers for t.**
- opposite: **A–O–C and B–O–D are straight lines crossing at O. x is angle AOB and e is angle COD.** Then **x = ({m}t + {b})°.** and **e = ({r}t + {s})°. t is a number, not an angle. These sketches have whole-number answers for t.**

Coefficient1 is written **t**, not1t; all other positive coefficients use e.g.3t. The notation means multiplication. After the expression paragraphs, both families add **In equations for t, we use the numbers of degrees. {m}t means {m} × t.** with the current m substituted in both positions. Paragraphs are normal16px wrapping HTML below the plot, not long floating expressions or scaled SVG text. Their own source values appear in Solve, description and Hear and in example step0 using the example's operands. They reveal no numeric key.

For t: **Find t. Choose an equation and its angle relationship.** For x keep **Find x. Which relationship explains this step?** These choices check an offered relationship/equation, not every possible original method. An adult can discuss another valid equation.

Reason cards (each complete label, no degree sign on t). The expressions below refer to degree numbers, so equations have180/360 rather than appending ° to t. Source values replace braces. Rotate offered triples by(caseIndex+targetIndex)%3 as before; stable within the sketch.

| Target | Offered IDs → complete card labels | Accepted |
| --- | --- | --- |
|line t |line: **{m}t + {b} + {k} = 180 · Angles on a straight line.**; opposite: **{m}t + {b} = {k} · Vertically opposite angles.**; point: **{m}t + {b} + {k} = 360 · Angles around a point.** |line |
|line x |substitute: **x = ({m}t + {b})° · Substitute t into the angle expression.**; line: **x + {k}° = 180° · Angles on a straight line.**; opposite: **x = {k}° · Vertically opposite angles.** |substitute,line |
|opposite t |opposite: **{m}t + {b} = {r}t + {s} · Vertically opposite angles.**; line: **({m}t + {b}) + ({r}t + {s}) = 180 · Angles on a straight line.**; point: **({m}t + {b}) + ({r}t + {s}) = 360 · Angles around a point.** |opposite |
|opposite x |substitute: **x = ({m}t + {b})° · Substitute t into the angle expression.**; opposite: **x = ({r}t + {s})° · Vertically opposite angles.**; line: **x + ({r}t + {s})° = 180° · Angles on a straight line.** |substitute,opposite |

Add rule ID substitute; default label **Substitute a number into the angle expression.** New case/target-specific card labels override generic rule labels in both the visible choices and selected-choice Hear. Old cards remain unchanged. No additional response field or equation-choice action: selecting a card uses the existing reason ID/answer field. Do not parse a label to derive behavior.

Accepted relation text and wrong-number calculation formula:

| Route | Relation text | Formula / predecessor |
| --- | --- | --- |
|line t/line |**The two marked angles share a straight line: {m}t + {b} + {k} = 180.** |same equation, no predecessor |
|line x/line |**x and k share the straight line A–O–C: x + {k}° = 180°.** |x + {k}° = 180°, no predecessor |
|new x/substitute |**Use t in the angle expression: x = ({m}t + {b})°.** |same symbolic equation, predecessor t |
|opposite t/opposite |**The marked angles are vertically opposite: {m}t + {b} = {r}t + {s}.** |same equation, no predecessor |
|opposite x/opposite |**x and e are vertically opposite: x = ({r}t + {s})°.** |same symbolic equation, predecessor t |

Reject missing geometric conditions, not a child's ability: line-family opposite **These two marked angles are beside each other, not vertically opposite.**; line-family point **The two marked angles fill a half turn, not a full turn around O.**; opposite-family line **The two marked angles are across the crossing, not beside each other on one straight line.**; opposite-family point **The two marked angles do not fill the whole turn around O.** Apply these in existing wrong-number/wrong-reason and right-number/wrong-reason branches without revealing t or x keys.

Hints: line t **Write the half-turn total. Take away the known corner and the added number, then undo the multiplication.**; opposite t **Set the opposite expressions equal. Subtract the same t term from both sides, then subtract the same constant and divide by the number of t’s left.**; both x **Use t in the expression, or use the other marked angle relationship. A typed t is still your draft.** No numeric key in a hint. Optional support never fills answers or checks.

Direct shown solution bodies (inside the existing shown-help wrapper; values come from source/keys, never response history):

- line t: **{m}t + {b} + {k} = 180. Subtract {k} and {b} from both sides, then divide both sides by {m}. t = (180 − {k} − {b}) ÷ {m} = {t}. t is a number. Use it in the expression to find angle x.** No intermediate x value is printed.
- opposite t: **{m}t + {b} = {r}t + {s}. Subtract {r}t and {b} from both sides, then divide both sides by {m−r}, which is not zero. t = ({s} − {b}) ÷ ({m} − {r}) = {t}. t is a number. Use it in the expression to find angle x.** No intermediate x value is printed.
- new x: **Using t = {t}, x = ({m} × {t} + {b})° = {x}°. This working shows t as help; it does not fill your answer for t.**

Show solution t exposes t only. Show solution x explicitly prints both quantities: extend420's finite provided-set map by new x→t, truthfully labeling both shown even if a draft is blank/wrong or later checked. It does not mark either answer entered, correct reasoning or independent. Example step1 uses its own direct-t body; example step2 **Using t = {t}, x = ({m} × {t} + {b})° = {x}°.** t was already revealed there. Do not print future example x in step1, including its prose/aria/Hear.

New completion caption: **This sketch has a checked or shown value for every question. Shown solutions are help. Pick another sketch or change one.** Same derived completion condition, with no stored completion flag/credit. New-family help-note wording uses **this quantity** instead of **this angle** when referencing another solution. Other notes/feedback follow420 except the following complete new-family overrides, keeping old21 copy unchanged:

- Blank t Check: **Enter a whole number for t, then check when you’re ready.**
- Hint-open note on either question: **A hint has been opened for this question.**
- First-question guidance: **Use the marked facts. You can choose the other question at any time.**
- Navigation: **Previous question**, **Next question**. Question-section aria: **Find a quantity**. Example band aria: **Example quantities**.
- t with no selected card: matching number **The number fits these facts. Choose an equation and its reason when you’re ready.**; wrong number **Check the number using the marked facts. Choose an equation and its reason when you’re ready.**
- The new x body’s provided-t sentence replaces420’s extra cross-angle working note; never append “another angle” to describe t. Its own shown-help wrapper remains unit-aware.

A blank-work → Show solution x case completes by provided values, but supplies no geometric reason for t. Verify the caption makes only the stated value claim; neither a t reason nor an entered response is invented. These new x reveals deliberately model substitution rather than420’s usual direct-givens route: the direct line route remains accepted, while shown substitution explicitly provides t as help.

Return invitation (plain text, no new link or callback): **In Math pathways, the Equality Desk explores why the same operation must be done to both sides. Leaving Copy Frame clears these visit-only sketches.** Use in new Solve/Hear, never example. No promise to retain visit work across that route change, no transferring a source, and no alteration of the child's waiting Equality Desk visit. Built241's exact rational arithmetic and equivalent transformations were studied rather than duplicating its saved exploration engine.

## Quantity units, state and projection

Source target t alone has scalar:true; old targets and new x are angles by default. This metadata belongs to the immutable catalogue, never answers or a saved source schema. Work fields/actions remain exactly420/421: draft/reason/checked/hint/exampleSeen/solution, target/rotation/exampleStep, case/view/boards. Strict source/reducer ownership, identity/noops, invalid-ID handling and resets apply to all27 boards. Numeric input remains0–3 ASCII digits; leading-zero draft stays exact, normalized checked numbers do not keep leading zeros.

Projection supplies unit:number|degrees for each target and active input, derived solely from scalar metadata. Every numeric label, shown wrapper, feedback number, input suffix and accessible label must respect it: **t = 30**, **x = 110°**. Never t=30°, an equation choice labelled an angle value, or a number described as degrees. Correct-number/wrong-or-missing-equation still exposes the truthful number label while leaving its relationship open, as420. Blank/unchecked branches remain separate. Above360: t **Use a whole number from 0 to 360 here.**; x uses old angle-range copy. Neither range copy supplies a key.

For new families only: selector/target-band label **Choose a quantity**, counter **Question {i} of 2**, scalar input label/aria **t, your number**; angle input retains **Angle x, your answer in degrees**. No degree suffix beside t's input. Equivalent native target buttons/select and scoped physical keyboard remain; all controls44px and text16px. Scalar target button aria: **Choose t** plus normalized value if visible and **shown** if provided; angle aria retains420. Native button bands retain their dimensions and three-line layout, using plain numeric text for t.

Only angle targets have sector leaders/connectors. t is a number, so its native button/example cell has no angle-sector leader, no fabricated t arc and no SVG connector/data coordinates. Selecting t highlights the actual angles used by its equation. The x button/connector still points to the true x sector. Bind/resize handles only the rendered angular connectors without touching registered controls/ancestors; scalar controls must remain live after resize. No new host callback or relaxation of stale-control guards.

Builders retain420's narrowed inputs: selected board/source only; examples family+step only. Old cases' output is invariant under new boards' data, new outputs under inactive boards/context, and examples under practice data. Hear reads source expression paragraphs and current question. New scalar draft wording: **Your number for t: {draft or blank}.** New angle wording: **Your angle x in degrees: {draft or blank}.** Read the actual selected equation-card label; with no card use **No equation chosen.** for t and **No reason chosen.** for x. Then read visible feedback/help/labels only. No current key from unopened support, hidden model fields or inactive work.

## Finite geometry and readable source labels

Reuse640×560 plot, center(320,280), uniform projection, rotation0…330 step30, scale52 and radius3 endpoints. Existing geometry labels, not measurements, supply incidence.

- Line: O(0,0), A at0°, B110°, C180°. Draw A–C and O–B only. x=∠AOB; k=∠BOC, both smaller counterclockwise sectors. A–O–C straight. Point O's label offset is80 drawing units in raw270° direction, rotating with the sketch, into the empty half-plane. Endpoint names initially use420's outward64-unit offsets. Both questions highlight x,k.
- Opposite: O(0,0), A0°, B110°, C180°, D290°. Draw A–C and B–D. x=∠AOB; e=∠COD. O's label offset80 in raw145° direction, rotating in unmarked BOC. Endpoints use outward64 initially. Both questions highlight x,e.

No right/parallel marks. Arc radii28, true vertex/ray/sweep and angular x connector at its actual bisector radius40. There is no sector named t. No floating source tags or source-tag leaders are rendered for these two families: neither a duplicate x tag nor a k/e tag. x is named by its target cell/button and connector. The facts identify k as BOC and e as COD using the actual point names. Only the ordinary point-name leaders remain in the plot. Full expressions and known k live in the normal paragraph facts below it; do not emit m/b/r/s as degree givens.

The new diagram description says **Angles: x (AOB), k (BOC). Questions: t (number), x (angle).** or **Angles: x (AOB), e (COD). Questions: t (number), x (angle).** It includes the currently visible source facts/quantity values without calling t a marked geometric angle. Geometry.givens is empty here; suppress the empty Given fragment as in421’s regular family. Existing numerical-given behavior remains on old cases. The B110° schematic keeps most angles qualitatively close to the data; line case22’s acute85° answer deliberately contrasts with the obtuse drawing. The stated facts, not measured appearance, control all keys.

All actual point-label boxes must avoid vertices/arcs, stay inside plot, avoid one another and remain unambiguous at320/820 and every pose. Adjust only noninteractive label anchors if actual measurements require it; never shrink text, distort geometry, mutate control styles/ancestors, or add broad placement infrastructure. Inspect each family's native image. Future label changes need actual clearance proof, not a source-coordinate golden. The inherited dotted target connector is a noninteractive UI pointer, not an extra geometric line or proof premise; it may cross rays, point-label leaders or the radius28 circle. Its endpoint must still be the true x bisector, and opaque controls must never cover the plot. No claim of a crossing-free target connector is made.

## Upstream and49 §8 crosswalk

Refreshed2026-11-07: Jane c681f6bf2f2adf2aa032f765983a4691774cfba5, LESSONS blob4d6add1b23c32ed6167c2358d763db05474e23d9; Marble04962c78ccb8bd52b236512d3362405bace98d2a, data/topics bloba1d3bf978d95f9240b7b43f1dd09a7f61541630a, dependencies blobc65f65131ac90d7f1cb0791aa35e1ed97e3e7c1f. Current remote metadata matches the retrieved full files. Actual target descriptions and incoming hard edges read. Jane's teaching-first/separate worked-example convention studied; its ages, mastery, medals, review gates and KV not adopted.182's equation opportunity adapted to the already-built420 loop, not its whole proposed Truss Yard.241 supplies the same-operation conceptual return; none of its stored sources are repurposed. No upstream code/content/art incorporated; attribution/license notices remain.

| Candidate topic | Incoming hard prerequisites | Bounded encounter / remaining gap |
| --- | --- | --- |
|mt_tedML_iu4Y · multi-step angle reasoning, including forming equations |mt_oqziWKry-L; mt_QDTO3GAgcq |420 supplies whole/line/opposite support; choose a geometric equation and solve/evaluate in six cases. Independent diagram reading and broad multistep proof remain missing. |
|mt_QhFEDyIwSO · algebraic solution of linear equations |mt_i9rJbuFO3p; mt_vHzVa3SURC; mt_VUQNveSYjQ |Offered-equation recognition, substitution and same-operation teaching; no independent equation composition, rational-coefficient coverage, negative/fractional solutions or full algebra attainment. |

No graph changes, complete-topic flags or age/level inference. The hard prerequisites are teaching opportunities, not admission gates. Full-course coverage and learning qualification remain unproven.

## Verification and delivery

Independent literal expected t/x keys, worked-example keys/disjointness and geometric existence; independently verify each displayed equation/card, every accepted route, every rejected missing condition, both direct solution routes and positivity/nonzero divisors. Distinguish dimensionless t from degree-valued x everywhere (UI/aria/Hear/examples/feedback/shown labels). Verify wrong t never becomes an angle's source, later x stays open, direct x support marks t shown without entering it, direct t support never exposes x, and only revealed example steps appear. Values equal to source numerals by coincidence are not raw-digit leaks.

Extend existing actual SVG readback across both families/all source variants/poses. Native geometry checks use one representative per new family at each width/pose plus completed examples and the widest checked/shown quantity labels; coefficient changes live below the plot and do not change the diagrams. All six cases have full math/unit interactions in the complete visit. Verify absence of source tags/source-tag leaders and scalar connector, true angular x connector and the facts-to-region mapping by actual point names. Exactly one target connector enters the x sector at its true bisector; no duplicate x label/leader. Check remaining native point labels and angular endpoint geometry at both widths/every pose without treating the dotted UI pointer as another mathematical line. New labels/equation cards fit320/820 with16px text/44px targets. Native t and x buttons/select/keypad perform real actions initially and after820→320→820. Extend all input/invalid-card/reducer/retention/restart/reset/source isolation tests to new t/x semantics while preserving old21 expected behavior. Do not convert old numeric-angle assertions into tautologies or compare output to copied implementation formulas.

Actual-app complete visit adds all six cases, equation-card recognition, correct t with wrong/missing equation, inverse/substitution help, wrong t then correct later x, separate examples, scalar/degree narration, and actual saved-state/Notes before/after preservation. Real route/owner/chooser/import/reset/reload must clear dirty new boards; retired/reparented/hide-unhide/scoped-key/Hear effects remain inert. Add purposeful revisit without pretending Equality Desk route changes preserve these local sketches. Run a focused new tail before the whole existing browser suite so test setup follows actual Previous/Next and returns from examples before choosing sketches. Retain strict error gates; capture request details when diagnosing a network failure rather than silently filtering it.

Affected suites while editing; once stable on current main, full source runner once and complete touched browser suite. Independent exact-head implementation clearance after repairs; ready/release own custody, merge commit, clean authorized-account tracked-only deployment, all hosted asset bytes and Home/new-family smoke. One canonical PR record linked once from roadmap. No new permanent verifier/manifest or repeated count ledger.
