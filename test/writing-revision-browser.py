"""Red Pencil381: actual app/Notes journeys with invented records only.

One tablet journey and phone sample use the unmodified app. An explicitly
isolated actual-UI harness covers external context/refusal mutations unavailable
through normal controls. This does not qualify physical Safari/iPad, VoiceOver,
audible output or learning. Existing Writing Table native helpers are reused.
"""
import sys
sys.dont_write_bytecode=True
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('WRITING_REVISION_ARTIFACTS') or tempfile.mkdtemp(prefix='writing-revision-'))
OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('revision_existing_helpers',ROOT/'test/writing-table-browser.py')
h=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(h);h.OUT=OUT
ROUTE='#desk/writing'
TEXT={
 'time':'The bakery opens at seven in the morning.',
 'place':'The bakery is on the square, next to the post office.',
 'flour':'Leave flour sacks at the side door.',
 'pause':'Deliveries pause from noon to one in the afternoon.',
 'front':'Visitors use the front door.'
}
VISITOR={'time':'use','place':'use','flour':'aside','pause':'aside','front':'use'}
COURIER={'time':'aside','place':'aside','flour':'use','pause':'use','front':'aside'}


def fixture():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={v:73,exact:'Invented unrelated data'};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))


def action(p,name):
 p.locator('[data-writing-action="'+name+'"]:visible').first.click()


def drawer(p,name,opened=True):
 d=p.locator('[data-writing-panel="'+name+'"]')
 if (d.get_attribute('open') is not None)!=opened:d.locator(':scope>summary').click()


def choose(p,id):
 drawer(p,'shelf');p.locator('[data-writing-bench="revision"]').click();p.locator('[data-writing-open="'+id+'"]').click()


def move(p,part,heading):
 p.locator('[data-writing-strip="'+part+'"]').click();p.locator('[data-writing-destination="'+heading+'"]').click()


def notice(p,scope='current'):
 return p.locator('[data-writing-notice="'+scope+'"]')


def parts(p,group,scope='current'):
 return notice(p,scope).locator('[data-writing-notice-'+group+'] [data-writing-notice-part]').evaluate_all('xs=>xs.map(x=>x.getAttribute("data-writing-notice-part"))')


def fit(p,mapping):
 for part,heading in mapping.items():move(p,part,heading)
 action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','literal arrangement answers this own reader request')


def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('[data-writing-root] button,[data-writing-root] a,[data-writing-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'visible controls have44px targets and16px text: '+str(bad))
 tiny=p.locator('[data-writing-revision] p,[data-writing-revision] li,[data-writing-revision] label,[data-writing-revision] small').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not tiny,'revision body text remains at least16px: '+str(tiny))


def notice_geometry(p):
 boxes=notice(p).evaluate("e=>{const b=x=>{const r=x.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom}};return{preview:b(e),paper:b(e.querySelector('[data-writing-notice-kept]')),waiting:b(e.querySelector('[data-writing-notice-waiting]')),aside:b(e.querySelector('[data-writing-notice-aside]'))}}")
 h.ok(boxes['paper']['w']>=boxes['preview']['w']*.85,'notice paper spans its preview instead of inheriting three tiny columns')
 h.ok(boxes['waiting']['y']>=boxes['paper']['bottom']-1 and boxes['aside']['y']>=boxes['waiting']['bottom']-1,'waiting and aside groups stack below the paper')


def stop_voice(p):
 control=p.locator('[data-stop-speech]')
 if control.count():control.first.click()


def hear(p):
 control=p.locator('.wt-work [data-speak]').first;control.click();words=control.get_attribute('data-speak') or '';stop_voice(p);return words


def journey(browser,base,seed):
 print('Red Pencil: actual tablet reader/revision journey',flush=True)
 c,p=h.setup(browser,base,seed)
 try:
  h.ok('writingDesk' not in h.book(p),'arrival creates no writing record')
  p.locator('[data-writing-action="revision"]').tap()
  h.ok(h.work(p)['source']['id']=='pencil-notice','direct bench entry opens visitor notice')
  h.ok('Revising changes' in p.locator('.wt-work').inner_text(),'intro is visible before interaction')
  h.ok([x['text'] for x in h.work(p)['source']['parts']]==list(TEXT.values()),'five exact fictional lines form the common material')
  bounds(p)
  words=hear(p)
  h.ok(all(words.count(text)==1 for text in TEXT.values()),'fresh waiting lines are heard exactly once')
  h.ok('greenhous' not in words,'closed gardener teaching/example excluded from Hear')
  move(p,'flour','aside');move(p,'pause','use')
  h.ok(parts(p,'kept')==['pause'] and parts(p,'waiting')==['time','place','front'],'unexpected line and waiting lines are literal')
  h.ok(notice(p).locator('[data-writing-notice-aside]').get_attribute('open') is None,'aside starts closed')
  words=hear(p)
  h.ok(TEXT['pause'] in words and TEXT['flour'] not in words,'Hear includes current notice but excludes closed aside text')
  drawer(p,'notice-aside-current');h.ok(TEXT['flour'] in hear(p),'elected aside text becomes hearable');drawer(p,'notice-aside-current',False)
  action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='incomplete','unfinished wrong notice remains an incomplete supported attempt')
  action(p,'keep');first=copy.deepcopy(h.work(p)['firstKept']);first_check=copy.deepcopy(h.work(p)['checks'][0])
  fit(p,VISITOR);action(p,'keep');visitor=copy.deepcopy(h.work(p))
  h.ok(visitor['firstKept']==first and visitor['checks'][0]==first_check,'original unexpected keep/check remain exact')
  h.ok(parts(p,'kept')==['time','place','front'],'visitor notice contains only the elected visitor lines');notice_geometry(p)
  drawer(p,'versions');h.ok(parts(p,'kept','first')==['pause'] and parts(p,'kept','latest')==['time','place','front'],'first and latest visible papers keep their own placements');drawer(p,'versions',False)
  p.locator('[data-writing-other-reader]').click()
  h.ok(h.work(p)['source']['id']=='pencil-courier','other-reader invitation opens separate courier task')
  h.ok(h.work(p)['work']['placements']==dict.fromkeys(TEXT,None),'courier begins with its own empty placement map')
  h.ok(not p.locator('.wt-reader small').count(),'new courier record is not called familiar from the visitor attempt')
  h.ok([x['text'] for x in h.work(p)['source']['parts']]==list(TEXT.values()),'the reader changes while the five lines stay exact')
  fit(p,COURIER);action(p,'keep');courier=copy.deepcopy(h.work(p))
  h.ok(parts(p,'kept')==['flour','pause'],'delivery lines become the new notice')
  h.ok(h.book(p)['writingDesk']['records']['pencil-notice']==visitor,'courier actions do not copy/replace visitor work')
  p.locator('[data-writing-other-reader]').click();h.ok(h.work(p)==visitor,'reader return restores exact visitor record')
  choose(p,'pencil-changes');fit(p,{'spelling':'edit','location':'revise','period':'edit','order':'revise'});action(p,'keep')
  choose(p,'pencil-edit');p.locator('[data-writing-choice="bred"]').click();h.ok('The bakery sells bred.' in p.locator('.wt-work > .wt-page-preview').inner_text(),'unexpected spelling stays literal before Check');action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different','printed word choice remains supported/different');p.locator('[data-writing-choice="bread"]').focus();p.keyboard.press('Enter');action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','food spelling fits meaning');action(p,'keep')
  choose(p,'pencil-plan');p.locator('[data-writing-choice="wait"]').click();action(p,'check');h.ok('current route' in p.locator('#writing-feedback').inner_text(),'conservative plan feedback identifies the supplied usable route');p.locator('[data-writing-choice="arrival"]').click();action(p,'keep')
  choose(p,'pencil-taste')
  claims={'first':'Only the first can work.','second':'Only the second can work.','both':'Both can work.','neither':'Neither can work.'}
  for id,claim in claims.items():
   p.locator('[data-writing-choice="'+id+'"]').click();preview=p.locator('.wt-work > .wt-page-preview').inner_text();h.ok(claim in preview,'current preview preserves elected '+id+' claim');action(p,'keep');h.ok(h.work(p)['latestKept']['work']['choice']==id,'Keep retains elected '+id+' choice')
  h.ok(h.work(p)['firstKept']['work']['choice']=='first' and h.work(p)['latestKept']['work']['choice']=='neither','taste keeps first/latest claims without correcting either')
  drawer(p,'versions');h.ok('Only the first can work.' in p.locator('[data-writing-version="first"]').inner_text() and 'Neither can work.' in p.locator('[data-writing-version="latest"]').inner_text(),'kept preview never converts wrong claims into the answer');drawer(p,'versions',False)
  p.locator('[data-writing-choice="both"]').click();action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','both sentences can serve the stated purpose')
  choose(p,'pencil-notice');p.screenshot(path=str(OUT/'tablet.png'),full_page=True)
  complete=copy.deepcopy(h.book(p)['writingDesk']);report=h.export_notes(p,'six-reader-drafts');h.ok(report['writingDesk']==complete,'actual Notes preserves all six drafts, sources and versions')
  p.evaluate('location.hash="#desk/writing"');h.ready(p)
  before=copy.deepcopy(h.book(p));p.locator('[data-writing-own-message]').click();p.wait_for_function('location.hash==="#post/messages/own"');p.locator('.msg-workspace').wait_for();h.ok(h.book(p)['writingDesk']==before['writingDesk'],'own-message invitation does not transfer or change writing work');h.ok(not p.locator('[data-msg-field="original"]:visible').count(),'own-message entry does not elect typing automatically')
  return report
 finally:c.close()


def import_report(p,report):
 p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for();p.locator('#progress-file').set_input_files({'name':'synthetic-red-pencil.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#desk/writing"');h.ready(p)


def historical_report(report):
 result=copy.deepcopy(report);root=result['writingDesk'];base=root['records']['pencil-notice'];source=copy.deepcopy(base['source'])
 source.update(id='old-notice',family='old-notice',title='Earlier archivist paper',reader='An earlier fictional archivist needs selected lines and an appendix.')
 source['parts']=[{'id':'old-'+str(i),'text':p['text']} for i,p in enumerate(source['parts'])]+[{'id':'appendix-line','text':'A separate earlier line waits in the appendix.'}]
 source['choices']=[{'id':'publish','text':'Earlier paper'},{'id':'hold','text':'Earlier set-aside lines'},{'id':'later','text':'A later appendix'}]
 source['key']={p['id']:'publish' for p in source['parts']};source['key']['appendix-line']='later'
 source['redPencil']={'v':1,'keepId':'publish','asideId':'hold','destinationLabels':{'publish':'Put on earlier paper','hold':'Keep apart','later':'Put in appendix'},'otherReader':{'taskId':'old-target','label':'Open the earlier target draft'},'future':{'source':'exact'}}
 w={'placements':{p['id']:'publish' for p in source['parts']}};w['placements']['old-1']='hold';w['placements']['appendix-line']='later'
 help={k:False for k in ['hint','example','narration','together']};snap={'work':copy.deepcopy(w),'help':copy.deepcopy(help),'check':None}
 root['records']['old-notice']={'source':source,'work':w,'help':help,'checks':[],'count':0,'firstKept':copy.deepcopy(snap),'latestKept':copy.deepcopy(snap),'future':{'record':'exact'}}
 target=copy.deepcopy(root['records']['pencil-courier']);target['source']['id']='old-target';target['source']['family']='old-target';target['source']['title']='Earlier target reader';root['records']['old-target']=target
 malformed=copy.deepcopy(base);malformed['source']['id']='older-metadata';malformed['source']['family']='older-metadata';malformed['source']['title']='Earlier optional format';malformed['source']['redPencil']={'v':99,'future':['retained']};root['records']['older-metadata']=malformed
 root['records']['unreadable-sibling']={'future':{'raw':'exact'}};root['currentId']='old-notice';result['syntheticOther']['unknown']={'exact':[1,2,3]}
 return result


def transfer(browser,base,seed,report):
 print('Red Pencil: actual historical Notes transfer',flush=True)
 c,p=h.setup(browser,base,seed)
 try:
  altered=historical_report(report);import_report(p,altered)
  held=copy.deepcopy(h.book(p)['writingDesk']);h.ok(held==altered['writingDesk'],'coherent changed IDs/counts/headings and unreadable sibling imported exactly')
  h.ok('Earlier archivist paper' in p.locator('#writing-task-title').inner_text() and 'earlier fictional archivist' in p.locator('.wt-reader').inner_text(),'historical source reader/title remain own')
  h.ok(parts(p,'kept')==['old-0','old-2','old-3','old-4'],'historical notice uses own keep ID without current-catalog substitution')
  h.ok('A later appendix' in notice(p).inner_text(),'extra historical heading remains represented')
  notice(p).locator('[data-writing-notice-extra="later"] > summary').click();h.ok('A separate earlier line waits in the appendix.' in notice(p).locator('[data-writing-notice-extra="later"]').inner_text(),'opening the historical extra heading reveals its retained line')
  old=copy.deepcopy(held['records']['old-notice']);p.locator('[data-writing-other-reader]').click();h.ok(h.work(p)['source']['id']=='old-target','retained historical target opens without a current catalog entry');h.ok(h.book(p)['writingDesk']['records']['old-notice']==old,'other-reader link does not rewrite historical source or work')
  drawer(p,'shelf');p.locator('[data-writing-open="old-notice"]').click();move(p,'old-0','hold');action(p,'keep');h.ok(h.work(p)['firstKept']==old['firstKept'],'own-source edit leaves original first keep immutable')
  drawer(p,'shelf');p.locator('[data-writing-open="older-metadata"]').click();h.ok(not p.locator('[data-writing-notice]').count(),'unknown optional preview metadata uses generic sort fallback');h.ok(all(text in p.locator('.wt-work > .wt-page-preview').inner_text() for text in TEXT.values()),'fallback does not hide any ordinary material')
  raw=copy.deepcopy(h.work(p)['source']['redPencil']);move(p,'flour','use');h.ok(h.work(p)['source']['redPencil']==raw,'fallback remains editable without repairing optional raw metadata')
  expected=copy.deepcopy(h.book(p));again=h.export_notes(p,'historical-redownload');h.ok(again['writingDesk']==expected['writingDesk'] and again['syntheticOther']==expected['syntheticOther'],'actual redownload keeps changed sources/unknown sibling/other roots exact')
  p.get_by_text('Writing Table: supplied drafts and kept versions',exact=True).click();section=p.locator('details.panel > section').filter(has=p.locator('h3',has_text='Earlier archivist paper')).first;reader=section.locator(':scope > p').first;h.ok(reader.is_visible() and reader.inner_text()=='An earlier fictional archivist needs selected lines and an appendix.','opened Notes displays the historical reader beside its previews, not merely inside raw JSON')
 finally:c.close()


def phone(browser,base,seed):
 print('Red Pencil: phone touch/focus/Hear sample',flush=True)
 c,p=h.setup(browser,base,seed,320,800)
 try:
  action(p,'revision');bounds(p);p.locator('[data-writing-strip="front"]').focus();p.keyboard.press('Enter');p.locator('[data-writing-destination="use"]').focus();p.keyboard.press('Enter');h.ok(h.work(p)['work']['placements']['front']=='use','keyboard moves a notice line');h.ok(p.evaluate('document.activeElement.matches("[data-writing-strip=front]")'),'move returns focus to the selected line')
  drawer(p,'teaching');action(p,'teaching-next');h.ok('greenhouse' in p.locator('[data-writing-panel="teaching"]').inner_text(),'manual example advances by an explicit action');words=hear(p);h.ok('greenhouse' in words,'opened manual part appears in Hear');drawer(p,'teaching',False);h.ok('greenhous' not in hear(p),'closed manual example is excluded again without erasing support')
  bounds(p);p.screenshot(path=str(OUT/'phone.png'),full_page=True)
 finally:c.close()


def isolated(browser,base,seed):
 print('Red Pencil: explicit isolated actual-UI external-context harness',flush=True)
 c,p=h.setup(browser,base,seed)
 try:
  setup='''async seed=>{
   const ui=await import('./writing-table-ui.mjs'),writing=await import('./writing-table-core.mjs'),core=await import('./core.mjs'),media=await import('./play-media.mjs'),transfer=await import('./progress-transfer.mjs');
   const main=document.querySelector('main');main.replaceChildren();
   const h={book:structuredClone(seed),owner:'synthetic-owner',active:true,allow:true,saves:0};
   const report=c=>({title:'After the Storm: observations',exportedAt:'2026-11-04T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:core.recommendations(c),...c});
   const gate=c=>transfer.prepareProgressImport(JSON.stringify(report(c),null,2)).ok;
   writing.openWritingTask(h.book,'pencil-courier',{canExport:gate});writing.openWritingTask(h.book,'pencil-notice',{canExport:gate});h.original=h.book;
   h.render=()=>{main.innerHTML=ui.writingPage(h.book,h.owner);ui.bindWriting(h.book,{notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,save:()=>{h.saves++;return{enabled:true,ok:true}},render:h.render,stopSpeech:media.stopSpeech,stopSound:()=>{},canExport:c=>h.allow&&gate(c)});media.bindSpeech()};
   window.revisionHarness=h;h.render();
  }'''
  def install():p.evaluate(setup,seed);p.locator('[data-writing-revision]').wait_for()
  def dispatch(el):el.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
  install();p.locator('[data-writing-strip="pause"]').click();p.evaluate('revisionHarness.allow=false');before=p.evaluate('JSON.stringify(revisionHarness.book)');p.locator('[data-writing-destination="use"]').click();h.ok(p.evaluate('JSON.stringify(revisionHarness.book)')==before and p.evaluate('revisionHarness.saves')==0,'real Notes preflight refusal leaves entire notebook exact');h.ok(p.locator('[data-writing-strip="pause"]').get_attribute('aria-pressed')=='true' and 'could not be kept' in p.locator('#writing-status').inner_text(),'refusal preserves visible selection and recovery direction')
  for fault in ['owner','book','inactive','root','writing-root','task','record','parent']:
   install();p.locator('[data-writing-strip="pause"]').click();el=p.locator('[data-writing-destination="use"]').element_handle()
   if fault=='owner':p.evaluate('revisionHarness.owner="another-owner"')
   elif fault=='book':p.evaluate('revisionHarness.book=structuredClone(revisionHarness.book)')
   elif fault=='inactive':p.evaluate('revisionHarness.active=false')
   elif fault=='root':p.locator('[data-writing-root]').evaluate('e=>e.replaceWith(e.cloneNode(true))')
   elif fault=='writing-root':p.evaluate('revisionHarness.book.writingDesk=structuredClone(revisionHarness.book.writingDesk)')
   elif fault=='task':p.evaluate('revisionHarness.book.writingDesk.currentId="pencil-courier"')
   elif fault=='record':p.evaluate('revisionHarness.book.writingDesk.records["pencil-notice"]=structuredClone(revisionHarness.book.writingDesk.records["pencil-notice"])')
   else:el.evaluate('e=>{const box=document.createElement("section");e.closest("[data-writing-root]").append(box);box.append(e)}')
   before=p.evaluate('JSON.stringify([revisionHarness.original,revisionHarness.book])');dispatch(el);h.ok(p.evaluate('JSON.stringify([revisionHarness.original,revisionHarness.book])')==before and p.evaluate('revisionHarness.saves')==0,'stale '+fault+' destination is inert')
  install();el=p.locator('[data-writing-other-reader]').element_handle();el.evaluate('e=>document.body.append(e)');before=p.evaluate('JSON.stringify(revisionHarness.book)');dispatch(el);h.ok(p.evaluate('JSON.stringify(revisionHarness.book)')==before and p.evaluate('revisionHarness.saves')==0,'reparented other-reader cannot open or replace a draft')
  install();el=p.locator('.wt-work [data-speak]').element_handle();el.evaluate('e=>{document.body.append(e);window.staleRevisionHear=false;e.addEventListener("click",()=>{window.staleRevisionHear=true})}');dispatch(el);h.ok(not p.evaluate('staleRevisionHear'),'reparented Hear is stopped before normal speech handlers')
  install();move(p,'flour','aside');fold=p.locator('[data-writing-panel="notice-aside-current"]').element_handle();fold.evaluate('e=>{e.savedParent=e.parentNode;const box=document.createElement("section");e.closest("[data-writing-root]").append(box);box.append(e);e.open=true}');p.wait_for_timeout(30);p.locator('[data-writing-strip="pause"]').click();h.ok(p.locator('[data-writing-panel="notice-aside-current"]').get_attribute('open') is None,'reparented disclosure cannot retain an elected-open state')
 finally:c.close()


def saving_off(browser,base,seed):
 print('Red Pencil: actual saving-off recovery',flush=True)
 c,p=h.setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#desk/writing"');h.ready(p);action(p,'revision');move(p,'flour','use');h.ok('session' in p.locator('#writing-status').inner_text(),'saving-off status identifies session-only work');report=h.export_notes(p,'saving-off-recovery');h.ok(report['writingDesk']['records']['pencil-notice']['work']['placements']['flour']=='use','actual Notes recovers saving-off in-memory work')
 finally:c.close()


class Quiet(http.server.SimpleHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True

def main():
 seed=fixture();server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');browser=pw.chromium.launch(headless=True,executable_path=chrome if Path(chrome).exists() else None,args=['--disable-quic'])
   try:
    report=journey(browser,base,seed);transfer(browser,base,seed,report);phone(browser,base,seed);isolated(browser,base,seed);saving_off(browser,base,seed);h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'base':base,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc())
    for ci,context in enumerate(browser.contexts):
     for pi,page in enumerate(context.pages):
      try:page.screenshot(path=str(OUT/f'failure-{ci}-{pi}.png'),full_page=True);(OUT/f'failure-{ci}-{pi}.html').write_text(page.content())
      except Exception:pass
    raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
