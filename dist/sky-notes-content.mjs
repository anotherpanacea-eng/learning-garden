// Spec 323 copy, from docs/content/323-sky-notes-text.md. Child lines never explain why the moon changes shape.
export const SKY_SHAPES=Object.freeze([
 {code:'thin-growing',label:'Thin and growing'},
 {code:'half-growing',label:'Half and growing'},
 {code:'fat-growing',label:'Nearly full and growing'},
 {code:'full',label:'Full'},
 {code:'fat-shrinking',label:'Nearly full and shrinking'},
 {code:'half-shrinking',label:'Half and shrinking'},
 {code:'thin-shrinking',label:'Thin and shrinking'},
 {code:'not-seen',label:'I couldn’t see the moon'},
].map(Object.freeze));
export const SKY_CODES=Object.freeze(SKY_SHAPES.map(s=>s.code));
const CODES=new Set(SKY_CODES);
export const skyShape=code=>typeof code==='string'&&CODES.has(code)?SKY_SHAPES.find(s=>s.code===code):null;
export const SKY_COPY=Object.freeze({
 eyebrow:'Dot’s almanac · the sky',
 title:'Sky notes',
 intro:'Dot keeps a note of the moon. Look outside first, with a grown-up if it’s dark. Which shape looks most like the moon you saw?',
 safety:'Never look straight at the sun.',
 save:'Save today’s note',
 saved:'Saved. Dot drew today’s moon in the strip.',
 same:'That is already today’s note.',
 noChoice:'Choose a shape first.',
 dateChanged:'The date on this device changed. Refresh to see today. Nothing was saved.',
 refresh:'Refresh',
 full:'Dot’s sky book is full on this device. Today’s note can still be changed. Grown-ups can download the notes from Grown-up notes.',
 notKept:'This change could not be kept safely. Your earlier work is unchanged. Download your notes or keep exploring.',
 noDate:'This device date cannot be used here. Earlier notes are still kept.',
 hear:'Hear this page',
 unavailable:'Sky notes can’t be saved for this explorer right now. The rest of the almanac is open.',
 growing:'Not sure if it’s growing or shrinking? Pick the shape. Look again in a few nights and see which way it went.',
 hemisphereLabel:'Moon pictures',
 north:'North of the equator',
 south:'South of the equator',
 hemisphereHelp:'The moon looks flipped from the other half of the world. Pick the one that matches where you are. Near the equator, pick either one; the moon can look tipped on its side.',
 hemisphereSaved:'Moon pictures changed. Your notes stay the same.',
 emptyDay:'no note',
 earlier:'Earlier month',
 later:'Later month',
 thisMonth:'This month',
 noNotes:'No sky notes yet. The first one can be today, or any night you like.',
 entryTitle:'Sky notes',
 entryBody:'Look at the moon tonight. Note the shape you see.',
});
// The label reads mid-sentence, so it starts lowercase; not-seen reads as a clause.
export const changePrompt=label=>`You noted ${label==='I couldn\u2019t see the moon'?'that you couldn\u2019t see the moon':label.charAt(0).toLowerCase()+label.slice(1)} today. Choose another shape and save to change it.`;
export const SKY_PANELS=Object.freeze([
 Object.freeze({code:'full',title:'It’s the same moon.',body:'Thin, half or full, it’s the same moon every night. Only the part we can see changes.'}),
 Object.freeze({code:'not-seen',title:'At new moon, it’s still there.',body:'For a few days each month we can’t see the moon at all. It hasn’t gone anywhere. It’s up in the daytime sky, close to the sun, where it’s too hard to see. On other nights, clouds can hide it.'}),
 Object.freeze({code:'thin-growing',title:'The pattern comes back.',body:'From one full moon to the next is about 29 and a half days. That’s about a month.'}),
]);
export const SKY_GROWNUP=Object.freeze({
 about:'Sky notes: one moon shape per date, chosen by the explorer after looking. These are the explorer’s own observations. The game does not check them against the real moon and does not grade them. Moon pictures follow the northern or southern setting chosen here; the game stores no location.',
 names:'Child label to astronomy name, for grown-ups only: thin and growing = waxing crescent; half and growing = first quarter; nearly full and growing = waxing gibbous; full = full moon; nearly full and shrinking = waning gibbous; half and shrinking = last quarter; thin and shrinking = waning crescent.',
 quarter:'A half moon is called a quarter moon because the moon is a quarter of the way around its orbit.',
});
// End of the grown-up copy.
