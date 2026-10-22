import assert from 'node:assert/strict';
import {changeCases,changeSource,changePages} from '../dist/market-change-content.mjs';
import {coinTypes} from '../dist/coin-counter-content.mjs';
import {marketChangePage} from '../dist/market-change-ui.mjs';
import {emptyCoins} from '../dist/coin-counter-core.mjs';
import {validChangeSource,validChangeCheck,validChangeRound,changeView,startChange,resumeChange,setChangePage,chooseTenderRelation,chooseReturn,zeroReturn,adjustReturnCoin,exchangeReturnCoins,addChangeSupport,evaluateChange,checkChange,changeCheckMatches} from '../dist/market-change-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
const table={
 'ribbon-exact':[5,5,'exact',0], 'leaf-short':[6,5,'below',null],
 'ribbon-dime':[5,10,'above',5], 'leaf-dime':[6,10,'above',4],
 'label-quarter':[12,25,'above',13], 'string-quarter':[18,25,'above',7],
};
// Independent US-cent arithmetic and bounds, not the production helper/evaluator.
const value=v=>v.penny+5*v.nickel+10*v.dime+25*v.quarter,count=v=>v.penny+v.nickel+v.dime+v.quarter;
const vectors=[];for(let quarter=0;quarter<=2;quarter++)for(let dime=0;dime<=5;dime++)for(let nickel=0;nickel<=10;nickel++)for(let penny=0;penny<=25;penny++){const v={penny,nickel,dime,quarter};if(value(v)<=50&&count(v)<=25)vectors.push(v);}
eq(vectors.length,642);eq(changeCases.length,6);eq(changePages,['read','coins','return','kept']);const accepted=[];let combinations=0;
for(const source of changeCases){
 const [price,tender,relation,expected]=table[source.id];eq([source.price,value(source.tender)],[price,tender]);ok(validChangeSource(source));const before=copy(source),clone=changeSource(source.id);clone.denominations[0].name='Earlier supplied name';eq(source,before,'factory copies frozen money labels');let matching=0;
 for(const coins of vectors){const input={relation,returnChoice:'amount',coins,support:[]},inputBefore=copy(input),c=evaluateChange(source,input);combinations++;eq(c.actualRelation,relation);eq(c.relationMatch,true);eq(c.changeMatch,expected!==null&&value(coins)===expected,'every permitted composition, not a canonical payment');eq(c.fulfilled,c.changeMatch);eq([c.returned.count,c.returned.value],[count(coins),value(coins)]);eq(c.tender.value,tender);eq(c.shortage,expected===null?price-tender:null);ok(validChangeCheck(c));eq(input,inputBefore);eq(source,before);if(c.changeMatch)matching++;}
 accepted.push(matching);
 for(const choice of [null,'amount','short','unsure'])for(const answer of [null,'below','exact','above','unsure']){
  const coins=expected===null?{penny:5,nickel:0,dime:0,quarter:0}:{penny:expected,nickel:0,dime:0,quarter:0},c=evaluateChange(source,{relation:answer,returnChoice:choice,coins,support:['together']});
  eq(c.relationMatch,answer===null||answer==='unsure'?null:answer===relation);eq(c.changeMatch,choice===null||choice==='unsure'?null:choice==='short'?expected===null:expected!==null,'return judgement independent of cover-price answer');eq(c.input.coins,coins,'inactive idea preserved');
 }
}
eq([combinations,accepted],[3852,[1,0,2,1,4,2]]);
const missing={};eq(changeView(missing).status,'missing');for(const fn of [s=>setChangePage(s,'return'),s=>chooseTenderRelation(s,'exact'),s=>chooseReturn(s,'amount'),s=>zeroReturn(s),s=>addChangeSupport(s,'help'),s=>resumeChange(s,1)]){eq(fn(missing),false);eq(missing,{});}eq(adjustReturnCoin(missing,'penny',1),'invalid');eq(exchangeReturnCoins(missing,'penny-nickel').ok,false);eq(checkChange(missing),null);eq(startChange(missing,'unknown'),null);eq(missing,{});
{
 const state={other:{untouched:['saved']}},r=startChange(state,'ribbon-exact');ok(validChangeRound(r));eq(r.returnChoice,null);const blank=checkChange(state);eq([blank.relationMatch,blank.changeMatch],[null,null],'untouched empty mat unobserved');eq(adjustReturnCoin(state,'penny',-1),'limit');eq(r.returnChoice,null,'refused removal not a response');chooseTenderRelation(state,'exact');zeroReturn(state);const exact=checkChange(state);eq([exact.relationMatch,exact.changeMatch,exact.fulfilled],[true,true,true]);ok(changeCheckMatches(r));for(const page of changePages){ok(setChangePage(state,page));ok(changeCheckMatches(r),'page not judged input');}adjustReturnCoin(state,'penny',1);eq(r.relation,'exact');ok(!changeCheckMatches(r));eq(exact.returned.value,0,'old explicit zero immutable');chooseReturn(state,'short');eq(r.coins.penny,1,'short retains inactive coins');chooseReturn(state,'unsure');eq(r.coins.penny,1);chooseReturn(state,'amount');eq(r.coins.penny,1);zeroReturn(state);eq(r.coins,emptyCoins(),'explicit zero deliberately clears current mat');eq(state.other,{untouched:['saved']});
 const fresh=startChange(state,'leaf-short');chooseTenderRelation(state,'above');chooseReturn(state,'short');const c=checkChange(state);eq([c.relationMatch,c.changeMatch,c.fulfilled],[false,true,false]);zeroReturn(state);eq(checkChange(state).changeMatch,false,'short payment is not zero change');ok(fresh.source.price===6&&value(fresh.source.tender)===5);const repeated=startChange(state,'leaf-short');ok(repeated.familiar);ok(!r.familiar);ok(resumeChange(state,r.id));eq(changeView(state).current,r);
}
{
 const state={},r=startChange(state,'ribbon-dime'),source=copy(r.source);for(let i=0;i<5;i++)adjustReturnCoin(state,'penny',1);chooseReturn(state,'short');const trade=exchangeReturnCoins(state,'penny-nickel');ok(trade.ok);eq([trade.beforeCount,trade.afterCount,trade.value],[5,1,5]);eq(r.returnChoice,'amount');eq(r.support,['exchange']);eq(r.source,source);const before=copy(state);eq(exchangeReturnCoins(state,'quarter-dimes').ok,false);eq(state,before,'missing-input trade atomic');r.coins={penny:0,nickel:0,dime:0,quarter:2};const cap=copy(state);eq(adjustReturnCoin(state,'penny',1),'limit');eq(state,cap);r.coins={penny:25,nickel:0,dime:0,quarter:0};eq(adjustReturnCoin(state,'penny',1),'limit');
}
{
 const state={},r=startChange(state,'ribbon-exact');r.source.price=7;r.source.tender={penny:0,nickel:0,dime:1,quarter:0};r.source.title='Earlier question';r.source.help='Earlier worked words';r.source.denominations[0].name='Earlier penny label';r.source.drawingVersion=77;chooseTenderRelation(state,'above');r.coins={penny:3,nickel:0,dime:0,quarter:0};chooseReturn(state,'amount');const c=checkChange(state);eq(c.changeMatch,true,'own old price/tender, not current case');eq(c.source.denominations[0].name,'Earlier penny label');c.actualRelation='below';c.shortage=5;c.returned.value=42;c.changeMatch=false;c.feedback='Earlier contradictory recorded result';ok(validChangeRound(r),'recorded counts/outcomes are not regraded');const before=copy(c);addChangeSupport(state,'help');eq(c,before);ok(!changeCheckMatches(r));for(let i=0;i<10;i++)checkChange(state);eq(r.checks.length,8);
 const frozenValue=copy(r.source);frozenValue.denominations.find(x=>x.id==='dime').value=6;ok(validChangeSource(frozenValue),'saved numeric denomination value does not depend on the current catalog');eq(evaluateChange(frozenValue,{relation:'above',returnChoice:'amount',coins:r.coins,support:[]}).tender.value,6,'saved value drives arithmetic');
 const wrong=copy(r.source);wrong.denominations[0].value=0;ok(!validChangeSource(wrong),'frozen denomination still needs a positive bounded value');eq(evaluateChange(wrong,{relation:'above',returnChoice:'amount',coins:r.coins,support:[]}),null);
}
{
 const state={},r=startChange(state,'ribbon-dime');r.coins={penny:24,nickel:1,dime:0,quarter:0};r.returnChoice='short';const before=copy(state);eq(exchangeReturnCoins(state,'nickel-pennies'),{ok:false,reason:'limit'});eq(state,before,'count-cap exchange is atomic and does not activate a response');
 r.coins={penny:0,nickel:0,dime:0,quarter:1};const result=exchangeReturnCoins(state,'quarter-dimes');ok(result.ok);eq([result.beforeCount,result.afterCount,result.value],[1,3,25]);
 const source=changeSource('ribbon-exact');source.price=1;source.tender={penny:2,nickel:0,dime:0,quarter:0};const c=evaluateChange(source,{relation:'above',returnChoice:'amount',coins:{penny:1,nickel:0,dime:0,quarter:0},support:[]});ok(c.feedback.includes('1 cent should go back'));ok(!c.feedback.includes('1 cents'));
}
for(const change of [{version:2},{price:0},{price:26},{unit:'dollars'},{drawingVersion:0},{denominations:[]},{tender:{penny:-1,nickel:0,dime:0,quarter:0}}])ok(!validChangeSource({...changeSource('ribbon-exact'),...change}));
{
 const source=changeSource('ribbon-dime');source.denominations=source.denominations.filter(c=>c.id!=='quarter');ok(validChangeSource(source),'frozen source can have fewer than current catalog denominations');
 const absentTender=changeSource('ribbon-dime');absentTender.denominations=absentTender.denominations.filter(c=>c.id!=='dime');ok(!validChangeSource(absentTender),'a tender coin must belong to its frozen denominations');
 const duplicate=changeSource('ribbon-dime');duplicate.denominations.push(copy(duplicate.denominations[0]));ok(!validChangeSource(duplicate),'frozen denomination ids remain unique');
 const state={},round=startChange(state,'ribbon-dime');adjustReturnCoin(state,'nickel',1);chooseTenderRelation(state,'above');const check=checkChange(state),before=copy(state);
 coinTypes.push({id:'half-dollar',name:'Half dollar',plural:'half dollars',value:50,diameter:30,color:'#dddddd'});
 try{
  eq(changeView(state).current,round,'old visit and check load after catalog extension');ok(validChangeRound(round));eq(round.source.denominations.length,4,'old frozen source stays four denominations');
  eq(evaluateChange(round.source,check.input).returned.value,5,'old return still evaluates from frozen values');ok(marketChangePage(state).includes('Our kept change trail'),'old visit still renders');eq(state,before,'reading an old visit does not rewrite it');
 }finally{coinTypes.pop();}
}
for(const root of [null,'<b>earlier</b>',{version:9,raw:'kept'}]){const state={marketChange:copy(root)},before=copy(state);eq(changeView(state).status,'unavailable');eq(startChange(state,'ribbon-exact'),null);eq(state,before);}
{
 const state={};for(let i=0;i<16;i++)startChange(state,changeCases[i%6].id);eq(changeView(state).rounds.length,12);eq(state.marketChange.rounds[0].id,5);state.marketChange.rounds.push({id:90,raw:'<kept>'});const raw=copy(state.marketChange.rounds.at(-1));state.marketChange.current=90;eq(changeView(state).current.id,16);startChange(state,'leaf-short');eq(state.marketChange.current,91);eq(changeView(state).earlier,[raw]);const duplicate=copy(changeView(state).rounds[0]);state.marketChange.rounds.push(duplicate);eq(changeView(state).earlier,[raw,duplicate]);const before=copy(state);changeView(state);eq(state,before,'readers pure');
}
for(const unsafe of [Infinity,Number.MAX_SAFE_INTEGER]){const state={};startChange(state,'leaf-short');state.marketChange.rounds.push({id:unsafe,raw:true});const before=copy(state);eq(startChange(state,'ribbon-exact'),null);eq(state,before,'unsafe allocation never evicts');}
console.log(`Market change core: ${n} assertions passed across ${combinations} complete amount proposals and every choice/relation combination.`);
