// A bounded source-review aid. It does not parse all runtime prose or inspect saved/user text.
import {readFileSync,realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const copyScopes = [
  {path:'dist/letterpress-content.mjs',adultBlocks:[{start:'export const LETTERPRESS_GROWNUP=',end:'// End of the letterpress grown-up interpretation.',reason:'Only displayed in the folded grown-up interpretation; all child copy remains in scope.'}],quotations:[]},
  {path:'dist/letterpress-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/word-room-trails-content.mjs',adultBlocks:[{start:'export const TRAIL_GROWNUP=',end:'// End of the grown-up interpretation.',reason:'Shown only inside the folded grown-up interpretation; all child material remains in scope.'}],quotations:[]},
  {path:'dist/word-room-trails-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/beat-bench-ui.mjs',adultBlocks:[{start:'function notesCases(',end:'\nexport const beatBenchEntry',reason:'Only used in Grown-up notes; child helpers remain in scope.'}],quotations:[]},
  {path:'dist/beat-bench-content.mjs',adultBlocks:[{start:'  "grownup":',end:'\n});',reason:'Only displayed in Grown-up notes.'}],quotations:[]},
  {path:'dist/ribbon-matches-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/ribbon-matches-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/ribbon-matches-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/ribbon-matches-ui.mjs',adultBlocks:[
    {start:'export function ribbonMatchesNotes(',end:'\nexport function bindRibbonMatches(',reason:'Only used in Grown-up notes; child explanations and feedback remain in scope.'},
  ],quotations:[]},
  {path:'dist/word-room-sounds-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/word-room-sounds-content.mjs',adultBlocks:[],quotations:[
    {quote:"'adult-supplied'",reason:'Stored passage-token role code, not child-facing copy; the passage displays its word, not this code.'},
  ]},
  {path:'dist/long-word-workshop-ui.mjs',adultBlocks:[{start:'export function longWordNotes(',end:'\nexport const longWordEntry',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/long-word-workshop-content.mjs',adultBlocks:[{start:'export const LONG_WORD_GROWN_UP',end:'\n]);',reason:'Grown-up interpretation and limits, used only in Notes.'}],quotations:[]},
  {path:'dist/word-list-shelf-ui.mjs',adultBlocks:[{start:'function notesKeeps(',end:'\nexport const wordListShelfEntry',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/word-list-shelf-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/rod-tray-ui.mjs',adultBlocks:[{start:'const flag=x=>',end:'\nexport function bindRodTray(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/rod-tray-content.mjs',adultBlocks:[{start:" notesHeading:'The Rod Tray',",end:" refused:'",reason:'Shown only in Grown-up notes.'}],quotations:[]},
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
  // Café and kitchen renderers (text review 2026-10-22, cafe-kitchen area), including art and core modules.
  {path:'dist/cafe-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/cafe-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/cafe-film.html',adultBlocks:[],quotations:[]},
  {path:'dist/cafe-start-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/cafe-start-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/cafe-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/measuring-recipes-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/measuring-recipes-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/measuring-recipes-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/measuring-recipes-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/parcel-packing-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/parcel-packing-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/parcel-packing-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/parcel-packing-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/restaurant-story.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/sharing-counter-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/sharing-counter-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/sharing-counter-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/sharing-counter-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/whole-batches-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/whole-batches-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/whole-batches-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/whole-batches-ui.mjs',adultBlocks:[],quotations:[]},
  // Paris archive renderers (text review 2026-10-22, paris-archive area), including the compiled puppet-post pack, film and scene.
  {path:'dist/french-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/french-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/french-library.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/french-story-data.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/paris-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/paris-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/paris-film.html',adultBlocks:[],quotations:[]},
  {path:'dist/paris-library.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/paris-pack-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/paris-scene.svg',adultBlocks:[],quotations:[]},
  {path:'dist/paris-visit-source.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/travelers-archive-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/travelers-archive-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/travelers-archive-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/travelers-archive-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/packs/puppet-post.mjs',adultBlocks:[],quotations:[]},
  // Words, letters, stories, post office and loft (text review 2026-10-22, words-stories area). Flagged lines are adult panels, stored codes and a CSS class.
  {path:'dist/letter-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/letter-trail-core.mjs',adultBlocks:[],quotations:[
    {quote:"!['supplied','human'].includes(x.mode)",reason:'Stored keep-mode codes, not copy.'},
    {quote:"keepLetter(state,place,mode='supplied'){",reason:'A stored keep-mode code default, not copy.'},
    {quote:"if(!['supplied','human'].includes(mode))",reason:'Stored keep-mode codes, not copy.'},
    {quote:"const card=mode==='supplied'?messageCard(x.case,x.work.cardId):null,clue=mode==='supplied'?",reason:'Stored keep-mode codes, not copy.'},
    {quote:"qualifies:mode==='supplied'&&",reason:'A stored keep-mode code, not copy.'},
    {quote:"if(mode==='supplied'&&snapshot.fits",reason:'A stored keep-mode code, not copy.'},
  ]},
  {path:'dist/letter-trail-ui.mjs',adultBlocks:[
    {start:'export function letterNotes(',end:"(state.letterTrail,null,2))}</pre>`}</details>`;}",reason:'Only used in Grown-up notes.'},
  ],quotations:[
    {quote:"data-letter-keep=\"${human?'human':'supplied'}\"",reason:'A stored keep-mode code in a data attribute, not copy.'},
  ]},
  {path:'dist/loft-art.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/loft-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/loft-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/loft-ui.mjs',adultBlocks:[
    {start:'<details class="loft-grownups">',end:'<a href="#notes">Open Grown-up notes</a></details></div>`;',reason:'Grown-ups: what this little stage practices panel.'},
    {start:'export function loftNotes(',end:'\nexport function bindLoft(',reason:'Only used in Grown-up notes.'},
  ],quotations:[]},
  {path:'dist/message-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/message-core.mjs',adultBlocks:[],quotations:[
    {quote:",'provenance'],['spelling'])",reason:'A saved-record key list, not copy.'},
  ]},
  {path:'dist/message-spelling-content.mjs',adultBlocks:[],quotations:[
    {quote:"notesSupport:'The reader question was supplied.",reason:'Adult prose, shown only in the inline For grown-ups panel and the Spelling for a reader section of Grown-up notes.'},
  ]},
  {path:'dist/message-spelling-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/message-ui.mjs',adultBlocks:[
    {start:'<details class="msg-grownups"><summary>For grown-ups</summary><p>${options.roundRoute',end:'<a href="#notes">Open Grown-up notes</a></details></div>`;}',reason:'For grown-ups panel.'},
    {start:'\nfunction spellingNote(',end:'(s.recovered,null,2))}</pre>`:\'\'}</details>`;}',reason:'Only used in Grown-up notes.'},
  ],quotations:[
    {quote:'<p class="msg-supplied-dialogue"',reason:'A CSS class name, not copy.'},
    {quote:"document.querySelector('.msg-supplied-dialogue')",reason:'A CSS class name, not copy.'},
  ]},
  {path:'dist/post-office-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/post-office-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/post-office-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/post-rival-generator.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/post-rival.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/story-arrivals-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/story-arrivals-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/story-arrivals-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/story-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/story-order-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/word-garden-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/word-garden-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/word-garden-ui.mjs',adultBlocks:[],quotations:[]},
  // LG-2b batch 1 (fleet #1393).
  {path:'dist/act-two-content.mjs',adultBlocks:[],quotations:[{quote:'Supplied, supported and unfinished contributions count alike.',reason:'Grown-up Keeper notes description of what the contribution records mean.'}]},
  {path:'dist/balance-both-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/balance-stall-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/balance-stall-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/body-clues-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/body-clues-ui.mjs',adultBlocks:[],quotations:[{quote:'Original teaching diagrams and supplied picture keys.',reason:'Grown-up notes panel summary of what the records establish.'}]},
  {path:'dist/capacity-units.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/coin-counter-ui.mjs',adultBlocks:[],quotations:[{quote:'Names and values are supplied. Support',reason:'Grown-up notes panel on what the rounds do and do not measure.'}]},
  {path:'dist/courier-clock-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/equality-desk-ui.mjs',adultBlocks:[],quotations:[{quote:'All of this is supported practice.',reason:'For grown-ups panel on what the practice shows.'}]},
  {path:'dist/evidence-voice-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/evidence-voice-stories.mjs',adultBlocks:[],quotations:[{quote:'Reverse walking layer not supplied on this batch',reason:'In-story printer’s notebook entry quoted as evidence; period wording the child reads as a source.'}]},
  {path:'dist/fair-test-apprentice-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/field-kit-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/food-fork-ui.mjs',adultBlocks:[],quotations:[{quote:'A result is practice with supplied evidence',reason:'Grown-up notes panel on what a check can establish.'}]},
  {path:'dist/balance-stall-ui.mjs',adultBlocks:[],quotations:[{quote:'Supplied ideal model mass, not physical measurement',reason:'Grown-up notes panel on what the Balance Stall rounds do and do not measure.'}]},
  {path:'dist/food-links-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/fossil-close-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/fossil-close-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/french-ferry-content.mjs',adultBlocks:[],quotations:[{quote:'This is listening and speaking practice in a supplied situation',reason:'grownUp note on what the crossing records do and do not show.'}]},
  {path:'dist/french-rooms-core.mjs',adultBlocks:[],quotations:[{quote:'Supplied teaching remains support.',reason:'Grown-up notes qualification on what the practice records establish.'}]},
  {path:'dist/gathering-budget-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/hundredths-ui.mjs',adultBlocks:[],quotations:[{quote:'These supplied pictures and requests are guided practice.',reason:'For grown-ups panel on what the practice does not establish.'},{quote:'Hundredths Bridge: supplied pictured practice',reason:'Grown-up notes panel summary naming the kind of practice recorded.'}]},
  {path:'dist/instruction-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/instruction-core.mjs',adultBlocks:[],quotations:[{quote:'Supplied strips are supplied assembly.',reason:'Downloaded grown-up notebook header on what the reports mean.'},{quote:'Current supplied strip:',reason:'Downloaded grown-up notebook field label.'},{quote:'Supplied strip: ',reason:'Downloaded grown-up notebook field label for a kept version.'}]},
  {path:'dist/join-portions-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/joining-ledger-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/joining-orders-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/joining-orders-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/keepers-desk-core.mjs',adultBlocks:[],quotations:[{quote:"'supplied-'+field",reason:'Internal support-event code, never shown to the child.'}]},
  {path:'dist/keepers-desk-ui.mjs',adultBlocks:[],quotations:[{quote:"'supplied-'+f",reason:'Internal support-event code used to decide whether to show the ready-made words line.'}]},
  {path:'dist/lantern-circuit-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/lantern-codes-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/cartographer-ui.mjs',adultBlocks:[],quotations:[{quote:'Equal model units and all labels are supplied.',reason:'Grown-up notes panel on what the map records do and do not establish.'}]},
  {path:'dist/food-links-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/food-links-ui.mjs',adultBlocks:[],quotations:[{quote:'Original named schematics and supplied facts',reason:'Grown-up notes panel summary of what the records establish.'}]},
  {path:'dist/french-rooms-ui.mjs',adultBlocks:[],quotations:[{quote:'Frozen passages, plan, supplied choices',reason:'Grown-up notes panel on what the French practice records keep separate.'}]},
  {path:'dist/garden-paving-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/lantern-line-ui.mjs',adultBlocks:[],quotations:[{quote:'This is a fictional model walk with supplied fraction requests',reason:'Grown-ups: practice and recovery panel.'},{quote:'Lantern Line: supplied pictured practice',reason:'Grown-up notes panel summary naming the kind of practice recorded.'}]},
  {path:'dist/life-stages-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/life-stages-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/life-stages-ui.mjs',adultBlocks:[],quotations:[{quote:'Original teaching pictures and supplied facts',reason:'Grown-up notes panel summary of what the records establish.'}]},
  {path:'dist/map-reading-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/map-reading-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/market-change-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/market-change-ui.mjs',adultBlocks:[],quotations:[{quote:'Labeled US-cent change practice with supplied values',reason:'Grown-up notes panel on what the rounds do and do not measure.'},{quote:'Only explicit support requests are recorded as support codes.',reason:'Grown-up notes panel on how support is recorded.'}]},
  {path:'dist/market-signs-core.mjs',adultBlocks:[],quotations:[{quote:"kind:join?'supplied':'discovery'",reason:'Internal record kind, never shown to the child.'}]},
  {path:'dist/measuring-desk-content.mjs',adultBlocks:[],quotations:[{quote:"'missing','provenance','precisionNote'",reason:'Internal copy-key names, never shown to the child.'}]},
  {path:'dist/mill-film.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/mixing-table-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/preparation-clock-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/preparation-clock-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/repeat-deliveries-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/repeat-deliveries-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/repeat-deliveries-ui.mjs',adultBlocks:[],quotations:[{quote:'Supplied expansion, labels and manual stepping',reason:'Grown-up notes panel on what the practice does not establish.'}]},
  {path:'dist/returning-ledger-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/returning-orders-ui.mjs',adultBlocks:[],quotations:[{quote:'These are local records of supplied quantities',reason:'Grown-up notes panel on what the records establish.'}]},
  {path:'dist/seed-exchange-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/seed-pairs-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/seed-pile-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/sentence-bridges-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/sentence-bridges-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/shutters-ui.mjs',adultBlocks:[],quotations:[{quote:'Supplied combinations and explanations',reason:'Grown-up notes panel on what the round notes do and do not show.'}]},
  {path:'dist/slope-equation-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/sorting-desk-ui.mjs',adultBlocks:[],quotations:[{quote:'These are pictured, supplied rule checks.',reason:'For grown-ups panel on what the checks show.'},{quote:'Willow Sorting Desk: supplied rule practice',reason:'Grown-up notes panel summary naming the kind of practice recorded.'}]},
  {path:'dist/sound-window.mjs',adultBlocks:[],quotations:[{quote:'Supplied teaching and nominal computer signals',reason:'Grown-ups: exploring together panel on what the window does not measure.'}]},
  {path:'dist/source-trail-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/switch-table.mjs',adultBlocks:[],quotations:[{quote:'This is supplied teaching in an ideal steady-state screen model',reason:'Grown-ups: model and sources panel.'}]},
  {path:'dist/tenths-ui.mjs',adultBlocks:[],quotations:[{quote:'This is pictured practice using supplied requests and explanations.',reason:'For grown-ups panel on what the practice does not establish.'},{quote:'Tenths Table: supplied pictured practice',reason:'Grown-up notes panel summary naming the kind of practice recorded.'}]},
  {path:'dist/two-letters-content.mjs',adultBlocks:[],quotations:[{quote:'Supplied choices show choices for these briefs.',reason:'grownup note on what the letter choices do and do not show.'}]},
  {path:'dist/upstream-exchange-content.mjs',adultBlocks:[],quotations:[{quote:'These are local story actions with supplied questions and replies.',reason:'notesDisclaimer shown in the grown-up notes panel.'}]},
  {path:'dist/upstream-exchange-ui.mjs',adultBlocks:[],quotations:[{quote:'Supplied question posted in the local story',reason:'Grown-up notes panel record line.'}]},
  {path:'dist/water-evidence-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/water-phase.mjs',adultBlocks:[],quotations:[{quote:'Supplied teaching, not an assessment',reason:'Grown-ups: sources and limits panel.'}]},
  {path:'dist/water-shares-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/water-shares-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/which-hat-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/which-hat-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/which-hat-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/willow-double-ui.mjs',adultBlocks:[],quotations:[{quote:'These are supplied parcel and rule checks.',reason:'For grown-ups panel on the trace page.'},{quote:'These are supplied rule checks, not a score.',reason:'For grown-ups panel on the rule page.'},{quote:'Willow Double Check: supplied connector practice',reason:'Grown-up notes panel summary naming the kind of practice recorded.'}]},
  {path:'dist/writing-table-content.mjs',adultBlocks:[],quotations:[{quote:'All checks are practice with supplied material',reason:'grownup copy shown in the grown-up notes panel.'}]},
  {path:'dist/writing-table-ui.mjs',adultBlocks:[],quotations:[{quote:'Writing Table: supplied drafts and kept versions',reason:'Grown-up notes panel summary naming what is kept.'}]},
  // LG-2b batch 5 (fleet #1405).
  {path:'dist/borrowed-sorter-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/borrowed-sorter-core.mjs',adultBlocks:[],quotations:[{quote:"['own','supplied'].includes(part.mode)",reason:'Stored advice-mode code, never shown to the child.'},{quote:"entry.mode === 'supplied' ? 'supplied' : 'own'",reason:'Stored advice-mode code, never shown to the child.'},{quote:"mode === 'supplied' && option",reason:'Stored advice-mode code, never shown to the child.'}]},
  {path:'dist/borrowed-sorter-ui.mjs',adultBlocks:[{start:'export function sorterNotes(',end:'\nlet removeGuards=',reason:'Only used in Grown-up notes.'}],quotations:[{quote:"p.mode==='supplied'",reason:'Stored advice-mode code, never shown to the child; the kept label reads Ready-made words.'},{quote:"['own','supplied'].map(mode=>btn(",reason:'Stored advice-mode codes used as data-mode values, never shown to the child.'}]},
  {path:'dist/feeding-board-content.mjs',adultBlocks:[{start:'  "grownup": [',end:'Existing reset and transfer controls apply."',reason:'Shown only in the folded Grown-up guide.'}],quotations:[]},
  {path:'dist/feeding-board-ui.mjs',adultBlocks:[{start:'function observation(',end:'\nexport function bindFeedingBoard(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/ledger-gauge-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/ledger-gauge-core.mjs',adultBlocks:[],quotations:[{quote:"'choiceId'])&&['own','supplied']",reason:'Internal writing-mode code, never shown to the child.'},{quote:"str(p[x]))&&['own','supplied']",reason:'Internal writing-mode code, never shown to the child.'},{quote:"field==='mode'&&!['own','supplied']",reason:'Internal writing-mode code, never shown to the child.'},{quote:"p.mode='supplied'",reason:'Internal writing-mode code, never shown to the child.'},{quote:"str(p.text)&&['own','supplied']",reason:'Internal writing-mode code, never shown to the child.'}]},
  {path:'dist/ledger-gauge-ui.mjs',adultBlocks:[],quotations:[{quote:"${x.mode==='supplied'?",reason:'Internal writing-mode code, never shown to the child.'},{quote:"${['own','supplied'].map(",reason:'Internal writing-mode code used for the button data attribute; the button shows Ready-made words.'},{quote:"${d.mode==='supplied'?",reason:'Internal writing-mode code, never shown to the child.'},{quote:"${part.mode==='supplied'?",reason:'Internal writing-mode code, never shown to the child.'},{quote:'Supported practice does not establish independent proficiency.',reason:'Grown-ups notebook space and records panel on what the practice does not establish.'}]},
  {path:'dist/town-record-content.mjs',adultBlocks:[],quotations:[{quote:"'supplied-peak',[option(",reason:'Internal fitting-choice id stored in checks, never shown to the child.'},{quote:"option('supplied-peak',",reason:'Internal choice id stored in checks, never shown to the child.'}]},
  {path:'dist/town-record-core.mjs',adultBlocks:[],quotations:[{quote:"['own','supplied'].includes(p.mode)&&str(p.own",reason:'Internal plan-mode code, never shown to the child.'},{quote:"['own','supplied'].includes(p.mode));",reason:'Internal kept-part mode code, never shown to the child.'},{quote:"['own','supplied'].includes(mode)",reason:'Internal plan-mode code, never shown to the child.'},{quote:"p.mode='supplied'",reason:'Internal plan-mode code, never shown to the child.'},{quote:"p.mode==='supplied'?'supplied':'own'",reason:'Internal plan-mode code, never shown to the child.'},{quote:"p.mode!=='supplied'",reason:'Internal plan-mode code, never shown to the child.'}]},
  {path:'dist/town-record-ui.mjs',adultBlocks:[{start:'<details data-record-panel="grownups">',end:'</details><footer>',reason:'Grown-ups panel on what the record can show.'}],quotations:[{quote:"'sampled':'supplied'",reason:'Internal data-state attribute value, never shown to the child.'},{quote:"p.mode==='supplied'",reason:'Internal plan-mode code, never shown to the child.'},{quote:"['own','supplied'].map(",reason:'Internal plan-mode codes, never shown to the child.'},{quote:'class="record-supplied"',reason:'A CSS class name, not copy.'}]},
  {path:'dist/gap-line-content.mjs',adultBlocks:[{start:'    "Source Start",',end:'    "Not recorded before this comparison",',reason:'Grown-up notes and Grown-up guide field labels for each invitation\'s starting ruler and help context.'}],quotations:[{quote:'Only the supplied source, local construction drafts',reason:'Grown-up guide paragraph on what the tool keeps.'}]},
  {path:'dist/gap-line-ui.mjs',adultBlocks:[{start:'function startingRuler(v,c){',end:'\nfunction helper(v,u,c){',reason:'Only used in the Grown-up guide and Grown-up notes.'},{start:'export function gapLineNotes(',end:'\nexport function bindGapLine(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/timing-desk-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/timing-desk-core.mjs',adultBlocks:[],quotations:[{quote:"['own','supplied'].includes(p.mode)&&str(p.own",reason:'Stored writing-mode code, never shown to the child.'},{quote:"['own','supplied'].includes(p.mode)&&(!own(p,'unreadable')",reason:'Stored writing-mode code in the kept-note check, never shown to the child.'},{quote:"['own','supplied'].includes(mode)&&editPart",reason:'Stored writing-mode code, never shown to the child.'},{quote:"if(value!=='')p.mode='supplied'",reason:'Stored writing-mode code, never shown to the child.'}]},
  {path:'dist/timing-desk-ui.mjs',adultBlocks:[{start:'function keptSupport(',end:'\nlet removeGuards=',reason:'Only used in Grown-up notes.'}],quotations:[{quote:"['own','supplied'].map(mode=>b('data-timing-mode=",reason:'Stored writing-mode code used as a button data value; the button shows Ready-made words.'},{quote:"p(part.mode==='supplied'?'Ready-made words'",reason:'Stored writing-mode code compared before choosing the shown label.'}]},
  {path:'dist/river-room-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/river-room-core.mjs',adultBlocks:[],quotations:[{quote:"validRiverPart=p=>obj(p)&&['own','supplied'].includes(p.mode)",reason:'Stored writing-mode code, never shown to the child.'},{quote:"&&['own','supplied'].includes(p.mode),8)",reason:'Stored writing-mode code in the kept-note check, never shown to the child.'},{quote:"!['own','supplied'].includes(value)",reason:'Stored writing-mode code, never shown to the child.'},{quote:"if(field==='choiceId'&&value!=='')p.mode='supplied'",reason:'Stored writing-mode code, never shown to the child.'},{quote:"validRiverPart(p)&&p.mode==='supplied'?part.options",reason:'Stored writing-mode code, never shown to the child.'}]},
  {path:'dist/river-room-ui.mjs',adultBlocks:[],quotations:[{quote:"${p.mode==='supplied'?'Ready-made words'",reason:'Stored writing-mode code compared before choosing the shown label.'},{quote:"${['own','supplied'].map(mode=>btn(`data-river-plan-mode=",reason:'Stored writing-mode code used as a button data value; the button shows Ready-made words.'},{quote:'class="river-supplied"',reason:'A CSS class name, not copy.'},{quote:"${d.mode==='supplied'?'ready-made choice'",reason:'Stored writing-mode code compared before choosing the shown label.'}]},
  {path:'dist/motion-evidence-adaptive.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/motion-evidence-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/motion-evidence-core.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/motion-evidence-ui.mjs',adultBlocks:[{start:'export function motionNotes(',end:'\nexport function bindMotion(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/ratio-bars-content.mjs',adultBlocks:[{start:'overlap with this invitation is unknown.",',end:'"Guided example shown with this invitation",',reason:'Literal list of the Grown-up notes starting-context lines.'}],quotations:[{quote:'"Notes supplied context": "Supplied starting blocks: {ordered named counts}"',reason:'Copy-table mirror of the Grown-up notes starting-context line.'},{quote:'The supplied example is one construction',reason:'Grown-up guide paragraph on what the example shows.'},{quote:'This tool adds constructed allocation from a supplied whole and recovery from a supplied share',reason:'Grown-up guide paragraph on what the tool adds and does not certify.'},{quote:'Only the frozen supplied source, local drafts',reason:'Grown-up guide paragraph on what is stored.'}]},
  {path:'dist/ratio-bars-ui.mjs',adultBlocks:[{start:'function supplied(c){',end:'\nfunction amounts(',reason:'Starting-context lines used only in Grown-up notes.'},{start:'function observationNotes(',end:'\nexport function bindRatioBars(',reason:'Only used in Grown-up notes.'}],quotations:[{quote:'class="rb-supplied"',reason:'A CSS class name, not copy.'},{quote:"'Only the frozen supplied source,'",reason:'Prefix selecting a Grown-up guide paragraph, not shown by itself.'}]},
  // LG-2b batch 6 (fleet #1408).
  {path:'dist/instruction-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/puppet-notice-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/puppet-notice-ui.mjs',adultBlocks:[],quotations:[{quote:'Supplied tickets, help and puppet responses are pictured practice.',reason:'Grown-ups: notes and recovery panel on what the practice shows.'},{quote:'Puppet notices: supplied word tickets',reason:'Grown-up notes panel summary naming the kind of practice recorded.'}]},
  {path:'dist/rhythm-ui.mjs',adultBlocks:[],quotations:[{quote:'Supplied examples and support do not change another activity’s records.',reason:'Grown-up notes panel on what the records do and do not show.'}]},
  {path:'dist/route-scale.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/ribbon-recut-ui.mjs',adultBlocks:[],quotations:[{quote:'The displayed fractions are supplied model labels.',reason:'For grown-ups panel on what the labels are.'}]},
  {path:'dist/fair-test-apprentice-ui.mjs',adultBlocks:[{start:'export function apprenticeNotes(',end:'export function bindApprentice(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/exhibit-label-ui.mjs',adultBlocks:[{start:'export function labelNotes(',end:'export function bindLabel(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/source-trail-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/source-trail-ui.mjs',adultBlocks:[{start:'export function sourceTrailNotes(',end:'export function bindSourceTrail(',reason:'Only used in Grown-up notes.'}],quotations:[{quote:'<p class="trail-provenance">',reason:'A CSS class name, not copy.'}]},
  {path:'dist/field-strips-content.mjs',adultBlocks:[],quotations:[{quote:'The supplied cuts make equal cells.',reason:'Grown-up guide paragraph on what the drawing does and does not show.'}]},
  {path:'dist/field-strips-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/ordered-sorting-content.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/ordered-sorting-ui.mjs',adultBlocks:[{start:'export function orderedNotes(',end:'export function bindOrdered(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/mixing-table-ui.mjs',adultBlocks:[{start:'const grownupParagraphs=[',end:'let visits=new WeakMap();',reason:'Shown only in the folded Grown-up guide.'},{start:'function context(c){',end:'export function bindMixingTable(',reason:'Starting-context, observation and notes helpers used only in Grown-up notes.'}],quotations:[]},
  {path:'dist/ribbon-rows-ui.mjs',adultBlocks:[{start:'export function rowsNotes(',end:'export function bindRows(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/bundle-exchange-ui.mjs',adultBlocks:[{start:'export function bundleExchangeNotes(',end:'export function bindBundleExchange(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/courier-clock-ui.mjs',adultBlocks:[{start:'export function clockWalkNotes(',end:'export function bindClockWalk(',reason:'Only used in Grown-up notes.'}],quotations:[{quote:'Supplied labels and model intervals can reveal the answer.',reason:'Grown-ups: practice and recovery panel on what the practice does not establish.'}]},
  {path:'dist/two-windows-ui.mjs',adultBlocks:[{start:'export function twoWindowsNotes(',end:'export function bindTwoWindows(',reason:'Only used in Grown-up notes.'}],quotations:[]},
  {path:'dist/two-letters-ui.mjs',adultBlocks:[],quotations:[{quote:'Supplied choices show choices for these briefs.',reason:'Folded "About these choices" grown-up panel on what the choices do and do not show.'},{quote:'Supplied choices do not show independent writing or how someone speaks.',reason:'Grown-up notes panel on what the letter records establish.'}]},
  {path:'dist/water-shares-ui.mjs',adultBlocks:[],quotations:[]},
  {path:'dist/pathway-entry-content.mjs',adultBlocks:[],quotations:[]},
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
