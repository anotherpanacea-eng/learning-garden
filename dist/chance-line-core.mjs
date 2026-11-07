import {chanceBags, chanceCopy, chanceLessons, chanceQuestions} from './chance-line-content.mjs';

export function createChanceLine() {
  return {
    page: 'build', bag: 1,
    pins: Array(chanceBags.length).fill(null),
    refs: Array(chanceBags.length).fill(false),
    lesson: 0, question: 0,
    answers: Array(chanceQuestions.length).fill(null),
    explanations: Array(chanceQuestions.length).fill(false)
  };
}

const inRange = (value, max) => Number.isInteger(value) && value >= 0 && value <= max;
const replaceAt = (values, index, value) => values.map((old, i) => i === index ? value : old);

export function changeChanceLine(work, action, value) {
  const scalar = (key, valid) => valid && work[key] !== value ? {...work, [key]: value} : work;
  switch (action) {
    case 'page': return scalar('page', ['build', 'learn', 'questions'].includes(value));
    case 'bag': return scalar('bag', inRange(value, chanceBags.length - 1));
    case 'lesson': return scalar('lesson', inRange(value, chanceLessons.length - 1));
    case 'question': return scalar('question', inRange(value, chanceQuestions.length - 1));
    case 'pin':
      return inRange(value, 12) && work.pins[work.bag] !== value
        ? {...work, pins: replaceAt(work.pins, work.bag, value)} : work;
    case 'clear':
      return work.pins[work.bag] === null ? work
        : {...work, pins: replaceAt(work.pins, work.bag, null)};
    case 'reference':
      return {...work, refs: replaceAt(work.refs, work.bag, !work.refs[work.bag])};
    case 'answer':
      return inRange(value, 2) && work.answers[work.question] !== value
        ? {...work, answers: replaceAt(work.answers, work.question, value)} : work;
    case 'explanation':
      return {...work, explanations: replaceAt(work.explanations, work.question, !work.explanations[work.question])};
    default: return work;
  }
}

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

export function chanceFraction(numerator, denominator) {
  if (numerator === 0) return '0';
  if (numerator === denominator) return '1';
  const factor = gcd(numerator, denominator);
  return `${numerator / factor}/${denominator / factor}`;
}

export function chancePoint(index) {
  const label = chanceFraction(index, 12);
  const raw = `${index}/12`;
  return index === 0 || index === 12 || label === raw ? label : `${raw} = ${label}`;
}

function referenceFor(bag) {
  const total = bag.sun + bag.moon;
  const word = bag.sun === 0 ? 'impossible' : bag.sun === total ? 'certain'
    : 2 * bag.sun === total ? 'even chance' : 2 * bag.sun < total ? 'unlikely' : 'likely';
  return {index: 12 * bag.sun / total, raw: `${bag.sun}/${total}`, label: chanceFraction(bag.sun, total), word};
}

export function chanceLineModel(work) {
  const bag = chanceBags[work.bag];
  const question = chanceQuestions[work.question];
  const selected = work.answers[work.question];
  return {
    bag: {...bag, total: bag.sun + bag.moon},
    own: work.pins[work.bag] === null ? null : {index: work.pins[work.bag], label: chancePoint(work.pins[work.bag])},
    reference: work.refs[work.bag] ? referenceFor(bag) : null,
    lesson: chanceLessons[work.lesson], question, selected,
    feedback: selected === null ? null : question.choices[selected].feedback,
    explanation: work.explanations[work.question] ? question.explanation : null
  };
}

export function chanceLineNarration(work) {
  const model = chanceLineModel(work);
  const parts = [chanceCopy.pages[work.page]];
  if (work.page === 'build') {
    parts.push(chanceCopy.buildInstruction, chanceCopy.rule,
      `Bag ${work.bag + 1} of ${chanceBags.length}: ${model.bag.sun} Sun and ${model.bag.moon} Moon, ${model.bag.total} positions altogether. What is the chance of Sun?`,
      'The line runs from 0, impossible, through 1/2, even chance, to 1, certain.',
      model.own ? `Your pin: ${model.own.label}.` : 'Your pin has not been placed.');
    if (model.reference) {
      const r = model.reference;
      parts.push(`Reference for Sun: ${r.raw}${r.raw === r.label ? '' : ` = ${r.label}`}, ${r.word}.`);
    }
    parts.push(chanceCopy.marks, 'Choose a point to place your pin. Clear my pin removes only your own pin. Show reference or Hide reference changes the separate reference. Previous bag and Next bag move between bags.');
  } else if (work.page === 'learn') {
    parts.push(chanceCopy.learnInstruction, `Picture ${work.lesson + 1} of ${chanceLessons.length}.`, model.lesson.title, model.lesson.text);
    for (const index of model.lesson.bags) {
      const bag = chanceBags[index], r = referenceFor(bag);
      parts.push(`${bag.sun} Sun and ${bag.moon} Moon: reference ${r.raw}${r.raw === r.label ? '' : ` = ${r.label}`}, ${r.word}, on the 0–1 line.`);
    }
    parts.push('Previous picture and Next picture move between pictures.');
  } else {
    parts.push(chanceCopy.questionsInstruction, `Question ${work.question + 1} of ${chanceQuestions.length}.`, model.question.prompt);
    model.question.choices.forEach((choice, index) => parts.push(`${index + 1}. ${choice.label}.`));
    if (model.selected !== null) parts.push(`Your choice: ${model.question.choices[model.selected].label}.`, model.feedback);
    if (model.explanation !== null) parts.push(`Explanation: ${model.explanation}`);
    parts.push('Show explanation or Hide explanation changes the optional help. Previous question and Next question move between questions.');
  }
  parts.push('Place a chance, See why, and Try questions are freely available. Previous page and Next page move between pages. Back to Seed Stall returns to your waiting experiment.', chanceCopy.lifetime);
  return parts.join(' ');
}
