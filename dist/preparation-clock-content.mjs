export const clockPages=['read','set','kept'];
const rows=[
 ['labels','Parcel labels','The storm-recovery market needs labels for its parcel table.',18,[17,18,19],19,'One 30-minute step makes half an hour.'],
 ['maps','Market maps','A stack of maps is ready for the courier’s morning market visit.',19,[19,20,18],20,'One 30-minute step reaches the next hour numeral.'],
 ['books','Library parcel','The library is sending a parcel of books to the market reading corner.',20,[21,19,20],22,'Two 30-minute steps make 60 minutes, one hour.'],
 ['notes','Café note bundle','The café is sending menu notes for the market welcome table.',20,[19,20,21],21,'One 30-minute step makes half an hour. This preparation time is also used by another case, with a different departure.'],
];
const label=slot=>`${Math.floor(slot/2)||12}:${slot%2?'30':'00'}`;
const picture=slot=>{const h=Math.floor(slot/2)||12,next=h===12?1:h+1;return `The short hour hand ${slot%2?`lies halfway from ${h} toward ${next}`:`points at ${h}`}; the long minute hand points at ${slot%2?6:12}.`;};
export const clockCases=rows.map(([id,title,story,preparationSlot,options,departureSlot,worked])=>({version:1,id,title,story,readingPrompt:'What digital time matches the preparation clock?',settingPrompt:'Set our model clock to the requested departure.',preparationSlot,departureSlot,departureLabel:label(departureSlot),readingOptions:options.map(slot=>({slot,label:label(slot)})),pictureText:picture(preparationSlot),drawingVersion:1,slotMinutes:30,hourMinutes:60,cycleSlots:24,help:`The preparation clock shows ${label(preparationSlot)}. ${picture(preparationSlot)} The requested departure is ${label(departureSlot)}. ${worked} The model moves both hands together. Its 24 half-hour positions cover a 12-hour face, not a day. Moving the face does not move a real appointment. Reading a clock and setting our model are two different responses.`}));
export const clockSource=id=>{const source=clockCases.find(s=>s.id===id);return source?structuredClone(source):null;};
