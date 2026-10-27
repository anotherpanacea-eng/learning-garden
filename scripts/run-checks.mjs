import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const suites=readdirSync(new URL('../test/',import.meta.url),{withFileTypes:true})
  .filter(entry=>entry.isFile()&&/checks.*\.mjs$/.test(entry.name))
  .map(entry=>`test/${entry.name}`).sort();
if(!suites.length)throw new Error('No source-check suites found.');
const commands=[['scripts/build-learning-atlas.mjs','--check'],
  ['scripts/check-story-packs.mjs'],...suites.map(file=>[file])];

for(const args of commands){
  console.log(`\n> node ${args.join(' ')}`);
  const result=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});
  if(result.error)console.error(result.error.message);
  if(result.status!==0)process.exit(result.status??1);
}
console.log(`\nAll checks passed: atlas, story packs and ${suites.length} source suites.`);
