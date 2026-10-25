# 191. Long Orders: multiplying and dividing for the river exchange

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/191-long-orders-text.md); sources and open checks are in the [source audit](../source-audits/191-long-orders.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127); *La Garza* and its captain come from draft [spec 117](https://github.com/anotherpanacea-eng/learning-garden/pull/128) (draft PR #128) and are only scenery here. Standalone play stays open without either, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history anchors checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The arithmetic is checked by script and still needs the math check.

## Purpose

[Spec 51](51-parcel-packing-and-remainders.md) (Willow packing table, main) made full bags, loose envelopes and loaded trips from countable pictures, and named formal short division, written multiplication and decimal quotients as outside its scope. [Spec 50](50-whole-batch-gathering.md) compared whole copies of a recipe. [Specs 77, 78, 91](77-joining-supply-orders.md) and [107](107-place-value-sum-ledger.md) put addition and subtraction of supply orders into tens and ones and an aligned written sum. Nobody yet teaches **multiplying and dividing larger numbers**: the tens step, mental strategies, the properties as tools, "times as many", the area model and long multiplication, short and long division, what a remainder means in each story, decimals times whole numbers, and estimating to check. This pack takes thirteen untouched Multiplication & Division topics there.

A child comes to understand that multiplying by a ten scales a known fact, so the digits move a place and the point stays still; that a calculation can be turned, regrouped, split or rounded and fixed without changing its total, while division cannot be swapped; that "times as many" copies an amount and "more" adds to it; that each partial product in a long multiplication is one rectangle of the area model; that division can take away chunks of the divisor; that the same division gives different correct answers in different stories; and that an estimate catches size mistakes but never proves the last digit.

**Builds on, never re-teaches:** spec 51's full groups, leftovers and "one more trip" (here: written methods, larger numbers and five remainder meanings); spec 50's whole-number comparison (here: unknowns in every position, with an equation); spec 107's tens-and-ones columns (here: rows of partial products); spec 77/78's ten-bundles (here: ten tens make a hundred). **Not targeted:** times-table recall (`mt_K5jM7vlVhA`, `mt_WX30dzi4dt`; a multiples list is always on screen), multiplying two decimals, dividing by a decimal, and *Division with Decimals* (`mt_lU-2aTRB9f`), whose written decimal division is only supported inline here.

## Place and story

**Host:** **the Exchange Shed** at the landing, route `#numbers/long`, beside Bundle Burrow's supply-order routes (`#numbers/join`, `#numbers/return`, `#numbers/compare`), linked from the Number Garden, spec 51's packing table (`#post/packing`) and, if built, spec 117's River Market. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| III, ch. 1 *the floating market* | *La Garza* brings Nuria's order card: 36 crates of 24 jars. Pip counts jars one by one; Bramble adds 24 and 36 and gets "about sixty". | Sapling: area model and estimate (D1, F1). |
| III, ch. 2 *the seed exchange* | Nuria asks for three times as many seedling bundles as last year; the orchard keeper packs three more. | Sprout and Seedling: Compare Bars (C1-C3). |
| III, ch. 4 *letters up and down the river* | Nuria's autumn order: 150 crates at 36 a trip, and 50 kg of flour for 8 bakers. Her cousin says "4 trips, 6 left over". | Sapling: trips (E5). Keeper's Desk: flour (E6). |
| V, path 4 *a traveling show* | Vadoalto's square fits 23 rows of 15 chairs; the librarian must print exactly enough tickets. | Sapling: area model, columns, estimate (T8, T9). |

Act VI ch. 2 (*compare routes and keep a plan*) may later reuse the Share Ledger for trip counts as a purposeful revisit; no adapter is proposed here. One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The towns, barge, orders, prices and characters are fiction, labeled apart from math, history and models. The old Keeper is never named or mentioned (Hollis rule): the Act III scenes have no reference to them, and the Act V scene does not need one.

## The knowledge

**Multiplying by tens.** 30 is 3 tens, so 4 × 30 = 4 × 3 tens = 12 tens = 120 (known fact, then place value; the associative property underneath). Tens times tens make hundreds: 50 × 40 = 20 hundreds = 2,000, a case where counting zeros goes wrong because 20 already ends in one. Dividing works the same way: 360 ÷ 9 = 36 tens ÷ 9 = 4 tens = 40.

**Times and divided by 10, 100, 1,000.** Each column is worth ten times the one to its right, so ×10 moves every digit one place left, ×100 two places, ×1,000 three; dividing moves them right. The decimal point stays fixed as the marker of the ones place; empty places get placeholder zeros (45.2 ÷ 1,000 = 0.0452). "Add a zero" is never taught: it fails for decimals (0.35 × 100 is 35, not 0.3500). "Move the point" is not used as a rule either, since it hides why.

**Mental strategies.** ×0 and ×1 by meaning (six empty crates hold 0 jars; one crate of 35 holds 35). Three factors: pick the easy pair (2 × 9 × 5 = 10 × 9). Halving and doubling (16 × 5 = 8 × 10). Partitioning (7 × 15 = 70 + 35; both parts are multiplied). Compensation (19 × 6 = 120 − 6; the fix is one group of 6, not 1). Each is chosen for the numbers, and none is the one right way.

**Properties as tools.** Swap the order (commutative), group any pair first (associative), split a factor and multiply each part (distributive). Division and subtraction cannot be swapped: 24 ÷ 4 = 6, 4 ÷ 24 < 1. The names appear only in the glossary and at Keeper's Desk; the child uses the moves.

**Multiplicative comparison.** "3 more" adds a fixed amount (7 + 3 = 10); "3 times as many" makes 3 copies (3 × 7 = 21; "28" is the "three times more" slip). The position of the unknown decides the operation: compared amount (multiply), the smaller amount (36 = □ × 4, divide), or the factor (45 = □ × 9, divide). A bar model and an equation with □ appear together every time.

**Area model, then long multiplication.** A rectangle split into tens and ones gives every partial product: 24 × 36 = 600 + 120 + 120 + 24 = 864. The column method does the same work in rows: row 1 multiplies by the ones digit, row 2 by the tens (so it ends in a placeholder zero because it is ×30, not ×3), then the rows are added. Order: 2-digit × 1-digit area recap (13 × 12 guided), 2-digit × 2-digit, 3-digit × 2-digit (214 × 23 = 4,922), then 4-digit × 2-digit at Keeper's Desk (1,436 × 27 = 38,772). Each row is annotated with the rectangle it came from.

**Decimals times a whole number.** Partition by place (1.6 × 4 = 4 + 2.4) or scale to tenths or cents and back (2.4 × 3 = 72 tenths = 7.2; $3.47 × 6 = 2,082 cents = $20.82). Always estimate to place the point (about 2 × 3 = 6). Decimal points are not lined up as in addition. One factor is always whole.

**Short and long division.** Short division shares the biggest place first and carries the leftover into the next place (96 ÷ 4 = 24; 87 ÷ 4 = 21 r 3). Long division by a 2-digit divisor is taught first as chunking with a multiples list (864 ÷ 24: take 720, then 144; 30 + 6 = 36), the transparent version of the compact layout; the compact steps (divide, multiply, subtract, bring down) are shown beside the chunks at Sapling and up. Short division by a 2-digit number is offered when the divisor's multiples are easy (384 ÷ 16 = 24), and the child chooses: neither method is "better". Every division ends with multiplying back (quotient × divisor + remainder).

**What the remainder means.** One division, several right answers, chosen by the story: **round up** when everything must travel (150 ÷ 36 = 4 r 6, so 5 trips); **round down** when only complete groups count (87 jars make 21 full boxes); **share the rest** as a decimal when the thing can be split (50 kg ÷ 8 = 6.25 kg; "6.2" is the remainder-digit slip) or as a fraction (1,000 L ÷ 24 = 41 r 16 = 41 2/3 L). A count of trips is never a decimal.

**Estimating and rounding answers.** Estimate before calculating with friendly numbers (487 × 23 ≈ 500 × 20 = 10,000), never by working it out and then rounding. An estimate flags a lost place (1,121) but cannot confirm digits; multiply another way or divide back for that. Round only the final answer, to the accuracy the job needs: money to cents ($20 ÷ 3 = $6.67), a pouring label to a tenth of a liter (41.7); truncating (41.6, $6.66) is not rounding.

**Real anchors (see audit).**
- **The Rhind papyrus.** British Museum EA 10057, about 1550 BCE, copied by the scribe Ahmes (Ahmose) from an older scroll of Amenemhat III's reign. Its multiplication works by repeated doubling and adding the chosen rows (13 × 24 = 24 + 96 + 192). Child text says "about 3,500 years ago" and that Ahmes copied an older scroll; it does not claim he invented the method or that everyone used it.
- **Lattice multiplication and Ibn al-Banna.** The earliest recorded use of the lattice in Arabic mathematics is in Ibn al-Banna al-Marrakushi's *Talkhīṣ a‘māl al-ḥisāb* (Marrakesh, late 13th century); an anonymous Latin treatise from England of about 1300 is the earliest European example, and where the method began is unknown. Child text says only that Ibn al-Banna wrote about it over 700 years ago, never that he was first. Italian *gelosia* and Arabic *shabaka* both name a window grille. The assignment's suggested attribution to Fibonacci's *Liber Abaci* (1202) is **not** used: current summaries say Fibonacci described a related chessboard grid without the diagonals, and the lattice attribution to him is a common error.
- **Napier's bones.** John Napier's *Rabdologiae* (Edinburgh, 1617) described numbered rods carrying each digit's multiples, read like a lattice so that multiplying becomes adding.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 3 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Tens Shelf | T1, T2 | 6 rows of 40 sacks (3 steps) | Set A |
| Shortcut Board | T3-T6 | 2 × 9 × 5 (3 steps) | Set B |
| Compare Bars | T7 | Twice as many as 6 crates (3 steps) | Set C |
| Area Tray | T8-T10, H2 | 13 × 12 on the tray (3 steps) | Set D |
| Share Ledger | T11-T13 | 85 jars into 5 boxes (3 steps) | Set E |
| About-Right Board | T14, T15, H1, H3 | Pip's 52 × 19 = 988 (3 steps) | Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (twelve families in the companion, each in the method the research recommends: known fact first, split both parts, bars before operation, area before columns, chunks with a multiples list, estimate first); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** 21 vs 21 tens; digits move vs "add a zero"; ×10 vs ×100; split and multiply both parts vs multiply one; one group fixed vs 1 fixed; × swaps vs ÷ does not; 3 more vs 3 times as many; unknown big vs unknown small; four parts vs two (624); row 2 ×30 vs ×3; point by estimate vs point lined up; round up vs round down vs share; 6.25 vs 6.2; estimate vs proof; rounding vs chopping.

**Top misconceptions designed against:** losing the tens (7 × 30 = 21); "add a zero" on decimals; miscounted zeros (50 × 40 = 200); missing placeholder zeros (0.452); joining digits (2 × 75); ×0 or ×1 rote errors; partition dropping a product (75); compensating by 1; swapping a division; "times" read as "more"; "three times more" as four copies; multiplying when the unknown is the smaller amount; only tens×tens and ones×ones (624); a missing or decorative placeholder row; multiplying by one digit only; misplaced decimal point; rounding the wrong way for the story; a remainder written as decimal digits; a decimal number of trips; estimating by calculating first; trusting digits over size; truncating.

## The game or activity

**(a) Tens Shelf, model `tens-shelf-v1`.** Jar bundles of ten and trays of a hundred over a place-value chart running thousands to ten-thousandths. The child builds a known fact as single jars, taps **Swap to tens** (each jar becomes a bundle and the count is read as "21 tens"), regroups ten tens into a hundred, and reads the result. **Make ten times bigger** and **Divide by 10** slide every digit one column, filling empty columns with a visible placeholder 0; the decimal point is drawn fixed. Sprout sees bundles and crates without digits. *A made-up model: bundles of exactly ten and trays of exactly a hundred.*

**(b) Shortcut Board, model `shortcut-board-v1`.** One jar array the child can **Turn**, **Cut** into two arrays (both parts stay labeled with the shared factor), **Regroup** three factors, **Halve and double** (the array visibly rearranges, same jar count) or **Round and fix** (a ghost column added, then removed). A jar counter never changes; a divide strip shows 24 ÷ 4 and 4 ÷ 24 side by side to fence the division trap. **Show my steps** lists the moves used, as a sentence. *A made-up model: one fixed array, no real cargo.*

**(c) Compare Bars, model `compare-bars-v1`.** Two bar rows: **Copy the bar** makes whole copies; **Add a piece** extends by a fixed amount; **Mark the unknown** puts □ on the compared bar, the base bar or the copy count. The child then picks an equation tile matching the bars (for example □ × 4 = 36). Bars and equation always appear together. *A made-up model: bars to scale, whole numbers only.*

**(d) Area Tray, model `area-grid-v1`.** A rectangle of crates for a × b with sliders that split each side into hundreds, tens and ones. Filling a part shows its partial product; **Add the parts** totals them. **Show the columns** places the long multiplication beside the tray and highlights, row by row, which rectangles each row comes from; row 2 shows its placeholder zero labeled "times the tens". A **Point check** for decimals asks for an estimate before revealing where the point goes. **Lattice mode** (Keeper's Desk, after H2) draws the same product as a lattice with tens above each diagonal and ones below. Cases: 13 × 12, 23 × 15, 24 × 36, 214 × 23, 1,436 × 27, 1.6 × 4, 2.4 × 3, 3.47 × 6, 23 × 45 (lattice). *A made-up model: crates in a perfect rectangle.*

**(e) Share Ledger, model `share-ledger-v1`.** A dock of crates, a multiples list for the divisor (×1 to ×9, ×10, ×20, ×30, ×40), and a ledger. **Take a chunk** subtracts a chosen multiple and logs it; the compact layout fills in beside the chunks; **Multiply back** checks. Short division mode for 1-digit divisors carries a visible leftover into the next column. After any remainder, the child chooses its meaning from five buttons (one more, leave it, share it, as a fraction, as a decimal) and sees the story's consequence: crates left on the dock, a full box count, flour on each baker's scale. Cases: 96 ÷ 4, 85 ÷ 5, 87 ÷ 4, 360 ÷ 9, 384 ÷ 16, 864 ÷ 24, 150 ÷ 36, 75 ÷ 12, 50 ÷ 8, 1,000 ÷ 24. *A made-up model: equal crates, carts and sacks; flour and juice split exactly.*

**(f) About-Right Board, model `estimate-check-v1`.** Pip's hurried answers on a chalk wall. The child **Rounds** each factor (choices offered, including too little and too much rounding), sees the estimate, then marks the answer **Fits** or **Look again**; a too-small answer is circled with its estimate beside it. **Choose the accuracy** presents a calculator-style result (41.666..., $6.666...) and asks for the label a real job needs. *A made-up model: some answers are wrong on purpose.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **37 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Tens and moving digits | Sprout (A1, A2), Seedling (A3, A4), Sapling (A5), Keeper's Desk (A6) | 6 | 3-choice (picture at Sprout), number |
| B. Clever ways and properties | Seedling (B1, B2), Sapling (B3-B5), Keeper's Desk (B6) | 6 | 3-choice, number |
| C. Times as many | Sprout (C1), Seedling (C2, C3), Sapling (C4, C5) | 5 | 3-choice (picture at Sprout), number |
| D. Area model and long multiplication | Sapling (D1-D4), Keeper's Desk (D5, D6) | 6 | number with worked rows, 3-choice |
| E. Dividing and the leftover | Sprout (E1), Seedling (E2, E3), Sapling (E4, E5), Keeper's Desk (E6, E7) | 7 | 3-choice, number, fraction |
| F. About right, and how we know | Sapling (F1, F2), Keeper's Desk (F3-F7) | 7 | 3-choice, number, true / not true from this source, *say why* |

Sprout items use pictures and words, no numerals. Over the 18 three-choice items the right answer sits at A, B and C six times each. Every three-choice item has at least one misconception-tagged distractor, and several withhold too much (E6's "6 kg, remainder 2 kg" leaves flour unshared that the story says to share; A2's count-every-jar works but ignores that the crates are equal). *Say why* (F7) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `longOrders` per explorer, absent until a first explicit action.

```
longOrders: {
  version: 1,
  shelf:   [{ source, caseId, moves: ['tens'|'regroup'|'x10'|'d10'], at }],               // latest 12
  board:   { [caseId]: { source, moves: ['turn'|'cut'|'regroup'|'halveDouble'|'roundFix'], at } },
  bars:    { [caseId]: { source, copies: 0-9, pieces: 0-9, unknown: 'compared'|'base'|'factor', equation: tileId, at } },
  grid:    { [caseId]: { source, mode: 'area'|'columns'|'lattice', splits: [int], partials: [int], total: int|null, pointAt: int|null, at } },
  ledger:  { [caseId]: { source, chunks: [int], quotient: int|null, remainder: int|null, meaning: 'up'|'down'|'share'|'decimal'|'fraction'|null, at } },
  checks:  { [caseId]: { source, rounded: [int], verdict: 'fits'|'again'|null, accuracy: choiceId|null, at } },
  answers: { [itemId]: { source, choice | text | statements, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version, the case's numbers and the item's choices and order. Codes and numbers only; a typed number answer is kept as its exact text (at most 16 characters from digits, `.`, `,`, `/`, `$`, space and `r`), never re-parsed into a new judgment on load. Validate ids, enums and integer ranges only (chunks and partials are non-negative integers up to 100,000; `pointAt` 0-3). Never recompute or rewrite saved results on load. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **M2-III** written multi-digit operations (long multiplication, short and long division, remainders); **M2-IV** a first look at decimal multiplication (decimal × whole number only); **M2-V** choosing efficient methods and inverse checks (mental strategies, properties, method choice, multiplying back); **M1** place value and rounding to check (Number Representation and Addition & Subtraction rows); **H1** an old document, a manuscript method and a printed instrument as sources. Act families: III, V (VI as a later revisit).

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Multiply by multiples of ten and by powers of ten with decimals; choose a mental strategy; use the properties as moves and fence division; solve comparison problems with bars and an equation; multiply by area model and long multiplication up to 4-digit × 2-digit; multiply a decimal by a whole number; divide by short division and by chunked long division; interpret a remainder five ways; estimate to check and round to a stated accuracy. |
| Teaching encounter | T1-T15 with step-revealed worked examples; H1-H3; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Swap to tens; fixed-point digit slide; the jar counter that never changes; bars with equation tiles; the tray beside the columns; a multiples list; the "I'm stuck" ladder. |
| New application | 4-digit × 2-digit (D6); money in cents (D5); the same remainder meaning in a new story (E5-E7); the papyrus method (F6); lattice mode. |
| Purposeful revisit | Spec 51 (full groups, leftovers, trips); spec 50 (whole copies); specs 77/78/107 (ten-bundles, columns); Act VI exchange plan (later). |
| Data boundary | Moves, splits, chunks, choices, typed numeric text and support codes, all local. No timing, free text, names or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids, names and edges confirmed in the pinned `curriculum/marble/topics.json` and `dependencies.json`. Research paraphrased, never copied.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Multiplying by Tens (`mt_isojCL9yy-`) | Known fact scaled by ten; explain where the zero comes from; no "add a zero"; link to estimating. Tens Shelf's Swap to tens; T1; A3, A4; D3's estimate. |
| Mental multiplication and division (`mt_pjfmCMMPjO`) | ×0, ×1, ÷1 by group meaning; reorder three factors; place value in 40 × 6; ÷0 kept out. T3; guided 2 × 9 × 5; B1; ÷0 never appears. |
| Mental multiplication and division, age 9+ (`mt_8A3pZNOp7Z`) | Scale facts by tens and hundreds (zero trap 50 × 40); partition with both parts multiplied; choose among routes. T4, T5; B2-B4, B6; E2. |
| Long multiplication, age 10+ (`mt_XLP1IM3Qbb`) | Explain each partial product; placeholder as ×tens; estimate as a first filter; 3×2 before 4×2; area-model link available. Area Tray with Show the columns; T9; D1-D3, D6. |
| Dividing by two-digit numbers (`mt_FvEq4heNBx`) | Choose short or long by the numbers; neither always better; secure multiples first; interpret remainders. T12 (short with 16, chunks with 24); E4, E7; multiples list. |
| Division with remainders, age 10+ (`mt_WsM4EmdOLe`) | Chunking as a legitimate bridge; multiples menu; fraction, decimal and rounded remainders all practiced; multiply back. Share Ledger; T12, T13; E3-E7. |
| Properties of Operations (`mt_Lb2ZnMdkYR`) | Strategies, not names; division not commutative; both parts multiplied in a split; area as the distributive law. Shortcut Board; T6; B3, B5; Area Tray. |
| Estimation to check answers (`mt_ilPrU0cbtT`) | Estimate first and independently; flags size errors, not digits; sensible rounding; accuracy by purpose. About-Right Board; T14; F1, F2, F7. |
| Rounding Answers (`mt_QU5R7Aajy9`) | Context decides up, down or nearest; round at the end; truncating is not rounding; sensible accuracy. T13, T15; E5, F3, F4. |
| Multiplying and dividing (`mt_LlMl2PbaZe`) | Digits shift across columns; placeholder zeros; no "add a zero" or bare "move the point". Tens Shelf slide; T2; A5. |
| Multiplying and dividing, age 10+ (`mt_wPgpMJ0-PA`) | Point stays, digits move; chart to ten-thousandths; confront missing placeholders. Chart headers; A6 (0.0452). |
| Multiplicative Comparison (`mt_6-j1NO2ZUH`) | Bar plus equation with a symbol; all three unknown positions; matched "more" vs "times" pair. Compare Bars; T7; C1-C5. |
| Decimal place value (`mt_SoDP1fSQEB`) | Despite its title: decimal × whole number; partition or scale and rescale; estimate to place the point; 16.0 = 16; don't line up points. T10; D4, D5; Point check. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors and per-choice feedback, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points, streaks. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Multiplying by Tens | Fluent multiplication and division facts (`mt_WX30dzi4dt`) | Supported inline (multiples list; known fact shown); no claim. Spec 51 lists it only as an access exception. Documented gap. |
| Mental multiplication and division | All times tables to 12×12 (`mt_K5jM7vlVhA`) | Supported inline; no claim. Documented gap: no spec on main or any draft teaches recall. |
| Mental multiplication and division, age 9+ | Mental multiplication and division (`mt_pjfmCMMPjO`) | Taught here (T3 before T4, T5). |
| Long multiplication, age 10+ | Long multiplication (`mt_q9EaJc2FP8`) | Taught here inline (2-digit × 2-digit and the area model, T8, T9, D1) without claiming the id, which is not in this pack's assignment; spec 51 lists it as a method exception. A reviewer may add the claim. |
| Dividing by two-digit numbers | Arrays for multiplication, age 9+ (`mt_MCu_SNg_OW`: short division by 1 digit) | Taught here inline (T11, guided 85 ÷ 5, E3) without claiming the id; spec 51 lists it as a method exception. |
| Division with remainders, age 10+ | Arrays for multiplication, age 9+ (`mt_MCu_SNg_OW`) | As above. |
| Properties of Operations | Commutative Multiplication (`mt_C9ZfT-4cgn`) | Met elsewhere: spec 190 in this math build-out (draft); recapped in T6. Documented gap if 190 does not ship. |
| Properties of Operations | What Multiplication Means (`mt_gtTl3R5buH`) | Supported by specs 50 and 51 on main (equal groups, copies) without a claim there; recapped in T1 and A2. Documented gap. |
| Estimation to check answers | Checking Answers by Rounding (`mt_G3sVFQNCme`) | Met elsewhere: proposed spec 212 (*quick-sums*, math build-out); T14 teaches the needed rounding inline. Documented gap if 212 does not ship. |
| Rounding Answers | Decimal place value (`mt__casygEB85`: rounding decimals) | Met elsewhere: proposed spec 199 (*decimal-scales*, math build-out); T15 and F3 support inline. |
| Rounding Answers | Division with Decimals (`mt_lU-2aTRB9f`) | Supported inline (E6, F4 produce decimal quotients; 2 ÷ 8 = 0.25 shown); no claim. Documented gap. |
| Multiplying and dividing | Dividing by 10 and 100 (`mt_kDMKJ5Ztt6`) | Met elsewhere: proposed spec 199 (math build-out); T2's ÷1,000 example recaps it. |
| Multiplying and dividing | Place Value × 10 Pattern (`mt_QqG6IdmTSE`) | Met elsewhere: spec 188 in this math build-out (draft); the Tens Shelf chart recaps it. |
| Multiplying and dividing, age 10+ | Multiplying and dividing (`mt_LlMl2PbaZe`) | Taught here (A5 before A6). |
| Multiplying and dividing, age 10+ | Reading Decimal Places (`mt_lNGpnILM5C`) | Met elsewhere: proposed spec 199 (math build-out); chart column names shown on every slide. |
| Multiplicative Comparison (`mt_6-j1NO2ZUH`) | Multiplicative Comparison (`mt_U4cIBXVug4`) | Met elsewhere: spec 50 on main (scoped practice, whole copies of a recipe). |
| Multiplicative Comparison | Multiplication and Division Word Problems (`mt_Zdv-b-iW5K`) | Met elsewhere: spec 51 on main and the authored `#checkin/operations` task. |
| Decimal place value (`mt_SoDP1fSQEB`) | Multiplying and dividing, age 10+ (`mt_wPgpMJ0-PA`) | Taught here (Tens Shelf before the Point check). |
| Decimal place value | Long multiplication, age 10+ (`mt_XLP1IM3Qbb`) | Taught here (Area Tray columns before D4, D5). |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 127, 128, 137-151) claims these thirteen targets; `mt_Lb2ZnMdkYR`, `mt_LlMl2PbaZe` and `mt_wPgpMJ0-PA` appear on main only as named predecessors in source audits 96 and 113, not as claims.

## Checks for implementation

- **Numbers script (2026-10-25):** `check191.py` (`python3 -I`, scratch area, not in the repo), **82 checks passing**: 24 × 36 = 864 from parts 600/120/120/24 (wrong 624, 744; Bramble's 60; estimate 800); 23 × 15 = 345 from 200/100/30/15 and rows 115 + 230; 4 × 30 = 120, 7 × 30 = 210 (wrong 21, 37, 2,100), 8 × 40 = 320 (wrong 32, 48), 6 × 40 = 240, 50 × 40 = 2,000 (wrong 200, 20,000); 2.5 × 10 and × 100, 3,600 ÷ 1,000 = 3.6, 0.35 × 100 = 35 (wrong 3.5), 45.2 ÷ 1,000 = 0.0452 (wrong 0.452, 45,200); 2 × 7 × 5 = 70 (wrong 150, 14), 16 × 5 = 80 (wrong 320, 21), 7 × 15 = 105 (wrong 75), 19 × 6 = 114 (wrong 119, 126), 29 × 4 = 116, 240 ÷ 6 = 40; comparison 21, 10, 28, 9 (wrong 144, 32), 5 (wrong 36, 405); 214 × 23 = 4,922 (wrong 1,070, 642), 1,436 × 27 = 38,772 (wrong 12,924, 10,052; estimate 42,000), 13 × 12 = 156, 1.6 × 4 = 6.4, 2.4 × 3 = 7.2 (wrong 72, 0.72), $3.47 × 6 = $20.82 (wrong $208.20, $18); 96 ÷ 4 = 24, 85 ÷ 5 = 17, 87 ÷ 4 = 21 r 3, 360 ÷ 9 = 40, 384 ÷ 16 = 24, 864 ÷ 24 = 36 by chunks 720 + 144, 150 ÷ 36 = 4 r 6 → 5 trips, 75 ÷ 12 = 6 r 3 → 7, 6 and 6.25, 50 ÷ 8 = 6.25 (wrong 6.2), 1,000 ÷ 24 = 41 r 16 = 41 2/3; 487 × 23 = 11,201 vs estimate 10,000 and Pip's 1,121; 52 × 19 = 988; 41.666... → 41.7, $20 ÷ 3 → $6.67 (three shares $20.01), 47 ÷ 6 → 7.8, $10 ÷ 3 → $3.33; papyrus 13 × 24 = 312 with a brute-force check that rows {1, 4, 8} are the only doubling rows summing to 13 (wrong 336, 288); lattice 23 × 45 = 1,035; Napier 46 × 7 = 322 by diagonal sums; the 12 stuck examples; 18 three-choice items balanced 6/6/6.
- Every partial product is labeled with its rectangle; row 2 always shows its placeholder zero. Digits slide; the point never moves on screen. A count of trips is never shown as a decimal. Model lines show on every bench. Sprout items show no numerals; feedback never says "wrong".
- Style check run on the companion (`style191.py`): 0 em- or en-dashes; 15 teach cards at most 30 words; 37 prompts at most 15 words; 54 per-choice feedback lines and 37 explanations at most 20 words; 4 short scenes at most 30 words; no "not X, but Y" construction found.
- Browser at 320 and 820 px: targets 44 px; tap-to-place as well as drag on the tray and bars; the multiples list and the ledger fit together without horizontal scroll; every tray, bar and chart has a text equivalent ("Row 2: 24 times 30 is 720").
- Nuria's Spanish line checked by a fluent reader before build (spec 120 rule).

- **Independent review, 2026-10-25.** Independent numbers script (`review_checks.py`, `python3 -I`, scratch area, written fresh, not the writer's): 28 grouped checks for this pack, all passing; independent style script (`style.py`) over all three files: 0 em-dashes, every prompt, hint, feedback, explanation and teach card within limits, right-answer positions recounted (A 6, B 6, C 6). Checked as for spec 188. The Ibn al-Banna correction away from Fibonacci is right (Fibonacci's chessboard grid has no diagonals), but "earliest recorded" was too strong: it is the earliest recorded use in Arabic mathematics, with an English Latin treatise of about 1300 as the earliest European one; the anchor now says so, and child text never claimed he was first. Also changed: three scene notes relabeled as math; Napier's note now shows the carry (2; 8 + 4 = 12; 2 + 1); E1 and B5 prompts and hints clarified; the Compare Bars guided step; "wrong" removed from F2 feedback; British spellings (labelled, practised, licence, judgement, travelling) Americanized; sibling specs 199 and 212 cited as proposed, not planned; the save enum gains 'share' for the fifth remainder meaning.

## Review asks

**Math check:**
1. Is chunking-first, with the compact layout shown beside it, an acceptable route to long division at Sapling?
2. Is 1,000 ÷ 24 = 41 2/3 liters a fair Keeper's Desk fraction-remainder item, or should the fraction be left unsimplified (16/24)?
3. Does "the decimal point stays still; the digits move" read correctly for ÷1,000 with placeholder zeros?
4. Is F4's "three shares make $20.01" a helpful note on rounding money, or a distraction?

**Owner questions, with defaults:**
1. Route `#numbers/long` beside Bundle Burrow's supply-order routes? *Default: yes.*
2. Thirteen targets in one pack, or split multiplication (a-d) from division and checking (e-f)? *Default: one pack; the Share Ledger can ship as spec 51's follow-on.*
3. Add claims for `mt_q9EaJc2FP8` (2-digit × 2-digit) and `mt_MCu_SNg_OW` (short division by 1 digit), which this pack teaches inline? *Default: no claim now; leave to the build-out coordinator.*
4. Name *La Garza*'s captain (Marisol, spec 117) once spec 117 lands? *Default: keep "the captain" until then.*
5. First slice? *Default: the Area Tray with Set D, then the Share Ledger with Set E.*
