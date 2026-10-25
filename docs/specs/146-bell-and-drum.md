# 146. The Bell and the Drum: how sound travels

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a subject check.** Part of the [history and science build-out](../history-and-science-buildout.md). Every child-facing line is in [the companion text](../content/146-bell-and-drum-text.md); sources and open checks are in [the source audit](../source-audits/146-bell-and-drum.md).

**Commissioning boundary:** this is a proposal only. Pick a bounded first slice after independent content, model, audio and save review; listing four activities and three problem sets does not commission them all. All Act and chapter links below are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. Nothing here changes Bell Studio (spec 48) or Rhythm Studio (proposed spec 115).

## Purpose

The atlas counts 25 Marble topics in **Waves, Light & Sound** and none of them covered ([six-act strands](../six-act-strands.md), S6 row). Bell Studio is a composing room: it orders three computer tones and deliberately makes no claim about loudness, real bells, distance or vibration evidence (spec 48, "Candidate scoped map"). Rhythm Studio adds duration. Nothing yet teaches the physics of sound.

The Sound Bench fills that gap. A child comes to understand that:

1. Every sound comes from something vibrating, even when the vibration is hard to see, and sound can make other things vibrate.
2. A bigger vibration makes a louder sound; a faster vibration makes a higher sound; **these are two separate things**. This is the discrimination Marble's research records for volume and for pitch call the most important at this stage.
3. Sound has to be passed on through a material: solid, liquid or gas. It cannot cross empty space.
4. Sound takes time to travel, and how fast depends on the material, never on how loud or how far.
5. Sound gets quieter with distance because it spreads out. An echo is sound that bounced back.
6. Light arrives almost at once; sound takes time. That gap lets you estimate how far away lightning is.

## Place and story

**Host:** `#studio/sound`, the **Sound Bench**, a third room in the studio beside Bell Studio (`#studio/bells`) and Rhythm Studio (`#studio/rhythm`), with an ordinary link each way. No shared state with either room. Further entry links: Willow Post Office (Dot's bell) and the mill. Open from the start; nothing is locked by act.

The bench owns the physics of sound. Bell Studio keeps pitch-order composition; Rhythm Studio keeps duration. The Sound Bench never grades a composition and the studios never read the bench.

**Story beats** (full text in the companion):

- **Act II, a town of our own.** Dot's post office bell is too quiet for the far end of the lane. Dot wants to know whether ringing harder makes it louder, higher, or both. Opens the bench and activity (a).
- **Act III, beyond Willow Bridge.** Bramble claims her magpie can hear the mill bell from Vadoalto. Opens activity (c), *Bell down the valley*, and the Sapling job "check Bramble's claim".
- **Act V or Act VI.** The librarian counts the seconds between flash and thunder during a storm and writes the count in the *Willowbank Gazette*. Opens activity (d), the *Thunder counter*.
- **Act VI, chapter 3, the long rain.** A preparation job at the Keeper's Desk: why the mill bell can warn Willowbank but cannot warn Les Saules, and why it carries less far in a storm. This explains, without changing, spec 120's sequence in which {courier} carries the warning on to Les Saules.

**Consistency with spec 118's flood-bell case** (`flood-bell`, branch `claude/project-thread-ipqrox`): the bell rings when Vadoalto's message arrives; Vadoalto is 18 km from Willowbank's flood post by the brook's bends; Les Saules is another 12 km downstream. This spec adds only what sound does after the bell is rung. It never says the bell replaces the runner or the courier, and it carries the same safety label: **Story model: Willow Brook is made up.**

## The knowledge

Plain adult prose; every number is in the source audit with its conditions. A fact-check pass on 2026-10-25 cleared every earlier `[check]`; the audit lists the source for each.

**Vibrations make sound.** A sound starts when something moves back and forth quickly: a drum skin, a string, a twanged ruler, the air inside a whistle, a struck block of wood. Some vibrations are easy to see (rice bouncing on a drum skin); others are too small or fast to see. Sound also makes separate things vibrate: a loud sound close by (a banged metal tray, say) can make rice on a drum skin jump without anything touching the drum.

**Volume and pitch.** For the same sound-maker heard from the same place, a bigger vibration (a larger swing) makes a louder sound. Scientists call the size of the swing the *amplitude*. How fast the object vibrates sets the pitch: faster is higher. Hitting harder mostly changes loudness and leaves the note about the same. Pitch depends on features of the object: for the same material and shape, shorter, smaller or tighter usually means higher (a short ruler overhang, a tight string, a small bell). These two qualities are independent: a sound can be loud and low, or quiet and high.

**Sound needs a material.** The vibration is handed on through whatever is between the source and the ear. Sound travels through gases (air), liquids (water) and solids (a wall, a table, a taut string). A string telephone works because the taut string itself vibrates; a slack string carries the vibration poorly. In empty space there is nothing to pass the vibration on, so there is no sound. Light needs no material and crosses space.

**Speed.** In dry air at 20 °C sound travels about **343 m/s** (faster in warmer air, slower in colder). In fresh water near room temperature it is about **1,480 m/s** (1,481 at 20 °C), roughly four times faster. In steel, longitudinal sound is about **5,900 m/s** (a simple thin-rod estimate gives a lower figure, about 5,060 m/s, because the wave is different; values vary with the steel). The order to teach is solids fastest, then liquids, then gases, with the reminder that it varies by material. Speed does not depend on loudness, pitch or distance traveled. Light is about 300,000 km per second: it crosses a kilometer in about three millionths of a second.

**Fading with distance.** Sound spreads out in all directions from its source. Farther away, the same vibration is spread over a bigger area, so less of it reaches an ear. In open air with nothing in the way, each doubling of distance spreads the sound over four times the area, so it drops by about the same amount each time the distance doubles. Real fading is messier: wind, hills, trees, buildings, the ground and the air itself all take some, and wind can carry sound farther in one direction. Whether you can hear something also depends on other noise: rain and wind can drown out a faint bell.

**Echoes.** An echo is reflected sound. The sound goes to the reflecting surface and back, so its time covers twice the distance. Hard surfaces reflect well; soft surfaces absorb more. A shout returns as a separate echo only if the surface is far enough away (roughly 17 m or more, from the textbook rule that an echo needs about 0.1 s to sound separate; it shifts with air temperature).

**Thunder and lightning.** Lightning and thunder happen together; the light reaches you almost at once and the thunder follows at the speed of sound. Count the seconds from flash to bang. Sound covers about 1 km in 3 seconds (more exactly 2.9 s), or about 1 mile in 5 seconds. Divide by 3 for kilometers, by 5 for miles. Both rules slightly underestimate the distance (by about 3% and 6%). The count gives an estimate, never a safety decision; storm safety comes from official weather services.

**How the ear works (looking only, not assessed).** The outer ear gathers sound into a tube to the eardrum, which vibrates. Three tiny bones pass the vibration to the cochlea, a fluid-filled, snail-shaped part of the inner ear, where hair cells turn it into signals that travel along a nerve to the brain. No hearing questions, no personal health content.

**Fiction, labeled:** Willowbank's bells, the valley map, the distances to places, the bell's "loudness steps" and the magpie are story and model. Real science appears under "A true thing about sound".

## The lesson

Jane's **teach -> guided -> practice** order, applied to each of the four activities:

1. **Teach card** (30 words max) with one worked example revealed one step per tap.
2. **Guided first item** with 1-4 visible steps before answering.
3. **Practice** items, then the problem sets.

**"I'm stuck" ladder** on every practice and problem item: (1) a hint; (2) a worked example of an easier similar case plus how to start this one; (3) **Skip for now**, with no penalty, nothing lost, and no change to anything else.

**Contrasts** (each has its own teach card and items):

| Contrast | Shown by |
| --- | --- |
| Louder vs higher | The bench changes one dial at a time: "how hard" moves only the swing size; "how long / how tight" moves only the swing speed. |
| Quieter because farther vs quieter because struck softly | Bell down the valley: a gentle ring heard at the bakery and a hard ring heard at Hob's farm give the same loudness step for different reasons. |
| Light arrives almost at once vs sound takes time | Seeing the ringer swing the hammer before you hear the bell; thunder after lightning. |
| Muffled by a wall vs no sound in space | Through what? cards: a wall passes sound (quieter); empty space passes none. |
| Fading vs slowing | A faint bell far away traveled at the same speed as a loud bell nearby. |

**Top misconceptions designed against** (tags used in the companion):

- `M-loud-high`: louder means higher; low means quiet.
- `M-harder-higher`: hitting harder raises the pitch.
- `M-visible-only`: only things you can see moving make sound.
- `M-reverse-missing`: vibrations make sound, but sound cannot make things vibrate.
- `M-air-only`: sound only travels through air.
- `M-wall-blocks`: a solid wall blocks sound completely.
- `M-space-sound`: sound can travel through space.
- `M-gases-fastest`: more empty space between particles lets sound go faster.
- `M-fade-slows`: sound fades because it slows down with distance.
- `M-loud-faster`: louder sounds travel faster.
- `M-one-way`: sound travels only toward the listener, like a torch beam.
- `M-echo-one-way`: an echo's time is for one trip, not there and back.
- `M-light-instant-sound-instant`: we hear thunder when it happens.
- `M-big-higher`: bigger or longer objects make higher sounds.
- `M-rule-exact`: a rule of thumb (divide by 3) gives the exact distance.
- `M-object-volume`: volume belongs to the object, not how hard it vibrates.

## The game and activities

### (a) Make it louder, make it higher

A bench with three sound-makers, chosen by tab: **drum** (with rice on the skin), **ruler** (held over a table edge), **string** (stretched over a box).

- Each maker has two dials of three steps each. **How hard:** gentle, medium, hard (all three makers). **The pitch dial:** drum skin *loose / medium / tight*; ruler overhang *long / medium / short*; string *loose / medium / tight*.
- **Strike** (or Twang / Pluck) animates the maker and fills a **vibration picture** beside it: a schematic trace in a fixed time window with **swing size** 1, 2 or 3 units (from How hard) and **swings in the window** 2, 3 or 4 (from the pitch dial). The two never interact. Drum rice jumps to one of three heights; the ruler and string blur over one of three widths.
- **Compare** keeps the last two strikes side by side with their dial settings. If two settings changed between them, the bench says so and offers **Change one back**; it never blocks the comparison.
- **Sound is optional and stylized.** Play uses Bell Studio's sine tones (220, 330, 440 Hz for the three pitch steps) and its safety pattern: explicit Play only, Stop always visible, no autoplay, stop on route/visibility change, "Start with your device volume low." The three How hard steps use three fixed digital gains with the loudest at Bell Studio's peak `G = 0.025` and the others at `G/2` and `G/4`. These are controlled computer settings, not decibels, and not loudness-matched across pitches. The visual route is complete without sound.
- **Labels on every screen:** *Simplified picture: the trace shows swing size and swing speed. It is not a measurement. Any sound you play is a simple computer tone, not a recording of a drum, ruler or string.*
- **Reverse direction card:** *Shout near the drum* shows Pip shouting beside (not touching) the drum and the rice jumping.
- **Spot the vibration:** six tap-to-reveal cards (drum, plucked string, wooden block, two stones, a whistle, a bell). Each reveals what is vibrating; three are hidden vibrations.

### (b) Through what?

Eight cards, one at a time, each a short scene with a 3-choice question and feedback: a voice through a wall; spoons clicked under water; a string telephone, taut; the same, slack; ear to a table while someone taps it; a bell in a jar as the air is pumped out (described as a classroom demonstration; it fades because less air is left, and real pumps never empty the jar completely); astronauts outside a spacecraft; light from the Sun crossing space. A final **source, material, ear** strip lets the child drag (or tap to place) a material card into the middle of a chain and see *passes sound / passes it poorly / passes no sound*.

### (c) Bell down the valley

A **made-up map** of the valley with the mill bell at the center and seven places. Distances are story distances.

| Place | Distance from the mill bell |
| --- | --- |
| The bakery | 200 m |
| The library | 400 m |
| Hob Pennick's farm by the ford | 800 m |
| The orchard keeper's top field | 1,600 m |
| Bramble's ribbon gate | 3,200 m |
| Les Saules | about 12 km (spec 118's brook distance, used as a stand-in) |
| Vadoalto | about 18 km (spec 118) |

**Model `valley-bell-v1`:**

- Sound speed: 343 m/s (air at 20 °C). Time = distance / 343, shown to one decimal place.
- Loudness steps (fictional, unitless): `steps = S - log2(distance / 100 m)`, where `S` is the bell's strength at 100 m. Mill bell rung hard: `S = 6`. Rung gently: `S = 4`. Dot's hand bell rung hard: `S = 2`. Each doubling of distance takes one step away.
- Heard if steps are 1 or more on a still day; 3 or more in a storm, because rain and wind cover faint sounds.
- Results (script-checked): mill bell rung hard is heard on a still day at every place out to the ribbon gate (1 step there) and silent beyond 6,400 m; in a storm only out to Hob's farm (3 steps). It is never heard at Les Saules or Vadoalto. Times: 0.6, 1.2, 2.3, 4.7, 9.3, about 35 and about 52 s.
- **Model line on every result:** *This is a made-up model. Real hearing also depends on wind, hills, trees, buildings and other noise.*

The child taps a place, predicts the time (number entry with a worked step), taps **Ring**, and watches a ring spread from the bell at a slowed, stated rate while a step meter at the place falls. A **Storm** toggle shows the bigger noise line. Speed never changes with the toggle or with distance.

### (d) Thunder counter

A storm scene with the librarian at the library window. Tap **Flash**; the app counts whole seconds aloud and on screen until the authored **Bang**, then shows the count. The child divides by 3 (km) or by 5 (miles), with a worked step. A row of four authored counts (12, 9, 6, then 9 again later) lets older learners see the storm come closer and move away. The counter is a pre-authored sequence; nothing is timed against the child, nothing measures their speed, and the count is supplied. **Line on every screen:** *This estimates distance. It is not a safety tool. In a real storm, follow official weather advice.*

## Problem sets

Full items, answers, misconception tags, hints and explanations are in the companion.

| Set | Theme | Items | Depths |
| --- | --- | --- | --- |
| A. Louder or higher? | vibrations, volume, pitch, vocabulary | 10 | Sprout 3, Seedling 4, Sapling 3 |
| B. Through what, and how fast? | materials, speed order, distance = speed x time, echoes | 9 | Seedling 3, Sapling 4, Keeper's Desk 2 |
| C. Down the valley | bell times, fading, spreading, thunder, fair test | 10 | Seedling 3, Sapling 4, Keeper's Desk 3 |

Formats: 3-choice with tagged distractors, order the cards, match, number answers with worked steps, and "say why" prompts read by a grown-up and never auto-graded.

## Saved work

Optional root `soundBench` per explorer, absent until the bench opens. Local only.

```
soundBench: {
  version: 1,
  compares: [{ source, maker, a: { hard, pitch }, b: { hard, pitch }, at }],   // latest 8
  valley:   { source, predictions: { [placeId]: { value, support, at } } },
  thunder:  { source, answers: { [countId]: { unit, value, support, at } } },
  sets:     { [setId]: { [itemId]: { choice | value | order, support, skipped, at } } }
}
```

- Store codes and numbers, never prose. "Say why" responses are spoken to a grown-up and not stored.
- `source` freezes the model id and constants (speed, `S` values, thresholds, place distances, dial-to-trace map). Saved results are rendered from what was stored; they are never re-graded on load against a newer model.
- Support (hint opened, worked example opened, skip) is recorded beside each answer and never merged into it. Familiarity and independent attempts stay separate.
- An unknown version or malformed entry stays exact and exportable; only the affected panel becomes read-only. One unreadable item never closes the bench or the game.
- Uses the existing import/export, reset and explorer-switch behavior. No audio, microphone or timing data is stored.

## Curriculum fit

**Strands:** **S6-I** sound comparisons; **S6-II** pitch vs loudness; **S6-III** sound propagation; **S1-II** change one thing at a time (activity a's Compare); **M7** a stated model with assumptions (valley-bell-v1); **M** rate and division (distance = speed x time, thunder rules); **E4** a short spoken claim with a reason (Keeper's Desk). **Act families:** II (Dot's bell), III (Bramble's claim), V/VI (thunder, the long rain).

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Sound comes from vibration; volume (swing size) and pitch (swing speed) are independent; sound needs a material and travels at a speed set by the material; it fades by spreading; echoes are reflections; light beats sound. |
| Teaching encounter | Teach cards with stepped worked examples for each activity; the bench's one-dial-at-a-time strikes; the reverse-direction drum card. |
| Contrast | Louder vs higher; farther vs softer; light vs sound; wall vs space; fading vs slowing. |
| Supported practice | Guided first items with visible steps; Compare's "two things changed" note; the I'm stuck ladder. |
| New application | Bramble's magpie claim; the storm toggle; thunder counts; Keeper's Desk items on the warning bell and a fair test. |
| Purposeful revisit | Bell Studio for pitch order; spec 118's flood-bell case; Act VI's long rain; Lantern Circuit and Shadow Theatre for light. |
| Data boundary | Choices, numbers and support flags only, local. No audio, microphone, hearing data or location. |

## Upstream check

Jane refreshed at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` (2026-10-24); Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (2026-10-24). Paraphrased; no Marble text (CC BY-SA) is copied.

| Target topic (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Vibrations & Sound (`mt_VBl1T1sFCM`) | Find the vibration behind every sound, hidden ones included; show sound moving separate matter without contact; no wave diagrams. Done by *Spot the vibration* (three hidden cases) and *Shout near the drum*; the trace is a swing schematic only. A screen can't replace feeling a vibration, so the grown-up panel offers drum and rice. |
| Volume & Vibrations (`mt__00ZSLnB7p`) | Make swing size visible; vary only force; state the pattern both ways; contrast louder-same-pitch with higher-same-loudness; seed amplitude informally; keep fading separate; label any two-control model as an illustration. Done by the independent dials, Compare, A4, A5 and A8, the glossary and the model label. |
| Pitch of Sounds (`mt_KTSoXcO7OL`) | One feature at a time with force held; qualitative, no hertz; pitch and volume separate throughout; correct "harder means higher". Done by the pitch dial, A6 to A9; hertz stays in builder notes. |
| Sound Travels Through Materials (`mt_ydtcIBwHB9`) | Over-sample non-air media; taut vs slack string telephone, the string itself vibrating; vacuum as a demonstrated boundary case. Done by activity (b): five of eight cards are solids or liquids; bell jar with its caveat; space. |
| Sound Fading with Distance (`mt_Pau0aqLNgp`) | Spreading is the cause, never slowing or running out; speed set by the material; fading kept apart from muffling; no inverse-square mastery. Done by activity (c)'s spreading ring and constant speed readout, the storm toggle as noise, C2, C3, C5 and C10 (four times the area, no decibels). A measured walk-away test is offered off-screen. |
| Light & Sound Vocabulary (`mt_YPSx5pbpVl`), **sound terms only** | Teach words at the phenomenon; pre-empt "volume means amount" and "pitch means loud"; require productive use. Done by the glossary, the "volume here means loudness" card, and "say why" prompts spoken to a grown-up. The light terms are left to Shadow Theatre (spec 112); no full topic claim. |
| How Sound Waves Travel (`mt_DQk9oDE7gr`), **older, partial** | Speed order solids > liquids > gases, confronting "more space is faster"; echoes as reflection with timing to distance; the bell jar with its honest caveat; absorption as a tendency. Done by Set B (B5 to B9) and the bell-jar card. Compressions and rarefactions appear only in a Keeper's note; no particle-model claim. |

Not targeted: **Communication with Light & Sound** (`mt_ZL9qVVnpwN`) needs a child to build and test a real device; the string telephone appears only as a card, so no claim. **Waves & How They Move** (`mt_ph4xZVMiVq`) needs wavelength and a wave model; "swing size" only seeds amplitude. Candidate references only.

**Jane, adopted:** teach -> guided -> practice order; worked examples revealed a step at a time; the I'm stuck ladder (hint, easier worked example plus how to start, skip for now); 3-option multiple choice with misconception-tagged distractors; short second-person prompts; a key-terms glossary. **Not adopted:** points, hearts, medals, bosses, streaks, mastery labels, gates, timers, next-day step-downs or requeues. No Jane code or text is copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`.

| Target | Hard prerequisite | How it is met |
| --- | --- | --- |
| Vibrations & Sound | Light & Sound Vocabulary (`mt_YPSx5pbpVl`) | Sound terms taught inline (glossary, vocabulary card). Light terms: met in part elsewhere (Shadow Theatre, spec 112). |
| Vibrations & Sound | Communication with Light & Sound (`mt_ZL9qVVnpwN`) | Not taught. The edge's own reason describes the reverse order (understand sound before designing a device), as spec 48 already flagged. Kept exactly; not used as a gate; documented gap, no claim. |
| Volume & Vibrations | Vibrations & Sound (`mt_VBl1T1sFCM`) | Taught inline first (activity a's spot-the-vibration). |
| Volume & Vibrations | Light & Sound Vocabulary | Sound terms inline. |
| Pitch of Sounds | Vibrations & Sound; Light & Sound Vocabulary | Both inline, as above. |
| Sound Travels Through Materials | Vibrations & Sound; Light & Sound Vocabulary | Both inline, as above. |
| Sound Fading with Distance | Sound Travels Through Materials (`mt_ydtcIBwHB9`) | Taught inline in activity (b) before (c); (c) stays open regardless. |
| Light & Sound Vocabulary | none | |
| How Sound Waves Travel | Sound Travels Through Materials | Inline. |
| How Sound Waves Travel | Wave Properties & Types (`mt_LxK9OKZQZX`) | Not taught (needs Waves & How They Move and Wave Behaviour Vocabulary). Documented gap; the older items are therefore a partial encounter, no topic claim. |

## Checks for implementation

- **Numbers script-checked:** `check146.py` (scratch, run with `python3 -I`, 2026-10-25) asserts every numeric answer in the companion and passed. Key results: 1 km / 343 m/s = 2.9 s, so divide-by-3 underestimates by 2.8% and divide-by-5 (miles) by 6.2%; thunder counts 6, 9, 12 s give 2, 3, 4 km by the rule (exact 2.06, 3.09, 4.12); valley times 0.6, 1.2, 2.3, 4.7, 9.3, 35.0 and 52.5 s; steps 5 to 1 for the hard mill bell, silence beyond 6,400 m, storm hearing to 800 m; gentle ring at the bakery and hard ring at Hob's farm both 3 steps; 59 m: steel 0.01 s, air 0.17 s, gap 0.16 s; echoes 170 m -> 0.99 s, 3 s -> 514.5 m.
- A test enumerates all 9 dial settings per maker and confirms swing size depends only on How hard and swing count only on the pitch dial.
- Compare flags two changed settings and never blocks.
- Every bench, valley and thunder screen shows its model or safety line.
- Audio: explicit Play only; Stop cancels all nodes; peak gain never exceeds `G`; stops on hide and route change; a visual-only route completes every item. Builder notes on hertz never appear in child text.
- Thunder counter is pre-authored; no element measures the child's time.
- Saved work reloads exactly; a model version change shows an earlier-model note without re-grading.
- Browser at 320 and 820 px: map places become an ordered list on narrow screens; controls at least 44 px; labels never rely on color or hearing alone.

## Review asks

- **Physics check:** is "solids fastest" safe with the "varies by material" caveat? Is the steps model (one step per doubling, matching about 6 dB per doubling in free field) an honest simplification? Is the bell-jar line ("less air, less to pass it on") acceptable given the impedance-mismatch caveat that demonstration pages raise? The 17 m echo rule rests on exam-prep sources; keep or cut?
- **Audio check:** are three fixed gains (G, G/2, G/4) acceptable, given Bell Studio chose no loudness variation? Default: keep them, sound optional, visual route complete.
- **Owner:** Act V (sky-watching night interrupted) or Act VI (the long rain) for the librarian's thunder count? Default: Act VI, as a preparation job, so the thunder and the bell sit together.
- **Owner:** keep the ear card as looking-only? Default: yes, no items.
