// Original imaginary Paris errands. Shared browser practice; no learner identity.
export const frenchLessons=[
 {id:'french-bookstall',title:'Le colis de Lucie',place:'At the bookstall',symbol:'📚',
  invitation:'Help Lucie find a story parcel. Read about colors, objects, and places.',
  text:['Lucie prépare un colis pour le jardin.','Elle met un livre bleu dans le sac.','Le sac est sous la table.','Un petit chat dort sur la chaise.'],
  meaning:'Lucie is preparing a parcel for the garden. She puts a blue book in the bag. The bag is under the table. A little cat is sleeping on the chair.',
  words:'un colis = a parcel; un livre = a book; un sac = a bag; sous = under; sur = on.',
  questions:[
   {title:'Find the parcel',prompt:'Où est le sac ?',choices:['Sur la chaise.','Sous la table.','Dans le jardin.'],answer:1,skill:'Locate a place in a short French passage',hint:'Find the sentence beginning « Le sac ».',explanation:'« Le sac est sous la table. » The bag is under the table.'},
   {title:'Choose the book',prompt:'De quelle couleur est le livre ?',choices:['Il est rouge.','Il est vert.','Il est bleu.'],answer:2,skill:'Locate a color in a short French passage',hint:'Look beside « un livre » for its color.',explanation:'« un livre bleu » means a blue book.'}
  ],postcard:'Try saying or writing one short French message: « Le livre est bleu. » You can change the color, draw it, or leave the idea for later.'},
 {id:'french-river',title:'Le bateau en papier',place:'Beside the river',symbol:'⛵',
  invitation:'Follow a paper boat and read a very small river adventure.',
  text:['Pip fabrique un bateau en papier.','Il met le bateau dans un petit bassin.','Une feuille tombe dans le bateau.','Pip regarde la feuille et sourit.'],
  meaning:'Pip makes a paper boat. He puts the boat in a small pool. A leaf falls into the boat. Pip looks at the leaf and smiles.',
  words:'un bateau = a boat; en papier = made of paper; un bassin = a pool; une feuille = a leaf; sourit = smiles.',
  questions:[
   {title:'A tiny passenger',prompt:'Qu’est-ce qui tombe dans le bateau ?',choices:['Une feuille.','Un livre.','Un chat.'],answer:0,skill:'Find an action and its subject in French',hint:'Find the sentence with « tombe » (falls).',explanation:'« Une feuille tombe dans le bateau. » A leaf falls into the boat.'},
   {title:'Where does it float?',prompt:'Où Pip met-il le bateau ?',choices:['Sur la table.','Dans un petit bassin.','Sous une chaise.'],answer:1,skill:'Understand a French place phrase',hint:'Look at the sentence beginning « Il met » (He puts).',explanation:'Pip puts the boat « dans un petit bassin », in a small pool.'}
  ],postcard:'Imagine a new passenger. Try « Une feuille est dans le bateau. » Draw or describe a different passenger together; there is no marked answer.'},
 {id:'french-rooftops',title:'Le jardin sur le toit',place:'In the rooftop garden',symbol:'🌱',
  invitation:'Help with the rooftop garden and follow what happens first and next.',
  text:['D’abord, Lucie remplit un arrosoir.','Ensuite, elle arrose les fleurs.','Enfin, elle pose l’arrosoir près de la porte.','Les fleurs sont jaunes et rouges.'],
  meaning:'First, Lucie fills a watering can. Next, she waters the flowers. Finally, she puts the watering can near the door. The flowers are yellow and red.',
  words:'d’abord = first; ensuite = next; enfin = finally; un arrosoir = a watering can; près de = near.',
  questions:[
   {title:'The next little job',prompt:'Que fait Lucie ensuite ?',choices:['Elle ouvre un livre.','Elle ferme la porte.','Elle arrose les fleurs.'],answer:2,skill:'Follow explicitly ordered French actions',hint:'« ensuite » means next. Find the sentence with that word.',explanation:'« Ensuite, elle arrose les fleurs. » Next, she waters the flowers.'},
   {title:'Find the watering can',prompt:'Où est l’arrosoir à la fin ?',choices:['Près de la porte.','Sous la table.','Dans le bateau.'],answer:0,skill:'Find a final location in French',hint:'« à la fin » means at the end. Find « Enfin ».',explanation:'« elle pose l’arrosoir près de la porte » means she puts the watering can near the door.'}
  ],postcard:'Try telling someone two tiny steps: « D’abord… Ensuite… » You can use actions from the story or imagine your own garden.'}
];
export const frenchEntrances=frenchLessons.map(l=>({id:l.id,title:`Paris en français · ${l.title}`,chapter:'Paris en français',language:'fr',invitation:l.invitation,start:`${l.id}-1`,ending:{title:'Une petite pause à Paris',body:'Your errand can rest here. Revisit a familiar story or choose another French adventure whenever you like.',projectTitle:'A little French to take with you',project:l.postcard}}));
export const frenchNodes={},frenchHelpers={};
const smallerExamples={
 'french-bookstall':[
  {segments:['Le chat','est sous la chaise.'],lesson:'A place word tells where something is. « sous » means under.',prompt:'Where is the cat?',choices:['Under the chair.','On the chair.'],answer:0,clue:'« sous la chaise » means under the chair.'},
  {segments:['Le crayon','est vert.'],lesson:'A color word tells what something looks like. « vert » means green.',prompt:'What color is the pencil?',choices:['Blue.','Green.'],answer:1,clue:'« est vert » means is green.'}
 ],
 'french-river':[
  {segments:['Une plume','tombe sur le banc.'],lesson:'Look just before the action word. « tombe » means falls; « une plume » means a feather.',prompt:'What falls in this example?',choices:['A book.','A feather.'],answer:1,clue:'« Une plume » is what falls.'},
  {segments:['Mina met la pomme','dans le panier.'],lesson:'« dans » means in. Look after the object to find its place.',prompt:'Where does Mina put the apple?',choices:['In the basket.','Under the chair.'],answer:0,clue:'« dans le panier » means in the basket.'}
 ],
 'french-rooftops':[
  {segments:['D’abord, Mina prend une tasse.','Ensuite, elle verse de l’eau.'],lesson:'« D’abord » means first. « Ensuite » means next. Follow the two actions.',prompt:'What does Mina do next, after taking the cup?',choices:['She takes a cup.','She pours water.'],answer:1,clue:'« Ensuite » marks the next action: she pours water.'},
  {segments:['Enfin, Mina pose le panier','près du banc.'],lesson:'« Enfin » means finally. « près de » means near; « près du banc » means near the bench.',prompt:'Where is the basket at the end?',choices:['Near the bench.','In a boat.'],answer:0,clue:'« près du banc » is the final place.'}
 ]
};
for(const lesson of frenchLessons){
 for(const [i,q] of lesson.questions.entries()){
  const id=`${lesson.id}-${i+1}`;
  frenchNodes[id]={id,entrance:lesson.id,language:'fr',type:'task',subject:'Reading',practiceOnly:true,
   title:q.title,body:lesson.title,guide:'{guide} says, “Read a sentence, find a clue, or ask for its English meaning. We can explore at our own pace.”',
   readingText:lesson.text,passageId:`${lesson.id}-passage-v1`,readingSkill:q.skill,kind:'choice',...q,
   hint:`${q.hint} English meaning: ${lesson.meaning} Words to borrow: ${lesson.words}`,
   talk:'Can you point to the French words that helped? Try saying a sentence together if you like.',next:i===0?`${lesson.id}-2`:`${lesson.id}-postcard`};
  const h=smallerExamples[lesson.id][i];
  frenchHelpers[id]={id:`${id}-help`,title:'A smaller French clue',lesson:h.lesson,
   passage:h.segments.join(' '),model:{type:'text',language:'fr',segments:h.segments,focus:1,clue:h.clue},
   kind:'choice',prompt:h.prompt,choices:h.choices,answer:h.answer,explanation:`${h.clue} Return to your own story and look for its clue.`};
 }
 const id=`${lesson.id}-postcard`;
 frenchNodes[id]={id,entrance:lesson.id,language:'fr',type:'project',subject:'Writing',practiceOnly:true,title:'Une carte pour le jardin',body:'Keep a little French from your visit.',prompt:lesson.postcard,projectOptions:['Say a sentence together','Draw a postcard','Keep the idea for later'],guide:'{guide} says, “A word, a picture, or a sentence can carry an idea.”'};
}
