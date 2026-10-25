# Source audit: spec 274, The Gazette's Grammar

Date: 2026-10-25. Writer's first pass for [spec 274](../specs/274-gazette-grammar.md) and its [companion text](../content/274-gazette-grammar-text.md).

**Method and limits.** The two DfE documents and the key stage 3 programme were downloaded as PDFs and read in full text (`pdftotext`). The three public-domain books were read in their Project Gutenberg texts. The CCSS page was fetched directly. Research papers were checked through search-result excerpts and publisher or repository abstracts only (6 searches, 9 fetches); a reviewer with ordinary access should open the cited papers before build. Claims not confirmed were cut from child text.

## Fiction (no source needed; labeled in the text)

Willowbank, the Print Room and its press, the practice sheets (PIE EATEN AT CAFÉ, the missing pie, the hat on the bridge), the café notices, both *Gazette* columns and their headlines (taken from spec 120's Act IV text), the meeting notice and the three posters, and Hollis's page 4 (quoted from `docs/content/120-keeper-of-the-ways-text.md`). All are labeled "A story from Willowbank". Every sample sentence is newly written for this pack except the three labeled book quotations.

## Sources consulted and what each supports

| # | Source (publisher) | URL | Supports |
| --- | --- | --- | --- |
| S1 | National curriculum in England, English Appendix 2: Vocabulary, grammar and punctuation (DfE, 2013, Open Government Licence) | https://assets.publishing.service.gov.uk/media/5a7d913aed915d3fb959486f/English_Appendix_2_-_Vocabulary_grammar_and_punctuation.pdf | Year 6: "Use of the passive to affect the presentation of information in a sentence"; subjunctive forms "If I were" and "Were they to come" as structures for "some very formal writing and speech", against structures of informal speech; Year 6 terminology list (subject, object, active, passive, synonym, antonym, ellipsis, hyphen, colon, semi-colon, bullet points); Year 2 terms include statement and command; Year 5 terms include modal verb. |
| S2 | National curriculum in England, English glossary (DfE, OGL) | https://assets.publishing.service.gov.uk/media/5a7c8e4ded915d48c24108e2/English_Glossary.pdf | Active voice; passive recognized by past participle, object as subject, optional *by* phrase, *be* or *get*; "not passive" examples ("He received a warning"); a verb is not passive for having a passive meaning; object can become the subject of a passive; past participle used in perfect and passive; subjunctive: few English forms, formal, examples with "be", "not enter" and "were"; ellipsis as omission of an expected, predictable word or phrase; *would* listed among modal verbs; imperative in commands. |
| S3 | National curriculum in England, English programmes of study, key stage 3 (DfE, via the IOE digital archive) | https://dera.ioe.ac.uk/id/eprint/18287/1/SECONDARY_national_curriculum_-_English.pdf | Grammar and vocabulary: studying "the effectiveness and impact of the grammatical features of the texts they read"; discussing language "with precise and confident use of linguistic and literary terminology". |
| S4 | Common Core State Standards, Language, grade 8 (NGA Center and CCSSO) | https://www.thecorestandards.org/ELA-Literacy/L/8/ | L.8.1b active and passive; L.8.1c indicative, imperative, interrogative, conditional and subjunctive moods; L.8.1d shifts in voice and mood; L.8.3a voice and mood "to achieve particular effects (e.g., emphasizing the actor or the action; expressing uncertainty or describing a state contrary to fact)". |
| S5 | Strunk, *The Elements of Style* (privately printed, Ithaca, 1918; public domain), Project Gutenberg #37134 | https://www.gutenberg.org/ebooks/37134 | Rule 10, "Use the active voice."; the passive "frequently convenient and sometimes necessary"; choosing voice by which word the paragraph is about. |
| S6 | Grahame, *The Wind in the Willows* (Methuen, 1908; public domain), Project Gutenberg #289, chapter 1 | https://www.gutenberg.org/ebooks/289 | Exact quotation "So he scraped and scratched and scrabbled and scrooged". |
| S7 | Shakespeare, *Twelfth Night* (public domain), Project Gutenberg #1526; Folger Shakespeare, Act 1 scene 1 | https://www.gutenberg.org/ebooks/1526 ; https://www.folger.edu/explore/shakespeares-works/twelfth-night/read/1/1/ | Opening line "If music be the food of love, play on". |
| S8 | Dating *Twelfth Night* (Royal Shakespeare Company); Internet Shakespeare Editions introduction; John Manningham's diary (British Library Harley MS 5353) | https://www.rsc.org.uk/twelfth-night/dating-the-play ; https://internetshakespeare.uvic.ca/Library/SLT/plays/twelfth%20night/index.html | Written between 1598 and early 1602, most likely 1601; Manningham saw it at the Middle Temple on 2 February 1602. |
| S9 | Myhill, Jones, Lines and Watson 2012, "Re-thinking grammar: the impact of embedded grammar teaching on students' writing and students' metalinguistic understanding", *Research Papers in Education* 27(2): 139-166, DOI 10.1080/02671522.2011.637640 (University of Exeter repository) | https://ore.exeter.ac.uk/repository/handle/10036/4479 | Randomized trial, 744 students, 31 schools; positive effect of grammar taught in the context of writing; teachers named explicitness, discussion and playful experiment as key. Effect sizes and subgroup results not read; not stated in the pack. |
| S10 | Pullum, "Fear and loathing of the English passive", *Language & Communication* (online January 2014), DOI 10.1016/j.langcom.2013.08.009; author's copy | https://pullum.ppls.ed.ac.uk/passive_loathing.html | Advice against the passive dates to the early 1900s; many published critics misidentify passives; the grammatical passive is often confused with a rhetorical sense of hiding agency. Volume and pages differ between listings; cite from the DOI. |
| S11 | Fausey and Boroditsky 2010, "Subtle linguistic cues influence perceived blame and financial liability", *Psychonomic Bulletin & Review* 17: 644-650; Tonković and colleagues' preregistered replication | https://escholarship.org/content/qt1582p8r0/qt1582p8r0_noSplash_4bcacaaed6bf34ee6feef6b599a5acc2.pdf | Agentive (transitive) wording led to more blame and larger penalties than non-agentive (intransitive) wording; replicated in English. It contrasts transitive and intransitive verbs, not passive and active, so the grown-up panel says only that wording can change blame. |
| S12 | "If It Was the Subjunctive Would It Be Wrong" (Brigham Young University linguistics, *Schwa*) | https://schwa.byu.edu/files/2022/02/If-It-Was-the-Subjunctive-Would-It-Be-Wrong.pdf | Corpus evidence that the English subjunctive has declined and first-person indicative "if I was" has recently overtaken "if I were". Student journal; used only for "many people say 'if I was'", which S1 already implies. |
| S13 | Specs 54, 90, 109, 118, 120, 141 and the English build-out plan (PR #172) | `docs/specs/`, `docs/content/120-story/act-4.md`, `docs/content/120-keeper-of-the-ways-text.md` | Act IV ch. 3 headlines and ch. 4 plans; page 4's wording and release; the librarian runs the *Gazette* from Act IV; no built `#library` route; 109 keeps no saved root; sibling ownership. |

## Second pass (2026-10-25)

| Claim | Result | Source |
| --- | --- | --- |
| Year 6 passive, subjunctive and terminology wording | Confirmed in the PDF text. | S1 |
| Glossary passive, subjunctive, ellipsis, modal verb entries | Confirmed in the PDF text. | S2 |
| KS3 grammar and terminology bullets | Confirmed in the PDF text. | S3 |
| CCSS L.8.1b-d and L.8.3a wording | Confirmed by direct fetch. | S4 |
| Strunk rule 10 and the "sometimes necessary" passage | Confirmed in the 1918 text. | S5 |
| Grahame and Shakespeare quotations | Confirmed word for word. | S6, S7 |
| *Twelfth Night* "written about 1601" | Confirmed as the likeliest year; February 1602 performance confirmed. | S8 |
| Gettysburg Address tricolon as a list-of-three example | Exact wording not confirmed from a primary transcription in this pass. **Cut**; card 10 and F1 use Grahame instead. | (none adequate) |
| Mandative subjunctive more common in American than British English | Not searched. **Kept out** of all text. | (none) |
| Headlines often drop small words such as "was" | General knowledge, not separately searched. `[check]` **Kept out** of child text; scene 1 shows only that "Pie eaten" is short for "A pie was eaten". | `[check]` |
| "Made in..." on packets as a short passive | Grammatical judgment: a past-participle clause, a reduced passive. Off-screen card words it as "short passive". | S2 (participle entry) |

## Open checks

- `[check]` headlines as a general habit of dropping words (above); kept out of child text.
- Grammar reviewer: confirm every sentence in A4, B5 and the Who Did It? stack is filed correctly, especially "The brook rose" (active, intransitive) and "The paper is being printed" (progressive passive).
- Reviewer to open S9 and S10 in full; the pack relies on their abstracts only.

## Rights notes

All child-text sentences are newly written, apart from three short quotations from public-domain works (S5, S6, S7), each named with author and date in the text. No DfE example sentences are copied into child text (OGL would allow it; the brief asks for new writing). No images are embedded; the press, the practice sheets and the posters should be original art.

## Marble and Jane

Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` has no record for any of the six targets (`research` is null), as for every English topic there and at upstream head; the spec's upstream table uses the targets' descriptions and evidence lines instead. Jane at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` informed the lesson shape; its English topics have no researched stages. No Jane text or code is used; its "Similes & Metaphors" example belongs to pack 265's ground and was not drawn on.
