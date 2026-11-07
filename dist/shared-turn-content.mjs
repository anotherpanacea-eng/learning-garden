// Original finite teaching examples; no learner records or generated practice.
const freeze = value => { if(value && typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const sharedTurnJobs=freeze([
 {whole:180,given:30,missing:150},{whole:180,given:90,missing:90},
 {whole:180,given:120,missing:60},{whole:180,given:150,missing:30},
 {whole:360,given:45,missing:315},{whole:360,given:120,missing:240},
 {whole:360,given:225,missing:135},{whole:360,given:300,missing:60}
]);
export const sharedTurnLessons=freeze([
 {title:'One whole, two parts.',text:'A half turn is 180°. These two parts meet at the same pin. They fill the half turn without a gap or overlap. 60° + 120° = 180°. We add amounts of turn, not the lengths of the drawn arms.',whole:180,first:60,gap:false},
 {title:'All the way around.',text:"A full turn is 360°. The starting and ending rays point the same way after one full turn. That is still a full turn, not no turn. Here 90° + 270° = 360°. Follow the marked second sweep from the dividing ray to the ending ray. Don't replace it with the smaller 90° turn between its ends.",whole:360,first:90,gap:false},
 {title:'Cover a label.',text:'The two parts fill 180°. One part is 135°. Call the missing measure x. That letter stands for a measure we do not yet know. 135° + x = 180°, so x = 180° − 135° = 45°. Check: 135° + 45° = 180°.',whole:180,first:135,gap:false},
 {title:'Check the gap.',text:'Do the marked parts fill the half turn? Here two 60° parts leave a 60° gap inside a half turn. 60° + 60° = 120°, not 180°. We must count the gap too. Add parts to find the whole only when they really fill it, with no gap or overlap.',whole:180,first:60,gap:true}
]);
export const sharedTurnCopy=freeze({
 title:'Share a turn',entryIntro:'The miller is trying two colors for a turning sign. How can two parts share the same turn?',
 intro:'A drawing for the town sign. Explore two parts of one turn, then cover a label.',
 lifetime:'Your parts and ideas stay while you visit Hinge Bench. Leaving the room or opening the explorer chooser clears them. Your notes are not changed.',
 buildTeaching:'A degree is one of 360 equal parts of a full turn. These two marked parts share one pin and fill the whole. Turn the whole picture: their measures stay the same.',
 curveNote:'The curves are drawn at different sizes so you can tell them apart. Their size does not change the turn.',
 invalidIdea:'Use digits for a whole number from 0 to 360. Clear my idea removes a kept idea.',
 emptyIdea:'No idea kept yet. You can think together.',draftNote:'Keep my idea puts your draft beside the drawing.',
 invalidDraft:'The draft field has text that is not a whole-number idea yet.',
 wholeReason:'Your first part is larger than 180°. Choose a smaller first part before changing to a half turn.',
 rotation:'The picture turned. Measures did not change.',
 full:'The ending ray points along the starting ray after one full turn.',
 dividerStart:'The divider points along the starting ray.',dividerEnd:'The divider points along the ending ray.',
 allRays:'All three rays point the same way. Follow the marked sweeps to distinguish no turn from one full turn.'
});
