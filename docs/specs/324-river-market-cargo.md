# 324 · The River Market: the first errand, *La carga*

Proposed 2026-10-31. Base inspected: `2fa234b95d15dfc15d8dbd489da39c4bfa9a8302`. A bounded first runtime slice of [117](117-spanish-river-market.md), the roadmap's lane B step 4 and priority 4C ("one barge errand with a taught/guided route, phrase help and a revisable action in the scene"). **Specification, not implementation or release clearance.** Its Spanish is bound to the [model-panel review](../reviews/117-spanish-panel/resolution.md) of the 117 companion text, as resolved there.

## Purpose and boundary

The garden has French places and six Spanish riddle cards, but no Spanish place. Build the River Market's arrival and its first errand, *La carga*: read Marisol's note, unload the barge by placing each item at the building the note names, then answer one question. Understanding shows up as an action in the scene. The slice also builds the parts every later errand reuses: the passage-amount choice, the three support tools, local Spanish speech, *Mi cuaderno* and the frozen `spanish` root.

Out of scope: the other four errands (*El camino*, *La receta*, *El tiempo*, *Una postal*) and Marisol's reply, their grammar notes, spec 114's starting flow, recorded audio, and any Act III chapter state, page or unlock. The story frame names the floating market but changes no story root. The errand list shows only *La carga*; it does not list, tease or count unbuilt errands. Later slices extend this route, controller and root and must not build a second Spanish page beside it.

This is supported reading practice with a supplied note and glosses, not a Spanish assessment, placement or proficiency claim. Observations carry `language: 'es'` and never affect English or French suggestions, starting choices or the atlas's English and French evidence.

## Experience

Route `#mercado`. Link it from Home beside the French entrance, labeled **The River Market (Spanish)**, and from each Spanish riddle card's answer view in [94](94-riddles-in-the-hedge.md) (the cards whose strand is `spanish`). The destination is open from the start.

Order on the page:

1. **Arrival.** The companion's opening screen on a first visit; **Later visits** once a `spanish` root exists. Then the errand list (heading **Errands**) with one entry, *La carga*, and its label: **Not started**, **Started**, **Done**, or **Done before** when an earlier finished try exists.
2. **Passage amount.** **How much would you like to read?** with **Short sentences** (default) and **A longer note**, as native pressed buttons. The choice is saved per explorer. Once *La carga* is started, its note keeps the amount it started with, and the control says so (exceptions table).
3. **The note**, in full, in Spanish (`lang="es"`), beside a drawn landing scene: the barge, three buildings (*el café*, *la panadería*, *el jardín*) and the landing with the cargo. The note stays visible through the task and the question. At 320 px the note sits above the scene; at 820 px and wider they sit side by side.
4. **The task.** The companion's prompt. Tap an item on the landing (it shows as picked up), then tap a building to place it there. Tapping a placed item picks it up again, so any placement can be moved. Short note: five items (three honey jars, two flour sacks). Longer note: six (plus the seed box). Every item and building is a native button with a text label, `aria-pressed` for the picked-up item, and a visible text marker as well as its pressed style, never color alone. **Done unloading** submits the placement. With items still on the landing it records nothing and shows the exceptions table's line. Otherwise Marisol answers: the all-in-place line, or one line for each item kind and wrong building, in the companion's order. The child can move items and press Done again.
5. **The question**, shown after the first submitted Done unloading, whatever its outcome: **¿Cuántos tarros de miel hay?**, three Spanish choices in the order *dos*, *tres*, *cuatro* (the fitting choice is second in both amounts, as 117 lists). A non-fitting pick shows its nudge, stays selected, and the child can pick again.
6. **Done.** The errand is done when its latest placement is all in place and the question's latest pick fits. Done shows the panel-resolved boat-name line from Marisol once, after the first errand is first done, and **Start again** (exceptions table).

**Support**, available throughout and recorded as support:

- **What does it mean?** opens the English gloss under each sentence. A second control, **Word by word**, opens the companion's word list for this note. Using either marks the errand's task and question as supported, before any gloss shows. So does every other path to English for this errand: feedback English on request, *Mi cuaderno* and the grown-up Details notes. Support and hint exposure only ever turn on within an errand, and later help does not rewrite the support kept with its first submission. Narration is recorded as requested support, not verified listening; sentence-at-a-time use is recorded separately.
- **Hear it** reads the note with a local Spanish browser voice (`es-*` with `localService === true`), never an English fallback. With none, show the companion's no-voice line. **Stop** stops it. Extend `play-media.mjs` so that `language: 'es'` works like `'fr'` in `hearButton`, `spoken`, `localVoices`, `chooseLocalVoice` and the voice settings list, without changing English or French behavior.
- **Read one sentence at a time** highlights one sentence in turn, with **Next sentence** (exceptions table) and Stop.

The small label **Read with English help** appears on the errand once meaning support was used.

***Mi cuaderno · Words you've met*** is a view on the same route, opened from a button and closed with **Back to the errand**. It lists the companion's *La carga* phrasebook words, grouped under the errand's name, each with its article and English from the word list. Its title claims only that the words were met. It holds three Details notes, each linked from the errand: **El, la, los, las**, **Hay** (linked from the question) and **Sounds** (linked from the note, for *harina* and *jardín*). The words appear once the note has been opened; before that the view says so (exceptions table).

The off-screen invitation is the companion's first one (labels for three things at home). The grown-up notes use the companion's Details paragraph and the line in the exceptions table.

No timer, score, lock or unlock. The child can leave and resume at any point.

## Text

All Spanish, glosses, nudges, Marisol's lines, words and notes are the 117 companion's, **as amended by the panel resolution**. That includes the separate English lines for the seed box, and the revised boat-name line. Commission additions, in English:

| Where | Text |
| --- | --- |
| Done unloading with items on the landing | Some things are still on the landing. Put each one where the note says. |
| Amount control, once started | This errand keeps the note it started with. |
| Start again (after done, or any time from a started errand) | Start again |
| Start again, after it runs | A fresh copy of the errand is ready. Your earlier try is kept in your notes. |
| Second meaning control | Word by word |
| One-sentence reading | Next sentence |
| Mi cuaderno, before any note is opened | Open a note, and its words will appear here. |
| Mi cuaderno, close | Back to the errand |
| Picked-up item marker | picked up |
| Placed item, accessible name | {item}, at {place} |
| Grown-up line | River Market (Spanish): La carga {done / started / not started}{, with English help}. |
| Mi cuaderno English for phrasebook words the word list doesn't gloss | el café: café · la panadería: bakery · el jardín: garden · dos: two · tres: three |
| Unknown Spanish root version | This River Market notebook uses a format this version cannot read. Your work is kept in your notes download. The rest of the garden is open. |
| Unknown-version Notes link | Download your notes |

A source check confirms that every newly authored River Market Spanish line and gloss matches the resolved companion exactly, every newly authored English string is in the companion or this table, and none of that copy has an em-dash. Unchanged shared explorer, navigation, Notes and speech-control copy stays owned by its existing module. Spanish speech labels and status messages reuse the existing speech templates with the language name "Spanish". This slice adds no Spanish preview passage; Try this voice previews the current frozen note.

## Saved work

Optional root `spanish` per explorer, using 117's shape for the one errand. It stays absent until the first explicit write: choosing an amount, or opening *La carga*'s note. Rendering, viewing *Mi cuaderno* or reading the opening screen makes no write.

```
spanish: {
  v: 1,
  amount: 'short' | 'longer',
  errands: { carga?: Errand },  // {} after an amount choice; carga appears when its note opens
  earlier: [Errand],          // newest last; bounded by the whole-notebook limits
  nextTry: n,                 // next try id, from 1
  boatLineSeen: bool
}
Errand: {
  tryId: n,                   // positive integer, unique within this root
  source,                     // complete frozen errand source, ≤ 48 KiB
  task: { placements: { [itemId]: placeId | null } },
  taskEvidence: { firstSubmission: { placements, outcome, support } | null, submissions: n, hints: [feedbackId] },
  answer: { picks: [choiceId], fitted: bool } | null,
  support: { meaning: bool, narration: bool, oneAtATime: bool },
  state: 'started' | 'done', familiar: bool, at
}
```

- **Frozen source.** Opening the note freezes the whole errand at the current amount, following spec 83: version, amount, passage sentences with glosses, word list, items (ids, kinds, labels), places, the target place of each kind, every feedback line with its id and English, the question, choices with ids, order and fitting id, nudges, and the check rules. The source also holds the phrasebook membership and its bilingual entries, the three Details titles and texts, and the boat-name line in both languages. Resolve every action, check and display from this source, including on resume; shared navigation and control chrome stays current interface copy. Never look up today's content or key. An id or version alone is not a source. A content change affects only a newly started errand.
- **Evidence.** The first submission (placements, outcome and support at that moment) is kept once; later submissions change the working placements and the count. `hints` is the bounded set of feedback ids exposed, set before the line is shown, never cleared on resume, and limited to ids in the frozen source. The question keeps each pick in order and whether the latest fits. Task and question outcomes stay separate, with no single correctness flag. A task never submitted is unobserved.
- **Try ids.** Each newly opened errand takes `tryId` from `nextTry`, which then increases; ids are never reused, so a later story receipt can name one try without an array index. Validation does not renumber or repair ids. A duplicated `tryId` makes both records ineligible for such a receipt while they stay readable here.
- **Start again** moves the current errand, unchanged, to the end of `earlier`, and freezes a fresh source at the current amount, so a child who started with short sentences can read the longer note. `familiar` is true when any retained earlier *La carga* has an opened note, finished or not; decide it when the fresh errand starts and never rewrite it on load. "Done before" still means an earlier finished try. A fresh errand after Start again is a new practice attempt, not evidence of a first independent encounter. Start again and every question pick are preflighted against the whole-notebook and real Notes-export limits like any other write; a refusal leaves the notebook unchanged, and no earlier try or pick is dropped to make room.
- **Validation and preservation.** Validate ids, bounded shapes and stored outcomes, without regrading history. An unreadable errand shows the companion's unavailable line and stays raw and exportable, and the rest of the page stays open. An unknown root version stays raw, with the exceptions table's explanation and Notes link. Preflight every explicit write, cloning the notebook and checking it against `dist/progress-limits.mjs` and the real Notes export, before committing. A refusal shows the capacity line and leaves the previous save unchanged.
- Notes export, import, reset and explorer switching carry `spanish` through the existing transfer. Add `spanish: 'The River Market (Spanish)'` to `progress-transfer.mjs`'s destination names.

## Integration

New modules `dist/river-market-content.mjs`, `-core.mjs`, `-ui.mjs` and `river-market.css`, plus a drawn landing-scene SVG. In `dist/app.mjs`, add the exact `#mercado` branch with the current exact-route conventions (explorer initialization, switch, restoration, welcome-film exclusion and route cleanup, as spec 320 lists them), the Home link, and `riverMarketNotes(state)` in the ordinary Notes assembly. That function must return safely for any JSON value at `spanish`. Add one link in `riddles-ui.mjs`. Extend `play-media.mjs` for `es` as above. Declare `#mercado` as a scoped Spanish-reading game entry in `curriculum/atlas.json`, with no Marble topic reference, and regenerate `docs/learning-atlas.md`. Add a README entry.

At 320×600, 820×1000 and 1024×768: no horizontal page scroll; 44 px targets; visible keyboard focus. The note, the items still on the landing and the three buildings are visible together while the task is in progress at 820×1000, once the task is scrolled to. Page and view changes move focus to the new heading. A placement returns focus to the placed item's button, and Marisol's line is announced in a polite status region. Reduced motion uses the same steps, with no automatic animation.

## Upstream study and curriculum place

**Jane**, refreshed 2026-10-31 at `e88f81a00553fb87818ef84c77a8800f0dcb33e4`: `LESSONS.md` puts a short teaching encounter before guided practice and uses misconception-specific responses. This slice studies that order: read Marisol's note beside its cargo, use the glosses and Details notes, place the goods, then answer the question. Feedback distinguishes the item kind and destination. It does not import Jane's grading, bosses, medals, mastery or access rules. No Jane code or lesson text is copied.

**Marble**, refreshed 2026-10-31 at `5e23196fa60050433f1440057f65a978d39e63fc`: `data/topics.json` still has no Spanish language domain. This remains the original Spanish extension described in [117](117-spanish-river-market.md#curriculum-fit) and the [explicit extension pathways](../six-act-strands.md#explicit-extension-pathways-outside-marble): familiar words and phrases, then purposeful short sentences, with an optional longer supported note. Language amount is chosen independently of English and French work.

Two English topics are design references only: Question Words `mt_6lHBTwQPrS` (strand E2) for recognizing what kind of information a question requests, and Listening and responding `mt_mB7DVai-Uf` (E5) for the distinction between a playback request and an observed response. Neither becomes a Spanish or English attainment claim. The quantities are supplied M1 context, not an arithmetic task; the market exchange (L1-II) is the setting, and placing cargo is not evidence of trade or financial judgment. Add the Spanish encounter to the atlas without a Marble topic reference or taxonomy pin change.

**Teaching contract ([49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)).** The target is to use a supplied practical Spanish note to choose a destination and retrieve its honey quantity. The teaching encounter is the note with its labeled scene, optional sentence meanings, word list and *El, la, los, las* / *Hay* notes, before the corresponding response. The contrasts are one cargo kind versus another, the intended destination versus its current placement, and a quantity question versus a place instruction. Supported practice is reversible unloading, the supplied three-choice question and the three recorded support tools. A new use is available in the longer note, which adds the seed box while retaining the honey and flour relations. This is supplied practice; a restart is familiar, and changing amount does not establish independent transfer. Return means resuming the current errand or explicitly starting another try with either amount, while keeping the earlier source and first submission in Notes. There is no separate worked example in this slice; a purposeful revisit carrying a kept artifact is deferred to later errands or the story adapter using `tryId`. Spanish riddle answer cards also offer an open return link. Later errands remain separately commissioned. The data boundary is the typed structure above, with no learner-authored text, microphone or audio recording.

**Acts and chapters.** This is the floating market in [49's Act III](49-six-act-curriculum.md#iii-beyond-willow-bridge--connection-and-transfer) and [120's Act III chapter 1](120-keeper-of-the-ways.md#act-iii-beyond-willow-bridge). It serves the story's reciprocal exchange setting, but this slice issues no chapter offer or receipt and changes no act state. Standalone entry is open regardless of story position; the story adapter is a later build.

**Hard-prerequisite crosswalk ([49 §8](49-six-act-curriculum.md#8-existing-plans-bounded-next-increment-and-delivery-order)).** There is no Spanish topic in the vendored graph, so there is no Spanish hard edge to claim as met or to turn into an entry gate. In `curriculum/marble/dependencies.json`, neither English reference above has a hard prerequisite; Question Words has the soft prerequisite Listening and responding. Those English skills are not presumed from a Spanish answer. The Spanish words and relations needed here are supplied in the frozen note, labels, glosses and phrasebook; a grown-up may read with the explorer. Free listening, speaking, unaided word reading and general number knowledge remain unobserved.

## Acceptance

1. Pure checks:
   - Both amounts complete, each with its own items.
   - Every wrong-place line, in companion order, deduplicated by kind and place.
   - Done unloading with items left records nothing.
   - The fitting choice is second, and every nudge is shown.
   - Meaning support marks the task and question as supported, including after resume.
   - First submission and hints stay separate from the final fit; an untouched task stays unobserved.
   - Start again moves the errand to `earlier` exactly; earlier tries and question picks are never truncated, and a real capacity refusal changes nothing. Restarting an unfinished, supported errand keeps it exactly, marks the fresh one familiar and uses the currently selected amount.
   - A frozen source resumes unchanged after the content module's keys, wording and order change.
   - Unreadable and unknown-version records stay exact.
   - A real-transfer refusal leaves the whole notebook unchanged.
   - Rendering and Notes make no write.
   - The source check described under Text.
   - Absent and amount-only roots: no write from arrival or an unopened *Mi cuaderno*; the amount alone is saved and resumed, with `errands.carga` absent until the note opens.
   - Support is set before every English-help display; narration and sentence-at-a-time use persist; the first submission's support never changes; hint ids are set before the line shows.
   - Latest placements and latest question pick change independently, and Done needs both to fit; the boat-name line shows once.
   - Removing or changing current content ids, quantities, keys and phrasebook membership leaves retained work on its own source; one unreadable errand leaves readable siblings open.
   - Spanish records leave English and French suggestions and evidence unchanged.
2. Native browser journeys at the three viewports:
   - Real taps and the keyboard place, move and submit.
   - The pressed marker is visible, along with 44 px targets and no overflow.
   - The note stays visible through the task.
   - The question appears after the first Done.
   - Mi cuaderno opens and closes, and the words appear after opening.
   - Hear selects only `es-*` voices, with a stub voice list for no voice, one Spanish voice, and only English voices.
   - Save, reload, Notes download and import, reset, saving off, two explorers, stale controls after navigation, and a forced preflight refusal.
   - Inspect rendered screenshots of the scene, not only the source.
   - Home and all six Spanish-riddle answer links, exact-route entry, explorer selection, import and reset navigation, and the welcome-film exclusion; a suffixed route is not the market route.
   - A non-fitting pick stays selected and can change; every help path; the unknown-version explanation and Notes link; focus after page, view and placement changes; polite feedback announcements; reduced motion.
   - Hear rejects a nonlocal Spanish voice as well as English-only voice lists.
3. The existing riddles, French, Paris and speech regressions stay green, and the source runner passes. This is followed by independent review of the exact candidate and the repository's landing procedure. Physical iPad, VoiceOver and audible Spanish speech stay unqualified until checked.

Later slices, separately commissioned: *El camino* (with the directions note), *La receta* (with the two tortillas), *El tiempo* (with *va a* and *mañana*), *Una postal* and its reply, and the remaining grammar notes. Each reuses this root and route, and its Spanish stays bound to the panel-reviewed text revision. Any changed line needs a new panel pass.
