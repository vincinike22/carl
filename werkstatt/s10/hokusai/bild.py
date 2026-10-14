# s10 · hokusai · Schritt 6 „Wer denkt mit“: python3 bild.py
import asyncio, subprocess, sys
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; H=R+'/werkstatt/s10/hokusai'
subprocess.run([sys.executable,R+'/tools/bau.py'],stdout=subprocess.DEVNULL)
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ['computer','iphone']:
      ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1100,'height':800}}))
      pg=await ctx.new_page(); f=[]
      pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
      await pg.goto('file://'+R+'/carl6-test.html'); await pg.wait_for_timeout(700)
      await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'Otto'})}")
      await pg.wait_for_timeout(900)
      await pg.evaluate("()=>C6.lernweg.oeffne({station:6})"); await pg.wait_for_timeout(600)
      await pg.screenshot(path=f'{H}/schritt6_{g}.png')
      print(g,'fertig vorher',await pg.evaluate("()=>C6.lernweg.stand().fertig"))
      await pg.locator('[data-lw=kopf][data-wert=lokal]').click(); await pg.wait_for_timeout(900)
      await pg.screenshot(path=f'{H}/eigenes_modell_{g}.png')
      print(g,'lokal-Blatt:',await pg.evaluate("()=>!!document.querySelector('.c6v-blatt')"),'fertig',await pg.evaluate("()=>C6.lernweg.stand().fertig"),'modell',await pg.evaluate("()=>C6.S.du.modell"))
      await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
      await pg.evaluate("()=>C6.lernweg.oeffne({station:6})"); await pg.wait_for_timeout(500)
      await pg.locator('[data-lw=kopf][data-wert=rechner]').click(); await pg.wait_for_timeout(900)
      print(g,'rechner-Blatt:',await pg.evaluate("()=>!!document.querySelector('.c6v-blatt')"),'Fehler',f[:3])
      await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
      await pg.evaluate("()=>C6.lernweg.oeffne({station:6})"); await pg.wait_for_timeout(500)
      await pg.locator('[data-lw=kopf][data-wert=claude]').click(); await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'{H}/schritt6_gewaehlt_{g}.png')
      await ctx.close()
    await b.close()
asyncio.run(m())
