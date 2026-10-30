// Original, explicitly invented records. Upstream work was studied as design reference only.
export const PAIRED_TEXT=Object.freeze({
 title:'Paired points',invitation:'Two numbers, one delivery.',
 introduction:'Put each pair on a graph. Then ask what a pattern can tell us, and what it can’t.',
 instruction:'Keep these two values together. Choose X across first, then Y up.',
 chooseBoth:'Choose both values before placing a point.',
 complete:'Every record has a point. Compare, keep, or look at the patterns.',
 compareEmpty:'Place a point before comparing.',
 compareExplanation:'Each square shows the pair from that record. Your circles stay where you placed them.',
 matching:'All placed pairs agree with their record cards.',
 differences:'Your points stay where you put them. Back can help you revisit a record.',
 comparisonLimit:'This compares your points with the record table. It does not check real measurements or prove you can plot points on your own.',
 keepExplanation:'An unfinished chart is welcome too. Keep its records and points together.',
 kept:'Chart kept. Its records and points stay together in this notebook.',
 readOnly:'Read-only kept chart. Revise as a new chart to move points, compare, or use help.',
 revised:'A new chart is open. Your earlier one is still kept.',
 safety:'This change could not be kept safely. Your earlier work is unchanged. Download your notes or keep exploring.',
 capacity:'This notebook has all the charts it can hold. Earlier charts stay in your notebook, including unfinished ones. You can still open an earlier chart. Ask a grown-up to download your notes.',
 checkCapacity:'This chart has kept all the comparisons it can hold. You can still move points or keep it.',
 unsupported:'Your earlier paired-point notes are kept, but they can’t be changed here. The original stays in your notes. Other places are still open.',
 unreadable:'This earlier chart is kept in your notes, but it can’t open here. Your other readable charts still open.',
 malformedChecks:'Your earlier comparisons are kept in your notes, but this list can’t be changed here. You can still move points or keep the chart.',
 helperUnavailable:'This earlier example is kept in your notes. You can still place points.',
 overlapping:'Several records can share a position. The table keeps each record separately.',
 saveFailure:'This chart is in this session, but it could not be saved on this device. Download your notes.',
 grownUp:'This is supplied representation practice with explicitly invented courier records. It records plotted pairs, optional model examples, table comparisons and support requests. It does not verify measurement, independent coordinate proficiency, prediction skill, statistical inference or causal explanation. Historical records keep their own source wording and axes.'
});

export function pairedSource(){
 const values=[[2,3,4,5,6,7,8,9],[3,5,7,9,11,13,15,17],[4,1,2,7,8,5,6,11]];
 const datasets=values.map((ys,index)=>({id:['a','b','c'][index],title:`Chart ${['A','B','C'][index]}`,rows:ys.map((y,i)=>({id:`r${i+1}`,x:i+1,y}))}));
 return {
  version:1,id:'paired-points-courier',title:'Courier practice records',
  origin:'Made-up courier records for practice',
  notice:'These are invented deliveries. They are not real travel measurements or a rule for future trips.',
  context:'Route blocks across; delivery minutes up. Each row belongs to one delivery.',
  axes:{x:{max:10,label:'Route blocks'},y:{max:20,label:'Delivery minutes'}},datasets,
  examples:{
   worked:datasets.map(dataset=>{const y=dataset.rows[1].y;return {caseId:dataset.id,rowId:'r2',steps:[
    {stage:'origin',text:`This record keeps two values together: 2 route blocks and ${y} delivery ${y===1?'minute':'minutes'}. Start at zero.`},
    {stage:'across',text:'Move 2 along the horizontal route-blocks axis. That is the first number.'},
    {stage:'point',text:`Move up to ${y} on the minutes axis. The point marks both values for this one record.`}
   ]};}),
   patterns:{caseIds:['a','b','c'],paragraphs:[
    'A and B both rise overall. Each of their eight points sits on a straight line.',
    'B rises more steeply on these same axes. Both patterns are equally tight here: every point is on its line. Steeper does not mean stronger association.',
    "C also has an overall upward pattern, but its points are more scattered than A's. Look across all the points; some individual steps go down.",
    'A scatter plot keeps paired values together. A pattern does not by itself tell us what caused the times. Even real delivery records would need more evidence about routes, conditions and how the records were collected. These examples are made up; they do not establish a real cause.',
    'These examples show positive association. We have not explored downward patterns, no clear pattern, or how to fit a prediction line here.'
   ]}
  }
 };
}
