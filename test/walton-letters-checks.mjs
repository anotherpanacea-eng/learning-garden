// Synthetic writing only. Independent literary/source review establishes the
// interpretation and quotation adequacy; these checks protect runtime behavior.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {waltonLettersText} from '../dist/walton-letters-text.mjs';
import {waltonLettersSource} from '../dist/walton-letters-content.mjs';
import {evidenceVoiceSource} from '../dist/evidence-voice-content.mjs';
import * as E from '../dist/evidence-voice-core.mjs';
const eq=assert.deepEqual,ok=assert.ok,copy=structuredClone,fresh=()=>initializeExplorerState(freshState());
// Use the real app's download envelope, including its recommendation overhead.
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)[0];
const report=Function('recommendations','explorerStore',declaration+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const canExport=book=>prepareProgressImport(JSON.stringify(report(book),null,2)).ok,o={canExport};

// These spans are the question evidence, not a snapshot of all editorial prose.
const evidence=[['l1-p13','R. Walton.'],['l1-p4','presents itself to my imagination'],['l2-p4','to approve or amend my plans'],['l2-p6','wholly uneducated'],['l1-p3','my dear sister'],['l1-p10','If I fail']];
for(const [id,words] of evidence)ok(waltonLettersSource.chapters.flatMap(c=>c.paragraphs).find(p=>p.id===id)?.text.includes(words),`${id}: exact evidence phrase`);
eq(waltonLettersText.map(l=>l.heading),['LETTER I.','LETTER II.']);
ok(Object.isFrozen(waltonLettersText)&&waltonLettersText.every(l=>Object.isFrozen(l)&&Object.isFrozen(l.paragraphs)));
for(const [index,chapter] of waltonLettersSource.chapters.entries()){
 const original=chapter.paragraphs.filter(p=>p.primary===true);
 eq(original.map(p=>p.text),waltonLettersText[index].paragraphs,'original strings stay distinct from modern context');
 ok(chapter.paragraphs[0].primary!==true&&chapter.paragraphs.at(-1).primary!==true);
 ok(original.every((p,i)=>p.label===`Book words · Letter ${index?'II':'I'} · source block ${i+1}`));
}
eq(waltonLettersSource.questions.map(q=>q.choices.findIndex(c=>c.outcome==='fits')+1),[1,2,3,2,1,3]);
const s=fresh(),foreign=copy(s);
ok(E.startEvidenceVoice(s,'clock-river',o).ok);
const sibling=copy(s.evidenceVoice.units['clock-river']);
ok(E.startEvidenceVoice(s,'walton-letters',o).ok);
const unit=()=>E.evidenceVoiceView(s).work;
ok(E.validEvidenceUnit(unit()));eq(unit().source,waltonLettersSource);eq(unit().lesson,'before');eq(unit().exposed,['letter-one']);eq(unit().reading,'unobserved');ok(!Object.hasOwn(unit(),'visit'));
eq(s.evidenceVoice.units['clock-river'],sibling);
// Published edits cannot rewrite a retained source or its response order.
const retainedSource=copy(unit().source),catalogueTitle=waltonLettersSource.title;
try{waltonLettersSource.title='A later catalogue title';ok(E.startEvidenceVoice(s,'walton-letters',o).ok);eq(unit().source,retainedSource);}finally{waltonLettersSource.title=catalogueTitle;}
const expected={speaker:'choice-1',imagination:'choice-2',friend:'choice-3',master:'choice-2',tension:'choice-1',limits:'choice-3'};
for(const lesson of retainedSource.lessons){
 ok(E.setEvidenceLesson(s,lesson.id,o).ok,'all lessons stay open');
 for(const q of retainedSource.questions.filter(q=>q.lesson===lesson.id)){
  const first=E.answerEvidence(s,q.id,q.choices.find(c=>c.id!==expected[q.id]).id,o);ok(first.ok);eq(first.attempt.outcome,'different');eq(first.attempt.helpBefore,[]);
  const firstAttempt=copy(unit().firstResponses[q.id]);
  ok(E.supportEvidence(s,'guided',o).ok);const retry=E.answerEvidence(s,q.id,expected[q.id],o);ok(retry.ok);eq(retry.attempt.outcome,'fits');eq(retry.attempt.question,q);eq(retry.attempt.helpBefore,['guided']);eq(retry.attempt.practice,true);eq(unit().firstResponses[q.id],firstAttempt);
  // Synthetic setup only: isolate the next first check from this one's help.
  unit().support[lesson.id]=[];
 }
}
const exact='  A synthetic reading note\r\nwith <tags> & exact spacing.  ';
ok(E.setEvidenceAnnotationDraft(s,{anchor:'l2-p6',kind:'inference',text:exact},o).ok);
ok(E.annotateEvidence(s,'l2-p6','inference',exact,o).ok);
eq(unit().annotations[0],{anchor:'l2-p6',passage:retainedSource.chapters[1].paragraphs.find(p=>p.id==='l2-p6').text,kind:'inference',text:exact});
ok(E.setEvidenceLesson(s,'write',o).ok);ok(E.setEvidenceText(s,'paragraph',exact,o).ok);ok(E.keepEvidence(s,'draft',o).ok);
const firstDraft=copy(unit().firstDraft);
ok(E.setEvidenceText(s,'paragraph','A later synthetic first-draft version.',o).ok);ok(E.keepEvidence(s,'draft',o).ok);eq(unit().firstDraft,firstDraft);
ok(E.setEvidenceLesson(s,'revise',o).ok);ok(E.setEvidenceText(s,'revision',exact,o).ok);ok(E.keepEvidence(s,'revision',o).ok);
const firstRevision=copy(unit().firstRevision);
ok(E.setEvidenceText(s,'revision','The latest synthetic revision.',o).ok);ok(E.keepEvidence(s,'revision',o).ok);eq(unit().firstRevision,firstRevision);eq(unit().kept.drafts.revision,'The latest synthetic revision.');
eq(unit().firstDraft.source,retainedSource);eq(unit().firstRevision.source,retainedSource);
const transferred=prepareProgressImport(JSON.stringify(report(s),null,2));ok(transferred.ok);eq(transferred.state.evidenceVoice,s.evidenceVoice);
eq(s.evidenceVoice.units['clock-river'],sibling);const {evidenceVoice,...other}=s;eq(other,foreign,'only the owned Evidence Voice root changes');

// Saved material owns its source, optional metadata and earlier outcomes. It is
// not required to match today's content, order, counts or display classification.
for(const kind of [undefined,'a-future-source-kind']){
 const old=copy(s),saved=old.evidenceVoice.units['walton-letters'];
 if(kind===undefined)delete saved.source.kind;else saved.source.kind=kind;
 saved.source.title='An older saved reading';saved.source.future={literal:'retained'};saved.future={literal:'retained'};
 saved.source.chapters.reverse();saved.source.lessons.reverse();saved.source.questions.pop();
 saved.source.chapters[0].paragraphs[0].label={future:'unreadable display metadata'};
 const primary=saved.source.chapters.flatMap(c=>c.paragraphs).find(p=>p.id==='l1-p4');primary.text='Older retained wording.\r\nNot replaced.';delete primary.primary;
 const q=saved.source.questions[0];q.choices.reverse();q.choices[0].outcome='different';q.choices[0].feedback='An earlier saved outcome.';
 ok(E.validEvidenceUnit(saved));const retained=copy(saved);
 ok(E.startEvidenceVoice(old,'clock-river',o).ok);ok(E.startEvidenceVoice(old,'walton-letters',o).ok);eq(old.evidenceVoice.units['walton-letters'],retained);
 ok(E.annotateEvidence(old,'l1-p4','literal',exact,o).ok);eq(E.evidenceVoiceView(old).work.annotations.at(-1).passage,primary.text);
 eq(E.evidenceVoiceView(old).work.responses,retained.responses);
 const imported=prepareProgressImport(JSON.stringify(report(old),null,2));ok(imported.ok);eq(imported.state.evidenceVoice,old.evidenceVoice);
}
const unreadable=copy(s);unreadable.evidenceVoice.units['walton-letters']={future:['retained raw']};unreadable.evidenceVoice.current='clock-river';
const raw=copy(unreadable),refused=E.startEvidenceVoice(unreadable,'walton-letters',o);ok(!refused.ok);ok(refused.error.includes('literary record'));ok(!refused.error.includes('new copy'));eq(unreadable,raw);ok(E.startEvidenceVoice(unreadable,'clock-river',o).ok);
const opaque=copy(s);opaque.evidenceVoice={version:9,current:'walton-letters',units:{future:['raw']}};const opaquePrior=copy(opaque);ok(!E.startEvidenceVoice(opaque,'walton-letters',o).ok);eq(opaque,opaquePrior);
const unknown=fresh();ok(E.startEvidenceVoice(unknown,'walton-letters-old',o).ok);eq(E.evidenceVoiceView(unknown).work.source,evidenceVoiceSource,'unknown keys preserve the existing clock-source fallback');
ok(!E.removableEvidenceStories(s).some(u=>u.id==='walton-letters'));

// Narrow refusal probes use actual export limits; the common engine's larger
// callback/rollback matrix remains in its existing suite.
const noGate=fresh(),noGatePrior=copy(noGate);ok(!E.startEvidenceVoice(noGate,'walton-letters').ok);eq(noGate,noGatePrior);
const denied=copy(s),deniedPrior=copy(denied);ok(!E.startEvidenceVoice(denied,'clock-river',{canExport:()=>false}).ok);eq(denied,deniedPrior);
for(const mutate of [b=>E.setEvidenceText(b,'revision','x'.repeat(8001),o),b=>E.annotateEvidence(b,'l1-p4','literal','x'.repeat(2001),o)]){const b=copy(s),before=copy(b);ok(!mutate(b).ok);eq(b,before);}
// Raw state can fit while the real download envelope cannot; refuse atomically.
const cap=copy(s);cap.padding='';const proposal=copy(cap);ok(E.setEvidenceText(proposal,'revision','Capacity probe.',{canExport:()=>true}).ok);
const room=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(proposal,null,2)).length-40;cap.padding='x'.repeat(room);proposal.padding=cap.padding;
ok(recoveryFitsProgressLimits(proposal));ok(!canExport(proposal));const capPrior=copy(cap);ok(!E.setEvidenceText(cap,'revision','Capacity probe.',o).ok);eq(cap,capPrior);
console.log('Walton Letters: exact source evidence, fixed own-source work, retained responses/drafts, unrelated roots and actual Notes limits passed.');
