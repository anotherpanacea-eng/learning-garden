# Fair Test Bench: help an apprentice explain a comparison

Status: **built locally**, with separate [implementation review and verification](../reviews/60-fair-test-apprentice-implementation-review.md). Specification was **build-ready** after [independent specification/content review](../reviews/60-fair-test-apprentice-spec-review.md). Composed release gates remain separate.

**Choice-pack revision (2026-10-22):** the original choice lists below document the first pack and remain relevant to saved visits. New visits use the exact reviewed orders, labels and feedback in [spec72](72-supplied-choice-cues.md). Existing visits retain their own content and recorded outcomes.

## A new relationship in an existing loop

[PR47](https://github.com/anotherpanacea-eng/learning-garden/pull/47) proposes teaching an authored apprentice before building more shells. Extend the existing Fair Test Bench, not a new destination or a general tutoring engine. Its Plan/Try/Tell already explains focused/confounded comparisons, displays repetitions and keeps ungraded claims. A second “which is fair?” quiz adds little. The new action is to **preserve a valid observation, diagnose an explanation, demonstrate a repair and select words that help a novice**. The apprentice sometimes has a careful explanation, so the role is not a character who is always wrong.

This is supplied model/explanation practice, not proof that the app understands a child's words or that teaching a character improves learning. All dialogue is original fiction. Private prose is optional, exact and ungraded. Human conversation, drawing, signing, AAC or off-screen explanation is optional and unobserved. There is no microphone, AI service, learner upload, real-data claim, compulsory explanation, reward, mastery score or access lock.

The [source audit](../source-audits/60-fair-test-apprentice.md) refreshes Jane/Marble, reuses spec56's narrow fair-comparison and observation/interpretation references, and rejects mapping supplied cards to the wider “Teaching It Back” evidence. PR47's research-effect claims are not adopted. No new source pin or broad atlas coverage follows from an apprentice role.

## Complete original content for this slice

Use three freely chosen encounters with an original fictional apprentice called **Moss**, who is helping the parcel crew. These are three model cases, not adaptive placement. Distances are the existing six-configuration authored model's values, in **model cm**, not new physical measurements. Every setup uses the same cart, release without a push and measurement from the ramp foot. Longer distance is not always a better delivery; purposes remain separate.

### 1. Taller ramp, or something else?

Question: “Does changing from a low ramp to a high ramp change the landing distance?”

Original A low/smooth:12,13,12. Original B high/rough:14,15,14. Moss says: **“Every B distance is larger. That proves the taller ramp alone caused the difference.”**

The first sentence is supported by these shown numbers; the second overclaims because height and surface both changed. Do not erase the observation or call the entire message false.

Supplied explanation cards, each with its exact authored response:

- `height-useful`, useful: “B went farther in these examples, but both height and surface changed. Keep the surface the same to compare the low and high ramps.” Response: “Moss: I can keep the distance observation and change the comparison before blaming one cause.”
- `height-incomplete`, incomplete: “B went farther in these examples.” Response: “Moss: That describes the distances. I still need help with my claim that height alone caused the difference.”
- `height-overclaim`, unsupported: “The bigger B numbers prove that only height mattered.” Response: “Moss: Both settings changed, so these numbers do not isolate height.”
- `height-discard`, unsupported overcorrection: “Two settings changed, so none of these distances tells us anything.” Response: “Moss: The distances still describe these examples. They do not isolate which change caused the difference.”

**Demonstration:** Keep the low A/high B ramp settings visible and fixed; choose each surface independently. Either smooth/smooth or rough/rough is useful. Rough/smooth and smooth/rough retain both changing factors. No hidden requirement to reproduce the author's preferred surface. A/B trial values for a new demonstrated pair come from the encounter's frozen six-configuration model, not current catalog numbers.

### 2. Which surface helped?

Question: “Does changing the rough landing surface to smooth change the distance?”

Original A low/rough:5,6,5. Original B high/smooth:26,25,26. Moss says: **“Every B distance is larger. The smooth surface alone must be the reason. Shall we tell the porch crew?”**

Cards:

- `surface-useful`, useful: “B went farther in these examples, but height changed too. Keep the height the same to compare rough and smooth.” Response: “Moss: I can show the distance difference without claiming surface was the only cause.”
- `surface-incomplete`, incomplete: “The porch needs a short stopping distance.” Response: “Moss: That names the crew's purpose, but it does not explain what this comparison can tell us.”
- `surface-overclaim`, unsupported: “Only the surface matters, because B has the largest numbers.” Response: “Moss: A and B also use different heights. The numbers alone do not separate those changes.”
- `surface-discard`, unsupported overcorrection: “No comparison is possible because the trials are made up.” Response: “Moss: We can compare the shown model examples, while remembering that they are not physical measurements.”

**Demonstration:** Keep A rough/B smooth surfaces visible and fixed; independently choose low/middle/high heights for both. All three same-height pairs are useful; unequal heights remain confounded. In particular do not reject middle/middle or high/high because the initial A was low.

### 3. A careful message worth keeping

Question: “Does changing from a low ramp to a high ramp change the landing distance?”

Original A low/smooth:12,13,12. Original B high/smooth:26,25,26. Moss says: **“I kept both surfaces smooth. In these shown model examples, every distance from the high ramp is larger.”**

Cards:

- `careful-useful`, useful: “That is careful: the surface stayed the same, height changed, and your message names these model examples.” Response: “Moss: I can keep this limited claim. It does not promise what every real cart will do.”
- `careful-overclaim`, unsupported: “This proves every real cart always travels farther from a high ramp.” Response: “Moss: These are a few authored model examples, not evidence about every real cart.”
- `careful-wrong`, unsupported: “Your comparison is confounded because both ramps use smooth ground.” Response: “Moss: Keeping the ground the same is useful here. Height is the factor we changed.”
- `careful-incomplete`, incomplete: “The high ramp is taller.” Response: “Moss: That names a setting but does not explain why this is a useful comparison or how limited the claim is.”

**Demonstration:** Low A/high B remain fixed; surfaces are editable just as case1. The existing smooth/smooth pair already qualifies. A child may deliberately show it unchanged, or choose rough/rough. Do not force a needless correction to a valid explanation.

All12 cards and their outcomes, all original setup values and every accepted repair are part of independent specification review. Art is a labelled schematic of the selected setup, never an animation or claimed measurement. Initial original results are explicitly **Moss's shown model examples**, not collected by the learner.

## Integration without another shell

Remain at **#workshop/fair**. Add a compact “Help Moss explain a test” invitation on the bench, including its initial no-investigation view. Opening uses an ordinary parent field `fairTests.apprenticeOpen`; closing returns to the same Plan/Try/Tell page and investigation unchanged. Do not repurpose the base page enum, rewrite its trials or fork it as a side effect of apprentice play. No new root router, navigation registry or held app/play-media/style/README changes.

Use a narrowly scoped `fair-test-apprentice-{content,core,ui}.mjs` and an extension stylesheet if useful. Extract only the existing reusable ramp illustration to a small shared art module if needed; do not refactor the broader game. The apprentice uses the same six model setups and familiar apparatus/surface controls, with the question's target factor fixed for this demonstration. Show target settings as text, not secretly disabled choices. Its repair is an independent authored example, never evidence copied into an existing investigation.

Three open apprentice pages reduce scrolling:

- **Notice:** Choose any encounter. Keep Moss's exact claim, original A/B setup pictures and six frozen trial rows visible, alongside “Which part is an observation, and which part explains why?” That is a discussion prompt, ungraded. Explain that these are Moss's supplied examples. A small reminder distinguishes observation from single-cause explanation. No choice is required before another page.
- **Show:** Keep the question, original pair summary and Moss's claim available in a disclosure. Change the non-target setting for each side using native selects, with fixed target labels visible. Pictures reflect the actual repair draft. Show one explicit action, “Show this comparison to Moss.” It records the selected explanation card if any, proposed pair, three frozen-model values per side and a separate focused/not-focused outcome. The novice reply about the design describes actual changed/fixed factors; it does not say it understood private prose. The complete original observation remains intact. The unchanged valid pair in case3 is a legitimate demonstration.
- **Explain:** Show the reader's need: help Moss distinguish a useful observation from an overclaim or recognize a careful statement. Choose any supplied explanation, clear it, and explicitly “Show our supplied explanation”; this can run without a useful repair. Keep design and supplied-card outcomes separate. Optional “Our explanation for a person” accepts up to800 UTF-16 code units, exact; typing saves without replacing the focused textarea. “Keep our words” creates an ungraded snapshot even when a supplied card is selected. Card feedback must immediately follow its supplied text, with private writing separately labelled ungraded. No keyword/parser/length score or authored response attributed to the prose.

Show/Explain checks share a simple history but record their kind. New checks only compute the applicable component: demonstration computes repair outcome; card check uses frozen authored card metadata; own-words record has neither outcome. A prior component is not silently recomputed or treated as checked by the other action. Revised relevant inputs label previous checks as earlier: demonstration depends on its pair, supplied-card relevance on the selected card, and own-words relevance on exact words. Typing private words must not imply that a supplied-card outcome changed. History retains exact source/inputs/outputs/feedback. Both model/result summaries and drafts remain reachable across pages. Earlier checks and encounters collapse below current work. Back/close never starts a new encounter or loses a draft.

## Minimal optional state and preservation

Keep apprentice work under optional `fairTests.apprentice` version1, separate from base investigations. A small external `fairTests.apprenticeOpen` boolean controls presentation even for an opaque/future apprentice value; closing may change this flag but must not mutate that raw value. Merely rendering the bench/notes does not create either field. Opening may create an empty valid base envelope (current1/nextId1/seenfalse/investigations[]) but **no base investigation or apprentice visit**. Only explicit “Start this encounter” freezes its original content/model into a visit. Ordinary base operations preserve this optional child and unknown fields. An unavailable/future base envelope remains entirely read-only under the established bench rule.

Child envelope: version1, page:notice|show|explain, current/nextId positive safe integers, seen distinct encounter IDs, rounds. Round: safe id, source frozen format1 encounter (id/title/question/mission/original a,b/claim/model six setups/cards four), familiar boolean, repair a/b known ids from that source matching fixed target settings, selectedCard:null|sourcecardid, words exact≤800, support distinct help|audio|together, checks≤8. Source model entries retain known stable setup IDs, height/surface enum and exactly three bounded integer0–30 values, unit model-cm/source authored-ramp. Validate local references and shape; do not compare frozen prose/numbers/outcomes to today's catalog or require historical output truth to qualify a record. Source description bounds: id60/title120/question600/claim600/cardtext600/feedback1200. Preserve unknown fields. A check stores kind:demonstration|card|words, frozen repair pair if applicable, shown values/outcomes if applicable, selected card/text/feedback if applicable, exact words and input snapshot for current/earlier labels. Each action must preserve unrelated earlier records.

Keep up to12 readable apprentice encounters; disclose exact oldest-readable eviction count before an explicit start (including oversized imports). Views never trim. New safe ids exceed every retained positive numeric id, including unreadable/fractional raw ids; refuse unsafe exhaustion without mutation and explain failure. Raw siblings stay escaped and retained, valid siblings playable. An invalid/future child remains exact/read-only; closing and using the ordinary bench stays possible. No resetting the bench to recover an apprentice record. Keep8 latest checks per encounter, disclose ninth eviction. Typing updates only the current draft; notes/downloads retain exact text under existing save-off, explorer and transfer behavior.

Help/audio attach only to a current apprentice visit and never create one. Ordinary bench speech/help handlers must not also mark a base investigation when apprentice controls are active. No support/familiarity carry across new encounters. Narration uses only the existing local speech boundary; no quality or independent-reading claim. A previously open native help panel cannot mark a new visit supported.

## Acceptance and limits

Separate independent specification/content review precedes build; independent implementation review and root browser checks precede a draft PR. No merge/deploy or outbound review message is implied. Preserve held mobile paths. No model-wide framework, automatic lesson generator, new economy or additional shell.

Test all case1/3 four surface pairs and case2 nine height pairs against independently specified expected repairs, every12 supplied card, zero/partial/no choice and unchanged-valid demonstrations. Prove preserved original observations, distinct check components, old contradictory outputs/display wording, exact prose with no typing rerender, source changes, per-encounter support/familiarity, raw/future/unsafe-id/cap disclosure and pure rendering. Actual parent routing, opening/closing without changing base page/trials/note/exposures, notes, disk/import/switch/save-off,44px/no overflow/native controls/keyboard/focus and local narration require checks. A real Apple device, audible speech, human screen-reader use, independent explanations and learning gains remain unverified unless separately observed.
