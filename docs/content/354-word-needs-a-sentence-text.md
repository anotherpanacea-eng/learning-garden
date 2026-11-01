# 354 · Words in sentences: finite material

Companion to [354](../specs/354-word-needs-a-sentence.md), proposed not shipped. Existing350 controls/count/focus wording and `TRAIL_GROWNUP` remain exact. All new child prose and scenes are original.

## Shared copy

- Set button/title: **Words in sentences**.
- Opening: **Dot's notes use words with e on the end. Read each word in its sentence. Does the same spelling always sound the same?**
- New-use prompt for both live records: **Read live in this sentence with your partner. Try counters for its sounds, then show the model whenever you want.**
- Try prompt for five: **Your partner says five. Use counters for speech sounds, not for the number of stars. You can change your idea.**
- Other Try, model/reference and counter controls reuse350.
- Show-note summary: **Two notes for the show**.
- First note paragraph: **We have five stars. Please give them to the puppets.**
- Second note paragraph: **They live by the cave. Tonight is a live show.**
- Store the two paragraphs in the existing note text separated by one blank line; no new note format.
- Note guide: **Read both notes together. The sentence helps us choose what live means. Your partner can supply any word.**
- Additional folded adult paragraph: **These maps use strong, separate word forms. Have may sound different in connected speech. Final e is part of these spellings, without an extra sound. The ve grouping shows the written ending; it does not make a vowel short. Context distinguishes our two meanings of live. No response or picture choice proves independent reading.**

The note has20 word tokens: six targets (have, five, give, live-here, cave, live-show), each once, and14 adult-supplied tokens. The adult-supplied tokens are We, stars, Please, them, to, the, puppets, They, by, the, Tonight, is, a, show. All punctuation is outside tokens. The two printed live tokens carry their own contextual identities for authoring only; no response, inference or oral result is stored.

## Six source records

Indices zero-based; each group links printed positions to reference phonemes in order. References are strong/citation General American forms, not recordings or transcriptions of an actual utterance.

| id / printed label / display label | Adult reference / phonemes | Groups: letters→sounds | Exact visible sentence | Exact meaning | Original art id / exact alt |
| --- | --- | --- | --- | --- | --- |
| have / have / have | /hæv/ · h,æ,v | [0]→[0];[1]→[1];[2,3]→[2] | We have a cape. | Have can mean being able to use something. Here the puppets have a cape. | have354 / Two puppets stand beside their costume cape on a rack. |
| cave / cave / cave | /keɪv/ · k,eɪ,v | [0]→[0];[1,3]→[1];[2]→[2] | The puppet waits by a cave. | A cave is a hollow space in rock. This one is a pretend stage cave. | cave354 / A puppet waits beside a stage cave made from a gray rock-shaped backdrop with a dark opening. |
| give / give / give | /gɪv/ · g,ɪ,v | [0]→[0];[1]→[1];[2,3]→[2] | Please give the puppet a cape. | To give is to hand something to someone for them to keep or use. | give354 / Two pictures: one puppet holds a cape, then hands the cape to another puppet. |
| five / five / five | /faɪv/ · f,aɪ,v | [0]→[0];[1,3]→[1];[2]→[2] | There are five stars. | Five is one more than four. | five354 / Five paper stars hang above the puppet stage. |
| live-here / live / live here | /lɪv/ · l,ɪ,v | [0]→[0];[1]→[1];[2,3]→[2] | The puppets live by the river. | To live somewhere is to have your home there. | live-home354 / Two puppets stand at their small paper house beside a blue cloth river. |
| live-show / live / live show | /laɪv/ · l,aɪ,v | [0]→[0];[1,3]→[1];[2]→[2] | We are watching a live show. | A live show happens in front of its audience as they watch. | live-show354 / Puppets perform on a small stage while paper ducks sit in the audience. |

Each diagram has four printed letters and three sound dots. Ve is the displayed spelling group for final /v/ in have/give/live-here; it is not an extra vowel or a claim that this grouping governs all English words. In long-vowel cave/five/live-show the final e belongs to the displayed vowel spelling. Do not count the two parts of /eɪ/ or /aɪ/ as two phonemes. No correction of accent, speech, fluency or weak forms.

## Thirty model frames

The five frames are whole word, first group, vowel group, final group and whole map. Frame0 highlights none; frames1–3 their respective groups; frame4 all. The selected sentence remains visible throughout.

### have
0. Read have in this sentence together. Your partner says the whole word.
1. Point to h. Your partner says the first sound.
2. Point to a. Your partner says the vowel sound in have.
3. Point to v and e. This written ending goes with the last sound here.
4. Four letters, three sounds. Have keeps its ending e without a long vowel.

### cave
0. Read cave in this sentence together. Your partner says the whole word.
1. Point to c. Your partner says the first sound.
2. Point to a and the final e. Your partner says the vowel sound in cave.
3. Point to v. Your partner says the last sound.
4. Four letters, three sounds. In cave, a and final e help write one long vowel sound.

### give
0. Read give in this sentence together. Your partner says the whole word.
1. Point to g. Your partner says the first sound.
2. Point to i. Your partner says the vowel sound in give.
3. Point to v and e. This written ending goes with the last sound here.
4. Four letters, three sounds. Give keeps its ending e without a long vowel.

### five
0. Five names the number of stars. Your partner says the whole word.
1. Point to f. Your partner says the first sound.
2. Point to i and the final e. Your partner says the vowel sound in five.
3. Point to v. Your partner says the last sound.
4. Five stars; four letters; three speech sounds. A picture count and a sound count are different things.

### live-here
0. Read live in this sentence together. Your partner says the whole word.
1. Point to l. Your partner says the first sound.
2. Point to i. Your partner says the vowel sound in live here.
3. Point to v and e. This written ending goes with the last sound here.
4. Four letters, three sounds. In this sentence, live has a short i vowel sound.

### live-show
0. Read live in this sentence together. Your partner says the whole word.
1. Point to l. Your partner says the first sound.
2. Point to i and the final e. Your partner says the vowel sound in live show.
3. Point to v. Your partner says the last sound.
4. Four letters, three sounds. In this sentence, live has the vowel sound heard in kite.

## Three comparisons

| Button | Heading | Source ids / highlighted group indices | Exact explanation |
| --- | --- | --- | --- |
| Compare have and cave | have and cave | have,cave / `{have:1,cave:1}` | These words share the ending ave, but their vowel sounds differ. Have uses a short vowel; cave uses a long vowel. |
| Compare give and five | give and five | give,five / `{give:1,five:1}` | These words share the ending ive, but their vowel sounds differ. An ending e is a clue to check, not a promise. |
| Compare two meanings of live | two meanings of live | live-here,live-show / `{'live-here':1,'live-show':1}` | The letters stay the same. The sentence and meaning help us read live here and live show differently. Both have three speech sounds. |

Compare sections include each display label and its exact visible sentence. Accessible map names use the display label, such as **live here: Our sound model**, so two live models can be distinguished. Connector descriptions retain350's literal template, including **Letters v and e go with Sound 3.** Return to A final e freely for earlier examples; no earlier result is imported or overwritten.
