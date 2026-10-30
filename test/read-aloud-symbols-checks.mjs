// Button and link labels read cleanly aloud (roadmap lane A, step 4). A bounded source scan: an arrow
// or tick glyph at the start or end of a button or link label sits in an aria-hidden span, so a
// screen reader says "Back to the garden" rather than "left arrow Back to the garden".
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const glyph='[\u2190\u2192\u2197\u2713]';
// Inspect complete controls, including nested label spans. Do not skip a whole
// control merely because it contains an unrelated hidden drawing or icon.
const controls=/<(a|button)\b[^<>]*>[\s\S]*?<\/\1>/g;
const hidden=/<span\b[^>]*\baria-hidden=["']true["'][^>]*>[\s\S]*?<\/span>/g;
const edge=new RegExp(`^\\s*${glyph}|${glyph}\\s*$|\\u2713`);
const helper=new RegExp('\\bbutton\\([^,\\n]*,\\s*([\'"`])([^\\n]*?)\\1','g');
export function spokenGlyphs(text,path='fixture'){
  const flags=[];
  const flag=m=>flags.push(`${path}:${text.slice(0,m.index).split('\n').length}: ${m[0]}`);
  for(const m of text.matchAll(controls)){
    const label=m[0].replace(/^<[^>]+>|<\/[^>]+>$/g,'').replace(hidden,'').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/g,'').replace(/<[^>]*>/g,'');
    if(edge.test(label))flag(m);
  }
  for(const m of text.matchAll(helper))if(edge.test(m[2].replace(hidden,'').replace(/<[^>]*>/g,'')))flag(m);
  return flags;
}

assert.equal(spokenGlyphs('<a href="#home" class="back">← Back to the garden</a>').length,1,'bare leading arrow is flagged');
assert.equal(spokenGlyphs('<button data-x="1">Next stop →</button>').length,1,'bare trailing arrow is flagged');
assert.equal(spokenGlyphs("button('out','← Energy out',false)").length,1,'helper label is flagged');
assert.deepEqual(spokenGlyphs('<a class="back"><span aria-hidden="true">←</span> Back</a>'),[],'hidden glyph passes');
assert.deepEqual(spokenGlyphs('<text x="55">← 4 N</text><p>food → eater</p>'),[],'arrows in drawings and prose are left alone');

const dist=fileURLToPath(new URL('../dist/',import.meta.url));
for(const label of [' <span>\u2190 Back</span>','<span>Back \u2192 </span>','<svg aria-hidden="true"></svg>\u2190 Back','<span>\u2713 Chosen</span>'])
  assert.equal(spokenGlyphs(`<button>${label}</button>`).length,1,'nested or spaced bare glyph is flagged');
assert.deepEqual(spokenGlyphs('<button><span aria-hidden="true">\u2713</span> Chosen</button>'),[]);
assert.deepEqual(spokenGlyphs('<button><svg><text>\u2190 4 N</text></svg>Model</button>'),[],'meaningful drawing is preserved');
assert.equal(spokenGlyphs('<button><svg><text>\u2190 4 N</text></svg>\u2190 Back</button>').length,1,'drawing does not exempt the label');
assert.deepEqual(spokenGlyphs('<button>food \u2192 eater</button>'),[],'meaningful internal arrow remains');
assert.equal(spokenGlyphs('button("out","\u2190 energy out")').length,1,'double quoted lowercase helper');
const flags=readdirSync(dist).filter(f=>f.endsWith('.mjs')).flatMap(f=>spokenGlyphs(readFileSync(dist+f,'utf8'),f));
assert.deepEqual(flags,[],'glyphs read aloud in labels:\n'+flags.join('\n'));

// Exercise shared visit renderers: French titles must not lend their language
// to surrounding English controls, headings, or the saved notebook itself.
const {freshState}=await import('../dist/core.mjs');
const {ensureGarden,startVisit,storyDraft,currentVisit,finishStoryNode}=await import('../dist/garden-core.mjs');
const {storyHub,storyPage,storyEnding,frenchLanding}=await import('../dist/garden-ui.mjs');
const state=freshState();ensureGarden(state);startVisit(state,'french-bookstall');
storyDraft(state);let saved=JSON.stringify(state);
assert.match(storyHub(state),/<strong><span lang="fr">Paris en fran[^<]+<\/span><\/strong>/);
assert.match(storyHub(state),/<h2>Explore <span lang="fr">Paris en fran[^<]+<\/span><\/h2>/);
assert.match(storyPage(state,storyDraft(state)),/<h1 lang="fr">Paris en fran[^<]+<\/h1>/);
assert.match(storyPage(state,storyDraft(state)),/<p><span lang="fr">Paris en fran[^<]+<\/span><\/p>/);
assert.match(storyPage(state,storyDraft(state)),/<h2>Find the bag<\/h2>/,'English task title stays English');
assert.match(frenchLanding(state),/Continue <span lang="fr">Paris en fran[^<]+<\/span><\/button>/);
assert.equal(JSON.stringify(state),saved,'language rendering does not rewrite saved work');
finishStoryNode(state,true);finishStoryNode(state,true);
assert.match(storyPage(state,storyDraft(state)),/<h2 lang="fr">Une carte pour le jardin<\/h2>/);
finishStoryNode(state);saved=JSON.stringify(state);
assert.ok(currentVisit(state).finished);
assert.match(storyEnding(state),/<h2 lang="fr">Une petite pause [^<]+<\/h2>/);
assert.equal(JSON.stringify(state),saved,'ending language rendering preserves saved work');
console.log('read-aloud symbol and French language checks passed');
