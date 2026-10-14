import asyncio, sys
from playwright.async_api import async_playwright
geraet = sys.argv[1]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        if geraet=='iphone': ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        else: ctx=await b.new_context(viewport={'width':1440,'height':900})
        pg=await ctx.new_page(); fehler=[]
        pg.on('console',lambda m: fehler.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: fehler.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});window._st=[];C6.bus.on('staunen',function(d){window._st.push(d.id)});setTimeout(function(){C6.geh('bibliothek')},700)")
        await pg.wait_for_timeout(2200)
        # 1 echter Weg: Lexikon ziehen
        await pg.evaluate("document.querySelector('[data-id=\"lexikon\"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))")
        seen=[]
        for i in range(14):
            await pg.wait_for_timeout(300)
            seen.append(await pg.evaluate("[C6.jetzt, !!document.querySelector('.c6w-ls-hinab'), (document.querySelector('.c6w-ls-hinab')||{}).className||'']"))
        print('Weg durch die Tür:', seen[::2])
        print('Angekommen:', await pg.evaluate("C6.jetzt"), 'Overlay weg:', await pg.evaluate("!document.querySelector('.c6w-ls-hinab')"))
        # 2 Kerze
        print('Kerze vorher:', await pg.evaluate("!!(C6.S.lesesaal||{}).kerze"))
        await pg.evaluate("document.querySelector('.c6w-ls-kerze').dispatchEvent(new MouseEvent('click',{bubbles:true}))")
        await pg.wait_for_timeout(300)
        print('Kerze an:', await pg.evaluate("[!!C6.S.lesesaal.kerze, document.querySelector('.c6-buehne[data-raum=lesesaal], .c6w-lesesaal').classList.contains('c6w-ls-kerze-an'), document.querySelector('.c6w-ls-kerze').getAttribute('aria-pressed')]"))
        await pg.wait_for_timeout(900)
        print('Carl sagt:', await pg.evaluate("(document.querySelector('.c6-blase, [class*=blase]')||{}).textContent||''"))
        await pg.evaluate("document.querySelector('.c6w-ls-kerze').dispatchEvent(new MouseEvent('click',{bubbles:true}))")
        await pg.wait_for_timeout(200)
        print('Kerze aus:', await pg.evaluate("[!!C6.S.lesesaal.kerze, document.querySelector('.c6w-ls-kerze').classList.contains('c6w-ls-blaest')]"))
        # 3 Sterne wandern
        box = await pg.evaluate("(function(){var r=document.querySelector('.c6w-lesesaal .c6w-raum').getBoundingClientRect();return [r.left+r.width/2, r.top+40]})()")
        await pg.mouse.move(box[0], box[1]); await pg.wait_for_timeout(120); await pg.mouse.move(box[0]+30, box[1]+10); await pg.wait_for_timeout(700)
        print('Sterne bewegt:', await pg.evaluate("[].filter.call(document.querySelectorAll('.c6w-ls-himmel circle'),function(c){return c.getAttribute('transform')&&c.getAttribute('transform')!=='translate(0.00 0.00)'}).length"))
        # 4 Halten auf der Kerze → Staunen
        kb = await pg.evaluate("(function(){var r=document.querySelector('.c6w-ls-kerze rect:last-child').getBoundingClientRect();return [r.left+r.width/2, r.top+r.height/2]})()")
        await pg.mouse.move(kb[0], kb[1]); await pg.mouse.down(); await pg.wait_for_timeout(800); await pg.mouse.up(); await pg.wait_for_timeout(300)
        print('Staunen:', await pg.evaluate("window._st"), 'Kerze unverändert:', await pg.evaluate("!C6.S.lesesaal.kerze"))
        # 5 Dein Platz + Porträt
        await pg.evaluate("document.querySelector('.c6w-ls-platz').dispatchEvent(new MouseEvent('click',{bubbles:true}))"); await pg.wait_for_timeout(600)
        print('Platz, Ansicht offen?', await pg.evaluate("C6.lesesaal.ansicht"), 'Carl:', await pg.evaluate("(document.querySelector('.c6-blase, [class*=blase]')||{}).textContent||''"))
        print('Himmel-Halten trifft Griff:', await pg.evaluate("(function(){var r=document.querySelector('.c6w-lesesaal .c6w-raum').getBoundingClientRect();var e=document.elementFromPoint(r.left+r.width*0.6, r.top+(r.width<600?110:40));return e&&e.className.baseVal||e&&e.className})()"))
        hp = await pg.evaluate("(function(){var r=document.querySelector('.c6w-lesesaal .c6w-raum').getBoundingClientRect();return [r.left+r.width*0.6, r.top+(r.width<600?110:40)]})()")
        await pg.mouse.move(hp[0], hp[1]); await pg.mouse.down(); await pg.wait_for_timeout(800); await pg.mouse.up(); await pg.wait_for_timeout(300)
        print('Staunen Himmel:', await pg.evaluate("window._st"))
        print('Kerze-Satz aus (wahr):', await pg.evaluate("C6.staunen.text('lesesaal.kerze')"))
        await pg.evaluate("document.querySelector('.c6w-ls-portraet').dispatchEvent(new MouseEvent('click',{bubbles:true}))"); await pg.wait_for_timeout(1300)
        print('Oval leer → Meister eintragen:', await pg.evaluate("[C6.lesesaal.ansicht, document.activeElement && document.activeElement.id]"))
        print('Ovale Trefferfläche px:', await pg.evaluate("(function(){var r=document.querySelector('.c6w-ls-r-meister .c6w-ls-ovale rect').getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})()"), 'Platz-Text px:', await pg.evaluate("(function(){var t=document.querySelector('.c6w-ls-r-meister .c6w-ls-platztext');var r=t.getBoundingClientRect();return Math.round(r.height)})()"))
        await pg.fill('#c6w-ls-mname', 'Oma Hilde'); await pg.evaluate("document.querySelector('.c6w-ls-mneu').requestSubmit()"); await pg.wait_for_timeout(500)
        print('Meister eingetragen, Licht:', await pg.evaluate("[C6.S.meister.length, document.querySelectorAll('.c6w-ls-r-meister .c6w-ls-hatlicht').length]"))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(500)
        await pg.evaluate("document.querySelector('.c6w-ls-portraet.c6w-ls-hatlicht').dispatchEvent(new MouseEvent('click',{bubbles:true}))"); await pg.wait_for_timeout(1200)
        print('Oval mit Licht → dieselbe Karte (Liste):', await pg.evaluate("[C6.lesesaal.ansicht, C6.lesesaal.karte, document.querySelectorAll('.c6w-ls-r-meister .c6w-ls-ini').length]"))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
        # 6 Abbruch durch Tipp
        await pg.evaluate("C6.geh('bibliothek')"); await pg.wait_for_timeout(900)
        await pg.evaluate("window._t1=performance.now();document.querySelector('[data-id=\"lexikon\"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))")
        zw=[]
        for i in range(10):
            await pg.wait_for_timeout(150); zw.append(await pg.evaluate("[Math.round(performance.now()-window._t1), C6.jetzt, !!document.querySelector('.c6w-ls-hinab')]"))
        print('Zweiter Gang (ms, Raum, Treppe):', zw)
        await pg.wait_for_timeout(300)
        await pg.evaluate("C6.geh('bibliothek')"); await pg.wait_for_timeout(900)
        await pg.evaluate("C6.lesesaal.hinab({})"); await pg.wait_for_timeout(200)
        await pg.evaluate("var h=document.querySelector('.c6w-ls-hinab');if(h)h.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))"); await pg.wait_for_timeout(400)
        print('Abbruch:', await pg.evaluate("[C6.jetzt, !document.querySelector('.c6w-ls-hinab')]"))
        # 7 ruhig
        await pg.evaluate("C6.geh('bibliothek')"); await pg.wait_for_timeout(600)
        await pg.evaluate("C6.ruhig=true;C6.lesesaal.hinab({})"); await pg.wait_for_timeout(250)
        print('ruhig: Treppe?', await pg.evaluate("!!document.querySelector('.c6w-ls-hinab svg')"))
        await pg.wait_for_timeout(900)
        print('ruhig fertig:', await pg.evaluate("[C6.jetzt, !document.querySelector('.c6w-ls-hinab')]"))
        print('Fehler:', fehler)
        await b.close()
asyncio.run(main())
