# Spec 346 · The water cycle ring at Dot's weather station

**Status: independently reviewed finite commission (LG-38 authoring; runtime under LG-1), implementation in qualification.** It adds one drawn, stepped water-cycle ring to the existing [281](281-weather-tallies.md) weather page, then attaches the existing water-cycle process clip beside it under the film rules in [motion-film-integration.md](../motion-film-integration.md). Model first, film second: the ring is the teaching, and the clip is an optional retelling of a picture the learner has already been able to step through. Exact text: [water cycle ring](../content/346-water-cycle-ring-text.md). Nothing here saves anything.

This narrows [140](140-weather-station.md) bench (b) to a demonstration only. 140's drag-onto-the-ring ordering task, its clouds card, its Roof-or-field card and the rest of the Old Weather Station stay proposed and uncommissioned.

## Teaching and boundary

Water in the brook and the ground evaporates into invisible water vapor. The vapor rises, cools and condenses into tiny drops, and many drops make a cloud. Tiny drops join into raindrops that fall, and in cold clouds ice crystals grow into snow. The rain collects in the brook and soaks into the ground. The ring has no start and no end, and the water is not used up: it changes form and place.

This is supplied teaching, a simplified picture. It is not a weather forecast, a measurement, an experiment or a claim about how long any stage takes. The ring does not say that every drop follows this path. The boundary note says that real water takes many more paths. It does not teach clouds' names, the energy involved, ocean/atmosphere transport in detail, transpiration, groundwater flow or ice sheets. The permanent boundary names sea/wind transport explicitly so the local example cannot imply all local rain is local brook water returning.

The ring sits beside the weather note and the tallies, which stay unchanged. Its exact boundary note is weather-page markup immediately beneath the drawn-howto element, visible both while the picture is open and after Close; the existing player needs no new field. A weather report is what the explorer noticed; the ring is an explanation the explorer is shown. Neither one reads, writes or infers the other. Choosing **rain** in a weather note does not open, suggest or unlock the ring, and stepping through the ring adds no weather note.

## Where it appears

On `#almanac/weather`, immediately before the existing Refresh-the-date/tallies action block, outside the conditional editable-note fragment, an optional section **Where the rain comes from** holds a one-line framing and the button **Show me the water cycle**. That button opens the drawn ring through the existing drawn how-to player (`drawn-howto.mjs`, with the `ring` layout that `life-ring` already uses). The section is the same for every explorer, every date and every saved state, including weather writes being unavailable, a malformed `weather` root or an empty month. `#almanac/tallies` and the practice month are unchanged.

## The drawn ring

One new entry in `drawn-howtos-content.mjs`, `{version:1, id:'water-ring', ...}`, uses the `ring` form:

- Four stages, placed on the ring in this order: `water` (brook and ground water), `vapor` (water vapor), `cloud` (cloud drops) and `rain` (rain or snow).
- Four links, each one labelled with what happens, in the same words as the film's loop labels: `water-vapor` evaporate, `vapor-cloud` condense, `cloud-rain` fall, and `rain-water` collect.
- Six steps with the exact captions in the text file, each 15 words or fewer. Step 1 draws `water` alone. Steps 2 to 4 each draw the incoming link and its stage (`water-vapor` and `vapor`, `vapor-cloud` and `cloud`, `cloud-rain` and `rain`). Step 5 draws the closing link `rain-water`, and step 6 is the lap. Every stage and link is drawn exactly once, as the drawn how-to check requires.

**Vapor is invisible.** The vapor stage is drawn as an unfilled short-dashed outline with its label, and never as a white puff, steam or a cloud, so that the picture does not teach that vapor is visible. The cloud stage is the first visible water above the ground and shows tiny drops with a few ice crystals. The rain stage shows raindrops and a few flakes, so snow is in the picture as well as in the words. Snow is drawn growing from ice crystals, never from a liquid drop.

The entry is hand-placed, like `life-ring`: it has no `at` route, so the page heading never offers it a second time, and the how-to check's list of hand-placed ids gains `water-ring`. Its picture is at most 500 wide and its play-through lasts at most 15 s, the player's existing limits. The ring is laid out clockwise on an authored ellipse, using its ring-specific +π/2 starting angle (water below, cloud above), so it reads as a loop rather than a line with a return arrow. The authoring script renders it from that frozen data with a fixed seed, and its existing check confirms that the output matches the source. The authoring script's ring builder (`ring()` in `scripts/drawn-howtos/build.mjs`) draws every stage as a generic stadium with its label through `nodeParts`, so a content entry alone cannot supply these pictures. The build makes one bounded authoring-stroke extension there: optional marks on a ring stage in the frozen data (an unfilled short-dashed outline for vapor replacing, not overlaying, its normal wash and solid outline; small drop and ice-crystal strokes for cloud; raindrop and flake strokes for rain). The frozen ring supplies a marks map keyed by stage id (`water`, `vapor`, `cloud`, `rain`). All four boxes are 88px high. The water mark is a shallow brook/ground line with short water ripples; it is a landscape symbol, not a particle model. Marked boxes reserve an upper icon band (10–32px from top) and a separate lower label band (baseline about 64px, box height88px). Vapor has no wash/background and its outline uses separated short dashes rather than a filled puff. This ring alone uses horizontal radius120px, vertical radius180px and starting angle +π/2: water at the bottom, vapor on the left rising, cloud at the top, rain on the right falling. Link labels use inside anchors chosen from actual rendered bounds to clear arcs, lap and boxes; do not freeze the earlier 0.7 factor; the old life ring remains unchanged. Inspect actual generated label/mark bounds for separation, not just reproducibility. They are drawn with the script's existing pencil and dash helpers into that stage's own part, so each stage is still drawn exactly once. The output stroke format and player stay as they are; the old life-ring layout stays unchanged. The ring needs no new player, layout engine or runtime dependency.

The player's existing behavior applies unchanged. Steps play once, then Back and Next revisit them, and the finished picture stays with every caption listed beneath it. Watch again restarts it, and Close returns focus to the button. Reduced motion opens on complete strokes. The picture is `role="img"`, its label is the alt text, and captions go to the player's polite live region. Nothing it does is recorded as support, familiarity or viewing.

## The film

The clip is **The water cycle at the weather station**, take 2, 37 s, silent, 1280×720, with captions burned in. It is in the owner's Dropbox under `81.11 Repo fleet/learning-garden-media/` and is not in this repository. It is attached only after it passes the picture and caption gate below, and it is never a prerequisite for anything.

Below the ring section, an optional **Watch the water cycle film** invitation explains that the film tells the same loop in moving pictures and that the ring is complete without it. Watch opens a native modal movie turn on the same route, leaving the weather DOM and its custom-element ring in place with a pre-film line, native controls, 44 px Play/Pause, Replay, Retry loading and **Back to the weather page**. Return and Escape restore focus to the invitation. Nothing plays on weather-page entry or reload, and nothing is fetched before Watch. Watch loads and plays once unless reduced motion is enabled; reduced motion and Retry load without autoplay. Reduced motion leaves the poster still until Play. No Sound button, voice or music is offered.

The complete transcript, from the accepted derivative’s public cue list converted to VTT, is always readable, including after a failed fetch, track or codec. Opening it pauses the film. A current-caption paragraph outside the video follows the exact cue windows without fades or `aria-live`. The poster is one representative frame taken from the reviewed MP4.

The film records nothing: no viewing, finished or skipped flag, exposure, familiarity, time spent or skill. Its absence never means an example is unfamiliar.

### Picture and caption gate (before any integration)

Read every caption against the ring's exact text, and inspect the full-resolution frames at each cue. The clip is held back, or a corrected derivative is made the way [304](304-water-film.md) did, if it:

1. draws vapor as visible steam, a white puff or a cloud, or calls the visible cloud "vapor";
2. says or shows water being used up, made or destroyed, or the Sun "making" rain;
3. shows a fixed starting point or an end, rather than a loop;
4. shows instrument readings, numbers or dates that read as a measurement, a forecast or one of the explorer's weather notes;
5. names or draws story characters in a way that conflicts with [spec 120](120-keeper-of-the-ways.md)'s names and reveal order.

The gate's review records which worked examples the clip shows, such as a puddle, a brook, a roof or a hill, so that a later task can count them before calling an example unfamiliar. Any corrected derivative keeps all 37 s and every cue window. The original take stays unchanged. Its authoring is private: public delivery contains only the reviewed MP4, poster, VTT, and original application code and copy.

### Reading of take 2 before the gate (2026-11-01)

This original reading came from take 2's SRT, scene source and producer READMEs. Root’s 2026-11-06 full-resolution cue-frame inspection is recorded in the source audit. Independent review additionally requires the bounded derivative below before film integration; original take2 is not accepted for publication as-is.

**Scenes.** The clip is five scenes, 7 + 8 + 8 + 8 + 6 = 37.0 s, and has 14 cues. The text file lists them word for word.

1. **Station (0–7 s).** The station draws on: Sun, brook, puddle, tree, flood post, fence, Stevenson screen, rain gauge and wind vane. A magnifier then shows the puddle as liquid water.
2. **Rising air (7–15 s).** The lens follows a dotted rising path. Inside it are only up-arrows, labelled "water vapor: invisible", with no particles, puff or steam.
3. **Cloud (15–23 s).** Tiny blue drops appear in the lens, labelled "tiny liquid drops", while a cloud outline grows.
4. **Rain (23–31 s).** Drops join and fall as rain, and the gauge fills to about half. The red label "a depth, in mm" points to the gauge.
5. **Loop (31–37 s).** Arrows run to the brook, into the ground and to the tree. Three red arcs then close the loop, with the labels evaporate, condense, fall and collect.

Against the gate:

- **Original provisional reading, superseded by the derivative gate below:** Criteria 1–3 and 5 looked met. Vapor is shown as invisible, a cloud is said to be liquid drops, there is no start or end, and "no water used up" is said. No story characters appear.
- **Criterion 4.** The gauge shows no number or scale, and "a depth, in mm" explains what a gauge measures rather than giving a reading. The reviewer still decides whether cue 12 and the filling gauge could read as a measured rainfall or as one of the explorer's weather notes.
- **Loop arrows.** The film's three red arcs run from the puddle to the cloud (evaporate), from the cloud's right edge to the ground (fall), and from the brook to the puddle (collect). The label condense sits alone above the cloud, at the end of the evaporate arc. The ring draws four arrows. The reviewer checks two points: the collect arc runs from the brook up into the puddle, and the fall and collect arcs do not meet, with only the blue runoff arrows joining them. Neither breaks the loop on its own. The earlier offline reading was provisional and is superseded: the uphill collect arc must be repaired and joined to the evaporate start.
- **Snow.** The film shows only rain. The ring's "rain or snow" is the fuller picture, and the film does not contradict it.

**Shown examples, for exposure.** The Sun, a puddle by the station, the brook, the fence, the ground, the tree, the rain gauge, the flood post (three ticks, no numbers), the Stevenson screen and the wind vane. These are the examples a later task counts before calling one unfamiliar.

### Bounded derivative before publication

Keep the original take untouched. Re-render its existing original scene source privately: replace cue 13’s “feeds the tree” with “supplying water to the tree” in both burned-in words and transcript/VTT; redraw the final collect arc downhill from ground into brook, rather than brook up to puddle. Move the evaporate arc’s foot to the same brook point where collect ends, so the explanatory loop closes. Also qualify cue 9 as “This cloud is liquid drops, not vapor.” rather than a false general claim about all clouds. Keep all 37 seconds and cue windows. Original source, player and font files stay private; publish only reviewed MP4/poster/VTT, with original-author attribution and rendered font license credit. Inspect the corrected frames through the whole two repaired intervals, then qualify actual native playback. A frame sample is visual evidence, not a mechanical proof of every intervening image.

### Lifecycle

The local media pattern from `water-phase-film.mjs` (304) and the town film (299) is reused in a new `water-ring-film.mjs`, without a new media framework:

- **Fetch:** one explicit same-origin fetch of the reviewed MP4 becomes a temporary Blob URL, so seeking works on the canonical host.
- **Generation guards** cover the fetch, retry, the play promise and native play events. A late request cannot attach, play or report success for a replaced route, explorer, notebook or turn.
- **Pausing:** hidden and pagehide pause the film and cancel any wanted autoplay. Before the film plays, other media and speech stop through the existing outward stop hooks, and those hooks pause this film on their own paths.
- **Cleanup** aborts the request, removes listeners and the track, pauses, removes `src`, calls `load` and revokes each URL exactly once. A failure or loading state keeps the transcript, Retry and Back. Append the dialog inside the captured weather root. Return calls dialog.close(); native Escape and any forced close converge on its close handler, which stops playback, cancels requests and revokes the Blob, removes the dialog and focuses the still-live Watch button. Global stopWaterRingFilm() also performs idempotent cleanup (without focus) at the top of every app render, before DOM replacement, including same-route redraws; never rely on disconnected dialog emitting close. Close/dispose on root removal or loss of current owner/book/route. Extend stopBell, bellPlayback, rhythmPlayback, rhythm stopTones and all existing direct pauseWaterFilm outward stops to pause this film, plus the real garden-speech-start event. beforeMovie stops the other players and speech without pausing itself.

The film's visit state is visit-local and holds nothing in the notebook. A route, explorer or import change disposes it before the DOM is replaced. Entering and returning from the movie preserves the weather visit’s unsaved choice, date, edit flag, drift/notice, selected month and month disclosure, plus any open ring’s current step. The modal leaves the underlying weather DOM in place; pause the ring’s optional autoplay by clicking its existing toggle only when an open panel exists and the toggle reads Pause, with no automatic restart on Return. If ring art is still loading, do not open the movie: announce “The drawing is loading. Try the film in a moment.” and leave Watch available for retry. This prevents the pending custom-element load from opening/focusing behind the modal. Ordinary weather edits retain the existing full-redraw behavior and may close/reset an open ring; the movie makes no such redraw. Movie state never changes weather session.page. Neither entry nor return writes weather. Return and Escape leave the same route and focus Watch; route departure or owner/notebook replacement closes the movie. Movie controls require current attached root, captured owner/notebook/route and visible enabled controls. A detached or superseded control cannot start playback or replace a newer visit.

## Saved state and preservation

None. The ring and film add no root, field, flag or Notes line, and they never call the weather writer or the `dataDesk` writer. 281's weather and tally readers, validators, caps and routes are unchanged, and so are the route's existing explorer-switch and welcome-film exemptions. Healthy, malformed and unknown `weather` and `dataDesk` entries, and unrelated roots of 500 KiB or more, export byte for byte unchanged after any ring or film use.

## Content references

These are checked during the focused content review before build:

- [USGS Water Science School, "The Water Cycle"](https://www.usgs.gov/water-science-school/science/water-cycle) and ["Condensation and the Water Cycle"](https://www.usgs.gov/water-science-school/science/condensation-and-water-cycle);
- [NOAA, "Water cycle"](https://www.noaa.gov/education/resource-collections/freshwater/water-cycle);
- [NASA Climate Kids, "Water cycle"](https://climatekids.nasa.gov/water-cycle/).

They support the four stages, vapor being invisible, clouds being tiny drops or ice, and the loop having many more real paths. No source prose, art or audio is incorporated.

The Marble topic `mt_Qkewo5M3_c` (Evaporation & the Water Cycle) is already mapped in the atlas to Cold Window. This demonstration adds no coverage claim and no new atlas mapping. The Jane LESSONS.md worked-example rule (one idea, with its steps revealed one at a time) is the design reference, as in the drawn how-to proposal. Nothing from Jane is incorporated.

## Curriculum and story placement

**Upstream refresh.** Refreshed on 2026-11-01 from Code-PC, read-only: Jane at `e88f81a00553fb87818ef84c77a8800f0dcb33e4` and Marble os-taxonomy at `5e23196fa60050433f1440057f65a978d39e63fc`. Jane `LESSONS.md` stays a design reference only (the worked example above). Upstream Marble has grown since the app's pinned slice, but the target's three direct prerequisite edges, their reasons and the four topics' names and descriptions match the pinned slice exactly. Upstream changes only the target's age range end (10, against 9 locally), adds Australian curriculum standard codes to the target and to Heating & Cooling Changes, and recomputes centrality. None of that changes the crosswalk, so the slice is not re-pinned here. The pinned Marble slice in `curriculum/marble/` is the crosswalk source below.

**Marble target and prerequisite crosswalk (spec 49 §8).** The candidate target is `mt_Qkewo5M3_c` (Evaporation & the Water Cycle), as a candidate, not a coverage claim. Its direct prerequisites in `curriculum/marble/dependencies.json`:

| Prerequisite | Strength | What this demonstration supplies | What stays elsewhere or unfinished |
| --- | --- | --- | --- |
| `mt_ahSqW_kK1b` Changes & Separation Vocabulary | hard | The words evaporate and condense used once each, on the arrow where the change happens, beside the picture of the change. | Teaching the process vocabulary as such, with its contrasts and practice. This ring only uses the words in context. |
| `mt_Pl-nsjYGZ3` Heating & Cooling Changes | hard | A worked picture of warming (the Sun on the brook) and cooling (rising air) beside the change each one causes. | The state-change investigations themselves: Water Lab's evaporation mission pictures and Cold Window's condensation and evaporation encounter. Melting, freezing and controlled heating stay with those owners. |
| `mt_fhqVdj4BYr` The Water Cycle | soft | The same four-stage loop, as a picture. | Any curriculum water-cycle lesson beyond this one picture. |

Nothing here locks or unlocks another activity, and the atlas keeps its current Water Lab and Cold Window scopes: the full water cycle stays untaught there, and this demonstration does not change that claim.

**Spec 49 teaching encounter (§5).** The ring supplies only the teaching encounter: one idea at a time, revealed step by step, with Back, Next and replay under the learner's control. It supplies no contrast case, supported practice, new application or purposeful revisit. Those belong to the deferred part of spec 140 bench (b) (the drag-onto-the-ring task) and to later weather and Rain Paths work, and they stay uncommissioned here.

**Six acts and story.** The six-act strand family is S7-II (water cycle; temperature, instruments and local records, [six-act strands](../six-act-strands.md)). In spec 120's story it sits at Dot's weather station, whose job is the town's own weather record. The ring answers the page's question of where rain comes from, beside the records the station already keeps. It changes no story chronology, page reveal or act ending, and it gives no Act IV or Act VI flood answer.

## Current-main refresh · 2026-11-06

Jane `c681f6bf2f2adf2aa032f765983a4691774cfba5` (`LESSONS.md`) and Marble `04962c78ccb8bd52b236512d3362405bace98d2a` (`data/topics.json`, `data/dependencies.json`) have been read afresh. The target and all three direct prerequisite IDs, names, strengths and reasons agree with the local pin. No repin or upstream runtime/content incorporation. The [source audit](../source-audits/346-water-cycle-ring.md) records the narrowed design reference and primary science sources.

## Acceptance

1. **Spec review:** independent spec review, then a focused science and exact-copy check of the ring text, then the film's picture and caption gate. These are separate clearances.
2. **Source checks:**
   - The ring entry's stages, links and captions match the text file exactly, and the authoring output matches its source.
   - The vapor stroke style is not a filled puff.
   - The film’s VTT cues match the public text file’s accepted cue list.
   - Confirm the media with ffprobe (37.000 seconds, H.264 video, no audio stream). Extract the poster directly from that accepted MP4. Use the public text file’s exact cue list as the in-repository VTT reference; do not require private SRT/source for repository checks.
   - Entering the page makes no video request, and the film module is not imported by the weather writer.
3. **Browser checks at 320 and 820 px:**
   - The ring opens, plays, steps Back and Next, replays and closes with focus restored, and reduced motion is respected.
   - The film runs through Watch, Play/Pause, seek, Return and Escape. Its transcript is shown on failure, Retry works, and the Blob URL is disposed.
   - Media and speech stop each other, and hidden and pagehide pause the film.
   - Weather notes save and tallies work before and after both.
   - Notes export and import keep every root unchanged. Compare the complete notebook, not a whitelist of existing roots, and observe zero storage-write calls during ring/film actions after fixture and parent-draft setup. This detects accidental viewing/support records as well as mutation of weather and tallies.
4. **Not claimed:** physical iPad/Safari, screen-reader speech or learning outcomes from Chrome or synthetic checks. Then come the exact-head implementation review, merge and canonical verification.
5. **On landing:** update the water-cycle row in motion-film-integration.md to name this owner.
