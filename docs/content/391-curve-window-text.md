#391 · finite cases and teaching commission

All text/models below are original. Source factory freezes complete cases and teaching. Every job uses axes x−4..4, y−6..26, ticks1/2, plotXs−4…4. The selected reference table shows reduced (x−h), its exact square and y.

| id | title | h,k | question |
| --- | --- | --- | --- |
| same | First window | 0,0 | Could different inputs give the same output? Mark your ideas on both sides. |
| two | Near the line | 0,−4 | How many different inputs might give zero? Mark your ideas, then explore the rule. |
| touch | A second window | 1,0 | What might this picture look like near zero? Show your ideas before comparing. |
| above | Another height | 0,2 | Which inputs, if any, could give zero? What could the rule tell us beyond a table? |
| shift | Move the fold? | 1,−4 | Where would you fold this picture? Is the y-axis always the fold line? |
| between | A further window | −1,−2 | Which inputs, if any, give zero? Could intervals help you describe what you find? |

Story: The traveling library needs a window into square rules. Make a picture another visitor can explore. These curves describe number rules, not the strength or shape of a real building.
Return: Show someone your picture. Which marks are your ideas, and which came from the rule?

## Manual teaching pages

Each has independent example with axes x−3..3,y−6..18,ticks1/2, plotXs−3…3 except pages2/3 which deliberately use x−3..4,y−6..20 and plotXs−3…4 as a wider shifted window. All exact function values fit these bounds. Model zeros explanations use the spec's exact endpoint comparisons, not rounded square roots.

1. **Square, not double.** “Squaring means multiplying a number by itself. A negative number times itself gives a positive result. Two different inputs can give the same square. A few plotted points are a start; here we know the rule for every input.” Example h0,k0,probe4−8,zeroes false.
2. **A fold can move.** “Our input is first changed by subtracting the fixed number written inside the brackets. Equal distances on opposite sides of the fold give the same output. The lowest point is called the vertex. A fold line need not be the y-axis.” Example h1,k−4,probe4 0,zeroes false.
3. **One touch.** “At the vertex, this curve reaches zero and turns upward. It touches the x-axis without changing from negative to positive. We count one different input that gives zero.” Example h1,k0,probe4 4,zeroes true; use the same deliberately wider page2 axes/window (x−3..4,y−6..20).
4. **Two zeroes.** “A square can equal 4 in two ways: the changed input can be positive or negative. Both marked points give output zero. Zeroes are inputs; the output is zero at each.” Example h0,k−4,probe4 8,zeroes true.
5. **No real zeroes.** “A real square is zero or positive. Adding a positive amount keeps this output above zero for every real input. The known rule explains more than a few positive table entries could.” Example h0,k2,probe4 0,zeroes true.
6. **An interval is honest.** “A graph reading can give a useful interval. Here the endpoint calculations put zero between quarter marks. Each zero is inside its own interval; it is not exactly at its middle just because we drew a band.” Example h0,k−2,probe4 5,zeroes true. Positive bracket1¼..1½ has outputs−7/16 and1/4; negative bracket−1½..−1¼ has outputs1/4 and−7/16. Display calculated signs/fractions, not hidden prose arithmetic.

## Meaning and UI wording

Title: Curve Window. Entry: Make points, folds and zero intervals for a square rule.
Plot instruction: Choose an input and your proposed output, then add the point. You can keep unexpected points.
Compare instruction: Your marks stay here. The solid curve and table come from the written rule.
Zeroes instruction: Mark your idea, or choose to show the rule’s curve. Your marks stay yours either way.
Explain button: See the model’s zeroes.
Model note: A known number rule, not measured data. A few dots alone do not prove a smooth continuation.
Learner labels: Your proposed points (hollow diamonds); your fold (long dashed); your zero bands (outlined).
Reference labels: Rule's curve (solid); rule's fold (short dashed); selected-input table.
Copy labels: Work on a copy; Resume earlier working copy; Another copy.
No-model message: This earlier example picture cannot be drawn. Its words and your picture are still here.
Refusal: This model view could not be opened safely. Your picture and earlier work are unchanged. Download Notes or try again.
Keep refusal: This picture could not be kept safely. Your marks and earlier versions are unchanged.
Keep status uses actual saved/off/uncertain result and directs to Notes.
Grown-up interpretation: Supplied-reference views and constructed marks are not independent calculation, oral explanation, attention or mastery. The multiplications shown here may count as exposure to those facts elsewhere in this explorer’s notebook. No new answer or attempt is recorded.


## UI-owned version1 text templates

These are generic controls and mathematical descriptions, not literal saved teaching/source words. Fill named numeric slots from the valid saved model using exact fractions. Never fill them from a guessed answer key or current catalogue. Their full generated forms also supply narration; source-owned teaching words are read verbatim before its own example quantities.

Pages/headings: Plot your picture; Compare with the rule; Mark zero intervals; How square rules work. Page tabs: Plot; Compare; Zeroes. Controls: Input x; Your proposed output y; Add point; Remove this point; Proposed fold input; Set fold; Replace fold; Clear fold; Rule probe input; Starting probe; Your idea about zeroes; Left end; Right end; Add interval; Replace this interval; Remove this interval; Show the rule’s curve; Hide the rule’s curve; See the model’s zeroes; Hide the model’s zeroes; Previous teaching page; Next teaching page; Back to my picture; Keep this picture; Kept pictures; Working pictures; New blank picture; Retry view; Reopen kept pictures; Equality Desk.

Idea options: Not sure yet; No real input gives zero; One real input gives zero; Two real inputs give zero. These option labels are child-facing; the interpretation that they are ungraded learner proposals belongs only in the labelled grown-up panel. The model count never changes the selected idea. Reversed-band notice: Choose a left end that is no farther right than the right end. Your earlier intervals are unchanged.

Table caption: Selected inputs from the written rule, not all possible inputs. Headers: Input x; Changed input x−h; Square of the changed input; Output y. For h=0 the changed-input header is Changed input x; otherwise format h with parentheses when negative. Each square cell uses the Square calculation and positive magnitude lines from the Probe calculation template below, never a bare result alone. Candidate table caption: Your proposed points; headers Input x, Your proposed y. Proposed point count notice: This picture holds eight proposed points. Remove a point or start a new blank picture before adding one.

Curve key: Solid blue curve — the written rule. Point key: Hollow amber diamonds — your proposed points. Fold keys: Short blue dashes — the rule’s fold; long amber dashes — your proposed fold. If folds coincide, show one two-colour/offset composite and a visible note: Your fold and the rule’s fold are at the same input. Do not hide one underneath the other or claim this proves understanding.

Band keys: Outlined amber bands — your proposed intervals. Filled blue ribbons — the model’s quarter-mark intervals. A blue circle on the x-axis means an exact model zero; a touching zero uses an outlined circle with the word Touch. Reference interval label: A zero lies between {lo} and {hi}; these endpoints are not the exact zero. Exact label: Output zero at input {x}. All model zero markers appear only after See the model’s zeroes; the rule’s curve itself remains available separately.

Probe calculation: At input {x}, first subtract {h} (when h=0: subtract zero, so the input is unchanged). The changed input is {t}. Square it: {t} × {t} = {square}. Then {add/subtract/leave unchanged for k}. The output is {y}. When h is negative say “subtract negative {abs(h)}”; k negative says “subtract {abs(k)}”, k positive “add {k}”, k zero “add zero, so the output is unchanged”. Integer signed factors use parentheses. For reduced fraction t=n/d show its exact squared product with each signed numerator parenthesized, for example ((−5)×(−5))/(4×4), as well. Positive magnitude context: For integer t, say Magnitude {abs(n)} × {abs(n)} = {n*n}. For fractional t, say Numerator magnitude {abs(n)} × {abs(n)} = {n*n}; denominator {d} × {d} = {d*d} (only when d>1). Output and shifted input signs remain explicit; magnitude does not change the signed expression. Narration says fractions as signed numerator over positive denominator and labels input/output, not units of length.

Fold reference: The rule’s fold is input {h}. Its vertex is ({h},{k}). Equal distances left and right of this input give the same output for this rule. Your proposed fold stays at {fold} / You have not marked a fold.

No-real-zero explanation (k>0): A real square is zero or positive. Adding {k} keeps this output above zero. So no real input gives output zero for this known rule. A few positive table entries alone would not prove that.
One-zero explanation (k=0): Output zero needs the squared part to be zero. That happens at input {h}. The curve touches zero there and turns upward; it does not cross to negative outputs. There is one different real input giving zero. Display the full Probe calculation and magnitude line at that root input; the zero factor creates no positive recall pair.
Two-exact-zero explanation (k<0 and square distance): Output zero needs the squared part to equal {−k}. The changed input can be {−r} or {+r}; after the shift the inputs are {left} and {right}. Each gives zero. There are two different real inputs giving zero. Display the full Probe calculation and magnitude lines at each exact root input, making the squared multiplication explicit.
Two-interval explanation (k<0 and non-square distance): Output zero needs the squared part to equal {−k}. This known continuous curve has a zero on each side of its fold. On the left, input {loL} gives {valueLoL} and input {hiL} gives {valueHiL}. On the right, input {loR} gives {valueLoR} and input {hiR} gives {valueHiR}. Each pair has opposite output signs and stays on one side of the vertex, so each interval brackets one zero. These are quarter-mark bounds, not an exact root or its midpoint. For each of the four endpoints display the full Probe calculation and magnitude lines, not just its output. All those displayed calculations contribute their eligible pairs before the explanation is rendered.

Reference provenance note: The curve and its values are supplied by the written rule. Your points, fold, idea and intervals stay unchanged; they are not a score. New-construction safe fallback: Your new marks are still here. The model view could not be reopened safely, so this page shows your picture alone (on Zeroes after a Zeroes edit, otherwise on Plot). Download Notes or retry the model view.

Display signs consistently use Unicode minus (−); wrap formatNumber output for display rather than changing the shared arithmetic utility. Formula/narration templates remain exact. UI string tests should use the authored labels; apostrophe typography is not a new learner-data or validation requirement.
