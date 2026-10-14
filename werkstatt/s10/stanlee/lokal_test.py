# Blatt „Dein eigenes Modell“ gegen raffaels Fake-Ollama: Prüfen → Liste → wählen → Probe. Carl über http (echter Ursprung).
import asyncio, subprocess, sys, time, os
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; HIER=R+'/werkstatt/s10/stanlee/'
ORIGIN='http://127.0.0.1:8765'
srv=subprocess.Popen([sys.executable, R+'/werkstatt/s10/raffael/fake_ollama.py','11434',ORIGIN])
web=subprocess.Popen([sys.executable,'-m','http.server','8765','--bind','127.0.0.1','--directory',R],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1.2)
async def main():
  try:
    async with async_playwright() as p:
      b=await p.chromium.launch()
      for g,vp in [('iphone',{'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True}),('1100',{'viewport':{'width':1100,'height':860}})]:
        ctx=await b.new_context(**vp); pg=await ctx.new_page(); f=[]
        pg.on('pageerror',lambda e: f.append(str(e)))
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' and 'ERR_CONNECTION' not in m.text else None)
        await pg.goto(ORIGIN+'/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("try{C6.rundgang&&C6.rundgang.an&&C6.rundgang.ende()}catch(e){} C6.S.du={fertig:true,name:'nico'};C6.S.radGesehen=1;C6.S.garageGesehen=1;"); await pg.wait_for_timeout(1200)
        await pg.evaluate("C6.geh('fahrrad')"); await pg.wait_for_timeout(800)
        await pg.evaluate("C6.verbindung.oeffneLokal()"); await pg.wait_for_timeout(500)
        await pg.screenshot(path=HIER+'lokal_blatt_'+g+'.png')
        await pg.click('[data-ltun=pruefen]'); await pg.wait_for_timeout(1500)
        print(g,'modelle:',await pg.evaluate("[].map.call(document.querySelectorAll('.c6v-modell'),function(b){return b.textContent+(b.classList.contains('c6v-an')?'*':'')})"))
        await pg.screenshot(path=HIER+'lokal_liste_'+g+'.png')
        await pg.click('[data-modell="gemma4:e2b"]'); await pg.wait_for_timeout(300)
        await pg.click('[data-ltun=probe]'); await pg.wait_for_timeout(2500)
        print(g,'probe:',await pg.evaluate("(document.querySelector('.c6v-probe')||{}).textContent"),'| status',await pg.evaluate("C6.lokal.status()"))
        await pg.evaluate("document.querySelector('.c6v-probe').scrollIntoView()"); await pg.wait_for_timeout(200)
        await pg.screenshot(path=HIER+'lokal_probe_'+g+'.png')
        # Codex-Blatt
        await pg.evaluate("C6.verbindung.zu(); C6.verbindung.oeffne({wer:'codex', wo:'linux'}); document.querySelector('.c6v-codex').open=true"); await pg.wait_for_timeout(400)
        await pg.screenshot(path=HIER+'codex_'+g+'.png', full_page=False)
        print(g,'Fehler:',f)
        await ctx.close()
      await b.close()
  finally:
    srv.terminate(); web.terminate()
asyncio.run(main())
