// The fitting choice is not noticeably the longest (AGENTS.md; roadmap lane A, step 4). A bounded
// scan of story choices. Evidence-sentence questions quote the passage verbatim, so their lengths
// come from the story and are left to the story's own review.
import assert from 'node:assert/strict';
import {storyNodes} from '../dist/story-content.mjs';

export function longestGiveaway(choices,answer){
  const lengths=choices.map(c=>c.length),right=lengths[answer];
  const longestOther=Math.max(...lengths.filter((_,i)=>i!==answer));
  return right>longestOther*1.25&&right-longestOther>=12;
}

assert.equal(longestGiveaway(['Every flat roof leaks','The card under the folded roof had fewer wet marks'],1),true,'a much longer fitting choice is flagged');
assert.equal(longestGiveaway(['Every flat roof leaks, so no flat roof could keep a card dry','The card under the folded roof had fewer wet marks'],1),false,'balanced choices pass');

const flags=Object.values(storyNodes)
  .filter(n=>n.kind==='choice'&&Array.isArray(n.choices)&&n.choices.length>2&&Number.isInteger(n.answer))
  .filter(n=>n.readingSkill!=='Find a sentence that supports an idea')
  .filter(n=>longestGiveaway(n.choices,n.answer)).map(n=>`${n.id}: ${n.choices[n.answer]}`);
assert.deepEqual(flags,[],'fitting choice is noticeably the longest:\n'+flags.join('\n'));
console.log('answer length checks passed');
