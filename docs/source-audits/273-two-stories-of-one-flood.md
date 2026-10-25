# Source audit: spec 273, Two Stories of One Flood

Date: 2026-10-25. Writer's first pass for [spec 273](../specs/273-two-stories-of-one-flood.md) and its [companion text](../content/273-two-stories-of-one-flood-text.md).

**Method and limits.** Eight web searches and seven page fetches. Two fetches were refused (pepysdiary.com 403; a National Archives education page 410), so the Pepys wording was checked against the Standard Ebooks text instead. The DfE key stage 3 PDF was downloaded and its text extracted locally. Common Core standards RI.4.6, RL.5.6 and RL.8.6 were read on the standards site; RI.5.6 and RL/RI.6.6-7.6 were not opened and are taken from Marble's topic records, which quote their codes. A reviewer with ordinary web access should open the cited pages before build. Claims not confirmed were cut or are marked `[check]` below and kept out of child text.

## Fiction (no source needed; labeled in the text)

Willowbank and everything written in it: the miller's storm-night note, Dot's notice, the four storm tellings, the missing ribbon in three tellings and the magpie's version, Pip and the scratching, the librarian's *From the Archive* column, the *Gazette* pieces "Just a bad storm" and "We made it worse", the orchard keeper's account, the mill book, the picture-book page, the baker's sign and Dot's letter to Nuria. All are labeled "A story from Willowbank". Page 4 is spec 120's own fiction, shown from the [spec 120 companion](../content/120-keeper-of-the-ways-text.md#page-4-the-year-of-the-fine-harvest) and not retold; "Year 22" to "Year 27" gives the five years used in scenes 4 and 5. No made-up models are used.

## Sources consulted and what each supports

| # | Source (publisher) | URL | Supports |
| --- | --- | --- | --- |
| S1 | Common Core State Standards, ELA Reading Informational Text grade 4 (NGA Center and CCSSO) | https://www.thecorestandards.org/ELA-Literacy/RI/4/ | RI.4.6: compare a firsthand and a secondhand account of one event or topic; describe differences in focus and information. |
| S2 | Common Core, Reading Literature grade 5 | https://www.thecorestandards.org/ELA-Literacy/RL/5/ | RL.5.6: how a narrator's or speaker's point of view influences how events are described. |
| S3 | Common Core, Reading Literature grade 8 | https://www.thecorestandards.org/ELA-Literacy/RL/8/ | RL.8.6: differences in the points of view of characters and reader, such as dramatic irony, create suspense or humor. |
| S4 | Marble topic records at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (CC BY-SA), via the pack's research file | `curriculum/marble/topics.json` and upstream `data/topics.json` | Topic descriptions, evidence lines and standards codes (RI.5.6, RI/RL.6-8.6, KS3-ENG-R-2c and 3c). Paraphrased only. `research` is null for all five. |
| S5 | DfE, *English programmes of study: key stage 3* (September 2013, Open Government Licence), DERA copy | https://dera.ioe.ac.uk/id/eprint/18287/1/SECONDARY_national_curriculum_-_English.pdf | Reading: "knowing the purpose, audience for and context of the writing and drawing on this knowledge to support comprehension"; also "studying setting, plot, and characterisation, and the effects of these" (read critically). Text extracted and matched locally. |
| S6 | Samuel Pepys, *The Diary of Samuel Pepys*, September 1666 (Standard Ebooks public-domain edition; its base transcription, probably Wheatley's, is `[check]`) | https://standardebooks.org/ebooks/samuel-pepys/the-diary/text/chapter-81 | The six excerpts as quoted: "Jane called us up about three in the morning"; "and so went to bed again and to sleep"; "So I down to the waterside, and there got a boat and through bridge, and there saw a lamentable fire."; "the poor pigeons, I perceive, were loth to leave their houses, but hovered about the windows and balconies"; the Lieutenant of the Tower "tells me that it begun this morning in the King's baker's house in Pudding-lane"; 4 September, "and I my Parmazan cheese, as well as my wine and some other things." |
| S7 | Project Gutenberg, *Diary of Samuel Pepys*, vol. 1, Preface and Life (Wheatley, 1893); Wikipedia, John Smith (priest, born 1799) | https://www.gutenberg.org/cache/epub/4117/pg4117.html ; https://en.wikipedia.org/wiki/John_Smith_(priest,_born_1799) | Diary in Thomas Shelton's shorthand (published 1620); deciphered by John Smith at Magdalene College, Cambridge, about 1819-1822; first edition, edited by Lord Braybrooke, 1825, printing about half the manuscript. Pepys died 1703 (general knowledge, low risk). Public domain: the 1666 text, and the 1893 edition, are out of copyright. |
| S8 | *The Gazette*, "This month in history: the Great Fire of London" (official site of the London Gazette) | https://www.thegazette.co.uk/all-notices/content/66 | Began 2 September 1666 at "the king's bakery in Pudding Lane" after "a long, dry summer"; over 13,000 houses; St Paul's destroyed; the Gazette's premises burned, an issue was missed, it reappeared Monday 10 September; issue 85's account was for "satisfying the minds of so many of His Majesties good Subjects". |
| S9 | London Museum, *The Great Fire of London*; Museum of London collections event page | https://www.londonmuseum.org.uk/collections/london-stories/great-fire-of-london/ ; https://collections.museumoflondon.org.uk/online/event/28.html | Thomas Farriner's bakery; strong easterly wind; fire stopped about four days later (one page says just under five days). Some writers place the bakery in Fish Yard, just off Pudding Lane. Seen in search excerpts only. |
| S10 | Wayne C. Booth, *The Rhetoric of Fiction* (University of Chicago Press, 1961), via NYPL catalog record and summaries (Wikipedia, EBSCO Research Starters) | https://en.wikipedia.org/wiki/Unreliable_narrator ; https://www.ebsco.com/research-starters/literature-and-writing/unreliable-narrator | The term "unreliable narrator" from Booth (1961); an account that lacks credibility, openly or through contradictions. Kinds used in the pack (fibbing, mistaken, not understanding) are a teaching simplification. |
| S11 | Wineburg, S. (1991), "Historical problem solving", *Journal of Educational Psychology* 83(1): 73-87 | https://doi.org/10.1037/0022-0663.83.1.73 | The "sourcing" heuristic (who wrote it, when, why). Design reference for the spec's grown-up text; not opened this pass `[check]` page numbers. |
| S12 | Specs 59, 69, 118, 120, 136, 180, 219 (this repo); English build-out plan (PR #172) | `docs/specs/`, `docs/content/120-keeper-of-the-ways-text.md` | Sibling ownership; page 4 text and release order; Hollis rule; the Gazette in Act IV ch. 3; magpie pronoun "it" in earlier specs. |

General knowledge not separately searched (low risk, reviewer to confirm): definitions of first person, third person limited and omniscient narration and of dramatic irony (any literary glossary, for example Merriam-Webster or the Oxford Dictionary of Literary Terms); autobiography against biography.

## Checks and decisions

| Claim | Result | Where it is used |
| --- | --- | --- |
| Fire began "early on Sunday 2 September 1666" | Confirmed (S8, S9); start time varies by source (about 1 a.m.), so no time is given | History page |
| "On Pudding Lane" | Most sources say so; one says just off it in Fish Yard. Kept with a review ask | History page; Pepys line says "in Pudding-lane" in his own words |
| About four days; more than 13,000 houses; Old St Paul's | Confirmed (S8, S9). The common "87 churches" and "13,200 houses" figures were not confirmed: **cut** | History page |
| Strong east wind; long dry summer | Confirmed (S9 search excerpt; S8) | History page |
| Deaths | Low recorded figure is disputed and not needed: **left out** | Nowhere |
| Gazette "a week later" | It reappeared 10 September, eight days after the fire began; "a week later" is used only in bench (f)'s matching line. The Keeper's Desk card gives 10 September | Bench (f), Gazette card |
| Pepys's maid Jane | Diary text names "Jane"; her role as a maid is standard in editions `[check]` against an annotated edition | Pepys table modern line |
| Pepys buried cheese and wine "in a pit" | The 4 September entry: Batten dug a pit in the garden; Pepys and Penn dug another `[check]` exact sentence. Child text says "in a pit", without "garden" | Pepys table |
| Standard Ebooks base edition | Not confirmed which transcription they used: `[check]`. Wording matches the Wheatley text as widely quoted | S6 |

## Rights notes

All Pepys lines are short excerpts from a diary written in 1666 and published from 1825; the text is in the public domain, and Standard Ebooks releases its editions to the public domain. The history page, the Willowbank texts and all modern lines are newly written for this pack. No living author's text, no owner writing, nothing from Dropbox. Images: none embedded. For build, draw original art for the archive table, papers and ribbon; if a picture of the fire is wanted, prefer a public-domain contemporary print (for example a museum open-access image) and record its license. Avoid any image showing people hurt.

## Marble and Jane

Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac`: `research` is null for all five targets; Marble has no English teaching research at the pin or at upstream head (0 of 331 English topics), so the upstream check uses topic descriptions, evidence lines and standards only (paraphrased, CC BY-SA). Jane at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` informed the lesson shape; no Jane text or code is used.
