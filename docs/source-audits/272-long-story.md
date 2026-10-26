# Source audit: spec 272, The Long Story

Date: 2026-10-25. Writer's first pass for [spec 272](../specs/272-long-story.md) and its [companion text](../content/272-long-story-text.md).

**Method and limits.** The two novels were downloaded as plain text from Project Gutenberg (#289 and #113, fetched 2026-10-26 UTC, into the writer's scratch) and every book card was checked against them by script (`check272.py`), word for word after whitespace and Gutenberg's `_italic_` markup were normalized. Chapter facts were checked by reading the chapters named. Author dates, publication years and the curriculum wording were checked against web-search result excerpts (four searches); a reviewer with ordinary web access should open the cited pages. Claims not confirmed are marked `[check]` and kept out of child text.

## Fiction and models (no source needed; labeled in the text)

Willowbank, the library nook, the window seat, Lantern Night readings on the footbridge, Pip sleeping through chapter 5, Dot's and Bramble's views on Toad, the magpie's nod, page 5's heading (from spec 120) and the reader's-guide project. All are labeled "A story from Willowbank". The "I'm stuck" easier cases (Pip's buns, Bramble's gate, a howling lane) are invented.

## Sources consulted and what each supports

| # | Source (publisher) | URL | Supports |
| --- | --- | --- | --- |
| S1 | Kenneth Grahame, *The Wind in the Willows* (1908), Project Gutenberg eBook #289 (release 1995, updated 30 Nov 2024; credits Mike Lough and David Widger) | https://www.gutenberg.org/ebooks/289 | Every W card; twelve chapter titles; chapter facts on the chapter cards (ch. 1 boat upset and rescue; ch. 2 horse backs the cart into a ditch, "O bliss! O poop-poop! O my!"; ch. 3 Mole alone in the Wild Wood in winter, the three "Then ... began." paragraphs; ch. 5 mid-December, snow, Mole follows Rat, sobs, they go back, sardines and field-mouse carol-singers; ch. 6 ends with Toad in the dungeon; ch. 7 Portly found on an island; ch. 8 opens on Toad in prison, washerwoman disguise; ch. 9 "the tactful Mole"; ch. 10 ends at the Rat's hole, "Brown and small, with whiskers."; ch. 11 Toad Hall taken by the Wild Wooders; ch. 12 the song sung twice, "Not at all!", "an altered Toad"). |
| S2 | Frances Hodgson Burnett, *The Secret Garden* (1911), Project Gutenberg eBook #113 (release 1994, updated 29 Oct 2024) | https://www.gutenberg.org/ebooks/113 | Every G card; twenty-seven chapters; ch. 5 "It's th' wind"; ch. 8 moor air and "less 'contrary'", door found; ch. 9 "ten years"; ch. 13 the crying leads Mary to Colin; "We are cousins" (ch. 13); ch. 18 the tempers conversation; ch. 27 Mr. Craven abroad (Norway, Switzerland, the Austrian Tyrol), the rhyme, the final scene seen through the servants'-hall window. |
| S3 | Kenneth Grahame, Britannica Kids; EBSCO Research Starters; Find a Grave | https://kids.britannica.com/students/article/Kenneth-Grahame/274616 ; https://ebsco.com/research-starters/history/kenneth-grahame | Died 6 July 1932 (Pangbourne); born 1859 (sources differ, 3 or 8 March); the book published 1908. |
| S4 | Frances Hodgson Burnett (Wikipedia); "100 Years of The Secret Garden" (Public Domain Review) | https://en.wikipedia.org/wiki/Frances_Hodgson_Burnett ; https://publicdomainreview.org/essay/100-years-of-the-secret-garden | Died 29 October 1924, Plandome Manor, New York; the story ran first in *The American Magazine* from autumn 1910 and appeared as a book in 1911. |
| S5 | Common Core State Standards, ELA Reading: Literature (thecorestandards.org) | https://thecorestandards.org/ELA-Literacy/RL/8/ | RL.8.1 "Cite the textual evidence that most strongly supports an analysis ..." (confirmed by search excerpt). RL.4.3, RL.5.3, RL.5.5, RL.6-8.2, RL.6-8.3, RL.6-8.5 are cited as listed on the Marble topics and paraphrased; RL.5.5's wording was not confirmed in this pass (pack 261's audit cites it) `[check]`. |
| S6 | DfE, English programmes of study: key stage 3 (2013, Open Government Licence) | https://dera.ioe.ac.uk/id/eprint/18287/1/SECONDARY_national_curriculum_-_English.pdf | Reading critically: "studying setting, plot, and characterisation, and the effects of these" and "making critical comparisons across texts" (confirmed by search excerpt). |
| S7 | US Copyright Office, Circular 15a (duration); UK Copyright, Designs and Patents Act 1988 s.12 (life plus 70) | https://www.copyright.gov/circs/circ15a.pdf | Works published in the US before 1931 are public domain there in 2026; life plus 70 years in the UK and EU. Applied, not separately searched. |

## Public-domain status

| Work | Published | Author died | US | UK / EU |
| --- | --- | --- | --- | --- |
| *The Wind in the Willows* | 1908 | 1932 | Public domain (before 1931) | Public domain since 2003 |
| *The Secret Garden* | 1910-1911 (serial, then book) | 1924 | Public domain | Public domain since 1995 |

Gutenberg's own licence text is not reproduced; only short excerpts are quoted, with the source named.

## How the excerpts were made

- **Exact words.** Each card is copied from S1 or S2. Curly quotation marks are kept as in the transcription; Gutenberg's underscores for italics are dropped (W3b's "_feel_" is not quoted; no quoted segment loses emphasis that changes its sense).
- **Cuts.** `[...]` marks every cut. Source em-dashes fall only at cut points (W2, W3b, G5) or outside the quoted span, so no dash is printed and no word inside a quoted span is changed. W5 is cut after "please." to drop "Now then!" and the chapter's next sentence.
- **Lengths.** Every card is 150 words or fewer (longest: W3, W8, G6, all under 70).
- **Content screen for *The Secret Garden*.** A search of S2 for colonial terms (India, native, Rajah, Ayah, fakir, heathen, "blacks") found them in chapters 1-4 and in most later chapters (14 "A Young Rajah", 16, 17, 19-23 and 25-27; chapter 18, the source of G5, has none). G2 drops the one India sentence inside its span with a marked cut. No card, chapter card or item quotes or names any of these passages, and chapter 14's title is not shown. The grown-up panel says plainly that the book carries these attitudes throughout.
- **Other screens.** *The Wind in the Willows* chapter 12's last two paragraphs (a dated word for Romani people and a joke about "fat women") and the "ass" lines in chapters 1 and 2 are not quoted. The Wild Wood's "evil wedge-shaped face" is not quoted; W7 keeps to stillness and the three short paragraphs.
- **Retellings.** The chapter cards are the writer's own one- or two-line summaries, checked against the chapters (S1, S2). Chapter 2's card says a motor-car scares the horse (the horse backs the cart into the ditch; the car does not hit it). Chapter 6's says Toad "takes" a car (the book: steals). The *Secret Garden* chapter cards omit how Mrs. Craven died and why Mary came to England.

## Claims checked by reading

| Claim in spec or companion | Result |
| --- | --- |
| Threads take turns, chapters 6-10, and meet at the end of chapter 10 | Confirmed: ch. 6 ends on Toad's dungeon; ch. 7 opens on Mole at the river; ch. 8 opens "When Toad found himself immured"; ch. 9 Rat and the Sea Rat; ch. 10 ends with Toad at a hole in the bank, "It was the Water Rat!" |
| The chapter 1 face is the Rat's, at his hole across the river | Confirmed: "a dark hole in the bank opposite ... A brown little face, with whiskers." The Rat then rows across. |
| Mary hears crying in ch. 5 and finds Colin by it in ch. 13 | Confirmed (S2 ch. 5, ch. 6 title, ch. 13). |
| Colin is Mary's cousin; Mr. Craven is her uncle and Colin's father | Confirmed ("We are cousins"; "Mr. Craven is my uncle"; ch. 27). |
| Dulce Domum means "sweet home" | Latin; standard translation. Not separately searched `[check]` (low risk). |
| Mole "barges about" early, "thinks of his friend first" later | The writer's summary of ch. 1 (rabbit knocked over, oars grabbed) and ch. 5 and 9 (loyalty, the pencil and paper). Offered as a bench done line, not keyed. |
| Toad: change or attention | Both readings have support in ch. 12; nothing in the pack keys an answer. F1 and F3 key only the strongest line for a stated point and reading a line in context. |

## Not used, or cut

- Kipling, *Just So Stories* (1902): left out (racist language in some stories; 265 already quotes it).
- Methuen as Grahame's first publisher and Frederick A. Stokes as Burnett's US book publisher: not confirmed in this pass `[check]`; not in child text or spec.
- The serial's exact months in *The American Magazine*: not confirmed `[check]`; the spec says "from autumn 1910".
- "Read aloud on winter nights ever since" and "readers have argued about Toad for a century": unsourced, cut from the Keeper's notes.
- That *The Wind in the Willows* grew from bedtime stories and letters to Grahame's son: seen in search excerpts (S3) but not needed; not used.

## Rights notes for images

No images are embedded. For build, draw original art for the nook, the chapter map and the cards. Do not reuse illustrations from later editions of either book (for example E. H. Shepard's 1931 *Wind in the Willows*) without a rights check `[check]`.

## Marble and Jane

Marble's `research` is null for all eight targets at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (no English teaching research, 0 of 331 English topics); the spec paraphrases each topic's description and evidence lines only. Jane at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` informed the lesson shape; no Jane text or code is used.
