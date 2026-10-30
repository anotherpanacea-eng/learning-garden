export const walkCopy={
 idea:'A clock reading tells when. Elapsed minutes tell how long from departure. Start at 0 elapsed minutes; keep departure fixed as the model moves.',
 scale:'The long minute hand moves 5 minutes from one clock number to the next. The short hour hand keeps moving between hour numbers. Each small timeline interval is 5 minutes; one whole minute-hand turn is 60 minutes.',
 window:'This pretend arrival is after departure, within the next 60 minutes. The clock labels do not say morning or afternoon.',
 walkIdea:'A clock reading tells when. Elapsed minutes tell how long from departure.',
 instruction:'Move our model to the requested arrival. Propose the card’s elapsed minutes.',
 durationPrompt:'How many minutes from the card’s departure to its requested arrival?',
 help:'Keep the departure where it is. Count forward in five-minute spaces. At the next hour, the minute display returns to 00, but elapsed minutes keep increasing. Sixty minutes make one hour. Moving back revises this model. It does not change the fixed departure or the card’s arrival.',
 endpointBlank:'No definite arrival model was proposed.',endpointFits:'Our proposed model reaches the requested arrival.',endpointDifferent:'Our proposed model is at a different time. It stays open to revise.',
 durationBlank:'No definite number of minutes was proposed.',durationFits:'The proposed minutes fit the card’s departure-to-arrival interval.',durationDifferent:'The proposed minutes differ from the card’s departure-to-arrival interval. They stay open to revise.',
 ending:'The labeled line and coupled hands are supplied practice. These two responses describe different things.',
 reference:'Departure {departureLabel}. Requested arrival {arrivalLabel}.',model:'Our model {modelLabel}, {offset} elapsed minutes.',
 mathematical:'From {departureLabel} to {arrivalLabel}: {duration} minutes. Our current model is {modelLabel}, {offset} minutes from departure.'
};
const example={departureMinute:585,offsets:[0,15,25],captions:[
 'Keep 9:45 as the departure. No minutes have passed in this model yet.',
 'Advance 15 minutes to 10:00. The hour changes; our elapsed count keeps going.',
 'Another 10 minutes reaches 10:10. 15 + 10 makes 25 elapsed minutes.'
]};
export const walkTime=m=>`${Math.floor((m%720)/60)||12}:${String(m%60).padStart(2,'0')}`;
const rows=[
 ['lantern-note','A note for the lantern makers','Carry a note from the post desk to the lantern makers.',550,575],
 ['ribbon-note','Another note from the same desk','A second note leaves the same post desk for the ribbon table.',550,590],
 ['bridge-card','The bridge card','Carry a thank-you card to the bridge helpers.',590,610],
 ['book-slip','The reading-corner slip','Take a book slip to the reading corner.',635,680],
 ['twelve-card','A card past the twelve','Carry a painted card to the next meeting table.',710,10],
 ['bell-note','The bell note','Take a rehearsal note to the bell keeper.',15,75]
];
export const walkCases=rows.map(([id,title,story,departureMinute,arrivalMinute])=>({version:1,model:'clock-walk-five-v1',id,title,story,departureMinute,arrivalMinute,departureLabel:walkTime(departureMinute),arrivalLabel:walkTime(arrivalMinute),minuteStep:5,windowMinutes:60,cycleMinutes:720,copy:structuredClone(walkCopy),example:structuredClone(example)}));
