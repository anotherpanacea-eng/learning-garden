# Source audit 206: The Surveyor's Triangle

Date: 2026-10-25. Spec: [206](../specs/206-surveyors-triangle.md). Companion: [206 text](../content/206-surveyors-triangle-text.md).

**Method.** Six web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (similarity and scale factors, enlargement from a center, similar triangles from parallel sunlight, Pythagoras' theorem and its converse, tangent, sine and cosine in right triangles) is standard school geometry and needs only the math check. All shapes, shadows, heights, banks, paths and sightings in problem items are **made-up labeled data**, verified by `check206.py` (154 checks, all passing; scratch area, not in the repo). The Surveyor's Table was generated from Python's `math.tan`, `math.sin` and `math.cos` and rounded to two places; the script re-checks each of its 51 entries. Pedagogy follows the four Marble teaching-research records at `7bd8b67` (CC BY-SA 4.0), paraphrased, never copied.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Thales of Miletus" (biography) | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Thales/ | Diogenes Laertius reports, from Hieronymus, that Thales measured the pyramids by their shadows at the hour when a person's shadow equals their height; Plutarch's later stick-and-two-triangles version; caution that nothing survives from Thales. |
| 2 | "Some Original Sources for Modern Tales of Thales" | Mathematical Association of America (Convergence) | https://maa.org/book/export/html/692718 | Hieronymus (3rd century BCE) as the earliest reported source; Pliny's shadow-equals-body version; Plutarch's version with a stick at the shadow's tip. |
| 3 | Diogenes Laertius, *Lives of Eminent Philosophers* I.27 (Hicks translation) | Perseus / Perseids | https://fgh.perseids.org/read/greekLit/tlg0004/tlg001/perseus-eng2/1.1.22-1.1.41 | The Hieronymus report in translation (search excerpt only). |
| 4 | "Haidao Suanjing" | Wikipedia | https://en.wikipedia.org/wiki/Haidao_Suanjing | Liu Hui, 263 CE; written as part of his *Nine Chapters* commentary; title from the first problem (an island peak); poles 3 zhang, 1000 bu apart; offsets 123 and 127 bu; answers 4 li 55 bu high, 102 li 150 bu away. |
| 5 | "The Sea Island Mathematical Manual (Haidao Suanjing)" (course notes) | Louisiana State University, Department of Mathematics | https://math.lsu.edu/~madden/M4005s2006/SeaIsland | Setup of problem 1 in translation; sighting from ground level over each pole's top. |
| 6 | "Sea Island Height Slot Calculator Example" | Tcl wiki | https://wiki.tcl-lang.org/page/Sea+Island+Height+Slot+Calculator+Example | Recomputes problem 1 in chi (pole 30, gap 6000, offsets 738 and 762) giving 7530 chi = 4 li 55 bu (corroborates 4; script repeats it). |
| 7 | "Aryabhata" | Wikipedia | https://en.wikipedia.org/wiki/Aryabhata | Age 23 stated 3600 years into the Kali Yuga, i.e. 499 CE (not necessarily the composition year); Kusumapura. |
| 8 | "Aryabhata" (short biography) | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/SH/aryabhata_sh.pdf | *Aryabhatiya* about 499; disagreement over exact date and birthplace. |
| 9 | "Aryabhata and the Construction of the First Trigonometric Table" | arXiv preprint 2309.13577 | https://arxiv.org/pdf/2309.13577 | Sines at 3.75° steps up to 90°, in verse 12 of the Gitikapada; used by Indian astronomers since 499. |
| 10 | Eli Maor, *Trigonometric Delights* (excerpt page) | IIT Kanpur book notes | https://cse.iitk.ac.in/users/amit/books/maor--trigonometric-delights.html | 24 rows at 3°45′ intervals; entries are sine differences; dates the work about 510. |
| 11 | "Madhava's sine table" | Wikipedia | https://en.wikipedia.org/wiki/Madhava%27s_sine_table | Radius 21600 ÷ 2π ≈ 3437.75, as in Aryabhata's table. |
| 12 | Marble teaching-research records for the four targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased) | local clone | Pedagogy and constraints summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Thales measured a pyramid's height by its shadow, as reported long after by Hieronymus (via Diogenes Laertius), Pliny and Plutarch; nothing survives from Thales | 1, 2, 3 | Checked; child text says "writers long after Thales told how" and "people reported" |
| Earliest report: the hour when a person's shadow equals their height | 1, 2, 3 | Checked |
| Plutarch's version: a stick at the shadow's tip and two triangles compared | 1, 2 | Checked |
| Who Hieronymus was (pupil of Aristotle vs Hieronymus of Rhodes) | 1, 2 | Sources differ; child text does not name him |
| Liu Hui wrote the *Sea Island Mathematical Manual* in 263, as part of his *Nine Chapters* commentary | 4, 5 | Checked |
| Title from the first problem; poles 3 zhang, 1000 bu apart; offsets 123 and 127 bu; height 4 li 55 bu, distance 102 li 150 bu | 4, 5, 6 | Checked; arithmetic re-done in the script (1 zhang = 10 chi, 1 bu = 6 chi, 1 li = 300 bu) |
| "Paces" as the child-text word for bu | 4 (translated "steps") | Checked as a translation choice; second pass to confirm a standard rendering |
| The rule "pole × gap ÷ difference + pole" matches the book's procedure | 4 (summary of the method), script forward check | Checked by computation; second pass to confirm against a translation of the stated rule |
| Aryabhata's *Aryabhatiya*, about 499 (author's stated age 23), in verse | 7, 8 | Checked; child text "around the year 500" because 10 dates it about 510 |
| One verse holds a sine table of 24 entries at 3¾° steps to 90°, radius about 3438 | 9, 10, 11 | Checked |
| The verse lists sine differences rather than sines | 10 (9 says "generated sines") | Spec only; child text avoids the distinction |
| Sines served astronomy (planet positions) | 9 (use by astronomers) | Checked in general terms; child text says only "helped astronomers work out where the planets would be" |
| Surveyor's Table values (two places) | `math` module | Checked by script |
| Similarity, enlargement, Pythagoras and its converse, right-triangle ratios | standard | Needs the math check |

## Open checks

1. Second pass at the source pages for every row above (fetches were blocked).
2. Whether "paces" is the best child-text rendering of *bu* (some translations use "steps"). Not a `[check]` item: both are fair; owner may choose.
3. Hieronymus's identity. Not in child text.

## Rights notes for images

No images are embedded. For build art, prefer original drawings: the shed, poplar, brook wall, clinometer, square pens and lamp grid are all simple shapes. If a real image is wanted: Giza pyramid photographs on Wikimedia Commons (check each file's license); diagrams of the Sea Island problem should be redrawn, not copied from a modern book; no image of Thales or Aryabhata from life exists (later statues and portraits are imagined, so avoid them or label them). No photograph of a real child or real family appears.

## Pedagogy notes (paraphrased from the Marble records)

- **Scale and similar shapes:** define "same shape" before computing; scale factor from one pair, applied to every side; the additive distortion shown on a non-square rectangle and only as a flagged error; area by k² from tiling; recognition items do not replace production.
- **Coordinates (age 12+):** learners compute ratios themselves; every pair checked; a genuine similar contrast beside the additive fake; classification paired with live enlargement from a center; volume left out.
- **Types of angles (age 13+):** hypotenuse by position first; varied orientation; finish with a square root and a longest-side check; grid distance as a hypotenuse; no 3D diagonals.
- **Trigonometry basics:** mark the angle first; the swap when it moves; ratio invariance before the mnemonic; unknown side and unknown angle kept apart; reasonableness checks. The record suggests confirming whether its 13-15 age framing suits a similarity-first route; this pack is similarity-first and uses depth, not age.
