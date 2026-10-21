// Original equal-group stories. Related quantities are practice, never a recall test.
export const GROUP_CASES = [
  {id:'little-table',name:'Little table',groups:3,each:4,total:12},
  {id:'same-twelve',name:'Another way to share',groups:4,each:3,total:12},
  {id:'picnic',name:'Picnic plates',groups:2,each:5,total:10},
  {id:'welcome-supper',name:'Welcome-back supper',groups:5,each:6,total:30},
  {id:'long-tables',name:'Long tables',groups:7,each:8,total:56},
  {id:'festival',name:'Festival preparation',groups:12,each:12,total:144}
].map(Object.freeze);
export const GROUP_UNKNOWNS = Object.freeze(['total','each','groups']);
export const caseById = id => GROUP_CASES.find(c=>c.id===id)||null;
const units = place => place==='bramble'?{group:'bundle',groups:'bundles',objects:'ribbons'}:{group:'plate',groups:'plates',objects:'bites'};
export function groupPrompt(c,place,unknown){
  if(!c||!GROUP_UNKNOWNS.includes(unknown))return null;
  const u=units(place),labels={groups:u.groups,each:`${u.objects} on each ${u.group}`,total:`${u.objects} altogether`};
  const prompt=unknown==='total'?`There are ${c.groups} ${u.groups}, with ${c.each} ${u.objects} on each ${u.group}. How many ${u.objects} are there altogether?`:unknown==='each'?`Share ${c.total} ${u.objects} equally among ${c.groups} ${u.groups}. How many ${u.objects} belong on each ${u.group}?`:`Put ${c.total} ${u.objects} into ${u.groups} of ${c.each}. How many ${u.groups} can you make?`;
  const equation=unknown==='total'?`${c.groups} ${u.groups} × ${c.each} ${u.objects} per ${u.group} = ? ${u.objects}`:unknown==='each'?`${c.total} ${u.objects} ÷ ${c.groups} ${u.groups} = ? ${u.objects} per ${u.group}`:`${c.total} ${u.objects} ÷ ${c.each} ${u.objects} per ${u.group} = ? ${u.groups}`;
  const related=unknown==='total'?equation:unknown==='each'?`${c.groups} ${u.groups} × ? ${u.objects} per ${u.group} = ${c.total} ${u.objects}`:`? ${u.groups} × ${c.each} ${u.objects} per ${u.group} = ${c.total} ${u.objects}`;
  return {related,prompt,givens:GROUP_UNKNOWNS.filter(k=>k!==unknown).map(k=>({label:labels[k],value:c[k]})),answer:c[unknown],unit:unknown==='groups'?u.groups:unknown==='each'?`${u.objects} per ${u.group}`:u.objects,equation};
}
export function groupEquations(c,place){
  const u=units(place);
  return [
    `${Array(c.groups).fill(`${c.each} ${u.objects}`).join(' + ')} = ${c.total} ${u.objects} altogether`,
    `${c.groups} ${u.groups} × ${c.each} ${u.objects} per ${u.group} = ${c.total} ${u.objects}`,
    `${c.total} ${u.objects} shared among ${c.groups} ${u.groups}: ${c.total} ÷ ${c.groups} = ${c.each} ${u.objects} per ${u.group}`,
    `${c.total} ${u.objects} in ${u.groups} of ${c.each}: ${c.total} ÷ ${c.each} = ${c.groups} ${u.groups}`
  ];
}
