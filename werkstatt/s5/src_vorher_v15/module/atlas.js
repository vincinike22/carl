// Dein Freundschaftsatlas mit Carl: ein Freundebuch zum Durchblättern.
// Seiten über dich, über Carl (er schreibt selbst hinein) und darüber, was Carl stärker macht.
// Alles bleibt auf diesem Gerät. Kein Schlüssel, kein Passwort, kein Token wird je abgefragt.
var C6 = window.C6 = window.C6 || {};
var D = document;

var QUELLE = { url: 'https://code.claude.com/docs/en/setup', name: 'Claude Code Doku · Advanced setup', url2: 'https://code.claude.com/docs/en/quickstart', name2: 'Claude Code Doku · Quickstart', geprueft: '8. Oktober 2026' };
// nur Befehle, die wörtlich in der offiziellen Doku stehen (Quelle oben)
var INSTALL = {
  mac: { name: 'macOS, Linux, WSL', befehl: 'curl -fsSL https://claude.ai/install.sh | bash' },
  brew: { name: 'Homebrew', befehl: 'brew install --cask claude-code' },
  ps: { name: 'Windows PowerShell', befehl: 'irm https://claude.ai/install.ps1 | iex' },
  winget: { name: 'Windows WinGet', befehl: 'winget install Anthropic.ClaudeCode' }
};
var GERAETE = [['mac', 'MacBook / Mac'], ['win', 'Windows-PC'], ['linux', 'Linux'], ['tablet', 'Tablet'], ['handy', 'Nur Handy']];
var CHIPS = ['Apple M1', 'Apple M2', 'Apple M3', 'Apple M4', 'Intel', 'AMD', 'weiß ich nicht'];
var RAM = ['8 GB', '16 GB', '24 GB', '32 GB', '64 GB +', 'weiß ich nicht'];
var STEMPEL = [['stern', 'Stern'], ['socke', 'Socke'], ['blatt', 'Keimblatt'], ['kiesel', 'Kiesel'], ['rad', 'Fahrrad']];

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

var STEMPEL_SVG = {
  stern: '<path d="M24 6l5.3 11.6 12.7 1.4-9.5 8.6 2.7 12.4L24 33.6 12.8 40l2.7-12.4L6 19l12.7-1.4z"/>',
  socke: '<path d="M18 6h12v18c0 4 2 6 5 8 4 3 3 10-3 10H20c-6 0-8-5-8-10 0-3 2-5 4-7 1-1 2-3 2-6z"/><path d="M18 12h12" fill="none"/>',
  blatt: '<path d="M24 42V26"/><path d="M24 27c-10 0-16-6-15-14 9-1 15 5 15 14z"/><path d="M24 27c10 0 16-6 15-14-9-1-15 5-15 14z"/>',
  kiesel: '<path d="M8 30c0-12 9-20 18-20s14 6 14 16c0 8-7 14-16 14S8 38 8 30z"/>',
  rad: '<circle cx="13" cy="30" r="8" fill="none"/><circle cx="35" cy="30" r="8" fill="none"/><path d="M13 30l7-12h11l4 12M20 18l4 12h-11M31 18l-7 12" fill="none"/>'
};
// ein gepresstes Keimblatt, wie Carls zwei Blätter, eingeklebt auf dem Innendeckel
var KEIMBLATT = '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 112 C 58 92, 61 74, 60 58" fill="none" stroke="#6d7f52" stroke-width="2.4" stroke-linecap="round"/>' +
  '<path d="M60 60 C 40 62, 18 50, 14 24 C 38 20, 58 34, 60 60 Z" fill="#9db082" stroke="#56683f" stroke-width="1.6"/><path d="M60 60 C 46 48, 32 36, 18 26" fill="none" stroke="#6d7f52" stroke-width="1.1"/>' +
  '<path d="M60 58 C 78 58, 100 44, 106 18 C 82 16, 62 30, 60 58 Z" fill="#b2c196" stroke="#56683f" stroke-width="1.6"/><path d="M60 58 C 74 44, 88 32, 102 20" fill="none" stroke="#6d7f52" stroke-width="1.1"/></svg>';
function stempelSvg(id, farbe) { return '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="' + (farbe || '#b9837a') + '" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + (STEMPEL_SVG[id] || STEMPEL_SVG.stern) + '</g></svg>'; }

// ---------- Ebene einmal bauen ----------
var E = null, offen = false, seite = 0, seiten = [], ctlBild = null;
function bau() {
  if (E) return E;
  var r = mk('div', 'c6r-at', D.body);
  r.id = 'c6r-atlas'; r.hidden = true;
  r.setAttribute('role', 'dialog'); r.setAttribute('aria-modal', 'true'); r.setAttribute('aria-label', 'Dein Freundschaftsatlas mit Carl');
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
  var l = mk('label', 'c6r-at-zeile' + (o.hand ? ' c6r-at-zeile-hand' : ''), vater);
  if (label) mk('span', o.hand ? 'c6r-at-frage' : 'c6r-at-label', l, label);
  var i = mk(o.lang ? 'textarea' : 'input', 'c6r-at-feld' + (o.carl ? ' c6r-at-carlschrift' : '') + (o.hand ? ' c6r-at-hand' : ''), l);
  if (!label && o.aria) i.setAttribute('aria-label', o.aria);
  if (!o.lang) i.type = 'text';
  i.maxLength = o.max || 80; i.value = wert || ''; i.setAttribute('autocomplete', 'off');
  if (o.platz) i.placeholder = o.platz;
  if (o.lang) i.rows = 2;
  i.addEventListener('input', function () { bald(function (a) { setze(a, i.value); }); if (o.dann) o.dann(i.value); });
  return i;
}
function chipReihe(vater, label, liste, aktiv, setze, o) {
  o = o || {};
  var box = mk('div', 'c6r-at-wahl', vater);
  if (label) mk('span', 'c6r-at-label', box, label);
  var reihe = mk('div', 'c6r-at-chips', box);
  reihe.setAttribute('role', 'group'); if (label) reihe.setAttribute('aria-label', label);
  liste.forEach(function (x) {
    var id = Array.isArray(x) ? x[0] : x, txt = Array.isArray(x) ? x[1] : x;
    var b = mk('button', 'c6r-at-chip', reihe); b.type = 'button';
    if (o.farbe) { b.innerHTML = '<i style="background:' + id + '"></i>'; mk('span', null, b, txt); } else if (o.stempel) { b.innerHTML = stempelSvg(id, A().stempelFarbe); mk('span', null, b, txt); } else b.textContent = txt;
    b.setAttribute('aria-pressed', aktiv() === id ? 'true' : 'false');
    b.onclick = function () {
      var neu = aktiv() === id ? '' : id;
      aendern(function (a) { setze(a, neu); });
      [].forEach.call(reihe.children, function (c) { c.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', neu ? 'true' : 'false');
      if (o.dann) o.dann(neu);
    };
  });
  return box;
}
function kopf(p, titel, unter) {
  mk('h2', 'c6r-at-titel', p, titel);
  if (unter) mk('p', 'c6r-at-unter', p, unter);
}
function kopierZeile(vater, befehl) {
  var z = mk('div', 'c6r-at-befehl', vater);
  var c = mk('code', null, z, befehl);
  c.setAttribute('translate', 'no');
  var b = mk('button', 'c6r-at-kopie', z, 'Kopieren'); b.type = 'button';
  b.setAttribute('aria-label', 'Befehl kopieren: ' + befehl);
  b.onclick = function () {
    var ok = function () { b.textContent = 'Kopiert'; setTimeout(function () { b.textContent = 'Kopieren'; }, 1600); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(befehl).then(ok, function () { markiere(c); });
      else markiere(c);
    } catch (e) { markiere(c); }
  };
  return z;
}
function markiere(el) { try { var r = D.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {} }

// Was eine Angabe für Carl bedeutet. Ehrlich: im Prototyp nur vorgemerkt.
var GERAET_SATZ = {
  mac: 'Ein Mac. Dann zeige ich dir bei Claude Code die Befehle für macOS.',
  win: 'Windows. Dann zeige ich dir bei Claude Code die Befehle für PowerShell.',
  linux: 'Linux. Dann gilt bei Claude Code der Befehl für macOS, Linux und WSL.',
  tablet: 'Ein Tablet. Das Terminal-Werkzeug braucht einen Computer; hier im Buch bleibe ich trotzdem bei dir.',
  handy: 'Nur ein Handy. Das Terminal-Werkzeug braucht einen Computer; hier im Buch bleibe ich trotzdem bei dir.'
};
function chipSatz(v) {
  if (!v || v === 'weiß ich nicht') return 'Macht nichts. Ich kann auch selbst nachsehen, so weit der Browser es mir verrät.';
  return v + '. Für Claude Code reicht das: Das Denken passiert beim Anbieter, nicht auf deinem Chip.';
}
function ramSatz(v) {
  if (!v || v === 'weiß ich nicht') return 'Macht nichts. Für Claude Code ist der Speicher kaum wichtig.';
  var n = parseInt(v, 10);
  if (n <= 8) return v + '. Für Claude Code genug. Ein Sprachmodell auf deinem Rechner wäre damit eher knapp.';
  if (n < 32) return v + '. Für Claude Code genug, und ein kleines Modell auf deinem Rechner ginge auch.';
  return v + '. Da hätte sogar ein größeres Modell auf deinem Rechner Platz.';
}
// Mein Sprachmodell: eigene kleine Zeichen, keine Logos; die Namen stehen nur als Text da
var MODELLE = [
  ['claude', 'Claude', 'Feder', '<path d="M36 8c-12 2-20 12-22 26l-4 6" fill="none"/><path d="M36 8c-2 10-8 18-18 22" fill="none"/><path d="M14 34l8-10M20 30l6-7" fill="none"/>',
    'Mit Claude denke ich in diesem Prototyp schon mit, wenn die Seite es erlaubt.', 'Gerüste füllen, Gegenrede halten, Fäden verbinden.'],
  ['chatgpt', 'ChatGPT', 'Sprechblase', '<path d="M8 12h32v20H22l-8 7v-7H8z"/><path d="M15 20h18M15 26h11" fill="none"/>',
    'ChatGPT merke ich mir. Verbinden kann ich mich damit im Prototyp noch nicht.', 'deine Fäden dort mitdenken lassen, ohne dass du kopierst.'],
  ['gemini', 'Gemini', 'Zwillinge', '<circle cx="18" cy="24" r="10"/><circle cx="30" cy="24" r="10" fill="none"/>',
    'Gemini merke ich mir. Verbinden kann ich mich damit im Prototyp noch nicht.', 'deine Fäden dort mitdenken lassen, ohne dass du kopierst.'],
  ['lokal', 'Auf meinem Rechner', 'Häuschen', '<path d="M8 24L24 10l16 14v16H8z"/><path d="M20 40V30h8v10" fill="none"/>',
    'Ein Modell auf deinem eigenen Rechner: Dann bliebe alles bei dir. Anschließen geht im Prototyp noch nicht.', 'mitdenken ohne Internet, und alles bleibt auf deinem Gerät.'],
  ['keins', 'Noch keins', 'leerer Kreis', '<circle cx="24" cy="24" r="13" fill="none" stroke-dasharray="4 4"/>',
    'Auch gut. Dann lege ich Beispiele hin, statt mitzudenken.', 'Zuhören, aufheben, ordnen. Das geht immer.']
];
function modellSvg(m, an) { return '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="' + (an ? '#f6d9a8' : '#fffaf0') + '" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + m[3] + '</g></svg>'; }
// Für alle, die mitdenken: welcher Kopf gewählt ist und was Carl dazu ehrlich sagt
function modellInfo() {
  var m = MODELLE.filter(function (x) { return x[0] === du().modell; })[0];
  if (!m) return null;
  return { id: m[0], name: m[1], verbunden: m[0] === 'claude', satz: m[0] === 'claude' ? 'Ich denke mit Claude mit.' : m[0] === 'keins' ? '' : 'Mit ' + m[1] + ' bin ich noch nicht verbunden. Ich denke hier mit Claude mit.' };
}
function duAendern(fn) { if (typeof C6.aendern === 'function') C6.aendern(function () { var s = S(); if (!s.du || typeof s.du !== 'object') s.du = {}; fn(s.du); }); else { var s = S(); s.du = s.du || {}; fn(s.du); } }
function schreibt(el, t) { el.textContent = ''; var s = mk('span', 'c6r-at-handlauf', el, t); if (!ruhig()) { s.style.animation = 'none'; void s.offsetWidth; s.style.animation = ''; } }
function geraetSeite(p) {
  kopf(p, 'Dein Gerät, dein Kopf', 'Tipp an, was stimmt.');
  var g = A().geraet;
  var sagt = mk('p', 'c6r-at-carlschrift c6r-at-verarbeitet', p);
  sagt.setAttribute('aria-live', 'polite');
  function sag(t, nach) { sagt.hidden = false; if (nach && nach.parentNode) nach.parentNode.insertBefore(sagt, nach.nextSibling); schreibt(sagt, t); merkzettel(); }
  sagt.hidden = true;
  var r1 = chipReihe(p, 'Ich arbeite auf', GERAETE, function () { return A().geraet.art || ''; }, function (x, v) { x.geraet.art = v; }, { dann: function (v) { sag(v ? GERAET_SATZ[v] : 'Gut, dann lasse ich das offen.', r1); } });
  var r2 = chipReihe(p, 'Chip', CHIPS, function () { return A().geraet.chip || ''; }, function (x, v) { x.geraet.chip = v; }, { dann: function (v) { sag(chipSatz(v), r2); } });
  var r3 = chipReihe(p, 'Arbeitsspeicher', RAM, function () { return A().geraet.ram || ''; }, function (x, v) { x.geraet.ram = v; }, { dann: function (v) { sag(ramSatz(v), r3); } });
  var nb = mk('div', 'c6r-at-nachsehen', p);
  var b = mk('button', 'c6r-at-knopf c6r-at-leise', nb, carlName() + ' schaut selbst nach'); b.type = 'button';
  b.onclick = function () { var t = selbstNachsehen(); aendern(function (x) { x.geraet.gelesen = t; }); sag(t, nb); };
  // Mein Sprachmodell
  mk('h3', 'c6r-at-zwischen', p, 'Mein Sprachmodell');
  mk('p', 'c6r-at-unter', p, 'Mit welchem Kopf soll ich mitdenken? Eins reicht.');
  var jetzt = mk('p', 'c6r-at-jetzt-denken', p);
  pruefeDenken().then(function (ja) { jetzt.textContent = ja ? 'Gerade jetzt darf ich auf dieser Seite mit Claude mitdenken.' : 'Gerade jetzt darf ich hier nicht mitdenken. Dann lege ich Beispiele hin.'; });
  var reihe = mk('div', 'c6r-at-modelle2', p); reihe.setAttribute('role', 'radiogroup'); reihe.setAttribute('aria-label', 'Mein Sprachmodell');
  var knoepfe = [];
  MODELLE.forEach(function (m) {
    var k = mk('button', 'c6r-at-modell', reihe); k.type = 'button'; k.setAttribute('role', 'radio');
    var an = du().modell === m[0];
    k.setAttribute('aria-checked', an ? 'true' : 'false');
    var bild = mk('span', 'c6r-at-modell-bild', k); bild.innerHTML = modellSvg(m, an);
    mk('span', 'c6r-at-modell-name', k, m[1]);
    k.onclick = function () {
      var neu = du().modell === m[0] ? '' : m[0];
      duAendern(function (d) { if (neu) d.modell = neu; else delete d.modell; });
      try { C6.bus && C6.bus.emit('modell', modellInfo()); } catch (e) {}
      knoepfe.forEach(function (x) { var j = x.m[0] === neu; x.k.setAttribute('aria-checked', j ? 'true' : 'false'); x.bild.innerHTML = modellSvg(x.m, j); });
      sag(neu ? m[4] + (neu === 'claude' || neu === 'keins' ? ' Dann kann ich: ' : ' Später könnte ich: ') + m[5] : 'Gut, kein Modell gewählt.', reihe);
    };
    knoepfe.push({ k: k, m: m, bild: bild });
  });
  // was Carl sich gemerkt hat
  var zettel = mk('div', 'c6r-at-merk', p);
  function merkzettel() {
    zettel.textContent = '';
    var a = A().geraet, z = [];
    var art = (GERAETE.filter(function (x) { return x[0] === a.art; })[0] || [])[1];
    if (art) z.push(['Gerät', art]);
    if (a.chip) z.push(['Chip', a.chip]);
    if (a.ram) z.push(['Speicher', a.ram]);
    var mo = MODELLE.filter(function (m) { return m[0] === du().modell; })[0];
    if (mo) z.push(['Sprachmodell', mo[1]]);
    var erledigt = Object.keys(A().schritte).filter(function (k) { return A().schritte[k]; }).length;
    z.push(['Claude Code', erledigt ? erledigt + ' von 6 Schritten abgehakt' : 'noch nicht eingerichtet']);
    mk('span', 'c6r-at-klebe', zettel);
    mk('p', 'c6r-at-merk-kopf', zettel, 'Hab ich mir gemerkt');
    var dl = mk('dl', null, zettel);
    z.forEach(function (x) { mk('dt', null, dl, x[0]); mk('dd', 'c6r-at-duschrift', dl, x[1]); });
    mk('p', 'c6r-at-merk-ehrlich', zettel, 'Im Prototyp ist das vorgemerkt, verbunden ist noch nichts.');
    var c = mk('button', 'c6r-at-weiter', zettel); c.type = 'button';
    mk('b', null, c, 'Hände im Terminal'); mk('span', null, c, 'Claude Code Schritt für Schritt einrichten');
    c.onclick = function () { geheZu('code'); };
  }
  merkzettel();
}
var BAU = {
  // Innendeckel: wem das Buch gehört, ein eingeklebtes Keimblatt
  titel: function (p) {
    p.parentNode && p.parentNode.classList.add('c6r-at-innen');
    mk('p', 'c6r-at-gedruckt', p, 'Dieses Buch gehört');
    mk('p', 'c6r-at-gross c6r-at-duschrift c6r-at-linie', p, du().name || '');
    mk('p', 'c6r-at-gedruckt', p, 'und');
    mk('p', 'c6r-at-gross c6r-at-carlschrift c6r-at-linie', p, carlName());
    var st = mk('div', 'c6r-at-gepresst c6r-at-kleb', p); st.innerHTML = KEIMBLATT; st.style.animationDelay = '.2s';
    mk('span', 'c6r-at-klebe c6r-at-klebe-a', st); mk('span', 'c6r-at-klebe c6r-at-klebe-b', st);
    var start = (S().rundgang && S().rundgang.start) || A().gesehen || Date.now();
    mk('p', 'c6r-at-gedruckt c6r-at-seit', p, 'angefangen am ' + datum(start));
  },
  // 2 · Das ist Carl (er hat selbst geschrieben)
  carl: function (p) {
    kopf(p, carlName() + ' über sich', null);
    var foto = mk('div', 'c6r-at-foto', p);
    var bild = mk('div', 'c6r-at-fotobild', foto);
    mk('span', 'c6r-at-ecke c6r-at-ecke1', foto); mk('span', 'c6r-at-ecke c6r-at-ecke2', foto);
    try { ctlBild = C6.figur && C6.figur.male ? C6.figur.male(bild, { groesse: 112 }) : null; if (ctlBild) { ctlBild.stimmung && ctlBild.stimmung('froh'); var s = du().socken; if (s && ctlBild.kleid) ctlBild.kleid({ socken: { farbe: s } }); } } catch (e) { ctlBild = null; }
    var dl = mk('dl', 'c6r-at-carl', p);
    var name = du().name;
    var zeilen = [
      ['Ich heiße', carlName() + (carlName() === 'Carl' ? '' : ' (eigentlich Carl)')],
      ['Ich bin', 'ein Kiesel mit zwei Keimblättern'],
      ['Meine Lieblingsfarbe', 'die meiner Socken'],
      ['Das esse ich am liebsten', 'Sätze. Kurze schmecken besser.'],
      ['Das kann ich gut', 'zuhören, nichts vergessen'],
      ['Das will ich noch lernen', 'fliegen, ohne zu wackeln'],
      ['Davon träume ich', 'dass deine Fäden ein Netz werden'],
      ['Mein Freund', name || 'du, auch ohne Namen']
    ];
    foto.classList.add('c6r-at-kleb');
    zeilen.forEach(function (z, k) { mk('dt', null, dl, z[0]); var dd = mk('dd', 'c6r-at-carlschrift', dl); var s = mk('span', 'c6r-at-handlauf', dd, z[1]); s.style.animationDelay = (0.35 + k * 0.22) + 's'; });
  },
  // 3 · Für dich, von dir
  brief: function (p) {
    kopf(p, 'Briefe an ' + carlName(), 'Ich antworte mit einer Zeile.');
    var liste = mk('ul', 'c6r-at-briefe', p);
    function zeichne() {
      liste.textContent = '';
      A().briefe.slice(-4).forEach(function (b) {
        var li = mk('li', null, liste);
        mk('p', 'c6r-at-duschrift', li, b.t);
        mk('p', 'c6r-at-datum', li, datum(b.ts));
        if (b.antwort) { var an = mk('p', 'c6r-at-carlschrift c6r-at-antwort', li); var s = mk('span', null, an, b.antwort); if (b === frisch) { s.className = 'c6r-at-handlauf'; s.style.animationDelay = '.75s'; } }
      });
    }
    var frisch = null;
    zeichne();
    var form = mk('form', 'c6r-at-schreib', p);
    var i = mk('textarea', 'c6r-at-feld c6r-at-duschrift', form); i.rows = 2; i.maxLength = 280; i.placeholder = 'Lieber ' + carlName() + ', …';
    i.setAttribute('aria-label', 'Ein Satz für ' + carlName());
    var b = mk('button', 'c6r-at-knopf', form, 'Ins Buch legen'); b.type = 'submit';
    p.insertBefore(form, liste);
    form.onsubmit = function (e) {
      e.preventDefault();
      var t = i.value.trim(); if (!t) { i.focus(); return; }
      var ant = stimme('atlas.antwort', 'Hab ich gelesen. Zweimal.');
      aendern(function (a) { frisch = { t: t.slice(0, 280), ts: Date.now(), antwort: ant }; a.briefe.push(frisch); if (a.briefe.length > 40) a.briefe.splice(0, a.briefe.length - 40); });
      i.value = ''; zeichne();
      var neu = liste.lastChild; if (neu && !ruhig()) neu.classList.add('c6r-at-kleb');
      frisch = null;
    };
  },
  // 5 · Dein Gerät und dein Sprachmodell: Carl verarbeitet, was du antippst
  geraet: function (p) { geraetSeite(p); },
  // 7 · Claude Code
  code: function (p) {
    kopf(p, 'Claude Code', 'Hände im Terminal, Schritt für Schritt.');
    var g = A().geraet.art;
    var wahl = g === 'win' ? ['ps', 'winget'] : g === 'mac' ? ['mac', 'brew'] : ['mac', 'ps'];
    var schritte = [
      { id: 'konto', t: 'Ein passendes Konto haben', x: 'Claude Code braucht ein Pro-, Max-, Team-, Enterprise- oder Console-Konto. Der kostenlose Plan reicht nicht.' },
      { id: 'terminal', t: 'Ein Terminal öffnen', x: g === 'win' ? 'Unter Windows: PowerShell öffnen.' : 'Auf dem Mac: Programm „Terminal“. Unter Linux: dein Terminal.' },
      { id: 'install', t: 'Claude Code installieren', befehle: wahl.map(function (k) { return INSTALL[k]; }) },
      { id: 'pruefen', t: 'Ein neues Terminalfenster öffnen und prüfen', befehle: [{ name: 'zeigt eine Versionsnummer', befehl: 'claude --version' }] },
      { id: 'start', t: 'In deinem Projektordner starten', befehle: [{ name: 'im Ordner deines Projekts', befehl: 'claude' }], x: 'Beim ersten Start meldest du dich im Browser an. Hier im Buch tippst du dazu nichts ein.' },
      { id: 'doktor', t: 'Wenn etwas hakt', befehle: [{ name: 'prüft die Installation', befehl: 'claude doctor' }] },
      { id: 'carl', t: 'Mich anschließen', x: 'Diesen Schritt gibt es noch nicht: Im Prototyp reden Claude Code und ich nicht miteinander. Sobald es geht und geprüft ist, steht hier der Befehl.', bald: true }
    ];
    var ol = mk('ol', 'c6r-at-schritte', p);
    schritte.forEach(function (s, i) {
      var li = mk('li', s.bald ? 'c6r-at-bald' : null, ol);
      var k = mk('label', 'c6r-at-haken', li);
      var cb = mk('input', null, k); cb.type = 'checkbox'; cb.checked = !!A().schritte[s.id]; cb.disabled = !!s.bald;
      cb.onchange = function () { aendern(function (a) { a.schritte[s.id] = cb.checked; }); };
      mk('span', 'c6r-at-schritt', k, (i + 1) + '. ' + s.t);
      if (s.x) mk('p', 'c6r-at-erkl', li, s.x);
      (s.befehle || []).forEach(function (b) { mk('span', 'c6r-at-fuer', li, b.name); kopierZeile(li, b.befehl); });
    });
    var q = mk('p', 'c6r-at-quelle', p);
    q.appendChild(D.createTextNode('Befehle wörtlich aus der offiziellen Doku, geprüft am ' + QUELLE.geprueft + ': '));
    var a1 = mk('a', null, q, QUELLE.name); a1.href = QUELLE.url; a1.target = '_blank'; a1.rel = 'noopener';
    q.appendChild(D.createTextNode(' · '));
    var a2 = mk('a', null, q, QUELLE.name2); a2.href = QUELLE.url2; a2.target = '_blank'; a2.rel = 'noopener';
  }
};
// Über-dich-Seiten: Felder und Logik kommen aus der Bibliothek (C6.bibliothek.du), S.du bleibt wie es ist
function kapitelIn(p, id, frage, klasse) {
  var box = mk('div', 'c6r-at-fb ' + (klasse || ''), p);
  if (frage) mk('p', 'c6r-at-frage', box, frage);
  var innen = mk('div', null, box);
  var api = C6.bibliothek && C6.bibliothek.du && C6.bibliothek.du.male;
  if (typeof api !== 'function') { mk('p', 'c6r-at-unter', innen, 'Diese Zeilen stehen gerade noch im Regal.'); return box; }
  try { api(id, innen, { zurueck: false, zu: zu }); } catch (e) { mk('p', 'c6r-at-unter', innen, 'Diese Zeilen klemmen gerade. Es ist nichts verloren.'); }
  return box;
}
BAU.du = function (p) {
  kopf(p, 'Du', null);
  kapitelIn(p, 'du', null, 'c6r-at-fb-wer');
  kapitelIn(p, 'baut', 'Daran baue ich gerade', 'c6r-at-fb-baut');
  kapitelIn(p, 'ton', 'So soll ' + carlName() + ' mit mir reden', 'c6r-at-fb-ton');
};
BAU.fuerdich = function (p) {
  kopf(p, 'Was ich für dich tue', 'Du schreibst es auf, ich halte mich daran.');
  kapitelIn(p, 'tun', 'Dabei darf ich dir helfen', 'c6r-at-fb-tun');
  kapitelIn(p, 'nie', 'Das tue ich nie', 'c6r-at-fb-nie');
  mk('p', 'c6r-at-carlschrift c6r-at-versprechen', p, 'Und von mir aus, immer: Ich ändere, lösche oder teile nichts ohne dein Ja.');
};
// Damals: eure gemeinsamen Momente, von selbst gesammelt (nur lesen, nichts wird verändert)
function momente() {
  var s = S(), r = [], fd = {};
  var faeden = (C6.strings && C6.strings.alle) ? C6.strings.alle() : (s.strings || []);
  faeden.forEach(function (f) { if (f && f.id) fd[f.id] = f; });
  var erste = (s.gespraech || []).filter(function (z) { return z && z.von === 'du' && !z.chip && z.t && String(z.t).trim().length > 1; })
    .sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); })[0];
  if (erste) r.push({ art: 'erste', was: 'Deine ersten Worte an mich', t: erste.t, ts: erste.ts || 0 });
  var f0 = faeden.filter(function (f) { return f && f.erstellt; }).sort(function (a, b) { return a.erstellt - b.erstellt; })[0];
  if (f0) r.push({ art: 'faden', was: 'Unser erster Faden', t: f0.titel, ts: f0.erstellt, farbe: f0.farbe, sid: f0.id });
  var kern = {};
  (s.nadeln || []).forEach(function (n) { if (n && n.satz) { kern[n.satz] = 1; r.push({ art: 'kern', was: 'Kernsatz' + (fd[n.stringId] ? ' · ' + fd[n.stringId].titel : ''), t: n.satz, ts: n.ts || 0, sid: fd[n.stringId] ? n.stringId : null }); } });
  var sp = s.spaces || {};
  Object.keys(sp).forEach(function (sid) { var k = sp[sid] && sp[sid].kern; if (k && !kern[k] && fd[sid]) r.push({ art: 'kern', was: 'Kernsatz · ' + fd[sid].titel, t: k, ts: sp[sid].kernTs || sp[sid].besucht || fd[sid].erstellt || 0, sid: sid }); });
  (s.knoten || []).forEach(function (k) {
    var a = fd[k.a], b = fd[k.b]; if (!a || !b) return;
    r.push({ art: 'knoten', was: 'Knoten · ' + a.titel + ' und ' + b.titel, t: k.satz || '', ts: k.ts || 0, farbe: a.farbe, farbe2: b.farbe });
  });
  faeden.forEach(function (f) {
    if (!f || f.art === 'gewohnheit') return;
    (f.perlen || []).forEach(function (p) { if (p && p.t) r.push({ art: 'perle', was: 'Erledigt · ' + f.titel, t: p.t, ts: p.ts || 0, farbe: f.farbe, sid: f.id }); });
  });
  var tg = (s.auftrag && s.auftrag.tage) || {};
  Object.keys(tg).forEach(function (k) { var x = tg[k]; if (x && x.erledigt && x.erledigt.t) r.push({ art: 'perle', was: 'Aufgabe des Tages' + (x.titel ? ' · ' + x.titel : ''), t: x.erledigt.t, ts: x.erledigt.ts || 0 }); });
  (A().plaene || []).forEach(function (x) { if (x && x.fertig && x.t) r.push({ art: 'plan', was: 'Plan geschafft', t: x.t, ts: x.fertig }); });
  var kopfteil = r.filter(function (x) { return x.art === 'erste'; });
  var rest = r.filter(function (x) { return x.art !== 'erste'; }).sort(function (a, b) { return a.ts - b.ts; });
  return { alle: kopfteil.concat(rest), zahl: r.length };
}
var DAMALS_MAX = 7;
BAU.damals = function (p) {
  kopf(p, 'Damals', 'Ich klebe es von selbst ein.');
  var m = momente(), liste = m.alle;
  if (!liste.length) {
    mk('p', 'c6r-at-carlschrift c6r-at-leer', p, 'Noch leer. Dein erster Satz an mich kommt hierher.');
    return;
  }
  var zeig = liste.length > DAMALS_MAX ? [liste[0]].concat(liste.slice(-(DAMALS_MAX - 1))) : liste;
  var ul = mk('ul', 'c6r-at-momente', p);
  // was seit dem letzten Aufschlagen dazukam, klebt Carl vor deinen Augen ein
  var seit = A().damalsTs || 0, nr = 0;
  p._dann = function () { aendern(function (a) { a.damalsTs = Date.now(); }); };
  zeig.forEach(function (x, i) {
    if (i === 1 && liste.length > DAMALS_MAX) mk('li', 'c6r-at-mehr c6r-at-carlschrift', ul, '… und ' + (liste.length - DAMALS_MAX) + ' Momente dazwischen');
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
};
// Lieblingsdinge: die Zeilen eines Freundebuchs
var LIEB = [['essen', 'Mein Lieblingsessen'], ['lied', 'Mein Lieblingslied'], ['buch', 'Mein Lieblingsbuch oder Lieblingsfilm'], ['ort', 'Mein Lieblingsort'], ['wort', 'Mein Lieblingswort'], ['froh', 'Das macht mich froh'], ['nicht', 'Das mag ich gar nicht'], ['traum', 'Davon träume ich']];
BAU.lieblings = function (p) {
  kopf(p, 'Lieblingsdinge', null);
  var l = A().lieb || {};
  LIEB.forEach(function (x) { feld(p, x[1], l[x[0]], function (a, v) { if (!a.lieb || typeof a.lieb !== 'object') a.lieb = {}; a.lieb[x[0]] = v; }, { max: 60, hand: true }); });
};
// Was Carl an dir mag: nur, was er wirklich gesehen hat (gezählt, nicht gedichtet)
function carlMag() {
  var s = S(), m = momente().alle, z = {};
  m.forEach(function (x) { z[x.art] = (z[x.art] || 0) + 1; });
  var faeden = ((C6.strings && C6.strings.alle) ? C6.strings.alle() : (s.strings || [])).filter(function (f) { return f && f.titel && f.art !== 'gewohnheit'; }).length;
  var briefe = A().briefe.length, lieb = 0, l = A().lieb || {};
  Object.keys(l).forEach(function (k) { if (l[k] && String(l[k]).trim()) lieb++; });
  var r = [];
  if (z.kern) r.push('Dass du nach dem wahren Satz suchst. ' + (z.kern === 1 ? 'Einen hast du schon gefunden.' : z.kern + ' Kernsätze bis jetzt.'));
  if (z.knoten) r.push('Dass du verbindest, was nicht zusammen aussah. ' + (z.knoten === 1 ? 'Ein Knoten' : z.knoten + ' Knoten') + ' am Himmel.');
  if (z.perle || z.plan) { var n = (z.perle || 0) + (z.plan || 0); r.push('Dass du Sachen zu Ende bringst. ' + (n === 1 ? 'Eine Sache' : n + ' Sachen') + ' geschafft.'); }
  if (briefe) r.push('Dass du mir schreibst. ' + (briefe === 1 ? 'Ein Brief liegt' : briefe + ' Briefe liegen') + ' schon hier drin.');
  if (faeden) r.push('Dass du Gedanken nicht liegen lässt. ' + (faeden === 1 ? 'Ein Faden' : faeden + ' Fäden') + ' bis jetzt.');
  if (lieb >= 3) r.push('Dass du mir verraten hast, was du magst.');
  return r.slice(0, 3);
}
BAU.mag = function (p) {
  kopf(p, 'Das mag ich an dir', null);
  mk('p', 'c6r-at-frage', p, '… an dir, ' + carlName() + '. Schreibst du.');
  var m = Array.isArray(A().mag) ? A().mag : [];
  [0, 1, 2].forEach(function (k) { feld(p, null, m[k], function (a, v) { if (!Array.isArray(a.mag)) a.mag = []; a.mag[k] = v; }, { max: 90, hand: true, aria: 'Das mag ich an ' + carlName() + ', Zeile ' + (k + 1), platz: k === 0 ? 'dass du …' : '' }); });
  mk('p', 'c6r-at-frage c6r-at-abstand', p, '… an dir, ' + (du().name || 'du') + '. Schreibt ' + carlName() + '.');
  var ul = mk('ul', 'c6r-at-mag', p), z = carlMag();
  if (!z.length) z = ['Ich lerne dich noch kennen. Sobald ich etwas Echtes über dich weiß, steht es hier.'];
  z.forEach(function (t, i) { var li = mk('li', 'c6r-at-carlschrift', ul); var s = mk('span', 'c6r-at-handlauf', li, t); s.style.animationDelay = (0.3 + i * 0.7) + 's'; });
  mk('p', 'c6r-at-fussnote', p, 'Ich schreibe nur hin, was ich wirklich gesehen habe.');
};
// Pläne: was wir noch vorhaben; Geschafftes wandert nach Damals
BAU.plaene = function (p) {
  kopf(p, 'Pläne', 'Was wir noch vorhaben.');
  var ul = mk('ul', 'c6r-at-plaene', p);
  var leer = mk('p', 'c6r-at-carlschrift c6r-at-leer', p, 'Noch kein Plan. Der erste darf klein sein.');
  function pruefLeer() { leer.hidden = !!ul.children.length; }
  function zeile(x, neu) {
    var li = mk('li', 'c6r-at-plan' + (x.fertig ? ' c6r-at-plan-fertig' : ''), ul);
    var k = mk('label', 'c6r-at-haken', li);
    var cb = mk('input', null, k); cb.type = 'checkbox'; cb.checked = !!x.fertig;
    mk('span', 'c6r-at-plan-t c6r-at-duschrift', k, x.t);
    var st = mk('span', 'c6r-at-geschafft', li, x.fertig ? 'geschafft · ' + datum(x.fertig) : '');
    var weg = mk('button', 'c6r-at-weg', li, '✕'); weg.type = 'button'; weg.setAttribute('aria-label', 'Plan streichen: ' + x.t);
    cb.onchange = function () {
      var t = cb.checked ? Date.now() : 0;
      aendern(function (a) { (a.plaene || []).forEach(function (y) { if (y.id === x.id) { if (t) y.fertig = t; else delete y.fertig; } }); });
      li.classList.toggle('c6r-at-plan-fertig', !!t);
      st.textContent = t ? 'geschafft · ' + datum(t) : '';
      st.classList.remove('c6r-at-stempelt'); if (t && !ruhig()) { void st.offsetWidth; st.classList.add('c6r-at-stempelt'); }
    };
    weg.onclick = function () {
      if (!weg.classList.contains('c6r-at-sicher')) { weg.classList.add('c6r-at-sicher'); weg.textContent = 'streichen?'; setTimeout(function () { weg.classList.remove('c6r-at-sicher'); weg.textContent = '✕'; }, 2600); return; }
      aendern(function (a) { a.plaene = (a.plaene || []).filter(function (y) { return y.id !== x.id; }); });
      li.remove(); pruefLeer();
    };
    // ein Plan kann der nächste Schritt in einem Space werden: Carl trägt ihn hinüber
    var hin = mk('div', 'c6r-at-plan-hin', li);
    function zeigeHin() {
      hin.textContent = '';
      var f = x.sid && fadenVon(x.sid);
      if (f && !x.fertig) {
        mk('span', 'c6r-at-carlschrift', hin, 'Nächster Schritt in „' + f.titel + '“');
        var g = mk('button', 'c6r-at-hingehen', hin, 'Hingehen ›'); g.type = 'button';
        g.onclick = function () { zuSpace(x.sid); };
      } else if (!x.fertig && raumFuerPlan().length) {
        var t = mk('button', 'c6r-at-inspace', hin, 'In einen Space legen'); t.type = 'button';
        t.onclick = function () { waehleSpace(x, hin, zeigeHin); };
      }
    }
    zeigeHin();
    var altOn = cb.onchange; cb.onchange = function () { altOn(); x.fertig = cb.checked ? Date.now() : 0; zeigeHin(); };
    if (neu && !ruhig()) li.classList.add('c6r-at-kleb');
  }
  (A().plaene || []).forEach(function (x) { zeile(x); });
  pruefLeer();
  var form = mk('form', 'c6r-at-schreib c6r-at-planform', p);
  var i = mk('input', 'c6r-at-feld c6r-at-hand', form); i.type = 'text'; i.maxLength = 90; i.placeholder = 'Was wir noch machen …'; i.setAttribute('aria-label', 'Neuer Plan'); i.setAttribute('autocomplete', 'off');
  var b = mk('button', 'c6r-at-knopf', form, 'Dazuschreiben'); b.type = 'submit';
  form.onsubmit = function (e) {
    e.preventDefault();
    var t = i.value.trim(); if (!t) { i.focus(); return; }
    var x = { id: 'p' + Date.now().toString(36), t: t.slice(0, 90), ts: Date.now() };
    aendern(function (a) { if (!Array.isArray(a.plaene)) a.plaene = []; a.plaene.push(x); if (a.plaene.length > 30) a.plaene.splice(0, a.plaene.length - 30); });
    i.value = ''; zeile(x, true); pruefLeer();
  };
};
// ---------- Rückwege ins Ganze ----------
function faedenListe() { var s = S(); var l = (C6.strings && C6.strings.alle) ? C6.strings.alle() : (s.strings || []); return (l || []).filter(function (f) { return f && f.id && f.titel && f.art !== 'gewohnheit'; }); }
function fadenVon(id) { return faedenListe().filter(function (f) { return f.id === id; })[0] || null; }
// die drei Spaces, in denen zuletzt etwas war
function raumFuerPlan() {
  if (!C6.bausteine || typeof C6.bausteine.setze !== 'function') return [];
  var sp = S().spaces || {};
  return faedenListe().filter(function (f) { return sp[f.id]; }).sort(function (a, b) { return ((sp[b.id].besucht || b.erstellt || 0) - (sp[a.id].besucht || a.erstellt || 0)); }).slice(0, 3);
}
function zuSpace(sid) { zu(); setTimeout(function () { try { if (C6.space && C6.space.oeffne) C6.space.oeffne(sid); else C6.geh('space', { string: sid }); } catch (e) {} }, ruhig() ? 0 : 320); }
function waehleSpace(x, hin, fertig) {
  hin.textContent = '';
  var box = mk('div', 'c6r-at-wahl1', hin); box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'In welchen Space?');
  raumFuerPlan().forEach(function (f) {
    var b = mk('button', 'c6r-at-w1', box); b.type = 'button';
    var r = mk('span', 'c6r-at-w1-rund', b, '›'); r.style.background = f.farbe || '#2f5f8a';
    mk('span', null, b, f.titel);
    b.onclick = function () {
      try { C6.bausteine.setze(f.id, 'naechster', { daten: { t: x.t } }); } catch (e) { return; }
      aendern(function (a) { (a.plaene || []).forEach(function (y) { if (y.id === x.id) y.sid = f.id; }); });
      x.sid = f.id; fertig();
    };
  });
  var n = mk('button', 'c6r-at-w1 c6r-at-w1-nein', box, 'Doch nicht'); n.type = 'button'; n.onclick = fertig;
}
// Unser Jahr: zwölf Monate, jeder Punkt ein echter Moment, ein Wort pro Monat von dir
var MON3 = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
var PUNKT = { erste: '#e3b23c', faden: '#2f5f8a', kern: '#d62a26', knoten: '#6b5aa0', perle: '#8ea37a', plan: '#e8621a', brief: '#b9837a' };
BAU.jahr = function (p) {
  var jetzt = new Date(), y = jetzt.getFullYear(), heute = jetzt.getMonth();
  kopf(p, 'Unser Jahr ' + y, 'Jeder Punkt ist ein Moment von uns.');
  var nach = {};
  var alle = momente().alle.concat(A().briefe.map(function (b) { return { art: 'brief', was: 'Brief an ' + carlName(), t: b.t, ts: b.ts }; }));
  alle.forEach(function (x) { if (!x.ts) return; var d = new Date(x.ts); if (d.getFullYear() !== y) return; (nach[d.getMonth()] || (nach[d.getMonth()] = [])).push(x); });
  var grid = mk('div', 'c6r-at-jahr', p); grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', 'Monate');
  var unten = mk('div', 'c6r-at-monat', p), knoepfe = [];
  function wortVon(m) { return ((A().jahr || {})[y + '-' + m]) || ''; }
  for (var m = 0; m < 12; m++) (function (m) {
    var b = mk('button', 'c6r-at-mo' + (m > heute ? ' c6r-at-mo-spaeter' : '') + (m === heute ? ' c6r-at-mo-jetzt' : ''), grid); b.type = 'button';
    mk('span', 'c6r-at-mo-name', b, MON3[m]);
    var pk = mk('span', 'c6r-at-mo-punkte', b);
    (nach[m] || []).slice(0, 12).forEach(function (x) { var i = mk('i', null, pk); i.style.background = x.farbe || PUNKT[x.art] || '#8a8378'; });
    var w = mk('span', 'c6r-at-mo-wort c6r-at-duschrift', b, wortVon(m));
    b.setAttribute('aria-label', MON[m] + ', ' + (nach[m] || []).length + ' Momente' + (wortVon(m) ? ', ' + wortVon(m) : ''));
    b.onclick = function () { waehle(m); };
    knoepfe.push({ b: b, w: w });
  })(m);
  function waehle(m) {
    knoepfe.forEach(function (k, i) { k.b.setAttribute('aria-pressed', i === m ? 'true' : 'false'); });
    unten.textContent = '';
    var liste = nach[m] || [];
    mk('h3', 'c6r-at-mo-titel', unten, MON[m] + (liste.length ? ' · ' + (liste.length === 1 ? 'ein Moment' : liste.length + ' Momente') : ''));
    if (!liste.length) mk('p', 'c6r-at-carlschrift c6r-at-mo-leer', unten, m > heute ? 'Kommt noch.' : 'Da war es still zwischen uns. Auch gut.');
    var ul = mk('ul', 'c6r-at-mo-liste', unten);
    liste.slice(-4).forEach(function (x) { var li = mk('li', null, ul); var i = mk('i', null, li); i.style.background = x.farbe || PUNKT[x.art] || '#8a8378'; mk('span', null, li, x.was + (x.t && x.art !== 'erste' ? ': ' + x.t : x.t ? ': „' + x.t + '“' : '')); });
    feld(unten, 'Ein Wort für den ' + MON[m], wortVon(m), function (a, v) { if (!a.jahr || typeof a.jahr !== 'object') a.jahr = {}; a.jahr[y + '-' + m] = v; }, { max: 24, hand: true, dann: function (v) { knoepfe[m].w.textContent = v; } });
  }
  waehle(heute);
};
// Reihenfolge des Buchs: am Computer liegen je zwei Seiten, die zusammengehören, nebeneinander
var REIHE = ['titel', 'du', 'lieblings', 'mag', 'carl', 'fuerdich', 'plaene', 'jahr', 'damals', 'brief', 'geraet', 'code'];
var NAMEN = { titel: 'Innendeckel', du: 'Du', lieblings: 'Lieblingsdinge', mag: 'Das mag ich an dir', carl: 'Carl über sich', fuerdich: 'Was ich für dich tue', plaene: 'Pläne', jahr: 'Unser Jahr', damals: 'Damals', brief: 'Briefe an Carl', anhang: 'Anhang', geraet: 'Dein Gerät', code: 'Claude Code', ende: 'Hinterdeckel' };
// Seitennamen von außen: Kapitel der Bibliothek ('baut', 'ueber:tun', 'text' …) und alte Namen
var UMWEG = { baut: 'du', ton: 'du', tun: 'fuerdich', nie: 'fuerdich', text: 'du', ueber: 'du', inhalt: 'du', freund: 'lieblings', lieb: 'lieblings', staerker: 'geraet', modelle: 'geraet', anhang: 'geraet', ende: 'code' };
var KAPITEL = [['du', 'Wer du bist'], ['baut', 'Woran du baust'], ['tun', 'Was ich tun soll'], ['nie', 'Was ich nie tun soll'], ['ton', 'Dein Ton'], ['damals', 'Damals']];
function seiteId(x) {
  if (!x) return null;
  x = String(x).replace(/^ueber:/, '');
  if (REIHE.indexOf(x) >= 0) return x;
  return UMWEG[x] || null;
}

function carlSagt(p, t) {
  var z = p.querySelector('.c6r-at-sagt') || mk('p', 'c6r-at-sagt c6r-at-carlschrift', p);
  z.textContent = t;
}
function selbstNachsehen() {
  var n = navigator, teile = [];
  try {
    var pl = (n.userAgentData && n.userAgentData.platform) || n.platform || '';
    if (/mac/i.test(pl)) teile.push('ein Mac'); else if (/win/i.test(pl)) teile.push('ein Windows-Rechner'); else if (/linux/i.test(pl)) teile.push('Linux'); else if (/iphone|ipad|ios/i.test(pl + n.userAgent)) teile.push('ein iPhone oder iPad');
    if (n.hardwareConcurrency) teile.push(n.hardwareConcurrency + ' Rechenkerne');
    if (n.deviceMemory) teile.push('mindestens ' + n.deviceMemory + ' GB Speicher (der Browser rundet)');
    teile.push('Bildschirm ' + screen.width + ' × ' + screen.height);
  } catch (e) {}
  return (teile.length ? 'Ich sehe: ' + teile.join(', ') + '.' : 'Ich sehe nichts.') + ' Mehr verrät mir der Browser nicht.';
}
var denkenStand = null;
function pruefeDenken() {
  if (denkenStand !== null) return Promise.resolve(denkenStand);
  return Promise.resolve().then(function () { return window.claude && window.claude.use ? window.claude.use('sample') : null; })
    .then(function (f) { denkenStand = typeof f === 'function'; return denkenStand; }, function () { denkenStand = false; return false; });
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
  if (id !== 'titel' && id !== 'ende') mk('span', 'c6r-at-seitenzahl', p, String(i));
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
  E.nr.textContent = seite === 0 ? (bis > 1 ? 'Innendeckel · ' + NAMEN[REIHE[1]] : 'Innendeckel') : (bis - seite > 1 ? 'Seite ' + seite + '–' + (bis - 1) : 'Seite ' + seite) + ' · ' + NAMEN[REIHE[seite]];
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
var REITER = [['du', 'Du', '#e9c9a8'], ['lieblings', 'Lieblinge', '#f1dc9a'], ['carl', 'Carl', '#c9d7b0'], ['plaene', 'Pläne', '#b9d3d6'], ['damals', 'Damals', '#d9c3df'], ['brief', 'Briefe', '#efc1b8'], ['geraet', 'Gerät', '#cfc8bb']];
function reiterStand() {
  if (!E || !E.reiter) return;
  var akt = null, bei = function (i) { var t = REITER.filter(function (x) { return REIHE.indexOf(x[0]) === i; })[0]; return t && t[0]; };
  REITER.forEach(function (x) { if (REIHE.indexOf(x[0]) <= seite) akt = x[0]; });
  akt = bei(seite) || (proAnsicht() === 2 && bei(seite + 1)) || akt;
  E.reiter.forEach(function (b) { var an = b.dataset.id === akt; b.classList.toggle('c6r-at-reit-an', an); if (an) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
}
// Inhalt: ein Tipp auf die Seitenangabe zeigt alle Kapitel
function listeZu() { if (E && E.liste && !E.liste.hidden) { E.liste.hidden = true; E.nr.setAttribute('aria-expanded', 'false'); } }

var vorherFokus = null, zuAnim = [];
function oeffne(o) {
  o = o || {};
  bau();
  if (offen) { if (o.seite) geheZu(o.seite); return; }
  zuAnim.forEach(function (x) { try { x.onfinish = null; x.cancel(); } catch (e) {} }); zuAnim = [];
  offen = true; C6.atlas.offen = true;
  vorherFokus = D.activeElement;
  D.documentElement.classList.add('c6r-at-auf');
  E.r.hidden = false;
  var sid = seiteId(o.seite); var i = sid ? REIHE.indexOf(sid) : Math.min(REIHE.length - 1, A().seite || 0);
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
  var fertig = function () { E.r.hidden = true; D.documentElement.classList.remove('c6r-at-auf'); try { vorherFokus && vorherFokus.focus && vorherFokus.focus({ preventScroll: true }); } catch (e) {} };
  if (!ruhig() && E.buch.animate) {
    var ag = E.grund.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
    var an = E.buch.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(30px) scale(.9)', opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
    zuAnim = [an, ag];
    an.onfinish = function () { fertig(); zuAnim = []; try { an.cancel(); ag.cancel(); } catch (e) {} };
  } else fertig();
  try { C6.bus && C6.bus.emit('atlas', { offen: false }); } catch (e) {}
}

C6.atlas = { modell: modellInfo, oeffne: oeffne, zu: zu, offen: false, ueber: true, kapitel: KAPITEL.map(function (k) { return { id: k[0], seite: 'ueber:' + k[0], titel: k[1] }; }), seiten: function () { return REIHE.slice(); }, quelle: QUELLE };
// Raumwechsel schließt das Buch
try { C6.bus && C6.bus.on('raum', function () { if (offen) zu(); }); } catch (e) {}
