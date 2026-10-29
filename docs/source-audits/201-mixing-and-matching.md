# Source audit 201: Mixing and Matching

Date: 2026-10-25. Spec: [201](../specs/201-mixing-and-matching.md). Companion: [201 text](../content/201-mixing-and-matching-text.md).

**Method.** Eight web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (equivalent ratios by multiplying both terms; ratio against difference; bar models; dividing a quantity in a ratio; part-to-part against part-to-whole; direct proportion with unit rate, scale factor and constant of proportionality; proportional graphs through the origin; inverse proportion as a constant product; compound units; metric conversion factors; area scaling by the square of the length factor) is standard school mathematics, cross-checked against the Marble teaching-research records for the nine targets. All paints, prices, rates, shares, flood marks and times in problem items are **made-up labeled data**, verified by `check201.py` (95 checks, all passing; scratch area, not in the repo). Style verified by `style201.py` (0 em-dashes, all word limits met).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Nine chapters on the Mathematical Art" | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/HistTopics/Nine_chapters | Chapter 2, *Millet and Rice*: 46 problems on exchanging goods, especially rates among twenty kinds of grains, beans and seeds; introduces the rule of three. |
| 2 | "The Nine Chapters on the Mathematical Art" | Wikipedia | https://en.wikipedia.org/wiki/The_Nine_Chapters_on_the_Mathematical_Art | Han-dynasty compilation; title appears in the *Book of the Later Han*, so composed no later than 93 CE; dating estimates between about 200 BCE and the 1st century BCE. |
| 3 | "TCM Arithmetic 3: Rates and Unit Conversions" (Tao Steven Zheng) | Math & Physics Problems wiki | https://math-physics-problems.fandom.com/wiki/TCM_Arithmetic_3:_Rates_and_Unit_Conversions?oldid=4570 | The chapter's opening rate table (unhusked millet 50, hulled millet 30) and the *jinyou* procedure: given amount × sought rate ÷ given rate. A secondary, user-edited source; corroborated in outline by 1. |
| 4 | "Liu Hui" | MacTutor | https://mathshistory.st-andrews.ac.uk/Biographies/Liu_Hui/ | Liu Hui's commentary, traditionally dated 263 CE; not used in child text. |
| 5 | "Kilogram" | Wikipedia | https://en.wikipedia.org/wiki/Kilogram | Kilogram originally defined in 1795 as the mass of one liter of water (first at 0 °C, later at about 4 °C); the 1793 *grave* as a precursor. |
| 6 | "Mar 30, 1791 CE: Meter Defined" | National Geographic Education | https://education.nationalgeographic.org/resource/meter-defined | The National Assembly accepted the meter proposal (one ten-millionth of the pole-to-equator distance) on 30 March 1791. |
| 7 | "How a metre became a metre" | RISE, Research Institutes of Sweden (national metrology institute) | https://www.ri.se/en/story/how-a-metre-became-a-metre | Academy of Sciences proposal of 19 March 1791 for one ten-millionth of the distance from the North Pole to the equator through Paris; chosen over a pendulum unit. |
| 8 | "Metre" | Wikipedia | https://en.wikipedia.org/wiki/Metre | Delambre and Méchain survey 1792-1798/99; later redefinitions (1983 light-based). Adoption date given as 26 March 1791 in one summary. |
| 9 | NIST Handbook 44, Appendix B, "Units and Systems of Measurement" | National Institute of Standards and Technology | https://www.nist.gov/system/files/documents/2024/01/14/NIST%20HB%2044%202024%20Appendix%20B%20Units%20and%20Systems%20of%20Measurement.pdf | The United States has defined the yard as exactly 0.9144 m since 1959; inch-pound units are defined from SI units. |
| 10 | "International yard and pound" | Wikipedia | https://en.wikipedia.org/wiki/International_yard_and_pound | 1 July 1959 agreement of Australia, Canada, New Zealand, South Africa, the United Kingdom and the United States; inch exactly 25.4 mm. |
| 11 | "Trairāśika (Rule of Three)" | VigyanWiki | https://www.vigyanwiki.in/wiki/Trairāśika_(Rule_of_Three) | Considered as an Indian rule-of-three anchor; not adopted (see below). |
| 12 | Marble teaching-research records for the nine targets and the two reassigned ids | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy and misconceptions summarized in the spec's upstream check; dropped ids' records describe mental calculation and order of operations. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| *The Nine Chapters* has a chapter on exchanging grains (*Millet and Rice*), 46 problems, about twenty kinds of grain, bean and seed | 1, 2 | Checked |
| "About 2,000 years ago" for the book | 2 (no later than 93 CE; estimates 2nd-1st century BCE) | Checked as a round figure; no exact year in child text |
| Rate pair 50 (unhusked millet) and 30 (hulled millet); method: multiply by the sought rate, divide by the given rate | 3, outline in 1 | Checked against one secondary source; second pass to confirm in a scholarly translation (Shen, Crossley and Lun 1999) |
| 10 × 30 ÷ 50 = 6 as an illustration of that rate | 3 (computed, not quoted) | Arithmetic checked by script; presented as our example, not a quoted problem |
| Meter proposed in 1791 as one ten-millionth of the North Pole to equator distance | 6, 7, 8 | Checked; adoption day differs (26 or 30 March), so child text says only 1791 |
| Kilogram set in 1795 as the mass of one liter of water | 5 | Checked (single strong source excerpt); "defined in other ways today" also from 5 and 8 |
| Inch exactly 2.54 cm since 1959, six-country agreement including the United States | 9, 10 | Checked |
| Indian *trairāśika* (rule of three) with Brahmagupta, 628 | 11 and a low-quality French page | **Not adopted**: date and attribution not confirmed by a strong source in this session; kept out of child text |
| Paint shade depends on the ratio of pigments | none (made-up model) | Labeled "A made-up model; real paints vary", consistent with spec 125's caveat |

## Open checks

1. Second-pass confirmation of the 50 : 30 millet rate and the *jinyou* wording in a scholarly translation of *The Nine Chapters*.
2. Nuria's *tres quintos* ("three fifths") for a fluent reader of Spain's Spanish (spec 120 rule).
3. A possible second culture's rule-of-three anchor (the Indian *trairāśika*) if a strong source confirms text and date; not needed for this pack.

## Overlap and claim notes

- Spec 125 (draft PR #128) mixes paint by kind (red + yellow = orange); this pack adds amounts and links from its Paint and lamplight bench.
- Spec 118 (draft PR #126) Case 1 teaches ratio notation, simplifying and a ratio-vs-difference panel; Case 3's dossier uses a 2 : 3 reed-for-apples rate and a 5 : 3 nursery share. This pack recaps notation (T4), uses different goods and numbers, and leaves spec 120's reed-for-apples Sapling job to Case 3.
- Specs 45 and 113 (main) measure liquids and bridge liters and milliliters; spec 111 (main) changes a route's drawing scale; spec 178 (draft PR #150) teaches speed. Each is recapped, not re-taught.
- Siblings 198 (fraction scaling), 200 (percentages) and 206 (similar shapes) own their topics; none is claimed here.
- Ids reassigned away: `mt_vmW2cb5c7A` (now sibling spec 212) and `mt_X5cypSGoGU` (now sibling spec 192), both named "Ratio" but described in the pinned topics and research as mental calculation and order of operations with powers and reciprocals. This pack does not claim or teach them.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of scoops, bars and chalkboards. If a real image of *The Nine Chapters* is wanted, use a public-domain page scan from a library open-access collection and check each file's license. No photograph of a real child or real family appears.
