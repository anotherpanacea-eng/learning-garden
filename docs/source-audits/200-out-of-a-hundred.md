# Source audit 200: Out of a Hundred

Date: 2026-10-25. Spec: [200](../specs/200-out-of-a-hundred.md). Companion: [200 text](../content/200-out-of-a-hundred-text.md).

**Method.** Four web searches (WebSearch). Page fetches are usually blocked in this session and were not used, so every history claim rests on search-result excerpts and should be re-read at the source in the second pass. The mathematics (percent as parts per hundred; fraction-decimal-percent equivalence; percent of an amount; one quantity as a percent of another; percent change as a multiplier; one-step reverse percents; simple interest; percentage points) is standard school mathematics, matched against the pinned Marble topic descriptions and the Marble teaching-research records below. All orchard, field, price, sales and savings figures are **made-up labeled data**, verified by `check200.py` (95 checks, all passing; scratch area, not in the repo). Child text was checked by `style200.py` (0 problems).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Centesima rerum venalium" | Wikipedia | https://en.wikipedia.org/wiki/Centesima_rerum_venalium | A 1% tax on goods sold at auction; name and meaning. |
| 2 | "Centesima", W. Smith, *Dictionary of Greek and Roman Antiquities* (1875) | LacusCurtius (University of Chicago, Bill Thayer) | https://penelope.uchicago.edu/Thayer/E/Roman/Texts/secondary/SMIGRA*/Centesima.html | Tax of one per cent at Rome and in Italy on goods exposed for public sale at auctions; proceeds assigned by Augustus to the *aerarium militare*; Tiberius reduced it to one half per cent (*ducentesima*) after Cappadocia became a province (Tacitus, *Annals* 1.78, 2.42); Caligula abolished it for Italy (Suetonius); Dio's contrary report judged less authoritative; origin date uncertain. |
| 3 | "Aerarium", same dictionary | LacusCurtius | https://penelope.uchicago.edu/Thayer/E/Roman/Texts/secondary/SMIGRA*/Aerarium.html | The military treasury founded by Augustus; cites *Annals* 1.78 and 2.42 for the reduction to a half per cent. |
| 4 | "List of Roman taxes"; "Taxation in ancient Rome" | Wikipedia | https://en.wikipedia.org/wiki/List_of_Roman_taxes | Corroborates 1-2 on the 1% auction tax. |
| 5 | "Tributum" | Encyclopaedia Britannica | https://www.britannica.com/topic/tributum | Attributes a 1% general sales tax (*centesima rerum venalium*) to the time of Julius Caesar, conflicting with sources that tie it to Augustus or the civil wars. |
| 6 | Lewis and Short, *aerarius* | Berlin-Brandenburg Academy (Latin dictionary) | https://cld.bbaw.de/lemma/lat/aerarius | Cites *Annals* 1.78 for Augustus's *aerarium militare*. |
| 7 | Gibbon, *Decline and Fall*, vol. 1, notes | Christian Classics Ethereal Library | https://ccel.org/ccel/gibbon/decline/volume1/nt6/101.htm | Note on *Annals* 1.78: the reduction to one half was short-lived (corroborates 2). |
| 8 | "Percent sign" | Wikipedia | https://en.wikipedia.org/wiki/Percent_sign | Earlier forms *per 100*, *p 100*, *p cento*; pages probably added around 1435 to a 1425 arithmetic text show "pc" with a small loop for the ordinal ending; developed into a horizontal fraction-like sign by about 1650 and later lost the "per". |
| 9 | "Percent sign" (*Shady Characters*) | Keith Houston | https://shadycharacters.co.uk/2015/03/percent-sign | David Eugene Smith reported the Italian manuscript abbreviation (Plimpton collection) in 1908 and read it as *per cento*, unrelated to the digit zero; a 1684 manuscript shows the p as a squiggle and the c as a circle with a stroke; the modern form settled in the 19th century. |
| 10 | Marble teaching-research records for the eight targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. One example in the *Understanding Percentages* record (90% of 60 given as 48) is arithmetically wrong; the pack uses 80% of 60 = 48. |
| 11 | Pinned `curriculum/marble/topics.json` and `dependencies.json` | this repo | local | Topic names, descriptions and hard prerequisites. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Rome taxed goods sold at public auction at one part in a hundred, the *centesima* ("the hundredth") | 1, 2, 4 | Checked |
| Augustus assigned the tax's proceeds to the military treasury for veterans | 2, 3, 6 | Checked |
| Tiberius halved it to one half per cent (one part in two hundred) | 2, 3, 7 | Checked (Tacitus via two dictionary entries; Dio reports otherwise, judged weaker) |
| When the tax began (civil wars, Augustus, or Julius Caesar) | 2, 5 | `[check]`: sources conflict; not in child text |
| Caligula abolished it for Italy | 2 | Checked in one source; not in child text |
| Italian merchants wrote *per cento*, abbreviated in several ways | 8, 9 | Checked |
| An Italian arithmetic from the 1400s shows "pc" with a small loop (pages probably added about 1435 to a 1425 text), reported by D. E. Smith in 1908 | 8, 9 | Checked; child text says only "an Italian arithmetic book from the 1400s" |
| The loop and letters slowly became the modern % over the following centuries | 8, 9 | Checked; exact dates (1650, 1684, 19th century) kept out of child text |
| Percent mathematics in teach cards and items | 10, 11 | Standard; math check still requested |

**Kept out of child text:** the tax's start date; Caligula; the exact manuscript year; any claim that Augustus created the tax (F3 tests this as "not from this card"). H1's "300 coins" is a worked illustration of 1%, labeled inside a history card's Keeper's note; it does not claim any real sale.

**Anchors considered and not used:** Florence Nightingale's statistics (her famous diagrams are polar-area charts of death counts and rates, not percent teaching, so they would need careful framing; left out). No well-sourced percent anchor from a non-European tradition was found in the time available; owner question 3 records the default.

## Fiction and sensitivity checks

- The town debate is spec 120's Act IV fiction; the claim "the marsh would flood 40% of the low fields" and its counts (12 of 30 low fields, 80 fields in all) are this pack's own invented numbers, labeled as made up. No real election, party, policy or political claim appears. Independent review, 2026-10-25: no scene, item or feedback implies which plan the town should keep; Scene 2's Keeper's note now says so outright, and F2's right answer restates both wholes without judging the Sponge plan.
- Money is US dollars and cents. Marble's pounds examples (25% off £40, £500 at 3% for 4 years) are mapped by concept to dollars; the numbers are kept where they suit the story.
- No real child's name, age or grade appears. Bramble's objection at the meeting stays fair (spec 120 cast rule).
- Hollis is not named anywhere in this pack.

## Open checks

1. Start date of the *centesima*: re-read Tacitus *Annals* 1.78 and Britannica at the source. Not in child text.
2. Re-read source 9 at the page (search excerpt only) for the 1684 details. Not in child text.
3. Math check on the percentage-points item (F4) and the simple-interest fence (E5).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the hundred square, bar, jars and claim cards. If a real image of the manuscript abbreviation is wanted, Wikimedia Commons hosts reproductions of the Smith example; check each file's license. Roman auction scenes should be drawn fresh. No photograph of a real child or real family appears.
