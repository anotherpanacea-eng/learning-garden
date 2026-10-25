# Source audit 187: Grid and Compass

Date: 2026-10-25. Spec: [187](../specs/187-grid-and-compass.md). Companion: [187 text](../content/187-grid-and-compass-text.md).

**Method.** Six web searches (WebSearch; page fetches are usually blocked in this session and none were attempted, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (coordinates, quadrants by sign, translation, reflection and rotation rules, congruence and sense) is standard school geometry and follows the Marble research records for the nine targets, paraphrased. All landmarks, coordinates, routes and shapes are **made-up labeled data**, verified by `check187.py` (88 checks, all passing; scratch area, not in the repo), including brute-force uniqueness for every missing-corner item. A style script (`style187.py`) checked the companion: 0 em-dashes and every word limit met.

**Independent review, 2026-10-25.** A reviewer re-ran every number with an independent script (`rcheck.py`, `python3 -I`, scratch area; all passing) and re-searched the anchors (search excerpts only; fetches blocked). Stamma (Wikipedia and Chess.com excerpts: Aleppo, *Essai sur le jeu des échecs*, France, 1737) and Descartes (Wikipedia, UC Riverside and Stony Brook excerpts: oblique axes; the rectangular system does not appear in *La Géométrie*) are confirmed; open check 1 is now supported by two excerpts but still worth a translation read.

**Repo checks.** Topic ids, names, descriptions and hard prerequisites read from the pinned `curriculum/marble/topics.json` and `dependencies.json`. The `#map` route was checked in `dist/broad-ui.mjs`, `dist/app.mjs` and `dist/learning-invitations.mjs`: it is the grown-up learning map with `#map/<topicId>` children, so the spec uses `#post/floor-map` (no `#map/...` route). Spec 58's host is `#workshop/maps`. Overlap read: specs 58, 61, 111 (main), 123 and 125 (draft PR #128), 120's Acts II, III and VI (draft PR #127), and the sibling pack list (181 angles, 189 negative numbers).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Pei Xiu" | Wikipedia | https://en.wikipedia.org/wiki/Pei_Xiu | Dates 224-271; Jin minister of works (267 or 268); six principles including a rectangular grid and graduated scale; maps lost; preface preserved in the *Book of Jin*, vol. 35. |
| 2 | Pei Xiu entity record | Chinese Text Project | https://data.ctext.org/entity/858364 | Jin-era cartographer and official (corroborates 1). |
| 3 | "Pei Xiu" and Chinese grid scales (*jili huafang*) | University of Chicago Press journal article | https://www.journals.uchicago.edu/doi/epdf/10.1086/722360 | First three principles concern location, scale and distance; last three supplement route drawing; grid squares each worth a set number of li; earliest surviving example the *Yu ji tu*. |
| 4 | Akin and Mumford, "Yu Ji Tu" paper | Brown University (Mumford) | https://www.dam.brown.edu/people/mumford/beyond/papers/2012d--Yujitu-journal.pdf | *Yu ji tu* engraved on stone in 1136; grid of squares; rectangular grid of equally spaced lines among Pei Xiu's principles. |
| 5 | Yu ji tu description | Medievalists.net | https://www.medievalists.net/?p=98377 | Each square 100 li (about 36 km); about one meter per side; carved on a monument at a school in Xi'an. (Some Wikimedia captions give 1137.) |
| 6 | "Deep in Shanxi: Who is Pei Xiu" | China Daily | https://regional.chinadaily.com.cn/shanxi/2024-10/30/c_1040794.htm | *Yu Gong* regional maps; dates 224-271 (corroborates 1). |
| 7 | "Philipp Stamma" | Wikipedia | https://en.wikipedia.org/wiki/Philipp_Stamma | Native of Aleppo, Ottoman Syria; *Essai sur le jeu des échecs*, 1737, France; algebraic notation in an almost fully developed form; English edition 1745; interpreter of oriental languages in London from 1739. |
| 8 | "Algebraic notation (chess)" | Wikipedia | https://en.wikipedia.org/wiki/Algebraic_notation_(chess) | Files a-h, ranks 1-8; Stamma's early use; spread through German and Russian literature in the 19th century. |
| 9 | "The Creator of Algebraic Chess Notation" | Chess.com | https://www.chess.com/article/view/the-creator-of-algebraic-chess-notation | Stamma credited; his notation differed from modern (piece letters, p for pawn moves). |
| 10 | Stamma, Philip, fl. 1737 | Online Books Page, University of Pennsylvania | https://onlinebooks.library.upenn.edu/webbin/who/Stamma%2c%20Philip%2c%20fl%2e%201737 | Library record for the author (corroborates 7). |
| 11 | "La Géométrie" | Wikipedia | https://en.wikipedia.org/wiki/La_G%C3%A9om%C3%A9trie | Published 1637 as one of three appendices to the *Discourse on the Method*. |
| 12 | "Descartes on Pappus" (course notes) | University of California, Riverside | https://math.ucr.edu/~res/math133-2020/exercises/descartes-on-pappus.pdf | Descartes used an oblique system and did not formally introduce a second axis; modern rectangular coordinates do not appear in the work. |
| 13 | "A Survey of the Development of Geometry up to 1870" | arXiv | https://arxiv.org/pdf/1409.1140 | Descartes also considered skew coordinates; "Cartesian (or rectangular) coordinates" named after him. |
| 14 | "Analytic geometry" | Encyclopedia of Mathematics | https://encyclopediaofmath.org/wiki/Analytic_geometry | Analytic geometry's origin with Descartes (and Fermat); context only. |
| 15 | Marble teaching-research records for the nine targets (and the dropped `mt_y-BuQAfw4B`) | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check; `mt_y-BuQAfw4B` record confirms it is similarity and enlargement. |
| 16 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach → guided → practice; "I'm stuck" ladder; three options; word limits; glossary. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Pei Xiu lived 224-271 and served the Jin court | 1, 2, 6 | Checked |
| His six principles include an even rectangular grid and a graduated scale | 1, 3, 4 | Checked |
| His maps are lost; his preface survives in the *Book of Jin* | 1, 6 | Checked (child text says "his rules survive in an old history book") |
| "About 1,800 years ago" | 1; script (1,755-1,802 years before 2026) | Checked |
| Pei Xiu invented the map grid | 3 (Zhang Heng credited by some; Pei's grid may differ from later practice) | Not claimed; child text says only that he wrote rules including a grid |
| Stone map carved in 1136 in China, grid squares each 100 li | 3, 4, 5 | Checked (1137 in some captions; spec and child text use 1136, the scholarly date) |
| Stamma from Aleppo, Syria; 1737 book printed in France naming squares by letter and number | 7, 8, 9, 10 | Checked |
| His notation differed from today's in piece letters | 9 (and a weaker document noted in search) | Checked; stated in the Keeper's note |
| Modern chess: columns a-h, rows 1-8, across then up | 8 | Checked |
| *La Géométrie*, 1637, an appendix to the *Discourse on Method*; lines and curves described with numbers (algebra) | 11, 13 | Checked |
| "Cartesian" coordinates named after Descartes | 13 | Checked |
| His own work used slanted axes and no drawn second axis; the crossed four-part grid came later | 12, 13 | Checked against two academic excerpts; second pass to confirm in a translation (math check ask 4) |
| Stamma's city given as "in Syria" (Ottoman Syria then) | 7 | Checked; child text says "Aleppo, in Syria" |

## Open checks

1. Descartes' axes: confirm in the Smith-Latham translation, or a historian's account, that *La Géométrie* has no perpendicular pair of axes. Child text depends on it (H3, F5); if it does not hold, soften H3's note to "His drawings looked different from our grid" and change F5's third statement.
2. Stamma's birth and death years differ between sources (c. 1705-1755 vs 1715-1770?). Not in child text.
3. Pei Xiu's appointment year (267 or 268). Not in child text.
4. No `[check]` item appears in child text.

## Rights notes for images

No images are embedded. For build art, prefer original drawings: the floor map, flag and turning spot are original. If a real image is wanted: rubbings and photographs of the *Yu ji tu* (1136) appear on Wikimedia Commons (check each file's license; the stele is held in Xi'an); a page of Stamma's 1737 *Essai* or the 1745 *Noble Game of Chess* is public domain by age, but the scan's rights must be checked per library; title pages of *La Géométrie* (1637) are public domain by age, scans likewise. No photograph of a real child or real family appears.

## Topic-fit notes

- **Not claimed here:** `mt_y-BuQAfw4B` "Coordinates (age 12+)" (similarity and enlargement) is owned by proposed spec 206 in the build-out map.
- **Claimed on review:** `mt_SH7QgFl8-v` and `mt_lxaM6iVpdr`. Draft spec 125 (`pr/128`) lists both only as references ("No claim beyond candidate reference"; "no coordinate claim").
- **"Along the corridor, up the stairs":** both coordinate records note the rhyme breaks below zero; the companion uses it only on first-quadrant cards (T6, C1, C3) and says "first number across, second up or down" on the Whole Valley.
