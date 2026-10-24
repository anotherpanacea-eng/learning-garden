# Text review: style, accessibility and quality

Reviewed 2026-10-22 against `main` at a9f4394. Only the strings a child or grown-up sees or hears were read. The standard used: instructions should be clear, short and concrete; descriptive text should be evocative and poetic. The review is read-only, and nothing in the repo was changed.

The detailed findings, each with file:line, the quoted text, the problem and a suggested rewrite, are in six area files:

- [shell-garden.md](shell-garden.md): home screen, guide, help, progress, garden
- [math-games.md](math-games.md): Number Garden, multiplication garden, Bramble, equal groups
- [cafe-kitchen.md](cafe-kitchen.md): café, Measuring Kitchen, Sharing Counter, Whole Batches, packing table
- [words-stories.md](words-stories.md): Post Office, messages, letters, Word Garden, stories, Story Loft
- [paris-archive.md](paris-archive.md): Paris stories, French, Travelers' Archive
- [science.md](science.md): Living Garden, Workshop, Plant Study, Field Notebook, Rain Paths, Bell Studio

## What runs across every area

**1. Grown-up and spec language on the child's screen.** This is the biggest problem.
- Every area has record-keeping and caveat sentences sitting next to the child's buttons. Examples:
  - "records an invitation, not proof that you made something"
  - "not a verdict about what you know"
  - "Earlier result exposure is uncertain"
  - "reported read independently without recorded help"
  - "not a hearing test"
- Spec vocabulary leaks into instructions too: "supplied", "familiar", "observation", "specimen", "chronology", "source rows", "fresh claim".
- The multiplication garden gives all 144 cells screen-reader labels like "No retained answer observation."
- Fix: keep at most one warm framing line per activity, and move the rest into the existing "Grown-ups" panels. This also removes most of the "not X" sentences.

**2. One thing, many names.**
- A pause is called "Take a break", "Pause in the garden", "Skip for now", "Not today" and more.
- "Explorer" means both the character and the save slot.
- The Archive's date cards have five names.
- Rain Paths trays are also called "machine" and "chamber".
- The café plate buttons have five names.
- Some text points to buttons that were renamed: "Press Fly once" sits next to a "Fly the next instruction" button, and app.mjs:395 still names "Skip for now".
- The home intro's path names don't match its buttons, so a listening child can't find them.
- Fix: write a short glossary of control and place names, and use it everywhere.

**3. British spelling.** The game uses American spelling, but these still appear on child screens and in narration:
- labelled
- neighbour
- millilitres, centimetres and millimetres
- theatre
- catalogue
- practising
- recognise

The word "neighbor" changes spelling between screens.

**4. Symbols that read badly aloud.**
- Slashes read as "2 slash 3", and "3/5" in the packing bags means 3 of 5, which clashes with the fractions taught at the Sharing Counter.
- Blanks read as "underscore underscore".
- Arrows (→) are used as separators.
- Icon glyphs inside buttons (✧ ↗ ▦ ☷) get read aloud.
- Film canvases have no `role="img"`.
- French phrases have no `lang="fr"`, so an English voice reads them.

**5. Answer giveaways.**
- The correct choice is noticeably the longest in some story and array questions (story-content.mjs:67 and :124, broad-variants.mjs:89-90). This breaks the new AGENTS rule.
- A picture label prints "6 rows, 4 in each row" under a question asking how many rows (app.mjs:103-104).
- The French hint's full English translation gives the answer away.

**6. Em-dashes and the "Not X, but Y" pattern.**
- About ten visible em-dashes, for example "Comparison kept — keep exploring" and "Blank — no value entered".
- Many help lines use "Not X, but Y".

## Accuracy

- **Paris:** one historical label is reversed. travelers-archive-content.mjs:38 says the bridge is named for the scale, but the flood scale is named for the Pont d'Austerlitz. The March 15 date for railway and metro service resuming should be checked against the source.
- **Math wording:** "Pip added ten bundles" means bundles of ten, and the template produces "a equilateral triangle".
- **Café:** cafe-core.mjs:148 produces "Add 1 bites".
- **Science:** all the facts checked are correct.

## Voice: what to keep and spread

The lyrical voice is real, but it lives mostly in the stories, the café guests and the Paris pages. The equal-groups, multiplication-garden, Archive and record pages have almost none of it. Lines to use as the reference:

- "A beetle-sized notebook is mostly margin."
- "A tiny beetle can manage a very large warehouse."
- "The seat looks mildly surprised."
- "Standing on the map is unhelpful. The duck steps aside."
- "Dot rode on the parcel and made no traffic complaints."
- "a suitcase no bigger than a bean"
- "A neighbor stays. A parcel travels."
- "Same garden. New things to notice."
- "No shape gets dizzy here."
- "Follow a curiosity. A parcel, a puddle, a hungry visitor."

## Suggested order for fixes

1. Mechanical, safe text edits: American spelling, em-dashes, plurals, typos, "a equilateral", and the reversed Austerlitz label. Saved work doesn't depend on wording (AGENTS rule), so these can't lock anyone out.
2. Move the grown-up caveats into the Grown-ups panels, and fix the screen-reader labels and symbols.
3. Write the naming glossary and apply it.
4. Rebalance the answer-giveaway choices.
5. A voice pass on the flattest screens (equal groups, multiplication garden, Archive), using the lines above.
