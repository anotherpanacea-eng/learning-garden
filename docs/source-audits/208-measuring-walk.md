# Source audit 208: The Measuring Walk

Date: 2026-10-25. Spec: [208](../specs/208-measuring-walk.md). Companion: [208 text](../content/208-measuring-walk-text.md).

**Method.** Seven web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The measurement content (aligned-end comparison, transitivity, equal-unit iteration, the inverse relation between unit size and count, ruler reading, differences, balance reading, interval values on a scale, benchmark estimation) is standard school mathematics, cross-checked against the Marble research records for the eight targets and the standards they cite (CCSS K.MD.1-2, 1.MD.1, 2.MD.2-4; England KS1 measurement). All planks, benches, clips, loaves, scales and estimates in items are **made-up labeled data**, verified by `check208.py` (68 checks, all passing; scratch area, not in the repo). Topic descriptions were read in the pinned `topics.json`: four assigned ids (`mt_IuHa5UI5od`, `mt_nTL-owFJTF`, `mt_eiB3-6pu6a`, `mt_3XJkeIn6J6`) describe volume, area formulas and time, not length or mass, and were moved by the coordinator to specs 184, 185 and 207.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Ancient Egyptian units of measurement" | Wikipedia | https://en.wikipedia.org/wiki/Ancient_Egyptian_units_of_measurement | Royal cubit about 52.5 cm; 7 palms of 4 digits, 28 digits. |
| 2 | Length (Egyptian measures) | University College London, Digital Egypt for Universities | https://www.ucl.ac.uk/museums-static/digitalegypt/weights/lenght.html | Royal cubit (mH nsw) 52.4 cm; subdivisions. |
| 3 | "Measuring rod" | Wikipedia | https://en.wikipedia.org/wiki/Measuring_rod | Two cubit rods from the Saqqara tomb of Maya, treasurer of Tutankhamun; one in the Louvre; fingers marked with fractions; rods about 52.5 cm, 7 palms of 4 fingers. |
| 4 | "Maya (treasurer)" | Wikipedia | https://en.wikipedia.org/wiki/Maya_(treasurer) | Maya, Overseer of the Treasury under Tutankhamun, Ay and Horemheb. |
| 5 | JAEA paper on Egyptian cubits (Monnier, Petit, Tardy) | Journal of Ancient Egyptian Architecture | https://web.ujaen.es/investiga/egiptologia/journalarchitecture/downloads/JAEA1_Monnier_Petit_Tardy.pdf | Surviving cubit rods and their measured lengths (search excerpt only). |
| 6 | "Weights, Harappa"; "Cubical weights" | Harappa Archaeological Research Project (harappa.com) | https://www.harappa.com/slide/weights-harappa ; https://www.harappa.com/blog/cubical-weights | Cubical weights on one binary system used in all settlements; smallest 0.856 g; most common about 13.7 g (the 16 ratio); larger weights decimal. |
| 7 | "History of measurement systems in India" | Wikipedia | https://en.wikipedia.org/wiki/History_of_measurement_systems_in_India | 83% of weights from Mohenjo-daro, Harappa and Chanhu-daro cubic, 68% chert; ratios 1, 2, 4, 8, 16, 32...; pan balances. |
| 8 | Weights collection | Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai | https://csmvs.in/collections/weight/ | Chert and agate cubical weights to a common standard across the Indus. |
| 9 | "New Heights" (Discover Copper, 1998) | Copper Development Association | https://www.copper.org/publications/newsletters/discover/1998/Ct85/new_heights.php | Balance scales with copper pans and cube-shaped stone weights from Mohenjo-daro and Harappa. |
| 10 | "Arc measurement of Delambre and Méchain" | Wikipedia | https://en.wikipedia.org/wiki/Arc_measurement_of_Delambre_and_M%C3%A9chain | Survey 1792-1798, Dunkirk to Barcelona, basis of the meter; Delambre north to Rodez, Méchain south. |
| 11 | "Pierre François-André Méchain" | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Mechain.html | Méchain as astronomer; the survey. |
| 12 | "Delambre" (DSB) | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/DSB/Delambre.pdf | Delambre as astronomer; the meridian survey. |
| 13 | "History of the metre" | Wikipedia | https://en.wikipedia.org/wiki/History_of_the_metre | Meter as one ten-millionth of pole-to-equator; *mètre des Archives* platinum bar placed in the National Archives 22 June 1799; replaced in 1889. |
| 14 | Platinum standards article (1887, reprinted 2000) | Johnson Matthey Technology Review | https://www.technology.matthey.com/article/44/3/125-134 | Platinum meter and kilogram deposited in the Archives in 1799 (gives 22 July); law of 10 December 1799. |
| 15 | Seven-spot ladybird | Michigan State University; coleoptera.org.uk | https://www.canr.msu.edu/ipm/uploads/files/Natural_Enemies_PDFs/SevenSpottedLadyBeetles.pdf ; https://coleoptera.org.uk/node/13219 | Length about 5-8 mm (supports "a ladybug is about 6 mm"). |
| 16 | International inch | Unicode mailing list archive (secondary) | https://www.unicode.org/mail-arch/unicode-ml/Archives-Old/UML014/0557.html | Inch exactly 2.54 cm by international agreement since 1959 (standard fact; weak source, child text says only "a bit longer than 2 cm"). |
| 17 | Marble teaching-research records for the ten targets (two added at review) | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Royal cubit about 52 cm (52.4-52.5); 7 palms of 4 fingers, 28 fingers | 1, 2, 3 | Checked |
| Rods more than 3,000 years old; one from Maya's tomb (treasurer of Tutankhamun) is in the Louvre | 3, 4 | Checked (Louvre rod dated 1327-1295 BCE in one excerpt; Maya rod 1336-1327 BCE in another; both over 3,300 years) |
| Maya's rod is wooden or gilded | none | `[check]`; not in child text |
| Indus weights mostly cubes, mostly chert, one standard across cities | 6, 7, 8 | Checked |
| Doubling series 1, 2, 4, 8, 16; common weight about 13.7 g ("about 14 grams" in child text) | 6, 7 | Checked |
| About 4,000 years ago (Mature Harappan c. 2600-1900 BCE) | 7, search excerpts | Checked (child text says "about") |
| Weights used for trade or taxes | 6, 9 | Interpretation; not in child text |
| Delambre and Méchain, French astronomers, surveyed Dunkirk to Barcelona in the 1790s | 10, 11, 12 | Checked |
| Meter meant as one ten-millionth of pole-to-equator | 10, 13 | Checked |
| Platinum meter bar kept in the National Archives in 1799 | 13, 14 | Checked (day differs: 22 June vs 22 July; child text gives only the year) |
| Ladybug about 6 mm | 15 | Checked (within 5-8 mm) |
| An inch is a bit longer than 2 cm (2.54 cm) | 16 | Standard; second pass to cite NIST |
| Teaching claims (aligned ends, no gaps, inverse unit relation, interval reading, benchmarks) | 17, CCSS and England KS1 standards cited in the records | Checked against the research records |

## Open checks

1. Whether Maya's Louvre rod is wood (not in child text).
2. Day of the 1799 deposit (22 June or 22 July); child text gives the year only.
3. A primary or NIST citation for the 1959 inch (child text avoids the exact figure).
4. Second pass: re-read sources 2, 3, 6 and 13 at the page, since fetches were blocked.

## Rights notes for images

No images are embedded. For build art, prefer original drawings. If a real image is wanted: Egyptian cubit rods have museum photographs (the Louvre, Turin and others; check each license; many Wikimedia Commons photographs are freely licensed); Harappan weights have photographs on harappa.com (permission needed) and on Wikimedia Commons (check each file); the *mètre des Archives* and meter standards have freely licensed photographs on Wikimedia Commons, to be confirmed per file. No photograph of a real child or real family appears.

## Review notes for the second pass

- **Numbers:** every count, ruler reading, difference, scale reading, estimate gap and history figure is in `check208.py`; the A/B/C balance and item count are parsed from the companion itself, so edits to answer order will fail the script until rebalanced.
- **Overlap:** spec 64's balance solves for unknowns; this pack only compares and counts cubes. Spec 45 and 113 work in mL; this pack never converts capacity. Conversion beyond "1 m = 100 cm" (used in C2 and C4) is spec 201's; reviewers may prefer C2 and C4 moved to Keeper's Desk only (C4 already is).
- **Story:** the footbridge plank job sits beside spec 33's job and does not replace it. Hob Pennick appears at the footbridge and the market in Acts I and II, away from his ford; the baker's shelf scene uses the miller as builder. No scene mentions the old Keeper.
