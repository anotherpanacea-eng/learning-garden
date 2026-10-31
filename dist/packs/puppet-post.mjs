// Original imaginary Paris story. All names and events are fictional.
export const puppetPostPack = {
  id:'puppet-post',version:1,title:'The rooftop puppet post',
  stories:[{
    id:'puppet-post',destination:'rooftops',title:'A puppet show above the pots',
    invitation:'A sock puppet has lost its rain, and a snail has a front-row flowerpot. Help Lucie get the rooftop show ready.',
    passages:{
      1:['First, Lucie lifts the puppet stage onto a crate.','Next, Dot pulls open the curtain beside the stage.','Last, Pip rings a little brass bell.','A snail in Paris waves its tiny hat.'],
      2:['The rooftop garden in Paris is ready for a puppet show.','First, Lucie lifts the puppet stage onto a crate.','Next, Dot pulls open the curtain beside the stage.','Last, Pip rings a little brass bell.','A snail waves its tiny hat from a flowerpot.','Behind the curtain, a sock puppet pretends to be a cloud.'],
      3:['The rooftop garden in Paris is ready for a puppet show about a cloud that has lost its rain.','A snail waits beside a flowerpot with a tiny hat in its lap.','First, Lucie lifts the puppet stage onto a crate.','Next, Dot pulls open the curtain beside the stage.','Last, Pip rings a little brass bell.','Behind the curtain, a sock puppet peeks out and asks whether anyone has borrowed a puddle.','The snail waves its hat and points to a teacup.']
    },
    questions:[
      {type:'mc',title:'A higher stage',readingSkill:'Find a sentence that supports an idea',prompt:'Which sentence shows the stage being raised?',choices:['Next, Dot pulls open the curtain beside the stage.','First, Lucie lifts the puppet stage onto a crate.','Last, Pip rings a little brass bell.'],answer:1,hint:'Look for what Lucie puts under the stage.',explanation:'Lifting the stage onto a crate makes it stand higher. Opening the curtain and ringing the bell are different actions.',talk:'Which words show that the stage changes height?',helper:'puppet-evidence'},
      {type:'order',title:'Get the puppet show ready',readingSkill:'Sequence events using order words',prompt:'Put these three actions in the order they happen in the passage.',items:['Lucie puts the stage on a crate','Dot opens the curtain','Pip rings a bell'],hint:'Find First, Next and Last. Match an action to each word.',explanation:'First Lucie puts the stage on a crate. Next Dot opens the curtain. Last Pip rings a bell.',talk:'Which order word helped you choose the middle action?',helper:'puppet-sequence'}
    ],
    connections:[{topicId:'mt_VEwM7ClYYE',label:'Sequence events',scope:'Only arranging three explicitly ordered events is practiced here. Central message, full retelling and reading fluency remain unobserved; this is no mastery claim.'}]
  }],
  helpers:{
    'puppet-evidence':{id:'paris-pack-help-puppet-evidence',title:'Find the change',lesson:'Look for the sentence that directly shows the change in the question.',passage:'A toy boat sits low in a bowl. Bea slides a block under the boat to lift it higher. A bird sings outside.',model:{type:'text',segments:['A toy boat sits low in a bowl.','Bea slides a block under the boat to lift it higher.','A bird sings outside.'],focus:1,clue:'The block under the boat lifts it higher.'},kind:'choice',prompt:'Which sentence shows Bea lifting the boat higher?',choices:['A bird sings outside.','Bea slides a block under the boat to lift it higher.'],answer:1,explanation:'Sliding the block under the boat directly shows the action that lifts it.'},
    'puppet-sequence':{id:'paris-pack-help-puppet-sequence',title:'Three little actions',lesson:'Order words tell us which action comes first, next and last.',passage:'First, Suki takes a cup. Next, Suki pours water into it. Last, Suki adds a flower.',model:{type:'text',segments:['First, Suki takes a cup.','Next, Suki pours water into it.','Last, Suki adds a flower.'],focus:1,clue:'Next marks the middle action: pouring water.'},kind:'choice',prompt:'Which action happens after taking the cup but before adding the flower?',choices:['Pour water into the cup','Take the cup'],answer:0,explanation:'Next marks pouring the water, between taking the cup and adding the flower.'}
  }
};
