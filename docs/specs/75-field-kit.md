# 75: Field Kit, five real-world mission cards

Status: **implemented and independently reviewed in a draft branch; not merged or deployed** (2026-10-22). See [implementation review and verification](../reviews/75-field-kit-implementation-review.md). This spec replaces the outline in [the proposal](proposed/field-kit.md). The [source audit](../source-audits/75-field-kit.md) records the checked sources and rejected curriculum claims.

## Purpose and source boundary

The town's helpers leave five cards after the storm. Each card invites an adult and child to try a small activity with real materials or a real view beside a familiar supplied-model game. Reading the card together is worthwhile even when the activity is unavailable. The screen cannot see a jug, plant, handwritten notice, weather or walk. It never asks for a result or treats an adult report as an on-screen independent attempt.

The five cards are a complete first pack, always open in any order. No score, rank, streak, deadline, reminder, reward, prerequisite or claim of learning follows an outcome. The exact child-facing card and neighbor-response text below is the content candidate for independent review. A build must use this approved text or return changed practical copy for content review.

## Route, controls and print

The index is `#field`; cards are `#field/jug`, `#field/cress`, `#field/notice`, `#field/weather` and `#field/walk`. Each host page links to its card, and each card links back to its host. The index lists all five titles and hosts, plus a native history fold with every readable saved entry in array order. This keeps a retired mission's frozen title, outcome and response readable after its card disappears. An unknown `#field/<id>` route shows the index and a short notice, without saving anything. Do not add global navigation or a new evidence dashboard. Route and Before/After display state are derived from the hash and current UI; they never create saved state. The five card routes use locally served static assets without external network requests.

Each card shows its title, host link, purpose, materials, steps, safety and one model/real contrast. The active instructions and outcome controls are reachable on a phone before any history. History, when present, sits in a native `details` fold. Buttons and links are native keyboard-operable controls with visible focus and at least 44-pixel targets. The three outcome buttons say **Adult: We did it**, **Adult: It surprised us**, **Adult: Not today**. The first two mean the real activity was attempted, as the adult reports; they do not certify exact steps, findings or surprise relative to the game's model. **Not today** is a complete choice after reading, talking, missing materials or an unavailable view. A visible sentence says: “Only an adult chooses what happened away from this screen.”

Each card has a native **Print this card** button calling the browser's local print action. Print CSS on the same page shows title, purpose, materials, steps, safety, model/real contrast and a blank box labeled “Draw or write on paper if you like.” It hides app buttons, history and other pages. Printing and drawing never send or save anything. On-screen content remains complete without print. No generated PDF, upload, photo input or worksheet library.

**We read it together** is a toggle button with a pressed state. Toggling it off before an outcome removes pending `read-together` support. Local narration uses the app's existing user-initiated speech control where available; it never starts automatically or uses a network voice. A small event from the shared speech control marks this card's `narration` support only when its local utterance actually starts; a tap, preview, failed start or unavailable voice does not count. These two uses are kept only in ephemeral UI memory for the open card. If the adult chooses an outcome, the actual support codes used on that visit are copied into that new entry. If they leave without an outcome, nothing is saved. Unavailable narration discloses that fact and adds no `narration` code. Reading support is not evidence that the child decoded the text independently.

## Exact first-pack cards

### `jug`: A real jug and our picture jug

Host: **Measuring Kitchen** (`#cafe/recipes`).

Purpose: “Our picture jug has exact 50 mL steps. Look at how a real jug shows its own marks.”

Materials: “A measuring jug with numbered mL marks, cold tap water and a towel. An adult helps.”

Steps:

1. “Put the jug on a flat, steady surface. Find two numbered mL marks.”
2. “With an adult, pour cold water to one mark. Look level with the water and the mark.”
3. “Say what the jug's marks show. Compare their spacing with our picture's even 50 mL steps.”

Safety: “Use cold tap water. An adult handles glass or heavy jugs. Wipe spills before moving.”

Contrast: “The game has an exact drawn scale; this jug is real and may have different marks.”

If materials are missing: “You can read and talk about our picture today. Choose Not today for the real-jug mission.”

### `cress`: Two pots, two kinds of light

Host: **Seedling Study** (`#living/plants`).

Purpose: “Our garden game uses invented plant numbers. Watch two real pots without sending their results here.”

Materials: “Two clean small containers, cotton wool or folded kitchen paper, untreated garden-cress seed sold for growing and water. An adult helps.”

Steps:

1. “Put the same damp cotton or folded paper in both containers. Sprinkle a few cress seeds on each.”
2. “Keep one pot near a bright indoor window. Put the other in a dimmer indoor spot, not a closed cupboard.”
3. “Keep both beds damp, not flooded. Look together over several days; growth may take time.”
4. “Tell each other what you notice. You do not need to measure, photograph or report it here.”

Safety: “Use untreated seed. Seeds and these experiment plants are not for eating. An adult keeps the seed packet. If mold appears, an adult throws the bed away. Wash hands after handling seed or growing material.”

Contrast: “The game's plant lengths are supplied; your two pots may grow in ways the game cannot predict.”

If materials are missing: “Read or talk about the game plants. Choose Not today for real sowing.”

### `notice`: A café notice by hand

Host: **Post Office Letters** (`#post/letters`).

Purpose: “A real reader can tell you whether a handwritten notice makes sense to them.”

Materials: “Paper and a pencil or crayon. An adult can help write or read.”

Steps:

1. “Make a short notice for an imaginary café board, such as ‘Soup today.’”
2. “Write it yourself or copy words with help. Show the paper to your adult reader.”
3. “Ask what the reader understands. You may change one word if you want.”

Safety: “Use ordinary paper and a pencil or crayon. An adult chooses a comfortable place to work.”

Contrast: “The game arranges supplied screen words; this paper is your own mark-making for a reader.”

If materials are missing: “Talk about what a café notice might say. Choose Not today for the paper mission.”

### `weather`: Three weather windows

Host: **Rain Paths** (`#science/rain`).

Purpose: “Our rain game moves invented rain tokens. An available window can show today's real weather.”

Materials: “A safe window view with an adult. No other equipment is needed.”

Steps:

1. “On an available day, look through the closed window together.”
2. “Say one word for weather you can see, such as sunny, cloudy, rainy, windy or foggy.”
3. “If you like, look on one or two other days. Each day can be different.”

Safety: “Stay indoors; do not open or climb to a window. Never look straight at the sun. An adult chooses a safe view.”

Contrast: “These are brief real views, not the game's rain tokens or proof of a weather pattern.”

If the view is unavailable: “Read and talk about weather words. Choose Not today for real watching.”

### `walk`: Look, then guess

Host: **Living Garden** (`#living`).

Purpose: “First say what you see. Then name a possible reason as a guess.”

Materials: “An adult-led path walk or a safe window view. No objects need collecting.”

Steps:

1. “Look from a safe window, or walk with an adult on a path.”
2. “Look for a place that appears damp and a place that appears dry. If you see only one, describe that one.”
3. “Say what you see first. Then offer a possible reason and call it a guess.”
4. “Ask whether another reason might fit. You do not need to touch anything.”

Safety: “Stay with the adult on a path away from traffic and water. At a window, do not open or climb to it. Do not touch animals, fungi or unknown plants. Wash hands after an outdoor walk.”

Contrast: “Our garden scene is drawn; a real view gives observations, while reasons remain guesses.”

If no safe view or walk is available: “Talk about the drawn garden. Choose Not today for real looking.”

The window route is a complete version of the walk card. A damp/dry pair may be unavailable; describing one actually seen place still counts as trying the real-looking activity. The card never requires contact with soil, roads, open water or wildlife. No card asks a child to cut, heat, ingest or handle chemicals. The cress pair is a comparison invitation, not a controlled scientific result; the weather windows do not establish a pattern.

## Exact neighbor responses

The response appears after the adult chooses an outcome and remains readable in that entry. Each line is exact story copy. It must not invent what the child saw, measured, wrote or grew.

| Mission | `done`: Adult: We did it | `surprised`: Adult: It surprised us | `not-today`: Adult: Not today |
| --- | --- | --- | --- |
| `jug` | “The café cook sets our picture jug beside your place at the table. ‘Thanks for trying a real one together. What did its marks look like?’” | “The cook leans closer. ‘A surprise is worth talking about. What did you expect to see on the jug?’” | “The cook puts the picture jug back on its shelf. ‘The real jug can wait. We can still read this card together.’” |
| `cress` | “The garden keeper makes room on the sill. ‘You tried the real-pot activity. You can watch any plants at your own pace.’” | “The keeper smiles at the two empty spaces on the sill. ‘Tell someone what surprised you, if you want. I cannot see your pots from here.’” | “The keeper folds the seed card into the box. ‘Seeds can wait. We can talk about the picture garden today.’” |
| `notice` | “The café cook clears a place on the imaginary notice board. ‘You tried making a paper notice. Keep it with you if you like.’” | “The cook turns the empty board toward you. ‘Did your reader understand something unexpected? You can talk it over together.’” | “The cook leaves the imaginary board open. ‘No paper mission today. A spoken idea is welcome too.’” |
| `weather` | “The rain keeper closes the model-rain box. ‘You looked at real weather together. We need not put its words into this game.’” | “The keeper glances toward the window. ‘Weather can surprise us. What did you expect before you looked?’” | “The keeper sets the window card aside. ‘No weather watching today is fine. Our pretend rain stays in its own game.’” |
| `walk` | “The garden keeper points to the drawing, then leaves space for your real view. ‘You tried looking at a real place. What did you notice?’” | “The keeper nods. ‘A surprising view can start a good question. What did you see, and what is still a guess?’” | “The keeper closes the little gate in the drawing. ‘The path or window can wait. We can look at the picture now.’” |

The fictional responses never say that a paper notice was physically pinned in the game, that cress grew, that the weather was a particular kind, or that a walk reached a place. `surprised` means only the adult selected that code; it is not a mismatch with model data. `done` is an attempt report, not step verification. Nothing in a response alters the host game.

## Saved record and recovery

The optional root is `fieldKit: {version: 1, entries: [...]}`. It is absent until the adult chooses one of the three outcomes. `page`, current card, expanded history, support pending before an outcome and print state are ephemeral. A new outcome appends exactly one entry:

```js
{id: 1, mission: {id: 'jug', version: 1, title: 'A real jug and our picture jug'}, outcome: 'done', response: 'The exact supplied response shown for this outcome.', support: []}
```

`id` is a positive safe integer unique among readable entries. Allocate above every positive safe integer id present in readable or preserved raw entries; if no safe next id exists, refuse the new outcome with a clear message and preserve existing data. `mission` is a bounded own-source snapshot: a nonempty printable id string of at most 80 characters, positive safe version and nonempty printable title string of at most 160 characters. These bounds protect rendering; they do not compare with today's catalog. The five new entries use the exact mission IDs/titles above and version 1. Historical entries validate against their own frozen snapshot, never today's catalog or wording; a retired card stays readable. `response` is the selected authored neighbor response copied at the same explicit action, a nonempty printable string of at most 600 characters. Historical entries show this saved response, never today’s response catalog; a retired mission still has its reply. This is supplied story text, not a field for the adult to type. `outcome` is one of the three codes. `support` is a unique subset of `read-together` and `narration`. It records help used on this card visit, not help offered, and never changes earlier entries.

At most 24 **readable** entries appear in history. If an imported version-1 array has more than 24 otherwise valid entries, keep the newest 24 readable and keep older overflow entries verbatim in the escaped earlier-records fold and export; viewing never deletes them. Before appending when 24 are already readable, the card states the frozen title and outcome label of the first readable entry in array order that this explicit action will remove. Preserve raw siblings. Never trim on view, route, print, import or reload. After an outcome, show its saved reply and a native “Try this card again” button. The outcome buttons are no longer active for that turn, so a double tap cannot add a second entry. Try again resets ephemeral support and opens a new Before/After turn; it creates no entry. Repeating a card then appends a new outcome only when an adult selects one. No timestamps, dates, streaks, measurements, names, locations, handwriting, weather words, plant data, photographs, free text or result fields are stored.

Validate the root version and each entry separately. Unknown root versions remain preserved as their original JSON value and unavailable with a recovery/export route; no entry is inserted into them. For a version-1 root with an `entries` array, retain valid entries and preserve invalid, duplicate or future-shaped entries verbatim in an escaped earlier-records fold and JSON export. An invalid sibling does not hide valid work. A malformed entry's id, even if unusable for display, still participates in next-id exhaustion protection when it is a safe positive integer. A version-1 root without an entries array is unsupported as a whole. While a root is unsupported or the next id is exhausted, replace the outcome controls with a clear unavailable/recovery notice. Never rewrite accepted historical outcomes based on current card text or imagined physical results. A user can choose “Keep earlier record and continue” for an unsupported root. Only this explicit action replaces the active root with `{version:1, entries:[], recovered: originalRawRoot}`. The optional `recovered` payload is preserved verbatim in notes/export; opening or printing never triggers recovery. Reset through the existing explorer reset deletes this optional root; save-off leaves it in memory only.

Grown-up notes label saved entries **“adult-reported offscreen; not a measurement or attainment.”** The existing local JSON export preserves the `fieldKit` root with its frozen entries and raw recovered data; it does not add a label field or measured-result claim to each entry. The Field Kit never updates Café stock, seedling state, rain-model data, Garden progress, suggested destinations or any other game's evidence. No upload, sharing, model transmission or family identifier.

## Curriculum and implementation gates

No new Marble atlas rows follow from these adult outcome codes. The cards offer practical opportunities, but the app neither sees the work nor records a measurement, writing sample, weather word or observation. The seven candidate topics in the proposal are individually disposed in the [source audit](../source-audits/75-field-kit.md). Existing model-game references remain scoped to their model games; they must not be copied onto Field Kit outcomes. No Jane code, lesson prose, art or mastery system is adopted.

The [independent specification and content review](../reviews/75-field-kit-spec-review.md) required six focused repairs now folded here. Implementation needs meaningful synthetic core tests and browser checks: all five routes and host links; retired history on the index; print includes complete card and creates no state; native keyboard and actual-start narration controls; no root on view/reload/print/support alone; all fifteen responses and support snapshots; missing-material **Not today**; named 24-entry notice and explicit trim; frozen retired/sixth-card title and selected response; double-tap outcome creates one entry; explicit replay resets pending support; per-entry recovery, duplicates and unknown root; export/import/save-off/reset; escaping and isolation; phone layout and focus. Browser proof must exercise a real print-preview path or inspect print media CSS with the exact card sections visible. Independent implementation review precedes a draft PR. The draft implementation has completed those review and verification gates; publishing the live game remains a separate step.

Success establishes only that the app can offer and preserve an adult-reported offscreen invitation. It cannot establish what occurred away from the screen, physical measuring or growing competence, handwriting quality, an actual weather pattern or educational gain.
