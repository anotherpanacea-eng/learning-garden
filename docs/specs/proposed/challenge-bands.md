# Challenge bands: one story, a different challenge for each explorer

Status: **proposal** (2026-10-22). Unnumbered: the builder assigns a spec number. Not built or build-ready. Needs independent specification review before any build.

## Purpose

Two children of different ages share one device and one town. Each has their own explorer. The story, places and acts should stay the same for both, while the numbers, reading load and number of steps fit each child. Today the only per-explorer setting that isn't content is speech (`state.garden.speech`). A few activities have their own level control, but nothing ties them together, so the younger child meets the older child's defaults everywhere.

This proposal adds one per-explorer **challenge band**, chosen by a grown-up. It sets the *starting* challenge in each activity that can vary. It never locks a place, never hides a door, never grades, and never appears on the child's screen as a label.

## The band

- Three bands, stored as codes: `sprout`, `seedling`, `sapling`. The grown-up chooses by what the challenge looks like, never by age, grade or birthday:
  - **Sprout:** small numbers (mostly to 10), one step at a time, read-aloud first, and picture choices where they exist.
  - **Seedling:** numbers to about 100, two-step problems, short passages.
  - **Sapling:** larger numbers and harder fractions, several steps, longer passages and more reasoning about sources.
- The setting describes a challenge, so the profile still holds no name, age, grade or demographic field, as `docs/first-visit.md` requires. The age ranges in the tiering audit below are authoring notes for builders. The app never shows or stores them.
- Stored in the explorer's own state as `state.garden.band`, beside `speech`, so it moves with that explorer's saves and exports. The profile registry stays unchanged (`cleanProfile` in `dist/explorer-storage.mjs:12-15` drops unknown fields, and the registry doesn't need to know).
- A missing or unknown value reads as `seedling`, and the rest of the save loads normally. No save is rewritten on load.
- A grown-up sets or changes it in **Grown-up notes**, and optionally when creating an explorer. Changing it never touches saved work, kept records or earlier observations. It changes only which starting choice later activities offer.

## How activities use it

The band chooses a **default**, and every activity keeps its own control where one exists. A child or grown-up can still pick an easier or harder option inside any activity, and that choice wins for that activity.

**Default versus chosen.** Some saves already hold values nobody chose. For example, `ensureCafe` fills a missing café range with `all` (`dist/cafe-core.mjs:68-74`), and later saves keep it. So the build adds one map, `state.garden.picked`, holding an activity code for each control a person actually changed. The control's existing stored value keeps its meaning, and only the new map records who set it.
- A control listed in `picked` keeps its stored value whatever the band.
- A control not listed in `picked` takes the band's default. For a save made before this feature, that covers every stored value, which is acceptable because a missing band reads as `seedling` and `seedling` maps to today's defaults. Nothing changes for an existing explorer until a grown-up picks a band.
- When a grown-up picks a band, Grown-up notes say plainly that unchanged activities will start at the new band, and that saved work and kept records stay as they are.
- `picked` holds only known activity codes. An unknown or malformed entry is ignored, and nothing else is lost.

1. **Existing controls take the band as their default:**
   - café `range` (`small` for sprout)
   - Bramble mode and times table
   - the Living adaptive starting level
   - the puzzle level suggestion
   - the Two Windows `short`/`long` form

   Each stored per-activity choice keeps its current meaning.
2. **Generated content narrows its ranges** by band: Number Garden variants (`broad-variants.mjs` `draw()` ranges and the broad support/explore/stretch tiers), the facts pool, equal-groups cases, bundle totals, measuring amounts, coin prices and parcel totals. The ranges live in one table per activity, keyed by band code.
3. **Authored content offers a subset first:** for example un-/re- before -ness/-less in Word Garden, or halves before thirds and sixths on the Fraction Trail. Everything stays reachable.
4. **Ideas above a band stay open.** For sprout, activities whose core idea sits above about 5 to 6 (equivalent fractions, source critique, the Archive, the apprentice's claims) show a warm "best with a grown-up" line and stay playable. Nothing is hidden.
5. **Reading.** Read-aloud already exists on almost every activity (`play-media.mjs`). The two gaps are the Water Lab missions and story ordering. For sprout, activities lead with the read-aloud button and use picture choices where they already exist. Decodable text waits for the phonics door.

Saved results record the activity's own frozen values (the numbers and choices the child actually saw), as they do today. The band is never written into an observation as a verdict, and grown-up notes may say which starting challenge was offered.

## Build order

1. **The band setting, the `picked` map and the five existing controls.** This is small, and it gives the younger child a better start everywhere those controls exist.
2. **Cheap ranges** for about twenty generated or fixed-number activities (table below).
3. **Medium items:** simpler wordings or extra cases for the science picture packs and worked-text math.
4. **Reading-heavy authored work**, after the phonics door and read-aloud gaps.

## Tiering audit (main at 4b13717)

| Cost | Activities | What tiering takes |
|---|---|---|
| Already tiered | Café orders, Bramble's challenges, Living spiral/adaptive search, Number Garden puzzles, Two Windows (length) | Read the band as the default. The puzzle level isn't saved today (`app.mjs:91`). |
| Cheap | Number Garden check-in and Pip & Dot adventures, 12 × 12 fact garden, orchard hunt, equal groups, Bundle Exchange, Sharing Counter, Parcel Packing, Whole Batches, Measuring Kitchen, Coin Counter, Balance Stall numbers, Cartographer map, Repeat Deliveries, Bell Studio, Plant Study, Field Notebook, Rain Paths, rain charts, Word Garden, Story Loft | Change parameter ranges, or pick a subset of the existing items. |
| Medium | Post Office deliveries, Market Change, Preparation Clock, Balance Stall help, Storm Workshop, Fair Test, Living Garden habitat, Food Links, Life Stages, Body Clues, garden stories, After the rain we plant, Instructions for a Reader | Some new authored cases, or a second, simpler wording. |
| Costly | Letter Trail, Messages for a reader, Travelers' Archive, Source Trail, Paris and French Paris, Fair Test apprentice, Water Lab missions, Ribbon Matches and Fraction Trail beyond halves for sprout | Reading-heavy authored text, or an idea above about 5 to 6. Mark these "best with a grown-up" for sprout and keep them open. |

## Upstream overlap (AGENTS.md)

Studied from the pinned notes in `docs/upstream-opportunities.md`, not refreshed for this proposal. The builder refreshes Jane `LESSONS.md` and `src/engine.js` and the Marble `data/topics.json` at implementation time, and records the revisions there.
- **Marble:** its topic age bands are reference metadata only, as spec 49 already rules. This design takes no placement from them, and their use is limited to the authoring notes in the audit.
- **Jane:** its engine selects review items and gates progress by mastery. The band deliberately adopts neither. AGENTS.md says reusing upstream work doesn't require adopting its mastery labels or access locks. Jane's lesson formats (picture choice, ordering, number lines) are a design reference for the sprout picture choices, and no Jane code or content is incorporated.
- Nothing upstream offers a grown-up-set starting challenge shared across many activities, so this is original design.

## Boundaries

- Single device, offline and local. No age, grade, birth date or name is collected or shown. The band describes a challenge, never a child.
- No locks, timers, scores, mastery labels or placement tests. The band is a grown-up's starting choice, so the app never infers it.
- The same acts, places and story beats for every band. Only the challenge varies.
- Saved work is validated on ids, counts and outcomes (AGENTS.md). A band change or a later range edit must never close or regrade saved work.

## Questions for the owner

- Band names: Sprout, Seedling and Sapling, or other garden words?
- For sprout, should above-band activities stay open with a "best with a grown-up" line (recommended), or be tucked behind a "more to explore" door?
