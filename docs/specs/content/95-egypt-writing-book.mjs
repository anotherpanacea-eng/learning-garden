// Proposed, unregistered authoring data for spec 95. All child-facing prose is original.
// The passages are modern summaries of The Met's records, not ancient quotations.
export const egyptWritingBookPack = {
  id:'egypt-writing-book',version:1,title:'A writing book at Lucie’s stall',
  stories:[
    {
      id:'egypt-reusable-board',destination:'bookstall',title:'The board that could be used again',
      invitation:'Lucie opens a book about a real wooden writing board from ancient Egypt. What can an old object tell us?',
      passages:{
        1:[
          'Lucie opens a book about a real writing board from ancient Egypt.',
          'The wooden board has a pale coating called whitewash, with writing on it.',
          'The Met dates the board to about 2030 BCE, long before the Paris flood of 1910.',
          'Museum researchers think a learner practiced writing on it because the signs have uneven shapes and spacing.',
          'A learner could wipe or scrape off ink and add whitewash to use the board again.',
          'This is our modern summary of The Met’s record for object 28.9.5, not the learner’s own story.'
        ],
        2:[
          'Lucie opens a book about a real writing board from ancient Egypt.',
          'The wooden board has a pale coating called whitewash, with writing on it.',
          'The Met dates the board to about 2030 BCE, long before the Paris flood of 1910.',
          'Museum researchers think a learner practiced writing on it because the signs have uneven shapes and spacing.',
          'An apprentice is someone learning a skill. The record does not name this learner or give their age.',
          'A learner could wipe or scrape off ink and add whitewash to use the board again.',
          'This is our modern summary of The Met’s record for object 28.9.5, not the learner’s own story.'
        ],
        3:[
          'Lucie opens a book about a real writing board from ancient Egypt.',
          'The wooden board has a pale coating called whitewash, with writing on it.',
          'The Met dates the board to about 2030 BCE, long before the Paris flood of 1910.',
          'A surviving object is one kind of evidence about the past.',
          'The photograph shows the board today; the museum explains how it understands the writing.',
          'Museum researchers think a learner practiced writing on it because the signs have uneven shapes and spacing.',
          'An apprentice is someone learning a skill. The record does not name this learner or give their age.',
          'A learner could wipe or scrape off ink and add whitewash to use the board again.',
          'This is our modern summary of The Met’s record for object 28.9.5, not the learner’s own story.'
        ]
      },
      questions:[
        {type:'mc',title:'Use the board again',readingSkill:'Connect a stated action with a reusable object',
          prompt:'What made this board useful for another round of writing?',
          choices:[
            'Its signs had uneven shapes and spacing.',
            'It could receive another coat of whitewash.',
            'The Met dates it to about 2030 BCE.'
          ],answer:1,
          hint:'Find the sentence that tells what someone could do after removing old ink.',
          explanation:'The same wooden board could receive whitewash again after its ink was removed. Uneven signs and an approximate date tell us different things.',
          talk:'What can you write on and use again today? What is similar, and what is different?',
          helper:'egypt-board-reuse'},
        {type:'mc',title:'A clue to practice',readingSkill:'Name the clue behind an attributed interpretation',
          prompt:'Why do the museum researchers think a learner practiced on this board?',
          choices:[
            'The board could receive another coat of whitewash.',
            'The Met dates the board to about 2030 BCE.',
            'The signs have uneven shapes and spacing.'
          ],answer:2,
          hint:'Find the sentence about what the researchers noticed in the writing.',
          explanation:'The researchers point to uneven signs and spacing as their clue. Recoating explains reuse, and the approximate date says when the object was made.',
          talk:'What would you like to ask that this object record does not answer?',
          helper:'egypt-board-clue'}
      ],connections:[]
    },
    {
      id:'egypt-writing-palette',destination:'bookstall',title:'A place for ink and brushes',
      invitation:'Lucie turns to a real wooden writing palette from ancient Egypt. What did it hold for writing?',
      passages:{
        1:[
          'Lucie’s next page shows a real wooden palette from ancient Egypt.',
          'A scribe is someone trained to write. Scribes used palettes to hold ink and brushes.',
          'The museum lists wood and pigment as the palette’s materials.',
          'The Met dates this palette to about 2030–1550 BCE, an approximate range.',
          'The Met says black ink remains on this palette, while its red ink is almost gone.',
          'Reed brushes had frayed ends to hold ink.',
          'This is our modern summary of The Met’s record for object 10.176.62, not a translation of ancient words.'
        ],
        2:[
          'Lucie’s next page shows a real wooden palette from ancient Egypt.',
          'A scribe is someone trained to write. Scribes used palettes to hold ink and brushes.',
          'The museum lists wood and pigment as the palette’s materials.',
          'The Met dates this palette to about 2030–1550 BCE, an approximate range.',
          'That range is not one known day.',
          'The Met says black ink remains on this palette, while its red ink is almost gone.',
          'Reed brushes had frayed ends to hold ink.',
          'This is our modern summary of The Met’s record for object 10.176.62, not a translation of ancient words.'
        ],
        3:[
          'Lucie’s next page shows a real wooden palette from ancient Egypt.',
          'A scribe is someone trained to write. Scribes used palettes to hold ink and brushes.',
          'The museum lists wood and pigment as the palette’s materials.',
          'The Met dates this palette to about 2030–1550 BCE, an approximate range.',
          'That range is not one known day.',
          'The Met says black ink remains on this palette, while its red ink is almost gone.',
          'The ink left on an object today is not a complete list of everything once used with it.',
          'Reed brushes had frayed ends to hold ink.',
          'The museum’s description helps us connect the surviving palette with its use.',
          'This is our modern summary of The Met’s record for object 10.176.62, not a translation of ancient words.'
        ]
      },
      questions:[
        {type:'mc',title:'What the palette held',readingSkill:'Distinguish an object’s use from its materials and surviving traces',
          prompt:'According to the passage, what two things did scribes use palettes to hold?',
          choices:[
            'Ink and brushes used when writing.',
            'Wood and pigment named as materials.',
            'Black ink still left on this object.'
          ],answer:0,
          hint:'Find the sentence about what scribes used palettes to hold. A trace left today is a different detail.',
          explanation:'The passage says scribes used palettes to hold ink and brushes. Wood and pigment describe materials; ink left today does not name everything palettes held.',
          talk:'What keeps your writing tools together?',
          helper:'egypt-pouch-contents'},
        {type:'mc',title:'Keep both ink details',readingSkill:'Keep two stated source details together',
          prompt:'Which sentence keeps both parts of The Met’s ink description?',
          choices:[
            'Red ink remains, while black ink is almost gone.',
            'The record says nothing about red ink.',
            'Black ink remains, while red ink is almost gone.'
          ],answer:2,
          hint:'Find the sentence naming both colors. Check which one remains and which is almost gone.',
          explanation:'The passage says black ink remains and red is almost gone. Reversing them changes the record; saying it mentions no red leaves out a stated detail.',
          talk:'What can remaining ink tell us, and what can it not show?',
          helper:'egypt-two-colors'}
      ],connections:[]
    }
  ],
  helpers:{
    'egypt-board-reuse':{
      id:'egypt-board-reuse',title:'The label can be used again',
      lesson:'Look for what lets the same surface take new writing.',
      passage:'Pip writes beans on a chalk label. He wipes the word away. Then he writes peas on the same label.',
      model:{type:'text',segments:['Pip writes beans on a chalk label.','He wipes the word away.','Then he writes peas on the same label.'],focus:1,clue:'Wiping the old word leaves the same label ready for new writing.'},
      kind:'choice',prompt:'What lets Pip use the chalk label again?',
      choices:['He wipes away the old word.','He keeps the old word forever.','He needs a new label each time.'],answer:0,
      explanation:'Pip wipes away beans and writes peas on the same label. The label is reused.'
    },
    'egypt-board-clue':{
      id:'egypt-board-clue',title:'A stated clue about trying',
      lesson:'When a passage gives a reason for an idea, find that stated clue rather than guessing a person’s thoughts.',
      passage:'Mira draws spirals on scrap paper. A margin note says, “First try.” The sheet lies beside a lamp.',
      model:{type:'text',segments:['Mira draws spirals on scrap paper.','A margin note says, “First try.”','The sheet lies beside a lamp.'],focus:1,clue:'The margin note directly calls the drawing a first try.'},
      kind:'choice',prompt:'Which detail directly supports calling this a first try?',
      choices:['The sheet lies beside a lamp.','The note says, “First try.”','The drawing is on paper.'],answer:1,
      explanation:'The margin note itself says “First try.” The lamp and paper do not state whether Mira was practicing.'
    },
    'egypt-pouch-contents':{
      id:'egypt-pouch-contents',title:'What is inside the pouch?',
      lesson:'An object’s contents differ from nearby things and from the material used to make it.',
      passage:'A cloth pouch hangs beside a table. It holds two pencils and an eraser. A ruler and cup rest on the table.',
      model:{type:'text',segments:['A cloth pouch hangs beside a table.','It holds two pencils and an eraser.','A ruler and cup rest on the table.'],focus:1,clue:'The middle sentence names what the pouch holds.'},
      kind:'choice',prompt:'What does the pouch hold?',
      choices:['The cloth used to make it.','A ruler and a cup.','Two pencils and an eraser.'],answer:2,
      explanation:'The pouch holds pencils and an eraser. Cloth is its material; the ruler and cup are nearby.'
    },
    'egypt-two-colors':{
      id:'egypt-two-colors',title:'Keep both colors in view',
      lesson:'When two details differ, keep each one with the right color.',
      passage:'Moss looks at two paint pots. The blue pot still holds paint. The orange pot is almost empty.',
      model:{type:'text',segments:['Moss looks at two paint pots.','The blue pot still holds paint.','The orange pot is almost empty.'],focus:1,clue:'Blue still has paint; orange is almost empty.'},
      kind:'choice',prompt:'Which sentence keeps both paint-pot details?',
      choices:['Orange still has paint; blue is almost empty.','Blue still has paint; orange is almost empty.','The passage says nothing about orange.'],answer:1,
      explanation:'The passage says blue still holds paint and orange is almost empty. Reversing them or leaving orange out changes its details.'
    }
  }
};
