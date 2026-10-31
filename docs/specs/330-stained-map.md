# 330 · The Stained Map

Draft 2026-10-31, based on main `9cf48d17d958d0b8decd866bee597c81578d2875`. **Specification in preparation, not build or release clearance.** Bounded first text-based slice of [268](268-old-keepers-spellings.md), serving admitted LG-10 / LG-G1. [Finite text](../content/330-stained-map-text.md); [source audit](../source-audits/330-stained-map.md).

## Purpose and boundary

Build a library worktable where the child restores eight stained map labels, reads evidence about how letters entered words, and matches seven word-family clues. The town wants a readable map to send to Nuria. This gives spelling a practical story job while distinguishing three things: a letter kept after speech changed, a letter added by writers, and a family word that can help remember a spelling. These are different explanations, not a rule that every silent letter was once spoken.

Commission 268 bench(a), teach cards1–4 with their stepwise examples, and supported jobs A1–A5. The third job is about reading the supplied history notes, not independently knowing etymology. All three benches and all five jobs stay directly selectable; keep unfinished work and return without a penalty. No score, timer, age or mastery gate.

Do not build the other five benches, page3 copy, long-word workshop, foreign-language scene, chapter adapter or film. No isolated phoneme samples, new recordings or microphone. Ordinary local narration of finite story, teaching and prompt text follows268's rule; response choices are not narrated. Adult shared reading remains available. Brief55's phonics/audio gates remain untouched;268 explicitly commissions no sound asset and does not require brief55 for its ordinary prose reading.

This is an explorable, finite, supported spelling activity, not a complete spelling course, placement, pronunciation check or independent writing assessment.

## Entry, story and display

Use the exact open route **`#library/spellings`**, as268 proposes, without inventing a Library hub. Add a labelled entry from Word Garden and return links to Word Garden and Market Signs. Do not link to unbuilt sibling routes. The page title is **The Old Keeper's Spellings**, with only **The Stained Map** present; no empty list of future benches.

Use268's first-visit lines and scene1 Short/Longer, its fiction label, the four teaching cards and their worked steps. Omit the broad recall card, which assumes endings not taught by this slice. Before `storyView(state).pageVisible`, use the librarian's own map and the Before page1 lines. After that explicit reveal, use the After page1 tracing lines. The source holds both versions; changing story context changes neither a spelling record nor story state. This is not the old Keeper's page itself and never reveals one. No Hollis name or page3 wording appears in this slice.

One worktable at a time: **Restore the map**, **Read the word histories**, **Find a family clue**, **Try a job**. At tablet width, an original valley sketch and its selected label/note sit beside the word tray. At phone width, show the selected label and note above its tray, with Next/Previous label controls and an always-available label picker. Keep the map as meaningful context rather than requiring eight tiny labels to fit the phone. Every action has native tap and keyboard controls; no drag, hover or precision tracing requirement.

Every bench includes268's dictionary reminder and a clearly marked written note. Optional teaching opens one worked step at a time and may be folded again. Story/teaching reads alone do not create a saved root. Read-aloud includes only visible prose selected for it, stops on navigation/owner change/film, and excludes response tiles and words. Reading a written answer clue is supplied support, never independent attainment. Use44px targets,16px minimum text, visible focus, reduced motion and no horizontal page overflow at320/820/1024. The map has a text-equivalent label list. A correct letter, a selected letter and an earlier check have distinct text labels, not color alone.

## The three benches

### Restore the map

Consume the eight268 labels and their notes exactly. The same reusable tile row is available for every label: gh, k, w, g, b, t, s, nothing missing. Show a starting letter in capitals when inserted at the start of a name. Tile selection changes only the chosen label; selecting another label preserves all work. Put back clears its selection. `null` means no response; the **nothing missing** tile is an actual response and fits only The Sponge. The two boxes in Hi▢▢ represent two letters; gh is one selectable tile, not one letter.

The source stores each label's id, before/after text, number of stained letters, complete label, case-at-start flag, note and fitting tile id. Render restoration from that saved material. The original background sketch is fictional, not a geographical or historical measurement. Its visual marks never replace the accessible label/note controls.

Check compares the selected tile with that label's frozen fitting tile, records its current work and returns the finite feedback. It never fills a missing answer or changes the selected tile. Keep this version accepts incomplete, unchecked and different versions. A whole-map fit may show **The labels are ready to travel.** This is local feedback, not a story contribution or proof of spelling proficiency. Keep does not require a fit.

### Read the word histories

Eight cards: knoll, write, gnat, lamb, high; island, debt, doubt. Each keeps the exact written historical note from268. Select a card, then **Once said** or **Added by writers**; **Put back** clears that card. Both destinations can receive several cards, and every placement remains visible. Check compares the complete mapping with its frozen source, distinguishes incomplete from different, and never moves cards automatically. The note stays beside the selected card throughout. Thistle is deliberately not assigned a history: its map note makes no claim about where its silent t came from.

The task is interpreting the supplied notes. It does not establish historical knowledge, spelling recall or pronunciation. In particular, the b in debt/doubt is an addition to English spelling; do not describe those as letters everyone once pronounced in English. Island's s has a separate history, and the source audit must clear the wording that was proposed in268.

### Find a family clue

Seven supplied pairs from268: sign/signal, muscle/muscular, bomb/bombard, solemn/solemnity, autumn/autumnal, doubt/dubious and debt/debit. Select a base word, then one of the seven family words; destinations are reusable. The selected base word and its written letter clue stay visible. Put back clears only that base word. Check uses only the frozen supplied pair table. A different pair gets a statement about the supplied note, not a claim that the trial is no English word or can never be related. Preserve the actual pair selected.

The pronunciation/relationship of every pair needs the dictionary check in the audit before build. In this slice the human can say the ordinary words; no speech recognition judges the response. Teach card4 contrasts sign/signal with signing; formal job A4 also supplies singer. The bench does not invent further wrong words or universal etymological rules.

## Supported practice and revisits

Offer A1–A5 in source order, each directly selectable. A1 has its three visible guided steps; A2 is a four-card/two-destination mapping, A3/A4 are native choice buttons, and A5 has three statements each answered True or Not true. Preserve the supplied choice order: A1's fit is first, A3's second, A4's third; no shuffling on resume. No uncommissioned distractor or new generated spelling challenge.

Keep each prompt's exact words, choices, worked steps, hint, explanation and feedback from268. For A5, keep each statement and its truth value independently; an unanswered statement is incomplete, not false. The hint then simpler worked example then Skip for now ladder is optional. The finite companion specifies each reused worked case and any new interface feedback; no builder-authored lexical explanation. Skip opens the next readable job and preserves the skipped work. All jobs remain supported/guided: a later help flag is not a claim that earlier supplied teaching was absent.

The benches provide new uses of the teaching: restore a place name, classify a new written note, use a family clue, then revisit a kept version. Returning from a job restores the waiting bench draft and selected label/card. First and latest keeps can be inspected separately and reopened as a working copy without changing either saved snapshot. A check is visibly marked earlier when its work differs from the current draft. Do not rewrite an earlier outcome after a later content correction.

## Persistence and failure contract

Use the optional **`spellings`** root named by268. It is absent until an explicit bench/job selection or write. The old proposed sketch is not a deployed format; use this bounded implementation contract instead, with no migration of unknown versions and no second spelling root.

```
spellings: {
 v:1,
 source:{format:1,id,story:{before,after},cards:[...],
         labels:[...],tiles:[...],histories:[...],historyPlaces:[...],
         families:[...],familyWords:[...],jobs:[...]},
 view:'map'|'histories'|'families'|'practice'|'choose',
 currentId:null|jobId,
 benches:{[map|histories|families]:{
   work:{placements:{[sourceCardId]:tileOrDestinationId|null}},
   checks:[{work,outcome:'incomplete'|'different'|'fit',feedback:[text],supported:true,guided:true}],
   firstKept:null|{work,check:null|check},latestKept:null|{work,check:null|check}
 }},
 items:{[jobId]:{source,work,help:{hint:bool,example:bool},
   checks:[{work,help,outcome,feedback:[text],supported:true,guided:true}],
   firstKept:null|{work,help,check:null|check},latestKept:null|{work,help,check:null|check}}}
}
```

Freeze the full collection once, on the first explicit selection. A job record freezes its own source from that retained collection when first selected. No opening, rendering, Notes, reload, preference or lookup silently creates or fills a source/draft. Never merge today's catalog into a saved collection. Missing records read as absent; a missing bench draft can be created only by explicit opening from a readable retained section. Current UI selection, unfolded teaching step and story reading amount are local view state, reset on owner change/import, with working selection retained when returning from another table.

The frozen source uses original structured fields, not HTML. `story.before` and `story.after` each hold `arrival`, `hook`, `short:[text]`, `longer:[text]`; common fiction/fact labels and the reminder are in `source.copy`. A teach card is `{id,title,text,example,steps:[text]}`. A label is `{id,before,after,stains,complete,capitalStart,note,key:tileId}`; `stains` is0–2 and `capitalStart` is boolean. A tile is `{id,text,kind:'letters'|'none'}`. A history card is `{id,word,note,key:historyPlaceId}` and each destination is `{id,text}`. A family card is `{id,word,letter,key:familyWordId}`, and a family word is `{id,text}`. The source retains the exact intended complete labels and card keys; checks need no dictionary or pronunciation API. Child text is escaped on render.

A supported job follows the built Market Signs job-source vocabulary: `{v:1,id,kind:'choice'|'match',title,prompt,hint,example,explanation,steps:[text],teach:[card],parts:[{id,text}],choices:[{id,text}],key,different:{choiceOrPartId:text}}`. A choice key is a choice id; a match key maps every part id to an offered choice id. A5 is a match with three statement parts and the two True/Not true destinations, not three booleans defaulted on load. Bench checks use the exact new feedback table in the finite companion; job checks use that job's own retained feedback and explanation. Help flags record only the later practice hint/example requests. Narration is an ordinary local playback request, not a saved claim about listening or speech; all responses are already labelled supplied/supported/guided.

The finite source has named ids for every offered label, tile, card, destination, job and answer. Source-owned arrays keep their stored order. Choice work is `{choice:null|choiceId}`; mapping work is `{placements:{partId:choiceId|null}}`; A5 uses statement ids mapped to `true`/`false` choice ids. Bench placements use that bench's own saved source ids. A check copies the exact current work/help, its supplied outcome and frozen feedback before showing it. A keep copies the draft and only a check whose work equals it; otherwise the snapshot is unchecked. First keep is immutable; latest replaces only latest. Opening an earlier keep copies its work/help into the draft but does not erase later checks or either keep.

Validation checks ids, shapes, source membership and saved outcomes against their own saved work, never today's answers/wording. Require unique nonempty ids up to80 characters, source text up to4000 characters per string, up to64 entries per source list and a96KiB source envelope; none is today's catalog count. The whole notebook still obeys shared progress byte/node/depth limits. Do not automatically evict checks, picks or snapshots; growing writes refuse at real notebook/export capacity. Unknown keys are preserved. Unsupported root versions remain raw/read-only with a Notes link. A malformed section, source, draft or snapshot stays raw and disables only its own actions; other readable benches/jobs and every other destination remain open. A readable current record should remain usable when an older keep alone is unreadable. Duplicated source ids omit all candidates with that address while preserving the originals; do not select an arbitrary duplicate or substitute today's source.

Every growing mutation clones the entire notebook, validates its owned proposed fields, calls `recoveryFitsProgressLimits` and actual `prepareProgressImport(JSON.stringify(notesReport(candidate),null,2))` through a required canExport callback, then commits only the proposed `spellings` root. A missing/false/throwing preflight leaves all original roots unchanged. The callback receives a disposable clone and cannot alter the proposal eventually committed. Mutation guards capture current root, notebook, explorer, route and connected visible controls. Import, explorer change, reset, open film and stale callbacks cannot write to either owner. Saving off uses the existing in-memory path and actual Notes export, with the normal host notice next to the activity; warnings survive a page-changing action without following to another page. No new sync or transfer mechanism.

Notes lists started/kept bench/job states, incomplete work, requested help and the distinction between supplied practice and independent writing. Raw data remains in the existing download. No learner name, age, grade, school, personal example, prose, recording or device identity is added.

## Integration and curriculum disposition

New source/logic/UI modules and scoped CSS for this route, with an original interactive valley sketch. Reuse the existing ExplorerStore, Notes, real export preflight, local narration, route header, film guards and source-owned kept-work pattern. Do not introduce a framework or regrade the other spelling roots. The app's route, chooser restoration, startup initialization exception, welcome-film exclusion and reset/import lifecycle must all recognize this exact route. Add the Notes destination name, Word Garden entry and scoped child-copy checks. Runtime atlas entry may name read/build encounter patterns; it must not add a topic-coverage claim.

**Upstreams refreshed 2026-10-31:** Jane `e88f81a00553fb87818ef84c77a8800f0dcb33e4`; Marble `5e23196fa60050433f1440057f65a978d39e63fc`. Study Jane's actual LESSONS teaching/guided/practice and misconception-specific feedback; no code, prose, boss, medal, mastery or access gate is imported. The audit records the file-level refresh before review. Use original project268 prose after the stated history checks, not copied dictionary paragraphs or Marble prompts.

**Candidate topic:** Silent Letters in Words `mt_XK7NYt61cO`, strand E1-III. The map, notes and family clues give supported partial practice; supplied tiles and notes do not demonstrate independent spelling, recognition of every pattern or the whole topic. Its erroneous broad evidence must not turn island or doubt into relics of English pronunciation. No psalm claim is commissioned. Other268 topics remain missing/planned, not implicitly covered by this slice.

**Hard prerequisite crosswalk:** the pinned `curriculum/marble/dependencies.json` has one hard incoming edge, from Spellings from Greek, French and Latin `mt_y8sicbhMci`. It remains not yet mapped. The debt/doubt Latin-spelling notes provide a narrow inline example, not the prerequisite's Greek/French/Latin sound-pattern curriculum. Record that gap explicitly; no age or prerequisite lock is added, and no full attainment claim is made.

**Spec49 §5 teaching encounter:** target = choose the supplied silent letter and use written historical/family clues; teaching = four explicit cards with worked steps; contrast = once said versus added, and sign/signal versus signing; supported practice = the three revisable benches and five jobs; new use = a different map label/history/family relationship; purposeful revisit = inspect/reopen first/latest keeps and send a readable fictional map in the narrative; data boundary = finite typed local work only. The map's narrative purpose creates no chapter offer or delivery receipt. The teaching prerequisites and observed limits remain visible to adult readers.

**Acts:** spec49 ActIII connection and transfer, E1-III; spec120 ActIII chapter4's letter context. It is usable before story arrival, using the librarian's own map. Neither play nor a fit advances the story or reveals a page. A later adapter would need its own reviewed contract.

## Acceptance and open gates

Before build: finish the audit's dictionary/history checks, independently review the finite text and spelling semantics, complete the six distinct spec-review lenses, resolve findings, and publish an exact-head clearance. Parent approval of phonics recordings is not inferred from text review.

Pure checks must use exact finite sources and real Notes import preparation: all map tile cases, The Sponge's real response versus missing, gnat/knoll capitalization and gh's two-letter restoration, all history mappings and family pairings, every supported job/statement/outcome, choice order, first/latest and earlier-check semantics, malformed siblings, duplicate identities, unsupported root, frozen old wording/keys/order, source-list sizes different from today, real capacity refusal, read-only renders and all unrelated roots unchanged.

Native journeys at320/820/1024: all three worktables and five jobs; one wrong restoration then repair; note visible beside work; keyboard and tap control focus; incomplete keep and both versions; Help/Skip; shared reading and narration that excludes choices; story before/after Page1 without revealing it; optional open arrival; actual Notes download/import/reload and two explorers; supported/unreadable siblings; save-off and persistent-write warnings; refused writes; stale/hidden/film-blocked controls; reset of one explorer; source-owned older content; no overflow and44px targets. Inspect the actual rendered map and reading panels. No suite proves physical iPad/Safari, audible quality or learning.

Do not treat a source claim as cleared merely because its text traces to268. Its audit's first pass explicitly left dictionary checks open. The model-panel or spec reviewers must adjudicate corrections before runtime copy is commissioned.
