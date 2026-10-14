import sys,asyncio,json
from playwright.async_api import async_playwright
geraet=sys.argv[1] if len(sys.argv)>1 else 'computer'
OUT='/home/claude/carl/n13/werkstatt/s2/leonardo/'
SETUP="""try{C6.rundgang&&C6.rundgang.an&&C6.rundgang.ende()}catch(e){} C6.S.du={fertig:true,name:"nico"};
C6.space.neu('he',{oeffnen:false}); var p=C6.space.neu('probe',{oeffnen:false});
var he=C6.strings.alle().filter(x=>x.titel=='he')[0].id; C6.S.spaces[p].notizen=['Ordner am PC sichten','Fotos sortieren','Backup machen','Alte Mails löschen','Desktop leer','Downloads aufräumen','Musik ordnen'].map((t,i)=>({t:t,ts:Date.now()-i*1000})); C6.S.spaces[he].kern='Ich baue jeden Tag ein kleines Stück.'; C6.S.spaces[he].notizen=[{t:'Morgens zuerst schreiben',ts:1},{t:'Abends kurz zurückschauen',ts:2}];
C6.geruest.speichern({id:'g-lauf',name:'Lauftraining',farbe:'#2c7a6e',schritte:['Strecke wählen','Tempo finden','Einmal ganz laufen']});C6.geruest.anDieWand('v-woche');C6.geruest.anDieWand('v-seite');C6.geruest.anDieWand('v-entscheid');C6.geruest.anDieWand('v-umzug');
"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        if geraet=='iphone': ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        else: ctx=await b.new_context(viewport={'width':1440,'height':900})
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate(SETUP); await pg.wait_for_timeout(1500); await pg.evaluate("C6.geh('werkstatt')"); await pg.wait_for_timeout(1500)
        async def tipp(id):
            r=await pg.evaluate("(id)=>{var e=document.querySelector('.c6w-ding[data-id=\"'+id+'\"] .c6w-ding-innen')||document.querySelector('.c6w-ding[data-id=\"'+id+'\"]');var b=e.getBoundingClientRect();return [b.left+b.width/2,b.top+b.height/2,C6.jetzt]}",id)
            print('  tipp',id,r)
            await pg.mouse.click(r[0],r[1])
        def chips(): return pg.evaluate("[].map.call(document.querySelectorAll('.c6k-chips[data-an] .c6k-chip'),b=>b.textContent)")
        await tipp('ordnen'); await pg.wait_for_timeout(1600)
        print('1 ordnen chips:',await chips())
        await pg.screenshot(path=OUT+'r1_%s.png'%geraet)
        await tipp('gegen'); await pg.wait_for_timeout(1600)
        print('2 nach gegen chips:',await chips(), 'blase:', await pg.evaluate("(document.querySelector('.c6k-blase')||{}).textContent"))
        await pg.screenshot(path=OUT+'r2_%s.png'%geraet)
        # tap empty floor
        await pg.mouse.click(200 if geraet=='iphone' else 700, 300); await pg.wait_for_timeout(900)
        print('3 nach leer tippen chips:',await chips())
        if geraet=='iphone':
            await tipp('ordnen'); await pg.wait_for_timeout(1600)
            print('3b iphone ordnen chips:', await chips())
            await pg.screenshot(path=OUT+'r3b_iphone.png')
            cdp=await ctx.new_cdp_session(pg)
            async def wisch(x0,x1,y):
                await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x0,'y':y}]})
                for i in range(1,15):
                    await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x0+(x1-x0)*i/14,'y':y}]}); await asyncio.sleep(0.02)
                await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
            await wisch(330,40,420); await pg.wait_for_timeout(1200)
            print('3c nach Wischen jetzt', await pg.evaluate('C6.jetzt'), await chips())
            await pg.evaluate("C6.geh('werkstatt')"); await pg.wait_for_timeout(1200)
            await tipp('gegen'); await pg.wait_for_timeout(1600)
            print('3d gegen chips:', await chips())
            await pg.evaluate("C6.zurueck()"); await pg.wait_for_timeout(1000)
            print('3e nach Zurück jetzt', await pg.evaluate('C6.jetzt'), await chips())
            await pg.evaluate("C6.geh('werkstatt')"); await pg.wait_for_timeout(1200)
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(900)
        print('4 nach Esc chips:',await chips(), 'jetzt', await pg.evaluate('C6.jetzt'))
        await tipp('v-woche'); await pg.wait_for_timeout(1600)
        print('5 woche chips:',await chips(), await pg.evaluate("(document.querySelector('.c6k-blase')||{}).textContent"))
        await pg.screenshot(path=OUT+'r5_%s.png'%geraet)
        # Lauf hier starten, dann anderes Ding anfassen
        await tipp('skizze'); await pg.wait_for_timeout(1500)
        print('6 skizze chips:',await chips(), await pg.evaluate("(document.querySelector('.c6k-blase')||{}).textContent"))
        await pg.screenshot(path=OUT+'r6_%s.png'%geraet)
        await pg.evaluate("C6.geh('werkstatt')"); await pg.wait_for_timeout(1200)
        await tipp('v-seite'); await pg.wait_for_timeout(1500)
        await pg.evaluate("[].find.call(document.querySelectorAll('.c6k-chips[data-an] .c6k-chip'),b=>/[Hh]ier/.test(b.textContent)).click()"); await pg.wait_for_timeout(2500)
        print('7 lauf laeuft, projektor', await pg.evaluate("!!(C6.projektor&&C6.projektor.offen)"), await chips())
        await pg.screenshot(path=OUT+'r7_%s.png'%geraet)
        await tipp('bruecke'); await pg.wait_for_timeout(1600)
        print('8 nach recherche waehrend lauf:', await chips(), await pg.evaluate("(document.querySelector('.c6k-blase')||{}).textContent"), 'proj', await pg.evaluate("!!(C6.projektor&&C6.projektor.offen)"))
        await pg.screenshot(path=OUT+'r8_%s.png'%geraet)
        print('Fehler',f)
        await b.close()
asyncio.run(main())
