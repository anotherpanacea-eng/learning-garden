# 117. The River Market: Spanish errands from *La Garza*

Status: **proposed; awaiting independent spec review and a fluent Spanish content review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Reuses the French Paris design ([specs 13](13-french-paris-and-plate-return.md), [14](14-french-exploration.md), [83](83-french-saved-visit-source.md)) for narration, meaning support and saved passages. Text and design only here; code and art are for the implementation pass.

## Purpose

The garden has French and six Spanish riddle cards, but no Spanish place. This spec adds one, built around a different kind of language play: **read a note, then do what it says.** Carry the cargo to the right building, walk a visitor along the directions, cook from the recipe, ready the boat for tomorrow's weather. Understanding shows up as an action in the scene, and a question follows.

The situations are practical and grown-up enough for a teen beginner, while the Spanish stays at beginner load: present tense, *hay*, *va a* plus a verb, and friendly commands. Language load is chosen separately from age or interest, as in French.

## Story and place

Act III of the [six-act programme](49-six-act-curriculum.md) opens with a floating market. Its first visitor is the barge ***La Garza*** (*The Heron*) from **Puerto Sauce**, a river town downstream. *Sauce* means willow, so Puerto Sauce is the willow town's downriver cousin. The crew:

- **Marisol**, the captain. Practical, warm, writes clear notes.
- **Teo**, the cook. Gets lost easily and cooks very well.
- **Nube**, the barge's grey cat, who appears in pictures and is never in the way of a task.

Route: `#mercado`, linked from Home under the French entrance as **"The River Market (Spanish)"** and from the six Spanish riddle cards in [spec 94](94-riddles-in-the-hedge.md), which currently have no destination. The act structure decides when the barge arrives in the story; the destination stays open from the start, like every other place.

Opening screen (English, as in French): **"A barge called *La Garza* has tied up at the dock. Its crew speaks Spanish, and they could use a hand. Each errand starts with a note. Read it, then help."**

## How an errand works

1. **The note.** Shown in Spanish, in full, beside a picture of the scene. The passage amount is a local choice: **Short sentences** (default) or **A longer note**. The choice is saved per explorer; changing it never alters an errand already started.
2. **The task.** An action in the scene that follows from the note. The note stays visible.
3. **One question**, three choices in Spanish, with a nudge for each non-fitting choice.
4. **The phrasebook** gains the errand's key words.

Support, available throughout and recorded as support:

- **What does it mean?** opens English glosses for each sentence, then for single words. Using it marks the errand's task and question as supported.
- **Hear it** uses only local Spanish browser voices (`es-*`), never an English fallback. If none is available: **"This device doesn't have a Spanish voice. Ask a grown-up to read it with you, or read it together."** Reviewed recordings would replace browser speech later, as for phonics.
- **Read one sentence at a time** highlights sentences in turn.

No timer, score or lock. An errand can be left and resumed; a finished errand can be replayed and is marked familiar.

## Errand 1: *La carga* (the cargo)

**Short sentences**

> ¡Hola! Somos de Puerto Sauce.
> Traemos tres cajas de naranjas.
> Traemos dos sacos de harina.
> Las naranjas son para el café.
> La harina es para la panadería.

**A longer note**

> ¡Hola, vecinos! Me llamo Marisol y soy la capitana de *La Garza*. Venimos de Puerto Sauce, río abajo. Hoy traemos tres cajas de naranjas, dos sacos de harina y una caja pequeña de semillas. Las naranjas son para el café, la harina es para la panadería y las semillas son para el jardín. ¿Nos ayudas a descargar?

**Task.** Cargo sits on the dock. Tap an item, then tap a building: *el café*, *la panadería* or *el jardín*. Each item can be moved again until **Done unloading**. The task records where each item ended up. Short version: five items (three boxes of oranges, two sacks of flour). Longer: six (plus the seed box).

After unloading, Marisol: **"¡Gracias! Todo está en su sitio."** If something is in a different place, she says which, in Spanish with the English under it on request: **"Las naranjas están en la panadería. ¿Son para la panadería?"** The child can move it and finish again.

**Question.** *¿Cuántas cajas de naranjas hay?*

| Choice | Nudge |
| --- | --- |
| dos | "Dos is how many sacos de harina there are. Look for the number before cajas de naranjas." |
| tres | (fits) |
| cuatro | "Cuatro means four. Look for the number before cajas de naranjas." |

**Glosses.** *Somos* we are · *traemos* we bring · *la caja* box · *el saco* sack · *la harina* flour · *las naranjas* oranges · *para* for · *los vecinos* neighbors · *me llamo* my name is · *venimos de* we come from · *río abajo* downriver · *pequeña* small · *las semillas* seeds · *¿Nos ayudas a descargar?* Will you help us unload?

**Phrasebook.** hola · somos · traemos · la caja · el saco · la harina · las naranjas · el café · la panadería · el jardín · las semillas · tres · dos

## Errand 2: *El camino* (the way)

**Short sentences**

> Teo, sal del muelle.
> Sigue recto hasta el puente.
> Cruza el puente.
> En la plaza, gira a la izquierda.
> La panadería está al lado del café.

**A longer note**

> Teo, la panadería no está lejos. Sal del muelle y sigue recto hasta el puente. Cruza el puente con cuidado, porque todavía hay tablas sueltas después de la tormenta. En la plaza, gira a la izquierda. La panadería está al lado del café, enfrente de la oficina de correos. ¡No te pierdas!

**Task.** A small town map: *el muelle* (dock), *el puente* (bridge), *la plaza*, and around the plaza *la panadería* and *el café* side by side on the left, *la oficina de correos* facing them on the right. Teo stands on the dock. The child moves him with four buttons: **recto** (straight on), **cruza** (cross), **a la izquierda** (left), **a la derecha** (right). Each button shows the Spanish word with a small arrow; English appears only with meaning support.

If Teo arrives at the post office: **Teo: "Esta es la oficina de correos. ¿Dónde está la panadería?"** with the hint **"Read the line about la plaza again."** **Back to the plaza** returns him there. Arriving at the bakery: **Teo: "¡La panadería! Huele a pan. Gracias."** (*It smells of bread.*)

**Question.** Short: *¿Dónde está la panadería?* Longer: *¿Qué está enfrente de la panadería?*

| Short choice | Nudge |
| --- | --- |
| al lado del café | (fits) |
| al lado del puente | "Teo crossed the puente before reaching the plaza. Look at the last sentence." |
| en el muelle | "The muelle is where Teo started." |

| Longer choice | Nudge |
| --- | --- |
| el café | "The café is al lado, next to the bakery. Enfrente means facing it." |
| el puente | "The puente is on the way, before the plaza." |
| la oficina de correos | (fits) |

**Glosses.** *Sal del muelle* leave the dock · *sigue recto* keep going straight · *hasta* as far as · *cruza* cross · *gira a la izquierda* turn left · *está al lado de* is next to · *no está lejos* isn't far · *con cuidado* carefully · *todavía hay* there are still · *tablas sueltas* loose planks · *después de la tormenta* after the storm · *enfrente de* facing, opposite · *la oficina de correos* post office · *¡No te pierdas!* Don't get lost!

**Phrasebook.** sigue recto · cruza · gira · a la izquierda · a la derecha · al lado de · enfrente de · el puente · el muelle · la plaza · la oficina de correos

## Errand 3: *La receta* (the recipe)

**Short sentences**

> Necesitamos cuatro huevos.
> Necesitamos dos patatas y una cebolla.
> Primero, corta las patatas.
> Después, fríe las patatas con la cebolla.
> Al final, añade los huevos.

**A longer note**

> Esta noche hay cena en el mercado y yo cocino una tortilla de patatas. Necesitamos seis huevos, tres patatas, una cebolla, aceite de oliva y un poco de sal. Primero, pela y corta las patatas. Después, fríe las patatas y la cebolla en el aceite, despacio, hasta que estén blandas. Luego, bate los huevos y mézclalo todo. Al final, cocina la tortilla por los dos lados. ¡Cuidado al darle la vuelta!

**Task, part 1.** Teo's pantry shelf. For each ingredient the child sets an amount with + and − (huevos, patatas, cebollas) or picks it (aceite, sal), and leaves out what isn't needed. The shelf also holds *tomates*, *pan* and *leche*, which the recipe doesn't use. Short version needs 4 huevos, 2 patatas, 1 cebolla. Longer: 6 huevos, 3 patatas, 1 cebolla, aceite, sal.

**Task, part 2.** Put the step cards in order. Short: three cards (*corta las patatas*, *fríe las patatas con la cebolla*, *añade los huevos*). Longer: five cards (*pela y corta las patatas*, *fríe las patatas y la cebolla*, *bate los huevos*, *mézclalo todo*, *cocina la tortilla por los dos lados*). Cards start in a fixed shuffled order, saved with the errand. The order words *primero*, *después*, *luego* and *al final* are the clue.

Teo, when everything is ready: **"¡Qué rica! Vamos a cenar."** (*How tasty! Let's have dinner.*)

**Question.** *¿Qué haces primero?*

| Choice (short) | Nudge |
| --- | --- |
| Añades los huevos. | "Al final means at the end. The eggs go in last." |
| Cortas las patatas. | (fits) |
| Fríes la cebolla. | "Después means afterwards. Something comes before the frying." |

| Choice (longer) | Nudge |
| --- | --- |
| Pelas y cortas las patatas. | (fits) |
| Bates los huevos. | "Luego means then. The eggs come after the potatoes are soft." |
| Fríes la cebolla. | "Después means afterwards. Something comes before the frying." |

**Culture note** (Details, **"Two tortillas"**): **"In Spain, a *tortilla de patatas* is a thick omelet of eggs and potatoes. In Mexico and much of Central America, a *tortilla* is a thin flat bread made from corn or wheat. Same word, different foods."**

**Glosses.** *Necesitamos* we need · *los huevos* eggs · *las patatas* potatoes · *la cebolla* onion · *primero* first · *corta* cut · *después* afterwards · *fríe* fry · *al final* at the end · *añade* add · *esta noche* tonight · *la cena* dinner · *cocino* I cook · *el aceite de oliva* olive oil · *un poco de sal* a little salt · *pela* peel · *despacio* slowly · *hasta que estén blandas* until they're soft · *luego* then · *bate* beat · *mézclalo todo* mix it all · *por los dos lados* on both sides · *darle la vuelta* to flip it

**Phrasebook.** necesitamos · los huevos · las patatas · la cebolla · primero · después · luego · al final · la cena · esta noche · cuatro · seis

## Errand 4: *El tiempo* (the weather)

**Short sentences**

> Mañana por la mañana va a llover.
> Por la tarde va a hacer sol.
> Por la noche va a hacer mucho viento.
> El río va a subir un poco.

**A longer note**

> El parte del tiempo para el río. Mañana por la mañana va a llover mucho, sobre todo cerca de las colinas. Por la tarde las nubes se van y va a hacer sol, pero va a hacer fresco. Por la noche va a hacer mucho viento. El río va a subir un poco, así que los barcos deben amarrarse bien en el muelle. No hay peligro para el pueblo.

The longer note ends with reassurance on purpose: this is a town that has lived through a flood.

**Task.** A plan board for *mañana* with three rows, *por la mañana*, *por la tarde* and *por la noche*. For each row the child picks a weather picture from the almanac's set ([spec 116](116-field-guide-almanac.md)): sun, clouds, rain, wind, snow. Then one crew job for tonight:

| Job | Marisol's reply |
| --- | --- |
| *Amarrar bien el barco* (tie the boat up well) | "Sí. Con viento y el río alto, el barco necesita cuerdas fuertes." |
| *Salir a navegar* (set sail) | "¿Con tanto viento? Mejor esperar al día siguiente." |
| *Secar las velas* (dry the sails) | "Buena idea por la tarde, con sol. Pero ¿y esta noche?" |

The child can change the job after a reply. Every reply explains the note gently.

**Question.** *¿Qué va a pasar con el río?*

| Choice | Nudge |
| --- | --- |
| No va a cambiar. | "Look at the sentence with el río. Subir means to rise." |
| Va a bajar. | "Bajar means to go down. The note uses a different verb." |
| Va a subir un poco. | (fits) |

**Glosses.** *Mañana* tomorrow · *por la mañana* in the morning · *va a llover* it's going to rain · *por la tarde* in the afternoon · *va a hacer sol* it's going to be sunny · *por la noche* at night · *mucho viento* a lot of wind · *el río va a subir* the river is going to rise · *un poco* a little · *el parte del tiempo* the weather report · *sobre todo* especially · *las colinas* hills · *las nubes se van* the clouds go away · *fresco* cool · *así que* so · *deben amarrarse* should be tied up · *no hay peligro* there's no danger · *el pueblo* the town

Note that *mañana* means both "tomorrow" and "morning", and *mañana por la mañana* is "tomorrow morning". This gets its own phrasebook line.

**Phrasebook.** mañana · por la mañana · por la tarde · por la noche · va a llover · hace sol · hace viento · el río · subir · bajar · las nubes

## Errand 5: *Una postal* (a postcard), open

*La Garza* leaves at the end of the market. **"Write a postcard to Puerto Sauce. Marisol says she'll read it on the way home."**

Phrase tiles, tapped into a postcard in order, each removable:

- Openings: *Querida Marisol:* · *Hola, Teo:* · *Hola, Nube:*
- Weather: *Hoy hace sol.* · *Hoy llueve.* · *Hoy hace viento.* · *Hoy hace frío.*
- The town: *Me gusta el mercado.* · *Me gustan las naranjas.* · *Mi lugar favorito es el jardín.* · *Mi lugar favorito es el puente.* · *Mi lugar favorito es la biblioteca.*
- Questions: *¿Cómo está Nube?* · *¿Cuándo vuelves?*
- Closings: *Un abrazo,* · *Hasta pronto,*

Below the tiles, an optional **"Add your own words"** field, in Spanish, English or both. The postcard is signed with the explorer's picture symbol, never a name. Nothing on the postcard is checked or graded. **Keep my postcard** saves it; the next voyage brings a reply.

**Marisol's reply** (fixed text, arriving on the next visit after a kept postcard):

> ¡Hola! Gracias por tu postal. Nube está muy bien; duerme todo el día en las velas. En Puerto Sauce hace sol y el río está tranquilo. Volvemos al mercado pronto con más naranjas. Un abrazo, Marisol.

## Grammar and sound notes

Details panels on the phrasebook page, each linked from the errand where it first matters. English explanation, Spanish examples from the errands.

- **"El, la, los, las."** "Every Spanish noun is masculine or feminine, and the little word in front shows which: *el saco*, *la caja*. For more than one: *los sacos*, *las cajas*."
- **"Hay."** "*Hay* means there is or there are. *Hay tres cajas*: there are three boxes. It never changes for one or many."
- **"Going to: *va a*."** "*Va a* plus a verb means going to. *Va a llover*: it's going to rain. *Voy a cocinar*: I'm going to cook."
- **"Directions to a friend."** "*Sigue*, *gira* and *cruza* are friendly commands, the way you'd tell a friend what to do."
- **"*Me gusta* and *me gustan*."** "*Me gusta el mercado* for one thing; *me gustan las naranjas* for more than one."
- **"Sounds."** "*H* is silent: *harina* sounds like 'ah-REE-nah'. *J* is a breathy sound from the back of the throat: *naranjas*. *Ñ* sounds like the 'ny' in canyon. *Ll* in *llover* sounds like the 'y' in yes in most places."

## The phrasebook, *Mi cuaderno*

A page listing every word collected so far, grouped by errand, with the article and the English. Words appear after the explorer opens an errand's note. Tapping a word plays it with a local Spanish voice if one exists. **"Words you've met"** is the title; the phrasebook never claims the explorer knows them.

## Off-screen invitations

- "Find three things at home you could name in Spanish. Make labels for them."
- "Give a grown-up directions to another room using *recto*, *izquierda* and *derecha*."
- "Cook something with a grown-up from a recipe. Find the words that tell you the order."
- "Tomorrow morning, look outside and say the weather in Spanish."

## Saved work

Optional root `spanish` per explorer, absent until the first explicit choice or opened note:

```
spanish: {
  amount: 'short' | 'longer',
  errands: { [errandId]: {
    source: { version, amount, passage, choices, cardOrder },   // frozen copy when the errand starts
    task: { ... },                                              // item placements, Teo's moves, pantry, step order, plan board, job
    answer: { picks: [choiceId], fitted: bool } | null,
    support: { meaning: bool, narration: bool, oneAtATime: bool },
    state: 'started' | 'done', familiar: bool, at
  } },
  postcard: { tiles: [tileId], text: string, at } | null,
  replySeen: bool
}
```

- A started errand keeps its frozen passage, choices and card order, following spec 83, so later wording edits never change a saved visit.
- Validate ids, codes and counts only. An unreadable errand is skipped and the rest of the market stays open. Never check a saved task against today's answer key.
- Spanish observations are labeled `language: es` and never affect English or French suggestions, starting choices or the atlas.
- Notes export, import, reset and explorer switching include `spanish`.
- [Spec 114](114-optional-starting-flow.md)'s starting flow can later offer a Spanish passage-amount choice beside English and French. Not part of this spec.

## Grown-up notes

**"River Market (Spanish): [n] of 4 errands done, [n] with meaning support. Postcard: kept / not yet."** Details: **"The market practices reading short Spanish notes and acting on them. It doesn't assess Spanish ability. Errands done with meaning support used English glosses. If you speak Spanish, reading the notes aloud together helps more than anything the game can do."**

## Upstream check

Marble has no Spanish or additional-language topics, so this is an original extension, as French is. Jane's short-quest and glossary conventions are design references through the French specs; no Jane code or text is used. All passages, names and art direction are original.

## Checks for implementation

- Each errand's task completes from both passage amounts, with its own quantities.
- Choice positions vary across the four questions (fitting choice in positions 2, 1, 2, 3 in the short versions and 2, 3, 1, 3 in the longer versions), and stay fixed within a saved errand.
- Meaning support marks the task and question as supported, including after resume.
- Narration selects only `es-*` voices and shows the no-voice message otherwise.
- A started errand resumes with its frozen passage after the content file changes.
- The postcard keeps tiles and free text exactly, and the reply appears once on a later visit.
- Riddle cards with the `spanish` strand link to `#mercado`.
- Browser at 320 and 820 px: the note and the scene fit without horizontal scroll; the note stays visible during each task.

## Review asks

- **Fluent Spanish review before build.** Check every passage, gloss, reply and nudge for natural, correct, neutral Spanish. The recipe uses *patatas* (Spain); Latin American Spanish says *papas*. Decide whether to add a note on that or pick one consistently.
- Is the longer note's load right for a beginner who reads well in English?
- Does the weather errand's plan board make the link to the almanac clear enough to be worth the extra step?
