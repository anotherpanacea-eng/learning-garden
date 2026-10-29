export const groundCases=Object.freeze([
 ['four','Four tiles',4,4,'Try one row of 4, keep its picture, then try 2 rows of 2. Walk the edge and check the count.'],
 ['six','Six tiles',6,6,'Try one row of 6, then 2 rows of 3. Does the fence count stay the same?'],
 ['twelve','Twelve tiles',12,6,'Try 2 rows of 6, then 3 rows of 4. What changed? What stayed?'],
 ['turn','Turn the plot',12,4,'Try 3 rows of 4, then 4 rows of 3. Does turning it change the outside length?'],
 ['sixteen','Sixteen tiles',16,8,'Try 2 rows of 8, then 4 rows of 4. Compare the two counts.'],
 ['twenty-four','A shorter fence',24,12,'Keep a picture of 2 rows of 12. Can you use all 24 tiles with no more than 20 length units of fence? Other arrangements are welcome.']
].map(([id,title,stock,width,prompt])=>Object.freeze({id,title,stock,width,prompt})));
export const groundCopy=Object.freeze({
 title:'Same ground, different fence',
 job:'Plan a growing plot after the storm. Lay square tiles, then walk the outside edge. Can the same tiles need a different amount of fence?',
 units:'One tile covers 1 square unit. Each edge is 1 length unit. These are model units, not metres.',
 visit:'This work stays while you explore this board. Leaving or reloading clears it; it is not saved in Notes.',
 widthLock:'Return the tiles first to change how many squares are in each row.',
 picture:'A picture of your earlier arrangement; these are not extra tiles.',
 shared:'Two square tiles meet along one edge. Together they cover 2 square units. Their outside has 6 one-unit edges. The shared line is inside, so we do not count it as fence.',
 grownup:'This model links square-unit covering to a traced length boundary, conserving a finite tile stock. Computed labels and pictures are supplied support, not evidence of independent arithmetic, explanation or mastery. Rotation and equal-area contrasts are finite examples, not an optimization proof. Try the same job with paper squares and string if useful. No answer, attempt or support record is saved by this board.'
});
export const groundCase=id=>groundCases.find(c=>c.id===id)||null;
export const units=(n,name)=>`${n} ${name}${n===1?'':'s'}`;
