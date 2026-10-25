// Original invented prices. No upstream lesson prose or learner information.
export const priceCards=[
 {id:'bag',title:'Bag and journey',m:2,b:3,target:11,comparison:{title:'Journey only',m:2,b:0,explanation:'Both lines rise 2 coins for each extra kilometer. The bag-and-journey total stays 3 coins higher. Only the journey-only line goes through (0, 0): its total is proportional to distance.'}},
 {id:'journey',title:'Journey only',m:2,b:0,target:10,comparison:{title:'Bag and journey',m:2,b:3,explanation:'Both lines have slope 2. This card starts at 0, so its total is proportional to distance. The other card starts at 3 and stays 3 coins higher.'}},
 {id:'express',title:'A different price',m:3,b:2,target:11,carryDistance:4,comparison:{title:'Bag and journey',m:2,b:3,explanation:'A steeper line does not always have the greater total. This card costs less at 0 kilometers, ties the other card at 1 kilometer (5 coins), then costs more from 2 kilometers onward.'}}
];
export const pricePages=['Try the price','Name the rule','Use it backwards','Compare and keep'];
