# 357 · Pip's second copy: finite material

Companion to [357](../specs/357-pips-second-copy.md), proposed, not shipped. Original project fiction from120/268; new instructions/meaning cues/examples below are original. All material is supplied and partner-readable. No audio assets or oral/independent spelling assessment.

## Shared copy

| Key | Text |
| --- | --- |
| Existing table buttons | Revise the postcard / Try a job |
| Page-deck button / title | Copy the third page |
| Opening | Pip copied the third page in a hurry. Check his spelling against the page, then read for meaning. You can keep a version and change it later. |
| Current instruction | Choose a spelling for this sentence. Tell your partner why it fits. |
| Reference panel | The page to copy |
| Original-copy panel | Pip's first copy |
| Current-copy panel | This version |
| Full reference fold | Read the whole third page |
| Full copy fold | Read this whole version |
| Story fold | Pip checks his copy |
| Short story | Nuria read the page while Pip copied it. Some spellings got mixed up. The librarian has the page here so you can check. |
| Longer story | The librarian reads Pip's words: "Their are three Weighs." "Weighs?" asks the librarian. "Like scales," says Pip. "Those are for weighing," says Dot. "Here the page means paths. Read the sentence and check its spelling." |
| Source caption | Hollis's third page: {title} |
| Partial | Some of this earlier copy cannot be shown. The readable words are still open; the full earlier material stays in your notes. |
| Context unavailable | This earlier word has no separate sentence view. Read it in the full copy. |
| Reference unavailable | This earlier page reference cannot open here. Your copy is kept in your notes. The postcard and other jobs are still open. |
| Hidden-note summary | Earlier page-copy work is retained in the full notes download. |
| Child unreadable | This earlier page copy cannot open here. The postcard and other jobs are still open. The earlier material stays in your notes. |
| Incomplete | Choose a form for each marked word, or keep this copy for later. |
| Different | Some choices differ from the page. Read the word notes and compare. |
| Fit | These choices fit the supplied sentence clues. Read the copy with your partner. You can keep it, or try another. |
| Partial fit | These readable choices fit their supplied sentence clues. Some of the earlier copy is unavailable. |
| Neutral | Read for the meaning this sentence needs. |
| Read copy | Read this copy with blanks |
| Read intro | Each marked word will be read as blank. |
| Read source | Read this source sentence |
| Keep acknowledgment / restore acknowledgment | This version is kept. / This version is open to revise. |
| Adult line | Supplied reference, spelling choices and meaning clues. This does not show independent spelling, reading, copying or pronunciation. |
| Adult details | The page and each source sentence are provided. The task never judges a spoken explanation. A kept version is not an edit to Hollis's page. Earlier choices and checks stay as they were. |

Reuse335's existing picker, Previous word, Next word, Put back, Check this version, Keep this version, first/latest/reopen, step controls, notes and refusal labels. Deck1 labels and data remain unchanged. Child-facing deck2 says copy/page rather than postcard. No new practice jobs are commissioned. The third button extends the existing navigation; it does not add a second deck-navigation row. The source-caption template inserts only the frozen reference title, not today's title.

## Canonical original and Pip's full first copy

The actual source is `actThreeContent.page.original` in the constructor's current release, frozen after the page-visible gate. Current text (including its final tail and signature):

> There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford. Keep them open, even in winter, even when nobody seems to need them. Someone always does. There are also the water's ways, which are where it goes when there is too much of it. Those need keeping too. A town that closes them [smudged] finds out where the water goes instead. H.

Pip's first copy changes only the eight marked forms below, preserving everything else:

> Their are three Weighs between Willowbank and Vadoalto: the river path, the bridge rode and the hi ford. Keep them open, even in winter, even when nobody seems to knead them. Someone always does. There are also the water's ways, witch are wear it goes when there is to much of it. Those need keeping too. A town that closes them [smudged] finds out where the water goes instead. H.

## Eight slots

IDs are lower-case in the left column. The displayed strings preserve sentence case. Choice IDs are the displayed word lower-cased with `theyre` and `ways-possessive` for the apostrophe forms. The original choice's visible label adds **(leave it)**; its literal `text` does not. Right forms sit B,A,C,B,A,C,A,B. Do not reshuffle a retained source.

| ID / picker label | Original | Choices in order | Key | Meaning clue |
| --- | --- | --- | --- | --- |
| there / Paths that exist | Their | They're · There · Their (leave it) | There | This sentence says that three paths exist. It does not say the paths belong to someone. |
| ways / Three paths | Weighs | Ways · Way's · Weighs (leave it) | Ways | The writer is naming more than one path. Weighs is something a person does with scales. |
| road / The bridge path | rode | rowed · rode (leave it) · road | road | This names the path by the bridge. It does not tell about riding or rowing. |
| high / The ford | hi | hie · high · hi (leave it) | high | This says the ford is up high. Hi is a greeting; hie means to hurry. |
| need / Keeping paths open | knead | need · kneed · knead (leave it) | need | Someone may require the paths. Nobody is pressing and folding them like dough. |
| which / The water's ways | witch | wich · witch (leave it) · which | which | This word connects the water's ways to the explanation that follows. It does not name a witch. |
| where / Place for the water | wear | where · ware · wear (leave it) | where | This points to the place the water goes. Wear can mean having clothes on. |
| too / The amount of water | to | two · too · to (leave it) | too | This says there is more water than is wanted. It is not counting two things. |

## Exact active reference/copy contexts

Each row supplies a literal `referenceText`. The copy context is its before/after around the active slot, with that slot's current trial inserted. Other slots in the same sentence are supplied in their reference forms in this local context; the folded **whole copy** still shows all actual trials. Say **This word in the page's sentence** above this local context, so it is not misrepresented as the full current copy. Do not manufacture these sentences from today's key when resuming saved work.

| Slots | Reference text | Before / after for each active copy slot |
| --- | --- | --- |
| there, ways, road, high | There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford. | there: empty / ` are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford.`; ways: `There are three ` / ` between Willowbank and Vadoalto: the river path, the bridge road and the high ford.`; road: `There are three Ways between Willowbank and Vadoalto: the river path, the bridge ` / ` and the high ford.`; high: `There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the ` / ` ford.` |
| need | Keep them open, even in winter, even when nobody seems to need them. | `Keep them open, even in winter, even when nobody seems to ` / ` them.` |
| which, where, too | There are also the water's ways, which are where it goes when there is too much of it. | which: `There are also the water's ways, ` / ` are where it goes when there is too much of it.`; where: `There are also the water's ways, which are ` / ` it goes when there is too much of it.`; too: `There are also the water's ways, which are where it goes when there is ` / ` much of it.` |

Visible local-context heading, exactly: **This word in the page's sentence**. Its visible note is **The other words here come from the page. Your whole version keeps your choices.** This is a supplied sentence frame, not a second free text or a report that the other words were chosen. In particular, an unchosen high can appear in another slot's supplied context without setting a learner placement or a correct check.

## Different-choice feedback

Every selected non-key form uses its exact row below. Then the source-owned meaning clue may be read. No line says a word does not exist in every period, dialect or language.

| Choice in slot | Feedback |
| --- | --- |
| They're in there | They're means they are. This sentence already has are. |
| Their in there | Their points to something belonging to them. Here the sentence says that paths exist. |
| Way's in ways | The apostrophe does not make the plural this sentence needs. The page names three Ways. |
| Weighs in ways | Weighs tells about finding a weight. Here the writer is naming paths. |
| rowed in road | Rowed can tell about moving a boat with oars. Here the word names a path. |
| rode in road | Rode tells about earlier riding. Here the word names a path. |
| hie in high | Hie means to hurry. This sentence says the ford is up high. |
| hi in high | Hi is a greeting. This sentence says the ford is up high. |
| kneed in need | Kneed can mean struck with a knee. Here someone may require a path. |
| knead in need | Knead can mean press and fold dough. Here someone may require a path. |
| wich in which | Here the connecting word is spelled which, with wh. Compare it with the page. |
| witch in which | A witch is a person in our story. This word connects the ways to their explanation. |
| ware in where | Ware can name goods. Here the sentence points to a place. |
| wear in where | Wear can mean having clothes on. Here the sentence points to a place. |
| two in too | Two is a number. This sentence means more water than is wanted. |
| to in too | Here too much means more than is wanted. The page spells too with two o's. |

## One teaching card and four manual steps

Card id `copy-source-357`, title **Check meaning, check the page**.

Text: **When you copy a page, keep what you can read. Check a spelling in its sentence. Leave an unreadable place marked [smudged] rather than guessing.**

Example title: **Paths, not scales**.

1. Read Pip's phrase: three Weighs.
2. The sentence names paths between towns. Weighs tells about finding a weight.
3. The page spells the path word Ways. Choose Ways in this version.
4. The end of the page still has [smudged]. Keep that mark; we do not know the missing words.

Showing these steps is supplied help and is not an observed oral explanation. The source/reference and all page-copy checks are already described as supported and guided; no extra independence flag is inferred from not opening this card.

## New use and return

Fold title **A new errand for Pip**.

Prompt: **Tell Pip where to put a boat. Then tell him what to wear on a rainy walk. Your partner can write your words on paper. These words stay between you.**

Contrast: **Where points to a place. Wear can mean having clothes on. The words may sound alike; the sentence tells you which meaning you need.**

Return prompt: **Choose another word, revisit a kept version, or return to the postcard.**

Optional adult note: **Some speakers distinguish which and witch, or where and wear. Model your natural speech; sound alone is not this task's check. The displayed reference supplies spellings. A child can match print without explaining meaning. Ask, listen and discuss; the app does not judge that explanation. The bracketed smudge marks missing writing, not a spelling to fix.**

No new audio or compulsory celebration. Keep acknowledges a version without claiming that a page was repaired, a message was sent or a chapter was completed.
