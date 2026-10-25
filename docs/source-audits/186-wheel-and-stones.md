# Source audit 186: The Wheel and the Stones

Date: 2026-10-25. Spec: [186](../specs/186-wheel-and-stones.md). Companion: [186 text](../content/186-wheel-and-stones-text.md).

**Method.** Six web searches (WebSearch; page fetches were blocked in this session, so every historical claim rests on search-result excerpts and should be re-read at the source in the second pass). The mathematics (parallelogram area as base × perpendicular height by dissection; triangle as half a parallelogram; area of fraction-sided rectangles as the product of the sides; C = pi × d; A = pi × r² by rearranged sectors; 22/7 and 3.14 as approximations) is standard school mathematics and matches the three Marble teaching-research records, which cite the English national curriculum (Year 6 and KS3) and NCETM materials. The wheel, stones, cloth, Rim Tape lengths, grain amounts and all problem numbers are **made-up labeled data**, verified by `check186.py` (131 checks, all passing; scratch area, not in the repo). Style verified by `style186.py` (0 em-dashes, 0 word-limit issues).

**Independent review, 2026-10-25.** A reviewer re-ran every number with an independent script (`rcheck.py`, `python3 -I`, scratch area; all passing) and re-searched the anchors (search excerpts only; fetches blocked). Zu Chongzhi (Wikipedia and MacTutor excerpts: 22/7 yuelü, 355/113 milü, bounds 3.1415926-3.1415927, book lost) and the Rhind round field are confirmed. New Set F numbers (trapezoid 24, trough 6 ft³, crate 60, millstone 0.77 m³) are made-up data.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Egyptian geometry" | Wikipedia | https://en.wikipedia.org/wiki/Egyptian_geometry | Rhind Problem 50: round field 9 khet across, subtract 1/9 of the diameter, square 8: 64 setat; implied 256/81 ≈ 3.16. |
| 2 | "Egyptian geometry" (Mathematicians of the African Diaspora) | University at Buffalo | https://www.math.buffalo.edu/mad/Ancient-Africa/mad_ancient_egypt_geometry.html | Corroborates Problem 50's method and result; Problem 48 octagon comparison. |
| 3 | "The Rhind Mathematical Papyrus, Problem 50" (book chapter) | Springer | https://www.springerprofessional.de/en/the-rhind-mathematical-papyrus-problem-50-1650-b-c/13875950 | Problem 50 as a recognized topic; dates it about 1650 BC. |
| 4 | "Rhind Mathematical Papyrus" | Wikipedia | https://en.wikipedia.org/wiki/Rhind_Mathematical_Papyrus | Scribe Ahmes; c. 1550 BC (year 33 of Apophis); copied from an older text; mostly at the British Museum (acquired 1865), fragments at the Brooklyn Museum. |
| 5 | "Book:Ahmes/Rhind Papyrus/Historical Note" | ProofWiki | https://proofwiki.org/wiki/Book:Ahmes/Rhind_Papyrus/Historical_Note | Alternative earlier date (about 1650s BCE). |
| 6 | "Measurement of a Circle" | Wikipedia | https://en.wikipedia.org/wiki/Measurement_of_a_Circle | Three propositions, about 250 BCE; 3 10/71 < pi < 3 1/7 by inscribed and circumscribed 96-gons starting from hexagons. |
| 7 | "Archimedes' Limits to Value of Pi" | ProofWiki | https://proofwiki.org/wiki/Archimedes%27_Limits_to_Value_of_Pi | 223/71 < pi < 22/7; decimals 3.1408 and 3.1429. |
| 8 | "Archimedes' Measurement of a Circle" | *Convergence* / TRIUMPHS annals (journal) | https://triumphsannals.journals.publicknowledgeproject.org/index.php/triumphsannals/article/view/13291 | Teaching edition of the proposition; corroborates 6-7. |
| 9 | "How Archimedes showed that pi is approximately equal to 22/7" | arXiv 2008.07995 | https://arxiv.org/pdf/2008.07995 | Archimedes did not claim either bound as exact; 22/7 is his upper bound. |
| 10 | "Chapter 1: The Origins of Geometry" (course notes) | University of Kentucky | https://www.ms.uky.edu/~droyster/courses/fall11/ma341/Classnotes/Chapter%2001-The%20Origins%20of%20Geometry.pdf | Archimedes 287-212 BC (Syracuse). |
| 11 | "Zu Chongzhi" biography | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Zu_Chongzhi/ | Born 429 in Jiankang (Nanjing); 355/113 correct to six decimals; credited with 3.1415926 < pi < 3.1415927, proof details unknown; book lost; death 501 (Britannica gives 500). |
| 12 | "Zu Chongzhi" | Britannica | https://www.britannica.com/biography/Zu-Chongzhi | Mathematician and astronomer; Daming calendar; close approximations of pi; son Zu Geng. |
| 13 | "355/113" and "Zu Chongzhi" | Wikipedia; New World Encyclopedia | https://en.wikipedia.org/wiki/355/113 | Yuelü 22/7 ("approximate ratio") and Milü 355/113 ("close ratio"); best rational approximation with denominator of four digits or fewer; some credit Zu Geng; polygon side count disputed (12,288 vs 24,576). |
| 14 | Marble teaching-research records for the four targets (including `mt_tAJH5BrpOx`, claimed on review) | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy, constraints and misconceptions summarized in the spec's upstream check. |
| 15 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach, guided, practice; "I'm stuck" ladder; tagged three-option choices; glossary. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Rhind Problem 50: field 9 khet across, take away a ninth, 8 × 8 = 64 setat | 1, 2, 3 | Checked |
| Implied value 256/81 ≈ 3.16 | 1, 2; script | Checked (spec only; child text says "very close") |
| Copied by the scribe Ahmes from an older text | 4 | Checked |
| Date: c. 1550 BCE (also given as c. 1650 BCE) | 3, 4, 5 | Unsettled between sources; child text says "more than 3,500 years ago", true under either date |
| Mostly held at the British Museum | 4 | Checked (single excerpt; acquisition year 1863-1865 varies and is not used) |
| Khet is a length unit, setat an area unit | 1 | Checked; the khet's size in meters is not used `[check]` if ever added |
| Archimedes, Syracuse, 3rd century BCE; *Measurement of a Circle* | 6, 10 | Checked; child text "more than 2,200 years ago" (212 BCE is 2,237 years before 2026) |
| 96-sided polygons inside and outside, from hexagons | 6, 7, 8 | Checked |
| 3 10/71 < pi < 3 1/7, and 3 1/7 = 22/7 | 6, 7; script | Checked |
| Archimedes did not claim 22/7 exact | 9 | Checked (E3 tests it) |
| Zu Chongzhi, China, born 429 CE; child text "more than 1,500 years ago" | 11, 12 | Checked (death 500 or 501, not used) |
| Gave 22/7 (approximate) and 355/113 (close) | 13, 11 | Checked |
| 3.1415926 < pi < 3.1415927 credited to him | 11, 13 | Checked; details of proof unknown (said in H3's note: "His book is lost") |
| 355/113 right to six decimal places | 11, 13; script | Checked |
| 355/113 lies inside 3.1415926-3.1415927 | 13 (one excerpt asserts this) | **Rejected by script**: 355/113 = 3.14159292 is just above 3.1415927. Child text never says it lies inside. |
| Polygon side count Zu used | 13 | Unsettled; not in child text |
| Zu Geng's share in 355/113 | 13 | Unsettled; child text says only "he gave" |
| Area rules, pi as round ÷ across, sector rearrangement | 14 (curriculum citations within) | Standard; math check requested |

## Open checks

1. Re-read the Rhind, Archimedes and Zu Chongzhi pages at the source (fetches were blocked).
2. Nuria's Spanish greeting, *¡Hola desde Vadoalto!*, for a fluent Spanish reader (spec 120 rule).
3. Math check on the sector argument wording and the obtuse-triangle depth (spec review asks).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the wheel, planks, cloth and stones. The Rhind papyrus is held by the British Museum, which publishes collection images under its own terms (check each image's license before use; Wikimedia Commons carries public-domain scans of some sheets). No portrait of Zu Chongzhi or Archimedes from life exists; later portraits and statues are interpretations, so the cards use none. No photograph of a real child or real family appears.

## Notes on research use

Marble records are agent-written and marked as not re-verified; the spec follows their learn constraints (perpendicular height with non-examples, any side as base, ÷2 tied to two triangles, decoy slant lengths, a labeled unit square cut two ways, reading and producing a tiling, scoped "smaller than both sides", pi as a measured ratio, wedge rearrangement, radius or diameter first, units kept in view) and uses recognition items as checks beside the live manipulations, as the records ask. Example numbers from the records (2/3 × 3/4, 1 1/2 × 2/3, 1/2 × 4/5, base 8 height 5, base 7 height 6) are common textbook values; this pack uses its own mill values except 2/3 × 3/4, 1 1/2 × 2/3 and 1/2 × 4/5, which are standard and recomputed.
