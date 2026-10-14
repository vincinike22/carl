# Lupe: Carls Figur aus dem Himmel groß abbilden: python3 lupe.py <name> [szene-js] [warte]
import sys, asyncio
from playwright.async_api import async_playwright
H='/home/claude/carl/n13/werkstatt/s1/hokusai'
import subprocess
subprocess.run([sys.executable,'/home/claude/carl/n13/tools/bau.py',H+'/carl6.html'],stdout=subprocess.DEVNULL)
open(H+'/t.html','w').write(open('/home/claude/carl/n13/carl6-test.html').read())
name=sys.argv[1]; js=sys.argv[2] if len(sys.argv)>2 else ''; w=int(sys.argv[3]) if len(sys.argv)>3 else 0
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    pg.on('pageerror',lambda e: print('FEHLER',e))
    await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});['Carl bauen','Abends lesen','Werkstatt der Meister','Fahrradtour'].forEach(t=>C6.strings.neu({titel:t}))}")
    await pg.wait_for_timeout(900); await pg.evaluate("()=>C6.hoehe('vogel')"); await pg.wait_for_timeout(7500)
    if js: await pg.evaluate(js); await pg.wait_for_timeout(w)
    await pg.evaluate("""()=>{const s=document.querySelector('.c6w-h-carl svg');const d=document.createElement('div');d.style.cssText='position:fixed;left:0;top:0;width:390px;height:420px;background:#161b38;z-index:99999;display:flex;align-items:center;justify-content:center';const k=s.cloneNode(true);k.setAttribute('width','230');k.setAttribute('height','259');k.style.overflow='visible';d.appendChild(k);document.body.appendChild(d)}""")
    await pg.screenshot(path=H+'/'+name+'.png',clip={'x':0,'y':0,'width':390,'height':420})
    await b.close()
asyncio.run(m())
