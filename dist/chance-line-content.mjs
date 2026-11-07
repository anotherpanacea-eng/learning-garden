// Original finite content for the equal-position, make-believe counter model.
export const chanceBags = [
  {id: 'none', sun: 0, moon: 4},
  {id: 'quarter', sun: 1, moon: 3},
  {id: 'half', sun: 2, moon: 2},
  {id: 'most', sun: 3, moon: 1},
  {id: 'all', sun: 4, moon: 0},
  {id: 'third', sun: 2, moon: 4},
  {id: 'dozen-half', sun: 6, moon: 6},
  {id: 'dozen-most', sun: 9, moon: 3}
];

export const chanceCopy = {
  entry: 'Compare chances on a line',
  rule: 'These are make-believe counters. Each pictured position has the same chance on every draw, regardless of earlier results. Put the counter back before another draw.',
  lifetime: 'Your line stays while you visit Seed Stall. Leaving the room clears it. Your saved experiments stay as they are.',
  marks: 'These examples fit the twelfths marks. Other chances can fall between the marks.',
  buildInstruction: 'Choose a bag, then choose a point for your own pin. Show the reference whenever you want.',
  learnInstruction: 'Turn the pictures to explore how counts become chances.',
  questionsInstruction: 'Choose an answer to read its reason. You can revise it or show the explanation.',
  pages: {build: 'Place a chance', learn: 'See why', questions: 'Try questions'}
};

export const chanceLessons = [
  {
    title: 'Count the whole',
    text: 'There are four equal-chance positions and one Sun. Sun has a 1/4 chance. The denominator counts all four positions, Moons included. A fraction names a share of one whole. One of four counters is one quarter of the set; two of four is two quarters. The denominator counts every counter, including the other mark. Zero means impossible; one means certain. Half is an even chance. Below half is unlikely and above half is likely for the named event, with endpoints named separately.',
    bags: [1]
  },
  {
    title: 'Compare shares',
    text: 'Compare 3 Sun + 1 Moon with 6 Sun + 6 Moon. Sun has a 3/4 chance in the first bag and a 6/12 = 1/2 chance in the second. Three quarters is greater than half, even though 6 is greater than 3. Chance uses a share, not the Sun count alone. A larger coordinate on the same 0–1 line is more likely.',
    bags: [3, 6]
  },
  {
    title: 'Same chance, different bags',
    text: 'Compare 2 Sun + 2 Moon with 6 Sun + 6 Moon. Both give Sun a 1/2 chance: 2/4 = 1/2 and 6/12 = 1/2. Their references share the same point on the 0–1 line. Equivalent fractions describe the same point, not identical bags.',
    bags: [2, 6]
  },
  {
    title: 'More likely is not promised',
    text: 'With 3 Sun + 1 Moon, Sun has a 3/4 chance and Moon has a 1/4 chance. Either mark can appear next. Putting a drawn counter back restores the same four-position bag. A short run need not follow the proportions. Neither a catch-up rule nor a streak changes this model’s next-draw chance. Actual draws remain in Seed Stall.',
    bags: [3]
  }
];

export const chanceQuestions = [
  {
    prompt: 'One Sun and three Moons. What is the chance of Sun?',
    choices: [
      {label: '1/4', feedback: 'One Sun is one of all four equal-chance positions.'},
      {label: '1/3', feedback: 'Three counts only Moons. The whole has four positions.'},
      {label: '1/2', feedback: 'Two kinds of mark do not mean two equal shares.'}
    ],
    key: 0,
    explanation: '1/4, because one of all four positions is Sun.'
  },
  {
    prompt: 'Which bag gives Sun a greater chance: 3 Sun + 1 Moon or 6 Sun + 6 Moon?',
    choices: [
      {label: 'Six Sun and six Moon', feedback: 'Six is a larger count, but six of twelve is only half.'},
      {label: 'Three Sun and one Moon', feedback: 'Three of four is three quarters, greater than half.'},
      {label: 'They have the same chance', feedback: 'Compare the shares: 3/4 is greater than 6/12.'}
    ],
    key: 1,
    explanation: '3/4 is greater than 6/12 = 1/2. Compare the whole in each bag.'
  },
  {
    prompt: 'A Sun was drawn from 3 Sun + 1 Moon and put back. What is Sun’s chance next?',
    choices: [
      {label: 'Less than 3/4: Moon must catch up', feedback: 'The returned counter restores the same bag. Moon is not owed a turn.'},
      {label: 'More than 3/4: Sun has a streak', feedback: 'The returned counter restores the same bag. A streak changes no positions.'},
      {label: 'Still 3/4', feedback: 'All four positions are available again, including three Suns.'}
    ],
    key: 2,
    explanation: 'Still 3/4. Returning the counter leaves three Suns among four positions.'
  },
  {
    prompt: 'What can a 3/4 chance of Sun tell us about the next draw?',
    choices: [
      {label: 'Sun is certain', feedback: 'Sun has a chance below 1, so it is not certain; Moon keeps a 1/4 chance.'},
      {label: 'Sun is more likely, but Moon can appear', feedback: 'Sun’s 3/4 is greater than Moon’s 1/4. Both remain possible.'},
      {label: 'Random means we cannot compare their chances', feedback: 'The next mark is uncertain, but the equal-position rule lets us compare shares.'}
    ],
    key: 1,
    explanation: 'Sun is more likely, but Moon remains possible. A chance is not a promise.'
  }
];
