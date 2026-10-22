# Town Remembers: source and finite-content audit

2026-10-22. Companion to [spec 74](../specs/74-town-remembers.md). Final independent content review cleared `244cbb4`; implementation has a separate review gate. This audit checks a changed-form revisit; it makes no claim of demonstrated retrieval, spacing or interleaving benefits.

## Inspected sources and reuse

Current GitHub heads and files were refreshed during this work window: Jane `d4903954d7c4d8118cbd1d2f7ed770544fd4ac81` ([publisher](https://github.com/kentlangley/Jane/blob/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81/publish-lessons.mjs), [engine](https://github.com/kentlangley/Jane/blob/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81/src/engine.js), [licensing](https://github.com/kentlangley/Jane/blob/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81/LICENSING.md)); Marble `a8719737ff86ef7940ba5feca11940de1204103e` ([topic data](https://github.com/withmarbleapp/os-taxonomy/blob/a8719737ff86ef7940ba5feca11940de1204103e/data/topics.json)).

Jane distinguishes generated pack items and supplied examples, and records revisits separately. Its completion snapshot and legacy marker inform keeping earlier work interpretable, but its queue, mastery/reward logic and locks are not adopted. Original Learning Garden spec31 provides explicit cross-game invitations and frozen provenance; the existing tray/share/kitchen modules provide the concrete kept data. Read their current source shapes directly: `whole-batches-core.mjs`, `sharing-counter-core.mjs`, `measuring-recipes-core.mjs` and their content modules. No upstream code, lesson text or image is copied. Jane code is MIT; its documentation and original learning content carry separate terms. Existing notices remain.

## Four candidate meanings, bounded use

| Marble topic | Inspected meaning/evidence | Disposition |
| --- | --- | --- |
| `mt_IfEgu0X449` Comparing fractions | Unit-fraction and same-denominator comparison; explaining how denominator changes part size. | Same-whole unit-fraction pair only. No ordering a full collection or non-unit comparison. |
| `mt_k2WE0-22-4` Unit fractions | Find and write fractions of discrete collections, including non-unit fractions. | One of n equal shares of twelve only, using supplied choices. No independent fraction writing or non-unit set fractions. |
| `mt_PZ909yPrEC` Multiplication as repeated addition | Equal sets, repeated addition and arrays. | Infer guests from whole recipe copies and reject an unequal ingredient shortcut. No general proportional reasoning or recall claim. |
| `mt_4lp_b5Pzik` Capacity and volume | Measuring and recording with non-standard and standard units. | A supplied exact model scale and extra amount in mL only. Physical measurement, independent recording, litres and pouring uncertainty remain unobserved. |

These are source dispositions, not four newly completed topics. No runtime taxonomy pin or prerequisite graph changes. The existing games' scoped references supply the starting connections; a new game-specific coverage row, if added later, must repeat these limits. This pass read selected topic meanings and evidence, not the entire upstream graph or a prerequisite closure.

Marble Skill Taxonomy attribution: © Generative Spark, Inc. (Marble), https://withmarble.com. Database ODbL 1.0; content CC BY-SA 4.0. Above descriptions summarize the named source meanings; all question/help/feedback wording in spec74 is original.

## Finite mathematical audit

- Reverse trays: c in {1,2,3} gives 2c guests; c and 2c+1 are distinct distractors. Actual portions, not old planned copies or old success, determine c.
- Shortcut: c in {1,2} produces proposed jars (200,250) or (300,400) mL. Neither exceeds 500 mL; both are 50 mL short in star-water relative to the next whole batch. A third initial copy is excluded.
- Same-loaf comparison: cyclic pairs are 2→3, 3→4, 4→6, 6→2; the first three make smaller pieces, the last makes bigger pieces. Same whole is explicitly supplied in text and equal-width pictures.
- Twelve buns: n=2,3,4,6 gives 6,4,3,2 buns respectively. Neither n nor 1 equals that fitting count for any eligible n. The model shows the saved selected fraction, not presumed former correctness. A checked explanation explicitly supplies the equal-group multiplication fact `[n,12/n]`; Help explicitly supplies its separate `[h,12/h]`. These are prior exposures for another task, not independent success here.
- Coarser jug: a=50,100,…,450. Strictly neighbouring numbered 100 mL marks are distinct from a and stay in [0,500]. Unnumbered midpoint marks and text distinguish a numbered-line reading from a halfway reading.
- Extra pour: next-hundred target gives a positive difference of 50 or 100 mL. The third choice adds 50 to that difference, except a=50 uses another 100 to avoid duplicating the target. Every offered count is distinct; both distractors fail for an explicit quantity reason.
- Each helper uses a different eligible artefact value from the waiting question; jug-more also uses the opposite extra amount (50 versus 100 mL). Its separate picture and explanation never mutate a source game or claim to answer the waiting task independently.

The first independent Claude review confirmed the arithmetic and source eligibility, and requested three content repairs: case-based choice rotation, a jug-more example with a different answer, and withholding the remembered amount label before the jug-coarser check. Those repairs were approved in the focused follow-up at `244cbb4`. Runtime tests must enumerate the finite inputs as well; tests alone do not establish pedagogical efficacy.

Integration review later found that the originally approved "no exposure changes" rule omitted facts actually stated by `share-buns` and `trays-reverse` feedback and Help. A synthetic checked three-share bun errand visibly states 3 equal groups of 4, while a later generated 3×4 broad question is still marked fresh. The narrow spec fold records only complete, actually displayed equal-group relations through the existing exposure bridge, including readable checked feedback when grown-up notes are opened. An older readable frozen record does not supply a fact when its displayed text or helper shape does not establish that relation. The source loaf's length fractions do not themselves supply a 3×4 bun-group fact; ingredient amounts and fraction comparisons are likewise not inferred as multiplication facts. This changes prior-exposure qualification only and does not extend the candidate Marble coverage or claim learning benefit.

Independent Claude content review cleared `244cbb4` with no outstanding P1/P2 findings. The source audit remains bounded to the four candidate meanings above; no runtime graph or learning-effect claim is added. See [the review receipt](../reviews/74-town-remembers-spec-review.md).
