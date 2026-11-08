// Original finite story from spec 606 and its sources: act-6.md, letters.md (letter 6, English) and the 606 companion.
// Sorting goods, choosing a Way and keeping the exchange plan are story progress, not assessment.
export const actSixContent={
  title:'Act VI · The Opening of the Ways',
  question:'The question the town is carrying: Is the town ready, and who is the Keeper?',
  hook:'Willowbank and Vadoalto want to keep the Ways open for good. Then the rain starts, and it doesn\'t stop.',
  letter:{
    title:'A letter from Nuria',
    short:['Let\'s trade every week, for good! Apples up the river, reed down. Letters both ways. Who carries what? Nuria'],
    longer:['Dear Willowbank,','We have been talking, here in Vadoalto. Our bakers want your apples. Your basket-makers want our reed. Everybody wants your café\'s honey cake, which seems unfair, since the honey is ours. So let\'s do it properly: every week, for good, not just when somebody remembers. We will need to decide who carries what, and which Way, and what to do when a Way is closed. I am coming down on Thursday with a list.','Nuria']
  },
  opening:{
    short:['Nuria writes: let\'s trade every week, for good. Goods down the river, news and seeds up. Who carries what, and which way?'],
    longer:['Nuria\'s letter is the longest yet, and it has a list. Vadoalto\'s bakers want apples. Willowbank\'s basket-makers want reed. Both towns want news, seeds and, for some reason, Pip\'s drawings. "Let\'s do it properly," she writes. "Every week, for good. Not just when somebody remembers." Dot reads the letter out at the post office and then stands very straight, because a weekly exchange is a post office matter. "We\'ll need to decide who carries what," she says, "and which Way, and what happens when a Way is closed."']
  },
  exchange:{
    title:'Choose a partner and a purpose',
    short:['Vadoalto wants apples. Willowbank wants reed. Everybody wants honey cake. What should go each way?'],
    longer:['Nuria comes down the river path with a list and a jar of honey, and sits at the café with Dot, the orchard keeper and the baker. "Our bakers want your apples," she says. "Your basket-makers want our reed. Everybody wants your café\'s honey cake, which seems unfair, since the honey is ours." The baker says the cake is mostly the baking. Nuria says the cake is mostly the honey. They agree to call it a joint cake. By the end of the afternoon there\'s a list of what goes down the river, what goes up, and a note at the bottom in Dot\'s writing: *letters both ways, always.*'],
    keeperNote:'A fair exchange means both sides get something they need. It doesn\'t mean both sides send the same amount of the same thing.',
    sort:{
      title:'Sort the goods',
      prompt:'Nuria: "Sort the goods. What goes up the river to us, and what comes down to you?"',
      up:'Up the river to Vadoalto',
      down:'Down to Willowbank',
      items:[
        {id:'apples',label:'Apples',way:'up',hint:'Vadoalto\'s bakers want the apples.'},
        {id:'reed',label:'Reed bundles',way:'down',hint:'Willowbank\'s basket-makers want the reed.'},
        {id:'honey',label:'A jar of honey',way:'down',hint:'Nuria says the honey is Vadoalto\'s, so it comes down the river.'},
        {id:'drawings',label:'Pip\'s drawings',way:'up',hint:'Vadoalto wants Pip\'s drawings, for some reason.'}
      ],
      notYet:'Not every pile is right yet. Read the hint under a good, then try again.',
      kept:'Two piles, one for each town. Pip tries to put himself in the up pile.'
    },
    jobs:[
      {tier:'Seedling',host:null,href:null,line:'The orchard keeper: "Four bundles of reed for six baskets of apples, every week. How many apples for ten bundles?"'},
      {tier:'Sapling',host:'Messages for a Reader',href:'#post/messages',line:'Dot: "Write the opening of our agreement: what each town sends and why it matters to them."'}
    ]
  },
  routes:{
    title:'Compare routes and keep a plan',
    short:['Three Ways go to Vadoalto. Each one is good for something and bad for something. Which way, and how often?'],
    longer:['Dot unrolls the post office map on the café table and weighs the corners down with honey jars. "Three Ways," she says, tapping each one. "The river path is fastest, but it floods. The bridge road is slow, but it\'s always dry. The high ford is short, and only safe in summer." Bramble leans over. "My grandmother used to say the ford is for people in a hurry who like wet feet." "So which do we use?" says Pip. "Depends," says Dot. "On the season. And the parcel. And whether it\'s raining. Which it usually is."'],
    keeperNote:'A good plan says what happens when something goes wrong. A plan that only works on a sunny day is half a plan.',
    scene:'The post office map on the café table, held flat by honey jars. Three Ways run from Willowbank to Vadoalto: the river path beside the brook, the bridge road in a long loop, and the high ford straight across the water.',
    caption:'Three Ways to Vadoalto.',
    ways:[
      {id:'river',label:'The river path',about:'Fastest, but it floods.',feedback:'The river path is fastest, but it floods. A parcel that must stay dry would rather be slow.'},
      {id:'bridge',label:'The bridge road',about:'Slow, but always dry.',feedback:null},
      {id:'ford',label:'The high ford',about:'Short, and only safe in summer.',feedback:'The high ford is short, but it means wet feet. A parcel that must stay dry would rather be slow.'}
    ],
    puzzle:{
      title:'Which Way?',
      prompt:'Dot: "This parcel must stay dry. Which Way should it take: the river path, the bridge road, or the high ford?"',
      kept:'The bridge road. Slow, dry and very boring, which is what a dry parcel wants.'
    },
    jobs:[
      {tier:'Seedling',host:null,href:null,line:'Dot: "{courier} leaves at 9 with only letters. The river path takes 3 hours each way. When will they be back?"'},
      {tier:'Sapling',host:null,href:null,line:'Dot: "Plan a week of deliveries so both towns get what they need, and nobody uses the high ford in winter."'}
    ],
    keep:{
      title:'Keeping the plan',
      prompt:'Keep this exchange plan?',
      choices:{keep:'Keep it',smaller:'Make it smaller',later:'Not yet'},
      kept:'Nuria will get a copy. So will Bramble, who says she\'s only reading it for the ribbons.',
      smaller:'{guide}: "One Way, once a week, apples up and reed down. We can grow it later."',
      later:'The map stays on the table. Come back to it whenever you like.',
      yours:'Your exchange plan is kept.',
      yoursSmall:'Your smaller exchange plan is kept: one Way, once a week.'
    }
  },
  ui:{
    start:'Continue the story',
    short:'Short',
    longer:'Longer',
    hear:'Hear this',
    back:'Back to the Ways',
    chapters:'Chapters',
    jobsTitle:'Jobs for this chapter',
    jobsIntro:'Any job is a whole contribution. Some have a place in the garden to practice in. Others happen away from the screen. Every activity stays open.',
    offScreen:'Away from the screen: on paper, outdoors or out loud, with someone to help.',
    check:'Check the piles',
    keepers:'The Keeper\'s Pages',
    explore:'Choose another place'
  },
  messages:{
    unreached:'This part of the story opens after a project is bound into the Keeper\'s Pages.',
    unreadableAct:'An earlier Act VI record can\'t be read by this version. It stays in your notes, unchanged.',
    refused:'That could not be saved. Nothing has changed.',
    badPreference:'An earlier reading preference can\'t be read, so it stays as it was.',
    earlierPlan:'Your exchange plan comes from an earlier version. Keep a plan here to carry on.'
  },
  notes:{line:'Act VI: {state}.',details:'Sorting goods, choosing a Way and keeping an exchange plan are story progress. They are not learning results.'}
};
