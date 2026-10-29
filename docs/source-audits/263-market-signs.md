# Source audit: spec 263, Market Signs

Date: 2026-10-26. Writer's first pass for [spec 263](../specs/263-market-signs.md) and its [companion text](../content/263-market-signs-text.md).

**Method and limits.** English Appendix 1 was downloaded from the official gov.uk address and read as extracted text; the key stage 2 programme of study was read from the scratch copy used by earlier English packs. Common Core L.2, L.3 and RF.3 were fetched directly. Merriam-Webster refused direct fetches (HTTP 403), so every keyed word and distractor was checked against the Wiktionary REST API instead, the most permissive dictionary to hand. One web search (the Spanish ending pairs); its general claim was not confirmed and is kept out of all text. Claims not confirmed were cut, not marked.

## Fiction and models (no source needed; labeled in the text)

Willowbank, the market green and its sign bench, Pip's misspelled signs, the baker's board, Bramble's pumpkin and its weight, the Vadoalto cheese trader and both boats' boards, and every item sentence: "A story from Willowbank". The Stall Dictionary (five pages, 34 entries, guide words and every definition) is newly written for this pack and labeled "A made-up model"; no dictionary text was copied. No passage is quoted from any published text; nothing comes from the owner's writing.

## Sources consulted and what each supports

| # | Source (publisher) | URL | Supports |
| --- | --- | --- | --- |
| S1 | English Appendix 1: Spelling (DfE, 2013, OGL), official file | https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/239784/English_Appendix_1_-_Spelling.pdf | **Year 2:** /ɔː/ spelled a before l and ll (all, ball, call, walk, talk, always); /ʌ/ spelled o (other, nothing, Monday); /iː/ spelled -ey, plurals add -s (key, donkey, valley); /ɒ/ a after w and qu (want, watch, wander, squash); /ɜː/ or after w (word, work, worm, world, worth); /ɔː/ ar after w (war, warm, towards); /ʒ/ spelled s (treasure); -ly added straight on, y to i only for roots of more than one syllable; words ending -tion (station, fiction, motion, national, section); homophones (there/their/they're, here/hear, see/sea, to/too/two, be/bee, blue/blew, night/knight and others); "kn ... was sounded hundreds of years ago", wr "probably also reflects an old pronunciation". **Years 3-4:** most prefixes added with no change except in-; dis- and mis- negative (misspell = mis + spell); re- again or back; super- above (supermarket, superstar); anti- against; auto- self or own (autograph); -ation added to verbs, rules still apply (information, adoration, sensation, preparation, admiration); -ly rules and exceptions (happily; gently, simply; basically, dramatically except publicly; truly, duly, wholly); /ɪ/ y (myth, gym), /ʌ/ ou (young, touch, double); /ʒə/ always -sure, /tʃə/ often -ture; /ʒən/ -sion; -ous rules (famous, various; no obvious root: tremendous, enormous, jealous; humour to humorous; courageous keeps e); the statutory Years 3-4 word list. |
| S2 | National curriculum in England: English programmes of study (DfE, 2013, OGL) | https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study | Lower KS2 transcription: use further prefixes and suffixes; spell further homophones; spell often-misspelt words; "use the first two or three letters of a word to check its spelling in a dictionary". Upper KS2: first three or four letters. "Pupils need sufficient knowledge of spelling in order to use dictionaries efficiently." |
| S3 | Common Core State Standards, Language 2 and 3; Reading Foundational Skills 3 | https://www.thecorestandards.org/ELA-Literacy/L/2/ ; https://www.thecorestandards.org/ELA-Literacy/L/3/ ; https://www.thecorestandards.org/ELA-Literacy/RF/3/ | L.2.2d generalize learned spelling patterns; L.2.2e and L.3.2g consult beginning dictionaries to check and correct spellings; L.2.4b meaning of a known prefix on a known word; L.3.2e suffixes on base words; L.3.2f patterns and generalizations; RF.3.3a common prefixes and derivational suffixes (all fetched). L.1.2d-e, L.4.4c, L.5.4c as named in the Marble records, not fetched. |
| S4 | Wiktionary, English entries via the REST API (Wikimedia, CC BY-SA) | https://en.wiktionary.org/api/rest_v1/page/definition/ | Real-word and non-word status for every distractor (word table below); *unsold*, *mislabel*, *misprint*, *antifreeze*, *preheat*, *reopen*, *superstar*, *unnoticed*, *joyous*, *wrap*, *dramatically*, *autograph* ("a person's own handwriting, especially the signature of a famous or admired person"); *franticly* is a rare spelling, so frantic was not used. Spanish *información* "information", *famoso* "famous", *queso* "cheese". |
| S5 | Language-learning pages on Spanish and English endings (Rosetta Stone, italki, StoryLearning; search excerpts only) | https://blog.rosettastone.com/spanish-suffixes ; https://www.italki.com/en/blog/cognates-in-spanish | General pattern that -ción often matches -tion and -oso -ous. **[check]**, commercial sources only; kept out of all text. The scene and panel show only two dictionary-checked pairs and say no rule is taught. |
| S6 | Specs 34, 55, 94, 117, 120, 125 (this repo); drafts 254, 259, 266 (English build-out, worktrees packs-3 and packs-4) | `docs/specs/` | Spec 34's ten bases and parts; brief 55's sound and audio gate; spec 117's barge crew; spec 120's cast, acts and writing rules; spec 125's sign studio; 254 owns the root changes and names -ly as this pack's; 259's floating-market board; 266's verb prefixes and its words. |

## Word table (every keyed spelling and distractor)

Keyed answers follow the rule shown with them; `check263.py` reproduces the prefix and suffix joins. Distractor status is from Wiktionary (S4), checked 2026-10-26.

| Item | Key | Distractors and status |
| --- | --- | --- |
| A1 | honey | hunney, honny: no entry. (*hunny*, an eye-dialect entry, was cut.) |
| A2 | walk | wawk: no entry; wolk: no English common noun (a surname only). |
| A3 | warm | **worm: real word**, feedback says so; wurm: no English entry. |
| A4 | here | **hear: real word**, feedback says so; hiar: no English entry. (*heer*, a yarn measure, and *heere*, an obsolete spelling, were cut.) |
| B1, B2, B6 | re-, pre-, auto- | prefix tiles, no word claims. (*antigraph* and *supergraph* are real technical words, so B6 uses tiles.) |
| B3 | misspells | **mispell: recorded only as a misspelling of misspell** (reviewer, 2026-10-26), so feedback says "common slip"; missspells: no entry. |
| B4 | unnamed | unamed: no entry; **misnamed: real word**, feedback gives its meaning. |
| C1-C5, C7 | freshly, happily, gently, Famous, invitation, dramatically | freshley, freshlee, happyly, happly, gentlely, gentley, fameous, famus, inviteation, invitasion, dramaticly, drammatically: no entry. |
| D1, D2 | weight, enough | wieght, enogh, enouhg: no entry; wayt: no English entry. |
| D3, D4, E3 | different, separate, friend | diffrent, seperate, freind: recorded only as misspellings (seperate also an obsolete form); feedback says "common slip" or compares letters, never "not a word". differrent, seprate, frend: no English entry. |
| E4 | wr | kn, qu: starts, not words. |

**Prefix joins (no letter change):** reopen, reuse, preheat, prepay, preview, unsold, unwrapped, unnamed, unnoticed, dislike, disobey, misprint, mislabel, misspell, antifreeze, autograph, autopilot, superstar, supermarket; dissatisfied in a Keeper's note. None uses a spec 34 base; *autograph* is shared with pack 266, which uses it for the Greek root graph (here only the prefix auto-). *Rewrite*, a 266 word, was replaced by *reuse* in review. **Suffix joins:** 22 bench roots plus dramatic and basic, listed in the companion; odd ones truly, publicly, courageous. **Years 3-4 list words used (23, all on S1's list):** eight, eighth, weight, height, enough, though, although, thought, through, early, earth, heard, learn, address, appear, different, difficult, possible, opposite, separate, business, island, believe.

## Open checks

None in child text. **[check]** S5's general -ción/-tion and -oso/-ous pattern (not used). For a reviewer with ordinary web access: confirm the A2-A4 and D-set distractors against Merriam-Webster (still refused, HTTP 403, in review). *Mislabeled* (one l): Wiktionary's *mislabel* takes the optional doubled l (`{{en-verb|+l}}`), and the single l is the US form, as with *labeled*; checked in review. The memory helpers (a rat in separate, bus in business) are common classroom mnemonics; the Marble topic's own evidence line names the separate one. They are teaching aids, not claims.

## Rights notes for images

No images are embedded. For build: draw original art for every sign, stall, loaf, honey jar, pumpkin, boat and the dictionary pages. No photographs, fonts or scanned dictionary pages needed.

## Marble and Jane

Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (exported 2026-10-24) has no record for any of the five targets (`research` is null for all English topics; 0 of 331 at upstream head). Topic descriptions, evidence and standards were read from the bundled pin `96a7933` (CC BY-SA) and paraphrased only. Jane at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` informed the lesson shape; no Jane text or code is used.
