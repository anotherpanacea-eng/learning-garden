// Drawn how-to content, generated pictures and playback rules. Synthetic only; nothing here reads a notebook.
import assert from 'node:assert/strict';
import {readdir} from 'node:fs/promises';
import {drawnHowtos,drawnHowto,howtoForPage} from '../dist/drawn-howtos-content.mjs';
import {howtoNext,drawnHowtoTag,stepMs,loadArt} from '../dist/drawn-howto.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};

const drawnArt={};for(const h of drawnHowtos)drawnArt[h.id]=await loadArt(h.id);
ok(drawnHowtos.length>=80,'a how-to for every activity');eq(new Set(drawnHowtos.map(h=>h.id)).size,drawnHowtos.length,'how-to ids are unique');
eq((await readdir(new URL('../dist/drawn-howtos/',import.meta.url))).sort(),drawnHowtos.map(h=>`${h.id}.mjs`).sort(),'every how-to has generated art and no orphan art remains');
// Each page offers at most one how-to, and the three hand-placed ones are not offered again by the page heading.
const pages=drawnHowtos.flatMap(h=>h.at||[]);eq(new Set(pages).size,pages.length,'no page is claimed twice');
for(const page of pages.map(p=>p.replace('/*','/example')))eq(howtoForPage('#'+page)?.at.includes(page)||howtoForPage('#'+page)?.at.some(a=>a.endsWith('/*')&&page.startsWith(a.slice(0,-1))),true,`#${page} finds its own how-to`);
eq(['life-ring','shutters-play','rows-play'].map(id=>drawnHowto(id).at),[undefined,undefined,undefined],'hand-placed how-tos are not offered by page');
eq([howtoForPage('#orchard/games/rows'),howtoForPage('#home'),howtoForPage('#cafe/nowhere')],[null,null,null],'pages without a how-to get none');
eq(howtoForPage('#orchard/gather/dew-drop').id,'orchard-gather','a page family shares one how-to');
for(const h of drawnHowtos){const a=drawnArt[h.id];
 ok(h.steps.length>=1&&h.steps.length<=6,`${h.id}: one to six steps`);
 for(const s of h.steps){ok(s.caption.split(/\s+/).length<=15,`${h.id}: caption of 15 words or fewer: ${s.caption}`);ok(!/[—]/.test(s.caption),`${h.id}: plain punctuation`);}
 if(h.chain)for(const [box] of h.chain)ok(box.split('<br>').every(line=>line.length<=20),`${h.id}: short box lines: ${box}`);
 ok(h.alt.length>40&&h.title&&h.button,`${h.id}: accessible picture text, panel name and button`);
 eq(a.steps.length,h.steps.length,`${h.id}: one picture step per caption`);
 const ids=h.steps.flatMap(s=>s.draws);eq(new Set(ids).size,ids.length,`${h.id}: each part is drawn exactly once`);
 ok(a.width>0&&a.width<=500&&a.height>0,`${h.id}: a narrow picture that can stay legible on phones`);
 a.steps.forEach((strokes,i)=>{ok(strokes.some(([k,,len])=>['l','t','a'].includes(k)&&len>0),`${h.id} step ${i+1} draws something`);
  for(const [k,d,len] of strokes){ok(['l','t','a','wn','we','bg'].includes(k),`${h.id}: known stroke kind ${k}`);ok(/^M[-\d. LMZ]+$/.test(d),`${h.id}: plain move/line path data`);ok(k[0]==='w'||k==='bg'?len===0:len>0,`${h.id}: lengths only on pencil strokes`);}});
 eq(drawnHowtoTag(h.id),`<drawn-howto data-how="${h.id}"></drawn-howto>`,`${h.id}: page tag`);
 const total=a.steps.reduce((t,s)=>t+stepMs(s),0)+(a.steps.length-1)*650;ok(total<=15000,`${h.id}: the play-through lasts at most 15 seconds (${total} ms)`);}
eq(drawnHowtoTag('missing'),'','unknown how-to renders nothing');eq(drawnHowto('missing'),null,'unknown how-to has no source');

// Playback: plays once on open, stops on the finished last step, and Back/Next/Pause hand control to the child.
const play=(s,count,steps=[])=>{for(const a of steps)s=howtoNext(s,a,count);return s;};
let s=howtoNext({},'open',3);eq(s,{step:0,playing:true,drawn:false,reduced:false},'opening starts playback at step one');
s=play(s,3,['drawn','advance','drawn','advance','drawn']);eq(s,{step:2,playing:false,drawn:true,reduced:false},'playback stops after the last step is drawn');
eq(howtoNext(s,'advance',3),s,'no step after the last');eq(howtoNext(s,'play',3),s,'Play does nothing on the finished last step');eq(howtoNext(s,'next',3),s,'Next stays on the finished last step');
s=howtoNext(s,'back',3);eq(s,{step:1,playing:false,drawn:true,reduced:false},'Back shows the earlier step whole');
s=howtoNext(s,'next',3);eq(s,{step:2,playing:false,drawn:false,reduced:false},'Next draws the following step without resuming play');
s=play(howtoNext({},'open',4),4,['pause']);eq(s.playing,false,'Pause stops playback');eq(howtoNext(s,'advance',4),s,'a paused drawing does not advance');
s=howtoNext(s,'play',4);eq(s,{step:0,playing:true,drawn:false,reduced:false},'Play resumes an unfinished step where it is');
s=play(s,4,['drawn','pause','play']);eq(s,{step:1,playing:true,drawn:false,reduced:false},'Play after a finished step continues with the next one');
s=play(howtoNext({},'open',4),4,['drawn','advance','next']);eq([s.step,s.playing],[2,false],'Next during playback pauses it');
eq(howtoNext({reduced:true},'open',3),{step:0,playing:false,drawn:true,reduced:true},'reduced motion opens on a complete first step and does not play');
eq(howtoNext({step:1,playing:false,drawn:true,reduced:true},'next',3),{step:2,playing:false,drawn:true,reduced:true},'reduced motion steps show complete strokes');
eq(howtoNext({step:2,playing:false,drawn:true,reduced:false},'again',3),{step:0,playing:true,drawn:false,reduced:false},'Watch again plays from step one');
eq(howtoNext({step:0,playing:true,drawn:true,reduced:true},'advance',3).drawn,true,'reduced-motion autoplay keeps later steps complete');
console.log(`Drawn how-tos: ${n} checks passed.`);
