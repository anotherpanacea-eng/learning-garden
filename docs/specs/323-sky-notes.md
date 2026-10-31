# 323 · Dot's sky notes

Status: proposed, 2026-10-31. A bounded slice of [spec 116](116-field-guide-almanac.md) §2 (Sky) built on [spec 281](281-weather-tallies.md)'s real-date writer rules. Copy: [323-sky-notes-text.md](../content/323-sky-notes-text.md). Backlog card LG-24, lane D. Commissions one build after independent spec review and the science check in §8.

## 1. Teaching and boundary

At `#almanac/sky`, the explorer looks at the real moon and notes the shape that looks most like it, once per device date, or notes that they couldn't see it. A month strip shows the notes so far, and three short panels share what Dot has noticed: it's the same moon, at new moon it's still there, and the pattern comes back in about 29 and a half days.

New behavior: keeping an observation of the sky across real dates and seeing a pattern build up. 281's weather page notes a condition; this page notes a shape that changes in order.

**In:** the Sky page, its writer, the hemisphere picture setting, the month strip, the three panels, Grown-up notes and links.

**Out (still 116 proposals):** Sapling's **Why it changes shape**, the moon table, the prediction, any fictional practice month of moon shapes, a tally or graph of sky notes, story contributions and Lantern Night lines. Nothing here explains the cause of phases or shows a shadow (116 §2).

**Real and fictional stay apart.** There is no fictional sky data in this slice. The Sky page reads only the `sky` root. No weather, tally, story, evidence or suggestion code reads `sky`, and the Sky page reads nothing from `weather` or `dataDesk`. Dot's practice weather month stays weather-only.

## 2. Codes

Eight choices, exactly 116's: `thin-growing`, `half-growing`, `fat-growing`, `full`, `fat-shrinking`, `half-shrinking`, `thin-shrinking`, `not-seen`. Labels and pictures are in the copy sheet. `new` is not a choice. A note of `not-seen` is a full note, and a different thing from having no note.

## 3. Saved work

```
sky:        [ { date: 'YYYY-MM-DD', shape: code, ...preserved } ]   // absent until first Save
hemisphere: 'north' | 'south'                                      // absent until first explicit choice; missing means north
```

A readable entry is a non-null, non-array object with its own valid civil `date` and one of ?2's stable `shape` codes. Extra fields do not affect readability. Check stored dates and codes only, never today's wording, moon, answer key or content-list length. Each unreadable entry remains raw and does not block readable siblings or other destinations. Status messages are transient codes mapped to copy, not saved prose.

The writer follows 281's weather writer rule for rule, with `shape` in place of `weather`:

- **Dates.** Device local civil date at render, rechecked just before Save. If the date changed, refuse with the date-changed message and write nothing. **Refresh** clears the unsaved choice and shows today. No timer ever writes. Valid Gregorian `YYYY-MM-DD`, years 0001 to 9999, checked arithmetically with leap years. Use local calendar components, never UTC ISO truncation. An invalid or out-of-domain device date makes note writes unavailable; existing notes, panels and links remain open.
- **One readable note per date.** For each date, the last readable entry in array order. Duplicates, unknown codes, malformed entries and extra fields stay raw and exportable. Load, view and import never deduplicate or rewrite.
- **Save.** Only **Save today's note** writes. Saving today replaces only `.shape` on today's last readable entry, keeping every other field. With no readable entry for today, it appends `{date, shape}`. The same code as saved is a no-op with no preflight. A non-array `sky` root makes sky writes unavailable; the page still shows the panels and links.
- **Capacity.** Count readable raw entries before selecting one per date, including readable duplicates. At 1,098 readable entries, a new date's append is refused and today's existing note can still change. Imported arrays over the cap stay intact. No eviction of any kind. 116's "latest 1,098" rolling retention is not commissioned.
- **Earlier dates are read-only.** There is no backfilling a missed night.
- **Atomic writes.** As in 281's "Atomic writes": clone the whole notebook, change only the owning root (`sky` for a note, `hemisphere` for the setting), validate the changed owned fields, check `recoveryFitsProgressLimits` and the real `notesReport`→`prepareProgressImport` probe, and commit only the captured proposal. Refusal and no-op change nothing. Use one sky-note writer for every sky-note control; do not call `saveWeatherNote` or create another sky array. Preflight refusal uses the copy sheet's change-not-kept message. The existing `save()` / `updateStorageNotice()` storage-failure and saving-off path applies after commit, for both roots; the page must retain that notice and must not claim disk persistence.

**Hemisphere.** A two-option setting on the page (copy sheet, "Which way is my sky?"). It writes `hemisphere` only on an explicit choice; choosing the current effective value is a no-op, including north when the stored value is absent or unsupported. An explicit different choice replaces only this root, through the atomic path above; refusal leaves its raw value and displayed pictures unchanged. It changes only which way the pictures face. Notes, codes and labels stay the same. It is a setting, never a location. Missing, unknown or malformed values show the northern pictures and are kept verbatim.

Register `sky:'Sky notes'` and `hemisphere:'Moon picture setting'` in Grown-up notes and the progress-transfer destinations without adding an initializer. Notes export, import, reset, saving off and explorer switching apply normally.

## 4. Page

- Order: eyebrow, title, introduction, safety line, date line, the eight choice buttons in cycle order (the seven shapes, then **I couldn't see the moon**), the growing-or-shrinking line, **Save today's note**, status line, month strip, the three panels, the hemisphere setting, links.
- Choice buttons are native buttons with `aria-pressed`, at least 44 px, with the label as the accessible name and the picture decorative. Selection is a local draft; only Save writes.
- **Month strip.** The current month's days in order. A day with a readable note shows its small picture and an accessible label "{day}: {shape label}"; other days show "no note". **Earlier month** and **Later month** move through months that have readable notes, plus the current one. No future month: exclude months later than the rendered device month from navigation, retaining any future-dated imported notes raw and exportable. **This month** returns to the rendered device month. Disable navigation at either end. If the device date is unavailable, show readable saved months read-only without a current-month claim. The strip is read-only and never nags about gaps.
- **Three panels.** Always shown, plain text with one small picture each, not a gate, no question attached.
- **Pictures.** Eight simple SVG shapes, equal size, lit part in pale yellow on a dark blue disk, with an outline so the dark part reads in both themes. No face, no shadow, no Earth, no sun. The southern set mirrors the northern set left to right. Near the equator real crescents can look tipped; the help line says so, and the pictures stay simple.
- **Read-aloud.** **Hear this page** reads the introduction, the safety line, the date line, the current selection or saved note, and the status line. It also reads the growing-or-shrinking line, all three panels and the hemisphere help. Build speech from currently visible text on request, including the current status after Save, refusal or Refresh; never speak a stale status captured before the action. No automatic speech or saved support/learning record is created by Hear. Use the existing device-local speech controls.
- 320 and 820 px with no page overflow. Focus moves to the status line after Save or refusal.

## 5. Routes and links

- Exact route `#almanac/sky`, matched before the Keeper Almanac fallback, as 281 does for `#almanac/weather`. It keeps the same explorer-switching, deferred-initialization and welcome-film exemptions, and uses `routeHeader()` once spec 279 step 1 has landed.
- Links: the almanac page to Sky notes, Weather notes ↔ Sky notes, and **Keeper's Pages** (`#almanac`), the existing destination name. Sky notes is the new link label on the existing Almanac page. No story contribution.

## 6. Upstream overlap

Spec 116 §11 records Marble's Moon Phases (`mt_ByXgbTld6R`) and Phases of the Moon (`mt_4V-vYhFUcm`). Younger work is observational, with growing and shrinking names, no shadows, the new moon still there, and slow change. This slice does exactly the younger part. Prerequisite crosswalk (116 §11): Sun, Moon & Stars (`mt_PiWZA8Z0ZJ`) is partly covered by the same-moon and new-moon panels. Sun and stars are not taught, and the slice claims no complete topic. Jane's short idea-before-practice pattern is followed by putting the panels beside the page, not before it, because there is no check to prepare for. Upstream refreshed at spec review on 2026-10-31: Marble [os-taxonomy at `5e23196fa60050433f1440057f65a978d39e63fc`](https://github.com/withmarbleapp/os-taxonomy/tree/5e23196fa60050433f1440057f65a978d39e63fc) (2026-10-30) still has all three ids with the same names: `mt_ByXgbTld6R` Moon Phases and `mt_PiWZA8Z0ZJ` Sun, Moon & Stars (Space Exploration), and `mt_4V-vYhFUcm` Phases of the Moon (Space Systems & Earth's History). Its `dependencies.json` gives Moon Phases one hard prerequisite, Sun, Moon & Stars ("know the Moon is a sky object before observing its phases"), which matches the crosswalk above. Phases of the Moon's hard prerequisites (The solar system; Earth & Space Vocabulary, including waxing and waning) belong to the explanatory topic this slice does not claim; the astronomy names appear only in Grown-up notes. The Moon's Orbit lists Moon Phases as its hard prerequisite, so this slice is the observational ground for that later topic. Jane [`LESSONS.md` at `e88f81a00553fb87818ef84c77a8800f0dcb33e4`](https://github.com/kentlangley/Jane/blob/e88f81a00553fb87818ef84c77a8800f0dcb33e4/LESSONS.md) (2026-10-28) still requires teach, then guided practice, then graded work and a boss; this slice studies only its idea-before-practice ordering, adopts no code, content, grading or boss, and has no check to prepare for.

## 7. Acceptance

Source checks (new `test/sky-notes-checks.mjs`):

1. Date validation, including leap days and the year bounds. Date flip in either direction refuses with no mutation.
2. Last-readable-per-date selection with duplicates, unknown codes, malformed entries and extra fields, all preserved on save, export and import.
3. Today's revision changes only `.shape` on the selected entry. Same code is a no-op with no preflight. Append for a new date.
4. 1,098 readable entries: new date refused, today's revision allowed, over-cap import intact.
5. A non-array `sky` blocks only sky writes. An unknown `hemisphere` is kept and shows northern pictures. Choosing the current hemisphere is a no-op.
6. Atomic write with a hostile report callback that mutates `sky` and another root: only the captured proposal commits.
7. No unrelated learning, weather, tally, evidence or suggestion module reads `sky` or `hemisphere`. Sky UI/core and the required `app.mjs` routing, Grown-up notes/report and progress-transfer integration may read them; generic whole-notebook preservation/export is allowed. The Sky modules import nothing from `weather-tally-*` or the evidence and suggestion modules.
8. The southern picture for each code is the exact mirror of the northern one. `full` and `not-seen` are identical in both.
9. Add the new sky UI/content files to `scripts/check-child-copy.mjs:copyScopes`, with explicitly bounded adult-only exclusions, so the check actually scans them. All child copy follows `docs/child-copy-glossary.md`, has no exclamation marks or em-dashes, and passes `check-child-copy`, the US spelling check and the read-aloud symbol check. `scripts/run-checks.mjs` discovers the new source suite automatically.

Browser suite (`test/sky-notes-browser.py`, 320 and 820 px, backlog-128 server): first visit with no `sky` root, then select, Save, change today, reload; date-flip refusal by clock override; earlier month navigation with seeded notes; hemisphere switch flips pictures and leaves notes byte-identical; keyboard and touch; Hear reads visible text; export, reset and import across two explorers with raw duplicates and at least 500 KiB of unrelated work preserved; the weather and tally pages unchanged.

## 8. Science-content check

For the reviewer, with what this slice claims and where to check it:

- **Order and names.** The cycle runs thin growing, half, nearly full, full, nearly full shrinking, half, thin shrinking, then new. The astronomy names (waxing crescent, first quarter, waxing gibbous, full, waning gibbous, last quarter, waning crescent) appear in Grown-up notes only. Checked 2026-10-31 against NASA's moon phases page (https://science.nasa.gov/moon/moon-phases/), which lists the same eight phases in this order and calls the last quarter "third quarter" too.
- **Which side is lit.** From the Northern Hemisphere a growing moon is lit on the right and a shrinking moon on the left; from the Southern Hemisphere it is the reverse. Near the equator the lit side can sit low, like a bowl. The moon phases page does not cover this. Checked 2026-10-31 instead against NASA's top Moon questions (https://science.nasa.gov/moon/top-moon-questions/): everyone sees the same phase, but from the other hemisphere it looks upside down. Also against NASA StarChild (https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question43.html): whether a crescent looks lit on the bottom or on the side depends on latitude.
- **Cycle length.** About 29.5 days from full moon to full moon (mean synodic month 29.530588853 days, as 116 uses). Checked 2026-10-31: NASA's page gives "every 29.5 days" new moon to new moon. The US Naval Observatory primary-phase data (https://aa.usno.navy.mil/data/MoonPhases) for 2020 to 2021 gives a mean of 29.54 days new moon to new moon and 29.52 full moon to full moon, with single months from 29.3 to 29.8 days, so "about 29 and a half days" is right and no exact count should be shown.
- **New moon.** The moon is still in the sky near the sun, mostly in daytime, and can't be seen. The panel says that and nothing about why its lit side faces away. Checked against NASA's page: a new moon rises and sets with the sun and is up all day but not visible. The panel wording ("It's up in the daytime sky, close to the sun, where it's too hard to see") matches.
- **Daytime moon.** The moon is often up in daylight; the "I couldn't see the moon" choice and the panels never say the moon only comes out at night.
- **Safety.** "Never look straight at the sun." is always shown, because a child looking for a daytime moon may look near the sun.
- **What is not claimed.** No cause of phases, no shadow, no eclipse, no tides, no prediction, and no check of the child's note against the real moon.

These URLs are given for the reviewer to open. This draft quotes no source prose and incorporates no source art.

## 9. Boundaries

Offline, local, per explorer. No location, camera, time zone, name or free text. A sky note is the explorer's own observation; the game never checks, grades or corrects it, and never counts it as evidence of learning. Every destination stays open, and a missed night is never mentioned.
