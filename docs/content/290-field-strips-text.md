# Field Strips290: finite original text

Normative original copy for [spec290](../specs/290-field-strips.md), 2026-10-28. Braced tokens below are labelled mathematical/data substitutions, escaped as text. Every current picture/readout uses the actual plan and frozen source. Retained outcomes use their stored enums and frozen feedback, never today's key. No language/age/personalization fields or free original-writing input.

## Opening and permanent frame

Destination title: **Field Strips**. Entry: **A part of a part**. Link: **Open Field Strips**.

Before explicit opening:

> After the storm, the orchard keeper is planning small patches within the field. Try a field on this work mat. The frame always shows one whole field.

> These are invented field plans, not measurements or planting advice. Open a plan to begin; you can change it and try the others whenever you like.

Active framing:

> Shade a first amount. Then take part of that amount. How much of the original field have you taken?

> The equal cuts are supplied. You choose how many strips and rows to take.

Source origin: **Invented field plans**.

Source notice:

> These are invented field plans. The outer frame is one original whole. Equal vertical strips make the first amount. Equal rows divide that first amount. The hatched cells show the part taken, measured against the original whole. This drawing is a mathematical model, not a measured field or a growing experiment.

## Six cases

The numeric data and initial plans are in spec290's table. These exact text members accompany them.

### half-three-quarters · Half of three quarters

Prompt: **Shade 3/4 of the original field. Then take 1/2 of that first amount. How much of the original field is taken?**

Clue: **Three of four first strips make 3/4. Take one of the two equal rows inside that amount. Count the hatched cells against all eight cells.**

Guided text, visibly labelled **Guided example**:

1. Take three first strips out of four.
2. Take one row out of two equal rows of that amount.
3. Three of eight whole-field cells are taken: 3/8 of the original field.

Explanation: **One fitting plan has three first strips and one taken row. It takes 1/2 of 3/4. The first amount covers six of eight cells; half of that is three cells. The taken amount is 3/8 of the original field.**

Reason prompt: **Point to the first amount, then the taken amount. Why is the answer 3/8 of the original field, rather than 1/2 of it?**

### two-thirds-twice · A part of two thirds

Prompt: **Shade 2/3 of the original field. Then take 2/3 of that first amount. How much of the original field is taken?**

Clue: **Start with two of three first strips. Take two of three equal rows of that amount. The whole field has nine equal cells.**

Explanation: **One fitting plan has two first strips and two taken rows. Four of nine equal whole-field cells are taken: 4/9 of the original field. Taking 2/3 of 2/3 gives less than the first 2/3.**

Reason prompt: **Why do nine equal cells belong in the whole-field count? What would 2/3 of the original field look like instead?**

### half-a-field · Another way to a half

Prompt: **Shade 3/4 of the original field. Then take 2/3 of that first amount. How much of the original field is taken?**

Clue: **The first amount has three of four strips. Take two of its three equal rows. Count six taken cells among twelve in the original field.**

Explanation: **One fitting plan has three first strips and two taken rows. Six of twelve equal whole-field cells are taken. Six twelfths and one half name the same amount: six selected cells and six remaining cells make the whole field.**

Reason prompt: **How can 6/12 and 1/2 name this same amount? You do not need a simpler name to keep a comparison.**

### three-quarters-half · The same amount, another way

Prompt: **Shade 1/2 of the original field. Then take 3/4 of that first amount. How much of the original field is taken?**

Clue: **Take one first strip out of two. Within that first amount, take three equal rows out of four.**

Explanation: **One fitting plan has one first strip and three taken rows. Three of eight equal whole-field cells are taken: 3/8 of the original field. This uses a different first amount from taking half of three quarters, while the final amount is the same.**

Reason prompt: **What is different about the two first amounts? What stays the same about their taken amounts?**

### keep-it-all · Take all of this part

Prompt: **Shade 2/3 of the original field. Then take 3/3 of that first amount. How much of the original field is taken?**

Clue: **Three out of three rows means all the rows of the first amount. None of that first amount is left untaken.**

Explanation: **One fitting plan has two first strips and all three taken rows. Six of nine equal whole-field cells are taken: 6/9, also named 2/3. Taking all of an amount keeps that amount.**

Reason prompt: **Why does taking 3/3 leave the taken amount the same size as the first amount?**

### empty-first · An empty first amount

Prompt: **Shade 0/4 of the original field. Then take 1/2 of that first amount. How much of the original field is taken?**

Clue: **No first strips are shaded. Taking half of an empty amount still takes no cells. Keep the original whole in view.**

Explanation: **One fitting plan has no first strips and one of the two rows selected. The first amount and taken amount are both zero. The original field is still one whole, with eight equal cells. Half of zero is zero; it is not smaller than zero.**

Reason prompt: **Can a smaller part be taken when the first amount is already empty? What does the unchanged outer frame mean?**

Only the first case has guided text; all other `guided` arrays are empty. Explanations are supplied answers, not a report of what the child did. With a readable retained source, use its own text rather than these catalogue lines.

## Helpers frozen in source

Each step has text and a separate **Example field** using the named frozen case and plan below. No step edits the task. Opening any helper records only that it was opened.

| helper / title | case / plan `{columnsTaken,rowsTaken}` | Step text |
|---|---|---|
| equalParts / Equal parts and the whole | half-three-quarters / 1,0 | The frame is one original whole. Four equal first strips run down the field. This example selects one of them. |
| equalParts | half-three-quarters / 1,1 | Two equal rows cross every strip. Each small cell is one of eight equal parts of the original whole. |
| equalParts | half-three-quarters / 1,2 | Taking both rows takes all of this first strip: two of eight cells, also named one quarter of the original field. |
| nested / Take a part of the first amount | half-three-quarters / 3,0 | This example starts with three quarters of the original field. Look at its six cells. |
| nested | half-three-quarters / 3,1 | Take half of that first amount: one of its two equal rows. Three cells are hatched. |
| nested | half-three-quarters / 3,1 | There are eight cells in the original whole. The three taken cells make three eighths of that original whole. |
| equivalent / One amount, two names | half-a-field / 3,2 | This example takes six of twelve equal cells: six twelfths of the original whole. |
| equivalent | half-a-field / 3,2 | Count six taken cells and six remaining cells. They are two equal amounts of the same whole, even though their shapes differ. |
| equivalent | half-a-field / 3,2 | Six twelfths and one half name the same amount. Keeping six twelfths is enough; a new name is not a new amount. |

Helper chrome: **Example field**, **Step {current} of {total}**, **Previous step**, **Next step**, **Back to our field**. The title of its source invitation is visible. Own-case helper disclosure: **This example uses this invitation's field. It may supply a fitting construction. Opening does not show which steps were viewed.** Missing detail: **Earlier opened-example details are unavailable. Whether the example used this invitation's own field is unknown.**

## Exact result templates

`source.feedback`:

| key | Literal |
|---|---|
| firstMatches | The first amount matches the requested first fraction. |
| firstDifferent | The first amount differs from the requested first fraction. You can change the first strips. |
| secondMatches | The selected fraction of the first amount matches the request. |
| secondDifferent | The selected fraction of the first amount differs from the request. You can change the taken rows. |
| wholeMatches | The final amount of the original whole matches the requested final amount. Check the two construction steps too: another plan can have the same final amount. |
| wholeDifferent | The final amount of the original whole differs from the requested final amount. Your field stays editable. |

## Current mathematical readouts

- **Original whole field** (permanent frame label).
- **First amount: {x}/{b} of the original field.**
- **Take: {y}/{d} of that first amount.**
- **Taken cells: {cells} of {total} equal cells in the original field.** For total1: **Taken cells: {cells} of the one cell in the original field.**
- **Taken amount: {cells}/{total} of the original field.**
- When a different reduced name exists and lies strictly between0 and1: **Also named {reduced} of the original field.** This is a supplied equivalent name. At zero use **This takes none of the original field.** At one use **This takes the whole original field.** Do not add the awkward “0 of” or “1 of” line.
- **Each small cell is 1/{total} of the original field.** For total1: **The one cell is the original whole.**
- **The current taken amount is smaller than the first amount.** Or **The current taken amount equals the first amount.** This is a computed current observation, not a saved prediction.
- **The first amount is empty. The chosen second fraction is still {y}/{d}; taking it selects no cells.** Only when actual `x=0`.
- **The equal cuts are supplied; the selected counts are yours to change.**
- Source initial context in Notes/guide, per titled case: **Supplied first amount: {initialX}/{b}. Supplied fraction taken: {initialY}/{d}.** If both supplied initial selections match their requests (not merely the final product): **This supplied starting field already fits the request. It is not a learner-made comparison.**

Keep whole/cell/fraction text as HTML alongside diagrams; do not shrink essential readouts into SVG. The equation, if displayed: **{y}/{d} of {x}/{b} = {cells}/{total} of the original field.** Do not display a purported learner equation answer.

## Control, support and checked-work copy

Controls: **Remove first strip**, **Add first strip**, **Remove taken row**, **Add taken row**, **Compare**, **Clue**, **Hear**, **Working together**, **Working together reported**, **Previous invitation**, **Next invitation**, **Choose an invitation**, **More ideas**, **Grown-up guide**, **Download our notes**, **Grown-up notes**, **Keeper's Desk**, **Number explorations**, **Math pathways**, **Equal parts and the whole**, **Take a part of the first amount**, **One amount, two names**.

Group headings: **Choose the first amount**, **Take part of that amount**, **Our field**, **Your checked field**, **A supplied field and a reason to discuss**. Checked work says **These are recorded comparisons, not a new check.** Numeric derived fields are prefixed **Computed from this checked plan:**; stored result text is prefixed **Recorded result:**. First/current/latest do not share an unlabelled picture.

Use one task-level change notice at a time: a just-completed edit status takes precedence over the static plan/context-change banner. The checked section may separately label itself as older. Refusal/save notices retain their existing priority.

Other finite lines:

- **Before trying the rows, what do you expect: less, the same, or more than the first amount? Tell each other if you like. Nothing spoken is recorded or marked.**
- **This comparison used {checkedX}/{b} of the original field, then {checkedY}/{d} of that first amount.**
- **Your field changed since this comparison.** Only with supported model and readable draft/history and a real known-plan difference.
- **Your field or help context changed. Compare when you want to keep this version.** Only while Compare is available and a known plan/context difference exists.
- **Field changed. Compare when you want to keep this version.** Only while Compare is available and a known plan/context difference remains after editing; an edit returning to the kept version shows no “keep this version” invitation. Otherwise, if Compare is unavailable, **Field changed. Comparing is unavailable while part of the saved comparison context cannot be read.**
- **No comparison recorded here yet. Your field is ready to change.** Only if draft readable and supported model.
- **Choose Working together if a grown-up is helping with this invitation. This records your report.** Only for supported model/readable support.
- **Tell a grown-up, or point to the cells. Nothing spoken is recorded or marked.**
- **No plan was changed by opening this help.**

Notes headings: **Field Strips**, **Source invitation**, **Supplied starting field**, **Current editable field**, **First comparison**, **Latest retry**, **Original saved Field Strips data**. Show current editable heading only for readable supported drafts. Count: **1 comparison** / **{count} comparisons**.

Support labels: **Clue opened**, **Hear requested**, **Working together reported**, and the three helper titles. Values: **Recorded before this comparison** / **Not recorded before this comparison** for snapshots; **Recorded here** / **Not recorded here** for current case; **Recorded for this explorer** / **Not recorded for this explorer** for global helper flags. **Earlier comparison feedback available: yes/no.** These are action flags, not help seen/comprehension/independence. Original guided text remains labelled supplied.

## Finite Hear script

Only for a supported readable current plan with recordable narration support. Request text in this order:

1. The frozen invitation prompt. If guided steps exist, say **Guided example.** then those steps.
2. The current **First amount**, **Take**, **Taken cells**, **Taken amount**, supplied equivalent/none/whole line and cell-size line above, using actual selections. Include the actual empty-first explanation when applicable.
3. If history is unreadable, its finite history notice. If absent, the finite no-comparison line. Otherwise say **Your checked field.** then **This comparison used…**, followed by **Computed from this checked plan:** and its cell fraction of the original field. Read **Recorded result:** before each of the three frozen feedback lines for the latest-or-first snapshot; read **Earlier comparison feedback available: yes/no.**

No current calculations are attributed to the saved enums. Feature-local speech preprocessing reads complete standalone integer fractions as “{n words} over {d words}”, with English cardinal words 0…36 and complete numeric literals for larger integers; there is no ordinal/singular/plural rule. Other digit/slash expressions use “slash”, including decimal numerator or denominator and numeric fragments adjacent to word characters, so the shared formatter cannot consume a trailing integer fragment. Tests inspect the actual final shared `spoken()` output/request, including `130`, `v2`, `3.5`, `1.5/2`, `1/2.5`, `1/1`, `4/9` and a normal `3/8`. Visible frozen text remains literal. No new shared speech mode or module change.

## Unavailable/preservation notices

- Missing/unknown root: **This saved Field Strips format cannot be used by this version. Your original data is kept in our notes. Other places remain open.**
- Unreadable source: **This saved field source cannot be read here. Its original data is kept in our notes. Other places remain open.**
- Unknown model: **This saved field uses a model this version does not compute. Its original source, plans and recorded results are kept as data in our notes.**
- Section notice: **Some earlier Field Strips data cannot be read here. Its original data is kept in our notes. Readable invitations remain open.**
- Case notice: **Part of this invitation's saved work cannot be read here. Its original data is kept in our notes.**
- History: **Earlier comparisons are retained but cannot be read here. They have not been treated as no comparison.**
- Global context: **Earlier example-opening details cannot all be read. Comparing is unavailable while this context is unknown. Readable examples and other places remain open.**
- Report gate: **This change could make our whole notes file unsafe to bring back, so the field has stayed as it was. Download our notes before changing or resetting anything.**
- Count ceiling: **This invitation has reached the comparison limit. Its field and earlier comparisons are kept. You can explore another invitation or download our notes.**
- Save-off: **Saved progress is off. This field stays in this visit; download our notes to keep a copy.**
- Storage failure: **This device could not save the change. It remains in this visit; download our notes to keep a copy.**
- Notes preface: **These are retained records, not a new comparison. Notes keep the whole current draft, the first comparison, the latest retry, their help context and the comparison count. Middle retries are not all retained.**
- Reset: **The existing full-progress reset clears this explorer's work. Download our notes before resetting if you want to keep it.**

## Grown-up guide

> Field Strips keeps one original whole visible while taking part of a fractional amount. The supplied cuts make equal cells. A drawing here is not evidence that a child can independently make equal partitions or use a model elsewhere.

> Compare records the first construction, second construction and final amount separately. Matching the final amount alone does not show the requested two steps. The field remains editable.

> The first invitation supplies an answer. Examples, clues, requested narration, working-together reports, retries and unobserved explanation are not independent achievements. This tool assigns no grade, placement or mastery.

> The current draft and first/latest comparisons are different records. Results are shown as recorded; they are not regraded against today's catalogue. Later opened help does not rewrite earlier support context. Original data remains in downloaded notes.

> Explain together if you like: what is the original whole, what is the first amount, and which part of that amount has been taken? A returned explanation is a conversation, not an automatically marked response.

The source-derived initial/guide context is grouped under each invitation's frozen title. No promise of general multiplication fluency, practical land measurement, handwriting, audible quality or learning effect.
