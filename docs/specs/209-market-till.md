# 209. Market Till: dollars and cents, bills, change and best buys

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/209-market-till-text.md); sources and open checks are in the [source audit](../source-audits/209-market-till.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history anchors checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The arithmetic is checked by script and still needs the math check. **Money boundary:** pretend US dollars and cents only; no real prices, accounts, payments, financial records or spending advice.

## Purpose

Money is partly built. [Spec 57](57-market-day-coin-counter.md) (Coin Counter, `#workshop/coins`, main) teaches four labeled US coins, coin count versus value, and two ways to pay one price up to 25¢; it rules out dollars, decimals, notes and change. [Spec 67](67-market-change.md) (Market Change, `#workshop/change`, main) fixes a price and a single-coin tender up to 25¢ and asks whether it covers the price and what goes back, with "short" kept apart from zero change; it rules out bills, dollar decimals and multi-item bills. [Spec 104](104-gathering-budget.md) (Gathering Budget, `#workshop/budget`, main) chooses packets under a cent limit with two separate checks, and never recommends a cheapest plan. Nobody yet writes **dollars with cents**, adds a **bill of several items** with a 100¢-for-$1 trade, gives **change from a bill** ($5, $10, $20), **estimates** a total before deciding "is it enough?", compares **prices for one**, or names the numbers in a **two-step** money problem. This pack takes five untouched Measurement and Mathematical Thinking topics there, mapped from Marble's pounds-and-pence wording to US dollars and cents by concept.

A child comes to understand that $3.05 is one amount (three dollars and five cents, which is 305¢), with cents always in two places; that a bill adds cents and dollars and trades each 100¢ for a dollar; that change is the gap from the price up to what was paid, found by counting up (or by subtracting) and checked by adding back; that an estimate made first decides "enough?" when it is far from the money, and calls for an exact sum when it is close; that the price for one makes packs fair to compare, while the best buy still depends on what you need; and that each number in a two-step problem is a named quantity (total cost, change).

**Builds on, never re-teaches:** spec 57's coin names, values, count-versus-value and exchanges (here: bills, dollars and the 100¢ trade; the coin tray reuses 57's schematic coins); spec 67's price / handed over / back relation and short-versus-zero distinction (here: multi-item bills, bills as tender, counting up across dollars, two methods); spec 104's "limit and request are separate checks" and no-cheapest-plan rule (here: an estimate before the exact total, and best buy fenced by need); spec 85's hundredths square (here: cents as hundredths of a dollar, named once, never re-taught). **Not targeted:** *Money word problems* (`mt_3tz3Otap5j`, scoped by spec 67), Life Skills *Coins & Notes* and *Making Change* (another subject's domain), percentages and discounts (sibling proposed spec 200), decimals beyond money (sibling proposed spec 199), multiplying money by a whole number (proposed spec 191; F3 uses repeated addition only), and the measure-comparison half of *Estimating and comparing money* (1.5 kg vs 1200 g), already supported by spec 45 and recapped only through E5's grams.

## Place and story

**Host:** **the Café Till**, a wooden till with a paper tape by the café door, route `#cafe/till`, linked from the Café, spec 57's Coin Counter, spec 67's Market Change and spec 104's Gathering Budget, each with a short "the till uses dollars too" invitation. The till's money is its own: it never touches the Café cupboard, orders, Coin Counter mats, Market Change rounds or budget baskets. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 3 *Ember's birthday* | The café cooks for everyone; the baker's soup tag reads "$3.5", and Bramble reads three dollars and five cents. Ember brings a fistful of pennies for a honey cake. | Sprout: what the till tape shows (A1). Seedling: fix the tag (A4, A6). Sapling: the bill and its change (B4, C3). |
| III, ch. 1 *the floating market* | The café's stall at the landing; Ember has $10 for presents and asks "will it be enough?"; a trader offers two muffin packs. | Sapling: estimate (D2, D4); price for one (E3). Keeper's Desk: best buy for a need (E4); round up to be safe (D5). |
| II, ch. 1 *the weekly market* (purposeful revisit) | Spec 120's existing Coin Counter and Market Change jobs stay as written; the till can be offered as a further Seedling job with dollar prices. | Seedling: change from a bill (C1). |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. Spec 120 writes story prices as "coins"; the till shows dollars and cents and asks no adapter to convert between them. The town, café, prices and characters are fiction, labeled apart from math, history and models. The old Keeper is not named or mentioned (Hollis rule): both scenes fall before the end of Act III and need no reference. The Vadoalto baker in spec 120 (she) does not appear; "the baker" here is Willowbank's (he/him).

## The knowledge

**Notation.** 100 cents (¢) make 1 dollar ($). An amount can be written $3.05, 305¢ or 3 dollars and 5 cents, all the same money. After the point come exactly two places, and they are cents: $3.05 is 5 cents and $3.50 is 50. Under a dollar, 75¢ or $0.75. Never both signs on one amount ($0.75¢ and $1.50¢ appear only as labeled tags to fix). Read aloud place-value-honestly: "three dollars and five cents" (never "three point five"). Bills $1, $5, $10, $20 and coins 1¢, 5¢, 10¢, 25¢; size and count never decide value.

**Adding and subtracting money.** Add cents, add dollars; when cents reach 100 or more, trade 100¢ for $1 ($2.65 + $1.85: 150¢ = $1.50, plus $3, total $4.50). Treat each price as one amount; never carry three digits after the point. "How much more?" is a gap found by counting up ($2.40 to $3.05: 10¢ + 50¢ + 5¢ = 65¢), the same structure as change.

**Change.** Change = paid − price, a gap. **Counting up** first (the shopkeeper's method): jump to the next 10¢, the next dollar, then the paid amount, and add the jumps ($3.05 from $5: 5¢ + 90¢ + $1 = $1.95). **Taking away** second: convert to cents (500¢ − 305¢ = 195¢), which avoids the across-zeros slips ($2.95, $2.05). **Check** by counting the change back onto the price. With several items: total first (the parts), then change from the bill (the whole). The jumps' total is the change; the running total lands on the paid amount; the two are kept apart on screen. Spec 67's "short" stays: if paid is less than the price, the gap is "how much more", never negative change.

**Estimating.** Round each price to the nearest dollar (50¢ or more rounds up) and commit an estimate **before** the exact total. Far below the money: enough. Close: work it out exactly. A contrast case: five pies at $2.40 each round to $2, estimate $10, exact $12; every price rounded down. **Rounding up** gives an estimate never below the real total, so if it fits, the money is surely enough (95¢, $1.90, $1.85: $5 rounded up, $4.70 exact). An estimate catches a lost dollar or a misplaced point; it cannot confirm cents.

**Comparing and best buys.** Order prices by dollars, then cents. Price for one = pack price ÷ number in the pack, using only exact cent results (4 for $6.00 is $1.50; 6 for $8.40 is $1.40; jam 200 g for $1.80 is 90¢ per 100 g, 500 g for $4.00 is 80¢). The **best buy depends on need**: if you need four muffins, the four-pack costs less in all ($6.00 vs $8.40). The till never names a cheapest plan as the right life choice, following spec 104.

**Working with money (modelling).** Read the whole question, choose a picture (bar, number line or number sentence), name each interim number ("$4.00: total cost") before the next step, report the quantity asked for, keep the units, and sense-check (change is less than what was paid). F3 strings three steps: 3 loaves ($7.95 by repeated addition), plus jam ($9.80), change 20¢.

**The café menu (made-up model `till-menu-v1`).** honey cake $1.75 · cocoa $1.40 · soup $3.05 · loaf $2.65 · jam $1.85 · lemonade 75¢ · apple 45¢ · pie $2.35 · muffin $1.20. Chosen so that bills cross 100¢, prices round both ways, and $3.05 sits against $3.50.

**Real anchors (see audit).**
- **The Coinage Act of 1792.** On April 2, 1792, a United States law made the dollar the base unit, set up the Mint in Philadelphia, and defined decimal parts: the cent (a hundredth) and the "disme" (a tenth), with the mill (a thousandth) as a unit of account. A decimal currency is the reason cents take two places.
- **Jiaozi, Song dynasty China.** In Sichuan, where coins were heavy iron, merchants issued paper receipts for deposited coins; in the 1020s (1023 per most accounts, first official notes 1024) the Song government took over issuing them. Widely described as the first government-issued paper money. Child text says "the 1020s".
- **Lydian electrum coins.** Some of the earliest coins, from Lydia in western Anatolia (now Turkey), struck in electrum (a natural gold-silver alloy) around the mid-to-late 7th century BCE, many with a lion's head. Child text says "more than 2,600 years ago".

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 3-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Price Tags | T1-T3 | Build 3 dollars and 5 cents (3 steps) | Set A |
| The Till Tape | T4, T5 | Loaf and jam (4 steps) | Set B |
| Change Counter | T6-T8 | Cocoa from $2 (3 steps) | Set C |
| Enough? Board | T9, T10 | Ember's $10 (3 steps) | Set D |
| Best Buy Shelf | T11-T13 | 4 muffins for $6 (3 steps) | Set E |
| Order Tickets | T14, T15 | Bramble's cocoa (3 steps) | Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (eight are listed in the companion); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** $3.05 vs $3.50; 305¢ vs $305; count of coins vs value; one sign vs both; 150¢ kept vs traded; jumps' total vs running total; count up vs take away; estimate far vs close; rounding to nearest vs rounding up; total price vs price for one; cheaper each vs cheaper for what you need; total cost vs change.

**Top misconceptions designed against:** cents as a separate whole number ("three point five"); 5¢ written as 50; both signs together; more coins (or a bigger coin) means more money; adding price and paid for change; no trade at 100¢ (or a trade below 100¢); across-zeros subtraction slips; stopping at the next dollar or overshooting; rounding after calculating; trusting a close estimate; refusing to decide when the estimate already decides; smaller pack price means cheaper each; cheaper each is always best; reporting the total cost as the change; stopping after step one.

**Research constraints followed:** every option on screen is a correctly written amount; malformed forms appear only as tags labeled **Fix this tag** (A6) or as Scene 1's soup tag, which {guide} corrects on the spot, and are never a right answer. Counting up is taught before subtraction. Estimates are locked before the exact total appears. Recognition items are paired with build, count-up and say-why tasks. No till role-play is scored.

## The game or activity

Coins are spec 57's original schematic coins (penny 1¢, nickel 5¢, dime 10¢, quarter 25¢), reused through its exported pure helpers; bills are new original drawings ($1, $5, $10, $20), each labeled in numerals and words, with no portraits, seals, serials or official artwork. Every bench is open from the first visit.

**(a) Price Tags, model `price-tag-v1`.** Build an amount from bills and coins; the tag writes it three ways ($3.05 · 305¢ · 3 dollars and 5 cents) and a place strip shows dollars | dimes | cents. **Trade 100¢ for $1** and back conserve value. **Fix this tag** shows a malformed tag ("$3.5", "$0.75¢", "$1.50¢") and offers well-formed rewrites. *A made-up model: pretend bills and coins; tray capped at $20.00 and 25 pieces.*

**(b) The Till Tape, model `till-tape-v1`.** Ring up menu items onto a paper tape; **Add the cents** and **Add the dollars** run as two visible steps, and a 100¢ pile animates into a $1 bill only when the child taps **Trade**. **How much more?** opens a count-up line from money held to a price. At most six lines per tape. *A made-up model: café prices are invented.*

**(c) Change Counter, model `count-up-v1`.** An empty number line from price to paid with three jump buttons (next 10¢, next dollar, paid amount); each jump drops matching coins or bills into a change tray, and any equivalent tray is accepted. The tray's value (the change) and the line's position (the running total) are labeled separately. **Count it back** replays price + change = paid. **Take away instead** shows the cents subtraction for the same case. Tender is a bill: $1, $2 (two $1 bills), $5, $10 or $20. If paid is less than the price, the line says "short by" and offers spec 67's wording; no negative change.

**(d) Enough? Board, model `round-check-v1`.** A basket of 2-5 menu items and a stated amount of money. **Round each price** shows nearest-dollar rounding on a mini line; **Lock my estimate** is required before **Work it out** reveals the exact total (the lock is a step order, never a gate on the bench). Answers: **Enough · Not enough · Too close to tell yet**. **Round up to be safe** (Keeper's Desk) shows ceiling rounding. *A made-up model: rounding gives "about".*

**(e) Best Buy Shelf, model `best-buy-v1`.** Price tags line up to order; pack cards show **Price for one** by equal sharing (only exact-cent cases); **How many do I need?** sets a need and shows each choice's cost in all. The shelf never labels one pack the best buy without a stated need. *A made-up model: invented packs.*

**(f) Order Tickets, model `two-step-v1`.** A ticket with a two- or three-step order. The child chooses a bar, number line or number sentence, and after each step taps **Name this number** (total cost · change · money paid · how much more). A sense-check prompt follows: "Is the change less than the money paid?" *A made-up model: each ticket is invented.*

No timers, scores, streaks, medals or locks. Feedback never says "wrong".

## Problem sets

Six sets, **34 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Tags and money words | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice, match, fix the tag |
| B. Adding up the bill | Seedling (B1-B3), Sapling (B4, B5) | 5 | number, 3-choice |
| C. Giving change | Seedling (C1, C2), Sapling (C3-C5), Keeper's Desk (C6) | 6 | 3-choice, number, two ways |
| D. Will it be enough? | Sapling (D1-D4), Keeper's Desk (D5, D6) | 6 | number, 3-choice, estimate then exact, *say why* |
| E. Comparing prices and best buys | Sapling (E1-E3), Keeper's Desk (E4, E5) | 5 | 3-choice, number |
| F. Two steps, and how we know | Sapling (F1, F2), Keeper's Desk (F3-F6) | 6 | 3-choice, number, true / not true from this source, *say why* |

Sprout items use no numbers (pictures and words). Over the 18 three-choice items the right answer sits at A, B and C six times each. Three distractors withhold more than the evidence requires (D2, D5, E3: "can't tell" when the estimate or price for one already decides). *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `cafeTill` per explorer, absent until a first explicit action.

```
cafeTill: {
  version: 1,
  tags:    [{ source, tray: { b1, b5, b10, b20, c1, c5, c10, c25 }, at }],          // latest 12
  tapes:   [{ source, lines: [itemId], traded: bool, idea: cents|null, at }],          // latest 12
  change:  [{ source, jumps: [cents], tray: {...}, method: 'up'|'away', at }],         // latest 12
  enough:  [{ source, estimate: cents|null, call: 'enough'|'not'|'close'|null, at }],  // latest 12
  answers: { [itemId]: { source, choice | value | order | match, support: ['hint'|'example'|'skip'], at } }
}
```

Amounts are stored as integer cents (0 to 10,000); tray counts are integers 0-25; item ids, bills and menu ids are validated against the frozen `source`, which freezes the model version, the menu prices used, the case's tender and money, and an item's choices and order. A typed amount is parsed once, at the explicit submit, into integer cents plus a form code (`'dollars'|'cents'`); the typed text itself is not stored, and the saved value is never re-parsed or regraded on load. Codes and numbers only. Never recompute or rewrite saved results on load; validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. No other root (`coinCounter`, `marketChange`, Café orders) is read or changed. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M5** money as measurement (notation, adding, change, estimating and comparing); **M7** modelling a two-step problem and naming quantities; **M1** additive gaps and counting up; **M3** cents as hundredths, previewed only; **H1** a law, a paper note and a coin as sources. Act families: II, III.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Read, write and say dollars and cents; add a multi-item bill with the 100¢ trade; find "how much more" and change from a bill by counting up and by subtracting, and check; estimate by rounding before deciding "enough?"; order prices and compare prices for one, fenced by need; name quantities in a two-step money problem. |
| Teaching encounter | T1-T15 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Three-way tag; visible trade; jump buttons and change tray; locked estimate; price-for-one sharing; Name this number; the "I'm stuck" ladder. |
| New application | Change from $20 two ways (C6); round up to be safe (D5); grams in E5; a three-step ticket (F3); paper money as a source (F6). |
| Purposeful revisit | Spec 57 coins and exchanges; spec 67 price / handed over / back and "short"; spec 104 separate checks; spec 85 hundredths; spec 193's floating-market loaf price as a later formula context. |
| Data boundary | Trays, tape lines, jumps, estimates, choices, typed amounts and support codes, all local. No free text, timing, real money or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`; all five are "not yet mapped" in `curriculum/topic-coverage.csv`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Pounds & Pence Notation (`mt_pbuhUQJjtt`), as dollars and cents | Use the symbols in context, build a target from coins by value, accept equivalent forms, never both symbols, malformed forms only as rejected non-examples. Price Tags' three-way tag and Fix this tag; A4-A6; listening for use in the till scenes. |
| Money Addition & Subtraction (`mt_6J1wmCWf41`) | Change as a difference reached by counting up, coins as the record, friendly single-ten bridges first, "how much more" as the same gap, check by counting back, keep change apart from running total. C1 and the guided cocoa case bridge one ten; T5, B5; Count it back on every change item. |
| Giving Change (`mt_6_O6THdEDK`) | Totals of two or three items in dollars and cents; change from $5/$10 by counting up on an empty line; each amount one quantity with the 100¢ trade; estimate first; place-value-honest reading. Till Tape and Change Counter; B2, B4, C3-C6; reading rule on every tag. |
| Estimating and comparing money (`mt_mFJ-2ZF6Tk`) | Estimate committed before the exact value; round before, never after; compare in a common unit; money totals as single decimal quantities; reasonableness routine. Enough? Board's lock; D1-D6; E1, E5 (per 100 g). Length and mass comparison left to spec 45. |
| Working with money (`mt_iQYPw8bMfN`) | Choose and justify a representation, name interim results, report the asked-for quantity, keep units, sense-check; never score the role-play; a "which is the change?" item only as a warm-up. Order Tickets; F1 (warm-up), F2-F4; spoken F6. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points, streaks. No Jane code or text copied; Marble research paraphrased (CC BY-SA), never copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Pounds & Pence Notation | Coin Values (`mt_cPZwlUk8Nd`) | Met elsewhere: merged spec 57 (Coin Counter, declared explanation reference, US-cent adaptation); recapped in T1. |
| Money Addition & Subtraction | Adding money and giving change (`mt_AF2BeFQwfX`) | Met elsewhere: merged spec 57 (scoped practice reference: coin combinations). Note the pinned graph also lists this target's sibling Notation as a prerequisite of `mt_AF2BeFQwfX`; Notation is taught here, so the order holds. |
| Money Addition & Subtraction | Subtraction as taking away or separating (`mt_zuKAX6lcYR`) | Met elsewhere: merged specs 50, 51 and 131. Supported inline by T7. |
| Giving Change | Money Addition & Subtraction (`mt_6J1wmCWf41`) | Taught here (Till Tape and T5-T6 before T8). |
| Giving Change | Pounds & Pence Notation (`mt_pbuhUQJjtt`) | Taught here (Price Tags). |
| Estimating and comparing money | Giving Change (`mt_6_O6THdEDK`) | Taught here (Change Counter). |
| Estimating and comparing money | Calculating with measurements (`mt_6oxQPNLHNv`) | Met elsewhere: merged spec 45 (Measuring Kitchen, `#cafe/recipes`); grams recapped in E5. |
| Working with money | Connecting maths to real life (`mt_f67qGDhyfi`) | Met elsewhere: proposed spec 204 (math build-out); bar model recapped inline in T15. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these five targets; they are assigned to this pack in the math build-out map. Spec 193 uses a floating-market loaf price only as a formula context; spec 189 uses dollars for negative balances; spec 191 multiplies money by a whole number. None teaches notation, bills, change, estimating totals or best buys.

## Checks for implementation

- **Numbers script (2026-10-25):** `check209.py` (`python3 -I`, scratch area, not in the repo), **89 checks passing**, all money as integer cents: $1 = 100¢; $3.05 = 305¢ vs $3.50 = 350¢ vs $35.00; place strip 3|0|5; T4 $2.65 + $1.85 = $4.50 (150¢; no-trade $3.50); B1 $2.60 (wrong $1.60); B3 $2.80 (wrong $3.80, $47.35); B4 $6.20 from 120¢ (wrong $5.20, $6.65); B5 65¢ = 10 + 50 + 5 (wrong $5.45, $1.35); C1 60¢ (wrong $3.40, 40¢); C2 $1.20 + $3.80 = $5.00 (wrong $4.80); C3 $1.95 = 5¢ + 90¢ + $1 and 500 − 305 (wrong $2.95, $2.05); C4 $6.85 (wrong $7.85, $7.15); C5 jumps 5 + 60 + 200 = $2.65 (overshoot lands at $6.00; stop at 65¢); C6 $5.25 and $14.75 two ways (wrong $15.75, $14.25); rounding $2.65 → $3, $1.40 → $1, $1.50 → $2; D2 estimate $3, exact $3.80; D3 estimate $10, exact $12; D4 estimate $9, exact $8.60, $1.40 left (wrong $6.60, $7.60); D5 round-up $5, exact $4.70; E1 order and the cents-only wrong order; E2 $1.50 (wrong $24.00); E3 $1.40 < $1.50; E4 $6.00 < $8.40, two four-packs $12.00; E5 90¢ and 80¢ per 100 g (wrong $20.00, 8¢); F1/F2 $4.00 and $1.00 (wrong $9.00); F3 $7.95, $9.80, 20¢ (wrong $5.50); F4 $3.65 (wrong $8.35); scene 1 change $3.25 and 30¢ short of $1.75; scene 2 estimate $7, exact $6.85, change $3.15; the eight stuck examples; 18 three-choice items balanced 6/6/6.
- Every on-screen amount has exactly two cent places or uses ¢ alone; malformed tags appear only under **Fix this tag** and in Scene 1's corrected soup tag. Change tray value and running total are labeled separately. Estimates lock before exact totals. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- Style check run on the companion (`style209.py`): 0 em-dashes; 15 teach cards at most 30 words; 34 prompts at most 15 words; 88 feedback and explanation lines at most 20 words; scene shorts at most 30 words and longers at most 150; no "not X, but Y" construction.
- Browser at 320 and 820 px: targets 44 px; tap to add and remove (no drag); the till tape and number line have text equivalents ("From $3.05 to $3.10: 5 cents"); bill drawings legible without color; screen readers say "three dollars and five cents", never "three point zero five" (provide an aria label per amount).
- The single Spanish word (*¡Gracias!*) is spec 120's own line; no new translation.
- **Independent review, 2026-10-25:** recomputed every price, bill, change, rounding, estimate, price-for-one and two-step item in integer cents with a separate reviewer script (`rcheck209.py`, `python3 -I`, 45 checks passing, including the menu, a scan for malformed amounts, the 6/6/6 balance and 34 items); confirmed $3.05 vs $3.50 handling and every distractor's arithmetic. Changed: Sprout A1-A3 rewritten (multi-item tape, buying for a need, what "about" means) because the old items re-taught spec 57's count-versus-value and spec 67's change-back and short; B5's $1.35 distractor tag now names the actual slip (40 − 5); T3 no longer shows a malformed tag outside Fix this tag; Fix this tag opening and D6 no longer say "wrong"; D3 uses repeated addition (multiplying money is spec 191's); typed answers are stored as integer cents with a form code, never as text. No em-dashes.

## Review asks

**Subject expert:**
1. Is "three dollars and five cents" the right read-aloud rule for US learners, given that some US classrooms say "three oh five"?
2. Is ceiling rounding ("round up to be safe") appropriate at Keeper's Desk, alongside nearest-dollar rounding?
3. Are the malformed tags in Fix this tag a fair use of non-examples, given the research's caution about showing incorrect forms?
4. Does E4 ("best buy depends on need") fence the price-for-one idea without implying a spending judgment?

**Owner questions, with defaults:**
1. Route `#cafe/till` beside the Café, separate from the Workshop money tables? *Default: yes; the Workshop tables link to it.*
2. Should 57's and 67's Workshop invitations to the till ship with it, or later? *Default: ship one link each with the till.*
3. Include $20 bills at Seedling, or keep $20 for Sapling and up? *Default: $1, $5 and $10 at Seedling; $20 from Sapling.*
4. First slice? *Default: Change Counter with Set C, then the Till Tape and Price Tags.*
