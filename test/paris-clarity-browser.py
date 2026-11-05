"""Fictional real-app regression cases; PARIS_FIXTURE_ROOT can select an unchanged base.

Chromium emulation and speech payload inspection do not qualify audible speech,
French fluency, a physical device, Safari, VoiceOver or learning outcomes.
"""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('PARIS_ARTIFACTS',tempfile.mkdtemp(prefix='paris-clarity-')));OUT.mkdir(parents=True,exist_ok=True)
program="""
import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';
import * as a from './dist/travelers-archive-core.mjs';import * as f from './dist/french-ferry-core.mjs';
import * as r from './dist/french-rooms-core.mjs';import {startVisit} from './dist/garden-core.mjs';
import {storyNodes} from './dist/story-content.mjs';import {frenchStories} from './dist/french-library.mjs';
const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;},yes={canExport:()=>true};
const archive=fresh();a.setArchiveQuestion(archive,'photo-date');a.answerArchiveQuestion(archive,'photo-date','not-alone');a.setArchiveReplyText(archive,'Fictional first reply.');a.setArchiveReplyChoice(archive,'claim','return-later');a.setArchiveReplyChoice(archive,'limit','feelings');a.checkArchiveReply(archive);a.keepArchiveReply(archive);a.setArchiveReplyText(archive,'Fictional replacement reply.');a.setArchivePage(archive,'reply');
const retired=structuredClone(archive);retired.travelersArchive.page='sources';retired.travelersArchive.question='retired-question';retired.travelersArchive.answers['retired-question']='retired-choice';retired.travelersArchive.support['retired-question']={help:true};
const order=structuredClone(archive);order.travelersArchive.page='place-dates';order.travelersArchive.task='order';order.travelersArchive.order=['retired-event','river-peak'];
const ferry=fresh();f.openCrossing(ferry,'morning',{voice:false},yes);const src=ferry.frenchFerry.crossings.morning.source;for(let i=0;i<4;i++){f.pickAnswer(ferry,'morning',src.steps[i].fit,yes);f.sayAnswer(ferry,'morning','not-now',yes);}f.sayAnswer(ferry,'morning','not-now',yes);
const firstFerry=fresh();f.openCrossing(firstFerry,'morning',{voice:false},yes);
const rooms=fresh();r.startFrenchRooms(rooms,'return',yes);r.setFrenchRoomsField(rooms,'explanation','Fictional first message.',yes);r.keepFrenchRooms(rooms,yes);r.revealFrenchRoomsData(rooms,yes);r.setFrenchRoomsField(rooms,'revision','Fictional middle revision.',yes);r.keepFrenchRooms(rooms,yes);r.setFrenchRoomsField(rooms,'revision','Fictional latest revision.',yes);
const stories=frenchStories.filter(p=>storyNodes[p.variants[1][1]].kind==='order').map(p=>{const s=fresh(),v=startVisit(s,'french',{destination:p.destination,storyId:p.id,variant:1});v.node=v.route[1];return s;});
console.log(JSON.stringify({archive,retired,order,ferry,firstFerry,rooms,stories}));
"""
FIXTURES=json.loads(subprocess.check_output(['node','--input-type=module','-e',program],cwd=os.environ.get('PARIS_FIXTURE_ROOT',ROOT),text=True,encoding='utf8'))
checks=0;errors=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def book(p):return p.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1'))")
def description(p,selector):
 session=p.context.new_cdp_session(p);root=session.send('DOM.getDocument')['root']['nodeId'];node=session.send('DOM.querySelector',{'nodeId':root,'selector':selector})['nodeId']
 result=session.send('Accessibility.getPartialAXTree',{'nodeId':node,'fetchRelatives':False})['nodes'][0];session.detach();return result.get('description',{}).get('value','')
def fits(p):ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
def setup(browser,base,state,route,selector,width=820,voice=False):
 c=browser.new_context(viewport={'width':width,'height':700},color_scheme='dark' if width==320 else 'light',reduced_motion='reduce',accept_downloads=True)
 profile={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'gold','symbol':'leaf','createdAt':'2026-11-04T12:00:00.000Z'}]}
 data={'learning-garden-explorers':json.dumps(profile),'number-garden-v1:explorer-1':json.dumps(state)}
 c.add_init_script('(s=>{if(localStorage.getItem("paris-fixture"))return;for(const[k,v]of Object.entries(s))localStorage.setItem(k,v);localStorage.setItem("paris-fixture","1");})('+json.dumps(data)+')')
 voices=[{'name':'Synthetic local French','lang':'fr-FR','localService':True,'voiceURI':'synthetic-fr','default':False}] if voice else []
 c.add_init_script('speechSynthesis.getVoices=()=>'+json.dumps(voices)+';')
 p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+route,wait_until='domcontentloaded');p.locator(selector).first.wait_for();return c,p
def archive_journey(browser,base,width):
 c,p=setup(browser,base,FIXTURES['archive'],'#archive','[data-ta-keep]',width)
 original=copy.deepcopy(book(p)['travelersArchive']);expected=copy.deepcopy(FIXTURES['archive']['travelersArchive']);expected['sourcesExposed']=list(dict.fromkeys(expected['sourcesExposed']+['chronology']));ok(original==expected,'base Archive feedback and drafts load exactly; visible date cards record exposure')
 ok('replaces your saved reply' in description(p,'[data-ta-keep]'),'computed Keep description discloses replacement')
 p.get_by_text('See my kept draft',exact=True).click();ok('Everybody’s feelings.' in p.locator('.ta-task-slip').inner_text(),'preview includes the kept limit choice');fits(p)
 p.screenshot(path=str(OUT/f'archive-{width}.png'),full_page=True)
 p.locator('[data-ta-keep]').click();after=book(p)['travelersArchive'];ok(after['kept']['reply']['text']=='Fictional replacement reply.','explicit Keep replaces only the kept reply snapshot');ok(after['checks']==original['checks'],'Keep does not regrade earlier checks')
 p.reload(wait_until='domcontentloaded');p.locator('[data-ta-keep]').wait_for();ok(book(p)['travelersArchive']==after,'kept replacement reloads intact')
 p.goto(base+'#notes');p.locator('#download').wait_for()
 with p.expect_download() as download:p.locator('#download').click()
 report=json.loads(Path(download.value.path()).read_text(encoding='utf8'));ok(report['travelersArchive']==after,'actual notebook download preserves all Archive records');c.close()
def retired_journey(browser,base):
 for key in ['retired','order']:
  c,p=setup(browser,base,FIXTURES[key],'#archive','.ta-workspace')
  before=copy.deepcopy(book(p)['travelersArchive']);ok(not p.locator('[data-ta-recover]').count(),'a retired item does not lock out the entire Archive');fits(p)
  if key=='retired':
   ok(p.get_by_text('An earlier question is kept',exact=True).count()==1,'retired question is shown explicitly');ok('retired-choice' in p.locator('.ta-task-slip').inner_text(),'old choice remains visible');ok(not p.locator('[data-ta-answer]').count(),'retired question has no substituted current answer controls')
   p.locator('[data-ta-question]').first.click();ok(p.locator('[data-ta-answer]').count()>0,'current question opens through an explicit choice');ok(book(p)['travelersArchive']['answers']['retired-question']=='retired-choice','choosing a current question preserves the retired answer')
  else:
   ok('retired-event' in p.locator('.ta-task-slip').inner_text() and not p.locator('[data-ta-order-check]').count(),'retired order is readable and cannot be regraded')
   warning=description(p,'[data-ta-order-new]');ok('replaces this draft order' in warning and 'not a check' in warning,'new order discloses replacement before activation')
   p.locator('[data-ta-order-new]').click();ok(book(p)['travelersArchive']['order']==[],'explicit new order replaces only the old draft')
   p.locator('[data-ta-order-add]').first.click();ok(len(book(p)['travelersArchive']['order'])==1,'date ordering remains playable after replacing a retired draft')
  p.locator('[data-ta-page="reply"]').click();p.locator('[data-ta-keep]').wait_for();now=book(p)['travelersArchive'];ok(now['checks']==before['checks'] and now['kept']==before['kept'],'other pages stay open without rewriting old work');c.close()
def retired_reply_journey(browser,base):
 state=copy.deepcopy(FIXTURES['archive']);state['travelersArchive']['reply']['limit']='retired-limit'
 c,p=setup(browser,base,state,'#archive','[data-ta-keep]')
 ok(p.locator('[data-ta-reply-check]').is_disabled(),'retired reply choice starts with Check disabled');before=copy.deepcopy(book(p)['travelersArchive']['checks'])
 p.locator('#ta-reply-text').fill('Fictional new words.');ok(p.locator('[data-ta-reply-check]').is_disabled(),'typing cannot re-enable a retired-choice check');ok(book(p)['travelersArchive']['checks']==before,'typing does not regrade any earlier reply')
 p.locator('[data-ta-reply-choice="limit:clear"]').click();ok(p.locator('[data-ta-reply-check]').is_enabled(),'explicitly clearing retired choice reopens Check');p.locator('[data-ta-reply-check]').click();ok(len(book(p)['travelersArchive']['checks'])==len(before)+1,'a new check is recorded only after an available choice');c.close()
def ferry_journey(browser,base,width,voice=False):
 c,p=setup(browser,base,FIXTURES['ferry'],'#bac','[data-bac-step="4"]',width,voice)
 before=copy.deepcopy(book(p)['frenchFerry']['crossings']['morning']);fit=before['source']['steps'][4]['fit'];wrong=next(x['id'] for x in before['source']['steps'][4]['choices'] if x['id']!=fit)
 p.locator('[data-bac-card="'+wrong+'"]').click()
 if not voice:ok('Hear her again' not in p.locator('.bac-feedback').inner_text(),'no-voice retry describes available words')
 p.locator('[data-bac-card="'+fit+'"]').click();ok(p.locator('#bac-status').inner_text()=='That fits.','fitting choice never claims observed hearing');ok(book(p)['frenchFerry']['crossings']['morning']['source']==before['source'],'feedback display leaves frozen source unchanged');fits(p)
 ok('cannot continue it' in description(p,'[data-bac-action="again"]'),'restart loss is announced before activation')
 current=copy.deepcopy(book(p)['frenchFerry']['crossings']['morning']);p.screenshot(path=str(OUT/f'ferry-{width}-{voice}.png'),full_page=True);p.locator('[data-bac-action="again"]').click();ok(book(p)['frenchFerry']['earlier'][-1]==current,'restart preserves the exact prior crossing in earlier notes');c.close()
 # A contrasting question-word response keeps its teaching explanation without requiring unavailable speech.
 c,p=setup(browser,base,FIXTURES['firstFerry'],'#bac','[data-bac-step="0"]',width)
 source=book(p)['frenchFerry']['crossings']['morning']['source'];wrong=next(x['id'] for x in source['cards'] if x['kind']!=source['steps'][0]['kind']);p.locator('[data-bac-card="'+wrong+'"]').click();ok('Listen again' not in p.locator('.bac-feedback').inner_text(),'question-word mismatch does not demand unavailable speech');ok('That card tells' in p.locator('.bac-feedback').inner_text(),'reader retains the explanation of the chosen card');p.locator('[data-bac-action="meaning"]').click();ok('You can ask for' not in p.locator('.bac-feedback').inner_text(),'shown meaning is not offered through an absent control');c.close()
def rooms_journey(browser,base,width):
 c,p=setup(browser,base,FIXTURES['rooms'],'#learn/french','[data-rooms-keep]',width)
 before=copy.deepcopy(book(p)['frenchRooms']['lessons']['return']);buttons=p.locator('[data-rooms-keep]');ok(buttons.count()==2,'both writing sections expose Keep')
 for i in range(2):
  text=description(p,'[aria-describedby="rooms-'+('original' if i==0 else 'revision')+'-keep-help"]');ok('first kept version stays' in text and 'Both writing fields' in text,'computed Keep description explains scope and replacement')
 fits(p);p.screenshot(path=str(OUT/f'rooms-{width}.png'),full_page=True);buttons.first.click();after=book(p)['frenchRooms']['lessons']['return'];ok(after['firstKept']==before['firstKept'],'first snapshot is retained');ok(after['kept']['drafts']==before['drafts'],'Keep snapshots both current writing fields');c.close()
def story_journey(browser,base):
 for state in FIXTURES['stories']:
  c,p=setup(browser,base,state,'#storm/play','[data-story-audio]',320)
  payload=p.locator('[data-story-audio]').get_attribute('data-speak');ok('Cards to put in order.' not in payload,'French narration payload excludes the English lead');ok(p.locator('[data-story-audio]').get_attribute('data-speak-lang')=='fr','French narration requests French');ok(book(p)['garden']['visits'][-1]['parisSource']==state['garden']['visits'][-1]['parisSource'],'narration markup preserves old frozen passage and choice order');fits(p);c.close()
class Quiet(http.server.SimpleHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*_args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH'),args=['--disable-quic'])
   try:
    for width in [320,820]:archive_journey(browser,base,width);ferry_journey(browser,base,width);rooms_journey(browser,base,width)
    ferry_journey(browser,base,820,True);retired_journey(browser,base);retired_reply_journey(browser,base);story_journey(browser,base);ok(not errors,'no browser page errors: '+str(errors))
   finally:browser.close()
 finally:server.shutdown();server.server_close()
 (OUT/'result.json').write_text(json.dumps({'checks':checks,'errors':errors,'fixture_root':os.environ.get('PARIS_FIXTURE_ROOT','current tree')},indent=2),encoding='utf8');print(f'Paris clarity: {checks} browser checks passed')
if __name__=='__main__':main()
