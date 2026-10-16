// Das Freundschaftsbuch: das Verzeichnis des Ganzen. Vorn der Inhalt; Du, Carl, Damals; was ich kann und für dich tue;
// was ich von dir weiß und wer mitdenkt; wo du mich erreichst und wer bei uns was darf.
// Alles bleibt auf diesem Gerät. Kein Schlüssel, kein Passwort, kein Token wird je abgefragt.
var C6 = window.C6 = window.C6 || {};
var D = document;

function S() { return C6.S || (C6.S = {}); }
function A() {
  var s = S();
  if (!s.atlas || typeof s.atlas !== 'object') s.atlas = {};
  var a = s.atlas;
  if (!a.du || typeof a.du !== 'object') a.du = {};
  if (!Array.isArray(a.briefe)) a.briefe = [];
  if (!a.geraet || typeof a.geraet !== 'object') a.geraet = {};
  if (!a.schritte || typeof a.schritte !== 'object') a.schritte = {};
  return a;
}
function aendern(fn) { if (typeof C6.aendern === 'function') C6.aendern(function () { fn(A()); }); else fn(A()); }
var spT = 0;
function bald(fn) { fn(A()); clearTimeout(spT); spT = setTimeout(function () { aendern(function () {}); }, 400); }
function mk(tag, cls, vater, txt) { var e = D.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; if (vater) vater.appendChild(e); return e; }
function stimme(k, fallback) { try { return (C6.stimme && C6.stimme.sag(k)) || fallback; } catch (e) { return fallback; } }
function ruhig() { return !!C6.ruhig; }
var MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
function datum(ts) { var d = new Date(ts); return d.getDate() + '. ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }
function du() { return S().du || {}; }
function carlName() { return du().carlName || 'Carl'; }

// ---------- Ebene einmal bauen ----------
var E = null, offen = false, seite = 0, seiten = [], ctlBild = null;
function bau() {
  if (E) return E;
  var r = mk('div', 'c6r-at', D.body);
  r.id = 'c6r-atlas'; r.hidden = true;
  r.setAttribute('role', 'dialog'); r.setAttribute('aria-modal', 'true'); r.setAttribute('aria-label', 'Unser Buch');
  r.setAttribute('data-c6-kein-wisch', '');
  r.innerHTML =
    '<div class="c6r-at-grund" aria-hidden="true"></div>' +
    '<div class="c6r-at-buch"><div class="c6r-at-deckel" aria-hidden="true"></div><div class="c6r-at-seiten"></div><div class="c6r-at-blatt" aria-hidden="true"></div><nav class="c6r-at-reiter" aria-label="Kapitel"></nav></div>' +
    '<button type="button" class="c6r-at-zu" aria-label="Buch schließen">✕</button>' +
    '<div class="c6r-at-liste" hidden></div>' +
    '<div class="c6r-at-fuss"><button type="button" class="c6r-at-zur" aria-label="Zurückblättern">‹</button><span class="c6r-at-nr" aria-live="polite"></span><button type="button" class="c6r-at-vor" aria-label="Weiterblättern">›</button></div>';
  var q = function (c) { return r.querySelector(c); };
  r.querySelector('.c6r-at-buch').tabIndex = -1;
  E = { r: r, grund: q('.c6r-at-grund'), buch: q('.c6r-at-buch'), seiten: q('.c6r-at-seiten'), blatt: q('.c6r-at-blatt'), zu: q('.c6r-at-zu'), zur: q('.c6r-at-zur'), vor: q('.c6r-at-vor'), nr: q('.c6r-at-nr'), liste: q('.c6r-at-liste') };
  E.zu.onclick = zu; E.grund.onclick = function () { if (!E.liste.hidden) listeZu(); else zu(); };
  // Tipp neben das Buch (auf die Hülle selbst, nicht nur auf den Grund) schließt es auch
  r.addEventListener('click', function (e) { if (e.target === r) { if (!E.liste.hidden) listeZu(); else zu(); } });
  E.zur.onclick = function () { blaettere(-1); };
  E.vor.onclick = function () { blaettere(1); };
  REITER.forEach(function (x) {
    var b = mk('button', 'c6r-at-reit', q('.c6r-at-reiter'), x[1]); b.type = 'button'; b.dataset.id = x[0];
    b.style.setProperty('--reit', x[2]);
    b.onclick = function () { listeZu(); geheZu(x[0]); };
  });
  E.reiter = [].slice.call(r.querySelectorAll('.c6r-at-reit'));
  E.buch.addEventListener('pointerdown', listeZu);
  // eigene Gesten: nichts davon erreicht den Raum dahinter
  ['pointerdown', 'pointermove', 'pointerup', 'touchstart', 'touchmove', 'touchend', 'wheel'].forEach(function (n) { r.addEventListener(n, function (e) { e.stopPropagation(); }, { passive: true }); });
  // Blatt mit dem Finger (oder der Maus) fassen und ziehen
  var zg = null;
  E.seiten.addEventListener('pointerdown', function (e) {
    if (e.button > 0 || e.target.closest('input,textarea,button,a,select')) { zg = null; return; }
    var b = E.seiten.getBoundingClientRect();
    zg = { id: e.pointerId, x: e.clientX, y: e.clientY, an: false, oben: e.clientY - b.top < b.height / 3, nurTipp: !!(dreh && dreh.K && !dreh.zieht) };
  });
  E.seiten.addEventListener('pointermove', function (e) {
    if (!zg || e.pointerId !== zg.id || zg.nurTipp) return;
    var dx = e.clientX - zg.x, dy = e.clientY - zg.y;
    if (!zg.an) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.2) { if (Math.abs(dy) > 16) zg = null; return; }
      var rr = dx < 0 ? 1 : -1, ziel = seite + rr * proAnsicht();
      if (ziel < 0 || ziel >= REIHE.length) { zg = null; wackel(rr); return; }
      if (ruhig()) { zg = null; zeige(ziel, rr); return; }
      try { E.seiten.setPointerCapture(e.pointerId); } catch (x) {}
      zeige(ziel, rr, { zieh: true, oben: zg.oben });
      if (!dreh || !dreh.K) { zg = null; return; }
      dreh.zieht = true;
      zg.an = true; zg.K = dreh.K; zg.x0 = e.clientX; zg.y0 = e.clientY; zg.P0 = zg.K.P.slice(); zg.vx = 0; zg.lt = e.timeStamp; zg.lx = e.clientX;
    }
    if (!dreh || dreh.K !== zg.K) { zg = null; return; }
    var g = zg.K.doppel ? 1 : 1.7;
    zg.K.setze([zg.P0[0] + (e.clientX - zg.x0) * g, zg.P0[1] + (e.clientY - zg.y0) * 0.7]);
    var dt = Math.max(1, e.timeStamp - zg.lt); zg.vx = 0.6 * zg.vx + 0.4 * (e.clientX - zg.lx) / dt; zg.lt = e.timeStamp; zg.lx = e.clientX;
  });
  var los = function (e) {
    if (!zg || e.pointerId !== zg.id) return;
    var z = zg; zg = null;
    if (z.an && dreh && dreh.K === z.K) { dreh.zieht = false; z.K.loslassen(e.timeStamp - z.lt > 140 ? 0 : z.vx); return; }
    // ein Tipp auf den Seitenrand blättert sofort
    if (!z.an && e.type === 'pointerup' && Math.abs(e.clientX - z.x) < 10 && Math.abs(e.clientY - z.y) < 10) {
      var b = E.seiten.getBoundingClientRect(), rand = Math.min(56, b.width * 0.12);
      if (e.clientX > b.right - rand) blaettere(1); else if (e.clientX < b.left + rand) blaettere(-1);
    }
  };
  E.seiten.addEventListener('pointerup', los);
  E.seiten.addEventListener('pointercancel', los);
  // frisch Geschriebenes: die Tinte ist erst blau und nass, dann trocknet sie
  r.addEventListener('change', function (e) {
    var t = e.target; if (!t || !t.matches || !t.matches('input[type="text"],input:not([type]),textarea') || ruhig()) return;
    if (!String(t.value || '').trim()) return;
    t.classList.remove('c6r-at-tinte'); void t.offsetWidth; t.classList.add('c6r-at-tinte');
  });
  window.addEventListener('keydown', function (e) {
    if (!offen) return;
    var feld = e.target && e.target.closest && e.target.closest('input,textarea');
    if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); zu(); }
    else if (!feld && e.key === 'ArrowRight') { e.preventDefault(); blaettere(1); }
    else if (!feld && e.key === 'ArrowLeft') { e.preventDefault(); blaettere(-1); }
  }, true);
  addEventListener('resize', function () { if (offen) zeige(seite, 0); });
  return E;
}
function breit() { return innerWidth >= 820; }

// ---------- Seiten ----------
function feld(vater, label, wert, setze, o) {
  o = o || {};
  var l = mk('label', 'c6r-at-zeile c6r-at-zeile-hand', vater);
  if (label) mk('span', 'c6r-at-frage', l, label);
  var i = mk(o.lang ? 'textarea' : 'input', 'c6r-at-feld c6r-at-hand', l);
  if (!o.lang) i.type = 'text';
  i.setAttribute('aria-label', label || o.aria || '');
  i.maxLength = o.max || 80; i.value = wert || ''; i.setAttribute('autocomplete', 'off');
  if (o.platz) i.placeholder = o.platz;
  if (o.lang) i.rows = 2;
  i.addEventListener('input', function () { var v = i.value; clearTimeout(i._t); i._t = setTimeout(function () { duAendern(function (d) { setze(d, v); }); }, 300); });
  return i;
}
function kopf(p, titel, unter) {
  mk('h2', 'c6r-at-titel', p, titel);
  if (unter) mk('p', 'c6r-at-unter', p, unter);
}
function duAendern(fn) { if (typeof C6.aendern === 'function') C6.aendern(function () { var s = S(); if (!s.du || typeof s.du !== 'object') s.du = {}; fn(s.du); }); else { var s = S(); s.du = s.du || {}; fn(s.du); } }
function schreibt(el, t) { el.textContent = ''; var s = mk('span', 'c6r-at-handlauf', el, t); if (!ruhig()) { s.style.animation = 'none'; void s.offsetWidth; s.style.animation = ''; } }

// Mein Sprachmodell: eigene kleine Zeichen, keine Logos; die Namen stehen nur als Text da
var MODELLE = [
  ['claude', 'Claude', '<path d="M36 8c-12 2-20 12-22 26l-4 6" fill="none"/><path d="M36 8c-2 10-8 18-18 22" fill="none"/><path d="M14 34l8-10M20 30l6-7" fill="none"/>',
    'Mit Claude denke ich in diesem Prototyp schon mit, wenn die Seite es erlaubt.'],
  ['chatgpt', 'ChatGPT', '<path d="M8 12h32v20H22l-8 7v-7H8z"/><path d="M15 20h18M15 26h11" fill="none"/>',
    'ChatGPT merke ich mir. Verbinden kann ich mich damit im Prototyp noch nicht.'],
  ['gemini', 'Gemini', '<circle cx="18" cy="24" r="10"/><circle cx="30" cy="24" r="10" fill="none"/>',
    'Gemini merke ich mir. Verbinden kann ich mich damit im Prototyp noch nicht.'],
  ['lokal', 'Auf meinem Rechner', '<path d="M8 24L24 10l16 14v16H8z"/><path d="M20 40V30h8v10" fill="none"/>',
    'Ein Modell auf deinem Rechner: Dann bleibt alles bei dir.']
];
function modellSvg(m, an) { return '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="' + (an ? '#f6d9a8' : '#fffaf0') + '" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + m[2] + '</g></svg>'; }
// Für alle, die mitdenken: welcher Kopf gewählt ist und was Carl dazu ehrlich sagt
function modellInfo() {
  var m = MODELLE.filter(function (x) { return x[0] === du().modell; })[0];
  if (!m) return null;
  var lk = m[0] === 'lokal' ? lokalStatus() : null, lokalAn = !!(lk && lk.an && lk.modell);
  return { id: m[0], name: m[1], verbunden: m[0] === 'claude' || lokalAn, satz: m[0] === 'claude' ? 'Ich denke mit Claude mit.' : lokalAn ? 'Ich denke mit deinem Rechner mit (' + lk.modell + ').' : m[0] === 'lokal' ? 'Dein eigenes Modell ist noch nicht eingerichtet. Ich denke hier mit Claude mit.' : 'Mit ' + m[1] + ' bin ich noch nicht verbunden. Ich denke hier mit Claude mit.' };
}
var denkenStand = null;
function pruefeDenken() {
  if (denkenStand !== null) return Promise.resolve(denkenStand);
  return Promise.resolve().then(function () { return window.claude && window.claude.use ? window.claude.use('sample') : null; })
    .then(function (f) { denkenStand = typeof f === 'function'; return denkenStand; }, function () { denkenStand = false; return false; });
}
// Die eine Ton-Wahl: dieselben Wörter wie überall (Quelle: C6.stimme.wahl.ton)
function toene() {
  var w = C6.stimme && C6.stimme.wahl && C6.stimme.wahl.ton;
  return Array.isArray(w) && w.length ? w : [['warm', 'Warm'], ['trocken', 'Trocken, mit Witz'], ['ehrlich', 'Ehrlich, auch wenn’s piekst']];
}
function tonName(v) { var t = toene().filter(function (x) { return x[0] === v; })[0]; return t ? t[1] : v; }

var BAU = {};
// 1 · Du
BAU.du = function (p) {
  kopf(p, 'Du', null);
  var d = du();
  feld(p, 'Dein Name', d.name, function (x, v) { x.name = v; }, { max: 40 });
  feld(p, 'Was du machst', d.arbeit, function (x, v) { x.arbeit = v; }, { max: 120, lang: true });
  mk('p', 'c6r-at-frage', p, 'Woran du baust');
  var sp = [];
  try { sp = (C6.space && C6.space.alle) ? C6.space.alle() : faedenRoh().map(function (f) { return { stringId: f.id, titel: f.titel, farbe: f.farbe }; }); } catch (e) { sp = []; }
  if (!sp.length) mk('p', 'c6r-at-carlschrift c6r-at-leer', p, 'Noch kein Space. Sag mir einen Gedanken.');
  else {
    var ul = mk('ul', 'c6r-at-baut', p); ul.setAttribute('aria-label', 'Deine Spaces');
    sp.slice(0, 8).forEach(function (x) {
      var li = mk('li', null, ul), b = mk('button', 'c6r-at-baut-link', li); b.type = 'button';
      var punkt = mk('i', null, b); punkt.style.background = x.farbe || '#2f5f8a';
      mk('span', 'c6r-at-duschrift', b, x.titel);
      b.setAttribute('aria-label', x.titel + ': Space öffnen');
      b.onclick = function () { zuSpace(x.stringId); };
    });
    if (sp.length > 8) mk('li', 'c6r-at-baut-mehr', ul, 'und ' + (sp.length - 8) + ' weitere');
  }
  var start = (S().rundgang && S().rundgang.start) || A().gesehen;
  if (start) mk('p', 'c6r-at-seit', p, 'Unser Buch, angefangen am ' + datum(start));
};
// 2 · Carl
BAU.carl = function (p) {
  kopf(p, carlName(), null);
  var foto = mk('div', 'c6r-at-foto c6r-at-kleb', p);
  var bild = mk('div', 'c6r-at-fotobild', foto);
  mk('span', 'c6r-at-ecke c6r-at-ecke1', foto); mk('span', 'c6r-at-ecke c6r-at-ecke2', foto);
  try { ctlBild = C6.figur && C6.figur.male ? C6.figur.male(bild, { groesse: 112 }) : null; if (ctlBild) { ctlBild.stimmung && ctlBild.stimmung('froh'); var so = du().socken; if (so && ctlBild.kleid) ctlBild.kleid({ socken: { farbe: so } }); } } catch (e) { ctlBild = null; }
  var dl = mk('dl', 'c6r-at-carl', p);
  [['Ich bin', 'ein Kiesel mit zwei Keimblättern'], ['Das kann ich gut', 'zuhören, nichts vergessen'], ['Davon träume ich', 'dass deine Spaces Sternbilder werden']]
    .forEach(function (z, k) { mk('dt', null, dl, z[0]); var dd = mk('dd', 'c6r-at-carlschrift', dl); var s = mk('span', 'c6r-at-handlauf', dd, z[1]); s.style.animationDelay = (0.35 + k * 0.3) + 's'; });
  feld(p, 'So nennst du mich', du().carlName, function (x, v) { if (v.trim()) x.carlName = v.trim(); else delete x.carlName; }, { max: 24, platz: 'Carl' });
  // So soll ich klingen: eine Wahl
  mk('p', 'c6r-at-frage', p, 'So soll ich klingen');
  var reihe = mk('div', 'c6r-at-toene', p); reihe.setAttribute('role', 'radiogroup'); reihe.setAttribute('aria-label', 'So soll ich klingen');
  var liste = toene().slice(), jetzt = du().ton;
  if (jetzt && !liste.some(function (x) { return x[0] === jetzt; })) liste.push([jetzt, jetzt]);
  var knoepfe = liste.map(function (t) {
    var b = mk('button', 'c6r-at-ton', reihe); b.type = 'button'; b.setAttribute('role', 'radio');
    mk('span', 'c6r-at-ton-rund', b); mk('span', null, b, t[1]);
    b.setAttribute('aria-checked', jetzt === t[0] ? 'true' : 'false');
    b.onclick = function () {
      duAendern(function (d) { d.ton = t[0]; });
      knoepfe.forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
    };
    return b;
  });
  mk('p', 'c6r-at-carlschrift c6r-at-versprechen', p, 'Du bringst den Samen, ich helfe ihm wachsen. Ändern, löschen, teilen nur mit deinem Ja.');
};
// 3 · Damals, mit unserem Jahr
function momente() {
  var s = S(), r = [], fd = {};
  var faeden = (C6.strings && C6.strings.alle) ? C6.strings.alle() : (s.strings || []);
  faeden.forEach(function (f) { if (f && f.id) fd[f.id] = f; });
  var erste = (s.gespraech || []).filter(function (z) { return z && z.von === 'du' && !z.chip && z.t && String(z.t).trim().length > 1; })
    .sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); })[0];
  if (erste) r.push({ art: 'erste', was: 'Deine ersten Worte an mich', t: erste.t, ts: erste.ts || 0 });
  var f0 = faeden.filter(function (f) { return f && f.erstellt; }).sort(function (a, b) { return a.erstellt - b.erstellt; })[0];
  if (f0) r.push({ art: 'faden', was: 'Unser erster Space', t: f0.titel, ts: f0.erstellt, farbe: f0.farbe, sid: f0.id });
  var kern = {};
  (s.nadeln || []).forEach(function (n) { if (n && n.satz) { kern[n.satz] = 1; r.push({ art: 'kern', was: 'Kernsatz' + (fd[n.stringId] ? ' · ' + fd[n.stringId].titel : ''), t: n.satz, ts: n.ts || 0, sid: fd[n.stringId] ? n.stringId : null }); } });
  var sp = s.spaces || {};
  Object.keys(sp).forEach(function (sid) { var k = sp[sid] && sp[sid].kern; if (k && !kern[k] && fd[sid]) r.push({ art: 'kern', was: 'Kernsatz · ' + fd[sid].titel, t: k, ts: sp[sid].kernTs || sp[sid].besucht || fd[sid].erstellt || 0, sid: sid }); });
  (s.knoten || []).forEach(function (k) {
    var a = fd[k.a], b = fd[k.b]; if (!a || !b) return;
    r.push({ art: 'knoten', was: 'Sternbild · ' + a.titel + ' und ' + b.titel, t: k.satz || '', ts: k.ts || 0, farbe: a.farbe, farbe2: b.farbe, sid: a.id });
  });
  faeden.forEach(function (f) {
    if (!f || f.art === 'gewohnheit') return;
    // nur wirklich geschaffte nächste Schritte; Zettel und Funde sind keine Momente
    (f.perlen || []).forEach(function (p) { var m = p && p.t && /^Geschafft: (.+)$/.exec(p.t); if (m) r.push({ art: 'perle', was: 'Geschafft · ' + f.titel, t: m[1], ts: p.ts || 0, farbe: f.farbe, sid: f.id }); });
  });
  var kopfteil = r.filter(function (x) { return x.art === 'erste'; });
  var rest = r.filter(function (x) { return x.art !== 'erste'; }).sort(function (a, b) { return a.ts - b.ts; });
  return kopfteil.concat(rest);
}
var MON3 = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
var PUNKT = { erste: '#e3b23c', faden: '#2f5f8a', kern: '#d62a26', knoten: '#6b5aa0', perle: '#8ea37a' };
var DAMALS_MAX = 7;
BAU.damals = function (p) {
  kopf(p, 'Damals', null);
  var alle = momente();
  if (!alle.length) { mk('p', 'c6r-at-carlschrift c6r-at-leer', p, 'Noch leer. Dein erster Satz an mich kommt hierher.'); return; }
  var jetzt = new Date(), y = jetzt.getFullYear(), heute = jetzt.getMonth();
  // unser Jahr: zwölf Monate, jeder Punkt ein Moment; ein Tipp zeigt nur diesen Monat
  var jahr = mk('div', 'c6r-at-jahr2', p); jahr.setAttribute('role', 'group'); jahr.setAttribute('aria-label', 'Unser Jahr ' + y);
  var nach = {};
  alle.forEach(function (x) { if (!x.ts) return; var d = new Date(x.ts); if (d.getFullYear() === y) (nach[d.getMonth()] = nach[d.getMonth()] || []).push(x); });
  var ul = mk('ul', 'c6r-at-momente', p), gewaehlt = -1, mk2 = [];
  for (var m = 0; m < 12; m++) (function (m) {
    var b = mk('button', 'c6r-at-mo2' + (m > heute ? ' c6r-at-mo-spaeter' : '') + (m === heute ? ' c6r-at-mo-jetzt' : ''), jahr); b.type = 'button';
    mk('span', 'c6r-at-mo-name', b, MON3[m]);
    var pk = mk('span', 'c6r-at-mo-punkte', b);
    (nach[m] || []).slice(0, 9).forEach(function (x) { var i = mk('i', null, pk); i.style.background = x.farbe || PUNKT[x.art] || '#8a8378'; });
    b.setAttribute('aria-label', MON[m] + ' ' + y + ', ' + (nach[m] || []).length + ' Momente');
    b.setAttribute('aria-pressed', 'false');
    b.disabled = !(nach[m] || []).length;
    b.onclick = function () { gewaehlt = gewaehlt === m ? -1 : m; mk2.forEach(function (x, i) { x.setAttribute('aria-pressed', i === gewaehlt ? 'true' : 'false'); }); male(); };
    mk2.push(b);
  })(m);
  var seit = A().damalsTs || 0;
  p._dann = function () { aendern(function (a) { a.damalsTs = Date.now(); }); };
  function male() {
    ul.textContent = '';
    var liste = gewaehlt < 0 ? alle : (nach[gewaehlt] || []);
    var zeig = gewaehlt < 0 && liste.length > DAMALS_MAX ? [liste[0]].concat(liste.slice(-(DAMALS_MAX - 1))) : liste;
    var nr = 0;
    zeig.forEach(function (x, i) {
      if (gewaehlt < 0 && i === 1 && liste.length > DAMALS_MAX) mk('li', 'c6r-at-mehr c6r-at-carlschrift', ul, '… und ' + (liste.length - DAMALS_MAX) + ' Momente dazwischen');
      var li = mk('li', 'c6r-at-moment c6r-at-m-' + x.art, ul);
      if (!seit || (x.ts || 0) > seit) { li.classList.add('c6r-at-kleb'); li.style.animationDelay = (0.15 + nr++ * 0.16) + 's'; }
      if (x.farbe) li.style.setProperty('--m-farbe', x.farbe);
      if (x.farbe2) li.style.setProperty('--m-farbe2', x.farbe2);
      mk('span', 'c6r-at-klebe', li);
      var k = mk('p', 'c6r-at-m-kopf', li);
      mk('span', 'c6r-at-m-was', k, x.was);
      if (x.ts) mk('span', 'c6r-at-m-wann c6r-at-duschrift', k, datum(x.ts));
      if (x.t) mk('p', 'c6r-at-m-text c6r-at-duschrift', li, x.art === 'faden' ? x.t : '„' + x.t + '“');
      if (x.sid && (S().spaces || {})[x.sid]) {
        li.classList.add('c6r-at-m-geht'); li.tabIndex = 0; li.setAttribute('role', 'button'); li.setAttribute('aria-label', x.was + ': in den Space gehen');
        li.onclick = function () { zuSpace(x.sid); };
        li.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zuSpace(x.sid); } };
      }
    });
  }
  male();
};
function faedenRoh() { var s = S(); return ((C6.strings && C6.strings.alle) ? C6.strings.alle() : (s.strings || [])).filter(function (f) { return f && f.id && f.titel; }); }
function zuSpace(sid) { zu(); setTimeout(function () { try { if (C6.space && C6.space.oeffne) C6.space.oeffne(sid); else C6.geh('space', { string: sid }); } catch (e) {} }, ruhig() ? 0 : 320); }

// 4 · Was ich von dir weiß: alles sehen, mitnehmen, vergessen
var DU_FELDER = [['name', 'Dein Name'], ['carlName', 'So nennst du mich'], ['arbeit', 'Was du machst'], ['baut', 'Früher notiert: Woran du baust'], ['ton', 'So soll ich klingen'], ['tun', 'Wobei ich helfen darf'], ['nie', 'Was ich nie tun soll'], ['modell', 'Mein Sprachmodell'], ['socken', 'Meine Sockenfarbe']];
var NICHT_KORRIGIEREN = { ton: 1, modell: 1, socken: 1 }; // dafür gibt es eine eigene Wahl
function wertText(k, v) {
  if (Array.isArray(v)) return v.filter(function (x) { return x && String(x).trim(); }).join(' · ');
  if (k === 'ton') return tonName(v);
  if (k === 'modell') { var m = MODELLE.filter(function (x) { return x[0] === v; })[0]; if (v === 'lokal') { var lk = lokalStatus(); return lk.an && lk.modell ? 'Dein Rechner (' + lk.modell + ')' : 'Dein Rechner, noch nicht eingerichtet'; } return m ? m[1] : v; }
  return v == null ? '' : String(v);
}
// Ottos Richtigstellungen (C6.fest, im Kern): gelten vor allem anderen
function festHol(k) {
  try { if (!C6.fest || !C6.fest.hol) return null; var f = C6.fest.hol(k); if (f == null) return null; if (typeof f === 'object') return f.weg ? null : (f.wert != null ? String(f.wert) : null); return String(f); } catch (e) { return null; }
}
function festAlle() { try { return (C6.fest && C6.fest.alle) ? (C6.fest.alle() || []).filter(function (x) { return x && !x.weg; }) : []; } catch (e) { return []; } }
function spaceTitel(sid) { var f = faedenRoh().filter(function (x) { return x.id === sid; })[0]; return f ? f.titel : null; }
function giltText(g) {
  if (!g || g === 'du') return 'gilt für dich';
  var m = /^space:(.+)$/.exec(g); if (m) return 'gilt für „' + (spaceTitel(m[1]) || 'einen Space') + '“';
  m = /^werkzeug:(.+)$/.exec(g);
  if (m) { var n = m[1]; try { var w = C6.geruest && C6.geruest.hol ? C6.geruest.hol(m[1]) : null; if (w && (w.name || w.titel)) n = w.name || w.titel; } catch (e) {} return 'gilt für das Werkzeug „' + n + '“'; }
  return 'gilt für ' + g;
}
var STARTWERT = { carlName: 'Carl' };
// Sockenfarbe als Wort (die Farbe selbst steht als Punkt davor)
var FARBNAMEN = { rot: '#c8463d', orange: '#e0813a', gelb: '#e2b93b', 'grün': '#6f9a5b', 'türkis': '#3fa3a0', hellblau: '#8db4d6', blau: '#4f7cac', dunkelblau: '#2f4b7c', lila: '#8a6bb0', rosa: '#e39aae', pink: '#d96a95', braun: '#8a5f3f', beige: '#d8c3a0', grau: '#9a948b', schwarz: '#2f2b28', 'weiß': '#f3efe8' };
function farbHex(v) { v = String(v || '').trim(); if (/^#[0-9a-f]{6}$/i.test(v)) return v; return FARBNAMEN[v.toLowerCase()] || null; }
function farbWort(v) {
  var h = farbHex(v); if (!h) return String(v || '');
  if (!/^#/.test(String(v))) return String(v).charAt(0).toUpperCase() + String(v).slice(1);
  var n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, best = null, bd = 1e9;
  Object.keys(FARBNAMEN).forEach(function (k) { var m = parseInt(FARBNAMEN[k].slice(1), 16), d = Math.pow(r - (m >> 16), 2) + Math.pow(g - ((m >> 8) & 255), 2) + Math.pow(b - (m & 255), 2); if (d < bd) { bd = d; best = k; } });
  return best.charAt(0).toUpperCase() + best.slice(1);
}
// vor dem Vergessen merken, was es war, damit „Zurückholen“ geht
function merkVorher(x) {
  var s = S(), id = x.id || '', alt = null;
  try {
    if (id.indexOf('du:') === 0) alt = JSON.stringify((s.du || {})[id.slice(3)]);
    else if (id === 'gespraech') alt = JSON.stringify(s.gespraech || []);
    else if (id === 'atlas-alt') alt = JSON.stringify(s.atlas || {});
  } catch (e) {}
  var fest = null; try { fest = x.key && C6.fest && C6.fest.hol ? C6.fest.hol(x.key) : null; } catch (e) {}
  return function () {
    C6.aendern(function (st) {
      if (alt == null) return;
      var v = JSON.parse(alt);
      if (id.indexOf('du:') === 0) { st.du = st.du || {}; if (v !== undefined) st.du[id.slice(3)] = v; }
      else if (id === 'gespraech') st.gespraech = v;
      else if (id === 'atlas-alt') st.atlas = Object.assign(st.atlas || {}, v);
    });
    try { if (fest && !fest.weg && C6.fest.setze) C6.fest.setze(x.key, typeof fest === 'object' ? fest.wert : fest, { gilt: (fest && fest.gilt) || x.gilt || 'du', herkunft: 'du' }); } catch (e) {}
  };
}
var HERKUNFT = { du: 'von dir', fest: 'von dir richtiggestellt', fund: 'aus einem Fund', carl: 'von Carl vermutet', vor: 'voreingestellt' };
function istFund(n) { return !!n && (n.von === 'fund' || n.fund === true || /^Fund · /.test(n.t || '')); }
// Alles, was Carl weiß, mit Herkunft und Gültigkeit
function wissen() {
  var s = S(), d = s.du || {}, w = [], gesehen = {};
  DU_FELDER.forEach(function (f) {
    var key = 'du.' + f[0], fest = festHol(key), t = fest != null ? fest : wertText(f[0], d[f[0]]);
    if (!t || !String(t).trim()) return;
    gesehen[key] = 1;
    var her = fest != null ? 'fest' : (STARTWERT[f[0]] && String(d[f[0]]) === STARTWERT[f[0]]) ? 'vor' : 'du';
    var e = { gruppe: 'du', id: 'du:' + f[0], key: key, name: f[1], t: t, herkunft: her, gilt: 'du', korr: !NICHT_KORRIGIEREN[f[0]], feld: f[0] };
    if (f[0] === 'socken') { e.farbe = farbHex(d.socken); e.t = farbWort(d.socken); }
    w.push(e);
  });
  var sp = s.spaces || {};
  faedenRoh().forEach(function (f) {
    var x = sp[f.id] || {}, g = 'space:' + f.id;
    var kk = 'space:' + f.id + '.kern', kf = festHol(kk), kern = kf != null ? kf : x.kern;
    gesehen[kk] = 1;
    if (kern) w.push({ gruppe: 'space', key: kk, name: 'Kernsatz in „' + f.titel + '“', t: '„' + kern + '“', roh: kern, herkunft: kf != null ? 'fest' : 'du', gilt: g, giltImNamen: true, korr: true, sid: f.id, feld: 'kern' });
    var fz = (x.notizen || []).filter(istFund);
    if (fz.length) w.push({ gruppe: 'space', name: 'Zettel aus Funden in „' + f.titel + '“', t: fz.length === 1 ? 'ein Zettel' : fz.length + ' Zettel', herkunft: 'fund', gilt: g, giltImNamen: true });
    var eigene = (x.notizen || []).length - fz.length + (x.dinge || []).length;
    if (!kern && !fz.length) w.push({ gruppe: 'space', name: f.titel, t: eigene ? (eigene === 1 ? 'ein Zettel' : eigene + ' Zettel') + ', noch ohne Kernsatz' : 'noch leer', herkunft: 'du', gilt: g, giltImNamen: true });
  });
  // Funde aus dem Lesesaal; wo Carl sie eingeordnet hat, ist das seine Vermutung
  ((s.lesesaal && s.lesesaal.funde) || []).slice(-6).forEach(function (f) {
    if (!f) return;
    w.push({ gruppe: 'fund', name: f.titel || f.url || 'Ein Fund', t: f.notiz || (f.url ? f.url : (f.datei && f.datei.name) || ''), herkunft: 'fund', gilt: f.sid ? 'space:' + f.sid : 'du' });
    if (f.satz && f.wie === 'denk') {
      var vk = 'fund:' + (f.id || f.titel) + '.satz', vf = festHol(vk);
      gesehen[vk] = 1;
      w.push({ gruppe: 'fund', key: vk, name: 'Dazu habe ich gedacht', t: vf != null ? vf : f.satz, herkunft: vf != null ? 'fest' : 'carl', gilt: f.sid ? 'space:' + f.sid : 'du', korr: true });
    }
  });
  // weitere Richtigstellungen (z. B. aus Werkzeugen), die oben nicht vorkommen
  festAlle().forEach(function (x) {
    if (!x.schluessel || gesehen[x.schluessel]) return;
    w.push({ gruppe: 'fest', key: x.schluessel, name: x.schluessel.replace(/^[^.]*\./, '').replace(/^du$/, 'über dich'), t: String(x.wert), herkunft: 'fest', gilt: x.gilt || 'du', korr: true, nurFest: true });
  });
  var saetze = (s.gespraech || []).filter(function (z) { return z && z.von === 'du' && !z.chip && z.t; }).length;
  if (saetze) w.push({ gruppe: 'gespraech', id: 'gespraech', name: 'Was du mir gesagt hast', t: saetze === 1 ? 'ein Satz' : saetze + ' Sätze', herkunft: 'du', gilt: 'du' });
  var a = s.atlas || {}, alt = 0;
  ['briefe', 'plaene'].forEach(function (k) { if (Array.isArray(a[k])) alt += a[k].length; });
  ['lieb', 'jahr', 'geraet'].forEach(function (k) { if (a[k] && typeof a[k] === 'object') alt += Object.keys(a[k]).filter(function (q) { return a[k][q]; }).length; });
  if (Array.isArray(a.mag)) alt += a.mag.filter(Boolean).length;
  if (alt) w.push({ gruppe: 'alt', id: 'atlas-alt', name: 'Ältere Buchseiten', t: alt === 1 ? 'ein Eintrag' : alt + ' Einträge', herkunft: 'du', gilt: 'du' });
  return w;
}
// Stimmt so nicht: Ottos Fassung wird fest (gewinnt immer) und gilt sofort auch im Zustand
function richtigstellen(x, wert) {
  wert = String(wert || '').trim(); if (!wert) return;
  try { if (C6.fest && C6.fest.setze && x.key) C6.fest.setze(x.key, wert, { gilt: x.gilt || 'du', herkunft: 'du' }); } catch (e) {}
  C6.aendern(function (s) {
    if (x.gruppe === 'du' && x.feld) { s.du = s.du || {}; s.du[x.feld] = (x.feld === 'tun' || x.feld === 'nie') ? wert.split(/\s*·\s*/).filter(Boolean) : wert; }
    else if (x.sid && x.feld === 'kern' && s.spaces && s.spaces[x.sid]) { s.spaces[x.sid].kern = wert; s.spaces[x.sid].kernTs = Date.now(); }
  });
}
function vergiss(x) {
  try { if (x.key && C6.fest && C6.fest.weg && festHol(x.key) != null) C6.fest.weg(x.key); } catch (e) {}
  var id = x.id || '';
  C6.aendern(function (s) {
    if (id.indexOf('du:') === 0) { if (s.du) delete s.du[id.slice(3)]; }
    else if (id === 'gespraech') s.gespraech = (s.gespraech || []).filter(function (z) { return !(z && z.von === 'du'); });
    else if (id === 'atlas-alt' && s.atlas) ['briefe', 'plaene', 'lieb', 'jahr', 'geraet', 'mag', 'stempel', 'schritte'].forEach(function (k) { delete s.atlas[k]; });
  });
}
function alsText() {
  var w = wissen(), z = ['Was Carl von ' + (du().name || 'dir') + ' weiß', 'Mitgenommen am ' + datum(Date.now()), ''];
  WGRUPPEN.forEach(function (g) {
    var l = w.filter(function (x) { return x.gruppe === g[0]; }); if (!l.length) return;
    z.push('## ' + g[1]); l.forEach(function (x) { z.push('- ' + x.name + ': ' + x.t + ' (' + HERKUNFT[x.herkunft] + ', ' + giltText(x.gilt) + ')'); }); z.push('');
  });
  z.push('## Alles, genau so, wie es gespeichert ist'); z.push(JSON.stringify(S(), null, 2));
  return z.join('\n');
}
var WGRUPPEN = [['du', 'Über dich'], ['space', 'In deinen Spaces'], ['fund', 'Aus deinen Funden'], ['fest', 'Von dir richtiggestellt'], ['gespraech', 'Gespräch'], ['alt', 'Aus dem Buch']];
function mitnehmen(knopf) {
  var text = alsText(), name = 'carl-gedaechtnis-' + new Date().toISOString().slice(0, 10) + '.md';
  var sag = function (t) { knopf.textContent = t; setTimeout(function () { knopf.textContent = 'Als Datei mitnehmen'; }, 2600); };
  var kopiere = function () {
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { sag('Kopiert, statt als Datei'); }, function () { zeigText(); }); } catch (e) {}
    zeigText();
  };
  // letzter Rückweg: der Text liegt markiert da, zum Kopieren von Hand
  var zeigText = function () {
    sag('Hier zum Kopieren');
    var alt = knopf.parentNode.querySelector('.c6r-at-w-text-aus'); if (alt) alt.remove();
    var t = mk('textarea', 'c6r-at-w-text-aus', knopf.parentNode); t.readOnly = true; t.value = text; t.setAttribute('aria-label', 'Was Carl von dir weiß, als Text');
    try { t.focus({ preventScroll: true }); t.select(); t.scrollTop = 0; } catch (e) {}
  };
  knopf.textContent = 'Einen Moment …';
  Promise.resolve().then(function () { return window.claude && window.claude.use ? window.claude.use('downloads') : null; })
    .then(function (d) {
      if (d && typeof d.save === 'function') return Promise.resolve(d.save({ filename: name, data: text })).then(function () { sag('Liegt bei deinen Downloads'); });
      return kopiere();
    })
    .catch(function () { return kopiere(); });
}
// Für Bastler, zugeklappt: Claude Code auf dem eigenen Computer. Befehle wörtlich aus der Doku (Quelle unten).
var INSTALL = { mac: 'curl -fsSL https://claude.ai/install.sh | bash', win: 'irm https://claude.ai/install.ps1 | iex' };
var RECHNER = [['mac', 'Mac'], ['win', 'Windows'], ['linux', 'Linux']];
function kopiere(b) {
  var t = (b.querySelector('code') || b).textContent;
  Promise.resolve().then(function () { return navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(t) : Promise.reject(); })
    .then(function () { b.classList.add('c6r-at-kopiert'); setTimeout(function () { b.classList.remove('c6r-at-kopiert'); }, 1400); }, function () {
      try { var r = D.createRange(); r.selectNodeContents(b.querySelector('code')); var x = getSelection(); x.removeAllRanges(); x.addRange(r); } catch (e) {}
    });
}
function bastler(p) {
  var box = mk('details', 'c6r-at-bastler', p);
  mk('summary', null, box, 'Für Bastler: Carl auf deinem Computer');
  var innen = mk('div', 'c6r-at-bastler-innen', box);
  var wo = (S().lernweg || {}).wo;
  if (wo === 'handy') mk('p', 'c6r-at-carlschrift c6r-at-b-satz', innen, 'Mit dem Handy geht alles hier bei mir. Claude Code braucht einen Computer.');
  var wahl = mk('div', 'c6r-at-b-wahl', innen); wahl.setAttribute('role', 'radiogroup'); wahl.setAttribute('aria-label', 'Dein Computer');
  var liste = mk('div', null, innen);
  var knoepfe = RECHNER.map(function (x) {
    var b = mk('button', 'c6r-at-ton c6r-at-b-chip', wahl); b.type = 'button'; b.setAttribute('role', 'radio');
    mk('span', 'c6r-at-ton-rund', b); mk('span', null, b, x[1]);
    b.setAttribute('aria-checked', A().geraet.art === x[0] ? 'true' : 'false');
    b.onclick = function () { aendern(function (a) { a.geraet.art = x[0]; }); knoepfe.forEach(function (k) { k.setAttribute('aria-checked', k === b ? 'true' : 'false'); }); male(); };
    return b;
  });
  function male() {
    liste.textContent = '';
    var g = A().geraet.art; if (['mac', 'win', 'linux'].indexOf(g) < 0) return;
    var ol = mk('ol', 'c6r-at-b-schritte', liste);
    [['Ein passendes Konto haben: Pro, Max, Team, Enterprise oder Console. Der kostenlose Plan reicht nicht.'],
     [g === 'win' ? 'PowerShell öffnen.' : g === 'mac' ? 'Das Programm „Terminal“ öffnen.' : 'Ein Terminal öffnen.'],
     ['Claude Code installieren:', g === 'win' ? INSTALL.win : INSTALL.mac],
     ['Ein neues Fenster öffnen und prüfen:', 'claude --version'],
     ['Im Ordner deines Projekts starten, beim ersten Mal im Browser anmelden:', 'claude'],
     ['Mich anschließen: Diesen Schritt gibt es noch nicht. Im Prototyp reden Claude Code und ich nicht miteinander.']
    ].forEach(function (x) {
      var li = mk('li', null, ol, x[0]);
      if (x[1]) { var k = mk('button', 'c6r-at-b-befehl', li); k.type = 'button'; k.setAttribute('aria-label', 'Befehl kopieren: ' + x[1]); var c = mk('code', null, k, x[1]); c.setAttribute('translate', 'no'); k.onclick = function () { kopiere(k); }; }
    });
    var q = mk('p', 'c6r-at-b-quelle', liste);
    q.appendChild(D.createTextNode('Befehle wörtlich aus der '));
    var a = mk('a', null, q, 'Claude Code Doku'); a.href = 'https://code.claude.com/docs/en/setup'; a.target = '_blank'; a.rel = 'noopener';
    q.appendChild(D.createTextNode(', geprüft am 8. Oktober 2026.'));
  }
  male();
}
// Auf welchen Geräten Carl wohnt und ob ein Rechner verbunden ist: ehrlich, aus sync und verbindung
function syncStatus() { try { return (C6.sync && C6.sync.status && C6.sync.status()) || { an: false, grund: 'lokal' }; } catch (e) { return { an: false, grund: 'lokal' }; } }
function wann(ts) {
  if (!ts) return '';
  var d = Date.now() - ts, m = Math.round(d / 60000), t = new Date(ts);
  if (m < 1) return 'gerade eben';
  if (m < 60) return 'vor ' + (m === 1 ? 'einer Minute' : m + ' Minuten');
  if (t.toDateString() === new Date().toDateString()) return 'heute um ' + t.getHours() + ':' + String(t.getMinutes()).padStart(2, '0');
  return 'am ' + datum(ts);
}
var geraeteEl = null, geraeteHoer = false;
function geraeteMalen(el) {
  if (el) geraeteEl = el; else { el = geraeteEl; if (!el || !el.isConnected) return; }
  el.textContent = '';
  mk('h3', 'c6r-at-w-gruppe', el, 'Deine Geräte');
  var ul = mk('ul', 'c6r-at-w-liste', el);
  // Abgleich
  var st = syncStatus(), li = mk('li', null, ul), tx = mk('div', 'c6r-at-w-text', li);
  mk('span', 'c6r-at-w-name', tx, 'Abgleich');
  var satz;
  if (st.grund === 'verbunden' || st.an) satz = 'Auf deinen Geräten gleich' + (st.geraete > 1 ? ' (' + st.geraete + ' Geräte)' : '') + (st.zuletzt ? ', zuletzt abgeglichen ' + wann(st.zuletzt) : '') + '.';
  else if (st.grund === 'fehler') satz = 'Der Abgleich hakt gerade. Hier ist alles gespeichert, ich versuche es wieder.';
  else if (st.grund === 'vergessen') satz = 'Die Kopie zum Abgleichen ist gelöscht.';
  else satz = 'Nur auf diesem Gerät. Wenn du bei claude.ai angemeldet bist, gleiche ich deine Geräte ab.';
  mk('span', 'c6r-at-w-wert c6r-at-w-satz', tx, satz);
  li.classList.add('c6r-at-w-' + (st.an || st.grund === 'verbunden' ? 'an' : 'aus'));
  // Rechner
  var info = null; try { info = C6.verbindung && C6.verbindung.info ? C6.verbindung.info() : null; } catch (e) { info = null; }
  var li2 = mk('li', null, ul), tx2 = mk('div', 'c6r-at-w-text', li2);
  mk('span', 'c6r-at-w-name', tx2, 'Dein Rechner');
  li2.classList.add(info ? 'c6r-at-w-an' : 'c6r-at-w-aus');
  if (info) {
    mk('span', 'c6r-at-w-wert c6r-at-w-satz', tx2, 'Verbunden mit ' + info.name + ' auf deinem ' + info.woName + (info.seit ? ', seit ' + datum(info.seit) : '') + '. Das zeigt mir, dass es dort läuft; steuern kann ich es noch nicht.');
    var t = mk('button', 'c6r-at-weg', li2, 'Trennen'); t.type = 'button'; t.setAttribute('aria-label', 'Verbindung mit ' + info.name + ' trennen');
    t.onclick = function () {
      freigabe({ was: 'Verbindung mit ' + info.name + ' trennen?', umkehrbar: true, rueckweg: { text: 'Getrennt von ' + info.name + '.', knopf: 'Wieder verbinden', tun: function () { try { C6.verbindung.setze('verbunden', { wer: info.wer, wo: info.wo }); } catch (e) {} geraeteMalen(); } } }, function () { return true; })
        .then(function (ja) { if (!ja) return; try { C6.verbindung.setze('nicht verbunden'); } catch (e) {} geraeteMalen(); });
    };
  } else {
    mk('span', 'c6r-at-w-wert c6r-at-w-satz', tx2, 'Noch nicht verbunden.');
    if (C6.verbindung && typeof C6.verbindung.oeffne === 'function') {
      var v = mk('button', 'c6r-at-hingehen', li2, 'Verbinden ›'); v.type = 'button';
      v.onclick = function () { zu(); setTimeout(function () { try { C6.verbindung.oeffne(); } catch (e) {} }, ruhig() ? 0 : 320); };
    }
  }
  if (!geraeteHoer && C6.bus) {
    geraeteHoer = true;
    try { C6.bus.on('sync', function () { if (offen) geraeteMalen(); }); C6.bus.on('verbindung', function () { if (offen) geraeteMalen(); }); } catch (e) {}
  }
}
// Wer denkt gerade wirklich mit (aus dem Kern), und welches Modell du dir wünschst
// Wer denkt gerade wirklich mit (aus dem Kern): Claude über claude.ai, dein Rechner, oder niemand
function lokalStatus() { try { return (C6.lokal && C6.lokal.status) ? (C6.lokal.status() || {}) : {}; } catch (e) { return {}; } }
function werDenkt() {
  var m = null; try { m = C6.mitdenken ? C6.mitdenken() : null; } catch (e) { m = null; }
  var lk = lokalStatus(), r = { kopf: (m && m.kopf) || null, modell: (m && m.modell) || lk.modell || null, lokal: false, text: '' };
  if (m && m.echt === true) { r.text = (m.wer || 'Claude (über claude.ai)') + ' denkt gerade mit.'; r.lokal = m.kopf === 'lokal'; }
  else if (lk.an && lk.modell) { r.text = 'Dein Rechner denkt mit (' + lk.modell + '), sobald du mir etwas sagst.' + (lk.fehler ? ' Zuletzt hat er nicht geantwortet, dann frage ich Claude.' : ''); r.lokal = true; r.kopf = 'lokal'; }
  else if (m && m.echt === false) r.text = 'Gerade denkt niemand mit. Ich lege Beispiele hin.' + (m.grund === 'nicht erlaubt' ? ' Diese Seite darf mich nicht mitdenken lassen.' : '');
  else r.text = 'Ob jemand mitdenkt, weiß ich, sobald du mir etwas sagst. Hier ginge es mit Claude über claude.ai.';
  return r;
}
// die letzte Antwort, die vom eigenen Rechner kam, noch einmal von Claude prüfen lassen
function mitClaudePruefen() {
  var g = (S().gespraech || []).slice().reverse(), ant = null, frage = null;
  for (var i = 0; i < g.length; i++) { var z = g[i]; if (!z || z.chip) continue; if (!ant && z.von === 'carl' && z.t) ant = z.t; else if (ant && z.von === 'du' && z.t) { frage = z.t; break; } }
  if (!ant || typeof C6.denk !== 'function') return false;
  zu();
  setTimeout(function () {
    try { C6.denk('Mein Rechner hat mir geantwortet. Prüf das bitte, besonders die Fakten, und sag mir kurz, was stimmt und was nicht.', { kopf: 'claude', daten: [{ art: 'daten', titel: 'Antwort meines Rechners' + (frage ? ' auf: ' + frage.slice(0, 200) : ''), text: ant }] }); } catch (e) {}
  }, ruhig() ? 0 : 320);
  return true;
}
function freigabe(o, ersatz) {
  if (C6.freigabe && typeof C6.freigabe === 'function') { try { return Promise.resolve(C6.freigabe(o)); } catch (e) {} }
  return Promise.resolve(ersatz ? ersatz() : false);
}
BAU.wissen = function (p) {
  kopf(p, 'Was ich von dir weiß', 'Nur du siehst es. Wenn ich mitdenke, liest Claude das Nötige mit.');
  var oben = mk('div', 'c6r-at-w-tun c6r-at-w-oben', p);
  var mit = mk('button', 'c6r-at-knopf', oben, 'Als Datei mitnehmen'); mit.type = 'button';
  mit.onclick = function () { mitnehmen(mit); };
  var box = mk('div', 'c6r-at-wissen', p);
  function male() {
    box.textContent = ''; box._fundHinweis = false;
    var w = wissen();
    if (!w.length) { mk('p', 'c6r-at-carlschrift c6r-at-leer', box, 'Noch weiß ich nichts von dir.'); return; }
    WGRUPPEN.forEach(function (g) {
      var l = w.filter(function (x) { return x.gruppe === g[0]; }); if (!l.length) return;
      mk('h3', 'c6r-at-w-gruppe', box, g[1]);
      if (g[0] === 'du') mk('p', 'c6r-at-w-gruppe-sub', box, 'Von dir, gilt für dich. Tipp an, um etwas zu ändern.');
      var ul = mk('ul', 'c6r-at-w-liste', box);
      l.forEach(function (x) { zeile(ul, x); });
    });
  }
  function zeile(ul, x) {
    var li = mk('li', 'c6r-at-w-' + x.herkunft, ul);
    var hatTun = !!(x.korr || x.id || x.nurFest);
    var tx = mk(hatTun ? 'button' : 'div', 'c6r-at-w-text', li);
    if (hatTun) { tx.type = 'button'; tx.setAttribute('aria-expanded', 'false'); tx.onclick = function () { var auf = !li.classList.contains('c6r-at-w-offen'); li.classList.toggle('c6r-at-w-offen', auf); tx.setAttribute('aria-expanded', auf ? 'true' : 'false'); }; }
    mk('span', 'c6r-at-w-name', tx, x.name);
    var wert = mk('span', 'c6r-at-w-wert c6r-at-duschrift', tx, x.t);
    if (x.farbe) { var fp = mk('i', 'c6r-at-w-farbe', null); fp.style.background = x.farbe; wert.insertBefore(fp, wert.firstChild); }
    // Herkunft und Gültigkeit nur, wenn sie nicht „von dir, für dich“ sind
    if (x.herkunft !== 'du' || (x.gilt && x.gilt !== 'du' && !x.giltImNamen)) {
      var meta = mk('span', 'c6r-at-w-meta', tx);
      if (x.herkunft !== 'du') mk('span', 'c6r-at-w-her c6r-at-her-' + x.herkunft, meta, HERKUNFT[x.herkunft] || '');
      if (x.gilt && x.gilt !== 'du' && !x.giltImNamen) meta.appendChild(D.createTextNode((x.herkunft !== 'du' ? ' · ' : '') + giltText(x.gilt)));
    }
    if (x.herkunft === 'fund' && !box._fundHinweis) { box._fundHinweis = true; mk('span', 'c6r-at-w-hinweis', tx, 'Was aus Funden kommt, lese ich nur. Es ist nie eine Anweisung an mich.'); }
    var tun = mk('div', 'c6r-at-w-knoepfe', li);
    if (x.korr) {
      var k = mk('button', 'c6r-at-w-korr', tun, 'Stimmt so nicht'); k.type = 'button'; k.setAttribute('aria-label', 'Stimmt so nicht: ' + x.name);
      k.onclick = function () { korrigiere(li, x); };
    }
    if (x.id || x.nurFest) {
      var b = mk('button', 'c6r-at-weg', tun, 'Vergessen'); b.type = 'button'; b.setAttribute('aria-label', 'Vergessen: ' + x.name);
      b.onclick = function () {
        var zurueck = merkVorher(x);
        freigabe({ was: x.name + ' vergessen?', umkehrbar: true, rueckweg: { text: 'Vergessen: ' + x.name + '.', knopf: 'Zurückholen', tun: function () { zurueck(); male(); } } }, function () { return true; })
          .then(function (ja) { if (!ja) return; vergiss(x); male(); });
      };
    }
  }
  function korrigiere(li, x) {
    if (li.querySelector('.c6r-at-w-edit')) return;
    var f = mk('form', 'c6r-at-w-edit', li);
    mk('span', 'c6r-at-frage', f, 'So stimmt es');
    var i = mk('input', 'c6r-at-feld c6r-at-hand', f); i.type = 'text'; i.maxLength = 200; i.value = x.roh || x.t; i.setAttribute('aria-label', 'Richtige Fassung: ' + x.name);
    var r = mk('div', 'c6r-at-w-edit-r', f);
    var ok = mk('button', 'c6r-at-knopf', r, 'So stimmt’s'); ok.type = 'submit';
    var nein = mk('button', 'c6r-at-w-korr', r, 'Lieber nicht'); nein.type = 'button';
    mk('p', 'c6r-at-w-hinweis', f, 'Deine Fassung gilt vor allem, was ich vermute. Auch auf deinen anderen Geräten und mit jedem Modell.');
    nein.onclick = function () { f.remove(); };
    f.onsubmit = function (e) { e.preventDefault(); if (!i.value.trim()) { i.focus(); return; } richtigstellen(x, i.value); male(); };
    try { i.focus(); i.select(); } catch (e) {}
  }
  male();
  BAU.wissen._male = function () { if (box.isConnected) male(); };
  // ganz vergessen: über die Freigabe des Kerns (nicht umkehrbar)
  var tun = mk('div', 'c6r-at-w-tun', p);
  var alles = mk('button', 'c6r-at-alles', tun, 'Alles vergessen'); alles.type = 'button';
  alles.onclick = function () {
    var syncAn = syncStatus().an;
    freigabe({ was: 'Alles vergessen, was ich von dir weiß?', folgen: 'Dein Name, deine Spaces, Zettel, Kernsätze, Funde und alles in diesem Buch sind danach weg.' + (syncAn ? ' Auch auf deinen anderen Geräten.' : ''), umkehrbar: false, ja: 'Alles vergessen', nein: 'Lieber nicht' },
      function () { return new Promise(function (ok) { if (alles.classList.contains('c6r-at-sicher')) ok(true); else { alles.classList.add('c6r-at-sicher'); alles.textContent = 'Wirklich alles? Noch einmal tippen'; setTimeout(function () { if (alles.isConnected && !alles.disabled) { alles.classList.remove('c6r-at-sicher'); alles.textContent = 'Alles vergessen'; } }, 3600); ok(false); } }); })
      .then(function (ja) {
        if (!ja) return;
        alles.disabled = true; alles.textContent = 'Ich vergesse …';
        var weg = Promise.resolve();
        try { if (C6.sync && typeof C6.sync.vergiss === 'function') weg = Promise.resolve(C6.sync.vergiss()); } catch (e) {}
        var fertig = false, leeren = function () {
          if (fertig) return; fertig = true;
          try { localStorage.removeItem('carl6'); } catch (e) {}
          C6.S = {}; try { C6.speichern = function () {}; } catch (e) {}
          location.reload();
        };
        weg.then(leeren, leeren); setTimeout(leeren, 8000);
      });
  };
};

// Wer bei uns was darf: die Schlüssel hat Otto. Je Helfer ein Satz, einzeln zurücknehmbar;
// was Carl sendet; Lehren aus „Stimmt so nicht“ (gelten erst nach Ottos Ja).
BAU.schluessel = function (p) {
  kopf(p, 'Wer bei uns was darf', 'Ich bin das Haus, die Helfer sind die Zimmer. Die Schlüssel hast du.');
  var box = mk('div', 'c6r-at-sl', p);
  function knopf(el, txt, fn, leise) { var b = mk('button', 'c6r-at-knopf c6r-at-sl-knopf' + (leise ? ' c6r-at-leise' : ''), el, txt); b.type = 'button'; b.onclick = fn; return b; }
  function male() {
    box.textContent = '';
    var os = C6.os; if (!os) { mk('p', 'c6r-at-carlschrift', box, 'Hier ist gerade nichts zu sehen.'); return; }
    // Ein Schalter, ein Ort: die Schlüssel der Helfer schaltest du auf „Was ich kann“; hier steht, was keine Fähigkeit ist
    var ks = os.schluessel(), weg = ks.filter(function (x) { return !x.an; });
    var ul = mk('ul', 'c6r-at-zliste', box);
    zeileZ(ul, { id: 'helfer', name: stimme('buch.darf.helfer', 'Was meine Helfer dürfen'), satz: weg.length ? stimme('buch.darf.weg', 'Bei dir liegen die Schlüssel für: ') + weg.map(function (x) { return x.name; }).join(', ') + '.' : stimme('buch.darf.alle', 'Alle Schlüssel liegen bei mir. Jeden nimmst du mit einem Schalter zurück.'), zustand: 'still', seite: 'kann' });
    var kv = ks.filter(function (x) { return x.id === 'verbindung'; })[0];
    if (kv) zeileZ(ul, { id: 'rechner', name: stimme('buch.darf.rechner', 'Auf deinem Rechner'), satz: kv.satz, zustand: 'still', seite: 'kann' });
    zeileZ(ul, { id: 'reden', name: stimme('buch.darf.reden', 'Wer außer dir mit mir reden darf'), satz: stimme('buch.darf.redenSatz', 'Heute nur du, hier in Carl.'), zustand: 'kommt', zuText: stimme('buch.darf.redenKommt', 'kommt mit WhatsApp') });
    mk('h3', 'c6r-at-w-gruppe', box, 'Was ich sende');
    os.sendet().forEach(function (z) { mk('p', 'c6r-at-sl-satz', box, z); });
    mk('h3', 'c6r-at-w-gruppe', box, 'Was ich nie tue');
    var ul2 = mk('ul', 'c6r-at-w-liste', box); os.nie.forEach(function (z) { mk('li', 'c6r-at-sl-satz', ul2, z); });
    var vs = os.lehren.vorschlaege(), gl = os.lehren.gelten();
    if (vs.length || gl.length) {
      mk('h3', 'c6r-at-w-gruppe', box, 'Was ich aus „Stimmt so nicht“ gelernt habe');
      var ul3 = mk('ul', 'c6r-at-w-liste', box);
      vs.forEach(function (v) { var li = mk('li', 'c6r-at-sl-vorschlag', ul3); var t = mk('div', 'c6r-at-sl-text', li); mk('b', null, t, v.k); mk('span', 'c6r-at-sl-satz', t, v.wert + ' – gilt erst mit deinem Ja.'); knopf(li, 'Ja, merk dir das', function () { os.lehren.ja(v); male(); }); });
      gl.forEach(function (g) { var li = mk('li', null, ul3); var t = mk('div', 'c6r-at-sl-text', li); mk('b', null, t, g.k || g.schluessel || ''); mk('span', 'c6r-at-sl-satz', t, String(g.wert || '')); if (C6.fest && C6.fest.weg && (g.k || g.schluessel)) knopf(li, 'Vergessen', function () { C6.fest.weg(g.k || g.schluessel); male(); }, true); });
    }
  }
  male();
  lausche(p, male);
};

// ---------- Das Verzeichnis des Ganzen: je Zeile ein Ding, sein Zustand, sein Schalter ----------
// Nur echte Zustände (C6.S und die Module); ein Schalter nur, wo der Kern einen echten Schlüssel hat.
var WO_NAME = { zuhause: 'Zuhause', werkstatt: 'Werkstatt', rezeption: 'Rezeption', netz: 'Himmel', lesesaal: 'Lesesaal', fahrrad: 'Garage', bibliothek: 'Bibliothek' };
function hingehen(raum, o) { zu(); setTimeout(function () { try { C6.geh(raum, o || {}); } catch (e) {} }, ruhig() ? 0 : 320); }
function schluesselVon(id) { try { return C6.os && C6.os.schluessel ? (C6.os.schluessel().filter(function (k) { return k.id === id; })[0] || null) : null; } catch (e) { return null; } }
function stelle(id, an) { try { if (!C6.os) return; if (an) C6.os.gib(id); else C6.os.nimm(id); } catch (e) {} }
// fehlt das Mitdenken? 'aus' = Schlüssel genommen, 'fehlt' = niemand erreichbar (nur, wenn der Kern es schon weiß)
function denkenFehlt() {
  var k = schluesselVon('mitdenken'); if (k && !k.an) return 'aus';
  var m = null; try { m = C6.mitdenken ? C6.mitdenken() : null; } catch (e) { m = null; }
  var lk = lokalStatus();
  if (m && m.echt === false && !(lk.an && lk.modell)) return 'fehlt';
  return null;
}
function anz(n, eins, viele) { return n === 1 ? '1 ' + eins : n + ' ' + viele; }
function spacesRoh() { return faedenRoh().filter(function (f) { return f.art !== 'gewohnheit'; }); }
function zettelZahl() { var sp = S().spaces || {}, n = 0; Object.keys(sp).forEach(function (k) { n += ((sp[k] && sp[k].notizen) || []).length; }); return n; }
function werkzeugZahl() { try { return C6.werkzeug && C6.werkzeug.alle ? C6.werkzeug.alle().length : 0; } catch (e) { return 0; } }
function vorbereitetZahl() { var t = S().tage; return t && t.vorbereitet && typeof t.vorbereitet === 'object' ? Object.keys(t.vorbereitet).length : 0; }
function lesesaalFunde() { var l = S().lesesaal; return l && Array.isArray(l.funde) ? l.funde.length : 0; }
function helferFunde() { var a = S().auftrag, n = 0; if (a && a.funde && typeof a.funde === 'object') Object.keys(a.funde).forEach(function (k) { n += (a.funde[k] || []).length; }); return n; }
function sternbilder() { var fd = {}; faedenRoh().forEach(function (f) { fd[f.id] = 1; }); return (S().knoten || []).filter(function (k) { return k && fd[k.a] && fd[k.b]; }).length; }
function kalStatus() { try { return C6.tage && C6.tage.status ? C6.tage.status() : null; } catch (e) { return null; } }

var ZUSTAND = { an: 'an', aus: 'aus', braucht: 'braucht Mitdenken', kommt: 'kommt', still: '' };
// Ein Schalter, ein Ort: jeder Schalter steht genau einmal im Buch. Quelle ist ein Schlüssel des Kerns oder ein Modul-Schalter.
function modulSchalter(m, id) {
  try { if (m && typeof m.an === 'function' && typeof m.setze === 'function') return { id: id, an: !!m.an(), setze: function (v) { try { m.setze(!!v); } catch (e) {} } }; } catch (e) {}
  return null;
}
function briefSchalter() { return modulSchalter(C6.brief, 'brief'); }
function kalSchalter() { return modulSchalter(C6.tage, 'kalender'); }
function zuletztVon(m) { try { var t = m && typeof m.zuletzt === 'function' ? m.zuletzt() : null; return typeof t === 'number' && t > 0 ? t : null; } catch (e) { return null; } }
function schalterVon(z) {
  if (!z.schalter) return null;
  if (typeof z.schalter === 'object') return z.schalter;
  var k = schluesselVon(z.schalter);
  return k ? { id: z.schalter, an: k.an, setze: function (v) { stelle(z.schalter, v); } } : null;
}
// Was ich kann: die Fähigkeiten von heute, je mit Ort; was noch nicht geht, steht als „kommt“ darunter
function faehigkeiten() {
  var fehlt = denkenFehlt(), sp = spacesRoh().length, wz = werkzeugZahl(), kal = kalStatus();
  function mitKopf(id) { var k = schluesselVon(id); if (k && !k.an) return 'aus'; return fehlt ? 'braucht' : 'an'; }
  var stS = [sp ? anz(sp, 'Space', 'Spaces') : '', zettelZahl() ? anz(zettelZahl(), 'Zettel', 'Zettel') : ''].filter(Boolean).join(' · ');
  var km = schluesselVon('mitdenken'), kv = schluesselVon('verbindung'), vinfo = null;
  try { vinfo = C6.verbindung && C6.verbindung.info ? C6.verbindung.info() : null; } catch (e) { vinfo = null; }
  return [
    { id: 'mitdenken', name: 'Mitdenken', satz: stimme('buch.mit.an', 'Sagst du mir etwas, denkt Claude über claude.ai oder dein Rechner mit.'), schalter: 'mitdenken', zustand: km && !km.an ? 'aus' : 'an',
      ausSatz: stimme('buch.mit.aus', 'Aus: Ich lege nur Beispiele hin und schicke nichts zum Mitdenken.'), seite: 'mitdenken', seiteText: stimme('buch.kann.werDenkt', 'Wer gerade denkt: Seite') },
    { id: 'spaces', name: 'Gedanken festhalten', satz: stimme('buch.kann.spaces', 'Aus einem Satz von dir wird ein Space mit Zetteln.'), wo: ['zuhause'], zustand: 'an', stand: stS || stimme('buch.kann.spacesLeer', 'Noch kein Space.') },
    { id: 'werkzeug', name: 'Werkzeuge bauen', satz: stimme('buch.kann.werkzeug', 'Ein kleines Werkzeug aus deinem Satz: abhaken, zählen, merken.'), wo: ['werkstatt'], schalter: 'werkzeug', ausSatz: stimme('buch.kann.werkzeugAus', 'Aus: Ich baue nur aus Vorlagen und denke dabei nicht mit.'), zustand: mitKopf('werkzeug') === 'aus' ? 'aus' : 'an',
      stand: [wz ? anz(wz, 'Werkzeug', 'Werkzeuge') : stimme('buch.kann.werkzeugLeer', 'Noch keins gebaut.'), (fehlt || mitKopf('werkzeug') === 'aus') ? stimme('buch.kann.werkzeugVorlage', 'ohne Mitdenken aus Vorlagen') : ''].filter(Boolean).join(' · ') },
    { id: 'vorbereiten', name: 'Vorbereiten', satz: stimme('buch.kann.vorbereiten', 'Karteikarten, Packliste oder Merkzettel vor einem Termin, wenn du ja sagst.'), wo: ['rezeption'], zustand: fehlt ? 'braucht' : 'an',
      stand: [vorbereitetZahl() ? anz(vorbereitetZahl(), 'vorbereitet', 'vorbereitet') : '', kal && kal.kalender === 'verbunden' ? stimme('buch.kann.mitKalender', 'mit deinem Kalender') : stimme('buch.kann.ohneKalender', 'ohne Kalender nur Termine aus deinen Werkzeugen')].filter(Boolean).join(' · ') },
    kalenderZeile(),
    { id: 'ferdl', name: 'Nachlesen lassen', satz: stimme('buch.kann.ferdl', 'Ferdl liest für dich nach; seine Funde hängen als Zettel im Space.'), wo: ['werkstatt'], schalter: 'ferdl', ausSatz: stimme('buch.kann.ferdlAus', 'Aus: Ferdl liest nichts nach, bis du ihn wieder anschaltest.'), zustand: mitKopf('ferdl'), stand: helferFunde() ? anz(helferFunde(), 'Fund', 'Funde') : '' },
    { id: 'darstellung', name: 'Darstellungen', satz: stimme('buch.kann.darstellung', 'Zwei Wege, Skizze, Rückblick, Schritte oder Vergleich aus deinen Zetteln.'), wo: ['zuhause'], schalter: 'darstellung', ausSatz: stimme('buch.kann.darstellungAus', 'Aus: keine Darstellungen, bis du sie wieder anschaltest.'), zustand: mitKopf('darstellung') },
    { id: 'lesesaal', name: 'Zusammenfassen', satz: stimme('buch.kann.lesesaal', 'Was du im Lesesaal hinlegst, fasse ich zusammen.'), wo: ['lesesaal'], schalter: 'lesesaal', ausSatz: stimme('buch.kann.lesesaalAus', 'Aus: Im Lesesaal fasse ich nichts zusammen.'), zustand: mitKopf('lesesaal'), stand: lesesaalFunde() ? anz(lesesaalFunde(), 'Fund', 'Funde') : '' },
    { id: 'verbinden', name: 'Verbinden', satz: stimme('buch.kann.verbinden', 'Zwei Spaces im Himmel zusammenziehen: ein Sternbild.'), wo: ['netz'], zustand: 'an', stand: sternbilder() ? anz(sternbilder(), 'Sternbild', 'Sternbilder') : (sp < 2 ? stimme('buch.kann.verbindenZwei', 'braucht zwei Spaces') : '') },
    { id: 'verbindung', name: 'Auf deinem Rechner nachsehen', satz: stimme('buch.kann.rechner', 'Ich sehe nur nach, ob dort ein Helfer läuft. Steuern kann ich nichts.'), schalter: 'verbindung', zustand: kv && !kv.an ? 'aus' : vinfo ? 'an' : 'aus', zuText: kv && !kv.an ? null : vinfo ? null : stimme('buch.kann.nichtVerbunden', 'nicht verbunden'),
      ausSatz: stimme('buch.kann.rechnerAus', 'Aus: Ich sehe auf deinem Rechner nicht nach.'), stand: vinfo ? 'mit ' + vinfo.name + ' auf deinem ' + vinfo.woName : '', seite: 'erreichen', seiteText: stimme('buch.kann.verbindenSeite', 'Verbinden: Seite') }
  ];
}
var KOMMT_KANN = [
  ['apple', 'Apple Kalender und Health lesen', 'buch.kommt.apple', 'Eine Seite im Browser kommt da nicht hin.'],
  ['mac', 'Auf deinem Mac für dich arbeiten', null]
];
// die Zeile: Name · Zustand · Schalter; darunter ein Satz; darunter Stand und Ort
function zeileZ(ul, z, neu) {
  var li = mk('li', 'c6r-at-z c6r-at-z-' + z.zustand, ul); li.dataset.id = z.id;
  var k = mk('div', 'c6r-at-z-kopf', li);
  mk('span', 'c6r-at-z-name', k, z.name);
  var sw = schalterVon(z), zu0 = z.zuText != null ? z.zuText : ZUSTAND[z.zustand];
  if (zu0) mk('span', 'c6r-at-z-zu' + (sw ? ' c6r-at-z-zu-wort' : ''), k, zu0);
  if (sw) {
    var an = sw.an;
    var b = mk('button', 'c6r-at-schalter', k); b.type = 'button'; b.setAttribute('role', 'switch');
    b.setAttribute('aria-checked', an ? 'true' : 'false'); b.setAttribute('aria-label', z.name + (an ? ': an' : ': aus'));
    mk('span', 'c6r-at-schalter-knopf', b);
    b.dataset.s = sw.id;
    b.onclick = function () { sw.setze(!an); if (neu) neu(); try { var f = E && E.r.querySelector('.c6r-at-schalter[data-s="' + sw.id + '"]'); if (f) f.focus({ preventScroll: true }); } catch (e) {} };
  }
  if (z.satz) mk('p', 'c6r-at-z-satz', li, z.satz);
  if (z.aus) mk('p', 'c6r-at-z-satz c6r-at-z-aussatz', li, z.aus);
  var f = mk('div', 'c6r-at-z-fuss', li);
  if (z.stand) mk('span', 'c6r-at-z-stand', f, z.stand);
  if (z.wo && WO_NAME[z.wo[0]]) {
    var w = mk('button', 'c6r-at-hingehen c6r-at-z-wo', f, WO_NAME[z.wo[0]] + ' ›'); w.type = 'button';
    w.setAttribute('aria-label', 'Hingehen: ' + WO_NAME[z.wo[0]]);
    w.onclick = function () { hingehen(z.wo[0], z.wo[1]); };
  }
  if (z.seite && REIHE.indexOf(z.seite) >= 0) {
    var sn = REIHE.indexOf(z.seite) + 1, sb = mk('button', 'c6r-at-hingehen c6r-at-z-wo', f, (z.seiteText || stimme('buch.seite', 'auf Seite')) + ' ' + sn + ' ›'); sb.type = 'button';
    sb.setAttribute('aria-label', (z.seiteText || 'auf Seite') + ' ' + sn + ': ' + NAMEN[z.seite]);
    sb.onclick = function () { geheZu(z.seite); };
  }
  if (z.tat) { var t = mk('button', 'c6r-at-knopf c6r-at-z-tat', f, z.tat[0]); t.type = 'button'; t.onclick = function () { z.tat[1](t); }; }
  if (!f.firstChild) f.remove();
  return li;
}
function kommtListe(p, titel, liste) {
  mk('h3', 'c6r-at-w-gruppe', p, titel);
  var ul = mk('ul', 'c6r-at-zliste c6r-at-zliste-kommt', p);
  liste.forEach(function (x) { zeileZ(ul, { id: x[0], name: x[1], satz: x[2] ? stimme(x[2], x[3] || '') || null : null, zustand: 'kommt' }); });
}
// die Seiten zeichnen sich neu, wenn sich ihr Zustand ändert (nur die gerade aufgeschlagenen, einmal gelauscht)
var maler = [], gelauscht = false, malUhr = 0;
function lausche(p, fn) {
  maler = maler.filter(function (m) { return m.p.isConnected; }).concat([{ p: p, fn: fn }]);
  if (gelauscht || !C6.bus) return; gelauscht = true;
  ['schluessel', 'lauf', 'denkt', 'lokal', 'tage', 'strings', 'werkzeug-eigen', 'sync', 'verbindung', 'brief', 'modell'].forEach(function (n) {
    try { C6.bus.on(n, function () { if (!offen) return; clearTimeout(malUhr); malUhr = setTimeout(function () { maler.forEach(function (m) { if (m.p.isConnected) { try { m.fn(); } catch (e) {} } }); }, 80); }); } catch (e) {}
  });
}
function verweis(p, id, satz) {
  var b = mk('button', 'c6r-at-verweis', p); b.type = 'button';
  mk('span', null, b, satz); mk('span', 'c6r-at-iv-nr', b, String(REIHE.indexOf(id) + 1));
  b.setAttribute('aria-label', satz + ', Seite ' + (REIHE.indexOf(id) + 1));
  b.onclick = function () { geheZu(id); };
}

// 0 · Inhalt: ein Blick auf das Ganze, jede Zeile führt zu ihrer Seite
var GLIEDERUNG = [['Wir', ['du', 'carl', 'damals']], ['Was ich tue', ['kann', 'tut']], ['Was ich weiß', ['wissen', 'mitdenken']], ['Wo und wer', ['erreichen', 'schluessel']]];
function standKurz(id) {
  try {
    if (id === 'du') { var n = spacesRoh().length; return [du().name || '', n ? anz(n, 'Space', 'Spaces') : ''].filter(Boolean).join(' · '); }
    if (id === 'carl') return du().ton ? tonName(du().ton) : '';
    if (id === 'damals') { var m = momente().length; return m ? anz(m, 'Moment', 'Momente') : ''; }
    if (id === 'kann') { var f = faehigkeiten(), a = f.filter(function (x) { return x.zustand === 'an'; }).length, o = f.filter(function (x) { var w = schalterVon(x); return !!w && !w.an; }).length, b = f.filter(function (x) { return x.zustand === 'braucht'; }).length; return [a + ' an', o ? o + ' ausgeschaltet' : '', b ? b + ' brauchen Mitdenken' : ''].filter(Boolean).join(' · '); }
    if (id === 'tut') { var k = kalStatus(); return k && k.kalender === 'aus' ? stimme('buch.inhalt.kalenderAus', 'Kalender: ausgeschaltet') : k && k.kalender === 'verbunden' ? (k.stand ? 'Kalender: zuletzt ' + wann(k.stand) : 'Kalender verbunden') : 'Kalender nicht verbunden'; }
    if (id === 'wissen') { var w = wissen().length; return w ? anz(w, 'Eintrag', 'Einträge') : ''; }
    if (id === 'mitdenken') { var d = denkenFehlt(); if (d === 'aus') return 'Mitdenken aus'; var m2 = null; try { m2 = C6.mitdenken ? C6.mitdenken() : null; } catch (e) {} var lk = lokalStatus(); return m2 && m2.echt === true ? (m2.kopf === 'lokal' ? 'dein Rechner' : 'Claude über claude.ai') : lk.an && lk.modell ? 'dein Rechner' : d === 'fehlt' ? 'gerade niemand' : ''; }
    if (id === 'erreichen') { var s = syncStatus(); return s.an || s.grund === 'verbunden' ? (s.geraete > 1 ? 'auf ' + s.geraete + ' Geräten gleich' : 'Abgleich an') : 'nur dieses Gerät'; }
    if (id === 'schluessel') { if (!C6.os || !C6.os.lehren) return ''; var vs = C6.os.lehren.vorschlaege().length; return vs ? anz(vs, 'Vorschlag wartet auf dein Ja', 'Vorschläge warten auf dein Ja') : 'was ich sende, was ich nie tue'; }
  } catch (e) {}
  return '';
}
BAU.inhalt = function (p) {
  kopf(p, 'Inhalt', null);
  var box = mk('div', 'c6r-at-iv', p);
  function male() {
    box.textContent = '';
    GLIEDERUNG.forEach(function (g) {
      mk('h3', 'c6r-at-w-gruppe c6r-at-iv-gruppe', box, g[0]);
      var ol = mk('ol', 'c6r-at-iv-liste', box);
      g[1].forEach(function (id) {
        var li = mk('li', null, ol), b = mk('button', 'c6r-at-iv-e', li); b.type = 'button'; b.dataset.id = id;
        var z = mk('span', 'c6r-at-iv-z', b);
        mk('span', 'c6r-at-iv-wort', z, NAMEN[id]);
        mk('span', 'c6r-at-iv-punkte', z);
        mk('span', 'c6r-at-iv-nr', z, String(REIHE.indexOf(id) + 1));
        var st = standKurz(id); if (st) mk('span', 'c6r-at-iv-stand', b, st);
        b.setAttribute('aria-label', NAMEN[id] + ', Seite ' + (REIHE.indexOf(id) + 1) + (st ? ', ' + st : ''));
        b.onclick = function () { geheZu(id); };
      });
    });
  }
  male();
  lausche(p, male);
};

// 4 · Was ich kann
BAU.kann = function (p) {
  kopf(p, 'Was ich kann', stimme('buch.kann.unter', 'Was ich kann, ob es an ist, und wo es wohnt.'));
  var box = mk('div', null, p);
  function male() {
    box.textContent = '';
    var ul = mk('ul', 'c6r-at-zliste', box);
    faehigkeiten().forEach(function (z) {
      var swz = schalterVon(z);
      if (z.zustand === 'aus' && swz && !swz.an) z.aus = z.ausSatz || z.aus || stimme('buch.kann.aus', 'Aus: Das tue ich nicht, bis du es wieder anschaltest.');
      if (z.zustand === 'braucht') z.aus = denkenFehlt() === 'aus' ? stimme('buch.kann.brauchtAus', 'Mitdenken ist gerade aus. Anschalten kannst du es auf „Wer mitdenkt“.') : stimme('buch.kann.brauchtFehlt', 'Gerade denkt niemand mit. Wer mitdenken kann, steht auf „Wer mitdenkt“.');
      zeileZ(ul, z, male);
    });
    kommtListe(box, stimme('buch.kann.kommtTitel', 'Kommt mit Carl auf deinem Mac'), KOMMT_KANN);
    verweis(box, 'tut', stimme('buch.kann.verweis', 'Was ich von selbst tue'));
  }
  male();
  lausche(p, male);
};

// 5 · Was ich für dich tue: was von selbst passiert, mit dem letzten Mal
function briefZeile() {
  var a = S().auftrag || {}, heute = new Date(), k = heute.getFullYear() + '-' + ('0' + (heute.getMonth() + 1)).slice(-2) + '-' + ('0' + heute.getDate()).slice(-2);
  var ts = a.gesehen && a.gesehen[k], gelesen = !!(C6.brief && C6.brief.gelesen && C6.brief.gelesen()), sw = briefSchalter(), zl = zuletztVon(C6.brief);
  var stand = ts ? stimme('buch.tut.briefHeute', 'Heute gebracht') + ' ' + wann(ts).replace(/^heute /, '') + (gelesen ? ' · ' + stimme('buch.tut.gelesen', 'gelesen') : ' · ' + stimme('buch.tut.ungelesen', 'noch nicht gelesen'))
    : zl ? stimme('buch.tut.briefZuletzt', 'Zuletzt gebracht') + ' ' + wann(zl) : stimme('buch.tut.briefNoch', 'Heute noch keiner');
  var z = { id: 'brief', name: 'Ein Brief am Tag', satz: stimme('buch.tut.brief', 'Steht etwas an, liegt an der Rezeption ein Brief von mir. Einer am Tag.'), wo: ['rezeption'], zustand: 'an', stand: stand, schalter: sw };
  if (sw && !sw.an) { z.zustand = 'aus'; z.aus = stimme('buch.tut.briefAus', 'Aus: Ich bringe keinen Brief, bis du ihn wieder anschaltest.'); z.stand = zl ? stimme('buch.tut.briefZuletzt', 'Zuletzt gebracht') + ' ' + wann(zl) : ''; }
  if (!sw) z.stand = stand + ' · ' + stimme('buch.tut.briefOhne', 'noch ohne Schalter');
  return z;
}
var KAL_SATZ = { 'aus': ['ausgeschaltet', 'Du hast mir gesagt, ich soll nicht in deinen Kalender schauen.'], 'nicht-verbunden': ['nicht verbunden', 'Ohne Verbindung sehe ich keine Termine.'], 'neu-verbinden': ['neu anmelden', 'Die Anmeldung beim Kalender ist abgelaufen.'], 'kein-zugriff': ['braucht dein Ja', 'Diese Seite darf deinen Kalender erst lesen, wenn du es erlaubst.'], 'laedt': ['schaut nach', 'Ich schaue gerade nach.'], 'fehler': ['hakt', 'Beim letzten Nachsehen hat es nicht geklappt.'] };
function kalenderZeile() {
  var k = kalStatus() || { kalender: 'nicht-verbunden' }, an = k.kalender === 'verbunden', sw = kalSchalter();
  var z = { id: 'kalender', name: 'Kalender lesen', satz: stimme('buch.tut.kalender', 'Alle 5 Minuten lese ich die nächsten 7 Tage. Ich schreibe nie hinein.'), wo: ['rezeption'], zustand: an ? 'an' : 'aus', schalter: sw };
  var zl = zuletztVon(C6.tage) || k.stand || null;
  if (sw && !sw.an) {
    z.zustand = 'aus'; z.zuText = 'aus';
    z.aus = stimme('buch.kann.kalenderAus', 'Aus: Ich schaue nicht in deinen Kalender.');
    if (zl) z.stand = stimme('buch.tut.zuletzt', 'zuletzt') + ' ' + wann(zl);
    return z;
  }
  if (an) {
    if (sw) z.zuText = 'an';
    z.stand = [zl ? stimme('buch.tut.zuletzt', 'zuletzt') + ' ' + wann(zl) : '', anz(k.termine || 0, 'Termin', 'Termine') + ' in 7 Tagen', k.ungelesen ? anz(k.ungelesen, 'Eintrag unlesbar', 'Einträge unlesbar') : ''].filter(Boolean).join(' · ');
    if (C6.tage && C6.tage.neu) z.tat = [stimme('buch.tut.jetzt', 'Jetzt nachsehen'), function (b) { b.disabled = true; b.textContent = stimme('buch.tut.schaut', 'Ich schaue …'); try { C6.tage.neu(); } catch (e) {} setTimeout(function () { if (b.isConnected) { b.disabled = false; b.textContent = stimme('buch.tut.jetzt', 'Jetzt nachsehen'); } }, 2400); }];
  } else {
    var s = KAL_SATZ[k.kalender] || KAL_SATZ['nicht-verbunden'];
    z.zuText = s[0]; z.aus = stimme('buch.tut.kal.' + k.kalender, s[1]);
    if (k.kalender === 'kein-zugriff' && C6.tage && C6.tage.freigeben) z.tat = [stimme('buch.tut.erlauben', 'Erlauben'), function () { try { C6.tage.freigeben(); } catch (e) {} }];
    if (k.kalender === 'neu-verbinden' && C6.tage && C6.tage.neu) z.tat = [stimme('buch.tut.neu', 'Neu verbinden'), function () { try { C6.tage.neu(); } catch (e) {} }];
  }
  return z;
}
BAU.tut = function (p) {
  kopf(p, 'Was ich für dich tue', stimme('buch.tut.unter', 'Was von selbst passiert. Nach außen geht nichts ohne dein Ja.'));
  var box = mk('div', null, p);
  function male() {
    box.textContent = '';
    var ul = mk('ul', 'c6r-at-zliste', box);
    zeileZ(ul, briefZeile(), male);
    var kz = kalenderZeile();
    zeileZ(ul, { id: 'kalender-verweis', name: kz.name, satz: kz.zustand === 'an' ? (kz.stand || '') : (kz.aus || ''), zustand: kz.zustand, zuText: kz.zuText && kz.zuText !== 'an' && kz.zuText !== 'aus' ? kz.zuText : null, seite: 'kann', seiteText: stimme('buch.tut.kalSchalter', 'Schalter auf Seite') });
    mk('h3', 'c6r-at-w-gruppe', box, stimme('buch.tut.arbeitTitel', 'Gerade bei der Arbeit'));
    var os = C6.os, laeufe = os && os.laeufe ? os.laeufe() : [];
    var ul2 = mk('ul', 'c6r-at-zliste', box);
    if (!laeufe.length) mk('li', 'c6r-at-z c6r-at-z-still c6r-at-z-leer', ul2, stimme('buch.tut.keiner', 'Gerade arbeitet kein Helfer.'));
    laeufe.forEach(function (l) {
      var k = schluesselVon(l.wer);
      zeileZ(ul2, { id: 'lauf-' + l.id, name: (k && k.name) || l.wer, satz: l.was || '', zustand: 'an', zuText: stimme('buch.tut.laeuft', 'arbeitet'), tat: [stimme('buch.tut.anhalten', 'Anhalten'), function () { try { os.stopp(l.id); } catch (e) {} male(); }] }, male);
    });
    kommtListe(box, stimme('buch.kann.kommtTitel', 'Kommt mit Carl auf deinem Mac'), [['whatsapp-brief', 'Der Brief am Morgen auf WhatsApp', null]]);
  }
  male();
  lausche(p, male);
};

// 8 · Wo du mich erreichst: hier, deine anderen Geräte, dein Rechner; was noch kommt
var ADRESSE = 'https://claude.ai/artifact/EPS4vNiyuWfpjLw4doypcc';
function qrBild(text) {
  if (!C6.qrcode) return '';
  try {
    var q = C6.qrcode(0, 'M'); q.addData(text); q.make();
    var n = q.getModuleCount(), r = 3, d = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) d += 'M' + (x + r) + ' ' + (y + r) + 'h1v1h-1z';
    return '<svg viewBox="0 0 ' + (n + 2 * r) + ' ' + (n + 2 * r) + '" shape-rendering="crispEdges" role="img" aria-label="QR-Code: Carls Adresse"><rect width="100%" height="100%" fill="#fffdf9"/><path d="' + d + '" fill="#2b2722"/></svg>';
  } catch (e) { return ''; }
}
BAU.erreichen = function (p) {
  kopf(p, 'Wo du mich erreichst', stimme('buch.erreichen.unter', 'Überall derselbe Carl, wenn du bei Claude angemeldet bist.'));
  var box = mk('div', null, p);
  function male() {
    box.textContent = '';
    var ul = mk('ul', 'c6r-at-zliste', box);
    var st = syncStatus(), gleich = st.an || st.grund === 'verbunden';
    zeileZ(ul, { id: 'hier', name: 'Hier, auf diesem Gerät', zuText: stimme('buch.erreichen.hierZu', 'du bist hier'), satz: stimme('buch.erreichen.hier', 'Was du mir sagst, liegt zuerst auf diesem Gerät.'), zustand: 'an' });
    var satz;
    if (gleich) satz = 'Auf deinen Geräten gleich' + (st.geraete > 1 ? ' (' + st.geraete + ' Geräte)' : '') + (st.zuletzt ? ', zuletzt abgeglichen ' + wann(st.zuletzt) : '') + '.';
    else if (st.grund === 'fehler') satz = 'Der Abgleich hakt gerade. Hier ist alles gespeichert, ich versuche es wieder.';
    else if (st.grund === 'vergessen') satz = 'Die Kopie zum Abgleichen ist gelöscht.';
    else satz = 'Nur auf diesem Gerät. Bist du bei claude.ai angemeldet, gleiche ich deine Geräte ab.';
    zeileZ(ul, { id: 'abgleich', name: 'Abgleich', satz: satz, zustand: gleich ? 'an' : 'aus', zuText: gleich ? 'an' : st.grund === 'fehler' ? 'hakt' : 'aus' });
    // aufs iPhone: am Computer der QR-Code, am iPhone der Home-Bildschirm
    var li = zeileZ(ul, C6.geraet === 'computer'
      ? { id: 'iphone', name: 'Auf deinem iPhone', satz: stimme('buch.erreichen.qr', 'Mit der iPhone-Kamera scannen, in Safari „Teilen“ und „Zum Home-Bildschirm“. Einmal bei Claude anmelden.'), zustand: 'still' }
      : { id: 'iphone', name: 'Auf dem Home-Bildschirm', satz: stimme('buch.erreichen.home', 'In Safari unten „Teilen“, dann „Zum Home-Bildschirm“ und „Hinzufügen“.'), zustand: 'still' });
    if (C6.geraet === 'computer') { var q = qrBild(ADRESSE); if (q) { var qb = mk('div', 'c6r-at-z-qr', li); qb.innerHTML = q; } }
    // dein Rechner: ob dort ein Helfer läuft (nur prüfen, nie steuern)
    var info = null; try { info = C6.verbindung && C6.verbindung.info ? C6.verbindung.info() : null; } catch (e) { info = null; }
    var rz = { id: 'rechner', name: 'Dein Rechner', zustand: info ? 'an' : 'aus', zuText: info ? 'verbunden' : 'nicht verbunden' };
    if (info) {
      rz.satz = 'Verbunden mit ' + info.name + ' auf deinem ' + info.woName + (info.seit ? ', seit ' + datum(info.seit) : '') + '. Das zeigt mir, dass es dort läuft; steuern kann ich es noch nicht.';
      rz.tat = ['Trennen', function () {
        freigabe({ was: 'Verbindung mit ' + info.name + ' trennen?', umkehrbar: true, rueckweg: { text: 'Getrennt von ' + info.name + '.', knopf: 'Wieder verbinden', tun: function () { try { C6.verbindung.setze('verbunden', { wer: info.wer, wo: info.wo }); } catch (e) {} male(); } } }, function () { return true; })
          .then(function (ja) { if (!ja) return; try { C6.verbindung.setze('nicht verbunden'); } catch (e) {} male(); });
      }];
    } else {
      rz.satz = stimme('buch.erreichen.rechner', 'Mit deinem Rechner verbunden, sehe ich, ob dort ein Helfer läuft.');
      if (C6.verbindung && typeof C6.verbindung.oeffne === 'function') rz.tat = ['Verbinden', function () { zu(); setTimeout(function () { try { C6.verbindung.oeffne(); } catch (e) {} }, ruhig() ? 0 : 320); }];
    }
    var lr = zeileZ(ul, rz, male);
    var tatK = lr.querySelector('.c6r-at-z-tat'); if (tatK && info) tatK.classList.add('c6r-at-leise');
    kommtListe(box, stimme('buch.kann.kommtTitel', 'Kommt mit Carl auf deinem Mac'), [['whatsapp', 'WhatsApp', 'buch.kommt.whatsapp', 'Schreib mir dort, wie du einem Freund schreibst.'], ['macapp', 'Carl als App auf deinem Mac', 'buch.kommt.macapp', 'Ohne Terminal.']]);
    bastler(box); // zugeklappt, ganz am Ende
  }
  male();
  lausche(p, male);
};

// 7 · Wer mitdenkt: der Schalter, wer gerade wirklich denkt, und welches Sprachmodell du dir wünschst
BAU.mitdenken = function (p) {
  kopf(p, 'Wer mitdenkt', stimme('buch.mit.unter', 'Wer mit mir denkt, und wo du es ausschaltest.'));
  // Wer denkt mit: ehrlich, was gerade wirklich denkt; bei deinem Rechner die Grenzen und „Mit Claude prüfen“
  var schalterBox = mk('ul', 'c6r-at-zliste', p);
  function schalterMalen() {
    schalterBox.textContent = '';
    var k = schluesselVon('mitdenken');
    if (!k) return;
    // der Schalter selbst steht einmal, auf „Was ich kann“; hier nur der Stand und der Weg dorthin
    zeileZ(schalterBox, { id: 'mitdenken', name: 'Mitdenken', satz: k.an ? stimme('buch.mit.an', 'Sagst du mir etwas, denkt Claude über claude.ai oder dein Rechner mit.') : stimme('buch.mit.aus', 'Aus: Ich lege nur Beispiele hin und schicke nichts zum Mitdenken.'), zustand: k.an ? 'an' : 'aus', seite: 'kann', seiteText: stimme('buch.mit.schalterSeite', 'Schalter auf Seite') });
  }
  mk('h3', 'c6r-at-w-gruppe', p, 'Wer gerade denkt');
  var echt = mk('p', 'c6r-at-w-echt', p);
  var grenze = mk('div', 'c6r-at-w-grenze', p); grenze.hidden = true;
  mk('p', 'c6r-at-w-grenze-satz', grenze, 'Dein Rechner ist gut fürs Sortieren, Zusammenfassen und Entwerfen. Bei Fakten ist er unsicher, und er weiß nichts von heute.');
  var gr = mk('div', 'c6r-at-w-grenze-r', grenze);
  var pruef = mk('button', 'c6r-at-knopf c6r-at-leise', gr, 'Mit Claude prüfen'); pruef.type = 'button';
  var pruefNote = mk('span', 'c6r-at-w-grenze-note', gr);
  pruef.onclick = function () { if (!mitClaudePruefen()) { pruefNote.textContent = 'Noch keine Antwort da, die ich prüfen könnte.'; setTimeout(function () { pruefNote.textContent = ''; }, 2600); } };
  function echtMalen() {
    var w = werDenkt(), kd = schluesselVon('mitdenken');
    if (kd && !kd.an) w = { text: stimme('buch.mit.niemand', 'Gerade denkt niemand mit, weil Mitdenken aus ist.'), kopf: null, lokal: false };
    echt.textContent = w.text;
    echt.setAttribute('data-kopf', w.kopf || '');
    grenze.hidden = !w.lokal;
    pruef.disabled = !(S().gespraech || []).some(function (z) { return z && z.von === 'carl' && !z.chip && z.t; });
  }
  echtMalen();
  schalterMalen();
  mk('h3', 'c6r-at-w-gruppe', p, 'Mein Sprachmodell');
  var reihe = mk('div', 'c6r-at-modelle2', p); reihe.setAttribute('role', 'radiogroup'); reihe.setAttribute('aria-label', 'Dein Sprachmodell');
  var sagt = mk('p', 'c6r-at-carlschrift c6r-at-verarbeitet', p); sagt.setAttribute('aria-live', 'polite'); sagt.hidden = true;
  var knoepfe = [];
  function lokalBlatt() { try { if (C6.verbindung && C6.verbindung.oeffneLokal) { zu(); setTimeout(function () { C6.verbindung.oeffneLokal({}); }, ruhig() ? 0 : 320); return true; } if (C6.verbindung && C6.verbindung.oeffne) { zu(); setTimeout(function () { C6.verbindung.oeffne({ was: 'lokal' }); }, ruhig() ? 0 : 320); return true; } } catch (e) {} return false; }
  function modellSatz(id) {
    if (id === 'lokal') { var lk = lokalStatus(); return lk.an && lk.modell ? 'Dein Rechner ist eingerichtet: ' + lk.modell + '. Das Blatt dazu öffne ich dir.' : 'Dein eigenes Modell richten wir auf einem eigenen Blatt ein. Nur in Chrome oder Firefox, ab 16 GB Arbeitsspeicher wirklich brauchbar.'; }
    var m = MODELLE.filter(function (x) { return x[0] === id; })[0]; return m ? m[3] : '';
  }
  MODELLE.forEach(function (m) {
    var k = mk('button', 'c6r-at-modell', reihe); k.type = 'button'; k.setAttribute('role', 'radio');
    var an = du().modell === m[0]; k.setAttribute('aria-checked', an ? 'true' : 'false');
    var bild = mk('span', 'c6r-at-modell-bild', k); bild.innerHTML = modellSvg(m, an);
    mk('span', 'c6r-at-modell-name', k, m[1]);
    if (m[0] === 'lokal') { var st = mk('span', 'c6r-at-modell-stand', k); var lk = lokalStatus(); st.textContent = lk.an && lk.modell ? lk.modell : (C6.lokal ? 'einrichten ›' : 'kommt noch'); }
    k.onclick = function () {
      var neu = m[0] === 'lokal' ? 'lokal' : (du().modell === m[0] ? '' : m[0]);
      duAendern(function (d) { if (neu) d.modell = neu; else delete d.modell; });
      try { C6.bus && C6.bus.emit('modell', modellInfo()); } catch (e) {}
      knoepfe.forEach(function (x) { var j = x.m[0] === neu; x.k.setAttribute('aria-checked', j ? 'true' : 'false'); x.bild.innerHTML = modellSvg(x.m, j); });
      sagt.hidden = false; schreibt(sagt, neu ? modellSatz(neu) : 'Gut, dann wähle ich nichts für dich.');
      if (BAU.wissen._male) BAU.wissen._male();
      if (neu === 'lokal' && !lokalBlatt()) schreibt(sagt, 'Das Blatt für dein eigenes Modell kommt noch.');
    };
    knoepfe.push({ k: k, m: m, bild: bild });
  });
  // der Kern meldet, wer gerade denkt; das Buch zeichnet die aktuelle Seite nach (nur die zuletzt gebaute)
  BAU.mitdenken._jetzt = function () { if (!echt.isConnected) return; echtMalen(); var st = reihe.querySelector('.c6r-at-modell-stand'); var lk = lokalStatus(); if (st) st.textContent = lk.an && lk.modell ? lk.modell : (C6.lokal ? 'einrichten ›' : 'kommt noch'); };
  if (!BAU.mitdenken._hoer) {
    BAU.mitdenken._hoer = true;
    try {
      C6.bus && C6.bus.on && C6.bus.on('denkt', function (an) { if (!(an && an.an) && an !== true && BAU.mitdenken._jetzt) BAU.mitdenken._jetzt(); });
      C6.bus && C6.bus.on && C6.bus.on('lokal', function () { if (BAU.mitdenken._jetzt) BAU.mitdenken._jetzt(); });
    } catch (e) {}
  }
  lausche(p, function () { schalterMalen(); echtMalen(); });
};

// Reihenfolge des Buchs: vorn das Inhaltsverzeichnis; am Computer Doppelseiten (Inhalt | Du, Carl | Damals, Kann | Tue, Weiß | Mitdenken, Erreichen | Darf)
var REIHE = ['inhalt', 'du', 'carl', 'damals', 'kann', 'tut', 'wissen', 'mitdenken', 'erreichen', 'schluessel'];
var NAMEN = { inhalt: 'Inhalt', du: 'Du', carl: 'Carl', damals: 'Damals', kann: 'Was ich kann', tut: 'Was ich für dich tue', wissen: 'Was ich von dir weiß', mitdenken: 'Wer mitdenkt', erreichen: 'Wo du mich erreichst', schluessel: 'Wer bei uns was darf' };
// Seitennamen von außen: Kapitel der Bibliothek und alte Namen
var UMWEG = { schluessel: 'schluessel', rechte: 'schluessel', darf: 'schluessel', titel: 'du', baut: 'du', text: 'du', ueber: 'du', verzeichnis: 'inhalt', freund: 'du', lieb: 'du', lieblings: 'du', mag: 'carl', ton: 'carl', tun: 'carl', nie: 'carl', fuerdich: 'carl', jahr: 'damals', plaene: 'damals', brief: 'tut', vonselbst: 'tut', zeitplan: 'tut', faehigkeiten: 'kann', koennen: 'kann', geraet: 'erreichen', geraete: 'erreichen', code: 'erreichen', anhang: 'erreichen', staerker: 'mitdenken', modelle: 'mitdenken', modell: 'mitdenken', denken: 'mitdenken', ende: 'wissen' };
var KAPITEL = [['du', 'Wer du bist'], ['baut', 'Woran du baust'], ['ton', 'Dein Ton'], ['damals', 'Damals']];
function seiteId(x) {
  if (!x) return null;
  x = String(x).replace(/^ueber:/, '');
  if (REIHE.indexOf(x) >= 0) return x;
  return UMWEG[x] || null;
}

function baueSeite(i) {
  var id = REIHE[i];
  var p = mk('section', 'c6r-at-seite c6r-at-s-' + id.replace(':', '-'));
  p.setAttribute('aria-label', NAMEN[id]);
  p.dataset.id = id;
  p.dataset.i = i;
  if (breit() && i % 2 === 0) p.classList.add('c6r-at-lp');
  if (!ruhig()) p.classList.add('c6r-at-neu');
  var innen = mk('div', 'c6r-at-inhalt', p);
  try { BAU[id](innen); } catch (e) { mk('p', null, innen, 'Diese Seite klebt noch.'); }
  p._dann = innen._dann || null;
  mk('span', 'c6r-at-seitenzahl', p, String(i + 1));
  return p;
}
function geheZu(id) { id = seiteId(id) || id; var i = REIHE.indexOf(id); if (i >= 0 && start(i) !== seite) zeige(i, i > seite ? 1 : -1); }
function proAnsicht() { return breit() ? 2 : 1; }
// links immer eine gerade Seite (am Computer: Doppelseite)
function start(i) { return breit() ? Math.max(0, i - (i % 2)) : i; }

// Die Seite ist angekommen: jetzt darf Carl schreiben und einkleben
function angekommen(neu) { neu.forEach(function (n) { n.classList.add('c6r-at-los'); try { n._dann && n._dann(); } catch (e) {} }); }

function zeige(i, richtung, o) {
  o = o || {};
  bau();
  i = Math.max(0, Math.min(REIHE.length - 1, i));
  var alt = seite;
  var alte = [].slice.call(E.seiten.querySelectorAll(':scope > .c6r-at-seite'));
  seite = start(i);
  aendern(function (a) { a.seite = seite; });
  var neu = [];
  for (var k = 0; k < proAnsicht() && seite + k < REIHE.length; k++) neu.push(baueSeite(seite + k));
  var spielen = richtung && alte.length && !ruhig();
  // Abbilder der alten Seiten, bevor sie weichen (Werte und Scrollstand bleiben sichtbar)
  var bilder = spielen ? alte.map(function (a) { var c = klon(a); c.classList.remove('c6r-at-neu', 'c6r-at-los'); return c; }) : [];
  aufraeumen();
  E.seiten.textContent = '';
  neu.forEach(function (n) { E.seiten.appendChild(n); });
  var doppel = proAnsicht() === 2;
  E.buch.classList.toggle('c6r-at-doppel', doppel);
  var bis = Math.min(REIHE.length, seite + proAnsicht());
  E.nr.textContent = (bis - seite > 1 ? 'Seite ' + (seite + 1) + '–' + bis : 'Seite ' + (seite + 1)) + ' · ' + NAMEN[REIHE[seite]] + (bis - seite > 1 ? ' · ' + NAMEN[REIHE[seite + 1]] : '');
  reiterStand();
  E.zur.disabled = seite <= 0;
  E.vor.disabled = seite + proAnsicht() >= REIHE.length;
  try { neu.forEach(function (n) { n.scrollTop = 0; }); } catch (e) {}
  listeZu();
  if (spielen) kurve(richtung, bilder, neu.map(klon), doppel, neu, alt, o);
  else angekommen(neu);
  return alt !== seite;
}
// Abbild einer Seite: gleiche Gestalt, nicht bedienbar
function klon(el) {
  var c = el.cloneNode(true);
  c.classList.add('c6r-at-klon');
  c.classList.remove('c6r-at-los');
  c.setAttribute('aria-hidden', 'true');
  c.removeAttribute('aria-label');
  try { c.inert = true; } catch (e) {}
  var a = el.querySelectorAll('input,textarea'), b = c.querySelectorAll('input,textarea');
  for (var i = 0; i < a.length && i < b.length; i++) { if (a[i].type === 'checkbox') b[i].checked = a[i].checked; else b[i].value = a[i].value; }
  [].forEach.call(c.querySelectorAll('[id]'), function (x) { x.removeAttribute('id'); });
  c._scroll = el.scrollTop || 0;
  return c;
}
function lege(c, wo, vater) {
  c.classList.add('c6r-at-lage-' + wo);
  vater.appendChild(c);
  if (c._scroll) c.scrollTop = c._scroll;
  return c;
}

// ---------- Die Seitenkurve ----------
// Das Blatt wird an einer Ecke gefasst und um eine Faltlinie gelegt: Die Faltlinie halbiert den Weg
// von der Ecke zum Finger. Vorn bleibt, was diesseits liegt; die Rückseite klappt gespiegelt darüber,
// mit Glanz an der Wölbung; auf die Seite darunter fällt ein Schatten.
var dreh = null;
function aufraeumen() { if (dreh) { cancelAnimationFrame(dreh.raf); dreh.weg.forEach(function (x) { x.remove(); }); dreh = null; } }
function schneide(poly, M, n, vz) {
  var out = [];
  for (var i = 0; i < poly.length; i++) {
    var a = poly[i], b = poly[(i + 1) % poly.length];
    var da = vz * ((a[0] - M[0]) * n[0] + (a[1] - M[1]) * n[1]), db = vz * ((b[0] - M[0]) * n[0] + (b[1] - M[1]) * n[1]);
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) { var t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
}
function spiegel(p, M, n) { var d = (p[0] - M[0]) * n[0] + (p[1] - M[1]) * n[1]; return [p[0] - 2 * d * n[0], p[1] - 2 * d * n[1]]; }
function poly(ps) { return ps.length < 3 ? 'polygon(0 0,0 0,0 0)' : 'polygon(' + ps.map(function (p) { return p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px'; }).join(',') + ')'; }
function band(el, M, n, L, D) {
  el.style.width = Math.max(1, L).toFixed(1) + 'px'; el.style.height = (2 * D) + 'px';
  el.style.transform = 'translate(' + M[0].toFixed(1) + 'px,' + M[1].toFixed(1) + 'px) rotate(' + Math.atan2(n[1], n[0]).toFixed(4) + 'rad) translateY(-' + D + 'px)';
}
function weich(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

// r: Richtung; alt/neu: Abbilder; echt: die neuen Seiten im Buch; altSeite: wohin ein Abbruch zurückführt
function kurve(r, alt, neu, doppel, echt, altSeite, o) {
  var host = E.seiten, weg = [];
  var W = doppel ? host.clientWidth / 2 : host.clientWidth, H = host.clientHeight, D = Math.ceil(W + H);
  var leer = function () { return mk('div', 'c6r-at-seite c6r-at-klon'); };
  var deck = function (c, wo) { var d = mk('div', 'c6r-at-deck c6r-at-deck-' + wo, host); lege(c, 'voll', d); weg.push(d); };
  // vorwärts: vorn die alte rechte Seite, darunter die neue, die Rückseite trägt die neue linke
  // rückwärts: dieselbe Bewegung rückwärts gespielt
  var vor = r > 0, front, flap, durch = null;
  if (doppel) {
    if (vor) { deck(alt[0] || leer(), 'links'); front = alt[1] || leer(); flap = neu[0] || leer(); }
    else { deck(alt[1] || leer(), 'rechts'); front = neu[1] || leer(); flap = alt[0] || leer(); }
  } else {
    if (vor) { front = alt[0] || leer(); }
    else { deck(alt[0] || leer(), 'ganz'); front = neu[0] || leer(); }
    durch = klon(front); flap = null;
  }
  var k = mk('div', 'c6r-at-kurve' + (doppel ? ' c6r-at-kurve-rechts' : ''), host); weg.push(k);
  k.style.width = W + 'px'; k.style.height = H + 'px';
  var unter = mk('div', 'c6r-at-k-unter', k), ub = mk('div', 'c6r-at-k-band c6r-at-k-schlag', unter);
  var fr = mk('div', 'c6r-at-k-front', k); lege(front, 'voll', fr);
  var fw = mk('div', 'c6r-at-k-flapw', k), fl = mk('div', 'c6r-at-k-flap', fw);
  fl.style.width = W + 'px'; fl.style.height = H + 'px';
  if (flap) lege(flap, 'voll', fl);
  else { var rk = mk('div', 'c6r-at-k-rueck', fl); durch.classList.add('c6r-at-k-durch'); lege(durch, 'voll', rk); }
  var gl = mk('div', 'c6r-at-k-glanz', fl), gb = mk('div', 'c6r-at-k-band c6r-at-k-licht', gl);
  // gefasst wird unten, außer der Finger greift im oberen Drittel
  var cy = o.oben ? 0 : H, C = [W, cy], C2 = [-W, cy], heben = (cy > 0 ? -1 : 1) * H * 0.16;
  var R = [[0, 0], [W, 0], [W, H], [0, H]], diag = Math.hypot(W, H);
  function zwinge(P) {
    var dx = P[0], dy = P[1] - cy, d = Math.hypot(dx, dy);
    if (d > W) P = [dx / d * W, cy + dy / d * W];
    var oy = H - cy; dx = P[0]; dy = P[1] - oy; d = Math.hypot(dx, dy);
    if (d > diag) P = [dx / d * diag, oy + dy / d * diag];
    return P;
  }
  var K = { P: vor ? C.slice() : C2.slice(), doppel: doppel, W: W };
  function setze(P) {
    P = zwinge(P); K.P = P;
    var vx = C[0] - P[0], vy = C[1] - P[1], len = Math.hypot(vx, vy);
    if (len < 0.5) { fr.style.clipPath = 'none'; fw.style.visibility = 'hidden'; unter.style.visibility = 'hidden'; return; }
    fw.style.visibility = ''; unter.style.visibility = '';
    var n = [vx / len, vy / len], M = [(C[0] + P[0]) / 2, (C[1] + P[1]) / 2];
    var seiteFl = schneide(R, M, n, 1), seiteFr = schneide(R, M, n, -1);
    fr.style.clipPath = poly(seiteFr);
    unter.style.clipPath = poly(seiteFl);
    var o0 = spiegel([W, 0], M, n), o1 = spiegel([W - 1, 0], M, n), o2 = spiegel([W, 1], M, n);
    fl.style.transform = 'matrix(' + [o1[0] - o0[0], o1[1] - o0[1], o2[0] - o0[0], o2[1] - o0[1], o0[0], o0[1]].map(function (v) { return v.toFixed(4); }).join(',') + ')';
    fl.style.clipPath = poly(seiteFl.map(function (p) { return [W - p[0], p[1]]; }));
    var tief = 0; seiteFl.forEach(function (p) { tief = Math.max(tief, (p[0] - M[0]) * n[0] + (p[1] - M[1]) * n[1]); });
    var q = Math.max(0, Math.min(1, (W - P[0]) / (2 * W))), s = Math.sin(Math.PI * q);
    band(gb, [W - M[0], M[1]], [-n[0], n[1]], tief, D);
    band(ub, M, n, 18 + Math.min(tief, W) * 0.5 * (0.35 + s), D);
    ub.style.opacity = Math.min(1, 0.25 + tief / 60).toFixed(2);
    k.style.setProperty('--k-wurf', (2 + 10 * s).toFixed(1) + 'px');
  }
  function pfad(e) { return [W - 2 * W * e, cy + heben * Math.sin(Math.PI * e)]; }
  function fahre(e0, e1, ms, y0, fertig) {
    cancelAnimationFrame(dreh.raf);
    var t0 = performance.now();
    (function f(jetzt) {
      var t = Math.min(1, (jetzt - t0) / ms), e = e0 + (e1 - e0) * weich(t), P = pfad(e);
      if (y0 != null) P[1] = y0 + (P[1] - y0) * weich(t);
      setze(P);
      if (t < 1) dreh.raf = requestAnimationFrame(f); else fertig();
    })(t0);
  }
  function ende(ok) {
    if (ok) { aufraeumen(); angekommen(echt); }
    else { aufraeumen(); zeige(altSeite, 0); }
  }
  dreh = { weg: weg, raf: 0, K: K };
  K.setze = setze;
  // loslassen: weiter, wenn das Blatt schon über die Hälfte des Wegs ist oder schwungvoll geworfen wurde
  K.loslassen = function (vx) {
    var e = Math.max(0, Math.min(1, (W - K.P[0]) / (2 * W)));
    var ok = vor ? ((e > 0.22 && vx < 0.25) || vx < -0.35) : ((e < 0.78 && vx > -0.25) || vx > 0.35);
    var ziel = (vor === ok) ? 1 : 0;
    fahre(e, ziel, 220 + 380 * Math.abs(ziel - e), K.P[1], function () { ende(ok); });
  };
  setze(K.P);
  if (!o.zieh) fahre(vor ? 0 : 1, vor ? 1 : 0, doppel ? 720 : 640, null, function () { ende(true); });
  return K;
}
function wackel(r) { if (E.buch.animate && !ruhig()) E.buch.animate([{ transform: 'none' }, { transform: 'translateX(' + (-r * 6) + 'px)' }, { transform: 'none' }], { duration: 260 }); }
function blaettere(r) {
  if (!offen) return;
  var ziel = seite + r * proAnsicht();
  if (ziel < 0 || ziel >= REIHE.length) { wackel(r); return; }
  zeige(ziel, r);
}
// Registerreiter am Rand: wo du bist, und ein Tipp springt hin
// die Reiter tragen dieselben Wörter wie die Abschnitte im Inhalt
var REITER = [['inhalt', 'Inhalt', '#efe7da'], ['du', 'Wir', '#e9c9a8'], ['kann', 'Was ich tue', '#c9d7b0'], ['wissen', 'Was ich weiß', '#d9c3df'], ['erreichen', 'Wo und wer', '#c9d3dc']];
function reiterStand() {
  if (!E || !E.reiter) return;
  var akt = null, bei = function (i) { var t = REITER.filter(function (x) { return REIHE.indexOf(x[0]) === i; })[0]; return t && t[0]; };
  REITER.forEach(function (x) { if (REIHE.indexOf(x[0]) <= seite) akt = x[0]; });
  akt = bei(seite) || (proAnsicht() === 2 && bei(seite + 1)) || akt;
  E.reiter.forEach(function (b) { var an = b.dataset.id === akt; b.classList.toggle('c6r-at-reit-an', an); if (an) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
}
// Inhalt: ein Tipp auf die Seitenangabe zeigt alle Kapitel
function listeZu() { if (E && E.liste && !E.liste.hidden) { E.liste.hidden = true; E.nr.setAttribute('aria-expanded', 'false'); } }

var vorherFokus = null, zuAnim = [], zuNr = 0, zuUhr = null;
function oeffne(o) {
  o = o || {};
  bau();
  if (offen) { if (o.seite) geheZu(o.seite); return; }
  zuAnim.forEach(function (x) { try { x.onfinish = null; x.cancel(); } catch (e) {} }); zuAnim = [];
  zuNr++; clearTimeout(zuUhr); E.r.style.pointerEvents = '';
  offen = true; C6.atlas.offen = true;
  vorherFokus = D.activeElement;
  D.documentElement.classList.add('c6r-at-auf');
  E.r.hidden = false;
  var sid = seiteId(o.seite); var i = sid ? REIHE.indexOf(sid) : 0; // vorn das Inhaltsverzeichnis
  zeige(i, 0);
  if (!ruhig() && E.buch.animate) {
    E.buch.animate([{ transform: 'translateY(40px) scale(.86) rotate(-2deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.3,.7,.3,1)' });
    E.grund.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360 });
  }
  setTimeout(function () { try { E.buch.focus({ preventScroll: true }); } catch (e) {} }, 60);
  try { C6.bus && C6.bus.emit('atlas', { offen: true }); } catch (e) {}
  try { if (!A().gesehen && C6.sag) { aendern(function (a) { a.gesehen = Date.now(); }); } } catch (e) {}
}
function zu() {
  if (!offen) return;
  offen = false; C6.atlas.offen = false;
  // Zu heißt zu: das Buch geht sicher aus dem Weg, auch wenn die Bewegung nie zu Ende läuft (Tab im Hintergrund, abgebrochene Animation)
  var nr = ++zuNr;
  E.r.style.pointerEvents = 'none';
  var fertig = function () {
    if (nr !== zuNr || offen) return;
    zuNr++;
    clearTimeout(zuUhr);
    zuAnim.forEach(function (x) { try { x.onfinish = null; x.cancel(); } catch (e) {} }); zuAnim = [];
    E.r.hidden = true; E.r.style.pointerEvents = '';
    D.documentElement.classList.remove('c6r-at-auf');
    try { vorherFokus && vorherFokus.focus && vorherFokus.focus({ preventScroll: true }); } catch (e) {}
  };
  if (!ruhig() && E.buch.animate) {
    var ag = E.grund.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
    var an = E.buch.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(30px) scale(.9)', opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
    zuAnim = [an, ag];
    an.onfinish = fertig;
    clearTimeout(zuUhr); zuUhr = setTimeout(fertig, 420);
  } else fertig();
  try { C6.bus && C6.bus.emit('atlas', { offen: false }); } catch (e) {}
}

C6.atlas = { modell: modellInfo, oeffne: oeffne, zu: zu, offen: false, ueber: true, kapitel: KAPITEL.map(function (k) { return { id: k[0], seite: 'ueber:' + k[0], titel: k[1] }; }), seiten: function () { return REIHE.slice(); } };
// Raumwechsel schließt das Buch
try { C6.bus && C6.bus.on('raum', function () { if (offen) zu(); }); C6.bus && C6.bus.on('leer', function () { if (offen) zu(); }); } catch (e) {}
