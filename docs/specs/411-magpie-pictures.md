# 411 · Magpie Pictures

Status: proposed bounded implementation; independent specification and complete finite language/visual review before code. Serves admitted LG-1 / LG-G1. Selects the English-only first encounter from [265](265-magpie-takes-it-literally.md), not its full seven-bench programme.

## Purpose and boundary

Render with `riddlesPage(state,{owner,child})`, where child means exact canonical hash; bind with notebook/isActive/owner and speech/sound callbacks. Inside canonical `#riddles`, offer **Explore the magpie's pictures** once in every parent state, including absent, current/revealed, unreadable-current and unsupported-root states. A make-believe welcome-back café party connects this to the storm-recovery town. The talking magpie draws the exact words it hears; the guests also use familiar English sayings. The bird's picture is the joke, never the child. Unknown sayings are learned with people and sources; guessing is optional.

Existing Word Garden34 owns playful word construction; Sentence Bridges109/404 owns clause joins/details; Word Needs a Sentence354 owns contextual vowel readings; Riddles94 owns its saved riddle cards/answers. None of their runtime content teaches these six idiom/context contrasts. This adds illustrated interpretation and literal/nonliteral comparison, not a general language grader, novel study, translation, diagnosis, story credit or attainment record. No new route, notebook root, telemetry, public learner content or external media service.

## Three pages and finite state

Pages **Party pictures**, **See why**, **Sort the sayings** are freely reachable. One current scene, teaching card or sorting card at a time; context and quoted words stay visible with their choices/reference. Native selectors and bounded Previous/Next allow revisiting without losing material. No drag, timer, penalty, right/wrong coloring, automatic correction or prerequisite lock.

`createMagpiePictures()` returns `{page:'party',scene:0,ideas:[null,null,null,null,null,null],references:[false,false,false,false,false,false],lesson:0,sort:0,trays:[null,null,null,null,null,null],sortReferences:[false,false,false,false,false,false]}`. Three modules: core (constructor, reducer, model and narration), content, and UI. Reducer `changeMagpiePictures(work,action,value)` is immutable and leaves invalid/no-op input unchanged:

| action | bounds / effect |
| --- | --- |
| page | party/learn/sort |
| scene | index 0–5; preserves all ideas/references |
| idea | current scene integer choice 0–2 or `unsure`; no feedback/key comparison or auto-reveal |
| clear-idea | current scene null only |
| reference | toggle current scene's explicit prepared reading |
| lesson | index 0–3 |
| sort | index 0–5; preserves all placements/reference states |
| tray | current sorting card `literal` or `figurative`; retained even if unexpected |
| clear-tray | current sorting card null only |
| sort-reference | toggle current card's separate prepared classification/explanation |

No `outcome`, correct tally, exposure, support, first-try, mastery, score or visit-as-learning flag. Six scene choices have context-fitting positions 1,2,3,2,1,3 (zero-based 0,1,2,1,0,2), stable within the visit. Choices use fixed authored order, never shuffled. Selected ideas and trays use aria-pressed, never disabled. All pictures can be explored; the reference never overwrites the child's idea or tray. A separate **Not sure yet** choice and clear controls remain available. Selecting an idea shows its neutral caption and selected state, not a verdict. **Show a reading of this scene / Hide this reading** reveals the prepared context meaning, matching original image and named clue; it is a supported reading of this authored scene, not a universal interpretation algorithm. Keep alternate imaginative readings available for discussion.

## Complete six party scenes and original visual packet

All dialogue, contexts, captions and SVG vignettes are original, adapting the six party-line concepts in265. Each scene shows its context, speaker/quote and **The magpie's word picture**, then three labeled picture choices under **Your idea**. Optional reference appears separately below, leaving choice/buttons visible. Use a compact two-column tablet arrangement (bird picture beside choices), stacked on phone; one reference image beside its plain reading/clue. Illustrations have captions and honest alt text. Choices may use thumbnails, never words hidden inside a scaled image.

Pictures are gentle imagined drawings, not reported events. No animal is eaten, hurt, tied in a bag or falling into danger. The horse stands smiling on an oversized plate; the cat freely steps from an open paper bag; rain animals float safely with tiny umbrellas; butterflies are drawn on the magpie's imaginary dragon outline, not as anatomy. Literal ice picture uses a lemonade bowl and wooden spoon, not a frozen pond. The intended scene art depicts the contextual action/feeling, with text carrying meanings a drawing cannot settle. Use unique `magpie-` classes, data hooks and IDs; verify they do not collide with existing styles. No borrowed graphics, clip paths with repeated IDs, new fonts or generated private contact sheet.

### 0 · Supper (fitting choice 0)

Context: **Pip has carried chairs all afternoon. Supper smells good, and Pip is waiting eagerly for a bowl of soup.**
Speaker/quote: **Pip: “I could eat a horse.”**
Choices, in order:
0. **I am very hungry.** Image `hungry`: Pip, empty plate, waiting soup/bun, a small eager gesture.
1. **I could eat a whole horse.** Image `horse-plate`: a cheerful whole horse standing unharmed on a large imaginary plate.
2. **I want to ride a horse.** Image `horse-ride`: Pip beside a saddled wooden hobby horse, no meal.
Bird image: `horse-plate`.
Prepared meaning: **Pip means Pip is very hungry, using an exaggerated saying.**
Clue: **Pip has worked all afternoon and is waiting for supper.**
Reference image: `hungry`. Do not invent an origin story or say every use of this sentence must have this meaning.

### 1 · New guests (fitting choice 1)

Context: **The new guests sit quietly. Dot smiles and asks everyone about favorite games.**
Quote: **Dot: “Let's break the ice.”**
0. **Leave before the party starts.** Image `leaving`: Dot walking toward the café doorway with a coat.
1. **Start a friendly conversation.** Image `greeting`: Dot waving to two guests, empty speech bubbles/party table.
2. **Break a real piece of ice.** Image `ice-bowl`: wooden spoon cracking a piece of ice in a lemonade bowl.
Bird: `ice-bowl`. Meaning: **Dot means helping the guests begin talking comfortably.** Clue: **The guests are quiet, and Dot asks a friendly question.** Reference: `greeting`.

### 2 · Welcome speech (fitting choice 2)

Context: **Ember is about to give a first welcome speech. Ember worries about forgetting the words and holds the speech card tightly.**
Quote: **Ember: “I've got butterflies in my stomach.”**
0. **Butterflies inside my body.** Image `butterfly-outline`: magpie's paper drawing of a dragon outline with butterfly shapes, clearly imaginary.
1. **Hoping to see butterflies.** Image `butterfly-garden`: Ember looking at butterflies over flowers, no speech.
2. **Nervous before my speech.** Image `nervous-speech`: Ember with speech card, small worry marks and waiting podium.
Bird: `butterfly-outline`. Meaning: **Ember means feeling nervous about the speech.** Clue: **Ember is worried about forgetting the words.** Reference: `nervous-speech`. This is a reading of fictional words, not a diagnosis or a biological model.

### 3 · Surprise news (fitting choice 1)

Context: **The welcome song was meant to be a surprise for Ember. Pip told Ember about it before the party began. Bramble points at the song banner.**
Quote: **Bramble: “Pip let the cat out of the bag.”**
0. **Pip let a real cat out.** Image `cat-bag`: cat freely stepping from an open paper bag.
1. **Pip told the surprise early.** Image `song-news`: Pip revealing a musical banner to Ember.
2. **Pip mended a torn paper bag.** Image `mend-bag`: Pip placing a paper patch on an empty torn bag.
Bird: `cat-bag`. Meaning: **Bramble means Pip revealed the surprise.** Clue: **Pip told Ember about the song before it was time.** Reference: `song-news`. Never ask a child to supply or keep a real personal secret.

### 4 · Easy riddle (fitting choice 0)

Context: **Dot reads a riddle once and answers right away. No one is serving dessert right now.**
Quote: **Dot: “That riddle was a piece of cake.”**
0. **That riddle felt easy.** Image `easy-riddle`: Dot beside a simple riddle card and a relaxed smile, no evaluative checkmark/score.
1. **That riddle needs icing.** Image `icing-card`: magpie drawing an icing swirl on a paper card.
2. **That riddle was dessert.** Image `riddle-cake`: a paper riddle resting on an imaginary slice of cake.
Bird: `riddle-cake`. Meaning: **Dot means the riddle felt easy.** Clue: **Dot answered the riddle right away.** Reference: `easy-riddle`. Do not invent the etymology that cake is easy to eat, or imply the riddle is easy for every reader.

### 5 · Outside the window (fitting choice 2)

Context: **Rain hits the café window loudly. Big puddles cover the path. The guests stay indoors and look out at the rain.**
Quote: **The miller: “It's raining cats and dogs.”**
0. **Only a little rain is falling.** Image `light-rain`: a few imagined drops outside a window.
1. **Cats and dogs come down from clouds.** Image `rain-animals`: friendly imagined animals drifting gently down under tiny umbrellas beside a cloud.
2. **Rain is falling very heavily.** Image `heavy-rain`: large rain streaks and puddles outside a dry café window, the guests dry indoors; no animals in the sky.
Bird: `rain-animals`. Meaning: **The miller means the rain is very heavy.** Clue: **The scene already tells us about loud rain and big puddles.** Reference: `heavy-rain`. Choice0 is a light-rain reading ruled out by the loud rain and big puddles; it does not stand for a child's uncertainty. These images are not forecasts or actual weather observations.

## Four teaching cards (complete content/visual meaning)

The following quoted text is the exact child copy; image lists and other notes are author instructions.

1. **Words and feelings.** “Read or hear these make-believe scenes together. Hungry can mean wanting food. Here, nervous means worried about the coming speech. Which words tell you how Pip or Ember feels? You can ask what a new word means.” Images `hungry` / `nervous-speech`; no hidden score.
2. **A saying can make a picture.** “Words used literally mean just what they name. Words used figuratively mean something more than, or different from, that exact picture. Some English sayings are idioms: a whole phrase has a learned meaning. Compare Dot's easy riddle with the magpie's picture of a riddle on cake.” Images `easy-riddle` / `riddle-cake`; no etymology.
3. **Context matters.** “A real slice of cake can be dessert. ‘A piece of cake’ can also describe an easy task. Ice in a bowl can really be broken. When Dot greets the quiet guests, ‘break the ice’ means starting a conversation. Don't only ask, ‘Could this really happen?’ Read the words around it. If you do not know a saying, ask or look it up with a person.” Images `ice-bowl` / `greeting`, separately labeled.
4. **Compare without erasing your idea.** “Keep your idea beside another reading. Try each saying used literally beside its party use. Literal and figurative describe how words are used, not whether someone is honest or a story is true. Another language or community may use different sayings. You can talk about other imagined meanings too.” Images `cat-bag` / `song-news`, separately labeled.

## Six sorting cards (complete contexts / references)

Two stable tray buttons **Words used literally here** / **Words used figuratively here**, plus **Clear my tray**. Show current context/quote and its selected tray, with no grading. Optional **Show a reading of this card** shows its reference classification and reason separately. Reference types in authored order are literal, figurative, figurative, literal, literal, figurative; all original placements stay unchanged.

| id | context and quoted line | reference / reason / picture |
| --- | --- | --- |
| cake-food | A real cake is on the café table. Dot points at one slice: “Please pass a piece of cake.” | literal; Dot asks for a real slice of food; `cake-slice` (original simple cake plate) |
| cake-task | Dot solved a riddle quickly and said it felt easy: “That riddle was a piece of cake.” | figurative; the phrase describes an easy task here, not dessert; `easy-riddle` |
| cat-news | Pip announced the surprise song to Ember before the party began. Bramble had meant the news to wait: “Pip let the cat out of the bag.” | figurative; Pip revealed the surprise; `song-news` |
| cat-animal | The miller's cat is curled in an open paper bag. Dot holds the bag wide: “Let the cat out of the bag.” | literal; a real cat is leaving a real open bag; `cat-bag` |
| ice-object | A big lump of ice sits in a lemonade bowl. Dot asks Pip to crack it with a wooden spoon: “Break the ice.” | literal; Dot means a real piece of ice; `ice-bowl` |
| ice-talk | New guests sit quietly. Dot begins a friendly name game so everyone can talk: “Let's break the ice.” | figurative; Dot means starting conversation; `greeting` |

## Complete interface and art text

Entry title: **The magpie's pictures**. Entry intro: **Visit a make-believe party. What pictures do the guests' sayings make?** Place entry outside every riddle card and recovery details, after the ordinary own-riddle aside or after the unsupported/recovery panel.

Child intro: **A make-believe party. These pictures are imagined, not things that happened.** See-why intro: **Look at words, pictures and the words around a saying.** Sorting intro: **Compare three sayings used literally with their party uses. Keep your own idea, then open another reading if you wish.** Own uncertainty caption: **Not sure yet. We can look together.** Clear button: **Clear my idea**. Sort hide button: **Hide this reading**. Scene reference hide button is also **Hide this reading**. Back button: **Back to Riddles**. Other navigation labels are the page titles, **Previous**, **Next**, **Hear this page**, and the corresponding **Choose a scene / Choose a teaching card / Choose a sorting card** labels. Clear-tray label is specified above. Choice captions are exactly their choice texts; prepared reference captions use their meaning/reason. No other instructional claims are commissioned.

Art has no internal IDs, so repeating a figure is safe. Each standalone SVG uses the following exact accessible description; choice thumbnails are decorative (`aria-hidden=true`) because their button text names the idea. Standalone picture captions use these same descriptions. None represents an actual observation:

| art id | description |
| --- | --- |
| hungry | Pip waits beside an empty plate, soup and a bun. |
| horse-plate | An imagined smiling horse stands safely on an oversized plate. |
| horse-ride | Pip stands beside a wooden hobby horse. |
| ice-bowl | A wooden spoon cracks a real piece of ice in a lemonade bowl. |
| greeting | Dot waves to two quiet guests at the party table. |
| leaving | Dot takes a coat toward the café doorway. |
| butterfly-outline | Imagined butterflies sit inside a paper drawing of a dragon. |
| butterfly-garden | Ember watches butterflies above flowers. |
| nervous-speech | Ember holds a speech card tightly beside a waiting podium. |
| cat-bag | A cat steps freely out of an open paper bag. |
| song-news | Pip shows Ember a musical banner before the surprise song. |
| mend-bag | Pip patches an empty torn paper bag. |
| easy-riddle | Dot smiles calmly beside a riddle card. |
| riddle-cake | An imagined riddle card rests on a slice of cake. |
| icing-card | The magpie draws an icing swirl on a paper card. |
| light-rain | A few imagined raindrops fall outside a window. |
| rain-animals | Imagined cats and dogs drift safely down under tiny umbrellas. |
| heavy-rain | Heavy rain and big puddles are outside; the guests are dry indoors. |
| cake-slice | A real slice of cake rests on a café plate. |

## Model, narration and host lifecycle

Export finite content arrays, `createMagpiePictures`, `changeMagpiePictures`, `magpiePicturesModel`, `magpiePicturesNarration`, `magpiePicturesPage`, `bindMagpiePictures`. Model resolves current scene/idea caption/image, current optional reference/clue, teaching card or sorting card/own tray/optional reference. UI converts dropdown values with Number; reducers accept only integers within range. No correctness result is derived from a child's choice. Reference-hidden means meaning, clue and fit-position markers are absent, not that repeated choice art is absent. Figures carry `data-magpie-art` within their bird/choice/reference areas, and contain no SVG text. Actions tied to a page act only on that page. Art IDs are finite author data and have a neutral text fallback; never render an undefined figure.

Narration covers visible current page: context, speaker/quote, named bird picture and three choices, own selection or uncertainty, reference/clue only when open; current teaching words and relevant pictures; or current sort context/quote/own tray plus reference only when open. Read pictured meaning in honest words, not just “picture1”. Include Back and lifetime. Do not voice another scene, hidden reference/help, imply a child's picture occurred, or automatically speak on selection. Optional Hear uses the existing local voice service; a person can read together. Existing deliberate Voice/speed preference and daily-room writers stay separate; child interactions themselves do not save.

Lifetime: **Your pictures and trays stay while you visit Riddles. Leaving the room or opening the explorer chooser clears them. Your riddle cards and notes are not changed.** Exact room is `#riddles`; leaving/import/owner/notebook/reset retires visit work. No new external-room link is needed. Back to Riddles is a button and retains child work on re-entry during the same visit.

Extend `riddles-ui.mjs` with one visit object, one parent frame and its existing writer handlers. Parent frame captures actual `book.riddles` identity/value and Object.hasOwn(book,'riddles') (not `riddleView`'s fresh absent-root object), owner/notebook, current source/picks/clue/outcome through that raw value, and the recovery disclosure's open state. No model mutation from viewing. Replace the whole parent markup with child markup while active. Back restores the original current card, choice order, size, picks/help/result and recovery disclosure, without pull/shuffle/save or a new parent observation. Render a restored disclosure already open, and initialize its confirmation explicitly against the verified same raw root/value before binding. Do not rely on an asynchronous toggle to re-arm restoration. Closed or cancelled disclosure cannot confirm until deliberately reopened against the current root. Old parent/child/recovery/Hear controls never revive.

Reuse the local generation/ancestor-removal/visibility guard pattern from Seed Stall410 or Living Layers408 without extracting a new shared framework. Listener invalidity (root not current/connected/visible, removed/reinserted/reparented controls, owner/notebook/route/generation mismatch) drops an event before state/render/speech or any writer. Check source identity AND raw value separately: if it changed under a current visible child, cancel the old return frame, render current parent, discard stale recovery-fold restoration and focus child entry without replay; retain only child work for the same notebook/owner/room. Ordinary redraw does not invalidate an unchanged return frame. Callback context must match actual app, with `notebook:()=>state`, live explorerId, exact-room child predicate and stopSpeech/stopSound. Child receives only live/change/render/focus/back/stopSpeech/stopSound, no save/canExport/writer. Parent handlers keep existing notes preflight/atomicity. Parent aliases keep their existing behavior and omit the child entry.

App imports a narrow `resetMagpiePicturesVisit`; invoke before any early room return when hash is not exact `#riddles` or explorer picker is open. Both synchronous and observed generic how-to insertion skip `[data-magpie-root]`; the ordinary riddle-answer tutorial stays only on parent. A child makes no parent riddle/root, answer, support or story record, even from missing or unsupported parents.

Exact hooks: entry button `[data-magpie-entry]`, root `[data-magpie-root]`, title `#magpie-title`. Focus entry/re-entry title, Back/source recovery entry, page heading `#magpie-page-title`, teaching `#magpie-lesson`, current sorting heading `#magpie-sort-title`; scene heading `#magpie-scene-title`; native selectors `#magpie-scene`, `#magpie-lesson-select`, `#magpie-sort-select`; Previous/Next use stable direction selectors and select/heading fallback at boundaries; idea/reference/tray/clear controls retain useful acting control, falling back to the scene/tray heading if they become disabled. Capture handlers before shared Hear; stop old speech on redraw. Every newly used label has its proper control. Namespaces must be checked against the loaded app, not only a detached render.

## Curriculum and upstream/source boundary

[49](49-six-act-curriculum.md) §5: explicit words/feelings and figurative/context teaching; contrast same expression in literal and figurative scenes; supported picture/reading comparison; paired literal and party-use sorting; purposeful return to another case or, with a person, another saying. E2-II/IV, E3-II/III, E5-I/II. [120](120-keeper-of-the-ways.md): Act II/III welcome-back gathering; standalone, open without story progress. No figure settles the town's later plans. Every scene is labeled fiction; pictures do not prove actual events.

Refreshed2026-11-07: Jane `c681f6bf2f2adf2aa032f765983a4691774cfba5` LESSONS.md and Marble `04962c78ccb8bd52b236512d3362405bace98d2a` topics/dependencies (heads verified unchanged from410's refreshed files). Jane's ordered encounters and optional examples are studied, no code/prose/images copied. Marble descriptions/hard edges guide partial candidates only, no copied teaching research or graph update:

| candidate | hard prerequisite in bundled and refreshed graph | bounded support |
| --- | --- | --- |
| Expressive and Sensory Language `mt_fL1Xz8ostr` | Listening to Texts Read Aloud `mt_mLPEMpYb_R` | adult/Hear read-and-discuss tiny scenes; card1 notices hunger/nervous words; full sensory/poetry target unclaimed |
| Literal vs Figurative Language `mt_SUOhjmRqv9` | expressive/sensory above | explicit picture/context contrast and six paired sort cases; no general interpretation assessment |
| Idioms & Proverbs `mt_IoGOSAQ8bz` | literal/figurative above | six familiar English sayings only; no proverb/adage, allusion, device catalogue or etymology coverage |

Primary language references studied, paraphrased only: [Open University, Describing language, Week8 §4.1](https://www.open.edu/openlearn/mod/oucontent/view.php?id=113158&section=4.1) directly opened, including idiom/context discussion and cake/rain/cat examples; [Cambridge eating-idioms article](https://dictionaryblog.cambridge.org/2016/10/19/idioms-and-phrases-related-to-eating/) directly opened for could-eat-a-horse. Cambridge dictionary entries for [butterflies](https://dictionary.cambridge.org/dictionary/english/butterflies-in-stomach), [cake](https://dictionary.cambridge.org/dictionary/english/piece-of-cake), [cat](https://dictionary.cambridge.org/dictionary/english/let-the-cat-out-of-the-bag) and [ice](https://dictionary.cambridge.org/dictionary/english/break-the-ice) blocked direct fetch (403), but their publisher search-rendered definitions/examples were checked. Do not describe those as directly opened. The official State Department *In the Loop* break-ice entry was visible through a search-rendered book copy; no whole-book/edition identity or copied illustrations are claimed. No etymology, animal-behavior fact, physiological explanation, foreign-language line or psychological diagnosis is incorporated. All actual scene/choice/meaning wording and artwork here are original. Do not copy third-party dictionary definitions, activities, prose, photos or diagrams.

## Acceptance and release

Independent six-lens spec and complete finite English/context/image-description review before runtime: every context, quote, all18 choices, prepared reading/clue, picture prompt, four teaching cards, six sort contexts/reference reasons and narration constraints. Review conventional meaning versus scene-specific inference, no impossible=figurative shortcut, no guesses-as-ability judgment, no dictionary etymology invention, respectful unfamiliarity and harmless imagined animals. Content-language judgment is not mechanically certified.

Meaningful core checks: immutable finite actions/ranges/no-ops; per-scene choice/reference retention; uncertainty/clear; own choice/placement unchanged by reference; current-page-only narration with hidden keys excluded; expected finite mapping/choice order and paired contexts; no parent notebook dependency or writer. For every idea, core/model and markup must expose no fit/correct verdict; all choices use the same classes/attributes except selected state and their own caption. Closed references are absent from markup, not CSS-hidden. No prose-in-spec golden, huge answer permutation harness or new registry. Register all three prose modules after the existing first adult-scope child-copy fixture.

Actual app Chrome: a waiting saved riddle (own words/order/picks/clue) → child picture choices and reference → Back same parent/re-entry own work; six scenes/revised unexpected ideas and all sort contexts; live Hear text plus actual image/alt/caption identity; current context preserved across pages; open/cancelled unreadable-card recovery disclosure and unsupported/absent parent roots; actual in-memory notebook, persistent records, Notes and relevant storage equality through child actions; explicit synthetic parent identity/value invalidation before replay; old/hidden/detached/reinserted/reparented parent/child/Hear/recovery controls, owner/import/exact route/reset boundaries. One full tablet journey plus focused phone geometry and keyboard/meaningful focus; all controls44px, actual label/image text16px, original vignette containment, no clipping/overlapping/zero-height legend/global style collision. Root inspect full and viewport pictures, not assertion counts. Original Riddles browser regression and full source once stable/integrated with main; affected checks after repair. No physical-device, audible or learning-outcome claim.

Exact-head independent Claude implementation clearance, repair, ready/release custody, merge commit, clean authorized deployment, every tracked hosted asset match and Home/touched-room smoke. One canonical PR receipt linked once from roadmap. Existing French462 Gemini hold and pixel487 draft remain separate. Do not add general schemas, manifests, orchestrators or arbitrary access gates.
