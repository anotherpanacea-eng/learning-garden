// Original351 finite letter forms and original theater copy; no phonics playback or saved learner record.
import {makeWordRoomSource} from './word-room-content.mjs';
export const LETTERPRESS_GROWNUP="This tool explores letter case and adult-led letter naming. The printed words, meanings and pictures are supplied. A paired choice or a poster is not evidence of independent naming, sounds, decoding, handwriting or knowing when capitals are required. Mixed case here is playful, not conventional writing. These four common-noun labels tolerate playful mixtures of case; case can matter differently in names and other contexts, including PIN as an acronym. Shapes vary between fonts. The large lowercase example is still lowercase. No speech is assessed or recorded, and this visit's work is not saved.";
// End of the letterpress grown-up interpretation.
const pairs=[
 {
  "id": "a",
  "capital": "A",
  "lowercase": "a"
 },
 {
  "id": "b",
  "capital": "B",
  "lowercase": "b"
 },
 {
  "id": "c",
  "capital": "C",
  "lowercase": "c"
 },
 {
  "id": "d",
  "capital": "D",
  "lowercase": "d"
 },
 {
  "id": "e",
  "capital": "E",
  "lowercase": "e"
 },
 {
  "id": "f",
  "capital": "F",
  "lowercase": "f"
 },
 {
  "id": "g",
  "capital": "G",
  "lowercase": "g"
 },
 {
  "id": "h",
  "capital": "H",
  "lowercase": "h"
 },
 {
  "id": "i",
  "capital": "I",
  "lowercase": "i"
 },
 {
  "id": "j",
  "capital": "J",
  "lowercase": "j"
 },
 {
  "id": "k",
  "capital": "K",
  "lowercase": "k"
 },
 {
  "id": "l",
  "capital": "L",
  "lowercase": "l"
 },
 {
  "id": "m",
  "capital": "M",
  "lowercase": "m"
 },
 {
  "id": "n",
  "capital": "N",
  "lowercase": "n"
 },
 {
  "id": "o",
  "capital": "O",
  "lowercase": "o"
 },
 {
  "id": "p",
  "capital": "P",
  "lowercase": "p"
 },
 {
  "id": "q",
  "capital": "Q",
  "lowercase": "q"
 },
 {
  "id": "r",
  "capital": "R",
  "lowercase": "r"
 },
 {
  "id": "s",
  "capital": "S",
  "lowercase": "s"
 },
 {
  "id": "t",
  "capital": "T",
  "lowercase": "t"
 },
 {
  "id": "u",
  "capital": "U",
  "lowercase": "u"
 },
 {
  "id": "v",
  "capital": "V",
  "lowercase": "v"
 },
 {
  "id": "w",
  "capital": "W",
  "lowercase": "w"
 },
 {
  "id": "x",
  "capital": "X",
  "lowercase": "x"
 },
 {
  "id": "y",
  "capital": "Y",
  "lowercase": "y"
 },
 {
  "id": "z",
  "capital": "Z",
  "lowercase": "z"
 }
];
const copy={
 "title": "The Letterpress Drawer",
 "entry": "Try capital and lowercase letters. Print a theater label with Dot.",
 "opening": "Dot is sorting the theater's printing letters after the storm. One letter can have two forms. Shall we try them?",
 "modelPrompt": "Your partner can name this letter. Here are its capital and lowercase forms.",
 "chooser": "Choose a letter",
 "try": "Try the other case",
 "model": "Show the pair",
 "flip": "Turn the card over",
 "next": "Another letter",
 "look": "Look closely",
 "print": "Print a label",
 "back": "Back to my letter",
 "capitalTarget": "Find the lowercase form of capital {capital}.",
 "lowercaseTarget": "Find the capital form of lowercase {lowercase}.",
 "choiceName": "{case} {glyph}.",
 "pairHeading": "{capital} and {lowercase}.",
 "pairName": "Capital {capital} and lowercase {lowercase}, two forms of the same letter.",
 "literal": "You put {targetCase} {target} with {choiceCase} {choice}.",
 "fits": "These are two forms of the same letter. Your partner can name it with you.",
 "other": "Our drawer pairs capital {capital} with lowercase {lowercase}. You can swap your choice or keep looking.",
 "visit": "This drawer and its poster wall are for this visit. Nothing here is saved.",
 "contrastNames": {
  "Aa": "A and a",
  "Cc": "C and c",
  "bd": "b and d"
 },
 "contrasts": {
  "Aa": "A and a look different. They are two forms of the same letter.",
  "Cc": "C and c have a similar curve. They are two forms of the same letter.",
  "bd": "B pairs with b. D pairs with d. The lowercase letters b and d are different letters."
 },
 "size": "Making a letter larger does not turn it into a capital. Both of these are lowercase a.",
 "smallName": "Lowercase a, smaller print.",
 "largeName": "Lowercase a, larger print.",
 "labelPrompt": "Dot's card says {word}. Tap a place to try the other form of its letter.",
 "newUse": "Can you print this label your way? Choose Show these pairs if you want a reference.",
 "placeName": "Place {position}: {case} {glyph}. Try the other case.",
 "stripName": "Your printing: {case1} {glyph1}, {case2} {glyph2}, {case3} {glyph3}.",
 "capitals": "All capitals",
 "lowercase": "All lowercase",
 "pairs": "Show these pairs",
 "poster": "Compare with Dot's poster",
 "posterBack": "Back to my label",
 "pin": "Try on the wall",
 "wall": "Our poster wall",
 "posterText": "Dot used capitals for this poster: {CAPITALWORD}. Your strip prints {word} too. Compare each letter with your partner.",
 "wallResult": "Your {word} label is on this visit's wall. You can change it.",
 "emptyWall": "No {word} label on the wall yet.",
 "wallName": "Return to the {word} label. {stripDescription}",
 "posterName": "Dot's capital-letter poster: {CAPITALWORD}.",
 "grownupTitle": "For grown-ups"
};
export function makeLetterpressSource(){
 const words=makeWordRoomSource().words;
 return {pairs:structuredClone(pairs),copy:structuredClone(copy),grownup:LETTERPRESS_GROWNUP,
  labels:Object.fromEntries(['cat','pin','mop','bat'].map(id=>{const w=words[id];return [id,{id,label:w.label,letters:[...w.letters],meaning:w.meaning,alt:w.alt,art:w.art}];}))};
}
