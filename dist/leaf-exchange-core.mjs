import {leafExchangeCopy as copy, leafExchangeTrails as trails, leafExchangeTeaching as teaching} from './leaf-exchange-content.mjs';

export function createLeafExchange() {
  return {page: 'build', photo: 2, resp: 1, gas: 'oxygen', paired: false, trail: 0, lesson: 0, kind: 0};
}

const bounded = (value, max) => Number.isInteger(value) && value >= 0 && value <= max;
export function changeLeafExchange(work, action, value, context = null) {
  if (!work) return work;
  let key = action;
  if (action === 'page') {
    if (!['build', 'learn'].includes(value)) return work;
  } else if (['photo', 'resp', 'gas', 'pair', 'trail'].includes(action)) {
    if (work.page !== 'build') return work;
    if (action === 'photo' || action === 'resp') {
      if (!bounded(value, 6)) return work;
      value = value === 0 ? 0 : value;
    } else if (action === 'gas') {
      if (!['oxygen', 'carbon-dioxide'].includes(value)) return work;
    } else if (action === 'pair') { key = 'paired'; value = !work.paired; }
    else if (!bounded(value, trails.length - 1)) return work;
  } else if (action === 'lesson') {
    if (work.page !== 'learn' || !bounded(value, teaching.length - 1)) return work;
  } else if (action === 'kind') {
    if (work.page !== 'learn' || work.lesson !== 3 || !context || !bounded(value, context.rows.length - 1)) return work;
  } else return work;
  if (value === 0) value = 0;
  return work[key] === value ? work : {...work, [key]: value};
}

const unsigned = value => String(value === 0 ? 0 : value);
const signed = value => value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : '0';
const gasName = gas => gas === 'oxygen' ? 'Oxygen' : 'Carbon dioxide';
const plural = (n, word) => `${unsigned(n)} ${word}${n === 1 ? '' : 's'}`;
function row(process, groups, gas, role) {
  const label = process === 'photo' ? 'Photosynthesis' : 'Respiration';
  const molecules = groups * 6;
  return {process, label, groups: groups === 0 ? 0 : groups, molecules, role,
    caption: groups === 0
      ? `No ${label.toLowerCase()} groups in this comparison. 0 ${gasName(gas).toLowerCase()} molecules ${role}.`
      : `${label}: ${plural(groups, 'group')} × 6 = ${molecules} ${gasName(gas).toLowerCase()} molecules ${role}.`};
}

function copiedDisplay(work, context) {
  if (work.page !== 'learn' || work.lesson !== 3 || !context) return null;
  const selected = context.rows[work.kind];
  if (!selected) return null;
  const left = selected.leftToRight === 0 ? 0 : selected.leftToRight;
  const right = selected.rightToLeft === 0 ? 0 : selected.rightToLeft;
  const net = selected.net === 0 ? 0 : selected.net;
  return {
    heading: copy.copyHeading, note: copy.copyNote,
    identity: `Run ${context.index + 1} · ${context.title}`,
    label: selected.label,
    kindOptions: context.rows.map((item, index) => ({index, label: `Kind ${index + 1} · ${item.label}`})),
    permission: `This saved model ${selected.canCross ? 'allowed' : 'did not allow'} this kind to cross.`,
    stepCaption: context.steps === 0 ? 'Starting snapshot: no model step has been advanced.' : `Cumulative crossings by step ${context.steps}.`,
    crossingsCaption: `Left to right: ${plural(left, 'crossing')}. Right to left: ${plural(right, 'crossing')}.`,
    netCaption: net !== 0 ? `Net: ${plural(Math.abs(net), 'marker')} ${net > 0 ? 'left to right' : 'right to left'}.`
      : left === 0 && right === 0 ? 'Net: 0 markers. No crossings were counted for this marker kind.'
        : 'Net: 0 markers; opposite crossing totals balance.',
    question: copy.transferQuestion, notice: context.notice
  };
}

export function leafExchangeModel(work, context = null) {
  const oxygenNet = 6 * work.photo - 6 * work.resp;
  const carbonDioxideNet = 6 * work.resp - 6 * work.photo;
  const oxygen = work.gas === 'oxygen';
  const made = 6 * (oxygen ? work.photo : work.resp);
  const used = 6 * (oxygen ? work.resp : work.photo);
  const net = oxygen ? oxygenNet : carbonDioxideNet;
  const pairedCount = Math.min(work.photo, work.resp);
  return {
    page: work.page, gas: work.gas, gasLabel: gasName(work.gas), photo: work.photo, resp: work.resp, paired: work.paired,
    rows: [row('photo', work.photo, work.gas, oxygen ? 'made' : 'used'), row('resp', work.resp, work.gas, oxygen ? 'used' : 'made')],
    made, used, net, oxygenNet, carbonDioxideNet,
    netCaption: `${gasName(work.gas)} net: ${signed(net)} molecules.`,
    otherNetCaption: `${gasName(oxygen ? 'carbon-dioxide' : 'oxygen')} net: ${signed(-net)} molecules.`,
    explanation: net > 0 ? `+${net} means ${net} more were made than used in these two accounts.`
      : net < 0 ? `−${Math.abs(net)} means ${Math.abs(net)} more were used than made. This is a change, not a negative amount of gas.`
        : 'The made and used totals balance. Zero net alone cannot distinguish no entries from balanced entries.',
    pairedCount,
    linkCaption: !work.paired ? 'Links are off. Both separate totals stay visible.'
      : pairedCount === 0 ? 'No links: at least one row has no groups in this comparison.'
        : `Linked pairs: ${pairedCount}. Each link joins one made entry of 6 with one used entry of 6.`,
    markerX: 320 + 7 * net,
    trail: {index: work.trail, ...trails[work.trail]},
    teaching: {index: work.lesson, ...teaching[work.lesson]},
    copied: copiedDisplay(work, context)
  };
}

export function leafExchangeNarration(work, context = null) {
  const model = leafExchangeModel(work, context);
  const words = [copy.title, copy.story];
  if (work.page === 'build') {
    words.push(copy.buildInstruction, model.trail.title, model.trail.prompt, copy.modelNote, copy.limitNote, copy.chipKey,
      ...model.rows.map(item => item.caption), model.netCaption, model.explanation, model.otherNetCaption, model.linkCaption, copy.pairNote);
  } else {
    words.push(model.teaching.title, model.teaching.text, model.teaching.caption, copy.workedLabel);
    if (work.lesson === 3) {
      if (model.copied) {
        const c = model.copied;
        words.push(c.heading, c.note, c.identity, c.label, c.permission, c.stepCaption, c.crossingsCaption, c.netCaption, c.question);
      } else words.push(copy.noCopy);
    }
  }
  words.push(copy.visitNote);
  return words.join(' ');
}
