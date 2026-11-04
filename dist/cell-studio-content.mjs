// Original finite cell illustrations; kept sheets hold complete frozen snapshots.
const parts = [
  {
    "id": "wall",
    "label": "Cell wall",
    "role": "A firm layer outside the cell membrane supports these plant cells. The membrane is still there.",
    "symbol": "wall"
  },
  {
    "id": "membrane",
    "label": "Cell membrane",
    "role": "A thin boundary helps regulate what enters and leaves the cell. It is different from a plant cell wall.",
    "symbol": "membrane"
  },
  {
    "id": "cytoplasm",
    "label": "Cytoplasm",
    "role": "The contents outside the nucleus include fluid and other cell structures. Many chemical reactions happen here.",
    "symbol": "cytoplasm"
  },
  {
    "id": "nucleus",
    "label": "Nucleus",
    "role": "Holds most of this cell's DNA, the instructions used in cell activities. Some DNA is also inside mitochondria, and inside chloroplasts in cells that have them.",
    "symbol": "nucleus"
  },
  {
    "id": "vacuole",
    "label": "Large central vacuole",
    "role": "A fluid-filled space in these plant cells stores substances and helps keep the cell firm. Animal cells can have smaller storage spaces; this large central vacuole is a different feature.",
    "symbol": "vacuole"
  },
  {
    "id": "mitochondria",
    "label": "Mitochondria",
    "role": "Transfer chemical energy from food into ATP, an energy-carrying molecule used in cell activities. Both these plant and animal cells have mitochondria. They do not create energy.",
    "symbol": "mitochondria"
  },
  {
    "id": "ribosomes",
    "label": "Ribosomes",
    "role": "Make proteins, which cells use for many jobs. Our enlarged dots are symbols, not what a classroom light microscope could show.",
    "symbol": "ribosomes"
  },
  {
    "id": "chloroplasts",
    "label": "Chloroplasts",
    "role": "Use light energy in photosynthesis to make sugars from carbon dioxide and water, releasing oxygen. Not every plant cell has chloroplasts.",
    "symbol": "chloroplasts"
  }
];
const notice = "Simplified selected examples, not all cells. Other structures exist. These drawings are models, not microscope photographs. Symbols show kinds of parts, not actual numbers, sizes, colors or fixed positions. The outline shape does not identify every plant or animal cell.";
const microscopeNotice = "Ribosomes cannot be resolved with an ordinary classroom light microscope. Mitochondria usually cannot be made out in ordinary classroom preparations. Our enlarged symbols are not evidence that you saw these parts in a slide.";
const cases = [
  {
    "id": "leaf",
    "title": "Green leaf cell",
    "outline": "plant",
    "context": "Selected example: a photosynthetic mesophyll cell inside a green leaf.",
    "job": "Make an illustration for the town's leaf guide. Which parts could explain how this cell uses light?",
    "note": "This selected leaf cell has chloroplasts and mitochondria. Photosynthesis and respiration are different processes; plants need both.",
    "teaching": [
      "Start with the boundary: this source has a cell membrane inside a separate supporting cell wall.",
      "This green leaf cell has mitochondria as well as chloroplasts. Mitochondria transfer chemical energy from food into ATP; chloroplasts use light in photosynthesis. These are different jobs.",
      "This selected leaf cell has chloroplasts. A non-green underground root cortex cell need not have them. Plant cells are not all the same."
    ],
    "presentIds": [
      "wall",
      "membrane",
      "cytoplasm",
      "nucleus",
      "vacuole",
      "mitochondria",
      "ribosomes",
      "chloroplasts"
    ]
  },
  {
    "id": "root",
    "title": "Underground root cell",
    "outline": "plant",
    "context": "Selected example: a mature, non-green cortex cell in an underground root.",
    "job": "Make another plant-cell illustration. Must every plant cell have chloroplasts?",
    "note": "This selected root cell has no chloroplasts. It uses sugars transported from other parts of the plant and still has mitochondria. Some other roots can be green; this is one selected example.",
    "teaching": [
      "This source has a cell membrane inside a separate supporting cell wall. No chloroplast is shown in this selected non-green underground root cell.",
      "This root cell still has mitochondria. It uses sugars transported from other parts of the plant; no chloroplast here does not mean no energy transfer.",
      "Compare the kind of cell: green photosynthetic leaf cells have chloroplasts. This selected root cell does not. Some other roots can be green."
    ],
    "presentIds": [
      "wall",
      "membrane",
      "cytoplasm",
      "nucleus",
      "vacuole",
      "mitochondria",
      "ribosomes"
    ]
  },
  {
    "id": "cheek",
    "title": "Cheek-lining cell",
    "outline": "animal",
    "context": "Selected example: a typical nucleated cell lining a human cheek.",
    "job": "Make an animal-cell illustration. Which parts are shared with both plant examples?",
    "note": "These three examples share membrane, cytoplasm, nucleus, mitochondria and ribosomes. A cheek cell has no plant cell wall or chloroplasts. This does not mean all animal cells are alike.",
    "teaching": [
      "This source has a cell membrane, with no plant cell wall outside it. A membrane and a wall are different structures.",
      "This cheek cell has mitochondria. Both the selected plant examples have them too. Mitochondria transfer chemical energy from food into ATP; they do not create energy.",
      "Membrane, cytoplasm, nucleus, mitochondria and ribosomes are shared by our three selected examples. This cheek cell has no chloroplasts or large central plant vacuole, though animal cells can have smaller storage spaces."
    ],
    "presentIds": [
      "membrane",
      "cytoplasm",
      "nucleus",
      "mitochondria",
      "ribosomes"
    ]
  }
];
export const cellCases=cases.map(({id,title})=>({id,title}));
export function cellSource(id){
 const entry=cases.find(s=>s.id===id);if(!entry)return null;
 const {presentIds,...source}=entry;
 return structuredClone({v:1,model:'cell-studio-v1',...source,notice,microscopeNotice,parts:parts.map(part=>({...part,present:presentIds.includes(part.id)}))});
}
