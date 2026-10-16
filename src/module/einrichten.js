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
function sag(t) {
  // am iPhone spricht das offene Blatt in seiner Kopfzeile, nicht in Carls Blase (die läge sonst über Brett, Leine und Zetteln)
  if (auf && blatt) { hinweis(t); return; }
  try { C6.sag && C6.sag(t, { merken: false }); } catch (e) {}
}
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

/* ---------- Ambiente je Ort (s13): Lampen mit eigenem Licht und kleine Dinge, die zum Ort gehören ----------
   Jede Lampe trägt licht (Farbe) und glut (Mitte des Scheins in Zeichnungs-Einheiten); der Space lässt sie leuchten. */
function sw(w) { return ' stroke="' + T + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"'; }
function kreis(cx, cy, r, f, w) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + sw(w || 2) + '/>'; }
function weg(d, f, w) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + sw(w || 2.4) + '/>'; }
function schein(cx, cy, rx, ry, f) { return '<ellipse class="c6e-schein" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + (ry || rx) + '" fill="' + f + '" opacity=".3"/>'; }
var Z2 = {
  // ----- Lampen -----
  kaefig: function (f) { return bild(150, schein(50, 40, 30, 28, f) + weg('M50 4V20') + weg('M36 24Q50 14 64 24L66 50Q50 60 34 50Z', '#fff6dc', 2) + weg('M36 24L34 50M50 20V58M64 24L66 50M35 37H65', null, 2.4) + weg('M42 58H58L56 66H44Z', '#8a8f96') + weg('M50 66V146M36 146H64', null, 4)); },
  fransen: function (f) { var fr = '', i; for (i = 0; i < 9; i++) fr += '<path d="M' + (22 + i * 7) + ' 44v8" stroke="#a4492e" stroke-width="2" stroke-linecap="round"/>'; return bild(110, schein(50, 40, 34, 26, f) + weg('M30 14H70L80 44H20Z', '#e8a98f') + fr + weg('M50 44V96', null, 4) + weg('M34 104Q50 92 66 104Z', '#c9a03a') + weg('M38 20H62', null, 1.6)); },
  flasche: function (f) { return bild(110, schein(50, 26, 22, 22, f) + weg('M50 28c-6-6-3-14 0-20c3 6 6 14 0 20z', '#ffd27a', 1.6) + weg('M50 28V36', null, 2) + weg('M42 36H58V48Q66 56 66 70V104H34V70Q34 56 42 48Z', '#5f7f3e') + weg('M40 74H60', '#fff', 2) + weg('M38 60q6-6 0-14', null, 1.4)); },
  leselampe: function (f) { return bild(150, schein(74, 54, 26, 20, f) + weg('M50 144V40Q50 20 66 18L80 30', null, 4) + weg('M66 30L92 44L82 64L56 50Z', '#4f7cac') + weg('M60 52L84 62', '#ffe9a8', 3) + weg('M32 144H68', null, 6) + kreis(50, 40, 3.4, '#c9a03a', 1.6)); },
  leuchter: function (f) { var k = function (x, y) { return weg('M' + x + ' ' + (y - 4) + 'c-4-4-2-10 0-14c2 4 4 10 0 14z', '#ffd27a', 1.4) + weg('M' + (x - 4) + ' ' + y + 'h8v22h-8z', '#fbf7f0', 1.8); }; return bild(130, schein(50, 30, 40, 28, f) + k(26, 46) + k(50, 30) + k(74, 46) + weg('M30 68Q50 84 70 68M50 52V110M22 68h8M70 68h8', null, 3) + weg('M34 112Q50 102 66 112L70 122H30Z', '#c9a03a')); },
  gluehglas: function (f) { var p = '', i; for (i = 0; i < 6; i++) p += '<circle class="c6e-funkel" style="animation-delay:' + (i * .5) + 's" cx="' + [38, 58, 46, 64, 40, 54][i] + '" cy="' + [40, 34, 56, 52, 68, 70][i] + '" r="2.6" fill="#e4f58a"/>'; return bild(96, schein(50, 54, 34, 34, f) + weg('M34 18H66V28Q74 34 74 46V86Q74 94 64 94H36Q26 94 26 86V46Q26 34 34 28Z', '#e7f1e6', 2.4).replace('fill="#e7f1e6"', 'fill="#e7f1e6" fill-opacity=".7"') + p + weg('M32 10H68V20H32Z', '#a9784c') + weg('M30 46q4 20 2 34', '#fff', 2)); },
  pilzlampe: function (f) { return bild(110, schein(50, 40, 36, 30, f) + weg('M42 58Q40 80 36 104H64Q60 80 58 58Z', '#f3e7cf') + weg('M14 60Q14 18 50 16Q86 18 86 60Q50 66 14 60Z', '#e98a6e') + kreis(34, 38, 5, '#fff3e0', 1.4) + kreis(58, 30, 6, '#fff3e0', 1.4) + kreis(70, 48, 4, '#fff3e0', 1.4) + weg('M28 104H72', null, 3)); },
  windlicht: function (f) { return bild(100, schein(50, 56, 28, 28, f) + weg('M30 24H70V92H30Z', '#f6f1e6').replace('fill="#f6f1e6"', 'fill="#f6f1e6" fill-opacity=".55"') + weg('M50 60c-5-5-3-12 0-16c3 4 5 11 0 16z', '#ffcf6a', 1.4) + weg('M44 60h12v28h-12z', '#fbf7f0', 1.8) + weg('M26 24H74M26 92H74', null, 3.4) + weg('M50 24V8M40 8H60', null, 2.4)); },
  muschellampe: function (f) { var r = '', i; for (i = 0; i < 6; i++) r += '<path d="M50 70L' + (18 + i * 12.8).toFixed(1) + ' ' + (i === 0 || i === 5 ? 40 : 22) + '" stroke="#c98b6b" stroke-width="1.6"/>'; return bild(100, schein(50, 48, 34, 30, f) + weg('M50 72C20 72 10 50 16 38Q30 12 50 12Q70 12 84 38C90 50 80 72 50 72Z', '#fde7d6') + r + weg('M40 72H60L64 94H36Z', '#d9c3a2')); },
  lampion: function (f) { return bild(170, schein(50, 56, 36, 34, f) + weg('M50 4V22', null, 1.6) + weg('M28 30Q50 18 72 30Q82 56 72 82Q50 94 28 82Q18 56 28 30Z', '#f2a65a') + weg('M24 44Q50 52 76 44M22 60Q50 68 78 60M26 76Q50 82 74 76', null, 1.4) + weg('M40 24H60M40 88H60', null, 3) + weg('M50 92V104', null, 1.6) + weg('M50 104l-3 8M50 104l3 8', '#c8463d', 1.4) + weg('M14 168V4H50', null, 3).replace('d="M14 168V4H50"', 'd="M14 168V2H50V4"')); },
  kugel: function (f) { return bild(120, schein(50, 40, 30, 28, f) + kreis(50, 40, 22, '#fff6d6', 2.4) + weg('M40 30q6-6 14-4', '#fff', 2.4) + weg('M50 62V112', null, 3.4) + weg('M40 112H60', null, 4)); },
  haengelampe: function (f) { return bild(150, schein(50, 96, 38, 30, f) + weg('M50 0V60', null, 1.8) + weg('M26 90Q26 62 50 62Q74 62 74 90Z', '#d9dde2') + weg('M24 90H76', null, 3) + weg('M42 90Q50 98 58 90', '#fff3c4', 2) + weg('M36 74q4-6 10-8', '#fff', 2)); },
  notenlampe: function (f) { return bild(150, schein(66, 34, 26, 22, f) + weg('M50 146V60', null, 3.4) + weg('M24 60H76L72 96H28Z', '#f4eee4') + weg('M32 70h28M32 78h22M32 86h26', null, 1.4) + weg('M36 66q2-4 4 0v10', null, 1.4) + weg('M50 60V30H70', null, 2.6) + weg('M64 24H82L78 36H68Z', '#2f5f8a') + weg('M34 146H66', null, 5)); },
  discokugel: function (f) { var q = '', i, j; for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) q += '<rect x="' + (34 + j * 8) + '" y="' + (26 + i * 8) + '" width="7" height="7" fill="' + ((i + j) % 2 ? '#c9cdd4' : '#eef1f5') + '"/>'; return bild(110, schein(50, 42, 40, 36, f) + weg('M50 0V22', null, 1.6) + '<clipPath id="c6e-dk"><circle cx="50" cy="42" r="18"/></clipPath><g clip-path="url(#c6e-dk)">' + q + '</g>' + kreis(50, 42, 18, 'none', 2.4) + '<path class="c6e-funkel" d="M74 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff6c8"/>' + weg('M28 106H72', null, 0)); },
  globuslampe: function (f) { return bild(120, schein(50, 40, 32, 30, f) + kreis(50, 40, 24, '#9fc3dd', 2.4) + weg('M36 30q8-4 12 4q-2 8 6 8q8 2 4 10M60 22q6 4 10 10', '#8ea37a', 1.8) + weg('M26 40A24 24 0 0 0 74 40', null, 1.4) + weg('M50 16V64M24 66Q50 74 76 66', null, 2.4) + weg('M50 66V108M36 110H64', null, 4)); },
  bankerlampe: function (f) { return bild(90, schein(50, 40, 34, 22, f) + weg('M22 40Q22 26 50 26Q78 26 78 40Z', '#3f7a55') + weg('M30 34q10-4 22-4', '#9fd0ad', 2) + weg('M50 40V78', null, 3.4) + weg('M30 80Q50 72 70 80L72 86H28Z', '#c9a03a')); },
  sternlampe: function (f) { return bild(130, schein(50, 40, 34, 32, f) + weg('M50 14l8 16 18 2-13 12 4 18-17-9-17 9 4-18-13-12 18-2z', '#fff3c4') + weg('M50 70V122M36 124H64', null, 3.6)); },
  mondlampe: function (f) { return bild(120, schein(50, 40, 34, 32, f) + kreis(50, 40, 24, '#fbf3dc', 2.4) + kreis(42, 32, 4, '#e8dcbc', 1.2) + kreis(58, 46, 6, '#e8dcbc', 1.2) + kreis(48, 52, 3, '#e8dcbc', 1.2) + weg('M36 64L30 116M64 64L70 116M50 64V112', null, 2.6)); },
  oellampe: function (f) { return bild(96, schein(70, 30, 26, 22, f) + weg('M70 36c-5-5-3-12 0-16c3 4 5 11 0 16z', '#ffcf6a', 1.4) + weg('M20 50Q20 38 44 38H64Q74 38 74 44L66 50Q50 62 30 58Z', '#c8744a') + weg('M14 44q-6 4 0 10l8-2', null, 2.2) + weg('M40 58V86M28 88Q40 80 52 88Z', '#c8744a')); },
  feuerschale: function (f) { return bild(100, schein(50, 40, 40, 30, f) + weg('M34 52c-4-12 6-18 4-28c8 6 10 14 8 20c4-6 2-12 6-16c6 8 6 16 2 24z', '#f08a3a', 1.8) + weg('M42 52c0-8 6-10 6-16c4 6 4 12 2 16z', '#ffd27a', 1.4) + weg('M14 52H86Q80 72 50 72Q20 72 14 52Z', '#6f6a61') + weg('M36 72L28 96M64 72L72 96M50 72V94', null, 3.4)); },
  lagerfeuer: function (f) { return bild(80, schein(50, 40, 40, 30, f) + weg('M40 54c-6-10 2-18 2-28c6 6 8 12 6 18c4-4 4-10 8-14c6 8 6 18 0 24z', '#f08a3a', 1.8) + weg('M46 54c0-6 4-8 4-14c4 4 4 10 2 14z', '#ffd27a', 1.4) + weg('M18 66L82 58M18 58L82 66', '#8a5f3f', 5) + weg('M14 74Q50 66 86 74', null, 2) + kreis(20, 72, 5, '#bdb7a9', 1.6) + kreis(80, 72, 5, '#bdb7a9', 1.6)); },
  // ----- Dinge -----
  reifen: function () { return bild(100, kreis(50, 50, 40, '#3d3732', 2.6) + kreis(50, 50, 28, '#f4eee4', 2.4) + weg('M50 22V78M22 50H78M30 30L70 70M70 30L30 70', null, 1.2) + kreis(50, 50, 5, '#c9a03a', 1.6) + weg('M50 10V2', null, 2)); },
  werkzeugkiste: function () { return bild(60, weg('M10 22H90V56H10Z', '#c8463d') + weg('M10 32H90', null, 2) + weg('M34 22V12H66V22', null, 3.4) + weg('M44 30h12v8h-12z', '#c9a03a', 1.6) + weg('M18 16l10 6M80 12l-8 10', null, 2.6)); },
  schraubglas: function () { var g = function (x, c) { return weg('M' + x + ' 30h18v26h-18z', '#e7f1e6', 1.8) + '<path d="M' + (x + 3) + ' 44h12v10h-12z" fill="' + c + '"/>' + weg('M' + (x - 1) + ' 24h20v6h-20z', '#8a8f96', 1.6); }; return bild(70, weg('M6 58H94', null, 4) + weg('M10 58l-4 10M90 58l4 10', null, 2.4) + g(12, '#c9a03a') + g(41, '#8a8f96') + g(70, '#a4492e')); },
  bistrotisch: function () { return bild(90, weg('M40 10h18v14h-18z', '#fbf7f0', 2) + weg('M58 14q7 0 7 5t-7 5', null, 2) + weg('M36 24h26', null, 2) + weg('M14 28H86', null, 4.6) + weg('M50 30V82M32 86Q50 76 68 86', null, 4)); },
  kuchenglocke: function () { return bild(80, weg('M22 58Q22 20 50 18Q78 20 78 58Z', '#e7f1e6', 2.4).replace('fill="#e7f1e6"', 'fill="#e7f1e6" fill-opacity=".6"') + weg('M50 18V12', null, 2) + kreis(50, 10, 3, '#c9a03a', 1.4) + weg('M30 58V44H70V58Z', '#e8b08c', 2) + weg('M30 44Q50 36 70 44', '#fbf7f0', 2) + kreis(50, 38, 3.4, '#c8463d', 1.4) + weg('M14 58H86V64H14Z', '#d9dde2')); },
  zeitung: function () { return bild(120, weg('M50 118V30M34 118H66', null, 3.4) + weg('M20 22H80V64H20Z', '#f4eee4') + weg('M26 30H74M26 38H50M54 38H74M26 46H48M54 46H74M26 54H48', null, 1.4) + weg('M18 20H82', null, 3)); },
  papierkorb: function () { return bild(80, weg('M24 30H76L70 78H30Z', '#c9a27a') + weg('M30 30L34 78M42 30L44 78M58 30L56 78M70 30L66 78', null, 1.2) + kreis(40, 26, 8, '#fbf7f0', 1.6) + kreis(58, 22, 7, '#fbf7f0', 1.6) + weg('M36 24q4 2 6-2M54 20q4 2 6-2', null, 1)); },
  globus: function () { return bild(110, kreis(50, 42, 26, '#9fc3dd', 2.4) + weg('M34 34q8-4 12 4q-2 8 6 8q8 2 4 12M60 22q6 4 12 12', '#8ea37a', 1.8) + weg('M20 42A30 30 0 0 0 80 42', null, 2.4) + weg('M50 72V96M32 100Q50 90 68 100Z', '#a9784c')); },
  pinnwand: function () { return bild(80, weg('M8 6H92V74H8Z', '#c99a6b') + weg('M14 12H86V68H14Z', '#d9b07f', 1.6) + weg('M20 18h24v20h-24z', '#fbf7f0', 1.4) + weg('M50 22h28v16h-28z', '#f3e3a0', 1.4) + weg('M26 44h22v18h-22z', '#d8e6f0', 1.4) + kreis(32, 18, 2.4, '#c8463d', 1) + kreis(64, 22, 2.4, '#4f7cac', 1) + weg('M54 46L76 58', '#c8463d', 1.4)); },
  farn: function () { var b = '', i; for (i = 0; i < 5; i++) { var a = -60 + i * 30; b += '<path d="M50 82Q' + (50 + a * .5) + ' 50 ' + (50 + a) + ' ' + (22 + Math.abs(a) * .3) + '" fill="none" stroke="#5f7f3e" stroke-width="2.4" stroke-linecap="round"/><path d="M50 82Q' + (50 + a * .5) + ' 50 ' + (50 + a) + ' ' + (22 + Math.abs(a) * .3) + '" fill="none" stroke="#8ea37a" stroke-width="7" stroke-dasharray="3 3" opacity=".9"/>'; } return bild(90, b + weg('M30 82H70', null, 3)); },
  fliegenpilz: function () { var p = function (x, s) { return weg('M' + (x - 4 * s) + ' 76Q' + (x - 5 * s) + ' ' + (76 - 16 * s) + ' ' + (x - 3 * s) + ' ' + (76 - 22 * s) + 'H' + (x + 3 * s) + 'Q' + (x + 5 * s) + ' ' + (76 - 16 * s) + ' ' + (x + 4 * s) + ' 76Z', '#f6efe0', 2) + weg('M' + (x - 14 * s) + ' ' + (76 - 20 * s) + 'Q' + x + ' ' + (76 - 44 * s) + ' ' + (x + 14 * s) + ' ' + (76 - 20 * s) + 'Z', '#c8463d', 2) + kreis(x - 5 * s, 76 - 28 * s, 2 * s, '#fff', 1) + kreis(x + 5 * s, 76 - 25 * s, 1.8 * s, '#fff', 1); }; return bild(80, p(36, 1.3) + p(66, 0.9) + weg('M16 78Q50 70 84 78', '#7d9468', 2)); },
  vogelhaus: function () { return bild(150, weg('M50 64V148', null, 4) + weg('M24 40H76V70H24Z', '#c99a6b') + weg('M18 42L50 14L82 42Z', '#a4492e') + kreis(50, 54, 7, '#3d3732', 1.6) + weg('M44 68h12', null, 3) + weg('M36 148H64', null, 4)); },
  rettungsring: function () { return bild(100, kreis(50, 52, 36, '#fbf7f0', 2.6) + kreis(50, 52, 18, '#e6f2f6', 2.4) + weg('M24 28A36 36 0 0 1 40 18L44 36A18 18 0 0 0 36 42Z', '#c8463d', 2) + weg('M76 76A36 36 0 0 1 60 86L56 68A18 18 0 0 0 64 62Z', '#c8463d', 2) + weg('M86 48A36 36 0 0 1 82 66L66 58A18 18 0 0 0 68 50Z', '#c8463d', 2) + weg('M14 56A36 36 0 0 1 18 38L34 46A18 18 0 0 0 32 54Z', '#c8463d', 2)); },
  sandburg: function () { return bild(70, weg('M10 66H90V44H80V36H72V44H60V24H54V18H46V24H40V44H28V36H20V44H10Z', '#e7cf98') + weg('M46 66V54Q50 48 54 54V66', '#c9a36d', 2) + weg('M50 18V6l10 4-10 4', '#c8463d', 1.6)); },
  treibholz: function () { return bild(40, weg('M6 30Q30 16 60 22Q80 26 94 18L96 26Q76 36 58 32Q32 28 8 38Z', '#bfae95') + weg('M30 26q10-2 20 0M64 28q8-2 14-6', null, 1.2) + kreis(84, 34, 4, '#e8dcc6', 1.4)); },
  eimer: function () { return bild(70, weg('M24 30H64L60 66H28Z', '#4f7cac') + weg('M26 30Q44 4 62 30', null, 2) + weg('M64 34L86 12', '#e2b93b', 4) + weg('M80 10l10-6 4 8-10 4z', '#e2b93b', 1.6) + weg('M14 66H86', '#e7cf98', 3)); },
  giesskanne: function () { return bild(70, weg('M26 30H64V64H26Z', '#7a9aa8') + weg('M64 38L88 22', null, 4) + weg('M84 16l10 2-4 10z', '#7a9aa8', 1.6) + weg('M26 36Q10 40 18 56L26 52', null, 3) + weg('M30 30Q45 16 60 30', null, 2.4)); },
  vogeltraenke: function () { return bild(100, weg('M14 30Q50 52 86 30Z', '#bdb7a9') + weg('M22 32Q50 44 78 32', '#9fc3dd', 1.6) + weg('M42 46L38 92H62L58 46', '#bdb7a9') + weg('M30 94H70', null, 3) + weg('M66 26l6-6 4 2-2 6', '#8f8277', 1.4)); },
  hochbeet: function () { return bild(60, weg('M8 30H92V58H8Z', '#a9784c') + weg('M8 44H92', null, 1.6) + weg('M22 30q-2-12 4-18q4 8-2 18M40 30q0-14 8-20q2 10-4 20M62 30q-4-10 2-18q6 6 0 18M80 30q0-12 6-16q2 10-4 16', '#8ea37a', 1.8) + kreis(48, 14, 3.4, '#c8463d', 1.2) + kreis(84, 18, 3, '#c8463d', 1.2)); },
  kraeuter: function () { var t = function (x, c) { return weg('M' + (x - 10) + ' 40H' + (x + 10) + 'L' + (x + 8) + ' 60H' + (x - 8) + 'Z', '#c8744a', 2) + weg('M' + (x - 6) + ' 40q-2-14 6-20q6 8 0 20M' + x + ' 40q4-14 10-16q0 10-6 16', c, 1.6); }; return bild(64, t(22, '#7d9468') + t(50, '#a4b68f') + t(78, '#5f7f3e') + weg('M6 62H94', null, 3)); },
  brotkorb: function () { return bild(60, weg('M20 34Q22 16 50 16Q78 16 80 34Z', '#d6a050') + weg('M34 22l6 8M50 18l2 10M64 22l-4 8', null, 1.4) + weg('M12 34H88L80 56H20Z', '#c99a6b') + weg('M18 42H82M22 50H78', null, 1.2)); },
  kochtopf: function () { return bild(90, '<g class="c6m-dampf"><path d="M40 30c-4-6 4-10 0-16M56 28c-4-6 4-10 0-16" fill="none" stroke="#cfc5b3" stroke-width="2.4" stroke-linecap="round"/></g>' + weg('M20 44H80V80Q80 86 74 86H26Q20 86 20 80Z', '#d9dde2') + weg('M16 44H84', null, 3.4) + weg('M10 54H20M80 54H90', null, 4) + weg('M24 52q2 20 4 28', '#fff', 2)); },
  gitarre: function () { return bild(160, weg('M44 156L32 120M56 156L68 120', null, 3) + weg('M50 70Q32 74 32 96Q32 122 50 122Q68 122 68 96Q68 74 50 70Z', '#d6a050') + weg('M40 74Q36 60 50 58Q64 60 60 74', '#d6a050') + kreis(50, 92, 6, '#5a3e28', 1.6) + weg('M48 58V8H52V58', '#8a5f3f', 1.8) + weg('M46 8H54V2H46Z', '#3d3732', 1.4) + weg('M50 10V112', '#fff', 0.8)); },
  plattenspieler: function () { return bild(60, weg('M8 26H92V54H8Z', '#a9784c') + '<ellipse cx="42" cy="26" rx="30" ry="7" fill="#2f2b28"' + sw(2) + '/><ellipse cx="42" cy="26" rx="8" ry="2" fill="#c8463d"/>' + weg('M80 18L66 28', null, 3) + kreis(80, 18, 3.4, '#d9dde2', 1.4)); },
  metronom: function () { return bild(90, weg('M34 86L44 10H56L66 86Z', '#a4492e') + weg('M40 60H60', null, 1.6) + weg('M50 76L60 22', null, 2.4) + weg('M54 44h8v6h-8z', '#c9a03a', 1.4) + weg('M28 86H72', null, 3.4)); },
  tafel: function () { return bild(110, weg('M30 70L22 108M70 70L78 108', null, 3.4) + weg('M10 10H90V70H10Z', '#2f4a3e') + weg('M18 24q6-6 10 0t10 0M44 22h10M60 20l8 8M68 20l-8 8M20 44q10 10 22 0M50 46h28M54 56h18', '#f4eee4', 1.6) + weg('M8 70H92', null, 3.4)); },
  atom: function () { return bild(110, '<ellipse cx="50" cy="42" rx="34" ry="12" fill="none"' + sw(2) + '/><ellipse cx="50" cy="42" rx="34" ry="12" fill="none" transform="rotate(60 50 42)"' + sw(2) + '/><ellipse cx="50" cy="42" rx="34" ry="12" fill="none" transform="rotate(-60 50 42)"' + sw(2) + '/>' + kreis(50, 42, 7, '#c8463d', 2) + kreis(84, 42, 4, '#4f7cac', 1.4) + kreis(33, 13, 4, '#4f7cac', 1.4) + weg('M50 74V104M34 106H66', null, 3.4)); },
  buecherstapel: function () { var f = ['#a4492e', '#2f5f8a', '#e2b93b', '#5f7f3e', '#8a6bb0', '#c9805a'], s = '', i; for (i = 0; i < 6; i++) s += weg('M' + (18 + (i % 2) * 6) + ' ' + (106 - i * 14) + 'h' + (60 - (i % 3) * 6) + 'v-14h-' + (60 - (i % 3) * 6) + 'z', f[i], 2); return bild(110, s + weg('M70 22c0-8 10-10 12-4', null, 1.4)); },
  amphore: function () { return bild(120, weg('M40 10H60V20Q76 30 76 60Q76 96 56 112H44Q24 96 24 60Q24 30 40 20Z', '#c8744a') + weg('M40 20Q26 22 28 40M60 20Q74 22 72 40', null, 2.4) + weg('M28 56H72M30 72H70', '#2b2722', 1.4) + weg('M36 62l6 6 6-6 6 6 6-6', null, 1.4)); },
  bueste: function () { return bild(130, weg('M30 126H70L66 112H34Z', '#d9d2c4') + weg('M24 112Q24 84 50 82Q76 84 76 112Z', '#ece6da') + weg('M38 82Q36 66 40 58H60Q64 66 62 82', '#ece6da') + weg('M32 44Q32 16 50 14Q68 16 68 44Q68 64 50 66Q32 64 32 44Z', '#ece6da') + weg('M34 30q8-14 22-12q10 2 12 12', '#d9d2c4', 2) + weg('M42 42h4M54 42h4M48 46v6M44 56q6 3 12 0', null, 1.4)); },
  lorbeer: function () { var b = '', i; for (i = 0; i < 7; i++) b += '<ellipse cx="' + (50 + (i % 2 ? 9 : -9)) + '" cy="' + (16 + i * 9) + '" rx="8" ry="4" transform="rotate(' + (i % 2 ? -30 : 30) + ' ' + (50 + (i % 2 ? 9 : -9)) + ' ' + (16 + i * 9) + ')" fill="#6f9a5b"' + sw(1.4) + '/>'; return bild(120, weg('M50 84V10', null, 2) + b + weg('M30 84H70L64 116H36Z', '#e6e1d4') + weg('M28 84H72', null, 3.4)); },
  schriftrolle: function () { return bild(50, weg('M16 14H84V40H16Z', '#f1e3c4') + kreis(16, 27, 9, '#e3cc9e', 2) + kreis(84, 27, 9, '#e3cc9e', 2) + weg('M28 22h40M28 28h34M28 34h38', null, 1.2) + weg('M44 40l-2 8M56 40l2 8', '#c8463d', 2)); },
  wegweiser: function () { return bild(160, weg('M46 156V20H54V156Z', '#a9784c') + weg('M54 30H88L96 40L88 50H54Z', '#e3c99b') + weg('M46 60H14L6 70L14 80H46Z', '#e3c99b') + weg('M62 40h20M16 70h22', null, 1.4) + weg('M36 156H64', null, 3)); },
  rucksack: function () { return bild(100, weg('M26 30Q26 14 50 14Q74 14 74 30V92H26Z', '#c8463d') + weg('M32 58H68V86H32Z', '#a4492e') + weg('M40 14Q40 4 50 4Q60 4 60 14', null, 2.6) + weg('M26 44H74', null, 1.6) + weg('M46 68h8', null, 2.4) + weg('M22 98H78', null, 2)); },
  steinmann: function () { return bild(110, '<ellipse cx="50" cy="98" rx="30" ry="9" fill="#a8a194"' + sw(2) + '/><ellipse cx="50" cy="80" rx="24" ry="9" fill="#bdb7a9"' + sw(2) + '/><ellipse cx="50" cy="63" rx="18" ry="8" fill="#a8a194"' + sw(2) + '/><ellipse cx="50" cy="48" rx="12" ry="7" fill="#c8c2b4"' + sw(2) + '/><ellipse cx="50" cy="36" rx="7" ry="5" fill="#bdb7a9"' + sw(2) + '/>'); },
  teewagen: function () { return bild(90, weg('M14 30H86M14 62H86', null, 4) + weg('M18 30V78M82 30V78', null, 3) + kreis(22, 82, 5, '#3d3732', 1.6) + kreis(78, 82, 5, '#3d3732', 1.6) + weg('M30 16h16v14h-16z', '#fbf7f0', 1.8) + weg('M54 12Q54 4 64 4Q74 4 74 12V30H54Z', '#8ea37a', 1.8) + weg('M74 16q8 2 4 10', null, 1.8) + weg('M30 50h40v12h-40z', '#2f5f8a', 1.6)); },
  fernrohr: function () { return bild(140, weg('M50 70L30 136M50 70L70 136M50 70V132', null, 3) + weg('M18 64L76 30L82 40L24 74Z', '#c9a03a') + weg('M76 30L88 24L94 34L82 40Z', '#3d3732', 1.8) + weg('M16 66L12 68L16 76L24 74', '#3d3732', 1.6)); },
  sternkarte: function () { var s = '', p = [[30, 30], [44, 22], [60, 34], [70, 50], [40, 52], [56, 60]], i; for (i = 0; i < p.length; i++) s += kreis(p[i][0], p[i][1], 2.2, '#fff3c4', 1); return bild(100, weg('M50 96V74M34 98H66', null, 3) + weg('M12 8H88V74H12Z', '#1f2a52') + weg('M30 30L44 22L60 34L70 50M60 34L56 60L40 52', '#fff3c4', 1).replace('fill="#fff3c4"', 'fill="none"') + s); },
  mobile: function () { var pl = function (x, y, r, c) { return weg('M' + x + ' ' + (y - r - 8) + 'V' + (y - r)) + kreis(x, y, r, c, 1.8); }; return bild(110, weg('M50 0V14M16 14H84', null, 2.2) + pl(16, 40, 8, '#e2b93b') + pl(50, 52, 11, '#c8744a') + pl(84, 36, 7, '#9fc3dd') + '<ellipse cx="50" cy="52" rx="18" ry="4" fill="none" stroke="#e3c99b" stroke-width="2"/>'); },
  waescheleine: function () { var st = function (x, y) { return '<path d="M' + x + ' ' + (y - 7) + 'l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#fff3c4"' + sw(1.2) + '/>'; }; return bild(80, weg('M6 78V8M94 78V8', '#8a5f3f', 3) + weg('M6 14Q50 34 94 14', null, 1.4) + st(28, 30) + st(50, 34) + st(72, 30)); },
  thermos: function () { return bild(100, weg('M36 22H64V92Q64 96 60 96H40Q36 96 36 92Z', '#c8463d') + weg('M38 12H62V22H38Z', '#d9dde2') + weg('M36 40H64M36 80H64', null, 1.6) + weg('M66 74h14l-2 18h-10z', '#d9dde2', 1.8)); },
  palette: function () { return bild(60, weg('M14 32Q14 10 46 10Q86 10 86 30Q86 46 66 44Q56 44 58 52Q58 58 46 58Q14 56 14 32Z', '#e3c99b') + kreis(30, 26, 5, '#c8463d', 1.4) + kreis(46, 18, 5, '#e2b93b', 1.4) + kreis(64, 20, 5, '#4f7cac', 1.4) + kreis(74, 32, 4.4, '#5f7f3e', 1.4) + kreis(32, 42, 5, '#fbf7f0', 1.4) + weg('M50 40L82 6', '#8a5f3f', 3)); },
  zypresse: function () { return bild(170, weg('M50 8Q66 40 64 90Q62 126 50 130Q38 126 36 90Q34 40 50 8Z', '#4f6b34') + weg('M50 20Q56 50 54 100M44 40q4 30 2 70', null, 1.2) + weg('M32 130H68L62 166H38Z', '#c8744a') + weg('M28 130H72', null, 3.4)); },
  skizze: function () { return bild(140, weg('M30 136L46 30M70 136L54 30M50 30V136', '#a9784c', 3.4) + weg('M16 22H84V86H16Z', '#f4eee4') + weg('M40 74Q36 48 50 40Q64 48 60 74M44 40q6-12 12 0M30 60h40', null, 1.4) + weg('M12 88H88', null, 4)); },
  kissenberg: function () { return bild(60, weg('M10 52Q8 32 30 30Q46 30 46 52Z', '#8a6bb0') + weg('M40 54Q38 26 64 24Q88 26 88 54Z', '#4a528a') + weg('M24 56Q24 40 50 40Q74 40 74 56Z', '#e2b93b') + weg('M6 56H94', null, 2.4)); }
};
for (var z2 in Z2) Z[z2] = Z2[z2];

/* Sessel für die Stube (austauschbar): Zeichnungen 220 × 180 wie der Platz neben dem Sofa */
var SW2 = ' stroke="' + T + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';
function eigenSessel(pfade) { return '<defs><linearGradient id="c6m-eg-sessel" gradientUnits="userSpaceOnUse" x1="20" y1="40" x2="200" y2="140"><stop offset=".35" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".2"/></linearGradient></defs><g class="c6m-eigen" fill="url(#c6m-eg-sessel)" pointer-events="none">' + pfade.map(function (d) { return '<path d="' + d + '"/>'; }).join('') + '</g>'; }
function sesselBild(inhalt) { return '<svg viewBox="0 0 220 180" aria-hidden="true" focusable="false">' + inhalt + '</svg>'; }
var SESSEL = {
  // Lesesessel: ein runder Rücken wie ein zweiter Kiesel, Ockerwolle, Holzfüße, eine gestrickte Decke über der Lehne
  lese: function () {
    var rueck = 'M44 118C30 54 62 16 110 16C158 16 190 54 176 118Z', sitz = 'M38 104C38 96 50 92 64 92H156C170 92 182 96 182 104V134C182 140 176 144 168 144H52C44 144 38 140 38 134Z',
      armL = 'M14 112C12 90 30 82 46 86C58 90 60 104 58 124V152C58 158 52 160 42 160H26C18 160 14 156 14 150Z', armR = 'M206 112C208 90 190 82 174 86C162 90 160 104 162 124V152C162 158 168 160 178 160H194C202 160 206 156 206 150Z';
    return sesselBild('<path d="M32 158L26 176M188 158L194 176M70 150L68 166M150 150L152 166" stroke="' + T + '" stroke-width="6" stroke-linecap="round"/><path d="M32 158L26 176M188 158L194 176" stroke="#8a6744" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="' + rueck + '" fill="#d6a14c"' + SW2 + '/><path d="M72 46C88 32 112 28 132 30" fill="none" stroke="#ecc787" stroke-width="9" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M110 30V96M76 40Q74 70 80 96M144 40Q146 70 140 96" fill="none" stroke="' + T + '" stroke-width="1.4" opacity=".28"/>' +
      '<path d="' + sitz + '" fill="#e2b25c"' + SW2 + '/><path d="M60 104C100 100 130 100 162 104" fill="none" stroke="#f1d08e" stroke-width="6" stroke-linecap="round" opacity=".7"/>' +
      '<path d="' + armL + '" fill="#c48f3e"' + SW2 + '/><path d="' + armR + '" fill="#c48f3e"' + SW2 + '/>' +
      '<path d="M24 98C30 90 40 88 48 90M196 98C190 90 180 88 172 90" fill="none" stroke="#e2b25c" stroke-width="5" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M70 98C66 84 80 80 110 80C140 80 152 84 148 98C146 104 74 104 70 98Z" fill="#c8744a"' + SW2 + '/><path d="M82 88C96 84 122 84 136 88" fill="none" stroke="#e0a07a" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M160 84C174 80 196 84 204 94L198 150H168Z" fill="#8ea37a"' + SW2 + '/><path d="M164 100H202M166 114H200M166 128H199M167 142H198" stroke="#f4eee4" stroke-width="3.4" stroke-dasharray="5 4"/>' +
      '<path d="M170 150v8M178 150v9M186 150v8M194 150v9" stroke="#8ea37a" stroke-width="2.6" stroke-linecap="round"/>' +
      eigenSessel([rueck, sitz, armL, armR]));
  },
  ohren: function () {
    var rueck = 'M54 120L48 30C48 16 66 10 110 10C154 10 172 16 172 30L166 120Z', fluegelL = 'M48 40C24 40 18 60 22 96L50 104Z', fluegelR = 'M172 40C196 40 202 60 198 96L170 104Z', sitz = 'M34 108H186V140H34Z';
    var kn = '', i, j; for (i = 0; i < 3; i++) for (j = 0; j < 4; j++) kn += '<circle cx="' + (74 + j * 24) + '" cy="' + (34 + i * 22) + '" r="2.4" fill="' + T + '" opacity=".55"/>';
    return sesselBild('<path d="M42 140q-6 16 0 34M178 140q6 16 0 34" fill="none" stroke="' + T + '" stroke-width="7" stroke-linecap="round"/><path d="M42 140q-6 16 0 34M178 140q6 16 0 34" fill="none" stroke="#8a5f3f" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="' + rueck + '" fill="#a4492e"' + SW2 + '/>' + kn + '<path d="' + fluegelL + '" fill="#8f3c25"' + SW2 + '/><path d="' + fluegelR + '" fill="#8f3c25"' + SW2 + '/>' +
      '<path d="' + sitz + '" fill="#b85a3c"' + SW2 + '/><path d="M18 96C18 86 40 84 46 96V146H18Z" fill="#8f3c25"' + SW2 + '/><path d="M202 96C202 86 180 84 174 96V146H202Z" fill="#8f3c25"' + SW2 + '/>' +
      '<path d="M50 118H170" stroke="#d27a5a" stroke-width="5" stroke-linecap="round" opacity=".6"/>' + eigenSessel([rueck, fluegelL, fluegelR, sitz]));
  },
  schaukel: function () {
    return sesselBild('<path d="M14 160Q110 186 206 160" fill="none" stroke="' + T + '" stroke-width="9" stroke-linecap="round"/><path d="M14 160Q110 186 206 160" fill="none" stroke="#b07d4f" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M60 168L66 112M160 168L154 112M72 118L66 24Q110 6 154 24L148 118" fill="none" stroke="' + T + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 168L66 112M160 168L154 112M72 118L66 24Q110 6 154 24L148 118" fill="none" stroke="#b07d4f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M76 30Q110 18 144 30L140 108H80Z" fill="#e9d6a8"' + SW2 + '/><path d="M86 40L136 100M98 32L140 82M80 60L120 106M134 40L84 100M122 32L80 82M140 60L100 106" stroke="#c9a36d" stroke-width="1.6"/>' +
      '<path d="M48 112H172L164 130H56Z" fill="#e9d6a8"' + SW2 + '/><path d="M40 100Q40 88 56 90L60 118M180 100Q180 88 164 90L160 118" fill="none" stroke="' + T + '" stroke-width="8" stroke-linecap="round"/><path d="M40 100Q40 88 56 90L60 118M180 100Q180 88 164 90L160 118" fill="none" stroke="#b07d4f" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M86 92C86 80 134 78 136 92C136 104 88 106 86 92Z" fill="#8ea37a"' + SW2 + '/>');
  },
  korb: function () {
    var rueck = 'M110 6C50 6 22 50 34 120H186C198 50 170 6 110 6Z', w = '', i;
    for (i = 0; i < 9; i++) w += '<path d="M110 118L' + (30 + i * 20) + ' ' + (i === 0 || i === 8 ? 90 : 20 + Math.abs(4 - i) * 8) + '" stroke="#b9925a" stroke-width="1.8"/>';
    return sesselBild('<path d="' + rueck + '" fill="#e3c48a"' + SW2 + '/>' + w + '<path d="M44 60Q110 30 176 60M38 90Q110 66 182 90" fill="none" stroke="#b9925a" stroke-width="2"/>' +
      '<path d="M70 120Q60 150 84 170H136Q160 150 150 120Z" fill="#d6b376"' + SW2 + '/><path d="M74 140H146M78 156H142" stroke="#b9925a" stroke-width="1.8"/>' +
      '<path d="M44 112C44 98 176 98 176 112V128C176 134 44 134 44 128Z" fill="#f4eee4"' + SW2 + '/><path d="M70 72C70 58 110 56 112 70C112 84 72 86 70 72Z" fill="#e39aae"' + SW2 + '/>' + eigenSessel([rueck]));
  },
  sack: function () {
    var k = 'M30 170C10 150 20 96 50 82C70 72 84 92 110 88C142 82 150 56 176 66C206 80 212 150 190 170Z';
    return sesselBild('<path d="' + k + '" fill="#7d9468"' + SW2 + '/><path d="M60 100C80 112 120 116 150 98" fill="none" stroke="' + T + '" stroke-width="1.6" opacity=".35"/><path d="M50 98C58 90 66 88 74 90" fill="none" stroke="#a4b68f" stroke-width="7" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M110 88L112 170" stroke="' + T + '" stroke-width="1.4" opacity=".25"/>' + eigenSessel([k]));
  }
};
var SESSEL_LISTE = [
  { id: 'lese', name: 'Lesesessel', preis: 0 }, { id: 'ohren', name: 'Ohrensessel', preis: 5 }, { id: 'schaukel', name: 'Schaukelstuhl', preis: 6 },
  { id: 'korb', name: 'Korbsessel', preis: 4 }, { id: 'sack', name: 'Sitzsack', preis: 3 }
];

/* ---------- Katalog ---------- */
var REIHEN = [
  { id: 'moebel', name: 'Möbel' }, { id: 'pflanzen', name: 'Pflanzen' }, { id: 'lampen', name: 'Lampen' },
  { id: 'bilder', name: 'Bilder' }, { id: 'teppiche', name: 'Teppiche' }, { id: 'ambiente', name: 'Kleinigkeiten' }
];
function K(id, reihe, name, preis, z, breite) { var b = Z[z](); return { id: id, reihe: reihe, name: name, preis: preis, svg: b.svg, ar: b.ar, breite: breite }; }
var KATALOG = [
  K('bank', 'moebel', 'Bank', 0, 'bank', .2), K('sessel', 'moebel', 'Sessel', 0, 'sessel', .16), K('tisch', 'moebel', 'Tisch mit Tasse', 4, 'tisch', .18), K('regal', 'moebel', 'Bücherregal', 6, 'regal', .14),
  K('topf', 'pflanzen', 'Topfpflanze', 0, 'topf', .09), K('kaktus', 'pflanzen', 'Kaktus', 0, 'kaktus', .07), K('sonnenblume', 'pflanzen', 'Sonnenblume', 3, 'sonnenblume', .08), K('baeumchen', 'pflanzen', 'Apfelbäumchen', 5, 'baeumchen', .16),
  K('stehlampe', 'lampen', 'Stehlampe', 0, 'stehlampe', .08), K('laterne', 'lampen', 'Laterne', 3, 'laterne', .07), K('lichterkette', 'lampen', 'Lichterkette', 0, 'lichterkette', .24),
  K('staffelei', 'bilder', 'Bild: Hügel', 0, 'staffelei', .11), K('meerbild', 'bilder', 'Bild: Meer', 0, 'meerbild', .11),
  K('teppichrund', 'teppiche', 'Runder Teppich', 0, 'teppichrund', .26), K('laeufer', 'teppiche', 'Läufer', 0, 'laeufer', .28), K('flicken', 'teppiche', 'Flickenteppich', 5, 'flicken', .28)
];
/* Ambiente je Ort: ≥ 5 Dinge pro Ort, darunter mindestens zwei Lampen mit eigenem Licht.
   glut = Mitte des Scheins in Zeichnungs-Einheiten (Breite 100). */
function L(id, name, preis, z, licht, glut, breite, orte) { var b = Z[z](licht); return { id: id, reihe: 'lampen', name: name, preis: preis, svg: b.svg, ar: b.ar, breite: breite, licht: licht, glut: glut, orte: orte }; }
function A(id, name, preis, z, breite, orte, reihe) { var b = Z[z](); return { id: id, reihe: reihe || 'ambiente', name: name, preis: preis, svg: b.svg, ar: b.ar, breite: breite, orte: orte }; }
var AMBIENTE = [
  // Schuppen
  L('l-kaefig', 'Käfiglampe', 4, 'kaefig', '#fff1c8', [50, 40], .07, ['garage']),
  L('l-kette-bunt', 'Bunte Lichterkette', 3, 'lichterkette', '#ffe2a8', [50, 28], .24, ['garage', 'garten', 'nacht']),
  A('a-reifen', 'Alter Reifen', 2, 'reifen', .1, ['garage', 'bergweg']), A('a-werkzeugkiste', 'Werkzeugkiste', 3, 'werkzeugkiste', .1, ['garage']), A('a-schraubglas', 'Schraubgläser', 2, 'schraubglas', .12, ['garage', 'kueche']),
  // Kaffeehaus
  L('l-fransen', 'Fransenlampe', 5, 'fransen', '#ffc59a', [50, 36], .09, ['kaffeehaus', 'lesesaal']),
  L('l-flasche', 'Kerze in der Flasche', 2, 'flasche', '#ffd27a', [50, 22], .05, ['kaffeehaus', 'kueche', 'florenz']),
  A('a-bistro', 'Bistrotisch', 4, 'bistrotisch', .12, ['kaffeehaus']), A('a-kuchen', 'Kuchenglocke', 3, 'kuchenglocke', .08, ['kaffeehaus', 'kueche']), A('a-zeitung', 'Zeitungshalter', 2, 'zeitung', .08, ['kaffeehaus', 'lesesaal']),
  // Schreibtisch
  L('l-lese', 'Leselampe', 4, 'leselampe', '#fff0c0', [72, 56], .08, ['schreibtisch', 'hoersaal']),
  L('l-leuchter', 'Kerzenleuchter', 5, 'leuchter', '#ffcf80', [50, 34], .08, ['schreibtisch', 'florenz', 'lesesaal', 'saeulen']),
  A('a-papierkorb', 'Papierkorb voller Entwürfe', 1, 'papierkorb', .07, ['schreibtisch']), A('a-globus', 'Globus', 4, 'globus', .08, ['schreibtisch', 'lesesaal', 'hoersaal']), A('a-pinnwand', 'Pinnwand', 3, 'pinnwand', .12, ['schreibtisch', 'garage']),
  // Wald
  L('l-gluehglas', 'Glühwürmchenglas', 4, 'gluehglas', '#d8f58a', [50, 54], .06, ['wald', 'garten', 'nacht']),
  L('l-pilz', 'Pilzlampe', 3, 'pilzlampe', '#ffc6a8', [50, 40], .07, ['wald']),
  A('a-farn', 'Farn', 2, 'farn', .1, ['wald', 'bergweg']), A('a-fliegenpilz', 'Zwei Fliegenpilze', 2, 'fliegenpilz', .08, ['wald']), A('a-vogelhaus', 'Vogelhaus', 4, 'vogelhaus', .08, ['wald', 'garten']),
  // Meer
  L('l-windlicht', 'Windlicht', 2, 'windlicht', '#ffd58a', [50, 56], .06, ['meer', 'nacht', 'bergweg']),
  L('l-muschel', 'Muschellampe', 5, 'muschellampe', '#ffe2c6', [50, 46], .08, ['meer']),
  A('a-ring', 'Rettungsring', 3, 'rettungsring', .09, ['meer']), A('a-sandburg', 'Sandburg', 1, 'sandburg', .1, ['meer']), A('a-treibholz', 'Treibholz', 1, 'treibholz', .14, ['meer']), A('a-eimer', 'Eimer und Schaufel', 2, 'eimer', .08, ['meer']),
  // Garten
  L('l-lampion', 'Lampion am Stab', 3, 'lampion', '#ffb070', [50, 56], .07, ['garten', 'kaffeehaus']),
  L('l-kugel', 'Kugelleuchte', 4, 'kugel', '#fff6c8', [50, 40], .06, ['garten', 'saeulen']),
  A('a-giesskanne', 'Gießkanne', 2, 'giesskanne', .08, ['garten']), A('a-traenke', 'Vogeltränke', 3, 'vogeltraenke', .09, ['garten']), A('a-hochbeet', 'Hochbeet', 4, 'hochbeet', .14, ['garten', 'kueche']),
  // Küche
  L('l-haenge', 'Emaillelampe', 4, 'haengelampe', '#ffe2a0', [50, 94], .09, ['kueche']),
  A('a-kraeuter', 'Kräutertöpfe', 2, 'kraeuter', .12, ['kueche']), A('a-brotkorb', 'Brotkorb', 2, 'brotkorb', .09, ['kueche']), A('a-kochtopf', 'Dampfender Topf', 3, 'kochtopf', .09, ['kueche']),
  // Musikzimmer
  L('l-noten', 'Notenpultlampe', 4, 'notenlampe', '#fff0c0', [72, 34], .08, ['musik']),
  L('l-disco', 'Glitzerkugel', 6, 'discokugel', '#c8d8ff', [50, 42], .07, ['musik', 'nacht']),
  A('a-gitarre', 'Gitarre am Ständer', 5, 'gitarre', .07, ['musik']), A('a-platten', 'Plattenspieler', 5, 'plattenspieler', .12, ['musik']), A('a-metronom', 'Metronom', 2, 'metronom', .06, ['musik']),
  // Hörsaal
  L('l-globus', 'Globuslampe', 5, 'globuslampe', '#ffe9b0', [50, 40], .08, ['hoersaal', 'sternwarte']),
  A('a-tafel', 'Kleine Tafel', 3, 'tafel', .13, ['hoersaal']), A('a-atom', 'Atommodell', 4, 'atom', .08, ['hoersaal', 'sternwarte']), A('a-buecher', 'Bücherturm', 2, 'buecherstapel', .08, ['hoersaal', 'lesesaal', 'schreibtisch']),
  // Säulenhalle
  L('l-oel', 'Öllampe', 3, 'oellampe', '#ffcf80', [70, 28], .07, ['saeulen', 'florenz']),
  L('l-feuer', 'Feuerschale', 5, 'feuerschale', '#ffa860', [50, 40], .09, ['saeulen', 'bergweg']),
  A('a-amphore', 'Amphore', 3, 'amphore', .07, ['saeulen']), A('a-bueste', 'Steinkopf', 5, 'bueste', .08, ['saeulen', 'florenz']), A('a-lorbeer', 'Lorbeer im Topf', 3, 'lorbeer', .07, ['saeulen']), A('a-rolle', 'Schriftrolle', 1, 'schriftrolle', .09, ['saeulen', 'lesesaal']),
  // Bergweg
  L('l-feuerstelle', 'Lagerfeuer', 4, 'lagerfeuer', '#ffa050', [50, 40], .12, ['bergweg', 'meer', 'wald']),
  A('a-wegweiser', 'Wegweiser', 3, 'wegweiser', .09, ['bergweg']), A('a-rucksack', 'Rucksack', 3, 'rucksack', .08, ['bergweg']), A('a-steinmann', 'Steinmännchen', 1, 'steinmann', .07, ['bergweg', 'meer']),
  // Leseecke
  L('l-banker', 'Grüne Tischlampe', 4, 'bankerlampe', '#fff0c0', [50, 38], .08, ['lesesaal', 'schreibtisch']),
  A('a-teewagen', 'Teewagen', 4, 'teewagen', .1, ['lesesaal', 'kaffeehaus']),
  // Sternwarte
  L('l-stern', 'Sternlampe', 4, 'sternlampe', '#e8f0ff', [50, 40], .07, ['sternwarte', 'nacht']),
  L('l-mond', 'Mondlampe', 5, 'mondlampe', '#fff6dc', [50, 40], .08, ['sternwarte', 'nacht']),
  A('a-fernrohr', 'Fernrohr', 6, 'fernrohr', .09, ['sternwarte', 'nacht']), A('a-sternkarte', 'Sternkarte', 3, 'sternkarte', .09, ['sternwarte']), A('a-mobile', 'Planetenmobile', 4, 'mobile', .1, ['sternwarte', 'hoersaal']),
  // Nachtdach
  A('a-leine', 'Sternenleine', 2, 'waescheleine', .14, ['nacht']), A('a-thermos', 'Thermoskanne', 2, 'thermos', .06, ['nacht', 'bergweg']), A('a-kissen', 'Kissenberg', 3, 'kissenberg', .14, ['nacht', 'lesesaal']),
  // Florenz
  A('a-palette', 'Farbpalette', 2, 'palette', .09, ['florenz']), A('a-zypresse', 'Zypresse im Topf', 4, 'zypresse', .07, ['florenz', 'saeulen']), A('a-skizze', 'Staffelei mit Skizze', 4, 'skizze', .11, ['florenz'])
];
// die alten Lampen bekommen ihr Licht auch
var LICHT_ALT = { stehlampe: ['#ffd58a', [50, 38]], laterne: ['#ffd58a', [50, 42]], lichterkette: ['#ffe2a8', [50, 28]] };
KATALOG.forEach(function (k) { var a = LICHT_ALT[k.id]; if (a) { k.licht = a[0]; k.glut = a[1]; } });
KATALOG = KATALOG.concat(AMBIENTE);
var NACH = {}; KATALOG.forEach(function (k) { NACH[k.id] = k; });
SESSEL_LISTE.forEach(function (x) { x.svg = SESSEL[x.id](); });
/* ---------- Raumlampen (s18): je Raum eine Reihe Lampen mit eigenem Licht; die erste ist die heutige und kostet nichts ----------
   Zeichnungen: Fußpunkt unten Mitte (Hängelampen: Schnur oben bis y = 0). .c6e-raumlampe-licht leuchtet, wenn die Lampe an ist. */
function RL(cls) { return ' class="c6e-raumlampe-licht' + (cls ? ' ' + cls : '') + '"'; }
function rlSvg(vb, inhalt) { return '<svg viewBox="' + vb + '" aria-hidden="true" focusable="false">' + inhalt + '</svg>'; }
var EGL = '<defs><linearGradient id="c6m-eg-lampe" gradientUnits="userSpaceOnUse" x1="14" y1="30" x2="66" y2="30"><stop offset=".4" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".16"/></linearGradient></defs>';
var RAUMLAMPEN = {
  zuhause: [
    { id: 'zh-steh', name: 'Stehlampe', preis: 0, form: 'steh', farbe: '#efe1c4', licht: '#f6c86a', vb: '0 0 80 260', glut: [40, 40],
      svg: '<path d="M40,58 V246" stroke="#2b2722" stroke-width="3.4"/><ellipse cx="40" cy="250" rx="22" ry="6" fill="#6f857c" stroke="#2b2722" stroke-width="2.4"/>' +
        '<path d="M14,58 L24,8 H56 L66,58Z" fill="#efe1c4" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>' + EGL +
        '<path class="c6m-eigen" d="M14,58 L24,8 H56 L66,58Z" fill="url(#c6m-eg-lampe)" pointer-events="none"/>' +
        '<path' + RL('c6z-lampen-licht') + ' d="M18,56 L62,56 L58,40 L22,40Z" fill="#f6c86a" opacity="0"/>' },
    { id: 'zh-papier', name: 'Papierlaterne', preis: 4, form: 'steh', farbe: '#fbf3e2', licht: '#ffd98a', vb: '0 0 80 260', glut: [40, 36],
      svg: '<path d="M40,64 V246" stroke="#8a6744" stroke-width="3.4"/><path d="M26,250 L40,238 L54,250" fill="none" stroke="#8a6744" stroke-width="3.4" stroke-linejoin="round"/>' +
        '<circle cx="40" cy="36" r="29" fill="#fbf3e2" stroke="#2b2722" stroke-width="2.4"/>' +
        '<circle' + RL('c6z-lampen-licht') + ' cx="40" cy="36" r="24" fill="#ffd98a" opacity="0"/>' +
        '<path d="M12,28 Q40,22 68,28 M11,40 Q40,46 69,40 M15,52 Q40,58 65,52 M17,18 Q40,12 63,18" fill="none" stroke="#2b2722" stroke-width="1.2" opacity=".45"/>' +
        '<path d="M34,6 h12 v4 h-12z M34,62 h12 v4 h-12z" fill="#8a6744" stroke="#2b2722" stroke-width="1.6"/>' },
    { id: 'zh-glas', name: 'Bunte Glaslampe', preis: 5, form: 'steh', farbe: '#c8463d', licht: '#ffd08a', vb: '0 0 80 260', glut: [40, 40],
      svg: '<path d="M40,56 V240" stroke="#2b2722" stroke-width="3.6"/><path d="M40,240 C30,240 22,246 20,252 H60 C58,246 50,240 40,240Z" fill="#7a5a3a" stroke="#2b2722" stroke-width="2.2"/>' +
        '<path d="M6,56 C6,26 22,10 40,10 C58,10 74,26 74,56Z" fill="#e2b93b" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<path d="M40,10 V56 M22,18 L16,56 M58,18 L64,56 M10,40 H70" stroke="#2b2722" stroke-width="1.6"/><path d="M24,20 L40,10 L40,40 L14,40Z" fill="#c8463d" opacity=".85"/><path d="M58,20 L66,40 L40,40 L40,10Z" fill="#4f7cac" opacity=".8"/><path d="M14,40 H40 V56 H8Z" fill="#6f9a5b" opacity=".85"/><path d="M40,40 H66 L72,56 H40Z" fill="#8a6bb0" opacity=".8"/>' +
        '<path' + RL('c6z-lampen-licht') + ' d="M10,54 H70 L66,46 H14Z" fill="#ffd08a" opacity="0"/>' },
    { id: 'zh-bogen', name: 'Bogenlampe', preis: 6, form: 'steh', farbe: '#c9a03a', licht: '#ffe2a8', vb: '0 0 80 260', glut: [24, 44],
      svg: '<path d="M60,246 V90 C60,30 44,12 26,16" fill="none" stroke="#c9a03a" stroke-width="5" stroke-linecap="round"/><path d="M60,246 V90 C60,30 44,12 26,16" fill="none" stroke="#2b2722" stroke-width="1.4" opacity=".5"/>' +
        '<rect x="44" y="242" width="32" height="12" rx="4" fill="#bdb7a9" stroke="#2b2722" stroke-width="2.2"/>' +
        '<path d="M6,46 C6,28 14,20 24,20 C34,20 42,28 42,46Z" fill="#d9dde2" stroke="#2b2722" stroke-width="2.4" stroke-linejoin="round"/><path d="M12,36 C14,28 18,25 24,24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
        '<path' + RL('c6z-lampen-licht') + ' d="M8,46 H40 Q24,52 8,46Z" fill="#ffe2a8" opacity="0"/>' },
    { id: 'zh-pilz', name: 'Pilzleuchte', preis: 4, form: 'steh', farbe: '#e98a6e', licht: '#ffc6a8', vb: '0 0 80 260', glut: [40, 40],
      svg: '<path d="M30,60 C28,140 26,200 22,250 H58 C54,200 52,140 50,60Z" fill="#f3e7cf" stroke="#2b2722" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M2,62 C2,22 22,6 40,6 C58,6 78,22 78,62 C52,70 28,70 2,62Z" fill="#e98a6e" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<circle cx="24" cy="32" r="5" fill="#fff3e0" stroke="#2b2722" stroke-width="1.4"/><circle cx="48" cy="22" r="6" fill="#fff3e0" stroke="#2b2722" stroke-width="1.4"/><circle cx="62" cy="44" r="4" fill="#fff3e0" stroke="#2b2722" stroke-width="1.4"/>' +
        '<path' + RL('c6z-lampen-licht') + ' d="M6,62 C28,68 52,68 74,62 L70,56 C50,60 30,60 10,56Z" fill="#ffc6a8" opacity="0"/>' }
  ],
  werkstatt: [
    { id: 'ws-arbeit', name: 'Werkstattlampe', preis: 0, form: 'haenge', farbe: '#6f857c', licht: '#ffe2a0', vb: '0 0 100 140', glut: [50, 112],
      svg: '<path d="M50,0 V70" stroke="#2b2722" stroke-width="2"/><path d="M14,110 C14,84 30,72 50,72 C70,72 86,84 86,110Z" fill="#6f857c" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/><path d="M22,96 C26,84 36,78 48,77" fill="none" stroke="#a7bdb3" stroke-width="3" stroke-linecap="round"/>' +
        '<ellipse' + RL() + ' cx="50" cy="111" rx="30" ry="6" fill="#ffe2a0" opacity="0"/>' },
    { id: 'ws-birne', name: 'Glühbirne am Kabel', preis: 2, form: 'haenge', farbe: '#2b2722', licht: '#ffd27a', vb: '0 0 100 140', glut: [50, 108],
      svg: '<path d="M50,0 V84" stroke="#2b2722" stroke-width="2"/><path d="M44,84 h12 v10 h-12z" fill="#8a8f96" stroke="#2b2722" stroke-width="1.8"/>' +
        '<path d="M44,94 C30,100 34,124 50,126 C66,124 70,100 56,94Z" fill="#fff6dc" stroke="#2b2722" stroke-width="2.2"/><path' + RL() + ' d="M46,96 C36,102 38,120 50,122 C62,120 64,102 54,96Z" fill="#ffd27a" opacity="0"/><path d="M46,112 q4,-8 8,0" fill="none" stroke="#c9a03a" stroke-width="1.6"/>' },
    { id: 'ws-kaefig', name: 'Käfiglampe', preis: 4, form: 'haenge', farbe: '#3d3732', licht: '#fff1c8', vb: '0 0 100 140', glut: [50, 104],
      svg: '<path d="M50,0 V72" stroke="#2b2722" stroke-width="2"/><path d="M40,72 h20 v8 h-20z" fill="#3d3732" stroke="#2b2722" stroke-width="1.6"/>' +
        '<circle' + RL() + ' cx="50" cy="104" r="16" fill="#fff1c8" opacity="0"/><path d="M36,80 Q50,74 64,80 L68,124 Q50,132 32,124Z" fill="none" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/><path d="M50,78 V130 M38,82 L34,124 M62,82 L66,124 M33,102 H67" stroke="#2b2722" stroke-width="2"/>' },
    { id: 'ws-gelenk', name: 'Gelenkleuchte', preis: 5, form: 'gelenk', farbe: '#d6a14c', licht: '#fff0c0', vb: '0 0 100 140', glut: [70, 52],
      svg: '<path d="M20,136 H52" stroke="#2b2722" stroke-width="6" stroke-linecap="round"/><path d="M36,134 L24,80 L58,40" fill="none" stroke="#2b2722" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M36,134 L24,80 L58,40" fill="none" stroke="#d6a14c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="80" r="4" fill="#3d3732"/>' +
        '<path d="M54,30 L86,46 L74,68 L46,52Z" fill="#d6a14c" stroke="#2b2722" stroke-width="2.4" stroke-linejoin="round"/><path' + RL() + ' d="M50,54 L74,66 L80,56 L56,46Z" fill="#fff0c0" opacity="0"/>' },
    { id: 'ws-signal', name: 'Bahnlaterne', preis: 6, form: 'laterne', farbe: '#a4492e', licht: '#ffb070', vb: '0 0 100 140', glut: [50, 84],
      svg: '<path d="M50,0 V46 M40,46 Q50,36 60,46" fill="none" stroke="#2b2722" stroke-width="2.4"/><path d="M34,52 H66 L70,62 H30Z" fill="#a4492e" stroke="#2b2722" stroke-width="2.2"/><path d="M34,62 H66 V108 H34Z" fill="#fde7c8" stroke="#2b2722" stroke-width="2.4"/>' +
        '<rect' + RL() + ' x="38" y="66" width="24" height="38" fill="#ffb070" opacity="0"/><path d="M50,62 V108 M34,85 H66" stroke="#2b2722" stroke-width="1.6"/><path d="M30,108 H70 V118 H30Z" fill="#a4492e" stroke="#2b2722" stroke-width="2.2"/>' }
  ],
  bibliothek: [
    { id: 'bib-lese', name: 'Leselampe', preis: 0, form: 'tisch', farbe: '#6b4b33', licht: '#ffe2a0', vb: '0 0 100 120', glut: [62, 40],
      svg: '<path d="M30,116 H66" stroke="#2b2722" stroke-width="6" stroke-linecap="round"/><path d="M48,114 V58 Q48,30 62,28" fill="none" stroke="#c9a03a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M44,40 Q62,20 84,36 L76,48 Q62,40 50,48Z" fill="#6b4b33" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/><path' + RL() + ' d="M52,46 Q62,40 74,46 L70,52 Q62,48 56,52Z" fill="#ffe2a0" opacity="0"/>' },
    { id: 'bib-banker', name: 'Grüne Tischlampe', preis: 4, form: 'tisch', farbe: '#3f7a55', licht: '#fff0c0', vb: '0 0 100 120', glut: [50, 52],
      svg: '<path d="M30,112 Q50,100 70,112 L72,118 H28Z" fill="#c9a03a" stroke="#2b2722" stroke-width="2.2"/><path d="M50,104 V52" stroke="#c9a03a" stroke-width="4"/>' +
        '<path d="M16,54 Q16,34 50,34 Q84,34 84,54Z" fill="#3f7a55" stroke="#2b2722" stroke-width="2.4" stroke-linejoin="round"/><path d="M26,44 q14,-6 30,-6" fill="none" stroke="#9fd0ad" stroke-width="2.6" stroke-linecap="round"/><path' + RL() + ' d="M20,54 H80 Q50,62 20,54Z" fill="#fff0c0" opacity="0"/>' },
    { id: 'bib-laterne', name: 'Messinglaterne', preis: 5, form: 'laterne', farbe: '#c9a03a', licht: '#ffd27a', vb: '0 0 100 120', glut: [50, 66],
      svg: '<path d="M50,4 V18 M40,18 H60 L66,28 H34Z" fill="#c9a03a" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/><path d="M36,28 H64 V100 H36Z" fill="#fde7a8" fill-opacity=".6" stroke="#2b2722" stroke-width="2.4"/>' +
        '<path' + RL() + ' d="M50,74 c-6,-6 -3,-14 0,-18 c3,4 6,12 0,18z" fill="#ffd27a" opacity="0"/><path d="M44,74 h12 v22 h-12z" fill="#fbf7f0" stroke="#2b2722" stroke-width="1.6"/><path d="M36,64 H64 M50,28 V100" stroke="#2b2722" stroke-width="1.2" opacity=".5"/><path d="M30,100 H70 V110 H30Z" fill="#c9a03a" stroke="#2b2722" stroke-width="2.2"/>' },
    { id: 'bib-krone', name: 'Kerzenkrone', preis: 7, form: 'krone', farbe: '#8a6744', licht: '#ffcf80', vb: '0 0 100 120', glut: [50, 74],
      svg: '<path d="M50,0 V60" stroke="#2b2722" stroke-width="2"/><path d="M10,86 Q50,104 90,86" fill="none" stroke="#8a6744" stroke-width="5" stroke-linecap="round"/><path d="M50,60 L18,84 M50,60 L82,84 M50,60 V94" stroke="#8a6744" stroke-width="2.6"/>' +
        [18, 34, 50, 66, 82].map(function (x, i) { var y = i === 2 ? 74 : i % 2 ? 80 : 74; return '<path d="M' + (x - 3) + ',' + y + ' h6 v12 h-6z" fill="#fbf7f0" stroke="#2b2722" stroke-width="1.4"/><path' + RL() + ' d="M' + x + ',' + (y - 2) + ' c-4,-4 -2,-9 0,-12 c2,3 4,8 0,12z" fill="#ffcf80" opacity="0"/>'; }).join('') },
    { id: 'bib-globus', name: 'Globuslampe', preis: 5, form: 'tisch', farbe: '#9fc3dd', licht: '#ffe9b0', vb: '0 0 100 120', glut: [50, 46],
      svg: '<circle cx="50" cy="46" r="30" fill="#9fc3dd" stroke="#2b2722" stroke-width="2.4"/><circle' + RL() + ' cx="50" cy="46" r="27" fill="#ffe9b0" opacity="0"/>' +
        '<path d="M32,36 q10,-6 16,4 q-2,10 8,10 q10,2 6,14 M60,22 q8,6 14,14" fill="#8ea37a" fill-opacity=".9" stroke="#2b2722" stroke-width="1.6"/><path d="M50,76 V104 M32,110 Q50,98 68,110Z" fill="#a9784c" stroke="#2b2722" stroke-width="2.4"/>' }
  ]
};
Object.keys(RAUMLAMPEN).forEach(function (r) { RAUMLAMPEN[r].forEach(function (l) { l.raum = r; l.svgFertig = rlSvg(l.vb, l.svg); }); });
var RAUM_NAME = { zuhause: 'Für Zuhause', werkstatt: 'Für die Werkstatt', bibliothek: 'Für die Bibliothek' };
var HEFT_SVG = '<svg viewBox="0 0 64 54" aria-hidden="true"><ellipse cx="32" cy="51" rx="28" ry="3" fill="rgba(43,39,34,.18)"/>' +
  '<g transform="rotate(-8 32 28)"><path d="M6 8h50v40H6z" fill="#fbf7f0" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>' +
  '<path d="M6 8h8v40H6z" fill="#d62a26" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>' +
  '<text x="35" y="25" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="14" fill="#2b2722">Katalog</text>' +
  '<path d="M24 42l6-7 5 4 6-8 6 11z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.2" stroke-linejoin="round"/><circle cx="46" cy="32" r="2.6" fill="#e2b93b"/></g></svg>';
function raumlampeVon(raum, id) { var l = RAUMLAMPEN[raum] || [], x = null; l.forEach(function (y) { if (y.id === id) x = y; }); return x; }
function hatRaumlampe(raum, id) { var x = raumlampeVon(raum, id); return !!x && (x.preis === 0 || E().besitz.indexOf('raumlampe:' + raum + ':' + id) >= 0 || kasseHat({ id: 'raumlampe:' + raum + ':' + id })); }
function raumlampeJetzt(raum) {
  var l = RAUMLAMPEN[raum]; if (!l) return null;
  var w = (E().raumlampe || {})[raum], x = raumlampeVon(raum, w);
  x = x && hatRaumlampe(raum, x.id) ? x : l[0];
  return { id: x.id, raum: raum, name: x.name, form: x.form, farbe: x.farbe, licht: x.licht, preis: x.preis, svg: x.svgFertig, vb: x.vb, glut: x.glut.slice() };
}
function malRaumlampen(box, raum) {
  var jetzt = raumlampeJetzt(raum).id;
  RAUMLAMPEN[raum].forEach(function (x) {
    var hat0 = hatRaumlampe(raum, x.id);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-karte c6e-karte-raumlampe' + (jetzt === x.id ? ' c6e-gewaehlt' : '');
    b.dataset.id = x.id; b.setAttribute('data-licht', ''); b.setAttribute('aria-pressed', jetzt === x.id ? 'true' : 'false');
    b.setAttribute('aria-label', x.name + (hat0 ? '' : ', ' + x.preis + ' Münzen') + (jetzt === x.id ? ', leuchtet schon' : ''));
    if (heftAn()) { b.className = 'c6e-ware c6e-ware-lampe' + (jetzt === x.id ? ' c6e-steht' : ''); b.innerHTML = wareHtml({ id: 'rl-' + x.id, bild: lampeHeft(x), licht: x.licht, name: x.name, preis: x.preis, besitzt: hat0, stempel: jetzt === x.id ? 'leuchtet' : '' }); }
    else b.innerHTML = '<span class="c6e-bild c6e-bild-licht" style="--c6e-licht:' + x.licht + '">' + x.svgFertig.replace(/opacity="0"/g, 'opacity=".85"') + '</span><span class="c6e-name">' + esc(x.name) + '</span><span class="c6e-preis">' + (jetzt === x.id ? 'leuchtet' : preisHtml(x.preis, hat0)) + '</span>';
    karteStand(b, x.preis, hat0 || jetzt === x.id);
    b.onclick = function () {
      if (jetzt === x.id) return;
      var stell = function () {
        aendern(function () { var e = E(); e.raumlampe = e.raumlampe || {}; e.raumlampe[raum] = x.id; });
        var lp = raumlampeJetzt(raum);
        emit('raumlampe', { raum: raum, id: x.id, lampe: lp });
        geaendert(raum === 'zuhause' ? 'zuhause' : 'raum:' + raum, { raumlampe: raum });
        landung('rl-' + x.id); malKarten();
        sag(raum === 'zuhause' ? 'Neues Licht in der Stube.' : raum === 'werkstatt' ? 'Die Werkstatt hat jetzt ihr neues Licht.' : 'Die Bibliothek hat jetzt ihr neues Licht.');
      };
      if (hat0) { stell(); return; }
      kasse({ id: 'raumlampe:' + raum + ':' + x.id, preis: x.preis, name: x.name, licht: x.licht }, b).then(function (ok) {
        if (!ok || !auf) return;
        aendern(function () { var t = 'raumlampe:' + raum + ':' + x.id; if (E().besitz.indexOf(t) < 0) E().besitz.push(t); });
        stell();
      });
    };
    box.appendChild(b);
  });
  hinweis(raum === 'zuhause' ? 'Die Lampe neben dem Sessel. Tipp eine an.' : raum === 'werkstatt' ? 'Die Lampe über der Werkbank. Tipp eine an.' : 'Die Lampe auf dem Lesetisch. Tipp eine an.');
}

function sesselVon(id) { var x = null; SESSEL_LISTE.forEach(function (y) { if (y.id === id) x = y; }); return x; }

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
function hat(id) { var k = NACH[id]; return !!k && (k.preis === 0 || E().besitz.indexOf(id) >= 0 || kasseHat(k)); }
function hatUfo(r, id) { var w = ufoWahl(r, id); return !!w && (w.preis === 0 || E().besitz.indexOf('ufo:' + r + ':' + id) >= 0); }
function dinge(o) {
  var key = ortSchl(o); if (!key || key === 'ufo') return [];
  var l = E().orte[key]; if (!Array.isArray(l)) return [];
  return l.map(function (d) { var k = NACH[d.id]; if (!k) return null; return { id: d.id, uid: d.uid, svg: k.svg, x: d.x, y: d.y, breite: k.breite, verhaeltnis: k.ar, name: k.name, licht: k.licht || null, glut: k.glut || null, an: k.licht ? d.aus !== true : false }; }).filter(Boolean);
}
function geaendert(key, extra) {
  var d = { ort: key }; if (/^space:/.test(key)) d.sid = key.slice(6);
  for (var k in extra || {}) d[k] = extra[k];
  emit('einrichten', d);
}
// Die Kasse (C6.muenzen.kaufe): sie bucht ab und merkt sich den Besitz; ohne Kasse zahlt man direkt mit Münzen
function kassenId(k) {
  if (/^raumlampe:/.test(k.id)) { var rp = k.id.split(':'); return 'lampe:' + rp[1] + '-' + rp[2]; }
  if (/^ufo:/.test(k.id)) return k.id;
  if (/^sessel:/.test(k.id)) return 'moebel:' + k.id.replace(':', '-');
  if (k.licht) return 'lampe:' + k.id;
  if (k.reihe === 'ambiente') return 'ambiente:' + ((k.orte && k.orte[0]) || 'alle') + ':' + k.id;
  return 'moebel:' + k.id;
}
function kasse(k, wo) {
  var preis = Math.max(0, Math.floor(+k.preis || 0)), M = C6.muenzen;
  if (!preis) return Promise.resolve(true);
  function nein() {
    var f = null; try { f = M && typeof M.warum === 'function' ? M.warum() : null; } catch (e) { f = null; }
    var n = f && +f.fehlt > 0 ? Math.round(+f.fehlt) : 0;
    sag(n ? 'Noch ' + (n === 1 ? 'eine Münze' : n + ' Münzen') + '. Es läuft nicht weg.' : st('einrichten.zuwenig', 'Dafür reichen die Münzen noch nicht. Im Kieselpark gibt es welche.'));
    return false;
  }
  try {
    if (M && typeof M.kaufe === 'function') return Promise.resolve(M.kaufe(kassenId(k), preis, { art: /^sessel:/.test(k.id) ? 'moebel' : k.licht ? 'lampe' : k.reihe === 'ambiente' ? 'ambiente' : 'moebel', name: k.name })).then(function (r) { return r === true ? true : nein(); }, function () { return false; });
  } catch (e) { }
  if (M && typeof M.ausgeben === 'function' && M.ausgeben(preis)) return Promise.resolve(true);
  return Promise.resolve(nein());
}
// schon gekauft (bei mir oder an der Kasse)?
function kasseHat(k) { try { return !!(C6.muenzen && typeof C6.muenzen.hat === 'function' && C6.muenzen.hat(kassenId(k))); } catch (e) { return false; } }
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
  if (!blatt) blatt = document.createElement('div');
  blatt.className = 'c6e-blatt'; blatt.setAttribute('role', 'dialog'); blatt.setAttribute('aria-label', 'Einrichten'); blatt.removeAttribute('tabindex');
  blatt.setAttribute('data-c6-kein-wisch', ''); blatt.setAttribute('data-c6-bild', ''); blatt._art = 'blatt';
  blatt.innerHTML = '<div class="c6e-kopf"><b class="c6e-titel">Einrichten</b><span class="c6e-hinweis" aria-live="polite"></span><button type="button" class="c6e-fertig">Fertig</button></div>' +
    '<div class="c6e-reihen" role="tablist"></div><div class="c6e-karten" role="list"></div><div class="c6e-tun" hidden></div>';
  blatt.querySelector('.c6e-fertig').onclick = function () { if (gewaehlt) { gewaehlt = null; fangAn(false); malKarten(); return; } zu(); };
}
function hinweis(t) { if (stillHinweis || !blatt) return; var h = blatt.querySelector('.c6e-hinweis'); if (h) h.textContent = t || ''; }
function reihenListe() {
  if (auf.ort === 'ufo') return UFO_REIHEN.map(function (r) { return { id: r.id, name: r.name }; });
  if (auf.ort === 'zuhause') return [{ id: 'spaces', name: 'Für deine Spaces' }, { id: 'rl-zuhause', name: RAUM_NAME.zuhause }, { id: 'rl-werkstatt', name: RAUM_NAME.werkstatt }, { id: 'rl-bibliothek', name: RAUM_NAME.bibliothek }, { id: 'sessel', name: 'Sessel' }];
  var l = REIHEN.slice();
  var pn = ortName(auf.place);
  if (pn) l.unshift({ id: 'hier', name: 'Für ' + pn });
  if (auf.ort === 'space' && C6.space && C6.space.themen) l.push({ id: 'thema', name: 'Licht & Boden' });
  return l;
}
function ortName(pid) {
  var P = null; try { P = C6.space && C6.space.places; } catch (e) { P = null; }
  if (!pid || !P || !P[pid]) return '';
  if (!KATALOG.some(function (k) { return k.orte && k.orte.indexOf(pid) >= 0; })) return '';
  return P[pid].name;
}
function malReihen() {
  if (heftAn()) return;
  var box = blatt.querySelector('.c6e-reihen'); box.innerHTML = '';
  reihenListe().forEach(function (r) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-reihe' + (r.id === reihe ? ' c6e-an' : '');
    b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', r.id === reihe); b.textContent = r.name;
    b.onclick = function () { reihe = r.id; gewaehlt = null; malReihen(); malKarten(); };
    box.appendChild(b);
  });
}
function muenzStand() { try { return C6.muenzen && typeof C6.muenzen.stand === 'function' ? Math.max(0, +C6.muenzen.stand() || 0) : 0; } catch (e) { return 0; } }
function preisHtml(preis, besitzt) {
  if (besitzt) return preis ? 'deins' : 'frei';
  return (C6.muenzen ? C6.muenzen.muenze(16) : '') + '<span>' + preis + '</span>';
}
// eine Karte zeigt, ob die Münzen reichen (leise, ohne Druck): neu bei jeder Münzänderung
function karteStand(b, preis, besitzt) {
  var fehlt = besitzt ? 0 : Math.max(0, (+preis || 0) - muenzStand());
  b.classList.toggle('c6e-zuteuer', fehlt > 0);
  b.setAttribute('data-fehlt', String(fehlt));
  if (fehlt > 0) b.setAttribute('title', 'Noch ' + (fehlt === 1 ? 'eine Münze' : fehlt + ' Münzen'));
  else b.removeAttribute('title');
}
function malKarten() {
  if (heftAn()) return malHeft();
  var box = blatt.querySelector('.c6e-karten'); box.innerHTML = '';
  blatt.classList.remove('c6e-klein'); blatt.querySelector('.c6e-fertig').textContent = 'Fertig';
  if (auf.ort === 'ufo') return malUfoKarten(box);
  if (reihe === 'thema') return malThemen(box);
  if (auf.ort === 'zuhause') return reihe === 'spaces' ? malSpaces(box) : /^rl-/.test(reihe) ? malRaumlampen(box, reihe.slice(3)) : malSessel(box);
  KATALOG.filter(function (k) { return reihe === 'hier' ? !!(k.orte && k.orte.indexOf(auf.place) >= 0) : k.reihe === reihe; }).forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-karte' + (gewaehlt === k.id ? ' c6e-gewaehlt' : '');
    b.dataset.id = k.id; b.setAttribute('role', 'listitem');
    b.setAttribute('aria-label', k.name + (hat(k.id) ? '' : ', ' + k.preis + ' Münzen') + '. Tippen, dann in den Raum tippen. Oder auf den Raum ziehen.');
    b.innerHTML = '<span class="c6e-bild' + (k.licht ? ' c6e-bild-licht' : '') + '"' + (k.licht ? ' style="--c6e-licht:' + k.licht + '"' : '') + '>' + k.svg + '</span><span class="c6e-name">' + esc(k.name) + '</span><span class="c6e-preis">' + preisHtml(k.preis, hat(k.id)) + '</span>';
    if (k.licht) b.setAttribute('data-licht', '');
    karteStand(b, k.preis, hat(k.id));
    b.addEventListener('pointerdown', function (e) { ziehStart(e, k, b); });
    b.addEventListener('click', function () { if (zug && zug.bewegt) return; waehle(k.id); });
    box.appendChild(b);
  });
  hinweis(gewaehlt ? st('einrichten.tippen', 'Tipp in den Raum, wo es stehen soll.') : (C6.geraet === 'computer' ? st('einrichten.ziehen', 'Auf den Raum ziehen oder antippen.') : 'Antippen, dann in den Raum tippen.'));
  var klein = !!gewaehlt && C6.geraet !== 'computer';
  blatt.classList.toggle('c6e-klein', klein);
  blatt.querySelector('.c6e-fertig').textContent = gewaehlt ? 'Abbrechen' : 'Fertig';
}
// Stube: der Sessel neben dem Sofa ist austauschbar (einer steht immer da)
function sesselJetzt() { var z = E().zuhause || {}; var id = z.sessel; return sesselVon(id) && hatSessel(id) ? id : 'lese'; }
function hatSessel(id) { var x = sesselVon(id); return !!x && (x.preis === 0 || E().besitz.indexOf('sessel:' + id) >= 0 || kasseHat({ id: 'sessel:' + id })); }
function malSessel(box) {
  var jetzt = sesselJetzt();
  SESSEL_LISTE.forEach(function (x) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-karte c6e-karte-sessel' + (jetzt === x.id ? ' c6e-gewaehlt' : '');
    b.dataset.id = x.id; b.setAttribute('aria-pressed', jetzt === x.id ? 'true' : 'false');
    b.setAttribute('aria-label', x.name + (hatSessel(x.id) ? '' : ', ' + x.preis + ' Münzen') + (jetzt === x.id ? ', steht da' : ''));
    if (heftAn()) { b.className = 'c6e-ware c6e-ware-sessel' + (jetzt === x.id ? ' c6e-steht' : ''); b.innerHTML = wareHtml({ id: 'se-' + x.id, bild: x.svg, name: x.name, preis: x.preis, besitzt: hatSessel(x.id), stempel: jetzt === x.id ? 'steht da' : '' }); }
    else b.innerHTML = '<span class="c6e-bild">' + x.svg + '</span><span class="c6e-name">' + esc(x.name) + '</span><span class="c6e-preis">' + (jetzt === x.id ? 'steht da' : preisHtml(x.preis, hatSessel(x.id))) + '</span>';
    karteStand(b, x.preis, hatSessel(x.id) || jetzt === x.id);
    b.onclick = function () {
      if (jetzt === x.id) return;
      var stell = function () {
        aendern(function () { var e = E(); e.zuhause = e.zuhause || {}; e.zuhause.sessel = x.id; });
        geaendert('zuhause', { sessel: x.id }); landung('se-' + x.id); malKarten();
        sag(st('einrichten.sessel', 'Neuer Sessel. Ich probier ihn später aus.'));
      };
      if (hatSessel(x.id)) { stell(); return; }
      kasse({ id: 'sessel:' + x.id, preis: x.preis, name: x.name }, b).then(function (ok) {
        if (!ok || !auf) return;
        aendern(function () { if (E().besitz.indexOf('sessel:' + x.id) < 0) E().besitz.push('sessel:' + x.id); });
        stell();
      });
    };
    box.appendChild(b);
  });
  hinweis(st('einrichten.sessel.hinweis', 'Such dir einen aus. Einer steht immer da.'));
}
// Stube: Lampen und Kleinigkeiten wohnen in den Spaces – der Katalog zeigt den Weg dorthin (ein Tipp, dann ist er dort offen)
function spacesListe() { try { return (C6.space && C6.space.alle ? C6.space.alle() : []) || []; } catch (e) { return []; } }
function malSpaces(box) {
  var l = spacesListe().slice(0, 8);
  if (!l.length) { var p = document.createElement('p'); p.className = 'c6e-leer'; p.textContent = 'Lampen und Dinge stellst du in deine Spaces. Leg erst einen an: der Knäuel wartet auf einen Satz.'; box.appendChild(p); hinweis(''); return; }
  l.forEach(function (x) {
    var pid = (x.places || [])[0] || 'schreibtisch', n = 0;
    try { n = KATALOG.filter(function (k) { return k.orte && k.orte.indexOf(pid) >= 0; }).length; } catch (e) { n = 0; }
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-karte c6e-karte-space'; b.dataset.sid = x.stringId;
    var bild = ''; try { bild = C6.space.bild ? C6.space.bild(pid, true) : ''; } catch (e) { bild = ''; }
    var pn = ''; try { pn = (C6.space.places[pid] || {}).name || ''; } catch (e) { pn = ''; }
    b.setAttribute('aria-label', 'Katalog für „' + x.titel + '“ aufschlagen' + (pn ? ', Ort ' + pn : ''));
    if (heftAn()) { b.className = 'c6e-ware c6e-ware-space'; b.innerHTML = '<span class="c6e-rahmen c6e-rahmen-foto">' + bild + '</span><span class="c6e-name">' + esc(x.titel) + '</span><span class="c6e-unter">' + (pn ? esc(pn) : '') + (n ? (pn ? ' · ' : '') + n + ' Dinge' : '') + '</span>'; }
    else b.innerHTML = '<span class="c6e-bild c6e-bild-ort">' + bild + '</span><span class="c6e-name">' + esc(x.titel) + '</span><span class="c6e-preis">' + (n ? n + ' Dinge' + (pn ? ' · ' + esc(pn) : '') : esc(pn)) + '</span>';
    b.onclick = function () { zu(true); try { C6.space.oeffne(x.stringId, { einrichten: true }); } catch (e) { } };
    box.appendChild(b);
  });
  hinweis(st('einrichten.spaces.hinweis', 'Lampen und Dinge stehen in deinen Spaces. Such dir einen aus.'));
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
    karteStand(b, w.preis, hatUfo(r.id, w.id));
    b.onclick = function () {
      var setz = function () { aendern(function () { E().ufo[r.id] = w.id; }); geaendert('ufo'); malKarten(); };
      if (hatUfo(r.id, w.id)) { setz(); return; }
      kasse({ id: 'ufo:' + r.id + ':' + w.id, preis: w.preis, name: w.name }, b).then(function (ok) {
        if (!ok || !auf) return;
        aendern(function () { if (E().besitz.indexOf('ufo:' + r.id + ':' + w.id) < 0) E().besitz.push('ufo:' + r.id + ':' + w.id); });
        setz();
      });
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
    wahl = document.createElement('div'); wahl.className = 'c6e-fang'; wahl.setAttribute('data-c6-kein-wisch', ''); wahl.setAttribute('data-c6-ding', '');
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
  if (!hat(id)) {
    var ort0 = auf;
    kasse(k, blatt).then(function (ok) {
      if (!ok || auf !== ort0) return;
      aendern(function () { if (E().besitz.indexOf(id) < 0) E().besitz.push(id); });
      stelle(id, x, y);
    });
    return;
  }
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
  if (!auf || auf.ort === 'ufo' || auf.ort === 'zuhause') return;
  var f = flaeche(), b = buehne(); if (!f) return;
  if (!griffe) { griffe = document.createElement('div'); griffe.className = 'c6e-griffe'; griffe.setAttribute('data-c6-kein-wisch', ''); griffe.setAttribute('data-c6-ding', ''); }
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

/* ---------- Das Heft „Katalog“: ein gedrucktes Heft, das man aufschlägt ----------
   Jede Seite ein Sortiment im festen Raster aus sechs Feldern (fünf Dinge und ein Satz).
   Am Computer liegen zwei Seiten offen, am iPhone eine. Register am Rand, Blättern mit Wischen, Pfeil oder Tastatur. */
var HEFT_TEIL = [
  { id: 'spaces', kurz: 'Spaces', name: 'Für deine Spaces', art: 'Lampen, Dinge', farbe: '#a9bf8f' },
  { id: 'rl-zuhause', kurz: 'Zuhause', name: RAUM_NAME.zuhause, art: 'Lampen', farbe: '#e8c26e' },
  { id: 'rl-werkstatt', kurz: 'Werkstatt', name: RAUM_NAME.werkstatt, art: 'Lampen', farbe: '#9db5aa' },
  { id: 'rl-bibliothek', kurz: 'Bibliothek', name: RAUM_NAME.bibliothek, art: 'Lampen', farbe: '#d39a7c' },
  { id: 'sessel', kurz: 'Sessel', name: 'Sessel', art: 'für die Stube', farbe: '#bfa9d8' }
];
var HEFT_SATZ = {
  'rl-zuhause': 'Die Lampe neben dem Sessel. Tipp eine an.',
  'rl-werkstatt': 'Die Lampe über der Werkbank. Tipp eine an.',
  'rl-bibliothek': 'Die Lampe auf dem Lesetisch. Tipp eine an.'
};
var vorFokus = null, seite = 0, landet = null, stillHinweis = false, heftZu = 0, wisch = null, gewischt = false, heftDoppel = null;
function heftAn() { return !!(auf && auf.ort === 'zuhause'); }
function doppel() { try { return window.matchMedia('(min-width:1200px)').matches; } catch (e) { return false; } }
function landung(id) { landet = { id: id, t: Date.now() }; }
function teilVon(id) { var t = null; HEFT_TEIL.forEach(function (x) { if (x.id === id) t = x; }); return t; }
// Lampe für das Heft: brennt, mit ihrem eigenen Schein hinter dem Schirm (bleibt im Rahmen)
function lampeHeft(x) {
  var vb = x.vb.split(' ').map(Number), w = vb[2], h = vb[3], gid = 'c6e-hg-' + x.raum + '-' + x.id;
  var r = Math.max(w, h * .34);
  return '<svg viewBox="' + x.vb + '" aria-hidden="true" focusable="false"><defs><radialGradient id="' + gid + '"><stop offset="0" stop-color="' + x.licht + '" stop-opacity=".9"/><stop offset=".45" stop-color="' + x.licht + '" stop-opacity=".38"/><stop offset="1" stop-color="' + x.licht + '" stop-opacity="0"/></radialGradient></defs>' +
    '<ellipse class="c6e-glut" cx="' + x.glut[0] + '" cy="' + x.glut[1] + '" rx="' + r.toFixed(0) + '" ry="' + (r * .86).toFixed(0) + '" fill="url(#' + gid + ')"/>' +
    x.svg.replace(/opacity="0"/g, 'opacity=".92"') + '</svg>';
}
// lange Namen dürfen an der Fuge brechen (Messing-laterne), nie mitten im Wort
function trenn(t) { return esc(t).replace(/([a-zäöüß]{4,})(laterne|lampe|leuchte|birne|sessel|stuhl|krone|lampion)/gi, '$1&shy;$2'); }
function muenzeHtml(n) { try { return C6.muenzen && C6.muenzen.muenze ? C6.muenzen.muenze(n || 18) : ''; } catch (e) { return ''; } }
// eine Ware: gerahmte Abbildung, Name, Preis als Plakette von Hand, „steht da“ als Stempel
function wareHtml(o) {
  var plak = o.stempel ? '' : o.besitzt ? '<span class="c6e-plakette c6e-plakette-deins">' + (o.preis ? 'deins' : 'frei') + '</span>' :
    '<span class="c6e-plakette">' + muenzeHtml(18) + '<b>' + o.preis + '</b></span>';
  var neu = landet && landet.id === o.id && Date.now() - landet.t < 900;
  return '<span class="c6e-rahmen' + (o.licht ? ' c6e-rahmen-licht' : '') + '"' + (o.licht ? ' style="--c6e-licht:' + o.licht + '"' : '') + '><span class="c6e-abb">' + String(o.bild).replace('<svg ', '<svg preserveAspectRatio="xMidYMax meet" ') + '</span>' +
    '</span><span class="c6e-name">' + trenn(o.name) + '</span><span class="c6e-preiszeile">' +
    (o.stempel ? '<span class="c6e-stempel' + (neu ? ' c6e-landet' : '') + '">' + esc(o.stempel) + '</span>' : plak) + '</span>';
}
// die Seiten des Hefts: Innendeckel, dann je Sortiment so viele Seiten, wie es braucht (fünf Dinge je Seite)
function heftSeiten() {
  var l = [{ art: 'inhalt' }];
  HEFT_TEIL.forEach(function (t) {
    var box = document.createElement('div'); stillHinweis = true;
    try { if (t.id === 'spaces') malSpaces(box); else if (t.id === 'sessel') malSessel(box); else malRaumlampen(box, t.id.slice(3)); } finally { stillHinweis = false; }
    var dinge = Array.prototype.slice.call(box.children);
    var leer = dinge.length === 1 && dinge[0].classList.contains('c6e-leer');
    if (leer || !dinge.length) { l.push({ art: 'teil', teil: t, dinge: [], leer: leer ? dinge[0].textContent : '' }); return; }
    for (var i = 0; i < dinge.length; i += 5) l.push({ art: 'teil', teil: t, dinge: dinge.slice(i, i + 5), nr: i / 5 });
  });
  if (doppel() && l.length % 2) l.push({ art: 'ende' });
  return l;
}
function ersteSeite(l, id) { for (var i = 0; i < l.length; i++) if (l[i].teil && l[i].teil.id === id) return i; return 1; }
function seiteBauen(p, i, l) {
  var s = document.createElement('section'); s.className = 'c6e-seite';
  s.setAttribute('aria-label', p.art === 'inhalt' ? 'Inhalt' : p.art === 'ende' ? 'Rückseite' : p.teil.name + ', Seite ' + i);
  if (p.art === 'inhalt') {
    s.classList.add('c6e-seite-inhalt');
    var h = '<h2 class="c6e-titelblatt">Katalog</h2><p class="c6e-unterzeile">Lampen, Sessel und Dinge für deine Räume</p><ol class="c6e-inhalt">';
    HEFT_TEIL.forEach(function (t) { h += '<li><button type="button" class="c6e-inhalt-zeile" data-teil="' + t.id + '" style="--c6e-farbe:' + t.farbe + '"><span>' + esc(t.name) + '</span><i></i><b>' + ersteSeite(l, t.id) + '</b></button></li>'; });
    h += '</ol><p class="c6e-tasche">Du hast ' + muenzeHtml(20) + '<b>' + muenzStand() + '</b> ' + (muenzStand() === 1 ? 'Münze' : 'Münzen') + '.</p>';
    s.innerHTML = h;
    Array.prototype.forEach.call(s.querySelectorAll('.c6e-inhalt-zeile'), function (b) { b.onclick = function () { blaettern(ersteSeite(heftSeiten(), b.getAttribute('data-teil'))); }; });
    return s;
  }
  if (p.art === 'ende') { s.classList.add('c6e-seite-ende'); s.innerHTML = '<p class="c6e-ende">' + esc(st('einrichten.heft.ende', 'Münzen gibt es im Kieselpark.')) + '</p>'; return s; }
  s.style.setProperty('--c6e-farbe', p.teil.farbe); s.setAttribute('data-teil', p.teil.id);
  s.innerHTML = '<header class="c6e-kolumne"><b>' + esc(p.teil.name) + '</b><span>' + esc(p.teil.art) + (p.nr ? ' · weiter' : '') + '</span></header><div class="c6e-raster"></div><footer class="c6e-folio">' + i + '</footer>';
  var r = s.querySelector('.c6e-raster');
  if (!p.dinge.length) { var e = document.createElement('p'); e.className = 'c6e-leer c6e-leer-heft'; e.textContent = p.leer || ''; r.appendChild(e); return s; }
  p.dinge.forEach(function (d) { r.appendChild(d); });
  // das sechste Feld: ein Satz von Hand und was in der Tasche ist
  var satz = p.teil.id === 'spaces' ? st('einrichten.spaces.hinweis', 'Lampen und Dinge stehen in deinen Spaces. Such dir einen aus.') : p.teil.id === 'sessel' ? st('einrichten.sessel.hinweis', 'Such dir einen aus. Einer steht immer da.') : HEFT_SATZ[p.teil.id];
  var f = document.createElement('p'); f.className = 'c6e-feld-satz';
  f.innerHTML = '<span>' + esc(satz) + '</span>' + (p.teil.id === 'spaces' ? '' : '<small>Du hast ' + muenzeHtml(16) + '<b>' + muenzStand() + '</b></small>');
  r.appendChild(f);
  return s;
}
function baueHeft() {
  blatt.className = 'c6e-blatt c6e-heft'; blatt.setAttribute('aria-label', 'Katalog'); blatt.setAttribute('tabindex', '-1');
  blatt.innerHTML = '<div class="c6e-buch"><div class="c6e-seiten"></div>' +
    '<div class="c6e-deckel" aria-hidden="true"><span class="c6e-deckel-ruecken"></span><span class="c6e-deckel-titel">Katalog</span><svg viewBox="0 0 40 24" aria-hidden="true"><path d="M2 22l10-12 8 7 9-12 9 17z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.6" stroke-linejoin="round"/><circle cx="31" cy="6" r="3" fill="#e2b93b" stroke="#2b2722" stroke-width="1.2"/></svg></div>' +
    '<button type="button" class="c6e-blaettern c6e-zurueck" aria-label="Zurückblättern"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<button type="button" class="c6e-blaettern c6e-vor" aria-label="Weiterblättern"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<p class="c6e-hinweis" aria-live="polite"></p></div>' +
    '<div class="c6e-register" role="tablist" aria-label="Register"></div>' +
    '<button type="button" class="c6e-fertig c6e-zuklappen" aria-label="Katalog zuklappen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>';
  blatt.querySelector('.c6e-zuklappen').onclick = function () { zu(); };
  blatt.querySelector('.c6e-zurueck').onclick = function () { blaettern(seite - (doppel() ? 2 : 1)); };
  blatt.querySelector('.c6e-vor').onclick = function () { blaettern(seite + (doppel() ? 2 : 1)); };
  var sb = blatt.querySelector('.c6e-seiten');
  // Wischen blättert; ein Wisch löst keinen Kauf aus
  sb.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' && e.button !== 0) return; wisch = { x: e.clientX, y: e.clientY }; gewischt = false; });
  sb.addEventListener('pointerup', function (e) {
    if (!wisch) return; var dx = e.clientX - wisch.x, dy = e.clientY - wisch.y; wisch = null;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) { gewischt = true; blaettern(seite + (dx < 0 ? 1 : -1) * (doppel() ? 2 : 1)); setTimeout(function () { gewischt = false; }, 60); }
  });
  sb.addEventListener('pointercancel', function () { wisch = null; });
  sb.addEventListener('click', function (e) { if (gewischt) { e.stopPropagation(); e.preventDefault(); gewischt = false; } }, true);
  blatt._art = 'heft';
}
function malHeft(richtung) {
  if (!blatt || blatt._art !== 'heft') return;
  var l = heftSeiten(), d = doppel(); heftDoppel = d;
  seite = Math.max(0, Math.min(l.length - 1, seite)); if (d) seite -= seite % 2;
  var sb = blatt.querySelector('.c6e-seiten'); sb.innerHTML = '';
  sb.classList.toggle('c6e-doppel', d); blatt.classList.toggle('c6e-heft-doppel', d);
  var zeig = d ? [seite, seite + 1] : [seite];
  zeig.forEach(function (i, k) { if (!l[i]) return; var s = seiteBauen(l[i], i, l); s.classList.add(k ? 'c6e-seite-r' : d ? 'c6e-seite-l' : 'c6e-seite-r'); sb.appendChild(s); });
  // welches Sortiment liegt offen? (am Computer zählt die erste Seite mit Ware)
  var offen = null; zeig.forEach(function (i) { if (!offen && l[i] && l[i].teil) offen = l[i].teil.id; });
  if (offen) reihe = offen;
  var reg = blatt.querySelector('.c6e-register'); reg.innerHTML = '';
  HEFT_TEIL.forEach(function (t) {
    var an = zeig.some(function (i) { return l[i] && l[i].teil && l[i].teil.id === t.id; });
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c6e-reiter' + (an ? ' c6e-an' : '');
    b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', an ? 'true' : 'false'); b.setAttribute('aria-label', t.name);
    b.style.setProperty('--c6e-farbe', t.farbe); b.innerHTML = '<span>' + esc(t.kurz) + '</span>';
    b.onclick = function () { blaettern(ersteSeite(heftSeiten(), t.id)); };
    reg.appendChild(b);
  });
  var z = blatt.querySelector('.c6e-zurueck'), v = blatt.querySelector('.c6e-vor');
  z.hidden = seite <= 0; v.hidden = seite + (d ? 2 : 1) >= l.length;
  if (richtung && !C6.ruhig) {
    try { sb.animate([{ opacity: .35, transform: 'translateX(' + (richtung > 0 ? 18 : -18) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
  }
}
function blaettern(n) {
  if (!heftAn()) return;
  var l = heftSeiten(), alt = seite;
  n = Math.max(0, Math.min(l.length - 1, n)); if (doppel()) n -= n % 2;
  if (n === alt) return;
  seite = n; hinweis(''); malHeft(n > alt ? 1 : -1);
}
function heftAuf() {
  if (C6.ruhig) return;
  var deck = blatt.querySelector('.c6e-deckel'), d = doppel();
  try {
    blatt.animate([{ opacity: 0, transform: 'translateY(10px) scale(.97)' }, { opacity: 1, transform: 'none', offset: .3 }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.3,.7,.3,1)' });
    deck.animate([{ transform: 'rotateY(0deg)', opacity: 1 }, { transform: 'rotateY(' + (d ? -178 : -110) + 'deg)', opacity: d ? 1 : 0 }], { duration: 400, delay: 30, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'backwards' });
  } catch (e) {}
}
function heftZuklappen(fertig) {
  if (C6.ruhig || !blatt) { fertig(); return; }
  var deck = blatt.querySelector('.c6e-deckel'), d = doppel();
  try {
    deck.animate([{ transform: 'rotateY(' + (d ? -178 : -110) + 'deg)', opacity: d ? 1 : 0 }, { transform: 'rotateY(0deg)', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' });
    blatt.animate([{ opacity: 1, transform: 'none' }, { opacity: 1, transform: 'none', offset: .75 }, { opacity: 0, transform: 'translateY(8px) scale(.97)' }], { duration: 360, easing: 'ease-in', fill: 'forwards' });
  } catch (e) { fertig(); return; }
  heftZu = setTimeout(fertig, 360);
}

/* ---------- auf / zu ---------- */
function oeffne(o) {
  o = o || {};
  // aus einem Raum heraus (Werkstatt, Bibliothek, Zuhause): der Katalog schlägt die Lampen dieses Raums auf
  if (o.raum && RAUMLAMPEN[o.raum] && (!o.ort || o.ort === o.raum || o.ort === 'zuhause')) { o.ort = 'zuhause'; o.reiheRaum = 'rl-' + o.raum; }
  o = o || {};
  if (o.ort === 'ufo' && C6.verbindung && !C6.verbindung.verbunden()) { if (C6.verbindung.oeffne) { C6.verbindung.oeffne(); return false; } sag(st('ufo.zu', 'Das UFO schläft noch. Es wacht auf, wenn du mich mit deinem Rechner verbindest.')); return false; }
  if (o.ort === 'space' && !o.sid) return false;
  if (heftZu) { clearTimeout(heftZu); heftZu = 0; abbau(); }
  auf = o; gewaehlt = null; gewaehltDing = null;
  if (o.ort === 'zuhause') { if (!blatt) blatt = document.createElement('div'); baueHeft(); blatt.setAttribute('role', 'dialog'); blatt.setAttribute('data-c6-kein-wisch', ''); blatt.setAttribute('data-c6-bild', ''); }
  else if (!blatt || blatt._art !== 'blatt') baue();
  reihe = o.ort === 'ufo' ? 'farbe' : o.ort === 'zuhause' ? (o.reiheRaum || (o.platz === 'sessel' ? 'sessel' : !spacesListe().length ? 'rl-zuhause' : 'spaces')) : (o.reihe || (ortName(o.place) ? 'hier' : 'moebel'));
  blatt.classList.toggle('c6e-ufo-blatt', o.ort === 'ufo');
  blatt.classList.toggle('c6e-links', o.ort === 'zuhause');
  var b = buehne();
  if (o.ort === 'zuhause') {
    seite = ersteSeite(heftSeiten(), reihe); landet = null; vorFokus = document.activeElement;
    b.appendChild(blatt); b.classList.add('c6e-modus', 'c6e-modus-heft'); document.documentElement.classList.add('c6e-auf');
    malHeft(); heftAuf();
    try { blatt.focus({ preventScroll: true }); } catch (e) {}
    emit('einrichten', { ort: ortSchl(o), sid: o.sid, modus: true });
    return true;
  }
  blatt.querySelector('.c6e-titel').textContent = o.ort === 'ufo' ? 'UFO einrichten' : 'Einrichten';
  b.appendChild(blatt); b.classList.add('c6e-modus'); document.documentElement.classList.add('c6e-auf');
  malReihen(); malKarten(); malGriffe();
  try { blatt.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: C6.ruhig ? 0 : 240, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
  sag(o.ort === 'ufo' ? st('ufo.einrichten', 'Wie soll es aussehen?') : o.ort === 'zuhause' ? (/^rl-/.test(reihe) ? 'Welche Lampe soll hier leuchten?' : reihe === 'spaces' ? st('einrichten.katalog.auf', 'Lampen und Dinge holst du für einen Space. Welchen richten wir ein?') : st('einrichten.sessel.auf', 'Welcher Sessel soll hier stehen?')) : st('einrichten.auf', 'Richte es dir ein, wie du magst.'));
  emit('einrichten', { ort: ortSchl(o), sid: o.sid, modus: true });
  return true;
}
// das Blatt (oder Heft) aus dem Raum nehmen
function abbau() {
  if (heftZu) { clearTimeout(heftZu); heftZu = 0; }
  if (blatt) { try { blatt.getAnimations().forEach(function (a) { a.cancel(); }); var dk = blatt.querySelector('.c6e-deckel'); if (dk) dk.getAnimations().forEach(function (a) { a.cancel(); }); } catch (e) {} }
  var hatteFokus = false; try { hatteFokus = !!(blatt && blatt.contains(document.activeElement)); } catch (e) {}
  if (blatt && blatt.parentNode) { blatt.parentNode.classList.remove('c6e-modus', 'c6e-modus-heft'); blatt.parentNode.removeChild(blatt); }
  document.documentElement.classList.remove('c6e-auf');
  // wer das Heft aufgeschlagen hat, bekommt den Fokus zurück (Tastatur)
  if (hatteFokus && vorFokus && vorFokus.isConnected) { try { vorFokus.focus({ preventScroll: true }); } catch (e) {} }
  vorFokus = null;
}
function zu(sofort) {
  if (!auf) return;
  var key = ortSchl(auf);
  fangAn(false);
  if (griffe && griffe.parentNode) griffe.parentNode.removeChild(griffe);
  // das Heft klappt zu (am Computer schwingt der Deckel zurück); im Space und beim UFO geht das Blatt einfach
  if (key === 'zuhause' && sofort !== true && blatt && blatt.parentNode) heftZuklappen(function () { heftZu = 0; abbau(); });
  else abbau();
  var warUfo = key === 'ufo';
  auf = null; gewaehlt = null; gewaehltDing = null;
  if (key !== 'zuhause') sag(warUfo ? st('ufo.fertig', 'Fertig. Ich steig gleich ein.') : st('einrichten.fertig', 'Jetzt ist es deins.'));
  emit('einrichten', { ort: key, sid: /^space:/.test(key) ? key.slice(6) : undefined, modus: false });
}
if (C6.bus) {
  C6.bus.on('raum', function () { if (auf) zu(true); });
  // Münzen ändern sich (Kieselpark, Quest, Kasse): die Karten zeigen sofort den neuen Stand; eine gewählte Karte bleibt gewählt
  var malBald = 0;
  ['muenzen', 'gekauft', 'quest'].forEach(function (n) { C6.bus.on(n, function () { if (!auf) return; clearTimeout(malBald); malBald = setTimeout(function () { if (auf && blatt && !zug) { var sl = (blatt.querySelector('.c6e-karten') || {}).scrollLeft || 0; malKarten(); var kk = blatt.querySelector('.c6e-karten'); if (kk) kk.scrollLeft = sl; } }, 30); }); });
  // Tipp auf eine leere Stelle schließt den Katalog; wer gerade ein Ding zum Hinstellen hält, bricht nur die Wahl ab
  C6.bus.on('leer', function (d) {
    if (!auf) return;
    var z = d && (d.ziel || d.el || d.target);
    try { if (z && z.nodeType === 1 && ((blatt && blatt.contains(z)) || (wahl && wahl.contains(z)) || (griffe && griffe.contains(z)))) return; } catch (e) { }
    if (gewaehlt) { gewaehlt = null; fangAn(false); malKarten(); return; }
    if (gewaehltDing) { gewaehltDing = null; malGriffe(); return; }
    zu();
  });
}
window.addEventListener('resize', function () { if (heftAn() && heftDoppel !== doppel()) malHeft(); if (auf) { malGriffe(); if (wahl && wahl.parentNode) { var f = flaeche(); if (f) legeUeber(wahl, f); } } });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && auf) { e.stopPropagation(); zu(); return; }
  // im Heft blättern die Pfeiltasten (nicht, solange man irgendwo schreibt)
  if (!heftAn() || e.altKey || e.ctrlKey || e.metaKey) return;
  var t = e.target, tag = t && t.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
  var w = doppel() ? 2 : 1;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); e.stopPropagation(); blaettern(seite + w); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); e.stopPropagation(); blaettern(seite - w); }
  else if (e.key === 'Home') { e.preventDefault(); blaettern(0); }
  else if (e.key === 'End') { e.preventDefault(); blaettern(999); }
}, true);

C6.einrichten = {
  katalog: KATALOG, reihen: REIHEN,
  dinge: dinge, oeffne: oeffne, zu: zu,
  get offen() { return !!auf; },
  ufo: function () { var u = E().ufo, o = {}; for (var k in u) o[k] = u[k]; return o; },
  ufoSvg: ufoSvg, ufoReihen: UFO_REIHEN,
  // Stube: der Sessel, der gerade dasteht ({id, name, svg}); Liste aller Sessel
  sessel: function () { var x = sesselVon(sesselJetzt()); return x ? { id: x.id, name: x.name, svg: x.svg } : null; },
  sesselListe: SESSEL_LISTE,
  // Raumlampen: die gewählte Lampe eines Raums (nie null), die ganze Reihe, das Heft zum Hinlegen
  raumlampe: function (raum) { return raumlampeJetzt(raum); },
  lampen: function (raum) { return (RAUMLAMPEN[raum] || []).map(function (x) { return { id: x.id, raum: raum, name: x.name, form: x.form, farbe: x.farbe, licht: x.licht, preis: x.preis, svg: x.svgFertig, vb: x.vb, glut: x.glut.slice(), deins: hatRaumlampe(raum, x.id) }; }); },
  heft: HEFT_SVG,
  // Lampen im Space: an/aus (der Zustand gilt je Space und Ding)
  lampe: function (o, uid, an) {
    // C6.einrichten.lampe('werkstatt') → die Raumlampe; C6.einrichten.lampe({ort:'space',sid}, uid, an) → Lampe im Space knipsen
    if (typeof o === 'string') return raumlampeJetzt(o);
    var key = ortSchl(o), l = E().orte[key]; if (!Array.isArray(l)) return null;
    var d = null; l.forEach(function (x) { if (x.uid === uid) d = x; }); if (!d || !NACH[d.id] || !NACH[d.id].licht) return null;
    var neu = an == null ? d.aus === true : !!an;
    aendern(function () { (E().orte[key] || []).forEach(function (x) { if (x.uid === uid) { if (neu) delete x.aus; else x.aus = true; } }); });
    geaendert(key, { lampe: uid, an: neu });
    return neu;
  },
  hier: function (pid) { return KATALOG.filter(function (k) { return k.orte && k.orte.indexOf(pid) >= 0; }).map(function (k) { return { id: k.id, name: k.name, preis: k.preis, licht: k.licht || null }; }); }
};
