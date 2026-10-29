// Original labels; the practice sequence is the bounded source commissioned in116/281.
export const WEATHER_CATEGORIES=Object.freeze([
 {code:'sun',label:'Sunny'}, {code:'clouds',label:'Cloudy'}, {code:'rain',label:'Rainy'},
 {code:'wind',label:'Windy'}, {code:'snow',label:'Snowy'}
].map(Object.freeze));
export const PRACTICE_WEATHER_DAYS=Object.freeze([
 'sun','sun','clouds','rain','rain','clouds','sun','wind','sun','clouds',
 'rain','sun','sun','clouds','clouds','rain','sun','snow','clouds','sun',
 'rain','rain','clouds','sun','wind','sun','clouds','rain','sun','clouds'
]);
export const weatherCategory=code=>WEATHER_CATEGORIES.find(c=>c.code===code)||null;
