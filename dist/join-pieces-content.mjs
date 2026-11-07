// Supplied joining readouts; no learner record or independent answer is inferred.
export const joinCopy=Object.freeze({
 title:'Join the Pieces',introduction:'Lay two ribbon lengths end to end. To name the joined length with one fraction, first make their pieces the same size. Then move the pieces into one joined length.',
 whole:'Each full strip stands for the same whole length. A join in this model loses no ribbon.',
 cutting:'Try cuts on A and B until their pieces are the same size. The original lengths stay the same.',
 matching:'The pieces match. Move one piece at a time from either tray. Keep counting pieces of this size.',
 transfer:'The outlined slots show pieces already moved. The original strips above are references, not extra ribbon.',
 locked:'Return the joined pieces before changing the cuts.',
 visit:'Your cuts and moves stay while you are at this table. Leaving starts a fresh table; this work is not saved in Notes.',
 talk:'Why does the piece size stay the same when you join? Where did each piece come from? Try returning the pieces in reverse order.',
 grownUp:'A movable model of joining lengths. The displayed totals and reference are supplied reasoning. This does not measure independent calculation, learning, real cloth or a general level.',
 frames:Object.freeze([
 'A half and a quarter use different-sized pieces. We can lay them end to end, but cannot count them as two pieces of one size.',
 'Two quarters name the same length as one half. Now each small piece is one quarter of the same whole.',
 'Two quarters have moved. One quarter is still in B’s tray. The joined length so far is 2/4.',
 'Two quarters and one quarter make three quarters: 2/4 + 1/4 = 3/4. The pieces are still quarters.',
 'Adding the tops and the bottoms of the original 1/2 and 1/4 would say 2/6. But sixths are smaller than quarters, and 2/6 is shorter even than A’s half alone. Joining changes the count of pieces, not their size.'
 ])
});
export const joinJobs=Object.freeze({
 'half-and-third':{title:'Welcome ribbons',request:'Join the half-length and third-length ribbons for a welcome banner. How long are they together?'},
 'equal-banners':{title:'Two equal lengths',request:'Both ribbons have the same length, with different piece names. Join both lengths for one banner.'},
 'quarter-third':{title:'A longer banner',request:'Join the two ribbon lengths for the gathering. The joined length can pass one whole.'},
 'sixth-quarter':{title:'Doorway streamers',request:'Lay the two lengths end to end. Find their combined length using one piece size.'},
 'quarter-and-third':{title:'Small place labels',request:'Join the quarter-length and third-length ribbons into one usable length.'}
});
export const joinUnmatched=m=>`A’s pieces are 1/${m.left.denominator} of the whole and B’s are 1/${m.right.denominator}. Different-sized pieces can be laid end to end, but cannot be counted together as pieces of one size. Cut until both trays use the same piece size.`;
const pieces=n=>`${n} ${n===1?'piece':'pieces'}`;
export const joinSource=(letter,m)=>`${letter}: ${pieces(m.remaining)} still here; ${pieces(m.moved)} moved. Each piece is 1/${m.denominator} of the same whole.`;
export const joinOutput=m=>m.matched?`Joined so far: ${m.count}/${m.denominator} of the whole length. ${pieces(m.count)}, each 1/${m.denominator} of the same whole.${m.count>=m.denominator?` ${m.denominator} pieces fill one whole; ${m.count-m.denominator} more ${m.count-m.denominator===1?'piece':'pieces'}.`:''}`:'No pieces moved. Match the piece sizes to count the joined length with one fraction name.';
export const joinEquation=m=>`${m.left.numerator}/${m.denominator} + ${m.right.numerator}/${m.denominator} = ${m.fullNumerator}/${m.denominator}`;
export const joinReference=m=>m.matched?`Reference — the whole sum. ${joinEquation(m)}. These are pieces of one size, each 1/${m.denominator} of the same whole.`:`Reference — the whole sum. ${m.left.originalNumerator}/${m.left.originalDenominator} + ${m.right.originalNumerator}/${m.right.originalDenominator}. To name this total with one fraction, first make equal-sized pieces. The original amounts stay the same.`;
