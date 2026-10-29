# Source audit 193: Letters for Numbers

Date: 2026-10-25. Spec: [193](../specs/193-letters-for-numbers.md). Companion: [193 text](../content/193-letters-for-numbers-text.md).

**Method.** Five web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The algebra (substitution and order of operations, collecting like terms, the distributive law for single brackets, factoring by the highest common factor, whole-number solution pairs of linear equations in two unknowns, rearranging a linear formula) is standard school mathematics and is stated from the pinned Marble topic descriptions and teaching-research records, paraphrased. All prices, recipes, bundle counts and account books in problem items are **made-up labeled data**, verified by `check193.py` (110 checks, all passing; scratch area, not in the repo). Every identity is tested over a grid of integer values, and every unique-answer puzzle (E5, E6, the two-rule stuck example) is brute-forced over its whole allowed range.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Al-Khwarizmi" (Dictionary of Scientific Biography article) | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/DSB/Al-Khwarizmi.pdf | Member of the House of Wisdom under al-Ma'mun; full title of the algebra; no symbols, even for numerals; stated purpose (inheritance, lawsuits, trade, land measurement, canals); three parts, legacies the longest; first part covers equations of first and second degree. |
| 2 | "al-Khwarizmi" (course project page) | University of Kentucky | https://www.ms.uky.edu/~carl/ma330/project2/al-khwa21.html | Date around 820 to 830; *shay'* ("thing") for the unknown, *mal* for its square; *al-jabr* as restoring, *al-muqabala* as balancing. |
| 3 | "al-Khwarizmi, the Father of Algebra" | Interactive Mathematics | https://intmath.com/basic-algebra/al-khwarizmi-father-algebra.php | Word "algebra" from *al-jabr* via medieval Latin translation (corroborates 1-2). |
| 4 | "Al-Khwarizmi: a mathematical bridge between civilisations" | BBVA OpenMind | https://www.bbvaopenmind.com/en/science/mathematics/al-khwarizmi-a-mathematical-bridge-between-civilisations/ | Baghdad setting and the book's influence (corroborates 1). |
| 5 | "What is algebra good for?" | Keith Devlin (blog) | https://profkeithdevlin.org/2011/12/30/what-is-algebra-good-for/ | Final section on inheritance rules solved with linear equations (corroborates 1). |
| 6 | Review of Ruska's study of the algebra | *Isis* (University of Chicago Press) | https://www.journals.uchicago.edu/doi/epdfplus/10.1086/357997 | Mercantile-transactions chapter shows Indian influence (Aryabhata, Brahmagupta, Bhaskara); background only, not in child text. |
| 7 | "Viète, François" | Encyclopedia.com (from the Dictionary of Scientific Biography) | https://www.encyclopedia.com/people/science-and-technology/mathematics-biographies/francois-viete | *In artem analyticem isagoge* (1591); vowels for unknowns, consonants for knowns. |
| 8 | "Viète" (short history) | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/SH/viete_sh.pdf | Letters for known and unknown quantities in 1591; the vowel scheme was not adopted. |
| 9 | "François Viète" | Wikipedia | https://en.wikipedia.org/wiki/Fran%C3%A7ois_Vi%C3%A8te | Born 1540 Fontenay-le-Comte, died 1603 Paris; law at Poitiers; royal councillor to Henry III and Henry IV. |
| 10 | "Francois Viète" (student paper) | Rutgers University | https://sites.math.rutgers.edu/~cherlin/History/Papers2002/vieta.html | Corroborates 7-9 on the 1591 notation. |
| 11 | "La Géométrie" | Wikipedia | https://en.wikipedia.org/wiki/La_G%C3%A9om%C3%A9trie | Published 1637 as an appendix to the *Discourse on Method*; x, y, z for unknowns and a, b, c for knowns, replacing Viète's scheme. |
| 12 | "Earliest Uses of Symbols for Variables" | MacTutor (Jeff Miller's pages) | https://mathshistory.st-andrews.ac.uk/Miller/mathsym/variables/ | History of letters for unknowns; Descartes' usage not perfectly consistent. |
| 13 | Marble teaching-research records for the eight assigned targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy and misconceptions summarized in the spec's upstream check; the record for `mt_Yw27nweoTj` grounds dropping it. |
| 14 | Pinned topics and dependencies | `curriculum/marble/topics.json`, `dependencies.json` (this repo) | local | Ids, names, descriptions and hard prerequisites. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| al-Khwarizmi wrote the algebra in Baghdad, associated with the House of Wisdom under al-Ma'mun | 1, 2, 4 | Checked |
| Date around 820 to 830 (one source 825) | 1, 2 | Checked as a range; child text says "around the year 820" |
| No symbols: everything in words; the unknown is "thing" (*shay'*) | 1, 2 | Checked |
| "Algebra" comes from *al-jabr* in the title, via medieval Latin | 1, 2, 3 | Checked |
| *Al-jabr* is restoring; *al-muqabala* balancing | 2 | Checked (single detailed excerpt; widely repeated). Child text: "about restoring and balancing" |
| The book serves trade, inheritance (wills) and land measurement; longest part on legacies | 1, 5 | Checked |
| Indian influence in the mercantile chapter | 6 | Background only; not in child text |
| Viète, 1591, *In artem analyticem isagoge*, letters for unknown and known quantities | 7, 8, 10 | Checked |
| Vowels for unknowns, consonants for knowns; the vowel scheme did not last | 7, 8 | Checked |
| Viète a lawyer and royal councillor; 1540 to 1603 | 9 | Checked (single source for dates; child text gives only "trained as a lawyer and worked for French kings") |
| Descartes, *La Géométrie*, 1637, late letters for unknowns | 11, 12 | Checked (Keeper's note says "like x"; no claim of perfect consistency) |
| Algebra conventions and misconceptions | 13, 14 | Standard; math check still requested |

## Open checks

1. Re-read sources 1, 2 and 7 at the page (fetches were blocked) to confirm the excerpts, especially the 820-830 range and the vowel/consonant convention.
2. `[check]` none in child text. The word "logistica speciosa" for Viète's method was searched and not confirmed; it is kept out of all text.
3. Anchor choice: Diophantus' *Arithmetica* was considered and not used, since its dating and notation claims would need more sources than this pass could check.

## Target fit

- **Dropped:** `mt_Yw27nweoTj` *Estimating answers (age 13+)*. Its pinned description ("use graphs of linear and quadratic functions to estimate output values...") and Marble record are about graph reading, with Plotting Linear Graphs as its hard prerequisite. Estimating to check calculations stays as unclaimed support. The build-out map now assigns it to sibling spec 195, which claims it.
- **Kept with a note:** `mt_3qrCtdoVAU` *Simple formulae* is changing the subject; the pack covers one- and two-step linear rearrangements only. Subject in a denominator, under a root or appearing twice is outside the pack.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of tiles, rectangles and account books. No authentic portrait of al-Khwarizmi exists; any modern stamp or statue image would need its own license check, so do not depict him. Period portraits of Viète and Descartes are public domain in many collections; confirm per file. Facsimile pages of the 1591 *Isagoge* are held by libraries with open-access scans, to be confirmed per object. No photograph of a real child or real family appears.
