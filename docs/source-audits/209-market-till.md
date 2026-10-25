# Source audit 209: Market Till

Date: 2026-10-25. Spec: [209](../specs/209-market-till.md). Companion: [209 text](../content/209-market-till-text.md).

**Method.** Five web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The money arithmetic (100¢ = $1; adding with a 100¢ trade; change as paid − price by counting up or subtracting; rounding to the nearest dollar with 50¢ rounding up; ceiling rounding as an upper bound; price for one by equal sharing) is standard school mathematics. Teaching approach follows the five Marble teaching-research records at `7bd8b67` (paraphrased, CC BY-SA), mapped from pounds and pence to US dollars and cents by concept: the £/p symbols become $/¢, "£1.50p" becomes "$1.50¢", and the change-from-a-£5/£10-note task becomes change from a $5/$10/$20 bill. All prices, packs, baskets and tenders are **made-up labeled data**, verified by `check209.py` (89 checks, all passing; scratch area, not in the repo). The child-text style was checked by `style209.py` (0 em-dashes, all word limits met).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Coinage Act of 1792" | Wikipedia | https://en.wikipedia.org/wiki/Coinage_Act_of_1792 | Passed April 2, 1792; set up the United States Mint in Philadelphia; decimal system; dollar as base unit; cent 1/100, disme 1/10, mill 1/1000. |
| 2 | "Dime (United States coin)" | Wikipedia | https://www.wikipedia.org/wiki/US_dime | The Act spells "disme"; tenth of a dollar; few 1792 dismes, circulating dimes from 1796. |
| 3 | Half disme introduction | University of Notre Dame, Colonial coins collection | https://coins.nd.edu/colcoin/ColCoinIntros/HalfDisme.intro.html | Quotes the Act's wording on the tenth, hundredth and thousandth parts (corroborates 1-2). |
| 4 | "CoinWeek IQ: Coinage Act of 1792" | CoinWeek | https://coinweek.com/coinweek-iq-coinage-act-of-1792/ | Mint at the seat of government (Philadelphia); gold eagle $10, half eagle $5 (corroborates 1). |
| 5 | "Tales From the Vault: The 1792 Half Disme" | American Numismatic Association | https://www.money.org/tales-from-the-vault-the-1792-half-disme/ | 1792 half dismes struck under the new law (context). |
| 6 | "Jiaozi (currency)" | Wikipedia | https://en.wikipedia.org/wiki/Jiaozi_(currency) | Sichuan merchants' deposit notes; government Jiaozi office 1023; first official series 1024; heavy iron coins in Sichuan as the reason. |
| 7 | "First paper money" | Guinness World Records | https://www.guinnessworldrecords.com/world-records/first-paper-money/ | Jiaozi described as the first paper money (Song, Sichuan). |
| 8 | "History: a groundbreaking financial innovation in ancient China" | Deep China (newsletter) | https://deepchina.substack.com/p/history-a-groundbreaking-financial | Yizhou Jiaozi Office, Chengdu, 1024; iron coins heavy (corroborates 6). |
| 9 | "The world's earliest paper money Guan Jiaozi" | 5000yan | https://en.5000yan.com/history-of-china/song-liao-and-jin/worlds-earliest-paper-money-guan-jiaozi.html | Government jiaozi; iron-coin weight (an 11 kg per 1,000 coins figure) `[check]`. |
| 10 | "The Lydians and their World: Coins of Sardis" | Sardis Expedition (Harvard) | https://sardisexpedition.org/en/essays/latw-kroll-coins-of-sardis | Earliest coins electrum; Ephesus Artemision deposit of 93 electrum coins excavated by the British Museum 1904-05, late 7th century BCE. |
| 11 | "The Earliest Coins from Lydia" | World History Encyclopedia (British Museum image) | https://www.worldhistory.org/image/5877/the-earliest-coins-from-lydia/ | Lydian electrum coin dated about 650 BCE in the British Museum credit. |
| 12 | Lydian Electrum (collection item) | Hallie Ford Museum of Art, Willamette University | https://library.willamette.edu/hfma/omeka/items/show/14 | Electrum as a natural gold-silver alloy; Lydian origin (corroborates 10-11). |
| 13 | Auction catalogue notes on Lydian lion-head electrum | Numisbids; Noble Numismatics | https://www.numisbids.com/sale/1228/lot/99 | Lion's head as the usual type; dating revised to mid-7th century BCE; attribution to a named king disputed. |
| 14 | Marble teaching-research records for the five targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy and constraints summarized in the spec's upstream check (counting up first; one quantity with the 100¢ trade; estimate before exact; malformed forms only as rejected non-examples; name interim quantities; never score role-play). |
| 15 | Jane `LESSONS.md` | Jane repo at `0ec55f7` | local clone | Teach → guided → practice; "I'm stuck" ladder; three-option items; step-revealed examples. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Coinage Act passed April 2, 1792; dollar as base unit; decimal parts (cent a hundredth, disme a tenth) | 1, 2, 3 | Checked |
| The Act set up the Mint in Philadelphia | 1, 4 | Checked (Keeper's note only) |
| The mill (a thousandth) named in the Act | 1, 3 | Checked; spec only, not in child text |
| Whether copper coins (cent, half cent) were in the April Act or the May 8, 1792 copper act | 1, 4 (search summary notes disagreement) | Unsettled; child text says only that the law split a dollar into 100 cents, which rests on the Act's definition of the cent as a unit |
| Jiaozi began as Sichuan merchants' notes for deposited coins; heavy iron coins as the reason | 6, 8 | Checked |
| Song government took over in the 1020s (office 1023; first official notes 1024) | 6, 7, 8 | Checked; child text says "the 1020s" |
| Jiaozi called the first government-issued paper money | 6, 7 | Checked, with a note that some historians prefer "currency made of paper"; child text says "many historians call them" |
| Iron coins about 11 kg per 1,000 | 9 | `[check]`; not in child text |
| Merchant origin date (about 1008, sixteen Chengdu merchants) | 6 search summary | `[check]`; not in child text |
| Lydian electrum coins among the first coins, mid-to-late 7th century BCE ("more than 2,600 years ago") | 10, 11, 12, 13 | Checked |
| Many show a lion's head | 11, 13 | Checked |
| Electrum is a natural gold-silver alloy | 10, 12 | Checked |
| Coins let people count instead of weighing metal | 10, 12 (general numismatic framing) | Checked as a general claim; phrased plainly in H3's note |
| Money pedagogy (counting up, 100¢ trade, estimate first, interim quantities) | 14 | Research-informed; Marble notes these records are agent rewrites, not validated interventions; subject check requested |

## Concept mapping notes (UK to US)

- "£1.50p" (both symbols) → "$1.50¢". Shown only as a **Fix this tag** non-example.
- "150p = £1 and 50p = £1.50" → "150¢ = 1 dollar and 50 cents = $1.50".
- "Change from a £5 or £10 note" → change from a $5, $10 or $20 bill.
- The UK Year 2 and Year 3 rule to record pounds and pence separately before decimal notation is not imported; US money is usually written $d.cc from early grades. The research's own constraint accepts the decimal form when its meaning is taught; the till always pairs it with words and cents.
- Marble's *Estimating and comparing money* evidence includes length and mass. Those comparisons are left to spec 45; E5 uses grams only as a price-per-100 g unit.
- *Working with money* evidence includes line plots of measurements; not used here (data packs own line plots).

## Open checks

1. Iron-coin weight figure and the merchant-origin date for jiaozi: not in child text.
2. Copper coinage in the April versus May 1792 acts: not in child text.
3. Subject check on the US read-aloud rule ("three dollars and five cents") and on ceiling rounding at Keeper's Desk (spec review asks 1-2).

## Rights notes for images

No images are embedded. Coins reuse spec 57's original schematic drawings. Bills are new original drawings with numerals and words only: no portraits, seals, serial numbers, Treasury or Mint artwork, and not at the size or color of real US currency. If a real image is wanted for H1-H3: a 1792 half disme, a jiaozi printing plate (or later Song note) and a Lydian electrum coin are held in museum open-access collections (for example the Smithsonian National Numismatic Collection and the British Museum), to be confirmed per object and license. No photograph of a real child or real family appears.
