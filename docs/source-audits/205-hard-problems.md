# Source audit 205: The Problem Shelf

Date: 2026-10-25. Spec: [205](../specs/205-hard-problems.md). Companion: [205 text](../content/205-hard-problems-text.md).

**Method.** Six web searches by the writer, plus two at independent review (2026-10-25) for the replacement Fermi card (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (inverse checks, estimation, factor and multiple, index notation, square and cubic units, expression / equation / formula, circle parts, the distributive property, fraction-decimal-percent equivalents, ratio parts, the quadrilateral hierarchy, rounding in context, mean of a small data set) is standard school mathematics and needs only the math check. Pedagogy follows the pinned Marble teaching-research records for the fifteen targets (paraphrased, not copied). All prices, trades, trips, populations and apple counts are **made-up labeled data**, verified by `check205.py` (77 checks, all passing; scratch area, not in the repo) and independently by the reviewer's `review204_205.py`. B6, B7 and D5's unique solutions are brute-force checked.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "How to Solve It" | Wikipedia | https://en.wikipedia.org/wiki/How_to_Solve_It | Published 1945; four phases: understand the problem, devise a plan, carry out the plan, look back; heuristics such as working backwards. |
| 2 | "George Pólya's Four Steps to Problem Solving" | University of San Diego (course page) | https://home.sandiego.edu/~pmyers/foursteps.htm | The four steps and their guiding questions ("Do you know a related problem?"). |
| 3 | "How to solve it" | Plus Magazine, University of Cambridge | https://plus.maths.org/content/how-solve-it | Corroborates the four phases and "look back" as checking and reuse. |
| 4 | "George Pólya" | Wikipedia | https://en.wikipedia.org/wiki/George_P%C3%B3lya | ETH Zürich 1914-1940; Stanford University 1940-1953; *How to Solve It* sold over a million copies. |
| 5 | George Polya papers, 1884-1985 | Stanford University Libraries | https://purl.stanford.edu/yy107nn3487 | Pólya joined Stanford's mathematics department (1942 in this archive's wording; see open check 2). |
| 6 | "Pólya: How to solve it, Preface" | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Extras/Polya_How_to_solve_it/ | Preface dated Stanford University, 1 August 1944; Princeton University Press published it after others declined. |
| 7 | Penguin reissue sample (copyright page) | Penguin | https://cdn.penguin.co.uk/dam-assets/books/9780140124996/9780140124996-sample.pdf | First published in the USA by Princeton University Press, 1945. |
| 8 | "The Nine Chapters on the Mathematical Art" | Wikipedia | https://en.wikipedia.org/wiki/The_Nine_Chapters_on_the_Mathematical_Art | Composed by several generations of scholars from the 10th to 2nd century BCE, latest stage 2nd century CE; Liu Hui's commentary with a method for π. |
| 9 | "Nine Chapters on the Mathematical Art" | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/HistTopics/Nine_chapters | Chapter contents with problem counts per chapter (exchange of goods, canals and dykes, taxation). |
| 10 | "Liu Hui" | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Liu_Hui/ | Commentary date 263 CE comes from a later work; Liu did not date it himself. |
| 11 | MAA HOMSIGMAA student paper (Ferguson, 2021) | Mathematical Association of America | https://old.maa.org/sites/default/files/images/upload_library/46/HOMSIGMAA/2021-Megan%20Ferguson.pdf | Format of problems, answers and methods (*shu*); compiled most likely in the Former Han, first century BCE. |
| 12 | "Gems of Chinese Classics" entry | QQ Reading | https://m.abook.qq.com/read/1036212388/11 | Traditional chapter titles (Rectangular Fields, Millet and Rice, Proportional Distribution, and others); problem, procedure, answer layout. |
| 13 | "Cinema, Fermi problems, & general education" | arXiv (physics/0608058) | https://arxiv.org/abs/physics/0608058 | Fermi, a professor at the University of Chicago, was known for asking students seemingly impossible questions and showing them they could answer them; such questions came to be called Fermi problems. |
| 14 | "Fermi Questions" event page | Science Olympiad | https://www.soinc.org/node/825 | Science Olympiad runs a Fermi Questions event: fast, rough estimates of quantities hard or impossible to measure directly. |
| 15 | Fermi Questions rules (2021) | North Carolina Science Olympiad | https://ncscienceolympiad.ncsu.edu/wp-content/uploads/2020/09/FERMIQUESTIONS21Final.pdf | Answers are written as a power of ten (exponent only). Rules vary by year; child text gives no rule detail beyond "the right size, as a power of ten". |
| 16 | "A Fermi Problem" | The Math Doctors | https://www.themathdoctors.org/?p=1404 | Piano-tuner question attributed to Fermi; used to teach estimation (secondary; see claims). Corroborates the Chicago teaching story. |
| 17 | Marble teaching-research records for the fifteen targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy, constraints and misconceptions summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Pólya's *How to Solve It*, 1945, Princeton University Press | 1, 6, 7 | Checked |
| Four steps: understand, plan, carry out, look back | 1, 2, 3 | Checked |
| Pólya was a mathematician at Stanford University | 4, 5, 6 | Checked (start year 1940 vs 1942 differs; no year in child text) |
| *Nine Chapters* finished in Han dynasty China, about 2,000 years ago | 8, 11 | Checked (dating varies from first century BCE to second century CE; "about 2,000 years ago" covers both) |
| Problems given with answers and methods; topics include fields, grain, fair shares, taxes, canals | 9, 11, 12 | Checked |
| Liu Hui's later notes explain why the methods work; commentary 263 CE | 8, 10 | Checked for the notes; the 263 date is traditional (from a later record), so child text says "much later" |
| The book holds 246 problems | none found | `[check]`; not in child text |
| Enrico Fermi was a scientist who taught at the University of Chicago | 13, 16 | Checked |
| He asked students questions that seemed impossible and showed them how to break them into pieces | 13, 16 | Checked (secondary accounts; phrased as a teaching habit, no quoted question) |
| School science teams in the US answer Fermi questions in contests, giving the right size as a power of ten | 14, 15 | Checked (Science Olympiad event; scoring detail varies by year) |
| The Trinity-test paper estimate | n/a | Removed at independent review (2026-10-25): a weapons anchor is not used in a children's game. |
| The piano-tuner question was Fermi's | 16 | Traditional attribution only, no primary record; not used in child text |
| Questions answered by breaking them into guessable pieces are called Fermi problems | 13, 16 | Checked |
| The Archimedes crown story | n/a | Considered and not used (a legend from Vitruvius; three anchors already) |

## Open checks

1. *Nine Chapters* problem count (246 is widely quoted but not confirmed in this session's excerpts). Not in child text.
2. Pólya's Stanford start year: 1940 (Wikipedia) or 1942 (Stanford archive wording). Not in child text.
3. Re-read sources 13-15 at the page in the second pass (search excerpts only this session).

## Rights notes for images

No images are embedded. For build art, prefer original drawings: a shelf of paper slips, a plan card, a shape-family chart. Pages of the *Nine Chapters* in later printed editions are public domain as old texts, but each scan's license must be checked. H3 needs no image (a chalkboard of guesses would do; no Fermi portrait is required). Pólya portraits are under various licenses; check each before use. No photograph of a real child or real family appears.

## Pedagogy notes (Marble research, paraphrased)

- Multi-step records (four ages) agree: teach structure, never keywords; estimate before and check after by an inverse or another method; make switching representation normal; worked examples are references to be followed by independent work; scored items cannot show planning, so the Plan Card's boxes and lists carry that and nothing is scored.
- The complex-problems record warns against teaching "over 100% is always impossible"; B4's feedback keeps the 2.5-jugs case.
- The justification record centers error analysis (find the first faulty step), since/therefore chains, convincing a doubter, one example as non-proof, and scribing talk without scoring it; C4 is spoken and unstored, and Convince Corner never marks a chain.
- Precision records pair each convention with its reason (area counts squares; pm belongs only to 12-hour time; the raised 2 counts factors; "=" decides expression vs equation).
- Tool records frame the calculator as a checker and require naming each tool's limit; the upper record says not to reteach long division, only the judgement of when to use it.
- Structure records: look for a known structure first; a split shares the multiplier with every part; no "add a zero" rule; category facts flow down the shape hierarchy, not up.
- The *Understanding fractions (age 10+)* record (`mt_9KmVWCuh5_`) is representation fluency: build the equation on the bar, map each symbol, read = relationally, and name what a grid point means. T18 and B7 follow it with new numbers (the record's own equation is not used); its pie-chart strand is narrowed out.
- Modelling records: return answers to the quantity asked, in its unit; scale multiplicatively; include a round-up, a round-down and an exact case so the story, not a rule, sets the direction.
