# PR62 proposed specs: bounded independent Codex review

2026-10-22. Codex reviewed the four unnumbered Claude-authored drafts at `49a4dd5` in a separate context. This receipt records findings resolved in `fix/pr62-spec-review`; it does not grant build, content, source or Claude implementation clearance. No runtime code, media, atlas mapping or deployment changed.

| Draft | Finding and resolution |
| --- | --- |
| [The Town Remembers](../specs/proposed/town-remembers.md) | The tray forms hardcode the two-guest, 100/150 mL base. Eligibility now checks those values and the frozen mL unit before using any saved tray. Artefact identity uses an ordered tuple of the primitive values each form reads, including case id; old undated records sort first and saved case id breaks date ties. Acceptance covers changed bases, tuple collisions and stable selection. |
| [Library read-alouds](../specs/proposed/library-read-alouds.md) | The existing Paris pack format has no image field and shares its multiple-choice choices across variants. The first pack is now text-only. All three dated choice sentences must occur verbatim in every passage; the short passage has a modestly larger budget for those sentences, a textual photograph scope, an in-passage source credit and a clear real-Paris versus imagined-town distinction. Content acceptance checks those constraints. |
| [Field kit](../specs/proposed/field-kit.md) | The draft promised no-material alternatives even for sowing, measuring and handwriting. It now offers read/talk and **Not today** when materials or a view are unavailable, while an available window or walk can support actual observation without special equipment. Outcome codes and saved fields are unchanged. Practical content and safety review remain required. |
| [Willow Path](../specs/proposed/willow-path.md) | No bounded wording correction was needed. Its status now records this Codex pass without implying that the source-paper audit or independent content review is complete. |

All four remain proposal drafts. Independent content review, the relevant source audits and a separate Claude follow-up review are pending. The Library pack also waits for its separately reviewed saved-Paris-visit repair before build. The phonics/audio and rights gates in the existing roadmap are unaffected. No implementation or learner-outcome claim follows from this document review.
