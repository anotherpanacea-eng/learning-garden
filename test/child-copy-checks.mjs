import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {mkdtempSync,mkdirSync,copyFileSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {scanCopySource,inspectChildCopy,copyScopes} from '../scripts/check-child-copy.mjs';

let checks=0;
const equal=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
const ok=(a,label)=>{assert.ok(a,label);checks++;};
equal(scanCopySource('Supplied\nprovenance\nrecorded  as support\nsupported practice\nsupported spelling practice\nexportable').length,6,'the named vocabulary is detected case/whitespace-insensitively');
equal(scanCopySource('supplies unsupplied unexportable suppliedThing SUPPLIED_FLAG a supported bridge').length,0,'not a substring ban or a ban on ordinary support');
equal(scanCopySource('// supplied\n  // provenance\n"supplied"').map(x=>x.line),[3],'whole comments excluded while literal candidate stays at actual source line');
equal(scanCopySource('"exportable"').map(x=>x.term),['exportable'],'visible failure jargon is a review candidate');
const source='child supplied\nADULT START\nprovenance\nADULT END\nchild exportable';
const adultBlocks=[{start:'ADULT START',end:'ADULT END',reason:'A manually reviewed adult panel.'}];
equal(scanCopySource(source,{adultBlocks}).map(x=>[x.line,x.term]),[[1,'supplied'],[5,'exportable']],'adult exclusion neither shifts lines nor exempts outside copy');
for(const block of [
 {start:'missing',end:'ADULT END',reason:'test'},
 {start:'child',end:'ADULT END',reason:'test'},
 {start:'ADULT END',end:'ADULT START',reason:'test'},
 {start:'ADULT START',end:'ADULT END',reason:''},
]) {assert.throws(()=>scanCopySource(source,{adultBlocks:[block]}));checks++;}
const quoted='"The visitor supplied the blankets."\n"The response was supplied."';
const quotations=[{quote:'"The visitor supplied the blankets."',reason:'Exact fiction quotation, reviewed in context.'}];
equal(scanCopySource(quoted,{quotations}).map(x=>x.line),[2],'a fiction exception does not mask another occurrence');
for(const exception of [
 {quote:'missing',reason:'test'},
 {quote:'supplied',reason:'ambiguous short fragment'},
 {quote:'"The visitor supplied the blankets."',reason:''},
]) {assert.throws(()=>scanCopySource(quoted,{quotations:[exception]}));checks++;}
equal(scanCopySource('provenance',{path:'scene.mjs'})[0].path,'scene.mjs','diagnostic identifies source file');
const result=inspectChildCopy();ok(result.ok,'actual pilot source contains no unallowed candidate or stale scope marker');
equal(result.files.length,copyScopes.length,'scoped result does not claim the whole app');
const script=fileURLToPath(new URL('../scripts/check-child-copy.mjs',import.meta.url));
const cli=spawnSync(process.execPath,[script,'--json'],{encoding:'utf8'});
equal(cli.status,0,'real CLI passes actual scoped source');
const report=JSON.parse(cli.stdout);ok(report.ok&&report.scope.includes('not a runtime'),'machine output preserves the enforcement limit');
// Exercise the actual CLI's failing paths, using only temporary copies of public source.
const temporary=mkdtempSync(join(tmpdir(),'child-copy-cli-'));
try {
  const copied=join(temporary,'scripts/check-child-copy.mjs');mkdirSync(dirname(copied),{recursive:true});copyFileSync(script,copied);
  for(const scope of copyScopes) {
    const target=join(temporary,scope.path);mkdirSync(dirname(target),{recursive:true});
    copyFileSync(fileURLToPath(new URL('../'+scope.path,import.meta.url)),target);
  }
  const first=join(temporary,copyScopes[0].path), original=readFileSync(first,'utf8');
  writeFileSync(first,original+'\nconst candidateCopy = "supplied";\n');
  const flagged=spawnSync(process.execPath,[copied,'--json'],{encoding:'utf8'});
  equal(flagged.status,1,'real CLI fails when a scoped candidate is introduced');
  equal(JSON.parse(flagged.stdout).flags.map(x=>x.term),['supplied'],'failing CLI names the introduced candidate');
  writeFileSync(first,original.replace(copyScopes[0].adultBlocks[0].start,'renamed adult helper'));
  const stale=spawnSync(process.execPath,[copied,'--json'],{encoding:'utf8'});
  equal(stale.status,1,'real CLI fails for a stale adult boundary');
  equal(JSON.parse(stale.stdout).configurationErrors.length,1,'configuration failure is distinct from a copy candidate');
} finally {rmSync(temporary,{recursive:true,force:true});}
console.log(`Child-copy check: ${checks} lexical/scope/exception/real-source checks passed.`);
