# Source audit 194: Ribbon Patterns

Date: 2026-10-25. Spec: [194](../specs/194-ribbon-patterns.md). Companion: [194 text](../content/194-ribbon-patterns-text.md).

**Method.** Five web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The math (repeating units, growing patterns, term-to-term and position-to-term rules, the nth term of an arithmetic sequence with its zeroth term, membership by solving for a whole position, arithmetic and geometric classification, the multiplication principle for two-category listing, unordered pairs, compositions of n into 1s and 2s) is standard school and undergraduate discrete mathematics; it was checked by script rather than by citation. All gates, ribbons, posts, stashes, outfits and rules in problem items are **made-up labeled data**, verified by `check194.py` (86 checks, all passing; scratch area, not in the repo). The Marble research records for the eight targets were read at `7bd8b67` and paraphrased.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Acharya Hemchandra" (biography) | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Hemchandra/ | Hemachandra's argument that f(n) = f(n − 1) + f(n − 2) for meters; Gopala studied the numbers about 1135; Indian work on the rule as early as the 7th century. |
| 2 | A000045 (Fibonacci numbers) | OEIS Foundation | https://oeis.org/A000045 | Knuth's account: rhythms with n beats number F(n + 1); Gopala (before 1135) and Hemachandra (c. 1150) listed 1, 2, 3, 5, 8, 13, 21 explicitly; "Hemachandra numbers" as a name. |
| 3 | "Fibonacci or Hemachandra Numbers" | varnam.org | https://www.varnam.org/2004/10/20/fibonacci_or_hemachandra_numbe | Quotes the same Knuth passage (corroborates 2). |
| 4 | "Pingala" | Wikipedia | https://en.wikipedia.org/wiki/Pingala | Pingala's *Chandahshastra*; light and heavy syllables; dating uncertain (roughly 3rd-2nd century BCE). |
| 5 | Dynamic programming lecture notes (CS 473) | University of Illinois | https://courses.grainger.illinois.edu/cs473/fa2024/notes/03-dynprog.pdf | Virahanka: meters of n beats = meters of n − 1 plus meters of n − 2; modern Fibonacci numbers use the same rule with other starting values. |
| 6 | "The Virahanka-Fibonacci and related sequences" (Kak) | eSamskriti (PDF) | https://www.esamskriti.com/essays/pdf/The_Virahaka_Fibonacci_and_Related_Sequ.pdf | Sequence implicit in Pingala; Virahanka's dating. |
| 7 | "Fibonacci" course page | Stony Brook University | https://math.stonybrook.edu/~tony/archive/118s13/fibonacci.html | *Liber Abaci* (1202) rabbit problem, chapter 12; totals 2, 3, 5 ... 377. |
| 8 | "Rabbit Problem" and "Rabbit Problem/Solution" | ProofWiki | https://proofwiki.org/wiki/Rabbit_Problem/Solution | Rules of the puzzle (no deaths; pairs breed monthly from their second month); 377 pairs at the year's end. |
| 9 | "Fibonacci's Bunny Problem" | Northern Kentucky University course page | https://nku.edu/~longa/classes/mat305/days/fibonacci.bunny.html | The text's own answer of 377; the puzzle is not zoology. |
| 10 | "Jia Xian" (biography) | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Jia_Xian/ | Jia Xian (11th century); his books lost; known through Yang Hui; the triangle in the reconstructed text. |
| 11 | "Pascal's triangle" | Encyclopaedia Britannica | https://britannica.com/science/Pascals-triangle | Jia Xian's triangular arrangement (11th century); studied and popularized by Yang Hui (13th century); Zhu Shijie 1303. |
| 12 | "The History of Pascal's Triangle" | Utah State University course page | https://5010.mathed.usu.edu/Fall2022/EHumes/history.html | Yang Hui's 1261 book with the triangle, crediting Jia Xian; al-Karaji's lost book; Omar Khayyam; the name "Khayyam's triangle" in Iran. |
| 13 | "Zhu Shijie" (biography) | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Zhu_Shijie/ | *Siyuan yujian* (Jade Mirror of the Four Unknowns), 1303. |
| 14 | MAA Convergence pages on Zhu Shijie's diagram | Mathematical Association of America | https://old.maa.org/node/1409906 | The 1303 diagram credited to "ancient techniques", traced to Jia Xian; named after Blaise Pascal (1623-1662) centuries later. |
| 15 | "Pascal's Triangle and its Secrets" | The Aperiodical | https://aperiodical.com/2021/12/pascals-triangle-and-its-secrets-introduction/ | General history (corroborates 11, 12). |
| 16 | Marble teaching-research records for the eight targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Indian prosody counted meters of short and long syllables; counts follow "add the two before" | 1, 2, 4, 5 | Checked |
| Gopala (before 1135) and Hemachandra (about 1150) listed 1, 2, 3, 5, 8, 13, 21 | 1, 2, 3 | Partly checked: the explicit list rests on one account (Knuth, quoted in OEIS); Wikipedia credits Hemachandra with the rule. Review softened child text to "Hemachandra wrote the rule" (about 1150) and Gopala "wrote about it a little earlier" |
| Virahanka stated the rule earlier; dating 6th-8th century CE | 5, 6 | Checked as "dates uncertain"; spec only, not in child text |
| Pingala's dating (roughly 3rd-2nd century BCE) and how explicit the numbers are in his text | 4, 6 | Unsettled; spec only, as "the setting goes back to Pingala" |
| *Liber Abaci*, 1202, Leonardo of Pisa; rabbit puzzle; rules; 377 pairs | 7, 8, 9 | Checked; 377 reproduced by script |
| Jia Xian (11th century) devised the triangle; works lost; known through Yang Hui | 10, 11, 12 | Checked |
| Yang Hui's book dated 1261 | 12 | `[check]`: one course page; Britannica says only "13th century". Child text says "in the 1200s" |
| Zhu Shijie's *Jade Mirror*, 1303, draws the triangle as an old method | 11, 13, 14 | Checked; spec only |
| Al-Karaji described the triangle about 1000 in a lost work, later reproduced by Omar Khayyam | 12, 15 | `[check]`: popular secondary sources only; spec only, not in child text |
| Named in Europe after Blaise Pascal | 11, 14 | Checked (no dates in child text; Pascal's treatise dates not searched) |
| Kente and other weaving as repeating units | none | Not used: not searched to a verifiable standard, left out |

## Open checks

1. Yang Hui's 1261 date in a scholarly source (for example Martzloff, *A History of Chinese Mathematics*). Not in child text.
2. Al-Karaji's role and date in a scholarly history of mathematics in the Islamic world. Not in child text.
3. A reader of Sanskrit prosody history to confirm the H1 wording "counted the rhythms they could make from short and long beats" is fair to *mātrā* meters, and that naming Hemachandra and Gopala (not Pingala) is the right emphasis.
4. Second pass: re-read MacTutor (Hemchandra, Jia Xian) and Britannica at the source once fetches work.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the gate, ribbons and grids. If a real image is wanted: the 1303 *Jade Mirror* triangle page is a widely reproduced public-domain image (check the specific file's license on Wikimedia Commons); manuscript pages of *Liber Abaci* are held by Italian libraries with their own reproduction terms, to be confirmed per image. No photograph of a real child or real family appears.

## Notes on the dropped targets

`mt_DW2D1c0fKx` (*Shape patterns*, age 6-7) and `mt_FAXjFkgG6X` (*Shape patterns (age 7+)*) were assigned to this pack. Their pinned descriptions and evidence ask for deliberate use of commutativity, +10 and +100 place-value columns, multiplication fact families from one array, and classifying shapes by properties; their Marble research records contain no sequence or pattern-continuation work. They are returned unclaimed rather than claimed on a partial fit; the build-out map now assigns both to sibling spec 204.
