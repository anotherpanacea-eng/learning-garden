// Original finite, invented settled readings; no real spring specification.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const springCases=freeze([
 {id:'A',title:'A steady stretch',startLength:6,forces:[0,1,2,3],loadedLengths:[6,8,10,12],releasedLengths:[6,6,6,6],note:'Each extra newton adds 2 cm in these loading readings. With no pull after a test, its length is 6 cm.',unitsCopy:'For A’s offered loading readings from 0 to 3 N: extension = 2 × pull, and length = 6 + 2 × pull. Each extra newton adds 2 cm.'},
 {id:'B',title:'Less stretch per newton',startLength:8,forces:[0,1,2,3],loadedLengths:[8,9,10,11],releasedLengths:[8,8,8,8],note:'Each extra newton adds 1 cm in these loading readings. Its starting length is 8 cm, not zero.',unitsCopy:'For B’s offered loading readings from 0 to 3 N: extension = pull, and length = 8 + pull. Each extra newton adds 1 cm.'},
 {id:'C',title:'A changing rate',startLength:6,forces:[0,1,2,3],loadedLengths:[6,7,9,12],releasedLengths:[6,6,6,6],note:'The increases change: 1 cm, then 2 cm, then 3 cm. Yet this model is 6 cm long after the pull is removed. A changing rate alone does not show permanent change.',unitsCopy:'The increases are not constant, so one constant k does not describe all these loading readings.'},
 {id:'D',title:'A change that stays',startLength:6,forces:[0,1,2,3,4],loadedLengths:[6,8,10,12,15],releasedLengths:[6,6,6,6,7],note:'Up to 3 N these loading readings follow the same straight pattern as A. The 4 N reading does not. After that 4 N pull is removed, 1 cm of extra length remains. These readings do not locate an exact limit between the tested pulls.',unitsCopy:'A’s rule fits this model’s loading readings from 0 to 3 N, but not its 4 N reading. We do not use it for the retained change after unloading.'}
]);
export const springCopy=freeze({
 title:'Spring Bench',entry:'Spring Bench: length or extra length?',
 intro:'Moss is planning a spring-return sign for the evening gathering. A spring can get longer and still come back. Which length tells us how much it changed?',
 modelNote:'These are made-up spring readings. We choose a pull, see a settled length, then remove the pull.',
 request:'Mark the extra length from the starting unloaded end. Your mark describes a length; it does not pull the spring.',
 key:'Length is the whole spring from ruler zero. Extension here is the extra length from its starting unloaded length.',
 units:'N means newtons, a unit of force. cm means centimeters, a unit of length.',
 states:{fresh:'Fresh matching spring',loaded:'Pull applied',released:'Pull removed'},
 zeroLoaded:'Zero-pull reading',zeroReleased:'Zero-pull test finished',zeroHelper:'At 0 N there is no applied pull. The starting length has not changed.',
 noMark:'No extension mark yet. Add one to try a length.',markBounds:'This mark tool offers 0 to 10 cm, in half-centimeter steps.',
 resetNote:'A fresh matching spring starts a new test and clears this case’s mark. Other spring tests stay as you left them.',alreadyFresh:'This spring is already fresh.',
 loadedRestriction:'Remove this pull or start a fresh matching spring before choosing another test pull.',releasedRestriction:'This pull has been removed. Start a fresh matching spring to test again.',
 referenceFormula:'Reference extension = current length − starting unloaded length',
 retained:'The pull is gone, but this spring is 7 cm long instead of its starting 6 cm. It has kept 1 cm of extra length.',
 visit:'These spring tests stay in memory while this explorer uses this page. Reloading starts fresh; they are not saved in Notes.',
 grownUp:'An invented settled-state model, not a physical experiment, hardware recommendation or independent measurement assessment. Child marks, tables, reference brackets and graphs support discussion. Hooke’s law is limited to the stated proportional range; nonlinear elasticity and retained deformation are separate cases. We keep the original unloaded reference after a retained change. Pressure, moments, scatter, fitting, uncertainty and real newton-meter technique remain separate work.',
 plotGuide:'Lines join model readings; they do not add measurements between them.',
 plotLegend:'Filled circles: model loading readings. Hollow square: this test after removing the pull. Blue triangle: your mark at the pull now.',
 numbersShared:'Hooke’s law uses F = k × x: pull in newtons equals spring constant times extension in centimeters. Here k is 0.5 N/cm for A and 1 N/cm for B. Our extension graph puts force across and extension up. Its slope is 2 cm/N for A and 1 cm/N for B: the reciprocal of k, not k itself. These rules are limited to the stated model readings.',
 nonlinear:'Nonlinear does not by itself mean permanent.',
 talkTogether:'Compare A and B at 2 N: both are 10 cm long, but how do their extensions differ? Why need a length graph not pass through zero? Compare C and D after removing their largest offered pulls.',
 exampleCaptions:[
  'This spring starts 5 cm long without a pull. Length starts at ruler zero.',
  'The settled spring is 7 cm long. Its starting unloaded end was at 5 cm. The extra length lies between those ends.',
  'Using the whole 7 cm as the extra length makes a mark that reaches past the spring. Length and extra length are different.',
  '7−5=2 cm of extension. We subtract the starting unloaded length from the current length.',
  'After this pull is removed, the spring returns to 5 cm. This model recovered. Other models may keep a change, so we check after removing the pull.'
 ]
});
