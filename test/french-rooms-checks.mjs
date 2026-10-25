import assert from 'node:assert/strict';
import {frenchRoomsView,validFrenchRoomsWork,startFrenchRooms,setFrenchRoomsField,showFrenchRoomsHelp,checkFrenchRooms,skipFrenchRooms,revealFrenchRoomsData,keepFrenchRooms,setFrenchRoomsSelection} from '../dist/french-rooms-core.mjs';
import {frenchRoomsLessons} from '../dist/french-rooms-content.mjs';
import {frenchRoomsPage,frenchRoomsNotes} from '../dist/french-rooms-ui.mjs';
const options={canExport:()=>true},fresh=()=>({other:{waiting:'synthetic draft'}});let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++;};
let s=fresh();const before=structuredClone(s);ok(frenchRoomsView(s).status==='missing','passive missing view');ok(!Object.hasOwn(s,'frenchRooms'),'view allocates nothing');
for(const lesson of frenchRoomsLessons){
 ok(startFrenchRooms(s,lesson.id,options),'open every lesson');let w=frenchRoomsView(s).work;ok(validFrenchRoomsWork(w),'fresh work valid');
 for(const q of w.source.items){
  ok(showFrenchRoomsHelp(s,q.id+':hint',options),'per-item hint');ok(skipFrenchRooms(s,q.id,options),'per-item skip');
  if(w.source.newMessage&&q===w.source.items[1])ok(revealFrenchRoomsData(s,options),'new data reveal');
  const right=q.choices.find(c=>c.outcome==='match');ok(setFrenchRoomsField(s,q.id,right.id,options),'choice saved');ok(checkFrenchRooms(s,q.id,options).outcome==='match','finite keyed check');
  ok(frenchRoomsView(s).work.checks.at(-1).helpSeenBefore.includes(q.id+':hint'),'help frozen before check');
 }
 ok(setFrenchRoomsField(s,'explanation','  Original synthetic words.\n',options),'exact original draft');ok(keepFrenchRooms(s,options),'first keep');
 ok(setFrenchRoomsField(s,'revision',' Revised synthetic words. ',options),'exact revision');ok(keepFrenchRooms(s,options),'latest keep');ok(frenchRoomsView(s).work.drafts.explanation==='  Original synthetic words.\n','no normalization');
}
ok(s.other===s.other&&JSON.stringify(s.other)===JSON.stringify(before.other),'foreign waiting branch unchanged');
s=fresh();startFrenchRooms(s,frenchRoomsLessons[0].id,options);let w=frenchRoomsView(s).work;const originalTitle=w.source.title;frenchRoomsLessons[0].title='Changed live wording';ok(frenchRoomsView(s).work.source.title===originalTitle,'frozen source unchanged by author update');frenchRoomsLessons[0].title=originalTitle;
const first=w.source.items[0];setFrenchRoomsField(s,first.id,first.choices[0].id,options);checkFrenchRooms(s,first.id,options);let old=structuredClone(frenchRoomsView(s).work.checks);ok(validFrenchRoomsWork(frenchRoomsView(s).work),'saved outcomes validate own frozen choices');
for(let i=0;i<40;i++)checkFrenchRooms(s,first.id,options);ok(frenchRoomsView(s).work.checks.length===24,'bounded recent checks');
const calls=[x=>startFrenchRooms(x,frenchRoomsLessons[0].id),x=>setFrenchRoomsField(x,'explanation','x'),x=>showFrenchRoomsHelp(x,'hint'),x=>checkFrenchRooms(x,first.id),x=>skipFrenchRooms(x,first.id),x=>keepFrenchRooms(x),x=>revealFrenchRoomsData(x)];
for(const fn of calls){const b=JSON.stringify(s);ok(fn(s)===false,'missing actual preflight refuses');ok(JSON.stringify(s)===b,'refusal unchanged');}
const fail={canExport:()=>false},q=frenchRoomsView(s).work.source.items[0];
const rejected=[()=>startFrenchRooms(s,frenchRoomsLessons[1].id,fail),()=>setFrenchRoomsField(s,'explanation','unsaved',fail),()=>showFrenchRoomsHelp(s,'q:hint',fail),()=>skipFrenchRooms(s,q.id,fail),()=>checkFrenchRooms(s,q.id,fail),()=>keepFrenchRooms(s,fail)];
for(const fn of rejected){const b=JSON.stringify(s);ok(fn()===false,'actual host refusal');ok(JSON.stringify(s)===b,'host refusal unchanged');}
const future=fresh();future.frenchRooms={version:99,raw:{unknown:'preserve'}};const futureBefore=JSON.stringify(future);ok(frenchRoomsView(future).status==='unavailable','future root read-only');ok(!startFrenchRooms(future,frenchRoomsLessons[0].id,options),'future start refuses');ok(JSON.stringify(future)===futureBefore,'future unchanged');
s=fresh();startFrenchRooms(s,frenchRoomsLessons[0].id,options);s.frenchRooms.lessons[frenchRoomsLessons[0].id]={broken:'preserve'};ok(startFrenchRooms(s,frenchRoomsLessons[1].id,options),'malformed child isolates');ok(s.frenchRooms.lessons[frenchRoomsLessons[0].id].broken==='preserve','malformed raw retained');
const k=frenchRoomsLessons[1].id;s.frenchRooms.lessons['saved-other']=structuredClone(s.frenchRooms.lessons[k]);s.frenchRooms.lessons['saved-other'].source.id='saved-other';ok(startFrenchRooms(s,'saved-other',options),'unknown saved readable child opens');
ok(!setFrenchRoomsField(s,'explanation','x'.repeat(1201),options),'text bound refuses');ok(frenchRoomsView(s).work.drafts.explanation==='','bounded text never silently truncated');
console.log(`${checks} french-rooms checks passed`);
s=fresh();startFrenchRooms(s,'return',options);setFrenchRoomsField(s,'explanation','Je viens de rentrer. Je vais chercher le sac.',options);revealFrenchRoomsData(s,options);ok(frenchRoomsView(s).work.firstKept.drafts.explanation==='Je viens de rentrer. Je vais chercher le sac.','reveal retains exact original');setFrenchRoomsField(s,'revision',"Je vais chercher le sac dans l’entrée.",options);keepFrenchRooms(s,options);ok(frenchRoomsView(s).work.firstKept.newData===false,'original source context retained');
const html=frenchRoomsPage(s);ok(!html.includes('I have just come home.'),'English passage meaning initially hidden');showFrenchRoomsHelp(s,'intro:meaning',options);ok(frenchRoomsPage(s).includes('I have just come home.'),'English meaning appears after saved request');ok(!frenchRoomsPage(s,'plan').includes('data-rooms-field'),'different requested lesson previews without switching');ok(frenchRoomsView(s).work.source.id==='return','preview leaves current unchanged');ok(setFrenchRoomsSelection(s,'sac',options),'interactive map selection');const b=JSON.stringify(s);ok(!setFrenchRoomsSelection(s,'lit',{canExport:()=>false}),'map refusal');ok(JSON.stringify(s)===b,'map refusal unchanged');ok(frenchRoomsNotes(s).includes('Je viens de rentrer.'),'original notes exact');
console.log(`Final ${checks} assertions passed`);
