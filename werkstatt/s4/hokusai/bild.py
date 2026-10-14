# Bilder s4 · hokusai: python3 bild.py <praefix>
import asyncio, sys, subprocess
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; H=R+'/werkstatt/s4/hokusai'
subprocess.run([sys.executable,R+'/tools/bau.py',H+'/carl6.html'],stdout=subprocess.DEVNULL)
open(H+'/t.html','w').write(open(R+'/carl6-test.html').read())
pre=sys.argv[1]
SZ=[('himmel',"C6.hoehe('vogel')",4500),('teleskop',"C6.geh('teleskop')",2500)]
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ['iphone','computer']:
      for name,js,w in SZ:
        ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1100,'height':800}}))
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
        await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});['Carl bauen','Abends lesen','Werkstatt der Meister'].forEach(t=>C6.strings.neu({titel:t}))}")
        await pg.wait_for_timeout(800); await pg.evaluate("()=>{"+js+"}"); await pg.wait_for_timeout(w)
        await pg.screenshot(path=f'{H}/{pre}_{name}_{g}.png')
        if f: print(g,name,'Fehler',f[:3])
        await ctx.close()
    await b.close()
asyncio.run(m())
