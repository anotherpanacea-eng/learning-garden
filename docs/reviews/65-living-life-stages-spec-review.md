# Living Garden life stages: independent specification and science-content review

**Verdict: BUILD-READY after the bounded P2 familiarity fold below. No unresolved P1/P2 findings.**

This separate reviewer context read AGENTS.md, CONTRIBUTING.md, spec65 and audit65; inspected the actual Living Garden adaptive/body routing, notes, bindings, saved-work validators, stable body-art renderer, transfer and host connection-panel seams; compared the full vendored taxonomy descriptions/evidence/dependencies; and directly read all four linked museum/RHS/UC Davis sources. The spec-review skill's six lenses were completed as focused passes in this context, without nested agents. No runtime65 or original stage art exists or was reviewed. Only this review document is authored here. The audit's separate fresh Jane/Marble byte comparisons were not independently repeated.

## Resolved P2: define familiarity across the eight questions

The initial spec named `seen` and `familiar` without specifying their identity. Audit65 explicitly required familiarity to persist when the same four-stage case is revisited in the other chart direction. Copying Body Clues' task-source-ID convention would incorrectly mark larva-before unfamiliar after egg-next, although both use the same chart and biological link.

The root author folded the following narrow resolution into spec65 before build; this reviewer read the actual revised text: all eight tasks share frozen `source.chartId:"small-white-life-stages"`, while `source.id` identifies the individual task. `seen` stores chart IDs. A new visit's boolean records whether this named-species chart was explicitly started before, and the UI says **Familiar chart**, without claiming this particular question/answer was tried. Old seen/familiar records stay recorded. This resolves the finding without a second familiarity system or registry. No material redesign or full repeat review is needed.

## Primary science and the full eight-task table

The species is consistently Small White / Cabbage White, *Pieris rapae*. The museum describes eggs hatching into feeding larvae, larvae pupating, adults emerging, and adults producing eggs for another generation. This supports developmental continuity followed by a parent/offspring boundary. It does not support an adult returning to its own egg. The spec correctly excludes the brochure's rearing, collecting, killing, release and timing instructions. [Bohart Museum brochure, pages 1–2](https://bohart.ucdavis.edu/sites/g/files/dgvnsk4616/files/inline-files/Cabbage%20White%20brochure_0.pdf)

The single yellow egg under a cabbage leaf, pale-green finely haired larva and above-ground vertical pupation distinguish the intended example from the Large White's clusters and patterned larvae. These are suitable drawing requirements, without turning colour/markings into an identification assessment. [RHS cabbage caterpillars](https://www.rhs.org.uk/biodiversity/cabbage-caterpillars)

The named host example and species label agree with the museum activity and UC Davis account. Cabbage is an example, not a universal caterpillar food; UC Davis' local flight calendar is not a general developmental schedule. [Bohart Museum activity](https://bohart.ucdavis.edu/diy-cabbage-white-life-cycle), [UC Davis species account](https://butterfly.ucdavis.edu/butterfly/pieris/rapae)

The brochure's extracted PDF text was read directly. The web PDF screenshot endpoint failed, so this review does not claim visual inspection of its illustrated panels. No source illustration is incorporated, and the required independent review of new original art remains outstanding until that art exists.

An independent directed-adjacency table verifies every task. “Before” changes which endpoint is requested; it never changes the direction of development shown in the proposed pair.

| Task | Reference → requested response | Forward pair to display | Correct meaning |
| --- | --- | --- | --- |
| egg-next | egg → larva | egg → larva | Same individual |
| larva-next | larva → pupa | larva → pupa | Same individual |
| pupa-next | pupa → adult | pupa → adult | Same individual |
| adult-next | adult → egg | adult → egg | Offspring / another generation |
| larva-before | larva → egg | egg → larva | Same individual |
| pupa-before | pupa → larva | larva → pupa | Same individual |
| adult-before | adult → pupa | pupa → adult | Same individual |
| egg-before | egg → adult | adult → egg | Offspring / another generation |

Each biological link appears twice, once in each lookup direction. In egg-before, the adult is the offspring egg's parent-generation adult, not an earlier adult stage of that egg's own life. The question explicitly says parent and new generation, and both boundary tasks require the offspring meaning. The dashed/labelled boundary is therefore substantive teaching content, not decorative styling.

The “same individual” language describes the supplied possible successful story. It does not claim the four drawings track a real observed specimen, guarantee survival, or make identity inferable from resemblance alone. The pupa is the changing organism's stage, not a container into which a replacement butterfly arrives. The proposed story, full link records and readable overview provide that identity contract explicitly.

## Separate judgements: exhaustive probe and hostile examples

A temporary independent oracle enumerated **192 response combinations**: eight tasks × six neighbour inputs (four stages, blank, unsure) × four meaning inputs (same, offspring, blank, unsure). It yielded:

| Neighbour match / meaning match | Combinations |
| --- | --- |
| null / null | 64 |
| false / null | 96 |
| true / null | 16 |
| true / true | 8 |
| true / false | 8 |

This validates the proposed assessment table, not future runtime behavior. No combination permits a meaning judgement when the neighbour is wrong, blank or uncertain. Three concrete repairs expose common mistakes:

- For adult-before, choosing pupa + offspring yields true/false. Its displayed forward pair is pupa → adult. Changing the neighbour to larva keeps the original meaning selection but changes the outcome to false/null; it must not retain a false biology assessment of the wrong proposed pair. Returning to pupa assesses the retained meaning again.
- For egg-before, adult + same yields true/false. The feedback explains offspring and does not show egg → adult as the interpreted biological link. Adult + unsure yields true/null, preserving a correct chart relation with an unobserved meaning response.
- A completely blank kept check is null/null and remains valid work. Changing inspection from egg to chrysalis or switching Inspect/Connect does not make its recorded inputs stale. Selecting a neighbour, changing meaning or requesting new support does make an older check earlier work until another explicit check.

An incorrect proposal may display a biologically unsupported pair, including a self-pair. The explicit **Our proposed forward link** label and feedback must keep it a learner proposal rather than an asserted fact. The spec supplies that distinction. In particular, a wrong proposed adult → pupa pair must not receive a generic “same individual changing” confirmation.

## Six substantive review lenses

**Completeness — clean after the familiarity fold; blocking=false.** All stage text/cues, eight exact questions, directed link meanings, nullable assessment, repair rules, support, source snapshots, capacities and unavailable-work behavior are specified. The first four-stage pack is complete; original drawings and tests are future deliverables, not missing pre-build artifacts. No additional ordering engine or free-text interpretation is needed.

**Dependency/integration — clean; blocking=false.** `adaptivePage` already dispatches Body Clues before habitat-round handling, and `adaptiveNotes`/`bindAdaptive` compose its notes/bindings. This provides a real route for the sibling stage module without editing held app paths or allowing a pending habitat parcel to lock it. Generic transfer preserves optional roots. The existing host really appends its connection panel and may register shown incoming number pairs on Living Garden routes; the spec's explicit exception matches `app.mjs` and `connectionPairsShown`. A synthetic offered connection must be tested on both old and new routes.

**Scope/overlap — clean; blocking=false.** Adult Body Clues compares anatomy and the habitat activities compare conditions. Neither teaches continuity across radically changed stages. Chart-neighbour choice plus generation interpretation is a useful small next relationship, with understandable single-step lookups before broader cycles. The Paris ordering compiler is three-item machinery, so adapting native picture choices avoids an unrelated generalisation. Eight tasks revisit four links rather than claiming eight independent biology discoveries.

**Project commitments — clean; blocking=false.** The most dangerous edge is treating stage recognition or a supplied interpretation as evidence of independent explanation or observation. Separate nullable judgements, support/familiarity records, original teaching diagrams, supplied facts and no mastery aggregate defend that boundary. A view change is only a view change. No specimen, child writing, photo, location, private voice recording, remote model or upload is required. Open cases and check/keep of blank work preserve the established parent-guided approach.

**Mechanical validatability — clean; blocking=false.** Directed endpoint construction and conditional assessment have deterministic oracles. Frozen sources and recorded outcomes are intentionally admitted by shape; this establishes readability, not truth of imported outcomes. New checks use their own admitted source rather than current catalog expectations. A future drawing version must degrade the picture alone while preserving understood text, choices and recorded checks. The existing Body validator rejects unsupported drawing versions at source level, so it must not be copied unchanged for this explicit stage requirement. No background migration or new preservation framework is needed.

**Adversarial review — clean after the bounded P2; blocking=false.** The proposed distinctions handle reversed lookup across the generation boundary, wrong pairs, retained second choices, historical contradictory results, changed expected values/text, future drawings, unsafe allocation IDs, duplicate/raw siblings and oversized readable histories. At fifteen readable visits, Start removes four oldest readable visits before appending one; merely viewing does not trim. The exact count must be disclosed while raw siblings remain. Support changes stale a check, and old detached native events cannot mark the new visit. These are concrete implementation gates, not reasons for additional state machinery.

## Source mapping, phone feasibility and remaining gates

The full vendored target has three evidence strands: ordering the stages, explaining continuity, and retelling/drawing after reading or observation. Supplied neighbour/meaning cards offer narrower practice with the first two, without establishing independently composed explanations or the third. Its only hard ancestor is What is a minibeast?, whose real-world hunts/magnifier evidence is outside this pack. Both nodes are absent from the runtime subset as stated. The broader complete-metamorphosis target requires stage functions and two insect examples; excluding it is correct. No prerequisite lock or runtime graph expansion follows.

The phone proposal is feasible: one reference/question, four labelled picture choices in two columns, an uncertain option, a compact proposed pair and three meaning choices. Large stage shapes can remain recognisable without detailed leg counts or markings being assessed. Captions and accessible frozen text must carry meaning that a small thumbnail cannot. The full source passage, chooser and older trails belong behind native folds or another page; repeating a full four-stage chart and all historical source pictures above the question would defeat this intended turn size. The actual build must still demonstrate readable pictures, local focus, 44px controls and no overflow rather than inferring usability from a grid rule.

One implementation trap deserves a targeted check: rotating options by the ordinal case number can accidentally keep the correct answer in the same position as expected neighbours advance around the cycle. Verify the actual eight answer positions vary; deterministic rotation alone does not establish the spec's stated result. No randomisation service is needed.

Proceed with the reviewed original diagrams and implementation, then independent art/science and implementation reviews and root browser verification. Preserve both directions' forward-arrow orientation, explicit offspring labels, blank/wrong/correct repair, future-picture text/answer access, source/check independence, chart familiarity, view-independent relevance, closable help and originating-visit event scope. Exercise actual reload/transfer/explorer/save-off and unrelated habitat/body/parcel/Café/math/suggestion preservation with synthetic data. This specification review establishes no runtime correctness, physical iPad/Safari or audible quality, human screen-reader result, independent biological competence or learning gain. No merge or deployment is cleared.

## Bounded pre-change UX follow-up: separate the two response turns

**Cleared for the proposed small specification/UI fold; no required design repair.** This is a narrow follow-up to the actual reproduced layout, not a repeat six-lens review or runtime clearance. The reviewer actually viewed both supplied captures, the synthetic local phone and desktop images `life-390.png` and `life-1440.png`. The phone capture visibly stacks the reference/question, four picture choices, proposed pair, meaning options and Check/keep across a long active card. The desktop capture also puts the interpretation below the stage-choice area. Geometry checks alone did not establish a manageable current turn.

Add `meaning` to the existing page enum, giving Inspect / Stage / Meaning / Kept trail (longer descriptive labels are also acceptable when they fit). Stage/`connect` retains the reference picture, exact `source.question`, four picture choices and unsure option, followed by **Next: read our forward link**. Meaning retains that current chart question, the proposed pair in biological forward direction, the separate meaning question/options and the existing explicit Check/keep. Both pages use the same existing neighbour/meaning fields. Next is navigation only: it does not check an answer, clear a selection or allocate another visit.

Every page and Next remain open with blank, unsure or wrong choices; Meaning's Check/keep remains available with any response combination. With no chosen neighbour, its empty proposed-link card must remain empty rather than supplying an answer. Existing `connect` values remain valid. Page/view changes still do not stale a check, while input/support/source changes retain their existing relevance rules. No other state, assessment, biology, art, support, history, capacity or host behavior changes are needed.

Short labels or a wrapping two-by-two tab group can accommodate the fourth native tab on narrow screens while preserving 44px targets; do not force long labels into a horizontally overflowing row. Root must verify the revised phone and desktop captures, current question/context on both turns, focus after Next/tab changes, all nullable repair combinations and preserved saved work. The proposed pagination is proportionate to the observed scrolling problem and changes no learning target or evidence claim. No merge/deployment or implementation clearance follows from this bounded review.
