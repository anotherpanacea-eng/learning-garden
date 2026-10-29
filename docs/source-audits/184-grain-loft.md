# Source audit 184: The Grain Loft

Date: 2026-10-25. Spec: [184](../specs/184-grain-loft.md). Companion: [184 text](../content/184-grain-loft-text.md).

**Method.** Five web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The geometry (names and properties of solids; faces, edges and vertices of prisms and pyramids; cross-sections of a cylinder, cone and cube; Euler's polyhedron formula for convex polyhedra) and the measurement (volume as a count of unit cubes, V = l × w × h, additivity of non-overlapping volumes) are standard school mathematics, cross-checked against the pinned Marble topic descriptions and the Common Core and English national curriculum standards they cite. All crates, bins, holds, seed blocks and counts in problem items are **made-up labeled data**, verified by `check184.py` (64 checks, all passing; scratch area, not in the repo). The style of the companion was checked by `style184.py` (all checks passing).

**Independent review, 2026-10-25.** A reviewer re-ran every number with an independent script (`rcheck.py`, `python3 -I`, scratch area; all passing) and re-searched the anchors (search excerpts only; fetches blocked). Rhind: Wikipedia excerpt confirms Henry Rhind, a Scottish antiquarian, bought it at Luxor in 1858, British Museum bulk acquired 1865, problems 41-46 cylindrical and rectangular granaries (https://en.wikipedia.org/wiki/Rhind_Mathematical_Papyrus). Euler: Dickinson College and arXiv excerpts confirm the 14 November 1750 letter from Berlin to Goldbach and its faces-plus-solid-angles wording (https://dickinson.hykucommons.org/concern/generic_works/ace910be-2b8d-4bb8-bfb6-fa7cd95076d9). New item D7 (12 × 4 = 48 ft³) is made-up data.

**Anchor choice.** Three were proposed (Euler's letter, Plato's five solids, the Rhind papyrus granaries). Two are used. Plato's solids were dropped: excerpts disagree on which solid Plato paired with which element and on who first described the octahedron and icosahedron, and the pack already has a Keeper's Desk polyhedron anchor in Euler.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Rhind Mathematical Papyrus" | Wikipedia | https://en.wikipedia.org/wiki/Rhind_Mathematical_Papyrus | Copied by the scribe Ahmes around 1550 BCE from an older lost text; bought in Luxor in 1858 by Alexander Henry Rhind; British Museum holds most of it (acquired 1864 or 1865; EA 10057-10058); a few fragments in the Brooklyn Museum. |
| 2 | "Rhind Mathematical Papyrus" | Simple English Wikipedia | https://simple.wikipedia.com/wiki/Rhind_Mathematical_Papyrus | Gives about 1650 BCE (date disagreement; child text says only "more than 3,500 years ago", true for both). |
| 3 | "Who was the first recorded mathematician in history?" | University of Waterloo, Faculty of Mathematics | https://uwaterloo.ca/math/news/who-was-first-recorded-mathematician-history | Ahmes as the scribe who copied the papyrus. |
| 4 | Rhind papyrus artifact page | MoMath and Wolfram, history of mathematics project | https://wolframcloud.com/obj/history-of-mathematics/production/artifacts/rhind-papyrus | Corroborates the papyrus, scribe and British Museum holding. |
| 5 | "Egyptian geometry" | Wikipedia | https://en.wikipedia.org/wiki/Egyptian_geometry | Rhind problems 41-43 find volumes of cylindrical granaries and 44-46 of rectangular granaries; Moscow problem 14 is the frustum. |
| 6 | Eves, *An Introduction to the History of Mathematics*, section 2.9 notes | East Tennessee State University (course notes) | https://faculty.etsu.edu/gardnerr/3040/Notes-Eves6/Eves6-2-9.pdf | Problem 41's result in cubic cubits, then converted to *khar*; cites Chace's 1927 translation. |
| 7 | "Egyptian mathematics", section 1.1.3 | The Open University, OpenLearn | https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics/egyptian-mathematics/content-section-1.1.3 | A cylindrical granary problem with diameter 10 and height 10 (numbering differs from other accounts). |
| 8 | "Euler's polyhedron formula" | Axial (essay) | https://axial.substack.com/p/eulers-polyhedron-formula | Euler wrote from Berlin to Goldbach in St. Petersburg in November 1750; faces plus solid angles exceed edges by two. |
| 9 | David S. Richeson, *Euler's Gem*, excerpt | Princeton University Press, via Barnes and Noble | https://valsec.barnesandnoble.com/w/eulers-gem/david-s-richeson/1100870557 | Letter to Goldbach, 14 November 1750; Euler's wording; flawed early proof. |
| 10 | "Euler's Formula" (course notes) | Western Oregon University | https://people.wou.edu/~fleschb/Math398/2014/Euler'sFormula.pdf | Euler's sketched proof in the 1750 letter; Legendre's accepted proof in 1811; Descartes's related earlier result (about 1630) without this formula. |
| 11 | "The Polyhedral Formula" | Dickinson College (Hyku Commons) | https://dickinson.hykucommons.org/concern/generic_works/ace910be-2b8d-4bb8-bfb6-fa7cd95076d9 | Corroborates the formula's history (F − E + V = 2). |
| 12 | "Platonic Solids and Plato's Theory of Everything" | MathPages | https://mathpages.com/home/kmath096/kmath096.htm | Considered for a Plato anchor; not used (see Anchor choice). |
| 13 | Eves notes, section 3.9 | East Tennessee State University | https://faculty.etsu.edu/gardnerr/3040/Notes-Eves6/Eves6-3-9.pdf | Scholium crediting some solids to the Pythagoreans; shows the attribution is unsettled. Not used in child text. |
| 14 | Marble topic descriptions and teaching-research records for the thirteen targets (the ten assigned plus `mt_Qcp2d_kuta`, `mt_IuHa5UI5od` and `mt_nTL-owFJTF`, claimed on review) | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check; cites CCSS K.G.4, 1.G.2, 5.MD.C.3-5, 7.G.3 and the 2013 English national curriculum (Y2 geometry, KS3). |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| An Egyptian scribe, Ahmes, copied a scroll of math problems more than 3,500 years ago | 1, 2, 3, 4 | Checked (1550 vs 1650 BCE unsettled; both over 3,500 years) |
| Named for Rhind, a Scottish collector, who bought it in Luxor in 1858 | 1, 4 | Checked |
| Most of it is in the British Museum | 1, 4 | Checked (fragments in Brooklyn; acquisition year 1864 or 1865, not in child text) |
| Some problems ask how much grain a granary holds; round and box-shaped granaries | 5, 6 | Checked |
| The problems use cubits, a length based on the forearm | 5, 6 | Checked (cubic cubits and *khar* in the spec only) |
| Specific granary dimensions for problems 41, 42 and 44 | 6, 7 | `[check]` excerpts disagree; kept out of child text and spec |
| Euler wrote to Goldbach in 1750 stating faces plus corners exceed edges by two | 8, 9, 10 | Checked (day, 14 November, from one source; child text gives only the year) |
| Euler in Berlin, Goldbach in St. Petersburg | 8 | Checked (single excerpt; second pass to confirm) |
| Euler's proof had a gap; fixed later (Legendre, 1811) | 9, 10 | Checked (child text says only "others fixed it later") |
| Today written V − E + F = 2 | 8, 10, 11 | Checked |
| V, E, F counts for all solids used; house 9, 16, 9 | standard; `check184.py` | Computed from vertex-and-face lists |
| Cylinder cross-sections circle, rectangle, ellipse; cone across a smaller circle, through the apex a triangle; cube corner cut a triangle | 14; standard geometry | Checked (math check still requested) |
| Volume by unit cubes, layers, l × w × h; additivity | 14 (5.MD.C.3-5) | Checked |

## Open checks

1. Granary dimensions in Rhind problems 41-46 (needs Chace's translation or the British Museum's description). Not in child text.
2. Euler's location and the letter's exact date (one excerpt each). Child text gives only the year and the two names.
3. Nuria's Spanish line, *"Cajas, no sacos,"* for a fluent Spanish reader (spec 120 rule).
4. The curved-solid convention (math check, review ask 1).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the loft and its solids. If a real image is wanted: the British Museum's collection pages for the Rhind papyrus (EA 10057-10058) carry their own reuse terms, and public-domain photographs exist on Wikimedia Commons (check each file's license). Euler portraits of the period are public domain. No photograph of a real child or real family appears.
