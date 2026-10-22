import {rainResultSourceValid} from './rain-paths-core.mjs';
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const RAIN_NOTEBOOK_PAGES=freeze(['data','chart','read','keep']);
export const RAIN_NOTEBOOK_TASKS=freeze(['data','chart','draft','source','model','keep']);
export const RAIN_NOTEBOOK_READ=freeze(['draft','source','model']);
export const RAIN_NOTEBOOK_SUPPORT=freeze(['help','audio','together']);
export const RAIN_NOTEBOOK_ORIGINS=freeze(['current-completed','kept-completed']);
export const RAIN_NOTEBOOK_QUANTITIES=freeze([{id:'runoffNew',label:'New runoff'},{id:'storedNew',label:'Newly stored'}]);
export const RAIN_NOTEBOOK_UNIT='model-water tokens';
export const RAIN_NOTEBOOK_SCALE=freeze({min:0,max:24,ticks:[0,4,8,12,16,20,24]});
export const RAIN_NOTEBOOK_DATUM_IDS=freeze(['A:runoffNew','B:runoffNew','A:storedNew','B:storedNew']);
export function rainNotebookRows(source){
 if(!rainResultSourceValid(source?.result))return [];
 return RAIN_NOTEBOOK_DATUM_IDS.map(id=>{const [trayId,quantity]=id.split(':'),row=source.result.rows.find(r=>r.id===trayId),name=RAIN_NOTEBOOK_QUANTITIES.find(q=>q.id===quantity).label;return {id,trayId,quantity,label:`Tray ${trayId}: ${name.toLowerCase()}`,value:row[quantity],unit:RAIN_NOTEBOOK_UNIT};});
}
export function rainNotebookQuestion(source){
 const rows=rainNotebookRows(source);if(!rows.length)return null;
 const a=rows.find(r=>r.id==='A:runoffNew').value,b=rows.find(r=>r.id==='B:runoffNew').value,c=source.result.config;
 return {caseId:c.id,prompt:`After ${c.newRainTotal} new tokens on each tray in ${c.label}, which tray had more new runoff, and how many more?`,targetIds:['A:runoffNew','B:runoffNew'],answer:a===b?'same':a>b?'A':'B',difference:Math.abs(a-b)};
}
