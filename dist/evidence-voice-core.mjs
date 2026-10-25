import {evidenceVoiceSource} from './evidence-voice-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const copy=x=>structuredClone(x),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const str=(x,max=8000)=>typeof x==='string'&&x.length<=max;
const id=x=>str(x,80)&&/^[a-z][a-z0-9-]*$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const list=(x,max,fn)=>Array.isArray(x)&&x.length<=max&&x.every(fn);
const unique=xs=>new Set(xs).size===xs.length;
const codes=x=>list(x,80,id)&&unique(x);
const record=x=>obj(x)&&Object.keys(x).every(id);
const supportKinds=['learn','guided','hint','example','audio','together'];
function sourceValid(s){
 if(!obj(s)||!id(s.id)||!str(s.title,200)||!str(s.notice,1500)||!list(s.chapters,20,c=>obj(c)&&id(c.id)&&str(c.title,200)&&list(c.paragraphs,40,p=>obj(p)&&id(p.id)&&str(p.text,12000)))||!unique(s.chapters.map(c=>c.id)))return false;
 const paragraphs=s.chapters.flatMap(c=>c.paragraphs);if(!unique(paragraphs.map(p=>p.id)))return false;
 if(!list(s.lessons,20,l=>obj(l)&&id(l.id)&&str(l.title,200)&&['learn','guided','hint','example','prompt'].every(k=>str(l[k],4000))&&codes(l.chapters)&&l.chapters.every(id=>s.chapters.some(c=>c.id===id))&&codes(l.fields))||!unique(s.lessons.map(l=>l.id)))return false;
 return list(s.questions,40,q=>obj(q)&&id(q.id)&&s.lessons.some(l=>l.id===q.lesson)&&str(q.prompt,2000)&&list(q.choices,8,c=>obj(c)&&id(c.id)&&str(c.label,2000)&&['fits','different'].includes(c.outcome)&&str(c.feedback,2000))&&q.choices.length>0&&unique(q.choices.map(c=>c.id)))&&unique(s.questions.map(q=>q.id));
}
const fieldsValid=d=>record(d)&&Object.values(d).every(t=>str(t));
const supportsValid=s=>record(s)&&Object.values(s).every(v=>list(v,6,k=>supportKinds.includes(k))&&unique(v));
const readingValid=r=>['unobserved','together','reported-independent'].includes(r);
function annotationValid(a){return obj(a)&&id(a.anchor)&&str(a.passage,12000)&&['literal','inference','question'].includes(a.kind)&&str(a.text,2000);}
function questionValid(q){return obj(q)&&id(q.id)&&str(q.prompt,2000)&&list(q.choices,8,c=>obj(c)&&id(c.id)&&str(c.label,2000)&&['fits','different'].includes(c.outcome)&&str(c.feedback,2000))&&unique(q.choices.map(c=>c.id));}
function attemptValid(a){if(!obj(a)||!questionValid(a.question)||!id(a.choice)||!['fits','different'].includes(a.outcome)||!str(a.feedback,2000)||!list(a.helpBefore,6,k=>supportKinds.includes(k))||!readingValid(a.reading)||a.practice!==true)return false;const choice=a.question.choices.find(c=>c.id===a.choice);return !!choice&&choice.outcome===a.outcome&&choice.feedback===a.feedback;}
function snapshotValid(k){return obj(k)&&['draft','revision'].includes(k.kind)&&sourceValid(k.source)&&fieldsValid(k.drafts)&&list(k.annotations,40,annotationValid)&&supportsValid(k.support)&&readingValid(k.reading)&&codes(k.skipped)&&codes(k.exposed);}
export function validEvidenceUnit(w){return obj(w)&&sourceValid(w.source)&&w.source.lessons.some(l=>l.id===w.lesson)&&fieldsValid(w.drafts)&&list(w.annotations,40,annotationValid)&&list(w.responses,80,attemptValid)&&record(w.firstResponses)&&Object.values(w.firstResponses).every(attemptValid)&&supportsValid(w.support)&&codes(w.skipped)&&codes(w.visited)&&codes(w.exposed)&&readingValid(w.reading)&&(w.annotationDraft===undefined||(obj(w.annotationDraft)&&str(w.annotationDraft.anchor,80)&&['literal','inference','question'].includes(w.annotationDraft.kind)&&str(w.annotationDraft.text,2000)))&&['firstDraft','firstRevision','kept'].every(k=>w[k]===undefined||snapshotValid(w[k]));}
function wrapper(r){return obj(r)&&r.version===1&&str(r.current,80)&&record(r.units);}
export function evidenceVoiceView(state){
 if(!Object.hasOwn(state,'evidenceVoice'))return {status:'missing',work:null,units:[]};
 const r=state.evidenceVoice;if(!wrapper(r))return {status:'unavailable',work:null,units:[]};
 return {status:'ready',work:Object.hasOwn(r.units,r.current)&&validEvidenceUnit(r.units[r.current])?r.units[r.current]:null,units:Object.entries(r.units).map(([key,w])=>({id:key,title:validEvidenceUnit(w)?w.source.title:`Retained earlier record: ${key}`,readable:validEvidenceUnit(w)}))};
}
const result=(ok,error)=>error?{ok,error}:{ok};
function change(state,fn,o={}){
 try{
  if(Object.hasOwn(state,'evidenceVoice')&&!wrapper(state.evidenceVoice))return result(false,'This saved format is retained; this version cannot edit it.');
  const next=copy(state),r=fn(next);if(r?.ok!==true)return r||result(false,'This change is not available.');
  if(!wrapper(next.evidenceVoice)||!recoveryFitsProgressLimits(next)||typeof o.canExport!=='function'||o.canExport(next)!==true)return result(false,'This change could not be kept while keeping your notebook exportable. Your earlier work is unchanged.');
  state.evidenceVoice=next.evidenceVoice;return r;
 }catch{return result(false,'This change could not be kept safely. Your earlier work is unchanged.');}
}
function workChange(state,fn,o){return change(state,s=>{const w=evidenceVoiceView(s).work;return w?fn(w):result(false,'Choose a readable story first.');},o);}
export function startEvidenceVoice(state,key='clock-river',o={}){if(!id(key))return result(false,'Choose a story.');return change(state,s=>{s.evidenceVoice??={version:1,current:'',units:{}};const r=s.evidenceVoice;if(Object.hasOwn(r.units,key)){if(!validEvidenceUnit(r.units[key]))return result(false,'This earlier record is retained and cannot be edited. Choose a new copy.');}else r.units[key]={source:copy(evidenceVoiceSource),lesson:evidenceVoiceSource.lessons[0].id,drafts:{},annotations:[],responses:[],firstResponses:{},support:{},skipped:[],visited:[evidenceVoiceSource.lessons[0].id],exposed:[evidenceVoiceSource.chapters[0].id],reading:'unobserved'};r.current=key;const w=r.units[key];if(o.lesson!==undefined){const l=w.source.lessons.find(l=>l.id===o.lesson);if(!l)return result(false,'That lesson is unavailable.');w.lesson=l.id;if(!w.visited.includes(l.id))w.visited.push(l.id);for(const c of l.chapters)if(!w.exposed.includes(c))w.exposed.push(c);}return result(true);},o);}
export const setEvidenceLesson=(s,key,o={})=>workChange(s,w=>{const l=w.source.lessons.find(l=>l.id===key);if(!l)return result(false,'That saved lesson is unavailable.');w.lesson=key;if(!w.visited.includes(key))w.visited.push(key);for(const c of l.chapters)if(!w.exposed.includes(c))w.exposed.push(c);return result(true);},o);
export const setEvidenceText=(s,key,text,o={})=>workChange(s,w=>{if(!id(key)||!w.source.lessons.some(l=>l.fields.includes(key)))return result(false,'Choose a writing field.');if(!str(text))return result(false,'Keep this field to 8,000 characters. Your visible words are still here; earlier saved words are unchanged.');w.drafts[key]=text;return result(true);},o);
export const annotateEvidence=(s,anchor,kind,text,o={})=>workChange(s,w=>{const p=w.source.chapters.flatMap(c=>c.paragraphs).find(p=>p.id===anchor);if(!p||!['literal','inference','question'].includes(kind))return result(false,'Choose a passage and a note kind.');if(!str(text,2000))return result(false,'Keep this note to 2,000 characters. Your visible note is still here.');if(w.annotations.length>=40)return result(false,'Forty notes are already kept. Your new note is still here; earlier notes are unchanged.');w.annotations.push({anchor,passage:p.text,kind,text});return result(true);},o);
export const answerEvidence=(s,key,choiceId,o={})=>workChange(s,w=>{const q=w.source.questions.find(q=>q.id===key),c=q?.choices.find(c=>c.id===choiceId);if(!q||!c)return result(false,'Choose a response from this question.');if(w.responses.length>=80)return result(false,'Eighty structured attempts are already kept. You can still read, annotate and write.');const a={question:copy(q),choice:c.id,outcome:c.outcome,feedback:c.feedback,helpBefore:copy(w.support[q.lesson]??[]),reading:w.reading,practice:true};w.responses.push(a);if(!Object.hasOwn(w.firstResponses,key))w.firstResponses[key]=copy(a);return {...result(true),attempt:a};},o);
export const supportEvidence=(s,kind,o={})=>workChange(s,w=>{if(!supportKinds.includes(kind))return result(false,'Choose a support.');w.support[w.lesson]??=[];if(!w.support[w.lesson].includes(kind))w.support[w.lesson].push(kind);return result(true);},o);
export const exposeEvidence=(s,ids,o={})=>workChange(s,w=>{if(!Array.isArray(ids)||!ids.every(id=>w.source.chapters.some(c=>c.id===id)))return result(false,'Choose a chapter.');for(const id of ids)if(!w.exposed.includes(id))w.exposed.push(id);return result(true);},o);
export const skipEvidence=(s,o={})=>workChange(s,w=>{if(!w.skipped.includes(w.lesson))w.skipped.push(w.lesson);return result(true);},o);
export const setEvidenceReading=(s,value,o={})=>workChange(s,w=>{if(!readingValid(value))return result(false,'Choose a reading report.');w.reading=value;return result(true);},o);
export const keepEvidence=(s,kind,o={})=>workChange(s,w=>{if(!['draft','revision'].includes(kind))return result(false,'Choose a draft or revision.');const k={kind,source:copy(w.source),drafts:copy(w.drafts),annotations:copy(w.annotations),support:copy(w.support),reading:w.reading,skipped:copy(w.skipped),exposed:copy(w.exposed)};if(kind==='draft')w.firstDraft??=copy(k);else w.firstRevision??=copy(k);w.kept=k;return result(true);},o);

export const setEvidenceAnnotationDraft=(s,d,o={})=>workChange(s,w=>{if(!obj(d)||!str(d.anchor,80)||!['literal','inference','question'].includes(d.kind)||!str(d.text,2000))return result(false,'Choose a passage and keep the note to 2,000 characters. Your visible words are still here.');w.annotationDraft=copy(d);return result(true);},o);
