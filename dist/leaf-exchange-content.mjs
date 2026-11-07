// Original finite paper accounts. These are not measured leaf data.
export const leafExchangeCopy = Object.freeze({
  title: 'Leaf Exchange',
  entry: 'Compare a leaf’s gas accounts',
  story: 'The town’s plant exhibit needs two totals, not one. Help the gardener show what a net change can hide.',
  build: 'Gas accounts', learn: 'See why',
  buildInstruction: 'Choose how many groups to include from each process. Compare what is made, what is used, and the difference.',
  modelNote: 'A paper account, not a measured leaf. One group uses the gas numbers for one glucose in a net equation. Water and glucose also take part; this board shows only the two gases.',
  limitNote: 'Respiration here is aerobic: it uses oxygen. Assume enough materials for these chosen entries. Zero entries do not switch a real process off.',
  pairNote: 'Links compare equal numbers in opposite entries. Both rows stay. No molecules disappear because we draw a link.',
  chipKey: 'One bundle = 6 molecules. Each dot counts one molecule of the selected gas in this account, not its atoms or size.',
  workedLabel: 'Worked account · not your settings',
  visitNote: 'Your comparison stays while you visit Living Layers. Leaving, reloading, importing or changing explorer clears it. This model does not change your notes.',
  copyHeading: 'Your kept tray copy',
  copyNote: 'Copied from your last readable kept Diffusion Tray model when you first opened this activity. It is not leaf data.',
  noCopy: 'No readable kept Diffusion Tray model was available when you opened this activity. The worked example is open anyway.',
  transferQuestion: 'Use these two counts to explain the net. How could the same arithmetic difference come from different totals? Before calling them possible tray totals, check this saved model’s crossing rule and step. Compare the difference with two gas settings.',
  leaveWarning: 'Leaving Living Layers clears this model and guides you have not kept. Use Back first if you want to keep your guide.'
});

export const leafExchangeTrails = Object.freeze([
  {title: 'Zero, two ways', prompt: 'Compare 0 and 0 groups with 1 and 1. Both give zero net. What do the separate rows tell you?'},
  {title: 'The same difference', prompt: 'Compare 1 and 0 with 2 and 1. Oxygen has the same net change. Are the separate totals the same?'},
  {title: 'More made than used', prompt: 'Try 3 photosynthesis groups and 1 respiration group. Explain the oxygen result using both rows.'},
  {title: 'More used than made', prompt: 'Try 1 photosynthesis group and 3 respiration groups. A negative change does not mean negative gas.'},
  {title: 'Switch the gas', prompt: 'Keep the two group counts. Switch from oxygen to carbon dioxide. Which signs change?'},
  {title: 'Scale both rows', prompt: 'Compare 2 and 1 with 4 and 2. Which totals double? This changes the accounts, not a real leaf’s speed.'}
].map(Object.freeze));

export const leafExchangeTeaching = Object.freeze([
  {
    title: 'Two processes, two accounts.',
    text: 'Green leaf cells can photosynthesize in light and also respire. One selected photosynthesis account uses 6 carbon dioxide and makes 6 oxygen; one aerobic-respiration account uses 6 oxygen and makes 6 carbon dioxide. These are gas entries from net equations, not one-step reactions or paths of individual molecules. Water and glucose also take part. Photosynthesis stores energy from light; respiration transfers chemical energy for cell activity and heat. Matching gas totals does not reverse that energy transfer.',
    caption: 'Two gas accounts. The full matter and energy summaries include more than these gas entries.'
  },
  {
    title: 'Made minus used.',
    text: 'With 3 photosynthesis groups and 1 respiration group, oxygen made is 18 and oxygen used is 6. Net oxygen change is 18 − 6 = +12. Carbon dioxide gives 6 − 18 = −12. P and R can stand for the two group counts: oxygen net = 6 × P − 6 × R. These numbers compare chosen entries; they are not measured rates.',
    caption: 'One pair of six cancels in the arithmetic, while both entries remain visible.'
  },
  {
    title: 'Zero does not mean empty.',
    text: 'No entries gives 0 − 0 = 0. Two groups from each process give 12 − 12 = 0 too. The net is the same, but the separate totals differ. A net value alone cannot tell us how much was made and used. Zero entries here do not show a living leaf switching its processes off.',
    caption: 'Equal net results can hide different separate totals.'
  },
  {
    title: 'An idea travels.',
    text: 'In a Diffusion Tray example, 8 crossings left to right and 5 right to left give a net of 3 left to right. We subtract opposite counts in both activities. A crossing is not a chemical reaction, and tray markers are not measurements of leaf gases. Compare each marker kind separately.',
    caption: 'Worked tray example · 8 − 5 = 3 markers left to right.'
  }
].map(Object.freeze));
