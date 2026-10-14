# python3 gang.py <praefix> [iphone|computer|beide]  -> Bilder jeder Station des Rundgangs
import sys,asyncio
from playwright.async_api import async_playwright
pre=sys.argv[1]; was=sys.argv[2] if len(sys.argv)>2 else 'beide'
D='/home/claude/carl/n13/werkstatt/s6/shakespeare/'
GER={'iphone':dict(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True),
     'computer':dict(viewport={'width':1100,'height':860},device_scale_factor=1)}
async def lauf(p,g):
    b=await p.chromium.launch(); ctx=await b.new_context(**GER[g]); pg=await ctx.new_page(); f=[]
    pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: f.append(str(e)))
    await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.evaluate('localStorage.clear()')
    await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(2600)
    async def shot(n): await pg.screenshot(path=f'{D}{pre}_{n}_{g}.png')
    async def satz(): return await pg.evaluate("(document.querySelector('.c6r-satz')||{}).textContent||''")
    await shot('1wecken')
    await pg.click('.c6r-carl'); await pg.wait_for_timeout(1500); await shot('2wach')
    await pg.wait_for_timeout(1800); await shot('3name')
    await pg.fill('.c6r-feld','nico'); await pg.click('.c6r-los'); await pg.wait_for_timeout(2800); await shot('4gedanke')
    await pg.fill('.c6r-feld','Ein Obstgarten für die ganze Straße'); await pg.click('.c6r-los'); await pg.wait_for_timeout(3600); await shot('5space')
    await pg.click('.c6r-chip'); await pg.wait_for_timeout(3200); await shot('6planet')
    await pg.click('.c6r-chip'); await pg.wait_for_timeout(2800); await shot('7socken')
    await pg.click('.c6r-chip >> nth=0'); await pg.wait_for_timeout(4200); await shot('8zuhause')
    print(await pg.evaluate("JSON.stringify({sid:C6.S.rundgang.sid, sp:Object.keys(C6.S.spaces||{}).length, n:(C6.S.spaces[C6.S.rundgang.sid]||{}).notizen, strings:C6.strings.alle().map(s=>s.titel)})"))
    print(g,'Fehler:',f)
    await b.close()
async def main():
    async with async_playwright() as p:
        for g in (['iphone','computer'] if was=='beide' else [was]): await lauf(p,g)
asyncio.run(main())
