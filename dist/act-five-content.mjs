// Original finite story from spec 604 and its sources: act-5.md, the 120 companion (page 5) and the 604 companion.
// Choosing a path is story progress, not assessment. Jobs link only to activities that exist; codes are stored, text is here.
export const actFiveContent={
  title:'Act V · A Question of Your Own',
  question:'The question you are carrying: What will I write on the blank pages?',
  hook:'The last pages are blank, headed *For the next Keeper*. What do you want to find out?',
  opening:{
    short:['The last pages are empty. Across the top Hollis wrote *For the next Keeper*. "So," says {guide}. "What do you want to find out?"'],
    longer:['The rest of the pages come apart all at once, the way a stack of pancakes does when you lift the top one. They\'re blank. Every single one. Pip turns them over, in case Hollis wrote on the backs. Hollis didn\'t. Across the top of the first page is a heading in the long thin handwriting, and nothing else: *For the next Keeper.* "I think that might be you," says Dot. "Or all of us. But mostly you." {guide} sits down on the bakery step. "So," they say. "What do you want to find out?"']
  },
  page:{
    title:'Page 5: For the next Keeper',
    edge:'next',
    reveal:'The rest of the pages come apart all at once. They\'re blank. Across the top of the first one, Hollis has written a heading and nothing else.',
    lines:['*For the next Keeper.* The pages are empty. They\'re waiting for someone to fill them.'],
    guide:'{guide}: "Blank pages are the best kind of invitation."',
    heading:'For the next Keeper',
    scene:'A stack of blank pages lifting apart, one after another. Across the top of the first page, a heading appears in long thin handwriting: For the next Keeper.',
    caption:'The last pages of the parcel.'
  },
  steps:{
    title:'How every project works',
    intro:'Each project has the same six steps. A small project is a whole project too.',
    list:[
      {id:'choose',name:'Choose',does:'Pick a path, or a smaller version of it.',line:'{guide}: "Big or small? Small is a whole project too."'},
      {id:'ask',name:'Ask',does:'Say what you don\'t know yet.',line:'{guide}: "What\'s the one thing we\'d need to find out first?"'},
      {id:'make',name:'Make',does:'Make a first version, using any job.',line:'{guide}: "First versions are supposed to be a bit wobbly. That\'s what they\'re for."'},
      {id:'show',name:'Show',does:'Someone sees it, uses it, or says something about it.',line:null},
      {id:'change',name:'Change',does:'Change one thing, or keep it as it is and say why.',line:'{guide}: "Would you change anything? Keeping it the same is a choice too."'},
      {id:'keep',name:'Keep',does:'Write one thing the project can\'t tell us yet.',line:'{guide}: "What can\'t it tell us yet? Hollis always wrote that bit down."'}
    ],
    switching:'You may change paths or make a path smaller. Nothing is lost when you switch.'
  },
  paths:[
    {id:'night-garden',title:'A night garden',invitation:'"Some flowers only open in the dark. Who visits them?"',
     short:['The orchard keeper says some flowers in her hedge open only at night. Who comes to visit them, when everyone is asleep?'],
     longer:['"There\'s a flower in my hedge," says the orchard keeper, "that\'s shut tight all day. Then at dusk it opens like a little white trumpet, and in the morning it\'s shut again." Nobody in Willowbank has ever stayed up to see who visits it. Pip volunteers immediately. Pip falls asleep at a quarter past eight. "We\'ll need a plan," says {guide}, "and probably a blanket."'],
     keeperNote:'Some flowers open in the evening and are visited by moths and other night insects. Watching at night needs a dim red light, patience and a notebook.',
     jobs:[
      {tier:'Sprout',host:'Living Garden habitat trail',href:'#living',line:'{guide}: "Let\'s look at the hedge by day first. Where are the flowers that are closed?"'},
      {tier:'Seedling',host:null,href:null,line:'The orchard keeper: "Keep notes on the flowers at dusk for a week. Open or shut? Any visitors?"'},
      {tier:'Sapling',host:'Plant investigation',href:'#living/plants',line:'{guide}: "Plan a fair way to find out whether the flowers open because it\'s dark or because it\'s cooler."'}
     ],
     show:"The orchard keeper reads the notes by lantern-light. \"I've lived next to that hedge all my life,\" she says, \"and I never knew it had company.\"",
     limits:[{id:'one-hedge',text:"We only watched one hedge."},{id:'fell-asleep',text:"We fell asleep some nights."},{id:'smallest-visitors',text:"We couldn't see the smallest visitors."}]},
    {id:'gazette',title:'The Willowbank Gazette',invitation:'"Willowbank has a lot of news and no proper newspaper."',
     short:['The librarian made the Gazette for the meeting. Now everyone wants another one. Who will write it?'],
     longer:['Since the meeting, people keep stopping the librarian in the street to ask when the next Gazette is coming out. "I only made it for the meeting," says the librarian, who is secretly delighted. "I can\'t write a whole newspaper by myself." Dot offers to deliver it. Pip offers to draw the pictures. Bramble offers to write a column called *Bramble Was Right*. Nobody has offered to find out what\'s actually happening, which is the main thing.'],
     keeperNote:'A good report says what happened, where, when and who saw it. It keeps what people saw separate from what they think about it. An opinion piece is allowed to argue, and it says so at the top.',
     jobs:[
      {tier:'Sprout',host:'Puppet Notice Printer',href:'#loft/printer',line:'The librarian: "Pick a picture and a headline for the front page."'},
      {tier:'Seedling',host:'Messages for a Reader',href:'#post/messages',line:'The librarian: "Write three sentences about the storm: what happened, where, and when."'},
      {tier:'Sapling',host:'Water Evidence Shelf',href:'#science/evidence',line:'The librarian: "Read the neighbors\' notes about the new wet corner. Write a short report that keeps what people saw separate from what they think."'}
     ],
     show:"Dot delivers the Gazette to every door. By lunchtime there are three letters to the editor, one of them from the magpie.",
     limits:[{id:'few-people',text:"We only asked a few people."},{id:'news-after',text:"Some news happened after we printed."},{id:'column-unchecked',text:"Bramble's column is not checked."}]},
    {id:'sky-night',title:'A sky-watching night',invitation:'"The library has a telescope nobody has used in years."',
     short:['There\'s a telescope in the library attic. It\'s dusty. The miller\'s cat is sitting on it. What could we see?'],
     longer:['Up in the library attic, under a sheet, under a box, under the miller\'s cat, there is a telescope. It has brass legs and a lens cap with a heron drawn on it. "Hollis\'s," says the librarian, quietly. "They used to watch the moon from the mill roof." Nobody has used it since. Pip wants to see the moon. Dot wants to see a planet. Ember wants to see a dragon-shaped star and is very sure there is one.'],
     keeperNote:'The Moon looks different from night to night because we see different amounts of its sunlit side. A planet looks like a steady bright star that moves slowly against the others over many nights.',
     jobs:[
      {tier:'Sprout',host:'Sky notes',href:'#almanac/sky',line:'Pip: "Draw the Moon tonight, the shape it really is. Then draw it again in a few days."'},
      {tier:'Sapling',host:'Sky notes',href:'#almanac/sky',line:'{guide}: "Keep a chart of the Moon\'s shape every clear night for a month. What pattern do you see?"'}
     ],
     show:"On the sky-watching night half the village climbs the mill roof. The miller holds the ladder and does not look down. Ember sees a star that is, if you squint, slightly dragon-shaped.",
     limits:[{id:'cloudy',text:"Some nights were cloudy."},{id:'one-roof',text:"We only watched from one roof."},{id:'blurry',text:"The telescope is old and a bit blurry."}]},
    {id:'travelling-show',title:'A travelling show',invitation:'"Vadoalto has never seen a Willowbank show."',
     short:['Nuria says Vadoalto has never seen a puppet show. Could the Story Loft take one up the river?'],
     longer:['In her last letter, Nuria mentioned, very casually, that Vadoalto has never had a puppet show. Not once. The librarian read that line out loud three times. A travelling show means a show that fits in a boat, puppets that survive a river trip, a story people upstream will understand, and at least a few words in Spanish. "And a heron," says the librarian. "It still needs a heron."'],
     keeperNote:'A show for a new audience has to make sense to people who don\'t know Willowbank. Telling a story to strangers is a good way to find out which bits only made sense to you.',
     jobs:[
      {tier:'Sprout',host:'Story Loft',href:'#loft',line:'The librarian: "Make a short scene for the show. It has to fit in one box."'},
      {tier:'Seedling',host:'Equal Groups',href:'#post/groups',line:'Dot: "Eighteen puppets, three boxes. The same in each, so no box is too heavy."'},
      {tier:'Sapling',host:null,href:null,line:'The librarian: "Write the welcome for the start of the show, in English with a few Spanish words. Nuria will help with the Spanish."'}
     ],
     show:"The boat reaches Vadoalto at dusk. The show plays on the landing. At the end, the Vadoalto baker stands up and asks, loudly, whether there will be another one.",
     limits:[{id:'local-jokes',text:"Some jokes only work in Willowbank."},{id:'spanish-words',text:"We didn't know all the Spanish words."},{id:'one-town',text:"Only one town has seen it so far."}]},
    {id:'courier-route',title:'A new courier route',invitation:'"There must be a quicker way down to Les Saules."',
     short:['Letters to Léon take three days. {courier} thinks there\'s a quicker way. Where could it go?'],
     longer:['Letters to Léon take three days, because they go by the long valley road and wait at every village for the post bag. {courier} is sure there\'s a quicker way. Dot is sure there isn\'t. Bramble says her grandmother\'s ribbons used to go somewhere downstream, and digs out a scrap of old map from her hat. It shows a path nobody uses, along the brook, then up over a little hill. "It might be quicker," says {guide}. "Or it might be a goat track. Let\'s find out."'],
     keeperNote:'A quicker route is only better if it\'s safe in every season you need it. Planning a route means knowing the distance, the time, the ground, and what to do if a way is closed.',
     jobs:[
      {tier:'Sprout',host:'Cartographer\'s Table',href:'#workshop/maps',line:'{courier}: "Help me follow Bramble\'s old path on the map, one turn at a time."'},
      {tier:'Sapling',host:'Same Route, Different Scale',href:'#workshop/scale',line:'The librarian: "Draw the new route at the post office map\'s scale, and mark where it might be closed in spring floods."'}
     ],
     show:"The first letter by the new path reaches Léon the same afternoon. He writes back at once: *Already? Is this a trick?*",
     limits:[{id:'one-season',text:"We only walked it in one season."},{id:'goat',text:"The goat may move."},{id:'spring-floods',text:"We don't know if it floods in spring."}]},
    {id:'sponge-again',title:'The Sponge, again',invitation:'"Somebody should keep watching the low corner."',
     short:['The reeds at the bottom of the orchard are spreading. Is the Sponge coming back? Somebody should keep watching.'],
     longer:['The wet corner at the bottom of the orchard is not quite the same as it was at the meeting. The reeds have spread. There\'s a frog that wasn\'t there before, or possibly the same frog, moving around a lot. The orchard keeper asks whether someone could keep proper notes, "so that whatever we decide next, we decide it knowing something."'],
     keeperNote:'A survey that repeats the same count in the same place over time can show change. One visit is a snapshot; many visits make a record. Hollis\'s ledger was a survey of one post, kept for forty years.',
     jobs:[
      {tier:'Sprout',host:'Living Garden habitat trail',href:'#living',line:'{guide}: "Count the frogs and herons at the low corner today. Then again next week."'},
      {tier:'Seedling',host:'My Count Collection',href:'#living/collection',line:'The orchard keeper: "Mark how far the reeds reach each month, by the fence posts."'},
      {tier:'Sapling',host:null,href:null,line:'The miller: "Design a better flood post for the low corner, so we can read how wet it is after every rain."'}
     ],
     show:"Nuria visits, reads the survey, and says Vadoalto has nothing like it. She asks to copy it.",
     limits:[{id:'daytime',text:"We only counted in daytime."},{id:'few-months',text:"It's only been a few months."},{id:'frogs-hide',text:"Frogs hide."}]}
  ],
  chosen:{
    yours:'This is your project path.',
    earlier:'Your project path comes from an earlier version. Choose a path here to carry on.',
    choose:'Choose this path',
    switchTo:'Choose this path instead',
    jobsTitle:'Jobs for this path',
    jobsIntro:'Any job can make a first version. Some jobs have a place in the garden to practice in. Others happen away from the screen. Every activity stays open, and you can do them in any order.',
    offScreen:'Away from the screen: on paper, outdoors or out loud, with someone to help.',
    ask:'Not sure what to find out first? The Question Bench helps you turn a wonder into a question.',
    askLabel:'Visit the Question Bench',
    askHref:'#workshop/fair'
  },
  project:{
    title:'Your project',
    intro:'Work through the steps in any job, on screen or off. The story never checks or scores your project.',
    made:'I\'ve made a first version',
    madeDone:'First version made.',
    showTitle:'Someone sees it',
    changeTitle:'Change',
    changes:[{id:'changed',text:'We changed one thing.'},{id:'kept',text:'We kept it as it was. Keeping it the same is a choice too.'}],
    changeSave:'Keep this choice',
    changeEarlier:'A choice from an earlier version.',
    keepTitle:'Keep',
    keepIntro:'Choose the card that says what your project can\'t tell us yet.',
    keepSave:'Keep this limit',
    limitEarlier:'A limit from an earlier version.',
    pageTitle:'Your project page',
    pageMade:'First version: made.',
    pageLimit:'What it can\'t tell us yet: {limit}',
    bind:'Bind it into the Keeper\'s Pages',
    bound:'Your project is bound into the Keeper\'s Pages.',
    otherPath:'You chose another path. This project is kept just as you left it.'
  },
  ending:{
    title:'A Question of Our Own',
    short:['Your project goes into the Keeper\'s Pages. On the last line is one thing it can\'t tell us yet. Hollis would have liked that line.'],
    longer:['{guide} helps you bind your project into the Keeper\'s Pages, right behind *For the next Keeper*. Your first version is there, wobbly in places, and the version after it. On the last line you\'ve written the thing your project can\'t tell us yet.','Pip reads that line twice. "Why put the bit you don\'t know?"','"Because the next Keeper will want to know where to start," says {guide}.','The baker, passing with a tray, looks over your shoulder. "Hollis always wrote that bit," he says. "Every page. Drove the miller mad."'],
    seasons:{spring:'The windowsill is empty for the first time all year. The baker puts a geranium there instead.',summer:'You bind the page outside, in the long evening, with Pip holding the corners down.',autumn:'A leaf ends up pressed between your pages. You leave it in.',winter:'You bind the page by the café fire, and Ember breathes on the glue to dry it.'},
    almanac:'*Act V: A Question of Your Own. Our project: {project}. What it can\'t tell us yet: {limit}.*',
    between:'*Nuria\'s letters are getting longer. The last one ends: "We should do this properly. Every week."*',
    scene:'An open book. A new page slides in behind the page headed For the next Keeper, and a line of stitches runs down the spine to hold it.',
    caption:'Your project, bound into the Keeper\'s Pages.',
    reread:'Reread the ending',
    earlierProject:'a project from an earlier version',
    earlierLimit:'a limit from an earlier version',
    pause:'Pause here'
  },
  ui:{
    start:'Continue the story',
    reveal:'Read Page 5',
    reread:'Reread Page 5',
    short:'Short',
    longer:'Longer',
    hear:'Hear this',
    back:'Back to the blank pages',
    paths:'Six project paths',
    open:'Open',
    keepers:'The Keeper\'s Pages',
    explore:'Choose another place',
    village:'Back to the blank pages'
  },
  messages:{
    unreached:'This part of the story opens after the town meeting ends.',
    endUnreached:'This page opens when a project is bound into the Keeper\'s Pages.',
    unreadableAct:'An earlier Act V record can\'t be read by this version. It stays in your notes, unchanged.',
    refused:'That could not be saved. Nothing has changed.',
    badPreference:'An earlier reading preference can\'t be read, so it stays as it was.'
  },
  notes:{line:'Act V: {state}.',details:'Choosing a project path is story progress. It is not a learning result.'}
};
