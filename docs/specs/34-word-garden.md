# 34 — Word Garden: words, meanings and discoveries

Status: implemented and published on Cloudflare; independent spec/content and implementation reviews cleared. Develops the word-part door of spec 04 and the idea in PR #6; town/seasons/almanac are separate future work. This release runs at `#words` in the existing static app. Keep the PR draft; do not deploy this child-directed experience on ChatGPT Sites under its current under-13 restriction.

## Purpose and play

Help restore words to the storm-scattered library signs. Choose one of ten base-word plants (pack, tie, lock, read, build, paint, kind, help, play, care), then one of six cuttings (un-, re-, -er, -ful, -less, -ness). Tap **Try this combination**. No dragging, timing, points, correctness score, wilted plants or compulsory sequence.

The result shows its actual construction in the correct prefix/suffix order. There are 23 authored blooms: unpack/repack/packer, untie/retie, unlock/relock, reread/reader, rebuild/builder, repaint/painter, unkind/kindness, helpful/helper/unhelpful, replay/player/playful, careful/careless. Each has an original scene, accurate meaning and whole-word/sentence narration. A helpful bloom offers **Add another part**, using helpful as the base; un- + helpful yields unhelpful. This is an explicit two-part construction, not help + un- magically adding -ful. Other helpful combinations use the same discovery treatment.

Every other pair is a discovery, never a rejected word. Supply narrow reviewed explanations for unread (adjective, not yet read), unbuild (take apart), unpaint (remove paint), kinder (comparative -er), carer, locker (a thing that locks), helpfulness, helpless and unhelpful's two-part construction. Label those outside the bloom collection as **Another real word**. Show separate morphemes and the authored surface spelling: care + -er → carer, with an explicit note that the final e is dropped. Do not display care-er as the real word. Tie + -er stays a letter experiment, because the spelling tier is usually spoken as a different word. No general spelling parser is implied.

For combinations without an authored meaning/spelling, say **A word to wonder about**, show separated labelled parts as a **Letter experiment** (no unchecked joined spelling), and "What could these parts mean together? You might discover an unusual word, or invent one for a story. Try a meaning in a sentence together." No dictionary claim, invented pronunciation or implicit linguistic prohibition. Narrate only the safe complete discovery invitation, excluding the unreviewed construction. No free-text entry or recording is needed.

Every result can be replayed and explored with another cutting. A notebook shows encountered blooms and discoveries as selectable word labels; no total, percentage, locked outline or completion reward. A discovery is as welcome as a bloom. Ten roots × six parts plus six helpful combinations keep this finite catalog inspectable; this is not a general morphological parser or exhaustive dictionary.

## Wondering and access

Eight original discussion cards cover re-, un-, agent -er, careful/careless, unhelpful, two transfer words (unhappy/thankful) and inventing a meaning. Every card is directly selectable and remains available. Optional **Another wondering** selects an unseen card, then cycles; no new-word threshold. Transfer targets need not have been grown. Choices reveal an authored explanation and invite discussion, never mark right/wrong, score the child or feed practice suggestions. The open card offers We wondered / Another day. Persist the current card and selected discussion choice. Acknowledgements mean only that a card was visited, not that reading or transfer was observed.

## State and integration

One additive per-explorer `words` extension: `{version:1,grown:[knownWordId],discoveries:[validPairId],seen:[questionId],draft:{base,part,result,questionId,choice}}`. IDs and enums are catalog-bound and unique, no personal text/audio. A missing extension is fresh; a present invalid/unknown version stays byte-for-byte in its raw object, is exportable and blocks Word Garden mutations with a clear notes link. Do not silently normalize away old work. Known valid state is bounded by the finite catalog, no histories or new learner model. Actions check the whole extension before mutation. Rendering is read-only; only explicit actions create the extension.

Reuse existing ExplorerStore for saves, explorer switching, save-off, export and reset; reuse `hearButton` and device-local optional speech for reviewed complete words/sentences. No isolated phoneme/affix pronunciation or sound-level teaching. No claim that browser speech has reviewed phonics audio. Grown-up notes report encountered words/discussion invitations, with no independent-reading, spelling, mastery or grade inference. Link from home and Explore; invite reading a Paris message as another context, without transferring evidence or creating a town job before that game exists. The full authoring atlas gains only a scoped Prefixes and suffixes reference; keep the runtime prerequisite graph unchanged.

## Design and accessibility

A potting bench between a row of word plants and a basket of cuttings; a large illustrated bloom or curiosity sprig shows the result. Notebook tabs and small original SVG library-sign scenes keep the purpose visible. Follow the existing Georgia/Trebuchet type and garden palette: leaf #397958, ink #183f39, sky #abc4da, pollen #e9b84a, lilac #b4a6c8 and white. Spend visual emphasis on the word construction. All plant/cutting choices use labelled buttons with aria-pressed, at least 48px targets, visible focus and text equivalents. Prefixes precede bases, suffixes follow them; meanings/scene sentences are explicit. After trying a pair, focus the result heading; notebook replays do likewise. Choice changes do not drop results or discussion drafts. No automatic audio or advancement; reduced-motion has no growth animation. Phone layout stacks the workbench; tablet keeps plants and cuttings beside it. No external fonts/assets.

## Upstream and scope

Refreshed Jane `LESSONS.md` at `0a2acf3efbf81f00027afd6bdd108c0f89f7c3cc` and Marble topics at `96a7933754af672e1bfdbf7ecb05c325860c6e0d` on 2026-10-19. Jane's purposeful quest/glossary and review conventions are design references, not imported code/prose or learner state. Marble `mt_HrgDjxcWvf` informs a narrow prefix/suffix meaning connection; exploration/discussion does not satisfy its full criteria. New content/art/code are original; existing attribution/license layers remain. Collins' unpaint entry supports the reviewed exception. Retain spec 04's separate reviewed-phonics-audio requirement for a later sound door. No town, weather, almanac or general text generator in this release.

## Validation

Check all 66 pairs, all 23 blooms/parts/meanings, two-stage helpful→unhelpful, every exception, all question reachability including transfer cards, no score/mastery output, no unknown-result speech, exact draft replay after reload, invalid/future raw state preservation and mutation rejection, explorer isolation and real save-off/export/reset. Independent content/spec review before implementation; independent implementation review and root phone/tablet/keyboard/browser QA before delivery. Run relevant existing logic suites. Keep this build in its own draft PR stacked on the current connected-garden branch; do not merge without exact-head clearance.


## Delivery verification

Independent review checked all 23 bloom meanings, the additional real-word explanations and all eight discussion cards. Its spelling finding was folded into an authored carer result and separated unknown constructions. Independent implementation review cleared after adding the new route to the existing invitation test allowlist. All 36 logic suites and story-pack/atlas checks pass, including 1,679 Word Garden checks. Root browser QA covers real combinations, two-stage helpful/unhelpful, discovery replay, unexpected discussion choice and reload, actual downloaded notes, keyboard focus and 768px/390px layouts. A local preview cache failure was isolated to conditional cached module responses; no-cache preview responses restored and verified reload without an app bootstrap change. Cloudflare publication is verified below; no physical iPad Safari test is claimed.


## Cloudflare publication follow-up

Published the reviewed runtime candidate `7d361d6` at https://after-the-storm-learning.anotherpanacea.workers.dev/#words. New Cloudflare deployment verifies exact reviewed HTML/modules/CSS/data and blocks setup-only paths. A real hosted word bloom and saved notebook survived reload. The new origin starts a separate notebook; old-origin records remain there and no transfer/reset was performed. Root-only CLI setup files were excluded by an explicit assets directory; no account metadata or deployment credentials were added to the public repository. Word Garden remains draft/unmerged on GitHub pending its normal exact-head clearance.

Republished the same reviewed runtime to the requested personal Cloudflare account. The current canonical address is the link above; the earlier Cloudflare deployment remains intact. Verified all 81 hosted static assets byte-for-byte and confirmed deployment configuration/cache paths return 404. Each origin retains its own notebook.
