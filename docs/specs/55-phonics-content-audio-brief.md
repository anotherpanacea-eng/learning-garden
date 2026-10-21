# 55 — Word Workshop: phonics content and audio commissioning brief

**Status: proposed content/commissioning packet, pending independent specification, linguistic, audio and rights review. No approved assets, recording order, runtime player or publication authorization.** This makes the sound door in [spec04](04-word-workshop.md) concrete. The implemented [Word Garden](34-word-garden.md) remains a separate meaning/morpheme activity; its whole-word browser narration is not reviewed phonics audio.

## Bounded purpose and pronunciation proposal

Prepare twelve real CVC words in the three families already proposed in spec04: cat/mat/sat/bat, pin/tin/fin/bin, hop/mop/top/pop. The aim is to connect individual spoken phonemes with these printed graphemes, blend them, segment a familiar spoken word and notice a one-sound change. Family labels are navigation aids: **-at, -in and -op are not single phonemes or meaning-bearing suffixes**. Three sound positions remain visible even when the rime stays the same. This is neither a complete teaching sequence nor a reading-level test.

Proposed model for this candidate only: **a General American English reading model with distinct short /æ/, /ɪ/ and /ɑ/, including /ɪ/ before /n/**. “General American” is broad; a human linguist and the eventual adult speaker must agree a more specific production description before commissioning. No variety is inferred from the user, browser locale, name or location. This proposal is not a claim that another pronunciation is wrong. An alternative /ɒ/ model for the -op words, or a speaker with a different pre-nasal vowel realization, needs its own declared, internally reviewed pack; do not mix takes silently or score a child's accent against this model.

Slashes below are broad phonemic notation for adult reviewers, not a required child-facing alphabet. The proposed /ɑ/ has no length mark; dictionary conventions may write the US vowel /ɑː/. The recordings must be judged by a human in context, not accepted because a text transcription matches. Natural coarticulation and nasalization do not create extra phonemes. Do not require artificial identical vowel acoustics in every context.

The machine-readable [word audit](../content/phonics/words.csv) records each proposed spelling, three graphemes, three phonemes, broad pronunciation, meaning and unresolved review point. Every row is `pending-independent-review`. Source rationale and the complete prerequisite crosswalk are in the [source audit](../source-audits/55-phonics-content-audio.md).

## Exact candidate inventory

| Family | Word | Individual graphemes → proposed phonemes | Meaning and illustration constraint |
| --- | --- | --- | --- |
|at|cat|c·a·t → /k/·/æ/·/t/|One pictured cat. The letter c represents /k/ in this word, not in every word.|
|at|mat|m·a·t → /m/·/æ/·/t/|A floor mat, distinct from a blanket.|
|at|sat|s·a·t → /s/·/æ/·/t/|Past action of sit; a before/after scene supports meaning, not an /s/ + “at” suffix analysis.|
|at|bat|b·a·t → /b/·/æ/·/t/|A toy sporting bat in this pack. The animal meaning is not an error but is not the pictured referent.|
|in|pin|p·i·n → /p/·/ɪ/·/n/|A pictured badge pin; a pretend prop, no handling task.|
|in|tin|t·i·n → /t/·/ɪ/·/n/|A small metal container. Explain this noun if unfamiliar in the chosen variety.|
|in|fin|f·i·n → /f/·/ɪ/·/n/|A fin on a toy fish; distinct from the entire fish.|
|in|bin|b·i·n → /b/·/ɪ/·/n/|A storage bin, not assumed to mean a waste container.|
|op|hop|h·o·p → /h/·/ɑ/·/p/|A small pictured jump. Do not require physical hopping.|
|op|mop|m·o·p → /m/·/ɑ/·/p/|A cleaning mop in a pretend scene.|
|op|top|t·o·p → /t/·/ɑ/·/p/|A spinning toy, not the highest point; the illustration disambiguates this pack's sense.|
|op|pop|p·o·p → /p/·/ɑ/·/p/|The sound/action of a bubble bursting; no soda/parent nickname interpretation is assumed.|

Twelve grapheme/sound pairs are proposed: `a /æ/`, `b /b/`, `c /k/`, `f /f/`, `h /h/`, `i /ɪ/`, `m /m/`, `n /n/`, `o /ɑ/`, `p /p/`, `s /s/`, `t /t/`. They do not represent all possible sounds for these letters. Letter **names** are separate from these sound samples. A future player may offer optional adult letter naming, but must not play “see” when the task asks for /k/ or imply that sounding out uses letter names.

A tentative supported entry uses mat/sat/fin/mop to explore a continuant onset before adding stop-onset words. This is an author suggestion for review, not a complete phonics progression, an access lock or proof of readiness. Learners may choose any family; the future player must provide the constituent correspondences when needed. Repeated practice in a four-word rime family does not establish decoding of an unfamiliar word outside it.

## Audio request list and performance direction

The [asset request ledger](../content/phonics/audio-requests.csv) contains **51 proposed requests**:12 sound samples,12 natural whole words,12 segmented words,12 deliberate blends and3 shared-text narrations. None has a file, checksum, license grant or review clearance. One requested item may need several private audition takes;51 is not a claim of delivered recordings. The /h/ isolated-sample request remains conditional on linguistic review; if it cannot be presented usefully without a vowel, withhold that tap and specify a contextual alternative before approving a player.

- **Natural word:** an adult says the intended word naturally in the declared variety. No music, sound effect, character processing or background prompt contaminates the sample. The phonics take and any expressive story narration have different asset IDs.
- **Sound sample:** demonstrate the intended sound rather than a letter name. /m n f s/ can be sustained briefly if the reviewer approves. /p t k b/ are stops: do not invent a prolonged “puh/tuh/kuh/buh”; preserve enough release information to hear the stop without appending an extra vowel. /h/ is context-sensitive and needs explicit specialist judgment. “Pure sound” is not a demand to remove natural articulation until the sound becomes unintelligible.
- **Segmented word:** record the entire three-phoneme teaching demonstration as one take, with deliberate separations, preserving order and no extra syllables. It is not a file produced by mechanically concatenating three isolated samples. For pop, first and final /p/ have distinct positions even if they share a phoneme ID.
- **Blend:** record a human demonstration that connects the three sounds into the natural word. Continuants may be extended; stop closures cannot be sustained like vowels. No invented claim of seamless continuous airflow through every consonant. Proposed timing/highlight anchors must be reviewed against the actual waveform/listening; there are no guessed millisecond values in this packet.
- **Narration:** read the full exact shared text naturally. It supplies target pronunciations and non-target words, so it is support and cannot be followed by an “unseen independent reading” claim for that passage. Browser speech remains possible for ordinary interface explanations only; it cannot substitute for these missing phonics files.

Commissioning technical proposal: preserve an unprocessed mono PCM WAV master at48kHz/24-bit where the eventual recorder supports it, plus a separately identified browser delivery derivative. These are proposed delivery settings, not a claim that higher sample rate teaches better. Review plosive attacks/tails, clipping, background noise, excessive breath, word completeness, consistent comfortable playback and mobile intelligibility. No destructive noise gate, pitch shift or automatic time-stretch may erase a consonant. Codec, level targets and exact edit rules are decisions for the audio reviewer before production; browser testing happens after real assets exist.

## Shared-text candidates and decoding boundary

The original [shared texts](../content/phonics/shared-texts.json) are **adult-supported miniatures**, not fully decodable readers. Their token lists explicitly mark target words versus adult-supplied words. Even a non-target word using familiar letters remains adult-supplied in this bounded pack until separately taught; do not assume the learner knows “the,” “is,” “a” or “in.” Capitalization and punctuation are shown, but independent mastery of them is not inferred.

1. **A place for the props:** “The cat sat on a mat. A bat is by the mat.” A cat and a toy sporting bat share the scene. Target types: cat, sat, mat, bat.
2. **The prop box:** “A pin is in a tin. A toy fish has a fin. The tin and the fish are by the bin.” The pictured badge pin is in the tin; toy fish and tin stand beside the storage bin. Target types: pin, tin, fin, bin. The function word “in” is adult-supplied, not silently added as a thirteenth target.
3. **The puppet's turn:** “A puppet can hop. A mop and a top wait by the stage. A bubble goes pop.” The puppet hops; a mop and a spinning top are visible props; a separate bubble bursts. Target types: hop, mop, top, pop. The context explains why unrelated practice nouns appear together.

Ask a human meaning question after shared reading (“Where is the bat?”, “What is in the tin?”, “What did the puppet do?”), with no automatic comprehension score. Pictures support meaning; they must not become a cue to claim independent word decoding. Adult language/reading support stays welcome and unpenalized.

## Manifest shape and review evidence

[manifest-example.json](../content/phonics/manifest-example.json) is a **non-loadable documentation example**, not a runtime pack. `runtimeReady` is false, asset location/checksum/timings are null, and all review records are pending. It shows the minimum decisions a later reviewed schema must preserve:

- Immutable pack/model revision, exact text revision and declared pronunciation proposal; stable word, grapheme, phoneme and asset IDs. A word's sound-token array preserves repeated phonemes and positions.
- Asset kind (`sound`, `word`, `segmented`, `blend`, `shared-text`), exact target/text, speaker-model reference, master/delivery file hashes, encoding/duration and reviewed timing anchors. No remote playback URL or guessed file may pass validation.
- Independent linguistic, audio and rights decisions bound to the exact asset hash and text/model revision. Store a public review-record reference and role/approved credit only; private contracts, addresses, signatures, account IDs and payment details stay outside the repository.
- Explicit attribution/license identifier and consent scope for public redistribution, modification/derivatives and hosting. A changed take, edit or pronunciation invalidates relevant prior approval; a hash change cannot inherit clearance just because the filename matches.
- The independent lesson specification gate remains separate from per-asset acceptance. A future loader must fail closed for missing/rejected/unknown review state, wrong hash or unavailable media and show an honest adult-read mode. The author must not populate “approved” fields by running a mechanical validator.

Proposed original-recording license to discuss: CC BY4.0 with an agreed public credit, or another repository-compatible grant explicitly cleared by the rights reviewer. This packet grants no rights on behalf of a performer. Confirm the adult performer has authorized public distribution and editing for this use; permission to record is not permission to clone a voice. No voice cloning, recording of a child, learner audio, synthetic impersonation or generation is commissioned here. Do not download/repackage dictionary audio or assume that publicly playable pronunciation samples are reusable.

## Exact human review questions and remaining gates

**Independent linguistic/content reviewer:** Are the12 words, chosen meanings and grapheme/phoneme alignments appropriate for the declared variety? Are short vowels and pre-nasal /ɪ/ consistent without stigmatizing alternatives? Is /h/ usefully demonstrable alone? Do stop samples add a schwa or omit essential release? Do segmented/blended takes preserve three phonemes and arrive at the same natural word? Is c→/k/ narrowly stated? Are rimes kept separate from phonemes/morphemes? Is the optional entry sequence sound, and what constituent teaching must precede or accompany each word? Are the three shared texts correctly labeled adult-supported, with no hidden untaught-word decoding demand?

**Independent audio reviewer:** For every actual take and delivery derivative, are the speech sound, edit boundaries, pauses, timing anchors and full-word ending intelligible at ordinary listening levels on phone/tablet speakers and headphones? Do highlights align with the intended segment without pretending that coarticulated speech has perfectly separable acoustic slices? Are stops and /h/ handled according to the linguistic decision? Are replay and no-autoplay requirements feasible? Record listening performed, exact files/devices and unresolved issues; do not infer acceptance from waveform measurements alone.

**Rights/privacy reviewer:** Is each take original or demonstrably licensed for this exact distribution/editing? Does the performer consent cover the intended use and public credit? Can public provenance be shown without exposing private agreements or identity/contact data? Are derivative terms compatible with repository notices? Is every image/text used in the pack original or separately cleared? No approved rights status exists yet.

**Independent specification reviewer:** Accept or revise the source dispositions, modality/access exceptions and evidence boundaries. Select the production variety and asset strategy before recording or generating sounds. Then, under a separately authorized production pass, produce and review the exact assets. A future player requires its own reviewed state/UI specification: no recorded learner voice or speech-recognition scoring; preserved old Word Garden work; separate support, familiarity and human reports; no evidence transfer from morphemes; accessible text mode and absent-audio behavior; optional local playback without narration fallback masquerading as a phoneme. Only after those gates may runtime work begin, followed by implementation review and real browser/audio checks. No merge, deployment or publication is authorized by this brief.
