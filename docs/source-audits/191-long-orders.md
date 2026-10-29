# Source audit 191: Long Orders

Date: 2026-10-25. Spec: [191](../specs/191-long-orders.md). Companion: [191 text](../content/191-long-orders-text.md).

**Method.** Six web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The arithmetic (place value and powers of ten, the commutative, associative and distributive properties, the area model and long multiplication, short division, chunked long division, remainder interpretation, rounding) is standard school mathematics and is not sourced claim by claim; it is checked by script. All orders, crates, prices, trips and weights in problem items are **made-up labeled data**, verified by `check191.py` (82 checks, all passing; scratch area, not in the repo, run with `python3 -I`). The companion was checked by `style191.py` (0 dashes; all word limits met). Pedagogy follows the Marble teaching-research records for the thirteen targets at Marble `7bd8b67` and Jane `LESSONS.md` at `0ec55f7`, paraphrased (CC BY-SA text not copied).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | Rhind Mathematical Papyrus (collection object EA 10057) | British Museum | https://www.britishmuseum.org/collection/object/Y_EA10057 | Museum number EA 10057; dated about 1550 BC; copied by the scribe Ahmose (Ahmes) from an older text of Amenemhat III's reign; dated year 33 of the Hyksos king Apophis. |
| 2 | Rhind papyrus highlight page | British Museum | https://www.britishmuseum.org/explore/highlights/highlight_objects/aes/r/rhind_mathematical_papyrus.aspx | Corroborates 1; small fragments in the Brooklyn Museum; central section missing. |
| 3 | "Mathematics in Egyptian Papyri" | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/HistTopics/Egyptian_papyri/ | Multiplication by repeated doubling and adding the rows that make up the other factor; division by the same table. |
| 4 | "Nature" note on the Rhind papyrus (1928) | Nature | https://www.nature.com/articles/122195a0 | Older date range (1788-1580 BC) and the scribe's statement that he copied an older text. Superseded on date by 1. |
| 5 | Rhind papyrus purchase and transfer | historyofinformation.com | https://historyofinformation.com/detail.php?id=1354 | Henry Rhind bought it in 1858; reached the British Museum in 1864 (not used in child text). |
| 6 | "Lattice multiplication" | Wikipedia | https://en.wikipedia.org/wiki/Lattice_multiplication | Earliest recorded lattice method in Arabic mathematics in Ibn al-Banna's *Talkhīṣ a‘māl al-ḥisāb* (Maghreb, late 13th century); earliest European example an anonymous English Latin treatise about 1300; Fibonacci's *Liber Abaci* describes a related chessboard grid without diagonals, and attributing the lattice to him is an error; *gelosia* and *shabaka* both mean a window grille. |
| 7 | "Lattice Multiplication: History" | Liquisearch (Wikipedia mirror) | https://www.liquisearch.com/lattice_multiplication/history | Corroborates 6 on Fibonacci's *quadrilatero in forma scacherii*. |
| 8 | Mathematical Treasure on lattice/gelosia | Mathematical Association of America | https://www.maa.org/node/864417 | Earliest extant European example in a 14th-century Latin manuscript. |
| 9 | "al-Marrakushi ibn Al-Banna" (biography) | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Al-Banna/ | Worked in Marrakesh; *Talkhīṣ* is his best-known work; died 1321 (MacTutor 13 July, other sources 31 July). |
| 10 | "Ibn al-Banna' al-Marrakushi" | Wikipedia | https://en.wikipedia.org/wiki/Ibn_al-Banna%27_al-Marrakushi | Dates 1256-1321; birth details not fully settled. |
| 11 | "Napier's rods" | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Extras/Napier_rods/ | Rods with a digit's multiples on each face; often called "Napier's bones". |
| 12 | "Rabdology" | Wikipedia | https://en.wikipedia.org/wiki/Rabdology | *Rabdologiae* published in Edinburgh in 1617, in Latin, the year of Napier's death; method based on lattice multiplication; multiplication reduced to addition. |
| 13 | Napier's bones (collection object) | Royal Museums Greenwich | https://rmg.co.uk/collections/objects/rmgc-object-42338 | A surviving set of rods (candidate image source). |
| 14 | *Rabdologiae* (digitized) | Smithsonian Libraries | https://library.si.edu/digital-library/book/rabdologiaseunu00napi | Digitized 1617 edition (candidate image source). |
| 15 | Marble teaching-research records for the thirteen targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased) | local clone | Constraints, misconceptions and activities summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Rhind papyrus: about 1550 BCE ("about 3,500 years ago"), British Museum, scribe Ahmes, copied from an older scroll | 1, 2, 4 | Checked (museum date preferred over older 1650 BCE estimates) |
| The papyrus multiplies by repeated doubling and adding chosen rows | 3, 1 | Checked |
| The 13 × 24 worked example | none needed | Our own example, verified by script; child text does not say it is on the papyrus |
| Lattice method recorded by Ibn al-Banna in Marrakesh, late 13th century ("over 700 years ago"); earliest recorded use in Arabic mathematics | 6, 9, 10 | Checked, narrowed in independent review: source 6 calls it the earliest Arabic use and gives an English Latin treatise of about 1300 as the earliest European one, so the spec no longer says "earliest recorded" without qualification; child text never claimed he was first |
| *Gelosia* names a window screen | 6 | Checked (single strong summary; second pass to confirm) |
| Fibonacci introduced the lattice in *Liber Abaci* (1202) | 6, 7 | **Not used.** Sources say he described a related grid without diagonals; one lecture note repeats the older attribution. Kept out of child text. |
| Napier's *Rabdologiae*, Edinburgh, 1617; rods called "Napier's bones"; lattice-style reading turns multiplying into adding | 11, 12 | Checked |
| Rods as the basis of the slide rule | library summary only | `[check]`; not used |
| 46 × 7 on the rods (row 7 reads 2 and 8, then 4 and 2; diagonal sums 2, 12 and 2, carried to 322) | none needed | Our own example, verified by script; the card now shows the carry |

## Open checks

1. Ibn al-Banna's death date (13 or 31 July 1321): not in child text.
2. *Gelosia* as "window screen": second-pass confirmation at a dictionary or history source.
3. Nuria's Spanish line, *¡Hola desde Vadoalto!*, for a fluent Spanish reader (spec 120 rule).
4. Ages in the Rhind card: "about 3,500 years" is rounded from about 1550 BCE; keep it rounded.

**Independent review, 2026-10-25.** Repeated searches on lattice multiplication (Wikipedia and mirrors: Ibn al-Banna's *Talkhīṣ* is the earliest Arabic use; the Fibonacci attribution is an error, his *quadrilatero in forma scacherii* lacks the diagonals; *shabaka* and *gelosia* both name a window grille), on the Rhind papyrus (MacTutor: about 1550 BCE, Ahmes copying an Amenemhat III text, multiplication by doubling) and on *Rabdologiae* (Wikipedia, Smithsonian: Edinburgh, 1617). The writer's correction away from Fibonacci is right; the spec's "earliest recorded" was narrowed to Arabic mathematics.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of crates, bars, trays and rods. If a real image is wanted: the British Museum publishes collection images of EA 10057 under its own terms (check the license per image); Royal Museums Greenwich and the Smithsonian hold Napier's rods and a digitized *Rabdologiae* (check each record's terms); medieval lattice manuscripts are public domain as works, but photographs need per-file license checks. No photograph of a real child or real family appears.

## Pedagogy notes (paraphrased from Marble research, not copied)

- Every target's research rejects "add a zero" and asks for place-value reasons; the pack never states that rule except as a misconception to answer (A5, B6).
- Several records warn that recognition formats consolidate but do not build the skill. The pack pairs each three-choice set with construction on a bench (Swap to tens, Cut, Copy the bar, Fill a part, Take a chunk, Round it) and keeps most Sapling and Keeper's Desk items as number entry with worked rows.
- The division records ask for fraction, decimal and rounded remainders all to be practiced, and for an inverse check every time: E3-E7 cover all five meanings and every Share Ledger case ends with Multiply back.
- The *Decimal place value* (`mt_SoDP1fSQEB`) record's description is decimal × whole number despite the title; the pack follows the description and does not multiply two decimals.
- Arithmetic slips found in research text (for example a wrong remainder in one record's design notes, already corrected there) did not reach this pack; all numbers here are our own and script-checked.
