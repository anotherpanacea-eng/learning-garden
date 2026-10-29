# 299 · The town celebration, in motion

Proposed 2026-10-29. Bounded optional presentation under spec248, not a new chapter, assessment, player framework or changed story trigger.

## Problem and delivery

The exported *A Town of Our Own*, take2, has a built home at `#almanac/celebration`. Add a tap-to-play native video there. Keep the complete existing still, Short/Longer text, listening option, explicit Page2 reveal and later onward letter actions. Show the film invitation only when `actTwoView(state).celebrationAvailable` is true, including inherited ActII context; watching never earns an ending, offer, page or skill. Existing saved literal endings remain valid without recounting today's chapters. It is a fictional town evening, not a reconstruction of the learner's particular contributions.

## Asset and format

Deliver only this film's same-origin MP4, VTT and representative poster. Default take2 is owner selected. A web delivery copy may be reencoded with unchanged 52s duration, picture order, 1280×720 dimensions and 30fps; inspect quality and actual H264/yuv420p decoding. Original remains in the owner's media archive. It is silent: no Sound control or narration claim. No third-party Motion runtime, fonts, telemetry or remote request. Source captions and transcript are in the content packet; no invented dialogue. Do not copy later-act films into dist.

Use a small Town-specific `dist/town-film.mjs` component and existing act-two styles. This is a separately reviewed native MP4 adapter, not a replacement for the four existing HTML iframe films in `app.mjs`. No new FILMS key, filmSeen flag, notebook schema, exposure record or persistent setting. Video viewing makes zero save calls. Later process clips and Fill the Bar require their own model/example exposure and media review.

## Interaction and lifecycle

An initially collapsed Watch the celebration film button reveals an inline player on explicit activation. No video src or preload download before activation. Native controls and playsinline plus visible 44px Play/Pause, Replay and Hide film controls; use a polite status only for explicit operation failures. Play starts from the current position; only Replay resets time to zero. Hide pauses and preserves currentTime within the visit; opening again resumes on request. Ending leaves the final frame and Replay available; it never advances the story. Escape hides and pauses while focus is inside this player. Return focus to the Watch button on Hide/Escape.

Always expose a readable full transcript through a details disclosure, including before playback and if media fails. During playback show large readable current caption text outside the picture, deriving cues from the delivered local VTT, without an aria-live stream; retain the last cue at ended and reserve caption space during gaps; burned-in text is not the only route. Native caption track may be hidden to avoid duplication. If track fails, show an instruction to use the transcript; if video errors or play rejects, keep text and onward actions accessible with a useful visible message. No false completed/watched label. No autoplay on navigation, regardless of motion preference.

Bind only the current connected ActII root, captured route, story object and active explorer. Reuse bindActTwo's current-root/owner predicate. Teardown pauses and removes media listeners on every app render; route changes, explorer replacement, hidden documents and pagehide also stop playback. Detached controls and late play promises may not restart sound/motion or change the current view. A hidden return never automatically resumes. Pausing is harmless if a current local owner is absent. Existing story artifact actions remain owned by act-two-core.

## Verification and scope

Root source checks verify availability, exact transcript/VTT correspondence, no notebook writes and no changes to generic films. Native Chrome journeys cover a real three-offer celebration, literal older ending and inherited context, unreached state, play/time progress, cue text, pause, replay, hide/resume, rejection/error fallbacks, route/render/profile/visibility departure and stale controls, all without story advancement or save calls from playback. Check touch layouts at320/820/1024 and reduced motion; keep existing ActII and ending-film suites. Codec probe and inspected delivery frames supplement source tests; a magic-header check alone is not decoding proof. Verify merged deployed bytes before hosted browser replay. Physical iPad/Safari and audible/screen-reader output remain unverified until actually tested. The film has no audio.

Independent six-lens spec review and separate Claude story/media content review precede implementation; exact candidate Claude implementation review precedes merge/deploy. No broader media framework or science pack is part of299.

## Explicit story-owner amendments

This reviewed299 addendum supersedes the dated no-film availability statements in120§17 and249§6 only for this optional native Town presentation. Inherited arrival keeps its Before-you-came label above the player. Watching adds no scene, read record or actual offer/ending. Rights, captions and implementation remain299-owned; all other120/249 story and arrival rules remain.
