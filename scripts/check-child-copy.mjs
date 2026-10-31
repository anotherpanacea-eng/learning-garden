// A bounded source-review aid. It does not parse all runtime prose or inspect saved/user text.
import {readFileSync,realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const copyScopes = [
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
