# 03 — Storm Workshop

**Status: Planned; not implemented.**

## Goal and play loop

Investigate an original ramp-and-cart model carrying pretend garden post. Ask what to change, optionally predict, change one variable, release the cart with a button, inspect where it stops, repeat, and compare. The child controls each step and can pause, revise an explanation, or leave without completing a comparison.

## Content minimum and model

Provide one illustrated apparatus: one cart, three ramp heights, and two landing-surface settings. At an experiment’s start, choose height or surface as the variable; keep the other setting, cart, and release procedure unchanged within that comparison. A new experiment can choose differently. Show changed and held settings explicitly.

Author six configuration records with three short trial outcomes each, bounded to whole-number distances of 0–30 model centimetres. Independently review their internal consistency and accompanying explanation before implementation. These are **illustrative, authored model results, not measured physical data**; display that distinction beside results. Repeating a configuration replays its declared three-trial sequence rather than inventing measurements. Offer manual stepping, side-by-side stopping marks, and a table of trial distances. Compare trials without averaging being compulsory. Explanations describe this model only. Invite an optional paper ramp sketch with a changed-variable label; physical testing is unnecessary.

## State and evidence

A versioned `workshop` extension stores experiment settings, optional prediction choice, current trial/step, comparison records, and support. Retain the latest 24 experiments. Predictions and spoken explanations are unscored. Record configuration comparisons as practice, not demonstrated experimental competence. Reading observation remains separate; project acknowledgement proves no construction. Preserve legacy storage keys and records, pause/reload, saving-off, export/reset, and conservative recovery; rendering never starts a trial.

## Accessibility, privacy, and non-goals

All actions use labelled touch/keyboard controls, with text descriptions, visible focus, no required animation, and child-paced visual explanations. Guides have equal competence; avatar choice stays independent. No timers, grades, locks, real tools, identity fields, learner uploads, shared records, analytics, server/AI backend, physics engine, or new platform.

## Acceptance and dependencies

Test every setting/trial, changed-versus-held variables, repeat reproducibility, comparison labels, skip/resume, support retention, storage behavior, and small screens. Refresh [NGSS 3–5-ETS1-3](https://www.nextgenscience.org/pe/3-5-ets1-3-engineering-design) before authoring: controlled comparisons and repeated trials inform the design; model play does not certify the standard. Refresh any [Marble links](https://github.com/withmarbleapp/os-taxonomy). Obtain independent spec/content/implementation review and root QA; use the existing Site and draft PR, with exact-candidate Claude clearance before merge.
