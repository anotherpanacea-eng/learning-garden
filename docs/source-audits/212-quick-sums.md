# Source audit 212: Quick Sums

Date: 2026-10-25. Spec: [212](../specs/212-quick-sums.md). Companion: [212 text](../content/212-quick-sums-text.md).

**Method.** Five web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The arithmetic (place-value addition and subtraction, column carrying and exchanging, decimals lined up by the point, counting up, compensation, near doubles, missing numbers by the inverse, estimating by rounding, multiplying before adding) is standard school mathematics and needs no outside source; it still needs the requested math check. All crossings, lengths, routes and the coast city are **made-up labeled data**, verified by `check212.py` (92 checks, all passing; scratch area, not in the repo), which regenerates every answer and every distractor from its named error and brute-forces each missing-number item for a unique solution. Style was checked by `style212.py` on the companion: 0 em-dashes, every prompt at most 15 words, every feedback and explanation at most 20 words, every teach card at most 30 words; scene lengths are within spec 120's limits (Short at most 23 words, Longer at most 145, Keeper's notes at most 36).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Johannes Widmann" | Wikipedia | https://en.wikipedia.org/wiki/Johannes_Widmann | Arithmetic book *Behende und hüpsche Rechenung auff allen Kauffmanschafft*, Leipzig, 1489; + and − first appear in print there, for surpluses and deficits in business problems. |
| 2 | "Johannes Widman" (biography) | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Widman/ | Widmann, Leipzig, the 1489 book; birth year given as 1462 (Wikipedia: about 1460). |
| 3 | "Earliest Uses of Symbols of Operation" (Jeff Miller) | MacTutor | https://mathshistory.st-andrews.ac.uk/Miller/mathsym/operation/ | + and − in Widmann's 1489 book as the first printed appearance. |
| 4 | "Highlights from the De Morgan Library" | Senate House Library, University of London | https://www.london.ac.uk/about/services/senate-house-library/collections/printed-special-collections/de-morgan-library/highlights-de-morgan-library | Library copy; the signs mark excess and deficiency in packages of merchandise, not operations; printer Konrad Kachelofen, Leipzig's earliest resident printer. |
| 5 | "Widman, Johannes" | Encyclopedia.com (Dictionary of Scientific Biography) | https://www.encyclopedia.com/science/dictionaries-thesauruses-pictures-and-press-releases/widman-or-weideman-or-wideman-johannes | Corroborates 1-3. |
| 6 | "Suanpan" | Wikipedia | https://en.wikipedia.org/wiki/Suanpan | Two upper ("heaven") beads worth 5 and five lower ("earth") beads worth 1 on each rod; each rod a place; a full rod is cleared and one bead moved on the next rod left (a carry); a 1573 book shows a one-over-five frame. |
| 7 | "Suanfa tongzong" | Wikipedia | https://en.wikipedia.org/wiki/Suanfa_tongzong | Cheng Dawei's text, published 1592; arithmetic for the abacus; 595 problems (chapter count differs between sources). |
| 8 | "Cheng Dawei" (biography) | MacTutor | https://mathshistory.st-andrews.ac.uk/Biographies/Cheng_Dawei/ | Cheng Dawei (1533-1606); the 1592 book as the most famous and influential text on the suanpan. |
| 9 | Abacus history article (F. Swetz) | Mathematical Association of America | https://old.maa.org/node/3403439 | Bead abacus developed by the Yuan period; calls the 1592 *Suan fa tong zong* illustration the earliest (contested, see Open checks). |
| 10 | Analysis of abacus images in Ming textbooks (1558, 1573) | Springer | https://link.springer.com/10.1007/978-3-319-68294-5_14 | Earlier printed abacus images than 1592 in Ming textbooks; so no "first" date in child text. |
| 11 | Chinese abacus museum record | Horniman Museum | https://www.horniman.ac.uk/object/nn16472/json | A real suanpan with the two-and-five bead pattern (corroborates 6). |
| 12 | Marble teaching-research records for the 24 targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. A few calculations match the records' own examples (for example 402 − 137 across a zero, 12,450 in E6, 52,000 in F5); the wording is the pack's own, and T16's worked example was renumbered at second review. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| A book printed in Leipzig in 1489, by Johannes Widmann, for merchants, is the first known printed use of + and − | 1, 2, 3, 4 | Checked |
| Widmann used the signs for over and under (surplus and deficit) in goods, not yet for adding and taking away | 1, 4 | Checked (child text: "goods that were over or under a weight") |
| Widmann's birth year | 1, 2, 5 | Unsettled (about 1460 or 1462); not in child text |
| Suanpan: rods are places; upper bead 5, lower bead 1; usual pattern two over five | 6, 11 | Checked |
| A full rod is cleared and one bead moves to the next rod left (a carry) | 6 | Checked (single strong source excerpt; matches the bead values arithmetically, verified by script) |
| Cheng Dawei's *Suanfa tongzong*, 1592, the best-known manual for the suanpan | 7, 8, 9 | Checked |
| Earliest picture or first date of the bead frame | 6, 9, 10 | Unsettled (1558, 1573 and 1592 all claimed in different senses); child text gives no first date |
| Topic fit: `mt_vmW2cb5c7A` is named *Ratio (age 10+)* in the pinned taxonomy, but its description and research record concern mental calculation with mixed operations | pinned `topics.json`, Marble record | Checked against the pinned files; taught as mental strategy only |

## Open checks

1. Second-pass read at source of the Widmann passage (that + and − mark goods over and under a weight) and of the suanpan carry description.
2. Nuria's line *¡Qué puente tan ocupado!* (What a busy bridge!) for a fluent Spanish reader (spec 120 rule).
3. The math check asked for in the spec's Review asks, especially the column wording against specs 107 and 110.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the pot, the handrail and the ledger. If a real image is wanted: a title page of Widmann's 1489 book is in the public domain by age (check the reproducing library's terms; the De Morgan Library and digitized German library copies are candidates); suanpan photographs are held by museums with open-access collections (for example the Horniman Museum), to be confirmed per object. No photograph of a real child or real family appears.

## Overlap and claim notes

Checked on 2026-10-25 against main (`b68d8de`) and draft PRs 126, 127, 128 and 137-151, plus the sibling math specs already in the working tree.

| Neighbor | What it already does | How this pack relates |
| --- | --- | --- |
| Spec 53 Bundle Exchange (main) | One collection regrouped as tens and ones | T1 recap only (bags of ten); no new claim. |
| Spec 77 Joining Supply Orders | 24 + 13 and 24 + 17, one regrouped ten | Builds on: three digits, two carries, carries of two. |
| Spec 78 Returning Supply Orders | 42 − 12 and 42 − 17, one opened ten | T10's first step is a marked recap; this pack adds opening across zeros. |
| Spec 91 Comparing Supply Orders | 23 − 11 as compare vs return | Builds on: comparison stories (E2) and counting up. |
| Specs 107 and 110 (main) | Supplied written ledgers for the two-digit cases | Builds on: the child writes every digit at three digits and beyond; wording kept consistent (math check ask 1). |
| Spec 121 Games Table (draft PR #128) | Bonds in Seed Pile and Shutters; claims `mt_PpWSHA-0kv` and `mt_zxST3MarI9` | No claim on those two; named mental strategies sit under this pack's own targets. |
| Spec 130 Shutters (main) | Sums to a dice roll | No overlap beyond bonds. |
| Spec 188 Long Count (proposed) | Rounding (Nearest Post), place value to ten million | Rounding used, never re-taught; its post line is reused in the Estimate Gate. |
| Spec 191 Long Orders (proposed) | Names `mt_G3sVFQNCme` as met by "planned spec 212" | This pack claims it (F4, F5). |
| Spec 192 Order of the Day (proposed) | The agreed order of operations | F8 recaps "multiply before adding" only. |
| Siblings 208, 209, 210, 211 (proposed) | Measuring, money, facts within 20, place value to 1000 | Their topics are prerequisites here, met elsewhere; none claimed. |

The coordinator reassigned `mt_vmW2cb5c7A` to this pack during writing; the updated assignment map lists it under 212 only.

**Independent review, 2026-10-25.** `mt_UQnAFPs83F` (Adding two two-digit numbers) added as a target: unassigned and unclaimed, fully taught here, and building on the atlas explanation references in Joining Ledger and Returning Ledger (`curriculum/topic-coverage.csv`). `mt_yTWxkzzoOZ` stays supported inline (atlas authored reasoning tasks only; no two-step stories within 100 here). `mt_jY7uf0Cb7o` is met elsewhere by spec 188, which now claims it. Spec 51 does not teach times-table recall (its spec lists 12 × 12 recall as an access exception), so the F7/F8 times facts are assumed and pointed to proposed spec 190. Widmann's 1489 Leipzig book and its surplus-and-deficit use of + and − were re-confirmed in search excerpts (Wikipedia, MacTutor).
