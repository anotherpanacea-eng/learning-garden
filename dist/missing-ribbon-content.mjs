// Supplied missing-length readouts; these are support, not an independent attempt.
import {missingCases} from './missing-ribbon-core.mjs';
export const missingCopy=Object.freeze({
 title:'Find the other length',
 chooser:'Choose a total and one known length. Then find what remains.',
 introduction:'Sometimes we know the total and one part. A fresh ribbon matches that total. Set aside the known length to see what remains. We are matching lengths, not finding an old seam.',
 whole:'Each full strip stands for the same whole length. Setting pieces aside loses no ribbon in this model.',
 locked:'Return the set-aside pieces before changing the cuts.',
 talk:'How could you check the remaining length by joining? What changes when you recut, and what stays the same?',
 visit:'Both tables keep your cuts and moves while you are here. Leaving starts fresh; this work is not saved in Notes.',
 grownUp:'A supplied model of a missing part. The visible quantities, reference and checks support reasoning; they do not measure independent calculation or establish a general level.',
 frames:Object.freeze([
 'We know the total, three quarters, and a known part, one half. We want the length left after setting that half aside. These piece sizes differ.',
 'A half is two quarters of the same whole. The total is still three quarters.',
 'One quarter is set aside. Two quarters remain. The set-aside length does not yet match the known half.',
 'Two quarters match the known half. One quarter remains: 3/4 − 2/4 = 1/4. Check: 2/4 + 1/4 = 3/4.',
 'Subtracting the tops and the bottoms of the original 3/4 and 1/2 would say 2/2. But 2/2 is one whole, longer than the entire 3/4 ribbon we started with. Setting a part aside cannot leave more than the starting length.'
 ])
});
const titles=Object.freeze({
 'half-and-third':'The welcome banner',
 'equal-banners':'A banner with one length reserved',
 'quarter-third':'The gathering arch',
 'sixth-quarter':'The doorway ribbon',
 'quarter-and-third':'A place-label length'
});
export const missingJobs=Object.freeze(Object.fromEntries(missingCases.map(c=>[c.id,Object.freeze({
 title:titles[c.id],
 request:`A fresh ribbon has length ${c.totalNumerator}/${c.totalDenominator}. Set aside a length equal to A, ${c.knownNumerator}/${c.knownDenominator}. What length will remain?`
})])));
export const missingKnownNumerator=m=>m.known.numerator;
export const missingUnmatched=m=>`The total has pieces of size 1/${m.totalDenominator}; A has pieces of size 1/${m.known.denominator}. Make the piece sizes match before counting how many to set aside. The lengths stay the same.`;
export const missingMatched=m=>`Set aside pieces until that tray matches A’s known length. Each piece has size 1/${m.totalDenominator}.`;
export const missingWhole=(n,d)=>n>=d?`${d} pieces fill one whole; ${n-d} more ${n-d===1?'piece':'pieces'}.`:'';
export const missingPartial=m=>m.matched?`Remaining so far: ${m.remaining}/${m.totalDenominator}. Set aside so far: ${m.removed}/${m.totalDenominator}. Target length A: ${missingKnownNumerator(m)}/${m.totalDenominator}.`:'The whole given length is still here. Match the piece sizes to count the known part.';
export const missingEquation=m=>`${m.totalNumerator}/${m.totalDenominator} − ${missingKnownNumerator(m)}/${m.totalDenominator} = ${m.difference}/${m.totalDenominator}. Check: ${missingKnownNumerator(m)}/${m.totalDenominator} + ${m.difference}/${m.totalDenominator} = ${m.totalNumerator}/${m.totalDenominator}.`;
export const missingCompletion=m=>`The set-aside length matches A. The other length is ${m.difference}/${m.totalDenominator}. ${missingEquation(m)}`;
export const missingReference=m=>m.matched?`Reference — the other length. ${missingEquation(m)} This shows the whole requested separation, not necessarily the pieces you have set aside so far.`:`Reference — the other length. The card gives ${m.originalTotalNumerator}/${m.originalTotalDenominator} in total and ${m.known.originalNumerator}/${m.known.originalDenominator} for A. Make equal-sized pieces to show their difference.`;
