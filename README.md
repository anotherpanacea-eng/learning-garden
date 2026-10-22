# After the Storm

A playful, parent-guided world of connected investigations, stories, and making things. The Learning Garden is the first place to explore; Number Garden remains its mathematics destination. The repository keeps the `learning-garden` name.

[Try After the Storm](https://after-the-storm-learning.anotherpanacea.workers.dev/).

The opening visit, **First Morning**, has three independent entrances: follow a creature's trail, investigate a mysterious note, or imagine a shelter. Each path offers two reading, science, or mathematics tasks, an unscored design choice, its own ending, and an optional paper project. Mira, Rowan, and Ari are original fictional guides; guide and explorer-avatar choices are independent.

Visits can be paused, resumed, replayed, or left waiting while another path is explored. Existing Number Garden activities and records remain available at the same browser origin. All preferences, drafts, observations, and exports stay browser-local; saving off applies device-wide, while clearing can target one explorer or all explorers. No identity fields, uploads, analytics, live AI, or server-side learner records are used.

Number Garden now has a storm-recovery purpose: count saved seeds, plan 24 planting spaces, and compare lengths and borders. Its illustrated planning table connects existing open math activities to water, gathering, and the café. [Living Garden](https://number-garden-together.tastypeach3.chatgpt.site/#living) now offers renewable searches across nine authored settings: meet land snails, woodlice and adult butterflies, compare changing conditions, follow a delivery note, and count equal packs of café supplies. Small parcels and all ordered facts through 12×12 are open choices. The [original snail visit](https://number-garden-together.tastypeach3.chatgpt.site/#living/first) and its one-time parcel remain intact. This is guided picture investigation, not a field study or ecosystem simulator. New searches independently suggest deeper nature clues, note comprehension and parcel math from a few distinct finished tasks. Every depth stays open: use habitat evidence and before/after changes, follow sequences or infer a parcel from its contents, and find pack counts or plan tomorrow’s delivery. Help and narration remain separate from first-response matching, retries and familiarity. Paused older visits keep their original questions. [Spec 30](docs/specs/30-adaptive-living-garden.md) describes the conservative suggestion rules and limits.

## Full learning graph and next games

The [learning atlas](docs/learning-atlas.md) brings in the complete pinned Marble reference graph: 1,590 topics, 3,221 prerequisite edges, eight subjects and 54 domains. The [all-topic index](curriculum/topic-coverage.csv) distinguishes current scoped activity references, supplied explanations and topics not yet mapped. Seven reusable play patterns guide extensions and new games; proposed priorities include Word Workshop, field notebooks/food webs, café fractions and money, messages/map-making, historical evidence, sound/light creation and collaborative stories. These are authoring plans, not a required child sequence or claims of full-topic assessment. Geography, art, music and additional languages also need explicitly authored extensions beyond Marble's subject organization.

[Data provenance and licenses](curriculum/README.md) · [Current roadmap and release status](docs/roadmap.md). Rebuild or check the offline atlas with `node scripts/build-learning-atlas.mjs` or `node scripts/build-learning-atlas.mjs --check`. The larger reference graph does not change the live app's smaller map or learner saves.

The home page also offers **Watch the storm pass**, the optional 46-second film from [PR #8](https://github.com/anotherpanacea-eng/learning-garden/pull/8). Pip and Dot shelter their neighbors before the garden’s first morning. It starts on request and has pause/replay controls.

The introductory storm film opens automatically the first time each saved explorer visits this version. It starts silently, lets sound join at the current picture, and can be skipped at any time. Reduced-motion settings leave playback manual. The home-page “Watch the storm pass” link always remains available. With saving off or unavailable, the reminder lasts only for the current page session.

Three more short films celebrate story endings in the same way: *A Postcard Home* (32 seconds) when a Paris errand ends, *Welcome Back, Neighbors* (34 seconds) when the first café supper lights all six lanterns, and *Through the Ribbon Gate* (31 seconds) when Bramble’s gate is untangled. Each opens once per explorer, can be skipped, and stays available from a “Watch … film” link on that ending. Watching a film is not recorded as learning evidence. The Bramble film shows 3 × 4 as a story example, so it notes that fact as seen, which keeps a later 3 × 4 answer from counting as unseen.

The [strand-by-strand curriculum map](docs/strand-map.md) marks concepts, contrasts, game homes and revisits as Built, Planned or Missing, and identifies which additional game modes are needed.

The [dated curriculum spiral plan](docs/curriculum-spirals.md) records conceptual connections across familiar games, with checked Jane/Marble references and explicit gaps. The [current roadmap](docs/roadmap.md) holds the active queue and distinguishes merged code from the live site.

## Story Loft

[Make a little puppet show](https://after-the-storm-learning.anotherpanacea.workers.dev/#loft): make a pictured puppet show, optionally give each puppet original dialogue, perform one scene at a time and revisit an audience question. Shows begin with three scenes and can grow from one to twelve scenes. Pictures, Puppet words and Story order have separate task pages; longer shows remain optional. Dialogue stays local under the existing save settings and is included in notes downloads. There is no automatic grading or writing-level inference.

The show shelf keeps the latest twelve shows plus the draft. Strictly valid earlier three-scene saves adapt without changing their pictures, performance position or shelf; unsupported formats remain kept and exportable. See [spec 36](docs/specs/36-story-loft-puppet-theatre.md) and [growing stories and clear turns](docs/specs/37-growing-stories-and-clear-turns.md).

## Word Garden

Open [Word Garden](https://after-the-storm-learning.anotherpanacea.workers.dev/#words): combine ten word plants and six cuttings, grow 23 authored words, and keep other combinations as discoveries. Eight extra real words explain meanings and spelling changes; unauthored pairs remain separated letter experiments, with no invented pronunciation or false rejection. Eight open discussion cards include new words and a make-your-own invitation. This is word-part exploration with any amount of reading help, not a decoding or spelling assessment. Notebook and current choices stay with the active explorer. [Spec 34](docs/specs/34-word-garden.md).

The complete game, including Word Garden, is published on Cloudflare Static Assets. The earlier Sites address retains its earlier release. Browser-local notebooks belong to their address: existing progress stays at the old address; it is not automatically copied to Cloudflare. Use Grown-up notes → Bring progress from another site to import the old notes JSON file locally as a separate explorer; existing explorers are preserved. Move one explorer at a time and keep the original file until you have checked the import.

## Run locally

No installation or build step is needed. From this repository:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. Learning records remain browser-local. They do not sync between devices.

## Check the existing learning logic

With Node.js installed:

```sh
node test/field-kit-checks.mjs
node test/riddles-checks.mjs
node test/field-kit-integration-checks.mjs
node test/field-notebook-checks.mjs
node test/field-notebook-integration-checks.mjs
node test/sharing-counter-checks.mjs
node test/sharing-counter-integration-checks.mjs
node test/fraction-trail-checks.mjs
node test/fraction-trail-integration-checks.mjs
node test/bundle-exchange-checks.mjs
node test/bundle-exposure-checks.mjs
node test/bundle-exchange-integration-checks.mjs
node test/instruction-checks.mjs
node test/instruction-integration-checks.mjs
node test/rain-paths-checks.mjs
node test/rain-paths-integration-checks.mjs
node test/measuring-recipes-checks.mjs
node test/measuring-recipes-integration-checks.mjs
node test/whole-batches-checks.mjs
node test/whole-batches-integration-checks.mjs
node test/travelers-archive-checks.mjs
node test/travelers-archive-ui-checks.mjs
node test/travelers-archive-integration-checks.mjs
node test/plant-study-checks.mjs
node test/plant-study-integration-checks.mjs
node test/letter-trail-checks.mjs
node test/letter-trail-integration-checks.mjs
node test/message-checks.mjs
node test/message-integration-checks.mjs
node test/loft-checks.mjs
node test/loft-growing-checks.mjs
node test/progress-transfer-checks.mjs
node test/recovery-boundaries-checks.mjs
node test/word-garden-checks.mjs
node test/core-checks.mjs
node test/broad-checks.mjs
node test/broad-variants-checks.mjs
node test/paused-draft-checks.mjs
node test/broad-help-checks.mjs
node test/broad-model-checks.mjs
node test/explorer-storage-checks.mjs
node test/plantings-and-speech-checks.mjs
node test/mobile-quality-checks.mjs
node test/number-garden-story-checks.mjs
node test/living-garden-checks.mjs
node test/living-spiral-checks.mjs
node test/living-adaptive-checks.mjs
node test/garden-turn-checks.mjs
node test/story-checks.mjs
node test/help-checks.mjs
node test/cafe-checks.mjs
node test/cafe-start-checks.mjs
node test/science-checks.mjs
node test/workshop-checks.mjs
node test/post-office-checks.mjs
node test/post-office-ui-checks.mjs
node test/post-pagination-checks.mjs
node test/post-rival-checks.mjs
node test/post-rival-adaptive-checks.mjs
node test/post-rival-adaptive-ui-checks.mjs
node test/parcel-packing-checks.mjs
node test/parcel-packing-integration-checks.mjs
node test/courier-rival-ui-checks.mjs
node test/learning-invitation-checks.mjs
node test/learning-connections-checks.mjs
node test/cafe-expedition-checks.mjs
node test/cafe-supper-checks.mjs
node test/facts-checks.mjs
node test/forage-checks.mjs
node test/paris-checks.mjs
node test/paris-exploration-checks.mjs
node test/paris-saved-source-checks.mjs
node test/town-remembers-checks.mjs
node test/town-remembers-integration-checks.mjs
node test/story-pack-checks.mjs
node test/order-story-checks.mjs
node test/french-and-revision-checks.mjs
node test/french-exploration-checks.mjs
node test/storm-film-checks.mjs
node test/ending-film-checks.mjs
node test/equal-groups-checks.mjs
node test/equal-groups-integration-checks.mjs
node scripts/check-story-packs.mjs
```

These checks use synthetic observations. They check the application logic; they do not validate the assessment as an educational instrument.

For the Willow packing table's real browser journeys, install Python Playwright and Chromium, then run:

```sh
python test/parcel-packing-browser.py
```

This starts and stops its own loopback preview and uses isolated browser profiles with fictional waiting games. It checks desktop, tablet and phone viewports, keyboard/touch interaction, focus, both packing purposes and reload. Screenshots go to a temporary directory; use `--artifacts /tmp/packing-browser` to choose one. Set `CHROMIUM_PATH` if Chromium is not on `PATH`. This is Chromium emulation, not a physical-device or audio check.

## Roadmap and science expeditions

The [current roadmap](docs/roadmap.md) names the next reviewed increments and states what is merged versus published. The [earlier six-step roadmap](docs/roadmap-2026-10-22-pre-merge.md#delivery-sequence) preserves the original sequence for Water Lab, Willow Post Office, Storm Workshop, Word Workshop, Ecosystem Expeditions and Story Loft. Sky Post is the flying-courier adventure within Willow Post Office; the wider phonics and ecosystem-model sequences remain future work.

Science offers three guided water visits with optional predictions, a focused external Marble Water Lab link, self-reported observations, original controllable explanation pictures, and a discussion/project invitation. Each mission is independently available and can finish without an external visit or an answer. Link selection is not treated as visiting, experiment completion, or understanding. Explanation use and reported reading mode stay distinct. The latest 24 visits stay browser-local under the existing privacy controls; there is no tracking or data exchange with Marble. External application source/assets are not copied or embedded.

## Café discoveries and all multiplication facts

The [current café and fact-garden specification](docs/specs/07-cafe-expeditions-and-facts.md) adds the Cloud Orchard, three discoverable imaginary foods, and repair questions tied to the current dish. Food shapes and redundant quality symbols appear in the cupboard, on the plate and in repair choices. Discovery visits preserve waiting orders. Repeated collection cannot refill a jar. All eight original ingredients remain available so discoveries never lock a child out of a valid recipe.

New café orders can use every ordered guest/bite pair from 1×1 through 12×12; a small-order range stays openly available. Range changes affect the next guest. Existing saved orders and history keep frozen original parameters. The separate multiplication garden exposes all144 ordered facts, six-question mixed practice, arrays/equal groups, split strategies and optional reported methods. Reversed facts keep separate observations. Records distinguish reported recall, working out, counting, support, retries, prior encounters and unknown method; no speed or mastery label is inferred. Parent notes retain up to576 fact observations and disclose that bound. Progress stays device-local and follows the existing save/export/reset controls.

Read-aloud is optional and uses only voices for the passage language that the browser identifies as local. Voice & speed lets you choose and preview an available voice and adjust the pace. Automatic selection names the local voice it requests; its existing enhanced/natural name heuristic and device-default preference do not guarantee voice quality. An explicitly saved voice takes priority. If it disappears or has not loaded yet, the choice remains visible as unavailable and no replacement speaks silently. Choose another available local voice or Automatic, or refresh after voices load. A known choice for the other passage language leaves the current language on automatic local speech, with an explanation; it does not overwrite the saved choice. Preferences belong to the active explorer and reset with that explorer’s progress. Speech stops on navigation, reset, page hiding and page exit; returning requires another Hear or preview action. No microphone, external speech API or automatic narration is used. All activities work without sound.

Grown-ups: system speech settings and browser narration can expose different voices. On Mac, use System Settings → Accessibility → Read & Speak (Spoken Content on older versions) → System voice. On iPhone or iPad, use Settings → Accessibility → Read & Speak (or Spoken Content) → Voices, then the language. Preview installed voices there; if a free enhanced or premium download is offered, let it finish online. Return to the app, refresh its voice list, select a listed local voice and use Try this voice. If needed, save or download notes before reopening the browser or reloading. A voice available to Siri or Speak Screen, including a downloaded system voice, is not guaranteed to be browser-accessible. The app can name the voice requested through the browser API but cannot verify the sound the OS actually produces. If a preview sounds wrong, stop, try another available local voice or read together. [Apple Mac voice settings](https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac) · [Apple iPhone spoken text](https://support.apple.com/guide/iphone/hear-whats-on-the-screen-or-typed-iph96b214f0/ios).

[Mobile-quality evidence and pending real-device checks](docs/mobile-quality-evidence.md) distinguish cloud emulation from iPhone/iPad and Mac testing. With Python Playwright and sandbox-capable Chromium already installed, run `python3 test/mobile-quality-browser.py --evidence /tmp/garden-mobile-results.json` (use `--chromium PATH` for another installed executable). The test starts its own loopback server and uses synthetic progress and speech fixtures; it does not install a browser or call an external service. The static app's loaded routes can continue offline, but hosted offline reload or first visit is not guaranteed. A downloaded static copy served locally needs no internet.

## Gathering supplies

New gathering trips use a covered 4×4 orchard map. Small addition/subtraction clues identify a row and column; inspecting plots reveals their foods. Counter explanations can highlight the two clue lines, and finding their crossing opens the pictured equal-basket harvest. Map help is recorded separately from harvest help. Earlier matching-search trips keep their original rules when resumed. See [the orchard map hunt spec](docs/specs/09-orchard-map-hunts.md).

The [gathering specification](docs/specs/08-gather-the-cupboard.md) replaces instant restock controls and automatic top-ups. Every known ingredient has an orchard trail: explicitly start a trip, find the pictured food, count or get help with equal baskets, and pack the harvest into that one jar. Repeat trips are available; each trip supplies its harvest once. Gathering history retains 24 trips, and jars hold up to 180 bites. All gathering is guided practice, separate from reported fact recall. New guests are invited explicitly.

A shortage answer never creates inventory. Serving requires enough actual supplies and consumes them once. Waiting guests, recipes and inputs survive trips and reloads. The cupboard question keeps its original per-jar snapshot while showing current stock separately, so a gathering trip cannot reinterpret an earlier answer. Original saved orders/history and all privacy controls are preserved.

## Learning design and next increments

**The Paris Postcard** is a guided English-reading visit to an imaginary bookstall in real Paris. Six connected-text stops practice finding details, word parts, vocabulary in context, inference, textual evidence, and sequence, followed by an optional oral/drawn/dictated postcard. The source passage stays visible; sentence focus, smaller examples, and local read-aloud are optional. Read-aloud requests and sentence support remain recorded even after a later independent-reading report. All Paris tasks are practice-only and never fresh assessment evidence; no oral decoding accuracy, fluency, or reading level is inferred. See [the Paris reading spec](docs/specs/10-paris-reading-visit.md).

Paris also offers three freely chosen destinations: Lucie’s bookstall, the river walk, and the rooftop garden. Seven original errands each have two questions and three passage lengths (14 question prompts, 42 task versions). The next errand favors less encountered stories and suggests a passage length from recent work at that destination, while all lengths remain open. Help/retries can suggest shorter text; two independent first tries on different previously unseen stories can suggest longer text. Repeated stories, shared passages, supported reading, skips, and unknown reports remain distinct. Suggestions are approximate and finite, not reading levels. Frozen routes preserve paused errands across reloads; the original postcard path remains available. See [Paris exploration](docs/specs/11-paris-exploration.md).

The rooftop puppet show is the first [reviewed story pack](docs/story-packs.md). A plain-data module adds its passage variants, evidence question, tap-to-order cards, and helpers to the existing catalog. The validation command rejects malformed packs and conflicting IDs before publication. Partial card arrangements pause with the story, and exported attempts retain readable orders. New packs using these supported formats can be added without changing the engine. Its Marble connection covers sequence only, leaving central message and full retelling unobserved.

The opening introduces the shared story: neighbors are safe after the storm, and players can gather supplies, feed visitors, investigate water, follow messages, or imagine shelters. The café has a replayable, optional “Why we’re here & how to play” introduction, open at a fresh counter, with read-aloud and three short steps. The story introduction adds no completion gates or learner records.

The first visit is implemented. Its build scope and evidence boundaries are documented in [docs/first-visit.md](docs/first-visit.md). Story answer methods describe performance within a guided activity; independent reading is recorded separately and never inferred from a mathematical answer. Unscored project records mean an invitation was acknowledged, not that off-screen work was completed. Prior encounters, support, retries, and skips remain visible in the grown-up notes.

**The Almost-Right Café** adds a fourth entrance: find silly substitutes that fit two wishes, prepare equal portions, and work out a cupboard shortfall. Multiple suitable dishes are accepted. Its paper-menu project is optional and unscored.

The café also has an ongoing **Open the café** game: twelve imaginary regulars, including Clover the bunny, Ember the pocket dragon, and Purl and Biscuit the kittens, changing wishes, and eight starter jars of silly ingredients, plus orchard discoveries. Build a plate with the requested number of bites and qualities, count enough for the table, explore for each jar's shortage, and serve. Different mixtures can satisfy the same order. Serve six tables to hold a welcome-back dinner for neighbors returning from mending the garden after the storm. Each served table lights a lantern; the sixth brings a celebration and an OPEN sign. Help and supported arithmetic count equally. Keep serving continues freely; New Game Plus starts another six-table gathering with rotating moonlight, rooftop, and ribbon themes. Supplies, discoveries, number range, learning records, and any waiting order stay intact. Earlier saved service counts toward the first dinner. Guests keep arriving when invited; there are no timers, money, math scores, or failure penalties. Orders and cupboard stock pause locally. From the multiplication question, Change my plate reopens the same plate while preserving the guest, order quantities, number input, attempts, and support. Recheck the revised plate to return to multiplication. Pictures, arithmetic support, and skipped questions are recorded as practice, never fresh assessment evidence. The notebook keeps the latest 24 orders; the current order is separate. See [docs/replayable-cafe.md](docs/replayable-cafe.md).

Every scored story task now offers a smaller parallel example with a tap-controlled text spotlight, counters, ruler, comparison, or menu. The original question and answer stay waiting. Help is recorded separately and remains support after returning; example success never advances the original task. See [docs/responsive-help.md](docs/responsive-help.md).

Future increments can add follow-up adventures, reviewable content packs, and private cross-device continuity. [Jane](https://github.com/kentlangley/Jane) remains a useful reference for lesson packs, spaced review, and continuity. The story-pack compiler adapts a small MIT-licensed validation helper from Jane; its ordered-items convention informs the tap-to-order activity. No Jane lesson prose or learner data is included. [Concrete Jane and Marble opportunities](docs/upstream-opportunities.md) identify reusable formats, publishing checks, vocabulary support, review invitations, and reading/science map extensions, with pinned sources and license boundaries.

## Paris en français

Open `#french`, or choose Explore Paris en français from the English Paris page. Nine new original errands visit the bookstall, river, and rooftops, with mysteries, practical decisions, music, photography, and art. Each has three authored text choices (short sentences, more connected text, a short paragraph) and two comprehension challenges: 27 passages and 54 task versions. Three stories include tap-to-order actions. The original three short French errands and their IDs remain available.

The next story at a place favors fewer displayed encounters. French practice across the three places suggests an amount of text: begin with short sentences; help or retries can suggest less; two first-try first questions on different new stories, reported independently read without support, can suggest more. Manual story/text choices stay open. Skips and unobserved reading do not lower suggestions; second questions, repeated stories, and different variants of a familiar story cannot manufacture new-story evidence. The two questions retain the same comprehension targets across the three versions; the language/context load changes. This is not a French level or age/grade estimate.

Full passages, sentence focus, English meaning/vocabulary help, and skill-matched smaller examples remain available. Translation support follows both questions on a passage, including after reload. Local French narration never falls back to English. Frozen routes preserve partially arranged cards and paused stories. French records and suggestions stay separate from English Paris and legacy French work. This is a finite, reviewed library, not generated stories or a full language curriculum. Anonymous explorer slots now keep each notebook separate; earlier shared play remains together in its original slot. See [spec 14](docs/specs/14-french-exploration.md) and the [initial French increment](docs/specs/13-french-paris-and-plate-return.md).

## Privacy and contributions

This repository contains generic source and curriculum content. Do not commit real learner profiles, names, ages or grades tied to a child, school or location details, family anecdotes, responses, progress, personalized packs, recordings, screenshots, exports, or credentials. Use clearly synthetic examples in tests and review commit metadata and attachments as well as files. See [CONTRIBUTING.md](CONTRIBUTING.md).

Deployment credentials, Cloudflare CLI caches and the earlier Site's hosting configuration are excluded. This repository is the development home. Reviewed static assets from `dist/` are published on Cloudflare; account configuration and credentials stay out of this public repository.

## Current Number Garden prototype

A small, parent-guided math prototype for exploring number sense, operations, fractions, patterns, geometry, measurement, and reasoning. Each area offers a two-question adaptive trail and three original story activities with editable visual models. A seven-area wander can pause between pairs. All activities remain open. The original multiplication check-in, six-fact practice sets, and puzzles remain available.

Serve `dist/` with any static HTTP server. There is no install/build step, external asset dependency, AI call, analytics, or application backend. The app fetches its bundled curriculum JSON from the same origin. This repository is hosting-neutral; the existing Site's configuration stays in its deployment checkout.

Progress is saved only in the browser's local storage. Grown-up notes provide a persistence switch, JSON download, and confirmed clearing for one explorer or all explorers. Saving off removes all app-managed saved copies across every area. New devices and browsers start fresh. Broad trails retain drafts, hints, attempts, and models across reloads. Original multiplication records and the existing storage key are preserved; original practice sets do not resume their uncompleted plan after reload, but recorded answers remain.

The first question in a trail leads to a further question after a first independent answer, a smaller question after support or another try, or an alternate question after a skip. Notes describe individual tasks rather than assigning a level. Activities are recorded separately as attempts after teaching. Prior encounters with questions and known multiplication pairs are retained across the old and new experiences; missing historical familiarity is marked unknown. Two skipped questions give a neutral activity suggestion. Small samples and fixed examples limit what can be inferred.

The parent-facing learning map uses a focused subset of Marble's actual prerequisite relationships. When an authored activity matches a connected topic, suggestions explain that link; otherwise a simple within-area suggestion is identified as such. No edge locks access or implies mastery. The map does not claim full curriculum coverage.

This is not a validated assessment, a comprehensive skills inventory, a grade-level estimate, or a class-placement recommendation. The adult and child select the observed method together; the app does not judge spoken explanations. Try different examples and representations on later days. Pip and Dot, stories, lessons, questions, and activities are original.

Curriculum: Marble Skill Taxonomy v1, © Generative Spark, Inc. (Marble), https://github.com/withmarbleapp/os-taxonomy, pinned commit `96a7933754af672e1bfdbf7ecb05c325860c6e0d`. `dist/marble-map.json` contains 87 topics and 92 relationships: the original 25 math focus topics and their direct prerequisites, plus ten limited science, data-display, English and computing activity connections and their direct prerequisites. Topic matches describe only the stated practice; context-only nodes have no attached activity. Selected age suffixes have been removed from names; descriptions and link reasons are retained. Database/subset: ODbL 1.0; Marble descriptive content: CC BY-SA 4.0. The map view links its downloadable data, pinned source, and both licenses. Further relationships outside the slice are disclosed.

Teaching reference: IES, Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades, https://ies.ed.gov/ncee/wwc/PracticeGuide/26. The prototype combines visual explanations, brief practice, flexible strategies, and interesting problems without timers or placement gates.

## License

Original application code and original activity content are available under the [MIT license](LICENSE). The bundled Marble curriculum subset and its descriptive content retain their separate ODbL 1.0 and CC BY-SA 4.0 licenses. See [NOTICE](NOTICE) and the attribution in the app's Learning map. The MIT license does not replace the licenses of that third-party data.

## Number Garden refresh

Specs 15–21 are implemented: matched and labeled teaching pictures; authored first encounters followed by seeded variants for all 49 math items; partial steps, targeted feedback and smaller parallel examples; direct tap/keyboard models with geometric folds and a compass; original illustrated Pip and Dot; and optional device-local, math-aware read-aloud. On phones, Pip's idea and model expand when wanted so the question appears first. Support, repeated examples and independent attempts remain distinct.

Anonymous explorer slots use a picture, color and symbol, with separate full-app progress and voice preferences. No names or other identifying fields are added. Legacy shared progress is copied without changing the original; unreadable saves are kept before replacement, and failed preservation writes leave the original untouched. Notes can download or remove kept copies. Saving off removes all app-managed explorer, legacy and kept copies on this device while retaining current sessions in memory. Clearing one explorer leaves the others intact.

Participation grows an original storm-recovery garden: finishing a walk or adventure, using a new kind of help, or acknowledging an open invitation can bring a plant or decoration. A skipped walk counts equally. Plantings never influence skill suggestions or become learning evidence. Open invitations include the seven areas' wondering prompts, estimates, defendable choices, different rectangles and counterexamples. All paths remain open.

Living Garden, the café and Bramble now offer **Carry an idea here** cards. A finished math task can suggest the same equal-group relationship with different objects, or a neighboring fact. Choosing a card starts a real guest, ribbon puzzle or equal-packs search; waiting work is protected, usual preferences stay unchanged, and each destination records its own actual responses. Source context, help/retries and unknown familiarity remain visible in grown-up notes. The café also offers unscored nature-comparison and reading-evidence conversations. See [spec 31](docs/specs/31-learning-between-games.md).

## Storm Workshop and connected adventures

Open `#workshop` to investigate the storm-damaged parcel ramp. Choose ramp height or landing surface as the changed variable, hold the other fixed, release the same cart without a push, and step it to the ramp’s foot and stopping point. Six authored configurations each cycle through three illustrative distances. These are model results, not measured physical data or a calibrated physics simulator. The ruler begins at the ramp’s foot; a table and a zero-based 0–30 bar graph show the same distances. Replaying changes no results or run counts.

Predictions and explanations are optional and unscored. Support and separately reported reading stay distinct. Paused trials retain exact settings, phase, result and model revision. Older unsupported models remain closed, readable work. The latest 24 comparisons and 24 completed trial rows per comparison stay local; counters continue after older rows are trimmed. Explorer switching, saving off, notes/export and reset apply as elsewhere.

Open `#explore` for the original connected-adventure directory. Workshop, Water Lab, café, orchard, English Paris and measurement/fractions activities offer contextual links. These are thematic invitations, distinct from Marble’s actual prerequisite links. Navigation preserves waiting activities. [Spec 03](docs/specs/03-storm-workshop.md) records model details, scoped connections and upstream study. [The earlier roadmap](docs/roadmap-2026-10-22-pre-merge.md#delivery-sequence) records the first Sky Post courier loop at Willow Post Office; girl witch, boy wizard and nonbinary sorcerer presets, a freely available ribbon example and Bramble’s optional rival challenge are implemented. Bramble’s generated challenges are implemented; the six real packing orders remain authored examples. Deliveries are the play; no play-credit gate is planned.

## Willow Post Office and Sky Post

Open `#post` to borrow a broom and take one of six original orders. Pack buns, ribbons, blankets, seed packets, flags or paper stars with pictured addition, subtraction or equal groups. Count the contents or choose Pack together; both keep the adventure open. These are six authored examples, not an adaptive fact library. Write a route by adding Go/Then/There/Give clauses, move or remove lines, and fly one instruction at a time across the four-landmark map. Extra stops are welcome. The courier asks for clarification when a place is missing or a parcel is offered to the wrong person, and stops after a valid handoff. Changing words resets only the route playback, keeping the order, parcel and attempts.

Choose a pictured girl witch (she/her), boy wizard (he/him), nonbinary sorcerer (they/them), or sky rider. Change the portrait or pronouns independently afterward. Courier choices stay local to Post Office; the garden explorer and guide stay independent. Legacy saves without an override retain their explorer portrait. An isolated smaller example, optional prediction and local narration support the delivery. Narration requests never establish listening or independent decoding. Reading reports and support flags remain separate, as do packing attempts and structured-composition checks. No writing, reading level, programming proficiency or multiplication mastery is inferred.

Pending input, bank selection, clauses, helper step, courier position and the frozen request survive pause/reload and explorer switching. Unsupported saves remain exact kept work. Latest 24 visits, 24 packing attempts and 24 route-check snapshots per visit are retained; replays do not add a second completion. Existing save-off, notes/export and reset controls apply. [Spec 02](docs/specs/02-willow-post-office.md) records the reviewed behavior and upstream study. Courier choices and Bramble’s first rival encounter are implemented in [spec 25](docs/specs/25-sky-post.md).


Meet **Bramble**, an original girl witch fixing a storm-tangled ribbon gate. Any delivery offers a generated supplies puzzle or a separate pictured example first. Choose mixed parcels, multiplication, addition or subtraction, with all tables 1–12 or a particular multiplication table. All 144 ordered multiplication facts, including 12×12, are available. Bramble mixes useful revisits, familiar patterns and new examples using recent finished rounds; support-heavy play still gets fresh facts. A miss opens the separate stepped example; try again, solve together, or take the quiet route. Your parcel and pending flight instruction stay exactly where you left them. Continuing is manual, and there are no play credits, hearts or timers.

Each encounter freezes its task and keeps raw attempts, support, narration requests and resolution separately from real packing, route checks and reading reports. No independent-recall or mastery inference is added. All phases survive pause/reload, explorer switching and the existing local export/save-off/reset controls. Choose Another challenge without starting a new delivery, including after a parcel has arrived. The previous round is archived once; the latest 96 finished generated rounds are kept in finish order. Next-question preferences never rewrite a pending puzzle. Large arrays stay compact, and multiplication can be built in parts on request. Optional method reports remain separate from support. Existing authored encounters stay valid and are preserved when replaced. See [spec 26](docs/specs/26-bramble-changing-challenges.md).

The Water Lab’s three existing visits now begin with the storm-flooded garden path. They distinguish water flowing downhill, soaking into the ground and evaporating, with a paper recovery-map invitation. The existing close-up molecule pictures explain melting, warming and evaporation; a controllable runoff/drainage investigation remains a roadmap follow-up. No science mission IDs or saved observations change.


## Moving saved progress

1. On the old site, use the browser/device where you played. In Grown-up notes, select the explorer and choose **Download our notes**.
2. On the [current site](https://after-the-storm-learning.anotherpanacea.workers.dev/#notes), choose that JSON file under **Bring progress from another site**.
3. Check the preview and choose **Add as a separate explorer**. Repeat for other explorers.

The file is read on your device, never uploaded. Existing explorers are not replaced or merged. An exact original copy remains downloadable from Earlier and kept saved copies. If saving is off, imports remain session-only; keep the file or turn saving on. Unavailable questions may close under the normal restore rules, with the source retained. [Specification 35](docs/specs/35-local-progress-transfer.md).

## Cloudflare hosting

The reviewed static assets are served at https://after-the-storm-learning.anotherpanacea.workers.dev/. Deploy only `dist/`, never the repository root or CLI-generated setup folders. From an authenticated Cloudflare account, future reviewed releases can use `npx wrangler deploy --assets ./dist --name after-the-storm-learning`. The current deployment has no application backend or paid compute requirement. Static asset requests are [free and unlimited](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/). Keep credentials and account configuration outside this public repository.

The first equal-group spiral is available at the Café serving bench and Bramble’s ribbon bench. Six quantity families support total, amount-per-group and group-count questions, with editable pictured supplies and preserved work across both places. See [spec 38](docs/specs/38-equal-group-spiral.md). Normal orders, inventory and rival rounds stay separate.

### A message for a reader

[The letter-mending desk](https://after-the-storm-learning.anotherpanacea.workers.dev/#post/messages) offers three original storm-recovery notes: which basket, which destination and which action. Choose a scene clue, try several useful supplied revisions, and compare the reader’s before/after response. Alternate clear messages can serve a different purpose; there is no penalty or required success. Optional original wording is read with a person and never automatically evaluated.

[The reader’s stage](https://after-the-storm-learning.anotherpanacea.workers.dev/#loft/messages) gives the sender a reason and the reader a reply, with optional original dialogue and manual replay. The first crossing copies familiar words and support context; later crossings reopen the destination’s existing draft. Ordinary deliveries, rival challenges, puppet shows and shelves are untouched. Exact authored words stay local under save settings and appear in notes downloads. This is bounded practice, not a reading or writing level. [Spec 39](docs/specs/39-message-reader-spiral.md).

### Changing letters

[Find a changing letter](https://after-the-storm-learning.anotherpanacea.workers.dev/#post/letters/round) or [open the round in Story Loft](https://after-the-storm-learning.anotherpanacea.workers.dev/#loft/letters/round). Twelve original notes revisit one detail, two details together and what a particular reader needs to know. Readers include Kitten, Dragon, Rabbit, Pip and Dot. Two already-actionable notes ask for a reason rather than pretending the directions are wrong. The library rotates; it is finite authored content, not live AI generation.

Trying cards is exploration. Only explicitly keeping a supplied version contributes once to a gentle next-kind suggestion; original wording stays human-read and ungraded. Recent requests, known help, narration, together-reading, repeated encounters and legacy-desk familiarity remain separate. Choose any kind immediately. The current letter, card/clue order, both desk drafts and other games stay intact across pages and reload. The round retains its latest 24 letters plus selected drafts at either desk; notes downloads contain that retained writing. The original three-note desk and its saved work remain available. [Spec 40](docs/specs/40-changing-letters.md).

## The growing shelf

[Seedlings after the storm](https://after-the-storm-learning.anotherpanacea.workers.dev/#living/plants) adds an optional Living Garden investigation: wonder, inspect four invented model days, compare stems and leaves, then carry a kept observation to a planting plan. Adequate-light and dim-light examples use the same millimetre scale. Pictures and numbers are labelled illustrations, not measured cress results. Prediction timing, copied rows, practice and help remain separate; existing habitat trails, beds and café stock are preserved. [Spec 41](docs/specs/41-plant-investigation.md).

## Field Notebook

[Open the Field Notebook](https://after-the-storm-learning.anotherpanacea.workers.dev/#living/notebook) to choose useful model observations, make two labelled bars, read the chart and compare it with its source. Eight open comparisons revisit model days 0/2/4/6 and specimens A/B. A correct reading of an inaccurate chart stays distinct from matching the source or choosing relevant data. Keep unfinished charts, revise later, and bring a frozen chart to the planting corner. Typed-but-unapplied entries and support stay with the explorer. Source values remain explicitly invented; no real plant measurement or learning-level inference is made. [Spec 42](docs/specs/42-field-notebook.md).

## The Sharing Counter

[Pack a picnic](https://after-the-storm-learning.anotherpanacea.workers.dev/#cafe/sharing) by repairing unequal loaf cuts, comparing half with two quarters, and sharing twelve buns into four equal groups. Six requests stay open, with reversible controls, optional stepped examples and frozen unfinished drafts. The same whole stays pictured; feedback separates share count, equality and packed amount. This is supported visual fraction practice, with no ingredient-stock or supper effects. [Spec 43](docs/specs/43-sharing-counter.md).

## Rain Paths

[Follow the rain](https://after-the-storm-learning.anotherpanacea.workers.dev/#science/rain) through two matched tabletop machines. Manually bring down tokens, follow an opening or sealed lid, inspect storage and outlets, and try a copy through a straight channel or a holding cup that can overflow. Four open cases keep predictions, partial ledgers, exact pending questions, source views and paused plans. These arbitrary tokens are an invented closed machine, not measured rain, soil or a flood forecast. [Spec 44](docs/specs/44-rain-paths.md).

## The Measuring Kitchen

[Prepare a measured dinner tray](https://after-the-storm-learning.anotherpanacea.workers.dev/#cafe/recipes) with a graduated 500 mL jug,50 mL fills and two separate fictional ingredients. Six cards invite filling, reading, pouring and correcting. An accurate reading of an overfilled portion stays accurate; units, recipe fit and an empty jug are checked separately. Every portion can be returned, and unfinished trays can be kept without changing café orders or stock. [Spec 45](docs/specs/45-measuring-recipes.md).

## Travelers’ Archive

[Open a Paris archive parcel](https://after-the-storm-learning.anotherpanacea.workers.dev/#archive): inspect a real, credited CC0 photograph from the 1910 Seine flood, place evidence on an original schematic, order three dated events, and compare a picture with modern chronology summaries. Prepared replies distinguish evidence from missing information; optional original writing is local, exact and ungraded. One bounded visit, open to revisit; no independent history/reading-level or French-proficiency claim. [Spec 46](docs/specs/46-travelers-archive-first-visit.md).

## Rain Paths charts

Carry an actual completed current or kept Rain Paths result to [a water page in the Field Notebook](https://after-the-storm-learning.anotherpanacea.workers.dev/#living/notebook/rain). Choose useful data, build two bars, read the draft and compare it with its frozen source. Wrong bars can still be read correctly; source fidelity and the runoff question stay separate. Pending entries and unfinished kept charts survive revisiting. These are arbitrary model tokens, never mL or measured rain. [Spec 47](docs/specs/47-rain-notebook-spiral.md).

## Sharing and navigation artwork

The main page and standalone films include static Open Graph and large-image card metadata. The shared1200×630 PNG is `dist/assets/after-the-storm-social-v1.png`; its editable original vector artwork is `design/social-preview.svg`. Hash destinations share the main page preview because the fragment is not sent in an HTTP request. Metadata contains no explorer or saved-progress information. Bump the image filename when replacing it; sharing services may cache earlier cards.

Nine original SVG icons in `dist/icons/` accompany the existing visible navigation names. They are decorative to assistive technology; the text remains the accessible link name. The mobile menu uses four columns with large tap targets. The existing garden mark also supplies the32px PNG favicon and180px Apple touch icon. Raster assets were rendered from the local vector originals with Sharp; no remote fonts, icon library, image service or additional browser dependency is required.

## Fraction Trail — local build

The optional `#cafe/fractions` bench adds six open ribbon requests: construct equal spaces, move a flag along actual boundaries, read its actual position and keep a frozen route card. Build, Place, Read and Keep pages retain the request and same-scale 0–2 line. Space equality, requested position and raw reading are checked separately. Half/quarter/sixth comparison and one five-quarter route revisit the same whole; a separate comparison explains why half of a longer whole is longer.

All checks are model-visible practice. There is no independent fraction mastery, whole-number fact exposure, café stock/supper change or film milestone. Draft/raw text, optional help, frozen checks/cards and recovery uncertainty remain local and transfer with explorer notes. [Spec 52](docs/specs/52-fraction-trail.md) defines the bounded scope. This branch is stacked on the PR35 authoring branch; release still needs composed-branch checks.

## Bundle Exchange — local build

The optional `#numbers/exchange` table extends Bundle Burrow with seven fixed collections. Move individual seed counters into a two-row ten-place frame, wrap exactly ten and unwrap them again. Every constituent counter stays countable; regrouping preserves the quantity, including arrangements with more than nine loose ones. Read and Digits distinguish the actual wrapped-bundle count, total counters, supplied numeral’s tens digit and its value. Zero/seven have no written tens digit. Unfinished arrangements and exact raw responses can be kept and revisited.

A separate manually stepped sixteen-counter example supplies optional help. Only a visibly complete conventional bundle/ones example and its total marks an exact existing bundle task familiar; paused/future/submitted tasks retain that context without rewriting completed answers. Unsupported/recovered history keeps earlier familiarity unknown. No general mastery, handwriting, written arithmetic, inventory rewards or film milestone is inferred. [Spec 53](docs/specs/53-bundle-exchange.md) defines the bounded scope; this branch is stacked on Fraction Trail and requires composed-release checks before publication.

## Instructions for a Reader — local build

The optional `#post/instructions` and `#loft/instructions` desks share one instruction notebook. Two original requests invite planning with picture tickets, arranging separate supplied sentences, manually trying their effects and revising for a reader. Folding matters because this pictured note is too wide for its envelope; a first-time visitor needs preparations before an invitation. Both valid preparation orders work. Later repairs keep the earlier invitation’s consequence rather than silently sending the visitor again.

Original words remain separate, exact and ungraded. A person can read them, ask a question, and leave a comment tied to that version; a changed draft identifies earlier feedback as earlier. Optional typing/dictation/copying and reading reports describe participation, not verified independence. Unfinished work and bounded local versions are welcome. The device follows only supplied action IDs; no parser or prose-quality grader is added. Existing deliveries, letters and puppet shows remain separate. [Spec 54](docs/specs/54-instructions-for-a-reader.md) defines the supported instruction-writing slice; it does not establish general writing, decoding or programming competence. This build is stacked on Bundle Exchange and still requires composed-release verification.

The locally built **Willow packing table** (`#post/packing`) gives the same seed envelopes two purposes: make the most full welcome kits, or carry every envelope in the fewest loaded trips. Four requests include an exact fit; partial bags, loose envelopes and spare capacity stay distinct. Pack/unpack countable objects, read the actual table, revise the purpose-specific answer and keep or seal a plan. Supplied pictures and requested examples support practice without claiming written division or independent mastery. [Spec 51](docs/specs/51-parcel-packing-and-remainders.md).

The locally built **Whole batches for a gathering** activity (`#cafe/batches`) invites children to repeat a two-guest recipe, measure separate portions, and compose a literal delivery label. Three pictured requests retain their own plans and unfinished drafts. Optional models compare repeating the complete recipe with adding the same amount to both ingredients; offering a tray gives a local gathering ending. All checks are supplied picture practice, with support retained, and do not serve a café guest or establish independent mastery. [Spec 50](docs/specs/50-whole-batch-gathering.md).

Optional Café starting amounts are configured in Grown-up notes. Existing explorers keep their current amount choices until explicitly opted in; Café range buttons override the starting choice. Current guests and connected orders keep their original quantities. See the [bounded specification](docs/specs/proposed/challenge-bands.md) and [source audit](docs/source-audits/cafe-starting-amounts.md).

### Paused English Paris visits

New visits retain their supplied passages, questions, ordering cards, smaller examples and ending together. Catalogue edits cannot change a paused answer or the next question's passage. Earlier visits without those pages stay in the notebook as records; a fresh visit is offered without guessing the missing wording. French preservation is a separate follow-up.

For synthetic browser regressions, serve `dist` locally and run `node test/paris-saved-source-browser.js` with `PARIS_SOURCE_TEST_URL` set to that server. This requires installed Node Playwright and Chromium; optional `PLAYWRIGHT_MODULE` and `CHROME_PATH` select existing installations. Set `PARIS_SOURCE_ARTIFACTS` to a temporary screenshot directory. The test uses isolated synthetic profiles, altered in-memory catalogue responses, phone/tablet viewports, reload, recovery and actual download/import. It does not establish physical iPad/Safari or audible-speech behavior.

### The Town Remembers

An optional home invitation returns to a kept tray, loaf or kitchen jar on a later local day. Six finite forms ask for a different unknown or representation: guest counts, a whole-batch shortcut, same-loaf comparisons, a fraction of twelve buns, a coarser jug scale, and an extra pour. Earlier undated keeps are eligible too. Each errand freezes its own source and choices; checking, support and keeping an answer remain separate. Nothing changes the original game or café stock.

To run synthetic browser journeys, serve `dist` locally and run `node test/town-remembers-browser.js` with `TOWN_TEST_URL` pointing to the server. Installed Node Playwright and Chromium are required; optional `PLAYWRIGHT_MODULE` and `CHROME_PATH` select existing installations. `TOWN_ARTIFACTS` selects a temporary screenshot directory. Tests cover all six forms at phone/tablet sizes, actual source-game Keep buttons, later-day invitations, revisions, support, recovery and notebook download/import. This is Chromium emulation, not a physical iPad or audible-speech check.

## Field Kit: local build

Open `#field` on the locally served build for five optional adult-guided cards: a real measuring jug, growing cress, a handwritten café notice, weather watching and an observation walk or window view. Each card connects to its existing model game, has Before/After pages and can be printed locally. An adult can choose “We did it,” “It surprised us” or “Not today.” These are offscreen reports, not measurements or evidence of attainment. No physical result, photograph, handwriting or location is collected.

The notebook keeps the selected supplied reply and support separately. Earlier cards remain readable even when the current card catalog changes. Ordinary explorer switching, reset, save-off and local export/import also apply. See [spec 75](docs/specs/75-field-kit.md) and its [source audit](docs/source-audits/75-field-kit.md). This branch is draft work; it has not been deployed to the live site.

For synthetic browser verification, serve `dist/` locally and run `node test/field-kit-browser.js` with `FIELD_TEST_URL` set to that server's URL. Set `PLAYWRIGHT_MODULE` to an installed Playwright module and, if needed, `CHROME_PATH` to an installed Chromium browser. Optional `FIELD_ARTIFACTS` saves synthetic screenshots. The test inspects print media, simulates local voice callbacks, and exercises phone/tablet layouts and actual notebook download/import; it does not establish physical-device audio behavior or what happened offscreen.

## Willow Path

The optional `#numbers/path` walk links from Number Garden. Move two shaped tokens along ten equal numbered stones, spinning one or two and naming each destination. Two people can share the tokens, or one person can move both. They finish together at Willow Bridge; there is no winner, score, or learning assessment. Small stories appear at occupied stones. Optional step narration uses the existing local voice settings and resets when you leave.

A waiting walk keeps its own words, events, mode, positions and remaining step. Unknown saved boards remain available in a notes download; starting a separate walk requires confirmation and retains the earlier record. The design studies linear number-board research, but this cooperative digital adaptation has not been evaluated for learning effects. See [spec 76](docs/specs/76-willow-path.md) and its [source audit](docs/source-audits/76-willow-path.md).

Run `node test/willow-path-checks.mjs` for source checks. With the static app served locally and Playwright installed, run `WILLOW_TEST_URL=http://127.0.0.1:4173/ node test/willow-path-browser.js`; `PLAYWRIGHT_MODULE`, `CHROME_PATH` and `WILLOW_ARTIFACTS` optionally select a local module, browser and screenshot directory. These are synthetic Chrome checks, not physical iPad or audio verification.

## Joining Supply Orders

The optional `#numbers/join` table extends Bundle Burrow with two pictured additions: 24 + 13 and 24 + 17. Join the orders, move individual counters into a ten-frame, and wrap the same ten when the frame is full. Pip’s and Dot’s counters retain separate shapes and origin labels. A proposed total and a kept draft can be unfinished or revised; a matching number does not claim that a child used regrouping or an independent written method.

Each case keeps its supplied source, grouping, raw total, support and earlier checks. Speech requests are labeled as requests, not proof of playback. Optional help and a separate example remain open. See [spec 77](docs/specs/77-joining-supply-orders.md) and its [source audit](docs/source-audits/77-joining-supply-orders.md).

Run `node test/joining-orders-checks.mjs` and `node test/joining-orders-integration-checks.mjs` for source checks. With the static app served locally and Playwright installed, run `JOIN_TEST_URL=http://127.0.0.1:4173/ node test/joining-orders-browser.js`; `PLAYWRIGHT_MODULE`, `CHROME_PATH` and `JOIN_ARTIFACTS` optionally select a local module, browser and screenshot directory. These synthetic checks do not establish physical iPad behavior or learning gains.
