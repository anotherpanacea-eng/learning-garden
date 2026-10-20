# Game ideas for the missing strands

**Planning proposal, 2026-10-20; developed from Claude’s [PR #16](https://github.com/anotherpanacea-eng/learning-garden/pull/16).** A companion to the [strand map](strand-map.md). The original proposal’s strongest ideas are retained below and folded into that map, with scope, dependencies and content conditions made explicit. These are outlines, not build-ready specifications or implemented lessons. Each selected slice needs a bounded spec and independent content review. Everything remains single-player, with optional human participation, local saves and no learner-data upload.

The village name Willowbank, town weather log, seasons and almanac come from the **separate, unimplemented [town-rebuilding proposal, PR #6](https://github.com/anotherpanacea-eng/learning-garden/pull/6)**. They are possible thematic dependencies, not features already available on this branch. The ideas below can start in the current garden without adopting that whole proposal.

## Why a second pass

The pinned Marble inventory contains **1,170 topics whose `ageRangeStart` is at most 9**, out of 1,590 topics. That is a metadata filter, not a recommended curriculum for a particular child. The current atlas declares 72 activity references across 42 topics in the complete inventory; those references are partial footholds, not comprehensive lesson coverage. An unlinked topic ID also does not prove no related learning takes place.

PR #16’s approximate area totals and prospective coverage numbers have been removed: overlapping domains, partial matches and new content requirements make them unsuitable for estimating what these sketches would teach. The useful finding is qualitative: our [map’s remaining gaps](strand-map.md#what-remains-outside-this-first-map) include broader living systems, Earth/space, history, money, language and computing. Some need new authored content in existing loops; others need genuinely different learner actions. None is filled merely by adding a theme or collecting cards.

## Two additions to the strand map’s framing

**A proposed eighth play pattern: collect · classify · connect.** Find an authored specimen, artifact or fact card; inspect its evidence; use a key or a stated rule; then connect it to a food web, life cycle, timeline or map. On a later visit, keep the specimen or claim but change the evidence or relationship. Classification is not the right action for every history question: an account may need comparison and corroboration instead. The Field Notebook is a candidate home; a future almanac could display the collection. Neither has a built classification engine. This is a proposal alongside the atlas’s seven existing patterns, not a new runtime declaration.

**Currency and history choices.** A first Market Day pack could use US dollars and cents, but must teach the chosen coin values explicitly and review its representations. Map concepts to Marble’s money topics without presenting dollars as pounds/pence. Historical exhibits should use specific reviewed places and times; UK-shaped source examples can be optional exhibits, not a universal history sequence. Historical thinking remains the core of the Archive.

## Shifts: new questions for existing or planned places

| Shift | Concept and useful contrast | Home and first revisit | Scope / dependencies |
| --- | --- | --- | --- |
| **Field Notebook: a data desk** | Strands 7/16: choose categories, tally, construct a labelled graph; a displayed chart versus a learner-made representation | Begin with a small clearly labelled Workshop/model dataset or authored example. Represent it two ways, then ask which answers a different question | **Planned outline.** Graph construction remains unbuilt. A weather log is an optional later source, dependent on PR #6 or its own spec; a real observation stays distinct from model/example data |
| **Market Day at the café** | Strand 21: number of coins versus value; equivalent payments; price versus amount tendered | Make one amount two ways, buy a pretend item, then find change; later compare affordability or a stall’s stated costs and receipts | **Planned outline.** Separate economy from café stock until explicitly designed; no real money or personal financial records. Foundations, change and budgeting need separate reviewed slices |
| **Minibeast meadow with Dot** | Strand 13: shared habitat versus shared body feature; one organism at different life stages | Inspect authored specimens with a small key, connect dated caterpillar/butterfly cards, then test a new specimen against the same key | **Planned outline.** Scope an initial insect key to reviewed, visibly complete **adult** specimens. Six visible legs is not a universal key for all life stages or obscured/damaged pictures. Body functions remain a separate missing sequence |
| **The bell tower keeps time** | Strand 5: a time of day versus elapsed duration | Set/read a pretend clock, work out when the post leaves, then change the departure time | **Optional sketch.** No real-time deadline. Clock conventions, units and duration need a first spec; PR #6’s calendar/seasons are not built dependencies |
| **Bell rhythm studio** | Strands 4/15/20: beat versus rhythm; pitch versus loudness; duration fractions of an explicitly chosen whole | Reproduce a short pattern, transform it, then compose a response for the Loft | **Optional sketch.** Specify time signature/unit and the sound model; bell size alone does not define every instrument’s pitch. Physics, notation and creative work need distinct teaching aims |
| **The mill’s gears** | Strand 15: rotations of one gear versus another; motion versus force explanation | Compare two pictured gear pairs, then predict a new pair | **Optional Workshop sketch.** A reviewed model must state gear size/tooth count, direction and idealisations; pulleys are a later slice |
| **Lanterns and circuits** | Strand 15: material appearance versus conductivity; open versus closed circuit | Complete one low-voltage model circuit, predict a swap, then compare the result | **Optional Workshop sketch.** Define the model and adult-supported practical limits. Winter lanterns from PR #6 are thematic, not prerequisite functionality |
| **Erosion at the footbridge** | Strands 14/16: water soaking in versus running off; observation versus explanation | Compare specified surfaces under the same model rain, then explain what changed | **Optional storm-drainage sketch.** No local runoff model exists yet. State rainfall, slope, soil/cover and limits before claiming a controlled comparison or flood-safety relevance |
| **Notice board repair** | Strand 11: intended meaning versus what punctuation lets a reader recover | Revise an original fictional notice for a reader, compare readings, then write a new notice | **Optional Post Office/Loft sketch.** Review capitals, sentence boundaries and later punctuation in meaningful small slices; multiple phrasings may work. Not a complete grammar sequence |
| **Story Loft feelings** | Strand 23: a pictured clue versus certainty about someone’s feelings | Offer several interpretations of a fictional puppet, change a scene, then ask the human audience | **Optional outline.** Unscored, fictional characters only; no stored real-child mood check-in or automated inference |

## New games and later content packs

These retain PR #16’s proposed settings. Their order is a discussion aid, not a validated estimate of development cost or curriculum coverage.

**1. Fossil bank after the storm** (strands 13/16/19; geology and palaeontology).
The storm reveals an **authored safe scene** of a riverbank outcrop, not an invitation to enter unstable flood banks. Brush a pictured find, record its layer and observable features, then compare two reconstructions. A trackway may support some interpretations without deciding speed or social grouping. “Lower is older” applies only to the specified undeformed, unreversed sequence of deposited layers; later cases can challenge the simple model. Mary Anning could appear in an attributed, reviewed historical source card. No fossil lesson exists yet; first bound one evidence question and its model assumptions.

**2. Postcards from a migrating bird** (strands 13/18/10).
Keep the Arctic tern pen-pal idea as a candidate, with actual routes, dates, species and season reviewed before authoring. Migration is a reason to encounter particular coasts and oceans, not a licence to put the same species in every habitat. Read an offline authored postcard, inspect a picture, then reply with a field-guide card or map annotation grounded in that evidence. Reuse Paris/Post Office interaction patterns; each location needs new reviewed content. No fixed “returns each spring” promise without specifying hemisphere and population. No prospective topic-coverage count is claimed.

**3. Teach the sorting robot** (strand 17).
A clockwork sorter first follows a **visible hand-written rule**; later an explicitly defined small classifier learns from labelled examples. Specify its features, inference rule, tie/unknown behaviour and output before scripting its mistakes. A red-apples/green-pears example only works if the selected model actually uses colour and the training set supports that inference; the robot must not appear to infer an arbitrary rule by magic. Compare a counterexample, revise the data or rule, and test a fresh item. No live AI or learner-data upload is needed. This is an outline, not an implemented classifier.

**4. Willowbank town meeting** (strand 23 and speaking/listening).
Neighbors disagree about bridge and roof repairs. Hear reasons, notice a missing perspective, propose a plan and explain a trade-off. Several answers can be defensible. This is a fictional human-partner conversation attached to the Loft/community circle, not a scored empathy test or a demand for personal disclosures.

**5. Travelers’ Archive exhibits** (strand 19).
Keep [spec 24](specs/24-travelers-archive.md)’s planned historical-source focus, with its actual place/time still to be selected and reviewed. Two fictional storm accounts could introduce perspective, but must be labelled fiction rather than historical evidence. Later a museum crate—a scribe’s palette, coin or key—asks what an attributed artifact can and cannot tell us. Each exhibit needs its own source pack; no broad period is covered by one object.

**6. Night-sky log** (Earth/space).
With an adult, optionally record a moon shape actually observed and the date/time context. Distinguish **not observed**, **obscured by cloud**, and an observed phase; do not substitute a predicted phase for an observation or treat no sighting as a new moon. Compare observations with a clearly labelled authored/predicted model. Optional outdoor observations need no location collection or nightly streak. This could reuse a future notebook, but the weather log is not built and “cheap once it exists” is not established.

**7. Chance at the seed stall** (strand 7).
A pictured bag contains five sunflower tokens and one poppy token. State the sampling model: a fair draw, **replace the token and mix before every repeat**. Predict, draw, tally and compare repeated small samples before changing the bag; a short run need not match the theoretical fraction. A later without-replacement case deliberately changes the conditions and updates the bag. These are simulated tokens and example data, not biological sampling or gambling; the first probability lesson is still missing.

## Off-screen or left out

- **Handwriting and dictation** (strand 8): optional adult-supported paper work, with no inference about transcription from a screen choice or narrated answer. A future local printable can support it; that tool is not built.
- **Human body:** still needs reviewed content. A fictional builders’ lunch or model lever is a possible opening, not evidence that nutrition or body systems are covered.
- **Mood check-ins or feelings logs:** not proposed. Keep fictional emotional vocabulary separate from sensitive records about a child.

## What to build first—and what stays next

The [three bounded spiral increments](curriculum-spirals.md#first-three-playable-increments) remain the scoped next work: **equal-group unknowns**, **a message for a reader**, and **plant conditions with dated observations**. This integration does not replace them with three new games or treat their review as complete.

PR #16 supplies strong follow-on candidates:

1. **Field Notebook data desk:** extend the plant/table slice to learner-made charts, or specify a standalone example-data slice if that is the chosen priority. It does not need the whole town/weather system.
2. **Minibeast meadow:** the first bounded collect · classify · connect pack, contingent on reviewed specimens/key/life-cycle content.
3. **Market Day:** begin with coin values and equivalent payments, then separately specify change and budgeting. This opens a genuinely new mathematical action in the café; it does not fill the whole money strand at once.

The fossil bank, migration postcards and sorting robot are later candidates whose distinct evidence models/content justify further design. Select one based on a named missing step, available reviewed material and implementation effort—not hypothetical topic totals. None of these sketches adds a runtime graph edge, recommendation or learner record.

## References and reuse

This fold studies Claude’s PR #16 and the same sources checked for the strand map on 2026-10-20: pinned Marble `96a7933754af672e1bfdbf7ecb05c325860c6e0d`, refreshed Marble `be584a1f89a187b6e1dcbde98576c326e635ff27`, and Jane `LESSONS.md` at `385f644d6ffcd5f80f809888591d871a074b7855`. Topic descriptions/evidence inform gaps; Jane’s purposeful quests, small worked examples, matching/ordering and support formats inform proposed interactions. Its mastery, points, locks and learner-data system are not adopted. This is design-only reuse: no new upstream code, lesson prose, experiment assets or taxonomy data is incorporated. Preserve the [existing attribution and path-specific licences](upstream-opportunities.md#source-and-license-boundaries) when a later build adopts actual material. Science, history, currency and audio sources must be checked for each selected content pack before implementation.
