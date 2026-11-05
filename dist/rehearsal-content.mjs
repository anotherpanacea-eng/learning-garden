// Original supplied scenes. Each working source freezes its own words and stage data.
const event=(actor,prop=null)=>({actor,prop,propName:prop===null?null:({'letter':'a letter','umbrella':'an umbrella','paper-moon':'a paper moon'})[prop]});
const cast=(...ids)=>ids.map(id=>({id,name:({pip:'Pip',dot:'Dot',rabbit:'Rabbit',dragon:'Dragon',kitten:'Kitten'})[id],art:id}));
const cue=(id,text,authorKind,authorSpeaker,reason,action=null)=>({id,text,authorKind,authorSpeaker,reason,event:action});
const jobs=[
 {id:'curtain',title:'Before the curtain',setting:"The town's puppets are getting ready for a show after the storm. Who speaks, and what does the audience see?",cast:cast('pip','dot'),cues:[
 cue('curtain','Dot lifts the curtain.','direction',null,'The writer wants the audience to see Dot opening the show, without someone saying the instruction.',event('dot')),
 cue('seats','Has everyone found a seat?','speech','pip','Pip asks the audience a question.'),
 cue('waiting','One seat is waiting.','speech','dot',"Dot replies to Pip's question."),
 cue('point','Dot points to a chair.','direction',null,'In a live show, the direction can draw attention to the waiting seat; it is not another spoken reply.',event('dot'))]},
 {id:'letter',title:'The letter without a name',setting:'Two actors rehearse a tiny delivery mystery. A letter prop stands in for their envelope.',cast:cast('dot','pip'),cues:[
 cue('arrives','Pip brings the letter.','direction',null,'The audience sees the arrival before the characters discuss it.',event('pip','letter')),
 cue('name','This one has no name.','speech','dot','Dot notices the missing name.'),
 cue('turn','Dot turns the envelope over.','direction',null,'The writer gives Dot an action to try, rather than words to say.',event('dot','letter')),
 cue('ask','Then we should ask before opening it.','speech','pip',"Pip responds after Dot has looked at the envelope.")]},
 {id:'moon',title:'A place for the moon',setting:'A moon prop needs a place on the pretend stage. Try the same words with another speaker.',cast:cast('rabbit','dragon'),cues:[
 cue('moon','Rabbit carries a paper moon.','direction',null,'This is a pretend prop, not a claim that a rabbit can carry the real Moon.',event('rabbit','paper-moon')),
 cue('here','Shall I put it here?','speech','rabbit',"Rabbit is the character carrying the prop in this plan."),
 cue('point','Dragon points across the stage.','direction',null,'The pointing is visible while the words stay backstage.',event('dragon')),
 cue('there','Over there, beside the curtain.','speech','dragon',"Dragon supplies a place for Rabbit's question.")]},
 {id:'shower',title:'A pretend shower',setting:'The actors rehearse a rainy scene with an umbrella prop. Changing the order can change what surprises us.',cast:cast('kitten','dot'),cues:[
 cue('waits','Kitten waits beside the umbrella.','direction',null,'Waiting is a direction for a performer, not a required spoken sentence.',event('kitten','umbrella')),
 cue('rain','Is it still raining?','speech','kitten','Kitten asks about the pretend weather.'),
 cue('offer','Only on the pretend roof.','speech','dot','Dot answers about the roof of their pretend stage.'),
 cue('wave','Dot waves to Kitten.','direction',null,'The wave can accompany the reply without being announced.',event('dot'))]},
 {id:'whose',title:'Whose letter?',setting:'Three actors need to make clear who is talking about the letter. The name before a line matters.',cast:cast('pip','dot','rabbit'),cues:[
 cue('enters','Rabbit brings a letter.','direction',null,"This plan begins with Rabbit's arrival.",event('rabbit','letter')),
 cue('mine','Is that for me?','speech','pip','Pip asks Rabbit about the arriving letter.'),
 cue('turn','Rabbit turns toward Dot.','direction',null,'The action can help an audience notice whom Rabbit addresses.',event('rabbit')),
 cue('dot','It has your name on it.','speech','rabbit','In this plan Rabbit speaks to Dot, after turning toward her.'),
 cue('reply','Then I will read it aloud.','speech','dot','Dot responds as the named recipient; moving this line changes when that is clear.')]},
 {id:'silence',title:'One more rehearsal',setting:'The last rehearsal includes a pause. No automatic timer decides how long a performer should wait.',cast:cast('dragon','rabbit','kitten'),cues:[
 cue('ready','Is the audience ready?','speech','dragon','Dragon asks the audience.'),
 cue('pause','Silence.','direction',null,'Our writer means a pause here. An actor could instead say “Silence.” as a command. People decide how to stage a pause; this picture has no timer or shared action.'),
 cue('listen','I think I heard a mouse.','speech','kitten','Kitten supplies the next spoken thought.'),
 cue('question','In the audience or in our play?','speech','rabbit','Rabbit answers Kitten with a question.'),
 cue('end','Dragon holds up a letter.','direction',null,'A new visible detail can invite a different ending.',event('dragon','letter'))]}
];
export const rehearsalCases=Object.freeze(jobs.map(({id,title})=>Object.freeze({id,title})));
export function makeRehearsalSource(id='curtain'){
 const j=jobs.find(j=>j.id===id);if(!j)return null;const [a,b]=j.cast,direction=`${b.name} holds up the letter.`;
 const example=(kind,speaker,text,action=null)=>({kind,speaker,text,event:action});
 return structuredClone({v:1,...j,initialOrder:[j.cues.at(-1).id,...j.cues.slice(0,-1).map(c=>c.id)],authorOrder:j.cues.map(c=>c.id),teaching:[
 {words:"A script is a plan for a performance. A cast list tells us the characters. A cue is one part of the script. A speaker's name tells an actor whose words to say.",example:example('speech',a.id,'Will you show us the letter?')},
 {words:'In this script convention, brackets hold directions for the performers. The audience can see the action without hearing these words.',example:example('direction',null,direction,event(b.id,'letter'))},
 {words:"Now the other actor replies. The name before the line tells us who speaks.",example:example('speech',b.id,'Here it is.')},
 {words:'What if we say the direction instead? The audience hears the sentence. Our picture does not carry out that action. Some shows have a narrator who reads directions aloud; that is not wrong. Here a puppet can try those words too.',example:example('speech',b.id,direction)},
 {words:"Changing a speaker can change who knows something. Moving a cue can change what a reply seems to answer. Try your version; then compare with the writer's plan. A person may stage it another way.",example:null}
 ]});
}
export const rehearsalCopy=Object.freeze({title:'Rehearsal Cues',entry:'Turn a script into a little show.',instruction:'Choose a cue. Decide whether it is spoken or followed, then choose who speaks.',
 convention:"The writer's plan is one way to stage these words. Your version can tell a different story. Try both with a person. Some shows have a narrator read directions aloud; here a puppet can try those words too.",
 stageLimit:'This picture shows only the current cue. A highlighted actor and a prop stand for an action; people decide how to perform it. Saying a direction does not make the puppet carry out its action.',
 draft:'Unkept scripts wait in this open page. Keep a version to include it in Notes.',
 pending:'Some puppet words have not been kept. Return to them before opening rehearsal; your typing is still here.',
 refused:'This version could not be kept safely. Your work and earlier scripts are unchanged. Download Notes or keep rehearsing.',
 unknown:'This earlier format stays unchanged in Notes. You can still make another script.',
 stale:'The kept scripts changed. Reopen them before continuing.',
 saved:'When kept, this version was saved on this device.',session:'When kept, saving was off. Download Notes to keep a file.',uncertain:'When kept, device saving was not confirmed. Download Notes to keep a file.',
 grownup:'These are supplied scenes and an authored stage model. Supplied words, chosen roles and order describe a construction, not comprehension, independent reading, original script writing or oral performance. View flags name what was opened in this version, not attention or all prior exposure. Unfinished and unexpected versions are retained without judgement. Your original puppet dialogue stays in Story Loft.'});
