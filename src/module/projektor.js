// Die Leinwand: Carl zieht sie an einer Schnur von rechts herein.
var C6 = window.C6 = window.C6 || {};
var D = document, W = window;
var ruhig = function () { return !!C6.ruhig; };
function mach(tag, cls, vater) { var e = D.createElement(tag); if (cls) e.className = cls; if (vater) vater.appendChild(e); return e; }
function bus(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) { } }
function geraet() { return (C6.geraet || (W.innerWidth >= 820 ? 'computer' : 'iphone')); }

var P = { offen: false, el: null, platz: null, kette: Promise.resolve(), carl: null, carlVorher: null, nr: 0, rAF: 0 };

function bau() {
  if (P.el) return P.el;
  var el = mach('div', 'c6z-proj');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.innerHTML =
    '<div class="c6z-lw">' +
    '<div class="c6z-lw-stab" aria-hidden="true"><i></i><b></b><span class="c6z-lw-haken"><svg viewBox="0 0 24 70"><path d="M12 0V52" fill="none" stroke="#2b2722" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="58" r="7" fill="#c9a27a" stroke="#2b2722" stroke-width="2"/></svg></span></div>' +
    '<div class="c6z-lw-blatt">' +
    '<div class="c6z-lw-kopf"><button type="button" class="c6z-lw-zu" aria-label="Leinwand einrollen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h2 class="c6z-lw-titel"></h2></div>' +
    '<div class="c6z-lw-inhalt" tabindex="-1"></div>' +
    '</div></div>';
  P.el = el;
  P.lw = el.querySelector('.c6z-lw');
  P.titel = el.querySelector('.c6z-lw-titel');
  P.inhalt = el.querySelector('.c6z-lw-inhalt');
  P.haken = el.querySelector('.c6z-lw-haken');
  el.querySelector('.c6z-lw-zu').addEventListener('click', function () { C6.projektor.zu(); });
  // Schnur, an der Carl zieht (nur während des Ziehens)
  P.schnur = D.createElementNS('http://www.w3.org/2000/svg', 'svg');
  P.schnur.setAttribute('class', 'c6z-schnur');
  P.schnur.setAttribute('aria-hidden', 'true');
  P.schnur.innerHTML = '<path fill="none" stroke="#2b2722" stroke-width="2" stroke-linecap="round"/><circle r="5.5" fill="#c9a27a" stroke="#2b2722" stroke-width="2"/>';
  P.schnurPfad = P.schnur.firstChild; P.knauf = P.schnur.lastChild;
  return el;
}

function fuelle(inhalt) {
  var ziel = P.inhalt;
  while (ziel.firstChild) ziel.removeChild(ziel.firstChild);
  try {
    if (inhalt == null) return;
    if (typeof inhalt === 'function') inhalt(ziel);
    else if (inhalt.nodeType) ziel.appendChild(inhalt);
    else String(inhalt).split(/\n{2,}/).forEach(function (t) { var p = mach('p', 'c6z-lw-absatz', ziel); p.textContent = t; });
  } catch (e) {
    var p = mach('p', 'c6z-lw-absatz', ziel); p.textContent = 'Das konnte ich gerade nicht aufrollen. Versuch es gleich nochmal.';
  }
  ziel.scrollTop = 0;
}

function buehne() {
  var id = C6.jetzt, b = null;
  try { b = C6.gebaut ? C6.gebaut(id) : null; } catch (e) { }
  if (!b && id) b = D.querySelector('.c6-buehne[data-raum="' + id + '"]');
  return b || D.getElementById('c6') || D.body;
}

// Maße der Leinwand und Carls Ziel
function lage() {
  var b = P.platz, br = b.getBoundingClientRect();
  var unten = parseFloat(getComputedStyle(b).getPropertyValue('--c6-unten')) || 140;
  var comp = geraet() === 'computer';
  var links = comp ? Math.round(Math.min(Math.max(br.width * 0.32, 340), 540)) : Math.round(br.width * 0.12);
  var obenPx = comp ? 72 : 128;
  // iPhone: zwischen Leinwand und Dock steht Carl; sind die Antwort-Chips offen, bleibt ein Band von 118 px für ihn und eine kleine Blase
  var chips = !comp && !!(D.getElementById('c6') && D.getElementById('c6').hasAttribute('data-chips'));
  var untenPx = comp ? unten + 12 : unten + (chips ? 118 : 96);
  return { br: br, comp: comp, links: links, oben: obenPx, unten: untenPx, untenRand: unten, chips: chips };
}

function carlZiel(L) {
  var c = C6.carl;
  if (!c || !c.el || !c.el.isConnected || !P.platz.contains(c.el)) return null;
  var r = c.el.getBoundingClientRect();
  if (!r.width) return null;
  var s0 = c.skala || 1, x0 = c.x || 0, y0 = c.y || 0;
  var basisW = r.width / s0, basisH = r.height / s0;
  var basisMitte = r.left + r.width / 2 - x0, basisFuss = r.bottom - y0;
  var zielMitte, zielFuss, s;
  if (L.comp) {
    zielMitte = L.br.left + L.links / 2;
    s = Math.min(1, (L.links * 0.78) / basisW, (L.br.height * 0.46) / basisH);
    zielFuss = Math.min(basisFuss, L.br.bottom - L.untenRand - 18);
  } else {
    s = Math.min(1, 84 / basisH);
    zielMitte = L.br.left + Math.max(basisW * s / 2 + 6, L.links * 0.5 + 18);
    zielFuss = L.br.bottom - L.untenRand - 8;
  }
  return { c: c, x: zielMitte - basisMitte, y: zielFuss - basisFuss, s: s, basisW: basisW, basisH: basisH, basisMitte: basisMitte, basisFuss: basisFuss };
}

// Blattspitze (rechtes Keimblatt) im Bild
function blattSpitze(z, c) {
  var x = c.x || 0, y = c.y || 0, s = c.skala || 1;
  var mitte = z.basisMitte + x, fuss = z.basisFuss + y;
  return { x: mitte + (178 / 240 - 0.5) * z.basisW * s, y: fuss - (1 - 52 / 270) * z.basisH * s };
}

function zurueckEase(u) { var c1 = 1.25, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); }

function zieheHerein(L, Z) {
  return new Promise(function (ok) {
    var weit = L.br.width - L.links + 40;
    var lw = P.lw;
    if (ruhig()) {
      lw.style.transform = 'translate3d(0,0,0)';
      if (Z) Z.c.geh(Z.x, 0, { skala: Z.s, y: Z.y });
      ok(); return;
    }
    lw.style.transform = 'translate3d(' + weit + 'px,0,0)';
    var t0 = performance.now(), comp = L.comp, dauerCarl = comp ? 520 : 400, verz = comp ? 90 : 170, dauer = 520;
    if (Z) {
      try { Z.c.stimmung('zieht'); } catch (e) { }
      Z.c.geh(Z.x, dauerCarl, { skala: Z.s, y: Z.y });
      P.platz.appendChild(P.schnur);
      P.schnur.style.display = '';
    }
    var nr = ++P.nr;
    function bild(t) {
      if (nr !== P.nr) return;
      var u = Math.min(1, Math.max(0, (t - t0 - verz) / dauer));
      var e = zurueckEase(u), x = weit * (1 - e);
      lw.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      if (Z) {
        var sp = blattSpitze(Z, Z.c), br = L.br;
        var rx = br.left + L.links + x + 2, ry = br.top + L.oben + (br.height - L.oben - L.unten) * 0.42;
        var ax = sp.x - br.left, ay = sp.y - br.top, bx = rx - br.left, by = ry - br.top;
        var durch = Math.max(4, 26 - Math.abs(bx - ax) * 0.05);
        P.schnurPfad.setAttribute('d', 'M' + bx.toFixed(1) + ',' + by.toFixed(1) + 'Q' + ((ax + bx) / 2).toFixed(1) + ',' + (Math.max(ay, by) + durch).toFixed(1) + ' ' + ax.toFixed(1) + ',' + ay.toFixed(1));
        P.knauf.setAttribute('cx', ax.toFixed(1)); P.knauf.setAttribute('cy', ay.toFixed(1));
      }
      if (u < 1) P.rAF = requestAnimationFrame(bild);
      else {
        P.rAF = 0;
        // Carl lässt los, die Schnur schnellt zurück an die Stange
        if (Z) {
          P.schnur.style.display = 'none';
          try { Z.c.stimmung('ruhig'); Z.c.huepf && Z.c.huepf(8); } catch (e) { }
        }
        if (P.haken.animate) P.haken.animate([{ transform: 'rotate(28deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(0)' }], { duration: 900, easing: 'ease-out' });
        ok();
      }
    }
    P.rAF = requestAnimationFrame(bild);
  });
}

function rolleZurueck(sofort) {
  return new Promise(function (ok) {
    var lw = P.lw, el = P.el, Z = P.carl;
    P.nr++; if (P.rAF) cancelAnimationFrame(P.rAF); P.rAF = 0;
    if (P.schnur) P.schnur.style.display = 'none';
    function fertig() { if (el && el.parentNode) el.parentNode.removeChild(el); ok(); }
    if (Z && Z.c && !sofort) { setTimeout(function () { try { Z.c.geh(0, ruhig() ? 0 : 560, { skala: 1, y: 0 }); Z.c.stimmung('ruhig'); } catch (e) { } }, ruhig() ? 0 : 160); }
    else if (Z && Z.c) { try { Z.c.geh(0, 0, { skala: 1, y: 0 }); } catch (e) { } }
    if (sofort || ruhig() || !lw.animate) { fertig(); return; }
    var weit = (P.platz ? P.platz.getBoundingClientRect().width : W.innerWidth);
    var a = lw.animate([{ transform: lw.style.transform || 'translate3d(0,0,0)' }, { transform: 'translate3d(-10px,0,0)', offset: 0.18 }, { transform: 'translate3d(' + weit + 'px,0,0)' }], { duration: 420, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
    a.onfinish = function () { lw.style.transform = 'translate3d(' + weit + 'px,0,0)'; try { a.cancel(); } catch (e) { } fertig(); };
  });
}

function handle() {
  return {
    el: P.inhalt,
    inhalt: function (x) { if (P.offen) fuelle(x); return this; },
    titel: function (t) { if (P.offen) P.titel.textContent = t || ''; return this; },
    zu: function () { return C6.projektor.zu(); }
  };
}

function auf(o) {
  o = o || {};
  if (P.offen) {
    // schon offen: nur den Inhalt weich tauschen
    var b = P.lw.querySelector('.c6z-lw-blatt');
    if (b.animate && !ruhig()) b.animate([{ opacity: 1 }, { opacity: 0.25, offset: 0.4 }, { opacity: 1 }], { duration: 320, easing: 'ease-in-out' });
    setTimeout(function () { P.titel.textContent = o.titel || ''; fuelle(o.inhalt); }, ruhig() ? 0 : 130);
    return Promise.resolve(handle());
  }
  var el = bau();
  P.platz = buehne();
  P.offen = true;
  P.raum = C6.jetzt;
  P.titel.textContent = o.titel || '';
  P.el.classList.toggle('c6z-proj-breit', !!o.breit);
  fuelle(o.inhalt);
  var L = lage();
  el.classList.toggle('c6z-proj-computer', L.comp);
  el.style.setProperty('--c6z-links', L.links + 'px');
  el.style.setProperty('--c6z-oben', L.oben + 'px');
  el.style.setProperty('--c6z-unten', L.unten + 'px');
  P.untenJetzt = L.unten;
  P.platz.appendChild(el);
  D.documentElement.classList.add('c6z-proj-auf');
  var Z = null;
  try { Z = carlZiel(L); } catch (e) { Z = null; }
  P.carl = Z;
  bus('projektor', { offen: true });
  return zieheHerein(L, Z).then(function () {
    return handle();
  });
}

function zu(sofort) {
  if (!P.offen) return Promise.resolve();
  P.offen = false;
  bus('projektor', { offen: false });
  var p = rolleZurueck(sofort).then(function () { if (!P.offen) D.documentElement.classList.remove('c6z-proj-auf'); });
  P.carl = null;
  return p;
}

C6.projektor = {
  auf: function (o) { P.kette = P.kette.then(function () { return auf(o); }, function () { return auf(o); }); return P.kette; },
  zu: function () { P.kette = P.kette.then(function () { return zu(false); }, function () { return zu(false); }); return P.kette; },
  bereit: function (o) {
    o = o || {};
    var c = C6.carl;
    try { c && c.stimmung('froh'); } catch (e) { }
    var frage = o.frage || 'Fertig. Willst du’s sehen?';
    try { var st = C6.stimme && C6.stimme.sag && C6.stimme.sag('fertig'); if (!o.frage && st && /\?\s*$/.test(st)) frage = st; } catch (e) { }
    if (typeof C6.frag === 'function') {
      return Promise.resolve(C6.frag(frage, ['Zeig her', 'Später'], { id: 'projektor-bereit' })).then(function (a) {
        try { c && c.stimmung('ruhig'); } catch (e) { }
        if (a === 'Zeig her') return C6.projektor.auf(o);
        return null;
      });
    }
    return C6.projektor.auf(o);
  }
};
Object.defineProperty(C6.projektor, 'offen', { get: function () { return P.offen; } });

// Raumwechsel schließt sofort, Esc rollt ein, Größe ändert die Lage
if (C6.bus) {
  C6.bus.on('raum', function (id) { if (P.offen && id !== P.raum) zu(true); });
  C6.bus.on('hoehe', function () { if (P.offen) zu(true); });
  C6.bus.on('esc', function (ev) { if (P.offen && ev && !ev.erledigt) { ev.erledigt = true; C6.projektor.zu(); } });
}
// Öffnen sich Antwort-Chips (oder ändert sich das Dock), während die Leinwand steht: Leinwand endet höher, Carl rückt nach
function nachmessen() {
  if (!P.offen || !P.el || !P.platz) return;
  var L = lage();
  if (L.unten === P.untenJetzt) return;
  P.untenJetzt = L.unten;
  P.el.style.setProperty('--c6z-unten', L.unten + 'px');
  if (P.carl && P.carl.c && !P.rAF) { try { var Z = carlZiel(L); if (Z) { P.carl = Z; Z.c.geh(Z.x, ruhig() ? 0 : 280, { skala: Z.s, y: Z.y }); } } catch (e) {} }
}
var messUhr = 0;
try {
  var wurzelEl = D.getElementById('c6');
  if (wurzelEl && W.MutationObserver) new MutationObserver(function () {
    if (!P.offen || messUhr) return;
    messUhr = requestAnimationFrame(function () { messUhr = 0; nachmessen(); });
  }).observe(wurzelEl, { attributes: true, attributeFilter: ['style', 'data-chips'] });
} catch (e) {}
var uhr = null;
W.addEventListener('resize', function () {
  if (!P.offen) return;
  clearTimeout(uhr);
  uhr = setTimeout(function () {
    if (!P.offen) return;
    var L = lage();
    P.el.classList.toggle('c6z-proj-computer', L.comp);
    P.el.style.setProperty('--c6z-links', L.links + 'px');
    P.el.style.setProperty('--c6z-unten', L.unten + 'px');
    P.untenJetzt = L.unten;
    if (P.carl && P.carl.c) { P.carl.c.geh(0, 0, { skala: 1, y: 0 }); var Z = carlZiel(L); if (Z) { P.carl = Z; Z.c.geh(Z.x, 200, { skala: Z.s, y: Z.y }); } }
  }, 160);
});
