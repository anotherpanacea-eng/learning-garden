# Six-act source and dependency audit

This is a source-quality and accounting audit, not a child assessment or a completed lesson sequence. The original pinned JSON files are unchanged. See [spec49](specs/49-six-act-curriculum.md) and [topic ledger](../curriculum/six-act-topic-plan.csv).

## Structural findings

- topics: 1590
- dependencies: 3221
- subjects: 8
- domains: 54
- proposedStrands: 26
- mappedDistinctTopics: 62
- declaredReferences: 118
- notYetMapped: 1528
- hardEdges: 2025
- softEdges: 1196
- crossSubjectEdges: 161
- crossDomainEdges: 755
- ageStartInvertedEdges: 56
- hardAgeStartInvertedEdges: 8
- emptyEvidenceTopics: 35
- allNodesInDAG: True
- roots: 100
- sinks: 327
- longestPathEdges: 28
- sourceStartAtLeast11: 265
- sourceStartAtLeast11WithMapping: 0

The ledger retains source age metadata without age-named review buckets. Core versus specialist/stretch remains a semantic authoring decision; no age assigns a first unit. All1,590programme topic designs remain explicitly unfinished.

## Eight hard edges with reversed source starting-age order

These are review signals, not automatic corrections. Read descriptions and reasons before adapting a teaching sequence; original links stay intact.

| Prerequisite ID / source name | Topic ID / source name | Source reason |
| --- | --- | --- |
| mt_aPBzD28_mT / The three digits of a three-digit number | mt_9L3NQqgqRd / Representing Numbers | Representing numbers requires place-value understanding |
| mt_1wxwg782yX / Inherited characteristics | mt_cEzX5r7kp0 / Offspring resemble parents | Must observe parent-offspring resemblance before analysing inherited traits with data |
| mt_6lHBTwQPrS / Question Words | mt_f8n4txtLej / Asking Questions | Generating effective questions requires knowledge of question words (who, what, where, when, why, how) |
| mt_5mIcmKRCgA / Proportion | mt_kLQOzZYrd5 / Compound Units | Speed, density, and unit pricing are applications of direct/inverse proportion |
| mt_lWqmKn5Jvr / Evolution vocabulary | mt_LRzjbo1Fn6 / How animals adapt to environments | Understanding that adaptation may lead to evolution requires both 'adaptation' and 'evolution' vocabulary |
| mt_-2VNlwAR5z / Drawing Ray Diagrams | mt_PifbJOuXrG / Reflection & Refraction | The law of reflection is described and verified using ray diagrams for reflection |
| mt_82KKv0Fca3 / Writing Craft Vocabulary | mt_pis4novXWQ / Revising and editing (age 7+) | Evaluating and editing for consistency requires vocabulary of 'coherence', 'cohesion', 'register', and 'style' |
| mt_C3eNLQJlgt / Egyptian Timelines and Maps | mt_pTz6u49fQt / Ancient Egypt on the Timeline | Placing ancient Egypt in chronological context requires timeline reading and construction skills |

## Empty evidence arrays

These 35 topic IDs require authored task criteria and subject review rather than automatic conversion of a source prompt into an assessment:

mt_gf4RUcACLg, mt_p-8Hlf6_9k, mt_mydcMoa8gN, mt_oqvJJKCJXw, mt_VA126P6Wp5, mt_5XLhiqmocP, mt_nqM2OW0Qlm, mt_NCrbQe0LdB, mt_8StiXnYq1u, mt_JiZ3H90Xg8, mt_WtO50EZQkf, mt_LPYPuSaxv_, mt_0VOZSVjo6c, mt_0ewYhTSHtP, mt__J2BO4V95l, mt_mKNmXqz_Oo, mt_ot9rcUwBtK, mt_YNrrNE23dZ, mt_44HkROUnzE, mt_fqAkSv3cUE, mt_6Wx--Du8j3, mt_Mp_CpVK6e-, mt_EXO1bJ3G_v, mt_NPTjGJIyb3, mt_kKxbPHi5Db, mt_gv_uoHkdjR, mt__kFxuAgs6d, mt_edaoZRkK6M, mt_Am_iTzHjoe, mt_QwWo6an9N1, mt_iYOcfzFqMw, mt_EQQWKz03P8, mt__wWHVvqMWb, mt_olFzbawexJ, mt_Wzj1RETm9A

## Concrete semantic review cases

- `mt_e8CZ7E5qW7`: title says bonds to9, description says complements to10.
- `mt_i2F1nWxJjv`: number-line title, actual linear-inequality description.
- `mt_1VmTUxBrNd`: angle title, actual Pythagoras description.
- `mt_IHipFGTFEY`: fraction title, actual fractional measurement line plots.
- `mt_r8XnXwRA6g`: objects title, actual scaled graph description.
- Some source evidence is bibliographic rather than an observable task criterion.
- A power evidence claim that a more powerful device necessarily uses more energy needs correction/qualification. Source presence is not scientific verification.
- The inheritance edge reason appears to argue the opposite direction from its recorded relation; do not silently repair the database.

All 3,221 edges are retained in the existing dependency JSON; the source graph is the only dependency authority, not copied into the planning ledger. Cross-domain/subject relations need selected-unit review; duplicate theme ownership is avoided through one primary strand per domain; secondary-strand lesson links remain required per-unit authoring work. The ledger is not a second source graph.

Marble Skill Taxonomy v1, © Generative Spark, Inc. (Marble), https://withmarble.com. Source-derived graph information/names/reasons retain ODbL1.0 / CC-BY-SA4.0 under [NOTICE](../NOTICE).

## Known issue flags and update boundary

The ledger now flags all concrete cases identified in this audit and the math/literacy audit, both endpoints of the eight hard age-inverted edges, the inheritance reason issue and empty evidence. This is NOT a systematic correctness review of every name/description. It includes `mt_doX1BhmFgk`, `mt_tAJH5BrpOx`, `mt_y-BuQAfw4B` and `mt_Yw27nweoTj` (the latter is actually linear/quadratic graph solutions). Names must never be a sole routing key. The ledger’s candidate modes flag handwriting, oral language, community discussion and mixed real/model investigation. Other modes remain pending. Source pin and domain ownership define this planning snapshot; current activity references are looked up only in the existing coverage index.

## Cross-strand source relations

Counts below are derived from the unchanged source graph and proposed owning strands. They expose integration workload, not approved teaching bridges or an act order. Same-strand edges remain in the original graph. For each selected lesson, read exact reasons and semantic prerequisites; the [bridge checklist](six-act-teaching-bridges.md) adds examples the source graph does not encode.

| Prerequisite strand | Dependent strand | Hard | Soft |
| --- | --- | ---: | ---: |
| C1 | L1 | 0 | 1 |
| E1 | E2 | 7 | 4 |
| E1 | E3 | 3 | 4 |
| E1 | E4 | 1 | 4 |
| E1 | H2 | 0 | 2 |
| E1 | M1 | 2 | 1 |
| E2 | E1 | 3 | 2 |
| E2 | E3 | 1 | 5 |
| E2 | E4 | 4 | 5 |
| E2 | E5 | 4 | 0 |
| E2 | H1 | 0 | 1 |
| E2 | M7 | 0 | 4 |
| E3 | E1 | 0 | 1 |
| E3 | E2 | 4 | 1 |
| E3 | E4 | 5 | 7 |
| E3 | E5 | 1 | 2 |
| E3 | H1 | 0 | 3 |
| E3 | H2 | 0 | 2 |
| E3 | M7 | 0 | 1 |
| E3 | S1 | 0 | 2 |
| E4 | E2 | 1 | 2 |
| E4 | E3 | 0 | 1 |
| E4 | E5 | 0 | 1 |
| E4 | H1 | 0 | 2 |
| E4 | H2 | 0 | 2 |
| E4 | S1 | 0 | 8 |
| E5 | E2 | 0 | 4 |
| E5 | E3 | 0 | 1 |
| E5 | E4 | 0 | 3 |
| E5 | L3 | 0 | 7 |
| E5 | M6 | 0 | 1 |
| E5 | M7 | 0 | 2 |
| E5 | S1 | 0 | 1 |
| H1 | H2 | 0 | 10 |
| L1 | C1 | 0 | 2 |
| L2 | E3 | 0 | 12 |
| L2 | E4 | 0 | 7 |
| L2 | E5 | 0 | 2 |
| L2 | H1 | 0 | 6 |
| L2 | L3 | 0 | 9 |
| L2 | M7 | 0 | 18 |
| L2 | S1 | 0 | 16 |
| L3 | E3 | 0 | 2 |
| L3 | E4 | 0 | 1 |
| M1 | E2 | 0 | 1 |
| M1 | E4 | 0 | 1 |
| M1 | M2 | 9 | 9 |
| M1 | M3 | 0 | 3 |
| M1 | M4 | 2 | 1 |
| M1 | M5 | 5 | 7 |
| M1 | M6 | 2 | 2 |
| M1 | M7 | 0 | 35 |
| M2 | M1 | 2 | 0 |
| M2 | M3 | 4 | 4 |
| M2 | M4 | 6 | 3 |
| M2 | M5 | 1 | 3 |
| M2 | M6 | 1 | 0 |
| M2 | M7 | 0 | 9 |
| M3 | H2 | 0 | 1 |
| M3 | M1 | 3 | 1 |
| M3 | M2 | 1 | 1 |
| M3 | M4 | 0 | 1 |
| M3 | M5 | 1 | 7 |
| M3 | M6 | 2 | 5 |
| M3 | M7 | 0 | 18 |
| M3 | S6 | 0 | 3 |
| M4 | M3 | 0 | 3 |
| M4 | M5 | 2 | 3 |
| M4 | M6 | 1 | 1 |
| M4 | M7 | 0 | 3 |
| M5 | H2 | 0 | 5 |
| M5 | L1 | 0 | 3 |
| M5 | M2 | 0 | 1 |
| M5 | M3 | 3 | 1 |
| M5 | M4 | 3 | 0 |
| M5 | M6 | 2 | 2 |
| M5 | M7 | 0 | 27 |
| M5 | S1 | 0 | 1 |
| M5 | S6 | 1 | 0 |
| M5 | S7 | 0 | 3 |
| M6 | E3 | 0 | 3 |
| M6 | E4 | 0 | 1 |
| M6 | M5 | 0 | 1 |
| M6 | M7 | 0 | 3 |
| M6 | S1 | 0 | 3 |
| M6 | S2 | 0 | 1 |
| M6 | S7 | 0 | 3 |
| M6 | S8 | 0 | 1 |
| M7 | E3 | 0 | 1 |
| M7 | L2 | 0 | 3 |
| M7 | L3 | 0 | 2 |
| S1 | L3 | 0 | 1 |
| S1 | S6 | 0 | 1 |
| S1 | S8 | 0 | 3 |
| S2 | H2 | 0 | 1 |
| S2 | S3 | 14 | 13 |
| S2 | S7 | 1 | 0 |
| S2 | S8 | 1 | 4 |
| S3 | H2 | 0 | 1 |
| S3 | S2 | 1 | 4 |
| S3 | S4 | 0 | 4 |
| S3 | S5 | 0 | 1 |
| S3 | S7 | 1 | 3 |
| S3 | S8 | 0 | 3 |
| S4 | S2 | 0 | 2 |
| S4 | S3 | 0 | 19 |
| S4 | S5 | 0 | 1 |
| S4 | S7 | 0 | 3 |
| S5 | S3 | 1 | 0 |
| S5 | S6 | 0 | 3 |
| S5 | S7 | 0 | 4 |
| S5 | S8 | 0 | 2 |
| S6 | S3 | 0 | 1 |
| S6 | S5 | 0 | 1 |
| S6 | S7 | 1 | 2 |
| S6 | S8 | 1 | 1 |
| S7 | C1 | 0 | 1 |
| S7 | H2 | 0 | 1 |
| S7 | S1 | 0 | 1 |
| S7 | S3 | 1 | 2 |
| S7 | S4 | 0 | 10 |
| S7 | S5 | 1 | 4 |
| S7 | S6 | 0 | 2 |
| S7 | S8 | 4 | 6 |
| S8 | H2 | 0 | 2 |
| S8 | S2 | 0 | 1 |
| S8 | S3 | 0 | 1 |
| S8 | S6 | 0 | 1 |
| S8 | S7 | 1 | 0 |
