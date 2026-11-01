# 353 · A final e: finite teaching material

Proposed companion to [353](../specs/353-prop-box-long-vowels.md), not shipped. All new child prose is original. Existing 350 controls and focus/count wording are reused unless replaced here.

## Entry and shared copy

- Set buttons: **x and qu** · **A final e**.
- Title: **A final e**.
- Opening: **Dot is sorting props for the show. Read these words together. What changes when a final e joins these words?**
- Try prompt: **Your partner says the word. Put down a counter for each sound you hear. You can change your idea.** (reuse350)
- New-use pin: **Read pin together. Try counters for its sounds. Then explore pine and compare the words.**
- New-use pine: **Read pine together. Try counters for its sounds. Show the model whenever you want.**
- Show-note disclosure: **A note for the show**.
- Note: **A cap and a cape. A kit and a kite. A pin by a pine.**
- Note guide: **Read this note together. Your partner can supply any word. The picture with each word helps tell what it means.**
- Visit reminder, picture fallback, Model/Try/Compare/Back, count announcements and bounds use350's existing literal copy. Pair buttons below replace its two pair buttons for this set.
- For grown-ups: keep350's `TRAIL_GROWNUP` exactly. Add this folded set-specific paragraph: **Long a and long i each count as one vowel sound here. The final e has no extra sound or syllable in these words. Other words ending in e can work differently.** No additional per-word guide lines; `guide:{}` renders no empty paragraph.

The shared note's target tokens are cap, cape, kit, kite, pin, pine (one occurrence each). Adult-supplied tokens are A/a (six occurrences), and (two), by (one); punctuation is not a token. This is a supplied shared note, not an independent-reading check. Its label words may be inspected with their pictures; no response to the note is scored or stored.

## Six literal words and maps

Indices are zero-based; each sound list is a reference phoneme sequence for the adult. The a_e/i_e groups are nonadjacent letters, not adjacent vowel teams. Every word has three phonemes in this selected sense.

| id/label | Adult reference | Phonemes | Letter indices → sound indices | Exact meaning | Art / exact alt |
| --- | --- | --- | --- | --- | --- |
| cap | /kæp/ | k, æ, p | [0]→[0];[1]→[1];[2]→[2] | A cap is a hat. This one is a costume prop. | cap342 / A soft costume cap with a short visor rests on a peg. |
| cape | /keɪp/ | k, eɪ, p | [0]→[0];[1,3]→[1];[2]→[2] | A cape is a loose piece of clothing worn from the shoulders. This one is a costume prop. | cape353 / A loose red costume cape hangs from two shoulder ties on a peg. |
| kit | /kɪt/ | k, ɪ, t | [0]→[0];[1]→[1];[2]→[2] | A kit is a set of things for a job. This one holds puppet-repair tools. | kit348 / An open box with a handle holds a spool, a patch and blunt pretend repair tools. |
| kite | /kaɪt/ | k, aɪ, t | [0]→[0];[1,3]→[1];[2]→[2] | A kite is a light frame covered with cloth or paper. It can fly in the wind on a string. | kite353 / A diamond-shaped toy kite has crossed sticks, a tail and a string wound on a handle. |
| pin | /pɪn/ | p, ɪ, n | [0]→[0];[1]→[1];[2]→[2] | A badge pin is a pretend theater prop. | pin / A round badge has a pin fitting shown beside its back. |
| pine | /paɪn/ | p, aɪ, n | [0]→[0];[1,3]→[1];[2]→[2] | A pine is a tree with needles instead of broad leaves. | pine353 / A small pine tree has bundles of long thin needles and two cones. |

The cape is not a geographical cape. Pine is the tree, not longing for something. The spelling patterns do not establish duration measurements or count the two parts of a diphthong as separate phonemes.

## Thirty manual frames

Each line is one frame, numbered0–4. The selected group's indices determine highlighting; at0 highlight none, at4 highlight all groups. Pictures and meanings stay supplied.

### cap
0. Read cap together. Your partner says the whole word.
1. Point to c. Your partner says the first sound.
2. Point to a. Your partner says the vowel sound.
3. Point to p. Your partner says the last sound.
4. Three letters, three sounds in our model of cap.

### cape
0. Read cape together. Your partner says the whole word.
1. Point to c. Your partner says the first sound.
2. Point to a and the final e. Together they help write the vowel sound in cape. Your partner says the vowel sound.
3. Point to p. Your partner says the last sound.
4. Four letters, three sounds. In cape, a and the final e help write one vowel sound.

### kit
0. Read kit together. Your partner says the whole word.
1. Point to k. Your partner says the first sound.
2. Point to i. Your partner says the vowel sound.
3. Point to t. Your partner says the last sound.
4. Three letters, three sounds in our model of kit.

### kite
0. Read kite together. Your partner says the whole word.
1. Point to k. Your partner says the first sound.
2. Point to i and the final e. Together they help write the vowel sound in kite. Your partner says the vowel sound.
3. Point to t. Your partner says the last sound.
4. Four letters, three sounds. In kite, i and the final e help write one vowel sound.

### pin
0. Read pin together. Your partner says the whole word.
1. Point to p. Your partner says the first sound.
2. Point to i. Your partner says the vowel sound.
3. Point to n. Your partner says the last sound.
4. Three letters, three sounds in our model of pin.

### pine
0. Read pine together. Your partner says the whole word.
1. Point to p. Your partner says the first sound.
2. Point to i and the final e. Together they help write the vowel sound in pine. Your partner says the vowel sound.
3. Point to n. Your partner says the last sound.
4. Four letters, three sounds. In pine, i and the final e help write one vowel sound.

## Three comparisons

| Button | Heading | Pair / group indices highlighted | Exact explanation |
| --- | --- | --- | --- |
| Compare cap and cape | cap and cape | cap/cape; `{cap:1,cape:1}` | In our model, cap and cape each have three sounds. The word cape has one more letter. The vowel changes; first and last sounds stay. |
| Compare kit and kite | kit and kite | kit/kite; `{kit:1,kite:1}` | In our model, kit and kite each have three sounds. The word kite has one more letter. The vowel changes; first and last sounds stay. |
| Compare pin and pine | pin and pine | pin/pine; `{pin:1,pine:1}` | In our model, pin and pine each have three sounds. The word pine has one more letter. The vowel changes; first and last sounds stay. |

Both words' vowel groups are highlighted. Accessible connector descriptions use350's literal template, e.g. **Letters a and e go with Sound 2.** Never describe a/e as adjacent or claim e adds a sound. IPA is folded adult reference; spoken target models remain adult-led.
