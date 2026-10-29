# 303 · Independent specification review

2026-10-29. Six fresh isolated contexts reviewed actual spec/content and relevant app/Bell/player seams before implementation.

| Lens | Result/fold |
| --- | --- |
| Completeness | No P1/P2. P3 “bounded fetch” clarified as one known2730795-byte asset, not an unenforced arbitrary-stream memory guarantee. |
| Dependency/integration | Clear, no P1/P2. Actual lazy audio, early route and recovery/link seams exist. Outward-only callbacks must include new stops in existing Bell/Rhythm/Switch paths without self-cancel. |
| Scope/overlap | Clear, no P1/P2. P3 older146 ownership/gap language is an explicitly dated proposal;303 has a distinct route and finite ownership. Current roadmap, not retroactive rewrite of an old proposal, records delivered work. Future146 must link/extend through its own review. |
| Firewall | Clear, no findings. No learner/microphone uploads, nominal schedule never hearing evidence, no saved-root normalization or novelty inference. |
| Mechanizability | One P2 resolved: stale resume tests require eventual context suspension when no newer request owns audio; older completion cannot suspend a newer request. A synthetic probe of existing Bell exposed why node/timer cancellation alone is insufficient. Bell itself is outside this change. |
| Adversarial | One P2 resolved: marker value strings explicitly name Current versus Held at a shared instant, since values can differ. |

Six-lens result: BUILD-READY after bounded folds, with separate physics/exact-content/corrected-media review completed and bounded copy folds below. The original film’s bracket/label finding is not waived by text; a new full36s derivative was actually rendered from source and requires its own picture review. No app implementation or live release is claimed by this spec-review receipt.

## Independent corrected-film and exact-content review

Claude Opus read the new corrected large/one-second frame sheets, corrected13cueSRT and public spec/copy/source audit. No P1 in corrected pictures or captions; bracket absent, labels uncrowded, corrected sentences match, and qualitative physics fits the stated schematic limits. It requested four P2 copy folds: named Current/Held marker values, phase/rounding/negative-zero formatting, fixed plot headroom with explicit axis labels, and the missing same-pitch/setup amplitude-to-loudness sentence. All are now explicit. “Signal size” is linked to centre-to-peak amplitude; font-license spacing corrected. No full re-review is needed for these small wording/format folds.

The reviewer identified full-resolution checks at9s and21–23s as sampling gaps, not findings. Root inspected the rendered9s and22s frames: push arrow points down; the faster-repetition label is above, not on, the peaks. These are still-frame observations, not continuous-motion proof. Encoding/audio absence/source identity and implementation/native/hosted checks remain separate gates.


## Implementation gate

Claude Opus cleared candidate `e5cdaa549939fd398453e344bdcbc0aa71c06b2a` with no P1/P2, conditional on the native rerun and later hosted release checks. Root completed436 native Sound Window assertions and1953 existing Switch Table native assertions.225 model,62 injected audio,557 Bell core,348 Bell UI,222 Bell audio,3698 Rhythm,106 song and452 Water source assertions passed. Native checks include actual film decode/play/seek and native tone scheduling, not human hearing, physicaliPad/Safari, screen-reader speech or learning effects.

Four P3 folds: marker spoken wording moves from a disallowed paragraph aria-label to a visually hidden text span beside an aria-hidden visual value; marker uses one stable toggle label; complete opening/pause/length-to-frequency caveats are visible; VTT cue times are parsed and checked against all13 reviewed windows and the current-caption array. The implementation diff/final exact-head recheck and final native replay remain necessary after these folds; publication stays separate.
