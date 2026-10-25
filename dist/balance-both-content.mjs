// Original authored positive whole-parcel practice. Upstream references: spec 214.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const line=(text,facts=[])=>({text,facts});
const pan=(parcels,units,bags=0)=>({parcels,units,bags});
const learn=[
 line('Matching sealed parcels have the same mass. P names one whole parcel.'),
 line('Try 2P + 3 = P + 7. Take one matching parcel off each pan: P + 3 = 7.'),
 line('Take three units off each pan: P = 4. Removing the same mass keeps the equality.'),
 line('Check the original: 2 × 4 + 3 = 4 + 7 = 11. Each starting pan has mass 11.',[[2,4]])
];
export const bothPages=freeze(['balance','ledger','kept']);
export const bothInputMessage='Enter a whole-number idea from 0 to 99, without units or signs. You can also leave it blank and keep the arrangement.';
export const bothCases=freeze([
 {id:'both-sides-1',title:'Matching parcels',question:'What mass does one matching parcel have?',parcelMass:4,bagUnits:2,start:{left:pan(3,4),right:pan(1,12)},hint:'Take one matching parcel off each pan. What remains?',
 guided:[line('Take one P off each pan: 2P + 4 = 12.'),line('Take four units off each pan: 2P = 8.'),line('Share each pan into two whole groups: P = 4.'),line('Check: 3 × 4 + 4 = 4 + 12 = 16.',[[3,4]])],
 example:[line('A different worked example: 2P + 2 = P + 6.'),line('Remove P each: P + 2 = 6. Remove two units each: P = 4.'),line('Check: 2 × 4 + 2 = 4 + 6 = 10.',[[2,4]])],suggested:'Take one P off each side of 3P + 4 = P + 12; you get 2P + 4 = 12.'},
 {id:'both-sides-2',title:'Parcels on the right',question:'Compare the parcels with the nine unit weights.',parcelMass:3,bagUnits:2,start:{left:pan(2,9),right:pan(5,0)},hint:'Which pan has fewer loose parcels? Remove that many from both, one pair at a time.',guided:[],
 example:[line('A different worked example: P + 6 = 3P.'),line('Remove P each: 6 = 2P. Make two equal groups: 3 = P.'),line('Check: 3 + 6 = 3 × 3 = 9.',[[3,3]])],suggested:'Take one P from each side, then another: 9 = 3P.'},
 {id:'both-sides-3',title:'One extra unit',question:'What can matching removals show about one parcel?',parcelMass:5,bagUnits:2,start:{left:pan(4,1),right:pan(2,11)},hint:'Remove two parcels from each pan, one matching pair at a time.',guided:[],
 example:[line('A different worked example: 3P + 2 = P + 10.'),line('Remove P each: 2P + 2 = 10. Remove two units each: 2P = 8.'),line('Share in two: P = 4. Check: 3 × 4 + 2 = 4 + 10 = 14.',[[3,4]])],suggested:'Remove two P each from 4P + 1 = 2P + 11; 2P + 1 = 11 is still level.'},
 {id:'bags-of-three',title:'Three closed bags',question:'Each bag holds one matching parcel and two units. What mass does one parcel have?',parcelMass:4,bagUnits:2,start:{left:pan(0,0,3),right:pan(1,14)},hint:'Each closed bag contains a parcel and two units. Open the bags before taking out their contents.',guided:[],
 example:[line('A different worked example: these bags contain ONE unit each. 2(P + 1) = P + 6.'),line('Open: 2P + 2 = P + 6. Remove P each and two units each: P = 4.'),line('Check: 2 × (4 + 1) = 4 + 6 = 10.',[[2,5]])],suggested:'Open one left bag at a time; all three become 3P + 6 = P + 14.'}
].map(s=>({version:1,...s,learn:structuredClone(learn),skip:'Skip for now. Your pans and idea stay here; choose another case or return later.'})));
export const bothSource=id=>{const s=bothCases.find(s=>s.id===id);return s?structuredClone(s):null;};
