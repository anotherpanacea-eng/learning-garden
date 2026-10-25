# Source audit 197: Joining Fractions

Date: 2026-10-25. Spec: [197](../specs/197-joining-fractions.md). Companion: [197 text](../content/197-joining-fractions-text.md).

**Method.** Seven web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (equivalence by multiplying both terms, simplifying by a common factor, mixed and improper conversion, like and unlike denominators, regrouping) is standard school arithmetic and needs no outside source; it was checked by exact rational arithmetic. All ribbons, ropes, orders and lengths in problem items are **made-up labeled data**, verified by `check197.py` (Python `fractions.Fraction`, 166 checks, all passing; scratch area, not in the repo). The style of the companion was checked by `style197.py` (scratch area). Teaching constraints were paraphrased from the Marble teaching-research records for the twelve assigned ids (CC BY-SA; not copied) and Jane's `LESSONS.md`.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Nine Chapters on the Mathematical Art" | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/HistTopics/Nine_chapters | Chapter 1 (land surveying) gives rules for adding, subtracting, multiplying and dividing fractions and a Euclidean-style method for the greatest common divisor. |
| 2 | "The Nine Chapters on the Mathematical Art" | Wikipedia | https://en.wikipedia.org/wiki/The_Nine_Chapters_on_the_Mathematical_Art | Fangtian chapter covers field areas and manipulation of fractions; composition probably Han dynasty; mentioned in the Book of the Later Han, placing it no later than 93 CE. |
| 3 | "Liu Hui" | MacTutor | https://mathshistory.st-andrews.ac.uk/Biographies/Liu_Hui/ | Liu Hui's commentary dated 263 CE (from a later source). |
| 4 | "Further analysis of the binary Euclidean algorithm" | arXiv 1303.2772 | https://arxiv.org/pdf/1303.2772 | Quotes a translation of the reduction rule: halve if possible, otherwise subtract the smaller from the greater until equal, then divide by that number. |
| 5 | "The concept of primes and the algorithm for counting the greatest common divisor in Ancient China" | arXiv 0910.0095 | https://arxiv.org/pdf/0910.0095 | Original text of the reduction method in Chapter 1 (fang tian). |
| 6 | "TCM Arithmetic 2: Arithmetic of Fractions" | Math & Physics Problems wiki (fandom) | https://math-physics-problems.fandom.com/wiki/TCM_Arithmetic_2:_Arithmetic_of_Fractions?oldid=4551 | *Yue fen shu* (reducing) with problems 12/18 → 2/3 and 49/91 → 7/13; *deng shu* ("equal number") as the common divisor; *he fen shu* (combining) with 1/3 + 2/5 = 11/15 and 1/2 + 2/3 + 3/4 + 4/5 = 2 43/60. A secondary wiki, used only where it agrees with 4 and 5. |
| 7 | Korean journal article on division algorithms (koreascience) | koreascience.or.kr | https://koreascience.or.kr/article/JAKO201336161062594.pdf | Notes the same subtraction process appears in Chapter 1 of the Jiuzhang suanshu. |
| 8 | "Euclidean algorithm" | Wikipedia | https://en.wikipedia.org/wiki/Euclidean_algorithm | The common divisor is unchanged when the larger number is replaced by the difference (basis of the mutual-subtraction method). |
| 9 | "Abu Bakr al-Hassar" | Wikipedia | https://en.wikipedia.org/wiki/Al-Hassar | Twelfth-century Maghreb mathematician; credited with the horizontal-bar notation for fractions. |
| 10 | Katscher, "Extracting Square Roots Made Easy: A Little Known Medieval Method" | MAA *Convergence* | https://www.maa.org/book/export/html/117587 | Passage telling the reader to write the denominator under a horizontal line is the first known use of the fraction bar; Leonardo Pisano used it in 1202; al-Hassar lived in the 12th century in the Maghreb or al-Andalus; oldest copy dated 1194 (University of Pennsylvania). |
| 11 | Ahmed Djebbar, survey of Maghreb mathematics (as quoted) | via search excerpts (Muslim Heritage) | https://muslimheritage.com/people/scholars/abu-bakr-al-hassar/ | The book is the first found with a symbolic writing of fractions using the bar; the bar was probably already generalized in Maghreb teaching. |
| 12 | "Liber Abaci" | Wikipedia | https://en.wikipedia.org/wiki/Liber_Abaci | 1202; fraction written before the whole number (1/3 then 2 for 2 1/3); composite fractions on one bar, read right to left. Some passages tagged "citation needed". |
| 13 | "Liber Abaci fractions" | The Universe of Discourse (blog, M. J. Dominus) | https://blog.plover.com//math/liber-abaci-fractions.html | Corroborates the composite-fraction reading (example 29/30 = 4/5 + 2/15 + 1/30). |
| 14 | Marble teaching-research records for the twelve assigned ids | Marble repo at `7bd8b67` (CC BY-SA; paraphrased) | local clone | Pedagogy summarized in the spec's upstream check; the reason `mt_gNUE4B3vuk` was dropped. |
| 15 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach → guided → practice; "I'm stuck" ladder; writing style limits. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| The Nine Chapters is Chinese, Han dynasty, about 2,000 years old (no later than about 93 CE; Liu Hui's commentary 263 CE) | 1, 2, 3 | Checked ("about 2,000 years ago" is safe; no exact year in child text) |
| Its first chapter has a rule: halve if possible, otherwise subtract smaller from greater until equal; divide by the "equal number" | 1, 4, 5, 6, 7 | Checked (wording varies by translation; child text paraphrases) |
| Worked problems 12/18 → 2/3 and 49/91 → 7/13 | 6 (with 7 for the 91, 49 example in a related text) | Checked on one secondary source; arithmetic verified by script. Second pass: confirm in Chemla and Guo Shuchun's or Shen, Crossley and Lun's translation |
| Combining rule gives 1/3 + 2/5 = 11/15 | 6 | Checked on one secondary source; in H2's Keeper's note only; second pass as above |
| Al-Hassar, 12th century, Maghreb or al-Andalus; earliest known written use of the fraction bar | 9, 10, 11 | Checked |
| The bar was probably already in use in Maghreb teaching | 11 | Checked (child text says "historians think") |
| Oldest surviving copy dated 1194, so "more than 800 years ago" | 10 | Checked |
| Fibonacci used the bar in *Liber Abaci* (1202) | 10, 12 | Checked |
| Fibonacci wrote the fraction before the whole number | 12 | Checked on encyclopedia excerpt; second pass in Sigler's translation |
| Composite fractions on one bar, read right to left | 12, 13 | Checked (Keeper's note only) |
| *Liber Abaci* taught Hindu-Arabic numerals to European traders | 12 | Checked (common knowledge; Keeper's note only) |

## Dropped target

`mt_gNUE4B3vuk` *Mixed & Improper Fractions*: the pinned description and Marble record ask for formal written methods for all four operations across negative integers, decimals, proper and improper fractions and mixed numbers, with hard prerequisites on multiplying and dividing fractions (sibling spec 198). This pack does not teach negatives, decimals, × or ÷, so it makes no claim and returns the id for reassignment. Independent review (2026-10-25) checked sibling 198 as a home and declined it there too: 198 teaches × and ÷ of fractions, but the signed-number and decimal written methods are taught in neither pack.

## Added target

`mt_CBHwluE6Lp` *Adding Fractions (Same Denominator)*: same-denominator addition and subtraction including results past one whole. Merged spec 103 references it as explanation only (one scaffolded 3/4 + 2/4 path, supplied equations; its audit says no general subtraction or learner-produced mixed number). It is in no build-out pack, so review added it here as the practice home (Joining Table past one meter, B6, C3, C6); its hard prerequisite `mt_a1FdAsRKOF` is taught here first.

## Open checks

1. The 12/18, 49/91 and 11/15 problems against a scholarly English translation of the Nine Chapters (second pass).
2. Fibonacci's fraction-first order in Sigler's translation of *Liber Abaci* (second pass).
3. Léon's French line, *Bonjour des Saules !*, for a fluent French reader (spec 120 rule; spec 178's review judged the same line grammatical).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of ribbons, spools and rope. If a real image is wanted: pages of the Nine Chapters and of *Liber Abaci* manuscripts may exist as public-domain scans; confirm each file's license on Wikimedia Commons before use. No image of al-Hassar exists. No photograph of a real child or real family appears.
