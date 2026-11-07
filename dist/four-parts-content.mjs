// Original positive-length print layouts. New drafts freeze all words and drawing data.
export const productCases=Object.freeze([
 {id:'picture',title:'A picture and two strips',a:2,b:3,story:'Add 2 cm to the right and 3 cm below the square picture.',explanation:'The two x-strip areas add to 5x. The 2-by-3 corner contributes 6, not 5.'},
 {id:'narrow',title:'Same strip total, another corner',a:1,b:4,story:'This plan adds 1 cm to the right and 4 cm below.',explanation:'The strips still add to 5x, but the corner is 1 × 4. A matching x total does not fix the corner.'},
 {id:'square',title:'Equal extensions',a:3,b:3,story:'Add 3 cm on both sides. The whole plan is square too.',explanation:'There are two 3x strips as well as the original square and the 3-by-3 corner. (x + 3)² is not just x² + 9.'},
 {id:'wide',title:'A wider lower strip',a:2,b:4,story:'Add 2 cm to the right and 4 cm below.',explanation:'These strips add to 6x too. The corner is 2 × 4, so this whole differs from the equal-extension plan.'},
 {id:'small',title:'One centimeter each way',a:1,b:1,story:'Leave 1 cm of extra paper at the right and below.',explanation:'Two x strips are 2x. They are not 2x². The corner is one square centimeter.'},
 {id:'corner',title:'Keep the corner',a:3,b:4,story:'Add 3 cm to the right and 4 cm below.',explanation:'The corner covers 3 × 4 square centimeters. Counting the side lengths 3 + 4 cannot give that area.'}
]);
export const productParts=Object.freeze([
 {key:'square',letter:'A',label:'Picture square'},
 {key:'right',letter:'B',label:'Right strip'},
 {key:'bottom',letter:'C',label:'Bottom strip'},
 {key:'corner',letter:'D',label:'Corner'}
]);
const rect=(x,notation='numbers')=>({kind:'rectangle',a:1,b:2,x,notation});
const teaching=[
 {words:'Start with numbers. An 11 cm by 12 cm rectangle can be split at 10 cm on each side. Its four parts have areas 100, 10, 20 and 2 square centimeters. Together they make 132.',figure:rect(10)},
 {words:'The cuts reach all the way across. No paper is missing, and no part is counted twice. This is why adding the four areas gives the whole area.',figure:rect(10)},
 {words:'Now use x in place of 10. The square is x × x, written x². The right strip is 1 × x, the bottom strip is 2 × x, and the corner is 1 × 2. The whole side lengths, x + 1 and x + 2, are factors: lengths we multiply. Brackets keep each added length together.',figure:rect(10,'letters')},
 {words:'x² is the area of a square with side length x. 2x means two lots of x. At x = 2 both happen to be 4. At x = 3 they are 9 and 6. One matching number does not make the labels the same.',figure:{kind:'square-and-strip',xs:[2,3],strip:2}},
 {words:'Gather the same kinds: x² + x + 2x + 2 becomes x² + 3x + 2. Here the plus signs separate terms of a sum. You can combine terms with the same kind of tile, such as the x strips. You cannot combine an x square and an x strip into two x squares.',figure:rect(3,'letters')},
 {words:'A size check tells us about that size. The four pieces explain why a matching expression describes every picture size in this plan. We are using positive lengths here.',figure:null}
];
export function makeProductSource(id='picture'){
 const c=productCases.find(c=>c.id===id);if(!c)return null;
 return structuredClone({v:1,id:`four-parts-${c.id}`,title:c.title,story:`A layout for the Gazette. ${c.story} Here x is the picture's side length measured in centimeters; areas are numbers of square centimeters. These are made-up print plans.`,a:c.a,b:c.b,initialX:6,teaching,explanation:c.explanation,example:{a:1,b:2,x:10,words:[
  'A different layout adds 1 cm to the right and 2 cm below a square with side length 10 cm.',
  'The four areas are 100, 10, 20 and 2 square centimeters: 132 altogether. The whole measures 11 cm by 12 cm.',
  'For a side length x, the four labels are x², x, 2x and 2. Together they are x² + 3x + 2.'
 ]}});
}
export const productCopy=Object.freeze({
 label:'Four Parts',entry:'Build a print layout, then gather like tiles.',back:'Equality Desk',working:'Working drafts',shelf:'Kept layouts',
 build:'Build four labels',collect:'Gather like tiles',compare:'Compare',
 instruction:'Build labels for any picture size x. Choose a part, a tile kind, then how many.',collection:'The tray starts at zero. Gather your x squares, x strips and unit squares.',
 squareKind:'x square',stripKind:'x strip',unitKind:'unit square',clear:'Clear this label',
 size:'Change x',sizeNote:'x is a side length in centimeters. Changing it keeps your labels and tray.',
 teaching:'See how the four parts work',example:'A separate worked example',
 copy:'Work on a copy',another:'Another copy',blank:'New blank draft',keep:'Keep this layout',hear:'Hear this page',
 session:'Unkept drafts last in this open page. Keep a version to include it in Notes.',
 keptSaved:'When kept, this version was saved on this device.',keptSession:'When kept, saving was off. Download Notes if you want to keep a file.',keptUncertain:'When kept, device saving was not confirmed. Your version stays in this open page; download Notes to keep a file.',
 refused:'This version could not be kept safely. Your work and earlier layouts are unchanged. Download Notes or keep building.',
 stale:'The saved layouts changed. Reopen Four Parts before continuing.',
 readOnly:'This kept layout stays unchanged. Work on a copy to change it or open a new help view.',
 missing:'No label yet. You can keep looking or keep this unfinished version.',
 pictureUnavailable:'This earlier picture cannot be drawn. Its words and your layout are still available.',
 generalFit:'Your tray describes the whole area. Some labels do not describe their own pieces. Check each piece’s side lengths.',
 swapped:'The right and bottom labels are on each other’s strips.',
 pointOnly:'The numbers agree at this size. The expressions are different. Change x and compare the four pieces.',
 unknown:'This earlier format stays unchanged in Notes. You can still build another layout.',
 grownup:'These are given mathematical layouts and optional teaching/reference/example views. Labels and a tray are retained as constructed, including zero or unexpected choices. Initial zeros and the count-one kind default are instrument starts, not inferred answers. Flags name views opened in that working version; they do not measure attention or all prior exposure. A false separate-example flag does not exclude an example in teaching. This does not assess independent expansion, a completed topic, or ability outside this positive-length model.'
});
