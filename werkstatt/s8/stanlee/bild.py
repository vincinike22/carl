import sys,asyncio
from playwright.async_api import async_playwright
# bild.py <breite> <hoehe> <out.png> [JS] [JS2 nach Wartezeit]
w,h,png=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3]
js=sys.argv[4] if len(sys.argv)>4 else ''
js2=sys.argv[5] if len(sys.argv)>5 else ''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        if w<500: ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=True,has_touch=True)
        else: ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=1)
        pg=await ctx.new_page(); fehler=[]
        pg.on('console',lambda m: fehler.append(m.text) if m.type in ('error','warning') else None)
        pg.on('pageerror',lambda e: fehler.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("try{C6.rundgang&&C6.rundgang.an&&C6.rundgang.ende()}catch(e){} C6.S.du={fertig:true,name:'nico'};C6.S.radGesehen=1;C6.S.ladenZimmer=1;C6.S.garageGesehen=1; if(!C6.strings.alle().length){C6.space.neu('Gartenhaus',{oeffnen:false});}"); await pg.wait_for_timeout(1500)
        if js: await pg.evaluate(js); await pg.wait_for_timeout(1400)
        if js2: await pg.evaluate(js2); await pg.wait_for_timeout(1400)
        await pg.screenshot(path=png)
        print('Fehler:',fehler)
        await b.close()
asyncio.run(main())
