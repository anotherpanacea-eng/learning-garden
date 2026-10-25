# Source audit 189: Below Zero

Date: 2026-10-25. Spec: [189](../specs/189-below-zero.md). Companion: [189 text](../content/189-below-zero-text.md).

**Method.** Six web searches (WebSearch; page fetches were blocked in this session, so every history claim rests on search-result excerpts and should be re-read at the source in the second pass). The mathematics (ordering integers, absolute value as distance from zero, intervals across zero, adding and subtracting integers with zero pairs, the sign rules for multiplication and division and the pattern argument for negative × negative) is standard school mathematics, matched against the Marble teaching-research records for the five targets and the pinned topic descriptions; no outside teaching text is quoted. All brook levels, temperatures, account balances and dry-spell figures in items are **made-up labeled data**, verified by `check189.py` (73 checks, all passing; scratch area, not in the repo). The child-facing companion passed `style189.py` (159 checks; 0 em-dashes).

**Story numbers taken from other proposals, not re-derived:** Willowbank's flood post heights (40 to 140 cm), "heights above the brook's ordinary level" and the 160 cm storm mark from spec 120's page 2 (draft #127, `582281f`); Vadoalto's 50 cm marks and the storm near 240 cm from spec 120 letters.md, letter 3 (used in story consistency only, not in items); Les Saules' storm 1.85 m above a landing floor 0.60 m above the ordinary river, giving 2.45 m, from spec 118 Case 9 (draft #126, `dc99ff1`). Item C6 restates Case 9's numbers on a scale with the landing floor as zero; the script confirms 185 − (−60) = 245 equals Case 9's 1.85 + 0.60 m.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "The Nine Chapters on the Mathematical Art" | Wikipedia | https://en.wikipedia.org/wiki/The_Nine_Chapters_on_the_Mathematical_Art | Composed mainly in the first century CE; rules for subtraction and addition of positive and negative numbers; Liu Hui's commentary of 263; chapter 8 (*fangcheng*, rectangular arrays) uses signed entries. |
| 2 | "Counting rods" | Wikipedia | https://en.wikipedia.org/wiki/Counting_rods | Red rods for positive, black for negative; a later (Sui) convention of triangular vs rectangular rods, with a citation flag (not used). |
| 3 | "Fangcheng (mathematics)" | Wikipedia | https://en.wikipedia.org/wiki/Fangcheng_(mathematics) | Chapter 8 has 18 problems reducing to simultaneous linear equations; Liu Hui's commentary dated 263. |
| 4 | Paper on the *Nine Chapters* (search excerpt) | bibnum.publimath.fr | https://bibnum.publimath.fr/ACF/ACF11039.pdf | Liu Hui: two kinds of rods for gains and losses, named positive and negative; positive red, negative black; may also be told apart by setting slanted or upright. |
| 5 | "On Mathematical Symbols in China" | arXiv | https://arxiv.org/pdf/1511.08033 | Corroborates the red/black rod convention in Liu Hui's chapter 8 notes. |
| 6 | "Key concept of math may have emerged first in China" | China Daily (via Northwest University news) | https://news.nwu.edu.cn/info/1004/23321.htm | 2023 report of painted ivory rods (Xi'an, Warring States era), red/black and red/white; attributes the red-positive, black-negative statement to Liu Hui. Not used in child text (recent, still under study). |
| 7 | "Brahmagupta" biography | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta | *Brahmasphutasiddhanta* (628); rules stated as fortunes (positive) and debts (negative); "a debt minus zero is a debt"; "the product or quotient of two debts is one fortune"; zero as a number subtracted from itself. |
| 8 | "Brahmagupta" | Wikipedia | https://en.wikipedia.org/wiki/Brahmagupta | Date 628; first text with arithmetic rules for zero and negative numbers. |
| 9 | Brahmagupta entry | historyofinformation.com | https://historyofinformation.com/detail.php?id=181 | Earliest known text treating zero as a number with rules, and negatives (corroborates 7-8). |
| 10 | "Much ado about Zero" | arXiv | https://arxiv.org/pdf/1601.05983 | Lists the fortunes-and-debts rules, including product of two debts is a fortune (corroborates 7). |
| 11 | "Celsius" | Wikipedia | https://en.wikipedia.org/wiki/Celsius | 1742 scale by Anders Celsius was the reverse of today's (0 boiling, 100 freezing); renamed from centigrade in 1948. |
| 12 | "Coming out of the cold" | Science Museum blog (London) | https://blog.sciencemuseum.org.uk/coming-out-of-the-cold | Celsius first defined 0 as boiling and 100 as freezing; reversed a few years later. |
| 13 | "Anders Celsius" (Scientist of the Day) | Linda Hall Library | https://www.lindahall.org/about/news/scientist-of-the-day/anders-celsius | Life 1701-1744, Uppsala; some credit Linnaeus with the reversal, without certainty. |
| 14 | "The legacy of Anders Celsius" | JSTOR Daily | https://daily.jstor.org/the-legacy-of-anders-celsius/ | Corroborates the inverted original scale. |
| 15 | Marble teaching-research records for the five targets, the dropped topic and `mt_vXRzMbiPff` | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |
| 16 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach → guided → practice, step-revealed examples, three-option items; medals, bosses and gates not adopted. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| *The Nine Chapters* is Chinese, composed mainly in the first century CE ("nearly 2,000 years old" in child text) | 1 | Checked (one source excerpt; date ranges in the literature run earlier for parts) |
| It gives rules for combining positive and negative quantities | 1, 3 | Checked |
| Liu Hui's commentary dates from 263 | 1, 3, 4 | Checked |
| Liu Hui: red rods positive, black rods negative; slanted or upright as a second cue | 4, 5, 6 | Checked (excerpts; second pass to read the Chemla-Guo or Dauben translation) |
| Brahmagupta, *Brahmasphutasiddhanta*, India, 628 | 7, 8, 9 | Checked |
| Earliest known text with full arithmetic rules for zero as a number, with rules for negatives | 7, 8, 9 | Checked. Narrowed in independent review: the *Nine Chapters* (source 1) already gave rules for adding and subtracting signed quantities, so child text now says "oldest known book with rules for calculating with zero as a number, and it has rules for negatives too" |
| "A debt minus zero is a debt" | 7 | Checked (MacTutor rendering; wording paraphrased in child text) |
| "The product of two debts is a fortune" | 7, 10 | Checked (renderings differ only in "a" vs "one") |
| Brahmagupta states rules without the pattern argument | 7 | Checked as far as the excerpts go; the card says only that he wrote the rule, and E6 tests "rule vs reason" against the card itself, not against his whole book |
| Celsius's 1742 scale: 0 at boiling, 100 at freezing | 11, 12, 14 | Checked |
| Celsius lived 1701-1744, in Sweden (Uppsala) | 13 | Checked |
| Reversed soon after (around his death in 1744) | 11, 12, 13 | Checked; who reversed it (Linnaeus in 1744 or 1745, or Christin's independent 1743 scale in Lyon) and exactly when are unsettled, so child text now says "soon after", names nobody and gives no year |
| Water freezes at 0 °C | standard | Checked (at standard pressure; child text keeps the everyday statement) |
| 0 °C = 32 °F; −5 °C = 23 °F | arithmetic, °F = °C × 9 ÷ 5 + 32 (as spec 140) | Checked by script |

## Open checks

1. Nuria's Spanish line, *¡Qué frío hace aquí!* (How cold it is here!), for a fluent Spanish reader (spec 120 rule).
2. Second pass on a published translation of Liu Hui's chapter 8 note (red/black and slanted/upright) and of Brahmagupta's rules (Colebrooke 1817 or a modern edition), since only excerpts were read.
3. `[check]`, not in child text: the 2023 Xi'an painted ivory rods as the earliest signed-number tools. Left out until the research is published and reviewed.
4. `[check]`, not in child text: who reversed the Celsius scale, and the year.

**Independent review, 2026-10-25.** Repeated searches on Liu Hui's red and black rods (Wikipedia, arXiv 1511.08033, bibnum and China Daily excerpts; the slanted/upright cue rests on secondary attribution, so open check 2 stays) and on Celsius's 1742 scale (Wikipedia, EBSCO, JSTOR Daily excerpts: reversal dated 1744 or 1745 and credited to Linnaeus with doubt; Christin's 1743 scale). Two child-text changes: H2's "oldest known" claim narrowed to zero as a number, and H3's "After he died" softened to "Soon after".

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the post, thermometer and rods. Counting-rod photographs on Wikimedia Commons vary in license (check each file); the 2023 ivory rods are museum-held and should not be used without permission. Anders Celsius's 18th-century portrait is public domain. No photograph of a real child or real family appears.

## Math and wording notes

- **No addition slogan.** "Two negatives make a positive" appears only inside D6, as a claim to test against −5 + (−3) = −8. T11 sets adding two negatives beside multiplying them. Right answers, hints and teach cards never state it as a rule.
- **Taking away a negative** is derived on the rod tray (add zero pairs, then remove black rods) and shown as an arrow on the line before any summary sentence; T10's card text describes the action, not a rule.
- **Gaps** are counted in steps (spaces), so counting marks (14 for −4 to 9; 9 for 3 to −5) is a tagged distractor, following the research's step-not-mark point.
- **Absolute value** is always read "distance from zero"; no card says "make it positive".
- **Context sign conventions:** the post's zero is the usual summer level (spec 120's "ordinary level"); an account below zero owes money; in the dry-spell log, days ago are negative and a fall is a negative change, stated on the model card before any item uses them.
- **Siting:** the wall thermometer hangs in shade on the north wall; spec 140's point that a thermometer in sun reads sunshine on the glass is left intact, and its Stevenson screen remains the careful instrument.
