// Finite River Market text from the panel-resolved 117 companion (spec 324 builds La carga only).
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const riverMarketText=freeze({
 homeLink:'The River Market (Spanish)',
 opening:'A boat called <i>La Garza</i> has tied up at the landing, low in the water with cargo. Its crew has come down from Vadoalto, the town up the valley, for the floating market, and they speak Spanish. They could use a hand. Each errand starts with a note. Read it, then help.',
 later:'<i>La Garza</i> is still at the landing. Marisol waves.',
 errands:'Errands',labels:{none:'Not started',started:'Started',done:'Done',before:'Done before'},
 amountQuestion:'How much would you like to read?',amounts:{short:'Short sentences',longer:'A longer note'},
 meaning:'What does it mean?',wordByWord:'Word by word',hear:'Hear it',oneAtATime:'Read one sentence at a time',nextSentence:'Next sentence',stop:'Stop',
 noVoice:"This device doesn't have a Spanish voice. Ask a grown-up to read it with you, or read it together.",
 helped:'Read with English help',
 phrasebookLink:'Mi cuaderno · Words you\'ve met',phrasebookBack:'Back to the errand',phrasebookEmpty:'Open a note, and its words will appear here.',
 boatLine:{es:'Se llama <i>La Garza</i>. Dicen que una garza vieja cuida el arroyo.',en:'She\'s called <i>La Garza</i>, the Heron. They say an old heron looks after the brook.'},
 doneButton:'Done unloading',stillOnLanding:'Some things are still on the landing. Put each one where the note says.',
 amountLocked:'This errand keeps the note it started with.',
 startAgain:'Start again',startedAgain:'A fresh copy of the errand is ready. Your earlier try is kept in your notes.',
 pickedUp:'picked up',landing:'On the landing',
 capacity:'There isn\'t room to save this change yet. Your work is unchanged. Ask a grown-up to export it or choose older work to delete.',
 unavailable:'This older errand can\'t be displayed here. It is still kept in your export. Other errands are open.',
 unknownVersion:'This River Market notebook uses a format this version cannot read. Your work is kept in your notes download. The rest of the garden is open.',notesLink:'Download your notes',
 invitation:'Find three things at home you could name in Spanish. Make labels for them.',
 caminoGrammar:{directions:{title:'Directions to a friend',text:'<i>Sal</i>, <i>sigue</i>, <i>gira</i> and <i>cruza</i> are friendly commands, the way you\'d tell one friend what to do.'}},
 invitations:{carga:'Find three things at home you could name in Spanish. Make labels for them.',camino:'Give a grown-up directions to another room using <i>recto</i>, <i>izquierda</i> and <i>derecha</i>.'},
 notesDetails:'The market practices reading short Spanish notes and acting on them. It doesn\'t assess Spanish ability. Errands marked \"Read with English help\" used the English meanings. A longer note is optional stretch reading, meant to be read with the English help; short sentences are the default. When a line speaks to more than one person, the game uses <i>ustedes</i>. In Spain, friends usually say <i>vosotros</i>; <i>ustedes</i> is also correct, and it keeps the verb forms simpler. If you speak Spanish, reading the notes aloud together helps more than anything the game can do.',
 grammar:{
  articles:{title:'El, la, los, las',text:'Spanish nouns have a grammatical gender: masculine or feminine. Learn each noun with its article: <i>el saco</i>, <i>la caja</i>. For more than one: <i>los sacos</i>, <i>las cajas</i>.'},
  hay:{title:'Hay',text:'<i>Hay</i> means there is or there are. <i>Hay tres tarros</i>: there are three jars. It doesn\'t change for one or many.'},
  sounds:{title:'Sounds',text:'<i>H</i> is silent: <i>harina</i> sounds like \"ah-REE-nah\". <i>J</i> is a raspy sound made at the back of the mouth: <i>jardín</i>. <i>Ñ</i> sounds like the \"ny\" in canyon: <i>mañana</i>. <i>Ll</i> in <i>llover</i> sounds like the \"y\" in yes in most places.'}
 }
});
const sentences={
 short:[['¡Hola! Somos de Vadoalto.','Hello! We\'re from Vadoalto.'],['Traemos tres tarros de miel.','We\'re bringing three jars of honey.'],['Traemos dos sacos de harina.','We\'re bringing two sacks of flour.'],['La miel es para el café.','The honey is for the café.'],['La harina es para la panadería.','The flour is for the bakery.']],
 longer:[['¡Hola, vecinos! Me llamo Marisol y soy la capitana de <i>La Garza</i>.','Hello, neighbors! My name is Marisol and I\'m the captain of <i>La Garza</i>.'],['Venimos de Vadoalto, más arriba en el valle.','We come from Vadoalto, farther up the valley.'],['Hoy traemos tres tarros de miel, dos sacos de harina y una caja pequeña de semillas de carrizo.','Today we\'re bringing three jars of honey, two sacks of flour and a small box of reed seeds.'],['La miel es para el café, la harina es para la panadería y las semillas son para el jardín.','The honey is for the café, the flour is for the bakery and the seeds are for the garden.'],['El carrizo crece bien en la tierra mojada.','Reeds grow well in wet ground.'],['¿Nos ayudas a descargar?','Will you help us unload?']]
};
const words=[['hola','hello'],['somos','we are'],['traemos','we bring'],['el tarro','jar'],['la miel','honey'],['el saco','sack'],['la harina','flour'],['para','for'],['los vecinos','neighbors'],['me llamo','my name is'],['la capitana','captain'],['venimos de','we come from'],['más arriba','farther up'],['el valle','valley'],['la caja','box'],['pequeña','small'],['las semillas','seeds'],['el carrizo','reed'],['crece','grows'],['la tierra mojada','wet ground'],['descargar','to unload']];
const phrasebook=['hola','somos','traemos','el tarro','la miel','el saco','la harina','las semillas','el carrizo','el café','la panadería','el jardín','dos','tres'];
// English for phrasebook words outside the glossed word list.
const phrasebookExtra={'el café':'café','la panadería':'bakery','el jardín':'garden','dos':'two','tres':'three'};
const places=[['cafe','el café','the café'],['panaderia','la panadería','the bakery'],['jardin','el jardín','the garden']];
const kinds={miel:{label:'un tarro de miel',en:'a jar of honey',target:'cafe'},harina:{label:'un saco de harina',en:'a sack of flour',target:'panaderia'},semillas:{label:'una caja de semillas',en:'a box of seeds',target:'jardin'}};
// Marisol's wrong-place lines, in companion order.
const wrong=[['miel','panaderia','La miel está en la panadería. ¿Es para la panadería?','The honey is in the bakery. Is it for the bakery?'],['harina','cafe','La harina está en el café. ¿Es para el café?','The flour is in the café. Is it for the café?'],['semillas','cafe','Las semillas están en el café. ¿Son para el café?','The seeds are in the café. Are they for the café?'],['miel','jardin','La miel está en el jardín. ¿Es para el jardín?','The honey is in the garden. Is it for the garden?'],['harina','jardin','La harina está en el jardín. ¿Es para el jardín?','The flour is in the garden. Is it for the garden?'],['semillas','panaderia','Las semillas están en la panadería. ¿Son para la panadería?','The seeds are in the bakery. Are they for the bakery?']];
export function makeCargaSource(amount){
 if(!['short','longer'].includes(amount))return null;
 const items=[...[1,2,3].map(n=>`miel-${n}`),...[1,2].map(n=>`harina-${n}`),...(amount==='longer'?['semillas-1']:[])].map(id=>{const kind=id.split('-')[0];return {id,kind,label:kinds[kind].label,en:kinds[kind].en};});
 const used=new Set(items.map(i=>i.kind));
 return freeze({
  format:1,errand:'carga',title:'La carga',titleEn:'the cargo',amount,
  sentences:sentences[amount].map(([es,en],i)=>({id:`s${i+1}`,es,en})),
  words:words.map(([es,en])=>({es,en})),
  phrasebook:phrasebook.map(es=>({es,en:(words.find(w=>w[0]===es)||[])[1]||phrasebookExtra[es]})),
  prompt:'Tap something on the landing, then tap where it goes.',
  places:places.map(([id,label,en])=>({id,label,en})),
  items,targets:Object.fromEntries([...used].map(k=>[k,kinds[k].target])),
  feedback:{all:{id:'all',es:'¡Gracias! Todo está en su sitio.',en:'Thank you! Everything is in its place.'},wrong:wrong.filter(([kind])=>used.has(kind)).map(([kind,place,es,en])=>({id:`${kind}-${place}`,kind,place,es,en}))},
  // The errand's own teaching text: Mi cuaderno's notes and the boat-name line read from this frozen copy.
  grammar:JSON.parse(JSON.stringify(riverMarketText.grammar)),
  boatLine:{es:riverMarketText.boatLine.es,en:riverMarketText.boatLine.en},
  question:{es:'¿Cuántos tarros de miel hay?',en:'How many jars of honey are there?',choices:[{id:'dos',es:'dos',nudge:'<i>Dos</i> is how many <i>sacos de harina</i> there are. Look for the number before <i>tarros de miel</i>.'},{id:'tres',es:'tres',nudge:'Yes: <i>tres tarros de miel</i>, three jars of honey.'},{id:'cuatro',es:'cuatro',nudge:'<i>Cuatro</i> means four. Look for the number before <i>tarros de miel</i>.'}],fit:'tres'}
 });
}

// El camino (spec 328): the companion's second errand, as amended by the panel resolution.
const caminoSentences={
 short:[['Teo, sal del muelle.','Teo, leave the landing.'],['Sigue recto hasta el puente.','Keep going straight as far as the bridge.'],['Cruza el puente.','Cross the bridge.'],['En la plaza, gira a la izquierda.','At the square, turn left.'],['La panadería está al lado del café.','The bakery is next to the café.']],
 longer:[['Teo, la panadería no está lejos.','Teo, the bakery isn\'t far.'],['Sal del muelle y sigue recto hasta el puente.','Leave the landing and keep going straight as far as the bridge.'],['Cruza el puente con cuidado, porque todavía hay tablas sueltas después de la tormenta.','Cross the bridge carefully, because there are still loose planks after the storm.'],['En la plaza, gira a la izquierda.','At the square, turn left.'],['La panadería está al lado del café, enfrente de la oficina de correos.','The bakery is next to the café, across from the post office.']]
};
const caminoWords=[['sal','leave, go out'],['el muelle','landing, dock'],['sigue recto','keep going straight'],['hasta','as far as'],['el puente','bridge'],['cruza','cross'],['la plaza','square'],['gira','turn'],['a la izquierda','to the left'],['a la derecha','to the right'],['al lado de','next to'],['no está lejos','isn\'t far'],['con cuidado','carefully'],['todavía hay','there are still'],['las tablas sueltas','loose planks'],['la tormenta','storm'],['enfrente de','across from'],['la oficina de correos','post office']];
const caminoPhrasebook=['sigue recto','cruza','gira','a la izquierda','a la derecha','al lado de','enfrente de','el puente','el muelle','la plaza','la oficina de correos','la tormenta'];
const caminoQuestions={
 short:{es:'¿Dónde está la panadería?',en:'Where is the bakery?',choices:[{id:'cafe',es:'al lado del café',nudge:'Yes: <i>al lado del café</i>, next to the café.'},{id:'puente',es:'al lado del puente',nudge:'Teo crossed the <i>puente</i> before he reached the plaza. Look at the last sentence.'},{id:'muelle',es:'en el muelle',nudge:'The <i>muelle</i> is where Teo started.'}],fit:'cafe'},
 longer:{es:'¿Qué está enfrente de la panadería?',en:'What is across from the bakery?',choices:[{id:'cafe',es:'el café',nudge:'The café is <i>al lado</i>, next to the bakery. <i>Enfrente</i> means across from it.'},{id:'puente',es:'el puente',nudge:'The <i>puente</i> is on the way, before the plaza.'},{id:'correos',es:'la oficina de correos',nudge:'Yes: <i>enfrente de la oficina de correos</i>, across from the post office.'}],fit:'correos'}
};
export const CAMINO_BUTTONS=Object.freeze(['recto','cruza','izquierda','derecha']);
export function makeCaminoSource(amount){
 if(!['short','longer'].includes(amount))return null;
 return freeze({
  format:1,errand:'camino',title:'El camino',titleEn:'the way',amount,
  sentences:caminoSentences[amount].map(([es,en],i)=>({id:`s${i+1}`,es,en})),
  words:caminoWords.map(([es,en])=>({es,en})),
  phrasebook:caminoPhrasebook.map(es=>({es,en:caminoWords.find(w=>w[0]===es)[1]})),
  prompt:'Read Marisol\'s note and move Teo to the bakery.',
  map:[{id:'muelle',label:'el muelle',en:'the landing'},{id:'puente',label:'el puente',en:'the bridge'},{id:'plaza',label:'la plaza',en:'the square'},{id:'panaderia',label:'la panadería',en:'the bakery'},{id:'cafe',label:'el café',en:'the café'},{id:'correos',label:'la oficina de correos',en:'the post office'}],
  buttons:[{id:'recto',es:'recto',arrow:'↑'},{id:'cruza',es:'cruza',arrow:'⤳'},{id:'izquierda',es:'a la izquierda',arrow:'←'},{id:'derecha',es:'a la derecha',arrow:'→'}],
  start:'muelle',goal:'panaderia',wrong:'correos',
  // Each cell: a node id, 'nothing' (nothing to cross) or 'stays'.
  moves:{muelle:{recto:'puente',cruza:'nothing',izquierda:'stays',derecha:'stays'},puente:{recto:'stays',cruza:'plaza',izquierda:'stays',derecha:'stays'},plaza:{recto:'stays',cruza:'nothing',izquierda:'panaderia',derecha:'correos'},correos:{recto:'stays',cruza:'nothing',izquierda:'stays',derecha:'stays'}},
  back:{from:'correos',to:'plaza',label:'Back to the plaza'},
  feedback:{
   start:{id:'start',es:'¿Por dónde voy? Siempre me pierdo.',en:'Which way do I go? I always get lost.'},
   nothing:{id:'nothing',lead:'Teo looks around.',es:'Aquí no hay nada que cruzar.',en:'There\'s nothing to cross here.',tail:'Teo stays put.'},
   stays:{id:'stays',text:'Teo looks around. That way doesn\'t go anywhere from here. Teo stays put.'},
   correos:{id:'correos',es:'Esta es la oficina de correos. ¿Dónde está la panadería?',en:'This is the post office. Where\'s the bakery?',hint:'Read the line about <i>la plaza</i> again.'},
   panaderia:{id:'panaderia',es:'¡La panadería! Huele a pan. ¡Gracias!',en:'The bakery! It smells of bread. Thank you!'}
  },
  place:'Teo is at {place}.',group:'Move Teo',
  question:caminoQuestions[amount],
  grammar:JSON.parse(JSON.stringify(riverMarketText.caminoGrammar)),
  invitation:riverMarketText.invitations.camino
 });
}
