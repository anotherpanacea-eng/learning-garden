# 85. Hundredths Bridge: independent implementation review

A separate internal reviewer cleared [spec85](../specs/85-hundredths-bridge.md) at `318cecbedca66718e8eb9c58d8f50893a6396e8f` after two narrow model and exposure clarifications. No external model call is claimed.

The first implementation review of `4179eab144a9d2f541bb5c12a9d0018638a8e2fe` found no P1 and three P2 issues:

1. Check, Keep and newly displayed facts could enlarge an importable, near-limit notes report beyond the actual import limit. The Start preflight budgeted source display but not every later mutation and the shared fact hook.
2. Two comparison grids and their captions were sibling nodes in a two-column layout, so the pictures could appear diagonally rather than as aligned pairs.
3. A saved comparison check with a null choice and a different outcome could appear as a readable wrong answer, even though no choice was made.

The root also identified a related exposure boundary: a paused matching Bramble multiplication puzzle could receive the displayed 10 × 10 or 3 × 10 fact without qualifying its later positive evidence. The targeted repair at `c8d1f585deed1840a80cf952fab5676efae8c636` preflights a detached copy through the actual formatted notes report, including imminent display flags and the existing shared fact-exposure effects, before committing any new Hundredths work. It groups each comparison picture with its caption, and treats a null comparison as a valid draft but an unreadable checked record. An invalid case stays raw while its siblings remain open.

Only the current valid, unfinished, matching generated Bramble multiplication rival may gain the optional `priorFactShown` flag from an actually displayed fact. This is distinct from requested help and leaves `supported`, `afterSupport`, previous attempts, completed rounds and archived history unchanged. The existing positive evidence readers exclude that exposed round; the bridge does not rewrite old results, select a future challenge, or feed decimal outcomes to another game. Earlier hidden checks and raw records are not scanned for exposure.

An independent focused follow-up cleared `c8d1f58` with no remaining P1/P2. A nonblocking boundary-control issue remained: an impossible Add or Remove at 0 or 100 showed the generic save-limit refusal. Follow-up `b13e2bc35d1bac3a3ae4755fd4eee2391a7cacd8` disables only moves that would leave the 0–100 range, without clamping a requested ten-part move. After the last valid move, focus goes to an enabled reverse control or the request heading. A second focused independent review cleared that exact UI head, including all 404 amount-and-step disabled states, with no P1/P2.

The builder ran 3,285 Hundredths source assertions, 27,977 adaptive Bramble checks, 4,695 learning-connection checks, 88 transfer checks, and focused Post Office, bundle, Rain, Sharing and Equal Groups checks. Local Chrome passed 250 assertions at 320px and 820px, including all six requests, frozen checks, actual notes download and file import, near-limit Check and Keep refusal with an importable report, aligned comparison pictures, current paused Bramble qualification and later answer, and 0/5/95/100 keyboard and touch controls. The first independent follow-up reran the 216-assertion Chrome journey at `c8d1f58`; the second reviewer inspected, but did not independently rerun, the final 250-assertion Chrome journey. All checks use synthetic records.

This remains guided pictured practice. The six requests do not establish independent decimal writing, comparison fluency, fact mastery or educational efficacy. Physical iPad behavior, audible narration and production deployment are unverified. Root owns final composition and release decisions.
