# 115. Rhythm Studio: fill the bar


The bounded first runtime commission is [spec280](280-rhythm-first-bar.md). Its selected four-beat model, source-owned retention and finite content take precedence for that slice. This broader proposal does not commission the remaining cards or provisional song.

Status: **proposed; awaiting independent spec review and a music-content check.** Part of the [new kinds of play proposal](../new-game-kinds.md). Builds on [Bell Studio, spec 48](48-bell-studio.md), which is merged. Every child-facing line is in [the companion text](../content/115-rhythm-studio-text.md); this spec holds the model and rules. Code, audio scheduling and art are for the implementation pass.

## Purpose

Bell Studio orders pitches in equal slots. Nothing in the garden yet lets a sound be long or short. Rhythm Studio adds **duration**: a bar is one whole, and notes and rests fill it in halves, quarters and eighths. The child hears that a half note lasts as long as two quarter notes, and sees it on a strip where the half note takes up half the bar.

Music first, a fraction model second. A full bar is a fact about the arrangement; whether a rhythm is good is a conversation, never a score.

## Place and story

`#studio/rhythm`, a second room in the existing studio, with a link each way between it and Bell Studio. No shared state between the rooms.

In the [Keeper of the Ways story (spec 120)](https://github.com/anotherpanacea-eng/learning-garden/pull/127), the room opens in Act I as the place the mending crews come for work songs, and its kept rhythms can be played at Act II's first show and at the summer festival, *Market Fair and the Show*. In Act III a Vadoalto boat brings a rhythm to echo. All cards are open from the start.

## The model, `rhythm-studio-v1`

- One beat lasts **0.5 seconds**, Bell Studio's slot length. The smallest unit is an **eighth note**, a quarter of a second.
- A bar holds **four beats** (eight eighths) unless a card says three.
- A card has one or two bars, so one play lasts at most **four seconds**.
- Notes and rests:

| Code | Name | Eighths | Beats | Share of a four-beat bar | Offered on |
| --- | --- | --- | --- | --- | --- |
| `w` | whole note | 8 | 4 | the whole bar | all cards |
| `h` | half note | 4 | 2 | 1/2 | all cards |
| `q` | quarter note | 2 | 1 | 1/4 | all cards |
| `e` | eighth note | 1 | 1/2 | 1/8 | all cards |
| `dh` | dotted half note | 6 | 3 | 3/4 | `waltz`, `dotted-long`, `own-beat-sapling` |
| `dq` | dotted quarter note | 3 | 1 1/2 | 3/8 | `dotted-swing`, `own-beat-sapling` |
| `rw` `rh` `rq` `re` | rests | 8, 4, 2, 1 | as above | as above | all cards |

A card's palette shows only the codes that card offers. In a three-beat bar, the whole note and whole rest are hidden because they can never fit.

- **Sound.** Every note is Bell Studio's Middle tone (330 Hz sine), with its 0.015-second attack and 0.035-second release, sounding for the note's length less a 0.06-second gap, so two quarters are heard as two sounds and a half note as one longer sound. Rests are silent. Let `G = 0.025`, Bell Studio's peak gain. A note uses `2G/3`; the optional **Hear the beat** 220 Hz tick uses `G/3`, half the note gain, for 0.04 seconds with 0.005-second attack and release. The combined instantaneous gain budget is at most `G`, including the beat tick. A new playback stops the old one before scheduling; no release tail extends into the next note onset.
- **No timed input.** The child never taps along with playback. Clapping along is an off-screen invitation.

## The bar

A horizontal strip of equal cells, one per eighth, with beat numbers above every second cell. A note is a block as wide as its length, labeled with its name; **Show fractions** adds its share of the bar, and **Show music notes** draws the standard symbol under it. Rests are hatched with a pause symbol and the word "rest". Color is never the only cue.

All controls are buttons that work by touch and keyboard, with no dragging:

- Tapping a palette item adds it at the end of the first bar with room.
- Select a block, then **Move left**, **Move right**, **Swap for…** or **Remove**. **Clear this bar** asks once.
- **Play my rhythm** plays a snapshot. **Stop** is always available. Editing during play stops play first. Play with no notes says so and plays nothing.
- **How full is this bar?** names the space left.

A note that doesn't fit the space left is refused with a message naming both lengths; the bar is unchanged. A note never splits across the bar line. Ties are later work.

**Listen first.** On the first visit, a four-step worked example (one whole, two halves, four quarters, then "now you try") plays a tap at a time while the bar fills. It is the teaching encounter the cards build on. It can be replayed from a button and is skipped on later visits.

## Cards

Cards are grouped by a local card choice like Riddles: **Steady beats** (`sprout`), **Same length, new rhythm** (`seedling`), **Threes, dots and two parts** (`sapling`), or **Any card** (default). The choice describes cards, never the child. All cards stay open from any choice, and **Another card** moves through the current group, keeping each card's work.

Each card has an optional literal check. The check reports facts about the arrangement and records them. It never calls a rhythm right, wrong, good or bad, and an unmet check says what the card asked for and what the bar has.

| ID | Group | Bars | Literal check |
| --- | --- | --- | --- |
| `hammer-four` | sprout | 1 | Bar full; exactly four notes, all quarter notes, no rests. |
| `long-and-short` | sprout | 1 | Bar full; one half note and two quarter notes in any order, no rests. |
| `rest-for-breath` | sprout | 1 | Bar full; at least one rest and at least one note. |
| `own-beat-sprout` | sprout | 1 | At least one note. |
| `same-as-half` | seedling | 2 | Bar 1 fixed as `h rh`. Bar 2 full; its first four eighths hold at least two notes and no rests; its last four eighths are rests. Records the note codes used. |
| `two-ways-whole` | seedling | 2 | Both bars full; the bars differ. |
| `echo` | seedling | 1 | Exact match with the played rhythm, rests included. |
| `work-song` | seedling | 1–2 | One note per syllable of the chosen line; every bar used is full. |
| `own-beat-seedling` | seedling | 2 | At least one note in each bar. |
| `waltz` | sapling | 2 × 3 beats | Both bars full. |
| `dotted-long` | sapling | 1 × 3 beats | One dotted half note. |
| `dotted-swing` | sapling | 1 | `dq e dq e`. |
| `two-bells` | sapling | timeline | See below. |
| `own-beat-sapling` | sapling | 2, either length | At least one note. The child picks four or three beats per bar. |

**Echo.** Bramble plays one of six authored one-bar rhythms (in the companion text). **Hear it again** replays it. **Show me the rhythm** reveals its blocks and is recorded as support. Hear the beat may stay on.

**Work song.** The child picks one of four lines. Its syllables are shown split under the bar and highlighted in order as notes are placed. Rests may sit between syllables. A line may use one bar or two; the check counts only bars that hold notes, and each of those must be full.

**Two bells.** A separate small model on the same card. A timeline of 24 eighth cells shows two rows. The child sets how often each bell rings, every 2 to 6 eighths; both start on cell 1, at elapsed eighth 0. A bell with interval `a` rings at elapsed eighths `0, a, 2a, ...`, displayed in one-based cells `1, a+1, 2a+1, ...`. Bell A uses Bell Studio's Low tone and Bell B its High tone, each at `G/3` for 0.10 seconds with Bell Studio's attack and release; the optional beat tick uses `G/3` as above. Before playing, an optional prediction taps the cell where they will next ring together. Play marks every shared cell. The next meeting after the start is elapsed `LCM(a,b)` eighths, displayed at cell `LCM(a,b)+1`: 2 and 3 meet after 6 eighths, at cell 7. If the next meeting is outside cells 1–24 (5 and 6 meet after 30 eighths, at cell 31), the timeline says so and invites working it out. Store elapsed counts separately from displayed cell indices; do not call cell 7 a multiple of 2 and 3.

Two bells is the one place this room breaks two of Bell Studio's limits, on purpose: play lasts **six seconds**, and two tones sound at once. The two tones plus an optional beat tick sum to at most `G = 0.025`; this bound covers simultaneous onsets, release tails and every allowed interval pair. Stop works as everywhere else.

## Saved work

Optional root `rhythm` per explorer, absent until the first card choice or edit:

```
rhythm: {
  size: 'any' | 'sprout' | 'seedling' | 'sapling',
  listened: bool,                                   // Listen first seen
  cards: { [cardId]: { bars: [[code,...], ...], beats: [4|3, ...], kept: [[code,...], ...] | null, line?: songId, echo?: echoId, shown?: bool } },
  checks: [ { card, at, facts } ],                  // up to 50, frozen when recorded
  bells: { a, b, predictionCell: cell | null, nextElapsed: n, nextCell: n, at } | null
}
```

- Validate ids, codes, lengths and bounded counts in a read-only view. An unknown or unreadable card is unavailable in that view; preserve its raw working bars, kept version and checks unchanged and exportable. An unknown note code never empties the saved working bars on load. Other readable cards stay open.
- Saving is caused only by an explicit supported choice or edit, including **Keep this rhythm** and **Check my rhythm**; opening a view never normalizes the save. To replace unreadable working content, offer an explicit **Start a fresh version** action that retains the old raw card alongside the replacement. Preflight the candidate against `dist/progress-limits.mjs` and export capacity before committing; if it cannot fit, keep the current save and explain that no work changed. Retained raw work is removed only through explicit deletion. Keep the latest 50 readable checks, rolling the oldest readable check only on an explicit new check; preserve support/reveal flags and unsupported raw entries. Playback and editing remain available. New bars contain at most eight codes per bar and two bars; retained raw content is not rewritten to meet these authoring limits. A fresh replacement retains the old card under a raw-history field and must pass the same preflight.
- A bar is checked only for fitting its own length. Never check a saved bar against today's card rules, and never recompute recorded check facts.
- Notes export, import, reset and explorer switching include `rhythm`.

## Grown-up notes

One line in the explorer's notes and one Details panel, both in the companion text. The line counts kept cards and echo matches by ear and with the rhythm shown.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): the **Music / sound creation** extension pathway, steps 2 and 3 (pulse, then duration, rhythm and phrase), with two bells reaching toward step 4 (texture). Secondary: **M3-I/II** unit fractions of one whole and equivalence, as a supplied representation; **E5** through the work songs' syllables.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Hear and build note lengths that fill a bar; recognise that different groups of notes can last the same time. |
| Teaching encounter | **Listen first**. |
| Contrast | Same bar, more pieces (`same-as-half`, `two-ways-whole`); long and short; sound and planned silence; four-beat and three-beat bars. |
| Supported practice | Refusals that name the space left; **How full is this bar?**; **Show me the rhythm**. |
| New application | Words to notes (`work-song`); listening to building (`echo`); two parts at once (`two-bells`). |
| Purposeful revisit | Bell Studio for pitch; Fraction Trail and Ribbon Recut for halves and quarters of a fixed whole; a kept rhythm at the Act II show. |
| Data boundary | Note codes, card ids, check facts, the bells pair and prediction. No recording, microphone or free text. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`. Marble has no music subject. Its newer graph adds **Rhythm in rhymes and songs** (`mt_OTFABm2xdf`), not in the pinned graph; its evidence is clapping a beat and repeating a chant, which a screen can't observe, so it stays an upstream-only reference carried by the off-screen invitations. The research record for **Unit fractions** (`mt_k2WE0-22-4`) warns about reading the denominator as the answer and comparing parts with parts instead of the whole, so every fraction label says "of the bar" and the whole bar is always on screen. That topic is about fractions of a set, with Fractions of amounts as its hard prerequisite (covered by the Sharing Counter); a bar of time is a continuous whole, so no atlas reference or crosswalk is proposed.

Jane's `learn` card (one idea and a worked example, revealed one tap at a time) is the model for **Listen first**, and its `fracbar` format is a design reference for the strip. Its points, medals and bosses are not adopted. No upstream code or prose is copied.

## Checks for implementation

- Every refusal leaves the bar unchanged; each palette item fills exactly its length.
- The palette on each card matches the table above; three-beat bars never offer whole notes or rests.
- `echo` matches only an exact sequence, rests included. `work-song` counts notes against syllables and requires every used bar full.
- `two-bells` checks all 25 ordered pairs from 2 to 6: elapsed next meeting is LCM, displayed cell is LCM + 1, and the past-the-timeline message appears when that cell exceeds 24. For a divisor pair, the slower bell is named as the one whose every ring coincides, regardless of A/B order.
- Peak gain never exceeds 0.025 with the beat on, including two-bell coincidences; Stop, replay and edit cannot leave overlapping playback runs.
- Note starts are scheduled from cumulative eighths with no drift across bars. Stop and edit-during-play behave as in Bell Studio.
- Saves with an unknown code, an unknown card, no `bells`, or only Bell Studio state all load. Unknown raw working content survives view, explorer switch and export as unchanged JSON values; capacity refusal leaves the save unchanged.
- Browser at 320 and 820 px: cells at least 44 px tall; two bars wrap as two rows; the 24-cell timeline wraps into three rows of eight.


## Review asks

- Music content: are the rhythms, work-song lines and dotted-note explanations right and singable?
- Is two bells too much for this room, or should it become its own later card set?
