# Echter Durchlauf: Blatt öffnen, angezeigte Zeile im Terminal (Fake-claude) ausführen, Code eintippen, UFO wacht auf
import sys,asyncio,subprocess,os
from playwright.async_api import async_playwright
w,h,pre=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3]
FAKE=sys.argv[4]  # Ordner mit fake claude/codex
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        mob=w<600
        ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob)
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("try{C6.rundgang&&C6.rundgang.an&&C6.rundgang.ende()}catch(e){} C6.S.du={fertig:true,name:'nico'};C6.S.radGesehen=1;C6.S.garageGesehen=1;"); await pg.wait_for_timeout(1500)
        await pg.evaluate("C6.geh('fahrrad')"); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.querySelector('.c6s-g-ufo').click()"); await pg.wait_for_timeout(1500)
        await pg.evaluate("[].forEach.call(document.querySelectorAll('.c6v-chip'),function(c){if(c.textContent==='Linux')c.click(); if(c.textContent==='Codex statt Claude Code')c.click()}); document.querySelector('.c6v-sehen').open=true; document.querySelector('.c6v-codex').open=true"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=pre+'_blatt.png',full_page=False)
        zeile=await pg.inner_text('.c6v-sehen .c6v-zeile code')
        env=dict(os.environ,PATH=FAKE+':'+os.environ['PATH'])
        aus=subprocess.run(['bash','-c',zeile],capture_output=True,text=True,env=env).stdout.strip()
        print('Terminal:',aus)
        await pg.fill('.c6v-feld','111111'); await pg.click('.c6v-form button'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=pre+'_falsch.png')
        await pg.fill('.c6v-feld',aus.split(': ')[1]); await pg.click('.c6v-form button'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=pre+'_passt.png')
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path=pre+'_wacht.png')
        await pg.wait_for_timeout(2000)
        print('Status:',await pg.evaluate("C6.verbindung.status()+' '+JSON.stringify(C6.verbindung.info())"))
        await pg.screenshot(path=pre+'_ufo.png')
        await pg.evaluate("document.querySelector('.c6s-g-ufo').click()"); await pg.wait_for_timeout(800)
        print('Einrichten offen:',await pg.evaluate("C6.einrichten.offen"))
        print('Fehler:',f)
        await b.close()
asyncio.run(main())
