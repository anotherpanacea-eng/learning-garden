// Original four-beat teaching content. Spec280 bounds this first Rhythm room.
export const RHYTHM_MODEL=Object.freeze({id:'rhythm-four-beat-v1',beats:4,beatSeconds:.5,frequency:330,waveform:'sine',peakGain:.025*2/3,attack:.015,release:.035,gap:.06});
export const RHYTHM_NOTES=Object.freeze([
 {id:'w',name:'Whole note',beats:4,fraction:'whole bar'},
 {id:'h',name:'Half note',beats:2,fraction:'one half of this bar'},
 {id:'q',name:'Quarter note',beats:1,fraction:'one quarter of this bar'},
 {id:'rq',name:'Quarter rest',beats:1,fraction:'one quarter of this bar'}
].map(Object.freeze));
export const rhythmNoteById=id=>RHYTHM_NOTES.find(n=>n.id===id)||null;
const echoPrompt="Bramble's magpie has a rhythm. Ask to hear it, then build a bar. You can show the example whenever you want.";
const source=(id,title,kind,prompt,target)=>Object.freeze({version:1,id,title,kind,prompt,model:RHYTHM_MODEL,target:target===null?null:Object.freeze(target)});
export const RHYTHM_SOURCES=Object.freeze([
 source('own-bar','A bar of your own','own','Make a rhythm for a job or a gathering. You can leave it unfinished, keep it, or change it again.',null),
 source('echo-1','Echo one','echo',echoPrompt,['q','q','h']),
 source('echo-2','Echo two','echo',echoPrompt,['h','q','q']),
 source('echo-5','Echo with a quiet beat','echo',echoPrompt,['q','rq','q','q'])
]);
export const rhythmSourceById=id=>RHYTHM_SOURCES.find(s=>s.id===id)||null;
export const RHYTHM_TEACHING=Object.freeze([
 {title:'One whole note',text:'One whole note takes all four beats of this bar.',sequence:['w']},
 {title:'Two half notes',text:'Each half note takes two beats. Two halves take the same time as one whole note. There are two sound beginnings instead of one.',sequence:['h','h']},
 {title:'Four quarter notes',text:'Each quarter note takes one beat. Four quarters fill the same bar. Four sound beginnings, the same two seconds.',sequence:['q','q','q','q']},
 {title:'A quiet beat',text:'This bar has three quarter notes and one quarter rest. The rest takes one beat too. It is quiet, and we keep counting.',sequence:['q','rq','q','q']}
].map(s=>Object.freeze({...s,sequence:Object.freeze(s.sequence)})));
