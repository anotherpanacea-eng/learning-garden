# Café welcome supper and New Game Plus

## Experience

Give the ongoing café a visible, finite story goal: serve six tables for a welcome-back dinner for neighbors returning from mending the garden after the storm. The lit café and shared meal mark the first recovery ending; later New Game Plus gatherings follow life returning to the garden rather than repeating the storm. Each completed order lights one of six lanterns on an original café illustration. Serving the sixth table changes the scene to a celebration, announces the supper complete, and offers **New Game Plus** and **Keep serving**. Help, repairs, retries and supported arithmetic skips count equally when an actual order is served; a skipped guest does not count. This is a play goal, not a math score or mastery claim.

Keep every existing destination and action open. No timer, accuracy threshold, compulsory difficulty increase, paid currency, streak, penalties, automatic audio, or reset. The celebration is part of the page rather than a blocking modal. Use readable redundant text for the lantern progress, touch/keyboard buttons and optional local narration. Static art works with reduced motion; animation is unnecessary.

## Endless continuation

New Game Plus starts another six-table supper with a new illustrated decoration/theme. Rotate a small authored set of four themes indefinitely, label the round (New Game Plus 1, 2, ...), and keep the selected number range. The goal stays six actual served orders each time. Keep serving remains available without starting a new round; play never stops at the win.

Store only `cafe.supper:{round,startedAtServed}` alongside the existing `served` counter. Initial round is 1 with baseline 0, so saved earlier service receives credit and can already complete the first supper. Starting New Game Plus increments the round once and captures the current served counter as the next baseline. Earlier extra service is acknowledged by the first celebration rather than forcing many immediately completed rounds. Validate both integers, the baseline not exceeding served, round 1 baseline exactly 0, and sufficient lifetime service for later rounds. Invalid/missing supper fields fall back to the initial goal without touching existing orders, counters, supplies or records. A render/reload never advances the round or creates a guest.

Only a valid served order changes goal progress through the existing idempotent `serveCafe`. Repairs, arithmetic, failed/double service, route changes, guest skips, and gathering cannot fill a lantern. Starting New Game Plus requires a completed goal. It never spends/refills stock, grants a discovery, resets/changes a waiting order or alters learning records. If the counter is resting or the current order is served, the explicit New Game Plus action can invite the next guest; if an order is in progress it stays exactly where it is. Repeated/double New Game Plus clicks must be rejected once the new baseline is set. Keep serving similarly resumes a waiting order or explicitly invites a next guest.

The existing browser saving toggle, export, confirmed reset, shared notebook and conservative order recovery stay unchanged. Notes distinguish supper/round play progress from arithmetic evidence; no celebration changes supported or independent records. Full explorer profiles and restore-failure backups are separate work proposed in PR #2, not a dependency of this additive café field.

## Related work

Read PR #2, **Spec the Number Garden refresh**, at `5a76b581b30bbfae73b964640fe8d575a4a5eed6`. Its proposed world regrowth through participation informs visible café restoration and equal credit for supported service. Its picture corrections and progress-safety/profile work remain proposed and deserve their own independent review. Use spec 21 to avoid numbering collisions with PR #2's 14–20 proposals and the already implemented French spec 14. No PR #2 source is merged or copied.

Refreshed Jane `LESSONS.md` on 2026-10-18: its finite quest/finale structure is a design reference for a clear ending with continued play. Reuse our current café serving, gathering, repair, local speech and original SVG patterns. No new upstream code/prose or Marble curriculum mapping is needed for this story goal. Existing licenses and public-repository privacy rules remain.

## Delivery

Independent spec review, implement, independent implementation review, resolve findings, open a separate follow-up draft PR while PR #1 is under review, and publish to the current public Site. Keep the PRs unmerged. Test first/remaining/sixth service, supported service, skip and stock/idempotency guards, New Game Plus from resting/served/active states, many rounds, legacy saved service credit, malformed supper fields, reload/export/reset and saving-off. Browser QA reaches a win through actual café play in a synthetic local session, checks keep serving and New Game Plus, pause/reload, and tablet/phone layout. Existing regression suites remain green. Do not introduce a new economy or progression framework.

## Review and verification

Independent spec and implementation reviews cleared the bounded state, service-only progress, preservation, and idempotency. All existing suites plus the focused supper checks pass. Browser QA played six actual orders with two gathering trips and supported arithmetic, reached the celebration, reloaded it, used Keep serving, then began New Game Plus while a bunny’s plate was partly prepared. Guest, plate and stock remained unchanged; the new baseline and plate survived reload. Phone/tablet layouts and notes were checked. The first ending’s copy explicitly welcomes neighbors back from tending the storm-tossed garden.
