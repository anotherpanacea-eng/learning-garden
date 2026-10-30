# 310 · Three ways into Willowbank

**Commission, 2026-10-30:** the next consolidation step after the delivered science-view stability repair. Build one clearer Home screen: **Continue something**, **Follow a question**, **Explore town**. This changes navigation and presentation, not curriculum, placement, story achievements or save format. Separate held PR254/255 remain outside this branch until the owner lifts their hold.

## Problem and result

Home currently puts subject entry, amounts, arrival and the advanced desk before an introductory hero, followed by many full feature invitations. It takes roughly six tablet screens to scan. Its unconditional First Morning copy also contradicts a later story arrival. Existing activities and subject starting points work; learners need a clearer way into them.

The primary three controls must appear before their changing content. Keep the town visible as a place, reduce competing prose, and let a returning explorer reach both advanced subject work and playful visits without starting over. None of these three choices is a required sequence or recommended level.

## Design plan

Retain the app's local Andika typeface, existing garden scene and fictional companion portraits. No new font service, art generation, motion or account. Palette: deep garden green `#183f39`, rain blue `#abc4da`, leaf green `#c9dcd2`, flower rose `#ce777d`, sunlight `#e9b84a`, pale paper `#fffdf5`. Use these as the existing story's materials, not a new presentation-style selector.

One compact illustrated welcome is the memorable element. Text stays left-aligned with short lines. The three large native buttons form a continuous wayfinding row on wide screens, stacked on phones; do not style every destination as an equal promotional card. Give destination links small familiar symbols and plain labels. Keep settings in a quiet native disclosure after the active panel. Focus indicators and minimum 44px controls are mandatory. No automatic movement or hover-only information.

```text
[Willowbank welcome + small existing garden scene / guide]
[Continue something] [Follow a question] [Explore town]
[one visible panel with heading and real links]
[existing parcel / current neighbor invitation, when available]
[Choose a starting point / amounts / story / guide / replay]
```

The critique of an initial card-heavy approach is that it would simply put another dashboard above the old page. Replace the old parade of invitations on Home; retain their actual destinations. This is not the later Field Journal reskin.

## Three panels and local interaction

Use native buttons with visible labels, `aria-pressed`, and `aria-controls`, followed by three named regions with headings. Exactly one panel is visible; hidden panels use the native `hidden` attribute so their links cannot receive focus. Do not use tab semantics unless full tab keyboard behavior is implemented; ordinary buttons with Enter/Space are sufficient here. On an explicit panel switch, update only this local UI and focus the new panel heading with native scrolling. Do not save, navigate, record help/exposure or change activities when switching panels.

Keep the selected panel only for the currently open explorer/book object in this browser session, including a round trip to an activity. Reset it on reload, explorer/import/reset ownership change. Initially show Continue when it has any entries, otherwise Follow a question. An explicitly chosen empty Continue panel stays empty with the direction below. It must not silently launch a visit. No new persisted field, route history or inferred most-recent activity.

Every bound control must be owned by the current connected Home root, notebook object and explorer ID. A detached control or an old explorer's callback must do nothing. Existing activity-start and replay handlers are not ownership-guarded today. At binding time, wrap Home’s `data-start-path` and `data-film-replay` callbacks with captured connected Home root, element, notebook, explorer ID and route checks; leave non-Home behavior unchanged. A retained callback invoked directly, as well as a click on a detached button, must be refused after owner/root/route change. Keep `requestPath`’s waiting-visit confirmation inside that owned callback. The wrapper must be installed by the existing app binding sites so another bind pass cannot replace it with an unguarded handler. The local Home binder also guards panel buttons and native links; there is no global callback registry.

### Continue something

Heading: **Pick up an idea**. Body: **These places are open in your notebook. Choose one to return.** This is a list of retained work, not a claim that a lesson is unfinished, unassisted, mastered or most recent.

Derive a finite list without changing the book:

| Existing source | Entry and destination |
| --- | --- |
| Matching current garden visit, not marked closed | `Your garden visit` at `#storm/play`; if finished, `Your visit ending` at `#storm/end`. Preserve Paris/French source and the current visit ID. |
| Café current object with stage plate/total/stock and not served | `Your café order` at `#cafe`. Do not create a guest, reconstruct a recipe or change the question. |
| Version1 Post Office with current matching visit, not closed | `Your delivery` at `#post`. Completed deliveries remain revisitable; never label one unfinished merely because it is current. |
| Readable `loftState(book).draft` | `Your puppet show` at `#loft`, including edit/perform/audience states. |
| Readable current `linearView`, `evidenceVoiceView`, `motionView`, `frenchRoomsView` work | `Your math investigation`, `Your reading and writing`, `Your science investigation`, `Your French visit`, at `#learn/math`, `#learn/english`, `#learn/science`, `#learn/french` respectively. These routes without a requested lesson already use the current saved work. |
| A valid explicit `pathwayView(book, subject).goal`, when that subject has no current work entry above | `Your [subject] starting point`, using its retained, validated `goal.route`. This is the explorer's own choice, not an answer-based recommendation. |

Order the garden/Café/Post/Loft entries first, then Math/English/Science/French in subject order; a subject goal occupies that subject's slot if there is no current work. No timestamps or recency ranking. All present entries remain reachable; the controls for choosing another panel remain before the list.

Use existing **pure** views for the four subject units, Loft and remembered subject goals. Do not call `ensureGarden`, `currentVisit` or `currentPostOffice` inside the pure continuation reader: those normalize data. The first three rows need only guarded object/array/current-ID and display-stage lookups. They do not validate historic answers against today's content or establish resumability beyond the owning destination's existing recovery UI. Ignore a malformed/unsupported entry for this list while keeping other entries and the raw payload. Never close, delete or repair it here. Fixed navigation labels avoid rendering personal drafts on Home. Any retained route text must be escaped and pass the existing safe pathway route contract; do not create a new URL policy.

Empty text: **No place is open here yet. Follow a question, or explore town.** Keep the other two panel controls and starting-point link available. Unknown records are not graded as failure and never prevent browsing.

### Follow a question

Heading: **What are you wondering?** Body: **Choose a question. You can ask for help or try another.** Offer these four stable invitations, with no question randomizer or recorded response:

| Wording | Existing action |
| --- | --- |
| What does a tiny neighbor need? | existing `data-start-path="creature"` |
| Can a note help someone find the way? | existing `data-start-path="message"` |
| What makes a good hideaway? | existing `data-start-path="shelter"` |
| What changes when ice melts? | link `#science/ice` |

Retain the existing waiting-visit confirmation when one of the first three requests a different story path. No direct call to start a story may bypass that confirmation. Opening the panel itself does not select or expose an activity.

### Explore town

Heading: **Where shall we go?** Body: **Every place is open. Choose one and see what you can try.** Replace long promotional sections with a compact link list/grid. Preserve every destination previously promoted on Home: Café `#cafe`; Story Loft `#loft`; English Paris `#paris`; French Paris `#french`; Water Lab `#science`; Living Garden `#living`; Number Garden `#numbers`; all facts through12×12 `#facts`; Word Garden `#words`; Games Table `#orchard/games`; Keeper's Desk `#desk`; town stories `#town/remembers`; riddles `#riddles`; Willow Post Office `#post`; Storm Workshop `#workshop`; curiosity chooser `#explore`; story-path chooser `#storm`; Travelers’ Archive `#archive`; Bell Studio `#studio/bells`; Rhythm Studio `#studio/rhythm`. Remove `render()`’s extra Home-only Archive/Bell/Rhythm promotional tail when those compact links replace it. Add a plainly labeled `#pathways` subject starting-point link. Creature/message/hideaway actions remain in Follow a question. Existing global navigation and learning-map access stay unchanged.

No destination needs earlier answers, a story arrival, selected theme, assumed reading level, skill label, payment or completion credit. Use recognizable text alongside symbols; icons never replace the accessible name.

## Story, welcome and quiet options

Home must not say First Morning for every explorer. Use `arrivalView`/the existing story context, without inventing an earned ending:

- Explicit mended arrival: heading **Welcome to Willowbank.** Body **The first repairs happened before you arrived. There are new ideas to try together.**
- Explicit letter arrival: heading **A town full of possibilities.** Body **There are stories, questions, and neighbors to meet. Choose where you would like to begin.** Do not reveal the letter's text or call it read.
- Other supported actual story progress, and unreadable/future story context: heading **Welcome to Willowbank.** Body **Pick up an idea, follow a question, or find another way to help.**
- No story progress and no chosen later arrival: heading **The storm has passed.** Body **Our neighbors are safe. Will you help make the garden welcoming again?** No claim about school, age, grade or readiness.

The guide portrait/name and change-guide link remain. Welcome speech uses precisely the visible heading/body, with the label **Hear about Willowbank**. Do not claim a whole curriculum or infer support needs. Show the preference as **Saving is on in this browser.** or **Saving is off. Your place lasts while this page stays open.** Do not claim that a write succeeded merely because saving is enabled; the global storage warning remains authoritative if saving fails.

Render the supplied `parcelHome` and current `townInvitation` in a small story/news area outside the hidden choice panels. Keep all data attributes and existing blocked/reveal logic intact, including welcome-film masking, inherited Before-you-came context, explicit actual reading actions and close-focus targets. Do not relocate the Keeper's Page content itself or auto-read it. No actual/inherited achievement field changes.

An explicit chosen arrival retains one visible **Read your arrival recap again** link outside the disclosure. For other arrivals, the story chooser stays in the quiet options. A native **Choose how to begin** disclosure holds ordinary links to **Choose a starting point by subject** (`#pathways`), **Café and reading amounts** (`#begin`), **Where shall we join the story?** (`#arrive`, unless its chosen recap link is already shown), **Choose your guide** (`#companions`), **Grown-up notes** (`#notes`), and the existing `data-film-replay="welcome"` button **Watch the storm pass**. These options are for explorers too; do not gate them behind a parent password or call them a placement test. Subject choice, mathematical challenge, English/French amounts, story arrival, avatar and guide remain independent. Existing first-visit automatic storm-film policy and later-arrival suppression remain unchanged.

## Boundaries and implementation seams

A suggested `home-entry.mjs` owns the pure continuation derivation, finite copy/view and tiny local panel binder. `garden-ui.mjs:gardenHome` can delegate while preserving its public signature; add an optional explorer ID argument, supplied from `app.mjs:home`. The latter replaces its old top-level invitation composition and retains the current neighbor invitation. Wire the binder from the ordinary `bind()` seam with live notebook/explorer/root checks. Place one scoped `home-entry.css` link in the document head. These filenames are implementation guidance, not a new navigation registry/framework.

No server, tracking, new media, curriculum pack, global route registry, save migration, learner score, inferred ability or presentation-style choice. Existing legacy initialization on the Home route remains; the new derivation/render/panel switching adds **no** progress writes. Navigation into existing destinations retains their existing owned exposures and save behavior; do not claim that entering Café or a math lesson is write-free. The goal is active; held PR254/255 remain excluded. This UI repair studies existing local navigation/readers and does not incorporate upstream Jane/Marble code or content or add a learning capability.

## Acceptance and evidence

Before building, independently review this finite spec against the actual seams. Resolve material findings in the spec. After building, obtain independent Claude exact-head implementation clearance and run proportionate checks before the normal PR/merge/deploy pipeline.

- Source: pure/frozen-book tests for missing/default/known mixed work; all four current subject units and four independent remembered goals; finished versus closed garden visits; Café stage preservation; Post/Loft states; future/malformed roots and additive unknown fields. Check actual returned destinations and no book mutations, not just presence of words. Verify arrival copy for all three choices, actual progress and unreadable context; later arrival never becomes earned evidence. Include HTML escaping and retained-route safety.
- Native Chrome:320×600,820×1000,1024×768; three primary controls precede panel content and are visible initially; exactly one panel visible,44px targets, no sideways overflow, Enter/Space and native focus, settings disclosure, representative destinations including advanced units and French, actual first-visit film/replay and later-arrival behavior. Inspect screenshots for real text/scene balance. This is not physical iPad/Safari or VoiceOver qualification.
- Preserve realistic synthetic waiting Café plates, Post clauses/packing, a Paris visit, Loft dialogue, unit drafts/support/checks and unknown sibling data across Home/panel/destination return. A different question must still show the waiting-visit decision. Test two explorers, stale/detached controls (including a directly retained story-start callback and replay after explorer/route changes), actual Notes export/import, save-off and a bounded denied-storage case. Panel changes must perform zero saves; entering destination routes may retain their existing explicit effects.
- Replay affected existing starting-flow, story-arrival, Keeper/ending-film and unit/visit tests. No broad mastery or completed-course claim from passing UI tests.
- After merge, verify deployed assets against the reviewed merge and replay the bounded hosted UI. Keep documentation status separate from implementation and hosted acceptance.
