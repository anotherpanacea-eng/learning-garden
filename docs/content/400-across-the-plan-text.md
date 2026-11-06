# 400 · Across the plan: complete finite material

Original geometry and wording. This is an extension of Square Pens, not a real route plan. Values below are templates; runtime substitutes numbers, uses `unit`/`square unit` at1 and otherwise plurals. All steps are open. Invitations change material, not a hidden difficulty or a grade.

## Invitations and independent expected results

| A | B | h | v | Edge route | N | Straight distance |
| --- | --- | --- | --- | --- | --- | --- |
| (1,1) | (4,5) |3|4|7|25|5|
| (10,9) | (4,1) |6|8|14|100|10|
| (2,8) | (7,8) |5|0|5|25|5 (one grid line; no squares shown)|
| (6,6) | (6,6) |0|0|0|0|0 (same point)|
| (3,3) | (5,6) |2|3|5|13|√13, strictly between3 and4|
| (0,0) | (12,12) |12|12|24|288|√288, strictly between16 and17|

Current cursor starts0; Try another plan advances before applying. Other corner toggles the elbow without changing the endpoints. All literal coordinates0..12 are independently editable; these cases are invitations, not the whole domain.

## Common copy

- Entry/page: **Across the plan**.
- Intro: “Pip is comparing two connections on a paper plan for the library garden. How does a straight segment compare with following the grid edges?”
- Coordinate reminder: “A coordinate pair gives a position: x across first, then y up from zero. To measure between two positions, count the intervals between them.”
- Controls: **Move A / Move B**, **x across**, **y up**, **Use the other corner**, **Try another plan**.
- Coordinate labels: “A: (ax, ay)” and “B: (bx, by)”. Active-point control name includes its letter and axis.
- Three steps: **Count intervals / Compare squares / Find the distance**.
- Route key: “Following the grid edges” and “Straight segment”. One-unit key: “One grid interval is 1 length unit.”
- Point note when coincident: “A and B share this position.”
- Trace controls: **Trace next interval / Trace back / Show the whole edge route**.
- Trace status: “t of L edge intervals highlighted.” Zero: “There are no edge intervals between these positions.”
- Other-plans strip: “Your other triangle plans are kept.”
- Purposeful return: “Keep the endpoints and try the other corner. Then move both points the same amount. What stays the same, and why?”
- New invitation status: “New paper plan: A (ax, ay), B (bx, by).” No computed distances in that action status.

## Nondegenerate steps (h and v both positive)

**Count intervals**

“The edge route changes one direction at a time. Count the intervals, not the endpoint dots. Which segment looks shorter?”

“Horizontal change: larger x − smaller x = h units. Vertical change: larger y − smaller y = v units. Edge route: h + v = L units.”

“The turn on the grid edges makes a square corner. The straight segment is across from that corner.”

No square-area or straight-distance result is given at this step.

**Compare squares**

“This is a right triangle. Build shows why the square on its long side has the area of the two short-side squares together. Use the horizontal and vertical changes as its short sides.”

“Horizontal-side square: h × h = H square units. Vertical-side square: v × v = V square units.”

“Long-side square: H + V = N square units. Distance² = N.”

“N is an area, not the distance. What positive length has that square?”

**Find the distance**

Whole root: “k × k = N. The straight distance is k units. We choose the positive length.”

Nonwhole root: “k × k = K and u × u = U. N lies between K and U. The straight distance is strictly between k and u units. Its exact name is √N units: the positive number whose square is N.” Here u=k+1.

“Edge route: L units. Straight distance: d units.” d is the whole integer or exact radical, never a rounded guess.

“The edge route is longer. Squaring its length adds 2 × h × v to the two square areas, so its square is larger than N.”

**Exposure refinement:** that last sentence would supply extra multiplication beyond the intended visible pair contract. Use instead: “Both direction changes are positive. Going around the corner is longer than the straight segment.” The proof is for the adult note below; the runtime must not show the discarded `2 × h × v` sentence.

## One-direction steps

Count: “These points share one grid line. Count the L intervals between them. There is no turn.”

Squares: “Only one direction changes. There is no two-leg right triangle here, so no square calculation is needed.”

Distance: “The straight distance is L units. The edge route is also L units: it already follows the straight grid line.”

No right-angle marker or square-area figures appear.

## Same-point steps

Count: “A and B are at the same position. There are zero intervals between them.”

Squares: “There is no triangle here and no square calculation is needed.”

Distance: “The straight distance is 0 units. The edge route is also 0 units. Changing a point’s name does not move it.”

No right-angle marker, squares or invented positive distance.

## Adult explanation (folded)

“This open paper model connects coordinate differences with the right-triangle square-area relationship. The complete plan is invented; it cannot tell anyone which real route is usable or safe. Coordinates are positions, while h and v are lengths between coordinates. For h,v>0, the edge route has length h+v and its square exceeds h²+v² by2hv, so it is longer than the positive straight distance. When one difference is zero the distances are equal; when both are zero both are0. The supplied counts, diagrams and roots are support, not an independent answer or course result. This first grid stays in nonnegative whole-number coordinates; it does not teach every quadrant, scale, radical simplification or surveying method. No new construction or reading response is saved.”

The discarded proof sentence above is an authoring correction, not runtime copy. Prefer moving only the final chosen strings into the existing content module; no parallel generated-copy system is required.
