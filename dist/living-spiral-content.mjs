// Original, versioned picture investigations. Conditions are authored, not simulated.
export const spiralAnimals=[
 {id:'snail',name:'Garden land snail',need:'Find damp shelter on land.',reason:'shelter',why:'Many garden land snails use damp, sheltered places. Look for moisture and cover on land, not just the name of an object.',word:'damp',definition:'Damp means a little wet. It does not mean underwater.',planning:'Could your planting plan leave a damp, covered corner undisturbed?'},
 {id:'woodlouse',name:'Woodlouse',need:'Find dark, damp daytime cover.',reason:'shelter',why:'Woodlice often shelter in dark, damp places during the day, especially among decaying leaves. A log, pot or stone is useful only if its conditions fit.',word:'shelter',definition:'Shelter is a place that gives cover or protection.',planning:'Where could fallen leaves and cover stay beside your planting beds?'},
 {id:'butterfly',name:'Adult butterfly',need:'Find open flowers with nectar to drink.',reason:'nectar',why:'This adult butterfly is looking for nectar in open flowers. Nectar is food. Caterpillars have different food needs, often leaves of particular plants.',word:'nectar',definition:'Nectar is a sweet liquid made by many flowers.',planning:'Where could you include nectar-bearing flowers beside the new beds?'}
];
const condition=(id,name,kind,damp,cover,nectar,observation)=>({id,name,kind,damp,cover,nectar,observation});
export const spiralConditions=[
 condition('dry-log','The fallen log','log',false,false,false,'In this close-up, the log is split open. Sun reaches its dry surface; there is no damp cover here.'),
 condition('damp-log','The fallen log','log',true,true,false,'Beneath this log, the picture shows shade and damp, decaying leaves on land.'),
 condition('damp-stone','The flat stone','stone',true,true,false,'The cutaway beneath the stone shows dark, damp leaf litter on land.'),
 condition('sun-stone','The flat stone','stone',false,false,false,'This stone lies in the sun. The pictured surface and ground are dry and exposed.'),
 condition('damp-pot','The old flowerpot','pot',true,true,false,'A gap beneath this old pot gives cover. Its fallen leaves are pictured dark and damp.'),
 condition('dry-leaves','The leaf patch','leaves',false,false,false,'These fallen leaves lie in an open patch. The close-up shows dry leaves without damp cover.'),
 condition('damp-leaves','The leaf patch','leaves',true,true,false,'Under a thick layer of leaves, this cutaway shows damp leaf litter and shade on land.'),
 condition('pond','The pond close-up','pond',false,false,false,'This spot is below the water surface. It is underwater, not the pond bank.'),
 condition('buds','The flower border','buds',false,false,false,'This pictured patch has tightly closed buds. It does not show open flowers with nectar to drink.'),
 condition('nectar','The flower border','flowers',false,false,true,'Here the open flowers are labeled nectar-bearing. This sheltered patch offers nectar to a visiting adult butterfly.'),
 condition('nectar-pot','The planted pot','flowerpot',false,false,true,'The pot holds open, nectar-bearing flowers. Their nectar is accessible to the adult butterfly in this picture.'),
 condition('nectar-hedge','Beside the hedge','hedge',false,false,true,'Beside the hedge are open, nectar-bearing flowers. The pictured hedge gives shelter from the wind.')
];
export const spiralReasons=[{id:'shelter',label:'Damp cover on land'},{id:'nectar',label:'Open flowers with nectar'},{id:'water',label:'A place underwater'}];
const setting=(id,animal,title,places,target,note,wonder)=>({id,animal,title,places,target,note,wonder});
export const spiralCases=[
 setting('snail-stone','snail','A different place to rest',['dry-log','damp-stone','pond'],'damp-stone','Look beside damp shelter on land. The first log you see may not fit.','What if the leaf litter beneath the stone dried out? What would you look for again?'),
 setting('snail-pot','snail','An overlooked corner',['damp-pot','dry-leaves','buds'],'damp-pot','The parcel is beside a covered, damp place. Compare the close-up clues.','Would an empty pot always give damp shelter? Which conditions would you check?'),
 setting('snail-leaves','snail','Room under the leaves',['sun-stone','damp-leaves','pond'],'damp-leaves','Find damp cover on land, then look for a sealed parcel beside it.','Could two leaf patches have different moisture and cover? What clues would tell you?'),
 setting('woodlouse-log','woodlouse','A small daytime hideaway',['damp-log','sun-stone','pond'],'damp-log','Look beside dark, damp cover. Leave the shelter just as you found it.','What might change if the log were moved into a dry, open patch?'),
 setting('woodlouse-pot','woodlouse','Not every log will do',['dry-log','damp-pot','nectar'],'damp-pot','Compare the conditions. Find dark, damp cover, not simply a familiar object.','Does a log’s name tell you whether the ground beneath it is damp?'),
 setting('woodlouse-stone','woodlouse','A sheltered patch of litter',['damp-stone','dry-leaves','nectar'],'damp-stone','The sealed food is beside damp, covered leaf litter on land.','What could you leave undisturbed while planning the garden’s new beds?'),
 setting('butterfly-border','butterfly','A different kind of need',['nectar','buds','pond'],'nectar','This adult is looking for nectar. Find the open flowers, then look beside them.','Would the same food necessarily suit a caterpillar? Ask what its own host plant is.'),
 setting('butterfly-pot','butterfly','Flowers in a small space',['dry-log','nectar-pot','dry-leaves'],'nectar-pot','Look beside accessible, nectar-bearing flowers. Shelter alone is not food.','What might change when the flowers finish blooming? Where could an adult find nectar next?'),
 setting('butterfly-hedge','butterfly','A sheltered feeding stop',['buds','nectar-hedge','pond'],'nectar-hedge','Find open flowers with nectar beside shelter from the wind.','How could a garden offer nectar at different times, rather than only one week?')
];
export const spiralAnimal=id=>spiralAnimals.find(a=>a.id===id);
export const spiralCondition=id=>spiralConditions.find(p=>p.id===id);
export const spiralCase=id=>spiralCases.find(c=>c.id===id);
export function spiralPlaces(task){const c=spiralCase(task.caseId);return c.places.map((_,i)=>spiralCondition(c.places[(i+task.rotation)%3]));}
export const spiralTarget=task=>spiralPlaces(task).findIndex(p=>p.id===spiralCase(task.caseId).target);
export const spiralMatch=(task,a)=>a?.place===spiralTarget(task)&&a?.reason===spiralAnimal(spiralCase(task.caseId).animal).reason;
