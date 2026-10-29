# Source audit 183: The Stamp Drawer

Date: 2026-10-25. Spec: [183](../specs/183-stamp-drawer.md). Companion: [183 text](../content/183-stamp-drawer-text.md).

**Method.** Eight web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The geometry (property definitions, inclusive quadrilateral definitions, diagonal facts, diameter = 2 × radius, side-and-turn construction of regular polygons, the law-of-cosines value used only to check E5) is standard school mathematics and needs the requested math check, not a citation. All stamp shapes, coordinates, riddles and measurements in problem items are **made-up labeled data**, verified by `check183.py` (87 checks, all passing; scratch area, not in the repo) and, after review, by the reviewer's `rcheck.py` (including the turn-order column and the items added in review). Style was checked by `style183.py` on the companion (0 em-dashes; all word limits met).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Postage stamps and postal history of the Cape of Good Hope" | Wikipedia | https://en.wikipedia.org/wiki/Postage_stamps_and_postal_history_of_the_Cape_of_Good_Hope | First Cape stamps (1d and 4d) on sale 1 September 1853; printed by Perkins, Bacon & Co.; triangular; shape probably inspired by a triangular obliterator used by the Cape Revenue Department from 1839; triangulars ended with De La Rue printings of 1863-64. |
| 2 | "First postage stamp in Africa issued in the Cape Colony" | South African History Online | https://www.sahistory.org.za/dated-event/first-postage-stamp-africa-issued-cape-colony | Designed by Charles Davidson Bell, Surveyor General; triangular form unusual for the period. |
| 3 | "Cape of Good Hope Triangle Stamps: The World's First Triangular Postage Stamps" | Mystic Stamp Company (dealer) | https://info.mysticstamp.com/?p=88034 | First triangular stamps; brick-red 1d for newspapers, blue 4d for a half-ounce letter; imperforate, cut apart by postmasters; replaced by rectangular perforated stamps by 1864; isosceles shape. Dealer source: used only where it agrees with 1 and 2. |
| 4 | Cape triangulars pages | capestamps.com (collector site) | https://capestamps.com/perkins-bacon-issue-1853/ | Perkins Bacon issue 1853; the "people who could not read" story reported as alleged. |
| 5 | "Nuzzle on your tongue" | Mail & Guardian | https://mg.co.za/friday/2006-12-05-nuzzle-on-your-tongue/ | A third, different explanation of the shape (helping sorters); shows the reason is disputed. |
| 6 | Euclid, *Elements* Book I, Definitions (Heath 1908) | Trinity College Dublin, D. R. Wilkins | https://www.maths.tcd.ie/~dwilkins/Euclid/Elements_Heath1908/BookI/EuclidElementsBk01Definitions_Heath1908.php | Def. 15-17: circle, center, diameter ("also bisects the circle"); Def. 20: equilateral, isosceles ("two of its sides alone equal"), scalene; Def. 22: square, oblong, rhombus, rhomboid, other quadrilaterals trapezia. |
| 7 | *Euclid's Elements*, Book I, Definition 22, with commentary | David E. Joyce, Clark University | https://mathcs.clarku.edu/~djoyce/elements/bookI/defI22.html | Exclusive definitions; Euclid does not define the parallelogram but uses it; in practice Euclid uses "rectangle" for rectangular parallelograms including squares. |
| 8 | Heath's commentary on Def. 22 (draft transcription) | Trinity College Dublin | https://www.maths.tcd.ie/~dwilkins/Euclid/Euclid_HeathCommentaries/EuclidElements_HeathCommentary_ElementsBk01Def22_DraftTranscription.pdf | Greek text of Def. 22 includes angles in the rhomboid definition (corroborates 6). |
| 9 | "Euclid" | Encyclopaedia Britannica | https://britannica.com/biography/Euclid-Greek-mathematician/Introduction | Flourished about 300 BCE, Alexandria, Egypt. |
| 10 | "Euclid of Alexandria (ca. 300 B.C.E.)" | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Strick/euclid.pdf | Taught in Alexandria under Ptolemy I; dates vary (325 BCE is also given for the *Elements*). |
| 11 | "Abu al-Wafa' al-Buzjani" | Wikipedia | https://en.wikipedia.org/wiki/Abu_al-Wafa%27_al-Buzjani | Book of geometric constructions needed by craftsmen, around 990; regular polygons; fixed-opening ("rusty") compass, thought by him more accurate for artisans; about two thirds of the constructions later appear in Renaissance European works. |
| 12 | "Mohammad Abu'l-Wafa Al-Buzjani" | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Abul-Wafa/ | Constructions of regular pentagon, octagon, decagon with a fixed compass; approximate heptagon. |
| 13 | "Abu'l-Wafa Buzjani" | Encyclopaedia Iranica | https://www.iranicaonline.org/articles/abul-wafa-buzjani/ | Born 940 in Buzjan (Khorasan); moved to Baghdad about 959-60; worked at the Buyid court and an observatory there; died 997 or 998. |
| 14 | Marble teaching-research records for the ten targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |
| 15 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach, guided, practice; the "I'm stuck" ladder; three-option choices. Pattern only; no text copied. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Cape of Good Hope's first stamps, 1 September 1853, were triangles, a 1d and a 4d | 1, 2, 3 | Checked (1 September is a nominal first-use date per one collector site; child text says "in 1853") |
| Printed in London by Perkins, Bacon & Co. | 1, 3 | Checked |
| Imperforate, cut apart by postmasters | 3, 4 | Checked (dealer and collector sources; consistent with imperforate issues of the period) |
| Rectangular perforated stamps by 1864; last triangulars 1863-64 | 1, 3 | Checked |
| Why triangular: obliterator of 1839, illiteracy, sorting | 1, 3, 4, 5 | Disputed; child text says only that nobody is sure |
| The Cape triangle was isosceles | 3 | `[check]` single dealer source; not in child text |
| The Cape triangle was right-angled | none | `[check]` unsupported; not in child text |
| Designer Charles Bell | 2 | Checked, single source; not in child text |
| Euclid, Alexandria, about 300 BCE; "about 2,300 years ago" | 9, 10 | Checked (dates vary by a few decades; rounded in child text) |
| Euclid defines circle, center, diameter | 6 | Checked |
| Euclid's square, oblong, rhombus are mutually exclusive; isosceles is "two sides alone" | 6, 7, 8 | Checked |
| Abu al-Wafa, Baghdad, book for craftspeople around 990, regular polygons | 11, 12, 13 | Checked |
| Fixed-opening compass, believed more accurate | 11, 12 | Checked |
| Many constructions reappear later in European books | 11 | Checked, single source excerpt; child text says "many", not "two thirds" |

## Anchors considered and not used

- **The Penny Black** (Britain, 1840, the first adhesive postage stamp): suggested in the assignment; not searched, because a rectangle adds no classification idea beyond the Cape card. Not in child text.
- **Islamic geometric tiling**: tiling and star patterns belong with spec 125's symmetry and tessellation benches; Abu al-Wafa's constructions were chosen instead as the Islamic-world anchor, since they bear directly on drawing regular polygons.

## Open checks

1. Spanish line (Nuria) and French line (Léon) in Scene 3, for fluent readers (spec 120 rule). *Mi sello tiene cuatro lados iguales y ningún ángulo recto.* *Mon timbre a trois côtés et un angle droit. Aucun côté n'est égal à un autre.*
2. Second-pass reading of sources 1, 6 and 11 at the page, since only excerpts were seen.
3. The Cape triangle's exact shape (isosceles; angles) from a philatelic catalogue, if a later card wants it.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the blank stamp shapes. If a real image is wanted: Cape triangular stamps of 1853 are public domain as works of that age, and photographs of them on Wikimedia Commons carry their own licenses (check each file). Euclid and Abu al-Wafa have no authentic portraits; avoid invented likenesses, or label any drawing as imagined. No photograph of a real child or real family appears.

## Independent review notes (2026-10-25)

The build-out map added `mt_Xt1cRqaBOW` (quadrilateral hierarchy) and `mt_WtIFJSCQIT` (terms, notation and symmetric polygons); the added items (D7, F1-F4) use made-up stamps only and add no history claim. Trapezoid convention ruled inclusive (at least one pair of parallel sides), the US Common Core-aligned modern usage; Euclid's exclusive list stays as the contrast. WebSearch excerpts re-confirmed the Cape 1d and 4d triangulars on sale 1 September 1853, printed by Perkins, Bacon & Co., imperforate (Wikipedia; capestamps.com), and Abu al-Wafa's fixed-opening ("rusty") compass constructions for craftsmen, including regular polygons, many reappearing in Renaissance Europe (MacTutor, St Andrews). Fetches were not attempted. No `[check]` item is in child text.
