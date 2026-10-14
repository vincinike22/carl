# Prüfstand für src/module/sync.js: zwei „Geräte“ (zwei Browser-Kontexte, je eigener localStorage)
# teilen sich eine nachgebaute Artifact-Datenbank (Python-Wörterbuch) über einen Fake claude.use('db'|'user').
# python3 pruefstand.py   → druckt die Proben und legt Bilder ab.
import asyncio, json, sys, subprocess
from playwright.async_api import async_playwright
R = '/home/claude/carl/n13'; HIER = R + '/werkstatt/s8/raffael/'
subprocess.run([sys.executable, R + '/tools/bau.py'], stdout=subprocess.DEVNULL)
STORE = {}; SCHREIB = []
FAKE = r"""
(() => {
  const NUTZER = 'nutzer-nico';
  const parity = (p) => p.split('/').length;
  function docRef(path) {
    if (parity(path) % 2) throw new TypeError('document path needs even segments: ' + path);
    return {
      id: path.split('/').pop(), path,
      async get() { const v = await window.fakeGet(path); return snap(path, v); },
      async set(d) { const t = JSON.stringify(d); if (t.length > 262144) throw { code: 'invalid_argument', message: 'over 256 KiB' }; await window.fakeSet(path, t); },
      async update(d) { const v = await window.fakeGet(path); if (v == null) throw { code: 'invalid_argument' }; await window.fakeSet(path, JSON.stringify(Object.assign(JSON.parse(v), d))); },
      async delete() { await window.fakeDel(path); },
      onSnapshot(next, err) {
        let alt = undefined, an = true;
        const tick = async () => { if (!an) return; try { const v = await window.fakeGet(path); if (v !== alt) { alt = v; next(snap(path, v)); } } catch (e) {} if (an) setTimeout(tick, 250); };
        tick(); return () => { an = false; };
      },
      collection(sub) { return colRef(path + '/' + sub); }
    };
  }
  function colRef(path) { return { path, doc: (id) => docRef(path + '/' + (id || Math.random().toString(36).slice(2))) }; }
  function snap(path, v) { return { id: path.split('/').pop(), exists: v != null, data: () => v == null ? undefined : JSON.parse(v), metadata: { fromCache: false, hasPendingWrites: false } }; }
  const db = { doc: docRef, collection: colRef };
  const user = { id: async () => NUTZER, isOwner: async () => true, canEdit: async () => true, can: async () => true };
  window.claude = { use: (n) => new Promise(r => setTimeout(() => r(n === 'db' ? db : n === 'user' ? user : null), 120)) };
})();
"""
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch()
    async def geraet(art):
      ctx = await b.new_context(**({'viewport': {'width': 390, 'height': 844}, 'device_scale_factor': 2, 'is_mobile': True, 'has_touch': True} if art == 'iphone' else {'viewport': {'width': 1100, 'height': 860}}))
      await ctx.expose_function('fakeGet', lambda path: STORE.get(path))
      def setze(path, t): STORE[path] = t; SCHREIB.append((art, path, len(t)))
      await ctx.expose_function('fakeSet', setze)
      await ctx.expose_function('fakeDel', lambda path: STORE.pop(path, None))
      await ctx.add_init_script(FAKE)
      pg = await ctx.new_page(); f = []
      pg.on('console', lambda m: f.append(m.text) if m.type == 'error' else None)
      pg.on('pageerror', lambda e: f.append(str(e)))
      await pg.goto('file://' + R + '/carl6-test.html'); await pg.wait_for_timeout(900)
      return pg, f
    mac, fm = await geraet('computer')
    # Mac: Rundgang übersprungen, ein Space mit einem Zettel
    await mac.evaluate("""() => { try { C6.rundgang && C6.rundgang.ende && C6.rundgang.ende(); } catch (e) {}
      C6.aendern(s => { s.du = Object.assign(s.du || {}, { fertig: true, name: 'nico' }); });
      C6.geh('zuhause'); const id = C6.space.neu('Garten auf dem Balkon', { oeffnen: false });
      C6.aendern(s => { s.spaces[id].notizen.push({ t: 'Tomaten in Kübeln', ts: Date.now() }); }); }""")
    await mac.wait_for_timeout(3000)
    print('Mac status', await mac.evaluate('C6.sync.status()'))
    print('Store', sorted(STORE.keys()))
    ip, fi = await geraet('iphone')
    await ip.wait_for_timeout(2500)
    print('iPhone status', await ip.evaluate('C6.sync.status()'))
    print('iPhone hat', await ip.evaluate("[C6.S.du && C6.S.du.name, (C6.S.strings||[]).map(s=>s.titel), JSON.stringify(Object.values(C6.S.spaces||{}).map(x=>(x.notizen||[]).map(n=>n.t)))]"))
    await ip.evaluate("() => C6.geh('zuhause')"); await ip.wait_for_timeout(800)
    await ip.screenshot(path=HIER + 'iphone_nach_abgleich.png')
    # iPhone ändert: ein Zettel dazu → Mac sieht ihn live
    await ip.evaluate("""() => { const id = C6.S.strings[0].id; C6.aendern(s => { s.spaces[id].notizen.push({ t: 'Vom iPhone: Erde kaufen', ts: Date.now() }); }); }""")
    await ip.wait_for_timeout(3500)
    print('Mac sieht', await mac.evaluate("JSON.stringify(Object.values(C6.S.spaces).map(x=>(x.notizen||[]).map(n=>n.t)))"))
    await mac.evaluate("() => C6.space.oeffne(C6.S.strings[0].id)"); await mac.wait_for_timeout(2000)
    await mac.screenshot(path=HIER + 'mac_sieht_iphone_zettel.png')
    # nur hier: ort/entwurf bleiben je Gerät
    print('ort je Gerät', await mac.evaluate('C6.S.ort && C6.S.ort.raum'), await ip.evaluate('C6.S.ort && C6.S.ort.raum'))
    # großer Stand → Teile
    await mac.evaluate("""() => C6.aendern(s => { s.gespraech = []; for (let i = 0; i < 190; i++) s.gespraech.push({ von: 'du', t: 'ä'.repeat(900) + i, ts: Date.now() }); })""")
    await mac.wait_for_timeout(3500)
    kopf = json.loads(STORE['data/users/nutzer-nico/carl'])
    print('Teile', kopf['n'], 'größtes Teil (Zeichen)', max(len(v) for k, v in STORE.items() if '/teile/' in k))
    await ip.wait_for_timeout(2500)
    print('iPhone Gespräch', await ip.evaluate('C6.S.gespraech.length'))
    # vergessen
    print('vergiss', await mac.evaluate('C6.sync.vergiss()'), sorted(STORE.keys()))
    print('Schreibvorgänge', len(SCHREIB))
    print('Fehler Mac', fm, 'iPhone', fi)
    await b.close()
asyncio.run(main())
