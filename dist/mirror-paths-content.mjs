// Original finite copy for the plane-mirror construction bench (spec 427).
export const mirrorCopy=Object.freeze({
 title:'Turn the Light',chooser:'Choose a mirror picture',introduction:'Plan where one selected light path goes after a flat mirror.',
 request:'Plan a path from the mirror’s hit point toward the green guide mark. The guide mark is a drawn point, not another object blocking light.',
 returnRequest:'Plan the path back toward the lamp. Here the lamp is also the return mark.',
 framing:'This is a geometric picture of one selected light path. Real lamps send light many ways. The drawn lines are guides, not lines you would normally see in the air.',
 normal:'The normal is a guide at right angles to the mirror at the hit point. It is not another light path. Measure both angles from this guide, not from the mirror’s surface.',
 vocabulary:'The incoming angle is also called the angle of incidence. The reflected angle is the angle of reflection.',
 degree:'Degrees measure turns. One degree is 1/360 of a full turn. A full turn is 360°; a right angle is 90°, a quarter turn.',
 empty:'No proposed path yet. Add one, or tap in front of the mirror to aim one.',
 bound:'This tool offers directions up to 75° on either side of the normal.',flipReason:'A path on the normal is unchanged by flipping.',undoReason:'No ray change to undo.',
 tap:'Taps choose a nearby 15° direction. Use the buttons for exact steps.',back:'Hatched side: back of mirror. Aim on the lamp side.',
 normalOverlap:'The proposed path lies along the normal. The normal is still the dashed guide, not a light path.',
 incomingOverlap:'The proposed path lies on the incoming line but points away from the mirror.',
 headOn:'Here the lamp path lies along the normal. Incoming and reflected paths share one line, with arrows pointing in opposite directions.',
 talk:'What stays the same when the whole picture turns? Why do we measure from the normal? How is a proposed path different from the reference?',
 visit:'Your proposals stay while you are at this bench. Leaving starts a fresh bench; this work is not saved in Notes.',
 grownUp:'A bounded ray-construction model for a smooth plane mirror. The target, angle readouts, guide and reference are supplied support. This does not assess practical protractor use or independent optics knowledge. No image formation, refraction, brightness or real-room lighting qualification is implied. The incoming path, normal and reflected path are treated in one plane. For a flat mirror, measuring both angles from the surface can also give equal angles; this example’s mistake mixes one surface measurement with a normal measurement. The normal is our shared convention and is useful in later curved-surface and refraction work.',
 frames:[
 'The incoming arrow shows one selected path reaching the mirror.',
 'The normal meets the mirror at 90°. This incoming angle is 30° from the normal, or 60° from the surface. Those are different measurements.',
 'The reflected angle is 30° from the normal too. It leaves the mirror; it does not continue behind it.',
 'Using the 60° surface measurement as the outgoing angle from the normal gives a different path. The reference still uses 30° from the normal.',
 'The whole picture turned clockwise. The normal is no longer vertical on the page, but it is still perpendicular to the mirror. The incoming and reflected angles are still 30° from the normal.'
 ]
});
export const mirrorTitles=Object.freeze({curtain:'Curtain mark',wide:'A wider angle',opposite:'Across the normal',side:'Side mirror',slanted:'Slanted mirror',return:'Back along the path'});
export const mirrorIncident=m=>`Incoming angle: ${m.incidence}° from the normal. Its arrow points toward the mirror.`;
const direction=a=>a>0?'clockwise':'counterclockwise';
export const mirrorProposal=m=>m.angle===null?mirrorCopy.empty:m.angle===0?'Proposed outgoing angle: 0°, along the normal. Its arrow points away from the mirror.':`Proposed outgoing angle: ${Math.abs(m.angle)}° ${direction(m.angle)} from the normal. Its arrow points away from the mirror.`;
export const mirrorReference=m=>m.incidence===0?'The incoming angle is 0°. The reflected path returns along the same line, away from the mirror. The two arrows show opposite travel.':`Reference path: ${m.incidence}° ${direction(m.referenceAngle)} from the normal, away from the mirror. The incoming and reflected angles are equal.`;
export const mirrorTurn=m=>m.turn?`The whole picture is now turned ${m.turn*90}° clockwise from the start. The mirror, lamp and paths turn together; the angles from the normal stay the same.`:'The picture is at its starting direction, 0°. Four clockwise quarter turns make a full turn of 360° and return it here.';
export function mirrorFeedback(m,kind){return kind==='empty'?'No proposal is drawn. The reference shows this flat-mirror model.':kind==='match'?'The proposed path matches the reference for this flat mirror.':kind==='same-side'?'The angle has the same size, but the proposed path is on the incoming side of the normal. Here the reflected path leaves on the other side.':`The proposed angle is ${Math.abs(m.angle)}° from the normal. The incoming angle is ${m.incidence}°. Reflection uses equal angles measured from the normal.`;}
