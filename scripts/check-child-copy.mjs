// A bounded source-review aid. It does not parse all runtime prose or inspect saved/user text.
import {readFileSync,realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const copyScopes = [
  {path:'dist/word-list-shelf-ui.mjs',adultBlocks:[{start:'function notesKeeps(',end:'\nexport const wordListShelfEntry',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/word-list-shelf-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/mending-shed-ui.mjs',adultBlocks:[{start:'export function mendingShedNotes(',end:'\nexport function bindMendingShed(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/mending-shed-content.mjs',adultBlocks:[{start:" teaches:'",end:'export const teachCards',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/lost-found-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/lost-found-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/pips-copy-ui.mjs',adultBlocks:[{start:'export function pipsCopyNotes(',end:'\nexport function bindPipsCopy(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/pips-copy-content.mjs',adultBlocks:[{start:'    "adultLine":',end:'    "unavailableSelection":',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/endings-shelf-ui.mjs',adultBlocks:[{start:'export function endingsShelfNotes(',end:'\nexport function bindEndingsShelf(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/endings-shelf-content.mjs',adultBlocks:[{start:'    "adultLine":',end:'    "fiction":',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/stained-map-ui.mjs',adultBlocks:[{start:'export function stainedMapNotes(',end:'\nexport function bindStainedMap(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/stained-map-content.mjs',adultBlocks:[{start:'    "adultLine":',end:'});',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/act-three-ui.mjs',adultBlocks:[{start:'export function actThreeNotes(',end:'\nexport function bindActThree(',reason:'Only used inside Grown-up Keeper notes.'}],quotations:[]},
  {path:'dist/act-three-content.mjs',adultBlocks:[{start:'  "notes": {',end:'\n};',reason:'Only used in Grown-up Keeper notes.'}],quotations:[]},
  {path:'dist/market-signs-ui.mjs', adultBlocks:[{start:'export function marketSignsNotes(',end:'\nexport function bindMarketSigns(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/market-signs-content.mjs', adultBlocks:[{start:' "grownup":',end:'\n "glossary":',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/parcel-labels-ui.mjs', adultBlocks:[
    {start:'function parcelGrownUpNote(', end:'\nexport function parcelLabelsPage(', reason:'Labelled Grown-up practice notes.'},
    {start:'export function parcelLabelsNotes(', end:'\nconst errors =', reason:'Only used in the adult Notes destination.'},
  ], quotations:[]},
  {path:'dist/linear-pathway-ui.mjs', adultBlocks:[
    {start:'function linearGrownUpNote(', end:'\nexport function linearPage(', reason:'Labelled Grown-up practice notes.'},
    {start:'export function linearNotes(', end:'\nexport function bindLinear(', reason:'Only used in the adult Notes destination.'},
  ], quotations:[]},
  {path:'dist/paired-points-ui.mjs', adultBlocks:[
    {start:'export function pairedNotes(', end:'\n }catch{return `<section class="pp-notes">', reason:'Only used in the adult Notes destination.'},
  ], quotations:[]},
  {path:'dist/paired-points-content.mjs', adultBlocks:[
    {start:"grownUp:'", end:'\n});', reason:'Shown only in Grown-up details and notes.'},
  ], quotations:[]},
  {path:'dist/hinge-ui.mjs', adultBlocks:[
    {start:'<details class="hinge-about hinge-grownups">', end:'</details></section>', reason:'For grown-ups panel.'},
  ], quotations:[]},
  {path:'dist/hinge-content.mjs', adultBlocks:[
    {start:'"visit":', end:'export const hingeFrames', reason:'Shown only in the For grown-ups panel.'},
  ], quotations:[]},
  {path:'dist/ribbon-measure-ui.mjs', adultBlocks:[
    {start:'<details><summary>For grown-ups</summary>', end:'</details></section>', reason:'For grown-ups panel.'},
  ], quotations:[]},
  {path:'dist/ribbon-measure-content.mjs', adultBlocks:[
    {start:" grownup:'", end:'\n});', reason:'Shown only in the For grown-ups panel.'},
  ], quotations:[]},
  {path:'dist/lift-yard.mjs', adultBlocks:[
    {start:'<summary>Grown-ups: sources and limits</summary>', end:'</details>`;}', reason:'Grown-ups sources and limits panel.'},
  ], quotations:[]},
  {path:'dist/lift-lever.mjs', adultBlocks:[
    {start:'<summary>Grown-ups: sources and limits</summary>', end:'</details>`;}', reason:'Grown-ups sources and limits panel.'},
  ], quotations:[]},
  {path:'dist/lift-film.mjs', adultBlocks:[], quotations:[]},
  {path:'dist/mill-energy.mjs', adultBlocks:[
    {start:'<summary>Grown-ups: sources and limits</summary>', end:'</details>`;}', reason:'Grown-ups sources and limits panel.'},
  ], quotations:[]},
  {path:'dist/same-ground-ui.mjs', adultBlocks:[
    {start:'<details class="ground-grownups">', end:'</details></section>', reason:'For grown-ups panel.'},
  ], quotations:[]},
  {path:'dist/same-ground-content.mjs', adultBlocks:[
    {start:" visit:'", end:" widthLock:'", reason:'Shown only in the For grown-ups panel.'},
    {start:" grownup:'", end:'export const groundCase=', reason:'Shown only in the For grown-ups panel.'},
  ], quotations:[]},
  {path:'dist/copy-frame-content.mjs', adultBlocks:[
    {start:" grownup:'", end:'});', reason:'Shown only in the For grown-ups panel.'},
  ], quotations:[]},
  {path:'dist/copy-frame-ui.mjs', adultBlocks:[], quotations:[]},
  {path:'dist/ferry-content.mjs', adultBlocks:[
    {start:'"parent": "', end:'"table": "', reason:'Shown only in the For grown-ups panel.'},
  ], quotations:[]},
  {path:'dist/ferry-ui.mjs', adultBlocks:[], quotations:[]},
  {path:'dist/common-cuts-ui.mjs', adultBlocks:[], quotations:[]},
  {path:'dist/common-cuts-content.mjs', adultBlocks:[
    {start:"grownUp:'", end:' exampleLabel:', reason:'Shown only in the For grown-ups panel.'},
  ], quotations:[]},
];
const terms = ['supplied','provenance','recorded as support','supported practice','supported spelling practice','exportable'];
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const blank = s => s.replace(/[^\r\n]/g,' ');
function uniqueAt(text, fragment, label) {
  if(typeof fragment!=='string'||!fragment)throw Error(`${label}: an exact nonempty marker is required`);
  const at=text.indexOf(fragment);
  if(at<0||text.indexOf(fragment,at+1)>=0)throw Error(`${label}: marker is missing or ambiguous`);
  return at;
}
export function scanCopySource(text, {path='fixture',adultBlocks=[],quotations=[]}={}) {
  let visible=text;
  for(const [i,block] of adultBlocks.entries()) {
    if(!block.reason?.trim())throw Error(`adult block ${i}: explain the human classification`);
    const start=uniqueAt(text,block.start,`adult block ${i} start`),end=uniqueAt(text,block.end,`adult block ${i} end`);
    if(end<=start)throw Error(`adult block ${i}: markers are out of order`);
    visible=visible.slice(0,start)+blank(visible.slice(start,end))+visible.slice(end);
  }
  for(const [i,exception] of quotations.entries()) {
    if(!exception.reason?.trim())throw Error(`quotation ${i}: explain the exception`);
    const at=uniqueAt(visible,exception.quote,`quotation ${i}`);
    visible=visible.slice(0,at)+blank(visible.slice(at,at+exception.quote.length))+visible.slice(at+exception.quote.length);
  }
  // Keep offsets/line numbers intact. Only whole comment lines are excluded, not arbitrary code.
  visible=visible.replace(/^[\t ]*\/\/[^\r\n]*/gm,blank);
  const flags=[];
  for(const term of terms) {
    const pattern=new RegExp(`(?<![\\p{L}\\p{N}_])${term.split(' ').map(escape).join('\\s+')}(?![\\p{L}\\p{N}_])`,'giu');
    for(const match of visible.matchAll(pattern))flags.push({path,line:text.slice(0,match.index).split('\n').length,term,
      excerpt:text.slice(Math.max(0,match.index-45),match.index+match[0].length+65).replace(/\s+/g,' ')});
  }
  return flags.sort((a,b)=>a.line-b.line||a.term.localeCompare(b.term));
}
export function inspectChildCopy(root=fileURLToPath(new URL('../',import.meta.url))) {
  const flags=[],configurationErrors=[];
  for(const scope of copyScopes) {
    try { flags.push(...scanCopySource(readFileSync(resolve(root,scope.path),'utf8'),scope)); }
    catch(error) { configurationErrors.push({path:scope.path,message:error.message}); }
  }
  return {ok:!flags.length&&!configurationErrors.length,scope:'Named source files only; not a runtime or whole-app readability proof.',
    files:copyScopes.map(x=>x.path),flags,configurationErrors};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===realpathSync(resolve(process.argv[1]))) {
  const result=inspectChildCopy();
  if(process.argv.includes('--json'))console.log(JSON.stringify(result,null,2));
  else {
    for(const issue of result.configurationErrors)console.error(`${issue.path}: ${issue.message}`);
    for(const flag of result.flags)console.log(`${flag.path}:${flag.line}: ${flag.term}: ${flag.excerpt}`);
    console.log(`Child-copy source check: ${result.files.length} source files, ${result.flags.length} review candidates. ${result.scope}`);
  }
  process.exitCode=result.ok?0:1;
}
