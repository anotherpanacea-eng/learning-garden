# 212. Quick Sums: adding and taking away at the crossings ledger

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/212-quick-sums-text.md); sources and open checks are in the [source audit](../source-audits/212-quick-sums.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** the two history anchors were checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The arithmetic is standard and every number is script-checked; it still needs the math check.

## Purpose

Addition and subtraction already have small, careful footholds: two-digit joining with one regrouped ten (spec 77), opening a ten to take away (spec 78), compare versus take-away with the same numbers (spec 91), and the supplied written ledgers for those cases (specs 107 and 110). Nobody yet teaches the **mental moves** (tens, bridging, counting up, compensation, near doubles), **three-digit and larger columns**, **missing numbers**, **estimating and checking**, or **two-step stories**. This pack takes 23 untouched Addition & Subtraction topics there (22 assigned, plus *Adding two two-digit numbers*, `mt_UQnAFPs83F`, added at independent review), from adding tens to a two-digit number up to multi-step problems with millions and decimals, plus one reassigned mental-calculation topic filed under Ratio (`mt_vmW2cb5c7A`, see Upstream check).

A child comes to understand that adding a ten changes the tens and leaves the ones alone, unless a column fills; that a jump to the next ten makes awkward sums easy; that the numbers decide the method (count up when they are close, compensate near a ten, columns when nothing tidy helps); that every carry or exchange is a real ten, hundred or thousand moving between places; that the equals sign means "is the same as", so a box can sit anywhere; that an estimate made **first** catches silly answers and an inverse check confirms exact ones; and that a two-step story is finished only when the question asked is answered, not the middle number.

**Builds on, never re-teaches:** spec 53's ten-bundle (one bag of ten here), spec 77's joining with one new ten and spec 78's opened ten (here three digits, two exchanges, and exchange across zeros), spec 91's compare meaning (here comparison stories and counting up), specs 107 and 110's supplied column writing for 24 + 17 and 42 − 17 (here the child writes every digit, at three digits and beyond), spec 121's number bonds in Shutters (here bonds scale to tens and hundreds), and spec 188's Nearest Post rounding (here rounding is used, never re-taught). **What is a revisit:** the opening bag-of-ten picture (T1) and the opened ten (T10's first step) are short recaps of specs 53 and 78, marked as such on screen. **Not targeted:** money topics (sibling spec 209), facts within 20 and the inverse fact (sibling 210), place value to 1000 and ten or a hundred more (sibling 211), rounding itself (spec 188), and the strategies topics spec 121 claims (`mt_PpWSHA-0kv`, `mt_zxST3MarI9`).

## Place and story

**Host:** the **Crossings Ledger** at the rebuilt footbridge, route `#numbers/bridge`, linked from Bundle Burrow's Join and Return turns, the Games Table, and the footbridge on the town map. A pebble pot by the handrail gets one pebble per crossing; the handrail is marked like a number line; the ledger book hangs on a hook. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 4 *mend the village* | The footbridge reopens. Pip drops a pebble for each crossing and bags every ten. By supper: 62. | Sprout: bags and loose pebbles. Seedling: add tens, bridge a ten. |
| II, ch. 1 *the weekly market* | Market day: 375 crossings against 148 on an ordinary day. Bramble says "twice as many". Dot checks. | Seedling: count up. Sapling: near doubles, comparing days. |
| III, ch. 1 *the floating market* | The first visitors from Vadoalto: 402 crossings, 137 of them traders. Hob Pennick wonders how many were Willowbank folk. | Sapling: exchange across a zero; estimate first. |
| III, ch. 2 *the seed exchange*; ch. 3 *the route by the high ford* | Nuria sees the ledger and wants Vadoalto to keep one. Wren Halloway's yearly ledger and route lengths come out. | Keeper's Desk: big numbers, decimals, multi-step plans. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, the bridge, the counts and every visitor are fiction, labeled apart from math, history and models. The old Keeper is not named (Hollis rule); no scene here needs the old Keeper at all.

## The knowledge

**Tens move, ones stay.** A bag holds ten pebbles. Adding 20 adds two bags; the loose pebbles do not change (34 + 20 = 54). Taking away tens works the same (76 − 30 = 46). A whole-tens subtraction is a small fact said in tens: 8 tens − 5 tens = 3 tens, 80 − 50 = 30, and the zero shows no loose ones. Adding 2 (ones) is a different move from adding 20 (tens).

**Bridging through ten.** Split the added number so the first jump lands on a ten: 58 + 6 = 58 + 2 + 4 = 64. On the handrail line: 47 + 36 is a jump of 30 to 77, then 3 to 80, then 3 to 83. Counting on in ones is never banned; the rail shows the bigger jumps beside it.

**Mental moves for two and three digits.** *Count up* to subtract close numbers: 82 − 79 is 1 to 80 and 2 more, so 3; 403 − 397 = 6. *Compensation*: add a near-ten and fix it, 54 + 39 = 54 + 40 − 1 = 93. *Near doubles*: 35 + 36 = 35 + 35 + 1 = 71. *Which digit changes?* Adding tens to a three-digit number changes the tens (263 + 30 = 293) unless the tens fill past nine, when the hundreds change too (283 + 40 = 323); adding hundreds changes only the hundreds while the answer stays under 1000 (263 + 400 = 663); adding ones bridges a ten the same way (263 + 8 = 271). *Larger numbers*: a known fact scales by place value (7 + 5 = 12, so 7,000 + 5,000 = 12,000), and counting up from a round number avoids exchanging through zeros (10,000 − 3,600: 400 to 4,000, then 6,000, so 6,400). *Mixed operations in your head* (Keeper's Desk, `mt_vmW2cb5c7A`): the same moves carry into multiplying. Partition (48 × 6 = 40 × 6 + 8 × 6 = 288), compensate (50 × 6 − 2 × 6 = 288, taking away 12, not 2), and derive from a known fact (6 × 4 = 24, so 6.5 × 4 = 24 + 2 = 26; 25 × 4 = 100, so 125 × 4 = 500). In a mixed string, multiply before adding (125 × 4 + 350 = 850); the agreed order itself is proposed spec 192's, recapped here only. Times-table facts are assumed (proposed spec 190 owns them; spec 51 on main shows facts as exposure only). *Adding a list*: look for pairs that make tens first (26 + 14 = 40, 17 + 23 = 40, total 80); with no tidy pair, add the tens, add the ones, and bag every full ten (24 + 37 + 16 + 23: ones make 20, which is two tens, total 100).

**Columns, with the regrouping in place value.** Line up ones under ones, starting from the right. Addition: 348 + 175, ones 8 + 5 = 13, so 3 ones and **one ten moves to the tens**; tens 4 + 7 + 1 = 12, so 2 tens and **one hundred moves to the hundreds**; hundreds 3 + 1 + 1 = 5; total 523. Subtraction: 503 − 248 needs 8 ones from 3 and there are no tens, so open a hundred into ten tens, then a ten into ten ones: 4 hundreds, 9 tens, 13 ones; 13 − 8 = 5, 9 − 4 = 5, 4 − 2 = 2; answer 255. The same rule runs for four digits (4,006 − 1,358 = 2,648), six digits (300,000 − 146,259 = 153,741), numbers of different lengths (5,386 + 978 + 2,459 = 8,823, where the ones make 23, so **two** tens move), and decimals, where the decimal points line up (3.45 + 2.8 = 6.25; 12.6 − 4.85 = 7.75). The bugs named on screen: taking the smaller digit from the bigger in each column, a forgotten carry, misaligned digits.

**Mental or written?** Read the numbers first. Close numbers: count up. Near a ten or hundred: compensate. A known fact in disguise: scale it. Messy numbers with several exchanges: columns. A screen jotting (the handrail line, a bar) supports a mental method; it does not replace it.

**Missing numbers.** The equals sign means "is the same as". A bar model shows whether the box is a part or the whole. 186 + □ = 250: count up (4, 10, 50) or take away (250 − 186): 64. □ − 140 = 260: the box is the whole, so add: 400. 600 − □ = 365: the box is a part, so 235. Always put the number back in to check.

**Estimate first, check with the inverse.** Round each number to a fair place, before working: 395 + 412 is about 400 + 400 = 800, so 1,507 and 87 are silly and 807 is sensible. An estimate rules out silly answers; it cannot prove an answer exact. Check a subtraction by adding back (634 − 287 = 347; 347 + 287 = 634), never by doing the same subtraction again, which repeats the same slip. Accuracy fits the job: the ledger keeps 52,384; a notice can say "about 52,000"; "about 100,000" is too rough to be useful.

**Stories in steps.** Draw the story as bars before choosing operations. Name the middle number so it is not given as the answer. Words like "fewer", "longer" or "left" do not choose the operation; the story does (the new plank is 72 cm, 18 cm longer than the old one, so the old one is 72 − 18 = 54 cm). Lengths start from 0 on a ruler; count the spaces, not the marks. Every answer carries its unit (cm, m, km, crossings) and gets a last "does this fit the story?" look.

**Real anchors (see audit).**
- **The plus and minus signs in print.** Johannes Widmann's arithmetic book for merchants, *Behende und hübsche Rechenung auff allen Kauffmanschafft*, printed in Leipzig in 1489, is the first known printed book to use + and −. He used them to mark goods that were over or under a weight (surplus and deficit), not yet as signs for adding and taking away.
- **The suanpan.** The Chinese bead frame has rods for places; on each rod an upper bead counts five and a lower bead counts one (the common pattern has two upper and five lower beads). When a rod fills, the user clears it and moves one bead on the next rod to the left: a carry, done by hand. Cheng Dawei's *Suanfa tongzong* (1592) became the best-known Chinese manual for it. Sources differ on when the bead frame first appeared and on the earliest picture of it, so child text gives no first date.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 2-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Tally Pot | T1, T2 | Two more bags (2 steps) | Set A |
| Handrail Jumps | T3-T8, T18 | 47 + 36 on the rail (3 steps) | Sets A, B; F2, F7, F8 |
| Ledger Columns | T9-T11, T17 | 348 + 175 with counters (4 steps) | Set C |
| Balance Box | T13 | 186 + □ = 250 (3 steps) | Set D |
| Estimate Gate | T12, T14, T15 | Sensible or silly? (3 steps) | Sets D, F |
| Step Planner | T16 | Morning, afternoon, how many more? (4 steps) | Sets E, F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists them); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** adding tens vs adding ones; 80 − 50 vs 80 − 5; a jump to the ten vs counting in ones; the tens digit changing vs the hundreds changing too; count up vs columns on close numbers; a carry vs no carry; one ten moving vs two; smaller-from-bigger vs opening a ten; a box as a part vs the whole; estimate before vs after; adding back vs redoing; the middle number vs the answer; "longer" meaning add vs meaning take away; exact for the ledger vs rounded for a notice.

**Top misconceptions designed against:** a ten added as ones (52 + 30 = 55); the dropped ten-unit (90 − 40 = 5); the lost bridged ten (47 + 8 = 45 or 415); "only the tens ever change" (386 + 50 = 336); smaller-from-larger in any column (602 − 375 = 373); a forgotten or single carry when two tens move; a dropped partial product (48 × 6 = 240); compensation adjusted by the wrong amount (298); adding before multiplying in a mixed string; misaligned digits and decimal points; always using columns; the operator view of "=" (38 + □ = 65 answered 103); box-position confusion; estimates made after the answer; checking by repeating; close-to-estimate means correct; stopping at the middle number; keyword operations; counting ruler marks instead of spaces; more digits are always better.

## The game or activity

**(a) Tally Pot, model `tally-pot-v1`.** A clay pot with pebbles, and cloth bags that hold exactly ten. Buttons add or take a pebble or a bag; **Bag up ten** turns ten loose pebbles into one bag and **Open a bag** does the reverse. A **digit card** under the pot shows tens and ones and lights the digit that just changed. Sprout mode hides every numeral and asks with pictures (more bags, fewer bags, did the loose pile change?). Range 0-99. *A made-up model: one pebble for each crossing; real bridge counters use clickers or sensors.*

**(b) Handrail Jumps, model `rail-jumps-v1`.** The handrail is a number line with a post at every ten (0-100) and a second rail with a post at every hundred (0-1000). The child drags or taps jump tiles (+1 to +9, tens, hundreds, and back jumps) and the jumps draw as arcs with their sizes. Strategy cards set up a move: **Jump to the ten**, **Count up**, **Jump past, step back** (compensation), **Double and adjust**. A three-column **Which digit changes?** chart asks for a prediction first, then lights the digits that changed. *A made-up model: the rail's posts are evenly spaced, as a ruler's are.*

**(c) Ledger Columns, model `ledger-columns-v1`.** A ruled ledger page with column headings (hundred-thousands to ones, and a decimal point column at Keeper's Desk), and place-value counters in matching trays above. **Bag ten** moves ten counters into one counter of the next tray left, and a small carried digit appears in the next column at the same moment; **Open one** does the reverse and the crossed-out digit and new digits appear together. The child types every digit. **Spot the slip** shows a worked column with one named bug to find. *A made-up model: counters stand for crossings; the ledger page has no limit on columns, but practice stays within six places.*

**(d) Balance Box, model `bar-box-v1`.** A bar model: a whole bar over two part bars, one of them a box. The child taps which bar is the box, chooses **count up** or **take away** (or **add the parts** when the box is the whole), types the number, then **Put it back** substitutes it into the sentence and shows both sides equal or not. *A made-up model: bar lengths are drawn to scale.*

**(e) Estimate Gate, model `estimate-gate-v1`.** A sum appears with three friends' answers face down. The child rounds each number on a small post line (spec 188's picture, reused), places an estimate, then the answers turn over and the child sorts each into **sensible** or **silly**, and picks a check: **add back** or **do it again the same way**. The answers stay face down until an estimate is placed (as spec 178's prediction band); **Skip for now** is always there. *A made-up model: the friends and their answers are invented.*

**(f) Step Planner, model `step-planner-v1`.** A story card, a bar strip to drag lengths onto, and two step boxes. Each step gets an operation, a number sentence, a method tag (**in my head**, **a jotting**, **columns**) and a name for its result. The final box asks the story's question again. Keeper's Desk cases use Wren's yearly ledger and route lengths. *A made-up model: all counts and routes are invented.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit. Nothing says "wrong"; feedback names what the answer counts and what to look at.

## Problem sets

Six sets, **38 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Bags and jumps | Sprout (A1-A3), Seedling (A4-A6) | 6 | picture 3-choice, number, 3-choice |
| B. Quick moves | Seedling (B1-B3), Sapling (B4-B6) | 6 | number with steps, 3-choice |
| C. Ledger columns | Sapling (C1-C4), Keeper's Desk (C5, C6) | 6 | number with steps, spot the slip |
| D. Boxes and checks | Seedling (D1), Sapling (D2-D6) | 6 | 3-choice, number |
| E. Stories in steps | Seedling (E1, E2), Sapling (E3, E4), Keeper's Desk (E5, E6) | 6 | number, 3-choice, *say why* |
| F. Wren's year and the old signs | Keeper's Desk (F1-F8) | 8 | number, 3-choice, true / not true from this source |

Sprout items use pictures and words, no numerals. Over the 18 three-choice items the right answer sits at A, B and C six times each. *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `crossingsLedger` per explorer, absent until a first explicit action.

```
crossingsLedger: {
  version: 1,
  pot:     { source, bags: 0-9, loose: 0-9, at },                       // latest only
  jumps:   [{ source, caseId, start, jumps: [int], predict: 'O'|'T'|'H'|'TH', at }], // latest 12
  columns: { [caseId]: { source, digits: [str], carries: [str], at } },
  boxes:   { [caseId]: { source, boxAt: 'part'|'whole', method, value, at } },
  plans:   { [caseId]: { source, steps: [{ op, value, method, name }], at } },
  answers: { [itemId]: { source, choice | value | order | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only; step names are chosen from fixed tags, never typed. Validate ids and ranges only (bags and loose 0-9; digits single characters 0-9 or the point); never recompute or rewrite saved results on load, and never mark a saved column "fixed". An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M1** mental and written addition and subtraction to 10,000,000 and decimals, missing numbers, estimating; **M7** choosing a method and saying why, checking; **M4** length word problems; **M3** mental multiplication in mixed strings (Keeper's Desk only); **H1** a printed book and a calculating tool as sources. Act families: I, II, III.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Add and subtract tens, hundreds and ones mentally, bridging where needed; choose count up, compensation or near doubles from the numbers; add lists by pairing; use columns with regrouping explained in place value, to six digits and decimals; find a missing number in any position and check it; estimate first and check by the inverse; plan and solve two-step and multi-step stories, including lengths; partition, compensate and derive facts for mental mixed operations. |
| Teaching encounter | T1-T18 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Digit card; jump arcs; Which digit changes? prediction; counters moving with carried digits; Put it back; face-down answers; step boxes; the "I'm stuck" ladder. |
| New application | Market day against an ordinary day; the traders' crossings across a zero; Wren's yearly ledger in millions; route lengths in decimals; Widmann's surplus marks. |
| Purposeful revisit | Spec 53 bags of ten; specs 77/107 one regrouped ten; specs 78/110 the opened ten; spec 91 compare meaning; spec 121 bonds; spec 188 rounding posts. |
| Data boundary | Settings, jumps, digits, choices, values, method tags and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`. All 22 assigned targets fit the topic as described; none dropped. A 23rd, `mt_vmW2cb5c7A`, was reassigned to this pack during writing: its pinned name is *Ratio (age 10+)* (domain Multiplication & Division), but its description and research record are mental calculation with mixed operations, so it joins the mental-strategies strand at Keeper's Desk only. A 24th, *Adding two two-digit numbers* (`mt_UQnAFPs83F`), was in no pack's assignment; independent review added it because the pack teaches the whole described topic (two two-digit numbers added and subtracted with bags and counters, rail jumps and mental moves, with the strategy explained). It builds on the existing atlas explanation references in Joining Ledger and Returning Ledger (specs 107 and 110: supplied picture-to-writing for 24 + 13, 24 + 17 and 42 − 12 or 17), which stay task-level references.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Adding and subtracting tens mentally (`mt_I5j1ZWo2cn`) | Bags added while ones stay; contrast adding ones. Tally Pot digit card; T1; A1, A4. |
| Subtracting multiples of 10 (`mt_HJTuIGHvcR`) | A small fact said in tens; contrast 80 − 5; counting back allowed. T2; A2, A5. |
| Adding within 100 (`mt_glPPG-kTQY`) | Make-ten split; tens land on tens; strategy before columns. T3, T4; A3, A6. |
| Fluent adding and subtracting within 100 (`mt_cChv2j_-Da`) | A repertoire and the choice; inverse to check; smaller-from-larger met with regrouping. T5, T6; B1, B2, D1. |
| Adding two two-digit numbers (`mt_UQnAFPs83F`) | Compose a ten when the ones pass nine and open a ten when there are too few; same calculation moved from objects to pictures to a jotting; count up for a difference; ask why the answer is not 415-style digit gluing. Tally Pot bags and Open a bag; rail jumps (T4); count up (T5); compensation and near doubles (T6, T7); A6, B1, B2, D1, E1, E2. Builds on the Joining and Returning Ledger explanation references (specs 107, 110). |
| Mentally adding tens to 3-digit numbers (`mt_aHQ9kNt3is`) | Predict the changing digit; non-bridging beside bridging a hundred. T8; B4. |
| Mentally adding hundreds to 3-digit numbers (`mt_xPqczp7zPX`) | Only the hundreds move; answers stay under 1000. T8; B5. |
| Mental addition and subtraction, age 7+ (`mt_oDU_8zMZjp`) | Ones change unless bridging; a downward bridge. T8; B6. |
| Addition and subtraction within 1000 (`mt_ewmuMMPAzP`) | Counters and record show the same exchange; both boundaries; across a zero. T9, T10; C2. |
| Fluent adding and subtracting within 1000 (`mt_HFRYjTb-Z5`) | Method fits numbers; count up close pairs; columns only when nothing tidy helps. T12; B3, C2. |
| Adding numbers (`mt_TiQbi027PE`) | Pairs to tens first; fallback partition; more than one ten composed. T17; C1. |
| Adding and subtracting, age 7+ (`mt_SrrsLiJkr3`) | Expanded meaning behind compact carries; alignment; spot the bug. T9, T10; C2, C3. |
| Adding and subtracting, age 8+ (`mt_mpS-JK_p_m`) | Four digits, across zeros, mixed lengths, estimate and inverse. T11; C4, C5. |
| Adding and subtracting, age 9+ (`mt_-F_Lv_apzH`) | Bars first, every step named, method per step, a final sense check. T16; E4, E6. |
| Adding and subtracting, age 10+ (`mt_M1tnXqmYbn`) | Millions and decimals; a running estimate; answer the question asked. C6, E5, F3. |
| Fluent addition and subtraction, age 9+ (`mt_Yw1_4Nfsql`) | Same rule, more columns; zeros cascade; a carry of two. C5, F1. |
| Mental addition and subtraction, age 9+ (`mt_MWXPiaTnEu`) | Scaled facts; count up from round numbers; jottings support. Knowledge, F2. |
| Mental and written addition and subtraction (`mt_wzAZ8qFDc4`) | Structure first; units; mental or written by judgement. T12; E1, E2, B3. |
| Missing number problems, age 7+ (`mt_XuHmIn2xje`) | "=" as balance; box in every position; substitute to check. T13; D1-D3. |
| Estimating by rounding (`mt_QaYfeVL-0C`) | Estimate before; inverse as an independent check; close is not proof. T14, T15; D4-D6. |
| Checking Answers by Rounding (`mt_G3sVFQNCme`) | Prove an answer impossible without redoing; accuracy for the job. F4, F5. |
| Two-step addition and subtraction problems (`mt_CDa5AVakLE`) | No keyword rules; name the middle number; plan the order. T16; E3, E4. |
| Addition and subtraction word problems, lengths (`mt_DLcEzmmj2r`) | Model before calculating; comparison and cut-off stories; units; from 0. E1, E2. |
| Ratio, age 10+ (`mt_vmW2cb5c7A`; description: mental calculation with mixed operations and large numbers) | A repertoire (partition, compensate, derive) and when each fits; a dropped partial and an unadjusted compensation named; multiply before adding; estimate to sanity-check; jottings, never a column in the head. T18; F7, F8. No ratio content is claimed or taught. Scope is narrow: multiplication with addition in Keeper's Desk strings; mental division is not practiced here. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied. Marble research paraphrased; its example numbers are not reused.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Adding and subtracting tens mentally | 10 More or 10 Less (`mt_kw7xmp68rU`) | Met elsewhere: proposed spec 211 (math build-out). Recapped in T1. |
| Adding and subtracting tens mentally; Adding within 100 | The two digits of a two-digit number (`mt_THl9GLxwoL`) | Met elsewhere: spec 53 Bundle Exchange (main, scoped practice). T1 recap. |
| Subtracting multiples of 10 | The multiples of 10 (`mt_zfy1gOEewd`) | Met elsewhere: proposed spec 211 (math build-out). |
| Subtracting multiples of 10 | Subtraction as taking away or separating (`mt_zuKAX6lcYR`) | Met elsewhere: specs 78 and 131 (main) as take-away pictures. No claim. |
| Adding within 100 | Addition and subtraction within 20 (`mt_m1W6nTQJ2b`) | Documented gap: in no pack's assignment and no spec's claims (spec 131 explicitly excludes it). Existing Number Garden authored tasks are an atlas task reference only. Supported inline (T3 make-ten split; proposed spec 210 teaches making ten through partners of ten); no claim. Worded the same way in spec 210. |
| Fluent within 100 | Adding within 100 (`mt_glPPG-kTQY`) | Taught here (T3, T4). |
| Fluent within 100 | Fluent adding and subtracting within 20 (`mt__t4afSyZRm`) | Met elsewhere: proposed spec 210 (math build-out). |
| Tens, hundreds and ones to 3-digit numbers (three targets); Within 1000 | The three digits of a three-digit number (`mt_aPBzD28_mT`) | Documented gap: in no pack's assignment and no spec's claims. Existing Number Garden authored tasks are an atlas task reference only. Supported inline (digit card, T8 chart; proposed spec 211 teaches the hundreds around it); no claim. Worded the same way in spec 211. |
| Tens and hundreds to 3-digit numbers | 10 or 100 More or Less (`mt_izien3ZX51`) | Met elsewhere: proposed spec 211 (math build-out). |
| Mental, age 7+ | none hard beyond the above | n/a |
| Within 1000; Adding numbers; Adding and subtracting, age 7+ | Fluent adding and subtracting within 100 (`mt_cChv2j_-Da`) | Taught here (Sets A, B before C). |
| Fluent within 1000; Adding and subtracting, age 7+ | Addition and subtraction within 1000 (`mt_ewmuMMPAzP`) | Taught here (T9, T10). |
| Fluent within 1000; Adding and subtracting, age 8+ | Adding and subtracting, age 7+ (`mt_SrrsLiJkr3`) | Taught here (C2, C3). |
| Adding numbers | Adding Three Small Numbers (`mt_Zx1xZM-RbX`) | Met elsewhere: proposed spec 210 (math build-out). |
| Adding and subtracting, age 8+ | Place value of each digit (`mt_jY7uf0Cb7o`) | Met elsewhere: proposed spec 188 (math build-out), which claims it after review. Ledger headings recap the places. |
| Adding and subtracting, age 9+ | Two-step problems (`mt_CDa5AVakLE`); Fluent, age 9+ (`mt_Yw1_4Nfsql`) | Taught here (Sets E, C, F). |
| Adding and subtracting, age 10+ | Adding and subtracting, age 9+ (`mt_-F_Lv_apzH`) | Taught here (E4, E6). |
| Adding and subtracting, age 10+ | Reading and writing numbers to 10,000,000 (`mt_Gag_h98jWP`) | Met elsewhere: proposed spec 188 (math build-out). |
| Fluent, age 9+ | Adding and subtracting, age 8+ (`mt_mpS-JK_p_m`) | Taught here (C4, C5). |
| Mental, age 9+ | Mental, age 7+ (`mt_oDU_8zMZjp`) | Taught here (B6). |
| Mental and written | Adding two two-digit numbers (`mt_UQnAFPs83F`) | Taught here (added at review; T4-T7, Tally Pot, Sets A, B before E). |
| Adding two two-digit numbers | Mental addition and subtraction, age 6+ (`mt_AKAtWEwpcj`) | Met elsewhere: proposed spec 210 (math build-out); bridging recapped in T3. |
| Adding two two-digit numbers | Adding and subtracting tens mentally (`mt_I5j1ZWo2cn`) | Taught here (T1, T2 before T4). |
| Missing number problems | Two-Step Word Problems (`mt_yTWxkzzoOZ`) | Documented gap: in no pack's assignment. Existing Number Garden authored reasoning tasks are an atlas task reference only. Supported inline (T16, E2, E3, E4); no claim, because this pack has no two-step stories within 100 (owner question 3). |
| Estimating by rounding | Inverse: addition undoes subtraction (`mt_ehGS_uVSJv`) | Met elsewhere: proposed spec 210 (math build-out). T15 recap. |
| Checking Answers by Rounding | Rounding Large Numbers (`mt_5NwqN6pf_A`) | Met elsewhere: proposed spec 188 (math build-out). |
| Checking Answers by Rounding | Estimating by rounding (`mt_QaYfeVL-0C`) | Taught here (T14). |
| Two-step problems | Adding and subtracting, age 8+ (`mt_mpS-JK_p_m`); Missing number problems (`mt_XuHmIn2xje`) | Taught here (C4, C5; D1-D3). |
| Word problems (lengths) | Comparing lengths by measuring (`mt_xWg0lI_gG4`) | Met elsewhere: proposed spec 208 (math build-out). |
| Ratio, age 10+ (`mt_vmW2cb5c7A`) | Mental addition and subtraction, age 9+ (`mt_MWXPiaTnEu`) | Taught here (F2 before F7, F8). Times-table facts (not a listed prerequisite) are assumed; proposed spec 190 (math build-out) owns times tables. Spec 51 on main shows facts as exposure only. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 127, 128, 137-151) claims these 24 targets (`mt_UQnAFPs83F` rechecked at review: unclaimed on main, in drafts and in the assignment map). Proposed spec 191 names `mt_G3sVFQNCme` as "met elsewhere: planned spec 212".

## Checks for implementation

- **Numbers script (2026-10-25):** `check212.py` (`python3 -I`, scratch area, not in the repo), 92 checks passing: scenes 34 + 20 = 54, 54 + 8 = 62; 375 − 148 = 227 (count up 2 + 50 + 175); 148 + 148 = 296 = 150 + 150 − 4, so 375 is more than double; 402 − 137 = 265. Teach cards T1-T17 (including 348 + 175 = 523 with column sums 13, 12, 5; 503 − 248 = 255 via 4 | 9 | 13; 2,647 + 1,585 = 4,232; 3.45 + 2.8 = 6.25; 186 + 64 = 250; 634 − 287 = 347 and back). Every item answer and every distractor is regenerated from its named error: A4 82 (55); A5 50 (5); A6 55 (45, 415); B1 92 (94, 82); B2 71 (70, 61); B3 6; B4 436 (3136, 336); B5 424 (721, 1024); B6 536 (544); C1 100 with ones 20 (90); C2 752 (652, 742); C3 227, smaller-from-larger 373; C4 2,648 (3,352); C5 8,823, ones 23 (8,813 one carry, 17,625 misaligned); C6 7.75 (7.21, 8.25); D1 27 (103, 33); D2 400 (120); D3 235 (965); D4 800 (700); D5 801; E1 37 cm (91, 43); E2 54 cm (90); E3 126 (474); E4 693 (278, 552); E5 0.35 km (6.25, 3.73); E6 8,945 (31,055); F1 153,741 (246,259); F2 6,400 (6,600, 7,600); F3 5,483,630 and 516,370, estimate 5,500,000; F4 75,777 against 75,000 and 5,777; F5 52,000; T18 6.5 × 4 = 26 and 125 × 4 = 500; F7 48 × 6 = 288 (240 dropped partial, 298 adjusted by 2); F8 125 × 4 + 350 = 850 (44,250 adding first). Every worked column step (C2, C4, C5, C6, F1) is recomputed digit by digit. Missing-number items brute-forced for a unique solution in 0-1000. Decimals use exact `Decimal`.
- Columns never let a digit cell hold two digits; carried digits appear only with a counter move. The Which digit changes? prediction is asked before the result. Answers in Estimate Gate stay face down until an estimate is placed; Skip is always available. Model lines show on every bench. Sprout items show no numerals; feedback never says "wrong".
- Style check run on the companion: no em-dashes; teach cards at most 30 words; prompts at most 15 words; feedback and explanations at most 20 words.
- Browser at 320 and 820 px: targets 44 px, tap-to-place as well as drag; six-column ledger scrolls inside its own frame, never the page; every jump arc and bar has a text equivalent ("Jump 30, from 47 to 77").
- Nuria's Spanish line checked by a fluent reader before build.
- **Independent review, 2026-10-25.** A separate reviewer recomputed every item, distractor, worked column and model number with an independent `python3 -I` script (140 checks across specs 210-212, all passing; decimals exact), recounted the 18 three-choice answers (6/6/6) and reran a style check (0 em-dashes in all three files; word limits met). Each target was read against its pinned description and research record. `mt_vmW2cb5c7A` is honest as a narrow Keeper's Desk claim (partition, compensation, derived facts, multiply before adding; no ratio, no mental division). Changed: `mt_UQnAFPs83F` added as a target (upstream row, two crosswalk rows) because the pack teaches the whole topic, building on the Joining and Returning Ledger references; `mt_yTWxkzzoOZ` left supported inline (no two-step stories within 100); `mt_jY7uf0Cb7o` now met elsewhere by spec 188, which claims it; `mt_aPBzD28_mT` and `mt_m1W6nTQJ2b` worded as documented gaps with atlas task references, matching specs 211 and 210; "times tables met by spec 51" corrected (spec 51 is exposure only; spec 190 owns them). In the companion: four uses of "wrong" in child text replaced; E4's choices made bare numbers so the two-step choice is no longer the longest; C3's distractors lengthened to match the right answer; Scene 3 heading matched to the one chapter in the act table. The companion has no real duplication to trim beyond that.

## Review asks

**Math check:**
1. Are the column explanations ("one ten moves to the tens", "open a hundred into ten tens") accurate and consistent with specs 107 and 110's wording?
2. Is "an estimate rules out silly answers; it cannot prove an answer exact" pitched right for D5 and F4?
3. Is E5's decimal two-step (6.25 − 5.9) fair at Keeper's Desk with only tenths and hundredths?
4. Is counting up from a round number (F2) the right default for large mental subtraction here?

**Owner questions, with defaults:**
1. Route `#numbers/bridge` beside Bundle Burrow? *Default: yes.*
2. 24 targets in one pack, or split mental strategies (Sets A, B, D) from columns and stories (C, E, F)? *Default: one pack; Ledger Columns and Step Planner can ship as a second slice.*
3. *Two-Step Word Problems* (`mt_yTWxkzzoOZ`, within 100) stays supported inline: the pack's two-step stories run to 1000 and beyond. Add a short Seedling set of two-step stories within 100 and claim it? *Default: no; leave it supported inline and a documented gap.* (*Adding two two-digit numbers* was added as a target at review.)
4. First slice? *Default: Tally Pot and Handrail Jumps with Sets A and B, then Ledger Columns.*
