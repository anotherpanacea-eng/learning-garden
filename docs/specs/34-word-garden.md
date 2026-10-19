# Word Garden: growing words from parts

Status: proposed; awaiting independent spec review. Refines the first release of [Word Workshop (spec 04)](04-word-workshop.md) and keeps all of its content, audio, evidence and privacy rules. Feeds the library's sign job and the almanac's word page in [spec 33](33-rebuilding-the-town.md). Scene sentences, refusals and questions: [34-word-garden-content.md](34-word-garden-content.md).

## Why start with word parts

Spec 04 has two doors: sound/letter practice and meaning-changing word parts. The sound door needs adult-reviewed audio for every isolated sound and blend before it can ship. The word-part door does not, because its unit is a whole word with a meaning. Ship the word-part door first as a garden, and add the sound door later as its own bed once reviewed audio exists.

## Play

Root words grow as plants in a small walled garden behind the library. A child picks a root, then grafts a part onto it from a basket of cuttings. When the graft makes an authored real word, the plant grows a new bloom labeled with the word, and a one-line scene shows its meaning: Pip **unpacks** the basket; Dot **repacks** it neatly. When the graft makes no authored word, the cutting doesn't take, and Dot explains in plain words ("*un-* means undo, and you can't un-*jump*"). There is no failure state or count, and the cutting goes back in the basket.

Each new word blooms once and stays. Tapping a bloom replays its scene. After a few words, Dot asks one unscored question that uses the pattern in a new sentence: "If *re-* means again, what does Pip do when he **rereads** the map?" The choices come from the scene sentences, and any choice can be talked through.

## First content

| Root | Grafts that grow |
| --- | --- |
| pack | unpack, repack, packer |
| tie | untie, retie |
| lock | unlock, relock |
| read | reread, reader |
| build | rebuild, builder |
| paint | repaint, painter |
| kind | unkind, kindness |
| help | helpful, helper, unhelpful |
| play | replay, player, playful |
| care | careful, careless |

Prefixes: *un-*, *re-*. Suffixes: *-er* (a person who), *-ful* (full of), *-less* (without), *-ness* (the state of being). Every combination outside the table is a cutting that doesn't take. A literacy reviewer checks each word, meaning line and explanation before build, using the same review as spec 04.

## Hearing and reading

Whole words and scene sentences can use the existing local read-aloud (`hearButton`), since they are ordinary words. The garden never speaks isolated sounds, parts or blends through synthesized speech; that waits for spec 04's reviewed audio. Without a local voice, the text stays and an adult can read it.

## State and evidence

A per-explorer `words:{grown:[wordId],seen:[questionId]}` field, normalized additively. Growing a word records that the child explored it with or without reading help; it is not evidence of decoding, spelling or independent reading. The almanac's word page lists grown words, and the library sign job ([spec 33](33-rebuilding-the-town.md)) is fed by finishing a garden visit of at least one new word.

## Verification

Every table combination grows exactly its word and every other root and part pair is refused with an explanation; every word has a meaning line and an explanation reviewed by a literacy reviewer; no isolated sound or part is sent to speech; grown words persist across reload and stay with their explorer; export, reset and saving-off include them. Browser: grow, refuse, replay and answer the unscored question on a phone and a tablet with and without a local voice.
