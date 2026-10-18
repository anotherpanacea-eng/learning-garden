# First Learning Garden visit

## Goal

Ship one complete, parent-guided visit inside the existing app: a selectable guide and independent avatar choice, three meaningful entrances into First Morning, and an ending with a small off-screen project. Preserve all existing Number Garden activities and browser-local records. The public repository contains generic content and synthetic tests only.

## Experience

The After the Storm home opens on an illustrated garden after rain. A guide introduces a creature to help, a mysterious message, and a shelter to make. Each entrance starts a different short path. A child can finish any one path; all three are never required. At a stopping point the child can visit a different path or take an idea into the world. Number Garden remains a clearly labelled destination with its existing seven areas.

The companion picker offers Mira (young woman, she/her), Rowan (young man, he/him), and Ari (nonbinary, they/them). Their subject access, warmth, and competence are equal. Each has original illustrated portrait and a little personality. Guide selection is independent from the child's girl, boy, or neutral explorer avatar. No name, age, grade, demographic or free-text profile fields. Choices are changeable at any time and obey the existing persistence switch.

## Bounded content

Overall title: After the Storm. The Learning Garden is the first place; First Morning is the opening visit. Pip and Dot remain fictional garden creatures. Three entrances: follow a creature's trail; investigate a note; design a shelter for a fictional creature. Each path has its own opening, two or three short task/project nodes, and its own concluding outcome. Optional links cross between the paths without requiring all subjects. At least reading, science, making/design, and mathematics occur across the adventure. An entrance changes the order and work encountered, not just the caption over identical questions.

Task nodes use choice or numeric answers with authored hints and explanations. Project nodes invite drawing, predicting, building a model, or discussing an idea; they are explicitly unscored. Do not ask for photos, recordings, or uploaded work. Projects need only paper, loose counters or objects, and help from a grown-up if desired. No real animal handling, construction tools, electricity or food. Simple scientific claims must be accurate within the stated example; measured model-test results are story data, not claims that a material always behaves that way.

Every path ending must offer one concrete, optional off-screen project with ordinary materials and a clear invitation. A child can stop at that ending without completing the project; the app records only that the invitation was acknowledged.

## Flow and state

Keep number-garden-v1 and number-garden-save. Extend state with garden:{guide,avatar,current,visits,observations,seen}, validating saved values and retaining legacy baseline/practice/puzzles/broad state. Each visit stores entrance, current node, per-node drafts, recorded node IDs, visited nodes, and finished flag. Starting another entrance while one is in progress requires an explicit choice to continue the current visit or begin a new visit; preserve the earlier visit and resume it from the notebook. A completed path can be replayed as a new visit. Prior encounters stay marked; repeated visits never become fresh evidence.

Routes: #home new front door; #companions picker; #storm hub and resumable visits; #storm/play current node; #storm/end current ending; #numbers original broad math home; all existing math routes preserved; #notes includes story observations alongside separate math records. Unknown/invalid routes safely fall back. Reload and leaving a node preserve input, attempts, hints, model/project support, selection, and the current position. Back/jump must not silently skip or re-record answers. Use node completion and explicit continuation to advance, not route-only assertions.

For a task, show gentle feedback, allow hints, worked explanation, retry, skip, or stop. After a correct answer ask how it was found: knew, worked out, counted, or together. Hints, explanations, extra tries, familiarity, project teaching, and reported support remain attached to the task. A displayed essential diagram is part of the question; an optional helping model counts as support. A node may be left unassessed. No mastery/placement inference, timers, points, streaks, locks, or rewards for speed. At every node provide an unambiguous way to leave for the garden and resume later.

Project continuation is unscored and recorded as an invitation acknowledged, not proof that an off-screen task was performed or a skill mastered. A help/adult-read toggle can mark parent support, but does not imply independent reading by default. Reading mode must explicitly say read independently/read together/not observed; mathematical independent reasoning must not be used as evidence of independent reading. Parent notebook/export labels original task, attempts, support, familiarity, method, and skipped/unscored statuses. Finishing one path does not claim other subjects were assessed.

Story math facts and any displayed worked multiplication examples must feed the existing exact/commuted fact exposure mechanism and update paused math check-in drafts. Story observations stay separate from broad and original math observations. Existing JSON export, saving-off, reset, and storage failure behavior apply to all new fields. No network submission, analytics, AI conversation, identity field or server-side learner data. No public learned-data fixtures.

## Visual direction

Keep the established garden palette: ink green #183f39, leaf #397958, sunlight #e9b84a, rain blue #abc4da, blossom #da8d8d, paper #fafbf8. Use the current local system typography, with generous child-readable task text. The memorable element is one original illustrated garden map with three clearly labelled paths; quiet controls and readable story panels surround it. Guides and explorers are original SVG art, with varied features and all identities afforded equal care. Portraits are labelled; decorative scenes are hidden from assistive tech when adjacent text provides meaning. No external font, image, or icon dependency.

Avoid a generic card dashboard: use a map/scene, one reading panel, a companion rail and distinct path signposts. Review before coding: same-sized math topic cards remain inside Number Garden; the new front door is a place with paths. Layout must remain usable on iPad and small screens, with labelled focus states, adequate contrast, large touch targets, reduced-motion respect, and no interaction that depends on hover or dragging.

## Verification and release

Independent spec review before building; resolve findings. Root owns integration. Independent implementation/content review and browser QA are required before Site publication. Obtain independent Claude clearance on the exact candidate before any GitHub merge; keep the PR as a draft and unmerged while that clearance is unavailable or unresolved. Preserve source branches. Site publication of an independently reviewed candidate does not require merging the GitHub PR. Existing public Sites origin remains the deployment target, preserving browser origin/storage. The public GitHub checkout is the development source; the Sites checkout retains its ignored deployment identity. Copy reviewed dist assets into it after comparison and package through the Sites helper, which owns its source synchronization. Do not add the Site identity, private paths or credentials to GitHub. Publish the reviewed first visit to the current public link.

Checks: existing 156 logic checks; new branching/resumption/skip/retry/support/familiarity/fact-exposure/migration tests; all task keys and content reviewed; every entrance has a reachable ending; unscored project completion is not a mastery observation. Browser: all three paths, changing independent companion choices, navigating between old math and new story, reload draft, finished revisit, saving off and notes export. Verify no-child-data source/commit diff and anonymous public access. Capture a screenshot for the result.
