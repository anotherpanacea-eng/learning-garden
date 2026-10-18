// Original English reading practice in an imaginary errand set in real Paris.
// Lucie, the bookstall, the signs, and the parcel are fictional. No travel knowledge is needed.
export const parisEntrance = {
  id:'paris', chapter:'The Paris Postcard', title:'A story parcel from Paris',
  invitation:'A bookseller in Paris has a parcel of stories for the garden. Can you follow her notes?',
  start:'paris-note',
  ending:{
    title:'A postcard beside the parcel',
    body:'Lucie has a story parcel for the Learning Garden and a blank postcard beside it. Pip and Dot pause to imagine the journey home. There is room on a postcard for a small idea.',
    projectTitle:'A postcard in your own way',
    project:'If you like, tell a postcard message aloud, draw one on paper, or dictate your words to a helper. You might tell the Learning Garden about one moment at Lucie’s bookstall. Or keep the idea for another day.'
  }
};

// Intentionally repeated for inference and evidence; a shared ID lets the host record familiarity.
const rainPassage = [
  'Lucie placed the story pages inside a box.',
  'Rain began tapping on the bookstall roof.',
  'She pulled a waterproof cover over the box before carrying it outside.',
  'Pip could still see the blue ribbon tied around one handle.',
  'Dot tucked her notebook away.'
];
const rainPassageId = 'paris-rain-cover-v1';

export const parisNodes = {
  'paris-note':{
    id:'paris-note',entrance:'paris',type:'task',subject:'Reading',practiceOnly:true,
    readingSkill:'Locate an explicit instruction',passageId:'paris-welcome-note-v1',
    title:'A note at the bookstall',
    body:'Pip and Dot arrive at Lucie’s bookstall in Paris.',
    readingText:[
      'Please bring the green envelope to the bookstall.',
      'Leave the empty basket by the door.',
      'Then wait beside the red chair until Lucie returns with the story parcel.'
    ],
    guide:'{guide} says, “We can separate what to bring from where to wait.”',
    prompt:'What does the note ask Pip to bring?',kind:'choice',
    choices:['The empty basket','The green envelope','The red chair'],answer:1,
    hint:'Look for the object named just after “bring.”',
    explanation:'The first sentence says to bring the green envelope. The basket is to be left by the door, and the red chair marks where to wait.',
    talk:'How does the note help you keep the three jobs separate?',
    next:'paris-reread'
  },
  'paris-reread':{
    id:'paris-reread',entrance:'paris',type:'task',subject:'Reading',practiceOnly:true,
    readingSkill:'Work out a word-part meaning',passageId:'paris-reread-address-v1',
    title:'One more look',
    body:'A small word on Lucie’s next note catches Dot’s attention.',
    readingText:[
      'Lucie asks Dot to reread the address before they close the envelope.',
      'Dot has read it once already, but she looks at the same words again.',
      'Pip holds the envelope open so the address will not be hidden.'
    ],
    guide:'{guide} says, “A word can have smaller parts that carry meaning.”',
    prompt:'In “reread,” what does the word part re- mean?',kind:'choice',
    choices:['Before','Quickly','Again'],answer:2,
    hint:'Here, re- means “again”: reread means read again. Think about what Dot does after her first reading.',
    explanation:'Re- means “again” in reread. Dot has already read the address, then reads it again.',
    talk:'When might it be useful to reread a message?',
    next:'paris-narrow'
  },
  'paris-narrow':{
    id:'paris-narrow',entrance:'paris',type:'task',subject:'Reading',practiceOnly:true,
    readingSkill:'Use context to understand vocabulary',passageId:'paris-narrow-path-v1',
    title:'Room for one',
    body:'Lucie leads the visitors along a little path beside the bookstall.',
    readingText:[
      'The path between the bookstall and the wall was narrow.',
      'Lucie and Pip tried to walk side by side, but there was not enough room.',
      'Pip stepped behind Lucie so they could go along in a single line.',
      'Dot rode on the parcel and made no traffic complaints.'
    ],
    guide:'{guide} says, “Nearby details can help us work out an unfamiliar word.”',
    prompt:'Which meaning of “narrow” fits this passage?',kind:'choice',
    choices:['Not wide','Very slippery','Full of noise'],answer:0,
    hint:'Why does Pip have to walk behind Lucie instead of beside her?',
    explanation:'Narrow means not wide here. There is not enough room to walk side by side, so Pip walks behind Lucie. Those details concern width, not slipperiness or noise.',
    talk:'Which two parts of the passage helped you work out the meaning?',
    next:'paris-infer'
  },
  'paris-infer':{
    id:'paris-infer',entrance:'paris',type:'task',subject:'Reading',practiceOnly:true,
    readingSkill:'Infer a reason from story details',passageId:rainPassageId,
    title:'A cover for the box',
    body:'Lucie gets the parcel ready to carry beyond the bookstall.',
    readingText:rainPassage,
    guide:'{guide} says, “We can connect two details to work out a likely reason.”',
    prompt:'Why did Lucie most likely put the waterproof cover over the box?',kind:'choice',
    choices:['To make the box easier to carry','To hide the blue ribbon from Pip','To keep the story pages dry'],answer:2,
    hint:'Connect the rain with the kind of cover Lucie chooses for the box of pages.',
    explanation:'Rain has started, and Lucie puts a waterproof cover over the box containing the story pages. Together, those details support keeping the pages dry. The cover is not described as a handle, and Pip can still see the ribbon.',
    talk:'Which details did you connect to find a likely reason?',
    next:'paris-evidence'
  },
  'paris-evidence':{
    id:'paris-evidence',entrance:'paris',type:'task',subject:'Reading',practiceOnly:true,
    readingSkill:'Find a sentence that supports an idea',passageId:rainPassageId,
    title:'Point to the evidence',
    body:'The same passage stays open while Pip and Dot look for evidence.',
    readingText:rainPassage,
    guide:'{guide} says, “We can point to the words that support an idea, even when we have read them before.”',
    prompt:'Which sentence shows Lucie taking action to protect the pages?',kind:'choice',
    choices:[rainPassage[2],rainPassage[1],rainPassage[3]],answer:0,
    hint:'Which sentence describes Lucie doing something that would keep water out of the box?',
    explanation:'The waterproof-cover sentence describes Lucie’s protective action. The rain sentence explains the situation, but not how she protects the pages. The ribbon sentence does not show protection from rain.',
    talk:'How does the sentence about the rain help the cover sentence make sense?',
    next:'paris-sequence'
  },
  'paris-sequence':{
    id:'paris-sequence',entrance:'paris',type:'task',subject:'Reading',practiceOnly:true,
    readingSkill:'Sequence events using order words',passageId:'paris-packing-order-v1',
    title:'The parcel in order',
    body:'Lucie writes down how the parcel was packed.',
    readingText:[
      'First, Lucie put the story pages into a box.',
      'Next, Pip tied a blue ribbon around the closed box.',
      'Last, Dot attached a label that said “Learning Garden” to the ribbon.',
      'The finished parcel waited on the counter while Lucie looked for a postcard.'
    ],
    guide:'{guide} says, “Order words can show us what happened first, next, and last.”',
    prompt:'According to this passage, which order is correct?',kind:'choice',
    choices:[
      'Tie the ribbon → put in the pages → attach the label',
      'Put in the pages → tie the ribbon → attach the label',
      'Attach the label → tie the ribbon → put in the pages'
    ],answer:1,
    hint:'Follow the actions after “First,” “Next,” and “Last” in this passage.',
    explanation:'First Lucie puts the pages into the box. Next Pip ties the ribbon. Last Dot attaches the label. All three events and their order are in this passage.',
    talk:'How would the order be harder to follow if those order words were missing?',
    next:'paris-postcard'
  },
  'paris-postcard':{
    id:'paris-postcard',entrance:'paris',type:'project',subject:'Writing',practiceOnly:true,
    title:'A little message home',body:'A blank postcard rests on Lucie’s counter.',
    guide:'{guide} says, “Your message can be told aloud, drawn, or written down by a helper.”',
    prompt:'Optional idea: tell the Learning Garden about one moment at Lucie’s bookstall. You can retell it aloud, draw a postcard on paper, or dictate your words to a helper. You can also keep the idea for later.',
    projectOptions:['Tell a postcard message aloud','Draw a postcard','Dictate a postcard to a helper'],
    talk:'Which moment would you choose for your message, and what would you like the listener or reader to know?',
    next:null
  }
};

export const parisHelpers = {
  'paris-note':{
    id:'paris-help-yellow-cup',title:'Find what to carry',
    lesson:'A short instruction can name both an object and a place. Look at the action and the words beside it.',
    passage:'Carry the yellow cup to the bench. Wait beside the tree.',
    model:{type:'text',segments:['Carry the yellow cup to the bench.','Wait beside the tree.'],focus:0,clue:'The words after “Carry” name the yellow cup; the tree marks where to wait.'},
    kind:'choice',prompt:'What should someone carry?',choices:['The yellow cup','The tree'],answer:0,
    explanation:'“Carry the yellow cup” names what to take. The bench and tree are places in this different instruction.'
  },
  'paris-reread':{
    id:'paris-help-retie',title:'A small part with a meaning',
    lesson:'In retie, re- means “again.” The rest of the word tells what to do again.',
    passage:'Nia ties a bow. The bow comes loose, so she reties it.',
    model:{type:'text',segments:['Nia ties a bow.','The bow comes loose, so she reties it.'],focus:0,clue:'Nia has already tied the bow once. Retie means tie again.'},
    kind:'choice',prompt:'What does “retie” mean here?',choices:['Throw the bow away','Tie the bow again'],answer:1,
    explanation:'Retie means tie again. The loose bow needs another tying. Try the meaning of the same small word part in your waiting message.'
  },
  'paris-narrow':{
    id:'paris-help-sturdy',title:'Let a detail help',
    lesson:'To understand a word, look for a detail showing what the thing is like or what it can do.',
    passage:'The bridge was sturdy. It did not bend when the heavy cart rolled across.',
    model:{type:'text',segments:['The bridge was sturdy.','It did not bend when the heavy cart rolled across.'],focus:0,clue:'The second sentence shows that this bridge can support a heavy cart without bending.'},
    kind:'choice',prompt:'What does “sturdy” mean in this example?',choices:['Easy to break','Strong'],answer:1,
    explanation:'Strong fits: the bridge does not bend under the heavy cart. That detail helps explain sturdy, just as nearby details can explain another word.'
  },
  'paris-infer':{
    id:'paris-help-rest',title:'Connect two clues',
    lesson:'An action and another detail can help us work out a likely reason, even when the reason is not stated.',
    passage:'Ben yawns twice. He takes a blanket and lies down on the sofa.',
    model:{type:'text',segments:['Ben yawns twice.','He takes a blanket and lies down on the sofa.'],focus:0,clue:'Yawning and lying down under a blanket point toward wanting a rest.'},
    kind:'choice',prompt:'What does Ben most likely want to do?',choices:['Have a rest','Look at a map'],answer:0,
    explanation:'Yawning and getting a blanket to lie down with both support wanting a rest. The example gives no clue about a map.'
  },
  'paris-evidence':{
    id:'paris-help-gloves',title:'Choose a sentence that shows it',
    lesson:'A useful evidence sentence connects directly to the idea we are checking. A nearby event may be less helpful.',
    passage:'Amal’s hands were cold. She put on her thick gloves. A bell rang outside.',
    model:{type:'text',segments:['Amal’s hands were cold.','She put on her thick gloves.','A bell rang outside.'],focus:0,clue:'Putting on gloves is an action that supports the idea of trying to warm cold hands.'},
    kind:'choice',prompt:'Which sentence best supports the idea that Amal was trying to warm her hands?',choices:['A bell rang outside.','She put on her thick gloves.'],answer:1,
    explanation:'The gloves sentence describes an action that could warm Amal’s cold hands. The bell sentence is a different event, not evidence for that reason.'
  },
  'paris-sequence':{
    id:'paris-help-paper-card',title:'First, next, last',
    lesson:'Order words can help us track events without having to remember a different part of a story.',
    passage:'First, Jo folded the paper. Next, Jo drew a star. Last, Jo put the card in a bag.',
    model:{type:'text',segments:['First, Jo folded the paper.','Next, Jo drew a star.','Last, Jo put the card in a bag.'],focus:0,clue:'First marks folding, next marks drawing, and last marks putting the card in a bag.'},
    kind:'choice',prompt:'Which order matches this little passage?',choices:['Draw → fold → put in a bag','Fold → draw → put in a bag'],answer:1,
    explanation:'The order words show folding first, drawing next, and putting the card in a bag last. Look for the order words in the separate waiting passage.'
  }
};
