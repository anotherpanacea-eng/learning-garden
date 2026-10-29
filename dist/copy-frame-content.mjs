export const copyFrameCases=Object.freeze([
 ['small-panel','A bigger panel',2,3,2,1,'Make the matching lengths twice as long.'],
 ['long-panel','A longer panel',3,5,2,1,'Double the matching lengths. Would adding 3 to both do the same job?'],
 ['half-panel','Half the lengths',4,6,1,2,'Make each matching length half as long. What happens to the area?'],
 ['square-panel','A square surprise',3,3,2,1,'Double this square’s lengths. Then explore adding 1 to both.'],
 ['small-square','A smaller square',6,6,1,2,'Make this square’s matching lengths half as long.'],
 ['triple-panel','Three times the lengths',3,4,3,1,'Make every matching length 3 times as long.']
].map(([id,title,width,height,n,d,prompt])=>Object.freeze({id,title,width,height,factor:Object.freeze({n,d}),prompt})));
export const copyFrameCase=id=>copyFrameCases.find(c=>c.id===id)||null;
export const copyFrameCopy=Object.freeze({
 title:'Copy Frame',
 opening:'The workshop is making new sign panels. Can a panel change size and keep its shape?',
 teaching:'Multiply every matching length by the same factor to keep a rectangle’s shape. Its four corners stay right angles.',
 limit:'This board offers whole-unit widths and heights from 1 to 12. Other lengths, including parts of a unit, are possible off this board.',
 legend:'Dashed outline: original panel. Filled panel: my copy. Both use the same length unit; the original outline stays on top so it remains visible.',
 turn:'Turn swaps the width and height, then lines the corner up again. The area stays the same.',
 visit:'Your copies stay while you explore this board. Leaving or reloading clears them; they are not saved in Notes.',
 boundary:'This comparison is for rectangles, including squares, whose opposite sides are equal and whose corners are all right angles. It is not a test for every kind of shape.',
 square:'When both sides of a square change by the same amount, added or taken away, they stay equal. Such a copy is a square with one matching-side factor. Try a non-square panel before making a rule about all rectangles.',
 exampleTitle:'Worked example: one side, both sides, or adding',
 exampleNotice:'This is another example. Your copy stays as you left it.',
 frames:Object.freeze([
  'Original 2 by 3. The copy is also 2 by 3: same shape and size. Each covers 6 square units.',
  'Change only the height: 2 by 6. Width has factor 1, height factor 2. Area is 12 square units, but the shape changed.',
  'Change both matching lengths by factor 2: 4 by 6. Four original-sized 2-by-3 panels fit in two rows and two columns. Area is 24 square units: 4 times the original 6, because 2 × 2 = 4. These outlined panels are not single unit squares.',
  'Instead, add 1 to both original lengths: 3 by 4. The length factors are 3/2 and 4/3, so the shape changed. Its 12 square units match picture 2’s area, but not its shape. Adding equally changed this rectangle’s shape. Squares are different: try A square surprise.'
 ]),
 grownup:'This open rectangle model connects matching-side scale factors to area factors, including a smaller and a turned copy. Shapes, lengths and sign panels are invented. The grid uses abstract units, not device centimeters or physical measurements. Unit squares, a length-unit segment and original-sized example panels have different jobs. Simplified factors and interpretations are supplied support. Constructing a match is not independent explanation, fluent ratio arithmetic, readiness or mastery. This does not teach all polygons, centre-of-enlargement constructions, map-unit conversion, standard-unit conversion or every geometry method. Work is temporary and creates no new Notes or assessment record. All cases and support remain open.'
});
