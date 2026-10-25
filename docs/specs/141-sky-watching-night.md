# 141. The Sky-Watching Night: Earth, Moon, Sun and the planets

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a subject check.** Part of the [history and science build-out](../history-and-science-buildout.md). Every child-facing line is in [the companion text](../content/141-sky-watching-night-text.md); sources are in [the source audit](../source-audits/141-sky-watching-night.md).

**Commissioning boundary:** this is a proposal only. A first slice should be chosen after independent content, model and save review; the presence of four benches here does not commission all of them. Every Act and chapter link below is a future adapter to draft [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an adapter that does not exist. Real moon-phase observation and the calculated moon table belong to draft [spec 116, Field Guide Almanac](https://github.com/anotherpanacea-eng/learning-garden/pull/128) (draft PR #128); this spec links to it and does not repeat it.

## Purpose

The game has no Earth-and-space destination. The [strand map](../six-act-strands.md) gives S8 (deep time, fossils, Earth and space) 71 source topics, and the Space Exploration (26) and Space Systems and Earth's History (16) domains have no built lesson. Spec 106 covers fossils; spec 116 covers sky noticing and moon shapes. Nothing teaches why day, night, the year and the seasons happen, how big and empty the solar system is, or how telescope evidence changed what people thought about the sky.

A child who plays this comes to understand that:

- day and night come from Earth's spin, and the year from Earth's trip around the Sun;
- seasons come from the tilt of Earth's axis, and Earth is in fact a little closer to the Sun in northern winter;
- the Moon is always half lit by the Sun, and its phases are how much of that lit half we see; an eclipse is a different, rarer event;
- the eight planets go around the Sun in a fixed order, small rocky ones near and giant ones far;
- the solar system is mostly empty space, and a scale model must use one ratio for everything;
- the Sun is a star, our nearest, and its light takes about 8 minutes 20 seconds to reach us;
- in 1610 Galileo's telescope showed moons going around Jupiter, evidence that not everything circles Earth.

## Place and story

**Host:** a new destination, **The Library Roof**, at `#library/roof`. No `#library` route exists in the built app (checked in `dist/` on 2026-10-25), so this registers as its own route, linked from Explore and Home. The roof is a fictional flat terrace with a rail, a lamp bench, a telescope on a stand and a star chart. When spec 116 exists, its Sky page links here as **Why does the sky change?**; when spec 120 exists, Act V's project page offers it as the sky-watching path. The Scale Walk opens on the river path (`#library/roof/walk`) because it needs room.

**Story feeds** (future adapters to spec 120):

- **Act V, A Question of Your Own:** the *sky-watching night* project path. The explorer plans a sky night for the town, tests the benches, makes the Scale Walk, and keeps a project page with one stated limit.
- **Winter, Lantern Night:** the night is set on Lantern Night. The lanterns on the bridge are dimmed for one hour so people can see the stars. This can play in any act when the real calendar reaches winter.
- **Act II, Ember's birthday** (optional callback): Ember can't see the stars because Ember glows.

**Story beat:** the librarian finds a blank page headed *For the next Keeper* tucked in Hollis's old star chart. Ember wants to see stars but glows too brightly to see faint ones. Dot lends her hat. Bramble's magpie wants to collect Jupiter because it is shiny. Pip wants to know which planet is a seed he can eat. The town walks the solar system from the bakery to the bridge.

## The knowledge

Plain adult prose. Every fact was checked in the 2026-10-25 passes; sources are in the audit. Numbers from a computation say so.

**Day and night.** Earth spins on its axis about once every 24 hours (the solar day). The half facing the Sun has day; the half facing away has night. It is always day somewhere. The Sun only appears to cross the sky because we turn; "sunrise" and "sunset" are names for an appearance. Night is not the Sun going behind hills, behind clouds, or away to another place.

**The year.** Earth travels around the Sun once in about 365 and a quarter days. That trip is one year. Spin makes the day; orbit makes the year. These are two motions on two timescales.

**Seasons.** Earth's axis is tilted about 23.4 degrees (computed with PyEphem for 2026: 23.44°) and keeps pointing the same way in space all year. As Earth goes around the Sun, first the northern half and then the southern half leans toward the Sun. The half leaning toward the Sun gets more direct sunlight (the Sun is higher, so the same light falls on a smaller patch of ground) and longer days. That half has summer. At a latitude of 42.5°N, like the fictional valley's, the noon Sun is about 71° high at the June solstice and about 24° high at the December solstice, and the day is about 15 hours 18 minutes long in June and about 9 hours 4 minutes in December (computed with PyEphem, refraction included).

The distance idea is wrong, and two facts show it. First, Earth is closest to the Sun in early January (perihelion, about 147.1 million km) and farthest in early July (aphelion, about 152.1 million km), which is northern winter and summer the wrong way round for the distance idea (computed with PyEphem for 2026 and 2027: perihelion 3 January, aphelion 5-6 July). Second, the two hemispheres are the same distance from the Sun at any moment yet have opposite seasons. The difference in distance is about 3 percent.

**The Moon's phases.** The Moon goes around Earth and shines by reflected sunlight. The Sun always lights half of it. A phase is how much of that lit half faces us. New moon to new moon takes about 29.5 days (computed: mean of 100 lunations from 2000, 29.53 days). The dark part of a crescent is not Earth's shadow. A lunar eclipse is the rare case when Earth's shadow does fall on the Moon; it can only happen at full moon, and most full moons miss because the Moon's orbit is tilted about 5 degrees to Earth's (NASA: about 5.1°). A solar eclipse is when the Moon passes between the Sun and Earth, at new moon. Spec 116 owns observing and naming the real phases; this spec owns the bench model of why.

**The planets.** In order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. The inner four are small and rocky; the outer four are giants made mostly of gas and ice, with no solid surface to stand on. Features used here: Mercury is the smallest and closest; Venus is wrapped in thick clouds and is the hottest planet; Earth has liquid water on its surface; Mars looks red from iron-rich dust; Jupiter is the largest and has a giant storm, the Great Red Spot; Saturn has bright wide rings; Uranus spins tipped on its side; Neptune is farthest. Moon counts change as new moons are found, so none are given. Pluto was reclassified as a dwarf planet in 2006 when the International Astronomical Union set a definition of "planet". The 2006 announcement named Ceres, Pluto and the body now called Eris as the first dwarf planets.

**Diameters and mean distances** (NSSDC Planetary Fact Sheet, metric; Sun: NSSDC volumetric mean radius 695,700 km, so diameter 1,391,400 km):

| Planet | Diameter (km) | Mean distance (million km) | Sun-widths from the Sun | Sun is this many times wider |
| --- | --- | --- | --- | --- |
| Mercury | 4,879 | 57.9 | 41.6 | 285 |
| Venus | 12,104 | 108.2 | 77.8 | 115 |
| Earth | 12,756 | 149.6 | 107.5 | 109 |
| Mars | 6,792 | 228.0 | 163.9 | 205 |
| Jupiter | 142,984 | 778.5 | 559.5 | 9.7 |
| Saturn | 120,536 | 1,432.0 | 1,029.2 | 11.5 |
| Uranus | 51,118 | 2,867.0 | 2,060.5 | 27.2 |
| Neptune | 49,528 | 4,515.0 | 3,244.9 | 28.1 |

The last two columns are computed and give the child a simple method: a planet's distance in the model is its Sun-widths times the model Sun's width, and its size is the model Sun's width divided by the last column.

**The Sun is a star.** The Sun is the nearest star. Other stars are suns much farther away, which is why they look like points. The Sun is not the biggest or brightest star; it looks brightest because it is closest. Planets and the Moon shine because sunlight bounces off them; stars make their own light.

**Light time.** Light travels about 300,000 km each second (299,792.458 km/s exactly, by definition). At the mean Earth-Sun distance (1 astronomical unit, 149,597,870.7 km) light takes 499.0 seconds, which is 8 minutes 19 seconds, usually rounded to "about 8 minutes 20 seconds" (computed). Moonlight takes about 1.3 seconds. Mars's distance from Earth changes as both planets orbit: between about 57 and 400 million km in 2020-2039 (computed with PyEphem), so a radio message takes between about 3 and 22 minutes one way.

**Galileo's telescope (history card).** Galileo Galilei did not invent the telescope; he heard of the new Dutch spyglass in 1609, showed an 8-power instrument to the Venetian Senate that August, and built a 20-power one that autumn. In late 1609 he looked at the Moon and saw light and shadow along the line between day and night on it, which he explained as mountains and craters. On 7 January 1610, in Padua, he saw three small "stars" in a line beside Jupiter, and over the following nights found four, which changed sides and kept up with Jupiter. He concluded they go around Jupiter. He published these observations in *Sidereus Nuncius* (*The Starry Messenger*), Venice, March 1610. Moons circling Jupiter showed that not everything in the sky circles Earth. That fit the Sun-centered model Copernicus had published in 1543, though it did not prove it alone; acceptance came over decades and met resistance from common sense and authority. The earlier Earth-centered model (Ptolemy's) was careful work that matched what people saw: the sky really does seem to turn around us.

**Jupiter's moons reconstruction.** The Galileo's notebook activity uses positions computed with PyEphem 4.2.1 (its model of the four large moons) for 17:30 UT on each evening at Padua, in Jupiter-widths east (+) or west (−) of Jupiter, rounded. It is a modern reconstruction, labeled as such, and does not copy his drawings. A rough cross-check: the computed 7 January layout (two lights east, one west, with two moons merged) matches the published description of his first night (two east, one west). Galileo's dates are normally given in the Gregorian calendar, and this match supports that; a historian should confirm.

| Night (1610) | Io | Europa | Ganymede | Callisto |
| --- | --- | --- | --- | --- |
| 7 Jan | +3 | +3 (merged with Io) | −7 | +12 |
| 8 Jan | −2 | −4 | −6 | +13 |
| 10 Jan | hidden behind Jupiter | +5 | +5 (merged) | +10 |
| 11 Jan | −1 (lost in glare) | −1 (lost in glare) | +7 | +6 |
| 12 Jan | +2 | −4 | +4 | +2 |
| 13 Jan | −3 | +2 | −2 | −3 |

Callisto alone, 7 to 15 January: +12, +13, +12, +10, +6, +2, −3, −8, −11. Out, a pause, then steadily back across: what a circle looks like seen edge-on.

**Space exploration card.** Sputnik 1, the first artificial satellite, was launched by the Soviet Union on 4 October 1957. Yuri Gagarin was the first person in space on 12 April 1961. Apollo 11 landed Neil Armstrong and Buzz Aldrin on the Moon on 20 July 1969 while Michael Collins orbited. Astronauts have lived on the International Space Station without a break since November 2000. No person has been to Mars. NASA's Perseverance rover landed in Jezero Crater on Mars on 18 February 2021. Robots go where people cannot yet: too far, too cold, no air to breathe, years of travel. Because messages take minutes to reach Mars, a rover cannot be steered live like a toy car.

**Constellations.** A constellation is a pattern people see in stars that are really at very different distances. From the northern hemisphere: the Big Dipper (the Plough in Britain) is part of the larger constellation Ursa Major, the Great Bear; Cassiopeia is a W shape, on the other side of the Pole Star from the Big Dipper; Orion, with three stars in a row as a belt, is easy to see on winter evenings. Names differ by language: in French the Big Dipper is *la Grande Casserole* (the big saucepan) or *le Grand Chariot*, and in Spanish *el Carro* (the cart), also *el Cazo* in some places. Star stories (a bear, a hunter, a queen on a chair) are labeled as stories people told.

**Seeing stars.** Nearby light makes faint stars hard to see; eyes take about half an hour to adjust fully to the dark. This is Ember's problem.

**Safety.** Never look at the Sun, and never point binoculars or a telescope at it. Any real sky night is led by a grown-up, outdoors in a safe place on the ground (never a roof), dressed warmly.

## The lesson

Jane's **teach → guided → practice** order runs on every bench: one idea and a worked example revealed one step per tap, a first guided item with 1 to 4 visible steps, then practice.

| Bench | Teach (one idea) | Guided | Contrast |
| --- | --- | --- | --- |
| Spin and orbit | Willowbank turns into the light and out of it. | Turn the globe a quarter at a time and name morning, noon, evening, night. | The Sun-goes-round model, played side by side as a "what if" with the same ground view; and orbit without spin. |
| Seasons (part of spin and orbit) | The leaning half gets direct light and longer days. | Count squares lit by the same torch at a high and a low Sun. | The distance model, tested with the January fact and the two hemispheres. |
| Phase bench | The Moon is always half lit; we see part of the lit half. | Put the Moon at four places and match each to the sky view. | Earth's shadow on the Moon: a lunar eclipse, shown as the rare case. |
| Scale Walk | One ratio for everything. | Place Earth for a 20 cm Sun using Sun-widths. | The crowded textbook picture and evenly spaced planets. |
| Galileo's notebook | Night by night, the little lights change sides. | Follow one dot (Callisto) for nine nights. | "They are stars behind Jupiter": stars would not keep up with Jupiter. |

The Sprout layer is observational and does not explain causes (Marble's Sun, Moon and Stars record): sort Sun, Moon and stars by what you notice, find the daytime Moon in a picture, hear the Sun rule. Causes start at Seedling.

**I'm stuck ladder** (every item): hint → a worked example of an easier similar case plus how to start this one → skip for now, no penalty. Skipped items stay open.

**Top misconceptions designed against** (tags used in the companion): `sun-moves` (the Sun goes round Earth daily), `behind-hills` (night is the Sun hidden), `orbit-day` (one orbit makes a day), `spin-orbit` (mixing up spin and orbit), `distance-seasons`, `axis-swivels`, `whole-earth-summer`, `shadow-phases`, `eclipse-monthly`, `moon-night-only`, `crowded`, `even-spacing`, `planets-solid`, `pluto-mistake`, `sun-not-star`, `sun-biggest`, `planets-make-light`, `instant-light`, `ancients-foolish`, `galileo-invented`, `one-proof`, `people-on-mars`.

## The game or activity

**(a) Spin and orbit bench.** A fixed lamp at the left; a globe with a sticker for Willowbank; two panels side by side: **Space view** and **From Willowbank** (a ground view with the valley, hills and the Sun's position or stars). Controls: **Turn a quarter** (6 hours), **Turn back**, and **Play a day** (four quarter-turns). Then **Go around the Sun**: twelve steps around the lamp, one per month; the axis keeps pointing the same way, and the child can switch on **Show the lean**. The seasons panel puts a fixed torch over squared paper at two angles at the same distance: straight down (standing in for the high summer Sun) and low at 24° (the December noon Sun at 42.5°N). The straight beam lights 4 squares and the low beam about 10 (4 ÷ sin 24° = 9.8). At the real June height of 71° the beam would light about 4.2 squares, so the panel slightly exaggerates the contrast; the model line says it is simplified. A **What if the Sun went round?** toggle shows the alternative model with the same ground view, then asks what would tell them apart (the January distance fact; it is always day somewhere). Permanent model line: *A simplified picture: the lamp is much closer and smaller than the real Sun, and the globe is not to scale. It shows which side faces the light.*

**(b) Phase bench.** Top view: lamp at left, Earth in the middle with a small viewer, eight Moon positions on a ring, each Moon ball half lit toward the lamp. Tap a position: the right-hand **From Earth** panel shows that phase. Northern-hemisphere orientation by default; it follows spec 116's hemisphere setting when present. **Line them up** shows the lunar-eclipse case with Earth's shadow, labeled rare. Model line: *A simplified picture: real sizes and distances are far bigger, and the Moon's path is tilted a little, so most full moons miss Earth's shadow.*

**(c) Scale Walk.** Choose a Sun: **grapefruit (10 cm)**, **ball (20 cm)** or **beach ball (30 cm)**. A strip map of the river path runs from the bakery (Sun, 0 m) to the bridge (700 m in the story; fictional). The child computes Earth first (guided), then may compute others; the game fills the rest from the table and places markers. Each marker shows the bead size in mm and distance in m from the scale table in the companion. With 30 cm, Neptune lands past the bridge at about 973 m: *You need more path, or a smaller Sun.* A **Size and distance** toggle shows why planets are drawn bigger on most posters. Model line: *A scale model of sizes and distances only, with one ratio. Planets are not lined up like this in real life; they are spread around their orbits.*

**(d) Galileo's notebook.** A notebook page with six dated rows; each row shows Jupiter as a disc and small dots at the reconstructed positions. The child first follows one highlighted dot (Callisto) through nine nights by tapping **Next night**, then answers *What is the dot doing?* with three choices, then sees a coin turned edge-on for comparison. Label on every page: *Our reconstruction from a modern computer model, not Galileo's own drawings. Real nights were spread over a week; this page squeezes them together.*

**Sky cards** (a deck on the roof): the Sun is a star (near and far lamp), Which is a star?, the planets in order, constellations with names in three languages, Ember's glow, the exploration timeline, and the safety card.

## Problem sets

Full items in the companion: prompt, answer, misconceptions tested, hint and explanation.

| Set | Items | Depths | Formats |
| --- | --- | --- | --- |
| A. Day, night and seasons | 8 | Sprout 1, Seedling 3, Sapling 3, Keeper's Desk 1 | 3-choice, number with steps, say why |
| B. The Moon's faces | 4 | Seedling 2, Sapling 2 | order the cards, 3-choice |
| C. Planets and stars | 6 | Sprout 1, Seedling 3, Sapling 2 | order, match, 3-choice, which is a star |
| D. Scale and light | 7 | Seedling 2, Sapling 3, Keeper's Desk 2 | number with steps, 3-choice |
| E. How evidence changed ideas | 4 | Sapling 1, Keeper's Desk 3 | true/not-true from this source, say why |

29 items. Say-why prompts are read by a grown-up and never auto-graded.

## Saved work

Optional root `sky` per explorer, absent until a bench opens. Codes, not prose, except the project page's limit, which is the explorer's own text.

```
sky: {
  v: 1,
  benches: { [benchId: 'spin'|'phase'|'walk'|'notebook']: { seen: true, at } },
  items: { [itemId]: { source, answer, support: 'none'|'hint'|'example', skipped, at } },
  walk: { sunCm: 10|20|30, earthDistance: number|null, earthBead: number|null, at } | null,
  project: { source, plan: [stemId], limit: string /* ≤ 500 chars */, at } | null
}
```

- `source` freezes the item version and its displayed choices. Saved answers render from `source`, never re-marked against later content, and never rewritten on load.
- Support, familiarity and independent attempts stay separate fields; nothing becomes a score or a mastery label.
- One unreadable item keeps its raw data and shows as unavailable; the rest of the root and the game stay usable. Unknown fields survive export and import.
- Uses existing explorer storage, export/import, reset and size preflight; no new backend.

## Curriculum fit

**Strands:** **S8-I** sky observations (Sprout cards); **S8-II** spin, orbit, seasons and moon models; **S8-III** solar-system scales and telescope explanations; **S8-V** competing models (Keeper's Desk); **H1-II/III** a source's creator and date, evidence and interpretation (the reconstruction label, *Sidereus Nuncius* as the source); **M5** scale, ratio and proportional reasoning; **M** measurement and time conversion (seconds to minutes); **E4** a short claim with evidence. Act families: V (project), winter festival.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Explain day, night, the year and seasons from spin, orbit and tilt; explain phases with the half-lit Moon; order the planets; build and read a one-ratio scale model; compute light time; explain how telescope evidence changed a model. |
| Teaching encounter | The four benches, each with a worked example revealed step by step. |
| Contrast | Moving-Sun model; distance model of seasons; Earth's shadow and eclipses; crowded posters; Galileo's moons versus background stars. |
| Supported practice | Guided first items, the I'm stuck ladder, Sun-widths method. |
| New application | A 10 cm or 30 cm Sun; Mars at a new distance; a Keeper's Desk case on models and evidence. |
| Purposeful revisit | Spec 116's Sky page and moon table; Act V project page; winter Lantern Night each year; Shadow Theatre (`#loft/shadows`) for light and shadow. |
| Data boundary | Answers, support and a short limit text, all local. No location, no real sky data, no camera. |

## Upstream check

Jane refreshed at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` (2026-10-24); Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (2026-10-24). Research records are paraphrased; no Marble text is copied.

| Target topic | What the research asks, and how this spec does it |
| --- | --- |
| Sun, Moon & Stars (`mt_PiWZA8Z0ZJ`) | For young learners: name and notice, sort by visible differences, catch the Moon in the day sky, repeat the Sun rule, do not explain causes or say the Moon makes light. The Sprout cards sort and notice only; the safety card repeats; causes start at Seedling. |
| Earth's rotation and day/night (`mt_q15w--Fb5H`) | Ask for ideas first; the learner turns the globe; pair a space view with a ground view; name the hills and clouds explanations and the "sunrise" wording; a globe and lamp only show facing and turning away. The bench opens with *What makes night?*, the child turns the globe, two panels run together, and the model line states the limits. |
| Earth's Spin & Orbit (`mt_w2xiMNkyyX`) | Spin first, then orbit; one fixed light; numbers only after the motion is felt; always say which motion makes which effect. The bench locks nothing but presents spin before orbit; 24 hours and 365 days appear after the turns. |
| Why We Have Seasons (`mt_lFiDFPkVmH`) | Axis fixed in direction; actively refute distance with the January fact and opposite hemispheres; directness of light is the main cause, day length helps; constant torch distance; label the idealized model. Done in the seasons panel and set A. |
| Phases of the Moon (`mt_4V-vYhFUcm`) | Moon always half lit; two viewpoints together; phases before eclipses; use the crescent as the clean case against the shadow idea, since a full Moon sits near where Earth's shadow points; about 29.5 days; avoid "dark side". The bench and set B do this; spec 116 owns observation. Shared target with spec 116. |
| The Eight Planets (`mt_AVk2EmSULC`) | Order from the Sun, inner rocky and outer giants, a laid-out line, independent recall, Pluto as a change of definition. Set C includes unscaffolded ordering; the walk is the laid-out line. |
| Scale of the Solar System (`mt_TlGhXAqC4p`) | Choose a scale and use one ratio; feel the distances; size and distance can't share an easy scale; compute placements exactly. The Scale Walk, its scripted table and the off-screen walk. |
| The Sun is a star (`mt_u3Y3Tb-G_n`) | Nearest star only, never biggest or brightest; near and far lamp; a "why" response, not recognition alone. The lamp card and the say-why item in set C. |
| Changing Ideas About Space (`mt_KiRn5lnRgj`) | Start from why Earth-centered made sense; Jupiter's moons as the pivot; no single instant proof; Galileo improved, did not invent; say that real nights are spread out. Galileo's notebook and set E. |
| Space Exploration Milestones (`mt_H9RAGGiHBL`) | A few firm anchors with who, what, when; Soviet firsts correctly attributed; nobody on Mars; current programs change. The exploration card's five-point timeline. |

Candidate references with no claim: Spotting Constellations (`mt_BVpB5wyijZ`), How Telescopes Work (`mt_-SZU6cVB_-`), Space Robots & Rovers (`mt_7GwWplh-48`), Why seasons change (`mt_K0mZxY2AM8`, observational; its record forbids the tilt cause at its younger level, so the tilt work targets Why We Have Seasons instead). Galileo and the exploration timeline are history content inside science topics; for the history part (no research record exists) the spec uses H1 source habits: name the source, its date and its maker, and label reconstructions.

**Jane:** adopted the teach → guided → practice order, the I'm stuck ladder, misconception-tagged three-choice items, short second-person prompts and a key-terms glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Earth's rotation and day/night | The solar system (`mt_5l7iGkf1Tp`) | Supported: the planets card and walk run before or beside it; no separate topic claim. |
| | Why seasons change (`mt_K0mZxY2AM8`) | Supported: Sprout seasons card (more daylight in summer, relative only); spec 116's season prompts. |
| | Earth & Space Vocabulary (`mt_LQt4vnKeB4`) | Taught inline: the glossary (axis, orbit, spin, phase, planet, star). |
| Earth's Spin & Orbit | The Sun is a star (`mt_u3Y3Tb-G_n`) | Taught here (target). |
| Why We Have Seasons | Earth & Space Vocabulary (`mt_LQt4vnKeB4`) | Taught inline (glossary). |
| | Earth's rotation and day/night (`mt_q15w--Fb5H`) | Taught here (target), before the seasons panel. |
| Phases of the Moon | The solar system (`mt_5l7iGkf1Tp`) | Supported, as above. |
| | Earth & Space Vocabulary (`mt_LQt4vnKeB4`) | Taught inline. |
| The Eight Planets | The Sun is a star (`mt_u3Y3Tb-G_n`) | Taught here. |
| | Our Solar System (`mt_XlyF294bPR`) | Supported: the Sun-centered picture on the planets card. No separate claim. |
| Scale of the Solar System | The Eight Planets (`mt_AVk2EmSULC`) | Taught here. |
| The Sun is a star | Sun, Moon & Stars (`mt_PiWZA8Z0ZJ`) | Taught here (Sprout layer). |
| | Our Solar System (`mt_XlyF294bPR`) | Supported, as above. |
| Changing Ideas About Space | Earth's Spin & Orbit (`mt_w2xiMNkyyX`) | Taught here. |
| Space Exploration Milestones | What Astronauts Do (`mt_oiqsIP97V3`) | Documented gap, no claim. The card names astronauts' roles in one line only. |
| Sun, Moon & Stars | none | |

## Checks for implementation

- **Number script, run 2026-10-25** (`python3 -I check141.py`, scratch only): recomputed the scale table for 10, 20 and 30 cm Suns from the NSSDC diameters and distances, every problem-set number, the light times and the seasons angles; 36 of 36 checks passed (re-run after the fact-check pass, adding the Proxima Centauri scale distance, about 5,770 km). It confirmed the brief's anchor: a 20 cm Sun gives an Earth 1.83 mm wide at 21.5 m; Neptune at 649 m; a 30 cm Sun puts Neptune at 973 m, past the 700 m bridge; sunlight takes 499.0 s (8 min 19 s), rounded to about 8 min 20 s; 4 squares of light spread to about 9.8 at a 24° Sun (re-checked in review: true for a straight-down high beam, which is what the panel shows).
- **Ephemeris checks, run 2026-10-25** (PyEphem 4.2.1): perihelion 3 January 2026 and 2027 at 147.1 million km, aphelion 5-6 July at 152.1; obliquity 23.44°; mean synodic month 29.53 days; Mars 57 to 400 million km from Earth in 2020-2039; day length and noon Sun height at 42.5°N; Jupiter's moons for 7-15 January 1610 at Padua.
- A build test recomputes the companion's scale table from the same constants and fails on any difference beyond rounding.
- The axis never swivels in the orbit view; the torch stays the same distance at both angles.
- Every bench shows its model line; every Galileo page shows the reconstruction label.
- The safety card shows on the roof's first visit and on the off-screen sky-night card.
- 320 px and 820 px: the two bench panels stack vertically; the walk strip scrolls along one axis with markers readable as a list.

## Review asks

- **Subject check (astronomy):** the phase bench's eclipse wording; the seasons panel's square counts; the Callisto edge-on framing; whether PyEphem's moon model is good enough for 1610 positions at this rounding.
- **History check:** the calendar behind Galileo's dates (Venice kept its own year-start, *more veneto*), and the *Sidereus Nuncius* description.
- **Owner:** route `#library/roof` as a new standalone route. Default: yes, with spec 116's Sky page linking in when built.
- **Owner:** Phases of the Moon is claimed by both 116 and 141. Default: 141 claims it for the bench model; 116 keeps Moon Phases (`mt_ByXgbTld6R`) for observation and keeps its Sapling panel as a short reference that links here.
- **Owner:** fictional bakery-to-bridge path of 700 m. Default: keep, since it makes the 30 cm Sun overflow on purpose.
