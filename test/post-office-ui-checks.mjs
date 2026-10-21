import assert from 'node:assert/strict';
import {deliveries,recipients,places} from '../dist/post-office-content.mjs';
import {ensurePostOffice,startPostOffice,appendPostClause,packPostTogether,stepPostRoute,setPostComposer,setPostCourierPortrait,setPostPackingInput,submitPostPacking,setPostReading,setPostSupport} from '../dist/post-office-core.mjs';
import {postOfficePage,postOfficeNotes,postMap} from '../dist/post-office-ui.mjs';
import {ensureGarden} from '../dist/garden-core.mjs';
import {freshState,STORAGE_KEY,recommendations} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
let n=0;
const check=(x,label)=>{assert.ok(x,label);n++;};
const equal=(a,b,label)=>{assert.deepEqual(a,b,label);n++;};
function state(){const s=freshState();ensureGarden(s);ensurePostOffice(s);return s;}
const empty=state(),before=JSON.stringify(empty);postOfficePage(empty);postOfficeNotes(empty);equal(JSON.stringify(empty),before,'hub rendering creates no visit or other record');
for(const order of deliveries){
 const s=state(),v=startPostOffice(s,order.id),original=JSON.stringify(s),html=postOfficePage(s),m=order.math;
 equal(JSON.stringify(s),original,'delivery page has no state side effects');
 equal((html.match(/class="post-item"/g)||[]).length,m.kind==='subtract'?m.a:m.answer,'pictures show the exact total objects before any reservation');
 if(m.kind==='subtract'){check(html.includes('Not sent'),'reserved objects labelled separately');check(html.includes('Ready for the parcel'),'remaining objects distinct');}
 check(html.includes(order.request),'original request remains beside working game');
 for(const r of recipients)check(html.includes(`${r.emoji} ${r.name}`),'each recipient location has text and a picture');
 for(const avatar of ['fern','reed','sky']){setPostCourierPortrait(s,avatar);check(postMap(s,v).includes(`data-courier-avatar="${avatar}"`),'courier uses independently chosen portrait');}
 setPostPackingInput(s,'3');submitPostPacking(s);let notes=postOfficeNotes(s);
 check(notes.includes('3 (another look)'),'notes retain readable raw answer and outcome');check(!notes.includes('[object Object]'),'notes never stringify attempts as objects');
 packPostTogether(s);appendPostClause(s,`go:${order.destination}`);appendPostClause(s,`give:${order.recipient}`);stepPostRoute(s);
 check(postMap(s,v).includes(`at ${places.find(p=>p.id===order.destination).name}`),'map text follows current location');
 const rec=recommendations(s),paused=JSON.stringify(s);postOfficePage(s);postOfficeNotes(s);equal(JSON.stringify(s),paused,'paused rendering advances no instruction or completion');equal(recommendations(s),rec,'no multiplication recommendation effect');
 stepPostRoute(s);check(postOfficePage(s).includes('A neighbor’s parcel has arrived.'),'real handoff shows ending');check(postMap(s,v).includes('post-handoff'),'delivered parcel pictured at recipient rather than carried');
 setPostReading(s,'independent');setPostSupport(s,'audioRequested');equal(v.reading,'independent','audio request preserves actual reading report');
 notes=postOfficeNotes(s);check(notes.includes('Narration requested: yes'),'narration request remains explicit');check(notes.includes('Reading: independent'),'report stays visible alongside support');
}
class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=store.load();ensureGarden(s);ensurePostOffice(s);const a=store.active.id,v=startPostOffice(s,deliveries[0].id);
setPostComposer(s,'place','hill');setPostPackingInput(s,'unsubmitted');appendPostClause(s,'go:hill');store.save(s);
const restored=new ExplorerStore(disk).load();equal(restored.postOffice,s.postOffice,'real save round trip keeps partial input, bank choice and instructions');
const other=store.add({avatar:'reed',color:'blue',symbol:'shell'},s);check(!other.postOffice,'second explorer starts without first notebook');equal(store.select(a,other).postOffice.current,v.id,'switch returns to exact visit');
packPostTogether(s);stepPostRoute(s);store.save(s);const paused=new ExplorerStore(disk).load();equal(paused.postOffice,s.postOffice,'executed step survives storage too');
store.setPersistence(false,s);check(![...disk.data.keys()].some(k=>k.startsWith(STORAGE_KEY)),'save off removes Post Office saves');equal(store.select(a).postOffice.current,v.id,'save off retains working memory');check(!store.clearActive().postOffice,'reset clears the current notebook');
const future=state(),raw={version:9,draft:{route:['future:moon'],phase:'mid-flight',input:'kept input'}};future.postOffice=structuredClone(raw);ensurePostOffice(future);startPostOffice(future,deliveries[0].id);equal(future.postOffice.kept.payload,raw,'new visit keeps unknown format exact');check(postOfficeNotes(future).includes('future:moon'),'future work remains readable');
console.log(`${n} Post Office rendering, evidence and explorer-storage checks passed.`);
