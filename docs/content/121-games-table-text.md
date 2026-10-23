# The Games Table: all child-facing text

Companion to [spec 121](../specs/121-games-table.md). Use as written, after the same independent review. `{guide}` is the explorer's chosen companion. Pip is a fox (he/him), Dot a ladybug (she/her), Bramble a girl witch (she/her) with a magpie. Lines marked `[check]` state real history and need a source check before build. Nothing here is scored.

## Arriving

**Place title:** The Games Table

**First visit:**
> Under the old pear tree at the edge of the orchard, someone has set up a little table with a ribbon-tied box on it. Bramble is sitting on the far side. Her magpie is sitting on the box.
>
> "Market days are long," says Bramble. "So I brought games. Proper ones, where you have to think. Sit down. You can choose how hard I try."

**Later visits:** Bramble is at the Games Table. "Back for another? The magpie has been practising."

**Link from the market scene:** Bramble has set up a Games Table under the pear tree.

**Link from the orchard hub:** The Games Table

## Choosing a game

**Heading:** What shall we play?

| Game | Card line |
| --- | --- |
| Seed Pile | Take turns taking seeds. Take the last one to win. |
| Ribbon Rows | Two rows of ribbons. Take from one row at a time. |
| Shutters | Roll the dice and shut the shutters. Just you, with Bramble watching. |
| Seed Holes | Sow seeds around the board and fill your store. |
| Hex | Link your two sides of the board before Bramble links hers. |

**Variant buttons (Seed Pile):** Take 1, 2 or 3 · Take 1 or 2 · Last seed loses
**Variant buttons (Ribbon Rows):** Two rows · Three rows
**Variant buttons (Shutters):** Small box, 1 to 6 · Full box, 1 to 9

## Bramble's dial

**Heading:** How hard should Bramble try?

| Setting | Label | Bramble's line |
| --- | --- | --- |
| `sleepy` | Bramble is sleepy | "I was up late tying ribbons. I'll just take whatever." |
| `attention` | Bramble is paying attention | "If I can win right now, I will. Otherwise I'm guessing." |
| `plan` | Bramble has a plan | "I've been thinking about this game for a long time." |

**Default:** Bramble is paying attention.

**Change offered mid-game:** You can change how Bramble plays when this game ends.

## Who goes first

**Heading:** Who goes first?
**Buttons:** I'll go first · Bramble goes first

**One-time note (Seed Pile and Ribbon Rows only):**
> In this game, going first or second can decide who wins, if both players play their very best. Finding out why is part of the fun. Bramble explains it on her page, when you want to look.

## Seed Pile

**Setup heading:** How many seeds in the pile?
**Start buttons:** 9 · 13 · 15 · 17 · 20 · Choose a number
**Choose a number:** Any number from 5 to 30.
**Your turn:** Take 1, 2 or 3 seeds. (Take 1 or 2 seeds.)
**Take buttons:** Take 1 · Take 2 · Take 3
**Pile line:** {n} seeds left.
**After Bramble's turn:** Bramble took {n}. {m} seeds left.

**Ending lines:**
- You took the last seed. You win this one!
- Bramble took the last seed. Bramble wins this one.
- (Last seed loses) Bramble had to take the last seed. You win this one!
- (Last seed loses) You had to take the last seed. Bramble wins this one.

**Bramble's comments**, one at random after some of her turns, never after the child's:

| Dial | Lines |
| --- | --- |
| sleepy | "Mm. That many." · "Is it my turn? I'll take some." · "The magpie chose that one." |
| attention | "I'm watching for the end." · "If you leave me three, I'll take three." |
| plan | "I'm counting backwards from the end. Don't tell my magpie." · "I like the number I just left you." · "Hm. You left me a number I don't like." (only when Bramble is in a losing position) |

**Origin card (Seed Pile and Ribbon Rows):** `[check]`
> Games where players take turns taking things away are very old, and people play them all over the world with stones, sticks or seeds. In 1901, a mathematician called Charles Bouton named one of them *Nim* and worked out the secret for winning it with any number of rows.

## Ribbon Rows

**Setup heading:** How many ribbons in each row?
**Setup buttons:** Deal me some rows · Set the rows myself
**Set the rows:** Each row can have 1 to 7 ribbons.
**Your turn:** Tap a ribbon. You'll take that one and every ribbon after it in the same row.
**Confirm:** Take {n} from this row · Choose again
**Ending lines:** You took the last ribbon. You win this one! · Bramble took the last ribbon. Bramble wins this one.

**Bramble's comments:**

| Dial | Lines |
| --- | --- |
| sleepy | "Some from this row. Why not." · "Ribbons are ribbons." |
| attention | "One row's empty? Then I'll take the other one." |
| plan | "I like it when the rows match." · "Whatever you do, I'll do the same." · "Three rows. I'm doing bundles in my head." |

**Act III, on *La Garza*'s deck (River Market link):**
> Teo has laid out two rows of rope knots on the deck. "*Dos filas*," he says. "Two rows. You take from one row. Who takes the last knot wins." Marisol rolls her eyes. "He always wants to go second."

**Spanish number card (on deck):** *uno, dos, tres, cuatro, cinco, seis, siete* · one to seven. *Dos filas* means two rows. *Tu turno* means your turn. (Fluent-reader check with spec 117's text.)

## Shutters

**Setup heading:** Small box or full box?
**Rule card:** Roll the dice. Shut shutters that add up to your roll: one shutter, or two, or more. When the open shutters add up to 6 or less, you roll just one die. The game ends when no open shutters can make the roll.
**Roll button:** Roll
**Shut button:** Shut these
**Choice prompt:** You rolled {n}. Which shutters will you shut?
**Ways panel (toggle, off by default):** Show me the ways to make {n}
**Ways line:** You could shut: {list of ways}
**Ending, all shut:** Every shutter is shut! That doesn't happen often.
**Ending, some left:** No open shutters make {n}. These are still open: {list}. They add up to {sum}.
**Play again:** Roll again with a fresh box

**Bramble's comments** (she doesn't play; she watches):
- "Nine and two, or eight and three, or the eleven way. Choices, choices."
- "I always shut the big ones while I still can. Big numbers are harder to roll later."
- "The dice don't care how clever you are. That's what I like about this one."
- (Only when all shut) "You did it! I've only done that a handful of times."

**Origin card (Shutters):** `[check]`
> Shutters is based on a dice game called Shut the Box. Families and friends have played it for a long time, especially in Europe, but nobody is sure where it began.

## Seed Holes

**Rule card:**
> Choose one of your holes. Pick up all its seeds and drop one in each hole as you go round, anticlockwise. Drop one in your own store when you pass it, but skip Bramble's store.
> If your last seed lands in your store, you go again.
> If your last seed lands in an empty hole on your side, and Bramble's hole across from it has seeds, put all of those seeds and your last seed in your store.
> When one side has no seeds left, each player puts the seeds on their own side in their store. Most seeds in the store wins.

**Your turn:** Choose one of your holes.
**Extra turn:** Your last seed landed in your store. Go again!
**Capture:** Your last seed landed in an empty hole. You get the {n} seeds across from it, too.
**Ending lines:** Your store: {a}. Bramble's store: {b}. You win this one! · … Bramble wins this one. · … A draw! Equal stores.

**Bramble's comments:**

| Dial | Lines |
| --- | --- |
| sleepy | "This hole looks nice." |
| attention | "Last seed in my store, so I get another go." |
| plan | "I'm counting seeds four moves ahead." · "I'm keeping that hole empty on purpose." |

**Origin card:** `[check]`
> Mancala is the name for a big family of sowing games. People have played them across Africa and in western Asia for hundreds of years, with many names and rules, such as oware in West Africa and bao in East Africa. The rules here are a small modern version, close to a game called Kalah. If you know a mancala game from your own family, its rules are just as real.

## Hex

**Rule card:**
> Take turns putting a ribbon knot on any empty hexagon. Your knots are gold. Bramble's are green. You want a chain of gold from the left side to the right side. Bramble wants a chain of green from top to bottom. Whoever links their sides first wins.

**Your turn:** Choose an empty hexagon.
**Ending lines:** Your gold chain links left to right. You win this one! · Bramble's green chain links top to bottom. Bramble wins this one.

**Bramble's comments:**
- "Every knot I place blocks you and helps me. That's the trick of this game."
- "Let me see. Where's your shortest way across?"

**Origin card:** `[check]` Hex was invented by Piet Hein, a Danish designer and poet, in 1942, and again on his own by the American mathematician John Nash in 1948.

**Why can't Hex end in a draw?** (older page)
1. "Here's a tiny board, 3 by 3. Try to fill every hexagon so that nobody wins."
2. (After the child fills it) "Somebody won, didn't they? Try once more if you like."
3. "Here's the reason. To stop gold crossing left to right, green has to build a wall of knots from top to bottom. And a wall of green from top to bottom is exactly a green win."
4. "So when the board is full, one of you has always linked your sides. Hex never ends in a draw."

## Bramble explains: Seed Pile

One step per tap. Button: **Next**. Last button: **Test it**.

1. "Let's start at the end, where it's easy. If there are 1, 2 or 3 seeds left on your turn, you take them all. You win."
2. "Now 4. Take 1 and I take 3. Take 2 and I take 2. Take 3 and I take 1. Whatever you do, I take the last seed. 4 is a bad number to have on your turn."
3. "5, 6 or 7? Take enough to leave me 4. Now I'm stuck."
4. "8 is bad again. Whatever you take, I can leave you 4."
5. "Here are the bad numbers so far: 4 and 8. Can you guess the next one?"
   - Choices: 10 · 12 · 16
   - On 12: "Yes. Whatever you take from 12, I take enough to make 4 together. That leaves you 8."
   - On 10: "From 10, you can take 2 and leave me 8. So 10 is a good number for you. Try another."
   - On 16: "16 is bad, too, but there's one before it. Try another."
6. "So my plan is: leave a number in the four times table. If I can't, I take one seed and hope you slip."

**Test it:**
> I'll set up some piles. On each one, take the number of seeds that leaves me stuck. Then we'll play it out.
- Positions: 6 (take 2), 11 (take 3), 9 (take 1), 15 (take 3), 8 (no good move: "Any move! This is a bad number to start from. Choose one and see how I answer.").
- After each: "That leaves me {n}. Let's play it out." Then a normal game from there.

**When the rule changes** (take 1 or 2):
> "Try my old rule here: leave a multiple of 4. Does it still work?" After one game: "When you can only take 1 or 2, the bad numbers are 3, 6, 9, 12. The gap is one more than the most you can take. With 1, 2 or 3, the gap was 4."

**Last seed loses:**
> "Now nobody wants the last seed. So the bad number to have is 1. Work backwards again: which numbers are bad now?" Answer revealed on tap: "1, 5, 9, 13. One more than the four times table."

## Bramble explains: Ribbon Rows

1. "Two rows, the same length. Your turn."
2. "Whatever you take from one row, I take the same from the other. The rows match again."
3. "Keep going and the rows keep matching, until you take the last few from one row and I take the last few from the other. I take the last ribbon."
4. "So my plan is: make the rows match. If they already match on my turn, I'm in trouble."

**Test it:** Rows 5 and 3 (take 2 from the five), 7 and 2 (take 5 from the seven), 4 and 4 (no good move), 6 and 1 (take 5 from the six).

**Three rows (older page):**
1. "With three rows, matching is harder. So I think in bundles of 4, 2 and 1."
2. "Every row breaks into bundles. 7 is 4 and 2 and 1. 6 is 4 and 2. 5 is 4 and 1. 3 is 2 and 1."
3. "Count the bundles of each size across all three rows. If every size comes in pairs, the player whose turn it is can be beaten."
4. "Rows of 1, 2 and 3: 1 is a one. 2 is a two. 3 is a two and a one. That's two ones and two twos. All pairs. Bad for whoever's turn it is."
5. "On my turn, I take ribbons so every size comes in pairs again."

**Test it, three rows:** 1, 2, 4 (take 1 from the four, leaving 1, 2, 3); 3, 5, 7 (take 1 from any row: 2, 5, 7 or 3, 4, 7 or 3, 5, 6); 2, 4, 6 (no good move). Each answer is checked by the game, which accepts any move that leaves all sizes in pairs.

## Bramble explains: Shutters

1. "Shutters has no sure way to win. The dice decide a lot."
2. "But some choices make the next roll easier. Say you roll 9. You could shut the 9, or the 5 and the 4, or the 6, 2 and 1."
3. "If you shut lots of small shutters, the big ones are left. And big numbers need big rolls. Late in the game, when you roll one die, you can't make anything over 6."
4. "Let's test two habits on the same 20 rolls. Habit A: shut the biggest shutter you can. Habit B: shut as many small shutters as you can."
5. (After the side-by-side replay) "With these rolls, Habit A had {a} left open and Habit B had {b}. One set of rolls can be lucky, though."
6. "People have worked out the best play over every possible roll. With the full box, even perfect play shuts every shutter only about 1 game in 10. Habit A comes very close to perfect. Habit B shuts the box only about 1 game in 100." `[check: figures computed for this spec]`

## Design a pile game (older page)

**Heading:** Make your own pile game
**Setup:** Players can take from 1 up to {k} seeds. · The last seed wins / The last seed loses.
**Table prompt:** For each number of seeds, is it good or bad to have on your turn? Start at 0 and work up.
**Cell buttons:** Good for me · Bad for me
**Checked cell, fits:** Yes.
**Checked cell, doesn't fit:** Look again. From {n}, can you leave your rival a bad number?
**Final prompt:** What rule did you find? (Write it in your own words. Nobody marks this.)
**Keep button:** Keep my rule

## Who should go first? (older page)

**Prompt:** Here are the rows. If both players play their best, who wins: the player who goes first, or second?
**Buttons:** First · Second
**After choosing:** Let's find out. Play it against Bramble's plan. You can go {first/second}, the way you predicted would win.
**After the game, either result:** Did the game go the way you predicted? If not, where did it change?

## Keep a note

**Prompt:** Keep a note about this game?
**Stems:** I won when I left… · Bramble won because… · Next time I'll try… · I noticed…
**Free text placeholder:** finish the sentence (optional)
**Buttons:** Keep my note · Not this time
**Kept:** Kept. Your notes are in the Games Table notebook.

**Notebook heading:** My game notes
**Empty notebook:** No notes yet. You can keep one after any game.

## Lantern Night table (winter festival)

> The Games Table has moved indoors for Lantern Night. Bramble has a lantern on each corner. "Seed Pile, festival rules," she says. "I've chosen this year's pile: {n} seeds. You choose who goes first."

`{n}` rotates through 21, 22, 23, 24 by year, so the festival pile is new each year.

## Off-screen invitations

- Play Seed Pile with real buttons, coins or pebbles with someone at home. Teach them Bramble's plan, or keep it a secret for a while.
- Make a tiny Hex board on squared paper by drawing hexagons, or just play on dots. Two pencils, two colors.
- Ask a grown-up if they know a game with seeds, stones or holes from their own family.

Off-screen invitations record nothing.

## Grown-up notes

- Seed Pile and Ribbon Rows are versions of Nim. Every position is either winning or losing for the player to move, and the explains pages teach the child to find which by working backwards. The three-row bundle rule is the binary-digit (nim-sum) rule, taught without the word.
- Shutters with best play shuts the full box about 10% of the time and the small box about 22% (computed for this spec). Losing is the usual ending, and the text treats it that way.
- The dial sets Bramble's strength. Nothing records wins, losses or which setting the child chose beyond the last one used.
