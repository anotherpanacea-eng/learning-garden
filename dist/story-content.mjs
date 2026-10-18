import {frenchEntrance,frenchLibraryNodes} from './french-library.mjs';
import {frenchEntrances,frenchNodes} from './french-content.mjs';
import {parisLibraryNodes} from './paris-library.mjs';
import {parisEntrance,parisNodes} from './paris-content.mjs';
import {cafeEntrance,cafeNodes} from './restaurant-story.mjs';
// Original, generic story data. Projects are invitations, never scored achievements.
// {guide} is replaced with the chosen companion's name by the interface.
export const entrances = [
  {
    id: 'creature',
    title: 'Follow the tiny tracks',
    invitation: 'A little winged creature has left a trail. Where does it lead?',
    start: 'creature-trail',
    ending: {
      title: 'A quiet place by the flower',
      body: 'Pip and Dot pause by the blue flower. Luma, their imaginary winged neighbour, settles under a leaf. There is room here for another small adventure.',
      projectTitle: 'Make a paper trail',
      project: 'If you like, draw a garden on paper. Add a starting spot, a resting place for Luma, and a trail of dots or arrows between them. Invite someone to follow your trail with a finger.'
    }
  },
  {
    id: 'message',
    title: 'Open the mysterious note',
    invitation: 'A note is caught on a twig. Dot insists it is not a shopping list.',
    start: 'message-note',
    ending: {
      title: 'The postbox under the willow',
      body: 'At the willow, Pip opens the tiny garden postbox. Inside is a blank card, ready for a new message. Dot volunteers to be postmaster. The hat is still under discussion.',
      projectTitle: 'Leave a make-believe message',
      project: 'If you like, fold a sheet of paper into a card. Draw a pretend meeting place and write or dictate one clear instruction for finding it. Ask someone to point to the place your message describes.'
    }
  },
  {
    id: 'shelter',
    title: 'Imagine a little shelter',
    invitation: 'A pretend garden creature needs a hideaway. What could its shelter be like?',
    start: 'shelter-test',
    ending: {
      title: 'A corner for new ideas',
      body: 'Pip clears a space for shelter ideas. Dot hangs up a sign: “Small creatures, large imaginations.” A paper plan can be the beginning of something new.',
      projectTitle: 'Design a paper hideaway',
      project: 'If you like, draw or fold a paper shelter for a make-believe creature. Choose a tall doorway, a wide roof, or a shape of your own. Add one feature you want to try, and tell someone what it is for. No water test is needed.'
    }
  }
];

export const storyNodes = {
  'creature-trail': {
    id: 'creature-trail', entrance: 'creature', type: 'task', subject: 'Reading',
    title: 'A message beside the tracks',
    body: 'After the storm, Pip finds tiny tracks. Beside them is a sign: “Follow the dots to the blue flower. Wait there for Luma.” Luma is a made-up creature with wings like little leaves.',
    guide: '{guide} says, “Let’s look at what the sign actually tells us.”',
    prompt: 'According to the sign, where should Pip wait?',
    kind: 'choice', choices: ['By the blue flower', 'Inside the shed', 'Beside the red stone'], answer: 0,
    hint: 'Find the place named just before “Wait there.”',
    explanation: 'The sign says to follow the dots to the blue flower, then wait there. “There” means by the blue flower.',
    talk: 'What does the word “there” help the writer avoid repeating?',
    visual: 'tracks', next: 'creature-observe'
  },
  'creature-observe': {
    id: 'creature-observe', entrance: 'creature', type: 'task', subject: 'Science',
    title: 'Luma’s leaf wings',
    body: 'Pip watches Luma in the story. In a bright patch, Luma opens its wings. In the shade, it closes them. Pip sees the same thing happen twice. Dot writes it down. “A beetle-sized notebook is mostly margin.”',
    guide: '{guide} says, “We can say what Pip saw without claiming we know why.”',
    prompt: 'Which sentence matches Pip’s observations?',
    kind: 'choice',
    choices: ['Every creature closes its wings in shade', 'Luma opened its wings in the bright patch and closed them in shade', 'Luma can never open its wings in shade'],
    answer: 1,
    hint: 'Choose the sentence about this creature and the events Pip actually watched.',
    explanation: 'Pip saw Luma open its wings in the bright patch and close them in shade. These observations do not tell us what every creature does, or what Luma can never do.',
    talk: 'What else could Pip observe before trying to explain Luma’s wing movements?',
    next: 'creature-project'
  },
  'creature-project': {
    id: 'creature-project', entrance: 'creature', type: 'project', subject: 'Design',
    title: 'A trail of your own',
    body: 'Pip offers a blank piece of pretend map. Dot suggests a resting place with a very small welcome mat.',
    guide: '{guide} says, “You can imagine a route here, or save the idea for later.”',
    prompt: 'Optional off-screen idea: on paper, draw a starting spot and a resting place for Luma. Join them with dots or arrows. Someone can follow the route with a finger. You can simply continue if you prefer.',
    talk: 'What could make your route easy for someone else to follow?',
    next: null
  },
  'message-note': {
    id: 'message-note', entrance: 'message', type: 'task', subject: 'Reading',
    title: 'The twig-post letter',
    body: 'Dot untangles a note from a twig. It reads: “Dear Pip, bring the blue ribbon to the willow, not the shed. Look for the little postbox.” Pip checks whether foxes have pockets. Not enough.',
    guide: '{guide} says, “A short note can give us more than one clue.”',
    prompt: 'What should Pip bring to the willow?',
    kind: 'choice', choices: ['A red ribbon', 'The little postbox', 'The blue ribbon'], answer: 2,
    hint: 'Look for the words after “bring.”',
    explanation: 'The note says “bring the blue ribbon to the willow.” The ribbon is what to bring; the willow is where to go.',
    talk: 'Why might the writer have added “not the shed”?',
    visual: 'note', next: 'message-markers'
  },
  'message-markers': {
    id: 'message-markers', entrance: 'message', type: 'task', subject: 'Mathematics',
    title: 'Stones by the postbox',
    body: 'Beside the willow are 3 rows of marker stones, with 4 stones in every row. Dot wants to count them without accidentally counting a toe.',
    guide: '{guide} says, “Equal rows give us more than one way to find the total.”',
    prompt: 'How many marker stones are there altogether?',
    kind: 'number', answer: 12,
    hint: 'Add four stones for each of the three rows, or use 3 × 4.',
    explanation: '4 + 4 + 4 = 12. Three groups of four make 12, so 3 × 4 = 12 marker stones.',
    talk: 'How would you explain your way of counting to Dot?',
    visual: 'array', diagram: {rows: 3, cols: 4}, facts: [[3, 4]],
    next: 'message-project'
  },
  'message-project': {
    id: 'message-project', entrance: 'message', type: 'project', subject: 'Design',
    title: 'Your turn at the postbox',
    body: 'Pip finds a blank card. Dot offers to deliver a pretend message, provided the address is not “somewhere near a leaf.”',
    guide: '{guide} says, “A picture, a few words, or words told to a helper can carry your idea.”',
    prompt: 'Optional off-screen idea: fold paper into a card. Draw a make-believe meeting place. Write or dictate one instruction for finding it. Invite someone to point to the place your message describes. Or keep the idea for another day.',
    talk: 'Which detail would help your reader find the right place?',
    next: null
  },
  'shelter-test': {
    id: 'shelter-test', entrance: 'shelter', type: 'task', subject: 'Science',
    title: 'Two tiny test roofs',
    body: 'Pip and Dot tested two paper model roofs. They used equal-sized pieces of the same paper and followed the same steps, leaving one roof flat and folding the other. They put 10 drops on each roof. The card underneath the flat roof had 6 wet marks. Under the folded roof it had 2.',
    guide: '{guide} says, “Let’s choose a conclusion that fits this particular test.”',
    prompt: 'What do these test results show?',
    kind: 'choice',
    choices: ['Folded paper can never let water through', 'Every flat roof leaks', 'The card under the folded roof had fewer wet marks in this test'],
    answer: 2,
    hint: 'Compare the wet marks. Be careful with words like “every” and “never.”',
    explanation: '2 wet marks are fewer than 6. In this test, the card under the folded roof had fewer wet marks. One test cannot show that a roof will always stay dry.',
    talk: 'Why might Pip and Dot repeat the test before choosing a roof?',
    visual: 'shelter', next: 'shelter-ribbon'
  },
  'shelter-ribbon': {
    id: 'shelter-ribbon', entrance: 'shelter', type: 'task', subject: 'Mathematics',
    title: 'A ribbon for the drawing',
    body: 'Dot lays a ribbon beside a centimetre ruler. Its ends line up with 2 cm and 9 cm. Pip plans to use that length on a shelter drawing. No beetle-sized saw required.',
    guide: '{guide} says, “The ribbon starts after zero, so let’s measure the space between its ends.”',
    prompt: 'How long is the ribbon, in centimetres?',
    kind: 'number', answer: 7,
    hint: 'Find the difference between the end mark and the start mark.',
    explanation: '9 − 2 = 7. The ribbon covers seven one-centimetre spaces, so it is 7 cm long.',
    talk: 'If the same ribbon started at zero, which mark would its other end reach?',
    visual: 'ruler', diagram: {start: 2, end: 9, max: 10},
    next: 'shelter-project'
  },
  'shelter-project': {
    id: 'shelter-project', entrance: 'shelter', type: 'project', subject: 'Design',
    title: 'Choose a hideaway',
    body: 'Pip lays out imaginary plans. Dot asks for a window with a view of something other than Pip’s ankle.',
    guide: '{guide} says, “Your design choices are yours. We can talk about what each feature is for.”',
    prompt: 'Optional off-screen idea: draw or fold a paper hideaway for a make-believe creature. Choose a tall doorway, a wide roof, or a shape of your own. Add one feature you want to try and explain its job. No water test is needed. You can also leave the plan for later.',
    talk: 'What does your creature need, and which feature of your design could help?',
    next: null
  }
};

entrances.push(cafeEntrance);
Object.assign(storyNodes,cafeNodes);

entrances.push(parisEntrance);
Object.assign(storyNodes,parisNodes);

Object.assign(storyNodes,parisLibraryNodes);

entrances.push(...frenchEntrances);
Object.assign(storyNodes,frenchNodes);

entrances.push(frenchEntrance);
Object.assign(storyNodes,frenchLibraryNodes);
