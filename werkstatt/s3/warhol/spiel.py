import sys, asyncio, json
from playwright.async_api import async_playwright
OUT = '/home/claude/carl/n13/werkstatt/s3/warhol/'
AUF = "C6.S.du={fertig:true,name:'nico'};C6.kieselpark.auf({park:'%s'})"
Z = "JSON.stringify((function(){var z=C6.kieselpark._zustand();return {st:z.b.st,x:Math.round(z.b.x),y:Math.round(z.b.y),v:Math.round(z.b.v),spin:+(z.b.spinSum||0).toFixed(2),p:Math.round(z.punkte),combo:z.combo.n,rest:+z.rest.toFixed(1),k:+z.k.toFixed(2),raf:z.raf}})())"

async def touch(cdp, typ, pts):
    await cdp.send('Input.dispatchTouchEvent', {'type': typ, 'touchPoints': [{'x': x, 'y': y, 'id': i} for i, (x, y) in enumerate(pts)]})

async def wisch(cdp, pg, x0, y0, x1, y1, n=8, ms=12):
    await touch(cdp, 'touchStart', [(x0, y0)])
    for i in range(1, n + 1):
        await touch(cdp, 'touchMove', [(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n)])
        await pg.wait_for_timeout(ms)
    await touch(cdp, 'touchEnd', [])

async def iphone(p, park):
    b = await p.chromium.launch()
    ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=3, is_mobile=True, has_touch=True)
    pg = await ctx.new_page(); fehler = []
    pg.on('console', lambda m: fehler.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: fehler.append(str(e)))
    await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(700)
    cdp = await ctx.new_cdp_session(pg)
    await pg.evaluate(AUF % park); await pg.wait_for_timeout(600)
    await pg.screenshot(path=OUT + park + '_start_iphone.png')
    # Schwung: dreimal nach vorn wischen
    for i in range(3):
        await wisch(cdp, pg, 120, 600, 300, 605, 6, 10); await pg.wait_for_timeout(180)
    print('nach Schwung', await pg.evaluate(Z))
    await pg.wait_for_timeout(500)
    await pg.screenshot(path=OUT + park + '_fahrt_iphone.png')
    # Aufladen: runterziehen, halten (Bild), dann hochschnellen und in der Luft seitwärts ziehen
    await touch(cdp, 'touchStart', [(200, 500)])
    for i in range(1, 8):
        await touch(cdp, 'touchMove', [(200, 500 + i * 11)]); await pg.wait_for_timeout(16)
    await pg.screenshot(path=OUT + park + '_laden_iphone.png')
    for i in range(1, 6):
        await touch(cdp, 'touchMove', [(200, 577 - i * 14)]); await pg.wait_for_timeout(10)
    await pg.wait_for_timeout(60)
    print('nach Sprung', await pg.evaluate(Z))
    for i in range(1, 12):
        await touch(cdp, 'touchMove', [(200 - i * 20, 507)]); await pg.wait_for_timeout(16)
    await pg.screenshot(path=OUT + park + '_luft_iphone.png')
    await touch(cdp, 'touchEnd', [])
    await pg.wait_for_timeout(900)
    print('nach Landung', await pg.evaluate(Z))
    await pg.screenshot(path=OUT + park + '_landung_iphone.png')
    await pg.wait_for_timeout(1500)
    print('später', await pg.evaluate(Z))
    await pg.evaluate("C6.kieselpark.zu()"); await pg.wait_for_timeout(400)
    print('zu, raf =', await pg.evaluate("C6.kieselpark._zustand().raf"), 'offen', await pg.evaluate("C6.kieselpark.offen"))
    print('Fehler:', fehler)
    await b.close()

async def computer(p, park):
    b = await p.chromium.launch()
    ctx = await b.new_context(viewport={'width': 1440, 'height': 900})
    pg = await ctx.new_page(); fehler = []
    pg.on('console', lambda m: fehler.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: fehler.append(str(e)))
    await pg.goto('file:///home/claude/carl/n13/carl6-test.html'); await pg.wait_for_timeout(700)
    await pg.evaluate(AUF % park); await pg.wait_for_timeout(500)
    await pg.screenshot(path=OUT + park + '_start_computer.png')
    await pg.keyboard.down('ArrowUp'); await pg.wait_for_timeout(2600); await pg.keyboard.up('ArrowUp')
    print('getreten', await pg.evaluate(Z))
    await pg.keyboard.down(' '); await pg.wait_for_timeout(450); await pg.keyboard.up(' ')
    await pg.wait_for_timeout(120)
    await pg.keyboard.down('ArrowLeft'); await pg.wait_for_timeout(260)
    await pg.screenshot(path=OUT + park + '_luft_computer.png')
    await pg.wait_for_timeout(300); await pg.keyboard.up('ArrowLeft')
    await pg.wait_for_timeout(700)
    print('gelandet', await pg.evaluate(Z))
    await pg.screenshot(path=OUT + park + '_landung_computer.png')
    for i in range(int(sys.argv[3]) if len(sys.argv) > 3 else 0):
        await pg.keyboard.down('ArrowUp'); await pg.wait_for_timeout(900); await pg.keyboard.up('ArrowUp')
        await pg.keyboard.down(' '); await pg.wait_for_timeout(400); await pg.keyboard.up(' '); await pg.wait_for_timeout(900)
    print('Ende-Lauf', await pg.evaluate(Z))
    await pg.evaluate("C6.kieselpark.zu()"); await pg.wait_for_timeout(400)
    print('zu, raf =', await pg.evaluate("C6.kieselpark._zustand().raf"))
    print('Fehler:', fehler)
    await b.close()

async def main():
    async with async_playwright() as p:
        if sys.argv[1] == 'iphone': await iphone(p, sys.argv[2])
        else: await computer(p, sys.argv[2])
asyncio.run(main())
