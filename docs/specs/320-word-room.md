# 320 · The Prop Box: first adult-read Word Workshop room

**Draft for independent specification review. No implementation clearance yet.** This commissions the text-first foothold in the roadmap's writing/reading lane, using the twelve candidates in brief55 and its [written content panel](../reviews/55-phonics-content-2026-10-30.md). It does not commission audio, change brief55's gates or turn Word Garden morphemes into phonics evidence.

## 1. Problem, story and boundary

Word Garden has meaningful word parts and parcel plurals, but no place to connect the three printed positions in a simple word with an adult's spoken demonstration. The library's little theatre has recovered its props after the storm; Dot needs labels for the prop box and short scenes to read together. This supplies an Act I contribution, usable from any arrival and at any time, under spec120. It remains useful in later acts for making labels and puppet stories. It never requires completing a supper, an act or another lesson.

At `#words/sounds`, add **Word Workshop · The Prop Box**, reached from Word Garden. Any of the twelve word cards and three shared miniatures is open. Existing `#words`, `#words/endings`, Paris and Story Loft retain their meanings and saved work. Spec250's later letter-team room must extend this door rather than replace these saved sources. No new top-level destination or automatic curriculum placement.

The mandatory deliverable is an **adult-read visual workbench**, not a substitute audio player. The room renders no Hear control for target words, letters, phonemes, blends or passages and makes no speech request. Ordinary screen-reader access to text stays available; it is not advertised as reviewed phonics audio. No media manifest, recognizer, microphone, remote model or recording is part of this slice. The owner still chooses the production variety before audio production.

## 2. Teaching encounter and spiral

Follow spec49 §5, with the scope exceptions in the [source audit](../source-audits/320-word-room.md):

1. **Teach:** show a prop/action, its short meaning and whole printed label. Invite the adult to say the word and demonstrate its three sounds while pointing left to right. The constituent letters stay available; knowing their names is not presumed to supply their sounds.
2. **Contrast:** mat and sat share their last two positions; changing the first sound changes the word. Analogous comparisons stay inside each of the three families. The twelve-word inventory does not supply a vowel-only or final-sound-only contrast.
3. **Supported practice:** tap letter tiles into three numbered places, with an optional visible word model. Allow reuse of a letter, including both p positions in pop. A match means the pictured label has been assembled, never that it was read independently.
4. **New use:** put a label beside its prop, then meet it in one adult-supported miniature. Non-target words remain explicitly adult-provided.
5. **Return:** reopen any label, compare a sibling, or read another miniature. Suggest mat then sat on a fresh visit; no scores or inferred levels change the suggestion. A later separate slice may introduce other sound positions and letter teams.

Every action here is supported exploration. Label encounters, pointing, visible models, adult pronunciation and shared reading do not prove independent decoding, spelling from dictation, fluency, comprehension or transfer. No independent-attempt field, mastery level, speed, score, lock, penalty or math exposure is written.

## 3. Interaction and exact material

Use the [finite copy](../content/320-word-room-text.md), brief55's twelve meanings and three exact shared texts. Original SVG props distinguish a mat from a blanket; a toy sporting bat from the animal; a badge pin; a small lidded metal tin; one fin on a toy fish; a storage bin; a small puppet hop; a mop; a spinning top; and a bursting bubble. Sat gets a before/after picture. All art has a concise meaning alternative. Do not require physical hopping or handling a pin.

The board has three short pages, **Meet the prop / Make a label / Read together**, with explicit Back/Next controls and a persistent compact view of the chosen prop/label. Changing pages preserves tile positions and the chosen target. All twelve cards and all three texts are also directly selectable; no completion gate. A separate optional **Point through the word** display advances one of three positions manually, then the whole word. Its dots are sound positions in these examples, not syllables or timing measurements. It never animates or plays automatically.

Each word has its own draft. Choosing another prop preserves the waiting draft rather than clearing it. Initial/default draft values are slots `[null,null,null]`, place0, modelShown true and point null. No word is selected until a card is chosen; a text can be the first choice. The saved page is meet/build/read; temporary example and check-result views are presentation state only.

| Explicit action | Selected word / text / page | Draft effect |
| --- | --- | --- |
| First card choice | Copy the collection, select that word, textId null, meet. | Create only that word's default draft. |
| First text choice | Copy the collection, selectedId null, select that text, read. | No word draft is created. Hide label/page-next controls that require a word; every card remains selectable. |
| Another card or gallery revisit | Select it, meet; retain the previous textId. | Restore that word's draft or create its default; other drafts stay exact. |
| Meet → Make / Back to Meet | Same target/text, build/meet. | Preserve all draft fields. |
| Read together from a card | Same target, select its linked readable text, read. | Preserve every word draft. If the linked text is unreadable/missing, show the open text chooser and an explanation; do not invent or replace the saved text. |
| Direct text choice | Same target (possibly null), selected text, read. | Preserve every draft. |
| Back from reading | Same target/text, build if a readable target/draft exists; otherwise the chooser. | No draft changes or automatic repair. |

An optional **Show a different example** demonstrates another retained word without changing the target or any draft. Prefer fin, or mat when the target is fin. If either is absent, choose the first other readable retained word; if none exists, explain that this earlier collection has no separate example and leave practice open. Four manual frames show the example's meaning/whole word, then placement of its first, middle and last letters while an adult supplies the sounds. **Previous example part / Next example part / Back to my label** operate only on the local example view. Returning restores the exact page, selected place, model, pointing and tiles. No speech, auto-advance or help/reading score is produced.

Tile input: select one of the three places, then a native button from the retained `source.alphabet`. The initial authored collection uses `a b c f h i m n o p s t`; reopening never substitutes that current bank for an earlier alphabet. A tile replaces that place without consuming stock. **Clear this place** and **Clear label** work immediately. Selection, buttons and filled places have explicit accessible names. The word model can be shown/hidden without changing the draft. No drag, hover, long press or physical keyboard is required.

**Try this label** handles four cases without erasing the target or tiles:

- Incomplete: name the first empty place and move focus there.
- Matches the chosen source word: offer **Put the label with this prop**. The gallery records an encountered label only on this explicit action.
- Matches another readable word in the frozen collection: name/show that prop and offer **Keep this other label** or **Back to my prop**. Keeping it does not replace the waiting target or tiles. This is a discovery, not a wrong reading result.
- Other combination: display the exact escaped letters and invite an invented prop/story. Say only that this label is outside this prop box, not that it is not a word. Offer **Change a letter** and **Back to my prop**; do not pronounce or grade the combination.

Tile edits, clearing, target selection, page changes, example opening and collection replacement clear the pending Try result and its Put/Keep actions. A result owns the exact notebook/owner/route/view, retained source object, target id and three-slot value it checked. Put/Keep rechecks that tuple before acting. Editing sat to bat after Try cannot keep either through an obsolete action, even if the old control is still connected. A stale action makes no write and shows no success. Keeping another label adds only its source id to the gallery; it does not allocate or overwrite that word's draft or replace the waiting target.

Shared texts preserve the exact brief55 strings and token classifications. Mark targets with both weight/underline and a text key; adult-supplied words remain ordinary readable text with an adjacent adult-read explanation. Do not hide or guess them from the current letter inventory. Each text has its existing open meaning question for discussion, with no answer choices or score. Its prop scene supports meaning, not an independent-reading claim. Story Loft is an open invitation to invent another scene; no imported text or learner work is written there automatically.

Win condition: every word id in the retained source collection is readable and appears in the gallery. The initial collection has twelve; do not hardcode twelve into saved-collection completion. An unreadable entry pauses the collection milestone, with an explanation; do not silently exclude it or count gallery length alone. All other readable cards and texts remain available. When complete, say the prop box has its labels, offer the retained readable miniatures and **Make another scene**, and keep every card open. This is a finite story contribution with unlimited revisits, not a reading certificate, act ending or commissioned film. Do not mutate the town's story services or Keeper's Pages.

## 4. Saved material and preservation

Use a new optional `wordRoom` root. Rendering an unopened chooser makes no write. The first explicit card/text choice copies the authored collection into a versioned source and preflights the actual Notes report before installing it. State version1 contains:

- `source`: `{id, revision, alphabet, words, texts}`; words/texts are objects keyed by source-local stable ids, not arrays. Alphabet is a unique array of lowercase single ASCII letters. A word owns `{id,label,letters,sounds,family,textId,meaning,art,guidance}`. A text owns `{id,title,text,tokens,prompt}`.
- `selectedId`: source-local word id or null; `page`: meet/build/read; `textId`: source-local text id or null. Nullable ids support first entering through a text. No automatic selection is saved on render.
- `drafts`: object keyed by word id, with `{slots,place,modelShown,point}` as specified above. Drafts are created only on explicit word choice. An unreadable draft pauses that card, not its siblings.
- `gallery`: unique word ids explicitly placed or kept. No correct/incorrect counters or oral observations. Examples and pending Try results are local presentation state and are never installed by load/import.

Version1 validation contract:

- Root: non-array object, version1, object source/drafts, legal page, nullable coded ids, unique gallery of coded ids. Source id is a code, revision a positive safe integer; alphabet has1–26 distinct lowercase ASCII letters; words has1–128 own entries and texts0–32. Codes match `[a-z][a-z0-9-]{0,79}`. Other JSON-safe fields remain untouched. The existing transfer layer remains responsible for global JSON depth/node/unsafe-key/byte limits. Failures in these structural root fields make the root unreadable and retained, not fresh.
- Word entry: id matches its own key; label is three lowercase ASCII letters and equals its own three single-letter `letters`; those letters belong to its retained alphabet. `sounds` has three nonempty strings of at most24 characters, interpreted only as adult reference, never accepted audio or a linguistically validated transcription. Family and art are codes; textId is a code or null; meaning1–500 and guidance0–1500 characters. Unknown art codes use an honestly generic prop drawing and the saved meaning, not an invented familiar picture. Invalid word values stay raw and pause only that word.
- Text entry: id matches its key; title1–160, text1–4000 and prompt1–500 characters; tokens array1–512. Each token has exact text, integer start/end in the retained text's UTF-16 code units, and role target/adult-supplied. Require sorted nonoverlapping positive spans and exact text slices. Roles are retained source classifications, not a fresh linguistic judgment: the reading view underlines them without needing a word-card lookup. Do not impose a word-membership check that this view does not consume, or infer/rewrite roles from today's letters or catalogue. Invalid spans/roles pause only that text, preserving its raw value. Spaces and punctuation outside tokens remain unchanged.
- Draft entry: three null-or-retained-alphabet letters, integer place0–2, boolean modelShown, point null or integer0–3. This is material, not an asserted correct result. A bad draft or unreadable selected word shows that card's paused notice and the open chooser without resetting it.
- References: selectedId, textId, draft keys, gallery ids and word→text links may reference absent/unreadable entries. Retain them; do not delete, rebind or add them on load. A missing reference is locally unavailable, cannot be used for a new Put/Keep, and prevents collection completion when it corresponds to an unreadable required word. Unknown extra gallery ids do not satisfy another word or increase a completion count. Duplicated entry ids under different keys fail the affected entries' id/key checks; no current catalogue comparison is involved.

Keep outcomes/status wording as runtime codes, not persisted UI sentences. The displayed draft, target, collection and gallery travel through the existing Notes import/export and separate explorer storage. Reopening uses its saved source, not today's label/meaning/key. A source-copy edit cannot regrade or relabel earlier material. Validate shape, stable codes, bounded values and self-consistency only. Do not require exactly today's twelve words, three texts or alphabet inventory. Current content is not a load-time answer key.

Read word/text entries independently: an unreadable or unknown entry stays raw and pauses only that card/text; other readable entries and all other destinations stay open. Unknown root versions stay raw with an explanation and Notes download link. Any offered replacement is explicit, cancelable, preflighted, and retains the raw earlier value using the existing recovery convention; no automatic repair or migration on render/import. Do not mutate the old `words`, parcel labels, passages, exposures or story roots.

All mutations clone/preflight against the actual existing `notesReport`/`prepareProgressImport` limit before commit, using the existing Parcel Labels transaction pattern rather than a second transfer system. A refused write leaves material unchanged, focuses a connected explanation and offers Notes. Saving-off work remains usable and downloadable; a storage failure is reported honestly. Source/draft/galleries remain separate across explorer switching. Same-tick departed controls, double confirmation, detached nodes and controls retained across import/reset/chooser navigation must be inert. Guard notebook identity, owner, exact route and active view before committing or showing action feedback.

## 5. Integration, access and scope

Adapt the exact-route branch before the generic `root==='words'` fallback in `dist/app.mjs`, including the existing explorer-initialization, chooser, welcome-film exclusion, restoration and route-cleanup conventions. Reuse bounded core/UI/content modules and existing transfer/recovery patterns. Add one link in `word-garden-ui.mjs`; add a scoped Notes summary and README commands. Do not reshape the app router or make a shared game framework for this slice.

At320×900,820×1000 and1024×768, the current instruction, target and next main action must be visible together without page-wide horizontal scrolling. At narrow widths the letter bank wraps; page controls stay ordinary in-flow controls. Use44px-or-larger tap targets, native buttons, persistent text labels and visible keyboard focus. No color-only distinction. Page changes focus the new heading; tile changes return focus to the chosen place or its native tile, and status messages describe the actual completed action. Browser Back, Word Garden return and explorer chooser preserve the saved draft. Reduced motion uses the same manual views; there is no decorative automatic animation.

The written panel in brief55 informs content choices but does not clear this design. All mandatory behavior above needs six independent specification lenses, then an independent Claude implementation review of the exact candidate. Literal copy, sense-specific drawings and the actual child view also need substantive review; a source checker is not linguistic or illustration approval.

## 6. Verification and later increments

Required source/model checks cover all twelve words, three-position/repeated-letter semantics, all three shared texts and token roles, every page/point/example step, each result branch, gallery deduplication, all-card openness, preserved per-card drafts and exact example return, obsolete Put/Keep after same-view edits, old-source changes, a retained collection containing zip and the z tile absent from today's bank, variable-size collection completion including unreadable entries, absent/unknown/partly unreadable data, actual report-limit refusal and no unrelated-root writes. Generated letter combinations are literal experiments only; no unreviewed pronunciation or dictionary claim may emerge.

Native browser checks exercise actual tap/keyboard paths and page focus at the three viewports; alternative known-label discovery and arbitrary combinations; shared-reading scope; no speech/media request; actual Notes download/import/cancel/failure/reset; two explorers; saving-off/storage failure; reload; same-tick stale controls; late confirmation; and exact-boundary refused writes. Regress the existing Word Garden and Parcel Labels routes. Run the repository source runner. These establish functional behavior, not physical iPad/Safari, spoken output or learning effects. Merge/deploy only after the existing exact-head gates.

Later, separately commissioned: reviewed word/segment/blend audio under brief55's owner decisions; isolated sound policy; explicit vowel/final-sound contrasts; sh/ch/th room from250; unfamiliar-word decoding with human observations; dictation/handwriting; longer decodable texts. No promise that this first collection satisfies those steps.
