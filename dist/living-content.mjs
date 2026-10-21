// Original authored scene conditions, not field measurements or a live ecosystem model.
export const habitatPlaces=[
 {id:'sunny',name:'The sunny patch',short:'Sunlit ground',observation:'In this picture, sunlight reaches the open ground. Its surface is drawn dry, with no cover overhead.',clue:'sun + dry exposed ground',feedback:'The pictured ground is dry and exposed. What could give a land snail moisture and cover?'},
 {id:'log',name:'The shady log',short:'Under the log',observation:'The cutaway picture shows shade beneath the log and damp fallen leaves resting on land.',clue:'shade + damp leaves on land',feedback:'The log has damp shelter. Which reason uses those clues?'},
 {id:'pond',name:'Inside the pond',short:'Below the water',observation:'This pictured spot is below the water surface. The pond bank is a different place, outside this close-up.',clue:'underwater',feedback:'This spot is underwater. We are thinking about a land snail. Freshwater snails are different animals.'}
];
export const habitatReasons=[{id:'shelter',label:'Damp leaves and shelter'},{id:'sunshine',label:'The brightest sunshine'},{id:'underwater',label:'A place underwater'}];
export const habitatWelcome='Moss has plans for new beds. But who else lives here? A land snail needs a place to rest. Look closely at three pictured places. A missing café parcel is beside damp shelter on land. Can the clues help us find it?';
export const habitatExplanation='Many garden land snails use damp, sheltered places. Our log picture shows damp leaves and shade on land. The sunny ground is drawn dry and open. The pond close-up is underwater. These clues make the log a useful place to look. They cannot promise a snail will be there.';
export const habitatConclusion='A garden can have planting beds and small places for wildlife. Our rows of counters tell us how many spaces are on a plan. They do not tell us what a real plant or animal needs. What might you leave undisturbed beside your new bed?';
export const habitatParcel={ingredientId:'moon-crunch',name:'Moon crunch',packs:3,bites:4,total:12};
export const habitatPlace=id=>habitatPlaces.find(p=>p.id===id);
export const habitatMatch=a=>a?.place==='log'&&a?.reason==='shelter';
