// Original guided visits and explanatory pictures; no external implementation or assets copied.
export const WATER_LAB_URL = 'https://withmarble.com/water-lab/';
const lab = {title:'Marble Water Lab',url:WATER_LAB_URL};
const motion = {title:'ACS: Molecules in Motion',url:'https://www.acs.org/middleschoolchemistry/lessonplans/chapter1/lesson2.html'};
export const missions = [
  {
    id:'melt', title:'From a frosty patch to a puddle',
    invitation:'What changes when ice becomes liquid water?',
    story:'Pip finds a frosty patch beside the garden path. Later there is a puddle. Dot wonders what water is doing on a scale too small for beetle binoculars.',
    predictionPrompt:'What might be different inside ice and liquid water?',
    predictions:['In liquid, molecules may move past one another.','In liquid, molecules may stay around fixed places, just as in ice.','I’m not sure yet.'],
    instructions:[
      'In the Water Lab, tap Ice (−5°C). Look at Glass, then tap Atoms to inspect the model’s tiny water molecules.',
      'Tap Your room (21°C). Compare the arrangement and movement with the ice view. You can switch between the two presets as often as you like.',
      'Try Glass again to connect the tiny view to the whole sample. Return to this garden tab whenever you are ready.'
    ],
    observations:['I noticed a more regular arrangement in the ice model.','I noticed molecules moving past neighbours in the liquid model.','I noticed motion in both views.','I’m not sure / I did not look closely.'],
    frames:[
      {title:'Ice has an open pattern',body:'In ordinary ice, water molecules sit around positions in an ordered, open structure. They are not motionless: the little arrows show vibration around those positions.',model:'ice',phase:0},
      {title:'Still ice, still moving',body:'This next picture shifts the molecules a little around the same positions. Ice is solid, but its molecules keep moving. The gaps in its open structure do not make it a gas.',model:'ice',phase:1},
      {title:'Liquid can flow',body:'When ice melts, its molecules can move past one another. The open ice arrangement is lost. They are still water molecules; ordinary liquid water is more closely packed than ordinary ice.',model:'water',phase:2}
    ],
    talk:'How could you show the difference between vibrating around a place and moving past a neighbour, using your hands?',
    project:'Optional: draw an ice patch and a puddle on paper. Add a tiny-view window to each. Use short arrows around places for ice and arrows past neighbours for liquid. Or explain your idea to someone. No real ice is needed.',
    sourceLinks:[lab,motion,{title:'USGS: Water Density',url:'https://www.usgs.gov/water-science-school/science/water-density'}]
  },
  {
    id:'warm', title:'A little warmer, a little livelier',
    invitation:'Compare the motion in cooler and warmer liquid water.',
    story:'Pip wonders whether warmer water has bigger molecules. Dot suggests looking closely before ordering larger beetle binoculars. Both of these samples will stay liquid.',
    predictionPrompt:'What might change when liquid water gets warmer?',
    predictions:['Its molecules may move more vigorously.','Its molecules may grow larger.','I’m not sure yet.'],
    instructions:[
      'In the Water Lab, tap Cold drink (4°C), then Atoms. Notice the model molecules’ movement. Glass shows the whole liquid sample.',
      'Tap Hot cocoa (65°C), then compare in Atoms. These are preset names: you do not need a real drink or any heating equipment.',
      'Switch between those two presets. Look at motion and molecule size separately. Return to this garden tab when you like.'
    ],
    observations:['Motion looked more vigorous at the warmer setting.','Molecule sizes looked the same to me.','I could not tell a difference between the two settings.','I did not look / I’m not sure.'],
    frames:[
      {title:'Cooler liquid is moving too',body:'Even in cooler liquid water, molecules keep moving. The short arrows in this picture represent motion; the molecules can move past their neighbours.',model:'heat',phase:0},
      {title:'Warmer liquid, more vigorous motion',body:'In warmer liquid water, molecular motion is generally more vigorous. Longer arrows represent that difference here. They are a drawing choice, not measurements of individual speeds.',model:'heat',phase:1},
      {title:'The molecules did not grow',body:'Our dots stay the same size. Warming these liquid samples changes their motion, not the identity or size of each water molecule. Bigger arrows do not mean bigger molecules.',model:'heat',phase:2}
    ],
    talk:'What could a motion arrow tell you that the size of a dot cannot?',
    project:'Optional: draw two tiny-view windows on paper for cooler and warmer liquid water. Keep your molecule dots the same size and choose arrows to show different motion. Or talk through your pictures together. No physical heating is needed.',
    sourceLinks:[lab,motion]
  },
  {
    id:'evaporate', title:'Where did the puddle water go?',
    invitation:'Look for a molecule leaving a liquid surface before boiling.',
    story:'The puddle beside the garden path is getting smaller. Pip suspects a very thirsty invisible visitor. Dot wonders whether some water has joined the air instead.',
    predictionPrompt:'Can a water molecule leave the liquid surface without the water boiling?',
    predictions:['Some molecules may leave the surface before boiling.','Water may have to boil before any molecules can leave.','I’m not sure yet.'],
    instructions:[
      'In the Water Lab, tap Your room (21°C). Glass shows liquid water at this setting. Then tap Atoms.',
      'Look near the liquid’s top surface for molecules moving out into the space above it. There is no need to spot one before continuing.',
      'If it is hard to see, try Hot cocoa (65°C), which also shows liquid, and look at the surface again. Return to this garden tab whenever you like.'
    ],
    observations:['I noticed a molecule leaving the surface in the model.','I still saw liquid below the surface.','I did not notice a molecule leave.','I did not look / I’m not sure.'],
    frames:[
      {title:'Start at the surface',body:'Liquid water has a surface next to the air. Its molecules keep moving. The marked molecule is one water molecule near that surface.',model:'evaporate',phase:0},
      {title:'One molecule moves out',body:'Some molecules can escape from the surface into the air. This is evaporation, and it can happen below boiling. We are following just one molecule in this drawing.',model:'evaporate',phase:1},
      {title:'Water in the air is still water',body:'The marked molecule is now water vapor in the air. It has not vanished or become a different substance. Liquid remains below; this picture does not show boiling.',model:'evaporate',phase:2}
    ],
    talk:'If a puddle gets smaller without boiling, what could a tiny-view drawing show above its surface?',
    project:'Optional: draw a puddle on paper and a tiny-view window at its surface. Trace one molecule from the liquid into the air and label it “still water.” Or tell the story of its journey. No real water experiment is needed.',
    sourceLinks:[lab,{title:'USGS: Evaporation and the Water Cycle',url:'https://www.usgs.gov/water-science-school/science/evaporation-and-water-cycle'}]
  }
];
