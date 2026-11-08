// Original supplied verse and finite teaching copy for The Line Table.
const freeze = value => {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};
export const poemCases = freeze([
  {id:'lantern', title:'A light at the gate', text:'I leave a lantern by the gate. Its light stays when I go.', layouts:{a:[7],b:[2,7,10]}, note:'A keeps the two sentences on separate lines. B ends its first line after “leave”; the sentence needs the following words. You might let the voice carry across that break, or give “leave” a moment of attention. Try both.'},
  {id:'rain', title:'The waiting cup', text:'We wait; the rain taps at the roof. Then one small drop finds the cup.', layouts:{a:[8],b:[2,5,8,12]}, note:'In A the semicolon after “wait” sits inside a line: a possible internal pause. B puts that same punctuation at a line ending. The punctuation has not changed. Does your reading change?'},
  {id:'bridge', title:'Warm boards', text:'The bridge remembers nothing of our names, yet every board is warm where we have stood.', layouts:{a:[7],b:[3,7,12]}, note:'B leaves “remembers” waiting for its object on the next line. A real bridge cannot remember anything. The poem speaks about it as if it could. B adds line endings after “remembers” and “warm”. What do you notice? Neither layout fixes one required speed or feeling.'},
  {id:'seeds', title:'Paper boats', text:'Beyond the window, seeds wait in paper boats. We call them cargo; tomorrow they may become a garden.', layouts:{a:[8,12],b:[3,6,8,12,15]}, note:'In B, “paper boats” arrives on a new line after “in”. The words still belong to one sentence. The semicolon separates related ideas in both layouts. Does either layout change how you picture the paper boats?'}
]);
export const lineCopy = freeze({
  title:'The Line Table',
  intro:'Dot is arranging a small evening reading in the Story Loft: “The words can stay the same while the lines change. Will you try two ways of setting them out?”',
  chooser:'Choose some words to reshape',
  request:'Keep the words. Change where the lines end. Read your version with someone.',
  wrap:'A narrow screen may wrap a long line inside its strip. The numbered strip is still one chosen poem line.',
  cueKey:'Pause notes are for your reading. They are not new punctuation or automatic stops.',
  compareSubtitle:'Same words, different line endings. These are possibilities, not an answer key.',
  visit:'Your arrangements stay while you are at this table. Take a paper copy before leaving; this work is not saved in Notes.',
  grownUp:'This is layout revision of supplied words, not original poem composition, assessed decoding, measured fluency or recorded performance. The references show possible effects, not one correct emotional response. Meter, rhyme schemes, poem forms and sustained analysis remain separate work.',
  lastWord:'The last word already ends the poem. Choose an earlier word.',
  noUndo:'No layout change to undo.',
  downloadHint:'Downloads a text file you can print.',
  speechHint:'The device reads the words and punctuation. It does not perform your line breaks or pause notes.',
  rhythmContrast:'Music can use a counted bar. This table explores spoken lines without setting a beat.',
  invitations:['Let a sentence travel across two lines','Give one word more attention','Try a pause inside a line','Choose your own experiment']
});
export const lineExampleText = 'We hold the door; the wind comes in.';
export const lineFrames = freeze([
  'These are the words. A sentence and a printed line are different things.',
  'The first line ends after “hold”, with no punctuation there, and the sentence keeps going. We still need to learn what is held. When words run on past a line ending like this, it is called enjambment. The second line ends at a full stop after “in.” A line ending at punctuation like this is usually called end-stopped.',
  'A line ending can draw attention without a full stop in the voice. Read across it once. Then try a small pause. Neither reading changes the printed words.',
  'The semicolon is inside this line. This pause within a poetic line is a caesura. Punctuation or a break in the meaning often marks one; a performer chooses how long to make it.',
  'The same printed line can have different readings. Try both with someone. Our pause notes do not measure time or prove a performance happened.'
]);
