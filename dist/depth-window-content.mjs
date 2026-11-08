// Original finite teaching setups; no measured water or engineering predictions.
export const depthDefaults=Object.freeze({level:5,a:4,b:2,width:'narrow'});
export const depthCopy=Object.freeze({
 title:'Depth Window',
 story:'Nuria is drawing a water-level guide for Willowbank. Does a gauge’s height above the bottom tell the whole story? Try still water and compare depth below its surface.',
 instruction:'Choose a waterline and two locations. Compare height above the bottom with depth below the surface.',
 visit:'This tank and pin stay while you use these water models. Leaving or reloading starts fresh; they are not saved in Notes.',
 grownUp:'A finite model of an open, still-water tank at fixed density and gravity. Above water this tool supplies no reading because it reports water depth pressure only; a real gauge in air can read approximately zero relative to air. Readings are gauge pressure relative to surface air, not absolute pressure, real measurements, wall strength or flood predictions. The test-face arrow shows direction at a point, not force magnitude or a finite object’s balance. Thermal expansion, flow, buoyancy, hydraulics, practical investigation and a frozen cross-game return remain separate work.',
 pressureDefinition:'Pressure is perpendicular force per unit area. Kilopascals are units of pressure.',
 faceExplanation:'At one point in still water, the pressure reading does not depend on how a tiny test face is turned. The force on that face is perpendicular to it. Pressure is a number, not a direction.',
 faceLimit:'Direction only; arrow length is not a force measurement.',
 facePrompt:'Choose a location below the waterline to view water acting on a test face.',
 depthContrast:'In the same tank, a lower point in the water is deeper below the surface. Its extra pressure is greater.',
 conservationNote:'Each choice is a still-water setup. Width and waterline choices do not conserve one poured sample.',
 empty:'This setup has no water. The locations stay at their chosen heights.',
 noPin:'Pin a setup first, then change one setting to compare.',
 pinned:'A detached setup is pinned for this visit; changes to the current tank leave it in place.',
 frames:Object.freeze([
  'The bottom is our height zero. A is 3 meters above it, but only 1 meter below the surface. B is 1 meter above the bottom and 3 meters below the surface. Depth starts at the waterline.',
  'Both locations are 3 meters below the same waterline. Their pressure readings match even though they are side by side.',
  'This wider setup has the same waterline and depths. Its pressure readings still match the narrow setup. This is a differently filled tank, not one conserved sample stretched wider.',
  'The waterline is higher while both locations stay at height 1 meter. Their depths are now 5 meters, so both readings rise to 49 kilopascals.',
  'A is at the surface: 0 kilopascals extra relative to air. This does not mean no pressure at all. B is still 5 meters deep.',
  'A is above the water. There is no water-gauge reading here, unlike the surface’s zero. B is still in water, now 4 meters deep.'
 ])
});
export function depthPressureText(tenths){return Number.isInteger(tenths)&&tenths>=0?`${Math.floor(tenths/10)}${tenths%10?`.${tenths%10}`:''}`:null;}
export function depthReadingText(gauge,label){
 if(!gauge||!['A','B'].includes(label)||!['water','surface','dry'].includes(gauge.status))return null;
 const meters=n=>`${n} ${n===1?'meter':'meters'}`;
 const start=`Gauge ${label}: height ${meters(gauge.height)} above bottom.`;
 return `${start} ${gauge.status==='dry'?'No water reading at this location.':gauge.status==='surface'?'At the surface: 0 kilopascals extra relative to air. Air pressure is still present.':`Depth ${meters(gauge.depth)} below surface; ${depthPressureText(gauge.pressureTenths)} kilopascals extra relative to air.`}`;
}
