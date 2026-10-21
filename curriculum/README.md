# Curriculum reference and authoring atlas

Start with the [learning atlas](../docs/learning-atlas.md) for current game scopes, seven reusable play patterns, all 54 source domains and proposed increments. The [all-topic CSV](topic-coverage.csv) connects the full reference graph to explicit current activity declarations and labelled domain-level authoring candidates. It is not a child assessment or a claim that all topics are taught.

## Provenance and file boundaries

Marble Skill Taxonomy (v1), © Generative Spark, Inc. (Marble), [withmarble.com](https://withmarble.com). Source repository: [withmarbleapp/os-taxonomy](https://github.com/withmarbleapp/os-taxonomy), pinned commit `96a7933754af672e1bfdbf7ecb05c325860c6e0d`.

| Local file | Source / changes |
| --- | --- |
| [marble/topics.json](marble/topics.json) | Unchanged [source data/topics.json](https://github.com/withmarbleapp/os-taxonomy/blob/96a7933754af672e1bfdbf7ecb05c325860c6e0d/data/topics.json): 1,590 topic records, all original metadata. |
| [marble/dependencies.json](marble/dependencies.json) | Unchanged [source data/dependencies.json](https://github.com/withmarbleapp/os-taxonomy/blob/96a7933754af672e1bfdbf7ecb05c325860c6e0d/data/dependencies.json): 3,221 prerequisite records, including strengths and reasons. |
| [atlas.json](atlas.json) | Project-authored pattern/game inventory, domain candidate routing, narrow manual activity references and priorities. Existing question IDs and invitation declarations are read directly from application source by the builder. |
| [topic-coverage.csv](topic-coverage.csv) | Generated source-derived index of every topic, prerequisites, explicit activity references and limits, and candidate patterns. All candidates remain unreviewed per-topic suggestions. |
| [../docs/learning-atlas.md](../docs/learning-atlas.md) | Generated readable source-derived atlas and original planning recommendations. |

An edge means `topicId` **depends on** `prerequisiteId`. Source hard/soft prerequisites, game invitations and candidate activity fits are different relationships. The application continues using its smaller runtime graph; none of these files is fetched by the child-facing app.

Age fields and age suffixes remain original reference metadata. They are not placement, grade or access rules. Some source evidence is empty or bibliographic; a topic needs reviewed learning activities and task criteria before it can support useful observations. A declared reference describes only the named task or explanation. No reference means **not yet mapped**, rather than a finding about the child or proof that no related material exists.

## Licenses

The complete database and source-derived graph/mapping index, including `marble/*.json`, the mapping data in `atlas.json` and `topic-coverage.csv`, are available under [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/). Marble-authored content, including topic names/descriptions/evidence and prerequisite reasons, and source-derived text/tables in the atlas and CSV are under [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Original pattern descriptions and priorities are project planning; application code retains its MIT license. See [NOTICE](../NOTICE). The root MIT license does not replace these data/content licenses.

Original standards identifiers are retained as reference metadata. The separate `curriculum-standards.json` and its extracted standards text are not included. No Jane lesson prose or code is newly incorporated by this atlas; its lesson-pack conventions are a design reference, and earlier code adaptations keep their separate attribution.

## Rebuild and review

```sh
node scripts/build-learning-atlas.mjs
node scripts/build-learning-atlas.mjs --check
```

Run from the repository root with Node.js; no installation, network access or learner save is used. The builder verifies node/edge identities and counts, all eight subject counts, valid acyclic dependencies, all domain candidate keys and declared activity references, and deterministic derived output. CSV text is quoted. Review the actual activity against the full source topic description/evidence before adding a reference; a matching theme is insufficient. Domain candidates need per-topic review before implementation. Keep real learner information out of this directory and the public repository.

## Six-act programme planning

[Spec 49](../docs/specs/49-six-act-curriculum.md), the [26 teaching pathways](../docs/six-act-strands.md), [detailed intermediate maths/literacy sequences](../docs/six-act-math-literacy.md) the [original teaching bridges](../docs/six-act-teaching-bridges.md), and [source audit](../docs/six-act-source-audit.md) separate inventory, sequence design and authored lesson completeness. The [six-act topic ledger](six-act-topic-plan.csv) includes every pinned topic, its owning pathway, known source issues, candidate delivery mode and explicit outstanding design. Current references are joined from `topic-coverage.csv` by ID; source predecessors stay in `marble/dependencies.json`. It assigns no learner or topic to an act automatically. All programme topic-level teaching/contrast/application/revisit designs remain required; source age metadata is not curriculum coverage or placement. Original pinned data and current coverage declarations are unchanged. The source-derived ledger retains the same ODbL/CC-BY-SA attribution above.
