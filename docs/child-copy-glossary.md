# Words that help someone play

Author guide for lane A. This is the first glossary, not a claim that every current screen has been swept. Start with the thing the player can do or notice now. Keep the learning demand; remove the explanation of our record-keeping from the ordinary turn.

## Names and actions

| Use | Meaning and boundary |
| --- | --- |
| After the Storm | The app/story title. Willowbank is the fictional town, not a second app name. |
| Café, Water Lab, Workshop, Post Office, Number Garden, Word Garden, Story Loft | Existing destinations. Use the visible destination name when sending someone there; do not substitute module names or internal routes in child copy. Back links use the short name (Workshop, Café, Post Office); the home tile keeps the full title (Storm Workshop). |
| Grown-up notes | The existing place for records, downloads, restore and adult interpretation. Keep this label consistent. |
| Check this… | Compare the current response with this task. A match is not a grade, placement, mastery or finished curriculum. |
| Keep this… | Keep a notebook version of this parcel, visit or artifact. Device persistence depends on saving preferences and the actual write result; do not promise saved-on-device if it is only in memory. |
| Another parcel / another investigation | Explicitly choose or create the next task. Preserve earlier work; say when a finite case is familiar. Do not use Next to disguise a destructive reset. |
| Hint / Different example | Optional help for the current idea. Explain how to use it; keep its support history separate in the records. |
| Ready-made sentence / ready-made words | A sentence the activity offers for the player to use or edit, in place of "supplied" in play directions. Its use stays in the support record and Grown-up notes. Keeper's Desk uses it first. |
| English meaning | Optional meaning support for French/Spanish text. It is not a claim that someone independently understood the other language. |
| Grown-up practice notes | Optional explanation of what a task/check/kept record can and cannot establish. Never hide necessary model instructions here. |

## Language choices

Use US spelling in original English UI: color, center, practice, math. Preserve other languages, proper names and exact source quotations. Do not rewrite stored writing, feedback, frozen task prose or historic documents to fit this guide.

Prefer “choose a word piece” to an implementation description. Use a concrete referent when possible: label, plate, route, table, graph, picture or message. Avoid spec vocabulary such as supplied, provenance, recorded as support, supported practice and exportable in ordinary play directions. These can be appropriate in a labelled adult note or an explicitly taught/source-quoted context.

Model, evidence, rate, inference, source and independent are not automatically forbidden words. Teach a useful concept in context. A physics diagram must still say when its numbers are invented, a graph must keep its axis/unit/domain limits, and a source lesson must distinguish an observation from a claim. Moving record caveats is not permission to hide scientific or historical uncertainty.

Do not assign presentation or intellectual ambition by age or gender. A learner can want concrete arithmetic and complex stories, or a beginner’s French sentence about an interesting older-reader topic. Language support and recorded independence stay separate.

## First source check

[Spec315](specs/315-child-copy-first-pass.md) scopes the first pass to Parcel Labels and Linear; the lane A board sweep adds Paired Points, Hinge Bench and Ribbon Measures. The LG-2 text-review sweep adds the shell, garden home, help, progress and Number Garden renderers from the [shell-garden review](reviews/text-review-2026-10-22/shell-garden.md), including `index.html` and the storm film page. Garden Paving's two files stay out of that list because the scan matches only JavaScript identifiers there, not child copy. The science sweep adds the science UI and content renderers from the [science review](reviews/text-review-2026-10-22/science.md); including the art, audio and core modules that carry captions, feedback and status text. Only four core modules with no copy stay out. The math-games sweep adds every Number Garden, multiplication garden, equal-groups and forage module from the [math-games review](reviews/text-review-2026-10-22/math-games.md), plus the Bramble film page. A code property access or bare object key named like a flagged term (`w.provenance`, `{supplied:`) is skipped lexically, so those modules need no exceptions for identifiers.

The café sweep adds every café, recipe, sharing-counter, whole-batches and parcel-packing module and the café film page from the [café review](reviews/text-review-2026-10-22/cafe-kitchen.md).

Run `node scripts/check-child-copy.mjs` (or add `--json`) to flag a small set of source-vocabulary candidates in those renderers and their content files, excluding explicitly reviewed adult blocks and exact quotation exceptions. It is not a parser of all runtime strings, a review of translations/user writing, or a whole-app readability judgement. Its explicit adult block and quotation exceptions are human-reviewed source classifications; stale boundaries or exceptions fail the check.

Further sweeps follow the roadmap’s named text-review areas and recent boards. Check the current screen, its frozen sources and its purpose before applying a general substitution. No automatic rewriting of saved work.
