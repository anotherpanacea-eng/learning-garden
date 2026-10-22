# 95. A writing board in Lucie's Library

Status: **content independently reviewed and installed in a local implementation draft; implementation review, merge and deployment remain open.** This is one bounded ancient-world reading pack, not an Ancient Egypt course or a new assessment.

## Purpose and existing home

The Library's flood almanac and Travelers' Archive introduce one real historical event, Paris in1910. H2-II calls for everyday historical contexts beyond that event; H1 asks us to distinguish surviving evidence from interpretations. Add two original short readings about real writing equipment from ancient Egypt. The new knowledge is a reusable whitewashed writing board, a palette holding inks and reed brushes, and a museum's interpretation of a surviving object. The learner rereads a source, compares clues and discusses a modern writing tool. Do not replace this knowledge with generic caution questions.

Use the existing trusted local English Paris pack compiler, bookstall chooser, three authored text lengths, optional listening/highlighting, smaller examples, separate support and frozen English visits. The fictional setting is Lucie's bookstall: we are reading a book about Egypt, not pretending these objects are in Paris or that our companions visited ancient Egypt. The real objects are held by The Metropolitan Museum of Art. No new state root, parser, currency, generator, lesson engine or automatic historical-proficiency flag. The existing optional postcard remains an explicitly imagined response.

## Reviewed-content candidate

The [complete reviewed pack](../../dist/packs/egypt-writing-book.mjs) holds all child-facing passage variants, four exact questions with choices and support, and four complete fictional smaller examples in the existing compiler format. The identical content moved from the independently cleared authoring file into `dist/packs` before registration; this spec describes its constraints. Two stories, `egypt-reusable-board` and `egypt-writing-palette`, use destination `bookstall` in original `egypt-writing-book` pack version1. Each has two multiple-choice questions at each of three text lengths. All lengths contain every sentence needed by both questions. Short lengths are not decoding/age claims. The following core sentences and meanings must survive any shortening; longer variants can add the explanatory sentences specified here, not unreviewed historical facts.

### The board that could be used again

Core short passage:

1. Lucie opens a book about a real writing board from ancient Egypt.
2. The wooden board has a pale coating called whitewash, with writing on it.
3. The Met dates the board to about2030BCE, long before the Paris flood of1910.
4. Museum researchers think a learner practiced writing on it because the signs have uneven shapes and spacing.
5. A learner could wipe or scrape off ink and add whitewash to use the board again.
6. This is our modern summary of The Met's record for object28.9.5, not the learner's own story.

Medium adds: **An apprentice is someone learning a skill. The record does not name this learner or give their age.** Longer adds those sentences plus **A surviving object is one kind of evidence about the past. The photograph shows the board today; the museum explains how it understands the writing.** Do not infer the learner's gender, age, feelings, identity or that all Egyptian children used boards. “About” remains part of the date; BCE means Before the Common Era, supplied in an optional source note. No date arithmetic or year-zero lesson.

Question1: **What made this board useful for another round of writing?** Choices: **Its signs had uneven shapes and spacing.**; **It could receive another coat of whitewash.** (fits); **The Met dates it to about 2030 BCE.** The wrong choices are true details answering different questions. The hint points to the sentence about using it again. The explanation connects removing ink and adding a new coating with reusing the same wooden board; it never treats the app's reading as evidence of physical practice. Talk: **What can you write on and use again today? What is similar, and what is different?**

Question2: **Why do the museum researchers think a learner practiced on this board?** Choices: **The board could receive another coat of whitewash.**; **The Met dates the board to about 2030 BCE.**; **The signs have uneven shapes and spacing.** (fits). Recoating and the approximate date are true, nonresponsive alternatives, not overclaims. Hint/explanation explicitly name the museum's stated clue. Talk: **What would you like to ask that this object record does not answer?** This asks for the reason reported in the text, not independent verification of the museum's interpretation.

### A place for ink and brushes

Core short passage:

1. Lucie's next page shows a real wooden palette from ancient Egypt.
2. A scribe is someone trained to write.
3. Scribes used palettes to hold ink and brushes. The museum lists wood and pigment as the object's materials.
4. The Met says this palette still has black ink left, while its red ink is almost gone.
5. Reed brushes had frayed ends to hold ink.
6. The Met dates this palette to about2030–1550BCE, an approximate range. This is our modern summary of The Met's record for object10.176.62, not a translation of an ancient person's words.

Medium clarifies the already supplied approximate date: **That range is not one known day.** Longer adds **The ink left on an object today is not a complete list of everything once used with it. The museum's description helps us connect the surviving palette with its use.** Do not call the pictured item a complete original kit, claim its missing brushes are present, identify a named owner, say only scribes could ever read, teach invented hieroglyph translations, or equate every hieroglyph with one picture/word. No pigment recipes or reenactment requiring ink/glass.

Question1: **According to the passage, what two things did scribes use palettes to hold?** Choices: **Ink and brushes used when writing.** (fits); **Wood and pigment named as materials.**; **Black ink still left on this object.** The wrong choices confuse the stated function with materials or one surviving trace. Hint/explanation point to the function sentence. Talk: **What keeps your writing tools together?**

Question2: **Which sentence keeps both parts of The Met's ink description?** Choices: **Red ink remains, while black ink is almost gone.**; **The record says nothing about red ink.**; **Black ink remains, while red ink is almost gone.** (fits). The alternatives reverse the two traces or leave out the stated red trace. Hint/explanation distinguish remaining traces from an unsupported claim about the past. Talk: **What can remaining ink tell us, and what can it not show?**

The four complete fictional smaller examples in the linked pack use a reusable chalk label, a margin note stating a first try, pouch contents versus nearby objects, and two paint pots with different amounts left. They demonstrate locating the relevant sentence, reusing a surface, attributing a stated clue and preserving both details. They do not supply a live Egyptian answer or add historical facts. Use the existing `mc` pack format; `connections:[]`, with no atlas/count change.

## Photographs and navigation

Use the two public-domain photographs actually inspected during authoring, with unchanged aspect ratios and complete objects. Current-library invitations for these two story IDs use their own photograph and short museum caption instead of the generic puppet picture. A photograph is supporting context on the invitation, not the basis of any checked question: every checked question says or means “in this passage” and is answerable from the frozen passage. Never substitute today's picture for a saved question's missing text. The existing imaginary Paris strip can remain inside the visit with its existing explicit imaginary-setting alt text; it depicts the bookstall's setting, not ancient Egypt.

Each invitation has a native short/medium/longer choice and existing Visit this story action, a caption with object number/date precision, museum link and CC0/public-domain credit. Both stories stay available and enter the usual bookstall rotation. Let the generic library's established preview replace the optional picture with meaningful alt text if the asset cannot load. Do not duplicate a separate gallery or add new persistence just for photographs. An optional Archive invitation can link to the Library; it creates no record or source claim. Keep invitation cards compact and all controls≥44px at320/820px. No new forced route or access lock.

Files: `dist/packs/egypt-writing-book.mjs`; register in `dist/packs/index.mjs`; a small current-catalog photo metadata/helper module and a narrow conditional in existing `packInvitations`; two local JPG assets; reuse existing styles with a small scoped photo-fit rule if necessary. Preserve existing pack/stories/compiler contracts and frozen-source compatibility. No remote asset requests at runtime. Do not generalize the pack schema to a new media system.

## Preservation, verification and gates

Existing English frozen visits own their questions, answers, passages, helpers and endings. Opening the new pack must preserve any waiting visit with its existing explicit choice. Existing unrelated English/French visits remain readable; no silent source upgrade or regrade. No new validator, evidence consumer, exposure ledger or import whitelist is needed. Existing report preflight, save-off, transfer and explorer separation still apply.

Before build, independent six-lens specification review plus factual-content and photo/credit review of these exact readings, all choices and explanations, source audit and actual files. Resolve factual ambiguities without expanding to a general ancient-world unit. During build, validate every one of the12compiled questions and helpers; verify each answer is uniquely supported at all three lengths; run existing pack and English/French source checks. In actual Chrome at320/820px, choose each story and length, read and answer both questions, use listening/help, preserve a waiting visit, inspect the photographs/captions/focus and record support honestly. Use actual notes download/file import, renamed/frozen-source compatibility and save-off checks; no real learner data. Independent implementation/root review precedes a draft PR. Final independent Claude release clearance and deployment remain separate. No physical-device, decoding, historical-proficiency or learning-effect claim.

Source facts, current references and image rights are in [audit95](../source-audits/95-egypt-writing-book.md). These are narrow H1/H2 and reading footholds; geography, wider Egyptian societies, writing systems/papyrus, chronology and differing historical voices still need separately reviewed teaching.
