# The Clockwork Mill: all child-facing text

Companion to [spec 123](../specs/123-clockwork-mill.md). Use as written, after the same independent review. `{guide}` is the explorer's chosen companion. Pip is a fox (he/him). The miller is she/her (spec 120). Trundle is a machine and is "it". Nothing here is scored.

## Arriving

**Place title:** The Clockwork Mill

**First visit:**
> Inside the mill, a little wooden cart with brass wheels sits on its side. The miller sets it upright and winds the key in its back. Click, click, click.
>
> "This is Trundle," says the miller. "It carries the sacks. Or it did, before the storm knocked it over. It does exactly what its program drum says, in order. The trouble is, I've forgotten how to set the drum."
>
> {guide} picks up a box of little command tiles. "We could work it out."

**Later visits:** Trundle is wound up and waiting.

**Link from the town map:** The Clockwork Mill
**Link from Repeat a Delivery Block's end screen:** Try a machine that turns: the Clockwork Mill.

## Tiles

| Tile | Label | Details line |
| --- | --- | --- |
| Forward | Forward | Trundle rolls one square the way it's facing. |
| Turn left | Turn left | Trundle turns a quarter turn to its own left, without moving. |
| Turn right | Turn right | Trundle turns a quarter turn to its own right, without moving. |
| Lift | Lift | Trundle picks up a sack from its square. It can carry one. |
| Drop | Drop | Trundle puts its sack down. |
| Repeat | Repeat {n} times | Trundle does the tiles inside the bracket, then does them again, {n} times in all. |
| New move | New move | Make your own move from other tiles. Give it a picture for a name. |
| New move with a number | New move with a number | A new move with a gap for a number. You fill in the number each time you use it. |

**New move names:** star · moon · leaf · acorn
**Number slot label:** how many?

## Controls

| Control | Label |
| --- | --- |
| Run | Run Trundle |
| Step | One step |
| Reset | Back to the start |
| Clear program | Clear the drum |
| Clear confirmation | Take every tile off the drum? · Yes, clear it · Keep it |
| Side table | Side table (new moves) |
| Speed | Slow · Normal |
| Remove tile | Take this tile off |
| Move tile | Move left · Move right |
| Keep | Keep this program |

**Running messages:**
- Trundle is on move {n}.
- Bump! On move {n}, Trundle rolled into a wall. Its program stopped.
- Splash! Nearly. On move {n}, Trundle stopped at the edge of the millpond.
- Bump! On move {n}, Trundle reached the edge of the floor.
- On move {n}, Trundle tried to lift, but there's no sack here.
- On move {n}, Trundle tried to lift, but it's already carrying a sack.
- On move {n}, Trundle tried to drop, but it isn't carrying anything.
- Trundle needs winding up again. That was 300 moves! Check your repeats.
- Trundle stopped here. The miller wanted it over there. (Goal square highlighted.)
- Trundle stopped in the right place, but a sack isn't where it should be. (Sack highlighted.)
- Solved! Trundle did exactly what the miller wanted.

**Miller's hint** (after two runs that don't solve; one per level, below).

## The levels

Each level opens with the miller's request.

### m1. Straight to the door

**Request:** "Roll Trundle straight to the door, please. Just to see if it still works."
**Worked run (first visit only):**
1. "Put one Forward tile on the drum. Now press One step."
2. "See? One square. One tile, one move."
3. "How many more squares to the door?"
**Hint:** Count the squares between Trundle and the door.
**Solved:** "It works! Did you hear it click?"

### m2. Round the corner

**Request:** "Now round the corner to the flour bin."
**Worked run (first visit only):**
1. "Here's Turn right. Put it on and press One step."
2. "Trundle turned to *its own* right. Not yours. If Trundle were facing you, its right would be your left."
3. "Tip: imagine you're sitting in Trundle."
**Hint:** Which way will Trundle be facing after the turn? Try One step to watch.
**Solved:** "Round the corner, like it's been doing it for years."

### m3. One sack

**Request:** "One sack of flour, from the middle of the floor to the door."
**Worked run:** "Lift picks up a sack from the square Trundle is on. So Trundle has to be on the sack's square first."
**Hint:** Where does Trundle need to be when it lifts?
**Solved:** "First delivery since the storm!"

### m4. The long aisle

**Request:** "The long aisle. Eight squares. My thumb gets tired just thinking about all those tiles."
**Worked run (first visit only):**
1. "This is a Repeat tile. Put a Forward inside its bracket."
2. "Set the number to 2. Press Run. Trundle went forward twice."
3. "One Forward tile, and the Repeat does the rest. How many times do you need?"
**Challenge:** Can you do it with just 2 tiles?
**Hint:** Count the squares in the aisle. That's how many times to repeat.
**Solved:** "Trundle reached the end of the aisle. My thumb is grateful."
**Challenge met (shown instead, only when the program used 2 tiles):** "Eight forwards, two tiles. That's the shortest there is. My thumb is grateful."

### m5. Round the millpond

**Request:** "Trundle should go all the way round the millpond and come back to where it started. Don't let it fall in."
**Worked run:** "Look at one side of the pond. Forward, forward, forward, turn. Now look at the next side. Same again?"
**Challenge:** Can you do it with 5 tiles?
**Hint:** One side of the pond is three forwards and a turn. How many sides are there?
**Solved:** "All the way round and home again. Not a splash."
**Older note (after solving, Details):** You can put a Repeat inside a Repeat. Repeat 3 times [Forward] inside Repeat 4 times [… Turn right] makes the same journey.

### m6. The steps

**Request:** "Up the steps to the loft door. Each step is one square along and one square up."
**Worked run:** "Find the part of the path that happens again and again. That's the part to put inside a Repeat."
**Challenge:** Can you do it with 5 tiles?
**Hint:** One step is: forward, turn left, forward, turn right. How many steps are there?
**Solved:** "Up the stairs. Trundle has never been to the loft before."

### m7. Three sacks, one step each

**Request:** "Three sacks in a row. Each one needs to move one square towards the door. Trundle can only carry one at a time."
**Hint:** Do it for the first sack. Does the same group of tiles work for the next one?
**Challenge:** Can you do it with 5 tiles?
**Solved:** "Three sacks, one tidy row."

### m8. The rusty left turn

**Request:** "Oh dear. Trundle's left-turn gear is stuck with rust today. It can only turn right. And the path to the store has a left turn in it."
**Worked run (first visit only):**
1. "Three right turns. Watch what Trundle does."
2. "Three quarter turns to the right ends up facing the same way as one quarter turn to the left."
3. "Let's make that into a new move. Open the side table. Put three Turn right tiles on it. Choose a picture for its name."
4. "Now your new move is a tile, like any other. Use it wherever you need a left turn."
**Hint:** Find the corner where Trundle needs to turn left. Use your new move there.
**Solved:** "Rusty, but it got there. I'll oil that gear tomorrow."

### m9. Go how far?

**Request:** "This route has long bits and short bits. Forward three, forward two, forward four… I keep losing count of the tiles."
**Worked run (first visit only):**
1. "Here's a new move with a number. Put a Repeat on it, with Forward inside, and set the Repeat to *how many?*"
2. "Call it *Go*. Now, when you use it, you choose the number: Go 3, Go 2, Go 4."
**Hint:** Read the route as: go, turn, go, turn. Which number goes with each Go?
**Solved:** "Go 3, go 2, go 4. Much easier to read."

### m10. Fill the store

**Request:** "Three sacks by the wheel, and they all need to go to the store at the other end. And I'd like Trundle to finish back by the wheel, facing the right way, please."
**Hint:** Write the tiles for one sack, there and back. Then repeat them.
**Solved:** "All three sacks in the store and Trundle home. That's a whole morning's work."
**Older note (Details):** Could a new move make your program shorter or easier to read? Try making *Turn around*.

## Pip's programs

**Shelf heading:** Pip's programs (each has one mistake)
**Intro:** Pip has been trying to program Trundle, too. Each of his programs has one mistake. Run it, find where it goes wrong, and fix it with as few changes as you can.

### d1. Pip's steps

**Pip's note:** "I did the steps! Forward, right, forward, left, four times. It should work. Can you check?"
**Run result:** Bump! On move 3, Trundle reached the edge of the floor.
**Hint (on request):** Press One step. Watch which way Trundle turns first.
**Fixed:** "Left first, then right! I had them the wrong way round. Thank you."

### d2. Pip's three sacks

**Pip's note:** "I did the three sacks. I put four repeats, to be safe."
**Run result:** Bump! On move 13, Trundle reached the edge of the floor.
**Hint:** All three sacks moved. What was Trundle trying to do after that?
**Fixed:** "Three sacks, three repeats. Being safe wasn't safe after all."

### d3. Pip's one sack

**Pip's note:** "One sack, easy. Drop, then lift. Or is it lift, then drop?"
**Run result:** On move 3, Trundle tried to drop, but it isn't carrying anything.
**Hint:** What has to happen before Trundle can drop something?
**Fixed:** "Lift, then drop. That's what I meant."

### d4. Pip round the pond

**Pip's note:** "Round the millpond. I'm sure about this one."
**Run result:** Bump! On move 5, Trundle reached the edge of the floor.
**Hint:** Which side of Trundle is the pond on as it goes round?
**Fixed:** "It turned away from the pond, right into the edge. Turning towards it works. Thank you!"

**After all four:** Pip writes on the shelf: "Programmer's rule: when it goes wrong, go one step at a time."

## Level designer (older page)

**Heading:** Design a level for Trundle
**Steps:**
1. How big is the floor? (3 to 8 squares each way)
2. Draw it: walls, millpond, floor, sacks.
3. Where does Trundle start, and which way does it face?
4. Where should Trundle finish? Where should the sacks end up?
5. Now solve your own level. Your level is ready when your program solves it.

**Tools:** Floor · Wall · Millpond · Sack · Trundle's start · Goal · Sack goal · Rubber
**Check button:** Check my level
**Check messages:**
- Put Trundle's start and a goal on the floor first.
- Now write a program that solves your level.
- Your program solved it. Your level is ready!
- Your program didn't solve it yet. Try again, or change the level.
- You changed the level, so it needs solving again.

**Make it tricky (suggestions, never required):**
- Put a sack round a corner.
- Take away one of the turn tiles, like the rusty left turn.
- Add a challenge line: "Can you do it in {n} tiles?" (Check that you can.)

**Shelf:** My levels · Show my solution · Hide my solution

## Off-screen invitations

- Be Trundle! Ask someone at home to give you commands: forward, turn left, turn right. Only do exactly what they say.
- Write a program on paper to get from your bed to the door. Ask someone to follow it exactly.
- Draw a maze on squared paper and write a program for it with a repeat.

Off-screen invitations record nothing.

## Grown-up notes

- Trundle turns relative to itself, which is harder than the compass arrows in Repeat a Delivery Block. The "imagine you're sitting in Trundle" line is the main support.
- New moves are functions; a new move with a number is a function with a parameter. The words *function* and *parameter* appear only here.
- Pip's programs each have one bug, and fixing them counts as solving. Stepping one move at a time is the habit the page is building.
