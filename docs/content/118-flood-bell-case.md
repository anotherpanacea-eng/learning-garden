# Keeper's Desk, Case 4: When should the bell ring?

Companion to [spec 118](../specs/118-keepers-desk-entry.md) (conventions, records and acceptance) and [spec 120](https://github.com/anotherpanacea-eng/learning-garden/blob/claude/project-thread-zpfie6/docs/specs/120-keeper-of-the-ways.md) (Vadoalto, Nuria, the six-hour lag, Act VI's long rain). Status: **proposed case text, 2026-10-23. Not reviewed, not build-ready.** Every place, distance, time and record here is fiction.

Case ID `flood-bell`. Appears after Nuria's first letter (end of Act II), so an explorer who arrives with the letter from upstream has it from the start.

**Safety boundary (spec 120, S7).** This case is about reasoning with times, rates and uncertainty in a fictional valley. It must never read as advice about real floods. Every screen with the model carries the label **Story model: Willow Brook is made up.** The grown-up note says: "Real flood warnings come from official services. This case is about how to reason with uncertain timing, not about what to do in a flood."

## 1. Why this case

Spec 120 fixes one fact about the valley: water from Vadoalto reaches Willowbank **about 6 hours** later. In Act VI that fact saves the town, because Nuria's warning arrives in time and Willowbank passes it on to Les Saules. The four-depths table gives the desk this job: "Nuria's letter says it rose at 9 in the morning. When should the bell ring? What could make the water arrive sooner?"

The case prepares a question that returns in Act VI. "About 6 hours" turns out to hide three questions: how long the warning itself takes to travel, where the 6 comes from, and how sure anyone can be of it. The explorer ends by writing advice for the bell-ringer. It is a human-read fictional recommendation, not a program that the game executes; the supplied Act VI sequence remains owned by spec 120.

## 2. Hook

> The miller is waiting by the flood post with a chalkboard and a frown.
>
> "Nuria says that when the brook rises at Vadoalto, it gets here about six hours later. Lovely. Six hours is plenty. Except I've been trying to write a rule for the bell, and every time I write it down I find a hole in it."
>
> The board says: *When Vadoalto's brook rises, ring the bell six hours later.* Someone, probably Bramble, has written underneath: *Six hours after WHAT?*

Buttons: **Sit down with the miller** · **Later**.

## 3. Steps

1. **Six hours after what?** (time, 24-hour clock, elapsed time)
2. **Where does six hours come from?** (speed, distance and time)
3. **How sure is "about"?** (spread, typical value, and planning for the worst case)
4. **The rule for the bell** (writing a procedure, with its limits)

Steps open in any order.

## 4. Step 1: Six hours after what?

**Question panel:**

> Two things travel down the valley when the brook rises at Vadoalto: the water, and the message.
>
> | | How long it takes to reach Willowbank |
> | --- | --- |
> | The rising water | about 6 hours |
> | {courier}, running the river path by day | 3 hours |
> | {courier}, on the river path at night | 4 hours |
>
> This story's flood-post day-line uses the 24-hour clock.

**New case model, not inherited clock behavior:** this case needs its own bounded 24-hour day-line, with departure times at whole or half hours and explicit **same day / next day** answer context when midnight is crossed. Clock answers use `00:00` to `23:30` in half-hour steps; elapsed durations are separate numerical answers in hours. The supplied journeys last at most 9 hours, so these examples require at most one day boundary. Keep the time/day context in the case's frozen source and answer. Current Courier Clock Walk is a narrower 12-hour dial with a 60-minute elapsed window; it does not supply this model or its multi-hour/24-hour checks. A later revisit there requires a separately reviewed new pack, rather than relabeling its existing work.

**Learn card** (Marble research for 12-hour and 24-hour time: the day runs 00:00 to 23:59, and only afternoon times get +12):

> A day has 24 hours, counted from midnight, 00:00. Noon is 12:00. After noon the hours keep counting: 1 p.m. is 13:00, 9 p.m. is 21:00.
>
> To find a time 6 hours later, count on along the day-line. If you pass midnight, start again from 00:00, and it's the next day.
>
> 21:00 + 6 hours: 3 hours takes you to midnight, 00:00. 3 more makes **03:00, the next morning**.

**Guided first task (1a):** `09:00 + 6 hours = ?`, shown on the day-line.

Tasks (Check my working):

- **1a.** Nuria's note says the brook started rising at Vadoalto at **09:00**. When will the water reach Willowbank? *Answer: about **15:00**.*
- **1b.** {courier} sets off with the note at 09:00, by day. When does the note arrive? *Answer: **12:00**.*
- **1c.** So how much warning does Willowbank really get? *Answer: 15:00 − 12:00 = **3 hours**, not 6.*
- **1d.** Another time: the brook starts rising at **20:30**. The note leaves at once, by night. When does the water arrive, when does the note arrive, and how much warning is there? *Answers: water about **02:30** the next day; note **00:30**; warning **2 hours**.*
- **1e.** "Six hours after what?" Choose the best rule so far:
  - "Ring the bell six hours after the brook rises at Vadoalto."
  - "Ring the bell as soon as the message comes, whatever the time." ← fits the working
  - "Ring the bell six hours after the message comes."

  Reply to the first: "Nobody in Willowbank knows when it rose until the message comes. By then half the time has gone." Reply to the third: "The message took hours to get here. Six hours after it arrives, the water has already come."

**I'm stuck (1d):**

1. *Hint:* "Count on from 20:30 to midnight first. How many hours is that?"
2. *Similar example:* "22:00 + 4 hours: 2 hours to midnight, then 2 more is 02:00 the next day. Now 20:30 + 6 hours: how long to midnight?"
3. **Skip for now.**

**Replies to likely errors:**

| Entered | Misconception | Reply |
| --- | --- | --- |
| 26:30 for 1d | Counting past 24 | "The clock stops at 23:59 and starts again at 00:00. What time is 2 hours 30 minutes after midnight?" |
| 3 p.m. typed as 03:00 for 1a | Forgetting +12 for afternoon | "03:00 is three in the morning. Three in the afternoon is 12 + 3." |
| 6 hours for 1c | Ignoring the message's journey | "The water takes 6 hours, but the message uses some of them. What time does the message arrive?" |
| 14:30 for 1d (20:30 − 6) | Counting back instead of on | "The water arrives *after* it rises at Vadoalto. Count forward." |

## 5. Step 2: Where does six hours come from?

**Question panel:**

> Nuria has drawn the valley. Following the brook's bends, it is **18 km** from Vadoalto's flood post to Willowbank's.
>
> "In an ordinary flood," she writes, "the high water comes down at about **3 km an hour**. Our grandparents walked beside it once to see."

**Learn card** (Marble research for Compound Units: build the rate as "how far in one hour" on a double number line first; avoid the formula triangle):

> A speed is a rate: how far in **one** hour.
>
> ```
> km     0     3     6     9    12    15    18
>        |-----|-----|-----|-----|-----|-----|
> hours  0     1     2     3     4     5     6
> ```
>
> At 3 km every hour, 18 km takes 6 hours. You're asking: how many 3s make 18? That's 18 ÷ 3.
>
> Check the size: faster water should take **less** time, slower water **more**.

**Guided first task (2a):** the double number line, filled one hour at a time to 18 km.

Tasks:

- **2a.** At 3 km an hour, how long does the water take? *Answer: 18 ÷ 3 = **6 hours**.*
- **2b.** In a big storm the water comes faster: **4.5 km an hour**. How long now? *Answer: 18 ÷ 4.5 = **4 hours**.*
- **2c.** In a gentle rise it comes at **2 km an hour**. How long? *Answer: **9 hours**.*
- **2d.** With the 4.5 km an hour storm, the note leaves at 09:00 by day. How much warning? *Answer: water 13:00, note 12:00, **1 hour**.*
- **2e.** "What could make the water come faster?" Choose any; none is marked wrong, and each has an authored reply:
  - Much heavier rain than usual.
  - Ground already soaked from days of rain, so nothing soaks in.
  - A straighter brook, with fewer bends to slow it.
  - Wind blowing down the valley. *Reply: "Wind can push water about on a lake. A brook's speed comes mostly from how much water there is and the shape of its bed. Keep it as a question to ask Nuria."*

**I'm stuck (2a):**

1. *Hint:* "How far does the water go in one hour? How many of those make 18 km?"
2. *Similar example:* "A boat goes 5 km an hour. 20 km takes 20 ÷ 5 = 4 hours. Now: 18 km at 3 km an hour?"
3. **Skip for now.**

**Replies to likely errors:**

| Entered | Misconception | Reply |
| --- | --- | --- |
| 54 for 2a | Multiplying distance by speed | "Is 54 hours sensible for 18 km? Faster water means fewer hours. How many 3s make 18?" |
| 0.17 or 1/6 for 2a | Dividing the wrong way round (3 ÷ 18) | "That's less than an hour, for 18 km at 3 km an hour. Which way round should the division go?" |
| 6 for 2b | Not recomputing for the new speed | "That's the ordinary flood. This water comes faster, so should it take more time, or less?" |

## 6. Step 3: How sure is "about"?

**Question panel:**

> Nuria has copied out every flood her grandparents and Hollis both wrote down, with the hour it rose at each post.
>
> | Flood | Hours from Vadoalto's post to Willowbank's |
> | --- | --- |
> | A | 7 |
> | B | 6 |
> | C | 5 |
> | D | 6 |
> | E | 4 |
>
> The miller says: "So it's six hours. Like I said."

**Learn card** (Marble research for Comparing measurements: a typical value and the spread belong together):

> A list of times has a **typical value**, like the median, the middle one when you put them in order. It also has a **spread**: how far apart the shortest and longest are. The **range** is longest minus shortest.
>
> When you're planning for something that could hurt you if it comes early, the typical value isn't enough. You need to know how early it has ever come.

**Guided first task (3a):** the five times as tiles to put in order, then the middle one highlighted.

Tasks:

- **3a.** Put them in order and find the median. *Answer: 4, 5, 6, 6, 7; median **6 hours**.*
- **3b.** Find the mean. *Answer: 28 ÷ 5 = **5.6 hours**.* (Optional; the reply notes it's close to the median here.)
- **3c.** What is the range? *Answer: 7 − 4 = **3 hours**.*
- **3d.** If the town plans as if the water always takes 6 hours, in how many of these five floods would it have come sooner than planned? *Answer: **2 of 5** (C and E).*
- **3e.** The miller asks: "So what number do I put on my board?" Choices:
  - "Six hours, because that's the typical time."
  - "Four hours, because the water has come that fast before." ← fits a warning rule
  - "Seven hours, because that's the longest it's taken."

  Reply to the first: "Six is the middle. Twice in five floods, the water beat it. Is that a good bet for a bell?" Reply to the third: "Planning for the slowest flood means the water arrives before anyone expects it, every time but once."
- **3f.** "Could the water ever come sooner than 4 hours?" Not marked. Choices: "Yes, five floods is not many to go by."; "No, 4 hours is the fastest ever recorded."; "We can't know from this table." Each has a reply; the first and third both get: "That's the honest answer. Five floods is a short record."

**I'm stuck (3a):**

1. *Hint:* "Put the five times in order from shortest to longest."
2. *Similar example:* "Times 3, 8, 5: in order, 3, 5, 8. The middle is 5. Now order 7, 6, 5, 6, 4."
3. **Skip for now.**

**Replies to likely errors:**

| Entered | Misconception | Reply |
| --- | --- | --- |
| 5 for 3a (the middle of the table as written) | Taking the middle before ordering | "That's the middle of the list as Nuria copied it. Put them in order first." |
| 4 to 7 for 3c | Giving the two ends instead of the difference | "That's where the times start and stop. The range is one number: how far apart are they?" |
| 1 for 3d | Counting only the fastest | "Which floods took less than 6 hours? There's more than one." |

## 7. Step 4: The rule for the bell

**Question panel:**

> The miller wipes the board. "Write me a rule. Short enough for a chalkboard. Clear enough that anyone could follow it at two in the morning."
>
> What you've kept so far: *[generated from kept answers, or "not yet"]*

The rule has four parts, each with **Write it yourself** (free text) and **Choose and adapt**:

1. **When to ring.** Supplied: "Ring the bell as soon as Vadoalto's message arrives, day or night."; "Ring as soon as the message arrives, and again at the time on the message plus 4 hours."; another.
2. **What everyone does when it rings.** Story actions only, chosen from the town's list: put in the mill boards; move the market carts up to the green; send word on to Les Saules; open the library as a dry place to wait; check on the neighbors who live by the brook.
3. **What would make us ring sooner.** Supplied: "A message saying it's raining harder than anyone remembers."; "If the ground has been soaked for days."; "If the message took longer than usual to arrive."
4. **What this rule can't promise.** Supplied: "We only have five floods to go by."; "A message can be late."; "A storm bigger than any on the list could be faster."

**Keep this rule** saves it. **Chalk it on the board** shows it on the flood post board in the explorer's words.

**The miller's response (the same for every rule):**

> The miller reads it out loud, slowly, the way you'd read it at two in the morning. "I've kept your proposed rule. Let's read it together and check what it says, and what it can't promise." She draws a box round it in chalk.

**Story link:** spec 120 supplies Act VI's sequence: the town rings the bell when Nuria's message arrives, and the explorer sends the warning on to Les Saules. The kept advice can be displayed beside that scene for a human conversation. The game does not interpret or execute its free text, claim that the supplied sequence followed every possible recommendation, or infer that a particular written rule saved the town. Keeping this case is not required for the scene.

**Supported route:** every part can be finished with Choose and adapt alone, and steps 1 to 3 can stay open.

## 8. Revisits

- **Courier clock** (the Seedling job in spec 120's Act VI): an optional future 24-hour/multi-hour pack could revisit Step 1; the current 12-hour/60-minute model stays unchanged.
- **Act VI's warning to Les Saules:** the explorer can work out when the water reaches Les Saules if it's another 12 km at 3 km an hour (4 hours more), as an optional extra on the warning card.

## 9. Topic references and prerequisites

Candidates, pending semantic review.

| Step | Candidate topics |
| --- | --- |
| 1 | `mt_WfrE_4r-kY` 12-hour and 24-hour time; `mt_4emC463IyW` Comparing Time Durations |
| 2 | `mt_kLQOzZYrd5` Compound Units (speed as a rate only) |
| 3 | `mt_XSXnTQoQ4l` Comparing measurements; `mt_Cg8VPguS_V` Calculating the Mean |
| 4 | `mt_JiZ3H90Xg8` Risk, Uncertainty, and Cognitive Bias; `mt_zCUIJLdK_s` Developed Informational and Explanatory Writing (a procedure only) |

**Hard-prerequisite crosswalk:**

| Topic | Hard prerequisites (in app?) | How this case handles them |
| --- | --- | --- |
| 12-hour and 24-hour time | Telling time to the minute (age 7+) (no) | The new day-line teaches its whole/half-hour and midnight convention inline. Existing clock work is an optional narrower encounter, not an assumed 24-hour prerequisite; minutes beyond :30 are a documented exception. |
| Comparing Time Durations | Estimating answers (age 7+) (no) | The "check the size" line in Step 2's learn card is the estimate. |
| Compound Units | Proportion (no); Proportional Reasoning Vocabulary (no); Unit Conversions (no) | Narrowed to one rate in one unit (km per hour). The double number line builds the rate from scratch. Unit conversion is not needed: a documented exception. |
| Comparing measurements | Calculating the Mean (no); Pictograms and tally charts (age 11+) (no); Statistical Analysis Vocabulary (no) | Median and range are defined in Step 3's learn card; the mean is optional (3b). Spec 119's Count Collection pack teaches the mean with the levelling model. |
| Calculating the Mean | Statistical Analysis Vocabulary (no); Addition and subtraction strategies (age 10+) (no); Division with Decimals (no) | 28 ÷ 5 = 5.6 is the one decimal division, offered as optional. |
| Risk, Uncertainty, and Cognitive Bias | Difficult Ethical Choices (no); Ethics in Real-World Issues (no) | Narrowed to planning under uncertainty (3e, 3f, Step 4 part 4). The ethics prerequisites are not used: a documented exception, to be confirmed in review. |
| Developed Informational and Explanatory Writing | Layout and Formatting (no); Writing for an audience (no); Cohesion and Transitions (no); Choosing Form and Tone for Your Audience (yes) | The chalkboard and the "two in the morning" reader supply audience and form. Only a short procedure is written; treat as a partial candidate. |

**Marble teaching research used:** 12-hour and 24-hour time (day-line, +12 for afternoon only, midnight as 00:00), Compound Units (unit rate on a double number line, no formula triangle, size check), Comparing measurements (centre and spread together, range as one number). No research record was used for Risk, Uncertainty, and Cognitive Bias.

## 10. What still needs review

- Content review; a check that no line could be read as real flood-safety advice.
- The flood-wave speeds (2, 3 and 4.5 km an hour) are plausible round numbers for a story model, not measurements of any real river. Keep them labelled as the story's.
