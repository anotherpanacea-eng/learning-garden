# 148. Where Pip's Supper Goes: a journey through the body

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a subject check.** Part of the [history and science build-out](../history-and-science-buildout.md). Every child-facing line is in [the companion text](../content/148-where-pips-supper-goes-text.md); sources and open checks are in [the source audit](../source-audits/148-where-pips-supper-goes.md).

**Commissioning boundary:** this is a proposal only. Select a bounded first slice (the supper journey and tooth match are the suggested first slice) after independent content, medical-fact and save review; listing four activities and four problem sets does not commission them all. All Act and chapter links below are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter.

**Fact-check status:** a search-based fact-check pass on 2026-10-25 (search-result excerpts only; source pages could not be opened directly) cleared the pack's numbers, dates and medical facts, with two wording changes (small-intestine length and Ibn al-Nafis's place). Sources and remaining caveats are in the source audit. Its only open check is an image license.

## Purpose

The game teaches living things through animals and plants: Body Clues ([spec 62](62-living-body-clues.md)) keys four pictured animals by their outside features, and the Body Movement Bench ([spec 97](97-body-movement-bench.md)) shows how a snail and an earthworm move with muscles and no jointed legs. Nothing yet teaches what happens **inside a human body**. Strand S2 (the human body and organisms) has no built pack for digestion, teeth, the heart, breathing or how organs are organized, and Marble's *The Human Body* domain has no topic claimed by any built spec.

This pack fills that gap with one generic, illustrated **human body model** ("a person's body"). A child comes to understand that:

- food travels one long, folded tube with a different job at each stop, and most of what the body uses is taken into the blood in the small intestine;
- teeth have shapes that fit their jobs, and a person's mix of teeth differs from a fox's;
- the heart is a muscle that pumps blood around the body through blood vessels, and the blood carries oxygen and food to every part;
- breathing in and breathing out both move air, a slightly different mixture each way;
- breathing and the blood work together, and a body is built from cells, tissues, organs and systems (older depth).

**The fox is a framing joke, and the content says so.** Pip is hungry and curious; the chart in the librarian's book is a person's body, and every fact is about human bodies. Short "Fox note" boxes mark the few places where foxes differ (teeth most of all).

**Never the child's own body.** No screen asks about the explorer's body, food, pulse, breathing, teeth, size or health. Body facts are written about "a person" or "a grown-up's body"; the "you" in prompts is the explorer doing the task. Arithmetic uses labeled example rates ("an example grown-up heart"). One optional off-screen card in the grown-up panel, led by a grown-up, invites feeling a pulse; it is not a health check, and nothing about it is entered or recorded.

**Scope choices.** Out of scope for this pack: puberty and reproduction, illness and medicines, vaccines and the immune system (so white blood cells are left out on purpose), tooth decay and care, the urinary system, weight, calories and dieting. Human bones and skeletal muscles are also left out: specs 62 and 97 cover animal body features and animal movement, not the human skeleton, so this pack links to them for the "muscles squeeze" idea and leaves a human bones-and-muscles pack as a documented gap.

## Place and story

**Host:** a new optional sibling view in the Living Garden, `#living/journey`, titled *A Person's Body*. It is reached from the Living Garden hub, from a "Look inside a person" link on Body Clues (`#living/bodies`) and the Movement Bench (`#living/movement`), and from a small link on the Café page during the welcome-back supper and the autumn Harvest Supper. It is open from the start and never locked. Handled by the same early route branch in `adaptivePage(state, slug)` as the other `#living/*` sibling views.

**The fictional object:** the librarian lends the café a big fold-out book, *A Person's Body*, with an illustrated person on the chart (an adult of no stated identity, drawn simply, no clothing detail, no skin-color emphasis; organs shown as a cutaway diagram). The book is fiction; the facts in it are real and labeled "A true thing about bodies". Willowbank scenes are labeled "A story from Willowbank".

**Story beats (full text in the companion):**

- **Hook, Act I ending (scene only):** at the welcome-back supper Pip eats his third bread roll and asks where it all goes. The librarian fetches the book. This scene contributes no job, since Act I's ending is the six-table supper.
- **Act II, chapter 3, Ember's birthday:** future adapter. The café's party kitchen gives one job per depth: Sprout orders the supper journey; Seedling does the tooth match; Sapling follows the red blood cell; Keeper's Desk takes the Harvey case.
- **Autumn Harvest Supper (festival job):** the "Supper table groups" sort feeds the festival's own seasonal job.
- **Act V, a question of your own:** a child may choose "a guide to a person's body for the *Willowbank Gazette*" as a project path, using the exhibit-label pattern of [spec 99](99-exhibit-label-maker.md).

## The knowledge

Plain adult prose. Sources for each claim are in the source audit.

### The digestive journey

Digestion breaks food down small enough for the body to take in. The digestive tract is one continuous tube from mouth to anus; helper organs (liver, pancreas, gallbladder) are mentioned only in the adult panel.

1. **Mouth:** teeth cut and grind food; the tongue moves it; saliva wets it and starts breaking down starch (bread is a good example, because bread is mostly starch).
2. **Esophagus (food pipe):** a muscular tube. Waves of muscle squeeze swallowed food down to the stomach (peristalsis), so swallowing works even when a person is lying down; gravity is not what moves it. A flap (the epiglottis) helps keep food out of the windpipe.
3. **Stomach:** a stretchy, muscular bag that churns food with acid and enzymes into a thick soupy mixture. Most absorption comes later, in the small intestine.
4. **Small intestine:** a long, coiled tube where most digestion finishes and **most nutrients pass into the blood** through its lining (tiny finger-like villi give it a huge surface). Older textbooks give about 6 to 7 m in adults and some modern sources give a lower range (about 3 to 6 m), so the pack says "several meters long" and uses 6 m only as a labeled round example. (Some digested fat travels first in lymph before reaching the blood; the pack's simplified line "into the blood" says it is simplified.)
5. **Large intestine:** wider and shorter (often given as about 1.5 m). It **takes water** (and some salts) back from what is left, and the leftover becomes waste, which leaves the body through the anus. The child-facing text says "leaves the body as waste when a person uses the toilet" and goes no further.

Contrast pair: **the stomach is not where most absorption happens.** The small intestine is.

### Teeth

- Four human tooth types: **incisors** (flat, sharp-edged front teeth that cut and bite), **canines** (pointed, for gripping and tearing), **premolars** and **molars** (broad and bumpy, for crushing and grinding).
- A person has **20 baby (primary) teeth**: in each quarter of the mouth, 2 incisors, 1 canine and 2 molars; there are no baby premolars.
- A grown-up can have **32 adult (permanent) teeth**: in each quarter, 2 incisors, 1 canine, 2 premolars and 3 molars. The four third molars are the **wisdom teeth**; some people never have some or all of them, so "up to 32" is the honest phrase.
- Teeth are replaced once, baby to adult. They do not keep regrowing.
- **Fox note:** a red fox typically has **42 teeth** (I 3/3, C 1/1, P 4/4, M 2/3), long pointed canines and shearing back teeth called carnassials that slice like scissors. Foxes are omnivores too (they eat small animals, insects, fruit and berries), so the pack does not use the fox as a "pure carnivore" example; it compares shapes, and says that a fox's teeth are better at slicing and a person's back teeth are flatter for grinding.

### The heart and blood

- The heart is a muscle about the size of a fist, in the middle of the chest behind the breastbone, tilted slightly left. It is not shaped like the ❤ symbol.
- It squeezes over and over, pumping blood through **blood vessels** (tubes) to every part of the body and back. Blood carries oxygen and nutrients to the body's cells and carries carbon dioxide away.
- A resting adult heart usually beats about **60 to 100 times a minute**; it speeds up during activity. The pack uses **70 a minute** as an example adult rate only.
- **The heart pumps blood; it does not make it.** Blood cells are made in **bone marrow**, the soft tissue inside many bones.
- **Blood is always red:** bright red when carrying more oxygen, darker red when carrying less. Veins can look bluish through skin. Many diagrams color oxygen-poor blood blue as a code; the pack explains the code and draws dark red with a blue code tag only on the "diagram code" card.
- Keeper's depth: four chambers (two atria receive, two ventricles push); a **double loop**: the right side sends blood to the lungs and back, the left side sends it to the body and back. Arteries carry blood away from the heart, veins bring it back, capillaries are tiny vessels where oxygen and food pass to cells. Blood also contains plasma and other parts that a later pack can cover (white cells are left out by scope choice).

### Breathing

- Air goes in through the nose or mouth, down the **windpipe** (trachea), and into **two lungs** in the chest.
- In the lungs, some oxygen passes into the blood and some carbon dioxide passes out of it. The body needs oxygen; carbon dioxide is a waste gas.
- **Breathing in and breathing out are both air.** Air breathed in is about 21% oxygen; air breathed out still has about 16% oxygen, and more carbon dioxide (about 4%, up from a tiny amount). The percentages appear only at Keeper's depth.
- Sapling and Keeper's depth: the **diaphragm**, a dome-shaped muscle under the lungs, tightens and flattens to make the chest space bigger, and air flows in; it relaxes and air flows out. The windpipe branches into bronchi and smaller tubes ending in tiny air sacs (alveoli), wrapped in capillaries.
- A resting adult breathes roughly 12 to 20 times a minute; the pack uses 15 as an example.

### Working together, the brain, and levels of organization

- Breathing loads oxygen into the blood at the lungs; the heart pumps that blood to the body; cells use oxygen to release energy from food and make carbon dioxide; the blood carries carbon dioxide back to the lungs to be breathed out. Oxygen and carbon dioxide travel in the same blood at the same time, in opposite directions of exchange. During activity muscles need more oxygen, so heart rate and breathing rate both go up.
- **The brain** sends and receives messages along **nerves**. Some messages tell muscles to move; some (like those that keep breathing and the heartbeat going) happen without a person thinking about them. One teach card only.
- **Cells, tissues, organs, systems:** a body is built from trillions of tiny cells (a recent estimate is about 30 trillion; the pack says "trillions"). Similar cells make a tissue (here "tissue" means a group of similar cells, not a paper tissue); tissues make an organ; organs working together make a system. Worked example: muscle cell → muscle tissue → heart → circulatory system.

### How blood was found to go round (Keeper's Desk)

- **Galen** (129 to about 216 CE), a Greek physician working in the Roman Empire, taught that the liver turns digested food into blood, which flows out through the veins and is used up by the body. His books shaped medicine for well over a thousand years.
- **Ibn al-Nafis** (died 1288), who studied in Damascus and worked in Cairo, wrote in a commentary on Ibn Sina's *Canon* that blood passes from the right side of the heart to the left through the lungs, and that the wall between the two sides has no pores. His work was rediscovered in the 20th century.
- **William Harvey** published *Exercitatio anatomica de motu cordis et sanguinis in animalibus* in Frankfurt in 1628 (72 pages, in Latin). Two lines of evidence: with a band on the arm, valves in the veins let blood be pushed toward the heart only; and a deliberately low estimate showed the heart moves more blood in half an hour than the whole body holds, far too much to be newly made from food. He could not see how blood crossed from arteries to veins.
- **Marcello Malpighi** saw capillaries in a living frog's lung through a microscope and published it in 1661, the missing link in Harvey's circuit.

### Food groups, presented neutrally

The pack uses one official guide and says so: the **NHS Eatwell Guide** (UK). It was chosen because Marble's research record for this topic cites it as a verified source and recommends a local healthy-eating guide; the valley sits in Europe, and the guide's own food-group names need no spelling change. Its five groups: *fruit and vegetables*; *potatoes, bread, rice, pasta and other starchy carbohydrates*; *beans, pulses, fish, eggs, meat and other proteins*; *dairy and alternatives*; *oils and spreads*. The guide shows fruit and vegetables and starchy foods as the two biggest parts, protein foods and dairy smaller, oils and spreads a small amount, and judges balance over a day or a week, not one meal. Nutrients (carbohydrate, protein, fat, vitamins and minerals, fiber, water) are a separate layer: one food supplies several nutrients. No food is called good or bad; there is no talk of weight, calories, portions for a person, or anyone's own eating. Mixed dishes (a sandwich, a vegetable pie) combine groups.

## The lesson

Jane's order throughout: **teach** (one idea, one worked example revealed step by step) → **guided** (first item with 1 to 4 visible steps) → **practice**.

| Activity | Teach card and worked example | Guided item | Practice |
| --- | --- | --- | --- |
| (a) Supper journey | One bite of bread, traced stop by stop (four taps) | Place the bite's next stop after the stomach, with the "which stop takes food into the blood?" step shown | Order all stops; match stop to job |
| (b) Tooth match | Incisor and molar compared: edge cuts, bumps grind | Match the canine, with "pointy, so it grips and tears" shown | Match all four; person and fox jaw compare |
| (c) Pump and pipes | The red cell leaves the heart, goes round, comes back | Step the cell through the lungs, with the color change shown | Follow the full loop; Keeper's double loop |
| (d) Which system? | The heart and blood vessels sorted into one system | Sort the lungs, with "air goes here" shown | Sort the rest |

**"I'm stuck" ladder** on every item: (1) a hint; (2) a worked example of an easier, similar case plus how to start this one; (3) **Skip for now**, which leaves the item open with no penalty and no note on the child.

**Contrasts** (the adjacent case that shows the boundary):

- The stomach churns; the small intestine absorbs.
- The heart pumps blood; bone marrow makes blood cells.
- Breathed-in air and breathed-out air: both air, different mixtures.
- A person's grinding molars and a fox's slicing carnassials.
- The windpipe (air) and the food pipe (food): two tubes that start near each other.
- Blue on a diagram (a code) and the real color of blood (always red).

**Top misconceptions designed against** (codes used in the companion's choice tags):

`stomach-does-all` (the stomach digests and absorbs everything); `straight-out` (food goes to the stomach and straight out); `swap-intestines` (the large intestine takes in the nutrients); `short-gut` (the intestines are short); `gravity-moves-food` (food just falls); `one-tube-air-food` (food and air share one tube); `heart-makes-blood`; `blue-blood`; `heart-is-lungs` (the heart does the breathing); `pure-swap` (pure oxygen in, pure carbon dioxide out); `no-change` (breathed-out air is unchanged, an underclaim); `air-to-stomach` (breath goes to the belly); `cells-breathe-air`; `one-loop` (blood never visits the lungs); `teeth-same`; `fangs-grind` (pointed or front teeth grind); `teeth-regrow`; `organ-not-cells`; `system-is-organ`; `nutrients-are-groups`; `equal-shares` (a balanced plate is equal parts); `good-bad-food`; history tags `present-back` (reading a later idea into the past), `authority` (an old book proves it) and `harvey-first-guess` (Harvey guessed, or saw every vessel); arithmetic tags `add-not-multiply`, `add-not-subtract`, `multiply-not-divide`, `difference-not-times`, `unit-slip`.

## The game or activity

All four activities share the fold-out chart: a simplified, front-facing outline of a person with a cutaway torso. **Every screen shows:** *A simplified picture of a person's body. Real organs are soft, folded and packed close together, and sizes here are not to scale.* Native buttons, 44 px targets, keyboard operable, no drag-only action (every drag has a tap-to-place equivalent), no timers, no score.

**(a) The supper journey.** A bread-roll token sits at the mouth. Six stop cards (Mouth, Food pipe, Stomach, Small intestine, Large intestine, Out of the body as waste) are shuffled in a tray; the child taps a card then taps the next empty marker on the tube, or uses **Place next**. The tube is drawn as one continuous path, with the small intestine visibly coiled and labeled "several meters long (not to scale)". **Check my order** shows, per marker, whether that stop fits; wrong placements return to the tray with a hint (no total). When ordered, the token moves stop by stop on taps and each stop reveals its one job. A **Supper table groups** side card (optional) shows six pictured supper dishes to sort into the five Eatwell groups, with one mixed dish that belongs to more than one; then a picture match: "Which two groups have the biggest parts on the guide's picture?" It never shows a plate for a person.

**(b) Tooth match.** Four enlarged tooth drawings (incisor, canine, premolar, molar) and three job cards (Cut and bite; Grip and tear; Crush and grind). Premolar and molar both match Crush and grind. Then **Person and fox**: two simplified jaw diagrams side by side, each tooth tappable for its type; counts appear as labels (32 for a grown-up person with all wisdom teeth, 42 for a fox). A final "say why" card for a grown-up to read.

**(c) Pump and pipes.** A simplified loop diagram: heart in the middle, lungs above, "the rest of the body" below, pipes between them. **Model statement:** a made-up circuit with three places and one red blood cell; no real distances, times, pressures or amounts. Sprout and Seedling layer: one tap moves the cell one stop (heart → body → heart → lungs → heart, as one ring with the lungs as a stop). The cell's color shifts between bright red (more oxygen) and darker red (less oxygen); a small oxygen dot is dropped at the body and picked up at the lungs, and a carbon dioxide dot travels the other way. A **Diagram code** card explains blue-coded diagrams. Keeper's layer: the heart opens into four labeled chambers and the ring splits into two loops (lungs loop, body loop); the child steps the cell through both loops in order. Every screen: *A made-up loop to follow one blood cell. Real blood moves through thousands of vessels at once.*

**(d) Which system?** Twelve organ cards (mouth, food pipe, stomach, small intestine, large intestine, heart, blood vessels, lungs, windpipe, diaphragm, brain, nerves) and four labeled baskets: Digestive (food), Circulatory (blood), Respiratory (breathing), Nervous (messages). Tap card, tap basket. The mouth fits Digestive; its feedback notes that air can also pass through it. Wrong sorts get a misconception-tagged line and stay movable.

**Older depth (Keeper's Desk):** a cells-tissues-organs zoom ladder (four tiles, ordered either way) and the Harvey case (problem set D).

**Off-screen card, optional, grown-up-led:** *Feel a pulse.* Text in the companion's Grown-up panel. It says results vary from person to person and moment to moment, that nobody needs to share a number, and that nothing is entered or recorded. The app has no field for it.

## Problem sets

Full items, answers, misconception tags, hints and explanations are in the companion. 28 items in four sets.

| Set | Title | Items | Depths | Formats |
| --- | --- | --- | --- | --- |
| A | The supper journey | 8 | Sprout 3, Seedling 3, Sapling 2 | order cards, 3-choice, match, true or not true |
| B | Teeth, pump and breath | 8 | Sprout 2, Seedling 3, Sapling 3 | 3-choice, match, sort, say why |
| C | Body numbers (example rates) | 7 | Seedling 3, Sapling 3, Keeper's Desk 1 | number answer with worked steps |
| D | How blood was found to go round | 5 | Keeper's Desk 5 | 3-choice, true or not true from this source, order, say why |

Right-answer positions across the 3-choice items are spread A/B/C (tallied in the companion). Every number item uses a labeled example (a 70-beats-a-minute example grown-up heart; a 6 m round example for the small intestine) and never a child's measurement.

## Saved work

Optional root `bodyJourney` per explorer, absent until the explorer opens an activity. Local only.

```
bodyJourney: {
  v: 1,
  source: { pack: 'body-journey', version: 1 },   // frozen ids of stops, teeth, organs, systems, items
  activities: { [activityId]: { placed: [cardId], checks: [{ placed: [cardId], fits: [bool], at }] } }, // latest 8 checks
  items: { [itemId]: { choice: choiceId | null, number: number | null, skipped: bool, support: ['hint'|'worked'|'audio'|'together'] } }
}
```

- Store ids and codes, never prose. *Say why* answers are spoken to a grown-up and never stored, so no free-text field exists that could hold personal details. Validate on ids, counts and shape only; never against today's answer key or wording, and never rewrite saved results on load.
- Support requests, familiarity and independent attempts stay separate fields. "Skip for now" is not a wrong answer.
- **No body data:** there is no field for a pulse, a tooth count, food eaten, breathing or anything about the explorer. A builder must not add one.
- An unreadable item or activity stays exact and exportable and makes only itself read-only; the rest of the pack stays open. Unknown fields survive import and export. Reset, save-off and explorer switching use the existing shared behavior.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **S2** (the human body and organisms; main); **S1** (models and their limits: every diagram states its simplification); **H1** (how evidence changed an idea: the Harvey case); **M** strands for multiplication with real-world rates and comparing lengths; **E** strands for the say-why prompts and the optional *Gazette* guide. Act families: I (scene), II (Ember's birthday jobs), V (own-question project), seasonal Harvest Supper.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Order the digestive stops with one job each; match tooth shape to job; explain that the heart pumps blood through vessels carrying oxygen and food; breathing in and out are both air; (older) breathing and circulation as one coupled loop; cells → tissues → organs → systems. |
| Teaching encounter | The bite of bread traced stop by stop; the incisor-molar comparison; the red cell's first loop. |
| Contrast | Stomach churns and small intestine absorbs; heart pumps and marrow makes; in-air and out-air both air; molars grind and carnassials slice; diagram blue and real red. |
| Supported practice | Guided first items with visible steps; the "I'm stuck" ladder; per-marker feedback in ordering. |
| New application | Person and fox jaws; the Keeper's double loop; body-number problems; the Harvey case. |
| Purposeful revisit | Body Clues and the Movement Bench (muscles squeeze); Food Links ([spec 66](66-living-food-links.md)) for what animals eat; the Harvest Supper each autumn; the Act V *Gazette* guide. |
| Data boundary | Ids of placed cards and chosen answers and support codes, all local; say-why answers are spoken, not stored. No body, health, diet or family data, and no field that could hold it. |

## Upstream check

Jane refreshed at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` (2026-10-24); Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (2026-10-24). Paraphrased; no Marble text copied.

| Topic (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Basic Body Needs (`mt_cxJRc15osy`) | Name food, water, sleep and exercise as needs of every body, as simple cause and effect, with no nutrition detail; it suggests anchoring to the child's felt signals. Deviation by design: the pack teaches the four needs as facts about "every body, people and animals" on one teach card and one sort, and does not ask about the child's own feelings. **Partial.** |
| How Breathing Works (`mt_tiPyEkm4cU`) | Trace nose/mouth → windpipe → two lungs in the chest; lungs take some oxygen and add carbon dioxide; correct "pure oxygen in, pure carbon dioxide out"; keep the windpipe separate from the food pipe; diaphragm later; flag balloon images as approximate. Sprout and Seedling stop at the path and mixture; the diaphragm appears only at Sapling; the chart says lungs are spongy, not hollow balloons. |
| The Heart & Blood (`mt_lp1eTsQen7`) | Pump, tubes, and feeling it; fist-sized, center-left; blood is always red; correct the valentine shape and "heart only beats with feelings". The chart and teach cards do all of these. The research's felt-pulse anchor is offered only as the off-screen grown-up card; the app never collects it. |
| The Digestive Journey (`mt_JpQUM1129q`) | Trace one mouthful through one continuous tube, with order and one key job per stop; absorption in the small intestine, water in the large; muscles, not gravity; intestines meters long; a labeled map is a scaffold, not a substitute for following the food. Activity (a) moves the bite along the tube and reveals jobs; ordering and matching come after, as consolidation. |
| Types of Teeth (`mt_I047mKeeaq`) | Four types tied to actions; animal comparison as evidence for shape-function; keep tooth care separate; include a predict-or-explain task; prefer a clean carnivore example since the fox is an omnivore; teeth are replaced once. The fox comparison is framed as shape and job, the fox is called an omnivore, care is out of scope, and a say-why item asks for reasoning. |
| Cells, Tissues & Organs (`mt_C7FNeIDGc6`) | Trace one example through all four levels, zooming both ways; "trillions" as approximate; watch the paper-tissue meaning. The Keeper's zoom ladder orders both ways, uses the heart example, and the glossary separates the two meanings of tissue. |
| Heart & Blood Circulation (`mt_g_M4Vh_pK7`) | Four chambers, double loop, vessels; color by oxygen level, not fixed red and blue; flow model first, labeling after. Keeper's layer of (c). Blood components are only partly covered (white cells out of scope). **Partial.** |
| How the Lungs Work (`mt_zPDDJLAl-J`) | Keep pathway and diaphragm mechanism on separate passes; name what each model part stands for. Sapling teach cards do pathway first, then the diaphragm card. No acted-on chest model in this slice. **Partial.** |
| Circulation & Breathing Together (`mt_QK-ZZb7UUN`) | Follow oxygen and carbon dioxide both ways in the same blood; cells get oxygen from blood, not air; rates rise together to serve working muscles. The red cell carries both dots both ways; set B targets `cells-breathe-air`. The research's measured own-pulse evidence is deliberately not done in-app. **Partial.** |
| Balanced Diet & Food Groups (`mt_QhLAeAlHI0`) | Food groups from a local guide, nutrients taught separately, balance as proportion over time, mixed dishes, no calories, no good/bad food. The Eatwell sort and proportion picture do this; the plate is the guide's picture, never a child's meal. **Partial** (no hands-on plate building in this slice). |

Not targeted: `mt_DbXWivdJFB` (a second *Types of Teeth* record in another domain) is content-adjacent; it is a candidate reference only, and its hard prerequisite (*The Digestive System*, `mt_Ruk2-lyGPZ`) is not claimed.

**Jane:** adopted the teach → guided → practice order, the "I'm stuck" ladder (hint, easier worked example, skip), misconception-tagged 3-option choices, short second-person prompts and a key-terms glossary. Not adopted: medals, bosses, quests, review gates, mastery, timers, step-downs, points or streaks. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`.

| Target | Hard prerequisite | How it is met |
| --- | --- | --- |
| Basic Body Needs (`mt_cxJRc15osy`) | none | |
| How Breathing Works (`mt_tiPyEkm4cU`) | none | |
| The Heart & Blood (`mt_lp1eTsQen7`) | none | |
| The Digestive Journey (`mt_JpQUM1129q`) | Basic Body Needs (`mt_cxJRc15osy`) | Supported: taught inline on the "every body needs" card before the journey; partial claim only. |
| Types of Teeth (`mt_I047mKeeaq`) | none | |
| Cells, Tissues & Organs (`mt_C7FNeIDGc6`) | none | |
| Heart & Blood Circulation (`mt_g_M4Vh_pK7`) | Cells, Tissues & Organs (`mt_C7FNeIDGc6`) | Taught inline (Keeper's zoom ladder precedes the double loop). |
| | The Heart & Blood (`mt_lp1eTsQen7`) | Taught inline (Sprout/Seedling layer of activity c). |
| How the Lungs Work (`mt_zPDDJLAl-J`) | Cells, Tissues & Organs (`mt_C7FNeIDGc6`) | Taught inline (zoom ladder). |
| | How Breathing Works (`mt_tiPyEkm4cU`) | Taught inline (breathing teach cards). |
| Circulation & Breathing Together (`mt_QK-ZZb7UUN`) | Heart & Blood Circulation (`mt_g_M4Vh_pK7`) | Taught inline, partial (see above). |
| | How the Lungs Work (`mt_zPDDJLAl-J`) | Taught inline, partial (no acted-on diaphragm model). |
| Balanced Diet & Food Groups (`mt_QhLAeAlHI0`) | Basic Body Needs (`mt_cxJRc15osy`) | Supported inline; partial claim. |

## Checks for implementation

- `python3 -I check148.py` (writer's scratch script) was run on 2026-10-25 and confirmed every set C answer and the tooth arithmetic: 70 × 60 = 4,200; 70 × 60 × 24 = 100,800; 32 − 20 = 12; 32 ÷ 4 = 8 = 2+1+2+3; (2+1+2) × 4 = 20; 32 − 4 = 28; 42 − 32 = 10 and the fox formula sums to 42; 6 ÷ 1 = 6; 6 ÷ 1.5 = 4; 70 mL × 70 = 4,900 mL = 4.9 L; × 60 = 294 L; 15 × 60 = 900; 1661 − 1628 = 33. The builder re-runs an equivalent test against the shipped item data.
- The fact-check pass of 2026-10-25 relied on search excerpts. A subject reviewer opens the audit's primary pages (NIDDK, MedlinePlus, Mayo Clinic, the Eatwell Guide, Wellcome Collection) and confirms them before build.
- No screen asks about the explorer's body, food, health or family; a test scans the item data for "your heart", "your teeth", "your body", "you ate" and similar and fails on any hit.
- The simplified-picture line shows on every chart screen and the made-up-loop line on every pump screen.
- Right-answer positions vary; no right answer is the longest choice in its item (a test compares lengths).
- Saved work: no field for body data; unreadable entries stay exact; reload never regrades.
- Browser at 320 and 820 px: the tube, the jaw pair and the loop stack readably; every drag has a tap equivalent; no horizontal scroll.

## Review asks

**Subject expert (medical/biology educator):**
1. Is "several meters long" with a 6 m round example the right honest phrasing, given sources range from about 3 to 7 m?
2. Is "most nutrients pass into the blood" acceptable at this level with the lymph caveat kept to the adult panel?
3. Are the inhaled/exhaled oxygen and carbon dioxide percentages right as rounded figures?
4. Is the fox dental formula (42 teeth) right for the red fox, and is "carnassials slice like scissors" fair?
5. Is the Galen summary in set D accurate and fair to Galen?

**Owner questions (with default):**
1. Eatwell Guide (default, UK) or USDA MyPlate? Default Eatwell, because Marble's record cites it as verified and the valley is in Europe; MyPlate is a one-table swap.
2. Should the off-screen pulse card exist at all? Default: yes, optional and grown-up-led, as written, with nothing recorded.
3. First slice: default (a) the supper journey and (b) tooth match with sets A and B; (c), (d), C and D follow.
