# 188. The Long Count: big numbers in the town ledger

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/188-long-count-text.md); sources and open checks are in the [source audit](../source-audits/188-long-count.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, math and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. The Gazette Desk's Keeper's Desk items follow the conventions of proposed [spec 118](https://github.com/anotherpanacea-eng/learning-garden/pull/126) (draft PR #126) but do not need its desk to run. **Fact-check status:** real-world facts checked against search excerpts on 2026-10-25 (page fetches blocked); no `[check]` item is in child text. The mathematics is standard and still needs the math check.

## Purpose

Number Representation & Place Value has many pinned Marble topics above three digits and none has a lesson in the game. [Bundle Exchange](53-bundle-exchange.md) stops at tens and hundreds; [Write the Same Sum](107-place-value-sum-ledger.md) writes two-digit sums; [Tenths Table](81-tenths-table.md) and [Hundredths Bridge](85-hundredths-bridge.md) go two places right of the point. Nobody counts in thousands, reads a comma, rounds, or slides a digit by a power of ten. This pack takes seventeen untouched topics there.

A child comes to understand that a big number is small numbers standing in a row: each place is worth ten times the place to its right, all the way through the decimal point; counting by one place changes one digit until a 9 rolls over; commas make groups of three that are read one at a time; zeros hold empty places; comparing starts from the left; rounding is choosing the nearer post, decided once; a rounded number stands for a range; an estimate rounds to the figures that matter for the job; multiplying by 10, 100 or 1000 slides digits while the point stays still; 10³ counts tens multiplied; and standard form writes a huge number short.

**Builds on, never re-teaches:** spec 53's "ten of one place make one of the next" (here: the same rule repeated to millions, and run backwards to thousandths); spec 107's aligned columns (here: seven columns with comma groups); specs 81 and 85's tenths and hundredths (here: thousandths and the ÷ 10 slide that links them); [spec 138](https://github.com/anotherpanacea-eng/learning-garden/pull/137)'s numeral bench at `#archive/keepers/numerals` (draft PR #137), which already contrasts Roman and Egyptian numerals with place value and zero and tells the Liber Abaci story, so this pack does not retell how our numerals arrived; [spec 133](https://github.com/anotherpanacea-eng/learning-garden/pull/137)'s scaled Long Line (here: a 0 to 10,000 magnitude line, not dates). **Not targeted:** *Number Sets & Infinity* (`mt_b4lbTOJYwI`), first assigned here and now owned by proposed spec 199 (decimal-scales, math build-out): its research centers rational and irrational numbers, repeating decimals and density, which a large-numbers pack cannot teach honestly. "There is no biggest number" stays here only as an unscored Keeper's Desk curiosity card (K1), with no claim. Negative numbers inside *Numbers to Ten Million* belong to sibling spec 189 (below zero); written multiplication belongs to sibling spec 191.

## Place and story

**Host:** the **Ledger Room** at the back of the Willowbank library, route `#library/ledger`, where Wren Halloway keeps the town's ledger and the river's record books. Linked from the library, Bundle Exchange's end screen, Hundredths Bridge and the Keeper's Desk. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 2 *a garden across the seasons* | A crate of 1000 seeds reaches the seed store; Wren changes one digit, and Bramble asks what happens at 9. | Sprout: crates and boxes. Seedling: 1000 more, roll-over. |
| II, ending *A Town of Our Own* | Pip reads the brick count 3,048 as "three hundred forty-eight" and panics. | Seedling: placeholder zeros. |
| III, ch. 2 *the seed exchange* | Nuria brings Vadoalto's reed count, 403,072, and reads it in Spanish; Bramble reads it by comma groups. | Sapling: reading, comparing, expanded form. |
| V, path 2 *a Willowbank newspaper* (the Gazette) | The librarian (they/them) wants a headline for 132,603 seeds swapped; Bramble wants every digit. | Sapling: rounding for a job. Keeper's Desk: ranges, estimates. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, ledger and counts are fiction, labeled apart from math, history and models. **Hollis rule:** the Act II and III beats say nothing about the old Keeper; no beat names Hollis.

## The knowledge

**Counting in powers of ten.** Counting on or back in 10s, 100s, 1000s, 10,000s or 100,000s changes one digit, the one for the step's place. A 9 that goes up rolls over to 0 and pushes 1 into the next place left (9,500 + 1000 = 10,500; 3,990 + 10 = 4,000; 492,000 + 10,000 = 502,000). 1000 more or less is the same rule for one step: 4,562 → 5,562 and 3,562.

**Magnitude on a line.** On 0 to 10,000, 5,000 is the middle and the thousands are landmarks. 4,900 sits just before the middle; 4,100 just after 4,000. Placing by the first digit only puts both in one spot.

**Reading and writing to ten million.** Commas split digits into **groups (periods) of three**: ones, thousands, millions. Read each group as a number up to 999, then say its name: 4,302,561 is four million three hundred two thousand five hundred sixty-one (American style, no "and" in whole numbers). **Placeholder zeros** hold empty places: 3,048 is three thousand forty-eight, and 7,045,200 is seven million forty-five thousand two hundred. Expanded form writes the places as a sum (403,072 = 400,000 + 3,000 + 70 + 2). A digit's **value** is its face value times its place: the 7 in 7,045,200 is worth 7,000,000. **Compare** by lining up places and reading from the left; the first place that differs decides (548,301 > 543,801 at the thousands).

**Rounding.** Name the two **posts** (multiples of the chosen place) on either side, find the halfway point, and choose the nearer post. Exactly halfway goes up by convention. The chosen place picks the posts; the decider is the one digit to its right. Decide **once**: 4,450 to the nearest 1000 is 4,000, while rounding to 4,500 first and then again gives 5,000. Cascades: 4,970 to the nearest 100 is 5,000; 950,500 to the nearest 100,000 is 1,000,000. Same method for 10,000, 100,000 and a million (456,782 → 460,000; 6,482,300 → 6,000,000).

**Rounding for a job, and ranges.** An estimate rounds each number to its first figure or two, then calculates (48 × 312 is about 50 × 300 = 15,000; exact 14,976). A headline rounds to a place people remember; a ledger keeps every digit. A rounded number stands for a **range**: "4,000 to the nearest 1000" means 3,500 ≤ count < 4,500. The low end is included, and the high end is not, because 4,500 rounds up to 5,000; for whole counts the largest is 4,499. Half a unit each side, never a whole unit.

**Ten times the place to its right.** Each place is worth ten times the place to its right and one tenth of the place to its left, in one unbroken chain through the decimal point: the 3 in 3,000 is 10 times the 3 in 300 (3,000 ÷ 300 = 10, and 700 ÷ 70 = 10); the 4 in 0.04 is one tenth of the 4 in 0.4. The gap is "times ten", never "ten more".

**Multiplying and dividing by 10, 100, 1000; powers of ten.** × 10 slides every digit one place left; × 100 two places; × 1000 three; ÷ slides right. **The decimal point stays still**; empty whole-number places fill with placeholder zeros (3.4 × 100 = 340). "Add a zero" is a rule the pack names and retires: 3.4 with a zero added is 3.40, the same number. 10ⁿ means n tens multiplied (10³ = 10 × 10 × 10 = 1000), so the exponent counts the places the digits slide (2.56 × 10³ = 2,560). 10³ is not 30.

**Decimals to thousandths.** After tenths and hundredths, thousandths: 5.062 is "five and sixty-two thousandths"; 347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × 1/10 + 9 × 1/100 + 2 × 1/1000. Compare by place from the left, writing 0.38 as 0.380 to see that it beats 0.372; longer is not bigger.

**Standard form (large numbers).** One nonzero digit before the point, times a power of ten: 4,500,000 = 4.5 × 10⁶; 34 × 10⁶ is not standard form (it is 3.4 × 10⁷). Compare powers first, then the front numbers (9.8 × 10⁴ < 6.1 × 10⁵ < 2.3 × 10⁶). Negative powers are left to a decimal pack.

**Real anchors (see audit).**
- **Khipu.** Record keepers of the Inca Empire in the Andes kept counts on knotted cords. Cords hang from a main cord; on each, knot clusters sit at set positions, the biggest place nearest the main cord and the ones farthest down; a blank position means zero. Ones use long knots (2 to 9 turns) or a figure-eight knot for 1; higher places use clusters of simple knots. Leslie Leland Locke is usually credited with showing the base-ten reading in a 1912 paper; one khipu he described has top cords equal to the sum of the hanging cords. Not every khipu is numerical, and cord color and other features are only partly understood. The pack uses only the knot-and-position reading, which is the best-established part.
- **The Sand Reckoner.** Archimedes (3rd century BCE) wrote *The Sand Reckoner* for King Gelon (Gelo II) of Syracuse, asking how many grains of sand would fill the universe as then pictured. A myriad meant 10,000; ordinary expressions could already reach a myriad of myriads (10⁸), which he took as a new unit and built orders and periods from it. He proved upper bounds, rather than an estimated count: Heath's translation, pp. 526-527, gives less than 10⁵¹ for the smaller universe and less than 10⁶³ for Aristarchus's sphere of fixed stars. Child text makes the bound distinction without giving a numerical bound.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 3 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Counting Rail | T1-T4 | 4,562 and a crate of 1000 (3 steps) | Set A, B2 |
| Ledger Columns | T5-T7 | Pip's 3,048 (3 steps) | Set B |
| Nearest Post | T8, T9 | 4,367 to the nearest 100 (3 steps) | Set C |
| Slide Chart | T10-T14, T17 | 3.4 × 100 (3 steps) | Set D, F4 |
| Gazette Desk | T15, T16 | The 132,603 headline (3 steps) | Set E |
| History cards | H1, H2 (K1 curiosity, unscored) | none | Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists ten families); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** a digit vs its value; ten more vs ten times; first digit vs whole position on a line; digits read one by one vs groups; a zero that holds a place vs no digit; left-first vs right-first comparing; nearer post vs the post you face; one rounding vs rounding twice; exact vs about; a rounded number vs its range; digits move vs the point moves; 10³ vs 10 × 3; longer decimal vs bigger decimal; headline vs ledger.

**Top misconceptions designed against:** changing the wrong digit; boundary slips at 9; placing on a line by the first digit; reading digit by digit; dropping placeholder zeros; face value for place value; comparing from the right or by digit count; always rounding down; double rounding; cascade slips at 950,500 and 4,970; a rounded number is exact; a range of a whole unit each side; places differ by adding; "add a zero" for decimals; the point moves; 10³ = 30; longer decimal is bigger; standard form ordered by the front number.

## The game or activity

**(a) Counting Rail, model `count-rail-v1`.** A rail with a digit board above it. Pick a step (10 to 100,000) and **Count on** or **Count back**; the bead jumps and the one changing digit lights up; a 9 that rolls over flashes its neighbor. **Line mode** (Seedling): place a number on a 0 to 10,000 line with landmarks at each thousand, dense marks first, then sparse. **Sprout mode**: shelves of big crates, small boxes and loose seeds, no numerals (one crate holds ten boxes). *A made-up model: the town's counts are invented; the counting rules are real.*

**(b) Ledger Columns, model `ledger-columns-v1`.** Seven place columns, with comma groups shaded and named. A number appears as a numeral; **Show the groups**, **Read it to me**, **Build the words** (word tiles), **Build from place cards** (Seedling: 3,006 and 4,050), **Expanded form** and **Compare two** (Seedling pairs include 4,562 vs 4,526, 987 vs 1,024 and 4,050 vs 4,005) (places line up and are checked left to right, the deciding place highlighted). Placeholder zeros glow when tapped: "none here, and holding the place".

**(c) Nearest Post, model `nearest-post-v1`.** A path between two posts with a halfway stone. Choose the place (10 to a million); the posts relabel; a marker shows the number; **Which post?** Exactly on the stone, an arrow points up the path. **Sprout mode**: Pip between the mill post and the bakery post; tap the nearer one. No digit rule is shown until after the child has used the posts; then a card shows that the decider digit is the one just right of the chosen place.

**(d) Slide Chart, model `slide-chart-v1`.** A place chart from millions to thousandths with the decimal point fixed. Digit tiles slide when the child taps × 10, ÷ 10, × 100, ÷ 100, × 1000 or ÷ 1000; empty whole-number places fill with gray zeros after the slide, and the card says how many places every tile moved. **Show as a power** writes the step as 10¹, 10², 10³. **Standard form** (Keeper's Desk) slides a large number until one digit is left before the point and counts the slides. *A made-up model: tiles on a chart; the place-value rules are real.*

**(e) Gazette Desk, model `gazette-desk-v1`.** A front page with made-up valley counts. The child chooses **Exact**, **About** to a chosen place, **First figure** or **First two figures**, and says who will read it. **Show the range** draws the bracket from the smallest value that rounds to the shown number up to (not including) the next halfway point. Estimates appear beside exact totals so the child can check one against the other.

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **34 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Counting on and back | Sprout (A1, A2), Seedling (A3-A6) | 6 | 3-choice, number, sequence |
| B. Reading and writing big numbers | Seedling (B1, B2), Sapling (B3-B6) | 6 | 3-choice, build the words, order the cards |
| C. The nearest post | Sprout (C1), Seedling (C2, C3), Sapling (C4-C6) | 6 | 3-choice, number |
| D. Sliding digits | Sapling (D1-D4), Keeper's Desk (D5, D6) | 6 | 3-choice, match |
| E. Gazette figures | Sapling (E1, E2), Keeper's Desk (E3-E6) | 6 | 3-choice, number with estimate, number puzzle, *say why* |
| F. Knots and sand | Sapling (F1, F2), Keeper's Desk (F3, F4) | 4 | number, 3-choice, true / not true from this source |

Sprout items use no numerals (crates and boxes; Pip and two posts). Over the 21 three-choice items the right answer sits at A, B and C seven times each. A2 and C1 each include a distractor that withholds more than the picture requires ("you can't tell without counting every seed"; "he is somewhere in between"). The E3 puzzle has one answer, checked by brute force. *Say why* (E6) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `ledgerRoom` per explorer, absent until a first explicit action.

```
ledgerRoom: {
  version: 1,
  rail:    [{ source, mode: 'count'|'line'|'sprout', step: 1-5, dir: 'on'|'back', start, placed, at }],  // latest 12
  columns: [{ source, numberId, view: 'groups'|'words'|'expanded'|'compare'|'build', at }],                     // latest 12
  posts:   [{ source, numberId, place: 1-6, chosen: 'low'|'high', at }],                                  // latest 12
  slides:  [{ source, startId, moves: ['x10'|'d10'|'x100'|'d100'|'x1000'|'d1000'], at }],                 // latest 12
  answers: { [itemId]: { source, choice | value | order | match | taps, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only; word tiles save as tile ids. Never recompute or rewrite saved results on load; validate ids, ranges (steps 1-5 for 10 to 100,000, places 1-6 for 10 to a million, numbers 0 to 10,000,000, slides at most six) and lengths only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M1** place value to ten million, rounding, powers of ten, thousandths; **M2** estimating (with sibling 191's operations); **H1** two sources about counting from the Andes and ancient Syracuse. Act families: II, III, V.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Count on and back in powers of ten with roll-overs; 1000 more or less; place, read, write and compare numbers to ten million; round to any place up to a million, once; estimate and state a rounded number's range; explain each place as ten times the next, through the point; × and ÷ by 10, 100, 1000 by sliding digits; write powers of ten; read and compare thousandths; write large numbers in standard form; solve place-value problems in context. |
| Teaching encounter | T1-T17 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Lit changing digit; landmark line; shaded comma groups; posts and halfway stone; fixed point with sliding tiles; range bracket; the "I'm stuck" ladder. |
| New application | Nuria's six-digit count; the 950,500 cascade; the lost-number puzzle; the headline choice; reading a khipu cord; Archimedes' myriad of myriads in standard form. |
| Purposeful revisit | Spec 53 exchange (ten of one place); spec 85 hundredths (now ÷ 10 again); spec 138 numeral bench (zero holds a place); spec 133 Long Line (scaled lines); sibling 191 (estimating products); sibling 189 (integers below zero). |
| Data boundary | Steps, placements, chosen posts, slides, choices, values, tile ids and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Numbers to 10,000 (`mt_lC_Q5mSL_I`) | Many views of one number; the 0-10,000 line as the magnitude spine with 5,000 halfway; place and name both ways; dense marks then sparse. Line mode; T4; B2; columns and expanded form. |
| Numbers to Ten Million (`mt_XNmGwNggdU`) | Real contexts where the child chooses the skill; estimate first, check, interpret back in context. Gazette Desk; E1, E2. Negatives: sibling 189. |
| Reading and writing numbers to 10,000,000 (`mt_Gag_h98jWP`) | Read by three-digit periods; placeholder zeros across periods; left-first ordering; digit values. T5, T6; B5, B6; Scene 3 note. |
| Reading and writing numbers (age 9+) (`mt_JwP9QFv6gQ`) | Groups, not digits; multi-zero numbers; six columns in step with words and expanded form; highest place first. Ledger Columns; B1, B3, B4. |
| Reading and writing numbers (age 10+) (`mt_Ac7oMWhyPw`) | Thousandths read as fractions of the whole; expanded form with 1/10, 1/100, 1/1000; trailing zeros defeat "longer is larger". T14; D5, D6. |
| 1000 More or Less (`mt_9XVFje6Tyr`) | Only the thousands digit responds; contrast 10, 100, 1000; teach the roll-over; reasoning, not counting on. T1, T2; A1, A3, A4; Scene 1. |
| Rounding to 10, 100, 1000 (`mt_NLSfvB9vUl`) | Nearness on the line first; posts and midpoint; rule derived after; halfway up; cascades. Nearest Post; T8, T9; C1-C4. |
| Rounding Large Numbers (`mt_5NwqN6pf_A`) | Same midpoint meaning at large posts; one decider digit; the 950,500 boundary. C5, C6; E1. |
| Estimating by rounding (`mt_VVn1IXjkzn`) | A rounded value is a half-unit range, low end in, high end out; estimate by one-figure rounding and compare. T15, T16; E4, E5. Whole numbers only (see crosswalk). |
| Patterns with Powers of Ten (`mt_HLUqHJ9Y7n`) | Exponent as a count of tens multiplied, never "number of zeros"; digits move, point stays; × with ÷; predict, then check. Slide Chart; T12, T13; D2, D3, D6. |
| Place Value × 10 Pattern (`mt_QqG6IdmTSE`) | Slide a digit left, ten times; hold additive and multiplicative views; 700 ÷ 70 = 10. T10; D1. |
| Place Value × 10 and ÷ 10 (`mt_EDgw64OmfA`) | One chain through the point; same digit in different places; "add a zero" as a named non-example. T11, T12; D4. |
| Powers of Ten Notation (`mt_bO-njVOige`) | Normalize 1 ≤ A < 10 with non-examples; compare by power first. T17; F4; H2. Large numbers only; negative powers left to a decimal pack (owner question 2). |
| Place Value Problem-Solving (`mt__sMrmOv3bx`) | Rich, multi-step problems; justify the strategy; choose an accuracy. E2, E3, E6. |
| Counting forwards and backwards (age 9+) (`mt_tAtMET4EIU`) | Name the step's place; one column ticks; vary step and direction; cross boundaries; predict next terms. Counting Rail; T3; A5, A6. |
| Place value of each digit (`mt_jY7uf0Cb7o`), added in review | Four columns as the same ×10 idea one place further (ten hundreds make a thousand); build, numeral and expanded form kept in step; multi-zero numbers (3,006; 4,050) first. Ledger Columns' build cases (3,006 and 4,050 from place cards); T6; B1, B5; glossary "thousand". |
| Comparing Large Numbers (`mt_MHaiUd2FLA`), added in review | Compare from the highest place and drop a place only on a tie; same-leading-digit, mixed-length and multi-zero pairs; pairs before ordered sets; justify by place. Compare two cases (4,562 vs 4,526; 987 vs 1,024; 4,050 vs 4,005); T7; B4, B6. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Numbers to 10,000 | Representing Numbers (`mt_9L3NQqgqRd`) | Met elsewhere: proposed spec 211 (math build-out); recapped on the rail only. |
| Numbers to 10,000; 1000 More or Less; Rounding to 10, 100, 1000; Place Value × 10 Pattern; Place Value Problem-Solving; Comparing Large Numbers | Place value of each digit (`mt_jY7uf0Cb7o`) | Taught here (T5, T6, Ledger Columns build cases, B1), claimed in review: in no pack's assignment, and draft specs 133 and 138 name it as support only. |
| Numbers to Ten Million | Decimal place value (`mt__casygEB85`) | Whole-number half (rounding any whole number to a chosen accuracy) taught here (T8, T9, T15). Decimal rounding: met elsewhere, proposed spec 199 (math build-out). |
| Numbers to Ten Million | Reading and writing numbers to 10,000,000 (`mt_Gag_h98jWP`) | Taught here (T5, T6). |
| Reading and writing numbers to 10,000,000 | Reading and writing numbers (age 9+) (`mt_JwP9QFv6gQ`) | Taught here. |
| Reading and writing numbers (age 9+) | Comparing Large Numbers (`mt_MHaiUd2FLA`) | Taught here (T7, Compare two cases, B4, B6), claimed in review: in no pack's assignment; draft spec 133 names it as support only. |
| Place value of each digit | The three digits of a three-digit number (`mt_aPBzD28_mT`) | Met elsewhere: the Number Garden's authored hundreds-shelf tasks on main (learning atlas); recapped in the stuck example (352 + 100). In no spec's claims. |
| Comparing Large Numbers | Ordering Numbers to 1000 (`mt_AQcVRBddko`) | Met elsewhere: proposed spec 211 (math build-out); recapped in the stuck example (352 and 325). |
| Comparing Large Numbers | Numbers to 10,000 (`mt_lC_Q5mSL_I`) | Taught here (T4, line mode). |
| Reading and writing numbers (age 9+); Rounding Large Numbers; Place Value × 10 and ÷ 10; Counting forwards and backwards | Place Value × 10 Pattern (`mt_QqG6IdmTSE`) | Taught here (T10). |
| Reading and writing numbers (age 10+) | Comparing Decimals (`mt_933BohS9BH`) | Met elsewhere: proposed spec 199 (math build-out); recap inline (T14 compares by place with a trailing zero). |
| Reading and writing numbers (age 10+) | Tenths (age 9+), thousandths (`mt_kdWoAel3Zl`) | Met elsewhere: proposed spec 199 (math build-out); recap inline (T11, T14). |
| 1000 More or Less | 10 or 100 More or Less (`mt_izien3ZX51`) | Met elsewhere: proposed spec 211 (math build-out); recapped in the stuck example (352 + 100). |
| Rounding Large Numbers | Rounding to 10, 100, 1000 (`mt_NLSfvB9vUl`) | Taught here (C1-C4 before C5, C6). |
| Estimating by rounding | Decimal place value, age 11+ (`mt_U9sme87C32`) | Whole-number one- and two-figure rounding taught here (T15); decimal places and significant figures in decimals: met elsewhere, proposed spec 199 (math build-out). |
| Patterns with Powers of Ten | Place Value × 10 and ÷ 10 (`mt_EDgw64OmfA`) | Taught here (T11). |
| Patterns with Powers of Ten | Multiplying and dividing by 10, 100, 1000 (`mt_LlMl2PbaZe`) | Met elsewhere: proposed spec 191 (math build-out); the Slide Chart recaps it (T12, D2) with no claim. |
| Place Value × 10 and ÷ 10 | Place Value × 10 Pattern (`mt_QqG6IdmTSE`) | Taught here. |
| Powers of Ten Notation | Square and cube numbers (`mt_hCVPYlF-7Y`) | Met elsewhere: proposed spec 190 (math build-out); powers of ten only recapped here (T13). |
| Counting forwards and backwards | 1000 More or Less (`mt_9XVFje6Tyr`) | Taught here (T1, T2 before T3). |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 127, 128, 137-151) claims these seventeen targets, and no sibling in the math build-out map lists any of them except this spec; draft PR #137 names `mt_jY7uf0Cb7o` and `mt_MHaiUd2FLA` as support only (specs 133 and 138), with no claim.

## Checks for implementation

- **Numbers script (2026-10-25):** `check188.py` (`python3 -I`, scratch area, not in the repo), 65 checks passing: 4,562 ± 1000 = 5,562 and 3,562; roll-overs 9,500 + 1000 = 10,500, 3,990 + 10 = 4,000, 462,000 → 512,000 in 10,000s; 6,215 − 1000 = 5,215 (wrong 6,115, 6,205); word forms of 3,048, 403,072, 4,302,561 and 7,045,200 generated by code; 403,072 = 400,000 + 3,000 + 70 + 2; 548,301 > 543,801; B6 order; rounding with half-up: 4,367 → 4,370 / 4,400 / 4,000; 4,970 → 5,000; 4,450 → 4,000 (double rounding gives 5,000); 456,782 → 460,000; 950,500 → 1,000,000; 6,482,300 → 6,000,000; 132,603 → 130,000; 3,000 ÷ 300 = 10; 0.04 = 0.4 ÷ 10; 3.4 × 100 = 340; 10³ = 1000 (wrong 30, 13); 2.56 × 10³ = 2,560; 0.38 = 0.380 > 0.372 and 0.45 = 0.450 > 0.405; 347.392 expanded; 4.5 × 10⁶; 34 × 10⁶ = 3.4 × 10⁷; F4 order 98,000 < 610,000 < 2,300,000; 10⁴ × 10⁴ = 10⁸; E2 38,417 + 52,906 + 41,280 = 132,603 (estimate 130,000; wrong 140,000); E5 48 × 312 = 14,976 vs 15,000; every whole count 3,500-4,499 rounds to 4,000, 4,500 to 5,000; **E3 brute force over 1000-9999: only 5,754**; khipu cords 2,035 (wrong 235, 5,302), 452, 13; all stuck examples.
- Fractions are exact (`fractions.Fraction`), so no float rounding hides a slip. Rounding uses half-up throughout, matching the halfway rule taught.
- Style check run on the companion (`style188.py`, 191 checks): no em-dashes; teach and history cards at most 30 words; prompts at most 15 words; hints, feedback and explanations at most 20 words; scenes within 30/150/80; no "wrong" in feedback; answer positions 7/7/7.
- Number display: commas in every number of five or more digits and in four-digit numbers in the ledger (style choice: 4,562); the Slide Chart shows four-digit numbers the same way. Word tiles never insert "and" for whole numbers.
- Browser at 320 and 820 px: targets 44 px; tap as well as drag on the rail and line; the seven-column chart scrolls inside its own frame, never the page; every line and chart has a text equivalent ("4,367 is between 4,300 and 4,400, past the halfway stone").
- Nuria's Spanish number checked by a fluent reader before build.

- **Independent review, 2026-10-25.** Independent numbers script (`review_checks.py`, `python3 -I`, scratch area, written fresh, not the writer's): 40 grouped checks for this pack, all passing; independent style script (`style.py`) over all three files: 0 em-dashes, every prompt, hint, feedback, explanation and teach card within limits, right-answer positions recounted (A 7, B 7, C 7). Checked against Marble descriptions, research records and hard prerequisites, the assignment map, main and drafts #126-#151, spec 120's chapter names, the Hollis rule and pronouns, saves and routes; searches repeated for both anchors. Changed: made the spec consistent with *Number Sets & Infinity* now owned by spec 199 (Not targeted, owner question removed); claimed *Place value of each digit* (`mt_jY7uf0Cb7o`) and *Comparing Large Numbers* (`mt_MHaiUd2FLA`), which no spec on main or in drafts claims and the map does not list, with upstream rows, crosswalk rows for their prerequisites, and new Ledger Columns build and compare cases (3,006; 4,050; 4,562 vs 4,526; 987 vs 1,024; 4,050 vs 4,005); relabeled two Keeper's notes as math; fixed B6's "0 beats 5" wording, the integers gloss, K1's host name (the Flood Post) and Act V path 2's name; removed a correctio in H2.

## Review asks

**Math expert:**
1. Is "exactly halfway rounds up" acceptable as the single stated convention, with no mention of other conventions?
2. Is the range written as 3,500 ≤ count < 4,500 right for whole counts, with "the largest is 4,499" in the explanation?
3. Is "digits move, the point stays" with gray placeholder zeros the right picture, with "the point moves" never taught?
4. Is it sound to teach standard form for large numbers only and leave negative powers to a decimal pack?

**Owner questions, with defaults:**
1. Route `#library/ledger` in the library's back room? *Default: yes.*
2. Claim *Powers of Ten Notation* with large numbers only? *Default: yes, marked partial; the decimal-scales pack (199) adds negative powers.*
3. Keep K1 ("is there a biggest number?") as an unscored card now that *Number Sets & Infinity* belongs to spec 199? *Default: yes; it claims nothing and can link to 199's bench.*
4. First slice? *Default: the Counting Rail and the Nearest Post with Sets A and C, then the Ledger Columns.*
