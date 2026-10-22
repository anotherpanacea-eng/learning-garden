# Two Windows: source and overlap audit

Author source audit for spec59, 2026-10-21. This is source preparation, not independent specification or implementation review. No app changes are made by this audit.

## Sources, closure and comparison

Jane [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81): use the root-refreshed cached `LESSONS.md`, `src/engine.js`, `src/stuck.js` and `LICENSING.md` previously inspected for spec58. Purposeful short stages, a different worked example and optional stepwise support remain design references only. No additional Jane code, lesson prose, assets, grader, points, mastery model, age routing, learner identity/storage or access gates are copied. Jane paths have different code/content licenses; no blanket MIT-content license is inferred. Existing incorporated-code notices remain intact.

Marble [`3de50367b23be6a03d1a8385daae16d5eed2675d`](https://github.com/withmarbleapp/os-taxonomy/tree/3de50367b23be6a03d1a8385daae16d5eed2675d): inspected root-refreshed cached `data/topics.json` and `data/dependencies.json`. The principal targets `mt_E_OryWIYkn` and `mt_lp3qyEujIv`, including every transitive **hard** prerequisite, form an **11-node union**. The additional narrow reference `mt_OyOYHlZ2_T` has **no hard prerequisites**, giving **12 nodes total** when included. Soft incoming relations are recorded below but do not recursively enlarge the hard union. These source relations do not become learner locks, an implementation checklist or a claim that this slice teaches every ancestor.

Comparison against full vendored `curriculum/marble/topics.json` and `dependencies.json`, pinned at `96a7933754af672e1bfdbf7ecb05c325860c6e0d`: **all 12 names, descriptions and evidence arrays match exactly**. Incoming `(prerequisiteId, strength, reason)` triples match for all 11 principal-closure nodes. The only difference in the combined union is the refreshed source’s **removal** of the old soft `mt_OyOYHlZ2_T` → `mt_U_8iVFZuHH` relation (reason: re-reading to check sense/intended effect as practical application of self-evaluation). The four remaining guided-revision soft edges are unchanged; no hard edge changed. Guided revision is not treated as requiring independent self-evaluation.

Runtime `dist/marble-map.json` contains only `mt_lp3qyEujIv` and `mt_GugVunb2lI` from this 12-node union. Their names/descriptions match. Runtime nodes omit evidence arrays. All incoming triples for `mt_lp3qyEujIv` are retained; both incoming `mt_GugVunb2lI` relations are outside the runtime subset (`outsidePrerequisites: 2`). Thus full raw-source agreement does not establish runtime closure completeness or runtime evidence equality. This audit performs no graph expansion or repinning.

Retain Marble attribution: © Generative Spark, Inc. (Marble); database ODbL 1.0, descriptive content CC BY-SA 4.0. Source meanings below are paraphrased and source relation reasons are attributed taxonomy content. All fictional cases, prompts, choices, message cards and art are original, with no upstream lesson prose/assets/code copied. Source ages are not readiness or routing claims.

## Audited node dispositions

| ID / role / actual title | Actual description/evidence meaning | Product disposition and limit |
| --- | --- | --- |
| `mt_E_OryWIYkn` · principal target · Narrator's Point of View | Compare narrators and their effects on what a reader knows; evidence includes comparing two tellings of one event and what each emphasizes, omits or reveals. | Two fictional tellers with different access to the same event. No first-/third-person classification or explanation of authorial narration choices; no full-topic claim. |
| `mt_lp3qyEujIv` · principal target · Inference vs Explicit Meaning | Distinguish explicit text from inference, assumption or added interpretation. Its evidence entries are research references, not observable response criteria. | Explicit/inferred/not-stated/contradicted choices and cited fictional lines are original task criteria. Do not invent an upstream rubric or equate a card choice with general comprehension. |
| `mt_KmPZ5diLEP` · hard ancestor · Character Traits and Motivation | Analyse traits, motives and feelings with text evidence; distinguish own viewpoint from narrator/character. Evidence includes two traits with actions/dialogue, motivated decisions and explaining a difference from the narrator. | Knowledge/access comparison and bounded cause inference only. No personality verdict, trait profile, own-opinion assessment or broad motive/feeling attainment. |
| `mt_ukLvUD8DFA` · hard ancestor · Inferring Characters' Feelings and Motives | Infer feelings, thoughts and motives from independently-read text and justify with clues; evidence distinguishes explicit detail from inference. | Supportive read-aloud/adult reading is welcome. Independent-reading requirement is explicitly excepted; no decoding, fluency or private-feeling diagnosis. |
| `mt_E5KC4AnRLW` · hard ancestor · Reading between the lines | Ask/answer key-detail questions and make simple inferences from speech/actions; evidence includes who/what/where answers and justified unstated guesses. | Short labelled lines support concrete detail and inference questions; broader literary/informational reading remains unobserved. |
| `mt_xjl6AEhnjk` · hard ancestor · Characters' Viewpoints and Responses | Identify tellers and compare characters’ viewpoints/responses and experiences across stories/versions. Evidence includes identifying a teller, explaining a response with text and comparing characters in similar situations. | Explicit teller labels and paired accounts supply comparison. This is supported text interpretation, not independently identifying narration or universal perspective-taking/empathy. |
| `mt_zlSoIKPyId` · hard ancestor · Retelling Stories with Structure | Retell in sequence, describe characters/settings/events using text and discuss beginning/middle/ending structure. | Same-event facts and timing support comprehension. No required oral retelling, three-detail sequence or independently explained narrative structure. |
| `mt_sSQlLOnAow` · hard ancestor · Characters, settings, and events | Identify story characters, setting and major events; retell key details in order. | Supply named tellers, market setting and event. Selection of a line does not establish a complete retelling or knowledge of traditional tales. |
| `mt_mLPEMpYb_R` · hard ancestor / lower-language access · Listening to Texts Read Aloud | Listen to and discuss texts beyond independent reading; evidence includes answering key-detail questions and asking for clarification. | Adult/narration access and concrete questions are appropriate. Narration requested is not verified playback; requesting audio is not comprehension evidence. |
| `mt_GugVunb2lI` · hard ancestor · Monitoring Comprehension | Notice decoding without understanding and act to repair meaning. Evidence entries name comprehension-monitoring research, not task criteria. | Offer rereading, another account and help. Opening a tool does not establish metacognition or independently repairing comprehension. |
| `mt_scBgiMKhG_` · hard ancestor · Reading for Meaning | Understand reading as meaning-making distinct from decoding. Evidence cites reading research and the Simple View of Reading. | Meaning-focused play with supported access; no reading diagnosis, independent-decoding claim or newly invented source performance rubric. |
| `mt_OyOYHlZ2_T` · additional narrow guided-revision reference · Responding to Writing Feedback | Teacher-guided rereading and responding to questions/suggestions to clarify meaning; evidence includes adding detail after a question and improving writing with feedback. | Supplied reader-message revisions and optional human discussion rehearse guided revision. Supplied cards are not the learner’s independently written prose. Optional prose is retained without automatic checking. |

The evidence arrays for `mt_lp3qyEujIv`, `mt_GugVunb2lI` and `mt_scBgiMKhG_` are research references. This audit verifies those arrays against the vendored source; it does not independently verify the cited research or turn references into an observable rubric. The product’s selected-line and relation checks are original finite tasks, not a validated assessment.

## Complete refreshed incoming triples

Each entry is `(topicId, prerequisiteId, strength, reason)`. Soft prerequisites outside the audited hard union remain context only. Reasons below are source taxonomy content under the license above.

- (`mt_E_OryWIYkn`, `mt_KmPZ5diLEP`, `hard`, Comparing first- vs third-person narration builds on understanding character POV and distinguishing own viewpoint from narrator's/characters')
- (`mt_E_OryWIYkn`, `mt_xjl6AEhnjk`, `soft`, Comparing POV across stories builds on character POV comparison work from Y3-4)
- (`mt_lp3qyEujIv`, `mt_6eTZUwKQZr`, `soft`, Distinguishing literal from inferred requires being able to articulate your own understanding clearly enough to examine its source)
- (`mt_lp3qyEujIv`, `mt_GugVunb2lI`, `hard`, Distinguishing literal from inferred requires first being able to monitor whether you have actually understood — you must notice comprehension before you can interrogate its source)
- (`mt_KmPZ5diLEP`, `mt_ukLvUD8DFA`, `hard`, Analysing character motivations requires inference skills)
- (`mt_KmPZ5diLEP`, `mt_xjl6AEhnjk`, `hard`, Character traits/motivations analysis builds on Y2-3 character POV and comparison)
- (`mt_ukLvUD8DFA`, `mt_8-POYyg7GJ`, `soft`, Drawing inferences about characters' feelings and justifying them with evidence is enriched by prior experience predicting what might happen next — both require reading ahead of the literal text)
- (`mt_ukLvUD8DFA`, `mt_E5KC4AnRLW`, `hard`, Inferring characters' feelings/motives with evidence builds on identifying key details and making simple inferences)
- (`mt_ukLvUD8DFA`, `mt_rQ2YJJi4uh`, `soft`, Inferring and justifying inferences with text evidence requires the metacognitive habit of checking that the text makes sense as you read — a reader who doesn't self-monitor will miss the cues on which inference depends)
- (`mt_ukLvUD8DFA`, `mt_VEwM7ClYYE`, `soft`, Drawing inferences about motivations is enriched by the prior ability to understand and discuss the sequence of events and connections between them — inference relies on understanding what happened and in what order)
- (`mt_ukLvUD8DFA`, `mt_WzOyJFKDIu`, `soft`, Drawing inferences from complex texts requires academic vocabulary for reasoning about evidence and argument)
- (`mt_E5KC4AnRLW`, `mt_sSQlLOnAow`, `hard`, Need story elements to extract key details)
- (`mt_xjl6AEhnjk`, `mt_5n-O41lUgn`, `soft`, Personal connection to text supports understanding character perspectives)
- (`mt_xjl6AEhnjk`, `mt_9NQEiYLQA3`, `soft`, Comparing characters' points of view in literature requires the perspective-taking ability developed through SEL — understanding that people genuinely experience the same events differently)
- (`mt_xjl6AEhnjk`, `mt_GLY3R3YSlf`, `soft`, Comparing characters across stories builds on general text comparison skills)
- (`mt_xjl6AEhnjk`, `mt_zlSoIKPyId`, `hard`, Character analysis and POV identification requires understanding of characters, settings, and events)
- (`mt_zlSoIKPyId`, `mt_sSQlLOnAow`, `hard`, Character/narrator analysis builds on Y1 story elements)
- (`mt_zlSoIKPyId`, `mt_V-ldQp56bF`, `soft`, Expressive reading supports deeper character analysis)
- (`mt_sSQlLOnAow`, `mt_mLPEMpYb_R`, `hard`, Need to engage with stories before identifying elements)
- `mt_mLPEMpYb_R`: no incoming edges.
- (`mt_GugVunb2lI`, `mt_klyw-tdlhP`, `soft`, Noticing the decoding/understanding gap is the English-specific form of the universal comprehension-monitoring habit)
- (`mt_GugVunb2lI`, `mt_scBgiMKhG_`, `hard`, Noticing the gap between decoding and understanding requires first having the foundational idea that reading means making meaning)
- (`mt_scBgiMKhG_`, `mt_klyw-tdlhP`, `soft`, Understanding that reading means making meaning is the English-domain grounding of the universal habit of noticing when you don't understand)
- (`mt_OyOYHlZ2_T`, `mt_8dstvf-KKb`, `soft`, Re-reading own writing to check it makes sense is the writing-domain form of the universal self-checking habit)
- (`mt_OyOYHlZ2_T`, `mt_klyw-tdlhP`, `soft`, Noticing when your own writing doesn't make sense requires the universal comprehension-monitoring habit applied to one's own text)
- (`mt_OyOYHlZ2_T`, `mt_nDAcXoPa0c`, `soft`, Need writing to revise)
- (`mt_OyOYHlZ2_T`, `mt_o8ciHks8t2`, `soft`, Re-reading and responding to feedback is more effective when pupils know terms like 'revise', 'edit', and 'meaning')

## Existing overlap and genuinely new work

`docs/specs/06-story-loft.md` remains a plan for six paired stories, scene chronology and optional creative extensions. The implemented puppet theatre in `dist/loft-core.mjs` preserves scenes/dialogue, performance and audience revision; it does not implement that paired-reading plan. Two Windows is a bounded first reading increment, not completion of spec06. Keep its reading work separate from existing shows and dialogue.

Paris (`dist/paris-content.mjs`, `garden-core.mjs`) already asks for an inference and a supporting sentence from one persistent passage, with passage IDs/familiarity. Reuse visible passages, stable line IDs, support distinctions and conservative saved work. Two Windows adds comparison of **two tellers’ different information access**, not merely a fresh inference question from a single passage.

Post/Loft messages (`dist/message-content.mjs`) and Changing Letters (`dist/letter-content.mjs`) already offer clue selection, reader knowledge/needs, alternative supplied revisions, before/after reader outcomes and optional human-read prose. The additional action must be using evidence across two tellings to correct a reader’s incomplete understanding. A differently decorated clarification note alone would duplicate existing work. Supplied-card semantics can be checked; prose must not be keyword-graded or interpreted as automatically successful delivery.

Travelers’ Archive (`dist/travelers-archive-content.mjs`, `travelers-archive-core.mjs`) already separates claim/evidence/limit choices and retains an ungraded reply. Its Paris 1910 photograph is a real historical visual; its chronology and guides are modern material. The two accounts here are **both original fiction**, not historical documents, independent eyewitness corroboration or substitutes for the Archive’s attributed sources. Preserve that boundary in labels, notes, exports and links. Roadmap language about a yet-unselected first Archive exhibit is older than the actual implementation.

The existing `#workshop/windows` seam and Loft/Post invitations are the proposed delivery location, not evidence of an implemented loop. Workshop’s ramp model remains separate. Its active trials, Post deliveries, messages, letters and puppet shows must stay resumable when following links. This audit does not edit the held application.

## Bounded content, lower-language entry and failure risks

Three original market-day cases vary information access: cause, timing and detail. Each has two fictional tellers of the same event. Shared facts must agree; noticing and inference may differ without making a teller dishonest, foolish or morally inferior. For every claim, define the evidence scope visibly: one selected teller, both accounts, or the whole supplied case. A fact absent from one account may be explicit in the other; absence is not contradiction. “Inferred” needs supporting clues, “not stated” must not be falsely upgraded to a warranted inference, and “contradicted” requires conflicting text. Independent content review should check every accepted line combination and plausible alternative reading; multiple supported answers must remain possible where the prose permits them.

Short labelled lines and optional adult narration provide a lower-language entry through concrete who/what/where or “what did this teller see?” questions. Optional concise/expanded versions must preserve the same underlying event and relevant evidence truth; an inference must not silently become an explicit statement without recording the changed question context. Familiarity carries across versions of a case. Expanded text is not a fresh independent reading sample. Narrative length, vocabulary or card success does not establish decoding, fluency, reading level or general empathy.

Keep line/evidence selections, relation judgments, reader-message revisions, optional exact prose, text-version exposure, support and reported reading separate. Selected lines are narrative textual evidence, not evidence that an author adequately supports an argument: `mt_S3XMQOYt_D` is therefore not a principal target. Supplied revisions rehearse a reader effect; they do not demonstrate independent composition or the complete `mt_U_8iVFZuHH` self-evaluation topic. Avoid deterministic inference from a single gesture to a private feeling and avoid scoring a child’s personal feelings, trustworthiness or empathy.

## Root primary-reference refresh

The root author separately opened the official IES [reading guide14](https://ies.ed.gov/ncee/wwc/PracticeGuide/14) and [writing guide17](https://ies.ed.gov/ncee/wwc/PracticeGuide/17) summaries for this unit. They inform purposeful text discussion and writing for different purposes. Evidence ratings differ by recommendation; these broad guides do not validate this app, its card categories, a measured effect size or a complete reading/writing curriculum. No guide text, lesson or artwork is incorporated. The audit author did not independently repeat that page read.
