# Rebuilding the town, seasons and the almanac

Status: proposed; awaiting independent spec review. Builds on [spec 21](21-regrowing-the-garden.md) (participation rewards, never correctness) and [spec 16](16-explorer-profiles-and-progress-safety.md) (per-explorer state). Single device and offline throughout: no accounts, sharing, network weather or location. Child-facing text and number moments: [33-town-content.md](33-town-content.md).

## Problem

After the Storm has many destinations, but they sit side by side as a list. Nothing a child does in one place matters anywhere else, the storm story ends once the garden replants, and there is no single place where a child can see what they have explored. Three connected pieces fix this: a town that play rebuilds, a calendar that makes the town change, and a book that remembers.

## The town

The storm also damaged the village beyond the garden. Add a village scene that becomes the home screen, with the garden as one place on it and these six damaged places:

| Place | Repair jobs (each fed by finishing a session in) | Opens |
| --- | --- | --- |
| Footbridge | Measured planks: Ribbon Workshop walk or adventure · Rope bundles: multiplication garden visit · Crossing notice: an English story or Paris task | Paris and the river stories |
| Mill | Water level: a Water Lab mission · Grain sacks: a café gathering trip · New wheel spokes: Shape Pavilion walk or adventure | Water Lab |
| Bakery | Flour: an orchard harvest · Tables set: a café dinner table served · Recipe card: a French story | The café |
| Library | Returned books: two story visits of any kind · Shelf labels: Bundle Burrow walk or adventure · New signs: Word Garden words ([spec 34](34-word-garden.md)) | Story paths |
| Bell tower | Rope lengths: Picnic Clearing walk or adventure · Clock face: Stepping-stone Path walk or adventure · A notice for the bell: any story ending | Number Garden |
| Post office | Sorted parcels: a Puzzle Hollow walk or adventure · Delivery route: a Willow Post Office delivery once built | Willow Post Office once built |

Rules, matching the replanting rules in spec 21:

- A job is fed by **finishing** a session with any outcome, skips included. Repairs never read correctness, independence, support or evidence fields.
- When a session finishes, its end screen shows **Send to the town** with the places that still want that kind of work. The child picks one; the job fills and the repair appears on the scene. If nothing wants it, the end screen says the town is well supplied and offers nothing.
- A place with all three jobs filled is repaired for good: it gets color, people and a small animation (static with reduced motion), and tapping it opens its destination. Damaged places also open their destination; repair is decoration, never a lock.
- Nothing decays, nothing is counted on the scene, and there are no levels, streaks or comparisons.
- Jobs whose destination is not built yet are hidden until it is, so every visible place can be finished with what exists today. With the current destinations, every place except the post office can be completed.

State lives per explorer in a new `town:{jobs:{[placeId]:[jobId]},pending:[{source,at}]}` field, normalized additively like `plantings`; unknown place or job ids are dropped. Export, reset and saving-off include it.

## Seasons and the weather log

The town follows the device's calendar. Season comes from the month, with a grown-up setting for the southern hemisphere (default northern). The village and garden art swap palettes and small details by season: blossom, full trees, falling leaves, snow on roofs.

Each season adds one optional job, never required to finish a place: spring flood boards at the mill, summer awnings at the bakery, autumn harvest baskets for the library's festival, winter lanterns on the footbridge. They are fed the same way as other jobs and stay filled after the season ends.

A **weather log** sits on the town scene: once per calendar day the child can tap sun, clouds, rain, wind or snow for what they see outside. Nothing is fetched; a missed day is simply blank. The log stores `{date,weather}` per explorer (latest 1,098 readable daily notes when the spec 116 Almanac is built (current runtime keeps 400)) and feeds the almanac's weather page.

## The almanac

One book reachable from the town scene, built mostly from records that already exist:

| Page | Fills from |
| --- | --- |
| Town | Each repaired place with the date it finished |
| Garden | Planted kinds from spec 21, one picture per kind found |
| Café and orchard | Guests served at least once, foods discovered |
| Words | French words met in Paris stories; Word Garden words once built |
| Weather | A bar graph per month from the log, with one unscored question such as "Which weather did we see most this month?" |
| Thinking stickers | See below |

**Thinking stickers** reward ways of working, each earned once and derived from existing records: used a picture; tried again after a first answer that didn't fit; used a smaller example; opened the worked steps; finished something even after skipping part; came back to a garden on a later day. Stickers are never tied to correct answers, speed or totals, and the page shows no counts.

Only the weather log and the town are new state; every other page is computed when opened. Grown-up notes gain one line linking to the almanac; the almanac adds no evidence and changes no suggestions.

## Verification

Each finished session offers Send to the town exactly once and fills exactly one chosen job; a skipped session earns the same as an answered one; town code reads no correctness, support or evidence field; hidden jobs never block a visible place; every place but the post office can be completed with current destinations. Season changes at month boundaries in both hemispheres; seasonal jobs are optional; the weather log accepts one entry per date and renders a graph from it. Every almanac page renders from an empty save, a base save from `main`, and a busy save; stickers derive from records without new fields. Save-off, export, reset and explorer switching include town and weather. Browser: send work to each place on a phone and a tablet, reload, change the device month, and switch explorers.
