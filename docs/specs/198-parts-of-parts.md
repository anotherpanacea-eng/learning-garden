# 198. Parts of Parts: multiplying and dividing fractions

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/198-parts-of-parts-text.md); sources and open checks are in the [source audit](../source-audits/198-parts-of-parts.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (page fetches blocked); one detail is marked `[check]` in the audit and kept out of child text. The arithmetic is standard and still needs the math check.

## Purpose

The garden already makes fair shares (spec 43), joins pieces of one loaf (spec 103), repeats **whole** batches (spec 50) and redraws a route at a new edge key (spec 111). Nobody multiplies or divides **by a fraction**: a fractional batch, a part of a part, a share of a share, or "how many of these fit in that". Sibling spec 186 uses the fraction-tile area model without a claim and records fraction multiplication as a documented gap. This pack takes the nine fraction-operation topics there, plus multiplication as scaling.

A child comes to understand that a whole number times a fraction counts more of the **same-size part**; a fraction of a fraction is a smaller part of a part, found by cutting both ways, so tops multiply and bottoms multiply; multiplying by less than 1 makes less, so "multiplying always makes bigger" is false; "of" means times, for fractions and percents of amounts; sharing a unit fraction out makes smaller pieces, while counting how many unit fractions fit in a whole number makes a bigger count; dividing a fraction by a fraction asks how many fit, solved by matching bottoms and then by the reciprocal, with a reason; and a modelled answer is finished only when it says its unit and what it counts.

**Builds on, never re-teaches:** sibling 196's unit fractions, a/b as a sum of 1/b and a/b = a ÷ b (here: recapped in T1 and T12); sibling 197's simplest form and common denominators (here: used in T7 and T15); sibling 200's percent as a fraction (here: recapped in T10); spec 50's whole copies of a batch (here: fractional batches); spec 111's scale drawing (here: a fractional map key); sibling 186's tile model (here: the Field Strips owns it as the teaching model). **Also targeted (added in review):** *Multiplication as scaling* (`mt_VKW8lOcFaw`), in neither the build-out map nor any spec's claim (spec 50 explicitly declines it), is claimed here: the Scaling Dial and T8 already teach it, so this pack is its home. **Not targeted:** *Mixed & Improper Fractions* (`mt_gNUE4B3vuk`, dropped by sibling 197): its description is the four operations with formal written methods on integers, decimals and fractions, positive and negative; this pack teaches multiplying and dividing fractions, but signed-number and decimal written methods are not taught here or recapped from any pack, so it stays unclaimed for a later synthesis pack. Ratio and proportion belong to sibling 201; decimal multiplication to sibling 199. Sibling 196's recipe card mode scales by finding one first with whole-number steps; this pack's dial owns fractional multipliers, so the two cards share no case.

## Place and story

**Host:** the **Scaling Bench** at the back of the café kitchen, with a window onto the orchard's field strips, route `#cafe/scaling`. Linked from the Measuring Kitchen (`#cafe/recipes`), the Whole Batches tray (`#cafe/batches`) and, if they ship, `#orchard/year` (spec 149) and sibling 186's `#mill/wheel`. It stays distinct from those routes: `#cafe/recipes` measures one batch in mL with a jug, `#cafe/batches` makes 1-3 whole copies, `#cafe/portions` joins already-cut pieces, `#cafe/units` changes L to mL. Here the multiplier or divisor is a fraction. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| III, ch. 1 *the floating market* | Vadoalto's traders stay for supper. The baker's card feeds 4; there are 6. Pip asks for half a batch, and Bramble learns times can shrink. | Sprout: half a batch, more or less? Seedling: honey × 3. Sapling: flour × 1 1/2. |
| III, ch. 2 *the seed exchange* | The orchard keeper gives half of her orchard (three of four strips) to grow Vadoalto's seedlings. Pip thinks that is half the field. | Seedling: shade 1/2 of 3/4. Sapling: tops and bottoms. |
| III, ch. 3 *the route by the high ford* | Oat packs for {courier}: quarter-cup scoops from 3 cups; a third of a loaf shared by two. | Seedling, Sapling: share or scoop. |
| V, path 4 *a travelling show*; path 6 *the Sponge, again* | An order slip for six players on the boat; bed area in the reed strip. | Sapling: oats for 6. Keeper's Desk: Fit Board, map and bed area. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, café, orchard, traders, recipe and field are fiction, labeled apart from math, history and models. The Vadoalto baker in spec 120's Act III (she/her) is a different character from Willowbank's baker (he/him), who hosts this bench. The old Keeper is not named (Hollis rule), including in the Act V beat.

## The knowledge

**A whole number times a fraction.** a/b is a lots of 1/b (recap of sibling 196). n × a/b counts n lots of a/b: the count of parts grows, the **size** of the part stays. 3 × 2/5 = 2/5 + 2/5 + 2/5 = 6/5 = 1 1/5. When the top passes the bottom, take out the wholes: 4 × 3/8 = 12/8 = 1 4/8 = 1 1/2. Mixed number times whole: copy every part, 2 1/3 × 3 = 6 + 3/3 = 7 (or 7/3 × 3 = 21/3 = 7). The bottom never gets multiplied by the whole number (12/32 equals 3/8, which shows four lots cannot be right).

**A fraction of a fraction.** 1/2 of 3/4 on the orchard keeper's square field: shade 3 of 4 strips down, cut across in half and shade one half; 2 × 4 = 8 pieces, 1 × 3 = 3 double-shaded: 3/8. Hence the rule: multiply tops, multiply bottoms, because the whole is cut both ways (2/3 × 4/5 = 8/15). It needs no common denominator, unlike adding (2/3 × 1/3 = 2/9, never 2/3). Products go to simplest form (3/4 × 2/3 = 6/12 = 1/2, recap of sibling 197). A fraction times a whole folds in as the whole over 1 (2/3 × 4 = 8/3).

**Multiplying as scaling.** Times more than 1 gives more; times exactly 1 keeps it; times less than 1 gives less. The baker's card (made up: makes 12 cakes for 4; flour 2 1/3 cups, oats 3/4 cup, honey 2/3 cup, milk 1 1/2 cups) on a dial of × 1/2, 2/3, 3/4, 4/4, 1, 1 1/2 (also shown as 3/2), 2, 3. The child predicts **more / same / less** before each reveal and compares the multiplier with 1, however it is written: × 4/4 is × 1 (the equivalence link), and 3/2 grows an amount even though it is written as a fraction. Flour × 1 1/2 = 3 1/2 cups; × 1/2 = 1 1/6 cups.

**"Of" means times.** 3/4 of 200 = 3/4 × 200: one quarter (50), then three of them (150). Percent is a fraction of 100 (recap of sibling 200): 25% = 1/4, 20% = 1/5. Chained in context: 20% off a $45 basket is $9 off, so $36 is paid (never $45 − $20).

**Mixed numbers in context.** Convert to top-heavy fractions (2 1/3 × 1 1/2 = 7/3 × 3/2 = 21/6 = 3 1/2) or draw the rectangle with all four pieces (2 + 1 + 1/3 + 1/6). Estimate first: more than one batch, so more than 2 1/3 cups; less than two batches, so less than 4 2/3. The estimate catches the dropped-pieces answer 2 1/6.

**Sharing a unit fraction out.** 1/3 ÷ 2: cut the third in two, and every third the same way, so the whole has 3 × 2 = 6 pieces and each share is 1/6. Check by the inverse: 1/6 × 2 = 1/3. The pieces got smaller, and the bottom grew by multiplying (1/3 ÷ 4 = 1/12, never 1/7).

**How many unit fractions fit.** 3 ÷ 1/4 asks how many quarter-cup scoops fit in 3 cups: 4 per cup, so 12. The answer is **bigger** than 3 because the scoop is small. Check: 12 × 1/4 = 3. **Share or scoop?** Sort each story first: sharing out (1/2 cup of honey among 3 traders: 1/2 ÷ 3 = 1/6 cup each) versus how many fit (1/3-cup scoops in 2 cups: 2 ÷ 1/3 = 6). The amount being cut up comes first in a sharing story.

**A fraction divided by a fraction.** Still "how many of these fit in that". Step 1, **match the bottoms**: 3/4 ÷ 3/8 = 6/8 ÷ 3/8 = 6 eighths ÷ 3 eighths = 2. Step 2, **the reciprocal, justified**: one whole holds 8/3 lots of 3/8 (eight eighths in groups of three), so dividing by 3/8 is multiplying by 8/3: 3/4 × 8/3 = 2. Keeper's Desk adds the derivation: multiply dividend and divisor by 8/3; the divisor becomes 1. Only the **second** fraction flips. Estimate guards it: 2/3 ÷ 4/5 is a bit less than 1, so 5/6 (never 8/15, 6/5 or 15/8). With common denominators the same answer appears (10/15 ÷ 12/15 = 10/12 = 5/6).

**Modelling.** Read the order, choose a picture (cup line, field strips, bar), compute, then attach the unit and referent: "1 1/8 cups of oats for six", never a bare 1 1/8. Contexts: recipes (cups), the field (square meters; a bed that is 2/3 of a 1/4 strip of a 120 m² field is 20 m²), a map (1 cm for 1/2 km, so 3 1/2 cm is 1 3/4 km).

**Real anchors (see audit).**
- **The Rhind papyrus.** An Egyptian scroll copied by the scribe Ahmose around 1550 BCE from an older text, now in the British Museum. Its first six problems share 1, 2, 6, 7, 8 and 9 loaves among 10 men; for 9 loaves each share is written 2/3 + 1/5 + 1/30 (= 9/10). Used for sharing, and at Keeper's Desk for checking the sum with a common denominator.
- **The Nine Chapters on the Mathematical Art.** A Chinese collection compiled over several centuries and in its final form by about the 1st century BCE or CE; its first chapter, *Fangtian* (rectangular fields), finds field areas from width and length and works out rules for computing with fractions. Liu Hui's commentary is usually dated 263 CE. The specific fraction-sided field problem (4/7 by 3/5) is `[check]` and stays out of child text.
- **Mahavira's rule.** In the *Ganita Sara Sangraha* (about 850 CE), the Jain mathematician Mahavira gives the division of fractions in two ways: swap the divisor's numerator and denominator and multiply, or form the cross-products: a/b ÷ c/d = (a × d) ÷ (b × c), with b, c and d nonzero. The latter has the same result as T15's common-denominator count; the reciprocal method is T16.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Cup Line | T1-T3 | Honey × 3 (3 steps) | Set A |
| Field Strips | T4-T7, T11 | Half of the orchard strips (4 steps) | Set B; C4 |
| Scaling Dial | T8-T10 | Half a batch of flour (3 steps) | Set C |
| Share and Scoop | T12-T14 | A third shared by two; quarter cups in 3 cups (3 steps each) | Set D |
| Fit Board | T15, T16 | 3/8-cup scoops in 3/4 cup (3 steps) | Set E |
| Order Slips | T17 | Oats for 6 (3 steps) | Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists twelve); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** more parts vs bigger parts; times vs plus (bottoms multiply vs bottoms match); part of a part vs the first part; times more than 1 vs less than 1; one quarter vs three quarters of an amount; percent of a price vs taking away the percent number; all four pieces vs two; sharing out vs how many fit; flip the second vs flip the first; a bare number vs a number with a unit.

**Top misconceptions designed against:** multiplying the bottom by the whole number (12/32); adding the whole number (7/8); copying only the whole part of a mixed number (6 1/3); keeping one bottom when multiplying fractions (2/3 × 1/3 = 2/3); adding tops and bottoms; multiplying always makes bigger; stopping at the unit part (50 for 3/4 of 200); subtracting a percent as a number ($25); dropping the cross pieces (2 1/6); dividing always makes smaller (rejecting 12 scoops); dividing by the denominator (3 ÷ 1/4 read as 3 ÷ 4); adding to the bottom (1/7); multiplying when sharing (4/3); swapping the amount and the sharers (3 ÷ 1/2); not flipping (8/15); flipping the first (6/5); the flip as a trick; a bare number as the answer.

## The game or activity

**(a) Cup Line, model `cup-line-v1`.** A number line marked in whole cups. Choose a cup size (1/2, 1/4, 1/3, 2/3, 2/5, 3/8, or 2 1/3 as a "mixed cup") and a count of 1-8 scoops; equal jumps draw along the line, and **Show the wholes** rings each full cup. **Mixed-number view** regroups 12/8 into 1 4/8 = 1 1/2. *A made-up model: every scoop is exactly the same size.*

**(b) Field Strips, model `field-strips-v1`.** The orchard keeper's field as one bold square. Cut 1-6 strips down and 1-6 across; shade a fraction each way; double-shaded pieces glow and **Write it** builds tops × tops over bottoms × bottoms beside the grid, then offers simplest form. **Mixed mode** (Sapling): a 2 1/3 by 1 1/2 rectangle in whole-field squares lights its four pieces (2, 1, 1/3, 1/6). *A made-up model: one square is one whole field; real fields are not perfect squares.*

**(c) Scaling Dial, model `scale-dial-v1`.** The recipe card with a dial (× 1/2, 2/3, 3/4, 4/4, 1, 1 1/2 shown also as 3/2, 2, 3). Before each turn the child taps **More than the card / The same / Less than the card**; then every amount redraws as a bar beside the original. **"Of" mode** (Sapling): an amount bar (200 apples, 12 cakes, $45) and an operator (3/4, 25%, 20%) partition then take. *A pretend recipe, not for real baking.*

**(d) Share and Scoop, model `share-scoop-v1`.** Story cards sort into **Sharing out** or **How many fit**. Sharing: a bar with a shaded unit fraction, **Cut into shares** splits it and extends the cuts across the whole so the new pieces can be counted. Scooping: a 1-6 cup bar fills with unit-fraction scoops, after a **predict more or fewer** step. **Check with times** shows the inverse sentence. *A made-up model: bars and scoops are exact.*

**(e) Fit Board, model `fit-board-v1`.** Two bars on one ruler. **Match the bottoms** rewrites both over a common denominator and re-rules the ruler; **Lay it along** repeats the divisor bar along the dividend, showing whole fits and the leftover as a fraction of one bar; **Flip and multiply** runs the reciprocal rule beside the bars so the two agree. *A made-up model: two lengths on one ruler.*

**(f) Order Slips, model `order-slips-v1`.** A made-up order (traders, players, the field, the map). The child picks a picture (cup line, field strips or bar), builds the number sentence from tiles, then fills the slip: number, unit tile, what it counts. The slip reads itself back ("1 1/8 cups of oats for six"); a bare number prompts "1 1/8 what?" No free text. *Made-up orders from made-up travelers.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **31 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Lots of a part | Sprout (A1), Seedling (A2-A5) | 5 | 3-choice, number |
| B. A part of a part | Seedling (B1, B2), Sapling (B3-B5) | 5 | 3-choice (B1 with picture), number |
| C. Bigger or smaller, and "of" | Sprout (C1), Seedling (C2), Sapling (C3, C4), Keeper's Desk (C5) | 5 | 3-choice, number |
| D. Share or scoop | Sprout (D1), Seedling (D2), Sapling (D3-D5) | 5 | 3-choice, number |
| E. How many fit? | Sapling (E1, E2), Keeper's Desk (E3-E5) | 5 | 3-choice, number, *say why* |
| F. Order slips and old books | Sapling (F1, F2), Keeper's Desk (F3-F6) | 6 | number with unit, 3-choice, true / not true from this source |

Sprout items use words and pictures (half, third, more, less) and no numerals. Over the 15 three-choice items the right answer sits at A, B and C five times each. Each distractor names its misconception. No three-choice item has a withholding distractor (none fit a computed answer); F6 instead tests saying more than the source says ("the first person ever"). *Say why* (E5) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `scalingBench` per explorer, absent until a first explicit action.

```
scalingBench: {
  version: 1,
  cups:    [{ source, size: sizeId, count: 1-8, at }],                          // latest 12
  fields:  [{ source, down: 1-6, across: 1-6, shadeDown: 0-6, shadeAcross: 0-6, mixed: bool, at }],  // latest 12
  dial:    [{ source, recipeId, factorId, predict: 'more'|'same'|'less', at }], // latest 12
  sorts:   { [storyId]: { source, placed: 'share'|'fit', at } },
  fits:    [{ source, caseId, view: 'match'|'lay'|'flip', at }],                // latest 12
  slips:   { [orderId]: { source, picture: 'cups'|'field'|'bar', tiles: [tileId], value: { whole, num, den }, unit: unitId, referent: refId, at } },
  answers: { [itemId]: { source, choice | value | match, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version (`cup-line-v1` and so on) and the item's choices and order. Codes and numbers only: fractions are stored as integers `{ whole, num, den }` with `den` 1-100; ids are validated against the frozen model; ranges as shown. Never recompute, simplify or rewrite saved results on load. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. *Say why* is never stored. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M3** fraction operations (multiply, divide, of, percent of); **M2** multiplication as scaling and the inverse relation; **M** modelling with units; **H1** an ancient scroll, a classic text and a medieval rule as sources. Act families: III, V.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Multiply a fraction or mixed number by a whole number; multiply fractions with an area model and the rule, in simplest form; predict a product's size from the multiplier; find fractions and percents of amounts; multiply mixed numbers in context; divide a unit fraction by a whole number and a whole number by a unit fraction, telling the two apart; divide fractions by fractions with a reason; finish a model with its unit. Prerequisite checks in the crosswalk. |
| Teaching encounter | T1-T17 with step-revealed worked examples; a guided first item per bench; the cup line, field grid, dial, share bar and fit ruler are under the child's control. |
| Contrast | As listed in The lesson. |
| Supported practice | Show the wholes; double-shaded count; predict before the dial; Check with times; Match the bottoms beside Flip and multiply; slip read-back; the "I'm stuck" ladder. |
| New application | Mixed mode; percent off a price; story sorting; the map key; the field-bed area; Mahavira's two methods; the Rhind sum. |
| Purposeful revisit | Spec 50 whole batches (now fractional); spec 103 joined pieces; spec 111 scale drawing; sibling 186 fraction-sided areas; sibling 201 ratio tables. |
| Data boundary | Settings, predictions, sorts, tiles, choices, integer values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Multiplying fractions (`mt_TgHxujL81r`) | Repeated addition of a fixed-size part; jumps on a line; regroup past one; copy every part of a mixed number. Cup Line with locked jump size; T1-T3; A2-A5. |
| Multiplying fractions (age 10+) (`mt_AabJisinfi`) | "Of" reading; two-way area model; tops and bottoms multiply, no common denominator; part of a part is smaller; simplify. Field Strips; T4-T7; Set B. |
| Multiplying fractions (age 11+) (`mt_J339bO7qLe`) | Unit part then a copies; percent via its fraction; chained discount; operators above and below 1. "Of" mode; T9, T10; C3, C5. |
| Real-world fraction multiplication (`mt_lvaSGHwvQ5`) | Mixed numbers via improper fractions or all four area pieces; estimate to catch dropped cross pieces. Mixed mode; T11; C4, F1, F2. |
| Dividing unit fractions and whole numbers (`mt_rCMdwG-YOE`) | Sort sharing from how many fit before computing; amount first; sense check; inverse check. Story sort; T14; D4, F-set contexts. |
| Dividing fractions (unit fractions) (`mt_ifPDOYvUqm`) | Split a shaded unit fraction and extend the cuts across the whole; 3 × 4 = 12; inverse check; contrast with whole ÷ unit fraction. Cut into shares; T12; D1, D2, D5. |
| Dividing by Fractions (`mt_1PAWhRhpdg`) | Predict first, then fit unit pieces along a length; a bigger answer explained; inverse check. Fill with scoops; T13; D3, E4. |
| Dividing fractions (`mt_9Y96vxG_LH`) | How many fit on a common-denominator bar; derive the flip; flip only the divisor; estimate. Fit Board; T15, T16; E1-E5. |
| Modelling with multiplication and fractions (`mt_K3R0yaHVcx`) | Choose a representation; compute; return with unit and referent; numbers kept attached to things. Order Slips; T17; F1, F3, F4. |
| Multiplication as scaling (`mt_VKW8lOcFaw`) | Predict before calculating by comparing the multiplier with 1; name and refute "multiplying always makes bigger" and its over-correction ("any fraction shrinks"); a stretch-and-shrink bar beside the original; × n/n = × 1 tied to equivalence. Scaling Dial predict step and bars, × 4/4 setting, 3/2 shown as a fraction; T8; Scene 1; B2, C1, C2, F2. Added in review. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: quests, medals, bosses, gates, mastery, timers, step-downs, points. No Jane code or text copied; Marble research paraphrased only.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Multiplying fractions | Understanding fractions (age 9+) (`mt_09sySPqM9Z`) | Met elsewhere: proposed spec 196 (math build-out); recapped in T1. |
| Multiplying fractions (age 10+) | Simplifying Fractions (`mt_b7T-CjOYUR`) | Met elsewhere: proposed spec 197 (math build-out); recapped in T7. |
| Multiplying fractions (age 10+) | Multiplying fractions (`mt_TgHxujL81r`) | Taught here (Cup Line before Field Strips). |
| Multiplying fractions (age 11+) | Percentages as Fractions (`mt_ALUrJpY0cZ`) | Met elsewhere: proposed spec 200 (math build-out); recapped in T10. |
| Real-world fraction multiplication | Multiplying fractions (age 10+) (`mt_AabJisinfi`) | Taught here (T4-T7). |
| Dividing unit fractions and whole numbers | Dividing by Fractions (`mt_1PAWhRhpdg`) | Taught here (T13). |
| Dividing unit fractions and whole numbers | Dividing fractions (unit fractions) (`mt_ifPDOYvUqm`) | Taught here (T12). |
| Dividing fractions (unit fractions) | Fractions of a whole (age 10+) (`mt_4Km38F4L-6`) | Met elsewhere: proposed spec 196 (math build-out); a/b = a ÷ b recapped in T12. |
| Dividing fractions (unit fractions) | Multiplying fractions (age 10+) (`mt_AabJisinfi`) | Taught here (Field Strips before Share and Scoop). |
| Dividing by Fractions | Multiplying fractions (age 10+) (`mt_AabJisinfi`) | Taught here. |
| Dividing fractions | Multiplying fractions (age 10+) (`mt_AabJisinfi`) | Taught here. |
| Dividing fractions | Dividing fractions (unit fractions) (`mt_ifPDOYvUqm`) | Taught here (Share and Scoop before Fit Board). |
| Modelling with multiplication and fractions | Working with money (`mt_iQYPw8bMfN`) | Met elsewhere: proposed spec 209 (math build-out); the $45 basket recaps money modelling. |
| Multiplication as scaling | Multiplying fractions (age 10+) (`mt_AabJisinfi`) | Taught here (Field Strips before the Scaling Dial). |

Soft relations noted, no claim: *Equivalent fractions, age 9+* (`mt_ebPelt-qAl`, soft for scaling) is sibling 197's; *Area with Fractions* (`mt_gx6KQK5-Kx`) is sibling 186's, whose own crosswalk lists `mt_AabJisinfi` as a gap that this spec closes if both ship.

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims the ten targets (spec 50 explicitly declines `mt_VKW8lOcFaw`, and no build-out pack holds it); `mt_AabJisinfi` appears only in spec 186 as an explicit non-claim.

## Checks for implementation

- **Numbers script (2026-10-25):** `check198.py` (`python3 -I`, scratch area, not in the repo), 184 checks passing: T1 3 × 2/5 = 6/5; T2 4 × 3/8 = 12/8 = 1 1/2; T3 2 1/3 × 3 = 7; T4 1/2 × 3/4 = 3/8 (8 pieces, 3 double-shaded); T5 8/15; T6 2/9; T7 6/12 = 1/2; T8 flour 3 1/2 and 1 1/6; T9 150; T10 25% of 12 = 3; T11 21/6 = 3 1/2 and the four pieces 2 + 1 + 1/3 + 1/6; T12 1/6 with inverse; T13 12 with inverse; T15/T16 3/4 ÷ 3/8 = 2 by matching bottoms, by 1 ÷ 3/8 = 8/3 and by Mahavira's cross method; every recipe amount at all seven dial settings moves in the predicted direction (28 checks); C4 wrong 2 1/6 and 3 5/6, estimate band; C5 $9 off, $36; D2 1/6 (wrong 2/3, 1/5); D3 12 (wrong 3/4 = 0.75); D4 1/6 (wrong 6, 1 1/2); D5 1/12 (wrong 4/3, 1/7); E1 2 (wrong 9/32, 1/2); E2 2 (wrong 9/8, 1/2); E3 5/6 with 10/15 ÷ 12/15 (wrong 8/15, 6/5, 15/8); E4 4 (wrong 9/4, 1/4); F1 1 1/8 (wrong 4 1/2, 1 3/4); F2 1 (wrong 2 1/6, 2 1/4); F3 1/6 of 120 = 20 (wrong 80, 30); F4 1 3/4 km (wrong 7, 4); F5 and all six Rhind shares (1, 2, 6, 7, 8, 9 loaves among 10) sum correctly; 15 three-choice items balanced 5/5/5; no distractor equals its answer or another distractor.
- Every cut on the Field Strips extends across the whole square, so pieces are always equal. Share bars re-rule the whole. The Fit Board never shows the flip without the bars. Model lines show on every bench. Sprout items show no numerals; feedback never says "wrong".
- Style check run on the companion (`style198.py`): 0 em-dashes; teach cards at most 30 words; prompts at most 15 words; feedback, hints and explanations at most 20 words; scene Short/Longer/Keeper's note within 30/150/80; 185 line checks, 0 problems.
- Browser at 320 and 820 px: targets 44 px; every grid, line and bar has a text equivalent ("8 pieces; 3 shaded both ways: 3/8 of the field"); fractions read aloud as "two thirds", never "two slash three".

- **Independent review, 2026-10-25.** Recomputed every item, worked example, scene number, dial setting and ladder case in a separate reviewer script (`python3 -I`, scratch area; 205 checks across specs 196-198, all passing after fixes; every card amount at all eight dial settings, and at 5/3, moves the predicted way), recounted positions (15 three-choice items, 5/5/5) and items (31), and re-checked distractor feedback, Marble records, hard prerequisites, claims, spec 120 adapters (Act V path 4 and path 6 exist; Hob and the Vadoalto baker as written), style (0 em-dashes; word limits) and saved-work rules. Changed: A5 feedback C (21/9 equals 2 1/3; it said "less than"); D3's two distractors were the same value (3/4 and 0.75), one replaced by 1/12; Scene 2's "long field" made square to match the model; the withholding-distractor claim corrected (there is none). Claimed `mt_VKW8lOcFaw` (multiplication as scaling: spec 50 declines it, no pack holds it) with an upstream row and crosswalk row, plus a × 4/4 dial setting, a T8 step and C2's right choice written as 3/2 for the research's equivalence link and over-correction misconception. Considered and declined `mt_gNUE4B3vuk` (signed and decimal written methods are not taught or recapped here). Mahavira's division verse was not re-surfaced by review searches; it stays an open audit check, unchanged in child text. `#cafe/scaling` reads as distinct from `#cafe/recipes`, `#cafe/portions`, `#cafe/batches`, `#cafe/fractions` and `#cafe/sharing`. Benches checked against specs 43, 45, 50, 103, 111 and siblings 196 and 197: no overlap.

## Review asks

**Math expert:**
1. Is "one whole holds 8/3 lots of 3/8, so dividing by 3/8 is multiplying by 8/3" a sound justification of the reciprocal rule at Sapling, with the multiply-both derivation kept for Keeper's Desk?
2. Is "top-heavy fraction" acceptable as the child term, with "improper fraction" in the glossary?
3. Should C5 (percent off) stay, given percent is recapped from sibling 200 rather than taught here?
4. Is the Rhind card's wording fair (scribes wrote most fractions as sums of different unit fractions, with 2/3 as the usual exception)?

**Owner questions, with defaults:**
1. Route `#cafe/scaling` at the café with the orchard window, or split the Field Strips to `#orchard/strips`? *Default: one route at the café; the orchard window is a view, not a second route.*
2. Ten targets in one pack, or split multiplication (a-c) from division (d-e)? *Default: one pack; Share and Scoop with the Fit Board can ship as a second slice.*
3. US cups in the pretend recipe, when spec 45 uses mL only? *Default: cups, because fractional cup amounts are the real-world case; labeled pretend, not for cooking.*
4. First slice? *Default: the Field Strips with Set B, then the Cup Line and the Scaling Dial.*
