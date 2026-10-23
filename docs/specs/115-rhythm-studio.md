# 115. Rhythm Studio: fill the bar

Status: **proposed; awaiting independent spec review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Builds on [Bell Studio, spec 48](48-bell-studio.md), which is merged. Text and design only here; code, audio scheduling and art are for the implementation pass.

## Purpose

Bell Studio orders pitches in equal slots. Nothing in the garden yet lets a sound be long or short. Rhythm Studio adds **duration**: a bar is one whole, and notes and rests fill it in halves, quarters and eighths. The child hears that a half note lasts as long as two quarter notes, and sees it on a strip where the half note takes up half the bar.

This is music first and a fraction model second. A bar that is full is a fact about the arrangement; whether the rhythm is good is a conversation, never a score.

## Where it lives

`#studio/rhythm`, a second room in the existing studio. Bell Studio gains one invitation line at its end screen: **"The mending crews want a rhythm to work to. Visit the Rhythm Studio."** Rhythm Studio links back: **"Want to choose high and low notes? Visit Bell Studio."** No shared state between the rooms.

## The model, `rhythm-studio-v1`

- One beat lasts **0.5 seconds**, the same slot length Bell Studio uses. The smallest unit is an **eighth note**, a quarter of a second.
- A bar holds **four beats** (eight eighths) unless a card says three beats.
- A card has at most **two bars**, so one play lasts at most four seconds.
- Notes and rests have these codes and lengths, in eighths:

| Code | Name shown | Length in eighths | Beats | Part of a four-beat bar | Band |
| --- | --- | --- | --- | --- | --- |
| `w` | whole note | 8 | 4 | the whole bar | all |
| `h` | half note | 4 | 2 | 1/2 | all |
| `q` | quarter note | 2 | 1 | 1/4 | all |
| `e` | eighth note | 1 | 1/2 | 1/8 | all |
| `dh` | dotted half note | 6 | 3 | 3/4 | Sapling cards |
| `dq` | dotted quarter note | 3 | 1 1/2 | 3/8 | Sapling cards |
| `rw` `rh` `rq` `re` | whole, half, quarter, eighth rest | 8, 4, 2, 1 | as above | as above | all |

- **Sound.** Every note is the same Bell Studio Middle tone (330 Hz sine) with Bell Studio's fixed low gain and onset ramp. A note sounds for its full length less a 0.06-second gap, so two quarter notes are heard as two sounds and a half note is heard as one longer sound. Rests are silence. No metronome click by default; an optional **Hear the beat** toggle adds a quiet, lower 220 Hz tick on each beat, at half the note gain.
- **No timed input.** The child never taps along with playback. Clapping along is an off-screen invitation only.

## What the child sees

The bar is a horizontal strip divided into eight equal cells with beat numbers **1 2 3 4** above every second cell. A note is a block whose width matches its length. Each block is labeled with its name and, when **Show fractions** is on, its part of the bar ("half note · 1/2 of the bar"). **Show music notes** draws the standard note symbol under each block. Rests are hatched blocks with a pause symbol and the word "rest". Color is never the only cue.

**First visit: "Listen first."** Before the first card, a short worked example plays one step per tap, with the bar filling on screen: **"Here's one whole note. It lasts the whole bar."** (tap) **"Here are two half notes. Together they last just as long."** (tap) **"Four quarter notes. Still the same bar."** (tap) **"Now you try. Fill a bar any way you like."** The example can be replayed from **Listen first** at any time and is skipped on later visits. This is the teaching encounter the cards build on: the bar stays the same while the notes cut it into more, shorter pieces.

Controls, all buttons that work by touch and keyboard with no dragging:

- A palette of the notes and rests the current card allows.
- Tapping a palette item adds it at the end of the first bar with room.
- Select a block, then **Move left**, **Move right**, **Swap for…** or **Remove**. **Clear this bar** asks once.
- **Play my rhythm** plays the current snapshot. **Stop** is always available. Editing during play stops play first.
- **How full is this bar?** names what is left: "This bar has 1 beat left."

### Refusal text

| Situation | Message |
| --- | --- |
| A note is longer than the space left | "That half note needs 2 beats, and this bar has 1 beat left. Try a shorter note, or put it in the next bar." |
| Both bars are full | "Both bars are full. Remove or swap a note to change the rhythm." |
| A dotted note on a non-Sapling card | The dotted notes don't appear in the palette. No message needed. |

A note never splits itself across the bar line. Tied notes are later work.

### Explanations (Details panels)

- **"What's a bar?"** "Music is often counted in groups of beats. Each group is a bar. In this studio most bars have four beats: ONE two three four. Fill a bar, and the next one begins."
- **"Why is a half note called half?"** "A half note lasts half of a four-beat bar: two beats. Two half notes fill the bar. A quarter note lasts a quarter of the bar, so four of them fill it."
- **"What's a rest?"** "A rest is a planned silence. It still takes up time in the bar. Musicians count through a rest."
- **"What does the dot do?"** (Sapling) "A dot makes a note half as long again. A half note lasts 2 beats; a dotted half note lasts 2 and 1 more, which is 3 beats."
- **"These are computer tones."** Reuse Bell Studio's wording and its device-volume cue.

## Invitation cards

Cards are grouped by the same local card choice used in Riddles: **Steady beats** (`sprout`), **Same length, new rhythm** (`seedling`), **Threes, dots and two parts** (`sapling`), or **Any card** (default). The choice describes cards, never the child. All cards stay open from any choice.

Each card has an optional literal check. The check reports facts about the arrangement and records them; it never calls a rhythm right, wrong, good or bad.

### Steady beats

| ID | Card text | Literal check |
| --- | --- | --- |
| `hammer-four` | "The bridge crew hammers four times in every bar. Make a bar of four even hammer blows, then play it." | Bar 1 is full and holds exactly four notes of the same length. (Four quarter notes is the expected way. Any four equal sounding notes filling the bar meet the check, and only quarter notes can.) |
| `long-and-short` | "Make a bar with one long sound and two short sounds. Where will you put the long one?" | Bar 1 is full and holds one half note and two quarter notes, in any order. |
| `rest-for-breath` | "Singers need to breathe. Make a bar with a rest somewhere in it." | Bar 1 is full and holds at least one rest and at least one note. |
| `own-beat-sprout` | "Make any rhythm for any job in the garden. Then tell someone what it's for." | At least one note. |

Explanation after the `hammer-four` check: **"Four quarter notes fill the bar. Each one is a quarter of the bar, so four quarters make one whole."**

### Same length, new rhythm

| ID | Card text | Literal check |
| --- | --- | --- |
| `same-as-half` | "Bar 1 has one half note and one half rest. In bar 2, make sounds that last exactly as long as that half note, then a half rest. Use only quarter notes. Then try eighth notes." | Bar 1 is fixed. Bar 2 is full; its first four eighths hold at least two sounding notes and no rests, and its last four eighths are rests. Records which note lengths were used. |
| `two-ways-whole` | "Fill bar 1 one way and bar 2 a different way. Both bars must be full." | Both bars full; the two bars' contents differ in order or lengths. |
| `echo` | "Bramble plays a rhythm. Can you build it again?" | The child's bar matches the played rhythm exactly. |
| `work-song` | "Give every word part its own note, so the crew can sing while they work." | One sounding note per syllable of the chosen line, every bar full. |
| `own-beat-seedling` | "Make a two-bar rhythm. Make the second bar answer the first." | At least one note in each bar. |

**`echo` rhythms**, played by Bramble, one bar each. **Hear it again** replays at any time. **Show me the rhythm** reveals the blocks and is recorded as support.

| ID | Rhythm |
| --- | --- |
| `echo-1` | q q h |
| `echo-2` | h q q |
| `echo-3` | q e e q q |
| `echo-4` | e e e e h |
| `echo-5` | q rq q q |
| `echo-6` | h e e q |

Bramble's lines: **"Bet you can't catch this one."** After a match: **"Fine. You caught it. I have a trickier one."** If the child shows the rhythm: **"Looking is allowed. I looked at plenty of things when I was learning."**

**`work-song` lines.** The child picks a line; the syllables are shown split under the bar (Lift · the · plank · up · high) and highlighted in order as notes are placed. Rests are allowed between syllables but don't count as syllables.

| ID | Line | Syllables | Bars |
| --- | --- | --- | --- |
| `song-plank` | Lift the plank up high | 5 | 1 or 2 |
| `song-row` | Row, row, row to shore | 5 | 1 or 2 |
| `song-bridge` | Mend the bridge, mend the bridge | 6 | 1 or 2 |
| `song-bread` | Knead the dough and let it rise | 7 | 2 |

Explanation after a work-song check: **"Every word part has its own note, and the bars are full. Say the words while it plays. Do the long notes land on the words you'd stretch out?"** This is a conversation prompt; the check never looks at which syllable got which length.

### Threes, dots and two parts

| ID | Card text | Literal check |
| --- | --- | --- |
| `waltz` | "The café is holding a dance, and this dance counts in threes: ONE two three. Fill two bars of three beats." | Both three-beat bars full. |
| `dotted-long` | "Fill one three-beat bar with a single note." | Bar 1 is one dotted half note. |
| `dotted-swing` | "Try a dotted quarter note followed by an eighth note. Fill a four-beat bar with that pattern twice." | Bar 1 is dq e dq e. |
| `two-bells` | "Two bells ring on a steady count. Choose how often each one rings, then find when they ring together again." | See below. |
| `own-beat-sapling` | "Make a waltz, a march, or a rhythm of your own. Tell someone which, and why it fits." | At least one note. |

**`two-bells`** is a separate small model on the same page. A timeline of 24 eighth cells (three four-beat bars) shows two rows. The child sets **Bell A rings every \_\_ eighths** and **Bell B rings every \_\_ eighths**, each from 2 to 6. Both start together on cell 1. Bell A uses Bell Studio's Low tone, Bell B its High tone, each at half gain so the sum stays at the fixed peak. Before playing, an optional prediction: **"When will they ring together again? Tap the cell."** Playing marks every cell where both ring.

Explanation after play: **"Bell A rang every 2 and Bell B every 3. They met again at 6, because 6 is the first count both 2 and 3 fit into evenly. That's called a common multiple. Musicians call two-against-three a cross-rhythm."** The explanation is generated from the chosen pair. If the first meeting is past cell 24 (for example 5 and 6, which meet at 30), the timeline says **"They don't meet again on this timeline. Can you work out where they would?"**

A prediction is stored with the chosen pair and the actual first meeting cell. Matching is reported as a fact ("Your prediction matched") with no praise or penalty.

## Off-screen invitations

Shown on each band's last card as plain text; nothing is recorded.

- "Ask a grown-up to tap a steady beat on the table. Clap your bar along with it."
- "Find something at home that makes a long sound and something that makes a short sound."
- "Sing a song you know. Clap once for every word part. Are some claps longer than others?"
- (Sapling) "March around the room counting in fours, then waltz counting in threes. Which is harder to keep going?"

## Saved work

Optional root `rhythm` per explorer, absent until the first explicit card choice or edit. Shape, following Bell Studio:

```
rhythm: {
  size: 'any' | 'sprout' | 'seedling' | 'sapling',
  cards: { [cardId]: { bars: [[code,...],[code,...]], before: [...] | null, kept: [...] | null, line?: songId, echo?: echoId } },
  checks: [ { card, at, facts: {...} } ],      // latest 50
  bells: { a, b, prediction: cell | null, met: cell | null, at } | null
}
```

- Validate ids and codes only. An unknown card id or an unreadable card is skipped, and the rest of the studio stays open. An unknown note code in a bar drops that bar's working copy back to empty for that card only and keeps `kept`.
- Bars are checked for self-consistency (no bar over its length). Never check a saved bar against today's card rules.
- Check facts are frozen when recorded and never recomputed on load.
- `echo` stores the echo id and whether **Show me the rhythm** was used before the match.
- Notes export, import, reset and explorer switching include `rhythm`.

## Grown-up notes

One line in the explorer's notes: **"Rhythm Studio: [n] cards with a kept rhythm. Echo rhythms built by ear: [n]; with the rhythm shown: [n]."** A Details panel: **"Rhythm Studio checks whether a bar is full and whether it matches a card's request. It doesn't judge whether a rhythm is musical, and it can't hear clapping. Ask your explorer to play you their work song and sing it together."**

## Curriculum fit

**Acts.** Rhythm Studio belongs to Act I's mending (the work songs and hammer blows) and Act II's gatherings and the town's first original show, where a kept rhythm can be played for an audience. In Act III the floating market can bring a visiting rhythm to echo; in Act V a "traveling theatre" project path can use it for a score. Every card stays open from the start.

**Strands** ([six-act strands](../six-act-strands.md)): the **Music / sound creation** extension pathway, steps 2 and 3 ("repeat/contrast and pulse → duration/rhythm and phrase"), with the cross-rhythm card reaching toward step 4 (texture). Secondary: **M3-I/M3-II** (unit fractions of one whole and equivalence) as a supplied representation, and **E5** speaking and listening through the work songs' syllables.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Hear and build note lengths that fill a bar; recognise that different note groups can last the same time. |
| Teaching encounter | **Listen first**: one whole, two halves, four quarters in the same bar. |
| Contrast | Same bar, more pieces (`same-as-half`, `two-ways-whole`); long versus short (`long-and-short`); sound versus planned silence (`rest-for-breath`); four-beat versus three-beat bars (`waltz`). |
| Supported practice | The refusal messages name the space left; **How full is this bar?**; **Show me the rhythm** in `echo`. |
| New application | Words to notes in `work-song`; listening-to-building in `echo`; two parts at once in `two-bells`. |
| Purposeful revisit | Bell Studio for pitch; the Fraction Trail and Ribbon Recut for halves and quarters of a fixed whole; a kept rhythm in the Act II show. |
| Data boundary | Stored: note codes, card ids, check facts, the bells pair and prediction. No recording, microphone or free text. |

## Upstream check

Refreshed 2026-10-23: Marble at `f186a79a9525c189e2d423e31613c62b6805416f` and Jane at `1927912b8d9cd4f7df6e7fbe8416521194743060`. Marble has no music subject. Its newer graph adds **Rhythm in rhymes and songs** (`mt_OTFABm2xdf`), which is not in the pinned graph; its evidence is clapping a steady beat and repeating a chant, which a screen can't observe, so it stays an upstream-only reference and the off-screen invitations carry it. The research record for **Unit fractions** (`mt_k2WE0-22-4`) warns about reading the denominator as the answer and naming parts against parts instead of the whole; the bar strip always shows the whole bar, and the fraction labels say "of the bar". Jane's `learn` card (one idea and a worked example revealed one tap at a time) is the model for **Listen first**, and its `fracbar` format is a design reference for the bar strip. Jane's points, medals and bosses are not adopted, and no upstream code or prose is copied. No atlas reference is proposed in this spec. The pinned graph's Unit fractions (`mt_k2WE0-22-4`) is about fractions of a *set* of objects, with Fractions of amounts as its hard prerequisite (covered by the Sharing Counter); a bar of time is a continuous whole, so it is a poor fit and no crosswalk is needed until a reviewed fraction-of-a-length topic is chosen.

## Checks for implementation

- Every refusal leaves the bar unchanged.
- Each palette item fills exactly its length; two quarters and one half produce identical bar lengths.
- `echo` matches only an exact sequence; rests count.
- `work-song` counts sounding notes against the line's syllable count.
- `two-bells` reports the least common multiple for every pair from 2 to 6, and the off-timeline message for pairs whose first meeting is past 24.
- Play schedules each note's start from the cumulative eighths, with no drift across two bars.
- Stop and edit-during-play behave as in Bell Studio.
- Saves: an unknown code, an unknown card, a missing `bells`, and an older Bell-Studio-only save all load.
- Browser at 320 and 820 px: eight cells stay at least 44 px tall and readable; two bars wrap as two rows.

## Review asks

- Music content: are the rhythms, the work-song lines and the dotted-note explanations right and singable?
- Is three-against-two too much for this room, or should `two-bells` become its own later card set?
