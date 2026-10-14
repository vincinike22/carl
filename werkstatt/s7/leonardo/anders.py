import asyncio,sys
from playwright.async_api import async_playwright
O='/home/claude/carl/n13/werkstatt/s7/leonardo/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); g=sys.argv[1]; mob=g=='iphone'
        ctx=await b.new_context(viewport={'width':390,'height':844} if mob else {'width':1100,'height':860},device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob)
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("""try{C6.rundgang&&C6.rundgang.an&&C6.rundgang.ende()}catch(e){} C6.S.du={fertig:true,name:'nico'}; if(!C6.strings.alle().length){C6.space.neu('probe',{oeffnen:false});}""")
        await pg.wait_for_timeout(1200); await pg.evaluate("C6.geh('werkstatt')"); await pg.wait_for_timeout(1500)
        await pg.evaluate("var s=C6.strings.alle()[0].id;window.__w=C6.werkzeug.haenge({name:'Gelaufen?',zeichen:'haken',farbe:'#5f7f3e',satz:'Ich will jeden Tag sehen, ob ich gelaufen bin.',teile:[{t:'haken',text:'Ich will jeden Tag sehen, ob ich gelaufen bin.'}]},s).id;C6.bus.emit('werkzeug-eigen',{was:'gehaengt'})")
        await pg.wait_for_timeout(300)
        if not mob:
            await pg.click('.c6w-anh'); 
        else:
            await pg.evaluate("C6.werkzeug.gross(window.__w)")
        await pg.wait_for_timeout(600)
        await pg.click('.c6wz-heute'); await pg.wait_for_timeout(300)
        await pg.click('[data-w=anders]'); await pg.wait_for_timeout(500)
        print('Platzhalter', await pg.evaluate("document.querySelector('.c6k-feld').placeholder"))
        await pg.fill('.c6k-feld','Ich will auch wissen, wie viele Kilometer'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=O+'anders_vorschau_%s.png'%g)
        print('Vorschau', await pg.evaluate("document.querySelector('.c6wz-vorschau').innerText.replace(/\\n+/g,' | ')"))
        await pg.click('[data-w=passt]'); await pg.wait_for_timeout(600)
        print('nachher', await pg.evaluate("var w=C6.werkzeug.hol(window.__w);JSON.stringify([w.name,w.zeichen,w.teile.map(t=>t.t+(t.einheit?':'+t.einheit:'')),C6.S.werkzeug.daten[w.id]])"))
        await pg.screenshot(path=O+'anders_nachher_%s.png'%g)
        # Ferdl am Tisch
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
        await pg.evaluate("document.querySelector('.c6w-ding[data-id=helfer]').dispatchEvent(new MouseEvent('click',{bubbles:true}))"); await pg.wait_for_timeout(700)
        print('Tisch', await pg.evaluate("document.querySelector('.c6w-helfer-blatt').innerText.replace(/\\n+/g,' | ').slice(0,260)"), '| Schild', await pg.evaluate("document.querySelector('.c6w-g-tuer .c6w-schild').textContent"))
        print('Fehler',f); await b.close()
asyncio.run(main())
