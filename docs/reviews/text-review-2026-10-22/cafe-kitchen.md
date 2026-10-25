# Text review: Café and kitchen activities

Scope: `dist/cafe-content.mjs`, `cafe-core.mjs`, `cafe-ui.mjs`, `cafe-film.html`, `restaurant-story.mjs`, `measuring-recipes-*.mjs`, `sharing-counter-*.mjs`, `whole-batches-*.mjs`, `parcel-packing-*.mjs` (snapshot of main). I read only strings a child or grown-up sees or hears. Line numbers refer to the dist files.

Overall: the café itself (guests, greetings, thanks, Pip and Dot asides) has the strongest voice in this group. The four kitchen side activities (Measuring Kitchen, Sharing Counter, Whole Batches, Willow's packing table) are much weaker. Their help text, status lines and feedback read like the spec that produced them ("supplied", "familiar", "literal", "nonempty", "partition", "scaffold", "draft", "snapshot"). That makes them hard to decode and very hard to listen to.

---

## Top issues

1. **Spec vocabulary in child-facing instructions across all four side activities.** Examples:
   - `whole-batches-ui.mjs:34` "The literal message matches."
   - `whole-batches-ui.mjs:23` "Familiar supplied practice."
   - `sharing-counter-ui.mjs:10` "The four mats are a supplied scaffold."
   - `parcel-packing-ui.mjs:38` "The nonempty-bag count is minimal."
   - `measuring-recipes-ui.mjs:13` "A reading draft. Checking is optional; pouring stays open."

   These describe the design, and a young reader cannot act on them. Rewrites:
   - "Your message matches the order."
   - Drop "Familiar supplied practice." entirely.
   - "Put the same number of buns on each mat."
   - "That is the fewest trips."
   - "You can check your number, or keep pouring."

   A general fix: ban "supplied", "familiar", "literal", "draft", "snapshot", "partition", "nonempty" and "explicit" from child-facing text.

2. **`whole-batches-content.mjs:17` (BATCH_TEACHING) and `parcel-packing-content.mjs:18` (PACKING_TEACHING) are adult explanations shown as help.** Examples:
   - "Adding 100 mL to each gives 300/400; adding a complete batch gives 300/450. The star-water distinguishes the plans."
   - "Capacity here means the greatest number of envelopes permitted in one bag. One bag fits on the broom per outward loaded trip. Empty returns and empty bags are not counted as loaded trips."

   Each entry should be 1 to 3 short sentences with one idea each. Examples:
   - "Add 100 mL to both jars and you get 300 and 400. Add one whole batch and you get 300 and 450. Look at the star-water jar to see the difference."
   - "A bag holds 5 envelopes at most. The broom carries one bag on each trip."

3. **British spelling in visible and spoken text.** Fix all of these:
   - "millilitres" appears in visible SVG text and options ("mL · millilitres"), in aria-labels and in narration. Locations: `measuring-recipes-art.mjs:12`, `:15`; `measuring-recipes-ui.mjs:13`, `:18`; `measuring-recipes-core.mjs:60`; `whole-batches-art.mjs:4`; `whole-batches-ui.mjs:28`, `:32`, `:35`.
   - "practising" at `measuring-recipes-content.mjs:10`.
   - "centimetres" at `sharing-counter-ui.mjs:11`.
   - "labelled" at `parcel-packing-ui.mjs:37`.

   Use "milliliters", "practicing", "centimeters" and "labeled".

4. **Slash notation that reads wrong aloud or clashes with fractions.**
   - `parcel-packing-art.mjs:4` draws "3/5 · partial" on each bag. That means "3 of 5", but the Sharing Counter next door teaches "3/4" as a fraction. Use "3 of 5".
   - `whole-batches-content.mjs:17` writes "300/400" and "300/450"; use "300 and 400".
   - `sharing-counter-art.mjs:11` writes "1/2 = 2/4". That is fine visually, but screen readers say "1 slash 2". Add a visually hidden "one half equals two quarters" (the span after it partly does this already, so put the words first).

5. **Plural bug in a repair explanation.** `cafe-core.mjs:148` "'Remove' + ' ' + r.needed + ' bites'" produces "Add 1 bites, then check the wishes too." Use the existing `plural()` helper.

6. **Café shortfall step is the hardest instruction in the café.** At `cafe-ui.mjs:86`:
   - The question: "At the start, how many extra bites did we need altogether?"
   - The help line: "Use the At start column. Gathering changes the Now column; our original question stays the same."
   - The table columns: "Need / At start / Now".

   The child has to track three quantities over time. Rename the columns "Needed", "In the jar at first" and "In the jar now". Ask "How many more bites did the jars need, before you gathered?" Cut the help line to "Use the 'In the jar at first' column."

7. **The same action has different names, sometimes on one screen.**
   - Café plate: "See my plate" / "Check my plate" / "Check this plate" / "Change my plate" / "Back to my plate" (`cafe-ui.mjs:47`, `:62`, `:82`, `:83`).
   - Gathering: "Gather ingredients" / "✿ Explore and gather" / "Find Moon crunch" / "Explore the orchard" (`:47`, `:65`, `:49`, `:93`).
   - Measuring Kitchen footer: "Choose another recipe" next to "Another recipe" (`measuring-recipes-ui.mjs:20`).

   Pick one verb per action: "Check my plate", "Change my plate", "Go gathering". Remove one of the two recipe buttons.

8. **"Keep" means three different things.** In Whole Batches, "Keep" means save a snapshot ("Keep this draft"). Typing triggers "Your change is kept." (`whole-batches-ui.mjs:73`). The together toggle flips to "Working together is kept" (`measuring-recipes-ui.mjs:18`, `sharing-counter-ui.mjs:22`). A child will think pressing a field already saved the tray. Use:
   - "Saved." for autosave.
   - "We're working together ✓" for the toggle.
   - "Keep" only for the snapshot button.

---

## Instruction clarity

- `cafe-ui.mjs:39`: "New Game Plus: another gathering" and the eyebrow "New Game Plus 1". This is gamer jargon. Try "Plan another gathering" and "Gathering 2".
- `cafe-ui.mjs:62`: "You can change the ingredients now, or try this repair question first." and "This question helps us fix this order." The word "repair" is spec language. Try "You can change your plate now, or answer this question first."
- `cafe-ui.mjs:94`: "One bite is one unit from a jar." "Unit" is abstract. Try "Each bite comes from one jar."
- `cafe-ui.mjs:94`: "Let this guest wait; invite another". Semicolon in a button label. Try "Invite a different guest".
- `cafe-ui.mjs:86`: "The cupboard has enough real supplies for this order." "Real" clashes with "All food and guests are pretend." Try "Every jar has enough for this order."
- `cafe-ui.mjs:82`: "Different bites can supply the two wishes. One bite with both also works." The café uses "wishes", the story uses "describing words" and "qualities", and the repair uses "quality" (`restaurant-story.mjs:21`, `cafe-ui.mjs:61`). Use "wishes" everywhere a child reads it.
- `measuring-recipes-ui.mjs:15`: "The measuring jug has not been delivered until you pour." Try "The jars only fill when you pour."
- `measuring-recipes-core.mjs:60`: "Choose mL; g names mass and items counts objects." Try "Choose mL. Grams are for weighing, and items are for counting things."
- Measuring Kitchen and Whole Batches buttons "Return jug to source" / "Return jar to source" / "Return all portions to sources" (`measuring-recipes-ui.mjs:14`, `:15`, `:20`). "Source" is never shown as a thing. Try "Pour it all back" / "Empty this jar" / "Empty everything".
- `sharing-counter-ui.mjs:14`: "Choose a partition, then tap the pieces you want to pack." Try "Choose two pieces or four pieces. Then tap the pieces to pack."
- `sharing-counter-ui.mjs:10`: "The numerator counts complete groups; it does not count individual buns." Try "The top number counts whole groups of buns."
- `parcel-packing-ui.mjs:30`: "What is the fewest number of loaded trips?" This is ungrammatical, and "loaded" is unneeded. Try "What is the smallest number of trips?" The surrounding line "One nonempty bag goes per outward trip; a partial bag may travel. Empty returns do not count." could become "The broom carries one bag each trip. A bag that is not full can still go."
- `parcel-packing-ui.mjs:32`/`:65`: "Replace my packing with a ready example together" and "Prepared together: the editable packing and chosen-purpose answer have been replaced... Choose Keep to review and explicitly seal." Try "Show me a finished table" and "Here is a finished table. Your saved plans are safe. Go to Keep to seal it."
- `whole-batches-ui.mjs:27`: "How many complete copies fit?" plus "Zero cards is an unfinished plan." Try "How many recipe cards do we need?" and "Add a card to start."
- Error lines change wording and add jargon: "Blank or malformed entries remain drafts." (`whole-batches-ui.mjs:40`), "Blank or other number forms stay as drafts." (`parcel-packing-ui.mjs:25`). Use one line everywhere: "Type a whole number from 0 to 500."

## Descriptive voice

- `cafe-content.mjs:4-6`: three of the four supper invitations are flat orders. Examples: "Prepare six tables for a picnic under the moon." and "The ribbon supper is ready. The café is dressed for another gathering of friends." The welcome-back one sets the bar. Try:
  - "The moon has come out to eat with us. Set six tables under it."
  - "Ribbons snap like happy flags. Six tables are dressed and waiting."
- `measuring-recipes-content.mjs:13-18`: "Ember prepares a moonlight celebration tray." These are lists of names plus "prepares a tray". Give each one a tiny image. Examples: "Ember's tray is for the moonlight party. She promises not to toast it." or "Wisp packs supper for the lantern menders, who work late and glow a little."
- `whole-batches-content.mjs:7-9`: "Prepare a tray for the four-place rehearsal table." "Four-place" is spec phrasing. Try "Four puppeteers need supper between scenes."
- `parcel-packing-content.mjs:8`: "An exact-fit seed request" / "Prepare an exact-fit seed request." This is the test case's name leaking through. Try "Seeds for the long garden row" / "Twenty seeds, waiting for five snug bags."
- `whole-batches-content.mjs:17` (ending) "One tray joins the gathering. Different contributions are welcome; the story stays open." and `parcel-packing-content.mjs:18` (ending) "A small contribution is ready for its own next journey; other Post Office work stays open." These are the reward moments, and they read like policy. Try "Your tray steams gently on the long table. Someone has already saved a seat for it." and "The bags are sealed. Somewhere a garden is waiting to be surprised."
- `cafe-content.mjs:21-25` and `restaurant-story.mjs:20`, `:46`, `:59`: the disclaimers repeat ("No real tasting is needed.", "This is make-believe investigating.", "imaginary guests, imaginary dishes", "pretend portions" in every prompt). They add reading load and flatten the jokes. Keep one gentle note per screen, and drop "pretend" from math prompts (`restaurant-story.mjs:48`: "How many portions are needed for 4 guests with 3 portions each?").

## Accessibility

- `cafe-ui.mjs:49`: `<span aria-label="2 bites on your plate">2</span>`. aria-label on a plain span is ignored by most screen readers. Use visually hidden text instead.
- `cafe-film.html:54`: the canvas has an aria-label but no role, so many readers skip it. Add `role="img"`.
- `sharing-counter-ui.mjs:14`: the cut buttons are named only "A" … "K". Give each an aria-label such as "Cut at A".
- `parcel-packing-art.mjs:6`: aria-label "A fictional courier beside a sealed delivery packing plan. A local story still." The last sentence is garbled. Try "Willow's courier holds the sealed bags, ready to go."
- `cafe-ui.mjs:94` ticket "ALMOST-RIGHT CAFÉ" and the SVG "ALMOST READY" (aria-hidden, fine). The ticket text is real text, and some readers spell all-caps letter by letter. Write it in title case and set uppercase in CSS.
- `cafe-ui.mjs:65`: "Small orders: 2–4 guests, 2–3 bites". En dashes are read as "2 dash 4". Use "2 to 4 guests, 2 or 3 bites".
- `whole-batches-ui.mjs:15` "One complete base batch → 2 guests" and the `→` on many buttons ("Compare the part and whole →"). Arrows are read as "right arrow". Mark them `aria-hidden` or use words ("makes enough for 2 guests").
- `cafe-ui.mjs:77`: "Green dots: already in the jar. Ringed yellow dots: extra needed." The ring is a shape cue, which is good. Say it in shape-first form: "Filled dots are in the jar. Empty rings are still needed."
- `whole-batches-content.mjs:17` (whole): five sentences of help in one paragraph, with narration on top. Split it into short lines, or put it in steps the way the worked example does.

## Typos, spelling, style

- Em dash in visible text: `cafe-ui.mjs:90` "sold out—but your ideas…". The narrated copy uses a comma. Use the comma in both.
- Em dashes in choices: `restaurant-story.mjs:25-28` "Moon-crunch — warm and crunchy". Use "Moon-crunch: warm and crunchy".
- ALL CAPS for emphasis: `restaurant-story.mjs:38` "warm AND crunchy". Use bold, or "both warm and crunchy".
- Names disagree between the story and the game. The story has "Moon-crunch", "thunder-toast" and "Comet curls". The café has "Moon crunch", "thunder toast" and "Comet crisps" (`cafe-content.mjs:9-10`, `:30`). Pick one spelling for each.
- Many "Not X, but Y" correctives in help text. They teach by naming the wrong idea first, which a listener can mishear as the instruction:
  - `sharing-counter-ui.mjs:18` "Our whole is the collection of twelve buns, not one bun."
  - `sharing-counter-ui.mjs:14` "Look for equal widths, not just the right number of pieces."
  - `parcel-packing-ui.mjs:32` "Dashed spaces show spare room, not spare envelopes."
  - `parcel-packing-content.mjs:18` "This is grouping by a given size, not sharing between a given number of people."
  - `whole-batches-content.mjs:17` "Three copies mean three times each base amount, not three mL more."
  - `whole-batches-ui.mjs:38` "Each group is for two guests, not one guest."

  State only the positive. For example: "Our whole is all twelve buns." and "Make every piece the same width."
- Grown-up notes are written for an auditor. Examples:
  - `cafe-ui.mjs:107` "No mastery, general level, empathy, or independent reading is inferred."
  - `parcel-packing-ui.mjs:41` "Keeping or sealing is not independent attainment, a Post Office delivery or Bramble progress."

  Parents need plain words too. Try "These notes show what your child tried and what help they used. They are not grades."
- `whole-batches-ui.mjs:35`: the help tab "Word pictures" opens a list of definitions with no pictures. Rename it "Word helper".
- No personal or family details are invited anywhere in these files. "Invite someone to pretend to order" (`restaurant-story.mjs:12`) is safely open-ended.

## Lines worth keeping (voice reference)

- `cafe-content.mjs:33` "A pebble-troll takes a seat. The seat looks mildly surprised."
- `cafe-content.mjs:31` "An umbrella-sprite folds up politely. One small raindrop refuses to get off." and its thanks: "I shall pretend the raindrop is my dinner bell."
- `restaurant-story.mjs:20` "Dot checks a menu that is mostly doodles." (the same move as the beetle-sized notebook line)
- `cafe-content.mjs:32` "A ribbon-giant ties a bow to remember the order. Then forgets which bow."
- `restaurant-story.mjs:46` "Dot points out that a doodled portion never goes cold." and `cafe-film.html:6` title "Welcome Back, Neighbors".
- For instructions, `sharing-counter-ui.mjs:18` "A part only makes sense beside its whole." is a model: short, concrete, a little lyrical.
