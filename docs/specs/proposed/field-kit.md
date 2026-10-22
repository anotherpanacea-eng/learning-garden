# Field kit: real-world missions beside the model games

Status: **proposed draft for independent specification review** (Claude, Code-Mac, 2026-10-22). Unnumbered: the builder assigns a spec number. Not built, not reviewed. Strategy 3.4 of [the proposal](../../other-routes-through-the-acts.md).

## Purpose and story

Several built games deliberately teach with supplied models: a pictured jug, invented seedling lengths, model rain. Spec 49 §5 keeps model data, learner measurement and adult-reported offscreen observation as distinct source kinds, but only the first has a route in the app. A field kit gives the other two a designed home without pretending the screen can see them.

Story: the town's helpers left a box of mission cards after the storm, "things worth trying in your own kitchen, window or street." Each card belongs to a game the child already knows and opens from that game's page. The child and an adult try it off-screen, at any pace or not at all. Afterwards the **adult** chooses one outcome, and a neighbour answers in the story. Nothing typed, measured, photographed or located is collected. The only record is the mission id and the adult's outcome code. That code is not data about the world, a measured value, mastery or an on-screen independent attempt.

Jane is not a source here; it has no offscreen route. No upstream code, prose or assets. Route: **#field** for the kit index, with each card at **#field/<mission>** and linked from its host game. No new global navigation beyond one entry on the host pages and the existing grown-up notes.

## Complete finite first pack

Five cards. Every material is optional, and each card lists a no-materials alternative. Wording below is a design outline for independent content review, not final copy.

| Mission id / title | Host game (on main) | Materials (plausible household) | Steps (adult-supported) | Contrast it adds | Never recorded |
| --- | --- | --- | --- | --- | --- |
| `jug` / A real jug and our picture jug | Measuring Kitchen, #cafe/recipes | A measuring jug with mL marks, cold tap water, a towel | Find the 250 mL and 500 mL marks. Fill to one at eye level on a flat surface. Compare the gap between your jug's marks with the picture's 50 mL steps. | A real scale's marks and intervals vs our supplied picture scale; reading at eye level | Any reading, jug size or brand |
| `cress` / Two pots, two kinds of light | Seedling study, #living/plants | Two small containers, kitchen paper or cotton wool, cress seed sold for sprouting, water | With an adult, sow both alike and keep both damp. Put one by a bright window and one in a dimmer room spot (not a closed cupboard). Look together over about a week. | Our invented model numbers vs your own two pots; one real pair is not a test of every plant | Lengths, dates, pictures, where the pots stand |
| `notice` / A café notice by hand | Post Office letters, #post/letters | Paper and a pencil or crayon | Write or copy a short notice for a pretend café board ("Soup today"). Read it aloud to the adult. Change one word if the reader asks a question. | A tapped or assembled on-screen message vs handwriting a person reads | The text, a photo, any judgement of handwriting |
| `weather` / Three weather windows | Rain Paths, #science/rain | A window | On up to three different days, look out together and say one weather word (sunny, cloudy, rainy, windy, foggy). | Real weather seen vs model rain tokens; weather today vs a pattern over days | The words chosen, dates, location |
| `walk` / Look, then guess | Living Garden, #living | A short adult-led walk on a path, or a window view | Find one damp place and one dry place. Say what you see first ("the soil is dark"), then a guess ("it rained"). | Observation vs interpretation, in a real place | Places, animals, routes, the child's words |

Safety notes are part of each card and are flagged for **independent content review**, not settled by this draft:

- **Water:** cold tap water only; an adult handles anything glass; wipe spills.
- **Cress:** use seed sold for sprouting or growing, never treated or coated seed. An adult decides whether any shoots are eaten. Wash hands after sowing.
- **Walk:** adult-led only; stay on paths; look but don't pick up or touch animals or fungi; wash hands afterwards. A window view is always a complete alternative.
- **No mission involves heat, cutting tools, chemicals, roads or water bodies.**

## The actions and contrasts

Each card has three short parts.

1. **Before:** purpose, materials, steps and safety in plain words, with optional local narration.
2. **Off-screen:** the app only says "Try it together when you like; there's no timer."
3. **After:** three native buttons for the adult:
   - **We did it** (`done`);
   - **It surprised us** (`surprised`);
   - **Not today** (`not-today`).

A neighbour then answers in story, from a short authored response per mission per code. For example, after `notice` + `done`, the café cook "pins your notice beside the soup pot." `not-today` gets an equally warm response ("The box will keep it"), so skipping is never a failure.

Each card states the contrast in one sentence beside the host game's model, for example: "The picture jug is our drawing. Your jug's marks may be spaced differently, and both can be read carefully." The surprise response invites talk, not a record: "Surprises are worth telling someone about. What did you expect?"

Hard boundaries:

- **No result field.** A real result never enters a model, table, chart, notebook row or comparison as if it were the model's data, and the host game's supplied data is never relabelled as the child's.
- **The outcome is chosen by the adult**, and the button says so. It is never shown as the child's on-screen attempt, and notes label it "adult-reported, offscreen."
- **No interpretation.** Choosing `surprised` does not mean the result differed from the model, and `done` does not mean the steps were followed exactly.

**Printable view.** Each card has a local print layout (CSS print styles on the same card page; no PDF library, no network). It has materials, steps, safety and the contrast sentence, plus space to draw. The app never sees what is drawn there. Printing is optional, and the on-screen card is complete without it.

## Manageable turns, support and history

The kit index lists the five cards with their host game names; every card is always open, in any order. On a card, the active part (Before or After) is visible at once on a phone without scrolling past history; earlier outcome entries sit in a native fold. Help explains why the kit exists and what is never recorded. "We read it together" and narration are separate support records, captured only when used. All controls are native buttons with labels, keyboard focus and 44 px targets. No drag, timer, countdown, reminder or notification.

A card can be done again; each time the adult chooses an outcome, it adds a new entry, and nothing totals, ranks or streaks those entries. Opening a card, reading it or printing it allocates nothing. Only an explicit outcome button creates an entry.

## Small optional saved state and boundaries

Optional root `fieldKit: {version: 1, page: 'index' | <mission id>, entries}`. Each entry is:

```
{ id, mission: {id, version, title}, outcome: 'done' | 'surprised' | 'not-today', support: [codes] }
```

- **No timestamps.** Dates could imply a schedule or streak, and nothing reads them.
- Keep up to 24 readable entries. Before the 25th, disclose that the oldest is removed; never trim on view.
- Each entry freezes its mission's id, version and title, so a renamed or retired card still shows its own title.

Validation follows AGENTS.md:

- **Check an entry against itself:** a positive safe integer id, a known outcome code from this spec's three-code vocabulary, a well-formed frozen mission snapshot, and support codes from its own list.
- **Never against today's catalogue.** An entry naming a mission that no longer exists stays readable with its frozen title, and the kit never requires today's five cards to appear.
- **Recover per entry.** Unreadable or duplicate entries go to an escaped "earlier records" fold, and the rest stay open. An unknown root version is preserved exactly and shown as unavailable.

Data boundary (spec 49 §5 item 7):

- **No free-text field exists.** No names, places, photos, measurements or dates are stored.
- Outcome codes appear in grown-up notes and the existing local JSON export only, labelled "adult-reported, offscreen; not a measurement or attainment."
- Explicit deletion through the existing explorer reset removes the root.
- No upload, sharing, model transmission, or change to Café stock, garden state, suggestions or any other game's evidence.

## Acceptance and gates

**Before build:**
- Independent specification and content review of all five cards: wording, materials, alternatives, contrast sentences and every safety note. A reviewer with practical home-science judgement checks the cress and walk cards in particular.
- Then implementation review, actual browser verification and a draft PR; no merge or deployment.

**Candidate Marble references** (partial references, to be confirmed by the source audit):

| Topic | Id | Card |
| --- | --- | --- |
| Capacity and volume | `mt_4lp_b5Pzik` | jug |
| Comparing Capacity | `mt_zkFbMLpu3U` | jug |
| What Plants Need to Grow | `mt_3v0VNkwquK` | cress |
| Observation vs Interpretation | `mt_Hw70LI5xza` | walk |
| Types of Weather | `mt_jc9k_HJQGd` | weather |
| Local weather patterns | `mt_HZvTriQWTh` | weather |
| Writing for an audience | `mt_cB7hV8sw7X` | notice |

The source audit must decide whether an adult-reported offscreen opportunity justifies any atlas reference at all. Adult-reported offscreen work is **never an on-screen independent attempt**, and none of these references may claim measurement, handwriting, observation or weather-recording attainment.

**Tests** (synthetic fixtures only):
- every card renders and prints locally;
- outcome entries are created only by explicit buttons, and each code's story response appears;
- no entry is created on view, print or reload;
- the 24-entry cap is disclosed;
- frozen titles survive catalogue changes, including a retired mission and a sixth card added later;
- per-entry recovery handles malformed, duplicate and future entries;
- export, import, reload, save-off and explorer isolation behave as in other games;
- unrelated state is untouched;
- escaping holds;
- a 44 px, no-overflow phone layout;
- keyboard and narration paths work.

**What success does not establish:** that any real activity happened as described, physical measuring or growing competence, handwriting quality, or educational gain.
