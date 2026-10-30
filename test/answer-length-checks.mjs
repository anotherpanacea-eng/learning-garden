// A review heuristic, not a measure of teaching quality: flag a fitting choice only
// when it is over 25% AND at least 12 characters longer than every distractor.
import assert from 'node:assert/strict';
import {storyNodes} from '../dist/story-content.mjs';
import {parisLibraryNodes} from '../dist/paris-library.mjs';

export function longestGiveaway(choices,answer){
  const lengths=choices.map(c=>c.length),right=lengths[answer];
  const longestOther=Math.max(...lengths.filter((_,i)=>i!==answer));
  return right>longestOther*1.25&&right-longestOther>=12;
}

// These three authored questions quote passage sentences. Each has three
// reading-length variants; this is not an exemption for the whole reading skill.
const evidenceIds=new Set(['seed-envelopes','windy-sign','puppet-post'].flatMap(story=>
  [1,2,3].map(variant=>`paris-explore-${story}-${variant}-1`)));
export function answerLengthFlags(nodes){
  return Object.values(nodes)
    .filter(n=>n.kind==='choice'&&Array.isArray(n.choices)&&n.choices.length>=2&&Number.isInteger(n.answer))
    .filter(n=>!evidenceIds.has(n.id))
    .filter(n=>longestGiveaway(n.choices,n.answer)).map(n=>n.id);
}

assert.equal(longestGiveaway(['Every flat roof leaks','The card under the folded roof had fewer wet marks'],1),true,'a much longer fitting choice is flagged');
assert.equal(longestGiveaway(['Every flat roof leaks, so no flat roof could keep a card dry','The card under the folded roof had fewer wet marks'],1),false,'balanced choices pass');
const sized=(other,right)=>['x'.repeat(other),'y'.repeat(right)];
assert.equal(longestGiveaway(sized(48,60),1),false,'exactly 25% longer passes');
assert.equal(longestGiveaway(sized(48,61),1),true,'over 25% and at least 12 extra characters flags');
assert.equal(longestGiveaway(sized(20,31),1),false,'11 extra characters passes even above 25%');
assert.equal(longestGiveaway(sized(20,32),1),true,'12 extra characters flags above 25%');
assert.equal(longestGiveaway(['x'.repeat(60),'y'.repeat(60),'z'],0),false,'a tied longest answer passes');
const fixture=id=>({id,kind:'choice',choices:sized(20,40),answer:1,readingSkill:'Find a sentence that supports an idea'});
for(const id of evidenceIds)assert.deepEqual(answerLengthFlags([fixture(id)]),[],'each reviewed variant is exempt');
for(const id of ['new-evidence-question','paris-explore-seed-envelopes-4-1','paris-explore-seed-envelopes-1-2'])
  assert.deepEqual(answerLengthFlags([fixture(id)]),[id],'same skill, new variant or other task is not exempt; two-choice sets are scanned');
assert.deepEqual(answerLengthFlags([{...fixture('three-choices'),choices:[...sized(20,40),'short']}]),['three-choices'],'three-choice sets are scanned');

// storyNodes includes the Paris library and imported story packs, as well as
// the original story choices. Check that coverage explicitly so it cannot drift.
for(const [id,node] of Object.entries(parisLibraryNodes))assert.deepEqual(storyNodes[id],node,`Paris choice coverage: ${id}`);
const flags=answerLengthFlags(storyNodes);
assert.deepEqual(flags,[],'fitting choice is noticeably the longest:\n'+flags.join('\n'));
console.log('answer length checks passed');
