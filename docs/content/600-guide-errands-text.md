# 600 · Guide errands: finite text

Companion to [spec 600](../specs/600-guide-errands.md). Every child-facing string in `dist/guide-errands-content.mjs`, in order. `{guide}` is the explorer's chosen guide (Mira, Rowan or Ari). "Shows" is the first act an errand fits; later-act lines are listed before the start-of-story line for the same room, and only the first that fits is shown.

## Strip copy

| Where | Summary (closed) | Lead | Hear button | Footer |
|---|---|---|---|---|
| Room | Where next? {guide} has an idea. | Someone in town could use the same idea in a new way. | Hear these ideas | Every place stays open. Go anywhere you like. |
| Place page | Who needs a hand here? | {guide} heard a few requests around town. | Hear the requests | These are ideas, not jobs. Every place stays open. |

Region label: Ideas from your guide. The Hear button reads the lead, then each shown line, with the guide named.

## Onward errands on rooms

### The serving bench · `#cafe/groups`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Bundle Bramble’s ribbons | Bramble’s gate ribbons are still knotted from the storm. {guide} thinks the same equal groups would bundle them, with ribbons in place of bites. | Bramble’s ribbon bench `#post/groups` |
| from the start | Pack picnic parcels | The neighbors who helped after the storm are owed a picnic. This time one loaf has to be cut into equal shares, not handed out in groups. | The Sharing Counter `#cafe/sharing` |

### The Sharing Counter · `#cafe/sharing`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Place the ribbon flag | A ribbon for the gathering needs its flag in the right spot. {guide} wonders if equal shares can tell us where three quarters of a ribbon ends. | Fraction Trail `#cafe/fractions` |
| from the start | Change the ribbon cuts | The workshop has ribbon jobs waiting: a half for a lantern window, two thirds for a banner. Can the same amount be cut into different pieces? | Ribbon Recut Table `#workshop/recut` |

### Fraction Trail · `#cafe/fractions`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Change the ribbon cuts | The workshop keeps a ribbon with a brass flag on it. {guide} wants to know what happens when every piece is split in two, but the flag stays put. | Ribbon Recut Table `#workshop/recut` |
| Act II on | Plan a party tray | The café still makes trays like the ones for Ember’s birthday. One recipe feeds two, so how many whole batches does a party need? | Whole batches for a gathering `#cafe/batches` |
| from the start | Plan a supper tray | Four puppeteers need supper between scenes. One recipe feeds two, so {guide} wonders how many whole batches it takes. | Whole batches for a gathering `#cafe/batches` |

### Whole batches for a gathering · `#cafe/batches`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Choose welcome supplies | The neighbors are setting a pretend welcome table, and the money is short. Now there is a spending limit to keep, as well as amounts to reach. | Gathering Budget `#workshop/budget` |
| from the start | Set the welcome tables | Pip is planning the welcome-back tables. {guide} points out that copies of a recipe are equal groups too: plates, bites on each, and the total. | The serving bench `#cafe/groups` |

### Gathering Budget · `#workshop/budget`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act II on | Price a market stall | The weekly market is back, and a stall keeper wants prices she can make with more than one handful of coins. | The Coin Counter `#workshop/coins` |
| from the start | Count out practice coins | The pretend market signs need prices. {guide} wonders how many different handfuls of coins can make the very same amount. | The Coin Counter `#workshop/coins` |
| from the start | Make Pip a price card | Pip needs a price card for a delivery. A price that grows with distance and also has a starting charge is a new kind of puzzle for the Keeper’s Desk. | The Courier’s Price `#desk/linear` |

### The Coin Counter · `#workshop/coins`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Choose welcome supplies | The welcome table needs place cards and signs, all inside one spending limit. {guide} says more than one basket might work. | Gathering Budget `#workshop/budget` |
| from the start | Set the welcome tables | Pip is still planning the welcome-back tables. Counting coins by fives and tens is close to counting bites in equal groups. | The serving bench `#cafe/groups` |

### Water Evidence Shelf · `#science/evidence`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act IV on | Test the wet corner | The orchard keeper’s low corner is always wet now. Before the town argues about why, {guide} wants to see where rain goes when ground is full. | Rain Paths `#science/rain` |
| from the start | Follow pretend rain | A picture showed a smaller puddle. {guide} wants to move rain tokens and watch where the water goes when the ground is full. | Rain Paths `#science/rain` |
| from the start | Look at the seedlings | The storm damaged the growing shelf. The same careful habit helps there: say what you see before you say why it happened. | Seedlings after the storm `#living/plants` |

### Rain Paths · `#science/rain`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Chart a rain result | Once a rain run is finished, the Field Notebook can turn it into a chart. {guide} says it is the same result, seen a new way. | Rain charts `#living/notebook/rain` |
| from the start | Look at the water clues | Three made-up before-and-after pictures show changing water clues: a puddle, a patch of soil and a dish. Which careful explanation fits what each one actually shows? | Water Evidence Shelf `#science/evidence` |
| Act IV on | Read about room for a river | The town is arguing about the low fields. Another country once gave its rivers more room. What did they do, and what could Willowbank learn? | Room for the River `#learn/history/river-room` |

### Rain charts · `#living/notebook/rain`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act IV on | Read Wren’s flood ledger | Wren has set out a flood ledger and a rain tally at the Keeper’s Desk. Charts like yours can help, and so can asking what a record cannot show. | The ledger and the rain gauge `#learn/science/ledger` |
| from the start | Make a count collection | The mending table is getting ready for the lantern walk. Make a pretend button collection and leave a chart another helper can read. | My Count Collection `#living/collection` |
| from the start | Add to Dot’s weather notes | Dot keeps a note of what stands out in the weather each day. {guide} says a few days of notes can be counted up in a tally. | Dot’s weather notes `#almanac/weather` |

### Seedlings after the storm · `#living/plants`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Try two real pots | The garden keeper would like to know if real cress does what the made-up seedlings did. Two pots, one bright and one dim, can tell you. | Two pots, two kinds of light `#field/cress` |
| from the start | Look at the water clues | The Water Lab has three made-up before-and-after pictures of water clues. {guide} wants to practice the same habit: what does the picture show, and what might explain it? | Water Evidence Shelf `#science/evidence` |

### Two pots, two kinds of light · `#field/cress`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Look at the seedlings | The made-up seedlings on the growing shelf change over six days. Compare them with what your real pots are doing. | Seedlings after the storm `#living/plants` |
| from the start | Add to Dot’s weather notes | Plants on the sill feel the weather too. Dot keeps a note of what stands out outside each day. | Dot’s weather notes `#almanac/weather` |

### Dot’s weather notes · `#almanac/weather`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Make a count collection | A pile of notes can become a chart. The mending table needs a chart of its pretend buttons before the lantern walk. | My Count Collection `#living/collection` |
| from the start | Follow pretend rain | On a rainy day the water has to go somewhere. {guide} wants to see where it runs when the ground is full. | Rain Paths `#science/rain` |

### My Count Collection · `#living/collection`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Chart a rain result | If you have finished a pretend rain run, the Field Notebook can chart it. You choose the rows that matter and draw the bars yourself. | Rain charts `#living/notebook/rain` |
| from the start | Add to Dot’s weather notes | Dot’s weather notes are another collection, kept one day at a time. What stands out outside today? | Dot’s weather notes `#almanac/weather` |

### Instructions for a reader · `#post/instructions`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Print a puppet notice | The puppets need notices before the rehearsal. Moving a word and choosing a question mark can turn a telling sentence into a question. | Puppet Notice Printer `#loft/printer` |
| from the start | Mend a letter | Neighbors are sending requests while they mend the town, and some are unclear. Which blanket? Which place? A reader needs to know. | The letter-mending desk `#post/messages` |

### Puppet Notice Printer · `#loft/printer`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Mend a letter | Rabbit needs blankets for the café, but his note does not say which ones. {guide} thinks a clearer sentence would help. | The letter-mending desk `#post/messages` |
| from the start | Write directions for a reader | Rabbit has asked Dot to seal an invitation in an envelope. Steps in the wrong order can go very wrong for a reader who does exactly what you say. | Instructions for a reader `#post/instructions` |

### The letter-mending desk · `#post/messages`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act III on | Write two thank-you letters | Reed seeds have arrived from Vadoalto. Nuria gets a friendly note, and the council gets a formal one, each written for its own reader. | Two Letters `#post/register` |
| from the start | Help with Dot’s report | Dot’s report is getting long. At the Keeper’s Desk, paragraphs and linking words can lead a reader through it in the right order. | The Writing Table `#desk/writing` |
| from the start | Print a puppet notice | The puppet show needs notices too. Word order and the end mark change what a short sentence asks or tells. | Puppet Notice Printer `#loft/printer` |

### The Writing Table · `#desk/writing`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act III on | Write two thank-you letters | Nuria’s reed seeds need thanking. One friendly note and one formal letter, each written for its own reader. | Two Letters `#post/register` |
| from the start | Mend a letter | Back at the Post Office, short notes still go astray. {guide} says the same question helps: what does this reader need to know? | The letter-mending desk `#post/messages` |
| from the start | Write directions for a reader | A reader who does exactly what the words say is a good test of order. Rabbit’s invitation is waiting at the Post Office. | Instructions for a reader `#post/instructions` |

### Bramble’s ribbon bench · `#post/groups`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Set the welcome tables | Pip is planning the welcome-back tables. It is the same puzzle as the ribbons: how many groups, how many in each, and the total. | The serving bench `#cafe/groups` |
| from the start | Change the ribbon cuts | The workshop has more ribbon jobs. This time the question is not how many ribbons, but how a single ribbon can be cut into equal pieces. | Ribbon Recut Table `#workshop/recut` |

### Ribbon Recut Table · `#workshop/recut`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Place the ribbon flag | At the café, a gathering ribbon needs its flag placed. Equal spaces along the ribbon tell you where each fraction lands. | Fraction Trail `#cafe/fractions` |
| from the start | Measure Bramble’s ribbons | Bramble is measuring ribbons for the next gathering. How many copies of a small strip fit along a ribbon, and what about the last bit? | Ribbon Measures `#workshop/ribbon-measures` |

### Ribbon Measures · `#workshop/ribbon-measures`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Change the ribbon cuts | Splitting a strip to fit the last gap is close to the Ribbon Recut Table, where the amount stays the same while the pieces change. | Ribbon Recut Table `#workshop/recut` |
| from the start | Place the ribbon flag | The café’s gathering ribbon needs a flag at three quarters. {guide} says a measuring strip and a fraction flag work in the same way. | Fraction Trail `#cafe/fractions` |

### Same ground, different fence · `#workshop/same-ground`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Make a map for visitors | The storm scattered the old signs. Market visitors need a map, and a route has a length you can count, a little like a fence. | Cartographer’s Table `#workshop/maps` |
| from the start | Redraw a route smaller | A visitor wants a smaller drawing of the same route. {guide} wonders what changes on paper, and what stays the same on the ground. | Same route, different scale `#workshop/scale` |

### Cartographer’s Table · `#workshop/maps`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Redraw a route smaller | A visitor wants a smaller drawing of the walk from the Post Office to the garden. Change the key and see what the drawing does. | Same route, different scale `#workshop/scale` |
| Act III on | Time the courier’s walk upstream | The courier is setting off up the river to Vadoalto. A map shows the way; a clock walk shows how long it takes. | Courier Clock Walk `#post/clock-walk` |
| from the start | Time a courier walk | The courier carries notes all over town. A map shows where to walk; a clock walk shows how long the walk takes. | Courier Clock Walk `#post/clock-walk` |
| from the start | Fence the orchard plot | The orchard keeper needs a plot, but fence wire is short. The same tiles can make a different fence. | Same ground, different fence `#workshop/same-ground` |

### Same route, different scale · `#workshop/scale`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Make a map for visitors | Back at the Cartographer’s Table, market visitors still need a map. Place the marks and count the steps of two routes. | Cartographer’s Table `#workshop/maps` |
| from the start | Walk to Willow Bridge | The stones from the garden gate to Willow Bridge are evenly spaced. {guide} says equal steps cover equal distances, at any scale. | The path to Willow Bridge `#numbers/path` |

### Courier Clock Walk · `#post/clock-walk`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Make Pip a price card | Pip wants to charge for deliveries: so much to start, and so much more for each bit of distance. The Keeper’s Desk has price cards to try. | The Courier’s Price `#desk/linear` |
| from the start | Make a map for visitors | A courier needs to know where as well as when. Market visitors need a map with routes you can count. | Cartographer’s Table `#workshop/maps` |

### The Courier’s Price · `#desk/linear`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Time a courier walk | The courier’s deliveries take time as well as money. A clock reading tells when; elapsed minutes tell how long. | Courier Clock Walk `#post/clock-walk` |
| from the start | Choose welcome supplies | A price card shows one cost. The welcome table has several things to buy and one spending limit to keep. | Gathering Budget `#workshop/budget` |

### The path to Willow Bridge · `#numbers/path`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Set the welcome tables | Counting stones one by one is a good start. At the café, Pip is counting bites in equal groups for the welcome-back tables. | The serving bench `#cafe/groups` |
| from the start | Make a map for visitors | The path to Willow Bridge could go on a map. Market visitors need one, with routes you can count step by step. | Cartographer’s Table `#workshop/maps` |

## Errands on place pages

At most three are shown, later acts first, one per destination.

### `#cafe`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act II on | Plan a party tray | The café still makes trays like the ones for Ember’s birthday, planned in whole batches. | Whole batches for a gathering `#cafe/batches` |
| Act II on | Price a market stall | The weekly market is back. A stall keeper wants prices she can make with more than one handful of coins. | The Coin Counter `#workshop/coins` |
| from the start | Set the welcome tables | Pip is planning the welcome-back tables: how many plates, and how many bites on each? | The serving bench `#cafe/groups` |
| from the start | Pack picnic parcels | The neighbors who helped after the storm are owed a picnic, cut into fair shares. | The Sharing Counter `#cafe/sharing` |
| from the start | Place the ribbon flag | A ribbon for the gathering needs its flag in just the right place. | Fraction Trail `#cafe/fractions` |

### `#science`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act IV on | Test the wet corner | The orchard keeper’s low corner is always wet now. Where does rain go when the ground is full? | Rain Paths `#science/rain` |
| from the start | Follow pretend rain | Rain keeps finding the low path. Move rain tokens and see where the water goes. | Rain Paths `#science/rain` |
| from the start | Look at the water clues | Three made-up before-and-after pictures show changing water clues. What does each one really show? | Water Evidence Shelf `#science/evidence` |
| from the start | Look at a cold window | The baker’s window fogs up on cold mornings. Where do those drops come from? | Cold Window, Same Water `#science/window` |

### `#workshop`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act II on | Price a market stall | The weekly market is back, and a stall needs prices made in more than one way. | The Coin Counter `#workshop/coins` |
| from the start | Choose welcome supplies | The neighbors want a welcome table, but there is a spending limit to keep. | Gathering Budget `#workshop/budget` |
| from the start | Change the ribbon cuts | Ribbon jobs are waiting: a half for a lantern window, two thirds for a banner. | Ribbon Recut Table `#workshop/recut` |
| from the start | Fence the orchard plot | The orchard keeper needs a plot, but fence wire is short. | Same ground, different fence `#workshop/same-ground` |
| from the start | Make a map for visitors | The storm scattered the old signs. Market visitors need a map. | Cartographer’s Table `#workshop/maps` |

### `#post`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act III on | Write two thank-you letters | Reed seeds arrived from Vadoalto. Nuria gets a friendly note; the council gets a formal one. | Two Letters `#post/register` |
| Act III on | Time the courier’s walk upstream | The courier is setting off up the river to Vadoalto. How long will the walk take? | Courier Clock Walk `#post/clock-walk` |
| from the start | Bundle Bramble’s ribbons | The storm knotted every ribbon on Bramble’s gate. She needs them bundled, the same in each. | Bramble’s ribbon bench `#post/groups` |
| from the start | Mend a letter | Neighbors are sending requests while they mend the town, and some are not clear yet. | The letter-mending desk `#post/messages` |
| from the start | Write directions for a reader | Rabbit has asked Dot to seal an invitation. A reader will do exactly what the steps say. | Instructions for a reader `#post/instructions` |
| from the start | Time a courier walk | The courier is carrying notes to the lantern makers. How long between leaving and arriving? | Courier Clock Walk `#post/clock-walk` |

### `#living`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| from the start | Look at the seedlings | The storm damaged the growing shelf. What might light change about a seedling? | Seedlings after the storm `#living/plants` |
| from the start | Make a count collection | The mending table needs a chart of its pretend buttons before the lantern walk. | My Count Collection `#living/collection` |
| from the start | Chart a rain result | A finished pretend rain run can become a chart in the Field Notebook. | Rain charts `#living/notebook/rain` |
| from the start | Sort who eats what | Fourteen animals need sorting by what they eat, not by how big they look. | The Feeding Board `#living/who-eats` |

### `#desk`

| Shows | Button | Line | Goes to |
|---|---|---|---|
| Act IV on | Read Wren’s flood ledger | Wren has set out a flood ledger and a rain tally. What do the records show, and what can they not show? | The ledger and the rain gauge `#learn/science/ledger` |
| Act IV on | Read about room for a river | The town is arguing about the low fields. Another country once gave its rivers more room. | Room for the River `#learn/history/river-room` |
| from the start | Make Pip a price card | Pip needs a price card for a delivery: a starting charge, and so much more for each bit of distance. | The Courier’s Price `#desk/linear` |
| from the start | Help with Dot’s report | Dot’s report needs paragraphs and linking words so a reader can follow it. | The Writing Table `#desk/writing` |
| from the start | Read about room for a river | The librarian has made a new book about a country that gave its rivers more room. | Room for the River `#learn/history/river-room` |
