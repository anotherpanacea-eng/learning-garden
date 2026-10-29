# 202. The Chance Window: likelihood words, the 0-to-1 line and counting with circles

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/202-chance-scale-text.md); sources and open checks are in the [source audit](../source-audits/202-chance-scale.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** three history anchors checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The arithmetic is checked by script; the teaching still needs the math check.

## Purpose

Learning Garden already has the Seed Stall ([spec 87](87-seed-stall-chance.md), `#numbers/seeds`): a six-seed virtual bag, a prediction, short runs of draws with replacement and a careful "six draws need not match" message. Its source audit says plainly that it does **not** order events, teach equal likelihood as a criterion, or write any probability as a number. Draft [spec 119](https://github.com/anotherpanacea-eng/learning-garden/pull/126) (PR #126) builds the without-replacement tree on that stall and lists *Sets & Venn Diagrams* and *The Probability Scale* as untaught hard prerequisites. Draft [spec 169](https://github.com/anotherpanacea-eng/learning-garden/pull/148) (PR #148) reads a forecast's "70%" as "on 10 days like this, rain on about 7". Nobody yet teaches the line between those pieces: the words, the order, what makes outcomes equally likely, the fraction, the 0-to-1 scale, the whole that adds to 1, and counting outcomes with circles and tables. This pack takes eleven untouched Probability topics there. F3's unfinished-game model gives each player an independent 1/2 chance of winning each future round; its 9-to-3 split depends on that assumption.

A child comes to understand that likelihood words name places on one line, with *certain* and *impossible* only at the ends; that a reason comes from what is in the bag or on the spinner, never from a wish; that "how many out of the whole" decides the order, so a bag with more reed seeds can still give reed a lower chance; that outcomes are equally likely only when their parts are the same size, and that an uneven spinner is still random; that for equally likely outcomes a probability is a fraction, favorable over **total**; that every probability is one point from 0 to 1, written as a fraction, a decimal or a percent; that the probabilities of all outcomes that cannot happen together add to 1, so P(not A) = 1 − P(A); and that a Venn diagram or a two-way table counts outcomes once each, overlap first, with nobody left outside the box.

**Builds on, never re-teaches:** spec 87's six-seed bag, prediction and short runs (here: the same bags become cards on a line, and a spinner gets the same honest short-run message); spec 43's unit fractions of a set (here: favorable over total); spec 183's Venn drawer for shapes (here: the drawer gets a box around it, a "neither" space and counts); spec 169's chance-of-rain card (here: 0.7 and its complement 0.3, with no new forecast claim); spec 116's almanac weather page (a link, no data read). **Stops before** spec 119's tree diagrams, without-replacement draws and experimental-versus-theoretical comparison: the spinner's 20-spin tally is the empirical check the research asks for, never a convergence lesson. Percent and decimal notation are recapped inline and taught by proposed spec 200 (math build-out). Sibling spec 203 owns tables, tallies and graphs of data.

**Not targeted:** *Experimental probability* (`mt_sHJqh6UUya`), *Experimental vs Theoretical* (`mt_-bMnJcPJy8`) and *Tree diagrams* (`mt_GDtFU5fyUv`), all candidates in draft spec 119. *Simple Chance Experiments* (`mt_J4j7d3iAfg`) keeps its scoped reference at the Seed Stall. The flood card uses a record to make an "about" estimate as a contrast with equally likely outcomes, and claims no experimental-probability topic.

## Place and story

**Host:** the **Chance Window** at the back table of the Seed Stall, route `#numbers/chance`, run by the orchard keeper (she/her). The window looks out on the brook and holds a weather spinner, seed bags, a long pegged line and Wren's sorting desk. Linked from the Seed Stall (`#numbers/seeds`), the almanac's weather page (`#almanac`, spec 116) and the Forecast Room (`#science/forecast`, spec 169). Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| III, ch. 2 *the seed exchange* | Nuria's bag of reed seeds and apple pips is mixed up. Each family upstream draws one seed packet. Pip wants an apple pip and is sure wanting helps. | Sprout: the Likelihood Line. Seedling: which bag? Sapling: the Fraction Bag. |
| III, ch. 4 *letters up and down the river* | Nuria writes that the spinner at Vadoalto's seed table is "fair" because it has three colors. Its parts are not the same size. | Seedling, Sapling: the Spinner Table. |
| IV, ch. 1 *the old map and Hollis's account* | "How likely is a big flood?" Bramble wants a number. The ledger gives an honest "about", and two different ones. | Keeper's Desk: the flood card (D6, F5, F6). |
| IV, ch. 4 *the proposal for the low fields* | Wren sorts the seed packets for the low fields: flowers, plants that like wet ground, both, neither. | Keeper's Desk: the Venn Desk (Set E). Sapling: the Whole Bar. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, stall, bags, spinners, seed packets and letters are fiction, labeled apart from math, history and models. **Hollis rule:** Act III scenes say "the old Keeper" and never the name; only the Act IV scenes name Hollis (they/them), and the flood card switches its title from "the old Keeper's" to "Hollis's" ledger only after the Act III ending. Spec 120's unnamed "seed seller" is not used; the orchard keeper runs the back table.

## The knowledge

**Likelihood words.** Five words on one line: *impossible* (cannot happen: a sunflower seed from a bag of reeds and apple pips), *unlikely*, *even chance* (exactly as likely as not), *likely*, *certain* (must happen: a reed from a bag of only reeds). *Likely* is never a promise and *unlikely* is never "won't". *Impossible* differs from *very unlikely*: one apple pip among nine reeds is rare but possible. *Even chance* needs equal numbers; two kinds of seed do not make it. A reason names the bag ("most are reeds"), never a wish.

**Ordering.** Same-total bags first (10 seeds each: 2, 5, 7 and 10 reeds), then different totals. Bag A has 3 reeds and 1 apple pip; bag B has 6 reeds and 6 apple pips. B has more reeds, but A gives reed the better chance: 3 out of 4 against 6 out of 12. Order by "how many out of the whole", never by the count of reeds or the gap between colors. "It's random, so you can't tell" withholds what the bag plainly shows.

**Equally likely.** Outcomes are equally likely when each has the same chance: same-size spinner parts, same-size seeds in a well-mixed bag. Count the **size** of each part, not the number of colors: the weather spinner (sun a half, cloud a quarter, rain a quarter) has three outcomes that are not equally likely. *Random* and *equally likely* are different: that spinner is random, and sun is still more likely. *Fair* here means equal chance, not "good for me", and a spinner is not made fair by spinning it harder. Over 20 spins the weather spinner usually shows about 10 sun, 5 cloud, 5 rain; a short run can wobble.

**Probability as a fraction.** For equally likely outcomes: P(event) = favorable outcomes ÷ total outcomes. The total includes the favorable ones: 3 bean seeds and 7 pea seeds give P(bean) = 3/10, not 3/7 (that compares beans with peas). Check "equally likely?" before using it; on the weather spinner, count quarters, not three names. Simplest form names the same point: 4 sunflower seeds of 12 is 4/12 = 1/3.

**The 0-to-1 scale.** Probability is a measure from 0 (impossible) to 1 (certain), with 1/2 (even chance) in the middle. It is never a count (six numbers below 7 on a 1-to-6 spinner gives probability 1, not 6) and never more than 1. One point can be written three ways: 1/4 = 0.25 = 25%; 7/10 = 0.7 = 70%. Mixed forms are compared after changing to one form: 1/4 (0.25) < 0.3 < 40%. A bigger denominator does not mean a bigger chance (1/4 < 1/2).

**The whole is 1.** When outcomes cover everything and cannot happen together, their probabilities add to 1: think of one bar of length 1 cut into parts (red 1/4, blue 1/4, yellow 1/8, green 3/8). So a missing part is the rest of the bar: red 1/2 and blue 1/3 leave yellow 1/6. **Complement:** P(not A) = 1 − P(A), the quick route compared with counting every other outcome: P(not 3) on a 1-to-6 spinner is 5/6; a 0.7 chance of rain leaves 0.3 for no rain. A table that adds to 1.1 must be wrong somewhere. **Overlap trap:** on the 1-to-6 spinner, even (2, 4, 6) and prime (2, 3, 5) each have 1/2, but "even or prime" is 5/6, not 1, because 2 is in both and 1 is in neither.

**Sets, Venn diagrams and tables (Keeper's Desk).** A rectangle holds everything (the universal set); each circle holds a set. Fill the overlap (**both**, A ∩ B) first, then each "only" part, then **neither** (inside the box, outside both circles); the parts add to the total. **Either or both** (A ∪ B) counts each part once. Wren's 24 seed packets (made up): 13 flowers, 9 like wet ground, 5 both. So 8 flowers only, 4 wet only, 17 in either or both (not 22, which counts the 5 twice), 7 neither. Picking one packet at random: P(both) = 5/24, P(either or both) = 17/24. Only when told to pick from the wet-ground packets does the total shrink: P(flower) = 5/9. A count can be bigger than 1; a probability cannot. A **two-way table** lists every pair of outcomes from two things: a three-part weather spinner and a four-part seed spinner, all parts equal, give 3 × 4 = 12 equally likely pairs, so P(rain and bean) = 1/12.

**Honest uncertainty.** A flood is not a spinner: years are not equally likely outcomes, so there is no fraction to count. Hollis's ledger (spec 120, page 2) lists floods in years 4, 15, 27, 31, 34, 36 and 38. Taking "big" as 100 cm or more at the flood post (our label): years 27, 34, 36 and 38. Hollis kept the post for 40 years (spec 120's page 6: "For forty years I read the flood post"; Nuria's rain table in letter 4 counts "years of Hollis's keeping" 1 to 40). Over all 40 years that is 4 in 40, 1 in 10; over the last 20 years (21 to 40) it is 4 in 20, 1 in 5; before year 22 there were none. Which years to count is a choice, the Sponge changed things, and no record promises next year. The honest answer is an "about", with its reason and its limit.

**Real anchors (see audit).**
- **Pascal and Fermat's letters (1654).** In 1654 Blaise Pascal and Pierre de Fermat wrote to each other about a puzzle: a game between two players stops early, so how should the prize be shared fairly? They agreed the share should follow how the game **could still** finish, not what had happened so far. The two never met. Child text tells it as "a fair split of an unfinished game", with no gambling detail. F3 uses independent, equally likely round winners, so the four two-round continuations are equally likely.
- **John Venn's circles (1880).** In July 1880 John Venn, an English logician, published a paper in the *Philosophical Magazine* using overlapping circles to show how groups share members. Similar drawings existed earlier (Euler, 1768); Venn's paper made the style famous, and the diagrams carry his name.
- **Pingala's lists of rhythms (India, more than 2,000 years ago).** Pingala's work on poetic meter gives a method (*prastāra*) for listing every pattern of short and long syllables, and counts them: 2 for one syllable, 4 for two, 8 for three. Dates vary between sources (from about the 5th to the 2nd century BCE), so child text says "more than 2,000 years ago". H3 and F4 count fixed syllable positions (2, 4, 8), not fixed duration; a long syllable lasts twice a short one. Sibling 194's duration counts answer a different question. Claims that he "invented binary" are left out.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Likelihood Line | T1-T3 | Pip's mostly-reed bag (3 steps) | Set A |
| Spinner Table | T4, T5 | The weather spinner (3 steps) | Set B |
| Fraction Bag | T6-T10 | 3 beans, 7 peas (4 steps) | Set C |
| Whole Bar | T11-T13 | Rain 0.7, no rain? (3 steps) | Set D |
| Venn Desk and Table | T14-T17 | Overlap first (4 steps) | Sets E, F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists them); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** likely vs certain; unlikely vs impossible; two kinds vs even chance; more reeds vs more out of the whole; random vs equally likely; fair-equal vs fair-for-me; part of the whole vs part to part; count vs probability; 1/4 vs 0.4; A vs not A; adding parts that cannot overlap vs parts that can; both vs either or both; the whole box vs one circle as the total; a spinner vs a flood record.

**Top misconceptions designed against** (tags in the companion): `likely-means-will`, `rare-means-impossible`, `two-kinds-even`, `wish-reason`, `more-count-wins`, `random-cant-tell`, `colors-not-size`, `random-means-equal`, `spin-harder-fair`, `fair-for-me`, `part-part`, `total-on-top`, `count-as-probability`, `surface-digits`, `bigger-denominator`, `not-equals-same`, `ignore-sum`, `add-unlike-fractions`, `add-overlapping`, `circle-total-inside`, `double-count`, `forget-neither`, `wrong-total`, `add-not-multiply`, `forecast-certain`, `due-after-flood`, `record-useless`.

## The game or activity

**(a) Likelihood Line, model `likely-line-v1`.** A long string across the window with five pegs: impossible, unlikely, even chance, likely, certain. Event cards (pictures for Sprout; seed bags with countable seeds from Seedling up; spec 87's seven six-seed bags appear as cards) are dragged or tapped onto the string, then each asks "Why there?" with three spoken-reason chips (a bag reason, a wish, "it's random") and an optional spoken reason to a grown-up. **Order mode** (Seedling up): four bags, least to most likely. *A made-up model: the line's middle is shown as regions, so any spot inside the right region is kept as placed.*

**(b) Spinner Table, model `spinner-v1`.** Spinners with sun, cloud and rain pictures (and Pip, Dot and Bramble name cards for "who waters first"); no coins and no dice. **Build** (Sapling up): drag part edges to make a fair or unfair spinner; equal parts glow alike. **Spin 20**: up to three runs of 20 spins, one tap per spin, with a tally and bars. *A made-up model: each spin lands at a random point around the circle, so a part's chance equals its share of the circle. A screen spin, not a real spinner; a run of 20 can wobble and proves nothing about fairness.* Uses the browser's random source as spec 87 does; no authored sequence is shown as random.

**(c) Fraction Bag, model `seed-bag-v1`.** A see-through bag with up to 24 countable seeds (reed, apple pip, bean, pea, sunflower, marigold). The child sets the counts, taps the favorable kind, and builds the fraction from counted seeds: favorable on top, **all** seeds below. **Simplify** shows the same point twice on the 0-to-1 line beneath. **Three ways** shows the point as a fraction, a decimal and a percent together (decimal and percent tiles only for denominators that give tenths or hundredths). *A made-up model: same-size seeds, well mixed; real seeds vary.*

**(d) Whole Bar, model `whole-bar-v1`.** One bar of length 1 under the spinner or bag, cut into colored parts. **Cover a part** hides one and asks for it before uncovering. **Not** shades everything except one part. **Check a table** adds a weather table's values on the bar; a table that overflows or falls short shows the gap. **Overlap lens** (Keeper's Desk) lays "even" and "prime" over the 1-to-6 spinner so the shared 2 and the empty 1 are visible. *A made-up model: tables are invented, and only outcomes that cannot happen together are cut from one bar.*

**(e) Venn Desk and Two-Way Table, model `venn-desk-v1` (Keeper's Desk; Sapling for placing only).** Wren's desk: a rectangle with two circles and 24 seed-packet tiles, each showing two facts. **Sort**: place every packet; the parts count themselves only after the child types each count (overlap first). **Build from totals**: given 13, 9, 5 and 24, fill the four parts. **Shade**: both, either or both, not in A, with words first and symbols (∩, ∪, A′) as an optional layer. **Pick one**: a probability from a part, with the total stated. **Table**: rows from the weather spinner, columns from the seed spinner; tap a cell to see the pair. The **flood card** shows the ledger from spec 120, page 2, with the "big flood" label stated; its title says "the old Keeper's flood ledger" before the Act III ending and in standalone play, and "Hollis's flood ledger" after. *A made-up model: packets and spinners are invented; the ledger is spec 120's fiction.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Likely words and the line | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice, order |
| B. Fair or not? | Seedling (B1-B3), Sapling (B4-B6) | 6 | 3-choice, *say why* |
| C. Fractions of the bag, on the line | Seedling (C1), Sapling (C2-C6) | 6 | 3-choice, number |
| D. The whole is 1 | Sapling (D1-D3), Keeper's Desk (D4-D6) | 6 | number, 3-choice |
| E. Circles and the box | Sapling (E1), Keeper's Desk (E2-E6) | 6 | 3-choice, number |
| F. Tables, old puzzles, honest records | Keeper's Desk (F1-F6) | 6 | number, 3-choice, true / not true from this source, *say why* |

Sprout items use no numbers. Over the 18 three-choice items the right answer sits at A, B and C six times each. Three items carry an under-claiming distractor that withholds what the evidence shows (A6 "you can't tell", C5 "can't be compared", D6 "nothing at all"). *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `chanceWindow` per explorer, absent until a first explicit action.

```
chanceWindow: {
  version: 1,
  line:    { [setupId]: { source, placed: { [cardId]: 'impossible'|'unlikely'|'even'|'likely'|'certain' }, order?: [cardId], reason?: { [cardId]: 'bag'|'wish'|'random' }, at } },
  spins:   [{ source, spinnerId, runs: [{ tally: { [partId]: 0-20 } }], at }],   // latest 12, up to 3 runs each
  bags:    { [bagId]: { source, counts: { [seedId]: 0-24 }, pick: seedId, num: 0-24, den: 1-24, at } },
  venn:    { [sortId]: { source, placed: { [packetId]: 'both'|'aOnly'|'bOnly'|'neither' }, counts: { both, aOnly, bOnly, neither }, at } },
  answers: { [itemId]: { source, choice | value | order | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order (and, for a spin run, the spinner's part shares). Codes and numbers only; spin tallies are stored, never a random seed or a spin order. Never recompute or rewrite saved results on load; validate ids and ranges only (a run's tallies add to at most 20; `num` ≤ `den`). A tally that looks unlikely for its spinner is kept as recorded. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M6** chance, likelihood, probability, sets; **M3** fractions, decimals and percents as one magnitude; **M7** reasoning, justifying, spotting an impossible table; **S7** weather words (linked, no new claim); **H** three history anchors. Act families: III, IV.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Use and justify the five likelihood words; order events by "out of the whole"; tell equally likely from unequal outcomes; write a probability as favorable over total in simplest form; place and convert it on the 0-to-1 line; use sum-to-1 and P(not A) = 1 − P(A) with the overlap condition; fill Venn diagrams overlap first and count unions, complements and probabilities from regions and two-way tables. |
| Teaching encounter | T1-T17 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Pegged line; part edges that glow when equal; counted seeds building the fraction; the bar of length 1; overlap-first prompts; the "I'm stuck" ladder. |
| New application | Spec 87's own bags placed on the line; Nuria's three-color spinner; the covered part; the Venn from totals only; the unfinished game; Pingala's rhythms; the flood ledger. |
| Purposeful revisit | Spec 87 Seed Stall (bags, short runs); spec 43 (unit fractions); spec 183 (Venn drawer); spec 169 (chance of rain); spec 119 (trees, when built); spec 120 page 2 (ledger). |
| Data boundary | Placements, orders, reason chips, counts, tallies, choices, values and support codes, all local. No free text, timing, location or spoken reasons stored. |

## Upstream check

Refreshed upstreams: Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and the Marble topics and teaching-research records at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Likelihood Language (`mt_iFFKZd-Vgv`) | A pegged line from everyday events to inspectable bags; produce and justify words from composition; endpoints only for all/none; impossible apart from very unlikely; unequal bags early. Likelihood Line with "Why there?"; A1-A5; spoken reasons. |
| Ordering Likelihoods (`mt_UcGn2hjhYU`) | Same totals first; a bag with more reds and a lower chance; reasons as "out of the whole"; confront "it's random". Order mode; A4, A6; T3. Sampling confronts it at the Spinner Table. |
| Equally Likely Outcomes (`mt_xSgAgg9Ej_`) | Equal vs unequal parts with the same colors; random is not equally likely; two senses of fair; build fair and unfair; sampling as the check, small runs vary. Spinner Table Build and Spin 20; B1-B6. |
| Probability as a Fraction (`mt_-c4Ca_nBzX`) | Derive from countable equal outcomes; part-whole, not odds; place on the line at once; equally likely first; construct, not only read. Fraction Bag; C1-C3; T6, T7. |
| The 0-to-1 Probability Scale (`mt_t0g2SlP404`) | One line with 0, 1/2, 1; one point three ways; both directions; never above 1 or a count; convert before comparing; 0.5 not a default. T8, T9; C4-C6. |
| The Probability Scale (`mt_vmQJAtAFuy`) | Probability as a measure; fair devices calculated, uneven ones estimated or given; three colors not 1/3 each; bounds. Nuria's spinner (scene 2) and the weather spinner (B1); flood card as the estimated contrast; C6. |
| Calculating Simple Probability (`mt_Zt30Gxi-qp`) | Count favorable, count total, write, simplify, across contexts; equally-likely check first; more favorable, bigger fraction. Fraction Bag's live fraction and Simplify; C2, C3, E5. |
| Probabilities Sum to One (`mt_3fwYu7imd4`) | A bar of length 1; exhaustive and exclusive first; complement as shortcut beside counting; spot the table that does not add to 1; covered part predicted before uncovering. Whole Bar; D1-D4. |
| Complementary events (`mt_XfyqXLqzpx`) | Define cannot-happen-together; complement by 1 − P(A) with its reason; even-or-prime overlap; invalid distributions; common denominators. D2, D4, D5; Overlap lens. |
| Sets & Venn Diagrams (`mt_1YwOCMMwD8`) | Overlap first, subtract for "only"; union once; neither inside the box; two-way tables as a cross-check; shading in words. Venn Desk Sort, Build, Shade, Table; E1-E4, F1. Counting slips (22, 2) appear only as tagged distractors. |
| Venn Diagrams and Counting Outcomes (`mt_eSv_w46u6H`) | Build from a description; name parts in words then symbols; probability as part ÷ whole box, restricted only when told; listing and the product rule. Build from totals; E5, E6; F1, F2, F4. Two circles only; three-circle diagrams are a documented narrowing. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Likelihood Language | none listed | n/a |
| Ordering Likelihoods | Likelihood Language (`mt_iFFKZd-Vgv`) | Taught here (T1-T2 before T3). |
| Equally Likely Outcomes | Ordering Likelihoods (`mt_UcGn2hjhYU`) | Taught here (Likelihood Line before Spinner Table). |
| Probability as a Fraction | Unit fractions (`mt_k2WE0-22-4`) | Met elsewhere: spec 43 Sharing Counter and the fraction check-in (main, authored-task references); recapped in T6. |
| Probability as a Fraction | Equally Likely Outcomes (`mt_xSgAgg9Ej_`) | Taught here (T4-T5 before T6). |
| The 0-to-1 Probability Scale | Probability as a Fraction (`mt_-c4Ca_nBzX`) | Taught here (T6-T7 before T8). |
| Calculating Simple Probability | The 0-to-1 Probability Scale (`mt_t0g2SlP404`) | Taught here (T8-T9 before T10). |
| Calculating Simple Probability | Equally Likely Outcomes (`mt_xSgAgg9Ej_`) | Taught here. |
| The Probability Scale | Calculating Simple Probability (`mt_Zt30Gxi-qp`) | Taught here (Fraction Bag). |
| Probabilities Sum to One | The 0-to-1 Probability Scale (`mt_t0g2SlP404`) | Taught here (Fraction Bag before Whole Bar). |
| Complementary events | Probabilities Sum to One (`mt_3fwYu7imd4`) | Taught here (T11 before T12). |
| Complementary events | The Probability Scale (`mt_vmQJAtAFuy`) | Taught here. |
| Sets & Venn Diagrams | Complementary events (`mt_XfyqXLqzpx`) | Taught here (Whole Bar before Venn Desk; "neither" is the complement of "either or both"). |
| Venn Diagrams and Counting Outcomes | Sets & Venn Diagrams (`mt_1YwOCMMwD8`) | Taught here (T14 before T15). |

Soft prerequisites, supported without claim: *Simple Chance Experiments* (spec 87, referenced); *Comparing fractions* (`mt_IfEgu0X449`, referenced at the lantern line); *One Quantity as a Fraction* (`mt_xAf2bu9wYK`, a candidate in draft spec 118); percent and decimal notation (proposed spec 200, math build-out; recap only in T9).

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these eleven targets. Spec 87's source audit names three of them only to say it does **not** map them; the assignment map gives all eleven to this pack.

## Checks for implementation

- **Numbers script (2026-10-25):** `check202.py` (`python3 -I`, scratch area, not in the repo), 79 checks passing: A4 order 2 < 5 < 7 < 10 of 10; A5 1/6 (not 1/5); A6 3/4 > 6/12 though 6 > 3; weather spinner 1/2 + 1/4 + 1/4 = 1 and 20 spins expect 10, 5, 5 (thirds would be about 7 each); B4 1/2 + 3 × 1/6 = 1; B5 5/8 vs 3/8; C2 3/10 (wrong 3/7); C3 4/12 = 1/3 (wrong 4/8); 5/20 = 1/4 = 0.25 = 25%; C5 0.25 < 0.3 < 0.40; C6 6/6 = 1 (wrong 6); 7/10 = 0.7 = 70%; D1 0.3; D2 5/6; D3 tables add to 1, 1.1 and 1; D4 1 − (1/2 + 1/3) = 1/6 (wrong 3/5 from adding tops and bottoms); D5 1/2 + 1/2 = 1 but |even ∪ prime| = 5, so 5/6; T11 1/4 + 1/4 + 1/8 + 3/8 = 1; flood ledger big years 27, 34, 36, 38: 4/40 = 1/10, 4/20 (years 21-40) = 1/5, none in years 1-21; Venn 13, 9, 5, 24 gives 8, 4, 17, 7 (wrong 22, 2, 12, 18) with a brute-force packet list re-counted; 5/24, 17/24, 7/24, 5/9; T14 worked Venn 4, 2, 2; table 3 × 4 = 12, P(rain and bean) = 1/12 (wrong 7/12); Pascal split by enumerating the four two-round continuations: leader wins 3 of 4, 9 and 3 of 12 packets, unique whole split; Pingala 2, 4, 8 patterns, 3 with one long beat; 18 three-choice items at A, B, C six times each.
- Probabilities never shown above 1 or below 0; counts and probabilities labeled apart on the Venn Desk. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong". The flood card never states a forecast.
- Style check run on the companion (`style202.py`): no em-dashes; teach cards at most 30 words; prompts at most 15 words; feedback and explanations at most 20 words.
- Browser at 320 and 820 px: targets 44 px; tap-to-place as well as drag on the line, spinner edges and Venn; every spinner and diagram has a text equivalent ("Sun: half the circle. Cloud: a quarter. Rain: a quarter."); colors always paired with pictures.
- Nuria's Spanish line checked by a fluent reader before build.

- **Independent review, 2026-10-25.** Checked: every item, worked example, guided step and stuck case recomputed with the reviewer's own script (`rcheck.py`, `python3 -I`, scratch area; 42 checks for this pack passing, including a brute-force 24-packet Venn, the four two-round continuations and the 18-item A/B/C balance, recounted at 6/6/6); distractor feedback against each distractor; all eleven targets against pinned `topics.json` descriptions, research records and `dependencies.json` hard prerequisites (crosswalk complete); the claim map (all eleven owned by this pack; no overlap with siblings 200 or 201, which teach no probability); spec 120 adapters and chapter names; Hollis rule and pronouns; the three anchors re-searched (Pascal and Fermat never met, 1654; Venn 1880; Pingala's *prastāra*, 5th to 2nd century BCE); route uniqueness; em-dashes (0) and word limits. Changed: the flood card now uses spec 120's 40-year keeping (letter 4 counts "years of Hollis's keeping" 1 to 40, matching sibling 203), so 4 in 40 (1 in 10) and the last 20 years, 4 in 20 (1 in 5), replacing 4/38 and 4/16 in the knowledge, Scene 3, T17, D6, F5, F6 and owner question 3; British "favourable" changed to "favorable" in all three files; Pascal's Paris location cleared in the audit.

## Review asks

**Math expert:**
1. Is "even chance needs equal numbers" safe as stated for two-outcome bags, with the weather spinner as the three-outcome case?
2. Does the flood card's "about 1 in 10 / 1 in 5, depending on which years you count" stay honest without teaching experimental probability formally (left to spec 119)?
3. Is the Pascal-Fermat split (first to 2 points, stopped at 1-0, shares 3 : 1) a fair simplification of the problem of points?
4. Is E6's restricted denominator (5/9) right to include at Keeper's Desk, or should conditional wording wait?

**Owner questions, with defaults:**
1. Route `#numbers/chance` at the Seed Stall's back table, linked from the almanac weather page? *Default: yes; the almanac link is one button and reads no almanac data.*
2. Eleven targets in one pack, or split the Venn Desk off? *Default: one pack; the Venn Desk and Table can ship as a later slice.*
3. First slice? *Default: the Likelihood Line with Set A, then the Spinner Table with Set B.*
