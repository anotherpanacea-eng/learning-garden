// Original café story. All guests and dishes are imaginary; projects are unscored invitations.
export const cafeEntrance = {
  id: 'cafe',
  chapter: 'The Almost-Right Café',
  title: 'Visit the Almost-Right Café',
  invitation: 'An imaginary guest wants a dish that is sold out. What else could fit?',
  start: 'cafe-substitute',
  ending: {
    title: 'More ideas welcome',
    body: 'Dot turns the pretend café sign to “More ideas welcome.” Pip sets out blank paper menus. There is always room on this menu for another wonderfully odd idea.',
    projectTitle: 'Make a paper menu',
    project: 'If you like, draw a paper menu of imaginary dishes. Give each dish two describing words, such as warm and crunchy. Invite someone to pretend to order. If a dish is sold out, suggest another with the describing words they want. No real food is needed.'
  }
};

export const cafeNodes = {
  'cafe-substitute': {
    id: 'cafe-substitute', entrance: 'cafe', type: 'task', subject: 'Reading',
    title: 'The thunder toast problem',
    body: 'Pip and Dot open a pretend café: imaginary guests, imaginary dishes. A cloud-dragon wants thunder toast, but it is sold out. “Anything warm and crunchy will do,” says the guest. Dot checks a menu that is mostly doodles.',
    guide: '{guide} says, “More than one dish might fit. Check both describing words.”',
    prompt: 'Which dish could replace thunder toast? Choose one that is both warm and crunchy.',
    kind: 'choice',
    choices: [
      'Moon crunch: warm and crunchy',
      'Cloud pudding: warm and soft',
      'Comet crisps: warm and crunchy',
      'Star snaps: cold and crunchy'
    ],
    answer: 0,
    answers: [0, 2],
    answerFeedback: [
      'Moon crunch fits: it is warm and crunchy, just as the guest asked.',
      'Cloud pudding is warm, but it is soft. The guest asked for crunchy too.',
      'Comet crisps fit: they are warm and crunchy. A different name can still meet the request.',
      'Star snaps are crunchy, but they are cold. The guest asked for warm too.'
    ],
    hint: 'Check each dish against both words. It must be both warm and crunchy. Either dish with both words works.',
    explanation: 'Moon crunch and Comet crisps both fit because each is warm and crunchy. Cloud pudding is soft, and star snaps are cold. You only need to choose one suitable dish.',
    talk: 'What could you ask the guest if two dishes both fit?',
    next: 'cafe-portions'
  },
  'cafe-portions': {
    id: 'cafe-portions', entrance: 'cafe', type: 'task', subject: 'Mathematics',
    title: 'An order for the table',
    body: 'The next order is for 4 imaginary guests. Each guest wants 3 portions. Pip draws one row for each guest. Dot points out that a doodled portion never goes cold.',
    guide: '{guide} says, “Each guest gets an equal group. We can add the groups or multiply.”',
    prompt: 'How many portions are needed for 4 guests with 3 portions each?',
    kind: 'number', answer: 12,
    hint: 'Count three portions for each of the four guests: 3 + 3 + 3 + 3.',
    explanation: '3 + 3 + 3 + 3 = 12. Four groups of three make 12, so 4 × 3 = 12 portions.',
    talk: 'How does each row in the picture match the order?',
    visual: 'array', diagram: {rows: 4, cols: 3}, facts: [[4, 3]],
    next: 'cafe-shortfall'
  },
  'cafe-shortfall': {
    id: 'cafe-shortfall', entrance: 'cafe', type: 'task', subject: 'Mathematics',
    title: 'The almost-full cupboard',
    body: 'The order card asks for 12 portions. The cupboard has 10. Dot checks behind an imaginary jar. Still 10. “A thorough cupboard inspection,” says Pip.',
    guide: '{guide} says, “We want just the extra portions needed to reach the order total.”',
    prompt: 'How many more portions are needed to go from 10 to 12?',
    kind: 'number', answer: 2,
    hint: 'Start at ten and count up to twelve, or subtract what is in stock from what is needed.',
    explanation: '12 − 10 = 2. Two more portions would bring the cupboard total to 12.',
    talk: 'How could you check that the extra portions would be enough?',
    next: 'cafe-project'
  },
  'cafe-project': {
    id: 'cafe-project', entrance: 'cafe', type: 'project', subject: 'Design',
    title: 'A menu of magnificent nonsense',
    body: 'Pip offers a blank paper menu. Dot suggests “whisper waffles,” but has not decided whether they should be soft or crunchy.',
    guide: '{guide} says, “You can invent dishes and their describing words. Every menu can work.”',
    prompt: 'Optional off-screen idea: draw imaginary dishes on paper and give each two describing words. Play a pretend ordering game with someone. If a dish is sold out, suggest another that matches their request. You can also save the idea for later. No real food is needed.',
    projectOptions: [
      'I would like to draw a paper menu',
      'I would like to try a pretend ordering game',
      'I will keep the idea for later'
    ],
    talk: 'What two describing words might a guest ask for, and which dishes on your menu could fit?',
    next: null
  }
};
