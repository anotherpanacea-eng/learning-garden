# French Paris and returning to a plate

## Outcome

From the café multiplication question, Change my plate returns to the existing editor without replacing the guest, changing the order numbers, spending supplies, or erasing arithmetic attempts, support, or typed input. Rechecking the revised plate returns to the same multiplication target. Served orders remain closed; stock-stage revision is outside this increment.

Paris also offers a distinct French practice entrance at `#french`, linked from the English Paris page. Start with three original imaginary errands: a bookstall parcel, a paper boat, and a rooftop garden. Each contains a short connected passage, two French multiple-choice questions, and an optional unscored postcard invitation. These are short-sentence reading practice, not translations of English word-part questions or a French proficiency assessment. Interface guidance stays in English; passage, questions, and answer choices are marked `lang=fr`. Existing English journeys and suggestions stay unchanged.

## Interaction and records

- Reuse the existing story engine with distinct French entrance, task, passage, and helper IDs. Each errand can pause, resume, be revisited, or be left unfinished when another starts. Existing save, export, reset, attempts, familiarity, reading observation, and support rules apply. No account or child identity is introduced. This browser remains a shared notebook, not separate learner profiles.
- Full French passage stays visible; existing sentence focus, optional narration, hints, and smaller examples remain available. A clearly labelled English meaning and vocabulary action opens authored translation/glosses using the existing hint-support record. It cannot count as an unsupported answer. French observations carry explicit `language: fr`, and cannot affect English Paris suggestions.
- Narration selects only browser-reported local French voices for French content. It must not fall back to an English voice. Missing voices offer a readable fallback; Stop and voice/speed controls remain. English speech retains its current default and public helper API. No microphone, remote voice service, or uploaded text.
- The café return action is available only during the total question. It changes stage to plate, closes any repair prompt, and keeps the same current order. Plate validation remains required before returning to multiplication. No new history/versioning machinery is needed because guest count, bites per plate, and multiplication target cannot change.

## Upstream overlap

Refreshed Jane's `LESSONS.md` and Marble's `data/topics.json` on 2026-10-18. Jane's reviewed short quests and glossary lookup/support conventions inform this bounded extension; no new Jane code or lesson text is copied. The existing engine already includes its separately attributed MIT validation adaptation. Marble reading comprehension topics provide English curriculum context, not French-language assessment evidence. No French mastery mapping or copied taxonomy descriptions are added. The original French material reuses our Paris setting and existing support UI rather than translating English-specific prefix lessons.

References: https://github.com/kentlangley/Jane/blob/main/LESSONS.md and https://github.com/withmarbleapp/os-taxonomy/blob/main/data/topics.json. Existing licenses and attribution remain.

## Verification and delivery

Independently review this spec before implementation. Check French content for natural wording, clear unique answers, translation alignment, and sentence complexity. Add focused checks for café identity/stock/attempt retention and closed-stage guards; French route completion, support/familiarity/reload/export separation; local French voice filtering and no English fallback. Run existing regression suites once after integration. Browser QA covers full French play and meaning support, pause/reload and language switching with an unfinished visit, café total → revise → total, and a narrow touch layout. Review implementation independently, resolve findings, update the existing draft PR, and publish to the current public Site. Preserve repository privacy and keep the PR unmerged.

## Review resolution

Independent spec review cleared the bounded design. Content review replaced a repeated preposition helper with six skill-matched examples and simplified the rooftop sequence prompt. Implementation review required English meaning support to follow the shared passage into its second question, repair contradictory saved support flags, and display inherited translation help as support. These findings are resolved with focused checks; the existing story engine, English suggestion rules, and privacy model remain in place.
