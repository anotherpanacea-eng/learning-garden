// Original English story errands in an imaginary Paris. No travel knowledge is needed.
export const parisDestinations = [
  {id:'bookstall',title:'Lucie’s bookstall',description:'Unpack unusual books and follow little notes.',symbol:'📚'},
  {id:'river',title:'The river walk',description:'Notice nearby clues and wonder why things happen.',symbol:'🌊'},
  {id:'rooftops',title:'The rooftop garden',description:'Find evidence and put a small adventure in order.',symbol:'🌱'}
];

const stories = [
  {
    id:'travelling-book',destination:'bookstall',title:'The book with the ticklish cover',
    passages:{
      1:['Lucie wraps a ticklish book in spotted cloth.','The book sneezes, and the cloth falls open.','Lucie must rewrap it: she wraps the same book again.','Pip holds the string.','Dot offers the book a tiny handkerchief.'],
      2:['A book at Lucie’s stall has a ticklish cover.','Lucie wraps it in spotted cloth, but the book sneezes and the cloth falls open.','She must rewrap it before its journey: she wraps the same book again.','Pip holds the string very still.','Dot politely offers the book a tiny handkerchief.'],
      3:['A book at Lucie’s stall has a ticklish cover and a map tucked between its pages.','It is travelling to the Learning Garden.','Lucie wraps it in spotted cloth, but the book sneezes and the cloth falls open.','She must rewrap it before its journey: she wraps the same book again.','Pip holds the string very still while Dot offers the book a tiny handkerchief.','This time, Lucie leaves its ticklish corners loose.','The parcel gives one quiet sniff and settles down.']
    },
    tasks:[
      {title:'A wrapping clue',readingSkill:'Locate an explicit detail',prompt:'What does Lucie wrap the book in?',choices:['Spotted cloth','A tiny handkerchief','The string'],answer:0,hint:'Find the sentence that says what Lucie wraps the book in.',explanation:'Lucie wraps the book in spotted cloth. Pip holds the string, and Dot offers the handkerchief.',talk:'Which words tell you what goes around the book?',helper:'detail'},
      {title:'Wrap once more',readingSkill:'Work out a word-part meaning',prompt:'In “rewrap,” what does re- mean?',choices:['Very softly','Before','Again'],answer:2,hint:'Lucie wrapped the book once. What does she do after the cloth falls open?',explanation:'Re- means “again” in rewrap. Lucie wraps the same book a second time.',talk:'What else might someone need to do again while packing a parcel?',helper:'wordpart'}
    ]
  },
  {
    id:'fox-reading-corner',destination:'bookstall',title:'A reading corner for a fox',
    passages:{
      1:['Lucie puts a cushion on the low table for a fox.','Dot will reuse an old curtain: she will use it again as a rug.','The fox opens a book about umbrellas.'],
      2:['A fox visits Lucie’s bookstall with a book about umbrellas.','Lucie puts a cushion on the low table for the fox.','Dot finds an old curtain and decides to reuse it: she will use it again as a rug.','Pip smooths its wrinkles.','The fox settles down and begins at the very last page.'],
      3:['A fox visits Lucie’s bookstall carrying a book about umbrellas, although the morning is sunny.','Lucie puts a cushion on the low table for the fox.','Dot finds an old curtain in a basket and decides to reuse it: she will use it again as a rug.','Pip smooths the wrinkles and moves a stray button aside.','The fox settles down and begins at the very last page.','“I like to meet the ending first,” the fox explains, turning the book upside down.']
    },
    tasks:[
      {title:'A comfortable place',readingSkill:'Locate an explicit detail',prompt:'Where does Lucie put the cushion?',choices:['In a basket','On the low table','Inside the book'],answer:1,hint:'Look for Lucie’s action and the place named beside it.',explanation:'The passage says Lucie puts the cushion on the low table for the fox.',talk:'How did you find the place without having to remember the whole passage?',helper:'detail'},
      {title:'A curtain’s next job',readingSkill:'Work out a word-part meaning',prompt:'What does “reuse” mean here?',choices:['Use again','Use very quickly','Never use'],answer:0,hint:'The passage explains what Dot plans to do with the old curtain.',explanation:'Reuse means use again. The curtain has an old job, and Dot uses it again as a rug. Re- contributes the meaning “again.”',talk:'Can you imagine another useful job for an old curtain?',helper:'wordpart'}
    ]
  },
  {
    id:'paper-boat-delivery',destination:'river',title:'The paper boat’s passenger',
    passages:{
      1:['Water in a little tray beside the river was still: no ripples moved across it.','Pip put a paper boat there instead of in the splashing fountain.','A paper beetle climbed aboard.'],
      2:['Pip had made a paper boat for a paper beetle.','Water in a little tray beside the river was still: no ripples moved across it.','The nearby fountain sent splashes over its edge.','Pip put the boat in the tray instead.','The beetle climbed aboard, carrying a suitcase no bigger than a bean.'],
      3:['Pip had made a paper boat for a paper beetle with an urgent letter to deliver.','They stopped beside the river to try it.','Water in a little tray was still: no ripples moved across it.','The nearby fountain sent splashes over its edge and shook a floating leaf.','Pip put the boat in the tray instead.','The beetle climbed aboard, carrying a suitcase no bigger than a bean.','Dot nudged the boat gently with a twig.','The letter began its very short voyage.']
    },
    tasks:[
      {title:'A word beside the water',readingSkill:'Use context to understand vocabulary',prompt:'What does “still” mean when it describes the tray’s water?',choices:['Very deep','Full of paper','Not moving'],answer:2,hint:'Read what the passage says about ripples in the tray.',explanation:'Still means not moving here. The passage explains that no ripples moved across the water.',talk:'Which nearby words helped you decide?',helper:'context'},
      {title:'Why this little harbour?',readingSkill:'Infer a reason from story details',prompt:'Why did Pip most likely choose the tray instead of the fountain?',choices:['The calmer water was less likely to splash the paper boat','The beetle asked for a larger suitcase','The fountain had no water in it'],answer:0,hint:'Compare the tray’s water with what happens at the fountain.',explanation:'The tray’s water is still, while the fountain splashes. Those clues support choosing calmer water for a paper boat. No request for a suitcase is given, and the fountain has water.',talk:'Which two details did you connect?',helper:'inference'}
    ]
  },
  {
    id:'bench-story',destination:'river',title:'A story with a dry seat',
    passages:{
      1:['The bench beside the river was damp.','Tiny drops wet Dot’s paw when she touched it.','Before sitting, Pip spread his dry coat over the seat.','Dot opened their storybook.'],
      2:['Pip and Dot found a bench beside the river for reading their storybook.','The bench was damp.','Tiny drops wet Dot’s paw when she touched the seat.','Pip spread his dry coat over it before they sat down.','Dot opened the book to a picture of a whale wearing a hat.'],
      3:['Pip and Dot found a bench beside the river where they could read their storybook together.','The bench was damp.','Tiny drops wet Dot’s paw when she touched the seat.','Pip spread his dry coat over it before they sat down.','Dot opened the book to a picture of a whale wearing a hat.','She wondered how the hat stayed on underwater.','Pip suggested a very determined ribbon.','They leaned towards the page, ready to find out what the writer had imagined.']
    },
    tasks:[
      {title:'The bench’s clue',readingSkill:'Use context to understand vocabulary',prompt:'What does “damp” mean in this passage?',choices:['Covered in books','A little wet','Very noisy'],answer:1,hint:'What happened to Dot’s paw when she touched the bench?',explanation:'Damp means a little wet. The tiny drops that wet Dot’s paw help explain the word.',talk:'What detail would a writer use to show that a seat was dusty instead?',helper:'context'},
      {title:'A coat for a seat',readingSkill:'Infer a reason from story details',prompt:'Why did Pip most likely spread his dry coat over the seat?',choices:['To hide the storybook','To make the river quieter','To keep them from sitting directly on the wet bench'],answer:2,hint:'Connect what Dot notices about the bench with what Pip puts on it.',explanation:'The bench is damp, and Pip puts a dry coat over it before they sit. That supports keeping them off the wet surface. Nothing says he hides the book or quiets the river.',talk:'Does the passage state Pip’s reason, or do we work it out from his actions?',helper:'inference'}
    ]
  },
  {
    id:'seed-envelopes',destination:'rooftops',title:'Seeds for the journey home',
    passages:{
      1:['First, Lucie folded paper into pouches in the rooftop garden.','Next, Dot added seeds.','Last, Pip tied each pouch tightly shut so no seeds could spill.','A sparrow watched from a pot.'],
      2:['The rooftop garden had seeds to share with the Learning Garden.','First, Lucie folded paper into little pouches.','Next, Dot added seeds to each pouch.','Last, Pip tied each pouch tightly shut so no seeds could spill.','A sparrow watched from a pot.','It seemed disappointed that the seeds were going on a journey.'],
      3:['The rooftop garden had seeds to share with the Learning Garden after the storm.','Lucie cleared a small space between the pots.','First, she folded paper into little pouches.','Next, Dot added seeds to each pouch.','Last, Pip tied each pouch tightly shut so no seeds could spill.','A sparrow watched from a pot and tilted its head at every knot.','It seemed disappointed that the seeds were going on a journey.','Lucie left a separate spoonful of bird food nearby for their curious visitor.']
    },
    tasks:[
      {title:'Words that show care',readingSkill:'Find a sentence that supports an idea',prompt:'Which sentence shows an action to keep seeds inside the pouches?',choices:['A sparrow watched from a pot.','Last, Pip tied each pouch tightly shut so no seeds could spill.','Next, Dot added seeds.'],answer:1,hint:'Find the action that closes the pouches and prevents spilling.',explanation:'Tying each pouch tightly shut is the action that keeps seeds inside. Watching or adding seeds does not close a pouch.',talk:'Which words connect the knot with keeping the seeds safe?',helper:'evidence'},
      {title:'Pack the seed parcel',readingSkill:'Sequence events using order words',prompt:'Which order matches the packing in this passage?',choices:['Add seeds → tie pouches → fold paper','Tie pouches → fold paper → add seeds','Fold paper → add seeds → tie pouches'],answer:2,hint:'Follow the actions after First, Next and Last.',explanation:'Lucie folds the paper first. Dot adds seeds next. Pip ties the pouches last.',talk:'Why would tying a pouch before adding its seeds be awkward?',helper:'sequence'}
    ]
  },
  {
    id:'windy-sign',destination:'rooftops',title:'The sign that wanted to fly',
    passages:{
      1:['First, Dot folded a card.','Next, she drew an arrow towards the rooftop garden.','Last, she clipped the card to the rail to stop it blowing away.','Pip waved at a passing pigeon.'],
      2:['A breeze fluttered the leaves in the rooftop garden.','Dot wanted visitors to find the story corner.','First, she folded a card.','Next, she drew an arrow towards the garden.','Last, she clipped the card to the rail to stop it blowing away.','Pip waved at a passing pigeon, but it did not need directions.'],
      3:['A breeze fluttered the leaves in the rooftop garden, where Lucie was arranging a story corner.','Dot wanted visitors to find it without opening every door.','First, she folded a card.','Next, she drew an arrow towards the garden.','Last, she clipped the card to the rail to stop it blowing away.','Pip waved at a passing pigeon, but it did not need directions.','The pigeon landed beside a pot and inspected the arrow.','Perhaps it wanted a story after all.']
    },
    tasks:[
      {title:'An action against the breeze',readingSkill:'Find a sentence that supports an idea',prompt:'Which sentence shows Dot taking action to stop the card blowing away?',choices:['Last, she clipped the card to the rail to stop it blowing away.','First, Dot folded a card.','Pip waved at a passing pigeon.'],answer:0,hint:'Look for the action that fastens the card to something.',explanation:'The sentence about clipping the card to the rail directly shows how Dot stops it blowing away. Folding makes the card, and waving does not fasten it.',talk:'What does the word “clipped” tell you Dot did?',helper:'evidence'},
      {title:'Make the little sign',readingSkill:'Sequence events using order words',prompt:'What order does Dot follow?',choices:['Draw the arrow → clip the card → fold it','Fold the card → draw the arrow → clip the card','Clip the card → fold it → draw the arrow'],answer:1,hint:'Track Dot’s actions after First, Next and Last.',explanation:'Dot folds the card first, draws the arrow next, and clips the card last.',talk:'Which order words helped you keep track?',helper:'sequence'}
    ]
  }
];

const helperTemplates = {
  detail:{id:'paris-library-help-detail',title:'Find one detail',lesson:'An instruction or story can name an object and a place. Look for exactly the detail the question asks for.',passage:'Mina puts a striped scarf on the chair. Her boots stay by the door.',model:{type:'text',segments:['Mina puts a striped scarf on the chair.','Her boots stay by the door.'],focus:0,clue:'The first sentence names both the scarf and where Mina puts it.'},kind:'choice',prompt:'Where does Mina put the scarf?',choices:['By the door','On the chair'],answer:1,explanation:'The first sentence says “on the chair.” The door is where the boots stay.'},
  wordpart:{id:'paris-library-help-wordpart',title:'A little part means again',lesson:'In some words, re- means “again.” The rest of the word tells what happens again.',passage:'Mo builds a tower. It falls, so Mo rebuilds it.',model:{type:'text',segments:['Mo builds a tower.','It falls, so Mo rebuilds it.'],focus:1,clue:'Mo has already built once. Rebuild means build again.'},kind:'choice',prompt:'What does “rebuild” mean here?',choices:['Build again','Never build'],answer:0,explanation:'Rebuild means build again. Re- adds the meaning “again” to build.'},
  context:{id:'paris-library-help-context',title:'Let nearby words help',lesson:'A nearby detail can show what an unfamiliar word means.',passage:'The box was enormous. Even the big toy bear fitted inside, with room left over.',model:{type:'text',segments:['The box was enormous.','Even the big toy bear fitted inside, with room left over.'],focus:1,clue:'Room for a big bear and more helps us picture the size.'},kind:'choice',prompt:'What does “enormous” mean here?',choices:['Very small','Very large'],answer:1,explanation:'Very large fits a box that holds a big bear with room left over. The nearby detail helps explain enormous.'},
  inference:{id:'paris-library-help-inference',title:'Connect an action and a clue',lesson:'We can use details to work out a likely reason, even when the writer does not state it.',passage:'Rain patters on the path. Ivo opens an umbrella before stepping outside.',model:{type:'text',segments:['Rain patters on the path.','Ivo opens an umbrella before stepping outside.'],focus:1,clue:'Rain and opening an umbrella together suggest a reason.'},kind:'choice',prompt:'Why does Ivo most likely open the umbrella?',choices:['To stay dry in the rain','To carry more books'],answer:0,explanation:'The rain and umbrella support wanting to stay dry. There is no clue about carrying books.'},
  evidence:{id:'paris-library-help-evidence',title:'Point to the action',lesson:'Find words that directly show the action in the idea you are checking.',passage:'The puppy shivered. Ada wrapped it in a warm towel. A clock ticked nearby.',model:{type:'text',segments:['The puppy shivered.','Ada wrapped it in a warm towel.','A clock ticked nearby.'],focus:1,clue:'Wrapping the puppy in a warm towel is an action to help it warm up.'},kind:'choice',prompt:'Which sentence shows Ada doing something to warm the puppy?',choices:['A clock ticked nearby.','Ada wrapped it in a warm towel.'],answer:1,explanation:'The towel sentence describes Ada’s helpful action. The clock sentence describes another event.'},
  sequence:{id:'paris-library-help-sequence',title:'Follow the order words',lesson:'First, next and last can guide us through the order of actions.',passage:'First, Ren washed an apple. Next, Ren cut it. Last, Ren put the pieces in a bowl.',model:{type:'text',segments:['First, Ren washed an apple.','Next, Ren cut it.','Last, Ren put the pieces in a bowl.'],focus:0,clue:'Follow each action from First to Next to Last.'},kind:'choice',prompt:'Which order matches this passage?',choices:['Wash → cut → put in a bowl','Cut → put in a bowl → wash'],answer:0,explanation:'The order words show washing first, cutting next, and putting the pieces in a bowl last.'}
};

export const parisStories = stories.map(s=>({id:s.id,destination:s.destination,title:s.title,variants:Object.fromEntries([1,2,3].map(v=>[v,[1,2].map(q=>`paris-explore-${s.id}-${v}-${q}`)]))}));
export const parisLibraryNodes = {};
export const parisLibraryHelpers = {};
for(const story of stories){
  for(const variant of [1,2,3]){
    const passageId=`paris-explore-${story.id}-passage-${variant}`;
    const ids=[1,2].map(q=>`paris-explore-${story.id}-${variant}-${q}`);
    story.tasks.forEach((task,index)=>{
      const {helper,...fields}=task;
      const id=ids[index];
      parisLibraryNodes[id]={
        id,entrance:'paris',type:'task',subject:'Reading',practiceOnly:true,
        parisDestination:story.destination,parisStory:story.id,parisVariant:variant,
        passageId,readingText:story.passages[variant],
        body:index===0?story.title:'The same passage stays open for another question.',
        guide:'{guide} says, “We can take our time and return to the words whenever we like.”',
        kind:'choice',...fields,next:index===0?ids[1]:'paris-postcard'
      };
      parisLibraryHelpers[id]=helperTemplates[helper];
    });
  }
}
