// Original finite model and teaching copy specified in docs/specs/413-pollen-path.md.
export const pollenPathCopy = {
  entry: 'Follow a pollen path',
  title: 'Pollen Path',
  intro: 'The town is planning a flower patch. Move a paper bee and follow the pollen marks.',
  garden: 'Model garden',
  learn: 'See why',
  back: 'Back to Living Layers',
  hear: 'Hear this page',
  instruction: 'Choose a part of flower A or B for the paper bee to touch. Watch the marks on its body and on each stigma.',
  caption: 'Two model flowers of the same kind. You choose exactly what the visitor touches. A real visit may touch several parts.',
  legend: 'A mark names where pollen came from. It is not a grain count.',
  limit: 'Real visitors drop, lose or groom off pollen as they go. This model keeps an origin mark until you choose a clean visitor.',
  anatomy: 'Anthers hold pollen. The stigma can catch pollen. Nectar is sugary food. Bees also use pollen as food.',
  clean: 'Use a clean paper visitor',
  fresh: 'Begin a fresh model',
  confirmation: "Clear this model's marks and recent actions? Your Living Layers guide will stay.",
  confirm: 'Clear model marks',
  cancel: 'Keep this model',
  recent: 'Last eight model actions',
  emptyRecent: 'No model actions yet.',
  recentNote: 'Only the latest eight actions are listed. Earlier actions may still affect the marks.',
  invitation: 'Choose a trail to try',
  teaching: 'Choose a teaching card',
  previous: 'Previous',
  next: 'Next',
  worked: 'Worked picture · not your model',
  initialStatus: 'Choose a flower part to begin.',
  cleanStatus: 'A clean paper visitor is ready. Any marks on the stigmas stay where they are.',
  lifetime: 'Your model stays while you visit Living Layers. Leaving the room, reloading or opening the explorer chooser clears it. Your notes are not changed by this model.'
};

export const pollenPathContacts = ['A', 'B'].flatMap(flower => ['anthers', 'stigma', 'nectar'].map(part => ({
  id: `${flower.toLowerCase()}-${part}`,
  flower,
  part,
  label: `${flower} · ${part}`,
  buttonLabel: `${flower} · ${part === 'nectar' ? 'Visit nectar' : `Touch ${part}`}`
})));

export const pollenPathInvitations = [
  { title: 'Between flowers', prompt: "Try touching A's anthers, then B's stigma. Which origin mark travels?" },
  { title: 'Travel back', prompt: "Try B's anthers, then A's stigma. What changes if the visitor already carries A too?" },
  { title: 'An empty visitor', prompt: 'Use a clean paper visitor, then touch a stigma. Compare any old marks with what the visitor brought.' },
  { title: 'One flower', prompt: "Try a flower's anthers, then that same flower's stigma. A pollen transfer can happen within one flower too." },
  { title: 'Two origins', prompt: 'Touch both flowers\' anthers, then a stigma. The marks show origins, not how many grains moved.' },
  { title: 'A nectar stop', prompt: 'Pick up pollen, visit a nectar stop, then touch a stigma. What stays on the visitor?' }
];

export const pollenPathLessons = [
  {
    id: 'places', title: 'Three flower places.',
    text: 'Anthers hold pollen. The stigma can catch it. Nectar is sugary food; pollen can feed bees too. This drawing pulls the parts apart so we can see them. Real flowers have different shapes. Some have no nectar, and some have anthers and stigmas in separate flowers.',
    figure: 'places', caption: 'Anthers are shown around a central stigma and style. The nectar stop is near the flower base.'
  },
  {
    id: 'carry', title: 'Carry it to a stigma.',
    text: "A visitor touches A's anthers and carries pollen from A. When it touches B's stigma, pollen from A can arrive there. Moving pollen from anther to stigma is pollination. Our marks show origins, not amounts.",
    figure: 'carry', caption: "1. Touch A's anthers. 2. The visitor carries origin A. 3. Touch B's stigma: origin A can arrive there. The arrows show this order."
  },
  {
    id: 'visit', title: 'A visit is not one touch.',
    text: 'In our model you choose one place to touch. A nectar stop alone changes no pollen marks. A real bee drinking nectar may brush anthers or a stigma too. Bees can also collect pollen for food.',
    figure: 'visit', caption: 'Model contact: nectar only. Possible real visit · not a prediction: a bee near anthers and a stigma may brush them.'
  },
  {
    id: 'later', title: 'What comes later?',
    text: 'Pollen arriving on a stigma does not promise seeds or fruit. Fertilization is a different process. It may happen later, or it may not. This model stops at pollen transfer. It cannot tell us whether seeds will grow.',
    figure: 'later', caption: 'Anther to stigma: pollen transfer. Later processes are not modeled. A dotted line ends in a question mark.'
  }
];
