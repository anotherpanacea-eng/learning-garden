# 355 · o and final e: finite material

Companion to [355](../specs/355-prop-box-o-vowels.md), proposed, not shipped. All new prose and scenes are original. Existing350 controls, count/focus wording and `TRAIL_GROWNUP` remain exact. Broad General American references are for adults, never child pronunciation targets or audio claims.

## Shared copy

- Set code/title: **long-o** / **o and final e**.
- Opening: **Dot has more words for the puppet show. Read each word with your partner. What changes when o and final e go together?**
- New-use prompt for rod/rode: **Read this word in its sentence with your partner. Try counters for its sounds, then show the model whenever you want.**
- Note summary: **A note after the show**.
- Note text: **Do not hop by the rod. A note says we rode home. We hope to rest.**
- Note guide: **Read the note together. Your partner can supply any word. Find a pair whose vowel changes. You can revisit the earlier word sets.**
- Additional folded adult paragraph: **These maps use each word said on its own with its selected meaning. The vowel in hope is one speech sound even though it changes during speech. The o and final e share one sound dot in note, hope and rode. Rode tells about a ride that already happened. These selected pairs are not a rule for every final-e word; revisit have and give in Words in sentences. Counters and model steps do not show independent reading.**

The note has16 word tokens: six targets, each once (not, hop, rod, note, rode, hope), and ten adult-supplied tokens (Do, by, the, A, says, we, home, We, to, rest). Punctuation is outside tokens. This partition is documentation only: no runtime token field, score or presumed independent passage reading.

## Six records and original scenes

Indices zero-based. Each final-e map has one nonadjacent vowel group; all six have three reference phonemes. The context is always visible in Model/Try/Compare and next to the task.

| id/printed label | Adult reference / phonemes | Groups: letters→sounds | Exact visible sentence | Exact meaning | Original art id / exact alt |
| --- | --- | --- | --- | --- | --- |
| not | /nɑt/ · n,ɑ,t | [0]→[0];[1]→[1];[2]→[2] | The puppet will not hop. | Not can say that something does not happen. This puppet will not hop. | not355 / A puppet stands still beside a second, crossed-out picture of it hopping. |
| note | /noʊt/ · n,oʊ,t | [0]→[0];[1,3]→[1];[2]→[2] | Dot sends a note. | A note can be a short written message. This note is for the puppets. | note355 / One puppet hands another a small sheet of paper with three wavy lines. |
| hop | /hɑp/ · h,ɑ,p | [0]→[0];[1]→[1];[2]→[2] | The puppet can hop. | To hop is to make a small jump. This puppet jumps on one foot. | hop355 / Two pictures: a puppet stands on one foot, then springs up with that foot above the floor. |
| hope | /hoʊp/ · h,oʊ,p | [0]→[0];[1,3]→[1];[2]→[2] | We hope to see the show. | To hope is to want something to happen and think it might. The puppets hope to see the show. | hope355 / Two puppets wait outside the theater; a thought bubble shows the stage and an audience. |
| rod | /rɑd/ · r,ɑ,d | [0]→[0];[1]→[1];[2]→[2] | A rod is by the stage. | A rod is a long, thin, straight piece of material. This one is a pretend stage prop. | rod355 / A long, straight wooden stage rod rests beside a small puppet stage. |
| rode | /roʊd/ · r,oʊ,d | [0]→[0];[1,3]→[1];[2]→[2] | The puppets rode home. | Rode tells about a ride that already happened. The puppets traveled on their cart. | rode355 / Two pictures: puppets travel on a wheeled cart, then stand with the cart outside their paper house. |

Use the selected meanings only: note is a message, not a musical sound; rod is a prop, not a measurement or punishment; rode is an earlier ride, not the homophone road. The abstract/temporal meanings are supplied by sentence and adult explanation, never inferred from the picture. No art contains printed target words. For not, the second image has a clear diagonal cross; the sentence explains its meaning. Natural local vowels and connected speech can differ from the citation reference without correction. /oʊ/ is one phoneme, not two counters or two syllables.

## Thirty manual frames

Frames0–4. Frame0 none,1 first group,2 vowel group,3 last group,4 whole map. The selected sentence remains visible throughout.

### not
0. Read not in this sentence together. Your partner says the whole word.
1. Point to n. Your partner says the first sound.
2. Point to o. Your partner says the vowel sound in not.
3. Point to t. Your partner says the last sound.
4. Three letters, three sounds in our model of not.

### note
0. Read note in this sentence together. Your partner says the whole word.
1. Point to n. Your partner says the first sound.
2. Point to o and the final e. Your partner says the vowel sound in note.
3. Point to t. Your partner says the last sound.
4. Four letters, three sounds. In note, o and final e help write one vowel sound.

### hop
0. Read hop in this sentence together. Your partner says the whole word.
1. Point to h. Your partner says the first sound.
2. Point to o. Your partner says the vowel sound in hop.
3. Point to p. Your partner says the last sound.
4. Three letters, three sounds in our model of hop.

### hope
0. Read hope in this sentence together. Your partner says the whole word.
1. Point to h. Your partner says the first sound.
2. Point to o and the final e. Your partner says the vowel sound in hope.
3. Point to p. Your partner says the last sound.
4. Four letters, three sounds. In hope, o and final e help write one vowel sound.

### rod
0. Read rod in this sentence together. Your partner says the whole word.
1. Point to r. Your partner says the first sound.
2. Point to o. Your partner says the vowel sound in rod.
3. Point to d. Your partner says the last sound.
4. Three letters, three sounds in our model of rod.

### rode
0. Read rode in this sentence together. Your partner says the whole word.
1. Point to r. Your partner says the first sound.
2. Point to o and the final e. Your partner says the vowel sound in rode.
3. Point to d. Your partner says the last sound.
4. Four letters, three sounds. In rode, o and final e help write one vowel sound.

## Three comparisons

| Button | Heading | Source ids / highlighted groups | Exact explanation |
| --- | --- | --- | --- |
| Compare not and note | not and note | not,note / `{not:1,note:1}` | Listen to not and note with your partner. Their first and last sounds stay the same; the vowel changes. In note, o and final e help write the vowel together. |
| Compare hop and hope | hop and hope | hop,hope / `{hop:1,hope:1}` | Hop is a jump; hope is about something we want to happen. Listen to the different vowels. In hope, o and final e share one sound dot. |
| Compare rod and rode | rod and rode | rod,rode / `{rod:1,rode:1}` | A rod is a thing; rode tells about an earlier ride. Both words have three speech sounds. Listen to the vowel that changes. |

Compare includes each label, its exact sentence and its model. Labels equal ids here;354's display-label fallback remains. Reuse350's literal connector templates, including **Letters o and e go with Sound 2.** First selected word not; first four start Model, rod/rode Try. New guide is empty with no empty paragraph. This is adult-supported reference exploration, not a check of a child's pronunciation or unaided decoding.
