# 189. Below Zero: negative numbers at the flood post

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/189-below-zero-text.md); sources and open checks are in the [source audit](../source-audits/189-below-zero.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** the three history anchors were checked against search excerpts on 2026-10-25 (page fetches blocked); no `[check]` item is in child text. The mathematics is standard and still needs the math check.

## Purpose

Five pinned Marble topics about negative numbers have no reference and no claim anywhere: negatives in context, intervals across zero, signed addition and subtraction, absolute value, and sign rules for multiplication. Spec 140 (draft #138) already reads a thermometer between marks and stops at zero for young readers; spec 118's flood-marks case (draft #126) already says a height means "height above a chosen zero". Nobody yet goes **below** that zero.

A child comes to understand that zero is a reference mark someone chose (the brook's usual summer level, the freezing point of water), so a reading below zero is a real amount on the other side, never "nothing"; that numbers keep going past zero when you count down; that farther left or lower means less, so −7 < −2; that distance from zero (|−7| = 7) is a different question from which number is greater; that a gap across zero splits at zero into two parts that add (from −4 to 9 is 13); that adding a negative moves down the line and taking away a negative moves up, which red and black rods with zero pairs make visible; and, at the Keeper's Desk, that the sign of a product or quotient follows from a pattern (−4 × 1, −4 × 0, −4 × (−1) keeps adding 4), with a dry-spell log that runs time backward so (−2) × (−4) = +8 has a meaning. No "two negatives make a positive" slogan appears for adding; a Keeper's Desk item confronts it.

**Builds on, never re-teaches:** spec 140's thermometer reading between marks and its °C/°F card (here: below zero and order); spec 118 Case 9's "a height means height above a chosen zero" and Léon's landing-floor numbers (here: the same numbers on a scale where the usual river is −60 cm); spec 120's flood post, Hollis's ledger and the 160 cm storm mark (here: the post's other side); spec 52's number line and spec 121's games table (here: the line extended left); spec 133's thermometer-versus-calendar contrast card (here: the thermometer side taught in full). **Not targeted:** elapsed time on a number line (`mt_IL86kadLSS`, first assigned here and now owned by proposed spec 207, see Upstream check); negative coordinates (spec 187's target, which depends on this pack); sequences crossing zero (spec 194); negative fractions and decimals beyond one Keeper's note.

## Place and story

**Host:** **the flood post at the mill**, route `#mill/post`, plus the winter thermometer on the mill's shaded north wall beside the door. The post's painted zero is the brook's usual summer level, so low water reads below zero; marks run every 10 cm from −50 to 200, with the old Keeper's flood cuts (40 to 140 cm) and the miller's storm mark at 160 cm, exactly as spec 120's ledger gives them ("heights above the brook's ordinary level"). A red stripe at −20 cm shows where the mill wheel stops turning. Linked from the mill, spec 140's weather station (which stands beside the post), Cold Window (`#science/window`, spec 102) and the Numbers path. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 4 *mend the village* | The miller straightens the storm-bent post and paints marks under the zero line. Pip says there is nothing below zero; the brook sits one mark under it. | Sprout: above, on, below. Seedling: read the post in cm. |
| III, ch. 4 *letters up and down the river* | In winter Nuria writes that Vadoalto read −7 °C; the mill thermometer reads −2 °C. Pip says 7 beats 2. | Seedling: order and compare. Sapling: distance from zero, gaps. |
| IV, ch. 1 *the old map and Hollis's account* | Hollis's ledger has only floods. The miller brings her dry-spell note ("falling 4 cm a day, today −12"); Wren Halloway asks where it was two days ago. | Sapling: signed moves. Keeper's Desk: the Dry-Spell Log, Léon's zero. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. **Hollis rule:** the Act I and Act III scenes and all act-agnostic text say "the old Keeper"; only the Act IV scene, after page 3, names Hollis (they/them). The town, brook, readings and weather are fiction, labeled apart from mathematics, history and models. Story numbers stay consistent with spec 120: Willowbank's storm 160 cm, Vadoalto's post marked every 50 cm with a storm near 240 cm (not reused in items), and spec 118 Case 9's Les Saules storm 1.85 m above a landing floor that is 0.60 m above the ordinary river.

## The knowledge

**Zero is a chosen mark.** A scale counts from a reference level. On the post, zero is the usual summer level: +40 cm is 40 cm higher than usual, −30 cm is 30 cm lower. On a Celsius thermometer zero is where water freezes. Below zero is an amount on the other side of the mark. Two readings compare only when they share a zero (spec 118 Case 9); Léon's scale counts from his landing floor, so the usual river reads −60 cm there.

**Counting through zero.** Count down: 2, 1, 0, −1, −2. Zero is one step, counted once. "−2" is read "negative two" (two below zero). This hard prerequisite (`mt_vXRzMbiPff`) is supported inline in T2 and claimed by nobody.

**Order.** Numbers increase to the right (up on a vertical line). −7 is left of (below) −2, so −7 < −2 and −7 °C is colder. Every negative number is less than zero. Bigger digit does not mean bigger number below zero.

**Distance from zero (absolute value).** |x| is how many steps x is from zero, never negative: |−8| = |8| = 8. It answers "how far?", which differs from "which is greater?": −9 < −2 but |−9| > |−2|; low water at −30 cm is farther from the zero mark than a small flood at 20 cm. A debt of $12 is a bigger debt than $5, and −12 is the smaller number.

**Gaps across zero.** Split at zero and add the parts: −4 to 9 is 4 + 9 = 13; 3 °C to −5 °C is a drop of 3 + 5 = 8; −30 cm to the 160 cm storm is 190 cm. Count steps, not marks (counting marks gives 14 for −4 to 9). If both numbers are on one side the gap does not cross zero: −2 °C to −8 °C is 8 − 2 = 6 degrees colder, a fall, not a rise.

**Adding and subtracting.** On the line, adding a positive moves up or right, adding a negative moves down or left, passing through zero when needed: 4 + (−7) = −3; −5 + (−3) = −8. With **rods** (after Liu Hui: red upright = +1, black slanted = −1; shape and color both carry the sign), a red and a black make a **zero pair** worth 0. Subtracting takes rods away; if the needed rods are absent, add zero pairs first, which changes nothing: 1 − (−3): one red, add three zero pairs, take away three black, four red remain, so 4. Taking away a negative therefore moves up; this is derived on the tray and the line, never stated as a rule first. The minus sign has two jobs (a number below zero; take away); brackets separate them: 5 − (−3). Money uses US dollars: an account at −$6 owes $6; paying $10 makes it +$4; the baker removing a −$6 charge from −$2 leaves +$4.

**Multiplying and dividing (Keeper's Desk).** Work out the size, then the sign. **Why negative × negative is positive, by pattern:** −4 × 3 = −12, −4 × 2 = −8, −4 × 1 = −4, −4 × 0 = 0; each step adds 4, so −4 × (−1) = 4 and −4 × (−2) = 8. **In context:** in a dry spell the brook changes by −4 cm a day; days ahead count +, days ago count −; change = days × change per day; two days ago, (−2) × (−4) = +8, so from today's −12 cm it read −4 cm, and three days ago it read 0. Same signs give a positive, different signs a negative; division follows the same rule because it undoes multiplication: −20 ÷ (−4) = 5 days; −20 ÷ 5 = −4 cm a day; −18 ÷ 3 = −6. Count the negatives in a longer product: (−2) × (−3) × (−4) = −24. Adding two negatives stays negative (−5 + (−3) = −8) while multiplying them gives a positive ((−5) × (−3) = 15): the contrast is taught on one card (T11) and tested in D6 and E3.

**Real anchors (see audit).**
- **Red and black rods.** *The Nine Chapters on the Mathematical Art*, a Chinese text composed mainly in the first century CE, gives rules for combining positive and negative quantities (gains and losses) in its eighth chapter. Liu Hui's commentary (263 CE) says positive rods are red and negative rods black, and that rods may also be told apart by setting them slanted or upright.
- **Fortunes and debts.** Brahmagupta's *Brahmasphutasiddhanta* (628 CE, India) is the earliest known text giving full arithmetic rules for zero as a number, with rules for negative numbers stated as fortunes and debts (the *Nine Chapters*' rules for adding and subtracting signed quantities are older): a debt minus zero is a debt; the product or quotient of two debts is a fortune. He states rules; he does not give the pattern argument, which the pack supplies.
- **Celsius's upside-down scale.** In 1742 Anders Celsius (Uppsala, Sweden) proposed a scale with 0 at boiling and 100 at freezing; soon after, around his death in 1744, it was reversed (often credited to Linnaeus; Jean-Pierre Christin in Lyon also made a freezing-at-zero scale in 1743; sources differ on who and when, so child text names nobody and says "soon after"). Under the first scale a cold morning reads above 100: where zero sits is a choice.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| The Flood Post | T1, T2 | Water 3 marks under zero (3 steps) | Set A |
| The Wall Thermometer | T3, T4 | One mark above −5 (3 steps) | Sets A, B |
| The Gap Line | T5, T6, T7 | From −4 to 9 (4 steps) | Sets B, C |
| The Rod Tray | T8-T11 | 4 + (−7) with rods (3 steps) | Set D |
| The Dry-Spell Log | T12-T14 | −4 × (−1) from the pattern (3 steps) | Set E |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists one per item family); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** below zero vs empty; higher vs colder; bigger digit vs bigger number; greater vs farther from zero; steps vs marks; gap across zero vs gap on one side; a fall vs a rise below zero; minus as "below zero" vs minus as "take away"; adding two negatives vs multiplying them; a rule (Brahmagupta's) vs a reason (the pattern).

**Top misconceptions designed against** (tags on distractors): `nothing-below-zero`; `stops-at-zero`; `skip-zero` / `double-zero`; `digit-order` (−7 > −2); `higher-colder`; `sign-dropped`; `marks-not-steps`; `subtract-digits` (−4 to 9 as 5); `add-no-crossing` (−2 to −8 as 10); `fall-as-rise`; `farther-is-greater`; `distance-negative`; `minus-minus-more-negative` (1 − (−3) = −2); `two-take-aways`; `slogan-for-adding`; `neg-times-neg-negative`; `uncounted-negatives`; `withhold` (one per set where the evidence decides: A2 C, B4 C).

## The game or activity

**(a) The Flood Post, model `post-v1`.** A vertical post scale, −50 to 200 cm in 10 cm marks, zero line bright, red stripe at −20, Hollis's cuts and the storm mark drawn but not labeled with a name in Acts I-III. **Raise** and **Lower** move the water a mark at a time; **Count the marks** speaks each mark from zero; **Show the reading** writes it with sign and unit. Sprout uses the three labels (above, on, below the zero line) with no numbers. *A made-up model: marks every 10 cm; the brook's readings are invented.*

**(b) The Wall Thermometer, model `wall-thermo-v1`.** −20 to 20 °C, a tick every degree, a label every 5. **Warmer by 1**, **Colder by 1** and **Count with me** ("2, 1, 0, negative 1..."). **Show the number line** lays the same scale on its side beside it. Spec 140's sight line is reused for reading; its siting lesson stands (this thermometer hangs in shade). *A made-up model: readings are invented.*

**(c) The Gap Line, model `gap-line-v1`.** A number line that can stand up or lie down (−50 to 200). **Mark two numbers** places dots; **Split at zero** draws two arcs meeting at zero, each labeled with its length, and a total; on one side it draws one arc and the subtraction. **Distance from zero** draws a single arc from zero and writes |x|. Ordering strips accept tap-to-place.

**(d) The Rod Tray, model `rod-tray-v1`.** Red upright rods (+1) and black slanted rods (−1), each also lettered + or − for color-blind readers. **Add a zero pair**, **Pair them off** (matched pairs fade to a small 0) and **Take away** with zero-pair prompting when rods are missing. **Show on the line** mirrors every move as an arrow on the Gap Line. Money mode relabels rods $1 and −$1 (a fortune and a debt). *A made-up model after Liu Hui's red and black rods.*

**(e) The Dry-Spell Log, model `dry-spell-v1` (Keeper's Desk).** A pattern table (days from today 3 to −3; change; reading) fills one row per tap, starting from the positive rows the child can compute, so the sign of (−1) × (−4) arrives from the step of +4. **Day back** and **Day ahead** move the post's water to match. A second panel offers the sign grid (+/− rows and columns) only after the table. *A made-up model: falling a steady 4 cm a day, today −12 cm.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Five sets, **30 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Above and below the zero mark | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice, order, number |
| B. Which is colder, which is lower? | Seedling (B1-B3), Sapling (B4-B6) | 6 | 3-choice, order, number |
| C. How far across zero? | Sapling (C1-C4), Keeper's Desk (C5, C6) | 6 | number with worked steps, 3-choice |
| D. Moving along the line | Sapling (D1-D4), Keeper's Desk (D5, D6) | 6 | number, 3-choice, *say why* |
| E. Signs when you multiply and divide | Keeper's Desk (E1-E6) | 6 | number, 3-choice, true / not true from this source |

Sprout items use no numbers. Over the 15 three-choice items the right answer sits at A, B and C five times each (A: A1, A5, A6, B4, C3; B: A2, B1, D4, E2, E3; C: B3, B5, C4, D2, E5). Options are matched for length and tone; A2 and B4 each carry one distractor that withholds a judgment the picture or numbers do settle. *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `millPost` per explorer, absent until a first explicit action.

```
millPost: {
  version: 1,
  post:    [{ source, level: -50..200 (step 10), at }],                 // latest 12
  thermo:  [{ source, reading: -20..20 (integer), at }],                // latest 12
  gaps:    [{ source, a, b, split: bool, at }],                         // latest 12; a, b integers -50..200
  rods:    [{ source, start: { red, black }, moves: [code], at }],      // latest 12; counts 0..30, moves <= 40
  drySpell:{ source, rowsShown: 0..7, at },
  answers: { [itemId]: { source, choice | value | order, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version (`post-v1`, `wall-thermo-v1`, `gap-line-v1`, `rod-tray-v1`, `dry-spell-v1`) and the item's choices and order. Codes and integers only; no free text (*say why* is never stored). Validate ids and ranges; never recompute or rewrite saved results on load (a saved answer is not re-marked if an item is revised). An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M1-IV** signed quantities and number-line distance (all five targets); **M2-IV** signs in multiplication and division; **M5** reading scales in cm and °C; **M7-IV** critique an argument (the slogan, D6) and distinguish a rule from a reason (E6); **H1** two old texts and a scale's history as sources. Act families: I, III, IV.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Read and place negatives in context; count through zero; order and compare; distance from zero vs order; gaps across zero and on one side; add and subtract negatives with rods and the line; multiply and divide with signs from a pattern. |
| Teaching encounter | T1-T14 with step-revealed worked examples; a guided first item per bench; Count with me and Split at zero under the child's control. |
| Contrast | As listed in The lesson. |
| Supported practice | Count the marks; Split at zero arcs; zero-pair prompt; Show on the line; the pattern table; the "I'm stuck" ladder. |
| New application | Léon's landing-floor zero (C6); the bakery account (D2, D5); running the dry spell backward (E2); Celsius's reversed scale. |
| Purposeful revisit | Spec 140 thermometer; spec 118 Case 9's chosen zero; spec 120 ledger and storm mark; later spec 187 coordinates and spec 194 sequences across zero. |
| Data boundary | Levels, readings, gap ends, rod moves, choices, values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`. Overlap read against main `b68d8de` and draft heads #126 `dc99ff1`, #127 `582281f`, #128 `098fac4`, #138 `2915014`, #140 `29947e6`, #148 `7ab1f23`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Negative numbers in context (`mt_1KkvzwYxbR`) | Several contexts; count through zero both ways; find gaps by counting through zero, not by rules; order across zero; zero counted once. Post, thermometer and bakery account; Count with me; A1-A6, C1. |
| Measuring temperature (`mt_RVK655t391`) | Directed contexts; a vertical scale so colder is down; gap as a distance split at zero; contrast the gap with the values; a fall below zero is not a rise. Wall Thermometer and Gap Line's Split at zero; C2-C5; C4 for falls. |
| Positive and Negative Numbers (`mt_9QzSnn8m80`) | Zero as a real reference; sign as direction, size as distance; adding a negative moves down; derive taking away a negative from direction or removing a debt; separate the two minus signs with brackets. Rod Tray with zero pairs and Show on the line; T9-T11; D1-D6. |
| Numbers on a number line, absolute value (`mt_RWUY7_IXvw`) | Absolute value as distance from zero, never negative; read |x| as "distance from zero"; hold order and size apart with paired statements; context where size matters (depth, debt). Distance from zero arcs; T5; B4-B6. |
| Sign Rules for Multiplication (`mt_rxInpOQ74w`) | Derive negative × negative by a pattern, give it a context, size then sign, one rule for × and ÷, keep it apart from adding. Dry-Spell Log table; T12-T14; E1-E5; D6 and E3 contrast adding. |

**Dropped:** `mt_IL86kadLSS` (pinned name "Numbers on a number line", Measurement) is elapsed time in minutes (start and end times, durations), not negative numbers; its hard prerequisite, time to the nearest minute (`mt_UNzojLkNdm`), is taught nowhere, and spec 93 uses it only as a narrow design anchor. Both of its hard prerequisites (`mt_UNzojLkNdm`, `mt_4emC463IyW`) are assigned to proposed spec 207 (bells and calendars, math build-out), and the build-out map now assigns the topic itself to 207 as well; this pack makes no claim on it.

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Negative numbers in context | Negative Numbers, count back through zero (`mt_vXRzMbiPff`) | Supported inline (T2, Count with me, A6); no claim. Draft spec 133 (#137) uses it as a contrast only; it is in no spec's claims and no sibling pack's assignment. Documented gap as a claimed topic. |
| Measuring temperature | Negative numbers in context (`mt_1KkvzwYxbR`) | Taught here (Set A and T1-T3 before the gap benches). |
| Positive and Negative Numbers | Measuring temperature (`mt_RVK655t391`) | Taught here (Gap Line before Rod Tray). |
| Numbers on a number line (absolute value) | Positive and Negative Numbers (`mt_9QzSnn8m80`) | Taught here (Sapling direction and sign; T4 and T9 before T5's practice). Distance items need only order and the line, so B4-B6 may be met before Set D. |
| Sign Rules for Multiplication | Positive and Negative Numbers (`mt_9QzSnn8m80`) | Taught here (Rod Tray before the Dry-Spell Log). |

Claim check, 2026-10-25: no spec on main or any draft PR (#126, #127, #128, #137-#151) claims these five targets; `grep` for the five ids and for "negative number" finds only spec 133's contrast use of `mt_vXRzMbiPff`.

## Checks for implementation

- **Numbers script (2026-10-25):** `check189.py` (`python3 -I`, scratch area, not in the repo), 73 checks passing: post marks −50 to 200 in 10s with every ledger height and the 160 cm storm on a mark; A4 −40 (wrong 40, −4); A5 −7 (wrong −9, 7); A6 count back 3 → −2 (wrong 0 stopping at zero, −3 skipping zero); −7 < −2 and a 5 degree gap; B2 order −7, −3, 0, 2, 5, unique by brute force; |−30| > |20|; −2 > −9 with |−9| > |−2|; |−8| = |8| = 8; C1 −4 + 7 = 3 (wrong 11); C2 drop 8 (wrong 2, 9); gap −4 to 9 is 13 (14 marks); C3 17 (wrong 5, 18 marks); C4 cooled 6 (wrong 10); C5 190 (wrong 130); C6 185 − (−60) = 245, matching Case 9's 1.85 + 0.60 m (wrong 125); D1 3 + (−8) = −5 (wrong 11, 5); D2 +4 (wrong owes 16, owes 4); D3 −8 (wrong −2); D4 1 − (−3) = 4 by the rod model (wrong −2); D5 4 (wrong −8, −4); −5 + (−3) = −8 vs (−5) × (−3) = 15; pattern −12, −8, −4, 0, 4, 8 stepping +4; E2 −12 + (−2)(−4) = −4 (wrong −20); dry spell 0 three days ago, −24 three days on; E3 15 (wrong −15, −8); E1 −3 × (−1) = 3, −3 × (−2) = 6; E4 −20 ÷ (−4) = 5; E5 −24 (wrong 24, −9 the sum); T13 −18 ÷ 3 = −6, 24 ÷ (−6) = −4; 0 °C = 32 °F, −5 °C = 23 °F, −20 °C = −4 °F; Celsius's first scale puts today's −5 °C at 105; three-choice balance A5 B5 C5; A3's order unique.
- Scales always show zero and units; negative numbers use a true minus sign; signs never carried by color alone (rods are also slanted/upright and lettered). Gap arcs never count marks. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- Style check run on the companion (`style189.py`, 159 checks): no em-dashes; teach cards at most 30 words; prompts at most 15 words; feedback, hints and explanations at most 20 words; Short scenes at most 30, Longer at most 150, Keeper's notes at most 80.
- Browser at 320 and 820 px: targets 44 px, tap-to-place as well as drag on the Gap Line and ordering strips; the vertical post and thermometer stay readable at 320 px without page scroll; every scale has a text equivalent ("The water is 3 marks below zero: −30 cm"); screen readers say "negative 3", not "dash 3".
- Nuria's Spanish line (*¡Qué frío hace aquí!*) checked by a fluent reader before build.

- **Independent review, 2026-10-25.** Independent numbers script (`review_checks.py`, `python3 -I`, scratch area, written fresh, not the writer's): 32 grouped checks for this pack, all passing; independent style script (`style.py`) over all three files: 0 em-dashes, every prompt, hint, feedback, explanation and teach card within limits, right-answer positions recounted (A 5, B 5, C 5). Checked as for spec 188, plus the flood post numbers against spec 120's ledger and spec 118 Case 9. Changed: elapsed time (`mt_IL86kadLSS`) recorded as owned by spec 207 (owner question removed); five practice items that repeated their bench's guided item now use new numbers (A4 −40 cm, A5 −7 °C, C3 17 cm, D1 3 + (−8) = −5, E1 the −3 pattern); question words added to A4, A6 and D5; brackets in −20 ÷ (−4); T11 now points to the multiplying contrast; H2's "oldest known book" narrowed to zero as a number (the *Nine Chapters* is older for signed addition) and H3's reversal softened to "soon after".

## Review asks

**Math expert:**
1. Is the pattern table plus the dry-spell meaning (days ago × change per day) a sound, honest argument for negative × negative at this level, without the distributive proof?
2. Does the rod tray's "add zero pairs, then take away" derivation of 1 − (−3) = 4 read correctly, and is "taking away a negative moves up" stated only after it?
3. Is |x| notation appropriate at Sapling, or should Sapling say "distance from zero" only and keep bars for the Keeper's Desk?
4. Is the D6 slogan confrontation clear enough without implying the slogan is a correct rule for multiplying?

**Owner questions, with defaults:**
1. Route `#mill/post`, with the thermometer on the same page? *Default: yes; the thermometer is a second bench on the same route.*
2. Celsius only, with Fahrenheit in one Keeper's note? *Default: yes, matching spec 140; US readers meet 32 °F in H3's note.*
3. First slice? *Default: the Flood Post and Wall Thermometer with Sets A and B, then the Gap Line.*
