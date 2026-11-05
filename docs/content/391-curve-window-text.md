#391 · finite cases and teaching commission

All text/models below are original. Source factory freezes complete cases and teaching. Every job uses axes x−4..4, y−6..26, ticks1/2, plotXs−4…4. The selected reference table shows reduced (x−h), its exact square and y.

| id | title | h,k | question |
| --- | --- | --- | --- |
| same | Same height | 0,0 | Can two different inputs give the same output? Mark points on both sides. |
| two | Two zeroes | 0,−4 | Which inputs put the output at zero? Mark the places you think fit. |
| touch | A touch at one | 1,0 | Can a curve reach zero without going through to the other side? |
| above | Above the axis | 0,2 | None of these outputs is zero. Is the table enough to explain why? Look at the rule too. |
| shift | A shifted fold | 1,−4 | Where would you fold this picture? Is the y-axis always the fold line? |
| between | Between the marks | −1,−2 | The zeroes are between integer marks. Can you mark intervals without pretending they are exact points? |

Story: The traveling library needs a window into square rules. Make a picture another visitor can explore. These curves describe number rules, not the strength or shape of a real building.
Return: Show someone your picture. Which marks are your ideas, and which came from the rule?

## Manual teaching pages

Each has independent example with axes x−3..3,y−6..18,ticks1/2, plotXs−3…3 except page2 which needs x−3..4,y−6..20 to include its shifted window. All exact function values fit these bounds. Model zeros explanations use the spec's exact endpoint comparisons, not rounded square roots.

1. **Square, not double.** “Squaring means multiplying a number by itself. A negative number times itself gives a positive result. Two different inputs can give the same square. A few plotted points are a start; here we know the rule for every input.” Example h0,k0,probe4−8,zeroes false.
2. **A fold can move.** “Our input is first changed by subtracting the number inside the square. Equal distances on opposite sides of the fold give the same output. The lowest point is called the vertex. A fold line need not be the y-axis.” Example h1,k−4,probe4 0,zeroes false.
3. **One touch.** “At the vertex, this curve reaches zero and turns upward. It touches the x-axis without changing from negative to positive. We count one different input that gives zero.” Example h1,k0,probe4 4,zeroes true; use page2 axes/window here too (x−3..4,y−6..20) because at x−3 the square is16.
4. **Two zeroes.** “A square can equal this positive amount in two ways: the changed input can be positive or negative. Both marked points give output zero. Zeroes are inputs; the output is zero at each.” Example h0,k−4,probe4 8,zeroes true.
5. **No real zeroes.** “A real square is zero or positive. Adding a positive amount keeps this output above zero for every real input. The known rule explains more than a few positive table entries could.” Example h0,k2,probe4 0,zeroes true.
6. **An interval is honest.** “A graph reading can give a useful interval. Here the endpoint calculations put zero between quarter marks. The zero is inside each interval; it is not exactly at its middle just because we drew a band.” Example h0,k−2,probe4 5,zeroes true. Positive bracket1¼..1½ has outputs−7/16 and1/4; negative bracket−1½..−1¼ has outputs1/4 and−7/16. Display calculated signs/fractions, not hidden prose arithmetic.

## Meaning and UI wording

Title: Curve Window. Entry: Make points, folds and zero intervals for a square rule.
Plot instruction: Choose an input and your proposed output, then add the point. You can keep unexpected points.
Compare instruction: Your marks stay here. The solid curve and table come from the written rule.
Zeroes instruction: Mark your idea first, or explore the rule's picture. Either way, keep your own bands.
Explain button: See the model's zeroes.
Model note: A known number rule, not measured data. A few dots alone do not prove a smooth continuation.
Learner labels: Your proposed points (hollow diamonds); your fold (long dashed); your zero bands (outlined).
Reference labels: Rule's curve (solid); rule's fold (short dashed); selected-input table.
Copy labels: Work on a copy; Resume earlier working copy; Another copy.
No-model message: This earlier example picture cannot be drawn. Its words and your picture are still here.
Refusal: This model view could not be opened safely. Your picture and earlier work are unchanged. Download Notes or try again.
Keep refusal: This picture could not be kept safely. Your marks and earlier versions are unchanged.
Keep status uses actual saved/off/uncertain result and directs to Notes.
Grown-up interpretation: Supplied-reference views and constructed marks are not independent calculation, oral explanation, attention or mastery. Prior arithmetic exposure can qualify matching current and later math through the existing helper; no new answer or attempt is recorded.
