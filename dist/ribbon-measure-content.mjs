export const ribbonMeasureCases=Object.freeze([
 ['unit-quarter','One unit, short measure',1,1,1,4,'Lay measuring pieces end to end.'],
 ['three-quarters','A smaller ribbon',3,4,1,4,'Same measuring group, shorter ribbon.'],
 ['eighth-group','A longer measuring group',3,4,3,8,'Same ribbon, a longer measuring group.'],
 ['partial-group','Part of a group',1,2,3,4,'Try equal parts of the measuring group.'],
 ['mixed-groups','Whole groups and a part',5,6,1,3,'What part of a group fills the last gap?'],
 ['beyond-one','Past one unit',3,2,3,4,'The ribbon extends beyond one original unit.']
].map(([id,title,an,ad,bn,bd,prompt])=>Object.freeze({id,title,amount:Object.freeze({n:an,d:ad}),group:Object.freeze({n:bn,d:bd}),prompt})));
export const ribbonMeasureCase=id=>ribbonMeasureCases.find(c=>c.id===id)||null;
export const ribbonMeasureCopy=Object.freeze({
 title:'Ribbon Measures',
 job:'Bramble is measuring ribbons for Willowbank’s next gathering. How many measuring groups cover this ribbon? Part of a group can fit, too.',
 reference:'One length unit stays the same size. The measuring strip is a reusable ruler, not a supply of ribbon.',
 unchanged:'Changing the measuring strip’s cuts does not change pieces you already laid.',
 visit:'These ribbons stay while you explore this board. Leaving or reloading clears them; they are not saved in Notes.',
 exampleNotice:'This is a separate example. Your ribbon stays as you left it.',
 exampleFrames:Object.freeze([
  'The ribbon is 1/2 of one length unit. One measuring group is 1/3 of one length unit. The original full unit is still marked above them.',
  'One whole group covers 1/3 of one length unit. The remaining gap is 1/6 of one length unit.',
  'Split the measuring group into 2 equal parts. Each is 1/2 of one measuring group and 1/6 of one length unit. The original unit holds 6 pieces of this size.',
  'One whole group plus a half-group piece covers the ribbon. Together: 1 1/2 measuring groups (3/2 groups). Check: 1 1/2 measuring groups times 1/3 of one length unit per group measures 1/2 of one length unit.'
 ]),
 grownup:'This is a finite visual measurement model: the quotient counts groups whose size is the divisor. Fractional final groups and mixed piece sizes connect the operation to multiplication as an inverse check. It does not teach the full reciprocal algorithm, general real-world problem reading, fluent arithmetic, independent explanation or mastery. Simplified labels and equations are supplied support. Work is temporary; there is no new assessment or Notes record. The measuring strip is an abstract reusable reference, not instructions for physical cutting or a promise that partial real objects meet an order.'
});
