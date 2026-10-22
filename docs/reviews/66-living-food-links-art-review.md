# Food Links: independent original-art and science-content review

Verdict: **Approved for the bounded original-art/science-content gate. No required repairs found.** Specification/implementation, browser accessibility, persistence and release gates remain separate.

Reviewed 2026-10-22 in a context separate from the content/core builder and UI/art builder. This reviewer previously authored [source audit66](../source-audits/66-living-food-links.md); this pass reviews their subsequently authored art/content rather than its own product implementation. Read the approved spec, `dist/food-links-content.mjs`, `dist/food-links-art.mjs` and the source dispositions.

## Actual image inspected

Actually opened and visually inspected **`food-contact.png`**, the rendered final three-diagram contact sheet, through the image-viewing tool. It displays the Broad bean plant, Black bean aphid and Seven-spot ladybird larva, each with visible text and full frozen picture description. This was actual visual inspection, not merely SVG markup review. The screenshot is temporary execution evidence, not a source image incorporated into the game.

- **Plant:** a living green stem with paired broad leaves, with no bitten leaf holes, detached edible bean or implication that an aphid swallows the whole plant. The supplied passage identifies sap as the food obtained from it.
- **Aphid:** enlarged dark pear-shaped body; six jointed walking legs, two finer differently coloured antennae, and two short rear cornicles clearly separate from the walking legs. The fine mouthpart visibly reaches the separate stem. There is no chewing mouth or caterpillar-like leaf damage. The wingless nymph label and description match the picture. Its black colour is explicitly not a species-identification rule.
- **Ladybird larva:** elongated grey segmented body, three pairs of walking legs at the front and four pairs of orange body markings. Short head appendages are distinct from the jointed walking legs. No adult red wing cases, adult wings, adult seven-spot pattern or caterpillar prolegs are substituted. The supplied label consistently says larva rather than adult.

The pictures are labelled schematics and not relative-scale comparisons, microscopy, leg-count exercises or field-identification plates. The aphid is deliberately enlarged rather than shown at a misleading asserted scale. Anatomy remains coherent even though counting it is not the task. The SVGs use original drawing primitives and contain no imported source photograph/illustration assets; factual citations do not imply permission to reproduce source pictures.

## Biological wording and four supplied cases

The named pathway remains *Vicia faba* → *Aphis fabae* → *Coccinella septempunctata* **larva**. The paper supports that exact feeding relationship under its experimental conditions, including aphids maintained on faba beans and supplied to predator larvae. The reviewed content imports no rates, cultivar effects, population-control result or claim of an observed wild garden encounter. [Shannag & Obeidat2006, full primary paper](https://www.jstage.jst.go.jp/article/aez/41/3/41_3_521/_pdf)

Sap feeding, the aphid's schematic features and the larval grey/orange body are consistent with the institutional sources. RHS's broader black-bean-aphid species-group language is not turned into identification by colour; the supplied case names the depicted organism. Different ladybirds have different foods, and the text explicitly limits this example rather than asserting universal aphid feeding. [RHS Black bean aphid](https://www.rhs.org.uk/biodiversity/blackfly), [UC IPM Aphids](https://ipm.ucanr.edu/home-and-landscape/aphids/), [RHS Ladybirds](https://www.rhs.org.uk/biodiversity/ladybirds)

All four questions and their expected relationships were read:

| Case | Asked role / expected neighbour | Correct directed relation |
| --- | --- | --- |
| Food for the aphid | Aphid is eater; plant supplies food | plant → aphid |
| An eater using the plant | Plant is food source; aphid is eater | plant → aphid |
| Food for the larva | Larva is eater; aphid supplies food | aphid → larva |
| An eater of the aphid | Aphid is food; larva is eater | aphid → larva |

The persistent source legend explicitly reads **food → eater**, with food supplying energy. The source `role` values and expected neighbours correctly preserve those directions when looking up either end. The first link is clarified as plant sap, not an entire plant being swallowed. The overview/help explicitly distinguish feeding among different organisms from Life Stages continuity and from travel. Food-chain arrow direction is consistent with the cited convention. [NParks food-chain explanation](https://biodiversitysg.nparks.gov.sg/our-ecosystems/food-webs/food-chains-and-food-webs-basics/)

The developmental and travel meaning alternatives are useful supplied contrasts, with uncertainty retained. The facts and help do not state a wrong proposed pair as true biology. Checking the actual UI's proposed-pair labelling, conditional assessment and recorded feedback belongs to implementation review. No claim of independently explaining energy, deriving diets from pictures, species identification, universal food-chain knowledge or learning gain is justified by the selections.

## Stable kinds, mismatches and future fallback

Inspected the drawing dispatcher and ran a focused render-string probe. All three known v1 kinds matched their card IDs and retained standalone SVG image roles with escaped frozen `pictureText`. Inline variants intentionally mark their SVG decorative; their surrounding choice/link labels still require normal UI accessibility verification.

The probe exercised five descriptor situations in both standalone and inline modes: future version, known kind mismatched to card ID, unknown kind, `constructor`, and `__proto__`. Each produced **no SVG** and retained the escaped frozen label/description plus the unavailable-picture explanation. A mismatched source therefore does not silently display another known organism. This establishes renderer behavior only, not full import/normalizer admission or round-trip preservation. Keep v1 drawing meanings stable for historical sources.

## Review boundary

No required art/science repairs were found. The reviewed picture/text contract is suitable for the supplied named pathway. This receipt does not claim browser-functional correctness, real-device behavior, audible narration quality, human screen-reader testing, historical-state fidelity, independent field observation, Café-stock integration or learning effectiveness. No runtime/content files were edited in this pass.
