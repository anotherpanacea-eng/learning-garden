export const circuitCopy={
 reference:'One cell. One filament bulb. Two different bulb contacts: side and tip.',
 idea:"A bulb needs a complete circuit. In our model, a path goes from one cell end through the bulb's filament to the other cell end. A connection to only one bulb contact leaves the filament out.",
 contacts:'The bulb has a metal side contact and a separate tip contact. The filament joins them inside. The pale band between side and tip is an insulator; it keeps those contacts separate.',
 limit:'A pretend screen circuit, not a physical result. The drawing shows connections, not measured current, brightness or heat.',
 help:"Follow the labels, not a line's position on the page. The bulb's side and tip are different contacts. Try one cell end at each bulb contact. Two wires meeting at the same contact can leave the filament out. In this little model, wire crossings join only at the labeled nodes. Change one connection, look at the new arrangement, and change it back whenever you like.",
 talk:'What changed when you removed one link? Can two different arrangements make the same bulb glow?',
 status:{
  open:{title:'Open path: model bulb off',text:'Our connections do not make a complete path through the filament from one cell end to the other. Add or remove a connection and compare.'},
  glow:{title:'Complete path: model bulb glows',text:'These connections include both bulb contacts and the filament in a path between the two cell ends. This filament bulb also works with the cell ends reversed.'},
  bypass:{title:'Glow model paused: a wire path bypasses the filament',text:'These wires join the cell ends without going through the filament. Our simple model does not calculate this arrangement. Leave exactly two links: cell + to one bulb contact and cell − to the other.'}
 },
 loop:{open:'These connections have no complete path through both bulb contacts. Compare the side and tip links with our worked example.',glow:'One cell end → wire → one bulb contact → filament → other bulb contact → wire → other cell end. The cell completes the circuit.',bypass:'These wires join the cell ends without going through the filament. Our simple model does not calculate this arrangement. Leave exactly two links: cell + to one bulb contact and cell − to the other.'},
 wireLabels:{ps:'cell + to bulb side',pt:'cell + to bulb tip',ns:'cell − to bulb side',nt:'cell − to bulb tip'}
};
const example={frames:[
 {mask:1,caption:"One wire reaches the bulb's side. There is no complete path through the filament and back."},
 {mask:9,caption:'A second wire joins the tip to the other cell end. The path now goes through the filament. Our model bulb glows.'},
 {mask:1,caption:'Remove that second connection. The path is open again, so our model bulb stops glowing.'}
]};
export const circuitLinks=[{key:'ps',bit:1,tag:'W1',ends:'P–S'},{key:'pt',bit:2,tag:'W2',ends:'P–T'},{key:'ns',bit:4,tag:'W3',ends:'N–S'},{key:'nt',bit:8,tag:'W4',ends:'N–T'}];
export const circuitCases=[
 ['one-lead','One lead is waiting',1,'Make a complete path through the bulb. Which other connection could you try?'],
 ['same-contact','Two leads, one contact',5,"Both leads meet the bulb's metal side. Why has our model paused? Try using two different bulb contacts."],
 ['reverse-pair','A different working pair',6,'This bulb is already glowing. Reverse which cell end goes to which bulb contact. Can it glow again?'],
 ['open-table','Your own lantern table',0,'Try your own connections. What can change while the model bulb still glows?']
].map(([id,title,initialMask,request])=>({version:1,model:'four-links-one-filament-v1',id,title,initialMask,request,copy:structuredClone(circuitCopy),example:structuredClone(example)}));
