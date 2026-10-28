# Spec281 · finite child text

Original text for [the bounded weather/tally commission](../specs/281-weather-tallies.md), after independent specification/content review. Safely interpolate `{date}`, `{month}`, `{n}`, row labels and counts, using singular report/card/mark wording for one. Spoken dates use natural month/day/year words; kept source text stays unchanged. No names/locations/private data. Narration uses words for numbers and only visible content. Literal codes are implementation references, not child labels.

## Links and story invitation

Almanac link **Dot's weather notes** / “Look today. Keep a little note. Later, count the notes in a tally.”

Weather→tallies **Count some weather notes**.

Return links **Keeper's Pages** · **Back to the garden** · **Grown-up notes**.

Rain Paths/Field Kit optional link **Make a weather note** / “Our rain trays use pretend tokens. You can also keep your own report of what you notice outside.” No contribution/earned-scene wording.

Tally return **Visit the rain charts** / “Those charts use our pretend rain-tray results. These tallies count weather reports.”

## Weather page

Title **Dot's weather notes**.

“What's noticeable outside today? Look through a safe closed window with a grown-up if you like. Never look straight at the sun.”

Date **Today's device date: {date}**.

“One look can have more than one kind of weather. Choose the one that stands out most to you. This note keeps your choice from this look, not the weather for the whole day.”

Buttons, fixed order: **Sunny** (`sun`) · **Cloudy** (`clouds`) · **Rainy** (`rain`) · **Windy** (`wind`) · **Snowy** (`snow`). Pictures repeat the same meanings, never replace the labels.

No draft choice: “Choose a word if you want to make a note. Leaving today blank is fine.”

Selected: **Your choice: {weather}**.

Primary **Save today's note**. Existing today: **Today's kept note: {weather}** / **Change today's note**. While editing existing: **Save this change** · **Keep the earlier note**.

After Save: “Kept: you reported {weather} on {date}. You can change today's choice.”

Same-value Save/no-op: “Today's choice is already kept.”

Month title **Your notes for {month}**. A reported cell: **{date}: reported {weather}**. Empty cell: **{date}: no note**. Legend: “Blank means no note. It does not mean no weather.”

History: “Earlier dates stay as reported. A new choice today does not change a tally sheet you already made.”

Date changed/refusal: “The device date changed while this page was open. Your notes are unchanged. Refresh the date before saving.” Action **Refresh the date**. After Refresh: “The date is refreshed. Your unsaved choice was cleared. Choose again if you want to make a note.”

Unsupported device date: “This device date cannot be used here. Earlier notes are still kept.”

1,098 readable-note cap: “There is no room to add another day here. Earlier notes stay kept. Today's existing choice can still be changed. Ask a grown-up to download your notes.”

Unsupported weather root: **Earlier weather notes are kept** / “This format cannot be edited here. Its original stays in your notes. Dot's practice tally is still open.”

Unreadable sibling notice: “Some earlier entries cannot be shown here. Their originals stay in your notes download.” No code/category invented for them.

## Tally source picker

Title **Weather tallies**.

“Each note is one report. We can give each report one tally mark, then count the marks in each row.”

Source heading **Which notes shall we count?**

Buttons/list labels **Your notes for {month} · {n} reports** and **Dot's practice month · thirty reports**. No minimum-five note gate.

No own reports: “There are no readable weather reports for this month yet. You can make a note today or choose Dot's made-up month.”

Practice preview: **Made up by Dot for practice** / “Thirty day cards. These are not anyone's real weather notes.”

Own preview: **Your reported choices** / “These are the readable notes chosen for {month}. A blank day is not a report. When you start, this sheet keeps its own copy.”

Actions **Start a tally sheet** · **Back to my weather notes**.

Existing list **Earlier tally sheets**. Item **{source title} · {id} · {n} of {total} cards counted**; kept adds **Kept sheet**. Unsupported/ambiguous item **Earlier sheet retained** / “Its original stays in your notes.” Do not automatically open another source or overwrite the unavailable one.

## Tally turn

Always visible source title; origin **Reported choices** or **Made up for practice**. Date/month if actual, **Day {n}** if practice. Caption **One card gets one mark**.

Turn heading **Where shall this mark go?**

Card for real report **{date}: reported {weather}**. Card for practice **Day {day}: {weather}**.

“Tap a row to give this card one mark. Your marks stay where you put them. Back takes away the last mark.”

For the five current categories, native row buttons are labelled **Add one mark to {weather}**; show each row's grouped tally marks and numeric count. Weather labels freeze with source. Historical supported sheets show exactly their own one through five category rows and frozen labels. Counter **{n} of {total} cards counted**.

Actions **Back one card** · **Compare the rows** · **Keep this sheet** · **Choose other notes** · **How tally marks work** · **We're working together** · **Hear this turn**.

After placement status **One mark added to {weather}. Next card: {next}.** Final placement **Every card has a mark. You can compare the totals or keep your sheet.** Back status **Last mark removed. This card is waiting again.**

Tally teaching drawer title **A gate of five**. Step1 **Four upright marks** / “One mark for each thing counted.” Show four upright strokes and count4. Step2 **The fifth crosses the four** / “That little gate has five marks. Another gate adds another five.” Show grouped five and count5. Controls **Next** · **Back** · **Return to my tally**. No audio starts on step change.

No correctness requirement before leaving, backing up or keeping.

## Aggregate comparison

Heading **Your totals and these notes**.

Always: “This compares the total in each row. Matching totals do not show that every card went into the same row as its weather word.”

Incomplete: “You have placed {n} of {total} cards. {remaining} cards are still waiting.”

Differing row: **{weather}: your row has {x} marks; these notes have {y} reports.**

If complete and all counts match: “Each row total matches these notes. Your sheet is ready to keep or explore again.”

If differing: “Some row totals are different. You can go back through the cards, keep your sheet as it is, or start another.”

Do not say “all correct”, infer weather truth, show a grade, or record a most/least answer.

Parent talk: “Which rows have the most marks in your tally? Could more than one row share that amount? What do your marks show?” This is an unrecorded conversation about current constructed rows, including ties.

## Keeping and revisions

Keep success **Sheet kept** / “These notes and marks stay together. An unfinished sheet is welcome too.”

Kept action **Revise as a new sheet** / “Make a new sheet with these same notes and marks. The earlier sheet and its comparisons stay as they were.”

New revision success “A new sheet is open. Your earlier one is still kept.”

Kept sheets have no edit/Back/row-placement/Compare/teaching/narration/together controls. Message: “This sheet is kept. Revise as a new sheet to try another comparison or use help.” Their source, marks, counts and recorded comparisons remain visible.

Check capacity: “This sheet has kept all the comparisons it can hold. You can still change the marks and keep the sheet.”

Sheet capacity: “There is no room for a new tally sheet here. Your earlier sheets stay kept. Ask a grown-up to download your notes.” No deletion control is commissioned by this text.

Unsafe fit/write refusal: “This change could not be kept safely. Your earlier work is unchanged. Download your notes or keep exploring.” Actual later browser-storage failure uses the game's existing warning; don't claim the earlier data stayed unchanged after a committed in-memory action.

Unreadable draft: “This earlier sheet cannot be edited here. Its original stays in your notes. Other readable sheets and Dot's practice notes are still open.” If root/cap prevents new sheet, show the actual relevant refusal instead of promising new work.

Unsupported dataDesk root: “This earlier tally notebook cannot be opened here. It stays in your notes. Your weather notes and other places are still open.”

## Grown-up explanations and Notes

**About this weather record** / “A note records a chosen report at one look-time, labelled with this device's calendar date. Conditions can overlap. The game does not verify the weather or collect location. Category totals count the chosen reports; they do not measure rainfall, duration, all weather conditions or climate.”

**About these tallies** / “The source list freezes when a sheet starts. Later note edits or wording changes do not alter it. Placing marks and comparing totals are practice activities. An aggregate match is not proof of per-card sorting, independent counting or weather-observation skill. Earlier comparisons remain as recorded.”

Notes heading **Weather notes and tally sheets**. Separate lines **Reported weather choices** · **Made-up practice source** · **Current marks** · **Kept marks** · **Earlier aggregate comparisons** · **Worked tally example opened** · **Narration requested** · **Working together reported** · **Earlier feedback seen** · **Earlier unreadable values retained**.

All raw unavailable values remain in escaped grown-up details and exported JSON. No learner report or private content goes to an external service.
