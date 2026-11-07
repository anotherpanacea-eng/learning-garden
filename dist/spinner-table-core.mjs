import {chancePoint} from './chance-line-core.mjs';
import {spinnerMarks, spinnerPresets, spinnerLessons, spinnerQuestions, spinnerCopy} from './spinner-table-content.mjs';

export function createSpinnerTable() {
  return {page: 'design', counts: [6, 3, 3], from: 0, to: 1, runs: [], active: null, lesson: 0, question: 0, learnPanel: 'pictures', answers: [null, null, null, null], explanations: [false, false, false, false], confirmReset: false, notice: null, summaryOpen: false};
}
const index = (n, max) => Number.isInteger(n) && n >= 0 && n <= max;
const replace = (a, i, value) => a.map((old, n) => n === i ? value : old);
const eligible = work => work.active !== null && work.runs[work.active].draws.length < 20;

export function changeSpinnerTable(work, action, value) {
  let next = work;
  const scalar = (key, valid) => { if (valid && work[key] !== value) next = {...work, [key]: value}; };
  switch (action) {
    case 'page': scalar('page', ['design', 'runs', 'learn'].includes(value)); break;
    case 'from': case 'to': scalar(action, index(value, 2)); break;
    case 'learn-panel': scalar('learnPanel', ['pictures', 'questions'].includes(value)); break;
    case 'lesson': case 'question': scalar(action, index(value, 3)); break;
    case 'move':
      if (work.from !== work.to && work.counts[work.from] > 0) next = {...work, counts: work.counts.map((n, i) => n + (i === work.to ? 1 : 0) - (i === work.from ? 1 : 0))};
      break;
    case 'preset':
      if (index(value, 2) && work.counts.some((n, i) => n !== spinnerPresets[value].counts[i])) next = {...work, counts: [...spinnerPresets[value].counts]};
      break;
    case 'start':
      if (work.runs.length < 3) next = {...work, page: 'runs', active: work.runs.length, runs: [...work.runs, {counts: [...work.counts], draws: []}]};
      break;
    case 'active': scalar('active', index(value, work.runs.length - 1)); break;
    case 'spin':
      if (index(value, 11) && eligible(work)) {
        const run = work.runs[work.active];
        next = {...work, runs: replace(work.runs, work.active, {...run, draws: [...run.draws, value]})};
      }
      break;
    case 'entropy-failure':
      if (eligible(work) && (work.notice !== 'entropy-unavailable' || work.confirmReset)) next = {...work, notice: 'entropy-unavailable'};
      break;
    case 'reset-request':
      return work.runs.length && !work.confirmReset ? {...work, confirmReset: true} : work;
    case 'reset-cancel': return work.confirmReset ? {...work, confirmReset: false} : work;
    case 'reset-confirm': return work.confirmReset ? {...work, runs: [], active: null, confirmReset: false, notice: null} : work;
    case 'summary': next = {...work, summaryOpen: !work.summaryOpen}; break;
    case 'answer':
      if (index(value, 2) && work.answers[work.question] !== value) next = {...work, answers: replace(work.answers, work.question, value)};
      break;
    case 'explanation': next = {...work, explanations: replace(work.explanations, work.question, !work.explanations[work.question])}; break;
  }
  return next === work ? work : {...next, confirmReset: false, notice: action === 'entropy-failure' ? next.notice : null};
}

export function spinnerSlotMark(counts, slot) {
  return slot < counts[0] ? 0 : slot < counts[0] + counts[1] ? 1 : 2;
}
export const spinnerSlotAngle = slot => (slot + 0.5) * 30;
export function browserSpinnerSlot(random = globalThis.crypto) {
  if (!random || typeof random.getRandomValues !== 'function') return null;
  try {
    for (let read = 0; read < 32; read++) {
      const value = new Uint32Array(1);
      random.getRandomValues(value);
      if (value[0] < 4294967292) return value[0] % 12;
    }
  } catch { return null; }
  return null;
}
function wheel(counts) {
  let start = 1;
  const marks = spinnerMarks.map((mark, i) => {
    const count = counts[i], first = start;
    start += count;
    return {...mark, count, chance: chancePoint(count), range: count === 0 ? 'No stops' : count === 1 ? `Slice ${first}` : `Slices ${first}–${start - 1}`};
  });
  return {counts: [...counts], marks, equal: counts.every(n => n === 4), slotMarks: Array.from({length: 12}, (_, s) => spinnerSlotMark(counts, s))};
}
export function spinnerTableModel(work) {
  const design = wheel(work.counts);
  const summary = work.runs.map((run, i) => {
    const tally = [0, 0, 0];
    run.draws.forEach(slot => tally[spinnerSlotMark(run.counts, slot)]++);
    return {number: i + 1, counts: [...run.counts], tally, drawCount: run.draws.length};
  });
  let active = null;
  if (work.active !== null) {
    const run = work.runs[work.active], frozen = wheel(run.counts);
    const results = run.draws.map(slot => ({slot, slice: slot + 1, mark: frozen.marks[spinnerSlotMark(run.counts, slot)], angle: spinnerSlotAngle(slot)}));
    active = {...frozen, index: work.active, number: work.active + 1, results, tally: summary[work.active].tally, last: results.at(-1) || null, drawCount: results.length, remaining: 20 - results.length, canSpin: results.length < 20, mismatch: run.counts.some((n, i) => n !== work.counts[i])};
  }
  const question = spinnerQuestions[work.question], selected = work.answers[work.question];
  return {design, active, summary, canStart: work.runs.length < 3, canMove: work.from !== work.to && work.counts[work.from] > 0,
    moveReason: work.from === work.to ? 'Choose two different marks.' : work.counts[work.from] === 0 ? 'There are no slices to take from this mark.' : '',
    notice: work.notice === 'entropy-unavailable' ? spinnerCopy.entropy : null,
    confirmation: work.confirmReset ? `This clears ${work.runs.length === 1 ? 'this 1 run' : `these ${work.runs.length} runs`} from this visit. It does not change your saved Seed Stall experiments.` : null,
    lesson: spinnerLessons[work.lesson], question, selected, feedback: selected === null ? null : question.choices[selected].feedback, explanation: work.explanations[work.question] ? question.explanation : null};
}
const wheelWords = w => w.marks.map(m => `${m.label}: ${m.count} stops, model chance ${m.chance}.`).join(' ');
const tallyWords = tally => spinnerMarks.map((m, i) => `${m.label} ${tally[i]}`).join(', ');
export function spinnerTableNarration(work) {
  const m = spinnerTableModel(work), parts = [spinnerCopy.pages[work.page]];
  if (work.page === 'design') {
    parts.push(spinnerCopy.designInstruction, spinnerCopy.rule, 'Current design.', wheelWords(m.design), `${work.counts.join('/12 + ')}/12 = 12/12 = 1.`, m.design.equal ? 'Equal chance for all three marks: 1/3 each.' : 'The named marks have different shares.', `Take one slice from ${spinnerMarks[work.from].label}. Give it to ${spinnerMarks[work.to].label}.`, m.moveReason, 'Move one slice. Presets: Equal shares, Half for Sun, Mostly Sun.');
  } else if (work.page === 'runs') {
    parts.push(spinnerCopy.rule);
    if (!m.active) parts.push('Current design.', wheelWords(m.design), 'Not drawn yet. Start a run with this wheel.');
    else {
      parts.push(`Run ${m.active.number}’s wheel.`, wheelWords(m.active), m.active.last ? `Screen draw ${m.active.drawCount}: ${m.active.last.mark.label} mark. Tally: ${tallyWords(m.active.tally)}.` : 'Not drawn yet.');
      if (m.active.drawCount) parts.push('Recorded screen draws:', m.active.results.map(r => `${r.slice}: ${r.mark.label}`).join(', '));
      parts.push(m.active.canSpin ? 'Spin for one screen draw.' : 'This run has twenty recorded screen draws.');
      if (m.active.mismatch) parts.push(m.canStart ? spinnerCopy.mismatch : spinnerCopy.mismatchFull);
    }
    parts.push(...m.summary.map(row => `Run ${row.number}: ${row.drawCount} recorded screen draws.`));
    if (work.summaryOpen && m.summary.length) {
      parts.push('Compare these runs.');
      m.summary.forEach(row => parts.push(`Run ${row.number}: frozen stops ${tallyWords(row.counts)}. ${row.drawCount ? `Recorded tally: ${tallyWords(row.tally)}.` : 'Not drawn yet.'}`));
    }
    if (m.notice) parts.push(m.notice);
    if (m.confirmation) parts.push(m.confirmation, 'Keep these runs. Clear these local runs.');
    else if (work.runs.length) parts.push('Begin a fresh set.');
  } else if (work.learnPanel === 'pictures') {
    parts.push(spinnerCopy.learnInstruction, `Picture ${work.lesson + 1} of 4.`, m.lesson.title, m.lesson.text, 'Previous picture. Next picture.');
  } else {
    parts.push(spinnerCopy.questionsInstruction, `Question ${work.question + 1} of 4.`, m.question.prompt);
    m.question.choices.forEach((c, i) => parts.push(`${i + 1}. ${c.label}.`));
    if (m.selected !== null) parts.push(`Your choice: ${m.question.choices[m.selected].label}.`, m.feedback);
    if (m.explanation) parts.push(`Explanation: ${m.explanation}`);
    parts.push('Show explanation or Hide explanation changes the optional help. Previous question. Next question.');
  }
  parts.push('Design the wheel, Try runs and See why are freely available.', 'Back to Seed Stall returns to the Seed Stall you left.', spinnerCopy.lifetime);
  return parts.join(' ');
}
