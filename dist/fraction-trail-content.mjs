// Original finite length activities; upstream references are recorded in spec 52.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const define=(id,title,request,allowedSpaces,initialCuts,numerator,denominator)=>freeze({id,title,request,modelRevision:1,target:{numerator,denominator},allowedSpaces,unitTicks:12,maxTicks:24,initialCuts});
export const trailCases=Object.freeze([
 define('quarter-stop','The gathering stop','Mark the gathering stop three quarters of a ribbon from the start.',[4],[3,6,9],3,4),
 define('repair-thirds','Repair the spaces','Repair the three spaces, then put the flag two thirds from the start.',[3],[3,8],2,3),
 define('sixth-stop','Five sixths','Put the flag five sixths from the start.',[6],[2,4,6,8,10],5,6),
 define('same-half','The halfway stop','Show the halfway stop with halves, quarters or sixths.',[2,4,6],[6],1,2),
 define('past-one','Continue past one','Continue five quarter-length steps from the start.',[4],[],5,4),
 define('whole-stop','One whole ribbon','Mark four quarter-length steps from zero.',[4],[3,6,9],4,4)
]);
export const trailCase=id=>trailCases.find(c=>c.id===id)||null;
export const trailPages=['build','place','read','keep'];
export const trailHelpTopics=['units','boundaries','example','changed-whole'];
export const trailExample={title:'A separate one-third example',cuts:[4,8],markerIndex:1,steps:['The bracket from zero to one is one whole ribbon.','Divide that whole into three equal spaces.','Start at zero and move forward one space.','The flag is at one third.'],target:{numerator:1,denominator:3}};
export const changedWhole={labels:['one whole ribbon A','one whole ribbon B','half of ribbon A','half of ribbon B'],caption:'Each marked part is one half of its own whole ribbon. Ribbon B is twice as long as ribbon A, so its half is longer too. The fraction is the same; the ribbon lengths are different.',question:'Which whole ribbon does each half belong to?'};
