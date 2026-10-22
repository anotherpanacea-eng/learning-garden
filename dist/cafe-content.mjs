// Authored make-believe guests and bites. Properties, rather than names, determine a plate's fit.
export const cafeSuppers=[
 {title:'The welcome-back dinner',invitation:'Our neighbors are back from mending the garden after the storm. Serve six tables for their welcome-back dinner.',ending:'The welcome-back dinner is ready! The lanterns are lit, the café is open, and our neighbors can rest and eat together.',color:'#e9b84a',decoration:'lanterns'},
 {title:'A moonlight picnic',invitation:'The moon has come out to eat with us. Set six tables under it.',ending:'The moonlight picnic is ready. Plates are waiting beneath a sky full of stars.',color:'#abc4da',decoration:'stars'},
 {title:'The rooftop potluck',invitation:'Bring six tables together for a feast above the garden.',ending:'The rooftop potluck is ready. The garden has a table for every neighbor.',color:'#b8d4c3',decoration:'leaves'},
 {title:'The ribbon festival supper',invitation:'Serve six tables for a supper among bright ribbons.',ending:'Ribbons snap like happy flags. Six tables are dressed and waiting.',color:'#da8d8d',decoration:'ribbons'}
];
export const starterIngredients = [
  {id:'moon-crunch', name:'Moon crunch', properties:['warm','crunchy','sweet'], color:'#e9b84a'},
  {id:'comet-crisp', name:'Comet crisps', properties:['warm','crunchy','tangy'], color:'#da8d8d'},
  {id:'cloud-puff', name:'Cloud puffs', properties:['warm','soft','sweet'], color:'#e2cf9f'},
  {id:'sun-swirl', name:'Sun swirls', properties:['warm','soft','tangy'], color:'#e5a36f'},
  {id:'frost-snap', name:'Frost snaps', properties:['cold','crunchy','sweet'], color:'#abc4da'},
  {id:'rain-chip', name:'Rain chips', properties:['cold','crunchy','tangy'], color:'#b4a6c8'},
  {id:'mist-mallow', name:'Mist mallows', properties:['cold','soft','sweet'], color:'#b8d4c3'},
  {id:'dew-drop', name:'Dew drops', properties:['cold','soft','tangy'], color:'#90b9ae'}
];

export const orchardFoods = [
  {id:'star-berry',name:'Star berries',properties:['cold','soft','sweet'],color:'#b7c7e3',orchard:true,
    location:'The star-berry bower',clues:['A pretend berry hangs like a little star.','Imagine its soft, squishy shape.','This imaginary berry is cold, soft, and sweet.']},
  {id:'spiral-pod',name:'Spiral pods',properties:['warm','crunchy','tangy'],color:'#e5a36f',orchard:true,
    location:'The spiral-pod branches',clues:['A pretend pod curls into a spiral.','Imagine its crunchy shell. It crackles like dry leaves.','This imaginary pod is warm, crunchy, and tangy.']},
  {id:'wobble-fruit',name:'Wobble fruit',properties:['cold','soft','tangy'],color:'#b8d4c3',orchard:true,
    location:'The wobble-fruit nook',clues:['A pretend fruit wobbles on its branch.','Imagine its soft shape giving a little wobble.','This imaginary fruit is cold, soft, and tangy.']}
];
export const ingredients = [...starterIngredients,...orchardFoods];

export const guests = [
  {id:'puff', name:'Puff', kind:'cloud-dragon', greeting:'A little cloud-dragon curls around the counter. “My umbrella is mostly decorative.”', wantedDish:'thunder toast', thanks:'“Thank you! A fine plate for a cloud-sized afternoon.”'},
  {id:'brolly', name:'Brolly', kind:'umbrella-sprite', greeting:'An umbrella-sprite folds up politely. One small raindrop refuses to get off.', wantedDish:'rainbow ribbons', thanks:'“Lovely! I shall pretend the raindrop is my dinner bell.”'},
  {id:'tangle', name:'Tangle', kind:'ribbon-giant', greeting:'A ribbon-giant ties a bow to remember the order. Then forgets which bow.', wantedDish:'knot noodles', thanks:'“Thank you! One less knot to think about.”'},
  {id:'pebble', name:'Pebble', kind:'pebble-troll', greeting:'A pebble-troll takes a seat. The seat looks mildly surprised.', wantedDish:'mountain muffins', thanks:'“A splendid pretend picnic. I brought my own mountain.”'},
  {id:'wisp', name:'Wisp', kind:'lantern-sprite', greeting:'A lantern-sprite floats in. “A table by the window, please. I enjoy looking out.”', wantedDish:'glimmer gumdrops', thanks:'“Thank you! The view and the plate are both quite delightful.”'},
  {id:'bobble', name:'Bobble', kind:'little-comet', greeting:'A little comet parks its tail outside. It takes up two imaginary bicycle spaces.', wantedDish:'orbit oatcakes', thanks:'“Lovely! I have time for a very small orbit before tea.”'},
  {id:'fern', name:'Fern', kind:'teacup-sprite', greeting:'A teacup-sprite arrives wearing a saucer as a hat. “It keeps the thoughts in.”', wantedDish:'whisper waffles', thanks:'“Thank you! I shall tell my hat all about it.”'},
  {id:'nib', name:'Nib', kind:'star-sprite', greeting:'A star-sprite peers over the counter. “I usually order by constellation.”', wantedDish:'starlight spirals', thanks:'“A lovely plate. A small imaginary constellation, all to myself.”'},
  {id:'clover', name:'Clover', kind:'bunny', greeting:'A bunny hops onto a cushion. “A table for me and my ears, please.”', wantedDish:'carrot-cloud pancakes', thanks:'“Hop, hop, hooray! That was a very good pretend picnic.”'},
  {id:'ember', name:'Ember', kind:'pocket-dragon', greeting:'A little dragon folds her wings beside the counter. “Only the waffles should be crispy.”', wantedDish:'volcano waffles', thanks:'“Delicious! That deserves a very small victory puff.”'},
  {id:'purl', name:'Purl', kind:'kitten', greeting:'A gray kitten peeks over the counter. “A table for me and my invisible ball of yarn, please.”', wantedDish:'moonbeam macaroni', thanks:'“Purr-fect! My invisible yarn would like the recipe.”'},
  {id:'biscuit', name:'Biscuit', kind:'kitten', greeting:'A ginger kitten settles on a cushion and starts kneading. “I am helping with the pretend dough.”', wantedDish:'tumbleweed dumplings', thanks:'“Mrrp! That was delicious. I shall leave a very tiny paw-print review.”'}
];

// All twelve pairs from two different axes: temperature, texture, and flavor.
export const wishes = [
  ['warm','crunchy'], ['warm','soft'], ['cold','crunchy'], ['cold','soft'],
  ['warm','sweet'], ['warm','tangy'], ['cold','sweet'], ['cold','tangy'],
  ['crunchy','sweet'], ['crunchy','tangy'], ['soft','sweet'], ['soft','tangy']
];
