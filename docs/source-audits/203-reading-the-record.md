# Source audit 203: Reading the Record

Date: 2026-10-25. Spec: [203](../specs/203-reading-the-record.md). Companion: [203 text](../content/203-reading-the-record-text.md).

**Method.** Six web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (sorting and counting, two-way tables, durations counted in base 60, scaled bar charts and pictogram keys, grouped classes with inequality notation, line graphs and straight-line estimates, pie-chart angles as count ÷ total × 360°, median, range, the mean's sensitivity to outliers, scatter graphs, lines of best fit balanced by eye, interpolation and extrapolation, association and cause) is standard school statistics; it was cross-checked against the pinned Marble research records for the ten targets (paraphrased, not copied) and needs the independent math check. Every count, time, length, reading, trip and river-chart point in the pack is **made-up labeled data**, except the flood ledger and the big-rain counts, which are copied from spec 120's own fiction (draft PR #127). All numbers are verified by `check203.py` (124 checks, all passing; scratch area, not in the repo).

**Anchor choice.** The assignment suggested Playfair, Nightingale and the Nilometer. The Nilometer was set aside: draft spec 134, *The Nile Year* (#137), already builds a nilometer stair with Pliny's scale. The Babylonian Astronomical Diaries replace it as a non-European long river record. The Ishango bone was considered for tallies and not used, because its readings are contested (sibling spec 190 reached the same view).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Babylonian astronomical diaries" | Wikipedia | https://en.wikipedia.org/wiki/Babylonian_astronomical_diaries | Cuneiform texts in Akkadian, about 652 BC to 61 BC; organized in monthly sections; most tablets fragmentary. |
| 2 | "Astronomical Diaries" | Livius.org | https://www.livius.org/articles/concept/astronomical-diaries/ | At the end of each month the Diaries report the level of the Euphrates and the current prices of barley, dates, mustard (?), cress (?), sesame and wool; weather noted through each month. |
| 3 | "Observational texts" | CDLI wiki, University of Oxford | https://cdli.ox.ac.uk/wiki/observational_texts | Changes in the level of the Euphrates recorded (corroborates 2). |
| 4 | *Astronomical Diaries and Related Texts from Babylonia* | Austrian Academy of Sciences Press | https://verlag.oeaw.ac.at/en/product/astronomical-diaries-and-related-texts-from-babylonia/99200690 | Standard edition (Sachs and Hunger). |
| 5 | KAKEN project abstract on prices, weather and Euphrates levels | KAKEN (Japan) | https://kaken.nii.ac.jp/grant/KAKENHI-PROJECT-12610378 | Scholars compare the diaries' prices and river levels (background only; not used in child text). |
| 6 | "William Playfair" | Wikipedia | https://en.wikipedia.org/wiki/William_Playfair | *Commercial and Political Atlas* (1786) with line charts of trade; bar chart of Scotland's trade with 17 countries for one year, drawn because time-series data were lacking; 1801 first pie chart and circle graph for part-whole relations. |
| 7 | "Masters series: William Playfair" | Flourish | https://flourish.studio/blog/masters-william-playfair-father-of-statistical-graphics/ | Line charts look much like modern ones; Scotland bar chart covers Christmas 1780 to Christmas 1781 (corroborates 6). |
| 8 | "The Scottish scoundrel who changed how we see data" | Atlas Obscura | https://www.atlasobscura.com/articles/the-scottish-scoundrel-who-changed-how-we-see-data | 1801 pie chart of the Turkish (Ottoman) Empire's lands split by continent, hand-colored. |
| 9 | "Pie chart" | Wikipedia | https://en.wikipedia.org/wiki/Pie_chart | Playfair's *Statistical Breviary* (1801) is the earliest known pie chart; Nightingale often wrongly credited. |
| 10 | Playfair, Chart of all the Imports and Exports to and from England, 1700 to 1782 | AnyChart blog; David Rumsey Map Collection | https://www.anychart.com/blog/?p=1408 | Two time-series lines with the balance shaded between them (supports "lines showed money going up and down over years"). |
| 11 | "Nightingale's Rose Diagram" | Lehigh University Libraries exhibit | https://exhibits.lib.lehigh.edu/exhibits/show/data_visualization/science/nightingale | Diagram published in the 1858 *Notes on Matters Affecting the Health, Efficiency, and Hospital Administration of the British Army* and sent to Queen Victoria. |
| 12 | "Lady with the diagram" | Eye Magazine | https://www.eyemagazine.com/feature/article/lady-with-the-diagram | Twelve equal sectors, one per month; blue for preventable or mitigable zymotic disease, red for wounds, black for all other causes. |
| 13 | "Florence Nightingale understood the power of visualizing science" | Science News | https://www.sciencenews.org/article/florence-nightingale-birthday-power-visualizing-science | Wedge areas stand for deaths; looks like a pie chart but shows change over time; aim was sanitation reform. |
| 14 | "Designing War-Care" | American University | https://edspace.american.edu/visualwar/?p=85 | Title "Diagram of the Causes of Mortality in the Army in the East"; disease deaths far exceed wounds. |
| 15 | Marble teaching-research records for the ten targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy and misconceptions summarized in the spec's upstream check, including the two records whose content differs from their topic name. |
| 16 | Spec 120 flood ledger (page 2) and letter 4 (Nuria's big rains) | This repository, draft PR #127 | `docs/content/120-keeper-of-the-ways-text.md`, `docs/content/120-story/letters.md` | Story numbers reused unchanged: floods in years 4, 15, 27, 31, 34, 36, 38 (40 to 140 cm); big rains 6, 5, 6, 8 by decade. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Babylonian diaries span about 652 to 61 BCE ("about 600 years, ending about 2,000 years ago") | 1, 4 | Checked (script: 591 years; 61 BCE is about 2,086 years before 2026) |
| Each month they record the Euphrates level, prices including barley and dates, and weather | 1, 2, 3 | Checked; child text names only barley and dates (the identifications of mustard and cress are uncertain) |
| Most tablets are fragments | 1, 4 | Checked |
| Playfair's 1786 *Atlas* printed line charts of trade over years | 6, 7, 10 | Checked |
| Playfair's bar chart: Scotland's trade with 17 partners, one year, because he lacked a run of years | 6, 7 | Checked; bar count (34) differs between summaries, so child text says "17 places" and gives no bar count |
| 1801 *Statistical Breviary*: first known pie chart | 6, 8, 9 | Checked as "generally credited"; child text says "what may be the first pie chart" |
| Nightingale's diagram in the 1858 *Notes*, sent to Queen Victoria | 11, 14 | Checked |
| One wedge per month; blue preventable disease, red wounds, black other causes; area stands for deaths | 12, 13 | Checked; child text says "area, not length" and avoids calling it a pie chart |
| Her charts helped change how army hospitals were run | 11, 13, 14 | Checked as summarized by several sources; kept general, no numbers in child text |
| "Ten times more soldiers died of disease than wounds" | search excerpt only | `[check]`; not used in child text |
| Pie-chart method, 360 ÷ count error, classes with inequality notation, median robustness, line-of-best-fit balance, extrapolation caution | 15 | Checked against research records; standard; math check still requested |

## Open checks

1. Exact figures on Nightingale's diagram (the "ten times" claim) stay out of child text until read in a primary or scholarly source.
2. Whether the Scotland bar chart appeared in every edition of the *Atlas* (one catalog note says it was dropped from the third). Child text says only "one chart used bars" in the 1786 book.
3. The math check, especially the two research records that do not match their topic names (spec review ask 3).

## Rights notes for images

No images are embedded. For build art, prefer original drawings. Playfair's 1786 and 1801 plates and Nightingale's 1858 diagram are public domain and have scans on Wikimedia Commons and in library collections (check each file's stated license and source). Diary tablets are held by the British Museum, whose online images carry their own terms; use an original drawing unless a specific openly licensed photograph is cleared. No photograph of a real child or real family appears, and the Gazette poll names no real person.

## Number and style receipts

- `check203.py`: 124 checks passing, including both ways to find the hidden box, the timetable's identical legs, the line's balance (4 above, 4 below, 1 on), least squares slope 0.77 and r = 0.997 on the usual days, and that every non-flood reading stays below the ledger's 40 cm flood cut.
- `style203.py` on the companion: 0 em-dashes; 15 teach cards (longest 28 words); 35 prompts (longest 15); 142 hints, explanations and feedback lines (longest 16); 12 scene blocks within their limits; "wrong" absent from child text; Hollis named only in the Act IV and Act V scenes.
- `balance203.py`: 35 items; 24 three-choice with the right answer at A, B and C eight times each.
