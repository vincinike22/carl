import sys,asyncio
from playwright.async_api import async_playwright
geraet,js,png=sys.argv[1],sys.argv[2],sys.argv[3]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        if geraet=='iphone': ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True)
        else: ctx=await b.new_context(viewport={'width':1440,'height':900},device_scale_factor=1)
        pg=await ctx.new_page(); fehler=[]
        pg.on('console',lambda m: fehler.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: fehler.append(str(e)))
        await pg.goto('file:///home/claude/carl/carl6-test.html'); await pg.wait_for_timeout(800)
        if js: await pg.evaluate(js); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=png)
        print('Fehler:',fehler)
        await b.close()
asyncio.run(main())
