"""Line Table428: actual-app Chromium with synthetic notebooks and local speech.
One complete four-poem native journey, independent word/line/pause oracles,
actual TXT downloads and bounded responsive and stale-binding probes.
No physical iPad, Safari, audible performance or learning qualification.
"""
import sys
sys.dont_write_bytecode = True
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import traceback

OUT = Path(tempfile.mkdtemp(prefix='lg428-browser-', dir='/private/tmp'))
os.environ['JOIN_PIECES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('poem_actual_app_fixture', Path(__file__).with_name('join-pieces-browser.py'))
host = importlib.util.module_from_spec(spec)
spec.loader.exec_module(host)
host.ROUTE = '#loft/lines'
host.VIEW = '[data-pl-root]'
host.FIXTURE['seed']['poemLines'] = {'version':999,'raw':['synthetic future poem work',17]}
original_go = host.go
def go(p, base, route=host.ROUTE):return original_go(p,base,route)
host.go = go
ok, setup, snapshot, export = host.ok, host.setup, host.snapshot, host.export
VIEW = host.VIEW
# Literal source fixtures, independent of runtime content and partition functions.
POEMS = {
    'lantern':('A light at the gate','I leave a lantern by the gate. Its light stays when I go.',[7],[2,7,10]),
    'rain':('The waiting cup','We wait; the rain taps at the roof. Then one small drop finds the cup.',[8],[2,5,8,12]),
    'bridge':('Warm boards','The bridge remembers nothing of our names, yet every board is warm where we have stood.',[7],[3,7,12]),
    'seeds':('Paper boats','Beyond the window, seeds wait in paper boats. We call them cargo; tomorrow they may become a garden.',[8,12],[3,6,8,12,15]),
}
EXAMPLE = 'We hold the door; the wind comes in.'

def selector(action):return '[data-pl-action="'+action+'"]'
def focus_ok(p):
    ok(p.evaluate('document.activeElement!==document.body&&document.activeElement.isConnected&&!document.activeElement.disabled&&document.activeElement.getClientRects().length>0'),'visible enabled focus')
def act(p,action,key=None):
    q=p.locator(selector(action)).first
    if key:q.focus();p.keyboard.press(key)
    else:q.click()
    focus_ok(p)
def choose(p,ident):
    q=p.locator('[data-pl-start="'+ident+'"]')
    if not q.first.is_visible():q.first.locator('xpath=ancestor::details[1]').locator('summary').click()
    q.first.click();p.locator('[data-pl-view="editor"]').wait_for()
def select(p,position,key=None):
    if key:
        q=p.locator('[data-pl-word="'+str(position)+'"]');q.focus();p.keyboard.press(key)
        ok(p.evaluate('document.activeElement.getAttribute("data-pl-word")')==str(position),'native word selection retains exact word focus')
    else:p.locator('select[data-pl-word-select]').select_option(str(position))
    ok(p.locator('select[data-pl-word-select]').input_value()==str(position),'native select identifies selected position')
    ok(p.locator('[data-pl-word="'+str(position)+'"]').get_attribute('aria-pressed')=='true','selected word aria-pressed')
def pause(p,value,key=None):
    q=p.locator('[data-pl-pause="'+value+'"]')
    if key:q.focus();p.keyboard.press(key)
    else:q.click()
    focus_ok(p)
def rows(p,paper='own'):
    return p.locator('[data-pl-paper="'+paper+'"]').evaluate_all('xs=>xs.map(e=>[...e.querySelectorAll("[data-pl-line]")].map(line=>({n:Number(line.dataset.plLine),words:[...line.querySelectorAll("[data-pl-token]")].map(x=>x.textContent),cues:[...line.querySelectorAll("[data-pl-cue]")].map(x=>({text:x.textContent,previous:x.previousElementSibling?.textContent}))})))')
def partitions(words,breaks):
    result=[];start=0
    for end in sorted(breaks)+[len(words)]:result.append(words[start:end]);start=end
    return result
def paper(p,ident,breaks,pauses=None,kind='own'):
    words=POEMS[ident][1].split();expected=partitions(words,breaks);actual=rows(p,kind)
    ok(len(actual)==1,'one '+kind+' paper')
    ok([r['words'] for r in actual[0]]==expected,'immutable ordered punctuated tokens and chosen line boundaries '+ident+' '+kind)
    ok([r['n'] for r in actual[0]]==list(range(1,len(expected)+1)),'consecutive structural line labels')
    cues=[(r['words'],c) for r in actual[0] for c in r['cues']]
    ok(len(cues)==len(pauses or {}),'exact independent pause count')
    for position,value in (pauses or {}).items():
        line=next(line for start,line in _positions(expected) if start<position<=start+len(line))
        matching=[c for row,c in cues if row==line and c['previous']==words[position-1]]
        ok(len(matching)==1 and matching[0]['text'].strip()==('pause' if value=='brief' else 'longer pause'),'pause cue follows its token inside correct line, including line end')
    return actual
def _positions(lines):
    start=0
    for line in lines:yield start,line;start+=len(line)
def state(p):
    return {'rows':rows(p),'example':rows(p,'example'),'screen':p.locator(VIEW+' [data-pl-view]').get_attribute('data-pl-view'),'frame':p.locator('[data-pl-frame]').get_attribute('data-pl-frame') if p.locator('[data-pl-frame]').count() else None,'reference':p.locator('[data-pl-reference][aria-pressed="true"]').get_attribute('data-pl-reference') if p.locator('[data-pl-reference][aria-pressed="true"]').count() else None,'selected':p.locator('select[data-pl-word-select]').input_value() if p.locator('select[data-pl-word-select]').count() else None}
def layout(p,label):
    p.screenshot(path=str(OUT/(label+'.png')),full_page=True)
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow '+label)
    bad=p.locator(VIEW+' button,'+VIEW+' select,'+VIEW+' a,'+VIEW+' summary').evaluate_all('xs=>xs.filter(e=>!e.closest(".speech-controls,drawn-howto")&&e.checkVisibility()&&(e.getBoundingClientRect().width<43.5||e.getBoundingClientRect().height<43.5||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>e.outerHTML.slice(0,120))')
    ok(not bad,'44px native controls and16px text '+str(bad))
def speech(p,text,example=False):
    p.evaluate('joinSpeech.words=[]')
    p.locator(VIEW+' [data-speak]').filter(has_text='Read example words' if example else 'Read the words').click()
    ok(p.evaluate('joinSpeech.words')==[text],'single flat utterance preserves only exact source words and punctuation')
def speech_contrast(p):
    pairs=p.locator('.speech-controls [data-speech-status],.speech-controls > details > summary,.speech-controls label').evaluate_all("""xs=>xs.filter(e=>e.checkVisibility()).map(e=>{let n=e,bg;while(n){bg=getComputedStyle(n).backgroundColor;if(bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent')break;n=n.parentElement;}return {text:e.textContent,fg:getComputedStyle(e).color,bg};})""")
    def luminance(css):
        import re
        rgb=[float(x)/255 for x in re.findall(r'[\d.]+',css)[:3]]
        ok(len(rgb)==3,'computed opaque speech colors')
        channels=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
        return sum(x*y for x,y in zip(channels,[.2126,.7152,.0722]))
    ok(len(pairs)>=2,'actual native speech status and settings summary visible')
    for pair in pairs:
        a,b=sorted([luminance(pair['fg']),luminance(pair['bg'])])
        ok((b+.05)/(a+.05)>=4.5,'readable actual speech text contrast '+str(pair))

def speech_panel_states(p):
    speech_contrast(p)
    p.locator('[data-stop-speech]').click()
    ok(p.locator('.speech-controls [data-speech-status]').inner_text()=='Voice stopped.','native Stop confirms actual stopped status')
    ok(not p.locator('.speech-controls').evaluate("e=>e.classList.contains('speech-playing')"),'stopped panel no longer uses playing overlay')
    settings=p.locator('.speech-controls > details')
    settings.locator(':scope > summary').click()
    ok(settings.evaluate('e=>e.open') and settings.locator('label:visible').count()==2,'native stopped voice settings and both labels visible')
    speech_contrast(p)
    layout(p,'speech-stopped-settings-820')
    settings.locator(':scope > summary').click()

def speech_panel_probe(browser,base):
    c,p=setup(browser,base)
    try:
        before=snapshot(p);choose(p,'lantern');speech(p,POEMS['lantern'][1]);speech_panel_states(p)
        ok(snapshot(p)==before,'native stopped speech and settings leave notebook and storages unchanged')
    finally:c.close()

def download(p,ident,breaks,pauses):
    with p.expect_download() as pending:act(p,'export')
    d=pending.value
    ok(d.suggested_filename=='line-table-'+ident+'.txt','native TXT filename')
    path=OUT/d.suggested_filename;d.save_as(str(path))
    data=path.read_bytes();text=data.decode('utf-8');title,words,_,_=POEMS[ident]
    poem='\n'.join(' '.join(line) for line in partitions(words.split(),breaks))
    plan='\n'.join(str(position)+': '+words.split()[position-1]+' — '+('pause' if value=='brief' else 'longer pause') for position,value in sorted(pauses.items())) or 'No pause notes.'
    expected=title+'\nArrangement of the given words\n\n'+poem+'\n\nPause plans\n'+plan+'\n\nPause notes are plans for a person; no performance was recorded.\n'
    ok(data==expected.encode('utf-8'),'native download bytes exactly own lines and separate positioned pause plans')
    ok(title in text and 'Arrangement of the given words' in text and 'Pause notes are plans for a person; no performance was recorded.' in text,'TXT explains supplied-word arrangement and planned pauses')
    for position,value in pauses.items():ok(str(position) in text and words.split()[position-1] in text and ('longer pause' if value=='long' else 'pause') in text,'separate positioned pause note')
    ok('explorer' not in text.lower() and 'synthetic' not in text and 'Reference' not in text and 'exportedAt' not in text,'TXT has no identity notebook or hidden reference')
    return data

def journey(browser,base):
    c,p=setup(browser,base)
    try:
        before_export=export(p,base,'notes-before');go(p,base);before=snapshot(p)
        layout(p,'chooser-820');saved={}
        for ident,(_,words,a,b) in POEMS.items():
            choose(p,ident);paper(p,ident,a);select(p,2,'Enter')
            act(p,'break','Space');changed=sorted(set(a)^set([2]));paper(p,ident,changed)
            ok(p.evaluate('document.activeElement.getAttribute("data-pl-action")')=='break','edit restores exact enabled break action')
            pause(p,'brief','Enter');paper(p,ident,changed,{2:'brief'})
            ok(p.evaluate('document.activeElement.getAttribute("data-pl-pause")')=='brief','pause edit restores exact native pause control')
            act(p,'break','Enter');paper(p,ident,a,{2:'brief'})
            act(p,'undo');paper(p,ident,changed,{2:'brief'})
            pause(p,'long','Space');paper(p,ident,changed,{2:'long'})
            pause(p,'long');act(p,'undo');paper(p,ident,changed,{2:'brief'})
            pause(p,'');paper(p,ident,changed);act(p,'undo');paper(p,ident,changed,{2:'brief'})
            select(p,len(words.split()),'Space')
            ok(p.locator(selector('break')).is_disabled() and all(q.is_disabled() for q in p.locator('[data-pl-pause]').all()),'terminal word has no editable break or pause')
            # Repeated tokens remain individually addressable by native select.
            if ident=='lantern':select(p,12);select(p,1);select(p,2)
            else:select(p,2)
            speech(p,words)
            if ident=='lantern':speech_panel_states(p)
            own_download=download(p,ident,changed,{2:'brief'})
            saved[ident]=(changed,{2:'brief'},2)
            act(p,'compare');paper(p,ident,changed,{2:'brief'});paper(p,ident,a,kind='reference')
            p.locator('[data-pl-reference="b"]').click();paper(p,ident,b,kind='reference');paper(p,ident,changed,{2:'brief'})
            layout(p,ident+'-compare-820');speech(p,words);ok(download(p,ident,changed,{2:'brief'})==own_download,'comparison exports own arrangement')
            act(p,'back');paper(p,ident,changed,{2:'brief'})
            ok(p.evaluate('document.activeElement.getAttribute("data-pl-action")')=='compare','comparison Back restores launcher')
            act(p,'reset');paper(p,ident,a);act(p,'undo');paper(p,ident,changed,{2:'brief'})
            layout(p,ident+'-820')
        for ident,(breaks,pauses,selected) in saved.items():
            choose(p,ident);paper(p,ident,breaks,pauses)
            ok(p.locator('select[data-pl-word-select]').input_value()==str(selected),'poem switch retains its own selection')
        live=state(p);act(p,'compare');p.locator('[data-pl-reference="b"]').click();act(p,'example')
        for frame in range(5):
            if frame:act(p,'next')
            expected=partitions(EXAMPLE.split(),[2] if frame in [1,2] else [])
            actual=rows(p,'example')
            ok(len(actual)==(2 if frame in [2,4] else 1) and all([r['words'] for r in page]==expected for page in actual),'actual separate teaching frame '+str(frame+1)+' word/line structure')
            cue_counts=[sum(len(r['cues']) for r in page) for page in actual]
            ok(cue_counts==([1,1] if frame==4 else [0,1] if frame==2 else [1] if frame==3 else [0]),'teaching pause plan phase '+str(frame+1))
            if frame==4:ok('longer pause' in str(actual),'last frame contrasts longer plan on same printed words')
            speech(p,EXAMPLE,True);layout(p,'example-'+str(frame+1)+'-820')
            ok(p.locator(selector('previous')).is_disabled()==(frame==0) and p.locator(selector('next')).is_disabled()==(frame==4),'manual frame ends disabled')
            ok(p.locator(selector('export')).count()==0,'example cannot export child work')
        act(p,'previous');act(p,'back');paper(p,'seeds',POEMS['seeds'][3],kind='reference');act(p,'back');ok(state(p)==live,'example preserves caller reference and own material selection')
        ok(snapshot(p)==before,'actual notebook memory and complete local/session storage unchanged including unknown poemLines')
        ok(export(p,base,'notes-after')==before_export,'actual Notes download unchanged except export time')
    finally:
        if sys.exc_info()[0]:p.screenshot(path=str(OUT/'journey-failure.png'),full_page=True)
        c.close()

def captured(p):return [p.locator(selector('break')).element_handle(),p.locator('[data-pl-word="3"]').element_handle(),p.locator(VIEW+' [data-speak]').filter(has_text='Read the words').element_handle()]
def probe(p,handles,label):
    before=state(p);book=snapshot(p);voice=p.evaluate('JSON.stringify(joinSpeech)')
    for handle in handles:host.dispatch(handle)
    ok(state(p)==before and snapshot(p)==book and p.evaluate('JSON.stringify(joinSpeech)')==voice,'retained native controls inert after '+label)
def fresh(p,base):go(p,base,'#notes');go(p,base);choose(p,'lantern');select(p,2)

def lifecycle(browser,base):
    c,p=setup(browser,base)
    try:
        for change in ['root-hidden','root-inert','root-aria','root-style','root-reparent','root-remove','control-hidden','control-inert','control-style','control-reparent','control-remove']:
            fresh(p,base);speech(p,POEMS['lantern'][1]);handles=captured(p)
            mode=change.split('-')[1]
            mutations={
                'hidden':"e.hidden=true;e.style.display='none';if(getComputedStyle(e).display!=='none')throw Error('hidden not applied');e.hidden=false;e.style.removeProperty('display')",
                'inert':"e.inert=true;if(!e.inert)throw Error('inert not applied');e.inert=false",
                'aria':"e.setAttribute('aria-hidden','true');if(e.getAttribute('aria-hidden')!=='true')throw Error('aria-hidden not applied');e.removeAttribute('aria-hidden')",
                'style':"e.style.display='none';if(getComputedStyle(e).display!=='none')throw Error('style not hidden');e.style.removeProperty('display')",
                'reparent':"const parent=e.parentNode,next=e.nextSibling,holder=document.createElement('div');parent.append(holder);holder.append(e);parent.insertBefore(e,next);holder.remove()",
                'remove':"const parent=e.parentNode,next=e.nextSibling;e.remove();parent.insertBefore(e,next)",
            }
            targets=[p.locator(VIEW).element_handle()] if change.startswith('root') else handles
            for h in targets:h.evaluate('e=>{'+mutations[mode]+'}')
            probe(p,handles,change)
            cancel=p.evaluate('joinSpeech.cancel');p.locator('[data-stop-speech]').first.click();ok(p.evaluate('joinSpeech.cancel')>cancel,'global Stop remains usable')
        for change in ['material','poem','example','route','picker','owner','import','reset','reload']:
            fresh(p,base);handles=captured(p)
            if change=='material':act(p,'break')
            elif change=='poem':choose(p,'rain')
            elif change=='example':act(p,'example');act(p,'next');act(p,'back')
            elif change=='route':
                voice=p.evaluate('joinSpeech.words.slice()');book=snapshot(p)['book']
                p.evaluate("()=>{const old=[document.querySelector('[data-pl-action=break]'),document.querySelector('[data-pl-word=\"3\"]'),document.querySelector('[data-pl-root] [data-speak]')];location.hash='#notes';old.forEach(e=>e.dispatchEvent(new MouseEvent('click',{bubbles:true}))) }")
                p.locator('#download').wait_for();ok(p.evaluate('joinSpeech.words')==voice and snapshot(p)['book']==book,'same-tick route departure refuses stale controls');go(p,base);choose(p,'lantern')
            elif change in ['picker','owner']:
                p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+('explorer-2' if change=='owner' else 'explorer-1')+'"]').click();go(p,base);choose(p,'lantern')
            elif change in ['import','reset']:
                inactive=p.evaluate("()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden-v1:')&&k!=='number-garden-v1:'+id)}")
                go(p,base,'#notes')
                if change=='import':
                    p.locator('#progress-file').set_input_files({'name':'synthetic-poem.json','mimeType':'application/json','buffer':json.dumps(host.FIXTURE['seed']).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
                else:
                    p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function("location.hash==='#home'");p.locator('dialog.welcome-film[open] [data-film-skip]').click()
                ok(p.evaluate('xs=>xs.every(([k,v])=>localStorage.getItem(k)===v)',inactive),'confirmed '+change+' preserves inactive explorer exactly');go(p,base);choose(p,'lantern')
            else:
                act(p,'break');p.reload(wait_until='networkidle');picker=p.locator('[data-select-explorer="explorer-1"]')
                if picker.count():picker.click()
                p.locator('[data-pl-view="chooser"]').wait_for();choose(p,'lantern');paper(p,'lantern',[7])
            if change!='reload':probe(p,handles,change)
            if change in ['route','picker','owner','import','reset']:paper(p,'lantern',[7])
            select(p,4);act(p,'break');paper(p,'rain' if change=='poem' else 'lantern',([4,8] if change=='poem' else [2,4,7] if change=='material' else [4,7]))
        fresh(p,base);act(p,'example');old=[p.locator(selector('next')).element_handle(),p.locator(VIEW+' [data-speak]').element_handle()];act(p,'next');probe(p,old,'example frame change');act(p,'back')
        fresh(p,base);act(p,'compare');old=[p.locator('[data-pl-reference=\"b\"]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()];p.locator('[data-pl-reference=\"b\"]').click();probe(p,old,'reference change')
    finally:
        if sys.exc_info()[0]:p.screenshot(path=str(OUT/'lifecycle-failure.png'),full_page=True)
        c.close()

def responsive_and_unseen(browser,base):
    for width in [320,1024]:
        c,p=setup(browser,base,width)
        try:
            choose(p,'seeds');select(p,12);pause(p,'long');paper(p,'seeds',[8,12],{12:'long'});layout(p,'editor-'+str(width));act(p,'compare');p.locator('[data-pl-reference="b"]').click();paper(p,'seeds',[3,6,8,12,15],kind='reference');layout(p,'compare-'+str(width));act(p,'example')
            for _ in range(4):act(p,'next')
            layout(p,'example-'+str(width))
        finally:c.close()
    c,p=setup(browser,base,unseen=True)
    try:
        expected=json.loads(json.dumps(host.FIXTURE['unseen']));actual=snapshot(p)['book']
        actual.get('garden',{}).pop('avatar',None);expected.get('garden',{}).pop('avatar',None)
        if not actual.get('garden') and 'garden' not in expected:actual.pop('garden',None)
        ok(actual==expected,'unseen direct entry creates no unrelated game state');before=snapshot(p);choose(p,'bridge');select(p,3);act(p,'break');pause(p,'brief');paper(p,'bridge',[3,7],{3:'brief'});ok(snapshot(p)==before,'unseen play creates no notebook or storage record')
    finally:c.close()

def main():
    server=host.Server(('127.0.0.1',0),host.functools.partial(host.Quiet,directory=str(host.ROOT/'dist')))
    host.threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    print('Artifacts: '+str(OUT),flush=True)
    try:
        with host.sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
            try:
                phases={'journey':journey,'lifecycle':lifecycle,'responsive':responsive_and_unseen,'speech':speech_panel_probe}
                for phase in (sys.argv[1:] or ['journey','lifecycle','responsive']):phases[phase](browser,base)
                ok(not host.errors,'no page network HTTP or console errors '+str(host.errors));receipt={'status':'passed','scope':__doc__,'artifacts':str(OUT)};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc()+'\n'+json.dumps(host.errors,indent=2));raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()

if __name__=='__main__':main()
