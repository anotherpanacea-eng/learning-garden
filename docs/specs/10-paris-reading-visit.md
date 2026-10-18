# 10 — The Paris Postcard

Status: implemented; independent spec, content, and implementation review clear.

## Purpose

Add an original, imaginary visit to real Paris, linked from home and the story hub, using the existing guide/explorer and resumable story engine. A fictional bookseller is helping send stories back to the Learning Garden after the storm. English reading, rather than French knowledge or travel trivia, makes the errand possible. State explicitly that these story notes are in English. Illustrations establish place but must not supply the answers to reading questions.

## Developmental sequence

Six short connected-text tasks, followed by an optional unscored retell/postcard invitation:

1. Locate an explicit detail in a short instruction, distinguishing what to do from where to wait.
2. Analyze a transparent word part (re- means again) in a useful story instruction; this is word-meaning practice, not an oral decoding/phonics test.
3. Work out a word such as narrow from contextual evidence.
4. Infer a character’s reason from two concrete story details; avoid inference depending on Paris knowledge.
5. Select the sentence showing the protective action that supports the inference. Ask specifically for the action so other relevant context is not ambiguously treated as an incorrect answer. Keep the passage available; no memory test.
6. Sequence three events by their time/order words, with evidence in the current passage. Never require remembering an earlier skipped task.

Target roughly 25–65 words of connected source text per task; begin with a short note and build to a short paragraph. Use age-respectful playful language, plausible distractors, clear referents, and an authored explanation/hint for each. All facts needed for the answer must be on that screen. Include a different, smaller text helper for each task. A postcard can be drawn, dictated, or told aloud off-screen; no upload, saved free text, grading, or required completion.

Every Paris node is practiceOnly:true, so it never yields freshEvidence. Reused passages have a stable passageId and a priorPassageSeen flag derived from existing seen node IDs; earlier inference teaching cannot become fresh evidence-task comprehension. This is an authored progression, not automatic placement, a validated developmental scale, or proof of fluency. Parent notes identify the particular target and support used. Never infer decoding accuracy from a choice or listened passage.

## Reading support and evidence

- Show source passages as readable connected text, separate from scene-setting and the question, with generous spacing. A small original Paris illustration and a destination invitation provide place and agency.
- Optional sentence focus highlights one sentence while retaining the full passage, then allows moving to the next or returning to the whole passage. It never advances or answers a task. Its use stays recorded after returning to the whole passage and reload.
- Optional local read-aloud reads the passage, question, and choices. Record `audioRequested` conservatively when requested, not a claim that sound played or words were read. The request must persist before playback and must prevent independent/fresh reading evidence even if a later self-report says independent. Voice-unavailable/error/Stop must not erase it. Do not alter global speech privacy or begin automatic audio.
- Add a reported-listening reading option alongside independent/together/unobserved. Keep answering method separate from reading observation. Do not relabel earlier observations or edit unrelated progress.
- Sentence focus is separately recorded support. Hints, helper use, explanations, retries, familiarity, and existing exposure rules remain conservative. Listening/spotlighting must not turn a supported first correct answer into independent reading.
- Persist only bounded sentence position (0 through sentence count minus 1, or null), sticky sentence-use/audio-request flags, task targets, and existing synthetic-style records inside the existing garden state. Retain an explicit supportUncertain flag for unreadable tool metadata. Normalize malformed reading-tools metadata conservatively: invalid tool position cannot erase a retained use flag or manufacture fresh independence.
- Opening notes/helper/another route cannot finish the task or lose its draft. Finishing a helper does not answer the original. Existing skip/pause/choose-another-path behavior remains.

## Integration and delivery

Reuse story task/choice/helper/project machinery rather than building a new assessment engine. New Paris content lives in an original content module and is composed into story-content/help-content. Add only the small generic reading-tools state/UI needed by these nodes. Preserve existing visits and node IDs, café/foraging stock and orders, full multiplication coverage, and all other records. No accounts, server learner records, microphone, analytics, external speech or identity fields. Public content/spec/tests contain no real child/family details.

Sources informing design: IES Foundational Skills K–3 (https://ies.ed.gov/ncee/wwc/PracticeGuide/21/Published), IES Improving Reading Comprehension K–3 (https://ies.ed.gov/ncee/wwc/PracticeGuide/14). These inform connected text, word analysis/vocabulary, explicit comprehension strategies, and discussion; they do not validate this prototype. Geographic anchors are limited to Paris, the Seine, and the Eiffel Tower; fictional signs/people/errand are invented. Official geography reference: https://www.toureiffel.paris/en/access-map. No live travel guidance, copied prose, or third-party images.

## Verification

Independent content/implementation review must verify every answer against its current passage, ambiguity/distractors, all helper keys, no illustration shortcut, and the supported-reading gates. Test full Paris path/skip/end, resume/reload, sentence bounds/sticky flags, listening then later independent report, voice request with no available voice, retries/revisit, helpers, malformed metadata, other-path preservation and old-save compatibility. Run all existing suites and focused Paris tests. Browser-check home→visit, answer/hint/helper/return, sentence focus, read-aloud/Stop, pause/reload, notes/export support distinctions, ending, and 375/768px keyboard/touch layout. Publish to the same public Site; update the existing draft PR and leave it unmerged.
