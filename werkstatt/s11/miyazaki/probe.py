# Probe der Werkstatt s11: Lupe, Lampe, Lochwand (ziehen), Bau aus Bausteinen, Halten („Wie geht das?“), Tageszeit.
import sys, asyncio
from playwright.async_api import async_playwright
geraet = sys.argv[1] if len(sys.argv) > 1 else 'computer'
OUT = '/home/claude/carl/n13/werkstatt/s11/miyazaki/'
SETUP = "try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});setTimeout(function(){C6.geh('werkstatt')},700)"
async def mitte(pg, sel):
    return await pg.evaluate("(s)=>{var e=document.querySelector(s);if(!e)return null;var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}}", sel)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        if geraet == 'iphone': ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=3, is_mobile=True, has_touch=True)
        else: ctx = await b.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
        pg = await ctx.new_page(); fehler = []
        pg.on('console', lambda m: fehler.append(m.text) if m.type == 'error' else None)
        pg.on('pageerror', lambda e: fehler.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate(SETUP); await pg.wait_for_timeout(1500)
        # 1 Lupe
        m = await mitte(pg, '.c6w-lupe .c6w-treffer'); await pg.mouse.click(m['x'], m['y']); await pg.wait_for_timeout(700)
        an = await pg.evaluate("!!document.querySelector('.c6w-lupe.c6w-lupe-an')"); print('Lupe an:', an)
        await pg.screenshot(path=OUT + 'lupe_' + geraet + '.png')
        m = await mitte(pg, '.c6w-lupe .c6w-treffer'); await pg.mouse.click(m['x'], m['y']); await pg.wait_for_timeout(500)
        print('Lupe zu:', not await pg.evaluate("!!document.querySelector('.c6w-lupe.c6w-lupe-an')"))
        # 2 Lampe aus
        m = await mitte(pg, '.c6w-lampe .c6w-treffer'); await pg.mouse.click(m['x'], m['y']); await pg.wait_for_timeout(1100)
        print('dunkel:', await pg.evaluate("document.querySelector('.c6w-szene').classList.contains('c6w-lampe-aus')"), 'S:', await pg.evaluate("C6.S.werkstatt&&C6.S.werkstatt.lampe"))
        await pg.screenshot(path=OUT + 'lampe_aus_' + geraet + '.png')
        # Halten auf der Lampe: Wie geht das?
        m = await mitte(pg, '.c6w-lampe .c6w-treffer'); await pg.mouse.move(m['x'], m['y']); await pg.mouse.down(); await pg.wait_for_timeout(800); await pg.mouse.up(); await pg.wait_for_timeout(600)
        print('Staunen-Satz (Lampe aus):', await pg.evaluate("C6.staunen.text('werkstatt.lampe')"))
        print('Staunen gesehen:', await pg.evaluate("C6.staunen.alle()"), '| dunkel bleibt:', await pg.evaluate("document.querySelector('.c6w-szene').classList.contains('c6w-lampe-aus')"))
        await pg.screenshot(path=OUT + 'staunen_lampe_' + geraet + '.png')
        await pg.wait_for_timeout(1500)
        m = await mitte(pg, '.c6w-lampe .c6w-treffer'); await pg.mouse.click(m['x'], m['y']); await pg.wait_for_timeout(900)
        print('hell:', not await pg.evaluate("document.querySelector('.c6w-szene').classList.contains('c6w-lampe-aus')"))
        # 3 Neues Werkzeug entsteht an der Lochwand (Bau aus Bausteinen)
        await pg.evaluate("C6.werkzeug.haenge({name:'Lesen',zeichen:'zaehler',farbe:'#2c7a6e',teile:[{t:'zaehler',text:'Seiten'}]},null)")
        await pg.wait_for_timeout(520)
        bau = await pg.evaluate("(()=>{var b=document.querySelector('.c6w-bau');if(!b)return null;var r=b.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})()")
        print('Bau groß in der Mitte (px):', bau)
        await pg.screenshot(path=OUT + 'bau_mitten_' + geraet + '.png')
        await pg.wait_for_timeout(800); await pg.screenshot(path=OUT + 'bau_fliegt_' + geraet + '.png')
        await pg.wait_for_timeout(900)
        print('Bau fertig, Werkzeug am Haken sichtbar:', await pg.evaluate("!document.querySelector('.c6w-bau') && getComputedStyle(document.querySelector('.c6w-anh .c6w-ding-innen')).opacity==='1'"))
        # Treffer ≥ 44 px
        print('Treffer Anhänger/Lupe (px):', await pg.evaluate("['.c6w-anh .c6w-treffer','.c6w-lupe .c6w-treffer','.c6w-fenster-ding .c6w-treffer'].map(q=>{var r=document.querySelector(q).getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})"))
        # Fenster-Tipp: ein Satz zur Tageszeit
        m = await mitte(pg, '.c6w-fenster-ding .c6w-treffer'); await pg.mouse.click(m['x'], m['y']); await pg.wait_for_timeout(900)
        print('Fenster-Satz:', await pg.evaluate("(document.querySelector('.c6k-blase')||{}).textContent||''"))
        await pg.evaluate("C6.werkzeug.haenge({name:'Wasser',zeichen:'haken',farbe:'#4f7fa8',teile:[{t:'haken',text:'Trinken'}]},null)")
        await pg.wait_for_timeout(1600)
        ids = await pg.evaluate("[].map.call(document.querySelectorAll('.c6w-anh'),e=>e.getAttribute('data-id')+'@'+e.getAttribute('data-hx'))"); print('Lochwand:', ids)
        # 4 Ziehen: das zweite an den ersten Haken
        a = await mitte(pg, '.c6w-anh[data-hx="62"] .c6w-treffer'); z = await mitte(pg, '.c6w-anh[data-hx="22"] .c6w-treffer')
        await pg.mouse.move(a['x'], a['y']); await pg.mouse.down(); await pg.mouse.move(a['x'] - 10, a['y'] + 4, steps=3); await pg.mouse.move(z['x'], z['y'] + 6, steps=8)
        await pg.screenshot(path=OUT + 'zieht_' + geraet + '.png')
        await pg.mouse.up(); await pg.wait_for_timeout(700)
        ids2 = await pg.evaluate("[].map.call(document.querySelectorAll('.c6w-anh'),e=>e.getAttribute('data-id')+'@'+e.getAttribute('data-hx'))"); print('nach Ziehen:', ids2, 'S:', await pg.evaluate("JSON.stringify(C6.S.werkstatt.lochwand)"))
        print('kein Blatt offen (Ziehen ist kein Tipp):', await pg.evaluate("!document.querySelector('.c6wz-gross, .c6w-tb.c6w-an')"))
        # 5 Tageszeit: Abend und Nacht im Fenster
        await pg.evaluate("C6.tageszeit.setze('abend')"); await pg.wait_for_timeout(400)
        print('Fenster:', await pg.evaluate("document.querySelector('.c6w-g-fenster').getAttribute('data-tageszeit')"))
        await pg.screenshot(path=OUT + 'nachher_' + geraet + '.png')
        await pg.evaluate("C6.tageszeit.setze('nacht')"); await pg.wait_for_timeout(400)
        m = await mitte(pg, '.c6w-lampe .c6w-treffer'); await pg.mouse.click(m['x'], m['y']); await pg.wait_for_timeout(1100)
        await pg.screenshot(path=OUT + 'nacht_lampe_aus_' + geraet + '.png')
        print('Fehler:', fehler)
        await b.close()
asyncio.run(main())
