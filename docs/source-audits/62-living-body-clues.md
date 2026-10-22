# Living Garden Body Clues: source and overlap audit

Author source preparation for spec62, 2026-10-21. This audit is not independent specification/content/implementation review. Only this audit file is authored; no runtime, specification, existing game state or taxonomy pin is changed.

## Fresh source check

Fresh public GitHub head reads and exact-commit file downloads returned Jane [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81) and Marble [`3de50367b23be6a03d1a8385daae16d5eed2675d`](https://github.com/withmarbleapp/os-taxonomy/tree/3de50367b23be6a03d1a8385daae16d5eed2675d), unchanged since61. Jane `LESSONS.md`, `src/engine.js`, `src/stuck.js`, `LICENSING.md` and Marble `data/topics.json`, `data/dependencies.json` all matched the previously audited cache byte for byte. Host read access was used after earlier diagnostics established sandbox GitHub DNS was unavailable.

Jane short purposeful stages, stable work, concrete response formats and optional separate support remain design references only. No new Jane engine, authored lesson prose, art, identity/storage, grading, reward or mastery model is incorporated. Existing game code/interaction patterns are the implementation reuse; the four-example key, diagrams, prompts and fictional encounter are original. Jane paths have separate code/content licenses; no blanket MIT-content reuse is inferred.

## Two narrow targets and full hard closure

Use `mt_4vHa3I5bNj` (Not all minibeasts are insects) and `mt__bhJX2SuFJ` (Sorting and Identifying Minibeasts) as partial references. Their target-plus-transitive-hard-prerequisite union is **five unique nodes**. The hard chain is What is a minibeast? → Common minibeasts → The insect body plan → Not all minibeasts are insects → Sorting and Identifying Minibeasts. The body-plan topic also has a soft movement/leg-counting relation; soft edges do not enlarge the hard union or become learner locks.

Compared refreshed source against full vendored `curriculum/marble/topics.json` and `dependencies.json` at `96a7933754af672e1bfdbf7ecb05c325860c6e0d`: all five names, descriptions, evidence arrays and incoming `(prerequisiteId,strength,reason)` triples match exactly. **None of these five nodes is in runtime `dist/marble-map.json`**, whose existing pin stays unchanged. Raw-source agreement does not establish runtime node/evidence coverage. This audit adds no graph nodes/edges or source pin changes.

| ID / role / actual source title | Source description/evidence meaning | Bounded disposition and exception |
| --- | --- | --- |
| `mt_4vHa3I5bNj` · target · Not all minibeasts are insects | Compare insect/non-insect body features; evidence includes sorting by six legs, contrasting spider anatomy and naming worm/woodlouse differences. | Only the four specified adult diagrams; jointed walking legs plus a second body feature. No spider task, universal six-leg rule or whole-classification attainment. |
| `mt__bhJX2SuFJ` · target · Sorting and Identifying Minibeasts | Follow branching questions to identify creatures; evidence asks for four examples, a learner-created separating question and explaining question order. | Follow the supplied closed four-picture key. Creating a key and identifying unfamiliar animals outdoors remain unobserved. |
| `mt_oNWXXAn3cn` · hard ancestor · The insect body plan | Head/thorax/abdomen, six thoracic legs, antennae and exoskeleton; evidence includes labelling body parts and explaining the body plan. | Adult ladybird beetle diagram supports jointed-leg counting and wing-case observation. No independent body-part labelling, exoskeleton explanation or all-life-stage anatomy claim. |
| `mt_yR1moI5kX1` · hard ancestor · Common minibeasts: naming and recognising | Name common minibeasts and describe identifying features; evidence includes six kinds, comparisons and curiosity toward less-popular animals. | Only four supplied examples; curiosity and attitudes are not scored. The source’s ladybird-versus-beetle wording is not reproduced: a ladybird is a beetle. |
| `mt_BI6oGIO-xM` · hard ancestor · What is a minibeast? | Small animals without backbones; evidence includes finding three kinds in a garden and magnifier observation. | Supplied diagrams support noticing features. No real bug hunt, handling, magnifier use, independent field observation or broad invertebrate attainment. |

Complete refreshed incoming source triples `(topicId, prerequisiteId, strength, reason)`:

- (`mt_4vHa3I5bNj`, `mt_oNWXXAn3cn`, `hard`, Must know the insect body plan (6 legs, 3 parts) to distinguish insects from non-insects)
- (`mt__bhJX2SuFJ`, `mt_4vHa3I5bNj`, `hard`, Must understand insect vs non-insect distinctions before using classification keys)
- (`mt_oNWXXAn3cn`, `mt__7hXSTbu9s`, `soft`, Counting legs and observing movement prepares for formal body plan study)
- (`mt_oNWXXAn3cn`, `mt_yR1moI5kX1`, `hard`, Must recognise common minibeasts before studying insect anatomy in detail)
- (`mt_yR1moI5kX1`, `mt_BI6oGIO-xM`, `hard`, Must understand what minibeasts are before learning to name specific ones)
- `mt_BI6oGIO-xM`: no incoming edges.

Do not add `mt_AylKwhbDWM` (Grouping Living Things): its evidence asks for regrouping the same organisms by at least two criteria, reasoning and recognizing different memberships. A single supplied key does not perform that action. Do not add `mt_brgde1Vx0P` (Classification Keys): its wider evidence includes constructing a key for6–8 organisms and real field use. The minibeast-specific reference is closer to this bounded activity. No independent reading, universal classification, partner interaction or attitude/empathy mapping follows from labels, narration or fictional roles.

## Primary natural-history basis and explicit limits

The root author personally read primary NHM classification, insect-body and ladybird resources plus springtail material; Massey morphology; Field of Mars snail information; RHS woodlice; and the Australian Museum beetle guide. This audit relies on that root source check for biological facts and does not claim an independent reread of those pages. The root subsequently confirmed full-page reads of NHM insect parts and the Australian Museum beetle guide as well. No source photograph, illustration, prose or worksheet is copied into the game.

Root-read primary references and the narrow fact/design role:

- [NHM Classification Exploration](https://www.nhm.ac.uk/schools/teaching-resources/key-stage-2/life-cycles-habitats-and-classification/practical-activity-classification-exploration.html): observable-feature branching and the need to distinguish snail/earthworm beyond their shared no-legs answer. Its coarse six-legs-to-insect converse is not adopted.
- [NHM Parts of an insect](https://www.nhm.ac.uk/schools/teaching-resources/key-stage-1/animal-and-human-bodies/parts-of-an-insect.html) and [NHM Ladybird resources](https://www.nhm.ac.uk/schools/teaching-resources/big-ideas-in-science-evolution/ladybirds-resources-and-class-activities.html): insect/ladybird feature context, bounded here to the supplied adult diagram.
- [Australian Museum: What do beetles look like?](https://australian.museum/learn/species-identification/ask-an-expert/what-do-beetles-look-like/): six legs and paired hardened forewing cases meeting at the midline, with hindwings usually folded beneath. Closed wing cases are a visible clue; no flight observation or species-by-colour rule is inferred.
- [Massey University slater morphology](https://nzslaters.massey.ac.nz/morphology.php) and [RHS Woodlice](https://www.rhs.org.uk/biodiversity/woodlice): adult woodlouse anatomy, fourteen jointed walking legs and the need to distinguish walking legs from other appendages.
- [Field of Mars land-snail fact sheet](https://fieldofmar-e.schools.nsw.gov.au/fact-sheets/invertebrates/snail-fact-sheet): land-snail shell and muscular-foot context; a foot is not one jointed walking leg.
- [NHM Scary-looking minibeasts](https://www.nhm.ac.uk/discover/scary-looking-minibeasts.html): springtail counterexample to an unrestricted six-leg inference. The page’s problematic group-separation wording is not repeated or used as a taxonomy claim; insects are also hexapods.

The proposed key applies to **these four supplied adult diagrams**: a land snail, earthworm, ladybird beetle and woodlouse. Use **jointed walking legs**, not all appendages: the pictured snail/earthworm have0, ladybird beetle6, adult woodlouse14. A snail’s muscular foot is not one jointed walking leg; woodlouse antennae and other appendages must not inflate walking-leg count. A clear view/detail must expose the relevant walking legs; hidden legs are not absent legs. Do not count stylized marks, antennae or rear appendages as extra walking legs.

Require a second observable body clue: shell for the selected land snail, ringed body for the earthworm, paired wing cases for the ladybird beetle and overlapping plates for the woodlouse. The no-jointed-legs branch must remain ambiguous until shell/ringed-body evidence is inspected. The same primary count does not uniquely identify every organism. Secondary clues are diagnostic only within this closed four-picture set: shells, rings, wing cases and plates are not universal one-to-one natural classifications.

The game must not generalize “six legs therefore insect” to all small animals. Springtails supply a counterexample to that coarse converse and are not assessed in this pack. Hexapoda is not a group that excludes insects; do not introduce that incorrect relation. Adult/life-stage wording is essential: the source’s unqualified all-insects/six-legs wording is not a universal rule for larvae, pupae, injured individuals or illustrations with obscured features. Do not require learners to infer a count from a deficient picture. A named specimen diagram is a teaching representation, not a field-identification guarantee.

The source’s “tell a ladybird from a beetle” evidence wording must not be turned into disjoint categories: a ladybird/ladybug is a beetle. Use ladybird beetle as the pictured label, with insect as its relevant broader group. Woodlouse is a crustacean, while snail and earthworm are not insects; these supplied examples do not cover all major invertebrate groups or establish taxonomic rank knowledge. Primary-source scope and life-stage facts control original content rather than reproducing source shorthand/errors.

## Existing overlap and new learner action

Spec23 and the implemented Living Garden first/spiral/adaptive visits (`dist/living-content.mjs`, `living-spiral-content.mjs`, `living-adaptive-content.mjs` and their UI/core files) compare pictured **habitat conditions** for snail, woodlouse and butterfly. Existing references concern habitats/basic needs, habitat vocabulary and local plants/animals. Find/inspect/reason/support and preserved waiting visits are reusable; body-feature key navigation is not already provided by those habitat tasks. New work must actually inspect pictured anatomy, retain ambiguity after the first feature where necessary and follow a second feature to a bounded identification, rather than make habitat a proxy for identity.

Reuse existing animal names only with the new diagram’s specified life stage and feature contract. Earlier woodlouse/snail/butterfly habitat art is not automatically sufficient for exact leg counting. The primary facts do not require an insect lifecycle lesson, new ecosystem model, field capture, real handling or classification of arbitrary photos. Existing parcel rewards remain sealed fictional supplies near animals, not real animal diet lessons.

Keep existing games, suggestions, familiarity/support distinctions and waiting parcels unchanged. New work must preserve frozen old outcomes rather than reclassify earlier habitat answers against the new key. A new key result belongs with its own diagram/feature/question identity; do not infer it from inspected habitat IDs, answer keywords, species-name strings or another game’s existing success. Keep selectable finite feature answers distinct from optional human explanations, with no prose classifier or heuristic hidden in a “science” result. Viewing a diagram or help is not independent observation or correct identification.

## Licenses and evidence boundary

Preserve Jane path-specific notices and Marble attribution © Generative Spark, Inc. (Marble), database ODbL1.0 and descriptive content CC BY-SA4.0. Topic meanings are paraphrased here; relation reasons are attributed taxonomy content. Primary pages inform original facts/diagrams, not incorporated assets or source prose. Preserve the existing bundled pin. No learning-effect, field-transfer, identification-certification or whole-topic attainment claim is added.
