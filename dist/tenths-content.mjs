// Original fixed-whole requests. No taxonomy prose or upstream lesson is copied.
export const TENTHS_HELP='One tenth is one of ten equal parts of this same whole. Count one tenth, two tenths, and so on. Decimal writing gives another name for the amount. Four tenths is 4/10, also written 0.4. Ten tenths is one whole, written 1 or 1.0.';
export const tenthsCases=[
 ['one-fraction','One little part','Make 1/10 of this whole repair strip.',1,'fraction'],
 ['four-fraction','Four tenths','Make 4/10 of this whole repair strip.',4,'fraction'],
 ['four-decimal','A second name','Make 0.4 of this whole repair strip.',4,'decimal'],
 ['seven-decimal','A longer label','Make 0.7 of this whole repair strip.',7,'decimal'],
 ['whole-fraction','All ten parts','Make 10/10 of this whole repair strip.',10,'fraction'],
 ['whole-decimal','A third decimal request','Make 1.0 of this whole repair strip.',10,'decimal'],
 ['zero-fraction','No strip selected','Make 0/10 of this whole repair strip.',0,'fraction'],
 ['zero-decimal','A final decimal request','Make 0.0 of this whole repair strip.',0,'decimal']
].map(([id,title,request,targetTenths,form])=>({version:1,id,title,request,targetTenths,form,wholeId:'repair-strip-one',wholeLabel:'One whole repair strip; ten equal parts across both rows.',partCount:10}));
export const tenthsDecimal=n=>n===10?'1.0':`0.${n}`;
export const tenthsNames=n=>`${n}/10 = ${tenthsDecimal(n)}${n===0?' = 0':n===10?' = 1':''}`;
