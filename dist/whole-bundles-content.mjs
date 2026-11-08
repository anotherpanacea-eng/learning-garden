// Finite supplied ribbon stock; none of these names is a learner result.
export const wholeCases=Object.freeze([
 {id:'seven-quarters',title:'Seven quarters',numerator:7,denominator:4,initialPacked:0,sourceWords:'seven quarters',sourceNumeral:null},
 {id:'eleven-quarters',title:'Eleven quarters',numerator:11,denominator:4,initialPacked:0,sourceWords:'eleven quarters',sourceNumeral:null},
 {id:'three-and-two-fifths',title:'Three wholes and two fifths',numerator:17,denominator:5,initialPacked:3,sourceWords:'three wholes and two fifths',sourceNumeral:'3 2/5'},
 {id:'two-and-one-eighth',title:'Two wholes and one eighth',numerator:17,denominator:8,initialPacked:2,sourceWords:'two wholes and one eighth',sourceNumeral:'2 1/8'},
 {id:'five-fifths',title:'Five fifths',numerator:5,denominator:5,initialPacked:0,sourceWords:'five fifths',sourceNumeral:null},
 {id:'two-thirds',title:'Two thirds',numerator:2,denominator:3,initialPacked:0,sourceWords:'two thirds',sourceNumeral:null},
 {id:'zero-quarters',title:'Zero quarters',numerator:0,denominator:4,initialPacked:0,sourceWords:'zero quarters',sourceNumeral:null},
 {id:'two-wholes-thirds',title:'Two wholes in thirds',numerator:6,denominator:3,initialPacked:2,sourceWords:'two wholes, represented with thirds',sourceNumeral:null}
].map(Object.freeze));

export const wholeCopy=Object.freeze({
 story:'Some ribbons are bundled as whole lengths. Some are loose pieces. Can we count the same stock both ways?',
 instruction:'Bundle a whole from equal pieces, or open a whole to see its pieces. The amount of ribbon stays the same.',
 visit:'These bundles stay while you use this table. Leaving or reloading starts fresh; this work is not saved in Notes.',
 grownUp:'A finite model of counting one amount in unit fractions or whole bundles and parts. Supplied counts and names support discussion; this is not an independent conversion assessment. Mixed-number operations, trading for subtraction and a later cross-game application remain separate work.',
 frames:Object.freeze([
  'Seven pieces, each one third of a whole. Three thirds make one whole.',
  'Bundle three thirds as one whole. Four thirds stay loose. One whole and four thirds is still seven thirds; another whole can be bundled.',
  'Two wholes and one third. Each whole holds three thirds, so the bundles hold six thirds, with one more loose.',
  'Open one whole. Its three thirds join the one loose third. One whole and four thirds names the same amount.',
  'Open the other whole. 2 × 3 + 1 = 7 thirds. Going back to pieces checks the other name. The denominator stays 3 because the piece size has not changed.',
  'Treating 2 wholes and 1 third as though 2 + 1 = 3 thirds counts different units as though they were the same. Two wholes contain six thirds. With one more third, the amount is 7/3, not 3/3. The fraction 3/3 is one whole; it names a different amount here.'
 ]),
 frameSpeech:Object.freeze([
  'Seven pieces, each one third of a whole. Three thirds make one whole.',
  'Bundle three thirds as one whole. Four thirds stay loose. One whole and four thirds is still seven thirds; another whole can be bundled.',
  'Two wholes and one third. Each whole holds three thirds, so the bundles hold six thirds, with one more loose.',
  'Open one whole. Its three thirds join the one loose third. One whole and four thirds names the same amount.',
  'Open the other whole. Two times three, plus one, equals seven thirds. Going back to pieces checks the other name. The denominator stays three because the piece size has not changed.',
  'Treating two wholes and one third as though two plus one equals three thirds counts different units as though they were the same. Two wholes contain six thirds. With one more third, the amount is seven thirds, not three thirds. The fraction three thirds is one whole; it names a different amount here.'
 ])
});
