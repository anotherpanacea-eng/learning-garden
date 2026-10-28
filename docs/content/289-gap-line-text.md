# Between the Marks · finite original English copy

Companion to spec289. Tool name **Gap Line**; page title **Between the Marks**; route `#desk/gaps`. All situations, prompts and explanations below are original mathematical practice. Freeze them with the source. Only bounded numbers, case titles and literal recorded values may fill the named substitutions. No generated invitations, typed answers or recorded speech.

## Material board and finite labels

Discovery: **Between the Marks** / **Build a ruler between two marks. Explore its length and the direction of the move.** / **Open Gap Line**.

Origin: **Invented number-line invitations**.

Invitation: **Start and Finish stay fixed. Move your ruler end, then compare your construction with the invitation.**

Before opening: **Your ruler stays editable. Notes keep your first comparison, latest retry, and comparison count. They do not keep every version in between.**

Board heading: **The invitation's marks**.

Source captions: **Start: {A}** · **Finish: {B}**. These always name the immutable source marks, even when the ruler end is elsewhere. Accessible source legend: **Start mark** · **Finish mark**. Do not draw an arrow between these marks that automatically supplies the target distance or direction.

Construction heading: **Your ruler**.

Construction caption: **Ruler end: {C}**.

Length caption: **Your ruler's length: {length} units.** Singular **Your ruler's length: 1 unit.** Zero **Your ruler's length: 0 units.** This is the unsigned length of the actual construction from Start to the ruler end. It is never the distance to Finish unless the construction actually has that length.

Initial caption: **Your ruler begins at Start. Its length is 0. You can compare it now or move its end.** A zero-length construction is complete enough to compare; there is no missing-work message.

Piece legend: **Equal ruler pieces**. Whole-unit source: **Each piece is 1 unit long.** Half-unit source: **Each piece is ½ unit long.** Ruler pieces have no arrowheads. Draw only the actual constructed span from A to C. Zero span has no nonzero piece.

Controls: **Move ruler end left** · **Move ruler end right**. Whole-unit description: **Move by 1 unit.** Half-unit description: **Move by ½ unit.** These native buttons work without dragging; moving the end does not move Start or Finish.

Presentation controls: **Split the ruler at zero** · **Show the move**. These are optional presentation requests, not answers or evidence of understanding.

Split explanation: **Zero can be a boundary between two parts of your ruler. It is a mark, not an extra step.**

Split when zero lies strictly inside A-to-C: **Two parts meet at zero. Their lengths add to your ruler's length.**

Split when zero is outside or at an end of A-to-C: **Zero is not inside your ruler's span. The ruler stays in one part.** A zero span remains zero; do not invent a piece. Splitting never constructs the missing part to Finish.

Move fold heading: **The move from Start**.

Move fold introduction: **Length counts the space covered. Signed change also tells the direction.**

Current-model readout: **Your move: {C} − ({A}) = {change} units.** Singular unit when the signed magnitude is 1. Direction lines: **The ruler end moved right from Start.** / **The ruler end moved left from Start.** / **The ruler end is at Start. There is no change.** Use the actual C−A, including an explicit + for positive signed change. Show this only inside the requested fold; unsigned length remains outside it.

Primary action: **Compare**.

Open navigation: **Choose an invitation** · **Previous invitation** · **Next invitation**. All six named invitations are open from the start. Only disable Previous/Next at their ends.

Boundary left: **The ruler end is at −10. Move right to change it.**

Boundary right: **The ruler end is at 10. Move left to change it.**

Draft status: **Your ruler or help context changed. Compare when you want to keep this version.**

No comparison: **No comparison recorded here yet. Your ruler is ready to change.**

Checked heading: **Your checked ruler**. Changed heading: **Your ruler changed since this comparison**.

Checked summary: **This comparison used a ruler end at {C}, with Split at zero {on/off} and Show the move {on/off}.** Help context is retained separately with that observation. A checked ruler never silently becomes the editable current ruler.

## Six open invitations

Internal values are integers in half-units: displayed value = halfTick ÷ 2. `stepHalf=2` moves 1 unit; `stepHalf=1` moves ½ unit. Domain is −10 through 10, inclusive. Every initial C=A and both presentation requests are false. The target length below is authoring data, not an automatic target-distance readout. Only the supplied clue, guided lines, optional explanation or teaching may reveal it.

| caseId / button title | A halfTick | B halfTick | stepHalf | Initial C halfTick | Target length |
| --- | ---: | ---: | ---: | ---: | ---: |
| guided-cross / **Across zero** | −8 | 18 | 2 | −8 | 13 |
| same-below / **Two marks below zero** | −4 | −16 | 2 | −4 | 6 |
| reverse / **Back across zero** | 18 | −8 | 2 | 18 | 13 |
| positive / **Two marks above zero** | 6 | 16 | 2 | 6 | 5 |
| coincident / **One shared place** | −6 | −6 | 2 | −6 | 0 |
| halves / **Half-unit pieces** | −3 | 4 | 1 | −3 | 3½ |

### guided-cross · Across zero

Prompt: **Start is −4 and Finish is +9. Build a ruler from Start to Finish. How long is it?**

Clue: **You can count from −4 to zero, then from zero to +9. Zero itself adds no step.**

Guided label: **Guided example**. Always display these three lines with this invitation:

1. **The length from −4 to +9 is 13 units.**
2. **There are 4 units from −4 to zero and 9 more from zero to +9: 4 + 9 = 13.**
3. **Move the ruler end right to +9 and compare. Your ruler stays editable.**

Canonical explanation: **One fitting ruler ends at +9. It covers 4 units to zero and 9 units beyond zero, so its length is 13 units. The move from −4 to +9 has signed change +13. Zero is a boundary, not an extra unit.**

reasonPrompt: **Where are the 4 units and the 9 units in this ruler? What does the plus sign in +13 tell us?**

### same-below · Two marks below zero

Prompt: **Start is −2 and Finish is −8. Build a ruler from Start to Finish. How long is it?**

Clue: **Both marks are left of zero. Count the equal spaces between them.**

Guided lines: none.

Canonical explanation: **One fitting ruler ends at −8. It covers 6 units from −2 to −8, so its length is 6 units. The move goes left and has signed change −6. Zero is outside this span; splitting at zero does not add a part.**

reasonPrompt: **Why is the length 6 while the signed change is −6? Is zero inside this ruler?**

### reverse · Back across zero

Prompt: **Start is +9 and Finish is −4. Build a ruler from Start to Finish. How long is it?**

Clue: **These are the same two places as Across zero, with Start and Finish exchanged. What stays the same?**

Guided lines: none.

Canonical explanation: **One fitting ruler ends at −4. It covers 9 units to zero and 4 more to −4, so its length is 13 units. The move goes left and has signed change −13. Across zero already supplied the length between these same two places. Reversing the move changes its sign, while the length stays 13.**

reasonPrompt: **What stays the same when Start and Finish exchange places? What changes?**

### positive · Two marks above zero

Prompt: **Start is +3 and Finish is +8. Build a ruler from Start to Finish. How long is it?**

Clue: **Both marks are right of zero. Count only the spaces from Start to Finish.**

Guided lines: none.

Canonical explanation: **One fitting ruler ends at +8. It covers 5 units from +3 to +8, so its length is 5 units. The move goes right and has signed change +5. Zero is outside this span.**

reasonPrompt: **Which spaces belong to the ruler? Why do the spaces from zero to +3 stay outside it?**

### coincident · One shared place

Prompt: **Start and Finish are both −3. Does the supplied ruler already fit? Compare it, or explore and come back.**

Clue: **The marks share one place. A ruler can have length zero.**

Guided lines: none.

Canonical explanation: **The supplied ruler end at −3 already meets Finish. Its length is 0 units, and its signed change is 0. No movement is needed. Comparing that initial ruler is a valid comparison.**

reasonPrompt: **How can a ruler fit without covering any space?**

### halves · Half-unit pieces

Prompt: **Start is −1½ and Finish is +2. Use half-unit pieces to build a ruler from Start to Finish. How long is it?**

Clue: **Each piece is half a unit. Two half-unit pieces make one whole unit.**

Guided lines: none.

Canonical explanation: **One fitting ruler ends at +2. It covers 1½ units to zero and 2 more beyond zero, making 3½ units. There are 7 half-unit pieces: 7 × ½ = 3½. The move goes right and has signed change +3½. Zero adds no piece.**

reasonPrompt: **How many half-unit pieces make your length? How can you group them into whole units and a half?**

## Two separate recorded results

Heading: **What this comparison recorded**.

Compare the actual constructed endpoint C with source B and, separately, its actual unsigned length |C−A| with source length |B−A|. A matching length can accompany an endpoint in the wrong direction. Do not collapse the two results into a grade. A zero span is still compared under both rules. It fits both when the supplied marks coincide; it differs on both when they are distinct.

The following four templates are exact bare literal status messages. They contain no substitutions:

| Source key / status | Exact template |
| --- | --- |
| endMeets / meets | Recorded endpoint result: meets. |
| endDifferent / different | Recorded endpoint result: different. |
| lengthMatches / matches | Recorded length result: matches. |
| lengthDifferent / different | Recorded length result: different. |

Never generate a numeric equality from these stored statuses. Do not reinterpret earlier results using today's rules or content.

Separate supported-model labels: **Computed endpoint for this checked ruler: {C}.** · **Computed unsigned length for this checked ruler: {length} units.** · **Computed signed change for this checked ruler: {change} units.** Use singular unit where the magnitude is 1. Signed change is shown only in its requested Show the move fold. These computations use that checked model's own retained source and endpoint. They do not alter its literal recorded results.

Unknown-model notice: **This earlier ruler's model is not supported here. Its raw source, construction and recorded results stay in your notes. No picture or calculation is supplied for it.** Show raw retained data only; do not attach current-model formulas or pictures to it.

Explanation fold: **A supplied example and a reason to discuss**.

Example caption: **Example ruler**.

Introduction: **This is a supplied ruler that fits the invitation. It does not describe your own ruler.** Follow with the frozen case explanation and reasonPrompt.

Talk invitation: **Tell a grown-up, or point to the pieces. Nothing spoken is recorded or marked.**

Revision: **Your ruler stays as you made it. Change its end or request another idea, then compare again. Your first comparison stays in Notes.**

No-op: **This construction and help context are already recorded. Move the ruler end or change the context before recording another comparison.** Identical plans and context create no comparison or count change.

Local familiarity: **No comparison recorded here** · **First comparison here** · **Compared before here**. These do not mean unseen, learned or mastered.

## Optional support and three worked helpers

Controls: **Clue** · **Hear** · **Working together** · **Across zero example** · **Below zero example** · **Half-unit example** · **Previous step** · **Next step** · **Back to my ruler** · **Close this idea**.

Together introduction: **Choose Working together if a grown-up is helping with this invitation. This records your report.** Reported button: **Working together reported**. Status: **Working together is reported for this invitation.** Narration status: **Hear requested**. A request does not establish that narration was heard.

Every supplied helper picture is labelled **Example ruler**. The editable construction remains **Your ruler**. Helpers never move the learner's ruler. Only the current helper step is displayed; opening is not evidence that all steps were viewed. Each helper plan has Show the move off; its supplied text may still explain signed change.

Crossing helper title: **Build through zero**. `helperId=crossing`, `caseIds=[guided-cross]`; all three steps use that frozen case's A=−4, B=+9 and unit size 1.

| Step | Example C halfTick | Split | Exact line |
| --- | ---: | --- | --- |
| 1 | 0 | false | **From −4 to zero, this example ruler covers 4 units. Zero adds no step.** |
| 2 | 8 | true | **The example end is now +4. Its two parts cover 4 + 4 = 8 units.** |
| 3 | 18 | true | **The example end meets +9. Its parts cover 4 + 9 = 13 units. The signed change is +13.** |

Same-side helper title: **Stay below zero**. `helperId=sameBelow`, `caseIds=[same-below]`; all steps use A=−2, B=−8 and unit size 1.

| Step | Example C halfTick | Split | Exact line |
| --- | ---: | --- | --- |
| 1 | −6 | false | **From −2 to −3, this example ruler covers 1 unit to the left.** |
| 2 | −12 | false | **The example end is now −6. The ruler covers 4 units, all below zero.** |
| 3 | −16 | false | **The example end meets −8. Its length is 6 units and its signed change is −6. Zero is outside the span.** |

Half-unit helper title: **Count half-unit pieces**. `helperId=halves`, `caseIds=[halves]`; all steps use A=−1½, B=+2 and unit size ½.

| Step | Example C halfTick | Split | Exact line |
| --- | ---: | --- | --- |
| 1 | −2 | false | **From −1½ to −1, this example ruler covers 1 half-unit piece. Its length is ½ unit.** |
| 2 | 0 | true | **At zero, the ruler covers 3 half-unit pieces: 1½ units. Zero is an end, so there is no interior split yet.** |
| 3 | 4 | true | **At +2, the ruler covers 7 half-unit pieces: 3½ units. The parts have lengths 1½ and 2. Its signed change is +3½.** |

Helper footer: **This is a supplied worked example. Your own ruler stays unchanged. Return at any step.**

Own-case notice, determined by the frozen helper's caseIds: **This example uses this invitation's own marks. It may supply part or all of a fitting construction. Opening it does not show which steps were viewed.** This overlap notice is not a claim about every step being seen. Keep reverse's reused guided endpoints explicit in its source context even though the crossing helper's caseIds contain only guided-cross.

## Return, Notes and retained data

Greeting: **Your ruler is here. Earlier comparisons still show the constructions and help context they used.**

Links, with no automatic copying of answers: **Keeper's Desk** (`#desk`) · **Number explorations** (`#numbers`) · **Math pathways** (`#pathways/math`). Link invitation: **Keep exploring. Your work stays with this tool.**

Notes destination: **Gap Line**.

Notes labels: **Current editable ruler** · **First comparison** · **Latest retry** · **{n} comparisons**; singular **1 comparison** · **Source Start** · **Source Finish** · **Source unit size** · **Supplied ruler end** · **Ruler end used** · **Split at zero requested** · **Show the move requested** · **Recorded endpoint result** · **Recorded length result** · **Clue opened** · **Hear requested** · **Working together reported** · **Across zero example opened** · **Below zero example opened** · **Half-unit example opened** · **Feedback available for this comparison**.

Own-case Notes labels: **Across zero example opened for this invitation's own marks** · **Below zero example opened for this invitation's own marks** · **Half-unit example opened for this invitation's own marks**. Follow each with **This example may supply part or all of a fitting construction. Opening does not show which steps were viewed.** Derive own-case overlap from retained helper caseIds and the corresponding opened-before flag, not from today's helper list.

Unknown overlap: **Earlier opened-example details are unavailable. Whether it used this invitation's own marks is unknown.** Unknown is not absence of answer support.

Supplied-context Notes: **Supplied ruler end: {A}** · **Supplied Split at zero: off** · **Supplied Show the move: off** · **Guided example supplied with this invitation** when guided lines are present. For reverse also show **This invitation reverses the two places used in the supplied Across zero guidance.** For coincident also show **The supplied zero-length ruler already fits this invitation.** These facts stay visible regardless of optional help flags.

False support flag: **Not recorded before this comparison**. Do not translate it as no real-life help, independent work, or no prior exposure.

History introduction: **These are retained records, not a new comparison.**

History policy copy: **Notes keep the whole current draft, the first comparison, the latest retry, their help context, and the comparison count. The first comparison stays unchanged. Middle retries are not all retained.** Presentation flags belong to the draft and each recorded context; toggling a presentation does not establish mastery.

Unsupported root: **Earlier Gap Line data are retained in your notes. This format cannot be edited here. Other places are still open.**

Unreadable source: **This earlier invitation cannot be opened here. Its original stays in your downloadable notes. Other places are still open.**

Unreadable case: **Some earlier work for this invitation cannot be read here. Its original stays in your notes. Other readable work remains open.**

Unreadable comparison: **An earlier comparison cannot be read here. Its original stays in your notes. A new comparison is unavailable for this invitation.** Use this before any absence/unchecked fallback in the board, Hear and Notes.

Unreadable teaching context: **Some earlier example context cannot be read. Comparing is unavailable; readable worked examples keep their available buttons.**

Missing helper: **This earlier worked example cannot be shown here. Your ruler is still open, and the original stays in your notes.**

Unreadable section: **Some retained entries cannot be read or matched to an invitation. Their originals stay in your notes.** Do not turn an unreadable or retained unknown entry into an empty record.

Report refusal: **This change could not fit safely in your downloadable notes. Your ruler and earlier comparisons stay as they were. Download your notes or visit another place.**

Count ceiling: **This invitation cannot keep another comparison here. Its first and latest comparisons stay in your notes. You can still change the ruler or try another invitation.**

Save-off: **Saving is off. This ruler stays in this session. Download your notes if you want a copy.**

Storage failure: **This ruler is in this session, but it could not be saved on this device. Download your notes.** Do not substitute a successful-save message.

Reset note: **The game's confirmed reset removes this explorer's ruler records from this device. It does not remove another explorer's work or files already downloaded.**

## Grown-up explanation

**These are invented number-line invitations. Start and Finish are fixed source marks. The learner moves a separate ruler end in whole-unit or half-unit steps. Equal pieces show the unsigned length from Start to that actual end. The optional move display shows signed change from Start. Length is never negative; a leftward change is negative.**

**Compare records two separate results: whether the constructed end meets Finish and whether its unsigned length matches the invitation's length. A construction can have the right length on the wrong side of Start. A zero-length ruler is a valid construction and already fits the shared-place invitation. Zero is a boundary, not an extra counted step. An optional split applies only when zero is inside the actual constructed span.**

**Across zero supplies its length and construction guidance from the outset. Back across zero reuses those same two places in reverse; it is not evidence of an independent new use. Optional clues, examples, narration requests, reported together-work, requested presentations and prior feedback remain part of the recorded context. An example may supply part or all of a fitting construction; opening it does not establish which steps were viewed, heard or understood.**

**The current draft and first/latest comparisons retain their own source and context. Earlier statuses are literal records, not new calculations or grades. Unknown retained models remain raw data without reconstructed formulas or pictures. Missing or unreadable support details mean unknown support, not no support.**

**This tool does not certify an independent method, explanation or mastery. All invitations stay open. There is no timer, score, gate, typed answer, microphone, voice recording, upload or automatic sharing. Only the supplied source, local construction drafts, first/latest comparison records, counts and support reports are stored for this explorer. Existing notes download, transfer and confirmed reset apply.**

Presentation note for implementation: use the app's friendly plain child text at 16px or larger. Keep literal minus signs, zero marks, piece boundaries and source/construction labels legible without relying on color. No real child or family data belongs in this content or its examples.
