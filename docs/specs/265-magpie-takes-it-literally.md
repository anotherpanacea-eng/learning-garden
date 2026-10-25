# 265. The Magpie Takes It Literally: figurative language, idioms, allusion and effect

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a subject check.** Part of the [English build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/172). Every child-facing line is in [the companion text](../content/265-magpie-takes-it-literally-text.md); sources are in the [source audit](../source-audits/265-magpie-takes-it-literally.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, subject, language and save review. We suggest **What the Magpie Heard** (bench b) with set B, for ages 7 to 9: six party lines, the magpie's literal picture beside each, the meaning and a plain restatement, and the two-tray literal-or-figurative sort. It needs no Spanish or French, no pages, no Hollis and no real history. The other benches are not commissioned by their presence here. Act and chapter links are future adapters to [spec 120](120-keeper-of-the-ways.md), which is merged. Standalone play stays open, and no story completion is inferred from an unavailable adapter.

**Story rule (binding):** a figure of speech never settles the town's plan. Bramble's pictures for the Wall make fair points, the other plans have pictures too (the Sponge is one), and no bench, item or line says which plan is right ([spec 120 §11](120-keeper-of-the-ways.md#11-rules-the-story-keeps)). The magpie's literal readings are the joke; a child's answer never is.

## Purpose

All eight targets are "not yet mapped" in `curriculum/topic-coverage.csv` and named nowhere under `docs/` before the build-out plan: Expressive and Sensory Language (`mt_fL1Xz8ostr`), Literal vs Figurative Language (`mt_SUOhjmRqv9`), Idioms & Proverbs (`mt_IoGOSAQ8bz`), Similes & Metaphors (`mt_hJW7hVflm3`), Cultural Allusions and Word Meaning (`mt_ZanQuV90qi`), How Language Choices Affect the Reader (`mt_furAIwoO9t`), Figurative Language and Literary Devices (`mt_DVSHx3YMkN`) and Advanced Figurative Language (`mt_MlmIrLb_7x`). Strand E2 asks for figurative meaning and ambiguity (**E2-IV**) and connotation (**E2-V**); E3 asks to evaluate reasoning (**E3-IV**) and to read irony (**E3-V**).

Built work brushes the edge only. [Riddles in the Hedge](94-riddles-in-the-hedge.md) has a few Sapling double-meaning and homophone riddles, but names no idiom, simile, metaphor or allusion and teaches no device. [Sentence Bridges](109-sentence-bridges.md) and [Word Garden](34-word-garden.md) work with literal sentence and word structure. Nothing teaches that words can mean something other than what they say, how to read a saying from its context, what a simile or metaphor borrows, where *Herculean* comes from, or how a picture can make a point vivid without proving it.

A child learns: sense words and recurring story words; literal and figurative readings of the same words; idioms as whole units read from context, then checked; proverbs as advice and when to use them, with Spanish and French sayings that share a meaning but not a picture; a simile, by the usual school convention, compares different kinds of things, usually with *like* or *as*; a metaphor says one thing is another, and each borrows only some qualities; personification; allusions to myths, fables and two famous books; how word choices change a reader's feeling with the facts held still; turning a figure into a plain claim and asking what it leaves out; and, at Keeper's Desk, verbal and situational irony, puns, oxymorons, extended metaphors and connotation.

## Place and story

**Host:** a new Riddles page, **The Magpie Takes It Literally**, at `#riddles/magpie`, linked from the `#riddles` card view ("the magpie is listening"), from Word Garden and from the Library. Spec 94's route and its `riddles` root are untouched. Spec 94's status line still says "implemented in an unmerged, undeployed draft", but its build is on `main` (commit `06e37b0`, 2026-10-22; `dist/app.mjs` routes `root==='riddles'`), so the owner should confirm it is live. `#riddles/magpie` still needs a sub-route in the riddles UI. **Fallback:** if `#riddles` is not live when this builds, host at `#words/magpie` (Word Garden, on `main`) and move the link later (review ask). Open from the start; spec 62's route pattern. Links to 157, 261, 271 and 273 (`#archive/myths`, `#loft/fables`, `#post/register`, `#archive/accounts`) are to proposed packs and appear only once each is built.

Bramble's magpie (pronoun "it", as in [spec 273](https://github.com/anotherpanacea-eng/learning-garden/pull/172)) hears every word literally and says so. Seven benches: **Sense Jar**, **What the Magpie Heard**, **Sayings from Three Towns**, **Like, or Is?**, **Old Stories in New Words**, **The Wall Is an Umbrella** and, at Keeper's Desk, **Saying the Opposite**.

| Scene (future adapters) | Beat | Teaches | Job it can feed |
| --- | --- | --- | --- |
| Act II ch. 3, Ember's birthday: *A horse on the menu* | Bramble and her magpie arrive; Dot breaks the ice; Pip could eat a horse; the magpie warns the horses. | Idioms, literal or figurative | Act II ch. 3 (Seedling: What the Magpie Heard) |
| Act II ch. 3: *Ember's birthday verse* | Dot's four-line verse: small as a teacup, like a lantern, a golden hill; the magpie hunts for the hill. | Sense words; simile and metaphor | Act II ch. 3 (Sprout: Sense Jar; Sapling: Like, or Is?) |
| Act IV ch. 4, before the meeting: *Water under the bridge* | Bramble rehearses her speech for the Wall at the ribbon gate; the magpie checks each picture; the Sponge is a picture too. | Figure to plain claim; effect; connotation | Act IV ch. 4 (Sapling: The Wall Is an Umbrella; Keeper's Desk: One thing, many names) |

A kept bench counts once, for one chapter. **Hollis and pages:** Hollis is named only in scene 3 and the Act IV version of bench (f), both after page 4 comes free; everything else reads no page. Bench (f)'s standalone version uses a low-stakes market debate instead. Ember's birthday falls in autumn (Harvest Supper). Scene 2's verse and bench (a) can also serve a Winter Lantern Night card, but 276 owns poems recited there. Nobody dies; Pandora's troubles, Achilles and Midas stop before any death or harm.

**Siblings, so nothing is taught twice:** [spec 94](94-riddles-in-the-hedge.md) owns riddles, including its double-meaning cards; this pack names the pun as a device and links back. [Spec 157](157-myth-ash-empire.md) (proposed) owns Greek and Roman myths, the "A story people told" label for them and gods with two names; its stations tell none of Hercules, Achilles, Pandora or Midas (checked), and its Two Names station pairs gods only, so this pack names Heracles itself in one parenthesis, tells each myth behind an allusion in one line, never retells it, and links to 157 generally. Spec 136 owns Troy, so no Trojan horse here. [Spec 26](26-bramble-changing-challenges.md) owns Bramble's arithmetic gate challenges; this pack adds no gate and no Bramble round. From the English build-out: **262** and **273** also have Act II ch. 3 scenes at Ember's party (the magpie's shelf, the missing ribbon); this pack's two scenes are separate beats and borrow no line from them. **259** owns synonyms, antonyms, shades of meaning by degree (warm, hot, scorching) and the vivid word; this pack's connotation is about attitude (thrifty, stingy), not degree. **261** owns fables and their morals; *sour grapes* is read here only as a phrase and links to the Fable Shelf. **266** owns roots and word families; *gargantuan* gets one etymology note. **271** owns register; one line says sayings suit friendly talk. **272** owns long novels; extended metaphor here uses short public-domain poems. **273** owns narrators and dramatic irony; Saying the Opposite links there. **274** owns grammar for effect and literary terminology, and leaves simile and metaphor to this pack. **275** owns the meeting's speeches and judging an argument; this pack turns pictures into plain claims and judges no plan. **276** owns poem forms and recital.

## The knowledge

Sourced in the [audit](../source-audits/265-magpie-takes-it-literally.md); unconfirmed claims were cut or marked there.

**What the curricula ask.** The English national curriculum asks Year 2 to recognise simple recurring literary language and discuss favourite words and phrases; Years 3 to 4 to discuss words and phrases that capture interest and imagination; Years 5 to 6 to discuss and evaluate how authors use language, including figurative language, considering the impact on the reader; Key Stage 3 to know how figurative language and vocabulary choice present meaning. Common Core asks grade 3 to tell literal from nonliteral meanings in context (L.3.5a, "take steps"); grade 4 to explain simple similes and metaphors and common idioms, adages and proverbs (L.4.5a-b) and words that allude to mythology such as *Herculean* (RL.4.4); grade 6 personification and connotation (L.6.5a, c); grade 7 literary, biblical and mythological allusions (L.7.5a); grade 8 verbal irony and puns (L.8.5a).

**Literal, figurative, idiom.** Literal language means what the words say; figurative language means something else. An idiom's meaning is not built from its words and is learned as a unit. Children's idiom understanding improves when a supportive story context is present, and children who are weaker at inference gain less from context on opaque idioms (Cain, Oakhill and Lemmon 2005; Cain and Towse 2008), so bench (b) gives every idiom a context and card 5 teaches using it, then checking a dictionary. Many popular idiom origin stories are guesses; the origin of "raining cats and dogs" is uncertain, so the pack gives none.

**Proverbs and other languages.** A proverb is a traditional saying that gives advice. Spanish and French have sayings with the same meaning and different pictures: heavy rain is *llover a cántaros* (by the pitcherful) and *il pleut des cordes* (ropes); "never" is *cuando las ranas críen pelo* (when frogs grow hair) and *quand les poules auront des dents* (when hens have teeth); daydreaming is *estar en las nubes* (in the clouds, the same picture as English) and *être dans la lune* (in the moon); patience is *No se ganó Zamora en una hora* (Zamora, a Spanish city, wasn't won in an hour) and *Petit à petit, l'oiseau fait son nid*; a croaky voice is *un chat dans la gorge* (a cat, not a frog). Every one needs a fluent reader.

**Similes, metaphors, personification.** Dictionaries define a simile as comparing two unlike things, often or usually with *like* or *as* (Merriam-Webster; Dictionary.com); a metaphor says one thing is another. "Unlike things" is a convention, not a sharp rule, so the pack teaches it with "usually" and uses only clear cases: two hats, or two cakes, compared with *like* or *as* are a plain comparison; a dragon and a lantern are a simile. No item turns on a borderline pair (the draft's "Pip runs as fast as Dot", a fox and a ladybug, was replaced). A metaphor borrows only some qualities of its picture (a fog blanket covers but is not cozy). Personification gives a thing human feelings or actions.

**Allusions.** *Herculean* points to Hercules's twelve labors (the Greeks' Heracles). *Achilles' heel*: Homer has no dipping or heel story; the earliest literary source for his mother dipping him in the Styx is Statius's unfinished *Achilleid* (1st century CE), and other later sources (Apollodorus) have him killed by an arrow in the ankle. Pandora's container was a storage jar (*pithos*) in Hesiod; the change to a box (*pyxis*) is usually attributed to Erasmus's *Adagia* (1508). Midas's golden touch is told in Ovid's *Metamorphoses*. *Gargantuan* comes from Rabelais's giant Gargantua (1530s), whose name may come from Spanish or Portuguese *garganta*, throat. *Tilting at windmills* comes from *Don Quixote* (Part 1, 1605). *Sour grapes* comes from Aesop's fox.

**Effect and reasons.** Word choice changes a reader's sense of a scene with the facts held still (bench (f)'s two storms). A figure of speech can make a reason vivid but is not evidence for it; turning it into a plain claim lets a reader ask what would show it, and what it leaves out. Connotation is the feeling a word carries beyond its dictionary meaning (thrifty, stingy).

**Keeper's Desk devices.** Verbal irony says the opposite of what is meant; situational irony is an outcome opposite to expectation; plain bad luck is not irony; dramatic irony is 273's. A pun plays on two meanings of one sound or word; an oxymoron joins opposites ("such sweet sorrow," *Romeo and Juliet*, first printed 1597); an extended metaphor keeps one comparison going (Dickinson's "Hope", first printed 1891, quoted in that printing's wording, *Hope is the thing with feathers / That perches in the soul,*; Stevenson's "Windy Nights", 1885, which many readers hear as the wind riding all night, though the poem never says so, so the child's answer is spoken, not keyed).

## The lesson

Jane's **teach -> guided -> practice**: sixteen teach cards, one idea each with a worked example revealed a step per tap; each set's first item shows 1-3 visible steps. **"I'm stuck" ladder** on every item: hint -> an easier worked case plus how to start this one (*the bell went ding*; *Dot was on fire*; *when pigs fly*; *glows like a lantern*; Hercules's twelve jobs; *the market is the town's heart*; *lovely weather* in a storm) -> skip for now, no penalty.

**Contrasts:** the log on fire against Dot on fire; Pip took a step against the town took steps; same picture across languages (clouds) against different pictures, same meaning (pigs, frogs, hens); a simile against a plain comparison with *like*; what a metaphor borrows against what it doesn't; a story behind a word against a guess from its sound; the same storm in plain and in figured words; a picture against a reason; irony against bad luck; thrifty against stingy.

**Misconceptions tagged on choices:** `sense-mixup`, `opening-closing`, `literal-reading`, `word-association`, `opposite-meaning`, `overstretch`, `match-the-picture`, `like-or-is-swap`, `like-means-simile`, `as-only`, `wrong-pair`, `wrong-quality`, `half-story`, `wrong-story`, `opposite-effect`, `effect-is-facts`, `wrong-word`, `figure-as-proof`, `figures-are-lies`, `irony-is-error`, `pun-is-typo`, `homophone-same-meaning`, `adjective-fits`, `same-denotation-same-feeling`, `different-denotation`, `tenor-vehicle-swap`, `function-words`. `figures-are-lies` is the cautious wrong choice AGENTS.md asks for: it withholds too much (the plain claim may be true), not too little.

## The game or activity

Every screen: *The magpie hears the words. You can hear what people mean.* No score, timer, lock or mastery label. Drags have tap equivalents. Every passage has a hear button; Spanish and French lines show English beside them.

- **(a) Sense Jar.** Tap sense words in Ember's verse and three party lines into five jars. **Story words:** opening and closing cards in English, Spanish and French; a Kipling "O Best Beloved" card. **Favorite words** is spoken to a grown-up and never stored.
- **(b) What the Magpie Heard.** Six party lines, each with the magpie's literal picture; five play as set B's items (B1, B3-B6) and the sixth joins the trays; the magpie's one-line reply. **Two trays:** literal and figurative pairs. A clue strip from card 5.
- **(c) Sayings from Three Towns.** Five saying cards (English, Spanish, French, word for word, meaning); **Same picture or different?**; three proverbs with **When would you say it?** (match three moments); a Zamora note; one register line linking 271.
- **(d) Like, or Is?** Sort six lines into simile, metaphor, plain comparison; **Two things and what they share** from supplied tiles; **Too far?** (is the fog warm?).
- **(e) Old Stories in New Words.** Seven allusion cards to read, each sentence, story and meaning (set E asks three of them); Keeper's notes on Pandora's jar and Gargantua's name; links to 157 and 261.
- **(f) The Wall Is an Umbrella.** **Plain Claim** in three revealed steps (picture, plain words, what it leaves out; nothing to choose, F4 is the spoken try), standalone on the market debate, Act IV on Bramble's rehearsal plus the Sponge and the miller's eggs; **Two Storms**; **One thing, many names** (Keeper's Desk: slender, thin, scrawny; Act IV: the Sponge, the marsh, a soggy swamp).
- **(g) Saying the Opposite (Keeper's Desk).** Irony sort (verbal, situational, bad luck; dramatic links to 273); the baker's pun; Shakespeare's oxymoron; Dickinson and Stevenson as extended metaphors.

## Problem sets

Seven sets, 28 items in the companion. 24 are three-choice; right answers sit **A 8 / B 8 / C 8**, never the single longest (confirmed by script). The other four are a jar sort, a two-tray sort, a match and one grown-up-read "say why".

| Set | Items | Depths | Formats |
| --- | --- | --- | --- |
| A. Sense words and story words | 3 | Sprout, Seedling | 3-choice, jar sort |
| B. What the magpie heard | 6 | Seedling | 3-choice, two trays |
| C. Sayings from three towns | 3 | Sapling | 3-choice, match |
| D. Like, or is? | 4 | Seedling, Sapling | 3-choice |
| E. Old stories in new words | 3 | Sapling | 3-choice |
| F. What the words do | 4 | Sapling, Keeper's Desk | 3-choice, grown-up-read "say why" |
| G. Saying the opposite | 5 | Keeper's Desk | 3-choice |

## Saved work

Optional root `magpie` per explorer. An explicit Start freezes only the selected visit's complete working source; Keep freezes that source if no visit has started. New visits retain earlier visits. No snapshot of every catalog item is required.

The sketch uses `Saved<T>` only as shorthand for an inline first/latest record, not a shared runtime helper or a source registry. `FullSource` is the complete selected authored source: passages and provenance labels; instructions, teaching and examples; models/data and captions; every selected question, ordered choice text, key and feedback; help and read-back text or asset references. It contains authored prose; only the response payload `T` uses codes.

```
ObservedHelp = { observed: true, concept: [{ forId, kind }], reading: [{ forId, kind }] }
Snapshot<T> = {
  source: FullSource,
  shown: { question: text, choices: [{ id, text }], key, feedback },
  answer: T,
  outcome: 'fit' | 'not-yet' | 'shown' | 'skipped' | 'kept',
  helpBefore?: ObservedHelp,
  at
}
Saved<T> = { first: Snapshot<T>, latest?: Snapshot<T> }

magpie: {
  v: 1,
  visits: { [visitId]: {
    working: { source: FullSource, help?: ObservedHelp },
    jar: Saved<{ words: { [wordId]: senseId }, story: { [cardId]: 'opens' | 'closes' } }>,
    trays: { [cardId]: Saved<'says' | 'else'> },
    sayings: Saved<{ match: { [sayingId]: sayingId }, picture: { [pairId]: 'same' | 'different' }, when: { [momentId]: proverbId } }>,
    likeIs: Saved<{ sort: { [lineId]: 'simile' | 'metaphor' | 'plain' }, pairs: { [lineId]: [tileId, tileId, qualityId] }, fog: choiceId }>,
    names: { [nameId]: Saved<'kind' | 'plain' | 'unkind'> },
    irony: { [cardId]: Saved<'verbal' | 'situational' | 'luck'> },
    items: { [itemId]: {
      first: Snapshot<[choiceId]>,
      latest?: Snapshot<[choiceId]>
    } }
  } }
}
```

**Frozen source and first response.** Every `Snapshot` above embeds its own full source, shown question/instruction, ordered choices, key, feedback, response and original outcome. For a bench with no supplied choices or key, preserve its instruction and use an empty choice list and null key; an ungraded keep uses `kept`. The working source is frozen before the visit begins and is never replaced by today's catalog. Waiting work and saved responses render only from their own sources. `first` is write-once at the first recorded response/keep; later attempts have a separate `latest`, and later skips/help never change `first`. Explicitly starting revised content creates another visit and retains earlier sources and work. No original spoken or written explanation is graded.

**Observed help before reveal.** During a newly tracked visit, `observed: true` with empty arrays means no help request was recorded in that visit so far, not demonstrated independent performance. Commit concept-help codes (hint, guided step, example, shown answer, meaning or slot scaffold), with the affected task/item id, to working help before their first reveal. Commit read-aloud/prompt-audio codes and the affected task/item id separately to `reading` before playback. Copy the observation into each response's `helpBefore` at the response time. A later request changes working help and the next response only. Missing older observations remain unobserved: never infer them from a later response or turn them into an empty list, false or “none.” Help requests are not proof that help was used; reading/audio data establish neither independent reading nor independent listening.

**Validation and preservation.** Validate structural bounds, ids, counts, outcome codes and consistency with the save's own source/choices; never require today's catalog membership, bench sizes, wording or answer key. A missing item is absent. Never recompute a saved result. Unknown versions and unreadable entries remain exact and exportable; only the affected visit/bench becomes read-only, and one bad item never closes the pack. Response payloads contain no free text; say why is spoken and unstored. No field holds a real learner's identity, age, grade or coursework. Favorite words and say why remain spoken. Spec 94's `riddles` root is never read or written.

**Atomic saves and capacity.** Every mutation, including source copies and help-before records, must pass the actual host's pretty-notes serialization/import preflight and shared limits before committing only this root. Refusal preserves the whole earlier state and visible pending work; do not rerender, navigate or change explorer in a way that silently loses unsaved words/selections. Offer the existing notes download and an explicit confirmed restore of saved words where needed. No silent truncation, history eviction or replacement of saved writing. Export, import, reset and save-off use the shared store; preview/render/suggestion reads are save-neutral. Existing source/language/cultural/rights checks remain open until separately cleared.

## Curriculum fit

**Strands:** **E2-IV** figurative meaning and ambiguity (primary); **E2-V** connotation; **E3-IV** evaluating reasoning (a picture is not a reason); **E3-V** irony; **E3-I/II** recurring story language and read-aloud; **E5** favorite words and "say why" spoken to a grown-up; **H2-I** a light link to 157's myths. Spanish and French sayings serve the river's languages (spec 120). Act families II and IV, and Keeper's Desk.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Name sense words and story words; tell literal from figurative in context; read idioms and proverbs, in three languages; identify similes, metaphors and personification and what each borrows; read allusions from their stories; explain how word choice changes feeling; turn a figure into a plain claim; at Keeper's Desk, irony, pun, oxymoron, extended metaphor and connotation. |
| Teaching encounter | Sixteen teach cards; three scenes; the magpie's literal pictures. |
| Contrast | As listed under The lesson. |
| Supported practice | Guided first items; the "I'm stuck" ladder; per-choice feedback; the clue strip; the three-step Plain Claim card. |
| New application | New idioms in context (break the ice, cat out of the bag); sayings in Spanish and French; the fog blanket; seven allusions; the market debate, then Bramble's Act IV pictures; Dickinson and Stevenson. |
| Purposeful revisit | Riddles (94); Myth, Ash and Empire (157); the Fable Shelf (261); Two Stories of One Flood (273); Act IV's meeting (275), where every plan's pictures meet reasons. |
| Data boundary | Response codes and complete frozen authored sources, local. Spoken work never stored. Feelings in items belong to Ember and the town; no line asks about the child's feelings, family or home. |

## Upstream check

Jane at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac`. **Marble has no English teaching research:** `research` is null for all eight targets; Marble holds no English teaching research at the pinned commit nor at upstream head (0 of 331 English topics). The table uses each topic's own description and evidence lines, paraphrased, with the standards it lists and the sources in the audit.

| Target | What the topic asks, and how this spec does it |
| --- | --- |
| Expressive and Sensory Language (`mt_fL1Xz8ostr`) | Recurring story language, sense words, a favorite phrase and why. Sense Jar, story words, cards 1-2, A1-A3; favorite words spoken. |
| Literal vs Figurative Language (`mt_SUOhjmRqv9`) | Literal or not; restate figurative phrases plainly; "on fire" both ways. What the Magpie Heard, two trays, card 3, B1-B6. |
| Idioms & Proverbs (`mt_IoGOSAQ8bz`) | Idioms, adages and proverbs, their meaning and when to use them; context, then a reference. Cards 4-7, benches (b) and (c), B5, C1-C3. |
| Similes & Metaphors (`mt_hJW7hVflm3`) | Identify each; what is compared and what quality; the image it makes. Like, or Is?, cards 8-9, D1-D4. |
| Cultural Allusions and Word Meaning (`mt_ZanQuV90qi`) | Myth allusions (*Herculean*, Achilles' heel); figurative words in context. Old Stories in New Words, card 11, E1-E3. **Partial:** word parts for unfamiliar words belong to 266. |
| How Language Choices Affect the Reader (`mt_furAIwoO9t`) | How a simile or metaphor affects the reader; atmosphere; comparing authors. Two Storms, card 12, F1-F2. **Partial:** comparing two authors' figurative language is one Rossetti and one Stevenson card, not a full comparison. |
| Figurative Language and Literary Devices (`mt_DVSHx3YMkN`) | Figurative and connotative meaning, tone, personification, allusion, irony. Cards 10, 13-14, bench (f), F2-F4, G1. **Partial:** tone is named through feeling words, not taught as its own term. |
| Advanced Figurative Language (`mt_MlmIrLb_7x`) | Connotation against denotation; irony; pun; oxymoron; extended metaphor. Saying the Opposite, One thing, many names, cards 14-16, G1-G5. |

**Jane:** adopted teach -> guided -> practice, stepwise worked examples, the "I'm stuck" ladder, three-option misconception-tagged choices, short second-person prompts, a glossary, and its "look for like or as" cue, with the added contrast that *like* alone is not enough. Not adopted: speed rounds and timers, typed free answers (a child's own simile is spoken), medals, mastery, gates, points, step-downs. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the **pinned** `curriculum/marble/dependencies.json` (`96a7933`), hard edges only, computed by `check265.py`: ten edges, eight inside the pack. Hard edges are authoring context, never locks.

| Target | Hard prerequisite | How it is met |
| --- | --- | --- |
| Expressive and Sensory Language | Listening to Texts Read Aloud (`mt_mLPEMpYb_R`) | Supported inline: every passage has a hear button, and the off-screen card is a shared read-aloud. Not met elsewhere on `main`; named in the proposed [library read-alouds](proposed/library-read-alouds.md). |
| Literal vs Figurative Language | Expressive and Sensory Language (`mt_fL1Xz8ostr`) | Taught here. |
| Idioms & Proverbs | Literal vs Figurative Language (`mt_SUOhjmRqv9`) | Taught here. |
| Similes & Metaphors | Literal vs Figurative Language | Taught here. |
| Cultural Allusions and Word Meaning | Expressive and Sensory Language | Taught here. |
| How Language Choices Affect the Reader | Similes & Metaphors (`mt_hJW7hVflm3`) | Taught here. |
| Figurative Language and Literary Devices | How Language Choices Affect the Reader (`mt_furAIwoO9t`) | Taught here. |
| Advanced Figurative Language | Figurative Language and Literary Devices (`mt_DVSHx3YMkN`) | Taught here. |
| | How Language Choices Affect the Reader | Taught here. |
| | Antonyms & Synonyms (`mt_E5YbLvMgLL`) | Met elsewhere: English build-out pack 259. Supported inline: card 16 gives each connotation set's shared meaning. |

## Checks for implementation

- **Script:** `check265.py` (writer's scratch, `python3 -I`, run 2026-10-25) confirmed: the eight target ids are in the pinned `topics.json`, each named once in the upstream table; the ten hard edges above are the complete hard set for these targets and every prerequisite is named in the crosswalk; 28 items, 24 three-choice, positions A 8 / B 8 / C 8, every wrong choice tagged, no right answer the single longest; prompts and bench headers 15 words or fewer, teach statements 30 or fewer, feedback, hints and explanations 20 or fewer; hooks and Shorts 30 or fewer, Longers 150 or fewer, Keeper's notes 80 or fewer; no em-dash in the three files; no UK spellings in child text; Hollis and pages appear only in scene 3, the Act IV version of bench (f) and the header rules. No arithmetic in this pack; dates are checked in the audit.
- **Language lint:** every **[ES]** and **[FR]** line has English beside it; all go to fluent readers.
- **Moral lint:** no line in scene 3, bench (f)'s Act IV version or set F says or implies which plan is right; every plan in bench (f) has a picture and a "leaves out".
- **Kindness lint:** every literal reading in feedback is "the magpie's picture", never the child's.
- Kept work reloads exactly. Browser at 320 and 820 px: saying cards stack their three languages; jars and trays wrap; targets at least 44 px; every jar, tray and match has a text equivalent.
- Independent review (fresh context, 2026-10-25): rechecked by `review265.py` (`python3 -I`) the 8 target ids against the research json, the 10 hard edges (8 in pack) against pinned `dependencies.json`, 28 items with A 8 / B 8 / C 8 and no right answer the single longest, word limits, em-dashes and Hollis/page placement; checked Dickinson, Rossetti, Stevenson and Kipling against Project Gutenberg texts, and Achilles, Pandora, *être dans la lune* and the simile definition against web sources. Changed: card 8, glossary and D2 hedged as a convention, and a fox-and-ladybug "plain comparison" replaced (1 borderline case removed); Dickinson and Rossetti lines corrected to their public-domain printings (F2 rebuilt on Rossetti's second stanza, since "trembling" can be literal); Stevenson's rider made a spoken, unkeyed question; irony defined to cover verbal irony; G1 given evidence that Bramble doesn't mean it, G5 rid of a partly right choice ("thing"); 6 smaller wording fixes (Achilles and Pandora hedges, the windmills example, scrawny, the Act IV names sort, Storm B's added fact, a picture used as an argument in bench (f)); bench (c)'s missing proverb moments written; spec 94 found already on `main`, 157's Two Names station found to hold gods only; saved work trimmed of five fields that had no child-facing choices (per-line meaning and plain picks, allusion picks, Plain Claim picks and version, a duplicate storms pick) and of a `fit` rule that could only be checked against today's key.

## Review asks

- **Language (fluent Spanish and French readers):** the five saying cards, the story openers and closers, *garganta*, and the Zamora note. Default: keep the common forms; replace any a reader flags.
- **Subject (English):** card 8 teaches "unlike things" as the usual school convention ("usually", "most people call that a plain comparison"), and D2 and bench (d) use only same-kind pairs (two hats, two cakes). Default: keep the hedged convention.
- **Subject (classics):** one-line allusion stories (Achilles' heel from Statius, Pandora's jar, Midas). Default: keep, coordinated with 157.
- **Owner:** route `#riddles/magpie`. Spec 94's build is on `main` though its status line says unmerged; confirm it is live. Default: keep; build at `#words/magpie` if `#riddles` is not live.
- **Owner:** the magpie talks and is "it". Default: as in 273.
- **Owner:** Act IV scene placement. Default: Bramble rehearses before the meeting, so 275 keeps the speeches.
- **Owner:** "brackets" for ( ) in child text (math build-out question 12). No child line here names them; default applies if one is added.
- **Owner:** first slice. Default: What the Magpie Heard with set B (ages 7 to 9).
