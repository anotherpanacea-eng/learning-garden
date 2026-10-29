# Source audit 185: Fences and Plots

Date: 2026-10-25. Spec: [185](../specs/185-fences-and-plots.md). Companion: [185 text](../content/185-fences-and-plots-text.md).

**Method.** Nine web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The math (area as a count of unit squares with no gaps or overlaps; rectangle area as rows × squares in a row and length × width; the distributive property shown by splitting a rectangle; additivity of area for rectilinear shapes; perimeter as the sum of boundary sides; independence of area and perimeter) is standard school mathematics, cross-checked against the US Common Core wording and UK teaching resources below. All plots, fields, fences and side lengths in problem items are **made-up labeled data**, verified by `check185.py` (71 checks, all passing; scratch area, not in the repo), including cell-by-cell area and edge counts for every compound shape and brute-force uniqueness for puzzles P1 and P2. Pedagogy follows the Marble teaching-research records for the nine targets (paraphrased, not copied).

**Independent review, 2026-10-25.** A reviewer re-ran every number with an independent script (`rcheck.py`, `python3 -I`, scratch area; all passing) and re-searched the anchors (search excerpts only; fetches blocked). Herodotus 2.109 (Perseus excerpts: equal plots, taxed yearly, men sent to measure the loss, the Greeks learned land measuring from this, given as his opinion) and the Menna rope-measuring scene (MAA *Convergence* and ARCE excerpts; Sheikh Abd el-Qurna) are confirmed. New item B7 (pond: 10 whole + 4 half-or-more = about 14 m²) is made-up data.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | Herodotus, *Histories* 2.109 (English translations, Godley and others) | Perseus / Perseids | https://fgh.perseids.org/read/greekLit/tlg0016/tlg001/perseus-eng2/2.109.1-2.109.3 | A king (Sesostris) gave each Egyptian an equal plot and taxed it; when the river carried away part of a plot, men were sent to measure the loss and the tax was reduced; Herodotus thinks the Greeks learned land measuring from this. |
| 2 | Herodotus, *Histories* 2.109 (Macaulay translation) | Lexundria | https://lexundria.com/hdt/2.109/mcly | Same passage; this translation has an "equal square portion", others an "equal parcel" (shape differs by translation). |
| 3 | T. L. Heath, *A History of Greek Mathematics* / *From Thales to Euclid* (scan) | TIB Goobi viewer | https://goobi.tib.eu/viewer/fulltext/1004477643/142 | Later writers (Heron, Diodorus, Strabo) repeat the story and may depend on Herodotus; Herodotus may present what he heard in Egypt as his own inference. |
| 4 | "Rope stretcher" | Wikipedia | https://en.wikipedia.org/wiki/Rope_stretcher | Egyptian surveyors measured boundaries and foundations with knotted cords; such work appears in Theban tomb paintings. |
| 5 | Heath (scan, Democritus fragment) | TIB Goobi viewer | https://goobi.tib.eu/viewer/fulltext/1004477643/199 | The *harpedonaptai* remark attributed to Democritus is of doubtful authenticity. |
| 6 | "TT69" | Wikipedia | https://en.wikipedia.org/wiki/TT69 | Tomb of Menna, Sheikh Abd el-Qurna, West Bank at Luxor; scenes of grain production. |
| 7 | "Menna" tomb entry | American Research Center in Egypt | https://arce.org/?p=2835 | 18th Dynasty; Menna a scribe and overseer of fields of the pharaoh and of Amun. |
| 8 | "Mathematical Treasure: Tomb of Menna" (F. Swetz) | Mathematical Association of America, *Convergence* | https://www.maa.org/press/periodicals/convergence/mathematical-treasure-tomb-of-menna | Scene of measuring fields by rope-stretchers, assessing harvests and computing taxes (its location detail conflicts with 6-7; location taken from 6-7). |
| 9 | Print listing "Measuring the Land Using Rope, from the Tomb Chapel of Menna" | Meisterdrucke | https://www.meisterdrucke.us/fine-art-prints/Egyptian-18th-Dynasty/422400/Measuring-the-Land-Using-Rope,-from-the-Tomb-Chapel-of-Menna,-New-Kingdom.html | Confirms the rope-measuring scene exists (weak source; corroboration only). |
| 10 | "Rhind Mathematical Papyrus" | Wikipedia | https://en.wikipedia.org/wiki/Rhind_Mathematical_Papyrus | Copied about 1550 BCE by Ahmes (Ahmose) from an older text; most held at the British Museum (EA 10057-10058). |
| 11 | "Egyptian geometry" | Wikipedia | https://en.wikipedia.org/wiki/Egyptian_geometry | Problem 49 finds the area of a rectangular plot of land. |
| 12 | Geometry notes on Egyptian mathematics (R. Gardner) | East Tennessee State University | https://faculty.etsu.edu/gardnerr/Geometry/notes-OW/Geometry-OW-1-5.pdf | Problem 49 given as a 10 by 2 khet rectangle with an apparent scribal error (dimensions unsettled; kept out of child text). |
| 13 | "Ancient Egyptian units of measurement"; "Arura" | Wikipedia | https://en.wikipedia.org/wiki/Arura | Land unit of 100 by 100 cubits (about 2,700 m²); setat/aroura relationship unsettled. Not in child text beyond "their own units, much bigger than a meter". |
| 14 | "acre" | Encyclopaedia Britannica | https://britannica.com/science/acre-unit-of-measurement | Origin as the area a yoke of oxen could plough in a day; Anglo-Saxon strip 1 furlong by 1/10 furlong (40 by 4 rods); now 4,840 square yards of any shape, about 0.4 hectare. |
| 15 | "acre" | Etymonline | https://www.etymonline.com/word/acre | Late Old English sense: land a yoke of oxen could plough in a day; later fixed by statute. |
| 16 | "Acre" | Wikipedia | https://en.wikipedia.org/wiki/Acre | 4,840 sq yd = 10 square chains = 160 square rods; furlong by chain shape. |
| 17 | 3.MD.C.7c | Common Core State Standards | https://thecorestandards.org/Math/Content/3/MD/C/7/c/ | Use tiling to show a rectangle with sides a and b + c has area a × b + a × c; area models for the distributive property. |
| 18 | "Perimeter with composite rectilinear shapes" (Year 7 lesson) | Oak National Academy | https://thenational.academy/pupils/programmes/maths-secondary-year-7/units/perimeter-and-area/lessons/perimeter-with-composite-rectilinear-shapes/video | A composite rectilinear shape is made only from rectangles; missing lengths deduced from given ones. |
| 19 | Marble teaching-research records for the nine targets (seven assigned, plus `mt_GzcJEVkNRn` and `mt_eiB3-6pu6a` claimed on review) | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Herodotus reports that after the Nile carried away part of a plot, measurers found the land left and the tax was lowered | 1, 2 | Checked |
| Herodotus thought geometry (land measuring) passed to the Greeks from this; child text says "he guessed" and "nobody can be sure" | 1, 3 | Checked |
| Plots were square | 1, 2 | Unsettled by translation; child text says "plot" only |
| "Nearly 2,500 years ago" (the *Histories*, 5th century BCE) and Herodotus visited Egypt | 1, 3 | Checked (dating standard; Heath excerpt refers to what he heard in Egypt) |
| Tomb of Menna, 18th Dynasty, shows men measuring a field with a rope; "more than 3,000 years old" | 6, 7, 8, 9 | Checked (scene detail rests on 8 and 9; no knot or rope-length detail used) |
| The Greek term *harpedonaptai* and the Democritus remark | 4, 5 | `[check]` (fragment of doubtful authenticity); audit only, not in child text |
| 3-4-5 right triangles laid out with knotted rope by Egyptian surveyors | 4 | `[check]`; popular claim, not used anywhere |
| Rhind papyrus copied about 1550 BCE ("about 3,500 years ago"), mostly at the British Museum, book of worked problems | 10 | Checked |
| Rhind problem 49: area of a rectangular plot of land | 11, 12 | Checked (no dimensions in child text) |
| Problem 49's dimensions (10 by 2 khet; scribal slip) | 12 | `[check]`; not in child text |
| Egyptian land units bigger than a meter (khet of 100 cubits) | 13 | Checked in the general form used; setat/aroura equivalence `[check]`, not used |
| Acre began as about a day's ploughing with oxen; later fixed | 14, 15 | Checked |
| Acre = 4,840 sq yd = 10 square chains; chain 22 yd (66 ft, about 20 m); furlong-by-chain strip; any shape of that area is one acre; about 4,047 m², 0.4 ha | 14, 16 | Checked; arithmetic in script |
| Area, distributive property and perimeter conventions | 17, 18, 19 | Checked (standard math; math check still requested) |

## Open checks

1. Nuria's Spanish line, *Paso a paso* ("step by step"), for a fluent Spanish reader (spec 120 rule).
2. Re-read Herodotus 2.109 in one full translation in the second pass, to confirm "measurers" and the tax wording.
3. Confirm the Menna rope scene against a scholarly description (for example the Tomb Chapel of Menna project) before any image is chosen.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of plots, tiles and fences. If a real image is wanted: photographs of the Menna rope-measuring scene circulate commercially; use only a file with a clear free license (Wikimedia Commons, checked per file) or an original line drawing labeled as a drawing. The Rhind papyrus is a British Museum object; check the museum's image license for the specific photograph. No photograph of a real child or real family appears.
