# Bilder s1 · hokusai (Himmel): python3 bild.py <praefix> [szenen] [geraete]
import sys, asyncio, subprocess, os
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; HIER=R+'/werkstatt/s2/hokusai'
subprocess.run([sys.executable, R+'/tools/bau.py', HIER+'/carl6.html'], stdout=subprocess.DEVNULL)
SEITE=HIER+'/t.html'
open(SEITE,'w').write(open(R+'/carl6-test.html').read())
pre=sys.argv[1]; nur=(sys.argv[2].split(',') if len(sys.argv)>2 and sys.argv[2] else None)
ger=(sys.argv[3].split(',') if len(sys.argv)>3 else ['iphone','computer'])
DATEN = r"""
(()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};const S=C6.S;
S.du=Object.assign(S.du||{},{fertig:true,name:'nico'});
try{['Carl bauen','Abends lesen','Werkstatt der Meister','Fahrradtour'].forEach(t=>C6.strings.neu({titel:t}))}catch(e){console.log('neu',e)}
})()
"""
# Szene: js | Wartezeit
SZ = {
 'himmel': "0|2500",
 'nah': "C6.geh('netz',{faden:C6.strings.alle().find(x=>x.titel=='Werkstatt der Meister').id})|2600",
}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ger:
      for name,js in SZ.items():
        if nur and name not in nur: continue
        ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1440,'height':900}}))
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file://'+SEITE); await pg.wait_for_timeout(700)
        await pg.evaluate(DATEN); await pg.wait_for_timeout(900)
        await pg.evaluate("()=>C6.hoehe('vogel')"); await pg.wait_for_timeout(3000)
        js,w=js.split('|'); w=int(w)
        if js!='0': await pg.evaluate(js)
        await pg.wait_for_timeout(w)
        await pg.screenshot(path=f'{HIER}/{pre}_{name}_{g}.png')
        r=await pg.evaluate("()=>{const e=document.querySelector('.c6w-h-carl .c6z-figur');if(!e)return null;const r=e.getBoundingClientRect();return [r.left,r.top,r.width,r.height]}")
        if r:
          x,y,wd,h=r; m=max(wd,h)*1.1
          clip={'x':max(0,x-m),'y':max(0,y-m*0.8),'width':wd+2*m,'height':h+1.6*m}
          try: await pg.screenshot(path=f'{HIER}/{pre}_{name}_{g}_nah.png',clip=clip)
          except Exception as e: print('nah',r)
        if f: print(g,name,'Fehler:',f[:3])
        await ctx.close()
    await b.close()
asyncio.run(main())
