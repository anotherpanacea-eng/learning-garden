# 366 · The guide changes their mind

Proposed 2026-11-02. Base inspected: `37b9000`. **Specification and finite text only, not implementation or release clearance.** This amends [352](352-act-four-opening.md)'s companion and the [Act IV story text](../content/120-story/act-4.md) so that the explorer's guide carries the belief change that [spec 49](49-six-act-curriculum.md) gives Act IV. It adds no state, no route and no activity.

## What is missing

Spec 49 says Act IV is where "a trusted guide can revise a belief without becoming incompetent." Spec 120 §4 says the guide (Mira, Rowan or Ari) "asks questions" and that Rowan's "changing his mind" and Ari's "noticing" matter in Act IV. The current Act IV script gives every change of mind to someone else: the orchard keeper, the miller, Pip or the librarian. Spec 352 gives the guide no lines.

The built game uses the guide lightly. A guide rail shows a portrait and one fixed line on about fifteen screens, and Acts I to III give the guide about five story lines. No guide line responds to anything, and the three guides never differ after the first greeting. Act IV is the one place the specs ask the guide to do something only a trusted companion can: be wrong in front of the explorer, say so, and stay trusted.

## The beat

Three moments, one per stage of the act:

1. **The guess (opening).** When Act IV starts, the guide writes a guess on a card and pins it to the library door: *Mostly the rain.* The guide says why it is written down first. Every explorer who starts the act sees this, at both reading amounts, because the opening hub is the one Act IV screen nobody skips.
2. **Still checking (chapter 1).** After the explorer offers an evidence note, the guide rereads the card and keeps it, for now. This line follows the offer and never comments on the note's content.
3. **The change (ending).** At *The Map We Changed*, the guide unpins the card, says the old guess cannot be shown either, states a better question, and writes it under the old one, leaving the old guess visible.

The guess is a reasonable one. It matches the miller's headline in chapter 3, and it is the mirror of Pip's "That's it, then. Solved" about the Sponge. The guide and Pip start on opposite sides, and both end up less sure. Bramble, who said one flood five years later proves nothing, stays right.

### Rules the text keeps

- **The guide stays competent.** The guide is the one who asked "So how *would* we know?" in chapter 1, and is the one who names the better question at the end. The change is framed as useful, never as a failure.
- **The idea changes; the record does not.** The old card stays pinned with the new idea written under it. This follows the observation/interpretation split below.
- **The guide never knows the answer first.** The guide's new idea is a question, not the answer to the mystery. 120 §4 holds.
- **The story never judges the explorer.** The guide's guess is story-owned. The ending line refers to the guide's own card, never to the explorer's work, so it is exempt from act-4.md's rule that a mind-change line "may refer only to a matching kept source/artifact." It is not evidence of the explorer's understanding.
- **Any guide can say any line.** The shared lines use `{guide}` and no pronouns. An optional one-line tail, keyed to the guide id, lets each guide's description show; an unknown or fallback guide gets no tail.

## Finite text

All lines are English, at most 25 words, with no em-dashes. `{guide}` resolves as in [248](../content/248-a-town-of-our-own-text.md).

### Opening hub (ships with 352)

Shown after the opening, at both Short and Longer:

> {guide} writes on a card, *Mostly the rain*, and pins it to the library door.
>
> "I'll put my guess up first," says {guide}, "so I can't pretend later."

### Chapter 1, after an offer (ships with 352)

Shown under the Kept line, once a receipt exists:

> {guide} reads the card on the library door again. "Still my guess. I'll keep checking it."

### Ending, *The Map We Changed* (ships with the ending's own slice)

Shown after whichever mind-change line act-4.md's rule selects, including the fallback, at both Short and Longer:

> {guide} unpins the card from the library door. "I wrote *mostly the rain*. I was sure. I can't show that either."
>
> "So I've changed my mind. It could be the rain and the Sponge together. That's a better question than I had."
>
> {guide} writes the new idea under the old one, and leaves the old one showing.

Optional tail, one line, by guide id:

| Guide | Line |
| --- | --- |
| `mira` | Mira draws a small question mark in the corner of her sketchbook, and smiles at it. |
| `rowan` | Rowan grins. "Changing my mind is the thing I'm best at making." |
| `ari` | Ari turns a pebble over in one hand. "I noticed something I hadn't noticed this morning." |

## State and recovery

None. The card is story text, not a saved object. Nothing is written when it is shown. If the explorer changes guide mid-act, every line shows the current guide's name; the card belongs to whoever is the guide now. Damage to `acts.IV` follows 352 and 248: if the hub cannot be shown, neither can the card.

## Upstream study and curriculum place

**Jane**, refreshed at `4b6142f964ffe8849e90108edffc9f9088b822eb` (was `e88f81a` in 352). The only `LESSONS.md` change since is a comment allowing Jane's own `jane_…` topic ids in quests; it has no bearing here. Studied only, as in 352: a story hook, finite stages, a reached beat that stays reached. No review gates, bosses, medals or mastery locks. No Jane code, prose or assets are copied.

**Marble**, refreshed at `5e23196fa60050433f1440057f65a978d39e63fc`, unchanged since 352. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. The nearest topic is a candidate, not a coverage claim, and there is no atlas mapping:

| Topic | Strand | Why it is near |
| --- | --- | --- |
| Changing Your Mind with Evidence `mt_obF-6VYRya` | Scientific Inquiry | The guide models the move the topic names. |

Its teaching research (`data/teaching-research.json`) lists "Model belief revision aloud" and "commit a prediction visibly before testing, so the later mismatch is honest" among its best practices, and gives the frame "I predicted … but I observed … so I changed my mind." Its listed misconceptions include "Believing scientists are people who are always right" and "Feeling that admitting 'I changed my mind' is weakness." The guide's pinned card, the spoken change and the trusted companion who makes it are written against those. It also warns against "changing the recorded data to match the prediction instead of changing the idea", which is why the old card stays up. The ending's guide line adapts the frame to the story's evidence: the guide says the old guess "can't be shown", which stays true whatever the explorer's own notes contain.

**Hard-prerequisite crosswalk** against the pinned `curriculum/marble/dependencies.json`: `mt_obF-6VYRya` has one hard prerequisite, Observation vs Interpretation `mt_Hw70LI5xza` (a *scoped practice reference* in `curriculum/topic-coverage.csv`: plant study, Rain Paths, fair test), and one soft one, Learning from Mistakes `mt_TDUpy57QVM`. `mt_obF-6VYRya` itself is *not yet mapped*. 366 claims no topic, so none gates it. A later lesson that claims `mt_obF-6VYRya` must have the explorer commit and revise their own prediction; watching the guide do it is modelling, not practice.

**Spec 49.** Act IV, evidence and disagreement: this is the "trusted guide can revise a belief without becoming incompetent" clause. It adds no lesson (49 §5) and no free-text field.

**Spec 120.** §4's guide row is updated to point here. The guide's arc is the only change; the plot, pages, chapters and ending rule are unchanged.

All new prose is original project material.

## Gates and acceptance

Before build: an independent review of this spec with 352's companion and act-4.md. No language panel is needed.

When 352 is built:
- The hub shows both opening lines at Short and at Longer, with the chosen guide's name, and with each fallback guide.
- The chapter 1 line appears only once a receipt exists, and never reads, names or depends on the offered note's content.
- Showing either line writes nothing.

When the ending is built:
- The guide's lines follow every selected mind-change line, including the fallback.
- The tail matches the current guide id, and is absent for a fallback guide.
- Every shipped string matches this spec.
