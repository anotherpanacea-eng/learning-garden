# Balance Stall: source and overlap audit

Author source preparation for spec64, 2026-10-22. This is not independent specification, content or implementation clearance. Review must precede build. This audit changes no runtime, specification, test, existing learner work or taxonomy pin. All example quantities and future fixtures are synthetic; no personal information is used.

## Fresh source check

Fresh public GitHub `commits/HEAD` reads and exact-commit file downloads returned Jane [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81) and Marble [`3de50367b23be6a03d1a8385daae16d5eed2675d`](https://github.com/withmarbleapp/os-taxonomy/tree/3de50367b23be6a03d1a8385daae16d5eed2675d), unchanged since63. All six relevant files were byte-identical to the audited cache: Jane `LESSONS.md`, `src/engine.js`, `src/stuck.js`, `LICENSING.md`; Marble `data/topics.json`, `data/dependencies.json`. Host read access followed prior sandbox diagnostics establishing GitHub DNS was unavailable there.

Jane short purposeful stages, separate support/examples and stable current work are **design references only**. Reuse local game conventions rather than adopting its lesson engine, identity/storage, grades, reward/mastery model or access gates. No new Jane lesson prose, code or art is incorporated; Jane’s path-specific code/content licenses are not a blanket MIT-content license.

## Exact PR47 proposal and independent scope choice

Reread the Balance Stall passage in [PR47’s exact `058fcd271a09fd0b42ec9e74b154e673148de2c2` proposal](https://github.com/anotherpanacea-eng/learning-garden/blob/058fcd271a09fd0b42ec9e74b154e673148de2c2/docs/other-routes-through-the-acts.md). It proposes sealed unknown parcels, known weights, preserving level pans through matched changes and connecting the stall to an equation. Its sample contains two unknown parcels. Its stated first slice uses whole-number weights and one unknown type, while **subtraction from both sides and negative quantities are deferred**.

This foundation makes an explicit independent choice: start with visible equality, then one sealed parcel plus loose units, and **include removing available positive loose unit masses from both sides now**. One-sided removal is permitted as a visible, reversible contrast. This is not a requirement inherited from PR47 or proof that its cited research supports this exact sequence. Repeated parcels, unknowns on both sides, negative quantities and general symbolic manipulation remain deferred. The proposal’s cited Otten/van den Heuvel-Panhuizen/Veldhuis review was not independently read or verified in this audit; no learning-effect, transfer or model-effectiveness claim is imported.

## Two justified references and full hard closure

`mt_oIzycTBeE4` (What the equals sign means) and `mt_3JgrHY221M` (Unknown in Addition & Subtraction) fit the actual actions. The equality target plus hard ancestors has eight nodes; adding unknown-in-addition/subtraction gives **nine unique nodes**. Compared refreshed source against full vendored `curriculum/marble/topics.json` and `dependencies.json` at `96a7933754af672e1bfdbf7ecb05c325860c6e0d`: **all nine names, descriptions, evidence arrays and incoming `(prerequisiteId,strength,reason)` triples match exactly**. Soft relations below do not enlarge the hard union or become learner access locks.

Runtime `dist/marble-map.json` stays pinned unchanged and contains **only the two targets** from this nine-node union. Their names/descriptions match; runtime evidence arrays are absent. Both incoming relations for the unknown target (hard equality; soft inverse relationship) are retained. Equality’s hard symbol-reading predecessor is outside the runtime subset (`outsidePrerequisites:1`). Full raw-source agreement does not establish runtime closure/evidence completeness. No graph expansion or new prerequisite relation is needed.

| ID / role / actual source title | Source description/evidence meaning | Scoped disposition and exception |
| --- | --- | --- |
| `mt_oIzycTBeE4` · target · What the equals sign means | Equality means same value; evidence includes explaining6=6, rejecting4+1=5+2 and rejecting the answer-comes-next interpretation. | Visible equal unit masses in different arrangements, equal paired removal and unequal one-sided changes. No general symbolic proof or independently spoken explanation is inferred. |
| `mt_3JgrHY221M` · target · Unknown in Addition & Subtraction | Find an unknown whole number in a three-number addition/subtraction equation; evidence examples include8+?=11,5=□−3 and6+6=□. | One sealed parcel plus loose unit masses equals a known loose-unit total. A proposed mass is checked separately from performed transformations; no two-step or unknown-both-sides attainment. |
| `mt_8RmpkDxT9L` · hard ancestor · Reading +, −, and = symbols | Read/write/interpret+,−,=; match a concrete situation to a number sentence and interpret equality relationally. | Supplied ledger labels and controls support interpretation. No handwriting/dictation or independent symbol-writing assessment. |
| `mt_OvyoRo47K-` · hard ancestor · Addition as combining or putting together two | Addition combines groups to make a total; evidence includes physical modelling, acting out additions and explaining altogether. | On-screen unit masses form each pan total. No real physical enactment or mass measurement. |
| `mt_zuKAX6lcYR` · hard ancestor · Subtraction as taking away or separating | Subtraction takes away/separates objects and identifies what remains; evidence includes physical enactment and explanation. | Remove only whole available loose unit masses. No negative objects, parcel splitting, fractions or general subtraction attainment. |
| `mt_dmNvjroCPT` · hard ancestor · How Many in Total? | Last counted number gives total regardless of layout/counting order; evidence includes rearrangement preserving count. | Different arrangements of identical unit masses preserve total model mass. Count equals mass only for these identical units, not arbitrary parcels/objects. |
| `mt_WcfaSfVT33` · hard ancestor · One-to-one counting | Pair each object once with a count word; evidence includes avoiding skipped/doubled objects and noticing errors. | Countable supplied unit pictures. Clicking a control or reading an automatic total is not independently observed counting performance. |
| `mt_fR0UtsSREU` · hard ancestor · Reading and writing numbers to 20 | Read/write numerals0–20 and represent quantities; evidence includes legible dictation. | Supplied numerals/tap controls/adult reading are allowed. Keep the first quantities in the declared range; no numeral-writing or independent-reading claim. |
| `mt_oAK9GXSfqV` · hard ancestor · Writing digits 0-9 | Form legible digits0–9 with appropriate size/starting points. | Explicit motor/transcription exception: no handwriting task or digit-formation attainment. |

Complete refreshed incoming source triples `(topicId, prerequisiteId, strength, reason)`; reasons are attributed taxonomy content:

- (`mt_oIzycTBeE4`, `mt_8RmpkDxT9L`, `hard`, Deep understanding of = requires already being able to read and write number sentences)
- (`mt_3JgrHY221M`, `mt_ehGS_uVSJv`, `soft`, Solving missing-number problems benefits from knowing the inverse relationship)
- (`mt_3JgrHY221M`, `mt_oIzycTBeE4`, `hard`, Finding unknowns in equations requires understanding what = means)
- (`mt_8RmpkDxT9L`, `mt_fR0UtsSREU`, `hard`, Writing number sentences requires reading and writing numerals)
- (`mt_8RmpkDxT9L`, `mt_OvyoRo47K-`, `hard`, Reading/writing the + symbol requires understanding what addition means)
- (`mt_8RmpkDxT9L`, `mt_zuKAX6lcYR`, `hard`, Reading/writing the − symbol requires understanding what subtraction means)
- (`mt_OvyoRo47K-`, `mt_dmNvjroCPT`, `hard`, Understanding addition as combining groups requires knowing numbers represent quantities (cardinality))
- (`mt_zuKAX6lcYR`, `mt_dmNvjroCPT`, `hard`, Understanding subtraction as taking away requires knowing numbers represent quantities (cardinality))
- (`mt_dmNvjroCPT`, `mt_WcfaSfVT33`, `hard`, Cardinality principle builds on one-to-one correspondence — you must count correctly to know the last number tells 'how many')
- `mt_WcfaSfVT33`: no incoming edges.
- (`mt_fR0UtsSREU`, `mt_dmNvjroCPT`, `hard`, Reading/writing numerals 0–20 requires understanding that numerals represent quantities (cardinality))
- (`mt_fR0UtsSREU`, `mt_oAK9GXSfqV`, `hard`, Writing numerals requires the motor skill of forming digits 0-9 (taught in English handwriting))
- (`mt_oAK9GXSfqV`, `mt_WBfj79OqXz`, `soft`, Same motor skills for digit formation)

Do not map `mt_anAe11HAEH` (Two-Step Equations): its evidence calls for two-step word problems, an equation with a letter and estimation/reasonableness checks. A single parcel-plus-units equation does not satisfy those criteria. Do not map Solving Linear Equations merely because an illustration can be written usingx; its description extends to terms on both sides, brackets and rational coefficients. No independent symbolic-writing, physical measuring, communication/partner or general algebra claim follows.

## Existing capability and the missing lesson

`dist/broad-content.mjs` already contains “Balance the sign” (`6+__=10`) and a hidden-pile support question (`__+7=12`), with prose explaining that both sides have the same value. `dist/broad-variants.mjs` generates missing-number variants; `dist/broad-ui.mjs` supplies counters and answer support. They do not let a learner change two represented pan quantities and observe whether equality survives.

`dist/equal-groups-{content,core}.mjs` already represents group-count, each and total unknowns and conserves countable objects across editable arrangements. Those unknowns describe objects per group, not the whole mass of a sealed object, and its arrangements do not enact matched changes to two expressions. Coin Counter conserves monetary value across denominations; Bundle Exchange conserves object quantity across tens/ones packaging. These are useful conceptual contrasts, not existing balance equations or reasons to merge state/units. Mass is not price, object count or ramp distance.

Actual reusable implementation seams are the Workshop’s slug page/binding dispatch, local-only support/narration patterns, market visual vocabulary and conservative saved-work/check conventions. The original ramp model is not a balance physics engine. A bounded optional Workshop stall fits existing composition without a new app/router framework, shared economy or changes to existing investigations.

The new learner action is **transforming two represented quantities while tracking their relation**. Teach same value first with two visible arrangements, including an expression on either side rather than a fixed answer slot. Then introduce one sealed whole parcel with a fixed positive whole model mass and loose identical units. For example, parcel+2=7 starts level; removing2 loose units from each side leaves parcel=5. A correct proposed5 can be found by counting or reasoning without those moves. Record the proposed mass separately from the move history; neither should falsely imply the other occurred.

## Model assumptions and teaching hazards

Use an explicitly schematic ideal equal-arm balance: symmetric equal supports, identical loose unit masses and an authored positive whole mass for the one sealed parcel. Pan relation depends on total model mass, not object count, object spacing, drawing size, guessed answer or animation timing. Equal arrangements can look different. The model has no calibrated physical scale, grams claim, momentum/settling simulation, measurement noise or friction lesson. Supply a stable text equivalent of equal/left heavier/right heavier; tilt must not carry meaning alone.

The unknown is **the mass of the whole sealed parcel, packaging included**. It is not the number of hidden items or contents-only mass. The parcel’s authored mass stays fixed throughout that case; guessing a number must never change it or drive the tilt. If a later case changes the unknown, identify it as another case rather than silently changing an existing parcel. Repeated unknown parcels, if ever added later, would require an explicit identical-whole-mass contract; they are outside this first slice.

Removing the same available whole-unit mass from both sides of an equality preserves equality. **It does not restore equality after a one-sided removal has broken it**: the difference remains unchanged. Restore by undoing/adding back the one-sided change or another genuinely compensating move, with the action visible. Do not congratulate a paired move as “balanced again” when the pans are still unequal. Matched removal should be atomic or visibly pending, so a temporary one-side selection is not misreported as a completed matched transformation.

Allow a one-sided removal as an informative contrast, not a correctness lock or permanent failure. Its reversible result should show the changed relation. Remove only objects actually present; no negative inventories, imaginary unit masses or partly opened parcels. Do not subtract the unknown parcel to manufacture a zero/negative algebra case. If either side lacks the requested matched units, explain and preserve the previous configuration. Available-object restrictions are model bounds, not claims about every algebraic subtraction.

When sides differ, do not present a ledger with an unqualified equals sign as though it states a true equality. A clearly identified false equation can be discussed, but the live relation must report unequal quantities accurately. `=` means same value, not “the answer is next,” “a move happened” or “a parcel must be guessed.” Optional number checking can compare a proposed whole mass with the authored case; it does not certify an explanation, independent solution method or general reasoning proficiency.

Preserve original setup, authored mass, performed changes, support and recorded outcomes with each retained case. Later wording/rule changes must not regrade history or silently relabel an old move; partial/future unreadable work remains exact and conservative. Existing Workshop, coins, maps, free-map jobs, equal-group benches and other roots stay separate. Support, familiarity and reported reading remain distinct from answer correctness; narration requested is not playback/decoding evidence. No user prose is classified or keyword-graded.

## Licenses, scope and review boundary

Preserve Jane path notices and Marble attribution © Generative Spark, Inc. (Marble), database ODbL1.0 and descriptive content CC BY-SA4.0. Source meanings above are paraphrased; incoming-relation reasons are attributed taxonomy content. All stall examples, synthetic quantities, diagrams and teaching wording are original; no upstream prose, asset or new runtime code is copied. Keep the bundled pin unchanged. This foundation practices relational equality and one whole-number unknown; it establishes no physical mass measurement, two-step equation attainment, general algebra solver competence or independently verified learning gain. Independent specification/content review must resolve these model/action boundaries before build.
