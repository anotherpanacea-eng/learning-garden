# Explorer profiles and progress safety

Status: implemented; independent spec and implementation reviews cleared. Applies to every destination because all records share one saved state.

## Problem

All progress (Number Garden, multiplication garden, story visits, café, orchard, science, Paris) lives in one `number-garden-v1` value. Two children sharing a browser therefore share one notebook: observations, familiarity, least-seen story rotation, café orders and suggested fact sets blend, so the notes describe neither child.

`restoreState` in `core.mjs` returns a fresh state when any original baseline, practice or puzzle record fails validation, and the next save overwrites the stored value. Newer modules validate and recover their own fields, but a failure in that first gate discards everything, including all newer destinations. A future migration error would erase real play without warning.

## Explorers

Add an optional explorer list. Each explorer is identified by the existing explorer avatar choice (Fern, Reed, Sky) plus one of six garden colors and one of six garden symbols (leaf, acorn, shell, feather, pebble, flower), so two children can pick the same avatar and still tell their explorers apart without reading. No name, nickname, age, grade or other free-text field is added, consistent with the [first visit](../first-visit.md) privacy boundary.

- `learning-garden-explorers` holds `{version:1,activeId,explorers:[{id,avatar,color,symbol,createdAt}]}`; each explorer's full state lives under `number-garden-v1:<id>` in today's shape, so every `ensure*` function applies unchanged.
- With one explorer the app looks as it does today, plus a small "Exploring as" chip in the header. With two or more, opening the app shows **Who's exploring?** with explorer tiles and **Someone new**.
- Guide choice, reading voice and read-aloud preferences belong to the explorer. The persistence switch stays device-wide.
- Grown-up notes show the active explorer, a switcher, and per-explorer download and clear. Clearing one explorer or all explorers uses the existing confirmation pattern.

Migration on first load: copy the raw `number-garden-v1` to `number-garden-backup-<date>`, create one explorer from the saved avatar (or Sky when none was chosen), copy the state to its key, and keep the original value read-only until a grown-up removes it from notes. Notes say once that earlier shared play cannot be separated automatically and offer **Add another explorer**.

## Keep data when a restore fails

`restoreState` reports a failure reason with its fresh state. Before anything saves over a value that failed to restore, the raw value is copied to `number-garden-kept-<id>-<time>`. Notes show "Some saved progress could not be read. It has been kept." with **Download the kept copy** and **Remove it**. Validation stays strict; only the overwrite changes. Future incompatible schema changes require an explicit migration and backup; keep the two most recent migration backups per explorer.

## Export

Download covers the active explorer and adds `explorer:{avatar,color,symbol}`. The file name gains the explorer's symbol and the date and still matches the existing `**/number-garden-notes*.json` ignore rule.

## Verification

Checks with a fake `localStorage` and synthetic explorers: migration preserves the original state exactly and writes a byte-identical backup; a corrupt value is kept verbatim after the next save; records under one explorer never reach another explorer's recommendations, story rotation, fact suggestions, café history or familiarity; save-off, reset and export work per explorer. Browser: create two explorers, play one Number Garden trail and one café order as each, reload, switch, and confirm notes stay separate.

## Build clarification

Storage failures fail closed: legacy and unreadable raw values are never overwritten until a byte-identical backup has been written successfully. Migration writes the copied state before committing the explorer-list pointer; failed writes keep the original untouched and show a persistent save warning. In-memory exploration stays available. Switching explorers discards transient screen/session handles and loads only that explorer's state. Corrupt explorer lists are kept under a recovery key before replacement; invalid profile identifiers are never used as storage paths. Save-off is device-wide: it removes all app-managed saved explorer, legacy, backup and recovery copies while retaining current explorer sessions in memory. Notes explain that scope before the toggle. Each destructive clear/remove action uses confirmation.

Keep the established state.version=1 restore contract; version the explorer envelope separately. Additive plantings are normalized independently. No separate pre-plantings backup is kept: the only saves without plantings are earlier shared saves, which the migration already backs up and keeps. Future incompatible changes require an explicit version migration and backup; do not introduce an unused migration framework. Voice and speed preferences are copied into each explorer state.
