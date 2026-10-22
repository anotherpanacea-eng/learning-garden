import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {noticeCases} from '../dist/puppet-notice-content.mjs';
import {validNoticeSource,noticeView,noticeResult,renderNotice,startNotice,editNotice,supportNotice,tryNotice,keepNotice,recoverNotice} from '../dist/puppet-notice-core.mjs';
import {noticePage,noticeNotes} from '../dist/puppet-notice-ui.mjs';
const json=JSON.stringify,clone=structuredClone,fresh=()=>initializeExplorerState(freshState());let checks=0;
const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const report=s=>JSON.stringify({title:'Synthetic printer notes',...s},null,2),fits=s=>prepareProgressImport(report(s)).ok;
function* permutations(a){if(!a.length){yield [];return;}for(let i=0;i<a.length;i++)for(const tail of permutations(a.filter((_,j)=>j!==i)))yield [a[i],...tail];}
let n=0;
for(const source of noticeCases){ok(validNoticeSource(source));eq(source.tokens.length,5);eq(source.scripts.length,3);
 for(const order of permutations(source.tokens.map(t=>t.id)))for(const capitalFirst of [false,true])for(const mark of [null,'.','?','!']){
  const s={source,order,capitalFirst,mark,support:[]},r=noticeResult(s),row=source.scripts.find(x=>x.mark===mark&&json(x.order)===json(order));
  const words=order.map(id=>source.tokens.find(t=>t.id===id).word);if(capitalFirst)words[0]=words[0][0].toUpperCase()+words[0].slice(1);
  eq(r.rendered,words.join(' ')+(mark||''));eq(r.scriptId,row?.id??null);eq(r.purposeFit,row?.purposeFit??null);eq(r.firstCapital,/[A-Z]/.test(words[0][0]));eq(r.reply,row?.reply??source.copy.fallback);n++;
 }
}
eq(n,1920,'complete independent finite coverage');
{
 const s=fresh(),before=json(s);noticePage(s);noticeNotes(s);eq(json(s),before);ok(startNotice(s,'ask-rabbit',fits));
 let w=noticeView(s).work;w.order=['rabbit','can','carry','the','lantern'];w.mark='.';ok(tryNotice(s,fits));eq(noticeView(s).feedback.firstCapital,true,'proper name capital is visible with control off');eq(noticeView(s).feedback.purposeFit,false);
 w=noticeView(s).work;w.order=['can','rabbit','carry','the','lantern'];w.capitalFirst=false;w.mark='?';ok(tryNotice(s,fits));eq(noticeView(s).feedback.purposeFit,true);eq(noticeView(s).feedback.firstCapital,false,'meaning separate from convention');
 ok(keepNotice(s,false,fits));const kept=clone(noticeView(s).kept);editNotice(s,'capital',null,true,fits);ok(!noticeView(s).feedback);eq(noticeView(s).kept,kept);ok(tryNotice(s,fits));eq(noticeView(s).feedback.rendered,'Can Rabbit carry the lantern?');
 const id=noticeView(s).feedback.id;editNotice(s,'page',null,'kept',fits);eq(noticeView(s).feedback.id,id,'page navigation preserves response');supportNotice(s,'help',fits);ok(!noticeView(s).feedback,'new support makes response earlier');
 for(let i=0;i<6;i++)ok(tryNotice(s,fits));eq(noticeView(s).readable.length,4);eq(noticeView(s).kept,kept);ok(!keepNotice(s,false,fits));ok(keepNotice(s,true,fits));
 const imported=prepareProgressImport(report(s));ok(imported.ok);eq(imported.state.puppetNotices,s.puppetNotices);
 const frozen=clone(s.puppetNotices),raw=json(s);noticeNotes(s);eq(json(s),raw);const old=noticeCases[0].title;noticeCases[0].title='Changed catalog';ok(noticePage(s).includes(frozen.cases['ask-rabbit'].source.title));noticeCases[0].title=old;
}
{
 const s=fresh();startNotice(s,'ask-rabbit');let w=noticeView(s).work;w.source.id='retired-notice';w.source.tokens=w.source.tokens.map(t=>({...t,id:'old-'+t.id}));w.order=w.order.map(id=>'old-'+id);w.source.initialOrder=w.source.initialOrder.map(id=>'old-'+id);w.source.scripts.forEach(r=>r.order=r.order.map(id=>'old-'+id));s.puppetNotices.cases={'retired-notice':w};s.puppetNotices.current='retired-notice';ok(noticeView(s).work);ok(tryNotice(s,fits));ok(prepareProgressImport(report(s)).ok);s.puppetNotices.cases['ask-rabbit']=false;ok(!startNotice(s,'ask-rabbit',fits));ok(startNotice(s,'announce-fox',fits));eq(s.puppetNotices.cases['ask-rabbit'],false);
}
{
 const s=fresh();startNotice(s,'ask-rabbit');tryNotice(s);let w=noticeView(s).work;w.responses.push({id:500,raw:'untouched'});w.kept={future:true};const raw=clone(w.responses[1]);ok(noticeView(s).keptUnreadable&&!keepNotice(s,true,fits));ok(tryNotice(s,fits));eq(noticeView(s).work.responses[1],raw);eq(noticeView(s).feedback.id,501);w=noticeView(s).work;w.responses.push({id:Number.MAX_SAFE_INTEGER,raw:true});const before=json(s);ok(!tryNotice(s,fits));eq(json(s),before);const earlier=clone(s.puppetNotices);ok(recoverNotice(s,fits));eq(s.puppetNotices.retainedRaw,earlier);
}
{
 const s=fresh();startNotice(s,'announce-fox');const w=noticeView(s).work;w.order=['the','bell','will','ring','fox'];w.capitalFirst=true;w.mark='.';tryNotice(s);eq(noticeView(s).feedback.scriptId,'surprise');eq(noticeView(s).feedback.rendered,'The bell will ring Fox.');noticeView(s).work.order=['fox','will','ring','the','bell'];noticeView(s).work.mark='?';tryNotice(s);eq(noticeView(s).feedback.purposeFit,null,'echo questions are unmodeled, not wrong grammar');
 const c=noticeView(s).feedback;noticeView(s).work.responses.push({...clone(c),id:100,purposeFit:true});ok(noticeView(s).raw.some(r=>r.id===100),'contradictory recorded result raw');
}
{
 const s=fresh();startNotice(s,'ask-rabbit');let w=noticeView(s).work;w.order=['can','rabbit','carry','the','lantern'];w.capitalFirst=true;w.mark='?';tryNotice(s);const original=clone(noticeView(s).feedback);w=noticeView(s).work;
 w.responses.push({...clone(original),id:2,reply:'The opposite: Rabbit cannot carry it.'},{...clone(original),id:3,feedback:'The printed line begins with lowercase.'});w.feedbackId=2;w.kept={snapshot:clone(original.snapshot),response:clone(w.responses[2])};
 const raw=clone(w.responses.slice(1)),imported=prepareProgressImport(report(s));ok(imported.ok,'contradictory prose slots do not block the whole import');const state=imported.state,v=noticeView(state);eq(v.readable.map(r=>r.id),[1],'valid sibling stays readable');eq(v.raw,raw,'reply and feedback contradictions stay raw');ok(!v.feedback,'contradictory reply cannot become current');ok(v.keptUnreadable,'contradictory kept feedback stays raw');ok(!noticePage(state).includes(raw[0].reply)&&!noticePage(state).includes(raw[1].feedback),'contradictory prose is not presented as the frozen script');
 ok(tryNotice(state,fits),'valid own-source work remains usable');eq(noticeView(state).raw,raw,'later Try preserves exact contradictory slots');eq(noticeView(state).feedback.id,4);eq(prepareProgressImport(report(state)).state.puppetNotices,state.puppetNotices,'raw and valid siblings round trip together');
 const c=clone(original);c.snapshot.source.scripts.find(x=>x.id===c.scriptId).reply='An earlier authored reply.';Object.assign(c,noticeResult(c.snapshot));noticeView(state).work.responses.push({...c,id:5});ok(noticeView(state).readable.some(r=>r.id===5),'validation uses the record own frozen source, not current catalog');
}
{
 const s=fresh();startNotice(s,'announce-fox');const w=noticeView(s).work;for(const key of ['capitalNo','nameCapitalNote','endingPrefix','fallback','unfinished'])w.source.copy[key]='x'.repeat(1600);w.source.copy.markLabels.none='z'.repeat(1600);ok(validNoticeSource(w.source),'long own-copy source admitted');ok(tryNotice(s,fits),'long unmodeled lowercase no-ending Try fits');const r=noticeView(s).feedback;ok(r.feedback.length>3200&&r.feedback.length<=16*1024);eq(r.reply,w.source.copy.fallback);ok(prepareProgressImport(report(s)).ok);eq(prepareProgressImport(report(s)).state.puppetNotices,s.puppetNotices);
}
{
 const s=fresh();startNotice(s,'ask-rabbit');tryNotice(s);keepNotice(s);let k=noticeView(s).work.kept;k.response.snapshot=Object.fromEntries(Object.entries(k.response.snapshot).reverse());ok(!noticeView(s).keptUnreadable,'object key order harmless');
 noticeView(s).work.kept=null;const original=json(s.puppetNotices);s.padding='';s.padding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(report(s)));ok(fits(s));for(const fn of [()=>tryNotice(s,fits),()=>keepNotice(s,false,fits),()=>startNotice(s,'announce-fox',fits),()=>supportNotice(s,'example',fits),()=>recoverNotice(s,fits)]){ok(!fn(),'actual report refusal');eq(json(s.puppetNotices),original);}
}
for(const raw of [null,false,{version:7,earlier:'saved'}]){const s=fresh();s.puppetNotices=raw;ok(prepareProgressImport(report(s)).ok);eq(noticeView(s).status,'recovery');const before=json(s);noticePage(s);eq(json(s),before);ok(recoverNotice(s,fits));eq(s.puppetNotices.retainedRaw,raw);}
console.log(`${checks} Puppet Notice checks passed, including ${n} finite arrangements.`);
