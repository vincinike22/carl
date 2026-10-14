import asyncio
from playwright.async_api import async_playwright
OUT = '/home/claude/carl/n13/werkstatt/s2/warhol/'
GER = {'iphone': dict(viewport={'width': 390, 'height': 844}, device_scale_factor=3, is_mobile=True, has_touch=True),
       'computer': dict(viewport={'width': 1440, 'height': 900})}
SZENEN = [
  ('iphone', 'hof', 'start', "", 300),
  ('iphone', 'hof', 'grind', "var K=C6.kieselpark,r=K._gel().rails[0];K._setze({x:r.x1+20});K._setze({st:'luft',y:r.y+20,vx:330,vy:-40,f:1,spin:0,w:0,luft:{t:.5,x0:r.x1,xm0:r.x1,maxY:r.y+30,y0:r.y},basis:0,v:330,rest:41})", 330),
  ('computer', 'dach', 'luecke', "var K=C6.kieselpark,z=K._gel().zonen[0];K._setze({x:z.von-130,v:470,f:1,st:'boden',rest:37});setTimeout(function(){K._salto(1)},560)", 820),
  ('iphone', 'pipe', 'air', "var K=C6.kieselpark;K._setze({x:518,v:780,f:1,st:'boden',rest:50})", 1250),
  ('computer', 'pipe', 'air', "var K=C6.kieselpark;K._setze({x:518,v:780,f:1,st:'boden',rest:50})", 1250),
  ('computer', 'hof', 'kiste', "var K=C6.kieselpark,z=K._gel().zonen[0];K._setze({x:z.von-200,v:400,f:1,st:'boden',rest:22})", 900),
  ('iphone', 'dach', 'ende', "var K=C6.kieselpark;K._setze({rest:0.3})", 900),
  ('computer', 'hof', 'ende', "var K=C6.kieselpark;K._setze({rest:0.3})", 900),
  ('iphone', None, 'karte', "", 400),
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
