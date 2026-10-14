import asyncio, sys
from playwright.async_api import async_playwright
geraet, ms, png = sys.argv[1], int(sys.argv[2]), sys.argv[3]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        if geraet=='iphone': ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True)
        else: ctx=await b.new_context(viewport={'width':1440,'height':900})
        pg=await ctx.new_page(); fehler=[]
        pg.on('console',lambda m: fehler.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: fehler.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});setTimeout(function(){C6.geh('bibliothek')},700)")
        await pg.wait_for_timeout(2200)
        await pg.evaluate("document.querySelector('[data-id=\"lexikon\"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))")
        await pg.wait_for_timeout(ms)
        await pg.screenshot(path=png); print('Fehler:', fehler)
        await b.close()
asyncio.run(main())
