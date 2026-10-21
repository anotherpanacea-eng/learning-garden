# Bundle Exchange source audit — 2026-10-21

> Independent specification checkpoint: [review receipt](../reviews/52-55-independent-spec-review.md) accepts the bounded curriculum/access dispositions; earlier pending labels below preserve the authoring baseline. This does not approve runtime behavior or, for55, phonetic recordings/rights.

**Author research, pending independent review.** This supports [spec53](../specs/53-bundle-exchange.md). No new runtime activity or source-topic coverage is claimed.

## Source snapshots and overlap

Read the bundled Marble descriptions/evidence and incoming edge reasons at`96a7933754af672e1bfdbf7ecb05c325860c6e0d`, then compared the seven selected/ancestor nodes against refreshed [`2e6ced94833f0e48f6c1efad46e5f50c1f420f3c`](https://github.com/withmarbleapp/os-taxonomy/tree/2e6ced94833f0e48f6c1efad46e5f50c1f420f3c). Names, descriptions, evidence and incoming `(prerequisiteId,strength,reason)` triples match for all seven. Other metadata is not declared unchanged; the bundled pin is not upgraded.

Jane remains [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81). Its `LESSONS.md`, `src/engine.js`, `src/stuck.js` and `LICENSING.md` inform stable supplied items and separate optional help. No new Jane code, prose or assets are incorporated. The [official Common Core1.NBT page](https://www.thecorestandards.org/Math/Content/1/NBT/) was fetched/read for1.NBT.B.2a–c: a ten as ten ones, teens, and zero ones in multiples of ten. It informs the original design, not a learner level or efficacy claim.

Actual existing app code inspected: `dist/broad-content.mjs`, `broad-variants.mjs`, `broad-ui.mjs` and `broad-help.mjs`. It already presents tens/ones, digit-value questions and a ten-ones→one-ten action; its free add/remove model changes quantity. Therefore this proposal extends an existing experience with fixed-inventory, bidirectional exchange and explicit noncanonical grouping. It is not justified as filling a total absence of place-value work. Packing spec51's arbitrary capacities and remainder-purpose contrast are a different lesson.

## Exact crosswalk

Three targets have **six distinct transitive hard predecessors**, two of which are themselves targets. The union below has **seven unique nodes**. Every disposition is proposed and awaits independent semantic review.

| ID / role | Actual source meaning | Spec53 steps and disposition | Limit |
| --- | --- | --- | --- |
|`mt_WcfaSfVT33`, ancestor|One-to-one correspondence in counting objects.|1–3: countable constituent marks and optional guided counting.|No whole-range counting assessment.|
|`mt_dmNvjroCPT`, ancestor|Last count names the total; rearrangement does not change cardinality.|1–4: unchanged collection before/after grouping; optional repeated count.|No inference from one pictured task to general counting competence.|
|`mt_oAK9GXSfqV`, ancestor|Form digits0–9 correctly and legibly.|5–6: **motor/transcription exception**; tapping/typing/supplied numeral access instead of a handwriting requirement.|No handwriting attainment claim. This source requirement is recorded, not silently dropped.|
|`mt_fR0UtsSREU`, ancestor|Read/write numerals0–20 and match quantities to them.|1–3,6: supplied/adult-readable numerals and quantity matching for the selected collections.|No independent reading, dictation or handwriting evidence; values beyond20 are explained in their own tens/ones model.|
|`mt_xmmgAzxe5j`, target|Compose teens as ten ones and additional ones.|2–3:13 as a grouped ten plus3; separate16 example.|Not every teen numeral; no claim that the entire source evidence is met.|
|`mt_r0VXbfAmsH`, target|10 as a bundle of ten ones; exchange10 ones for one ten.|2–4: wrap/unwrap exactly ten, retaining total.|No arbitrary capacity or decimal-fraction unit change.|
|`mt_THl9GLxwoL`, target|Two digits represent amounts of tens and ones.|4–7: actual bundle count versus canonical tens digit/value, including noncanonical27 and42.|Selected two-digit meanings, not algorithms or full two-digit proficiency.|

Exact incoming hard relations within this union:

- `mt_THl9GLxwoL` requires`mt_r0VXbfAmsH` and`mt_xmmgAzxe5j`.
- `mt_r0VXbfAmsH` requires`mt_xmmgAzxe5j`.
- `mt_xmmgAzxe5j` requires`mt_dmNvjroCPT` and`mt_fR0UtsSREU`.
- `mt_fR0UtsSREU` requires`mt_dmNvjroCPT` and`mt_oAK9GXSfqV`.
- `mt_dmNvjroCPT` requires`mt_WcfaSfVT33`.
- `mt_oAK9GXSfqV` and`mt_WcfaSfVT33` have no incoming hard prerequisites.

The soft edge from digit formation to`mt_WBfj79OqXz` concerns lowercase-letter formation and pencil posture/control; its actual description was read. It informs the excluded motor/handwriting work, not an access prerequisite for exchanging pictured counters. It is outside the seven-node hard-closure count.

The teen-before-named-ten source ordering needs a deliberate bridge: count13, group10 plus3, then name/wrap that ten. This is not a dependency-cycle repair or an edited graph edge. The independent reviewer should examine whether the actual teaching makes that transition clear and whether the motor exception preserves the intended mathematical meaning.

## Mechanical design checks

Enumerated the complete fixed-total model for13,27,20,30,7,0 and42: **158 valid `(wrapped,loose,frame)` states** and **580 enabled action edges**, including the optional fill shortcut. Every edge preserves `10×wrapped+loose+frame=total`; each state can reach every other valid state for its own total through the allowed moves. The empty collection has one state and no enabled move. This is design arithmetic, not runtime verification or proof of pedagogy.

The seven-node closure, refreshed-source equality and crosswalk were checked separately from that enumeration. No source files, atlas references, completed-topic statuses or original Number Garden task records change in this packet.

## Review questions and attribution

Review the distinction between a wrapped shelf bundle and an unwrapped full frame, between physical bundle count and a written tens digit, and between digit and value. Reject any UI that counts a full frame twice, calls17 loose ones a ones *digit*, labels27 as117, or demands canonical grouping before a valid draft can be kept. Verify that0/7 do not prompt for an unwritten tens digit.

Review exact shown-example familiarity when this table and an existing Number Garden task share a fully displayed problem. Do not create blanket proficiency, rewrite prior responses, or call an already supplied exact answer fresh evidence.

Marble-derived IDs/meanings/relations retain the project's existing ODbL1.0 database and CC BY-SA4.0 text attribution to Generative Spark, Inc. (Marble). Original dispositions are author decisions. Jane's application MIT and lesson/docs CC BY-SA layers remain separate; no new incorporation occurs. Numerical enumeration and author research are not independent clearance.
