import sys,asyncio
from playwright.async_api import async_playwright
g=sys.argv[1]; O='/home/claude/carl/n13/werkstatt/s4/leonardo/'
SETUP=open(O+'bild.py').read().split('SETUP="""')[1].split('"""')[0]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); mob=g=='iphone'
        ctx=await b.new_context(viewport={'width':390,'height':844} if mob else {'width':990,'height':1016},device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob)
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate(SETUP); await pg.wait_for_timeout(1500); await pg.evaluate("C6.geh('werkstatt')"); await pg.wait_for_timeout(1500)
        async def tipp(id):
            r=await pg.evaluate("(id)=>{var e=document.querySelector('.c6w-ding[data-id=\"'+id+'\"] .c6w-ding-innen')||document.querySelector('.c6w-ding[data-id=\"'+id+'\"]');var b=e.getBoundingClientRect();return [b.left+b.width/2,b.top+b.height/2]}",id)
            await pg.mouse.click(r[0],r[1])
        async def chip(rx):
            await pg.evaluate("(rx)=>{var b=[].find.call(document.querySelectorAll('.c6k-chips[data-an] button'),b=>new RegExp(rx).test(b.textContent));b&&b.click()}",rx)
        await tipp('skizze'); await pg.wait_for_timeout(2200)
        await pg.screenshot(path=O+'n_frage_%s.png'%g)
        await chip('Gleich hier|Hier'); await pg.wait_for_timeout(2500)
        print('nach hier: proj', await pg.evaluate("!!(C6.projektor&&C6.projektor.offen)"))
        # Skizze: Thema eingeben
        await pg.evaluate("C6.eingabe&&C6.eingabe.setze?0:0")
        await pg.fill('.c6k-feld','Ordner am PC'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(5000)
        for i in range(3):
            await chip('.'); await pg.wait_for_timeout(3500)
        await pg.screenshot(path=O+'n_lauf_%s.png'%g)
        print('perlen', await pg.evaluate("C6.strings.alle().map(s=>s.titel+':'+(s.perlen||[]).length).join(',')"), 'chips', await pg.evaluate("[].map.call(document.querySelectorAll('.c6k-chips[data-an] button'),b=>b.textContent)"))
        await pg.evaluate("C6.projektor&&C6.projektor.offen&&C6.projektor.zu()"); await pg.wait_for_timeout(800)
        await tipp('tuer'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=O+'n_stube_%s.png'%g)
        await pg.evaluate("var e=document.querySelector('.c6k-fd-hoch');e&&e.click()"); await pg.wait_for_timeout(900)
        print('stube nach fd-hoch offen?', await pg.evaluate("!document.querySelector('.c6w-stube').hidden && document.querySelector('.c6w-stube').classList.contains('c6w-an')"))
        print('Fehler',f); await b.close()
asyncio.run(main())
