# 326 · Both Ways Across Willow Bridge: finite text

Companion to [spec 326](../specs/326-both-ways-across-willow-bridge.md). Proposed runtime text, not shipped.

## Reused exactly

These are copied exactly, and not re-quoted here:
- From the [Act III story text](120-story/act-3.md):
  - the hook;
  - the opening, Short and Longer;
  - each chapter's title, Short and Longer;
  - the Keeper's notes of chapters 1 and 3 (chapters 2 and 4 are below);
  - the ending, Short and Longer, with Nuria's two lines;
  - the four season lines;
  - the almanac line and the between-acts line.
- From [the Keeper of the Ways text](120-keeper-of-the-ways-text.md) §3: Page 3's edge word, the "When it comes free" line, Short, Longer and Hollis's page.

`{guide}` and `{courier}` resolve as in [248](248-a-town-of-our-own-text.md).

Act III's chapter jobs are not used here. This slice reads one built activity per chapter instead, with the lines below. In particular, the Sprout, Seedling and Sapling job lines and their Kept lines are not shipped, except where a line below repeats one on purpose (chapter 3's Kept line). The Keeper's Desk case ideas and teaser are not shipped either.

**Chapter 2 Keeper's note, for this slice.** Its authoring check isn't settled, so the note ships without that sentence: *Reeds are wetland plants. The orchard keeper has just noticed something about her low corner.*

**Chapter 4 Keeper's note.** It is not shipped. Its Spanish and French word pairs belong with Léon's letters, which are out of scope.

**Foreign-language text.** With those two changes, the only non-English text that ships is two Spanish phrases: *"¡Pan, cestas, miel!"* (chapter 1, Longer) and *"Carrizo"* (chapter 2, Longer). The spec 117 model panel passed both as written ([326 panel](../reviews/326-spanish-panel/resolution.md)). A later change to either phrase needs a new panel pass.

## The act hub

| Where | Text |
| --- | --- |
| Invitation, under the opened first letter and on the Keeper's Pages | **Go beyond Willow Bridge** |
| Hub heading | Act III · Beyond Willow Bridge |
| Carried question label | The question the town is carrying: What does upstream know? |
| Chapter buttons | The floating market · The seed exchange · The route by the high ford · Letters up and down the river |
| How the ending opens | Bring work from any three chapters. Then the seedlings can go up the river. |
| Count line | {n} of 4 chapters have work in this story. |
| Back link from a chapter | ← Back to Beyond Willow Bridge |
| Return link on a host page, once Act III has started | Bring work to Beyond Willow Bridge |

The explicit Start action uses the invitation's words, **Go beyond Willow Bridge**. Reading controls reuse **Short** · **Longer** · **Read this aloud** from the 248 companion. Page 3's third reading is **Hollis's page**, from 120 companion §3.

## The four chapters

Each chapter shows its reused text. Then comes a **From your work** panel with one host, its candidate list, a **Visit** link and an Offer button.

**1. The floating market** · River Market, *La carga*
- Intro: Marisol's barge is unloading at the landing. Help with the cargo, then bring that errand here.
- Visit link: Visit the River Market
- Candidate label: *La carga*, try {tryId} ({short sentences / a longer note}), using the try's frozen amount
- Offer: **Offer this unloading**
- Kept: Marisol ticks the cargo off her list and waves from the barge.

**2. The seed exchange** · the seed exchange table
- Intro: Apple seedlings for Vadoalto, reed for Willowbank. Bring an exchange plan you kept.
- Visit link: Visit the seed exchange table
- Candidate label: Exchange plan {visitId}, {first kept / latest kept}
- Offer: **Offer this exchange plan**
- Kept: Nuria tucks your plan into her bundle of reeds, to take upstream.

**3. The route by the high ford** · Courier Clock Walk
- Intro: A courier who knows the times knows the way. Bring a walk you kept.
- Visit link: Visit the Courier Clock Walk
- Candidate label: {walk title}, kept walk, with the title from the kept snapshot's source
- Offer: **Offer this walk**
- Kept: On time. Dot writes the time in the post office book.

**4. Letters up and down the river** · the upstream post
- Intro: Dot has a post bag for Vadoalto. Bring a question you posted to Nuria.
- Visit link: Write to Nuria
- Candidate label: Your question to Nuria: {question label}, with the label from the question's frozen source
- Offer: **Offer this question**
- Kept: A clear question, sent upstream. Dot pins your copy next to Nuria's letter.

| Situation | Text |
| --- | --- |
| No candidate in this chapter | Nothing from {activity} is ready to bring yet. Visit, keep some work, and come back. Every activity is open. |
| Offered already | Your {kind} is part of this story. |
| An offer that is now unreadable | An earlier offer here can't be read in this version. It stays in your notes. The other chapters are open. |
| A refused write | This couldn't be kept. Your work is unchanged. Download your notes. |
| Some host work can't be read | Some earlier work cannot be read by this version. It stays in your notes. You can choose other saved work or another chapter. |
| The chosen item has gone | That saved work is no longer available here. Choose another; your earlier work stays. |
| Act III can't be read | This part of your earlier story cannot be continued here. Its original record stays in your notes. The Keeper's Pages and every game remain available. |
| Page 3 or the ending not reached yet | This page is still drying. Return to Beyond Willow Bridge whenever you like. |
| A malformed reading choice | An earlier reading choice stays in your notes. This version is showing Short. |

The last five rows adapt the 248 companion's messages, with the town gathering and the old map replaced.

| Code | {activity} | {kind} |
| --- | --- | --- |
| `river-market` / `cargo-errand` | the River Market | unloading |
| `seed-exchange` / `exchange-plan` | the seed exchange table | exchange plan |
| `courier-clock-walk` / `kept-walk` | the Courier Clock Walk | walk |
| `upstream-post` / `posted-question` | the upstream post | question |

## The ending

| Where | Text |
| --- | --- |
| The button, enabled at three chapters | **Send the seedlings up the river** |
| Before three chapters (text, no disabled button) | When three chapters have work, the seedlings can go. |
| After the ending, replay | Read the ending again |
| Next reveal | **Read the third page** |
| After Page 3 | Back to the Keeper's Pages · Keep exploring |

The ending shows its reused Short or Longer text and the season line for the stored season (none for an unknown or malformed season), then **Read the third page**. Page 3 shows the "When it comes free" line, then the chosen reading (Short, Longer or Hollis's page). Then it shows Nuria's second ending line, "Hollis taught me...", and the almanac line. The between-acts line closes the scene.

**Still picture alt text:** Seedlings in a crate go up the river path while a barge comes down with reeds and a honey jar. Nuria stands at the Willowbank flood post, reading the marks.

## Grown-up notes

**Line:** Act III, Beyond Willow Bridge: {not started / started, n of 4 chapters / ended, Page 3 {read / not yet read}}.

**Details:** The story collects work the explorer chose to bring. It doesn't check or score that work, and finishing an act isn't a measure of learning. Every activity stays open before, during and after the story.
