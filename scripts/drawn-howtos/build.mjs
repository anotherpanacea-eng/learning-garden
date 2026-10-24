// Authoring-time builder for drawn how-tos. Run `npm ci` here once, then
// `node scripts/drawn-howtos/build.mjs` to rewrite dist/drawn-howtos-art.mjs, or add `--check`.
// Pele lays out each flowchart; a ring is placed on an ellipse here. Every shape is then redrawn as
// seeded pencil strokes and every label as Hershey single-stroke letters, so the game ships only path data.
import {render} from 'pele';
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {drawnHowtos} from '../../dist/drawn-howtos-content.mjs';

const here=path.dirname(fileURLToPath(import.meta.url)),out=path.join(here,'../../dist/drawn-howtos-art.mjs');
const glyphs=createRequire(import.meta.url)('hersheytext/hersheytext.json').futural.chars;
const SIZE=24,CAP=21,BASE=22,SPACE=12,LINE=1.25;
const scale=size=>size*.68/CAP;
const glyph=c=>c===' '?null:glyphs[c.charCodeAt(0)-33];
const advance=c=>c===' '?SPACE:glyph(c)?.o*2??SPACE;
// Pele sizes boxes with this, so they fit the letters actually drawn.
const measurer={width:(text,size)=>[...text].reduce((w,c)=>w+advance(c),0)*scale(size)};
for(const h of drawnHowtos)for(const c of JSON.stringify(h.steps.map(s=>s.caption))+h.mermaid+JSON.stringify(h.ring))if(c>' '&&c<='~'&&!glyph(c))throw new Error(`No single-stroke letter for ${c}`);

// Seeded noise, so a rebuild is byte-identical.
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const hash=s=>[...s].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);
const r1=n=>Math.round(n*10)/10;

// Parse Pele's absolute M/L/C path data into polylines.
function polylines(d){const out=[];let cur=null,pen=[0,0];const nums=s=>s.trim().split(/[\s,]+/).filter(Boolean).map(Number);
 for(const [,cmd,args] of d.matchAll(/([MLC])([^MLC]*)/g)){const v=nums(args);
  if(cmd==='M'){cur=[[v[0],v[1]]];out.push(cur);pen=[v[0],v[1]];for(let i=2;i<v.length;i+=2){cur.push([v[i],v[i+1]]);pen=[v[i],v[i+1]];}}
  else if(cmd==='L')for(let i=0;i<v.length;i+=2){cur.push([v[i],v[i+1]]);pen=[v[i],v[i+1]];}
  else for(let i=0;i<v.length;i+=6){const [p0,c1,c2,p]=[pen,[v[i],v[i+1]],[v[i+2],v[i+3]],[v[i+4],v[i+5]]];for(let k=1;k<=12;k++){const t=k/12,u=1-t;cur.push([0,1].map(j=>u*u*u*p0[j]+3*u*u*t*c1[j]+3*u*t*t*c2[j]+t*t*t*p[j]));}pen=p;}}
 return out;}
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const length=lines=>lines.reduce((n,l)=>n+l.slice(1).reduce((m,p,i)=>m+dist(p,l[i]),0),0);
// A pencil line: resample, wobble gently sideways and overshoot the ends a little.
function pencil(line,rand,wobble=.9,over=1.6){const pts=[];for(let i=1;i<line.length;i++){const [a,b]=[line[i-1],line[i]],n=Math.max(1,Math.ceil(dist(a,b)/7));for(let k=i===1?0:1;k<=n;k++)pts.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}
 if(pts.length<2)return pts;let phase=rand()*6.28;const f=.05+rand()*.05;
 const moved=pts.map((p,i)=>{const q=pts[Math.min(i+1,pts.length-1)],o=pts[Math.max(i-1,0)],dx=q[0]-o[0],dy=q[1]-o[1],m=Math.hypot(dx,dy)||1,w=Math.sin(phase+i*7*f)*wobble*(.6+rand()*.4);return [p[0]-dy/m*w,p[1]+dx/m*w];});
 const ext=(a,b)=>{const m=dist(a,b)||1;return [a[0]+(a[0]-b[0])/m*over,a[1]+(a[1]-b[1])/m*over];};
 return [ext(moved[0],moved[1]),...moved,ext(moved.at(-1),moved.at(-2))];}
const pathOf=lines=>lines.filter(l=>l.length>1).map(l=>'M'+l.map(p=>`${r1(p[0])} ${r1(p[1])}`).join('L')).join('');
const stroke=(kind,lines)=>{const ls=lines.filter(l=>l.length>1);return [kind,pathOf(ls),Math.ceil(length(ls))];};

// Hershey letters, centered on x with the baseline at y. A small wobble keeps them hand-made but legible.
function letters(text,x,y,size,rand){const s=scale(size),w=measurer.width(text,size);let left=x-w/2;const lines=[];
 for(const c of text){const g=glyph(c);if(g)for(const part of g.d.split('M').filter(Boolean)){const pts=part.replace('L',' ').trim().split(/\s+/).map(p=>p.split(',').map(Number));lines.push(pts.map(([gx,gy])=>[left+gx*s+(rand()-.5)*.35,y+(gy-BASE)*s+(rand()-.5)*.35]));}left+=advance(c)*s;}
 return lines;}
const labelLines=(rows,x,y,size,rand)=>rows.flatMap((row,i)=>letters(row,x,y+(i-(rows.length-1)/2)*size*LINE+size*.34,size,rand));

// Shapes as closed outlines (drawn) and as plain fills (the colored-pencil wash).
const rectPts=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];
function stadiumPts(x,y,w,h){const r=h/2,pts=[];for(let k=0;k<=12;k++){const a=-Math.PI/2+Math.PI*k/12;pts.push([x+w-r+Math.cos(a)*r,y+r+Math.sin(a)*r]);}for(let k=0;k<=12;k++){const a=Math.PI/2+Math.PI*k/12;pts.push([x+r+Math.cos(a)*r,y+r+Math.sin(a)*r]);}pts.push(pts[0]);return pts;}
const wash=(tone,pts)=>['w'+tone,'M'+pts.map(p=>`${r1(p[0])} ${r1(p[1])}`).join('L')+'Z',0];
// An arrowhead as two short pencil strokes back from the tip.
function head(tip,from,rand,size=11){const m=dist(tip,from)||1,ux=(tip[0]-from[0])/m,uy=(tip[1]-from[1])/m;return [-1,1].map(side=>pencil([[tip[0]-ux*size-uy*side*size*.55,tip[1]-uy*size+ux*side*size*.55],tip],rand,.3,.6));}

function nodeParts(id,shape,box,rows,rand,tone='n'){const pts=shape==='stadium'?stadiumPts(...box):rectPts(...box);
 return [wash(tone,pts),stroke('l',[pencil(pts,rand,.7,3)]),stroke('t',labelLines(rows,box[0]+box[2]/2,box[1]+box[3]/2,SIZE,rand))];}

function fromPele(h){const {svg}=render(h.mermaid,{fontSize:SIZE,measurer,maxWidth:340,config:{flowchart:{wrappingWidth:400,nodeSpacing:24,rankSpacing:44}}}),parts={},rand=rng(hash(h.id));
 const [,vw,vh]=svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
 for(const [,id,tx,ty,body] of svg.matchAll(/<g class="pele-node pele-shape-(?:rect|stadium)" data-id="([^"]+)" transform="translate\(([\d.]+),([\d.]+)\)">(.*?)<\/g>/g)){
  const [,x,y,w,hh]=body.match(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/),stadium=/ rx="/.test(body.match(/<rect[^>]*>/)[0]);
  const rows=[...body.matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)].map(m=>m[1]);if(!rows.length)rows.push(body.match(/<text[^>]*>([^<]*)<\/text>/)[1]);
  parts[id]=nodeParts(id,stadium?'stadium':'rect',[+tx+ +x,+ty+ +y,+w,+hh],rows.map(unescape),rand,stadium?'e':'n');}
 for(const [,id,body,marker] of svg.matchAll(/<g class="pele-edge[^"]*" data-id="([^"]+)">(<path d="[^"]+"[^>]*\/>)<path class="pele-marker" d="([^"]+)"/g)){
  const d=body.match(/d="([^"]+)"/)[1],dashed=/stroke-dasharray/.test(body),line=polylines(d)[0],tip=polylines(marker)[0][0];
  const drawn=dashed?dashes(line):[pencil(line,rand)];parts[id]=[stroke('l',[...drawn,...head(tip,line.at(-1),rand)])];}
 for(const [,id,x,y,w,hh,text] of svg.matchAll(/<g class="pele-edge-label" data-id="([^"]+)"><rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"[^>]*\/><text[^>]*>([^<]*)<\/text>/g))
  parts[id].push(['bg','M'+rectPts(+x,+y,+w,+hh).map(p=>`${r1(p[0])} ${r1(p[1])}`).join('L')+'Z',0],stroke('t',labelLines([unescape(text)],+x+ +w/2,+y+ +hh/2,SIZE,rand)));
 return {width:Math.ceil(+vw),height:Math.ceil(+vh),parts};}
const unescape=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function dashes(line){const pts=pencil(line,()=>.5,0,0),out=[];let run=[pts[0]],on=true,acc=0;for(let i=1;i<pts.length;i++){acc+=dist(pts[i],pts[i-1]);if(on)run.push(pts[i]);if(acc>=(on?7:6)){if(on)out.push(run);on=!on;acc=0;run=[pts[i]];}}if(on&&run.length>1)out.push(run);return out;}

// The life ring: stages on an upright ellipse, arrows following it, each arrow's label inside the ring in its quarter.
function ring(h){const rand=rng(hash(h.id)),parts={},{stages,links}=h.ring,rx=104,ry=168,pad=12,small=SIZE*.8;
 const boxes=stages.map(([id,label],i)=>{const a=-Math.PI/2+i*Math.PI*2/stages.length;return {id,label,a,w:measurer.width(label,SIZE)+30,h:SIZE*1.8,cx:Math.cos(a)*rx,cy:Math.sin(a)*ry};});
 const minX=Math.min(...boxes.map(b=>b.cx-b.w/2))-pad,minY=Math.min(...boxes.map(b=>b.cy-b.h/2))-pad,ox=-minX,oy=-minY;
 const at=(a,k=1)=>[ox+Math.cos(a)*rx*k,oy+Math.sin(a)*ry*k],inside=(b,p)=>Math.abs(p[0]-ox-b.cx)<=b.w/2+7&&Math.abs(p[1]-oy-b.cy)<=b.h/2+7;
 for(const b of boxes)parts[b.id]=nodeParts(b.id,'stadium',[ox+b.cx-b.w/2,oy+b.cy-b.h/2,b.w,b.h],[b.label],rand,'e');
 const lap=[];
 for(const [id,from,to,label] of links){const A=boxes.find(b=>b.id===from),B=boxes.find(b=>b.id===to);let a0=A.a,a1=B.a<=A.a?B.a+Math.PI*2:B.a;
  while(inside(A,at(a0)))a0+=.005;while(inside(B,at(a1)))a1-=.005;const arc=[],inner=[];for(let k=0;k<=40;k++){arc.push(at(a0+(a1-a0)*k/40));inner.push(at(a0+(a1-a0)*k/40,.9));}
  const mid=(a0+a1)/2,lp=[ox+Math.sign(Math.cos(mid))*rx*.4,oy+Math.sign(Math.sin(mid))*ry*.45];
  parts[id]=[stroke('l',[pencil(arc,rand),...head(arc.at(-1),arc.at(-4),rand)]),stroke('t',labelLines(measurer.width(label,small)>rx*.75?label.split(' '):[label],lp[0],lp[1],small,rand))];
  lap.push(pencil(inner,rand,.8,0),...head(inner.at(-1),inner.at(-4),rand,9));}
 parts.lap=[stroke('a',lap)];
 const maxX=Math.max(...boxes.map(b=>ox+b.cx+b.w/2))+pad,maxY=Math.max(...boxes.map(b=>oy+b.cy+b.h/2))+pad;
 return {width:Math.ceil(maxX),height:Math.ceil(maxY),parts};}

const art={};
for(const h of drawnHowtos){const {width,height,parts}=h.ring?ring(h):fromPele(h),used=h.steps.flatMap(s=>s.draws);
 for(const id of used)if(!parts[id])throw new Error(`${h.id}: step draws unknown ${id}`);
 for(const id of Object.keys(parts))if(!used.includes(id))throw new Error(`${h.id}: ${id} is never drawn`);
 art[h.id]={version:1,width,height,steps:h.steps.map(s=>s.draws.flatMap(id=>parts[id]))};}
const text=`// Generated by scripts/drawn-howtos/build.mjs from drawn-howtos-content.mjs. Do not edit by hand.
// Layout: Pele 1.10.0 (MIT). Letters: Hershey futural via hersheytext 2.0.0 (see NOTICE).
// Each stroke is [kind, path, length]: l pencil line, t letters, a accent, w? colored wash, bg label paper.
export const drawnArt=${JSON.stringify(art)};
`;
if(process.argv.includes('--check')){const now=await readFile(out,'utf8').catch(()=>'');if(now!==text){console.error('dist/drawn-howtos-art.mjs is out of date. Run node scripts/drawn-howtos/build.mjs');process.exit(1);}console.log('Drawn how-to art matches its source.');}
else{await writeFile(out,text);console.log(`Wrote ${path.relative(process.cwd(),out)}: ${(text.length/1024).toFixed(1)} KiB, ${drawnHowtos.length} drawings.`);}
