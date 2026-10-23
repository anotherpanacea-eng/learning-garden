# 114. How shall we begin?

Status: authored candidate; independent six-lens specification, source and static-design review pending. No implementation is cleared by this status. This is the first optional starting-flow increment from the [current roadmap](../roadmap.md#different-starting-points-current-capability-and-next-work).

## Purpose and bounded outcome

Offer a short, skippable way for an explorer to choose different starting challenges in Café math, English reading and French, then visit an existing destination. Reuse the current task pools and authored stories. These are choices about activities, not an age, grade, ability profile, placement assessment or completed lesson. Nothing unlocks a destination and no check-in is required.

The optional route is exact `#begin`. A prominent quiet invitation at the top of Home says **Find a place to begin**, with **Choose numbers and reading amounts, or explore as you are.** Grown-up notes offers **Change starting choices**. All explorers see the invitation, so it can be revisited without a new seen/completed flag. No automatic redirect is added to first load, new explorer creation, returning explorers, imports, deep links or film completion. Normal Home/new-explorer welcome-film behavior remains intact. Direct `#begin` skips automatic film playback without marking any film seen. The ordinary Home replay remains available.

The outcome is a useful first destination with deliberately chosen future task defaults. This build does not add later-act arrival stories, different versions of every bench, a generic learning-profile service, science defaults, a new diagnostic, automatic content generation or a new taxonomy declaration.

## Four small pages

Keep one page visible at a time, with native buttons for **Math / Reading / French / Begin** in a labelled navigation. Every page has **Skip and go Home**, leading Home with no preference changes. Back/Next never writes the notebook. The four page links allow jumping directly without answering earlier pages. At 320px the step navigation may wrap into two columns; it must not require horizontal scrolling. Each choice is an ordinary native button with `aria-pressed`, or native radio with a shared legend. Use one consistent control type across the three pages. The active step has `aria-current="step"` and a visible check/Current marker, not color alone; hide the redundant check from its accessible name.

Opening `#begin` creates only a temporary draft owned by the current notebook and explorer. Every field starts at `keep`, so passing through does not silently apply defaults. Show a short current-choice line from pure readers. An unknown or unreadable saved choice is described as **Keep existing choices** rather than assigned a guessed level. The page says **You can choose a different amount inside each activity.**

### Math

Title: **What numbers shall we start with?** Purpose: **These choices are for new Café orders. Other math places keep their own choices.** Three options:

- **Keep my Café choice** (`keep`). Describe the effective current range if readable, otherwise keep the neutral copy.
- **Smaller orders** (`small`): **2–4 guests; 2–3 bites each.**
- **All multiplication facts** (`all`): **1–12 guests and bites.**

No pre-solved quantity, example array or computed product appears. This is selecting a pool, not practising or exposing a multiplication fact. `small` maps to the existing Café `sprout` preference; `all` maps to `seedling`. Existing `sapling` is preserved by Keep; Seedling and Sapling remain the same full range. Never promise a third harder range. Apply reuses `applyCafeStart` so the explicit choice sets follow mode; existing Café range buttons remain local overrides for future guests. No cursor or stored `cafe.range` is reset.

### Reading

Title: **How much English text today?** Purpose: **For new Paris and Library reading visits.** Options:

- **Keep my starting choice** (`keep`).
- **Use suggestions** (`auto`): **Let recent reading visits suggest an amount.**
- **A little text** (`1`).
- **A little more** (`2`).
- **A longer passage** (`3`).

The amounts refer to existing authored passage variants, not reading ages or demonstrated proficiency. Original fixed First Morning/Paris errands are unchanged.

### French

Title: **How much French today?** Purpose: **French can start somewhere different from English and math.** Same `keep` and `auto` options, then:

- **Short sentences** (`1`).
- **More connected text** (`2`).
- **A short paragraph** (`3`).

These are the existing French exploration amounts. Share the current `parisLengths` / `frenchLengths` label maps between setup and landing controls, so the selected words stay the same; no second competing vocabulary is added. English history does not decide French suggestions. Word meanings, listening and reading together remain available in the reading activities; the setup neither requests those tools nor records their use. Do not add nonfunctional support toggles.

### Begin

Title: **Choose your first errand**. Show all three draft choices using their actual task descriptions. For a `keep` field say **Keep existing Café choice**, **Keep existing English choice** or **Keep existing French choice**; do not replace Keep with a guessed amount. Explain: **These choices are for future orders and new reading visits. Anything waiting keeps its own numbers and pages.**

Four clearly labelled destination buttons:

- **Go to the Café** → `#cafe`.
- **Read in Paris** → `#paris`.
- **Explore Paris in French** → `#french`.
- **Choose another place** → `#explore`.

Each button first tries to apply the complete draft atomically, then navigates to that landing. It never calls `nextGuest`, `startVisit`, a task recorder, a support helper or a check. Existing pages determine whether to continue waiting work or choose a new task. Reading landings retain their current paused-visit confirmation; choosing a new amount never replaces a current story silently. Destination cards include a short purpose rather than a computed task or passage, so merely viewing them adds no support, familiarity or observation.

## Storage and pure readers

Reuse optional `garden.start` fields, not the explorer registry. Existing `garden.start.math` and `garden.cafeStart` retain their meanings. Add only optional `garden.start.reading` and `.french`, each the exact value `auto | 1 | 2 | 3`. Store codes, not localized labels. Do not add a schema version, completion marker, age, grade, name, global level, telemetry, new history or support preference.

Pure readers return a numeric 1/2/3 when an exact valid value exists, otherwise `auto`; no field is created, deleted or repaired by reading/rendering. `garden`, `garden.start`, and sibling fields must be inspected as non-array objects. Unknown fields and unreadable values are retained unchanged. The flow's draft values are `keep|small|all` for math and `keep|auto|1|2|3` for each language; invalid submitted values refuse the whole operation.

On Apply, `keep` means do not write that field or change its existing follow/local mode. A draft of all Keep succeeds without writing or requiring an export preflight, even with an unreadable preference container; ordinary destinations remain available. A writing draft requires readable existing `garden` and, if present, readable `garden.start`. If either is unreadable, decline the entire draft without replacing raw data. Missing `start` can be created only on deliberate Apply. Preserve every unknown sibling. Explicit `auto` writes `auto`; do not delete keys as an automatic reset. Identical writes are a no-op and do not call save. In particular, `all` is already satisfied by either Seedling or Sapling in valid follow mode: preserve the existing band instead of rewriting Sapling to Seedling. If follow mode is not active, deliberate `all` applies Seedling under the ordinary mapping.

Clone the whole notebook before edits. If the original notebook already fails the existing progress limits, refuse every writing draft; all-Keep still succeeds. Check limits before/after and call the actual host `notesReport(candidate)` with its pretty JSON formatting through `prepareProgressImport`. A generic bare-state stringify is insufficient: the actual download can be larger. Do not install the importer's normalized output. If refused, keep the original notebook byte-for-byte, draft selections, current page and focused status message. Display **These choices could not be updated safely. Your earlier work is unchanged. You can keep exploring or download your notes.** Offer a notes link. Do not partially apply math before a reading failure. Commit only `garden.start` and, for an actual math application, `garden.cafeStart`; all other roots, current/historical guest parameters, stories, source copies, attempts, help/familiarity and cursors remain exact.

Saving off permits normal in-memory choices and existing notes download. Storage failure follows the existing persistent warning and does not claim durable saving. No new persistence fallback is introduced. Success copy says **Choices ready for this explorer**, not “saved forever.” Explorer switching, reload and normal export/import carry valid preferences without merging another explorer's choices. Malformed or unsupported saved preference values remain available in the ordinary whole-notebook export.

## Reading integration: preserve explicit automatic behavior

Leave `parisPlan` and `frenchPlan`'s existing `variant='auto'` defaults and suggestion algorithms unchanged. In `parisLanding`, `frenchLanding` and English Library `packInvitations`, select the relevant saved numeric preference in the existing amount dropdown; otherwise select `auto`. Label any explanatory reason panel **About the automatic suggestion**, so it cannot appear to explain a manually chosen numeric default. The automatic option's label and reason must still come from a real `...Plan(state, place, 'auto', storyId)` call, not from the chosen numeric preference. A quiet line explains **Your starting choice is selected. Choose any amount for this visit; this starting choice returns when you come back.** Omit that line for auto/no preference.

Existing local dropdown changes override the saved starting default for the newly chosen visit only; they are not a saved global override. No provenance map is needed. Existing handlers already pass the selected numeric/auto value through `requestParis`/`requestFrench`, the unfinished-visit confirmation and `startVisit`. Keep that chain and its frozen route/source/reason authoritative. Resume uses the original saved visit exactly. Original fixed English/French errands remain untouched. No other story page or reading outcome reads this preference. In the current English/French landing/notes descriptions, correct the older shared-notebook/no-separate-profiles copy to describe this explorer's local notebook. Do not rewrite frozen passages, responses or earlier source copies. The existing Café starting-amount panel stays available in Grown-up notes; the new link explains that its Sprout/Seedling/Sapling options map to the same small/full ranges described in the flow.

## Host, transient state and interaction lifetime

Render exact `#begin` before generic learning normalizers/binders, as the existing preservation-sensitive companion routes do. Direct startup defers explorer initialization, so viewing this preferences page does not clean unrelated raw/future work. A chooser on this route shows the ordinary chooser and no pending choice draft. Selecting or creating an explorer from it follows existing `useExplorer` behavior to Home with ordinary initialization and the normal once-only welcome film. Canceling the chooser returns to a fresh all-Keep flow. Render the header with a safe fallback guide using the existing Scale pattern, without calling `ensureGarden`; bind explorer switching explicitly before returning from the early route. On departure to an ordinary destination, the existing deferred initialization runs under its existing behavior. Do not broadly change initialization on other routes. Near-matches such as `#begin/extra` are not this flow.

The temporary page/draft belongs to notebook object identity and explorer id. Preserve it through an ordinary same-route redraw, including a storage notice. Discard on route departure, chooser, import/reset/reload or notebook replacement, including replacement under the same hash. Record departure using event oldURL/newURL so a rapid leave/re-enter in one task does not retain the earlier draft. Disconnected controls and queued speech from an earlier explorer/route/session cannot apply, navigate or speak. Use local guards rather than a general session framework.

Back/Next/page changes focus the current page heading; choice changes keep focus on the selected control and do not unnecessarily rerender the whole app. A failed Apply focuses its persistent status. On successful navigation use the existing destination focus behavior. Keyboard Tab and native Enter/Space work. No hover/drag/mouse requirement, autoplay, motion-dependent interaction or forced orientation.

An optional **Hear this page** uses existing device-local narration on explicit tap and reads the current heading, purpose, visible option labels, selected choice and next action only. It records no help/reading use because this is configuration, not an assessed task. Stop on page/choice changes, departure, explorer switch and speech-preference change; detached Hear cannot speak. All content remains available without sound. No remote voice, audio recording or audible-quality claim.

## Visual design and review artifact

Original companion route in the existing garden palette: ink `#283f3b`, leaf `#255b4d`, paper `#fffdf5`, pale sage `#e6ebd9`, ochre focus `#9a5f14`. Use the existing Trebuchet/Verdana UI family with 16px minimum body/control/essential label text, 28–30px page heading and 18px group heading. Keep a compact postcard-like introduction and a small original path/leaf mark rather than a new illustrated hero. Selected dark leaf fill/check is distinct from an external 3px ochre keyboard focus ring. Labels and icons must both be understandable without color.

At 320px, one visible choice column and a compact two-column step nav; no horizontal overflow. At 820px keep a comfortable left-aligned column with a right-side current-choices summary if it fits, rather than four simultaneously visible forms. Each essential native touch target is at least 44×44px (aim 48px); skip/back must meet this too. No fixed overlay covers the final button. Original static [phone Math](../design/114-optional-starting-flow/phone.svg) and [tablet Begin](../design/114-optional-starting-flow/tablet.svg) SVGs show the pages and must be rendered/viewed independently before runtime build; actual browser pixels remain a separate implementation gate.

## Acceptance and proportionate verification

- Every combination of math/reading/French choices resolves independently; Keep/auto/numeric semantics, invalid values, unknown/malformed containers and siblings are covered. No inference or observation results are created.
- Apply while Café plate/total/stock/repair, an English visit, a French visit, a Library source or a math draft waits; before/after comparisons preserve all unrelated source, answers, supports, counts, stock and cursors. Test refused composite Apply with no partial math write and all-Keep escape.
- Actual downloaded pretty notes import into a separate explorer with preferences preserved. Unknown/raw sibling records remain in the source download. Save-off, existing storage failure checks, switch/reload/reset and unavailable preference changes follow the established warning behavior.
- Existing English/French auto suggestions remain unchanged. Numeric starting selections appear in Paris/French/Library; explicit local auto/numeric choices reach the correct new source and confirmation route. Resumed visits retain original passage/variant/reason. Languages do not leak preferences/history into each other. Original fixed errands remain unchanged.
- Home and notes invitations, skip/no writes, four pages, jump/back, current summary, each successful destination, initial/no-change/refused Apply, exact-route fallbacks, film/chooser/deep-link boundaries, ownership and rapid departure are exercised in actual Chrome at 320/820 with synthetic notebooks. Inspect actual pixels, minimum fonts/targets, focus ring, narration requests and no horizontal overflow. No physical iPad/Safari, human screen-reader, audible or educational-effectiveness result is inferred.
- Run the affected source suites and relevant existing Café/Paris/French/Library/explorer/transfer/speech regressions; broaden only for actual host changes/failures. Root independently rechecks the exact candidate and obtains separate implementation plus exact-head Claude clearance before PR/merge. No deployment until intended Cloudflare access returns.

## Source overlap and rights

This extends the existing Café preference and Paris/French selector patterns audited from the actual source, rather than importing an upstream learner profile. The [upstream opportunities](../upstream-opportunities.md), [Café slice](79-cafe-starting-amounts.md) and [starting-choice proposal](proposed/challenge-bands.md) supply design history. The [fresh bounded source audit](../source-audits/114-optional-starting-flow.md) records Jane `1927912b8d9cd4f7df6e7fbe8416521194743060` and Marble `a8719737ff86ef7940ba5feca11940de1204103e`. Short purposeful teaching and support distinctions were studied; age/grade placement, mastery gates, prerequisite locks, current-item replacement, timers, identity and remote learner storage are not adopted. Marble source age bands remain curriculum metadata, not placement. No new external code, lesson text, assessment prompts, artwork, taxonomy rows or references are incorporated. Existing notices and separate licenses remain in force.
