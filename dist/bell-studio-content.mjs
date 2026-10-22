// Original call invitations and exact computer-tone model. Design references
// and their separate licenses are documented in spec 48; no copied melodies.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const BELL_MODEL=freeze({id:'bell-studio-v1',waveform:'sine',slotSeconds:.5,toneSeconds:.35,attackSeconds:.015,releaseSeconds:.035,peakGain:.025,maxSlots:8,
 notice:'These are simple computer tones for our bell calls, not recordings of a metal bell.',
 volumeCue:'Start with your device volume low. Stop whenever you want.',
 idea:'In these computer tones, faster repeated changes make a higher pitch. Higher pitch does not mean louder.',
 diagramNotice:'A schematic of the source signal changing over the same short time, not a measurement of the speaker or a drawing of air moving up and down.'});
export const BELL_NOTES=freeze([{id:'low',name:'Low',frequency:220,cycles:2,shape:'circle'},{id:'middle',name:'Middle',frequency:330,cycles:3,shape:'diamond'},{id:'high',name:'High',frequency:440,cycles:4,shape:'triangle'},{id:'rest',name:'Rest',frequency:null,cycles:0,shape:'pause'}]);
export const BELL_CARDS=freeze([
 {id:'cafe-gather',title:'Gather for dinner',purpose:'Purl wants a repeatable call to gather neighbors for dinner. Choose the pitches.',request:'Two matching tones, a rest, then two matching tones. You choose the pitch of each pair.',rule:'two-pairs'},
 {id:'post-arrival',title:'A courier arrives',purpose:'A courier wants a short arrival call that finishes higher than it begins.',request:'Make three sounding notes. Finish higher than you begin; choose any middle note.',rule:'finish-higher'},
 {id:'garden-return',title:'A phrase returns',purpose:'Garden helpers want a three-note phrase they can recognize when it comes again.',request:'Invent three sounding notes, then repeat those same three in order.',rule:'repeat-three'},
 {id:'own-call',title:'A call of your own',purpose:'Choose a call for any imaginary garden gathering, then tell someone its purpose.',request:'Try one to eight slots, with at least one sounding note. You decide what the call means.',rule:'own'}
].map(c=>({...c,model:BELL_MODEL})));
export const BELL_PAIRS=freeze([{id:'rise',title:'Low, then High',sequence:['low','high']},{id:'fall',title:'High, then Low',sequence:['high','low']},{id:'same',title:'Middle, then Middle',sequence:['middle','middle']}].map(p=>({...p,modelId:BELL_MODEL.id})));
export const BELL_PAGES=freeze(['choose','make','compare','keep']);
export const BELL_RESPONSES=freeze(['higher','lower','same','not-sure']);
export const BELL_SUPPORT=freeze(['visual','editing','audioRequested','pairAudioRequested','narration','ladder','signalDiagram','together','visualInspection','arrangementFeedback','comparisonFeedback']);
export const BELL_REFLECTION='What changed? What stayed the same? Does this call help its listener?';
export const bellNoteById=id=>BELL_NOTES.find(n=>n.id===id)||null;
export const bellCardById=id=>BELL_CARDS.find(c=>c.id===id)||null;
export const bellPairById=id=>BELL_PAIRS.find(p=>p.id===id)||null;
