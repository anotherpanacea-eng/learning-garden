// Spec 600 · Guide errands. Finite child-facing copy; the companion text in docs/content/600-guide-errands-text.md matches it.
// minAct is the first story act an errand fits. A line that names a later act's person, place or event waits for that act.
const e=(id,to,label,line,minAct=1)=>Object.freeze({id,to,label,line,minAct});
const freeze=x=>Object.freeze(x);

export const ERRAND_UI=freeze({
 region:'Ideas from your guide',
 room:freeze({summary:'Where next? {guide} has an idea.',lead:'Someone in town could use the same idea in a new way.',free:'Every place stays open. Go anywhere you like.'}),
 hub:freeze({summary:'Who needs a hand here?',lead:'{guide} heard a few requests around town.',free:'These are ideas, not jobs. Every place stays open.'}),
});

export const ERRAND_ROOMS=freeze({
 // Thread 1 · the gathering: groups, shares, fractions, batches, budgets.
 '#cafe/groups':freeze({onward:freeze([
  e('groups-to-ribbons','#post/groups','Bundle Bramble’s ribbons','Bramble’s gate ribbons are still knotted from the storm. {guide} thinks the same equal groups would bundle them, with ribbons in place of bites.'),
  e('groups-to-sharing','#cafe/sharing','Pack picnic parcels','The neighbors who helped after the storm are owed a picnic. This time one loaf has to be cut into equal shares, not handed out in groups.'),
 ])}),
 '#cafe/sharing':freeze({onward:freeze([
  e('sharing-to-trail','#cafe/fractions','Place the ribbon flag','A ribbon for the gathering needs its flag in the right spot. {guide} wonders if equal shares can tell us where three quarters of a ribbon ends.'),
  e('sharing-to-recut','#workshop/recut','Change the ribbon cuts','The workshop has ribbon jobs waiting: a half for a lantern window, two thirds for a banner. Can the same amount be cut into different pieces?'),
 ])}),
 '#cafe/fractions':freeze({onward:freeze([
  e('trail-to-recut','#workshop/recut','Change the ribbon cuts','The workshop keeps a ribbon with a brass flag on it. {guide} wants to know what happens when every piece is split in two, but the flag stays put.'),
  e('trail-birthday','#cafe/batches','Plan Ember’s birthday tray','Ember’s birthday is coming, and the café is planning trays for the gathering. One recipe feeds two; how many whole batches for a party?',2),
  e('trail-to-batches','#cafe/batches','Plan a supper tray','Four puppeteers need supper between scenes. One recipe feeds two, so {guide} wonders how many whole batches it takes.'),
 ])}),
 '#cafe/batches':freeze({onward:freeze([
  e('batches-to-budget','#workshop/budget','Choose welcome supplies','The neighbors are setting a pretend welcome table, and the money is short. Now there is a spending limit to keep, as well as amounts to reach.'),
  e('batches-to-groups','#cafe/groups','Set the welcome tables','Pip is planning the welcome-back tables. {guide} points out that copies of a recipe are equal groups too: plates, bites on each, and the total.'),
 ])}),
 '#workshop/budget':freeze({onward:freeze([
  e('budget-market','#workshop/coins','Price a market stall','The weekly market is back, and a stall keeper wants prices she can make with more than one handful of coins.',2),
  e('budget-to-coins','#workshop/coins','Count out practice coins','The pretend market signs need prices. {guide} wonders how many different handfuls of coins can make the very same amount.'),
  e('budget-to-price','#desk/linear','Make Pip a price card','Pip needs a price card for a delivery. A price that grows with distance and also has a starting charge is a new kind of puzzle for the Keeper’s Desk.'),
 ])}),
 '#workshop/coins':freeze({onward:freeze([
  e('coins-to-budget','#workshop/budget','Choose welcome supplies','The welcome table needs place cards, signs and path markers, all inside one spending limit. {guide} says more than one basket might work.'),
  e('coins-to-groups','#cafe/groups','Set the welcome tables','Pip is still planning the welcome-back tables. Counting coins by fives and tens is close to counting bites in equal groups.'),
 ])}),

 // Thread 2 · where the water goes.
 '#science/evidence':freeze({onward:freeze([
  e('evidence-wet-corner','#science/rain','Test the wet corner','The orchard keeper’s low corner is always wet now. Before the town argues about why, {guide} wants to see where rain goes when ground is full.',4),
  e('evidence-to-rain','#science/rain','Follow pretend rain','A picture showed water where it was not before. {guide} wants to move rain tokens and watch where the water goes when the ground is full.'),
  e('evidence-to-plants','#living/plants','Look at the seedlings','The storm damaged the growing shelf. The same careful habit helps there: say what you see before you say why it happened.'),
 ])}),
 '#science/rain':freeze({onward:freeze([
  e('rain-to-chart','#living/notebook/rain','Chart a rain result','Once a rain run is finished, the Field Notebook can turn it into a chart. {guide} says it is the same result, seen a new way.'),
  e('rain-to-evidence','#science/evidence','Look at the water clues','Three made-up pictures show a puddle, a patch of soil and a dish. Which careful explanation fits what each picture actually shows?'),
  e('rain-to-room','#learn/history/river-room','Read about room for a river','The town is arguing about the low fields. Another country once gave its rivers more room. What did they do, and what could Willowbank learn?',4),
 ])}),
 '#living/notebook/rain':freeze({onward:freeze([
  e('chart-to-ledger','#learn/science/ledger','Read Wren’s flood ledger','Wren has set out a flood ledger and a rain tally at the Keeper’s Desk. Charts like yours can help, and so can asking what a record cannot show.',4),
  e('chart-to-collection','#living/collection','Make a count collection','The mending table is getting ready for the lantern walk. Make a pretend button collection and leave a chart another helper can read.'),
  e('chart-to-weather','#almanac/weather','Add to Dot’s weather notes','Dot keeps a note of what stands out in the weather each day. {guide} says a few days of notes can become a chart of your own.'),
 ])}),
 '#living/plants':freeze({onward:freeze([
  e('plants-to-cress','#field/cress','Try two real pots','The garden keeper would like to know if real cress does what the made-up seedlings did. Two pots, one bright and one dim, can tell you.'),
  e('plants-to-evidence','#science/evidence','Look at the water clues','The Water Lab has three made-up pictures of water. {guide} wants to practice the same habit: what does the picture show, and what might explain it?'),
 ])}),
 '#field/cress':freeze({onward:freeze([
  e('cress-to-plants','#living/plants','Look at the seedlings','The made-up seedlings on the growing shelf change over six days. Compare them with what your real pots are doing.'),
  e('cress-to-weather','#almanac/weather','Add to Dot’s weather notes','Plants on the sill feel the weather too. Dot keeps a note of what stands out outside each day.'),
 ])}),
 '#almanac/weather':freeze({onward:freeze([
  e('weather-to-collection','#living/collection','Make a count collection','A pile of notes can become a chart. The mending table needs a chart of its pretend buttons before the lantern walk.'),
  e('weather-to-rain','#science/rain','Follow pretend rain','On a rainy day the water has to go somewhere. {guide} wants to see where it runs when the ground is full.'),
 ])}),
 '#living/collection':freeze({onward:freeze([
  e('collection-to-chart','#living/notebook/rain','Chart a rain result','If you have finished a pretend rain run, the Field Notebook can chart it. You choose the rows that matter and draw the bars yourself.'),
  e('collection-to-weather','#almanac/weather','Add to Dot’s weather notes','Dot’s weather notes are another collection, kept one day at a time. What stands out outside today?'),
 ])}),

 // Thread 3 · words that reach a reader.
 '#post/instructions':freeze({onward:freeze([
  e('instructions-to-printer','#loft/printer','Print a puppet notice','The puppets need notices before the rehearsal. Moving one word or changing the end mark can turn a telling sentence into a question.'),
  e('instructions-to-messages','#post/messages','Mend a letter','Neighbors are sending requests while they mend the town, and some are unclear. Which blanket? Which place? A reader needs to know.'),
 ])}),
 '#loft/printer':freeze({onward:freeze([
  e('printer-to-messages','#post/messages','Mend a letter','Rabbit needs blankets for the café, but his note does not say which ones. {guide} thinks a clearer sentence would help.'),
  e('printer-to-instructions','#post/instructions','Write directions for a reader','Rabbit has asked Dot to seal an invitation in an envelope. Steps in the wrong order can go very wrong for a reader who does exactly what you say.'),
 ])}),
 '#post/messages':freeze({onward:freeze([
  e('messages-two-letters','#post/register','Write two thank-you letters','Reed seeds have arrived from Vadoalto. Nuria gets a friendly note, and the council gets a formal one. Same thanks, different words.',3),
  e('messages-to-writing','#desk/writing','Help with Dot’s report','Dot’s report is getting long. At the Keeper’s Desk, paragraphs and linking words can lead a reader through it in the right order.'),
  e('messages-to-printer','#loft/printer','Print a puppet notice','The puppet show needs notices too. Word order and the end mark change what a short sentence asks or tells.'),
 ])}),
 '#desk/writing':freeze({onward:freeze([
  e('writing-two-letters','#post/register','Write two thank-you letters','Nuria’s reed seeds need thanking. One friendly note, one formal letter: the request stays the same, but the words change for the reader.',3),
  e('writing-to-messages','#post/messages','Mend a letter','Back at the Post Office, short notes still go astray. {guide} says the same question helps: what does this reader need to know?'),
  e('writing-to-instructions','#post/instructions','Write directions for a reader','A reader who does exactly what the words say is a good test of order. Rabbit’s invitation is waiting at the Post Office.'),
 ])}),

 // Thread 4 · Bramble's ribbons.
 '#post/groups':freeze({onward:freeze([
  e('ribbons-to-groups','#cafe/groups','Set the welcome tables','Pip is planning the welcome-back tables. It is the same puzzle as the ribbons: how many groups, how many in each, and the total.'),
  e('ribbons-to-recut','#workshop/recut','Change the ribbon cuts','The workshop has more ribbon jobs. This time the question is not how many ribbons, but how a single ribbon can be cut into equal pieces.'),
 ])}),
 '#workshop/recut':freeze({onward:freeze([
  e('recut-to-trail','#cafe/fractions','Place the ribbon flag','At the café, a gathering ribbon needs its flag placed. Equal spaces along the ribbon tell you where each fraction lands.'),
  e('recut-to-measures','#workshop/ribbon-measures','Measure Bramble’s ribbons','Bramble is measuring ribbons for the next gathering. How many copies of a small strip fit along a ribbon, and what about the last bit?'),
 ])}),
 '#workshop/ribbon-measures':freeze({onward:freeze([
  e('measures-to-recut','#workshop/recut','Change the ribbon cuts','Splitting a strip to fit the last gap is close to the Ribbon Recut Table, where the amount stays the same while the pieces change.'),
  e('measures-to-trail','#cafe/fractions','Place the ribbon flag','The café’s gathering ribbon needs a flag at three quarters. {guide} says a measuring strip and a fraction flag work in the same way.'),
 ])}),
 '#workshop/same-ground':freeze({onward:freeze([
  e('ground-to-maps','#workshop/maps','Make a map for visitors','The storm scattered the old signs. Market visitors need a map, and a route has a length you can count, a little like a fence.'),
  e('ground-to-scale','#workshop/scale','Redraw a route smaller','A visitor wants a smaller drawing of the same route. {guide} wonders what changes on paper, and what stays the same on the ground.'),
 ])}),

 // Thread 5 · the courier's routes.
 '#workshop/maps':freeze({onward:freeze([
  e('maps-to-scale','#workshop/scale','Redraw a route smaller','A visitor wants a smaller drawing of the walk from the Post Office to the garden. Change the key and see what the drawing does.'),
  e('maps-upstream','#post/clock-walk','Time the courier’s walk upstream','The courier is setting off up the river to Vadoalto. A map shows the way; a clock walk shows how long it takes.',3),
  e('maps-to-clock','#post/clock-walk','Time a courier walk','The courier carries notes all over town. A map shows where to walk; a clock walk shows how long the walk takes.'),
  e('maps-to-ground','#workshop/same-ground','Fence the orchard plot','The orchard keeper needs a plot, but fence wire is short. The same tiles can make a different fence.'),
 ])}),
 '#workshop/scale':freeze({onward:freeze([
  e('scale-to-maps','#workshop/maps','Make a map for visitors','Back at the Cartographer’s Table, market visitors still need a map. Place the marks and count the steps of two routes.'),
  e('scale-to-path','#numbers/path','Walk to Willow Bridge','The stones from the garden gate to Willow Bridge are evenly spaced. {guide} says equal steps cover equal distances, at any scale.'),
 ])}),
 '#post/clock-walk':freeze({onward:freeze([
  e('clock-to-price','#desk/linear','Make Pip a price card','Pip wants to charge for deliveries: so much to start, and so much more for each bit of distance. The Keeper’s Desk has price cards to try.'),
  e('clock-to-maps','#workshop/maps','Make a map for visitors','A courier needs to know where as well as when. Market visitors need a map with routes you can count.'),
 ])}),
 '#desk/linear':freeze({onward:freeze([
  e('price-to-clock','#post/clock-walk','Time a courier walk','The courier’s deliveries take time as well as money. A clock reading tells when; elapsed minutes tell how long.'),
  e('price-to-budget','#workshop/budget','Choose welcome supplies','A price card shows one cost. The welcome table has several things to buy and one spending limit to keep.'),
 ])}),
 '#numbers/path':freeze({onward:freeze([
  e('path-to-groups','#cafe/groups','Set the welcome tables','Counting stones one by one is a good start. At the café, Pip is counting bites in equal groups for the welcome-back tables.'),
  e('path-to-maps','#workshop/maps','Make a map for visitors','The path to Willow Bridge could go on a map. Market visitors need one, with routes you can count step by step.'),
 ])}),
});

// Place pages: later acts first, so an explorer further on sees those before the lines that fit from the start.
export const ERRAND_HUBS=freeze({
 '#cafe':freeze([
  e('cafe-birthday','#cafe/batches','Plan Ember’s birthday tray','Ember’s birthday is coming. The café wants trays for the gathering, planned in whole batches.',2),
  e('cafe-market','#workshop/coins','Price a market stall','The weekly market is back. A stall keeper wants prices she can make with more than one handful of coins.',2),
  e('cafe-tables','#cafe/groups','Set the welcome tables','Pip is planning the welcome-back tables: how many plates, and how many bites on each?'),
  e('cafe-picnic','#cafe/sharing','Pack picnic parcels','The neighbors who helped after the storm are owed a picnic, cut into fair shares.'),
  e('cafe-flag','#cafe/fractions','Place the ribbon flag','A ribbon for the gathering needs its flag in just the right place.'),
 ]),
 '#science':freeze([
  e('science-wet-corner','#science/rain','Test the wet corner','The orchard keeper’s low corner is always wet now. Where does rain go when the ground is full?',4),
  e('science-rain','#science/rain','Follow pretend rain','Rain keeps finding the low path. Move rain tokens and see where the water goes.'),
  e('science-clues','#science/evidence','Look at the water clues','Three made-up pictures show water where it was not before. What does each one really show?'),
  e('science-window','#science/window','Look at a cold window','The baker’s window fogs up on cold mornings. Where do those drops come from?'),
 ]),
 '#workshop':freeze([
  e('workshop-market','#workshop/coins','Price a market stall','The weekly market is back, and a stall needs prices made in more than one way.',2),
  e('workshop-budget','#workshop/budget','Choose welcome supplies','The neighbors want a welcome table, but there is a spending limit to keep.'),
  e('workshop-recut','#workshop/recut','Change the ribbon cuts','Ribbon jobs are waiting: a half for a lantern window, two thirds for a banner.'),
  e('workshop-fence','#workshop/same-ground','Fence the orchard plot','The orchard keeper needs a plot, but fence wire is short.'),
  e('workshop-map','#workshop/maps','Make a map for visitors','The storm scattered the old signs. Market visitors need a map.'),
 ]),
 '#post':freeze([
  e('post-two-letters','#post/register','Write two thank-you letters','Reed seeds arrived from Vadoalto. Nuria gets a friendly note; the council gets a formal one.',3),
  e('post-upstream','#post/clock-walk','Time the courier’s walk upstream','The courier is setting off up the river to Vadoalto. How long will the walk take?',3),
  e('post-ribbons','#post/groups','Bundle Bramble’s ribbons','The storm knotted every ribbon on Bramble’s gate. She needs them bundled, the same in each.'),
  e('post-letters','#post/messages','Mend a letter','Neighbors are sending requests while they mend the town, and some are not clear yet.'),
  e('post-directions','#post/instructions','Write directions for a reader','Rabbit has asked Dot to seal an invitation. A reader will do exactly what the steps say.'),
  e('post-clock','#post/clock-walk','Time a courier walk','The courier is carrying notes to the lantern makers. How long between leaving and arriving?'),
 ]),
 '#living':freeze([
  e('living-shelf','#living/plants','Look at the seedlings','The storm damaged the growing shelf. What might light change about a seedling?'),
  e('living-buttons','#living/collection','Make a count collection','The mending table needs a chart of its pretend buttons before the lantern walk.'),
  e('living-chart','#living/notebook/rain','Chart a rain result','A finished pretend rain run can become a chart in the Field Notebook.'),
  e('living-feeding','#living/who-eats','Sort who eats what','Fourteen animals need sorting by what they eat, not by how big they look.'),
 ]),
 '#desk':freeze([
  e('desk-ledger','#learn/science/ledger','Read Wren’s flood ledger','Wren has set out a flood ledger and a rain tally. What do the records show, and what can they not show?',4),
  e('desk-river','#learn/history/river-room','Read about room for a river','The town is arguing about the low fields. Another country once gave its rivers more room.',4),
  e('desk-price','#desk/linear','Make Pip a price card','Pip needs a price card for a delivery: a starting charge, and so much more for each bit of distance.'),
  e('desk-report','#desk/writing','Help with Dot’s report','Dot’s report needs paragraphs and linking words so a reader can follow it.'),
  e('desk-river-early','#learn/history/river-room','Read about room for a river','The librarian has made a new book about a country that gave its rivers more room.'),
 ]),
});
