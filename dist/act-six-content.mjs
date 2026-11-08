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
  rain:{
    title:'The long rain',
    gate:'The long rain comes after the exchange plan is kept.',
    gateLink:'Keep the exchange plan',
    start:{title:'The rain starts',short:["It rains for three days. Upstream, Nuria watches Vadoalto's flood post climb. She writes one line, and Vadoalto's runner sets off."],longer:["It rains for three days. Not storm rain: steady, grey, patient rain that doesn't stop for lunch. Upstream, Nuria watches Vadoalto's flood post climb past the third mark, then the fourth. She does what Hollis taught her. She writes one line on a card, and Vadoalto's fastest runner sets off down the river path.", "In Willowbank, the bell rings. Everyone knows what to do, because they've talked about nothing else for months."],runnerCard:'The brook is rising at Vadoalto. You have until evening.',keeperNote:"Water that rises upstream reaches the towns below some hours later. A post that is read upstream gives the towns downstream time. That's what a warning is: time.",
      scene:'Rain falls on Willowbank. By the brook, the flood post stands in the water, with its old marks above the surface.',caption:'Three days of rain.'},
    prep:{
      title:'Getting ready',
      shelf:{
        title:'Up high and dry',
        prompt:'The baker: "Help me carry the flour up to the attic. Bags on the top shelf, jars on the middle."',
        top:'Top shelf',middle:'Middle shelf',
        items:[{id:'flour-1',label:'A bag of flour',shelf:'top'},{id:'flour-2',label:'Another bag of flour',shelf:'top'},{id:'honey',label:'A jar of honey',shelf:'middle'},{id:'jam',label:'A jar of jam',shelf:'middle'}],
        hintTop:'The baker said bags go on the top shelf.',hintMiddle:'The baker said jars go on the middle shelf.',
        notYet:'Not everything is on the right shelf yet. Read the hint, then try again.',
        check:'Check the shelves',
        kept:'The flour is up high and dry. The baker sits on the top step to get his breath back.'
      },
      jobs:[
        {tier:'Seedling',host:null,href:null,line:'The miller: "It\'s 2 o\'clock. The water should be here by 6. The boards take an hour to put in. When must we start, at the latest?"'},
        {tier:'Sapling',host:'Instructions for a Reader',href:'#post/instructions',line:'The librarian: "Write the notice for the bridge: when to stop crossing, and where to go instead."'}
      ]
    },
    warning:{
      title:'Passing the warning on',
      short:["Dot remembers Les Saules. \"If it's coming here, it's going there next.\" Someone has to tell Léon, in French."],longer:["In the middle of the carrying and the boards and the bell, Dot stops with a sack of letters in her arms. \"Les Saules,\" she says. \"If it's coming here, it's going there next. Somebody has to tell Léon.\" She looks at {courier}. {courier} is already pulling on their boots. \"In French,\" says Dot. \"So everybody there can read it, not just Léon.\""],
      card:{title:'The warning card',english:'The brook is rising. It will reach you tomorrow morning. From Willowbank.',french:'Le ruisseau monte. L’eau arrivera chez vous demain matin. De la part de Willowbank.'},
      send:'Send',
      sent:'{courier} is already halfway down the river path.',
      choose:{
        title:'Which French card says the same?',
        options:[
          {id:'right',text:'Le ruisseau monte. L’eau arrivera chez vous demain matin. De la part de Willowbank.',feedback:'Yes. It says the brook is rising, and it will reach them tomorrow morning.'},
          {id:'down',text:'Le ruisseau baisse. L’eau arrivera chez vous demain matin. De la part de Willowbank.',feedback:'Not this one. *Le ruisseau baisse* means the brook is going down.'},
          {id:'evening',text:'Le ruisseau monte. L’eau arrivera chez vous ce soir. De la part de Willowbank.',feedback:'Not this one. *Ce soir* means this evening. The water reaches them tomorrow morning.'}
        ]
      },
      build:{
        title:'Build it from word cards',
        cards:[{id:'ruisseau',fr:'Le ruisseau',en:'the brook'},{id:'monte',fr:'monte',en:'is rising'},{id:'baisse',fr:'baisse',en:'is going down'},{id:'arrivera',fr:'L’eau arrivera',en:'the water will arrive'},{id:'chez-vous',fr:'chez vous',en:'at your place'},{id:'demain',fr:'demain matin',en:'tomorrow morning'},{id:'soir',fr:'ce soir',en:'this evening'},{id:'de-la-part',fr:'De la part de Willowbank',en:'from Willowbank'}],
        answer:['ruisseau','monte','arrivera','chez-vous','demain','de-la-part'],
        line:'Your card',
        empty:'Tap word cards to build the warning.',
        clear:'Start again',
        check:'Check the card',
        right:'Yes. That is the warning, in French.',
        wrongDown:'*Baisse* means going down. The brook is rising.',
        wrongSoir:'*Ce soir* means this evening. The water reaches Les Saules tomorrow morning.',
        wrongOrder:'Not quite yet. Start with what is happening: *Le ruisseau monte*.'
      }
    },
    water:{
      title:'The water arrives',
      scenes:{'wall':{short:["The water climbs the wall and stops. The orchard stays dry. Downstream, past the wall, it spreads over Léon's meadow."],longer:["The water climbs the new wall and stops. Behind it, the orchard is dry and the mill boards hold. Downstream, past the end of the wall, the water spreads wide over the meadow by Léon's ferry, and the ferry can't run for two days. In this story rain the wall held here, while the ferry meadow flooded. That scene alone cannot tell us how another wall or another storm would behave."]},'sponge':{short:["The water spreads into the low fields and slows. The mill stays dry. Three apple trees stand in water to their knees."],longer:["The water reaches the low fields and spreads out. The reeds bend under it. It slows. The miller watches the post; in this story rain the water stays below the boards. Nobody claims a measured time saving from the tray model. At the low corner, three apple trees stand up to their knees in water. The orchard keeper sighs, and goes to check on the reeds."]},'some-of-each':{short:["The wall turns the water into the wet meadow. The mill boards hold, just. Nobody got everything. Nobody lost everything."],longer:["The wall above the mill turns the water toward the wet meadow, which fills like a bath. The mill boards hold, just. Some of the orchard gets its feet wet. Nobody got everything they wanted. Nobody lost everything, either."]}},
      plain:{short:["The water comes down the brook in the evening, just when the runner said. The boards are in and the flour is up high. The town is ready."],longer:["The water comes down the brook in the evening, just when Vadoalto's runner said it would: brown, fast and full of leaves. It fills the low places and pushes at the banks. The boards are in at the mill. The flour is up high in the baker's attic. Half the village stands where they can see the flood post, and watches the water climb, and climb, and then, after a long while, stop climbing."]},
      offer:"Dot looks at the library wall, where the meeting's plan should be pinned. There is only an empty pin. \"I can't find the plan we kept,\" she says. \"Which was it?\"",
      choices:{wall:'The Wall',sponge:'The Sponge','some-of-each':'Some of Each',none:'Let the water come'},
      pinned:'Dot pins it up, just in time.',
      letCome:'{guide}: "Then let\'s watch what the water does."',
      unreadable:"{guide}: \"The plan from the meeting is on a page this story can't read yet. The water comes all the same.\"",
      ends:"The bridge holds. The mill holds. Everything you mended holds. The miller scratches a new mark on the flood post, and writes the date beside it, and then, after a moment, writes *Warned in time.*",
      scene:'The flood post by the brook. The water climbs past the old marks and stops. A new mark is scratched beside it, with the words Warned in time.',
      caption:'Warned in time.'
    }
  },
  journey:{
    title:'The first journey, and someone new',
    gate:'The first journey comes after the warning is sent.',
    gateLink:'Pass the warning on',
    short:["The rain passes. The first weekly parcel goes up the river under your plan. On the way back, someone tall and grey is walking up the path."],longer:["The rain passes. The brook goes back to being a brook. The first regular parcel goes up the river under your plan: apples, two of Pip's drawings and a honey-cake recipe that Vadoalto says it will improve. {courier} comes back the next evening with reed bundles and a note: *Same time next week?*"],
    pack:{
      title:'Pack the first parcel',
      prompt:"Dot: \"Pack the first parcel. Apples at the bottom, drawings on top, so nothing gets squashed.\"",
      items:[{id:'apples',label:'Apples'},{id:'recipe',label:'A honey-cake recipe'},{id:'drawings',label:'Two of Pip\'s drawings'}],
      parcel:'In the parcel, bottom first',
      empty:'Tap a good to put it in the parcel.',
      notFull:'Put all three goods in first.',
      check:'Tie it up',
      clear:'Unpack',
      bottom:'Apples go at the bottom, so nothing gets squashed.',
      top:'The drawings go on top, so nothing gets squashed.',
      kept:"Packed, labeled and tied with one of Bramble's ribbons. It looks very official."
    },
    jobs:[
      {tier:'Seedling',host:'Cartographer\'s Table',href:'#workshop/maps',line:"{courier}: \"Take me up the Way we planned for this season.\""},
      {tier:'Sapling',host:'Messages for a Reader',href:'#post/messages',line:"Dot: \"Write the note that goes with the first parcel. What's in it, and when the next one comes.\""}
    ],
    send:'Send the first parcel',
    letter:{title:'A letter from Léon',lines:["A tall grey heron came off the coast boat today. They asked about the brook, then walked up the river path. I think they're coming to you! Léon"]},
    home:{title:'Someone comes home',short:["A tall grey heron comes up the river path, stopping to look at the brook. \"Hollis!\" says Nuria."],longer:["On the way back from the landing, you see a tall grey heron coming slowly up the river path, stopping to look at the brook every few steps.", "\"Hollis!\" says Nuria.", "Hollis looks at the flood post for a long time. At the old marks, and the storm mark, and the new one: *Warned in time.* Then at the almanac. Then at you.", "\"I hear my parcel got a bit wet,\" they say."],supper:'They stay for supper.',
      scene:'The river path by the brook. A tall grey heron walks slowly up the path and stops beside the flood post, where the newest mark says Warned in time.',caption:'Someone comes home.'}
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
    badStoryPlan:'Grown-up note: an earlier Act IV plan is kept unchanged; this version shows the plain scene.',
    unreadableAct:'An earlier Act VI record can\'t be read by this version. It stays in your notes, unchanged.',
    refused:'That could not be saved. Nothing has changed.',
    badPreference:'An earlier reading preference can\'t be read, so it stays as it was.',
    earlierPlan:'Your exchange plan comes from an earlier version. Keep a plan here to carry on.',
    unreadablePlan:'An earlier exchange plan can\'t be read by this version. It stays in your notes, unchanged, and everything else is still open.'
  },
  notes:{line:'Act VI: {state}.',details:'Sorting goods, choosing a Way and keeping an exchange plan are story progress. They are not learning results.'}
};
