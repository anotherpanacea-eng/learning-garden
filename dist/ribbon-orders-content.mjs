// These supplied names describe the original stock and requested order.
export const orderCases=Object.freeze([
 {id:'quarters-gathering',title:'Quarters for the gathering',numerator:17,denominator:4,target:7,stockName:'4 wholes and 1/4',orderName:'1 whole and 3/4',stockSpeech:'four wholes and one quarter',orderSpeech:'one whole and three quarters'},
 {id:'sixths-path',title:'Sixths for the path',numerator:26,denominator:6,target:11,stockName:'4 wholes and 2/6',orderName:'1 whole and 5/6',stockSpeech:'four wholes and two sixths',orderSpeech:'one whole and five sixths'},
 {id:'quarters-without-trade',title:'Quarters without opening',numerator:23,denominator:4,target:15,stockName:'5 wholes and 3/4',orderName:'3 wholes and 3/4',stockSpeech:'five wholes and three quarters',orderSpeech:'three wholes and three quarters'},
 {id:'fifths-crossing',title:'Fifths for the crossing',numerator:7,denominator:5,target:4,stockName:'1 whole and 2/5',orderName:'4/5',stockSpeech:'one whole and two fifths',orderSpeech:'four fifths'},
 {id:'whole-stock',title:'An order from whole stock',numerator:8,denominator:4,target:3,stockName:'2 wholes',orderName:'3/4',stockSpeech:'two wholes',orderSpeech:'three quarters'},
 {id:'all-ribbon',title:'Send all the ribbon',numerator:5,denominator:4,target:5,stockName:'1 whole and 1/4',orderName:'1 whole and 1/4',stockSpeech:'one whole and one quarter',orderSpeech:'one whole and one quarter'},
 {id:'no-order',title:'No ribbon requested',numerator:7,denominator:4,target:0,stockName:'1 whole and 3/4',orderName:'zero',stockSpeech:'one whole and three quarters',orderSpeech:'zero'}
].map(Object.freeze));

export const orderCopy=Object.freeze({
 story:'Bramble is preparing ribbon for the paths to a gathering.',
 instruction:'The order needs whole lengths and pieces. Open a whole when you need loose pieces, then send the ribbon. How much stays on the rack?',
 visit:'These orders stay while you use this table. Leaving or reloading starts fresh; this work is not saved in Notes.',
 grownUp:'A finite ribbon model for separating like-sized fractions and opening whole units. Counts and optional explanations are supplied support, not independent subtraction evidence. Unlike denominators, written methods, simplification and a later cross-game application remain separate work.',
 frames:Object.freeze([
  'Two wholes and one quarter are ready. The order needs three quarters. There is only one loose quarter.',
  'Open one whole into four quarters. There are now five loose quarters. The total amount has not changed.',
  'Send one quarter. Four loose quarters stay beside the whole.',
  'Send another quarter. The order now has two quarters.',
  'Three quarters have been sent. One whole and two quarters stay: six quarters altogether.',
  'Subtracting the smaller fractional count from the larger would give two wholes and two quarters here. That is ten quarters, not the six quarters left. Opening a whole keeps the subtraction in the right order.'
 ])
});
