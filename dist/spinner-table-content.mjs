// Original picture-mark examples for a finite, equal-stop screen wheel.
export const spinnerMarks = [{id: 'sun', label: 'Sun'}, {id: 'cloud', label: 'Cloud'}, {id: 'rain', label: 'Rain'}];
export const spinnerPresets = [
  {label: 'Equal shares', counts: [4, 4, 4]},
  {label: 'Half for Sun', counts: [6, 3, 3]},
  {label: 'Mostly Sun', counts: [10, 1, 1]}
];
export const spinnerCopy = {
  entry: 'Build and try a spinner',
  pages: {design: 'Design the wheel', runs: 'Try runs', learn: 'See why'},
  rule: 'This make-believe wheel has 12 equal stops. Each stop has the same chance on every screen draw, regardless of earlier results. Sun, Cloud and Rain are picture marks, not weather forecasts.',
  lifetime: 'Your wheel and runs stay while you visit Seed Stall. Leaving the room clears them. Your saved experiments stay as they are.',
  entropy: 'This browser could not make a screen draw. Your wheel and earlier results are still here. Try again, or compare the chances together.',
  authored: 'An example, not your run and not a fresh random draw',
  designInstruction: 'Take one slice from a mark and give it to another, or choose a preset. All twelve equal stops stay on the wheel.',
  learnInstruction: 'Turn the pictures to compare equal stops, named shares and recorded screen draws.',
  questionsInstruction: 'Choose an answer to read its reason. You can revise it or show the explanation.',
  mismatch: 'This run uses its earlier wheel. Start another run to use your current design.',
  mismatchFull: 'This run uses its earlier wheel. Begin a fresh set to use your current design.'
};
export const spinnerLessons = [
  {kind: 'stops', title: 'Count equal stops, not names.', text: 'One of twelve equal stops is 1/12 of the whole; six such stops make 6/12. On this wheel Sun has 6/12 = 1/2, Cloud has 3/12 = 1/4 and Rain has 3/12 = 1/4. Three marks can have unequal chances. The twelve stops have equal chances by the screen rule.'},
  {kind: 'shares', title: 'Redesign the shares.', text: 'With 4 Sun, 4 Cloud and 4 Rain, each named mark has a 1/3 chance. With 6 Sun, 3 Cloud and 3 Rain, Sun has 1/2 and each other mark has 1/4. Equal chance for three marks is thirds, not halves. Each transfer preserves all twelve stops. Move Sun to Cloud, then Sun to Rain, to turn 6, 3, 3 into 4, 4, 4.'},
  {kind: 'run', title: 'A run is not a promise.', text: 'An example, not your run and not a fresh random draw: Sun, Sun, Sun, Cloud from a 6 Sun, 3 Cloud, 3 Rain wheel. Sun’s next chance is still 1/2. Neither a streak nor Cloud or Rain being owed a turn changes the wheel. This example does not promise a typical twenty-draw tally.'},
  {kind: 'frozen', title: 'Keep the old wheel with its results.', text: 'An earlier run keeps its 6 Sun, 3 Cloud, 3 Rain wheel: Sun’s chance remains 1/2. A new run from an edited 4 Sun, 4 Cloud, 4 Rain design gives Sun a 1/3 chance. Observed counts may vary between runs. A short run can look uneven; this screen wheel still follows its equal-stop rule, and its marks are pictures, not weather.'}
];
export const spinnerQuestions = [
  {prompt: 'The wheel has 6 Sun, 3 Cloud and 3 Rain stops. Which statement fits?', choices: [
    {label: 'Each mark has a 1/3 chance', feedback: 'There are three names, but the shares differ: Sun has six of the twelve stops.'},
    {label: 'Sun has a 1/2 chance; each other mark has 1/4', feedback: 'Count all twelve stops: six Sun, three Cloud and three Rain.'},
    {label: 'Random means we cannot compare the chances', feedback: 'The next result is uncertain, but the equal-stop rule lets us compare the shares.'}
  ], key: 1, explanation: 'Sun is 6/12 = 1/2; Cloud and Rain are each 3/12 = 1/4.'},
  {prompt: 'Which design gives all three named marks the same chance?', choices: [
    {label: '4 Sun, 4 Cloud, 4 Rain', feedback: 'Each mark has four of twelve stops, a 1/3 chance.'},
    {label: '6 Sun, 3 Cloud, 3 Rain', feedback: 'Cloud and Rain match, but Sun has more stops.'},
    {label: '10 Sun, 1 Cloud, 1 Rain', feedback: 'Sun has ten stops; Cloud and Rain have one each.'}
  ], key: 0, explanation: 'Equal shares of twelve among three marks are four stops each: 1/3 each.'},
  {prompt: 'Three Sun marks appeared from a frozen 6 Sun, 3 Cloud, 3 Rain wheel. What is Sun’s chance next?', choices: [
    {label: 'More than 1/2', feedback: 'Earlier results do not add Sun stops to this wheel.'},
    {label: 'Less than 1/2', feedback: 'No mark is owed a turn. The same twelve stops remain available.'},
    {label: 'A 1/2 chance', feedback: 'Six of the same twelve equal-chance stops are Sun on every draw.'}
  ], key: 2, explanation: 'Still 6/12 = 1/2 under this model’s independent equal-stop rule.'},
  {prompt: 'No Rain mark appeared in a short run from a frozen 6 Sun, 3 Cloud, 3 Rain wheel. What follows?', choices: [
    {label: 'Rain’s next chance is 0', feedback: 'Rain still owns three available stops; zero recorded Rain results is not zero chance.'},
    {label: 'Rain’s next chance is 1/4', feedback: 'Its three of twelve stops remain available, whatever the earlier tally.'},
    {label: 'Rain’s next chance is 1', feedback: 'A mark is not owed the next turn. Sun and Cloud remain possible too.'}
  ], key: 1, explanation: 'Rain’s next chance remains 3/12 = 1/4. A short run can have no Rain.'}
];
