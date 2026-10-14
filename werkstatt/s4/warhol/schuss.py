import asyncio,sys,json
from playwright.async_api import async_playwright
OUT='/home/claude/carl/n13/werkstatt/s4/warhol/'
GER={'iphone':dict(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True),'computer':dict(viewport={'width':1100,'height':780})}
# Aufruf: schuss.py praefix  -> macht menue/fahrt/ende fuer beide Geraete
SZ=[('menue',"C6.kieselpark.auf({})",500),
    ('fahrt',"C6.kieselpark.auf({park:'hof'});setTimeout(function(){C6.kieselpark._setze({x:250,f:1,v:160})},300)",900),
    ('ende',"C6.kieselpark.auf({park:'hof'});setTimeout(function(){var g=C6.kieselpark._gel();C6.kieselpark._setze({x:g.ziel-70,f:1,v:160,rest:21})},300)",3200)]
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for ger in ['iphone','computer']:
            for n,js,w in SZ:
                ctx=await b.new_context(**GER[ger]);pg=await ctx.new_page();f=[]
                pg.on('console',lambda m:f.append(m.text) if m.type=='error' else None);pg.on('pageerror',lambda e:f.append(str(e)))
                await pg.goto('file:///home/claude/carl/n13/carl6-test.html');await pg.wait_for_timeout(600)
                await pg.evaluate("C6.S.du={fertig:true,name:'nico'};"+js);await pg.wait_for_timeout(w)
                await pg.screenshot(path=OUT+sys.argv[1]+'_'+n+'_'+ger+'.png')
                await pg.evaluate("C6.kieselpark.zu()");await pg.wait_for_timeout(300)
                print(n,ger,'raf',await pg.evaluate("C6.kieselpark._zustand().raf"),'Fehler',f);await ctx.close()
        await b.close()
asyncio.run(m())
