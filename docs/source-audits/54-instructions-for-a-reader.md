# Instructions for a Reader source audit — 2026-10-21

> Independent specification checkpoint: [review receipt](../reviews/52-55-independent-spec-review.md) accepts the bounded curriculum/access dispositions; earlier pending labels below preserve the authoring baseline. This does not approve runtime behavior or, for55, phonetic recordings/rights.

**Author research, pending independent review.** Supports [spec54](../specs/54-instructions-for-a-reader.md), not an implemented activity or a source-topic completion claim. Every disposition below is proposed.

## Refreshed sources and existing capabilities

Fetched Marble main and read `data/topics.json` and `data/dependencies.json` at [`87118bb0a87374f9dec3940d91e4319ce6b05da2`](https://github.com/withmarbleapp/os-taxonomy/tree/87118bb0a87374f9dec3940d91e4319ce6b05da2):1,837 topics /3,853 edges. The app remains pinned at`96a7933754af672e1bfdbf7ecb05c325860c6e0d`:1,590 /3,221. Do not relabel an upstream-only topic as a current atlas reference.

Jane main remains [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81). Read `LESSONS.md` and actual `src/engine.js` creative grading/pack behavior alongside the earlier `src/stuck.js` and `LICENSING.md` inspection. Stable authored items and separate examples are useful design references. `creativeOk`, `fuzzyEq` and the creative branch of `grade` accept/reject through normalized letters, approximate matches, lexical restrictions and length/word limits. They cannot judge a reader's understanding or the quality of a multi-sentence instruction. No Jane code or lesson prose is newly incorporated.

Existing specs39/40/36 and `dist/message-core.mjs`, `message-ui.mjs`, `letter-content.mjs` were inspected. `testMessageCard` looks up authored `fits`/clue flags; playback displays the selected card's authored outcome. The library already supplies ordered-action and purpose-bearing sentences. Spec54 therefore proposes editable order across separate sentence cards and explicit intermediate state, while keeping original prose human-read. It does not claim to introduce the first ordered instruction, audience question, revision or puppet dialogue.

Read the official [Common Core writing2 page](https://www.thecorestandards.org/ELA-Literacy/W/2/), specifically W.2.5's guided revision/editing and W.2.3's developed sequence with actions/thoughts/feelings and closure. The first informs the supported revision opportunity; the second shows why two miniature instruction cases cannot be called full narrative writing. These are design references, not learner ages, placement or efficacy evidence. The IES writing reference in earlier specs was not freshly verified in this pass.

## Selected targets and complete hard closure

Five targets have **nine distinct transitive hard predecessors**, including the planning target itself. Their union is **13 unique nodes**, with11 incoming hard edges. All actual descriptions, evidence entries and incoming edge reasons were read. Some evidence entries are broad opportunities or adult observations, not an automatic rubric.

| ID / role | Actual source meaning, paraphrased | Proposed spec54 disposition and numbered encounter | Unobserved or excluded scope |
| --- | --- | --- | --- |
|`mt__p5n8z5soJ`, target|Describe everyday instructions, predict missing/out-of-order consequences, understand that computers follow exact instructions.|4: explicit action rules, paused/changed consequences and manual restart.|No general programming competence or arbitrary-language parser.|
|`mt_r-BgS-lqTe`, target, upstream-only|Receive and give spoken instructions, listen for steps, clarify uncertainty and explain a needed change.|3,6–7: optional partner rehearsal, clarification and revision.|Oral interaction remains human-observed. Three pictured actions do not establish the source's four-spoken-instruction example or independent listening.|
|`mt_9P9o6d0Qm3`, target and ancestor|Say or note ideas before writing; plan sentence by sentence.|2–3: independent picture plan, optional oral rehearsal, separate supplied/original drafts.|No automatic evidence from clicking a plan or copying it. Narrative beginning/middle/end remains outside this instruction task.|
|`mt_OyOYHlZ2_T`, target|With guidance, reread and respond to questions/suggestions to clarify meaning.|6–7: human question, exact draft, explicit revision and before/after comparison.|A machine outcome is not teacher feedback on original writing; revising a supplied strip is not independently revising prose.|
|`mt_v5DyOEpbbr`, target|Choose form, tone and register for audience and purpose before writing.|1,6: name this reader/purpose; compare a practical note with an invitation; discuss a newcomer versus familiar reader.|**Narrow source exception:** no full tone/register selection or broad genre competence. Reviewer must accept this as partial practice, not whole-topic coverage.|
|`mt_XbGfVhfiUz`, ancestor|Recognize computers in everyday objects and their shared instruction-processing role.|4: identify the current device as a computer and explain the finite runner.|**Scope exception:** everyday-object sorting and breadth are deferred; no computer-identification gate.|
|`mt_f8n4txtLej`, ancestor|Ask/answer relevant questions to seek help and clarify understanding.|6: invite a real reader question and response through the learner's chosen communication mode.|Human interaction is not established by selecting a supplied question.|
|`mt_6lHBTwQPrS`, ancestor|Use who/what/where/when/why/how in questions and answers.|1,5–6: short examples tied to reader, place, order and reason.|No full question-word assessment; clarification remains open.|
|`mt_mB7DVai-Uf`, ancestor|Listen and respond appropriately and take turns in discussion.|6–7: accessible partner turn-taking opportunity.|**Access exception:** source evidence includes eye contact/classroom conventions; neither is a gate or measure here. No listening inference from taps or narration.|
|`mt_PJyCGJz5Hv`, ancestor|Compose and rehearse sentences orally before writing them.|3: optional oral/sign/AAC rehearsal with a person, separate from typed text.|**Modality exception:** no compulsory vocal speech; selecting a card does not demonstrate oral composition.|
|`mt_N8CpN1EJrP`, ancestor|Understand/produce complete sentences and expand them with detail.|3,6: model an imperative instruction and discuss details with a reader.|**Supported bridge:** supplied sentences provide access; no automatic fragment/grammar test or full sentence-production claim.|
|`mt_o8ciHks8t2`, ancestor|Use distinct writing-process terms for composing, planning, drafting, revising and editing, plus purpose/form vocabulary.|1–3,6: define the terms when used; plan and draft stay distinct; meaning revision differs from proofreading.|**Scope exception:** the complete genre/paragraph/recount vocabulary set is deferred. No recall gate.|
|`mt_82KKv0Fca3`, ancestor|Use writing-craft vocabulary for choices/effects, including form, structure, register, coherence and rhetoric.|1,4–6: explain this note's form, order and reader effect in plain language.|**Scope exception:** only form/structure/effect are introduced; advanced register/rhetoric/argument vocabulary is not taught or presumed.|

Hard edges below use **dependent → prerequisite**, not a suggested play order. The right column paraphrases the actual source reason; all dispositions stay pending independent review.

| Dependent | Hard prerequisite(s) | Source reason |
| --- | --- | --- |
|`mt__p5n8z5soJ`|`mt_XbGfVhfiUz`|Recognize computers before explaining their exact following of instructions.|
|`mt_r-BgS-lqTe`|`mt_f8n4txtLej`, `mt_mB7DVai-Uf`|Giving/following instructions builds on asking questions and listening/responding.|
|`mt_f8n4txtLej`|`mt_6lHBTwQPrS`, `mt_mB7DVai-Uf`|Effective questions need question-word knowledge and listening/responding.|
|`mt_9P9o6d0Qm3`|`mt_o8ciHks8t2`, `mt_PJyCGJz5Hv`|Planning uses named process vocabulary and builds on oral rehearsal.|
|`mt_PJyCGJz5Hv`|`mt_N8CpN1EJrP`, `mt_o8ciHks8t2`|Oral composition requires sentence understanding and words for compose/sentence/sequence.|
|`mt_v5DyOEpbbr`|`mt_82KKv0Fca3`, `mt_9P9o6d0Qm3`|Audience/purpose decisions need craft vocabulary and build on general planning.|

The other seven nodes in the union have no incoming hard edges. This closure is an authoring account, never an access lock. The independent reviewer should check whether introducing only a small part of broad craft/process vocabulary is an honest bounded exception, and whether the accessible oral alternative preserves the intended composition opportunity without claiming vocal-speech evidence.

## Bundled versus current source differences

- The12 union nodes present in the bundled graph retain matching names, descriptions and evidence. Eleven also retain identical incoming `(prerequisiteId,strength,reason)` triples.
- `mt_r-BgS-lqTe` is **absent from the bundled graph**, rather than a changed local description. Its two hard prerequisites are included in this audit; adding it to the runtime atlas would require a separately reviewed source/pin decision.
- `mt_OyOYHlZ2_T` no longer has the bundled soft incoming edge from `mt_U_8iVFZuHH` (Reviewing Own Writing). Current Reviewing Own Writing instead has a soft prerequisite on Responding to Writing Feedback. This direction change was checked in both nodes, not inferred from their titles. It does not alter this packet's hard closure.
- Read the broader self-review chain (`mt_U_8iVFZuHH` → `mt_QB4qIGJIIj` → `mt_GugVunb2lI` → `mt_scBgiMKhG_`) and `mt_I65kFjWwnF` (revising/editing including punctuation, tense and spelling). They are **not selected targets**: a finite runner or supported conversation cannot establish independent reader-effect judgment or proofreading. Their hard ancestors are outside the13-node selected closure.
- Read soft-adjacent `mt_86DyHo9zO3` (formal/informal English) and `mt_QEr24lqzvH` (sentence starts/end punctuation). Their actual scope is deferred; neither a supplied polite sentence nor existing punctuation is evidence of those skills. Do not turn the word “because” into a general conjunction/grammar mapping.

No upstream pin, vendored graph, runtime atlas reference or curriculum-ledger completion status changes. Other upstream metadata is not declared unchanged.

## Author checks and review questions

Mechanically enumerate ordered subsets of the three unique actions, lengths0–3:16 per case. With two sentence variants per selected action this gives79 presentations per case,158 in total. Check that variant choices do not change semantics, only the single fold→insert→seal order fulfills the pocket request, and both preparation orders followed by invite fulfill the welcome request. Empty/partial strips are unfinished. An early invitation must retain its earlier consequence even if the missing signs are subsequently placed. These are finite design checks, not a runtime implementation or pedagogical validation.

Author enumeration performed for all158 presentations:24 presentations serve the requests (eight wording combinations for each of the three valid action orders). Variant-equivalence, empty/partial cases, sealed-before-insert and both early-invitation consequences passed. The exact13-node table,11 hard edges and stated bundled differences were checked mechanically;76 relative documentation links and the unchanged atlas check passed. No runtime suite or browser test was run for this documentation-only packet.

Independent review must examine the small envelope's explicit size premise; the difference between an executable but unhelpful instruction and a blocked precondition; the difference between order and cause; real opportunities to plan/revise original words; and the risks of confusing supplied assembly, adult transcription or narration with independent writing/reading. Verify every sentence variant against its claimed action. No review clearance is supplied by the author.

Marble-derived names, meanings and relations retain attribution to Generative Spark, Inc. (Marble), with the existing ODbL1.0 database and CC BY-SA4.0 text layers. These paraphrased source descriptions are distinguished from original teaching decisions. Jane application MIT and lesson/document CC BY-SA layers remain separate; only design study occurred here. Preserve existing repository notices.

## Implementation source refresh — 2026-10-21

Current Marble `89fbffa3883c5ed9b6714f415f5f9292da682120` was fetched for this build. All 13 reviewed union nodes’ names, descriptions, evidence and incoming `(prerequisiteId,strength,reason)` triples match the reviewed upstream snapshot recorded above. The bundled differences remain explicit: spoken-instruction target `mt_r-BgS-lqTe` is upstream-only, and the feedback/self-review soft-edge direction differs from the pin. No source upgrade is included. Jane remains `d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`; its lesson formats, creative/fuzzy grader, stable pack stages, separate-example help and licensing were reread. Its creative grading is unsuitable for these exact ungraded messages; original finite action rules and local human-read snapshots are implemented separately. Existing Message/Letter/Loft code supplies interaction/preservation conventions, without changing those drafts. No new upstream code, lesson text or media is copied.
