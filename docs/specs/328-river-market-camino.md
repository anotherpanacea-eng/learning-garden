# 328 · The River Market: the second errand, *El camino*

Proposed 2026-10-31. Base inspected: `686f2e2daf53e3df92a5e53c38bf938942df5594` (spec 324's branch), with the La carga build in progress on `claude/lg29-la-carga`. The second bounded runtime slice of [117](117-spanish-river-market.md), after [324](324-river-market-cargo.md). **Specification, not implementation or release clearance.** Its Spanish is bound to the [model-panel review](../reviews/117-spanish-panel/resolution.md) of the 117 companion text, as resolved there.

## Purpose and boundary

*La carga* teaches reading a note and acting on what it names. *El camino* teaches following a sequence: read Marisol's directions and walk Teo, the cook who always gets lost, from the landing to the bakery with four Spanish direction buttons. A wrong turn at the plaza brings him to the post office, with a hint and a way back. Understanding shows up as a route walked in the scene, and the wrong turn is revisable.

This slice extends 324's `#mercado` route, controller, support tools, *Mi cuaderno* and `spanish` root. It builds no second Spanish page. Out of scope: *La receta*, *El tiempo*, *Una postal*, Marisol's reply, their grammar notes, recorded audio, and any Act III chapter state. Spec 326's market chapter reader still reads *La carga* tries only; *El camino* tries are not chapter evidence.

This is supported reading practice, not a Spanish assessment, placement or proficiency claim. Observations carry `language: 'es'` and never affect English or French suggestions or evidence.

## Experience

**The errand list** now has two entries in this order: *La carga* and *El camino*, each with 324's labels (**Not started**, **Started**, **Done**, **Done before**). Both are open from the start, with no order and no lock. It still does not list, tease or count the three unbuilt errands. Choosing an entry shows that errand below the list and moves focus to its heading. Which errand is shown is view state, not saved. On arrival it is the first errand in list order that isn't done, or *La carga* when both are done.

**Passage amount** stays one saved choice per explorer. Each started errand keeps the amount it started with, and the control shows 324's line while the shown errand is started.

**The note** is the companion's *El camino* note at the errand's amount, in Spanish (`lang="es"`), beside a drawn map. It stays visible through the task and the question, with 324's layout at 320 px and 820 px.

**The map** is a drawn SVG with six Spanish text labels from the companion: *el muelle*, *el puente*, *la plaza*, *la panadería*, *el café* and *la oficina de correos*. The landing is at the bottom, the river and bridge across the middle, and the plaza above it. The bakery and the café stand side by side on the plaza's left. The post office stands on the right, across the plaza from the bakery, as the longer note says. Teo walks up the screen, so the screen's left is Teo's left. Teo is drawn with a text label, and his place is also given in text (exceptions table), never by position alone.

**The task.** The companion's prompt and Teo's start line show first. The four buttons are the companion's: **recto ↑**, **cruza ⤳**, **a la izquierda ←**, **a la derecha →**, native buttons with Spanish text and the arrow as decoration. Each press is one move, resolved from the frozen map:

| Teo is at | recto | cruza | a la izquierda | a la derecha |
| --- | --- | --- | --- | --- |
| *el muelle* (start) | to *el puente* | nothing to cross | stays | stays |
| *el puente* | stays | to *la plaza* | stays | stays |
| *la plaza* | stays | nothing to cross | to *la panadería* | to *la oficina de correos* |
| *la oficina de correos* | stays | nothing to cross | stays | stays |

- **Nothing to cross** shows the companion's line: Teo looks around, «Aquí no hay nada que cruzar.», *There's nothing to cross here.*, and Teo stays put.
- **Stays** shows the exceptions table's line, and Teo stays put.
- **At the post office** Teo says the companion's line, with its hint and the **Back to the plaza** button, which returns him to the plaza as a move.
- **At the bakery** Teo says the companion's arrival line. The task is done, and the direction buttons are replaced by that line. Start again is how to walk it again.

The café is a label on the map, not a stop. No move goes back across the bridge, and the landing is never a destination after the start.

**The question** shows after Teo first reaches either the post office or the bakery. It is the companion's question for the errand's amount: **¿Dónde está la panadería?** for short sentences, **¿Qué está enfrente de la panadería?** for the longer note. Choices and nudges are the companion's, in its order. A non-fitting pick shows its nudge, stays selected, and the child can pick again.

**Done.** The errand is done when Teo is at the bakery and the latest pick fits. Done shows **Start again**, as in 324. *El camino* has no boat-name line.

**Support** is 324's three tools, applied to this note: **What does it mean?** and **Word by word** (the companion's *El camino* word list), **Hear it** with local `es-*` voices only, and **Read one sentence at a time**. Support is recorded before English shows, on every path, as 324 sets out. The **Read with English help** label shows on this errand once its meaning support was used.

***Mi cuaderno*** gains a second group under *El camino* with the companion's phrasebook words, each with its English from the word list, once this errand's note has been opened. It gains one Details note, **Directions to a friend**, linked from the note. The 324 notes stay where they are.

The off-screen invitation for this errand is the companion's second one (directions to another room). The grown-up notes use the companion's Details paragraph and the exceptions table's line.

No timer, score, lock or unlock. The child can leave and resume at any point, including mid-walk.

## Text

All Spanish, glosses, words, Teo's lines, hints, nudges and the grammar note are the 117 companion's *El camino* section and *Mi cuaderno* note, **as amended by the panel resolution** (including the added row for «Sal del muelle y sigue recto hasta el puente.»). Commission additions, in English:

| Where | Text |
| --- | --- |
| A button that leads nowhere from Teo's place (other than *cruza*) | Teo looks around. That way doesn't go anywhere from here. Teo stays put. |
| Teo's place, in text and as the map's accessible description | Teo is at {place}. ({place} is the Spanish map label, marked `lang="es"`.) |
| Direction buttons, group label | Move Teo |
| Grown-up line, replacing 324's | River Market (Spanish): La carga {done / started / not started}{, with English help}. El camino {done / started / not started}{, with English help}. |

324's other exceptions apply unchanged. 324's source check extends to this errand: every newly shipped Spanish line and gloss matches the resolved companion exactly, every new English string is in the companion, 324's table or this one, and none has an em-dash.

## Saved work

The same `spanish` v1 root. *El camino* adds `errands.camino`, created when its note is first opened, with 324's `Errand` shape and these task fields:

```
camino Errand: {
  tryId, source, support, answer, state, familiar, at,   // as 324
  task: { at: nodeId, moves: [buttonId | 'back'], moveCount: n },
  taskEvidence: {
    firstArrival: { destination: 'correos' | 'panaderia', moves, support } | null,
    hints: [feedbackId]
  }
}
```

- **Frozen source.** Opening the note freezes the whole errand at the current amount, following spec 83 and 324: the amount, sentences with glosses, word list, map labels, the node and button table above with start and goal, every feedback line with its id and both languages, the question for that amount with choice ids, order, fitting id and nudges, the phrasebook group, the **Directions to a friend** title and text, and the check rules. Every move, check and display resolves from this source, including on resume.
- **Moves.** `moves` keeps the latest 32 moves and `moveCount` counts all of them, as 117 bounds. A move that stays put is still a move. `at` is the current node, checked against the frozen table on load and never recomputed from the history.
- **Evidence.** `firstArrival` is kept once: the first destination Teo reached, the moves up to it and the support at that moment. `hints` is the bounded set of feedback ids shown (*nothing to cross*, *stays*, *post office*), set before the line shows and never cleared on resume. A walk that never reached a destination is unobserved. Task and question outcomes stay separate.
- **Try ids and Start again** follow 324: `tryId` from the shared `nextTry`, never reused. Start again moves the errand unchanged to `earlier` and freezes a fresh source at the current amount. `familiar` is true when any retained earlier *El camino* has an opened note. The retained-try bound applies per errand id, so a child's *La carga* history never blocks Start again on *El camino*, or the reverse. A refusal at the bound or at capacity changes nothing.
- **Validation and preservation** follow 324. An unreadable *El camino* record shows the companion's unavailable line, stays raw and exportable, and leaves *La carga* open. A pre-328 build that finds `errands.camino` keeps it raw and exportable, and shows nothing for it.
- Every explicit write (opening the note, each move, Back to the plaza, each pick, every support flag, Start again) is cloned and preflighted against `dist/progress-limits.mjs` and the real Notes export before it commits, and a refusal shows the capacity line with the previous save unchanged.

## Integration

Extend `dist/river-market-content.mjs`, `-core.mjs`, `-ui.mjs` and `river-market.css` from 324, plus a drawn map SVG. Generalize the La carga controller where an errand id is needed, without a second controller. `riverMarketNotes(state)` reports both errands and still returns safely for any JSON value at `spanish`. `riverMarketTries` stays La carga only, for spec 326. No new route and no `app.mjs` change beyond what 324 adds. Update the `#mercado` atlas scope to name *El camino* and regenerate `docs/learning-atlas.md`, and update the README entry.

At 320×600, 820×1000 and 1024×768: no horizontal page scroll; 44 px targets; visible keyboard focus. The note, the map and the four buttons are visible together at 820×1000 once the task is scrolled to. A move keeps focus on the pressed button, and Teo's place and line are announced in a polite status region. Reduced motion shows Teo at his new place with no walking animation.

## Acceptance

1. Pure checks:
   - Every cell of the move table at both amounts, including every stay and nothing-to-cross case.
   - Back to the plaza from the post office, then a left turn, finishes the task. `firstArrival` keeps the post office, and the hints keep the post-office id.
   - Both questions, every nudge, and the fitting position as the companion lists it.
   - The question appears only after a first arrival; Done needs the bakery and a fitting latest pick.
   - Moves beyond 32 keep only the latest 32 and the full count; a resumed walk continues from the saved node.
   - Meaning support set before English shows, on every path, and it persists; `firstArrival`'s support never changes.
   - A frozen source resumes unchanged after the content module's map, labels, wording and order change.
   - Start again keeps the old try exactly, takes a new try id, marks the fresh one familiar, uses the current amount, and is bounded per errand id.
   - An unreadable or pre-328 *El camino* record leaves *La carga* open and stays exact in the export.
   - Rendering, switching the shown errand and opening *Mi cuaderno* make no write.
   - `riverMarketTries` never returns an *El camino* try.
   - The source check described under Text.
2. Native browser journeys at the three viewports: real taps and the keyboard walk Teo the right way and the wrong way and back; the note and map stay visible; Teo's place is announced; the question appears after the first arrival; the errand list switches errands with focus on the heading; Mi cuaderno shows both groups; save, reload mid-walk, Notes download and import, reset, two explorers, stale controls after navigation, and a forced preflight refusal. Inspect rendered screenshots of the map.
3. 324's La carga checks, the riddles, French, Paris and speech regressions stay green, and the source runner passes. This is followed by independent review of the exact candidate and the repository's landing procedure. Physical iPad, VoiceOver and audible Spanish speech stay unqualified until checked.

Any changed or added Spanish line needs a new panel pass under 117's method.
