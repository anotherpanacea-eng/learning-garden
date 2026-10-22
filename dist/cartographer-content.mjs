// Original schematic map props; coordinates describe intersections, not covered cells.
export const pages=['map','route','compare'];
export const marks=[
 {id:'post',name:'Post Office',symbol:'P'},
 {id:'cafe',name:'Café',symbol:'C'},
 {id:'garden',name:'Garden',symbol:'G'},
 {id:'bridge',name:'Bridge',symbol:'B'}
];
export const directions=[
 {id:'n',label:'North / up',dx:0,dy:1},
 {id:'e',label:'East / right',dx:1,dy:0},
 {id:'s',label:'South / down',dx:0,dy:-1},
 {id:'w',label:'West / left',dx:-1,dy:0}
];
