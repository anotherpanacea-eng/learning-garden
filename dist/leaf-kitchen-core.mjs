import {
  leafKitchenCopy as copy, leafKitchenCards as cards, leafKitchenRoles as roles,
  leafKitchenReference as reference, leafKitchenTeaching as teaching,
  leafKitchenInvitations as invitations
} from './leaf-kitchen-content.mjs';

const pages = ['build', 'compare', 'learn', 'questions'];
const emptyPlacements = () => Object.fromEntries(cards.map(card => [card.id, null]));

// A room visit only: no notebook, source history or kept record is involved.
export function createLeafKitchen() {
  return {placements: emptyPlacements(), selected: null, page: 'build', reference: false,
    step: 0, invitation: 0, choice: null};
}

export function changeLeafKitchen(work, action, value) {
  if (!work) return null;
  const next = {...work, placements: {...work.placements}};
  switch (action) {
    case 'page':
      if (!pages.includes(value) || value === work.page) return null;
      next.page = value;
      break;
    case 'select':
      if (work.page !== 'build' || !cards.some(card => card.id === value) || value === work.selected) return null;
      next.selected = value;
      break;
    case 'place':
      if (work.page !== 'build' || !work.selected || !roles.some(role => role.id === value) || work.placements[work.selected] === value) return null;
      next.placements[work.selected] = value;
      break;
    case 'remove':
      if (work.page !== 'build' || !work.selected || work.placements[work.selected] === null) return null;
      next.placements[work.selected] = null;
      break;
    case 'new-arrangement':
      if (work.page !== 'build' || (!work.selected && !work.reference && cards.every(card => work.placements[card.id] === null))) return null;
      next.placements = emptyPlacements(); next.selected = null; next.reference = false;
      break;
    case 'show-reference':
      if (work.page !== 'compare' || work.reference) return null;
      next.reference = true;
      break;
    case 'step':
      if (work.page !== 'learn' || !Number.isInteger(value) || value < 0 || value >= teaching.length || value === work.step) return null;
      next.step = value;
      break;
    case 'question':
      if (work.page !== 'questions' || !Number.isInteger(value) || value < 0 || value >= invitations.length || (value === work.invitation && work.choice === null)) return null;
      next.invitation = value; next.choice = null;
      break;
    case 'answer':
      if (work.page !== 'questions' || !invitations[work.invitation].choices.some(choice => choice.id === value) || value === work.choice) return null;
      next.choice = value;
      break;
    default: return null;
  }
  return next;
}

const roleLists = placements => roles.map(role => ({...role,
  cards: cards.filter(card => placements[card.id] === role.id)}));

export function leafKitchenModel(work) {
  const question = invitations[work.invitation];
  const choice = question.choices.find(item => item.id === work.choice) ?? null;
  return structuredClone({
    page: work.page,
    selected: cards.find(card => card.id === work.selected) ?? null,
    roles: roleLists(work.placements),
    unplaced: cards.filter(card => work.placements[card.id] === null),
    reference: work.page === 'compare' && work.reference ? {
      roles: roleLists(reference), wordEquation: copy.wordEquation,
      wordEquationNote: copy.wordEquationNote, notice: copy.referenceNotice
    } : null,
    teaching: work.page === 'learn' ? {...teaching[work.step], index: work.step} : null,
    invitation: work.page === 'questions' ? {...question, index: work.invitation, choice} : null,
    feedback: work.page === 'questions' && choice ? {outcome: choice.outcome, text: choice.feedback} : null
  });
}

export function leafKitchenNarration(work) {
  const model = leafKitchenModel(work);
  const words = [copy.title, copy.story, copy[work.page], copy[`${work.page}Instruction`]];
  const readRoles = list => {
    for (const role of list) words.push(role.label, ...(
      role.cards.length ? role.cards.map(card => card.label) : [copy.emptyRole]));
  };
  if (work.page === 'build' || work.page === 'compare') {
    if (work.page === 'build') words.push(model.selected ? `${copy.selected} ${model.selected.label}` : copy.noneSelected);
    words.push(copy.yourIdea, copy.yourNotice);
    readRoles(model.roles);
    if (work.page === 'build') words.push(copy.unplaced, ...model.unplaced.map(card => card.label));
    if (work.page === 'compare') {
      if (!model.reference) words.push(copy.referenceHidden);
      else {
        words.push(copy.reference);
        readRoles(model.reference.roles);
        words.push(model.reference.wordEquation, model.reference.wordEquationNote, model.reference.notice);
      }
    }
  } else if (work.page === 'learn') {
    words.push(model.teaching.title, model.teaching.text, model.teaching.caption);
  } else if (work.page === 'questions') {
    words.push(model.invitation.prompt, ...model.invitation.choices.map(choice => choice.label));
    if (model.feedback) words.push(copy[model.feedback.outcome], model.feedback.text);
  }
  words.push(copy.notice, copy.visitNote, copy.parentLeaveWarning);
  return words.join(' ');
}
