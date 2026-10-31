# 336 · Word List Shelf finite text

Proposed original child-facing copy for [spec336](../specs/336-word-list-shelf.md). Parent268 bench(e)/setE are adapted, not silently incorporated unchanged. No audio recording. Spelling choices and draft trials are not read aloud.

## Arrival and controls

Title: The Word List Shelf

Short: The town is writing new notices. The librarian has gathered words that can trip a writer up. Find a clue worth keeping beside each word.

Longer: Rain left the old noticeboard blank. Now there are invitations, boat timetables and plans for the garden. “A useful spelling clue is a little tool,” says the librarian. “Some words can use two. Let's give each word a place, and change our minds whenever we want.”

Instruction: Pick a word. Read its clue. Choose a tray that helps you remember its spelling.

Controls: Sort the shelf; Try a job; Previous word; Next word; Choose a word; Put back; See my shelf; Check my clues; Keep this shelf; First kept; Latest kept; Use these placements; Read the short story; Read this sentence; Compare two words; Show an example; Next step; Previous step; Hint; Check; Keep this job; Skip; Grown-up notes.

Footer: Rules usually work. A dictionary has the last word.

Trays (id; label; description):
- double; Double letters; Look for two matching letters side by side.
- quiet; Quiet letters; Notice a written letter that adds no separate sound here.
- family; Family word; Compare the letters with the supplied family word.
- ending; These endings; Look for -cious, -cient, -ant, -ence or -able.
- ie; ie or ei; Look closely at the order of i and e.

## Word cards and accepted clues

Each table row is one card, id=word. Semicolon-separated tray/note pairs are independently accepted. No other tray is automatically called a mistake.

| Word | Newly written notice sentence | Tray: printed clue |
| --- | --- | --- |
| accommodate | The hall can accommodate our guests. | double: Accommodate has cc and mm. |
| committee | The committee will plan the new noticeboard. | double: Committee has mm, tt and ee. |
| embarrass | We do not want to embarrass a nervous speaker. | double: Embarrass has rr and ss. |
| necessary | Warm coats are necessary on the boat. | double: Necessary has one c and two s's. |
| recommend | We recommend the riverside path. | double: Recommend has one c and two m's. |
| muscle | Lifting the crate takes muscle. | quiet: The c adds no separate sound in muscle.; family: Compare muscle with muscular: both keep c. |
| yacht | The yacht is moored beside the ferry. | quiet: The ch is written but not said in yacht. |
| rhythm | Tap a gentle rhythm before the song. | quiet: Rhythm starts rh; the h adds no separate sound. |
| foreign | Visitors brought books in foreign languages. | quiet: The g is not said in foreign.; ie: Foreign has ei, not ie. |
| definite | We need a definite time for the meeting. | family: Compare definite with definition: both keep i after n. |
| desperate | The damaged garden was in desperate need of rain. | family: Compare desperate with desperation: both keep e after p. |
| familiar | A familiar tune welcomes the ferry home. | family: Compare familiar with family: both begin famil. |
| conscious | We are conscious of the sleeping animals. | ending: Conscious ends in -cious. |
| sufficient | We have sufficient paper for the notices. | double: Sufficient has ff.; ending: Sufficient ends in -cient.; ie: Sufficient has ie, not ei. |
| relevant | Add only details relevant to the trip. | ending: Relevant ends in -ant. |
| existence | The old map shows the bridge's existence. | ending: Existence ends in -ence. |
| available | Blank cards are available at the desk. | ending: Available ends in -able. |
| achieve | Together we can achieve our plan. | ie: Achieve has ie, not ei. |
| mischievous | A mischievous kitten hid the string. | ie: Mischievous has ie, not ei. |
| leisure | Leave time for leisure after the work. | ie: Leisure has ei, not ie. |

Contrast: Embarrass has two r's. Harass has one. Both have two s's. Harass means to keep bothering someone; embarrass can mean to make someone feel awkward. Different words need different clues.

Example title: Two useful clues
1. Look at sufficient: it has ff.
2. It also ends in -cient.
3. It also has ie. Double letters, These endings or ie or ei can help. Choose one.

Spoken invitation, displayed only: Pick a tricky word. With a grown-up, make up a silly sentence or picture to help you remember it. We won't record it.

## Narration allowlist

Only these controls/fields may be spoken: Read the short story → retained story.short; Read this sentence → selected readable word.sentence; Read the instruction → retained copy.instruction; Read this question → current job.prompt (with its blank described as “blank”). Add those last two exact control labels. Longer story, tray names, clue notes, displayed spellings/choices/trials, hints, examples/steps, contrast and outcomes are not spoken by this slice. A missing/unreadable field disables only its read control. Sentence speech is ordinary context, not a phonics recording or a claim of validated pronunciation. Use the existing owner/visibility/stale/film guards.

## Shelf feedback and notices

Listed: This matches a printed clue. [Repeat that clue exactly.]

Discuss: The card has not supplied that clue. You may have noticed something else. Explain it together, or compare the printed clues. Your placement can stay.

Unplaced: This word is still on the table.

Incomplete: Some words are still on the table. You can keep this shelf or carry on.

Discussion: Some placements have a different idea to discuss. You can keep them or change them.

Listed summary: All placed cards match printed clues.

Partial incomplete: Some readable words are still on the table. Earlier unreadable cards stay in your notes.

Partial discussion: Some readable placements have a different idea to discuss. Earlier unreadable cards stay in your notes.

Partial listed: The readable placements match printed clues. Earlier unreadable cards stay in your notes.

These partial summaries always appear with the persistent Partial notice.

Kept: This shelf is kept. You can keep exploring and change it later.

Partial: Some earlier cards cannot be used here. Their saved work is retained in your notes.

Context unavailable: This card's sentence cannot be shown here. Its readable word and clues are still available.

Unavailable: This saved shelf cannot be edited here. Its work is still in your notes. Other activities remain open.

Refusal: This change could not be kept safely. Your earlier work is unchanged. Open your notes to keep a copy.

Job incomplete: Choose a spelling first. You can also leave this job for later.

Job fit: That spelling fits this job.

Job kept: This job is kept. You can return and try again.

Job neutral: Compare the letters with this job's clue.

Job reopen control: Use this kept choice.

Stamp: A clue worth keeping.

## Three supplied jobs

Ids e1/e2/e3, literal stable choice order below; key positions B/A/C. Every job retains its own example title/steps and hint/explanation. No option is called nonexistent in every period/dialect.

E1 title: Room for our guests
Prompt: Which spelling completes “The hall can ___ our guests”?
Choices: a accomodate; b accommodate; c accommadate. Key b.
Guided steps shown before answer: Find the double letters. Two c's. Two m's.
Different a: This spelling needs two m's: accommodate.
Different c: Keep o after the double m: accommodate.
Hint: Two c's and two m's.
Explanation: Accommodate has double c and double m.
Teaching line: Double letters can hide inside a long word.
Example title: A committee card
Steps: Committee starts com.; Keep the second m: comm.; It also keeps tt and ee: committee.

E2 title: A definite plan
Prompt: Definition is in its family. Which spelling completes “We need a ___ plan”?
Choices: a definite; b definate; c defenite. Key a.
Different b: Definition keeps i after n. Definite does too.
Different c: Definition begins defi. Definite does too.
Hint: Compare the letters in definition.
Explanation: The family word definition can help you remember the i letters in definite.
Teaching line: A family word can help you remember shared letters.
Example title: Familiar and family
Steps: Look at family.; Keep its first five letters: famil.; Familiar begins with the same letters: familiar.

E3 title: The quiet letters
Prompt: Which word has a written consonant with no sound of its own here?
Choices: a average; b category; c yacht. Key c.
Different a: Average does not have yacht's quiet ch. Compare the written letters in yacht.
Different b: Category does not have yacht's quiet ch. Compare the written letters in yacht.
Hint: Say yacht with a grown-up. Its ch is not said.
Explanation: Yacht keeps the letters ch, although they are not said here.
Teaching line: Some written letters have no sound of their own in a word.
Example title: Foreign on a card
Steps: Read foreign with a grown-up.; The g is written but not said.; Keep the g when writing foreign.

## Explicit parent corrections

E1 retains268's diagnosis: *accomodate* has cc and one m; it needs **two m's**. E2 changes the sound-dependent hint to visual letter comparison; no phonics recording is commissioned. E3 avoids a blanket assertion about every consonant in the alternatives. Foreign and muscle each have two accepted tray clues; sufficient has three. These are useful strategies, not exclusive homes. The source list is a reference, not an age-based test.
