# Source audit 195: Lines and Graphs

Date: 2026-10-25. Spec: [195](../specs/195-lines-and-graphs.md). Companion: [195 text](../content/195-lines-and-graphs-text.md).

**Method.** Five web searches (WebSearch). Page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass. The algebra (tables to points, y = mx + c, gradient as rise ÷ run, constant differences for linear tables, solving two linear equations by graph, elimination and substitution, expanding two binomials, the parabola y = x² and its roots and symmetry, reading values off graphs) is standard school mathematics, cross-checked against the Marble teaching-research records and the pinned topic descriptions. All plan costs, press counts, sales, ad prices and bundle puzzles in problem items are **made-up labeled data**, verified by `check195.py` (116 checks, all passing; scratch area, not in the repo). Puzzles with unique answers were brute-forced over whole-number grids.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Nicole Oresme" | Stanford Encyclopedia of Philosophy | https://plato.stanford.edu/archives/spr2023/entries/nicole-oresme/ | Life dates; dean of Rouen 1364; elected bishop of Lisieux 1377, consecrated 1378; died 1382. |
| 2 | "Nicholas Oresme" | Encyclopaedia Britannica | https://www.britannica.com/print/article/431796 | Born about 1320 in Normandy; scholastic philosopher, economist and mathematician. |
| 3 | "Nicole Oresme" | Wikipedia | https://en.wikipedia.org/wiki/Nicole_Oresme | Birth about 1320-1325 near Caen; *Tractatus de configurationibus qualitatum et motuum*; velocity-time diagrams; the "invention of graphing" framing is a popular interpretation. |
| 4 | "Nicole Oresme" | Catholic Encyclopedia (catholic.com) | https://www.catholic.com/encyclopedia/nicole-oresme | Extent (longitude) along a base line, intensity (latitude) as perpendiculars; time as longitude and speed as latitude; the figure's area as the distance. |
| 5 | "Oresme, Nicole" | Encyclopedia.com (Dictionary of Scientific Biography) | https://www.encyclopedia.com/people/philosophy-and-religion/other-religious-beliefs-biographies/nicole-oresme | Corroborates 1-3; uniformly difform motion and the mean-speed result. |
| 6 | Di Liscia, on the *De latitudinibus formarum* | SCIAMVS 17 | https://www.sciamvs.org/files/SCIAMVS_17_055-120_DiLiscia.pdf | The short tract on latitudes was widely copied and is probably not by Oresme; kept out of child text. |
| 7 | "Fangcheng (mathematics)" | Wikipedia | https://en.wikipedia.org/wiki/Fangcheng_(mathematics) | Chapter 8 of *The Nine Chapters* is titled *fangcheng*, often rendered "rectangular arrays"; 18 problems, each a system of simultaneous linear equations; the procedure resembles Gaussian elimination; problem 1's three grain grades. |
| 8 | *The Chinese Roots of Linear Algebra* (Roger Hart) | Johns Hopkins University Press | https://press.jhu.edu/books/title/10232/chinese-roots-linear-algebra | Counting rods manipulated on a counting board; visual, algorithmic elimination. |
| 9 | Nine Chapters exhibit (Math 21b) | Harvard University Department of Mathematics | https://people.math.harvard.edu/archive/21b_spring_16/exhibits16/9chapters/index.html | Problem 1 of chapter 8 stated: 3, 2, 1 bundles give 39 *dou*; 2, 3, 1 give 34; 1, 2, 3 give 26. |
| 10 | "Chiu Chang Suann Jing / Examples / Example 5" | ProofWiki | https://proofwiki.org/wiki/Chiu_Chang_Suann_Jing/Examples/Example_5 | Answer: 9¼, 4¼ and 2¾ measures (re-checked by script). |
| 11 | "The Nine Chapters on the Mathematical Art" | Wikipedia | https://en.wikipedia.org/wiki/The_Nine_Chapters_on_the_Mathematical_Art | Compiled by about the first century CE; Liu Hui's commentary 263 CE (corroborates sibling 189's dating). |
| 12 | "Galileo on Projectiles" | University of Virginia (Galileo and Einstein course) | https://galileoandeinstein.phys.virginia.edu/tns244.htm | *Two New Sciences* (1638), Fourth Day: uniform horizontal plus naturally accelerated vertical motion gives a semi-parabola. |
| 13 | *Two New Sciences*, Fourth Day (transcription) | Spira Solaris | https://www.spirasolaris.ca/sbb6Fourth_Day.pdf | Theorem I, Proposition I: the projectile describes a semi-parabola. |
| 14 | Galileo's projectile work | Max Planck Institute for the History of Science | https://www.mpiwg-berlin.mpg.de/sites/default/files/migrated/p179.pdf | Fall distance grows with the square of time; with horizontal motion this gives the parabola. |
| 15 | Marble teaching-research records for the six targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy and misconceptions summarized in the spec's upstream check. |
| 16 | Pinned topic and dependency files | this repo, `curriculum/marble/` | local | Target ids, names, descriptions and hard prerequisites. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Oresme about 1320-1382, Normandy, later bishop of Lisieux | 1, 2, 3 | Checked (birth year varies 1320-1325; child text says "about 670 years ago" for the 1350s work, not his birth) |
| *Tractatus de configurationibus* in the 1350s; time along a base line, speed as heights; steady growth gives a slanting straight edge; area gives distance | 3, 4, 5 | Checked |
| "Oresme invented graphs" | 3 | Not used: a popular framing, not settled |
| The short *De latitudinibus formarum* as Oresme's | 6 | Not used: probably not his |
| *Nine Chapters* chapter 8 is *fangcheng*, "rectangular arrays", 18 problems of simultaneous linear equations, solved with counting rods in columns | 7, 8 | Checked |
| Chapter 8 problem 1: 39, 34, 26 *dou*; top bundle 9¼ | 7, 9, 10 | Checked (numbering differs in one MAA list; problem and answer agree) |
| Book compiled about 2,000 years ago | 11 | Checked (first century CE); matches sibling 189 |
| Whole book has 246 or 288 problems | 7, CERME paper | Unsettled; not used anywhere |
| Galileo, *Two New Sciences*, 1638: a ball rolled off a table falls along part of a parabola | 12, 13, 14 | Checked (child text: "part of a parabola"; keeper's note: "half of an upside-down U") |
| Galileo's parabola ideas predate 1638 by decades | search excerpt (art history site) | Not used: contested |
| Algebra conventions (gradient, intercept, elimination, expansion, roots, symmetry) | 15, 16 | Checked (standard; math check still requested) |

## Open checks

None in child text. For the second pass: re-read source 4's wording on the area as distance at a primary source or the Stanford entry, and confirm the Harvard exhibit's problem text (source 9) at the page itself.

## Rights notes for images

No images are embedded. For build art, prefer original drawings. If a real image is wanted: manuscript pages of Oresme's treatise and early printed editions of *Two New Sciences* (1638) are public domain, but each photograph's license must be checked (Wikimedia Commons or library open-access collections). Counting-rod drawings should be original. No photograph of a real child or real family appears.

## Overlap and claim notes

- Sibling 187 uses Descartes' *La Géométrie* (1637); this pack does not, to avoid a duplicate card.
- Sibling 189 uses *The Nine Chapters*' red and black rods; this pack's H2 uses the same chapter's elimination method and names the link.
- Sibling 193 previews "two rules, one pair" by table only; this pack starts there and owns graphs and methods. Sibling 193 dropped `mt_Yw27nweoTj`; the coordinator reassigned it here on 2026-10-25.
- Spec 120's Act IV has three plans (the Wall, the Sponge, Some of Each) and no official answer. This pack graphs the cost of two; review (2026-10-25) added the third plan by name to Scene 1, its Keeper's note, the plans mode's ending note and B6, so the graph never reads as the whole choice.
