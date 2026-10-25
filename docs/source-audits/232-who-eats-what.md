# Who Eats What: source audit

Audit for [spec 232](../specs/232-who-eats-what.md) and its [companion text](../content/232-who-eats-what-text.md). Date: 2026-10-25. All proposed copy, characters, scenes and the bench model (`chain-v1`, the Osprey Ledger) are original. No learner or family record, image, worksheet or lesson code is included. Nothing in the pack asks about a child's food, body, family or location.

## Verification method (read first)

- 13 web searches (standard mode) and 4 page fetches (Wikipedia's al-Jahiz and Food chain articles, the Saudi Aramco World article on the *Book of Animals*, and Stanford's "DDT and Birds" essay). Other claims were judged from search-result excerpts of the named pages; a reviewer should open the key pages before build. Where excerpts disagreed, the text takes the cautious reading or carries `[check]`.
- Biology and pedagogy rest on (a) the refreshed Marble teaching-research records (paraphrased only, CC BY-SA, no text copied) and (b) standard school biology. Both still need the subject check.
- Numbers were computed with `check221.py` (scratch area, `python3 -I`); 343 checks, 0 failures (see the spec's checks).
- **Independent review, 2026-10-25.** A second reader re-checked the three writer-open items on the web (Wikipedia's al-Jahiz and Bearded vulture pages fetched; the Vulture Conservation Foundation feeding guidelines and the Science abstract via search), re-ran every number with a fresh script (`rev221.py`, scratch area, `python3 -I`), and checked 6-word overlap with the Marble records. Fixes are recorded in the rows below and in the spec's checks.

## Local material read

| Material | Used for |
| --- | --- |
| Spec 120 and `docs/content/120-story/` (acts 1-5) | Cast and pronouns; Act I ch. 1, Act II ch. 2, Act III ch. 2 and 3, Act IV ch. 3, Act V path 1; Hollis rule (the old Keeper does not appear); spec 120's ribbons and new path left intact in Scene 4. |
| Specs 66 and 88 (built `#living/food`, `#living/fork`) and spec 153's text | The feeding-link meaning is retained: food → eater, with food supplying energy. The added Sun ⇢ producer link is separately labeled sunlight energy, not food. Reversed-arrow read-back pattern. |
| Spec 151 | Producer word, rot log (matter loop), energy-tenths rule; claims Food Webs (`mt_URTJbS3hhs`) in part; records herbivore/carnivore/omnivore as a gap this pack fills. |
| Spec 149 | Claims How Plant Parts Work (`mt_6xsEXxKdUX`) and Plants Grow from Air & Water (`mt_3-ii06P4YS`); lists What Living Things Need as met in part elsewhere. |
| Specs 175, 159, 148, 160, 142, 147 | 175 claims Naming Common Animals (`mt_zVLOm6U7bh`); 159 claims Skeletons & Muscles (`mt_g4YSiOCS8g`); 148/160 cite Cells, Tissues & Organs; 142 and 148 teeth; 147 sunlight-to-bread energy. |
| `docs/history-and-science-buildout.md`, spec 49 §5, specs 179, 174, 175 | Contract, labels, privacy rules (no diet, illness or child food), template structure. |
| Pinned `curriculum/marble/topics.json`, `dependencies.json`, `topic-coverage.csv` | Ids, names, hard edges. A grep of `docs/` finds none of the five target ids anywhere. Animal Nutrition (`mt_E1wR8IfCV6`) is unclaimed and "not yet mapped". |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_13CtLTcWUB`, `mt_qixeaiswFP`, `mt_8VA40Tumth`, `mt_PYPs2yD2sn`, `mt_YvCgDM0Scg`. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach, guided, practice; the "I'm stuck" ladder; three options; glossary. |

## Sources

| Source | URL | Supports |
| --- | --- | --- |
| National Park Service, red fox | https://www.nps.gov/cwdw/learn/nature/red-fox.htm | Red fox is an omnivore: fruit, berries, birds, small mammals; invertebrates a large share. |
| Mental Floss / Science Trends on fox diet (secondary) | https://www.mentalfloss.com/animals/what-do-foxes-eat | Seasonal insects (beetles) in summer. Supporting only. |
| Britannica Kids, beaver | https://kids.britannica.com/students/article/beaver/273139 | Beavers are plant-eaters; dams, lodges with underwater entrances. |
| Montana FWP, beavers | https://fwp.mt.gov/conservation/living-with-wildlife/beavers | Dams raise water so lodge entrances stay underwater; deep water for safety and food access. |
| Chemistry World, beaver teeth (2024 study) | https://chemistryworld.com/news/rodents-striking-orange-teeth-not-down-to-iron-rich-enamel-as-thought/4019428.article | Rodent incisors grow continuously. The old "iron makes them orange" claim is disputed, so the text says nothing about color or iron. |
| AskNature, wetland plants get air to roots | https://asknature.org/strategy/wetland-plants-get-air-to-waterlogged-roots/ | Common reed moves air through hollow stems and internal gas spaces (aerenchyma) to roots in waterlogged soil. |
| Audubon, "The silent flight of owls, explained" | https://www.audubon.org/magazine/silent-flight-of-owls-explained | Comb-like leading edge, soft fringe and velvety surface reduce flight noise. |
| Wildwood Trust, tawny owl | https://kent.wildwoodtrust.org/animals/tawny-owl | Tawny owls prefer small mammals (mice, voles) but take varied prey. Text says "mostly". |
| National Geographic Education, "Energy flow and the 10 percent rule" | https://education.nationalgeographic.org/resource/energy-flow-and-10-percent-rule/ | About a tenth passes to the next level on average; most is lost as heat. Labeled a made-up round number in child text. |
| Wikipedia, "Al-Jahiz" (fetched; re-fetched in review) | https://en.wikipedia.org/wiki/Al-Jahiz | Born c. 776 in Basra, died 868/869. Zirkle (1941) gives an English passage, made from a Spanish translation, in which mosquitoes seek blood, flies hunt mosquitoes as their favorite food, and predators eat the flies. The card's three links match it. The "first explicit description of a food chain" line is cited to *The Princeton Guide to Ecology* (2009), which supports "some historians call it an early food chain". |
| Wikipedia, "Food chain" (fetched) | https://en.wikipedia.org/wiki/Food_chain | al-Jahiz as first to discuss food chains (citing Agutter and Wheatley 2008; the page's "10th century" conflicts with his 9th-century dates, so text says "about 1,200 years ago"); Elton's *Animal Ecology* (1927) introduced the modern concept. |
| Saudi Aramco World, "The Book of Animals" (fetched) | https://archive.aramcoworld.com/issue/198203/science.the.islamic.legacy-the.book.of.animals.htm | Dates (c. 776-868) and scope. It does **not** mention food chains, so the child card hedges: "some historians call it an early food chain". |
| Wikipedia, *The Formation of Vegetable Mould Through the Action of Worms* | https://en.wikipedia.org/wiki/The_Formation_of_Vegetable_Mould_Through_the_Action_of_Worms | Darwin, 1881; decades of observation at Down House; worms form and move topsoil and bury objects. Full text: Project Gutenberg 2355. |
| Woodwell, Wurster and Isaacson 1967, *Science* 156: 821-824 (abstract via search excerpt; re-searched in review) | https://www.science.org/doi/10.1126/science.156.3776.821 | DDT rose with trophic level from 0.04 ppm in plankton to 75 ppm in a ring-billed gull; Long Island south-shore salt marsh; birds held 10 to 100 times more than fish. Full text and table are paywalled (403 from science.org and academia.edu). |
| Stanford Birds, "DDT and Birds" (fetched) | https://web.stanford.edu/group/stanfordbirds/text/uessays/uDDT.html | Eggshell thinning via DDE; eggs broke under parents; the Long Island birds at 3-25 ppm; US near-total ban 1972; ospreys back to pre-DDT breeding success within about a decade. |
| US EPA, "The Case of DDT: Revisiting the Impairment" | https://www.epa.gov/caddis-vol1/case-ddt-revisiting-impairment | Raptor recovery after the ban as evidence that DDT caused the declines. |
| Scientific American / EarthTalk | https://www.scientificamerican.com/article/rachel-carson-silent-spring-1972-ddt-ban-birds-thrive/ | Carson's *Silent Spring* (1962) and the 1972 ban. |
| Wikipedia, "Bearded vulture" (fetched in review) | https://en.wikipedia.org/wiki/Bearded_vulture | A scavenger feeding mostly on remains of dead animals; 70-90% of the diet is bone and marrow (85-90% in the diet section, citing Margalida et al. 2009, *Ibis*). Also takes some live prey, so the card says "main food", not "only food". |
| Vulture Conservation Foundation, feeding guidelines (2015, via search) | https://4vultures.org/wp-content/uploads/2021/06/VCFGuidlines_feeding_v01_10-2015.pdf | About 70% of the wild diet by biomass is bone (Hiraldo et al. 1979). Supports the plate "bones". |
| Ratcliffe 1967, *Nature* 215: 208-210 | https://www.nature.com/articles/215208a0.pdf | Broken eggs and lighter shells in peregrine, sparrowhawk and golden eagle nests in Britain since about 1947, from museum and private egg collections (JSTOR Daily: older shells in public collections, recent ones mostly private), using a shell-weight index (weight ÷ length × breadth); DDT/DDE link made by later work, notably Peakall's (JSTOR Daily). Review fix: the child card now says "falcon, hawk and eagle" and "kept in collections", since the sparrowhawk is a hawk and not every shell was in a museum. |
| JSTOR Daily, "The case of the thinning eggshells" | https://daily.jstor.org/the-case-of-the-thinning-eggshells | Ratcliffe's method and the later DDE link. |

## Open checks

1. **Osprey ppm.** Still open after review. The often-quoted "osprey 25 ppm" ladder (also in the Marble record) is not in the 1967 abstract, and review searches found no reliable page giving the paper's osprey row (textbook copies give 25 ppm for "fish-eating birds" or other figures; later osprey-egg studies are a different measure). Stanford gives 3-25 ppm across several fish-eating birds. Child text uses only the confirmed 0.04 ppm (plankton) and 75 ppm (one ring-billed gull), and never says the 1967 study measured an osprey. Open the paper's table (library access) before adding any osprey figure `[check]`.
2. **Beavers in the Pyrenees.** Not checked; Scene 4 is fiction and its science card makes no claim about where real beavers live `[check]` if a "real beavers here" line is ever wanted.
3. **Bearded vulture plate "bones".** Cleared in review: Wikipedia (70-90% bone, citing Margalida et al. 2009) and the VCF feeding guidelines (about 70% by biomass) both support a bone-based scavenger diet. Card wording ("bones are its main food") holds.
4. **Al-Jahiz paraphrase.** Checked in review against Zirkle's English passage: faithful (mosquitoes seek blood, flies hunt mosquitoes, predators eat flies). The passage reaches English through a Spanish translation, so an Arabic-reading historian could still confirm it before build; the card's hedge ("some historians call it") stays.
5. **Osprey recovery figures** (Long Island young per nest, Stony Brook symposium page) are kept out of child text.
6. **Subject check** on omnivore exemplars, the heron's plate, the hare's heart and the ledger's "breaks down" rule (only the plankton hold any) (spec review asks).

## Teaching-research notes (paraphrased)

- The herbivore record anchors omnivore on the child's own plate. Departed from on purpose (brief: no child food); the record's other moves are all used.
- The habitat record wants plants and people included and "harm" avoided; bench (b) does both.
- The structures record wants inside parts, non-defense functions and no "wanting"; Set 3 tests each.
- The energy record keeps chemistry out and asks for land and water chains; Set 4 does both.
- The toxin record wants the tenfold model labeled simplified beside real figures; the ledger's model line and the real-figures card do this.

## Privacy and safety review

- No prompt, item, invitation or panel line asks what the child eats, likes to eat or eats at home. The phrase "what you eat" appears only in the kindness line, which says the pack never asks it.
- No diet advice, no "healthy" or "unhealthy" foods, no illness. DDT's harm is told only for birds (thin eggshells, fewer chicks), at Keeper's Desk, and ends with recovery.
- People appear only as builders of houses (bench (b)); humans are never sorted into a diet basket. The Grown-up panel's one line on humans as a species leaves family food choices to families.
- Off-screen invitations are look-don't-touch (nests), library or museum pictures, and drawing; nothing is collected or recorded.
- Body content uses animals only (a hare's heart), never "your body".

## Cross-pack consistency

- Feeding-link meaning and reversed-arrow read-back match specs 66, 88, 151 and 153. The sunlight-energy link is separately typed, labeled and drawn so the Sun is not represented as food.
- After Codex review, sunlight claims are scoped to the pack's own chains ("every chain here", "in this activity"); spec 171 teaches vent chains built on chemical energy, and the Grown-up panel points to it.
- After Codex review, the Osprey Ledger reads concentration per whole level (poison ÷ living stuff), not one animal's total, and its energy overlay comes from the same share rule; this matches spec 151's per-level tenth rule and its point that the share is rough (the a-fifth setting).
- The energy tenths rule matches spec 151; the soil-is-not-energy line matches spec 149's van Helmont teaching; sunlight-to-bread energy stays spec 147's.
- Route `#living/who-eats` is unused on main (`grep -rn "#living/who-eats" docs` finds only this pack).
- The scenes add to spec 120 without contradicting it: Act III ch. 3 keeps the ribbons and the new straight path, and the beaver pond floods a meadow beside the ribboned path, not the path itself (review fix: act 3's desk case says the old ribboned path stays dry); Act III ch. 2 keeps Vadoalto's wet-ground reed; the Act IV desk card sits beside, and does not touch, the town's three flood plans.

## Rights notes

No images are embedded. If art is wanted: Darwin, Carson and Ratcliffe portraits and eggshell specimens exist in museum and archive collections; check each item's licence and prefer public-domain or open-access images. All Willowbank art, food plates and skull drawings are original.

## Bounded repair note (2026-10-25)

The structure/function reply now explains the quiet-flight job of soft fringed feather edges instead of denying that owls swim. Audubon’s filmed Great Horned Owl and interviewed ornithologists document swimming: https://www.audubon.org/news/can-owls-swim (opened in this repair review). The Sun-to-producer link is now a distinct sunlight-energy edge; the food-to-eater legend applies to feeding edges only. These are targeted copy/representation repairs, not a full subject or source clearance. The open source and language checks above remain open.
