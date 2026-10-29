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

Only **A Town of Our Own** has a built place to go. Spec 248 already delivers its ending as an illustrated still/text sequence and says a future film enhances that same ending and never replaces it. The other ten films wait on their owning slices. Until then they stay in Dropbox as provisional work, as the roadmap timing table allows.

## Integration requirements for any of these films

These restate the contract in the films brief as it applies to these files.

1. **Optional presentation.** The film is never a prerequisite. The existing still/text ending stays complete, and Skip, Escape, reduced motion and a missing file all leave the full ending readable. Watching records nothing beyond the current player's opened/skipped distinction; it is not evidence of reading or understanding.
2. **Delivery format needs a decision.** The game's player (`FILMS` in `dist/app.mjs`) opens a same-origin, self-contained HTML page in an iframe and listens for `garden-film-finished`. These films do not fit that as delivered:
   - The **MP4s** need the separately reviewed media adapter the brief already calls for. An MP4 cannot simply replace an HTML iframe source.
   - The **Motion source** renders in the Motion player, but that player loads its Google fonts over the network, which the no-runtime-fetch rule forbids. A self-contained HTML route would need the bundled font files wired into each film's `scenes.json` (untried), plus a rights check on the player code itself.
   Recommendation: an MP4 adapter, since the MP4s are the final exported picture and there is only one film to integrate now.
3. **Captions and text alternative.** The captions are burned into the picture, so the SRT supplies the transcript. The adapter or page must offer that transcript as readable text and must not rely on the burned-in captions as the only route.
4. **Poster still.** None was exported. Take one representative frame per film from the MP4, or reuse the slice's existing illustration.
5. **No sound.** All films are silent, so the sound-joining rules do not apply until a separately approved score or narration exists.
6. **Story review before use.** Check each film against spec 120's names and reveal order before it ships. The producer README notes invented characters drawn in the house style where spec 120 has no character sheets. It also notes two shot-level choices that need story review: Act IV pins the note beside all three plans so none looks favoured, and Act VI shows Vadoalto's runner only from behind.
7. **Exposure.** The process clips show worked examples. Each owning slice must count the exact examples a clip shows before any later task is called unfamiliar.
8. **Checks before acceptance.** Silent, reduced-motion and transcript routes; keyboard and touch; pause, replay and skip; old-save behavior; 320/820 widths; and a real iPad/Safari check before any device claim.

## Suggested order

1. Decide the delivery format (item 2).
2. Commission the A Town of Our Own integration as a small runtime slice under spec 248, using take 2.
3. Attach each later film to its owning slice when that slice is commissioned. Do not build them ahead of it.
