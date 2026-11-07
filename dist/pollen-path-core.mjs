import { pollenPathCopy as copy, pollenPathContacts, pollenPathInvitations, pollenPathLessons } from './pollen-path-content.mjs';

export function createPollenPath() {
  return { page: 'garden', position: 'rest', body: [false, false], stigmas: [[false, false], [false, false]], contacts: [], invitation: 0, lesson: 0, confirmFresh: false };
}

const append = (work, code) => [...work.contacts, code].slice(-8);
const choose = (work, key, value) => work[key] === value && !work.confirmFresh ? work : { ...work, [key]: value, confirmFresh: false };

export function changePollenPath(work, action, value) {
  if (action === 'page') return ['garden', 'learn'].includes(value) ? choose(work, 'page', value) : work;
  if (action === 'fresh-cancel') return work.confirmFresh ? { ...work, confirmFresh: false } : work;
  if (action === 'lesson') return work.page === 'learn' && Number.isInteger(value) && value >= 0 && value < 4 ? choose(work, 'lesson', value) : work;
  if (work.page !== 'garden') return work;
  if (action === 'invitation') return Number.isInteger(value) && value >= 0 && value < 6 ? choose(work, 'invitation', value) : work;
  if (action === 'fresh-request') return work.confirmFresh ? work : { ...work, confirmFresh: true };
  if (action === 'fresh-confirm') return work.confirmFresh ? { ...createPollenPath(), page: work.page, invitation: work.invitation, lesson: work.lesson } : work;
  if (action === 'clean') return { ...work, position: 'rest', body: [false, false], contacts: append(work, 'clean'), confirmFresh: false };
  if (action !== 'contact') return work;
  const contact = pollenPathContacts.find(item => item.id === value);
  if (!contact) return work;
  const index = contact.flower === 'A' ? 0 : 1;
  const body = [...work.body];
  const stigmas = work.stigmas.map(origins => [...origins]);
  if (contact.part === 'anthers') body[index] = true;
  if (contact.part === 'stigma') stigmas[index] = stigmas[index].map((present, origin) => present || body[origin]);
  return { ...work, position: value, body, stigmas, contacts: append(work, value), confirmFresh: false };
}

function originLabel(origins) {
  return origins[0] ? (origins[1] ? 'A and B' : 'A') : (origins[1] ? 'B' : 'none');
}

export function pollenPathModel(work) {
  const bodyOrigins = originLabel(work.body);
  const stigmaOrigins = work.stigmas.map(originLabel);
  const last = work.contacts.at(-1);
  const contact = pollenPathContacts.find(item => item.id === last);
  const current = pollenPathContacts.find(item => item.id === work.position);
  let status = last === 'clean' ? copy.cleanStatus : copy.initialStatus;
  if (contact) {
    const flower = contact.flower;
    if (contact.part === 'anthers') status = `The visitor touches flower ${flower}'s anthers. Its body now shows pollen from ${bodyOrigins}.`;
    if (contact.part === 'nectar') status = `The visitor stops at flower ${flower}'s nectar. In this model it touches only the nectar stop, so the pollen marks stay the same.`;
    if (contact.part === 'stigma') {
      const shown = stigmaOrigins[flower === 'A' ? 0 : 1];
      status = bodyOrigins !== 'none'
        ? `The visitor brings pollen from ${bodyOrigins} to flower ${flower}'s stigma. Origins on flower ${flower}'s stigma: ${shown}. The visitor keeps its origin marks.`
        : shown !== 'none'
          ? `No pollen came with this visitor. Marks already on flower ${flower}'s stigma keep their place.`
          : `No pollen came with this visitor. Flower ${flower}'s stigma still shows no origins.`;
    }
  }
  return {
    page: work.page, position: work.position,
    location: current ? `Paper bee: at flower ${current.flower}'s ${current.part === 'nectar' ? 'nectar stop' : current.part}` : 'Paper bee: resting',
    body: [...work.body], stigmas: work.stigmas.map(origins => [...origins]),
    bodyOrigins, stigmaOrigins,
    bodyCaption: `Pollen origins on the visitor: ${bodyOrigins}`,
    stigmaCaptions: stigmaOrigins.map((label, index) => `Origins shown on ${index === 0 ? 'A' : 'B'}'s stigma: ${label}`),
    status,
    recent: work.contacts.map(code => code === 'clean' ? 'Clean paper visitor' : pollenPathContacts.find(item => item.id === code).label),
    invitation: pollenPathInvitations[work.invitation], invitationIndex: work.invitation,
    lesson: pollenPathLessons[work.lesson], lessonIndex: work.lesson, confirmFresh: work.confirmFresh
  };
}

export function pollenPathNarration(work) {
  const model = pollenPathModel(work);
  const introduction = [copy.title, copy.intro];
  if (work.page === 'learn') return [...introduction, model.lesson.title, model.lesson.text, copy.worked, model.lesson.caption, copy.lifetime].join(' ');
  return [...introduction, copy.instruction, model.invitation.title, model.invitation.prompt,
    copy.anatomy, copy.caption, copy.legend, copy.limit, model.location, model.bodyCaption,
    ...model.stigmaCaptions, model.status, copy.recent,
    ...(model.recent.length ? model.recent : [copy.emptyRecent]), copy.recentNote,
    ...(work.confirmFresh ? [copy.confirmation] : []), copy.lifetime].join(' ');
}
