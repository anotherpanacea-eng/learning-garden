// Original paired-fiction packs, independently reviewed in spec59. No learner data.
export const windowPages=['read','compare','message'];
export const windowForms=[{id:'short',label:'Short passages'},{id:'long',label:'Longer passages'}];
export const windowRelations=[{id:'stated',label:'Directly said'},{id:'inferred',label:'Worked out from clues'},{id:'contradicted',label:'Text says otherwise'},{id:'unknown',label:'Not enough information'}];
const stories=[
 {
  "id": "baskets",
  "title": "Baskets under the roof",
  "focus": "One teller misses a reason",
  "accountsByForm": {
   "short": [
    {
     "id": "a",
     "name": "Dot",
     "lines": [
      {
       "id": "baskets-A1",
       "text": "At the market, I saw Pip carry the baskets away from the stall."
      },
      {
       "id": "baskets-A2",
       "text": "I stayed beside the stall."
      },
      {
       "id": "baskets-A3",
       "text": "I could not see under the Workshop roof."
      }
     ]
    },
    {
     "id": "b",
     "name": "Pip",
     "lines": [
      {
       "id": "baskets-B1",
       "text": "Wind pushed rain across the stall."
      },
      {
       "id": "baskets-B2",
       "text": "I moved the baskets under the Workshop roof."
      },
      {
       "id": "baskets-B3",
       "text": "I put a sign at the stall pointing to the Workshop."
      }
     ]
    }
   ],
   "long": [
    {
     "id": "a",
     "name": "Dot",
     "lines": [
      {
       "id": "baskets-A1",
       "text": "At the market, I saw Pip carry the baskets away from the stall."
      },
      {
       "id": "baskets-A2",
       "text": "I stayed beside the stall."
      },
      {
       "id": "baskets-A3",
       "text": "I could not see under the Workshop roof."
      },
      {
       "id": "baskets-A4",
       "text": "My scarf had a little knot at one end, and I kept turning it round and round."
      },
      {
       "id": "baskets-A5",
       "text": "On the stall board, someone had drawn an apple and a pear with a piece of green chalk."
      }
     ]
    },
    {
     "id": "b",
     "name": "Pip",
     "lines": [
      {
       "id": "baskets-B1",
       "text": "Wind pushed rain across the stall."
      },
      {
       "id": "baskets-B2",
       "text": "I moved the baskets under the Workshop roof."
      },
      {
       "id": "baskets-B3",
       "text": "I put a sign at the stall pointing to the Workshop."
      },
      {
       "id": "baskets-B4",
       "text": "My apron had a deep pocket, with a folded cloth inside and a button shaped like a leaf."
      },
      {
       "id": "baskets-B5",
       "text": "Nearby, a baker hummed a tune while a friend wrapped a loaf in plain brown paper."
      }
     ]
    }
   ]
  },
  "claims": [
   {
    "id": "baskets-stated",
    "text": "Pip moved the baskets under the Workshop roof.",
    "kind": "stated",
    "groups": [
     [
      "baskets-B2"
     ]
    ],
    "explanation": "Pip gives the destination directly. Dot's limited view does not conflict with Pip's account."
   },
   {
    "id": "baskets-inferred",
    "text": "Pip may have moved the baskets to shelter them from the rain.",
    "kind": "inferred",
    "groups": [
     [
      "baskets-B1",
      "baskets-B2"
     ]
    ],
    "explanation": "Rain at the stall and a move under a roof support this possible purpose. Pip does not state a purpose, so this is a plausible interpretation, not a known motive. The sign locates the Workshop but does not explain the move."
   },
   {
    "id": "baskets-contradicted",
    "text": "Dot could see under the Workshop roof from beside the stall.",
    "kind": "contradicted",
    "groups": [
     [
      "baskets-A3"
     ]
    ],
    "explanation": "Dot explicitly says that this view was unavailable. This is an explicit limit, not a conclusion drawn from something Dot leaves out."
   },
   {
    "id": "baskets-unknown",
    "text": "Pip moved exactly four baskets.",
    "kind": "unknown",
    "groups": [],
    "explanation": "Neither account gives the number of baskets. Several baskets could include four; it does not establish exactly four or show that four is false."
   }
  ],
  "reader": {
   "name": "Hedgehog",
   "knows": "a",
   "question": "Where should I look for the baskets now?",
   "original": "Pip carried the baskets away from the stall.",
   "cards": [
    {
     "id": "baskets-note-original",
     "text": "Pip carried the baskets away from the stall.",
     "fits": false,
     "feedback": "This matches Dot's account. Hedgehog still needs the destination to know where to look."
    },
    {
     "id": "baskets-note-roof",
     "text": "Look under the Workshop roof for the baskets.",
     "fits": true,
     "feedback": "This gives Hedgehog the place Pip names."
    },
    {
     "id": "baskets-note-sign",
     "text": "The baskets are under the Workshop roof. The sign at the stall points to the Workshop.",
     "fits": true,
     "feedback": "This names the destination and a sign Hedgehog can look for at the stall."
    },
    {
     "id": "baskets-note-cafe",
     "text": "Look inside the Café for the baskets.",
     "fits": false,
     "feedback": "The accounts do not place the baskets inside the Café. Use the destination Pip gives."
    }
   ]
  }
 },
 {
  "id": "flags",
  "title": "The bridge flags",
  "focus": "Two visits at different times",
  "accountsByForm": {
   "short": [
    {
     "id": "a",
     "name": "Kitten",
     "lines": [
      {
       "id": "flags-A1",
       "text": "At noon, before the market bell, I saw no flags on the bridge line."
      },
      {
       "id": "flags-A2",
       "text": "I left before the bell rang."
      },
      {
       "id": "flags-A3",
       "text": "I did not return to the bridge that market day."
      }
     ]
    },
    {
     "id": "b",
     "name": "Rabbit",
     "lines": [
      {
       "id": "flags-B1",
       "text": "After the market bell, I saw yellow flags on the bridge line."
      },
      {
       "id": "flags-B2",
       "text": "After the bell, I watched Dot tie another yellow flag onto the bridge line."
      },
      {
       "id": "flags-B3",
       "text": "I leaned on the rail to watch."
      }
     ]
    }
   ],
   "long": [
    {
     "id": "a",
     "name": "Kitten",
     "lines": [
      {
       "id": "flags-A1",
       "text": "At noon, before the market bell, I saw no flags on the bridge line."
      },
      {
       "id": "flags-A2",
       "text": "I left before the bell rang."
      },
      {
       "id": "flags-A3",
       "text": "I did not return to the bridge that market day."
      },
      {
       "id": "flags-A4",
       "text": "My market bag kept bumping my knee, so I shifted its handle into my other paw."
      },
      {
       "id": "flags-A5",
       "text": "As I walked, I made up a quiet tune about a boat with a very tall sail."
      }
     ]
    },
    {
     "id": "b",
     "name": "Rabbit",
     "lines": [
      {
       "id": "flags-B1",
       "text": "After the market bell, I saw yellow flags on the bridge line."
      },
      {
       "id": "flags-B2",
       "text": "After the bell, I watched Dot tie another yellow flag onto the bridge line."
      },
      {
       "id": "flags-B3",
       "text": "I leaned on the rail to watch."
      },
      {
       "id": "flags-B4",
       "text": "The wooden rail felt smooth under my paws, and the water below made a soft chuckling sound."
      },
      {
       "id": "flags-B5",
       "text": "My bag held a folded shopping list, with a small drawing of a loaf beside the words."
      }
     ]
    }
   ]
  },
  "claims": [
   {
    "id": "flags-stated",
    "text": "Rabbit saw a yellow flag on the bridge line after the bell.",
    "kind": "stated",
    "groups": [
     [
      "flags-B1"
     ],
     [
      "flags-B2"
     ]
    ],
    "explanation": "Either line directly places at least one yellow flag on the bridge line after the bell. A statement about flags supports the statement about a flag."
   },
   {
    "id": "flags-inferred",
    "text": "The bridge flag display changed between Kitten's visit and Rabbit's visit.",
    "kind": "inferred",
    "groups": [
     [
      "flags-A1",
      "flags-B1"
     ],
     [
      "flags-A1",
      "flags-B2"
     ]
    ],
    "explanation": "Kitten reports an empty line before the bell; Rabbit reports flags after it. The comparison is worked out by combining their details. Neither teller directly states this comparison. This is a strong conclusion from the accounts, not merely a possible guess. Either Rabbit line supplies the later flag evidence."
   },
   {
    "id": "flags-contradicted",
    "text": "Yellow flags were already on the bridge line when Kitten looked at noon.",
    "kind": "contradicted",
    "groups": [
     [
      "flags-A1"
     ]
    ],
    "explanation": "Kitten explicitly reports no flags on that line at noon. Rabbit's later flags do not change the earlier report."
   },
   {
    "id": "flags-unknown",
    "text": "Dot tied exactly eight flags onto the bridge line that day.",
    "kind": "unknown",
    "groups": [],
    "explanation": "Neither account gives a total. “Another” tells us there was more than one flag, not exactly how many Dot tied that day."
   }
  ],
  "reader": {
   "name": "Mole",
   "knows": "a",
   "question": "Who was at the bridge flag line after the bell, and what were they doing?",
   "original": "The bridge flag line was empty at noon.",
   "cards": [
    {
     "id": "flags-note-original",
     "text": "The bridge flag line was empty at noon.",
     "fits": false,
     "feedback": "This reports Kitten's earlier view correctly. Mole asks who was there and what they were doing after the bell."
    },
    {
     "id": "flags-note-dot",
     "text": "After the bell, Dot was tying a yellow flag onto the bridge line.",
     "fits": true,
     "feedback": "This answers both parts of Mole's question at the requested time."
    },
    {
     "id": "flags-note-rabbit",
     "text": "Rabbit watched Dot add a yellow flag to the bridge line after the bell.",
     "fits": true,
     "feedback": "This supplies the person and action, and tells Mole whose observation the message uses."
    },
    {
     "id": "flags-note-kitten",
     "text": "After the bell, Kitten was hanging yellow flags on the bridge line.",
     "fits": false,
     "feedback": "Kitten's account rules out this later visit. Rabbit describes Dot at the line. Check the teller and the person doing the action."
    }
   ]
  }
 },
 {
  "id": "sign",
  "title": "The bottom of the sign",
  "focus": "A view of only part of a sign",
  "accountsByForm": {
   "short": [
    {
     "id": "a",
     "name": "Pip",
     "lines": [
      {
       "id": "sign-A1",
       "text": "From the Garden path, I could read Café on the market sign."
      },
      {
       "id": "sign-A2",
       "text": "Bushes hid the bottom of that sign from me."
      },
      {
       "id": "sign-A3",
       "text": "I could not see an arrow on the sign."
      }
     ]
    },
    {
     "id": "b",
     "name": "Dot",
     "lines": [
      {
       "id": "sign-B1",
       "text": "From the Bridge, I could see the whole market sign."
      },
      {
       "id": "sign-B2",
       "text": "A blue arrow pointed left below the word Café."
      },
      {
       "id": "sign-B3",
       "text": "I stood by the rail to read it."
      }
     ]
    }
   ],
   "long": [
    {
     "id": "a",
     "name": "Pip",
     "lines": [
      {
       "id": "sign-A1",
       "text": "From the Garden path, I could read Café on the market sign."
      },
      {
       "id": "sign-A2",
       "text": "Bushes hid the bottom of that sign from me."
      },
      {
       "id": "sign-A3",
       "text": "I could not see an arrow on the sign."
      },
      {
       "id": "sign-A4",
       "text": "A leaf had caught on my sleeve, and I brushed it away with the edge of my paw."
      },
      {
       "id": "sign-A5",
       "text": "I was carrying a paper bag that crackled whenever I changed my grip on its folded top."
      }
     ]
    },
    {
     "id": "b",
     "name": "Dot",
     "lines": [
      {
       "id": "sign-B1",
       "text": "From the Bridge, I could see the whole market sign."
      },
      {
       "id": "sign-B2",
       "text": "A blue arrow pointed left below the word Café."
      },
      {
       "id": "sign-B3",
       "text": "I stood by the rail to read it."
      },
      {
       "id": "sign-B4",
       "text": "A market tune drifted over the water, with a little pause that made me want to hum along."
      },
      {
       "id": "sign-B5",
       "text": "I tapped its rhythm on my bag, then tucked the loose strap back over my shoulder."
      }
     ]
    }
   ]
  },
  "claims": [
   {
    "id": "sign-stated",
    "text": "The sign had a blue arrow pointing left below Café.",
    "kind": "stated",
    "groups": [
     [
      "sign-B2"
     ]
    ],
    "explanation": "Dot directly describes the arrow's colour, direction and position."
   },
   {
    "id": "sign-inferred",
    "text": "A view from the Bridge might help Pip see the arrow.",
    "kind": "inferred",
    "groups": [
     [
      "sign-B1"
     ]
    ],
    "explanation": "In the complete displayed sign context, Dot's view of the whole sign from the Bridge supports suggesting that viewpoint for Pip. The arrow's identity comes from the surrounding passage. Adding Pip's blocked-view lines is useful context, but the arrow-description line need not also be selected for this tentative suggestion. It does not guarantee Pip's view; neither teller describes Pip looking from the Bridge."
   },
   {
    "id": "sign-contradicted",
    "text": "There was no arrow anywhere on the market sign.",
    "kind": "contradicted",
    "groups": [
     [
      "sign-B2"
     ]
    ],
    "explanation": "Dot explicitly describes an arrow on the same sign. Pip says the arrow was not visible to Pip, not that the sign had no arrow."
   },
   {
    "id": "sign-unknown",
    "text": "The market sign was exactly ten metres from the Garden path.",
    "kind": "unknown",
    "groups": [],
    "explanation": "Neither account gives a distance. Seeing some of the sign does not establish exactly how far away it was."
   }
  ],
  "reader": {
   "name": "Squirrel",
   "knows": "a",
   "question": "Which way does the arrow below Café point?",
   "original": "The market sign says Café.",
   "cards": [
    {
     "id": "sign-note-original",
     "text": "The market sign says Café.",
     "fits": false,
     "feedback": "This names the word correctly. Squirrel still needs the arrow's direction."
    },
    {
     "id": "sign-note-left",
     "text": "The blue arrow below Café points left.",
     "fits": true,
     "feedback": "This gives the direction Squirrel asked for."
    },
    {
     "id": "sign-note-view",
     "text": "Dot saw the whole sign from the Bridge. Its arrow below Café points left.",
     "fits": true,
     "feedback": "This answers the direction question and explains whose fuller view supplies the detail."
    },
    {
     "id": "sign-note-right",
     "text": "The arrow below Café points right.",
     "fits": false,
     "feedback": "Check Dot's arrow direction. Pip's limited view supplies no different direction."
    }
   ]
  }
 }
];
function freeze(x){if(x&&typeof x==='object'){for(const v of Object.values(x))freeze(v);Object.freeze(x);}return x;}
export const windowStories=freeze(stories);
export function windowSource(id,form='short'){const s=windowStories.find(s=>s.id===id);if(!s?.accountsByForm[form])return null;return {version:1,id:s.id,form,title:s.title,focus:s.focus,accounts:s.accountsByForm[form],claims:s.claims,reader:s.reader};}
