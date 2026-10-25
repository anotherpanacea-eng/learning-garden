# 190. Planting Rows: factors, multiples and primes in the orchard

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/190-planting-rows-text.md); sources and open checks are in the [source audit](../source-audits/190-planting-rows.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the seven benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** the three history anchors were checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The number theory is standard and still needs the math check.

## Purpose

Multiplication is already pictured and practiced: equal groups and arrays ([spec 38](38-equal-group-spiral.md), [spec 50](50-whole-batch-gathering.md)), parcel packing and remainders ([spec 51](51-parcel-packing-and-remainders.md)), and every ordered fact 1 × 1 to 12 × 12 in the multiplication garden (`#facts`, [spec 07](07-cafe-expeditions-and-facts.md)). Nobody yet asks **what a number is made of**: whether it pairs up, which rectangles it makes, whether it is prime, square or cube, and what two numbers share. This pack takes fourteen untouched topics there, all through one physical question: *how can these trees be planted in rows?*

A child comes to understand that even means pairs with none left over (so 0 is even, and two unequal rows do not count); a rectangle of same-size squares is counted by rows × columns; turning a rectangle keeps the total (4 × 6 = 6 × 4) while sharing cannot be turned (12 ÷ 3 ≠ 3 ÷ 12); skip counts and table patterns have reasons; a number's factor pairs are its rectangles, found in order until they meet; factors are finite and multiples never stop; a prime has exactly one rectangle (1 is not prime; 2 is the only even prime); the sieve finds primes by crossing out multiples; square and cube numbers are literal squares of trees and cubes of crates; and, at the Keeper's Desk, every number has one set of primes, shared primes give the HCF, and no list of primes is ever complete.

**Builds on, never re-teaches:** spec 38 and spec 50 (equal groups, arrays, repeated addition); spec 51 (grouping, remainders; here a remainder is "left over" in a row test); the multiplication garden (facts are used, never drilled or recorded here; a **Show the table** button opens a read-only 12 × 12 chart); Seed Pile's multiples of 3 and 4 (spec 129, `#orchard/games`) and Ribbon Rows (specs 131 and 132); [spec 115](https://github.com/anotherpanacea-eng/learning-garden/pull/128)'s Two Bells, which already shows common multiples as two rhythms meeting in time. This pack's common multiples are spatial (rows of 6 or rows of 8) and its Keeper's Desk ties them to primes; it builds no timeline or bell model. **Siblings in the math build-out:** spec 184 (grain loft) owns volume, so a crate cube here is only a cube number; spec 185 owns area and perimeter, so a plot of squares here is a count, with area named only as "the next idea"; spec 189 owns counting back through zero, so the 1,000s count here stops at 0 and 10,000; spec 191 owns properties of operations in general; spec 194 owns sequences and extending table patterns.

**Not targeted:** nothing assigned is dropped. *Counting in 6s* is met for 6s, 7s, 9s, 25s and 1,000s counting upward; the part of its research about crossing zero into negatives is left to spec 189. *Times tables (age 8+)* is met for scaling chains, derived facts and the half-family of fractions as a pattern only; equivalent fractions themselves are taught in [spec 70](70-same-amount-new-cuts.md). *Square and cube numbers (age 11+)* is met at the Keeper's Desk for powers, roots and exact versus rounded roots; its order-of-operations prerequisite is met elsewhere by proposed spec 192 (see crosswalk).

## Place and story

**Host:** the **Planting Field** below the orchard gate, route `#orchard/planting`, the orchard keeper's (she/her) replanting ground after the storm. Linked from the Orchard, the Games Table (`#orchard/games`), the multiplication garden and the proposed Orchard Year (`#orchard/year`, [spec 149](https://github.com/anotherpanacea-eng/learning-garden/pull/140)). Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 3 *investigate and plant* | The storm flattened the young trees; 24 seedlings wait. Pip wants one long row; Dot and Bramble peg out 4 × 6 and 6 × 4 and argue. | Sprout: pairs for stakes. Seedling: rows and columns, turning. Sapling: every rectangle of 24. |
| II, ch. 1 *the weekly market* | The orchard keeper stacks crates into a 3 × 3 × 3 cube; Ember sits on top. | Sapling: square and cube numbers. |
| II, ch. 2 *a garden across the seasons* | Twenty-three old trees to move. No rectangle fits; one long row shelters the seedlings. | Sapling: primes and the Sieve Bed. |
| III, ch. 2 *the seed exchange* | Nuria brings 36 reed cuttings for 24 apple seedlings: twelve fair parcels. Her packet count is Sunzi's puzzle, solved at Wren's ledger. | Sapling: common factors and multiples. Keeper's Desk: factor trees, HCF and LCM, Sunzi, Euclid. |

Spec 120 already has a Sprout seed-exchange job (Nuria's bundles of 4 on the Equal Groups bench); this pack adds jobs beside it and replaces none. One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, orchard, parcels and packets are fiction, labeled apart from math, history and models. The old Keeper is not named (Hollis rule); no scene before Act III's end mentions the old Keeper at all.

## The knowledge

**Odd and even.** Pair the things. Every one partnered: **even**. One left over: **odd**. Even numbers split into **two equal rows** (8 = 4 + 4); 7 = 3 + 4 does not make 7 even, because the rows must match. **0 is even** (nothing is left over). Odd or even has nothing to do with size. The ones-digit rule comes last and with its reason: every ten is 5 pairs, so only the ones can leave one over. Adding one always swaps odd and even.

**Rows and columns.** A rectangle of same-size squares with no gaps or overlaps. Rows go across, columns go down; rows × squares in a row = all squares. Counting by ones is allowed and never marked down; rows × columns is shown beside it. The count of unit squares is the next pack's area.

**Turning and sharing.** A plan turned a quarter turn shows 4 rows of 6 as 6 rows of 4: same trees, so 4 × 6 = 6 × 4. Same total, different story (4 rows of 6 is a different planting from 6 rows of 4). Commutativity nearly halves the facts to learn (the diagonal has no partner). **Sharing cannot be turned**: 12 seedlings into 3 rows is 4 each; 3 seedlings into 12 rows leaves nine rows empty.

**Counting in steps.** 6s as doubled 3s (to 72); 7s as 5s and 2s together (to 84), with the most rehearsal; 9s (to 90) with tens up one and ones down one, digits summing to 9 from 9 to 90 (99 sums to 18 and is still a multiple of 9, so the check is scoped); 25s as quarters of 100, past 100 to 1,000; 1,000s to 10,000. Each count links to its table.

**Patterns with reasons.** Every pattern is followed by "why?": 5s end in 0 or 5 because each step adds 5; 4 × n is even because it doubles 2 × n; even + even is even because pairs plus pairs are pairs; the table is symmetric across its diagonal because a turned rectangle keeps its total. Not every guessed pattern holds (12 appears six times in the 12 × 12 square, 49 once). **Scaling chain**: 3 × 4 = 12, 3 × 40 = 120, 3 × 400 = 1,200 because 3 × 4 hundreds = 12 hundreds; "add zeros" is never offered as the reason. **Derived facts**: split a rectangle (8 × 7 = 8 × 5 + 8 × 2 = 40 + 16 = 56) and name it as a method for any fact. **Half-family**: 3/6, 4/8 and 6/12 equal 1/2 (top is half the bottom), so a fraction equal to 1/2 has an even bottom.

**Factors and multiples.** A **factor pair** is a rectangle: two numbers that multiply to the target. Search **in order** (1 row, 2 rows, 3 rows...) and stop when the next try would repeat a pair; a turned rectangle is the same pair (24 has four pairs, never eight). 1 and the number itself are always a pair. **Factors** go into a number and are finite; **multiples** are its hops and never stop (no largest multiple). **Common** means on both lists: common factors of 24 and 36 are 1, 2, 3, 4, 6, 12; the first common multiples of 6 and 8 are 24, 48, 72.

**Primes.** A **prime** has exactly two factors, 1 and itself: its only rectangle is one row. A **composite** number has more. **1 is neither.** **2 is the only even prime**; odd does not mean prime (9, 15, 21, 51 = 3 × 17). Primes to 19 are recalled from the Sieve Bed: 2, 3, 5, 7, 11, 13, 17, 19. To test a number up to 100, try the primes below 10 (2, 3, 5, 7), since 11 × 11 = 121; 97 survives all four and is prime. **The sieve**: cross out 1, then multiples of 2, 3, 5 and 7; the 25 plots left are the primes to 100.

**Squares and cubes.** 7² = 7 × 7 = 49, a square planting; never 7 × 2. 4³ = 4 × 4 × 4 = 64, a cube of crates, built by layers. 1² = 1. Square numbers sit on the table's diagonal and are exactly the numbers with an odd count of factors (one rectangle is a square). First ten squares to 100; cubes to 125. **Keeper's Desk:** a root undoes a power (√49 = 7, ∛64 = 4); powers of 2 to 2¹⁰ = 1,024 and of 3 to 3⁵ = 243; √2 is exact, and 1.414 is a rounded value (1.414² = 1.999396); powers come before + (3 + 2² = 7).

**Using it (Keeper's Desk).** Divisibility: 156 is a multiple of 6 because it is even **and** its digits sum to 12 (8 is even but not a multiple of 6). Re-factoring: 24 × 25 = 6 × (4 × 25) = 600; the factor is split before it moves (24 × 4 × 25 changes the value). Two squares from 1 to 99 summing to 100: only 36 + 64. **Factor trees**: split until every leaf is prime; 360 = 4 × 90 or 8 × 45, and both give 2 × 2 × 2 × 3 × 3 × 5 = 2³ × 3² × 5 (one set of primes however the tree starts). **HCF and LCM by primes**: 24 = 2³ × 3 and 36 = 2² × 3²; HCF uses only shared primes, the smaller count (2² × 3 = 12); LCM uses every prime, the larger count (2³ × 3² = 72); check 12 × 72 = 24 × 36 = 864. In context: 12 fair parcels of 2 seedlings and 3 cuttings; 72 seedlings is the smallest amount that is whole trays of 24 and whole bundles of 36.

**Real anchors (see audit).**
- **The sieve of Eratosthenes.** The earliest surviving description is in Nicomachus of Gerasa's *Introduction to Arithmetic* (early 2nd century CE, Book I, chapter 13), which credits the method to Eratosthenes of Cyrene (3rd century BCE, who worked in Alexandria). Eratosthenes' own writings on it are lost. Child text says "is said to have" and names Nicomachus.
- **Euclid, *Elements* Book IX, Proposition 20.** Euclid shows that the primes are more than any assigned multitude: multiply the primes on a list and add one; the result is prime or has a prime factor not on the list. Euclid did not phrase it as "infinitely many". Told simply with 2, 3, 5 → 31; the companion and the math check note that the new number need not itself be prime (2 × 3 × 5 × 7 × 11 × 13 + 1 = 30,031 = 59 × 509).
- **Sunzi's remainder puzzle.** The *Sunzi Suanjing* (Chinese; dated variously from the 3rd to the 5th century CE, author unknown), chapter 3, asks for things that leave 2 when counted by 3s, 3 by 5s and 2 by 7s, and gives 23 with a procedure (140 + 63 + 30 = 233, less 210). It is the earliest known problem of its kind; the book gives no general proof. The Ishango bone was considered and **not used** (its prime-number readings are contested).

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Pairing Path | T1-T3 | Eleven seedlings (3 steps) | Set A |
| Row Planter | T4-T6 | 4 rows of 5 (3 steps) | Set A |
| Every Rectangle | T10-T12 | Every rectangle of 18 (4 steps) | Set C |
| Pattern Fence | T7-T9 | Count in 6s to 24 (2 steps) | Set B |
| Sieve Bed | T13, H1 | Is 15 crossed out? (3 steps) | Set D |
| Squares and Crates | T14, T15 | A 4 × 4 × 4 cube (3 steps) | Set E (E1-E3) |
| Wren's Planting Ledger | T16, H2, H3 | Factor tree for 12 (3 steps) | Set E (E4-E10) |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (twelve listed in the companion, done the way the research recommends: pairing, rectangles in order, splitting a rectangle, building by layers); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** paired vs one left over; equal rows vs any two rows; big vs even; turned plan vs shared seedlings; same total vs same story; noticing vs explaining; ×10 by place value vs "add a zero"; factor vs multiple; a pair vs the same pair turned; odd vs prime; one rectangle vs one factor (1); 7² vs 7 × 2; square vs cube; exact √2 vs 1.414; shared primes (HCF) vs all primes (LCM).

**Top misconceptions designed against (from the Marble records):** parity by size; unequal groups as even; 0 as odd or neither; ones-digit rule with no reason; rows confused with row length; rotation changes the total; division is commutative; 6s/8s and 7s/9s drift; +10 for +9; 25s collapsing at 100; restating a pattern as its reason; patterns as coincidence; over-generalizing; "add a zero"; 3 × 8 and 8 × 3 as two pairs; missing middle pairs; not knowing when to stop; factors confused with multiples; "common" read loosely; odd means prime; 1 is prime; 2 is not prime; n² = n × 2; square and cube confused; a rounded root is exact; a root is division; a factor tree left with composite leaves; HCF and LCM swapped; even means a multiple of 6.

## The game or activity

**(a) The Pairing Path, model `pairs-v1`.** Seedlings (0-20) walk a path; **Make pairs** draws them two by two, and a leftover stands out in place (never colored alone). **Two equal rows** lines them up so a mismatch is visible. **Predict** asks whether one more will be odd or even before it arrives. Seedling depth adds the sentence strip (14 = 7 + 7) and then the ones-digit card with its tens-are-pairs reason. *A made-up model: seedlings two by two, up to 20.*

**(b) The Row Planter, model `row-planter-v1`.** A plot of same-size squares, 1-10 rows by 1-10 columns, one tree per square, aligned gridlines. Rows and columns are named by pointing. **Turn the plan** rotates a quarter turn and shows both count strips. **Share into rows** deals a number of seedlings into rows one at a time, so 3 into 12 visibly leaves rows empty. *A made-up model: rows across, columns down, no gaps.*

**(c) Every Rectangle, model `rectangles-v1`.** Any number 1-100. **Try 1 row**, then **Try the next**: a try that fits becomes a kept rectangle; one that doesn't shows the leftover. A turned rectangle is greeted as "already found". When the next try would repeat a pair, the meeting point is marked and the list closes. A number with only the 1-row rectangle shows "one rectangle: prime"; 1 shows "one factor: not prime". **Two lists** (Sapling) pours the factors of two numbers into overlapping rings, and a hop line marks multiples of each; numbers on both are "common". Data shown in the companion: 12, 18, 24, 36, 23 and the parcel pair 24 and 36. *A made-up model: rectangles only count with no gaps and nothing left over.*

**(d) The Pattern Fence, model `pattern-fence-v1`.** **Count mode**: posts every 6, 7, 9, 25 or 1,000 steps, placed by the child one at a time; **Show the 3s inside** halves each 6-step, **Show the 5s and 2s** splits each 7-step, **Ring the digits** marks the 9s pattern and states where it changes (after 90). **Table mode**: a read-only 12 × 12 multiplication square to shade (5s, 4s), fold on the diagonal, or split a rectangle into two known facts; then a spoken "why" for a grown-up (never stored). The half-family card and scaling strip sit here at Sapling. *A made-up model: a fence post wherever you count.*

**(e) The Sieve Bed, model `sieve-v1`.** A 10 × 10 bed of numbered plots. Steps appear one at a time: cross out 1; circle 2 and cross its multiples; circle the next uncrossed plot; repeat through 7; stop, with the reason (11 × 11 = 121). Any plot can be tapped to show why it was crossed ("15 = 3 × 5, crossed with the 3s"). The count of primes is shown only after the child finishes. *A made-up model: a nursery bed of 100 numbered plots.*

**(f) Squares and Crates, model `squares-crates-v1`.** Square plantings 1 × 1 to 10 × 10 beside a matching n × 2 strip (7² next to 7 × 2); cube stacks of crates 1 to 5 a side, built a layer at a time. **Undo a square** (Keeper's Desk) gives a total and asks for the side; the doubling strip, the order line and √2 live here. *A made-up model: square plantings and crate cubes, up to 10 and 5 a side.*

**(g) Wren's Planting Ledger, model `ledger-v1` (Keeper's Desk).** Wren Halloway's pages: **Factor trees** (Split, Done?, Collect the primes; a composite leaf invites another split; building a second tree for the same number shows the same primes); **Fair parcels** (HCF through shared primes); **Trays and bundles** (LCM); **Nuria's packets** (Sunzi's puzzle by listing, with the card H3); **Euclid's list** (multiply a list, add one, test in rows); **The square of two** (√2). *A made-up model: Wren's ledger problems, numbers made up.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Five sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Pairs and rows | Sprout (A1-A3), Seedling (A4-A7) | 7 | 3-choice, number |
| B. Counting and patterns | Seedling (B1-B3, B7), Sapling (B4-B6) | 7 | 3-choice, number with worked steps |
| C. Every rectangle | Seedling (C1, C2), Sapling (C3-C6) | 6 | 3-choice, number |
| D. Primes and the sieve | Sapling (D1-D4), Keeper's Desk (D5, D6) | 6 | 3-choice, tap the primes |
| E. Squares, cubes and the planting plan | Sapling (E1-E3), Keeper's Desk (E4-E10) | 10 | 3-choice, number, tap two, factor tree, *say why*, true / not true from this source |

Sprout items use pictures and words, no numerals. Over the 22 three-choice items the right answer sits at A seven times, B seven times and C eight times. Distractor lengths and tone match the right answer. D6 option A names the right stopping point with a reason that would fail for a bigger bed: the distractor that withholds the evidence-specific reason (11 × 11 = 121). *Say why* (E8) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `plantingRows` per explorer, absent until a first explicit action.

```
plantingRows: {
  version: 1,
  pairs:     [{ source, count: 0-20, predict: 'odd'|'even'|null, at }],                 // latest 12
  plots:     [{ source, rows: 1-10, cols: 1-10, turned: bool, share: 0-100|null, at }],  // latest 12
  rectangles:{ [n: 1-100]: { source, kept: [[a, b]], at } },                             // latest 24 numbers
  fence:     [{ source, step: 6|7|9|25|1000, posts: 0-40, at }],                         // latest 12
  sieve:     { source, crossed: [2-100], circled: [2-100], at } | null,
  builds:    [{ source, kind: 'square'|'cube', side: 1-10, at }],                        // latest 12
  ledger:    { [pageId]: { source, tree: [[parent, left, right]], at } },
  answers:   { [itemId]: { source, choice | value | values | tree, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only. Never recompute or rewrite saved results on load (a kept rectangle, crossed plot or factor tree is shown as saved, not re-derived); validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. *Say why* is never stored. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M2** multiplicative structure (parity, rectangles, commutativity, factors, multiples, primes, squares and cubes); **M1** counting and number representation (Odd or Even; powers and roots); **M7** mathematical practices (patterns with reasons, generalizing, proof by Euclid's argument); **H1** old texts as sources (Nicomachus, Euclid, Sunzi). Act families: I, II, III.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Decide odd or even by pairing and justify the digit rule; count a grid by rows and columns; show commutativity by turning and its limit with sharing; count in 6s, 7s, 9s, 25s, 1,000s; explain table patterns; find all factor pairs systematically; separate factors from multiples and find common ones; decide prime with a reason; use the sieve; recognize squares and cubes with notation; at Keeper's Desk, factor trees, HCF and LCM by primes, roots and exactness, Euclid's argument. |
| Teaching encounter | T1-T16 with step-revealed worked examples; H1-H3; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Make pairs; Turn the plan; Try the next; Show the 3s inside; one-step sieve; layer-by-layer cubes; Split in factor trees; the "I'm stuck" ladder. |
| New application | 23 trees (no rectangle); 3 into 12 rows; 97; the parcel pair; Sunzi's packets; Euclid's list; √2. |
| Purposeful revisit | Seed Pile's multiples (spec 129); Two Bells' common multiples (spec 115); the multiplication garden's facts (spec 07); the grain loft's volume (spec 184); area (spec 185); spec 120 Act III's bundles of 4. |
| Data boundary | Counts, sizes, kept pairs, crossed plots, trees, choices, values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`. Every target has a Marble teaching-research record; constraints followed as below (paraphrased, not copied).

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Odd and even numbers (`mt_0u4KLbvBa1`) | Pair first; equal one-to-one rows; 0 even; size irrelevant; digit rule derived later; show, not recite. Pairing Path, T1-T3, A1, A2, A4, A7. |
| Odd or Even (`mt_hniI4E-OCE`) | Pairing up to 20; link to 2s and doubles (8 = 4 + 4); 7 + 6 is not even; decouple from size. Two equal rows, sentence strip, Predict, A7. |
| Counting in 6s (`mt_7rJM8eWUfw`) | Structure, not chanting: 6s from 3s, 7s from 5 + 2 with most rehearsal, 9s pattern scoped to 9-90, 25s past 100, 1,000s; child generates the count. Pattern Fence count mode; B1, B2, B7. Crossing zero left to spec 189. |
| Patterns in Times Tables (`mt_w6MxaaoMXZ`) | Explain with a property, not a restatement; guard coincidence and over-generalizing; fold the square. Table mode, T8, B3, B4 (restatement and coincidence distractors). Physical folding offered off screen (button rectangles card). |
| Times tables, age 8+ (`mt_aivrWs6jrS`) | Scaling chain with a place-value reason; test the next case; derive-from-known as a named method; half-family tested. T9, scaling strip, half-family card, B5, B6. |
| Commutative Multiplication (`mt_C9ZfT-4cgn`) | Prove by rotating; teach division's boundary alongside; same product, different story; "nearly halves". Turn the plan, Share into rows, T5, T6, A3, A6. |
| Rows & Columns in Rectangles (`mt_UTnDKQkVX5`) | Same-size squares, no gaps; rows × columns shown, counting by ones never penalized; rows vs row length; planar only. Row Planter, T4, A5. |
| Factor Pairs & Commutativity (`mt_nZkL5-XjRX`) | Rectangles; search in order and stop at the meeting point; a turned pair counts once; 1 × n always; planar; 1 is not prime. Every Rectangle, T10, C1-C3. |
| Factors, multiples, and primes (`mt_FHIAv6dfhU`) | Systematic pairs; factors finite vs multiples infinite; "common" as overlap; problems, not lists; prime as exactly two factors. Two lists, T11, T12, C4-C6. |
| Prime numbers (`mt_y1XCVsIelg`) | One rectangle; 1 neither; 2 even prime; sieve run by the child; test primes to the square root; always justify. Sieve Bed, T13, H1, D1-D6. |
| Square and cube numbers (`mt_gxCIASSezX`) | Square as area picture, cube as layers; 7² beside 7 × 2; 1² = 1; diagonal; notation. Squares and Crates, T14, E1, E2. |
| Square and cube numbers, age 11+ (`mt_hCVPYlF-7Y`) | Powers as repeated multiplication; roots as inverse on perfect cases first; exact vs rounded; powers before +. Root mode, doubling strip, order line, T15, E10. |
| Factors, multiples, and primes, age 9+ (`mt_0Wg5F97osg`) | Use structure: divisibility (both 2 and 3 for 6), re-factor before computing, squares as a search space; justify. E3, E4, E5. |
| Factors, multiples, and primes, age 11+ (`mt_xhoOWnhtHq`) | Build trees two ways to see uniqueness; every leaf prime; HCF from shared primes (smaller count), LCM from all (larger count), guard the swap; HCF × LCM as a check. Ledger, T16, E6, E7. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, per-distractor feedback, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Odd and even numbers | Division as equal sharing (`mt_LpSuPgL31x`) | Met elsewhere: specs 38, 43, 50, 51 (main, scoped practice). Two equal rows recaps it inline. |
| Odd or Even | Counting in 2s (`mt_nvdpxAJTBG`) | Met elsewhere: authored patterns task (`#checkin/patterns`, main); Make pairs counts in 2s inline. |
| Counting in 6s | Skip Counting 4s, 8s, 50s, 100s (`mt_IzQvs7k_sE`) | Met elsewhere: authored patterns tasks (`#checkin/patterns`, `#adventure/patterns-explore`, main). |
| Patterns in Times Tables | Properties of Operations (`mt_Lb2ZnMdkYR`) | Met elsewhere: sibling spec 191 (math build-out, draft). Commutativity (T5) and the rectangle split (T9) are taught here inline; no claim on the topic. Documented gap if 191 does not ship. |
| Patterns in Times Tables | Fluent multiplication and division facts (`mt_WX30dzi4dt`) | Supported inline: the multiplication garden (`#facts`, spec 07) practices all facts; Show the table is always available; no claim. Documented gap: no spec claims fluency (spec 51 takes an access exception). |
| Times tables (age 8+) | Extending Table Patterns (`mt_2jbUekyTu4`) | Met elsewhere: sibling spec 194 (math build-out, draft). Documented gap if 194 does not ship. |
| Commutative Multiplication | Multiplication as repeated addition (`mt_PZ909yPrEC`) | Met elsewhere: specs 50, 51, 74 (main). |
| Rows & Columns in Rectangles | Arrays for multiplication, age 7+ (`mt_B1zj1RwQ3a`) | Met elsewhere: supplied arrays in specs 50 and 51 (main; referenced, not mapped as covered). T4 recaps arrays inline. |
| Factor Pairs & Commutativity | All times tables to 12×12 (`mt_K5jM7vlVhA`) | Supported inline: the multiplication garden and Show the table; Try the next shows the leftover, so no recall is required. Documented gap for the claim (no spec claims it). |
| Factors, multiples, and primes | All times tables to 12×12 (`mt_K5jM7vlVhA`) | As above. |
| Factors, multiples, and primes | Factor Pairs & Commutativity (`mt_nZkL5-XjRX`) | Taught here (Every Rectangle before Two lists). |
| Prime numbers | Factors, multiples, and primes (`mt_FHIAv6dfhU`) | Taught here (T10-T12 before T13). |
| Square and cube numbers | All times tables to 12×12 (`mt_K5jM7vlVhA`) | As above; squares are built and counted, not recalled. |
| Factors, multiples, and primes (age 9+) | Factors, multiples, and primes (`mt_FHIAv6dfhU`) | Taught here. |
| Factors, multiples, and primes (age 9+) | Square and cube numbers (`mt_gxCIASSezX`) | Taught here (Squares and Crates before the Ledger). |
| Factors, multiples, and primes (age 11+) | Factors, multiples, and primes (`mt_FHIAv6dfhU`) | Taught here. |
| Square and cube numbers (age 11+) | Ratio, age 11+ (`mt_X5cypSGoGU`; its description is order of operations with powers and roots) | Met elsewhere: proposed spec 192 (order-of-the-day, math build-out), to which the build-out map reassigned it. Supported inline by the order line (3 + 2² = 7); no claim. Documented gap if 192 does not ship. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these fourteen targets; within the math build-out they are assigned only to this spec. Keyword greps for prime, factor pair, odd and even, square number, sieve and common multiple found only spec 115's Two Bells (common multiple, not a claimed target), spec 165's Eratosthenes measuring the Earth (a different achievement; this pack's H1 can link to it) and non-math sieves in specs 145 and 167.

## Checks for implementation

- **Numbers script (2026-10-25):** `check190.py` (`python3 -I`, scratch area, not in the repo), 167 checks passing: parity 0-20, 0 even, 7 = 3 + 4 and 13 = 7 + 6 unequal; A5 15 (wrong 8, 12 edge squares); factor pairs of 10, 12, 15, 16, 18, 23, 24, 36, 48, 60; 24 has 4 pairs (wrong 8), C1 options 25/21/24; common factors of 24 and 36 = 1, 2, 3, 4, 6, 12, HCF 12, parcels 2 + 3; first common multiples of 6 and 8 = 24, 48, 72 (wrong 14, 48); 6s to 72 as doubled 3s, 8th post 48; 7s to 84 as 5s + 2s; 9s digit sums 9 for 9-90, 99 sums to 18; 25s, 1,000s; 5s end in 0 or 5, 4n even, table symmetry, 12 appears six times and 49 once; scaling chain 12/120/1,200/12,000; 8 × 7 = 40 + 16 (wrong 42, 54); sieve with 2, 3, 5, 7 leaves exactly the 25 primes to 100, 74 crossed, every composite to 100 has a prime factor ≤ 7, 11 × 11 = 121; 51 = 3 × 17, 91 = 7 × 13, 97 prime; first ten squares, cubes to 125, 7² = 49 (wrong 14), 4³ = 64 (wrong 12, 16); **brute force: 36 + 64 is the only pair of distinct positive squares summing to 100**; squares are exactly the numbers to 100 with an odd factor count; 2¹⁰ = 1,024, 3⁵ = 243; 1.414² = 1.999396; 3 + 2² = 7; 156 = 6 × 26; 24 × 25 = 600 (wrong 2,400); 360 = 2³ × 3² × 5 from both 4 × 90 and 8 × 45; HCF 12, LCM 72, 12 × 72 = 864; Euclid 31, 211, 30,031 = 59 × 509; **brute force: 23 is the only solution under 105 to Sunzi's conditions** (next 128), method 233 − 210 = 23, weights 70, 21, 15; anchor year spans.
- Rectangles never show gaps; turned pairs are never listed twice; the sieve's stop reason is always shown; 7² always appears beside 7 × 2 when asked; model lines show on every bench. Sprout items show no numerals; feedback never says "wrong".
- Style check run on the companion: no em-dashes; teach cards at most 30 words; prompts and hints at most 15 words; feedback and explanations at most 20 words; no British spellings; no Hollis.
- Browser at 320 and 820 px: targets 44 px; the 10 × 10 sieve and 12 × 12 table scroll inside a labeled region with sticky headers (as in `#facts`); tap-to-place as well as drag; every grid has a text equivalent ("4 rows of 6: 24 trees").
- Nuria's Spanish lines checked by a fluent reader before build.

- **Independent review, 2026-10-25.** Independent numbers script (`review_checks.py`, `python3 -I`, scratch area, written fresh, not the writer's): 25 grouped checks for this pack, all passing; independent style script (`style.py`) over all three files: 0 em-dashes, every prompt, hint, feedback, explanation and teach card within limits, right-answer positions recounted (A 7, B 7, C 8). Checked as for spec 188. Changed: the order-of-operations prerequisite (`mt_X5cypSGoGU`) is now met elsewhere by spec 192, per the map's reassignment; E3 now says "from 1 to 99" so 0 + 100 cannot also answer; the cube-number gloss ("times itself three times" described a fourth power); the number 1 named plainly in Scene 2's note; guided items no longer copy their teach examples (eleven seedlings; rectangles of 18); two correctio lines removed. The companion was trimmed only slightly (788 to about 780 lines): its length is the 36 items with full feedback, and no padding could go without cutting items or teaching.

## Review asks

**Math check:**
1. Is "a prime has exactly one rectangle" safe as the picture, given 1 also has one rectangle (handled by "exactly two factors")?
2. Is Euclid's argument told fairly with 2, 3, 5 → 31, with the note that the new number need not be prime?
3. Is the half-family card (a fraction equal to 1/2 has an even bottom) acceptable as a pattern without re-teaching equivalence?
4. Is the order line (3 + 2² = 7) enough inline support for the age-11+ powers target until spec 192's order-of-operations bench ships?

**Owner questions, with defaults:**
1. Route `#orchard/planting` beside the Games Table? *Default: yes.*
2. Fourteen targets in one pack, or split the Keeper's Desk Ledger off? *Default: one pack; the Ledger can ship later as its own slice.*
3. First slice? *Default: Every Rectangle with Set C, then the Pairing Path and the Sieve Bed.*
4. Use the Ishango bone at all? *Default: no; its readings are contested.*
