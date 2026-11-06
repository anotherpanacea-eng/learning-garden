// Original finite number rules and teaching. Upstream work is design study only.
export const mixerCases=Object.freeze([
 {id:'sum',title:'Two library clues',question:'Can you combine the rows so one letter disappears? Check a pair in both originals.',rows:[[1,1,7],[1,-1,1]]},
 {id:'difference',title:'Another pair of clues',question:'Try adding or subtracting. What happens to the y column?',rows:[[2,1,9],[1,1,5]]},
 {id:'scale',title:'A larger row',question:'Try changing a whole row before combining. Include its right-hand side.',rows:[[1,2,8],[3,-1,3]]},
 {id:'thirds',title:'The next demonstration',question:'A fitting pair may use fractions. Keep the fractions exact.',rows:[[2,1,4],[1,-1,0]]},
 {id:'separated',title:'Two library notes',question:'Do these originals have any pair in common? One tried pair is not enough to decide.',rows:[[1,1,4],[2,2,10]]},
 {id:'repeated',title:'One more note',question:'Do these originals give different information, or repeat one clue?',rows:[[1,-1,2],[2,-2,4]]}
]);
const rows=xs=>xs.map(([a,b,c],i)=>({label:i?'Row B':'Row A',a,b,c}));
const pair=(x,y,d=1)=>({x:{n:x,d},y:{n:y,d}});
const example=(xs,factors,op,p,preview,check,reference)=>({v:1,model:'two-rows-v1',rows:rows(xs),factors,op,pair:p,preview,check,reference});
const teaching=[
 {words:'Two clues stay on the table. A row is an equality. If both originals are true for a pair, adding their left sides and adding their right sides gives another true equality. Keep the originals: the new row alone may fit extra pairs.',example:example([[1,1,6],[1,-1,2]],[1,1],'add',pair(4,2),true,true,false)},
 {words:'Multiply every part. Multiplying a whole equality by a nonzero number keeps its solutions. Include both letter columns AND the number on the right. Choose factors to make opposite coefficients before adding.',example:example([[1,2,5],[2,-1,0]],[1,2],'add',pair(1,2),true,true,true)},
 {words:'Zero loses a clue. Multiplying by zero changes any row to 0=0. That is true for every pair. It cannot tell us which pairs fit the originals. Even two zeroed rows do not show that the originals share every pair.',example:example([[1,1,6],[1,-1,2]],[0,0],'add',pair(0,0),true,true,false)},
 {words:'A contradiction matters. If a combination of the originals requires zero to equal a nonzero number, no pair can make both originals true.',example:example([[1,1,3],[2,2,8]],[2,1],'subtract',null,true,false,true)},
 {words:'A repeated clue is still a line. Here the second original is exactly twice the first, including the right side. They describe the same line of pairs. That is not every pair in the plane. Check (1,2), then discuss why (0,0) does not fit.',example:example([[1,1,3],[2,2,6]],[2,1],'subtract',pair(1,2),true,true,true)},
 {words:'Keep fractions exact. Your mixture gives 3x=5. Dividing both sides by 3 gives x=5/3. Substituting in the first original gives 2(5/3) + y = 5, so y = 5 - 10/3 = 5/3. A rounded decimal is not needed. Check the exact pair in both originals.',example:example([[2,1,5],[1,-1,0]],[1,1],'add',pair(5,5,3),true,true,true)}
];
export function makeMixerSource(caseId='sum'){
 const c=mixerCases.find(c=>c.id===caseId);if(!c)return null;
 return structuredClone({v:1,model:'two-rows-v1',id:`rule-mixer-${c.id}`,title:c.title,story:'The traveling library wants a demonstration for its next stop. The librarian has two number rules. Can you show how they work together?',question:c.question,rows:rows(c.rows),teaching});
}
export const mixerCopy=Object.freeze({
 title:'Rule Mixer',tagline:'Make two clues work together.',
 domain:'The equations are abstract number rules, not lengths or amounts the library owns. They allow all real x and y. Our controls offer a smaller set to try.',
 consequence:'Your mixture is a consequence of both originals. Keep the originals to find their shared pairs.',
 zeroColumns:{x:'The x coefficient is zero in this mixture.',y:'The y coefficient is zero in this mixture.',both:'Both letter coefficients are zero in this mixture.',neither:'Neither letter coefficient is zero in this mixture.'},
 tautology:'This mixture says 0=0. It fits every pair, but it does not tell us whether the originals fit any pair together.',
 proportional:'This mixture says 0=0 because every column comes to zero with nonzero copies of BOTH originals. The originals are nonzero multiples of each other. They give the same clue: a whole line of shared pairs, not every pair in the plane.',
 oneLetter:'This row has one letter left. It helps find that coordinate, but the pair must still fit both originals.',
 twoLetters:'This row still has two letters. It is a useful consequence, but it does not finish the system on its own.',
 noPair:'Choose a pair first. The starting cursors are not a proposed answer.',
 checkKinds:{both:'Fits both originals.',first:'Fits A only.',second:'Fits B only.',neither:'Fits neither original.'},
 checkHelp:'This check is help for your chosen pair, not a score.',
 reference:'This is a worked route, not a change to your mixture or pair.',
 classification:{none:'No common pair: the variable columns are proportional, but the right sides are not in the same proportion.',line:'A whole shared line: all three columns are proportional. Both originals give the same clue. That is a line of pairs, not every pair in the plane.',one:'One common pair: the two original rows give different directions. The calculation finds one exact pair; the check puts it in both originals.'},
 unreadable:'Earlier work is retained. This saved format cannot be edited here. Other sheets and places stay open; your exact records remain in Notes.',
 pictureUnavailable:"This example's picture cannot be drawn here. Its words stay available.",
 refused:'This calculation could not be shown safely. Your earlier choices and words are unchanged. Retry, choose another activity or download Notes.',
 stale:'Your saved sheets changed. Keep your visible words, then reopen the saved sheets. This does not merge or replace either version.',
 pending:'Your visible words have not been kept. Shorten the marked field, or copy it and choose Restore earlier words before continuing.',
 kept:'This sheet is kept.',off:'Kept for this visit; saving is off.',uncertain:'Kept for this visit; device saving is uncertain. Download Notes before leaving.',
 keepRefused:'This sheet could not be kept safely. Earlier sheets are unchanged. Download Notes before making room.',
 grownups:'This is an open supported algebra investigation. It keeps proposed mixtures, pairs, requested explanations and original writing. It does not grade the writing or establish independent attainment. Computed arithmetic may mark the same fact as shown in a waiting question elsewhere. A zero factor intentionally demonstrates lost information; the originals remain the source of the shared solution set.'
});
