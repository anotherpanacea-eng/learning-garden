# 350 · Sound trails: letters and spoken sounds

Bounded foundation specification for admitted LG-10 / LG-G1, 2026-11-01. Base main4195ccd700d31812029dd9332dccbfd3e3a4f749. Awaiting independent six-lens specification and separate finite linguistic/content review. Runtime has not begun. [Finite teaching material](../content/350-prop-box-sound-trails-text.md); [source study](../source-audits/350-prop-box-sound-trails.md).

## The learning job

The existing labels use three letters for three sounds in selected words. They intentionally leave q/qu and x out. Extend the same Prop Box at #words/props with **Letters and sound counters**, a bounded interactive investigation showing that letters and phonemes do not always match one for one. Do not extend the old three-place case validator to force these words through it.

Dot has found loose counters among the theater props. Partners use them to explore six printed words: fox, fog, kit, quit, mix, quiz. A whole word, literal meaning and picture are supplied throughout. An adult models it; the child adds/removes counters, opens a stepwise letter/sound map, compares two reference models, revises their counters and returns to another word. There is no hidden-target claim, correctness gate, score, timer, recording or automatic answer about the child's speech.

Spec49 §5: teach selected x and qu relationships through a five-frame model; contrast fox/fog's equal letter counts and different sound counts, then kit/quit; support with adult meaning/modeling and freely opened mappings; apply the relationships to mix and quiz; revisit any word with its visit-local counters intact. Six-act E1-I/II; spec120 act-agnostic theater after the storm, with no Page, later identity, chapter contribution or story completion. No atlas/coverage expansion.

This commissions the particular contextual relationships in the companion, not every value of q, u or x. qu is not one phoneme in quit/quiz. The x in fox/mix represents two phonemes. Do not call those two phonemes two syllables, two repetitions of a letter, or a single blended sound. General American is the selected adult reference, with regional vowel realizations left ungraded. No phonics playback is commissioned; brief55 still owns accepted audio, rights and listening.

## Small integration, no new saved root

Reuse the existing word-room-ui.mjs view(book,owner), local.mode, controller AbortController, live guards, redraw and resetWordRoomView rather than another visit manager. Add local.trails and local.mode='trails'. The finite content/pure counter-model helpers and renderer may live in small word-room-trails-content.mjs / word-room-trails-ui.mjs modules. Do not add a registry, route, loader, generic phonics engine or schema migration.

The new entry appears on the ordinary Prop Box chooser and its unsupported-parent view. Its reference material does not need a readable old save: an unreadable parent stays exact while this lesson opens. Select the trails view before rendering the ordinary three-sound opening, gallery, waiting label or grown-up text; those surfaces are absent during the new lesson. Use its own header, prompts and grown-up text from the companion. Existing sound-packet active selection remains first in the host; entry controls exist only on the parent chooser/unsupported view after ordinary packet Leave. Do not modify any of the four sound-message packets, original320 source/drafts/gallery, or the book.

Opening trails creates only a local view object, even when the parent has no wordRoom field. It clones the installed six-word source for the visit. Returning to the parent clears only local.mode back to main; reopening the lesson in that same visit resumes counters and frames. Ordinary parent navigation/writes retain local.trails with the current local.root update. On successful explicit fresh-Prop-Box recovery, clear local.trails after recoverWordRoom succeeds, never on a refused recovery. Leaving #words/props, changing explorer, import/reset, reload or resetWordRoomView ends the visit through the existing lifecycle. No counter is a promised saved label.

No action in trails calls a notebook writer, ctx.save, canExport or a storage/network/voice API. Notes and download/import payloads are unchanged. Capacity/save-off does not lock this pure teaching activity. Do not store counts, model openings or guessed phoneme performance. Earlier labels' missing help flags already do not establish unfamiliarity/independence; these teaching visits must not change that interpretation.

## Exact visit state and transitions

local.trails holds:
- source: cloned six-word finite source, including meanings/art/mappings/frames;
- selected: one of fox/fog/kit/quit/mix/quiz, initially fox;
- compare: boolean, initially false;
- work: exactly those six ids, each with count=0, frame=0 and tool='model' initially.

Count is an integer0–6; frame is integer0–4; tool is model or try. These are trusted local controls, not an import format; no serialized validator or new limits service is needed. Pure helpers reject unknown ids/actions and invalid deltas rather than coercing arbitrary input.

Select word: choose the id, leave comparison and resume that word's count/frame/tool. Entry begins fox's model frame0, teaching before trying. Model/Try switches only that word's tool and leaves counters and frame waiting. Add/take actions work only in Try, change count by exactly1 within0–6, and never compute a right/wrong result. Controls disable at boundaries; a script-held disabled or detached control must not mutate the visit. Count0 is a meaningful empty arrangement.

Model has five manually advanced frames. Frame0 introduces the whole printed word and meaning with all reference sound dots visible but unselected. Frames1–3 mark the three authored mapping groups; frame4 shows the whole mapping and summary. The model's reference dots and the child's independent counter strip are separate labeled material. Do not align the child's arbitrary counters to print or assign the child's sounds to those dots. The count4 reference is four phonemes, not four equally timed audio segments. Adult reference IPA is not shown in child graphics or sound-dot accessible names.

Compare is available only for fox/fog and kit/quit. It shows the two authored reference maps and the companion contrast, explicitly labeled as models; own counters remain untouched. Back leaves comparison to the same selected word/tool/frame. mix and quiz are new uses without a forced comparison or prerequisite. Choosing another word is always available, without an automatic next word.

A mapping group has literal zero-based letter indices and sound indices. All relevant indices are highlighted together, with brackets/connector lines and text, not color alone. x can link one printed letter to two sound dots. qu links two printed letters to two distinct sound dots; the model must not collapse its two sounds because it has one highlighted group. Count all four letters of quit/quiz separately even though qu is highlighted together. The companion supplies the complete source and index table; no model is inferred by counting letters or parsing IPA.

## What is shown

Use a full lesson surface within the room: header/back action, six word choices, one current illustrated word with literal meaning, current prompt, the printed-letter strip, and either the Try counters or the reference model. Pair comparison shows just the two compact maps and contrast, not all six cards. Adult notes are folded after the task. No dragging.

Try has Add a counter, Take one away, and Show the model. The count line is exactly an observation of counters placed, never a statement about reading. Model has Previous part, Next part and Try with counters; the active mapping and literal frame text update manually. Comparing and switching words retain material. Return/focus targets are explicit in the companion. No auto animation and no new sound controls.

Use original pictures for fox, fog, quit, mix, quiz; reuse the existing original kit picture if practical through a narrow helper, without a generic art registry. Meanings are authoritative: action before/after panels for quit and mix; quiz is a prop showing questions, not an actual graded test. Unknown art gives a neutral picture-unavailable message and retained meaning. No external book images or private photos/voices.

At820×1000 put material and controls together. At320×600 and1024×768 preserve readable16px copy,44px controls, visible keyboard focus, no horizontal overflow, and one clear current prompt before adult detail. Modest vertical scrolling is permissible; six expanded lessons or all model frames on one page are not. Reduced motion changes no information. Use explicit button names rather than icons alone. Sound dots have names Sound1...Sound4; no silent IPA or letter-name audio.

## Proportionate acceptance and gates

Before code, independently review six specification lenses and separately every word meaning, reference phoneme sequence/count, mapping, five-frame text, contrast and adult instruction in the companion. Resolve P1/P2. Do not use a letter-count check to certify phonology or a browser speech voice as its model.

Implementation checks use independent literal expectations for six words and the mapping indices, pure transition boundaries, and actual rendered behavior. Book state must remain exactly unchanged throughout complete journeys, including all old sources/drafts/help/keeps/raw siblings. New lesson actions must make no storage, network or speech calls. Root capacity refusal, save-off and unsupported parent do not stop it, and no new root is allocated by opening, navigating or Notes. Recovery/import/reset/owner and detached-control tests establish the actual lifecycle.

One complete tablet native journey covers all six words, the two comparisons, model steps, Try revision and back/reopen. Representative narrow/wide tests cover the longest word, grouped qu, x's two sound dots, focus and pair layout. Retain affected original320 and four-packet regression checks; do not repeat every catalogue at every viewport. Source checks of arbitrary source spelling or every prose line's membership in this document are not required. Register new child-facing source scopes narrowly.

Use affected checks during editing, one integrated full source run before landing, and exact-head independent Claude implementation clearance. Final publication follows the ordinary merge/deploy/asset-match/one-receipt procedure. Docs-only authoring needs relevant content/link/diff checks, not runtime suites. No additional learner-data infrastructure is commissioned.

Remaining foundations include uppercase/lowercase recognition, long vowels, digraphs and accepted phonics models; independent connected reading, spelling and oral skill remain unmeasured. This lesson does not claim all letters/sounds or completion of brief250.
