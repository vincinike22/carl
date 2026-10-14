import sys,asyncio
from playwright.async_api import async_playwright
# python3 bild.py <breite> <hoehe> <out.png> [JS nach dem Betreten]
w,h,out=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3]; js=sys.argv[4] if len(sys.argv)>4 else ''
SETUP="""try{C6.rundgang&&C6.rundgang.an&&C6.rundgang.ende()}catch(e){} C6.S.du={fertig:true,name:"nico"};
if(!C6.strings.alle().length){C6.space.neu('he',{oeffnen:false}); var p=C6.space.neu('probe',{oeffnen:false}); C6.S.spaces[p].notizen=['Ordner sichten','Fotos sortieren','Backup machen','Mails löschen'].map((t,i)=>({t:t,ts:Date.now()-i*1000}));}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        mob=w<600
        ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob)
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate(SETUP); await pg.wait_for_timeout(1500)
        await pg.evaluate("C6.geh('werkstatt')"); await pg.wait_for_timeout(1500)
        if js:
            await pg.evaluate(js); await pg.wait_for_timeout(1600)
        await pg.screenshot(path=out)
        print('Fehler:',f)
        await b.close()
asyncio.run(main())
