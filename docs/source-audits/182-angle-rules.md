# Source audit 182: The Truss Yard

Date: 2026-10-25. Spec: [182](../specs/182-angle-rules.md). Companion: [182 text](../content/182-angle-rules-text.md).

**Method.** Six web searches (WebSearch). Page fetches were not attempted beyond search because they are usually blocked in this session, so the history claims below rest on search-result excerpts, with URLs, and should be re-read at the source in the second pass. The mathematics (angles on a line and at a point, opposite angles, triangle and polygon angle sums, regular inside and outside angles, angles with parallel lines, the outside-angle theorem) is standard school geometry, cross-checked against Euclid I.15, I.29 and I.32 in Heath's translation as excerpted. Every number in teach cards, worked examples, models and the 32 draft problem items is checked by `check182.py` (111 checks, all passing; the 8 items added in review are checked by the reviewer's `rcheck.py`; scratch area, not in the repo), including coordinate constructions of the 50-60-70 triangle, enlargements, random triangles, the parallel-beam angles by vectors, and brute-force uniqueness for the three "find n" answers. Pedagogy follows the Marble teaching-research records for the targets, paraphrased.

## Target fit decisions

After the independent review (2026-10-25), the build-out map is applied: `mt_tAJH5BrpOx` "Angles in triangles (age 11+)" (actually area formulas and prism volumes) is proposed spec 186's and is not claimed here. `mt_167X6Ax8P7` "Angles in triangles (age 12+)" (triangle congruence, SSS, SAS, ASA, RHS, labeling), which the writer had dropped, is kept with its own Keeper's Desk bench (Twin Trusses); its hard prerequisites are met by proposed specs 181 (SAS construction) and 183 (terms and notation). Also added by the map: `mt_QDTO3GAgcq` (angles at a point, on a line, vertically opposite), `mt_tedML_iu4Y` (multi-step chains with an equation) and `mt_KFKUR_gBg_` (rectangle properties for missing lengths and angles). All four new items are standard mathematics, checked by the reviewer's script; no new history claim was added.

Two kept ids also carry misleading titles: `mt_bfhng6mOuy` is defining attributes of shapes and `mt_zuOGOGFAKb` is drawing shapes by attributes (the spec 111 audit records the same title repairs). Both fit the requested younger on-ramp (triangles' corners and square corners), so they stay, scoped to their actual content; the cube clause of `mt_zuOGOGFAKb` is left to spec 126.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | Euclid, *Elements*, Book I, Proposition 32 (Heath 1908) | Trinity College Dublin, D. R. Wilkins | https://www.maths.tcd.ie/~dwilkins/Euclid/Elements_Heath1908/BookI/EuclidElementsBk01Prop32_Heath1908.php | Statement: outside angle equals the two inside opposite angles; three inside angles equal two right angles. Proof: line through C parallel to AB (I.31), alternate and corresponding angles (I.29), straight angle (I.13). |
| 2 | "Euclid: Proposition I/32" and "Sum of Angles of Triangle equals Two Right Angles" | ProofWiki | https://proofwiki.org/wiki/Euclid:Proposition/I/32 | Same two-part statement; traditional ascription to Pythagoras is uncertain (not used in child text). |
| 3 | Propositions I.31-32 commentary | themathpage | https://themathpage.com/aBookI/propI-31-32.htm | Corroborates 1. |
| 4 | Euclid, I.32 (Lardner 1855) | Trinity College Dublin | https://www.maths.tcd.ie/~dwilkins/Euclid/Elements_Lardner1855/BookI/EuclidElementsBk01Prop32_Lardner1855.php | Second translation of 1. |
| 5 | Proclus, *Commentary on Euclid*, on I.15 (Taylor 1792, draft transcription) | Trinity College Dublin | https://www.maths.tcd.ie/~dwilkins/Euclid/Proclus_Taylor1792/ProclusCommentaryOnEuclid_TTaylor_ElementsBk1Prop15_DraftTranscription.pdf | Eudemus says Thales first discovered that vertically opposite angles are equal; the scientific demonstration came with the author of the *Elements*. |
| 6 | "Thales' Theorems" | Cut the Knot | https://www.cut-the-knot.org/pythagoras/ThalesTheorems.shtml | Thales attributions come through Proclus citing Eudemus; Eudemus's history is lost; Thales left no writings. |
| 7 | "Two Straight Lines make Equal Opposite Angles" | ProofWiki | https://proofwiki.org/wiki/Two_Straight_Lines_make_Equal_Opposite_Angles | I.15 and the Thales attribution (corroborates 5). |
| 8 | "Euclid" | World History Encyclopedia | https://www.worldhistory.org/euclid/ | Euclid taught in Alexandria about 300 BCE; little is known of his life. |
| 9 | "Euclid's Elements" (Simple English) and Wikiquote entry | Wikipedia / Wikiquote | https://simple.wikipedia.com/wiki/Euclid%27s_Elements | 13 books, Alexandria, about 300 BCE; Euclid organized earlier results. |
| 10 | "King post" | Wikipedia | https://en.wikipedia.org/wiki/King_post | King post truss: two rafters meeting at the apex, a tie beam, a central post; oldest surviving roof truss is a king post truss at Saint Catherine's Monastery, built 548-565. |
| 11 | "Saint Catherine's Monastery" | Wikipedia | https://en.wikipedia.org/wiki/Saint_Catherine%27s_Monastery | The monastery's king post truss is the oldest known surviving roof truss. |
| 12 | "3.6 The Roofing Problem" (conservation text, OCR) | Heidelberg University Library | https://digi.ub.uni-heidelberg.de/diglit/fie_bd9_5text/0057/text_ocr | A 6th-century roof at St Catherine's uses scissor braces with tie beam and king post. |
| 13 | Roofing study citing Feilden (1982) | Sapienza University of Rome (IRIS) | https://iris.uniroma1.it/handle/11573/1675600 | Feilden calls it "reputed to be the oldest surviving timber roof truss" (the hedge used in child text). |
| 14 | Mount Sinai photograph archive | Princeton University | https://researchphotographs.princeton.edu/mount-sinai/15a | A fully preserved 6th-century wooden roof on trusses. |
| 15 | "kanejaku" | JAANUS (Japanese Architecture and Art Net Users System), Columbia mirror | https://projects.mcah.columbia.edu/jaanus/node/3426 | L-shaped square, long side about 49 cm, short side about 24 cm; also called sashigane; used to measure, make right angles and mark with ink on a marking string; back graduations devised for roof corners at the eaves. |
| 16 | Sashigane product pages | Japanese Tools Australia (retailer) | https://japanesetools.com.au/products/sashigane-50cm-x-25cm-traditional-profile-and-calculated-markings | Roof-pitch scales (retailer description only; not relied on in child text). |
| 17 | Marble teaching-research records for the ten targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| *Elements* written by Euclid in Alexandria about 300 BCE; 13 books | 8, 9 | Checked (child text: "about 2,300 years ago in Alexandria") |
| I.32: outside angle equals the two far inside angles; three inside angles make two right angles (180°) | 1, 2, 4 | Checked |
| I.32 proof draws a line through a vertex parallel to the opposite side and uses parallel-line angles | 1, 3 | Checked |
| Euclid gathered many earlier results | 8, 9 | Checked |
| Proclus reports, citing Eudemus, that Thales first discovered opposite angles are equal; the proof is Euclid's | 5, 6, 7 | Checked (second-hand; child text says "a much later writer, Proclus, says an older history credited Thales with noticing") |
| I.32 first proved by Pythagoras or Thales | 2 | Not settled; kept out of child text |
| Saint Catherine's Monastery basilica roof uses king post trusses, dated 548-565 | 10, 11, 12, 14 | Checked (dates from reference sources) |
| "Oldest surviving roof truss" | 10, 11, 13 | Checked as a widely repeated claim; child text says "often called", Keeper's note says "reputed to be" |
| Kanejaku / sashigane: L-shaped, arms about 49 and 24 cm, measuring, right angles, ink marking; back scales for roof corners | 15 | Checked (single scholarly dictionary entry); child text says "one arm is about twice as long" |
| Sashigane's roof-pitch scales are Pythagorean | 16 | `[check]` retailer only; not in child text |
| A triangle's three sides fix its shape (rigidity); a four-bar frame can lean | standard geometry (SSS) | Checked as mathematics; subject reviewer asked to confirm wording |

## Open checks

1. Second pass to read sources 1, 5, 10 and 15 at the page (fetches blocked here).
2. Nuria's Spanish lines (*¡Triángulos!*, *Siempre.*) for a fluent Spanish reader (spec 120 rule).
3. Resolved in review: spec 181 claims `mt_e4V6hvcuEJ`; this pack claims `mt_tedML_iu4Y`; spec 183 claims `mt_liIW336odh`; `mt_sBcRdUfAzV` is unclaimed (documented gap).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the truss, beams and peg board. If a real image is wanted: photographs of the Saint Catherine's Monastery roof exist in museum and university archives (source 14) and on Wikimedia Commons, each license to be checked; a sashigane can be drawn from a generic L-square. Medieval manuscript pages of Euclid are often reproduced; license must be confirmed per image, and no specific manuscript is named here. No photograph of a real child or real family appears.

## Independent review spot-check (2026-10-25)

WebSearch excerpts re-confirmed the Saint Catherine's king post truss dating (548-565) and the "reputed to be" hedge (Wikipedia "King post"; Sapienza IRIS record citing Feilden). Fetches were not attempted. No `[check]` item is in child text.
