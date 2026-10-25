# Source audit 210: Pairs and Bonds

Date: 2026-10-25. Spec: [210](../specs/210-pairs-and-bonds.md). Companion: [210 text](../content/210-pairs-and-bonds-text.md).

**Method.** Seven web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (matching and counting, cardinality, partners of ten, fact families, = as "is the same as", commutativity and associativity of addition, subtraction as finding a missing part, the inverse, bridging through ten) is standard early arithmetic; teaching choices follow the 24 Marble teaching-research records, paraphrased. All ducks, stones, stories and card decks are **made-up labeled data**, verified by `check210.py` (100 checks, all passing; scratch area, not in the repo). Overlap was checked by grepping `docs/specs`, `docs/content` and the draft PRs (#126, #128, #137-#151) for all 24 ids and by reading specs 15-21, 27, 50, 53, 64, 76, 86, 129, 131, 132, the Games Table proposal (PR #128, spec 121), `dist/broad-content.mjs` and the sibling assignments for specs 191, 192, 204, 211 and 212.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Bede, De temporum ratione" entry | History of Information | https://historyofinformation.com/detail.php?id=1487 | Written 725; first chapter *De computo et loquela digitorum*; finger reckoning up to 9,999 on two hands, rarely used above 100; written at Monkwearmouth. |
| 2 | "Venerable Bede's De temporum ratione" | MoMath + Wolfram history-of-mathematics artifacts | https://wolframcloud.com/obj/history-of-mathematics/production/artifacts/venerable-bedes-de-temporum-ratione | Finger and hand symbols for numbers in the book (corroborates 1). |
| 3 | "Roman Finger Counting" | tookmund.com (explainer) | https://tookmund.com/2020/05/roman-finger-counting | Bede's list used for Roman practice; units and tens on one hand, hundreds and thousands on the other. |
| 4 | "Counting on fingers in ancient Rome" | imperiumromanum.pl | https://imperiumromanum.pl/en/curiosities/counting-on-fingers-in-ancient-rome/amp/ | Roman counting tokens (first three centuries CE) broadly match Bede's descriptions, so finger numbers predate him. |
| 5 | "A computer at your fingertips" | nunc.ch | https://nunc.ch/en/a-computer-at-your-fingertips/ | Finger reckoning as a medieval calculating aid; Bede's chapter. |
| 6 | "De computo uel loquela digitorum. Beda y el cómputo digital" | Faventia (Universitat Autònoma de Barcelona) | https://ddd.uab.cat/record/23275 | Scholarly study of the chapter: number representation and a finger code for messages. |
| 7 | "Soroban" | Wikipedia | https://en.wikipedia.org/wiki/Soroban | Upper bead worth 5, lower beads worth 1; derived from the Chinese suanpan; modern 1/4 layout; complementary numbers used to carry ten in addition and subtraction. |
| 8 | Donlan and Wu, study of complementary numbers in abacus arithmetic (*Cognitive Development*, 2017; exact title to confirm) | UCL Discovery | https://discovery.ucl.ac.uk/10052259/ | Soroban calculation uses complementary numbers; studied as a real practice. |
| 9 | "How to solve Soroban addition for 73+59+97?" | Art of Memory forum | https://forum.artofmemory.com/t/how-to-solve-soroban-addition-for-73-59-97/44938 | Worked method: 9 = 10 − 1, add ten and take one; adding 7 as 5 + 2 with the top bead. |
| 10 | "I'm counting on it" | Chalkdust magazine | https://chalkdustmagazine.com/features/im-counting-on-it/ | Soroban history and layout (corroborates 7). |
| 11 | Ten-frame origin searches | NRICH; NCTM; Rhodes University SANC reading | https://nrich.maths.org/2479 ; https://www.ru.ac.za/media/rhodesuniversity/content/sanc/documents/SANC_10-frames_reading.pdf | Ten-frames widely used for numbers 0-10; development credited to researchers such as Van de Walle and Bobis (1988). No source found naming a single inventor. Not used as an anchor. |
| 12 | Marble teaching-research records for the 24 targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |
| 13 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach, guided, practice; the "I'm stuck" ladder; three-option choices; glossary. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Bede wrote *De temporum ratione* (*The Reckoning of Time*) in 725 | 1, 2 | Checked |
| Its first chapter is on computing and speaking with the fingers | 1, 6 | Checked |
| Two hands could show up to 9,999 | 1 (one source cites Smith for "up to one million" with body positions) | Checked for 9,999 as the usual reading; Keeper's note says "most accounts" |
| Numbers over 100 rarely used | a Sotheby's catalogue entry and source 1 only | `[check]` (independent review, 2026-10-25: no scholarly confirmation found); removed from the Keeper's note |
| Finger numbers were older than Bede (Roman counters match his shapes) | 3, 4 | Checked (two secondary sources; Keeper's note words it as "people already used them before him") |
| "About 1,300 years ago" | 725 to 2026 is 1,301 years | Checked by script |
| Units and tens on the left hand specifically | 3, 5 (not Bede-specific in excerpts) | `[check]`; kept out of child text |
| Bede wrote at Monkwearmouth (twin house of Jarrow) | 1 | Checked; child text says only "a monk in England" |
| Soroban: top bead worth 5, bottom beads worth 1 | 7, 9 | Checked |
| Soroban descends from the Chinese suanpan | 7, 10 | Checked |
| Today's soroban has one top bead and four bottom beads per rod | 7, 10 | Checked |
| Date of the four-bead change (1930 vs other dates) and of the suanpan's arrival in Japan (14th vs late 16th century) | 7, 10 | Unsettled; no dates in child text |
| Soroban users add and subtract with complements of ten (9 = 10 − 1) | 7, 8, 9 | Checked (forum worked example plus encyclopedia and a published study) |
| Ten-frame invented by a named person in the 1970s | 11 | Not found; `[check]`; not used |
| Matching settles more/fewer before counting; conservation errors with spread-out rows | 12 (`mt__h7hvT4tEb`) | Standard; follows the research record |
| = should be read relationally from the start; true/false sentences need genuinely equal or unequal sides | 12 (`mt_8RmpkDxT9L`) | Standard; D2 checked by script |
| Fluency is accuracy, efficiency and flexibility; timed tests are avoided | 12 (`mt_ghF3Vv6taM`, `mt__we2TDqnJx`, `mt__t4afSyZRm`, `mt_3e_PQxwC12`) | Adopted; no timing anywhere |

## Pinned descriptions that differ from names

- `mt_aHAM29nidj` *Counting forwards and backwards*: description is counting in steps of 3 from 0, forwards and back. Taught as threes (T6, B5).
- `mt_OkSJfrmFb_` *Counting forwards and backwards (age 6+)*: description is counting in tens from any number. Taught on the Lily Square (T7, B6), stopping below 100 for sibling 211.
- `mt_e8CZ7E5qW7` *Number bonds to 9*: description is partners of ten for 1-9 (also noted in source audit 67). Taught as partners of ten (T9, C2).
- `mt_3e_PQxwC12` *Fluent addition and subtraction*: description adds derived facts to 100; met here for recall to 20 and decade facts derived from bonds (F4, the Long Path); spec 212 practices wider strategies without claiming it.

## Open checks

1. Bede's hand-by-hand assignment of units, tens, hundreds and thousands, at the Latin source. Not in child text.
2. Soroban dates (suanpan's arrival in Japan; the four-bead standard). Not in child text.
3. Any history of the ten-frame. Not used.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of ducks, stones, ropes and ten-frames. If a real image is wanted: manuscript pages of Bede's finger-number diagrams are held by several libraries (later medieval copies), and some are public domain scans; check each library's terms. Soroban photographs on Wikimedia Commons carry individual licenses to check per file. No photograph of a real child or real family appears.
