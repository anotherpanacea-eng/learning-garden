# Number Garden interaction and wording

Status: implemented; independent spec and implementation reviews cleared. Each section can ship separately. Follows the established rules: tap and keyboard controls, no interaction that requires dragging or hover, animation under the learner's control.

## Visible help

Number Garden renders hints, pictures and worked solutions as 13 px grey underlined text. Render them as soft buttons at the same size as Skip, with small inline icons (lightbulb, picture, footsteps, two hands), at least 44 px tall, matching the more prominent help offered by story tasks.

## Question first on small screens

Below 700 px, an adventure's lesson card and model push the question below the first screen. On narrow layouts show the title, a one-line lesson summary with **Read Pip's idea** to expand it, Pip's example, then **Your turn**. After the child has changed the example or answered, it collapses to a thumbnail. After a wrong attempt, scroll the feedback into view and select the answer text so the next try replaces it.

## Tap the model itself

Keep every existing model button and add tap targets on the model, each calling the same `adjustModel` action so records are unchanged:

| Model | Tap action |
| --- | --- |
| Place value | Tap a token tray beside each column to add; tap a token to remove; tap **Trade** when ten are present |
| Array | Tap a dot to count it with a running number; tap the ghost row or column to extend |
| Fraction bar | Tap a piece to shade or unshade it |
| Pattern | Tap the ghost stone to add the next step |
| Ruler | Tap a mark to move the nearer ribbon end there |
| Shape | Tap the turn arrow beside the shape |

## Fold and compass

Symmetry items gain **Try a fold**: choose top to bottom, side to side, or one of the corner-to-corner lines; the line appears and one half reflects over it, tinted where it misses. No line is marked correct, and the existing `symmetry unmarked` check applies until a fold is chosen. Add a `compass` model (N, E, S, W with Pip at the center; **Turn clockwise**, **Turn counterclockwise**, **Reset**) for `geometry-stretch-activity` and generated turn items.

## Counting garden and a small celebration

The Number Garden hero is a 3 × 4 flower array captioned "What do you notice in the garden?" Let a tap count a flower and **Show rows** or **Show colors** outline groups, recording nothing. After a correct answer, Dot does a short loop and a sprout appears; with reduced motion only the sprout appears. No sound, points or streaks.

## Wording and the older multiplication path

The child-facing nav and cards use assessment words. Child views say **Garden walk** for check-in and "You visited this garden" for "Two observations recorded"; grown-up notes keep today's terms. Lesson cards are written for the reading adult: add a `childLesson` of one or two sentences shown by default, with **For the grown-up** expanding the current text. The original six-question multiplication check-in, practice sets and puzzles remain reachable and keep their records, but the Number Garden hub points to the multiplication garden as the main fact path and lists the original puzzles as Number Garden adventures.

## Verification

Each tap action produces the same model as its button; four clockwise compass turns return to the start; no fold reveals an answer before it is chosen; at 375 px the question begins on the first screen once the lesson is collapsed; child views contain no "observation," "check-in" or "assessment"; original multiplication records render unchanged in notes. Browser and keyboard pass at 375 px and 768 px.

## Build clarification

Direct fraction taps toggle an individual piece and compute shaded count from the selected pieces; existing shade-more/fewer controls remain. Fold reflection uses the actual polygon and its geometric center. Equilateral triangle and regular hexagon include their three and six symmetry axes respectively; rectangle diagonal folds visibly mismatch. No axis is labeled correct before the child tries it. Compass directions remain geometric, independent of illustration pose. On phones, collapse Pip's example initially into a labeled expandable thumbnail so the question is reachable immediately; opening/editing retains the model and records support.
