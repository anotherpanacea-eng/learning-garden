# Source audit 204: First Problems

Date: 2026-10-25. Spec: [204](../specs/204-first-problems.md). Companion: [204 text](../content/204-first-problems-text.md).

**Method.** Six web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The mathematics (addition and subtraction within 20, the bar model, the relational equals sign, commutativity of addition, place value to three digits, one multiplication fact family, the rectangle rule) is standard primary arithmetic and needs no outside source beyond the math check. The teaching approach follows the Marble teaching-research records for the twelve targets (paraphrased, not copied; CC BY-SA). All puzzles, prices, lengths and counts in problem items are **made-up labeled data**, verified by `check204.py` (167 checks, all passing; scratch area, not in the repo). Child text was checked by `style204.py` (no em-dashes, all word limits met).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "How to Solve It" | Wikipedia | https://en.wikipedia.org/wiki/How_to_Solve_It | First published by Princeton University Press in 1945; second edition Doubleday 1957; four phases: understand the problem, devise a plan, carry out the plan, look back; translated into more than 15 languages. |
| 2 | "George Pólya" | Wikipedia | https://en.wikipedia.org/wiki/George_P%C3%B3lya | Born 13 December 1887 in Budapest; died 1985 in Palo Alto; worked at ETH Zürich and Stanford. |
| 3 | "How to solve it" | Plus Magazine (University of Cambridge) | https://plus.maths.org/content/how-solve-it | Pólya moved to the US at the start of the Second World War, worked at Stanford, and wrote the book there. |
| 4 | "George Pólya's Four Steps to Problem Solving" | University of San Diego (course page) | https://home.sandiego.edu/~pmyers/foursteps.htm | The four steps with the step-one guidance (find the unknown, the data and the condition; draw a figure); corroborates 1. |
| 5 | "Polya's four steps to solving a problem" | University of Kentucky (course page) | https://www.ms.uky.edu/~carl/ma310/spring03/polya/Polya.htm | Corroborates 1 and 4; "look back" includes checking the result. |
| 6 | "In Mesopotamia Neolithic Tokens are Developed for 'Concrete' Counting" | HistoryofInformation.com | https://historyofinformation.com/detail.php?entryid=7 | Clay tokens in geometric forms from about 8000 BCE, used for concrete counting; summarizes Schmandt-Besserat. |
| 7 | "Mesopotamian Tokens" (teaching sheet) | University of Illinois Extension | https://web.extension.illinois.edu/artifact/shared/pdf/mesopotamia/Mesopotamian%20Tokens.pdf | Tokens from about 7500 BCE; one token per item owned (three sheep, three tokens); sealed in hollow clay envelopes (bullae) so they could not be altered; marks on the outside. |
| 8 | "HIST 1100, Section 16: Tokens" | Utah State University | https://www.usu.edu/markdamen/HIST1100/chapters/16TOKENS.htm | Schmandt-Besserat (University of Texas at Austin) documented tokens in use from 7500 to 3000 BCE across the Middle East; tokens as counters in one-to-one correspondence. |
| 9 | "Clay Tokens and the Origin of Writing" | JTW Ceramics (blog) | https://jtwceramics.com/2020/07/14/clay-tokens-and-the-origin-of-writing/ | Plain shapes (cones, spheres, disks, cylinders) for farm goods; later complex tokens; summary of the writing argument. |
| 10 | "Before Writing" / "How Writing Came About" | P2P Foundation wiki (summaries of Schmandt-Besserat's books) | https://wiki.p2pfoundation.net/Before_Writing | Corroborates 8: tokens as precursors of cuneiform signs. |
| 11 | Archaeology Odyssey 5:1 (2002) and Wikipedia summaries of the debate | Biblical Archaeology Society; search excerpts | https://old.biblicalarchaeology.org/node/117841 | Criticism of the token-to-writing theory (complex tokens; reliance on few envelopes); Amiet did not equate token shapes with signs. |
| 12 | A. Leo Oppenheim, "On an Operational Device in Mesopotamian Bureaucracy" (1958) | Journal of Near Eastern Studies, via urkesh.org | https://urkesh.org/attach/Oppenheim1958.pdf | A hollow egg-shaped tablet from Nuzi (about 1400 BCE) with small "stones" inside; shepherd-control explanation. Count differs between excerpts (48 or 49). |
| 13 | "Tokens, Writing and (Ac)counting" (interview with Schmandt-Besserat and Bill Maurer) | Exchanges, University of Warwick | https://exchanges.warwick.ac.uk/index.php/exchanges/article/view/196 | Tokens impressed on envelopes before sealing; the accounting interpretation. |
| 14 | Marble teaching-research records for the twelve targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy, misconceptions and assessment constraints summarized in the spec's upstream check. |
| 15 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach, guided, practice; the "I'm stuck" ladder; three-option misconception-tagged items; glossary. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| *How to Solve It*, by George Pólya, first published 1945 (Princeton University Press) | 1, 3 | Checked |
| Four steps: understand, plan, carry out, look back | 1, 4, 5 | Checked (child text: "understand, plan, do, look back") |
| Pólya born in Budapest (1887); taught at Stanford and wrote the book there | 2, 3 | Checked (Keeper's note only) |
| Printed in many languages | 1 | Checked ("more than 15 languages"; child text says "many") |
| Clay tokens in the Near East, each standing for one unit of goods | 6, 7, 8 | Checked |
| Shapes included cones, spheres (balls), disks and cylinders | 8, 9 | Checked |
| In use for thousands of years, starting over 9,000 years ago | 6 (about 8000 BCE), 7 and 8 (7500 BCE) | Checked: both dates give more than 9,000 years before 2026; child text gives no exact year |
| Later sealed in hollow clay envelopes so the count could not be changed | 7, 13 | Checked (one teaching source states the purpose; the "debt" reading in 13 is consistent) |
| Schmandt-Besserat argues tokens led to writing; others dispute parts of it | 8, 10, 11 | Checked; child text says "one archaeologist thinks... other experts are less sure" |
| One sheep as an example of what a token stood for | 7 | Checked. A draft "one basket of grain" example was cut from child text because no excerpt confirmed a grain token; a measure-of-grain token can return only after a source check `[check]` |
| Nuzi hollow tablet with 48 or 49 counters, about 1400 BCE | 12, 7 | `[check]`: count differs between excerpts; not in child text |

## Open checks

1. Nuzi tablet counter count (48 or 49) before any child-facing use. Not in child text.
2. A grain-measure token (from Schmandt-Besserat's catalog) if a second example is wanted on H2. Not in child text.
3. Pólya's name is written with the accent (Pólya) everywhere; the narrator audio needs the pronunciation "POH-lya".

## Rights notes for images

No images are embedded. For build art, prefer original drawings: the basket, the stalls, the Tool Tray and every stamp are original. If a real image is wanted: clay tokens and bullae are held by museums with open-access collections (for example the Louvre and the Penn Museum), to be confirmed per object and license; a 1945 book cover is likely still in copyright, so do not reproduce it. Portraits of Pólya need a per-file license check. No photograph of a real child or real family appears.

## Pedagogy notes (from the Marble records, paraphrased)

- Sense-making: comprehension before calculation, a staged reveal, an occasional unanswerable story, and no cue-word rules. Spec: Basket Table, A1-A5.
- Tool choice: the reason is the practice; let a tool's limit be felt (fingers on 8 + 7). Spec: B3, Tool Tray.
- Modelling: model the action and read the answer back with its words; sense-check impossible answers. Spec: B2, B4, B5, C4, C5.
- Representations: name each quantity's referent; bar model for structure; equals as "the same amount". Spec: Four Ways Board, D1-D5.
- Showing and explaining: accept objects and drawings; reasoning can run ahead of words; because-stems, agreeing methods and error-finding. Spec: Show-Me Slate, E1-E5; spoken work never stored.
- Efficiency and structure: predict the repeat instead of recounting; slow and quick moves side by side; one array for a fact family; classify by properties. Spec: Quick-Way Path, F1-F7.
- Multi-step: self-questioning prompts, a child-built bar, an irrelevant number, check another way. Spec: Scene 2, A5, A6, F8.
