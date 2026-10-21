# Travelers' Archive: Paris, 1910 — what can a picture tell us?

## Concrete first visit

This makes [spec 24](24-travelers-archive.md)'s first archive visit build-ready. A fictional parcel at the Paris bookstall contains a real historical photograph and a modern archive's short chronology. Help the present-day garden guides label the parcel and answer a reader asking: **“Did the water disappear as soon as the river reached its highest mark?”** Discover a place, arrange three dated events, examine two different kinds of source, and prepare a reply with evidence and a limit.

The framing parcel, guides and reader are **fiction**. The visit concerns **Paris and the Seine flood of January–March 1910**; it does not place our fictional garden in that real disaster. Do not invent a child's diary, eyewitness voice, rescued bookstall, historical dialogue, or a quotation from a person in a photograph. No catastrophe spectacle, costume shorthand, pretend rescue action, or claim about what all Parisians thought. This introduces historical inquiry through an accessible small case, not a survey of French history or a language-level placement.

Optional entry `#archive` from the open home/Paris destinations. Four short pages: **parcel → place and dates → sources → reply**. Within the middle pages, one immediate task at a time with Back/Next and direct task choices. Three linked investigations are **place the evidence**, **put dated events in order**, **compare what sources support**. A final reply is optional and ungraded. All tasks and pages remain open, with source material preserved beside the prompt. Replays can vary which of the finite questions is foregrounded, but this release is one reviewed visit, not unlimited generated history.

## Verified evidence pack and rights receipt

Checked 2026-10-20 local / 2026-10-21 UTC. Temporary research cache: `/private/tmp/learning-garden-archive-sources/`, including source HTML, museum IIIF manifests, the full chosen photograph, current official chronology PDF, refreshed Jane/Marble files and `rights-receipt.json`. The cache contains public sources only. Public implementation must include a small source/rights receipt in the feature's source metadata or spec; do not depend on the temporary path for runtime provenance.

### Source A: a period photograph, one selected view

- Museum inventory **PH8646**, catalogued as *Crue de la Seine (Janvier 1910) / Quai des Grands Augustins*.
- Creator attribution: **Identité judiciaire**, as the museum records it. Do not replace this with an invented named photographer or claim a specific personal intention. The individual photographer and the exact commission/purpose are not stated in the chosen record.
- Museum production date: **29 January 1910**; its title identifies the scene only with January 1910. Do **not** equate production/catalogue date automatically with the exact moment photographed. The event represented is the January 1910 flood at the **Quai des Grands-Augustins, Paris**. Museum cataloguing and the present digital reproduction are modern; do not imply the website was made in 1910.
- [Official catalogue and rights label](https://www.parismuseescollections.paris.fr/fr/musee-carnavalet/oeuvres/crue-de-la-seine-janvier-1910-quai-des-grands-augustins).
- [Official IIIF manifest](https://apicollections.parismusees.paris.fr/iiif/320158523/manifest).
- Selected image: `lpdp_30184-10.jpg`, first/hero visual. [Direct official image](https://apicollections.parismusees.paris.fr/sites/default/files/styles/4k/collections/atoms/images/CAR/lpdp_30184-10.jpg?itok=2rfGM7e_).
- **Image reuse receipt:** the catalogue's hero visual is followed by an explicit **CC0** link to [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) and the credit **CC0 Paris Musées / Musée Carnavalet - Histoire de Paris**. The cached page contains the matching image filename and this licence/credit. The manifest identifies the same image but supplies no licence field; the catalogue is the licence receipt. Another visual on this record lacks an explicit CC0 label, so this permission must not be generalized to every image or the whole website.

The chosen full image was visually inspected. It shows water along buildings, people, boats and a raised wooden structure in the foreground. These are suitable broad visual details; their exact positions must be rechecked against the delivered resized image before any hotspot is authored. No exact depth, sound, colour of historical objects, weather cause, person's name/emotion/intention, or condition of all Paris is visible. A monochrome image does not make the scene colourless or establish its age without metadata. Do not infer chronology from image tone, clothing or water height.

Implementation may vendor a proportionately sized local reproduction of **this exact CC0 visual**, retaining the full field of view. Record resizing as a reproduction edit. No AI restoration, colourization, invented off-frame detail, labelled identity or misleading crop. Credit and source link remain beside the image and in source notes. If the actual file/rights cannot be reverified at build time, use an explicitly **original modern illustration** with a link to the original photograph, and rewrite tasks to compare supplied descriptions; do not pretend a modern drawing is a primary photo or score photographic observation against it.

### Source B: a modern official chronology

- Publisher: **Archives de Paris**, *Repères chronologiques : la crue de janvier 1910*.
- Type: a **modern educational chronology**, not a document written during the flood and not an eyewitness. The PDF does not state its own precise creation/publication date; say **modern; exact publication date not stated**, rather than assigning the parent teaching dossier's date to it.
- [Official teaching-page landing](https://archives.paris.fr/offre-pedagogique/ressources-pedagogiques/la-crue-de-1910-une-societe-face-aux-risques), whose “La crue de janvier 1910 à Paris” chronology link currently serves [this one-page PDF](https://archives.paris.fr/image/303449/11801454?crop=centre&download=1&force-inline=&format=pdf&realHeight=1754&realWidth=1240&region=full&size=!800,800).
- The old `_depot_ad75/_depot_arko/articles/643/crue-1910_doc.pdf` returned 404; do not ship that stale link. Prefer the stable landing link plus the verified current PDF.
- Reuse **facts in original short modern summaries**, not copied PDF layout, worksheet, images or passages. No permission for general PDF/image reproduction has been inferred. The archive describes a teaching purpose; no particular author or exact date is invented.

The three ordered event cards, labelled **Original modern summaries based on Archives de Paris**, are:

| Stable event ID | Event date | Original short card |
| --- | --- | --- |
| `river-peak` | 28 January 1910 | The river reached its highest mark during this flood at the Austerlitz measuring scale. |
| `commission` | 9 February 1910 | The government formed a commission to study the flood and propose preventive measures. |
| `river-returns` | 15 March 1910 | The chronology records the Seine returning to its riverbed, with railway and metro services resuming. |

Optional deeper source text may say the recorded peak was **8.62 m on the Austerlitz gauge**, never “8.62 m deep everywhere,” “8.62 m above normal” or an exact depth at the photographed street. Omit the number from the first task if it distracts from source/date work. [The museum's PH3201 historical note](https://parismuseescollections.paris.fr/fr/musee-carnavalet/oeuvres/crue-de-la-seine-rue-surcouf-7eme-arrondissement-paris-le-28-janvier-1910) independently supports the peak date and gauge reference; it is corroborating author research, not a third required learner source. Avoid wider casualty/building/population claims in this first pack.

### The two accounts the learner reads

These are **two original modern guides to different source types**, clearly labelled as written for this game. They are not quotations, translations of testimony, or two independent eyewitnesses:

- **Picture account:** “This photograph records one view at the Quai des Grands-Augustins. We can look for water, boats and buildings. The museum dates its production to 29 January 1910; that does not by itself fix the exact moment pictured. It cannot tell us what every person felt or show the whole city.”
- **Date account:** “The Archives de Paris chronology puts several events in order. It records the river's highest mark on 28 January. It places a flood-study commission in February and the river returning to its bed in March. This modern summary helps us compare dates; it does not show every street or give us a person's private thoughts.”

Reading/narration of either remains support, not independent decoding evidence. These summaries and the catalogue describe the same historical flood from different scopes; they do not disagree simply because one notices a street and the other selects city events. They also are not fully independent corroboration: the modern archive and museum record may draw on overlapping historical records. Do not treat two website labels as proof that every claim is settled.

## Investigation 1: a place-map and source labels

An original **modern schematic of central Paris and the Seine**, not a historical map, helps connect two labelled sites: **photo: Quai des Grands-Augustins** and **gauge: Pont d'Austerlitz**. Use a simple river ribbon, two distinguishable symbols and a legend (camera / measuring scale). The river/places are factual; the simplified outline, spacing and symbols are our teaching drawing. Mark **not to scale; not for finding a route**. No flood-extent colouring, hazard zone, travel time, distance scale, inferred water route or navigational directions. Keep schematic placement geographically reasonable; the photo site is by the central Seine, and the bridge/gauge is farther along the river to the southeast. Do not create a tile/GIS service or copy a proprietary basemap.

Primary geographic checks: the museum catalogue locates the photo at the named quay; [Ville de Paris on the bouquinistes](https://www.paris.fr/pages/les-bouquinistes-et-paris-histoire-d-amour-en-majuscules-7886) identifies it with the Seine's left bank. [Paris's official tourism office's bridge entry](https://parisjetaime.com/transport/pont-d-austerlitz-p1879) gives the Austerlitz bridge location; [official HydroPortail historical station metadata](https://hydro.eaufrance.fr/stationhydro/F700000109/fiche) identifies Austerlitz's historical measuring station. The schematic supports identifying source location, not map-distance or historic street-layout mastery.

Tap one legend symbol or choose the same labelled button in a text list, then place the **photograph card** or **gauge-event card** beside its named location. Stable finite choices: `grands-augustins|austerlitz|unsure`. Feedback compares source labels, keeping a different choice editable. A wrong location is not a loss; show the relevant name and let the child revise. A map click is not geographic knowledge beyond this task, and a camera symbol does not mean the museum is physically at that photo site.

## Investigation 2: order dated events, not appearances

Supply the three event cards above. The learner fills **earlier / next / later** slots using tap-to-select then tap-to-place, with Move earlier/later buttons as keyboard alternatives; drag may be optional. Keep each card's date visible, including February and March. A choice can remain incomplete or out of order. Check reads the actual permutation, records a frozen practice attempt and offers specific date feedback. No sorting on page load, auto-correction or correct-answer gate.

Show an **ordinal date strip**, not an evenly spaced metric time axis. Its caption says “Order of these three dates; spaces do not show equal amounts of time.” Do not place 28 January, 9 February and 15 March at equal geometric intervals while claiming a scaled timeline. The photo's production-date label can be inspected beside the strip; it is an object/catalogue date, not proof of the exact scene date or a fourth mandatory event. A child can leave the dates unarranged and visit any other page.

Optional human prompt: “Which label tells you this happened in the past?” Use dates and source records; no judgement from the picture being black and white. Calendar subtraction, centuries/BCE, a complete city chronology and date memorisation are outside the first release.

## Investigation 3: what supports the reader's question?

Keep the **real chosen image** and the two modern account cards accessible with short sources. One finite prompt at a time; at least these reviewed contrasts:

1. **Visible or not shown?** For the full chosen image: **boats and water beside buildings** is a visible detail; **everyone in Paris was happy** is not shown; **the water was exactly one metre deep here** cannot be measured from this picture alone. Accept `visible|not-shown|unsure` appropriately for each finite claim. Never identify a person's job, gender, motive or emotion from appearance.
2. **Which source answers which question?** “What is visible at this quay?” → photo; “What date did the river reach the recorded peak?” → chronology; “What was a particular person thinking?” → neither supplied source. Keep **neither / not sure** real options. Modern summaries are labels of source scope, not fake primary-source voices.
3. **Does peak mean instantly gone?** The chronology places the peak on 28 January and the river returning to its bed on 15 March. Supported answer: **the chronology places that return after the peak**; the photograph supplies a view of water at one quay during the flood, not a date when every street dried. Unsupported extensions: **all Paris stayed underwater until March**, **the water's exact street depth is known**, or **the photo proves why the flood happened**. Keep an explicit source question: **Does the photo's 29 January production date prove exactly when its scene was photographed?** → **Not by itself; its title identifies the flood/month but the exact scene time is not established here.** This is source/date comparison with limits, not independent dating or total-city recovery.

For each question, feedback points to the actual source or missing information. All alternatives stay revisable, no score/level/mastery/penalty. Optional help can underline one relevant source label, narrate, show a differently worded example or invite working together. Support is recorded when supplied; opening a source is source availability, not a correct comprehension response. Expose only original approved short text; do not scrape/generate new historical accounts at runtime.

## Reply and next invitation

The fictional present-day reader asks the main question. Offer a structured reply with three independent editable choices:

- **What I can say:** the chronology places the river's return after its peak / all-city-dry claim / not sure.
- **My evidence:** chronology peak and return cards / photo detail for a local view / both source types with their distinct roles / an irrelevant source label / not chosen. For the main timing question, the chronology pair supplies the direct support; a photo can supplement a local picture but is not required proof of the dates.
- **What I cannot tell from these:** exact street depth / everybody's feelings / both / not chosen.

Feedback on these finite selections explains support and limits separately; choosing a prepared sentence is supported composition. Then invite an **optional original reply**, spoken to an adult or typed locally, with no word-count correctness, keyword score, required length, grammar/spelling grade or automatic historical truth judgement. A human can discuss/revise it. Use a generous visible limit (for example 2,000 Unicode characters), preserve exact spaces/newlines/punctuation and explain the limit before entry. Reject over-limit submission clearly; no silent trimming or normalization. Editing never appears to change the literal simulated outcome of a supplied card.

“Keep my reply” freezes its current selected evidence and exact optional text, source provenance and support; incomplete/uncertain drafts are welcome. Revising later does not retroactively rewrite a prior checked snapshot. One latest kept reply and bounded attempts are enough. No external message is sent. A link back to Paris/Post/Story Loft may invite telling a story **inspired by** the visit, explicitly labelling any new scene fiction; do not insert the reply into an existing delivery, alter a story or claim historical events happened to our fictional companions. A later message-reader bridge needs its own reviewed transfer step.

## Data, state and evidence semantics

Optional `travelersArchive` version-1 root, independent of legacy Paris, letters and science. Missing starts fresh; pure validation/read/render does not create a response or mutate unrelated state. Malformed/future/unknown-key or unavailable pack revisions stay exact and unavailable; explicit recovery retains the full raw payload and begins clearly familiar/uncertain practice. Import/export must allow unknown payloads through for recovery, saving-off and explorer switching follow existing behaviour, and notes escape all learner text/raw payloads.

Finite content pack `paris-flood-1910-v1`: source records, known/event/creation date precision, original summaries, event IDs, two site IDs, claims, answers with original feedback, image source/license/credit and current local asset path. Source metadata and actual-source evidence stay distinct from the game's modern interpretation. Source dates that are unknown remain null plus a precision/type label, never coerced to 1910.

Suggested minimal state: `version`, `packId`, page/task, selected source/detail, two map choices, a 0–3 unique event-order array, finite claim/source choices, current reply selections and optional exact text, per-task sticky support (`help|example|audio|together`), reading report (`unobserved|together|reported-independent`), familiarity/source-exposure flags, latest kept reply, and up to 24 total check snapshots. Each snapshot freezes task/response, source IDs and their revision/provenance, shown support and familiarity; later help or editing does not rewrite it. No generated IDs/time service, grades, success graph, identity, age, device ID, external progress, recording or profile layer.

All structured checks are practice **with source material available**. Do not infer independent historical reasoning, decoding, fluency or original writing from completion. Report source/answer revelation, narration and together work separately from revisits. Any answer exposed in help or earlier attempts stays familiar on replay; recovery cannot manufacture a first untouched assessment. There is no need to invent an assessment timing protocol for the free reply because it is not automatically graded.

Free writing remains on the device unless a human explicitly exports it. Public fixtures, screenshots, tests, issues and review prompts use synthetic replies only; never real learner text or source exports. Save input without rerendering or losing selection/cursor on every keystroke. All text escaping, HTML rendering, narration, notes and export tests must preserve exact text safely. Use local narration without recording the child. Source-image viewing is local once bundled; optional official-source links open only on explicit action, with safe external link attributes and no learner identifiers or answers appended.

## Jane/Marble study, reuse and curriculum scope

Public primary files refreshed 2026-10-20 local / 2026-10-21 UTC: Jane `7802588313e6c6edc57432df398d9f3ddb9ff938` (`LESSONS.md`, `src/engine.js`, `src/stuck.js`, `LICENSING.md`); Marble `95e6dddef0a6a0af9ed973a3e3fd5f35da00a733` (`data/topics.json`, `data/dependencies.json`, README/license). Jane's finite ordering/matching items, stable current task, short steps and requested example are design references. No new upstream code, lesson prose, historical account or asset is copied; no generator, age routing, mastery, boss or points system. Keep existing attribution/licence distinctions: Jane code MIT, lesson/docs CC BY-SA, taxonomy derivatives ODbL/CC BY-SA. Museum CC0 applies only as documented above. Keep the bundled Marble pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` unchanged.

Verified matching descriptions at current upstream and bundled pin:

- `mt_TTzJTF-OkG` **Questioning Historical Sources**: supplied creator/date/source-type labels and what remains unknown; no independent archive research or invented author motive.
- `mt_wWlZoLQBR6` **Checking Sources Against Each Other**: a narrow source-scope/date comparison, including what cannot be corroborated; not two independent eyewitness confirmations.
- `mt_Lu4H4mbsqO` **Evidence Versus Interpretation**: distinguish visible photographic detail, catalogue date, modern summary and limited combined inference. No general historical-argument competency claim.
- `mt_JVVKT-_AD9` **Using Multiple Sources**: finite source selection for a particular question; no speed assessment, searching broad sites or complete research proficiency.

Upstream hard edges place sourcing before corroboration, and both before evidence/interpretation; preserve their direction without making locks or alleging prerequisite mastery. The game's three tasks are original teaching invitations, not new taxonomy edges. Do not map Egypt-specific timelines/maps just because our game has a timeline. Broader history vocabulary, chronological reasoning and geography remain locally described scope where no exact general source node exists. Prepared replies are not independent writing; no French-proficiency mapping follows from a Paris setting. A separately authored French language pack is later work.

## Acceptance and delivery

Independent spec/content review before build; independent implementation/content/rights review plus root browser QA before publication. This is a new experience family with a few explicit functions and authored cases, not a general museum/timeline/GIS engine.

- Verify the exact local photo is the CC0 hero visual, full framing/proportions and permitted reproduction edits; record creator, creation-date precision, catalogue, rights and credit. Freeze licence/source metadata; do not label the entire archive CC0. Fallback drawing forces different task wording and no photographic-observation claim.
- Recheck three event dates/order and meanings against the current official chronology. Peak gauge number, if used, is tied to its scale and not street depth/above-normal water. No timeline inference from monochrome, dress, photographic water heights or current website dates.
- Source A is period photo; B is modern summary with unknown exact publication date. The original accounts/fiction/map are labelled modern. Do not invent testimony, motives, precise metadata or cultural stereotypes. The peak-versus-return sequence rests on the chronology; the photo's production date is not silently turned into a precise scene date. No all-city-dry or flood-cause conclusion.
- Map symbol/source labels and original schematic are accurate enough for the stated limited use; no hidden routing/metric/flood-extent claim. Order controls handle partial/reversed/permuted drafts, duplicates and January–February–March transitions with meaningful feedback, keyboard/tap alternatives and no gate.
- All finite claim/source/reply choices have reviewed support and uncertainty. Exact response/source/support snapshots remain frozen, bounded, familiar where appropriate; opening a page does not create an answer. Optional free response is human-read and wholly ungraded.
- Reload/back/cross-destination changes preserve current page, source focus, event order, selected evidence, pending/kept reply, exact free writing and support. Unknown/future/malformed/recovered/save-off/explorer/import/export/notes cases preserve all other roots and escape synthetic hostile strings. Typing retains cursor and narration matches current displayed text.
- Browser checks include narrow and tablet widths, 44px targets, visible focus, map/text equivalents, no drag requirement, optional picture-detail buttons and whole-image return, local narration, source-image credits and recoverable break. Image detail controls use fixed reviewed views or CSS zoom without losing the full-image reference; no need for a new image viewer library.
- Update curriculum map/atlas only for these built slices. Publish committed static assets through the established personal account; draft PR stays unmerged under existing exact-head review/merge boundaries. No learner information or credentials enter public source, screenshots or PRs.
