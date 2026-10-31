# 323 · Sky notes copy

Companion to [spec 323](../specs/323-sky-notes.md). First drafts for content and science review. Child lines are short and concrete, use US spelling and no em-dashes, and never explain why the moon changes shape. The safety line is the one the weather page already uses.

## Page

| Element | Text |
| --- | --- |
| Eyebrow | Dot's almanac · the sky |
| Title | Sky notes |
| Introduction | Dot keeps a note of the moon. Look outside first, with a grown-up if it's dark. Which shape looks most like the moon you saw? |
| Safety line (always shown) | Never look straight at the sun. |
| Date line | Today on this device: {weekday}, {month} {day} |
| Save | Save today's note |
| Saved | Saved. Dot drew today's moon in the strip. |
| Change prompt (today already saved) | You noted {shape label} today. Choose another shape and save to change it. |
| Same choice | That is already today's note. |
| No choice yet | Choose a shape first. |
| Date changed | The date on this device changed. Refresh to see today. Nothing was saved. |
| Refresh | Refresh |
| At capacity | Dot's sky book is full on this device. Today's note can still be changed. Grown-ups can download the notes from Grown-up notes. |
| Change not kept (preflight refusal, either root) | This change could not be kept safely. Your earlier work is unchanged. Download your notes or keep exploring. |
| Device date unavailable | This device date cannot be used here. Earlier notes are still kept. |
| Hear | Hear this page |
| Unavailable | Sky notes can't be saved for this explorer right now. The rest of the almanac is open. |
| Links | **Weather notes** · **Keeper’s Pages** |

## The eight choices

Pictures show the lit shape only, never a face. Labels are the same in both settings; only the pictures swap left and right.

| Code | Label | Picture, northern setting | Picture, southern setting |
| --- | --- | --- | --- |
| `thin-growing` | Thin and growing | thin curve lit on the right | thin curve lit on the left |
| `half-growing` | Half and growing | right half lit | left half lit |
| `fat-growing` | Nearly full and growing | all lit except a thin left edge | all lit except a thin right edge |
| `full` | Full | whole disk lit | whole disk lit |
| `fat-shrinking` | Nearly full and shrinking | all lit except a thin right edge | all lit except a thin left edge |
| `half-shrinking` | Half and shrinking | left half lit | right half lit |
| `thin-shrinking` | Thin and shrinking | thin curve lit on the left | thin curve lit on the right |
| `not-seen` | I couldn't see the moon | a dashed circle | a dashed circle |

Accessible name for each picture button: its label, for example "Thin and growing". The picture itself is decorative.

**Growing or shrinking?** (a short line under the choices, shown in both settings): "Not sure if it's growing or shrinking? Pick the shape. Look again in a few nights and see which way it went." The child may still pick either; there is no wrong pick.

## Which way is my sky?

| Element | Text |
| --- | --- |
| Group label | Moon pictures |
| Options | **North of the equator** · **South of the equator** |
| Help | The moon looks flipped from the other half of the world. Pick the one that matches where you are. Near the equator, pick either one; the moon can look tipped on its side. |
| Saved | Moon pictures changed. Your notes stay the same. |

## Month strip

| Element | Text |
| --- | --- |
| Heading | {Month} {year} |
| Empty day | no note |
| Day with note | {day}: {shape label} |
| Navigation | **Earlier month** · **Later month** · **This month** |
| No notes yet | No sky notes yet. The first one can be today, or any night you like. |

## Three things Dot noticed

Shown as three short panels below the strip, always open to read and never required.

1. **It's the same moon.** Thin, half or full, it's the same moon every night. Only the part we can see changes.
2. **At new moon, it's still there.** For a few days each month we can't see the moon at all. It hasn't gone anywhere. It's up in the daytime sky, close to the sun, where it's too hard to see. On other nights, clouds can hide it.
3. **The pattern comes back.** From one full moon to the next is about 29 and a half days. That's about a month.

## Grown-up notes

"Sky notes: one moon shape per date, chosen by the explorer after looking. These are the explorer's own observations. The game does not check them against the real moon and does not grade them. Moon pictures follow the northern or southern setting chosen here; the game stores no location." Followed by the count of readable notes, the date range, and raw unreadable entries listed as unavailable.

Child label to astronomy name, for grown-ups only: thin and growing = waxing crescent; half and growing = first quarter; nearly full and growing = waxing gibbous; full = full moon; nearly full and shrinking = waning gibbous; half and shrinking = last quarter; thin and shrinking = waning crescent. "A half moon is called a quarter moon because the moon is a quarter of the way around its orbit."
