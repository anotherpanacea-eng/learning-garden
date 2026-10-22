import {coinTypes,requests,pages,exchanges} from './coin-counter-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const positive=x=>Number.isSafeInteger(x)&&x>0;
const bounded=(x,max)=>Number.isInteger(x)&&x>=0&&x<=max;
const request=id=>requests.find(r=>r.id===id);
const sides=['A','B'],codes=['help','audio','together','dots','exchange'];
export const emptyCoins=()=>Object.fromEntries(coinTypes.map(c=>[c.id,0]));
export const coinCount=coins=>coinTypes.reduce((sum,c)=>sum+coins[c.id],0);
export const coinTotal=coins=>coinTypes.reduce((sum,c)=>sum+c.value*coins[c.id],0);
export const validCoins=coins=>object(coins)&&coinTypes.every(c=>bounded(coins[c.id],25))&&coinCount(coins)<=25&&coinTotal(coins)<=50;
const sameCoins=(a,b)=>coinTypes.every(c=>a[c.id]===b[c.id]);
// Recorded outcomes are validated for display, not recomputed under current rules.
const snapshot=x=>object(x)&&validCoins(x.coins)&&bounded(x.count,25)&&bounded(x.value,50);
const check=x=>object(x)&&snapshot(x.a)&&snapshot(x.b)&&['below','exact','above'].includes(x.aRelation)&&['below','exact','above'].includes(x.bRelation)&&typeof x.different==='boolean'&&typeof x.fulfilled==='boolean';
export function validCoinRound(r){return object(r)&&positive(r.id)&&request(r.request)&&Number.isInteger(r.price)&&r.price>=1&&r.price<=25&&validCoins(r.a)&&validCoins(r.b)&&Array.isArray(r.support)&&r.support.length<=5&&r.support.every(c=>codes.includes(c))&&new Set(r.support).size===r.support.length&&typeof r.familiar==='boolean'&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(check);}
export function coinView(state){
 const r=state.coinCounter;
 if(r===undefined)return {status:'missing',root:null,rounds:[],earlier:[],current:null,page:'coins',mat:'A'};
 if(!object(r)||r.version!==1||!pages.includes(r.page)||!positive(r.current)||!positive(r.nextId)||!sides.includes(r.mat)||!Array.isArray(r.seen)||r.seen.some(id=>!request(id))||new Set(r.seen).size!==r.seen.length||!Array.isArray(r.rounds))return {status:'unavailable',root:r,rounds:[],earlier:[],current:null,page:'coins',mat:'A'};
 const rounds=[],earlier=[],ids=new Set();
 for(const x of r.rounds){if(validCoinRound(x)&&!ids.has(x.id)){rounds.push(x);ids.add(x.id);}else earlier.push(x);}
 return {status:'ready',root:r,rounds,earlier,current:rounds.find(x=>x.id===r.current)||rounds.at(-1)||null,page:r.page,mat:r.mat};
}
export function startCoinRound(state,requestId=requests[0].id){
 const v=coinView(state),item=request(requestId);if(v.status==='unavailable'||!item)return null;
 const root=v.root||{version:1,page:'coins',current:1,nextId:1,mat:'A',seen:[],rounds:[]};
 // Unsupported numeric IDs are kept too. Do not allocate through an unsafe successor.
 const savedIds=root.rounds.filter(r=>object(r)&&typeof r.id==='number'&&r.id>0).map(r=>r.id);
 if(savedIds.some(id=>!Number.isFinite(id)||id>=Number.MAX_SAFE_INTEGER)||root.nextId>=Number.MAX_SAFE_INTEGER)return null;
 const id=Math.max(root.nextId,1,...savedIds.map(n=>Math.floor(n)+1));if(!positive(id)||id>=Number.MAX_SAFE_INTEGER)return null;
 const r={id,request:item.id,price:item.price,a:emptyCoins(),b:emptyCoins(),support:[],familiar:root.seen.includes(item.id),checks:[]};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));
 root.rounds=root.rounds.filter(x=>!drop.has(x));root.rounds.push(r);root.current=id;root.nextId=id+1;root.page='make';root.mat='A';if(!root.seen.includes(item.id))root.seen.push(item.id);state.coinCounter=root;return r;
}
const active=state=>{const v=coinView(state);return v.status==='unavailable'?null:v.current||startCoinRound(state);};
export function nextCoinRequest(state){const r=coinView(state).current,index=requests.findIndex(x=>x.id===r?.request);return requests[(index+1)%requests.length].id;}
export function setCoinPage(state,page){if(!pages.includes(page)||!active(state))return false;state.coinCounter.page=page;return true;}
export function selectCoinMat(state,side){if(!sides.includes(side)||!active(state))return false;state.coinCounter.mat=side;return true;}
export function addCoinSupport(state,code){if(!codes.includes(code))return false;const r=active(state);if(!r)return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function resumeCoinRound(state,id){const v=coinView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function adjustCoin(state,type,delta){
 if(!coinTypes.some(c=>c.id===type)||![1,-1].includes(delta))return 'invalid';const r=active(state);if(!r)return 'invalid';const mat=coinView(state).mat.toLowerCase(),coins={...r[mat],[type]:r[mat][type]+delta};
 if(!validCoins(coins))return 'limit';r[mat]=coins;return 'changed';
}
// Counts in this result describe the whole mat, including coins outside the trade.
export function exchangeResult(coins,id){
 const rule=exchanges.find(x=>x.id===id);if(!rule||!validCoins(coins))return {ok:false,reason:'invalid'};
 if(Object.entries(rule.from).some(([coin,n])=>coins[coin]<n))return {ok:false,reason:'missing'};
 const next={...coins};for(const [coin,n]of Object.entries(rule.from))next[coin]-=n;for(const [coin,n]of Object.entries(rule.to))next[coin]+=n;
 if(!validCoins(next))return {ok:false,reason:'limit'};
 return {ok:true,coins:next,beforeCount:coinCount(coins),afterCount:coinCount(next),value:coinTotal(next)};
}
export function exchangeCoins(state,id){
 if(!exchanges.some(x=>x.id===id))return {ok:false,reason:'invalid'};const r=active(state);if(!r)return {ok:false,reason:'unavailable'};
 const mat=coinView(state).mat.toLowerCase(),result=exchangeResult(r[mat],id);if(result.ok){r[mat]=result.coins;addCoinSupport(state,'exchange');}return result;
}
export function checkCoinPayments(state){
 const r=active(state);if(!r)return null;
 const snap=coins=>({coins:structuredClone(coins),count:coinCount(coins),value:coinTotal(coins)}),relation=value=>value<r.price?'below':value>r.price?'above':'exact';
 const a=snap(r.a),b=snap(r.b),aRelation=relation(a.value),bRelation=relation(b.value),different=!sameCoins(r.a,r.b),result={a,b,aRelation,bRelation,different,fulfilled:aRelation==='exact'&&bRelation==='exact'&&different};
 r.checks.push(result);r.checks=r.checks.slice(-8);return result;
}
export function checkMatchesCoins(r){const c=r.checks.at(-1);return !!c&&sameCoins(c.a.coins,r.a)&&sameCoins(c.b.coins,r.b);}
