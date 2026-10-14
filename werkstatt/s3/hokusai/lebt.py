# Carl lebt: Bildfolgen in Zuhause, Space, Werkstatt (python3 lebt.py <geraet>)
import asyncio, sys
from playwright.async_api import async_playwright
from PIL import Image
R='/home/claude/carl/n13'; H=R+'/werkstatt/s3/hokusai'; g=sys.argv[1] if len(sys.argv)>1 else 'iphone'
RAEUME=[('zuhause',"C6.geh('zuhause')"),('space',"C6.geh('space',{id:C6.strings.alle()[0].id})"),('werkstatt',"C6.geh('werkstatt')")]
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1440,'height':900}}))
    pg=await ctx.new_page(); f=[]
    pg.on('console',lambda x: f.append(x.text) if x.type=='error' else None); pg.on('pageerror',lambda e: f.append(str(e)))
    await pg.goto('file://'+R+'/carl6-test.html'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});['Carl bauen','Abends lesen'].forEach(t=>C6.strings.neu({titel:t}))}")
    await pg.wait_for_timeout(800)
    for name,js in RAEUME:
      await pg.evaluate("()=>{"+js+"}"); await pg.wait_for_timeout(1500)
      r=await pg.evaluate("()=>{const e=[...document.querySelectorAll('.c6z-figur')].map(x=>x.getBoundingClientRect()).filter(r=>r.width>40&&r.left>-10&&r.top>-10&&r.right<innerWidth+10&&r.bottom<innerHeight+10).sort((a,b)=>b.width-a.width)[0];return e?[e.left,e.top,e.width,e.height]:null}")
      if not r: print(name,'kein Carl'); continue
      x,y,w,h=r; m=0.35*w
      clip={'x':max(0,x-m),'y':max(0,y-m),'width':w+2*m,'height':h+1.4*m}
      bilder=[]
      for i in range(8):
        pfad=f'{H}/_f{i}.png'; await pg.screenshot(path=pfad,clip=clip); bilder.append(Image.open(pfad).copy())
        await pg.wait_for_timeout(1500)
      W=bilder[0].width; Hh=bilder[0].height
      o=Image.new('RGB',(W*4,Hh*2),'white')
      for i,im in enumerate(bilder): o.paste(im,((i%4)*W,(i//4)*Hh))
      o.save(f'{H}/lebt_{name}_{g}.png')
      await pg.screenshot(path=f'{H}/raum_{name}_{g}.png')
    print(g,'Fehler',f[:4])
    await b.close()
asyncio.run(m())
