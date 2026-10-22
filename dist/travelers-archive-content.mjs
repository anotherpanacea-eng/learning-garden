// Original modern teaching text. Historical image rights apply only to the named visual.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const ARCHIVE_PAGES=freeze(['parcel','place-dates','sources','reply']);
export const ARCHIVE_TASKS=freeze(['map','order','claims','source-choice','limits']);
export const ARCHIVE_DETAILS=freeze(['whole','boats','buildings']);
export const ARCHIVE_TEXT_LIMIT=2000;
export const ARCHIVE_PACK=freeze({id:'paris-flood-1910-v1',title:"Travelers’ Archive",visit:'Paris, 1910',
 question:'Did the water disappear as soon as the river reached its highest mark?',
 story:'In January 1910, the river Seine rose over its banks, and water filled streets in Paris. A parcel at Lucie’s bookstall holds a real photo from that winter and some date cards. A reader has a question. Can you help answer it?',
 notice:'The parcel and guides are fictional. The historical photograph is real; our map, summaries and reply cards are modern teaching material.',
 sourceNotice:'These are two different kinds of source, not two independent eyewitness accounts. A source can help with one question without answering every question.',
 timelineNotice:'Order of these three dates; spaces do not show equal amounts of time.',
 mapNotice:'Original modern schematic, not to scale and not for finding a route. It does not show the extent of the flood.',
 checked:'2026-10-20 local / 2026-10-21 UTC'});
export const ARCHIVE_SOURCES=freeze([
 {id:'photo',title:'A photograph at the Quai des Grands-Augustins',type:'period-photograph',creator:'Identité judiciaire',creatorNotice:'The museum gives this creator attribution; the individual photographer and exact purpose are not stated here.',
  creationDate:'1910-01-29',creationPrecision:'day',creationLabel:'Museum production date: January 29, 1910',eventDate:'1910-01',eventPrecision:'month',eventLabel:'Scene identified with the January 1910 flood; exact capture moment not established here.',
  dateNotice:'A production date does not by itself prove exactly when the scene was photographed. The digital reproduction and catalog are modern.',
  summary:'Water lies where people usually walk. Boats float beside the buildings. People stand near a raised wooden structure. This is one corner of Paris, the Quai des Grands-Augustins, on one winter day.',
  summaryNotice:'Original modern guide to this source, written for the game; not historical testimony.',
  url:'https://www.parismuseescollections.paris.fr/fr/musee-carnavalet/oeuvres/crue-de-la-seine-janvier-1910-quai-des-grands-augustins',
  inventory:'PH8646',manifest:'https://apicollections.parismusees.paris.fr/iiif/320158523/manifest',
  image:{src:'./assets/archive-paris-1910-ph8646.jpg',original:'https://apicollections.parismusees.paris.fr/sites/default/files/styles/4k/collections/atoms/images/CAR/lpdp_30184-10.jpg?itok=2rfGM7e_',filename:'lpdp_30184-10.jpg',alt:'Old black-and-white photo. Floodwater fills a street beside buildings at the Quai des Grands-Augustins. Boats and people are near a raised wooden structure.',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',credit:'CC0 Paris Musées / Musée Carnavalet - Histoire de Paris',rightsReceipt:'The official catalog’s first/hero visual names lpdp_30184-10 and explicitly labels it CC0. That license does not apply automatically to other visuals or the entire website.',reproduction:'Unchanged local reproduction of the complete field of view; no resizing, colorization, restoration or invented detail.'}},
 {id:'chronology',title:'The archive’s sequence of dates',type:'modern-educational-chronology',creator:'Archives de Paris',creatorNotice:'A modern archive teaching chronology, not an eyewitness account.',
  creationDate:null,creationPrecision:'unknown',creationLabel:'Modern; exact publication date not stated in the PDF',eventDate:'1910-01/1910-03',eventPrecision:'range',eventLabel:'Selected events during the Paris flood, January–March 1910',
  dateNotice:'The events have dates. This modern teaching document’s exact publication date is not given; it is not a document written during the flood.',
  summary:'The Archives de Paris chronology puts several events in order. It records the river’s highest mark on January 28, a flood-study commission in February and the river returning to its bed in March. This modern summary helps us compare dates; it does not show every street or give us a person’s private thoughts.',
  summaryNotice:'Original modern factual summary based on Archives de Paris; not a quotation or historical testimony.',
  url:'https://archives.paris.fr/offre-pedagogique/ressources-pedagogiques/la-crue-de-1910-une-societe-face-aux-risques',
  document:'https://archives.paris.fr/image/303449/11801454?crop=centre&download=1&force-inline=&format=pdf&realHeight=1754&realWidth=1240&region=full&size=!800,800',
  reuseNotice:'Only facts in original short summaries are used. No PDF layout, prose or image reproduction permission is inferred.'}
]);
export const ARCHIVE_EVENTS=freeze([
 {id:'river-peak',date:'1910-01-28',dateLabel:'January 28, 1910',title:'The river’s highest mark',text:'The river reached its highest mark during this flood at the Austerlitz measuring scale.',sourceId:'chronology',notice:'Original modern summary based on Archives de Paris.'},
 {id:'commission',date:'1910-02-09',dateLabel:'February 9, 1910',title:'A commission to study the flood',text:'The government formed a commission to study the flood and propose preventive measures.',sourceId:'chronology',notice:'Original modern summary based on Archives de Paris.'},
 {id:'river-returns',date:'1910-03-15',dateLabel:'March 15, 1910',title:'The river returns to its bed',text:'The Seine went back into its riverbed. Railway and metro services began resuming.',sourceId:'chronology',notice:'Original modern summary based on Archives de Paris. This does not give a date when every street was dry.'}
]);
export const ARCHIVE_SITES=freeze([{id:'grands-augustins',label:'Quai des Grands-Augustins',symbol:'camera',description:'The place named for the photograph, beside the Seine.'},{id:'austerlitz',label:'Pont d’Austerlitz',symbol:'gauge',description:'The bridge where the river measuring scale stands.'},{id:'unsure',label:'Not sure yet',symbol:null,description:'We can compare the source labels.'}]);
export const ARCHIVE_MAP_CARDS=freeze([{id:'photo',label:'The photo',prompt:'Where was this photo taken? Read its label.',answer:'grands-augustins',sourceIds:['photo']},{id:'gauge',label:'The highest river mark',prompt:'Where do the date cards say the river was measured?',answer:'austerlitz',sourceIds:['chronology']}]);
const visible=[{id:'visible',label:'Shown in this picture'},{id:'not-shown',label:'Not shown by this picture'},{id:'unsure',label:'Not sure yet'}];
const sourceChoices=[{id:'photo',label:'The photo'},{id:'chronology',label:'The date cards'},{id:'neither',label:'Neither one'},{id:'unsure',label:'Not sure yet'}];
export const ARCHIVE_QUESTIONS=freeze([
 {id:'visible-boats',task:'claims',prompt:'Can you see boats in this photo?',choices:visible,answer:'visible',sourceIds:['photo'],feedback:'Boats, water and buildings are in this photo. It shows one street.'},
 {id:'visible-feelings',task:'claims',prompt:'Everyone in this photo felt cold. Does the photo show that?',choices:visible,answer:'not-shown',sourceIds:['photo'],feedback:'A photo shows faces and coats. It can’t show what people felt inside.'},
 {id:'visible-depth',task:'claims',prompt:'The water was exactly one meter deep here. Does this picture measure that?',choices:visible,answer:'not-shown',sourceIds:['photo'],feedback:'This photo has no measuring stick for the water. We can see water, but we can’t tell exactly how deep it is.'},
 {id:'source-view',task:'source-choice',prompt:'Which one helps us see what this street looked like?',choices:sourceChoices,answer:'photo',sourceIds:['photo','chronology'],feedback:'The photo shows one view of this street. The date cards tell us when things happened.'},
 {id:'source-peak',task:'source-choice',prompt:'Which one tells us the day the river was highest?',choices:sourceChoices,answer:'chronology',sourceIds:['photo','chronology'],feedback:'The date cards say the river was highest on January 28. The museum’s date for a photo is a different kind of date.'},
 {id:'source-thoughts',task:'source-choice',prompt:'Which one tells us exactly what one person was thinking?',choices:sourceChoices,answer:'neither',sourceIds:['photo','chronology'],feedback:'Neither one can tell us what a person was thinking. Some questions these clues can’t answer.'},
 {id:'peak-return',task:'limits',prompt:'What do the date cards for the highest mark and the return show?',choices:[{id:'later',label:'The river went back into its bed after its highest mark.'},{id:'all-city',label:'All of Paris stayed underwater until March.'},{id:'depth',label:'We know how deep the water was in every street.'},{id:'unsure',label:'Not sure yet'}],answer:'later',sourceIds:['chronology'],feedback:'The date cards say the river was highest on January 28 and back in its bed on March 15. They don’t say when every street dried, or how deep each street was.'},
 {id:'photo-date',task:'limits',prompt:'The museum’s date for this photo is January 29. Does that tell us the exact day the photo was taken?',choices:[{id:'not-alone',label:'Not by itself'},{id:'exact',label:'Yes, exactly that day'},{id:'tone',label:'The gray colors tell us the day'},{id:'unsure',label:'Not sure yet'}],answer:'not-alone',sourceIds:['photo'],feedback:'The museum’s date may differ from the moment the photo was taken. Its title names the January flood. Gray colors can’t tell us a date.'}
]);
export const ARCHIVE_REPLY_FIELDS=freeze([
 {id:'claim',label:'What I can say',choices:[{id:'return-later',label:'The river went back into its bed after its highest mark.'},{id:'all-dry',label:'All of Paris was dry as soon as the river was highest.'},{id:'unsure',label:'I’m not sure yet.'}]},
 {id:'evidence',label:'My evidence',choices:[{id:'chronology',label:'The date cards for the highest mark and the return.'},{id:'photo',label:'The photo alone.'},{id:'both',label:'The date cards give dates, and the photo adds one street.'},{id:'image-tone',label:'The photo’s black-and-white colors.'}]},
 {id:'limit',label:'What these clues can’t tell me',choices:[{id:'depth',label:'The exact water depth in this street.'},{id:'feelings',label:'Everybody’s feelings.'},{id:'both',label:'Both the exact street depth and everybody’s feelings.'}]}
]);
export const archiveSourceById=id=>ARCHIVE_SOURCES.find(s=>s.id===id)??null;
export const archiveEventById=id=>ARCHIVE_EVENTS.find(e=>e.id===id)??null;
export const archiveQuestionById=id=>ARCHIVE_QUESTIONS.find(q=>q.id===id)??null;
export const archiveMapCardById=id=>ARCHIVE_MAP_CARDS.find(c=>c.id===id)??null;
export const archiveReplyFieldById=id=>ARCHIVE_REPLY_FIELDS.find(f=>f.id===id)??null;
