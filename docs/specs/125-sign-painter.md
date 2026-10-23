# 125. The Sign Painter: shape, symmetry, pattern and color

Status: **proposed; awaiting independent spec review, a science check of the color lines and a licence check of the artworks.** Part of the [new kinds of play proposal](../new-game-kinds.md). Fits Act II and Lantern Night in [spec 120](120-keeper-of-the-ways.md). Every child-facing line is in [the companion text](../content/125-sign-painter-text.md); this spec holds the benches, the models and the saves. Code and art are for the implementation pass.

## Purpose

Nowhere in the garden are color, shape and pattern the material. The Sign Painter is a making studio where the town's shops, stalls and the post office order new signs after the storm. Each order is a short written brief; the child designs a sign to it with shapes, mirror lines, repeating borders and mixed colors; the customer replies about the choices the child made.

It teaches composing shapes with turns and flips, constructing a mirror-symmetric figure and checking it by folding, finding and building a repeating unit, and the surprising contrast between mixing paint and mixing colored light. For older explorers it adds turn symmetry, tiling a floor, and looking closely at real artworks for the choices their makers made. Artistic quality is never judged.

## Place and story

The studio is a shed behind the market with a long bench, pots of paint and blank boards. Route: `#studio/signs`, beside Bell Studio and the Rhythm Studio. Open from the start.

- **Act II:** a kept sign for any order counts toward chapter 1, *the weekly market*, because the stalls are reopening. Kept signs appear on the matching buildings and stalls in the town scene.
- **Lantern Night** (winter festival, spec 120 §6): the Lamplight bench moves onto the footbridge, where three colored lanterns shine on the white bakery wall.

## The benches

### 1. Shapes

A board and a tray of shapes: square, rectangle, triangle (right-angled and equal-sided), half circle, circle, diamond, hexagon. Every shape can be moved, **turned** (quarter turns) and **flipped** (over a line across or up and down). Shapes snap to a light grid, can overlap, and take any color from the paint palette. Orders that need a picture (a loaf for the bakery, a hat for the post office) show an outline to fill with shapes; any arrangement that covers the outline counts, and the outline can be hidden.

### 2. Mirror signs

A square grid canvas, 8 by 8 to 12 by 12, with a mirror line: up and down, across, or sloping corner to corner. The child paints squares on both sides themselves; the game never copies them across. **Fold to check** animates the fold and marks each square that lands on a different color, then unfolds. Squares on the mirror line itself stay where they are and match themselves. A sign can have two mirror lines once the child has checked one.

### 3. Borders

The child designs a **tile** on a small grid (2 by 2 to 4 by 4) and chooses how the border repeats it: **slide** (the same each time), **flip** (every other tile flipped), or **half turn** (every other tile turned half way). The border runs round the sign's edge.

Before building their own, the child meets three supplied borders and finds each one's **smallest repeating unit** by drawing a box round it; the box is checked by repeating it and comparing. The supplied units are an ABB, an AAB and an ABC unit, so the unit is never just "every other one."

### 4. Paint and lamplight

Two palettes, side by side, with every color named in text as well as shown.

| Paint pots (mixing on the palette) | Result shown |
| --- | --- |
| red + yellow | orange |
| yellow + blue | green |
| red + blue | purple |
| red + yellow + blue | a dark brown |
| any color + white | a lighter version of that color |
| any color + more of it | stronger |

| Lanterns (light overlapping on a white wall) | Result shown |
| --- | --- |
| red + green | yellow |
| green + blue | cyan, a sky blue-green |
| red + blue | magenta, a pinky purple |
| red + green + blue | white |
| one lantern dimmed | that color fades towards the others' mix |

The contrast is the lesson: mixing paint gives darker colors, and mixing light gives lighter ones. The text gives the reason in one line for each, for older players: paint soaks up some colors of light and gives back the rest, so each paint added soaks up more; lanterns each add their own light, so more lanterns add more. Real paints vary, and the text says so. The lamplight bench says the white wall gives back all the light that lands on it, which is why the colors show on it.

### 5. Look closely (older depth)

One artwork per visit, from a short list of public-domain works, shown with its title, maker, date and source. Three questions, one at a time, with free answers and no right answer: *What repeats?* · *Where does your eye go first?* · *What colors did the maker choose, and why might they have?* A Details line gives one fact about how the work was made. Candidates, each needing a licence and image check (`[check]` in the companion):

- William Morris, *Strawberry Thief*, printed textile, 1883.
- Owen Jones, a plate from *The Grammar of Ornament*, 1856.
- Katsushika Hokusai, *The Great Wave off Kanagawa*, woodblock print, about 1831.

### Older benches

- **Turn signs:** a sign that looks the same after a half turn or a quarter turn. **Turn to check** animates the turn and marks squares that land on a different color.
- **Floor tiles:** which shapes cover a floor with no gaps or overlaps? The child tries squares, equal-sided triangles, regular hexagons, regular pentagons, and any triangle or any four-sided shape they draw. The bench lets the child try, and then says what is true: the first three always tile; regular pentagons never do; every triangle and every four-sided shape can tile, by turning copies.

## Orders

Each order has a customer, a brief and one or two **asks** the sign must meet. The asks are checked only when the child presses **Is it ready?**, and only the asks: never beauty, neatness or color choice. Twelve orders, in the companion text: the bakery, Willow Post Office (Dot wants her hat on it), the café, the mill, the library, the Games Table, the orchard stall, Bramble's ribbon stall, the flood post (Act IV), *La Garza*'s gangplank (Act III), the Lantern Night banner (winter), and an open order for the child's own shop.

When a sign is kept, the customer replies with a line built from the choices made (for example, naming the mirror line or the border type), from templates in the companion.

## Saved work

Optional root `signs` per explorer, absent until the first bench opens:

```
signs: {
  orders: { [orderId]: { design: design, kept: bool, replySeen: bool, at } },
  free: [design],                                       // latest 12, outside orders
  benchState: { borderUnitsFound: [borderId], paintMixesTried: [mixId], lampMixesTried: [mixId] },
  looked: [{ artId, answers: [string], at }]            // latest 12
}
design: { kind: 'shapes' | 'mirror' | 'border' | 'turn' | 'floor', size, cells | shapes, mirror?, tile?, repeat?, palette }
```

- Validate ids, sizes and color codes; drop an unreadable design and keep the rest.
- A kept sign is never re-checked against an order's asks on load, even if the asks change.
- Export, import, reset and explorer switching include `signs`.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): the **Visual art / design** extension pathway, steps 1 to 5 (observe and shape; color and material; composition; comparing artists' intentions, in Look closely; develop, test and revise a design for a brief); **M5-I** shapes; **M5-II** symmetry and properties; **M5-III** transformations; **M4** repeating patterns; **S6-II** light and reflection, with color mixing; **E4** writing to and for a customer (the open order's own brief).

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Compose a picture from turned and flipped shapes; construct and fold-check a mirror-symmetric design; find and build a repeating unit; tell paint mixing from light mixing. |
| Teaching encounter | Each bench opens with a short worked example, revealed a step at a time (companion text). |
| Contrast | Slide, flip and half turn; up-and-down, across and sloping mirror lines; paint and lamplight. |
| Supported practice | Fold to check and Turn to check marking mismatched squares; the outline in Shapes; the unit box check. |
| New application | Orders with two asks; turn signs; floor tiles; Look closely. |
| Purposeful revisit | Lantern Night's lamplight bench each winter; kept signs in the town scene; *La Garza*'s order in Act III; the flood post order in Act IV. |
| Data boundary | Designs, mixes tried, answers to Look closely, all local. No photos, uploads or names. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`.

| Topic | What the research asks, and how this spec does it |
| --- | --- |
| Lines of symmetry (`mt_hR2Y7NhMSY`) | The learner constructs and fold-checks their own figure, recognition alone is not enough; say "perpendicular to the mirror, equal distance" so sloping lines work; points on the line stay put. The game never mirrors for the child, Fold to check is the test, the sloping mirror is included, the companion says "the same number of squares from the mirror line, straight across at a square corner to it," and on-the-line squares are named. |
| Composing Shapes (`mt_MqqR7VUoz1`) | The skill is fitting, turning and flipping pieces; flat surface; trial and error is an expected stage, not a fault. Shapes bench, with outline filling and no penalty for trying. |
| Patterns & Sequences (`mt_WXW0hjNhph`) | Units beyond AB; a smallest-unit task; extension alone can be visual copying. The supplied borders use ABB, AAB and ABC units and ask for the smallest unit before the child builds. |
| White Light & Colour (`mt_qzGADV-NGe`) | Keep pigment mixing and light mixing distinct, as opposite rules; label colors in text for colorblind learners; elicit predictions with reasons. Two side-by-side benches, named colors everywhere, and a *What will you get?* prediction before each first mix. |
| Reflecting Light (`mt_gLy3ZgZWiN`) | Every surface reflects some light; do not compare the Moon to a mirror. The white wall line says the wall gives back the light that lands on it, and nothing mentions mirrors. |
| Translating and reflecting shapes (`mt_lxaM6iVpdr`) | Older coordinate work. Only flips and turns on the grid here; no coordinate claim. |

Rotational symmetry (`mt_NM5I3yN-Q6`) and Tessellations (`mt_61Nhj8W78f`) are in Marble's refreshed graph but not the pin, and have no research record; the older benches follow their descriptions. Marble has no visual art topics, so the art pathway is an original extension, as the strand map says. Jane's reveal-one-step pattern shaped the worked examples; no Jane code or text is used.

### Hard-prerequisite crosswalk

| Target | Hard prerequisite in `curriculum/marble/dependencies.json` | How it's met |
| --- | --- | --- |
| Lines of symmetry | 2-D shapes, age 8+ (`mt_hRZyKvz1KN`); Transformations on a grid (`mt_SH7QgFl8-v`) | Partly: the Shapes bench names and flips shapes on a grid first. No claim beyond candidate reference. |
| Composing Shapes | 2-D shapes (`mt_KJeEeTutJI`); Combining Simple Shapes (`mt_XjwUlmxdCT`) | Same unit: the shape tray names each shape; the first orders combine two shapes. |
| White Light & Colour | Reflection & Refraction (`mt_PifbJOuXrG`) | Not taught. The lamplight bench is a supplied model with no topic claim. |
| Patterns & Sequences | None hard. | Nothing to meet. |

## Checks for implementation

- Fold to check and Turn to check mark exactly the mismatched squares for each mirror direction and turn, with on-the-line squares never marked.
- The game never fills a square the child didn't paint.
- The smallest-unit check accepts any box that is a smallest repeating unit, starting anywhere in the border.
- Mixes match the two tables; every color shown has its name in text.
- Is it ready? checks only an order's asks and names the ask that isn't met.
- Browser at 320 and 820 px: canvases scale to fit; every paint and shape action has a button alternative to dragging.

## Review asks

- Color science: are the paint and light lines accurate enough, given that real paints vary?
- Artwork licences and images for Look closely.
