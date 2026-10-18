# After the Storm

A playful, parent-guided world of connected investigations, stories, and making things. The Learning Garden is the first place to explore; Number Garden remains its mathematics destination. The repository keeps the `learning-garden` name.

[Try After the Storm](https://number-garden-together.tastypeach3.chatgpt.site/).

The opening visit, **First Morning**, has three independent entrances: follow a creature's trail, investigate a mysterious note, or imagine a shelter. Each path offers two reading, science, or mathematics tasks, an unscored design choice, its own ending, and an optional paper project. Mira, Rowan, and Ari are original fictional guides; guide and explorer-avatar choices are independent.

Visits can be paused, resumed, replayed, or left waiting while another path is explored. Existing Number Garden activities and records remain available at the same browser origin. All preferences, drafts, observations, and exports stay browser-local; saving off and clearing apply to everything. No identity fields, uploads, analytics, live AI, or server-side learner records are used.

## Run locally

No installation or build step is needed. From this repository:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. Learning records remain browser-local. They do not sync between devices.

## Check the existing learning logic

With Node.js installed:

```sh
node test/core-checks.mjs
node test/broad-checks.mjs
node test/story-checks.mjs
node test/help-checks.mjs
node test/cafe-checks.mjs
node test/science-checks.mjs
node test/cafe-expedition-checks.mjs
node test/facts-checks.mjs
node test/forage-checks.mjs
```

These checks use synthetic observations. They check the application logic; they do not validate the assessment as an educational instrument.

## Roadmap and science expeditions

The [six-step roadmap](docs/roadmap.md) links reviewed specifications for Water Lab expeditions, Willow Post Office, Storm Workshop, Word Workshop, Ecosystem Expeditions, and Story Loft. Only step 1 is implemented in this increment; the other five remain planned.

Science offers three guided water visits with optional predictions, a focused external Marble Water Lab link, self-reported observations, original controllable explanation pictures, and a discussion/project invitation. Each mission is independently available and can finish without an external visit or an answer. Link selection is not treated as visiting, experiment completion, or understanding. Explanation use and reported reading mode stay distinct. The latest 24 visits stay browser-local under the existing privacy controls; there is no tracking or data exchange with Marble. External application source/assets are not copied or embedded.

## Café discoveries and all multiplication facts

The [current café and fact-garden specification](docs/specs/07-cafe-expeditions-and-facts.md) adds the Cloud Orchard, three discoverable imaginary foods, and repair questions tied to the current dish. Food shapes and redundant quality symbols appear in the cupboard, on the plate and in repair choices. Discovery visits preserve waiting orders. Repeated collection cannot refill a jar. All eight original ingredients remain available so discoveries never lock a child out of a valid recipe.

New café orders can use every ordered guest/bite pair from 1×1 through 12×12; a small-order range stays openly available. Range changes affect the next guest. Existing saved orders and history keep frozen original parameters. The separate multiplication garden exposes all144 ordered facts, six-question mixed practice, arrays/equal groups, split strategies and optional reported methods. Reversed facts keep separate observations. Records distinguish reported recall, working out, counting, support, retries, prior encounters and unknown method; no speed or mastery label is inferred. Parent notes retain up to576 fact observations and disclose that bound. Progress stays device-local and follows the existing save/export/reset controls.

Read-aloud is optional and uses only English voices the browser identifies as local. Voice & speed controls let you audition available voices and adjust the pace; enhanced/natural voices are preferred when identified by name, otherwise the local device default is preferred. Voice choices last until refresh and reset with progress. No microphone, external speech API or automatic audio is used. A visible read-together fallback works when local speech is unavailable. Speech stops on navigation or reset. All activities work without sound.

## Gathering supplies

New gathering trips use a covered 4×4 orchard map. Small addition/subtraction clues identify a row and column; inspecting plots reveals their foods. Counter explanations can highlight the two clue lines, and finding their crossing opens the pictured equal-basket harvest. Map help is recorded separately from harvest help. Earlier matching-search trips keep their original rules when resumed. See [the orchard map hunt spec](docs/specs/09-orchard-map-hunts.md).

The [gathering specification](docs/specs/08-gather-the-cupboard.md) replaces instant restock controls and automatic top-ups. Every known ingredient has an orchard trail: explicitly start a trip, find the pictured food, count or get help with equal baskets, and pack the harvest into that one jar. Repeat trips are available; each trip supplies its harvest once. Gathering history retains 24 trips, and jars hold up to 180 bites. All gathering is guided practice, separate from reported fact recall. New guests are invited explicitly.

A shortage answer never creates inventory. Serving requires enough actual supplies and consumes them once. Waiting guests, recipes and inputs survive trips and reloads. The cupboard question keeps its original per-jar snapshot while showing current stock separately, so a gathering trip cannot reinterpret an earlier answer. Original saved orders/history and all privacy controls are preserved.

## Learning design and next increments

The opening introduces the shared story: neighbors are safe after the storm, and players can gather supplies, feed visitors, investigate water, follow messages, or imagine shelters. The café has a replayable, optional “Why we’re here & how to play” introduction, open at a fresh counter, with read-aloud and three short steps. The story introduction adds no completion gates or learner records.

The first visit is implemented. Its build scope and evidence boundaries are documented in [docs/first-visit.md](docs/first-visit.md). Story answer methods describe performance within a guided activity; independent reading is recorded separately and never inferred from a mathematical answer. Unscored project records mean an invitation was acknowledged, not that off-screen work was completed. Prior encounters, support, retries, and skips remain visible in the grown-up notes.

**The Almost-Right Café** adds a fourth entrance: find silly substitutes that fit two wishes, prepare equal portions, and work out a cupboard shortfall. Multiple suitable dishes are accepted. Its paper-menu project is optional and unscored.

The café also has an ongoing **Open the café** game: twelve imaginary regulars, including Clover the bunny, Ember the pocket dragon, and Purl and Biscuit the kittens, changing wishes, and eight starter jars of silly ingredients, plus orchard discoveries. Build a plate with the requested number of bites and qualities, count enough for the table, explore for each jar's shortage, and serve. Different mixtures can satisfy the same order. Guests keep arriving when invited; there are no timers, money, scores, or failure penalties. Orders and cupboard stock pause locally. Pictures, arithmetic support, and skipped questions are recorded as practice, never fresh assessment evidence. The notebook keeps the latest 24 orders; the current order is separate. See [docs/replayable-cafe.md](docs/replayable-cafe.md).

Every scored story task now offers a smaller parallel example with a tap-controlled text spotlight, counters, ruler, comparison, or menu. The original question and answer stay waiting. Help is recorded separately and remains support after returning; example success never advances the original task. See [docs/responsive-help.md](docs/responsive-help.md).

Future increments can add follow-up adventures, reviewable content packs, and private cross-device continuity. [Jane](https://github.com/kentlangley/Jane) remains a useful reference for lesson packs, spaced review, and continuity. No Jane code has been incorporated.

## Privacy and contributions

This repository contains generic source and curriculum content. Do not commit real learner profiles, names, ages or grades tied to a child, school or location details, family anecdotes, responses, progress, personalized packs, recordings, screenshots, exports, or credentials. Use clearly synthetic examples in tests and review commit metadata and attachments as well as files. See [CONTRIBUTING.md](CONTRIBUTING.md).

Deployment credentials and the existing Site's hosting configuration are excluded. This repository is the development home. Reviewed static assets are copied to the existing deployment checkout for publication; its hosting identity and credentials stay out of this public repository.

## Current Number Garden prototype

A small, parent-guided math prototype for exploring number sense, operations, fractions, patterns, geometry, measurement, and reasoning. Each area offers a two-question adaptive trail and three original story activities with editable visual models. A seven-area wander can pause between pairs. All activities remain open. The original multiplication check-in, six-fact practice sets, and puzzles remain available.

Serve `dist/` with any static HTTP server. There is no install/build step, external asset dependency, AI call, analytics, or application backend. The app fetches its bundled curriculum JSON from the same origin. This repository is hosting-neutral; the existing Site's configuration stays in its deployment checkout.

Progress is saved only in the browser's local storage. Grown-up notes provide a persistence switch, JSON download, and confirmed clearing. Saving off applies to every area. New devices and browsers start fresh. Broad trails retain drafts, hints, attempts, and models across reloads. Original multiplication records and the existing storage key are preserved; original practice sets do not resume their uncompleted plan after reload, but recorded answers remain.

The first question in a trail leads to a further question after a first independent answer, a smaller question after support or another try, or an alternate question after a skip. Notes describe individual tasks rather than assigning a level. Activities are recorded separately as attempts after teaching. Prior encounters with questions and known multiplication pairs are retained across the old and new experiences; missing historical familiarity is marked unknown. Two skipped questions give a neutral activity suggestion. Small samples and fixed examples limit what can be inferred.

The parent-facing learning map uses a focused subset of Marble's actual prerequisite relationships. When an authored activity matches a connected topic, suggestions explain that link; otherwise a simple within-area suggestion is identified as such. No edge locks access or implies mastery. The map does not claim full curriculum coverage.

This is not a validated assessment, a comprehensive skills inventory, a grade-level estimate, or a class-placement recommendation. The adult and child select the observed method together; the app does not judge spoken explanations. Try different examples and representations on later days. Pip and Dot, stories, lessons, questions, and activities are original.

Curriculum: Marble Skill Taxonomy v1, © Generative Spark, Inc. (Marble), https://github.com/withmarbleapp/os-taxonomy, pinned commit `96a7933754af672e1bfdbf7ecb05c325860c6e0d`. `dist/marble-map.json` contains 64 topics and 74 relationships: the 25 task-linked topics plus their direct prerequisites. Selected age suffixes have been removed from names; descriptions and link reasons are retained. Database/subset: ODbL 1.0; Marble descriptive content: CC BY-SA 4.0. The map view links its downloadable data, pinned source, and both licenses. Further relationships outside the slice are disclosed.

Teaching reference: IES, Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades, https://ies.ed.gov/ncee/wwc/PracticeGuide/26. The prototype combines visual explanations, brief practice, flexible strategies, and interesting problems without timers or placement gates.

## License

Original application code and original activity content are available under the [MIT license](LICENSE). The bundled Marble curriculum subset and its descriptive content retain their separate ODbL 1.0 and CC BY-SA 4.0 licenses. See [NOTICE](NOTICE) and the attribution in the app's Learning map. The MIT license does not replace the licenses of that third-party data.
