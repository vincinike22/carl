# s5 · hokusai: python3 bild.py <praefix> [geraete]
import asyncio, sys, subprocess
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; H=R+'/werkstatt/s5/hokusai'
subprocess.run([sys.executable,R+'/tools/bau.py',H+'/carl6.html'],stdout=subprocess.DEVNULL)
open(H+'/t.html','w').write(open(R+'/carl6-test.html').read())
pre=sys.argv[1]; ger=sys.argv[2].split(',') if len(sys.argv)>2 else ['iphone','computer']
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ger:
      ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1100,'height':800}}))
      pg=await ctx.new_page(); f=[]
      pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
      await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
      await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});['Obstgarten','Abends lesen','Carl bauen'].forEach(t=>C6.strings.neu({titel:t}))}")
      await pg.wait_for_timeout(800); await pg.evaluate("()=>C6.hoehe('vogel')"); await pg.wait_for_timeout(700)
      await pg.screenshot(path=f'{H}/{pre}_hinauf_{g}.png')
      await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'{H}/{pre}_hinauf2_{g}.png')
      await pg.wait_for_timeout(3800)
      await pg.screenshot(path=f'{H}/{pre}_himmel_{g}.png')
      # Sternbild ziehen: von Planet 1 zu Planet 2 (Orte aus der zugänglichen Liste)
      pts=await pg.evaluate("()=>[...document.querySelectorAll('.c6w-h-liste li')].slice(0,2).map(li=>{const r=document.querySelector('.c6w-h-vorn').getBoundingClientRect();return [r.left+parseFloat(li.style.getPropertyValue('--x')), r.top+parseFloat(li.style.getPropertyValue('--y'))]})")
      if len(pts)==2:
        (x0,y0),(x1,y1)=pts
        await pg.mouse.move(x0,y0); await pg.mouse.down()
        for i in range(1,16): await pg.mouse.move(x0+(x1-x0)*i/15, y0+(y1-y0)*i/15); await pg.wait_for_timeout(16)
        await pg.mouse.up(); await pg.wait_for_timeout(700)
        await pg.screenshot(path=f'{H}/{pre}_frage_{g}.png')
        inp=pg.locator('#c6w-knoten-in')
        if await inp.count():
          await inp.fill('Beides wächst langsam, wenn man es pflegt.'); await inp.press('Enter')
          for t,n in [(1200,'a'),(1300,'b'),(2500,'c'),(4200,'danach')]:
            await pg.wait_for_timeout(t); await pg.screenshot(path=f'{H}/{pre}_sternbild_{n}_{g}.png')
        else: print(g,'keine Frage')
      else: print(g,'keine Planeten',pts)
      await pg.locator('.c6w-h-teleskop').click(); await pg.wait_for_timeout(1800)
      await pg.screenshot(path=f'{H}/{pre}_teleskop_{g}.png')
      print(g,'raum',await pg.evaluate("()=>C6.jetzt"),'Fehler',f[:3])
      await ctx.close()
    await b.close()
asyncio.run(m())
