// Original picnic requests and picture models. Upstream references informed the
// teaching design only; no upstream code, lesson text or learner data is included.
export const SHARING_MODEL_ID='sharing-counter-v1';
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const loaf={id:'moon-loaf',kind:'loaf',width:12,height:4,uniform:true};
const basket={id:'twelve-bun-basket',kind:'basket',total:12,identical:true};
export const SHARING_CASES=freeze([
 {id:'repair-halves',title:'Two picnic shares',reader:'Purl and Clover',reason:'Purl and Clover are sharing one picnic loaf.',request:'Make two equal shares. Pack one share for the picnic.',kind:'loaf',family:'repair',shares:2,packed:1,target:{numerator:1,denominator:2},whole:loaf,initialModel:{cuts:[4],selected:[]}},
 {id:'repair-quarters',title:'Four lantern shares',reader:'The lantern-menders',reason:'Four lantern-menders want one equal loaf share each.',request:'Make four equal shares. Pack one share for a lantern-mender.',kind:'loaf',family:'repair',shares:4,packed:1,target:{numerator:1,denominator:4},whole:loaf,initialModel:{cuts:[2,5,8],selected:[]}},
 {id:'half-parcel',title:'Half for later',reader:'Ember',reason:'Ember is saving half a loaf for a later picnic.',request:'Pack half of this loaf. Try two equal shares or four equal shares.',kind:'loaf',family:'compare',shares:2,packed:1,target:{numerator:1,denominator:2},whole:loaf,initialModel:{cuts:[6],selected:[]}},
 {id:'three-quarter-parcel',title:'A quarter stays home',reader:'Wisp',reason:'Wisp keeps one quarter and packs the rest for the picnic.',request:'Keep one quarter of this loaf. Pack the other three quarters.',kind:'loaf',family:'compare',shares:4,packed:3,target:{numerator:3,denominator:4},whole:loaf,initialModel:{cuts:[3,6,9],selected:[]}},
 {id:'quarter-basket',title:'Buns for the bridge crew',reader:'Clover',reason:'Clover reserves a quarter of 12 buns for the bridge crew.',request:'Share all 12 buns into four equal groups. Pack one whole group.',kind:'basket',family:'basket',shares:4,packed:1,target:{numerator:1,denominator:4},whole:basket,initialModel:{groups:[0,0,0,0],selected:[]}},
 {id:'three-quarter-basket',title:'Buns for the picnic',reader:'Purl',reason:'Purl sends three quarters of 12 buns to the picnic.',request:'Share all 12 buns into four equal groups. Pack three whole groups.',kind:'basket',family:'basket',shares:4,packed:3,target:{numerator:3,denominator:4},whole:basket,initialModel:{groups:[0,0,0,0],selected:[]}}
].map(c=>({...c,modelId:SHARING_MODEL_ID})));
export const sharingCaseById=id=>SHARING_CASES.find(c=>c.id===id)||null;
export const SHARING_PAGES=freeze(['choose','make','compare','keep']);
export const SHARING_SUPPORT=freeze(['visual','manipulation','checkFeedback','workedExample','equivalence','notation','audio','together']);
export const SHARING_EXAMPLE=freeze({id:'two-groups-of-four',whole:8,groups:[4,4],request:'This different example has eight buns in two equal groups of four. One whole group is half of this example basket.',fact:[2,4]});
export const SHARING_CONVERSATION=freeze(['What stayed the same when we changed the cuts?','What is our whole in this picture?']);
