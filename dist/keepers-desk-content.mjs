// Original fictional case. Jane and Marble are design references, not copied content.
const choices=(rows)=>rows.map(([id,label,reply])=>({id,label,...(reply===undefined?{}:{reply})}));
export const deskSource={
 id:'bridge-or-ford',version:1,title:'Bridge or ford?',label:'Story · invented town record',
 arrival:{title:"The Keeper’s Desk",body:'The desk stands in a corner of the Willowbank library, beside books waiting to be put back. Its drawers hold survey maps, a courier’s logbook and questions nobody has had time to answer. Wren has cleared a space for a casebook.',speaker:'Wren Halloway has kept the town’s ledgers since the storm. She pushes the chair out for you.',words:'The town keeps asking questions that need someone to sit with them. Which crossing do we rebuild? Whose account of the flood do we trust? I can do the sums. I can’t do the sitting. Will you take the desk?',recap:'A storm damaged the town. People are working out what to mend and what to build. The desk is where you can sit with one question before the town meeting.',look:'The casebook is open. Choose any part; you can return to Wren’s question whenever you like.',welcome:'Wren hands you the casebook. “One case is open. Start anywhere. I’ll open each part with a little worked example. Fold it away when you want the question, and open it again whenever you like.”'},
 question:'The footbridge at the narrows was closed as unsafe for the two previous winters. The recent storm took the remaining structure. People have been wading the old ford downstream, but farm carts struggle up the bank and sometimes get stuck, and the courier has turned back more than once. The town fund can pay for one crossing this year: 2,700 coins. Wren needs a recommendation for the town meeting.',
 model:{fund:2700,bridge:{setup:1200,rate:60,length:24},causeway:{setup:400,rate:100,length:15},saturday:{carts:45,walkers:135},tuesday:{carts:2,walkers:38}},
 plans:{bridge:'A timber footbridge at the narrows. High banks keep this fictional bridge above floods. Walkers and hand-carts only; farm carts cannot use it. The bridge spans 24 meters from bank-top to bank-top.',causeway:'A stone causeway at the ford: a raised stone path across the shallows. Farm carts can use it. In a flood it goes under.'},
 sourceKinds:choices([['memory','A memory told later'],['log','A log written at the time'],['warning','A survey warning that dates no flood']]),
 records:[
 {id:'hob',title:'Hob Pennick, who farms beside the ford',kind:'A remembered account',date:'Talking to Wren today',text:'“I’ve lived by that ford forty years. I’ve seen it go right under twice. Once was this storm. It’s a fine crossing.”',reply:'Hob tells us what he remembers and values. He has not listed every day or defined “right under”.'},
 {id:'courier',title:'The courier’s logbook',kind:'A log written at the time',date:'The two winters while the footbridge was closed',text:'Seven interrupted journeys, selected from the courier’s log. These are not necessarily seven floods or seven whole impassable days.',entries:[
 'First winter, 12 Nov: Ford too high; turned back and took the hill road (two hours).',
 'First winter, 19 Dec: Water over the stones; took the hill road.',
 'First winter, 3 Feb: Water over the stones at dawn; waited until noon.',
 'Second winter, 8 Nov: Ford too high for this delivery; went round.',
 'Second winter, 21 Dec: Water covered the stepping stones; returned to the post office.',
 'Second winter, 17 Jan: Could not cross at the ford; used the hill road.',
 'Second winter, 4 Mar: Waited at the ford; crossed later that day.'
 ],reply:'The log records interrupted journeys. It does not give measured depths or every crossing.'},
 {id:'map',title:'The town survey map',kind:'A survey warning',date:'1898 (invented date in this story)',text:'Beside the ford, in small print: “Impassable in spate.” Spate means a river’s sudden high flow.',reply:'The warning names a risk. It supplies no dated flood list or later frequency.'}
 ],
 steps:[
 {id:'cost',title:'What does each plan cost?',learn:[
 'A price like this has two parts. The setup is paid once, however long the crossing. The per-meter part grows with every meter.',
 'Try a tiny crossing, 1 meter. Footbridge: 1,200 + 60 = 1,260. Causeway: 400 + 100 = 500.',
 'Now a long one, 50 meters. Footbridge: 1,200 + 3,000 = 4,200. Causeway: 400 + 5,000 = 5,400. Which is cheaper depends on the length.',
 'Each extra meter costs the causeway 40 coins more (100 − 60). The footbridge starts 800 coins behind (1,200 − 400). How many meters use up that head start?',
 'A coefficient is the number multiplying L: in 60L, it is 60. An expression gives a rule, such as 1200 + 60L. An equation says two expressions are equal, such as 1200 + 60L = 400 + 100L.'
 ],guided:['1,200 + 60 × 24','60 × 24 = ?','1,200 + that = ?']},
 {id:'crossings',title:'Who crosses, and how?',learn:[
 'A ratio compares parts: 45 carts to 135 walkers. Divide both by 45 to get 1 to 3. For every cart, three people walked.',
 'A common factor divides both counts exactly. Divide both by it to make an equivalent ratio. Simplest means no factor greater than 1 still divides both.',
 'A fraction compares a part with its whole. Saturday’s 45 carts are 45 of 180 crossings: one of four equal shares, 1/4. A percent says how many out of 100; 1/4 is 25 out of 100.',
 'A difference compares by subtracting: 135 − 45 = 90 more walkers on Saturday. On Tuesday, 38 − 2 = 36. A smaller difference can still mean a much smaller cart share.',
 'A count from one day describes that day. For a usual week, count several days chosen to include busy and quiet days.'
 ],guided:['45 carts : 135 walkers','Divide both parts by 45: 1 cart : 3 walkers','The whole has four equal blocks: one cart block and three walker blocks.']},
 {id:'records',title:'How often does the ford flood?',learn:[
 'Two accounts disagree when they seem to point different ways. They contradict only if both cannot be true at once.',
 'Check three things: Are they measuring the same thing? Do they cover the same time? Was each written when it happened, or remembered later?',
 'A record preserves an account of something. Evidence is what in the record supports a claim. An account may include observations and a person’s interpretation.'
 ],guided:['Hob is speaking now about forty years. A remembered account looks back.']},
 {id:'recommendation',title:'Your recommendation',learn:['Make a recommendation for Wren to read at the meeting. Name a plan, give a reason, consider an objection and say what is uncertain.'],guided:['Start with a plan. You can choose one below and change it later.','My plan is __. My reason is __. One drawback is __. I am unsure about __.']}
 ],
 equality:['1200 + 60L = 400 + 100L','800 + 60L = 100L — take 400 from both sides','800 = 40L — take 60L from both sides','20 = L — divide both sides by 40','Check: 1200 + 60 × 20 = 2400 and 400 + 100 × 20 = 2400'],
 equalityContrast:'Each line should be true by itself. The chain 800 = 40L = 20 is not true: 40L is not 20; L is. Write L = 20 on its own line.',
 costContrast:'For these two sites, the causeway does cost less. Setup alone does not explain that: on the same gap beyond 20 meters, the footbridge costs less. One example cannot show a plan is always cheaper.',
 ratioContrast:'Saturday had 90 more walkers than farm-cart journeys. Tuesday had 36 more. Differences compare by subtracting; ratios compare the sizes of the parts, and fractions compare a part with the whole.',
 tasks:[
 {id:'1a',stepId:'cost',kind:'number',prompt:'What does the footbridge at the 24-meter narrows cost?',hint:'Pay the setup once, then the price for every meter.',example:'A stall costs 100 to set up and 10 per meter. At 3 meters: 100 + 10 × 3 = 130. Your first line: 1,200 + 60 × 24.'},
 {id:'1b',stepId:'cost',kind:'number',prompt:'What does the causeway at the 15-meter ford cost?',hint:'The causeway has its own setup and per-meter price.',example:'A path costs 50 to start and 20 per meter. At 4 meters: 50 + 20 × 4 = 130. Your first line: 400 + 100 × 15.'},
 {id:'1c',stepId:'cost',kind:'budget',prompt:'Which costs fit the 2,700-coin fund?',choices:choices([['fits','Fits the fund'],['not','Does not fit the fund']]),hint:'Compare each price with 2,700, then compare their sum with 2,700.',example:'With 100 coins, plans costing 60 and 80 each fit alone; together 140 does not. Your first line: 2,640 + 1,900 = ?'},
 {id:'1d',stepId:'cost',kind:'number',prompt:'At what shared length do both plans cost the same?',intro:'Bramble writes: “The causeway is cheaper. Look at the setup cost.” Try the same length for both plans before deciding.',hint:'For each extra meter, how much more does the causeway cost than the footbridge?',example:'100 + 10L = 40 + 20L gives 60 = 10L, so L = 6. Your first line: 1,200 + 60L = 400 + 100L.'},
 {id:'1e-bridge',stepId:'cost',kind:'rule',plan:'bridge',prompt:'Write the footbridge cost rule for any length L.',tiles:['1200','+','60','×','L','(',')'],hint:'The fixed part is the setup; L’s coefficient is the price per meter.',example:'A plan with setup 80 and 5 per meter has rule 80 + 5L. Your first line: footbridge setup + footbridge rate × L.'},
 {id:'1e-causeway',stepId:'cost',kind:'rule',plan:'causeway',prompt:'Write the causeway cost rule for any length L.',tiles:['400','+','100','×','L','(',')'],hint:'The fixed part is the setup; L’s coefficient is the price per meter.',example:'A plan with setup 80 and 5 per meter has rule 80 + 5L. Your first line: causeway setup + causeway rate × L.'},
 {id:'2a',stepId:'crossings',kind:'ratio',day:'saturday',prompt:'Write Saturday’s carts-to-walkers ratio in simplest form.',hint:'Divide both parts by the same common factor.',example:'6 carts : 18 walkers becomes 1 : 3 by dividing both by 6. Your first line: 45 : 135, divide both by 45.'},
 {id:'2b',stepId:'crossings',kind:'share',day:'saturday',prompt:'What fraction of Saturday’s crossings used a cart?',hint:'The whole is carts and walkers together.',example:'2 carts among 8 crossings is 2/8 = 1/4. Your first line: 45 / (45 + 135).'},
 {id:'2c-ratio',stepId:'crossings',kind:'ratio',day:'tuesday',prompt:'On rainy Tuesday, write farm carts to walkers in simplest form.',hint:'Keep farm carts first; divide both by a common factor.',example:'3 carts : 27 walkers is 1 : 9. Your first line: 2 : 38.'},
 {id:'2c-share',stepId:'crossings',kind:'share',day:'tuesday',prompt:'What fraction of Tuesday’s crossings used a farm cart?',hint:'Use all Tuesday crossings as the whole.',example:'3 carts among 30 crossings is 3/30 = 1/10. Your first line: 2 / (2 + 38).'},
 {id:'2d',stepId:'crossings',kind:'choice',prompt:'What share of a usual week’s crossings used a farm cart?',choices:choices([
 ['saturday','Use Saturday’s quarter for a usual week; it counted more people.','Saturday tells us about Saturday. More people counted does not make it a usual day.'],
 ['keep-both','Keep both days’ figures; neither tells us a usual week’s share.','These shares describe those days. The usual share might even fall outside 5% to 25%.'],
 ['discard','Discard both days’ figures; neither tells us anything useful about crossings.','The counts do describe those two days. Keep them, and ask for more days before describing a usual week.']])},
 {id:'2e',stepId:'crossings',kind:'multi',prompt:'Who might these counts miss? Choose any to consider.',choices:choices([
 ['home','People who stayed home because the ford was too high.','People who stayed home would not appear in a count at the ford.'],
 ['round','Farm carts that took the long road round instead.','A count at the ford misses people using the long road.'],
 ['early','People who crossed before the volunteers arrived.','We do not know the volunteers’ counting hours.'],
 ['everyone','The volunteers counted everyone, so no one is missed.','They counted everyone who crossed while they were there. Who did not cross, or crossed somewhere else?']])},
 ...[
 ['hob','Hob’s account','How the ford seemed to Hob over decades.','How many days each winter it could not be crossed.','hob-experience','hob-days'],
 ['courier','The courier’s log','The courier recorded seven interruptions over two winters.','The measured water depth on each of those days.','courier-delays','courier-depth'],
 ['map','The survey map','The survey warned high water could make the ford impassable.','How often the ford flooded after 1898.','map-warning','map-frequency']
 ].map(([recordId,name,can,cannot,canId,cannotId])=>({id:`3a-${recordId}`,stepId:'records',kind:'source',recordId,prompt:`What can ${name.toLowerCase()} tell us?`,claims:[{id:canId,label:can},{id:cannotId,label:cannot}]})),
 {id:'3b',stepId:'records',kind:'choice',prompt:'Do Hob and the courier contradict each other?',choices:choices([
 ['different','No. “Right under” and “too high to cross” may differ, within overlapping years.','Both accounts may fit: they count different things within overlapping years. That does not prove either account complete.'],
 ['twice','Yes. Twice in forty years cannot fit seven interrupted journeys in two winters.','Hob counts times it went right under; the courier records interrupted journeys. They may be counting different things.'],
 ['wrong','Yes. One of them must be remembering or reporting it wrong.','That could be true, but nothing in these records shows it. What else could explain both?']])},
 {id:'3c',stepId:'records',kind:'multi',prompt:'What else would you want to know? Choose any.',choices:choices([
 ['depth','The depth of water on the courier’s days.','Measured depths could help compare the courier’s days.'],
 ['height','Whether the causeway would stay passable when the shallows are too deep to wade.','A causeway changes the crossing, so its height and limits matter.'],
 ['years','Records from other years.','Other years could show whether those winters were unusual.'],
 ['farms','What the hill farms say.','People using other routes may have different experiences.']])}
 ],
 recommendation:{fields:['plan','reason','objection','uncertainty'],plans:choices([
 ['bridge','Build the timber footbridge'],['causeway','Build the stone causeway'],['combined','Build the causeway now and consider a footbridge in a later year’s budget'],['deferred','Choose neither yet; gather more evidence before spending'],['custom','Another plan']]),
 starters:{reason:['I am weighing who can cross, what it costs, and what remains uncertain.','The causeway costs 740 coins less, which leaves money for other repairs this year.','A quarter of Saturday’s crossings used a farm cart, so the footbridge would not serve those crossings.','The courier was delayed or turned back seven times in two winters, so a crossing that stays above high water matters.','The causeway costs 740 coins less and allows farm carts to cross.','The footbridge stays above floods in this story, so walkers and the courier could cross on high-water days.'],objection:['I accept that drawback; the town would still need another route in some conditions.','We should gather more evidence before deciding.','I would change my plan after considering this objection.','The footbridge would help walkers and the courier, even though farm carts still need another route.','I would accept flood-day detours to make farm-cart access easier on other days.','The later bridge is a proposal for another year’s budget, not a second purchase now.','Gathering better evidence may avoid spending the fund on the wrong crossing.','I would compare my other plan’s cost, access and limits before proposing it.'],uncertainty:['We only counted two days.','We do not know how deep the water was on the courier’s days.','We do not know how the people who stayed home would have travelled.']},
 objections:{bridge:'So farm carts keep using the ford. You have built a bridge for walkers and left the farms where they were.',causeway:'And when it is under water? The courier turns back, same as now.',combined:'Only one crossing fits this year’s fund. What would wait?',deferred:'What do people use while we wait for more evidence?',custom:'What would this cost, who could cross, and when might it fail?'},
 response:'Wren reads it twice. “Thank you. I’ll read this out tomorrow, as you set it out.”',
 closure:'Your recommendation is pinned to the library noticeboard. The town has received your page; no plan is marked correct.'
 }
};
export const deskStepIds=deskSource.steps.map(s=>s.id);
export const deskTaskIds=deskSource.tasks.map(t=>t.id);
