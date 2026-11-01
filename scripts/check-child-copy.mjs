// A bounded source-review aid. It does not parse all runtime prose or inspect saved/user text.
import {readFileSync,realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const copyScopes = [
  {path:'dist/beat-bench-ui.mjs',adultBlocks:[{start:'function notesCases(',end:'\nexport const beatBenchEntry',reason:'Only used in Grown-up notes; child helpers remain in scope.'}],quotations:[]},
  {path:'dist/beat-bench-content.mjs',adultBlocks:[{start:'  "grownup":',end:'\n});',reason:'Only displayed in Grown-up notes.'}],quotations:[]},
  {path:'dist/long-word-workshop-ui.mjs',adultBlocks:[{start:'export function longWordNotes(',end:'\nexport const longWordEntry',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/long-word-workshop-content.mjs',adultBlocks:[{start:'export const LONG_WORD_GROWN_UP',end:'\n]);',reason:'Grown-up interpretation and limits, used only in Notes.'}],quotations:[]},
  {path:'dist/word-list-shelf-ui.mjs',adultBlocks:[{start:'function notesKeeps(',end:'\nexport const wordListShelfEntry',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/word-list-shelf-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/mending-shed-ui.mjs',adultBlocks:[{start:'export function mendingShedNotes(',end:'\nexport function bindMendingShed(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/mending-shed-content.mjs',adultBlocks:[{start:" teaches:'",end:'export const teachCards',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/lost-found-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/lost-found-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/design-table-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/design-table-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/pips-copy-ui.mjs',adultBlocks:[{start:'export function pipsCopyNotes(',end:'\nexport function bindPipsCopy(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/pips-copy-content.mjs',adultBlocks:[{start:'    "adultLine":',end:'    "unavailableSelection":',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/endings-shelf-ui.mjs',adultBlocks:[{start:'export function endingsShelfNotes(',end:'\nexport function bindEndingsShelf(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/endings-shelf-content.mjs',adultBlocks:[{start:'    "adultLine":',end:'    "fiction":',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/stained-map-ui.mjs',adultBlocks:[{start:'export function stainedMapNotes(',end:'\nexport function bindStainedMap(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/stained-map-content.mjs',adultBlocks:[{start:'    "adultLine":',end:'});',reason:'Shown only in For grown-ups and Notes.'}],quotations:[]},
  {path:'dist/sky-notes-ui.mjs', adultBlocks:[{start:'export function skyNotesNotes(',end:'// End of the Grown-up notes section.',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/sky-notes-content.mjs', adultBlocks:[{start:'export const SKY_GROWNUP=',end:'// End of the grown-up copy.',reason:'Shown only in Grown-up notes.'}],quotations:[]},
  {path:'dist/act-three-ui.mjs',adultBlocks:[{start:'export function actThreeNotes(',end:'\nexport function bindActThree(',reason:'Only used inside Grown-up Keeper notes.'}],quotations:[]},
  {path:'dist/act-three-content.mjs',adultBlocks:[{start:'  "notes": {',end:'\n};',reason:'Only used in Grown-up Keeper notes.'}],quotations:[]},
  {path:'dist/market-signs-ui.mjs', adultBlocks:[
    {start:'function patternNotes(',end:'\nfunction crateSummary(',reason:'Only used in Grown-up notes.'},
    {start:'function crateNotes(',end:'\nconst guideWords=',reason:'Only used in Grown-up notes.'},
    {start:'function endingNotes(',end:'\nexport function bindMarketSigns(',reason:'Only used in Grown-up notes.'},
  ],quotations:[]},
  {path:'dist/market-signs-content.mjs', adultBlocks:[
    {start:' "grownup": "This room explores',end:'\n "glossary":',reason:'Shown only in For grown-ups and Notes.'},
    {start:'  "grownup": "This bench explores',end:'export const marketEndingCopy=Object.freeze({',reason:'Shown only in the ending For grown-ups panel.'},
    {start:'  "grownup": "This is guided written-pattern',end:'export const marketPatternCopy=Object.freeze({',reason:'Shown only in the Pattern Stall For grown-ups panel.'},
    {start:'  "grownup": "This collection offers printed spelling',end:'export const marketCrateCopy=Object.freeze({',reason:'Shown only in the Word-List Crate For grown-ups panel.'},
  ],quotations:[]},
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
  // Shell, garden home, help, progress and Number Garden renderers (text review 2026-10-22, shell-garden area).
  {path:'dist/app.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/garden-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/plantings.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/help-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/help-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/companions.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/explorer-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/learning-connections.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/learning-connections-ui.mjs',adultBlocks:[
    {start:'export function connectionNotes(',end:'\nexport function bindConnections(',reason:'Only used in Grown-up notes.'},
  ],quotations:[
    {quote:'Retries, recorded support or a previously supplied result invite the same relationship',reason:'Inside the Grown-ups: how the connection is chosen panel.'},
  ]},
  {path:'dist/learning-journeys.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/index.html',adultBlocks:[],quotations:[]},
  {path:'dist/storm-intro.html',adultBlocks:[],quotations:[]},
  {path:'dist/learning-invitations.mjs',adultBlocks:[],quotations:[
    {quote:'Some English Paris tasks select a sentence supporting a supplied idea; independent composition is unobserved.',reason:'A topic scope note, shown only in Grown-ups learning connections and the parent-facing explore map.'},
  ]},
  {path:'dist/orchard-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/living-ui.mjs',adultBlocks:[
    {start:'export function livingNotes(',end:'\nexport function bindLiving(',reason:'Only used in Grown-up notes.'},
  ],quotations:[
    {quote:'Compare supplied picture clues and use them to explain a possible shelter',reason:'Inside the Grown-ups: what this visit explores panel.'},
  ]},
  {path:'dist/living-spiral-ui.mjs',adultBlocks:[
    {start:'function parentInfo(',end:'\nexport function spiralPage(',reason:'The Grown-ups: a spiral of ideas panel.'},
    {start:'export function spiralNotes(',end:'\nexport function bindSpiral(',reason:'Only used in Grown-up notes.'},
  ],quotations:[]},
  {path:'dist/living-adaptive-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/play-media.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/progress-transfer-ui.mjs',adultBlocks:[],quotations:[]},
  // Science renderers (text review 2026-10-22, science area). Art, audio and core modules carry captions, feedback and status text too; only living-core, living-spiral-core, plant-study-core and science-core hold no copy.
  {path:'dist/bell-studio-ui.mjs',adultBlocks:[],quotations:[
    {quote:'This is practice with a supplied model, not a hearing test.',reason:'Inside the For grown-ups panel.'},
  ]},
  {path:'dist/field-notebook-ui.mjs',adultBlocks:[],quotations:[
    {quote:"?'kept-in-plant-study':'supplied-model'",reason:'A stored origin code. Children see Model row; the raw code shows only in Grown-up notes.'},
  ]},
  {path:'dist/plant-study-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-notebook-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-paths-ui.mjs',adultBlocks:[],quotations:[
    {quote:"'Supplied-control practice'",reason:'Inside the For grown-ups panel.'},
  ]},
  {path:'dist/science-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/workshop-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/notebook-sections.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/bell-studio-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/field-notebook-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/living-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/living-spiral-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/living-adaptive-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/plant-study-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-notebook-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-paths-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/science-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/bell-studio-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/bell-studio-audio.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/bell-studio-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/field-notebook-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/field-notebook-core.mjs',adultBlocks:[],quotations:[
    {quote:"ORIGINS=['kept-in-plant-study','supplied-model']",reason:'Stored origin codes, not copy.'},
    {quote:"origin='supplied-model'",reason:'A stored origin code default, not copy.'},
  ]},
  {path:'dist/living-adaptive-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/plant-study-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-notebook-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-notebook-bridge.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-notebook-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-paths-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rain-paths-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/workshop-core.mjs',adultBlocks:[],quotations:[]},
  // Math-games renderers (text review 2026-10-22, math-games area), including art and core modules that carry copy.
  {path:'dist/broad-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/broad-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/broad-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/broad-help.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/broad-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/broad-variants.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/equal-groups-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/equal-groups-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/equal-groups-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/facts-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/facts-ui.mjs',adultBlocks:[],quotations:[
    {quote:'Opening the picture is recorded as support, even if it is closed or counted again.',reason:'Inside the For grown-ups panel.'},
    {quote:'The shown answer and explanation stay recorded as support.',reason:'Inside the For grown-ups panel.'},
  ]},
  {path:'dist/forage-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/forage-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/bramble-film.html',adultBlocks:[],quotations:[]},
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
// A code property access (`w.provenance`, `w?.provenance`) or a bare object key (`{supplied:`, `,provenance:`)
// is an identifier, not copy. Lexical only: prose candidates with a space before or no colon after stay flagged.
function codeIdentifier(text, at, length) {
  if(/\??\.$/.test(text.slice(Math.max(0,at-2),at)))return true;
  return /[{,]\s*$/.test(text.slice(Math.max(0,at-40),at))&&/^\s*:/.test(text.slice(at+length,at+length+8));
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
    for(const match of visible.matchAll(pattern)) {
      if(codeIdentifier(visible,match.index,match[0].length))continue;
      flags.push({path,line:text.slice(0,match.index).split('\n').length,term,
      excerpt:text.slice(Math.max(0,match.index-45),match.index+match[0].length+65).replace(/\s+/g,' ')});
    }
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
