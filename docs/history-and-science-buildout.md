# History and science build-out: forty-eight packs

**Merged proposal inventory, updated 2026-10-25.** Specs 133–180 are 48 history/science proposals, each with companion text and a source audit. Their PR and repair reviews are complete; the named subject/source, language, art, finite-model and implementation gates remain. None of these packs is implemented. The five waves below describe how the writing was produced, not a delivery order. The [current roadmap](roadmap.md#new-material-status-and-next-builds) chooses work under the owner's five priorities; the [delivery families](#delivery-families-and-first-slices) below make the inventory usable one slice at a time. Story links are future adapters to the merged [spec 120 proposal](specs/120-keeper-of-the-ways.md); each pack also works as an open standalone destination when built.

## Why

The owner asked for stories, games, lessons and problem sets that build out the history and science curriculum. On the pinned Marble graph (`96a7933`), **21 of the 637 History and Science topics** have any declared reference in `curriculum/topic-coverage.csv`. Ancient Egypt, Greece and Rome, and Medieval Times have none. Neither do Space, Weather and Climate, Volcanoes and Earthquakes, Earth's Systems, the Human Body, Ocean Life, Polar Regions, Rainforests or Animals of the World. Spec 49 says no subject may disappear because it does not fit the town metaphor, and its strand plan asks for "substantive history/science knowledge packs" with real information, sources, contrasts and meaningful tasks (six-act strands, *Knowledge, practice and human observation*). The original sixteen-pack pass grew into the 48-pack inventory below. The counts in this first-pass table are an authoring snapshot; proposal files add no declared encounters.

| Subject | Domain | Pinned topics | Declared at authoring | Packs here |
| --- | --- | ---: | ---: | --- |
| History | Historical Thinking | 7 | 3 | 133, and source work in 134-138 |
| History | Ancient Egypt | 29 | 0 | 134 |
| History | Ancient Greece & Rome | 29 | 0 | 135, 136 |
| History | Medieval Times | 25 | 0 | 137, 138 |
| Science | Earth's Systems; Volcanoes & Earthquakes | 46 | 0 | 139, 140 |
| Science | Weather & Climate | 30 | 0 | 140 |
| Science | Space Exploration; Space Systems & Earth's History | 42 | 0 | 141 |
| Science | Dinosaurs & Paleontology | 29 | 1 | 142 |
| Science | Ocean Life | 27 | 0 | 143 |
| Science | Animals of the World; Polar Regions; Rainforests | 77 | 0 | 144 |
| Science | Matter & Materials | 40 | 1 | 145 |
| Science | Waves, Light & Sound | 25 | 1 | 146 |
| Science | Energy (with Forces & Motion) | 55 | 2 | 147 |
| Science | The Human Body (with Organisms) | 88 | 1 | 148 |

The target topic ids in each spec are candidates for a reviewed reference, never coverage claims. No atlas, coverage file or Marble pin changes in this proposal.

## The packs

| Spec | Pack | Home | What the child does | Strands |
| --- | --- | --- | --- | --- |
| [133](specs/133-long-line.md) | **The Long Line** | `#archive/timeline` | Orders and places events on a timeline that switches between "in a row" and "spaced by time"; counts across BCE/CE (no year 0); names centuries; zooms out to deep time. Willowbank's story events sit on their own strip and never mix with history. | H1, M1, S8 contrast |
| [134](specs/134-nile-year.md) | **The Nile Year** | `#archive/nile`, plus a Library reading | Ancient Egypt through the yearly flood: black land and red land, the three seasons, nilometers (each counted from its own zero, like Hollis's post), the 365-day calendar, scribes and numerals, how we know (Rosetta Stone, archaeology ethics), and the Aswan dam as then-and-now. | H2, H1, S7 |
| [135](specs/135-roads-and-water.md) | **Roads and Water** | `#archive/ways`, `#workshop/aqueduct` | Roman roads, milestones and Roman numerals, paces and miles, aqueducts that run on gentle slope alone (the Nîmes channel and Pont du Gard), and a Channel Bench where the child routes water across a made-up valley. | H2, M1, M5, S6 |
| [136](specs/136-who-gets-a-voice.md) | **Who Gets a Voice?** | `#archive/athens` | The assembly at Athens before Act IV's town meeting: sort surviving evidence (ostraka, the kleroterion) from interpretation, run a model allotment, and see one made-up decision come out differently under four rules for who votes. Who was left out is part of the lesson. | H2, H1, L3, M6 |
| [137](specs/137-mills-bridges-pilgrims.md) | **Mills, Bridges and Pilgrims** | `#archive/valley` | A medieval valley: the manor and the lord's mill, the Domesday survey, the pilgrim road over the Pyrenees at Roncesvalles, bridges, markets, guilds and women's work; legend or history? | H2, H1, L1 |
| [138](specs/138-keepers-of-books.md) | **Keepers of Books** | `#archive/keepers` | Record-keepers beyond Europe: Timbuktu's family libraries and Mansa Musa, Baghdad and al-Khwarizmi, Song China's water clock and movable type. A numeral bench compares Roman, Egyptian and place-value numerals; copy-or-print and paper-care benches. | H2, H1, M1, C1 |
| [139](specs/139-how-the-mountains-got-here.md) | **How the Mountains Got Here** | `#workshop/rocks` | Rock families and the rock cycle, a Layer Stack where a fold turns the order over, a Pebble Tumble for slow change, plates and the Pyrenees collision, sea fossils high in the mountains, earthquakes and volcanoes. | S7, S8 |
| [140](specs/140-weather-station.md) | **The Old Weather Station** | `#science/station` | Restores and reads real instruments (gauge, thermometer screen, vane, anemometer, barometer), runs a water-cycle loop, sorts weather from climate, and works a made-up 30-year rainfall record where one wet year is not a trend. | S7, S1, M6 |
| [141](specs/141-sky-watching-night.md) | **The Sky-Watching Night** | `#library/roof` | Spin and orbit, seasons from tilt, a phase bench, a Scale Walk from the bakery to the bridge with real proportions, and Galileo's notebook with reconstructed positions of Jupiter's moons. | S8, M5, H1 |
| [142](specs/142-footprints-by-the-ford.md) | **Footprints by the Ford** | `#living/trackways` | Real dinosaurs and fiction, teeth and diet, fossils and deep time, birds as living dinosaurs; a Trackway Table that estimates hip height and walking or running, always as ranges, including a trackway where the honest answer is "can't tell". | S8, S1, M3 |
| [143](specs/143-letters-from-the-coast.md) | **Letters from the Coast** | `#post/postcards` | Postcards signed "H." open ocean lessons: tides on a clock bench, a rock pool at low tide, food-web arrows, mammal or fish, depth zones. | S4, S3, S7 |
| [144](specs/144-ways-of-the-birds.md) | **The Ways of the Birds** | `#living/pass` | A morning's bird count at a fictional pass on the real western-Pyrenees flyway; mapping a stork's and a swallow's journeys; why birds migrate; habitat postcards from the Arctic to the rainforest. | S3, S4, M6 |
| [145](specs/145-bakers-window.md) | **The Baker's Window** | `#science/bakery` | Changes you can undo and changes you can't: melting versus dissolving, a closed-jar scale for conservation of mass, getting things back by sieve, filter or evaporation, particle pictures. | S5 |
| [146](specs/146-bell-and-drum.md) | **The Bell and the Drum** | `#studio/sound` | Louder versus higher as two separate dials, sound through solids, liquids and gases (not space), a bell's sound down a made-up valley, the thunder count. | S6 |
| [147](specs/147-mills-energy.md) | **Where the Mill's Energy Goes** | `#mill/energy` | Follows energy from sunlight to bread, a wheel bench with friction, a perpetual-motion detective for Bramble's self-filling wheel, renewable and non-renewable sources. | S6 |
| [148](specs/148-where-pips-supper-goes.md) | **Where Pip's Supper Goes** | `#living/journey` | A generic person's body (never the child's): the supper journey through digestion, tooth match with a fox comparison, a red blood cell's loop, which system?, and how Harvey's evidence overturned an old idea. No body data anywhere. | S2 |

## Second wave: ten more packs (specs 149 to 158)

Written the same day, after the first sixteen, for the largest gaps left on the pinned graph: topics with a declared reference in `curriculum/topic-coverage.csv`: Ecosystems & Habitats 3 of 36, Organisms & Life Processes 1 of 63, Rainforests 0 of 25, Polar Regions 0 of 25, Forces & Motion 1 of 27, plus Insects & Minibeasts (5 of 22) and Scientific Inquiry (4 of 30), plus the history topics the first wave left untaught (Egyptian beliefs, Roman myth and legacy, Vikings and castles). They follow the same contract, were fact-checked in a second pass and independently reviewed, and were proposed in three further PRs, now merged as writing.

| Spec | Pack | Home | What the child does | Strands |
| --- | --- | --- | --- | --- |
| [149](specs/149-orchard-year.md) | **The Orchard Year** | `#orchard/year` | One apple tree through the four festivals: parts of a plant, a bean jar, a pollination bench (the plant's side), seed travel, a dye-stalk series; at Keeper's Desk, van Helmont's willow (right about soil, wrong about water alone) and photosynthesis. | S3, S1 |
| [150](specs/150-bee-meadow.md) | **The Bee Meadow** | `#living/meadow` | The insect body plan, complete and incomplete metamorphosis, a hive window, the waggle dance on a labeled made-up distance rule, pollen paths (the bee's side), camouflage and mimicry, and what helps insects. | S3, S4 |
| [151](specs/151-meadow-comes-back.md) | **The Meadow Comes Back** | `#living/regrowth` | Hob's flooded water-meadow surveyed over five visits: living, dead or never alive; reading and editing food webs (arrows match specs 66, 88, 143); the rot log and matter cycling; succession after a flood; energy loss between levels at older depth. | S4, S3, M6 |
| [152](specs/152-up-through-the-canopy.md) | **Up Through the Canopy** | `#library/canopy` | Rainforests from a box of seed and leaf cards: where they are, layers by light, drip tips and buttress roots, the forest's own rain, thin soil, the Yanomami and Baka in the present tense, foods, temperate rainforests, and trade-offs at Keeper's Desk. | S4, S7 |
| [153](specs/153-cold-shelf.md) | **The Cold Shelf** | `#library/poles` | Arctic or Antarctic, midnight sun and polar night (reusing spec 141's tilt), a keep-warm bench, polar food chains, sea ice versus ice sheets, the Inuit and Sámi, the race to the South Pole told gently, the Antarctic Treaty, calm polar change. | S4, S7, S8 |
| [154](specs/154-ramps-levers-hoist.md) | **Ramps, Levers and the Mill Hoist** | `#mill/hoist` | Touch or gap (contact and non-contact forces), an arrow board for balanced and unbalanced forces, a drop door with a Moon switch and Galileo's ramp, a lever and pulley bench that states its trade-off, a magnet sweep. Energy stays in 147. | S6, M5 |
| [155](specs/155-question-bench.md) | **The Question Bench** | `#science/questions` | A thinking toolkit for Act V: wonder to testable question, change/measure/keep, repeats and spread, hidden cause versus real cause, predict and change your mind, with continental drift as the real case of science revised. Builds on the built Fair Test Bench. | S1, M6 |
| [156](specs/156-houses-of-forever.md) | **Houses of Forever** | `#archive/forever` | Egypt beyond the river: pyramids and who built them (honest about uncertainty), gods and the afterlife labeled as belief, the weighing of the heart at older depth, who did what, trade with Punt and Lebanon, and museum care for human remains. | H2, H1 |
| [157](specs/157-myth-ash-empire.md) | **Myth, Ash and Empire** | `#archive/myths` | "What kind of thing is this?" for Greece and Rome: Romulus and Remus against the Palatine huts, linked gods, the Parthenon's many lives, Pompeii through bread and wall notices, Latin in Nuria's and Léon's words (Basque as contrast), and 476 as a convention. | H2, H1, L1 |
| [158](specs/158-castles-and-longships.md) | **Castles and Longships** | `#archive/castles` | Vikings as traders, settlers and raiders (horned helmets as a later costume), castles in order of design, clothing and dyes, the Bayeux embroidery as a source with a point of view; the Black Death in an opt-in Keeper's Desk folder. | H2, H1 |

Owner questions from the second wave, with defaults: **one observation hive** in 150, with a card saying most bees are wild and solitary; **Scott's death** in 153 only as a short Keeper's note; the **weighing of the heart** in 156 at Sapling and Keeper's Desk only; the **Black Death** folder in 158 opt-in at Keeper's Desk; the **Yanomami, Baka, Inuit and Sámi** cards (152, 153) read by community or specialist reviewers before build; **Puff's pronouns** (none used) settled once in spec 120.

## Third wave: seven more packs (specs 159 to 165)

A third pass in the same session went after domains the first two waves touched only at the edges. Declared references in `curriculum/topic-coverage.csv`: The Human Body 0 of 25, Organisms & Life Processes 1 of 63, Waves, Light & Sound 1 of 25, Energy 1 of 28 (the circuit topics among them unmapped), Space Exploration 0 of 26, Ancient Egypt 0 of 29 and Ancient Greece & Rome 0 of 29. Same contract, fact-check pass and independent review; three now-merged proposal PRs (#143, #144, #145).

| Spec | Pack | Home | What the child does | Strands |
| --- | --- | --- | --- | --- |
| [159](specs/159-puppets-bones.md) | **The Puppet's Bones** | `#loft/puppet-bones` | Helps the librarian build the Traveler, a string puppet: the skeleton's three jobs, a few named bones, muscles that pull in pairs, nerves as messages. | S2, S8 |
| [160](specs/160-small-worlds.md) | **Small Worlds** | `#science/lens` | The librarian's brass microscope: what "40 times" means, cells, plant versus animal cells, helpful microbes; Hooke and Leeuwenhoek; a handwashing scene at Keeper's Desk only. | S2, S1 |
| [161](specs/161-like-and-unlike.md) | **Like and Unlike** | `#living/likeness` | Life cycles compared, born-with versus picked-up traits in sheep and plants, variation and adaptation, the peppered moth. No human family examples. | S3 |
| [162](specs/162-light-room.md) | **The Light Room** | `#loft/light` | Routing a beam to center stage: light enters the eye and nothing comes out, sources and reflectors, straight lines, mirrors, shadows, prisms; Ibn al-Haytham, Newton, Fresnel; an absolute Sun rule. | S6 |
| [163](specs/163-sparks-and-switches.md) | **Sparks and Switches** | `#workshop/switches` | Rewiring the lanterns: conductors and insulators, a switch as a gap, circuit symbols, series and parallel; Volta and Ørsted. Safety covers mains, fallen wires and small cells only. | S6 |
| [164](specs/164-rockets-and-rovers.md) | **Rockets, Rovers and the Long Way Up** | `#library/rockets` | Balloon rockets and orbits, the station, a Rover Yard planning grid with signal delay, Sputnik through Artemis II, with no disasters in child text. | S8, S6, H1 |
| [165](specs/165-lighthouse-and-library.md) | **The Lighthouse and the Library** | `#archive/alexandria` | Alexandria where Egypt, Greece and Rome meet: the Pharos, the Library's copying, Eratosthenes measuring the Earth (an honest range), Cleopatra, Roman Egypt; Hypatia in a Keeper's note only. | H2, H1, M5, S8 |

Owner questions from the third wave, with defaults: **Hypatia** in 165 stays in an older-depth Keeper's note; the **handwashing** scene in 160 sits at Keeper's Desk with no illness lines; the **black-lamb** scene in 161 stays; **Artemis II** in 164 is told as a past event (April 2026); **no off-screen coil-and-nail** activity in 163; spec 141 may mark "What Astronauts Do" as met by 164.

## Fourth wave: eight more packs (specs 166 to 173)

The last pass in the session took the science domains that still had the most untouched topics after three waves: Animals of the World, Matter & Materials, Weather & Climate, Volcanoes & Earthquakes, Ocean Life, Space Systems & Earth's History and Dinosaurs & Paleontology. The authoring pass sought additional target topics; overlap still needs semantic review before declaring encounters. Each pack went through a writer and then one independent review that doubled as the fact-check pass. Proposal PRs #146, #147 and #148, now merged.

| Spec | Pack | Home | What the child does | Strands |
| --- | --- | --- | --- | --- |
| [166](specs/166-valley-animal-book.md) | **The Valley Animal Book** | `#living/valley` | "Who came back?" after the storm: homes, night animals, signals, wild/farm/pet, the Red List shelf with the desman, bucardo, bearded vulture and condor; bears as tracks only. | S4, S3 |
| [167](specs/167-mending-shed.md) | **The Mending Shed** | `#workshop/mending` | Mending the village: objects versus materials, property words, a test table before sorting, choosing materials, Hob's gate taken apart and rebuilt, Macintosh's cloth, recycling at Keeper's Desk. | S5 |
| [168](specs/168-little-drawers.md) | **The Cabinet of Little Drawers** | `#library/drawers` | Particles, states and heating curves, atoms and compounds, Mendeleev's gaps and gallium, metals and non-metals, red-cabbage pH (grown-up-led), physical versus chemical change. | S5, S7 |
| [169](specs/169-reading-the-sky-ahead.md) | **Reading the Sky Ahead** | `#science/forecast` | The forecast chain, weather maps, the Sun's engine and sea breezes, a calm storm day, building and dressing for weather; Le Verrier, FitzRoy, TIROS-1. Safety on a grown-up card only. | S7, S1 |
| [170](specs/170-restless-ground.md) | **The Restless Ground** | `#workshop/ground` | A volcano cutaway, runny and sticky magma, plate edges, seismometers and magnitude, a made-up watch desk, tsunami speed, a shake table on a budget. No death counts or peril. | S7, S6, S1 |
| [171](specs/171-down-to-the-deep.md) | **Down to the Deep** | `#library/deep` | Sounding the millpond, then the ocean: echo depth, the sea-floor profile and Marie Tharp, deep-sea light and vents, reefs and ripple effects; more "H." postcards. | S4, S7, H1 |
| [172](specs/172-beyond-the-planets.md) | **Beyond the Planets** | `#library/far` | Planet names, the solar system to scale, Newton's hill, brightness and distance, a long zoom to galaxies, a star's life; Leavitt, Hubble, Payne. Carries the Sun rule. | S8, S6 |
| [173](specs/173-stones-that-remember.md) | **Stones that Remember** | `#living/dig` | A dig square and slice table, coprolites from Anning to Buckland, feathered dinosaurs, a Life Rope of deep time, *Abditosaurus* from the Tremp Basin; extinctions calm, at Keeper's Desk. | S8, S1, H1 |

Owner questions from the fourth wave, with defaults: bears in 166 stay **tracks only**; the old Keeper stays **unnamed in child text before the end of Act III** (spec 120 Act I: the miller "remembers an old heron ... but not their name"; now applied across every pack, including 133, 134, 138, 140, 144, 145 and 164); the red-cabbage card in 168 stays **grown-up-led**, deferring safety to the ACS activity; natural tsunami signs in 170 appear **only in the grown-up panel**; end-Permian in 173 told as **"about 8 in 10 sea species, maybe more"** at Keeper's Desk only.

## Fifth wave: seven more packs (specs 174 to 180)

The fifth pass took the remaining unclaimed topics that fit a young reader: body systems, classification and evolution, engineering design, small bodies and exoplanets, motion graphs, heat transfer, and the last untouched topics in the pinned History domains. Topics about puberty, human reproduction, drugs, diet problems or illness were left to families on purpose. Same writer-then-review pipeline. Proposal PRs #149, #150 and #151, now merged.

| Spec | Pack | Home | What the child does | Strands |
| --- | --- | --- | --- | --- |
| [174](specs/174-breath-and-heartbeat.md) | **Breath and Heartbeat** | `#living/breath` | Diffusion as a dot model, air sacs, a four-room heart from the miller's one-way pump flap, respiration, keeping warm; Lavoisier and Laplace. Nothing asks about or measures the child's body. | S2 |
| [175](specs/175-sorting-life.md) | **Sorting Life** | `#living/sorting` | Re-sorting spilled creature cards: vertebrate groups, big groups, claim-evidence-reason, a branching key, two-part names; at Keeper's Desk, forelimb bones, the Grants' finches, a cell-to-gene zoom. | S3, S1 |
| [176](specs/176-design-table.md) | **The Design Table** | `#workshop/design` | A brief, three ideas on one yardstick, test-predict-test, how sure and whose evidence, a tile-built report; the toolkit for Act VI's crate job. Mary Anderson, the Wrights. | S1 |
| [177](specs/177-moons-comets-other-suns.md) | **Moons, Comets and Other Suns' Planets** | `#library/orrery` | The Moon's path, planet features, comets and dwarf planets, falling around, finding exoplanets by starlight dips; Halley, Pluto, 51 Pegasi b. | S8 |
| [178](specs/178-how-fast-which-way.md) | **How Fast, Which Way** | `#post/yard` | The courier road: motion words, distance-time graphs, relative motion on the ferry deck, resultant forces on a tow line; Galileo's ship and the chip log. | S6, M6 |
| [179](specs/179-where-the-warmth-goes.md) | **Where the Warmth Goes** | `#science/warmth` | Sun, shade and seasons, an awning builder, a collision energy tally, conduction/convection/radiation, watts; Rumford, Herschel, Joule. | S6 |
| [180](specs/180-rules-rulers-rebels.md) | **Rules, Rulers and Rebels** | `#archive/rules` | Then and now, the Roman Republic's safeguards breaking, Boudicca through two Roman sources, and from ordeals to juries; feeds Act II's first town rules. | H2, H1 |

Owner questions from the fifth wave, with defaults: 174 keeps the **37 °C history as typical measured values** at Keeper's Desk; 176's dropped **fact/judgment/guess sorter** stays deferred; 179's **kettle** appears only as a number at Keeper's Desk, never as a mains activity; 180 **does not claim the Magna Carta topic** and tells **Caesar's death in one plain sentence from Sapling up**.

## Sixth wave: ten more packs (specs 216 to 225)

Proposal, 2026-10-25 (board card OCA-13). On the pinned graph, 253 of the 547 Science topics still had no spec claim on main. Of those, 89 were not mentioned in any spec, audit or plan at all; the other 164 already appear somewhere as a prerequisite, gap or candidate. This wave took the 89, less 16 left to families as in the fifth wave (puberty, human and animal reproduction, nutrition and diet, drugs and alcohol, illness and immunity, human life stages, healthy lifestyle), and claims the remaining **73** across ten packs. Same contract and pipeline: one writer per pack, then an independent fact and child-text review by a fresh context, each checking every number with its own script. Jane (`0ec55f7`) and Marble (`7bd8b67`) were refreshed on 2026-10-25 and had not moved. Draft PRs: specs 216 and 217 with this section, 218 and 219, 220 and 221, 222 and 223, 224 and 225.

| Spec | Pack | Home | What the child does | Strands |
| --- | --- | --- | --- | --- |
| [216](specs/216-ice-world.md) | **Ice World** | `#mill/snowwell` | The Snow Well under the mill: ice floats and snow is crystals, penguins, the tundra over permafrost, why the poles are cold and dry, the cryosphere as one store, polar oceans and world climate, the two poles' ecosystems compared, exploration then and now. Builds on 144 and 153. | S4, S3, S7 |
| [217](specs/217-water-and-air.md) | **Water and Air** | `#library/globe` | Where Earth's water is and how little is fresh, climate zones in bands, air with weight and layers, the ocean as a climate engine, where fuels come from, and a marsh or forest as a carbon store. Builds on 140. | S7, S4 |
| [218](specs/218-under-the-canopy.md) | **Under the Canopy** | `#loft/rainforest` | A rainforest set in the Story Loft: the dim, loud floor, the insect crowd, sorting rainforest life, survival tricks, the Amazon, biodiversity, and how rainforest goods reach a market. Builds on 152 and 144. | S4, S3 |
| [219](specs/219-small-and-many.md) | **Small and Many** | `#living/small` | Caring for minibeasts and putting them back, micro-habitats, why insects have the most kinds, records for their size, eyes, breathing holes and molting, adaptation over generations, and what losing pollinators would cost. Builds on 116 and 150. | S3, S4 |
| [220](specs/220-animal-lives.md) | **Animal Lives** | `#living/lives` | Kinds of animal record, how tests show what animals can do, symbiosis by who gains, the case for living in groups, the ocean's invertebrate majority, and ocean migrations as round trips. Builds on 143 and 144. | S3, S4, S1 |
| [221](specs/221-who-eats-what.md) | **Who Eats What** | `#living/who-eats` | The Feeding Board: herbivores, carnivores and omnivores by food, not looks; living things changing their habitats; parts for survival argued with evidence; tracing any food back to the Sun; and, at Keeper's Desk, how a persistent poison builds up (DDT and eggshells). No diet advice. | S3, S4, S6 |
| [222](specs/222-deep-time-and-genes.md) | **Deep Time and Genes** | `#living/deeptime` | Layers and Pompeii's ash, reading a branching tree at the joins, half-life clocks, reconstructing an ancient ecosystem, extinction as a race of rates, DNA and mutation, Punnett squares with peas, and whether lost giants can come back. | S3, S8, H1 |
| [223](specs/223-body-signals.md) | **Body Signals** | `#living/signals` | Senses and their parts, six major bones, the nervous system and reflexes, neurons and the brain map, keeping steady by feedback, digestion with enzymes, and running short of oxygen. Every body is a drawing, the Traveler puppet or an animal, never the child's. | S2, S1 |
| [224](specs/224-changing-materials.md) | **Changing Materials** | `#science/changes` | Choosing a separation by what differs, four families of reaction, acids and their salts, ceramics, polymers and composites, stretching, heat and depth, a spring and cart investigation, and the motor effect. All chemistry on screen. | S5, S6 |
| [225](specs/225-light-stars-signals.md) | **Light, Stars and Signals** | `#post/tower` | The Signal Tower: codes both sides agree, rays and lens images, the electromagnetic family, how materials meet waves, seasonal constellations, the lives of stars, and where elements come from. Lamp codes for Act VI's warning. | S6, S8, S1 |

**Story hooks.** Every pack offers optional jobs in spec 120's acts and also plays standalone. Hollis is named only from the end of Act III (220 in Act VI, 225 in Act V); earlier scenes say "the old Keeper" or don't mention them. The strongest ties: 217's marsh as a carbon store beside Bramble's fair point in Act IV, chapter 2; 221's beaver pond near the high ford; 225's lamp codes for the warning passed down the river in Act VI.

**Left open.** The 164 unclaimed Science topics that are already mentioned as prerequisites, gaps or candidates are the natural seventh wave; this wave lists them in no spec.

**Re-pin proposal for the owner (upstream-only topics).** Upstream Marble now has 1,845 topics against our pinned 1,590. No spec here claims an upstream-only topic. For history and science the new topics are: History, Modern History (9: Australian colonies and Federation), Family & Community History (7), Historical Thinking (3); Science, Design & Technology (9), Scientific Inquiry (11) and 9 others; and a new Geography subject (22). Many are written for the Australian curriculum, and several ask about the child's own family or places ("My family and where we're from", "Special places I belong to"), which this app's privacy rules exclude. **Default: no re-pin now**; if one is wanted later, take Design & Technology and Scientific Inquiry first and leave the family and place topics out.

Owner questions from the sixth wave, with defaults: humans stay out of 221's diet sort, appearing only as house-builders; 223 keeps its illusion card, one yeast line naming ethanol for bread, and the London taxi study at Keeper's Desk as a correlation; 220 keeps calves born and turtles laying eggs as plain life-cycle facts with no mating words, and leaves out disease as a cost of group living; 222 keeps the bucardo clone card at Keeper's Desk only and its DNA ethics with no human cases; 216 names no country leaving the Paris Agreement and keeps the Heroic Age death count to one Keeper's note; 217 does not name "climate change" at Sapling; 218 does not claim the Rainforests "Rainforest Animals" topic (`mt_xVW5U41tbp`) beside 144's twin; 219 keeps Edmond Albius on one gentle Keeper's Desk card; 225 does not claim Spotting Constellations.

## How the packs hold together

**Four threads tie them to the story.** Spec 120's reveal is that the Keeper is whoever keeps the record and keeps the ways open. The packs are chosen so that the real world answers the town's questions along those lines.

| Thread | Packs | What it carries |
| --- | --- | --- |
| **Keeping the record** | 133, 134, 137, 138, 140, 142 | Nilometers and Hollis's flood post; the Domesday survey and Willowbank's own survey; Timbuktu's family libraries and Nuria's flood chest; a weather record; trackways as a record left in mud. |
| **Keeping the ways open** | 135, 137, 144, 146 | Roman roads and aqueducts; the pilgrim road over the Pyrenees; the birds' own flyway over the same mountains; a warning that has to travel down the valley. |
| **Where the water goes** | 134, 135, 140, 143, 145, 147 | A flood people wanted; water moved by slope alone; the water cycle and the rain gauge; tides; evaporation drying the pages; the brook's energy at the mill. |
| **Deep time and the valley itself** | 133, 139, 141, 142 | The Long Line's zoom-out; mountains raised from an old sea floor; the sky; dinosaur tracks in the Spanish Pyrenees. |

**Where they sit in the acts** (proposed adapters; every pack is also open without the story):

| Act | Packs that offer jobs there |
| --- | --- |
| I After the Storm | 133 (storm-night order), 138 (drying the pages), 139 (the coin stone, the millstone), 140 (the backwards vane), 145 (where the water went), 147 (the jammed wheel), 148 (supper scene) |
| II A Town of Our Own | 133 (Hollis's gaps), 134 (spring flood post), 135 (Bramble's ribbons), 137 (the shell in the mill wall), 140 (rain book beside page 2), 145 and 148 (Ember's birthday kitchen), 146 (Dot's bell), 147 (Bramble's wheel) |
| III Beyond Willow Bridge | 134 and 138 (Nuria's letters), 135 (Léon's bridge), 137 and 139 (the high ford route), 143 (the first postcard), 144 (two towns compare bird tallies), 146 (the magpie's claim) |
| IV The Town Has Two Stories | 133 and 134 (what other places did), 136 (who gets a voice at the meeting), 138 (checking sources), 140 (Bramble's two averages) |
| V A Question of Your Own | 139 (rock trail), 141 (the sky-watching night project), 145 and 147 (project first versions) |
| VI The Opening of the Ways | 142 (the slab by the ford, Hollis the dinosaur), 143 (did my postcards come?), 146 (thunder in the long rain), 147 (too much energy in the brook) |

## Teaching approach

Every pack follows the same contract so a child meets the same shape everywhere:

- **Spec 49 §5:** each spec has the teaching-contract table (target, teaching encounter, contrast, supported practice, new application, purposeful revisit, data boundary) and a hard-prerequisite crosswalk against the pinned `curriculum/marble/dependencies.json`. Unmet prerequisites are listed as documented gaps, never hidden and never gates.
- **Jane** (`kentlangley/Jane` at `0ec55f7`, refreshed 2026-10-24): teach first with one idea and a worked example revealed a step at a time, then one guided item with visible steps, then practice. The "I'm stuck" ladder (hint, then an easier worked example plus how to start this one, then skip for now with nothing lost). Three-option choices with one wrong choice tagged to a named misconception and kind per-choice feedback. Short second-person prompts. A key-terms glossary. **Not adopted:** points, medals, bosses, mastery, gates, timers, step-downs. No Jane code or text is copied.
- **Marble teaching research** (`withmarbleapp/os-taxonomy` at `7bd8b67`, refreshed 2026-10-24): every science target's research record was read; each spec paraphrases what it asks (best practices, top misconceptions, learn constraints) and says how the pack does it. The records are CC BY-SA and are never quoted. Marble has no research records for History; the history specs say so and use museum and university sources instead.
- **Other ideas used across the packs:**
  - *Contrasting cases* as the core move (melting/dissolving, louder/higher, order/scale, weather/climate, a big walker and a small runner with the same stride).
  - *Predict, try, explain* on every bench with a stated simplified model ("A made-up model" label on every result).
  - *Evidence versus interpretation* on every history card: what the object shows, what the museum or historian thinks, and what nobody knows yet.
  - *Estimates as ranges* where scholars disagree (Athenian population, the Domesday mill count, the Nîmes aqueduct's fall, dinosaur speed), so uncertainty is taught rather than hidden.
  - *Place-based learning:* the valley is in the Pyrenees, so the real geology, birds, dinosaur sites, pilgrim road and Roman road of that region carry real content without pretending Willowbank is real.
  - *Spaced retrieval through the Long Line:* every history and deep-time pack adds dated cards to spec 133's timeline, so returning to the timeline revisits earlier packs.
  - *Problem sets with real numbers:* every pack has 25 to 32 items across Sprout, Seedling, Sapling and Keeper's Desk, and every numeric answer was checked by script.
- **Labels kept apart:** "A true thing from history" or "science", "A story people told" (myth and legend), "A story from Willowbank" (the fiction) and "A made-up model". US spelling; °C with °F where a US reader needs it.

**Free text:** "say why" prompts are meant to be spoken to a grown-up. Some specs also offer an optional local note; where a spec stores one, it lists the field and its bound as spec 49 §5 item 7 requires. Whether to store any free text in these packs is an owner question (below); the default is **spoken only, nothing stored**, and a spec's note field ships only if the owner wants it.

**Privacy and safety:** fictional people and data only. No pack asks about a child's body, family, feelings or location. Real-world activities (a sky night, a pulse, kitchen science) are optional, off-screen, grown-up-led, and nothing from them is recorded. Real loss in history is brief and gentle (Pompeii, the K-Pg extinction, the Timbuktu manuscripts in 2012-13) and appears at older depth.

## Fact-checking status

Every pack has a source audit in `docs/source-audits/`. This session could not open web pages directly: the network policy refused direct fetches of encyclopedia, museum and agency sites, so facts were checked against search-result excerpts from those sources, and web searches were rationed. Writers ran a second, dedicated fact-check pass. What could not be confirmed stays marked `[check]` in the text and is listed in each audit; corrections found in the pass were made (for example, the Nîmes aqueduct's fall is taught as about 12-17 m, the Great Pyramid as about 2550 BCE, and undershot waterwheel efficiency figures were cut as wrong). The 2026-10-25 PR reviews opened selected primary sources and repaired known errors, without claiming a complete source or subject audit. **Before the selected slice is built, close its named source-review checks by opening the cited pages**, and fluent readers should check the few Spanish and French lines.

## Delivery families and first slices

These are planning recommendations for priority 4, or a focused advanced commission under priority 1. Keeper's Desk depth in a pack does not by itself put the whole pack ahead of story integration or clarity. The [next-build queue](roadmap.md#next-build-queue) owns that order. A **first slice** below is a candidate to specify, not an already cleared implementation contract; its eventual release selects finite cases, teaches and contrasts them, handles paused work, and passes the pack's applicable reviews.

| Family / primary strand homes | Specs accounted for | Candidate first slice | How the same experience grows |
| --- | --- | --- | --- |
| Sources, records and public choices · H1/H2, E3/E4, M5/M6 | 133, 134, 135, 136, 137, 138, 156, 157, 158, 165, 180 | One Long Line order/interval set (133), then a selected Nile record (134) or a voice/rules contrast (136). A later source folder can supply its own small timeline. | Place a source; compare what two sources establish; account for a missing voice; recommend and revise. Roads, copying books, myth/artifact, Alexandria and rules offer different content with that familiar reading job. History remains substantive knowledge, with beliefs, reconstructions and fiction labeled distinctly. |
| Water, weather and changing ground · S7, S1, M6 | 139, 140, 143, 169, 170 | One weather measurement/readout contrast (140), using a finite supplied dataset alongside the separate reported-weather log proposed in 116. | Read an instrument; compare days without inferring rainfall from rain-day counts; read a forecast; later compare coastal or ground models and uncertainty. The weather log, tide calculation, earthquake model and official safety guidance retain separate sources and meanings. |
| Organisms, habitats and change · S3/S4, E3, M6 | 144, 149, 150, 151, 152, 153, 161, 166, 175 | One Valley Animal Book track/clue investigation (166), or one compatible-variety pollination model (149/150), selected separately. | Follow a clue; sort with a reason; build/test a key; compare variation, habitat and food-web evidence; return with a field question. Rainforest and polar books bring new knowledge, with their community/specialist reviews before those cards are published. |
| Bodies, cells and living systems · S2, S1 | 148, 159, 160, 174 | One puppet joint-and-muscle model (159) or one pictured typical-cell comparison (160), selected separately. | Visible structures → magnified parts → transport, diffusion and aerobic energy release. These are teaching bridges, not child access gates. Spec 174 stays on supplied models and values; it creates no child-body measurement flow. Spec 148's optional off-screen card keeps its own adult/safety and no-recording boundaries. |
| Materials and transformations · S5, S6 | 145, 167, 168, 179 | One Mending Shed test-and-choose job (167), then a separately reviewed melting/dissolving contrast (145). | Choose a material for a stated property; distinguish state change from dissolving; reason with particles and chemical change; design for warmth. Revisit the café, repairing crew or awning with a different criterion. Adult-led off-screen work keeps the pack's source guidance. |
| Sound, light, energy, forces and motion · S6, M5/M6 | 146, 147, 154, 162, 163, 178 | Choose one familiar bridge: pitch versus loudness (146), a beam-path model after Shadow Theatre (162), or series/parallel after the Lantern Circuit (163). | Predict; change a controlled setting; trace a path; compare a numerical relationship; later combine constraints in a design. Rhythm Studio's durations, courier time/rate graphs and mill energy use these concepts for different purposes. Each physical model needs its own finite assumptions and tests. |
| Scale, distance and deep time · S8, S4, H1, M5 | 141, 142, 164, 171, 172, 173, 177 | One Library Roof day/night or phase model (141), or one trackway inference with uncertainty (142), selected separately. | Compare viewpoints and scales; infer from incomplete traces; investigate signal/depth/travel time; revisit fossils, rovers, ocean or orrery. A ground-view illustration alone does not prove Earth's motion. Moon-table, sky model and actual observing notes keep distinct sources; all sky activities keep the Sun-safety rule. |
| Inquiry and engineering toolkits · S1, M6/M7, E4 | 155, 176 | One Question Bench change/measure/keep comparison (155), then one bounded Design Table brief (176). | Turn a curiosity into a testable question; examine repeats and confounding; predict/test/revise against a common yardstick; explain evidence to a reader. These can support Act V/VI work after their own build and story-adapter review; they are not an assumed generic project API. |

The eight rows account for all 48 specs exactly once as primary homes. Teaching connections deliberately cross rows; they add no mastery claims or new dependency edges. Each numbered pack links to its actual spec in the catalog above.

### Suggested delivery passes

Passes are preferences under the roadmap's ready-work rule, not stages to finish in order.

1. **Keep the current town usable.** Continue the bounded Keeper's Desk and story work under priorities 1/2; continue the residual text/graphics sweep under priority 3. The live Games Table and 83 drawn how-tos are footholds, not new history/science packs.
2. **Add different ways to act.** Use priority-4 turns for Rhythm Studio (115), the bounded Almanac/data desk (116), and a first history source/timeline experience (133 with one chosen follow-on). These add composing with sound, reported-data construction and time/source reasoning. Prefer Spanish errands (117) after the Almanac when fluent content and errand-model reviews are ready; a ready history slice can proceed while that review waits. The order is a preference, not a requirement to finish these whole proposals.
3. **Make investigation richer.** Alternate selected materials, organism and weather slices with a mystery (122), programming puzzle (123) or visual/spatial creation (125/126). Revisit something already built using a new unknown, representation, criterion or reader. Avoid scheduling a whole subject family as one build.
4. **Give the growing town harder questions.** As Act III/IV work is commissioned, select real-history comparison, weather/causal evidence, relative motion, Bank Builder (124) and the meeting board's own reviewed adapter. Spec 119's six deeper bench extensions keep advanced math and language work in the same town. None of the new pack lists substitutes for that intermediate instruction.
5. **Support chosen projects and the wider exchange.** Bring Question Bench (155), Design Table (176), further scale/body/matter investigations and the separately reviewed project/exchange interfaces into Acts V/VI as needed. Keep a meaningful supported route and later-act entry; the culminating story is keeping the Ways open with others, not completing every catalog topic.

A pack can supply a small job in several acts after it is built. Proposed act links are story invitations, not evidence that its lessons have been taught or that its adapter exists. For each selected release, name one concept, teaching encounter, contrast, practice, new use and return using [spec 49 §5](specs/49-six-act-curriculum.md#5-intermediate-teaching-contract). The [26 strand pathways](six-act-strands.md) keep the intermediate lessons visible; content volume is not a route through them.

### Reuse and release decisions

- Reuse a bench's controls, accessible read-aloud and model-picture conventions where suitable; keep independent records, support, familiarity and retries separate. A new topic card does not automatically fit an existing validator or save format.
- Keep English, French and mathematics in the release conversation. Science/history reading is not a substitute for decoding, fluency or writing instruction; phonics still needs brief 55's linguistic/audio review. Language difficulty is chosen separately from the sophistication of the science or story.
- The 2026-10-25 independent reviews repaired concrete teaching errors and checked representative mathematics. Source audits still name incomplete full-page checks and later subject/community/fluent review. Select and close the checks relevant to the chosen first slice; do not infer whole-catalog approval from a merged PR or require all 48 packs to clear before one can be built.
- Source titles and hard-prerequisite edges from the pinned Marble graph guide lesson support and documented exceptions. Reviewed encounter declarations follow actual implemented teaching; none is added by this plan. Jane's teaching sequence and stuck ladder remain design references under their path-specific licenses. Refresh the relevant upstream material when implementing; this roadmap incorporates no new upstream code or text.
- Use a drawn how-to where a turn needs explanation. A new science/history pack does not automatically need a film. Final story-film production stays tied to the reviewed act-ending runtime build in the [film timing table](roadmap.md#films-and-songs-when-each-is-needed).

## Open owner questions (defaults in bold)

1. **143:** Hollis speaks only through the pages in spec 120. May unsigned postcards signed only "H." arrive before Act VI? **Use spec 120's current script for identity/reveal timing; this inventory sets no competing rule. Proposed early postcards stay signed "H." without a revealing picture until the owning scene is reviewed.**
2. **148:** food guide. **NHS Eatwell Guide** (the valley is in Europe); USDA MyPlate is a one-table swap.
3. **141:** a new **Library Roof** destination at `#library/roof`.
4. **136:** Athens's voting rules are compared in a separate made-up town (**Thistle Ford**) so Willowbank's own meeting is never decided by a vote.
5. "Say why" answers: **spoken to a grown-up, nothing stored**, unless the owner wants optional local notes.
6. **138:** Timbuktu's 2012-13 manuscripts passage is gentle, but security there is a current issue; **keep it at older depth only, after a subject check by a reader who knows West African history.**
7. Several packs introduce new routes under existing hubs (`#archive/...`, `#workshop/...`, `#living/...`, `#science/...`, `#studio/sound`, `#mill/energy`, `#post/postcards`). **Keep them as separate routes** so built destinations stay untouched.
