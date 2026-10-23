# Keeper's Desk, Case 7: The borrowed sorting machine

Companion to [spec 118](../specs/118-keepers-desk-entry.md) (conventions, records and acceptance), [spec 119](../specs/119-deeper-bench-packs.md) section 4 (the Sorting Desk's hand-written rules) and [spec 120](../specs/120-keeper-of-the-ways.md) (Les Saules, the post office). Status: **proposed case text, 2026-10-23. Not reviewed, not build-ready.** Fiction throughout. Needs a content reviewer and a subject reviewer for AI literacy (C1).

Case ID `sorting-machine`. Appears after Act I, once the post is running again.

**Model boundary.** The sorting machine is a **fully specified lookup model** described in section 3. It is not a live AI and nothing in the app learns. Every result in this case can be worked out by hand from the tables, and the build must reproduce them exactly.

## 1. Why this case

The Willow Sorting Desk teaches rules that someone writes down. This case shows the other way a machine can sort: by copying what happened to past examples. The explorer runs the machine by hand, finds that "right 75% of the time" hides a group it gets wrong every time, traces the failure to its examples and to what it was told to look at, and recommends what the post office should do. The ideas are the core of AI literacy at this level: a learned rule is only as good as its examples and its inputs, an overall score can hide unequal mistakes, and someone has to check.

## 2. Hook

> A wooden machine with brass funnels has arrived on the ferry from Les Saules, with a note from Léon: *Lent with pleasure. It learned to sort from all our parcels last year. It is very fast.*
>
> It is very fast. It is also, according to the hill farms, sending all their parcels to the town basket. Three farmers have walked down to complain, and one of them brought a goat.
>
> The postmaster puts the machine's instruction card on the desk. "I don't understand how it decides. I don't want to send it back if it's mostly helping. And I don't want the goat back either."

Buttons: **Look at the machine** · **Later**.

## 3. The machine (always visible in a side drawer)

**Its instruction card:**

> 1. Look at the new parcel's features: the ones ticked below.
> 2. Find all of last year's parcels with exactly the same ticked features.
> 3. Send the new parcel to the basket most of those went to.
> 4. If none of last year's parcels match, send it to the basket most of last year's parcels went to.
>
> Ticked: ☑ size ☑ wrap ☐ road on the label

**Last year's parcels** (its 40 examples, as Léon's office recorded them; every one was in the end delivered correctly):

| Size | Wrap | Road on the label | Went to Town | Went to Hill farms |
| --- | --- | --- | --- | --- |
| small | brown | valley road | 12 | 0 |
| small | blue | valley road | 10 | 0 |
| large | brown | valley road | 8 | 0 |
| large | blue | valley road | 6 | 0 |
| small | brown | hill track | 0 | 4 |
| **Total** | | | **36** | **4** |

**This week's parcels** (40, with where each really needs to go):

| Size | Wrap | Road on the label | Really for Town | Really for Hill farms |
| --- | --- | --- | --- | --- |
| small | brown | valley road | 9 | 0 |
| small | blue | valley road | 8 | 0 |
| large | brown | valley road | 7 | 0 |
| large | blue | valley road | 6 | 0 |
| small | brown | hill track | 0 | 4 |
| large | brown | hill track | 0 | 6 |
| **Total** | | | **30** | **10** |

This year the hill farms ordered seed sacks, which are large. Last year they ordered nothing large.

## 4. Steps

1. **How does it decide?** (following a specified procedure)
2. **Right three times in four?** (accuracy overall and by group)
3. **Why the hill farms?** (examples, features and skew)
4. **Try a fix** (testing changes and comparing results)
5. **What should the post office do?** (recommendation with conditions)

Steps open in any order.

## 5. Step 1: How does it decide?

**Learn card:**

> Some machines sort with a rule a person wrote: *if the label says hill track, send it to the hill farms.* That's the Sorting Desk.
>
> This machine has no rule like that. It copies the past. For each new parcel it finds old parcels that look the same, **in the ways it was told to look**, and does what most of them did.
>
> Worked example. A small blue parcel arrives. The machine looks at size and wrap only. Last year: small blue went to Town 10 times and to the hill farms 0 times. Most went to Town, so this one goes to Town.

**Guided first task (1a):** a small brown parcel; the matching row of last year's table lights up as the explorer follows the card one line at a time.

Tasks (Check my working):

- **1a.** A **small brown** parcel arrives. Where does the machine send it? *Answer: last year's small brown parcels: 12 Town, 4 Hill farms (it ignores the road). Most went to Town: **Town**.*
- **1b.** A **large brown** parcel addressed to a hill farm. *Answer: large brown last year: 8 Town, 0 Hill farms. **Town**.*
- **1c.** "Could this machine, as it's set, ever send any parcel to the hill farms?" *Answer: **No.** With only size and wrap ticked, every combination had more Town parcels than Hill farm parcels last year.*
- **1d.** Bramble: *"It's broken. Send it back."* Choices:
  - "It isn't broken. It's doing exactly what its card says." ← fits the card
  - "She's right. A machine that gets things wrong is broken."
  - "It must have a fault in one of the brass funnels."

  Reply to the second: "Every step it took matches its card. The problem is somewhere in what the card tells it to do, or in what it learned from."

**I'm stuck (1a):**

1. *Hint:* "Which row of last year's table matches *small* and *brown*? Remember, the machine doesn't look at the road."
2. *Similar example:* the learn card's small blue parcel, worked again. "Now find all of last year's small brown parcels, from both roads."
3. **Skip for now.**

**Replies to likely errors:**

| Entered | Misconception | Reply |
| --- | --- | --- |
| Hill farms for 1a | Using the road, which the machine isn't told to look at | "You read the road, which is what a person would do. The machine only looks at size and wrap. Which way did most small brown parcels go?" |
| Hill farms for 1b | Assuming the machine knows the address | "We know it's for a hill farm. Does the machine? Check what's ticked on its card." |

## 6. Step 2: Right three times in four?

**Learn card:**

> **Accuracy** is how many it got right out of how many it tried.
>
> An overall score can hide a group that does badly. Always ask: right for whom?
>
> Worked example: a machine sorts 20 letters. It gets all 18 town letters right and both farm letters wrong. Overall: 18 out of 20, 90%. For farms: 0 out of 2.

**Guided first task (2a):** this week's table with a column for "machine sends to", filled one row at a time.

Tasks:

- **2a.** Run the machine (size and wrap) on all 40 of this week's parcels. How many go to the right basket? *Answer: all 30 Town parcels are right, all 10 Hill farm parcels go wrong: **30 out of 40, 75%**.*
- **2b.** For Town parcels only? *Answer: 30 out of 30, **100%**.* For Hill farm parcels? *Answer: 0 out of 10, **0%**.*
- **2c.** Léon's note says the machine was right on 36 of last year's 40. Check it. *Answer: run on last year's parcels, it sends all 40 to Town; 36 were for Town: **36 out of 40, 90%**.*
- **2d.** "The postmaster says: *75% isn't bad. It's mostly helping.*" Choices:
  - "Mostly helping the town. For the hill farms it's wrong every single time." ← fits the counts
  - "Yes. Three quarters right is good enough for a post office."
  - "No. Anything under 90% should be sent back."

  Reply to the second: "Three quarters overall. Who are the quarter it gets wrong?" Reply to the third: "A cut-off like 90% sounds firm, but the machine scored 90% last year while getting every hill farm parcel wrong then too."

**I'm stuck (2a):**

1. *Hint:* "From Step 1, where does the machine send *every* parcel when it looks only at size and wrap?"
2. *Similar example:* the learn card's 20 letters. "Now: if all 40 go to Town, how many of them really were for Town?"
3. **Skip for now.**

**Replies to likely errors:**

| Entered | Misconception | Reply |
| --- | --- | --- |
| 10 for 2a | Counting the wrong ones | "10 went wrong. How many went right?" |
| 25% for 2a | Percentage of the wrong ones | "25% went wrong. The question asks how many went right." |
| 90% for 2a | Using last year's score | "That's last year. This week has more hill farm parcels. Count again." |

## 7. Step 3: Why the hill farms?

**Learn card:**

> A machine that copies the past can only be as good as the past it saw, and only as careful as the features it was told to look at.
>
> Two things to check: Were some groups **rare** in its examples? Was it told to look at the thing that **actually decides** where a parcel goes?

Tasks:

- **3a.** What fraction of last year's examples went to the hill farms? *Answer: 4 out of 40 = **1/10**, or 10%.*
- **3b.** "What decides where a parcel should really go?" Choices:
  - "The road on the label." ← fits the parcels
  - "Its size."
  - "Its wrapping."

  Reply to the second: "This year's large parcels go both ways. Size can't tell them apart." Reply to the third: "Brown parcels go to both places. Wrap can't decide it either."
- **3c.** "Why did the machine get every hill farm parcel wrong?" Choose any that apply; each has an authored reply, and none is marked wrong:
  - It wasn't told to look at the road.
  - Hill farm parcels were rare in its examples, so they never made up most of any group.
  - It had never seen a large hill farm parcel.
  - The hill farmers wrote their labels badly. *Reply: "The labels say hill track clearly. The machine never reads that part. Is the problem with the labels, or with what the machine looks at?"*
- **3d.** "Léon's office didn't do anything unfair on purpose. So whose job was it to notice?" Not marked. Choices: "Whoever set the machine up."; "Whoever decides to use it in a new place."; "The people it gets wrong, by complaining." The same closing line follows all three: "In Willowbank, the people it got wrong had to walk down with a goat to be noticed. Who should have noticed first?"

## 8. Step 4: Try a fix

**Learn card:**

> When you try a fix, change one thing and run the same parcels again, so you know what made the difference. Compare by group as well as overall.

The machine card in the drawer becomes editable: the explorer can tick or untick features, and can add this week's parcels to its examples.

**Guided first task (4a):** the first fix, run row by row.

Tasks (Check my working for each count):

- **4a.** **More examples.** Add this week's 10 hill farm parcels to last year's examples, keep size and wrap ticked, and run this week's parcels again. *Answer: small brown is now 12 Town against 8 Hill farms; large brown is 8 Town against 6 Hill farms. Both still go to Town. Hill farms **0 out of 10**; overall still **30 out of 40**.*
- **4b.** **Look at the road only.** Untick size and wrap, tick road, using last year's examples. *Answer: valley road was 36 Town, 0 Hill; hill track was 0 Town, 4 Hill. Every parcel goes where it should: **40 out of 40**, hill farms **10 out of 10**.*
- **4c.** **Look at everything.** Tick all three, using last year's examples. *Answer: Town parcels all match a valley-road row and go to Town (30). Small brown hill-track parcels match last year's 4 and go to Hill farms (4). Large brown hill-track parcels match **nothing** from last year, so rule 4 sends them to Town (6 wrong). Overall **34 out of 40** (85%); hill farms **4 out of 10**.*
- **4d.** "Why did looking at *more* features do worse than looking at only the road?" Choices:
  - "With everything ticked, it had no example of a large hill parcel, so it fell back to Town." ← fits the run
  - "More features always make a machine worse."
  - "The road feature is broken when other features are ticked."

  Reply to the second: "Not always. Here, the extra features split the examples into groups so small that one group was empty."
- **4e.** "Adding examples didn't help in 4a. Why not?" Choices: "The examples still didn't let the machine see the road."; "There weren't enough of them yet."; "Adding examples never helps." The first gets: "That's the heart of it. More of the same view doesn't show what it isn't looking at." The second gets: "Enough hill examples could tip the large brown group, but then the town's large brown parcels would start going to the hill farms instead. Size and wrap can't tell those parcels apart." The third gets a reply that more examples help when the features can tell the groups apart.

**I'm stuck (4b):**

1. *Hint:* "With only the road ticked, last year's table has just two groups. Count each."
2. *Similar example:* "If only wrap were ticked: brown was 20 Town and 4 Hill; blue was 16 Town and 0 Hill. Every parcel would still go to Town. Now try the road."
3. **Skip for now.**

**Replies to likely errors:**

| Entered | Misconception | Reply |
| --- | --- | --- |
| 10 out of 10 hill farms for 4a | Assuming more examples must fix it | "Run it row by row. Small brown: 12 Town, 8 Hill. Which is more?" |
| 40 out of 40 for 4c | Assuming more features must help | "Find a large brown hill-track parcel in last year's table. If there isn't one, which line of the card applies?" |

## 9. Step 5: What should the post office do?

**Question panel:**

> The postmaster needs to write to Léon, and to the hill farms.
>
> What you've kept so far: *[generated from kept answers, or "not yet"]*

Four parts, each with **Write it yourself** (free text) and **Choose and adapt**:

1. **Keep it, change it, or send it back?** Choices: keep it set to look only at the road; keep it, with a person checking every hill-track parcel; send it back and sort by hand; another plan.
2. **Your strongest reason.** Supplied starters: "Looking only at the road, it sorted all 40 this week."; "It got every hill farm parcel wrong while scoring 75%."; "A person reading the road does the same job without a machine."
3. **The best objection, and your answer.** The postmaster: *"If it only looks at the road, what happens when a new road is built and it's never seen it?"* For sending it back, Léon: *"It saved us hours every day. Couldn't you just change the card?"*
4. **Who checks, and how often?** Supplied: "Someone counts its mistakes by group every month, not just overall."; "The hill farms get a way to tell us when a parcel goes wrong."; "Before using it anywhere new, we run it on that place's parcels first."

**Keep this advice** saves it. **Send it to the postmaster** shows the letter.

**The postmaster's response (the same for every plan):**

> The postmaster reads it and nods slowly. "So it wasn't clever and it wasn't stupid. It just did what it was told, with what it was shown. I'll write to Léon tonight." A pause. "I'll write to the goat's owner first."

**Supported route:** Choose and adapt alone completes Step 5; steps 1 to 4 can stay open.

## 10. Revisits

- **Willow Sorting Desk, spec 119 section 4:** the hand-written rule *If the road says hill track, put it in Hill farms; otherwise Town* sorts this week's parcels perfectly. The pack's closing card can link here: "A person who knows what matters can write the rule. A machine that copies examples has to be shown what matters."

## 11. Topic references and prerequisites

Candidates, pending semantic review.

| Step | Candidate topics |
| --- | --- |
| 1, 4 | `mt_K6qtan847r` Machine Learning Basics |
| 2, 3 | `mt__BbOjiY5A5` Bias in AI Systems |
| 3, 5 | `mt_oajUvqAiBJ` Humans Versus Machines |
| 2 | `mt_PNSyfH56eQ` Calculating Percentages (simple fractions to percent only) |

**Hard-prerequisite crosswalk:**

| Topic | Hard prerequisites (in app?) | How this case handles them |
| --- | --- | --- |
| Machine Learning Basics | Data and Information for Computers (no); Patterns and Classification (no) | The Sorting Desk (spec 84) teaches classification by features; the learn card in Step 1 names features and examples. "Data" is introduced as last year's table. |
| Bias in AI Systems | AI Mistakes and Limitations (no); Machine Learning Basics (this case) | Step 1 shows the machine following its card exactly and still erring, which is the limitation; Steps 2 and 3 locate the bias in examples and inputs. |
| Humans Versus Machines | Machine Learning Basics (this case) | Step 5 and the Sorting Desk revisit compare a person's rule with a learned one. |
| Calculating Percentages | As in Case 3 | 75%, 90%, 85% and 10% come from simple fractions (3/4, 9/10, 17/20, 1/10). |

**Marble teaching research:** no record is bundled for the Computing topics. The case rests on their descriptions and needs a subject reviewer for C1.

## 12. What still needs review

- Subject review for AI literacy: the case simplifies a learned model to a lookup table with a majority vote. The reviewer should confirm that the simplification teaches the right lesson and that no line suggests real AI works exactly this way.
- Content review, and a check that the goat stays funny and no farmer is made the butt of the joke.
