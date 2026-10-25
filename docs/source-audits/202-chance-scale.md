# Source audit 202: The Chance Window

Date: 2026-10-25. Spec: [202](../specs/202-chance-scale.md). Companion: [202 text](../content/202-chance-scale-text.md).

**Method.** Four web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (likelihood words; equally likely outcomes; probability as favorable over total; the 0-to-1 scale; sum to 1 and complements; the overlap condition; Venn regions and the union count; two-way tables and the product rule) is standard school probability, cross-checked against the pinned Marble topic descriptions and teaching-research records. All bags, spinners, seed packets, tables and splits in problem items are **made-up labeled data**, verified by `check202.py` (79 checks, all passing; scratch area, not in the repo), including a brute-force enumeration of the unfinished game's continuations, Pingala's three-beat patterns and a concrete 24-packet list re-counted into Venn regions. The flood numbers come from spec 120's fictional ledger (draft PR #127, `docs/content/120-keeper-of-the-ways-text.md`, page 2) and were recomputed from it. A style check (`style202.py`) on the companion found no em-dashes and no over-length card, prompt, hint, explanation or feedback line.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Problem of points" | Wikipedia | https://en.wikipedia.org/wiki/Problem_of_points | The problem of dividing stakes in an interrupted game; Pascal and Fermat's 1654 correspondence; the division should depend on how the game could continue, not on the history so far; earlier attempts by Pacioli, Tartaglia, Cardano. |
| 2 | Pascal and Fermat letters (translations) | R. J. Pulskamp, Royal Holloway history pages | https://gtfp.cs.rhul.ac.uk/pulskamp/Pascal/Pascal.html ; https://gtfp.cs.rhul.ac.uk/pulskamp/Fermat/fermat.html | Translations of the 1654 letters; Pascal's first letter lost; Pascal's 29 July 1654 letter. |
| 3 | "This Month in Physics History: July 1654" | APS News (2009) | https://www.aps.org/apsnews/2009/07/pascal-letters-fermat-points | Dates the exchange to the summer of 1654. |
| 4 | Review of *The Unfinished Game* (Devlin) | American Scientist | https://www.americanscientist.org/node/742 | Pascal and Fermat never met face to face. |
| 5 | "Pascal and Fermat Devise the Theory of Probability" | EBSCO Research Starters | https://www.ebsco.com/research-starters/history/pascal-and-fermat-devise-theory-probability | The correspondence as a founding moment of probability (corroborates 1). |
| 6 | "Pierre de Fermat" | Encyclopedia of Mathematics | https://encyclopediaofmath.org/wiki/Pierre_de_Fermat | Fermat's role in the 1654 exchange; Toulouse. |
| 7 | "Venn diagram" | Wikipedia | https://en.wikipedia.org/wiki/Venn_diagram | Venn's July 1880 paper in the *Philosophical Magazine*; earlier similar diagrams (Weise 1712, Euler 1768); Venn popularized the style. |
| 8 | Venn diagram survey (Ruskey and Weston) | Electronic Journal of Combinatorics, Dynamic Survey DS5 | https://www.combinatorics.org/files/Surveys/ds5/VennJohnEJC.html | Bibliographic record of the 1880 paper (gives volume 9; the publisher gives 10). |
| 9 | "John Venn" | Wikipedia | https://wikipedia.com/wiki/John_Venn | English logician; *Symbolic Logic* (1881). |
| 10 | "Pingala" | Wikipedia | https://en.wikipedia.org/wiki/Pingala | *Chandaḥśāstra*; *prastāra* lists all short/long patterns; 2^n patterns for n syllables; dating uncertain. |
| 11 | "Mathematics for poets and drummers" and "Recursion and combinatorial mathematics in Chandaśāstra" | University of Hyderabad, Algorithms in Ancient India course pages | https://sanskrit.uohyd.ac.in/Algorithms_in_Ancient_India/Material/mathforpoets.pdf ; https://sanskrit.uohyd.ac.in/Algorithms_in_Ancient_India/20-2-2018/Recursion_and_Iteration.pdf | *Prastāra* as a recursive listing (each length built from the shorter list); places the work around the 2nd century BCE; Halāyudha's 10th-century commentary and the *meru-prastāra*. |
| 12 | "Pingala's work" (arXiv math/0703658) | arXiv | https://arxiv.org/pdf/math/0703658v1 | Corroborates 10-11 on the listing and counting. |
| 13 | Spec 120 flood ledger (page 2) and Act III/IV scripts | Learning Garden draft PR #127 | `git show pr/127:docs/content/120-keeper-of-the-ways-text.md` | Fictional ledger years and heights; the seed exchange and Act IV chapter titles. |
| 14 | Marble teaching-research records for the eleven targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Pascal and Fermat corresponded about a fairly divided unfinished game in 1654 | 1, 2, 3, 5 | Checked |
| Their idea: share by how the game could still end, not by points so far | 1 | Checked (single strong excerpt; consistent with 2) |
| They never met | 4 | Checked (single source excerpt; second pass to confirm) |
| Both were French mathematicians | 1, 6 | Checked |
| Fermat in Toulouse; Pascal in Paris at the time | 6; independent review search, 2026-10-25 (Scribd excerpt of a history of the letters: Fermat a judge in Toulouse, Pascal "living in Paris", https://es.scribd.com/document/337037968/Fermat-and-Pascal) | Checked on search excerpts; not in child text |
| The original question came from a gambler (the Chevalier de Méré) | 1 | Checked; deliberately left out of child text (no gambling framing) |
| "Many people count their letters as a beginning of probability" | 1, 5 | Checked (child text keeps the hedge "many people") |
| Venn published overlapping-circle diagrams in the *Philosophical Magazine*, July 1880 | 7, 8 | Checked (volume 9 vs 10 differs between sources; not in child text) |
| Similar diagrams earlier, including Euler 1768 | 7 | Checked |
| Venn was English and worked on logic | 7, 9 | Checked |
| Pingala listed every short/long pattern (*prastāra*) and counted 2^n | 10, 11, 12 | Checked |
| Pingala lived "more than 2,000 years ago" | 10, 11 (5th to 2nd century BCE range) | Checked as a safe lower bound; no exact date in child text |
| Pingala "invented binary" | 10 (disputed) | Left out of child text |
| Flood ledger: big floods (100 cm or more) in years 27, 34, 36, 38; none before year 22 | 13 | Checked against the fiction; "big flood" threshold is this pack's label |

## Open checks

1. Pascal's location in 1654: cleared on a search excerpt in independent review (Paris); still not in child text.
2. Whether Hollis's ledger runs exactly years 1 to 40 (owner question 3 in the spec). Independent review changed the card from 1 to 38 to 1 to 40, matching spec 120's letter 4 ("years of Hollis's keeping", 1 to 40) and sibling spec 203; the 4/40 and 4/20 figures depend on it.
3. Nuria's Spanish line, *¡Hola desde Vadoalto!*, for a fluent Spanish reader (spec 120 rule).
4. Re-read sources 1, 4, 7 and 10 at the source when fetches are available.

## Rights notes for images

No images are embedded. For build art, prefer original drawings of spinners, bags and packets. If a real image is wanted: Venn's 1880 figures and portraits of Pascal and Fermat are public domain by age (confirm each scan's terms on Wikimedia Commons). No manuscript image of Pingala's text is proposed. No photograph of a real child or real family appears.

## Pedagogy note (Marble, paraphrased)

The research records agree on a few design constraints this pack follows: words justified from composition rather than wishes; endpoints reserved for all or none; equal chance decided by part size; part-whole over part-part; one line with three notations and conversion before comparing; sum to 1 only for complete, non-overlapping lists, with the even-or-prime trap; Venn regions filled overlap first, with "neither" inside the box; and recognition tasks paired with construction (the Build, Cover and Build-from-totals modes). The records' own worked numbers were not reused: this pack's Venn uses 24 packets (13, 9, 5) and its spinners and bags are original.
