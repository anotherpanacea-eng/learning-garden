export const floodAlmanacPack = {
  id:'flood-almanac',version:1,title:'Lucie’s flood almanac',
  stories:[{
    id:'flood-almanac',destination:'bookstall',title:'Three dates beside the Seine',
    invitation:'Lucie opens a short almanac about a real flood in Paris. What do you think a river does after heavy rain?',
    passages:{
      1:[
        'The Seine reached its highest mark at the Austerlitz gauge on 28 January 1910.',
        'On 9 February 1910, the government formed a commission to study the flood.',
        'On 15 March 1910, the Seine returned to its riverbed.',
        'A museum photograph shows floodwater, a boat, and buildings at one Paris quay.',
        'This original summary uses an Archives de Paris chronology and a Musée Carnavalet photograph.',
        'The flood happened in real Paris; our Learning Garden town and skyline are imagined.'
      ],
      2:[
        'The Seine reached its highest mark at the Austerlitz gauge on 28 January 1910.',
        'A museum photograph shows floodwater, a boat, and buildings at one Paris quay.',
        'The photograph shows one place, not every street or anyone’s thoughts.',
        'On 9 February 1910, the government formed a commission to study the flood.',
        'The commission was asked to study causes and ways to lessen future floods.',
        'On 15 March 1910, the Seine returned to its riverbed.',
        'This original summary uses an Archives de Paris chronology and a Musée Carnavalet photograph.',
        'The flood happened in real Paris; our Learning Garden town and skyline are imagined.'
      ],
      3:[
        'On 15 March 1910, the Seine returned to its riverbed.',
        'Now we go back to earlier dates in the flood.',
        'The Seine reached its highest mark at the Austerlitz gauge on 28 January 1910.',
        'A highest mark is one point in a longer event.',
        'A museum photograph shows floodwater, a boat, and buildings at one Paris quay.',
        'The photograph shows one place, not every street or anyone’s thoughts.',
        'On 9 February 1910, the government formed a commission to study the flood.',
        'The commission was asked to study causes and ways to lessen future floods.',
        'The photograph and chronology tell different parts of the same flood.',
        'This original summary uses an Archives de Paris chronology and a Musée Carnavalet photograph.',
        'The flood happened in real Paris; our Learning Garden town and skyline are imagined.'
      ]
    },
    questions:[
      {type:'mc',title:'Find the highest mark',readingSkill:'Find a sentence that answers a detail question',
        prompt:'Which sentence tells us when the Seine reached its highest mark?',
        choices:[
          'On 9 February 1910, the government formed a commission to study the flood.',
          'The Seine reached its highest mark at the Austerlitz gauge on 28 January 1910.',
          'On 15 March 1910, the Seine returned to its riverbed.'
        ],answer:1,
        hint:'Look for the words about a highest mark; the whole passage stays open.',
        explanation:'The Austerlitz sentence gives the highest mark and its date. The other sentences describe later events.',
        talk:'Why might a boat be beside the buildings? What can one photograph not tell us?',
        helper:'flood-almanac-evidence'},
      {type:'order',title:'Dates, not sentence places',readingSkill:'Relate three events by their dates',
        prompt:'Put these three events in date order, even if the passage mentions them in another order.',
        items:[
          'The Seine reached its highest mark',
          'The government formed a flood commission',
          'The Seine returned to its riverbed'
        ],
        hint:'Find each event’s date in the passage. The first sentence in a passage need not be the first event.',
        explanation:'The highest mark came on 28 January. The commission followed on 9 February. The river returned to its bed on 15 March. Dates set the order.',
        talk:'If this almanac had another page, what would you want to learn next?',
        helper:'flood-almanac-sequence'}
    ],
    connections:[{topicId:'mt_VEwM7ClYYE',label:'Relating dated information',scope:'Only ordering three dated pieces of information in one nonfiction passage is practiced. Story retelling, central message, independent reading and mastery remain unobserved.'}]
  }],
  helpers:{
    'flood-almanac-evidence':{
      id:'flood-almanac-evidence',title:'Find a time detail',
      lesson:'A sentence can name both an action and when it happened. Look for the action the question asks about.',
      passage:'On Tuesday, Moss tied a blue ribbon to a paper kite. On Thursday, Pip put it in a box. A bell rang.',
      model:{type:'text',segments:['On Tuesday, Moss tied a blue ribbon to a paper kite.','On Thursday, Pip put it in a box.','A bell rang.'],focus:0,clue:'The Tuesday sentence names Moss’s action and its day.'},
      kind:'choice',prompt:'Which sentence tells when Moss tied the ribbon?',
      choices:['A bell rang.','On Tuesday, Moss tied a blue ribbon to a paper kite.'],answer:1,
      explanation:'The Tuesday sentence names both the ribbon action and the day. The bell sentence gives no time for that action.'
    },
    'flood-almanac-sequence':{
      id:'flood-almanac-sequence',title:'Dates can lead the way',
      lesson:'A story can mention a later day first. Compare the days to find what happened first.',
      passage:'On Friday, Mina hangs a paper moon. On Monday, Mina draws it. On Wednesday, Mina colors it.',
      model:{type:'text',segments:['On Friday, Mina hangs a paper moon.','On Monday, Mina draws it.','On Wednesday, Mina colors it.'],focus:1,clue:'Monday comes before Wednesday and Friday, even though its sentence is second.'},
      kind:'choice',prompt:'Which action happened first by the dates?',
      choices:['Mina draws the moon.','Mina hangs the moon.'],answer:0,
      explanation:'Mina draws the moon on Monday, before coloring it on Wednesday and hanging it on Friday.'
    }
  }
};
