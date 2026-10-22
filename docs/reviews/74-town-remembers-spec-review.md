# Town Remembers: specification and content review

Independent read-only Claude reviews, 2026-10-22, invoked by Codex. These cover [spec 74](../specs/74-town-remembers.md) and its [source audit](../source-audits/74-town-remembers.md); they do not establish implementation or learning benefit.

- At `f294265`, all six forms were checked across their finite inputs. Three P2 findings remained: fitting choice positions were too predictable, jug-more help often supplied the waiting numerical answer, and the remembered jug label disclosed the coarser-scale answer.
- At `244cbb4`, Claude approved the repairs with no outstanding P1/P2: choices rotate by the kept-value index and freeze at Start; jug-more uses the other extra amount; the remembered jar is opaque and unlabelled until Check, with an accessible scale-position description.
- Root also adopted the optional clarifications: all six authored lists explicitly name the base order, and acceptance includes rotation and reload checks. These do not change the reviewed design.

Implementation must retain all six forms, optional entry, own-source saved records, separate support and familiarity, and source-game preservation. Independent implementation review, source tests and real browser journeys remain required before a draft PR is ready for integration. No merge or deployment is authorized by this receipt.

## Visible fact exposure follow-up

An integration probe found a real cross-game qualification gap: after Town's checked three-share bun errand explicitly showed 3 groups of 4, a generated 3×4 broad question still received `freshEvidence=true`. The source loaf had not shown that bun-group fact. The first independent Claude review of the narrow spec/source-audit fold at `36283a5` agreed with the finding and found three P2 omissions: expanded grown-up notes, the frozen helper's actual shape, and a mechanical guard for the relation stated by saved text.

The focused independent follow-up at `12fceff` **approved** the fold with no P1/P2 remaining. It verified notes visibility, helper-derived numbers, and explicit frozen-text guards against the actual Town implementation. Two optional P3 wording details were then folded: fixed prefixes for tray phrases and clarification that the errand page shows the last check while expanded notes show each readable check. No runtime, source-game, saved-state, or taxonomy change is covered by this receipt. Build and independent implementation review remain separate gates.
