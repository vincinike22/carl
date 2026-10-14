import asyncio
from playwright.async_api import async_playwright
OUT = '/home/claude/carl/n13/werkstatt/s3/warhol/'
GER = {'iphone': dict(viewport={'width': 390, 'height': 844}, device_scale_factor=3, is_mobile=True, has_touch=True),
       'computer': dict(viewport={'width': 1440, 'height': 900})}
SZENEN = [
  ('iphone', 'hof', 'treppe', "var K=C6.kieselpark;K._setze({x:250,f:1,v:160,rest:70})", 650),
  ('computer', 'hof', 'salto', "var K=C6.kieselpark;K._setze({x:200,f:1,v:280,rest:66});setTimeout(function(){K._hopp(1);setTimeout(function(){K._salto(-1)},90)},230)", 760),
  ('computer', 'dach', 'luecke', "var K=C6.kieselpark;K._setze({x:330,f:1,v:300,rest:60})", 1150),
  ('computer', 'dach', 'planke', "var K=C6.kieselpark,g=K._gel(),r=g.rails[g.rails.length-1];K._setze({x:r.x1-140,f:1,v:260,rest:30})", 700),
  ('iphone', 'pipe', 'bowl', "var K=C6.kieselpark;K._setze({x:420,f:1,v:430,rest:50})", 1000),
  ('computer', 'pipe', 'bowl', "var K=C6.kieselpark;K._setze({x:420,f:1,v:430,rest:50})", 1000),
  ('iphone', 'hof', 'ziel', "var K=C6.kieselpark,g=K._gel();K._setze({x:g.ziel-120,f:1,v:200,rest:21})", 1100),
  ('computer', 'hof', 'ende', "var K=C6.kieselpark,g=K._gel();K._setze({x:g.ziel-120,f:1,v:200,rest:21})", 3200),
]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for ger, park, name, js, warte in SZENEN:
            ctx = await b.new_context(**GER[ger]); pg = await ctx.new_page(); f = []
            pg.on('console', lambda m: f.append(m.text) if m.type == 'error' else None)
            pg.on('pageerror', lambda e: f.append(str(e)))
            await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(600)
            await pg.evaluate("C6.S.du={fertig:true,name:'nico'};C6.kieselpark.auf(%s)" % ("{park:'%s'}" % park if park else "{}"))
            await pg.wait_for_timeout(500)
            if js: await pg.evaluate(js)
            await pg.wait_for_timeout(warte)
            pfad = OUT + 'k_%s_%s_%s.png' % (park or 'menue', name, ger)
            await pg.screenshot(path=pfad)
            await pg.evaluate("C6.kieselpark.zu()"); await pg.wait_for_timeout(350)
            raf = await pg.evaluate("C6.kieselpark._zustand().raf")
            print(pfad.split('/')[-1], 'raf nach zu:', raf, 'Fehler:', f)
            await ctx.close()
        await b.close()
asyncio.run(main())
