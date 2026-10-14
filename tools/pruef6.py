#!/usr/bin/env python3
"""Carl 6 · Prüfung aller Räume auf iPhone (390x844, Touch) und Computer (1440x900).

Aufruf:  python3 tools/pruef6.py [--datei pfad.html] [--kein-bau] [--nur raum1,raum2]
Prüft je Raum: Konsolenfehler, seitlicher Überlauf, Tippziele < 44 px, Überdeckung
(elementFromPoint an der Mitte jedes sichtbaren Knopfs), Kontrast (grob, WCAG), Blase gegen
Wort/SVG-Text/Schild/Knopf/Regler/Nadel und Carls Gesicht, Chips gegen Knöpfe, Regler/Nadel gegen
Rauminhalt, #c6-Scroll = 0 nach Gesten.
Dazu: Wisch-Test von Raum zu Raum (Touch), Test „Text tippen, Raum wechseln, zurück“,
Höhenfahrt. Bilder + BERICHT.md nach werkstatt/pruef/.
"""
import asyncio, os, sys, json, time, subprocess

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUS = None
args = sys.argv[1:]
def arg(name, std=None):
    if name in args:
        i = args.index(name)
        return args[i + 1] if i + 1 < len(args) else std
    return std
DATEI = arg('--datei', os.path.join(R, 'carl6-test.html'))
AUS = arg('--aus', os.path.join(R, 'werkstatt', 'pruef'))
NUR = [x for x in (arg('--nur', '') or '').split(',') if x]
if '--kein-bau' not in args and '--datei' not in args:
    subprocess.run([sys.executable, os.path.join(R, 'tools', 'bau.py')], check=False, stdout=subprocess.DEVNULL)
os.makedirs(AUS, exist_ok=True)

from playwright.async_api import async_playwright

GERAETE = {
    'iphone': dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True),
    'computer': dict(viewport={'width': 1440, 'height': 900}, device_scale_factor=1),
}

PRUEF_JS = r"""
() => {
  const W = innerWidth, H = innerHeight;
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    if (r.right <= 0 || r.bottom <= 0 || r.left >= W || r.top >= H) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
      if (e.hasAttribute('data-sicht') && e.getAttribute('data-sicht') === 'aus') return false;
      if (e.hidden) return false;
      // ein rollender oder beschnittener Träger zeigt nur, was in seinem Rahmen liegt: weniger als die Hälfte sichtbar = nicht sichtbar
      if (e !== el && /auto|scroll|hidden|clip/.test(cs.overflowY + ' ' + cs.overflowX)) {
        const p = e.getBoundingClientRect();
        const dx = Math.min(r.right, p.right) - Math.max(r.left, p.left), dy = Math.min(r.bottom, p.bottom) - Math.max(r.top, p.top);
        if (dx <= 0 || dy <= 0 || dx * dy < 0.5 * r.width * r.height) return false;
      }
    }
    return true;
  };
  const name = (el) => {
    let n = el.tagName.toLowerCase();
    if (el.id) n += '#' + el.id;
    const c = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (c.length) n += '.' + c.join('.');
    const t = (el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 28);
    return t ? n + ' „' + t + '“' : n;
  };
  const erg = { ueberlauf: [], klein: [], verdeckt: [], kontrast: [], kontrastRoh: [], knoepfe: 0 };
  const se = document.scrollingElement || document.documentElement;
  if (se.scrollWidth > W + 1) erg.ueberlauf.push('Seite ' + se.scrollWidth + ' px breit');
  if (scrollX) erg.ueberlauf.push('Seite seitlich verschoben ' + scrollX);
  // Elemente, die über den Rand ragen, ohne in einem waagerechten Scroller zu liegen
  const buehne = document.querySelector('.c6-buehne[data-raum="' + (window.C6 && C6.jetzt) + '"]');
  const imScroller = (el) => {
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const ox = getComputedStyle(e).overflowX;
      if ((ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') && e !== document.getElementById('c6') && !e.classList.contains('c6-buehne')) return true;
    }
    return false;
  };
  if (buehne) {
    const br = buehne.getBoundingClientRect();
    buehne.querySelectorAll('*').forEach((el) => {
      if (erg.ueberlauf.length > 8) return;
      if (!(el.textContent || '').trim() && !el.matches('button,input,textarea,a,[role=button]')) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if ((r.right > br.right + 1 || r.left < br.left - 1) && !imScroller(el) && sichtbar(el)) {
        if (el.children.length && [...el.children].some(k => { const q = k.getBoundingClientRect(); return q.right > br.right + 1 || q.left < br.left - 1; })) return;
        erg.ueberlauf.push(name(el) + ' ragt hinaus (' + Math.round(r.left) + '…' + Math.round(r.right) + ')');
      }
    });
  }
  const knoepfe = [...document.querySelectorAll('button, a[href], input:not([type=hidden]), textarea, select, [role=button], [role=tab], [role=link], [tabindex]:not([tabindex="-1"])')].filter(sichtbar);
  erg.knoepfe = knoepfe.length;
  for (const el of knoepfe) {
    const r = el.getBoundingClientRect();
    const fein = el.closest('[data-c6-klein]');
    if ((r.width < 43.5 || r.height < 43.5) && !fein) {
      // ein Feld zählt mit seiner Hülle (z. B. das Eingabe-Dock)
      let h = el.parentElement, gross = false;
      if (el.matches('input,textarea')) { const p = h.getBoundingClientRect(); gross = p.height >= 43.5 && p.width >= 43.5 && h.children.length <= 3; }
      if (!gross) erg.klein.push(name(el) + ' ' + Math.round(r.width) + '×' + Math.round(r.height));
    }
    const cx = Math.min(W - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(H - 1, Math.max(0, r.top + r.height / 2));
    const hit = document.elementFromPoint(cx, cy);
    if (hit && hit !== el && !el.contains(hit) && !hit.contains(el)) {
      const lab = hit.closest('label');
      const rundgang = document.documentElement.classList.contains('c6r-an') && hit.closest('#c6r-schicht') && !el.closest('#c6r-schicht');
      if (!(lab && lab.contains(el)) && !rundgang) erg.verdeckt.push(name(el) + ' ← ' + name(hit));
    }
  }
  // Kontrast (grob): Textfarbe gegen erste deckende Hintergrundfarbe
  const rgb = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const misch = (o, u) => ({ r: o.r * o.a + u.r * (1 - o.a), g: o.g * o.a + u.g * (1 - o.a), b: o.b * o.a + u.b * (1 - o.a), a: 1 });
  // Hintergrund an der Textstelle: Stapel unter dem Punkt, erste deckende Farbe; Bild = unbekannt; Verlauf = seine erste Farbe
  const grund = (el) => {
    const r = el.getBoundingClientRect();
    const x = Math.min(W - 1, Math.max(0, r.left + Math.min(r.width / 2, 12))), y = Math.min(H - 1, Math.max(0, r.top + r.height / 2));
    const stapel = document.elementsFromPoint(x, y);
    const kette = [];
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) kette.push(e);
    const liste = [...kette, ...stapel.filter(e => !kette.includes(e))];
    const schichten = [];
    for (const e of liste) {
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) continue;
      const bi = cs.backgroundImage;
      if (bi && bi !== 'none') {
        if (!/gradient/.test(bi)) return null;
        const c0 = rgb(bi); if (c0 && c0.a > 0) { schichten.push(c0); if (c0.a >= 0.99) break; }
        continue;
      }
      const c = rgb(cs.backgroundColor);
      if (c && c.a > 0) { schichten.push(c); if (c.a >= 0.99) break; }
      if (e.tagName === 'svg' || e.tagName === 'CANVAS' || e.tagName === 'IMG') return null;
    }
    let u = { r: 244, g: 238, b: 228, a: 1 };
    for (let i = schichten.length - 1; i >= 0; i--) u = misch(schichten[i], u);
    return u;
  };
  const gesehen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim();
    if (t.length < 2) continue;
    const el = n.parentElement;
    if (!el || gesehen.has(el) || el.closest('svg,script,style')) continue;
    gesehen.add(el);
    if (!sichtbar(el)) continue;
    const cs = getComputedStyle(el);
    const f = rgb(cs.color); const g = grund(el);
    if (!f || !g) continue;
    let op = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
    const fc = misch({ ...f, a: f.a * op }, g);
    const L1 = lum(fc), L2 = lum(g);
    const k = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize), fett = parseInt(cs.fontWeight) >= 700;
    const soll = (px >= 24 || (px >= 18.66 && fett)) ? 3 : 4.5;
    if (k < soll) {
      const r = el.getBoundingClientRect();
      erg.kontrast.push(name(el) + ' ' + k.toFixed(2) + ' (soll ' + soll + ')');
      erg.kontrastRoh.push({ n: name(el), soll, f: [fc.r, fc.g, fc.b], x: r.left, y: r.top, w: r.width, h: r.height });
    }
  }
  return erg;
}
"""

SCROLL_JS = r"""
() => {
  const aus = [];
  const f = (el, n) => { if (!el) return; if (el.scrollLeft || el.scrollTop) aus.push(n + ' ' + el.scrollLeft + '/' + el.scrollTop); };
  f(document.getElementById('c6'), '#c6');
  f(document.scrollingElement, 'Seite');
  document.querySelectorAll('.c6k-welt,.c6k-ebene,.c6k-reihe,.c6k-stapel,.c6k-sprech').forEach(e => f(e, e.className));
  document.querySelectorAll('.c6-buehne').forEach(e => { if (e.scrollLeft) aus.push('Bühne ' + e.getAttribute('data-raum') + ' seitlich ' + e.scrollLeft); });
  if (scrollX || scrollY) aus.push('Fenster ' + scrollX + '/' + scrollY);
  return aus;
}
"""

# Blase gegen Wort/Schild/Knopf, Knopf gegen Blase, Chips gegen Knöpfe (alles sichtbare Rechtecke, Schnittfläche > 5 % des Kleineren)
BLASE_JS = r"""
(was) => {
  const W = innerWidth, H = innerHeight;
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (r.right <= 0 || r.bottom <= 0 || r.left >= W || r.top >= H) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
      if (e.getAttribute && e.getAttribute('data-sicht') === 'aus') return false;
      if (e.hidden) return false;
      // ein rollender oder beschnittener Träger zeigt nur, was in seinem Rahmen liegt: weniger als die Hälfte sichtbar = nicht sichtbar
      if (e !== el && /auto|scroll|hidden|clip/.test(cs.overflowY + ' ' + cs.overflowX)) {
        const p = e.getBoundingClientRect();
        const dx = Math.min(r.right, p.right) - Math.max(r.left, p.left), dy = Math.min(r.bottom, p.bottom) - Math.max(r.top, p.top);
        if (dx <= 0 || dy <= 0 || dx * dy < 0.5 * r.width * r.height) return false;
      }
    }
    return true;
  };
  const name = (el) => {
    let n = el.tagName.toLowerCase();
    if (el.id) n += '#' + el.id;
    const c = (typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (c.length) n += '.' + c.join('.');
    const t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24);
    return t ? n + ' „' + t + '“' : n;
  };
  const schnitt = (a, b) => {
    const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left), dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (dx <= 0 || dy <= 0) return 0;
    return dx * dy / Math.max(1, Math.min(a.width * a.height, b.width * b.height));
  };
  const buehne = document.querySelector('.c6-buehne[data-raum="' + (window.C6 && C6.jetzt) + '"]');
  const carl = window.C6 && C6.carl && C6.carl.el;
  const aus = { blase: [], chips: [], regler: [], blaseDa: false, chipsDa: false };
  const stageR = buehne && buehne.getBoundingClientRect();
  // große Flächen-Knöpfe (Tür, Fenster: > 20 % der Bühne) zählen nicht selbst, nur ihre Schilder/Texte
  // … und ein Knopf mit eigenem Schild/Wort (Tür, Buch, Karte mit Text) zählt nicht selbst, nur sein Schild
  const grossflaechig = (el) => {
    if (el.matches('button,[role=button],a') && el.querySelector('text, span, p, b, strong, em, i, label, h1, h2, h3, h4') && (el.textContent || '').trim()) return true;
    if (!stageR) return false; const r = el.getBoundingClientRect(); return r.width * r.height > 0.2 * stageR.width * stageR.height; };
  // Rauminhalt (Wort, Schild, Knopf, Bild) unter Höhenregler oder Nadel-Knopf
  if (buehne) {
    const inhalt = [...buehne.querySelectorAll('text, button, [role=button], a, input, textarea, img, h1, h2, h3, h4, p, li, label, span, b, strong, em')].filter(el => {
      if (carl && (el === carl || carl.contains(el))) return false;
      if (el.tagName !== 'text' && !el.matches('button,[role=button],a,input,textarea,img')) {
        let hat = false; for (let ch = el.firstChild; ch; ch = ch.nextSibling) if (ch.nodeType === 3 && ch.nodeValue.trim()) { hat = true; break; }
        if (!hat) return false;
      }
      return sichtbar(el) && !grossflaechig(el);
    });
    for (const [sel, nm] of [['.c6k-hoehe', 'Regler'], ['#c6p-knopf', 'Nadel']]) {
      const k = document.querySelector(sel);
      if (!k || !sichtbar(k)) continue;
      const kr = k.getBoundingClientRect();
      for (const el of inhalt) {
        const q = schnitt(kr, el.getBoundingClientRect());
        if (q > 0.05) aus.regler.push(nm + ' ← ' + name(el) + ' (' + Math.round(q * 100) + ' %)');
        if (aus.regler.length > 8) break;
      }
    }
  }
  const blase = document.querySelector('.c6k-blase-rahmen[data-an] .c6k-blase');
  if (blase && sichtbar(blase)) {
    aus.blaseDa = true;
    const br = blase.getBoundingClientRect();
    const worte = [];
    if (buehne) buehne.querySelectorAll('text, button, [role=button], a, input, textarea, img, h1, h2, h3, h4, p, li, label, span, b, strong, em').forEach(el => {
      if (carl && (el === carl || carl.contains(el))) return;
      if (el.tagName !== 'text' && !el.matches('button,[role=button],a,input,textarea,img')) {
        let hat = false; for (let ch = el.firstChild; ch; ch = ch.nextSibling) if (ch.nodeType === 3 && ch.nodeValue.trim()) { hat = true; break; }
        if (!hat) return;
      }
      if (grossflaechig(el)) return;
      worte.push(el);
    });
    document.querySelectorAll('.c6k-hoehe, #c6p-knopf, .c6k-kopf').forEach(el => worte.push(el));
    for (const el of worte) {
      if (!sichtbar(el)) continue;
      const q = schnitt(br, el.getBoundingClientRect());
      // Wort/Schild/Feld: ab 5 %; reine Bildfläche (Knopf ohne Wort, Bild): ab 20 % (eine berührte Ecke ist keine Verdeckung)
      const wort = el.tagName === 'text' || el.matches('input,textarea,.c6k-hoehe,#c6p-knopf') || (el.textContent || '').trim();
      if (q > (wort ? 0.05 : 0.2)) aus.blase.push(name(el) + ' (' + Math.round(q * 100) + ' %)');
      if (aus.blase.length > 8) break;
    }
    // Carls Augen sollten frei bleiben: Blase nicht über der oberen Hälfte der Figur
    if (carl && sichtbar(carl)) {
      const cr = carl.getBoundingClientRect();
      const kopf = { left: cr.left, right: cr.right, top: cr.top, bottom: cr.top + cr.height * 0.55, width: cr.width, height: cr.height * 0.55 };
      const q = schnitt(br, kopf);
      if (q > 0.12) aus.blase.push('Carls Gesicht (' + Math.round(q * 100) + ' %)');
    }
  }
  const chips = document.querySelector('.c6k[data-chips] .c6k-chips[data-an]');
  if (chips && sichtbar(chips)) {
    aus.chipsDa = true;
    // die Chips selbst (die Spur), nicht die volle Breite ihrer Zeile
    const cr = (chips.querySelector('.c6k-chips-spur') || chips).getBoundingClientRect();
    const kn = [...document.querySelectorAll('button, a[href], [role=button], input, textarea')].filter(el => !chips.contains(el) && !el.closest('.c6k-unten') && sichtbar(el));
    for (const el of kn) {
      const q = schnitt(cr, el.getBoundingClientRect());
      if (q > 0.05) aus.chips.push(name(el) + ' (' + Math.round(q * 100) + ' %)');
      if (aus.chips.length > 8) break;
    }
    if (blase && sichtbar(blase)) { const q = schnitt(cr, blase.getBoundingClientRect()); if (q > 0.05) aus.chips.push('Blase (' + Math.round(q * 100) + ' %)'); }
  }
  return aus;
}
"""

def pixelkontrast(png, roh, dpr):
    """Nachprüfung am Bild: Grund = häufigste Farbe am Rahmen um den Text."""
    if not roh: return []
    from PIL import Image
    from collections import Counter
    im = Image.open(png).convert('RGB')
    def lum(c):
        def f(v):
            v /= 255
            return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
    aus = []
    for k in roh:
        x0, y0 = int((k['x'] - 3) * dpr), int((k['y'] - 3) * dpr)
        x1, y1 = int((k['x'] + k['w'] + 3) * dpr), int((k['y'] + k['h'] + 3) * dpr)
        pts = []
        for x in range(max(0, x0), min(im.width, x1), 2):
            for y in (y0, y1):
                if 0 <= y < im.height: pts.append(im.getpixel((x, y)))
        for y in range(max(0, y0), min(im.height, y1), 2):
            for x in (x0, x1):
                if 0 <= x < im.width: pts.append(im.getpixel((x, y)))
        if not pts: continue
        g = Counter((p[0] // 4 * 4, p[1] // 4 * 4, p[2] // 4 * 4) for p in pts).most_common(1)[0][0]
        L1, L2 = lum(k['f']), lum(g)
        q = (max(L1, L2) + 0.05) / (min(L1, L2) + 0.05)
        if q < k['soll']: aus.append(f"{k['n']} {q:.2f} (soll {k['soll']})")
    return aus

async def touch_wisch(cdp, x0, x1, y, schritte=14, ms=260, mitte=None):
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x0, 'y': y}]})
    for i in range(1, schritte + 1):
        x = x0 + (x1 - x0) * i / schritte
        await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y}]})
        await asyncio.sleep(ms / 1000 / schritte)
        if mitte and i == schritte // 2:
            await mitte()
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})

async def pruefe_geraet(p, geraet, bericht):
    b = await p.chromium.launch()
    ctx = await b.new_context(**GERAETE[geraet])
    pg = await ctx.new_page()
    fehler = []
    pg.on('console', lambda m: fehler.append(m.text[:300]) if m.type == 'error' and 'fonts.g' not in m.text else None)
    pg.on('pageerror', lambda e: fehler.append('Absturz: ' + str(e)[:300]))
    await pg.goto('file://' + DATEI)
    await pg.wait_for_timeout(1200)
    raeume = await pg.evaluate("() => window.C6 ? Object.keys(C6.raeume) : []")
    start = await pg.evaluate("() => window.C6 && C6.jetzt")
    fehler_start = list(fehler)
    erg = {'start': start, 'start_fehler': fehler_start, 'raeume': {}, 'tests': []}
    # Startbild (frischer Mensch)
    await pg.screenshot(path=os.path.join(AUS, f'{geraet}-start.png'))
    # erster Start erledigt: Rundgang beenden, damit Räume frei sind
    await pg.evaluate("() => { try { if (C6.rundgang && C6.rundgang.an && C6.rundgang.ende) C6.rundgang.ende(); } catch(e) {} }")
    await pg.wait_for_timeout(500)
    reihe = await pg.evaluate("() => Object.values(C6.raeume).filter(d => (!d.hoehe || d.hoehe === 'boden') && typeof d.reihe === 'number').sort((a,b) => a.reihe - b.reihe).map(d => d.id)")
    ordnung = reihe + [r for r in raeume if r not in reihe and r != 'rundgang'] + (['rundgang'] if 'rundgang' in raeume else [])
    for rid in ordnung:
        if NUR and rid not in NUR: continue
        fehler.clear()
        await pg.evaluate(f"() => C6.geh({json.dumps(rid)})")
        await pg.wait_for_timeout(2300)
        r = await pg.evaluate(PRUEF_JS)
        r['fehler'] = list(fehler)
        r['jetzt'] = await pg.evaluate("() => C6.jetzt")
        await pg.screenshot(path=os.path.join(AUS, f'{geraet}-{rid}.png'))
        r['kontrast'] = pixelkontrast(os.path.join(AUS, f'{geraet}-{rid}.png'), r.pop('kontrastRoh'), GERAETE[geraet].get('device_scale_factor', 1))
        r['scroll'] = await pg.evaluate(SCROLL_JS)
        # Blase gegen Wort/Schild/Knopf und Chips gegen Knöpfe – nicht im Rundgang (jungs Schicht spricht dort selbst)
        r['blase'] = []
        if rid != 'rundgang':
            await pg.evaluate("() => { C6.sag('Ich leg dir zwei Gedanken hin, und du findest den Satz dazwischen.'); }")
            await pg.wait_for_timeout(1100)
            b1 = await pg.evaluate(BLASE_JS)
            await pg.evaluate("() => { C6.frag('', ['Los', 'Zeig her', 'Später'], {}); }")
            await pg.wait_for_timeout(650)
            b2 = await pg.evaluate(BLASE_JS)
            r['blase'] = [('Blase ← ' + x) for x in b1.get('blase', [])] + [('Chips ← ' + x) for x in b2.get('chips', [])] + [('Blase bei Chips ← ' + x) for x in b2.get('blase', []) if x not in b1.get('blase', [])] + b1.get('regler', [])
            if r['blase'] or rid == 'zuhause':
                await pg.screenshot(path=os.path.join(AUS, f'{geraet}-{rid}-blase.png'))
            await pg.evaluate("() => { C6.schweig(); }")
            await pg.wait_for_timeout(450)
            r['scroll'] += [x for x in await pg.evaluate(SCROLL_JS) if x not in r['scroll']]
        erg['raeume'][rid] = r
        if rid == 'rundgang':
            await pg.evaluate("() => { try { C6.rundgang && C6.rundgang.ende && C6.rundgang.ende(); } catch(e) {} }")
            await pg.wait_for_timeout(400)
    # zurück an den Anfang der Reihe
    if reihe:
        await pg.evaluate(f"() => C6.geh({json.dumps(reihe[0])})")
        await pg.wait_for_timeout(700)

    # Test: Sprechen (Blase, Wort für Wort, ohne Sprung)
    if reihe:
        fehler.clear()
        h = await pg.evaluate("""async () => {
          C6.sag('Ich lege dir zwei Gedanken hin. Verbinden tust du.');
          const r = document.querySelector('.c6k-blase');
          const hs = [];
          for (let i = 0; i < 12; i++) { await new Promise(z => setTimeout(z, 90)); hs.push(r.offsetHeight); }
          return hs; }""")
        stabil = len(set(h[3:])) == 1
        erg['tests'].append(('Blase hält ihre Größe beim Schreiben', stabil, ' '.join(map(str, h))))
        await pg.screenshot(path=os.path.join(AUS, f'{geraet}-blase.png'))
        ok = await pg.evaluate("""async () => {
          const p = C6.frag('Wie geht es dir heute?', ['Gut', 'Müde', 'Viel los'], {frei: true, id: 'probe'});
          await new Promise(z => setTimeout(z, 500));
          const c = [...document.querySelectorAll('.c6k-chip')];
          const sicht = getComputedStyle(document.querySelector('.c6k-chips')).visibility;
          c[1] && c[1].click();
          const a = await Promise.race([p, new Promise(z => setTimeout(() => z('ZEIT'), 2000))]);
          return {n: c.length, sicht, a}; }""")
        erg['tests'].append(('Antwort-Chips: sichtbar, Wahl kommt an', ok.get('n') == 3 and ok.get('sicht') == 'visible' and ok.get('a') == 'Müde', json.dumps(ok, ensure_ascii=False)))
        await pg.wait_for_timeout(300)

    # Test: Text tippen, Raum wechseln, zurück
    if len(reihe) > 1:
        await pg.evaluate(f"() => C6.geh({json.dumps(reihe[0])})")
        await pg.wait_for_timeout(600)
        await pg.click('.c6k-feld')
        await pg.keyboard.type('Ein Satz, der bleibt')
        feld_in_raum = await pg.evaluate("""() => {
          const b = document.querySelector('.c6-buehne[data-raum="' + C6.jetzt + '"]');
          const f = b && [...b.querySelectorAll('input[type=text],input:not([type]),textarea')].find(x => x.getBoundingClientRect().width > 0);
          if (!f) return null; f.focus(); return true; }""")
        if feld_in_raum:
            await pg.keyboard.type('Raumfeld bleibt')
        scroll = await pg.evaluate("""() => {
          const b = document.querySelector('.c6-buehne[data-raum="' + C6.jetzt + '"]');
          const s = b && [...b.querySelectorAll('*')].find(x => x.scrollHeight > x.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(x).overflowY));
          if (!s) return null; s.scrollTop = 120; return s.scrollTop; }""")
        await pg.click(f'.c6k-raumknopf[data-raum="{reihe[1]}"]')
        await pg.wait_for_timeout(700)
        await pg.click(f'.c6k-raumknopf[data-raum="{reihe[0]}"]')
        await pg.wait_for_timeout(700)
        nach = await pg.evaluate("""() => {
          const b = document.querySelector('.c6-buehne[data-raum="' + C6.jetzt + '"]');
          const f = b && [...b.querySelectorAll('input[type=text],input:not([type]),textarea')].find(x => x.getBoundingClientRect().width > 0);
          const s = b && [...b.querySelectorAll('*')].find(x => x.scrollHeight > x.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(x).overflowY));
          return {dock: document.querySelector('.c6k-feld').value, raum: f ? f.value : null, scroll: s ? s.scrollTop : null, gespeichert: (JSON.parse(localStorage.getItem('carl6') || '{}').entwurf || {}).dock || ''}; }""")
        ok = nach['dock'] == 'Ein Satz, der bleibt' and (not feld_in_raum or nach['raum'] == 'Raumfeld bleibt') and (scroll is None or nach['scroll'] == scroll)
        erg['tests'].append(('Text tippen, Raum wechseln, zurück: Text noch da', ok, json.dumps(nach, ensure_ascii=False)))
        sc = await pg.evaluate(SCROLL_JS)
        erg['tests'].append(('#c6 scrollt nicht nach Tippen und Raumwechsel', not sc, '; '.join(sc) or '0/0'))
        await pg.evaluate("() => C6.eingabe.setze('')")

    # Wisch-Test (Touch)
    if geraet == 'iphone' and len(reihe) > 1:
        cdp = await ctx.new_cdp_session(pg)
        await pg.evaluate(f"() => C6.geh({json.dumps(reihe[0])})")
        await pg.wait_for_timeout(700)
        # Wischen hat eine Bedeutung: es blättert überall – über dem Tresen/der Szene (y = 250) wie über einem senkrechten Roller (y = 420)
        for y_ort, y_probe in (('oben', 250), ('unten', 560)):
            await touch_wisch(cdp, 330, 60, y_probe)
            await pg.wait_for_timeout(700)
            jo1 = await pg.evaluate("() => C6.jetzt")
            await touch_wisch(cdp, 40, 360, y_probe, schritte=16, ms=320)
            await pg.wait_for_timeout(700)
            jo2 = await pg.evaluate("() => C6.jetzt")
            erg['tests'].append((f'Wischen {y_ort} (y={y_probe}): nach links und zurück', jo1 == reihe[1] and jo2 == reihe[0], f'{reihe[0]}→{jo1}→{jo2}'))
            if jo2 != reihe[0]:
                await pg.evaluate(f"() => C6.geh({json.dumps(reihe[0])})"); await pg.wait_for_timeout(700)
        y = 420
        nachbar_sicht = {}
        async def mitte():
            nachbar_sicht['v'] = await pg.evaluate(f"() => {{ const n = document.querySelector('.c6-buehne[data-raum=\"{reihe[1]}\"]'); if (!n) return 'fehlt'; const r = n.getBoundingClientRect(); return n.getAttribute('data-sicht') + ' x=' + Math.round(r.left); }}")
            await pg.screenshot(path=os.path.join(AUS, f'{geraet}-wisch-mitte.png'))
        await touch_wisch(cdp, 330, 60, y, mitte=mitte)
        await pg.wait_for_timeout(700)
        j1 = await pg.evaluate("() => C6.jetzt")
        # zurück: ein waagerechter Scroller im Raum (Panorama) läuft erst bis zum Rand, dann gleitet der Raum
        zuege = 0
        for _ in range(4):
            zuege += 1
            await touch_wisch(cdp, 40, 360, y, schritte=16, ms=320)
            await pg.wait_for_timeout(700)
            j2 = await pg.evaluate("() => C6.jetzt")
            if j2 == reihe[0]: break
        # kurzer Zupfer: bleibt
        await touch_wisch(cdp, 200, 170, y, schritte=6, ms=300)
        await pg.wait_for_timeout(600)
        j3 = await pg.evaluate("() => C6.jetzt")
        # senkrecht: kein Raumwechsel
        await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': 200, 'y': 600}]})
        for i in range(1, 10):
            await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': 200 + i, 'y': 600 - i * 30}]})
            await asyncio.sleep(0.02)
        await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        await pg.wait_for_timeout(600)
        j4 = await pg.evaluate("() => C6.jetzt")
        ok = j1 == reihe[1] and j2 == reihe[0] and j3 == reihe[0] and j4 == reihe[0] and str(nachbar_sicht.get('v', '')).startswith('an')
        erg['tests'].append(('Wischen: nach links, zurück, Zupfer bleibt, senkrecht bleibt; Nachbar lugt herein', ok,
                             f'{reihe[0]}→{j1}→{j2} ({zuege} Zug/Züge zurück), Zupfer {j3}, senkrecht {j4}, Nachbar mitten im Wischen: {nachbar_sicht.get("v")}'))
        erg['tests'].append(('Wischen: genau ein Zug je Raumwechsel', zuege == 1, f'{zuege} Zug/Züge zurück'))
        # langsamer Zug (0,5 s, 250 px) und Zug über Carl müssen auch blättern
        await touch_wisch(cdp, 330, 80, y, schritte=20, ms=500)
        await pg.wait_for_timeout(700)
        j5 = await pg.evaluate("() => C6.jetzt")
        await pg.evaluate(f"() => C6.geh({json.dumps(reihe[0])})")
        await pg.wait_for_timeout(700)
        carl_r = await pg.evaluate("() => { const c = C6.carl && C6.carl.el; if (!c) return null; const r = c.getBoundingClientRect(); return r.width > 0 ? [r.left + r.width / 2, r.top + r.height * 0.6] : null; }")
        j6 = None
        if carl_r:
            await touch_wisch(cdp, carl_r[0] + 60, carl_r[0] - 160, carl_r[1], schritte=16, ms=320)
            await pg.wait_for_timeout(700)
            j6 = await pg.evaluate("() => C6.jetzt")
        erg['tests'].append(('Wischen: langsamer Zug blättert, Zug über Carl blättert', j5 == reihe[1] and (carl_r is None or j6 == reihe[1]), f'langsam → {j5}, über Carl → {j6 if carl_r else "(kein Carl im Raum)"}'))
        await pg.evaluate(f"() => C6.geh({json.dumps(reihe[0])})")
        await pg.wait_for_timeout(500)
        sc = await pg.evaluate(SCROLL_JS)
        erg['tests'].append(('#c6 scrollt nicht nach Gesten', not sc, '; '.join(sc) or '0/0'))
        # Scroll von außen (scrollIntoView aus einem Raum) darf #c6 nicht verschieben
        sc2 = await pg.evaluate("""async () => {
          const n = document.querySelector('.c6-buehne:not([data-raum="' + C6.jetzt + '"])');
          try { n && n.scrollIntoView({ block: 'center', inline: 'center' }); } catch (e) {}
          document.getElementById('c6').scrollLeft = 300;
          await new Promise(z => setTimeout(z, 150));
          const c = document.getElementById('c6');
          return [c.scrollLeft, c.scrollTop]; }""")
        erg['tests'].append(('#c6 bleibt bei scrollIntoView/scrollLeft von außen fest', sc2 == [0, 0], str(sc2)))

    # Höhenfahrt
    hoehen = await pg.evaluate("() => [...new Set(Object.values(C6.raeume).map(d => d.hoehe || 'boden'))]")
    if 'vogel' in hoehen:
        await pg.evaluate("() => C6.hoehe('vogel')")
        await pg.wait_for_timeout(180)
        await pg.screenshot(path=os.path.join(AUS, f'{geraet}-kamera-mitte.png'))
        await pg.wait_for_timeout(700)
        h = await pg.evaluate("() => C6.hoeheJetzt")
        await pg.evaluate("() => C6.hoehe('boden')")
        await pg.wait_for_timeout(700)
        h2 = await pg.evaluate("() => C6.hoeheJetzt")
        erg['tests'].append(('Höhenfahrt Boden → Vogelflug → Boden', h == 'vogel' and h2 == 'boden', f'{h} → {h2}'))
    erg['tests'].append(('Keine Konsolenfehler in den Tests', not fehler, '; '.join(fehler[:5])))
    bericht[geraet] = erg
    await b.close()

def schreibe(bericht):
    z = ['# Prüfbericht Carl 6', '', time.strftime('%d.%m.%Y %H:%M'), '', f'Datei: `{DATEI}`', '']
    alles_gruen = True
    for g, e in bericht.items():
        z += [f'## {g}', '', f'Start: `{e["start"]}`' + (f' · Fehler beim Laden: {e["start_fehler"]}' if e['start_fehler'] else ''), '']
        z += ['| Raum | Fehler | Überlauf | Tippziele < 44 | Überdeckt | Kontrast | Blase/Chips | Scroll | Bild |', '|---|---|---|---|---|---|---|---|---|']
        for rid, r in e['raeume'].items():
            def zelle(l):
                return '–' if not l else '<br>'.join(x.replace('|', '/') for x in l[:6]) + (f'<br>… +{len(l) - 6}' if len(l) > 6 else '')
            if r['fehler'] or r['ueberlauf'] or r['klein'] or r['verdeckt'] or r['kontrast'] or r.get('blase') or r.get('scroll'): alles_gruen = False
            z.append(f'| {rid} | {zelle(r["fehler"])} | {zelle(r["ueberlauf"])} | {zelle(r["klein"])} | {zelle(r["verdeckt"])} | {zelle(r["kontrast"])} | {zelle(r.get("blase", []))} | {zelle(r.get("scroll", []))} | `pruef/{g}-{rid}.png` |')
        z += ['', '| Test | Ergebnis | Messung |', '|---|---|---|']
        for name, ok, mess in e['tests']:
            if not ok: alles_gruen = False
            z.append(f'| {name} | {"grün" if ok else "ROT"} | {str(mess).replace("|", "/")[:300]} |')
        z.append('')
    z.insert(4, '**Gesamt: ' + ('grün' if alles_gruen else 'nicht grün') + '**\n')
    open(os.path.join(AUS, 'BERICHT.md'), 'w', encoding='utf8').write('\n'.join(z))
    print('\n'.join(z))

async def main():
    bericht = {}
    async with async_playwright() as p:
        for g in GERAETE:
            await pruefe_geraet(p, g, bericht)
    schreibe(bericht)

asyncio.run(main())
