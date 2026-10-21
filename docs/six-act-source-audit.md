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

Metadata-only review queues in the ledger: 426 foundation-review, 899 intermediate-review, 265 upper-horizon-review. The upper queue is NOT automatically optional or beyond thirteen. Each topic needs a semantic core/specialist/stretch decision; source ages never assign an act or learner level. All 1,590 new programme topic designs remain explicitly unfinished.

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

All 3,221 edges are retained in the existing dependency JSON and represented by the topic ledger’s hard/soft predecessor ID fields. Cross-domain/subject relations need selected-unit review; duplicate theme ownership is avoided through one primary strand per domain and explicit secondary connections. The ledger is not a second source graph.

Marble Skill Taxonomy v1, © Generative Spark, Inc. (Marble), https://withmarble.com. Source-derived graph information/names/reasons retain ODbL1.0 / CC-BY-SA4.0 under [NOTICE](../NOTICE).
