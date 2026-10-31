# Pip's Copy: finite text commission

Companion to [335](../specs/335-pips-copy.md). Based on268 scene3, deck1, card14 and D1–D5. Lines below are the commissioned runtime copy;335 amendments replace any conflicting268 wording. No page3/deck2 or Hollis content ships.

## Arrival and postcard

Title: **Pip's Copy**. Fiction label: **A story from Willowbank**.

Hook: Pip has a postcard for Léon. Read for meaning. Some words need changing. One can stay: choose its leave-it form.

Short: Pip writes to Léon fast. Some words are mixed up with words that sound alike, or nearly alike. Meaning tells you which to choose.

Longer:
> Pip's postcard says: Dear Léon, the river is high. Dot gave me some advise: write small. The rain had a big affect on the apples. Yesterday the baker lead us to the mill.
>
> "I wrote that in a hurry," says Pip.
>
> "Say advice and advise out loud," says Dot. "One ends with a hiss. One ends with a buzz. Advice is the guidance I gave you. Advise is what I do."
>
> Pip tries them. "So which other ones need changing?"
>
> Read it for meaning, not just for sound.

Postcard fixed-segment/slot sequence, in this exact order:
`Dear Léon, the river is ` · high · `. Dot gave me some ` · advice · `: write small. The rain had a big ` · effect · ` on the apples. Yesterday the baker ` · led · ` us to the mill.`

The slot addresses above name ids, **not initial rendered answers**. Use each slot's original below until explicitly chosen. Choice ids are their bare word text. Only the displayed label for the original includes **(leave it)**; rendering in the postcard uses the bare word.

| Slot id / label | Original | Written clue | Choices, in order; fitting word bold |
| --- | --- | --- | --- |
| high / The river | high | This sentence describes how far up the river has risen. | hi · **high (leave it)** · hie |
| advice / Dot's guidance | advise | Dot gave guidance. Choose the word for the guidance, not the action of giving it. | **advice** · advize · advise (leave it) |
| effect / The rain | affect | The sentence names a result the rain had on the apples. | affect (leave it) · **effect** · efect |
| led / The mill visit | lead | The baker guided Pip's group yesterday. Choose the past of lead. | leed · lead (leave it) · **led** |

Retained selected-sentence contexts (literal spaces included; insert the current bare word between before and after):

| Slot | Before | After |
| --- | --- | --- |
| high | `The river is ` | `.` |
| advice | `Dot gave me some ` | `: write small.` |
| effect | `The rain had a big ` | ` on the apples.` |
| led | `Yesterday the baker ` | ` us to the mill.` |

Different-choice feedback:
- high: hi: Hi is a greeting. This sentence describes the river's height. · hie: Hie means hurry. This sentence describes the river's height.
- advice: advize: This sentence needs the noun advice, spelled with c. · advise: Advise names the action. Dot gave advice: guidance.
- effect: affect: Here the sentence names a result: an effect. Affect is usually the action. · efect: Here the word for the result is effect, with two f's.
- led: leed: Here the past of lead is spelled led. · lead: Yesterday points to the past. The past of lead is led.

## Teaching

Card14 title: **Homophones, and pairs that get mixed up**.

Text: Homophones sound the same but differ in spelling and meaning: need and knead. Some mixed-up pairs sound different: advice, advise. Read for meaning, then choose.

Example: **Advice or advise?**
1. Advice ends with an s sound. Advise ends with a z sound.
2. Here, advice names the guidance. To advise is to give guidance.
3. Dot gave good advice. She gave guidance, so advice.

The words may be said with a grown-up. The app does not record or score a voice.

## Five supported jobs

All have the card14 teaching statement plus their own example below. Job ids d1–d5; titles D1–D5. Choice ids are lowercase bare words; display punctuation belongs to prose, not ids. D5 displays Witch, Wich and Which with initial capitals for the sentence-initial blank, with lowercase ids witch, wich and which. All parts lists are empty. Explanations follow either answered outcome once.

**D1.** Prompt: The baker ___ the dough by pressing and folding it.
- Choices: needs · kneeds · **kneads**.
- Guided steps before answers: 1. Pressing and folding dough is kneading. 2. Kneading has a silent k. 3. Choose the one with k.
- Different: needs: Needs means must have. Here the baker is pressing the dough. · kneeds: The k is right. The vowels are ea.
- Hint: Which word means press and fold?
- Explanation: Knead means press and fold. Need means must have.
- Example **Flour and dough**: 1. I need flour: I must have it. 2. I knead dough: I press and fold it. 3. The meaning decides which spelling fits.

**D2.** Prompt: Dot gave Pip some ___: "Write small."
- Choices: **advice** · advise · advize.
- Different: advise: Advise names the action. Here Dot gave guidance: advice. · advize: Here the noun is spelled advice, with c.
- Hint: Here the sentence names the guidance Dot gave.
- Explanation: Advice, with c and an s sound, is the noun. Advise, with a z sound, is the verb.
- Example **Advice or advise?**: the three card14 steps above, not only its title.

**D3.** Prompt: The storm had a big ___ on the orchard.
- Choices: affect · **effect** · efect.
- Different: affect: Affect is usually a verb. Here the sentence names a result. · efect: Effect has two f's.
- Hint: Here the sentence names a result of the rain.
- Explanation: Here effect names a result. Affect usually names an action. They do not always sound alike.
- Example **Rain and a result**: 1. Rain can affect apples: it can change them. 2. A change caused by the rain is an effect. 3. An effect is the result in this sentence.

**D4.** Prompt: Yesterday, Nuria ___ the boats down the river.
- Choices: **led** · lead · leaded.
- Different: lead: Yesterday is past. The past of lead is led. · leaded: Here lead means guide. Its past is led, with no -ed.
- Hint: Yesterday means the past. What is the past of lead?
- Explanation: Led is the past of lead. It sounds like the metal lead.
- Example **Today and yesterday**: 1. Today, I lead the way. 2. Yesterday, I led the way. 3. Led is the past form here.

**D5.** Prompt: "___ path is safest in winter?" asks Pip.
- Choices: Witch · Wich · **Which**.
- Different: witch: A witch is a person, like Bramble. Pip is asking a question. · wich: The question word keeps an h: wh.
- Hint: Question words often start with wh.
- Explanation: Which asks a question here. Witch names a person. Some speakers say them alike; some do not.
- Example **Which or witch?**: 1. Bramble is a witch. 2. Which path? asks about a choice of paths. 3. The question needs which.

Designated retained example cards:

| Job | teach[0].id | Card title and example title | Steps |
| --- | --- | --- | --- |
| d1 | card14-flour | Flour and dough | D1 example above |
| d2 | card14 | Homophones, and pairs that get mixed up / Advice or advise? | The global card14 steps above |
| d3 | card14-rain | Rain and a result | D3 example above |
| d4 | card14-today | Today and yesterday | D4 example above |
| d5 | card14-which | Which or witch? | D5 example above |

For each variant, `text` is the full global card14 teaching statement, `title` and `example` are the table's title, and `steps` are the corresponding three example lines. D2 retains the global card unchanged. Job `steps` is D1's three guided steps or an empty list for the other jobs; it never substitutes for a worked example. Job `example` is that card's example title.

## Shared strings

| Key | Text |
| --- | --- |
| postcardTitle / practiceTitle | Revise the postcard / Try a job |
| originalTitle / currentTitle | Pip's original / This version |
| picker / previous / next | Choose a word / Previous word / Next word |
| chosen / unchosen / putBack | Chosen: {word} / Not chosen yet / Put back |
| check / keep / reopen | Check this version / Keep this version / Reopen this version |
| first / latest / unchecked | First kept version / Latest kept version / Not checked in this version |
| incomplete | Choose a form for each marked word. To keep a fitting word, choose its (leave it) form. |
| different | Some choices do not fit this postcard yet. Read the word notes for help. |
| fit | This version fits the sentence clues. You can keep it, or try another. |
| partialFit | These readable choices fit their sentence clues. Some of the earlier postcard is unavailable. |
| partial | Some of this earlier postcard cannot be shown. The readable words are still open; the original is kept in your notes. |
| unavailableWord | [earlier word unavailable] |
| contextUnavailable | This earlier word has no separate sentence view. Read it in the postcard. |
| jobIncomplete | Choose a word, or keep this job for later. |
| neutral | Read for the meaning this sentence needs. |
| hint / example / skip | A hint / Show an example / Skip for now |
| step / stepBack | Next step / Previous step |
| kept / reopened | This version is kept. / This version is open to revise. |
| readPostcard / readIntro | Read the postcard with blanks / Each marked word will be read as blank. |
| readPrompt | Read these words |
| story / grownups | A story from Willowbank / For grown-ups |
| adultLine | Supplied spelling choices with sentence clues and help. This does not show independent spelling, reading or pronunciation. |
| adultDetails | The postcard and jobs use authored examples. Earlier versions and requested hints are kept separately. No voice is recorded. |
| unavailableSelection | Some earlier work at this table cannot be shown. Its original is still kept in your notes. Other readable work stays open. |
| unsupported | This Pip's Copy notebook uses a format this version cannot read. Your original is still in your notes download. |
| refused | There isn't room to save this change yet. Your work is unchanged. Ask a grown-up to download the notes. |
| wordGarden / stainedMap / endingsShelf / notes | Word Garden / The Stained Map / The Endings Shelf / Your notes |

Host explorer-header, save-status and Notes transfer copy remains shared. Accessible names may combine these retained labels with visible word/card text; do not invent feedback, keys, reading levels or a sent-postcard claim.
