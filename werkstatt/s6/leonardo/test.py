import sys,asyncio
from playwright.async_api import async_playwright
g=sys.argv[1]; O='/home/claude/carl/n13/werkstatt/s6/leonardo/'
SETUP="""try{C6.rundgang&&C6.rundgang.an&&C6.rundgang.ende()}catch(e){} C6.S.du={fertig:true,name:"nico"};
if(!C6.strings.alle().length){C6.space.neu('he',{oeffnen:false}); C6.space.neu('probe',{oeffnen:false});}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); mob=g=='iphone'
        ctx=await b.new_context(viewport={'width':390,'height':844} if mob else {'width':1100,'height':860},device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob)
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate(SETUP); await pg.wait_for_timeout(1500); await pg.evaluate("C6.geh('werkstatt')"); await pg.wait_for_timeout(1800)
        r=await pg.evaluate("(()=>{var e=document.querySelector('.c6w-ding[data-id=\"+neu\"] .c6w-ding-innen');var b=e.getBoundingClientRect();return [b.left+b.width/2,b.top+b.height/2]})()")
        await pg.mouse.click(r[0],r[1]); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=O+'1_wunsch_%s.png'%g)
        print('Felder im Blatt', await pg.evaluate("document.querySelectorAll('.c6wz-blatt input').length"), 'Platzhalter', await pg.evaluate("document.querySelector('.c6k-feld').placeholder"))
        await pg.fill('.c6k-feld','Ich will jeden Tag sehen, ob ich Wasser getrunken habe.'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(1500)
        print('aus Feld:', await pg.evaluate("(document.querySelector('.c6wz-name')||{}).textContent"), 'Platzhalter danach', await pg.evaluate("document.querySelector('.c6k-feld').placeholder"))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
        await pg.mouse.click(r[0],r[1]); await pg.wait_for_timeout(1500)
        await pg.click('.c6wz-vorlage[data-v=gewohnheit]'); await pg.wait_for_timeout(1500)
        print('Name Gewohnheit', await pg.evaluate("document.querySelector('.c6wz-name').textContent"))
        await pg.click('.c6wz-vorschau .c6wz-heute'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=O+'2_vorschau_%s.png'%g)
        await pg.click('[data-w=passt]'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=O+'3_wohin_%s.png'%g)
        print('Ziele', await pg.evaluate("[].map.call(document.querySelectorAll('.c6wz-ziele button'),b=>b.textContent)"))
        await pg.click('.c6wz-ziele [data-sid]'); await pg.wait_for_timeout(500)
        await pg.click('[data-w=tele]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=O+'4_steht_%s.png'%g)
        print('alle', await pg.evaluate("JSON.stringify(C6.werkzeug.alle().map(w=>[w.name,w.zeichen,w.sid?1:0,w.teleskop,JSON.stringify(C6.S.werkzeug.daten[w.id])]))"))
        # Termin
        await pg.evaluate("C6.werkzeug.oeffne({satz:'Erinnere mich am Freitag an das Geschenk für Mama.'})"); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=O+'5_termin_%s.png'%g)
        print('termin', await pg.evaluate("document.querySelector('.c6wz-vorschau').innerText.replace(/\\n+/g,' | ')"))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
        print('offen nach Esc', await pg.evaluate("C6.werkzeug.offen"), 'erinnerungen', await pg.evaluate("JSON.stringify(C6.werkzeug.erinnerungen())"))
        # Zähler, Liste aus Sätzen
        for s in ['Ich will zählen, wie viele Seiten ich lese.','Eine Liste, was ich für den Urlaub packen muss.','Jeden Abend drei Fragen an mich']:
            sp=await pg.evaluate("C6.werkzeug.baue(%r).then(s=>s.name+' · '+s.zeichen+' · '+s.teile.map(t=>t.t).join(','))"%s); print(s,'→',sp)
        # klein (Pfosten) zur Probe
        await pg.evaluate("var d=document.createElement('div');d.id='probe-klein';d.style.cssText='position:fixed;left:20px;top:120px;width:220px;z-index:999';document.body.appendChild(d);C6.werkzeug.male(d,C6.werkzeug.alle()[0],{klein:true})"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=O+'6_klein_%s.png'%g)
        print('Fehler',f); await b.close()
asyncio.run(main())
