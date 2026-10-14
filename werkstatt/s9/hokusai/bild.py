# s9 · hokusai: Teleskop-Bauplan + Freigabe, Freudenflug-Verdeckung am iPhone
import asyncio, subprocess, sys
from playwright.async_api import async_playwright
from PIL import Image
R='/home/claude/carl/n13'; H=R+'/werkstatt/s9/hokusai'
subprocess.run([sys.executable,R+'/tools/bau.py',H+'/carl6.html'],stdout=subprocess.DEVNULL)
open(H+'/t.html','w').write(open(R+'/carl6-test.html').read())
was=sys.argv[1] if len(sys.argv)>1 else 'alles'
DATEN="()=>{try{C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'Otto'});['Obstgarten','Abends lesen','Carl bauen','Laufen'].forEach(t=>C6.strings.neu({titel:t}));const sid=C6.strings.alle().find(x=>x.titel=='Laufen').id;try{const w=C6.werkzeug.haenge({name:'Gelaufen?',zeichen:'haken',teile:[{t:'haken',text:'Heute gelaufen?'},{t:'wert',text:'Wie weit?',einheit:'km'}]},sid);C6.werkzeug.teilen(w.id,true)}catch(e){console.log('wz',e)}}"
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    if was in ('alles','tele'):
      for g in ['iphone','computer']:
        ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1100,'height':800}}))
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
        await pg.evaluate(DATEN); await pg.wait_for_timeout(800)
        await pg.evaluate("()=>C6.geh('teleskop')"); await pg.wait_for_timeout(1800)
        st=pg.locator('.c6w-stern[data-id^="wz:"]')
        await st.click(); await pg.wait_for_timeout(600)
        await pg.screenshot(path=f'{H}/bauplan_werkzeug_{g}.png')
        await pg.locator('.c6w-stern', has_text='Zwei Wege').click(); await pg.wait_for_timeout(600)
        await pg.screenshot(path=f'{H}/bauplan_geruest_{g}.png')
        await pg.locator('.c6w-t-vorschau [data-tu=wand]').click(); await pg.wait_for_timeout(700)
        await pg.screenshot(path=f'{H}/rueckweg_{g}.png')
        an=await pg.evaluate("()=>(C6.S.wand||[]).length")
        await pg.locator('.c6k-rw-knopf').click(); await pg.wait_for_timeout(500)
        print(g,'Wand nach Übernehmen',an,'nach Abnehmen',await pg.evaluate("()=>(C6.S.wand||[]).length"),'Karte?',await pg.evaluate("()=>!!document.querySelector('.c6k-fg, .c6k-freigabe')"),'Fehler',f[:3])
        await ctx.close()
    if was in ('alles','flug'):
      ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True)
      pg=await ctx.new_page(); f=[]
      pg.on('pageerror',lambda e: f.append(str(e)))
      await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
      await pg.evaluate(DATEN); await pg.wait_for_timeout(800)
      await pg.evaluate("()=>C6.hoehe('vogel')"); await pg.wait_for_timeout(31000)
      bilder=[]
      for i in range(120):
        r=await pg.evaluate("()=>{const e=document.querySelector('.c6w-h-carl');if(!e.style.maskImage)return null;const q=e.querySelector('svg').getBoundingClientRect();return [q.left,q.top,q.width,q.height]}")
        if r and len(bilder)<4:
          x,y,w,h=r; pth=f'{H}/_v{len(bilder)}.png'
          await pg.screenshot(path=pth,clip={'x':max(0,x-60),'y':max(0,y-50),'width':w+120,'height':h+100}); bilder.append(pth)
          await pg.wait_for_timeout(500)
        await pg.wait_for_timeout(90)
      if bilder:
        ims=[Image.open(x) for x in bilder]; hh=max(i.height for i in ims); o=Image.new('RGB',(sum(i.width for i in ims),hh),'white'); xx=0
        for i in ims: o.paste(i,(xx,0)); xx+=i.width
        o.save(f'{H}/freudenflug_verdeckt_iphone.png')
      print('Verdeckungs-Bilder',len(bilder),'Fehler',f[:3])
      await ctx.close()
    await b.close()
asyncio.run(m())
