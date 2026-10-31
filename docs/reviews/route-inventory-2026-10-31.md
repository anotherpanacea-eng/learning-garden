# Early-return route inventory (spec 279 step 1)

2026-10-31. `render()` in `dist/app.mjs` had 35 early-return blocks that each copied the explorer chip, the guide link and the nav highlight. Spec 279 counted eight on 2026-10-26; the rest were added since, which is the pattern the spec warns about. Each block now calls one `routeHeader(nav)`. The chooser branch and the binders stay in each block for now (spec 279 step 3 moves them into the route table).

`routeHeader(nav)` marks the nav link whose `href` is `nav` as the current page and every other link as not current. With no `nav` it marks none. The guide link names the explorer's chosen guide, with the first guide as the fallback. The shared route at the end of `render()` keeps its own guide and nav code and uses only the chip helper, `explorerHeader()`.

| Route | Nav highlight |
|---|---|
| `#desk/writing`, `#desk/exchange`, `#desk/gaps` | none |
| `#words/endings` | none |
| `#journeys` (whole root) | none |
| `#workshop/old-map`, `#workshop/lift`, `#workshop/switch-table`, `#workshop/hinge`, `#workshop/copy-frame`, `#workshop/ribbon-measures`, `#workshop/same-ground`, `#workshop/scale` | Workshop |
| `#workshop/common-cuts` | none |
| `#mill/energy` | Workshop |
| `#studio/sound-window` | asks for `#home`, which the nav has no link for, so none |
| `#studio/field-strips`, `#studio/mixing`, `#studio/mixing/bars`, `#studio/rhythm` | none |
| `#science/ice`, `#science/water-shares` | Water Lab |
| `#post/ferry`, `#post/descriptions`, `#post/codes` | Post Office |
| `#post/register` | none |
| `#almanac/upstream-reply`, `#almanac/weather`, `#almanac/tallies` | none |
| `#living/who-eats` | none |
| `#learn/math/paired` | none |
| `#arrive`, `#begin` | none |
| `#pathways/…` and `#learn/…` (whole roots, after `#learn/math/paired`) | none |
| `#cafe/units` | Café |
| `#loft/shadows` | asks for `#loft`, which the nav has no link for, so none |

The highlights are recorded as they were; this change keeps them. Two may deserve a look later: `#studio/sound-window` and `#loft/shadows` ask for nav links that do not exist, and `#workshop/common-cuts` highlights nothing while the other Workshop tables highlight Workshop.

`test/route-header-browser.mjs` visits each route above in a browser and checks the chip, the chosen guide's name and the highlight. It passes on main before this change and after it, and fails when `routeHeader` drops the highlight. Run it against a locally served `dist`: `ROUTE_HEADER_TEST_URL=http://localhost:PORT/ node test/route-header-browser.mjs`, with `PLAYWRIGHT_MODULE` and `CHROME_PATH` as for the other browser suites.
