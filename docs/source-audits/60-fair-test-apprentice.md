# Fair Test Apprentice: source and overlap audit

Author source preparation for spec60, 2026-10-21. Independent specification/implementation review remains separate. This audit changes no runtime, specification, held file or taxonomy pin.

## Fresh public-source check

Queried public GitHub `commits/HEAD` for Jane and Marble and fetched the six relevant files at the returned exact commits. The sandbox could not resolve GitHub; the authorized host read succeeded. Jane remains [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81); Marble remains [`3de50367b23be6a03d1a8385daae16d5eed2675d`](https://github.com/withmarbleapp/os-taxonomy/tree/3de50367b23be6a03d1a8385daae16d5eed2675d). Fresh bytes match the spec59-audited cache exactly for Jane `LESSONS.md`, `src/engine.js`, `src/stuck.js`, `LICENSING.md` and Marble `data/topics.json`, `data/dependencies.json`. No reliance on a stale branch-name assumption or unrefreshed head.

Jane’s purposeful short steps, stable current work, optional separate worked example and support remain **design references**, not incorporated code or curriculum. The existing Fair Test Bench and original ramp model are the useful implementation seam. No Jane grading, learner identity/storage, points, mastery gates, copied lesson prose or artwork is added. Jane has path-specific code/content licenses; no blanket MIT-content reuse is inferred.

## Existing mappings are sufficient

Retain spec56’s three narrow targets: `mt_qgb76wHN2X`, `mt_ZFwPZaDJ0_`, `mt_Hw70LI5xza`. Their union with all transitive **hard** prerequisites remains **six nodes**, listed below. Names, descriptions, evidence arrays and all incoming `(prerequisiteId,strength,reason)` triples match the full vendored `curriculum/marble/topics.json` and `dependencies.json` exactly. No relevant hard/soft edge change was found.

Distinguish full source data from the runtime slice. `dist/marble-map.json` stays pinned at `96a7933754af672e1bfdbf7ecb05c325860c6e0d`; it contains only `mt_qgb76wHN2X`, `mt_ZFwPZaDJ0_` and `mt_Wa44s-f8Ws` from this six-node union, with matching names/descriptions and no evidence arrays. Incoming fair-testing and recording-data hard edges are retained; simple-tests’ observation prerequisite is outside the slice (`outsidePrerequisites: 1`). The other three audited nodes are absent. Spec56’s statement about matching the “bundled pin” is accurate for the full vendored source comparison, not a claim that the runtime contains the full closure or evidence arrays.

The apprentice role changes the audience of an explanation; it does not by itself introduce a new curriculum target. Existing fair-testing and observation/interpretation meanings directly cover the proposed confound repair. **No new topic mapping is needed for this increment.** All source relations remain context rather than learner locks or claims of attaining the full source requirements.

| ID / role / actual title | Source description/evidence meaning | Scoped disposition and exception |
| --- | --- | --- |
| `mt_qgb76wHN2X` · existing target · Fair testing | Change one factor, identify what is changed/measured/held fixed, and conduct supported practical comparisons. | Recognise both factors changed; repair low/high on one common surface or rough/smooth at one common height, and retain an already focused comparison. No physical setup or general independent design attainment. |
| `mt_Hw70LI5xza` · existing target · Observation vs Interpretation | Separate what was observed from an explanation of its cause; evidence entries cite primary-science observation research. | Preserve B-farther while refusing height-only attribution. Research references are not a supplied observable rubric, validated assessment or effect evidence. |
| `mt_ZFwPZaDJ0_` · existing target · Recording Data | Gather/record in tables, tally charts or drawings and explain how data answer a question. | Read supplied rows beside the question. Automatic rows are not independent recording or measurement. |
| `mt_Wa44s-f8Ws` · hard ancestor · Simple tests and experiments | Perform simple tests, observe results and use them to suggest answers. | An authored on-screen comparison illustrates this; no physical experiment or new real data. |
| `mt_vJO5Bxk4z-` · hard ancestor · Observing with simple equipment | Use equipment for close observations and detailed descriptions/comparisons. | Inspect existing apparatus and ruler pictures. No hand-lens or physical-tool competence. |
| `mt_XirhnAB6Ye` · hard ancestor · Asking scientific questions | Ask questions and select observation/testing/research methods; evidence includes independently asking at least three questions. | Two supplied questions across three encounters; no independent question-generation or method-selection attainment. |

## Complete incoming source triples

Each line gives `(topicId, prerequisiteId, strength, reason)` at the refreshed source pin. Reasons are attributed taxonomy content. Soft incoming relations do not enlarge the hard closure.

- (`mt_qgb76wHN2X`, `mt_Wa44s-f8Ws`, `hard`, Must do simple tests before setting up formal fair tests with controlled variables)
- (`mt_Hw70LI5xza`, `mt_klyw-tdlhP`, `soft`, Noticing the observation/interpretation distinction requires monitoring your own thinking — the universal comprehension-monitoring habit applied to scientific reasoning)
- (`mt_ZFwPZaDJ0_`, `mt_Wa44s-f8Ws`, `hard`, Must perform tests before learning to gather and record data)
- (`mt_Wa44s-f8Ws`, `mt_vJO5Bxk4z-`, `hard`, Must observe closely before performing simple tests)
- (`mt_vJO5Bxk4z-`, `mt_XirhnAB6Ye`, `hard`, Must ask questions before learning to observe closely)
- (`mt_XirhnAB6Ye`, `mt_f8n4txtLej`, `soft`, Formulating scientific questions builds on the general skill of asking relevant questions to extend understanding, developed in English speaking and listening)
- (`mt_XirhnAB6Ye`, `mt_Hw70LI5xza`, `soft`, Asking good scientific questions requires noticing the distinction between observation and interpretation — a question like 'why did this happen?' only makes sense once you've separated what you saw from what you inferred)
- (`mt_XirhnAB6Ye`, `mt_klyw-tdlhP`, `soft`, Asking scientific questions is the science-domain expression of the universal comprehension-monitoring habit: noticing what you don't yet understand)
- (`mt_XirhnAB6Ye`, `mt_S4G6GLKr1-`, `soft`, Scientific enquiry requires persistence through uncertainty — the universal persistence habit underpins willingness to keep investigating)

## Considered anchors that are not additional mappings

- `mt_6eTZUwKQZr`, **Teaching It Back**: explain new learning in one’s own words to oneself or another person/toy. Actual evidence asks for non-repeated own wording, identifying a gap noticed through explaining, and using self-invented examples. Its hard prerequisite is `mt_LE7nFEwS12`, **Thinking Before Starting** (consider what one already knows before a new task); the maths-explanation relation `mt_kJ5wYzO8qC` is soft. Choosing supplied explanation cards for a fictional apprentice does not establish those own-word/gap/self-invented-example criteria. Optional prose or human discussion can invite teaching back without measuring it. Do not add the node merely because the role is “teacher,” and do not recursively expand its prerequisites when it is not mapped.
- `mt_QrVF5n7vci`, **Could there be another explanation?**: actively consider alternative explanations instead of accepting the first that fits. Its evidence array cites research rather than an observable rubric. Its hard prerequisite is `mt_obF-6VYRya` (not defending an original interpretation against evidence); `mt_Y6P9y1Rz-u` (elaborative interrogation) is soft. The confounded surface is a concrete alternative factor, but existing fair-testing/observation targets already cover it. No extra mapping or research efficacy claim is warranted.
- `mt_tlfSqLFm_Y`, **How data builds explanations**: use relevant data to develop/check explanations, recognizing that a measured change alone does not identify cause. Its evidence includes a frog-count change needing other data, combining shadow/sun observations, and identifying results inconsistent with an explanation. The hard prerequisite is `mt_CVywzrjT_c` (using evidence to answer questions); weather forecasting is soft. Its meaning is relevant, but its wider examples and explanation-testing criteria are not newly attained by these finite authored cases. Retain as an inspected design reference only, with no new mapped closure.
- `mt_LH714Riydn`, **Knowing What You Don’t Know**, is specifically vocabulary uncertainty and strategies for resolving it. Its title is not a general apprentice-knowledge target. `mt_2uHYdoxD0H`, **Finding Knowledge Gaps**, surveys understanding of a whole topic; these bounded encounters do not do that. Neither is mapped.

## Authored model truth and preservation

Reuse the six original configurations and finite values from `dist/workshop-core.mjs` unchanged, plus existing Fair Test Bench setup classification and evidence-reading patterns in `dist/fair-test-core.mjs`. The numbers are authored illustrative **model cm**, not measurements from Jane, Marble, a scientific study or a physical trial. The apprentice and dialogue are original fiction. Existing user investigations and saved rows remain their own work; loading the encounter must not relabel them as the apprentice’s experiment or silently replace them.

The supplied height-question encounter compares A **low/smooth: 12,13,12** with B **high/rough: 14,15,14**. Every B value is above every A value, so **B went farther in these shown model trials** is a valid observation. Both height and surface changed. The comparison does **not isolate height**, so “height alone caused that difference” exceeds this evidence. Rejecting the causal claim must not erase or mark the observed B-farther result false, or assert that the comparison says nothing at all.

Either repair is valid: **same smooth** compares low/smooth 12,13,12 with high/smooth 26,25,26; **same rough** compares low/rough 5,6,5 with high/rough 14,15,14. Both change height while holding surface fixed; cart, release and measurement origin remain fixed model assumptions. Repaired B values are farther in each authored comparison. The supported conclusion is scoped to the selected configurations and finite authored model; it is not a universal real-cart law or proof that no other unmodelled factor can matter. Preserve which repair was chosen and distinguish its new evidence from the original confounded evidence. Repeated deterministic values are not independent random samples, effect-size estimates or statistical confidence.

The specification also includes a surface-question confound: low/rough5,6,5 versus high/smooth26,25,26. Every B value is again larger. Keep rough/smooth fixed and equalise height: low/low, middle/middle or high/high are all focused repairs. Their distances come from the same six frozen authored configurations. A third case already compares low/smooth12,13,12 with high/smooth26,25,26; its qualified message about these examples is useful. Keeping that original focused pair is accepted, so the apprentice is not always wrong and unnecessary correction is not rewarded.

A supplied explanation can distinguish observation, confound and repair; it cannot automatically grade an unrestricted explanation. Keep optional exact prose for a human reader, with no keyword-scoring, writing-proficiency, independent reasoning or universal teach-back claim. Reading/help requests are support observations, not verified speech playback, decoding, fluency or learning gains. The encounter is optional, repeatable practice; returning to a familiar authored case is not an independent fresh assessment.

## Licenses and research limits

Preserve Marble attribution © Generative Spark, Inc. (Marble), ODbL 1.0 database and CC BY-SA 4.0 descriptive content, and existing Jane path-specific notices. This audit paraphrases topic meanings and attributes source relation reasons; it incorporates no upstream lesson prose/assets/code into the activity. The bundled pin and existing mappings remain unchanged.

The earlier [spec56 source audit](56-fair-test-bench.md) records NGSS fair-test references as design background. This source-refresh pass did not newly verify those pages or PR47's research citations. The root read PR47's full proposal separately; no effect claim from it is imported. No teaching-to-an-apprentice benefit, learning-effect size, metacognitive gain or transfer effect is asserted. The concrete justification is the existing learner action: preserve a valid observation, limit a causal claim and choose a focused comparison.
