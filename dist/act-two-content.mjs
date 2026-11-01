// Original finite story text commissioned by spec248; reading is not assessment.
export const actTwoChapters=['market','garden','birthday','show'];
export const actTwoContent={
 title:'A Town of Our Own',label:'Story · Willowbank is an invented town',
 opening:{
  short:["The market is coming back, the garden is changing, and it's nearly Ember's birthday. Pip keeps looking at the map."],
  longer:["The storm is something people talk about now, instead of something they're in. The market is coming back, one stall at a time. The garden is changing with the weather. Someone has heard that it's Ember's birthday soon, and Ember has heard them hearing it. Pip has the map in his satchel. Every so often he takes it out and puts his paw on the green patch marked the Sponge, where the orchard is now. ‘Maps can be wrong,’ says Dot. ‘This one looks very sure of itself,’ says Pip."]
 },
 ui:{
  start:'Join the town gathering',short:'Short',longer:'Longer',original:'Water-stained original · story',hear:'Read this aloud',openingReplay:'Read the town story again',
  instruction:'Choose a way to help. Bring an idea back from a game, then offer it here. Small ideas and work done together belong at the gathering.',
  progress:'Work offered from {n} parts of town.',beforeReady:'Bring something from three different parts of town when you want to celebrate. The games stay open.',ready:'There is something here from three parts of town. The gathering is ready whenever you are.',celebrate:'Celebrate with the town',chooseChapter:'Choose a part of town',offered:'Your idea is here',
  back:'Back to the town gathering',oldMap:'Read the old map again',keepers:'Visit the Keeper\'s Pages',explore:'Keep exploring',pause:'Pause here',hostReturn:'Bring work to the gathering',beforePageOne:'Read the old map with Pip and Dot first. Every game is still open.',
  readSecondPage:'Read the second page',celebrationReplay:'Read the celebration again',letterOffer:'A letter from upstream',openLetter:'Open the letter',letterReplay:'Read the letter again',visitPost:'Visit the Post Office'
 },
 chapters:{
  market:{title:'The weekly market',
   short:["The market is back. The orchard keeper has never heard of the marsh on Pip's map. A stall needs a coin idea."],
   longer:["The stalls are coming back to the green: bread, honey, string, seeds. The orchard keeper turns Pip's map around twice. ‘Marsh? Under my trees?’ she asks. Pip puts the map down beside a market sign. There are other things to think about today too."],
   job:'Try a coin idea at Coin Counter. It can be a first plan, or something to talk through together.',hostLabel:'Visit Coin Counter',hostHref:'#workshop/coins',selector:'Choose a saved coin idea',offer:'Offer this coin idea',after:'Your coin idea is on the market table. There is room to try it another way.',noWork:'Choose a request at Coin Counter, then bring your coin idea back here.'},
  garden:{title:'Keeping a record',
   short:['The garden keeps changing. Dot wants the town to keep records, so there is something to compare next time.'],
   longer:["‘Let's write down what we notice,’ says the librarian. ‘And what we didn't get to notice,’ says Dot. She leaves room on the page. At the mill, someone is wondering what a useful record of the brook would need."],
   job:'Keep a plan at the Town Record. Ready-made words, your own words, and a question left open are all welcome.',hostLabel:'Visit the Town Record',hostHref:'#learn/science/records',selector:'Choose a kept record plan',offer:'Offer this record plan',after:'The town has a place for your record plan. A question can stay open beside it.',noWork:'Keep a plan at the Town Record, then bring it back. It can be unfinished.'},
  birthday:{title:"Ember's birthday",
   short:["It's nearly Ember's birthday. The café has room for a tray idea. Bramble brings ribbons, and a secret."],
   longer:["Ember has mentioned her birthday eleven times this week, always by accident. Bramble arrives with ribbons and starts tying them on chairs, lanterns and Pip. ‘My grandmother taught me,’ she says. ‘She tied them on the old paths, so nobody got lost. Blue for one way, gold for another.’ She ties a bow on the parcel. ‘Mostly I like the colors.’"],
   job:'Keep a tray plan or set out a tray in Whole-batch gathering trays. You can make a batch together there. Bring the idea back for Ember.',hostLabel:'Visit Whole-batch gathering trays',hostHref:'#cafe/batches',selector:'Choose a tray idea',offer:'Offer this tray idea',after:"There is a place for your tray idea at Ember's gathering. You can still change it in the café.",noWork:'Keep a tray plan or offer a tray in Whole-batch gathering trays, then bring the idea back.'},
  show:{title:'The first show',
   short:['The Story Loft is getting a show ready. Dot says the town will need somewhere for everyone to sit.'],
   longer:["There are puppets, a painted backdrop of the footbridge, and a part for a heron that nobody can quite explain. ‘It felt like the story needed one,’ says the librarian. Dot is arranging chairs. The ducks are trying to look invited."],
   job:'Share a show with its audience in Story Loft, then bring it here. A ready-made scene is welcome too.',hostLabel:'Visit Story Loft',hostHref:'#loft',selector:'Choose a shared show',offer:'Offer this shared show',after:"Your shared show is on the gathering's bill. The ducks are taking their seats.",noWork:'Play a show through to Meet the audience in Story Loft, then bring the shared show back.'}
 },
 messages:{
  alreadyOffered:'Your idea is already part of this gathering. Keep exploring or revisit the game whenever you like.',
  unreadableReceipt:'This earlier story contribution cannot be read here. It stays in your notes. Other parts of town are still available.',
  unavailableWork:'Some earlier work cannot be read by this version. It stays in your notes. You can choose another saved idea or another part of town.',
  missingCandidate:'That saved idea is no longer available here. Choose another idea; your earlier work stays.',
  unreadableAct:'This part of your earlier story cannot be continued here. Its original record stays in your notes. The old map and every game remain available.',
  saveRefused:'This story change could not be kept safely. Your earlier work is unchanged. Download your notes or keep exploring.',
  ineligibleCelebration:'The gathering needs ideas from three different parts of town. You can work together or choose another part.',
  unreached:'This page is still drying. Return to the gathering whenever you like.',
  badPreference:'An earlier reading choice stays in your notes. This version is showing Short.'
 },
 notes:{title:'A Town of Our Own · story contributions',description:'These are explicit offers to the story, not skill results. Supplied, supported and unfinished contributions count alike. The original work stays with its activity. A saved story contribution stays reached if that work is later changed or removed.',offered:'Offered',unreadable:'Retained, unreadable contribution',ended:'Celebration reached',notEnded:'Not yet celebrated'},
 celebration:{title:'A Town of Our Own',
  short:['Lanterns, music, a show and too much cake. The second page comes free. And a letter arrives from upstream.'],
  longer:["Willowbank has a celebration, and this time it isn't about mending anything. It's just about being here. There are lanterns and music, a show, Ember's cake and a lot of dancing that the ducks join uninvited.","At the curtain call, the baker asks Dot whether she's staying in Willowbank for good. Dot looks at Pip. Pip looks at the parcel. ‘I already unpacked,’ says Dot. ‘Twice.’","Somewhere in the middle of it, the baker comes over with something in his hand. ‘Second page,’ he says. ‘Came off the windowsill by itself.’"],
  seasons:{spring:'Blossom keeps landing in the lemonade. Nobody minds.',summer:'The party goes on so late that the stars come out over the green.',autumn:'The lanterns are strung through the apple trees by the orchard gate.',winter:'Lanterns, snow, a fire in the middle of the green, and everyone in two scarves.'},
  artDescription:"Lanterns over Willowbank's green and bridge, a bakery window with drying pages, a birthday table and a puppet stage. A post bag waits beside the bridge."
 },
 page:{title:'The flood ledger',reveal:"The second page peels away on its own, the way a leaf comes off a puddle. It's a table of numbers.",
  short:["A list of floods. Each line says a year and how high the brook came up the mill's flood post. At the bottom: Ask upstream."],
  longer:["The page is a table. Each line has a year and a height, measured on the flood post at the mill, where the brook comes over its banks. The earlier entries are small and far apart; several later entries are closer together and higher. They do not rise in every row. At the very bottom, someone has added two words: Ask upstream. ‘Upstream of what?’ says Pip. ‘Upstream of us,’ says Dot. ‘Where the brook comes from.’"],
  originalLabel:'Water-stained original · story',headers:['Year of my keeping',"Height at the mill's flood post (cm)"],rows:[[4,40],[15,60],[27,120],[31,80],[34,120],[36,140],[38,100]],datum:"Heights above the brook's stated ordinary level.",caption:'Seven entries from an invented record. A year without an entry is not a measured zero.',
  original:'Years not written had no flood worth the ink. [smudged word] the gaps grow shorter. Ask upstream.',explanation:"Those are the writer's words about which floods were entered. This copy cannot tell us every unrecorded height.",guideLine:'{guide}: A record can give us a new question. What would you want to ask the town upstream?',
  stormInvitation:"The miller has a fresh mark from the storm: 160 centimeters above the brook's stated ordinary level.",stormButton:'Add the storm to this story ledger',stormResult:'The storm · 160 cm · year not given',stormExplanation:'The later storm is listed separately. These pages do not give it a year of keeping.',
  glossary:{ledger:'a book of records','flood post':'a marked post used here to record how high the brook rose',upstream:'toward where the brook comes from',cm:'centimeters, units of length'}
 },
 letter:{title:'A letter from Vadoalto',invitation:'As the evening ends, {courier} comes up the bridge road with a letter. The stamp is from a town called Vadoalto, up the river. The storm went through there too.',
  short:['Hello, Willowbank! The storm came here too. Our brook rose very high. Can we compare notes? Write back!','Nuria, Vadoalto'],
  longer:['Hello, Willowbank!','The storm came through Vadoalto too. Our flood post says the brook rose higher than anyone here can remember. Did yours? I am learning to keep our post, and I would like to compare notes with whoever keeps yours. Will you write back?','Nuria, apprentice at the flood post, Vadoalto'],
  caption:'An English letter in our invented town story.',close:'Pip reads the bottom of the ledger again. Ask upstream. Then he reads the letter. ‘Well,’ he says. ‘Upstream asked first.’',almanacLine:'Act II: A Town of Our Own. Two pages are dry. Vadoalto has written.',betweenVisits:"Nuria's letter is pinned up at the post office. Dot has read it four times."
 }
};
