# Challenge bands: one story, different starting challenges

Status update, **2026-10-23: the bounded Café starting-amount slice is implemented and merged in [PR78](https://github.com/anotherpanacea-eng/learning-garden/pull/78)**. Its existing [specification review receipt](../../reviews/challenge-bands-spec-review.md) records the earlier spec gate. The broader per-strand starting shortcuts and support preferences below remain proposals, not implemented capabilities. Seedling and Sapling still share the full Café range. This proposal does not establish deployment or a unified age/ability-based story-entry system.

## Purpose and longer-term direction

Explorers sharing a device keep their own work. They should be able to experience the same town, places and story with different starting challenges. Starting choices describe tasks, never a child's age, grade or ability. They never lock a destination or become assessment evidence.

The longer-term proposal is a simple starting shortcut per strand (`math`, `reading`, `science`, `world` and `french`). Sprout suggests smaller numbers or shorter passages; Seedling suggests broader ranges; Sapling suggests more complex tasks. These are authoring labels, not a validated developmental sequence. A strand shortcut must allow independent choices **within** that strand: foundational number practice must coexist with advanced geometry. Each newly narrowed activity must provide its own override before it adopts a shortcut. No additional mandatory setup rows are needed, and setup is never required to play.

Read-aloud prominence and picture choices are separate support preferences, not a consequence of a band. Their eventual implementation must distinguish offering a tool from actually requesting or using it. Neither a band nor a support preference records listening, help use, independent success or mastery.

The first increment is deliberately smaller: **opt-in Café starting amounts only**. Other controls and support preferences remain authoring candidates, not first-build deliverables.

## First increment: Café starting amounts

In Grown-up notes, offer a Café starting-amount selector and an explicit **Use this starting choice for future Café orders** action. Show what each choice does:

| Choice | Existing Café range | Actual quantities |
|---|---|---|
| Sprout | `small` | The existing small pool: 2–4 guests, 2–3 bites each |
| Seedling | `all` | The existing ordered pool: 1–12 guests, 1–12 bites each |
| Sapling | `all` | The same existing full pool; no additional harder content is promised |

Seedling and Sapling intentionally share a range in this increment. Café does not yet support three distinct ranges. Preserve the full-pool rotation and counters; do not restart the sequence when changing the starting choice. The child screen continues to say which amounts are available without labeling the explorer by band. Existing small/full range buttons stay available and become explicit local overrides.

The Grown-up notes action explains: **This changes amounts for the next new guest. Your current guest and earlier work stay as they are. Choosing amounts in the Café overrides this starting choice until you choose to use it again.** Applying it is a deliberate reset of this one control, including any older choice. Selecting a value in an unsubmitted settings form does nothing.

No other activity reads the new setting in this build. Ordinary play never requires a grown-up setting, and all destinations, guests and ingredients remain available under their existing rules.

## Small optional saved preference

Use existing per-explorer `state.garden` storage, not the profile registry. Add only:

- `garden.start.math`: optional exact enum `sprout | seedling | sapling`.
- `garden.cafeStart`: optional exact enum `follow | local`.

`garden.start` must be a non-array object to read a `math` value. Unknown fields, unknown enum values, arrays and malformed values are ignored by pure readers, without deleting or replacing their original data. Do not materialize these fields on load, view, export or ordinary unrelated saves. A missing/invalid value means **legacy behavior**, not an implicit Seedling reset. A form may display Seedling as its initial unsubmitted suggestion; that is not a persisted choice.

Only `cafeStart === 'follow'` **and** a valid `start.math` activate the mapping above. In every other case, use the existing `cafe.range` behavior. Thus an existing saved range is preserved whether it was chosen by a person or materialized by `ensureCafe`. The feature does not claim to reconstruct historical choice provenance.

On the explicit Grown-up notes action, save the selected `start.math` and `cafeStart='follow'`. Do not overwrite `cafe.range`. On an actual existing Café range-button choice, keep calling `setCafeRange` and set `cafeStart='local'`; leave the saved band alone. Merely rendering the currently selected button is not a choice. Applying the Grown-up action again explicitly returns to follow mode. There is no generic `picked` map in this increment: one control does not need a cross-activity provenance framework.

When writing a valid setting, preserve sibling fields in readable `garden`/`start` objects. Existing loading already normalizes a non-object `garden` container; this feature does not change that behavior or claim to preserve data that loading has already normalized. If `garden.start` has an unreadable non-object shape, keep its raw value unchanged and decline this optional setting with a short explanation; ordinary play remains available. Do not silently replace an unreadable `start` container just to save a preference.

The values travel in the explorer's normal saved state and exports. The profile registry remains unchanged. Never copy a preference to another explorer or serialize a real learner record in repository fixtures.

## Integration and frozen orders

The integration seam is the existing `nextGuest(state)` in `dist/cafe-core.mjs`, which currently chooses its new parameters from `c.range`. Use one shared read-only effective-range function in both this new-order boundary and the Café range-button rendering. The selected button and next-guest explanation must describe the effective range, not the unchanged stored `cafe.range`. In follow mode, show a neutral line such as “Using the grown-up’s starting amounts,” without a band label. Clicking either range button, even the currently selected one, is a real local choice and sets `cafeStart=local`. No other Café validation or result interpretation needs the preference.

Existing `current.params` and historical `params` remain authoritative in `orderFor`. Band changes and local range changes must not alter an open plate, multiplication question, stock question, repair question, recipe, guest, attempts, support, familiarity, cupboard plan, ingredient stock, served count, supper progress or history. A resumed order uses its original frozen quantities. A refused new-order action must not advance counters or create a guest. Ordinary new-order allocation advances the existing counters exactly once.

`startConnection` in `dist/learning-connections.mjs` also calls `nextGuest` on a trial state and then restores `allIndex` before replacing the parameters. Preserve that cursor restoration. Explicitly connected practice orders retain their supplied frozen quantities and provenance. A default never rescales a task carried from another game. The feature adds no observation, support, exposure, score or mastery ledger.

## Acceptance checks for the first increment

Use synthetic states and the existing focused Café, transfer and browser check patterns; no new validation framework is needed.

1. Missing preference: fresh and legacy explorers behave exactly as before, including saved `small` and `all` ranges. Reading/rendering preferences adds no optional fields and does not mutate malformed or unknown data.
2. Apply each band: the next ordinary guest uses the mapping. Seedling and Sapling retain the full 1–12 ordered pool and rotation. Reapplying a choice does not reset cursors or create a guest.
3. A local small/full button wins after opt-in, persists across reload, and does not change the saved band. The explicit Grown-up action can return to follow mode.
4. Change settings during plate, total, stock and repair stages. Before/after snapshots of current order, recipe, attempts, support and plans stay equal. Serve or skip under existing rules; only the next new guest uses the new default.
5. Explorer switch, reload and export/import preserve each explorer's preference and local override separately. Missing/invalid preference leaves all other work readable. Failed storage follows the existing warning behavior; do not claim persistence on failure.
6. Existing connected-order quantities, provenance and `allIndex` cursor stay equal despite a conflicting band. No new observations or support-use records appear from settings alone.
7. Browser: clear next-guest explanation, visible local override and selected state driven by the same effective-range function as `nextGuest` (including a legacy `all` save following Sprout), clicking an already selected range establishes a local override, keyboard/focus behavior, touch targets at least 44px, and phone/tablet fit. Grown-up configuration is optional and no band label appears on the child screen. These checks do not establish suitability for a particular age or device-native audio behavior.

## Deferred controls: authoring candidates, not build claims

- **Bramble:** saved `mode` and `table` are separate controls (`post-rival.mjs`). Specify a finite mapping and preserve existing choices and open puzzles before adding defaults. Do not reduce its fair full-range coverage accidentally.
- **Living Garden:** `choices[k]` (`auto` or 1–3), adaptive `levels[k]` and epochs are distinct. A future spec must define lazy creation, unreadable-root preservation, seed-once timing, return-to-auto behavior and open-visit handling. This increment writes none of them.
- **Number Garden puzzles:** `puzzleLevel` is session-only. Do not mark it as a saved explicit choice without a real saved preference.
- **Two Windows:** form exists in each frozen `round.source.form`, not as a reusable saved preference. A future default needs a separate preference or a session-only suggestion. Never rewrite saved source forms.
- **Generated ranges and authored subsets:** later work must specify the actual pools, local overrides and contrasts, preserving saved source values and familiarity rules. A number-range edit alone does not make an activity appropriate for every learner.
- **Newer drafts:** Joining Orders, Willow Path, Field Kit and Town Remembers need explicit audit when integrated. Their frozen pictures, sources and source-derived errands must not be rescaled from a starting band.
- **Support preferences and reading-heavy content:** offer read-aloud/pictures independently where the activity actually supports them. Author new text or phonics experiences through their own reviewed specifications. No placeholder toggles that do nothing.

## Upstream overlap (AGENTS.md)

Studied from the pinned notes in `docs/upstream-opportunities.md`, not refreshed for this proposal. Before implementation, refresh the relevant Jane `LESSONS.md`/`src/engine.js` and Marble `data/topics.json` references and record revisions in the feature's source audit or PR.

- Marble topic bands remain reference metadata, not placement or evidence. They do not determine this preference.
- Jane's mastery-gated selection is not adopted. Its picture-choice and ordering formats are design references for later support work; no Jane code or content is incorporated here.
- The first increment adapts the app's existing Café quantity pools and local explorer storage. No external runtime or new licensed content is needed. The per-strand shortcut remains an original design proposal, not a claim that all upstream preference mechanisms have been exhaustively surveyed.

## Boundaries

Offline, local per-explorer preferences; no age, grade, birth date, name or demographic field. No locks, timers, scores, placement tests or inferred ability. Same town and story, with all destinations open. Saved work retains its original values and recorded outcomes. A future range edit must never close or regrade it. New capabilities follow the independent specification and implementation review gates before release.
