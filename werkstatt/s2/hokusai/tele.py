import asyncio, subprocess, sys
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; H=R+'/werkstatt/s2/hokusai'
subprocess.run([sys.executable,R+'/tools/bau.py',H+'/carl6.html'],stdout=subprocess.DEVNULL)
open(H+'/t.html','w').write(open(R+'/carl6-test.html').read())
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ['computer','iphone']:
      ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1440,'height':900}}))
      pg=await ctx.new_page(); f=[]
      pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
      await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
      await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'})}")
      await pg.wait_for_timeout(800); await pg.evaluate("()=>C6.geh('teleskop')"); await pg.wait_for_timeout(2200)
      st=pg.locator('.c6w-stern').nth(2); bb=await st.bounding_box()
      if g=='computer': await pg.mouse.move(bb['x']+bb['width']/2, bb['y']+10); await pg.wait_for_timeout(600)
      else: await st.tap(); await pg.wait_for_timeout(600)
      await pg.screenshot(path=f'{H}/tele_vorschau_{g}.png')
      await pg.locator('.c6w-t-vorschau [data-tu=wand]').click(); await pg.wait_for_timeout(400)
      print(g, await pg.evaluate("()=>[document.querySelector('.c6w-t-vorschau').hidden, document.querySelector('.c6w-t-vorschau [data-tu]').textContent, (C6.S.wand||[]).length]"))
      await pg.locator('.c6w-t-vorschau [data-tu=mehr]').click(); await pg.wait_for_timeout(600)
      print(g,'blatt offen', await pg.evaluate("()=>!document.querySelector('.c6w-teleskop .c6w-blatt').hidden && document.querySelector('.c6w-t-vorschau').hidden"))
      print(g,'Fehler',f)
      await ctx.close()
    await b.close()
asyncio.run(m())
