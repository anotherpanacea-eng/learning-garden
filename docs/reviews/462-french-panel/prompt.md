# LG PR 462: Gemini language review

Run 2026-11-06 at 11:42 PM ET on Code-PC through the Antigravity CLI, model gemini-4-argon-high, at PR 462 head 1914f337b51c140a597a9ddbc0833d9f9cfcef0c. One call, no tools, no other provider's findings in the package. Usage: {"input_tokens": 21444, "output_tokens": 44703, "thinking_tokens": 42170, "cache_read_tokens": 11392, "total_tokens": 66147}.

Package (
equest.txt, 75277 bytes, sha256 20bbb74214ce99f7b0f85cfcdbab58a6da8be95731ca68d75fe6d246c2de416b): the prompt below, then in full under ===== FILE: <path> ===== lines dist/french-story-data.mjs, dist/paris-content.mjs, dist/french-core.mjs, dist/paris-core.mjs at that head, then git diff origin/main...head -- dist/.

The verbatim report is google.md.

## Prompt

You are a native-level reviewer of French (France) for a children's learning app. Use no tools; answer from the text below only.

Below are four source files from the app at commit 1914f337b51c, then the diff that this change makes to them. Only the French strings, and the English glosses or explanations that translate or explain French, matter; the JavaScript around them is packaging. The changes under review: Paris and French reading-length suggestions now offer story lengths directly; the scarf's owner is clarified; the musicians' sentence is simplified with its English meaning; a garden-gate gloss is added; "appareil photo" is taught consistently; postcard dictation instructions are plainer.

Audience: a young beginner reader (roughly ages 7 to 10) reading with a grown-up; some stories have three passage levels (1 = shortest). French should be standard metropolitan French.

Review every French line the diff adds or changes, and any unchanged French line it now contradicts, and report:
1. Grammar, spelling, agreement, accent or elision errors.
2. Wording a native speaker would find unnatural, stilted, or regionally odd, with a more natural alternative at the same beginner level.
3. Glosses or explanations that mislead (wrong meaning, wrong word-by-word gloss, wrong claim about the language or pronunciation).
4. Questions where the answer is not supported by the passage, more than one choice fits, or the fitting choice is given away by its form rather than understanding.
5. French typography (guillemets with no-break spaces, space before ? ! ; :, typographic apostrophes), once as a pattern with a few examples.
6. Anything too hard for the stated level that a simpler line would fix.

Format: a Markdown table with columns: File | Exact quoted line | Problem | Suggested fix | Severity (high = wrong or misleading; medium = unnatural; low = polish) | Confidence. Then a short list of changed lines you checked closely and would keep as written. End with an overall verdict for the changed French: usable as written, usable with the listed fixes, or needs rework. Do not invent lines that are not in the files; quote exactly.


## Repaired-text panel · 2026-11-07

Source revision: `7aaf69ee21f6925d14098ef8b2a243d1f94d9156`, complete `dist/french-story-data.mjs`, not a sampled diff. The exact module body follows this instruction in each Gemini/Claude inline request; it is recoverable from that immutable revision instead of duplicated in this record. The Git blob is recorded in the resolution. No other-provider reports were included.

### Common Gemini/Claude language instruction

```text
Independent COMPLETE French language/content review of exact public PR462 head 7aaf69ee21f6925d14098ef8b2a243d1f94d9156. Complete dist/french-story-data.mjs follows. No other reviewers' findings are provided; make an independent judgment. No edits or external actions, no tools, terminal, filesystem, web or plugins. Read all9stories,27French passage variants and English meanings, vocabulary,18questions(all choices/orderings/keys/hints/explanations) and metadata. Judge standard metropolitan French grammar/idiom, gloss accuracy, beginner reading load with adult support, contextual sufficiency in every variant, answer uniqueness and ordering, and educational claims. Reading load is not an age or placement. Return actual review not a plan: CLEAR exact head if no P1/P2, otherwise concrete priority, quoted line, minimal correction. OptionalP3 separate. State full scope/limits. Text review only, not runtime/device/learning qualification.
```

### Claude implementation instruction

After its independent inline-language verdict, Claude was asked to read the public repository diff against main and `docs/reviews/462-french-panel/resolution.md`, using read-only tools, and return a separate implementation verdict naming the exact head. It was forbidden to edit files or take external actions. The complete language instruction above applied before this source review.

### OpenAI independent reviewer instruction

A fresh reviewer context was given the exact head and complete source module, told not to read prior reports or other-provider findings, and asked to read all nine stories/27 variants and their meanings, vocabulary, all questions/choices/orderings/keys/hints/explanations and metadata. The review criteria were standard France French for an English-reading beginner with adult support, without age placement; grammar, idiom, gloss accuracy, sufficiency in every variant, unique fitting answer/order, reading load and claims. It was instructed to report complete scope, exact head, CLEAR if no P1/P2, otherwise severity/quote/minimal correction, with optional P3 separate. It had no edit or external-action authority. The report records the independently verified head.
