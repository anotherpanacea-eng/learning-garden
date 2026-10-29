# Source audit 199: Decimal Scales

Date: 2026-10-25. Spec: [199](../specs/199-decimal-scales.md). Companion: [199 text](../content/199-decimal-scales-text.md).

**Method.** Eight web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (place value to thousandths; decimal-fraction equivalence; comparing by place; dividing by powers of ten; metric conversion; half-up rounding; significant figures; the 2-and-5 termination rule; rational and irrational numbers; density) is standard school mathematics and needs no web source; it was checked by script instead. All weights, prices, rope lengths and river readings in problem items are **made-up labeled data**, verified by `check199.py` (1,885 checks, all passing; scratch area, not in the repo). The story's storm heights (Vadoalto about 240 cm, Willowbank 160 cm) and Hollis's ledger heights (40-140 cm) are copied from spec 120's draft letters and page 2 so the fiction stays consistent.

Pedagogy follows the twenty-one Marble teaching-research records (`learn.constraints`, activities and misconceptions), paraphrased in the spec's upstream check; no research text is copied (CC BY-SA). Jane's `LESSONS.md` supplied the lesson shape only.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Abu'l Hasan Ahmad ibn Ibrahim Al-Uqlidisi" | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Al-Uqlidisi/ | *Kitab al-Fusul fi al-Hisab al-Hindi* written in Damascus, 952-953; earliest known text with a direct treatment of decimal fractions; a stroke over the units digit as the decimal sign; known only through two arithmetic manuscripts; surviving copy made in 1157. |
| 2 | "Al-Uqlidisi" (Dictionary of Scientific Biography entry) | MacTutor (PDF) | https://mathshistory.st-andrews.ac.uk/DSB/Al-Uqlidisi.pdf | Corroborates 1. |
| 3 | "Abu'l-Hasan al-Uqlidisi" | Muslim Heritage | https://muslimheritage.com/people/scholars/abul-hasan-al-uqlidisi/ | Decimal fractions about five centuries before al-Kashi (Saidan's finding); Saidan's 1978 English edition. |
| 4 | "De Thiende" | Wikipedia | https://en.wikipedia.org/wiki/De_Thiende | Published 1585 in Flemish, with Stevin's French *La Disme* the same year; a short practical account of decimal fractions; Stevin did not invent decimals; Norton's English *Disme* (1608). |
| 5 | "Simon Stevin" | MacTutor | https://mathshistory.st-andrews.ac.uk/Biographies/Stevin/ | Audience (stargazers, surveyors, carpet-makers, wine-gaugers, mint-masters, merchants); prediction that decimal coins, weights and measures would come. |
| 6 | "Decimal fraction"; "La Thiende" | Encyclopaedia Britannica | https://www.britannica.com/topic/decimal-fraction | Stevin's role in establishing everyday decimal use (corroborates 4, 5). |
| 7 | "Mathematical Treasures: Simon Stevin's Oeuvres Mathematiques" | Mathematical Association of America | https://old.maa.org/node/116956 | Circled numbers after each digit marking powers of one tenth (example printed as 237⓪5①7②8③). |
| 8 | "Coinage Act of 1792" | Wikipedia | https://en.wikipedia.org/wiki/Coinage_Act_of_1792 | The act (2 April 1792) authorized a "disme" worth one tenth of a dollar; spelling later "dime". |
| 9 | "Half dime or half disme" | PCGS | https://www.pcgs.com/news/half-dime-or-half-disme | Disme from French *dixième*; corroborates 8. |
| 10 | "Ghiyath al-Din Jamshid Mas'ud al-Kashi" | MacTutor | https://mathshistory.st-andrews.ac.uk/Biographies/Al-Kashi/ | *Treatise on the Circumference* (1424): 2π to nine sexagesimal places, equivalent to 16 decimal places, unsurpassed for almost 200 years (van Ceulen); *Key of Arithmetic* completed 1427 in Samarkand, a teaching text; uses decimal fractions. |
| 11 | "al-Kashi" | Encyclopaedia Britannica | https://www.britannica.com/biography/al-Kashi | *Miftah al-hisab* ("Key of Arithmetic"), 1427, dedicated to Ulugh Beg (corroborates 10). |
| 12 | "Proof that pi is irrational" | Wikipedia | https://en.wikipedia.org/wiki/Proof_that_pi_is_irrational | Lambert's proof (dated 1761 in many sources, published 1768); Lindemann's transcendence, 1882. |
| 13 | Lambert's *Mémoire* (chapter) | Springer | https://link.springer.com/chapter/10.1007/978-3-031-52223-9_4 | Disputes the 1761 date ("read in 1767"). Year unsettled; child text gives no name or year. |
| 14 | "Hippasus overboard" | NRICH, University of Cambridge | https://nrich.maths.org/2671 | √2 irrationality by contradiction; the Hippasus story is tradition. Not used in child text. |
| 15 | Marble teaching-research records for the twenty-one targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |
| 16 | Spec 120 draft letters and Keeper's Pages | learning-garden draft PR #127 | `docs/content/120-story/letters.md`; `docs/content/120-keeper-of-the-ways-text.md` | Storm and ledger heights used in Scenes 3 and 4 (fiction, for consistency). |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Al-Uqlidisi's book, Damascus, 952-953; earliest known direct treatment of decimal fractions; stroke over the units digit | 1, 2, 3 | Checked |
| Only copy made in 1157; little else known of his life | 1, 2 | Checked (child text: "about 200 years later") |
| Stevin's *De Thiende* 1585, French *La Disme* same year, practical audience, did not invent decimals | 4, 5, 6 | Checked |
| Stevin's circled place numbers | 7 | Checked (single strong excerpt; companion's 2⓪3①5② follows the printed pattern and is computed by script) |
| Stevin predicted decimal coins, weights and measures | 5 | Checked |
| 1792 Coinage Act named a tenth-of-a-dollar coin the "disme"; later "dime" | 8, 9 | Checked |
| Norton's 1608 translation inspired Jefferson's decimal currency | book listing; one encyclopedia-style summary | `[check]`: secondary only; not in child text |
| Al-Kashi's 2π (1424) equivalent to 16 decimal places, unsurpassed for almost 200 years | 10 | Checked (child text: "two times pi ... right to 16 decimal places"; "nearly 200 years") |
| *Key of Arithmetic* completed 1427, a teaching text using decimal fractions | 10, 11 | Checked (independent review 2026-10-25: the Encyclopedia.com DSB entry, https://www.encyclopedia.com/people/science-and-technology/mathematics-biographies/al-kashi, says al-Kashi introduced decimal fractions methodically in this work) |
| Pi's decimals never end and never repeat (proved later) | 12 | Checked; Lambert's year unsettled (13), so no name or year in child text |
| Decimal mathematics and rounding conventions | standard; `check199.py` | Checked by script; math check requested |

## Open checks

1. ~~*Key of Arithmetic*'s use of decimal fractions~~: confirmed in the independent review (see claims table).
2. Lambert's date (1761 vs 1767/1768): spec only; child text unaffected.
3. Jefferson and Norton's *Disme*: stays out of child text unless a primary or scholarly source confirms.
4. Nuria's Spanish line, *¡Hola desde Vadoalto!*, for a fluent Spanish reader (spec 120 rule).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of rods, scales and the river post. If a real image is wanted: the title page of *De Thiende* (1585) is public domain, with scans in university library collections (confirm the scan's own license); al-Uqlidisi's surviving manuscript is held in a library collection whose image terms must be checked before use; the 1792 disme appears in museum and coin-grading photographs that are usually copyrighted. No photograph of a real child or real family appears.
