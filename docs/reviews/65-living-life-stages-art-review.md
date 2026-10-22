# Life Stages: independent art and science-content review

Verdict: **Approved for this bounded art/content gate. No required repairs found.** Implementation, persistence, browser accessibility and release clearance remain separate.

Reviewed 2026-10-22 in a context separate from the art/content builders. This reviewer previously authored the source audit; this pass reviews the subsequently authored diagrams and task content, not its own artwork or product implementation. Read spec65, `dist/life-stages-art.mjs`, `dist/life-stages-content.mjs` and the primary-source dispositions in [audit65](../source-audits/65-living-life-stages.md).

## Actual visual evidence

Actually opened and visually inspected **`stages-contact.png`**, the final supplied four-stage contact sheet, with the image-viewing tool. It shows all four rendered diagrams, visible captions and full stage passages. This was an image inspection, not merely a reading of SVG code. The same stable v1 drawing paths were then inspected in the source module. The temporary screenshot is execution evidence, not a repository deliverable or a source image incorporated into the game.

- **Egg:** one yellow, ribbed/pointed teaching egg appears on a green leaf explicitly labelled as its underside. The enlarged/not-to-scale caption is visible. No cluster of Large White eggs is substituted. Labelled orientation is appropriate for this schematic; the picture is not offered as independent field evidence.
- **Caterpillar:** pale green body, visible segmentation and fine short dorsal hairs; the foreground cabbage leaf covers its underside. The drawing does not invite counting hidden appendages or imply that absent drawn feet establish actual absence. No adult wings are attached to the larva.
- **Pupa:** an angular green chrysalis beside an upright support, with an attachment line/girdle. Its silhouette and internal lines read as a biological stage, not a tied fabric parcel, tent or animal entering a bag. No separate replacement butterfly is pictured entering it.
- **Adult:** four distinct pale wings, darker forewing tips, two visible forewing spots on each side, body and antennae. The female teaching-picture label supports the egg-laying relationship. Exact markings/sex are not assessed; this is sufficient schematic stage art, not a species/sex identification plate or leg-count diagram.

The diagrams use independent enlarged views rather than a relative-size comparison. The contact sheet's egg caption explicitly discloses that pictures are not to scale; the specification and frozen descriptive text also state the schematic/non-observation boundary. The species context is Small White / Cabbage White, *Pieris rapae*, rather than an assertion about every butterfly or all insects. These SVGs contain original drawing primitives rather than incorporated source photographs or illustration files; source-image rights are not inferred from factual citations.

## Science and task wording

The passages consistently describe a **possible** development: an egg can hatch; a growing caterpillar can form a chrysalis; an adult can emerge. No fixed timing or guaranteed survival is claimed. Cabbage is a named host example for this species, not every caterpillar's diet. The source-based distinction between Small White and Large White egg/larval features is preserved. [Bohart Museum life-cycle brochure](https://bohart.ucdavis.edu/sites/g/files/dgvnsk4616/files/inline-files/Cabbage%20White%20brochure_0.pdf), [RHS species account](https://www.rhs.org.uk/biodiversity/cabbage-caterpillars), [UC Davis species account](https://butterfly.ucdavis.edu/butterfly/pieris/rapae)

All four supplied forward links have coherent meanings. Egg→larva, larva→pupa and pupa→adult concern development of one individual. Adult female→egg explicitly concerns offspring/new generation. The adult passage directly rejects an adult turning back into an egg. No complete-metamorphosis-two-species attainment, larval body-key identification or real tracked-specimen claim is introduced.

All eight questions were read. The six within-individual next/before questions identify adjacent chart stages without describing reverse biological development. Both boundary questions explicitly identify offspring or a parent before new eggs. The overview/help state that looking back is not growing backward. For a before-question, the content instructs interpreting the selected earlier stage→reference as a forward biological link, rather than reversing the developmental arrow. Chart-neighbour choice and interpretation remain separate meanings; supplied choices are not independent retelling, drawing or explanation. Checking their actual conditional assessment and displayed arrow treatment belongs to implementation review.

## Stable drawing kinds and unavailable-picture fallback

The renderer dispatches only explicit v1 `egg`, `larva`, `pupa`, `adult` kinds through an own-property check. Kind dispatch is independent of current task ID or selected answer. The known-render branch supplies SVG `role="img"` with the supplied frozen `pictureText` as an escaped accessible name.

A focused render-string probe exercised all four known v1 kinds, a future version, an unknown kind, and the inherited-name candidates `constructor`/`__proto__`. Each known kind retained its image label; each unavailable/unsafe variant returned **no SVG** and preserved escaped frozen label/description text with the unavailable-picture explanation. This is evidence about the renderer's direct output, not proof that import/normalization admits every future saved drawing or that historical sources survive all application operations. Do not change v1 drawing semantics in place when adding future representations.

## Gate boundary

No art/science repair is required by this pass. The diagram/count/wording contract is suitable for the supplied four-stage lesson. This review did not edit runtime/content, test browser interactions, listen to narration, use a human screen reader, establish persistence correctness, verify physical device behavior or measure learning effects. Those claims and final implementation/release gates remain outstanding outside this art/content review.
