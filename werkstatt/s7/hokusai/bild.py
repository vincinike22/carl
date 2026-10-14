# s7 · hokusai · Carl im Himmel: python3 bild.py <praefix> [szenen] [geraete]
import asyncio, sys, subprocess
from playwright.async_api import async_playwright
from PIL import Image
R='/home/claude/carl/n13'; H=R+'/werkstatt/s7/hokusai'
subprocess.run([sys.executable,R+'/tools/bau.py',H+'/carl6.html'],stdout=subprocess.DEVNULL)
open(H+'/t.html','w').write(open(R+'/carl6-test.html').read())
pre=sys.argv[1]; nur=sys.argv[2].split(',') if len(sys.argv)>2 and sys.argv[2] else None
ger=sys.argv[3].split(',') if len(sys.argv)>3 else ['iphone','computer']
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ger:
      ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1100,'height':800}}))
      pg=await ctx.new_page(); f=[]
      pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
      await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
      await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'Otto'});['Obstgarten','Abends lesen','Carl bauen','Laufen'].forEach(t=>C6.strings.neu({titel:t}))}")
      await pg.wait_for_timeout(800); await pg.evaluate("()=>C6.hoehe('vogel')"); await pg.wait_for_timeout(5500)
      if not nur or 'ruhe' in nur:
        await pg.screenshot(path=f'{H}/{pre}_ruhe_{g}.png')
      if not nur or 'flug' in nur:
        await pg.evaluate("()=>C6.bus.emit('strings',{was:'perle',id:C6.strings.alle().find(x=>x.titel=='Obstgarten').id})")
        fr=[]
        for i in range(6):
          await pg.wait_for_timeout(260); pth=f'{H}/_f{i}.png'; await pg.screenshot(path=pth); fr.append(Image.open(pth).convert('RGB'))
        sz=(fr[0].width//2, fr[0].height//2); o=Image.new('RGB',(sz[0]*3,sz[1]*2))
        for i,im in enumerate(fr): o.paste(im.resize(sz),((i%3)*sz[0],(i//3)*sz[1]))
        o.save(f'{H}/{pre}_flug_{g}.png')
        await pg.wait_for_timeout(4000)
      if not nur or 'spiel' in nur:
        await pg.mouse.move(5,5) if g=='computer' else None
        await pg.wait_for_timeout(26500)
        fr=[]
        for i in range(6):
          pth=f'{H}/_s{i}.png'; await pg.screenshot(path=pth); fr.append(Image.open(pth).convert('RGB')); await pg.wait_for_timeout(700)
        sz=(fr[0].width//2, fr[0].height//2); o=Image.new('RGB',(sz[0]*3,sz[1]*2))
        for i,im in enumerate(fr): o.paste(im.resize(sz),((i%3)*sz[0],(i//3)*sz[1]))
        o.save(f'{H}/{pre}_freudenflug_{g}.png')
        fr[2].save(f'{H}/{pre}_freudenflug_einzeln_{g}.png')
        if g=='computer': await pg.mouse.click(30,400)
        else: await pg.touchscreen.tap(30,400)
        await pg.wait_for_timeout(1800)
        await pg.screenshot(path=f'{H}/{pre}_zurueck_{g}.png')
      print(g,'Fehler',f[:3])
      await ctx.close()
    await b.close()
asyncio.run(m())
