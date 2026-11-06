// Synthetic writing only. Subject/quotation review, rather than these checks,
// establishes the current historical material's adequacy.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {freedomDocumentsSource} from '../dist/freedom-documents-content.mjs';
import {evidenceVoiceSource} from '../dist/evidence-voice-content.mjs';
import {stormAccountsSource} from '../dist/storm-accounts-content.mjs';
import {evidenceStories} from '../dist/evidence-voice-stories.mjs';
import * as E from '../dist/evidence-voice-core.mjs';
const eq=assert.deepEqual,ok=assert.ok,copy=structuredClone,fresh=()=>initializeExplorerState(freshState());
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)[0];
const report=Function('recommendations','explorerStore',declaration+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const canExport=book=>prepareProgressImport(JSON.stringify(report(book),null,2)).ok,o={canExport};
const s=fresh(),foreign=copy(s);
eq(E.evidenceVoiceView(s).status,'missing');
ok(E.startEvidenceVoice(s,'clock-river',o).ok);ok(E.setEvidenceText(s,'interpretation','An invented reading note.\r\n  Exact spacing.',o).ok);
const clock=copy(s.evidenceVoice.units['clock-river']);eq(clock.source,evidenceVoiceSource);
ok(E.startEvidenceVoice(s,'storm-accounts',o).ok);ok(E.setEvidenceLesson(s,'compare',o).ok);ok(E.supportEvidence(s,'hint',o).ok);
const storm=copy(s.evidenceVoice.units['storm-accounts']);eq(storm.source,stormAccountsSource);
const generated=E.createEvidenceStory(s,{story:evidenceStories[1].id,challenge:2,reader:'skeptic'},o);ok(generated.ok);ok(E.setEvidenceText(s,'interpretation','An invented story comparison.',o).ok);
const generatedUnit=copy(s.evidenceVoice.units[generated.key]),selection=copy(s.evidenceVoice.exploration),suggestion=copy(E.evidenceStorySuggestion(s));
ok(!Object.hasOwn(s.evidenceVoice.units,'freedom-documents'));
ok(E.startEvidenceVoice(s,'freedom-documents',o).ok);const unit=()=>E.evidenceVoiceView(s).work;
ok(E.validEvidenceUnit(unit()));eq(unit().source,freedomDocumentsSource);eq(unit().lesson,'before');eq(unit().drafts,{});eq(unit().responses,[]);eq(unit().reading,'unobserved');ok(!Object.hasOwn(unit(),'visit'));
eq(E.evidenceStorySuggestion(s).challenge,suggestion.challenge,'historical checks do not supply generated-story adaptation evidence');
eq(s.evidenceVoice.units['clock-river'],clock);eq(s.evidenceVoice.units['storm-accounts'],storm);eq(s.evidenceVoice.units[generated.key],generatedUnit);eq(s.evidenceVoice.exploration,selection);
const originalSource=copy(unit().source);
// A later editorial change cannot rewrite this unit or its kept source.
const publishedTitle=freedomDocumentsSource.title,publishedBody=freedomDocumentsSource.chapters[0].paragraphs[1].text;
try{freedomDocumentsSource.title='Later catalogue title';freedomDocumentsSource.chapters[0].paragraphs[1].text='Later catalogue wording';ok(E.startEvidenceVoice(s,'freedom-documents',o).ok);eq(unit().source,originalSource);}finally{freedomDocumentsSource.title=publishedTitle;freedomDocumentsSource.chapters[0].paragraphs[1].text=publishedBody;}
// Primary flags are display metadata; context/citations remain distinct source paragraphs.
const paragraphs=unit().source.chapters.flatMap(c=>c.paragraphs),primaryIds=['d-claim','d-separation','p-rights','p-comparison','p-request'];
eq(paragraphs.filter(p=>p.primary===true).map(p=>p.id),primaryIds);
for(const p of paragraphs.filter(p=>!primaryIds.includes(p.id)))ok(p.primary!==true,'our context and citations are not marked primary');
const chosen={claim:'claim-1',purpose:'purpose-2','petition-purpose':'petition-purpose-3',children:'children-2','shared-language':'shared-language-1',limits:'limits-3'};
for(const lesson of originalSource.lessons){
 ok(E.setEvidenceLesson(s,lesson.id,o).ok,'each lesson opens without an answer gate');
 for(const question of originalSource.questions.filter(q=>q.lesson===lesson.id)){
  const fitting=chosen[question.id],other=question.choices.find(c=>c.id!==fitting).id;
  const first=E.answerEvidence(s,question.id,other,o);ok(first.ok);eq(first.attempt.outcome,'different');eq(first.attempt.helpBefore,[]);eq(first.attempt.reading,'unobserved');
  const keptFirst=copy(unit().firstResponses[question.id]);ok(E.supportEvidence(s,'guided',o).ok);
  const next=E.answerEvidence(s,question.id,fitting,o);ok(next.ok);eq(next.attempt.outcome,'fits');eq(next.attempt.question,question);eq(next.attempt.helpBefore,['guided']);eq(unit().firstResponses[question.id],keptFirst);
  // Remove support only in this synthetic fixture so the next initial attempt can
  // independently demonstrate that help history belongs to its own first check.
  unit().support[lesson.id]=[];
 }
}
const noAdaptiveChange=E.evidenceStorySuggestion(s);eq(noAdaptiveChange.challenge,suggestion.challenge);eq(s.evidenceVoice.exploration,selection);
const exact='  A synthetic explanation\r\nwith <tags> & exact spaces.  ',p=paragraphs.find(p=>p.id==='p-request');
ok(E.setEvidenceAnnotationDraft(s,{anchor:p.id,kind:'question',text:exact},o).ok);ok(E.annotateEvidence(s,p.id,'question',exact,o).ok);
eq(unit().annotations[0],{anchor:p.id,passage:p.text,kind:'question',text:exact});
ok(E.setEvidenceLesson(s,'write',o).ok);for(const field of ['claim','detail','reasoning','paragraph'])ok(E.setEvidenceText(s,field,field==='paragraph'?exact:`Synthetic ${field}.`,o).ok);
ok(E.keepEvidence(s,'draft',o).ok);const firstDraft=copy(unit().firstDraft);ok(E.setEvidenceText(s,'paragraph','A second invented draft.',o).ok);ok(E.keepEvidence(s,'draft',o).ok);eq(unit().firstDraft,firstDraft);eq(unit().kept.drafts.paragraph,'A second invented draft.');
ok(E.setEvidenceLesson(s,'revise',o).ok);ok(E.setEvidenceText(s,'objection','Which excerpt supports that invented sentence?',o).ok);ok(E.setEvidenceText(s,'revision',exact,o).ok);ok(E.setEvidenceText(s,'change','A synthetic change note.',o).ok);ok(E.keepEvidence(s,'revision',o).ok);
const firstRevision=copy(unit().firstRevision);ok(E.setEvidenceText(s,'revision','A latest invented revision.',o).ok);ok(E.keepEvidence(s,'revision',o).ok);eq(unit().firstRevision,firstRevision);eq(unit().kept.drafts.revision,'A latest invented revision.');
ok(E.skipEvidence(s,o).ok);ok(E.setEvidenceReading(s,'together',o).ok);ok(E.exposeEvidence(s,['declaration','petition'],o).ok);eq(unit().skipped,['revise']);eq(unit().reading,'together');
eq(unit().drafts.paragraph,'A second invented draft.');eq(firstDraft.drafts.paragraph,exact);eq(firstRevision.drafts.revision,exact);
eq(s.evidenceVoice.units['clock-river'],clock);eq(s.evidenceVoice.units['storm-accounts'],storm);eq(s.evidenceVoice.units[generated.key],generatedUnit);
const transfer=prepareProgressImport(JSON.stringify(report(s),null,2));ok(transfer.ok);eq(transfer.state.evidenceVoice,s.evidenceVoice);const {evidenceVoice,...other}=s;eq(other,foreign,'only Evidence Voice root changes');
// Saved own-source material can differ from the current historical catalogue.
const historical=copy(s),saved=historical.evidenceVoice.units['freedom-documents'];
saved.source.title='A historical saved selection';delete saved.source.kind;saved.source.future={literal:'retained'};saved.future={literal:'retained'};
saved.source.chapters[0].paragraphs[0].label={future:'unreadable presentation metadata'};
saved.source.chapters[0].paragraphs[1].text='An older retained primary fragment.\r\nNot replaced by current catalogue.';
saved.source.questions[0].choices[0].outcome='different';saved.source.questions[0].choices[0].feedback='An older retained result.';
ok(E.validEvidenceUnit(saved));const savedSnapshot=copy(saved);ok(E.startEvidenceVoice(historical,'freedom-documents',o).ok);eq(historical.evidenceVoice.units['freedom-documents'],savedSnapshot);
ok(E.annotateEvidence(historical,'d-claim','literal','Synthetic historical note.',o).ok);eq(E.evidenceVoiceView(historical).work.annotations.at(-1).passage,savedSnapshot.source.chapters[0].paragraphs[1].text);
eq(E.evidenceVoiceView(historical).work.responses,savedSnapshot.responses,'saved attempts keep their own question/outcomes after source changes');
const historyImport=prepareProgressImport(JSON.stringify(report(historical),null,2));ok(historyImport.ok);eq(historyImport.state.evidenceVoice,historical.evidenceVoice);
const readableElsewhere=copy(s);readableElsewhere.evidenceVoice.units['freedom-documents']={future:['retained raw']};readableElsewhere.evidenceVoice.current='clock-river';
const raw=copy(readableElsewhere),refusal=E.startEvidenceVoice(readableElsewhere,'freedom-documents',o);ok(!refusal.ok);ok(refusal.error.includes('historical record'));ok(!refusal.error.includes('new copy'));eq(readableElsewhere,raw);ok(E.startEvidenceVoice(readableElsewhere,'storm-accounts',o).ok);
ok(!E.removableEvidenceStories(s).some(u=>u.id==='freedom-documents'));const unremoved=copy(s);ok(!E.removeEvidenceStory(s,'freedom-documents',true,o).ok);eq(s,unremoved);
const unknown=fresh();ok(E.startEvidenceVoice(unknown,'freedom-documents-old',o).ok);eq(E.evidenceVoiceView(unknown).work.source,evidenceVoiceSource,'unknown-key fallback remains the existing clock source');
// Strict, disposable whole-book preflight protects both proposed and foreign roots.
const mutations=[
 (b,opt)=>E.startEvidenceVoice(b,'freedom-documents',opt),
 (b,opt)=>E.setEvidenceLesson(b,'before',opt),
 (b,opt)=>E.setEvidenceText(b,'revision','Rejected synthetic words.',opt),
 (b,opt)=>E.annotateEvidence(b,'p-rights','literal','Rejected note.',opt),
 (b,opt)=>E.answerEvidence(b,'limits','limits-3',opt),
 (b,opt)=>E.supportEvidence(b,'learn',opt),
 (b,opt)=>E.setEvidenceAnnotationDraft(b,{anchor:'d-claim',kind:'literal',text:'Rejected draft.'},opt),
 (b,opt)=>E.keepEvidence(b,'revision',opt)
];
for(const mutate of mutations)for(const opt of [{},{canExport:()=>false},{canExport:()=>1},{canExport:b=>{b.evidenceVoice=null;b.garden=null;throw Error('Invented gate refusal');}},{canExport:b=>{b.evidenceVoice=null;b.garden=null;return false;}}]){
 const b=copy(s),old=copy(b);ok(!mutate(b,opt).ok);eq(b,old);
}
const captured=copy(s),capturedOther=copy(captured.garden);
ok(E.setEvidenceText(captured,'revision','The approved proposed words.',{canExport(candidate){ok(canExport(candidate));candidate.evidenceVoice=null;candidate.garden=null;candidate.newRoot={discarded:true};return true;}}).ok);
eq(captured.evidenceVoice.units['freedom-documents'].drafts.revision,'The approved proposed words.');eq(captured.garden,capturedOther);ok(!Object.hasOwn(captured,'newRoot'));
const retained=copy(s),retainedRoot=copy(retained.evidenceVoice);ok(E.setEvidenceText(retained,'revision','Another approved proposal.',{canExport(candidate){candidate.evidenceVoice.units['freedom-documents'].source.title='Callback corruption';return true;}}).ok);eq(retained.evidenceVoice.units['freedom-documents'].source,retainedRoot.units['freedom-documents'].source);
for(const bad of [x=>E.setEvidenceText(x,'revision','x'.repeat(8001),o),x=>E.annotateEvidence(x,'d-claim','literal','x'.repeat(2001),o)]){const b=copy(s),old=copy(b);ok(!bad(b).ok);eq(b,old);}
// The real pretty Notes envelope can reject a proposal even when its raw book fits.
const cap=copy(s);cap.padding='';const proposal=copy(cap);ok(E.setEvidenceText(proposal,'revision','Capacity probe.',{canExport:()=>true}).ok);
const room=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(proposal,null,2)).length-40;cap.padding='x'.repeat(room);proposal.padding=cap.padding;ok(recoveryFitsProgressLimits(proposal));ok(!canExport(proposal));const previous=copy(cap);ok(!E.setEvidenceText(cap,'revision','Capacity probe.',o).ok);eq(cap,previous);
console.log('Freedom Documents: explicit own-source units, supported checks, exact writing/annotations, retained history and actual Notes gates passed.');
