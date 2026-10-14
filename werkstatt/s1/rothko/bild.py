# Bilder für s1 · rothko: python3 bild.py <praefix> [szenen,…]
import sys, asyncio, shutil, subprocess, os
from playwright.async_api import async_playwright
R='/home/claude/carl/n13'; HIER=R+'/werkstatt/s1/rothko'
subprocess.run([sys.executable, R+'/tools/bau.py', HIER+'/carl6.html'], stdout=subprocess.DEVNULL)
shutil.copy(R+'/carl6-test.html', HIER+'/t.html')
pre=sys.argv[1]; nur=(sys.argv[2].split(',') if len(sys.argv)>2 else None)
DATEN = r"""
(()=>{try{C6.rundgang&&C6.rundgang.ende&&C6.rundgang.ende()}catch(e){};const T=86400000,n=Date.now();const S=C6.S;
S.du=Object.assign(S.du||{},{fertig:true,name:'nico',baut:'Carl, einen Freund für Gedanken',ton:'Leise',tun:['Mich an den Kernsatz erinnern'],nie:['Nie ohne mein Ja etwas löschen']});
S.gespraech=[{von:'du',t:'Ich will ein Fahrrad für den Geist bauen.',ts:n-9*T},{von:'carl',t:'Dann fang ich beim Sattel an.',ts:n-9*T+5000},{von:'du',t:'Wie fange ich mit dem Prototyp an?',ts:n-3*T}];
S.strings=[{id:'fa',titel:'Carl bauen',art:'projekt',farbe:'#2f5f8a',perlen:[{t:'Ersten Prototyp im Browser gebaut',ts:n-6*T},{t:'Freunden gezeigt',ts:n-2*T}],erstellt:n-9*T},{id:'fb',titel:'Abends lesen',art:'gewohnheit',farbe:'#2c7a6e',perlen:[{t:'Marc Aurel, Buch II',ts:n-1*T}],erstellt:n-7*T},{id:'fc',titel:'Werkstatt der Meister',art:'idee',farbe:'#b7852a',perlen:[],erstellt:n-5*T}];
S.knoten=[{a:'fa',b:'fc',satz:'Carl lernt von den Meistern, wie ich.',ts:n-4*T}];
S.nadeln=[{satz:'Du verbindest, ich lege hin.',stringId:'fa',ts:n-5*T}];
S.spaces={fa:{kern:'Einfach wie ein Kind, Magie statt Technik.'}};
S.atlas=S.atlas||{};S.atlas.briefe=[{t:'Danke, dass du dir alles merkst.',ts:n-1*T,antwort:'Hab ich gelesen. Zweimal.'}];
})()
"""
SZ = {
 'b_titel': "C6.atlas.oeffne({seite:'titel'})",
 'b_du': "C6.atlas.oeffne({seite:'du'})",
 'b_fuerdich': "C6.atlas.oeffne({seite:'fuerdich'})",
 'b_carl': "C6.atlas.oeffne({seite:'carl'})",
 'b_damals': "C6.atlas.oeffne({seite:'damals'})",
 'b_brief': "C6.atlas.oeffne({seite:'brief'})",
 'b_anhang': "C6.atlas.oeffne({seite:'anhang'})",
 'b_code': "C6.atlas.oeffne({seite:'code'})",
 'blaettern': "C6.atlas.oeffne({seite:'du'});setTimeout(()=>document.querySelector('.c6r-at-vor').click(),900)|1330",
 'leer': "C6.S.gespraech=[];C6.S.strings=[];C6.S.knoten=[];C6.S.nadeln=[];C6.S.spaces={};C6.atlas.oeffne({seite:'damals'})",
 'bib_tun': "C6.geh('bibliothek',{buch:'tun'})|2600",
 'karte': "C6.geh('lesesaal',{thema:'philosophie'})|2600",
 'karte3': "C6.geh('lesesaal',{thema:'philosophie'});setTimeout(()=>{document.querySelector('.c6w-ls-vor').click();setTimeout(()=>document.querySelector('.c6w-ls-vor').click(),2400)},2200)|6500",
 'kartelauf': "C6.geh('lesesaal',{thema:'philosophie'});setTimeout(()=>document.querySelector('.c6w-ls-vor').click(),2200)|2900",
}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for g in ['iphone','computer']:
      for name,js in SZ.items():
        if nur and name not in nur: continue
        ctx=await b.new_context(**({'viewport':{'width':390,'height':844},'device_scale_factor':2,'is_mobile':True,'has_touch':True} if g=='iphone' else {'viewport':{'width':1440,'height':900}}))
        pg=await ctx.new_page(); f=[]
        pg.on('console',lambda m: f.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: f.append(str(e)))
        await pg.goto('file://'+HIER+'/t.html'); await pg.wait_for_timeout(700)
        await pg.evaluate(DATEN); await pg.wait_for_timeout(500)
        w=2400
        if '|' in js: js,w=js.split('|'); w=int(w)
        await pg.evaluate(js); await pg.wait_for_timeout(w)
        await pg.screenshot(path=f'{HIER}/{pre}_{name}_{g}.png')
        if f: print(g,name,'Fehler:',f[:3])
        await ctx.close()
    await b.close()
asyncio.run(main())
