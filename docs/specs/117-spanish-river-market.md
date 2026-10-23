# 117. The River Market: Spanish errands from *La Garza*

Status: **proposed; awaiting independent spec review and a fluent Spanish content review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Reuses the French Paris design ([specs 13](13-french-paris-and-plate-return.md), [14](14-french-exploration.md), [83](83-french-saved-visit-source.md)) for narration, meaning support and saved passages. Fits the valley and towns of [spec 120](120-keeper-of-the-ways.md). Every child-facing line, in English and Spanish, is in [the companion text](../content/117-river-market-text.md); this spec holds the model and rules. Code and art are for the implementation pass.

## Purpose

The garden has French and six Spanish riddle cards, but no Spanish place. This spec adds one, built around a different kind of language play: **read a note, then do what it says.** Carry the cargo to the right building, walk a visitor along the directions, cook from the recipe, ready the boat for tomorrow's weather. Understanding shows up as an action in the scene, and a question follows.

The situations are practical and grown-up enough for a teen beginner, while the Spanish stays at beginner load: present tense, *hay*, *va a* plus a verb, and friendly commands. Language load is chosen separately from age or interest, as in French.

## Place and story

Willow Brook runs down a Pyrenees valley from Spain into France (spec 120 §4). **Vadoalto**, the Spanish-speaking town upstream, sends its traders downstream by boat to Act III's floating market. One of them is the barge ***La Garza*** (*The Heron*). Crew:

- **Marisol**, the captain. Practical, warm, writes clear notes.
- **Teo**, the cook. Gets lost easily and cooks very well.
- **Nube**, the barge's grey cat, in pictures, never in the way of a task.

Nuria, Vadoalto's apprentice keeper and the explorer's correspondent in spec 120, is not part of the barge crew; the postcard can be addressed to her as well, and spec 120's letters stay hers. The barge's name is a small nod to Hollis, the heron, and Marisol has one optional line about it (companion text); the story thread decides whether to keep it.

The goods follow spec 120's seed exchange: Vadoalto honey, flour and reed seed come down; the town's apples go up. The Spanish uses ***ustedes*** for plural "you", per spec 120's owner decision; singular address is *tú*. Food words follow Spain (*patatas*, *tortilla de patatas*), matching Vadoalto's side of the border.

Route: `#mercado`, linked from Home under the French entrance as **The River Market (Spanish)** and from the six Spanish riddle cards in [spec 94](94-riddles-in-the-hedge.md). The destination is open from the start; its story framing names the floating market.

## How an errand works

1. **The note.** Spanish, in full, beside a picture of the scene. Passage amount is a local choice: **Short sentences** (default) or **A longer note**, saved per explorer. Changing it never alters an errand already started.
2. **The task.** An action in the scene that follows from the note. The note stays visible.
3. **One question**, three Spanish choices, a nudge for each non-fitting choice.
4. **The phrasebook** gains the errand's words when its note is opened.

Support, available throughout and recorded as support:

- **What does it mean?** opens English glosses per sentence, then per word. Using it marks the errand's task and question as supported.
- **Hear it** uses only local Spanish browser voices (`es-*`), never an English fallback; with none available, a message suggests reading together. Reviewed recordings would replace browser speech later.
- **Read one sentence at a time** highlights sentences in turn.

No timer, score or lock. An errand can be left and resumed; a finished errand can be replayed and is marked familiar.

## The errands

| ID | Errand | Task | Question |
| --- | --- | --- | --- |
| `carga` | *La carga*, unloading | Tap an item, then a building (*el café*, *la panadería*, *el jardín*). Short: five items. Longer: six. Done unloading checks placement; Marisol names any item in another place, and the child can move it and finish again. | How many jars of honey? |
| `camino` | *El camino*, Teo's way to the bakery | Move Teo across a small map with four Spanish direction buttons. A wrong turn at the plaza brings him to the post office, with a hint and a way back. | Short: where is the bakery? Longer: what faces the bakery? |
| `receta` | *La receta*, Teo's tortilla | Set amounts on the pantry shelf (three distractor foods), then order the step cards (three short, five longer) from a fixed saved shuffle. | What do you do first? |
| `tiempo` | *El tiempo*, the weather report | Pick a weather picture for morning, afternoon and night tomorrow, from the almanac's five; then one crew job for tonight from three, each with a reply from Marisol. The child can change the job after a reply. | What will the river do? |
| `postal` | *Una postal*, open | Tap phrase tiles into a postcard; optional free text; signed with the explorer's picture symbol. **Keep my postcard** saves it; Marisol's reply arrives on a later visit. | none |

Choice positions for the fitting answer: short versions 2, 1, 2, 3; longer versions 2, 3, 1, 3. Fixed within a saved errand.

The phrasebook page, *Mi cuaderno*, lists every word met, grouped by errand, with article and English, titled **Words you've met**. It never claims the explorer knows them. Six grammar and sound notes sit on it as Details panels, each linked from the errand where it first matters.

## Saved work

Optional root `spanish` per explorer, absent until the first explicit choice or opened note:

```
spanish: {
  amount: 'short' | 'longer',
  errands: { [errandId]: {
    source: { version, amount, passage, choices, cardOrder },   // frozen when the errand starts
    task: { ... },                                              // placements, Teo's moves, pantry amounts, step order, plan board, job
    answer: { picks: [choiceId], fitted: bool } | null,
    support: { meaning: bool, narration: bool, oneAtATime: bool },
    state: 'started' | 'done', familiar: bool, at
  } },
  postcard: { tiles: [tileId], text: string, at } | null,
  replySeen: bool
}
```

- A started errand keeps its frozen passage, choices and card order, following spec 83.
- Validate ids, codes and counts only. An unreadable errand is skipped and the rest stays open. Never check a saved task against today's answer key.
- Spanish observations carry `language: es` and never affect English or French suggestions, starting choices or the atlas.
- Notes export, import, reset and explorer switching include `spanish`.
- [Spec 114](114-optional-starting-flow.md)'s starting flow can later offer a Spanish passage-amount choice. Not part of this spec.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): the **Spanish** extension pathway row, parallel to French (added in this PR). The errands cover its first three steps (familiar words and phrases, purposeful short sentences, linked instructions and accounts), with *va a* plus a verb as a first look at the fourth. Secondary: **M1** quantities in the cargo and recipe; **L1-II** a market exchange; **S7** the weather report; the Cartographer's directions vocabulary.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Read a short practical Spanish note and act on it; meet numbers, places, directions, food, order words and weather words in use. |
| Teaching encounter | Each note, with sentence-by-sentence glosses and narration, before any task. |
| Contrast | *al lado de* and *enfrente de*; *primero, después, luego, al final*; *subir* and *bajar*; *me gusta* and *me gustan*; the two *tortillas*. |
| Supported practice | The three support tools; Teo's and Marisol's hints. |
| New application | Words return in later errands and the postcard tiles; the longer note asks for the same action with more to read. |
| Purposeful revisit | Spanish riddle cards link here; the weather errand uses the almanac's pictures; Marisol's reply comes later; spec 120's letters from Nuria use the same words. |
| Data boundary | Errand choices, placements, support flags, postcard tiles and optional free text, all local. No name, place or voice collected. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`. Marble has no Spanish or additional-language topics, even in its newer graph, so this is an original extension, as French is. Jane's `LESSONS.md` writing rules shaped the text: questions speak to the learner, stay short, offer three choices with one fitting; glosses are short definitions in its glossary style; and its teach-first order matches note, task, question. Jane's points, medals, bosses and quest schedule are not adopted, and no Jane code or text is used.

## Checks for implementation

- Each errand completes from both passage amounts with its own quantities.
- Fitting-choice positions match the list above and stay fixed within a saved errand.
- Meaning support marks task and question as supported, including after resume.
- Narration selects only `es-*` voices and shows the no-voice message otherwise.
- A started errand resumes with its frozen passage after the content changes.
- The postcard keeps tiles and free text exactly; the reply appears once, on a later visit.
- Riddle cards with the `spanish` strand link to `#mercado`.
- Browser at 320 and 820 px: note and scene fit without horizontal scroll; the note stays visible during each task.

## Review asks

- **Fluent Spanish review before build**, of every passage, gloss, reply, nudge and tile. The companion lists specific questions.
- Is the longer note's load right for a beginner who reads well in English?
