# 03 — Storm Workshop

**Status: Implemented; independent spec and implementation reviews complete. GitHub merge remains subject to exact-candidate Claude clearance.**

## Goal and play loop

Investigate an original ramp-and-cart model carrying pretend garden post. Ask what to change, optionally predict, change one variable, release the cart with a button, inspect where it stops, repeat, and compare. The child controls each step and can pause, revise an explanation, or leave without completing a comparison.

## Content minimum and model

Provide one illustrated apparatus: one cart, three ramp heights, and two landing-surface settings. At an experiment’s start, choose height or surface as the variable; keep the other setting, cart, and release procedure unchanged within that comparison. A new experiment can choose differently. Show changed and held settings explicitly.

Author six configuration records with three short trial outcomes each, bounded to whole-number distances of 0–30 model centimetres. Independently review their internal consistency and accompanying explanation before implementation. These are **illustrative, authored model results, not measured physical data**; display that distinction beside results. Repeating a configuration replays its declared three-trial sequence rather than inventing measurements. Offer manual stepping, side-by-side stopping marks, and a table of trial distances. Compare trials without averaging being compulsory. Explanations describe this model only. Invite an optional paper ramp sketch with a changed-variable label; physical testing is unnecessary.

The storm has damaged the garden's parcel ramp. Measure horizontal travel on the landing surface from the ramp's foot, not along the ramp or from the cart's elevated start. The same cart rolls without an added push. Heights are low, middle and high; surfaces are smooth and rough. Model distances (three trials in repeatable order) are low/smooth 12,13,12; low/rough 5,6,5; middle/smooth 19,18,19; middle/rough 9,10,9; high/smooth 26,25,26; high/rough 14,15,14. These illustrate a pattern, not a law or a physically calibrated simulator. Roughness here represents greater resistance to rolling; do not call the effect air resistance. Distances vary between authored trials; the app does not measure or randomly generate them.

Choose which variable to investigate and a fixed setting for the other variable before starting. During that comparison only the chosen variable can change, and settings cannot change halfway through a run. Release, roll to the foot, then reveal the stopping point using manual buttons. Replaying a finished trial changes no results. A new trial explicitly cycles that configuration's three outcomes. Results include a numeric table, a zero-based 0–30 bar graph, and stopping marks sharing one ruler. The cart drawing must agree with its current phase and selected height. Optional predictions can be revised; retain whether a prediction followed an observed result. A short explanation and local read-aloud are optional support. No correctness score is needed for investigation.

## Connected learning invitations

Add a small, original invitation catalog linking Workshop, Water Lab, café, gathering, Number Garden measurement/fractions, and English Paris. Give each connection a child-facing reason (for example, measuring a ramp can lead to measuring a garden border). Use verified Marble IDs and actual prerequisite edges where applicable; mark original thematic bridges separately from taxonomy dependencies. Map only the part practiced by a destination. A text choice or opening a link is not evidence of reading, experimental skill, or topic mastery.

Show a few contextual invitations on those destinations plus an open `#explore` directory, with a Workshop entrance on the home page. All links work before any activity is completed; suggestions do not depend on correctness or unknown learner traits. Choosing an invitation preserves all waiting activity drafts. Parent details show scope, source links, and the distinction between topic matches and authored bridges. Extend the downloadable Marble slice with the selected science/reading/data topics and their direct prerequisites, preserving its current 64 nodes, focus flags, attribution and licenses. Do not claim that context-only prerequisite nodes have playable coverage. A full-taxonomy browser remains a later roadmap increment.

## State and evidence

A versioned `workshop` extension stores experiment settings, optional prediction choice, current trial/step, comparison records, and support. Retain the latest 24 experiments. Predictions and spoken explanations are unscored. Record configuration comparisons as practice, not demonstrated experimental competence. Reading observation remains separate; project acknowledgement proves no construction. Preserve legacy storage keys and records, pause/reload, saving-off, export/reset, and conservative recovery; rendering never starts a trial.

Keep at most 24 completed trials per experiment and one separate pending trial. Per-configuration run counts continue the declared outcome sequence after older rows are removed. Save the selected configuration, distance and model revision for every trial; reloading must retain an unfinished run's exact phase and result. Retain support flags and a separately reported reading mode. Finishing an experiment is optional and a button action; it never requires an explanation or a correct prediction. Earlier experiments remain resumable, and starting another preserves the current one within the stated retention bound. Notes and JSON export disclose these bounds. Do not change existing fact/reading recommendations from Workshop activity or invitation clicks.

An experiment belongs to one model revision. Continue only using that revision's supported configurations. If a future release no longer supports it, keep the exact experiment, completed rows and pending draft/phase/result as closed work, display the reason, and offer a fresh comparison. Do not recompute a pending result or mix model revisions within one experiment.

## Upstream study and reuse

Marble revision `96a7933754af672e1bfdbf7ecb05c325860c6e0d`: reviewed scientific inquiry, measurement, data display and connected-text topic descriptions and prerequisites. Its taxonomy data extends the existing attributed slice. Jane revision `0a2acf3efbf81f00027afd6bdd108c0f89f7c3cc`: studied `LESSONS.md` teach/example/visual formats and `src/engine.js` topic selection. The new experiment, model, invitation prose and UI are original; no new Jane code, lesson text, scores, timers or mastery inference is incorporated. The authored model is needed because neither source provides this local ramp experiment.

## Accessibility, privacy, and non-goals

All actions use labelled touch/keyboard controls, with text descriptions, visible focus, no required animation, and child-paced visual explanations. Guides have equal competence; avatar choice stays independent. No timers, grades, locks, real tools, identity fields, learner uploads, shared records, analytics, server/AI backend, physics engine, or new platform.

## Acceptance and dependencies

Test every setting/trial, changed-versus-held variables, repeat reproducibility, comparison labels, skip/resume, support retention, storage behavior, and small screens. Refresh [NGSS 3–5-ETS1-3](https://www.nextgenscience.org/pe/3-5-ets1-3-engineering-design) before authoring: controlled comparisons and repeated trials inform the design; model play does not certify the standard. Refresh any [Marble links](https://github.com/withmarbleapp/os-taxonomy). Obtain independent spec/content/implementation review and root QA; use the existing Site and draft PR, with exact-candidate Claude clearance before merge.

## Review and verification

Independent spec review required experiment-level model revision recovery; implemented as closed preservation for unsupported models. Independent implementation review verified deterministic outcomes, fixed variables, replay, saved trials, evidence boundaries and exact upstream graph preservation. Root browser QA checked pause/reload, a two-height comparison, prediction disclosure retention, connected directory/map links, preserved café guest/plate, and tablet/phone layouts. The tablet guide placement issue and collapsing prediction/reading panels were repaired. Focused checks cover 335 core cases and 195 invitation/render/storage cases; existing destination checks and story-pack validation remain green. No physical-device Safari test or hosted CI run is claimed.
