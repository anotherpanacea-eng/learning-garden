# 236. Light, Stars and Signals: rays, the spectrum, codes and the lives of stars

Status: **proposed, 2026-10-25; independent review done 2026-10-25 (facts, numbers, story fit, safety); awaiting a subject check.** Part of the [history and science build-out](../history-and-science-buildout.md), wave 6. Every child-facing line is in [the companion text](../content/236-light-stars-signals-text.md); sources and open checks are in the [source audit](../source-audits/236-light-stars-signals.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent review; the six activities do not commission each other. Story links are future adapters to [spec 120](120-keeper-of-the-ways.md); standalone play stays open and no completion is inferred from a missing adapter. Real sky, lens and lamp work is off screen and grown-up-led; the Sun rule from [spec 162](162-light-room.md) is fixed.

## Purpose

Seven pinned topics in Waves, Light & Sound and Space Exploration have no claim on main. They share one room naturally: light carries pictures, energy and messages, and starlight is how we know what stars are made of. The pack builds on [141](141-sky-watching-night.md) (spin, orbit, the Sun as a star), [146](146-bell-and-drum.md) (sound, and its documented gap at Communication with Light & Sound), [162](162-light-room.md) (seeing, mirrors, straight rays, prisms, the Sun rule), [172](172-beyond-the-planets.md) (Star Story for its older life-of-a-star topic, Payne) and [177](177-moons-comets-other-suns.md) (light as an astronomer's tool). It revisits them and re-teaches none.

A child comes to understand that:

- a signal carries a message only through a **code both sides agreed**; any two states can make a code; the same message can travel by many codes, and codes are compared for a job (quick, rain-proof, easy to learn);
- people join stars into **constellations**; some never set from Willowbank, and the rest change with the seasons because Earth's **orbit** turns the night side toward different stars, while its daily **spin** only moves the same stars across one night;
- stars form inside nebulas (dusty gas clouds), shine by **fusion**, and **mass decides the ending**: a white dwarf for a Sun-like star, a supernova for a much heavier one, which also lives far shorter;
- a flat mirror and a converging lens form **images** found with two rays; images are **real** (catchable on a sheet) or **virtual**, upright or upside down, bigger or smaller, and a camera, a projector and a magnifier are three places on one lens;
- radio to gamma rays are **one family** differing in frequency, all at one speed in empty space; higher frequency carries more energy in each bit, and from ultraviolet up each bit can harm living cells; how much harm any light can do depends on its kind (its color, for visible light), how strong it is and how long it shines;
- a material **reflects, absorbs or transmits** each wave, and what happens is set by the **material and the wave together**; color is what a surface reflects;
- at the Keeper's Desk, the Big Bang left nearly nothing but hydrogen and helium; stars build elements up to iron, where fusion stops paying; supernovas and colliding neutron stars make and scatter the rest.

## Place and story

**Host:** **The Signal Tower**, `#post/tower`, a small round room at the top of Willow Post Office with a shuttered lantern, a mirror, a big glass lens, a box of colored panes and a star chart painted on the ceiling. Dot keeps it. Linked from the post office, the Light Room (`#loft/light`, 162), the Library Roof (`#library/roof`, 141), the Orrery Room (`#library/orrery`, 177) and the Far Window (`#library/far`, 172) where built; otherwise its own route from Explore. Open from the start. The route was checked unused on main (`grep -rn "#post/tower" docs`).

Each scene is an optional job; none decides a town choice.

- **Act I, chapter 4 (mend the village):** the storm cracked the tower lantern. You and Dot mend it; Pip flashes it at the bakery and the baker waves, but nothing was agreed. Opens (a). The old Keeper is not mentioned.
- **Act II, chapter 2 (a garden across the seasons):** the librarian's almanac star page; Orion stood over the footbridge at Lantern Night and is gone in summer. Opens (b).
- **Act II, chapter 4 (the first show):** the Story Loft's magic lantern throws Bramble's dragon upside down; Pip asks about half a lens. Opens (d).
- **Act III, chapter 4 (letters up and down the river):** a note from Nuria (one Spanish line, English beside it): her grandmother's radio, in the big city by the sea, played inside a stone house, but lamp light won't pass the wall; it went quiet in a metal elevator. Opens (e). (The radio stays in the grandmother's city, never in the valley, so the Act VI runner and courier still make sense.)
- **Act V, path 3 (a sky-watching night):** on the mill roof with Hollis's telescope, Ember's red "dragon star" is Betelgeuse (near the end of its life, not old in years) and the fuzzy patch is the Orion Nebula. Opens (c) and (f).
- **Act VI, chapter 3 (the long rain), getting ready:** the miller wants lamp signals between the mill and the bridge; rain hides short flashes, so the code must survive with long flashes alone. Opens the compare panel in (a). The runner and {courier} still carry the warning exactly as spec 120 says; the lamps only help Willowbank talk to itself.

Willowbank and its people are fiction, labeled apart from science, history and model cards. Pronouns follow spec 120 (Dot she/her, Pip he/him, Bramble she/her, the miller she/her, the librarian they/them, Nuria she/her, Léon he/him; `{guide}` never gendered). Hollis is named only in the Act V scene. Ember is "her", as in spec 120's story text.

## The knowledge

**Codes (Sprout to Sapling).** A signal is a flash, sound or sign; a message is what is meant; a code is an agreed mapping between them. Any two distinguishable states can carry any message when combined into patterns (the meaning comes from the agreement; the symbols mean nothing alone). The same message can go by many codes. Codes trade off: speed (beats), noise resistance, ease of learning. A picture can be a grid of two states, and which number means dark is a convention both sides must share. Braille uses six raised-or-flat places: 63 patterns with at least one dot (computed).

**Star patterns and the seasons (Sprout to Sapling).** Recognition first: Orion's belt, the Big Dipper (in Ursa Major), Cassiopeia's W, Leo's sickle, Scorpius's hook, Pegasus's square. Lines are drawn by people; the stars lie at very different distances. From about 42.5° N, stars north of declination +47.5° never set: the Big Dipper and Cassiopeia are always up (computed from catalog declinations). Daily spin moves stars east to west across one night; the yearly orbit changes which stars face the night side. At midnight the night side faces Orion in December, Leo in March, Scorpius in June and Pegasus in September (computed); in June Orion is behind the Sun, in the day sky. What causes the seasons is tilt (141's) and is kept separate.

**A star's life (Seedling to Sapling).** Gravity pulls a nebula together until hydrogen in the core fuses into helium; stars are not fire. A Sun-like star shines about 10 billion years (about 4.6 billion done), swells into a red giant and leaves a white dwarf; it will not explode. A much heavier star swells into a supergiant and ends as a supernova, leaving a dense core. A star ten times the Sun's mass lives about 20 million years (500 times shorter, computed). We piece the life together from many stars seen at different ages. Nebula and galaxy are kept apart. Spec 172 claims the older *Life Cycle of a Star* topic with balance arrows; this pack is the younger telling and links to it.

**Mirrors and lenses (Sapling to Keeper's Desk).** Light leaves each point of an object every which way; a ray diagram follows just two handy rays from one point to locate its image. Flat mirror: reflection at equal angles (measured from the normal), reflected rays traced back dashed; the image sits behind the glass at the object's own distance, same size, upright, virtual. Converging lens, F at 4 grid squares, object 2 squares tall (computed with exact fractions and checked by intersecting the principal rays):

| Object distance | Image | Kind | Device |
| --- | --- | --- | --- |
| 12 | 6 past the lens, 1 tall | real, upside down, smaller | camera |
| 8 (2F) | 8 past, 2 tall | real, upside down, same size | |
| 6 | 12 past, 4 tall | real, upside down, bigger | projector, magic lantern |
| 4 (F) | rays leave parallel; no sheet catches it, but an eye looking through the lens sees it big and far off | virtual, upright, bigger (far off) | magnifier |
| 2 | 4 behind, on the object's side, 4 tall | virtual, upright, bigger | magnifier |

Solid lines are real light; dashed lines are apparent paths. Covering half the lens leaves the whole image, dimmer; removing the lens removes the image. The lens's bending is supported inline (light bends entering glass at a slant), not claimed.

**One family of light (Sapling to Keeper's Desk).** Radio, microwaves, infrared, visible, ultraviolet, X-rays, gamma rays: one family ("frequency ranges", not "kinds") ordered from lowest to highest frequency (and energy). All travel at about 300,000 km/s (186,000 mi/s) in a vacuum; sunlight takes about 500 s (8 min 20 s; 499 s exact, computed). The Sun gives out light from every range; visible light is radiation. How much harm light can do depends on its kind (its color, for visible light), how strong it is and how long it shines. From ultraviolet up, each bit carries enough energy to harm living cells, and X-rays and gamma rays can ionize atoms. No claim is made that lower ranges are harmless or harm only by heating (bright blue light, for one, can harm the eye without heating it) (EPA classes ultraviolet as non-ionizing but notes it can burn and damage tissue). No drawing shows the range to scale. One use per rung, one care where relevant. Body hazards appear only as "living cells"; no sun-care advice on screen; skin care is in the Grown-up panel.

**Waves meeting materials (Keeper's Desk).** Where a wave meets a material, part of it bounces off, part soaks in and part passes through, in shares that vary; absorbed energy warms the material. Material and wave decide it together: glass transmits visible light and radio but absorbs warm-object (long-wave) infrared; stone transmits most radio but no light; metal reflects radio, infrared and light; a microwave oven's door mesh reflects 12 cm microwaves but passes light. The size-only rule is broken by X-rays passing soft tissue (a drawn fish). Color is selective reflection: a red apple under blue light looks dark. Communications follow fates: radio through walls, infrared remotes by line of sight, light guided in glass fiber (Keeper's note only).

**Where elements come from (Keeper's Desk).** The Big Bang made hydrogen and helium (about 3 to 1 by mass) plus a little lithium. Stars fuse up a ladder to iron, each step releasing energy; fusing iron absorbs energy, so a heavy star's core collapses (the iron wall is an energy turn, not an empty tank). Heavier elements form by neutron capture: some in aging giant stars, the heaviest such as gold probably mainly in neutron-star collisions and perhaps rare supernovas (child text says "probably"). Winds, supernovas and collisions scatter elements into clouds that form new stars and planets. Fusion changes nuclei; chemistry changes bonds. Payoff without "your body": the iron in Pip's blood and the calcium in a fish's bones were made in stars.

**History cards (real, checked; more than one culture).** Chappe's semaphore line, Paris to Lille (1794; no distance in child text, since sources give 210 and 230 km). Morse's first long-distance message, Washington to Baltimore (24 May 1844). Yorùbá dùndún talking drums copying the tones of speech (West Africa; 2021 acoustic study). Louis Braille's six-dot code (1824, published 1829). Matariki, the Pleiades rising in midwinter for the Māori new year (Aotearoa New Zealand; public holiday since 2022). The Mohist account of a pinhole's upside-down picture (China, more than 2,000 years ago). Huygens's magic-lantern skeleton (about 1659). Herschel's infrared (1800, revisited from 179) and Ritter's ultraviolet (1801). J. C. Bose's radio bell through walls (Calcutta, 1895). Hertz's radio waves (late 1880s) and Röntgen's X-rays (1895). B²FH (1957) with Payne (1925, revisited from 172). The neutron-star collision of 17 August 2017.

## The lesson

Every activity follows Jane's **teach → guided → practice** order: a teach card with a worked example revealed a step per tap, a guided first item with 1-4 visible steps, then practice.

| Activity | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Lantern Codes | T1-T4 | "All safe" with a shared card, 2 steps | Set 1 |
| Sky Wheel | T5-T9 | December night side, 3 steps | Set 2 |
| Star Seeds | T10-T13 | Sun-like path from the cloud, 2 steps | Set 3 |
| Ray Bench | T14-T17 | Lamp at 12 squares, two rays, 3 steps | Set 4 |
| Light Ladder and Window Test | T18-T23 | Visible placed first, 1 step | Set 5 |
| The Star Forge | T24-T27 | Hydrogen to helium, read the meter, 2 steps | Set 6 |

**"I'm stuck" ladder** on every item: (1) the item's hint; (2) a worked example of an easier similar case plus how to start this one; (3) **Skip for now**, with no penalty and nothing recorded against the child.

**Contrasts:** signal vs message; message vs code; quick vs rain-proof; always-up vs seasonal; spin vs orbit; hidden vs gone; nebula vs galaxy; fire vs fusion; heavier vs longer-lived; real vs virtual; half a lens vs half a picture; lens in vs lens out; energy vs speed; the same wall for radio and light; size-only vs material-and-wave; fusion before iron vs after.

**Top misconceptions designed against** (codes in the companion): any signal communicates; one right code; code is computer magic; message is the code; quickest is best; constellations move away; spin not orbit; stars do the moving; constellation lines are real; stars are fire; nebula is a galaxy; bigger lives longer; the Sun will supernova; we watch one star; image on the surface; virtual is real; half lens half picture; picture copies the object's way up; every lens picture is real; more energy is faster; longer waves are faster; all radiation is dangerous; radiation is man-made; radio is sound; one fate per material; size only; color is in the object; all elements from the Big Bang; Earth made its own elements; ran out of fuel.

## The game or activity

**(a) Lantern Codes, model `lamp-code-v1`.** *A made-up model; the rule is on screen.* Four messages (All safe, Water rising, Boards in, Come help). The child builds a pattern of 1-5 flashes, short or long, for each, then chooses whether to **Give Dot the card**. Send: Dot reads by the card; with no card she sees flashes only; two equal patterns are flagged. Beats: short 1, long 3, 1 between flashes. **Rain on**: Dot sees only long flashes, so a code works in rain only if its long-flash views are all different and non-empty. Presets: Code A (S, L, SS, SL: 12 beats in all, a quickest possible code, fails in rain) and Code B (L, LL, LLL, LLLL: 36 beats, the quickest rain-proof code). Both "quickest" claims were brute-forced over all 13,388,280 four-message codes of up to five flashes. The compare panel sets the child's code beside A and B; "easy to learn" is spoken, never stored. Optional 5 × 5 picture grid: the child chooses whether 1 means dark and must tell Dot; a swapped rule swaps light and dark. Model line: "Real rain doesn't hide every short flash. This bench uses one rule: in rain, only long flashes show."

**(b) Sky Wheel, model `sky-wheel-v1`.** Recognition first: six patterns to find in a sky window, lines labeled as drawn. Then a top-down wheel: Earth at December, March, June or September; the child shades the side away from the Sun and names the pattern it faces (Orion, Leo, Scorpius, Pegasus); a linked sky window shows the ground view, with the Big Dipper and Cassiopeia always on an inner ring. A spin/orbit toggle separates one night (same stars rise and set) from one year. June shows Orion in the bright day sky "behind the Sun". A southern card notes reversed seasons and Matariki. Model line: four months at midnight; the evening sky runs about two months behind.

**(c) Star Seeds.** Life cards with a **Mass** switch (like the Sun / ten times heavier) that sends one cloud down two paths, with lifespan bars (about 10 billion vs about 20 million years) and the Sun marked "here, about halfway". A many-stars window asks the child to stage each object, to show how the life is inferred. Model line: simplified, not to scale; links to 172's Star Story.

**(d) Ray Bench, model `ray-v1`.** Mirror or lens; the lamp arrow at 12, 8, 6, 4 or 2 squares (lens) or 1-5 steps (mirror). The child marks F, then **draws** two rays by dragging their ends (snapping to grid points), solid for real light and dashed for traced-back paths, then classifies the image on three toggles (at F: virtual, upright, bigger, with a "far off" note, since no sheet catches it but an eye looking through the lens sees it). **Check** overlays the bench's rays; the child compares. Predict-then-try: cover half the lens (whole image, dimmer), take the lens away (no image), move the sheet (only real images catch), drag the drawn eye (can it see the image from there?). Model line: a thin perfect lens; drawn distances are only close.

**(e) Light Ladder and Window Test, model `fates-v1`.** Order seven rungs, then reveal one use and one care each; speed and scale lines. Window Test: four materials (window glass, stone wall, metal sheet, black cloth) × three waves (radio, warm-object infrared, visible); the child predicts the main fate, then sees a 10-token bar (reflect + absorb + transmit = 10). Only the largest share in each cell is a sourced claim; the other shares are illustrative and labeled. Black cloth with infrared is left off. An X-ray puzzle card and a color card (red apple under white then blue light) follow. Model line: "The token shares are rounded and made up. Only the biggest share in each cell comes from real tests. Thickness matters too."

**(f) The Star Forge (Keeper's Desk), model `forge-v1`.** A fusion ladder from hydrogen to iron with an energy meter that reads **out** up to iron and turns to **in** past it; an origin sort for seven elements (Big Bang; aging Sun-like stars; heavy stars and supernovas; colliding neutron stars), where cards with two honest homes say so (helium, carbon); a recycling loop. Model line: the meter shows only the direction of energy.

No timers, scores, streaks, medals or locks. Every activity is open from the first visit.

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| 1. Lantern codes | Sprout (1.1-1.3), Seedling (1.4-1.6), Sapling (1.7) | 7 | 3-choice, number with steps, one *say why* |
| 2. Star patterns through the year | Sprout (2.1-2.2), Seedling (2.3-2.4), Sapling (2.5-2.6) | 6 | 3-choice, order cards |
| 3. A star's life | Seedling (3.1-3.3), Sapling (3.4-3.6) | 6 | 3-choice, order cards |
| 4. Mirrors, lenses and pictures | Sapling (4.1-4.3), Keeper's Desk (4.4-4.6) | 6 | 3-choice, number with steps |
| 5. One family of light | Sapling (5.1-5.3), Keeper's Desk (5.4-5.7) | 7 | order cards, 3-choice |
| 6. Star-made atoms | Keeper's Desk | 4 | 3-choice, number with steps |

Sprout items use no digits (checked by script). Each of the 28 three-choice items has exactly one right answer; positions are A 9, B 10, C 9 (checked against the companion by script). *Say why* items are read by a grown-up and never auto-graded or stored.

## Saved work

**Frozen source and capacity contract (required before build).** On the first explicit action in an owned bench, freeze all its authored cases: teaching and worked examples, task prompts, ordered choices and keys, feedback, hint/example text, model tables, assumptions and rules, plus the selected configuration. That complete value is the bench's working `source`; a pack/version label or id alone is insufficient. The sketches below have one waiting/current state per bench, not multiple working versions. A catalog revision never changes that waiting bench or any old record. Every newly kept record and retained response carries its own direct complete `source` snapshot copied from the working bench at the time of that record; it never points back to the shared working slot. New kept records continue to use that bench's frozen cases, not today's catalog. No source registry or implicit source refresh is introduced. Rendering, previews, notes and suggestion reads are pure; resuming/importing never rebuilds source, regrades saved outcomes or requires today's item counts. Keep malformed siblings raw and exportable while readable work stays open.

Each retained run or visit has a bounded stable local id. The list capacities below are refusal limits, not rolling windows: never silently evict, trim or overwrite already-kept work. Before any write, test the whole candidate against shared recovery limits and the actual pretty-notes-report `prepareProgressImport` preflight; on refusal leave all roots unchanged and keep any unsaved visible input. Offer the existing notes download, then allow selection of a removable retained run/visit and a separate confirmation naming it and warning that its source and kept work will be removed. Cancellation writes nothing; remove exactly the confirmed selection, protect fixed teaching and unrelated work, and commit only this subject root after successful preflight. Downloading does not itself authorize removal. No second backup system, mastery claim or automatic history loss is introduced.

Optional root `signals` per explorer, absent until a first explicit action.

```
signals: {
  version: 1,
  codes: { source, kept: [{ id, source, patterns: { [msgId]: 'S'|'L' string, 1-5 }, card: true|false, rain: true|false, at }] }, // capacity 8; refuse if full; never evict
  grid: { source, cells: '0'|'1' x 25, darkIs: '0'|'1', at } | null,
  rays: { source, kept: [{ id, source, tool: 'mirror'|'lens', place, rays: [[x1,y1,x2,y2,dashed]] (max 4), kind: [real, upright, size], at }] }, // capacity 8; refuse if full; never evict
  fates: { source, kept: [{ id, source, material, wave, predicted, at }] },   // capacity 12; refuse if full; never evict
  forge: { source, sorted: { [element]: binId }, at } | null,
  answers: { [itemId]: { source, choice | value | order, support: ['hint'|'example'|'skip'], at } }
}
```

- No `sky` or `stars` records: the wheel month, spin/orbit toggle and mass switch are views, not work, so nothing is saved for them (cut at review).
- Every `source` in the sketch is a complete authored value, including text, as defined above. Only learner response payloads are restricted to bounded codes, ids, numbers and the declared structured selections or placements; no free-form learner prose is collected. Spoken *say why* responses are not stored.
- Never recompute or rewrite saved results on load (beats, readability, image kind and fates are shown from the frozen source and rule, not re-derived into the record); validate ids, pattern strings (`^[SL]{1,5}$`), grid length, ray counts and coordinate ranges; an unreadable entry stays raw and exportable while everything else stays open.
- Support codes stay separate from answers; no mastery flag. Writes preflight through `prepareProgressImport`; export, import, reset and switching are shared.

## Curriculum fit

**Strands:** **S6** light, images, the electromagnetic family and wave-material interactions; **S8** constellations, Earth's orbit, star lives and the origin of elements; **S1** comparing designed solutions against criteria (codes) and inferring from many cases (stars); **E4** a message for a reader (the code card); **M** multiplication patterns (Braille), fractions (lens check, the 3-to-1 gas) and rates (beats). Act families: I (recovery), II (seasons and the show), III (letters), V (projects), VI (the long rain).

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Design, send and compare codes; name patterns and explain seasonal visibility by orbit; tell a star's life with mass as the branch; draw and classify mirror and lens images; order the family of light and reason about speed and hazard; predict fates by material and wave; explain where elements were made. |
| Teaching encounter | T1-T27 with step-by-step worked examples; each bench's guided first run. |
| Contrast | No card vs card; Code A vs Code B in rain; spin vs orbit; Big Dipper vs Orion; Sun-like vs ten times heavier; real vs virtual; half lens; same wall, two waves; X-ray puzzle; meter before and after iron. |
| Supported practice | Guided items with visible steps; the ladder; the beat counter; the bench check overlays; the 10-token bar. |
| New application | The Act VI rain code; the magic-lantern dragon; Nuria's grandmother's radio and the metal elevator; the microwave door; the iron in the lantern's hinge. |
| Purposeful revisit | 141's spin and orbit and the Sun as a star; 146's sound and its communication gap; 162's straight rays, mirrors, prisms and Sun rule; 172's Star Story and Payne; 177's starlight as evidence; 179's Herschel and infrared. |
| Learner-response boundary | Codes, grid cells, bench settings, drawn ray coordinates, choices and support codes, all local. No free-form learner prose, timing, location, body, sky-observation or off-screen data. |

## Upstream check

Jane refreshed at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both re-confirmed 2026-10-25). Target ids confirmed in the pinned `curriculum/marble/topics.json` and as "not yet mapped" in `curriculum/topic-coverage.csv`; `grep -rn` over `docs/` on main finds none of the seven ids. Paraphrases are mine; no record text is copied.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Patterns & Codes for Information (`mt_n5_Jt4ExUd`) | Design and compare, not decoding sheets; encode then decode with a shared key; any two states; message vs code; rank codes by criteria; run the noise test rather than assert it. Lantern Codes with Dot as the on-screen partner and the off-screen flashlight card; Set 1. |
| Seasonal Constellations (`mt_9VZem2vUqk`) | Recognition first; night side faces outward; "behind the Sun", not gone; spin kept apart from orbit; circumpolar contrast; lines not real; orbit cause as enrichment, distinct from tilt. Sky Wheel, T5-T9, Set 2. |
| Life Cycle of Stars (`mt_iTjrKEdAOj`) | A named life story with mass as the branch; fusion not fire; heavier lives shorter; the Sun ends as a white dwarf; remnants and scattering; infer from many stars; nebula vs galaxy. Star Seeds, T10-T13, Set 3. |
| Ray Diagrams & Images (`mt_FVERuBoCD1`) | Predict, observe, reconcile; every point radiates; fixed routine (F first, solid vs dashed); the object sweep to camera, projector, magnifier; cover-half and remove-the-lens; "where must the eye be". Ray Bench with child-drawn rays, T14-T17, Set 4. Drawing is snapped to grid points, not freehand. |
| The Electromagnetic Spectrum (`mt_XSp-S0wter`) | "Frequency ranges", not kinds; order the seven; one vacuum speed; harm by frequency and dose with the threshold near ultraviolet; the Sun emits all; visible is radiation; scale named as undrawable. Light Ladder, T18-T20, 5.1-5.3; treated as Keeper's-Desk-depth extension as the record advises. |
| Waves & Different Materials (`mt_w5HzPpOUmj`) | Three fates summing to the input; absorbed energy warms; material and frequency together; color as selective reflection; band-to-job reasons; break size-only with the X-ray puzzle; qualitative shares. Window Test, T21-T23, 5.4-5.7. |
| Where Elements Come From (`mt_KYx0m4OyZv`) | Factories in sequence; the iron wall as an energy reversal; neutron-star collisions named honestly; recycling; fusion vs chemistry; the payoff in living things. The Star Forge, T24-T27, Set 6; the payoff uses Pip and a fish, never "your body". |

Candidate references, no claim: *Spotting Constellations* (`mt_BVpB5wyijZ`) is taught inline as the recognition step but is not one of this pack's targets (141 also leaves it unclaimed); *Reflection & Refraction* (`mt_PifbJOuXrG`) and *Wave Properties & Types* (`mt_LxK9OKZQZX`) are supported inline only; *Communication with Light & Sound* (`mt_ZL9qVVnpwN`) needs a built physical device, which this pack offers only as an optional, unrecorded off-screen card.

**Jane:** adopted the teach → guided → practice order, the three-step "I'm stuck" ladder, short second-person prompts, three options with misconception-tagged distractors, worked examples revealed a step at a time, and a key-terms glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, hearts or points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json` (every hard edge of every target):

| Target | Hard prerequisite | How it is met |
| --- | --- | --- |
| Patterns & Codes for Information | Communication with Light & Sound (`mt_ZL9qVVnpwN`) | Supported inline, no claim: Scene 1's lamp and the off-screen flashlight card. Claimed by no spec on main (146 records it as a gap). Documented gap; never a gate. |
| Seasonal Constellations | Spotting Constellations (`mt_BVpB5wyijZ`) | Supported inline, no claim: the Sky Wheel's recognition step runs first (T5, T6, 2.1). Unclaimed on main (141 lists it as a candidate). Documented gap. |
| Seasonal Constellations | Earth's Spin & Orbit (`mt_w2xiMNkyyX`) | Met elsewhere: spec 141 claims it (spin before orbit); T7-T8 revisit. |
| Life Cycle of Stars | The Sun is a star (`mt_u3Y3Tb-G_n`) | Met elsewhere: spec 141 claims it (lamp card, set C); the Sun marker revisits. |
| Ray Diagrams & Images | Reflection & Refraction (`mt_PifbJOuXrG`) | Supported inline, no claim: T14 (equal angles from the normal) and T15 (bending at a slant). 162 revisits the law without a claim. Documented gap. |
| The Electromagnetic Spectrum | Wave Properties & Types (`mt_LxK9OKZQZX`) | Supported inline, no claim: frequency and wavelength in words (T18, glossary). Unclaimed on main (146 records it as a gap). Documented gap. |
| Waves & Different Materials | Wave Properties & Types (`mt_LxK9OKZQZX`) | As above: supported inline, documented gap. |
| Waves & Different Materials | The Electromagnetic Spectrum (`mt_XSp-S0wter`) | Taught here: the Light Ladder comes before the Window Test. |
| Where Elements Come From | Life Cycle of Stars (`mt_iTjrKEdAOj`) | Taught here: Star Seeds comes before the Star Forge. |

`crosswalk2.py` (scratch area) reports nothing missing for this spec.

## Checks for implementation

- **Numbers script run (2026-10-25):** `check225.py` (scratch area, `python3 -I`) confirmed the beat counts (Code A 1, 3, 3, 5 = 12; Code B 3, 7, 11, 15 = 36; item 1.4 = 5); brute-forced all 13,388,280 four-message codes of up to five flashes (874,800 rain-proof) to confirm 12 and 36 are the minimum totals; Braille 63 two ways; the sky wheel's unique nearest pattern for each month and Orion behind the June Sun; circumpolar status of 12 Big Dipper and Cassiopeia stars at 42.5° N and the rising of six seasonal stars (Antares peaks near 21°); every lens case by exact fractions and by intersecting two and three principal rays; mirror distances; the 500 s and 499 s light times, 186,000 mi/s, 12 cm and 3 m wavelengths; 25 kg and 75 kg; the 500-fold lifespan ratio and 5.4 billion years left; and the answer key, option counts, one-right-answer rule, Sprout no-digit rule and item count against the companion. **13,388,419 checks passed** (13,388,280 of them brute-force codes).
- Model lines on every bench; no digits on Sprout screens; the Sun rule on arrival, the Sky Wheel, the Ray Bench, the Light Ladder and the Grown-up panel, word for word from spec 162's companion, plus the lens line on the Ray Bench.
- Style check on the companion (`style225.py`): no em-dashes, no "wrong"; teach cards ≤30 words; prompts ≤15 words; feedback ≤20 words; scenes within spec 120's lengths. All passed.
- At 320 and 820 px: 44 px targets; tap-to-place for ray ends as well as drag; text equivalents for the wheel, the ray overlay, the token bar and the energy meter; the flash sender has a visible pattern strip as well as light.

## Review asks

**Subject expert:**
1. Is the `fates-v1` cell list fair, especially "stone: most radio through" and "glass: warm-object infrared mostly absorbed"?
2. Is the hazard pair fair: "from ultraviolet up, each bit can harm living cells" plus "harm depends on the kind of light, how strong it is and how long it shines", given that ultraviolet is non-ionizing in EPA's scheme but still damages tissue, and bright visible light can harm the eye?
3. Is the midnight sky wheel (Orion, Leo, Scorpius, Pegasus) a fair four-point simplification for 42.5° N?
4. Is "the heaviest elements, such as gold, mainly from neutron-star collisions" the right present-day hedge?

**Owner questions, with my defaults:**
1. Claim *Spotting Constellations* (`mt_BVpB5wyijZ`) too, since the recognition step teaches it? *Default: no; it stays an inline support, listed as a candidate, until a reviewer agrees the six-pattern step meets its record.*
2. Keep the Braille card and item 1.7 (Sapling)? *Default: yes; it is a two-state code with a real history, and the item is multiplication, not a claim about blindness.*
3. Keep Betelgeuse's future supernova in the Act V scene? *Default: yes, as "probably not for a very long time; nobody knows the day", with no date given.*
