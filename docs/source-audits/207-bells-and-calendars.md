# Source audit 207: Bells and Calendars

Date: 2026-10-25. Spec: [207](../specs/207-bells-and-calendars.md). Companion: [207 text](../content/207-bells-and-calendars-text.md).

**Method.** Eight web searches (WebSearch; page fetches were blocked in this session, so every claim rests on search-result excerpts and should be re-read at the source in the second pass). The mathematics of time (60 seconds and 60 minutes, 7 days, 12 months, month lengths, the Gregorian leap rule, past and to, a.m. and p.m., 24-hour notation, counting on across the hour) is standard and was cross-checked with Python's `calendar` and `datetime` modules in `check207.py`. All timetables, durations, story times and character jobs are **made-up labeled data**, verified by `check207.py` (81 checks, all passing; scratch area, not in the repo). Teaching moves follow the pinned Marble research records for twelve of the thirteen targets (paraphrased, not copied); `mt_3XJkeIn6J6` has no research record at `7bd8b67`, so its pinned description and evidence are followed.

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Su Song" | Wikipedia | https://en.wikipedia.org/wiki/Su_Song | Song-dynasty scholar-official; water-powered astronomical clock tower in Kaifeng; 133 clock jacks to indicate and sound the hours; escapement earlier invented by Yi Xing and Liang Lingzan (725); first known endless power-transmitting chain drive; treatise *Xin Yixiang Fayao* written 1092, printed 1094; dismantled by the Jurchen army in 1127 and not successfully reinstated. |
| 2 | "Astronomical clock" | Wikipedia | https://en.wikipedia.org/wiki/Astronomical_clock | Su Song's clock tower among early astronomical clocks (corroborates 1). |
| 3 | "The water clock of 1088" | INCOIS (Indian National Centre for Ocean Information Services) teaching page | https://incois.gov.in/Tutor/science+society/lectures/illustrations/lecture15/clock.html | 1088 as the year Su Song designed and built a three-level clock tower; ran 39 years in Bianjing (Kaifeng) until the Jin took the city. |
| 4 | "Scale model of Su Song's Water-Balance Escapement" | Science Museum Group collection | https://collection.sciencemuseumgroup.org.uk/objects/co894 | Museum model of the escapement (corroborates mechanism). |
| 5 | "Water-powered astronomical clock tower" | National Museum of Natural Science, Taichung | https://www.nmns.edu.tw/en/exhibitions/galleries/human-cultures-hall/water-powered/ | Full-size working reproduction built from Su Song's book. |
| 6 | "Past Masters: The Astronomical Water Clock of Su Song" | Revolution (watch magazine) | https://www.revolution.watch/past-masters-the-astronomical-water-clock-of-su-song/ | Figures on five tiers struck bells, drums and gongs; a large water wheel with scoops; hour and quarter displays (secondary source; detail beyond "bells and drums" not used in child text). |
| 7 | "What is the Gregorian Calendar Reform?" | Royal Observatory of Belgium | https://robinfo.oma.be/en/faq/what-is-the-gregorian-calendar-reform/ | Julian drift of about 10 days by the 16th century; Thursday 4 October 1582 followed by Friday 15 October 1582. |
| 8 | "Gregorian Calendar" | Tudor History glossary | https://tudorhistory.org/glossaries/g/gregorian_calendar.html | Century years not divisible by 400 (1700, 1800, 1900) are not leap years; Britain adopted in 1752. |
| 9 | "Gregorian Calendar" | OrthodoxWiki | https://orthodoxwiki.org/Gregorian_Calendar | Reform under Pope Gregory XIII; 1900 not leap, 2000 leap, 2100 not; later adoptions (Russia 1918). |
| 10 | Oxford University Press blog on the Gregorian calendar | OUP | https://blog.oup.com/2011/10/gregorian-calendar/ | Examples 1600 and 2000 leap, 1700-1900 not (its stated rule "divisible by four" for centuries is an error; examples follow the 400 rule). Not relied on for the rule. |
| 11 | tz database mailing list, Europe/Rome 1893 | IANA tz list (Michael Deckers, Luigi Rosa) | https://mm.icann.org/pipermail/tz/2019-May/052941.html | Quotes Law 490 of 10 August 1893: art. 1 railway service in the whole Kingdom regulated by mean solar time of the meridian 15° east of Greenwich; art. 2 hours numbered starting from midnight; in force 00:00, 1 November 1893; first common time reference for continental Italy, Sicily and Sardinia. |
| 12 | "Time in Italy" | Wikipedia | https://en.wikipedia.org/wiki/Time_in_Italy | Corroborates the 1893 adoption of Central European Time. |
| 13 | "24-hour clock" | Britannica | https://britannica.com/topic/24-hour-clock | Italy named first of several countries to adopt officially, 1893 (excerpt in one search; not shown in a second); Denmark 1916, Greece 1917; Canadian Pacific Railway use from 1886; Sandford Fleming as advocate; striking clocks made the Italian 24-hour dial impractical. |
| 14 | "Adoption of the 24-Hour Standard Time System on Canadian Railroads" | Pocket Watch Database blog | https://blog.pocketwatchdatabase.com/?p=775 | Canadian Pacific dial requirements of June 1886 with figures 13-24. |
| 15 | "Date and time notation in France" | Wikipedia | https://en.wikipedia.org/wiki/Date_and_time_notation_in_France | 24-hour times written with "h", standard with spaces: 14 h 05; compact 14h05 common. |
| 16 | CLDR users list, French time patterns | Unicode CLDR | https://corp.unicode.org/pipermail/cldr-users/2015-May/000304.html | Imprimerie nationale style: schedules written "10 h 20", "23 h 15". |
| 17 | Marble teaching-research records for twelve targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |
| 18 | Python 3 `calendar` and `datetime` | Python Software Foundation | https://docs.python.org/3/library/calendar.html | Month lengths, `isleap`, day counts, proleptic Gregorian weekday of 15 October 1582 (Friday). |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Su Song, Song-dynasty official, had a water-driven astronomical clock tower built in Kaifeng | 1, 2, 3, 5 | Checked |
| Built about 1088 (commonly cited; some sources say only "11th century"; the treatise 1092/1094) | 1, 3 | Checked; child text says "more than 900 years ago" and gives 1092 and 1094 for the book only |
| A water wheel drove it; figures sounded the hours with bells and drums | 1 (jacks to sound the hours), 6 (bells, drums, gongs) | Checked at the level used ("rang bells and beat drums"); the per-hour color and tier details from 6 are not used |
| Dismantled 1127 by Jurchen invaders; not successfully rebuilt; modern working replicas from his drawings | 1, 3, 5 | Checked |
| Julian drift about 10 days; 4 October followed by 15 October 1582 (Thursday, Friday) | 7, 9; script (15 Oct 1582 a Friday) | Checked |
| Century years leap only if divisible by 400 | 8, 9 (10 contradicts in prose, agrees in examples) | Checked |
| Britain changed in 1752 | 8, 9 | Checked |
| Reform named for Pope Gregory XIII | 7, 9 | Checked |
| The dates were skipped "in Rome" (the countries adopting at once) | 7, 9 | Checked in substance; second pass to confirm the list of first adopters (Italian states, Spain, Portugal, Poland-Lithuania) before it appears anywhere |
| 1893 law set one time (15° E mean time) for all Italian railways, in force 1 November 1893 | 11, 12 | Checked (decree quoted in 11) |
| The same law numbered the hours from midnight | 11 | Checked (single strong source quoting the decree); child text says "counted the hours from midnight, the way the 24-hour clock does" |
| Italy was the first country to adopt the 24-hour clock officially | 13 (one excerpt), weaker pages | `[check]`: not in child text; Canadian Pacific use from 1886 complicates "first" |
| Parts of Italy kept slightly different times before 1893 | 11 (continental 23:49, Sicily 23:53, Sardinia 23:36 at the switch) | Checked |
| French writes 24-hour times with "h" (13 h 05) | 15, 16 | Checked |
| Most striking clocks strike the 12-hour count | 13 (striking clocks made 24-hour dials impractical) | Checked in substance; the tower's rule is labeled a model rule |
| Month lengths, 365/366, 52 weeks and 1 day, 97 leap years per 400, 365.2425 | 18; script | Checked |

## Open checks

1. Whether Italy was the first country to adopt the 24-hour clock officially (`[check]`, not in child text).
2. Su Song's construction date: 1088 is the commonly cited year; spec says "about 1088-1092"; child text avoids a build year.
3. The list of countries that dropped the ten days in October 1582 (spec text says "Rome and the countries that adopted it at once"; second pass).
4. Léon's French lines, *Bonjour des Saules !* and *Le bac part à 13 h 05.*, for a fluent French reader (spec 120 rule). "Bac" is the usual word for a river ferry; the reader should confirm it suits a boat that runs down the brook.
5. Re-read sources 1, 7, 11 and 13 at the page itself (fetches were blocked).

## Rights notes for images

No images are embedded. For build art, prefer original drawings of the tower clock face, the sand-glasses and the chalk board. If a real image is wanted: the woodblock illustration of Su Song's clock tower from *Xin Yixiang Fayao* is centuries old and widely reproduced as public domain, though each scan's own license on Wikimedia Commons must be checked; photographs of the Taichung replica need the museum's or photographer's license. A portrait of Pope Gregory XIII from the period is public domain as an artwork; check the photograph's terms. No photograph of a real child or real family appears.

## Upstream and overlap notes

- **Jane** `0ec55f7e`: `LESSONS.md` read for teach → guided → practice, the "I'm stuck" ladder, three-option choices, writing limits and the glossary. Medals, bosses, mastery, gates, timers, step-downs and points not adopted.
- **Marble** `7bd8b67`: records read for `mt_-vvVxpOHG2`, `mt_TcG90kS8nu`, `mt_bj1YCgNWUx`, `mt_6XCURuNwPw`, `mt_HNOPGJYiRK`, `mt__N55B7u7HD`, `mt_4m8BimI4G5`, `mt_UNzojLkNdm`, `mt_2yas4Unc8o`, `mt_4emC463IyW`, `mt_WfrE_4r-kY`, `mt_IL86kadLSS`. Pinned names of four targets do not match their descriptions (`mt__N55B7u7HD` measuring time; `mt_2yas4Unc8o` converting units; `mt_IL86kadLSS` elapsed time; `mt_3XJkeIn6J6` reading and estimating time); the descriptions decide the content.
- **Overlap:** spec 68 (hours, half hours, 60 minutes in an hour) and spec 93 (elapsed minutes up to 60 in fives) are built on and recapped, never re-taught; spec 48 (bell calls) and spec 33 (tower repair) supply the place; draft spec 134 (PR #137) owns *Time Units and Calendar Facts* and the sliding calendar; draft spec 118 Case 4 (PR #126) owns the bell-rule reasoning beyond its clock step; spec 189 drops `mt_IL86kadLSS`, and the coordinator reassigned it and `mt_3XJkeIn6J6` to this pack on 2026-10-25.
- **Route:** no `#tower` route in any spec on main or in draft PRs 126, 128 and 137-151 (grep, 2026-10-25).
