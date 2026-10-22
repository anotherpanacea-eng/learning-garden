# Other routes through the six acts: strategies and game proposals

**Proposal, 2026-10-21 (Claude, Code-Mac).** A companion to [spec 49](specs/49-six-act-curriculum.md), the [strand pathways](six-act-strands.md) and [game ideas for the missing strands](curriculum-gaps.md). Like those, it is planning, not a build-ready specification, a coverage claim or a release decision. Every selected item still needs its own bounded spec, content review and independent review. Everything stays single-device, local, untimed and unscored, with no learner-data upload, learner model, levels, locks or streaks.

## 1. What the current route does well, and where it narrows

The method behind specs 38–58 is sound. Each game makes one distinction visible with a controllable model, contrasts it with a near miss, keeps the learner's work frozen and revisable, and revisits the idea in a changed setting. The town story gives every game a reason to exist. The proposals below keep that method and that story. They question whether one bounded manipulative per distinction can be the *only* route.

Measured on the current stack tip (`build/cartographers-table`, `curriculum/topic-coverage.csv`):

- **74 of 1,590 topics** carry any scoped activity reference.
- **34 of 54 domains, holding 781 topics, have none at all.** The largest are Grammar & Punctuation (75), Weather & Climate (30), Ancient Egypt, Ancient Greece & Rome and Dinosaurs (29 each), Energy and Volcanoes (28 each), Algebra (25), The Human Body (25), Spelling (24) and Speaking & Listening (21). Probability, Ratio & Proportion, Money & Finance, Learning to Learn and all six personal and social domains are also empty.

These are reference counts, not measures of learning, and spec 49 already says so. They still show where the route narrows:

1. **Throughput.** Each new distinction has needed a new game shell, spec, source audit, review and build. That cost is right for a new kind of action. It is too high as the only way to add content, and at this rate Acts III–VI stay out of reach.
2. **One mode.** Almost everything is solo, on-screen manipulation. Off-screen work, talk with a person and physical investigation appear only as unrecorded invitations. Yet speaking and listening, cooperation, handwriting, sustained reading and real experiments can only happen there.
3. **Knowledge.** The plan is rich in skills and thin on knowledge. The 231 specialist topics in history, biomes/ocean and deep time/space need a way to build knowledge, not one manipulative per fact.
4. **Memory over time.** Games revisit ideas by design, but nothing brings an earlier idea back after a gap. Spaced retrieval is one of the best-supported and cheapest learning effects available, and the app barely uses it.

## 2. Two signals from the Marble graph

Neither signal is a placement or readiness claim. Both are authoring-order hints only.

- **A ready frontier.** 56 unreferenced topics have every hard prerequisite among the 74 already referenced. They cluster in foundations the current games almost reach: place value (7), measurement (10), fractions (8), multiplication and division (5), counting (4), geometry (4) and addition and subtraction (4). Examples include "A Hundred Is Ten Tens", "Comparing fractions", "Area by Tiling", "Missing number problems", "Linear number sequences" and "Changing Your Mind with Evidence". These are the cheapest next lessons, and several fit existing games as new content rather than new shells.
- **Open doors.** 208 unreferenced topics have no hard prerequisite at all: Science 91, English 42, Personal & Social Development 19, History 14 and Mathematics 33. A knowledge route can start any of them without waiting for the maths sequence.

## 3. Strategies: distinct ways to reach the same acts

Each strategy is a route through the existing story, not a new world.

### 3.1 The town remembers (spaced, interleaved retrieval without scores)

Days after a game, a neighbour brings back its idea in a new form. Pip asks how many trays served six guests; the courier needs last week's route reversed; Bramble poses one mixed errand that needs both a fraction and a map. These moments reuse the existing invitation/suggestion pattern. They are always optional, and a wrong or skipped answer changes nothing except what the neighbour says next. Spacing can follow visit count or elapsed days ("dates can suggest a return without deadlines," as [upstream opportunities](upstream-opportunities.md) already allows). Mixed errands interleave problem types, which helps learners choose a method rather than repeat one.

- *Evidence:* retrieval practice (Roediger & Karpicke, 2006); distributed practice (Cepeda et al., 2006); interleaved mathematics practice (Rohrer & Taylor, 2007).
- *From Jane:* the spaced review gates, without the gate. A review never stands between the learner and a destination.
- *Boundary:* no due queue shown to the child, no counts, no overdue state. The selection rule stays as local and explicit as spec 30's.

### 3.2 Teach the apprentice (learning by teaching)

Spec 49's finale brings a new apprentice the learner can help begin. Bring that apprentice in early. The apprentice tries a task and makes a plausible mistake, taken from the contrast each spec already names: adding 100 mL to both jars instead of another whole batch, counting cells instead of points on the map, changing two ramp settings at once. The learner works out what went wrong, shows the fix on the same manipulative, and picks the explanation that would help.

- This turns every existing contrast into a teaching moment *without grading prose*. The learner diagnoses and demonstrates; any spoken explanation goes to a human.
- *Evidence:* the protégé effect with teachable agents (Chase, Chin, Oppezzo & Schwartz, 2009; Biswas et al., Betty's Brain).
- *Story fit:* the apprentice is Act VI's "help someone begin", earned gradually rather than appearing only at the end.
- *Boundary:* the apprentice's mistakes are authored per contrast, never generated. The apprentice never "learns" in a way that implies a learner model.

### 3.3 Two seats (asymmetric parent–child play)

Make the adult a designed second player rather than an optional helper. Use information-gap tasks: one player sees the map and gives directions while the other moves the courier; one holds the recipe card and the other pours; one has the fossil photo and the other the field guide. Run it as pass-and-play on one device, or with a printable second view.

- This is the first designed route for Speaking & Listening (21 topics) and Friendship & Cooperation (17), and it suits the "parent-guided" premise.
- *Boundary:* nothing is recorded about the conversation, and a single player can always do the task alone with the information shown.

### 3.4 Field kit (the real world as a first-class route)

The plan rightly keeps model data separate from real observation, but the real side barely exists. A field kit is a set of short printable or on-screen mission cards for the kitchen, garden or a walk, done with an adult:
- measure a real jug against the Measuring Kitchen picture;
- grow two cress pots in different light;
- write the café's notice by hand;
- record the moon on three nights.

The town responds in story ("the gardener pinned your note up") to an adult-chosen outcome such as "we did it" or "it surprised us". That outcome is never treated as data, mastery or a measured value.

- This gives handwriting, physical measurement and real investigation a route that the screen cannot fake.
- *Boundary:* no photos, locations or free-text results are collected. A real result never feeds a model or a chart as if it were the model's data.

### 3.5 Library read-alouds (a knowledge route)

Short illustrated nonfiction "almanac" books, one series per knowledge pack (Ancient Egypt, Polar Regions, The Human Body, Volcanoes…), read aloud by the adult. Each book carries printed dialogic prompts (what, why, what next; Whitehurst et al., 1988). It ends with one collectable card for the Notebook or Archive. Later errands ask about what the book taught, which is retrieval again (3.1).

- Background knowledge strongly affects comprehension (Recht & Leslie, 1988). This route builds knowledge directly instead of waiting for skills games to reach it.
- A human voice also sidesteps the browser-speech and recorded-audio dependencies that block some packs.
- *Boundary:* each book is a reviewed source pack with real facts and citations. History stays real history, never a costume for the town. Collecting a card is not evidence of understanding.

### 3.6 Packs, not shells (throughput)

The app already has a few task grammars that work, each currently written as a one-off:
- ordering cards;
- sort-by-key;
- compare two sources;
- a literal runner;
- A/B comparison;
- build/transform.

Make four or five of them data-driven, as story packs already are ([spec 12](specs/12-reviewed-story-packs.md)), so that a grammar lesson, a biome pack or an Egypt crate is reviewed *content* in an existing grammar rather than a new game. This is Jane's quest-pack idea with its mastery engine removed. Each pack still gets source and content review, but no new runtime, state model or spec per distinction.

- *Boundary:* spec 49 forbids a universal simulation engine and a learner model. This proposal adds neither. It generalises the content format of a few existing interactions, each with its own validation, frozen-source and recovery patterns.

### 3.7 The learner sets the problem (problem posing)

Turn existing tools around. The learner makes a Bramble challenge for the apprentice, sets a map puzzle for the parent, writes a recipe request the café must fill, or designs a fair test someone else will run. Posing a problem requires understanding its structure, and it gives Act V's "a question of your own" an early, small rehearsal.

- *Boundary:* the posed problem is checked mechanically for solvability against the model, never graded for quality.

## 4. New games

Each game below adds a *new kind of action* and targets a strand with no references, so it isn't a re-skin. Acts and strands follow [the strand pathways](six-act-strands.md).

### 4.1 Willow Path, a linear number board game (Acts I–II; M1, M7, L3, E5)

A two-player board in the town (1–100, numbered left to right in rows), played with a spinner and two tokens, child and adult. Landing squares carry small town events. Variants extend it: a fraction trail board (0 to 3 in eighths, Act II), a river board crossing zero (Act IV signed quantities) and a hundreds board (Act II place value).

- *New action:* moving along a linear number track by counting on.
- *Why:* playing linear (not circular) number board games improved young children's numerical magnitude estimation in controlled studies (Siegler & Ramani, 2008, 2009). It covers several frontier topics (counting forwards and backwards, 10 more or 10 less, comparing and ordering numbers) and gives two-seat play a home.
- *First slice:* 1–100, one spinner, counting-on support, no winner required (both reach the bridge).

### 4.2 The Balance Stall (Acts II–III; M4 Algebra, 0 references)

A market weighing stall with sealed parcels of unknown weight and known weights. Keep the pans level by doing the same to both sides, find what one parcel weighs, then read the stall's ledger line as an equation (x + x + 3 = 11).

- *New action:* balance-preserving moves on both sides.
- *Why:* the pan balance is a well-studied model for early equation solving (review: Otten, van den Heuvel-Panhuizen & Veldhuis, 2019). It opens M4-II "balance/equality" and the frontier "Missing number problems", and it shares Coin Counter's market.
- *Contrast:* changing one pan only, against changing both pans.
- *First slice:* whole-number weights and one unknown type. Negative quantities and subtraction from both sides come later; the review notes the model's limits there.

### 4.3 The Print Shop (Acts II–IV; E2 Grammar 75 topics, E4)

The town printer sets notices and later the newspaper. Combine two short sentences into one, split a run-on, move a describing phrase, add the punctuation a reader needs. The literal reader from spec 54 shows what each version lets a reader recover ("who has the key?").

- *New action:* sentence combining and expanding with movable phrase cards.
- *Why:* sentence combining is among the strongest writing interventions in the Writing Next meta-analysis (Graham & Perin, 2007). It also gives the 75 grammar topics a meaning-first home instead of a drill.
- *Act IV:* the newspaper's competing explanations chapter can reuse it.
- *Boundary:* several versions are valid; the literal reader shows meaning, not a "correct sentence".

### 4.4 Sound-it-out with a human voice (Acts I–II; E1)

Brief 55 is blocked on recorded audio. A parent-voiced variant unblocks it. The app shows grapheme tiles and a short script for the adult ("say /m/ as in *map*"). The child builds, changes and blends words with the tiles while the adult models the sounds, then the pair read a decodable micro-story about the town together.

- *New action:* building words from grapheme tiles while a person models the sounds.
- *Why:* systematic phonics instruction has strong evidence (National Reading Panel, 2000; Ehri et al., 2001). The binding constraint here has been audio, and an adult supplies that.
- *Boundary:* linguistic content review is still required; only the audio dependency moves. The app records nothing about pronunciation or decoding.

### 4.5 Museum crates (Acts III–IV; H1, H2, 83 topics)

One reviewed crate per period (Egypt, Greece/Rome, medieval, and beyond Europe as spec 49 asks), arriving at the Travelers' Archive. Each crate holds:
- a read-aloud chapter (3.5);
- three sourced artefact images under clear open licences;
- a timeline placement;
- two interpretations of one artefact to compare ("what can this tell us, and what can't it?").

- *New action:* artefact-to-claim reasoning across periods, using the Archive grammar (3.6) as content packs.
- *Boundary:* actual history from reviewed sources, separate from the town story; fiction is labelled as fiction.

### 4.6 Seasons Garden, a bounded model (Acts II–IV; S3, M6, S7)

A small garden model with stated rules: plants need water and light, pollinators visit flowers, weather varies within stated bounds. The learner sets one condition, runs a season, and charts the result in the Field Notebook. Act IV's "puzzling change in the garden" becomes a real investigation in this model.

- *New action:* running a stated multi-season model and comparing runs.
- *Why:* it is the only route to ecology and data with variation over time.
- *Boundary:* spec 49 requires the model's units, assumptions and conservation rules in its own spec. Results are labelled as model effects, never field evidence.

### 4.7 The Seed Stall, chance (Acts III–IV; M6 Probability, 0 references)

Promote the existing [curriculum-gaps](curriculum-gaps.md) outline: a bag of seed tokens with a stated draw-and-replace rule. Predict, draw, tally, compare repeated small samples, then change the bag.

- *Contrast:* a short run against the long-run proportion.
- *Two-seat variant:* each player designs a bag for the other to guess.

### 4.8 The Town Council (Act IV; E3, E4, L3, H1)

A structured disagreement: a proposal for shared land, with authored evidence cards, authored objections and several defensible plans. The learner builds a case from evidence, answers an objection, and may revise the plan. Bramble sometimes argues the better side.

- *Two-seat variant:* the adult argues the other side, using the same cards.
- *Boundary:* facts, model assumptions and values stay distinct, as spec 49 requires. No plan is graded right, and no empathy or virtue inference.

## 5. Suggested order

Cheapest, most distinct and best supported first:

1. **Teach the apprentice (3.2), as a layer over two existing games** (gathering trays and Fair Test Bench), reusing their named contrasts. It needs no new shell, and it tests the strategy before spreading it.
2. **Willow Path (4.1) with two-seat play (3.3).** One small board, strong evidence, several frontier topics and the first designed speaking and cooperation route.
3. **The Balance Stall (4.2).** It opens algebra in an existing market.
4. **The town remembers (3.1)** across games that already exist, once there are enough frozen artefacts to revisit.
5. **Packs, not shells (3.6), proved on one grammar** (sort-by-key or compare-two-sources) with one Library book plus a crate (3.5, 4.5). This is the throughput test for the 781 empty-domain topics.

The Print Shop, Sound-it-out with a human voice, Seasons Garden, the Seed Stall, the Town Council and the field kit follow as their content is reviewed.

## 6. What this proposal does not change

- Story acts and teaching sequences stay distinct.
- No source edge is added to the Marble graph.
- No coverage is claimed beyond delivered activities.
- The saved-work rule stays as written: validate saves on ids, counts and outcomes; never against today's wording or rules; keep the rest of a game open when one item can't be read.
- No game, strategy or pack gates a destination or records more about a child than the existing local saves do.

## References

- Biswas, G., Leelawong, K., Schwartz, D., Vye, N., & TAG-V (2005). Learning by teaching: A new agent paradigm for educational software. *Applied Artificial Intelligence*, 19(3–4).
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin*, 132(3).
- Chase, C. C., Chin, D. B., Oppezzo, M. A., & Schwartz, D. L. (2009). Teachable agents and the protégé effect. *Journal of Science Education and Technology*, 18(4).
- Ehri, L. C., Nunes, S. R., Stahl, S. A., & Willows, D. M. (2001). Systematic phonics instruction helps students learn to read. *Review of Educational Research*, 71(3).
- Graham, S., & Perin, D. (2007). *Writing Next.* Alliance for Excellent Education.
- National Reading Panel (2000). *Teaching Children to Read.* NICHD.
- Otten, M., van den Heuvel-Panhuizen, M., & Veldhuis, M. (2019). The balance model for teaching linear equations: a systematic literature review. *International Journal of STEM Education*, 6.
- Recht, D. R., & Leslie, L. (1988). Effect of prior knowledge on good and poor readers' memory of text. *Journal of Educational Psychology*, 80(1).
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science*, 17(3).
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35.
- Siegler, R. S., & Ramani, G. B. (2008). Playing linear numerical board games promotes low-income children's numerical development. *Developmental Science*, 11(5); (2009) *Journal of Educational Psychology*, 101(3).
- Whitehurst, G. J., et al. (1988). Accelerating language development through picture book reading. *Developmental Psychology*, 24(4).

Marble Skill Taxonomy v1, © Generative Spark, Inc. (Marble), https://withmarble.com; counts above are derived from the pinned graph and the repository's coverage index under the existing [NOTICE](../NOTICE). Jane is cited as design study only; no Jane code or prose is incorporated.
