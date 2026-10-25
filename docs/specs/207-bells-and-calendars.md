# 207. Bells and Calendars: order, duration, the calendar, the clock to the minute and timetables

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/207-bells-and-calendars-text.md); sources and open checks are in the [source audit](../source-audits/207-bells-and-calendars.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** the three history anchors were checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. Times, timetables and durations are checked by script; the teaching still needs the math check.

## Purpose

Learning Garden reads and sets o'clock and half past ([Preparation Clock, spec 68](68-preparation-clock.md)) and walks a coupled clock along a 0-60 elapsed-minute line with supplied five-minute endpoints ([Courier Clock Walk, spec 93](93-courier-clock-walk.md)). Both specs fence out the rest: five-minute and nearest-minute reading, past and to, a.m. and p.m., the 24-hour clock, intervals longer than an hour or across noon, calendars and timetables. Spec 120's own dependency table asks for "an hours clock" (Courier Clock Walk spans 5 to 60 minutes and Preparation Clock does not reach afternoon spans), and Act III chapter 3 says "map scale, timetables and route choice live here". This pack takes **thirteen** untouched time topics there, from the youngest's first, next and last to a 24-hour timetable.

A child comes to understand that time words order events (first, next, last; before, after) and that yesterday, today and tomorrow move as the days pass; that quicker and slower describe **how long**, while earlier and later describe **when**, and a later finish is not a longer job; that duration is measured from a shared start, with tools, in seconds, minutes and hours; that the week, the year and the clock all go round, with months of different lengths and leap years to keep the calendar on the seasons; that the long hand's numbers count in fives, and a time is read past (right side) or to (left side), and to the minute by counting on from the last five; that every clock time happens twice a day, which a.m., p.m. or the 24-hour clock tells apart; that units of time change by ×60, ×7 and ×12; that how long and when it ends are two questions on one number line, counted on through the o'clock; and that a timetable is a table of times read by column and row.

**Builds on, never re-teaches:** spec 68's hour and half-hour face and its "60 minutes in an hour" (here: a recap line on the Mended Clock, then five-minute and single-minute positions); spec 93's elapsed-minute line, five-minute steps and the 12-crossing (here: the same count-on idea with arbitrary minutes, more than an hour, both directions and across noon); spec 178's Trip Line, which reads hours along a graph axis (here: no graphs); spec 48's Bell Studio (`#studio/bells`), which makes bell calls (here: the tower bell only strikes the hour); spec 33's bell tower repair (here: the clock it mends); draft spec 134's calendar slider, which shows why a 365-day calendar slides (here: the Gregorian rule that fixes it, Keeper's Desk only); draft spec 118's Case 4 *When should the bell ring?* (here: only its clock step, F5, as a revisit; rates and uncertainty stay in Case 4).

**Not targeted:** *Time Units and Calendar Facts* (`mt_EXlmTURK_o`, soft prerequisite) is taught inline for month lengths and leap years but claimed by draft spec 134 (PR #137); no claim here. *Telling Time: Hours and Half Hours* and *Number of minutes in an hour* stay spec 68's. Time zones, daylight saving, seconds on a clock face and Roman numerals are out of scope. Hours in a day (24) appears inline on the Day Line; spec 68 scoped it out and no claim is made.

## Place and story

**Host:** the **Clock Room** at the top of the town bell tower, route `#tower/clock` (no spec on main or any draft PR uses a `#tower` route; checked 2026-10-25). Linked from spec 33's bell tower, the Post Office (for the timetable board), spec 93's end screen ("Read the tower clock to the minute") and spec 48's Bell Studio. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 4 *mend the village* | The storm stopped the clock at a quarter past three (spec 33). Pip, {guide} and Dot set the hands, wind it and ring the bell. | Sprout: order the mending (first, next, last). Seedling: read 3:15 and set the clock. |
| II, ch. 2 *a garden across the seasons* | The librarian pins up a tower calendar with the four festivals in their seasons. Pip draws his birthday on every Tuesday. | Sprout: which festival comes next. Seedling and Sapling: days, weeks, months. Keeper's Desk: Wren Halloway's leap-year ledger. |
| III, ch. 3 *the route by the high ford* | The post coach starts running to Vadoalto. Dot chalks 06:50, 11:35, 15:15; Bramble says a clock stops at twelve. | Sapling: 24-hour time. Keeper's Desk: which coach, how long. |
| III, ch. 4 *letters up and down the river* | Léon sends the ferry times "the French way": *13 h 05*. | Seedling: read Léon's short letter. Sapling: the ferry column. |
| III, ch. 1 *the floating market* (Keeper's Desk case idea) | Spec 120's "rises at 9, about 6 hours later": the clock step only (F5), then on to spec 118 Case 4. | Keeper's Desk. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. Festival jobs never feed Act I, so the clock mending is a chapter adapter, not a festival job. **Calendar consistency with spec 120:** the season follows the device month and the hemisphere setting (specs 33 and 116; default northern); festivals sit in their seasons (Flood Boards and Planting, spring; Market Fair and the Show, summer; Harvest Supper, autumn; Lantern Night, winter, on the longest night), and no festival is given a fixed date. Items use season order only, which is the same in both hemispheres. Storm Day's February 29 rule (February 28 in other years) is quoted unchanged. The town, tower, ferry, coach and their times are fiction, labeled apart from math, history and models. The old Keeper does not appear (Hollis rule). Pip's title "Assistant Bell Ringer" is self-appointed; no new cast member keeps the tower.

## The knowledge

**Order and time words.** First, next, last; before, after; morning, afternoon, evening. Yesterday, today and tomorrow are **deictic**: they shift as "today" moves, so the Day Strip's Today marker relabels them. Sequence is by when, never by excitement.

**Comparing durations.** Duration is how long, start to end. From a **shared start**, the one who finishes first was quicker (less time). With different starts, compare the measured lengths, not the finishing order. Faster, further, busier or later-finishing never means longer by itself. Earlier and later name **position** in time; quicker and slower name **duration**.

**Measuring and recording.** A sand-glass, a stopwatch or counted seconds measure duration; start when the job starts, stop when it stops. 1 minute = 60 seconds (not 100). Record informally first ("about 2 minutes"). Duration bars from one start line order three or more jobs; a timeline sequences intervals. Estimating chooses a sensible unit (40 stairs take about a minute, not a second or an hour).

**Calendar.** Seven days in a week, going round (after Sunday, Monday). Twelve months; seven have 31 days, four have 30, February has 28 or 29; the knuckle rule. A year is 365 days (52 weeks and 1 day), a leap year 366. Weeks do not fit months exactly, so a week can cross two months; "a month is 4 weeks" is approximate. **Leap years (Keeper's Desk):** divisible by 4, except century years, which must be divisible by 400 (1900 no, 2000 yes, 2100 no); 97 leap years in 400 years, an average year of 365.2425 days. Spec 134 shows why the quarter day matters; this pack adds the century rule and the 1582 change.

**Clock to five minutes, past and to.** Each numeral is a five-minute step for the long hand (numeral 4 means 20). Right side, minutes **past** this hour; left side, minutes **to** the next hour (3:40 is twenty to four, and the digital hour stays 3). Quarter past and quarter to. The short hand moves all hour: at 3:45 it is three quarters of the way to 4.

**To the minute.** Find the last five passed, count on the little marks (4 × 5 + 3 = 23). "To" times use a bond to 60 (3:44 is 16 to 4). The hour is the numeral the short hand **last passed** (7:43 has the short hand near 8, and the hour is 7).

**a.m., p.m. and 24-hour.** Every face time happens twice a day. a.m. runs midnight to noon, p.m. noon to midnight. The 24-hour clock counts the day 00:00 to 23:59: midnight 00:00 (never 24:00), noon 12:00; from 1 p.m. add 12 (3:45 p.m. = 15:45); a.m. hours keep their number with a leading zero (08:05); the noon hour stays 12 (12:20 = 12:20 p.m.); from 13:00 take 12 away (19:30 = 7:30 p.m.). Decide before or after noon first. The tower bell strikes the 12-hour count (15:00 strikes 3): a model rule, and the way most striking clocks work.

**Changing units.** Multiply then add the rest: 3 h 25 min = 3 × 60 + 25 = 205 min; 8 weeks 3 days = 59 days; 2 years 5 months = 29 months. Reverse by dividing with a remainder: 150 s = 2 min 30 s (not 1.5 min). Never ×100; never place numbers side by side (325, 83).

**Elapsed time on a number line.** One count-on method answers both questions. **How long:** mark start and end; jump to the next o'clock (a bond to 60), then whole hours, then the minutes left (2:50 to 4:10 = 10 + 60 + 10 = 80 min = 1 h 20 min). Column subtraction of times treats an hour as 100 minutes and gives 160. **When does it end:** jump to the o'clock, then add what is left (2:15 + 47 = 3:02, never 2:62). Across noon, jump to 12:00 first (11:35 to 14:05 = 25 + 120 + 5 = 150 min). A later end time does not mean a longer duration; compute both, then compare.

**Timetables.** Columns are trips, rows are stops; find your trip and read down. Journey time = arrival − departure; a connection needs the arrival before the next departure. The board's times are made up (below).

**Real anchors (see audit).**
- **Su Song's clock tower.** Su Song, a scholar-official of the Song dynasty, had an astronomical clock tower built in the capital, Kaifeng, completed about 1088-1092 (sources commonly give 1088; his illustrated treatise *Xin Yixiang Fayao* was finished in 1092 and printed in 1094). A large water wheel, regulated by an escapement, drove it; wooden figures in its tiers sounded the hours with bells, drums and gongs. Jurchen invaders dismantled it in 1127, and it was not successfully rebuilt; modern working replicas follow his drawings. Child text: "more than 900 years ago", water wheel, figures with bells and drums.
- **The Gregorian calendar, 1582.** The Julian calendar's leap day every four years made its average year 365.25 days, about 11 minutes too long, so by the 16th century the calendar had drifted about 10 days against the equinox. Pope Gregory XIII's reform dropped ten dates (Thursday 4 October 1582 was followed by Friday 15 October in Rome and the countries that adopted it at once) and introduced the century rule. Britain and its colonies changed in 1752; other places later. Child text: the skipped dates and the rule; the 1752 date in the keeper's note.
- **Italy's railway time, 1893.** A law of 10 August 1893 (in force from 1 November 1893) set the railways of the whole Kingdom of Italy to the mean time of the meridian 15° east of Greenwich and numbered the hours from midnight. Several reference works name Italy the first country to adopt the 24-hour system officially; the Canadian Pacific Railway used 24-hour times from 1886, so "first" is not in child text. Child text: one shared time, hours counted from midnight.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Day Strip | T1, T2 | Pip's bell morning (3 steps) | Set A |
| Sand-Glass Shelf | T3, T4, T5 | Three small glasses (3 steps) | Sets A, C |
| Tower Calendar | T6, T7, T8 | Yesterday from Thursday (2 steps) | Set B; E7 |
| Mended Clock | T9, T10, T11 | Long hand on the 5 (3 steps) | Set D |
| Day Line | T12-T16 | Ferry 10:20 to 11:10 (3 steps) | Sets E, F |
| Timetable Board | T17 | Ferry 2 to Les Saules (3 steps) | Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists fourteen); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** before vs after; yesterday vs tomorrow as Today moves; quicker vs earlier; finished later vs took longer; busy vs long; seconds vs minutes in one comparison; numeral vs minutes (4 vs 20); past vs to; quarter past vs quarter to; nearest numeral vs last passed; a.m. vs p.m.; +12 vs +10; morning hours vs afternoon hours; noon hour vs midnight hour; 00:00 vs 24:00; ×60 vs side by side; count on vs column subtraction; how long vs when it ends; left first vs arrived first.

**Top misconceptions designed against:** ordering by excitement; swapping yesterday and tomorrow; words fixed while days pass; before/after reversed; faster means longer; later finish means longer; busy means long; the year or week as a line with an end; restarting the days from Monday; every month 31 days; every month exactly 4 weeks; only the four-year leap rule; 100 seconds in a minute; starting the timer out of step; reading the numeral as the minutes; quarter past/to confused; the short hand on a number; "to" naming the earlier hour; nearest numeral as the hour; +10 for p.m.; +12 for a.m.; taking 12 from 12:xx; midnight as 24:00; the bell strikes 15; side-by-side conversions; dropping the remainder; minutes past 60 (2:62); column subtraction across the hour; a later end time means a longer trip.

## The game or activity

**(a) Day Strip, model `day-strip-v1`.** Picture cards of Pip's day on a morning / afternoon / evening strip, and a three-day yesterday / today / tomorrow strip with a moveable **Today** marker. Ordering uses **Earlier** and **Later** buttons as well as drag. Moving Today relabels the day words and says so. *A made-up model: Pip's day in pictures; your day can be different.* Sprout.

**(b) Sand-Glass Shelf, model `sandglass-v1`.** A 1-minute and a 5-minute glass. **Race mode:** two characters start together on one start line; the child says who was quicker and who took longer; a second card gives different starts. **Bar mode:** each job is a bar from one start line (lengths in glass turns or minutes); line them up shortest first; a **seconds strip** (10-second taps, six to a minute) and a minutes/seconds swap. *A made-up model: tap to let 10 seconds of sand fall; screen sand is not real timing.* No real-time countdown runs; real timing is the off-screen invitation. Sprout to Sapling.

**(c) Tower Calendar, model `tower-calendar-v1`.** A looping week wheel (tap any day; step either way), a 12-month year strip with day counts and the knuckle picture, a month grid, and season bands showing the four festivals in their seasons from the hemisphere setting. A weeks↔days and years↔months panel (Keeper's Desk). **Leap year?** card (Keeper's Desk): three questions in order (by 4? a century? by 400?). Month lengths and the leap rule are real; the festival places are story.

**(d) Mended Clock, model `tower-clock-v1`.** The tower face from inside, 720 single-minute positions on a 12-hour cycle (`m` 0..719), hands coupled as in spec 93: minute angle `(m % 60) × 6`, hour angle `m / 2` degrees clockwise from 12. Controls: **Back 5 / Back 1 / Forward 1 / Forward 5 minutes**, drag or tap a minute mark (the short hand follows); overlays **Show fives** (5, 10, ... 55 around the rim) and **Show past and to** (right/left halves). Read mode shows a fixed face; Set mode moves a separately labeled model, as spec 68 does. Because the hands are coupled, independent drawing of the short hand is not claimed; D2 asks where it sits instead.

**(e) Day Line, model `day-line-v1`.** One day, 00:00 to 24:00, noon in the middle, a.m. and p.m. halves shaded, 12-hour and 24-hour labels toggled together. **Add a jump** draws labeled jumps from a start (to the next o'clock, whole hours, minutes left) with a running total; the same line answers "how long?" and "when does it end?". A **column** card shows why 11:00 − 10:15 as plain numbers gives 85, then counts on to 45. Durations up to 24 hours; no wrap past midnight in assessed items.

**(f) Timetable Board, model `timetable-v1`.** Dot's chalk board with two tables (full text in the companion). **Ferry to Les Saules:** Willowbank landing 07:45, 10:20, 13:05, 16:40; Mill bend 25 minutes later; Les Saules 50 minutes after leaving. **Post coach to Vadoalto:** Willowbank post office 06:50, 11:35, 15:15; High ford 1 h 15 min later; Vadoalto 2 h 30 min after leaving (the 11:35 runs across noon). **Pick a trip** highlights a column, **Read down** steps to a stop, **Show 12-hour** adds a.m./p.m. labels, **Show the journey line** sends the trip to the Day Line. *Made-up times for a made-up ferry and coach.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. First, next, last; quicker and slower | Sprout (A1-A4), Seedling (A5) | 5 | order, 3-choice |
| B. Days, weeks, months and the calendar | Sprout (B1), Seedling (B2), Sapling (B3, B4), Keeper's Desk (B5, B6) | 6 | 3-choice, number |
| C. Sand-glasses, seconds and how long | Seedling (C1-C3), Sapling (C4, C5) | 5 | 3-choice, order |
| D. Reading the mended clock | Seedling (D1-D3), Sapling (D4, D5) | 5 | 3-choice, number |
| E. a.m., p.m., 24-hour and changing units | Sapling (E1-E5), Keeper's Desk (E6, E7) | 7 | 3-choice, number with worked steps |
| F. How long, and the timetable board | Sapling (F1, F2), Keeper's Desk (F3-F8) | 8 | number with worked steps, 3-choice, true / not true from this source, *say why* |

Sprout items use no numbers. Over the 21 three-choice items the right answer sits at A, B and C seven times each. Distractors that withhold more than the evidence allows: A5 ("we can't tell from bars"), C5 ("you can't compare minutes and seconds") and F4 ("the earliest is safest", which ignores a later coach that also works). *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `clockRoom` per explorer, absent until a first explicit action.

```
clockRoom: {
  version: 1,
  strip:    { source, order: [cardId], today: -1|0|1, at },
  bars:     [{ source, mode: 'race'|'bars', order: [jobId], at }],               // latest 12
  calendar: { source, month: 1-12, leapYear: int 1500-2500 | null, at },
  clock:    [{ source, mode: 'read'|'set', minute: 0-719, choice | null, at }],  // latest 12
  dayLine:  [{ source, start: 0-1439, jumps: [int 1-1440], at }],                // latest 12; at most 6 jumps
  board:    { source, trip: tripId | null, stop: stopId | null, twelveHour: bool, at },
  answers:  { [itemId]: { source, choice | value | order | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version (`day-strip-v1`, `sandglass-v1`, `tower-calendar-v1`, `tower-clock-v1`, `day-line-v1`, `timetable-v1`), the item's choices and order, and for board items the full timetable shown. Codes and numbers only; a number answer stores the parsed value (minutes as an integer, a day as a code), never free text. Never recompute or rewrite saved results on load; validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching. No real date, device time or timing data is stored; the Today marker is an offset, not a date.

## Curriculum fit

**Strands:** **M** measurement of time, calendars, unit conversion and elapsed-time arithmetic; **H1** a clock tower, a calendar reform and a railway law as sources. Act families: I, II, III (revisited in V's courier route and VI's weekly route plan).

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Order events with time words; compare durations from a shared start; measure and record time; know days, weeks, months, years and leap years; compare and sequence intervals; read the clock to five minutes and to the minute, past and to; use a.m., p.m. and 24-hour time; convert units of time; find durations and end times on a number line across the hour and noon; read a timetable. |
| Teaching encounter | T1-T17 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Today marker; shared start line; duration bars; week wheel; knuckles; fives and past/to overlays; jump line with running total; column card; read-down highlight; the "I'm stuck" ladder. |
| New application | Léon's French-style times; the coach across noon; the latest coach before 3 p.m.; the six-hour lag; ferry vs coach arrival; the 1582 skip; 2100. |
| Purposeful revisit | Spec 68 (hours, half hours) and spec 93 (elapsed minutes) recapped; spec 178 Trip Line (hours on an axis); spec 118 Case 4 (the bell rule); spec 120 Act VI weekly route plan. |
| Data boundary | Orders, positions, choices, values and support codes, all local. No free text, real dates, device time, timing or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`. Several pinned names mislead; the descriptions are used.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Ordering Events in Time (`mt_-vvVxpOHG2`) | Daily routine, use not definitions, a moveable today marker, slips treated gently. Day Strip; T1, T2; A1-A3. |
| Comparing durations (`mt_TcG90kS8nu`) | Quicker/slower vs earlier/later; shared start; same-path, different-start and busy-vs-calm contrasts. Race mode; T3; A4, A5. |
| Days, Weeks, Months & Years (`mt_bj1YCgNWUx`) | Looping wheel, random access both ways, nesting, the cycle. Week wheel and year strip; T6, T7; B1-B3. |
| Sequence intervals of time (`mt_6XCURuNwPw`) | Measured duration bars from a common start; separate finishing order from length. Bar mode; T5; A5, C3. |
| Telling Time: Minutes (`mt_HNOPGJYiRK`) | Count in fives; past/to split; quarter past vs to; hour hand partway. T9, T10; D1-D3. Drawing both hands is not claimed (coupled hands). |
| Telling time to the minute (`mt__N55B7u7HD`; description: measure and record in hours, minutes, seconds) | Start and stop in step with the event; sand-glass first; 60 seconds; "about". T4; C1, C2; off-screen timing. |
| Telling time to the minute (age 7+) (`mt_4m8BimI4G5`; five minutes, a.m./p.m., 12- and 24-hour) | Numeral-to-minutes count; colon not point; a.m./p.m. anchored in the day. T9, T12, T13; D1, E2, E5. |
| Telling time to the minute (age 8+) (`mt_UNzojLkNdm`) | Last five then count on; bond to 60 for "to"; hour last passed. T11; D4, D5. |
| Telling time to the minute (age 9+) (`mt_2yas4Unc8o`; description: converting units of time) | Multiply then add; reverse by divide with remainder; no ×100; months irregular. T14; C5, E6, E7. |
| Comparing Time Durations (`mt_4emC463IyW`) | Count on via the o'clock, not columns; compute both before comparing. T15; F1, F3, F6, F8. |
| 12-hour and 24-hour time (`mt_WfrE_4r-kY`) | Ground ±12 in the day line; leading zero; 00:00 and 12:xx boundaries; before or after noon first. Day Line; T13; E1-E5, F4, F5. |
| Numbers on a number line (`mt_IL86kadLSS`; description: elapsed-time word problems in minutes) | Both directions on one blank line; bridge the o'clock; no 2:62. T15, T16; F1-F3, F5. |
| Estimating answers (age 7+) (`mt_3XJkeIn6J6`; description: estimate and read time to the minute; seconds, minutes, hours) | No Marble research record exists for this id at `7bd8b67`; the pinned description and evidence are followed: sensible units, nearest-minute reading, comparing durations in different units. C4, C5, D4. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Ordering Events in Time | none listed | n/a |
| Comparing durations | none listed | n/a |
| Days, Weeks, Months & Years | Ordering Events in Time (`mt_-vvVxpOHG2`) | Taught here (Day Strip before the calendar). |
| Telling time to the minute (`mt__N55B7u7HD`) | Comparing durations (`mt_TcG90kS8nu`) | Taught here (race mode, T3, before T4). |
| Sequence intervals of time | Telling time to the minute (`mt__N55B7u7HD`) | Taught here (T4 before T5). |
| Sequence intervals of time | Comparing durations (`mt_TcG90kS8nu`) | Taught here. |
| Telling Time: Minutes | Telling Time: Hours and Half Hours (`mt_0XxyaQLRhn`) | Met elsewhere: spec 68 (built, scoped partial); recapped on the Mended Clock. |
| Telling time to the minute (age 7+) | Telling Time: Minutes (`mt_HNOPGJYiRK`) | Taught here (T9, T10 before T12, T13). |
| Telling time to the minute (age 8+) | Telling time to the minute (age 7+) (`mt_4m8BimI4G5`) | Taught here (T9-T10 before T11). |
| Estimating answers (age 7+) | Telling time to the minute (age 7+) (`mt_4m8BimI4G5`) | Taught here. |
| Estimating answers (age 7+) | Sequence intervals of time (`mt_6XCURuNwPw`) | Taught here (bar mode). |
| Comparing Time Durations | Estimating answers (age 7+) (`mt_3XJkeIn6J6`) | Taught here (C4, C5, D4 before Set F). |
| 12-hour and 24-hour time | Telling time to the minute (age 7+) (`mt_4m8BimI4G5`) | Taught here (T12 before T13). |
| Numbers on a number line (elapsed time) | Comparing Time Durations (`mt_4emC463IyW`) | Taught here (T15 before T16). |
| Numbers on a number line (elapsed time) | Telling time to the minute (age 8+) (`mt_UNzojLkNdm`) | Taught here (Mended Clock before Day Line). |
| Telling time to the minute (age 9+) | Converting measurement units (`mt_d8al9JcajP`) | Documented gap: in neither the build-out map nor any spec. Supported inline for time units only (T14); no claim. |
| Telling time to the minute (age 9+) | Numbers on a number line (`mt_IL86kadLSS`) | Taught here (reassigned to this pack from spec 189 by the coordinator). |

Soft prerequisites noted: Counting in 2s (`mt_nvdpxAJTBG`, for Telling Time: Minutes; counting in fives is used and taught on the rim); Time Units and Calendar Facts (`mt_EXlmTURK_o`, for Comparing Time Durations; draft spec 134 claims it). Claim check, 2026-10-25: no spec on main (`b68d8de`) or any draft PR (126, 128, 137-151) claims the thirteen targets. Specs 68 and 93's audits and draft spec 118 Cases 3 and 4 name some of them only as deferred or candidate references; spec 189 drops `mt_IL86kadLSS` toward this pack.

## Checks for implementation

- **Numbers script (2026-10-25):** `check207.py` (`python3 -I`), 81 checks passing: ferry runs 25 + 25 = 50 minutes and coach runs 75 + 75 = 150 minutes for every column, only the 11:35 coach crossing noon; 12-hour forms 8:35 a.m., 11:10 a.m., 1:55 p.m., 5:30 p.m. and 13:05 = 1:05 p.m.; T9-T17 worked examples (numeral 5 = 25, numeral 8 = 40, 4 × 5 + 3 = 23, 3:45 p.m. = 15:45, 8:05 a.m. = 08:05, midnight 00:00, 205 minutes, 150 s = 2 min 30 s, 2:50 to 4:10 = 80 with the column answer 160, 3:40 + 35 = 4:15); month lengths 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 summing to 365 (366 leap); seven 31-day and four 30-day months; 2024, 1900, 2000, 2100 leap status; 97 leap years per 400 and 365.2425 days; clock angles at 3:15 (97.5°, 90°), 3:25, 3:45 (hour 112.5°), 3:40, 7:43 (hour 231.5°, minute 258°); B2 Wednesday; B3 Friday (wrong Thursday counts today); B4 8 days (wrong 9); B5 2100 not leap; B6 10 dates (wrong 11); C3 1, 2, 5 minutes; C5 240 > 200 s; D4 7:43 (wrong 8:43, 7:11); D5 16 (wrong 56); E1 15:15 (wrong 13:15); E2 7:45 a.m. (wrong 19:45); E3 7:30 p.m. (wrong 9:30); E4 12:20 p.m.; E5 3 strikes; E6 205 (wrong 180, 325); E7 59 (wrong 56, 83); F1 45 (wrong 85); F2 3:02 p.m. (wrong 2:62); F3 2 h 30 min (wrong 2 h 70, 3 h 30); F4 latest coach 11:35; F5 15:00 = 3 p.m.; F6 ferry first by 45 (wrong 85); F8 every ferry 50 minutes; 15 October 1582 a Friday; 24 leap years from 2001 to 2100; the companion's 36 items and the A/B/C balance (7, 7, 7) parsed from the file.
- Clock hands always coupled and the short hand never snaps to a numeral; past/to overlay halves split at the 12-6 line; 24-hour labels always four digits with a colon; midnight shown as 00:00 only. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- Style check run on the companion (`style207.py`): no em-dashes; teach cards at most 25 words (limit 30); prompts at most 15 words; feedback, hints and explanations at most 17 words (limit 20); scenes within 30 / 150 / 80; no UK spellings found; no "not X but Y" construction flagged.
- Browser at 320 and 820 px: targets 44 px; drag always has a button equivalent (Earlier/Later, ±1/±5 minutes, Add a jump); every clock has a text equivalent ("Long hand on the 8, short hand two thirds of the way from 3 to 4: 3:40"); timetables are real tables with headers.
- Léon's French lines (*Bonjour des Saules !*, *Le bac part à 13 h 05.*) checked by a fluent reader before build.
- **Independent review, 2026-10-25:** recomputed both timetables, every clock reading, calendar count, conversion and duration with a separate reviewer script (`rcheck207.py`, `python3 -I`, 52 checks passing, including the 7/7/7 balance and 36 items); checked the thirteen Marble descriptions and hard prerequisites, claims across main, draft PRs and the build-out map, the festival names and seasons against spec 120's festival file (Lantern Night on the longest night is spec 120's own line), spec 120's 6-hour bell case, and that specs 68 and 93 are recapped, never re-taught. Italy's 1893 railway law confirmed by search (tz-database quotation of the decree). Changed: A2 reworded ("he rings it the day after") because the old prompt let "today" be a fair answer; D2's two short distractors lengthened to remove a length giveaway; one implementer Tests note no longer says "wrong". No em-dashes.

## Review asks

**Math expert:**
1. Is "the hour is the number the short hand last passed" the right rule to state for 7:43, with the short hand drawn three quarters of the way to 8?
2. Is the tower bell's 12-hour strike (15:00 strikes 3) a fair model rule to teach beside the 24-hour clock?
3. Is a coupled-hand clock with a "where is the short hand?" item (D2) an acceptable stand-in for drawing hands, given the research's "draw the hands" evidence?
4. Do the Gregorian rule and the 1582 skip belong at Keeper's Desk, after spec 134's sliding-calendar cause?

**Owner questions, with defaults:**
1. Route `#tower/clock` in the bell tower, with the timetable board there rather than at the Post Office? *Default: yes; the Post Office links to it.*
2. The ferry runs down the brook from Willowbank to Les Saules (spec 120 has Léon keep "the ferry at Les Saules"). Keep this route for the timetable? *Default: yes, as a story detail; Léon's letter introduces it.*
3. Thirteen targets in one pack, or split clock reading (benches d, e) from calendar and order (a-c)? *Default: one pack; the Day Strip and Sand-Glass Shelf can ship first for the youngest.*
4. First slice? *Default: the Mended Clock with Set D, then the Day Line and Timetable Board with Sets E and F.*
5. Pip as self-appointed "Assistant Bell Ringer" rather than a new bell-keeper character? *Default: yes; no new cast.*
