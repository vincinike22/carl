# s6 · hokusai · Lernweg: python3 bild.py
import asyncio, sys, subprocess
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; H=R+'/werkstatt/s6/hokusai'
subprocess.run([sys.executable,R+'/tools/bau.py',H+'/carl6.html'],stdout=subprocess.DEVNULL)
open(H+'/t.html','w').write(open(R+'/carl6-test.html').read())
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ['iphone','computer']:
      ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1100,'height':800}}))
      pg=await ctx.new_page(); f=[]
      pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
      await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
      await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'Otto'})}")
      await pg.wait_for_timeout(900)
      await pg.evaluate("()=>C6.lernweg.oeffne()"); await pg.wait_for_timeout(500)
      await pg.evaluate("()=>{C6.lernweg.zu(); window.__x=C6.strings.neu({titel:'Probe'}).id}"); await pg.wait_for_timeout(300)
      await pg.evaluate("()=>C6.lernweg.oeffne({station:3})"); await pg.wait_for_timeout(400)
      await pg.screenshot(path=f'{H}/0_schritt3_ein_space_{g}.png')
      await pg.evaluate("()=>C6.lernweg.oeffne()"); await pg.wait_for_timeout(300)
      await pg.screenshot(path=f'{H}/1_plan_{g}.png')
      await pg.locator('[data-lw=st1]').click(); await pg.wait_for_timeout(400)
      await pg.screenshot(path=f'{H}/2_station1_{g}.png')
      # echtes Tun: ein Space entsteht, später ein zweiter Zettel, dann ein Sternbild
      await pg.evaluate("()=>{C6.lernweg.zu(); window.__a=C6.strings.neu({titel:'Laufen lernen'}).id; window.__b=C6.strings.neu({titel:'Gesund kochen'}).id;}")
      await pg.wait_for_timeout(4300)
      await pg.evaluate("()=>{try{C6.space.zettel(window.__a,'Ich will wieder laufen.');C6.space.zettel(window.__a,'Montags früh, bevor es heiß wird')}catch(e){console.log('z',e)}; C6.strings.knoten(window.__a,window.__b,'Beides macht mich wacher.')}")
      await pg.wait_for_timeout(1200)
      await pg.screenshot(path=f'{H}/3_carl_sagt_{g}.png')
      await pg.evaluate("()=>C6.lernweg.oeffne({station:6})"); await pg.wait_for_timeout(400)
      await pg.locator('[data-lw=wo][data-wert=computer]').click(); await pg.wait_for_timeout(300)
      await pg.locator('[data-lw=kopf][data-wert=claude]').click(); await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'{H}/4_station6_{g}.png', full_page=False)
      await pg.locator('[data-lw=plan]').click(); await pg.wait_for_timeout(300)
      await pg.screenshot(path=f'{H}/5_plan_haken_{g}.png')
      print(g, await pg.evaluate("()=>JSON.stringify(C6.lernweg.stand().fertig)"), 'Fehler', f[:3])
      await ctx.close()
    await b.close()
asyncio.run(m())
