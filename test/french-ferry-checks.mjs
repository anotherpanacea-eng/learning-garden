import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCrossingSource,crossingIds,ferryText} from '../dist/french-ferry-content.mjs';
import {validCrossingSource,validCrossing,feedbackFor,feedbackLine,currentStep,frenchFerryView,openCrossing,pickAnswer,sayAnswer,useFerrySupport,countListen,markSpeechStarted,startCrossingAgain} from '../dist/french-ferry-core.mjs';
import {frenchFerryPage,frenchFerryNotes,frenchVoiceAvailable} from '../dist/french-ferry-ui.mjs';
let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
const yes={canExport:()=>true},no={canExport:()=>false},bytes=s=>JSON.stringify(s);
const voice={voice:true};
const fr={name:'Amélie',lang:'fr-FR',localService:true,voiceURI:'amelie'},en={name:'Samantha',lang:'en-US',localService:true,voiceURI:'sam'},remote={name:'Cloud',lang:'fr-FR',localService:false,voiceURI:'cloud'};
const cross=(st,k)=>st.frenchFerry.crossings[k];
// Visible page text, without the speech attribute that carries her line for the voice.
const shown=(st,voices)=>frenchFerryPage(st,'',voices).replace(/data-speak="[^"]*"/g,'');
function finish(st,k){const s=cross(st,k).source;for(let i=0;i<4;i++){pickAnswer(st,k,s.steps[i].fit,yes);sayAnswer(st,k,'said',yes);}sayAnswer(st,k,'not-now',yes);pickAnswer(st,k,s.steps[4].fit,yes);}

// Both crossings: valid frozen sources with their own facts and question order.
const kinds={};
for(const k of crossingIds){
 const s=makeCrossingSource(k);kinds[k]=s.steps.slice(0,4).map(x=>x.kind).join();
 ok(validCrossingSource(s)&&Object.isFrozen(s)&&Object.isFrozen(s.cards),`${k} source is valid and frozen`);
 ok(s.cards.length===8&&['count','to','from','time'].every(kind=>s.cards.filter(c=>c.kind===kind).length===2),`${k}: eight cards, two of each kind`);
 ok(s.steps.slice(0,4).every(x=>s.cards.some(c=>c.kind===x.kind&&c.id!==x.fit)),`${k}: every step has a right-kind card with the wrong detail`);
 ok(new TextEncoder().encode(bytes(s)).length<=32*1024,`${k} source fits 32 KiB`);
}
ok(kinds.morning!==kinds.afternoon,'the crossings ask in different orders');
ok(makeCrossingSource('morning').steps[4].choices.map(c=>c.label).join('|')===`2 o'clock|10 o'clock|12 o'clock`&&makeCrossingSource('afternoon').steps[4].choices.map(c=>c.label).join('|')==='3 euros|13 euros|30 euros','step 5 choices in companion order');

// Every feedback case, in the spec's precedence, for every wrong card on every step.
for(const k of crossingIds){
 const s=makeCrossingSource(k);
 s.steps.slice(0,4).forEach((step,i)=>{for(const card of s.cards){
  const f=feedbackFor(s,i,card.id);
  const want=card.id===step.fit?'fit':step.kind==='from'&&card.kind==='to'?'a-for-dou':step.kind==='to'&&card.kind==='from'?'de-for-ou':card.kind!==step.kind?`kind-${card.kind}`:`detail-${{count:'count',time:'time',to:'place',from:'place'}[step.kind]}`;
  ok(f===want&&feedbackLine(s,f),`${k} step ${i+1}, ${card.id}: ${f}`);
  if(f.startsWith('kind-'))ok(!/Où|D'où|Combien|quelle/.test(feedbackLine(s,f)),'wrong-kind line never names the question word');
 }});
 s.steps[4].choices.forEach(c=>ok(feedbackFor(s,4,c.id)===(c.id===s.steps[4].fit?'fit5':'sounds'),`${k} step 5, ${c.id}`));
}
ok(feedbackLine(makeCrossingSource('morning'),'a-for-dou')==="That card tells where you are going. Listen again to Madame Roux's question.",'À-for-D\'où line');

// A whole crossing: picks, saying, step 5 and Crossed.
{
 const st={};ok(bytes(frenchFerryView(st))&&!('frenchFerry' in st),'reading the view makes no write');
 ok(openCrossing(st,'morning',voice,yes).ok&&st.frenchFerry.taughtSeen&&Object.keys(st.frenchFerry.crossings).join()==='morning','opening creates only that crossing and marks the teaching seen');
 const s=cross(st,'morning').source;
 ok(pickAnswer(st,'morning','a-cinq',yes).feedback==='kind-time','a wrong-kind pick');
 ok(pickAnswer(st,'morning','trois',yes).feedback==='detail-count','a right-kind wrong-detail pick');
 ok(sayAnswer(st,'morning','said',yes).ok===false,'no saying before a fitting pick');
 ok(pickAnswer(st,'morning','deux',yes).fitted&&currentStep(cross(st,'morning')).phase==='say','fit moves to saying');
 ok(cross(st,'morning').steps[0].picks.join()==='a-cinq,trois,deux','picks kept in order');
 ok(pickAnswer(st,'morning','deux',yes).ok===false,'no more picks once fitted');
 ok(sayAnswer(st,'morning','not-now',yes).ok&&currentStep(cross(st,'morning')).index===1,'Not this time moves on');
 for(let i=1;i<4;i++){pickAnswer(st,'morning',s.steps[i].fit,yes);sayAnswer(st,'morning','said',yes);}
 ok(currentStep(cross(st,'morning')).index===4&&currentStep(cross(st,'morning')).phase==='say','step 5 starts with saying');
 ok(pickAnswer(st,'morning','h10',yes).ok===false,'no answer before the question is said');
 sayAnswer(st,'morning','said',yes);
 ok(pickAnswer(st,'morning','h2',yes).feedback==='sounds'&&cross(st,'morning').state==='started','a sounds-alike pick');
 ok(pickAnswer(st,'morning','h10',yes).fitted&&cross(st,'morning').state==='crossed'&&currentStep(cross(st,'morning')).phase==='end','Crossed');
 ok(validCrossing(cross(st,'morning'))&&frenchFerryView(st).crossings.morning.label==='crossed','label Crossed');
}

// I said it and Not this time never affect Crossed.
{
 const a={},b={};openCrossing(a,'afternoon',voice,yes);openCrossing(b,'afternoon',voice,yes);
 const s=cross(a,'afternoon').source;
 for(let i=0;i<4;i++){pickAnswer(a,'afternoon',s.steps[i].fit,yes);sayAnswer(a,'afternoon','said',yes);pickAnswer(b,'afternoon',s.steps[i].fit,yes);sayAnswer(b,'afternoon','not-now',yes);}
 sayAnswer(a,'afternoon','said',yes);sayAnswer(b,'afternoon','not-now',yes);pickAnswer(a,'afternoon','e3',yes);pickAnswer(b,'afternoon','e3',yes);
 ok(cross(a,'afternoon').state==='crossed'&&cross(b,'afternoon').state==='crossed','either saying button crosses the same');
}

// Support is marked before it shows; replay counts are separate from support and from speech started.
{
 const st={};openCrossing(st,'morning',voice,yes);
 ok(!shown(st,[fr]).includes('Bonjour'),'her words start hidden');
 ok(useFerrySupport(st,'morning','words',yes).ok&&cross(st,'morning').steps[0].wordsShown,'words marked');
 ok(shown(st,[fr]).includes('Bonjour'),'words show after marking');
 ok(!shown(st,[fr]).includes('There are two of us.'),'no English before meaning');
 useFerrySupport(st,'morning','meaning',yes);ok(frenchFerryPage(st,'',[fr]).includes('There are two of us.'),'English shows after meaning is marked');
 for(let n=0;n<120;n++)countListen(st,'morning','listen',yes);
 const x=cross(st,'morning').steps[0];ok(x.listens===99&&x.modelListens===0,'listens saturate at 99');
 const st2={};openCrossing(st2,'morning',voice,yes);countListen(st2,'morning','listen',yes);countListen(st2,'morning','model',yes);
 const y=cross(st2,'morning').steps[0];ok(!y.wordsShown&&!y.meaning&&!y.speechStarted&&y.listens===1&&y.modelListens===1,'replays are not support or speech started');
 const kept=bytes(st2);ok(useFerrySupport(st2,'morning','meaning',no).ok===false&&bytes(st2)===kept,'a refused support write changes nothing');
}

// speechStarted only from the event path, with her words hidden, on the current step.
{
 const st={};openCrossing(st,'morning',voice,yes);
 ok(!cross(st,'morning').steps[0].speechStarted,'never-pressed Hear leaves it false');
 ok(markSpeechStarted(st,'morning',2,yes).ok===false,'another step cannot be marked');
 ok(markSpeechStarted(st,'morning',0,yes).ok&&cross(st,'morning').steps[0].speechStarted,'the start event marks it');
 const b={};openCrossing(b,'morning',voice,yes);useFerrySupport(b,'morning','words',yes);markSpeechStarted(b,'morning',0,yes);
 ok(!cross(b,'morning').steps[0].speechStarted,'words already shown: not marked');
 const c={};openCrossing(c,'morning',voice,yes);pickAnswer(c,'morning','deux',yes);
 ok(markSpeechStarted(c,'morning',0,yes).ok===false&&!cross(c,'morning').steps[0].speechStarted,'the saying step is not her line');
}

// Picks are limited only by real capacity: a long run of wrong picks still continues.
{
 const st={};openCrossing(st,'morning',voice,yes);
 for(let n=0;n<1000;n++)pickAnswer(st,'morning','trois',yes);
 ok(cross(st,'morning').steps[0].picks.length===1000&&validCrossing(cross(st,'morning')),'1,000 picks stay readable');
 ok(pickAnswer(st,'morning','deux',yes).fitted,'a fitting pick still lands after 1,000');
 const kept=bytes(st);ok(sayAnswer(st,'morning','said',no).ok===false&&bytes(st)===kept,'a capacity refusal changes nothing');
}

// Notes: speech started counts only with words hidden; said counts only I said it.
{
 const st={};openCrossing(st,'morning',voice,yes);markSpeechStarted(st,'morning',0,yes);finish(st,'morning');
 const notes=frenchFerryNotes(st);
 ok(notes.includes('French speech started with her words hidden on 1 of 5')&&notes.includes('said aloud 4 of 5'),'grown-up line counts');
 const quiet={};openCrossing(quiet,'afternoon',{voice:false},yes);
 ok(frenchFerryNotes(quiet).includes(', no French voice'),'no-voice crossings say so');
 const before=bytes(st);frenchFerryPage(st,'',[fr]);frenchFerryNotes(st);ok(bytes(st)===before,'rendering and Notes make no write');
}

// Voices: a local French voice only, and an unavailable saved choice counts as none.
{
 ok(frenchVoiceAvailable([fr],'')&&!frenchVoiceAvailable([en],'')&&!frenchVoiceAvailable([remote],'')&&!frenchVoiceAvailable([],''),'local French only');
 ok(!frenchVoiceAvailable([fr],'missing-voice'),'a missing saved voice counts as no voice');
 const st={};openCrossing(st,'morning',{voice:false},yes);
 const page=frenchFerryPage(st,'',[en]);
 ok(page.includes('This device has no French voice.')&&page.includes('Bonjour')&&!page.includes('data-speak')&&!cross(st,'morning').steps[0].wordsShown,'no voice: her words show unmarked and no listen control');
 const withVoice=shown(st,[fr]);ok(withVoice.includes('data-bac-her')&&!withVoice.includes('Bonjour'),'the device decides the controls; the stored flag stays');
 ok(cross(st,'morning').voice===false,'stored voice unchanged');
}

// Start again: exact move, fresh source, never-reused ids, capacity refusal changes nothing.
{
 const st={};openCrossing(st,'morning',voice,yes);finish(st,'morning');const old=bytes(cross(st,'morning'));
 ok(startCrossingAgain(st,'morning',voice,yes).ok&&bytes(st.frenchFerry.earlier[0])===old,'moved unchanged');
 ok(cross(st,'morning').tryId===2&&cross(st,'morning').state==='started'&&frenchFerryView(st).crossings.morning.label==='before','fresh copy; label Crossed before');
 for(let n=0;n<10;n++)startCrossingAgain(st,'morning',voice,yes);
 ok(st.frenchFerry.earlier.length===11,'no fixed cap below capacity');
 const full=bytes(st);ok(startCrossingAgain(st,'morning',voice,no).error==='capacity'&&bytes(st)===full,'capacity refusal unchanged');
 openCrossing(st,'afternoon',voice,yes);const ids=[...Object.values(st.frenchFerry.crossings),...st.frenchFerry.earlier].map(c=>c.tryId);
 ok(new Set(ids).size===ids.length,'try ids never reused');
 st.frenchFerry.earlier.push({tryId:st.frenchFerry.nextTry,junk:true});const held=bytes(st);
 ok(startCrossingAgain(st,'afternoon',voice,yes).ok===false&&bytes(st)===held,'an id held by an unreadable record is not reused');
}

// A frozen source resumes after today's content changes; unreadable and unknown records stay exact.
{
 const st={};openCrossing(st,'morning',voice,yes);const c=cross(st,'morning');
 c.source=structuredClone(c.source);c.source.cards.reverse();c.source.note='An older note.';c.source.steps[0].fr='Bonjour ! Une ligne de avant ?';
 ok(validCrossing(c)&&pickAnswer(st,'morning','deux',yes).fitted,'an older source resolves its own checks');
 const raw={frenchFerry:{v:2,anything:[1]}},before=bytes(raw);
 ok(frenchFerryView(raw).status==='unsupported'&&openCrossing(raw,'morning',voice,yes).ok===false&&bytes(raw)===before,'unknown version is read-only');
 const u={};openCrossing(u,'morning',voice,yes);openCrossing(u,'afternoon',voice,yes);u.frenchFerry.crossings.morning.steps[0].picks=['nope'];const kept=bytes(u);
 const view=frenchFerryView(u);ok(!view.crossings.morning.readable&&view.crossings.afternoon.readable,'an unreadable crossing leaves its sibling open');
 ok(pickAnswer(u,'morning','deux',yes).ok===false&&bytes(u)===kept,'no edit to an unreadable crossing');
 ok(pickAnswer(u,'afternoon','a-mairie',yes).fitted,'the sibling still works');
 ok(startCrossingAgain(u,'morning',voice,yes).ok&&bytes(u.frenchFerry.earlier[0].steps[0].picks)==='["nope"]','Start again keeps the raw crossing exactly');
 ok(frenchFerryNotes({frenchFerry:'garbage'})!==undefined&&frenchFerryNotes({frenchFerry:null})!==undefined,'Notes survive any JSON value');
}

// Source check: shipped text matches the panel-resolved companion, with French spacing, and no em-dash.
{
 const companion=readFileSync(new URL('../docs/content/327-french-ferry-crossing-text.md',import.meta.url),'utf8').replace(/\*/g,'');
 const norm=x=>String(x).replace(/<[^>]+>/g,'').replace(/[  ]/g,' ');
 const shipped=[];
 for(const k of crossingIds){const s=makeCrossingSource(k);
  shipped.push(s.title.fr,s.title.en,s.note,...s.cards.flatMap(c=>[c.fr,c.en]),...s.steps.slice(0,4).flatMap(x=>[x.fr,x.en]),s.steps[4].prompt,s.steps[4].say.fr,s.steps[4].say.en,s.steps[4].answer.fr,s.steps[4].answer.en,...s.steps[4].choices.map(c=>c.label),s.ending.fr,s.ending.en,...Object.values(s.feedback.kind),...Object.values(s.feedback.detail),s.feedback.aForDou,s.feedback.deForOu,s.feedback.sounds,s.feedback.fit,s.feedback.fit5);}
 const t=ferryText;
 shipped.push(t.homeLink,t.heading.fr,t.heading.en,t.opening,t.crossings,...Object.values(t.labels),t.teachingLink,t.soundsLink,...t.teaching.flatMap(r=>[r.fr,r.say,r.en,r.note]),t.difference.text,t.dot.question.fr,t.dot.question.en,t.dot.answer.fr,t.dot.answer.en,t.dot.line,...t.sounds.flatMap(r=>[r.fr,r.en]),t.soundsNote.text,...Object.values(t.controls).filter(x=>x!=='Hear it'),...Object.values(t.exceptions),t.grownUp);
 for(const line of shipped){
  const n=norm(line),kind=/^That card tells (how many of you there are|the time|where you are going|where you are coming from)\. Listen again to the start/.test(n)||/^That's the right kind of answer\. Check Dot's note for (how many|the time|the place)\.$/.test(n);
  ok(kind||companion.includes(n),`in the companion: ${n.slice(0,60)}`);
 }
 const french=JSON.stringify([crossingIds.map(makeCrossingSource),t]);
 for(const k of crossingIds){const s=makeCrossingSource(k);for(const x of [...s.steps.slice(0,4).map(y=>y.fr),s.steps[4].say.fr,s.ending.fr])ok(!/ [?!]/.test(x)&&(!/[?!]/.test(x)||/ [?!]/.test(x)),`narrow no-break space before ? and !: ${x}`);}
 const page=frenchFerryPage((()=>{const st={};openCrossing(st,'morning',voice,yes);useFerrySupport(st,'morning','words',yes);return st;})(),'',[fr]);
 ok(/« Bonjour/.test(page)&&/ »/.test(page),'no-break space inside guillemets');
 ok(!page.match(/data-speak="[^"]*«/),'speech never gets guillemets');
 ok(!french.includes('—')&&!page.includes('—'),'no em-dash in shipped text');
}

console.log(`${checks} French ferry checks passed.`);
