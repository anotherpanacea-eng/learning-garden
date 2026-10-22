# Preparation Clock: independent specification and content review

**Verdict: BUILD-READY. No P1/P2 findings or required pre-build repairs.** No optional scope additions are recommended.

This separate reviewer context completed the spec-review skill's six distinct lenses as focused sequential passes. It read project instructions, CONTRIBUTING.md, spec68/audit68; inspected actual Workshop routing/notes/binding, Post Office page/invitation and waiting-delivery seams, existing optional-root validation/allocation and generic transfer; compared the full vendored target/ancestor descriptions, evidence and dependencies; and directly read the primary teaching references below. Only this review document is authored here. No Preparation Clock runtime, rendered original art, browser result or implementation test was inspected. The audit's fresh Jane/Marble downloads and refreshed upstream wording/edge comparisons were not independently repeated.

## Complete cases and primary mathematical meaning

All four cases are coherent same-morning cards before noon. Their questions ask for two different representation actions, not an unknown elapsed interval:

| Case | Fixed reading / correct option position | Supplied departure goal | Supplied advance | Start → goal hour/minute angles |
| --- | --- | --- | --- | --- |
| labels | 9:00 / second | 9:30 | 30 minutes | 270°/0° → 285°/180° |
| maps | 9:30 / first | 10:00 | 30 minutes | 285°/180° → 300°/0° |
| books | 10:00 / third | 11:00 | 60 minutes | 300°/0° → 330°/0° |
| notes | 10:00 / second | 10:30 | 30 minutes | 300°/0° → 315°/180° |

The correct reading is in the three options exactly once in every case. Books and notes deliberately share a preparation picture but change the goal, so setting success cannot be inferred from the reading response. Their neutral titles do not announce the fixed reading. Default story/question wording must continue to describe the job rather than print that answer; printed options are choices, and the departure label is a separate supplied goal on Set.

Common Core supports matching hour/half-hour analogue and digital representations. NCETM distinguishes the two clock scales and explains a full minute-hand turn as one hour and a half turn as 30 minutes. Oak specifically explains that the halfway hour hand means half past the preceding hour, including the risk of reading half past nine as half past ten. These support the proposed original geometry; none establishes that this interface produces attainment. [Common Core 1.MD.B.3](https://www.thecorestandards.org/Math/Content/1/MD/B/3/), [NCETM Time](https://www.ncetm.org.uk/classroom-resources/cp-year-2-unit-11-time/), [Oak half-hour lesson](https://www.thenational.academy/teachers/programmes/maths-primary-ks1/units/time-sequencing-events-and-telling-the-time-to-the-hour-and-half-hour/lessons/tell-the-time-to-the-half-hour-using-the-hour-hand)

Coupling both hands is a sound scaffold and a deliberate evidence limit. The software prevents impossible hand arrangements; reaching a goal with labelled steps is not independently positioning two hands or drawing them. Nor does a supplied one/two-step teaching example establish calculation of an unknown duration. The source mapping and feedback must preserve these distinctions.

## Every face position and transition

A temporary independent oracle derived hand angles from minutes since 12, rather than from the specification's slot equations, and compared all **24 positions**. For each row below the minute hand is 0° at :00 and 180° at :30; angles run clockwise from 12.

| Hour labels | :00 slot / hour-hand angle | :30 slot / hour-hand angle |
| --- | --- | --- |
| 12 | 0 / 0° | 1 / 15° |
| 1 | 2 / 30° | 3 / 45° |
| 2 | 4 / 60° | 5 / 75° |
| 3 | 6 / 90° | 7 / 105° |
| 4 | 8 / 120° | 9 / 135° |
| 5 | 10 / 150° | 11 / 165° |
| 6 | 12 / 180° | 13 / 195° |
| 7 | 14 / 210° | 15 / 225° |
| 8 | 16 / 240° | 17 / 255° |
| 9 | 18 / 270° | 19 / 285° |
| 10 | 20 / 300° | 21 / 315° |
| 11 | 22 / 330° | 23 / 345° |

All **96** ±30/±60-minute transitions agree with modulo-720-minute face arithmetic and are undone by the inverse step. Examples: 11:30 +30 → 12:00, 12:00 −30 → 11:30, and 11:30 +60 → 12:30. These are face positions; a static return to the top is not the minute hand travelling backwards. No direction animation or changing calendar is required. Twenty-four slots represent twelve hours, not twenty-four hours or a day, and a face alone cannot identify which cycle or morning/afternoon.

Digital-label checks distinguish mathematical identity from frozen wording: 9:30 and historical 09:30 denote slot19; 12:00 denotes slot0 and 12:30 slot1. Labels such as 00:30, 13:00, 9:3, 9:60, 9.30 and 24:00 are outside the stated format. A source cannot label slot19 as 09:00 or change slotMinutes/hourMinutes/cycleSlots away from 30/60/24 while claiming version1. Equivalent labels do not permit duplicate option slots: 9:30 and 09:30 cannot occupy two of the three distinct options.

## Independent responses and hostile examples

The temporary oracle enumerated all **1,440 combinations**: four sources × five reading states ×24 positions × three setting-choice states. A fitting definite reading and fitting explicitly proposed setting occur in four combinations; wrong reading with fitting setting occurs in eight. Both judgement axes also admit null independently. The oracle's complete outcome counts are:

| Reading match / setting match | Combinations |
| --- | --- |
| null / null | 384 |
| null / false | 184 |
| null / true | 8 |
| false / null | 384 |
| false / false | 184 |
| false / true | 8 |
| true / null | 192 |
| true / false | 92 |
| true / true | 4 |

Concrete repairs expose the important failure modes:

- In maps, choose the wrong 10:00 reading and move the model to the requested 10:00 departure. That is false/true; the fixed preparation picture remains 9:30. Rendering the editable model in place of the fixed Read picture would change the question and must not happen.
- In labels, leave the reading blank, step to 9:30, then choose unsure for setting. The position stays 9:30 but settingMatch becomes null. Explicitly Use this clock restores a definite fitting proposal without changing the reading.
- On a blank visit, opening Set and returning to Read changes neither answer. An untouched position is not a setting response. Conversely, a successful move away and back is an actual proposed clock input even when its final position equals the initial preparation time; no route/strategy is inferred.
- An understood historical source can have preparation equal to departure. It still begins with settingChoice=null; explicit unchanged Use this clock can then fit. Historical positions/options need not equal a current card.
- A historical source with options at slots0/1/2 may admit a definite reading of slot1. A globally valid slot19 reading is not one of that source's answers and must remain unreadable raw work rather than silently becoming a new option. Apply the same own-source requirement to checks and rounds.
- A retained contradictory recorded result is displayed as recorded, while a fresh check uses its own saved source. Changing a model position or setting choice makes an earlier result stale; changing only page does not.

These are design-level probes, not tests of a future implementation.

## Six focused review lenses

**Completeness — clean; blocking=false.** The finite cards/options, fixed versus editable figures, source goals, four coupled controls, activation/unsure rules, independent judgements, feedback, source invariants and unavailable-picture behavior are specified. The label/description snapshots make explicit what was supplied at a check. No elapsed-time state, independent-hand editor, move log or clock service is needed. Mathematical/source options are constrained without enforcing current catalog membership.

**Dependency/integration — clean; blocking=false.** Workshop slug dispatch, notes and binding already compose sibling tools. `postOfficePage(state,slug)` supplies an ordinary link area alongside existing map/story invitations; a plain clock invitation needs no new Post route or shared-app exception. Pending delivery state, route cursor, packed parcel and Bramble encounter have their own roots/fields and can remain intact. Generic transfer retains optional roots and invokes destination notes; the new source/round readers can use the established preservation pattern without a registry. The existing host connection panel targets Living/Café/Post, not Workshop, matching the proposed positive-control comparison.

**Scope/overlap — clean; blocking=false.** Compass turns do not coordinate clock hands, and Post route steps, Archive chronology and fixed audio slots do not supply time-of-day representation. Reading a fixed face and setting a coupled one are useful reciprocal demands. The same-morning story is context rather than an executable courier schedule. Existing jobs, stock, money, suggestions and pending puzzles receive no new timing semantics.

**Project commitments — clean; blocking=false.** The greatest risk is treating a fitting software-coordinated model, supplied digital label or answer-bearing feedback as independent clock reading/drawing. Separate response fields, explicit support and the stated limits defend against that inference. Accessible spatial descriptions remain available rather than being hidden to manufacture independence. Digital reveal and feedback provide teaching; later success remains supported/repeated practice. Case familiarity is labelled only as case visited before, so a new case with an already-seen 10:00 picture is not called independent novelty. No personal schedule, timer, private prose or upload is required.

**Mechanical validatability — clean; blocking=false.** Source digital identity, own-option membership, geometry, transitions, activation, assessments, relevance, allocation and preservation admit deterministic tests. Source units are fixed mathematical invariants; historical outcome/label/feedback admission is intentionally bounded shape rather than a regrading pass. A future drawing version can retain fixed source description and supplied numeric model text without dispatching a different illustration or losing understood responses. Reading/setting outcomes do not establish physical measurement, elapsed cycles, decoding, handwriting or strategy.

**Adversarial review — clean; blocking=false.** The spec handles half-hour midpoint misconceptions, 12-wrap, unchanged explicit proposals, wrong reading/right model, future descriptions, leading-zero source labels, old options/positions, contradictory outcomes, raw/duplicate siblings and unsafe numeric IDs. Failed Start must not evict or consume an ID. At fifteen readable rounds it removes four oldest readable rounds after exact disclosure; merely viewing does not trim. Connected-origin guards cover stale actions, help/reveal toggles and narration after switching visits. No uncovered hostile case requires redesign.

## Mapping, phone usability and remaining gates

The vendored combined hard union has eight nodes, with individual target closures of seven and three. The direct units topic also requires24hours/day, and the misleadingly titled measurement ancestor actually concerns measuring hours/minutes/seconds. Neither is full coverage here. The audit's refreshed clock wording and hard→soft edge are explicitly described as source drift, not vendor equality or an absent edge. Retaining the pins and adding only two narrow annotated references is appropriate. No arbitrary-minute, duration, physical-measurement or independent-drawing mapping is justified.

The three-page plan is feasible because Read has one fixed figure with three choices, and Set has one model, four step controls and two explicit setting responses. Keep the supplied goal near that model, retain a clear “proposed” label when it is wrong, and put digital reveal/help/history after the active turn. A default digital model readout, title, caption or narration that simply announces the fixed Read answer would undermine the intended matching prompt; the specified spatial descriptions, explicit reveal and answer-bearing feedback are honest supplied alternatives. Their visibility and request scope need actual verification. Phone turn length must be measured from current question through action, including long admitted wording and opened voice/support controls; 44px targets alone do not prove a short turn.

Proceed to original geometry/art and implementation, then independent actual art inspection, separate implementation review and root browser verification. Check all24 rendered faces, both wrap directions, fixed-versus-model separation, all four card repairs, source-specific option labels, explicit unchanged proposals, closable help/reveal, originating-visit events and generic transfer/reload/explorer/save-off. Follow the actual Post invitation out and back with a synthetic waiting delivery and Bramble puzzle, and compare the real Living Garden incoming offer with the exposure-free clock route. This review establishes no runtime, physical Safari/iPad, human screen-reader, audible-quality, independent reading/drawing/duration competence, learning-effect or hosted result. No merge or deployment is cleared.
