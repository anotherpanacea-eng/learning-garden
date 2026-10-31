# 340 · Word-List Crate: finite text

Companion to [spec340](../specs/340-word-list-crate.md). Original263(d) selected/adapted text and new bounded directions. Adult shared reading; no recording or pronunciation claim. Fiction: **A story from Willowbank**. Teaching: **A true thing about language**. No learner-specific information. All dynamic values are escaped, retained-source text.

## Bench and recovery copy

- Arrival: **Visit the Word-List Crate**
- Heading: **The Word-List Crate**
- Header: **Sort these printed words by letters you can see. Mark any letters you want to remember. A word can fit more than one crate.**
- Always: **These crates share letters. They do not always share sounds.**
- Picker: **Choose a word**; paging: **Previous word**, **Next word**.
- Marking legend: **Letters I want to remember**; letter button accessible name: **Letter {letter}, position {n}**, pressed when marked.
- Marked readout: **Marked letters: {letter and one-based position list}.** Empty: **No letters marked yet.**
- Clear: **Clear this word's marks**; placement legend: **Choose a crate**; clear placement: **Not in a crate yet**.
- Check: **Check this arrangement**; Keep: **Keep this arrangement**; retained editions: **First kept arrangement**, **Latest kept arrangement**.
- Restore: **Use these placements**; restore note: **This changes the crates only. Your marks and help stay as they are.**
- Keep notice: **Your arrangement is kept. You can try another.**
- Results heading: **Clues for this arrangement**; full arrangement: **All the word cards**.
- Card panel: **Two ways to remember**; helpers: **Letter helpers**; helper disclaimer: **These are tricks for remembering letters, not explanations of where words came from.**
- Jobs: **Word-list sign jobs**; story: **Bramble's pumpkin notice**; back: **Back to Market Signs**.
- Library invitation: **Try another word collection** / **Visit the library word shelf**.
- Section unavailable: **These earlier crate pages stay in Notes. Other Market Signs benches are open.**
- Bench unavailable: **These earlier word cards stay in Notes. You can still choose a readable sign job or another bench.**
- Pointer invitation: **Choose a word to return to. Your earlier arrangement is still here.**
- Opaque placement: **This earlier crate choice stays in Notes. Other cards are ready to move.**
- Marks unavailable: **These earlier marks stay in Notes. You can still read and sort this word.**
- Long word: **This word is ready to read and sort. Its letters cannot be marked here.**
- Checks unavailable: **These earlier checks stay in Notes. You can still arrange cards and keep unchecked placements.**
- Keep unavailable: **This earlier kept arrangement stays in Notes. You can still arrange and check your cards.**
- Kept marks unavailable: **These earlier marks stay in Notes. The readable placements are shown here.**
- Material unavailable: **This earlier reading card stays in Notes but cannot be shown here.**
- No playable cards: **These crate choices stay in Notes. Try another bench or a readable sign job.**
- Teaching step controls, D job Check/Keep/help/Skip/Next, capacity refusal/saving notices: existing325/339 copy, unchanged.

Source.copy exact values (result codes are not child labels):

| Key | Text |
| --- | --- |
| incomplete | Some words are not in a crate yet. Keep this arrangement or try another clue. |
| discussion | Some choices have another story. Talk about your clues, or try another arrangement. |
| listedSummary | Each placed word follows a printed clue in this collection. You can still find another arrangement. |
| partialIncomplete | In the readable part, some words are not in a crate yet. Earlier material stays in Notes. |
| partialDiscussion | In the readable part, some choices have another story. Earlier material stays in Notes. |
| partialListed | The readable placements follow printed clues. Earlier material stays in Notes. |
| partial | This shows the readable part of your earlier collection. Nothing has been removed from Notes. |
| listed | A listed letter clue. |
| discuss | This crate has a different clue. What connection did you notice? |
| unplaced | This word is not in a crate yet. |

## Four crates and nineteen sorting cards

Crate ids/labels/descriptions: **eigh / eigh / Find e, i, g, h together.**; **ough / ough / Find o, u, g, h together.**; **ear / ear / Find e, a, r together.**; **double / Double letters / Find the same letter twice side by side.**

Word id equals the printed word. Each clue note listed here is attached only to its stated own tray. All other placements invite discussion. Appear is one card with two accepted clues, not two cards. Address has two doubled groups but only one double-tray clue.

| Word | Sentence | Accepted crate(s) and note(s) |
| --- | --- | --- |
| eight | Eight jars wait on the stall. | eigh: Eight has eigh. |
| eighth | This is the eighth jar. | eigh: Eighth has eigh before t and h. |
| weight | Guess the pumpkin's weight. | eigh: Weight has eigh between w and t. |
| height | Measure the stall's height. | eigh: Height has eigh between h and t. |
| enough | There is enough bread for everyone. | ough: Enough ends in ough. |
| though | The stall is open, though it is raining. | ough: Though ends in ough. |
| although | Although it rained, the market opened. | ough: Although ends in ough. |
| thought | I thought the stall was closed. | ough: Thought has ough before t. |
| through | Walk through the market gate. | ough: Through ends in ough. |
| early | The baker arrives early. | ear: Early begins with ear. |
| earth | Brush the earth from the carrots. | ear: Earth begins with ear. |
| heard | We heard the market bell. | ear: Heard has ear between h and d. |
| learn | We can learn a new word. | ear: Learn has ear between l and n. |
| address | Write the stall's address. | double: Address has dd and ss. |
| appear | New stalls appear each week. | ear: Appear ends in ear. / double: Appear has pp. |
| different | This cheese is different. | double: Different has ff. |
| difficult | The puzzle is difficult. | double: Difficult has ff. |
| possible | A new route is possible. | double: Possible has ss. |
| opposite | The baker is opposite the miller. | double: Opposite has pp. |

Twenty accepted pairs,76 possible single placements. Shared written letters need not sound alike. No picture/audio is used as a phoneme key.

## Two teaching cards

Each body at most30 words. Steps revealed manually, one at a time; opening a bench card records only the card id as support, not success. Embedded job teaching remains existing presentation-only supported material. D1 shows the first two card15 steps as guided work independently of support-panel opening.

**card15 / Look for shared letters**

Body: **Try grouping a word list by letters you can see. Eight, weight and height share eigh. Enough, though and through share ough. Early, earth and learn share ear.**

Example: **SOLD BY W_____**. Steps: **Weight shares letters with eight.** / **Those letters are eigh.** / **w, eigh, t: weight.**

**card16 / Find a letter helper**

Body: **Choose letters you want to remember. A letter helper might help: separate has rat in the middle, and business starts with bus.**

Example: **A different cheese**. Steps: **Notice the double f in different.** / **Try these letter chunks: dif, fer, ent.** / **Different. Two f's, one r.**

## Four letter helpers

Read-only memory tricks, not marked-answer keys. Marked pieces show the authored helper; the child's markers remain separate and ungraded. A visible disclaimer accompanies every helper. Each piece stores marked true/false, and concatenation gives the exact word.

| id / word | Pieces (marked pieces in bold) | Note |
| --- | --- | --- |
| helper-separate / separate | sep · a · **rat** · e | Find rat inside separate: sep, a, rat, e. This is a letter helper. |
| helper-business / business | **bus** · iness | Business starts with bus. Use those three letters as a memory trick. |
| helper-island / island | is · **land** | Try the letter chunks is and land to remember island. This is a letter trick, not its history. |
| helper-believe / believe | be · **lie** · ve | Believe has lie inside it. This is a letter trick, not what believe means. |

Zero-based authored marked indices: separate4,5,6; business0,1,2; island2,3,4,5; believe2,3,4. These help check the helper rendering, never assess the child's choices.

## D1–D4 market notices

Every job: kind choice, contextLabel **A story from Willowbank**, no root tag. Each has stored hint/example/teach/pictureId/pictureAlt, explanation and per-choice feedback. Correct choices use the explanation. Distractor tags are internal descriptions, not diagnoses. All supplied choices stay in their stored order. Each job's easier example: **Try this one first: eight and weight share eigh. Read the letters slowly with someone. Now look for a clue in your notice.**

| Id / Title | Prompt | Choices in order (key marked) | Picture / text alternative | Hint | Explanation | Teach |
| --- | --- | --- | --- | --- | --- | --- |
| D1 / Bramble's pumpkin | Bramble's sign: guess its ___. | a: wieght; b: wayt; c: weight [key] | pumpkin / A pumpkin sits on a scale beside Bramble's notice. | Look at eight. Weight is w, then eight. | Eight, weight and height share eigh. | card15 |
| D2 / Bread for everyone | Is there ___ bread for everyone? | a: enogh; b: enouhg; c: enough [key] | bread / Several loaves wait on the bread stall. | Enough shares ough with though and through. | Enough ends in ough, like though and through. | card15 |
| D3 / A new cheese | Every week the cheese trader brings a ___ cheese. | a: different [key]; b: diffrent; c: differrent | cheese / A round cheese and a square cheese wait on the cheese stall. | Try three letter chunks: dif, fer, ent. | Dif, fer, ent: different, with two f's and one r. | card16 |
| D4 / Eggs and apples | Keep the eggs and the apples ___. | a: seperate; b: separate [key]; c: seprate | eggs-apples / Eggs sit in one basket and apples in another. | Find rat inside the word. | Separate has rat inside it: sep, a, rat, e. | card16 |

Optional easier examples, stored separately in each job:

- D1: **Try this one first: eight and weight share eigh. Read the letters slowly with someone. Now look for a clue in your notice.**
- D2: **Try this one first: though ends in ough: t, h, ough. Now look for those letters in your notice.**
- D3: **Try this one first: difficult has a double f: d, i, ff, i, c, u, l, t. Now look for double letters in your notice.**
- D4: **Try this one first: business starts with bus. A small word can help you remember letters. Now try the rat clue in your notice.**

D1 guided steps shown before choices: **Weight shares letters with eight.** / **Those letters are eigh.** Others have no guided steps.

- D1a `letters-swapped`: **The e comes first: eigh, like eight.** D1b `different-letters`: **Weight shares eigh with eight.**
- D2a `letter-dropped`: **Keep the u. The letters are o, u, g, h.** D2b `letters-swapped`: **The letters go o, u, g, h.**
- D3b `letter-dropped`: **Find all three letter chunks: dif, fer, ent.** D3c `extra-letter`: **Only the f doubles. One r.**
- D4a `a-e-mixed`: **Find rat inside separate: sep, a, rat, e.** D4c `letter-dropped`: **Keep the a before rat: sep, a, rat, e.**

Key positions C/C/A/B. The key is never the only longest choice: D1 ties wieght; D2 ties enouhg; D3 is shorter than differrent; D4 ties seperate. These are finite spelling comparisons, not a proof that distractor strings never occur as names/words elsewhere. Original simple SVG pictures carry visible captions/alternatives; unknown picture ids show the retained alternative. No external image asset.

## Story, paper return and adult note

**hook:** Bramble brings a pumpkin to the returning market. The guessing notice needs one word.

**short:** Bramble set a pumpkin on the scale. “Guess its weight!” she called. The notice had room for the word weight. Pip spotted eigh, just as in eight. Bramble painted the letters and opened her stall.

**longer:** The weekly market was filling again. Bread was warm, cheese was ready, and Bramble had brought a pumpkin almost as wide as her basket. “Visitors can guess its weight,” she said. Pip looked at the waiting notice. “Weight shares eigh with eight.” Dot found the same letters in height, although the words did not sound the same. Bramble finished the notice. Then she set the eggs and apples in separate baskets. The stalls were ready for their first visitors.

**note:** A story from Willowbank. These are visible letter connections; a shared group of letters is not always a shared sound.

**offscreen:** Make a paper notice for an imaginary market. Choose a word you want to remember. Mark its letters, try a letter helper, and read the notice with someone. A dictionary can help check its spelling.

**grownup:** This collection offers printed spelling patterns and optional letter-memory tricks. All cards and choices are supplied, and adult reading is welcome. Sorting or choosing a supplied spelling is not spelling it from memory. There is no timing, dictation, original-writing assessment or claim of complete word-list attainment. Marks are the reader's choices, not right-or-wrong answers. The library shelf offers a later printed collection, not a passed-level reward.
