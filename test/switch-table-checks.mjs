import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {switchLayouts,freshSwitchTable,validSwitchTable,changeSwitchTable,switchTableModel,switchTableDrawing,switchTablePage,switchCaptions,resetSwitchTable} from '../dist/switch-table.mjs';
let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;};
// Independently resolve electrical continuity from active rendered component edges,
// excluding the cell's internal link, rather than echoing the model's on flag.
function reaches(m,start,end,without=null){const seen=new Set([start]),todo=[start];while(todo.length){const at=todo.pop();for(const e of m.edges){if(!e.active||e.kind==='cell'||e.id===without)continue;const next=e.from===at?e.to:e.to===at?e.from:null;if(next&&!seen.has(next)){seen.add(next);todo.push(next);}}}return seen.has(end);}
for(const layout of switchLayouts)for(const a of [false,true])for(const b of [false,true])for(const representation of ['sketch','symbols'])for(const trace of [false,true]){
 const s={layout:layout.id,a,b,representation,trace},before=JSON.stringify(s),m=switchTableModel(s),expect=a&&(layout.id!=='two'||b);
 ok(validSwitchTable(s),'finite state readable');ok(m.on===expect,'one-switch versus series AND');ok(reaches(m,'P','N')===expect,'actual edge connectivity agrees');ok(!reaches(m,'P','N','filament'),'no external bypass around filament');ok(JSON.stringify(s)===before,'selection does not mutate state');
 ok(new Set(m.edges.map(e=>e.id)).size===m.edges.length,'unique component identities');ok(m.edges.every(e=>m.nodes[e.from]&&m.nodes[e.to]),'every rendered edge has real contacts');
 for(const id of m.switches){const e=m.edges.find(x=>x.owner===id),p=m.nodes[e.from],q=m.nodes[e.to];ok(e.active===s[id.toLowerCase()],'contact bridge exact Boolean');ok(Math.hypot(p.x-q.x,p.y-q.y)>=44,'distinct visible contact pair');ok(m.open.includes(id)===!e.active,'all open gaps named');}
 const other=changeSwitchTable(s,'representation',representation==='sketch'?'symbols':'sketch');assert.deepEqual(switchTableModel(other),m);n++;
 if(layout.id!=='two')for(const target of ['lamp','cell','left'])ok(switchTableModel(changeSwitchTable(s,'layout',target)).on===m.on,'moving switch preserves its state and result');
 ok(changeSwitchTable(s,'layout','lamp').b===b,'hidden B retained without changing one-switch rule');
}
ok(!validSwitchTable({...freshSwitchTable(),a:1}),'nonboolean rejected');ok(!switchTableModel({layout:'future'}),'unsupported state isolated');ok(changeSwitchTable(freshSwitchTable(),'b',true)===null,'unused B cannot be edited');ok(changeSwitchTable(freshSwitchTable(),'layout','future')===null,'invalid layout rejected');assert.deepEqual(changeSwitchTable({...freshSwitchTable(),a:true},'reset'),freshSwitchTable());n++;
for(const layout of switchLayouts)for(const a of [false,true])for(const b of [false,true])for(const representation of ['sketch','symbols']){
 const state={layout:layout.id,a,b,representation,trace:true},m=switchTableModel(state),html=switchTableDrawing(state);
 ok((html.match(/data-switch-edge=/g)||[]).length===m.edges.length,'render uses every actual graph component exactly once');ok((html.match(/data-switch-gap=/g)||[]).length===m.open.length,'every actual open gap rendered at once');ok(!/marker-end|animateMotion/.test(html),'no sequential or directional current trace');
}
const notebook={lanternCircuits:{version:99,opaque:'kept'},science:{version:88,unknown:true},other:'x'.repeat(550000)},snapshot=JSON.stringify(notebook),html=switchTablePage(notebook,'synthetic-owner');ok(snapshot===JSON.stringify(notebook),'page reads no owned notebook fields or normalizes records');ok(!/<video|\.mp4/.test(html),'entry never embeds movie or download');resetSwitchTable();
const vtt=readFileSync(new URL('../dist/assets/switch-excerpt.vtt',import.meta.url),'utf8');ok(switchCaptions.length===4&&switchCaptions.every((c,i)=>c.start>=0&&c.end>c.start&&c.end<=19.6&&(!i||c.start>=switchCaptions[i-1].end)),'bounded nonoverlapping captions');ok(switchCaptions.every(c=>vtt.includes(c.text)),'external captions retain complete reviewed words');ok(readFileSync(new URL('../dist/assets/switch-excerpt.mp4',import.meta.url)).length===751868,'selected derivative byte size; native codec/decoding separate');
console.log(`${n} Switch Table source assertions passed; native/media/physical gates remain separate`);
