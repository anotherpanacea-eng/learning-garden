# 367 · Courier Estimates: finite original text

Companion to [the specification](../specs/367-courier-estimates.md). English source text, not a released activity. Mathematical views interpolate only the bounded numbers/units specified there. No learner answer is marked correct or wrong.

## Arrival and source

**Courier Estimates**

Dot has some trip records and a new errand. Can a line help estimate the time?

**Made-up courier records.** These numbers are invented for this workbench. They are not real delivery times or promises.

“A rule can be exact,” says Dot. “My trip records don't all follow one exact rule. Let's try a line without changing the records.”

Choose **Orchard rounds** or **Library rounds**. Orchard context: “Six invented orchard trips, on routes from one to six model blocks.” Library context: “Six different invented library trips, on routes from one to six model blocks.”

**Start these records** · **Earlier kept models** · **Open model** · **Try this model again** · **Choose records**

“Changes stay in this visit until you keep a model. Leaving this place clears unkept changes.”

## Records

**Two numbers, one trip.** Route length goes across; recorded minutes go up. Every circle is one record.

Table headers: **Record** · **Route · model blocks** · **Recorded time · minutes**. Selection: **Record {n} · {x} blocks, {y} minutes**. Axis labels: **Route length · model blocks** and **Trip time · minutes**. Legend: **Circle: recorded trip** · **Solid line: current estimate** · **Dashed line: pinned estimate** · **Diamond: estimated trip, not observed**.

**Show a different example**

1. “Try estimate = 2 × blocks + 2. The 1-block estimate is 4 minutes, matching this example's first record.”
2. “At 2 blocks, the line gives 6 minutes. The record is 7: recorded minus estimated is +1 minute.”
3. “At 3 blocks, the line gives 8 minutes. The record is 7: recorded minus estimated is −1 minute.”
4. “The line does not pass through every record. We keep the records where they are and use the line as a rough model.”

Example table: (1,4), (2,7), (3,7). **Previous step** · **Next step** · **Close example**. The main graph still shows the chosen record set; example picture/table is separately labelled **Different example**.

## Try a line

**Change the line, keep the records.** Try changing the start. Then choose a record and compare its time with the line's estimate.

**Start · minutes at zero blocks** · **Rate · minutes per block**

“The start is this line's value at zero blocks. None of these trips was zero blocks long.” Historical source with an x0 row instead: “This source includes a zero-block record. The start is the line's value there; compare it with the record.”

**Show rate steps** · **Hide rate steps**. Text: “Across {run} model blocks, this line changes by {run×m} minutes. Its rate is {m} minutes per block.” At0: “Across {run} model blocks, the change is 0 minutes. The line is level.”

**Selected record**

“Recorded: {y} minutes. Line estimate: {estimate} minutes. Recorded minus estimated: {signedGap} minutes.”

Above: “This record is above the line: the trip took longer than this line estimates.”

Below: “This record is below the line: the trip took less time than this line estimates.”

Equal: “This record agrees with the line at this length. That doesn't make every other record agree.”

**Show all gaps** · **Hide all gaps**. Wide comparison-table caption: **All gaps · times in minutes; gap = recorded minus estimated**. Headers: **Record · blocks** · **Recorded** · **Estimated** · **Gap**. Gap means recorded minus estimated. Record-picker buttons show Record {n}, with route/time in their accessible labels and the selected-record readout.

“Look at all the gaps. A line through one record can still miss the rest. The same count above and below does not tell us how large the gaps are.”

**Pin this line for comparison** · **Replace pinned line** · **Remove comparison**

“The dashed line keeps your earlier start and rate. Neither line changes the recorded trips.”

Current rule: **Current line · estimate = {m} × blocks + {b}**. Pinned rule: **Pinned line · estimate = {m} × blocks + {b}**. Keep the units beside these rules, including when m or b is zero; no unexplained concatenated algebra.

## Use an estimate

**A new errand.** Choose a route length, then use your current line to estimate its time.

**4.5 model blocks** · **10 model blocks** · **Use this line**

Output: **Estimate for {x} model blocks: {m} × {x} + {b} = {value} minutes.** Optional pinned result has the same format and label **Pinned line estimate**.

Within range: “This length is between the recorded lengths. It is still an estimate, not a recorded trip.”

Beyond range: “This length is outside the recorded lengths. The line gives a number, but these records give less support here.”

At boundary if historical source supplies one: “This length is at the edge of the recorded lengths. The line's value is still an estimate, not a new recorded trip.” Below range uses the same Outside line. If a source request equals a recorded x: “Even at a recorded length, this line estimates a different trip. It does not replace that record.” Graph shading label: **Outside the recorded lengths**.

Different-request notice: “Your estimate was for {x} model blocks. Choose that length or use this line for this one.” Read-only kept variant: “Your estimate was for {x} model blocks. Try this model again to choose another length.”

Stale result: “Your line has changed. Use this line to update the estimate.” If only pin changed: “Your comparison has changed. Use this line to update the estimate.” The stored result still labels its actual rule. Stale results stay in text; diamonds return after Use. Current and pinned prediction diamonds are labelled C and P, including when both occupy the same point.

**Talk or write on paper**

- “Why would you try this line? Point to the records.”
- “Which record disagrees with it? How large is the gap?”
- “What else would you want to know before promising an arrival time?”

“These records show a pattern, not why it happened. They don't show that changing a route's length alone would change its time by this rate.”

“Try the other records. Would you keep the same line, or change it? You can keep both models.”

## Keep and recovery

**Keep this model** · **Kept model** · **Try this model again**

Success: “Model kept. The records and this line stay together.” Temporary saving-off: “Model kept for this session. Saving on this device is off.” Storage failure: “This model is in this session, but it could not be saved on this device. Download your notes.”

Cap: “Your earlier models are safe. This notebook cannot keep another model here. You can keep exploring in this visit and download your notes.” Preflight failure: “This model could not be kept. Nothing was changed. Your line is still here; open Grown-up notes to download your work.” Unsupported owner: “Earlier estimates are kept in your notes. This format cannot accept another model here.” Bad item: “Earlier model retained · its original stays in your notes.”

Unavailable older helper: “The earlier example stays in your notes. This model is still open.”

Use singular minute/block when the absolute value is1, including −1 and+1; zero gap is “0 minutes” without a sign. Dynamic request labels use the actual frozen value and units. The authored 4.5/10 labels are not imposed on older sources.

No current result: “No estimate used yet.” Kept work read-only: “This kept model stays as it was. Try it again to make another version.”

**Grown-up notes** · **Paired points** · **Signed rates and linear equations** · **Math explorations**

## Adult Notes only

“Courier Estimates is supported model exploration with invented records. Kept models retain their own source, line, optional comparison, used estimate and disclosed help. They are not independent-response checks, a measure of reading or mathematics level, real predictions or a complete statistics course. Spoken and paper explanations are not recorded. Unkept changes are session-only.”

## Given-number context repair

View refusal: “That view could not open. Your previous drawing and choices are still here. Open Grown-up notes to download your work.” Initial refusal: “That view could not open. Your earlier work is unchanged. Choose another activity or open Grown-up notes to download your work.” The chooser stays open.

Adult Notes amendment: “Given integer arithmetic qualifies matching waiting number work as previously shown. It adds no recall answer, attempt or outcome.”
