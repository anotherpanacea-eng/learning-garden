# 312 · Rising, steady and falling investigations

Proposed2026-10-30. Extend the existing generated Linear families at `#learn/math`; no new destination, learner score, automatic advancement or source-schema change. Six fixed lessons remain open, including the existing negative-rate `zero` lesson. This closes a repeatable signed/zero-rate contrast, not a general algebra course.

## Bounded mathematics and exact catalog

Keep the existing three challenge codes/labels, explicit creation, four pages, saved source structure, generation metadata version1, serial limit and domain whole turns0–6. A generated source is the canonical frozen teaching record; the serial is never used to reconstruct old work. No source/rule/key comparison on load and no historical rewrite.

For `k=serial%48`, `i=floor(k/2)%8`, `offset=k%2`, `t=2+floor(k/16)`, choose rate m by challenge:

| Challenge | Eight rates in index order | Own question |
| --- | --- | --- |
| revisit | 1/2,0,−1/2,1,−1,3/2,−2,2 | Output at the stated input t |
| unknown | 1/2,−1/2,1,−1,3/2,−3/2,2,−2 | Input to reach the stated output; rate is never zero |
| contrast | 1/2,0,−1/2,1,−1,3/2,−3/2,2 | Meeting input and common balance of two different rates |

For a single account, base=`m<0?max(0,−6−6m):m===0?4:−3`, then b=base+offset. For contrast, mB=m−1/2 and bB=b+t/2; use base=max(single-account base,−6−6mB−t/2), then b=base+offset. Every input0–6 and both models remain in the existing vertical range−6…16. Use exact half-unit rational strings and the existing parser/equality; do not convert saved values or compare displayed approximations.

Examples: revisit serial2 has m=0,b=4,t=2: all permitted outputs4, two-turn change0. Unknown serial2 has m=−1/2,b=0,t=2: output−1; (−1/2)x=−1 gives x=2. Contrast serial2 has A=4 and B=5−x/2: they meet at2turns/4tokens, B is higher before and A after. Contrast serial12 has A=−3x/2+5 and B=−2x+6: meet at2turns/2tokens; both fall and A falls less. Verify all examples and bounds with an independent arithmetic oracle, not just by accepting source answers.

## Teaching and contrasts

The same fictional net-token account remains: a negative balance means owed tokens, never a negative physical count. Every generated teaching page explicitly names the signed rate, starting balance, units and whole-turn domain. Rate tells change per turn; balance is the total at a turn. Positive rates increase, negative rates decrease, zero leaves the balance unchanged. Zero rate can occur at a nonzero balance; zero balance is a different statement.

Keep each family’s guided/own/return structure. Revisit teaches rate/start, output and total two-turn change. Unknown teaches subtracting a signed start from BOTH sides and dividing BOTH sides by a nonzero signed rate, then substituting. Subtracting a negative adds its opposite. Never generate a zero-rate inverse question or divide by zero; explain on zero-rate teaching that its starting balance occurs at every permitted input and any other target at none, without calling the finite domain “all real inputs.” Contrast retains rate gap1/2, start gap t/2 and a unique meeting t: a higher signed rate may mean falling less quickly; it does not alone imply the larger balance. Compare at t−1 and t+1 with the same units. Replace “gains/adds” wording that falsely implies an increase with accurate signed-change language.

Different-number help remains explicit optional support. For nonnegative primary rates retain the existing different model y=(5/2)x−4, x6/output11/product15. For negative primary rates teach the different model y=(−5/2)x+9: at6turns, product−15/output−6; undo+9 on both sides, divide by−5/2 and substitute. Actual own rates exclude±5/2 and own inputs are2–4; for revisit/unknown, the worked rate, solved input, product and output must differ from the own task. For contrast, the model pair and meeting input must differ; a coincident common output alone is permitted. Zero-rate help may additionally contrast a separate steady balance9 with unattainable target8. For contrast with nonpositive primary rate use a different pair A=−x+9, B=−2x+14: meet at5turns/4tokens, at4turns outputs5/6, at6turns3/2. For positive primary rate keep the existing different pair meeting at5turns/6tokens. Help records remain supported; supplied models never count as independent recall.

## Integration, adaptation and saved work

Reuse graph, exact table, input stepper and signed/fraction parser; no new visual module, style or animation. Moving the input must visibly show a horizontal constant balance for zero rate and a falling balance for negative rate. Same source supplies teaching, table, graph and numeric answers. Add one concise sentence to the existing generated-investigation chooser: new accounts can rise, stay steady or fall; saved visits retain their original rules. UI hints must use actual existing button labels.

Keep the existing suggestion mechanism: recent first responses from distinct frozen mathematical cases inform revisit/unknown/contrast; all choices remain open and there is no sign-specific mastery claim. Repeated zero-rate visits differing only in asked input are deduplicated by the existing model/own-answer key. Retries, optional help after first response, skips, page changes and chosen challenge do not rewrite first records or become successful evidence. No migration, new selection field or cross-subject change. Existing exploration counters/removal retain their contracts.

Before changing the generator, capture a small synthetic fixture using the shipped generator: three generated sources and saved drafts/checks/help/first/latest prose, plus an additive future sibling. Test import/restore/current-view/edit of a permitted existing field/new case creation without changing its source, answers, first check or kept versions. New and old sources can share generation.version1 because this is the saved source record format; actual source is authoritative, not the current catalog. No previously saved response is re-evaluated against the new pools.

Existing display exposure logic continues: positive integer rates expose corresponding positive whole facts; negative/fractional/zero rates do not invent positive facts. Pending related drafts retain their existing exposure handling. Failed preflight, unsupported roots, limit/refused input, save-off, separate explorers, Notes transfer and stale/detached action guards remain unchanged and must be regression checked where affected.

## Acceptance

Enumerate all48 cases in each family and representative later serials including the limit. Independently compute every field, value at each input, comparison intersection and ordering, parser/validator/exportability. Require positive/zero/negative coverage in revisit and contrast; positive/negative but no zero in unknown. Check sign-correct teaching and help with worked arithmetic distinct from own tasks; each catalog has48 distinct parameter/unknown prompts, while dedup does not inflate zero-rate repeated responses. Snapshot old fixture stays exact through continuation/import and relevant new creation; no saved-source equality with generator is allowed.

Run affected existing Linear source/browser suites. Native synthetic Chrome at320/820/1024: open successive generated zero and negative visits through real controls, change input with touch/keyboard, check table/output/graph, answer a signed input and falling-vs-steady comparison, invoke optional negative help, keep first/latest prose, reload/export/import, preserve a waiting other visit, switch explorers and invoke stale callbacks, and verify saving-off creates no browser notebooks. Inspect screenshots. Physical iPad/Safari/VoiceOver and learning outcomes are not proven by Chrome. Atlas graph coverage is unchanged.

Six independent spec lenses before code; exact-head independent Claude implementation clearance before PR/merge-commit/deploy; verify reviewed runtime equals merged runtime, all canonical static assets match, then hosted replay. PR254 stays held. Update roadmap/course routes to distinguish delivered311 journeys and this bounded signed-rate extension from the remaining general algebra and human/off-screen curriculum.

## Upstream design references

Refreshed2026-10-30: Jane e88f81a00553fb87818ef84c77a8800f0dcb33e4 [LESSONS](https://github.com/kentlangley/Jane/blob/e88f81a00553fb87818ef84c77a8800f0dcb33e4/LESSONS.md) and [licensing](https://github.com/kentlangley/Jane/blob/e88f81a00553fb87818ef84c77a8800f0dcb33e4/LICENSING.md), studied for purposeful teach/example/action/return. No age placement, review gates, budget or remote learner records adopted. Marble a0b6b577b2d1b124d9f8d6df501cca8e62133451 [topics](https://github.com/withmarbleapp/os-taxonomy/blob/a0b6b577b2d1b124d9f8d6df501cca8e62133451/data/topics.json), Linear Function Graphs mt_WBdHkc2HTf, Plotting Linear Graphs mt_-3udyo6VyB and Solving Linear Equations mt_QhFEDyIwSO, studied as boundaries. No new taxonomy edges, upstream code/prose/art or complete-topic claim. Original generator/teaching extends existing223; attribution remains intact.
