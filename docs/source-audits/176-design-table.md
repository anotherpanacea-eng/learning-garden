# Source audit: spec 176, The Design Table

Date: 2026-10-25. Pack: [spec 176](../specs/176-design-table.md) and [its companion text](../content/176-design-table-text.md).

**Method and limits.** Direct page fetches are blocked in this session, so facts were checked against web-search excerpts from the sources below (7 searches, well inside the wave budget of 18). A second fact-check pass with ordinary page access should open each cited page. Most of the pack is method (design, testing, trust, reporting) taught through labeled made-up models; the real-world claims are few and are listed here one by one.

## Sources consulted

| Source (publisher) | URL | Supports |
| --- | --- | --- |
| The Wright brothers, 1901 wind tunnel essay (U.S. Centennial of Flight Commission) | https://centennialofflight.net/essay/Wright_Bros/1901/WR3.htm | Tests on "some 200" wing shapes in late October and early November 1901. |
| The Wright Story 1901-2 (U.S. Centennial of Flight Commission) | https://centennialofflight.net/wbh/wr_experience/tunnel/math/WBstory.htm | Tunnel work leading from the 1901 to the 1902 glider. |
| 1901 tests and bicycle tests (NASA Glenn Research Center, Beginner's Guide to Aeronautics) | https://www.grc.nasa.gov/www/K-12/airplane/wrights/test1901.html ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/1901-bicycle-tests | The 1901 aircraft produced only about a third of the lift the Lilienthal data predicted; the brothers came to doubt the accepted Smeaton coefficient; homebuilt tunnel, more than 200 small wings; data used to design the 1902 glider. |
| Breakthrough lesson (Smithsonian Education) | https://smithsonianeducation.org/educators/lesson_plans/wright/breakthrough.html | Tunnel built in fall 1901 from a wooden box with a fan blowing a steady stream of air on miniature wings. |
| The Wright brothers' first flight at Kitty Hawk (Smithsonian Institution Archives; Smithsonian Insider; Guinness World Records) | https://siarchives.si.edu/collections/siris_sic_9650 ; https://insider.si.edu/2011/12/the-wright-brothers-flight-1903 ; https://www.guinnessworldrecords.com/world-records/first-power-driven-flight | 17 December 1903; Orville at the controls; 12 seconds, 120 feet; Flyer now at the National Air and Space Museum. 120 ft ≈ 36.6 m (computed). |
| Mary Anderson (National Inventors Hall of Fame; Lemelson-MIT; NPR, 2017) | https://www.invent.org/blog/inventors/mary-anderson-windshield-wipers ; https://lemelson.mit.edu/resources/mary-anderson ; https://www.npr.org/transcripts/536835744 | Birmingham, Alabama; snowy New York streetcar ride (a traditional story; dates in secondary accounts vary from 1902 to winter 1903 or "around the turn of the century", so the text says "soon after 1900; the exact year isn't known"); driver leaning out to clear the glass; hand lever inside swinging a rubber blade; US Patent 743,801, granted 10 November 1903; she did not profit (patent expired 1920; Cadillac made wipers standard in 1922). |
| Philosophical Transactions of the Royal Society (Smithsonian Libraries digital copy v.1-2; PMC article on 350 years; encyclopedia summary) | https://library.si.edu/digital-library/book/philosophicaltr1roya ; https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4360128/ ; https://en.wikipedia.org/wiki/Philosophical_Transactions_of_the_Royal_Society | First issue 6 March 1665, edited by Henry Oldenburg; longest-running science journal; "first" is contested because the *Journal des sçavans* began in January 1665, so the text says "one of the first". |
| 3-5-ETS1-1 (California Department of Education, CA NGSS) and NYSSLS page | https://www2.cde.ca.gov/cacs/id/web/29020 ; https://nyssls.info/index.php/3-5-ETS1-1 | A design problem defined with criteria for success and constraints on materials, time or cost (ETS1.A). Our paraphrase; no standard wording reproduced in child text. |
| Engineering is Elementary design process (Museum of Science, Boston, via OMSI and TERC guides crediting it) | https://omsi.edu/wp-content/uploads/2024/03/DOW-Engineering-Design-Process.pdf ; https://www.terc.edu/hse/wp-content/uploads/sites/18/2021/02/1.-EngCheatSheet_HSE2.0_01-01-17-1.pdf | Five steps, Ask, Imagine, Plan, Create, Improve; the cycle repeats. Named in the spec only, as a teaching convention. |

**Marble and Jane.** Marble teaching-research records (`withmarbleapp/os-taxonomy` at `7bd8b67`) for the seven targets were read and paraphrased, never quoted (CC BY-SA). Their own review notes say the records are unverified rewrites with research-informed, not validated, activities; the spec uses them as design guidance only. Jane (`0ec55f7`) patterns were adopted as listed in the spec. Pinned ids and hard prerequisites come from `curriculum/topic-coverage.csv` and `curriculum/marble/dependencies.json` in this repo.

## Fiction and models (no source needed, labeled in the text)

- Willowbank, its cast, Dot's bags, the Ways crate, the *Gazette* column: **A story from Willowbank**.
- Two-bag rain and carry numbers, the crate grid, the paper footbridge results (including the leveling off at 20 folds), Wren's and Pip's tries: **A made-up model**. That pleated paper holds more than flat paper is a common classroom observation and is not claimed as data; the numbers and the leveling point are invented.
- Shape-and-job examples (sloped lid, wide base, ridged ramp) are everyday worked examples, not physics claims.

## Numbers

All numbers, including every wrong-answer value, were checked with `work-176/check.py` (scratch, not in the repo), run with `python3 -I` on 2026-10-25: both passes printed "all checks pass" and "item checks pass".

## Open checks (settled in the review pass below)

- **[check] Wright details:** "about 200" wings (Centennial of Flight says "some 200", NASA "more than 200"); "about a third" of predicted lift for the 1901 glider (NASA). Confirm against National Air and Space Museum pages.
- **[check] Mary Anderson's trip year:** 1902 or winter 1903; the text keeps "about 1902 (accounts differ)". The "standard by about 1913" line is in the spec only.
- **[check] Philosophical Transactions:** "one of the first science journals" and "still published"; confirm with the Royal Society's own history page.
- **[check] Peer review line:** "other scientists usually check a report before it is published" is a general description, kept to one Keeper's Desk sentence; a subject reviewer should confirm the wording suits young readers.

## Review pass (2026-10-25, independent reviewer)

Three web searches (NASA Glenn and Centennial of Flight pages; Wikipedia, History.com and NIHF on Anderson; Cambridge *Historical Journal*, JSTOR Daily and St Andrews on early refereeing). Findings and fixes:

- **Wrights:** 1901 glider about one-third of predicted lift, and more than 200 tunnel wings (Sept to Dec 1901), confirmed. "The old tables were wrong" overclaimed: the Wrights found Smeaton's long-used coefficient (0.005) too high (about 0.0033) and Lilienthal's data valid for his own wing shape only. Child text now says the old figures "didn't fit their wings, and a long-trusted number was too big". 17 December 1903, 120 ft, 12 s stand.
- **Anderson:** patent 743,801, filed 18 June 1903, issued 10 November 1903, confirmed. The trip year is undocumented; text softened. "Common about a decade later" replaced.
- **Philosophical Transactions:** 1665 and "one of the first" kept; no "oldest continuously published" claim (publication paused for a few years after 1679). Peer review: Oldenburg ran no review system; refereeing grew in the late 18th and 19th centuries and became usual at journals only in the 20th. The card now says peer review came "much later".
- **Story:** Act VI scene no longer has Wren pick; she asks the explorer which idea is most promising (spec 120: the explorer keeps the plan).
- **Scope:** the Keeper's Desk fact, judgment or guess sorter was cut as an itemless add-on. Prerequisite `mt_rDjtmDogJr` is now met in part by draft 175.
- **Math:** every number and wrong-answer value recomputed (`review-176/m.py`, scratch); all correct.

## Images and rights

No images are embedded. If art references are wanted: the 1903 first-flight photograph (Smithsonian / Library of Congress copies; pre-1927, public domain in the US), the patent drawing for US 743,801 (US patent drawings are public domain) and the 1665 title page of *Philosophical Transactions* (public domain; Smithsonian Libraries and Biodiversity Heritage Library scans). Willowbank art is original.
