# 329 · Joining Dot's Notes: marks between two whole sentences

Proposed 2026-10-31. The second bounded slice of [278](278-exchange-manifest.md), not approval of the rest of that pack. It adds 278's bench **(b) Joining Dot's Notes** with set C to the market list version of the Exchange Manifest that [319](319-market-list-marks.md) built at `#post/manifest`. It closes one E2-V bridge: a semicolon, colon or dash can join two whole sentences, a comma alone can't, and a *because* part that comes first takes a comma. Supplied tiles make this supported punctuation practice, not free writing, dictation or placement.

## Why this slice

Nothing built teaches punctuation between independent clauses. Sentence Bridges (109) joins clauses with *and*, *because* and *but*; 319 teaches the colon and semicolon in lists only; 264 (proposed) owns paired dashes and brackets. 278's companion already writes every line for this bench and set C, and 278's review made the five notes and set C page-free, so the market list version can ship them with no story adapter and no Act VI state. 278's suggested order puts this bench next after The Manifest List, and card 7 reuses the semicolon that card 3 introduced.

This slice extends 319's page, controller, CSS and `exchangeManifest` root; it adds no new route, page, story scene, unlock, chapter contribution, page reveal, audio or mutation of another root. The Act VI scene *Three Ways, one page* is manifest-only and is not shipped.

## Exact content

All child-facing text comes verbatim from [the 278 companion](../content/278-exchange-manifest-text.md), with its print rule (typographic quotes and apostrophes on screen, single-asterisk text in italics). This slice adds only these parts:

| Part | Companion section | Notes |
| --- | --- | --- |
| Teach cards | Cards 7, 8 and 9 | Shown above the new bench, worked-example steps one tap at a time, labeled "A true thing about language", as 319 does for cards 1 to 3. |
| Bench | (b) Joining Dot's Notes: header, tiles, notes 1 to 5, Read it lines | Labeled "A story from Willowbank". All five notes are shared by both versions. |
| Items | Set C: C1 to C5 | Every item is in both versions. |
| Stuck ladder | Step 1 (the item's hint); step 2's "Joining items" line for C1 to C5; step 3 | |
| Glossary | Dash | Added to 319's glossary disclosure, in the companion's order. |
| Grown-up panel | Extended, exact text below | Replaces 319's trimmed panel. |

**Grown-up panel, exact text** (companion text with out-of-slice clauses and sentences omitted; it now covers both shipped benches):

> **What this teaches:** a colon to introduce a list after a whole sentence; semicolons between list items that contain commas; semicolons, colons and dashes between independent clauses.
>
> **Terms:** England's national curriculum teaches these in Year 6 and calls a period a full stop; the child text uses American terms. In the Common Core, colons and semicolons for lists and clauses appear in grades 9 to 10, so this pack runs ahead of the US grade order for some children.
>
> **What it does not claim:** style guides differ. The colon is keyed only in running sentences: Chicago leaves it out after *We need*, but some house styles (Microsoft's, for one) allow a colon after a short lead-in such as "You can:" above a bulleted list. The comma before "and" in a list (the serial comma) is a choice and is never marked. American books usually print a long dash with no spaces; this pack shows a spaced short dash. Where two marks both work, both are accepted.

**Wording outside the companion (exceptions, exact).** These follow the child-copy glossary and get the same copy read as the companion lines:

| Where | Exact text |
| --- | --- |
| Set C disclosure | Practice: joining two sentences |
| C5 button | Check |
| Note gap accessible name | Gap, followed by ", " and the chosen tile's name once chosen |
| Read it, note 4 with a comma | A comma fits here. It shows where the "because" part ends. |
| Notes subheading for the bench | Joining Dot's notes |

319's exceptions (Try again, Next step, the unreadable, unknown-version and save-refused lines, the back link) apply unchanged. The note 4 comma line is the one authored gap: the companion's Read it list has no line for the fitting comma on note 4, and every other mark there has one. It is 12 words, names no place and has no dash.

The content check from 319 extends to the new strings: every shipped string appears in the companion (after the print rule), in an exceptions table (319's or this one), or in the grown-up panel above; no shipped string names Vadoalto, Nuria, Hollis, the high ford, the Ways or a page; and no shipped line has an em-dash. The only dash characters are the taught spaced short dash ( – ) in card 9, the glossary's Dash entry, the dash tile, notes punctuated with it, and C4's choices.

## The bench: exact model

Each note is a first part, one gap and a second part, both fixed. Tiles, in fixed order: **period ( . )**, **semicolon ( ; )**, **colon ( : )**, **dash ( – )**, **comma ( , )**, **nothing**. The gap starts unchosen and is drawn as a visible gap; **nothing** is a deliberate choice. **Read it** is enabled once the gap holds a tile. Tiles are buttons of at least 44 px; tapping the gap then a tile, or a tile then the gap, both work, with no drag requirement. A note never splits its gap from the word before it.

| Note | First part | Second part | Accepted (`fits`) |
| --- | --- | --- | --- |
| n1 | The river path is fast | the bridge road is dry. | period, semicolon, dash |
| n2 | The bridge is closed | the miller is painting it. | period, semicolon, colon, dash |
| n3 | We packed two honey cakes | Pip ate one. | period, semicolon, dash |
| n4 | Because the river path floods | we take the bridge road. | comma, nothing |
| n5 | Dot has one rule | letters always go first. | period, semicolon, colon, dash |

The colon is declined on n1 and n3 because neither second part explains the first (278's C5 review ask, applied the same way here). On n4, leaving the gap empty is accepted because a short opening *because* part may go without a comma; the Read it line still says it usually takes one. These two choices are review asks below.

**The punctuated note** joins the parts with the mark: `first + mark + " " + second`, where the dash is spaced (`" – "`) and **nothing** adds only the space. After a period the second part's first letter is capitalized on screen (n1 "The bridge road is dry.", n2 "The miller is painting it.", n4 "We take the bridge road.", n5 "Letters always go first."; n3's *Pip* is unchanged), as the companion's C5 note does for *It*.

**Read it line (one shown, first that applies):**

| Order | Condition | Companion line | Code |
| --- | --- | --- | --- |
| 1 | n4 with period, semicolon, colon or dash | ""Because the river path floods" can't stand alone. A comma fits here." | `because-alone` |
| 2 | n4 with nothing | "A "because" part that comes first usually takes a comma. It helps a reader." | `because-usually` |
| 3 | n4 with a comma | (exception) "A comma fits here. It shows where the "because" part ends." | `because-comma` |
| 4 | A comma, any other note | "A comma alone can't join two whole sentences. Try a stronger mark." | `comma-alone` |
| 5 | Nothing, any other note | "The sentences crash together. A reader can't tell where one ends." | `crash` |
| 6 | A colon on n1 or n3 | "A colon promises "here's why." Does the second part explain the first?" | `explain` |
| 7 | Period | "Two separate sentences, a clean stop between them." | `period` |
| 8 | Semicolon | "Two equal ideas, closely linked." | `semicolon` |
| 9 | Colon | "Here's why, or here's what." | `colon` |
| 10 | Dash | "A sudden break. The second part lands hard." | `dash` |

Read it shows the punctuated note and its line. It never moves a tile, preselects a fitting tile or blocks another try. Changing the tile clears the shown line until the next Read it.

## Items C1 to C5

Choices appear in the companion's order, so the fitting choice is second in C1, third in C2, first in C3 and second in C4. A content check confirms the fitting choice is never the single longest by characters. C1 is guided: its three steps show before the choices. C5 is a one-gap tile item with period, semicolon, colon, dash and comma (no nothing tile) and a **Check** button enabled once the gap is filled; its card is shown as authored, then its line with the gap in place of the comma. Period, semicolon and dash all fit; with a period, the line shows a capital *It*.

Feedback is the companion's per-choice line, then the explanation. In C5, a comma gives the comma line, a colon gives the colon line, and a fitting mark gives the explanation. Nothing locks; a learner may answer again, and there is no automatic next item.

Every item has the "I'm stuck" ladder. Step 3, **Skip for now**, records no answer and moves focus to the next item heading, or to the Set C summary after C5. The support flag is captured before the step appears, as in 319.

## Saved work

The same optional root, version 1, with one new map and a wider item bound:

```
exchangeManifest: {
  v: 1, cardsSeen: bool,
  lists: { ... as 319 ... },
  joins: { [noteId]: { shown: [tileId], mark: tileId, text: string, said: string,
                       outcome: 'fits' | 'other', supported: bool, at } },
  items: { [itemId]: { ... as 319 ... } }
}
```

`noteId` is `n1` to `n5`; join `tileId` is `period`, `semicolon`, `colon`, `dash`, `comma` or `nothing`. `joins` is absent until the first Read it; an existing root without it reads as an empty map, and no write adds it otherwise. Each Read it replaces that note's entry with `shown` (the six tile ids in shown order), `mark`, the frozen `text` (the punctuated note as shown) and `said` (the Read it line shown), `outcome` from the accepted table, `supported` and `at`. Freeze the note template in the active view when first rendered, compute `text` and `said` from that snapshot in the submit candidate, and reveal them only after the commit. `outcome` and the frozen strings are never recomputed or compared with today's content.

Set C items use 319's item entry shape and rules unchanged: frozen `prompt`, `offered`, `answerText` and `said`; `answer` is a choice id for C1 to C4 and a one-gap map `{ s1: tileId }` for C5, where `tileId` is one of the five C5 tiles and `shown` holds those five in shown order. C2 and C4 have no card, so their `prompt` is the prompt line only. **Try again**, resumed read-only readouts and the never-rescore rule work as in 319.

**Support** follows 319. A join's `supported` is true when `cardsSeen` is true at the moment of the Read it, or a Read it line has already been shown for that note; the attempt that first shows a line keeps the value it was committed with. Opening a worked example on cards 7 to 9 sets the existing page-level `cardsSeen`, exactly like cards 1 to 3. The Set C disclosure, **Practice: joining two sentences**, is closed by default; opening it creates C1's pending entry with `guided: true` and `supported: true` before C1's steps render, if C1 is absent, with the same refusal rule as 319's Set A (a refused save keeps the disclosure closed). Joins have no ladder, so there is no pending join shape.

**Validation stays structural.** A completed join has all of `shown` (6 distinct join tile ids), `mark` (one of them), `text`, `said`, `outcome`, `supported` and `at`, with the frozen strings at most 400 code points; any other mix is unreadable, stays exact, and only that note turns read-only. A present `joins` must be a plain object of at most 8 entries, or the page is read-only as a malformed root. The item bound rises from 8 to 25 entries (278's whole set catalogue), and the known item ids become A1 to A4 and C1 to C5; an unknown item id stays exact and unreadable, as before. Additive fields a later 278 bench writes stay exact. An older 319 build that meets a root with more than 8 items or a `joins` map keeps it exact and exportable: more than 8 items reads as malformed there (read-only), and `joins` is ignored. Nothing is migrated, defaulted, deleted or normalized.

Every mutation clones, changes only `exchangeManifest`, shape-checks the touched entries and passes the host's `canExport(candidate)` before committing, as in 319. Readers write nothing. Notes' "Market list marks" section gains a "Joining Dot's notes" subheading listing each completed join's `text`, `said`, outcome and support flag, and the C items appear with the A items in the existing item readout, all from the saved strings only and rendered as text.

## Page and interaction

On `#post/manifest`, below 319's Set A disclosure: cards 7 to 9, then the bench with its header and the five notes, each note's Read it result under it, then the Set C disclosure. The every-screen line already shown at the top covers the new bench. No route-list, hub or Notes-hook change is needed: the route, explorer handling, welcome-film exclusions and Notes call already exist.

Every callback keeps 319's guards: the connected root and control, the exact `#post/manifest` hash, the same notebook, explorer and host that rendered it, inert controls inside a closed disclosure, and no write from a retained or detached control. Redraw after a tile, Read it, answer or help action keeps focus on the acted control or the resulting feedback, and does not close open disclosures. Nothing animates.

## Acceptance and review gates

Independent spec review before build, including a separate subject and copy read of the new subset and the one authored exception line. Defaults under the owner's 2026-10-31 guidance to take recommended defaults:

- **Subject:** the colon is declined on n1 and n3 and in C5 because the second part doesn't explain the first. Default: keep, with the "does it explain?" note rather than "wrong" (278's ask).
- **Subject:** an empty gap on n4 is accepted, with the "usually takes a comma" line. Default: accept, since a short opening *because* part may go without a comma and 278 says every grammatical mark is accepted.
- **Subject:** the spaced short dash. Default: spaced, with the grown-up note (278's ask).
- **Copy:** the note 4 comma line. Default: as written above.

Source tests cover all 6 tiles on each of the 5 notes: the punctuated text with period capitals, the Read it code by the order table and the outcome; every C1 to C4 choice and every C5 tile; first-answer and replacement saves for joins and items; support captured before display and surviving reload and import; structural validation of joins (missing, extra and wrong-type fields, repeated or unknown tile ids, over-limit strings, more than 8 joins) and of more than 8 but at most 25 items; a 319-shaped root with no `joins` reading as before; frozen join strings that Notes renders unchanged after the catalog wording is edited in a test copy; refused Set C pre-display saves; refused preflight; and pure readers. The 319 content check extends to the new strings, the right-answer positions and the not-single-longest rule.

Native isolated Chrome at 320×600, 820×1000 and 1024×768: tap and keyboard tile placement; a note never splits its gap from the word before; at 820×1000 the five notes and every Read it fit inside one viewport height once scrolled to; 44 px controls; focus visible; no horizontal page overflow; a 150% root-font stand-in; real Notes download, import and reload with joins and C items; saving-off; two explorers; stale controls. Screenshot every Read it line and C5 outcome. Physical iPad Safari, VoiceOver, text zoom and learning effects remain unqualified by Chrome.

Then the AGENTS.md landing procedure: independent implementation review on the exact head, combined-tree checks, merge commit, deploy, byte match and receipt.

## Source study and curriculum place

**Jane**, checked 2026-10-31 at `e88f81a00553fb87818ef84c77a8800f0dcb33e4` (upstream HEAD unchanged since 319's refresh): `LESSONS.md`'s teach, then guided, then practice order, worked examples one step at a time, the "I'm stuck" ladder and three-option choices tagged with a misconception are studied and adapted, as in 319. Not adopted: medals, mastery, gates, points, timers or step-downs. No Jane code or text is copied.

**Marble**, checked 2026-10-31 at `5e23196fa60050433f1440057f65a978d39e63fc` (upstream HEAD, fetched): Punctuating Clauses (`mt_xYjD_kA70s`) asks for semicolons, colons and dashes between independent clauses, chosen by how the clauses relate. Its `research` is null, and `data/teaching-research.json` lists it under `coverage.missingTopicIds`, so the outside sources in [278's audit](../source-audits/278-exchange-manifest.md) stand in (England Year 6; CCSS L.9-10.2a, L.8.2a; Chicago). This slice covers that topic's three marks between clauses only. No coverage claim for Advanced Punctuation for Clarity (`mt_lsO9O-_eZH`), which stays with 278's Keeper's Desk bench, and no taxonomy update.

**Hard-prerequisite crosswalk**, from the vendored `curriculum/marble/dependencies.json` (matching upstream for these edges):

| Edge | Strength | How it is met |
| --- | --- | --- |
| Punctuating Clauses needs Subordinate clauses (`mt_wq-1OJ_8s5`) | hard | Met in part by Sentence Bridges (109, built: *and*, *because*, *but*); 269's clause benches are proposed, not built. Supported inline by card 7's cover-one-side steps, the "Joining items" ladder line, note 4 and C2's *because* part. Never a gate. |
| Punctuating Clauses builds on comma use with conjunctions (`mt_j2idD_jq73`) | soft | Context only. |
| Advanced Punctuation for Clarity needs Punctuating Clauses | hard (downstream) | This slice is the prerequisite; the dependent bench is 278's (e), not built. |

**Six-act fit:** strand E2-V (punctuation for effect), standalone in the market list version with no chapter job, as 278 states. **Teaching contract ([49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):** target, join two whole sentences with a semicolon, colon or dash, and comma a fronted *because* part; teaching encounter, cards 7 to 9; contrast, comma or nothing against a stronger mark, a colon that explains against one that doesn't, and a fronted *because* part against a whole sentence; supported practice, the Read it notes, guided C1, the ladder and per-choice feedback; new application, C5's repair of a comma splice; purposeful revisit, 319's semicolon (card 3) seen again as a joiner, and 109's *because* joins; data boundary, codes and frozen display strings only, local, no typed text, voice or image.

Sources are [the 278 source audit](../source-audits/278-exchange-manifest.md); this slice copies no upstream code, lesson prose or art.
