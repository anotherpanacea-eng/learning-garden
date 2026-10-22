// Original adult-guided method and exact source credits; each started notebook freezes a copy.
export const measurementChoiceCodes=Object.freeze(['first','same','second']);
export const measurementSupportCodes=Object.freeze(['help','narrationRequested','together','arithmeticShown']);
export const measurementCopyKeys=Object.freeze(['intro','materials','safety','missing','provenance','precisionNote','unitNote','comparisonPrompt','same','different','limit','help','reflection','choiceFits','choiceDifferent','noChoice','gapMissing','gapUnfinished']);
export function measurementSource(){return {
 version:1,model:'reported-jug-ml-v1',id:'same-jug-readings',title:'The Measuring Desk',unit:'mL',
 copy:{
  intro:'A real jug has its own marks. With an adult, read the same water twice and keep what you report. This screen cannot see your jug.',
  materials:'A small measuring jug with readable mL marks, a little cold tap water and a towel. An adult helps.',
  steps:[
   'Ask the adult to choose a safe jug and a flat, steady surface. Find the mL scale together.',
   'The adult adds a little cold water. Leave that water in the same jug for both readings. Do not add, pour out or move it between readings.',
   "Look level with the water. Ask the adult how to read this jug's water surface and marks. Read it once, look away, then read it again. Say each reading before entering it.",
   'If you can tell, note how many mL lie between two neighboring small marks. This is the gap between marks, not the number of marks. You can leave it unreported.'
  ],
  safety:'Use cold tap water. An adult handles glass or heavy jugs. Keep the screen away from water and wipe spills before moving. You do not need to drink anything.',
  missing:'No safe jug or readable mL scale today? Our picture jug is still open. Nothing here needs a real result.',
  provenance:'These are readings you and an adult report, not measurements verified by the game.',
  precisionNote:'Keep the digits you and your adult can reasonably report. Do not add decimal places just because the box allows them. A real scale may not show an exact value.',
  unitNote:"This small notebook accepts mL entries from 0 to 2000, with up to three decimal places. That is an entry format, not a claim about your jug's accuracy. Leave an uncertain entry unfinished. We do not convert cups or ounces here.",
  comparisonPrompt:'What do our two recorded numbers say?',
  same:'Our two recorded numbers match.',different:'Our two recorded numbers differ.',
  limit:'Matching readings do not prove the exact amount of water. Different readings do not tell us why they differ. Talk together about what to check next.',
  help:'mL means milliliters, a unit for liquid volume. Keep the same jug and fill for both readings. Read its marks with an adult at water level. We compare the numbers entered here, not the real water. A gap between marks is different from a reading.',
  reflection:'Would you reread at water level, ask the adult about the marks, or leave the question open? All three are useful choices.',
  choiceFits:'Your choice fits these entered numbers.',choiceDifferent:'Your choice describes a different relation between these entered numbers.',noChoice:'No relation choice recorded.',
  gapMissing:'not reported',gapUnfinished:'unfinished gap entry kept',
  choices:[{code:'first',label:'First is larger'},{code:'same',label:'They match'},{code:'second',label:'Second is larger'}]
 },
 labels:{first:'First reported reading (mL)',second:'Second reported reading (mL)',gap:'Gap between neighboring marks (mL, optional)'},
 drawing:{version:1,kind:'eye-level',description:'An eye at left faces the water surface in a jug at right. A horizontal dashed guide connects their level. This illustration gives no volume reading.'},
 credits:[
  {title:'NIST: reading a water meniscus',url:'https://nvlpubs.nist.gov/nistpubs/ir/2019/NIST.IR.7383-2019.pdf',role:'Background on eye position and water-surface reading in laboratory instruments. This is not a household-jug calibration or an accuracy certificate.'},
  {title:'NIST: measurement variability',url:'https://www.itl.nist.gov/div898/handbook/mpc/section1/mpc114.htm',role:'Background on variation between measurements. Two reports here do not estimate uncertainty or prove accuracy.'},
  {title:'University of Wisconsin: reading a graduated cylinder',url:'https://www2.chem.wisc.edu/deptfiles/genchem/lab/labdocs/modules/gradcyl/grad100mL.htm',role:'Background on scale intervals and estimated readings in a laboratory example. Its picture and precision convention are not our household instructions.'}
 ]
};}
