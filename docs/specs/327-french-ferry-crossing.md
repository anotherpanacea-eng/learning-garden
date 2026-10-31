# 327 · Le bac: a French ferry crossing to listen to and answer

Proposed 2026-10-31. Base inspected: `9c38e25`. Backlog card LG-21, from the roadmap's priority 4 ("purposeful French situations with reviewed listening/production"). **Specification, not implementation or release clearance.** The complete finite text is in [the 327 companion](../content/327-french-ferry-crossing-text.md). Its French needs the three-provider panel set out in [117's language review method](117-spanish-river-market.md#language-review-method--owner-decision-2026-10-30) before build, recorded in `docs/reviews/327-french-panel/`.

## The missing concept and its contrast

The garden's French so far is read: Paris errands, the house plan (221) and its missions (226). The child reads a passage, then acts on it. Nothing asks them to understand French they **hear**, or to **say** French to someone.

This slice teaches one idea: **a question word tells you what kind of answer to give.** *Où ?* asks where you are going. *D'où ?* asks where you are coming from. *Combien ?* asks how many, and *À quelle heure ?* asks at what time. It has two contrasts:
1. ***Où* versus *D'où*.** One small sound changes the question, and the answer changes from *À ...* to *De ...*.
2. **Numbers that sound alike.** *Deux, dix, douze* and *trois, treize, trente*, heard in a real answer.

The situation gives these a purpose. Madame Roux, a ferry keeper, asks each traveler four questions before they board. The explorer answers her out loud, using Dot's note for the facts. Then the explorer asks one question and listens for the answer.

Out of scope: other situations, free spoken answers, typed French, recorded French audio, and any story or Les Saules link. The ferry is an unnamed French river crossing, not a place in the story. A later story slice can link it only with a new panel pass. The French reading activities are unchanged.

This is supported listening and speaking practice, not a French assessment. It makes no fluency, pronunciation or comprehension claim.

## Experience

Route `#bac`. Link it from Home beside the French entrances, labeled **The ferry crossing (French)**, and from the `#learn/french` page. It is open from the start.

1. **Arrival.** The companion's opening. Then the **Crossings** list with two entries, each with its label: *Le bac du matin* and *Le bac de l'après-midi*. Both are open, in any order.
2. **Teaching.** The **Question words** card shows before the first crossing on a first visit. It has a link to itself and to **Numbers that sound alike** at all times. Every French line on both cards has **Hear it**.
3. **A crossing**, one step at a time, with Dot's note in English visible throughout. Steps 1 to 4 each go like this:
   - **Listen.** **Hear Madame Roux** speaks her question. Her words stay hidden, with the companion's "Listen first" note and a **Show her words** control. **Hear her again** replays it as often as wanted.
   - **Answer.** Six answer cards, in the companion's fixed order. The same six stay on screen for all four steps, and none is removed after use, so the last step isn't given away. A pick that doesn't fit shows the companion's feedback line for its case, stays picked, and the explorer can pick again. One feedback line shows per pick: the *À*-for-*D'où* or *De*-for-*Où* line first, then the wrong-kind line, then the right-kind-wrong-detail line. In the wrong-kind line, {question word} and its meaning come from the step's frozen kind (*où*: where you are going; *d'où*: where you are coming from; *combien*: a number; *à quelle heure*: a time). In the right-kind line, the detail is how many for *combien*, the time for *à quelle heure* and the place for *où* or *d'où*. Step 5 uses only the sounds-alike line. Listen, Answer and Say it name the flow here; they aren't extra interface labels, and any visible step heading needs an exact companion entry first.
   - **Say it.** After a fitting pick, the saying step shows the card with **Hear how it sounds**, then **I said it** and **Not this time**. Either button moves on. Neither is required for the crossing to count as crossed.
4. **Step 5, your turn to ask.** The prompt and the question to say, with **Hear how it sounds**, **I said it** and **Not this time**. Then **Hear her answer** speaks Madame Roux's reply, with her words hidden as in steps 1 to 4. Three choices follow, with numbers that sound alike, using the companion's exact labels and order: clock faces with the time in text in the morning crossing, and euro amounts in the afternoon. A pick that doesn't fit shows the sounds-alike line.
5. **Ending.** Madame Roux's closing line. The crossing is **Crossed** when steps 1 to 5 each have a fitting latest pick. **Start again** is offered then, and at any time from a started crossing.

**Support**, recorded as support:
- **Show her words** reveals the French text of the current line. It is marked on that step before the text shows.
- **What does it mean?** shows the English for the current line and the six cards. It is marked before any English shows.
- **Hear her again** and **Hear how it sounds** are counted but are not support. Listening again is part of listening.

**No French voice.** French speech uses `hearButton`, `localVoices` and `chooseLocalVoice` in `play-media.mjs` for `fr`, with a local French voice only and never an English fallback. A saved voice choice that is unavailable counts as no voice, as the host already does; it never switches silently. Availability is checked when the page renders and again when the voice list changes. With no usable French voice, every listen control is replaced by the companion's no-voice line, and Madame Roux's words show without marking `wordsShown`, since the explorer didn't ask for them. The crossing still works as a reading task.

No microphone, recording or speech recognition. **I said it** records only the explorer's own choice of button. No timer, score, lock or unlock.

## Saved work

Optional root `frenchFerry`, per explorer. It stays absent until the first explicit write: opening a crossing's first step, or the first support or Start again. Rendering, opening a card and **Hear it** on a card make no write.

```
frenchFerry: {
  v: 1,
  crossings: { morning?: Crossing, afternoon?: Crossing },  // only opened crossings
  earlier: [Crossing],        // newest last; bounded by the whole-notebook limits
  nextTry: n,                 // next try id, from 1
  taughtSeen: bool
}
Crossing: {
  tryId: n,                   // positive integer, unique within this root
  source,                     // complete frozen crossing source, ≤ 32 KiB
  voice: bool,                // a local French voice existed when the crossing opened
  steps: [{                   // five entries, in order
    picks: [cardId],          // in order; bounded by the whole-notebook limits
    fitted: bool,             // latest pick fits
    wordsShown: bool, meaning: bool,
    listens: n,               // Hear Madame Roux / Hear her again / Hear her answer, saturates at 99
    modelListens: n,          // Hear how it sounds, saturates at 99
    speechStarted: bool,      // French speech started for her line while her words were hidden
    said: 'said' | 'not-now' | null
  }],
  state: 'started' | 'crossed', at
}
```

Opening a crossing freezes its whole source, following spec 83: version, Dot's note, the six cards with ids, order, English and kind, each step's French, English, kind and fitting card or choice, every feedback line with its id, and the ending. Every action, check and display resolves from the source, including on resume. Never look up today's content. A content change affects only a newly opened crossing.

Otherwise the rules are 324's, with these names: try ids from `nextTry` and never reused; **Start again** moves the crossing unchanged to the end of `earlier` and opens a fresh frozen source, and no earlier crossing or pick is ever dropped to make room; validation without regrading; unreadable or unknown-version records kept raw and exportable; and every explicit write preflighted against `dist/progress-limits.mjs` and the real Notes export. A refusal leaves the previous save unchanged. Notes export, import, reset and explorer switching carry `frenchFerry` through the existing transfer. Add `frenchFerry: 'The ferry crossing (French)'` to `progress-transfer.mjs`'s destination names.

`voice` is fixed when a crossing opens and records only whether a usable local French voice existed then; it is not evidence that speech played. If a voice appears or disappears later, the controls follow the device, but the stored `voice` doesn't change. `speechStarted` is set only by the host's existing `garden-speech-start` event from that step's Madame Roux control while her words are hidden, under the same route, explorer and preflight guards as any write. A click, an accepted request that never starts, a playback error, the voice preview or **Hear how it sounds** never sets it. Notes report "French speech started with her words hidden" only when `speechStarted` is true and `wordsShown` is false. That records a playback start, not that anyone heard or understood. Counts saturate at 99 without blocking playback, and neither count is support.

Opening the first crossing creates only that crossing and sets `taughtSeen:true` in the same write; until then the teaching card shows without any write. The frozen source also holds the crossing's id and title, each step's id, and step 5's prompt, supplied question, choices with ids, labels, order, clock or euro values and text alternatives. **Crossed before** means a retained earlier crossing with the same id is crossed. A restarted crossing is familiar practice, not a first independent attempt.

## Integration

New modules `dist/french-ferry-content.mjs`, `-core.mjs`, `-ui.mjs` and `french-ferry.css`, using the French page palette. The clock faces in step 5 of crossing 1 are drawn SVG with the time also in text. In `dist/app.mjs`, add the exact `#bac` branch with the current exact-route conventions: explorer initialization, switch, restoration, welcome-film exclusion, route cleanup and `routeHeader`. Also add the Home link and `frenchFerryNotes(state)` in the ordinary Notes assembly. That function must return safely for any JSON value at `frenchFerry`. Add one link in the `#learn/french` page. Declare `#bac` in `curriculum/atlas.json` beside the other French entries, with no topic reference, and regenerate `docs/learning-atlas.md`. Add a README entry.

At 320×600, 820×1000 and 1024×768, the rules are:
- no horizontal page scroll;
- 44 px targets and visible keyboard focus;
- Dot's note and the six cards visible together during steps 1 to 4 at 820×1000, once scrolled to;
- step changes move focus to the step heading;
- feedback is announced in a polite status region;
- French text carries `lang="fr"`, and speech stops on navigation and on step change;
- reduced motion uses the same steps, with no automatic animation.

## Upstream study and curriculum place

**Jane**, refreshed at `e88f81a00553fb87818ef84c77a8800f0dcb33e4`, studied only. Its `LESSONS.md` teaches before practice, then guides, then lets the learner try alone, with misconception-tagged wrong choices. This slice follows that order: the teaching card, Dot's worked example, then the crossings. The feedback lines are tagged by misconception: wrong kind of answer, right kind but wrong detail, *À* for *D'où*, *De* for *Où*, and a number that sounds alike. It does not adopt grading, medals, gates or mastery. No Jane code, prose or assets are copied.

**Marble**, refreshed at `5e23196fa60050433f1440057f65a978d39e63fc`. As 221 found, Marble has no French language domain, so no French topic is claimed. Two English topics were studied for the idea only, and they are not claimed as French competence: Question Words `mt_6lHBTwQPrS` (E2, Grammar & Punctuation) and Listening and responding `mt_mB7DVai-Uf` (E5, Speaking & Listening). Both are *not yet mapped* in `curriculum/topic-coverage.csv`. In `curriculum/marble/dependencies.json`, neither has a hard prerequisite; Question Words has one soft prerequisite, Listening and responding. There is no new atlas topic reference and no pin change.

**Spec 49.** This is the French extension pathway in [six-act-strands](../six-act-strands.md#explicit-extension-pathways-outside-marble), outside Marble's domains. It is not tied to an act or to a spec 120 chapter, and it adds no story milestone or prerequisite. Against 49's teaching contract (§5):
- **Target:** hearing a question word and giving the kind of answer it asks for.
- **Teaching encounter:** the question-words card, with sound under the child's control.
- **Contrast:** *Où* versus *D'où*, and the sounds-alike numbers.
- **Supported practice:** words on demand, meaning on demand, replay, and misconception feedback.
- **New application:** the second crossing changes the facts, the question order and the places.
- **Return:** either retained crossing can be reopened later, with its frozen questions and support, as familiar practice. A later story slice may bring the ferry back.
- **Data boundary:** no free text, no audio and no microphone. Stored fields are the ones listed above.

**Hard-prerequisite crosswalk.** No Marble topic is claimed, so no prerequisite gates this slice. The French it assumes is taught on its own cards. That covers the four question words, the numbers in its answers, and *Nous sommes* as a fixed phrase.

## Gates and acceptance

Before build:
1. An independent spec review of this spec and its companion.
2. The three-provider panel on the companion's French, under 117's method, with Madame Roux's *vous* and the number-sound notes named as questions.

Pure checks:
- Both crossings complete, each with its own facts and order.
- Every feedback case, in companion order, for each wrong card on each step.
- All six cards stay offered on every step.
- Support is marked before the words or the English show, including after resume.
- No step reports French speech started unless the host's `garden-speech-start` event arrived for it with her words hidden: never-pressed Hear, an accepted request that never starts, missing speech support, a playback error, an unavailable saved voice, non-local French voices and a voice appearing or disappearing mid-try all leave it false.
- **I said it** and **Not this time** never affect Crossed.
- Start again moves the crossing to `earlier` exactly and opens a fresh source; earlier crossings and picks are never truncated, and a whole-notebook capacity refusal changes nothing.
- Only an opened crossing exists in `crossings`; the first opening sets `taughtSeen`; replay counts stay separate from support and from speech started.
- The feedback order and substitutions above, for every step kind.
- One unreadable crossing leaves its sibling and other destinations usable.
- A frozen source resumes unchanged after the content module's ids, wording and order change.
- Unreadable and unknown-version records stay exact.
- A real-transfer refusal leaves the whole notebook unchanged.
- Rendering and Notes make no write.
- A source check confirms that every newly authored ferry string, including accessible names and status text, matches the panel-resolved companion exactly, with the substitutions above, and that none has an em-dash. Unchanged shared navigation, explorer, Notes and speech-settings copy stays owned by its module and is exempt.

Native browser journeys at the three viewports:
- Real taps and the keyboard through both crossings.
- The words hidden at first, then shown on demand.
- A stub voice list with no voice, one local French voice, and only English voices. Speech must never fall back to English.
- Save, reload, Notes download and import, reset, saving off, two explorers, stale controls after navigation, and a forced preflight refusal.
- Both entry links, the exact `#bac` route with suffixed hashes rejected, both explorer-initialization lists, the welcome-film exclusions, and speech stopping on step change and navigation.
- Focus moving to the step heading, polite feedback, `lang="fr"`, 44 px targets, no overflow and reduced motion at each viewport.
- Inspect rendered screenshots, not only the source.

The existing French, Paris and speech regressions stay green, and the source runner passes. This is followed by independent review of the exact candidate and the repository's landing procedure. Physical iPad, VoiceOver and audible French speech stay unqualified until checked.
