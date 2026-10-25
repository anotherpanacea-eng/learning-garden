# Source audit: 143, Letters from the Coast

Date: 2026-10-25. Spec: [143](../specs/143-letters-from-the-coast.md). Companion: [143 text](../content/143-letters-from-the-coast-text.md).

## How sources were consulted

Direct page fetches (NOAA, Britannica, USGS, Wikipedia, RSPB, MBA, WHOI, SHOM and others) were refused by this session's network proxy. All checks used web-search result pages, which return each page's title, URL and quoted or summarized text. A first pass (tides, oceans, zones, Mediterranean) was followed on 2026-10-25 by a second fact-check pass of 22 searches covering every remaining `[check]`. A reviewer with ordinary web access should open each URL and confirm the wording before build.

## Sources and what each supports

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Tides and Water Levels: the lunar day | NOAA National Ocean Service | https://oceanservice.noaa.gov/education/tutorial_tides/tides05_lunarday.html | Lunar day about 24 h 50 min; two bulges, so two highs and two lows per lunar day; highs about 12 h 25 min apart; the Moon's motion explains the extra 50 minutes. |
| Predicting the Tides (activity) | NOAA Ocean Explorer | https://oceanexplorer.noaa.gov/edu/learning/10_tides/activities/predicting_tides.html | Low tide about 6 h 12.5 min after high tide, halfway between highs. |
| What is a spring tide? | NOAA National Ocean Service | https://oceanservice.noaa.gov/facts/springtide.html | Spring tides at new and full Moon when Sun's pull adds to Moon's; name from "springing forth", not the season; neap tides about seven days later, Sun and Moon at right angles; about twice a lunar month in all seasons. |
| How many oceans are there? | NOAA National Ocean Service | https://oceanservice.noaa.gov/facts/howmanyoceans.html | One global ocean in five named basins; most countries, including the US, recognize the Southern Ocean as the fifth; boundaries proposed to the IHO but not ratified by all. |
| How many oceans are there on Earth? National Geographic now says five | Boston Globe, 2021-06-11 | https://www.bostonglobe.com/2021/06/11/science/how-many-oceans-are-there-earth-national-geographic-now-says-five | National Geographic recognized the Southern Ocean in 2021. |
| How many oceans are there? | Live Science | https://livescience.com/planet-earth/rivers-oceans/how-many-oceans-are-there | Global ocean covers about 71% of Earth's surface (secondary source; a primary source such as USGS or NOAA should replace it at review). |
| Ocean zones | Woods Hole Oceanographic Institution | https://www.whoi.edu/ocean-learning-hub/ocean-topics/how-the-ocean-works/ocean-zones/ | Twilight zone about 200 to 1,000 m; midnight zone down to about 4,000 m. |
| Ocean facts (euphotic zone) | NOAA Ocean Explorer | https://oceanexplorer.noaa.gov/?p=1862 | Upper 200 m is the sunlight (euphotic) zone where phytoplankton can grow; no-light zone from about 1,000 m. |
| Is the Mediterranean tidal? | First Class Sailing (blog) | https://www.firstclasssailing.com/blog/?p=6838 | Mediterranean tides small, mean range around 30 cm; very small compared with the Atlantic. Secondary; replace with an oceanographic source at review. |
| Tides around the world | AVISO (CNES altimetry service) | https://www.aviso.altimetry.fr/en/applications/ocean/tides/tides-around-the-world.html | Mediterranean as a small-tide sea; larger local exceptions (northern Adriatic, Gulf of Gabès). |
| Teaching-research records | Marble (CC BY-SA), commit `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | `data/teaching-research.json` | Pedagogy only (paraphrased in the spec, not copied). Not used as a source for facts: its own source rows are marked unverified. |

### Second pass, 2026-10-25

| Claim (formerly `[check]`) | Result | Source(s) |
| --- | --- | --- |
| Ocean holds about 97% of Earth's water | Confirmed | NOAA, "Where is all of the Earth's water?" https://oceanservice.noaa.gov/facts/wherewater.html |
| Pacific largest; Arctic smallest | Confirmed; Arctic also shallowest (added) | NOAA Ocean Explorer https://oceanexplorer.noaa.gov/?p=1802; Live Science https://www.livescience.com/32621-what-is-the-biggest-ocean.html; Guinness https://www.guinnessworldrecords.com/world-records/92859-shallowest-ocean |
| Bay of Biscay range "several meters" | Changed to Britannica's figures: mean spring tides about 6 m near Ouessant, about 3.5 m near Biarritz | Britannica, Bay of Biscay https://www.britannica.com/place/Bay-of-Biscay |
| Pyrenees between Biscay and the Mediterranean | Confirmed; about 430 km long (added) | Britannica, Pyrenees https://www.britannica.com/place/Pyrenees |
| French-side rivers flow to the Atlantic | Narrowed to the Adour, which rises in the central Pyrenees and enters the Bay of Biscay below Bayonne (Garonne found only in a 1911 Britannica text, so not named) | Britannica, Adour River https://www.britannica.com/place/Adour-River |
| Waves made by wind; water moves round in place | Confirmed; "bobs" changed to "moves round in place" in the spec | NOAA https://oceanservice.noaa.gov/facts/wavesinocean.html; NOAA Ocean Explorer https://oceanexplorer.noaa.gov/facts/waves.html |
| Currents carry water, warmth and nutrients | Confirmed; drivers (winds, Earth's spin, temperature and saltiness) added | NOAA Science On a Sphere https://sos.noaa.gov/catalog/datasets/ocean-currents-salinity/ |
| Rock-pool conditions at low tide | Confirmed (temperature, salinity from sun and rain, oxygen; shallow upper-shore pools change most) | MarLIN habitat 246 https://marlin.ac.uk/habitats/detail/246; Seafriends https://seafriends.org.nz/enviro/habitat/rockpool.htm |
| Common limpet clamps; returns to home scar | Confirmed | MarLIN BIOTIC https://biotic.marlin.ac.uk/data/species/4220; Kent Wildlife Trust https://kentwildlifetrust.org.uk/wildlife-explorer/marine/sea-snails-and-sea-slugs/common-limpet; Scottish Wildlife Trust https://snorkel.scottishwildlifetrust.org.uk/species/limpet |
| Beadlet anemone retracts tentacles, jelly blob | Confirmed; "red blob" changed to "jelly blob" (beadlets vary in color); tentacles catch crabs, shrimp and small fish, so "catch tiny food" changed to "catch food" | The Wildlife Trusts https://wildlifetrusts.org/node/3319; MarLIN https://marlin.ac.uk/species/detail/1561 |
| Shore crab hides under rocks and weed | Confirmed | Scottish Wildlife Trust https://snorkel.scottishwildlifetrust.org.uk/species/shore-crab; Kent Wildlife Trust https://www.kentwildlifetrust.org.uk/wildlife-explorer/marine/crustaceans/shore-crab |
| Periwinkle closes its operculum | Confirmed | NPS https://www.nps.gov/articles/000/periwinkles-fast-facts.htm |
| Barnacles close their plates | Confirmed for acorn barnacles | WHOI https://www.whoi.edu/science/b/people/kamaral/Barnacles.html; Univ. of Melbourne tutorial https://ila-online-tutorials.science.unimelb.edu.au/ilt-life-edge-of-sea/rockPlatforms/barnaclesFeeding.html |
| Common starfish behavior | Changed to "lives in rock pools and on the lower shore", which the sources support; no source found for a specific low-tide behavior | The Wildlife Trusts https://www.wildlifetrusts.org/node/3358; Sussex Wildlife Trust (common starfish page) |
| Grey herons feed on coasts and estuaries | Confirmed from secondary sources only; no RSPB page returned | Forth Rivers Trust https://forthriverstrust.org/rivers-wildlife/learn/wildlife/birds/heron; Cornell All About Birds https://allaboutbirds.org/guide/Gray_Heron/lifehistory |
| Coast residents by shore | Confirmed for rock (limpet, crab: Wildlife Trust pages above), mud (waders probe for worms and shellfish), sand (sanderlings probe wet sand for buried animals) | RSPB "What do waders eat" https://community.rspb.org.uk/ourwork/b/natureshomemagazine/posts/what-do-waders-eat; Gulf Coast Bird Observatory https://www.gcbo.org/wp-content/uploads/2020/01/sanderling_dec_2019.pdf |
| Phytoplankton at the base, using sunlight | Confirmed from secondary and educational sources | NOAA Teacher at Sea https://noaateacheratsea.blog/2005/08/15/joan-raybourn-august-15-2005-2/; Oregon State SMILE fact sheet (phytoplankton) |
| Food-web links | Supported by educational sources; labeled "simplified" in spec and companion | MCS mackerel page https://www.mcsuk.org/ocean-learning/wildlife-a-z/atlantic-mackerel/ (eats zooplankton, eaten by sharks, dolphins, seals); mackerel diet study https://pmc.ncbi.nlm.nih.gov/articles/PMC6937200; seal diet https://a-z-animals.com/animals/seals/what-do-seals-eat/ (low-quality source) |
| Whales and dolphins: air, blowhole, warm-blooded, milk | Confirmed | NOAA https://oceanservice.noaa.gov/facts/dolphin.html; NOAA Florida Keys https://floridakeys.noaa.gov/animals/dolphins.html |
| Sharks: gills; live young | Confirmed; changed to "many sharks give birth to live young, and some lay eggs" | FSU Coastal and Marine Lab https://marinelab.fsu.edu/news-at-fsucml/how-do-shark-embryos-obtain-oxygen/ |
| Card list | Confirmed: harbor porpoise (mammal), grey seal (pups suckle fat-rich milk), humpback (blowholes, nursing), seahorse (ray-finned fish, gills) | Aarhus University https://ecos.au.dk/en/researchconsultancy/themes/marine-mammals; Wildlife Trusts grey seals https://www.wildlifetrusts.org/node/2321902; NPS humpback https://www.nps.gov/places/humpback-whale.htm |
| Litter reaches the sea and harms animals | Confirmed; most marine debris starts on land (about 80% in a NOAA Fisheries document) and travels through drains and rivers | CRS IF10967 https://www.congress.gov/crs_external_products/IF/PDF/IF10967/IF10967.9.pdf; BOEM/NMFS https://boem.gov/environment/nmfs-marine-debris-gom |

### Remaining

No `[check]` tags remain. Weakest support (secondary or educational sources only): heron coastal feeding, phytoplankton, the food-web links, the Mediterranean 30 cm figure and the 71% figure. These should be re-pinned to primary pages (USGS or NOAA for 71%, RSPB for herons, NOAA for phytoplankton) at review. The tide-time numbers were re-run by script after the corrections and are unchanged (no item depended on a changed fact; Harbor A's made-up 4.0 m range sits within Britannica's real 3.5 to 6 m Biscay range).

## Fiction

Willowbank, Willow Brook, Les Saules, Léon, Hollis, H., the postcards, the coast town, the beach clean, and the made-up Harbor A and Harbor B tide table are fiction and labeled "A story from Willowbank" or "made-up". The Tide clock is a labeled simplified model.

## Images and rights

No images are embedded. Rock-pool and animal photos should come from public-domain or open-license sources (for example NOAA Photo Library, which is generally US public domain, or Wikimedia Commons files with CC0 or CC BY licenses, recorded per file with author and license). The globe and maps should be original art or public-domain data (for example Natural Earth). Postcard fronts are original illustrations, not reproductions of real postcards.

## Review pass, 2026-10-25 (independent reviewer)

- **Searched:** Britannica, Bay of Biscay (https://www.britannica.com/place/Bay-of-Biscay): confirms mean spring range about 6 m near Ouessant falling to about 3.5 m near Biarritz. No change.
- **Math:** every Set A to C answer, the 1 : 2 : 1 thirds of the cosine model, and the spec's check list re-run with `python3 -I` (reviewer scratch `review-143/`); all correct.
- **Contract:** target ids and every hard prerequisite re-checked by script against the pinned `curriculum/marble/`; the crosswalk is complete and correctly named.
- **Fixed:** "tiny sea plants" changed to phytoplankton (they are not plants) on Card 7 and B6; Card 8's Southern Ocean line now says many maps showed it as an ocean only recently (the IHO named a Southern Ocean in 1937 and dropped it in 1953, so "countries named it only recently" overclaimed); zooplankton glossary softened ("many eat phytoplankton"); the pool sort now says the starfish is not sorted (it had no basket); Card 1 guided prompt shortened; C3's right answer moved to position A to spread positions; Cornell added to the grown-up sources (the heron line's actual source, as no RSPB heron page was found).
