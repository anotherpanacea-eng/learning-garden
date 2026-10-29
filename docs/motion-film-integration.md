# Motion film takes: integration notes for Codex

Handoff note, 2026-10-29. This is not a spec and commissions no build. It records which Motion film takes exist, which take is the default, and what each film still needs before any runtime slice may use it. [Story milestones and films](story-milestones-and-films.md) owns the delivery and integration contract; spec 120 owns the story; each film's owning spec owns its trigger. Nothing here changes those owners.

## What exists

Eleven silent films, two takes each, made in Claude Motion on 2026-10-27/28 and exported to MP4. Every film is 1280×720 with captions burned in, and an SRT beside each take carries the same captions at the same times. No film has narration, music or images of real people.

All files are in the owner's Dropbox, not in this repository:

- MP4s: `81.11 Repo fleet/learning-garden-media/motion-exports-2026-10-28/<film>-take-1.mp4` and `-take-2.mp4`.
- SRTs and the producer README: `learning-garden-media/oca15-17-motion-2026-10-27/`.
- Editable source (each film's `cut.js`, scene modules and fonts) and an offline copy of the Motion player: `learning-garden-media/motion-film-source-2026-10-28/`.

**Default take:** the owner reviewed both takes and found both usable. Use **take 2** by default and keep take 1 as the alternate. A later owner note can swap a single film.

| Film | Kind | Owning spec | Owning runtime slice | Length (take 2) |
| --- | --- | --- | --- | --- |
| A Town of Our Own | Act II ending | [248](specs/248-a-town-of-our-own.md), spec 120 | Delivered (PR206, still/text ending) | 52 s |
| Both Ways Across Willow Bridge | Act III ending | spec 120 §10 | Not built | 50 s |
| The Map We Changed | Act IV ending | spec 120 | Not built | 49 s |
| A Question of Our Own | Act V ending | spec 120 | Not built | 52 s |
| The Opening of the Ways | Act VI ending | spec 120 | Not built | 61 s |
| Sound as a wave | Process clip | [146](specs/146-bell-and-drum.md) | Proposed spec only | 36 s |
| The mill wheel: where the energy goes | Process clip | [147](specs/147-mills-energy.md) | Proposed spec only | 32 s |
| The water cycle at the weather station | Process clip | [140](specs/140-weather-station.md) | Proposed spec only | 37 s |
| Closed and open circuit | Process clip | [163](specs/163-sparks-and-switches.md) | Proposed spec only | 35 s |
| Particles as ice melts | Process clip | [168](specs/168-little-drawers.md) | Proposed spec only | 35 s |
| Ramp and lever | Process clip | [154](specs/154-ramps-levers-hoist.md) | Proposed spec only | 38 s |

## What is ready now

**A Town of Our Own** has an already-built story ending. [299](specs/299-town-film.md) commissions its optional inline native video, retaining the complete still/text ending. The native player is implemented through PR240, with the hosted transport repair in PR241; their release receipts record reviewed canonical acceptance separately from source availability.

Several science clips also have partial homes already: Water Lab includes melting and evaporation; Lantern Circuit teaches complete/open paths; Bell Studio includes pitch. Review a finite extension and its model, captions and shown examples before attaching a clip. Whole proposed science packs are not prerequisites for these smaller integrations. Ramp Fair Test does not yet teach the ramp/lever film's force–distance trade-off; that needs a new simple-machines operation. Mill energy likewise needs an energy-transfer model. Later story films still wait for actual chapter contracts and story actions.

## Integration requirements for any of these films

These restate the contract in the films brief as it applies to these files.

1. **Optional presentation.** The film is never a prerequisite. The existing still/text ending stays complete, and Skip, Escape, reduced motion and a missing file all leave the full ending readable. The existing iframe player records opened/skipped presentation separately from story; the299 inline pilot writes no viewing record at all. Neither is evidence of reading or understanding.
2. **Delivery format needs a decision.** The game's player (`FILMS` in `dist/app.mjs`) opens a same-origin, self-contained HTML page in an iframe and listens for `garden-film-finished`. These films do not fit that as delivered:
   - The **MP4s** need the separately reviewed media adapter the brief already calls for. An MP4 cannot simply replace an HTML iframe source.
   - The **Motion source** renders in the Motion player, but that player loads its Google fonts over the network, which the no-runtime-fetch rule forbids. A self-contained HTML route would need the bundled font files wired into each film's `scenes.json` (untried), plus a rights check on the player code itself.
   Chosen for299: a small inline native MP4 adapter inside the existing celebration. It does not alter the four HTML iframe films, global filmSeen records or automatic opening behavior.
3. **Captions and text alternative.** The captions are burned into the picture, so the SRT supplies the transcript. The adapter or page must offer that transcript as readable text and must not rely on the burned-in captions as the only route.
4. **Poster still.** None was exported. Take one representative frame per film from the MP4, or reuse the slice's existing illustration.
5. **No sound.** All films are silent, so the sound-joining rules do not apply until a separately approved score or narration exists.
6. **Story review before use.** Check each film against spec 120's names and reveal order before it ships. The producer README notes invented characters drawn in the house style where spec 120 has no character sheets. It also notes two shot-level choices that need story review: Act IV pins the note beside all three plans so none looks favoured, and Act VI shows Vadoalto's runner only from behind.
7. **Exposure.** The process clips show worked examples. Each owning slice must count the exact examples a clip shows before any later task is called unfamiliar.
8. **Checks before acceptance.** Silent, reduced-motion and transcript routes; keyboard and touch; pause, replay and skip; old-save behavior; 320/820 widths; and a real iPad/Safari check before any device claim.

## Owner-requested media integration turn · 2026-10-29

1. [299 · Town film](specs/299-town-film.md), implemented through PR240/241 (see release receipts): owner-selected take2 at the built ActII celebration. Silent, explicit tap, readable transcript, complete still/text fallback; no new completion record.
2. [300 · Fill the Bar](specs/300-fill-the-bar.md) in Rhythm Studio: actual authoring MP4 already has the handdrawn picture and approved AAC mix. The reviewed finite commission adds a controllable song turn, readable patterns/lyrics, separate offered/requested support, frozen per-check notes and sound joining at the current position. Delivered through [PR242](https://github.com/anotherpanacea-eng/learning-garden/pull/242#issuecomment-6497042150); source inventory and nominal musical model remain distinct from audible/physical-device proof.
3. Bounded process-clip integrations: melting/evaporation in Water Lab, complete/open paths in Lantern Circuit, amplitude/frequency in Bell Studio. Each gets a content/model and exposure review. None is already cleared by having an exported MP4.
4. Simple machines force–distance investigation for ramp/lever, then energy transfer for the mill. Make the animation explain something the learner can vary and inspect.
5. ActIII reciprocal exchange/return to earn Both Ways Across Willow Bridge; later IV–VI endings follow their real chapter actions. Preserve the ActVI runner reveal; no general future-film gallery.

Actual take2 durations verified from exports:52,50,49,52,61seconds for ActsII–VI;36sound,32mill,37water cycle,35circuit,35melting,38ramp/lever. All are silent1280×720 H264. Both Fill the Bar pictures are about125seconds and have audio. Caption reading and sampled-frame inspection are not a full continuous viewing or listening review.

## Ice and warmth301 · model first, film repair required

[301](specs/301-water-phase.md) commissions a six-stage manual pure-water model beside the built melt explanation: energy transfer, melting/freezing, temperature plateau, stable particle identities and a closed-water boundary. It is visit-local supplied teaching, with no assessment or saved outcome. The silent melting take2 is **withheld** after actual sampled-picture review found overlapping liquid particles and an unclear return to ordered ice. Before integration, repair those pictures, retain count/identity/size and review the actual corrected frames/captions independently. The original export's existence and optional framing are not clearance. No film/MP4/player is shipped by301. The manual model was delivered through [PR243](https://github.com/anotherpanacea-eng/learning-garden/pull/243#issuecomment-6498223189), with the stylesheet-readiness test repair in PR244:668 matching hosted files preceded2536 canonical native checks. Other media queue order remains unchanged.

## Switch Table302 · edited excerpt under review

[302](specs/302-switch-table.md) proposes a finite one-/two-switch series-loop table and a19.6-second **edited excerpt** from the supplied circuit film. Actual review found the original35s export says “Closed” while its switch is open around7–9s. The derivative omits mismatched transitions and ambiguous diagram scenes, repeats settled open/closed examples for reading, and is independently reviewed as a distinct cut. The original full export remains uncleared. Different switch positions, two-switch AND behavior and sketch/symbol equivalence belong to the new original interactive model, not to omitted movie scenes. This is neither full163 nor a live302 release claim.

## Sound Window303 · full corrected film under review

[303](specs/303-sound-window.md) proposes a fixed-scale two-parameter computer-signal comparison beside Bell Studio, with an optional full36-second corrected **Sound as a wave** film. Actual source review found an oversized amplitude bracket and overlapping label in original take2. A private offline re-render removes that bracket, moves labels and corrects “shorter free end” and air acting on the drum. All scenes/cue times remain; only the separately reviewed derivative may ship. Runtime contains no Motion player/font binaries. This is not the full proposed146 pack or a live303 claim.

[Switch Table302](specs/302-switch-table.md) is delivered through [PR245](https://github.com/anotherpanacea-eng/learning-garden/pull/245#issuecomment-6499613216):673 matching deployed files preceded1953 canonical native checks. Its19.6s circuit cut remains explicitly an excerpt; the original full35s export is unshipped.
