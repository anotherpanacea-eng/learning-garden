# 409 · Chance Line

Status: proposed bounded implementation; independent specification and finite mathematics review required before building. Serves admitted LG-1 / LG-G1. Parent: [202 Chance Window](202-chance-scale.md), selecting its numeric likelihood bridge rather than commissioning the whole pack.

## Purpose and boundary

Inside existing Seed Stall `#numbers/seeds`, offer **Compare chances on a line**. The orchard keeper is making a sign that compares chances without promising the next draw. This is an optional visit-local explanation, not a saved experiment, assessment, reward, access gate or new destination. Seed Stall87 already teaches replacement and short runs; Seed Pairs119 already teaches fractional two-draw probabilities. This increment adds a manipulable one-draw probability line and contrasting denominators before that advanced work. It does not claim first probability instruction or complete202.

## Complete finite material

All text, pictures and code are original. The same model rule stays visible on Build and in its narration: **These are make-believe counters. Each pictured position has the same chance on every draw, regardless of earlier results. Put the counter back before another draw.** Equal-position selection is a stated virtual rule, not evidence about real seeds or physical fairness. Sun and moon are marks, not weather forecasts. No draws occur in this child.

Eight fixed bags, in this order (id: sun, moon; reference Sun probability; line index out of12):

| id | Sun | Moon | reference | index |
| --- | --- | --- | --- | --- |
| none | 0 | 4 | 0/4 = 0 | 0 |
| quarter | 1 | 3 | 1/4 | 3 |
| half | 2 | 2 | 2/4 = 1/2 | 6 |
| most | 3 | 1 | 3/4 | 9 |
| all | 4 | 0 | 4/4 = 1 | 12 |
| third | 2 | 4 | 2/6 = 1/3 | 4 |
| dozen-half | 6 | 6 | 6/12 = 1/2 | 6 |
| dozen-most | 9 | 3 | 9/12 = 3/4 | 9 |

Initial bag quarter, own pin absent, reference hidden. Every bag displays all its countable positions with sun/moon symbol plus text summary. All bags ask for Sun. A select starts **Choose a point**, then13 positions from0/12 through12/12; labels include reduced fractions and endpoints. Changing to a real option explicitly places an ungraded own pin; placeholder is not an answer and cannot erase work. Separate **Clear my pin** does that. No default midpoint, drag requirement or13 cramped touch targets. Each bag retains its own pin/reference during the room visit. A bag change keeps other proposals; no correctness scoring, no auto-reveal. **Show reference / Hide reference** toggles a separate reference pin, count fraction, reduced fraction only when different, and likelihood word. Endpoints reduce to 0 or 1, not 0/1 or 1/1; gcd(0,n) = n. Own pin stays unmodified even if unexpected. No success/failure color or anatomical-style paths. Both pins remain individually legible at equal positions and endpoints: separate rows/shapes and text labels outside bounded diagram. HTML text16px, no shrunk SVG lettering. Line anchors0 impossible,1/2 even chance,1 certain; other positions have ticks. **These examples fit the twelfths marks. Other chances can fall between the marks.**

Three freely reachable pages: **Place a chance**, **See why**, **Try questions**. Page and bag navigation have bounded Previous/Next; no forced order or unlock. Back to Seed Stall always visible. Current page heading and a short action instruction lead each page. No long stacked lesson.

See why has four freely turned pictures, using original counters and a0–1 line, with these exact mathematical ideas (wording may be split into short equivalent sentences):

1. Count the whole: four equal-chance positions, one Sun. Sun has1/4 chance; The denominator counts all four positions, Moons included. A fraction names a share of one whole. One of four counters is one quarter of the set; two of four is two quarters. The denominator counts every counter, including the other mark. Zero means impossible; one means certain. Half is an even chance. Below half is unlikely, above half is likely for the named event, with endpoints named separately.
2. Compare shares:3Sun+1Moon versus6Sun+6Moon;3/4 >6/12 =1/2, despite6 >3. Draw both references on the same0–1 line and show both bags. Chance uses a share, not the Sun count alone. A larger coordinate is more likely.
3. Same chance, different bags:2Sun+2Moon and6Sun+6Moon both have Sun chance1/2. Draw coincident references with separate rows and show both bags. Equivalent fractions describe the same point, not identical bags.
4. More likely is not promised:3Sun+1Moon gives Sun3/4, Moon1/4. Either mark can appear next. Putting a drawn counter back restores the same four-position bag. A short run need not follow the proportions; neither a catch-up rule nor a streak changes this model's next-draw chance. Actual draws remain in Seed Stall.

Four three-choice questions in fixed order. Supported, ungraded, visit-local, no independent-attempt or mastery record. Choices stay fixed across redraws. Selecting/revising displays its specific explanation; no lockout or penalty. Optional **Show explanation** displays the fitting answer/reason; exposed help stays local and does not grade a prior answer. All four remain selectable through Previous/Next. Fitting positions 1, 2, 3, 2 (one-based), hence core keys 0, 1, 2, 1. Complete choices and feedback (runtime strings use normal word/number spacing, for example “Still 3/4”, “3 Sun + 1 Moon”, and “6/12 = 1/2”):

Q1 **One Sun and three Moons. What is the chance of Sun?**
1. **1/4** — One Sun is one of all four equal-chance positions.
2. **1/3** — Three counts only Moons. The whole has four positions.
3. **1/2** — Two kinds of mark do not mean two equal shares.
Explanation:1/4, because one of all four positions is Sun.

Q2 **Which bag gives Sun a greater chance:3Sun+1Moon or6Sun+6Moon?**
1. **Six Sun and six Moon** — Six is a larger count, but six of twelve is only half.
2. **Three Sun and one Moon** — Three of four is three quarters, greater than half.
3. **They have the same chance** — Compare the shares:3/4 is greater than6/12.
Explanation:3/4 is greater than6/12 =1/2. Compare the whole in each bag.

Q3 **A Sun was drawn from3Sun+1Moon and put back. What is Sun's chance next?**
1. **Less than3/4: Moon must catch up** — The returned counter restores the same bag. Moon is not owed a turn.
2. **More than3/4: Sun has a streak** — The returned counter restores the same bag. A streak changes no positions.
3. **Still3/4** — All four positions are available again, including three Suns.
Explanation:Still3/4. Returning the counter leaves three Suns among four positions.

Q4 **What can a3/4 chance of Sun tell us about the next draw?**
1. **Sun is certain** — Sun has a chance below 1, so it is not certain; Moon keeps a 1/4 chance.
2. **Sun is more likely, but Moon can appear** — Sun's 3/4 is greater than Moon's 1/4. Both remain possible.
3. **Random means we cannot compare their chances** — The next mark is uncertain, but the equal-position rule lets us compare shares.
Explanation:Sun is more likely, but Moon remains possible. A chance is not a promise.

Narration covers visible current bag/counts/rule, own pin or absence, reference only when shown, current teaching picture or current question/choices/selected feedback/explanation only when revealed, navigation and Back's preservation message. Never narrate hidden references/help or other pages. Use existing browser read-aloud service; no new audio/provider. A person may always read together.

## State, integration and lifecycle contract

Pure content/core/UI modules `dist/chance-line-{content,core,ui}.mjs` and CSS. Core constructor returns only finite visit state: `{page:'build', bag:1, pins:[null×8], refs:[false×8], lesson:0, question:0, answers:[null×4], explanations:[false×4]}`. Reducer returns new state only for in-range actions: page(build/learn/questions), bag(index0..7), pin(index0..12), clear, reference(toggle), lesson(index0..3), question(index0..3), answer(index0..2), explanation(toggle). Invalid/unknown actions leave state unchanged. Clear affects current own pin only; answer revision does not conceal an already-open explanation. Derived model computes rational values from count/whole, reduces by gcd and defines likelihood at0,1/2,1. No floats as equality proofs; references satisfy12*sun =index*total. Finite enums/bounds suffice, no generic schema/descriptor framework. New helpers/exports may follow existing local naming style.

`seed-stall-ui.mjs` owns visit state and captures parent return frame: existing turn count/choosing/pending/notice, saved Seed Stall root exact value and identity, parent details-open states, owner identity, notebook identity, current rendered-root identity and render generation. Existing parent state remains untouched. Child mode replaces the whole Seed Stall area, including the sibling Seed Pairs entry (move its composition inside `seedPage` via optional entry markup). Parent links/writers do not remain active behind the child. Back restores captured chooser/pending replacement/current run/history folds/notice without a save or new random draw. Returning to parent then re-entering retains the child work for the same room visit. Leaving the room/explorer resets it; copy says **Your line stays while you visit Seed Stall. Leaving the room clears it. Your saved experiments stay as they are.** No new cross-room links needed.

Actual `app.mjs` supplies live `notebook:()=>state`, `explorerId:()=>explorerStore.active.id`, and `isActive` exact Seed Stall route/not choosing explorer. `seedPage` receives owner and sibling entry options. Existing render reset retires the visit on route/owner/import replacement. Before any parent or child event, recheck root connected/current/not hidden, control inside it, generation, exact live route/owner/notebook and parent raw frame identity/value. Retire a frame on mismatch, DOM removal/reinsertion or hidden root/ancestor; stale listeners never revive. Explicit later re-entry after source change starts a fresh frame and may retain child work if notebook/owner/room still same. Hidden or detached controls cannot mutate, render, save or speak. Ordinary redraw captures a fresh guard. No new persistent state, learner root, support/exposure/fact/story writes, random calls, or telemetry. Existing daily room bookkeeping may occur on actual app render and is not a Chance Line write. Parent existing writers retain their documented behavior outside child mode.

## Teaching and curriculum crosswalk

[49](49-six-act-curriculum.md) §5: teach four pictures; contrast count/share and uncertain/uncompareable; supported placement/reference/questions; new application other totals and equivalent bags; return to Seed Stall's own experiment and later Seed Pairs. Open entry, adult support, no age/grade placement inference. [120](120-keeper-of-the-ways.md): ActIII/IV, M6 chance signs for orchard visitors, with M3 fraction magnitude and M7 reasoning. This is one bridge in202, not coverage of decimals/percent, unequal physical devices, conditional probability, Venn sets, weather or experimental estimates.

Upstreams refreshed2026-11-07: Jane `c681f6bf2f2adf2aa032f765983a4691774cfba5` LESSONS.md; Marble `04962c78ccb8bd52b236512d3362405bace98d2a` data/topics.json and data/dependencies.json. Jane's small ordered encounters and separate hints/examples are studied; no code, prose or art incorporated. Marble descriptions/dependencies inform the following partial candidates; no upstream research text copied and bundled graph remains pinned.

| target | hard prerequisites in refreshed graph | treatment here |
| --- | --- | --- |
| Likelihood Language `mt_iFFKZd-Vgv` | none | endpoints/even/likely/unlikely in picture1 and reference |
| Ordering Likelihoods `mt_UcGn2hjhYU` | likelihood language above | picture1 before picture2, same-total bags and unlike-total contrast |
| Equally Likely Outcomes `mt_xSgAgg9Ej_` | ordering above | equal positions explicitly defined; unequal Sun/Moon shares; no general physical fairness claim |
| Probability as a Fraction `mt_-c4Ca_nBzX` | generic fraction meaning `mt_ndGqFPWyen`; equally likely above | picture1 recaps share of whole;4-,6-,12-position counts and optional reference; existing fraction activities available, never presumed mastered |
| 0-to-1 Probability Scale `mt_t0g2SlP404` | probability as fraction above | count fraction, reduced fraction and own/reference point; decimals/percent remain missing, so partial only |

Pinned-graph reconciliation: the bundled `curriculum/marble/dependencies.json` instead names Unit fractions `mt_k2WE0-22-4` as the hard fraction prerequisite. Its discrete-set unit/non-unit fraction description is supported narrowly by picture1's one-of-four and two-of-four counter examples and optional count/reference display. The refreshed upstream replaces that edge with generic fraction meaning `mt_ndGqFPWyen`; both are explicitly recapped, neither inferred as mastered. Other listed hard edges agree. Existing Sharing Counter remains an optional revisit, not an entry gate.

Math source studied: [OpenStax Introductory Statistics2e §3.1](https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology). Its equally-likely count/whole rule and inclusive0–1 bounds inform original finite models; no text/figure copied. Independent reviewer must recompute every table/reference/choice/diagram and check this source boundary. No measurable learning claim follows.

## Acceptance and publication

Meaningful core checks: independent rational expectations for all eight bags; bounds/no-ops; no default pin; per-bag retention; unexpected pin/reference separation; equal-coordinate display data; fraction reduction; lesson/question navigation; fixed fitting positions/choice feedback; current-only narration with hidden references excluded. Child copy registration includes all three modules.

Actual-app native Chromium: enter from chosen parent bag and pending replacement; child interactions leave actual in-memory notebook and persisted learner records/Notes unchanged; Back restores frame/folds; owner/route/import/source replacement and stale/hidden/detached controls cannot act; no save through questions/help/Hear. Test raw own-source externally replaced as an explicitly synthetic invalidation case. One complete tablet journey plus phone layout samples (no horizontal overflow,44px controls,16px effective labels, equal/end pins legible), keyboard/focus and narration stub. Run existing Seed Stall/Seed Pairs regressions and full source runner once on stable current-main integration. Root inspect screenshots. No physical-iPad/audio/learning qualification claim.

Independent six-lens specification review plus complete finite mathematics/model review before implementation; exact-head independent Claude implementation review after repair. Publish review clearances and final qualification/deployment receipt on PR; roadmap links once. Hold French462 and unrelated pixel487 as before. No new generic infrastructure, permanent receipts or qualification registry.
