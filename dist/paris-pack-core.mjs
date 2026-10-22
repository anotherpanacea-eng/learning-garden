// Plain-data story-pack compiler. Importing a pack is trusted local authoring, not an upload API.
export const ORDER_PERMUTATIONS = Object.freeze([
  [0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]
].map(x=>Object.freeze(x)));
// A stable starting layout per task that is never already in story order, so the tap pattern differs between stories.
export function displayOrderFor(key){
  let h=0;for(const c of String(key))h=(h*31+c.charCodeAt(0))>>>0;
  return [...ORDER_PERMUTATIONS[1+h%5]];
}

export function cleanOrder(value){
  return Array.isArray(value)&&value.length<=3&&Array.from(value).every(x=>Number.isInteger(x)&&x>=0&&x<3)&&new Set(value).size===value.length?[...value]:[];
}
export function orderValue(value){
  const order=cleanOrder(value);
  if(order.length!==3)return null;
  return ORDER_PERMUTATIONS.findIndex(p=>p.every((n,i)=>n===order[i]));
}

const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const fail=(path,message)=>{throw new Error(`${path}: ${message}`);};
const string=(value,path)=>{if(typeof value!=='string'||!value.trim())fail(path,'expected a non-empty string');};
const id=(value,path)=>{string(value,path);if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value))fail(path,'expected a lowercase hyphenated ID');};
const fields=(value,allowed,path)=>{if(!plain(value))fail(path,'expected a plain object');for(const key of Object.keys(value))if(!allowed.includes(key))fail(`${path}.${key}`,'unknown or reserved field');};

// Adapted from Jane publish-lessons.mjs, strs (MIT), revision
// 0d40eb8ee86f88a63a17391e361bdd8d9c9014e4. License: jane-license.txt (distributed with the browser assets).
function strings(value,path,min,max){
  if(!Array.isArray(value)||value.length<min||value.length>max||!Array.from(value).every(x=>typeof x==='string'&&x.trim()))fail(path,`expected ${min}-${max} non-empty strings`);
  if(new Set(value.map(x=>x.trim())).size!==value.length)fail(path,'items must be unique');
}

function helper(value,path){
  fields(value,['id','title','lesson','passage','model','kind','prompt','choices','answer','explanation'],path);
  id(value.id,`${path}.id`);
  for(const key of ['title','lesson','passage','prompt','explanation'])string(value[key],`${path}.${key}`);
  if(value.kind!=='choice')fail(`${path}.kind`,'expected choice');
  strings(value.choices,`${path}.choices`,2,3);
  if(!Number.isInteger(value.answer)||value.answer<0||value.answer>=value.choices.length)fail(`${path}.answer`,'expected an in-range integer');
  fields(value.model,['type','segments','focus','clue'],`${path}.model`);
  if(value.model.type!=='text')fail(`${path}.model.type`,'expected text');
  strings(value.model.segments,`${path}.model.segments`,1,12);
  if(!Number.isInteger(value.model.focus)||value.model.focus<0||value.model.focus>=value.model.segments.length)fail(`${path}.model.focus`,'expected an in-range integer');
  string(value.model.clue,`${path}.model.clue`);
  return {...value,choices:[...value.choices],model:{...value.model,segments:[...value.model.segments]}};
}

export function compileParisPacks(packs,{stories=[],nodes={},helpers={}}={}){
  if(!Array.isArray(packs))fail('packs','expected an array');
  if(!Array.isArray(stories)||!plain(nodes)||!plain(helpers))fail('base','expected stories array and node/helper objects');
  const result={stories:[...stories],nodes:{...nodes},helpers:{...helpers}};
  const packIds=new Set(),storyIds=new Set(stories.map(x=>x.id)),helperKeys=new Set(Object.keys(helpers));
  const helperIds=new Set(Object.values(helpers).map(x=>x.id));
  const passageIds=new Set(Object.values(nodes).map(x=>x.passageId).filter(Boolean));
  Array.from(packs).forEach((pack,pi)=>{
    const p=`packs[${pi}]`;
    fields(pack,['id','version','title','stories','helpers'],p);id(pack.id,`${p}.id`);string(pack.title,`${p}.title`);
    if(packIds.has(pack.id))fail(`${p}.id`,'duplicate pack ID');packIds.add(pack.id);
    if(pack.version!==1)fail(`${p}.version`,'expected version 1');
    if(!Array.isArray(pack.stories)||!pack.stories.length)fail(`${p}.stories`,'expected at least one story');
    if(!plain(pack.helpers))fail(`${p}.helpers`,'expected a helper object');
    const localHelpers={};
    for(const [key,value] of Object.entries(pack.helpers)){
      const hp=`${p}.helpers.${key}`;id(key,hp);
      if(helperKeys.has(key))fail(hp,'helper key collides with an existing key');
      const checked=helper(value,hp);
      if(helperIds.has(checked.id))fail(`${hp}.id`,'helper ID collides with an existing helper');
      helperKeys.add(key);helperIds.add(checked.id);localHelpers[key]=checked;
    }
    Array.from(pack.stories).forEach((story,si)=>{
      const s=`${p}.stories[${si}]`;
      fields(story,['id','destination','title','invitation','passages','questions','connections'],s);id(story.id,`${s}.id`);string(story.title,`${s}.title`);
      if(story.invitation!==undefined)string(story.invitation,`${s}.invitation`);
      if(storyIds.has(story.id))fail(`${s}.id`,'story ID collides with an existing story');storyIds.add(story.id);
      if(!['bookstall','river','rooftops'].includes(story.destination))fail(`${s}.destination`,'unknown Paris destination');
      fields(story.passages,['1','2','3'],`${s}.passages`);
      for(const variant of [1,2,3])strings(story.passages[variant],`${s}.passages.${variant}`,1,20);
      if(!Array.isArray(story.questions)||story.questions.length!==2)fail(`${s}.questions`,'expected two questions');
      const questions=Array.from(story.questions).map((q,qi)=>{
        const path=`${s}.questions[${qi}]`;
        fields(q,['type','title','readingSkill','prompt','hint','explanation','talk','helper',...(q?.type==='order'?['items']:['choices','answer'])],path);
        for(const key of ['title','readingSkill','prompt','hint','explanation','talk','helper'])string(q[key],`${path}.${key}`);
        if(!Object.hasOwn(localHelpers,q.helper))fail(`${path}.helper`,'unknown helper key in this pack');
        const selected={title:q.title,readingSkill:q.readingSkill,prompt:q.prompt,hint:q.hint,explanation:q.explanation,talk:q.talk};
        if(q.type==='order'){
          strings(q.items,`${path}.items`,3,3);
          Object.assign(selected,{kind:'order',orderItems:[...q.items],displayOrder:displayOrderFor(`${pack.id}:${path}`),choices:ORDER_PERMUTATIONS.map(order=>order.map(i=>q.items[i]).join(' → ')),answer:0});
        }else if(q.type==='mc'){
          strings(q.choices,`${path}.choices`,2,4);
          if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.choices.length)fail(`${path}.answer`,'expected an in-range integer');
          Object.assign(selected,{kind:'choice',choices:[...q.choices],answer:q.answer});
        }else fail(`${path}.type`,'expected mc or order');
        return {fields:selected,helper:localHelpers[q.helper]};
      });
      if(!Array.isArray(story.connections))fail(`${s}.connections`,'expected an array (which may be empty)');
      const topicIds=new Set();
      const connections=Array.from(story.connections).map((connection,ci)=>{
        const path=`${s}.connections[${ci}]`;fields(connection,['topicId','label','scope'],path);
        for(const key of ['topicId','label','scope'])string(connection[key],`${path}.${key}`);
        if(!/^mt_[A-Za-z0-9_-]+$/.test(connection.topicId))fail(`${path}.topicId`,'expected a Marble topic ID');
        if(topicIds.has(connection.topicId))fail(`${path}.topicId`,'duplicate topic reference');topicIds.add(connection.topicId);
        return {...connection};
      });
      const variants={};
      for(const variant of [1,2,3]){
        const ids=[1,2].map(q=>`paris-explore-${story.id}-${variant}-${q}`);variants[variant]=ids;
        const passageId=`paris-explore-${story.id}-passage-${variant}`;
        if(passageIds.has(passageId))fail(`${s}.passages.${variant}`,`passage ID collides: ${passageId}`);passageIds.add(passageId);
        for(let qi=0;qi<2;qi++){
          const nodeId=ids[qi];
          if(Object.hasOwn(result.nodes,nodeId)||Object.hasOwn(result.helpers,nodeId))fail(`${s}.id`,`generated task ID collides: ${nodeId}`);
          const q=questions[qi];
          result.nodes[nodeId]={id:nodeId,entrance:'paris',type:'task',subject:'Reading',practiceOnly:true,packId:pack.id,
            parisDestination:story.destination,parisStory:story.id,parisVariant:variant,
            passageId,readingText:[...story.passages[variant]],
            body:qi===0?story.title:'The story is still here. Let’s look again.',
            guide:'{guide} says, “We can take our time and return to the words whenever we like.”',
            ...q.fields,next:qi===0?ids[1]:'paris-postcard'};
          result.helpers[nodeId]=q.helper;
        }
      }
      result.stories.push({id:story.id,destination:story.destination,title:story.title,...(story.invitation?{invitation:story.invitation}:{}),packId:pack.id,variants,connections});
    });
  });
  return result;
}
