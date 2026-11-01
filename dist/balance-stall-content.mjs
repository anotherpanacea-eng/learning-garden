// Original ideal equal-arm model. Unit masses are fictional, not calibrated grams.
export const balancePages=['balance','kept'];
const help='Equals means the same value. Our matched pans compare model mass. Every small weight is one model mass unit. The sealed parcel means the whole parcel, wrapping included; it is not one unit just because it is one object. Add or remove the same available unit on both sides to keep their existing difference. That keeps a level balance level, but cannot repair a difference already there. You may change one side, change it back, or reset. These are results from the game’s model, not real measurements.';
const make=(id,title,start,parcelSide=null,parcelMass=null)=>({version:1,id,title,question:parcelSide?'What is the model mass of this whole sealed parcel?':'What can change while both sides keep the same mass?',help,kind:parcelSide?'parcel':'known',parcelSide,parcelMass,start});
export const balanceCases=[
 make('two-arrangements','Two ways to arrange five',{left:[3,2],right:[4,1]}),
 make('seven-each','Seven on each side',{left:[5,2],right:[3,4]}),
 make('leaf-parcel','A folded leaf parcel',{left:[0,2],right:[0,7]},'left',5),
 make('star-parcel','A paper-star parcel',{left:[0,1],right:[0,4]},'left',3),
 make('ribbon-parcel','A ribbon parcel',{left:[0,3],right:[0,10]},'left',7),
 make('tiny-parcel','A tiny card parcel',{left:[0,2],right:[0,3]},'left',1),
 make('right-parcel','A story parcel on the right',{left:[0,11],right:[0,2]},'right',9),
 make('large-parcel','A puppet parcel',{left:[0,1],right:[0,13]},'left',12),
];
export const balanceSource=id=>{const source=balanceCases.find(x=>x.id===id);return source?structuredClone(source):null;};
