# 421 · Polygon Chase

Status: proposed addendum to [420](420-angle-chase.md), awaiting independent specification and complete finite mathematics/copy/visual-plan review before code. Continues admitted LG-1 / LG-G1, operational custody1625.

## Purpose and scope

Extend the existing **Angle Chase / Find angles** page with two families of three sketches. Reuse420's teaching, explicit number-and-reason checks, open targets, examples, optional hints/solutions, visit retention, scoped keyboard, touch controls, narration, structural guards and source isolation. No new destination, page, module, callback, persistent schema, learner writer or coverage claim. Original15 cases retain their IDs and behavior; append cases15–20, for21 visit-local boards. Replace only Chase catalogue bounds with catalogue length; never alter historical saved-source validation. Another sketch cycles through the current catalogue; restarting affects just the chosen board. There is no upgrade/migration for this ephemeral work.

The workshop's paper sketches now include polygon shade frames. This is an Act III ch3 paper-plan investigation and an Act IV ch1 checking-notes return under [49](49-six-act-curriculum.md) and [120](120-keeper-of-the-ways.md), not real construction advice, a newly broken town, act completion or an ending-film trigger. M5-III/IV, M7-III/IV and supporting M1-II are partial authoring candidates. Equations, independent proofs, measurement, fractional-angle polygons, nonconvex/crossed polygons, converse proofs and broad fluency remain missing.

Only this spec, roadmap, README, the existing crossing-angles content/core/UI/CSS and existing source/browser suites may change. No asset production or new framework is needed. All facts, names and observations are fictional; no household material.

## Teaching encounter and return

49 §5: teach the whole and the equal-sharing condition in the regular example; contrast regular sharing with unequal quadrilateral corners and inside with adjacent outside; offer optional hints, a different stepped example and a shown solution; apply the reasoning to a new side count/known-angle triple and orientation; return to the already built polygon fan.

Additional invitation on the two new families only: **For the triangle fan, choose Triangle corners → Polygon frames → Free frame → Split the frame. Your sketch stays here during this visit.** The four controls already exist. This is guidance to open existing pages, never automatic navigation or a replacement of their waiting settings. Existing420 return invitation remains on old families. Examples retain their example-only projection and notice; invitation is included in Solve/Hear, not a hidden example answer channel.

Teach explicitly:

- A polygon's inside total is `(n − 2) × 180°`; the fan in418 explains the triangles.
- Regular means all sides and all inside angles equal. Equal inside angles let us share the total equally to find one corner; regularity guarantees equal angles but is not necessary.
- An irregular quadrilateral still has360° inside, but its unequal known corners cannot be replaced by four equal shares.
- One inside angle and its adjacent positive outside turn total180°. One positive outside turn at every corner of a convex polygon totals360°. Those corners are different points; this is not the angles-around-one-point rule.
- `n` counts sides; it is not an angle and must never appear as `n = 5°`. Individual unknowns remain whole-number degrees0–360. Totals greater than360 may appear in worked arithmetic, never as an input to a new sum question.
- Given facts, checked numeric labels, shown help and unchecked drafts retain420's distinctions. The drawing supplies incidence, not measurements.

## Exact finite sources

Use source family IDs `regular` and `quadrilateral`. Keep authored case order stable. Every new board has targets x,y in that order; both always open.

| Cases | Givens | x inside | y adjacent outside |
| --- | --- | --- | --- |
|15–17 · Equal corners | n5; n6; n8 |108;120;135 |72;60;45 |
|18–20 · Unequal corners |(a80,b110,c95);(a95,b100,c85);(a105,b80,c70) |75;80;105 |105;100;75 |

Regular givens contain `{n}`; x=`(n−2)×180/n`, y=`360/n`. Visible family/variant label includes **Regular polygon · {n} sides**; facts define regular and name x/y. n goes in count/facts text, not the angle `geometry.givens` array. Display no degree symbol on a side count. It is present in Solve and example step0, accessible description and Hear. A regular polygon is convex here.

Quadrilateral givens contain `{a,b,c}` in degrees; x=`360−a−b−c`, y=`180−x=a+b+c−180`. Every inside angle is strictly between0° and180°; each given triple permits a real convex quadrilateral. The third case's a=x is a numerical coincidence between adjacent corners A and D; do not infer any equal-angle property. No regular, rectangle, right-angle or parallel premise.

Independent examples use the same family geometry and target order but their own facts/keys: regular n10→x144,y36; quadrilateral(a85,b115,c65)→x95,y85. Each example's target values are disjoint from all practice target values in that family. Example step0 shows only its givens; step1 reveals x; step2 reveals y. Reopening and native Previous/Next retain420 behavior.

## Relationships, hints and complete arithmetic routes

Add these rule IDs/labels, with ordinary spacing in shipped text:

- regular: **A regular polygon's equal corners share its inside angle total.**
- equalOutside: **Equal positive outside turns of a regular polygon share 360°.**
- quad: **The four inside corners of a quadrilateral total 360°.**
- quadOutside: **Four positive outside turns of a convex quadrilateral total 360°.**

Keep existing line/point/opposite labels. Rotate each offered triple by `(caseIndex + targetIndex) % 3`, as420; selection order stays fixed within that sketch.

| Family/target | Offered IDs | Accepted IDs and relation/formula used in feedback |
| --- | --- | --- |
|regular x |regular,line,point |regular: inside total `(n−2)×180°` divided by n equal corners; line: `x+y=180°`, predecessor y |
|regular y |line,equalOutside,opposite |line: `x+y=180°`, predecessor x; equalOutside: n equal positive turns total360°, `y=360°/n` |
|quadrilateral x |quad,regular,line |quad: `a+b+c+x=360°`; line: `x+y=180°`, predecessor y |
|quadrilateral y |line,quadOutside,equalOutside |line: `x+y=180°`, predecessor x; quadOutside: `(180°−a)+(180°−b)+(180°−c)+y=360°` |

Accepted reverse relations remain accepted even if the predecessor answer has not been entered: a child may mentally derive it. Never use its draft as a given. With a wrong number and an accepted line relationship,420's feedback names the source equation and the value used for the predecessor, without asserting that the draft is a fact. Correct number plus wrong/missing reason retains the correct numeric label and leaves its reason open. Every blank/range/unchecked/help branch inherits420 unchanged.

Specific wrong-reason explanations:

- regular x/point: **x and y fill a half turn at A. The polygon's corners are different points, not parts of one turn around A.**
- regular y/opposite: **x and y are beside each other at A, not across a crossing.**
- quadrilateral x/regular: **The marked inside corners are unequal. Share equally only when the corners are equal; here subtract the known corners.**
- quadrilateral y/equalOutside: **The known inside corners are not all equal, so the outside turns are not all equal either. The four positive outside turns still total 360°, but four equal shares do not find y.**

Hints, no numeric key: regular x **Count n − 2 triangles for the inside total. Why may these corners share it equally?**; regular y **Use the straight line at A, or share one full turn among the equal outside turns.**; quadrilateral x **The four inside corners total360°. Which three are already known?**; quadrilateral y **Use the straight line at D, or first find the outside turn beside each known inside corner.**

Show this solution provides only the chosen target's value using givens, never the other unknown:

- regular x: `x = (n−2) ×180° ÷n = T° ÷n = x°`, substituting the current n, T and key. Explain equal inside corners and n−2 triangles.
- regular y: `y =360° ÷n = y°`, substituting n/key; explain equal positive outside turns, one at each corner.
- quadrilateral x: `x =360° −a° −b° −c° = x°`, substituting givens/key; explain four inside corners.
- quadrilateral y: `y =360° −(180°−a°) −(180°−b°) −(180°−c°) = y°`, substituting givens/key; explain the four positive outside turns.

Retain420's shown-help wrapper and flags. No new cross-target provided-set mapping is needed because these routes do not print another target's value. Numerals may coincide with a given or another target by coincidence; inspect roles rather than raw digit bans. Example x uses its direct inside route; example y uses `y=180°−x°` after x is revealed. This teaches both routes without exposing unrevealed example keys. No current key appears in unopened hint/solution, DOM metadata or Hear.

## Final child-copy templates for new families

Existing420 wrapper, feedback branches and help notes are reused verbatim. Substitute only immutable source values for braces; ordinary spacing in prose and expressions is required. These strings complete the reviewable material, rather than asking the builder to invent teaching copy.

Family labels: **Equal corners** (`regular`) and **Unequal corners** (`quadrilateral`). Regular variant labels: **Regular polygon · {n} sides**. Quadrilateral variant labels: **Unequal corners · sketch {1|2|3}**. The separate example has the family label and existing **A different worked sketch** heading, with no practice variant label. Its facts use its own source.

Regular facts: **This convex regular polygon has {n} sides. Regular means all sides and all inside corners are equal. n counts sides, not degrees. C–A–D is straight, with A between C and D. x is the inside angle BAC; y is the adjacent outside turn DAB. Equal angles let us share the inside total equally; equal sides alone would not.** Quadrilateral facts: **ABCD is a convex quadrilateral with unequal known inside corners: a is BAD, b is CBA and c is DCB. C–D–E is straight, with D between C and E. x is the inside angle ADC; y is the adjacent outside turn EDA. No equal sides, equal corners, right corners or parallel sides are given.**

Relationship text and formula (symbolic; wrong-number feedback uses the formula without hidden numeric keys):

| Route | Relation text | Formula |
| --- | --- | --- |
|regular x/regular |The inside total is (n − 2) × 180°. The equal inside corners share it: x = (n − 2) × 180° ÷ n. |x = (n − 2) × 180° ÷ n |
|regular x/line and y/line |C–A–D is straight: x + y = 180°. |x + y = 180° |
|regular y/equalOutside |One positive outside turn at each corner totals 360°. These n turns are equal: y = 360° ÷ n. |y = 360° ÷ n |
|quadrilateral x/quad |The four inside corners of ABCD total 360°: a + b + c + x = 360°. |a + b + c + x = 360° |
|quadrilateral x/line and y/line |C–D–E is straight: x + y = 180°. |x + y = 180° |
|quadrilateral y/quadOutside |One positive outside turn at each corner totals 360°: (180° − a) + (180° − b) + (180° − c) + y = 360°. |(180° − a) + (180° − b) + (180° − c) + y = 360° |

Direct shown-solution and example-x working bodies, enclosed by420's existing shown-help wrapper only in Solve:

- regular x: **x = ({n} − 2) × 180° ÷ {n} = {T}° ÷ {n} = {x}°. A fan has n − 2 triangles, each with 180°. The inside corners are equal, so share the total equally.**
- regular y: **y = 360° ÷ {n} = {y}°. One positive outside turn at each corner totals 360°. The turns are equal because the inside corners are equal. These corners are different points, not parts of one turn around A.**
- quadrilateral x: **x = 360° − {a}° − {b}° − {c}° = {x}°. Subtract the three known inside corners from the four-corner total.**
- quadrilateral y: **y = 360° − (180° − {a}°) − (180° − {b}°) − (180° − {c}°) = {y}°. Each known inside corner has an adjacent outside turn. The four positive outside turns total 360°. These corners are different points, not parts of one turn around D.**

Example-y working: regular **y = 180° − {x}° = {y}°. C–A–D is straight.**; quadrilateral **y = 180° − {x}° = {y}°. C–D–E is straight.** The revealed example x is the only predecessor here. The quadrilateral example's a=y=85° is a numerical coincidence, not a shape property. The total/triangle explanation lives in the direct regular-x working and fan return, the count/regularity explanation in regular facts, and the outside-total versus one-point contrast in wrong-reason feedback/direct outside working. The “Teach explicitly” list prescribes these concrete surfaces, not another hidden lecture page.

## Exact schematic geometry and visual interaction

Reuse420's640×560 plot, uniform rotation/inverted screen-y, target band, noninteractive label arrangement, CSS-only native-control placement, actual-sector connectors, touch/keyboard/live guards and example layout. New geometry derives only from immutable selected-family givens. No expected answers from SVG measurements. All new cases use scale46 drawing units per raw unit.

### Regular polygon

Raw center(0,0); n vertices radius3 at angles `90° +360°i/n` in counterclockwise order. The complete n-edge closed outline is drawn, including unnamed vertices. Label only A=vertex0, B=vertex1, C=vertex(n−1). D=A+0.75 unit(A−C), beyond A on the incoming side. Thus C–A–D is straight, A between C/D. Draw the extension A–D separately. Internal vertex names used for line construction do not become visible point labels.

x=∠BAC: at A, ray AB to AC counterclockwise, the inside corner. y=∠DAB: AD to AB counterclockwise, the adjacent positive outside turn. At the fixed pose these sweeps equal the mathematical regular inside/outside values, but no measurement is displayed or used as a key. Emphasize both sectors when either target is selected. No right squares or parallel arrows. The explicit regular premise supplies equality; decorative ticks are unnecessary.

Visible point labels A/B/C/D use420's outward64 drawing-unit offsets initially. n is in facts text, not a long floating angle tag. Geometry.givens is empty for this family; narration/description must handle that without a meaningless “Given .” fragment. All n edges, extension, labels and both target connectors remain visible at all12 whole-sketch poses.

### Irregular convex quadrilateral

Raw A(0,0), B(4,0), C(3,3), D(−1,2), counterclockwise. E=D+0.75 unit(D−C), beyond D. Center(1.5,1.25). Closed edges AB,BC,CD,DA plus extension D–E. C–D–E is straight with D between C/E. a=∠BAD (AB→AD), b=∠CBA (BC→BA), c=∠DCB (CD→CB), x=∠ADC (DA→DC), y=∠EDA (DE→DA), all counterclockwise smaller sectors. Schematic incidence is exact although its numerical angles are not the given variant's measurements.

Selected sector sets: x highlights a,b,c,x; y highlights a,b,c,x,y, supporting either offered route. No equality/right/parallel marks. Point D's label starts at a fixed raw100° direction,80 drawing units from D, rotating with the whole drawing into the unmarked half-plane. Other labels start64 units outward as420. Given tags a/b/c at(100,65),(320,65),(540,65), ordinary16px text. Show only those three known-angle tags, never unknown values before checking/reveal.

For both families, adjust noninteractive label offsets if actual native measurements show an overlap; preserve mathematical incidence and scale. Final labels must avoid their vertices and all actual angle arcs, remain inside the plot, and stay readable on320px and820px screens at every pose. They may have leaders. No reduced text or moving native buttons/ancestors after host registration. Browser verification samples actual SVG arc paths and HTML boxes as420. The existing initial+resized native controls must perform actions. All no-write, detached/reparented/hide-unhide/key/Hear and stale-context guards remain binding.

## Refreshed upstream and49 §8 prerequisite crosswalk

Refreshed2026-11-07: Jane `c681f6bf2f2adf2aa032f765983a4691774cfba5`, LESSONS blob `4d6add1b23c32ed6167c2358d763db05474e23d9`; Marble `04962c78ccb8bd52b236512d3362405bace98d2a`, data/topics blob `a1d3bf978d95f9240b7b43f1dd09a7f61541630a`, dependencies blob `c65f65131ac90d7f1cb0791aa35e1ed97e3e7c1f`. Current remote metadata matches retrieved full files. Actual target descriptions/evidence and incoming hard edges were read. Jane's teach-before-practice and separate optional worked teaching were studied, not imported. Its gates, age routing, mastery, medals and data system are not adopted. Marble is a map of candidate lessons, not validation of assessment or attainment. No upstream code/prose/assets are copied; existing attribution remains.

| Actual topic | Incoming hard prerequisite IDs | Encounter and gap |
| --- | --- | --- |
|mt_cdMlC7EpTJ · unknown triangle/quadrilateral/regular-polygon angles |mt_e4V6hvcuEJ; mt_liIW336odh; mt_oqziWKry-L |Stated regions, regular/irregular property contrast and finite angle sums; notation breadth, independent recognition/measurement and full shape properties remain missing. |
|mt_J03RFlVdas · derive/use polygon sums and regular inside/outside angles |mt_cdMlC7EpTJ; mt_tedML_iu4Y |418 fan is the teaching return; finite n5/6/8 calculations and n10 example; independent general derivation and fractional n7/11 remain missing. |
|mt_tedML_iu4Y · multi-step point/line/opposite reasoning |mt_oqziWKry-L; mt_QDTO3GAgcq |420 supplies named-whole/line support, extended by inside/outside chains; equations and broad independent multistep reasoning remain missing. |

Counts/multiplication/division/subtraction receive worked support without asserting all arithmetic prerequisites complete. Soft algebra notation dependency mt_KwdjWEmMNo for the formula is a future bridge, not silently a hard gate. No graph edge, curriculum coverage flag, placement, adaptive inference or prerequisite lock is added.

## Verification and delivery

Independent arithmetic expectations cover all six cases and both examples, positive convex-angle existence, sum/equal-sharing conditions, every accepted and rejected relation, numeric/reason/support distinctions and example disjointness. Old15 cases/keys/reasons stay intact. Case bounds/actions/catalogue length, per-board retention/restart and old-page/source invariance extend to the appended boards. Verify side counts never have degree units, correct x/y sectors/extension incidence/all n edges, empty angle-given handling, three quadrilateral tags, no invented marks, whole transformations and actual labels/connectors at both screen sizes/all poses. Don’t duplicate implementation formulas as an oracle or add source-copy/count goldens.

Extend the actual-app browser's complete visit with all six appended variants, reverse accepted routes, wrong regular/equal-outside choices, blank/wrong/missing reason, wrong predecessor then later target, new separate stepped examples, hint/reveal without filling drafts, retained old/new boards and pages, original controls after resize, Hear and real fan return. Reuse existing whole-visit in-memory/storage/Notes before/after comparisons, scoped keyboard, inactive context and route/owner/chooser/import/reset/reload tests. No saving or reset path may bypass these new boards. Add focused actual label/arc clearance for all new geometry/poses at320/820; do not repeat whole journeys per width. Inspect native diagrams for each family. Chromium is not physical iPad/Safari/audio/VoiceOver or learning evidence.

Run affected suites while editing, then full source runner once on stable integration with current main and the complete touched browser suite. Independent Claude spec clearance before implementation; independent exact-head implementation clearance after findings resolved. Ready/release, merge commit, clean authorized-account tracked-dist deployment, all hosted asset bytes and Home/touched smoke. One canonical PR receipt linked from roadmap. No film is commissioned for one paper-sketch completion; wider story celebrations remain separate.
