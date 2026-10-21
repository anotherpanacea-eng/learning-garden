import {configurations,heights,surfaces} from './workshop-core.mjs';

export const pages=['plan','try','tell'];
export const missions=[
 {id:'height',title:'Does ramp height change the landing distance?',purpose:'The parcel crew is planning a longer landing lane. Compare heights before advising them.'},
 {id:'surface',title:'Does the landing surface change the distance?',purpose:'A porch needs a shorter delivery stop. Compare surfaces before advising the crew.'},
];
export const modelNotice='Made-up model results, not real measurements. Each setup has three authored trials.';
export const designMessages={
 same:'Nothing changes between A and B. Repeats can show variation, but this pair does not compare different settings for your question.',
 confounded:'Both height and surface change. A different stop cannot tell us which change caused it.',
 'wrong-factor':'One thing changes, but it is not the thing your question asks about. These results can help with a different question.',
 focused:'Only the setting in your question changes. The other setting, cart and release procedure stay the same.',
};
export const predictionChoices=[{id:'A',label:'A might go farther'},{id:'B',label:'B might go farther'},{id:'similar',label:'Similar distances'},{id:'unsure',label:'Not sure yet'}];
export const claimChoices=[{id:'A',label:'A went farther'},{id:'B',label:'B went farther'},{id:'similar',label:'They look similar'},{id:'not-enough',label:'I need more evidence'}];
export function configLabel(id){const c=configurations.find(c=>c.id===id);return c?`${heights.find(h=>h.id===c.height).label} ramp · ${surfaces.find(s=>s.id===c.surface).label.toLowerCase()} surface`:String(id??'');}
