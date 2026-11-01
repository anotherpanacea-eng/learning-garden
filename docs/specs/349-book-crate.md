# 349 · The Book Crate: titles of works

Proposed 2026-11-01. This is the third bounded slice of [278](278-exchange-manifest.md). It does not approve the rest of that pack. It adds 278's bench **(d) The Book Crate**, with card 10 and set D, to the market list version of the Exchange Manifest at `#post/manifest`. [319](319-market-list-marks.md) built that page and [329](329-joining-dots-notes.md) extended it. This slice changes no other bench, item or saved entry.

## Why this slice

No built game teaches how to show the title of a work. 319 and 329 cover marks inside and between sentences. 278's companion already writes every line for this bench, card 10 and set D. Only seven new strings are needed (below): three feedback lines for cases the companion's lines do not cover, the underline tile name, an accessible-name template, and the disclosure and Notes labels. The slice is small and self-contained: one bench, one teach card and four items.

This slice extends 319's page, controller, CSS and `exchangeManifest` root. It adds no new route, page, story scene, unlock, chapter contribution, page reveal, audio or mutation of another root. Scene 3, *The book crate*, is manifest-only and is not shipped. The Spanish crate line belongs to that scene and to the manifest version, so it does not ship either.

## Exact content

All child-facing text comes verbatim from [the 278 companion](../content/278-exchange-manifest-text.md), with its print rule (typographic quotes and apostrophes on screen, single-asterisk text in italics). This slice adds only these parts:

| Part | Companion section | Notes |
| --- | --- | --- |
| Teach card | Card 10, with its worked example | Shown above the new bench, steps one tap at a time, labeled "A true thing about language", as 319 does for cards 1 to 3. |
| Bench | (d) The Book Crate: header, choices, Hand mode, the eight titles, feedback | The market list version's crate goes to the market's book stall. The six real titles are labeled "A true thing from history"; the *Gazette* and the song are labeled "A story from Willowbank". |
| Items | Set D: D1 to D4 | Every item is in both versions. |
| Stuck ladder | Step 1 (the item's hint); step 2's "Title items" line for D1 to D4; step 3 | |
| Glossary | Italics, Quotation marks, Title | Added to the glossary disclosure, in the companion's order. |
| Grown-up panel | Extended, exact text below | Replaces 329's panel. |

Each title's note in the companion (author and year, or "its first chapter") is shown under the title as written. Notes follow the companion's labels, so the two Willowbank notes are fiction and the six others are history.

**Grown-up panel, exact text.** This is the companion text with out-of-slice clauses and sentences omitted. It now covers all three shipped benches:

> **What this teaches:** a colon to introduce a list after a whole sentence; semicolons between list items that contain commas; semicolons, colons and dashes between independent clauses; titles of works in italics or quotation marks.
>
> **Terms:** England's national curriculum teaches these in Year 6 and calls a period a full stop; the child text uses American terms. In the Common Core, colons and semicolons for lists and clauses appear in grades 9 to 10, and titles of works in grade 5, so this pack runs ahead of the US grade order for some children.
>
> **What it does not claim:** style guides differ. The colon is keyed only in running sentences: Chicago leaves it out after *We need*, but some house styles (Microsoft's, for one) allow a colon after a short lead-in such as "You can:" above a bulleted list. The comma before "and" in a list (the serial comma) is a choice and is never marked. Title styles differ a little between guides such as Chicago, MLA and APA, and newspapers often use quotation marks instead of italics; the pack teaches the common school convention. American books usually print a long dash with no spaces; this pack shows a spaced short dash. Where two marks both work, both are accepted.

**Wording outside the companion (exact exceptions).** These follow the child-copy glossary and get the same copy read as the companion lines:

| Where | Exact text |
| --- | --- |
| Set D disclosure | Practice: titles of works |
| Notes subheading for the bench | The book crate |
| Feedback, the *Gazette* in quotation marks | This is a whole newspaper. Most school writing uses italics. |
| Feedback, a whole work underlined (Hand mode) | By hand, a whole work is underlined. |
| Feedback, a part underlined (Hand mode) | This one lives inside a bigger work. Try quotation marks. |
| Hand mode tile | underline |
| Accessible name of a title shown underlined | {title}, underlined |

319's and 329's exceptions apply unchanged: Try again, Next step, the unreadable, unknown-version and save-refused lines, and the back link. The companion's line for a whole book in quotation marks says "This is a whole book", which is wrong for the *Gazette*, so the newspaper gets its own line. The companion gives no feedback for underlining, which only Hand mode offers. The whole-work line is new. The part line reuses the companion's italics-for-a-part line word for word. The tile name follows the companion's "swaps italics for underline". The accessible-name template gives screen readers the underline that sighted readers see. None of the seven names a place or has a dash.

This slice does not extend 319's whole-prose companion-membership check to the new strings: exact identity of every line with the companion protects against no failure the finite checks below miss, and it would force a table entry for every reviewed wording repair. The new strings instead get:
- the subject and copy read named under the review gates;
- finite checks on the eight titles, their notes (author and year), their kinds, the fits table, the D1 to D4 keys and positions, and the not-single-longest rule;
- the market-version limits: no shipped string names Vadoalto, Nuria, Hollis, the high ford, the Ways or a page, and no shipped line has an em-dash.
319's and 329's existing checks on their own strings are unchanged.

## The bench: exact model

The eight rows are grouped as four pairs (t1 with t2, t3 with t4, t5 with t6, t7 with t8), one pair per card. The first three contrast a whole book and a part inside it; the last contrasts a newspaper and a standalone short song, never implying that the song appears inside the newspaper. Layout: one column at 320 px, two columns from 820 px, so the bench adds four cards rather than eight full-width rows. Each title row shows the title in plain letters, its note, and three tiles in fixed order: **italics**, **quotation marks**, **plain**. The row starts unchosen. Tapping a tile chooses it and shows the title drawn with that mark, plus the feedback line. Tiles are buttons of at least 44 px, and keyboard activation works the same as a tap. **Hand mode** is a toggle above the rows, labeled with the companion's "Writing it by hand?". When it is on, the italics tiles read **underline**, and the next italics choice is drawn and answered as underline. Hand mode never changes which answers fit, and it never redraws a result already shown: a row's shown result is always its committed `text` and `said`, until another tile choice on that row replaces them. Toggling changes only the tile labels and the choices made after it.

| Title | Kind | Fits |
| --- | --- | --- |
| t1 *The Wind in the Willows* | whole book | italics (underline by hand) |
| t2 "The River Bank" | part (chapter) | quotation marks |
| t3 *A Child's Garden of Verses* | whole book | italics (underline by hand) |
| t4 "The Swing" | part (poem) | quotation marks |
| t5 *Just So Stories* | whole book | italics (underline by hand) |
| t6 "How the Whale Got His Throat" | part (story) | quotation marks |
| t7 *The Willowbank Gazette* | whole newspaper | italics (underline by hand) |
| t8 "Willow Brook Runs Down" | short work (song) | quotation marks |

**The marked title** is the title drawn with the choice. Italics shows it in `<em>`. Underline uses a text-decoration underline, never a link style. Quotation marks wrap it in typographic quotes. Plain leaves it unchanged. On screen the title appears inside its row. It is never joined into a sentence, so no period goes inside or outside the quotes.

**Feedback line.** One line is shown: the first row of this table that applies.

| Order | Condition | Line | Code |
| --- | --- | --- | --- |
| 1 | Plain, any title | "Plain letters hide that it's a title. Pick a mark." | `plain` |
| 2 | t7 in quotation marks | (exception) "This is a whole newspaper. Most school writing uses italics." | `whole-newspaper-quotes` |
| 3 | A whole book in quotation marks | "This is a whole book. Most school writing uses italics." | `whole-quotes` |
| 4 | t8 in italics, in either mode | "A part, or a short work, goes in quotation marks." | `short-italics` |
| 5 | A part in italics | "This one lives inside a bigger work. Try quotation marks." | `part-italics` |
| 6 | A part underlined | (exception) the same line as order 5 | `part-italics` |
| 7 | A whole work underlined | (exception) "By hand, a whole work is underlined." | `whole-underline` |
| 8 | A whole work in italics | "A whole work leans over in italics." | `whole-italics` |
| 9 | A part or short work in quotation marks | "A part, or a short work, goes in quotation marks." | `part-quotes` |

The song (t8) is not part of a bigger work. The companion groups it with poems, chapters and stories, and its "a part, or a short work" line covers it. The "lives inside a bigger work" line is not true of t8, so row 4 gives t8 in italics or underline the "a part, or a short work" line instead. This is a review ask below. A choice never moves another row, preselects a fitting tile or blocks another try. Choosing again replaces the shown title and line.

## Items D1 to D4

Choices appear in the companion's order, so the fitting choice is first in D1, third in D2, second in D3 and first in D4. A content check confirms the fitting choice is never the single longest by characters after the print rule. D3's fitting choice is 65 characters, tied with its third choice, while its first choice is 67. D1 is guided, with its three steps shown before the choices. D3's choices are drawn with their italics.

Feedback is the companion's per-choice line, then the explanation. Nothing locks: a learner may answer again, and there is no automatic next item.

Every item has the "I'm stuck" ladder. Step 3, **Skip for now**, records no answer and moves focus to the next item heading, or to the Set D summary after D4. The support flag is captured before the step appears, as in 319.

## Saved work

The root keeps the same optional version 1. This slice adds one new map:

```
exchangeManifest: {
  v: 1, cardsSeen: bool,
  lists: { ... as 319 ... },
  joins: { ... as 329 ... },
  crate: { [titleId]: { shown: [tileId], mark: tileId, hand: bool, text: string, said: string,
                        outcome: 'fits' | 'other', supported: bool, at } },
  items: { [itemId]: { ... as 319 ... } }
}
```

- **Ids.** `titleId` is `t1` to `t8`. Crate `tileId` is `italics`, `quotes` or `plain`. Underline is saved as `italics` with `hand: true`, because Hand mode changes the drawing, not the answer.
- **When `crate` appears.** It is absent until the first choice. An existing root without it reads as an empty map, and no other write adds it.
- **What a choice saves.** Each choice replaces that title's entry. The entry holds `shown` (the three tile ids in shown order), `mark`, `hand`, and the frozen `text` and `said`. `text` is the marked title as shown, with single-asterisk markers for italics and `_` markers for underline, rendered only through the page's existing `rich()`-style escaping. `said` is the feedback line shown. The entry also holds `outcome` from the fits table, `supported` and `at`.
- **Freezing.** The title row is frozen in the active view when first rendered. `text` and `said` are computed from that snapshot in the submit candidate and revealed only after the commit. `outcome` and the frozen strings are never recomputed or compared with today's content.
- **Hand mode itself.** The toggle is not saved in the learner's work. It is a view setting held by the page's visit session: off when a new visit, explorer or owner opens the page, and kept across ordinary redraws, tile choices, answers and help actions within that visit.

Set D items use 319's item entry shape and rules unchanged:
- They freeze `prompt`, `offered`, `answerText` and `said`, and `answer` is a choice id.
- D4 has no card, so its `prompt` is the prompt line only. D1, D2 and D3 freeze their authored card and prompt with 319's fixed line-break separator.
- **Try again**, resumed read-only readouts and the never-rescore rule work as in 319.

**Support** follows 319 and 329:
- A crate entry's `supported` is true when `cardsSeen` is true at the moment of the choice, or when a feedback line has already been shown for that title. The attempt that first shows a line keeps the value it was committed with.
- Opening card 10's worked example sets the existing page-level `cardsSeen`.
- The Set D disclosure, **Practice: titles of works**, is closed by default. Opening it creates D1's pending entry with `guided: true` and `supported: true` before D1's steps render, if D1 is absent. The refusal rule is the same as 319's Set A: a refused save keeps the disclosure closed. Crate rows have no ladder, so there is no pending crate shape.

**Validation stays structural:**
- **Complete entry.** A completed crate entry has all of `shown` (3 distinct crate tile ids), `mark` (one of them), `hand` (a boolean), `text`, `said`, `outcome`, `supported` and `at`. The frozen strings are at most 400 code points.
- **Invalid entry.** Any incomplete or invalid mix of recognized fields is unreadable and stays exact, and only that title turns read-only.
- **Unknown fields.** Unknown additive fields are ignored for shape classification and kept unchanged, including when that title's recognized fields are replaced.
- **The map itself.** A present `crate` that is not a plain object of at most 8 entries makes only the crate region unavailable: its rows are read-only, its raw value is kept exact and exported, and the lists, joins and items stay readable, usable and exportable. Every mutation of another region clones and keeps that raw `crate` sibling unchanged; nothing normalizes or replaces it. (On today's 329 build, an unknown `crate` of any shape is already preserved and the page stays ready, so 349 must not turn it into a whole-page lock.)
- **Items.** The item bound stays at 25 entries, and the known item ids become A1 to A4, C1 to C5 and D1 to D4. An unknown item id stays exact and unreadable, as before.
- **Older builds.** A 329 build that meets a root with a `crate` map ignores it and keeps it exact and exportable. That build treats D entries as unknown and unreadable while keeping the A and C entries available. Its page and Notes omit D entries and the crate from their normal readouts but keep them raw.
- Nothing is migrated, defaulted, deleted or normalized.

Every mutation clones the root, changes only `exchangeManifest`, shape-checks the touched entries and passes the host's `canExport(candidate)` before committing, as in 319. Readers write nothing.

Notes' "Market list marks" section gains a "The book crate" subheading. It lists each completed crate entry's `text`, `said`, outcome, hand flag and support flag. The D items appear with the A and C items in the existing item readout. All of it comes from the saved strings only and is rendered as text, apart from the italics and underline markers.

## Page and interaction

On `#post/manifest`, below 329's Set C disclosure, the page shows card 10, then the bench with its header, the Hand mode toggle and the eight title rows, then the Set D disclosure. The every-screen line already shown at the top covers the new bench. No route list, hub or Notes hook needs to change: the route, explorer handling, welcome-film exclusions and Notes call already exist.

Every callback keeps 319's guards:
- the connected root and control;
- the exact `#post/manifest` hash;
- the same notebook, explorer and host that rendered it;
- inert controls inside a closed disclosure;
- no write from a retained or detached control.

A redraw after a tile, toggle, answer or help action keeps focus on the acted control or the resulting feedback, and does not close open disclosures. Nothing animates.

The underline is the only new visual. It has a distinct decoration from links (for example, a solid underline with no link color or pointer), and a title drawn underlined has the accessible name "{title}, underlined" from the exceptions table.

## Acceptance and review gates

Independent spec review comes before build, including a separate subject and copy read of the new subset and the new exception lines. Under the owner's 2026-10-31 guidance, take the recommended defaults:

- **Subject:** the song (t8) is a short work, not a part. Default: give it the companion's "a part, or a short work" line both when it fits and when it is wrong. Do not give it the "lives inside a bigger work" line.
- **Subject:** the newspaper. Default: italics fits, as the companion says. Quotation marks get the newspaper line, which says "most school writing" and does not call quotation marks wrong, matching 278's hedge that newspapers often use quotation marks.
- **Subject:** Hand mode affects only tile labels and later choices, lasts for the visit and is not saved. Default: as written.
- **Copy:** the three new feedback lines, the disclosure and Notes labels, the "underline" tile name and the accessible-name template. Default: as written above.

Source tests cover:
- all 3 tiles on each of the 8 titles, with Hand mode both off and on: the marked text, the feedback code from the order table, and the outcome;
- every D1 to D4 choice;
- first-answer and replacement saves for crate entries and items;
- support captured before display and surviving reload and import;
- structural validation of the crate: missing recognized fields, wrong-type recognized fields (including a non-boolean `hand`), unknown additive fields kept unchanged on read and replacement, repeated or unknown tile ids, over-limit strings, and more than 8 entries;
- a 329-shaped root with no `crate` reading as before;
- a mixed root with a malformed `crate` (for example an array, or 9 entries) beside readable lists, joins and items: the crate rows are read-only, the other benches stay usable, a list, join or item write keeps the raw `crate` exactly, and export carries it;
- Hand mode kept across a tile choice, an answer and a help redraw, off again on a new visit, and never changing a committed row's shown text;
- frozen crate strings that Notes renders unchanged after the catalog wording is edited in a test copy;
- refused Set D pre-display saves, refused preflight, and pure readers;
- the finite title, note, kind, fits, key, position and not-single-longest checks, and the market-version limits on the new strings.

Native testing runs in isolated Chrome as one full journey at 820×1000 (card 10, all eight titles, Hand mode on and off, D1 to D4, Notes), plus representative cases at 320×600 and 1024×768. Source tests, not screenshots, cover all 48 title, mark and mode combinations. The native checks are:
- tap and keyboard tile choice;
- the Hand mode toggle, kept across redraws;
- the underline, italics and quotes visibly distinct, with underline not styled as a link;
- 44 px controls and visible focus;
- no horizontal page overflow;
- a 150% root-font stand-in;
- real Notes download, import and reload with crate entries and D items;
- saving off, two explorers, and stale controls;
- screenshots of the journey's feedback lines and of the pair cards at each width.

Physical iPad Safari, VoiceOver, text zoom and learning effects remain unqualified by Chrome.

Then follow the AGENTS.md landing procedure: independent implementation review on the exact head, combined-tree checks, merge commit, deploy, byte match and receipt.

## Source study and curriculum place

**Jane** was checked 2026-11-01 at `e88f81a00553fb87818ef84c77a8800f0dcb33e4`; upstream HEAD is unchanged since 329. `LESSONS.md`'s teach, then guided, then practice order is studied and adapted, as in 319 and 329. So are worked examples one step at a time, the "I'm stuck" ladder, and three-option choices tagged with a misconception. Medals, mastery, gates, points, timers and step-downs are not adopted. No Jane code or text is copied.

**Marble** was checked 2026-11-01 at `5e23196fa60050433f1440057f65a978d39e63fc` (upstream HEAD, fetched). Punctuating Titles of Works (`mt_Q2Eud_PPz6`) asks for italics or underlining for whole works and quotation marks for poems, songs and articles, used consistently. Its `research` is null, and `data/teaching-research.json` lists it under `coverage.missingTopicIds`. The outside sources in [278's audit](../source-audits/278-exchange-manifest.md) stand in: CCSS L.5.2d, MLA and Chicago, with AP's quotation-mark style noted. This slice covers books, a newspaper, chapters, poems, stories and a song. Films and albums appear only in 278's full grown-up panel, which this slice does not ship, so no coverage claim is made for them and the taxonomy is not updated.

**Prerequisite crosswalk**, from the vendored `curriculum/marble/dependencies.json` (matching upstream for this edge):

| Edge | Strength | How it is met |
| --- | --- | --- |
| Punctuating Titles of Works builds on Punctuating Direct Speech (`mt_-mw3JeIjhU`) | soft | Context only. No built bench teaches speech marks as a lesson ([264](264-speech-marks.md) is proposed); card 10 names quotation marks directly, and the glossary's Quotation marks entry covers both uses. |

The topic has no hard prerequisite, so nothing is gated or assumed.

**Six-act fit:** strand E2-V (punctuation and layout for a reader). It is standalone in the market list version, with no chapter job, as 278 states for the market list version. 278 places the manifest version at Act VI ch. 2, *The book crate*, and that version is not shipped here.

**Teaching contract ([49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):**
- **Target:** show a title of a whole work in italics (underlined by hand) and a part or short work in quotation marks.
- **Teaching encounter:** card 10.
- **Contrast:** a whole book against its chapter, and a book of poems against one poem inside it; typed italics against handwritten underline; a title against plain words.
- **Supported practice:** the crate's per-title feedback, guided D1, the ladder and per-choice feedback.
- **New application:** D3's single sentence holding a chapter and its book together.
- **Purposeful revisit:** the *Willowbank Gazette*, which children meet in the story, now as a title.
- **Data boundary:** codes and frozen display strings only, local, with no typed text, voice or image.

Sources are [the 278 source audit](../source-audits/278-exchange-manifest.md). This slice copies no upstream code, lesson prose or art.

Independent subject-source refresh in final review: the actual Gutenberg contents confirm the three book/part relationships above. The Morgan Library collection records support the displayed publication dates: [Grahame1908](https://www.themorgan.org/printed-books/111977), [Stevenson1885](https://www.themorgan.org/printed-books/78977), [Kipling1902](https://www.themorgan.org/printed-books/170135). These replace reliance on a later Gutenberg edition or search snippets for those dates. Current [MLA guidance on fictional titles](https://style.mla.org/title-of-a-fictional-work/) supports using the ordinary long/short-work convention for the authored titles while retaining the style hedge. No source prose or art is incorporated.
