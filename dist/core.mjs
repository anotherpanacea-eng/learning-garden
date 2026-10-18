export const STORAGE_KEY = 'number-garden-v1';
export const freshState = () => ({version:1, baseline:{index:0, observations:[], complete:false}, practice:[], puzzles:[], sessions:0});
export const factKey = (a,b) => [a,b].sort((x,y)=>x-y).join('x');
export const numericAnswer = value => {
  const text=String(value).trim();
  return /^\d+$/.test(text) ? Number(text) : null;
};
export function observation(q, active, method='together', skip=false, source='checkin') {
  const correct=active.attempts.at(-1)===q.answer;
  const firstCorrect=active.attempts.length===1 && correct;
  const supported=!!active.hinted || !!active.revealed || method==='together';
  return {questionId:q.id, skill:q.skill, label:q.label, prompt:q.prompt, answer:q.answer,
    fact:q.fact||null, attempts:[...active.attempts], correct:skip?false:correct,
    status:skip?(active.attempts.length?'explored':'skipped'):(correct?'answered':'explored'),
    firstCorrect:!skip&&firstCorrect, supported, hinted:!!active.hinted, revealed:!!active.revealed,
    independent:!skip&&firstCorrect&&!supported, method:skip?null:method, source, at:new Date().toISOString()};
}
export function recommendations(state) {
  const assessed=state.baseline.observations.filter(o=>o.status!=='skipped');
  const practice=state.practice.filter(o=>o.status!=='skipped');
  const latest=new Map();
  for(const o of [...assessed,...practice]) if(o.fact) latest.set(factKey(...o.fact),o);
  const groups=assessed.find(o=>o.skill==='groups');
  const unsure=[...latest.values()].filter(o=>!o.correct||o.supported||!o.firstCorrect);
  const derived=[...latest.values()].filter(o=>o.correct&&!o.supported&&o.firstCorrect&&o.method==='worked');
  const counted=[...latest.values()].filter(o=>o.correct&&!o.supported&&o.firstCorrect&&o.method==='counted');
  let route='mixed', reason='A gentle mix is a good place to explore. There is no need to finish the check-in first.';
  if(groups&&!groups.independent) { route='visual';reason='The equal-groups task is worth another look together. Start with pictures, or choose a different path.'; }
  else if(unsure.length) {route='facts';reason='Give a few facts that needed another look some room to grow, with a useful strategy alongside.';}
  else if(counted.length) {route='strategy';reason='Counting found an answer. Try connecting groups to a known fact and see whether that feels useful.';}
  else if(derived.length) {route='facts';reason='Working it out is good mathematical thinking. A little practice can make those facts more familiar.';}
  else if(assessed.length) reason='The sampled tasks offer a starting point. Explore more facts and keep trying interesting problems.';
  const priority=[...unsure,...counted,...derived].map(o=>o.fact).filter(Boolean);
  const application=assessed.find(o=>o.skill==='application');
  const suggestion=groups?.independent&&application?.independent?'stretch':groups&&!groups.independent?'gentle':'curious';
  return {route,reason,priority,suggestion,assessedCount:assessed.length};
}
export function makePractice(state, route='auto') {
  const rec=recommendations(state), chosen=route==='auto'?rec.route:route;
  const seed=state.sessions||0;
  const pool=[[2,6],[5,7],[4,6],[3,8],[7,8],[6,9],[4,7],[3,9],[8,8],[6,6],[7,9],[4,8]];
  const rotated=[...pool.slice(seed%pool.length),...pool.slice(0,seed%pool.length)];
  const visual=[[2,3],[3,4],[4,5],[2,8],[3,6],[4,4]];
  const priority=chosen==='mixed'?[]:rec.priority;
  const v=seed%visual.length,visualRotated=[...visual.slice(v),...visual.slice(0,v)];
  let candidates=chosen==='visual'?visualRotated:[...priority.slice(0,3),...rotated];
  const lastFact=state.practice.at(-1)?.fact;
  if(lastFact){const key=factKey(...lastFact),same=candidates.filter(p=>factKey(...p)===key),other=candidates.filter(p=>factKey(...p)!==key);candidates=[...other.slice(0,2),...same.slice(0,1),...other.slice(2)];}
  const seen=new Set(), facts=[];
  for(const pair of candidates) {const key=factKey(...pair);if(!seen.has(key)){facts.push(pair);seen.add(key);}if(facts.length===6)break;}
  return facts.map(([a,b],i)=>({id:`practice-${seed}-${i}`,skill:'facts',label:`${a} × ${b}`,fact:[a,b],answer:a*b,
    title:chosen==='visual'?'Build it, then try it':chosen==='strategy'?'Start with a fact you know':'Find a way that works',strategyLead:chosen==='strategy',
    prompt:`What is ${a} × ${b}?`,kind:'number',visual:chosen==='visual',a,b,
    hint:factHint(a,b),solution:`${a} groups of ${b} make ${a*b}. ${factHint(a,b)}`}));
}
export function factHint(a,b) {
  if(a===2) return `Double ${b}: ${b} + ${b}.`;
  if(a===5) return `Start with 10 × ${b} = ${10*b}. Five groups is half as many groups, so find half of ${10*b}.`;
  if(a>5) return `Start with 5 × ${b} = ${5*b}. Add ${a-5} more ${a-5===1?'group':'groups'} of ${b}.`;
  return `Start with 2 × ${b} = ${2*b}. Add ${a-2} more ${a-2===1?'group':'groups'} of ${b}.`;
}
export const methodLabel = {knew:'Knew it',worked:'Worked it out',counted:'Counted',together:'With help'};
export function describe(o) {
  if(!o||o.status==='skipped')return 'Not explored yet';
  if(!o.correct)return 'Worth another look together';
  if(o.supported)return 'Found it with support';
  if(!o.firstCorrect)return 'Found it after another try';
  if(o.exposed)return 'Answered after a related example';
  if(o.method==='worked')return 'Worked it out independently';
  if(o.method==='counted')return 'Counted independently';
  return 'Answered independently';
}
export function restoreStateResult(raw) {
  const failed=reason=>({state:freshState(),reason});
  try {const s=JSON.parse(raw);if(s?.version!==1||!s.baseline||!Array.isArray(s.baseline.observations)||!Array.isArray(s.practice)||!Array.isArray(s.puzzles)||!Number.isInteger(s.baseline.index)||s.baseline.index<0||s.baseline.index>6||typeof s.baseline.complete!=='boolean'||!Number.isInteger(s.sessions)||s.sessions<0)return failed('The saved state has an unsupported or invalid structure.');
    const valid=o=>o&&typeof o.questionId==='string'&&typeof o.skill==='string'&&Array.isArray(o.attempts)&&o.attempts.every(Number.isFinite)&&['skipped','explored','answered'].includes(o.status)&&(!o.fact||(Array.isArray(o.fact)&&o.fact.length===2&&o.fact.every(Number.isFinite)));
    if(![...s.baseline.observations,...s.practice,...s.puzzles].every(valid)) return failed('Some original task records could not be read.');
    if(s.baseline.draft&&(!Array.isArray(s.baseline.draft.attempts)||!s.baseline.draft.attempts.every(Number.isFinite)||typeof s.baseline.draft.questionId!=='string'))delete s.baseline.draft;
    if(s.exposures&&(!Array.isArray(s.exposures)||!s.exposures.every(v=>typeof v==='string')))delete s.exposures;
    return {state:s,reason:null};
  } catch {return failed('The saved value is not readable JSON.');}
}
export function restoreState(raw) {return restoreStateResult(raw).state;}
