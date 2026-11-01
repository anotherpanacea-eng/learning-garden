// Original fictional before/after picture notes; no physical observation is claimed.
export const evidenceCards=[
 {
  id:'puddle',title:'A smaller puddle',scene:'A made-up garden path is shown twice. Nothing between the pictures shows where the water went.',
  options:[
   'The puddle looks smaller. Flowing, soaking, or joining the air could explain some of that change.',
   'The puddle looks smaller. Every bit of its missing water must have joined the air.',
   'The puddle looks smaller. We cannot suggest any route until we watch the water travel.'
  ],fit:0,
  clue:'Visible clue: the blue puddle outline is smaller later. Its route is not shown.',
  feedback:'The smaller outline is in the picture. A route is an explanation, not a directly seen event here. Water could flow, soak into ground, or evaporate; this pair does not show how much followed any route.',
  reasons:['','The picture cannot single out evaporation.','A picture can support a possible route without showing the route happen.'],
  talk:'Point to the change you can see. What extra clue might help you distinguish flowing from soaking?',
  before:'A blue puddle on a garden path.',after:'The same path with a smaller blue puddle. No route is pictured.'
 },
 {
  id:'soil',title:'A darker patch',scene:'A made-up patch of soil is shown twice. Later, the surface patch near a smaller puddle is darker.',
  options:[
   'The patch looks darker. That gives no clue about any possible route into soil.',
   'The patch looks darker. Soaking could explain some water, though other routes may also matter.',
   'The patch looks darker. Every drop went deep underground and nowhere else.'
  ],fit:1,
  clue:'Visible clues: the puddle is smaller and a nearby surface patch is darker later. Nothing below the surface is pictured.',
  feedback:'The darker surface is a clue compatible with wet soil, not a measurement or proof of infiltration. Soaking is possible. The drawing cannot establish depth, amount, or exclude flow and evaporation.',
  reasons:['A clue can support a possibility without proving it.','','No deep route is shown.'],
  talk:'What part of the soil is pictured? What would we need to check before claiming water went deep?',
  before:'A blue puddle beside an even-colored soil patch.',after:'The same scene with a smaller blue puddle and a darker patterned surface patch. Nothing underground is shown.'
 },
 {
  id:'dish',title:'The open dish',scene:'In this made-up scene, the same open, level dish sits on a nonabsorbent table. Nobody pours or spills water, and the dish has no drain.',
  options:[
   'The line is lower. Since vapor is unseen, we cannot even suggest evaporation here.',
   'The line is lower. The picture proves exactly how much water became vapor.',
   'The line is lower. In this scene, evaporation fits, though we cannot see vapor.'
  ],fit:2,
  clue:'Visible clue: the later waterline is lower. The no-pour, no-spill, and no-drain conditions come from the story, not the drawing.',
  feedback:'A lower line plus the conditions given here makes evaporation a reasonable explanation. Evaporation changes liquid water to water vapor; the vapor is not directly seen here. The still pictures are neither a measurement nor proof of a unique cause or quantity.',
  reasons:['An unseen process can still be a supported possibility.','No amount was measured.',''],
  talk:'Which part did the picture show? Which part did the story tell us? What remains unseen?',
  before:'An open level dish on a table, with a higher blue waterline.',after:'The same open level dish on the same table, with a lower blue waterline. No vapor is pictured.'
 }
];
