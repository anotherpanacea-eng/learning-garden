"""Synthetic Chrome regression for discoverable route testing; no real notebook data."""
import json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('POST_FLIGHT_TEST_URL','http://127.0.0.1:4188/')
OUT=Path(os.environ.get('POST_FLIGHT_ARTIFACTS','/tmp/post-flight-button'));OUT.mkdir(parents=True,exist_ok=True)
fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',"""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice,packPostTogether,appendPostClause,setPostPage,setPostPackingInput,stepPostRoute} from './dist/post-office-core.mjs';
import {startAdaptiveRival} from './dist/post-rival.mjs';
const fixtures={};for(const kind of ['packed','unpacked','rival','midflight','delivered','empty']){
 const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;startPostOffice(s,'clover-buns');
 if(kind==='unpacked')setPostPackingInput(s,'unfinished count');else packPostTogether(s);
 const cards=kind==='empty'?[]:kind==='delivered'?['go:cafe','give:clover']:['go:orchard','then:hill','then:post','then:orchard','then:cafe','give:clover'];
 for(const card of cards)appendPostClause(s,card);
 if(kind==='midflight')stepPostRoute(s);
 if(kind==='delivered'){stepPostRoute(s);stepPostRoute(s);}
 if(kind==='rival')startAdaptiveRival(s);
 setPostPage(s,'plan');fixtures[kind]=s;
}console.log(JSON.stringify(fixtures));
"""],cwd=ROOT,text=True))
checks=0
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def visit(p):return p.evaluate("()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));const s=JSON.parse(localStorage.getItem('number-garden-v1:'+r.activeId));return s.postOffice.visits.find(v=>v.id===s.postOffice.current);}")
def work(v):return {k:x for k,x in v.items() if k!='postPage'}
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 errors=[]
 try:
  for width in [320,820]:
   for kind,fixture in fixtures.items():
    c=b.new_context(viewport={'width':width,'height':1000},has_touch=True)
    c.add_init_script("if(!localStorage.getItem('flight-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(fixture))+");localStorage.setItem('flight-fixture','1');}")
    p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));p.goto(BASE+'#post');p.locator('#post-route-title').wait_for()
    before=visit(p);buttons=p.locator('.post-route [data-post-to-flight]');ok(buttons.count()==2,'top and bottom flight controls')
    top=buttons.first;ok(top.inner_text()=='Fly this route','clear action label');ok(top.bounding_box()['height']>=44,'touch target')
    ok(top.bounding_box()['y']<p.locator('.post-word-bank').bounding_box()['y'],'flight action before cards');ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no overflow')
    if kind=='packed':
     p.locator('#post-route-title').scroll_into_view_if_needed();p.screenshot(path=str(OUT/f'plan-{width}.jpg'))
     top.focus();p.keyboard.press('Enter')
    else:top.click()
    p.locator('#post-flight-title').wait_for();ok(p.evaluate('document.activeElement.id')=='post-flight-title','focus on flight instructions');ok(work(visit(p))==work(before),'opening flight preserves complete visit work')
    if kind=='unpacked':ok(p.locator('[data-post-to-packing]').count()==1 and p.locator('[data-post-step]').count()==0,'packing requirement preserved')
    elif kind=='rival':ok(p.locator('[data-rival-focus]').count()==1 and p.locator('[data-post-step]').count()==0,'rival gate preserved')
    elif kind=='delivered':ok(p.locator('[data-post-restart]').count()==1 and visit(p)['completed'],'delivered replay remains explicit')
    elif kind!='empty':
     cursor=visit(p)['playback']['cursor'];p.locator('[data-post-step]').click();ok(visit(p)['playback']['cursor']==cursor+1,'only explicit fly advances one instruction')
    p.locator('[data-post-edit-route]').first.click();p.locator('#post-route-title').wait_for();saved=visit(p);p.locator('.post-route [data-post-to-flight]').last.click();p.locator('#post-flight-title').wait_for();ok(work(visit(p))==work(saved),'bottom action also preserves route and cursor')
    p.reload();p.locator('#post-flight-title').wait_for();ok(work(visit(p))==work(saved),'reload preserves tested route')
    c.close()
  ok(not errors,'no page errors: '+str(errors));print(f'Post flight button Chrome: {checks} assertions passed at 320/820 across six delivery states.')
 finally:b.close()
