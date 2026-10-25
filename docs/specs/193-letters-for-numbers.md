# 193. Letters for Numbers: formulas, like terms, brackets and pairs

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/193-letters-for-numbers-text.md); sources and open checks are in the [source audit](../source-audits/193-letters-for-numbers.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The algebra is standard and still needs the math check.

## Purpose

Algebra has a foothold in two drafts: [spec 118](https://github.com/anotherpanacea-eng/learning-garden/pull/126)'s Keeper's Desk Case 1 writes plan costs as `1200 + 60 × L` and solves one crossover equation (Algebraic Notation, Solving Linear Equations, Expressions & Equations Vocabulary), and [spec 119](https://github.com/anotherpanacea-eng/learning-garden/pull/126) §2 extends the Balance Stall ([spec 64](64-balance-stall.md)) to unknowns on both sides. Nobody yet teaches the everyday working moves of algebra: **using a formula**, **substituting**, **collecting like terms**, **opening a bracket**, **taking out a common factor**, **listing the pairs that fit a rule with two unknowns**, or **turning a formula around**. This pack takes seven untouched topics there.

A child comes to understand that a formula is a rule written first in words, then in letters; a letter stands for a **number** (never an object); substituting means putting the number in brackets where its letter was and then following the order of operations; only like terms (same letter, same power) combine, and 3a + 2b is a finished answer; a number outside a bracket multiplies every term inside (an area picture shows why); factoring runs that backwards with the biggest common factor; a rule with two unknowns has many solution pairs, listed in order so none is missed, and a second rule can leave one; and a quick estimate catches a slip.

**Builds on, never re-teaches:** spec 118's affine cost rules and its one-line-per-step working, and spec 119 / spec 64's balance moves (here: only recalled in one line on the Backwards Page, F1); sibling spec 192's order of operations, number sentences, inverse operations and first equations with a box (here: used, recapped in one teach card each). **Not targeted:** *Estimating answers (age 13+)* (`mt_Yw27nweoTj`), first assigned to this pack and dropped: its pinned description and research are about reading estimates off linear and quadratic graphs, with Plotting Linear Graphs as a hard prerequisite. The build-out map now assigns it to sibling spec 195, which claims it. Estimation as a checking habit stays here as support (T17, B6) with no claim. Sibling 194 owns sequences and nth term; sibling spec 195 owns linear graphs, simultaneous-equation methods and expanding double brackets (here only previewed as "two rules, one pair"; this pack expands single brackets only).

## Place and story

**Host:** the **librarian** (they/them) and the **Account Shelf** at the back of the library, route `#library/algebra`: old account books and recipe cards that write amounts in words, and a tray of colored tiles. Linked from the library, from spec 118's Keeper's Desk (Case 1 step 1e) and from the Balance Stall's end screen. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| III, ch. 1 *the floating market* (the exchange price rules) | The Vadoalto baker calls "three dollars a loaf, and two for the boat"; the librarian writes C = 3L + 2 from the old Keeper's word-only account book. | Seedling: use the word rule. Sapling: substitute; estimate. Keeper's Desk: turn it around. |
| III, ch. 2 *the seed exchange* | Nuria's boat holds twelve bundles of reed and seedlings; many pairs fit until "four more reed" leaves one. | Sprout: the full row. Seedling, Sapling: list pairs. Keeper's Desk: two rules. |
| IV, ch. 3 *the newspaper's two explanations* | The Gazette misprints 4(L + 3) as 4L + 3; the correction comes from an area picture. | Sapling: Area Board. |
| V, path 2 *a Willowbank newspaper* (the Gazette's formula column) | The librarian's column **Letters for Numbers** rewrites one of Hollis's word rules in letters each week. | Keeper's Desk: write the column entry (F6 spoken). |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, prices, recipes and account books are fiction, labeled apart from math, history and models. **Hollis rule:** Act III scenes say "the old Keeper"; Hollis is named only in the Act V scene. Problem items never name Hollis, since standalone play can come before Act III's end.

## The knowledge

**Formulas in words, then letters.** A formula is a rule for working out an amount. The pack's model price (made up): 3 dollars per loaf plus a 2-dollar boat charge, once per order. In words first; then C = 3L + 2, where C is the cost in dollars and L the **number** of loaves. 4 loaves: $14; none: $2 (the boat still counts). Perimeter P = 2(l + w): add, then double (5 by 3 cm gives 16 cm, not 13 or 15). Eggs E = p ÷ 2 + 1 (6 people: 4).

**Substituting.** Write the hidden times sign (3L = 3 × L), put the number in brackets where the letter was, then brackets, then × and ÷, then + and −. 3L at L = 4 is 12, never 34. a² = a × a (25 at a = 5) and 2a = a + a (10). 2 + 3a at a = 4 is 14, not 20. Values include zero (B2), a fraction (the fence page accepts half centimeters, as in l = 2.5) and, at Keeper's Desk, a negative: 2d + 10 at d = −3 is 4.

**Like terms.** Same letter **and** same power. 3a + 2a = 5a; 3a + 2b stays as two terms and is a finished answer (the research's "lack of closure" obstacle: the urge to force 5ab or one number); 5a − 3a = 2a (the sign belongs to its term); a + a² stays (a bar and a square). The pack talks in quantities ("L is the number of loaves"), never "L is a loaf", which licenses the fruit-salad error. Algebra tiles: long and short bars of two colors, small unit squares, big a² squares; red take-away tiles at Sapling.

**Opening a single bracket.** The number outside multiplies every term inside. 3(x + 4) is a rectangle 3 by (x + 4), split into 3x and 12, so 3x + 12; check at x = 1 (15 both ways). 5(2x + 1) = 10x + 5. Open, then collect: 3 + 2(x + 1) = 2x + 5. Keeper's Desk worked example only: −2(x − 4) = −2x + 8 as a signed diagram (a negative length is not a real side, so the card says "multiply each part").

**Factoring by a common factor.** Run the bracket backwards: find what divides every term, take out the **biggest**, divide every term, expand to check. 6x + 9 = 3(2x + 3); 12x + 8 = 4(3x + 2), where 2(6x + 4) is true but not finished; x² + 3x = x(x + 3) (a letter can be the factor). Area Board's Factor mode builds the rectangle with the widest shared side.

**Equations with two unknowns.** a + 7 = 12 has one answer; a + b = 12 has many pairs. Fix one letter, step it 1, 2, 3, ... and compute the partner; a table in order answers "how do you know you have them all?" Constraints decide the count: whole numbers above 0 give 11 pairs for a + b = 12 (13 if 0 is allowed); 2x + y = 20 gives 9 pairs (x = 1 to 9). **Preview only:** a second rule can leave one pair: a + b = 12 and a − b = 4 leave (8, 4); 3L + 5B = 31 has two whole-number pairs, (2, 5) and (7, 2), and "9 things" leaves (7, 2). Found by checking the table, with no elimination or graph method.

**Turning a formula around (changing the subject).** Numbers first, then letters, with identical steps: 3L + 2 = 20 gives 3L = 18, L = 6; so L = (C − 2) ÷ 3. Undo in reverse order and apply each step to the **whole** side; check by putting a number back. P = 4s gives s = P ÷ 4. Spec 118/119 own solving equations; this pack uses one recalled numeric line as the bridge.

**Estimating to check.** Round, compute roughly, compare: 19 loaves is about 20, 3 × 20 + 2 = 62, so $59 is sensible and $590 or $21 is a slip. Support only (see Purpose).

**Real anchors (see audit).**
- **al-Khwarizmi's book.** Muhammad ibn Musa al-Khwarizmi, working in Baghdad (associated with the House of Wisdom under the caliph al-Ma'mun), wrote *al-Kitab al-mukhtasar fi hisab al-jabr wa'l-muqabala* around 820 to 830 (sources vary; child text says "around the year 820"). It uses no symbols: everything, even numbers, is in words, and the unknown is *shay'*, "thing". *Al-jabr* (restoring) gives the word "algebra". The book says it serves inheritance, lawsuits, trade and land measurement; its longest part is on legacies.
- **Viète's letters.** François Viète (1540 to 1603), a French lawyer and royal councillor, printed *In artem analyticem isagoge* in 1591, using letters for both unknown quantities (vowels) and known ones (consonants). The vowel scheme did not last; Descartes' *La Géométrie* (1637) set the habit of late letters (x, y, z) for unknowns and early letters for knowns.

These two give an Islamic-world and a European anchor and match the pack's arc: words first (al-Khwarizmi), then letters (Viète).

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Recipe Ledger | T1-T5, T17 | 4 loaves with C = 3L + 2 (3 steps) | Sets A, B |
| Tile Tray | T6-T8 | Sort 3a + 2b + 2a (3 steps) | Set C |
| Area Board | T9-T12 | Open 3(x + 4); factor 6x + 9 (3 steps each) | Set D |
| Pair Finder | T13-T15 | Pairs for a + b = 12 (3 steps) | Set E |
| Backwards Page | T16 | A $20 bill back to loaves (4 steps) | Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (13 families in the companion); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** words vs letters for the same rule; 3L as 3 × L vs the digits 34; a² vs 2a; add-first vs times-first; like vs unlike terms; same letter, different power; a finished two-term answer vs a forced single term; first term only vs every term; a common factor vs the biggest; one answer vs many pairs; one rule vs two; undoing part of a side vs the whole side; exact vs estimate.

**Top misconceptions designed against:** letter as object; concatenation (3L → 34); squaring as doubling; left-to-right evaluation; zero makes everything vanish; dropping a negative's sign; conjoining unlike terms (5ab); combining different powers; losing a minus sign; dropping the letter (5a → 5); multiplying only the first term in a bracket; adding the outside number; a factor that is not the highest; dividing only one term when factoring; missing a letter factor; one pair as "the answer"; unsystematic listing; ignoring constraints (0 allowed or not); treating 2x + y as x + y; dividing only part of a side when rearranging; undoing in the wrong order; "swap side, swap sign" for ×.

## The game or activity

**(a) Recipe Ledger, model `ledger-v1`.** Pages from the old account books, each a rule in words above the same rule in letters (four pages: loaf price, garden-bed fence, pancake eggs, ferry fare). **Put in a number** runs a step machine that shows the bracketed substitution and each operation in order. **Write it in letters** offers word-to-letter tiles. Sprout mode: picture rules ("every jar gets one ribbon"), predicting more/same/fewer with no numbers. *A made-up model: prices and recipes are invented; the rules behave like real formulas.*

**(b) Tile Tray, model `tiles-v1`.** A heap of a-bars (long, green), b-bars (shorter, blue), unit squares and a² squares. Sort into piles; each pile labels itself (3a, 2b, 5). **Try to join** pushes two different tiles together and they spring apart. Sapling adds red take-away tiles (a green bar and a red bar cancel). Sprout sorts picture tiles by kind with no labels. *A made-up model: bar lengths stand for unknown numbers and are not to scale.*

**(c) Area Board, model `area-board-v1`.** **Expand** mode: a rectangle k by (term + term) splits at the plus sign; each part labels its area; **Check with a number** evaluates both forms at a chosen value. **Factor** mode: drag the tiles of an expression into one rectangle; **Try a wider side** shows that the biggest common factor makes the widest side with nothing left to share. Keeper's Desk shows the −2(x − 4) signed diagram as a worked example only. *A made-up model: letter sides can be any length; the picture is not to scale.*

**(d) Pair Finder, model `pairs-v1`.** Pick a value for the first letter; the finder fills the partner and a tick column. **Fill the table** steps in order through the allowed values (whole numbers above 0, or from 0 where a puzzle says so). **Add a second rule** highlights only the rows that satisfy both. Puzzles: a + b = 12; 2x + y = 20; reed and seedlings (12 in all, 4 more reed); loaves and baskets (3L + 5B = 31, 9 things). Sprout: red and blue books filling one shelf row. *A made-up model: everything comes in whole numbers.*

**(e) Backwards Page, model `turnaround-v1`.** A forward machine (× 3, then + 2) runs backward step by step (− 2, then ÷ 3). **Numbers first** solves one bill; **Now with letters** writes the same steps on C to give L = (C − 2) ÷ 3, keeping brackets around the whole side; **Check by putting it back** substitutes. *A made-up model: one rule at a time, each step undone in reverse.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Rules in words and pictures | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice, match, number |
| B. Putting numbers into letters | Seedling (B1, B2), Sapling (B3-B6) | 6 | 3-choice, number |
| C. Like terms | Seedling (C1-C3), Sapling (C4-C6) | 6 | 3-choice, tiles, number with check |
| D. Brackets and common factors | Sapling (D1-D4), Keeper's Desk (D5, D6) | 6 | 3-choice, number |
| E. Which pairs work? | Seedling (E1, E2), Sapling (E3, E4), Keeper's Desk (E5, E6) | 6 | 3-choice, number, number pair |
| F. Turning rules around, and the old books | Sapling (F1, F2), Keeper's Desk (F3-F6) | 6 | number, 3-choice, true / not true from this source, *say why* |

Sprout items use no numbers. Over the 20 three-choice items the right answer sits at A seven times, B seven times and C six times. Withholding distractors (wrong because they claim less can be known than the evidence gives): E1 C ("none, two letters are too many") and D6 C ("can't be factored"). *Say why* (F6) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `letterShelf` per explorer, absent until a first explicit action.

```
letterShelf: {
  version: 1,
  ledger:  [{ source, page: pageId, inputs: { [letter]: number }, at }],          // latest 12
  tiles:   { [caseId]: { source, piles: { [tileKind]: integer }, at } },
  area:    { [caseId]: { source, mode: 'expand'|'factor', factor: integer, at } },
  pairs:   { [puzzleId]: { source, rows: [[integer, integer]], second: bool, at } },
  turn:    { [caseId]: { source, steps: [stepId], at } },
  answers: { [itemId]: { source, choice | value | pair | match | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only: `inputs` values are bounded to the page's range (whole numbers 0-100, halves on the fence page, −10 to 10 at Keeper's Desk), tile counts 0-20, pair rows 0-50. Never recompute or rewrite saved results on load; validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. No free text is stored (F6 is spoken). Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M4** expressions, formulas and equations (Act III families); **M1** number facts and order of operations in use; **M3** money as the model's context; **H1** two sources on how algebra was written. Act families: III, IV, V.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Use word and letter formulas; substitute positive, zero, fractional and (Keeper's Desk) negative values; collect like terms; open single brackets; factor by the highest common factor; list all whole-number pairs for a two-unknown rule and see a second rule leave one; rearrange a one- or two-step formula. |
| Teaching encounter | T1-T17 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Step machine; tiles that refuse to join; check-with-a-number; ordered pair table; backward machine; the "I'm stuck" ladder. |
| New application | The Gazette misprint; the reed-and-seedlings second rule; the loaves-and-baskets bill; the formula column; a square fence rule turned around. |
| Purposeful revisit | Spec 118 Case 1 (cost rules); spec 64 and spec 119 §2 (balance); sibling spec 192 (order of operations); sibling spec 194 (rules for sequences use substitution); sibling spec 195 (pairs become points on lines). |
| Data boundary | Inputs, tile counts, pair rows, choices, values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Using Simple Formulae (`mt_Jvg8X0N5u0`) | Say what the formula computes and what each letter means first; bracket first in P = 2(l + w); every operation; units; word and symbol cards matched. Ledger pages pair words and letters; A4-A6, B3; perimeter wrong answers 13 and 15 tagged. |
| Substituting into Formulae (`mt_vHzVa3SURC`) | Write hidden × and bracket every value; contrast a² with 2a; a spread of values including zero and negatives; order of operations after substituting. T3-T5, step machine, B1-B6, F4. |
| Simple formulae (`mt_3qrCtdoVAU`) | Bridge from a solved numeric equation to letters with identical steps; inverse to the whole side, reverse order; check by substituting. Backwards Page, T16, F1-F3. Subject in a denominator, root or twice is not covered (documented limit). |
| Collecting Like Terms (`mt_nNNVrLqPW3`) | Sorting with tiles that refuse to merge; same letter and power; signs attached; confront lack of closure; quantities, not objects. Tile Tray, T6-T8, C1-C6. |
| Expanding Single Brackets (`mt_FX4a2Q8XXN`) | Area model, arrows to every term, substitution check, negative multiplier explicit, then collect. Area Board, T9-T10, D1, D2, D5; negative multiplier as a Keeper's Desk worked example only. |
| Factorising Expressions (`mt_uESbzWCZIq`) | Reverse of expanding; highest common factor; divide every term; expand back; a common letter. T11-T12, Factor mode, D3, D4, D6. |
| Equations with Two Unknowns (`mt_YFS7JFk64p`) | Many pairs vs one; fix one and step it; ordered table; constraints bound the count; respect the coefficient; preview that a second equation pins the pair. Pair Finder, T13-T15, E1-E6. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied; Marble research paraphrased, never copied (CC BY-SA).

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Using Simple Formulae | Order of operations (`mt_jHgRQ4hR0g`) | Met elsewhere: sibling spec 192 (this build-out). Supported inline (T4 recap); no claim. |
| Substituting into Formulae | Algebraic Notation (`mt_KwdjWEmMNo`) | Met elsewhere: proposed spec 118 Case 1 (draft PR #126). Supported inline (T3, T5); no claim. |
| Simple formulae | Solving Linear Equations (`mt_QhFEDyIwSO`) | Met elsewhere: proposed specs 118 and 119 §2 (draft PR #126). F1 recalls one numeric line; no claim. Documented gap if neither ships. |
| Simple formulae | Substituting into Formulae (`mt_vHzVa3SURC`) | Taught here (Set B before Set F). |
| Simple formulae | Using inverse operations (`mt_VUQNveSYjQ`) | Met elsewhere: sibling spec 192. Supported inline (Backwards Page); no claim. |
| Collecting Like Terms | Expressions & Equations Vocabulary (`mt_g_fkAqmz72`) | Met elsewhere: proposed spec 118 (draft PR #126). Supported inline (glossary: term, expression, like terms); no claim. |
| Expanding Single Brackets | Collecting Like Terms (`mt_nNNVrLqPW3`) | Taught here (Tile Tray before Area Board). |
| Factorising Expressions | Expanding Single Brackets (`mt_FX4a2Q8XXN`) | Taught here (Expand mode before Factor mode). |
| Equations with Two Unknowns | Writing Algebraic Equations (`mt_i9rJbuFO3p`) | Met elsewhere: sibling spec 192. Supported inline (Scene 2 and E5 write r + s = 12 from words); no claim. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these seven targets; `topic-coverage.csv` lists all as not yet mapped. Spec 118/119 claim Algebraic Notation, Solving Linear Equations, Expressions & Equations Vocabulary and Algebraic Transformations, which this pack does not claim.

## Checks for implementation

- **Numbers script (2026-10-25):** `check193.py` (`python3 -I`, scratch area, not in the repo), 110 checks passing: C = 3L + 2 gives 14 (L = 4), 17 (L = 5), 2 (L = 0), 59 (L = 19, estimate 62), with wrong values 18, 12, 37, 21, 5, 21 and 590 traced; P = 2(5 + 3) = 16 (wrong 13, 15) and 2(2.5 + 1.5) = 8; E = 6 ÷ 2 + 1 = 4 (wrong 3, 2); a² = 25 vs 2a = 10; 2 + 3a = 14 (wrong 20, 36); 2d + 10 at d = −3 is 4 (wrong 16, −16). Every simplification, expansion and factorization verified as an identity over a grid of values (3a + 2a = 5a; 4L + 2R + 3L = 7L + 2R; 5a − 3a = 2a; 2a + 3 + a + 4 = 3a + 7 with the 13 = 13 check; 3(x + 4), 5(2x + 1), 3 + 2(x + 1), 4(L + 3), −2(x − 4); 3(2x + 3), 4(3x + 2), x(x + 3)) and every listed wrong form shown non-identical; HCF(6, 9) = 3, HCF(12, 8) = 4 with common factors 1, 2, 4. Pairs by brute force: a + b = 12 has 11 pairs above 0 (13 with 0; 6 unordered); 2x + y = 20 has 9 (19 for x + y; 10 with y = 0); a + b = 12 with a − b = 4 has the unique pair (8, 4); 3L + 5B = 31 has exactly (2, 5) and (7, 2), and with L + B = 9 only (7, 2). Rearranging: (20 − 2) ÷ 3 = 6 (wrong 19.3, 4.7, 7.3); 28 ÷ 4 = 7 (wrong 24). Three-choice balance: 20 items, A 7, B 7, C 6.
- Area pictures always label each part and never draw a negative length; letter sides are marked "not to scale". Tiles of different kinds never merge. The Pair Finder's complete table appears only after every allowed value is tried in order. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- Style check (`style193.py`) run on the companion: 0 em-dashes and 0 en-dashes; teach cards at most 30 words; prompts at most 15 words; feedback, hints and explanations at most 20 words; scene shorts at most 30, longers at most 150, Keeper's notes at most 80; no "not X, but Y" constructions found.
- Browser at 320 and 820 px: targets 44 px, tap-to-place as well as drag for tiles; every area picture and pair table has a text equivalent ("Left part: 3 by x, area 3x").
- Math typesetting: superscript ², true minus sign (−) and × in child text; screen readers read "a squared", "minus".
- Independent review, 2026-10-25: a separate reviewer recomputed every value, identity, wrong form and pair count with an independent `python3 -I` script (119 checks across specs 192-195, all passing, including brute-force pair lists for E2, E4, E5 and E6), recounted the three-choice balance (A 7, B 7, C 6), reran the style check (0 em-dashes in all three files; word limits met), checked Marble descriptions, records and hard prerequisites, confirmed this pack expands single brackets only while spec 195 owns double brackets (no overlap), and that it uses spec 118's notation and spec 119's balance without re-teaching them. Changed: `mt_Yw27nweoTj` recorded as now owned by sibling spec 195; the "later spec" references now name 195; Scene 3 no longer gives `{guide}` a pronoun; C2 and C5 rebalanced so the right answer is not the longest; the Act V adapter uses spec 120's path name, *a Willowbank newspaper*; the review ask on dropping `mt_Yw27nweoTj` removed as settled. No math errors found.

## Review asks

**Math expert:**
1. Is "a letter stands for a number" plus tile bars "not to scale" enough to fence letter-as-object thinking?
2. Is the −2(x − 4) signed diagram acceptable as a Keeper's Desk worked example without a negative-length area model?
3. Is E6 (3L + 5B = 31 with 9 things) fair as a "two rules" preview without any elimination method?

**Owner questions, with defaults:**
1. Route `#library/algebra` with the librarian as host? *Default: yes.*
2. American "factor / factoring" in child text (Marble says "factorising")? *Default: American in child text; pinned names unchanged in tables.*
3. Seven targets in one pack, or split rearranging (`mt_3qrCtdoVAU`, which leans on spec 118/119) into a later slice? *Default: one pack; the Backwards Page ships last.*
4. First slice? *Default: the Recipe Ledger with Sets A and B, then the Tile Tray.*
