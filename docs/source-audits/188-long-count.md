# Source audit 188: The Long Count

Date: 2026-10-25. Spec: [188](../specs/188-long-count.md). Companion: [188 text](../content/188-long-count-text.md).

**Method.** Five web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (place value to ten million, comma groups, rounding half up, ranges of rounded values, × and ÷ by powers of ten, exponents, thousandths, standard form) is standard school mathematics and needs no web source; it is checked by the math reviewer and by script. All counts in the town (seeds, bricks, reeds, the Gazette's totals) are **made-up labeled data**, verified by `check188.py` (65 checks, all passing; scratch area, not in the repo), including a brute-force uniqueness check for the E3 puzzle. Pedagogy follows the Marble teaching-research records for the seventeen targets (two, `mt_jY7uf0Cb7o` and `mt_MHaiUd2FLA`, added in independent review) (Marble `7bd8b67`, CC BY-SA, paraphrased, never copied) and Jane `0ec55f7` `LESSONS.md`.

**Anchor choice.** The assignment offered Archimedes' *Sand Reckoner*, Inca khipu and Fibonacci's *Liber Abaci*. *Liber Abaci* and the journey of Hindu-Arabic numerals are already taught in draft spec 138 (numeral bench and Baghdad reading), so they are left out here to avoid re-teaching. The two anchors kept come from the Andes and ancient Syracuse.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "The Sand Reckoner" | Wikipedia | https://en.wikipedia.org/wiki/The_Sand_Reckoner | Archimedes (3rd century BC); addressed to Gelo II of Syracuse, son of Hiero II; aims to bound the grains of sand that fill the universe; Greek numerals stopped at a myriad (10,000); a myriad myriads (10⁸) as the first order, building higher orders; about eight pages in translation; answer usually given as about 8 × 10⁶³; uses Aristarchus' heliocentric universe. |
| 2 | "Archimedes: The Sand Reckoner" | Weber State University (physics) | https://physics.weber.edu/carroll/archimedes/sand.htm | System based on powers of a myriad myriad; expresses numbers up to 8 × 10⁶³ in modern notation (corroborates 1). |
| 3 | "The Sand Reckoner" | UC Santa Cruz / Lick Observatory page | https://ucolick.org/~laugh/reckoner.shtml | Summary of the work and its large-number system (corroborates 1). |
| 4 | "This Week's Finds", week 153 | John Baez, UC Riverside | https://math.ucr.edu/home/baez/week153.html | Discussion of Archimedes' large-number system (corroborates 1). |
| 5 | Mathematical Gazette listing (abstract) | Cambridge University Press | https://resolve.cambridge.org/core/journals/mathematical-gazette/most-cited?pageNum=25 | An abstract phrasing the bound as fewer than 1000 units of the seventh order (10⁵¹), tied to a smaller universe; source of the discrepancy noted below. |
| 6 | "Leslie Leland Locke" | Wikipedia | https://en.wikipedia.org/wiki/Leslie_Leland_Locke | Locke usually credited with first showing base-ten positional reading of khipu knots; some say on limited evidence. |
| 7 | "Knot Just Numbers" (lecture transcript, 2021) | Gresham College | https://www.gresham.ac.uk/sites/default/files/transcript/2021-10-20-1600_MEDRANO_BSHM-T.pdf | Locke's 1912 *American Anthropologist* article; a khipu at the American Museum of Natural History whose top cords equal the sum of pendant cords; knots are the element surely known to record numbers. |
| 8 | "Leland Locke shows how the Inca quipu system of mathematical record-keeping worked" | History of Information | https://historyofinformation.com/detail.php?id=2081 | 1912 paper showed decimal accounting records on khipu of the Inca Empire and earlier societies. |
| 9 | "Quipu" | Encyclopaedia Britannica | https://www.britannica.com/technology/quipu | Knot clusters for units, tens, hundreds and higher powers of ten, higher places nearer the main cord; absence of knots records zero. |
| 10 | "Quipu" | Wolfram MathWorld | https://mathworld.wolfram.com/Quipu.html | Knot types and decimal positions (corroborates 9). |
| 11 | "Early Counting Systems" | Lumen Learning (open textbook) | https://content.one.lumenlearning.com/quantitativereasoning/?p=44 | Simple knots for tens and up, long knots (2-9 turns) for units, figure-eight knot for 1; no separate zero sign, a blank position instead; worked example 452. |
| 12 | "Knotted Strings and Inca Accounts" | Science News | https://www.sciencenews.org/article/knotted-strings-and-inca-accounts | Khipu as Inca accounting records; Ascher work on numerical khipu (context). |
| 13 | "The Inka khipu" | Smarthistory | https://smarthistory.org/?p=62478 | Cord-keepers (khipukamayuq) organized from local to Cusco; censuses, storehouse and tribute records; not all knots are numbers. |
| 14 | University of Melbourne news item on khipu research | University of Melbourne | https://findanexpert.unimelb.edu.au/news/94927-the-incas-used-mysterious-stringy-objects-called-%E2%80%98khipus%E2%80%99-to-record-data.-we-just-got-a-step-closer-to-understanding-them | Khipu recorded data; scholarship still ongoing (context). |
| 15 | Marble teaching-research records for the seventeen targets (and `mt_b4lbTOJYwI`, read and dropped; now owned by proposed spec 199) | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |
| 16 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach → guided → practice; "I'm stuck" ladder; misconception-tagged choices; glossary. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Archimedes wrote *The Sand Reckoner*, 3rd century BCE, addressed to King Gelon (Gelo II) of Syracuse | 1, 2 | Checked |
| He asked how many grains of sand would fill the universe as he pictured it, and showed the number is finite | 1, 2, 3 | Checked |
| Greek number words stopped at a myriad, 10,000; he took a myriad of myriads (10⁸) as a new unit | 1, 2 | Checked |
| "More than 2,000 years ago" | 1 (3rd century BCE) | Checked |
| Modern accounts usually give his answer as about 8 × 10⁶³ | 1, 2 | Checked as the usual figure; one abstract (5) gives 10⁵¹ for a smaller universe and one popular source gives 10⁶³. Child text says only "Modern books usually write his answer as about 8 × 10⁶³" in the Keeper's note. Second pass: confirm against a scholarly translation (Heath). |
| Khipu: Inca record keepers in the Andes kept counts on knotted cords hanging from a main cord | 9, 11, 13 | Checked |
| Biggest place nearest the main cord, ones farthest; a blank position means zero | 7, 9, 11 | Checked |
| Ones: long knots with 2-9 turns, figure-eight for 1; higher places: clusters of simple knots | 9, 10, 11 | Checked (F1 uses a 5-turn knot for 5) |
| Locke is usually credited with showing the base-ten reading, 1912 | 6, 7, 8 | Checked (one summary gives the 1920s; the 1912 *American Anthropologist* date has three sources). Child text says "usually credited". |
| On some khipu one cord holds the total of others | 7, 12 | Checked (Locke's AMNH example; Ascher work) |
| Not every khipu is numbers; other features only partly understood | 7, 13, 14 | Checked |
| Khipukamayuq trained for two years; about 1,400 khipu survive | 13 | `[check]` (single excerpts each); not in child text |
| Place-value, rounding, range, powers-of-ten and standard-form statements | standard mathematics | Math check requested; every number scripted |

## Open checks

1. Archimedes' answer: confirm the "about 8 × 10⁶³" wording against a scholarly translation; if the reviewer prefers, the Keeper's note can say "a number more than sixty digits long" instead, which is true of the usual figure.
2. Nuria's Spanish number, *Cuatrocientos tres mil setenta y dos* (403,072), for a fluent Spanish reader (spec 120 rule). Grammar is standard (no "y" between hundreds and thousands; "setenta y dos").
3. `[check]` items above (khipukamayuq training time; number of surviving khipu) stay out of child text.

**Independent review, 2026-10-25.** Repeated searches on *The Sand Reckoner* (Wikipedia, Weber State, UC Santa Cruz excerpts: the Greek system named numbers up to a myriad; a myriad myriads as the new unit; addressed to Gelo II; about 8 × 10⁶³ for Aristarchus's universe, with smaller bounds in some accounts) and on Locke's 1912 *American Anthropologist* paper ("The Ancient Quipu, a Peruvian Knot Record", vol. 14; figure-eight knot for 1; place by distance from the main cord). Both anchors stand as written; no child-text change was needed for facts.

## Rights notes for images

No images are embedded. For build art, prefer original drawings: a schematic khipu cord (main cord, three hanging cords, knot clusters) drawn fresh, never traced from a museum photograph. If a real image is wanted, several museums (for example the American Museum of Natural History, source 7) hold khipu; confirm each image's license and that the object may be shown. Archimedes portraits are later imaginings, so none is used. No photograph of a real child or real family appears.
