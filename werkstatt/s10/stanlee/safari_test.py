import asyncio
from playwright.async_api import async_playwright
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1100,'height':860},user_agent=UA)
        pg=await ctx.new_page(); f=[]
        pg.on('pageerror',lambda e: f.append(str(e))); pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
        await pg.add_init_script("Object.defineProperty(navigator,'vendor',{get:()=>'Apple Computer, Inc.'})")
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("try{C6.rundgang&&C6.rundgang.an&&C6.rundgang.ende()}catch(e){} C6.S.du={fertig:true,name:'nico'};"); await pg.wait_for_timeout(1000)
        await pg.evaluate("C6.geh('fahrrad'); C6.verbindung.oeffneLokal()"); await pg.wait_for_timeout(600)
        print('browser',await pg.evaluate("C6.lokal.browser()"),'| Prüfen gesperrt:',await pg.evaluate("document.querySelector('[data-ltun=pruefen]').disabled"))
        await pg.screenshot(path='lokal_safari_1100.png'); print('Fehler',f)
        await pg.evaluate("C6.verbindung.zu(); C6.verbindung.oeffne({wer:'codex',wo:'server'}); document.querySelector('.c6v-codex').open=true; document.querySelector('.c6v-blatt').scrollTop=260"); await pg.wait_for_timeout(400)
        await pg.screenshot(path='codex_server_1100.png')
        await b.close()
asyncio.run(main())
