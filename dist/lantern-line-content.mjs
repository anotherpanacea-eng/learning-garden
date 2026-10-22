const copy={
 intro:'The lantern walk runs from Gate 0 to Arch 1. Both lanterns use this same whole walk. Put each lantern at its requested fraction.',
 comparison:'In the line you made, which lantern is farther from Gate 0?',
 help:'A denominator names how many equal parts make one whole. When the same whole is split into three equal parts, each part is smaller than when it is split into two equal parts. One third is closer to 0 than one half. A fraction with more parts is not always farther: compare the size of each part and how many are taken.',
 exampleSteps:['Keep the whole fixed: both example lanterns use Gate 0 to Arch 1.','Split the whole into equal halves for the first marker and equal thirds for the second.','One half is farther from 0 than one third. Compare horizontal distance, not the height of a label.']
};
export const lanternCases=[
 ['smaller-parts','Smaller parts',1,2,1,3],['same-parts','The same-sized parts',2,6,4,6],['same-place','Two names, one stop',2,4,1,2],
 ['different-parts','Two different partitions',3,4,2,3],['start-and-step','The gate and one step',0,3,1,6],['whole-and-whole','Meet at the arch',2,2,3,3]
].map(([id,title,a,b,c,d])=>({version:1,id,title,wholeId:'lantern-walk-one',unitTicks:12,
 markers:[{id:'amber',label:'Amber lantern',shape:'circle',numerator:a,denominator:b},{id:'blue',label:'Blue lantern',shape:'triangle',numerator:c,denominator:d}],
 copy:structuredClone(copy),example:{first:{numerator:1,denominator:2},second:{numerator:1,denominator:3}}}));
