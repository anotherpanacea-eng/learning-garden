# 211. The Hundreds House: place value to 1000

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/211-hundreds-house-text.md); sources and open checks are in the [source audit](../source-audits/211-hundreds-house.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, math and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** real-world facts checked against search excerpts on 2026-10-25 (claims rest on search excerpts; see the audit's Method); no `[check]` item is in child text. The mathematics is standard and still needs the math check.

## Purpose

Number Representation & Place Value is the game's best-served math domain below 100: [Bundle Exchange](53-bundle-exchange.md) (`#numbers/exchange`) wraps ten ones into a ten and back, and [Write the Same Sum](107-place-value-sum-ledger.md) moves a pictured new ten into a written column. The Number Garden's broad content asks three digit-value questions ("The hundreds shelf", "A different shelf", "Shelf detective" in `dist/broad-content.mjs`). Nobody yet **makes a hundred out of tens**, writes number words, counts across 100 or 1000, steps by 10 and 100 and watches which digit moves, places three-digit numbers on a scaled line, or compares them with < and >. This pack takes thirteen untouched topics there.

A child comes to understand that a hundred is ten tens, exactly as a ten is ten ones; that the zeros in 30 and 300 hold empty places; that English number words are tens first above twenty, with a few spelling traps; that a three-digit number is written by place, never by writing down what you hear (105, not 1005); that a count can start anywhere and rolls over when a place fills; that 10 more or 100 more changes one digit unless a place fills up; that a number has a spot on a scaled line; that comparing starts at the highest place; and that a fact like 3 + 4 = 7 also works for tens and hundreds when the unit is named.

**Builds on, never re-teaches:** spec 53's ten-ones wrap and unwrap (here: one tap recap, then the same move one place up, ten packets into a box); spec 107's aligned columns (here: three columns and expanded form); the Number Garden's digit-value shelf questions (here: the zero places and words that those questions skip); spec 210's number words and numerals to twenty and number bonds (proposed, math build-out; here: the decade words and the bonds scaled by place); spec 129's seed theme (Bramble's Seed Pile is a take-away game; no overlap). The [Lantern Line](89-lantern-line.md) (`#numbers/lanterns`) is a fraction line from 0 to 1; its tick and flag controls are the reuse candidate for the Seed Line, but no fraction content repeats. **Not targeted:** numbers past 1000, 1000 more or less, and rounding (sibling spec 188, the Ledger Room; its seed crate of 1000 is ten of this pack's boxes); adding or subtracting several tens or hundreds to a three-digit number and other mental strategies (sibling spec 212); numeral systems compared with place value and the 105-and-15 zero card across Roman and Egyptian trays (draft [spec 138](https://github.com/anotherpanacea-eng/learning-garden/pull/137)'s numeral bench). No target was dropped.

## Place and story

**Host:** the **seed-packet storehouse** by the orchard gate, kept by the orchard keeper (she/her) and nicknamed the **Hundreds House**, route `#numbers/storehouse`. Seeds come loose, in packets of exactly ten, and in boxes of exactly ten packets. Linked from the Number Garden, Bundle Exchange's end screen, the Orchard and the Ledger Room (spec 188). Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 1 *find and feed* | The storm burst the storehouse door; seeds lie in drifts. Packing as you count turns the floor into 3 boxes, 4 packets and 6 seeds: 346. | Sprout: pack seeds and packets. Seedling: read the count. |
| I, ch. 3 *investigate and plant* | The orchard keeper asks for one hundred five bean seeds; Bramble writes 1005 and finds the empty packet place. | Seedling: labels to 120. Sapling: 105 vs 150, expanded form. |
| II, ch. 1 *the weekly market* | Hob Pennick's 254 pea seeds against the orchard keeper's 245; the magpie steals a packet (10 less). | Seedling: compare with < and >. Sapling: order a set. |
| II, ch. 2 *a garden across the seasons* | The librarian (they/them) records seeds for the shared plots: 300 and 400. Pip says seven; Dot counts seven boxes. | Sapling: facts that grow. Keeper's Desk: undo puzzles. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, storehouse, seeds and counts are fiction, labeled apart from math, history and models. **Hollis rule:** no beat mentions the old Keeper; no beat names Hollis.

## The knowledge

**A hundred is ten tens.** One seed is one; a packet is ten seeds; a box is ten packets. A box is one hundred three ways at once: 100 seeds, 10 packets, 1 box. Packing and unpacking never change the count. The ×10 step repeats: ten ones make a ten, ten tens make a hundred (ten hundreds make a thousand, shown only as a teaser and left to spec 188).

**Multiples of 10 and 100.** 30 is 3 tens and 0 ones; 300 is 3 hundreds, 0 tens, 0 ones. Each zero records an empty place and keeps the other digit where it belongs; add one seed to 30 and the 0 is replaced (31). Two senses of "tens" are kept apart: the tens **digit** of 300 is 0, while 300 **is** 30 tens. 300 is not 30 and not 3; a scaled line shows the gap.

**Number words to 100.** The decade words come first, as a set tied to the tens digit: twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety. Spelling traps: forty has no u; ninety keeps the e. From twenty-one up, words go tens first with a hyphen (sixty-four). The teens are said ones-first but written tens-first like every two-digit numeral; fifteen (1 ten, 5 ones) and fifty (5 tens) sound alike and are far apart.

**Numerals to 100, 120 and 1000.** Write by place, boxes then packets then seeds. Writing what you hear gives 1005 for one hundred five, 10015 for one hundred fifteen, 402 for forty-two; transposing gives 24. Internal and trailing zeros are sequenced: no zero (342), internal zero (306, 105), trailing zero (340, 150). **Expanded form** splits one number by place (300 + 40 + 2; 306 = 300 + 6, with 300 + 0 + 6 also accepted); the tens digit expands to 40, never 4. American style throughout: no "and" inside whole numbers, though a child who reads "one hundred and five" is reading correctly.

**Counting within 1000.** A count can start at any number, forward or back. When a place fills it rolls over: 99, 100; 109, 110; 190, 200; 995, 1000. Skip counts by 10 or 100 change one place and leave the others alone (unless a place fills), from ragged starts (150, 250, 350; 490, 495, 500, 505). Backward counting across a boundary is practiced on its own.

**10 more, 10 less; 100 more, 100 less.** A packet more steps the tens digit, a box more steps the hundreds digit; the other digits hold still (56 → 66, 46; 456 → 556). At a full place the next place changes too: 695 + 10 = 705 (ten packets pack a box); 305 − 10 = 295 (open a box to get packets). Distinguished from 1 more and from "add a zero".

**Representing numbers.** One number appears as seeds, packets and boxes, a numeral, words, expanded form and a point on a line. Lines show both ends and are drawn to uniform scale (0-100, 0-120 marked in tens, 0-1000); placement uses benchmarks such as halfway. Early placements that spread small numbers out are treated as normal and met with benchmarks, never marked wrong. **About how many**: a pile compared with one packet of ten (a 41-seed pile is about 40).

**Comparing and ordering to 1000.** Line up the places and scan from the left: hundreds, then tens only on a tie, then ones. Trap pairs: same hundreds (254/245), digit swap (352/325), mixed length (99/100, 73/137), internal zero (305/350, 307/370). The open side of < or > faces the bigger number.

**Place value and number facts.** Partition, operate, recombine: 34 = 30 + 4 (never 3 + 4); 3 + 2 = 5 so 30 + 20 = 50; 50 + 4 = 54. A known fact scales with its unit: 3 + 4 = 7, 30 + 40 = 70, 300 + 400 = 700; dropping the unit (saying 7) is the error to catch. Working backward ("I add 10 and get 45") undoes the last step. Strategy talk, not a column algorithm. Multi-step mental adding of tens and hundreds to three-digit numbers stays with spec 212.

**Real anchors (see audit).**
- **Counting rods.** In China, numbers were set out with small rods on a counting board, each place in its own spot; a blank spot meant an empty place. The *Sunzi Suanjing* (usually dated about 400 CE) states the layout rule: units vertical, tens horizontal, hundreds vertical, thousands horizontal, alternating so neighboring digits do not run together. Child text says "more than 1,500 years ago" and gives no start date for rod use. Proposed spec 189 (below zero, math build-out) uses the rods' red and black colors for signed numbers; this pack uses only their places, and the two cards do not repeat each other.
- **The soroban.** The Japanese bead frame has rods as places, one upper bead worth 5 and four lower beads worth 1, enough to show 0 to 9 on each rod; a rod with no beads at the bar shows zero and still holds its place. It descends from the Chinese suanpan; early Japanese frames had more beads (two above, five below), reduced later. The oldest known Japanese soroban is dated 1591 in one history; the date the four-bead form became standard is unsettled. Child text gives no dates. Taught in Japanese schools today (museum and encyclopedia sources).

Egyptian numerals (the coil of rope for 100) are left out on purpose: draft spec 138's numeral bench and draft spec 134's number tray (both PR #137) already use them.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 3 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Packing Table | T1-T4 | Ten packets into a box (3 steps) | Set A |
| Label Desk | T5-T9 | "One hundred eight" (3 steps) | Set B |
| Counting Shelf | T10-T13 | 97 to 102 (3 steps) | Set C |
| Seed Line | T14-T17 | 40 on 0 to 100 (3 steps) | Set D |
| Planting Orders | T18-T20 | 30 + 40 seeds (3 steps) | Set E1-E4, E7 |
| History cards | H1, H2 | none | E5, E6, E8 |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists fourteen families); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** a packet vs a box; ten things vs ten tens; 30 vs 300 vs 3; the tens digit vs the number of tens; fifteen vs fifty; forty-two vs 24 vs 402; 105 vs 150 vs 1005; 1 more vs 10 more vs 100 more; one digit changes vs a place fills; halfway vs an end; biggest digit vs highest place; 3 + 4 vs 30 + 40; forward vs undo.

**Top misconceptions designed against** (from the Marble records): 100 is "ten with zeros"; a box of ten packets is "ten"; ten and ten is twenty; zeros mean nothing; face value for place value; teen/ty confusion; forty as "fourty", ninety as "ninty"; transposing (24 for forty-two); writing what you hear (402, 1005, 10015); dropping internal zeros (36 for 306); expanded form by face value (3 + 0 + 6); stalling or jumping at 100; snapping a ragged count to whole hundreds; "+100 means add two zeros"; changing the wrong digit; failing at roll-overs; placing on a line by one end only; comparing from the ones or by the biggest digit; "you can't tell without counting"; dropping the unit when scaling a fact; working only forward.

## The game or activity

**(a) Packing Table, model `packing-table-v1`.** A fixed collection of seed counters, packets and boxes. **Pack ten seeds** (recap of spec 53, one tap) and **Pack ten packets**, the new move: ten packet icons slide into one box while a strip reads "100 seeds · 10 packets · 1 box". **Open a box** returns ten packets; **Show the seeds** draws every seed. Orders: "packets only" (30) and "boxes only" (300) with a live numeral whose zeros glow when tapped ("None here. This zero holds the place."); adding one loose seed replaces the glowing 0. **Sprout mode**: two shelves, no numerals; tap the one with more seeds, then open both to check. *A made-up model: a packet always holds exactly ten seeds and a box exactly ten packets; real seed packets vary.* Conservation as in spec 53: `100 × boxes + 10 × packets + loose = frozen total`.

**(b) Label Desk, model `label-desk-v1`.** One order in four panes: seeds (boxes, packets, loose), numeral, words, expanded form. **Read it to me** speaks the number; the child types the numeral (production of the written numeral from speech). **Build the words** offers word-part tiles (ones, teens, decade words, "hundred", a hyphen) including look-alike tiles (fourty, ninty, fifteen beside fifty) to leave out. **Show the empty place** highlights a zero's column in every pane. Numbers to 1000, sequenced 342 → 306 → 340.

**(c) Counting Shelf, model `counting-shelf-v1`.** A three-digit board above a shelf. Pick a start (0-1000), a step (1, 5, 10, 100) and **Count on** or **Count back**; seeds, packets or boxes join or leave, and the changing digit lights up. When a place fills, the **roll-over card** appears ("Ten packets filled up, so we packed a box"). **Show the grid** opens a 1-120 grid (rows of ten) where 10 more is one row down. **What changed?** names the digit that moved. Counting stops at 1000 with a pointer to spec 188's rail.

**(d) Seed Line, model `seed-line-v1`.** Scaled lines 0-100, 0-120 (marked in tens) and 0-1000, ends always labeled. **Place the flag** by tap or drag; then the true spot appears beside the child's flag, with no "wrong". **Show halfway** adds the benchmark. **About how many?** shows a spilled pile beside one packet. **Compare two** lines up two orders by place and asks which place decides, then which sign fits. *A made-up model: piles and orders are invented; the line is to scale.*

**(e) Planting Orders, model `planting-orders-v1`.** Order cards from the shared plots. **Split it** partitions a number into tens and ones; **Show as packets / boxes** turns 3 + 4 into 3 packets + 4 packets or 3 boxes + 4 boxes; **Undo it** runs a think-of-a-number story backward. Totals stay within 1000 and use only one place-scaled fact or one split per order, leaving multi-step strategies to spec 212.

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Five sets, **34 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Packets and boxes | Sprout (A1, A2), Seedling (A3-A5), Sapling (A6) | 6 | 3-choice, number, match |
| B. Labels: numerals and words | Seedling (B1-B4), Sapling (B5, B6) | 6 | 3-choice, build the words, number, words and expanded form |
| C. Counting on, ten more, a hundred more | Sprout (C1), Seedling (C2, C3), Sapling (C4-C6), Keeper's Desk (C7) | 7 | 3-choice, number with worked steps |
| D. On the line, and which is more | Sprout (D1), Seedling (D2-D5), Sapling (D6, D7) | 7 | 3-choice, order the cards, place and build |
| E. Facts that grow, and old ways with places | Sapling (E1, E2), Keeper's Desk (E3-E8) | 8 | number, number puzzle, 3-choice, *say why*, true / not true from this source |

Sprout items use no numerals (pictures of packets, boxes and a line from empty to full). Over the 18 three-choice items the right answer sits at A, B and C six times each. A2 and D5 each include a distractor that withholds more than the evidence requires ("you can't tell without counting every seed"). The E4 puzzle has one answer, checked by brute force. *Say why* (E7) is spoken to a grown-up and never stored or graded. Typed numerals (B4, C3, C6, C7) are production items; the word build (B3) is tile construction, not free spelling, and the off-screen invitation covers handwriting.

## Saved work

Optional root `seedStorehouse` per explorer, absent until a first explicit action.

```
seedStorehouse: {
  version: 1,
  packing: [{ source, orderId, boxes: 0-10, packets: 0-10, loose: 0-9, at }],                 // latest 12
  labels:  [{ source, orderId, typed: digitString|null, draft: numericDraft|null, tiles: [tileId], at }],                        // latest 12
  counts:  [{ source, start: 0-1000, step: 1|5|10|100, dir: 'on'|'back', steps: 1-20, at }],  // latest 12
  line:    [{ source, lineId, target, placed, at }],                                           // latest 12
  orders:  { [orderId]: { source, split: [n, n], value, at } },
  answers: { [itemId]: { source, choice | value | order | match | tiles | truth, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes, numbers and bounded numeric strings only. On explicit submit, a valid numeral is stored in `typed` as a digit string for 0-1000. `draft` may preserve an unfinished or out-of-range numeric input in this numeral field only: at most 8 ASCII characters, drawn only from digits, commas and spaces. It never holds arbitrary free text, enters an answer record or counts as a wrong check; other records keep their typed codes and numbers. `placed` is an integer position on the stated line. Never recompute or rewrite saved results on load; validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching; lazy read plus explicit mutation as in spec 53.

## Curriculum fit

**Strands:** **M1-I** count and compare; **M1-II** place-value bundles and number lines (primary); **M1-III** estimation; **H1** two old calculating tools as sources. Act families: I, II.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Make a hundred from ten tens; explain the zeros in multiples of 10 and 100; read and write number words to 100 and numerals to 1000 with expanded form; count within 1000 across roll-overs by 1s, 5s, 10s, 100s; find 10 and 100 more or less and name the digit that changes; place and estimate numbers on scaled lines; compare and order to 1000 with < and >; scale a known fact by place and undo a step. |
| Teaching encounter | T1-T20 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Packing and opening boxes; glowing zeros; word tiles; roll-over card; halfway benchmark; Split it; the "I'm stuck" ladder. |
| New application | Rod numerals and the soroban read by place (E5, E6); the E4 puzzle; the 0-120 line with a build (D7); the shared-plot orders. |
| Purposeful revisit | Spec 53 (ten ones as a ten); spec 107 (columns); Number Garden shelf questions; spec 188 (crates and the rail past 1000); spec 212 (adding tens and hundreds). |
| Data boundary | Settings, counts, positions, choices, digit strings, tile ids and support codes, all local. No timing, free text, audio or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Number Words to 100 (`mt_76SPWvdI7r`) | Decade words as a set first; tie word, numeral and quantity; teach forty/ninety and the hyphen; teen/ty pairs; both directions. T5-T7; Label Desk word tiles with look-alikes; B1-B3. A tap-to-hear chart is support only; independent spelling is not claimed. |
| Reading and writing numbers to 100 (`mt_x8TshvbbQT`) | Numeral fluency, not full place-value reasoning; transposition, decade crossings and the decade zero as separate errors; production from dictation. Read it to me with typed numerals; B1, B2; teen reversals answered gently, never drilled as careless. |
| Reading and writing numbers to 120 (`mt_XV0B4kWwqL`) | Count on from any start across 100; extra practice at 99→100 and 109→110; 108 read, 115 written by place. Counting Shelf and its 1-120 grid; T8, T10; B4, C2, guided 97-102. |
| Reading and writing numbers to 1000 (`mt_VFsuftfvYM`) | Numeral, words, expanded form tied to a build; sequence no zero → internal zero → trailing zero; expanded form partitions one number. Label Desk four panes; T9; B5, B6. |
| Counting Within 1,000 (`mt_M2v1A9OEuM`) | A place-value event: see which digit rolls; ragged starts; backward counting across boundaries as its own skill. Counting Shelf; T10, T11; C5, C7. |
| Representing Numbers (`mt_9L3NQqgqRd`) | Many faces of one number; scaled lines with labeled ends; benchmarks; "about how many"; across 100 (112). Seed Line; T14, T15; D1-D3, D7. Uneven early placement met with benchmarks. |
| A Hundred Is Ten Tens (`mt_8gy7uxRlF6`) | Do the fuse and split before matching; three views of 100; ×10 repeats, thousand as a teaser only. Pack ten packets / Open a box; T2; A1-A3. |
| The multiples of 10 (`mt_zfy1gOEewd`) | Decades as whole tens with a written 0; contrast 40 with 43; tie to counting in tens. T3; zero glow; A5; B2. |
| The multiples of 100 (`mt_R2ccrI-nKD`) | Build, then explain both zeros; tens digit 0 vs 30 tens; 300 ≠ 30 ≠ 3 on a line; read as "three hundred". T4; A4, A6; 0-1000 line landmarks. |
| 10 More or 10 Less (`mt_kw7xmp68rU`) | One tens-digit move, ones held still; explain, not just answer; distinguish 1 more; decade crossings. T12; C1, C3; grid row moves. |
| 10 or 100 More or Less (`mt_izien3ZX51`) | Name the changing digit; roll-overs as the interesting core; tiered from no-boundary to 190 + 10. T13; C4, C6, C7. |
| Ordering Numbers to 1000 (`mt_AQcVRBddko`) | Left-to-right scan with aligned places; same-hundreds, digit-swap, mixed-length and internal-zero traps; set ordering and line placement. T16, T17; Compare two; D4-D6. |
| Place value understanding and number facts (`mt_kJGCjnuelW`) | Partition, operate, recombine; always name the unit; 34 = 30 + 4; work backward; insist on "which fact, which split". T18-T20; Planting Orders; E1-E4, E7. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors and per-choice feedback, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Number Words to 100 | Number Words to Twenty (`mt_9IzhGUZ30z`) | Met elsewhere: proposed spec 210 (math build-out); teen words recapped in T7. |
| Number Words to 100 | Reading and writing numbers to 100 (`mt_x8TshvbbQT`) | Taught here (Label Desk numerals before words). |
| Reading and writing numbers to 100 | Reading and writing numbers to 20 (`mt_fR0UtsSREU`) | Met elsewhere: proposed spec 210 (math build-out). |
| Reading and writing numbers to 100 | Rote counting to 100 (`mt_M5PPDJStGm`) | Supported inline (Counting Shelf by ones, 1-120 grid); referenced by spec 51 and the proposed Willow Path; no claim. |
| Reading and writing numbers to 120 | Rote counting to 100 (`mt_M5PPDJStGm`) | As above. |
| Reading and writing numbers to 120 | Reading and writing numbers to 100 (`mt_x8TshvbbQT`) | Taught here. |
| Reading and writing numbers to 1000 | Number Words to 100 (`mt_76SPWvdI7r`) | Taught here (T5-T7 before T9). |
| Reading and writing numbers to 1000 | The three digits of a three-digit number (`mt_aPBzD28_mT`) | Documented gap: in no pack's assignment and no spec's claims. Existing Number Garden authored tasks ("The hundreds shelf", "Shelf detective") are an atlas task reference only. Supported inline by the Packing Table and T9; no claim. Worded the same way in spec 212. |
| Counting Within 1,000 | Counting in 2s (`mt_nvdpxAJTBG`) | Met elsewhere: Number Garden pattern tasks and specs 50/51 references; skip counting recapped in T11; no claim. |
| Representing Numbers | The three digits of a three-digit number (`mt_aPBzD28_mT`) | As above. |
| Representing Numbers | Representing numbers with objects (`mt_pAcaehday5`) | Supported inline (seeds as counters); referenced by the proposed Willow Path; no claim. |
| A Hundred Is Ten Tens | A Ten Is Ten Ones (`mt_r0VXbfAmsH`) | Met elsewhere: spec 53, Bundle Exchange (built); recapped in T1. |
| A Hundred Is Ten Tens | The two digits of a two-digit number (`mt_THl9GLxwoL`) | Met elsewhere: spec 53. |
| The multiples of 10 | A Ten Is Ten Ones (`mt_r0VXbfAmsH`) | Met elsewhere: spec 53. |
| The multiples of 100 | A Hundred Is Ten Tens (`mt_8gy7uxRlF6`) | Taught here (T2 before T4). |
| 10 More or 10 Less | The two digits of a two-digit number (`mt_THl9GLxwoL`) | Met elsewhere: spec 53. |
| 10 or 100 More or Less | The three digits of a three-digit number (`mt_aPBzD28_mT`) | As above. |
| 10 or 100 More or Less | 10 More or 10 Less (`mt_kw7xmp68rU`) | Taught here (T12 before T13). |
| Ordering Numbers to 1000 | The three digits of a three-digit number (`mt_aPBzD28_mT`) | As above. |
| Ordering Numbers to 1000 | Comparing and ordering numbers (`mt_U0waNfD8PB`) | Referenced by spec 50; two-digit comparison recapped in the stuck ladder (31 vs 13); no claim. Documented gap if no two-digit comparison lesson ships. |
| Place value understanding and number facts | The two digits of a two-digit number (`mt_THl9GLxwoL`) | Met elsewhere: spec 53. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these thirteen targets; sibling spec 188 names two of them as met by this spec.

## Checks for implementation

- **Numbers script (2026-10-25):** `check211.py` (`python3 -I`, scratch area, not in the repo), 74 checks passing: word ↔ numeral round trip for every number 0-1000 (American style); forty and ninety spellings; 1 box = 10 packets = 100 seeds; 30, 31, 300 and 30 packets in 300 (wrong 0, 3); count by tens to 100 (wrong 10, 20); A5 4/40/400/44; 42 (wrong 24, 402); 50 vs 15; ninety-four; 115 (wrong 10015, 1015); 108; 105 vs 150 vs 1005; 306 = 300 + 6 (wrong 36, 3 + 0 + 6 = 9); 342, 305, 340, 637 expansions; counts 97-102, 109 → 110, hundreds from 150, fives 490-505 and 480-520, back from 1000; 56 → 66/46 (wrong 57, 55); 456 → 556 (wrong 466, 45600); 695 → 705 (wrong 6105, 605); 305 → 295 (wrong 315, 205) via 2 boxes, 10 packets, 5 seeds; 190 + 10, 950 + 100, 620 + 400; 40 before halfway; 112 nearer 110 and built two ways; 254 > 245 at the tens; 358 < 372; order 73, 137, 307, 370; 99 < 100; a 41-seed pile about 40; 30 + 40, 300 + 400; 34 + 20 = 54 (wrong 36, 9); 45 − 10 = 35 (wrong 55); **brute force: 705 is the only number from 0 to 1000 with 10 more equal to 100 less than 815** (wrong 725, 615, 805 fail); rods 305 (wrong 35, 3005); soroban 704 (wrong 74, 7), and one 5-bead plus four 1-beads show exactly 0-9; scene counts 346, 244; 18 three-choice items balanced 6/6/6.
- Lines are drawn to scale with both ends labeled; the true position appears beside the child's flag. Packing never changes the frozen total. Model lines show on every bench. Sprout items show no numerals; feedback never says "wrong".
- Style check run on the companion (`style211.py`): no em-dashes; teach and history cards at most 30 words; prompts at most 15 words; hints, feedback and explanations at most 20 words; Short scenes at most 30 words, Longer at most 150, Keeper's notes at most 80.
- **Independent review, 2026-10-25.** A separate reviewer recomputed every item, worked example and model number with an independent `python3 -I` script (140 checks across specs 210-212, all passing, including the full word/numeral table to 1000, the E4 uniqueness by brute force and the 0-9 soroban rod), recounted the 18 three-choice answers (6/6/6) and reran a style check (0 em-dashes in all three files; word limits met). Each of the 13 targets was read against its pinned description and research record; all fit. Changed: T11 no longer says counting by 5s "moves one place at a time" (490, 495, 500 changes three digits), and the matching line in The knowledge says "unless a place fills"; A2 and A6 right answers now carry a reason like their distractors, so the bare short answer no longer gives them away; the `mt_aPBzD28_mT` crosswalk rows now read as a documented gap with an atlas task reference, matching spec 212. Hollis rule, pronouns (orchard keeper she/her, librarian they/them, Hob he/him), Act I and II chapter names, the route and the *Sunzi Suanjing* rule (search excerpts) rechecked.
- Browser at 320 and 820 px: targets 44 px; tap-to-place as well as drag on the line; three-digit board and four panes stack on narrow screens; every picture has a text equivalent ("3 boxes, no packets, 5 seeds"); spoken numbers available on every label.

## Review asks

**Math expert:**
1. Is "a packet always holds exactly ten" clear enough as a model rule beside spec 53's wrapped ten?
2. Are 300 + 0 + 6 and 300 + 6 both acceptable expanded forms at this level?
3. Is the D3 estimate (a 41-seed pile, answer "about 40") a fair benchmark item?
4. Does the Planting Orders bench stay inside "place value and number facts" without taking spec 212's mental strategies?

**Owner questions, with defaults:**
1. Route `#numbers/storehouse` beside the Number Garden and Bundle Exchange? *Default: yes.*
2. Thirteen targets in one pack, or split words and numerals (Label Desk) from the rest? *Default: one pack; the Label Desk can ship as its own slice.*
3. Number words in American style without "and"? *Default: yes, accepting "and" when read aloud.*
4. First slice? *Default: the Packing Table with Set A, then the Counting Shelf with Set C.*
