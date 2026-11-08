// Original finite material, separate from saved learner work.
export const groupCases=Object.freeze([
 ['six-eighths','Six eighths',6,8],
 ['eighteen-twentyfourths','Eighteen twenty-fourths',18,24],
 ['fourteen-twentyfirsts','Fourteen twenty-firsts',14,21],
 ['five-twelfths','Five twelfths',5,12],
 ['zero-twelfths','Zero twelfths',0,12],
 ['whole-twelfths','Twelve twelfths',12,12]
].map(([id,title,numerator,denominator])=>Object.freeze({id,title,numerator,denominator})));

export const groupCopy=Object.freeze({
 story:'Wren is preparing ribbon markers for a gathering. Can we describe the colored length with fewer, larger pieces? Keep the whole and the colored end in place.',
 instruction:'Choose how many current pieces to put in each new piece. Look for complete groups in both the whole and its colored part.',
 visit:'These ribbons stay while you use this table. Leaving or reloading starts fresh; this work is not saved in Notes.',
 grownUp:'A finite visual model of common-factor grouping, not an independent calculation or explanation assessment. No activity result is recorded. General factor finding, mixed numbers, written methods and a later cross-game return remain separate work.',
 frames:Object.freeze([
  'Six of nine equal pieces are colored. Keep the whole and the colored end in place.',
  'Each new piece will contain three old pieces. Nine pieces make three groups; six colored pieces make two.',
  '6 ÷ 3 = 2 and 9 ÷ 3 = 3. We divided both counts by the same factor. The pieces are larger; the colored amount is unchanged.',
  'Two fits the colored pieces, but leaves one old piece over in the whole. We cannot rename both counts as complete groups of two.',
  'Nine fits the whole, but the colored end cuts through that group. Both counts must form complete groups.',
  'Subtracting the same number changes this amount: 3/6 is one half; 6/9 is two thirds. Dividing both counts by 3 gives 2/3 and keeps the amount.'
 ])
});
