import asyncio, json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(); pg = await (await b.new_context(viewport={'width':1100,'height':860})).new_page(); f=[]
    pg.on('pageerror', lambda e: f.append(str(e))); pg.on('console', lambda m: f.append(m.text) if m.type=='error' else None)
    await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(800)
    await pg.evaluate("""() => { try { C6.rundgang.ende(); } catch (e) {} const n = Date.now();
      C6.aendern(s => { s.du = Object.assign(s.du||{}, {fertig:true, name:'Otto'}); s.strings=[{id:'fa',titel:'Garten',art:'projekt',farbe:'#5f7f3e',perlen:[],erstellt:n-9e7}]; s.spaces={fa:{besucht:n}};
        s.lesesaal={funde:[{id:'u1',art:'link',titel:'Tomaten im Topf',url:'https://beispiel.test',notiz:'Gute Tipps',ts:n}]}; }); }""")
    await pg.wait_for_timeout(1500); await pg.evaluate("C6.geh('lesesaal',{funde:true})"); await pg.wait_for_timeout(1500)
    await pg.evaluate("document.querySelector('.c6w-ls-inspace').click()"); await pg.wait_for_timeout(700)
    await pg.evaluate("[...document.querySelectorAll('.c6k-chips-spur .c6k-chip')].find(b=>/Garten/.test(b.textContent)).click()"); await pg.wait_for_timeout(1200)
    print(json.dumps(await pg.evaluate("(C6.S.spaces.fa.notizen||[]).map(n=>({t:n.t,von:n.von}))"), ensure_ascii=False), 'Fehler', f)
    await pg.evaluate("C6.space.oeffne('fa')"); await pg.wait_for_timeout(2200); await pg.screenshot(path='fundzeichen_computer.png'); await b.close()
asyncio.run(main())
