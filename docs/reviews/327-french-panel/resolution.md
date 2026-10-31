# Spec 327 French panel: resolution

Reports: [Claude](claude.md), [OpenAI](openai.md), [Google](google.md), all 2026-10-31, on the companion at `98d106f`. All three verdicts: usable as written (Claude), usable with the listed fixes (OpenAI, Google). Every change below is applied to the [327 companion](../../content/327-french-ferry-crossing-text.md).

## Changes

| # | Line or design | Raised by | Resolution |
| --- | --- | --- | --- |
| 1 | Guillemets and spacing | OpenAI, Google | Shipped French uses a no-break space inside « » and a narrow no-break space before ? and !. The companion shows « … » with spaces; the spec states the runtime characters. Guillemets are never sent to speech. |
| 2 | The sounds note ("Listen for the vowel") | OpenAI, Google (both high) | Both found it wrong: *trente euros* links with a "t" while *trois euros* and *treize euros* link with a "z", so the ending does help. OpenAI's replacement is used, with no English respellings. |
| 3 | Sounds card Hear it | OpenAI, Google | Each linked phrase gets its own Hear it: *deux heures*, *dix heures*, *douze heures*, *trois euros*, *treize euros*, *trente euros*. Bare numbers aren't spoken, and no middle-dot list is sent to speech. |
| 4 | *Où* and *D'où* notes and feedback | OpenAI, Google (both high) | Scoped to this game: *Où* means "Where?", and here *Où allez-vous ?* asks where you are going. The place cards start with *À* or *De*. |
| 5 | *Combien ?* glossed only "How many?" | OpenAI, Google (both high) | "How many? / How much?", with a note for *Combien coûte… ?*. |
| 6 | Teaching card examples give away crossing 1 | Google (high) | The examples now use a place and numbers in neither crossing: *À la gare.*, *De la gare.*, *Nous sommes quatre.*, *À huit heures.* These four lines are new, so they go to a confirmation pass. |
| 7 | One card per kind gives answers away; "the time" detail line unreachable | Google (high); OpenAI (keep, but no comprehension claim) | Each crossing now has eight cards, two of each kind, so every step needs Dot's note. The added cards are lines both panels already reviewed. |
| 8 | Wrong-kind feedback names and translates the question word | Google (medium); OpenAI (keep) | Google's wording is used, which tells the child what the picked card says instead of what she asked. It keeps the listening task open. |
| 9 | Step 5 "Close. … listen for the vowel." | OpenAI | "Those numbers can sound similar. Hear her again and compare the whole number." |
| 10 | "That's what she asked." | OpenAI | "That answer fits. Now say it to her." |
| 11 | Grown-up details overclaim listening | OpenAI | OpenAI's wording: the notes record whether a French voice played her line while her words stayed hidden, and don't show whether the explorer listened or understood. The spec's Notes rule changes to match. |
| 12 | *Où ?* / *D'où ?* Hear it on one syllable | Google (medium) | Those two Hear it buttons speak the full questions *Où allez-vous ?* and *D'où venez-vous ?*. |
| 13 | Crossing 1 ending «Merci. Montez, s'il vous plaît !» | OpenAI (keep; calmer with a full stop); Google (medium: *Merci* after her answer feels odd) | «Merci. Montez, s'il vous plaît.», glossed "Thank you. Come aboard, please." *Merci* thanks the travelers for their answers, which OpenAI accepted. The full stop gives the calmer reading. |

## Lines kept, with the reason

- **«Combien êtes-vous ?»** All three kept it. Google adds that the question word at the start is what this activity teaches.
- **«Nous sommes deux.» / «Nous sommes trois.»** Claude and OpenAI kept them. Google prefers *On est deux* for everyday speech but accepts *Nous sommes* as a deliberate beginner choice. Kept, because *nous sommes* avoids teaching *on* in this first slice.
- **«Merci. C'est parti !»** No reviewer marked an error.
- **Step 5 in crossing 2** (*Combien coûte la traversée ?*). Google noted a small vocabulary step up and accepted it with the model button. Change 5 also introduces *combien* as "how much".

## Not changed

- The companion's English heading "Le bac: finite text" (OpenAI, minor) is an English document heading.
- *À* as "to" and "at" (Google, low). The glosses already show both.

## Confirmation pass

Changes 1, 6, 7 and 13 altered shipped French, so OpenAI and Google reviewed the changed lines again at `78d16bd`, alone and from one package ([OpenAI](openai-confirm.md), [Google](google-confirm.md)). Both said "confirmed with the listed fixes". Applied:

- **The *À*/*D'où* and *De*/*Où* feedback** still named and translated her hidden question (both, high). OpenAI's lines are used: "That card tells where you are going. Listen again to Madame Roux's question." and the same for "coming from".
- **Teaching-card examples** get inline English (Google, high), and the *Combien* note says "and the answer gives a number". The *D'où* note starts with "Here," so it can't read as "from here".
- **Crossing 1's card order** put the fitting card first in every pair (Google, high). The *De* pair now follows the *À* pair's place order. Crossing 2's table loses two leftover rows that its note already covers.
- **Smaller wording** (Google, medium): the sounds note says the "t" and "z" link before *euros*, "how many of you there are", and step 5's feedback says "compare the whole phrase", which fits the sounds card.

No new French line came out of this pass, so no further pass is needed.

## Known limit

As in the 117 panel, a model panel can miss wording that is correct but sounds odd to a native speaker. That risk is accepted for beginner content.
