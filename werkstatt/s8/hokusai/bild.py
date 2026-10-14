# s8 · hokusai · Schritt 6 „Wo Carl wohnt“ mit QR: python3 bild.py
import asyncio
from playwright.async_api import async_playwright
H='/home/claude/carl/n13/werkstatt/s8/hokusai'
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ['computer','iphone']:
      ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1100,'height':800}}))
      pg=await ctx.new_page(); f=[]
      pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
      await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(700)
      await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'Otto',modell:'claude'})}")
      await pg.wait_for_timeout(900)
      await pg.evaluate("()=>C6.lernweg.oeffne({station:6})"); await pg.wait_for_timeout(600)
      await pg.screenshot(path=f'{H}/schritt6_{g}.png')
      if g=='computer':
        await pg.locator('.c6lw-qr').screenshot(path=f'{H}/qr_computer.png')
      else:
        await pg.locator('.c6lw-handy').scroll_into_view_if_needed(); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{H}/schritt6_home_{g}.png')
      await pg.locator('[data-lw=rechner]').click(); await pg.wait_for_timeout(900)
      await pg.screenshot(path=f'{H}/rechner_{g}.png')
      print(g,'Blatt offen:',await pg.evaluate("()=>!!document.querySelector('.c6v-blatt')"),'Fehler',f[:3])
      await ctx.close()
    await b.close()
asyncio.run(m())
