"""Prüfstand s11 · Kern: staunen, halten, tageszeit, staub.
Lauf: python3 werkstatt/s11/raffael/pruefstand.py [iphone|computer|alle]
Erwartet carl6-test.html (python3 tools/bau.py). Bilder liegen neben diesem Skript."""
import sys, os, asyncio
from playwright.async_api import async_playwright

HIER = os.path.dirname(os.path.abspath(__file__))
SEITE = 'file:///home/claude/carl/n13/carl6-test.html'
SETUP = ("try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};"
         "C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});"
         "setTimeout(function(){C6.geh('zuhause')},700)")

# ein Probe-Ding im Raum: ein Kreis an der Werkstattwand, der sich halten lässt, mit Staub darüber
DING = r"""
(function(){
  var b = C6.gebaut('zuhause');
  var d = document.createElement('button');
  d.type='button'; d.id='probe-ding'; d.setAttribute('aria-label','Probe');
  d.style.cssText='position:absolute;left:40px;top:120px;width:120px;height:120px;border-radius:50%;border:1.5px solid #2b2722;background:#f4e3b0;z-index:5;overflow:hidden';
  b.appendChild(d);
  window.__tipps = 0;
  d.addEventListener('click', function(){ window.__tipps++; });
  C6.staunen.text('probe.ding', 'Der Kreis ist nur ein Kreis. Wenn du ihn hältst, sag ich dir das.');
  window.__halt = 0;
  window.__weg = C6.halten(d, function(el, o){ window.__halt++; window.__art = o.art; C6.staunen.sag('probe.ding'); });
  window.__staub = C6.staub(d, {dichte: 6});
  window.__bus = []; C6.bus.on('staunen', function(x){ window.__bus.push(x.id); });
  C6.bus.on('tageszeit', function(x){ window.__bus.push('tz:'+x.vorher+'>'+x.jetzt); });
})();
"""

async def lauf(geraet):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        if geraet == 'iphone':
            ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        else:
            ctx = await b.new_context(viewport={'width': 1100, 'height': 760}, device_scale_factor=1)
        pg = await ctx.new_page(); fehler = []
        pg.on('console', lambda m: fehler.append(m.text) if m.type == 'error' else None)
        pg.on('pageerror', lambda e: fehler.append(str(e)))
        await pg.goto(SEITE); await pg.wait_for_timeout(800)
        await pg.evaluate(SETUP); await pg.wait_for_timeout(1500)
        ok = []
        def pr(name, bed): ok.append((name, bool(bed))); print(('  ok  ' if bed else '  FEHLT ') + name)

        # --- API da
        api = await pg.evaluate("[typeof C6.staunen.sag, typeof C6.halten, typeof C6.tageszeit, typeof C6.tageszeit.setze, typeof C6.staub]")
        pr('API vorhanden', all(a == 'function' for a in api))

        # --- Tageszeit aus der Uhr
        tz = await pg.evaluate("({jetzt:C6.tageszeit(), h:new Date().getHours(), attr:document.getElementById('c6').getAttribute('data-tageszeit')})")
        h = tz['h']; soll = 'morgen' if 6 <= h < 11 else 'mittag' if 11 <= h < 17 else 'abend' if 17 <= h < 21 else 'nacht'
        pr('tageszeit() aus der Uhr (%s → %s)' % (h, tz['jetzt']), tz['jetzt'] == soll and tz['attr'] == soll)

        await pg.evaluate(DING); await pg.wait_for_timeout(300)

        # --- Tageszeit setzen → Bus
        r = await pg.evaluate("(function(){var v=C6.tageszeit(); var n=v==='abend'?'morgen':'abend'; C6.tageszeit.setze(n); return {n:n, j:C6.tageszeit(), st:C6.tageszeit.stunde(), bus:window.__bus.slice(), attr:document.getElementById('c6').getAttribute('data-tageszeit')};})()")
        pr('tageszeit.setze → Bus + Attribut', r['j'] == r['n'] and ('tz:' in ''.join(r['bus'])) and r['attr'] == r['n'] and r['st'] in (8, 19))
        r2 = await pg.evaluate("(function(){C6.tageszeit.setze(null); return C6.tageszeit();})()")
        pr('tageszeit.setze(null) zurück zur Uhr', r2 == soll)

        # --- Staub da, läuft
        st = await pg.evaluate("(function(){var c=document.querySelector('#probe-ding canvas.c6k-staub'); return {da:!!c, w:c&&c.width, laeuft:C6.takt.laeuft, n:C6.takt.anzahl()};})()")
        pr('staub: Canvas im Element, Takt läuft', st['da'] and st['w'] > 0 and st['laeuft'])
        # Zeichnet es wirklich? Pixel zählen
        px = await pg.evaluate("(function(){var c=document.querySelector('#probe-ding canvas'); var d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; var n=0; for(var i=3;i<d.length;i+=4) if(d[i]>10) n++; return n;})()")
        pr('staub: Partikel gezeichnet (%d Pixel)' % px, px > 20)

        # --- Halten: kurz = kein Ruf, Tipp zählt
        kreis = pg.locator('#probe-ding')
        box = await kreis.bounding_box(); cx, cy = box['x'] + 60, box['y'] + 60
        if geraet == 'iphone':
            await pg.touchscreen.tap(cx, cy)
        else:
            await pg.mouse.click(cx, cy)
        await pg.wait_for_timeout(200)
        r = await pg.evaluate("({halt:window.__halt, tipps:window.__tipps})")
        pr('kurzer Tipp: kein Halten, Tipp gezählt', r['halt'] == 0 and r['tipps'] == 1)

        # --- Halten mit Bewegung > 8 px bricht ab
        await pg.mouse.move(cx, cy); await pg.mouse.down(); await pg.wait_for_timeout(200)
        await pg.mouse.move(cx + 14, cy + 2, steps=3); await pg.wait_for_timeout(600); await pg.mouse.up()
        await pg.wait_for_timeout(100)
        r = await pg.evaluate("window.__halt")
        pr('Bewegung > 8 px bricht ab', r == 0)

        # --- Halten 700 ms zündet, Klick danach geschluckt, Blase zeigt den Satz
        t0 = await pg.evaluate("window.__tipps")
        await pg.mouse.move(cx, cy); await pg.mouse.down(); await pg.wait_for_timeout(250)
        haelt = await pg.evaluate("document.getElementById('probe-ding').classList.contains('c6k-haelt')")
        await pg.wait_for_timeout(500); await pg.mouse.up(); await pg.wait_for_timeout(900)
        r = await pg.evaluate("({halt:window.__halt, tipps:window.__tipps, art:window.__art, text:document.querySelector('.c6k-blase-text').textContent, an:document.querySelector('.c6k-blase-rahmen').hasAttribute('data-an'), st:document.querySelector('.c6k-blase').getAttribute('data-staunen'), ges:C6.staunen.gesehen('probe.ding'), alle:C6.staunen.alle(), bus:window.__bus.slice(), cls:document.getElementById('probe-ding').classList.contains('c6k-haelt')})")
        pr('Halten 600 ms zündet (Klasse c6k-haelt während)', haelt and r['halt'] == 1 and r['art'] == 'maus' and not r['cls'])
        pr('Klick nach dem Halten geschluckt', r['tipps'] == t0)
        pr('Staunen-Satz in Carls Blase', r['an'] and 'Kreis' in r['text'] and r['st'] == 'probe.ding')
        pr('gesehen/alle/Bus', r['ges'] and r['alle'] == ['probe.ding'] and 'probe.ding' in r['bus'])
        await pg.wait_for_timeout(600)
        await pg.screenshot(path=os.path.join(HIER, 'staunen_%s.png' % geraet))

        # --- einmal je Sitzung: zweites Halten → kein zweiter Satz
        nr1 = await pg.evaluate("C6.S.gespraech.length")
        r = await pg.evaluate("C6.staunen.sag('probe.ding')")
        pr('zweites Mal: still (false)', r is False)
        pr('nicht ins Gespräch gemerkt', await pg.evaluate("C6.S.gespraech.length") == nr1 and await pg.evaluate("!C6.S.gespraech.some(function(z){return /Kreis ist nur/.test(z.t)})"))
        # Veto 1: der Satz geht mit dem Raum und beim Zustandswechsel des Dings
        pr('staunen.offen() nennt die id', await pg.evaluate("C6.staunen.offen()") == 'probe.ding')
        pr('staunen.zu(andere id) tut nichts', await pg.evaluate("C6.staunen.zu('x.anders')") is False and await pg.evaluate("C6.staunen.offen()") == 'probe.ding')
        pr('staunen.zu(id) schließt die Blase', await pg.evaluate("C6.staunen.zu('probe.ding')") is True and await pg.evaluate("!document.querySelector('.c6k-blase-rahmen').hasAttribute('data-an') && C6.staunen.offen()===null"))
        await pg.evaluate("C6.staunen.vergiss('probe.ding'); C6.staunen.sag('probe.ding'); C6.geh('bibliothek')"); await pg.wait_for_timeout(1000)
        pr('Raumwechsel: Staunen-Blase weg', await pg.evaluate("!document.querySelector('.c6k-blase-rahmen').hasAttribute('data-an') && C6.staunen.offen()===null"))
        await pg.evaluate("C6.geh('zuhause')"); await pg.wait_for_timeout(1000)
        await pg.evaluate("C6.sag('Ein neuer Satz, kein Staunen.', {merken:false})"); await pg.wait_for_timeout(600)
        pr('neuer Satz nach Staunen: zu() schließt ihn nicht', await pg.evaluate("C6.staunen.zu()") is False and await pg.evaluate("document.querySelector('.c6k-blase-rahmen').hasAttribute('data-an')"))
        await pg.evaluate("C6.schweig()")
        pr('vergiss → wieder sagbar', await pg.evaluate("(function(){C6.staunen.vergiss('probe.ding'); return !C6.staunen.gesehen('probe.ding') && C6.staunen.alle().length===0;})()"))
        pr('unbekannte id ohne Satz → false; Rückfall-Satz → true', await pg.evaluate("(function(){var a=C6.staunen.sag('x.nix'); var b=C6.staunen.sag('x.nix','Nur ein Rückfall.'); return a===false && b===true;})()"))

        # --- Touch-Halten am iPhone (echte Touch-Ereignisse)
        if geraet == 'iphone':
            await pg.evaluate("window.__halt=0; C6.staunen.vergiss(); C6.schweig();")
            t0 = await pg.evaluate("window.__tipps")
            cdp = await ctx.new_cdp_session(pg)
            await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': cx, 'y': cy}]})
            await pg.wait_for_timeout(750)
            await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            await pg.wait_for_timeout(700)
            r = await pg.evaluate("({halt:window.__halt, art:window.__art, tipps:window.__tipps, an:document.querySelector('.c6k-blase-rahmen').hasAttribute('data-an')})")
            pr('Finger-Halten zündet (art finger), Tipp geschluckt', r['halt'] == 1 and r['art'] == 'finger' and r['tipps'] == t0 and r['an'])
            # Finger wandert: Wischen, kein Halten
            await pg.evaluate("window.__halt=0")
            await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': cx, 'y': cy}]})
            await pg.wait_for_timeout(150)
            await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': cx + 20, 'y': cy}]})
            await pg.wait_for_timeout(700)
            await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            await pg.wait_for_timeout(600)
            pr('Finger wandert > 8 px: kein Halten', await pg.evaluate("window.__halt") == 0)
            await pg.wait_for_timeout(500)

        # --- Tastatur: Enter gedrückt halten
        await pg.evaluate("window.__halt=0; C6.staunen.vergiss(); document.getElementById('probe-ding').focus();")
        await pg.keyboard.down('Enter'); await pg.wait_for_timeout(750); await pg.keyboard.up('Enter'); await pg.wait_for_timeout(300)
        r = await pg.evaluate("({halt:window.__halt, art:window.__art})")
        pr('Tastatur: Enter halten zündet (art taste)', r['halt'] == 1 and r['art'] == 'taste')

        # --- Kontextmenü verhindert
        pr('contextmenu verhindert', await pg.evaluate("(function(){var e=new MouseEvent('contextmenu',{bubbles:true,cancelable:true}); document.getElementById('probe-ding').dispatchEvent(e); return e.defaultPrevented;})()"))

        # --- Staub pausiert, wenn der Raum nicht sichtbar ist; Abhängen räumt auf
        BILD = "(function(){var c=document.querySelector('#probe-ding canvas'); return Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data).join(',');})()"
        a1 = await pg.evaluate(BILD); await pg.wait_for_timeout(250); a2 = await pg.evaluate(BILD)
        pr('im Raum: Staub bewegt sich', a1 != a2)
        await pg.evaluate("C6.schweig(); C6.geh('bibliothek')"); await pg.wait_for_timeout(1200)
        b1 = await pg.evaluate(BILD); await pg.wait_for_timeout(400); b2 = await pg.evaluate(BILD)
        pr('anderer Raum: Staub steht still (nichts wird gezeichnet)', b1 == b2)
        await pg.evaluate("C6.geh('zuhause')"); await pg.wait_for_timeout(1200)
        c1 = await pg.evaluate(BILD); await pg.wait_for_timeout(250); c2 = await pg.evaluate(BILD)
        pr('zurück im Raum: Staub läuft wieder', c1 != c2)
        pr('staub.dichte(n)', await pg.evaluate("(function(){window.__staub.dichte(2); return window.__staub.dichte()===2;})()"))
        n0 = await pg.evaluate("C6.takt.anzahl()")
        r = await pg.evaluate("(function(){window.__staub.zurueck(); window.__weg(); var d=document.getElementById('probe-ding'); return {cv:!!d.querySelector('canvas'), n:C6.takt.anzahl(), cls:d.classList.contains('c6k-haltbar')};})()")
        pr('zurueck(): Canvas weg, Hörer weg, Klasse weg', not r['cv'] and r['n'] == n0 - 1 and not r['cls'])

        # Veto 7: Kornfarbe aus dem Grund
        r = await pg.evaluate(r"""(function(){var b=C6.gebaut('zuhause');
          var h=document.createElement('div'); h.style.cssText='position:absolute;left:0;top:0;width:100px;height:100px;background:#f4eee4'; b.appendChild(h);
          var d=document.createElement('div'); d.style.cssText='position:absolute;left:0;top:0;width:100px;height:100px;background:#1e2340'; b.appendChild(d);
          var sh=C6.staub(h,{dichte:4}), sd=C6.staub(d,{dichte:4}), se=C6.staub(d,{dichte:4,farbe:'10,200,30'});
          function L(f){var a=f.split(',').map(Number); return (0.2126*a[0]+0.7152*a[1]+0.0722*a[2])/255;}
          var r={hellF:sh.farbe(), hellL:L(sh.farbe()), hellM:sh.el.style.mixBlendMode, dunkelF:sd.farbe(), dunkelL:L(sd.farbe()), dunkelM:sd.el.style.mixBlendMode, eigen:se.farbe()};
          d.style.background='#f4eee4'; r.neu=sd.neu();
          sh.zurueck(); sd.zurueck(); se.zurueck(); h.remove(); d.remove(); return r;})()""")
        pr('helle Wand: Korn dunkler als Wand (%s), ohne screen' % r['hellF'], 0.5 < r['hellL'] < 0.9 and r['hellM'] == '')
        pr('dunkler Raum: Korn heller (%s), screen' % r['dunkelF'], r['dunkelL'] > 0.4 and r['dunkelM'] == 'screen')
        pr('eigene farbe bleibt', r['eigen'] == '10,200,30')
        pr('Wand wird hell → neu() wählt um', r['neu']['hell'] is True)

        # --- reduzierte Bewegung: Standbild
        pg2 = await ctx.new_page(); f2 = []
        pg2.on('console', lambda m: f2.append(m.text) if m.type == 'error' else None)
        pg2.on('pageerror', lambda e: f2.append(str(e)))
        await pg2.emulate_media(reduced_motion='reduce')
        await pg2.goto(SEITE); await pg2.wait_for_timeout(600); await pg2.evaluate(SETUP); await pg2.wait_for_timeout(1300)
        r = await pg2.evaluate("(function(){var b=C6.gebaut('zuhause'); var d=document.createElement('div'); d.style.cssText='position:absolute;left:0;top:0;width:200px;height:120px'; b.appendChild(d); var s=C6.staub(d,{dichte:4}); var c=d.querySelector('canvas'); var px=0; var im=c.getContext('2d').getImageData(0,0,c.width,c.height).data; for(var i=3;i<im.length;i+=4) if(im[i]>10) px++; return {ruhig:C6.ruhig, px:px, n:C6.takt.anzahl(), laeuft:C6.takt.laeuft};})()")
        await pg2.wait_for_timeout(400)
        pr('reduced-motion: Standbild (%d Pixel), kein Takt-Hörer' % r['px'], r['ruhig'] and r['px'] > 10 and not r['laeuft'])
        fehler += f2

        # --- Bild: alle vier Dinge im Raum (Staub auf einem Lichtfleck + Staunen-Satz)
        await pg.evaluate(r"""(function(){
          var b=C6.gebaut('zuhause'); var d=document.getElementById('probe-ding'); if(d) d.remove();
          var l=document.createElement('div'); l.id='probe-licht'; l.setAttribute('aria-hidden','true');
          l.style.cssText='position:absolute;left:0;top:0;width:100%;height:60%;pointer-events:none;z-index:4';
          b.appendChild(l); C6.staub(l,{dichte:1.2});
          C6.staunen.vergiss(); C6.staunen.text('zuhause.probe','Das Licht fällt durchs Fenster. Der Staub tanzt darin – mehr ist es nicht.'); C6.staunen.sag('zuhause.probe');
        })()""")
        await pg.wait_for_timeout(2600)
        await pg.screenshot(path=os.path.join(HIER, 'kern_%s.png' % geraet))

        print('Konsolenfehler:', fehler)
        await b.close()
        return all(x[1] for x in ok) and not fehler

if __name__ == '__main__':
    was = sys.argv[1] if len(sys.argv) > 1 else 'alle'
    gut = True
    for g in (['iphone', 'computer'] if was == 'alle' else [was]):
        print('==', g)
        gut = asyncio.run(lauf(g)) and gut
    print('ALLES GRÜN' if gut else 'ROT')
    sys.exit(0 if gut else 1)
