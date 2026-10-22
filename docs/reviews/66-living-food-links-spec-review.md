# Food Links: independent specification and content review

**Verdict: BUILD-READY. No unresolved P1/P2 findings.** One minor acceptance-count correction was folded into the specification and independently re-read before this verdict. No additional feature or framework is required.

This separate reviewer context applied the spec-review skill's six distinct focused lenses sequentially. It read the project instructions, CONTRIBUTING.md, spec66/audit66; inspected the actual Life Stages content/core/UI/art, Living Garden route/notes/binding and host-panel seams, generic transfer and Paris ordering compiler; read the primary scientific/institutional sources below; and compared the full vendored taxonomy descriptions, evidence and incoming dependencies. Only this document is authored here. No Food Links runtime, rendered original art, browser result or implementation test was inspected or cleared. The audit's fresh Jane/Marble download comparisons were not independently repeated.

## Primary facts and the new relationship

The exact named pathway is supported. Shannag and Obeidat's methods describe *Aphis fabae* maintained on *Vicia faba*, with third-instar aphid nymphs used as prey for *Coccinella septempunctata* larvae. This supports a possible feeding relationship with the predator explicitly a **larva**. It does not establish a particular garden encounter, a general consumption rate, pest-control effectiveness in this activity or an educational effect. The methods and reported consumption were read directly, rather than inferred from an adult-ladybird summary. [Shannag & Obeidat 2006, full paper](https://www.jstage.jst.go.jp/article/aez/41/3/41_3_521/_pdf)

The first link correctly specifies sap as the food material. RHS identifies the black bean aphid group as sap-sucking on beans and other plants, while warning that other aphids can also be black. UC IPM supports the pear-shaped body, piercing/sucking mouthpart, antennae and paired rear cornicles. These provide schematic cues without making dark colour an identification rule. [RHS black bean aphid](https://www.rhs.org.uk/biodiversity/blackfly), [UC IPM aphids](https://ipm.ucanr.edu/home-and-landscape/aphids/)

RHS distinguishes elongated ladybird larvae with three pairs of legs from adult wing cases, and specifically describes seven-spot larvae as grey with four pairs of orange markings. Retaining the larval node and original stage-appropriate drawing requirements is therefore necessary. [RHS ladybirds](https://www.rhs.org.uk/biodiversity/ladybirds)

The stated food-to-eater arrow convention represents energy flow, rather than movement toward a place or one individual becoming another. The government source supports this narrow convention; the spec correctly declines its broader simplified claims about entire chains and fixed energy percentages. [NParks food-chain basics](https://biodiversitysg.nparks.gov.sg/our-ecosystems/food-webs/food-chains-and-food-webs-basics/)

This increment supplies a useful new distinction after Life Stages: the same arrow shape can express a different relationship when its legend changes. Choosing each link from either endpoint is enough for a bounded first slice. The complete pathway and factual passages remain supplied context; no independent construction of a chain or general understanding of energy is inferred. No copied source picture, paper table or chronology exercise is needed.

## Complete finite task and assessment probe

An independent table confirms all four questions and both endpoint roles:

| Case | Reference role | Correct selected card | Forward link to display |
| --- | --- | --- | --- |
| aphid-food | Aphid is eater | Bean plant | bean → aphid |
| bean-eater | Bean plant supplies food | Aphid | bean → aphid |
| larva-food | Ladybird larva is eater | Aphid | aphid → ladybird-larva |
| aphid-eater | Aphid is food | Ladybird larva | aphid → ladybird-larva |

Each supplied feeding link is looked up twice. Reading from the eater endpoint does not reverse the arrow. The same selected aphid card has different roles in bean-eater and larva-food: the first displays bean → aphid; the second displays aphid → larva. A renderer that treats the selected card as invariably food or invariably eater would be wrong.

A temporary independent oracle evaluated **100 combinations**: four tasks × five neighbour states (three cards, blank, unsure) × five meaning states (energy, development, travel, blank, unsure). The complete outcome counts are:

| Neighbour match / meaning match | Combinations |
| --- | --- |
| null / null | 40 |
| false / null | 40 |
| true / null | 8 |
| true / true | 4 |
| true / false | 8 |

The twelve definite proposed-pair renderings comprise four fitting pairs, four self-pairs, two reversed feeding links and two unsupported bean-to-larva shortcuts. Every blank/unsure neighbour must instead leave an empty proposed slot. Unsupported pairs are not asserted diets; feedback says they are not the requested relationship in this supplied example. It must not generalise from a wrong response to an animal's full real diet.

Concrete hostile repairs demonstrate why the two outcomes stay separate:

- For aphid-food, bean + development is true/false. Changing only the neighbour to ladybird-larva creates larva → aphid and false/null. The development choice stays recorded, without grading its interpretation of a different pair. Returning to bean assesses that retained meaning again.
- For larva-food, aphid + energy is true/true; aphid + unsure is true/null. A correct food card therefore does not manufacture a definite interpretation.
- For bean-eater, choosing ladybird-larva proposes bean → larva. It must not silently bridge through the aphid, congratulate an indirect energy path as the requested direct link, or state that the larva consumes plant sap.
- A blank/blank check is keepable null/null work. Moving from Link to Meaning supplies no answer, check, support request or new visit. Changing only display page or inspection picture does not stale the check; changing an answer, source or support does.

These are design-level table checks, not tests of a future implementation.

## Six focused lenses

**Completeness — clean; blocking=false.** The spec supplies every card passage, drawing cue, role, question, expected neighbour, meaning contrast, revision rule and feedback boundary. Optional frozen state, unavailable formats, exact retention disclosures and action/event scope are explicit. The initial acceptance phrase undercounted inputs as “3×4 ... including blank/unsure.” The root author replaced it with all 100 combinations; this reviewer verified the actual revised text. This was a minor copy/count correction, not a missing assessment rule. The final source-shape clarification was also independently read: `options` freezes the three-card permutation, `meanings` freezes all four finite IDs and supplied labels, and `meaningOptions` freezes the three substantive choices' permutation with unsure last. Historical wording/order therefore comes from that saved source, not today's catalog. This adds no new task semantics. No other required finding remains.

**Dependency/integration — clean; blocking=false.** `adaptivePage`, `adaptiveNotes` and `bindAdaptive` already compose Life Stages independently of habitat task state. The food route can use that same narrow sibling seam, keeping a waiting parcel and old suggestions intact. `lifeStageDiagram` already separates readable text from unknown/mismatched drawing availability; the Food Links fallback contract is feasible. Generic transfer retains optional roots without a new registry. The held app really appends incoming numerical connection offers on Living Garden routes, so the explicit host exception and old/new-route comparison are correct. No remote model or new host framework is assumed.

**Scope/overlap — clean; blocking=false.** Habitat suitability, anatomical keys and developmental continuity do not teach food direction. Paris' `ORDER_PERMUTATIONS`, `cleanOrder` and `orderValue` are specifically three-card chronology; using that answer checker would conflate ordering with feeding. Original local choice/presentation patterns can be adapted without changing that compiler, old meaning enums or any previous record. The feeding pathway remains a finite relation example, not a universal engine, food web, population model or new stock source.

**Project commitments — clean; blocking=false.** The most material risk is turning a supported selected link into evidence of independent scientific explanation or transfer from Life Stages. Separate nullable outcomes, supplied facts, request-only support, path familiarity and explicit limits defend that boundary. Wrong proposals remain labelled proposals. All questions and keep actions stay open, including uncertain work. No private prose, field photo, location, rearing activity, upload, identity or learner classification is needed. None of these statements substitutes for implementation verification.

**Mechanical validatability — clean; blocking=false.** Role-based pair orientation, the 100-case assessment table, refusal to infer meanings for wrong pairs, source/check independence, relevance, safe allocation, capacity and fallback dispatch admit deterministic checks. Stored science and historical outcomes are deliberately shape-admitted rather than revalidated as true; the spec says so explicitly. A fresh check uses its admitted frozen source. Unknown drawing descriptors must preserve understood answers/text while withholding an incompatible picture. No model judgement, prose grading or historical regrading is hidden in the gate.

**Adversarial review — clean; blocking=false.** The spec addresses self-pairs, reversed links, unsupported skips, correct neighbour with wrong/uncertain meaning, retained other choices, changed source text/expectations, contradictory recorded outcomes, future drawings, duplicate/raw siblings and unsafe numeric IDs. With fifteen readable rounds, a new Start removes four oldest readable rounds before appending one, after an exact disclosure; raw siblings remain and viewing does not trim. Queued events from old detached controls cannot mark another visit. The supplied tests can distinguish these failures without adding new infrastructure.

## Taxonomy, manageable turns and remaining gates

The full source target covers a simple feeding chain and a specific minibeast food example; the supplied choices are a narrow match, not all its independent-description evidence. Its two hard ancestors give a three-node union, matching the audit and actual vendored incoming edges. None appears in the runtime subset. The six-kind recognition and real magnifier/hunt evidence remain unobserved; ladybirds must not be contrasted with beetles as if they were disjoint groups. The broader Simple Food Chains evidence includes drawing and producer/consumer vocabulary, so excluding it is appropriate. No graph expansion or lock is warranted.

The four-page arrangement directly bounds the active turn: Inspect one card; Link reference/question plus three choices; Meaning proposed directed pair plus a separate interpretation; Kept trail with review/repair. It does not repeat the former long combined question-and-interpretation layout. Persistent food-to-eater wording on every active page supplies the changed legend, while the exact current question travels onto Meaning. Short wrapping tabs, two-column picture choices, full-size labels and native folds are feasible without dragging or hover. Choice-position checks must inspect actual correct positions: deterministic rotation alone can accidentally preserve a fixed answer location. Full source/history, narration controls and opened folds also need the specified target-size/overflow measurements.

**Required fixes remaining: none. Optional scope additions recommended: none.** Proceed to original art and implementation, then independent actual art/science inspection, separate implementation review and root browser verification. In particular, inspect the aphid's appendages/mouthpart contact and the ladybird's larval anatomy; prove both endpoint roles retain food → eater direction; exercise all response repairs, frozen/raw/future work, generic transfer/reload/explorer/save-off and the real synthetic host offer. This review establishes no rendered-art correctness, runtime behavior, physical Safari/iPad result, audible quality, human screen-reader result, field-identification competence or learning gain. No merge/deployment is cleared.
