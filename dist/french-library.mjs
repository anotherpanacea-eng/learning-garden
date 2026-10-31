import {frenchStoryData} from './french-story-data.mjs';
import {ORDER_PERMUTATIONS,displayOrderFor} from './paris-pack-core.mjs';

export const frenchPlaces=[
 {id:'bookstall',title:'Books & hidden messages',symbol:'📚',description:'Investigate parcels, missing pages, and notes among the books.'},
 {id:'river',title:'Along the river',symbol:'⛵',description:'Follow clues, solve small problems, and notice what changes.'},
 {id:'rooftops',title:'Above the rooftops',symbol:'🌿',description:'Plan, make art, and follow a mystery in the rooftop garden.'}
];
export const frenchEntrance={id:'french',title:'Explore Paris en français',chapter:'Paris en français',language:'fr',invitation:'Follow a mystery, find a message, or help a plan take shape in French.',start:`french-explore-${frenchStoryData[0].id}-1-1`,ending:{title:'Une pause à Paris',body:'Your story has a place to pause. Another errand, or a familiar page, will be waiting.',projectTitle:'French to take with you',project:'Try a sentence, sketch a scene, or tell someone what happened. Nothing needs to be uploaded or finished.'}};
const examples={
 detail:{lesson:'Find the exact detail the question asks for. « dans » means in.',segments:['Mina met une lettre dans le tiroir.','Son carnet reste sur la table.'],prompt:'Where does Mina put the letter?',choices:['In the drawer.','On the table.'],answer:0,focus:0,clue:'The letter is « dans le tiroir », in the drawer.'},
 context:{lesson:'A nearby sentence can explain an unfamiliar word.',segments:['La boîte est vide.','Il n’y a rien dans la boîte.'],prompt:'What does « vide » mean here?',choices:['Heavy.','Empty.'],answer:1,focus:1,clue:'« Il n’y a rien » means there is nothing. That explains « vide », empty.'},
 inference:{lesson:'Connect an action with the clue that explains it.',segments:['Il pleut dehors.','Mina prend son parapluie avant de sortir.'],prompt:'Why does Mina most likely take an umbrella?',choices:['To carry books.','To stay dry.'],answer:1,focus:0,clue:'Rain outside and taking an umbrella suggest wanting to stay dry.'},
 sequence:{lesson:'Follow « D’abord » (first), « Ensuite » (next), and « Enfin » (finally).',segments:['D’abord, Mina prend une enveloppe.','Ensuite, elle met une lettre dedans.','Enfin, elle ferme l’enveloppe.'],prompt:'Which action is in the middle?',choices:['Putting the letter inside.','Closing the envelope.'],answer:0,focus:1,clue:'« Ensuite » marks the middle action: putting the letter inside.'}
};
export const frenchStories=frenchStoryData.map(s=>({id:s.id,destination:s.destination,title:s.title,invitation:s.invitation,variants:Object.fromEntries([1,2,3].map(v=>[v,[1,2].map(q=>`french-explore-${s.id}-${v}-${q}`)]))}));
export const frenchLibraryNodes={},frenchLibraryHelpers={};
for(const story of frenchStoryData)for(const variant of [1,2,3]){
 const ids=frenchStories.find(s=>s.id===story.id).variants[variant];
 story.questions.forEach((q,i)=>{
  const id=ids[i],h=examples[q.helper];
  const answer=q.type==='order'?{kind:'order',orderItems:q.items,displayOrder:displayOrderFor(`french:${story.id}:${i}`),choices:ORDER_PERMUTATIONS.map(p=>p.map(n=>q.items[n]).join(' → ')),answer:0}:{kind:'choice',choices:q.choices,answer:q.answer};
  frenchLibraryNodes[id]={id,entrance:'french',language:'fr',type:'task',subject:'Reading',practiceOnly:true,
   frenchDestination:story.destination,frenchStory:story.id,frenchVariant:variant,
   passageId:`french-explore-${story.id}-passage-${variant}`,readingText:story.passages[variant],readingSkill:q.skill,
   title:q.title,body:story.title,prompt:q.prompt,...answer,
   hint:`${q.hint} English meaning: ${story.meanings[variant]} Word help: ${story.words}`,
   explanation:q.explanation,talk:'Which French words support your idea? Can you imagine a different ending?',
   guide:'{guide} says, “We can follow a clue, reread a sentence, or borrow an English meaning. Take the time you need.”',next:i===0?ids[1]:'french-postcard'};
  frenchLibraryHelpers[id]={id:`${id}-help`,title:'A smaller French clue',lesson:h.lesson,passage:h.segments.join(' '),model:{type:'text',language:'fr',segments:h.segments,focus:h.focus,clue:h.clue},kind:'choice',prompt:h.prompt,choices:h.choices,answer:h.answer,explanation:`${h.clue} Return to your story and look for its own clue.`};
 });
}
frenchLibraryNodes['french-postcard']={id:'french-postcard',entrance:'french',language:'fr',type:'project',subject:'Writing',practiceOnly:true,title:'Un message à emporter',body:'A message from your visit can take many forms.',prompt:'If you like, say or write a French sentence, sketch a scene, or tell someone what happened. Try « Je pense que… » (I think that…) or « D’abord… Ensuite… » (First… Next…). You can also keep the idea for later.',projectOptions:['A French sentence','A drawing with a caption','An idea for later'],guide:'{guide} says, “A simple sentence can carry an interesting idea.”'};
