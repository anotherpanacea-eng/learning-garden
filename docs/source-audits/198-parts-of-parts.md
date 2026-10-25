# Source audit 198: Parts of Parts

Date: 2026-10-25. Spec: [198](../specs/198-parts-of-parts.md). Companion: [198 text](../content/198-parts-of-parts-text.md).

**Method.** Ten web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts with the URLs below and should be re-read at the source in the second pass). The arithmetic (whole × fraction as repeated addition; fraction × fraction by area and by multiplying numerators and denominators; multiplying by a factor below 1 gives a smaller product; "of" as multiplication; percent as hundredths; partition and measurement division; dividing by a fraction as multiplying by its reciprocal) is standard school mathematics, cross-checked against the Marble teaching-research records for the nine targets, which cite the IES fractions practice guide and the US Common Core and UK national curriculum statements. All recipes, fields, maps, prices and orders in items are **made-up labeled data**, verified by `check198.py` (184 checks, all passing; scratch area, not in the repo). The companion was checked with `style198.py` (0 em-dashes; 185 line checks within the word limits).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Rhind Mathematical Papyrus" | Wikipedia | https://en.wikipedia.org/wiki/Rhind_Mathematical_Papyrus | Scribe Ahmes (Ahmose); about 1550 BCE; copied from an older Middle Kingdom text; problems 1-6 divide loaves among 10 men. |
| 2 | Rhind Mathematical Papyrus, EA10057 / EA10058 | British Museum (collection online) | https://www.britishmuseum.org/collection/object/Y_EA10057 | Production about 1550 BCE; Ahmose dated it to year 33 of Apophis; tables of division and fractions among 84 problems; held by the museum. |
| 3 | Eves, *An Introduction to the History of Mathematics*, §2-8 notes | East Tennessee State University course notes | https://faculty.etsu.edu/gardnerr/3040/Notes-Eves6/Eves6-2-8.pdf | Problems 1-6 share 1, 2, 6, 7, 8, 9 loaves among 10 men; solutions 1/10, 1/5, 1/2 + 1/10, 2/3 + 1/30, 2/3 + 1/10 + 1/30, 2/3 + 1/5 + 1/30. |
| 4 | Joseph, *The Crest of the Peacock*, ch. 3 reading | University of Kentucky course page | https://www.ms.uky.edu/~dhje223/CrestOfThePeacockCh3-Reading2.pdf | The n/10 table; the 9-loaf division into pieces (corroborates 3). |
| 5 | "The Nine Chapters on the Mathematical Art" | Wikipedia | https://en.wikipedia.org/wiki/The_Nine_Chapters_on_the_Mathematical_Art | Chapter 1 *Fangtian* (rectangular fields): areas of fields and manipulation of vulgar fractions; composed by generations of scholars; Liu Hui's commentary 263 CE. |
| 6 | "Nine Chapters on the Mathematical Art" | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/HistTopics/Nine_chapters/ | Chapter contents; fraction arithmetic in chapters 1-2. |
| 7 | "Liu Hui" | MacTutor | https://mathshistory.st-andrews.ac.uk/Biographies/Liu_Hui/ | Commentary usually dated 263; Liu did not date it himself. |
| 8 | "Liu Hui"; "East Asian mathematics" | Britannica | https://www.britannica.com/biography/Liu-Hui | Nine Chapters as a canon of the 1st century BCE or CE; Liu supplied justifications. |
| 9 | Ferguson, "The *Suan shu shu* and the *Nine Chapters*: a comparison" | HOM SIGMAA (MAA) | https://homsigmaa.net/wp-content/uploads/2021/04/Ferguson_HOM_SIGMAA_Final_Copy.pdf | Chapter 1 rectangle rule: multiply width by length for area. |
| 10 | "Fractions (kalasavarna-vyavahara) [Chapter 3]", *Ganita-sara-sangraha* (Rangacharya translation, 1912) | Wisdom Library | https://www.wisdomlib.org/hinduism/book/ganita-sara-sangraha-by-mahavira-acharya/d/doc1603020.html | Division of fractions: make the divisor's denominator its numerator and vice versa, then multiply; or multiply divisor and dividend by each other's denominators and divide as whole numbers. |
| 11 | "Mahavira" | MacTutor | https://mathshistory.st-andrews.ac.uk/Biographies/Mahavira/ | *Ganita Sara Samgraha* about 850 CE; chapter 3 on fractions; Jain mathematician in southern India. |
| 12 | "Ganitasarasangraha" | Britannica | https://www.britannica.com/topic/Ganitasarasangraha | Written by Mahavira around 850 CE; covers fractions. |
| 13 | Marble teaching-research records for the nine targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy and misconceptions summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Rhind papyrus: Egyptian, copied by Ahmose about 1550 BCE from an older text; held by the British Museum | 1, 2 | Checked (some summaries say 1650 BCE; child text uses "about 3,500 years old" and the museum's 1550 BCE) |
| Its first problems share loaves among 10; 9 loaves gives 2/3 + 1/5 + 1/30 each | 1, 3, 4 | Checked; sums verified by script |
| Scribes wrote most fractions as sums of different unit fractions (2/3 the usual exception) | 1, 3 | Checked as general background; review ask 4 |
| Nine Chapters: Chinese, compiled over centuries, final form about the 1st century BCE or CE; "about 2,000 years ago" in child text | 5, 8 | Checked (sources differ by a century or two; child text stays approximate) |
| Its first chapter is on fields (area from width and length) and works with fractions | 5, 6, 9 | Checked |
| Liu Hui's commentary dated 263; explains why the methods work | 5, 7, 8 | Checked; child text says "in the 200s" because Liu did not date it |
| A specific fraction-sided field problem (4/7 bu by 3/5 bu, area 12/35) | none found | `[check]`; not in child text |
| Mahavira, *Ganita Sara Sangraha*, about 850 CE | 11, 12 | Checked |
| Review note, 2026-10-25 | search excerpts | Two independent review searches confirmed the date and the fractions chapter but did not surface the division verse; the swap-and-multiply rule and the second method still rest on source 10 alone (open check 2) |
| His division rule: swap the divisor's top and bottom, then multiply; second method by cross-multiplying denominators | 10 | Checked (single translation excerpt; second pass to confirm against the Sanskrit edition or a scholarly study) |
| Brahmagupta's "inversion" | search excerpts | Not used: it is a method of working backwards through operations, not the fraction-division rule |

## Open checks

1. The Nine Chapters problem with a 4/7 by 3/5 field: number and wording in a primary translation (Shen, Crossley and Lun, 1999). Not in child text.
2. Mahavira's rule: confirm the verse numbers in chapter 3 of the Rangacharya edition.
3. Rhind date in the second pass: child text follows the British Museum (about 1550 BCE).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the bench, cups and field. The Rhind papyrus is photographed in the British Museum's online collection (check the image license per file before any use; drawings of a share diagram are safer). No real photograph is needed for the Nine Chapters or Mahavira; a drawn book or palm-leaf page labeled "a drawing" is enough. No photograph of a real child or real family appears.

## Overlap and scope notes

- `#cafe/recipes` (spec 45) measures one batch in mL; `#cafe/batches` (spec 50) makes whole copies only and explicitly declines *Multiplication as scaling* (`mt_VKW8lOcFaw`); `#cafe/portions` (spec 103) joins cut pieces; `#cafe/units` (spec 113) converts L to mL; `#workshop/scale` (spec 111) uses whole-number edge keys. None multiplies or divides by a fraction.
- Sibling 186 uses the fraction-tile area model without a claim and lists `mt_AabJisinfi` as a gap; this pack claims it.
- `mt_VKW8lOcFaw` is in neither the build-out assignment map nor any claim; independent review (2026-10-25) made this pack its home: the Scaling Dial and T8 teach it, and a × 4/4 setting and a 3/2 choice in C2 were added for its equivalence link and over-correction misconception.
- `mt_gNUE4B3vuk` (dropped by sibling 197) was considered and declined: signed-number and decimal written methods are not taught here.
- The recipe uses US cups as a labeled pretend card, not a usable recipe (owner question 3 in the spec).
