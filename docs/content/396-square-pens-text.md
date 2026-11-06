# Square Pens396 · finite teaching and interface copy

Original English, invented paper models. Generated numbers below are explicitly defined in spec396; lengths use “units”, areas “square units”. Never call a numerical match learning or independent work.

## Entry and board

Entry: **Square Pens** — Right triangles and square areas.
Heading: **Same pieces, different squares**.
Story: **Pip needs a paper plan for square pens by the library garden. Can the same pieces explain the long side?**
Model note: **This is a made-up paper model, not a building plan.**
Parent return: **Back to Copy Frame**.
Open pages: **Build · Why it works · A different corner**.
Material controls: **Short side a · Short side b · Less · More · Turn the plan · Try another pen**.
Piece actions: **Move one piece · Move back · Reset pieces · Compare finished plans · Back to my pieces**.
Length actions: **Show the side length · Hide the side length**.
Transient state: **Moving the pieces. Compare the empty areas after the last move.**
New invitation announcement: **New pen: short sides {a} and {b} units.**
Corner inset labels: **α · β · square corner: 90° · straight edge: 180° · middle corner: 90°**.
Optional square-rule link: **Open Equality Desk** (`#learn/math/equality`). **Choose Curve Window there to explore square rules. Going to Equality Desk starts a fresh paper plan when you return. Back to Copy Frame keeps this plan during this visit.** No new transfer/deep link.
Finished state: **Same frame. Same four triangles. The middle square has the same total area as the two corner squares together.**
Piece key: **Triangle 1 · Triangle 2 · Triangle 3 · Triangle 4**; ids/patterns remain fixed. **The patterns identify pieces; they are not square units.**
Small-triangle sides: **side a · side b · side c**. Optional prompt: **Which side is across from the square corner?**
Leg response: **This side touches the square corner. Look across from that corner.**
Hypotenuse response: **This is the hypotenuse: the side across from the square corner.**

## Why it works · frozen3-and4 example

1. **This right triangle has short sides 3 and 4 units. The square marks its right angle.**
2. **Four copies fit inside a square frame, 7 units on each side. Each triangle is half a 3-by-4 rectangle.**
3. **Each middle side is a copy of the triangle’s long side. A triangle’s angles total 180°. Take away its square corner: its other two angles, α and β, total 90°. At each middle corner, one of each meets on a straight edge. The middle corner is 180° minus 90°: another 90°.**
4. **Move the same pieces. The frame and the four triangles keep the same areas.**
5. **The empty squares are 9 and 16 square units. Together they make 25 square units, just like the middle square.**
6. **Area is not side length. The middle square has area 25 square units. Because 5 × 5 = 25, its side is 5 units.**

Each step is selectable without an access gate. Numeric reference panel (Why step6 only): **Frame: 7 × 7 = 49 square units. One paired rectangle: 3 × 4 = 12 square units. Four triangles: 2 × 12 = 24 square units. Empty area: 49 − 24 = 25 square units.**

## Own-material explanation templates

Build’s permanent calculation panel:
- **Frame: {L} × {L} = {L²} square units.**
- **Two triangles make one rectangle: {a} × {b} = {ab} square units.**
- **Four triangles make two of those rectangles: 2 × {ab} = {2ab} square units.**

The two-square/result templates below appear after move3, in Compare, or in the elected side-length disclosure. They never label intermediate empty regions. Why inserts only its current step; steps1–4 show no numeric area labels or unit grids. Reference pages say **Example sides: 3 and 4 units** or **Example sides: 3, 4 and 6 units**, apart from the readonly **Your pieces wait: a={a} {unit/units}, b={b} {unit/units}** strip.


- **The two short-side squares have areas {a} × {a} = {a²} and {b} × {b} = {b²} square units.**
- **Frame minus triangles: {L²} − {2ab} = {N} square units. This is the middle square’s area in the starting plan, c².** (Only completed endpoints or original-triangle length disclosure, never intermediate empty regions.)
- **The same four triangles fill the same frame in both plans. What remains has the same area: {a²} + {b²} = {N} square units.**
- Formula: **a² + b² = c². The little 2 means “multiply the number by itself.” This rule is for a right triangle.**
- Exact side: **{k} × {k} = {N}, so the long side is {k} units. We choose the positive length.**
- Non-whole side: **{k} × {k} = {k²}; {k+1} × {k+1} = {(k+1)²}. {N} is between {k²} and {(k+1)²}. The long side is between {k} and {k+1} units. Its exact name is √{N} units: the positive number whose square is {N}.**
- Check: **The long side is longer than either short side.**
- Discussion invitation: **Tell someone why moving these pieces keeps the empty area the same. Then try another pair of short sides.**

## Different-corner contrast

**This triangle has sides 3, 4 and 6 units. Its marked corner, between the 3 and 4 sides, is wider than a square corner.** Mark that corner with an arc, never the right-angle square.
**9 + 16 = 25, but 6 × 6 = 36. The square-area rule does not fit this triangle. It needs a right angle.**
**Back to my pieces** restores the current own material, not3 and4.

## Refusal and saving boundary

**That view could not be prepared safely. Your pieces and earlier notes are unchanged. Try again, download your notes, or go back.**
Actions: **Retry view · Grown-up notes · Back to Copy Frame**.
Session-only arithmetic notice: **The pictures can still work during this visit. These help notes are not saved on this device. Ask a grown-up to download your notes if you want to keep them.**
No message promises saved construction, mastery or a verified real-world design.

Interface quantities use **unit** for1 and **units** otherwise; an individual area of1 uses **square unit**. This changes grammar, not the mathematical surfaces or the pair table.
