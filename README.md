# The Learning Garden

A public project for playful, parent-guided learning through connected investigations, stories, and making things.

The current runnable app is **Number Garden**, a math prototype. This repository starts with that working app; broader exploration and selectable guides are planned next. [Try the current app](https://number-garden-together.tastypeach3.chatgpt.site/).

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
```

These checks use synthetic observations. They check the application logic; they do not validate the assessment as an educational instrument.

## Next increment

One short investigation with multiple entrances, connecting reading, science, making, and mathematics. A selectable guide accompanies the learner. The first fully developed guide can be an older girl or young woman; guide and child-avatar choices should be independent, with other genders supported through the same learning experience.

Keep observations specific: independent reasoning, counting, support, retries, skips, and uncertainty. A curriculum connection can suggest what to explore next without declaring unobserved prerequisites mastered. Follow-up adventures can revisit an idea in a new context.

[Jane](https://github.com/kentlangley/Jane) is a useful reference for lesson packs, spaced review, and continuity. No Jane code has been incorporated into this initial import.

## Privacy and contributions

This repository contains generic source and curriculum content. Do not commit real learner profiles, names, ages or grades tied to a child, school or location details, family anecdotes, responses, progress, personalized packs, recordings, screenshots, exports, or credentials. Use clearly synthetic examples in tests and review commit metadata and attachments as well as files. See [CONTRIBUTING.md](CONTRIBUTING.md).

Deployment credentials and the existing Site's hosting configuration are excluded. The published app remains in its existing deployment checkout while this repository becomes the development home.

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
