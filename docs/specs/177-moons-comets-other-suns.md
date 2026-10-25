# 177. Moons, Comets and Other Suns' Planets: the Orrery Room

Status: **proposed, 2026-10-25; reviewed and fact-checked; awaiting owner decisions.** Part of the [history and science build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/137). Every child-facing line is in [the companion text](../content/177-moons-comets-other-suns-text.md); sources are in [the source audit](../source-audits/177-moons-comets-other-suns.md).

**Commissioning boundary:** a proposal only. It commissions nothing until independent content, model and save review choose a first slice. Story links are future adapters to draft [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127). The host is a door off the Library Roof of draft [spec 141](https://github.com/anotherpanacea-eng/learning-garden/pull/138), beside the Rocket Shelf of draft [spec 164](https://github.com/anotherpanacea-eng/learning-garden/pull/144) and the Far Window of draft [spec 172](https://github.com/anotherpanacea-eng/learning-garden/pull/148). Standalone play at `#library/orrery` stays open without any of them, and no story progress is inferred from an adapter that does not exist.

## Purpose

Space Exploration has 26 pinned topics, none with a declared reference in `curriculum/topic-coverage.csv`. After specs 141, 164 and 172, nine remained unclaimed on main and every `pj161v` branch (each id grepped, 2026-10-25). This pack takes five that fit one room.

Revisited, never re-taught: phases (141's phase bench), the eight planets with one feature each (141), the dwarf-planet tests and comet tails (172's Planet Table), Newton's cannonball (172's Newton's Hill), floating as falling and telescopes (164).

A child comes to understand that:

- the Moon goes around Earth about once a month and spins once each trip, so one face points at us;
- planet features have reasons: Venus's thick air makes it hotter than Mercury; Mars's dust is rusty; all four giants have rings; some moons are worlds of their own;
- asteroids are rocky, comets are icy, and one space rock takes three names on its way down (meteoroid, meteor, meteorite);
- comets follow oval orbits that can be predicted, which Edmond Halley showed from old records;
- an orbit is falling sideways fast enough to keep missing, engines off;
- planets around other stars are found by watching the star for a tiny repeating dip or wobble; the habitable zone means liquid water could be possible, never that life is there.

## Place and story

**Host:** **The Orrery Room**, `#library/orrery`: a fictional room off the Library Roof with a brass orrery (a clockwork model of the planets), a comet cord, a gallery wall and a lamp with a brightness meter. If 141 is not built it is its own route from Explore.

**Story feeds** (future adapters to spec 120):

- **Autumn, Harvest Supper** (Scene 1): the town waits for moonrise and Pip learns it comes later each night.
- **Act V**, the sky-watching night path and the *Gazette* (Scene 2): the librarian's Travelers' Archive card on Halley; the Keeper role, keeping records others can use later.
- **Act III**, letters (Scene 3): Léon writes that an observatory in the south of France found the first planet around a Sun-like star; Ember shows how a dip works on Lantern Night.

**Story beat:** Bramble says comets come at random as signs; the librarian shows that old records, kept carefully, let Halley predict one. The old Keeper stays unnamed (Hollis rule).

## The knowledge

Sources in the audit. Computed numbers say so (`check177.py`, scratch only).

**The Moon's path.** The Moon goes around Earth in about 27.3 days measured against the stars, and from full moon to full moon in about 29.5 days. The second is longer because Earth has moved along its own orbit, so the Moon must go a little farther to line up with the Sun again (computed: 1 ÷ (1/27.32 − 1/365.26) = 29.53 days). The Moon shines by reflected sunlight. It spins once on its axis for each trip around Earth (synchronous rotation, also called tidal locking), so the same face points at us; the far side gets as much sunlight as the near side, so "dark side" is a misnomer. Moving east along its orbit while Earth spins, it rises about 50 minutes later each day on average (computed: 24 h × 29.53 ÷ 28.53 = 24.84 h); the real delay varies, and for a few nights near the autumn (harvest) full moon at northern mid-latitudes it drops to about 10 to 30 minutes (NASA). 141's phase bench owns why phases happen.

**Planet features** (the "why" layer on top of 141's one feature each). Venus is hotter than Mercury though farther from the Sun: its thick carbon dioxide air traps heat, keeping the surface about 465 °C day and night (sources: 462 to 467), while Mercury, with almost no air, reaches about 430 °C by day and falls to about −180 °C at night. Mars is red because its dust and rocks hold iron oxide, rust, and it is cold. Jupiter's Great Red Spot is a giant long-lived storm in a planet with no solid surface; it has shrunk since the 1800s and is now about Earth's width (NASA; measures vary). All four giant planets have rings; Saturn's are bright; the others are faint or dark. Uranus spins tipped on its side. Mercury and Venus have no moons; Mars has two small ones, Phobos and Deimos (found 1877). Giant planets' moon counts keep changing, so none are given. Some moons are worlds: Io has hundreds of active volcanoes (NASA: more than 400), heated by Jupiter's squeezing pull; Europa has a global ocean under its ice shell; Titan has thick hazy air and lakes and seas of liquid methane and ethane, with methane rain.

**Small bodies** (172 teaches the planet tests and the tail; revisited, not re-taught). Asteroids are rocky, most of them in the belt between Mars and Jupiter; comets are mostly ice and dust that grow a glowing head and tails when near the Sun, as ice turns to gas. Not burning. A meteoroid is a small piece of rock in space; as a meteor it glows streaking through the air (a "shooting star"); if a piece lands, it is a meteorite. One object, three names by where it is.

**History cards.**
- *Ceres:* found by Giuseppe Piazzi at Palermo, Sicily, on 1 January 1801; he first took it for a comet. A dwarf planet since 2006.
- *Halley:* in 1705 Edmond Halley used Newton's ideas on old records and argued that the comets seen in 1531, 1607 and 1682 were one comet on a long oval orbit, returning about every 76 years (gaps 76 and 75, computed). He predicted a return around 1758. He died in 1742, before it came back. On Christmas night (25 December) 1758 Johann Georg Palitzsch, a farmer and amateur astronomer in Saxony, saw it. Jupiter's and Saturn's pulls delayed it, as Clairaut, Lalande and Lepaute had calculated. It was the first non-planet shown to orbit the Sun predictably. Halley's comet last came closest to the Sun on 9 February 1986 and returns in 2061. Earth crosses its dust each May and October: the Eta Aquariid and Orionid meteor showers.
- *Pluto:* Clyde Tombaugh at Lowell Observatory, Flagstaff, Arizona, spotted it on 18 February 1930 by comparing photographic plates taken nights apart for one moving dot. It was announced on 13 March 1930. Venetia Burney, a schoolgirl in Oxford, England, suggested the name. In 2006 the IAU's new definition made it a dwarf planet (141 and 172 own the definition). NASA's New Horizons flew past it on 14 July 2015.

**Orbits as falling** (172's cannonball and 164's floating, revisited). An orbit is falling while moving sideways so fast that the ground curves away as fast as you fall. At that speed a craft coasts, engines off; engines change an orbit, gravity shapes it. Going up is easy: the station is only about 400 km up but must move about 7.7 km/s sideways (about 27,600 km/h), going around in about 90 minutes (computed: 42,544 km at 7.67 km/s, 92.4 minutes). Most orbits are ovals (ellipses); a circle is the special case. On an oval orbit a body moves fastest when closest to the Sun, so Halley's comet rushes past the Sun and crawls far out. Keeper's Desk only: a **gravity assist**, where a craft swinging close behind a moving planet gains speed borrowed from the planet's motion; the planet loses an amount far too small to measure. Voyager 2 (launched 20 August 1977) used assists at Jupiter, Saturn and Uranus to reach Neptune (flybys 1979, 1981, 1986, 1989) and is the only craft to have visited Uranus and Neptune. A rocket must carry fuel it has not burned yet, so each extra bit of speed costs more (named only).

**Finding planets around other stars.** Astronomers mostly watch the star, not the planet; fewer than 100 exoplanets have been directly imaged. *Transit:* if a planet crosses in front of its star as seen from Earth, the star's light dips a tiny amount, again every orbit. Depth tells size against the star (about (planet width ÷ star width)²); spacing tells its year. A Jupiter crossing the Sun would dim it about 1% (1 part in 99, computed); an Earth about 0.0084% (about 1 part in 12,000, computed), which is why small planets are hard and space telescopes help. The first transit was seen in September 1999 (HD 209458 b, a dip of about 1.7%); NASA's Kepler telescope (launched 2009) found thousands. *Wobble* (radial velocity): a planet's pull swings its star in a tiny circle, which shifts the star's light slightly bluer then redder. On 6 October 1995 Michel Mayor and Didier Queloz of Geneva announced 51 Pegasi b, the first planet found around a Sun-like star, using the ELODIE spectrograph at the Observatoire de Haute-Provence in southern France: a giant planet going around its star in about 4.2 days. They shared the 2019 Nobel Prize in Physics. (Planets around a pulsar came earlier, in 1992, so "first" is qualified.) NASA's count passed 6,000 confirmed in September 2025; child text says "thousands". *Habitable zone:* the band of distances from a star where liquid water could exist on a surface, given the right air; it is a reason to look, never proof of water or life. Keeper's Desk only: gases in a planet's air, read from starlight passing through it, might hint at life only in some combinations (oxygen and methane together is the usual example), and even then non-living causes can mimic them, so any claim is argued over.

**The Sun rule** (fixed, from spec 162; never a model result): never look at the Sun, with sunglasses, through cloud, or through binoculars, a telescope, a camera or any lens. Real transits across the Sun are never offered.

**Fiction boundary.** Willowbank, its moon nights, Ember's lantern trick and the letters are fiction. Real people get no invented words.

## The lesson

Jane's **teach → guided → practice** on every bench: one idea and a worked example revealed one step per tap, one guided item with 1 to 4 visible steps, then practice.

| Bench | Teach (one idea) | Guided | Contrast |
| --- | --- | --- | --- |
| Moon Path | One trip around Earth is about one month of phases. | Move the Moon a week at a time; name the phase (revisits 141). | Turn the Moon *without* spinning it: now we see all sides. |
| Planet Gallery | Each planet has a signature, and some have a reason. | Match four features; open the Venus "why" flap. | Mercury closest, Venus hottest. |
| Comet Road | Rock or ice; one space rock, three names. | Walk a meteoroid down to Hob's field. | A shooting star versus a real star (172), revisited. |
| Falling Around | Sideways fast enough, you keep missing; engines off. | Slow, just right, oval, too fast (revisits 172's hill). | "No gravity up there." |
| Starlight Dip | Watch the star: a planet makes a tiny repeating dip. | Read a light strip; find the dips. | Star dimming for good versus a dip that repeats. |

**I'm stuck ladder** (every item): hint → a worked example of an easier similar case plus how to start this one → skip for now, no penalty. Skipped items stay open.

**Top misconceptions** (tagged in the companion): `moon-makes-light`, `moon-no-spin`, `dark-side`, `moon-day`, `mars-hot`, `closest-hottest`, `size-heat`, `only-saturn-rings`, `comet-rock`, `comet-burning`, `trio-same`, `comets-random`, `comets-new`, `no-gravity-space`, `engines-on`, `photo-planet`, `star-dying`, `dip-distance`, `width-not-area`, `hz-life`, `hz-water`.

## The game or activity

**(a) Moon Path.** Top view: lamp at left, Earth in the middle, the Moon on a ring of 28 dots (labeled "about a month; the real cycle is 29 and a half days"). **Step a day** and **Step a week** move it; the From Earth panel shows the phase using 141's art. A flag on the Moon always points at Earth; **What if it didn't spin?** keeps it pointing one way, and it swings out of sight. A moonrise strip shows the same hill for four nights with the Moon about 50 minutes later each. Model line: *A simplified picture: not to scale, a round path, and an average delay; real moonrise times vary.*

**(b) Planet Gallery.** Eight framed planet pictures (public-domain NASA images; see the audit) with lift flaps: **Feature** and **Why?** Venus's flap shows Mercury's day and night thermometers beside Venus's steady one. A **Rings** filter lights up all four giants. A **Moons** drawer holds Phobos and Deimos, Io, Europa and Titan, one card each.

**(c) Comet Road.** A long cord around a lamp-Sun with a comet bead on an oval loop: drag the bead; near the lamp it grows a tail pointing away and its tick marks spread (faster). Two trays: **Rocky** and **Icy**. A journey arc from space to Hob's field takes three name cards. Archive cards: Ceres, Halley (with the three dates on a mini Long Line), Pluto. Model line: *A made-up model: the oval is squashed to fit, and the tail is drawn.*

**(d) Falling Around.** Revisits 172's hill art with a small planet and a station. Speeds: **slow** (lands), **just right** (circle), **a bit faster** (oval), **too fast** (leaves). An **Engines** switch is off on every orbit and the path does not change. Keeper's Desk: **Swing past Jupiter** plays an authored gravity-assist path with a speed bar. Model line: *A made-up model: tiny world, no air, drawn paths and speeds.*

**(e) Starlight Dip.** A star drawn as a 10 × 10 grid of squares, a planet dot crossing it, and a brightness strip scrolling beneath. Controls: **Planet size** (1 square or 2 squares wide) and **Path size** (near or far). Size changes the depth; path changes the spacing. A **Wobble** tab shows a star circling slightly, its tint shifting. Model line: *A simplified picture: real dips are far smaller than drawn, and real stars are not squares.*

## Problem sets

Full items in the companion.

| Set | Items | Depths | Formats |
| --- | --- | --- | --- |
| A. The Moon and the planets | 8 | Sprout 2, Seedling 3, Sapling 2, Keeper's Desk 1 | 3-choice, match, number with steps |
| B. Comets, space rocks and falling around | 8 | Sprout 1, Seedling 2, Sapling 3, Keeper's Desk 2 | 3-choice, order, number with steps |
| C. Other suns' planets | 8 | Seedling 2, Sapling 4, Keeper's Desk 2 | 3-choice, number with steps, true/not-true/doesn't say from this source, say why |

24 items. Across the 14 three-choice items the right answer is in position A four times, B five times and C five times, and is never the longest choice. Say-why answers are spoken to a grown-up; nothing free-text is stored.

## Saved work

Optional root `orrery` per explorer, absent until a bench opens. Codes only.

```
orrery: {
  v: 1,
  benches: { [benchId: 'moon'|'gallery'|'comet'|'falling'|'dip']: { seen: true, at } },
  items:   { [itemId]: { source, answer, support: 'none'|'hint'|'example', skipped, at } }
}
```

- `source` freezes the item and choices; answers are never re-marked or rewritten on load. Support, familiarity and independent attempts stay separate; no score or mastery label.
- One unreadable item keeps its raw data and shows as unavailable; the rest stays usable. Existing storage, export/import, reset and preflight; no backend.

## Curriculum fit

**Strands:** **S8-II/III** Moon motion, planets, small bodies and orbits; **S8-V** evidence by inference (the dip and wobble) and honest limits (habitable is not inhabited); **S6** gravity and motion, after spec 154 and 172; **H1-II/III** dates, makers, records and prediction (Halley, Piazzi, Tombaugh, Mayor and Queloz); **M** subtraction across years, division with units, area scaling; **E4** a claim with a reason. Act families: autumn festival, III, V.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Tie one orbit to a month and explain the one face; give planet features with reasons; sort rocky and icy bodies; name the meteor trio; explain orbit as falling; read a transit strip; say what the habitable zone does not mean. |
| Teaching encounter | Five benches, each with a step-revealed worked example. |
| Contrast | A non-spinning Moon; Mercury and Venus; meteor and star; "no gravity up there"; a dying star versus a repeating dip. |
| Supported practice | Guided items, the I'm stuck ladder, the grid star, the journey arc. |
| New application | Next moonrise; Halley's next date from old gaps; the station's loop time; a planet twice as wide. |
| Purposeful revisit | 141's phase bench and planets card; 172's Planet Table and Newton's Hill; 164's Station Day and Light Bucket; spec 133's Long Line could add 1705, 1758, 1801, 1930, 1995 (not in its set yet); each autumn's Harvest Supper moon. |
| Data boundary | Answers and support codes, local only. No location, camera, real sky data or free text. |

## Upstream check

Jane refreshed at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` (2026-10-24); Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (2026-10-24). Paraphrased.

| Target topic | What the research asks, and how this spec does it |
| --- | --- |
| The Moon's Orbit (`mt_15FduGRf5c`) | About a month per orbit, reflected light, half always lit, phases as viewpoint and never Earth's shadow; space and sky views paired. 141's bench owns lamp-and-ball; Moon Path pairs the views, ties orbit to cycle, adds the one face. A1, A3, A4, A7, A8. |
| Planet Features (`mt_W8Eq3CqWJf`) | One feature per planet on a real image; matching; Venus versus Mercury; Mars's rust as the one cause; the Spot as a storm; rings on all giants; comparative numbers. Planet Gallery; A2, A5, A6; temperatures only in a Keeper's note. |
| Asteroids, Comets & Dwarf Planets (`mt_uoTBeyMhGm`) | Rock versus ice; the meteor trio as one journey named by place; tail away from the Sun; a meteor is not a star. Comet Road trays and arc; 172's tests revisited. B1-B3. |
| Orbital Mechanics (`mt_1nl396BaVa`) | No algebra: continuous falling; the cannonball's paths including the oval; engines off; sideways speed is the hard part; gravity assist as borrowed motion; fuel-to-carry-fuel named. Falling Around; B5, B7, B8. |
| Finding Exoplanets (`mt_UjuriPLVgT`) | Read the star; a light strip with size and orbit varied; transit and wobble as partners; 51 Pegasi b; dips are tiny; habitable zone necessary, not sufficient; one gas is no proof. Starlight Dip; C1-C8. |

Related, no claim: *Observing with Light Waves* (`mt_rbY77m8_s1`; the wobble's color shift touches it), *Why the Sun Looks Brightest* (`mt_ae-cHHFR76`; 172's Lantern Lane teaches it). History cards have no research record; they use spec 133's H1 habits (date, maker, place, "about", credit) with NASA, observatory and encyclopedia sources.

**Jane:** adopted teach → guided → practice, the I'm stuck ladder, misconception-tagged three-choice items, short second-person prompts and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

Hard edges in the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| The Moon's Orbit | Moon Phases (`mt_ByXgbTld6R`) | Met elsewhere: draft spec 116 keeps it for observation (141's owner default); 141's phase bench is revisited here. |
| Planet Features | The Eight Planets (`mt_AVk2EmSULC`) | Met elsewhere: spec 141 target; the gallery keeps 141's order. |
| Asteroids, Comets & Dwarf Planets | none (The Eight Planets is soft) | |
| Orbital Mechanics | Gravity Pulls Things Down (`mt_Y2WcY2lOTK`) | Supported by spec 154 (Gravity & Falling Objects) and 172 (Universal Gravitation). Documented gap: that topic is unclaimed. |
| Finding Exoplanets | The Vast Scale of Space (`mt_aulwq39aj8`) | Supported by 172's Long Zoom (revisited there, no claim). Documented gap: unclaimed. |

## Checks for implementation

- **Number script, run 2026-10-25** (`python3 -I check177.py`, scratch only): 31 of 31 checks passed: synodic 29.53 days (A8, difference 2.2); moonrise delay 50.5 minutes (A7); Halley gaps 76 and 75, 1682 + 76 = 1758 (B4), 2061 − 1986 = 75; 2006 − 1930 = 76 (B6); station loop 42,544 km, 92.4 minutes, 7.67 km/s; B8's rounded 42,500 ÷ 7.7 = 5,519 s, about 92 minutes; Jupiter dip 1.01% (1 in 99), Earth 0.0084% (1 in 11,920), ratio about 120 (C8); C3 period 4 and next dip day 15; C4 1 of 100 squares, twice as wide covers 4.
- The Moon's flag faces Earth unless **What if it didn't spin?** is on; Engines never changes an orbit; planet size never changes dip spacing.
- The Sun rule shows on first visit, wherever the Sun is drawn, and on the grown-up card. No activity asks for real Sun observation.
- History cards show date, place and source; omens show *A story people told*.
- 320 px and 820 px: the light strip becomes a list of values; trays and the arc accept tap-to-place.

## Review asks

- **Subject check:** settled in the review pass (audit); the biosignature note stays hedged.
- **Owner:** new route `#library/orrery` beside 141's roof, 164's shelf and 172's window. Default: yes.
- **Owner:** Venetia Burney is named as "a schoolgirl in Oxford" with no age. Default: yes.
- **Owner:** biosignatures stay a Keeper's note. Default: yes.
