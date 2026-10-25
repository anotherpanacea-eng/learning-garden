# The Shape Bench: all child-facing text

Companion to [spec 126](../specs/126-shape-puzzles.md). Use as written, after the same independent review. `{guide}` is the explorer's chosen companion. Pip is a fox (he/him), Dot a ladybug (she/her). The miller is she/her (spec 120). The glazier and the baker have no pronouns in this text. These puzzles are meant to work from pictures; every line here can also be read aloud. Nothing here is scored.

## Arriving

**Place title:** The Shape Bench

**First visit:**
> On the Workshop bench there's a wooden box of glass pieces, a stack of flat card and a crate of floor tiles.
>
> "The storm broke every window on the high street," says the glazier. "But this is a clever kit. Seven pieces that make a square, and every window shape in town can be made from all seven. If you can work out how."

**Later visits:** The Shape Bench. Which table?

**Table names:** Window pieces · Parcel boxes · Floors

## Controls (all tables)

| Control | Label |
| --- | --- |
| Turn | Turn |
| Flip | Flip |
| Put back | Put back in the box |
| Start again | Start again |
| Start again confirmation | Take every piece off? · Yes · Keep them |
| Support | Show me one piece |
| Read aloud | Read this to me |

**Placing tip (shown once):** Tap a piece, then tap where it goes. Or drag it.

## Window pieces

**Pieces (for read-aloud):** big triangle · big triangle · middle triangle · small triangle · small triangle · square · slanted piece

**Worked first step (w1, first visit):**
1. "This window is a square. You can see where each piece goes."
2. "Pick up a big triangle. Turn it until it fits its space."
3. "Every piece has a space. Keep going until the window is full."

**Messages:**
- The window is full. The glazier fits it in. *(window appears mended in the town)*
- That piece is overlapping another one. Move it a little.
- Part of the window is still empty.
- Show me one piece: here's where one piece can go. *(places one piece)*
- Any way of filling the window counts, even if it's different from the glazier's way.

**Windows:**

| ID | Title | Line (read aloud) |
| --- | --- | --- |
| `w1` | The bakery square | The bakery's window is a square. |
| `w2` | The post office triangle | Dot's window is a triangle. Dot says it's pointier than she expected. |
| `w3` | The café rectangle | The café window is a long rectangle. You can see the outlines of three pieces. |
| `w4` | Pip's fox | Pip wants a fox in his window. Of course he does. |
| `w5` | The heron | A tall bird with long legs, for the window by the brook. |
| `w6` | The boat | A boat for the boat-mender's window. |
| `w7` | The house | A little house, with a roof. |
| `w8` | The slanted window | This one is a slanted shape, like the slanted piece, only bigger. |
| `w9` | The library window | Wide at the bottom, narrow at the top. |
| `w10` | Square challenges | Can you make a square from some of the pieces? |

**Square challenges (w10):**
- Heading: How many pieces can make a square?
- Buttons: 2 pieces · 3 pieces · 4 pieces · 5 pieces · 6 pieces · 7 pieces
- Prompt: Make a square using exactly {n} pieces.
- Made: A square from {n} pieces!
- After trying 6 for a while (button: I think it can't be done): You might be right. People who have tried every way say a square can be made from 2, 3, 4, 5 or 7 pieces, and from 1 (the square piece itself), but never from 6. `[check]`

## Parcel boxes

**Arriving (from the post office):**
> Dot has a pile of flat card on the counter. "Each parcel needs a box," she says. "You cut out six squares joined together, fold up the sides, and stick them. But some shapes don't make a box. They leave a gap, or two sides land on top of each other."

**Worked first card (n1, first visit):**
1. "Here's a flat card with six squares. A box has six faces: a bottom, a top and four sides."
2. "Before we fold it, decide: will it make a closed box?"
3. "Once you choose, you can't change it. That's the point of a prediction. Then we fold and see."

**Prediction:** Will it fold into a closed box? · Yes · No
**Reason (optional):** Why do you think so? (Say it to someone, or write it here.)
**Fold button:** Fold it

**Fold results:**
- It folds into a closed box! Every face has its own place.
- It doesn't close. Look: these two squares land on the same side, and this side is left open.
- You predicted {yes/no}. Was that what happened?

**Supports:**
- Mark the bottom: Choose which square will be the bottom of the box.
- Show where it goes: Each square turns the color of the face it becomes: bottom, top, front, back, left or right.

**Card lines (read aloud):**

| ID | Line |
| --- | --- |
| `n1` | A cross shape. |
| `n2` | A tall T. |
| `n3` | A staircase. |
| `n4` | Three and three, side by side and stepped. |
| `n5` | Two, then three, then one. |
| `n6` | Six in a line. |
| `n7` | Four in a square, with two more. |
| `n8` | Four in a row, with a flap at each end on the same side. |

**Find all eleven (older page):**
- Heading: How many different boxes?
- Intro: Draw a card of six squares, joined edge to edge. If it folds into a box and it's new, it goes on the shelf. Cards that are the same after turning or flipping count as one.
- Results: New! It folds, and it's not on the shelf yet. · It folds, but it's the same as one on your shelf, turned or flipped. · It doesn't fold into a box. · That's not six squares joined edge to edge.
- Shelf: {n} of 11 found.
- When all eleven are found: That's all of them. There are exactly 11 ways to make a box from six joined squares.

## Floors

**Arriving:**
> The crate is full of floor tiles, each made of five squares joined together. "Twelve different shapes," says {guide}. "People call them by letters, because they look a bit like letters."

**Piece names:** F · I · L · N · P · T · U · V · W · X · Y · Z

**Worked first step (f1, first visit):**
1. "This is the café step. It needs exactly three tiles: L, P and V."
2. "Try the corners first. Corners are fussy."
3. "Turn and flip each tile until the floor is full, with no gaps and no tiles on top of each other."

**Floors:**

| ID | Title | Line |
| --- | --- | --- |
| `f1` | The café step | Three tiles: L, P and V. |
| `f2` | The mill hatch | Three tiles: P, U and Y. |
| `f3` | The library nook | Four tiles: I, L, P and V. |
| `f4` | The bakery floor | Four tiles: F, L, U and Y. |
| `f5` | The great hall | All twelve tiles, in a floor 6 squares by 10. There are thousands of ways. Can you find one? `[check: 2,339 ways]` |

**Messages:**
- The floor is full! No gaps, no overlaps.
- There is still an uncovered space. Try another position, or move a tile.
- (Only for f1 and f2) Show me one piece

## The floor that can't be done (older page)

**Arriving:**
> The mill loft floor is 4 squares by 4. Two posts stand in opposite corners, so those squares can't be covered. The miller has seven long tiles, each 2 squares long. "Seven tiles, fourteen squares to cover," says the miller. "Should be easy."

**Try it:** Lay the seven tiles. Each one covers two squares side by side.
**After trying (button: I don't think it can be done):**
1. "Let's paint the floor like a chessboard: light, dark, light, dark."
2. "Look at the two corners with posts. What do you notice about their colors?" · They're the same color · They're different colors
   - On "the same": Yes. Both are the same color.
   - On "different": Look again. Opposite corners of this floor are always the same color.
3. "Now look at one tile. However you lay it, it covers one light square and one dark square."
4. "So seven tiles cover seven light squares and seven dark squares. But with both posts on the same color, the floor has eight of one color and six of the other."
5. "So it can't be done. Not because we haven't tried hard enough. It's impossible, and now we know why."

**Contrast:** Here's the same floor with the posts in two corners on the same side. Try this one. *(It can be done, in 12 different ways.)*
**After the contrast:** Different colors in the corners, and it can be done. Same colors, and it can't.

**Bigger floors (extension):**
- A floor 6 by 6, with opposite corners gone. Can it be done? · Yes · No *(No: both corners are the same color.)*
- A floor 6 by 6, with one light square and one dark square gone. Try it. *(This one can be done.)*

## Off-screen invitations

- Ask a grown-up to cut a square of paper into the seven tangram pieces, and make your own window shapes.
- Find a box at home, ask a grown-up to cut along some edges, and lay it flat. Does its flat shape look like one of the cube nets? Other kinds of boxes have different nets.
- Draw a chessboard and color it. Cover two opposite corners with coins. Can dominoes or pieces of paper the size of two squares cover the rest?

Off-screen invitations record nothing.

## Grown-up notes

- The seven-piece kit is a tangram. Any covering of a window counts, not just the stored one.
- Predicting before folding is the heart of the parcel boxes, so the prediction locks once made.
- The floor that can't be done is a classic proof by coloring. It's the first place in the garden where the answer is a reason, not a picture.
