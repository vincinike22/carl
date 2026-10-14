# Bilder s2 · raffael: python3 bild.py [szenen,…]
import sys, asyncio, shutil, subprocess
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; HIER=R+'/werkstatt/s2/raffael'
subprocess.run([sys.executable, R+'/tools/bau.py'], stdout=subprocess.DEVNULL)
nur=(sys.argv[1].split(',') if len(sys.argv)>1 else None)
DATEN = r"""(()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};const n=Date.now(),T=864e5,S=C6.S;
S.du=Object.assign(S.du||{},{fertig:true,name:'nico'});
S.gespraech=[{von:'du',t:'Ich will ein Fahrrad für den Geist bauen.',ts:n-T},{von:'carl',t:'Dann fang ich beim Sattel an.',ts:n-T+5000}];
S.wand=['v-woche','v-entscheid','v-seite','v-umzug'];
S.geruest=[{id:'g1',name:'Morgenseiten',schritte:['Drei Seiten schreiben','Einen Satz anstreichen','Den Satz behalten'],farbe:'#7d4a74',ts:n}];
C6.speichern&&C6.speichern();C6.geh('zuhause');C6.geh('werkstatt');C6.geh('zuhause');C6.eingabe.platzhalter(null);})()"""
SZ = {
 'leer': ("C6.eingabe.platzhalter(null)", []),
 'liste': ("", ['/']),
 'filter': ("", ['/','w','e']),
 'pfeil': ("", ['/','ArrowDown','ArrowDown']),
 'unten': ("", ['/','ArrowUp','ArrowUp','ArrowUp','ArrowUp']),
 'w': ("", ['/','w']),
 'kein': ("", ['/','x','y','z']),
 'werkstatt': ("C6.geh('werkstatt')", []),
}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ['iphone','computer']:
      for name,(js,tasten) in SZ.items():
        if nur and name not in nur: continue
        ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1440,'height':900}}))
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file://'+R+'/carl6-test.html'); await pg.wait_for_timeout(700)
        await pg.evaluate(DATEN); await pg.wait_for_timeout(1500)
        if js: await pg.evaluate(js); await pg.wait_for_timeout(2000)
        if tasten:
          await pg.click('.c6k-feld')
          for t in tasten:
            if len(t)==1: await pg.keyboard.type(t)
            else: await pg.keyboard.press(t)
            await pg.wait_for_timeout(120)
        await pg.wait_for_timeout(700)
        await pg.screenshot(path=f'{HIER}/sl_{name}_{g}.png')
        print(g,name,'Fehler:',f[:3])
        await ctx.close()
    await b.close()
asyncio.run(main())
