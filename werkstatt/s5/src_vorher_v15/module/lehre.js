// Carl bringt es bei: drei kleine Seiten, auf denen Carl zeigt, wie ein Helfer für dich arbeitet.
// Jede Seite: ein Bild aus Kreis und Quadrat, Carls Sätze, nummerierte Schritte mit dem Ergebnis daneben,
// eine Übung, die man in der App selbst macht. Haken bleiben (S.lehre). Nichts hier spielt etwas vor:
// Was der Prototyp nicht kann, steht in Bleistift. Befehle nur aus der geprüften Quelle der Atlas-Seite.
var C6 = window.C6 = window.C6 || {};
var D = document;

function S() { return C6.S || (C6.S = {}); }
function L() {
  var s = S();
  if (!s.lehre || typeof s.lehre !== 'object') s.lehre = {};
  var l = s.lehre;
  if (!l.haken || typeof l.haken !== 'object') l.haken = {};
  if (!l.schritte || typeof l.schritte !== 'object') l.schritte = {};
  if (!l.uebung || typeof l.uebung !== 'object') l.uebung = {};
  return l;
}
function aendern(fn) { if (typeof C6.aendern === 'function') C6.aendern(function () { fn(L()); }); else fn(L()); }
function mk(tag, cls, vater, txt) { var e = D.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; if (vater) vater.appendChild(e); return e; }
function ruhig() { return !!C6.ruhig; }
function stimme(k, w, rueck) { try { var t = C6.stimme && C6.stimme.sag(k, w); return t || rueck || ''; } catch (e) { return rueck || ''; } }
function sagt(k, w, rueck) { var t = stimme(k, w, rueck); if (!t) return; try { if (C6.sag && C6.carl) C6.sag(t); } catch (e) {} }
function emit(d) { try { C6.bus && C6.bus.emit('lehre', d); } catch (e) {} }
function carlName() { try { return (S().du && S().du.carlName) || 'Carl'; } catch (e) { return 'Carl'; } }

// Bilder: nur Kreis, Quadrat, Linie. Quadrat = Werkbank/Seite, Pfeil = Weg; der Helfer bin ich selbst.
var TUSCHE = '#2b2722', BLEI = '#8a8378', ORANGE = '#e8621a', MOOS = '#8ea37a', PAPIER = '#fbf7f0';
function carlBild(px, stimmung) {
  try { if (C6.figur && typeof C6.figur.bild === 'function') { var b = C6.figur.bild(px, { stimmung: stimmung || 'froh' }); if (b && /<svg/i.test(b)) return b; } } catch (e) {}
  return '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="26" rx="18" ry="15" fill="#d9d0c2" stroke="' + TUSCHE + '" stroke-width="2"/></svg>';
}
// Bilder aus Kreis, Quadrat und Linie; Carl selbst steht als Figur darin (C6.figur.bild), nichts Fremdes.
function bild(id) {
  var g = '<g fill="none" stroke="' + TUSCHE + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">', svg;
  if (id === 'harness') svg = '<svg viewBox="0 0 240 150" aria-hidden="true">' + g +
    '<rect x="26" y="52" width="188" height="62" rx="6" fill="' + PAPIER + '"/>' +
    '<path d="M44 114v16M196 114v16"/>' +
    '<rect x="118" y="66" width="34" height="34" rx="3" fill="' + PAPIER + '"/><path d="M126 78h18M126 86h12"/>' +
    '<path d="M96 62q12-12 22 6" stroke-dasharray="4 5" stroke="' + BLEI + '"/>' +
    '<rect x="172" y="70" width="26" height="26" rx="3" fill="' + ORANGE + '" stroke="' + TUSCHE + '"/><path d="M178 83l5 5 9-10" stroke="' + PAPIER + '" stroke-width="2.6"/>' +
    '<path d="M156 83h12" stroke="' + BLEI + '"/>' +
    '<path d="M186 104q-20 34-100 10" stroke-dasharray="4 5" stroke="' + BLEI + '"/><path d="M90 118l-6-6 8-2" stroke="' + BLEI + '"/>' +
    '</g></svg>';
  else if (id === 'auftrag') svg = '<svg viewBox="0 0 240 150" aria-hidden="true">' + g +
    '<rect x="30" y="18" width="70" height="116" rx="10" fill="' + PAPIER + '"/><path d="M56 26h18"/>' +
    '<rect x="42" y="48" width="46" height="12" rx="3" fill="' + ORANGE + '" stroke="none"/>' +
    '<path d="M42 72h46M42 84h30M42 96h40" stroke="' + BLEI + '" stroke-dasharray="3 4"/>' +
    '<path d="M104 58q22-26 44-6" stroke-dasharray="4 5" stroke="' + BLEI + '"/><path d="M144 46l4 6-7 2" stroke="' + BLEI + '"/>' +
    '<rect x="156" y="92" width="40" height="40" rx="4" fill="' + PAPIER + '"/><path d="M165 112l8 8 14-16"/>' +
    '</g></svg>';
  else svg = '<svg viewBox="0 0 240 150" aria-hidden="true">' + g +
    '<rect x="26" y="30" width="118" height="78" rx="6" fill="' + PAPIER + '"/><path d="M60 118h50M26 98h118"/>' +
    '<rect x="38" y="40" width="94" height="50" rx="3" fill="' + TUSCHE + '" stroke="none"/>' +
    '<path d="M46 52h6M56 52h30M46 62h6M56 62h18M46 72h6" stroke="' + PAPIER + '" stroke-width="2.4"/>' +
    '<path d="M148 68h18" stroke="' + BLEI + '" stroke-dasharray="4 5"/><path d="M156 60l-6 8 6 8" stroke="' + BLEI + '"/>' +
    '</g></svg>';
  return '<span class="c6r-le-bildrahmen c6r-le-br-' + id + '">' + svg + '<span class="c6r-le-bild-carl">' + carlBild(64, id === 'auftrag' ? 'froh' : 'ruhig') + '</span></span>';
}
function zeichenKlein() {
  return '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="' + TUSCHE + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="6" y="16" width="36" height="18" rx="3" fill="' + PAPIER + '"/><path d="M11 34v6M37 34v6"/>' +
    '<circle cx="18" cy="16" r="7" fill="' + MOOS + '"/><circle cx="16" cy="15" r="1" fill="' + TUSCHE + '"/><circle cx="20" cy="15" r="1" fill="' + TUSCHE + '"/>' +
    '<rect x="27" y="20" width="10" height="10" rx="2" fill="' + ORANGE + '"/><path d="M29 25l2 2 4-4" stroke="' + PAPIER + '"/></g></svg>';
}

// Befehle: dieselbe Quelle wie die Atlas-Seite „Claude Code“. Nichts darüber hinaus.
function quelle() { try { return (C6.atlas && C6.atlas.quelle) || null; } catch (e) { return null; } }
var QUELLE_RUECK = { url: 'https://code.claude.com/docs/en/setup', name: 'Claude Code Doku · Advanced setup', url2: 'https://code.claude.com/docs/en/quickstart', name2: 'Claude Code Doku · Quickstart', geprueft: '8. Oktober 2026' };

// ---------- Die Blätter ----------
var BLAETTER = [
  {
    id: 'harness', titel: 'Was eine Harness ist', kurz: 'Die Werkbank, an der ein Helfer für dich arbeitet.',
    carl: ['Harness ist dein Wort für eine Werkbank, an der ein Helfer wie ich für dich arbeitet.', 'Du legst einen Auftrag hin, ich mach daraus Schritte, am Ende liegt ein Ergebnis. Das letzte Wort hast du.'],
    schritte: [
      ['Du legst einen Auftrag auf die Werkbank.', 'Ein Satz liegt da.', 'Ein Satz reicht. Je kleiner, desto besser bring ich ihn zu Ende.'],
      ['Der Helfer teilt ihn in Schritte.', 'Eine kurze Liste.', 'Ich schreib mir auf, was nacheinander kommt. So verlier ich nichts.'],
      ['Er arbeitet die Schritte ab, einen nach dem anderen.', 'Nach jedem Schritt etwas Sichtbares.', 'Du musst nicht dabeibleiben. Was fertig ist, bleibt liegen.'],
      ['Du prüfst das Ergebnis.', 'Ein Haken, oder zurück auf die Werkbank.', 'Ich ändere nichts ohne dein Ja.']
    ],
    uebung: { t: 'Häng einen nächsten Schritt an deinen Space.', wie: 'Tipp im Space auf das Plus an der Leine und nimm „Nächster Schritt“.', knopf: 'In den Space', ziel: 'space', pruef: 'baustein' },
    bleistift: 'Im Prototyp bin ich die Werkbank nur zum Üben. Einen echten Auftrag zu Ende bringen kann ich hier noch nicht.'
  },
  {
    id: 'auftrag', titel: 'Dein erster Auftrag am Handy', kurz: 'Wie du einem Helfer eine Aufgabe gibst, die er ohne dich zu Ende bringt.',
    carl: ['Ein guter Auftrag ist klein, klar und prüfbar. Dann kann ein Helfer ihn zu Ende bringen, während du weggehst.', 'Drei Fragen vor dem Abgeben: Ist es eine Sache? Weiß ich, was fertig heißt? Seh ich hinterher, ob es stimmt?'],
    schritte: [
      ['Klein: eine Sache, nicht drei.', 'Ein Auftrag, ein Satz.', 'Statt „Mach die Seite schön“ lieber „Mach die Überschrift größer“.'],
      ['Klar: sag, was fertig heißt.', 'Ein Satz, der mit „fertig ist, wenn“ anfängt.', 'Fertig ist, wenn die Überschrift zweimal so groß ist wie der Text.'],
      ['Prüfbar: wie siehst du, dass es stimmt?', 'Ein Blick, der genügt.', 'Ein Bild, ein Satz, eine Zahl. Was du nicht prüfen kannst, kannst du nicht annehmen.'],
      ['Abgeben und weggehen.', 'Der Helfer arbeitet, du nicht.', 'Du bekommst das Ergebnis, nicht die Arbeit dazwischen.']
    ],
    uebung: { t: 'Schreib mir unten einen Auftrag in einem Satz: klein, klar, prüfbar.', wie: 'Zuhause, in das Feld unten. Ich leg ihn dir hin, und wir schauen zusammen, ob er die drei Fragen besteht.', knopf: 'Zu Carl', ziel: 'zuhause', pruef: 'gesagt' },
    bleistift: 'Zu Ende bringen kann ich deinen Auftrag im Prototyp noch nicht. Hier üben wir das Formulieren.'
  },
  {
    id: 'code', titel: 'Mich mit Claude Code verbinden', kurz: 'Die Hände im Terminal. Die Schritte stehen in unserem Buch.',
    carl: ['Mit Claude Code könnte ich auf deinem Computer arbeiten: lesen, bauen, aufräumen. Nur mit deinem Ja.', 'Die Schritte dafür stehen schon in unserem Buch, auf der Seite „Claude Code“, mit Haken zum Abhaken. Ich schreib sie hier nicht noch einmal.'],
    schritte: [],
    buch: 'code',
    uebung: { t: 'Hak im Buch ab, was du schon hast, bis zur Versionsnummer.', wie: 'Die Seite „Claude Code“ im Buch hat die Schritte mit Haken. Der Haken bei „prüfen“ zählt hier.', knopf: 'Ins Buch', ziel: 'atlas', pruef: 'atlasPruefen' },
    bleistift: 'Mich anschließen gibt es noch nicht.'
  }
];
function blatt(id) { for (var i = 0; i < BLAETTER.length; i++) if (BLAETTER[i].id === id) return BLAETTER[i]; return null; }

// ---------- Ebene ----------
var E = null, offen = false, jetzt = null;
function bau() {
  if (E) return E;
  var r = mk('div', 'c6r-le', D.body);
  r.id = 'c6r-lehre'; r.hidden = true;
  r.setAttribute('role', 'dialog'); r.setAttribute('aria-modal', 'true'); r.setAttribute('aria-label', 'Carl bringt es bei');
  r.setAttribute('data-c6-kein-wisch', '');
  r.innerHTML =
    '<div class="c6r-le-grund" aria-hidden="true"></div>' +
    '<div class="c6r-le-blatt" tabindex="-1"><div class="c6r-le-innen"></div></div>' +
    '<button type="button" class="c6r-le-zu" aria-label="Seite weglegen">✕</button>' +
    '<div class="c6r-le-fuss"><button type="button" class="c6r-le-regal">‹ Alle Seiten</button><span class="c6r-le-nr" aria-live="polite"></span><button type="button" class="c6r-le-vor">Nächstes ›</button></div>';
  var q = function (c) { return r.querySelector(c); };
  E = { r: r, grund: q('.c6r-le-grund'), blatt: q('.c6r-le-blatt'), innen: q('.c6r-le-innen'), zu: q('.c6r-le-zu'), regal: q('.c6r-le-regal'), vor: q('.c6r-le-vor'), nr: q('.c6r-le-nr') };
  E.zu.onclick = zu; E.grund.onclick = zu;
  E.regal.onclick = function () { zeige(null, -1); };
  E.vor.onclick = function () { var i = index(jetzt); zeige(i < 0 ? BLAETTER[0].id : (i + 1 < BLAETTER.length ? BLAETTER[i + 1].id : null), 1); };
  ['pointerdown', 'pointermove', 'pointerup', 'touchstart', 'touchmove', 'touchend', 'wheel'].forEach(function (n) { r.addEventListener(n, function (e) { e.stopPropagation(); }, { passive: true }); });
  addEventListener('keydown', function (e) {
    if (!offen) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); if (jetzt) zeige(null, -1); else zu(); }
  }, true);
  return E;
}
function index(id) { for (var i = 0; i < BLAETTER.length; i++) if (BLAETTER[i].id === id) return i; return -1; }

function kopierZeile(vater, befehl) {
  var z = mk('div', 'c6r-le-befehl', vater);
  var c = mk('code', null, z, befehl);
  var b = mk('button', 'c6r-le-kopie', z, 'Kopieren'); b.type = 'button';
  b.setAttribute('aria-label', 'Befehl kopieren: ' + befehl);
  b.onclick = function () {
    var ok = function () { b.textContent = 'Kopiert'; setTimeout(function () { b.textContent = 'Kopieren'; }, 1400); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(befehl).then(ok, function () { markiere(c); });
      else markiere(c);
    } catch (e) { markiere(c); }
  };
}
function markiere(c) { try { var s = getSelection(), rg = D.createRange(); rg.selectNodeContents(c); s.removeAllRanges(); s.addRange(rg); } catch (e) {} }

// ---------- das Regal: alle Blätter ----------
function regal(p) {
  var l = L();
  mk('p', 'c6r-le-kicker', p, carlName() + ' bringt’s bei');
  mk('h2', 'c6r-le-titel', p, 'Drei Seiten');
  mk('p', 'c6r-le-carl', p, stimme('lehre.auf', null, 'Drei Seiten, auf denen ich dir zeig, wie ein Helfer für dich arbeitet. Welche zuerst?'));
  var ol = mk('ol', 'c6r-le-liste', p);
  BLAETTER.forEach(function (b, i) {
    var li = mk('li', null, ol);
    var k = mk('button', 'c6r-le-karte' + (l.haken[b.id] ? ' c6r-le-hat' : ''), li); k.type = 'button';
    k.style.setProperty('--i', i);
    var bi = mk('span', 'c6r-le-karte-bild', k); bi.innerHTML = bild(b.id);
    var t = mk('span', 'c6r-le-karte-text', k);
    mk('b', null, t, (i + 1) + ' · ' + b.titel);
    mk('span', null, t, b.kurz);
    mk('i', 'c6r-le-haken', k, l.haken[b.id] ? '✓' : '').setAttribute('aria-hidden', 'true');
    k.setAttribute('aria-label', 'Seite ' + (i + 1) + ': ' + b.titel + (l.haken[b.id] ? ', Übung gemacht' : ''));
    k.onclick = function () { zeige(b.id, 1); };
  });
  var n = BLAETTER.filter(function (b) { return l.haken[b.id]; }).length;
  mk('p', 'c6r-le-blei', p, n ? n + ' von ' + BLAETTER.length + ' Übungen gemacht. Die Haken bleiben.' : 'Ein Haken kommt, wenn du die Übung in der App machst. Keine Pflicht.');
}

// ---------- eine Seite ----------
function lehrblatt(p, b) {
  var l = L(), i = index(b.id);
  mk('p', 'c6r-le-kicker', p, carlName() + ' bringt’s bei · Seite ' + (i + 1) + ' von ' + BLAETTER.length);
  mk('h2', 'c6r-le-titel', p, b.titel);
  var bi = mk('div', 'c6r-le-bild', p); bi.innerHTML = bild(b.id);
  b.carl.forEach(function (s) { mk('p', 'c6r-le-carl', p, s); });

  // Lehrblatt: Schritt links, Ergebnis daneben, Carls Satz darunter
  if (b.schritte.length) { var kopf = mk('div', 'c6r-le-kopfzeile', p); mk('span', null, kopf, 'Schritt'); mk('span', null, kopf, 'Ergebnis'); }
  var ol = mk('ol', 'c6r-le-schritte', p);
  if (b.buch) {
    var bu = mk('div', 'c6r-le-buch', p);
    var bk = mk('button', 'c6r-le-knopf', bu, 'Zur Seite „Claude Code“ im Buch'); bk.type = 'button';
    bk.onclick = function () { zu(); try { if (C6.jetzt !== 'bibliothek' && C6.geh) C6.geh('bibliothek'); setTimeout(function () { C6.atlas && C6.atlas.oeffne && C6.atlas.oeffne({ seite: b.buch }); }, C6.jetzt === 'bibliothek' ? 0 : 560); } catch (e) {} };
  }
  var q = quelle() || QUELLE_RUECK;
  b.schritte.forEach(function (s, k) {
    var li = mk('li', 'c6r-le-schritt' + (s[3] === 'bald' ? ' c6r-le-bald' : ''), ol);
    li.style.setProperty('--i', k);
    var z = mk('div', 'c6r-le-zeile', li);
    var lab = mk('div', 'c6r-le-sch', z);
    mk('span', 'c6r-le-nrz', lab, String(k + 1));
    mk('span', 'c6r-le-was', lab, s[0]);
    mk('span', 'c6r-le-erg', z, s[1]);
    mk('p', 'c6r-le-carl c6r-le-klein', li, s[2]);
    if (s[3] === 'install') {
      var g = (S().atlas && S().atlas.geraet && S().atlas.geraet.art) || '';
      var INSTALL = installBefehle();
      var wahl = g === 'win' ? ['ps', 'winget'] : g === 'mac' ? ['mac', 'brew'] : ['mac', 'ps'];
      wahl.forEach(function (w) { if (INSTALL[w]) { mk('span', 'c6r-le-fuer', li, INSTALL[w].name); kopierZeile(li, INSTALL[w].befehl); } });
    }
    if (s[3] === 'pruefen') { mk('span', 'c6r-le-fuer', li, 'zeigt eine Versionsnummer'); kopierZeile(li, 'claude --version'); }
    if (s[3] === 'start') { mk('span', 'c6r-le-fuer', li, 'im Ordner deines Projekts'); kopierZeile(li, 'claude'); }
  });
  if (b.id === 'code') {
    var qz = mk('p', 'c6r-le-quelle', p);
    qz.appendChild(D.createTextNode('Befehle wörtlich aus der offiziellen Doku, geprüft am ' + q.geprueft + ': '));
    var a1 = mk('a', null, qz, q.name); a1.href = q.url; a1.target = '_blank'; a1.rel = 'noopener';
    qz.appendChild(D.createTextNode(' · '));
    var a2 = mk('a', null, qz, q.name2); a2.href = q.url2; a2.target = '_blank'; a2.rel = 'noopener';
  }

  // Übung: in der App, nicht auf der Seite
  var u = mk('section', 'c6r-le-uebung' + (l.haken[b.id] ? ' c6r-le-hat' : ''), p);
  u.setAttribute('aria-label', 'Übung');
  mk('p', 'c6r-le-ukicker', u, 'Übung');
  mk('p', 'c6r-le-ut', u, b.uebung.t);
  mk('p', 'c6r-le-blei', u, b.uebung.wie);
  var zeile = mk('div', 'c6r-le-uzeile', u);
  var kn = mk('button', 'c6r-le-knopf', zeile, l.haken[b.id] ? 'Noch einmal' : b.uebung.knopf); kn.type = 'button';
  var st = mk('span', 'c6r-le-ust', zeile, l.haken[b.id] ? '✓ gemacht' : (l.uebung[b.id] ? 'wartet' : ''));
  kn.onclick = function () { uebungLos(b); };
  if (b.bleistift) mk('p', 'c6r-le-blei c6r-le-ehrlich', p, b.bleistift);
}
function installBefehle() {
  // dieselben Befehle wie die Atlas-Seite; fehlt sie, dieselben Wörter aus derselben Quelle
  return {
    mac: { name: 'macOS, Linux, WSL', befehl: 'curl -fsSL https://claude.ai/install.sh | bash' },
    brew: { name: 'Homebrew', befehl: 'brew install --cask claude-code' },
    ps: { name: 'Windows PowerShell', befehl: 'irm https://claude.ai/install.ps1 | iex' },
    winget: { name: 'Windows WinGet', befehl: 'winget install Anthropic.ClaudeCode' }
  };
}

// ---------- Übungen: in der App, der Haken bleibt ----------
function uebungLos(b) {
  var u = b.uebung;
  if (u.pruef === 'baustein' && !(C6.bausteine && typeof C6.bausteine.setze === 'function')) {
    // das Regal mit Bausteinen steht noch nicht: ehrlich, nichts vorspielen
    hinweis(stimme('lehre.nochNicht', null, 'Das gibt es noch nicht.') + ' Das Regal mit den Bausteinen wird gerade gebaut. Die Übung wartet hier.');
    aendern(function (x) { x.uebung[b.id] = Date.now(); });
    return;
  }
  aendern(function (x) { x.uebung[b.id] = Date.now(); });
  zu();
  try {
    if (u.ziel === 'atlas') { if (C6.atlas && C6.atlas.oeffne) { if (C6.jetzt !== 'bibliothek' && C6.geh) C6.geh('bibliothek'); setTimeout(function () { C6.atlas.oeffne({ seite: 'code' }); }, C6.jetzt === 'bibliothek' ? 0 : 560); } }
    else if (u.ziel && C6.raeume && C6.raeume[u.ziel]) {
      if (C6.jetzt !== u.ziel) C6.geh(u.ziel);
      if (u.ziel === 'zuhause') setTimeout(function () { try { C6.eingabe && C6.eingabe.fokus && C6.eingabe.fokus(); } catch (e) {} }, 520);
    }
  } catch (e) {}
  setTimeout(function () { sagt('lehre.uebung', null, 'Jetzt du. Die Übung machst du in der App, nicht auf der Seite.'); }, 700);
}
function hinweis(t) {
  if (!E) return;
  var h = E.blatt.querySelector('.c6r-le-hinweis') || mk('p', 'c6r-le-hinweis c6r-le-blei', E.innen);
  h.textContent = t;
  try { h.scrollIntoView({ block: 'nearest', behavior: ruhig() ? 'auto' : 'smooth' }); } catch (e) {}
}
function hakenSetzen(id) {
  var l = L();
  if (l.haken[id] || !l.uebung[id]) return false;
  aendern(function (x) { x.haken[id] = true; delete x.uebung[id]; });
  emit({ offen: offen, id: id, was: 'haken' });
  setTimeout(function () { sagt('lehre.geschafft', null, 'Du hast es gemacht. Der Haken bleibt, auch wenn du die App zumachst.'); }, 900);
  if (offen) zeige(jetzt, 0);
  return true;
}
function hoeren() {
  if (!C6.bus) return;
  C6.bus.on('baustein', function (d) { if (d && d.was === 'neu') hakenSetzen('harness'); });
  C6.bus.on('gesagt', function (d) { if (d && d.t && String(d.t).trim().length >= 8) hakenSetzen('auftrag'); });
  C6.bus.on('raum', function () { if (offen) zu(); });
  C6.bus.on('zustand', function () { try { var a = S().atlas; if (a && a.schritte && a.schritte.pruefen) hakenSetzen('code'); } catch (e) {} });
  C6.bus.on('atlas', function (d) { if (d && d.offen && offen) zu(); });
}

// ---------- zeigen ----------
function zeige(id, richtung) {
  bau();
  var b = id ? blatt(id) : null;
  jetzt = b ? b.id : null;
  var innen = E.innen, alt = innen;
  var neu = mk('div', 'c6r-le-innen');
  if (b) lehrblatt(neu, b); else regal(neu);
  E.blatt.replaceChild(neu, alt); E.innen = neu;
  E.blatt.scrollTop = 0;
  E.r.classList.toggle('c6r-le-imregal', !b);
  E.regal.hidden = !b;
  var i = index(jetzt);
  E.vor.textContent = !b ? 'Erste Seite ›' : (i + 1 < BLAETTER.length ? 'Nächste ›' : 'Zur Übersicht ›');
  E.nr.textContent = b ? (i + 1) + ' / ' + BLAETTER.length : '';
  if (!ruhig() && richtung && neu.animate) {
    neu.animate([{ opacity: 0, transform: 'translateY(' + (richtung > 0 ? 14 : -10) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.22,.8,.26,1)' });
  }
  try { E.blatt.focus({ preventScroll: true }); } catch (e) {}
  aendern(function (x) { x.seite = jetzt || ''; });
}
function oeffne(id) {
  bau();
  try { if (C6.atlas && C6.atlas.offen && C6.atlas.zu) C6.atlas.zu(); } catch (e) {}
  var war = offen;
  offen = true; C6.lehre.offen = true;
  E.r.hidden = false;
  D.documentElement.classList.add('c6r-le-auf');
  zeige(id && blatt(id) ? id : null, war ? 1 : 0);
  if (!ruhig() && !war && E.blatt.animate) E.blatt.animate([{ opacity: 0, transform: 'translateY(26px) scale(.985)' }, { opacity: 1, transform: 'translateY(-4px) scale(1.004)', offset: 0.7 }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,.8,.26,1)' });
  emit({ offen: true, id: jetzt, was: 'auf' });
  return C6.lehre;
}
function zu() {
  if (!offen || !E) return;
  offen = false; C6.lehre.offen = false;
  D.documentElement.classList.remove('c6r-le-auf');
  var r = E.r;
  var fertig = function () { if (!offen) r.hidden = true; };
  if (!ruhig() && E.blatt.animate) { var a = E.blatt.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(12px)' }], { duration: 200, easing: 'ease-in' }); a.onfinish = fertig; setTimeout(fertig, 260); }
  else fertig();
  emit({ offen: false, id: jetzt, was: 'zu' });
}

C6.lehre = {
  alle: function () { var l = L(); return BLAETTER.map(function (b) { return { id: b.id, titel: b.titel, kurz: b.kurz, haken: !!l.haken[b.id] }; }); },
  oeffne: oeffne,
  zu: zu,
  offen: false,
  zeichen: zeichenKlein
};

// Als Baustein im Space: ein kleines Regal mit den vier Blättern
try {
  if (C6.bausteine && typeof C6.bausteine.registriere === 'function') {
    C6.bausteine.registriere({
      id: 'harness', name: carlName() + ' bringt’s bei', zeichen: zeichenKlein(), kurz: 'Drei Seiten: wie ein Helfer für dich arbeitet.',
      bauen: function (el) {
        var w = mk('div', 'c6r-le-bs', el);
        mk('p', 'c6r-le-carl', w, stimme('baustein.harness.anlegen', null, 'Hier bring ich dir bei, wie ein Helfer für dich arbeitet. Drei kleine Seiten.'));
        var ul = mk('ul', 'c6r-le-bs-liste', w);
        var l = L();
        BLAETTER.forEach(function (b, i) {
          var li = mk('li', null, ul);
          var k = mk('button', 'c6r-le-bs-k' + (l.haken[b.id] ? ' c6r-le-hat' : ''), li); k.type = 'button';
          mk('span', 'c6r-le-bs-nr', k, String(i + 1));
          mk('span', null, k, b.titel);
          mk('i', 'c6r-le-haken', k, l.haken[b.id] ? '✓' : '').setAttribute('aria-hidden', 'true');
          k.onclick = function () { oeffne(b.id); };
        });
        return w;
      }
    });
  }
} catch (e) {}

hoeren();
