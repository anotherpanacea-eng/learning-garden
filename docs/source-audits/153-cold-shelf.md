# Source audit: 153. The Cold Shelf

Date: 2026-10-25. Spec: [153-cold-shelf.md](../specs/153-cold-shelf.md). Companion: [153-cold-shelf-text.md](../content/153-cold-shelf-text.md).

**Method.** Direct page fetches were blocked in this session, so every claim below was checked against search-result excerpts from the listed pages (18 searches in the first pass, 13 in a second fact-check pass the same day). Excerpts are not the full page. A reviewer with ordinary web access should open each URL before build. Where only secondary or commercial sources came back, the row says so. Anything not confirmed stays `[check]` in the spec and companion and is listed under "Open checks". Ephemeris and arithmetic were computed locally (see the end).

## Sources and what they support

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| S1 | Bedmap3 press release | Newcastle University / British Antarctic Survey (2025) | https://www.ncl.ac.uk/press/articles/archive/2025/03/bedmap3/ | Antarctic ice (with shelves) about 13.63 million km²; mean thickness 1,948 m (2,148 m without shelves); thickest 4,757 m in Wilkes Land. |
| S2 | Bedmap3 data record | NERC / BAS Polar Data Centre | https://data-search.nerc.ac.uk/geonetwork/srv/api/records/GB_NERC_BAS_PDC_01620 | Same dataset (record only). |
| S3 | "Why aren't there penguins in the Arctic?" | BBC Wildlife (Discover Wildlife) | https://www.discoverwildlife.com/animal-facts/birds/why-are-there-no-penguins-in-the-arctic | Penguins only in the Southern Hemisphere except the Galápagos penguin; food-rich cold water as the likely reason. Secondary. |
| S4 | Arctic fox | Wikipedia (citing Polar Research and *Arctic*) | https://en.wikipedia.org/wiki/Arctic_fox | Small rounded ears, short muzzle and legs; only canid with furred pads; white morph white in winter, brown and gray in summer; about 99% white morph; counter-current exchange in legs. |
| S5 | Arctic fox review | *Polar Research* | https://polarresearch.net/index.php/polar/article/download/2726/6188 | Reduced surface from ears and muzzle. |
| S6 | Arctic fox paper | *Arctic* 44(2), 1991 | https://pubs.aina.ucalgary.ca/arctic/Arctic44-2-132.pdf | Short muzzle, ears and legs reduce heat loss. |
| S7 | Most efficient insulation in a bear | Guinness World Records | https://www.guinnessworldrecords.com/world-records/118885-most-efficient-insulation-in-a-bear | Fur and blubber together up to 10 cm; black skin; guard hairs transparent. |
| S8 | Polar Bears: Much More than a Polar Pin-Up | Beyond Penguins (Ohio State) | https://beyondpenguins.ehe.osu.edu/?p=4372 | Blubber up to 4.5 in (about 11 cm). Differs from S7, so the pack now says only "a thick fat layer" and teaches no number. |
| S9 | Debunking a myth about polar bear hair | University of Alaska Fairbanks, Geophysical Institute | https://www.gi.alaska.edu/alaska-science-forum/debunking-myth-polar-bear-hair | Fiber-optic hair idea not supported; why the pack does not teach "hollow fur". |
| S10 | Emperor penguin fact sheet | University of Western Australia (Australian Antarctic Division material) | https://www.uwa.edu.au/study/-/media/faculties/science/docs/emperor-penguin.pdf | Egg on males' feet under a brood pouch; winter below −40 °C; huddle center up to 24 °C. |
| S11 | Huddling dynamics | Gilbert et al., via czaw.org summary | https://czaw.org/?p=7226 | Birds shuffle; equal access to warmth. Secondary summary. |
| S12 | Krill (Frontiers for Young Minds) | Frontiers / NERC archive | https://nora.nerc.ac.uk/id/eprint/533264/1/frym-11-1046647.pdf | Krill filter phytoplankton; almost two hundred predator species, including most penguins and baleen whales. |
| S13 | Krill | National Geographic | https://www.nationalgeographic.com/animals/invertebrates/facts/krill | Antarctic krill among the largest krill species. |
| S14 | Arctic food webs | Ask A Biologist (Arizona State University) | https://askabiologist.asu.edu/arctic-food-webs | Ice algae → zooplankton → fish → seals → polar bears. |
| S15 | Ice algae, engine of life | Alfred Wegener Institute | https://www.awi.de/en/about-us/service/press/single-view/ice-algae-the-engine-of-life-in-the-central-arctic-ocean.html | Ice algae as the base of the central Arctic food web. |
| S16 | The copepod and its role | CORDIS (EU) | https://cordis.europa.eu/article/id/33579-the-copepod-and-its-role-in-the-arctic-food-chain | Copepods (*Calanus glacialis*) central in the Arctic chain. |
| S17 | Glacier and ice floe | Britannica | https://britannica.com/story/whats-the-difference-between-a-glacier-and-an-ice-floe | Glacier ice from compacted snow on land; ice sheets cover large landmasses (Antarctica, Greenland). |
| S18 | Ice poster 7 | Australian Antarctic Division | https://www.Antarctica.gov.au/site/assets/files/56857/iceposters_7.pdf | Sea ice is frozen seawater, forming and melting in the ocean. |
| S19 | Sea ice | Wikipedia | https://en.wikipedia.org/wiki/Sea_ice | Icebergs break from glaciers and ice shelves (fresh water). |
| S20 | EPICA Dome C 800,000-year record | *Nature Geoscience* | https://www.nature.com/articles/ngeo220.pdf | Continuous 800,000-year record from a core drilled to bedrock. |
| S21 | Aneto glacier surface loss | Zientzia.eus (summarizing IPE-CSIC study in *The Cryosphere*) | https://zientzia.eus/artikuluak/anetoko-glaziarrak-azaleraren-647-galdu-du-azken-4/en/ | 135.7 ha (1981) to 48.1 ha (2022); 64.7% reported loss. |
| S22 | Pyrenees glaciers are rapidly disappearing | Eos (AGU) | https://eos.org/research-spotlights/pyrenees-glaciers-are-rapidly-disappearing | Aneto the largest Pyrenean glacier; over 100 glaciers in 1850, 18 in 2022. |
| S23 | Inuit Circumpolar Council | The Canadian Encyclopedia | https://thecanadianencyclopedia.ca/en/article/inuit-circumpolar-council | About 180,000 Inuit in Alaska, Inuit Nunangat, Kalaallit Nunaat and Chukotka. |
| S24 | Inuit Circumpolar Council (member page) | Arctic Economic Council | https://arcticeconomiccouncil.com/members/inuit-circumpolar-council-icc/ | ICC founded 1977 in Barrow (Utqiaġvik), Alaska. |
| S25 | Indigenous population estimates | University of Alberta (2019) | https://ualberta.scholaris.ca/items/7e0f8b90-81a5-467f-a9fc-bd26daddb4d7 | About 145,900 Inuit excluding Chukotka; counts uncertain. |
| S26 | Inuit people | Britannica | https://www.britannica.com/topic/Inuit-people | Inuit self-government forms (Nunavut, Nunatsiavut, North Slope Borough). |
| S27 | Inuksuk | Wikipedia | https://en.wikipedia.org/wiki/Inuksuk | Stone landmarks built by Inuit; navigation, hunting and caches; can point to a channel or pass. A Canadian Encyclopedia or Inuit organization source should replace this before build. |
| S28 | Sámi people | Wikipedia | https://en.wikipedia.org/wiki/S%C3%A1mi_people | Sápmi across Norway, Sweden, Finland, Kola Peninsula; population estimates vary. |
| S29 | Sámi in the Nordic countries | Nordregio | https://www.nordregio.org/wp-content/uploads/2018/03/Sami_ENG.pdf | Population ranges; reindeer herding share. |
| S30 | Saami | Cultural Survival | https://www.culturalsurvival.org/publications/cultural-survival-quarterly/saami-shrinking-world | About 10% of Saami herd reindeer; up to 40% in some areas; difficulty of counting. |
| S31 | Sámi National Day | Store norske leksikon | https://snl.no/samenes_nasjonaldag | 6 February; first Sámi congress, Trondheim 1917; one of four national symbols with the flag, anthem and national joik. |
| S32 | Sámi National Day | High North News | https://www.highnorthnews.com/en/sami-national-day-6th-february | Norwegian and Swedish Sámi met across borders in 1917. |
| S33 | Sámi National Day | Skansen | https://www.skansen.se/en/see-and-do/sami-national-day/ | Joik as one of Europe's oldest music traditions (museum page). |
| S34 | Comparison of the Amundsen and Scott expeditions | Wikipedia | https://en.wikipedia.org/wiki/Comparison_of_the_Amundsen_and_Scott_expeditions | Team of five; left 19 October 1911 with four sledges and 52 dogs; pole 14 December 1911; back 25 January 1912; Scott 17 January 1912; all five of Scott's party died. |
| S35 | Amundsen reaches the South Pole | History.com | https://www.history.com/this-day-in-history/december-14/amundsen-reaches-south-pole | 14 December 1911; gives Scott's arrival as 18 January (date variant). |
| S36 | Roald Amundsen and what he learned from the Inuit | Arctic Kingdom (commercial) | https://resources.arctickingdom.com/roald-amundsen-what-he-learned-from-the-inuit | Amundsen lived with Netsilik Inuit and learned fur clothing and dogs. Secondary; needs a museum source. |
| S37 | Shackleton's lost ship discovered | Al Jazeera (2022) | https://www.aljazeera.com/news/2022/3/9/shackletons-lost-ship-discovered-off-antarctica-after-100-years | Wreck found March 2022. |
| S38 | Here lies Endurance | New Zealand Geographic | https://www.nzgeo.com/stories/here-lies-endurance/ | 3,008 m depth; about four miles from Worsley's recorded position; all 28 men survived; rescue from Elephant Island in August 1916; protected under the Treaty. |
| S39 | Antarctic Treaty | Finnish Meteorological Institute (antarctica.fi) | https://www.antarctica.fi/antarctic-treaty | Signed Washington 1 December 1959 by twelve countries; in force 1961. |
| S40 | Antarctic governance slides | European Polar Board | https://europeanpolarboard.org/fileadmin/user_upload/YvesSlidesAntarctic_governance_Webinar_EPB_APECS_light.pdf | 54 parties (2020), 29 consultative. |
| S41 | Antarctic Treaty explanatory notes | legislation.gov.uk | https://www.legislation.gov.uk/ukpga/2013/15/notes/division/2 | Madrid Protocol Article 7 bans mineral resource activities except scientific research. |
| S42 | Arctic sea ice settles at 2nd lowest minimum | NSIDC | https://nsidc.org/news-analyses/news-stories/arctic-sea-ice-settles-2nd-lowest-minimum-and-5th-lowest-september | September decline 12.5% per decade relative to 1981-2010. |
| S43 | Arctic sea ice minimum extent | NASA | https://climate.nasa.gov/vsoverlay-arctic-sea-ice | 12.2% per decade relative to 1981-2010; satellite record since 1979. |
| S44 | Sky-watching night (draft spec 141) | this project | https://github.com/anotherpanacea-eng/learning-garden/pull/138 | Axis tilt vocabulary; Willowbank's 15 h 18 min and 9 h 4 min day lengths. |
| S45 | The Creation of Nunavut | Privy Council Office (Library and Archives Canada archive) | https://epe.lac-bac.gc.ca/100/205/301/pco-bcp/website/06-07-27/www.pco-bcp.gc.ca/aia/default.asp@language=e&page=federation&sub=thecreationofnunavut.htm | Nunavut created 1 April 1999; about 85% Inuit. |
| S46 | Igloo | Wikipedia (also Britannica entry) | https://en.wikipedia.org/wiki/Igloo | *Iglu* means a house of any material; snow house *igluvijaq*; snow houses traditionally in Canada's central Arctic and the Qaanaaq area of Greenland; small ones for hunting trips. |
| S47 | Kayak; Qamutiik | Wikipedia; Dictionary of Canadian English Historical Usage | https://dchp.arts.ubc.ca/entries/qajaq | "Kayak" from Inuktitut *qajaq*; *qamutik* an accepted spelling of the Inuit sled. |
| S48 | Norwegianization truth commission report | Fenno-Ugria / Norwegian TRC (2023) | https://fennougria.ee/en/truth-and-reconciliation-commissions-report-published-in-norway/ | Sámi children sent to boarding schools where their languages were forbidden. |
| S49 | Inuit experiences at residential school | The Canadian Encyclopedia | https://thecanadianencyclopedia.ca/en/article/inuit-experiences-at-residential-school | Inuit residential schooling; language revitalization today (with Kitikmeot Heritage Society). |
| S50 | Amundsen 1903-1906 | Princeton University Library; Fram Museum | https://static-prod.lib.princeton.edu/visual_materials/maps/websites/northwest-passage/amundsen.htm | Gjoa Haven 1903-06; party adopted Inuit clothing and dog sledding; Netsilik taught survival skills (Fram Museum speech). Replaces S36 as the main source. |
| S51 | What led to Captain Scott's death | The Conversation | https://theconversation.com/what-led-to-arctic-explorer-captain-scotts-death-178810 | Several factors together: fuel shortage, unusually cold weather (Solomon), food, man-hauling; none alone decisive (Haddelsey). |
| S52 | Endurance (1912 ship) | Wikipedia; WABE/NPR | https://en.wikipedia.org/wiki/Endurance_(1912_ship) | Sank 21 November 1915 in the Weddell Sea; wreck found 5 March 2022 at 3,008 m. |
| S53 | Antarctic Treaty Parties | Secretariat of the Antarctic Treaty (via mirror); NTI | https://www.nti.org/education-center/treaties-and-regimes/antarctic-treaty/ | 57 to 58 parties, 29 consultative; pack says "more than 50 countries". |
| S54 | Leopard seal diets | Krause et al., PMC | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7271520/ | Diet of krill, fish and penguins; a Prydz Bay study found Adélie penguins the main prey. |
| S55 | Ordesa y Monte Perdido | European Environment Agency (EUNIS) | https://eunis.eea.europa.eu/sites/ES940002 | Glacial erosion formed U-shaped valleys (Ordesa and Pineta). |
| S56 | North Pacific albatrosses | USGS | https://pubs.usgs.gov/publication/sir20095131 | Laysan and black-footed albatrosses in the North Pacific. |
| S57 | Global volume of land ice | AntarcticGlaciers.org; NOAA Arctic Report Card | https://www.antarcticglaciers.org/glaciers-and-climate/what-is-the-global-volume-of-land-ice-and-how-is-it-changing/ | Antarctica 57.9 m sea-level equivalent; Greenland 7.4 m. |
| S58 | Antarctica is colder than the Arctic | NOAA climate.gov; WHOI Polar Discovery | https://www.climate.gov/news-features/features/antarctica-colder-arctic-it’s-still-losing-ice | Antarctica colder mainly from elevation (average about 2.3 km) and little ocean heat. |

## Claims that rest on computation, not a source

- **Midnight sun and polar night dates** (Tromsø 69.649°N 18.956°E; North and South Poles; Arctic Circle 66.56°N), PyEphem 4.2.1 for 2026, sampling every 5 minutes, Sun counted up when its center is above −0°50′ (upper limb plus standard refraction). Tromsø: 24-hour Sun 18 May to 24 July (68 days), no Sun 28 November to 14 January (48 days). North Pole: up 19 March to 24 September (190 days). South Pole: up 21 September to 21 March, down 23 March to 19 September. Willowbank's latitude gave 15.25 h and 9.08 h, consistent with spec 141's figures, which the pack reuses.
- **Iceberg fraction:** 917 ÷ 1,025 ≈ 0.89, using typical densities for glacier ice and sea water (standard values, not from a searched source).
- **Keep-warm bench:** made-up halving model, labeled so.
- **Arithmetic** (script `check.py` in the scratch area, run with `python3 -I`): 68, 48, 190 days; 8 h 42 min; 4.8 ÷ 1.9 ≈ 2.53 and 4,757 ÷ 1,948 ≈ 2.44; bench rows; 18; 10; 34 days; 42 days; 56 days from 19 October to 14 December (one source says 55; not taught); 600; 87.6 ha and 48.1 ÷ 135.7 ≈ 0.354 (so 64.6% lost against the study's reported 64.7%, likely rounding in the source figures); 1961 − 1959 = 2.

## Open checks

None left in the text. The second pass (2026-10-25) settled every earlier `[check]`:

- **Confirmed and kept:** Antarctica the colder pole (S58); leopard seals eating penguins (S54); sea-level equivalents (S57, background only); Ordesa (S55); Nunavut 1999 (S45); iglu wording, revised to "iglu means any house; snow houses mainly for hunting trips" (S46); qajaq and qamutik (S47); the boarding-school sentence, revised (S48, S49); Amundsen at Gjoa Haven 1903-06 (S50); Scott's reasons, revised to "very cold weather, too little fuel and food, hauling by hand" (S51); *Endurance* sank November 1915 (S52); albatrosses in the North Pacific (S56).
- **Rephrased:** the Treaty count is now "more than 50 countries" (S53); no party number is taught.
- **Cut:** the polar bear fat thickness (sources disagree); the number of Sámi languages and the Sámi parliaments' dates; the note about the older word for Inuit.
- **Still worth a direct look:** the Treaty Secretariat's own party list, a Canadian Encyclopedia or Inuit-organization source for inuksuit (S27 is Wikipedia), and cultural review of book 6.

**Trim (same day):** items cut to 24 (A9 say-why, B1 match, bench halving item, Shackleton crew item and the made-up ice-core item removed); right answers now 5/5/6 across 16 three-choice items. The numbers and lint scripts were re-run after the trim.

## Rights notes for images

No images are embedded. For build, prefer: NASA and NOAA imagery (US government, generally public domain; check each credit); NSIDC charts (check terms); British Antarctic Survey images (licensed; ask); public-domain photographs from the 1910-12 expeditions (Norwegian National Library, Scott Polar Research Institute; the photographs' age suggests public domain, but confirm each); Endurance22 wreck images (Falklands Maritime Heritage Trust, licensed, not for reuse without permission). For Inuit and Sámi, use photographs chosen with or supplied by community organizations (Inuit Tapiriit Kanatami, ICC, Sámi Parliaments), credited, never staged or costume images. Illustrations of animals should be original art.

## Fiction labels

Willowbank, its library, the librarian, Pip, Bramble, {guide} and Bramble's picture-book cover are fiction ("A story from Willowbank"). No real person, expedition member or community member is voiced. The bench and book 9's chart are labeled "A made-up model".

## Review pass (independent reviewer, 2026-10-25)

Five searches (standard mode), plus local scripts. What was checked and changed:

| Claim | Finding | Source | Change |
| --- | --- | --- | --- |
| Huddle "middle about 24 °C" (spec) | Gilbert et al. (2006) logged air inside tight huddles rising from 20 °C to peaks of 37.5 °C | https://arxiv.org/abs/q-bio/0701051 | Spec now says "can rise above 20 °C"; no number taught to children. |
| Sámi National Day | Marks the opening of the first Sámi national assembly, Trondheim, 6-9 February 1917, Sámi from Norway and Sweden (chaired by Elsa Laula Renberg) | https://en.wikipedia.org/wiki/S%C3%A1mi_Assembly_of_1917 | "First Sámi meeting" (overclaim) changed to the national assembly / first met together. |
| September sea-ice trend | NSIDC 2024: 12.4% per decade vs 1981-2010; 2025 minimum 4.60 million km², tenth lowest | https://cires.colorado.edu/news/arctic-sea-ice-has-reached-minimum-extent-2025 | Spec gives 12.4% to 12.5%; child text "about 12 in 100" kept; warming named as the cause, calmly. |
| Snow houses today | Canadian Encyclopedia: Inuit live in permanent houses; some hunters still use snow houses as shelters | https://thecanadianencyclopedia.ca/en/article/igloo | Book 6 and C3 moved to present tense ("are mostly shelters for hunting trips"). |
| Treaty Article I | Bans military bases, manoeuvres and weapons testing; military personnel and equipment allowed for science | https://en.wikisource.org/wiki/Antarctic_Treaty | "Bans armies" changed to "bans military bases and weapons tests"; claims wording changed from "no ownership recognized" to "neither recognizes nor rejects" (Article IV). |

**Other fixes without searches:** "the poles are as far from the middle of Earth as you can go" was wrong (the poles are slightly nearer Earth's center); now "as far from the equator". "They are the coldest places on Earth" softened to "some of the coldest" (Siberian and Antarctic-plateau records are not at the poles). Sea ice "is salty" changed to "forms from salty water" (brine drains out as it ages). Shackleton card now says he crossed with five others and says "survived". Scott's Keeper's note rewritten gently. Leftover references to the cut "made-up ice core" removed. Sapling dial step no longer assumes spec 141's Library Roof is built. Book 6 gains the peoples' own terms in the glossary (Inuit "the people", Inuk, Kalaallit Nunaat, Sápmi) and Uqsuqtuuq for Gjoa Haven in the spec. Joik card now says what a joik does instead of repeating the "oldest" claim.

**Scripts (scratch `review-153/`):** `sun.py` (PyEphem 4.2.1, 5-minute sampling, horizon −0°50′, no extra refraction) reproduced Tromsø 18 May to 24 July (68 days) and 28 November to 14 January (48), North Pole 19 March to 24 September (190), South Pole up to 21 March and from 21 September, down 23 March to 19 September. Willowbank's June day came out 15 h 15 min to 15 h 22 min depending on longitude and refraction convention; spec 141's 15 h 18 min is kept for cross-pack consistency. `nums.py` confirmed every item answer and easier worked example; `lint.py` confirmed prompts ≤15 words, feedback ≤20, cards ≤30, Short 28 and Longer 149 words, Keeper's notes ≤80, right answers 5/5/6 and never longest, no em-dashes. The crosswalk was re-read from the pinned `dependencies.json`: all eight targets' hard prerequisites and names match.

**Cross-pack:** tilt vocabulary (axis, leans toward the Sun, Show the lean, Play a day) matches spec 141; melting and freezing stay with spec 145 (`#science/bakery`); the food legend matches the built `#living/food` text exactly; `#library/*` routing matches spec 152's `#library/canopy`. No conflicting facts found.

**Still open:** Book 6 still needs Inuit and Sámi review; inuksuit still rest on Wikipedia (S27).
