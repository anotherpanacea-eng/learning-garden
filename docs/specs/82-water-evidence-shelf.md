# 82 · Water Evidence Shelf

**Status:** Proposed for independent specification review. This document authorizes no runtime build, source-map expansion, merge, or publication.

## Problem and smallest addition

The existing Water Lab follows melting, warming, and a molecule leaving a liquid surface. Its hub correctly says that a shrinking puddle alone cannot reveal where all the water went. Rain Paths is an authored runoff-and-storage token machine, not an observation of a real puddle. Neither asks the learner to compare a *visible before/after clue* with a *possible explanation* of that clue. Add one optional three-card **Water Evidence Shelf** inside the Water Lab hub. The activity uses original illustrated stills and one unscored choice per card. It does not add a fourth molecule mission, a physical experiment, measurements, a water-cycle simulator, or a new learning gate.

The content is fictional, supplied, and finite. It rehearses: “What changed in the picture?” before “What might have happened?” A pictured change can support more than one explanation. The third card adds explicit supplied conditions under which evaporation fits, while keeping vapor unseen and the drawing short of proof. This is a small S1 observation/interpretation and S7 water-pathways revisit with S5 evaporation context. It is not full instruction or evidence for the entire water cycle, evaporation rate, drainage design, or practical investigation.

## Place, flow, and lifecycle

Place a plainly labeled entry on `#science` after the existing water-story invitation and before the three mission choices: **Look at the Water Evidence Shelf**. Its intro says, “Three made-up before-and-after pictures. Notice a clue, then choose a careful explanation. No real water or equipment is needed.” The intro and all cards remain open regardless of mission history. Existing Water Lab visits and Rain Paths stay separate.

Use one card per short screen, with **Previous picture**, **Next picture**, and **Back to Water Lab** controls. Cards can be visited in any order after opening; no response is required to proceed. Each screen shows only its own pair of illustrated panels, the supplied setup, three paired clue/explanation notes, and optional **Show a clue** and **Talk together** support. Selection and optional feedback remain visible when the learner goes to another card and back during this shelf pass. A child can change a choice at any time. The close returns to the Water Lab; re-entry begins a fresh pass. Browser Back between shelf card pages keeps the same pass, while leaving the shelf for any other route, changing explorer, reset, or reload ends it. A direct or stale card URL after reload opens the shelf intro without inventing a previous choice. The page says, “These choices stay while this shelf is open. They are not saved in the notebook.”

The smallest implementation is a per-explorer, in-memory shelf session with a three-slot choice array and support/reveal flags, held across render and card route changes, cleared on the above exits. Do not add a `science.visits` entry, optional root, report fields, transfer schema, localStorage key, history list, result count, familiarity flag, or assessment record. Rendering the shelf must not start or alter a molecule visit. Existing save-off, export, import, reset, and notebook behavior continue to cover existing records only. No “completed” result is created by opening, choosing, viewing feedback, or reaching card three. If the implementation cannot reliably distinguish a card-to-card route from an exit under the current router, prefer one `#science/evidence` route with an in-view page index; the observable lifecycle above is mandatory, the hash shape is not.

## Exact authored pack

The first panel of each card is labeled **Before**; the second is **Later**, with no elapsed time, quantity, measured rate, temperature, weather, or hidden route asserted. Original simple SVG/CSS outlines and fills only, with text alternatives carrying all clues. Each panel is an illustration, not a photo or observation log. Avoid animation implying a path that was not observed. The explanation options remain in the listed order during a shelf pass; the fitting option moves from position 1 to 2 to 3 across cards. Position is never shuffled after a choice.

### Card 1 · A smaller puddle

**Supplied scene:** “A made-up garden path is shown twice. Nothing between the pictures shows where the water went.” Draw the same path and ground outline in both panels. The later blue puddle outline is visibly smaller. No arrows, soil color change, drain, sun, or vapor symbol appears.

**Prompt:** “Which note fits these pictures best?”

1. **Fits:** “The puddle looks smaller. Flowing, soaking, or joining the air could explain some of that change.”
2. “The puddle looks smaller. Every bit of its missing water must have joined the air.”
3. “The puddle looks smaller. We cannot suggest any route until we watch the water travel.”

**Show a clue:** “Visible clue: the blue puddle outline is smaller later. Its route is not shown.”

**Feedback after a choice:** “The smaller outline is in the picture. A route is an explanation, not a directly seen event here. Water could flow, soak into ground, or evaporate; this pair does not show how much followed any route.” For option 2 add, “The picture cannot single out evaporation.” For option 3 add, “A picture can support a possible route without showing the route happen.”

**Talk together:** “Point to the change you can see. What extra clue might help you distinguish flowing from soaking?”

### Card 2 · A darker patch

**Supplied scene:** “A made-up patch of soil is shown twice. Later, the surface patch near a smaller puddle is darker.” Draw the same level soil outline and puddle in both panels. The later puddle is smaller and a bounded neighboring soil patch is darker. Show no underground cutaway, depth arrow, drain, rainfall, or evaporating vapor. Color is accompanied by a patterned outline and the text label “darker surface patch,” so color alone carries no clue.

**Prompt:** “Which note fits these pictures best?”

1. “The patch looks darker. That gives no clue about any possible route into soil.”
2. **Fits:** “The patch looks darker. Soaking could explain some water, though other routes may also matter.”
3. “The patch looks darker. Every drop went deep underground and nowhere else.”

**Show a clue:** “Visible clues: the puddle is smaller and a nearby surface patch is darker later. Nothing below the surface is pictured.”

**Feedback after a choice:** “The darker surface is a clue compatible with wet soil, not a measurement or proof of infiltration. Soaking is possible. The drawing cannot establish depth, amount, or exclude flow and evaporation.” For option 1 add, “A clue can support a possibility without proving it.” For option 3 add, “No deep route is shown.”

**Talk together:** “What part of the soil is pictured? What would we need to check before claiming water went deep?”

### Card 3 · The open dish

**Supplied scene:** “In this made-up scene, the same open, level dish sits on a nonabsorbent table. Nobody pours or spills water, and the dish has no drain.” Draw the same dish and table both times. The later waterline is lower. Show no measuring marks, clock, scale, heating, boiling, visible vapor, or rain. The no-pour/no-spill/no-drain facts are *supplied conditions of the story*, not observations established by the two pictures.

**Prompt:** “Which note fits these pictures best?”

1. “The line is lower. Since vapor is unseen, we cannot even suggest evaporation here.”
2. “The line is lower. The picture proves exactly how much water became vapor.”
3. **Fits:** “The line is lower. In this supplied scene, evaporation fits, though we cannot see vapor.”

**Show a clue:** “Visible clue: the later waterline is lower. The no-pour, no-spill, and no-drain conditions come from the story, not the drawing.”

**Feedback after a choice:** “A lower line plus the supplied conditions makes evaporation a reasonable explanation. Evaporation changes liquid water to water vapor; the vapor is not directly seen here. The still pictures are neither a measurement nor proof of a unique cause or quantity.” For option 1 add, “An unseen process can still be a supported possibility.” For option 2 add, “No amount was measured.”

**Talk together:** “Which part did the picture show? Which part did the story tell us? What remains unseen?”

## Presentation and support

Use a compact page with the two panels side by side when space allows and stacked on a narrow screen. The picture alternative must describe the before/after change without asserting a route. Labels and patterns make the soil clue and waterline understandable without color vision. Native radio buttons or equivalently keyboard-operable controls expose the choice, selected state, and an optional **Read the note** action. The fitting choice receives no score, celebratory grade, badge, lock, or evidence promotion. Feedback is specific to the selected option; an unselected note remains just a note. **Show a clue** and **Talk together** are optional, never prerequisites, and remain visibly distinguishable from an unassisted selection. If local narration is offered through the existing play-media control, it reads current displayed text only; a request or failed playback is not an observed reading result.

Use American spelling in new visible copy and no em dashes. A grown-up disclosure on the shelf links the primary sources in the audit, credits the original drawings, and states that pictured cases cannot test a real path, soil, dish, flood barrier, or water safety. No real floodwater, heating, or home experiment is requested. Do not reuse an external illustration, screenshot, or lesson sentence.

## Acceptance for implementation review

- The shelf starts from the Water Lab hub without creating a visit or changing an unfinished Water Lab mission; all three existing missions still open and resume.
- Three exact supplied scenes render with accurate text alternatives. The fitting option positions are 1, 2, and 3; each wrong option receives the stated reason rather than a generic “incorrect.” No answer is required to navigate.
- A choice, feedback reveal, and optional support on card 1 survive card 1 → 2 → 1 within one pass. Leaving the shelf, switching explorer, resetting, or reloading clears them, and direct/stale card links recover to the intro. Existing saved records and export bytes contain no shelf result.
- On phone and tablet, keyboard and touch can reach every option and page control; focus lands on the new card heading after page change and on visible feedback after **Read the note**. No overlay blocks a control. Text alternatives disclose every visible clue without claiming invisible vapor or underground movement.
- The dish’s story conditions are labeled supplied rather than seen; all feedback keeps clue, inference, and limits separate. A dark patch suggests a possible soil route without excluding other routes. No card asserts a numerical rate, measured amount, actual experiment, or full water-cycle attainment.
- Focused source-content checks cover all option orders and scientific qualifiers; an actual-browser pass covers navigation/choice preservation/exit recovery and checks existing Water Lab saved visits after shelf use. Independent implementation review follows before a PR.

## Source and reuse decision

The [source audit](../source-audits/82-water-evidence-shelf.md) records current primary links, the exact Jane/Marble refresh, partial source meanings, and license boundaries. We study Jane’s brief authored stages and separate optional help; we do not adopt its grades, mastery, generated packs, or code. We reuse the local Water Lab hub and original short-card UI conventions while keeping this optional session outside its saved molecule-visit contract. We study Marble’s observation/interpretation and evaporation topics as partial context, not as a rubric or a claim of full topic coverage. No upstream code, art, lesson prose, runtime topic mapping, or graph edge is incorporated.
