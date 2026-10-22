# Living Garden Food Links: source and overlap audit

Author source preparation for spec66, 2026-10-22. This is **source audit only**, not specification, art/science-content, implementation or release clearance. Only this document is authored; no runtime, specification, existing record or taxonomy pin is changed or staged. All planned material is original schematic/synthetic practice, with no family information, personal data or field records.

## Fresh upstream check and exact target

Fresh public GitHub head reads and exact-commit downloads returned unchanged Jane [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81) and Marble [`3de50367b23be6a03d1a8385daae16d5eed2675d`](https://github.com/withmarbleapp/os-taxonomy/tree/3de50367b23be6a03d1a8385daae16d5eed2675d). All six relevant files matched the previously audited cache byte for byte: Jane `LESSONS.md`, `src/engine.js`, `src/stuck.js`, `LICENSING.md`; Marble `data/topics.json`, `data/dependencies.json`. Host reads followed earlier diagnostics establishing sandbox GitHub DNS was unavailable. This is a new live refresh, not reliance on the earlier inventory's cached-head assumption.

Jane purposeful short stages, stable current work, concrete formats and optional separate support remain design references only. Actual reuse is the local Living Garden inspect/connect/keep pattern and ordinary choice/ordering controls. No new Jane lesson engine, prose, code, art, identity/storage, grading/rewards/mastery model or access gate is incorporated. Jane paths have distinct code/content licenses; no blanket MIT-content permission is inferred.

The single target is `mt_QH-Fs97twT`, **Minibeasts in the food chain**. Actual description: simple garden feeding relationships, with minibeasts eating plants/other creatures and themselves providing food for other animals. Actual evidence asks for describing a simple chain such as leaf→caterpillar→bird, explaining those feeding relationships, and giving a specific minibeast food example such as ladybirds eating aphids. The proposed named larval-predator case practices a narrow part of that meaning; supplied card/arrow choices do not establish independently describing/explaining it or general diet knowledge.

Its hard closure contains **three unique nodes**:

| ID / role / actual source title | Actual source meaning/evidence | Disposition and exception |
| --- | --- | --- |
| `mt_QH-Fs97twT` · target · Minibeasts in the food chain | Simple garden food relationships; describe a chain, explain minibeast feeding/dependence, name a specific food. | One supplied three-organism pathway with explicit food→eater legend. No complete web, full diets, population effects or independent scientific explanation. |
| `mt_yR1moI5kX1` · hard ancestor · Common minibeasts: naming and recognising | Names common minibeasts; evidence includes six kinds, visible distinguishing features and interest in less-popular creatures. | Only supplied named diagrams; no six-kind identification or scored attitude/curiosity. Do not copy its problematic ladybird-versus-beetle contrast: ladybirds are beetles. |
| `mt_BI6oGIO-xM` · hard ancestor · What is a minibeast? | Small animals without backbones; evidence includes a real hunt finding three kinds and magnifier observation. | No field hunt, handling, magnifier use or independently observed specimen. |

Refreshed names, descriptions, evidence arrays and all incoming `(prerequisiteId,strength,reason)` triples for all three exactly match full vendored `curriculum/marble/topics.json` and `dependencies.json` at `96a7933754af672e1bfdbf7ecb05c325860c6e0d`. Complete incoming source triples are:

- (`mt_QH-Fs97twT`, `mt_yR1moI5kX1`, `hard`, Must know common minibeasts before placing them in food chains).
- (`mt_yR1moI5kX1`, `mt_BI6oGIO-xM`, `hard`, Must understand what minibeasts are before learning to name specific ones).
- `mt_BI6oGIO-xM`: no incoming edges.

**None of these three appears in runtime `dist/marble-map.json`**. The runtime pin remains unchanged; full raw-source equality is not runtime coverage. No graph expansion, source repin or prerequisite lock is required. Do not add `mt_EygMHKs8Ed` (Simple Food Chains) merely for an arrow: its broader evidence includes independent drawing, producer/consumer vocabulary and an overbroad all-chains-start-with-plants statement. This bounded pathway does not establish those criteria or require that generalization. Do not add food-web, energy-budget, lifecycle or species-identification targets.

## Fresh primary biological reading

The earlier candidate inventory had read the article abstract and related institutional pages. **This audit freshly opened the actual seven-page Shannag & Obeidat2006 paper PDF**, reading its introduction, methods, results and discussion rather than substituting the abstract or a similarly named2008 paper. Fresh web reads also covered the arrow convention and morphology sections linked below. Source numbers/timings are not a game dataset.

The named pathway is **broad bean (*Vicia faba*) → black bean aphid (*Aphis fabae*) → seven-spot ladybird larva (*Coccinella septempunctata*)**. The third node must remain a larva, not an adult borrowed from Body Clues.

| Primary source directly consulted | Narrow supported fact and use |
| --- | --- |
| [Shannag & Obeidat2006, full paper](https://www.jstage.jst.go.jp/article/aez/41/3/41_3_521/_pdf), *Applied Entomology and Zoology*41:521–527, DOI10.1303/aez.2006.521 | Methods rear *A. fabae* on faba beans and feed its third-instar nymphs to *C. septempunctata* larvae. Observed consumption supports this exact named feeding pathway under experimental conditions. It does not document a particular wild garden encounter or universal rate. |
| [RHS Black bean aphid](https://www.rhs.org.uk/biodiversity/blackfly) | Sap-sucking black bean aphids occur on broad beans; mainly black bodies may have white flecks. RHS treats the common name as an *A. fabae* species group and warns that other aphids can be black. Colour alone is not species identification. |
| [UC Statewide IPM Aphids](https://ipm.ucanr.edu/home-and-landscape/aphids/), introduction/identification | Aphids have piercing/sucking mouthparts, soft pear-shaped bodies, long legs/antennae and, in most species, paired rear cornicles. These support a schematic aphid, not a copied identification plate or a rule for every aphid. |
| [RHS Ladybirds](https://www.rhs.org.uk/biodiversity/ladybirds), morphology and seven-spot entry | Larvae are elongated with three pairs of obvious legs; seven-spot larvae are grey with four pairs of orange markings. Adult red wing cases/seven black spots are adult features, not a larval costume. Ladybird diets differ by species. |
| [Singapore NParks: Food-chain basics](https://biodiversitysg.nparks.gov.sg/our-ecosystems/food-webs/food-chains-and-food-webs-basics/), arrow paragraph | Food-chain arrows point from food/prey toward consumer/predator and represent energy flow. Adopt this legend only, not the page's broader simplified top-predator, all-producer or fixed-percentage statements. |

The2006 study is a laboratory consumption/food-utilization comparison using particular cultivars and conditions, not an educational intervention. It supports presence of the feeding relationship; no consumption count, conversion efficiency, size ratio, development time, garden-control guarantee or learning effect is imported. A2011 pesticide/extract paper,2008 greenhouse paper and general ladybird summaries are unnecessary to justify this larval example. No chemical/control instructions are adopted. The cited experiment's stock cultures also included adults, but that is not a reason to silently change the depicted larval node.

For the first link, explain that the aphid obtains **sap from the plant**. It does not chew a loose bean, swallow the entire plant or become the plant. For the second, the specified larva eats aphids. This is a possible feeding relationship among the supplied named examples, not their only foods, a complete local web or proof that every ladybird eats aphids. A schematic may explicitly depict the wingless aphid nymph used in the experiment; labels must identify whichever stage the original art chooses rather than infer its identity solely from black colour.

## Original-art facts and limits

A clear broad-bean plant/stem with an attached aphid and an elongated grey/orange ladybird larva can supply the three original views. Use labels and supplementary text so anatomy is not an identification puzzle. The aphid's antennae and cornicles are different appendages; do not turn them into extra walking legs. A diagram showing feeding can indicate a small piercing/sucking mouthpart reaching plant tissue without a comic chewing mouth or bitten-out leaf hole. No exact microscopic scale or every diagnostic character is needed.

The predator must not have adult red spotted wing cases or wings. Grey elongated body and orange markings are supported schematic cues; independent art/science review must still check the rendered larva, visible appendages, plant contact and source-to-eater arrows. It is not a leg-count task, a new identification key or proof that a learner has recognised either insect outdoors. Original proportions are for clarity, not relative size. No source photograph, illustration, paper figure, morphology plate, page layout or source prose is copied; bibliographic access is not asset reuse permission.

## Arrow legend, genuine new action and existing seams

The required new lesson is **a stated legend determines what a directed link means**. Display **food → eater** persistently and explain that food supplies energy. A feeding link is not an instruction for an animal to travel, a timeline, one organism changing form, or a claim that a bean becomes an aphid and an aphid a ladybird. Plant sap is food taken from part of the first organism. Reversing the food arrow changes the represented relationship; merely reversing how a viewer reads the page does not change who eats whom.

Existing Living Garden habitat comparisons and Body Clues inspect named pictures but do not construct feeding links. Life Stages supplies inspect/connect/meaning/keep/revise and frozen-source patterns, but its same-individual/offspring meanings are biological continuity meanings and must not be reused as feeding results. Paris `dist/paris-pack-core.mjs` already has three-card/six-permutation ordering, yet ordering explicit passage events is not interpreting food direction. Reuse bounded controls/local presentation as useful; do not silently regrade chronology or lifecycle records under a new relation enum or generalize them into a universal abstract framework.

A minimum proposed action is inspecting the three supplied facts, selecting source food and eater for each of the two links, then interpreting the assembled pathway under its legend. Canonical semantic IDs and reviewed finite links are appropriate for that closed example. Do not keyword-grade prose, compare against one click sequence or claim the child independently discovered facts hidden from the illustrations. A selected arrangement, legend interpretation, optional explanation, support and familiarity remain distinct observations. Full task/state/UI design remains for the independent specification gate, not decided by this audit.

Frozen prior habitat, body-key and lifecycle sources/outcomes must remain their own records. No live classification heuristics, population model, field upload, photo/location collection, Café ingredient stock/reward linkage or automatic inference of transfer is justified. A new source snapshot should preserve its exact names/stages/food facts/legend and recorded outcomes without regrading old work against later biological wording. A visible food chain is a simplified relationship example, not a forecast of what removing an organism will do.

## Licensing, uncertainty and review boundary

Preserve Jane path notices and Marble attribution © Generative Spark, Inc. (Marble), ODbL1.0 database and CC BY-SA4.0 descriptive content. Topic meanings above are paraphrased; relation reasons are attributed taxonomy content. Primary facts inform original teaching content and schematic art; no source asset/prose is copied. Keep the runtime/source pin unchanged. This audit verifies narrow factual/source suitability, not the final diagram, task wording, accessibility, implementation, source-image rights for reuse, field-identification performance or learning gain. Independent specification/content review, actual original-art inspection and implementation review remain required before a release claim.
