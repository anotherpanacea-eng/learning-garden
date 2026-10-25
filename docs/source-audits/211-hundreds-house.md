# Source audit 211: The Hundreds House

Date: 2026-10-25. Spec: [211](../specs/211-hundreds-house.md). Companion: [211 text](../content/211-hundreds-house-text.md).

**Method.** Four web searches (WebSearch). Page fetches were not used in this session, so every real-world claim rests on search-result excerpts and should be re-read at the source in the second pass. The mathematics (base-ten place value, number names in American style, counting and roll-over, 10 and 100 more or less, comparing from the highest place, scaling a known fact by place) is standard primary mathematics and needs no outside source beyond the curriculum statements named in the pinned topics (CCSS-M 1.NBT.1, 1.NBT.2c, 1.NBT.5, 2.NBT.1-4, 2.NBT.8; England's national curriculum Year 1-3 number and place value). All seed counts, orders, piles and puzzle numbers are **made-up labeled data**, verified by `check211.py` (74 checks, all passing; scratch area, not in the repo). Teaching approaches come from Marble's teaching-research records for the thirteen targets, paraphrased and never copied.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Counting rods" | Wikipedia | https://en.wikipedia.org/wiki/Counting_rods | Rod numerals are positional; vertical forms for units, hundreds, ten-thousands and horizontal forms for tens, thousands, alternating to avoid confusion; zero shown as a blank space, no symbol; the *Sunzi Suanjing* records the rule. |
| 2 | "The Chinese rod numeral legacy and its impact on mathematics" (Lam Lay Yong) | Singapore Mathematical Society, *Mathematical Medley* 15(2) | https://sms.math.nus.edu.sg/smsmedley/Vol-15-2/The%20Chinese%20rod%20numeral%20legacy%20and%20its%20impact%20on%20mathematics(Lam%20Lay%20Yong).pdf | *Sunzi Suanjing* written about 400 CE; its rule "the units are vertical, the tens horizontal, the hundreds stand, the thousands prostrate"; rods set out on a board. |
| 3 | "Sunzi Suanjing" | Wikipedia | https://en.wikipedia.org/wiki/Sunzi_Suanjing | The book and its date range (3rd to 5th century CE in common accounts); describes rod layout and manipulation. |
| 4 | "Reflections on Chinese Numeration Systems" | Mathematical Association of America | https://maa.org/book/export/html/3403381 | Blank space used for zero in rod numerals (corroborates 1). |
| 5 | "Soroban" | Wikipedia | https://en.wikipedia.org/wiki/Soroban | Each rod has one upper bead worth five and four lower beads worth one, separated by a bar; odd number of rods; descended from the Chinese suanpan; taught in Japanese schools. |
| 6 | "The Japanese Soroban" (Hosking et al., *Convergence* on Taisei Sankei) | Mathematical Association of America | https://old.maa.org/sites/default/files/images/upload_library/46/Hosking-abacus/Convergence_TaiseiSankei.pdf | Abacus reached Japan by the late 1500s; earliest known Japanese soroban dated 1591; early design two upper and five lower beads, reduced later to one upper and then four lower. |
| 7 | Soroban (accession entry) | Whipple Museum of the History of Science, University of Cambridge | https://collections.whipplemuseum.cam.ac.uk/objects/13518 | Soroban taught in Japanese primary schools as part of mathematics. |
| 8 | Abacus artifact note | System Source Computer Museum | https://museum.syssrc.com/artifact/20/ | Gives about 1600 for the soroban's arrival in Japan (a third dating; weak). |
| 9 | Marble teaching-research records for the thirteen targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy, constraints and misconceptions summarized in the spec's upstream check. |
| 10 | Pinned topics and dependencies | `curriculum/marble/topics.json`, `dependencies.json` (pin `96a7933`) | in repo | Target ids, names, curriculum standards and hard prerequisites. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Chinese counting rods set out numbers by place on a board | 1, 2, 3 | Checked |
| Rule in the *Sunzi Suanjing*: ones vertical, tens horizontal, hundreds vertical (alternating) | 1, 2 | Checked (search excerpts quote the rule) |
| A blank space held an empty place; no zero sign in the rods themselves | 1, 4 | Checked. When a written zero sign entered Chinese texts is `[check]`; not in child text. |
| *Sunzi Suanjing* written "more than 1,500 years ago" | 2, 3 | Checked as a safe span: about 400 CE in source 2, 3rd to 5th century in common accounts; even 500 CE is more than 1,500 years before 2026. Exact date `[check]`, not in child text. |
| Rods in use from the Warring States period to about the 16th century | 1 (secondary claim) | `[check]`; not in child text |
| Soroban rods are places; one 5-bead above, four 1-beads below | 5, 6 | Checked; the script confirms one 5-bead plus four 1-beads show exactly 0 to 9 |
| Soroban descends from the Chinese suanpan; early Japanese frames had two upper and five lower beads, reduced later | 5, 6 | Checked (sequence and dates differ between sources; child text says only "more beads, later one above and four below") |
| Oldest known Japanese soroban dated 1591 | 6 | Single source; `[check]`; not in child text |
| Date the abacus reached Japan (14th century, late 1500s, or about 1600) | 5 (mirror), 6, 8 | Unsettled; not in child text |
| Date the one-over-four form became standard (1930s vs 1940s accounts) | weak summaries only | `[check]`; not in child text |
| Soroban taught in Japanese schools today | 5, 7 | Checked |
| A rod with no beads at the bar shows zero and holds its place | 5 (layout) | Checked from the bead layout; standard reading |
| Number names in American style without "and" | standard usage; spec 188 uses the same convention | Convention, stated in the companion header; "and" accepted when read aloud |

## Why these anchors

Egyptian hieroglyphic numerals (the coil of rope for 100) were the assignment's first suggestion. They are left out because draft spec 138's numeral bench (PR #137) already builds numbers with the stroke, hobble and coil, and draft spec 134's number tray supplies those tiles; spec 138's zero card also already contrasts 105 and 15 across systems. Counting rods and the soroban instead show **place without symbols for the places**: position alone, and an empty spot or empty rod as zero. Proposed spec 189 (math build-out) uses counting rods for a different fact (red and black rods for gains and losses, from Liu Hui); H1 here is about layout by place, and neither card repeats the other's claim. Two cultures (China, Japan) are represented; spec 188's khipu and Sand Reckoner and spec 138's Indian, Islamic-world and European material cover others.

## Overlap and claim check

- `grep -ril` on main for "storehouse", "soroban", "abacus", "counting rod" and each target id: only sibling spec 188 names two targets (as met by this spec) and proposed spec 189 uses counting rods for negatives.
- Draft PRs 126, 128, 137-151: no spec file names any of the thirteen targets (checked by grepping each changed spec and content file at `pr/N`).
- `#numbers/storehouse` is unused in `dist/app.mjs` and in every spec.
- The Number Garden's three-digit questions (`number-anchor`, `number-anchor-alt`, `number-explore` in `dist/broad-content.mjs`) ask a digit's value only; this pack does not repeat their item numbers (462, 735, 583).

## Open checks

1. Exact date of the *Sunzi Suanjing* (child text says only "more than 1,500 years ago").
2. Soroban dating (arrival in Japan; 1591 object; when one-over-four became standard). None in child text.
3. Math check of all items, especially expanded form acceptance (300 + 6 and 300 + 0 + 6) and the D3 estimate.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of seeds, packets, boxes, a rod board and a three-rod soroban. If a real image is wanted, Wikimedia Commons holds freely licensed photographs of soroban and of counting rods (check each file's license); museum open-access collections (for example the Whipple Museum entry above) need per-object confirmation. No photograph of a real child or real family appears.
