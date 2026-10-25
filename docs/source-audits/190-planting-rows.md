# Source audit 190: Planting Rows

Date: 2026-10-25. Spec: [190](../specs/190-planting-rows.md). Companion: [190 text](../content/190-planting-rows-text.md).

**Method.** Three web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (parity, commutativity, factor pairs, primes and composites, the sieve, square and cube numbers, roots, prime factorization and its uniqueness, HCF and LCM, divisibility by 6, Euclid's argument) is standard elementary number theory and needs no outside source beyond the teaching records; the math check is still requested. Every number in every item, card, worked example, scene and model is checked by `check190.py` (167 checks, all passing; scratch area, not in the repo), including two brute-force uniqueness checks (the two squares summing to 100; Sunzi's puzzle under 105). Pedagogy follows the fourteen Marble teaching-research records at `7bd8b67` (CC BY-SA; paraphrased, never copied) and Jane's `LESSONS.md` at `0ec55f7`.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Sieve of Eratosthenes" (history of mathematics artifact) | MoMath and Wolfram | https://wolframcloud.com/obj/history-of-mathematics/production/artifacts/sieve-of-eratosthenes | Earliest known reference to the sieve is Nicomachus's *Introduction to Arithmetic* (early 2nd century CE), which attributes it to Eratosthenes of Cyrene (3rd century BCE). |
| 2 | "Nicomachus of Gerasa" | Encyclopedia.com (Dictionary of Scientific Biography) | https://www.encyclopedia.com/history/news-wires-white-papers-and-books/nicomachus-gerasa | Description of the sieve at *Introduction* I, 13; later Latin (Apuleius, Boethius) and Arabic (Thabit ibn Qurra) translations. |
| 3 | "Nicomachus" (DSB entry) | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/DSB/Nicomachus.pdf | Corroborates 2. |
| 4 | "Sieve of Eratosthenes/Historical Note" | ProofWiki | https://proofwiki.org/wiki/Sieve_of_Eratosthenes/Historical_Note | Eratosthenes' own writings do not survive; the attribution comes from Nicomachus. |
| 5 | "Searching Greek manuscripts for sieves" | Substack essay | https://pappubahry.substack.com/p/searching-greek-manuscripts-for-sieves | Context on the manuscript tradition (background only). |
| 6 | Euclid, *Elements*, Book IX, Proposition 20 | D. E. Joyce, Clark University | https://mathcs.clarku.edu/~djoyce/java/elements/bookIX/propIX20.html | Statement ("prime numbers are more than any assigned multitude") and proof by multiplying the assigned primes and adding one. |
| 7 | "Elements: Book IX, Proposition 20" | Math Lair | https://mathlair.allfunandgames.ca/elements9-20.php | Heath's translation (corroborates 6). |
| 8 | "Euclid's Theorem" | ProofWiki | https://proofwiki.org/wiki/Euclid's_Theorem | The new number need not be prime: 2 × 3 × 5 × 7 × 11 × 13 + 1 = 30,031 = 59 × 509. |
| 9 | "Euclid's theorem on the infinitude of primes: a historical survey of its proofs" | arXiv (Meštrović) | https://arxiv.org/pdf/1202.3670 | Euclid's formulation avoids actual infinity; "infinitely many" is a later restatement. |
| 10 | "Sun Zi" | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Biographies/Sun_Zi/ | The *Sunzi Suanjing* remainder problem (by 3s leaves 2, by 5s leaves 3, by 7s leaves 2; answer 23); dating estimates range from the 3rd to the 5th century; earliest known problem of this kind. |
| 11 | History of mathematics worksheet (Katz excerpt) | Occidental College course page | https://sites.oxy.edu/ron/math/395/23/ws/11.pdf | Sunzi's procedure: 140 + 63 + 30 = 233, less 210, gives 23. |
| 12 | "Chinese remainder theorem" | Wikipedia | https://en.wikipedia.org/wiki/Chinese_remainder_theorem | The problem is in chapter 3 of the *Sunzi Suanjing*; the text gives an answer and procedure, not a general proof. |
| 13 | Marble teaching-research records for the fourteen targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy, misconceptions and constraints summarized in the spec's upstream check. |
| 14 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach → guided → practice; the "I'm stuck" ladder; misconception-tagged three-option items; style limits. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| The earliest surviving description of the sieve is in Nicomachus's *Introduction to Arithmetic* (early 2nd century CE), which credits Eratosthenes | 1, 2, 3, 4 | Checked |
| Eratosthenes lived in the 3rd century BCE, from Cyrene, working in Alexandria; his writings on the sieve are lost | 1, 4; spec 165 (draft PR #145) has him heading the Library at Alexandria | Checked. Child text says "lived in Egypt" and "is said to have" |
| Euclid's *Elements* IX.20: primes are more than any assigned multitude; multiply and add one | 6, 7, 9 | Checked |
| Euclid did not phrase it as "infinitely many" | 9, search excerpt for 6 | Checked |
| The product-plus-one need not be prime (30,031 = 59 × 509) | 8; verified by script | Checked |
| *Sunzi Suanjing* remainder puzzle, answer 23, procedure 233 − 210 | 10, 11, 12; verified by script | Checked |
| *Sunzi Suanjing* dated between the 3rd and 5th centuries CE; author unknown | 10 | Checked. Child text says "between about 1,500 and 1,800 years ago; nobody knows exactly when, or by whom" |
| The book gives no general proof | 10, 12 | Checked |
| "Written in Greek over 2,000 years ago" (Euclid, about 300 BCE) | 6, 9 | Checked (standard dating) |
| Ishango bone as an early record of primes | none sought in depth | Not used: the readings are contested. Kept out of child text by design |

## Open checks

1. Second-pass reading at the source of Nicomachus I, 13 (an English translation) and of the MacTutor Sun Zi page, since only excerpts were seen.
2. Nuria's Spanish lines, *¡Hola, Willowbank!*, *doce* and *¡Increíble!*, for a fluent reader (spec 120 rule). *Uno, dos, tres* reuses spec 120's own line.

## Rights notes for images

No images are embedded. For build art, prefer original drawings: rows of seedlings, crates and a numbered bed are easy to draw. If a real image is wanted, medieval manuscripts of Euclid and printed editions of Nicomachus are public domain (check each scan's reuse terms with the holding library); a page of a historical edition of the *Sunzi Suanjing* should be checked per file on Wikimedia Commons. No photograph of a real child or real family appears.

## Pedagogy notes from the Marble records (paraphrased)

- Parity is built from pairing and equal rows before the ones-digit rule, which is then justified by tens making pairs; 0 is named even; size is decoupled (A1, A4, A7).
- Commutativity is shown by turning, with sharing as its boundary; "same total, different story" is stated (A3, A6, T5, T6).
- Skip counts are structured (6s from 3s, 7s from 5 + 2) and the 9s digit-sum check is scoped to 9-90, since 99 sums to 18 (Pattern Fence note).
- Patterns require a reason; restatement and coincidence are the tagged distractors (B3, B4).
- Factor pairs are searched in order with a stopping point; a turned pair counts once; factors and multiples are kept apart by finite rectangles vs endless hops (C2-C4).
- Primes use the exact two-factor definition; 1 is neither; 2 is the even prime; 51 is the odd-looking composite; testing stops at the square root (D1-D6).
- Squares and cubes are pictured as area and layers; 7² sits beside 7 × 2; exact vs rounded roots at Keeper's Desk (E1, E2, E10).
- Factor trees are built two ways to show one set of primes; HCF and LCM are found from primes with the swap guarded and HCF × LCM as a check (E6, E7).

## Review pass

**Independent review, 2026-10-25.** Numbers recomputed by the reviewer's own script; style re-checked; searches repeated on the *Sunzi Suanjing* (MacTutor and Wikipedia excerpts: dating estimates from the 3rd to the 5th century; remainders 2, 3, 2 by 3s, 5s, 7s; answer 23; no Nicomachus link) and on Euclid IX.20 and Nicomachus via the writer's sources. Anchors stand as written. Open check 1 stays.
