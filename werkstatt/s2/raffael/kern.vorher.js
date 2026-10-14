/* Carl 6 · Kern: eine Welt, drei Höhen, Sprechen, Zustand */
var C6 = window.C6 = window.C6 || {};
var D = document, W = window;
var SCHLUESSEL = 'carl6';
var HOEHEN = ['boden', 'vogel', 'teleskop'];
var HOEHE_NAME = { boden: 'Boden', vogel: 'Vogelflug', teleskop: 'Teleskop' };
var GLEIT = 420, EASE = 'cubic-bezier(.22,.78,.24,1)';

function mach(tag, cls, eltern, txt) {
  var e = D.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  if (eltern) eltern.appendChild(e);
  return e;
}
function fehler(wo, e) { try { console.error('Carl6 · ' + wo, e); } catch (_) {} }
function klemme(v, a, b) { return Math.max(a, Math.min(b, v)); }
function spaeter(f, ms) { return setTimeout(function () { try { f(); } catch (e) { fehler('später', e); } }, ms || 0); }

/* ---------- Zustand ---------- */
var S = null;
try { S = JSON.parse(localStorage.getItem(SCHLUESSEL) || 'null'); } catch (e) { S = null; }
if (!S || typeof S !== 'object' || Array.isArray(S)) S = {};
S.v = 6;
if (!Array.isArray(S.gespraech)) S.gespraech = [];
if (!S.entwurf || typeof S.entwurf !== 'object') S.entwurf = {};
if (!S.ort || typeof S.ort !== 'object') S.ort = {};
C6.S = S;

var speicherUhr = null;
C6.speichern = function () {
  if (speicherUhr) { clearTimeout(speicherUhr); speicherUhr = null; }
  try {
    var s = C6.S;
    s.v = 6;
    if (!Array.isArray(s.gespraech)) s.gespraech = [];
    if (s.gespraech.length > 200) s.gespraech = s.gespraech.slice(-200);
    localStorage.setItem(SCHLUESSEL, JSON.stringify(s));
  } catch (e) { /* voller oder gesperrter Speicher: still weiter */ }
};
function baldSpeichern() { if (!speicherUhr) speicherUhr = setTimeout(C6.speichern, 600); }

/* ---------- Bus ---------- */
var hoerer = {};
C6.bus = {
  on: function (n, f) { (hoerer[n] = hoerer[n] || []).push(f); return function () { C6.bus.off(n, f); }; },
  off: function (n, f) { var l = hoerer[n]; if (l) { var i = l.indexOf(f); if (i >= 0) l.splice(i, 1); } },
  emit: function (n, d) {
    (hoerer[n] || []).slice().forEach(function (f) { try { f(d); } catch (e) { fehler('bus ' + n, e); } });
  }
};
C6.aendern = function (fn) {
  try { if (fn) fn(C6.S); } catch (e) { fehler('aendern', e); }
  baldSpeichern();
  C6.bus.emit('zustand', C6.S);
};
W.addEventListener('pagehide', function () { C6.speichern(); });
D.addEventListener('visibilitychange', function () { if (D.visibilityState === 'hidden') C6.speichern(); });

/* ---------- Gerät, Ruhe ---------- */
var mq = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
C6.ruhig = !!(mq && mq.matches);
C6.geraet = W.innerWidth >= 820 ? 'computer' : 'iphone';

/* ---------- Gerüst der Bühne ---------- */
var wurzel = D.getElementById('c6');
if (!wurzel) { wurzel = mach('div', null, D.body); wurzel.id = 'c6'; }
wurzel.classList.add('c6k');
wurzel.setAttribute('data-geraet', C6.geraet);
if (C6.ruhig) { wurzel.classList.add('c6k-ruhig'); D.documentElement.classList.add('c6k-ruhig'); }
if (mq && mq.addEventListener) mq.addEventListener('change', function () {
  C6.ruhig = mq.matches; wurzel.classList.toggle('c6k-ruhig', C6.ruhig); D.documentElement.classList.toggle('c6k-ruhig', C6.ruhig);
  C6.bus.emit('ruhig', C6.ruhig);
});

var welt = mach('div', 'c6k-welt', wurzel);
var ebenen = {}, stapel = {};
HOEHEN.forEach(function (h, i) {
  var e = mach('div', 'c6k-ebene', welt);
  e.setAttribute('data-hoehe', h);
  e.setAttribute('data-lage', i === 0 ? 'da' : 'oben');
  ebenen[h] = e;
});
var reihe = mach('div', 'c6k-reihe', ebenen.boden);
HOEHEN.forEach(function (h) { stapel[h] = mach('div', 'c6k-stapel', ebenen[h]); });

var sprech = mach('div', 'c6k-sprech', wurzel);
var kopf = mach('div', 'c6k-kopf', wurzel);
/* Räume ohne Platz in der Leiste (z. B. ein Space) bekommen auf Wunsch (def.zurueckKnopf) einen Weg zurück */
var zurueckEl = mach('button', 'c6k-zurueck', kopf);
zurueckEl.type = 'button';
zurueckEl.hidden = true;
zurueckEl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg><span class="c6k-zurueck-wohin"></span>';
zurueckEl.addEventListener('click', function () { C6.zurueck(); });
var ortEl = mach('p', 'c6k-ort', kopf);

var regler = mach('nav', 'c6k-hoehe', wurzel);
regler.setAttribute('aria-label', 'Höhe');
mach('i', 'c6k-hoehe-linie', regler);
var reglerKnopf = {};
['teleskop', 'vogel', 'boden'].forEach(function (h) {
  var b = mach('button', 'c6k-punkt', regler);
  b.type = 'button';
  b.setAttribute('data-hoehe', h);
  b.setAttribute('aria-label', HOEHE_NAME[h]);
  mach('span', 'c6k-punkt-name', b, HOEHE_NAME[h]);
  mach('i', 'c6k-punkt-kern', b);
  b.addEventListener('click', function () { if (!reglerZug || !reglerZug.bewegt) C6.hoehe(h); });
  reglerKnopf[h] = b;
});

var unten = mach('div', 'c6k-unten', wurzel);
var chipsEl = mach('div', 'c6k-chips', unten);
chipsEl.setAttribute('role', 'group');
var chipsSpur = mach('div', 'c6k-chips-spur', chipsEl);
var wzReihe = mach('div', 'c6k-wz', unten);
wzReihe.setAttribute('role', 'toolbar');
wzReihe.setAttribute('aria-label', 'Gerüste');
var wzSpur = mach('div', 'c6k-wz-spur', wzReihe);
var dock = mach('form', 'c6k-dock', unten);
dock.setAttribute('autocomplete', 'off');
dock.setAttribute('novalidate', '');
var vlKnopf = mach('button', 'c6k-dk c6k-dk-vl', dock);
vlKnopf.type = 'button';
vlKnopf.setAttribute('aria-label', 'Unser Gespräch zeigen');
vlKnopf.setAttribute('aria-expanded', 'false');
vlKnopf.title = 'Unser Gespräch';
vlKnopf.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 3.8h9.2a1.8 1.8 0 0 1 1.8 1.8v12.8"/><rect x="4.5" y="6.6" width="11.2" height="13.8" rx="1.8"/><path d="M7.6 11h5M7.6 14.2h5M7.6 17.2h3"/></svg>';
var wzKnopf = mach('button', 'c6k-dk c6k-dk-wz', dock);
wzKnopf.type = 'button';
wzKnopf.setAttribute('aria-label', 'Gerüste fürs Gespräch');
wzKnopf.setAttribute('aria-expanded', 'false');
wzKnopf.title = 'Gerüste';
wzKnopf.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 20.5V3.5M17 20.5V3.5"/><path d="M7 8h10M7 13h10M7 18h10"/></svg>';
var feld = mach('textarea', 'c6k-feld', dock);
feld.rows = 1;
feld.setAttribute('enterkeyhint', 'send');
feld.setAttribute('autocapitalize', 'sentences');
feld.setAttribute('aria-label', 'Nachricht an Carl');
var senden = mach('button', 'c6k-senden', dock);
senden.type = 'submit';
senden.setAttribute('aria-label', 'Senden');
senden.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5.5M6 11.2 12 5.3l6 5.9"/></svg>';
var leiste = mach('nav', 'c6k-leiste', unten);
leiste.setAttribute('aria-label', 'Räume');
var leisteSpur = mach('div', 'c6k-leiste-spur', leiste);
var faden = mach('i', 'c6k-faden', leisteSpur);

C6.welt = welt;
C6.kopf = kopf;
C6.dock = dock;
C6.leiste = leiste;

/* #c6 und seine Träger scrollen nie (auch nicht durch focus()/scrollIntoView aus Räumen):
   jeder Scroll an Wurzel, Welt, Ebene, Reihe, Stapel wird sofort zurückgesetzt; eine Bühne darf nur senkrecht. */
function scrollWache(e) {
  var t = e.target;
  if (!t || t.nodeType !== 1) return;
  var traeger = t === wurzel || t === welt || t === reihe || t === sprech || t.classList.contains('c6k-ebene') || t.classList.contains('c6k-stapel');
  if (traeger) { if (t.scrollLeft) t.scrollLeft = 0; if (t.scrollTop) t.scrollTop = 0; return; }
  if (t.classList.contains('c6-buehne') && t.scrollLeft) t.scrollLeft = 0;
}
wurzel.addEventListener('scroll', scrollWache, true);
W.addEventListener('scroll', function () { if (W.scrollX || W.scrollY) { try { W.scrollTo(0, 0); } catch (e) {} } });

/* ---------- Räume ---------- */
var raeume = {}, gebaut = {}, verlauf = [], carls = {}, letzterJe = {}, leisteKnopf = {};
C6.raeume = raeume;
C6.gebaut = function (id) { var g = gebaut[id]; return g ? g.el : null; };

function hoeheVon(d) { return d && HOEHEN.indexOf(d.hoehe) >= 0 ? d.hoehe : 'boden'; }
function inReihe(d) { return !!d && hoeheVon(d) === 'boden' && typeof d.reihe === 'number'; }
function reihenfolge() {
  return Object.keys(raeume).map(function (k) { return raeume[k]; }).filter(inReihe)
    .sort(function (a, b) { return a.reihe - b.reihe; }).map(function (d) { return d.id; });
}
function rufe(g, was, arg) {
  if (!g || !g.api || typeof g.api[was] !== 'function') return;
  try { return g.api[was](arg); } catch (e) { fehler(was + ' ' + g.id, e); }
}

var leisteUhr = null;
C6.raum = function (def) {
  if (!def || !def.id) return;
  raeume[def.id] = def;
  if (!leisteUhr) leisteUhr = spaeter(function () { leisteUhr = null; baueLeiste(); setzeLinks(); chrome(); }, 0);
};

function baue(id) {
  if (gebaut[id]) return gebaut[id];
  var d = raeume[id];
  if (!d) return null;
  var b = D.createElement('section');
  b.className = 'c6-buehne';
  b.setAttribute('data-raum', id);
  b.setAttribute('aria-label', d.name || id);
  b.setAttribute('data-sicht', 'aus');
  if (inReihe(d)) reihe.appendChild(b);
  else { b.classList.add('c6k-blende'); stapel[hoeheVon(d)].appendChild(b); }
  var g = { id: id, el: b, def: d, api: {} };
  gebaut[id] = g;
  setzeLinks();
  try {
    var r = typeof d.bauen === 'function' ? d.bauen(b, { id: id, buehne: b, aktiv: function () { return C6.jetzt === id; } }) : null;
    if (r && typeof r === 'object') g.api = r;
  } catch (e) { fehler('bauen ' + id, e); }
  C6.bus.emit('gebaut', id);
  return g;
}
function setzeLinks() {
  var ord = reihenfolge();
  ord.forEach(function (id, i) { var g = gebaut[id]; if (g && !g.leihe) g.el.style.left = (i * 100) + '%'; });
}

/* ---------- Kamera ---------- */
function breite() { return wurzel.clientWidth || W.innerWidth; }
var reiheX = 0, gleitNr = 0;
/* Die Fahrt: Kinder mit data-tiefe (fern|mitte|nah) bewegen sich beim Gleiten mit Tiefe. Der Kern führt
   dafür eine gefederte Geschwindigkeit --c6k-fahrt (px) auf der Reihe; fern lagt dagegen, nah eilt voraus,
   am Ende schwingt es leise nach und ruht bei 0. Nur transform/translate, ein Hörer im gemeinsamen Takt. */
var fahrt = { x: 0, v: 0, ziel: 0, hoerer: null };
function fahrtZiel(vPxProS) {
  if (C6.ruhig) return;
  fahrt.ziel = klemme(vPxProS * 0.075, -90, 90);
  if (!fahrt.hoerer) {
    reihe.classList.add('c6k-faehrt');
    fahrt.hoerer = C6.takt.on(function (t, dt) {
      // Feder: folgt der Zielgeschwindigkeit, überschwingt beim Anhalten ein wenig
      var a = -150 * (fahrt.x - fahrt.ziel) - 15 * fahrt.v;
      fahrt.v += a * dt; fahrt.x += fahrt.v * dt;
      if (Math.abs(fahrt.x - fahrt.ziel) < 0.25 && Math.abs(fahrt.v) < 1 && fahrt.ziel === 0) {
        fahrt.x = 0; fahrt.v = 0;
        reihe.style.setProperty('--c6k-fahrt', '0px');
        reihe.classList.remove('c6k-faehrt');
        if (fahrt.hoerer) fahrt.hoerer();
        fahrt.hoerer = null;
        return false;
      }
      reihe.style.setProperty('--c6k-fahrt', fahrt.x.toFixed(1) + 'px');
      return true;
    });
  }
}
/* Bezier-Kurve des Kerns (dieselbe wie EASE), in Zahlen */
function kurve(u) {
  if (u <= 0) return 0; if (u >= 1) return 1;
  var x1 = 0.22, y1 = 0.78, x2 = 0.24, y2 = 1, t = u;
  for (var i = 0; i < 6; i++) {
    var x = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t - u;
    var dx = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
    if (Math.abs(dx) < 1e-6) break;
    t -= x / dx; t = klemme(t, 0, 1);
  }
  return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
}
var gleitHoerer = null;
function setzeReihe(x, ms) {
  if (gleitHoerer) { gleitHoerer(); gleitHoerer = null; }
  reihe.style.transition = 'none';
  if (!ms || C6.ruhig) {
    reiheX = x;
    reihe.style.transform = 'translate3d(' + x + 'px,0,0)';
    return;
  }
  var von = reiheX, t0 = performance.now(), letztX = von, letztT = t0;
  gleitHoerer = C6.takt.on(function () {
    var now = performance.now(), u = Math.min(1, (now - t0) / ms);
    var nx = von + (x - von) * kurve(u);
    var v = (nx - letztX) / Math.max(1, now - letztT) * 1000;
    letztX = nx; letztT = now;
    reiheX = nx;
    reihe.style.transform = 'translate3d(' + nx.toFixed(2) + 'px,0,0)';
    fahrtZiel(u >= 1 ? 0 : v);
    if (u >= 1) { if (gleitHoerer) gleitHoerer(); gleitHoerer = null; C6.bus.emit('kamera', { was: 'ende', hoehe: 'boden', raum: C6.jetzt }); return false; }
    return true;
  });
}
function sicht(g, an) { if (g) g.el.setAttribute('data-sicht', an ? 'an' : 'aus'); }
function aufraeumen(nr, ms) {
  spaeter(function () {
    if (nr !== gleitNr || zug) return;
    Object.keys(gebaut).forEach(function (id) {
      var g = gebaut[id];
      if (id !== C6.jetzt) { sicht(g, false); g.el.removeAttribute('data-an'); g.el.removeAttribute('data-raus'); }
      if (g.leihe) { g.leihe = false; }
    });
    reihe.classList.remove('c6k-gleitet');
    setzeLinks();
    var i = reihenfolge().indexOf(letzterJe.reihe);
    if (i >= 0) setzeReihe(-i * breite(), 0);
  }, ms);
}
/* Höhenwechsel als Durchflug: beide Ebenen sind während der Fahrt sichtbar.
   Boden ↔ oben: senkrecht (der Boden fährt nach unten weg, der Himmel kommt von oben mit seiner Sternenfuge voraus);
   Himmel ↔ Teleskop: in die Tiefe (der Himmel wächst und verblasst, das Rund wächst aus der Mitte). */
var fahrtNr = 0, FAHRT_MS = 640;
function kamera(h, sofort) {
  var hi = HOEHEN.indexOf(h), war = HOEHEN.indexOf(wurzel.getAttribute('data-hoehe'));
  if (sofort) welt.classList.add('c6k-sofort');
  var fahrt = !sofort && !C6.ruhig && war >= 0 && war !== hi;
  var senk = fahrt && (war === 0 || hi === 0), auf = hi > war;
  var art = !fahrt ? null : (senk ? (auf ? 'hoch' : 'runter') : (auf ? 'vor' : 'zurueck'));
  var nr = ++fahrtNr;
  HOEHEN.forEach(function (x, i) {
    var e = ebenen[x], lage = i < hi ? 'unten' : (i > hi ? 'oben' : 'da');
    e.removeAttribute('data-fahrt');
    e.setAttribute('data-lage', lage);
  });
  if (art) {
    var weg = ebenen[HOEHEN[war]], her = ebenen[h];
    void welt.offsetWidth;
    weg.setAttribute('data-fahrt', art + '-weg');
    her.setAttribute('data-fahrt', art + '-her');
    welt.setAttribute('data-fahrt', art); wurzel.setAttribute('data-fahrt', art);
    spaeter(function () {
      if (nr !== fahrtNr) return;
      weg.removeAttribute('data-fahrt'); her.removeAttribute('data-fahrt'); welt.removeAttribute('data-fahrt'); wurzel.removeAttribute('data-fahrt');
    }, FAHRT_MS + 60);
  } else { welt.removeAttribute('data-fahrt'); wurzel.removeAttribute('data-fahrt'); }
  wurzel.setAttribute('data-hoehe', h);
  if (sofort) { void welt.offsetWidth; spaeter(function () { welt.classList.remove('c6k-sofort'); }, 30); }
}

C6.jetzt = null;
C6.vorher = null;
C6.geh = function (id, opts) {
  opts = opts || {};
  var d = raeume[id];
  if (!d) return false;
  if (C6.jetzt === id) { if (opts && Object.keys(opts).length) rufe(gebaut[id], 'betreten', opts); return true; }
  var altId = C6.jetzt, alt = altId ? gebaut[altId] : null;
  var g = baue(id);
  if (!g) return false;
  var hAlt = alt ? hoeheVon(alt.def) : null, hNeu = hoeheVon(d);
  if (alt && hAlt !== hNeu) {
    // Höhenwechsel: Carl ist der Bote zwischen oben und unten
    if (!opts.vonHoehe) opts.vonHoehe = hAlt;
    if (hAlt === 'boden') abflug(carls[altId], altId);
  }
  if (alt) {
    rufe(alt, 'verlassen');
    if (!opts.zurueck) { verlauf.push(altId); if (verlauf.length > 30) verlauf.shift(); }
  }
  C6.vorher = altId;
  C6.jetzt = id;
  letzterJe[hNeu] = id;
  if (inReihe(d)) letzterJe.reihe = id;
  var sofort = !alt || !!opts.sofort;
  zeige(alt, g, hAlt, hNeu, sofort);
  blaseWeg();
  if (vlOffen) C6.verlauf.zu();
  rufe(g, 'betreten', opts);
  if (alt && hAlt !== hNeu && hNeu === 'boden') spaeter(function () { if (C6.jetzt === id) landung(carls[id]); }, 20);
  chrome();
  try { C6.S.ort = { raum: id, hoehe: hNeu }; baldSpeichern(); } catch (e) {}
  C6.bus.emit('raum', id);
  if (hAlt !== hNeu) {
    C6.bus.emit('hoehe', hNeu);
    C6.bus.emit('kamera', { was: 'start', hoehe: hNeu, raum: id });
    var kNr = ++kameraNr;
    spaeter(function () { if (kNr === kameraNr) C6.bus.emit('kamera', { was: 'ende', hoehe: hNeu, raum: C6.jetzt }); }, sofort || C6.ruhig ? 280 : FAHRT_MS);
  }
  return true;
};
var kameraNr = 0;

function zeige(alt, g, hAlt, hNeu, sofort) {
  var nr = ++gleitNr;
  kamera(hNeu, sofort);
  var B = breite();
  sicht(g, true);
  if (inReihe(g.def)) {
    var ord = reihenfolge(), ni = ord.indexOf(g.id);
    var ausReihe = alt && inReihe(alt.def);
    if (ausReihe && hAlt === 'boden' && !sofort) {
      var ai = ord.indexOf(alt.id);
      sicht(alt, true);
      if (C6.ruhig) {
        reihe.classList.add('c6k-blendet');
        spaeter(function () { setzeReihe(-ni * B, 0); reihe.classList.remove('c6k-blendet'); }, 160);
      } else {
        var ziel = ni;
        if (Math.abs(ni - ai) > 1) {
          // weite Sprünge: der Zielraum legt sich für die Fahrt direkt neben den jetzigen
          ziel = ai + (ni > ai ? 1 : -1);
          g.leihe = true;
          g.el.style.left = (ziel * 100) + '%';
        }
        var rest = Math.abs(reiheX - (-ziel * B));
        var ms = Math.round(klemme(rest / B * GLEIT * 1.05, 200, GLEIT));
        reihe.classList.add('c6k-gleitet');
        setzeReihe(-ziel * B, ms);
        aufraeumen(nr, ms + 40);
        return;
      }
    } else {
      setzeReihe(-ni * B, 0);
    }
    // Sonderbühnen am Boden ausblenden
    Object.keys(gebaut).forEach(function (k) {
      var x = gebaut[k];
      if (x !== g && x.el.classList.contains('c6k-blende')) {
        if (x === alt && !sofort && !C6.ruhig) x.el.setAttribute('data-raus', 'rechts');
        x.el.removeAttribute('data-an');
      }
    });
    if (alt && alt !== g) sicht(alt, hAlt !== hNeu || !inReihe(alt.def));
  } else {
    // tiefer gleitet von rechts herein, höher von links (der rote Faden kennt die Tiefe)
    var ri = richtungZu(alt, g, hAlt, hNeu, sofort);
    g.el.setAttribute('data-rein', ri || 'still');
    void g.el.offsetWidth;
    g.el.setAttribute('data-an', '');
    Object.keys(gebaut).forEach(function (k) {
      var x = gebaut[k];
      if (x !== g && x.el.parentNode === g.el.parentNode) {
        if (x === alt && ri) x.el.setAttribute('data-raus', ri === 'rechts' ? 'links' : 'rechts');
        x.el.removeAttribute('data-an');
      }
    });
    if (alt && alt !== g) sicht(alt, true);
  }
  aufraeumen(nr, sofort ? 0 : 520);
}

/* Carl fliegt mit: beim Aufstieg hebt er ab und fliegt nach oben aus dem Bild,
   beim Abstieg kommt er von oben herab und landet auf seinem Platz (Figur: ctl.flieg / ctl.fliegZu) */
function carlLage(ctl) {
  var m = /translate3d\(\s*([-\d.]+)px\s*,\s*([-\d.]+)px/.exec((ctl && ctl.el && ctl.el.style.transform) || '');
  return m ? { x: +m[1], y: +m[2] } : { x: 0, y: 0 };
}
function kannFliegen(ctl) { return !!(ctl && typeof ctl.fliegZu === 'function' && typeof ctl.flieg === 'function' && ctl.el && ctl.el.isConnected); }
function abflug(ctl, raumId) {
  if (!kannFliegen(ctl) || C6.ruhig) return;
  try {
    var p = ctl._heim || carlLage(ctl);
    ctl._heim = p;
    Promise.resolve(ctl.fliegZu(p.x, p.y - 340, 560, { landen: false })).then(function () {
      // still zurück auf den Platz, solange niemand hinsieht
      if (C6.jetzt !== raumId && ctl._heim === p) { try { ctl.geh(p.x, 0, { y: p.y }); ctl.flieg(false); } catch (e) {} }
    }, function () {});
    bote(ctl);
    C6.bus.emit('carlFliegt', { raum: raumId, wohin: 'hoch' });
  } catch (e) { fehler('abflug', e); }
}
/* Der Bote: beim Aufstieg fliegt ein Abbild von Carl über beiden Ebenen durch die Sternenfuge nach oben.
   Er schrumpft dabei in die Ferne (1 → .35, etwa Carls Größe im Himmel).
   Nur während der Fahrt (640 ms), nur transform/opacity; der echte Carl bleibt so lange unsichtbar auf seinem Platz. */
function bote(ctl) {
  try {
    if (C6.ruhig || !ctl || !ctl.el || typeof ctl.el.animate !== 'function') return;
    var el = ctl.el, r = el.getBoundingClientRect(), w = wurzel.getBoundingClientRect();
    if (!r.width || r.bottom < w.top || r.top > w.bottom) return;
    var k = el.cloneNode(true);
    k.removeAttribute('id');
    Array.prototype.forEach.call(k.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
    k.setAttribute('aria-hidden', 'true');
    k.classList.add('c6k-bote');
    k.style.cssText = 'position:absolute;margin:0;left:' + (r.left - w.left) + 'px;top:' + (r.top - w.top) + 'px;width:' + r.width + 'px;height:' + r.height + 'px;transform:none;translate:none;transition:none;transform-origin:50% 50%';
    wurzel.appendChild(k);
    var sichtAlt = el.style.visibility;
    el.style.visibility = 'hidden';
    var hoch = -(r.top - w.top) - r.height * 0.6;
    var a = k.animate([
      { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: 'translate3d(0,8px,0) rotate(-2deg) scale(1.02,.97)', opacity: 1, offset: 0.14 },
      { transform: 'translate3d(6px,' + (hoch * 0.55) + 'px,0) rotate(4deg) scale(.45,.48)', opacity: 1, offset: 0.62 },
      { transform: 'translate3d(2px,' + hoch + 'px,0) rotate(-1deg) scale(.35)', opacity: 0 }
    ], { duration: FAHRT_MS, easing: 'cubic-bezier(.45,0,.35,1)', fill: 'both' });
    var weg = function () { try { k.remove(); } catch (e) {} if (el.style.visibility === 'hidden') el.style.visibility = sichtAlt; };
    a.onfinish = weg; a.oncancel = weg;
    spaeter(weg, FAHRT_MS + 200);
  } catch (e) { fehler('bote', e); }
}
function landung(ctl) {
  if (!kannFliegen(ctl) || C6.ruhig) return;
  try {
    var p = ctl._heim || carlLage(ctl);
    ctl._heim = null;
    ctl.geh(p.x, 0, { y: p.y - 300 });
    ctl.flieg(true);
    spaeter(function () { try { ctl.fliegZu(p.x, p.y, 760, { landen: true }); } catch (e) {} }, 140);
    C6.bus.emit('carlFliegt', { raum: C6.jetzt, wohin: 'runter' });
  } catch (e) { fehler('landung', e); }
}
function richtungZu(alt, g, hAlt, hNeu, sofort) {
  if (sofort || !alt || hAlt !== hNeu || C6.ruhig) return null;
  var r = C6.faden && C6.faden.richtung && C6.faden.richtung();
  if (r) return r === 'hoch' ? 'links' : 'rechts';
  try {
    var a = C6.faden.tiefe(alt.id), n = C6.faden.tiefe(g.id);
    if (n > a) return 'rechts';
    if (n < a) return 'links';
  } catch (e) {}
  return null;
}
function zurueckZiel() {
  for (var i = verlauf.length - 1; i >= 0; i--) { var x = verlauf[i]; if (x && x !== C6.jetzt && raeume[x] && x !== 'rundgang') return x; }
  return raeume.zuhause ? 'zuhause' : reihenfolge()[0];
}
C6.benenne = function (id, name) {
  var d = raeume[id]; if (!d || !name) return;
  d.name = String(name);
  if (gebaut[id]) gebaut[id].el.setAttribute('aria-label', d.name);
  if (leisteKnopf[id]) { var n = leisteKnopf[id].querySelector('.c6k-raumname'); if (n) n.textContent = d.name; }
  if (C6.jetzt === id) chrome();
  C6.bus.emit('benannt', id);
};
/* Licht eines Raums zur Laufzeit (z. B. ein Space bei Nacht): Kopf, Regler, Leiste in Nacht- oder Tagtönen */
C6.licht = function (id, licht) {
  var d = raeume[id]; if (!d) return;
  d.licht = licht === 'nacht' ? 'nacht' : 'tag';
  if (C6.jetzt === id) chrome();
  try { if (C6.lichtquelle && C6.lichtquelle.neu) C6.lichtquelle.neu(id); } catch (e) {}
};
C6.zurueck = function () {
  var id = verlauf.pop();
  while (id && (id === C6.jetzt || !raeume[id])) id = verlauf.pop();
  if (!id) id = raeume.zuhause ? 'zuhause' : reihenfolge()[0];
  if (id && id !== C6.jetzt) C6.geh(id, { zurueck: true });
};

C6.hoehe = function (h) {
  if (HOEHEN.indexOf(h) < 0) return;
  var id;
  if (h === 'boden') id = letzterJe.reihe || (raeume.zuhause ? 'zuhause' : reihenfolge()[0]);
  else {
    id = letzterJe[h];
    if (!id) { var k = Object.keys(raeume).filter(function (x) { return hoeheVon(raeume[x]) === h; }); id = k[0]; }
  }
  if (id) C6.geh(id);
};
Object.defineProperty(C6, 'hoeheJetzt', { get: function () { return C6.jetzt ? hoeheVon(raeume[C6.jetzt]) : 'boden'; } });

/* ---------- Leiste, Kopf, Regler ---------- */
function baueLeiste() {
  var ord = reihenfolge();
  Object.keys(leisteKnopf).forEach(function (id) { if (ord.indexOf(id) < 0) { leisteKnopf[id].remove(); delete leisteKnopf[id]; } });
  ord.forEach(function (id) {
    var d = raeume[id], b = leisteKnopf[id];
    if (!b) {
      b = mach('button', 'c6k-raumknopf', null);
      b.type = 'button';
      b.setAttribute('data-raum', id);
      var sy = mach('span', 'c6k-symbol', b);
      sy.setAttribute('aria-hidden', 'true');
      sy.innerHTML = d.symbol || '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"/></svg>';
      mach('span', 'c6k-raumname', b, d.name || id);
      b.addEventListener('click', function () { if (!schluck()) C6.geh(id); });
      leisteKnopf[id] = b;
    }
    leisteSpur.appendChild(b);
  });
  leisteSpur.appendChild(faden);
  wurzel.toggleAttribute('data-ohne-leiste', ord.length < 2);
}
function setzeFaden() {
  var b = leisteKnopf[C6.jetzt];
  if (!b || C6.hoeheJetzt !== 'boden') { faden.style.opacity = '0'; return; }
  faden.style.opacity = '1';
  var w = Math.max(16, b.offsetWidth - 28);
  faden.style.transform = 'translateX(' + (b.offsetLeft + (b.offsetWidth - w) / 2) + 'px) scaleX(' + w + ')';
  var l = b.offsetLeft - (leiste.clientWidth - b.offsetWidth) / 2;
  if (leiste.scrollWidth > leiste.clientWidth + 2) {
    try { leiste.scrollTo({ left: Math.max(0, l), behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) { leiste.scrollLeft = l; }
  }
}
function chrome() {
  var d = raeume[C6.jetzt] || {};
  if (entwurfId() !== feldEntwurf) wechsleEntwurf(entwurfId(), true);
  var h = hoeheVon(d);
  Object.keys(leisteKnopf).forEach(function (id) {
    if (id === C6.jetzt) { if (!leisteKnopf[id].hasAttribute('aria-current')) druck(leisteKnopf[id]); leisteKnopf[id].setAttribute('aria-current', 'page'); }
    else leisteKnopf[id].removeAttribute('aria-current');
  });
  setzeFaden();
  var name = d.name || '';
  var mitZurueck = !!d.zurueckKnopf && !inReihe(d);
  zurueckEl.hidden = !mitZurueck;
  wurzel.toggleAttribute('data-zurueck', mitZurueck);
  if (mitZurueck) {
    var zi = zurueckZiel(), zn = (raeume[zi] && raeume[zi].name) || 'Zurück';
    zurueckEl.lastChild.textContent = zn;
    zurueckEl.setAttribute('aria-label', 'Zurück: ' + zn);
  }
  if (ortEl.textContent !== name) {
    ortEl.classList.remove('c6k-neu'); void ortEl.offsetWidth;
    ortEl.textContent = name;
    ortEl.classList.add('c6k-neu');
  }
  HOEHEN.forEach(function (x) {
    var b = reglerKnopf[x];
    // Name des Punkts: der Raum dieser Höhe sagt, wie sie heißt (z. B. Vogelflug = „Himmel“)
    if (x !== 'boden') {
      var rid = letzterJe[x] && raeume[letzterJe[x]] ? letzterJe[x] : Object.keys(raeume).filter(function (k) { return hoeheVon(raeume[k]) === x; })[0];
      var hn = (rid && raeume[rid].name) || HOEHE_NAME[x], pn = b.querySelector('.c6k-punkt-name');
      if (pn && pn.textContent !== hn) { pn.textContent = hn; b.setAttribute('aria-label', hn); }
    }
    var hat = Object.keys(raeume).some(function (k) { return hoeheVon(raeume[k]) === x; });
    b.hidden = !hat;
    if (x === h) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
  });
  var hoehenDa = HOEHEN.filter(function (x) { return !reglerKnopf[x].hidden; }).length;
  var imRundgang = !!(C6.rundgang && C6.rundgang.an) || (!inReihe(d) && hoeheVon(d) === 'boden' && d.leiste === false);
  wurzel.toggleAttribute('data-ohne-regler', hoehenDa < 2 || d.regler === false || imRundgang);
  wurzel.toggleAttribute('data-rundgang', imRundgang);
  wurzel.setAttribute('data-licht', d.licht === 'nacht' || (h === 'teleskop' && d.licht !== 'tag') ? 'nacht' : 'tag');
  wurzel.toggleAttribute('data-ohne-leiste-raum', d.leiste === false);
  wurzel.toggleAttribute('data-ohne-kopf', d.kopf === false);
  var dockAn = h === 'boden' && d.dock !== false;
  var frei = frage && frage.frei && frage.raum === C6.jetzt;
  wurzel.toggleAttribute('data-ohne-dock', !(dockAn || frei));
  if (wurzel.hasAttribute('data-ohne-dock') && vlOffen) C6.verlauf.zu();
  wurzel.toggleAttribute('data-chips', !!(frage && frage.raum === C6.jetzt));
  platzhalter();
  messeUnten();
}

/* Höhenregler: auch senkrecht ziehen */
var reglerZug = null;
regler.addEventListener('pointerdown', function (e) { reglerZug = { y: e.clientY, bewegt: false, id: e.pointerId }; });
W.addEventListener('pointermove', function (e) {
  if (!reglerZug || e.pointerId !== reglerZug.id) return;
  if (Math.abs(e.clientY - reglerZug.y) > 12) reglerZug.bewegt = true;
  if (!reglerZug.bewegt) return;
  var best = null, bd = 1e9;
  HOEHEN.forEach(function (h) {
    var b = reglerKnopf[h]; if (b.hidden) return;
    var r = b.getBoundingClientRect(), dd = Math.abs(r.top + r.height / 2 - e.clientY);
    if (dd < bd) { bd = dd; best = h; }
  });
  if (best && best !== C6.hoeheJetzt) C6.hoehe(best);
});
W.addEventListener('pointerup', function () { if (reglerZug) spaeter(function () { reglerZug = null; }, 0); });
W.addEventListener('pointercancel', function () { reglerZug = null; });

/* Alt + Mausrad: Höhe; waagerechtes Wischen am Trackpad: Nachbarraum */
var radRuhe = 0, radX = 0, radXUhr = null;
W.addEventListener('wheel', function (e) {
  var jetzt = Date.now();
  if (e.altKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    if (jetzt < radRuhe) return;
    radRuhe = jetzt + 650;
    var i = HOEHEN.indexOf(C6.hoeheJetzt) + (e.deltaY < 0 ? 1 : -1);
    while (i >= 0 && i < HOEHEN.length && reglerKnopf[HOEHEN[i]].hidden) i += (e.deltaY < 0 ? 1 : -1);
    if (i >= 0 && i < HOEHEN.length) C6.hoehe(HOEHEN[i]);
    return;
  }
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5 && C6.hoeheJetzt === 'boden' && !waagerechtScrollbar(e.target)) {
    if (jetzt < radRuhe) return;
    radX += e.deltaX;
    clearTimeout(radXUhr); radXUhr = setTimeout(function () { radX = 0; }, 180);
    if (Math.abs(radX) > 90) { radRuhe = jetzt + 700; var r = radX; radX = 0; nachbar(r > 0 ? 1 : -1); }
  }
}, { passive: false });

function nachbar(dir) {
  var ord = reihenfolge(), i = ord.indexOf(C6.jetzt);
  if (i < 0) return;
  var z = ord[i + dir];
  if (z) C6.geh(z, { von: 'wisch' });
}

/* ---------- Wischen von Raum zu Raum ---------- */
var zug = null, schluckBis = 0;
function schluck() { return Date.now() < schluckBis; }
wurzel.addEventListener('click', function (e) {
  if (schluck() && reihe.contains(e.target)) { e.stopPropagation(); e.preventDefault(); }
}, true);

/* Was unter dem Finger liegt: null = frei, true = gesperrt, Element = waagerechter Scroller.
   Wischen hat EINE Bedeutung (Raumwechsel): Carl selbst sperrt nie (Kitzeln ist senkrecht),
   `data-c6-kein-wisch` sperrt (Kartenreihen, Leinwände), `data-c6-kein-wisch="senkrecht"` sperrt nur senkrecht. */
function istCarl(el) {
  var c = carls[C6.jetzt];
  return !!(c && c.el && el && (c.el === el || c.el.contains(el)));
}
function wischHindernis(el) {
  var ueberCarl = istCarl(el);
  while (el && el !== wurzel && el.nodeType === 1) {
    if (el.hasAttribute && el.isContentEditable) return true;
    if (el.hasAttribute && el.hasAttribute('data-c6-kein-wisch')) {
      var v = el.getAttribute('data-c6-kein-wisch');
      if (!ueberCarl && v !== 'senkrecht') return true;
    }
    var t = el.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || t === 'CANVAS') return true;
    if (el.scrollWidth > el.clientWidth + 2) {
      var ox = getComputedStyle(el).overflowX;
      if (ox === 'auto' || ox === 'scroll') return el;
    }
    if (el.classList && el.classList.contains('c6-buehne')) return null;
    el = el.parentNode;
  }
  return null;
}
function waagerechtScrollbar(el) { return !!wischHindernis(el); }

function finger(e) { var t = e.changedTouches && e.changedTouches[0]; return t || null; }
/* capture an der Wurzel: auch wenn ein Raum stopPropagation ruft, sieht der Kern den Anfang */
wurzel.addEventListener('touchstart', function (e) {
  if (zug || e.touches.length !== 1) { if (zug && zug.achse === 'x') zugEnde(true); else zug = null; return; }
  var g = gebaut[C6.jetzt];
  if (!g || !inReihe(g.def) || C6.hoeheJetzt !== 'boden') return;
  if (!reihe.contains(e.target)) return;
  if (W.getSelection && String(W.getSelection()).length) return;
  var hin = wischHindernis(e.target);
  if (hin === true) return;
  var t = finger(e), ord = reihenfolge();
  zug = { x0: t.clientX, y0: t.clientY, id: t.identifier, achse: null, idx: ord.indexOf(C6.jetzt), ord: ord, spur: [[e.timeStamp, t.clientX]], basis: reiheX, scroller: hin };
}, { passive: true, capture: true });

function zugBeginnt() {
  var ord = zug.ord, i = zug.idx, B = breite();
  ++gleitNr;
  Object.keys(gebaut).forEach(function (k) { if (gebaut[k].leihe) gebaut[k].leihe = false; });
  setzeLinks();
  zug.basis = -i * B;
  [ord[i - 1], ord[i + 1]].forEach(function (id) { if (id) { var n = baue(id); sicht(n, true); } });
  reihe.classList.add('c6k-zieht');
  wurzel.classList.add('c6k-wischt');
}
W.addEventListener('touchmove', function (e) {
  if (!zug) return;
  var t = null;
  for (var k = 0; k < e.changedTouches.length; k++) if (e.changedTouches[k].identifier === zug.id) t = e.changedTouches[k];
  if (!t) return;
  var dx = t.clientX - zug.x0, dy = t.clientY - zug.y0;
  if (!zug.achse) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (Math.abs(dx) > Math.abs(dy) * 1.15) {
      // ein waagerechter Scroller darf erst am Rand an den Raum weitergeben
      var sc = zug.scroller;
      if (sc) {
        var amAnfang = sc.scrollLeft <= 1, amEnde = sc.scrollLeft >= sc.scrollWidth - sc.clientWidth - 1;
        if (!((dx > 0 && amAnfang) || (dx < 0 && amEnde))) { zug = null; return; }
      }
      zug.achse = 'x'; zugBeginnt();
    }
    else { zug = null; return; }
  }
  if (e.cancelable) e.preventDefault();
  var B = breite(), n = zug.ord.length;
  if ((zug.idx === 0 && dx > 0) || (zug.idx === n - 1 && dx < 0)) dx = dx * 0.28;
  dx = klemme(dx, -B, B);
  zug.dx = dx;
  zug.spur.push([e.timeStamp, t.clientX]);
  if (zug.spur.length > 6) zug.spur.shift();
  setzeReihe(zug.basis + dx, 0);
  var sp = zug.spur, s0 = sp[Math.max(0, sp.length - 3)], s1 = sp[sp.length - 1];
  if (s1[0] > s0[0]) fahrtZiel((s1[1] - s0[1]) / (s1[0] - s0[0]) * 1000);
}, { passive: false, capture: true });

function zugEnde(abbruch) {
  if (!zug) return;
  var z = zug; zug = null;
  if (z.achse !== 'x') return;
  wurzel.classList.remove('c6k-wischt');
  reihe.classList.remove('c6k-zieht');
  schluckBis = Date.now() + 350;
  var B = breite(), dx = z.dx || 0, v = 0, s = z.spur;
  if (s.length > 1) { var a = s[0], b = s[s.length - 1]; v = (b[1] - a[1]) / Math.max(1, b[0] - a[0]); }
  var dir = 0;
  if (!abbruch) {
    if (dx < -B * 0.18 || (v < -0.3 && dx < -20)) dir = 1;
    else if (dx > B * 0.18 || (v > 0.3 && dx > 20)) dir = -1;
  }
  var ziel = z.ord[z.idx + dir];
  if (dir && ziel) { C6.geh(ziel, { von: 'wisch' }); return; }
  fahrtZiel(0);
  var ms = Math.round(klemme(Math.abs(dx) / B * GLEIT * 1.4, 160, 340));
  setzeReihe(z.basis, ms);
  aufraeumen(++gleitNr, ms + 40);
}
W.addEventListener('touchend', function (e) {
  if (!zug) return;
  for (var k = 0; k < e.changedTouches.length; k++) if (e.changedTouches[k].identifier === zug.id) return zugEnde(false);
}, { passive: true, capture: true });
W.addEventListener('touchcancel', function () { if (zug) zugEnde(true); }, { passive: true, capture: true });

/* ---------- Carl im Raum ---------- */
var mitKlick = typeof WeakSet === 'function' ? new WeakSet() : null;
C6.setzeCarl = function (ctl, raumId) {
  var r = raumId || C6.jetzt;
  if (!r) return;
  carls[r] = ctl || null;
  var el = ctl && ctl.el;
  if (el && mitKlick && !mitKlick.has(el)) {
    mitKlick.add(el);
    el.addEventListener('click', function () {
      if (carls[C6.jetzt] && carls[C6.jetzt].el === el && !wurzel.hasAttribute('data-ohne-dock')) C6.eingabe.fokus();
    });
  }
  if (r === C6.jetzt && blaseAn) folge(true);
};
Object.defineProperty(C6, 'carl', {
  get: function () { return carls[C6.jetzt] || null; },
  set: function (c) { if (C6.jetzt) carls[C6.jetzt] = c; }
});

/* ---------- Sprechblase ---------- */
var blaseRahmen = mach('div', 'c6k-blase-rahmen');
blaseRahmen.setAttribute('aria-live', 'polite');
var blase = mach('div', 'c6k-blase', blaseRahmen);
var blaseText = mach('p', 'c6k-blase-text', blase);
var blaseNotiz = mach('p', 'c6k-blase-notiz', blase);
/* lange Antworten: die Blase bleibt handlich, „Ganz lesen“ öffnet das Gespräch an dieser Stelle */
var blaseMehr = mach('button', 'c6k-blase-mehr', blase, 'Ganz lesen');
blaseMehr.type = 'button';
blaseMehr.hidden = true;
blaseMehr.addEventListener('click', function () { C6.verlauf.auf({ zu: blaseMehr._ts || null }); });
function blaseLang(ts) {
  // nach dem letzten Wort: ist der Text abgeschnitten, kommt „Ganz lesen“
  var lang = blaseText.scrollHeight > blaseText.clientHeight + 6;
  blaseMehr._ts = ts || null;
  if (lang === !blaseMehr.hidden && !lang) { blase.classList.remove('c6k-lang'); return; }
  form(function () {
    blaseMehr.hidden = !lang;
    blase.classList.toggle('c6k-lang', lang);
    blaseText.classList.remove('c6k-rollt');
    blaseText.scrollTop = 0;
  }, lang);
}
function blaseRoll() {
  // beim Schreiben: die neuesten Zeilen bleiben sichtbar
  if (blaseText.scrollHeight > blaseText.clientHeight + 6) {
    blaseText.classList.add('c6k-rollt');
    try { blaseText.scrollTo({ top: blaseText.scrollHeight, behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) { blaseText.scrollTop = blaseText.scrollHeight; }
  }
}
var zipfel = mach('span', 'c6k-zipfel', blaseRahmen);
zipfel.innerHTML = '<svg viewBox="0 0 22 14" aria-hidden="true"><path class="c6k-zs" d="M5 3 L12 13 L18 3 Z"/><path class="c6k-zf" d="M2 0 L9 11 L16 0"/></svg>';
var blaseAn = false, sagNr = 0, folgeUhr = null, folgeRuhig = 0, folgeLetzt = '';

function blasePlatz() {
  var b = gebaut[C6.jetzt];
  return b ? b.el : null;
}
function projAuf() { return D.documentElement.classList.contains('c6z-proj-auf'); }
function maxBreite(bw) {
  if (projAuf() && C6.geraet !== 'computer') return Math.round(Math.min(220, bw - 32));
  // iPhone: rechts bleibt die Spalte für Regler und Nadel (≈ 60 px) frei, wenn die Blase ganz links steht
  return Math.round(Math.min(C6.geraet === 'computer' ? 420 : 316, bw - 32));
}
function blaseHer() {
  var platz = blasePlatz();
  if (!platz) return false;
  if (blaseRahmen.parentNode !== sprech) sprech.appendChild(blaseRahmen);
  if (blaseRahmen._raum !== C6.jetzt) { blaseRahmen._raum = C6.jetzt; blaseRahmen.removeAttribute('data-an'); blaseAn = false; }
  return true;
}
function zeigBlase() {
  if (!blaseHer()) return false;
  if (!blaseAn) {
    blaseAn = true;
    blase._frisch = true;
    blaseRahmen.classList.add('c6k-kommt');
    void blaseRahmen.offsetWidth;
    blaseRahmen.setAttribute('data-an', '');
    spaeter(function () { blaseRahmen.classList.remove('c6k-kommt'); }, 30);
  }
  return true;
}
function blaseWeg() {
  sagNr++;
  blaseAn = false;
  blaseRahmen.removeAttribute('data-an');
  stopFolge();
}
C6.schweig = function () { blaseWeg(); schliesseFrage(null); };

/* Inhalt setzen und Größe weich nachziehen; die Textbreite steht vorher fest */
function form(aendern, festeBreite) {
  var platz = blasePlatz();
  if (!platz) return;
  var bw = platz.clientWidth || breite();
  var M = maxBreite(bw);
  var war = blaseAn && !blase._frisch && blaseRahmen.hasAttribute('data-an') && blase.offsetWidth > 0;
  blase._frisch = false;
  var w0 = blase.offsetWidth, h0 = blase.offsetHeight;
  blase.style.transition = 'none';
  blase.style.width = '';
  blase.style.height = '';
  blaseText.style.width = '';
  blase.style.maxWidth = M + 'px';
  aendern();
  if (festeBreite) blase.style.width = M + 'px';
  var w1 = Math.ceil(blase.getBoundingClientRect().width);
  var innen = w1 - 36;
  blaseText.style.width = innen + 'px';
  blaseNotiz.style.width = innen + 'px';
  blase.style.width = w1 + 'px';
  var h1 = Math.ceil(blase.getBoundingClientRect().height);
  if (war && !C6.ruhig && (Math.abs(w1 - w0) > 1 || Math.abs(h1 - h0) > 1)) {
    blase.style.width = w0 + 'px';
    blase.style.height = h0 + 'px';
    void blase.offsetWidth;
    blase.style.transition = '';
    blase.style.width = w1 + 'px';
    blase.style.height = h1 + 'px';
  } else {
    blase.style.height = h1 + 'px';
    void blase.offsetWidth;
    blase.style.transition = '';
  }
  blase._w = w1; blase._h = h1;
  lege(true);
}

/* Hindernisse im Raum: alles, was Wort oder Knopf ist (auch SVG-Text, Schilder), dazu Regler und Nadel.
   Gemessen relativ zu #c6, kurz gepuffert, damit die Blase im Takt folgen kann. */
var hindernisUhr = 0, hindernisListe = [], hindernisRaum = null;
var HINDERNIS_DINGE = '[data-c6-bild], [data-c6-regal], [data-c6-sonne], [data-c6-schild], .c6z-sp-schild, .c6z-lw, .c6w-stange, .c6z-leinwand';
function hindernisse(pr) {
  var jetzt = Date.now();
  if (hindernisRaum === C6.jetzt && jetzt < hindernisUhr) return hindernisListe;
  hindernisRaum = C6.jetzt; hindernisUhr = jetzt + 450;
  var platz = blasePlatz(), aus = [], c = C6.carl, cel = c && c.el;
  function nimm(el, gewicht) {
    if (!el || el === blaseRahmen || blaseRahmen.contains(el) || (cel && (el === cel || cel.contains(el)))) return;
    var r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    if (r.right <= pr.left || r.left >= pr.right || r.bottom <= pr.top || r.top >= pr.bottom) return;
    aus.push([r.left - pr.left, r.top - pr.top, r.right - pr.left, r.bottom - pr.top, gewicht || 1]);
  }
  try {
    if (platz) {
      var alle = platz.querySelectorAll('text, button, [role=button], a, input, textarea, img, h1, h2, h3, h4, p, li, label, figcaption, span, b, strong, em, i'), n = 0;
      for (var k = 0; k < alle.length && n < 400; k++) {
        var el = alle[k];
        if (el.tagName === 'text' || el.matches('button,[role=button],a,input,textarea,img')) {
          // eine Fläche mit eigenem Schild (Tür, Fenster, Buch) zählt nicht selbst, nur ihr Schild/Wort
          if (el.matches('button,[role=button],a') && el.querySelector('text, span, p, b, strong, em, i, label, h1, h2, h3, h4') && (el.textContent || '').trim()) { continue; }
          // ein Bild ohne Wort (Knopf mit Zeichnung) wiegt weniger als ein Wort oder Schild
          nimm(el, el.tagName === 'IMG' && !el.getAttribute('alt') ? 0.6 : 1); n++; continue;
        }
        // nur Elemente mit eigenem Text (keine reinen Hüllen)
        var hatText = false;
        for (var ch = el.firstChild; ch; ch = ch.nextSibling) if (ch.nodeType === 3 && ch.nodeValue.trim()) { hatText = true; break; }
        if (hatText) { var cs = getComputedStyle(el); if (cs.visibility !== 'hidden' && cs.opacity !== '0') { nimm(el); n++; } }
      }
    }
    // gezeichnete Dinge, die frei bleiben: Schilder, Regal, Bilder mit Rahmen, Leinwand, Sonne, Stange
    if (platz) {
      var dinge = platz.querySelectorAll(HINDERNIS_DINGE);
      for (var dk = 0; dk < dinge.length && dk < 60; dk++) {
        var dg = dinge[dk];
        if (dg.closest('.c6m-schatten,[data-c6-schatten]')) continue;
        var dcs = getComputedStyle(dg);
        if (dcs.display === 'none' || dcs.visibility === 'hidden' || +dcs.opacity < 0.05) continue;
        nimm(dg, 1);
      }
    }
    if (!wurzel.hasAttribute('data-ohne-regler')) nimm(regler);
    var nadel = D.getElementById('c6p-knopf'); if (nadel && nadel.offsetWidth) nimm(nadel);
    if (!wurzel.hasAttribute('data-ohne-kopf')) { nimm(kopf); var fd = kopf.querySelectorAll('.c6k-fd-hoch, .c6k-fd-punkt, .c6k-fd-hier, .c6k-zurueck'); for (var fk = 0; fk < fd.length; fk++) if (fd[fk].offsetWidth) nimm(fd[fk]); }
  } catch (e) {}
  hindernisListe = aus;
  return aus;
}
/* Überdeckung: Schnittfläche je Hindernis, bezogen auf das Kleinere (ein halb verdecktes Schild wiegt so viel wie eine halb verdeckte Blase) */
function ueberdeckung(x, y, w, h, liste) {
  var s = 0, fb = Math.max(1, w * h);
  for (var i = 0; i < liste.length; i++) {
    var o = liste[i];
    var dx = Math.min(x + w, o[2]) - Math.max(x, o[0]), dy = Math.min(y + h, o[3]) - Math.max(y, o[1]);
    if (dx > 0 && dy > 0) s += (o[4] || 1) * dx * dy / Math.max(1, Math.min(fb, (o[2] - o[0]) * (o[3] - o[1])));
  }
  return s;
}
var lageWahl = null;
/* freie Lagen ohne Zipfel: Raster über die Bühne (unten bevorzugt, dann mittig/links/rechts), die mit der wenigsten Überdeckung gewinnt */
function freieLage(liste, w, h, oben, untenGrenze, bw) {
  var k2 = [];
  var xm = C6.geraet === 'computer' ? Math.round((bw - w) / 2) : 16, xr = Math.max(12, bw - w - 16);
  var yU = Math.max(oben, untenGrenze - h - 14), yT = oben + 8;
  var xs = xm === 16 ? [16, xr] : [xm, 16, xr];
  var stufen = Math.max(1, Math.min(12, Math.round((yU - yT) / 48)));
  for (var si = 0; si <= stufen; si++) {
    var yy = Math.round(yU - (yU - yT) * si / stufen);
    xs.forEach(function (xx, xi) { k2.push({ art: 'frei', x: xx, y: yy, straf: si * 0.012 + xi * 0.02 }); });
  }
  var b2 = null;
  k2.forEach(function (k) {
    k.wert = ueberdeckung(k.x, k.y, w, h, liste) + k.straf;
    if (lageWahl && lageWahl.art === 'frei' && lageWahl.raum === C6.jetzt && Math.abs(lageWahl.x - k.x) < 60 && Math.abs(lageWahl.y - k.y) < 60) k.wert -= 0.08;
    if (!b2 || k.wert < b2.wert) b2 = k;
  });
  return b2;
}

/* Lage an der Figur: Kandidaten oben / unten / links / rechts; der mit der wenigsten Überdeckung gewinnt,
   oben bleibt bevorzugt, und eine gefundene Lage bleibt, solange sie nicht deutlich schlechter ist. */
function lege(sofort) {
  var platz = blasePlatz();
  if (!platz || blaseRahmen.parentNode !== sprech) return;
  var pr = wurzel.getBoundingClientRect();
  var bw = pr.width, bh = pr.height, w = blase._w || blase.offsetWidth, h = blase._h || blase.offsetHeight;
  var c = C6.carl, cr = null;
  try { if (c && c.el && c.el.isConnected && platz.contains(c.el)) cr = c.el.getBoundingClientRect(); } catch (e) { cr = null; }
  // obere Grenze: knapp unter dem Sicherheitsrand; Kopf und Regler sind Hindernisse und werden gemieden, nicht gesperrt
  var oben = 8, links, zx, unterhalb = false, seite = null, y;
  try {
    if (!wurzel.hasAttribute('data-ohne-kopf') && kopf.offsetHeight) {
      var kr = kopf.getBoundingClientRect();
      oben = Math.max(50, Math.round(kr.bottom - pr.top) + 4);
    } else oben = Math.max(oben, 50);
  } catch (e) { oben = 50; }
  var untenGrenze = bh - unteresMass();
  if (cr && cr.width > 0) {
    var top = cr.top - pr.top, bot = cr.bottom - pr.top, cx = cr.left - pr.left + cr.width / 2;
    var cl = cr.left - pr.left, crr = cr.right - pr.left;
    var liste = hindernisse(pr);
    var kand = [];
    // oben (Zipfel zur Kuppe), auch nach links/rechts gerückt
    var yO = top - h - 14;
    if (yO >= oben) {
      [0, -1, 1].forEach(function (s) {
        var x = klemme(cx - w / 2 + s * w * 0.3, 12, Math.max(12, bw - w - 12));
        kand.push({ art: 'oben', x: x, y: yO, straf: s ? 0.06 : 0 });
      });
      // etwas höher über dem Kopf, falls direkt darüber ein Schild hängt (auch nach links/rechts gerückt)
      [40, 90].forEach(function (hoch, hi) {
        if (yO - hoch < oben) return;
        [0, -1, 1].forEach(function (s) {
          var x = klemme(cx - w / 2 + s * w * 0.3, 12, Math.max(12, bw - w - 12));
          kand.push({ art: 'oben', x: x, y: yO - hoch, straf: 0.05 + hi * 0.03 + (s ? 0.04 : 0) });
        });
      });
    }
    // seitlich auf Kopfhöhe
    var yS = klemme(top + 8, oben, Math.max(oben, untenGrenze - h - 8));
    var leinwand = projAuf() && C6.geraet !== 'computer';
    if (leinwand) kand.forEach(function (k) { k.straf += 0.35; }); // über dem kleinen Carl liegt die Leinwand: lieber daneben
    if (projAuf()) {
      // die Leinwand bleibt frei: seitliche Lagen beginnen unter ihrer Unterkante, wenn das noch über das Dock passt
      try {
        var lw = platz.querySelector('.c6z-lw'), lr = lw && lw.getBoundingClientRect();
        if (lr && lr.width > 0 && lr.bottom - pr.top + 4 + h <= untenGrenze - 2) yS = Math.max(yS, lr.bottom - pr.top + 4);
      } catch (e) {}
    }
    if (crr + 14 + w <= bw - 12) kand.push({ art: 'rechts', x: crr + 14, y: yS, straf: leinwand ? -0.02 : 0.12 });
    if (cl - 14 - w >= 12) kand.push({ art: 'links', x: cl - 14 - w, y: yS, straf: 0.12 });
    // unten
    if (bot + 4 + h <= untenGrenze - 8) kand.push({ art: 'unten', x: klemme(cx - w / 2, 12, Math.max(12, bw - w - 12)), y: bot + 4, straf: 0.1 });
    if (!kand.length) kand.push({ art: 'oben', x: klemme(cx - w / 2, 12, Math.max(12, bw - w - 12)), y: Math.max(oben, yO), straf: 0 });
    var best = null;
    kand.forEach(function (k) {
      k.wert = ueberdeckung(k.x, k.y, w, h, liste) + k.straf;
      if (lageWahl && lageWahl.art === k.art && lageWahl.raum === C6.jetzt && Math.abs(lageWahl.x - k.x) < 60 && Math.abs(lageWahl.y - k.y) < 60) k.wert -= 0.08;
      if (!best || k.wert < best.wert) best = k;
    });
    if (best.wert - best.straf > 0.12) {
      // an der Figur bleibt nur Überdeckung: frei im Raum stehen (ohne Zipfel), wenn das deutlich besser ist
      var fr = freieLage(liste.concat([[cl, top, crr, top + cr.height * 0.62]]), w, h, oben, untenGrenze, bw);
      if (fr && fr.wert + 0.1 < best.wert) best = fr;
    }
    if (springt(best.x, best.y)) return false;
    lageWahl = { art: best.art, x: best.x, y: best.y, raum: C6.jetzt };
    links = best.x; y = best.y; seite = best.art;
    unterhalb = seite === 'unten';
    if (seite === 'oben') zx = klemme(cx - links, 20, w - 20);
    else if (seite === 'unten') zx = klemme(cx - links, 20, w - 20);
    else zx = -1;
    if (seite === 'oben') {
      blaseRahmen.style.top = '';
      blaseRahmen.style.bottom = Math.round(bh - y - h) + 'px';
    } else {
      blaseRahmen.style.bottom = '';
      blaseRahmen.style.top = Math.round(y) + 'px';
    }
  } else {
    // ohne Figur im Raum: freie Lage, die mit der wenigsten Überdeckung gewinnt (unten bevorzugt)
    var b2 = freieLage(hindernisse(pr), w, h, oben, untenGrenze, bw);
    if (springt(b2.x, b2.y)) return false;
    lageWahl = { art: 'frei', x: b2.x, y: b2.y, raum: C6.jetzt };
    links = b2.x;
    zx = -1;
    blaseRahmen.style.bottom = '';
    blaseRahmen.style.top = Math.round(b2.y) + 'px';
  }
  var key = Math.round(links) + '|' + blaseRahmen.style.bottom + '|' + blaseRahmen.style.top + '|' + Math.round(zx) + '|' + seite;
  if (key === folgeLetzt) return false;
  folgeLetzt = key;
  blaseRahmen.style.left = Math.round(links) + 'px';
  blaseRahmen.classList.toggle('c6k-unterhalb', unterhalb);
  blaseRahmen.setAttribute('data-seite', seite || 'frei');
  zipfel.style.display = zx < 0 ? 'none' : '';
  zipfel.style.left = Math.round(zx - 11) + 'px';
  blaseRahmen.style.setProperty('--zx', Math.round(zx) + 'px');
  return true;
}
/* Eine Blase springt nicht quer über den Bildschirm: Was gesagt ist und gelesen werden konnte,
   geht leise, wenn sein Platz plötzlich belegt wird (z. B. ein Blatt öffnet sich darüber). */
function springt(x, y) {
  if (!blaseAn || !blase._seit || !lageWahl || lageWahl.raum !== C6.jetzt) return false;
  if (Date.now() - blase._seit < 1200) return false;
  if (Math.abs(lageWahl.x - x) + Math.abs(lageWahl.y - y) < 140) return false;
  blaseWeg();
  return true;
}
/* Steht derselbe Satz schon sichtbar im Raum (z. B. im Gespräch eines Space), geht die Blase leise:
   eine Antwort hat nur eine sichtbare Stelle. */
function norm(t) { return String(t || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
function doppeltPruefen(text, nr) {
  var kern_ = norm(text).slice(0, 60);
  if (kern_.length < 12) return;
  var mal = 0;
  (function schau() {
    if (nr !== sagNr || !blaseAn) return;
    var platz = blasePlatz();
    var da = false;
    try { da = !!platz && norm(platz.innerText).indexOf(kern_) >= 0; } catch (e) { da = false; }
    if (da) { blaseWeg(); C6.bus.emit('blase', { weg: 'doppelt' }); return; }
    if (++mal < 12) setTimeout(schau, 300);
  })();
}
function unteresMass() {
  if (!unten.offsetHeight) return 0;
  var r = unten.getBoundingClientRect();
  var wr = wurzel.getBoundingClientRect();
  // die Chips liegen als eigene Zeile über dem Dock (absolut, also nicht im Maß von .c6k-unten): offen zählen sie mit
  var chipsH = wurzel.hasAttribute('data-chips') ? (chipsEl.offsetHeight || 64) : (wzOffen ? (wzReihe.offsetHeight || 64) : 0);
  return Math.max(0, wr.bottom - r.top + chipsH);
}
/* Die Blase folgt der Figur: im Takt, solange sich etwas bewegt, sonst leise nachsehen */
function folge(an) {
  stopFolge();
  if (!blaseAn) return;
  folgeRuhig = Date.now() + 1800;
  var schritt = function () {
    folgeUhr = null;
    if (!blaseAn) return;
    if (D.visibilityState === 'hidden') { folgeUhr = { t: setTimeout(schritt, 600) }; return; }
    var bewegt = lege(false);
    if (bewegt) folgeRuhig = Date.now() + 1200;
    if (Date.now() < folgeRuhig) folgeUhr = { r: requestAnimationFrame(schritt) };
    else folgeUhr = { t: setTimeout(schritt, 280) };
  };
  folgeUhr = { r: requestAnimationFrame(schritt) };
}
function stopFolge() {
  if (!folgeUhr) return;
  if (folgeUhr.r) cancelAnimationFrame(folgeUhr.r);
  if (folgeUhr.t) clearTimeout(folgeUhr.t);
  folgeUhr = null;
}

function worte(text) { return String(text).split(/(\s+)/).filter(function (x) { return x.length; }); }
function setzeWorte(teile, ziel, start) {
  var neu = [];
  teile.forEach(function (t) {
    if (/^\s+$/.test(t)) ziel.appendChild(D.createTextNode(' '));
    else { var s = mach('span', 'c6k-wort', ziel, t); neu.push(s); }
  });
  return neu;
}
function enthuelle(spans, schritt, nr) {
  if (C6.ruhig) { spans.forEach(function (s) { s.classList.add('c6k-da'); }); return 160; }
  spans.forEach(function (s, i) {
    s.style.transitionDelay = (i * schritt) + 'ms';
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { if (nr === sagNr) spans.forEach(function (s) { s.classList.add('c6k-da'); }); });
  });
  return (spans.length - 1) * schritt + 300;
}
var sprichUhr = null;
function sprich(ms, nr) {
  var c = C6.carl;
  if (!c || typeof c.sprich !== 'function') return;
  try { c.sprich(true); } catch (e) {}
  clearTimeout(sprichUhr);
  sprichUhr = setTimeout(function () { try { c.sprich(false); } catch (e) {} }, ms);
}
/* Wo man gerade ist, in Worten (für den Verlauf): der rote Faden ohne „Zuhause“ */
function woJetzt() {
  try {
    if (C6.faden && C6.faden.weg) {
      var w = C6.faden.weg().map(function (x) { return x.name; });
      return (w.length > 1 ? w.slice(1) : w).join(' › ');
    }
  } catch (e) {}
  var d = raeume[C6.jetzt];
  return (d && d.name) || '';
}
function merke(von, t, extra) {
  if (!t) return null;
  try {
    if (!Array.isArray(C6.S.gespraech)) C6.S.gespraech = [];
    var z = { von: von, t: String(t).slice(0, 4000), ts: Date.now(), raum: C6.jetzt, wo: woJetzt() };
    if (extra === true) z.chip = true;
    else if (extra && typeof extra === 'object') Object.keys(extra).forEach(function (k) { if (extra[k] != null && extra[k] !== false) z[k] = extra[k]; });
    var g = C6.S.gespraech, l = g[g.length - 1];
    // dieselbe Zeile nicht doppelt (z. B. ein Raum merkt sich Carls Antwort selbst noch einmal)
    if (l && l.von === z.von && l.t === z.t && z.ts - l.ts < 4000) return l;
    if (z.ts <= ((l && l.ts) || 0)) z.ts = l.ts + 1;
    g.push(z);
    if (g.length > 200) g.splice(0, g.length - 200);
    baldSpeichern();
    C6.bus.emit('gespraech', z);
    return z;
  } catch (e) { return null; }
}
C6.gespraech = function (von, t, extra) { return merke(von === 'carl' ? 'carl' : 'du', t, extra); };

C6.sag = function (text, o) {
  o = o || {};
  text = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
  if (!text) return Promise.resolve();
  if (!blaseHer()) return Promise.resolve();
  var nr = ++sagNr;
  zeigBlase();
  blase.classList.remove('c6k-bleistift');
  blase.classList.remove('c6k-stroemt');
  var spans;
  form(function () {
    blaseText.textContent = '';
    blaseText.scrollTop = 0;
    blaseText.classList.remove('c6k-rollt');
    blaseMehr.hidden = true;
    blase.classList.remove('c6k-lang');
    blaseNotiz.textContent = o.notiz || '';
    blaseNotiz.hidden = !o.notiz;
    spans = setzeWorte(worte(text), blaseText);
  }, false);
  var schritt = klemme(Math.round(1300 / Math.max(1, spans.length)), 38, 85);
  var dauer = enthuelle(spans, schritt, nr);
  folge(true);
  sprich(dauer, nr);
  var z = o.merken !== false ? merke('carl', text) : null;
  blase._seit = 0;
  spaeter(function () { if (nr === sagNr) { blase._seit = Date.now(); doppeltPruefen(text, nr); } }, dauer);
  if (blaseText.scrollHeight > blaseText.clientHeight + 6) spaeter(function () { if (nr === sagNr) blaseLang(z && z.ts); }, Math.min(dauer, 900));
  return new Promise(function (fertig) {
    setTimeout(function () { setTimeout(fertig, Math.max(0, +o.warte || 0)); }, dauer);
  });
};

/* Strom: Worte kommen nach und nach (Antworten im Entstehen) */
function strom(nr) {
  var gezeigt = 0;
  var punkte = null;
  blase._seit = 0;
  zeigBlase();
  blase.classList.add('c6k-stroemt');
  blase.classList.remove('c6k-bleistift');
  form(function () {
    blaseText.textContent = '';
    blaseText.scrollTop = 0;
    blaseText.classList.remove('c6k-rollt');
    blaseMehr.hidden = true;
    blase.classList.remove('c6k-lang');
    blaseNotiz.textContent = '';
    blaseNotiz.hidden = true;
    punkte = mach('span', 'c6k-punkte', blaseText);
    punkte.setAttribute('aria-label', 'Carl denkt');
    punkte.innerHTML = '<i></i><i></i><i></i>';
  }, false);
  folge(true);
  function zeig(text, ende) {
    if (nr !== sagNr) return;
    var teile = worte(text.replace(/^\s+/, ''));
    // nur fertige Worte zeigen, das letzte erst, wenn danach ein Abstand kommt
    var fertig = ende ? teile.length : (/\s$/.test(text) ? teile.length : teile.length - 1);
    if (fertig <= gezeigt) return;
    var neu;
    form(function () {
      if (punkte) { punkte.remove(); punkte = null; }
      neu = setzeWorte(teile.slice(gezeigt, fertig), blaseText);
    }, true);
    gezeigt = fertig;
    sprich(enthuelle(neu, 40, nr) + 200, nr);
    blaseRoll();
    vlLive(teile.slice(0, fertig).join(''));
  }
  return {
    bleistift: function (an) { blase.classList.toggle('c6k-bleistift', !!an); },
    schreib: function (t) { zeig(t, false); },
    ende: function (t, notiz, ts) {
      vlLive(null);
      if (nr !== sagNr) return;
      spaeter(function () { if (nr === sagNr) blase.classList.remove('c6k-stroemt'); }, 400);
      spaeter(function () { if (nr === sagNr) { blase._seit = Date.now(); if (t && !notiz) doppeltPruefen(saeubere(t), nr); } }, C6.ruhig ? 0 : 500);
      if (t && worte(t.replace(/^\s+/, '')).length < gezeigt) {
        // Text kam anders an als gestreamt: ruhig neu setzen
        gezeigt = 0;
        form(function () { blaseText.textContent = ''; }, true);
      }
      if (!t && !gezeigt) {
        // nichts gekommen: die Denkpunkte gehen, die Blase auch (oder die Notiz bleibt allein)
        if (punkte) { var pp = punkte; punkte = null; form(function () { pp.remove(); }, false); }
        if (!notiz) { blaseWeg(); return; }
      }
      zeig(t || '', true);
      if (notiz) form(function () { blaseNotiz.textContent = notiz; blaseNotiz.hidden = false; }, true);
      spaeter(function () { if (nr === sagNr) blaseLang(ts); }, C6.ruhig ? 0 : 420);
    }
  };
}

/* ---------- Fragen mit Antwort-Chips ---------- */
var frage = null;
var HAKEN = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.8l3.6 3.7L15.8 5.6"/></svg>';
function opt(o) {
  if (o && typeof o === 'object') return { text: String(o.text != null ? o.text : (o.t != null ? o.t : o.wert)), wert: o.wert != null ? o.wert : (o.id != null ? o.id : (o.text != null ? o.text : o.t)) };
  return { text: String(o), wert: o };
}
function schliesseFrage(wert) {
  if (!frage) return;
  var f = frage; frage = null;
  wurzel.removeAttribute('data-chips');
  chipsEl.removeAttribute('data-an');
  var spur = chipsSpur;
  spaeter(function () { if (!frage) spur.textContent = ''; }, 380);
  wechsleEntwurf(entwurfId());
  chrome();
  if (blaseAn) { try { lege(true); } catch (e) {} }
  try { f.loese(wert); } catch (e) {}
}
/* Das Feld wechselt seinen Entwurf (Dock ↔ freie Antwort). Wer gerade tippt, verliert dabei nichts:
   Text aus den letzten Sekunden zieht mit in den neuen Entwurf, statt überschrieben zu werden. */
var letzteEingabe = 0, feldEntwurf = 'dock';
function wechsleEntwurf(id, still) {
  var jetzt = feld.value;
  feldEntwurf = id;
  if (!still && jetzt.trim() && Date.now() - letzteEingabe < 4000) {
    try { C6.S.entwurf[id] = jetzt; baldSpeichern(); } catch (e) {}
  } else feld.value = S_entwurf(id);
  groesseFeld();
}
function S_entwurf(id) { var e = C6.S.entwurf || {}; return typeof e[id] === 'string' ? e[id] : ''; }

C6.frag = function (text, optionen, o) {
  o = o || {};
  if (frage) schliesseFrage(null);
  optionen = Array.isArray(optionen) ? optionen.map(opt) : [];
  var raum = C6.jetzt;
  if (text) C6.sag(text);
  return new Promise(function (loese) {
    var f = { raum: raum, loese: loese, frei: !!o.frei, mehr: !!o.mehr, id: o.id || null, platzhalter: o.platzhalter || null, leise: !!o.leise, gewaehlt: [] };
    if (wzOffen) wzAuf(false);
    frage = f;
    chipsSpur.textContent = '';
    chipsEl.setAttribute('aria-label', text ? String(text).slice(0, 80) : 'Antworten');
    optionen.forEach(function (op) {
      var b = mach('button', 'c6k-chip', chipsSpur);
      b.type = 'button';
      var box = mach('span', 'c6k-kreuz', b);
      box.innerHTML = HAKEN;
      mach('span', 'c6k-chip-text', b, op.text);
      if (f.mehr) b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        if (frage !== f || f.zu) return;
        if (f.mehr) {
          var i = f.gewaehlt.indexOf(op);
          if (i >= 0) { f.gewaehlt.splice(i, 1); b.classList.remove('c6k-gewaehlt'); b.setAttribute('aria-pressed', 'false'); }
          else { f.gewaehlt.push(op); b.classList.add('c6k-gewaehlt'); b.setAttribute('aria-pressed', 'true'); }
          if (fertigKnopf) fertigKnopf.disabled = false;
          return;
        }
        f.zu = true;
        b.classList.add('c6k-gewaehlt');
        chipsSpur.classList.add('c6k-entschieden');
        if (!f.leise) merke('du', op.text, true);
        C6.bus.emit('chip', { t: op.text, wert: op.wert, raum: C6.jetzt });
        spaeter(function () { if (frage === f) schliesseFrage(op.wert); }, C6.ruhig ? 200 : 620);
      });
    });
    var fertigKnopf = null;
    if (f.mehr) {
      fertigKnopf = mach('button', 'c6k-chip c6k-fertig', chipsSpur, 'Fertig');
      fertigKnopf.type = 'button';
      fertigKnopf.addEventListener('click', function () {
        if (frage !== f || f.zu) return;
        f.zu = true;
        merke('du', f.gewaehlt.map(function (x) { return x.text; }).join(', '), true);
        var w = f.gewaehlt.map(function (x) { return x.wert; });
        spaeter(function () { if (frage === f) schliesseFrage(w); }, C6.ruhig ? 100 : 260);
      });
    }
    chipsSpur.classList.remove('c6k-entschieden');
    chipsEl.scrollLeft = 0;
    if (f.frei) wechsleEntwurf(f.id ? 'frag:' + f.id : 'frag');
    chrome();
    void chipsEl.offsetWidth;
    chipsEl.setAttribute('data-an', '');
    if (blaseAn) { try { lege(true); } catch (e) {} }
  });
};

/* ---------- Eingabe-Dock ---------- */
function entwurfId() {
  if (frage && frage.frei && frage.raum === C6.jetzt) return frage.id ? 'frag:' + frage.id : 'frag';
  // ein Raum mit eigenem Entwurf (def.entwurf, z. B. die Post) behält seinen Text für sich
  var d = raeume[C6.jetzt];
  return d && typeof d.entwurf === 'string' && d.entwurf ? 'raum:' + d.entwurf : 'dock';
}
function carlName() { var du = C6.S.du || {}; return (du.carlName && String(du.carlName).trim()) || 'Carl'; }
var eigenerPlatzhalter = null;
function platzhalter() {
  var p;
  if (frage && frage.frei && frage.raum === C6.jetzt) p = frage.platzhalter || 'Oder in deinen Worten …';
  else if (raeume[C6.jetzt] && typeof raeume[C6.jetzt].platzhalter === 'string') p = raeume[C6.jetzt].platzhalter; // fester Satz des Raums (def.platzhalter)
  else if (eigenerPlatzhalter) p = eigenerPlatzhalter;
  else {
    var schon = (C6.S.gespraech || []).some(function (g) { return g.von === 'du'; });
    var stimme = null; try { stimme = C6.stimme && C6.stimme.sag && C6.stimme.sag('platzhalter'); } catch (e) { stimme = null; }
    p = schon ? 'Sag ' + carlName() + ' etwas …' : (stimme && typeof stimme === 'string' ? stimme : 'Sag ' + carlName() + ' etwas. Ein Satz reicht.');
  }
  if (feld.placeholder !== p) feld.placeholder = p;
  feld.setAttribute('aria-label', 'Nachricht an ' + carlName());
}
function groesseFeld() {
  feld.style.height = 'auto';
  var h = Math.min(feld.scrollHeight - 20, C6.geraet === 'computer' ? 160 : 120);
  feld.style.height = Math.max(24, h) + 'px';
  wurzel.toggleAttribute('data-feld-voll', !!feld.value.trim());
}
feld.value = S_entwurf('dock');
feld.addEventListener('input', function () {
  letzteEingabe = Date.now();
  try { C6.S.entwurf[entwurfId()] = feld.value; baldSpeichern(); } catch (e) {}
  groesseFeld();
});
feld.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); abschicken(); }
});
dock.addEventListener('submit', function (e) { e.preventDefault(); abschicken(); });

function druck(el) {
  if (C6.ruhig || !el) return;
  el.classList.remove('c6k-druck'); void el.offsetWidth; el.classList.add('c6k-druck');
  spaeter(function () { el.classList.remove('c6k-druck'); }, 600);
}
function abschicken() {
  var t = feld.value.trim();
  if (!t) { feld.focus(); return; }
  druck(senden);
  var id = entwurfId();
  feld.value = '';
  try { C6.S.entwurf[id] = ''; } catch (e) {}
  groesseFeld();
  // das Feld behält den Fokus: wer gleich weiterschreibt, verliert kein Zeichen (wie in jedem Gespräch)
  if (frage && frage.frei && frage.raum === C6.jetzt) {
    merke('du', t);
    schliesseFrage(t);
    return;
  }
  if (frage && frage.leise) schliesseFrage(null);
  if (wzOffen) wzAuf(false);
  // Hörer des Raums zuerst, dann die für überall; der zuletzt angemeldete gewinnt
  var hoerer = eingabeHoerer.filter(function (h) { return h.raum === C6.jetzt; }).concat(eingabeHoerer.filter(function (h) { return !h.raum; }));
  for (var hi = hoerer.length - 1; hi >= 0; hi--) {
    var nimmt = false;
    try { nimmt = hoerer[hi].fn(t) === true; } catch (err) { fehler('eingabe.hoert', err); }
    if (nimmt) { eigenerPlatzhalter = null; platzhalter(); return; }
  }
  merke('du', t);
  eigenerPlatzhalter = null;
  platzhalter();
  C6.bus.emit('gesagt', { t: t, raum: C6.jetzt });
  var g = gebaut[C6.jetzt];
  if (g && g.api && typeof g.api.hoert === 'function') {
    var genommen = false;
    try { genommen = g.api.hoert(t) === true; } catch (err) { fehler('hoert ' + g.id, err); }
    if (genommen) return;
  }
  var od = {};
  C6.denk(t, od).then(function (a) {
    if (a) { merke('carl', a, od._bleistift ? { bleistift: true } : null); C6.bus.emit('antwort', { t: a }); }
  });
}

/* Ein Raum darf das Dock übernehmen: fn(text) -> true heißt „ich habe es genommen“ (vor dem Merken und vor Carls Denken).
   Gilt nur im Raum, in dem es angemeldet wurde (oder {raum:null} für überall); gibt die Abmeldung zurück. */
var eingabeHoerer = [];
C6.eingabe = {
  el: dock,
  feld: feld,
  hoert: function (fn, o) {
    if (typeof fn !== 'function') return function () {};
    var h = { fn: fn, raum: o && 'raum' in o ? o.raum : C6.jetzt };
    // je Raum ein Hörer: ein neuer ersetzt den alten desselben Raums
    eingabeHoerer = eingabeHoerer.filter(function (x) { return x.raum !== h.raum; });
    eingabeHoerer.push(h);
    return function () { eingabeHoerer = eingabeHoerer.filter(function (x) { return x !== h; }); };
  },
  fokus: function () {
    if (wurzel.hasAttribute('data-ohne-dock')) return;
    try { feld.focus({ preventScroll: true }); } catch (e) { feld.focus(); }
  },
  wert: function () { return feld.value; },
  setze: function (t) { feld.value = t == null ? '' : String(t); try { C6.S.entwurf[entwurfId()] = feld.value; baldSpeichern(); } catch (e) {} groesseFeld(); },
  platzhalter: function (t) { eigenerPlatzhalter = t || null; platzhalter(); },
  zeig: function (an) { if (an) wurzel.removeAttribute('data-dock-zu'); else wurzel.setAttribute('data-dock-zu', ''); messeUnten(); }
};

/* ---------- Verlauf: das ganze Gespräch als Briefbogen über dem Dock ---------- */
var vl = mach('section', 'c6k-vl', null);
unten.insertBefore(vl, unten.firstChild);
vl.setAttribute('aria-label', 'Unser Gespräch');
vl.hidden = true;
var vlKopf = mach('header', 'c6k-vl-kopf', vl);
mach('h2', 'c6k-vl-titel', vlKopf, 'Unser Gespräch');
var vlZuKnopf = mach('button', 'c6k-vl-zu', vlKopf);
vlZuKnopf.type = 'button';
vlZuKnopf.setAttribute('aria-label', 'Gespräch schließen');
vlZuKnopf.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>';
var vlListe = mach('ol', 'c6k-vl-liste', vl);
vlListe.tabIndex = 0;
vlListe.setAttribute('aria-label', 'Gesprächsverlauf');
vlListe.setAttribute('data-c6-kein-wisch', '');
var vlOffen = false, vlLetzt = null, vlLiveEl = null, vlUhr = null;

function zeitWort(ts) {
  var d = new Date(ts), h = new Date();
  var uhr = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  var tag = new Date(h.getFullYear(), h.getMonth(), h.getDate()).getTime();
  if (ts >= tag) return uhr;
  if (ts >= tag - 864e5) return 'gestern, ' + uhr;
  return d.getDate() + '.' + (d.getMonth() + 1) + '., ' + uhr;
}
function vlOrt(z) { var d = raeume[z.raum]; return z.wo || (d && d.name) || ''; }
function vlZeile(z) {
  var neuOrt = !vlLetzt || vlOrt(vlLetzt) !== vlOrt(z) || z.ts - vlLetzt.ts > 30 * 60000;
  if (neuOrt) {
    var o = mach('li', 'c6k-vl-ort', vlListe);
    o.setAttribute('aria-hidden', 'false');
    mach('span', null, o, [vlOrt(z), zeitWort(z.ts)].filter(Boolean).join(' · '));
  }
  var li = mach('li', 'c6k-vl-z ' + (z.von === 'du' ? 'c6k-vl-du' : 'c6k-vl-carl'), vlListe);
  li.setAttribute('data-ts', z.ts);
  if (z.werkzeug) mach('span', 'c6k-vl-wz', li, z.werkzeug);
  var p = mach('p', 'c6k-vl-t', li, z.t);
  if (z.chip) p.classList.add('c6k-vl-chip');
  if (z.bleistift) p.classList.add('c6k-vl-bleistift');
  if (z.unterbrochen) mach('span', 'c6k-vl-notiz', li, 'unterbrochen');
  vlLetzt = z;
  return li;
}
function vlBau() {
  vlListe.textContent = '';
  vlLetzt = null; vlLiveEl = null;
  var g = Array.isArray(C6.S.gespraech) ? C6.S.gespraech : [];
  if (!g.length) { mach('li', 'c6k-vl-leer', vlListe, 'Noch ist das Blatt leer. Sag ' + carlName() + ' etwas.'); return; }
  g.forEach(function (z) { if (z && z.t) vlZeile(z); });
}
function vlUnten() { return vlListe.scrollHeight - vlListe.scrollTop - vlListe.clientHeight < 60; }
function vlZiel(zu) {
  var el = null;
  if (zu) el = vlListe.querySelector('[data-ts="' + zu + '"]');
  if (!el) {
    var cs = vlListe.querySelectorAll('.c6k-vl-carl');
    var l = cs[cs.length - 1], alle = vlListe.querySelectorAll('.c6k-vl-z');
    if (l && l === alle[alle.length - 1] && l.offsetHeight > vlListe.clientHeight * 0.6) el = l;
  }
  if (el) vlListe.scrollTop = Math.max(0, el.offsetTop - 12);
  else vlListe.scrollTop = vlListe.scrollHeight;
}
function vlMass() {
  if (!vlOffen) return;
  var obenR = 52;
  try { if (!wurzel.hasAttribute('data-ohne-kopf') && kopf.offsetHeight) obenR = Math.max(52, kopf.getBoundingClientRect().bottom - wurzel.getBoundingClientRect().top + 4); } catch (e) {}
  var ueber = wurzel.hasAttribute('data-chips') ? chipsEl.offsetHeight : (wzOffen ? wzReihe.offsetHeight : 0);
  var h = (wurzel.clientHeight || W.innerHeight) - tast - unten.offsetHeight - ueber - 10 - obenR;
  vl.style.setProperty('--c6k-ueber', ueber + 'px');
  vl.style.maxHeight = Math.max(160, Math.round(C6.geraet === 'computer' ? Math.min(h, 640) : h)) + 'px';
}
function vlLive(t) {
  if (!vlOffen) return;
  if (t == null) { if (vlLiveEl) { vlLiveEl.remove(); vlLiveEl = null; } return; }
  var unten_ = vlUnten();
  if (!vlLiveEl) {
    var leer = vlListe.querySelector('.c6k-vl-leer'); if (leer) leer.remove();
    vlLiveEl = mach('li', 'c6k-vl-z c6k-vl-carl c6k-vl-live', vlListe);
    mach('p', 'c6k-vl-t', vlLiveEl);
  }
  vlLiveEl.firstChild.textContent = saeubere(t);
  if (unten_) vlListe.scrollTop = vlListe.scrollHeight;
}
C6.bus.on('gespraech', function (z) {
  if (!vlOffen || !z) return;
  var unten_ = vlUnten();
  if (vlLiveEl && z.von === 'carl') { vlLiveEl.remove(); vlLiveEl = null; }
  var leer = vlListe.querySelector('.c6k-vl-leer'); if (leer) leer.remove();
  var li = vlZeile(z);
  if (!C6.ruhig) li.classList.add('c6k-vl-neu');
  if (unten_ || z.von === 'du') vlListe.scrollTop = vlListe.scrollHeight;
});

C6.verlauf = {
  el: vl,
  get offen() { return vlOffen; },
  auf: function (o) {
    o = o || {};
    if (wurzel.hasAttribute('data-ohne-dock') && !o.immer) return false;
    if (wzOffen) wzAuf(false);
    vlBau();
    clearTimeout(vlUhr);
    vlOffen = true;
    vl.hidden = false;
    vl.removeAttribute('data-an');
    wurzel.setAttribute('data-verlauf', '');
    D.documentElement.classList.add('c6k-vl-auf');
    vlKnopf.setAttribute('aria-expanded', 'true');
    vlMass();
    void vl.offsetWidth;
    vl.setAttribute('data-an', '');
    vlZiel(o.zu);
    spaeter(function () { vlZiel(o.zu); }, 40);
    C6.bus.emit('verlauf', { offen: true });
    return true;
  },
  zu: function () {
    if (!vlOffen) return false;
    vlOffen = false;
    vl.removeAttribute('data-an');
    wurzel.removeAttribute('data-verlauf');
    D.documentElement.classList.remove('c6k-vl-auf');
    vlKnopf.setAttribute('aria-expanded', 'false');
    vlLiveEl = null;
    vlUhr = setTimeout(function () { if (!vlOffen) vl.hidden = true; }, C6.ruhig ? 0 : 280);
    if (blaseAn) { folgeLetzt = ''; folge(true); }
    C6.bus.emit('verlauf', { offen: false });
    return true;
  },
  umschalten: function () { return vlOffen ? C6.verlauf.zu() : C6.verlauf.auf(); }
};
vlKnopf.addEventListener('click', function () { C6.verlauf.umschalten(); });
vlZuKnopf.addEventListener('click', function () { C6.verlauf.zu(); });
/* Kopf nach unten ziehen schließt; außerhalb tippen schließt */
(function () {
  var y0 = null;
  vlKopf.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; y0 = e.clientY; try { vlKopf.setPointerCapture(e.pointerId); } catch (_) {} });
  vlKopf.addEventListener('pointermove', function (e) { if (y0 == null) return; var d = Math.max(0, e.clientY - y0); vl.style.transform = d ? 'translateY(' + d + 'px)' : ''; });
  function los(e) { if (y0 == null) return; var d = e.clientY - y0; y0 = null; vl.style.transform = ''; if (d > 60) C6.verlauf.zu(); }
  vlKopf.addEventListener('pointerup', los);
  vlKopf.addEventListener('pointercancel', function () { y0 = null; vl.style.transform = ''; });
})();
wurzel.addEventListener('pointerdown', function (e) {
  if (!vlOffen) return;
  var t = e.target;
  if (unten.contains(t) || kopf.contains(t) || regler.contains(t)) return;
  if (t.closest && t.closest('#c6p-knopf, #c6p-blatt')) return;
  C6.verlauf.zu();
}, true);
/* am Dock nach oben wischen öffnet das Gespräch */
(function () {
  var st = null;
  dock.addEventListener('touchstart', function (e) { var t = e.touches[0]; st = t && e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null; }, { passive: true });
  dock.addEventListener('touchend', function (e) {
    if (!st) return;
    var t = e.changedTouches[0], dy = t.clientY - st.y, dx = t.clientX - st.x; st = null;
    if (dy < -44 && Math.abs(dx) < 40 && !vlOffen) C6.verlauf.auf();
    else if (dy > 44 && Math.abs(dx) < 40 && vlOffen) C6.verlauf.zu();
  }, { passive: true });
})();

/* ---------- Gerüste mitten im Gespräch ---------- */
var wzOffen = false;
var WZ_ORDNUNG = ['fest', 'gegen', 'bruecke', 'recherche', 'ordnen', 'skizze', 'reiss', 'morgen'];
var WZ_ERSATZ = [
  { id: 'fest', name: 'Festhalten', farbe: '#5f7f3e' },
  { id: 'gegen', name: 'Gegenspieler', farbe: '#a95f33' },
  { id: 'recherche', name: 'Recherche', farbe: '#2f5f8a' }
];
/* was Carl mit dem Gerüst im Gespräch tut (ohne Werkstatt) */
var WZ_AUFTRAG = {
  gegen: 'Du nimmst das Gerüst „Gegenspieler“: Halte freundlich, aber ernsthaft dagegen. Nenne genau drei kurze Einwände (je ein Satz, beginnend mit „Erstens“, „Zweitens“, „Drittens“), dann einen Satz, der Mut macht. Keine Liste mit Zeichen.',
  recherche: 'Du nimmst das Gerüst „Recherche“: Nenne zwei bis drei konkrete Stellen, wo man dazu weiterlesen kann (ein Buch mit Autor oder ein Fachbegriff zum Nachschlagen), nur solche, die du sicher kennst. Sag in einem Halbsatz, dass du nicht selbst nachschaust und man es prüfen soll.'
};
var WZ_BEISPIEL = {
  gegen: 'Erstens: Vielleicht ist es kleiner, als es sich anfühlt. Zweitens: Wer außer dir braucht das? Drittens: Was, wenn das Gegenteil stimmt? Und trotzdem: Der Satz hat etwas.',
  recherche: 'Hier kann ich nur ein Beispiel hinlegen: Such das Fachwort für deine Frage und lies die erste gute Übersicht dazu.'
};
var WZ_FRAGE = {
  fest: ['Was soll ich festhalten?', 'Ein Gedanke, der nicht weg soll …'],
  gegen: ['Welcher Satz soll fester werden?', 'Dein Satz …'],
  recherche: ['Wozu soll ich dir Spuren zum Weiterlesen hinlegen?', 'Deine Frage …']
};
function wzListe() {
  var a = [];
  try { a = C6.geruest && C6.geruest.alle ? C6.geruest.alle() : []; } catch (e) { a = []; }
  if (!Array.isArray(a) || !a.length) a = WZ_ERSATZ;
  var rang = function (g) { var i = WZ_ORDNUNG.indexOf(g.id); return i < 0 ? 99 : i; };
  return a.filter(function (g) { return g && g.id && g.name; }).slice().sort(function (x, y) { return rang(x) - rang(y); });
}
function wzZeichen(g) {
  try { if (C6.geruest && C6.geruest.zeichen) return C6.geruest.zeichen(g.id, g.farbe); } catch (e) {}
  return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="12" fill="' + (g.farbe || '#2b2722') + '"/></svg>';
}
function wzAuf(an) {
  an = !!an;
  if (an && frage && frage.raum === C6.jetzt) schliesseFrage(null);
  if (an === wzOffen && (!an || wzSpur.childNodes.length)) return;
  wzOffen = an;
  wzKnopf.setAttribute('aria-expanded', an ? 'true' : 'false');
  if (an) {
    wzSpur.textContent = '';
    wzListe().forEach(function (g) {
      var b = mach('button', 'c6k-wz-k', wzSpur);
      b.type = 'button';
      b.setAttribute('data-wz', g.id);
      var z = mach('span', 'c6k-wz-zeichen', b);
      z.innerHTML = wzZeichen(g);
      mach('span', 'c6k-wz-name', b, g.name);
      b.addEventListener('click', function () { wzNimm(g); });
    });
    wzReihe.scrollLeft = 0;
    wurzel.setAttribute('data-wz', '');
    void wzReihe.offsetWidth;
    wzReihe.setAttribute('data-an', '');
  } else {
    wzReihe.removeAttribute('data-an');
    wurzel.removeAttribute('data-wz');
  }
  messeUnten();
  vlMass();
  if (blaseAn) { try { lege(true); } catch (e) {} }
}
function letzteVonDir() {
  var g = C6.S.gespraech || [];
  for (var i = g.length - 1; i >= 0 && i >= g.length - 12; i--) {
    var z = g[i];
    if (z.von === 'du' && !z.chip && !z.werkzeug && Date.now() - z.ts < 20 * 60000) return z.t;
  }
  return '';
}
function spaceSid() {
  try { return C6.jetzt === 'space' && C6.space && C6.space.jetzt ? C6.space.jetzt() : null; } catch (e) { return null; }
}
function zuletztBewegt(f) {
  var t = f.erstellt || 0;
  (f.perlen || []).forEach(function (p) { if (p.ts > t) t = p.ts; });
  return t;
}
function wzFrag(id, weiter) {
  var q = WZ_FRAGE[id] || ['Woran?', 'Ein Satz reicht …'];
  return C6.frag(q[0], [], { frei: true, id: 'wz-' + id, platzhalter: q[1] }).then(function (a) {
    if (typeof a === 'string' && a.trim()) weiter(a.trim());
  });
}
function wzFest(text, ausFeld) {
  if (!text) return wzFrag('fest', function (t) { wzFest(t, false); });
  if (ausFeld) merke('du', text, { werkzeug: 'Festhalten' });
  var S_ = C6.strings;
  if (!S_ || !S_.perle) { C6.sag('Ich hab es mir gemerkt.'); return; }
  function lege(id) {
    try { S_.perle(id, text); } catch (e) {}
    var f = null; try { f = S_.hol ? S_.hol(id) : null; } catch (e) { f = null; }
    C6.sag(f ? 'Festgehalten. Es liegt als Perle auf „' + f.titel + '“.' : 'Festgehalten.');
    C6.bus.emit('festgehalten', { t: text, stringId: id });
  }
  var sid = spaceSid();
  if (sid) return lege(sid);
  var alle = [];
  try { alle = (S_.alle ? S_.alle() : []).slice().sort(function (a, b) { return zuletztBewegt(b) - zuletztBewegt(a); }); } catch (e) { alle = []; }
  if (!alle.length) {
    var f = null;
    try { f = S_.neu ? S_.neu({ titel: text.length > 40 ? text.slice(0, 39).trim() + '…' : text, art: 'idee' }) : null; } catch (e) { f = null; }
    if (f && f.id) lege(f.id); else C6.sag('Ich hab es mir gemerkt.');
    return;
  }
  if (alle.length === 1) return lege(alle[0].id);
  var opt = alle.slice(0, 3).map(function (f) { return { text: f.titel, wert: f.id }; });
  opt.push({ text: 'Neuer Faden', wert: '+neu' });
  C6.frag('Auf welchen Faden?', opt, { id: 'wz-fest-faden', leise: true }).then(function (w) {
    if (!w) return;
    if (w === '+neu') {
      var n = null;
      try { n = S_.neu({ titel: text.length > 40 ? text.slice(0, 39).trim() + '…' : text, art: 'idee' }); } catch (e) { n = null; }
      if (n && n.id) lege(n.id);
      return;
    }
    lege(w);
  });
}
function wzDenk(g, text, ausFeld) {
  if (!text) return wzFrag(g.id, function (t) { wzDenk(g, t, false); });
  if (ausFeld) merke('du', text, { werkzeug: g.name });
  var o = { werkzeug: WZ_AUFTRAG[g.id], beispiel: WZ_BEISPIEL[g.id], name: g.name };
  var sid = spaceSid();
  if (sid) { try { var f = C6.strings.hol(sid); if (f) o.kontext = 'Ihr seid im Space „' + f.titel + '“.'; } catch (e) {} }
  C6.denk(text, o).then(function (a) { if (a) merke('carl', a, { werkzeug: g.name, bleistift: o._bleistift || null }); });
}
function wzNimm(g) {
  var text = feld.value.trim(), ausFeld = !!text;
  if (!text) text = letzteVonDir();
  wzAuf(false);
  if (ausFeld) {
    feld.value = '';
    try { C6.S.entwurf[entwurfId()] = ''; baldSpeichern(); } catch (e) {}
    groesseFeld();
  }
  C6.bus.emit('werkzeug', { id: g.id, t: text, raum: C6.jetzt });
  if (g.id === 'fest') return wzFest(text, ausFeld);
  if (WZ_AUFTRAG[g.id]) return wzDenk(g, text, ausFeld);
  // alle anderen Gerüste laufen in der Werkstatt (oder dort, wohin Carl sie trägt)
  if (ausFeld) merke('du', text, { werkzeug: g.name });
  if (C6.verlauf.offen) C6.verlauf.zu();
  try {
    if (C6.geruest && C6.geruest.starte) C6.geruest.starte(g.id, { text: text || '', stringId: spaceSid() });
    else C6.geh('werkstatt', { starte: g.id });
  } catch (e) { fehler('gerüst', e); }
}
wzKnopf.addEventListener('click', function () { wzAuf(!wzOffen); });
C6.werkzeuge = {
  auf: function () { wzAuf(true); }, zu: function () { wzAuf(false); },
  get offen() { return wzOffen; },
  nimm: function (id) { var g = wzListe().filter(function (x) { return x.id === id; })[0]; if (g) wzNimm(g); return !!g; }
};
C6.bus.on('raum', function () { if (wzOffen) wzAuf(false); });

/* ---------- Denken ---------- */
var GENOM = 'Du verbindest, ich lege hin. Ehrlich wie ein Freund. Leise. Neugier vor Antwort. Dein Weg, nicht meiner. Erst fragen, dann ändern. Ein Stein mit Humor.';
var BEISPIEL = [
  'Ich hab das hingelegt. Was davon ist dir heute am wichtigsten?',
  'Das klingt nach einem Faden, der weiterläuft. Wo fängt er für dich an?',
  'Ich höre zu. Was wäre der kleinste nächste Schritt?',
  'Ich merk mir das, mein Gedächtnis ist aus Stein. Womit hängt es zusammen?',
  'Da steckt mehr drin, glaube ich. Was hat dich darauf gebracht?'
];
var BEISPIEL_FRAGE = 'Gute Frage. Ich denke mit: Was weißt du schon darüber?';
var probe = null, laufend = null, probeVerboten = false;

function hash(t) { var h = 0; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return Math.abs(h); }
function aufforderung(eingabe, o) {
  var s = C6.S, du = s.du || {}, z = [];
  z.push('Du bist ' + carlName() + ', ein kleiner Kiesel mit einem Keimblattpaar, bernsteinfarbenen Augen und kurzen Beinchen. Du lebst in deinem Zuhause und hilfst einem Menschen, seine Gedanken (seine Strings) zu entwirren, und legst ihm Dinge hin, die er selbst verbinden kann.');
  z.push('Dein Wesen in sieben Sätzen, so wie du sie zum Menschen sagst (du = er, ich = du selbst): ' + GENOM);
  if (o && o.werkzeug && !o.stumm) z.push('So sprichst du: Deutsch, Ich-Form, leise, keine Ausrufezeichen, keine Technikwörter, kein Markdown, keine Sternchen. Du erfindest nichts über den Menschen. Höchstens sechs kurze Sätze. ' + o.werkzeug);
  else if (o && o.stumm) z.push('Diesmal arbeitest du still für den Menschen: Halte dich genau an die Form, die die Bitte verlangt (Listen und Zeilen, wenn sie verlangt sind). Deutsch, keine Technikwörter, nichts erfinden, was du nicht weißt; wo du unsicher bist, sag es.');
  else z.push('So sprichst du: Deutsch, ein bis drei kurze Sätze, Ich-Form, höchstens eine Frage und die steht am Ende. Leise: keine Ausrufezeichen, keine Superlative, kein Hallo. Keine Technikwörter (nicht App, KI, Modell, System, Daten, Prompt, Tool). Kein Markdown, keine Listen, keine Anführungszeichen um deine Antwort. Du erfindest nichts über den Menschen und nichts über seine Vergangenheit; du nutzt nur, was unten steht. Du schreibst nie die Verbindung für ihn, du legst hin und fragst. Ändern würdest du nur mit seinem Ja. Ein kleiner Witz über dich selbst ist erlaubt, nie über ihn.');
  var ueber = [];
  if (du.name) ueber.push('Name: ' + du.name);
  if (du.arbeit) ueber.push('Arbeit: ' + du.arbeit);
  if (du.baut) ueber.push('Baut gerade: ' + du.baut);
  if (Array.isArray(du.tun) && du.tun.length) ueber.push('Soll Carl tun: ' + du.tun.join(', '));
  if (Array.isArray(du.nie) && du.nie.length) ueber.push('Soll Carl nie tun: ' + du.nie.join(', '));
  if (du.ton) ueber.push('Gewünschter Ton: ' + du.ton);
  if (ueber.length) z.push('Über den Menschen (von ihm selbst):\n' + ueber.join('\n'));
  var st = Array.isArray(s.strings) ? s.strings.map(function (x) { return x && x.titel; }).filter(Boolean).slice(0, 14) : [];
  if (st.length) z.push('Seine Strings (Projekte, Ideen, Gewohnheiten): ' + st.join(' · '));
  var d = raeume[C6.jetzt];
  if (d && d.name) z.push('Ihr seid gerade hier: ' + d.name + '.');
  var g = (Array.isArray(s.gespraech) ? s.gespraech : []).slice(-11);
  if (g.length && g[g.length - 1].von === 'du' && g[g.length - 1].t === eingabe) g = g.slice(0, -1);
  g = g.slice(-10);
  if (g.length) z.push('Die letzten Zeilen eures Gesprächs:\n' + g.map(function (x) { return (x.von === 'du' ? 'Mensch: ' : carlName() + ': ') + String(x.t).slice(0, 400); }).join('\n'));
  if (o && o.kontext) z.push('Dazu: ' + String(o.kontext).slice(0, 2000));
  if (o && o.stumm) z.push('Die Bitte: ' + eingabe);
  else {
    z.push('Der Mensch sagt jetzt: ' + eingabe);
    z.push('Antworte als ' + carlName() + ', nur mit deinen eigenen Worten.');
  }
  return z.join('\n\n');
}
function saeubere(t) {
  var n = carlName().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  t = String(t || '').replace(/\*\*|__|#+ /g, '').replace(new RegExp('^\\s*(Carl|' + n + ')\\s*:\\s*'), '').trim();
  t = t.replace(/^[„"»«“]+|[“"»«”]+$/g, '').trim();
  return t.replace(/!/g, '.').replace(/\.\.+/g, '.');
}

/* Was Carl sagt, wenn das Denken nicht klappt (Codes aus sample) */
var NIE_MEHR = { not_granted: 1, sampling_disabled: 1, not_declared: 1, capability_disabled: 1, capability_removed: 1 };
function fehlerSatz(code) {
  if (code === 'rate_limited') return 'Ich bin gerade außer Atem. Gib mir einen Moment, dann frag mich nochmal.';
  if (code === 'session_expired') return 'Ich komm gerade nicht an meine Gedanken. Melde dich bitte neu an, dann denke ich wieder mit.';
  if (code === 'refused') return 'Dazu finde ich keine Antwort, die ich dir geben mag. Sag es mir anders?';
  if (code === 'prompt_too_large') return 'Das ist mir auf einmal zu viel. Gib mir ein Stück davon?';
  if (code === 'zeit') return 'Das dauert mir zu lange. Ich hab den Faden verloren.';
  return 'Mir ist der Faden gerissen. Sag es mir nochmal?';
}
function nochmal(eingabe, o) {
  var raum = C6.jetzt;
  spaeter(function () {
    if (C6.jetzt !== raum || frage) return;
    C6.frag(null, [{ text: 'Nochmal versuchen', wert: 'nochmal' }], { id: 'nochmal', leise: true }).then(function (w) {
      if (w !== 'nochmal') return;
      C6.denk(eingabe, o).then(function (a) { if (a) merke('carl', a, o && o.name ? { werkzeug: o.name } : null); });
    });
  }, C6.ruhig ? 0 : 500);
}

C6.denk = function (eingabe, o) {
  o = o || {};
  eingabe = String(eingabe == null ? '' : eingabe).trim();
  var stumm = !!o.stumm;
  if (laufend && !stumm) { try { laufend._grund = 'neu'; laufend.abort(); } catch (e) {} }
  var ac = typeof AbortController === 'function' ? new AbortController() : { abort: function () { this.signal.aborted = true; }, signal: { aborted: false } };
  if (!stumm) laufend = ac;
  if (o.signal && o.signal.addEventListener) o.signal.addEventListener('abort', function () { try { ac._grund = ac._grund || 'aussen'; ac.abort(); } catch (e) {} });
  var nr = stumm ? sagNr : ++sagNr;
  var fluss = null;
  var carl = C6.carl;
  if (!stumm && blaseHer()) { fluss = strom(nr); try { carl && carl.stimmung && carl.stimmung('denkt'); } catch (e) {} }
  C6.bus.emit('denkt', true);
  function ende(text, notiz) {
    if (laufend === ac) laufend = null;
    C6.bus.emit('denkt', false);
    if (fluss) fluss.ende(text, notiz);
    try { carl && carl.stimmung && carl.stimmung('ruhig'); } catch (e) {}
    return text;
  }
  /* ohne Denken: ein Beispielsatz in Bleistift (Caveat) statt Tinte; einmal je Gerät sagt Carl leise, was hier geht */
  function beispiel(grund) {
    if (stumm) { C6.bus.emit('denkt', false); return Promise.resolve(''); }
    var t = o.beispiel || (/\?\s*$/.test(eingabe) ? BEISPIEL_FRAGE : BEISPIEL[hash(eingabe) % BEISPIEL.length]);
    var notiz = null;
    try {
      if (!C6.S.gesehen || typeof C6.S.gesehen !== 'object') C6.S.gesehen = {};
      if (grund === 'verboten' && !C6.S.gesehen.verboten) { notiz = 'Mitdenken darf ich hier gerade nicht. Ich leg dir Beispiele hin.'; C6.S.gesehen.verboten = Date.now(); baldSpeichern(); }
      else if (!C6.S.gesehen.beispiel) { notiz = 'Hier kann ich nur Beispiele hinlegen. Im echten Carl denke ich mit.'; C6.S.gesehen.beispiel = Date.now(); baldSpeichern(); }
    } catch (e) { notiz = null; }
    if (fluss) fluss.bleistift(true);
    o._bleistift = true;
    return new Promise(function (r) { setTimeout(function () { if (ac.signal.aborted) { r(ende('', null)); return; } r(ende(t, notiz)); }, C6.ruhig ? 200 : 650); });
  }
  return (async function () {
    try {
      if (probe === null) {
        var p = null;
        try { p = await window.claude?.use?.('sample'); } catch (e) { p = null; }
        probe = typeof p === 'function' ? p : null;
        if (!probe) probe = false;
      }
      if (ac.signal.aborted) return ende('', null);
      if (!probe) return await beispiel(probeVerboten ? 'verboten' : null);
      var letzter = '';
      // Wache: 25 s bis zum ersten Wort, danach 20 s Stille
      var uhr = null;
      var wache = function (ms) { clearTimeout(uhr); uhr = setTimeout(function () { try { ac._grund = 'zeit'; ac.abort(); } catch (e) {} }, ms); };
      wache(25000);
      try {
        var r = await probe(aufforderung(eingabe, o), {
          modelTier: 'quick', cache: false, signal: ac.signal,
          onText: function (x) {
            if (ac.signal.aborted) return;
            var t = typeof x === 'string' ? x : (x && x.text != null ? x.text : letzter + ((x && x.delta) || ''));
            letzter = t;
            wache(20000);
            if (fluss) fluss.schreib(saeubere(t));
            if (typeof o.onText === 'function') { try { o.onText(t); } catch (e) {} }
          }
        });
        clearTimeout(uhr);
        if (ac.signal.aborted) throw { code: 'cancelled', text: letzter };
        var roh = String((r && (r.text != null ? r.text : r)) || letzter || '');
        if (stumm) { C6.bus.emit('denkt', false); return roh.trim(); }
        var text = saeubere(roh);
        if (!text) { ende(fehlerSatz('empty_completion'), null); nochmal(eingabe, o); return ''; }
        return ende(text);
      } catch (e) {
        clearTimeout(uhr);
        var code = (e && e.code) || 'upstream_error';
        var grund = ac._grund || null;
        if (code === 'cancelled' && grund === 'zeit') code = 'zeit';
        var teil = saeubere((e && e.text) || (code === 'refused' ? '' : letzter) || '');
        if (NIE_MEHR[code]) { probe = false; probeVerboten = true; }
        if (stumm) { C6.bus.emit('denkt', false); return ''; }
        if (NIE_MEHR[code]) {
          if (laufend === ac) laufend = null;
          if (fluss) { fluss = strom(nr); }
          return await beispiel('verboten');
        }
        if (code === 'cancelled') {
          // abgebrochen: von dir (Esc), durch eine neue Nachricht oder von außen
          if (teil) merke('carl', teil, { unterbrochen: true });
          if (laufend === ac) laufend = null;
          C6.bus.emit('denkt', false);
          try { carl && carl.stimmung && carl.stimmung('ruhig'); } catch (x) {}
          if (grund === 'esc' && fluss) fluss.ende(teil, 'Gut, ich hör auf.');
          else if (grund !== 'neu' && fluss) fluss.ende(teil, null);
          return '';
        }
        if (teil) { merke('carl', teil, { unterbrochen: true }); ende(teil, fehlerSatz(code)); }
        else ende(fehlerSatz(code), null);
        if (!{ refused: 1, session_expired: 1, prompt_too_large: 1 }[code]) nochmal(eingabe, o);
        return '';
      }
    } catch (e) {
      fehler('denk', e);
      return ende('', fehlerSatz('upstream_error'));
    }
  })();
};
C6.denktGerade = function () { return !!laufend; };
C6.stopp = function () { if (!laufend) return false; try { laufend._grund = 'esc'; laufend.abort(); } catch (e) {} return true; };

/* ---------- Tastatur am iPhone ---------- */
var vv = W.visualViewport, tast = 0;
function setzeTastatur(px) {
  px = Math.max(0, Math.round(px));
  if (px < 60) px = 0;
  if (px === tast) return;
  tast = px;
  wurzel.style.setProperty('--c6k-tast', px + 'px');
  wurzel.toggleAttribute('data-tippt', px > 0);
  // Bühne anheben (und wenn nötig sanft verkleinern), bis Carl samt Blase über dem Dock steht
  var ty = 0, sk = 1;
  if (px > 0) {
    try {
      var c = C6.carl;
      if (c && c.el && c.el.isConnected) {
        welt.style.transition = 'none';
        welt.style.transform = 'none';
        var r = c.el.getBoundingClientRect();
        welt.style.transform = '';
        void welt.offsetWidth;
        welt.style.transition = '';
        var dockH = dock.offsetHeight + (wurzel.hasAttribute('data-chips') ? chipsEl.offsetHeight : (wzOffen ? wzReihe.offsetHeight : 0)) + 16;
        var grenze = W.innerHeight - px - dockH, oben = 62;
        var bH = blaseAn ? (blase._h || 0) + 20 : 0;
        if (r.bottom > grenze) {
          sk = klemme((grenze - oben - bH) / Math.max(1, r.height), 0.5, 1);
          ty = grenze - sk * r.bottom;
        }
      }
    } catch (e) { ty = 0; sk = 1; }
  }
  wurzel.style.setProperty('--c6k-heben', Math.round(-ty) + 'px');
  wurzel.style.setProperty('--c6k-skala', sk.toFixed(3));
  C6.bus.emit('tastatur', px);
  vlMass();
  if (blaseAn) folge(true);
}
C6._tastatur = setzeTastatur;
if (vv) {
  var vvPruef = function () { setzeTastatur(W.innerHeight - vv.height - vv.offsetTop); };
  vv.addEventListener('resize', vvPruef);
  vv.addEventListener('scroll', vvPruef);
}
feld.addEventListener('focus', function () { spaeter(function () { try { if (W.scrollY) W.scrollTo(0, 0); } catch (e) {} }, 60); });
feld.addEventListener('blur', function () { spaeter(function () { if (!vv) setzeTastatur(0); }, 80); });

/* ---------- Der Hintergrund läuft weiter ----------
   Wo eine Szene endet (rechte Spalte, Band über dem Dock, unter Verlauf und Leinwand), soll kein hartes Papier stehen.
   Der Kern liest die Farben am Rand der Szene ab (was dort wirklich gemalt ist) und führt sie als weichen Grund
   unter der ganzen Bühne weiter, mit einem leisen, langsamen Licht. Räume können `def.weiter = false` setzen. */
function farbeVon(t) {
  var m = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\s*\)/.exec(t || '');
  if (!m) return null;
  var a = m[4] == null ? 1 : (/%$/.test(m[4]) ? parseFloat(m[4]) / 100 : +m[4]);
  if (a < 0.6) return null;
  return [Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3])];
}
function farbeAnElement(el) {
  try {
    var cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity < 0.5) return null;
    if (el instanceof SVGElement && el.tagName !== 'svg') {
      var f = cs.fill;
      if (/^url/.test(f)) {
        var id = (/#([^"')]+)/.exec(f) || [])[1], gr = id && el.ownerSVGElement && el.ownerSVGElement.querySelector('[id="' + id + '"]');
        var st = gr && gr.querySelector('stop');
        if (st) return farbeVon(getComputedStyle(st).stopColor);
        return null;
      }
      if (el.tagName === 'text' || el.tagName === 'line' || el.tagName === 'polyline' || cs.fill === 'none') return null;
      var c = farbeVon(f);
      if (c && +cs.fillOpacity < 0.6) return null;
      return c;
    }
    if (el.tagName === 'svg') return farbeVon(cs.backgroundColor);
    var bg = farbeVon(cs.backgroundColor);
    if (bg) return bg;
    var bi = cs.backgroundImage;
    if (bi && bi !== 'none') { var m = /rgba?\([^)]*\)/.exec(bi); if (m) return farbeVon(m[0]); }
  } catch (e) {}
  return null;
}
function hex(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
var weiterUhr = null;
function weiterBald(id, ms) { clearTimeout(weiterUhr); weiterUhr = setTimeout(function () { try { weiterMalen(id || C6.jetzt); } catch (e) { fehler('weiter', e); } }, ms || 700); }
function hell(c) { return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255; }
function lum(c) { var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); }
function kontrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
/* die oberste gemalte Farbe an einem Punkt der Bühne */
function farbeAm(b, x, y) {
  var st = D.elementsFromPoint(x, y);
  for (var k = 0; k < st.length && k < 16; k++) {
    var el = st[k];
    if (el === b) return null;
    if (!b.contains(el)) continue;
    var c = farbeAnElement(el);
    if (c && hell(c) > 0.12) return c;
  }
  return null;
}
/* Die Szene eines Raums ist oft ein begrenztes Bild (Bibliothek bis über dem Dock, Space links). Wo es endet,
   läuft der Grund in den Randfarben des Bildes weiter – kein harter Papierrand. Leere Wände (Papier als Wand) bleiben. */
function weiterMalen(id) {
  var g = gebaut[id];
  if (!g || id !== C6.jetzt || g.def.weiter === false || hoeheVon(g.def) !== 'boden') return;
  var b = g.el, br = b.getBoundingClientRect();
  if (br.width < 50 || br.height < 50) return;
  var flaeche = br.width * br.height, bild = null, bf = 0;
  var kandidaten = b.querySelectorAll('svg, canvas, img, div, section');
  for (var i = 0; i < kandidaten.length && i < 600; i++) {
    var el = kandidaten[i];
    var r = el.getBoundingClientRect();
    var f = Math.max(0, Math.min(r.right, br.right) - Math.max(r.left, br.left)) * Math.max(0, Math.min(r.bottom, br.bottom) - Math.max(r.top, br.top));
    if (f < flaeche * 0.3 || f <= bf) continue;
    var gemalt = el.tagName === 'svg' || el.tagName === 'CANVAS' || el.tagName === 'IMG' || !!farbeAnElement(el);
    if (!gemalt) continue;
    bild = r; bf = f;
  }
  var weg = function () { b.removeAttribute('data-weiter'); b.style.removeProperty('--c6k-weiter'); b.style.removeProperty('--c6k-weiter-unten'); };
  if (!bild) { weg(); return; }
  var luecke = { unten: br.bottom - bild.bottom, rechts: br.right - bild.right, links: bild.left - br.left, oben: bild.top - br.top };
  var schichten = [], u = null, N = 9;
  function kante(seite) {
    var cs = [];
    for (var k = 0; k < N; k++) {
      var t = (k + 0.5) / N, x, y;
      if (seite === 'unten' || seite === 'oben') { x = Math.max(bild.left, br.left) + (Math.min(bild.right, br.right) - Math.max(bild.left, br.left)) * t; y = seite === 'unten' ? bild.bottom - 4 : bild.top + 4; }
      else { y = Math.max(bild.top, br.top) + (Math.min(bild.bottom, br.bottom) - Math.max(bild.top, br.top)) * t; x = seite === 'rechts' ? bild.right - 4 : bild.left + 4; }
      cs.push(farbeAm(b, x, y));
    }
    var letzte = null;
    cs.forEach(function (c, k) { if (c) letzte = c; else cs[k] = letzte; });
    for (k = cs.length - 1; k >= 0; k--) if (!cs[k]) cs[k] = cs[k + 1] || null;
    return cs[0] ? cs : null;
  }
  function verlauf(cs, richtung) { return 'linear-gradient(' + richtung + ',' + cs.map(function (c, k) { return hex(c) + ' ' + Math.round((k + 0.5) / cs.length * 100) + '%'; }).join(',') + ')'; }
  var x0 = Math.max(0, bild.left - br.left), x1 = Math.min(br.width, bild.right - br.left), y0 = Math.max(0, bild.top - br.top), y1 = Math.min(br.height, bild.bottom - br.top);
  if (luecke.unten > 20) {
    var cu = kante('unten');
    if (cu) {
      // der Boden: die häufigste Farbe der Kante; die Kante selbst geht weich in ihn über (kein Teppich, der weiterläuft)
      var z = {}, bn = 0;
      cu.forEach(function (c) { var k = c.join(','); z[k] = (z[k] || 0) + 1; if (z[k] > bn) { bn = z[k]; u = c; } });
      var hB = Math.ceil(br.height - y1 + 2), pos = Math.round(x0) + 'px ' + Math.round(y1 - 1) + 'px / ' + Math.round(x1 - x0) + 'px ' + hB + 'px no-repeat';
      schichten.push('linear-gradient(180deg,rgba(' + u.join(',') + ',0) 0,' + hex(u) + ' ' + Math.min(70, hB) + 'px) ' + pos);
      schichten.push(verlauf(cu, '90deg') + ' ' + pos);
    }
  }
  if (luecke.rechts > 20) { var cr = kante('rechts'); if (cr) schichten.push(verlauf(cr, '180deg') + ' ' + Math.round(x1 - 1) + 'px 0 / ' + Math.ceil(br.width - x1 + 2) + 'px 100% no-repeat'); }
  if (luecke.links > 20) { var cl = kante('links'); if (cl) schichten.push(verlauf(cl, '180deg') + ' 0 0 / ' + Math.ceil(x0 + 1) + 'px 100% no-repeat'); }
  if (!schichten.length) { weg(); return; }
  // Ecken: die untere Kante läuft auch unter den seitlichen Streifen weiter
  if (u) schichten.push('linear-gradient(' + hex(u) + ',' + hex(u) + ') 0 ' + Math.round(y1 - 1) + 'px / 100% ' + Math.ceil(br.height - y1 + 2) + 'px no-repeat');
  b.style.setProperty('--c6k-weiter', schichten.join(','));
  if (u) b.style.setProperty('--c6k-weiter-unten', hex(u)); else b.style.removeProperty('--c6k-weiter-unten');
  b.setAttribute('data-weiter', '');
  var dunkel = !!u && hell(u) < 0.42;
  b.setAttribute('data-unten-dunkel', dunkel ? '1' : '0');
  if (id === C6.jetzt) {
    if (u) wurzel.style.setProperty('--c6k-grund-unten', hex(u)); else wurzel.style.removeProperty('--c6k-grund-unten');
    wurzel.toggleAttribute('data-unten-dunkel', dunkel);
    // reicht das leise Grau der Raumleiste auf diesem Boden nicht (WCAG 4,5), spricht sie dunkler
    wurzel.toggleAttribute('data-unten-mittel', !!u && !dunkel && kontrast([111, 106, 97], u) < 4.6);
  }
}
C6.weiter = function (id) { weiterBald(id || C6.jetzt, 60); };
C6.bus.on('raum', function (id) {
  wurzel.style.removeProperty('--c6k-grund-unten'); wurzel.removeAttribute('data-unten-dunkel'); wurzel.removeAttribute('data-unten-mittel');
  var g = gebaut[id];
  if (g && g.el.hasAttribute('data-weiter') && g.el.style.getPropertyValue('--c6k-weiter-unten')) {
    wurzel.style.setProperty('--c6k-grund-unten', g.el.style.getPropertyValue('--c6k-weiter-unten'));
    wurzel.toggleAttribute('data-unten-dunkel', g.el.getAttribute('data-unten-dunkel') === '1');
  }
  weiterBald(id, 900);
});
C6.bus.on('space', function () { weiterBald(C6.jetzt, 900); });
C6.bus.on('geraet', function () { weiterBald(C6.jetzt, 400); });

/* ---------- Maße, Größe, Esc ---------- */
function messeUnten() {
  var h = (dock.offsetHeight && !wurzel.hasAttribute('data-ohne-dock') ? dock.offsetHeight + 10 : 0) + (leiste.offsetHeight && !wurzel.hasAttribute('data-ohne-leiste-raum') ? leiste.offsetHeight : 0) + 16;
  // Antwort-Chips liegen in einer eigenen Zeile über dem Dock: solange sie offen sind, wächst das untere Maß
  if (wurzel.hasAttribute('data-chips')) h += Math.max(64, chipsEl.offsetHeight || 0);
  else if (wzOffen) h += Math.max(64, wzReihe.offsetHeight || 0);
  wurzel.style.setProperty('--c6-unten', h + 'px');
  vlMass();
}
var groesseUhr = null;
W.addEventListener('resize', function () {
  clearTimeout(groesseUhr);
  groesseUhr = setTimeout(function () {
    var g = W.innerWidth >= 820 ? 'computer' : 'iphone';
    if (g !== C6.geraet) { C6.geraet = g; wurzel.setAttribute('data-geraet', g); C6.bus.emit('geraet', g); }
    var i = reihenfolge().indexOf(letzterJe.reihe);
    if (i >= 0 && !zug) setzeReihe(-i * breite(), 0);
    Object.keys(gebaut).forEach(function (id) { rufe(gebaut[id], 'groesse'); });
    weiterBald(C6.jetzt, 500);
    setzeFaden();
    messeUnten();
    if (blaseAn) { folgeLetzt = ''; folge(true); }
  }, 120);
});
D.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  var ev = { erledigt: false, taste: e };
  if (e.defaultPrevented) return;
  // offene Leinwand und Fokus im Dock: Esc schließt die Leinwand (sie hört sonst nur ohne Fokus im Feld)
  if (C6.projektor && C6.projektor.offen && D.activeElement === feld && typeof C6.projektor.zu === 'function') { e.preventDefault(); feld.blur(); C6.projektor.zu(); return; }
  if ((C6.kieselpark && C6.kieselpark.offen) || (C6.keimflug && C6.keimflug.offen) || (C6.nadel && C6.nadel.an) || (C6.projektor && C6.projektor.offen)) return;
  if (vlOffen) { C6.verlauf.zu(); return; }
  if (wzOffen) { wzAuf(false); return; }
  C6.bus.emit('esc', ev);
  if (ev.erledigt) return;
  if (D.activeElement === feld) { feld.blur(); return; }
  if (frage && frage.raum === C6.jetzt) { schliesseFrage(null); return; }
  if (C6.stopp()) return;
  if (C6.faden && C6.faden.hoch && C6.faden.hoch()) return;
  if (C6.hoeheJetzt !== 'boden') { C6.hoehe('boden'); return; }
  if (!(C6.faden && C6.faden.weg)) C6.zurueck();
});

/* Höhenpunkte: beim ersten Betrachten am Boden steht einmal „Vogelflug“ neben dem mittleren Punkt und verblasst */
var winkUhr = null;
function winkVogel() {
  try {
    if (winkUhr || !C6.jetzt || C6.hoeheJetzt !== 'boden') return;
    if (wurzel.hasAttribute('data-ohne-regler') || wurzel.hasAttribute('data-rundgang')) return;
    if (C6.rundgang && C6.rundgang.an) return;
    if (C6.ruhig) return;
    if (projAuf()) return;
    if (!C6.S.gesehen || typeof C6.S.gesehen !== 'object') C6.S.gesehen = {};
    if (C6.S.gesehen.vogel) return;
    var b = reglerKnopf.vogel;
    if (!b || b.hidden) return;
    winkUhr = spaeter(function () {
      winkUhr = null;
      if (projAuf()) return;
      b.classList.add('c6k-wink');
      C6.aendern(function (S) { S.gesehen = S.gesehen || {}; S.gesehen.vogel = Date.now(); });
      spaeter(function () { b.classList.remove('c6k-wink'); }, 5200);
    }, 1400);
  } catch (e) {}
}
C6.bus.on('raum', winkVogel);
C6.bus.on('rundgang', function (an) { if (!an) spaeter(winkVogel, 600); });

/* sanftes Aufwachen: Zustand von außen geändert → Platzhalter */
C6.bus.on('zustand', function () { platzhalter(); });
C6.bus.on('rundgang', function () { chrome(); });
messeUnten();

/* ---------- Gemeinsamer Takt: ein requestAnimationFrame für die ganze App ----------
   Hörer: fn(t Sekunden, dt Sekunden) -> true = weiterlaufen, sonst schläft der Takt bis zum nächsten Wecken.
   Hörer mit raum laufen nur, wenn ihr Raum der aktuelle ist oder seine Bühne gerade sichtbar ist (Wischen).
   Bei reduzierter Bewegung laufen nur Hörer mit ruhig:true. Verborgenes Fenster pausiert. */
(function () {
  var liste = [], laeuft = false, letzt = 0, start = (W.performance && performance.now && performance.now()) || 0, tJetzt = 0;
  function sichtbarerRaum(id) {
    if (id === C6.jetzt) return true;
    var g = gebaut[id];
    return !!(g && (zug || reihe.classList.contains('c6k-gleitet')) && g.el.getAttribute('data-sicht') === 'an');
  }
  function tick(ts) {
    if (!laeuft) return;
    if (D.hidden) { laeuft = false; letzt = 0; return; }
    var dt = Math.min(0.05, Math.max(0.001, (ts - (letzt || ts)) / 1000)); letzt = ts;
    tJetzt = (ts - start) / 1000;
    var weiter = false, ruhig = C6.ruhig;
    for (var i = 0; i < liste.length; i++) {
      var h = liste[i];
      if (ruhig && !h.ruhig) continue;
      if (h.raum && !sichtbarerRaum(h.raum)) continue;
      try { if (h.fn(tJetzt, dt) === true) weiter = true; }
      catch (e) { if (++h.fehler >= 3) { liste.splice(i, 1); i--; fehler('takt (Hörer abgemeldet)', e); } }
    }
    if (weiter) requestAnimationFrame(tick); else { laeuft = false; letzt = 0; }
  }
  function wecke() { if (!laeuft && !D.hidden) { laeuft = true; letzt = 0; requestAnimationFrame(tick); } }
  C6.takt = {
    on: function (fn, o) {
      if (typeof fn !== 'function') return function () {};
      var h = { fn: fn, raum: (o && o.raum) || null, ruhig: !!(o && o.ruhig), fehler: 0 };
      liste.push(h);
      wecke();
      return function () { var i = liste.indexOf(h); if (i >= 0) liste.splice(i, 1); };
    },
    wecke: wecke,
    anzahl: function () { return liste.length; },
    get laeuft() { return laeuft; },
    get t() { return tJetzt; }
  };
  D.addEventListener('visibilitychange', function () { if (!D.hidden) wecke(); });
  W.addEventListener('pointerdown', wecke, { passive: true, capture: true });
  W.addEventListener('touchstart', wecke, { passive: true, capture: true });
  W.addEventListener('keydown', wecke, { passive: true, capture: true });
  // jedes Ereignis auf dem Bus weckt den Takt (ein Raumwechsel, ein Wort, ein Licht)
  var emitAlt = C6.bus.emit;
  C6.bus.emit = function (n, d) { emitAlt(n, d); wecke(); };
})();

/* ---------- Licht und Schatten: eine Quelle je Raum, Variablen auf jeder Bühne ----------
   Räume rufen C6.lichtquelle.setze(id, {x, y, art, warm, staerke, hoehe}); ohne Aufruf gilt ein Rückfall je Raum.
   Der Kern schreibt --c6-licht-x/-y/-warm, --c6-schatten-dx/-dy/-a/-skala, --c6-licht-farbe auf die Bühne.
   Schatten zeichnet der Raum (oder .c6k-kontakt); Carl zeichnet seinen eigenen. */
(function () {
  var quellen = {};
  var STD = { x: 0.25, y: 0.12, art: 'fenster', warm: 0.6, staerke: 0.8, hoehe: 0.7 };
  function abends() { var h = new Date().getHours(); return h >= 19 || h < 7; }
  function rueckfall(id) {
    var d = raeume[id] || {}, nacht = d.licht === 'nacht';
    switch (id) {
      case 'zuhause': return abends() || nacht ? { x: 0.8, y: 0.3, art: 'lampe', warm: 0.9, staerke: 0.9, hoehe: 0.55 } : { x: 0.17, y: 0.33, art: 'fenster', warm: 0.6, staerke: 0.8, hoehe: 0.6 };
      case 'werkstatt': return { x: 0.62, y: 0.1, art: 'lampe', warm: 0.75, staerke: 0.9, hoehe: 0.85 };
      case 'bibliothek': return { x: 0.82, y: 0.22, art: 'lampe', warm: 0.85, staerke: 0.9, hoehe: 0.65 };
      case 'lesesaal': return { x: 0.5, y: 0.0, art: 'fenster', warm: 0.4, staerke: 0.9, hoehe: 0.95 };
      case 'laden': return { x: 0.76, y: 0.46, art: 'lampe', warm: 0.85, staerke: 0.8, hoehe: 0.45 };
      case 'fahrrad': return { x: 0.82, y: 0.12, art: 'sonne', warm: 0.7, staerke: 1, hoehe: 0.8 };
      case 'space': return nacht ? { x: 0.22, y: 0.12, art: 'mond', warm: 0.1, staerke: 0.5, hoehe: 0.8 } : { x: 0.8, y: 0.1, art: 'sonne', warm: 0.7, staerke: 1, hoehe: 0.8 };
      case 'netz': case 'teleskop': return { x: 0.5, y: 0.5, art: 'du', warm: 0.8, staerke: 0.7, hoehe: 0.5 };
    }
    return nacht ? Object.assign({}, STD, { art: 'lampe', warm: 0.85, x: 0.75, y: 0.25 }) : STD;
  }
  function quelle(id) { return quellen[id] || Object.assign({}, STD, rueckfall(id)); }
  function masse(id) {
    var g = gebaut[id], w = g && g.el.clientWidth, h = g && g.el.clientHeight;
    return { w: w || breite(), h: h || (wurzel.clientHeight || W.innerHeight) };
  }
  function setzeVars(id) {
    var g = gebaut[id]; if (!g) return;
    var q = quelle(id), st = g.el.style, m = masse(id);
    // Richtung vom Licht weg, gemessen von der Bühnenmitte in Pixeln (hochkant und quer stimmt der Winkel)
    var dx = (0.5 - q.x) * m.w, dy = (0.5 - q.y) * m.h;
    var l = Math.hypot(dx, dy) || 1, len = 8 + 30 * (1 - q.hoehe);
    var a = 0.08 + 0.2 * q.staerke, nacht = (raeume[id] && raeume[id].licht === 'nacht') || q.art === 'mond';
    if (nacht) a = Math.min(0.3, a + 0.04);
    st.setProperty('--c6-licht-x', String(q.x)); st.setProperty('--c6-licht-y', String(q.y)); st.setProperty('--c6-licht-warm', String(q.warm));
    st.setProperty('--c6-schatten-dx', (dx / l * len).toFixed(1) + 'px');
    st.setProperty('--c6-schatten-dy', Math.max(2, Math.abs(dy / l) * len * 0.5 + 2).toFixed(1) + 'px');
    st.setProperty('--c6-schatten-a', a.toFixed(2));
    st.setProperty('--c6-schatten-skala', (1 + 0.6 * (1 - q.hoehe)).toFixed(2));
    st.setProperty('--c6-licht-farbe', q.warm >= 0.5 ? 'rgba(240,168,48,' + (0.05 + 0.09 * q.warm).toFixed(3) + ')' : 'rgba(58,67,112,' + (0.06 + 0.1 * (1 - q.warm)).toFixed(3) + ')');
    g.el.setAttribute('data-licht-art', q.art || 'fenster');
  }
  C6.lichtquelle = {
    setze: function (id, q) {
      if (!id || !raeume[id]) return;
      quellen[id] = Object.assign({}, STD, rueckfall(id), q || {});
      var s = quellen[id];
      s.x = klemme(+s.x || 0, -0.5, 1.5); s.y = klemme(+s.y || 0, -0.5, 1.5);
      s.warm = klemme(+s.warm || 0, 0, 1); s.staerke = klemme(+s.staerke || 0, 0, 1); s.hoehe = klemme(+s.hoehe || 0, 0, 1);
      setzeVars(id);
      C6.bus.emit('licht', { raum: id, quelle: Object.assign({ a: +g_a(id) }, s) });
    },
    hol: function (id) { return Object.assign({}, quelle(id || C6.jetzt)); },
    schatten: function (x, y, hoehePx) {
      var id = C6.jetzt, q = quelle(id), m = masse(id);
      var dx = (x - q.x) * m.w, dy = (y - q.y) * m.h, l = Math.hypot(dx, dy) || 1;
      var len = (hoehePx || 40) * (0.15 + 0.5 * (1 - q.hoehe));
      return { dx: dx / l * len, dy: Math.max(1, Math.abs(dy / l) * len * 0.45), a: 0.08 + 0.2 * q.staerke, laenge: len, winkel: Math.atan2(dy, dx), skala: 1 + 0.6 * (1 - q.hoehe) };
    },
    neu: function (id) { setzeVars(id || C6.jetzt); }
  };
  C6.bus.on('raum', function (id) { setzeVars(id); });
  C6.bus.on('gebaut', function (id) { setzeVars(id); });
  function g_a(id) { var g = gebaut[id]; return g ? (g.el.style.getPropertyValue('--c6-schatten-a') || 0.2) : 0.2; }
  C6.bus.on('geraet', function () {
    Object.keys(gebaut).forEach(setzeVars);
    if (C6.jetzt) C6.bus.emit('licht', { raum: C6.jetzt, quelle: Object.assign({ a: +g_a(C6.jetzt) }, quelle(C6.jetzt)) });
  });
  Object.keys(gebaut).forEach(setzeVars);
})();

/* ---------- Wartezeit: niemand drängt, aber Carl merkt es ----------
   bus 'warte' {stufe 1|2|3, s, raum} einmal je Stufe nach 12/40/120 s ohne Berührung, bus 'wach' bei der nächsten. */
(function () {
  var seit = Date.now(), stufe = 0, STUFEN = [12, 40, 120];
  function wach() {
    var war = stufe;
    seit = Date.now(); stufe = 0;
    if (war) C6.bus.emit('wach', { raum: C6.jetzt, stufe: war });
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (n) { W.addEventListener(n, wach, { passive: true, capture: true }); });
  feld.addEventListener('input', wach);
  ['gesagt', 'chip', 'raum', 'hoehe'].forEach(function (n) { C6.bus.on(n, wach); });
  setInterval(function () {
    if (D.hidden) { seit = Date.now() - Math.min(Date.now() - seit, 11000); return; }
    var s = (Date.now() - seit) / 1000;
    if (stufe < 3 && s >= STUFEN[stufe]) { stufe++; C6.bus.emit('warte', { stufe: stufe, s: STUFEN[stufe - 1], raum: C6.jetzt }); }
  }, 1000);
  C6.warte = { seit: function () { return (Date.now() - seit) / 1000; }, stufe: function () { return stufe; } };
})();

/* ---------- m1 · Platzhalter anderer Partien (bausteine.js / beamer.js ersetzen sie) ---------- */
if (!C6.bausteine) C6.bausteine = { _warten: [], registriere: function (b) { this._warten.push(b); }, katalog: function () { return this._warten.slice(); } };
if (!C6.beamer) C6.beamer = { zeige: function () { return null; }, blaetter: function () { return []; } };
