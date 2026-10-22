// Original guided visits and explanatory pictures; no external implementation or assets copied.
export const WATER_LAB_URL = 'https://withmarble.com/water-lab/';
const lab = {title:'Marble’s water simulator',url:WATER_LAB_URL};
const motion = {title:'ACS: Molecules in Motion',url:'https://www.acs.org/middleschoolchemistry/lessonplans/chapter1/lesson2.html'};
export const missions = [
  {
    id:'melt', title:'From a frosty patch to a puddle',
    invitation:'What changes when ice becomes liquid water?',
    story:'The storm left water across the low garden path. A cold night froze the edge of one puddle. Now it is melting again. Pip kneels by the frosty rim. “It was hard this morning,” he says. “Where did the hard go?”',
    predictionPrompt:'What might be different inside ice and liquid water?',
    predictions:['In liquid, molecules may move past one another.','In liquid, molecules may stay around fixed places, just as in ice.','I’m not sure yet.'],
    instructions:[
      'Open Marble’s water simulator. Tap Ice (−5°C) and look at Glass. Then tap Atoms to see the tiny water molecules up close.',
      'Tap Your room (21°C). How are the molecules placed now? How do they move? You can switch between Ice and Your room as often as you like.',
      'Tap Glass again to see the whole glass of water. Come back to this tab whenever you are ready.'
    ],
    observations:['The ice molecules looked more neatly lined up.','I noticed molecules moving past neighbors in the liquid model.','I noticed motion in both views.','I’m not sure / I did not look closely.'],
    frames:[
      {title:'Ice has an open pattern',body:'In ordinary ice, water molecules sit around positions in an ordered, open structure. They are not motionless: the little arrows show vibration around those positions.',model:'ice',phase:0},
      {title:'Still ice, still moving',body:'This next picture shifts the molecules a little around the same positions. Ice is solid, but its molecules keep moving. The gaps in its open structure do not make it a gas.',model:'ice',phase:1},
      {title:'Liquid can flow',body:'When ice melts, its molecules can move past one another. The open ice arrangement is lost. They are still water molecules; ordinary liquid water is more closely packed than ordinary ice.',model:'water',phase:2}
    ],
    talk:'How could you show the difference between vibrating around a place and moving past a neighbor, using your hands?',
    project:'Optional: draw an ice patch and a puddle on paper. Add a tiny-view window to each. Use short arrows around places for ice and arrows past neighbors for liquid. Or explain your idea to someone. No real ice is needed.',
    sourceLinks:[lab,motion,{title:'USGS: Water Density',url:'https://www.usgs.gov/water-science-school/science/water-density'}]
  },
  {
    id:'warm', title:'A little warmer, a little livelier',
    invitation:'Compare the motion in cooler and warmer liquid water.',
    story:'After the storm, sunlight reaches one puddle while another stays in the shade. Before wondering how the path will dry, Pip asks what warming changes inside liquid water. Dot suggests comparing motion and molecule size. Both model samples stay liquid.',
    predictionPrompt:'What might change when liquid water gets warmer?',
    predictions:['Its molecules may move more.','Its molecules may grow larger.','I’m not sure yet.'],
    instructions:[
      'In Marble’s water simulator, tap Cold drink (4°C). Then tap Atoms. Watch how the molecules move. Glass shows the whole drink.',
      'Tap Hot cocoa (65°C). Then compare in Atoms. These are just button names, so you need no real drink or heating.',
      'Switch between Cold drink and Hot cocoa. First look at how the molecules move. Then look at their size. Come back to this tab when you like.'
    ],
    observations:['The molecules moved more at the warmer setting.','Molecule sizes looked the same to me.','I could not tell a difference between the two settings.','I did not look / I’m not sure.'],
    frames:[
      {title:'Cooler liquid is moving too',body:'Even in cooler liquid water, molecules keep moving. The short arrows in this picture represent motion; the molecules can move past their neighbors.',model:'heat',phase:0},
      {title:'Warmer liquid, livelier motion',body:'In warmer liquid water, the molecules generally move more. Longer arrows show that difference here.',model:'heat',phase:1},
      {title:'The molecules did not grow',body:'Our dots stay the same size. Warming makes the molecules move more. Each one is still a water molecule, just as big as before. Longer arrows show more motion.',model:'heat',phase:2}
    ],
    talk:'What could a motion arrow tell you that the size of a dot cannot?',
    project:'Optional: draw two tiny-view windows on paper for cooler and warmer liquid water. Keep your molecule dots the same size and choose arrows to show different motion. Or talk through your pictures together. No physical heating is needed.',
    sourceLinks:[lab,motion]
  },
  {
    id:'evaporate', title:'Where did the puddle water go?',
    invitation:'Look for a molecule leaving a liquid surface before boiling.',
    story:'The storm flooded the low garden path. Now one puddle is getting smaller. Did water flow away, soak into the ground, or join the air? Pip and Dot investigate the air part of the mystery: evaporation.',
    predictionPrompt:'Can a water molecule leave the liquid surface without the water boiling?',
    predictions:['Some molecules may leave the surface before boiling.','Water may have to boil before any molecules can leave.','I’m not sure yet.'],
    instructions:[
      'In Marble’s water simulator, tap Your room (21°C). Glass shows liquid water. Then tap Atoms.',
      'Look near the top of the water. Watch for molecules moving out into the space above. You can go on even if you do not spot one.',
      'If it is hard to see, tap Hot cocoa (65°C). It shows liquid water too. Look at the top of the water again. Come back to this tab whenever you like.'
    ],
    observations:['I noticed a molecule leaving the surface in the model.','I still saw liquid below the surface.','I did not notice a molecule leave.','I did not look / I’m not sure.'],
    frames:[
      {title:'Start at the surface',body:'Liquid water has a surface next to the air. Its molecules keep moving. The marked molecule is one water molecule near that surface.',model:'evaporate',phase:0},
      {title:'One molecule moves out',body:'Some molecules can escape from the surface into the air. This is evaporation, and it can happen below boiling. We are following just one molecule in this drawing.',model:'evaporate',phase:1},
      {title:'Water in the air is still water',body:'The marked molecule is now water vapor in the air. It has not vanished or become a different substance. Liquid water stays below. Nothing in this picture is boiling.',model:'evaporate',phase:2}
    ],
    talk:'If a storm puddle gets smaller, some water might flow away or soak into the ground as well as evaporate. What could a tiny-view drawing show about the part that joins the air?',
    project:'Optional: draw a puddle on paper and a tiny-view window at its surface. Trace one molecule from the liquid into the air and label it “still water.” Or tell the story of its journey. No real water experiment is needed.',
    sourceLinks:[lab,{title:'USGS: Evaporation and the Water Cycle',url:'https://www.usgs.gov/water-science-school/science/evaporation-and-water-cycle'}]
  }
];
