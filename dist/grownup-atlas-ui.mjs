// Adult reference route.
import {readAtlas, atlasRoute, atlasRows, atlasTopic} from './grownup-atlas-core.mjs';

const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const freshFilters = () => ({query:'', subject:'', domain:'', linkedOnly:false, page:1});
let catalog = null, filters = freshFilters(), origin = null, generation = 0, pending = null;
const pin = '96a7933754af672e1bfdbf7ecb05c325860c6e0d';
const topicHref = id => `#atlas/${encodeURIComponent(id)}`;
const exits = () => '<nav class="ga-exits" aria-label="Atlas exits"><a href="#map">Back to the small map</a><a href="#notes">Grown-up notes</a></nav>';
const footer = () => `<footer class="ga-license"><p>Marble Skill Taxonomy v1 © Generative Spark, Inc. (Marble), pinned at <span>${pin}</span>.</p><div class="ga-license-links"><a href="https://github.com/withmarbleapp/os-taxonomy/tree/${pin}" target="_blank" rel="noopener">Pinned source</a><a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener">ODbL 1.0 database license</a><a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0 source-text license</a><a href="./grownup-atlas.json" download>Download atlas data</a></div><p>Topic names and source links come from Marble. Activity scopes are Learning Garden declarations. Neither is a course completion or learner assessment.</p><p>Age suffixes are upstream topic titles, not an age assignment, prerequisite or access rule.</p><p>The atlas data download contains curriculum data only.</p></footer>`;
const heading = (title, copy = '') => `<header class="ga-masthead"><h1 id="ga-heading" tabindex="-1">${e(title)}</h1>${copy}</header>`;

export function resetGrownupAtlas() {
  generation++;
  pending?.abort();
  pending = null;
  filters = freshFilters();
  origin = null;
}

// Only curriculum data is retained between visits. Browse state belongs to this visit.
export function showGrownupAtlas(container, {hash, isActive = () => true, afterRender = () => {}} = {}) {
  const turn = ++generation;
  pending?.abort();
  pending = null;
  const route = atlasRoute(hash);
  container.innerHTML = '<section class="grownup-atlas" data-ga-root></section>';
  const root = container.querySelector('[data-ga-root]');
  const alive = () => turn === generation && container.contains(root) && isActive();
  const focus = node => { if (alive()) node?.focus(); };
  const finish = node => { afterRender(); focus(node); };
  function unknown() {
    if (!alive()) return;
    root.dataset.gaView = 'unknown';
    root.innerHTML = `${heading('That source topic is not in this pinned catalog')}<a href="#atlas">Browse all topics</a>${exits()}`;
    finish(root.querySelector('#ga-heading'));
  }
  function loading() {
    root.dataset.gaView = 'loading';
    root.innerHTML = `${heading('Learning atlas')}<p class="ga-status" role="status" tabindex="-1">Loading the full source catalog…</p>${exits()}`;
    finish(root.querySelector('.ga-status'));
  }
  function error() {
    if (!alive()) return;
    root.dataset.gaView = 'error';
    root.innerHTML = `${heading('Learning atlas')}<p class="ga-status" role="alert" tabindex="-1">The full atlas could not load. Retry, or use the small learning map.</p><button type="button" data-ga-action="retry">Retry</button>${exits()}`;
    root.querySelector('[data-ga-action="retry"]').onclick = () => { if (alive()) load(); };
    finish(root.querySelector('.ga-status'));
  }
  function renderIndex() {
    if (!alive()) return;
    root.dataset.gaView = 'index';
    const linked = new Set(catalog.references.map(r => r.topicId)).size;
    root.innerHTML = `${exits()}${heading('Learning atlas', '<p>Browse the full source catalog and the activity links we have declared. These connections help adults plan; they do not measure what a learner knows.</p>')}<p class="ga-scope">Marble lists ${catalog.topics.length.toLocaleString('en-US')} topics and ${catalog.edges.length.toLocaleString('en-US')} direct relationships. Learning Garden has declared ${catalog.references.length.toLocaleString('en-US')} activity links for ${linked.toLocaleString('en-US')} topics. A topic with no declared link may still appear in a game.</p><div class="ga-shelf"><aside class="ga-filter" aria-labelledby="ga-filter-heading"><h2 id="ga-filter-heading">Find a topic</h2><label for="ga-search">Search topic name or ID</label><input id="ga-search" data-ga-search type="search" maxlength="80" value="${e(filters.query)}"><label for="ga-subject">Subject</label><select id="ga-subject" data-ga-subject></select><label for="ga-domain">Domain</label><select id="ga-domain" data-ga-domain></select><label class="ga-check"><input type="checkbox" data-ga-linked ${filters.linkedOnly?'checked':''}><span>Only topics with a declared link</span></label><button type="button" data-ga-action="clear">Clear filters</button></aside><section class="ga-results" aria-labelledby="ga-results-heading"><div class="ga-results-title"><h2 id="ga-results-heading" tabindex="-1">Source topics</h2><p data-ga-count role="status" aria-live="polite" aria-atomic="true"></p></div><ul class="ga-result-list" data-ga-rows></ul><nav class="ga-pages" aria-label="Result pages"><button type="button" data-ga-action="previous">Previous</button><p data-ga-page></p><button type="button" data-ga-action="next">Next</button></nav></section></div>${footer()}`;
    const search = root.querySelector('[data-ga-search]'), subject = root.querySelector('[data-ga-subject]'), domain = root.querySelector('[data-ga-domain]'), checkbox = root.querySelector('[data-ga-linked]');
    const option = (value, label) => `<option value="${e(value)}">${e(label)}</option>`;
    function update() {
      if (!alive()) return;
      const result = atlasRows(catalog, filters);
      filters.page = result.page;
      subject.innerHTML = option('', 'All subjects') + result.subjects.map(s => option(s,s)).join('');
      subject.value = filters.subject;
      domain.innerHTML = option('', 'All domains') + result.domains.map(d => option(d, filters.subject ? d.slice(d.indexOf(' / ')+3) : d)).join('');
      domain.value = filters.domain;
      root.querySelector('[data-ga-count]').textContent = `${result.total.toLocaleString('en-US')} matching topics from ${result.totalTopics.toLocaleString('en-US')} source topics`;
      root.querySelector('[data-ga-rows]').innerHTML = result.rows.map(t => `<li><div><a href="${topicHref(t.id)}" data-ga-topic="${e(t.id)}">${e(t.name)}</a><p>${e(t.subject)} / ${e(t.domain)}</p><p class="ga-where">Source topic ${e(t.id)}</p></div><span class="ga-label ${t.linked?'':'ga-empty'}">${t.linked?'Declared link':'No declared activity link'}</span></li>`).join('') || '<li><p>No topics match these filters.</p></li>';
      root.querySelector('[data-ga-page]').textContent = `Page ${result.page} of ${result.pages}`;
      root.querySelector('[data-ga-action="previous"]').disabled = result.page <= 1;
      root.querySelector('[data-ga-action="next"]').disabled = result.page >= result.pages;
      root.querySelectorAll('[data-ga-topic]').forEach(link => link.onclick = () => { if (alive()) origin = link.dataset.gaTopic; });
    }
    search.oninput = () => { filters.query = search.value.trim().slice(0,80); filters.page = 1; update(); };
    subject.onchange = () => { filters.subject = subject.value; filters.domain = ''; filters.page = 1; update(); };
    domain.onchange = () => { filters.domain = domain.value; filters.page = 1; update(); };
    checkbox.onchange = () => { filters.linkedOnly = checkbox.checked; filters.page = 1; update(); };
    root.querySelector('[data-ga-action="clear"]').onclick = () => { filters = freshFilters(); origin = null; search.value = ''; checkbox.checked = false; update(); focus(search); };
    for (const [action, delta] of [['previous',-1],['next',1]]) root.querySelector(`[data-ga-action="${action}"]`).onclick = () => { filters.page += delta; update(); focus(root.querySelector('#ga-results-heading')); };
    update();
    const originalRow = Array.from(root.querySelectorAll('[data-ga-topic]')).find(link => link.dataset.gaTopic === origin);
    finish(originalRow || (origin ? root.querySelector('#ga-results-heading') : root.querySelector('#ga-heading')));
  }
  function renderTopic(id) {
    if (!alive()) return;
    const detail = atlasTopic(catalog, id);
    if (!detail) return unknown();
    const {topic, references, buildsOn, usedBy} = detail;
    const kinds = {'authored-task':'Authored task','scoped-practice':'Scoped practice','explanation':'Supplied explanation'};
    const neighbors = (title, rows) => `<h3>${title}</h3><ul>${rows.map(({topic:t,strength}) => `<li><a href="${topicHref(t.id)}" data-ga-neighbor="${e(t.id)}">${e(t.name)}</a><small>${strength==='hard'?'Source foundation link':'Source helpful link'}</small></li>`).join('') || '<li>No direct source links in this direction.</li>'}</ul>`;
    root.dataset.gaView = 'topic';
    root.innerHTML = `<a class="ga-back" data-ga-action="back-results" href="#atlas"><span aria-hidden="true">←</span> Back to results</a>${exits()}${heading(topic.name, `<p class="ga-identity">${e(topic.subject)} / ${e(topic.domain)} · Source topic ${e(topic.id)}</p><p>These are source relationships for planning, not locked steps or a test of what someone knows.</p>`)}<div class="ga-topic-top"><section aria-labelledby="ga-encounters"><h2 id="ga-encounters">Declared Learning Garden encounters</h2>${references.map(r => `<div class="ga-encounter"><strong>${kinds[r.kind]} · ${e(r.gameName)}</strong><p>${e(r.scope)}</p><a href="${e(r.route)}" data-ga-activity>Open this activity in this app</a></div>`).join('') || '<p>No activity link is declared for this topic. The source connection can still help plan a future lesson.</p>'}<p>One small activity can address only part of a source topic. This is a declaration of what was offered, not learner evidence.</p></section><aside class="ga-edge-box"><h2>Direct source links</h2>${neighbors('Builds on',buildsOn)}${neighbors('Used by',usedBy)}</aside></div><div class="ga-more"><h2>How to read this atlas</h2><p>Topic names and source links come from Marble. Activity scopes are Learning Garden declarations. Neither is a course completion or learner assessment.</p><a href="#atlas">Browse all topics</a></div>${footer()}`;
    finish(root.querySelector('#ga-heading'));
  }
  function render() { if (route.kind === 'index') renderIndex(); else renderTopic(route.id); }
  async function load() {
    if (!alive()) return;
    loading();
    const controller = new AbortController();
    pending = controller;
    try {
      const response = await fetch('./grownup-atlas.json', {signal:controller.signal});
      if (!response.ok) throw new Error('Atlas response failed');
      const parsed = readAtlas(await response.json());
      if (!alive()) return;
      if (!parsed) throw new Error('Atlas data failed validation');
      catalog = parsed;
      pending = null;
      render();
    } catch (failure) {
      if (!alive() || controller.signal.aborted) return;
      pending = null;
      error();
    }
  }
  if (!route || route.kind === 'unknown') unknown();
  else if (catalog) render();
  else load();
}
// End adult reference route.
