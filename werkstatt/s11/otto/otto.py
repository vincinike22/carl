# Otto sieht Carl zum ersten Mal: echte Klicks (Computer 1100) und echte Berührungen (iPhone 390, CDP-Touch).
# python3 werkstatt/s11/otto/otto.py computer|iphone
import sys, asyncio, time, json
from playwright.async_api import async_playwright
geraet = sys.argv[1] if len(sys.argv) > 1 else 'computer'
OUT = '/home/claude/carl/n13/werkstatt/s11/otto/'
SETUP = "try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});window._st=[];C6.bus.on('staunen',function(d){window._st.push(d.id)});setTimeout(function(){C6.geh('werkstatt')},700)"
T0 = time.time()
log = []
def notiz(*a):
    s = '%6.1fs  ' % (time.time() - T0) + ' '.join(str(x) for x in a); print(s); log.append(s)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        if geraet == 'iphone': ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        else: ctx = await b.new_context(viewport={'width': 1100, 'height': 760}, device_scale_factor=1)
        pg = await ctx.new_page(); fehler = []
        pg.on('console', lambda m: fehler.append(m.text) if m.type == 'error' else None)
        pg.on('pageerror', lambda e: fehler.append(str(e)))
        cdp = await ctx.new_cdp_session(pg) if geraet == 'iphone' else None

        async def mitte(sel):
            # nur im sichtbaren Raum suchen (gleiche data-id gibt es in mehreren Räumen); Kopf/Dock außerhalb
            return await pg.evaluate("(s)=>{var e=null;try{e=document.querySelector('.c6-buehne[data-raum=\"'+C6.jetzt+'\"] '+s)}catch(x){}if(!e)e=document.querySelector(s);if(!e)return null;var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height}}", sel)
        async def blase():
            return await pg.evaluate("(function(){var b=document.querySelector('.c6k-blase');if(!b||b.hidden||getComputedStyle(b).opacity==='0'||getComputedStyle(b.parentNode).display==='none')return '';return (b.querySelector('.c6k-blase-text')||b).textContent.trim()})()")
        async def bild(name):
            await pg.screenshot(path=OUT + name + '_' + geraet + '.png'); notiz('BILD', name)
        # — Otto tippt / hält / zieht —
        async def tipp(x, y):
            if cdp: await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]}); await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else: await pg.mouse.click(x, y)
        async def halte(x, y, ms=750):
            if cdp:
                await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]}); await pg.wait_for_timeout(ms)
                await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else:
                await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(ms); await pg.mouse.up()
        async def zieh(x0, y0, x1, y1, n=10):
            if cdp:
                await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x0, 'y': y0}]})
                for i in range(1, n + 1):
                    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x0 + (x1 - x0) * i / n, 'y': y0 + (y1 - y0) * i / n}]}); await pg.wait_for_timeout(16)
                await pg.wait_for_timeout(80); await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else:
                await pg.mouse.move(x0, y0); await pg.mouse.down(); await pg.mouse.move(x0 + 10, y0 + 3, steps=2); await pg.mouse.move(x1, y1, steps=n); await pg.mouse.up()
        async def tippSel(sel, name=''):
            m = await mitte(sel)
            if not m: notiz('FEHLT', sel); return None
            await tipp(m['x'], m['y']); notiz('tipp', name or sel, 'Treffer %dx%d' % (m['w'], m['h'])); return m
        async def halteSel(sel, name=''):
            m = await mitte(sel)
            if not m: notiz('FEHLT', sel); return None
            vorher = await pg.evaluate("window._st.length")
            await halte(m['x'], m['y']); await pg.wait_for_timeout(500)
            st = await pg.evaluate("window._st.slice(%d)" % vorher)
            notiz('halte', name or sel, '→ staunen', st, '| Carl:', (await blase())[:110]); return st

        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate(SETUP); await pg.wait_for_timeout(1800)
        notiz('Werkstatt betreten. Carl:', await blase())
        # Inventar: was ist anfassbar (role=button + tabindex) in diesem Raum?
        async def inventar(raum):
            inv = await pg.evaluate("(function(){var r=document.querySelector('.c6-buehne[data-raum=\"%s\"], [data-raum=\"%s\"]')||document;var out=[];[].forEach.call(r.querySelectorAll('[role=button],button,[tabindex=\"0\"],a'),function(e){var b=e.getBoundingClientRect();if(b.width<2||b.height<2)return;var cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none')return;out.push((e.getAttribute('aria-label')||e.textContent.trim().slice(0,30)||e.className.baseVal||e.className).toString().slice(0,60)+' ['+Math.round(b.width)+'x'+Math.round(b.height)+']')});return out})()" % (raum, raum))
            notiz('INVENTAR', raum, len(inv), json.dumps(inv, ensure_ascii=False)); return inv
        await inventar('werkstatt')
        await bild('w0_ankunft')
        # Wartet Otto 12 s: Lebenszeichen
        await pg.wait_for_timeout(9000); await bild('w1_nach_9s_nichts_getan')
        # Lupe
        await tippSel('.c6w-lupe .c6w-treffer', 'Lupe'); await pg.wait_for_timeout(800)
        notiz('Lupe an:', await pg.evaluate("!!document.querySelector('.c6w-lupe.c6w-lupe-an')"), 'Zettel:', await pg.evaluate("(document.querySelector('.c6w-lupe')||{}).getAttribute&&document.querySelector('.c6w-lupe').getAttribute('aria-label')"))
        await bild('w2_lupe')
        await halteSel('.c6w-lupe .c6w-treffer', 'Lupe (halten)'); await bild('w3_lupe_halten')
        notiz('Lupe noch an (Halten hat nicht getippt):', await pg.evaluate("!!document.querySelector('.c6w-lupe.c6w-lupe-an')"))
        await tippSel('.c6w-lupe .c6w-treffer', 'Lupe zu'); await pg.wait_for_timeout(600)
        # Lampe
        await halteSel('.c6w-lampe .c6w-treffer', 'Lampe (halten)'); await bild('w4_lampe_halten')
        notiz('Lampe nach Halten:', await pg.evaluate("C6.S.werkstatt&&C6.S.werkstatt.lampe"))
        await tippSel('.c6w-lampe .c6w-treffer', 'Lampe'); await pg.wait_for_timeout(1200)
        notiz('Lampe:', await pg.evaluate("C6.S.werkstatt&&C6.S.werkstatt.lampe"), 'Carl:', await blase()); await bild('w5_lampe_aus')
        await tippSel('.c6w-lampe .c6w-treffer', 'Lampe'); await pg.wait_for_timeout(1000)
        # Lochwand leer – was sieht Otto?
        notiz('Lochwand leer, Schild:', await pg.evaluate("(function(){var t=[].map.call(document.querySelectorAll('.c6w-ecke text, .c6w-ecke .c6w-schild'),function(e){return e.textContent.trim()});return t.slice(0,4)})()"))
        await halteSel('.c6w-g-ecke .c6w-schild-klein, .c6w-schild-klein', 'Lochwand leer (halten)')
        # Neues Werkzeug
        await tippSel('.c6w-ding[data-id="+neu"]', 'Neues Werkzeug'); await pg.wait_for_timeout(1400)
        notiz('Was ist offen:', await pg.evaluate("(function(){var d=document.querySelector('[role=dialog]:not([hidden]), .c6wz, .c6wz-blatt');return d?(d.className+' | '+d.textContent.trim().replace(/\\s+/g,' ').slice(0,160)):'nichts'})()"))
        await bild('w6_neues_werkzeug')
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
        notiz('nach Esc offen?', await pg.evaluate("!!document.querySelector('[role=dialog]:not([hidden]), .c6wz:not([hidden])")) if await pg.evaluate("!!document.querySelector('.c6wz')") else notiz('nach Esc: kein Dialog mehr')
        # Werkzeuge entstehen (Otto hätte das über den Dialog; hier der Bau-Moment)
        await pg.evaluate("C6.werkzeug.haenge({name:'Lesen',zeichen:'zaehler',farbe:'#2c7a6e',teile:[{t:'zaehler',text:'Seiten'}]},null)")
        await pg.wait_for_timeout(450); await bild('w7_bau_mitten'); await pg.wait_for_timeout(1200)
        await pg.evaluate("C6.werkzeug.haenge({name:'Wasser',zeichen:'haken',farbe:'#4f7fa8',teile:[{t:'haken',text:'Trinken'}]},null)"); await pg.wait_for_timeout(1700)
        notiz('Lochwand:', await pg.evaluate("[].map.call(document.querySelectorAll('.c6w-anh'),e=>e.getAttribute('data-id')+'@'+e.getAttribute('data-hx'))"))
        a = await mitte('.c6w-anh[data-hx="62"] .c6w-treffer'); z = await mitte('.c6w-anh[data-hx="22"] .c6w-treffer')
        notiz('Anhänger-Treffer:', a and '%dx%d' % (a['w'], a['h']))
        if a and z:
            await zieh(a['x'], a['y'], z['x'], z['y'] + 6); await pg.wait_for_timeout(800)
            notiz('nach Ziehen:', await pg.evaluate("[].map.call(document.querySelectorAll('.c6w-anh'),e=>e.getAttribute('data-id')+'@'+e.getAttribute('data-hx'))"), 'Raum:', await pg.evaluate("C6.jetzt"), 'Blatt offen?', await pg.evaluate("!!document.querySelector('.c6wz-gross, .c6w-tb:not([hidden])')"))
            await bild('w8_gezogen')
        await halteSel('.c6w-anh[data-hx="22"] .c6w-treffer', 'Werkzeug an der Lochwand (halten)')
        notiz('Blatt nach Halten offen?', await pg.evaluate("!!document.querySelector('.c6wz-gross, .c6w-tb:not([hidden])')"))
        await tippSel('.c6w-anh[data-hx="22"] .c6w-treffer', 'Werkzeug an der Lochwand (tipp)'); await pg.wait_for_timeout(900)
        notiz('Blatt nach Tipp offen?', await pg.evaluate("(function(){var d=document.querySelector('[role=dialog]:not([hidden])');return d?d.className+': '+d.textContent.trim().replace(/\\s+/g,' ').slice(0,100):false})()"))
        await bild('w9_werkzeug_offen'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
        # Fenster
        await tippSel('.c6w-fenster-ding .c6w-treffer', 'Fenster'); await pg.wait_for_timeout(700); notiz('Carl nach Fenster-Tipp:', await blase())
        await halteSel('.c6w-fenster-ding .c6w-treffer', 'Fenster (halten)'); await bild('w10_fenster_halten')
        await pg.evaluate("C6.tageszeit.setze('nacht')"); await pg.wait_for_timeout(900); await bild('w11_nacht')
        await pg.evaluate("C6.tageszeit.setze('morgen')"); await pg.wait_for_timeout(900); await bild('w12_morgen')
        await pg.evaluate("C6.tageszeit.setze(null)")

        # ——— Bibliothek: Otto tippt im Dock ———
        d = await pg.evaluate("(function(){var b=[].find.call(document.querySelectorAll('.c6k-leiste button, .c6k-leiste a, .c6k-leiste [role=tab]'),function(e){return /Bibliothek/.test(e.textContent||e.getAttribute('aria-label')||'')});if(!b)return null;var r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()")
        if d: await tipp(d['x'], d['y']); notiz('Dock → Bibliothek')
        else: await pg.evaluate("C6.geh('bibliothek')"); notiz('Dock nicht gefunden, C6.geh')
        await pg.wait_for_timeout(2200); notiz('Raum:', await pg.evaluate("C6.jetzt"), 'Carl:', await blase())
        await inventar('bibliothek')
        for z in ['morgen', 'mittag', 'abend', 'nacht']:
            await pg.evaluate("C6.tageszeit.setze('%s')" % z); await pg.wait_for_timeout(2000); await bild('b1_' + z)
            notiz(z, 'Lampe an?', await pg.evaluate("document.querySelector('.c6-buehne[data-raum=bibliothek] [data-id=lampe]').getAttribute('aria-pressed')"))
        await pg.evaluate("C6.tageszeit.setze('mittag')"); await pg.wait_for_timeout(1800)
        # Lampe
        await halteSel('[data-id="lampe"]', 'Leselampe (halten)'); notiz('Lampe nach Halten:', await pg.evaluate("document.querySelector('.c6-buehne[data-raum=bibliothek] [data-id=lampe]').getAttribute('aria-pressed')"))
        await bild('b2_lampe_halten')
        await tippSel('[data-id="lampe"]', 'Leselampe'); await pg.wait_for_timeout(1200); notiz('Lampe:', await pg.evaluate("document.querySelector('.c6-buehne[data-raum=bibliothek] [data-id=lampe]').getAttribute('aria-pressed')"), 'Staub-Canvas:', await pg.evaluate("!!document.querySelector('.c6k-staub')"))
        await bild('b3_lampe_an_mittag')
        # Sanduhr
        await halteSel('[data-id="ding:sanduhr"]', 'Sanduhr (halten)'); notiz('Drehung nach Halten:', await pg.evaluate("(C6.S.bibliothek.sand||{}).drehung"))
        await tippSel('[data-id="ding:sanduhr"]', 'Sanduhr'); await pg.wait_for_timeout(1300); notiz('Drehung:', await pg.evaluate("(C6.S.bibliothek.sand||{}).drehung"), 'Carl:', await blase())
        await bild('b4_sanduhr_gedreht')
        # Buch
        await halteSel('[data-id="bildbuch"]', 'Buch (halten)')
        await tippSel('[data-id="bildbuch"]', 'Buch'); await pg.wait_for_timeout(1600)
        seite = await pg.evaluate("(function(){var d=document.querySelector('[role=dialog]:not([hidden]), .c6w-buchseite, .c6w-tafel');return d?d.textContent.trim().replace(/\\s+/g,' '):'nichts offen'})()")
        notiz('Buchseite:', seite[:700]); await bild('b5_buch')
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700)
        # Bilder: Otto tippt ein Bild
        await tippSel('[data-id^="ding:bild-"]', 'Bild an der Wand'); await pg.wait_for_timeout(900); notiz('Carl:', await blase())
        await halteSel('[data-id^="ding:bild-"]', 'Bild (halten)')
        # Lexikon: hinsehen (Hover/Touch 1,2 s ohne Tipp)
        m = await mitte('[data-id="lexikon"]')
        if cdp:
            await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': m['x'], 'y': m['y']}]}); await pg.wait_for_timeout(1300)
            notiz('Lexikon lauscht (Finger liegt 1,3 s):', await pg.evaluate("document.querySelector('.c6-buehne[data-raum=bibliothek] [data-id=lexikon]').classList.contains('c6w-lex-lauscht')"), 'staunen:', await pg.evaluate("window._st.slice(-1)"))
            await bild('b6_lexikon_lauscht'); await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); await pg.wait_for_timeout(500)
        else:
            await pg.mouse.move(m['x'], m['y']); await pg.wait_for_timeout(1300)
            notiz('Lexikon lauscht (Maus liegt 1,3 s):', await pg.evaluate("document.querySelector('.c6-buehne[data-raum=bibliothek] [data-id=lexikon]').classList.contains('c6w-lex-lauscht')"))
            await bild('b6_lexikon_lauscht'); await pg.mouse.move(m['x'] - 200, m['y'] + 100); await pg.wait_for_timeout(400)
        notiz('Carl nach Lexikon-Halten/Hover:', await blase(), 'Raum:', await pg.evaluate("C6.jetzt"))
        # Geheimtür: ganz ansehen
        await tippSel('[data-id="lexikon"]', 'Lexikon (tipp)')
        t1 = time.time(); spur = []
        for i in range(12):
            await pg.wait_for_timeout(250)
            spur.append((round(time.time() - t1, 2), await pg.evaluate("[C6.jetzt, !!document.querySelector('.c6w-ls-hinab'), ((document.querySelector('.c6w-ls-hinab')||{}).className||'').replace('c6w-ls-hinab','').trim()]")))
            if i in (1, 3, 5, 7): await bild('g%d_uebergang_%dms' % (i, int((time.time() - t1) * 1000)))
        notiz('Übergang:', spur)
        await pg.wait_for_timeout(600); notiz('Angekommen:', await pg.evaluate("C6.jetzt"), 'Overlay weg:', await pg.evaluate("!document.querySelector('.c6w-ls-hinab')"), 'Carl:', await blase())
        await inventar('lesesaal'); await bild('l0_ankunft')
        # Sterne
        hm = await mitte('.c6w-ls-himmel')
        if hm:
            if cdp:
                await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': hm['x'] - 60, 'y': hm['y']}]})
                for i in range(8): await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': hm['x'] - 60 + i * 4, 'y': hm['y'] + i}]}); await pg.wait_for_timeout(60)
                await pg.wait_for_timeout(600); notiz('Sterne bewegt (Finger):', await pg.evaluate("[].filter.call(document.querySelectorAll('.c6w-ls-himmel circle'),function(c){return c.getAttribute('transform')&&c.getAttribute('transform')!=='translate(0.00 0.00)'}).length"), 'Raum:', await pg.evaluate("C6.jetzt"))
                await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else:
                await pg.mouse.move(hm['x'] - 60, hm['y']); await pg.wait_for_timeout(100); await pg.mouse.move(hm['x'], hm['y'] + 10, steps=6); await pg.wait_for_timeout(700)
                notiz('Sterne bewegt (Maus):', await pg.evaluate("[].filter.call(document.querySelectorAll('.c6w-ls-himmel circle'),function(c){return c.getAttribute('transform')&&c.getAttribute('transform')!=='translate(0.00 0.00)'}).length"))
            await bild('l1_sterne')
            rr = await pg.evaluate("(function(){var r=document.querySelector('.c6-buehne[data-raum=lesesaal]').getBoundingClientRect();return [r.left+r.width*0.35, r.top+28]})()")
            vorher = await pg.evaluate("window._st.length"); await halte(rr[0], rr[1]); await pg.wait_for_timeout(500)
            notiz('halte Himmel (sichtbare Stelle) → staunen', await pg.evaluate("window._st.slice(%d)" % vorher), '| Carl:', (await blase())[:100], '| darunter:', await pg.evaluate("(function(){var t=document.elementFromPoint(%f,%f);return t&&(t.getAttribute('class')||t.tagName)})()" % (rr[0], rr[1])))
            await bild('l2_sterne_halten')
        # Kerze
        await halteSel('.c6w-ls-kerze', 'Kerze (halten)'); notiz('Kerze nach Halten:', await pg.evaluate("!!(C6.S.lesesaal||{}).kerze"))
        await tippSel('.c6w-ls-kerze', 'Kerze'); await pg.wait_for_timeout(1200); notiz('Kerze:', await pg.evaluate("!!(C6.S.lesesaal||{}).kerze"), 'Carl:', await blase())
        await bild('l3_kerze_an')
        await pg.evaluate("C6.tageszeit.setze('nacht')"); await pg.wait_for_timeout(1500); await bild('l4_kerze_an_nacht')
        await tippSel('.c6w-ls-kerze', 'Kerze aus'); await pg.wait_for_timeout(1200); await bild('l5_kerze_aus_nacht')
        await tippSel('.c6w-ls-kerze', 'Kerze an'); await pg.wait_for_timeout(600); await pg.evaluate("C6.tageszeit.setze(null)"); await pg.wait_for_timeout(1200)
        # Porträts
        await halteSel('.c6w-ls-portraet[data-m="neu"]', 'leeres Porträt (halten)'); notiz('Ansicht nach Halten:', await pg.evaluate("C6.lesesaal.ansicht"))
        await tippSel('.c6w-ls-portraet[data-m="neu"]', 'leeres Porträt'); await pg.wait_for_timeout(1400)
        notiz('Ansicht:', await pg.evaluate("C6.lesesaal.ansicht"), 'Fokus:', await pg.evaluate("document.activeElement&&(document.activeElement.id||document.activeElement.tagName)"))
        await bild('l6_portraet_form')
        await pg.fill('#c6w-ls-mname', 'Oma Hilde'); await pg.evaluate("document.querySelector('.c6w-ls-mneu').requestSubmit()"); await pg.wait_for_timeout(700)
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(900)
        notiz('Porträt mit Licht:', await pg.evaluate("document.querySelectorAll('.c6w-ls-hatlicht').length")); await bild('l7_portraet_licht')
        await tippSel('.c6w-ls-portraet[data-m^="m"]', 'Porträt mit Namen'); await pg.wait_for_timeout(1300); notiz('Ansicht/Karte:', await pg.evaluate("[C6.lesesaal.ansicht, C6.lesesaal.karte]"))
        await bild('l8_karte'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700)
        # Dein Platz
        await halteSel('.c6w-ls-platz', 'Dein Platz (halten)')
        await tippSel('.c6w-ls-platz', 'Dein Platz'); await pg.wait_for_timeout(900); notiz('Carl:', await blase(), 'Ansicht:', await pg.evaluate("C6.lesesaal.ansicht"))
        await bild('l9_platz')
        # Funde (leer)
        await tippSel('.c6w-ls-r-funde', 'Funde-Regal'); await pg.wait_for_timeout(1300)
        notiz('Funde offen:', await pg.evaluate("(function(){var d=document.querySelector('[role=dialog]:not([hidden])');return d?d.textContent.trim().replace(/\\s+/g,' ').slice(0,200):C6.lesesaal.ansicht})()"))
        await bild('l10_funde'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700)
        # Rückweg und Abbruch
        await tippSel('.c6k-fd-hoch', '‹ Bibliothek'); await pg.wait_for_timeout(1600); notiz('Raum:', await pg.evaluate("C6.jetzt"))
        await tippSel('[data-id="lexikon"]', 'Lexikon (tipp, dann Abbruch)'); await pg.wait_for_timeout(1000)
        notiz('mitten im Abstieg:', await pg.evaluate("[C6.jetzt, !!document.querySelector('.c6w-ls-hinab')]"))
        bm = await mitte('.c6w-ls-hinab')
        if bm: await tipp(bm['x'], bm['y'])
        await pg.wait_for_timeout(500); notiz('nach Tipp (Abbruch):', await pg.evaluate("[C6.jetzt, !document.querySelector('.c6w-ls-hinab')]")); await bild('g9_abbruch')
        notiz('Staunen gesehen:', await pg.evaluate("C6.staunen.alle()"))
        notiz('Konsolenfehler:', fehler)
        open(OUT + 'otto_' + geraet + '.log', 'w').write('\n'.join(log))
        await b.close()
asyncio.run(main())
