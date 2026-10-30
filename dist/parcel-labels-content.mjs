// Original finite spelling practice. These are supply nouns, not a general pluralizer.
export const parcelNouns = [
  ['bun', 'buns', 's', 'cafe'],
  ['cup', 'cups', 's', 'cafe'],
  ['pot', 'pots', 's', 'garden'],
  ['box', 'boxes', 'es', 'garden'],
  ['dish', 'dishes', 'es', 'cafe'],
  ['brush', 'brushes', 'es', 'garden'],
  ['berry', 'berries', 'ies', 'cafe'],
  ['cherry', 'cherries', 'ies', 'cafe'],
  ['daisy', 'daisies', 'ies', 'garden'],
  ['tray', 'trays', 'keep-y', 'cafe'],
  ['key', 'keys', 'keep-y', 'cafe'],
  ['toy', 'toys', 'keep-y', 'cafe'],
];
export const parcelFamilies = [
  ['mixed', 'Mixed patterns'], ['s', 'Add s'], ['es', 'Add es'],
  ['ies', 'y to ies'], ['keep-y', 'Keep y'],
];
export const parcelQuantities = [
  ['mix', 'Mix quantities'], ['one', 'One'], ['more', 'More than one'],
];
export const parcelEndings = [['none', 'No ending'], ['s', 's'], ['es', 'es'], ['ies', 'ies']];
const exampleWords = {s: ['map', 'maps'], es: ['fox', 'foxes'], ies: ['puppy', 'puppies'], 'keep-y': ['day', 'days']};

function explain(base, plural, family) {
  const title = base[0].toUpperCase() + base.slice(1);
  if (family === 's') return `For more than one ${base}, keep ${base} and add s: ${base} + s = ${plural}.`;
  if (family === 'es') return `${title} ends in “${base.endsWith('x') ? 'x' : 'sh'}”. For more than one, keep ${base} and add es: ${base} + es = ${plural}.`;
  if (family === 'ies') return `For more than one ${base}, take off y and add ies: ${base.slice(0, -1)} + ies = ${plural}. Another way to describe the same spelling is to change y to i and add es. The letter before y is “${base.at(-2)}”, a consonant letter.`;
  return `The letter before y is “${base.at(-2)}”, a vowel letter. Keep y and add s: ${base} + s = ${plural}.`;
}

export function makeParcelSource(serial, {family = 'mixed', quantity = 'mix'} = {}) {
  if (!Number.isSafeInteger(serial) || serial < 1 || serial > 999999999 ||
      !parcelFamilies.some(([id]) => id === family) || !parcelQuantities.some(([id]) => id === quantity)) return null;
  const eligible = parcelNouns.filter(row => family === 'mixed' || row[2] === family);
  const [base, plural, pattern, destination] = eligible[(serial - 1) % eligible.length];
  const count = quantity === 'one' ? 1 : quantity === 'more' ? [2, 3, 4, 5][(serial - 1) % 4] : [1, 3, 2, 5, 4][(serial - 1) % 5];
  const explanation = explain(base, plural, pattern), [example, examples] = exampleWords[pattern];
  const discoveries = base === 'toy' ? {
    to: 'To is a real word, but it does not name a pictured supply here.',
    toes: `Toes is a real word for parts of a foot. This request is about ${count === 1 ? 'one toy' : 'toys'}.`,
  } : base === 'daisy' ? {
    dais: `Dais is a real word for a raised platform. This request is about ${count === 1 ? 'one cut flower' : 'cut flowers'}.`,
    daises: `Daises names more than one raised platform. This request is about ${count === 1 ? 'one cut flower' : 'cut flowers'}.`,
  } : {};
  return {
    format: 1, id: `parcel-${serial}`, base, plural, count, destination,
    requestKind: 'send', family: pattern, art: base, trimmed: base.endsWith('y') ? base.slice(0, -1) : null,
    expected: count === 1 ? base : plural,
    patternName: parcelFamilies.find(([id]) => id === pattern)[1], explanation,
    workedExample: count === 1 ? `For one ${base}, the label is the whole word: ${base}.` : `${explain(example, examples, pattern)} Now try this request. ${explanation}`,
    messages: {
      match: count === 1 ? `${base[0].toUpperCase() + base.slice(1)} names one, so the whole word is the label. No ending is needed.` : explanation,
      one: `For one ${base}, keep the whole word: ${base}. ${base.endsWith('y') ? `Choose Keep ${base} and No ending.` : 'Choose No ending.'}`,
      noEnding: `There is more than one. In this request, ${base} names one. The usual label for these supplies is ${plural}.`,
      trimmedNoEnding: `The usual label for these supplies is ${plural}.`,
    }, discoveries,
  };
}
