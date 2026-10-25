# 197. Joining Fractions: new names, wholes and pieces, and adding with a common cut

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/197-joining-fractions-text.md); sources and open checks are in the [source audit](../source-audits/197-joining-fractions.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. The merged Workshop [Ribbon Recut Table (spec 100)](100-ribbon-recut-table.md), café [Join the Portions (spec 103)](103-join-the-portions.md), [Fraction Trail (spec 52)](52-fraction-trail.md) and [Same Amount, New Cuts (spec 70)](70-same-amount-new-cuts.md) are untouched; no saved result of theirs is read or reinterpreted. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The math is standard and still needs the math check.

## Purpose

The garden already shows that one colored stretch can carry two names (specs 52, 70, 100: splits in two only, names supplied) and that same-size pieces can be joined on a tray (spec 103: supplied equations, one pass through 5/4). Nobody yet asks a child to **produce** an equivalent fraction by any factor, **simplify** to simplest form, **convert** between mixed numbers and improper fractions, **add or subtract** with like, related or unlike denominators, **trade a whole** in mixed-number subtraction, or **solve fraction word problems** with a benchmark guess first. This pack takes eleven untouched Fractions topics there, plus the practice home of *Adding Fractions (Same Denominator)* (`mt_CBHwluE6Lp`), which merged spec 103 references as explanation only.

A child comes to understand that splitting every part into n multiplies both counts by n and leaves the amount alone, while adding the same number to top and bottom moves the end; grouping parts by a size that goes into both counts is the same move in reverse, and simplest form is reached when only 1 goes into both; an improper fraction is a legitimate number with wholes already inside it (b pieces of size 1/b make a whole); the denominator names the piece and the numerator counts pieces, so same-size pieces add by their counts and the bottoms never add; a fraction splits into same-size pieces in many ways; unlike pieces must first be cut to one shared size, changing both tops; a mixed-number sum may pass a whole and a difference may need a whole traded for pieces (or improper fractions instead); and every answer can be checked against 0, 1/2 and 1 before it is trusted.

**Builds on, never re-teaches:** spec 100's split-in-two on a fixed stretch (here: split by 2, 3 or 4, group by any common factor, numerals produced by the child); spec 70's fixed reference (here: chains of names); spec 52's past-one flag (here: full conversion both ways); spec 103's moving pieces with supplied equations (here: the child writes sums, differences and decompositions); sibling spec 190's factors and common factors (here: recapped in T5 only, as bunch sizes); sibling spec 196's fractions of a whole and unit fractions (here: assumed, recapped on the model card). **Not targeted:** *Mixed & Improper Fractions* (`mt_gNUE4B3vuk`), dropped after reading its pinned description and research: despite the name it is a four-operations synthesis across negative integers, decimals and multiplying and dividing fractions, with hard prerequisites on multiplying and dividing fractions owned by sibling spec 198. It is returned unclaimed for reassignment (a natural home is a pack after 198); this pack's mixed-number addition and subtraction makes no claim on it. Independent review checked whether spec 198 could take it: 198 teaches multiplying and dividing fractions, but the signed-number and decimal written methods are taught in neither pack, so 198 declines it too and it stays unassigned. Multiplying and dividing fractions belong to spec 198; comparing and ordering to spec 196.

## Place and story

**Host:** the **Ropewalk**, route `#workshop/ropewalk`: a long shed behind the Workshop where the mending crews lay rope, with Bramble's dye shed at the near end, beside the meadow-edge ribbon gate. Linked from the Workshop, spec 100's Recut Table end screen, spec 103's café portions and sibling spec 194's Ribbon Gate. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 3 *Ember's birthday* | Bramble joins 3/8 m of blue to 2/8 m of gold for a chair bow; Pip says 5/16, which is shorter than the blue alone. | Sprout: same-size pieces join. Seedling: 3/8 + 2/8. |
| III, ch. 1 *the floating market* | The Vadoalto baker's boat needs a longer mooring rope; the crew splices 2 3/5 m and 1 4/5 m, and Pip gets "three and seven fifths". | Seedling: count past a whole. Sapling: tidy to 4 2/5. |
| III, ch. 3 *the route by the high ford* | Where the faded ribbons stop, Bramble cuts 3/4 m and 2/3 m from a 2 1/2 m spool to mark the Way. Enough for another post? | Sapling: twelfths. Keeper's Desk: how much is left. |
| III, ch. 4 *letters up and down the river* | Léon has cut 1 3/4 m of frayed rope from 4 1/4 m; his cousin "turned the quarters around". | Sapling: trade a whole; reply card. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, shed, crews, boats and Bramble's grandmother are fiction, labeled apart from math, history and models. The old Keeper is not named (Hollis rule); no scene here mentions the Keeper.

## The knowledge

**Equivalent fractions by splitting.** Picture first: a one-meter ribbon colored from 0 to a flag. **Split every part into n**: each part becomes n smaller equal parts, so the colored count and the total count both multiply by n while the flag stays put (1/3 → 2/6 → 4/12; 2/3 = 4/6 = 6/9 = 8/12; 3/5 = 6/10 = 9/15 = 12/20; 3/10 = 30/100 on a grid at Sapling). Chains expose the times-table pattern (1/4 = 2/8 = 3/12). **Contrast:** adding 1 to top and bottom is not splitting; 2/3 → 3/4 visibly moves the end (3/4 is longer), and 1/3 → 2/4 does too. Bigger numbers do not mean a bigger amount (4/6 is not more than 2/3).

**Simplifying by grouping.** Group the parts into equal bunches; a bunch size must go into **both** counts (a non-common size leaves parts over, shown on the bar). Fewer, bigger parts, same flag: 6/8 = 3/4, 4/8 = 1/2, 18/24 = 9/12 = 3/4 (÷2 then ÷3, or ÷6 at once). **Simplest form**: only 1 goes into both counts; 9/12 is right but not finished. Subtracting the same number from both changes the value (6/8 → 4/6). Common factors are recapped as bunch sizes; listing factors is spec 190's.

**Mixed numbers and improper fractions.** b pieces of size 1/b make one whole. Count unit pieces past the whole: 11/4 is two groups of four quarters and 3 more, 2 3/4 (not 3 3/4, not 2 7/4). Back the other way: each whole is b pieces, so 3 2/5 = 15 fifths + 2 fifths = 17/5 (not 5/5, 15/5 or 32/5); the denominator never changes. Always convert back to check. An improper fraction is a fine answer: 7/4 and 1 3/4 name one length.

**Same-size pieces (like denominators).** The denominator names the piece; the numerator counts pieces (dual naming: "two fifths and two fifths make four fifths"). 2/5 + 2/5 = 4/5; 5/7 + 1/7 = 6/7; 6/8 − 3/8 = 3/8 (not 3, which drops the unit). **Why the bottoms never add:** 2/5 + 2/5 "= 4/10" lays four tenth-pieces beside the built 4/5, and they cover only 2/5, less than one addend. Sums may pass one: 3/4 + 2/4 = 5/4 = 1 1/4, with the next meter the same size.

**What fraction addition means.** Joining and separating same-size parts, the unit fixed. A fraction decomposes in many ways: 5/6 = 1/6 + 4/6 = 2/6 + 3/6 = 1/6 + 1/6 + 3/6; 3/8 = 1/8 + 1/8 + 1/8 = 1/8 + 2/8; 2 1/8 = 8/8 + 8/8 + 1/8 = 17/8. A "decomposition" with changed denominators (5/6 = 2/3 + 3/3) fails its own check: it totals 5/3.

**Unlike denominators: a common cut.** Pieces must be the same size before counting. **Related** first (one denominator a multiple of the other, so only one fraction changes): 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2; 3/4 − 1/8 = 6/8 − 1/8 = 5/8; 2/5 + 3/10 = 7/10. **Unrelated** next (a number in both times tables; both tops change): 2/3 + 1/4 = 8/12 + 3/12 = 11/12; 2/5 + 1/3 = 6/15 + 5/15 = 11/15; 2/3 + 5/4 = 23/12 = 1 11/12; 3/4 − 2/3 = 1/12. Errors designed against: adding across (2/9, 3/7, 7/7), changing only the bottom (1/3 → 1/6), changing one top only (2/12 + 15/12), leaving 3/6 unsimplified (prompted, not penalized). **Guess the zone first** with 0, 1/2 and 1: 2/5 + 1/2 cannot be 3/7, because 3/7 is under 1/2 and the sum must be over.

**Mixed numbers, added and subtracted.** Two routes, both taught: wholes and parts separately, or improper fractions. Adding may pass a whole: 2 3/5 + 1 4/5 = 3 7/5 = 4 2/5 (3 7/5 is accepted as equal, then tidied). Subtracting may need a **trade**: 4 2/6 − 1 5/6, since 2/6 < 5/6, becomes 3 8/6 − 1 5/6 = 2 3/6 = 2 1/2 (26/6 − 11/6 = 15/6 by the other route); taking the smaller count from the larger gives the error 3 3/6. Without a trade: 5 3/4 − 3 1/4 = 2 1/2. Unlike, at the Keeper's Desk: 3 1/4 − 1 3/5 = 3 5/20 − 1 12/20 = 2 25/20 − 1 12/20 = 1 13/20 (65/20 − 32/20 = 33/20).

**Word problems.** Draw the story as a bar first, decide **join or take away** from the action, guess the zone, compute, then answer in the story's unit. Like denominators: a dye pot 3/4 L − 2/4 L poured = 1/4 L (not 2/4, the part poured; not 5/4); ribbons 2 3/8 + 1 5/8 = 4 m (not 3 8/16). Unlike: Pip 2/5 + magpie 1/3 of one pie = 11/15 (between 1/2 and 1, as guessed; 3/8 is less than Pip's share alone). **How much is left**: a 2 1/2 m spool less cuts of 3/4 m and 2/3 m: cuts 17/12, spool 30/12, left 13/12 = 1 1/12 m. Every story uses one same-size whole.

**Real anchors (see audit).**
- **The Nine Chapters' rules.** *The Nine Chapters on the Mathematical Art*, a Chinese text compiled in the Han dynasty (by the 1st century CE at the latest; Liu Hui's commentary is dated 263 CE), gives in its first chapter (on field areas) a rule for reducing fractions: halve both if you can; otherwise subtract the smaller from the greater repeatedly until the two are equal, the "equal number" (*dengshu*), and divide both by it. Its worked problems include 12/18 → 2/3 and 49/91 → 7/13. The same chapter's rule for combining fractions cross-multiplies and divides by the product of denominators (1/3 + 2/5 = 11/15). Child text: "about 2,000 years ago", the rule and 49/91; Wren's desk card applies it to 12/18.
- **Al-Hassar's fraction bar.** Abu Bakr al-Hassar, a 12th-century mathematician of the Maghreb or al-Andalus, wrote an arithmetic book (oldest surviving copy dated 1194) that instructs writing the denominator under a horizontal line: the earliest known written use of the fraction bar. Historians (Djebbar) think it was already common in Maghreb teaching. Child text says "more than 800 years ago", "oldest known writing" and "historians think teachers there were already using the bar".
- **Fibonacci's notation.** In *Liber Abaci* (1202), Leonardo of Pisa used the bar and wrote a mixed number with the fraction first (the 1/3, then the 2 for 2 1/3), and stacked composite fractions read right to left. Keeper's Desk card only: notation is an agreed choice.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 2-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Split-and-Group Ribbon | T1-T5 | 1/2 into sixths (3 steps); group 4/6 (2 steps) | Set A |
| Spool Rack | T6, T7 | 7 thirds into wholes (3 steps) | Set C (C1, C2, C6) |
| Joining Table | T8-T10 | 1/4 + 2/4 (3 steps) | Set B |
| Common Cut | T11-T13 | 1/2 + 1/4 (3 steps) | Set D |
| Rope Walk | T14, T15 | 1 3/4 + 1 2/4 (3 steps) | Set C (C3-C5), D6 |
| Order Board | T16, T13 | 1/2 m + 1/8 m (3 steps) | Set E |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists eight); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** split vs add-to-both; more pieces vs more ribbon; grouping vs subtracting from both; simplified vs simplest; 11/4 as two fours and 3 vs 11 − 4; each whole as b pieces vs as 1; counting pieces vs adding sizes; 4/5 vs 4/10 laid side by side; one split vs many; related (change one) vs unrelated (change both); bottom-only renaming vs both numbers; guessed zone vs exact; carry a whole vs leave 3 7/5; trade a whole vs flip the parts; join vs take away; the part poured vs the part left.

**Top misconceptions designed against (from the Marble records):** additive equivalence; one number changed; bigger numbers mean bigger amount; simplifying by subtracting; stopping before simplest form; mixed → improper as adding the whole to the top, forgetting the extra pieces, or gluing digits; miscounting wholes; improper fractions "not allowed"; changing the denominator in conversion; adding the denominators; dropping the unit; only one decomposition; decomposing with changed denominators; inserting the larger denominator; scaling only one numerator; no estimate; never trading; leaving an improper part; choosing the wrong operation; reporting the part removed.

## The game or activity

**(a) Split-and-Group Ribbon, model `splitgroup-v1`.** One meter bar colored from 0 to a fixed brass flag, with an uncut reference strip above (spec 100's layout). **Split every part into 2 / 3 / 4** and **Group in 2s ... 6s**; at most 24 parts. A group size that does not go into both counts shows the leftover parts and changes nothing. The readout gives the current fraction; **Add to the chain** keeps each name in a row. **Add 1 to each** draws a second ribbon at the additive fraction beside the first (the contrast). Sapling adds a 10 × 10 tenths-to-hundredths grid; Keeper's Desk adds **Wren's desk card** (the Nine Chapters' rule on 12/18). Cases: 1/3, 2/3, 3/4, 3/5, 1/4, 4/8, 6/8, 9/12, 18/24, 12/18, 3/10. *A made-up model: one screen meter, not cloth.*

**(b) Spool Rack, model `wholes-rack-v1`.** **Stamp one piece** adds a 1/b-meter piece; **Close full spools** fuses every b pieces into a whole spool; **Break a spool** reverses it. Both names light one point on a 0-4 line. Cases: 11/4, 7/3, 7/4, 17/5 and 3 2/5, 2 1/8, 6/5 + 4/5 = 10/5 = 2.

**(c) Joining Table, model `join-table-v1`.** A meter bar in one piece size (fifths, sixths, sevenths, eighths, quarters). **Join** and **Take away** change the count; past one meter, the next same-size bar appears. **Split it another way** asks for a second and third decomposition of the same amount. **Lay the bottoms-added answer beside it** draws, for example, 4/10 next to the built 4/5. Builds on spec 103 by asking the child for the result, subtraction and decompositions. Cases run within one meter first (2/5 + 2/5, 6/8 − 3/8), then past it (3/4 + 2/4 = 5/4, 3/5 + 4/5 = 7/5 = 1 2/5) and back across it (7/5 − 4/5 = 3/5), with the two bars side by side.

**(d) Common Cut, model `common-cut-v1`.** Two meter ribbons cut differently. First **Place on the 0, 1/2, 1 line** and choose a zone. **Try a common cut** offers three sizes (for thirds and quarters: 7, 12, 24); a size that does not split one ribbon evenly says so; a fitting size recuts both and shows both tops changing. Then **Join** or **Take away**, and an optional **Simplify** (3/6 → 1/2). The zone guess and the exact answer sit side by side. Related cases first (1/3 + 1/6, 3/4 − 1/8, 2/5 + 3/10), then unrelated (2/3 + 1/4, 2/5 + 1/3, 2/3 + 5/4, 3/4 − 2/3).

**(e) Rope Walk, model `ropewalk-v1`.** Whole-meter coils plus same-size pieces. **Join**, **Cut off**, **Coil a whole meter** (b pieces become a coil), **Untie a coil into pieces** (the trade), and **Write as improper fractions** (the second route, shown beside the first). Cases: 1 3/4 + 1 2/4, 2 3/5 + 1 4/5, 5 3/4 − 3 1/4, 4 2/6 − 1 5/6, 4 1/4 − 1 3/4 (Léon), and at the Keeper's Desk 3 1/4 − 1 3/5 after a common cut. *A made-up model: splices use no rope.*

**(f) Order Board, model `order-board-v1`.** Story cards with five fixed steps: **Draw the bar**, **Join or take away?**, **Guess the zone**, **Work it out** (opens the matching bench's tools in place), **Answer the order** in its unit. Cards: the dye pot, the chair bow, the joined ribbons, Pip and the magpie's pie, the spool's leftovers. *Made-up orders; every card uses one same-size whole.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Five sets, **30 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Same amount, new names | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice with pictures, number |
| B. Joining same-size pieces | Sprout (B1, B2), Seedling (B3-B6) | 6 | 3-choice, number |
| C. Wholes and pieces | Seedling (C1, C2), Sapling (C3-C6) | 6 | 3-choice, number with worked steps |
| D. A common cut | Sapling (D1-D4), Keeper's Desk (D5, D6) | 6 | 3-choice, number with zone guess |
| E. Orders and sources | Sapling (E1, E2), Keeper's Desk (E3-E6) | 6 | 3-choice, number, *say why*, true / not true from this source |

Sprout items use pictures and words, no fraction numerals. Over the 18 three-choice items the right answer sits at A, B and C six times each. Distractors carry a tagged misconception; C4 and D4 each hold one choice that withholds more than the evidence requires ("it can't be done", "you can't tell without working it out"), wrong because a trade or a benchmark settles it. Number items accept any equal form and then offer the tidy form as a next step. *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `ropewalk` per explorer, absent until a first explicit action.

```
ropewalk: {
  version: 1,
  ribbon:  [{ source, caseId, chain: [[num, den]], at }],               // latest 12; den ≤ 24 (≤ 100 on the grid)
  spools:  [{ source, caseId, pieces: 0-40, size: 2-12, at }],          // latest 12
  joins:   { [caseId]: { source, splits: [[num]], at } },               // decompositions, sixths/eighths only
  cuts:    { [caseId]: { source, zone: 'under-half'|'half-to-one'|'one-to-two'|'over-two', common: int, at } },
  answers: { [itemId]: { source, choice | value: { whole, num, den } | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only; no free text (*say why* is never stored). Never recompute, simplify or rewrite saved results on load; validate ids, integer ranges and nonzero denominators only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M3** fractions (equivalence, simplifying, mixed numbers, addition and subtraction, word problems); **M2** multiplication facts as split and group sizes; **H1** three old texts as sources. Act families: II, III.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Generate and explain equivalent fractions by splitting; simplify to simplest form by common factors; convert mixed numbers and improper fractions both ways; add and subtract like denominators and explain why the bottoms stay; decompose a fraction more than one way; add and subtract related and unlike denominators with a common denominator; add and subtract mixed numbers with and without trading; solve fraction word problems with a benchmark check. |
| Teaching encounter | T1-T16 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson; Add 1 to each and the bottoms-added overlay as live contrasts. |
| Supported practice | Uncut reference strip; leftover-parts signal; spools that close; locked piece size; offered common cuts; two subtraction routes; the "I'm stuck" ladder. |
| New application | Tenths to hundredths; 2 1/8 as 17/8; unrelated denominators; Léon's letter; the spool's leftovers; the Nine Chapters' 49/91. |
| Purposeful revisit | Specs 52, 70 and 100 (same stretch, new name); spec 103 (joining pieces); spec 190 (common factors); spec 196 (unit fractions); spec 198 (operations on the same pairs). |
| Data boundary | Chains, piece counts, decompositions, zones, choices, values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Equivalent fractions, age 8+ (`mt_FP-mjXaq3B`) | Derive ×n from re-partitioning; both directions; chains; "why the same?" on the picture against the additive error. Split-and-Group, T1-T3, A1, A2, A4, A6. |
| Equivalent fractions, age 9+ (`mt_ebPelt-qAl`) | General a/b = na/nb with the fixed magnitude shown; predict before overlaying the additive case; tenths to hundredths; bigger-numbers bias. Add 1 to each, grid, T2, A5. |
| Simplifying Fractions (`mt_b7T-CjOYUR`) | Equivalence in reverse; common factor felt as leftovers; simplified vs simplest; any route accepted; subtracting contrasted; common multiples for a shared denominator. Group buttons, T4, T5, A3, Wren's card, Common Cut. |
| Mixed numbers and improper fractions (`mt_o_p-3tCxiM`) | Iterate unit pieces past one; b pieces make a whole; "each whole is b pieces"; convert back; improper fractions legitimate. Spool Rack, T6, T7, C1, C2, C6. |
| Fraction Addition Concepts (`mt_VgOePicFYK`) | Join and separate like parts; more than one decomposition; mixed number as one count of parts. Split it another way, T10, B5, 2 1/8 case. |
| Simple Fraction Sums (`mt_a1FdAsRKOF`) | Dual naming; fixed unit bar; confront 4/10 by overlay; subtraction alongside; no bare whole numbers. Joining Table, T8, T9, B1-B4. |
| Adding Fractions, Same Denominator (`mt_CBHwluE6Lp`) | Let the count of like units pass the denominator so the improper sum arises from adding; two bars side by side so spilled pieces regroup into 1 and a remainder; name 7/5 as a real number; subtract across the whole too; confront add-across (7/10) and capping at 1. Joining Table past one meter, T8, T9, B6 (with the "can't go past one" distractor), C3's fifths, C6. Practice home added in review: spec 103 is explanation only ("no unsupplied calculation, general subtraction, learner-produced mixed number"). |
| Adding fractions, different denominators (`mt_-V7EnqU7gG`) | Feel the need for one unit; related pairs change one fraction; both numbers scale; estimate; simplify. Common Cut related cases, T11, D1, D2. |
| Adding Fractions, Unlike Denominators (`mt_14T5yPXUq_`) | Both fractions renamed; both tops scale; mixed-number subtraction with trade or improper route; estimate gates the answer. T12, D3, D5, D6. |
| Adding and subtracting mixed numbers (`mt_70qDTI14td`) | Two routes; the awkward subtraction motivates improper fractions; physical trade; tidy 3 7/5; estimate with wholes. Rope Walk, T14, T15, C3-C5. |
| Addition and subtraction word problems (`mt_ZLqYE7la4Z`) | Draw the story first; join vs separate; fixed unit; whole-number estimate; regroup a crossing sum. Order Board, T16, E1, E2. |
| Fraction Word Problems (`mt_e7filQgayF`) | Benchmarks 0, 1/2, 1 before computing; reject impossible sums; both fractions scaled. Zone line, T13, D4, E3-E5. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Equivalent fractions, age 8+ | Equivalent fractions on a number line (`mt_Ep7TDFuYUa`) | Met elsewhere: [spec 52](52-fraction-trail.md) Fraction Trail (on main); recapped by the uncut reference strip. |
| Equivalent fractions, age 9+ | Equivalent fractions on a number line (`mt_Ep7TDFuYUa`) | Met elsewhere: spec 52. |
| Equivalent fractions, age 9+ | Equivalent fractions, age 8+ (`mt_FP-mjXaq3B`) | Taught here (T1-T3 before T2's general case). |
| Simplifying Fractions | Equivalent fractions, age 9+ (`mt_ebPelt-qAl`) | Taught here. |
| Simplifying Fractions | Factors, multiples, and primes (`mt_FHIAv6dfhU`) | Met elsewhere: proposed spec 190 (math build-out); common factors recapped as bunch sizes in T5. |
| Simplifying Fractions | Fraction Notation (`mt_vKcxX6iNOA`) | Met elsewhere: specs [43](43-sharing-counter.md) and 52 (on main). |
| Mixed numbers and improper fractions | Understanding fractions, age 9+ (`mt_09sySPqM9Z`) | Met elsewhere: proposed spec 196 (math build-out); recapped on the model card. |
| Mixed numbers and improper fractions | Fractions of a whole, age 8+ (`mt_AYzE1EAvI0`) | Met elsewhere: proposed spec 196 (math build-out). |
| Mixed numbers and improper fractions | Fraction Notation (`mt_vKcxX6iNOA`) | Met elsewhere: specs 43, 52. |
| Fraction Addition Concepts | Understanding fractions, age 9+ (`mt_09sySPqM9Z`) | Met elsewhere: proposed spec 196. |
| Fraction Addition Concepts | Adding Fractions, Same Denominator (`mt_CBHwluE6Lp`) | Taught here (Joining Table past one meter, B6, before Split it another way); spec 103 remains its explanation reference. |
| Simple Fraction Sums | Fractions on a number line (`mt_Kr3IyA6m-O`) | Met elsewhere: specs 43, 52. |
| Adding Fractions, Same Denominator | Simple Fraction Sums (`mt_a1FdAsRKOF`) | Taught here (B3, B4 within one meter before B6 past it). |
| Adding fractions, different denominators | Equivalent fractions, age 9+ (`mt_ebPelt-qAl`) | Taught here. |
| Adding fractions, different denominators | Fraction Addition Concepts (`mt_VgOePicFYK`) | Taught here (Joining Table before Common Cut). |
| Adding Fractions, Unlike Denominators | Simplifying Fractions (`mt_b7T-CjOYUR`) | Taught here. |
| Adding Fractions, Unlike Denominators | Adding fractions, different denominators (`mt_-V7EnqU7gG`) | Taught here (related cases before unrelated). |
| Adding and subtracting mixed numbers | Mixed numbers and improper fractions (`mt_o_p-3tCxiM`) | Taught here (Spool Rack before Rope Walk). |
| Adding and subtracting mixed numbers | Fraction Addition Concepts (`mt_VgOePicFYK`) | Taught here. |
| Addition and subtraction word problems | Adding and subtracting mixed numbers (`mt_70qDTI14td`) | Taught here. |
| Fraction Word Problems | Adding Fractions, Unlike Denominators (`mt_14T5yPXUq_`) | Taught here. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these twelve targets; spec 103's audit names four of them (`mt_a1FdAsRKOF`, `mt_VgOePicFYK`, `mt_-V7EnqU7gG`, `mt_14T5yPXUq_`) only as non-claims and records `mt_CBHwluE6Lp` as an explanation reference (one scaffolded 3/4 + 2/4 path), not practice. The build-out map assigns twelve ids to this pack; one is dropped above and `mt_CBHwluE6Lp` (in no pack) is added as its practice home.

## Checks for implementation

- **Numbers script (2026-10-25):** `check197.py` (`python3 -I`, scratch area, not in the repo), 166 checks passing: chains 1/3 = 2/6 = 4/12, 2/3 to 8/12, 3/4 to 9/12, 3/5 to 12/20, 1/4 = 2/8 = 3/12, 3/10 = 30/100; additive 1/3 → 2/4 and 2/3 → 3/4 both longer; 6/8, 4/8, 9/12, 18/24 (HCF 6, ÷2 leaves 9/12 sharing 3), 12/18; 6/8 − 2 each = 4/6 differs; 5 leaves parts over on 18 and 24; 11/4 = 2 3/4 (wrong 3 3/4, 2 7/4), 3 2/5 = 17/5 (wrong 5/5, 15/5, 32/5), 7/4, 7/3, 2 1/8 = 17/8, 6/5 + 4/5 = 2; 2/5 + 2/5 = 4/5, 4/10 = 2/5; 6/8 − 3/8 = 3/8 (wrong 9/8); four decompositions of 5/6; 2/3 + 3/3 = 5/3; 3/4 + 2/4 = 5/4 (wrong 5/8); Scene 1 5/8 and 5/16 < 3/8; 1/3 + 1/6 = 1/2 (wrong 2/9 < 1/3, 2/6); 3/4 − 1/8 = 5/8 (wrong 2/8, 2/4); 2/5 + 3/10 = 7/10; 2/3 + 1/4 = 11/12 (wrong 3/7, 3/12); 3/7 < 1/2 < 9/10; 2/3 + 5/4 = 23/12 between 1 and 2 (wrong 7/7, 17/12); 3 1/4 − 1 3/5 = 1 13/20 = 33/20 (wrong 2 7/20, 2 13/20); 2 3/5 + 1 4/5 = 3 7/5 = 4 2/5 (wrong 3 7/10); 4 2/6 − 1 5/6 = 3 8/6 − 1 5/6 = 2 1/2 = 15/6 (wrong 3 3/6); 5 3/4 − 3 1/4 = 2 1/2 (wrong 9); Léon 4 1/4 − 1 3/4 = 2 1/2 (cousin 3 2/4); dye pot 1/4 (wrong 5/4, 2/4); ribbons 4 (wrong 3 8/16, 6/8); pie 11/15 between 1/2 and 1 (wrong 3/8 < 2/5, 7/15); spool 30/12 − 17/12 = 1 1/12 (wrong 1 3/4, 3 11/12); 1/2 + 1/3 = 5/6 and 2/5 < 1/2; every ladder and guided case; Nine Chapters mutual subtraction 49, 91 → 7 in seven subtractions (first steps 42, 7, 35), 49/91 = 7/13, 12/18 halved then equal number 3, 1/3 + 2/5 = 11/15 by cross-multiplying, 1/2 + 2/3 + 3/4 + 4/5 = 2 43/60; Fibonacci 7/3 = 2 1/3 and 4/5 + 2/15 + 1/30 = 29/30; three-choice positions A6/B6/C6 over 18 items.
- Every bar keeps the whole the same size; a second meter appears at the same scale. Split and group never move the flag. Model lines show on every bench. Sprout items show no fraction numerals; feedback never says "wrong". Equal answer forms are accepted.
- Style check run on the companion (`style197.py`): 0 em-dashes and 0 en-dashes; 16 teach cards at most 30 words; 30 prompts at most 15 words; 114 hints, explanations and feedback lines at most 20 words; scene Short at most 30, Longer at most 150 and notes at most 80 words.
- Browser at 320 and 820 px: targets 44 px; tapping as well as dragging; every bar has a text equivalent ("6 of 8 equal parts are colored; the flag has not moved"); fraction numerals read aloud as "three quarters", not "three slash four".
- Léon's French line checked by a fluent reader before build.

- **Independent review, 2026-10-25.** Recomputed every item, worked example, scene number and ladder case in a separate reviewer script (`python3 -I`, scratch area; 205 checks across specs 196-198, all passing after fixes), recounted positions (18 three-choice items, 6/6/6) and items (30), and re-checked distractor feedback, Marble records, hard prerequisites, claims, spec 120 adapters (Léon is the Les Saules ferry keeper there), style (0 em-dashes; word limits) and saved-work rules. The Nine Chapters' 49/91 subtraction steps were re-confirmed by search. Changed: B5's right choice said every piece of 5/6 must be sixths, which is false (5/6 = 1/2 + 1/3); it now gives the reason 2/3 + 3/3 = 5/3. C1 choice C's tag and feedback (its feedback told the child to close another whole, which leads to 3 3/4). Claimed `mt_CBHwluE6Lp` as practice home (spec 103 is explanation only) with an upstream row, crosswalk rows and past-one and cross-back Joining Table cases; recorded that spec 198 also declines `mt_gNUE4B3vuk`. Benches checked against specs 52, 70, 100, 103 and siblings 196 and 198: no overlap.

## Review asks

**Math expert:**
1. Is "the bottom number names the size of the piece" a sound working phrase at this level, given improper fractions later?
2. Should number items accept unsimplified and improper equal forms (3/6, 3 7/5) as correct, with tidying offered as a next step?
3. Is offering three candidate common cuts (one that fails) the right support, or should the child type a common denominator?
4. Are the two subtraction routes (trade a whole; improper fractions) both appropriate at Sapling?

**Owner questions, with defaults:**
1. Route `#workshop/ropewalk` behind the Workshop, beside Bramble's dye shed? *Default: yes.*
2. Twelve targets in one pack, or split equivalence and mixed numbers from addition? *Default: one pack; the Split-and-Group Ribbon and Spool Rack can ship first as a slice.*
3. Claim *Adding Fractions (Same Denominator)* (`mt_CBHwluE6Lp`) as its practice home, beside spec 103's explanation reference? *Default (changed in review): yes; spec 103's own audit limits it to one scaffolded path with supplied equations.*
4. Where should the dropped *Mixed & Improper Fractions* (`mt_gNUE4B3vuk`) go? *Default: a later synthesis pack after spec 198 that also teaches signed-number and decimal written methods; spec 198 reviewed and declined it.*
5. First slice? *Default: the Joining Table with Set B, then the Common Cut with Set D.*
