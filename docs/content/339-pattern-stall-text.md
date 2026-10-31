# 339 · Pattern Stall: finite text and picture directions

Companion to [spec339](../specs/339-pattern-stall.md). Original selected/adapted263 text. Fiction is labelled **A story from Willowbank**; teaching and meaning notes **A true thing about language**. `{guide}` is never gendered. Pip and the baker he/him; Dot she/her. No device narration or pronunciation sample. Adult shared reading; no private learner data.

## Bench copy

- Arrival: **Visit the Pattern Stall**
- Heading: **The Pattern Stall**
- Header: **Each sign has a gap. Pick a family, then fill the gap. The gap can hold more than one letter.**
- Always: **Spelling rules usually work. A dictionary has the last word.**
- Chooser: **Choose a sign**
- Family legend: **A spelling family**
- Letters legend: **Letters for the gap**
- Inserted-letter label: **Letters you painted**
- Next: **Another sign**
- Back: **Back to Market Signs**
- Keep: **Keep this sign**
- Clear: **Clear this sign**
- Shelf: **Kept pattern signs**
- Reopen: **Reopen this sign**
- Jobs: **Pattern sign jobs**
- Story panel: **The worm bread story**
- Meaning shelf: **Words with different meanings**
- Meaning invitation: **Read the whole sentence. Which meaning fits?**
- Family missing: **Choose a family clue. A word can belong to more than one.**
- Letters missing: **Choose the letters you want to paint.**
- Family fits: **{family} is one of this word's families. {familyNote}**
- Family differs: **{family} is a different clue. {familyNote}**
- Letters fit: **{targetLine}. {letterNote}**
- Other letters: **This sign makes {made}. It could tell another story. The market note says {targetLine}. {letterNote}**
- Keep notice: **Your sign is kept. You can make another.**
- Duplicate: **This sign is already in your shelf.**
- Clear notice: **This waiting sign is clear. Your kept signs are still here.**
- No kept signs: **Your first kept sign will wait here.**
- Section unavailable: **These earlier Pattern Stall pages are kept as they were. Other Market Signs benches are open. You can download them in Notes.**
- Bench unavailable: **This earlier set of family or letter cards is kept as it was. Its sign jobs and the other benches are still open. You can download it in Notes.**
- Case unavailable: **This earlier sign cannot be painted here. It stays in Notes. Choose another sign or a job.**
- Kept material unavailable: **These earlier kept signs stay in Notes. You can still paint a sign or try a job.**
- Unreadable kept row: **This earlier kept sign stays in Notes but cannot be opened here.**
- Material unavailable: **This earlier reading card stays in Notes but cannot be shown here.**
- Card controls, pagination, Short/Longer, Help, Check this job, Keep this version, Next job, hint/example/Skip, no-room/refusal/saving notices: existing325/338 copy, unchanged. Do not commission an unused second Skip line.

Dynamic values come only from the retained source/triple and are escaped. Kept labels: **{title} + {family} + {letters}**. Page labels use existing **Page {n} of {total}**. No total becomes a score. A family mismatch does not alter the letters or erase the sign. The other-letters line makes no dictionary-existence claim.

## Five family cards

| id | Label | Example words in order |
| --- | --- | --- |
| ball | The ball family | all, ball, call, small, stall, wall, walk, talk, chalk |
| monday | The Monday family | Monday, money, honey, nothing, other |
| key | The key family | key, valley, donkey, honey, money |
| after-w | The after-w families | watch, want, swan; war, warm, swarm; word, work, world, worm |
| tion | The -tion chunk | station, section, motion, fiction |

Store the after-w examples as ten separate words in that order; punctuation is presentation only. Honey and money are in both groups, matching263 card2 (its shorter bench list omitted money from key). Membership is a useful printed clue, not a claim about one pronunciation or shared origin. Tiles in order: `a:A`, `o:O`, `ar:AR`, `or:OR`, `ey:EY`, `tion:TION`.

## Eleven sign cases

`prefix` and `suffix` are literal; the inserted tile text is uppercase. Display an unselected gap without implying how many letters it needs. No case is selected on arrival.

| id / title | prefix | suffix | targetLettersId | targetLine | familyIds | pictureId / pictureAlt | Clue |
| --- | --- | --- | --- | --- | --- | --- | --- |
| small / Small apples | SM | LL APPLES | a | SMALL APPLES | ball | apples / A basket of small apples. | The apples are small. |
| monday / Open Monday | OPEN M | NDAY | o | OPEN MONDAY | monday | calendar / A market calendar marked Monday. | The stall opens on Monday. |
| money / Money here | M | NEY HERE | o | MONEY HERE | monday, key | pay-box / A payment box beside a market stall. | Put the money in this box. |
| watch / Watch your step | W | TCH YOUR STEP | a | WATCH YOUR STEP | after-w | steps / Feet beside a loose paving stone. | The path has a loose stone. Watch your step. |
| warm / Warm bread | W | M BREAD | ar | WARM BREAD | after-w | bread / Steam rises from freshly baked bread. | The baker means bread that is warm. |
| work / Work in progress | W | K IN PROGRESS | or | WORK IN PROGRESS | after-w | tools / Tools beside a partly repaired stall. | The stall is being repaired. Work is in progress. |
| key / Key | K | [empty] | ey | KEY | key | key / A key beside the store door. | This key opens the store. |
| donkey / Donkey | DONK | [empty] | ey | DONKEY | key | donkey / A donkey carries two empty baskets. | A donkey carries the baskets. |
| section / Section B | SEC | [space]B | tion | SECTION B | tion | section / An apple stall marked as section B. | Find section B of the market. |
| station / Station | STA | [empty] | tion | STATION | tion | station / A station platform and its sign. | This is the station. |
| honey / Honey | H | NEY | o | HONEY | monday, key | honey / A honey jar beside a bee. | The jar is full of honey. |

`[empty]` means empty string; `[space]B` means one space then B. Illustrations are simplified original pictures, not observations or answer-detecting models. They support understanding the intended word; the visible note makes every case supported.

### Case notes

| case | familyNote | letterNote |
| --- | --- | --- |
| small | Small belongs with ball, talk and walk. | Small has a before l. |
| monday | Monday belongs with money and honey. | Monday has o. |
| money | Money has the o of Monday and ends in -ey, like key. Both families fit. | This gap takes o. The -ey is already on the board. |
| watch | Watch belongs with want in the after-w families. | Watch has a after w. |
| warm | Warm belongs with war in the after-w families. | Warm has ar. Worm has or and names a wriggly animal. |
| work | Work belongs with word in the after-w families. | Work has or after w. |
| key | Key belongs with valley and donkey. | Key ends in -ey. |
| donkey | Donkey belongs with key and valley. | Donkey ends in -ey. |
| section | Section belongs with station, motion and fiction. | Section ends in -tion. |
| station | Station belongs with section, motion and fiction. | Station ends in -tion. |
| honey | Honey has the o of Monday and ends in -ey, like key. Both families fit. | This gap takes o. The -ey is already on the board. |

The warm/OR board literally reads WORM BREAD. The same finite note distinguishes its meaning without condemning other unexpected fills or claiming every unlisted spelling is a nonword.

## Meaning shelf: nine read-only picture sentences

Show one card at a time, with existing Previous/Next controls and a sentence/text alternative. No hidden quiz, response, correctness or support record. The selected card is view-local; changing it leaves every waiting sign and job alone.

| id / word | Sentence | pictureId / pictureAlt |
| --- | --- | --- |
| here / here | Pay here. | place / An arrow points to the payment box. |
| hear / hear | I hear the bell. | listener / A listener turns toward a ringing bell. |
| two / two | Two pies. | pies / Two pies sit side by side. |
| too / too | Me too. | shared / A second person joins someone carrying a pie. |
| to / to | Go to the stall. | path / A path arrow points from a person to a stall. |
| bee / bee | A bee in the hive. | hive / A bee enters a hive. |
| be / be | Be careful. | caution / A person steps around a loose stone. |
| blue / blue | A blue sign. | blue-sign / A sign painted blue. |
| blew / blew | The wind blew. | wind / Wind bends a ribbon on a sign. |

No assertion that a picture alone uniquely defines every meaning. Read together. Grown-up note may call these homophones; no sounds are played or tested.

## Teaching cards

All cards use **A true thing about language**, with examples labelled **A story from Willowbank**. Body text at most30words. Reveal one of three example steps per tap; no evidence record. Copied selections below come from this project's original263 companion, not external source prose.

1. **A before l**: Ball, small, walk and talk all have a before l. If a word is in this family, spell it with a.
   Example: **SM_LL APPLES**. Steps: **Small is in the ball family.** / **The family has a before l.** / **Small apples.**
2. **The Monday family, and -ey**: Monday, money, honey and nothing are spelled with o. Key, valley and donkey end in -ey. Honey and money belong to both.
   Example: **The h____ stall**. Steps: **Honey is in the Monday family: o.** / **It ends like key: -ey.** / **h, o, n, e, y.**
3. **After w**: After w, look out. Watch and want have a. Warm and war have ar. Word and work have or.
   Example: **W__M BREAD**. Steps: **The baker means warm.** / **Warm is in the war family: ar.** / **Warm, not worm.**
4. **A -tion chunk**: Station, section, motion and fiction all end in -tion. Many words do. Learn those four letters as one chunk.
   Example: **APPLES IN SEC____ B**. Steps: **The word is section.** / **It ends with the -tion chunk.** / **Section.**
5. **Two words, two spellings**: Here and hear are different words. Here means this place. Hear means to listen. Read the whole sign, then choose.
   Example: **PAY H___**. Steps: **The sign tells you where to pay.** / **Where means a place.** / **Here.**

## Practice A1–A5

Every job contextLabel: **A story from Willowbank**. No root tag; no prefix/ending glossary injected into a job. Each source stores its exact pictureId/pictureAlt as below, as well as the original325 work/check fields. Display the job's own picture and text alternative; unknown picture code falls back to text. Wrong-choice tags are authored metadata only, never a learner diagnosis.

Common easier example: **Try this one first: SM_LL APPLES. Small is in the ball family, with a before l. Now find your sign's family.** Existing editable/help/Skip notices stay unchanged.

| job / title | Prompt | Choices in stored order (key marked) | Picture | Hint | Explanation | Teach |
| --- | --- | --- | --- | --- | --- | --- |
| A1 / The honey sign | Which spelling goes on the honey sign? | a: hunney; b: honey [key]; c: honny | honey / A honey jar beside a bee. | Think of money. Honey is in its family. | Honey has the o of Monday and the -ey of key. | card2 |
| A2 / Walk this way | Pip's sign: ___ this way. | a: walk [key]; b: wawk; c: wolk | arrow / An arrow shows the walking path. | Walk is spelled like talk. | Walk, talk, chalk: a before l. | card1 |
| A3 / The bread sign | The baker's sign: ___ bread. | a: worm; b: wurm; c: warm [key] | bread / Steam rises from freshly baked bread. | Warm is in the war family. | After w, warm has ar. Worm has or. | card3 |
| A4 / The pay sign | The miller's sign: pay ___. | a: hear; b: here [key]; c: hiar | pay-box / A payment box beside a market stall. | The sign tells you where to pay. | Here means this place. Hear means to listen. | card5 |

A1 steps shown first: **Honey is in the Monday family: o.** / **It ends like key: -ey.** Other three-choice jobs have no guided steps. Choices are never spoken by the device.

Wrong-choice feedback and tags:

- A1a `o-family-missed`: **Honey is in the Monday family. It has an o.** A1c `ey-missed`: **Honey ends in -ey, like key and valley.**
- A2b `spell-as-heard-aw`: **Walk is in the talk family: a, then l.** A2c `spell-as-heard-o`: **Walk is spelled like talk and chalk: a, l, k.**
- A3a `w-family-mixed`: **Worm is a real word, for a wriggly animal. Bread is warm, with ar.** A3b `spell-as-heard-ur`: **After w, warm has ar, like war.**
- A4a `homophone-mixed`: **Hear is a real word, for listening. This sign means this place.** A4c `ere-missed`: **This place is spelled here, like there and where.**

**A5 / Six waiting signs** (kind match): **Fill each gap with a, o, ar or or.** Parts in order: `small:SM_LL APPLES`, `monday:OPEN M_NDAY`, `money:M_NEY HERE`, `watch:W_TCH YOUR STEP`, `warm:W__M BREAD`, `work:W__K IN PROGRESS`. Choices in order: `a:a`, `o:o`, `ar:ar`, `or:or`. Key mapping: small→a, monday→o, money→o, watch→a, warm→ar, work→or. Picture: `signs / Six unfinished signs wait at the market.` No guided steps. Teach cards1,2,3. Hint: **Find each word's family first.** Explanation: **Each gap comes from a family: ball, Monday, watch, war or word.** Nonfitting general feedback: **Read each sign. Find its spelling family, then try the gap again.** The263 u-feedback is not adopted because u is not an offered A5 choice. No per-gap diagnosis. `matchCopy`: instruction **Choose a gapped sign, then the letters that fill it.**; destinationPrompt **Choose letters.**; destinationLabel **Letters**.

## Story and ancillary text

Hook: **The stalls are coming back. Pip offered to paint the signs. He finished every one before breakfast.**

Short: **Pip's signs say HUNNY, WOLK THIS WAY, PAY HEAR and WORM BREAD. Dot checks the dictionary. They become honey, walk, here and warm.**

Longer:

> The baker reads his new sign. "Worm bread?"
>
> "Warm," says Pip. "Warm bread."
>
> "It says worm," says the baker. "Nobody wants worm bread."
>
> Dot walks along the row with the dictionary. HUNNY. WOLK THIS WAY. PAY HEAR.
>
> "Honey has an o, like Monday and money," she says. "Walk is spelled like talk. And here means this place. Hear means listening."
>
> "And warm?"
>
> "Warm has ar. Worm has or. Both are real words. Only one belongs on bread."
>
> Pip fetches the paint. "How did you know all that?"
>
> "I didn't," says Dot. "I looked them up."
>
> The baker props up the fixed sign: WARM BREAD. He keeps the worm one for the compost heap.

Keeper's note (A true thing about language): **English often spells one part of a word in more than one way. Writers learn words in families, like walk, talk and chalk, or Monday, money and honey. When they are unsure, they check a dictionary.**

Dictionary note: **Dot uses a bigger dictionary. The small Stall Dictionary has only selected pages.**

Helpful words:

- **spelling family**: A group of words with a shared spelling clue. A word can belong to more than one.
- **meaning**: What a word or sentence tells us.
- **gap**: A place waiting for one or more letters.
- **dictionary**: A book or tool to check words and spellings. Our small Stall Dictionary has only selected pages.

Paper invitation: **Make a sign for an imaginary stall on paper. Read it with a grown-up. Check any spelling you wonder about in a dictionary.**

For grown-ups: **This is guided written-pattern and sentence-meaning practice with supplied words, not independent spelling or reading assessment. All five family cards are finite examples, not universal rules or a claim about every English accent. Honey and money each belong to two groups. The after-w group includes several different letter patterns. An unexpected fill can be kept without being called a conventional spelling. Here/hear, to/too/two, bee/be and blue/blew can be discussed as homophones, but no sounds are played or tested. These whole words and sentences are suitable for shared adult reading; phonics samples have a separate recording and listening review. Your child's own sign stays on paper, read by a person. No photograph, voice or original writing is captured. First/latest practice versions and retained checks travel through Notes. No story chapter is unlocked.**
