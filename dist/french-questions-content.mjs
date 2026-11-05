// Original finite French reviewed under spec382, companion revision4. No runtime generation.
export const frenchQuestionCases=[
 {id:'cafe',title:'Le café',titleMeaning:'The café'},
 {id:'jardin',title:'Le jardin',titleMeaning:'The garden'},
 {id:'bibliotheque',title:'La bibliothèque',titleMeaning:'The library'},
 {id:'atelier',title:'L’atelier',titleMeaning:'The workshop'}
];
const cases={
 cafe:{note:['Apporte le colis au café.','Bring the parcel to the café.'],colour:['Le colis est bleu.','The parcel is blue.'],room:['Le colis est dans la cuisine.','The parcel is in the kitchen.'],destination:['Le colis va au café.','The parcel is going to the café.'],order:[[0,0],[0,1],[1,0],[1,1]],targetId:'a'},
 jardin:{note:['Apporte le colis au jardin.','Bring the parcel to the garden.'],colour:['Le colis est rouge.','The parcel is red.'],room:['Le colis est dans le salon.','The parcel is in the living room.'],destination:['Le colis va au jardin.','The parcel is going to the garden.'],order:[[0,0],[1,1],[0,1],[1,0]],targetId:'b'},
 bibliotheque:{note:['Apporte le colis à la bibliothèque.','Bring the parcel to the library.'],colour:['Le colis est bleu.','The parcel is blue.'],room:['Le colis est dans le salon.','The parcel is in the living room.'],destination:['Le colis va à la bibliothèque.','The parcel is going to the library.'],order:[[1,0],[1,1],[0,1],[0,0]],targetId:'c'},
 atelier:{note:['Apporte le colis à l’atelier.','Bring the parcel to the workshop.'],colour:['Le colis est rouge.','The parcel is red.'],room:['Le colis est dans la cuisine.','The parcel is in the kitchen.'],destination:['Le colis va à l’atelier.','The parcel is going to the workshop.'],order:[[0,1],[0,0],[1,1],[1,0]],targetId:'d'}
};
const pair=([fr,en])=>({fr,en});
const colours=[['bleu','blue'],['rouge','red']],rooms=[['la cuisine','the kitchen'],['le salon','the living room']];
const questions=[['colour','De quelle couleur est le colis ?','What colour is the parcel?'],['room','Dans quelle pièce est le colis ?','Which room is the parcel in?'],['destination','Où va le colis ?','Where is the parcel going?']];
export function makeFrenchQuestionSource(caseId='cafe'){
 const c=frenchQuestionCases.find(c=>c.id===caseId);if(!c)return null;
 const data=cases[c.id];
 return {v:1,id:`parcel-questions-${c.id}`,title:c.title,titleMeaning:c.titleMeaning,note:pair(data.note),
  example:{fr:'Le colis est vert. Il est dans la chambre.',en:'The parcel is green. It is in the bedroom.'},
  questions:questions.map(([id,fr,en])=>({id,fr,en,reply:pair(data[id])})),
  parcels:data.order.map(([colour,room],i)=>({id:['a','b','c','d'][i],colour:pair(colours[colour]),room:pair(rooms[room])})),targetId:data.targetId};
}
export const questionCopy=Object.freeze({
 label:'Which parcel?',
 story:'A visitor is collecting supplies. Four parcels are waiting in two rooms. Find the visitor’s parcel by asking questions.',
 instruction:'Ask a question. Read the reply. Choose a parcel when you want to.',
 teaching:'The visitor’s note names the parcel’s destination. A colour question and a room question can help you tell the parcels apart. A question about the destination repeats something you already know. You can ask any question, in any order, as often as you like.',
 workedExample:'You want a green parcel in the bedroom. Knowing only “green” would not distinguish two green parcels. Knowing the room as well can help.',
 qualification:'This is supported reading and question practice. Selecting supplied questions is not composing French or demonstrating spoken comprehension.',
 spokenInvitation:'Try asking one of these questions aloud to someone with you.',
 meanings:'English meanings',hear:'Hear this French',noVoice:'A local French voice is unavailable. Read the French, or ask someone to read it with you.',
 compare:'Compare with the replies',chooseFirst:'Choose a parcel first, or keep exploring.',match:'The chosen parcel matches both details.',different:'The chosen parcel has a different colour or room. You can choose again or keep this version.',comparisonOpened:'Source comparison opened',chosen:'Your chosen parcel',conversation:'Conversation',
 back:'Back to French rooms',visit:'Choose a visit',questions:'Questions',parcels:'Parcels',keep:'Keep this conversation',shelf:'Kept conversations',working:'Working conversation',drafts:'Working drafts',copy:'Work on a copy',fresh:'Start a fresh conversation',earlier:'Earlier',later:'Later',question:'Your question',reply:'Reply',noQuestions:'No question asked yet.',noSelection:'No parcel chosen yet.',readOnly:'Kept conversation · unchanged',emptyShelf:'Nothing kept here yet.',unreadable:'Earlier format retained unchanged. Download Notes to keep a copy.',
 keptExplanation:'You can keep exploring; the kept version stays unchanged.',kept:'Conversation kept. If saving is off, download Notes before leaving.',
 refused:'This conversation could not be kept safely. Your working conversation and earlier notes are unchanged. Download Notes or keep exploring.',
 historyFull:'This working conversation is full. Keep it or start a fresh conversation; earlier questions stay here.',
 speechNotice:'Speech is optional device speech. A request does not establish that anyone heard or understood it.',notesLabel:'French parcel conversations'
});
