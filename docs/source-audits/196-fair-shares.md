# Source audit 196: Fair Shares

Date: 2026-10-25. Spec: [196](../specs/196-fair-shares.md). Companion: [196 text](../content/196-fair-shares-text.md).

**Method.** Nine web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). One search was in Chinese, to confirm the names of *The Nine Chapters*' fraction rules. The mathematics (equal parts as equal area; fractions of sets and amounts; a/b = a ÷ b; unit-fraction iteration on a number line; comparison by part size, benchmarks and common denominators; measuring to the nearest quarter inch; line plots) is standard school mathematics, cross-checked against the IES fractions practice guide and the Common Core 3.NF and 4.NF standards already cited by spec 43. All pies, buns, loaves, recipes, prices, breadstick lengths and jug amounts in items are **made-up labeled data**, verified by `check196.py` (110 checks, all passing; scratch area, not in the repo). Child text was checked by `style196.py` (172 checks, 0 problems; 0 em-dashes in all three files).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Rhind Mathematical Papyrus" | Wikipedia | https://en.wikipedia.org/wiki/Rhind_Mathematical_Papyrus | Copied by Ahmes about 1550 BCE from an older text; bought by Rhind in Luxor 1858; British Museum 1865; first six problems divide loaves among 10 men; small fragments in the Brooklyn Museum. |
| 2 | "Mathematics in ancient Egypt" | Encyclopaedia Britannica | https://britannica.com/topic/mathematics/Mathematics-in-ancient-Egypt | Problem 3, "to divide 6 loaves among 10 men", answer 1/2 + 1/10. |
| 3 | Eves, *Introduction to the History of Mathematics*, ch. 2 notes | East Tennessee State University (course notes) | https://faculty.etsu.edu/gardnerr/3040/Notes-Eves6/Eves6-2-8.pdf | Loaf counts 1, 2, 6, 7, 8, 9 in problems 1-6, solved with a table of tenths; answers 1/10, 1/5, 1/2 + 1/10, 2/3 + 1/30, 2/3 + 1/10 + 1/30, 2/3 + 1/5 + 1/30 (each sum checked by script). |
| 4 | "Ahmes" | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Ahmes/ | Ahmes as copyist from an earlier work of about 2000 BCE; gives 1863 for the British Museum (conflicts with 1865; child text gives no year). |
| 5 | "Rhind Mathematical Papyrus 2/n table" | Wikipedia | https://en.wikipedia.org/wiki/Rhind_Mathematical_Papyrus_2/n_table | The recto table of 2/n for odd n up to 101; 2/5 = 1/3 + 1/15. |
| 6 | "The Egyptian 2/n table" | Clark University (D. Joyce) | https://mathcs.clarku.edu/~djoyce/ma105/2byn.html | Corroborates 5; 2/3 treated as a special case, written in the table as 1/2 + 1/6. |
| 7 | "Egyptian Unit Fractions" | MathPages | https://www.mathpages.com/home/kmath340/kmath340.htm | Fractions written as sums of distinct unit fractions, 2/3 excepted. |
| 8 | "Egyptian fraction" | Wikipedia | https://en.wikipedia.org/wiki/Egyptian_fraction | "Horus-Eye fractions" named after a now-discredited theory linking the hekat fractions to parts of the eye symbol. |
| 9 | "The Eye of Horus" (class note) | SUNY Oswego | https://www.cs.oswego.edu/~dab/310/classes/horus.html | The 63/64 and Thoth anecdote traced to Ifrah (1987), a secondary retelling. |
| 10 | "The Nine Chapters on the Mathematical Art" | Wikipedia | https://en.wikipedia.org/wiki/The_Nine_Chapters_on_the_Mathematical_Art | Chapter 1 *Fangtian* (bounding fields) with field areas and fraction manipulation; compiled over centuries, final form about the 1st century CE. |
| 11 | "Nine chapters on the Mathematical Art" | MacTutor | https://mathshistory.st-andrews.ac.uk/HistTopics/Nine_chapters | Chapter 1 gives rules for operations on fractions; Liu Hui's commentary of 263 analyses the procedures to give the reader confidence in them. |
| 12 | Paper on *Nine Chapters* fraction algorithms and primary-school fraction teaching | Kyoto University Research Information Repository (RIMS Kôkyûroku 1787-24) | https://repository.kulib.kyoto-u.ac.jp/dspace/bitstream/2433/172763/1/1787-24.pdf | Consecutive Chapter 1 rules *yuefen* (reducing), *hefen* (adding), *jianfen* (subtracting) and *kefen* (comparing two fractions: which is larger, and the difference). |
| 13 | "Liu Hui" | Encyclopedia.com (*Dictionary of Scientific Biography*) | https://www.encyclopedia.com/science/encyclopedias-almanacs-transcripts-and-maps/liu-hui | Liu Hui as the 3rd-century commentator (corroborates 11). |
| 14 | *Developing Effective Fractions Instruction for K-8* (practice guide) | Institute of Education Sciences | https://ies.ed.gov/ncee/WWC/PracticeGuide/15/Published | Build on sharing; fractions as numbers on number lines; comparison strategies. Already cited in spec 43. |
| 15 | Common Core 3.NF and 4.NF; 3.MD.4 | Common Core State Standards | https://www.thecorestandards.org/Math/Content/3/NF/ | Unit fractions, number lines, comparing with same numerator or denominator, benchmarks; measuring to halves and quarters of an inch with line plots. Studied, not copied. |
| 16 | Marble teaching-research records for the 21 assigned ids | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check; the reason to drop `mt_9KmVWCuh5_`. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Rhind papyrus copied by Ahmes about 1550 BCE from an older text | 1, 4 | Checked ("about 3,500 years ago" in child text) |
| Most of it in the British Museum; acquired 1865 (MacTutor: 1863) | 1, 4 | Location checked; year unsettled, so child text gives none |
| Problems 1-6 share 1, 2, 6, 7, 8, 9 loaves among 10 men | 1, 2, 3 | Checked |
| Problem 3: 6 loaves among 10, each 1/2 + 1/10 | 2, 3 | Checked (sum verified by script; re-confirmed by independent review search of Britannica and Eves excerpts, 2026-10-25) |
| Fractions written as sums of different unit fractions, 2/3 a special case | 5, 6, 7 | Checked |
| 2/n table gives 2/5 = 1/3 + 1/15 | 5, 6 | Checked |
| 2/3 had its own written sign | none | `[check]`: not confirmed by these excerpts; kept out of child text and the spec |
| "Eye of Horus" fractions are a later, discredited theory | 8, 9 | Checked; the story is left out of child text entirely |
| *Nine Chapters* about 2,000 years old; Chapter 1 *Fangtian* holds fraction rules | 10, 11 | Checked |
| Liu Hui's commentary, 263 CE, explains why the methods work | 11, 13 | Checked |
| A named rule (*kefen*) compares two fractions: which is larger and by how much | 12 | Checked from one scholarly excerpt; second pass to confirm in Shen, Crossley and Lun's translation |
| The book's example compares 5/8 and 16/25 (16/25 larger by 3/200) | none | `[check]`: arithmetic verified by script; the attribution to the book is unverified, so it stays out of child text |
| The *kefen* method works by cross-multiplying (a common denominator) | none | `[check]`: plausible from the parallel adding and subtracting rules; not in child text |
| Teaching conventions (equal area, number line as magnitude, comparison strategies, quarter-inch line plots) | 14, 15, 16 | Checked (standard; math check still requested) |

## Anchor choice

Three candidate anchors were offered: Egyptian unit fractions and the Eye of Horus measures, the Rhind papyrus 2/n table, and the *Nine Chapters* fraction rules. The Rhind papyrus was taken for its loaf problems, which are literally fair shares of bread among ten people and model a/b = a ÷ b; the 2/n table appears only in the Keeper's note. The *Nine Chapters* was taken for its comparison rule, which matches the Comparing Shelf and adds a second culture. The Eye of Horus was rejected: the grain-measure fractions are real (they divide a hekat), but the link to the eye is a modern, discredited story often retold as fact, and a child card would spread it.

## Open checks

1. *Kefen* wording and the book's own example (5/8 and 16/25) against a translation; not in child text.
2. Whether 2/3 had its own hieratic sign; not in child text.
3. British Museum acquisition year (1865 or 1863); not in child text.
4. Route: changed in review from `#cafe/shares` to `#cafe/pies` (free on main and drafts) so it cannot be read as spec 43's `#cafe/sharing`.
5. Nuria's Spanish lines, *¡Hola desde Vadoalto!* and *Un abrazo*, for a fluent reader (spec 120 rule).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of pies, tarts, buns and the brass line. The Rhind papyrus has British Museum photographs; check each image's license before use (the museum's own terms vary by image), or draw a simple scroll instead. No *Nine Chapters* page image is needed. No photograph of a real child or real family appears.
