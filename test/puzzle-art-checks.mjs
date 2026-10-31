import assert from 'node:assert/strict';
import {puzzles} from '../dist/content.mjs';
import {puzzleArt} from '../dist/puzzle-art.mjs';

// Each puzzle card has its own drawn scene, hidden from screen readers, with no text or numbers that could state an answer.
let checks=0;
for(const q of puzzles){
 const svg=puzzleArt(q.id);
 assert.match(svg,/^<svg class="puzzle-scene"[^>]*aria-hidden="true"/,`${q.id}: decorative svg`);
 assert.doesNotMatch(svg,/<text|<title|<desc/,`${q.id}: no drawn text`);
 assert.doesNotMatch(svg.replace(/<[^>]*>/g,''),/\S/,`${q.id}: no glyphs outside tags`);
 checks+=3;
}
assert.equal(new Set(puzzles.map(q=>puzzleArt(q.id))).size,puzzles.length,'every puzzle has a different scene');checks++;
assert.equal(puzzleArt('unknown'),'','unknown ids draw nothing');checks++;
console.log(`Puzzle art: ${checks} checks passed.`);
