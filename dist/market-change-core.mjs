import {changePages,changeSource} from './market-change-content.mjs';
import {exchanges} from './coin-counter-content.mjs';
import {exchangeResult} from './coin-counter-core.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0;
const text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x),bounded=(x,max)=>Number.isInteger(x)&&x>=0&&x<=max;
const cents=n=>n+' '+(n===1?'cent':'cents');
const relations=['below','exact','above'],choices=['amount','short','unsure'],codes=['help','audio','together','dots','exchange'];
const maybeRelation=x=>x===null||x==='unsure'||relations.includes(x),maybeChoice=x=>x===null||choices.includes(x),maybeBool=x=>x===null||typeof x==='boolean';
const support=x=>Array.isArray(x)&&x.length<=5&&x.every(c=>codes.includes(c))&&new Set(x).size===x.length;
const denomination=x=>object(x)&&id(x.id)&&positive(x.value)&&x.value<=50&&text(x.name,80)&&text(x.plural,80)&&Number.isFinite(x.diameter)&&x.diameter>0&&x.diameter<=40&&typeof x.color==='string'&&/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(x.color);
export const sourceCoinCount=(source,coins)=>source.denominations.reduce((sum,c)=>sum+(coins[c.id]??0),0);
export const sourceCoinTotal=(source,coins)=>source.denominations.reduce((sum,c)=>sum+c.value*(coins[c.id]??0),0);
const validSourceCoins=(source,coins)=>object(coins)&&Object.entries(coins).every(([key,n])=>source.denominations.some(c=>c.id===key)||n===0)&&source.denominations.every(c=>bounded(coins[c.id]??0,25))&&sourceCoinCount(source,coins)<=25&&sourceCoinTotal(source,coins)<=50;
const emptySourceCoins=source=>Object.fromEntries(source.denominations.map(c=>[c.id,0]));
export function validChangeSource(s){return object(s)&&s.version===1&&id(s.id)&&id(s.requestId)&&text(s.title,180)&&text(s.item,180)&&text(s.prompt,1500)&&Number.isInteger(s.price)&&s.price>=1&&s.price<=25&&s.unit==='US cents'&&text(s.help,4000)&&positive(s.drawingVersion)&&Array.isArray(s.denominations)&&s.denominations.length>0&&s.denominations.length<=25&&s.denominations.every(denomination)&&new Set(s.denominations.map(x=>x.id)).size===s.denominations.length&&validSourceCoins(s,s.tender);}
const snapshot=(source,x)=>object(x)&&validSourceCoins(source,x.coins)&&bounded(x.count,25)&&bounded(x.value,50);
// Recorded fields are admitted for display, never recalculated on restoration.
export function validChangeCheck(c){return object(c)&&validChangeSource(c.source)&&object(c.input)&&maybeRelation(c.input.relation)&&maybeChoice(c.input.returnChoice)&&validSourceCoins(c.source,c.input.coins)&&support(c.input.support)&&snapshot(c.source,c.tender)&&snapshot(c.source,c.returned)&&relations.includes(c.actualRelation)&&(c.shortage===null||(Number.isInteger(c.shortage)&&c.shortage>=1&&c.shortage<=25))&&maybeBool(c.relationMatch)&&maybeBool(c.changeMatch)&&typeof c.fulfilled==='boolean'&&text(c.feedback,5000);}
export function validChangeRound(r){return object(r)&&positive(r.id)&&validChangeSource(r.source)&&maybeRelation(r.relation)&&maybeChoice(r.returnChoice)&&validSourceCoins(r.source,r.coins)&&typeof r.familiar==='boolean'&&support(r.support)&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validChangeCheck);}
export function changeView(state){
 const root=state.marketChange,base={root,rounds:[],earlier:[],current:null,page:'read'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!changePages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],used=new Set();for(const r of root.rounds){if(validChangeRound(r)&&!used.has(r.id)){rounds.push(r);used.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page};
}
export function startChange(state,caseId){
 const source=changeSource(caseId),v=changeView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'read',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const round={id:next,source,relation:null,returnChoice:null,coins:emptySourceCoins(source),familiar:root.seen.includes(source.id),support:[],checks:[]};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(round);root.current=next;root.nextId=next+1;root.page='read';if(!root.seen.includes(source.id))root.seen.push(source.id);state.marketChange=root;return round;
}
const active=state=>changeView(state).current;
export function resumeChange(state,id){const v=changeView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function setChangePage(state,page){const v=changeView(state);if(v.status!=='ready'||!changePages.includes(page))return false;v.root.page=page;return true;}
export function chooseTenderRelation(state,value){const r=active(state);if(!r||!maybeRelation(value))return false;r.relation=value;return true;}
export function chooseReturn(state,value){const r=active(state);if(!r||!maybeChoice(value))return false;r.returnChoice=value;return true;}
export function zeroReturn(state){const r=active(state);if(!r)return false;r.coins=emptySourceCoins(r.source);r.returnChoice='amount';return true;}
export function addChangeSupport(state,code){const r=active(state);if(!r||!codes.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function adjustReturnCoin(state,type,delta){
 const r=active(state);if(!r||!r.source.denominations.some(c=>c.id===type)||![1,-1].includes(delta))return 'invalid';
 const next={...r.coins,[type]:(r.coins[type]??0)+delta};if(!validSourceCoins(r.source,next))return 'limit';r.coins=next;r.returnChoice='amount';return 'changed';
}
export function exchangeReturnCoins(state,id){const r=active(state);if(!r)return {ok:false,reason:'unavailable'};const rule=exchanges.find(x=>x.id===id);if(!rule||!Object.keys({...rule.from,...rule.to}).every(key=>r.source.denominations.some(c=>c.id===key)))return {ok:false,reason:'invalid'};const result=exchangeResult(r.coins,id);if(result.ok){const value=sourceCoinTotal(r.source,r.coins);if(!validSourceCoins(r.source,result.coins)||sourceCoinTotal(r.source,result.coins)!==value)return {ok:false,reason:'limit'};const beforeCount=sourceCoinCount(r.source,r.coins),afterCount=sourceCoinCount(r.source,result.coins);r.coins=result.coins;r.returnChoice='amount';addChangeSupport(state,'exchange');return {...result,beforeCount,afterCount,value};}return result;}
export function evaluateChange(source,input){
 if(!validChangeSource(source)||!object(input)||!maybeRelation(input.relation)||!maybeChoice(input.returnChoice)||!validSourceCoins(source,input.coins)||!support(input.support))return null;
 const snap=coins=>({coins:structuredClone(coins),count:sourceCoinCount(source,coins),value:sourceCoinTotal(source,coins)}),tender=snap(source.tender),returned=snap(input.coins),actualRelation=tender.value<source.price?'below':tender.value>source.price?'above':'exact',shortage=actualRelation==='below'?source.price-tender.value:null;
 const relationMatch=input.relation===null||input.relation==='unsure'?null:input.relation===actualRelation;
 const changeMatch=input.returnChoice===null||input.returnChoice==='unsure'?null:input.returnChoice==='short'?actualRelation==='below':actualRelation!=='below'&&source.price+returned.value===tender.value;
 let feedback=relationMatch===null?'The cover-price choice remains unobserved. ':relationMatch?'The cover-price choice fits these amounts. ':'The cover-price choice differs from these amounts; it can be revised. ';
 if(shortage!==null)feedback+='The '+cents(tender.value)+' handed over is '+shortage+' '+(shortage===1?'cent':'cents')+' short of the '+source.price+'-cent price. There is no payable change yet. Returning 0 cents cannot pay the missing amount. ';
 else{const value=tender.value-source.price;feedback+='The '+source.price+'-cent price is covered by '+cents(tender.value)+' handed over. '+cents(value)+' should go back to the customer: '+source.price+' + '+value+' = '+tender.value+'. Coin count can differ from cent value. ';}
 if(changeMatch===null)feedback+='No definite returned response is recorded. Any retained coin idea is not an active return answer.';
 else if(input.returnChoice==='short')feedback+=changeMatch?'The short-payment response fits.':'The short-payment response differs: this price is already covered.';
 else feedback+='The proposed '+returned.value+'-cent return '+(changeMatch?'fits this relationship.':'does not fit this relationship; the coin idea can be revised.');
 return {source:structuredClone(source),input:{relation:input.relation,returnChoice:input.returnChoice,coins:structuredClone(input.coins),support:[...input.support]},tender,returned,actualRelation,shortage,relationMatch,changeMatch,fulfilled:relationMatch===true&&changeMatch===true,feedback};
}
export function checkChange(state){const r=active(state);if(!r)return null;const c=evaluateChange(r.source,{relation:r.relation,returnChoice:r.returnChoice,coins:r.coins,support:r.support});if(!c)return null;r.checks.push(c);r.checks=r.checks.slice(-8);state.marketChange.page='kept';return c;}
export function changeCheckMatches(r,c=r.checks.at(-1)){return !!c&&JSON.stringify(c.source)===JSON.stringify(r.source)&&JSON.stringify(c.input)===JSON.stringify({relation:r.relation,returnChoice:r.returnChoice,coins:r.coins,support:r.support});}
