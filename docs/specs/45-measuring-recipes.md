# Measuring Recipes: fill, read, pour, revise

## Purpose and first playable slice

The Sharing Counter makes equal shares visible; the existing Number Garden measures lengths, areas and perimeters. Neither asks the learner to measure a liquid portion and transfer it for a useful purpose. Add an optional café **measuring kitchen**, `#cafe/recipes`, where neighbors prepare two measured imaginary ingredients for community dinners after the storm. The child fills a pictured jug, reads its scale, pours into labelled preparation jars and adjusts the portions to match a recipe card. Making and correcting the batch is the game; there is no quiz before manipulation.

The first slice uses **one straight-sided 500 mL jug**, **50 mL equal transfers** and **one recipe batch**. Six finite recipe requests are always open. Scaling recipes, mass, litre conversion, fractions of litres, irregular/wide-vs-narrow vessels, temperature, actual cooking and ingredient mixing are later increments. Do not add these merely because the math could be generated.

Use compact **choose → measure → check the tray → keep/revise** pages. Every page is open; retaining an unfinished tray needs no pass. On each task page keep the complete two-line recipe card, current jug scale, chosen ingredient and labelled preparation amounts available beside the action. Page changes, routes, case selection and reload preserve the exact work and pending reading text. Add the entry after the normal café task, beside the Sharing Counter; no longer pre-task scroll or new global navigation system.

## Model, units and source boundary

Model ID `measuring-kitchen-v1`. This is an exact **mathematical picture machine**, not a calibrated real utensil, a measured food experiment or a usable recipe. Child-facing label: **“Pretend ingredients, exact picture amounts. We are practising reading a scale.”** The fictional liquids are **cloud-water** and **star-water**, distinguished by names and patterns as well as colour. Nothing is a real food, nutritional claim or feeding instruction. The actual café cupboard/order and inventory do not participate.

The jug has capacity 500 mL and volume 0–500 mL in 50 mL steps. Its interior has constant width and depth; level height is exactly proportional to volume. The clearly marked zero baseline, ten equal 50 mL intervals, major labels 0/100/200/300/400/500 and minor 50 mL ticks use one consistent geometry. The scale heading says **mL (millilitres)**. A top capacity label stays distinct from the current volume. A horizontal surface is drawn at the exact mark; no decorative wave obscures a reading. No pixels-to-real-centimetres or display-size calibration is implied.

Each ingredient source starts with 1,000 model mL; each preparation jar can hold 500 model mL. The two preparation jars have the same transparent straight-sided geometry and scale, separately labelled with their ingredient. They remain separate: the batch is a tray containing both measured portions, **not a mixed liquid**. Summing the two amounts for an optional arithmetic explanation must be called the combined amounts on the tray, not a measured mixture volume. This avoids pretending every real mixture preserves the sum of ingredient volumes. A short Details note distinguishes capacity from contained volume and says the picture machine omits real pouring uncertainty, wet surfaces and meniscus reading.

There are no grams, cups, teaspoons, density conversions or hidden cup standard. A unit-choice prompt may contrast mL with g/items to discuss what is being measured; feedback says this scale measures liquid volume and offers no mass conversion. Standard units are real conventions, while the containers, quantities and recipe requests are authored model content.

## Six original community-dinner cards

All requests are for one tray, using the same apparatus and two fictional ingredients. These numerical amounts are invented for practice, not tested cooking ratios. Each amount is reachable in at most seven 50 mL fills; all combined tray amounts are at most 500 mL.

| Case ID | Fictional purpose | Cloud-water | Star-water |
| --- | --- | --- | --- |
| `welcome-broth` | Purl sets out a welcome-back broth tray. | 150 mL | 100 mL |
| `lantern-supper` | Wisp prepares the lantern-menders' supper tray. | 250 mL | 150 mL |
| `bridge-picnic` | Clover packs a tray for the bridge crew. | 300 mL | 200 mL |
| `moonlight-toast` | Ember prepares a moonlight celebration tray. | 100 mL | 200 mL |
| `rainy-rehearsal` | Dot prepares a tray for the puppet rehearsal. | 350 mL | 100 mL |
| `garden-thanks` | Pip prepares the gardeners' thank-you tray. | 200 mL | 250 mL |

“Another recipe” cycles through these six stable cards. Replays are labelled familiar, not newly generated challenges. Each card keeps its own working tray and latest explicitly kept draft. Choosing another card never changes a paused jug, reading response, support record or tray. The first slice has no inferred level, adaptive difficulty ladder or progressively locked recipe list.

## 1. Measure an ingredient

Start with an empty jug, empty preparation jars and both source supplies full. Choose cloud-water or star-water by labelled button. A jug can contain only one ingredient at a time; choosing another while it contains liquid explains **“Return or pour this ingredient first.”** It cannot silently relabel or discard the existing liquid.

**Add 50 mL** transfers exactly 50 mL from that source into the jug. **Return 50 mL** reverses the transfer; **Return jug to source** returns its whole contents. These actions do not pour into a recipe jar automatically or snap to the requested amount. Reject an impossible transfer atomically, explain capacity/available amount, and retain the model. At 500 mL the jug is full even if a recipe asks for less; a nonmatching level stays visible and correctable. A zero amount is an empty jug, not a missing reading.

The scale is the central representation. Do not place an automatic large “you have X mL” answer over it before a check. Its exact accessible description remains available and accurate, including level and scale; this is supplied support, not an independent-reading test. Counting 50 mL transfers is a legitimate alternative method, not secretly forbidden. An optional unit strip can show the equal 50 mL spaces, clearly marked as help.

Optional **“What does the jug show?”** has a number field and a unit choice. Preserve the exact bounded text while typing and across pages/reload; typing never rerenders the textarea/input or loses the caret. A blank, non-integer or out-of-range response produces an input explanation, no mathematical attempt. Accept whole-number readings 0–500 for checking, including wrong values not divisible by 50. Check **number read** and **unit named** separately against the actual current jug, not the recipe target. Reading 300 mL correctly when a recipe asks for 250 mL is an accurate reading of an overfilled portion; it is not an incorrect reading.

Changing the jug retains the entered response but clears live feedback and marks it as an earlier draft until checked again; frozen earlier readings remain attached to their exact old jug. Editing response/unit also clears stale feedback. No reading check is required before pouring or keeping work. The recipe source is always visible; this is purposeful measurement practice, not a memory or reading-level assessment.

## 2. Pour and check the tray

**Pour jug into its preparation jar** transfers the entire current jug amount to the same ingredient's jar and empties the jug. The control names its destination. Ingredient identity chooses the compatible jar; the model never lets cloud-water become star-water. Reject if the receiving jar would exceed its 500 mL capacity; never silently spill or truncate.

To correct an overfilled preparation jar, **Return 50 mL to jug** transfers one unit back when the jug is empty or contains that same ingredient and has room. The returned liquid can go back to its source. **Return this jar to source** is an explicit reversible correction that restores its entire ingredient amount without changing the other jar or jug. A clearly labelled **Return all portions to sources** resets only that case's current apparatus; it keeps its typed reading draft, checks and previously kept tray. Explain the return; do not call it deleting a guest or starting the order over.

All ingredient amounts are conserved separately: for each ingredient, source + its preparation jar + that ingredient's jug contents = 1,000 mL. No model action affects the other ingredient except emptying a jug before a new selection. The jug's current amount and the recipe jar's current amount are different quantities; show their labels, never count the jug as already delivered.

**Check my tray** compares each preparation amount with that ingredient's recipe request: below target / matches / above target, naming the exact amount and mL. Check an empty or partial tray without penalty. Give the two ingredient results separately; do not reduce them to a score or treat a wrong unit response as wrong liquid handling. The jug remains separate: a tray can match while extra liquid is waiting in the jug. Feedback says so, and the child can return it before setting out the batch. A **ready to set out** model means both preparation jars match and the jug is empty, but keeping an unfinished draft and all later pages remain open.

Keep the original recipe beside the actual portions. A supplied **difference help** can show how much must be added/returned, marked as support, without automatically making that move. No timer, pouring animation or drag precision is required. A bounded different-case example uses a separate 400 mL request, never mutates the current apparatus and steps through eight 50 mL fills to that level; its model is explicitly supplied help. It does not establish a new learner response.

## 3. Keep, share and revisit

“Keep this dinner-tray draft” freezes the case/model ID, full recipe source, exact separate apparatus amounts/ingredient identity, current reading text/unit, latest separate reading/unit and ingredient checks, support and familiarity. It works when a tray is unfinished or a check differs. Later pouring/help cannot mutate the snapshot. A new keep explicitly replaces only that card's latest kept draft; six shelf slots keep other cards available. Calling a matching tray ready does not consume supplies, close an actual order, grant ingredients, advance a supper or trigger a film. Optional spoken invitation: **“Which scale did you read, and what would you change?”** No stored or automatically graded prose is needed.

A link back to the Sharing Counter can invite comparing **a share of a whole** with **a measured mL amount**, naming them as different questions. Do not copy arrays/answers into the fraction game or claim that measuring 250 mL demonstrates one-quarter understanding. Two batches, half batches, equivalent litre quantities and different container widths need future authored contrasts; these links do not claim them built.

## Evidence, support and actual exposure

All checks are `practice:true` and `visual:true`. Record handling/manipulation, equal-interval strip, narration, together-help, numerical reading reveal, recipe-difference explanation and worked example separately. Freeze support at each check; subsequent help cannot rewrite earlier evidence. Rechecking after feedback, revisiting a card or reopening kept work is familiar practice. Merely rendering a page adds no reading answer, successful recipe result or mastery inference. Separate ingredient quantity fit, numeric scale reading, named unit and apparatus-ready status in UI and notes.

These cases use addition/subtraction of mL, not a displayed multiplication fact within 12×12. **Do not emit unrelated shared fact exposure**: six 50 mL transfers are not a shown `5 × 6` fact, and the 500 mL capacity label is not `5 × 10` practice. The authored slice needs no multiplication hook unless the final implementation actually displays an explicit relevant fact or equal-group model. If one is added during review, pass only that actually visible ordered pair through the existing shared hook; chooser cards and hidden examples do not expose it. Do not feed measuring-kitchen success into café/Bramble scores, broad placement, fraction proficiency or other task outcomes. A later exact shared reading/math task must carry prior exposure explicitly before claiming a fresh independent attempt. Do not build a general learning-profile service for this slice.

## Optional state and narrow API

One optional `measuringRecipes` version-1 root. Missing means fresh. Validators/renderers/notes are read-only; unknown version, extra unsupported fields, invalid source semantics or malformed data remain exact and unavailable. Explicit recovery retains the complete original payload under `recovered`. Generic local explorer save/load, save-off, export/import, clear/reset and escaped grown-up notes include this root; unavailable roots must pass through import for later recovery. No user identity, dates, remote learner service or new storage framework.

Suggested shape, with equivalent simpler names acceptable:

- `version`, `currentCase` (null or one of six IDs), `page` (`choose|measure|tray|keep`), `cases` keyed only by six stable IDs, optional `recovered`.
- Each case has an immutable cloned source (`measuring-kitchen-v1`, case ID/purpose, two recipe targets, unit mL, jug/jar/source capacities, transfer size), selected ingredient, jug `{ingredient,amount}`, preparation amounts by two known ingredient IDs, current reading `{text,unit}`, sticky support/familiarity, optional example step, at most 24 total check snapshots and null/latest kept draft.
- Amounts are finite safe integers in mL, multiples of 50. Jug and each jar 0–500. A nonempty jug has exactly one known ingredient; an empty jug has null ingredient. Selected source ingredient is separately a known ID, so emptying the jug can preserve the selected fill source. Source amounts are derived from 1,000 minus preparation and same-ingredient jug amount; validate their bounds and conservation. No separate mutable source ledger is needed.
- Reading text is an exact string of at most 24 characters; unit is null or `mL|g|items`. Checking parses a whole number 0–500 without coercing empty strings/decimals/nonfinite values. Invalid input is a UI validation outcome, not a mathematical check. Stored check snapshots include exact apparatus/source, response/task, independently derived number/unit/ingredient/ready results as applicable, support/familiarity and `practice:true`. Reject stored flags inconsistent with the snapshotted model; later edits must not recalculate old results against the current apparatus.
- Preserve incomplete user work, not arbitrary silently coerced input. Check histories and keeps are deep clones. An unsupported old source version remains unavailable/recoverable instead of being graded using a replacement recipe or new scale. Collection limits bound local state; no persistent event journal is required.

Suggested actions: `recipeState`, `ensureRecipes`, `chooseRecipe`, `setRecipePage`, `chooseRecipeIngredient`, `fillRecipeJug`, `returnRecipeJug`, `pourRecipeJug`, `returnRecipePortion`, `resetRecipeApparatus`, `setRecipeReading`, `setRecipeUnit`, `checkRecipeReading`, `checkRecipeTray`, `useRecipeSupport`, `stepRecipeExample`, `keepRecipe`, `recoverRecipes`. Reject invalid actions atomically without changing a valid root. Core mutations touch only this destination. Choose concise argument forms rather than introducing a general unit-conversion or recipe engine.

## Primary references, upstream overlap and mapping

Read existing Number Garden `broad-content.mjs` measurement activities and `broad-variants.mjs` (length/area/perimeter), Water Lab science content (molecular explanations), Rain Paths spec 44 (arbitrary water tokens, deliberately not mL) and Sharing Counter spec 43 (equal fractions without measured units). Reuse local storage, narration, simple controls and visual conventions; those do not already implement calibrated liquid-scale manipulation. Rain tokens must never be silently relabelled as millilitres.

Primary teaching references, checked for this specification:

- [Official Common Core 3.MD](https://www.thecorestandards.org/Math/Content/3/MD/): practical volume/mass measurement and same-unit one-step problems are a relevant direction. This activity uses mL picture models only; it does not cover the standard's mass, litre, estimation or physical-measurement scope. No standards prose is imported.
- [Oak National Academy: measuring liquid volumes using millilitres](https://www.thenational.academy/teachers/programmes/maths-primary-ks2/units/measures-mass-and-capacity/lessons/measuring-the-volume-of-liquids-using-millilitres): studied its distinction between interval counts and tick marks, standard scales and reading volume. Oak encourages practical physical experience; this screen model does not replace it.
- [Oak National Academy: capacity and volume](https://www.thenational.academy/teachers/programmes/maths-primary-ks2/units/measures-mass-and-capacity/lessons/understanding-capacity-and-volume): supports distinguishing maximum capacity from current liquid volume. Its teaching text/images/slides are not copied. Oak identifies its lesson content as OGL 3.0 except noted material; keep this a design-only reference with original art/prose.

Public source heads refreshed: Jane `7802588313e6c6edc57432df398d9f3ddb9ff938` (`LESSONS.md`, `src/stuck.js`, `LICENSING.md`), Marble `95e6dddef0a6a0af9ed973a3e3fd5f35da00a733` (`data/topics.json`, `data/dependencies.json`; 1,616 topics/3,317 edges). Jane's short purposeful task, stepped different example and optional help are design references only. Do not copy procedural shortcuts, code, lesson text, grade/mastery/age routing, points or locks. Jane code is MIT; lessons/docs CC BY-SA 4.0. Marble database is ODbL 1.0 and authored text CC BY-SA 4.0; existing NOTICE/attribution apply to the scoped map. Cached primary files and relevant measurement-topic/edge extracts are at `/private/tmp/learning-garden-recipe-sources/`, outside the public repository.

Keep the bundled graph at `96a7933754af672e1bfdbf7ecb05c325860c6e0d`. Relevant candidate descriptions/evidence are unchanged at the refreshed head, except `mt_NSC3LT_-ch` now clarifies capacity versus volume and removes solid-unit-cube scope; do not map it here because this slice does not estimate capacities. Candidate narrow references: `mt_4lp_b5Pzik` (standard-unit capacity/volume model with recording), `mt_DOe893F6gN` (mL measuring-jug slice, no actual tools or other measures), `mt_6oxQPNLHNv` (same-unit amount comparison/adjustment). `mt_zkFbMLpu3U` can describe the visible full/empty/more/less language only; two different containers' capacity comparison is absent. Do not map `mt_-af65bxfdp` as full liquid-and-mass instruction, `mt_BFJ-ch_8QU` unless >/< /= ordering is actually taught, or misleading titles such as measurement `mt_5HV4mbgSGH` as beginner number-line fractions.

Actual source edges place initial unit-based capacity measuring after capacity comparison, standard-unit choice after initial measuring, and measure calculation after unit choice/comparison. Use them for authoring continuity, not access locks. These narrow picture tasks do not establish those prerequisites mastered. The Sharing Counter → measuring kitchen invitation is an original bridge, not a new graph edge or claimed transfer result.

## Verification and delivery

Independently review this spec before building and implementation/content before publication. Use original clearly graduated jug/jar SVG, paper recipe card and two distinct ingredient patterns. Controls at least 44 px high, no hover/drag/timer requirement, optional local narration and reduced motion. Retain a short current action and source recipe on narrow portrait screens. Keep keyboard focus meaningful after a fill/return reaches a limit or a control disables; narration does not establish independent reading.

Concrete acceptance:

- Review all six exact target pairs, units, apparatus capacities, tick intervals, level geometry and example steps. Every reachable volume 0–500 in 50 mL steps must align to the correct mark; 0 and 500 are valid. Counting ten intervals differs from counting eleven marks. No automatic target snap or unlabelled change of scale.
- Test conservation separately for both ingredients through fill, partial/whole return, repeated pour, preparation return and reset. Wrong-ingredient jug changes and overflow reject atomically. Returning one ingredient cannot alter the other. No source/jug/jar contains a negative amount or more than capacity; no mixture separation is pretended because ingredients stay separate.
- Test correct reading of the wrong recipe portion, wrong reading of a matching portion, wrong/missing unit, empty reading, zero, invalid text and retained pending response after a model change. Separate source, read number, named unit and recipe fit; stale feedback clears without losing typed text/focus. Frozen old checks retain their exact prior jug.
- Tray matching with extra liquid still in the jug must distinguish ingredient fit from readiness. Keep unfinished, nonmatching and matching drafts; repeated keep explicitly replaces only that case. Later manipulation/help cannot mutate snapshots, another case or shared content.
- Test malformed/future/source-version/unknown-key roots, exact retention/read-only notes/recovery, escaping, bounded histories, save/reload, save-off, explorer isolation, export/import and reset. Use fictional fixtures only. All genuine synthetic café/equal-group/fraction/garden/letter/loft drafts and inventories remain exact.
- Verify no false shared fact exposure or other-game result. If an explicit in-range multiplication fact is added, test its visibility timing with a paused check-in before admitting it to the shared hook; otherwise no hook is needed.
- Browser-test fill/read/pour/correct/keep/reopen, changing ingredients with a nonempty jug, unit feedback, narration, keyboard focus at limits and narrow overflow. Physical measuring competence, iPad Safari and learning gains remain separate from software verification.

Deliver reviewed committed static assets in a draft stacked on the current build branch and publish the reviewed release to the existing personal Cloudflare game. No merge is implied. Further quantity comparisons, measured half/double batches and reader-revised recipe notes remain explicit future spirals.
