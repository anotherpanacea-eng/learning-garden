// Original modern teaching text. Historical image rights apply only to the named visual.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const ARCHIVE_PAGES=freeze(['parcel','place-dates','sources','reply']);
export const ARCHIVE_TASKS=freeze(['map','order','claims','source-choice','limits']);
export const ARCHIVE_DETAILS=freeze(['whole','boats','buildings']);
export const ARCHIVE_TEXT_LIMIT=2000;
export const ARCHIVE_PACK=freeze({id:'paris-flood-1910-v1',title:"Travelers’ Archive",visit:'Paris, 1910',
 question:'Did the water disappear as soon as the river reached its highest mark?',
 story:'A fictional parcel at our Paris bookstall holds a real old photograph and a modern archive’s dates. Help our present-day guides label the evidence and prepare a careful reply.',
 notice:'The parcel and guides are fictional. The historical photograph is real; our map, summaries and reply cards are modern teaching material.',
 sourceNotice:'These are two different kinds of source, not two independent eyewitness accounts. A source can help with one question without answering every question.',
 timelineNotice:'Order of these three dates; spaces do not show equal amounts of time.',
 mapNotice:'Original modern schematic, not to scale and not for finding a route. It does not show the extent of the flood.',
 checked:'2026-10-20 local / 2026-10-21 UTC'});
export const ARCHIVE_SOURCES=freeze([
 {id:'photo',title:'A photograph at the Quai des Grands-Augustins',type:'period-photograph',creator:'Identité judiciaire',creatorNotice:'The museum gives this creator attribution; the individual photographer and exact purpose are not stated here.',
  creationDate:'1910-01-29',creationPrecision:'day',creationLabel:'Museum production date: 29 January 1910',eventDate:'1910-01',eventPrecision:'month',eventLabel:'Scene identified with the January 1910 flood; exact capture moment not established here.',
  dateNotice:'A production date does not by itself prove exactly when the scene was photographed. The digital reproduction and catalog are modern.',
  summary:'This photograph records one view at the Quai des Grands-Augustins. We can look for water, boats and buildings. The museum dates its production to 29 January 1910; that does not by itself fix the exact moment pictured. It cannot tell us what every person felt or show the whole city.',
  summaryNotice:'Original modern guide to this source, written for the game; not historical testimony.',
  url:'https://www.parismuseescollections.paris.fr/fr/musee-carnavalet/oeuvres/crue-de-la-seine-janvier-1910-quai-des-grands-augustins',
  inventory:'PH8646',manifest:'https://apicollections.parismusees.paris.fr/iiif/320158523/manifest',
  image:{src:'./assets/archive-paris-1910-ph8646.jpg',original:'https://apicollections.parismusees.paris.fr/sites/default/files/styles/4k/collections/atoms/images/CAR/lpdp_30184-10.jpg?itok=2rfGM7e_',filename:'lpdp_30184-10.jpg',alt:'Historical monochrome photograph of water beside buildings at the Quai des Grands-Augustins. Boats and people appear near a raised wooden structure. This one view does not show all Paris or establish an exact street depth.',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',credit:'CC0 Paris Musées / Musée Carnavalet - Histoire de Paris',rightsReceipt:'The official catalog’s first/hero visual names lpdp_30184-10 and explicitly labels it CC0. That license does not apply automatically to other visuals or the entire website.',reproduction:'Unchanged local reproduction of the complete field of view; no resizing, colorization, restoration or invented detail.'}},
 {id:'chronology',title:'The archive’s sequence of dates',type:'modern-educational-chronology',creator:'Archives de Paris',creatorNotice:'A modern archive teaching chronology, not an eyewitness account.',
  creationDate:null,creationPrecision:'unknown',creationLabel:'Modern; exact publication date not stated in the PDF',eventDate:'1910-01/1910-03',eventPrecision:'range',eventLabel:'Selected events during the Paris flood, January–March 1910',
  dateNotice:'The events have dates. This modern teaching document’s exact publication date is not given; it is not a document written during the flood.',
  summary:'The Archives de Paris chronology puts several events in order. It records the river’s highest mark on 28 January, a flood-study commission in February and the river returning to its bed in March. This modern summary helps us compare dates; it does not show every street or give us a person’s private thoughts.',
  summaryNotice:'Original modern factual summary based on Archives de Paris; not a quotation or historical testimony.',
  url:'https://archives.paris.fr/offre-pedagogique/ressources-pedagogiques/la-crue-de-1910-une-societe-face-aux-risques',
  document:'https://archives.paris.fr/image/303449/11801454?crop=centre&download=1&force-inline=&format=pdf&realHeight=1754&realWidth=1240&region=full&size=!800,800',
  reuseNotice:'Only facts in original short summaries are used. No PDF layout, prose or image reproduction permission is inferred.'}
]);
export const ARCHIVE_EVENTS=freeze([
 {id:'river-peak',date:'1910-01-28',dateLabel:'28 January 1910',title:'The river’s highest mark',text:'The river reached its highest mark during this flood at the Austerlitz measuring scale.',sourceId:'chronology',notice:'Original modern summary based on Archives de Paris.'},
 {id:'commission',date:'1910-02-09',dateLabel:'9 February 1910',title:'A commission to study the flood',text:'The government formed a commission to study the flood and propose preventive measures.',sourceId:'chronology',notice:'Original modern summary based on Archives de Paris.'},
 {id:'river-returns',date:'1910-03-15',dateLabel:'15 March 1910',title:'The river returns to its bed',text:'The chronology records the Seine returning to its riverbed, with railway and metro services resuming.',sourceId:'chronology',notice:'Original modern summary based on Archives de Paris. This does not give a date when every street was dry.'}
]);
export const ARCHIVE_SITES=freeze([{id:'grands-augustins',label:'Quai des Grands-Augustins',symbol:'camera',description:'The place named for the photograph, beside the Seine.'},{id:'austerlitz',label:'Pont d’Austerlitz',symbol:'gauge',description:'The bridge where the river measuring scale stands.'},{id:'unsure',label:'Not sure yet',symbol:null,description:'We can compare the source labels.'}]);
export const ARCHIVE_MAP_CARDS=freeze([{id:'photo',label:'Photograph card',prompt:'Where does the source label place this photograph?',answer:'grands-augustins',sourceIds:['photo']},{id:'gauge',label:'Highest-mark card',prompt:'Where does the chronology name the measuring scale?',answer:'austerlitz',sourceIds:['chronology']}]);
const visible=[{id:'visible',label:'Shown in this picture'},{id:'not-shown',label:'Not shown by this picture'},{id:'unsure',label:'Not sure yet'}];
const sourceChoices=[{id:'photo',label:'The photograph'},{id:'chronology',label:'The chronology'},{id:'neither',label:'Neither supplied source'},{id:'unsure',label:'Not sure yet'}];
export const ARCHIVE_QUESTIONS=freeze([
 {id:'visible-boats',task:'claims',prompt:'The picture shows boats and water beside buildings. Is that shown?',choices:visible,answer:'visible',sourceIds:['photo'],feedback:'Boats, water and buildings are visible in this full image. That is a local picture detail, not a statement about all Paris.'},
 {id:'visible-feelings',task:'claims',prompt:'Everyone in Paris was happy. Does this picture show that?',choices:visible,answer:'not-shown',sourceIds:['photo'],feedback:'One picture cannot show everyone’s feelings. We do not know what these particular people thought from their appearance.'},
 {id:'visible-depth',task:'claims',prompt:'The water was exactly one meter deep here. Does this picture measure that?',choices:visible,answer:'not-shown',sourceIds:['photo'],feedback:'There is no measured street-depth scale in this picture. Visible water alone does not establish an exact depth.'},
 {id:'source-view',task:'source-choice',prompt:'Which supplied source helps us look at what is visible at this quay?',choices:sourceChoices,answer:'photo',sourceIds:['photo','chronology'],feedback:'The photograph supplies one view at the named quay. The chronology selects dates and events rather than showing this view.'},
 {id:'source-peak',task:'source-choice',prompt:'Which supplied source gives the date of the river’s recorded peak?',choices:sourceChoices,answer:'chronology',sourceIds:['photo','chronology'],feedback:'The chronology dates the peak to 28 January. A production date on a photo is a different kind of date.'},
 {id:'source-thoughts',task:'source-choice',prompt:'Which supplied source tells us exactly what a particular person was thinking?',choices:sourceChoices,answer:'neither',sourceIds:['photo','chronology'],feedback:'Neither supplied source records a particular person’s private thoughts. Not every question has an answer in this small packet.'},
 {id:'peak-return',task:'limits',prompt:'What do the chronology’s peak and return cards support?',choices:[{id:'later',label:'The river’s return to its bed is dated after the peak.'},{id:'all-city',label:'All Paris stayed underwater until March.'},{id:'depth',label:'We know the exact water depth in every street.'},{id:'unsure',label:'Not sure yet'}],answer:'later',sourceIds:['chronology'],feedback:'The chronology places the peak on 28 January and the return on 15 March. It does not date every street drying or measure every street’s depth.'},
 {id:'photo-date',task:'limits',prompt:'Does a 29 January production date prove exactly when this scene was photographed?',choices:[{id:'not-alone',label:'Not by itself; the exact capture moment is not established here.'},{id:'exact',label:'Yes, it proves the exact moment pictured.'},{id:'tone',label:'The black-and-white tones prove the scene date.'},{id:'unsure',label:'Not sure yet'}],answer:'not-alone',sourceIds:['photo'],feedback:'The museum’s production date and the scene’s exact capture time are not automatically identical. Its title identifies the January flood; image tone cannot supply a date.'}
]);
export const ARCHIVE_REPLY_FIELDS=freeze([
 {id:'claim',label:'What I can say',choices:[{id:'return-later',label:'The chronology places the river’s return after its peak.'},{id:'all-dry',label:'All Paris was dry as soon as the river peaked.'},{id:'unsure',label:'I’m not sure yet.'}]},
 {id:'evidence',label:'My evidence',choices:[{id:'chronology',label:'The chronology’s peak and return cards.'},{id:'photo',label:'The photograph alone.'},{id:'both',label:'The chronology gives dates; the photo adds a local view.'},{id:'image-tone',label:'The picture’s black-and-white tones.'}]},
 {id:'limit',label:'What these sources cannot tell me',choices:[{id:'depth',label:'The exact water depth in this street.'},{id:'feelings',label:'Everybody’s feelings.'},{id:'both',label:'Both the exact street depth and everybody’s feelings.'}]}
]);
export const archiveSourceById=id=>ARCHIVE_SOURCES.find(s=>s.id===id)??null;
export const archiveEventById=id=>ARCHIVE_EVENTS.find(e=>e.id===id)??null;
export const archiveQuestionById=id=>ARCHIVE_QUESTIONS.find(q=>q.id===id)??null;
export const archiveMapCardById=id=>ARCHIVE_MAP_CARDS.find(c=>c.id===id)??null;
export const archiveReplyFieldById=id=>ARCHIVE_REPLY_FIELDS.find(f=>f.id===id)??null;
