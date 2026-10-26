// Original finite classroom model, adapted from the project's Desk Case 7.
// No external model, child data, or upstream lesson prose is used here.
const rotate = (xs, serial) => {
  const n = serial % xs.length;
  return [...xs.slice(n), ...xs.slice(0, n)];
};
const profile = (features = ['size', 'wrap'], dataset = 'baseline') => ({features, dataset});
const row = (id, size, wrap, road, town, hill) => ({id, size, wrap, road, town, hill});
const option = (id, label, reply) => ({id, label, reply});

export function createSorterSource(serial = 1) {
  if (!Number.isSafeInteger(serial) || serial < 1) return null;
  const original = profile();
  const extra = profile(['size', 'wrap'], 'augmented');
  const road = profile(['road']);
  const all = profile(['size', 'wrap', 'road']);
  const tasks = [];
  function choice(id, page, prompt, key, choices, feedback, hint, example, p = original, batch = 'test') {
    tasks.push({id, page, kind:'choice', prompt, key,
      profile:structuredClone(p), batch, denominator:null, feedback, hint, example,
      choices:rotate(choices, serial + tasks.length)});
  }
  function number(id, page, prompt, key, denominator, feedback, hint, example, p = original, batch = 'test') {
    tasks.push({id, page, kind:'integer', prompt, key:String(key), denominator,
      profile:structuredClone(p), batch, feedback, hint, example, choices:[]});
  }
  const traceHint = 'Use only the selected features. Add the counts of ALL matching example rows, even when their roads differ. Which destination has the larger count?';
  const traceExample = 'Different example: with size and wrap selected, a small blue parcel matches 10 Town examples and 0 Hill examples. It goes to Town. A road printed on its label is ignored by this setting.';
  const countHint = 'Count actual parcels, not table rows. First decide where the original card routes them. Then count how many really belonged in that basket.';
  const countExample = 'Different batch: 20 letters contain 18 for Town and 2 for farms. Sending all 20 to Town gets 18/20 right overall (90%), 18/18 Town right and 0/2 farm letters right.';
  const fixHint = 'Use the profile named in THIS question. Find all exact matches. If none carry any examples, use the whole example corpus. Count correctly routed parcels separately for each destination.';
  const fixExample = 'A different setting: wrap only pools the baseline brown examples into 20 Town and 4 Hill; blue has 16 Town and 0 Hill. Both wrapping groups route to Town. Adding a feature can split a group into smaller groups.';
  choice('1a', 0, 'Original card: size and wrap only, last year’s examples. Where does it send a small brown parcel?', 'town', [
    option('town', 'Town', 'It pools both roads: 12 Town examples and 4 Hill examples. The majority is Town.'),
    option('hill', 'Hill farms', 'You may have read the road yourself. This card ignores road: its small brown vote is 12 Town against 4 Hill.'),
    option('none', 'No majority', 'The vote is not tied. Twelve is greater than four, so this model routes to Town.')
  ], 'The original card uses size and wrap: small brown has 12 Town and 4 Hill examples, so Town wins.', traceHint, traceExample);
  choice('1b', 0, 'Original card: where does a large brown parcel with a hill-track label go?', 'town', [
    option('hill', 'Hill farms', 'We can read its hill-track label, but this setting cannot use road. The matching examples are 8 Town and 0 Hill.'),
    option('none', 'No majority', 'There ARE matching large brown examples when road is ignored. Their vote is 8 Town against 0 Hill.'),
    option('town', 'Town', 'Yes. Eight large brown examples went to Town, and none went to Hill. The parcel is misrouted despite its hill-track label.')
  ], 'It goes to Town, although the label calls for Hill farms. The selected features ignore that difference.', traceHint, traceExample);
  choice('1c', 0, 'Could the original size-and-wrap card route any of these parcel kinds to Hill farms?', 'no', [
    option('yes', 'Yes, any parcel with a hill-track label.', 'That uses a feature the original card ignores. Each size/wrap combination has more Town examples.'),
    option('unknown', 'We cannot check any of the combinations.', 'We can check all four supplied size/wrap combinations in the example table.'),
    option('no', 'No, every supplied size/wrap group votes Town.', 'Yes. Small brown votes 12 to 4; small blue 10 to 0; large brown 8 to 0; large blue 6 to 0.')
  ], 'All four supplied size/wrap combinations vote Town. This is about these feature values and examples, not every possible machine.', traceHint, traceExample);
  choice('1d', 0, 'Bramble says, “A funnel must be broken.” What do these traces show?', 'design', [
    option('funnel', 'The errors prove a brass funnel is faulty.', 'The traced outputs follow every instruction. We have no evidence of a faulty funnel.'),
    option('design', 'It follows its card, but the design fails Hill deliveries.', 'Yes. Following a procedure correctly does not mean that procedure meets the post office’s needs.'),
    option('fine', 'Following the card means the service needs no changes.', 'The service still sends every Hill parcel to the wrong basket. Correct execution is not enough.')
  ], 'People chose this procedure, its features and examples. Those choices can need changing even when the machine follows them exactly.', traceHint, traceExample);
  number('2a', 1, 'Original card, this week’s 40 parcels: how many reach the correct basket overall?', 30, 40,
    '30 out of 40 are correct overall: all 30 Town parcels, but none of the 10 Hill parcels. That is 75%.', countHint, countExample);
  number('2a-percent', 1, 'Original card, this week: 30 correct out of 40. What percentage is correct overall? Enter the number without %.', 75, 40,
    '30/40 = 3/4 = 75%. Percent means out of 100. This is the share correct in this supplied batch, not a guarantee about another batch.', 'Thirty out of forty is three quarters. Think of each quarter as 25 out of 100.', countExample);
  number('2b-town', 1, 'Original card, this week: of the 30 parcels actually for Town, how many are correct?', 30, 30,
    'Town: 30 correct out of 30, or 100%. The denominator is Town parcels, not the whole batch.', countHint, countExample);
  number('2b-hill', 1, 'Original card, this week: of the 10 parcels actually for Hill farms, how many are correct?', 0, 10,
    'Hill farms: 0 correct out of 10, or 0%. The overall 75% hides a destination receiving no correct deliveries.', countHint, countExample);
  number('2c', 1, 'Original card on LAST YEAR’S 40 example parcels: how many would it sort correctly?', 36, 40,
    'On last year’s examples it sends everything to Town: 36 of 40 are correct, or 90%. All four Hill parcels are still wrong.', 'Use the last-year table, not this week’s table. Which destination has 36 parcels in that table?', countExample, original, 'training');
  number('2c-percent', 1, 'Original card on LAST YEAR’S examples: 36 of 40 are correct. What percentage is that? Enter the number without %.', 90, 40,
    '36/40 = 9/10 = 90%. A high overall share can still hide complete failure for a smaller destination.', 'Reduce 36/40 to 9/10. Nine tenths is how many hundredths?', countExample, original, 'training');
  choice('2d', 1, 'The postmaster says, “75% is mostly helping.” Which reply uses the destination counts?', 'groups', [
    option('fine', 'Three quarters overall is enough; no more checks are needed.', 'That ignores the ten Hill parcels, all misrouted.'),
    option('groups', 'Town gets all its parcels right; Hill gets every one wrong.', 'Yes. Compare 30/30 Town with 0/10 Hill, as well as 30/40 overall.'),
    option('no-info', 'No useful conclusion can be drawn from these parcels.', 'We can conclude what happened to this supplied batch, while leaving future performance unknown.')
  ], 'An overall result cannot stand in for every group’s experience. The supplied counts show a complete Hill delivery failure.', countHint, countExample);
  number('3a', 2, 'Last year’s 40 examples: how many were for Hill farms?', 4, 40,
    'Only 4 of the 40 examples were for Hill farms: 1/10, or 10%. Rarity alone does not explain every error; the selected features also matter.', 'Read the Hill column of the last-year examples and add its counts.', 'Different example: 2 green cards in a set of 20 make 2/20 = 1/10 = 10%.', original, 'training');
  number('3a-percent', 2, 'Last year’s examples: 4 of 40 were for Hill farms. What percentage is that? Enter the number without %.', 10, 40,
    '4/40 = 1/10 = 10%. The same four Hill examples can support perfect routing on this supplied batch when road alone is selected.', 'Four out of forty is one out of ten. Express one tenth as a share out of 100.', 'Different example: 2 of 20 cards is 1/10, or 10%.', original, 'training');
  choice('3b', 2, 'Which feature distinguishes the actual destinations throughout these supplied tables?', 'road', [
    option('size', 'Parcel size', 'This week has large parcels for both Town and Hill, so size cannot distinguish them.'),
    option('wrap', 'Wrapping colour', 'Brown parcels go to both destinations. Wrap cannot distinguish those parcels.'),
    option('road', 'The road on the label', 'Yes. In these invented tables, valley road corresponds to Town and hill track to Hill farms. This does not cover every possible future label.')
  ], 'Road distinguishes these destinations in the supplied data. A human chose whether the model could use that feature.',
    'Compare the actual destinations in the tables. Does the same size or wrapping occur at both places? Which feature separates them here?',
    'Different labelled set: if both a red packet and a blue packet are for the same street, colour alone does not tell a sorter which street to use. Look for the feature that distinguishes the actual destinations.');
  for (const [id, prompt, key, denominator, feedback, p] of [
    ['4a-hill', 'More examples profile: size+wrap, plus ten Hill examples. Of this week’s 10 Hill parcels, how many are correct?', 0, 10, 'Hill: 0/10. Small brown still votes 12 Town to 8 Hill; large brown votes 8 Town to 6 Hill.', extra],
    ['4a-overall', 'More examples profile: size+wrap, plus ten Hill examples. How many of this week’s 40 parcels are correct overall?', 30, 40, 'Overall: 30/40, or 75%. Adding these examples does not fix the ignored-road problem.', extra],
    ['4b-overall', 'Road-only profile, last year’s examples: how many of this week’s 40 parcels are correct overall?', 40, 40, 'Overall: 40/40 on this supplied batch. Valley examples vote Town; hill-track examples vote Hill. Another batch is not tested here.', road],
    ['4b-hill', 'Road-only profile, last year’s examples: how many of this week’s 10 Hill parcels are correct?', 10, 10, 'Hill: 10/10 on this supplied batch. The four baseline Hill examples suffice when road is the only feature selected.', road],
    ['4c-overall', 'All-features profile, last year’s examples: how many of this week’s 40 parcels are correct overall?', 34, 40, 'Overall: 34/40, or 85%. The six large Hill parcels have no exact example match, so the whole-corpus fallback routes them to Town.', all],
    ['4c-hill', 'All-features profile, last year’s examples: how many of this week’s 10 Hill parcels are correct?', 4, 10, 'Hill: 4/10, or 40%. The four small Hill parcels match examples; the six large Hill parcels fall back to Town.', all]
  ]) number(id, 3, prompt, key, denominator, feedback, fixHint, fixExample, p);
  choice('4d', 3, 'Why does baseline all-features do worse here than baseline road-only?', 'fallback', [
    option('always', 'Adding features always makes models worse.', 'Not always. In this corpus, adding size splits Hill parcels into a supported small group and an unsupported large group.'),
    option('broken', 'The road value breaks when size is selected.', 'The road value has not changed. Exact matching now requires size too.'),
    option('fallback', 'No large Hill example matches all features, so fallback votes Town.', 'Yes. More detailed matching can create an empty matching group.')
  ], 'All-features requires a large, brown, hill-track example. None exists in baseline, so its fallback uses the whole corpus’s Town majority.', fixHint, fixExample, all);
  choice('4e', 3, 'Why did adding the ten Hill examples fail with size and wrap selected?', 'ignored', [
    option('ignored', 'It still cannot distinguish the different roads.', 'Yes. More examples do not reveal an ignored feature; the Town votes still win each pooled group.'),
    option('never', 'More examples can never help a model.', 'They can help here: adding the large Hill examples fixes the all-features profile on this supplied batch.'),
    option('enough', 'Just add enough Hill examples and every destination must improve.', 'More Hill examples could tip a pooled group, but then Town parcels with the same size/wrap would be sent to Hill. The selected features cannot separate them.')
  ], 'Size and wrap pool parcels with different destinations. Adding examples can change a vote without making that view able to distinguish the roads.', fixHint, fixExample, extra);

  const part = (id, title, texts) => ({id, title, options:texts.map((text, i) => ({id:`${id}-${i}`, text}))});
  return {
    id:`borrowed-sorter-${serial}`, version:1, mode:'exact-majority-v1',
    title:`The Borrowed Sorting Machine · visit ${serial}`,
    story:'A wooden sorter with brass funnels arrives from Les Saules. Léon says it is fast. The Hill farmers say their parcels keep arriving in Town. One visitor has brought a goat. The postmaster asks you to investigate before writing back.',
    features:[
      {id:'size',label:'Size',values:[{id:'small',label:'Small'},{id:'large',label:'Large'}]},
      {id:'wrap',label:'Wrap',values:[{id:'brown',label:'Brown'},{id:'blue',label:'Blue'}]},
      {id:'road',label:'Road on the label',values:[{id:'valley',label:'Valley road'},{id:'hill',label:'Hill track'}]}
    ],
    destinations:[{id:'town',label:'Town'},{id:'hill',label:'Hill farms'}],
    tables:{
      baseline:[row('old-small-brown-valley','small','brown','valley',12,0),row('old-small-blue-valley','small','blue','valley',10,0),row('old-large-brown-valley','large','brown','valley',8,0),row('old-large-blue-valley','large','blue','valley',6,0),row('old-small-brown-hill','small','brown','hill',0,4)],
      extra:[row('added-small-brown-hill','small','brown','hill',0,4),row('added-large-brown-hill','large','brown','hill',0,6)],
      test:[row('week-small-brown-valley','small','brown','valley',9,0),row('week-small-blue-valley','small','blue','valley',8,0),row('week-large-brown-valley','large','brown','valley',7,0),row('week-large-blue-valley','large','blue','valley',6,0),row('week-small-brown-hill','small','brown','hill',0,4),row('week-large-brown-hill','large','brown','hill',0,6)]
    },
    initialProfile:original,
    instructions:[
      'Read only the selected features of the new parcel.',
      'Find every example with exactly the same selected feature values. Counts tell how many parcels each row represents.',
      'Add the Town and Hill counts of those matching examples. Route to the destination with the larger count.',
      'If no matching examples carry any parcels, use the counts in the whole selected example corpus instead.',
      'If the vote is tied, report No majority in this model. Do not choose a basket.'
    ],
    pages:[
      {title:'Follow the card',teaching:[
        'A feature is something the model is allowed to look at. An example pairs feature values with the destination where those parcels were correctly delivered.',
        'People wrote this exact-match-majority procedure and chose its features, examples, labels and fallback. This screen is a simple lookup simulation, not a live AI.',
        'Following a card correctly can still give the post office a poor service. Reading the actual address yourself is different from tracing what the card permits.'
      ],example:traceExample},
      {title:'Right for whom?',teaching:[
        'Accuracy here means correctly routed parcels out of all parcels tried. Count parcels, not table rows.',
        'Compare the whole batch and each actual destination. Each group needs its own denominator.',
        'Percent means out of 100. Counts come first: 30/40 is three quarters, equivalent to 75/100 or 75%. A batch count is not a promise of future performance.'
      ],example:countExample},
      {title:'What did it look at?',teaching:[
        'Inspect both the examples and what the selected features allow the model to distinguish. Its procedure and where it is used matter too.',
        'A rare destination is not automatically doomed: road-only can use the same four Hill examples. Ignoring road pools different destinations into one vote.',
        'A missing large Hill example explains a fallback under all-features. Under the original size/wrap card, even small Hill parcels with examples are outvoted.'
      ],example:'Different view: if a model sees only wrapping, a brown Town parcel and a brown Hill parcel look identical to it. No amount of looking at the same wrapping alone reveals the road.'},
      {title:'Try a change',teaching:[
        'Change features or the fixed example set, then run the same supplied batch. Keep earlier results to compare the effects.',
        'More features can make an exact-match group empty. More examples can change votes, but cannot reveal a feature that was left out.',
        'These repeated results help develop this model. They do not test unseen parcels. The augmented set even adds ten parcels from the same supplied test batch.'
      ],example:fixExample},
      {title:'Advise the postmaster',teaching:[
        'A recommendation can name a plan, its evidence, an objection and how people will check the service.',
        'Write your own words or choose supplied words. An unfinished letter is worth keeping. None of this open writing is graded.',
        'People setting up and using the sorter should check it before use and monitor mistakes. A way for recipients to report errors is additional support, not a transfer of that duty.'
      ],example:'A different service plan might say: “Try this on a small supplied batch, have a person check unfamiliar labels, and record mistakes separately by destination.” That still needs evidence in its actual setting.'}
    ],
    tasks,
    discussions:[
      {id:'causes',page:2,prompt:'Which explanation would you investigate? These are discussion starters, not marked answers.',options:[
        option('ignored-road','It was not told to look at road.','That matters in the original card: Town and Hill parcels with the same size/wrap are pooled into one vote.'),
        option('rare-hill','Hill examples were rare.','They are outvoted in the original size/wrap groups. Rarity alone is not enough to explain failure: road-only succeeds on this supplied batch with the same four Hill examples.'),
        option('missing-large','It had never seen a large Hill parcel.','That becomes decisive with all features selected: large Hill has no exact match and falls back to Town. It does not explain why familiar SMALL Hill parcels fail under size/wrap.'),
        option('labels','Perhaps the farmers wrote bad labels.','The supplied labels clearly say hill track. The original card ignores that feature. Nothing here blames the label writers.')
      ]},
      {id:'responsibility',page:2,prompt:'Who should help notice errors? Talk about the different responsibilities.',options:[
        option('setup','People choosing the procedure and examples.','They should test the design against the service’s needs, including each destination. Correctly recorded examples are only part of that responsibility.'),
        option('deploy','People deciding to use it in the post office.','They should test it in its intended setting and monitor mistakes by destination, rather than rely only on a borrowed overall score.'),
        option('recipients','Give recipients a way to report problems.','A report route helps, but the farmers should not have to walk down with a goat before anyone checks. Setup and deployment teams still have the checking duty.')
      ]}
    ],
    parts:[
      part('plan','What should the post office do?',[
        'Use road-only for these supplied parcels, with a person checking unfamiliar labels before delivery.',
        'Have a person check every Hill-track parcel while the post office investigates the sorter.',
        'Return the borrowed machine and sort by hand for now.'
      ]),
      part('reason','Your strongest reason',[
        'The original card got 30/40 right overall but 0/10 right for Hill farms.',
        'Road-only got all 40 supplied parcels right. That does not establish how it will handle new labels.',
        'A person can read the road directly; the post office should compare the work and errors each approach creates.'
      ]),
      part('objection','An objection and your response',[
        'What about a new road? Its examples may have no match. A person should check unfamiliar labels instead of trusting this model’s Town fallback.',
        'The machine may save time. Compare that saving with the checking and correction work, including the work placed on recipients.',
        'Could we change the card instead of returning it? We could test a changed design, while keeping human sorting until there is enough evidence for its intended use.'
      ]),
      part('monitor','Who checks, and how?',[
        'Before using the design in a new place, the post office should test appropriate examples from that setting and inspect errors by destination.',
        'The post office should keep destination-specific mistake counts and review them regularly, with a clear way for recipients to report errors.',
        'Assign a person to inspect unfamiliar labels and record misroutes, rather than treating a high overall score as a guarantee.'
      ])
    ],
    presets:[
      {id:'original',label:'Original card',...structuredClone(original)},
      {id:'more-examples',label:'More examples',...structuredClone(extra)},
      {id:'road-only',label:'Road only',...structuredClone(road)},
      {id:'all-features',label:'All features',...structuredClone(all)}
    ],
    labels:{
      testBatch:'This week’s supplied parcels',trainingBatch:'Last year’s example parcels',
      augmentedBatch:'Last year plus this week’s ten Hill examples, once',
      extraBatch:'The ten extra Hill examples, added once',
      modelBoundary:'Invented postal data · one exact-match lookup model, not live AI',
      development:'Results on the same supplied batch are development checks. They do not establish performance on unseen parcels or comprehensive fairness.',
      augmentedWarning:'This model’s examples include ten Hill parcels taken from this same supplied batch. This is not an independent test.',
      noMajority:'No majority in this model',noParcels:'No parcels in this group',
      closing:'The postmaster reads your page. “We need to check what it does, for each destination, and keep asking when the setting changes. I’ll write to Léon. First I’ll help our visitor find somewhere comfortable for the goat.” You can keep experimenting and revise this advice.',
      traceSupport:'A supplied trace was opened. It shows the model’s calculation; it does not show an independent calculation by the explorer.',
      runSupport:'A supplied model run was opened. Its counts are computer-model results, not independent performance evidence.',
      practice:'Supported practice with the supplied tables. Open writing and discussion are ungraded.'
    }
  };
}
