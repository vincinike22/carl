# Bilder s2 · raffael: python3 bild.py [szenen,…]
import sys, asyncio, shutil, subprocess
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; HIER=R+'/werkstatt/s4/raffael'
subprocess.run([sys.executable, R+'/tools/bau.py'], stdout=subprocess.DEVNULL)
nur=(sys.argv[1].split(',') if len(sys.argv)>1 and sys.argv[1]!='alle' else None)
DATEN = r"""(()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};const n=Date.now(),T=864e5,S=C6.S;
S.du=Object.assign(S.du||{},{fertig:true,name:'nico'});
S.gespraech=[{von:'du',t:'Ich will ein Fahrrad für den Geist bauen.',ts:n-T},{von:'carl',t:'Dann fang ich beim Sattel an.',ts:n-T+5000}];
S.wand=['v-woche','v-entscheid','v-seite','v-umzug'];
S.strings=[{id:'fa',titel:'Carl bauen',art:'projekt',farbe:'#2f5f8a',perlen:[{t:'Prototyp',ts:n-T}],erstellt:n-9*T},{id:'fb',titel:'Abends lesen',art:'gewohnheit',farbe:'#2c7a6e',perlen:[],erstellt:n-7*T}];S.geruest=[{id:'g1',name:'Morgenseiten',schritte:['Drei Seiten schreiben','Einen Satz anstreichen','Den Satz behalten'],farbe:'#7d4a74',ts:n}];
C6.speichern&&C6.speichern();C6.geh('zuhause');})()"""
pre=sys.argv[2] if len(sys.argv)>2 else 'nachher'
SZ = {
 'zuhause': ("", []),
 'werkstatt': ("C6.geh('werkstatt')", []),
 'space': ("C6.space&&C6.space.oeffne?C6.space.oeffne(C6.S.strings[0]&&C6.S.strings[0].id):C6.geh('space')", []),
 'post': ("C6.geh('post')", []),
 'himmel': ("C6.hoehe('vogel')", []),
 'gespraech': ("C6.verlauf.auf()", []),
}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ['iphone','computer']:
      for name,(js,tasten) in SZ.items():
        if nur and name not in nur: continue
        ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1100,'height':800}}))
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file://'+R+'/carl6-test.html'); await pg.wait_for_timeout(700)
        await pg.evaluate(DATEN); await pg.wait_for_timeout(1500)
        if js: await pg.evaluate("()=>{"+js+";}"); await pg.wait_for_timeout(2000)
        if tasten:
          await pg.click('.c6k-feld')
          for t in tasten:
            if len(t)==1: await pg.keyboard.type(t)
            else: await pg.keyboard.press(t)
            await pg.wait_for_timeout(120)
        await pg.wait_for_timeout(700)
        await pg.screenshot(path=f'{HIER}/{pre}_{name}_{g}.png')
        print(g,name,'Fehler:',f[:3])
        await ctx.close()
    await b.close()
asyncio.run(main())
