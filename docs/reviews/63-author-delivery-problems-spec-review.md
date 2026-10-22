# Author a Delivery Problem: independent specification and content review

**Verdict: BUILD-READY after the P3 copy fold below. No P1/P2 findings.**

A separate reviewer context read the workspace/project instructions, CONTRIBUTING.md, spec63 and source audit63, specs58/61 and their prior specification reviews, and the actual Cartographer content/core/jobs/UI/CSS and Workshop seam. No runtime63 exists or was reviewed. This reviewer changed only this review document; source refresh claims in audit63 were not independently re-fetched.

## P3 — correct the exact preview copy and the route-ending example

At spec63 line31, the prescribed learner-facing strings contain `our12-move` and `holds12`. Use **“our 12-move card”** and **“Our route card holds 12 moves.”** These are explicitly specified output strings, so correcting the specification prevents a literal copy into the interface.

At line39, change **“A request ending at the collection point”** to **“A route ending at the collection point.”** Request creation deliberately requires distinct collection and destination landmarks; it is a solver route that may end at the collection point while failing the request. Keep visited=true and fulfilled=false for that route. These are small wording corrections, with no mathematical or architectural change and no need for a full repeat specification review.

## Usefulness and complete content

The new learner action is meaningfully distinct: choose the conditions another courier must satisfy, rather than place landmarks alone or solve a supplied job. Structured condition selection is sufficient to make that action concrete. Generated words and a visible feasibility calculation are correctly treated as supplied support, without claiming independent composition, shortest-path reasoning, partnership or general problem-posing competence. No typed prose or additional taxonomy mapping is needed for this slice.

The canonical request names start, collection and final delivery in order: “Start at [start]. Collect a sealed parcel at [collection], then deliver it to [destination].” Its title, complete frozen coordinate card and across-first/up-second orientation are adequate. Initial from/to come from the source free map. With the existing key order Post Office, Café, Garden, Bridge, the initial collection choice is the first key item other than those two endpoints; ordinary defaults Post/Café therefore select Garden. Defaults do not evidence independently invented conditions. Temporary duplicates permit selector swaps but cannot create a request. Requiring all four landmarks is an explicit format constraint, not an educational access gate.

The 6/12/19 examples are correct. An independent breadth-first search on grid position plus whether collection has occurred verified the stated minimum against **all 42,840 distinct start/collection/destination position triples** on the 36-point grid, without a Manhattan-distance heuristic. Each leg's coordinate differences are necessary and an axis-aligned path attains them inside the unobstructed rectangle. The unused fourth landmark does not obstruct travel. Thus a minimum of twelve is feasible and nineteen cannot fit this command representation; this rule belongs to creation, not historical admission.

The existing evaluator separately confirmed that EEE NNN serves the square-map request in six moves, NNN EEE arrives in six but misses Bridge, and EEEEE NNNNN WW serves the boundary example in twelve. For NNN EEE SSS NNN, Café is reached at index6, Bridge at index9 and Café finally at index12; the route serves the request. Delivery occurs on completion, so an early destination pass is allowed. A route ending at collection has visited it without delivering; a blocked prefix cannot serve, an untravelled suffix cannot establish a visit, and empty routes cannot serve distinct endpoints. No exemplar equality, shortest-route requirement or both-routes-success requirement is warranted.

## State, preservation and capacity

The proposed optional child draft fits the existing round without changing the understood base map's validity. Pure defaults remain transient until an explicit author action. An unreadable/future draft must be retained visibly and cannot be silently replaced or make otherwise readable routes/checks disappear. Origin metadata is advisory: malformed/future metadata remains escaped work while the understood frozen source stays solvable. Imported numeric references establish neither identity nor reliable provenance.

The existing source validator already supports arbitrary complete maps and ignores additional source fields; it need not gain a feasibility, catalog-text or origin-reachability requirement. Historical source text and recorded booleans, including contradictory outputs and over-limit maps, remain frozen. Draft edits do not change free-route check relevance; later source-map edits do not change a created job. These boundaries are distinct from validating newly generated input before allocation.

Reusing one `newMap(state,source)` allocation is sufficient. The proposed preflight prevents incomplete/duplicate/over-limit/unsupported/unsafe-ID failures from consuming an ID or evicting work. The existing oldest-readable rule drops max(0, readableCount−11) entries before appending the new sheet; the specification correctly requires the exact count even for oversized imports. It additionally discloses when the source itself is in that set, including loss of its earlier routes/checks. Frozen source geometry survives that eviction; source history does not. Raw siblings remain outside eviction. No extra registry, migration framework or second history is needed.

## Existing interface seam and implementation gates

The existing Map/Route/Compare page and native selector/direction controls support this increment without held app, media, global style, README or mobile-evidence changes. A compact static map and author question together are a useful change from burying selectors beneath the full placement grid. Closing to edit landmarks, returning from Route/Compare, same-map choice repair and opening a retained reference all have explicit behavior. The local stylesheet already supplies a 44px baseline; the actual new layout still requires browser verification.

Current help/narration listeners use the map current at event time, so the stated detached-event and map-identity requirement addresses a concrete seam. Implementation must prevent old controls or queued native toggle events from changing another sheet, and preserve folds only for their own map. This is an implementation gate, not a reason for a new event framework.

Independent implementation review and root browser checks remain required: exact copy, valid/invalid creation, one allocation, raw/future preservation, cap/source eviction disclosure, frozen-source behavior, generic transfer/reload/explorer/save-off, route repair, role access, local focus, keyboard use and desktop/phone/tablet layout. The independent mathematical probe above establishes feasibility only; it does not establish runtime63 correctness, physical-device behavior or learning effects. No merge/deployment is authorized by this review.


## Root resolution

The exact preview spacing/units and route-ending example were corrected before runtime implementation. No concept or schema changed; the independent verdict required no full rereview for these copy folds.
