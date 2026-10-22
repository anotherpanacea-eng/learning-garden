import assert from 'node:assert/strict';
import {coinTypes,requests,exchanges} from '../dist/coin-counter-content.mjs';
import {coinView,startCoinRound,nextCoinRequest,setCoinPage,selectCoinMat,addCoinSupport,resumeCoinRound,adjustCoin,exchangeResult,exchangeCoins,checkCoinPayments,checkMatchesCoins,coinTotal,coinCount,emptyCoins,validCoins,validCoinRound} from '../dist/coin-counter-core.mjs';
let checks=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;},copy=x=>structuredClone(x),roundtrip=x=>JSON.parse(JSON.stringify(x));
const current=s=>coinView(s).current;
const vectors=[];
for(let p=0;p<=25;p++)for(let n=0;n<=10;n++)for(let d=0;d<=5;d++)for(let q=0;q<=2;q++)if(p+n+d+q<=25&&p+5*n+10*d+25*q<=50)vectors.push({penny:p,nickel:n,dime:d,quarter:q});
eq(vectors.length,642,'finite bounded pack has 642 possible mats');
eq(coinTypes.map(c=>[c.id,c.value]),[['penny',1],['nickel',5],['dime',10],['quarter',25]],'declared US-cent values');
ok(coinTypes.find(c=>c.id==='dime').diameter<coinTypes.find(c=>c.id==='nickel').diameter,'smaller dime has larger value than nickel');
for(const coins of vectors){
 ok(validCoins(coins),'all independently enumerated vectors readable');eq(coinCount(coins),coins.penny+coins.nickel+coins.dime+coins.quarter,'coin count counts objects');eq(coinTotal(coins),coins.penny+5*coins.nickel+10*coins.dime+25*coins.quarter,'value is cents not coin count');
 const frozen=copy(coins);
 for(const rule of exchanges){
  const result=exchangeResult(coins,rule.id);
  if(result.ok){eq(coinTotal(result.coins),coinTotal(coins),'every allowed directed exchange conserves value');eq(result.beforeCount,coinCount(coins),'before count explicit');eq(result.afterCount,coinCount(result.coins),'after count explicit');ok(validCoins(result.coins),'exchange result remains bounded');}
  else ok(['missing','limit'].includes(result.reason),'refused trade explains missing coins or display limit');
  eq(coins,frozen,'pure exchange preview never changes mat');
 }
}
eq(coinCount({penny:0,nickel:0,dime:0,quarter:1}),1,'quarter is one coin');eq(coinTotal({penny:0,nickel:0,dime:0,quarter:1}),25,'quarter is twenty-five cents');
eq(exchangeResult({penny:24,nickel:0,dime:0,quarter:1},'quarter-dimes'),{ok:false,reason:'limit'},'conserved value still respects maximum physical coin count');
for(const coins of [{...emptyCoins(),penny:-1},{...emptyCoins(),dime:6},{...emptyCoins(),penny:26},{...emptyCoins(),nickel:1.5},{penny:0,nickel:0,dime:0}])ok(!validCoins(coins),'invalid count/quantity/vector shape rejected');

eq(requests.map(r=>vectors.filter(v=>coinTotal(v)===r.price).length),[2,2,4,4,6,6,9,13],'every request has multiple exact ways');
for(const request of requests){
 const solutions=vectors.filter(v=>coinTotal(v)===request.price);
 for(const [index,a]of solutions.entries())for(const [otherIndex,b]of solutions.entries()){
  const s={},r=startCoinRound(s,request.id);r.a=copy(a);r.b=copy(b);
  const check=checkCoinPayments(s);eq(check.aRelation,'exact','exact A payment');eq(check.bRelation,'exact','exact B payment');eq(check.different,index!==otherIndex,'rearranged same-denomination counts are not a second combination');eq(check.fulfilled,index!==otherIndex,'different equivalent alternatives fulfill request');ok(validCoinRound(r),'finished round stays readable');ok(checkMatchesCoins(r),'new check applies to these mats');
  const frozen=copy(check);selectCoinMat(s,'A');adjustCoin(s,'penny',-1);if(r.a.penny!==a.penny)ok(!checkMatchesCoins(r),'edited mat identifies earlier check');eq(r.checks[0],frozen,'editing never changes saved result');
 }
 const s={},r=startCoinRound(s,request.id);r.b={...emptyCoins(),quarter:2};const c=checkCoinPayments(s);eq([c.aRelation,c.bRelation],['below','above'],'zero and fifty are correctly distinguished from price');
}
{
 const s={},r=startCoinRound(s,'paper-star');r.a={...emptyCoins(),nickel:2};r.b={...emptyCoins(),dime:1};
 eq(checkCoinPayments(s).fulfilled,true,'two nickels and one dime are different ways to pay ten cents');
 selectCoinMat(s,'A');const t=exchangeCoins(s,'nickels-dime');ok(t.ok,'active mat exchange works');eq([t.beforeCount,t.afterCount,t.value],[2,1,10],'trade changes coin count, preserves cents');eq(r.support,['exchange'],'exchange is support, not independent attainment');eq(r.b,{...emptyCoins(),dime:1},'other mat never changes');
 eq(checkCoinPayments(s).fulfilled,false,'same exact composition invites a different way rather than a false second solution');
 for(let n=0;n<12;n++)checkCoinPayments(s);eq(r.checks.length,8,'eight-check history bound on explicit check');
 for(const code of ['help','audio','together','dots']){addCoinSupport(s,code);addCoinSupport(s,code);}eq(r.support.length,5,'distinct support retained separately');
 const before=copy(r);eq(exchangeCoins(s,'quarter-dimes'),{ok:false,reason:'missing'},'absent inputs refused');eq(r,before,'refusal does not mutate work');
}
{
 const s={},r=startCoinRound(s,'ribbon');r.a={...emptyCoins(),nickel:1};checkCoinPayments(s);
 r.price=23;r.checks[0].a.count=17;r.checks[0].a.value=49;r.checks[0].aRelation='above';r.checks[0].different=false;r.checks[0].fulfilled=true;r.checks[0].earlierWords='Old wording';r.unknown={exact:'keep'};
 const frozen=copy(s);ok(validCoinRound(r),'historical bounded price/count/value/outcomes do not get regraded');eq(coinView(roundtrip(s)).current,r,'frozen historical outcomes and unknown fields survive round trip');eq(s,frozen,'pure reader does not rewrite historical values');
 const again=checkCoinPayments(s);eq(again.a.value,5,'only explicit new check computes current mat');eq(again.aRelation,'below','new check uses saved round price');eq(r.checks[0],frozen.coinCounter.rounds[0].checks[0],'prior frozen result remains exact beside new result');
}
{
 const s={},r=startCoinRound(s);const good=copy(r);s.coinCounter.rounds.push({id:9,raw:'<original malformed item>'});s.coinCounter.current=9;
 const raw=copy(s.coinCounter.rounds[1]);ok(setCoinPage(s,'compare'),'unreadable current does not close siblings');eq(current(s).id,good.id,'readable fallback');adjustCoin(s,'penny',1);eq(coinView(s).earlier,[raw],'raw malformed round remains exact during actions');
 const fractional={id:1.5,raw:'fractional earlier id'};s.coinCounter.rounds.push(fractional);const next=startCoinRound(s);ok(next.id>1.5,'a fractional unreadable id permits a larger safe successor');ok(coinView(s).earlier.includes(fractional),'fractional raw entry retained');
 const unsafe={id:9007199254740992,raw:'unsafe id kept'};s.coinCounter.rounds.push(unsafe);const before=copy(s);eq(startCoinRound(s),null,'unsafe unsupported id prevents unreliable successor');eq(s,before,'failed allocation cannot evict or modify data');ok(adjustCoin(s,'penny',1)==='changed','existing round remains editable with exhausted allocation');
}
{
 const s={other:{paused:'synthetic old work'}};const first=startCoinRound(s);eq(first.familiar,false,'first request is not invented familiar');
 for(let n=0;n<7;n++){const expected=requests[n+1].id;eq(nextCoinRequest(s),expected,'eight authored transitions');startCoinRound(s,expected);}
 eq(nextCoinRequest(s),requests[0].id,'request cycle returns to first');const repeated=startCoinRound(s,nextCoinRequest(s));eq(repeated.familiar,true,'same request is familiar practice');
 for(let n=0;n<9;n++)startCoinRound(s,nextCoinRequest(s));eq(coinView(s).rounds.length,12,'latest twelve readable rounds kept');ok(!resumeCoinRound(s,first.id),'explicit new rounds may evict oldest after disclosed limit');eq(s.other,{paused:'synthetic old work'},'other roots untouched');
}
for(const raw of [null,42,'future',{version:2,raw:'<future>'},{version:1,rounds:[]}]){
 const s={coinCounter:copy(raw)},before=copy(s);eq(coinView(s).status,'unavailable','invalid/future envelope read-only');eq(startCoinRound(s),null,'no automatic replacement');eq(adjustCoin(s,'penny',1),'invalid','cannot alter unsupported root');eq(s,before,'raw future or malformed envelope preserved exact');
}
{
 const s={other:[]},before=copy(s);coinView(s);eq(s,before,'missing root view stays pure');eq(adjustCoin(s,'dollar',1),'invalid','bad coin does not create root');eq(s,before,'invalid action is inert');
 const r=startCoinRound(s);r.a={...emptyCoins(),quarter:2};const frozen=copy(s);eq(adjustCoin(s,'penny',1),'limit','over-value addition refused');eq(s,frozen,'bound refusal preserves state');
}
console.log(`Coin Counter: ${checks} assertions passed; 642 bounded vectors, 8 requests.`);
