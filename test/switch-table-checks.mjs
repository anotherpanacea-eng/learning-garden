import assert from 'node:assert/strict';
import {switchLayouts,freshSwitchTable,validSwitchTable,changeSwitchTable,switchTableModel} from '../dist/switch-table.mjs';
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
console.log(`${n} Switch Table model assertions passed; UI/media gates remain separate`);
