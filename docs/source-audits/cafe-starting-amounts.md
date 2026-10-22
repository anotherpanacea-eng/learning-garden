# Café starting amounts source audit

Refreshed primary upstream files on 2026-10-22 before the implementation review:

- Jane revision `d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`: `LESSONS.md` and `src/engine.js`. Studied its teach/guided distinction and mastery-based selection. This optional parent-chosen default deliberately uses neither inferred mastery nor access locks. No upstream code, lesson prose or formats are incorporated.
- Marble revision `a8719737ff86ef7940ba5feca11940de1204103e`: `data/topics.json` (1930 topics). Its age/evidence metadata does not validate a starting band or decide a learner's ability. No taxonomy data is added, repinned or copied for this preference.

The implementation reuses the existing Café small pool, full 144-pair rotation, frozen order parameters, local range buttons and explorer storage. It introduces only an explicit per-explorer preference and a shared read-only resolver. Support, familiarity and recorded outcomes keep their existing meanings. Existing notices and upstream license layers remain unchanged.

This is a design-reference audit, not a claim that Jane/Marble offer an identical preference feature or that the resulting ranges are suitable for a particular learner.
