# Source audit 192: The Order of the Day

Date: 2026-10-25. Spec: [192](../specs/192-order-of-the-day.md). Companion: [192 text](../content/192-order-of-the-day-text.md).

**Method.** Six web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (the order-of-operations convention with × ÷ and + − as shared left-to-right steps; brackets evaluated innermost first; inverse pairs; solving one- and two-step equations by undoing) is standard school arithmetic, as stated in the pinned Marble topic descriptions and the national curriculum sources cited in Marble's research records. All café orders, trades, seedlings and heaps in problem items are **made-up labeled data**, verified by `check192.py` (109 checks, all passing; scratch area, not in the repo), including brute-force uniqueness for the two bracket-target puzzles (B3, B6) and the heap problem (E6). Pedagogy follows the Marble teaching-research records for the six targets at `7bd8b67`, paraphrased, not copied.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Equals sign" | Wikipedia | https://en.wikipedia.org/wiki/Equals_sign | Recorde introduced = in *The Whetstone of Witte* (1557); "Gemowe" (twin) lines; to avoid repeating "is equal to"; original sign much longer; next printed use 1618 (appendix to Wright's translation of Napier). |
| 2 | "Robert Recorde" | Wikipedia | https://en.wikipedia.org/wiki/Robert_Recorde | Welsh, born Tenby about 1510, died 1558 (Southwark); physician; also introduced + and − to English readers; *Whetstone* the first printed algebra in English. |
| 3 | "Earliest Uses of Symbols of Relation" | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Miller/mathsym/relation/ | Recorde's passage on the equals sign and its slow adoption (corroborates 1). |
| 4 | "The Whetstone of Witte by Robert Recorde (1557)" (page image) | Indiana University of Pennsylvania (course page) | https://www.people.iup.edu/gsstoudt/history/images/witte.html | Reproduced 1557 page showing the elongated sign. |
| 5 | "Roots: All things being equal" | Chalkdust Magazine | https://chalkdustmagazine.com/features/roots-all-things-being-equal | Popular account of Recorde and the sign (corroborates 1-3). |
| 6 | "Recorde, Robert" | Encyclopedia.com | https://www.encyclopedia.com/people/history/historians-miscellaneous-biographies/robert-recorde | Biography; notes some royal-physician claims are disputed (kept out of child text). |
| 7 | "Mathematics in ancient Egypt" | Encyclopaedia Britannica | https://britannica.com/topic/mathematics/Mathematics-in-ancient-Egypt | Rhind problem 24: a quantity (*aha*) and its seventh make 19; guess 7, which gives 8; scale by 19/8; answer 16 1/2 1/8 (16 5/8); false position; similar methods in Chinese, Hindu, Muslim and Renaissance European arithmetic, with no clear direct link. |
| 8 | "Rhind Mathematical Papyrus" | Wikipedia | https://en.wikipedia.org/wiki/Rhind_Mathematical_Papyrus | About 1550 BCE; scribe Ahmes (Ahmose); copied from an older text of Amenemhat III's reign; British Museum acquired 1865; a fragment in Brooklyn. |
| 9 | "Egyptian algebra" | Wikipedia | https://en.wikipedia.org/wiki/Egyptian_algebra | Aha problems find an unknown quantity from it plus parts of it; examples in the Rhind and Moscow papyri. |
| 10 | Egyptian mathematics notes | University of Ottawa (MAT3100 course notes) | https://www.site.uottawa.ca/~phil/courses/MAT3100.16/3100.16.Egyptians.Further.Facts.pdf | Problem 24 answer 16 5/8; false position described (corroborates 7). |
| 11 | Math history notes | UC Irvine (Math 184 notes) | https://www.math.uci.edu/~ndonalds/math184/notes.pdf | False position as guess-then-adjust (uses a guess of 14 for the same problem). |
| 12 | "Earliest Uses of Grouping Symbols" | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Miller/mathsym/grouping | Vinculum (bar) in Chuquet 1484; van Schooten 1646 replacing parentheses with a bar; parentheses became general only later. Consulted for a third anchor; not used (see Open checks). |
| 13 | "Vinculum (symbol)" | Wikipedia | https://en.wikipedia.org/wiki/Vinculum_(symbol) | Corroborates 12 in outline. |
| 14 | Marble teaching-research records for the six targets and the dropped `mt_hImiKNiaNh` | Marble repo at `7bd8b67` (CC BY-SA 4.0, © Generative Spark, Inc.; paraphrased, not copied) | local clone | Constraints, misconceptions and activities summarized in the spec's upstream check. |
| 15 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach → guided → practice; "I'm stuck" ladder; three-option choices; word limits. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Recorde introduced the equals sign in *The Whetstone of Witte*, 1557 | 1, 2, 3, 4 | Checked |
| Two parallel lines of the same length, to avoid repeating "is equal to", because no two things can be more equal | 1, 3, 5 | Checked (child text paraphrases; old spelling not quoted) |
| Recorde was Welsh, a doctor and a teacher of mathematics | 2, 6 | Checked ("royal physician" left out: disputed per 6) |
| His sign was much longer than today's | 1, 4 | Checked |
| Other writers slow to copy; next in print about sixty years later (1618) | 1, 3 | Checked (child text says "about sixty years later") |
| *Whetstone* is the first printed algebra book in English | 2 | Checked on one excerpt; spec only, not in child text |
| Rhind papyrus about 1550 BCE ("about 3,500 years ago"), scribe Ahmes, copied from an older text | 8 | Checked; dating differs between sources (some give about 1650 BCE), so child text says "about 3,500 years ago" |
| Mostly in the British Museum | 8 | Checked |
| Problem 24: a quantity and its seventh make 19; the scribe guesses 7, gets 8, scales up; answer 16 5/8 | 7, 10, 11 | Checked; arithmetic verified by script |
| *Aha* as the word for the unknown; translations vary ("quantity", "heap", "something") | 7, 9 | Checked; child text uses "heap" in quotation marks and does not claim one translation |
| The method is called false position; similar methods in other traditions | 7, 10 | Checked (spec only) |
| Order-of-operations convention; brackets innermost first; inverse pairs | pinned Marble topic descriptions; 14 | Standard; math check still requested |

## Open checks

1. **History of brackets** `[check]`: searches gave the vinculum in Chuquet (1484) and van Schooten (1646), and a general claim that parentheses became general-purpose grouping only in the late 17th century (Wallis, Leibniz, Bernoulli), without works or dates in the excerpts. Not used as an anchor and kept out of child text; a third anchor could be added after a source-level check.
2. **Spanish lines** *¡Veinticinco panes!* (twenty-five loaves) and *Cinco manojos* (five bundles) for a fluent reader (spec 120 rule). *Manojo* for a bundle of seedlings should be confirmed against Vadoalto's usage elsewhere (spec 120 uses *carrizo* for reed).
3. Second-pass reading of the Recorde passage in a facsimile or MacTutor transcription, and of Britannica's problem 24 text, at the source.

## Rights notes for images

No images are embedded. For build art, prefer original drawings. The 1557 *Whetstone* page and the Rhind papyrus are public domain as works; specific photographs carry their holders' terms (the British Museum's collection images have their own license; Wikimedia Commons files must be checked one by one). No photograph of a real child or real family appears.

## Topic decisions

- **Dropped:** `mt_hImiKNiaNh` *Order of operations (age 10+)*. Its pinned description and evidence (shape hierarchy, fraction-decimal-percent equivalence, the distributive law with a letter) and its Marble research record are a structure topic; only its passing mention of order of operations fits here. The build-out map now assigns it to sibling spec 205.
- **Added at review (2026-10-25):** `mt_X5cypSGoGU`, named *Ratio (age 11+)*, whose pinned description, assessment prompt and Marble record are the order of operations with powers, roots and reciprocals (hard prerequisite: Order of operations, taught here). Reassigned to this pack by the build-out map; met by Keeper's Desk T13, T14, C8 and C9.
- **Narrowed:** powers and roots join this pack's order only at the Keeper's Desk, with no minus sign beside a power; squaring and square-rooting are not part of its inverses (the research's ± caution is noted for a later pack); equations stop at two steps with positive whole-number answers.
