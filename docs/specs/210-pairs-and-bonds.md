# 210. Pairs and Bonds: matching, partners of ten and "the same as" at the duck pond

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/210-pairs-and-bonds-text.md); sources and open checks are in the [source audit](../source-audits/210-pairs-and-bonds.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** the two history anchors were checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The arithmetic is standard and still needs the math check.

## Purpose

Early number is the most built part of Learning Garden. The Number Garden's Picnic Clearing already asks 8 + 5 and 17 − 8 by making ten (`broad-content.mjs`, specs 15-21 and 27); the gathering activity ([spec 50](50-whole-batch-gathering.md)) points and counts small groups; Joining and Returning Supply Orders ([77](77-joining-supply-orders.md), [78](78-returning-supply-orders.md)) combine and take away; the Bundle Exchange ([spec 53](53-bundle-exchange.md)) makes teens as a ten and some ones; the Balance Stall ([spec 64](64-balance-stall.md)) shows = as the same mass; Willow Path ([spec 76](76-willow-path.md)) counts on along ten stones; My Count Collection ([spec 86](86-count-collection.md)) counts and charts; Seed Pile, Shutters and Ribbon Rows ([129](129-seed-pile-first-playable.md), [131](131-ribbon-rows.md), [proposal 121](https://github.com/anotherpanacea-eng/learning-garden/pull/128)) use sums and take-away in games. Still nobody teaches **comparing by matching**, **all the ways to split a number**, **partners of ten as a family of facts**, **= read as "is the same as" through pairing**, **swap for adding but never for taking away**, **the missing part found by counting up** or **stories with the unknown in different places**. This pack takes 24 unclaimed early-number topics there, in new contexts with new contrasts.

A child comes to understand that matching settles more, fewer or the same before counting does, and spreading a line out adds no ducks; each thing is counted once and the last number says how many; teens are ten and some more, said ones-first but written ten-first; a number splits into many pairs while the whole stays put; every number from 1 to 9 has one partner of ten, and three numbers make a family of four facts; = means "is the same as", so 8 = 5 + 3 is true and 4 + 1 = 3 + 3 is not; adding can swap and regroup, taking away cannot; a missing part is found by counting up and checked by the inverse; a story is solved by laying it out, never by key words; and quick sums come from facts already known, never from a clock.

**Builds on, never re-teaches (revisits stated plainly):**
- *Teens as ten and some ones* is spec 53's. Here it is one recap card (T4) used to count and write 11-20; no bundle or exchange model.
- *Pointing to count a small group* is spec 50's. Here: up to 20, in four arrangements, with send-exactly-N ("give N") and tidying into ten-frames.
- *= as the same mass* is spec 64's (Balance Stall). Here = is read through **pairing** (one rope per pair, nothing left over), a different representation; the Balance Stall topic *What the equals sign means* (`mt_oIzycTBeE4`) is not claimed.
- *Making ten for 8 + 5 and 17 − 8* is asked in the Number Garden's authored tasks (an atlas task reference for `mt_m1W6nTQJ2b`, not a full-topic claim; spec 131 explicitly leaves that topic unclaimed, and no pack in the build-out owns it). Here making ten is the payoff of partners of ten, never a claimed target.
- *Combining and taking away* are specs 77 and 78. Here they are prerequisites, recapped by the + and − cards.
- *Counting on along a track* is spec 76. The Stepping Stones are a 0-20 number line with jumps back, threes and inverse hops, no board game.
- *Sums in games* (Shutters, Ribbon Rows) stay with the Games Table; Ten Pairs is a cooperative memory game with fixed pairs.

**Siblings in the math build-out:** spec 204 owns young problem-solving practices (modelling, explaining, showing working), so Pond Stories teaches story structures and leaves the general habits there; spec 211 owns place value to 1,000 and *10 More or 10 Less*, so the Lily Square only counts in tens from a non-multiple within 100 and never crosses 100; spec 212 owns mental strategies within 100 and 1,000, so the Long Path stops at a two-digit number plus ones (26 + 7, 34 − 6) and one scaled bond (60 + 40); spec 191 owns properties of operations in general and spec 192 inverse operations at older depths.

**Not targeted:** nothing assigned is dropped. Two pinned descriptions differ from their names, and the pack follows the descriptions: *Counting forwards and backwards* (`mt_aHAM29nidj`) is counting in **threes** from 0, forwards and back; *Counting forwards and backwards (age 6+)* (`mt_OkSJfrmFb_`) is counting in **tens from any number**. *Number bonds to 9* (`mt_e8CZ7E5qW7`) is, by its description, partners of **ten** for 1-9; pairs of 9 are taught too, under *Numbers up to 10 into pairs*. *Fluent addition and subtraction* (`mt_3e_PQxwC12`) is met for recall to 20 and for decade facts derived from known bonds (60 + 40 = 100 in F4; 26 + 4 = 30 on the Long Path); spec 212's mental strategies give wider practice to 100 without claiming this topic. *Mental addition and subtraction (age 6+)* is met for a two-digit number and ones only.

## Place and story

**Host:** the **Duck Pond** by the footbridge, route `#garden/pond`, where the storm scattered the ducks and tumbled the old stepping stones. Linked from the main garden, the Number Garden, Willow Path's end (`#numbers/path`) and the footbridge repair job (spec 33). Open from the start; no bench requires another. Route check: no route on main or in any draft begins `#garden/pond`; sibling 204's `#garden/puzzles` is a separate leaf under the same garden hub, and Number Garden activities keep their `#numbers/...` and `#wonder/...` routes.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 1 *find and feed* | The baker brings crusts for the ducks. Dot writes 8 = 5 + 3; Pip says it's backwards. | Seedling: build and read sentences. |
| I, ch. 3 *investigate and plant* | The ducks come back after the storm. Bramble's long line against Pip's huddle; Dot ropes them in pairs. | Sprout: compare by matching. Seedling: count to 20. |
| I, ch. 4 *mend the village* | The carved stepping stones went in pairs that made ten; the storm tumbled them. Pip finds a 7. | Sprout and Seedling: partners of ten. Sapling: three pads, the Long Path. |
| Any later visit | The pond stays open; Ten Pairs can be played any time. | Any depth. |

Spec 120's Act I chapter 4 already lists footbridge jobs from spec 33 (planks, rope, notice); the stepping-stone job sits beside them and replaces none. One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, pond, ducks, carved stones and their pairs-of-ten custom are fiction, labeled apart from math, history and models. The old Keeper is not mentioned (Hollis rule), and no heron appears at the pond, since spec 120 describes the old Keeper as a heron.

## The knowledge

**Comparing by matching.** Pair one with one (a rope from each duck to one crust). Leftovers on one side: that side has **more**, the other **fewer**. Nothing left over: **the same**. Matching works before counting is secure; counting both and comparing counts agrees with it. Spreading a line out or bunching it up never changes how many (conservation). Bigger animals are not "more". To make two groups the same, add to the smaller or take from the larger. "Fewer" is used for countable things. Sprout groups stay within 10 objects; Seedling to 20.

**Counting to 20.** Each object is counted once and only once; a tapped duck moves to a nest and cannot be tapped again (the tracking habit). The last number said tells how many (cardinality). Four arrangements: line, ring, rows, scattered; a rearranged set has the same count. **Give N** (send exactly 13 to the island) is the stronger check, and continuing from 9 to 12 counts on rather than restarting. Teens: fill ten nests first, then the extras, so 14 is "ten and four" (spec 53 recap).

**Counting back, in threes, and in tens from any number.** Count back 20 to 0 on the stones. A duck hops every third stone: 0, 3, 6 ... 30 and back from 30, with care across a ten (18, 21). On the **Lily Square** (100 pads, ten in a row), a straight jump down is ten more: 7, 17, 27, 37 and back. The ones digit stays; the tens go up or down one. "Add a zero" is never offered (it makes 70). Starts are non-multiples of ten; the Lily Square ends at 100, and crossing 100 is spec 211's.

**Numerals and number words to 20.** Numeral, word and ten-frame are three faces of one number (the number card). Thirteen is said three-first and written ten-first (13, never 31). *Eleven* and *twelve* are special words; *thirteen* to *nineteen* are a ones-word plus *teen* ("and ten"), with *thir* and *fif* as changed forms; *twenty* closes the range. Words are built from tiles and read aloud on request. Number words are read for meaning, matched to quantities; irregular spellings (one, two, four, eight) are shown, never marked. Numeral writing is a motor skill: the screen uses tiles and an off-screen invitation; no handwriting is checked or claimed (the same motor exception as spec 53).

**Pairs and partners of ten.** A fixed whole on the Duck Raft splits between two lily pads; moving one duck across takes one from a pad and gives one to the other, and the whole never drifts. Working in order (5 and 0, 4 and 1 ... 0 and 5) finds every way and shows when the list is complete (six ordered ways for 5; three pairs if a swap counts as the same pair). Wholes 5 to 10, including 9 (4 and 5, 3 and 6 ...). **Ten nests**: count the ducks, then the empty nests; together they make ten (7 + 3 = 10 and 10 − 7 = 3). Every number 1-9 has exactly one partner of ten. **Fact families** within 20: three numbers, four facts (8 + 5 = 13, 5 + 8 = 13, 13 − 5 = 8, 13 − 8 = 5); a part minus a part is not in the family. Bonds within 20 are built from ten nests and doubles, never as a fresh list.

**Plus, minus and equals.** + records joining, − taking away, = "is the same as". Sentences are read aloud in full ("8 is the same as 5 plus 3"). = appears in many positions from the first card: 8 = 5 + 3, 5 + 3 = 4 + 4, 7 = 7. A sentence is true when both sides are the same amount, shown by roping both sides: 4 + 1 = 3 + 3 leaves one rope end loose. 5 + 0 = 5 (adding nothing keeps the number). True and false examples always have genuinely equal or unequal sides.

**Representing and stories.** One calculation is shown four ways and linked: ducks moving, a duck strip (whole on top, parts below, a bar model), a hop on the stones, and a number sentence. Stories cover **join** (7 swim, 5 land), **separate** (12, some fly off, 8 left), **part-whole** (15, 9 brown, the rest white) and **compare** (13 stones, 8 ducks: how many more stones?), with the unknown as the result, the change or the start. The child lays out the strip and finds the missing piece; key-word rules ("more means add") are never taught, and E4 is built to defeat them.

**Any order, any grouping.** Swapping the lily pads keeps the total: 3 + 5 = 5 + 3. Taking away cannot swap: 5 − 3 is 2, and from 3 ducks you **run out** taking 5 (negative numbers are not introduced). Three numbers can be grouped either way: (2 + 8) + 5 = 2 + (8 + 5) = 15; look for two that make ten and add them first (4 + 7 + 6 = 10 + 7). Making a ten from numbers that are not next to each other uses swapping and grouping together. A slower grouping still reaches the right total and is never called wrong.

**Missing numbers and the inverse.** 10 − 8 = ? is the same question as 8 + ? = 10. Count **up** for close numbers (8 to 10 is 2, 10 to 13 is 3, so 5), counting jumps, not stones, to avoid the off-by-one slip. Check by the inverse: 13 − 5 = 8. A hop forward 7 then back 7 lands where it began. The same three numbers stay in view while the operation flips.

**Fluency through play.** Fluent means accurate, efficient and flexible, never fast. Practice is short, chosen and untimed: **Ten Pairs** (a cooperative memory game with targets 5, 9 or 10) and **Peek cards** (dot cards the child hides when ready, then says the partner or total). Facts within 5 (including +0 and −0), within 10 and within 20 are reached from images and known facts: doubles and near doubles (7 + 7 = 14, so 7 + 8 = 15), partners of ten and making ten. Finger counting is welcome. No speed is measured, recorded or shown.

**Bigger jumps.** A two-digit number and ones: jump to the next ten first (26 + 4 = 30, then 3 more: 33; 34 − 4 = 30, then 2 more: 28). Mixed with non-bridging cases (43 + 5) so bridging is chosen, not automatic. One scaled bond: 6 + 4 = 10, so 6 tens + 4 tens = 10 tens = 100 (Lily Square rows).

**Real anchors (see audit).**
- **Bede's finger numbers.** The English monk Bede finished *The Reckoning of Time* (*De temporum ratione*) in 725. Its first chapter, *On computing and speaking with the fingers*, describes finger shapes for numbers; most accounts say two hands could show up to 9,999 (one auction-catalogue source adds that numbers above 100 were rarely shown; unconfirmed and kept out of child text). Finger reckoning was older than Bede (Roman counters match his shapes). Child text says only that he wrote a way to show numbers with finger shapes, about 1,300 years ago, at the start of a book about time and calendars.
- **The soroban's partners of ten.** The Japanese soroban has one bead worth 5 and four beads worth 1 on each rod (the four-bead form became standard in the twentieth century); it descends from the Chinese suanpan. Users add and subtract with complements of ten: to add 9 to a full rod, add 10 on the next rod and take 1 away. Child text gives no dates for the bead changes, since sources differ.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 3 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Duck Count | T3, T4, T5 | How many ducks on the bank? (3 steps) | Set B |
| The Pairing Rope | T1, T2, T11 | Is 8 = 5 + 3 true? (3 steps) | Sets A, D |
| The Duck Raft | T8, T9, T10, T12 | Every way to split 5 (3 steps) | Set C |
| The Stepping Stones | T6, T7, T13, T16 | Forward 7, back 7 (3 steps) | Sets B, D, F |
| Pond Stories | T14, T15 | Three pads: 4, 7, 6 (3 steps) | Set E |
| Ten Pairs | T9, T17 | You turned a 7 (3 steps) | Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists twelve); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** longer vs more; leftover vs none left; counted vs looked at; said order vs written order (thirteen, 13); one split vs every split; ducks vs empty nests; the whole vs a part; answer-next vs "is the same as"; true vs not true; swap for adding vs no swap for taking away; reordering vs regrouping; count back vs count up; how many left vs how many more; key word vs story shape; recall vs speed.

**Top misconceptions designed against:** a longer line has more; bigger things are more; two groups that look different can't be the same; skipping or double-counting scattered objects; recounting instead of counting on; thirteen written 31; teen words as unanalyzable; "add a zero" for ten more; changing the ones digit when adding ten; a number has only one split; the whole drifts when re-splitting; 7 + 3 known but 10 − 7 not; = means "the answer comes next"; anything with = is true; +0 changes the number; take-away can swap; grouping changes the total; the unknown is always the result; adding every pair of numbers in a story; "more" means add; counting the start stone when counting up; bridging forgotten at the decade (26 + 7 = 23); fluency means speed.

## The game or activity

**(a) Duck Count, model `duck-count-v1`.** Up to 20 ducks on the bank in one of four arrangements. *A made-up model: a tapped duck moves to a nest and cannot be tapped again; arrangements are authored.* **Count** mode: tap each duck; a badge shows "[n] ducks counted"; **Tidy into nests** packs them into ten-frames (two houses of ten) without changing the count. **Send** mode (give N): "Send 13 ducks to the island"; ducks move one per tap and can be called back. **Number card**: numeral, word and ten-frame for the same number; **Build a number** (digit tiles) and **Build a word** (word tiles: one to twelve, *thir*, *fif*, *eigh*, *teen*, *ty*, *twenty*), with read-aloud. The special pieces make *thirteen*, *fifteen* and *eighteen* without changing a tile's spelling. Authored sets: 7 in a line, 9 in a ring, 12 in rows, 14 scattered, 17 scattered, 20 in rows.

**(b) The Pairing Rope, model `pairing-rope-v1`.** Two groups (ducks and crusts, or ducks on two banks) with a rope tool that joins one on each side; a readout says "[n] left over on this side" or "Nothing left over: the same". **Spread out**, **Bunch up**, **Add one**, **Take one**. *A made-up model: each rope joins exactly one thing on each side.* **Sentence** mode builds a number sentence from tiles (0-20, +, −, =) under a pictured action and reads it aloud. **True or not true** mode ropes the two sides of a given sentence. Authored comparisons stay within 10 at Sprout and 20 at Seedling; sentences include = first, = between two sums and +0.

**(c) The Duck Raft, model `duck-raft-v1`.** A raft holding a fixed whole (5-10, then 11-20) on two lily pads. *A made-up model: ducks move between pads but never leave.* **Keep this way** adds the split to a list; **Show my list** sorts it in order and says when every way is found. **Swap the pads** keeps the total; a take-away card beside it shows 5 − 3 and "3 − 5: you run out of ducks". **Ten nests** shows a ten-frame duck house with empty nests. **Fact family card** (whole above, two parts below, four facts). **Hide some** puts ducks under a leaf for missing-part questions within 5, 10 and 20.

**(d) The Stepping Stones, model `stepping-stones-v1`.** Stones 0-20 across the pond, one step apart; **Hop forward**, **Hop back**, **Hop in threes** (stones extend to 30 with every third marked), **Count up** (counts jumps between two stones). *A made-up model: equal stones; a jump forward adds, a jump back takes away.* **Lily Square**: 100 pads, ten in a row (1-100); jumps straight down or up are ten more or ten less. **Long Path**: stones 20-50 with every ten marked, for jumping to the next ten.

**(e) Pond Stories, model `pond-stories-v1`.** Story cards acted out with ducks, then laid on a **duck strip** (whole bar above, part bars below, a ? piece), then written as a sentence with the unknown where it belongs. *Made-up ducks and stories.* **Three pads** mode: three groups that the child pushes together two at a time, with the running total.

**(f) Ten Pairs, model `ten-pairs-v1`.** A cooperative memory game with Pip. *A made-up model: twelve cards; a pair is kept when it makes the pond's number.* Decks (frozen in `source`, shuffled once at Start and stored): target 5: 0, 5, 1, 4, 2, 3, 0, 5, 1, 4, 2, 3; target 9: 0, 9, 1, 8, 2, 7, 3, 6, 4, 5, 9, 0; target 10: 0, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5, 5. Every card has a partner. The child turns two cards; a pair is kept, others stay face up until **Turn them back**. **Pip's turn** advances one stored move (Pip picks uniformly among face-down cards, the pick stored so resume never rerolls). The game ends when the pond is clear; nobody's pile is counted or compared. **Peek cards**: a dot picture of two parts (whole up to 20) stays until the child taps **Hide**; then the child says the total or the hidden part, and **Show** reveals the readout. Nothing measures how long a card was shown.

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. More, fewer, the same | Sprout (A1-A4), Seedling (A5, A6) | 6 | 3-choice, number |
| B. Counting and writing numbers to 20 | Seedling (B1-B4), Sapling (B5, B6) | 6 | number, 3-choice, build a word |
| C. Pairs and bonds | Seedling (C1-C4), Sapling (C5, C6) | 6 | 3-choice, number, list |
| D. Plus, minus and "the same as" | Seedling (D1-D3, D6), Sapling (D4, D5) | 6 | 3-choice, true or not true, build a sentence, number |
| E. Pond stories | Seedling (E1-E3), Sapling (E4-E6) | 6 | number, 3-choice |
| F. Quick sums and bigger jumps | Sapling (F1-F3), Keeper's Desk (F4-F6) | 6 | number, 3-choice, true / not true from this source, *say why* |

Sprout items use pictures and words and need no numbers. Over the 21 three-choice items the right answer sits at A, B and C seven times each. Several sets include a distractor that ignores part of the evidence (A1 ignores the leftovers; E2 gives the number left; E4 gives the bigger count). *Say why* (F6) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `duckPond` per explorer, absent until a first explicit action.

```
duckPond: {
  version: 1,
  count:   [{ source, set: setId, mode: 'count'|'send', target: 0-20, tapped: [duckIdx], at }],   // latest 12
  rope:    [{ source, caseId, ropes: [[l, r]], at }],                                           // latest 12
  raft:    { [whole]: { source, splits: [[a, b]], at } },                                       // whole 5-20
  stones:  [{ source, mode: 'line'|'threes'|'square'|'long', from, hops: [int], at }],          // latest 12
  stories: { [storyId]: { source, strip: { whole, parts: [int|null] }, sentence: [token], at } },
  pairs:   { current: { source, order: [card], moves: [{ who: 'child'|'pip', cards: [i, j] }] } | null,
             earlier: [ ... ] },                                                                // latest 16
  answers: { [itemId]: { source, choice | value | order | sort | tiles, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order (for Ten Pairs, the deck, its shuffled order and the target). Codes and numbers only; tile answers store tile ids, never typed text. Validate ids and ranges (counts 0-20, raft wholes 5-20, stones 0-100, card values 0-10, splits summing to their whole); never recompute or rewrite saved results on load. An unreadable entry stays raw and exportable while the rest stays open. Ten Pairs replays only legal stored moves under its own source; an illegal or unknown move makes that game read-only. Support stays separate from answers; no mastery flag, no timing field. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M1-I** count and compare pictured sets, parts and whole (the core); **M1-II** number-line addition and a first bridge through ten; **M7-I/II** explain a choice and check by the inverse (F6, inverse hops); **H1** a medieval book and a living calculating tool as sources. Act family: I, with open revisits.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Compare groups by matching; count to 20 with tracking and give N; count back, in threes and in tens from any number; read and build numerals and words to 20; split numbers into all pairs and partners of ten; use fact families to 20; read +, − and = with = as "is the same as"; represent and solve join, separate, part-whole and compare stories; add in any order and group to make ten; find a missing number and check by the inverse; recall facts to 20 from known facts; bridge a two-digit number and ones. |
| Teaching encounter | T1-T17 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Rope readouts; tap lockout and Tidy into nests; ordered split list; ten nests; duck strip; Count up; the "I'm stuck" ladder. |
| New application | Give N; the Lily Square from 7; 9 as a whole; true or not true sentences; start-unknown and compare stories; three pads; the Long Path; the soroban's 9 = 10 − 1. |
| Purposeful revisit | Spec 53 (teens), spec 64 (= as same mass), spec 76 (counting on), Number Garden Picnic Clearing (make ten), Games Table (Shutters, Ribbon Rows), spec 33 footbridge job. |
| Data boundary | Taps, splits, hops, tiles, choices, values and support codes, all local. No timing, free text, audio or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Comparing groups: more or fewer (`mt__h7hvT4tEb`) | Matching first, then counting; confront spread-out vs bunched; precise words; make equal. Pairing Rope, Spread out, Add one; A1-A6; Scene 1. |
| Counting forwards and backwards (`mt_aHAM29nidj`) | Threes from 0 and back from 30; care across a ten; tie to groups of three; no speed drill. Hop in threes; T6; B5. |
| Counting forwards and backwards, age 6+ (`mt_OkSJfrmFb_`) | Tens from non-multiples, forward and back; ones digit fixed; never "add a zero". Lily Square; T7; B6. |
| Counting objects to 20 (`mt_yqAL6O5i_v`) | Tracking strategy; give N; ten-frames for teens; vary arrangement; enacted count. Duck Count lockout, Send mode, four arrangements; A3, B1, B4. |
| Number Words to Twenty (`mt_9IzhGUZ30z`) | Word, numeral, quantity three-way; irregular words as sight words; teen structure; both directions; invented spellings not marked. Number card, Build a word; T5; B3. |
| Reading and writing numbers to 20 (`mt_fR0UtsSREU`) | Numeral tied to quantity; teen transposition; zero as "none"; formation as a motor skill. Number card, Build a number, ten nests; B1, B2; off-screen writing (no handwriting claim). |
| Numbers up to 10 into pairs (`mt_7XcCG43ZZW`) | Fixed whole, trade objects; systematic list; record as equations; swap as the same pair. Duck Raft list; T8; C1, C3, C4. |
| Number bonds to 9 (`mt_e8CZ7E5qW7`) | Partners of ten on a ten-frame; both directions; full set; not "how many altogether". Ten nests; T9; C2; Scene 2; Ten Pairs (10). |
| Number bonds (`mt_s2mfRBoTal`) | Fact families; unknown in different positions; built from ten and doubles. Fact family card; T10; C5, C6. |
| Fluent adding and subtracting within 5 (`mt_ghF3Vv6taM`) | From subitizing and part-whole; short, low-stakes, untimed; +0/−0; fingers welcome. Peek cards, Hide some, Ten Pairs (5); D2. |
| Fluent adding and subtracting within 10 (`mt__we2TDqnJx`) | Derived facts from bonds and doubles; fact families; interleave; no timed tests. Ten Pairs (9, 10), Peek cards; C2, C3. |
| Fluent adding and subtracting within 20 (`mt__t4afSyZRm`) | Automaticity as the end of strategy; reconstructable fallback; target shaky facts; no pressure. T17; F1; Peek cards to 20. |
| Reading +, −, and = (`mt_8RmpkDxT9L`) | Symbols tied to actions; = in varied positions; read aloud; true/false with genuinely equal or unequal sides. T11; Sentence and True or not true modes; D1-D3; Scene 3. |
| Representing Addition and Subtraction (`mt_PgsHGYJMH-`) | One calculation through several representations, linked; dots over pictures. Ducks, strip, stones and sentence for the same story; Pond Stories. |
| Early Word Problems (`mt_VAWV_l7J0D`) | Model the situation, unknown in all positions, to 20; no key words. Duck strip; E2, E5. |
| Addition and subtraction word problems (`mt_yJmvUCCym7`) | Within 10 with objects; vary structure; compare problems by difference. Act it out; E1, E3, E4. |
| Adding and subtracting (`mt_mr_Vk7FGzK`) | Within 20 via bonds and making ten; +0/−0 explicitly; teen boundary. D2 (5 + 0), E1, C6. |
| Addition in any order (`mt_QCgbiVrwnp`) | Structural swap; subtraction contrast with "you run out"; order in stories. Swap the pads; T12; D4. |
| Adding Three Small Numbers (`mt_Zx1xZM-RbX`) | Scan for a ten or a double; pair not written first; slower pairing not wrong. Three pads; T14; guided item; E6. |
| Grouping numbers to add (`mt_T76hKqXf0z`) | Regroup for convenience; distinguish from swapping; no subtraction regrouping. E6; T14. |
| Finding a missing number in addition (`mt_ezc2m_0dzN`) | Part-whole; count up for close numbers; pair 13 − 9 with 9 + ? = 13; off-by-one watch. Count up, Hide some; T13; D5, F6. |
| Inverse: addition undoes subtraction (`mt_ehGS_uVSJv`) | Same three numbers; check by the inverse; order matters. Forward/back hops; D6; T13 check. |
| Fluent addition and subtraction (`mt_3e_PQxwC12`) | Strategy then untimed retrieval; fact families; scale a bond to tens with ones vs tens kept apart. F1, F4. |
| Mental addition and subtraction, age 6+ (`mt_AKAtWEwpcj`) | Bridge via the decade on a number line; mix bridging and non-bridging. Long Path; T16; F2, F3. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Comparing groups | none listed | n/a |
| Counting forwards and backwards | Counting in 2s (`mt_nvdpxAJTBG`) | Met elsewhere: Number Garden patterns (main); twos recapped in the ladder. |
| Counting forwards and backwards, age 6+ | Counting in 2s (`mt_nvdpxAJTBG`) | Met elsewhere: Number Garden patterns (main). |
| Counting forwards and backwards, age 6+ | The two digits of a two-digit number (`mt_THl9GLxwoL`) | Met elsewhere: spec 53 Bundle Exchange (main) and Number Garden. |
| Counting objects to 20 | How Many in Total? (`mt_dmNvjroCPT`) | Supported inline (T3); spec 50 supports it; no claim. |
| Counting objects to 20 | One-to-one counting (`mt_WcfaSfVT33`) | Supported inline (tap lockout, T3); spec 50 supports it; no claim. |
| Number Words to Twenty | Reading and writing numbers to 20 (`mt_fR0UtsSREU`) | Taught here (Duck Count number card before Build a word). |
| Number Words to Twenty | Blending Sounds to Read Words (`mt__KHQttMde3`) | Documented gap: systematic phonics is an open strand gap (strand map; spec 55 brief). Read-aloud supports; no decoding claim. |
| Reading and writing numbers to 20 | How Many in Total? (`mt_dmNvjroCPT`) | Supported inline; no claim. |
| Reading and writing numbers to 20 | Writing digits 0-9 (`mt_oAK9GXSfqV`) | Documented gap for handwriting (motor exception, as in spec 53); tiles and off-screen writing support; no claim. |
| Numbers up to 10 into pairs | Addition as combining (`mt_OvyoRo47K-`) | Met elsewhere: spec 77 Joining Supply Orders; recapped in T11. |
| Number bonds to 9 | Numbers up to 10 into pairs (`mt_7XcCG43ZZW`) | Taught here (T8 before T9). |
| Number bonds | Number bonds to 9 (`mt_e8CZ7E5qW7`) | Taught here. |
| Number bonds | Fluent within 5 (`mt_ghF3Vv6taM`) | Taught here (Peek cards, Ten Pairs at 5). |
| Fluent within 5 | Addition as combining; Subtraction as taking away (`mt_OvyoRo47K-`, `mt_zuKAX6lcYR`) | Met elsewhere: specs 77 and 78; recapped in T11. |
| Fluent within 10 | Number bonds to 9; Fluent within 5 | Taught here. |
| Fluent within 20 | Addition and subtraction within 20 (`mt_m1W6nTQJ2b`) | Documented gap: in no pack's assignment and no spec's claims (spec 131 explicitly excludes it). Existing Number Garden authored tasks are an atlas task reference only. Supported inline: making ten taught through ten nests and E1, C6, T16, T17; no claim. |
| Fluent within 20 | Fluent within 10 (`mt__we2TDqnJx`) | Taught here. |
| Reading +, −, = | Reading and writing numbers to 20 | Taught here. |
| Reading +, −, = | Addition as combining; Subtraction as taking away | Met elsewhere: specs 77 and 78. |
| Representing Addition and Subtraction | Addition as combining; Subtraction as taking away | Met elsewhere: specs 77 and 78. |
| Early Word Problems | Adding and subtracting (`mt_mr_Vk7FGzK`) | Taught here (Set C, D before Set E). |
| Addition and subtraction word problems | Representing Addition and Subtraction (`mt_PgsHGYJMH-`) | Taught here (duck strip on Pond Stories). |
| Adding and subtracting | Number bonds (`mt_s2mfRBoTal`) | Taught here (T10). |
| Addition in any order | Addition as combining | Met elsewhere: spec 77. |
| Adding Three Small Numbers | Grouping numbers to add (`mt_T76hKqXf0z`) | Taught here (T14, E6). |
| Grouping numbers to add | Addition as combining; Addition in any order (`mt_QCgbiVrwnp`) | Spec 77; any order taught here (T12 before T14). |
| Finding a missing number | Addition as combining; Subtraction as taking away | Met elsewhere: specs 77 and 78. |
| Inverse | Finding a missing number (`mt_ezc2m_0dzN`) | Taught here (T13). |
| Fluent addition and subtraction | Addition and subtraction within 20 (`mt_m1W6nTQJ2b`) | Documented gap, as above; supported inline; no claim. |
| Mental addition and subtraction, age 6+ | Adding and subtracting (`mt_mr_Vk7FGzK`) | Taught here. |
| Mental addition and subtraction, age 6+ | The two digits of a two-digit number (`mt_THl9GLxwoL`) | Met elsewhere: spec 53 and Number Garden. |

Claim check, 2026-10-25 (main at `b68d8de`, drafts #126, #128, #137-#151): no spec on main or any draft PR claims these 24 targets. Source audits 53, 57, 64, 67, 68, 76 and 91 mention some of them as ancestors or context only, without claiming them.

## Checks for implementation

- **Numbers script (2026-10-25):** `check210.py` (`python3 -I`, scratch area, not in the repo), 100 checks passing: every teach example (14, 16, 0-12 in threes, 7/17/27, 8-5-13 family, 8 + ? = 13 by 2 + 3, 4 + 6 + 7 = 17, 26 + 4 + 3 = 33, 7 + 8 = 15, 60 + 40 = 100); each number 1-9 has exactly one partner of ten; the three Ten Pairs decks have 12 cards and pair completely; C4 has exactly six ordered splits of 5 (brute force) and three unordered pairs; D2 truth values (8 = 8 true, 5 ≠ 6, 7 = 7, 6 ≠ 5, 5 + 0 = 5); missing numbers unique by brute force over 0-100 (D5 5, E2 4, E3 6, E5 8); every distractor differs from its answer (A5 15, 9; B1 4, 41; B6 70, 38; C3 6, 13; C6 20, 7; E4 21, 13; F2 23, 213; F3 32, 30; F4 10, 6,040); the E3 off-by-one count back lands on 7; Lily Square jumps keep one column; 9 = 10 − 1 and 7 = 5 + 2 on the soroban; 725 is about 1,300 years ago; 21 three-choice items with right answers A/B/C 7/7/7; 36 items A1-F6.
- Matching readouts never state a count in Sprout mode; a spread-out line keeps its count. Sentences used as "true" have equal sides and "not true" unequal sides. Take-away swaps say "you run out" and never show a negative number. Feedback never says "wrong".
- Style check (`style210.py`) on the companion: no em-dashes; teach cards at most 30 words (max 26); prompts at most 15 words; feedback, hints and explanations at most 20 words; scenes within 30 / 150 / 80 words.
- Browser at 320 and 820 px: targets 44 px; rope, move and hop by tap as well as drag; every picture has a text equivalent ("Four left over on the crust side"); read-aloud for number words.
- No timing anywhere: Peek cards and Ten Pairs record no durations.
- **Independent review, 2026-10-25.** A separate reviewer recomputed every item, worked example, deck and model number with an independent `python3 -I` script (140 checks across specs 210-212, all passing; 21 three-choice answers recounted at 7/7/7) and reran a style check (0 em-dashes in all three files; all teach, prompt and feedback limits met). Checked each of the 24 targets against its pinned description and research record: the four name-misleading ids (threes, tens from any number, partners of ten, fluent facts with derived decade facts) are taught as described, and `mt_8RmpkDxT9L` stays claimed (symbols read, written and matched to actions; the deeper equals topic `mt_oIzycTBeE4` remains spec 64's). Changed: `mt_m1W6nTQJ2b` is now a documented gap with an atlas task reference (spec 131 explicitly excludes it, so "spec 131 partial" was removed), worded the same way in spec 212; the `mt_3e_PQxwC12` note no longer assigns its 100-range half to spec 212; Bede's "rarely above 100" (one auction-catalogue source) left child text and is `[check]` in the audit; Scene 2's Keeper's note relabeled "A true thing about math"; E3's distractor tag corrected to the start-number off-by-one. Hollis rule, pronouns, chapter names and the `#garden/pond` route rechecked.

## Review asks

**Subject expert:**
1. Is roping both sides an honest picture of = for sums (8 = 5 + 3), beside the Balance Stall's masses, without implying = only compares sizes?
2. Is "from 3 you run out" an acceptable fence for 3 − 5 before negative numbers?
3. Should *Number bonds to 9* stay mapped to partners of ten, following its description over its name?
4. Are Peek cards (child-controlled hide, no timing) a fair "fluency through play" format for within 5, 10 and 20?

**Owner questions, with defaults:**
1. Route `#garden/pond` beside the footbridge, under the garden hub? *Default: yes.*
2. 24 targets in one pack, or split counting and words (Duck Count, Pairing Rope) from bonds and stories? *Default: one pack; Duck Count and the Pairing Rope can ship first as their own slice.*
3. Ten Pairs with Pip as a cooperative partner, no piles compared? *Default: yes.*
4. First slice? *Default: the Duck Raft with Set C, then the Pairing Rope with Sets A and D.*
