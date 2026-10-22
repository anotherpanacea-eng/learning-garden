// Original schematic US-cent pack. No official coin artwork is reproduced.
export const coinTypes=[
 {id:'penny',name:'Penny',plural:'pennies',value:1,diameter:19.05,color:'#d9a17b'},
 {id:'nickel',name:'Nickel',plural:'nickels',value:5,diameter:21.21,color:'#d6ded9'},
 {id:'dime',name:'Dime',plural:'dimes',value:10,diameter:17.91,color:'#d6ded9'},
 {id:'quarter',name:'Quarter',plural:'quarters',value:25,diameter:24.26,color:'#d6ded9'},
];
export const pages=['coins','make','compare'];
export const requests=[
 {id:'ribbon',label:'Ribbon for a market sign',price:5},
 {id:'leaf-card',label:'A folded leaf card',price:6},
 {id:'paper-star',label:'A paper star for the stall',price:10},
 {id:'soup-label',label:'A label for a soup jar',price:12},
 {id:'seed-tag',label:'A seed-packet tag',price:15},
 {id:'puppet-string',label:'String for a puppet',price:18},
 {id:'story-program',label:'A little story program',price:20},
 {id:'paper-boat',label:'A paper boat for the window',price:25},
];
export const exchanges=[
 {id:'penny-nickel',label:'Five pennies → one nickel',from:{penny:5},to:{nickel:1}},
 {id:'nickel-pennies',label:'One nickel → five pennies',from:{nickel:1},to:{penny:5}},
 {id:'nickels-dime',label:'Two nickels → one dime',from:{nickel:2},to:{dime:1}},
 {id:'dime-nickels',label:'One dime → two nickels',from:{dime:1},to:{nickel:2}},
 {id:'dimes-quarter',label:'Two dimes + one nickel → one quarter',from:{dime:2,nickel:1},to:{quarter:1}},
 {id:'quarter-dimes',label:'One quarter → two dimes + one nickel',from:{quarter:1},to:{dime:2,nickel:1}},
];
