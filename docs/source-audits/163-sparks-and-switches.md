# Source audit: 163, Sparks and Switches

Date: 2026-10-25. Writer's audit for [spec 163](../specs/163-sparks-and-switches.md) and its [companion text](../content/163-sparks-and-switches-text.md). Page fetches were blocked in this session, so every claim below was checked against search-result excerpts and summaries (17 searches, then 4 more in the second pass below). The circuit physics (conductors, switches, symbols, series and parallel on/off, electromagnet factors) is standard school physics and still needs the subject check.

## Fiction and model boundary

Willowbank, its lanterns, the bridge string, the Switch Table and every character are fiction, labeled "A story from Willowbank". The five benches (`gap-tester-v1`, `loop-four-slots-v1`, `lantern-string-v1`, `charge-tally-v1`, `coil-nail-v1`) are made-up models with their rules on screen; none reports a measurement. The electromagnet clip counts and the "2 electrons per rub" tally are invented model numbers, labeled as such. No quotation, diary or eyewitness voice is invented; the Volta and Ørsted cards describe what each did without quoting them.

## Sources consulted

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Voltaic pile | Wikipedia (secondary) | https://en.wikipedia.org/wiki/Voltaic_pile | Letter of 20 March 1800 to Joseph Banks, Royal Society; copper (or silver) and zinc discs with brine-soaked cloth or card; wire from top to bottom gave a steady current; first battery giving continuous current. |
| Volta, "On the Electricity Excited by the Mere Contact of Conducting Substances" (1800), scan | PMC / NCBI | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5670545/ | The primary letter as printed in 1800 (second pass should read it directly). |
| Alessandro Volta (print article) | Encyclopaedia Britannica | https://www.britannica.com/print/article/632433 | Born in Como; chair of physics at Pavia; invention of the electric battery as the first source of continuous current. |
| Alessandro Volta | Wikipedia | https://en.wikipedia.org/wiki/Alessandro_Volta | The volt is named in his honor. |
| July 1820: Oersted and Electromagnetism | American Physical Society, APS News (2008) | https://aps.org/apsnews/2008/07/1820-oersted-electromagnetism | Compass needle deflected by current in a nearby wire, 1820; published July 1820; accounts differ on how deliberate the demonstration was. |
| Hans Christian Oersted, Scientist of the Day | Linda Hall Library | https://www.lindahall.org/about/news/scientist-of-the-day/hans-christian-oersted/ | The traditional "accidental discovery in a lecture" account, reported as tradition. |
| Hans Christian Ørsted | Wikipedia | https://en.wikipedia.org/wiki/Hans_Christian_%C3%98rsted | Calls the accidental-lecture story a myth; he had been looking for a link since 1818. Used only to justify "stories differ". |
| Timeline 1820-1829 | National MagLab | https://nationalmaglab.org/magnet-academy/history-of-electricity-magnetism/timeline/1820-1829/ | Ørsted's result quickly led to the first electromagnet and motor. |
| William Sturgeon, Scientist of the Day | Linda Hall Library | https://www.lindahall.org/about/news/scientist-of-the-day/william-sturgeon/ | Electromagnet announced 1825 (others say 1824). Background only; not used in the spec or child text. |
| battery (electrical) | Word Origins | https://wordorigins.org/big-list-entries/battery-electrical | Franklin's "electrical battery" for linked Leyden jars in a letter to Peter Collinson, 1748 or 1749 (sources differ). |
| Lightning science | NOAA National Weather Service | https://www.weather.gov/safety/lightning-science | Air normally insulates; lightning is a discharge once charge differences grow large enough. |
| Lightning basics (citing NSSL) | Carleton College SERC | https://cdn.serc.carleton.edu/files/tides/teaching-materials/earthscience/lightning_basics.pdf | Lightning heats its channel to about 50,000 °F; explosive expansion makes thunder. |
| Lightning safety overview | NOAA National Weather Service | https://www.weather.gov/safety/lightning-safety-overview | "When thunder roars, go indoors"; hearing thunder means within striking distance; wait 30 minutes after the last thunder. |
| Static electricity and electrical charge | Science Learning Hub (NZ) | https://www.sciencelearn.org.nz/resources/2746-static-electricity-and-electrical-charge | Rubbing moves electrons; balloon on hair: balloon negative, hair positive. |
| Static electricity: charging (GCSE notes) | Cognito | https://cognito.org/courses/gcse/physics-triple/ocra/higher/notes/YnZFR09PQUo/3.1-static-electricity-charging | Only electrons move in solids; the induction explanation of a balloon sticking to a neutral wall. |
| How Christmas lights work | HowStuffWorks | https://people.howstuffworks.com/culture-traditions/holidays-christmas/christmas-lights1.htm | Series mini-light strings; shunts let current bypass a burned-out filament; a missing bulb still breaks the string. Grown-up panel and Keeper's note only. |
| Electromagnets | Cyberphysics | https://cyberphysics.co.uk/My_Notes/Electromagnets1.htm | More turns and more current give a stronger field; scrap-yard lifting magnets. |
| Strength of an electromagnet | Oak National Academy | https://thenational.academy/teachers/programmes/physics-secondary-ks4-higher-aqa/units/electromagnetism/lessons/strength-of-an-electromagnet | Soft iron core strengthens and lets go when switched off; steel stays partly magnetized. |
| Circuit symbols | Vaia (StudySmarter) | https://vaia.com/en-us/explanations/physics/electricity/circuit-symbols | Cell: longer line is positive; battery is repeated cells; lamp is a cross in a circle; an open switch breaks the circuit. |
| Graphite circuits | Science Museum Group Learning | https://learning.sciencemuseumgroup.org.uk/resources/graphite-circuits | Graphite conducts, but only fairly well (less than metals). |
| Graphite | University of Bristol, School of Chemistry | https://www.chm.bris.ac.uk/~paulmay/webprojects2001/may/graphite.htm | Why graphite conducts; pencil "lead" is graphite mixed with clay. |
| Conductivity (electrical conductance) and water | USGS Water Science School | https://www.usgs.gov/water-science-school/science/conductivity-electrical-conductance-and-water | Dissolved ions let water conduct; stream water carries dissolved salts. |
| Button Cell Coin Battery Information Center | US Consumer Product Safety Commission | https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Button-Cell-Coin-Battery-Information-Center | Swallowed button cells cause serious internal burns; keep away from children; seek care at once. |

Marble records read for the upstream check (paraphrased, never copied; CC BY-SA): `mt_d-EKO-pKkP`, `mt_Hah24nbToi`, `mt_loYPGHJ8lm`, `mt_NzCNuABT3E`, `mt_loEMaQ8kFA`, `mt_2_YoprauaJ`, `mt_2qkn8Lhc8e` in `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac`. Their misconception lists and the electromagnet overheating caution shaped the items and the screen-only coil.

## Claims and how they were settled

- **Volta's pile, 1800:** date of the letter (20 March 1800), recipient (Joseph Banks, Royal Society president), materials and steady current agree across Wikipedia, Britannica's excerpt and the PMC reprint listing. Child card uses "In 1800" only.
- **Ørsted, 1820:** the needle's deflection and the July 1820 publication agree across APS, Linda Hall and MagLab. The lecture story is disputed; the card says so. The exact day (often given as 21 April 1820) is not used.
- **Lightning and thunder:** NWS supports the insulating-air explanation; the 50,000 °F figure comes through an NSSL-citing teaching PDF; other sources give about 30,000 K. Settled in the second pass: the NWS figure (about 50,000 °F, about 28,000 °C) is used.
- **Thunder count:** reuses spec 146's checked rule (about 3 seconds per kilometer; 1 km ≈ 2.9 s at 343 m/s).
- **Static:** electron transfer, balloon negative and hair positive, and induction at a neutral wall agree across the two teaching sources and the Marble record.

## Second fact-check pass (2026-10-25)

Four further searches settled the open items:

1. **Volta's materials:** Linda Hall Library and Christie's catalogue entries for *Philosophical Transactions* 90 (1800), pp. 403-431, confirm silver or copper with zinc, separated by cardboard, leather or cloth soaked in salt water, in a letter of 20 March 1800 to Banks. Settled; the card's "salty wet cloth" stands.
2. **The volt:** Britannica's entry for the volt states it is named in honor of Volta. Settled.
3. **Lightning temperature:** the NWS thunder page gives air in the channel up to about 50,000 °F, five times hotter than the Sun's surface. The child note now uses that figure (with about 28,000 °C, script-checked) and the 30,000 K figure is dropped.
4. **Painted lid:** only informal electrician-forum sources were found for paint blocking a tester. **Cut:** the lid is replaced by a cork (an insulator) on the bench, in the spec and in the companion.
5. **Graphite:** Science Museum Group Learning (above) says graphite is a fairly good conductor, less good than metal. Settled.
6. **Sturgeon:** no longer in the spec or child text; the source stays listed as background only.

No `[check]` items remain. The circuit physics still needs the independent subject check.

New sources from this pass:

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Thunder | NOAA National Weather Service | https://www.weather.gov/safety/lightning-science-thunder | Channel air up to about 50,000 °F, five times the Sun's surface; rapid expansion makes thunder. |
| Volt | Encyclopaedia Britannica | https://www.britannica.com/print/article/632417 | The volt is named in honor of Alessandro Volta. |
| Alessandro Volta, Scientist of the Day | Linda Hall Library | https://www.lindahall.org/about/news/scientist-of-the-day/alessandro-volta | 20 March 1800 description to Banks; publication with diagram in *Philosophical Transactions*. |
| Lot 933944 (Volta, 1800 offprint) | Christie's | https://www.christies.com.cn/lot/lot-933944 | Title and pages of the 1800 paper. |

## Image rights

No images are embedded. Builders should draw original art for the benches and diagrams. If the Volta or Ørsted cards use a portrait or a picture of a voltaic pile, prefer public-domain scans (both men died in the 19th century, so period engravings are generally public domain) or museum open-access images with their license recorded in this audit. Circuit symbols are conventions and need no license.

## Review pass (independent reviewer, 2026-10-25)

Three searches, all against search excerpts (fetches blocked):

| Checked | Source | Result |
| --- | --- | --- |
| Ørsted: lecture, accident or plan | APS News (above); R. de Andrade Martins, "Ørsted and the discovery of electromagnetism", University of São Paulo, https://www.ghtc.usp.br/server/pdf/RAM-Oersted1.PDF; COMSOL, "5 W's for 200 Years of Electromagnetism", https://www.comsol.com/blogs/5-ws-for-200-years-of-electromagnetism | The observation was made during a lecture; Ørsted's own later account says the test was planned; historians differ on chance. H2 and the spec now say "during a lecture" and frame the dispute as accident or plan. Item 4.7(3) reworded to match. |
| Fallen outdoor wires | Utility safety pages, e.g. LG&E and KU, https://lge-ku.com/safety/power-lines/downed; PSE, https://pse.com/en/pages/downed-power-lines | Treat every fallen wire as live, keep well back, report it. Added to the fixed safety rule because the whole pack is set after a storm with snapped wires. |
| Balloons | US CPSC balloon guidance, https://www.cpsc.gov/s3fs-public/5087.pdf | Uninflated balloons and burst pieces are a suffocation hazard for young children; collect pieces at once. Added to the Grown-up panel; the off-screen card now has a grown-up inflate the balloon and rubs it on wool, not hair. |

Other fixes: the fixed safety rule now names AA or AAA cells (consistent with "one cell is not a battery") and states that no number decides it; item 4.8 (230 ÷ 1.5, socket against cell) was cut at the coordinator's direction, so no child text does arithmetic on mains voltage, and the Grown-up panel no longer quotes mains figures; the 4.4 hint no longer gives the answer; T12's example uses Pip, not the child; the series model line now says real series bulbs share the push and a long string may not glow; spec notes that the model buzzer ignores polarity; item 1.3 choices rebalanced in length; graphite feedback reworded; 2.1 switch symbols distinguished from a wire; "Lantern Bench" aligned to spec 98's "Lantern Circuit Bench". All numbers re-run in an independent script (desk 2,401 = 304 / 1,776 / 256 / 65; strings 0, 4, 0, 3; tally 6 / 0, cap 10; coil 2, 4, 6 / 4, 8, 12 and 12 for item 4.5; 9 ÷ 3 = 3; 20 years; 50,000 °F ≈ 27,760 °C): all correct. Hard-prerequisite crosswalk verified against the pinned `dependencies.json` and `topics.json`: correct. Cross-pack: thunder count (9 s, divide by 3, Act VI long rain) matches spec 146; magnet facts and the miller's magnet match spec 154; nothing from spec 98 is re-taught, and spec 89 (fractions) does not overlap.
