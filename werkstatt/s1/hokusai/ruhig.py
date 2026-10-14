import asyncio
from playwright.async_api import async_playwright
H='/home/claude/carl/n13/werkstatt/s1/hokusai'
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,reduced_motion='reduce'); pg=await ctx.new_page()
    f=[]; pg.on('pageerror',lambda e: f.append(str(e))); pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
    await pg.goto('file://'+H+'/t.html'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};C6.S.du=Object.assign(C6.S.du||{},{fertig:true,name:'nico'});['Carl bauen','Abends lesen','Werkstatt der Meister','Fahrradtour'].forEach(t=>C6.strings.neu({titel:t}))}")
    await pg.wait_for_timeout(900); await pg.evaluate("()=>C6.hoehe('vogel')"); await pg.wait_for_timeout(3000)
    await pg.evaluate("()=>C6.bus.emit('strings',{was:'perle',id:C6.strings.alle().find(x=>x.titel=='Werkstatt der Meister').id})"); await pg.wait_for_timeout(600)
    print('ruhig', await pg.evaluate("()=>C6.ruhig"), await pg.evaluate("()=>document.querySelector('.c6w-h-carl').style.transform"), f[:3])
    await pg.screenshot(path=H+'/s1_ruhig_iphone.png')
    await b.close()
asyncio.run(m())
