# Source audit 181: The Turning Tower

Date: 2026-10-25. Spec: [181](../specs/181-turning-tower.md). Companion: [181 text](../content/181-turning-tower-text.md).

**Method.** Six web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The geometry (angle as turn; right, acute, obtuse, straight and reflex angles; lines, segments and rays; parallel and perpendicular; diagram conventions; two-scale protractor reading; additive angles; scale drawings; SAS triangles; perpendicular and angle bisectors by compass and straight edge) is standard school mathematics and follows the ten Marble teaching-research records, paraphrased. Every number in items, worked examples and models is **made-up labeled data**, verified by `check181.py` (55 checks, all passing; scratch area, not in the repo). The companion was checked by `style181.py` (0 em-dashes; all word limits met).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Ancient Babylonian astronomers and why we have 360° in the circle" | University of Nevada, Las Vegas, physics course pages | https://www.physics.unlv.edu/~jeffery/astro/babylon/babylonian_360_degrees.html | Babylonian astronomers divided the circle into 360 units (citing Neugebauer, *The Exact Sciences in Antiquity*); the sources do not say why 360; year length and base-60 convenience suggested. |
| 2 | "Zodiac" | Wikipedia | https://en.wikipedia.org/wiki/Zodiac | 360° zodiacal system of 12 signs of 30°, originating in Babylonian astronomy in the first millennium BCE, probably Achaemenid period. |
| 3 | J. M. Steele, "Geminos and Babylonian astronomy" | NYU ISAW (archive) | https://archive.nyu.edu/bitstream/2451/61288/57/12.%20Steele.pdf | Uniform zodiac of 12 signs attributed to Babylonia, around the end of the fifth century BCE. |
| 4 | Durham study of Babylonian zodiac observations (via search excerpt) | academia.edu | https://www.academia.edu/2360664/ | Sky band divided into twelve segments, each subdivided into 30 parts; diaries give degrees within a sign. |
| 5 | "360/Historical Note" | ProofWiki | https://proofwiki.org/wiki/360/Historical_Note | Each sign divided into 30 degrees; Greek adoption "appears" first in Hipparchus (hedged). |
| 6 | Cosmic origins lecture notes | University of Groningen | https://www.astro.rug.nl/~weygaert/tim1publication/cosmic_origins2019/cosmic_origins2019.lect4.order_cosmos.pdf | Sexagesimal counting in Babylonia from about 2000 BCE; 360 = 6 × 60. |
| 7 | "Al-ʻIjliyyah" | Wikipedia | https://en.wikipedia.org/wiki/Al-%CA%BBIjliyyah | 10th-century astrolabe maker of Aleppo; employed by Sayf al-Dawla (r. 944-967); per Ibn al-Nadim, daughter of al-ʻIjliyy, both trained under Nasṭūlus of Baghdad; "Mariam" not in the source. |
| 8 | "Al-ʻIjliyyah" profile | KTH Royal Institute of Technology Library | https://kth.se/en/biblioteket/anvanda-biblioteket/studera-i-biblioteke/vem-var/al-ijliyyah-1.1349544 | Corroborates 7, including that "Mariam" is a modern addition. |
| 9 | Al-ʻIjliyyah biography | Muslim Heritage | https://muslimheritage.com/people/scholars/al-ijlia/ | Apprenticeship per Ibn al-Nadim (corroborates 7). |
| 10 | "Astrolabe components" | Museo Galileo, Florence | https://catalogue.museogalileo.it/indepth/AstrolabeComponents.html | Back of the astrolabe: graduated degree circle in four 90° quadrants; alidade points to the altitude. |
| 11 | "A brief guide to solving problems with the astrolabe" | History of Science Museum, Oxford | https://www.mhs.ox.ac.uk/scienceislam_education/docs/A%20brief%20guide%20to%20solving%20problems%20with%20the%20astrolabe.pdf | Measuring altitude with the alidade; never look straight at the Sun. |
| 12 | Astrolabe kit worksheet | Indiana University Book Lab | https://booklab.indiana.edu/lab-work/current-projects/astrolabe-2024-worksheet.html | Hang the astrolabe vertically; sight a star through both vanes; Sun by its light spot (corroborates 11). |
| 13 | "Fuxi and Nüwa" | UNESCO Silk Roads Programme | https://en.unesco.org/silkroad/silk-road-themes/mouvable-heritage-and-museums/fuxi-and-nuwa | Astana painting: the pair hold a compass and a ruler (square), symbols of round Heaven and square Earth. |
| 14 | Silk banner record A 1928,1022.0.203 | British Museum | https://www.britishmuseum.org/collection/object/A_1928-1022-0-203 | Compass and square iconography; positions sometimes reversed; Han (Mawangdui) parallels. |
| 15 | Wu Family Shrines pictorial stones viewer | Princeton University Art Museum | https://static.artmuseum.princeton.edu/asian-art/china/viewers/wu-shrine-viewer | Wu shrines (Jiaxiang, Shandong, Eastern Han, 2nd century CE): Fuxi holds a square, Nüwa a compass. |
| 16 | Xinjiang Museum silk painting report | China Daily | https://govt.chinadaily.com.cn/s/202503/27/WS67e4f321498eec7e1f732e57/ancient-silk-painting-depicting-fuxi-and-nuwa-with-intertwined-snake-tails.html | Tang-dynasty Astana painting, unearthed 1965; Fuxi with square, Nüwa with compass. |
| 17 | Marble teaching-research records for the ten targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Babylonians counted in sixties | 1, 6 | Checked |
| Babylonian zodiac of 12 signs of 30 parts (360) | 1, 2, 3, 4 | Checked; dating varies (late 5th century BCE vs Achaemenid period), so child text gives no date |
| Greek astronomers later used 360 parts for every circle | 2, 5 | Checked; Hipparchus as first is hedged in 5, so child text names no astronomer |
| Nobody knows for sure why 360; year length and easy division are suggestions | 1 | Checked; child text marks both as "one idea" |
| Al-ʻIjliyyah made astrolabes in Aleppo for Sayf al-Dawla, over 1,000 years ago | 7, 8, 9 | Checked (944-967; script confirms the gap) |
| She and her father trained under a Baghdad maker (Ibn al-Nadim, the only source) | 7, 9 | Checked; teacher's name differs in one popular source, so child text gives no name |
| The name "Mariam" | 7, 8 | Not in the historical source; not used |
| Astrolabe back: degree ring and alidade measure altitude; do not sight the Sun by eye | 10, 11, 12 | Checked |
| Fuxi and Nüwa shown with a compass and a carpenter's square; Wu shrines 2nd century CE | 13, 14, 15, 16 | Checked; "more than 1,800 years ago" |
| Which figure holds which tool | 14, 15, 16 | Sources disagree; child text says "one holds a compass, one a square" |
| *Gui ju* (compass and square) came to mean rules and order | search excerpt citing Nibley via templestudy.com and popular sources | `[check]` against a sinological source; kept out of child text until confirmed |
| Geometry and protractor conventions | 17 and standard texts | Checked against the records; math check still requested |

## Open checks

1. *Gui ju* meaning "rules, order": confirm in a scholarly source (for example Wu Hung's work on the Wu Liang shrine or a standard dictionary) before any child text uses it. `[check]`
2. Re-read sources 1-5 at the page for the zodiac's date and the Greek adoption; child text avoids both.
3. Nuria's Spanish, *¡Hola desde Vadoalto!* and *ángulo recto*, for a fluent Spanish reader (spec 120 rule).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the sails, vane, protractor and compass. If a real image is wanted: astrolabes from the Islamic world are held by the History of Science Museum, Oxford, and Museo Galileo, some with open images (check each license); Fuxi and Nüwa paintings are in the Xinjiang Museum and the British Museum (check reuse terms per object); Wu shrine rubbings are reproduced by Princeton (check terms). No photograph of a real child or family appears.

## Draft checks by the writer (2026-10-25)

**Numbers:** every angle, companion, scale reading, sum, difference, scale conversion, SAS side and construction coordinate recomputed by script; all correct. **Anchors:** three, from Babylonian, Islamic-world and Chinese sources; dates in child text are gaps ("over 1,000", "more than 1,800 years") rather than contested years. **Wording:** no em-dashes; no "Not X, but Y" constructions in child text; feedback never says "wrong"; Sprout items carry no numbers. **Story:** the old Keeper is unnamed through Act III; the sails and vane are a new story detail for the owner to confirm.

## Independent review notes (2026-10-25)

WebSearch excerpts re-confirmed al-ʻIjliyyah as a 10th-century Aleppo astrolabe maker for Sayf al-Dawla (r. 944-967), known through Ibn al-Nadim, with "Mariam" a modern addition (Wikipedia; KTH Library). Fetches were not attempted. The `[check]` on *gui ju* remains open and stays out of child text. The seven ids this pack dropped are owned in the build-out map by specs 182, 183, 185 and 206.
