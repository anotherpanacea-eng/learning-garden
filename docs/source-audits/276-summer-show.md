# Source audit: 276 The Summer Show

For [spec 276](../specs/276-summer-show.md) and its [companion text](../content/276-summer-show-text.md). Writer's pass, 2026-10-26.

**Method and limits.** The public-domain texts were downloaded as plain text from Project Gutenberg (#136, #1322, #1041, #1539, #43825, and #28722 and #76703 for comparison) into the writer's scratch and matched by script (`check276.py`), word for word after whitespace and curly quotes were normalized. Syllable counts and rhymes were checked against the CMU Pronouncing Dictionary (cmusphinx/cmudict, downloaded from GitHub), with twelve hand-entered words it lacks (millpond, footbridge, creaks, and the elided forms *dimm'd*, *untrimm'd*, *ow'st*, *grow'st*, *wander'st*, *learn'd*, *wander'd*, *look'd*, *boil'd*, each counted without the syllable its apostrophe drops: *untrimm'd*, *wander'st* and *wander'd* are two, the rest one). England's programmes of study were read in the DfE text already in the writer's scratch (KS1-2 and KS3). Common Core pages were fetched directly. Other claims were checked by web search excerpts or fetched glossary pages (9 fetches, 4 searches); Britannica and the Poetry Foundation refused fetches. **Marble has no English teaching research** (`research` null for all nine targets). No living author's text is used, and nothing is drawn from the owner's own writing.

## Sources

| # | Source | Where | Used for |
| --- | --- | --- | --- |
| S1 | Robert Louis Stevenson, *A Child's Garden of Verses* (1885), Project Gutenberg #136 (release 1994); compared with #28722 (Lippincott printing illustrated by Maria L. Kirk) | https://www.gutenberg.org/ebooks/136 | "Bed in Summer", quoted whole from #136. #28722 has a comma after "In summer" in line 3; #136 has none. The 1885 first printing was not checked `[check]`. Stevenson died 1894. |
| S2 | Walt Whitman, *Leaves of Grass*, Project Gutenberg #1322 (G. Fuhrman and David Widger; Book XX "By the Roadside", the late arrangement) | https://www.gutenberg.org/ebooks/1322 | "When I Heard the Learn'd Astronomer", quoted whole; line 4 is one line wrapped in the file. Not compared with the 1865 *Drum-Taps* printing `[check]`. Whitman died 1892. |
| S3 | Walt Whitman Archive, encyclopedia entry on the poem (via search excerpt) | https://whitmanarchive.org/item/encyclopedia_entry735 | First printed in *Drum-Taps* (1865); in *Leaves of Grass* from 1867; in "By the Roadside" from 1881. |
| S4 | William Shakespeare, *Shakespeare's Sonnets*, Project Gutenberg #1041 (Project Gutenberg Shakespeare Team) | https://www.gutenberg.org/ebooks/1041 | Sonnet XVIII, quoted whole. |
| S5 | Folger Shakespeare Library, "About Shakespeare's Sonnets"; Wikipedia, "Shakespeare's sonnets" (via search excerpts) | https://www.folger.edu/explore/shakespeares-works/shakespeares-sonnets/about-shakespeares-sonnets/ | 154 sonnets first printed together in a 1609 quarto by Thomas Thorpe (entered 20 May 1609). |
| S6 | Shakespeare, *The Winter's Tale*, Project Gutenberg #1539 | https://www.gutenberg.org/ebooks/1539 | Act III scene III (Bohemia, a desert country near the sea): "[_Exit, pursued by a bear._]". First printed in the First Folio (1623): standard, not separately fetched `[check]`. The file has a "Dramatis Personæ" list. |
| S7 | Francis James Child, ed., *English and Scottish Ballads*, vol. VIII (Little, Brown, Boston; entered 1858), Project Gutenberg #43825 | https://www.gutenberg.org/ebooks/43825 | "Get Up and Bar the Door", stanzas 1-2 quoted; the rest summarized. Child's headnote: text from Herd's *Scottish Songs* ii. 63, "first printed by Herd in a slightly different form, ed. 1776"; it quotes Stenhouse that the ballad gave Prince Hoare a principal scene of *No Song, no Supper*, Drury Lane, 1790. Child died 1896. |
| S8 | Academy of American Poets glossary: haiku, ballad, sonnet, free verse (fetched) | https://poets.org/glossary/haiku ; /ballad ; /sonnet ; /free-verse | Haiku: three lines, 5/7/5, a season's moment; the pattern "routinely broken"; Bashō mastered the form. Ballad: plot-driven song, folk tradition, kept by recitation, often quatrains, lines 2 and 4 or alternate lines rhyme. Sonnet: 14 lines, iambic pentameter, abab cdcd efef gg, Petrarchan volta between lines 8 and 9. Free verse: not dictated by form or meter, speech cadence; Whitman its American progenitor. |
| S9 | Wikipedia, "Haiku" (fetched) | https://en.wikipedia.org/wiki/Haiku | 17 *on* in 5, 7, 5; *on* is not an English syllable; kigo (season word); kireji; Bashō 1644-1694; *furu ike ya kawazu tobikomu mizu no oto*; the Haiku Society of America's estimate that about 12 English syllables approximate 17 *on*. |
| S10 | Haiku Society of America, definitions (fetched); EBSCO Research Starters, "Old Pond" (search excerpt) | https://hsa-haiku.org/hsa-definitions.html ; https://ebsco.com/research-starters/history/old-pond-matsuo-basho | HSA: a haiku conveys an experience of nature or the season. EBSCO: the frog poem dates from 1686 (kept out of child text; "a famous one" only). |
| S11 | University of Toronto, Representative Poetry Online glossary; UCSB English Broadside Ballad Archive, "Ballad Measure in Print" (search excerpts) | https://rpo.library.utoronto.ca/glossary/b ; https://ebba.english.ucsb.edu/page/ballad-measure-in-print | Ballad stanza: quatrain rhyming abcb, alternating four- and three-stress lines; abab a looser variant. |
| S12 | Common Core State Standards, ELA Literacy RL.4, RL.5, RL.6, RL.7 and SL.2 (fetched) | https://www.thecorestandards.org/ELA-Literacy/RL/4/ (and /RL/5/, /RL/6/, /RL/7/, /SL/2/) | RL.4.5 (poems, drama, prose; verse, rhythm, meter; casts, settings, descriptions, dialogue, stage directions); RL.4.7 (text and visual or oral presentation); RL.5.7 (visual and multimedia elements, meaning, tone, beauty); RL.6.7; RL.7.5 (form, e.g. soliloquy, sonnet); RL.7.7 (lighting, sound, color); SL.2.5 (audio recordings and visual displays); SL.2.6 (complete sentences). |
| S13 | DfE, English programmes of study KS1-2 (2013) and KS3 (2013), text in the writer's scratch | https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study | Y2: poems learned by heart "with appropriate intonation to make the meaning clear"; writing poetry. Y3-4: preparing poems and play scripts to perform "through intonation, tone, volume and action"; forms of poetry "[for example, free verse, narrative poetry]". Y5-6: more poetry by heart. KS3: "recognising a range of poetic conventions"; how dramatists' work is communicated through performance and "how alternative staging allows for different interpretations of a play"; improvising, rehearsing and performing using "role, intonation, tone, volume, mood, silence, stillness and action". |
| S14 | CMU Pronouncing Dictionary (cmusphinx/cmudict) | https://github.com/cmusphinx/cmudict | Syllable counts and rhyme (match from the last stressed vowel). |
| S15 | Christina Rossetti, *Sing-Song*, 1893 Macmillan edition, Project Gutenberg #76703 | https://www.gutenberg.org/ebooks/76703 | Considered for "What is pink?" and dropped: the transcription has OCR slips ("barlev", a colon and a full stop for question marks). The new pattern poem uses a question-and-answer shape, not her lines. |

## Claims checked

| Claim (where) | Result | Source |
| --- | --- | --- |
| The four public-domain poems as quoted (texts) | Verbatim in the Gutenberg files, by script. | S1, S2, S4, S7 |
| "Exit, pursued by a bear." is the whole direction, act 3 scene 3 (F2, the bear) | Confirmed in the Gutenberg text; five words. | S6 |
| Ballad summary: a deal, two strangers at midnight eat the puddings, the husband speaks first, his wife tells him to bar the door (texts) | Confirmed against stanzas 4-11. The strangers plan to shave him with hot pudding water and kiss his wife; child text says only "their plans make the husband jump up and shout". | S7 |
| Stanza 1 rhymes lines 2 and 4, than/pan (E6) | Confirmed in spelling; "than" as "then": the Dictionary of the Older Scottish Tongue entry *Than, Then, adv.* gives the time sense "at that time, then" (reviewer's search excerpt, dsl.ac.uk/entry/dost/than; the SND page failed to display). Lines 1 and 3 (time, mak) do not rhyme. | S7 |
| Sonnet 18: 14 lines; ten syllables each; rhymes 5-8 CDCD; line 9 begins "But"; line 3 ten syllables, nine words (E1-E4) | Confirmed by script. Ten syllables needs *temperate* = 3 and *every* = 2, both listed pronunciations. Lines 2/4 rhyme only on an unstressed syllable, so no item keys them. | S4, S14 |
| Shakespeare's sonnets printed together in 1609, 154 of them (scene 3) | Confirmed. | S5 |
| Shakespearean sonnet abab cdcd efef gg; iambic pentameter; volta (cards 12-13) | Confirmed; "often turns at line 9" is held to Sonnet 18's own "But". | S8 |
| Haiku: 5-7-5 *on*, season word, English often fewer (card 6, scene 2 note) | Confirmed; child text says "often" and "many English haiku use fewer". | S8, S9 |
| Bashō 1644 to 1694; the frog poem is 5, 7, 5 *on* (scene 2 note) | Confirmed; *on* counted by script from the romanization. The English gloss is the writer's own literal translation. | S9 |
| Free verse: no set meter or rhyme; line breaks chosen (card 7) | Confirmed. | S8 |
| Ballad: a story told as song or poem, often four-line stanzas, lines 2 and 4 rhyme (card 8); four beats then three (card 13) | Confirmed, with "often". | S8, S11 |
| Whitman's poem: first printed in *Drum-Taps*, 1865 (texts) | Confirmed. | S3 |
| "Bed in Summer" in *A Child's Garden of Verses*, 1885 (scene 4 note) | Confirmed from the book's publication date; the poem is no. I in both transcriptions. | S1 |
| Stenhouse's report of *No Song, No Supper* (1790) (grown-up panel) | Reported as Child quoting Stenhouse; not independently confirmed `[check]`, so grown-up panel only. | S7 |
| Assonance in "shake ... May"; alliteration in "mystical moist" (card 15) | Same stressed vowel (EY) and same first sound (M) in the CMU entries. | S14 |
| Standards wording in the spec and upstream table | Confirmed. | S12, S13 |

## Texts written for this pack

The hat story in prose, play script and ballad; *What Is Quick?*; the three haiku; *The Footbridge at Night*; every scene, card and item. All are new. The ballad, haiku, pattern poem and free verse were checked for the counts and rhymes the items key (`check276.py`). The made-up book *Tales from the Footbridge* and its chapter 3 are Willowbank fiction, labeled so.

## Public-domain status

Stevenson (d. 1894), Whitman (d. 1892), Shakespeare (d. 1616) and the anonymous ballad in Child's 1858 printing (Child d. 1896) are public domain in the US and UK. Gutenberg's licence text is not reproduced; the poems are quoted from the transcriptions with the source named.

## Open `[check]` items

- "Bed in Summer" line 3's comma, against the 1885 first printing.
- Whitman's text against the 1865 *Drum-Taps* printing (the quoted text is the late arrangement).
- First Folio as the first printing of *The Winter's Tale* (standard, not fetched).
- Stenhouse's 1790 stage-show report (grown-up panel only).
- The two Spanish lines, for a fluent reader.

## Independent review (2026-10-25)

Fresh-context reviewer. Re-downloaded Gutenberg #136, #1322, #1041, #1539 and #43825 and the CMU dictionary into a separate folder and re-ran the checks (`review276.py`): all four poems verbatim, the bear direction exact, every count and rhyme the items key confirmed. Whitman's first printing in *Drum-Taps* (1865) confirmed by the Whitman Archive entry (S3, search excerpt). The full "Get Up and Bar the Door" ends with the two strangers planning to shave the husband with a knife and scald him with pudding water; only stanzas 1-2 (the Martinmas puddings and the cold wind) are shown, and the child summary names no knife or scalding.
