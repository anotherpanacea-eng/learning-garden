# 413 · Pollen Path

Status: proposed under admitted LG-1 / LG-G1; awaiting independent specification review. Selects the first pollination model of proposed150 Bee Meadow, not its full programme.

## Purpose and story

The town is adding a flower patch. Inside existing **Living Layers**, an optional **Follow a pollen path** entry opens a touch-first model: move a paper bee to flower parts and see where pollen-origin marks travel. This is a S2-II / S3-III bridge, supported by S1's model-versus-observation distinction, under the Act II/III town-sharing work of [49](49-six-act-curriculum.md) and [120](120-keeper-of-the-ways.md). Freely open; not a chapter requirement or story contribution. The patch is imagined, not a record of a real garden. No automatic fruit, café parcel, score, timer, mastery, assessment, credit or new saved record.

Living Layers already relates plant parts and whole organisms. Leaf Kitchen408 explains photosynthesis; Leaf Accounts386 owns molecule accounts. Feeding Board286 and the food-chain rooms own diets and feeding arrows. None lets a visitor pick up and deposit pollen on named flower parts. This adds that operation rather than another food-web or photosynthesis diagram. Complete life cycles, dispersal, colony roles, pollen tubes, genetic compatibility, pollinator decline and measured field investigations remain separate.

## Complete finite scientific model

Two drawn flowers, **A** and **B**, are of the **same kind**. Their parent plants are unspecified: never call the route self- or cross-pollination. Both stigmas can catch pollen in this model. Each flower has visibly distinct **anthers** (pollen-bearing tips of stamens), central **stigma** (top of a style), and a **nectar stop** near the flower base. The drawing is a conceptual cutaway, not a botanical species diagram, scale model or physical cross-section to measure. No ovules, seeds or fruit are rendered as consequences.

A paper bee has a body, head and abdomen, six legs and two pairs of wings; the simplified diagram does not teach identification of a real bee species. A child chooses exactly one part to contact on each tap. Nectar is sugary food; pollen can also feed bees. A real nectar visit may brush several flower parts; the controlled one-part contact here deliberately separates operations. The visitor carries marks on its body, not a honey pot or exclusively in pollen baskets.

Represent origins with two presence bits, ordered A then B. Each mark is a **label for origin**, not one grain, a count, mass, strength, amount or probability. A is a labeled circle; B a labeled diamond; colors supplement shape/letter. Both stigma mark sets and body marks remain visible in ordinary HTML beside the diagram. No numeric pollen counters.

Six contact actions: A-anthers, A-stigma, A-nectar, B-anthers, B-stigma, B-nectar. Touch anthers adds that flower's origin to the body's set. Touch stigma unions all body origins into that stigma's set; body origins remain. Touch nectar changes position only. There is no depletion or simulation of grain quantity. Repeating a contact can still describe the action even when no mark set changes. A stigma already showing A plus a visitor bringing A must not claim no pollen moved. With an empty visitor, announce no pollen arrived with it, even if old stigma marks remain. Never infer fertilization, successful reproduction or future seeds/fruit from deposited marks. Pollination is pollen transfer from anther to stigma; fertilization is a later different process that does not always follow.

Worked sequence: A-anthers gives body {A}; B-stigma gives B's stigma {A} while body stays {A}; clean visitor gives empty body with B's stigma still {A}; B-anthers gives body {B}; A-stigma gives A's stigma {B}; A-anthers then B-stigma gives body {A,B} and B's stigma {A,B}. Touching nectar anywhere between contacts changes none of those origin sets. Same-flower anther→stigma is allowed. Two origins on a stigma do not mean two grains or two seeds.

## State, actions and lifetime

Separate content/core/UI modules; no saved schema. `createPollenPath()` returns `{page:'garden',position:'rest',body:[false,false],stigmas:[[false,false],[false,false]],contacts:[],invitation:0,lesson:0,confirmFresh:false}`. Immutable `changePollenPath(work,action,value)` returns same object for invalid input. Pure exports also `pollenPathModel` and `pollenPathNarration`; UI exports `pollenPathPage` and `bindPollenPath`.

- `page`: garden / learn; keeps model, invitation and lesson.
- `contact`: Garden only; one of six string codes `a-anthers`, `a-stigma`, `a-nectar`, `b-anthers`, `b-stigma`, `b-nectar`; position becomes code, applies rules above, appends code to last-eight list. Repeated same contact is still an action.
- `clean`: Garden only; body becomes empty, position rest; stigmas and previous contacts stay. Append `clean` to the last-eight list. This means another clean paper visitor, not washing an actual insect.
- `invitation`: Garden only; integer0–5, changes prompt only. Does not reset, execute a route or claim completion.
- `lesson`: Learn only; integer0–3, changes worked teaching card only.
- `fresh-request`: Garden only; opens explicit confirmation. `fresh-cancel`: cancels it. `fresh-confirm`: only if pending, clears position/body/stigmas/contacts; preserves current page, invitation and lesson. Does not clear a parent guide.

Any valid ordinary action, page change or Back cancels a pending fresh confirmation. A no-op ordinary selection must still cancel a pending confirmation; invalid payloads do not change anything. No hidden action changes model state. Recent contacts are explicitly **last eight model contacts**, not a full trail record or real observation. Truncation leaves current marks intact. Nothing adapts, grades or blocks exploration. Model work survives page changes, Back and child re-entry within the same Living Layers visit. Leaving the room, explorer chooser/change, notebook replacement/import/reset, or owner/book change clears local work through existing room reset. Notes, localStorage and actual notebook objects are not written by child actions or views.

## Complete child copy and controls

Entry **Follow a pollen path**; title **Pollen Path**. Intro **The town is planning a flower patch. Move a paper bee and follow the pollen marks.** Two freely selectable pages **Model garden** / **See why**. Back **Back to Living Layers**; Hear **Hear this page**. No compulsory dragging, motion, narration or typing.

Garden instruction **Choose a part of flower A or B for the paper bee to touch. Watch the marks on its body and on each stigma.** Always-visible caption **Two model flowers of the same kind. You choose exactly what the visitor touches. A real visit may touch several parts.** Mark legend **A mark names where pollen came from. It is not a grain count.**

Each flower has three native buttons: **A · Touch anthers**, **A · Touch stigma**, **A · Visit nectar** (B equivalent), grouped under **Flower A** / **Flower B**. Labels are HTML outside the SVG. A compact anatomy key reads **Anthers hold pollen. The stigma can catch pollen. Nectar is sugary food. Bees also use pollen as food.** Current location **Paper bee: resting / at flower A's anthers / at flower A's stigma / at flower A's nectar stop** and B equivalents. Body caption **Pollen origins on the visitor: none / A / B / A and B**. Each receiving caption **Origins shown on A's stigma: none / A / B / A and B** (and B). These are model marks, not confirmed grain counts or records of learner skill.

Contact status, in a polite live region and current Hear text:
- Anthers: **The visitor touches flower F's anthers. Its body now shows pollen from O.** O is A/B/A and B.
- Stigma with body origins O: **The visitor brings pollen from O to flower F's stigma. The stigma now shows origins S. The visitor keeps its origin marks.** Repeat origins remain truthful without a quantity claim.
- Empty-body stigma: **No pollen came with this visitor. Marks already on flower F's stigma keep their place.**
- Nectar: **The visitor stops at flower F's nectar. In this model it touches only the nectar stop, so the pollen marks stay the same.**
- Clean: **A clean paper visitor is ready. The stigma marks stay where they are.**
- Initial: **Choose a flower part to begin.**
- Fresh: **A fresh model is ready. No pollen origins are marked yet.**

Buttons **Use a clean paper visitor** and **Begin a fresh model**. Confirmation **Clear this model's marks and recent contacts? Your Living Layers guide will stay.** Controls **Clear model marks** / **Keep this model**. Confirmation is visibly adjacent to fresh control, no modal or browser confirm. Reset is always reversible only by exploring again, so never silently execute on a single tap.

Recent section heading **Last eight model contacts**. Empty **No model contacts yet.** Contact labels **A · anthers**, **A · stigma**, **A · nectar**, B equivalent, **Clean paper visitor**. Older contacts drop out without suggesting they never happened. No timestamp, measured duration or fabricated field note.

Selector **Choose a trail to try**, six options and exact prompts:
1. **Between flowers** — **Try touching A's anthers, then B's stigma. Which origin mark travels?**
2. **Travel back** — **Try B's anthers, then A's stigma. What changes if the visitor already carries A too?**
3. **An empty visitor** — **Use a clean paper visitor, then touch a stigma. Compare its old marks with what the visitor brought.**
4. **One flower** — **Try a flower's anthers, then that same flower's stigma. A pollen transfer can happen within one flower too.**
5. **Two origins** — **Visit both sets of anthers, then a stigma. The marks show origins, not how many grains moved.**
6. **A nectar stop** — **Pick up pollen, visit a nectar stop, then touch a stigma. What stays on the visitor?**
No fitting-choice key or grading: these are invitations, and the next action remains the child's. Selected invitation stays across both pages. Changing it does not secretly clean a visitor.

Teaching selector **Choose a teaching card**, bounded **Previous** / **Next**. Four cards, each marked **Worked picture · not your model**:
1. **Three flower places.** **Anthers hold pollen. The stigma can catch it. Nectar is sugary food; pollen can feed bees too. This drawing pulls the parts apart so we can see them. Real flowers have different shapes.** Diagram: enlarged generic flower with separated peripheral anthers, central stigma/style, lower nectar stop, labeled HTML key.
2. **Carry it to a stigma.** **A visitor touches A's anthers and carries pollen from A. When it touches B's stigma, pollen from A can arrive there. Moving pollen from anther to stigma is pollination. Our marks show origins, not amounts.** Three clearly numbered static stages: A-anthers/bodyA/B-stigmaA, arrows show order, no arrow implies seed growth.
3. **A visit is not one touch.** **In our model you choose one place to touch. A nectar stop alone changes no pollen marks. A real bee drinking nectar may brush anthers or a stigma too. Bees can also collect pollen for food.** Two panels: nectar-only controlled contact, and conceptual bee spanning nearby anther/stigma, latter labeled **Possible real visit · not a prediction**. Show contact possibility, never guarantee both touches.
4. **What comes later?** **Pollen arriving on a stigma does not promise seeds or fruit. Fertilization is a different process that can happen later, when the right conditions are met. This model stops at pollen transfer. It cannot tell us whether seeds will grow.** Diagram anther→stigma; dotted further-process line ends in question mark, labeled **Later processes are not modeled**. No guaranteed fruit image.

Lifetime line **Your model stays while you visit Living Layers. Leaving the room or opening the explorer chooser clears it. Your notes are not changed.**

## Visual, accessibility and speech requirements

Original SVG only, no incorporated external art/fonts. Main garden 640×380 viewBox, both flower parts spatially separated, bee shown near selected target without hiding stigma/anthers. Labels remain ordinary HTML at least16px; 44px native targets, clear pressed page choices, visible focus. Visitor movement may use a short optional animation on a new contact; never depend on its end callback, timer or animation to apply state. Reduced motion suppresses movement. No autonomous loop or animation on Back/re-entry. All meanings available without color or motion; labeled marks are circle A and diamond B. Full HTML location/status/marks support diagram without visual access. SVG aria label accurately distinguishes the simplified model; mark SVG decorative where adjacent text supplies full meaning. No giant speech transcript: one current page, card or invitation at a time. Long anatomy/limitations can be folded, but operational instruction and model limits above remain visible. Do not put entry or essential contact controls in a closed disclosure.

Scoped voice preferences must remain in normal flow, with `transform:none`, below content, not covering the garden; summaries at least44px. Hear speaks the current visible page once, skips SVG duplicates, closed folds, service controls, select-option inventories and hidden pages. It reads current contact status and mark sets, not an old captured work object. No automatic speech after moves. Buttons describe actions; screen-reader announcements must not claim success/mastery.

## Host integration and preservation

`living-layers-ui.mjs` already owns a local `visit`, root binding generation, `parentFrame` and Leaf Kitchen child. Add a second optional child with independent local work; never create a second notebook owner. A small local active-child discriminator may replace the kitchen boolean; keep Leaf Kitchen's current entry, state, speech and return behavior. Both entries appear alongside existing parent controls on draft, shelf, readable card and unavailable card views. Pollen entry captures existing parentFrame: parent screen/case/card, slot/source/work identity, frozen raw source/work identity and current display values (camera/turn/current strip/folds/status/shelf/chooser). Returning restores that waiting view and focuses the correct entry; no save, copy, empty draft or parent selection is created by the child. Parent changes while child is open invalidate that frame; a retired event must not apply to the new parent or replay a pending action. Recover to current parent and stop speech/sound without mutating parent records. Both children retain their own local work across Back/re-entry until room reset.

Child context is only live/change/render/focus/back/stopSpeech/stopSound. Do not give it `save`, notebook writer, reward or canExport callbacks. Every control validates owner, actual notebook object, exact route `#living/layers`, current root and generation, child work identity, parentFrame identity/value, node/ancestor containment and visibility before any state or speech action. Direct per-control capture guards run before shared Hear handlers; root-only guards cannot stop a stale reparented button outside the root. Removed/reinserted controls are retired. Hide/unhide history of a control or ancestor is retired too; ordinary details open/close and intended voice preferences do not invalidate the room. Parent controls held across a child visit also stay inert. Old events after chooser/import/reset/owner/book/source/work change have no writes or speech. Add new root to app's observed-how-to exclusion so it does not bolt generic instructions onto the child. Existing room reset clears both children. No new route, app root, save migration or cross-game outcome.

## Teaching encounter and prerequisite crosswalk

Spec49 §5: teach with the four worked pictures; contrast anthers/stigma/nectar, clean/marked visitor, unchanged origin set/new transfer, transfer/later fertilization; supported practice with persistent anatomical labels and six optional trails; new use through reverse/same-flower/two-origin/nectar routes; return by changing route and revisiting lessons with retained model. No trial is an independent check or mastery evidence. Parent can ask why and listen; the app does not score the explanation.

Refreshed Jane `docs/LESSON-PACKS.md` at `c681f6bf2f2adf2aa032f765983a4691774cfba5`: studied teach→worked example→guided practice. Reused the teaching sequence as design, not its code, words, pack generator, grading, boss, adaptive engine, locks, medal or learner storage. This manipulative needs deterministic visible material, not a multiple-choice quest. No Jane code/content incorporated; no upstream research prose copied.

Refreshed Marble topics/dependencies at `04962c78ccb8bd52b236512d3362405bace98d2a`; descriptions and hard edges compared with bundled `curriculum/marble/dependencies.json`. Candidates only:
- `mt_SZJ1mN7Vfk` Bees and pollination: pollen carrying/nectar dependency partial. Hard prerequisite `mt_guaaD6Dn2M` Social insects: ants and bees owns colony roles/division of labor, **not taught here**. Do not infer prerequisite completion or full target coverage.
- `mt_WNBHZ1d94L` Pollination & Seed Dispersal: transfer only, not seed formation/dispersal. Hard prerequisites `mt_0B64gfJf7j` Seeds & Plant Growth and `mt_6xsEXxKdUX` How Plant Parts Work: Living Garden/plant studies/Living Layers offer partial bridges, but opening those rooms proves no growth observation or understanding. This child explicitly teaches relevant flower parts; whole growth life cycles/transport remain gaps.
- `mt_ck57CDFGet` Plant Reproduction: partial flower structure/insect transfer bridge, not wind vectors/fertilization/dispersal. Hard prerequisite `mt_WNBHZ1d94L` remains partial; do not claim its completion.
S2-II plant reproduction and S3-III pollination are placements for authoring, not course coverage or child level labels. S1 model limits support the encounter; no experimental evidence added. Pollinator Decline `mt_wWpa5fFDZP` is not claimed: no decline/food-security investigation.

## Source boundary

Primary fact checks (2026-11-07): [Iowa State Extension, Pollination and fertilization](https://yardandgarden.extension.iastate.edu/how-to/pollination-and-fertilization-vegetable-garden), directly opened, distinguishes anther→receptive stigma transfer and later fertilization that may not follow; [University of Minnesota Extension, Habitat for pollinators](https://extension.umn.edu/agriculture/specialty-crops/pollination/habitat), publisher search text, identifies nectar carbohydrates and pollen protein/fats/other nutrients. Facts are paraphrased in original child copy. These support mechanisms/food distinction, not this model's retention amounts, which are explicitly unmodeled. No source diagram, photograph, exercise, external script or quoted research passage incorporated. All story, visuals and labels newly authored. No percentages, population statistics or claim all plants depend on bees.

## Proportionate qualification and delivery

Core checks use an independent expected union model for all64 body/stigma presence configurations×six contacts, plus bounded recent history, clean/reset semantics, invalid actions, confirmation cancellation and immutable preservation. That proves the finite mark rules, not real pollination probabilities. Exercise every trail and worked figure for truthful copy; root inspects visual anatomy and marks. No assertion-count target or permanent integrity framework.

Native Chromium actual-app journey at tablet size plus focused phone samples: touch all parts, clean/deposit/repeat/two origins, all six invitations/four cards, pagination and Hear; no overflow/obscured controls; reduce-motion/no animation dependency. Inspect actual in-memory notebook, persistent storage and Notes export before/after; ignore only export timestamp, not lesson data. Exercise parent draft settings/folds, kept guide/card/shelf/unavailable own-source views, both child returns, pending fresh cancellation, stale detached/reparented/removed/reinserted/hidden controls and parent/owner/book/raw-source invalidation before action or speech. Run existing Living Layers and Leaf Kitchen regression suites because their binding is touched. Source runner once on integrated candidate plus affected checks after repairs. Browser emulation does not qualify physical iPad, Safari, audible pronunciation, VoiceOver or learning.

Six independent spec lenses plus complete finite biology/copy/model/visual-plan review before runtime. Independent Claude implementation clearance on exact final candidate; repair findings before ready/release/merge. One canonical PR receipt owns tested tree, merge/version, asset equality and Home/touched-route hosted smoke. Roadmap links receipt once; no cloned count ledgers. Keep continuing LG-1 active after this increment; French Gemini and owner phonics holds are unaffected.
