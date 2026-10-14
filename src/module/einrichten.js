// Einrichten · ein Katalog für alles, was man gestalten kann (Space, UFO). Ziehen und ablegen, oder tippen und in den Raum tippen.
var C6 = window.C6 = window.C6 || {};

function S() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(fn);
  else { fn(S()); try { C6.speichern && C6.speichern(); } catch (e) {} }
}
function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function st(k, rueck) { try { var t = C6.stimme && C6.stimme.sag(k); if (t) return t; } catch (e) {} return rueck; }
function sag(t) { try { C6.sag && C6.sag(t, { merken: false }); } catch (e) {} }
var T = '#2b2722', P = '#fbf7f0';
var SW = ' stroke="' + T + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';

/* ---------- Zeichnungen (Breite 100, Fußpunkt unten Mitte) ---------- */
function bild(vbH, inhalt) { return { vb: '0 0 100 ' + vbH, svg: '<svg viewBox="0 0 100 ' + vbH + '" aria-hidden="true" focusable="false">' + inhalt + '</svg>', ar: vbH / 100 }; }
var Z = {
  bank: function () { return bild(56, '<path d="M8 22H92V30H8Z" fill="#c99a6b"' + SW + '/><path d="M10 6H90V16H10Z" fill="#dcb489"' + SW + '/><path d="M16 16V22M84 16V22" stroke="' + T + '" stroke-width="3"/><path d="M14 30L10 54M86 30L90 54M50 30V50" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/>'); },
  sessel: function () { return bild(86, '<path d="M14 30C14 10 30 4 50 4C70 4 86 10 86 30V58H14Z" fill="#8a6bb0"' + SW + '/><path d="M24 50H76V64H24Z" fill="#a58bc6"' + SW + '/><path d="M4 40C4 32 18 32 18 40V70H4Z M82 40C82 32 96 32 96 40V70H82Z" fill="#7a5ca0"' + SW + '/><path d="M4 66H96V74H4Z" fill="#7a5ca0"' + SW + '/><path d="M12 74V84M88 74V84" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/><path d="M32 18Q50 12 68 18" fill="none" stroke="#c4b0dd" stroke-width="3" stroke-linecap="round"/>'); },
  tisch: function () { return bild(66, '<path d="M30 6h22v12H30Z" fill="' + P + '"' + SW + '/><path d="M52 10q8 0 8 4t-8 4" fill="none" stroke="' + T + '" stroke-width="2.4"/><path d="M60 8l10-4 4 14H62Z" fill="#6f9a5b"' + SW + '/><path d="M2 18H98V26H2Z" fill="#c99a6b"' + SW + '/><path d="M10 26L8 64M90 26L92 64" stroke="' + T + '" stroke-width="4.4" stroke-linecap="round"/><path d="M10 26L8 64M90 26L92 64" stroke="#a9784c" stroke-width="2" stroke-linecap="round"/>'); },
  regal: function () { var b = '', f = ['#c8463d', '#3f6f9a', '#e2b93b', '#6f9a5b', '#8a6bb0', '#c9805a'], i; for (i = 0; i < 6; i++) b += '<path d="M' + (16 + i * 11) + ' ' + (20 + (i % 2) * 3) + 'h8V40h-8Z" fill="' + f[i] + '"' + SW.replace('2.4', '1.8') + '/>'; for (i = 0; i < 4; i++) b += '<path d="M' + (18 + i * 16) + ' ' + (62 + (i % 2) * 3) + 'h10V82h-10Z" fill="' + f[5 - i] + '"' + SW.replace('2.4', '1.8') + '/>'; return bild(120, '<path d="M8 4H92V116H8Z" fill="#c99a6b"' + SW + '/><path d="M14 10H86V110H14Z" fill="#6f5038"/><path d="M12 40H88M12 82H88" stroke="' + T + '" stroke-width="3.4"/>' + b + '<path d="M60 108q8-18 18 0Z" fill="#8ea37a"' + SW.replace('2.4', '1.8') + '/>'); },
  topf: function () { return bild(110, '<path d="M50 70C36 56 26 34 34 14C46 26 54 46 50 70Z" fill="#8ea37a"' + SW + '/><path d="M50 70C52 44 58 24 78 12C80 38 66 58 50 70Z" fill="#a4b68f"' + SW + '/><path d="M50 70C42 52 44 36 58 26C62 46 58 60 50 70Z" fill="#7d9468"' + SW + '/><path d="M26 70H74L68 106H32Z" fill="#c9805a"' + SW + '/><path d="M20 70H80" stroke="' + T + '" stroke-width="4.4" stroke-linecap="round"/>'); },
  kaktus: function () { return bild(118, '<path d="M42 82V24Q50 8 58 24V82Z" fill="#6f9a5b"' + SW + '/><path d="M42 52H30V36Q24 30 22 40V58H42M58 44H70V30Q76 24 78 34V54H58" fill="#6f9a5b"' + SW + '/><path d="M50 16V80M30 40v14M70 34v14" stroke="#a4c08f" stroke-width="1.8" stroke-dasharray="2 5"/><circle cx="50" cy="12" r="5" fill="#e39aae"' + SW.replace('2.4', '1.8') + '/><path d="M28 82H72L66 114H34Z" fill="#e8dcc6"' + SW + '/><path d="M24 82H76" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/>'); },
  sonnenblume: function () { var b = '', i; for (i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; b += '<ellipse cx="' + (50 + Math.cos(a) * 15).toFixed(1) + '" cy="' + (26 + Math.sin(a) * 15).toFixed(1) + '" rx="8" ry="4" transform="rotate(' + (a * 180 / Math.PI).toFixed(0) + ' ' + (50 + Math.cos(a) * 15).toFixed(1) + ' ' + (26 + Math.sin(a) * 15).toFixed(1) + ')" fill="#e2b93b"' + SW.replace('2.4', '1.6') + '/>'; } return bild(150, '<path d="M50 40V120" stroke="#5f7f3e" stroke-width="4"/><path d="M50 84Q30 70 26 88Q40 94 50 88M50 100Q70 86 74 104Q60 110 50 104" fill="#8ea37a"' + SW.replace('2.4', '1.8') + '/>' + b + '<circle cx="50" cy="26" r="11" fill="#8a5f3f"' + SW + '/><path d="M28 118H72L66 148H34Z" fill="#c9805a"' + SW + '/><path d="M24 118H76" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/>'); },
  baeumchen: function () { return bild(160, '<path d="M46 150V92Q44 80 50 70Q56 80 54 92V150Z" fill="#8a5f3f"' + SW + '/><path d="M50 8C24 8 10 30 18 52C6 62 12 88 34 88C40 98 62 98 68 88C90 88 96 62 82 52C90 30 76 8 50 8Z" fill="#7d9468"' + SW + '/><path d="M34 40q8-8 16 0M54 60q8-8 16 0M28 66q6-6 12 0" fill="none" stroke="#a4b68f" stroke-width="3" stroke-linecap="round"/><circle cx="64" cy="34" r="4" fill="#c8463d"' + SW.replace('2.4', '1.4') + '/><circle cx="36" cy="58" r="4" fill="#c8463d"' + SW.replace('2.4', '1.4') + '/><path d="M24 150H76" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/>'); },
  stehlampe: function () { return bild(200, '<ellipse class="c6e-schein" cx="50" cy="40" rx="48" ry="40" fill="#ffd58a" opacity=".32"/><path d="M26 54L36 18H64L74 54Z" fill="#f3dfae"' + SW + '/><path d="M50 54V192" stroke="' + T + '" stroke-width="4"/><path d="M30 194Q50 186 70 194" fill="none" stroke="' + T + '" stroke-width="5" stroke-linecap="round"/><path d="M42 24L36 48" stroke="#fff6dc" stroke-width="3" stroke-linecap="round"/>'); },
  laterne: function () { return bild(150, '<ellipse class="c6e-schein" cx="50" cy="40" rx="40" ry="34" fill="#ffd58a" opacity=".35"/><path d="M50 4v8M38 14h24l6 8H32Z" fill="' + T + '" stroke="' + T + '" stroke-width="2.4" stroke-linejoin="round"/><path d="M34 22H66V62H34Z" fill="#fde7a8"' + SW + '/><path d="M50 22V62M34 42H66" stroke="' + T + '" stroke-width="1.6"/><path d="M30 62H70V68H30Z" fill="' + T + '"/><path d="M50 68V146M38 146H62" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/>'); },
  lichterkette: function () { var b = '', f = ['#e2b93b', '#c8463d', '#8db4d6', '#6f9a5b', '#e39aae'], i; for (i = 0; i < 9; i++) { var x = 8 + i * 10.5, y = 18 + Math.sin(i / 8 * Math.PI) * 14; b += '<circle class="c6e-funkel" style="animation-delay:' + (i * .4) + 's" cx="' + x.toFixed(1) + '" cy="' + (y + 6).toFixed(1) + '" r="4" fill="' + f[i % 5] + '"' + SW.replace('2.4', '1.4') + '/>'; } return bild(70, '<path d="M4 14V68M96 14V68" stroke="#8a5f3f" stroke-width="4" stroke-linecap="round"/><path d="M4 16Q50 46 96 16" fill="none" stroke="' + T + '" stroke-width="1.6"/>' + b); },
  staffelei: function () { return bild(140, '<path d="M30 136L46 30M70 136L54 30M50 30V136" stroke="#a9784c" stroke-width="4" stroke-linecap="round"/><path d="M16 22H84V82H16Z" fill="' + P + '"' + SW + '/><path d="M22 74L40 46L52 62L62 50L78 74Z" fill="#7d9468"' + SW.replace('2.4', '1.6') + '/><circle cx="66" cy="36" r="6" fill="#e2b93b"/><path d="M12 84H88" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/>'); },
  meerbild: function () { return bild(140, '<path d="M30 136L46 30M70 136L54 30M50 30V136" stroke="#a9784c" stroke-width="4" stroke-linecap="round"/><path d="M16 22H84V82H16Z" fill="#dbe7f0"' + SW + '/><path d="M16 60Q30 52 44 60T72 60T84 58V82H16Z" fill="#3f6f9a"/><path d="M30 46l8-10 8 10Z" fill="' + P + '" stroke="' + T + '" stroke-width="1.6"/><path d="M38 46v8" stroke="' + T + '" stroke-width="1.6"/><path d="M12 84H88" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/>'); },
  teppichrund: function () { return bild(26, '<ellipse cx="50" cy="13" rx="48" ry="11" fill="#c9805a"' + SW + '/><ellipse cx="50" cy="13" rx="36" ry="7.6" fill="none" stroke="#e8b08c" stroke-width="2.4" stroke-dasharray="4 4"/><ellipse cx="50" cy="13" rx="14" ry="3.6" fill="#e2b93b"/>'); },
  laeufer: function () { var b = '', i; for (i = 0; i < 9; i++) b += '<path d="M' + (12 + i * 9.5) + ' 5v16" stroke="' + (i % 2 ? '#8db4d6' : '#f3efe8') + '" stroke-width="5"/>'; return bild(26, '<path d="M8 4H92V22H8Z" fill="#3f6f9a"' + SW + '/>' + b + '<path d="M8 4V22M92 4V22" stroke="' + T + '" stroke-width="2.4"/><path d="M4 6v14M96 6v14" stroke="#cfc5b3" stroke-width="2" stroke-dasharray="1.5 2"/>'); },
  flicken: function () { var b = '', f = ['#e3c88a', '#8db4d6', '#e39aae', '#a7c08f', '#f3efe8', '#e0a879'], i; for (i = 0; i < 6; i++) b += '<path d="M' + (8 + i * 14) + ' 4h14v18h-14z" fill="' + f[i] + '" stroke="' + T + '" stroke-width="1.4"/>'; return bild(26, b + '<path d="M8 4H92V22H8Z" fill="none"' + SW + '/>'); }
};

/* ---------- Katalog ---------- */
var REIHEN = [
  { id: 'moebel', name: 'Möbel' }, { id: 'pflanzen', name: 'Pflanzen' }, { id: 'lampen', name: 'Lampen' },
  { id: 'bilder', name: 'Bilder' }, { id: 'teppiche', name: 'Teppiche' }
];
function K(id, reihe, name, preis, z, breite) { var b = Z[z](); return { id: id, reihe: reihe, name: name, preis: preis, svg: b.svg, ar: b.ar, breite: breite }; }
var KATALOG = [
  K('bank', 'moebel', 'Bank', 0, 'bank', .2), K('sessel', 'moebel', 'Sessel', 0, 'sessel', .16), K('tisch', 'moebel', 'Tisch mit Tasse', 4, 'tisch', .18), K('regal', 'moebel', 'Bücherregal', 6, 'regal', .14),
  K('topf', 'pflanzen', 'Topfpflanze', 0, 'topf', .09), K('kaktus', 'pflanzen', 'Kaktus', 0, 'kaktus', .07), K('sonnenblume', 'pflanzen', 'Sonnenblume', 3, 'sonnenblume', .08), K('baeumchen', 'pflanzen', 'Apfelbäumchen', 5, 'baeumchen', .16),
  K('stehlampe', 'lampen', 'Stehlampe', 0, 'stehlampe', .08), K('laterne', 'lampen', 'Laterne', 3, 'laterne', .07), K('lichterkette', 'lampen', 'Lichterkette', 0, 'lichterkette', .24),
  K('staffelei', 'bilder', 'Bild: Hügel', 0, 'staffelei', .11), K('meerbild', 'bilder', 'Bild: Meer', 0, 'meerbild', .11),
  K('teppichrund', 'teppiche', 'Runder Teppich', 0, 'teppichrund', .26), K('laeufer', 'teppiche', 'Läufer', 0, 'laeufer', .28), K('flicken', 'teppiche', 'Flickenteppich', 5, 'flicken', .28)
];
var NACH = {}; KATALOG.forEach(function (k) { NACH[k.id] = k; });

/* ---------- UFO ---------- */
var UFO_REIHEN = [
  { id: 'farbe', name: 'Farbe', wahl: [{ id: 'silber', name: 'Silber', f: '#d9dde2', preis: 0 }, { id: 'kupfer', name: 'Kupfer', f: '#d08a5c', preis: 0 }, { id: 'minze', name: 'Minze', f: '#a9d4bf', preis: 3 }, { id: 'nacht', name: 'Nachtblau', f: '#3b4a78', preis: 4 }] },
  { id: 'licht', name: 'Licht', wahl: [{ id: 'gold', name: 'Gold', f: '#f0a830', preis: 0 }, { id: 'tuerkis', name: 'Türkis', f: '#3fb8b0', preis: 0 }, { id: 'rosa', name: 'Rosa', f: '#e88aa8', preis: 3 }, { id: 'bunt', name: 'Bunt', f: 'bunt', preis: 5 }] },
  { id: 'kuppel', name: 'Kuppel', wahl: [{ id: 'rund', name: 'Rund', preis: 0 }, { id: 'hoch', name: 'Hoch', preis: 0 }, { id: 'bullauge', name: 'Bullauge', preis: 4 }] },
  { id: 'antenne', name: 'Antenne', wahl: [{ id: 'keine', name: 'Keine', preis: 0 }, { id: 'kugel', name: 'Kugel', preis: 0 }, { id: 'spirale', name: 'Spirale', preis: 3 }, { id: 'keimblatt', name: 'Keimblatt', preis: 5 }] }
];
function ufoWahl(r, id) { var w = null; UFO_REIHEN.forEach(function (x) { if (x.id === r) x.wahl.forEach(function (y) { if (y.id === id) w = y; }); }); return w; }
function ton(hex, amt) {
  var m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return hex;
  var n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function k(v) { return Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt)))); }
  return '#' + ((1 << 24) + (k(r) << 16) + (k(g) << 8) + k(b)).toString(16).slice(1);
}
function ufoSvg(c, zu) {
  c = c || {};
  var f = (ufoWahl('farbe', c.farbe) || UFO_REIHEN[0].wahl[0]).f, L = (ufoWahl('licht', c.licht) || UFO_REIHEN[1].wahl[0]).f;
  var BUNT = ['#c8463d', '#e2b93b', '#6f9a5b', '#4f7cac', '#8a6bb0'];
  var s = '<svg class="c6e-ufo" viewBox="0 0 160 120" aria-hidden="true" focusable="false">';
  // Lichtkegel nach unten (nur wach)
  if (!zu) s += '<path class="c6e-ufo-kegel" d="M58 74L36 118H124L102 74Z" fill="' + (L === 'bunt' ? '#f3e7b8' : L) + '" opacity=".22"/>';
  // Antenne
  var a = c.antenne || 'kugel';
  if (a === 'kugel') s += '<path d="M80 22V8" stroke="' + T + '" stroke-width="2.4"/><circle cx="80" cy="7" r="4.4" fill="' + (L === 'bunt' ? BUNT[0] : L) + '"' + SW.replace('2.4', '2') + '/>';
  if (a === 'spirale') s += '<path d="M80 22C72 18 88 14 80 10C72 6 88 2 80 -1" fill="none" stroke="' + T + '" stroke-width="2.2" stroke-linecap="round"/>';
  if (a === 'keimblatt') s += '<path d="M80 22V12" stroke="' + T + '" stroke-width="2.4"/><path d="M80 12C70 12 64 4 68 0C76 0 80 6 80 12ZM80 12C90 12 96 4 92 0C84 0 80 6 80 12Z" fill="#8ea37a"' + SW.replace('2.4', '1.8') + '/>';
  // Kuppel
  var k = c.kuppel || 'rund';
  if (k === 'hoch') s += '<path d="M56 50C56 22 68 14 80 14C92 14 104 22 104 50Z" fill="#dbe7f0" fill-opacity=".75"' + SW + '/>';
  else if (k === 'bullauge') s += '<path d="M54 50C54 30 66 22 80 22C94 22 106 30 106 50Z" fill="' + ton(f, -0.15) + '"' + SW + '/><circle cx="80" cy="38" r="9" fill="#dbe7f0"' + SW + '/><circle cx="80" cy="38" r="12" fill="none" stroke="#c9a03a" stroke-width="2.4"/>';
  else s += '<path d="M54 50C54 32 66 22 80 22C94 22 106 32 106 50Z" fill="#dbe7f0" fill-opacity=".75"' + SW + '/>';
  if (k !== 'bullauge') s += '<path d="M64 42C64 34 70 28 78 27" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>';
  // Untertasse
  s += '<ellipse cx="80" cy="56" rx="62" ry="14" fill="' + f + '"' + SW + '/>' +
    '<path d="M22 60Q80 82 138 60Q132 72 104 76H56Q28 72 22 60Z" fill="' + ton(f, -0.28) + '"' + SW + '/>' +
    '<path d="M30 52Q80 44 130 52" fill="none" stroke="' + ton(f, 0.5) + '" stroke-width="2.4" stroke-linecap="round"/>';
  for (var i = 0; i < 5; i++) {
    var x = 44 + i * 18, col = L === 'bunt' ? BUNT[i] : L;
    s += '<circle class="c6e-ufo-licht" style="animation-delay:' + (i * .35) + 's" cx="' + x + '" cy="' + (66 + (i === 0 || i === 4 ? -2 : 0)) + '" r="3.6" fill="' + (zu ? '#9a948b' : col) + '"' + SW.replace('2.4', '1.4') + '/>';
  }
  if (zu) s += '<g class="c6e-ufo-schloss"><path d="M72 88v-6a8 8 0 0 1 16 0v6" fill="none" stroke="' + T + '" stroke-width="3"/><rect x="68" y="88" width="24" height="18" rx="4" fill="#e2b93b"' + SW + '/><circle cx="80" cy="96" r="2.4" fill="' + T + '"/></g>';
  return s + '</svg>';
}

/* ---------- Zustand ---------- */
function E() {
  var s = S();
  if (!s.einrichten || typeof s.einrichten !== 'object') s.einrichten = {};
  if (!s.einrichten.orte || typeof s.einrichten.orte !== 'object') s.einrichten.orte = {};
  if (!Array.isArray(s.einrichten.besitz)) s.einrichten.besitz = [];
  if (!s.einrichten.ufo || typeof s.einrichten.ufo !== 'object') s.einrichten.ufo = { farbe: 'silber', licht: 'gold', kuppel: 'rund', antenne: 'kugel' };
  return s.einrichten;
}
function ortSchl(o) {
  if (!o) return '';
  if (typeof o === 'string') return o;
  if (o.ort === 'space') return o.sid ? 'space:' + o.sid : '';
  return o.ort || '';
}
function hat(id) { var k = NACH[id]; return !!k && (k.preis === 0 || E().besitz.indexOf(id) >= 0); }
function hatUfo(r, id) { var w = ufoWahl(r, id); return !!w && (w.preis === 0 || E().besitz.indexOf('ufo:' + r + ':' + id) >= 0); }
function dinge(o) {
  var key = ortSchl(o); if (!key || key === 'ufo') return [];
  var l = E().orte[key]; if (!Array.isArray(l)) return [];
  return l.map(function (d) { var k = NACH[d.id]; if (!k) return null; return { id: d.id, uid: d.uid, svg: k.svg, x: d.x, y: d.y, breite: k.breite, verhaeltnis: k.ar, name: k.name }; }).filter(Boolean);
}
function geaendert(key, extra) {
  var d = { ort: key }; if (/^space:/.test(key)) d.sid = key.slice(6);
  for (var k in extra || {}) d[k] = extra[k];
  emit('einrichten', d);
}
function bezahle(preis) {
  if (!preis) return true;
  if (!C6.muenzen || !C6.muenzen.ausgeben(preis)) { sag(st('einrichten.zuwenig', 'Dafür reichen die Münzen noch nicht. Im Kieselpark gibt es welche.')); return false; }
  return true;
}

/* ---------- Das Blatt „Einrichten“ ---------- */
var blatt = null, auf = null, wahl = null, griffe = null, reihe = 'moebel', gewaehlt = null;
function buehne() { return document.querySelector('.c6-buehne[data-raum="' + (C6.jetzt || '') + '"]') || document.getElementById('c6'); }
function flaeche() {
  if (auf && auf.flaeche && auf.flaeche.isConnected) return auf.flaeche;
  var b = buehne(); return (b && b.querySelector('.c6z-sp-einr')) || null;
}
function baue() {
  blatt = document.createElement('div');
  blatt.className = 'c6e-blatt'; blatt.setAttribute('role', 'dialog'); blatt.setAttribute('aria-label', 'Einrichten');
  blatt.setAttribute('data-c6-kein-wisch', ''); blatt.setAttribute('data-c6-bild', '');
  blatt.innerHTML = '<div class="c6e-kopf"><b class="c6e-titel">Einrichten</b><span class="c6e-hinweis" aria-live="polite"></span><button type="button" class="c6e-fertig">Fertig</button></div>' +
    '<div class="c6e-reihen" role="tablist"></div><div class="c6e-karten" role="list"></div><div class="c6e-tun" hidden></div>';
  blatt.querySelector('.c6e-fertig').onclick = function () { if (gewaehlt) { gewaehlt = null; fangAn(false); malKarten(); return; } zu(); };
}
function hinweis(t) { if (blatt) blatt.querySelector('.c6e-hinweis').textContent = t || ''; }
function reihenListe() {
  if (auf.ort === 'ufo') return UFO_REIHEN.map(function (r) { return { id: r.id, name: r.name }; });
  var l = REIHEN.slice();
  if (auf.ort === 'space' && C6.space && C6.space.themen) l.push({ id: 'thema', name: 'Licht & Boden' });
  return l;
}
function malReihen() {
  var box = blatt.querySelector('.c6e-reihen'); box.innerHTML = '';
  reihenListe().forEach(function (r) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-reihe' + (r.id === reihe ? ' c6e-an' : '');
    b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', r.id === reihe); b.textContent = r.name;
    b.onclick = function () { reihe = r.id; gewaehlt = null; malReihen(); malKarten(); };
    box.appendChild(b);
  });
}
function preisHtml(preis, besitzt) {
  if (besitzt) return preis ? 'deins' : 'frei';
  return (C6.muenzen ? C6.muenzen.muenze(16) : '') + '<span>' + preis + '</span>';
}
function malKarten() {
  var box = blatt.querySelector('.c6e-karten'); box.innerHTML = '';
  blatt.classList.remove('c6e-klein'); blatt.querySelector('.c6e-fertig').textContent = 'Fertig';
  if (auf.ort === 'ufo') return malUfoKarten(box);
  if (reihe === 'thema') return malThemen(box);
  KATALOG.filter(function (k) { return k.reihe === reihe; }).forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-karte' + (gewaehlt === k.id ? ' c6e-gewaehlt' : '');
    b.dataset.id = k.id; b.setAttribute('role', 'listitem');
    b.setAttribute('aria-label', k.name + (hat(k.id) ? '' : ', ' + k.preis + ' Münzen') + '. Tippen, dann in den Raum tippen. Oder auf den Raum ziehen.');
    b.innerHTML = '<span class="c6e-bild">' + k.svg + '</span><span class="c6e-name">' + esc(k.name) + '</span><span class="c6e-preis">' + preisHtml(k.preis, hat(k.id)) + '</span>';
    b.addEventListener('pointerdown', function (e) { ziehStart(e, k, b); });
    b.addEventListener('click', function () { if (zug && zug.bewegt) return; waehle(k.id); });
    box.appendChild(b);
  });
  hinweis(gewaehlt ? st('einrichten.tippen', 'Tipp in den Raum, wo es stehen soll.') : (C6.geraet === 'computer' ? st('einrichten.ziehen', 'Auf den Raum ziehen oder antippen.') : 'Antippen, dann in den Raum tippen.'));
  var klein = !!gewaehlt && C6.geraet !== 'computer';
  blatt.classList.toggle('c6e-klein', klein);
  blatt.querySelector('.c6e-fertig').textContent = gewaehlt ? 'Abbrechen' : 'Fertig';
}
function malThemen(box) {
  var T0 = {}; try { T0 = C6.space.themen() || {}; } catch (e) {}
  var jetzt = {}; try { jetzt = C6.space.thema(auf.sid) || {}; } catch (e) {}
  ['licht', 'boden'].forEach(function (art) {
    var l = T0[art] || []; if (!l.length) return;
    var kopf = document.createElement('span'); kopf.className = 'c6e-themakopf'; kopf.textContent = art === 'licht' ? 'Licht' : 'Boden'; box.appendChild(kopf);
    l.forEach(function (t) {
      var id = t.id != null ? t.id : t, name = t.name || t.t || id;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-chip' + ((jetzt[art] || '') === id ? ' c6e-an' : '');
      b.textContent = name;
      b.onclick = function () { var o = {}; o[art] = id; try { C6.space.thema(auf.sid, o); } catch (e) {} geaendert('space:' + auf.sid, { thema: true }); malKarten(); };
      box.appendChild(b);
    });
  });
  hinweis('');
}
function malUfoKarten(box) {
  var r = null; UFO_REIHEN.forEach(function (x) { if (x.id === reihe) r = x; }); if (!r) { reihe = 'farbe'; r = UFO_REIHEN[0]; }
  var cfg = E().ufo;
  r.wahl.forEach(function (w) {
    var c = {}; for (var k in cfg) c[k] = cfg[k]; c[r.id] = w.id;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-karte' + (cfg[r.id] === w.id ? ' c6e-gewaehlt' : '');
    b.setAttribute('aria-pressed', cfg[r.id] === w.id);
    b.innerHTML = '<span class="c6e-bild c6e-bild-ufo">' + ufoSvg(c) + '</span><span class="c6e-name">' + esc(w.name) + '</span><span class="c6e-preis">' + preisHtml(w.preis, hatUfo(r.id, w.id)) + '</span>';
    b.onclick = function () {
      if (!hatUfo(r.id, w.id)) { if (!bezahle(w.preis)) return; aendern(function () { E().besitz.push('ufo:' + r.id + ':' + w.id); }); }
      aendern(function () { E().ufo[r.id] = w.id; });
      geaendert('ufo'); malKarten();
    };
    box.appendChild(b);
  });
  hinweis('');
}
function waehle(id) {
  gewaehlt = gewaehlt === id ? null : id;
  malKarten(); fangAn(!!gewaehlt);
}
// Tipp-Platzieren: eine durchsichtige Ebene über dem Raum fängt den nächsten Tipp
function fangAn(an) {
  var f = flaeche(); if (!f) return;
  var b = buehne();
  if (!wahl) {
    wahl = document.createElement('div'); wahl.className = 'c6e-fang'; wahl.setAttribute('data-c6-kein-wisch', '');
    wahl.addEventListener('click', function (e) { if (!gewaehlt) return; var p = punkt(e.clientX, e.clientY); if (p) stelle(gewaehlt, p.x, p.y); });
  }
  if (an) { b.appendChild(wahl); legeUeber(wahl, f); } else if (wahl.parentNode) wahl.parentNode.removeChild(wahl);
}
function legeUeber(el, f) {
  var b = buehne().getBoundingClientRect(), r = f.getBoundingClientRect();
  el.style.left = (r.left - b.left) + 'px'; el.style.top = (r.top - b.top) + 'px'; el.style.width = r.width + 'px'; el.style.height = r.height + 'px';
}
function punkt(cx, cy) {
  var f = flaeche(); if (!f) return null;
  var r = f.getBoundingClientRect(); if (!r.width) return null;
  var br = blatt && blatt.isConnected ? blatt.getBoundingClientRect() : null;
  if (br && cx >= br.left && cx <= br.right && cy >= br.top && cy <= br.bottom) return null;
  var x = (cx - r.left) / r.width, y = (cy - r.top) / r.height;
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000 };
}
function carlNah(x, y) {
  var z = (auf && auf.frei) || []; return z.some(function (q) { return q && q.was !== 'leine' && x > q.x - .04 && x < q.x + q.w + .04 && y > q.y && y < q.y + q.h + .06; });
}
function stelle(id, x, y) {
  var k = NACH[id]; if (!k || !auf) return;
  if (!hat(id)) { if (!bezahle(k.preis)) return; aendern(function () { E().besitz.push(id); }); }
  var key = ortSchl(auf);
  aendern(function () { var o = E().orte; o[key] = o[key] || []; o[key].push({ uid: 'd' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), id: id, x: x, y: y }); });
  geaendert(key);
  gewaehlt = null; fangAn(false); malKarten(); malGriffe();
  if (carlNah(x, y)) sag(st('einrichten.frei', 'Da steh ich. Ein Stück weiter?')); else sag(st('einrichten.steht', 'Steht. Schön hier.'));
  try { if (C6.carl && C6.carl.huepf && !C6.ruhig) C6.carl.huepf(8); } catch (e) {}
}
/* ---------- Ziehen (Computer und Finger) ---------- */
var zug = null;
function ziehStart(e, k, karte) {
  if (e.button != null && e.button !== 0) return;
  zug = { k: k, x0: e.clientX, y0: e.clientY, bewegt: false, geist: null, id: e.pointerId };
  try { karte.setPointerCapture(e.pointerId); } catch (x) {}
  karte.onpointermove = function (ev) {
    if (!zug) return;
    var dx = ev.clientX - zug.x0, dy = ev.clientY - zug.y0;
    if (!zug.bewegt && Math.hypot(dx, dy) < 8) return;
    // am iPhone scrollt die Kartenreihe waagrecht: ziehen erst, wenn der Finger klar nach oben geht
    if (!zug.bewegt && ev.pointerType !== 'mouse' && Math.abs(dy) < Math.abs(dx) * 1.2) { zug = null; return; }
    if (!zug.bewegt) { zug.bewegt = true; zug.geist = document.createElement('div'); zug.geist.className = 'c6e-geist'; zug.geist.innerHTML = k.svg; document.body.appendChild(zug.geist); }
    zug.geist.style.left = ev.clientX + 'px'; zug.geist.style.top = ev.clientY + 'px';
    ev.preventDefault();
  };
  karte.onpointerup = karte.onpointercancel = function (ev) {
    karte.onpointermove = karte.onpointerup = karte.onpointercancel = null;
    if (!zug) return;
    var z = zug; setTimeout(function () { if (zug === z) zug = null; }, 0);
    if (z.geist) z.geist.remove();
    if (z.bewegt && ev.type === 'pointerup') { var p = punkt(ev.clientX, ev.clientY); if (p) stelle(z.k.id, p.x, p.y); else hinweis(st('einrichten.blatt', 'Leg es in den Raum, nicht aufs Blatt.')); }
  };
}
/* ---------- Griffe an gestellten Dingen: verschieben, weg damit ---------- */
var gewaehltDing = null;
function malGriffe() {
  if (!auf || auf.ort === 'ufo') return;
  var f = flaeche(), b = buehne(); if (!f) return;
  if (!griffe) { griffe = document.createElement('div'); griffe.className = 'c6e-griffe'; griffe.setAttribute('data-c6-kein-wisch', ''); }
  if (griffe.parentNode !== b) b.appendChild(griffe);
  legeUeber(griffe, f);
  griffe.innerHTML = '';
  var key = ortSchl(auf);
  (E().orte[key] || []).forEach(function (d) {
    var k = NACH[d.id]; if (!k) return;
    var g = document.createElement('button'); g.type = 'button'; g.className = 'c6e-griff' + (gewaehltDing === d.uid ? ' c6e-an' : '');
    g.style.left = (d.x * 100) + '%'; g.style.top = (d.y * 100) + '%';
    g.setAttribute('aria-label', k.name + ': ziehen zum Verschieben, tippen zum Auswählen');
    g.innerHTML = '<i></i><span>' + esc(k.name) + '</span>';
    g.addEventListener('pointerdown', function (e) { griffZieh(e, d, g); });
    griffe.appendChild(g);
  });
  var tun = blatt.querySelector('.c6e-tun');
  if (gewaehltDing && (E().orte[key] || []).some(function (d) { return d.uid === gewaehltDing; })) {
    var k0 = null; (E().orte[key] || []).forEach(function (d) { if (d.uid === gewaehltDing) k0 = NACH[d.id]; });
    tun.hidden = false; tun.innerHTML = '<span>' + esc(k0 ? k0.name : '') + '</span><button type="button" class="c6e-weg">Weg damit</button>';
    tun.querySelector('.c6e-weg').onclick = function () {
      aendern(function () { E().orte[key] = (E().orte[key] || []).filter(function (d) { return d.uid !== gewaehltDing; }); });
      gewaehltDing = null; geaendert(key); malGriffe(); sag(st('einrichten.weg', 'Weggeräumt.'));
    };
  } else { tun.hidden = true; tun.innerHTML = ''; }
}
function griffZieh(e, d, g) {
  e.preventDefault();
  var x0 = e.clientX, y0 = e.clientY, bewegt = false, key = ortSchl(auf);
  try { g.setPointerCapture(e.pointerId); } catch (x) {}
  g.onpointermove = function (ev) {
    if (!bewegt && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
    bewegt = true;
    var p = punkt(ev.clientX, ev.clientY); if (!p) return;
    g.style.left = (p.x * 100) + '%'; g.style.top = (p.y * 100) + '%'; g._p = p;
  };
  g.onpointerup = g.onpointercancel = function () {
    g.onpointermove = g.onpointerup = g.onpointercancel = null;
    if (bewegt && g._p) {
      var p = g._p;
      aendern(function () { (E().orte[key] || []).forEach(function (q) { if (q.uid === d.uid) { q.x = p.x; q.y = p.y; } }); });
      geaendert(key);
    } else gewaehltDing = gewaehltDing === d.uid ? null : d.uid;
    malGriffe();
  };
}

/* ---------- auf / zu ---------- */
function oeffne(o) {
  o = o || {};
  if (o.ort === 'ufo' && C6.verbindung && !C6.verbindung.verbunden()) { if (C6.verbindung.oeffne) { C6.verbindung.oeffne(); return false; } sag(st('ufo.zu', 'Das UFO schläft noch. Es wacht auf, wenn du mich mit deinem Rechner verbindest.')); return false; }
  if (o.ort === 'space' && !o.sid) return false;
  if (!blatt) baue();
  auf = o; gewaehlt = null; gewaehltDing = null;
  reihe = o.ort === 'ufo' ? 'farbe' : (o.reihe || 'moebel');
  blatt.classList.toggle('c6e-ufo-blatt', o.ort === 'ufo');
  blatt.querySelector('.c6e-titel').textContent = o.ort === 'ufo' ? 'UFO einrichten' : 'Einrichten';
  var b = buehne(); b.appendChild(blatt); b.classList.add('c6e-modus');
  malReihen(); malKarten(); malGriffe();
  try { blatt.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: C6.ruhig ? 0 : 240, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
  sag(o.ort === 'ufo' ? st('ufo.einrichten', 'Wie soll es aussehen?') : st('einrichten.auf', 'Richte es dir ein, wie du magst.'));
  emit('einrichten', { ort: ortSchl(o), sid: o.sid, modus: true });
  return true;
}
function zu() {
  if (!auf) return;
  var key = ortSchl(auf);
  fangAn(false);
  if (griffe && griffe.parentNode) griffe.parentNode.removeChild(griffe);
  if (blatt && blatt.parentNode) { blatt.parentNode.classList.remove('c6e-modus'); blatt.parentNode.removeChild(blatt); }
  var warUfo = key === 'ufo';
  auf = null; gewaehlt = null; gewaehltDing = null;
  sag(warUfo ? st('ufo.fertig', 'Fertig. Ich steig gleich ein.') : st('einrichten.fertig', 'Jetzt ist es deins.'));
  emit('einrichten', { ort: key, sid: /^space:/.test(key) ? key.slice(6) : undefined, modus: false });
}
if (C6.bus) {
  C6.bus.on('raum', function () { if (auf) zu(); });
  C6.bus.on('muenzen', function () { if (auf) malKarten(); });
}
window.addEventListener('resize', function () { if (auf) { malGriffe(); if (wahl && wahl.parentNode) { var f = flaeche(); if (f) legeUeber(wahl, f); } } });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && auf) { e.stopPropagation(); zu(); } }, true);

C6.einrichten = {
  katalog: KATALOG, reihen: REIHEN,
  dinge: dinge, oeffne: oeffne, zu: zu,
  get offen() { return !!auf; },
  ufo: function () { var u = E().ufo, o = {}; for (var k in u) o[k] = u[k]; return o; },
  ufoSvg: ufoSvg, ufoReihen: UFO_REIHEN
};
