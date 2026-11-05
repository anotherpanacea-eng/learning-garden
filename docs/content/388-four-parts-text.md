# 388 · Four Parts: finite original teaching

For independent mathematical/content review with388. No learner information or upstream lesson prose. Source cases are frozen when a draft is created; saved words are never refreshed from this file.

## Invitation and source convention

**Four Parts** — A layout for the Gazette.

“A square picture needs room for two strips of printing. One strip goes to its right, another below it. The corner needs paper too. Build labels for all four parts, then gather the same kinds of tiles.”

“In this picture, x is the square picture's side length measured in centimeters. A label tells an area in square centimeters. Change x to try another picture size. These are made-up print plans.”

## Teaching, available without earning anything

1. “Start with numbers. An11 cm by12 cm rectangle can be split at10 cm on each side. Its four parts have areas100,10,20 and2 square centimeters. Together they make132.”
2. “The cuts reach all the way across. No paper is missing, and no part is counted twice. This is why adding the four areas gives the whole area.”
3. “Now use x in place of10. The square is x×x, written x². The right strip is1×x, the bottom strip is2×x, and the corner is1×2. The whole side lengths, x+1 and x+2, are factors: lengths we multiply. Brackets keep each added length together.”
4. “x² is the area of a square with side length x.2x means two lots of x. At x=2 both happen to be4. At x=3 they are9 and6. One matching number does not make the labels the same.”
5. “Gather the same kinds: x²+x+2x+2 becomes x²+3x+2. Here the plus signs separate terms of a sum. You can combine terms with the same kind of tile, such as the x strips. You cannot combine an x square and an x strip into two x squares.”
6. “A size check tells us about that size. The four pieces explain why a matching expression describes every picture size in this plan. We are using positive lengths here.”

Show the teaching as six short manual pages using ONLY each page’s frozen figure data. Pages1–2 have rectangle(a=1,b=2,x=10,numbers); page3 has rectangle(1,2,10,letters); page4 has square-and-strip(xs=[2,3],strip=2); page5 has rectangle(1,2,3,letters); page6 has no figure. All source pages store words and figure together; historical words/figures are never rebuilt from this table. Back/Next never erases work. Teaching does not copy answers into the learner's labels or tray. The separate worked-example disclosure reuses this11×12 plan, shows all four given products, and states that it is a different plan from the initial job.

## Six openly selectable jobs

All jobs are fictional and use the source convention above. Each starts x=6 and an empty label set/zero tray. First label is the picture square; right/bottom follow the named side extensions, not an arbitrary answer order.

| id | title | a right | b below | four given products | collected reference | story/explanation |
|---|---|---:|---:|---|---|---|
| picture | A picture and two strips |2|3| x²,2x,3x,6 | x²+5x+6 | “Add2 cm to the right and3 cm below the square picture.” / “The two x-strip areas add to5x. The2-by3 corner contributes6, not5.” |
| narrow | Same strip total, another corner |1|4| x²,x,4x,4 | x²+5x+4 | “This plan adds1 cm to the right and4 cm below.” / “The strips still add to5x, but the corner is1×4. A matching x total does not fix the corner.” |
| square | Equal extensions |3|3| x²,3x,3x,9 | x²+6x+9 | “Add3 cm on both sides. The whole plan is square too.” / “There are two3x strips as well as the original square and the3-by3 corner. (x+3)² is not just x²+9.” |
| wide | A wider lower strip |2|4| x²,2x,4x,8 | x²+6x+8 | “Add2 cm to the right and4 cm below.” / “These strips add to6x too. The corner is2×4, so this whole differs from the equal-extension plan.” |
| small | One centimeter each way |1|1| x²,x,x,1 | x²+2x+1 | “Leave1 cm of extra paper at the right and below.” / “Two x strips are2x. They are not2x². The corner is one square centimeter.” |
| corner | Keep the corner |3|4| x²,3x,4x,12 | x²+7x+12 | “Add3 cm to the right and4 cm below.” / “The corner covers3×4 square centimeters. Counting the side lengths3+4 cannot give that area.” |

These references are not automatically inserted into work. Compare discloses them explicitly. Source a,b within1..6 supports readable historical layouts beyond the six current jobs; future catalog expansion needs content review, not a validator change.

## Actions and feedback meanings

Pages: **Build four labels** · **Gather like tiles** · **Compare**.

“Build labels for any picture size x. Choose a part, a tile kind, then how many.” Whole area is shown as (x+a)(x+b) next to the rectangle. Kinds: **x square** (x²), **x strip** (x), **unit square** (1). Named parts: **A · Picture square**, **B · Right strip**, **C · Bottom strip**, **D · Corner**. Always show the selected part's two side lengths. Clear label is reversible by building again; it does not erase the other parts or tray.

“The tray starts at zero. Gather your x squares, x strips and unit squares.” Your four labels stay visible on this page. The count controls change only this tray; they do not fix the labels.

Compare headings and literal meanings:

- **Labels and their pieces** — one row per part; show its proposed label, its value at the chosen x, the given dimensions/product, whether its form describes that piece, and whether just this numerical value agrees. Missing: “No label yet. You can keep looking or keep this unfinished version.”
- **Tray and your four labels** — “These counts gather your four labels” or “These counts do not yet gather your four labels”; missing labels: “A label is still missing, so there is not yet a complete set to gather.”
- **Tray and the whole rectangle** — “These counts describe the whole plan” or “These counts describe a different expression.” Explain that the program compares the square/x/unit coefficients, not a handful of test values.
- **At x=…** — print both numerical areas. When the values match but forms differ: “The numbers agree at this size. The expressions are different. Change x and compare the four pieces.” A structural match is explained by the four areas covering the rectangle, not by one successful test.

When the tray describes the whole but any part label does not match its dimensions: “Your tray describes the whole area. Some labels do not describe their own pieces. Check each piece’s side lengths.” Only when a≠b and the right/bottom labels are exactly bx/ax, append: “The right and bottom labels are on each other’s strips.” Do not infer a swap from any other mismatch, and do not confuse the tray with the sum of labels. No forced correction or failure penalty. Zero counts, unexpected labels and incomplete versions may be kept.

**Keep this layout**, **Work on a copy**, **New blank draft** · **Another copy**, **Working drafts**, **Kept layouts**, **Equality Desk**, **Hear this page**. Session notice: “Unkept drafts last in this open page. Keep a version to include it in Notes.” Persistence messages must describe actual save results, not assume a completed Keep reached device storage. Refusal: “This version could not be kept safely. Your work and earlier layouts are unchanged. Download Notes or keep building.”

Folded grown-up interpretation: “These are given mathematical layouts and optional reference/example views. Labels and a tray are retained as constructed, including zero or unexpected choices. Initial zeros and the count1 kind-selection default are starting controls, not inferred answers. Flags name teaching/reference/example views opened in that working version; they do not measure attention or all prior exposure. A false separate-example flag does not exclude a worked example in teaching. This does not assess independent expansion, a completed topic or ability outside this length model. Kept versions and earlier wording stay unchanged.”

## Review math examples

- a=2,b=3,x=2: actual areas4,4,6,6, whole20. If the square is mislabeled2x, the four proposed values still total20 at this x, but their vector is[0,7,6] rather than[1,5,6]. At x=3 these totals are27 and30. A self-consistent tray[0,7,6] matches the proposed labels but not the whole expression.
- a=2,b=3: swapping the right/bottom labels to3x/2x leaves the collected vector[1,5,6] and whole identity intact, yet neither strip label describes its own dimensions.
- The numeric teaching uses a=1,b=2,x=10:100+10+20+2=132=11×12. At x=3 its symbolic reference gives9+9+2=20=4×5.
- Each current source has a,b>0. No diagram invents a zero-width band, and no negative number is represented as a length. Count0 remains a permissible proposed label/tray term.
