# 98 · Lantern Circuit Bench: a path through the bulb

**Proposed specification; independent science, content, rendered-art and six-lens review required before build.** Base main `d0535c3394734594ffa07db99a1364e83bbaa88a`. See [source/overlap audit](../source-audits/98-lantern-circuit-bench.md) and the [original cutaway mock](assets/98-lantern-circuit.svg). No implementation, atlas reference, merge or publication is claimed.

## A new science action

At optional `#workshop/lantern`, Moss prepares a pretend electric lantern for the town's show. The learner adds/removes connections between a cell and the **two different contacts** of a filament bulb, sees a model response, and revises a kept design. This fills a small S6-I/II complete-circuit bridge. The adjacent contrast is a connection *to* a bulb versus a complete path *through its filament and back to the cell*. Both ends on one bulb contact do not put the filament in that path. Reversing the cell-to-contact pairing can still light this filament bulb; it is not an LED.

Existing Workshop ramps, Bell Studio, material illustrations and water-path model do not construct electrical connections. No current circuit game was found in the actual runtime/spec search. Reuse open short turns, native controls, local narration and own-source preservation, not a general circuit solver/framework. This is screen-model teaching: no physical assembly, mains, coin cells, device diagnosis, speed, measured current/voltage/heat, brightness law, electron animation, LED polarity, switch/buzzer, series/parallel quantitative rules or full circuit/energy attainment. It offers no reward stock, timer, mastery score, auto-advance, prerequisite lock or film.

## Complete finite model and cases

Model version **`four-links-one-filament-v1`** has fixed semantic nodes `P` cell plus, `N` cell minus, `S` bulb metal side, `T` bulb tip. The cell is a working source; the intact filament connects S to T inside the cutaway bulb. It is not an external wire or a button. The four reversible external links, bit order fixed by this version, are:

| Bit | Endpoints | Button label when absent / present |
| --- | --- | --- |
| 1 | P–S | Add / Remove: cell + to bulb side |
| 2 | P–T | Add / Remove: cell + to bulb tip |
| 4 | N–S | Add / Remove: cell − to bulb side |
| 8 | N–T | Add / Remove: cell − to bulb tip |

A mask0–15 represents exactly those external links. No extra crossing becomes a junction. Wires join only at labelled nodes; a visible bridge at the crossing distinguishes nonconnection. Selected links use distinct line styles/labels, not color alone. Every native control is at least44px; no tiny terminal tapping or dragging is needed.

Compute components of **external wires only**, before adding the filament. If P and N are connected by those wires, output **`bypass`**, a guarded unsupported arrangement. Otherwise masks9 (P–S plus N–T) and6 (P–T plus N–S) give **`glow`**. All other masks give **`open`**. The full finite acceptance table is:

`0 open; 1 open; 2 open; 3 open; 4 open; 5 bypass; 6 glow; 7 bypass; 8 open; 9 glow; 10 bypass; 11 bypass; 12 open; 13 bypass; 14 bypass; 15 bypass`.

The bypass output **pauses the glow model**. It does not claim a predicted real current, temperature, dimness or safe physical circuit. Do not display a dark real-bulb prediction, sparks, explosion or magical punishment for it. The original teaching diagram can show the existing connections and a neutral paused bulb. The UI distinguishes model limits from an open-path result.

All four original cases are available in any order:

| ID / title | Initial mask | Exact request |
| --- | ---: | --- |
| `one-lead` / One lead is waiting |1|“Make a complete path through the bulb. Which other connection could you try?”|
| `same-contact` / Two leads, one contact |5|“Both leads meet the bulb's metal side. Why has our model paused? Try using two different bulb contacts.”|
| `reverse-pair` / A different working pair |6|“This bulb is already glowing. Reverse which cell end goes to which bulb contact. Can it glow again?”|
| `open-table` / Your own lantern table |0|“Try your own connections. What can change while the model bulb still glows?”|

The chooser allocates nothing. Explicit **Start this lantern** creates absent case work from the complete current source, or resumes its own readable source unchanged. An occupied unreadable ID is not overwritten; healthy siblings remain open. Retired safe IDs resume independently of today's four-case catalog. Source owns its model, title, request, initial mask, complete teaching copy and example; the fixed model version owns topology and rendering meaning. Unknown model versions remain raw.

## Teaching, making and keeping

Three open turns **Learn / Connect / Kept** retain a compact reference: **“One cell. One filament bulb. Two different bulb contacts: side and tip.”** There is no Check button or scored response. The changing model response describes the visible arrangement, not the learner's understanding or whether the entire request was independently met.

Learn opens first on Start. Exact idea: **“A bulb needs a complete circuit. In our model, a path goes from one cell end through the bulb's filament to the other cell end. A connection to only one bulb contact leaves the filament out.”** Then: **“The bulb has a metal side contact and a separate tip contact. The filament joins them inside. The pale band between side and tip is an insulator; it keeps those contacts separate.”** Label cell, both cell ends, bulb, filament, side, tip, connecting wire and insulating band in the original cutaway. Do not depict side and tip as a single metal piece.

The worked example is a separate ephemeral drawing with three freely reversible **Example picture1/2/3** buttons. Frames do not change the learner's own mask/Keep:

1. mask1: **“One wire reaches the bulb's side. There is no complete path through the filament and back.”**
2. mask9: **“A second wire joins the tip to the other cell end. The path now goes through the filament. Our model bulb glows.”**
3. mask1 again: **“Remove that second connection. The path is open again, so our model bulb stops glowing.”**

The diagram genuinely changes. On reopening Learn, its local example returns to frame1; it is not an attempt or saved progress. Historical sources own their three example masks and captions; accept any three masks understood by v1, not equality to this current example. Always show the model's structural status alongside its own source caption so changed old wording cannot become the topology rule.

Connect holds one live cutaway picture, four native reversible controls, selected-wire list and immediate source-owned model description. The exact status copy is:

- `open` title **“Open path: model bulb off”**; text **“Our connections do not make a complete path through the filament from one cell end to the other. Add or remove a connection and compare.”**
- `glow` title **“Complete path: model bulb glows”**; text **“These connections include both bulb contacts and the filament in a path between the two cell ends. This filament bulb also works with the cell ends reversed.”**
- `bypass` title **“Glow model paused: a wire path bypasses the filament”**; text **“These wires join the cell ends without going through the filament. Our simple model does not calculate this arrangement. Try removing a link so the two bulb contacts stay separate.”**

An always-visible model limit says **“A pretend screen circuit, not a physical result. The drawing shows connections, not measured current, brightness or heat.”** Glow uses a soft static fill and text. No flashing, automatic movement, current arrows, moving electrons or sound is required. Both valid glow masks have the same brightness; it is not a quantitative display. The model shows no glow while paused and labels this as paused rather than an open physical circuit.

Optional **Show the loop** is an ungraded structural explanation, available on every turn. For glow, highlight the selected external links and the filament together, with text **“One cell end → wire → one bulb contact → filament → other bulb contact → wire → other cell end. The cell completes the circuit.”** This is reading a path, not charge or energy movement over time. For open, say **“The current connections have no complete path through both bulb contacts. Compare the side and tip links with our worked example.”** For bypass, repeat its paused description; never invent a valid loop through the filament. Do not automatically alter links, reveal an unrequested new board or allocate a result.

Optional Help: **“Follow the labels, not a line's position on the page. The bulb's side and tip are different contacts. Try one cell end at each bulb contact. Two wires meeting at the same contact can leave the filament out. In this little model, wire crossings join only at the labelled nodes. Change one connection, look at the new arrangement, and change it back whenever you like.”** Talk: **“What changed when you removed one link? Can two different arrangements make the same bulb glow?”** Talk is unrecorded; no free-text field, speech capture, adult-verdict field or performance inference.

**Hear this turn** speaks only the visible own-source reference/request, current selected-wire labels and status for Connect, the current example caption plus status for Learn, or the kept version's own source/wires/status for Kept. Show-loop/help Hear reads their actually revealed text. Use explicit local narration; no autoplay/network voice/microphone. Narration is an opportunity, not verified listening.

Keep is open even for an open or paused arrangement. **Keep this version** copies source and mask. Later edits leave it unchanged. **Replace our kept version** requires explicit confirmation and suggests download first; do not promise overwritten work remains. An unreadable occupied Keep is retained raw and replacement disabled truthfully. Earlier work, Help, model/source limitations, recovery and notes can use one closed native fold to keep phone turns short. No ever-growing check history is necessary because there are no checked answers.

## Minimum persistence and import contract

This board is learner-authored across turns, unlike a transient demonstration. Save it in optional `lanternCircuits:{version:1,current:null|caseId,cases:{[caseId]:work},retainedRaw?}`. Work is `{source,page:'learn'|'connect'|'kept',mask:0..15,kept:null|{source,mask}}`. There are no attempts, scores, result timestamps, mastery fields or saved supported/independent verdicts. Derived model status is not stored as a historical achievement. Only Start creates absent work; all edits/recovery/Keep are explicit. No extra storage key.

Source `{version:1,model:'four-links-one-filament-v1',id,title,request,initialMask,copy,example}` has id matching `^[a-z][a-z0-9-]{0,63}$`; title≤160 UTF-8 bytes, request/each required ordinary-text copy field or caption≤1200bytes without control characters, whole source≤32KiB. `copy` freezes every teaching/status/help/reference/narration sentence above and four wire labels. `example` has exactly three understood masks/captions. Ordinary navigation and action chrome are not source. The static topology/renderer is versioned, not compared to today's labels/case count/example masks. Preserve harmless unknown fields under global bounds. Unknown versions or malformed individual work/Keep stay raw; they never block readable sibling cases. A kept snapshot owns its source, never aliases the active one or borrows current copy.

Every persisted change uses a detached candidate and actual formatted `notesReport(candidate)` → `prepareProgressImport` plus existing byte/depth/node/key bounds before commit. Refuse atomically, leaving model mask, page, source, Keep and all other roots untouched. Focus a notice: **“This change could not fit safely. Earlier work stays unchanged. Download notes, or use a separate explorer if the notebook is full.”** No mathematical exposure bridge is needed: this model has no multiplication fact/answer. Local example stepping and pure read-only rendering create no learner mutation. Current-source model text never replaces old kept sources. No regrading, auto-pruning or minimum catalog-completeness check on load.

Explicit confirmed **Start a separate lantern notebook** retains the entire old root, including earlier retained raw/kept/case work, before starting empty cases. Check actual formatted report size after wrapping it. Canceled, stale, used, detached or closed confirmations do nothing. Event handlers verify the mounted route/explorer and captured active root/current work before acting. Route exit, explorer switch, import/reset, a different active case or source replacement invalidates old callbacks. Use existing host save-off/reset/import behaviors and one optional raw transfer root. Notes describe saved model arrangements and limitations, not observed physical circuits or learning.

## Acceptance and release

Before build, independent review must check finite physics/topology, the separate bulb contacts/insulator/filament cutaway, original rendered art, all exact teaching/status copy, the unsupported-bypass boundary and the new action's novelty. Resolve findings before runtime.

Verify all16 masks independently against the stated table: two glow, seven open, seven bypass. Include both reversed working pairs, removing either lead, same-contact paths, and extra links that bypass the filament. Rendering must show the exact selected endpoints and no crossing junction; body contacts stay distinct. A source with changed old copy/labels/example masks remains readable and uses its own renderer version. Current and kept work remain separate, healthy/raw siblings survive, no load-time pruning occurs, and unknown versions do not acquire today's rules.

Actual Chrome at320/820px must manipulate each connection with touch/keyboard, inspect labelled art, reverse/back out without losing work, keep incomplete/paused/glowing models, replace only on confirmation, hear the actual current state, and return after route/reload/explorer switching. Download actual notes and import a real file as a separate explorer. Test actual full-report capacity refusal for Start, link, page, Keep and whole-root recovery; no stale callback/dialog changes a new explorer or case. Check the existing source/transfer and relevant Workshop routes without making an all-device or learning-effect claim. Independent implementation review, root verification and final exact-head Claude release clearance precede merge; intended-account deployment remains separate.
