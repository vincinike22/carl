// Das Fahrrad aus dem Traum · jedes Teil lässt sich antippen, ändern und trägt einen Space
var C6 = window.C6 = window.C6 || {};

function S() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(fn);
  else { fn(S()); try { C6.speichern && C6.speichern(); } catch (e) {} }
}
function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function satz(k, rueck) { try { var t = C6.stimme && C6.stimme.sag(k); if (t) return t; } catch (e) {} return rueck; }
function kurz(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

var TU = '#2b2722', PA = '#fbf7f0';

// Lenkerformen: Bügel, Griff und die Stelle, an der die Klingel sitzt
var LENKER = {
  geschwungen: { d: 'M420 134L414 106Q430 90 400 92L362 100', g: 'M384 96L360 101', k: [406, 92], p: [366, 100] },
  gerade: { d: 'M420 134L413 98L372 96', g: 'M392 96.5L366 96', k: [404, 97], p: [364, 96] },
  hoch: { d: 'M420 134L414 104Q410 76 392 78L364 90', g: 'M384 82L362 91', k: [412, 92], p: [366, 88] },
  renn: { d: 'M420 134L416 110L396 108Q372 106 374 124Q376 140 392 136', g: 'M394 108Q374 106 375 124Q377 136 390 135', k: [408, 109], p: [376, 122] }
};
function lenkerForm(A) { return LENKER[A.lenker] || LENKER.geschwungen; }

// Die zehn Teile. reihen = was man am Teil ändern kann (Katalog im Kieselpark-Modul).
var TEILE = [
  { id: 'rahmen', name: 'Rahmen', am: 'am Rahmen', reihen: ['rahmenform', 'rahmenfarbe'], box: '120 118 340 196' },
  { id: 'hinterrad', name: 'Hinterrad', am: 'am Hinterrad', reihen: ['reifen', 'profil', 'felge'], box: '368 176 188 188' },
  { id: 'vorderrad', name: 'Vorderrad', am: 'am Vorderrad', reihen: ['reifen', 'profil', 'felge'], box: '368 176 188 188' },
  { id: 'sattel', name: 'Sattel', am: 'am Sattel', reihen: ['sattel', 'sattelfarbe'], box: '184 86 104 74' },
  { id: 'lenker', name: 'Lenker', am: 'am Lenker', reihen: ['lenker', 'band'], box: '350 62 84 84' },
  { id: 'klingel', name: 'Klingel', am: 'an der Klingel', reihen: ['klingelform', 'klingel'] },
  { id: 'korb', name: 'Korb', am: 'am Korb', reihen: ['korb', 'korbinhalt'], box: '432 62 132 116' },
  { id: 'licht', name: 'Licht', am: 'am Licht', reihen: ['licht', 'schein'], box: '444 170 70 52' },
  { id: 'pedale', name: 'Pedale', am: 'an den Pedalen', reihen: ['pedale', 'pedalfarbe'], box: '294 310 50 32' },
  { id: 'kette', name: 'Kette', am: 'an der Kette', reihen: ['kette', 'kettenschutz'], box: '124 236 196 60' }
];
var NACH = {}; TEILE.forEach(function (t) { NACH[t.id] = t; });

// Wo der Tipp-Punkt sitzt (in Rad-Einheiten 600×380), je nach Lenkerform
function punktVon(id, A) {
  var L = lenkerForm(A);
  switch (id) {
    case 'rahmen': return [352, 240];
    case 'hinterrad': return [78, 210];
    case 'vorderrad': return [524, 334];
    case 'sattel': return [232, 106];
    case 'lenker': return L.p;
    case 'klingel': return [L.k[0] + 26, L.k[1] - 36];
    case 'korb': return [506, 124];
    case 'licht': return [484, 208];
    case 'pedale': return [322, 330];
    case 'kette': return [204, 266];
  }
  return [300, 200];
}

function rad() {
  var s = S();
  if (!s.rad || typeof s.rad !== 'object') s.rad = {};
  if (!s.rad.teile || typeof s.rad.teile !== 'object') s.rad.teile = {};
  return s.rad;
}
function faden(teilId) {
  var id = rad().teile[teilId];
  if (!id || !C6.strings) return null;
  try { return C6.strings.hol(id); } catch (e) { return null; }
}
function alleGebunden() { return TEILE.every(function (t) { return !!faden(t.id); }); }
function katalog() { return (C6.kieselpark && C6.kieselpark.teile) || {}; }
function aus() { try { return (C6.kieselpark && C6.kieselpark.ausstattung()) || {}; } catch (e) { return {}; } }

// ---------- Zeichnung der Teile (jedes Teil für sich, damit eine Änderung nur ihr Teil neu zeichnet) ----------
function hell(f) { var m = /^#?([0-9a-f]{6})$/i.exec(f || ''); if (!m) return false; var n = parseInt(m[1], 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150; }
function rohr(d, w, f) {
  var cap = ' fill="none" stroke-linecap="round" stroke-linejoin="round"';
  if (!f || f === TU) return '<path d="' + d + '" stroke="' + TU + '" stroke-width="' + w + '"' + cap + '/>';
  return '<path d="' + d + '" stroke="' + TU + '" stroke-width="' + (w + 3.6) + '"' + cap + '/><path d="' + d + '" stroke="' + f + '" stroke-width="' + (w - 0.8) + '"' + cap + '/>';
}
var RAHMEN = {
  diamant: 'M282 286L246 150M282 286L434 188M246 156L420 150M282 286L140 272L246 150',
  tief: 'M282 286L246 150M282 286Q330 234 430 172M270 246Q326 196 424 154M282 286L140 272L246 150',
  mixte: 'M282 286L246 150M282 286L434 188M420 150L250 200L140 272M282 286L140 272'
};
function rahmenSvg(A) {
  return rohr(RAHMEN[A.rahmenform] || RAHMEN.diamant, 7, A.rahmen) + rohr('M420 132L434 190L462 272', 6.5, A.rahmen);
}
function laufradSvg(cx, cy, A) {
  var s = '', f = A.reifen || TU, i;
  if (A.felge === 'scheibe') s += '<circle cx="' + cx + '" cy="' + cy + '" r="79" fill="#efe7da"/><path d="M' + (cx - 46) + ' ' + (cy - 40) + 'A62 62 0 0 1 ' + (cx + 20) + ' ' + (cy - 58) + '" fill="none" stroke="' + PA + '" stroke-width="6" stroke-linecap="round" opacity=".8"/>';
  if (f === TU) s += '<circle cx="' + cx + '" cy="' + cy + '" r="88" fill="none" stroke="' + TU + '" stroke-width="9"/>';
  else s += '<circle cx="' + cx + '" cy="' + cy + '" r="88" fill="none" stroke="' + TU + '" stroke-width="11.5"/><circle cx="' + cx + '" cy="' + cy + '" r="88" fill="none" stroke="' + f + '" stroke-width="6.6"/>';
  if (A.profil === 'stollen') s += '<circle cx="' + cx + '" cy="' + cy + '" r="93.5" fill="none" stroke-width="3.4" stroke-dasharray="0.1 9" stroke-linecap="round" stroke="' + TU + '"/>';
  if (A.profil === 'doppelt') s += '<circle cx="' + cx + '" cy="' + cy + '" r="81" fill="none" stroke-width="1.6" stroke="' + TU + '"/>';
  if (A.profil === 'rillen') s += '<circle cx="' + cx + '" cy="' + cy + '" r="88" fill="none" stroke-width="1.4" stroke-dasharray="5 6" stroke="' + (hell(f) ? TU : PA) + '" opacity=".85"/>';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="79" fill="none" stroke="' + TU + '" stroke-width="2.4"/>';
  if (A.felge !== 'scheibe') {
    var n = A.felge === 'wenige' ? 6 : 16, d = '';
    for (i = 0; i < n; i++) { var a = i / n * Math.PI * 2 + (n === 6 ? .26 : 0); d += 'M' + cx + ' ' + cy + 'L' + (cx + Math.cos(a) * 78).toFixed(1) + ' ' + (cy + Math.sin(a) * 78).toFixed(1); }
    s += '<path d="' + d + '" stroke="' + TU + '" stroke-width="' + (n === 6 ? 2.6 : 1.1) + '" stroke-linecap="round"/>';
  }
  return s + '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="' + PA + '" stroke="' + TU + '" stroke-width="2.4"/>';
}
function ketteSvg(A) {
  var f = A.kette || TU, s = '';
  s += '<path d="M282 260L142 263M282 312L142 281" fill="none" stroke="' + TU + '" stroke-width="' + (f === TU ? 2.4 : 4.2) + '" stroke-linecap="round"/>';
  if (f !== TU) s += '<path d="M282 260L142 263M282 312L142 281" fill="none" stroke="' + f + '" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 2"/>';
  s += '<circle cx="142" cy="272" r="11" fill="none" stroke="' + (f === TU ? TU : f) + '" stroke-width="2.6"/>';
  if (A.kettenschutz === 'mit') {
    var g = A.rahmen && A.rahmen !== TU ? A.rahmen : '#4a443c';
    s += '<path d="M150 253L282 247Q306 250 304 268L298 275L152 271Q136 263 150 253Z" fill="' + g + '" stroke="' + TU + '" stroke-width="2.4" stroke-linejoin="round"/>';
  }
  return s;
}
var SATTEL = {
  schlank: 'M200 112C214 100 248 100 268 108C264 118 236 122 200 112Z',
  gefedert: 'M192 114C196 96 250 96 270 106C270 120 236 126 192 114Z',
  sport: 'M204 109C222 103 254 101 282 108C262 115 228 116 204 109Z'
};
function sattelSvg(A) {
  var s = '<path d="M246 152L238 116" stroke="' + TU + '" stroke-width="5" stroke-linecap="round"/>';
  if (A.sattel === 'gefedert') s += '<path d="M208 118l-6 4 10 3-10 3 10 3M228 119l-6 4 10 3-10 3 10 3" fill="none" stroke="' + TU + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
  return s + '<path d="' + (SATTEL[A.sattel] || SATTEL.schlank) + '" fill="' + (A.sattelfarbe || TU) + '" stroke="' + TU + '" stroke-width="2.4" stroke-linejoin="round"/>';
}
function lenkerSvg(A) {
  var L = lenkerForm(A), b = A.band;
  var s = '<path d="' + L.d + '" fill="none" stroke="' + TU + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
  if (b) s += '<path d="' + L.g + '" fill="none" stroke="' + TU + '" stroke-width="12" stroke-linecap="round"/><path d="' + L.g + '" fill="none" stroke="' + b + '" stroke-width="8" stroke-linecap="round"/>' +
    '<path d="' + L.g + '" fill="none" stroke="' + PA + '" stroke-width="1.6" stroke-dasharray="2 6" opacity=".8"/>';
  else s += '<path d="' + L.g + '" fill="none" stroke="' + TU + '" stroke-width="10" stroke-linecap="round"/>';
  return s;
}
function klingelSvg(A) {
  var k = lenkerForm(A).k, x = k[0], y = k[1], f = A.klingel || '#c9c4ba';
  var sw = ' stroke="' + TU + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
  if (A.klingelform === 'daumen') return '<path d="M' + x + ' ' + (y - 1) + 'v-4"' + sw + '/><circle cx="' + x + '" cy="' + (y - 11) + '" r="7" fill="' + f + '"' + sw + '/><path d="M' + (x + 5) + ' ' + (y - 15) + 'l9 -5" fill="none"' + sw + '/>';
  if (A.klingelform === 'hupe') return '<ellipse cx="' + (x - 12) + '" cy="' + (y - 10) + '" rx="8" ry="7" fill="' + TU + '"/>' +
    '<path d="M' + (x - 5) + ' ' + (y - 13) + 'L' + (x + 13) + ' ' + (y - 19) + 'L' + (x + 15) + ' ' + (y - 3) + 'L' + (x - 5) + ' ' + (y - 7) + 'Z" fill="' + f + '"' + sw + '/>';
  return '<path d="M' + x + ' ' + (y - 1) + 'v-4"' + sw + '/><path d="M' + (x - 10) + ' ' + (y - 5) + 'a10 10 0 0 1 20 0z" fill="' + f + '"' + sw + '/><circle cx="' + x + '" cy="' + (y - 17) + '" r="2.4" fill="' + TU + '"/>';
}
function korbSvg(A) {
  if (A.korb === 'ohne') return '<path d="M436 150L452 156" stroke="' + TU + '" stroke-width="4" stroke-linecap="round"/>';
  var s = '<path d="M436 150L452 156" stroke="' + TU + '" stroke-width="4" stroke-linecap="round"/>', sw = ' stroke="' + TU + '" stroke-width="2.2" stroke-linejoin="round"';
  // was darin liegt, schaut oben heraus
  if (A.korbinhalt === 'buch') s += '<path d="M476 118L482 86L502 90L496 122Z" fill="#2f5f8a"' + sw + '/><path d="M481 92L499 95" stroke="' + PA + '" stroke-width="2"/>';
  if (A.korbinhalt === 'aepfel') [[478, 108, '#b8333a'], [498, 103, '#c9a03a'], [518, 108, '#a4492e']].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" fill="' + p[2] + '"' + sw + '/><path d="M' + p[0] + ' ' + (p[1] - 10) + 'q2 -6 6 -7" fill="none" stroke="' + TU + '" stroke-width="2" stroke-linecap="round"/>'; });
  if (A.korbinhalt === 'blumen') {
    s += '<path d="M486 116L478 82M502 116L504 70M518 116L528 84" fill="none" stroke="#5f7f3e" stroke-width="2.6" stroke-linecap="round"/>';
    [[478, 80, '#b8333a'], [504, 68, '#e2b93b'], [528, 82, '#8db4d6']].forEach(function (p) {
      var b = ''; for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2; b += '<circle cx="' + (p[0] + Math.cos(a) * 6).toFixed(1) + '" cy="' + (p[1] + Math.sin(a) * 6).toFixed(1) + '" r="5" fill="' + p[2] + '" stroke="' + TU + '" stroke-width="1.4"/>'; }
      s += b + '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4" fill="#e2b93b" stroke="' + TU + '" stroke-width="1.4"/>';
    });
  }
  if (A.korb === 'kiste') return s + '<path d="M446 168H558" stroke="' + TU + '" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M454 118H554V166H454Z" fill="#d9b98a" stroke="' + TU + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M454 134H554M454 150H554" stroke="' + TU + '" stroke-width="1.6"/><path d="M494 126h20" stroke="' + TU + '" stroke-width="4" stroke-linecap="round"/>';
  if (A.korb === 'draht') {
    var g = '';
    for (var x = 466; x <= 538; x += 12) g += 'M' + x + ' 112L' + (x - (x - 501) * .12).toFixed(1) + ' 162';
    return s + '<path d="M450 112H552L540 162H462Z" fill="' + PA + '" fill-opacity=".3" stroke="' + TU + '" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="' + g + 'M455 129H547M459 146H543" stroke="' + TU + '" stroke-width="1.1"/>';
  }
  return s + '<path d="M450 112H552L540 162H462Z" fill="' + PA + '" stroke="' + TU + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M455 128H548M458 145H544M476 112L480 162M500 112L501 162M524 112L521 162" stroke="' + TU + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M450 112Q501 104 552 112" fill="none" stroke="' + TU + '" stroke-width="3" stroke-linecap="round"/>';
}
function lichtSvg(A) {
  var sch = A.schein || 'warm', glas = sch === 'aus' ? PA : sch === 'hell' ? '#fff6cc' : '#f6d98a', s = '';
  if (sch !== 'aus') s += '<path d="M496 190L596 156L596 236L496 202Z" fill="' + (sch === 'hell' ? '#fff3c4' : '#f6d98a') + '" opacity="' + (sch === 'hell' ? .7 : .42) + '"/>';
  s += '<path d="M448 196L466 196" stroke="' + TU + '" stroke-width="3.5" stroke-linecap="round"/>';
  var sw = ' stroke="' + TU + '" stroke-width="2.6" stroke-linejoin="round"';
  if (A.licht === 'rund') s += '<circle cx="482" cy="196" r="14" fill="' + glas + '"' + sw + '/><circle cx="482" cy="196" r="8" fill="none" stroke="' + TU + '" stroke-width="1.4"/>';
  else if (A.licht === 'laterne') s += '<path d="M470 184q6-11 12 0" fill="none" stroke="' + TU + '" stroke-width="2.2" stroke-linecap="round"/><path d="M466 184h20l4 6v12l-4 6h-20z" fill="#c9a03a"' + sw + '/><circle cx="478" cy="196" r="6.5" fill="' + glas + '" stroke="' + TU + '" stroke-width="1.6"/>';
  else s += '<path d="M468 182H486Q498 196 486 210H468Z" fill="' + glas + '"' + sw + '/>';
  if (sch !== 'aus') s += '<path d="M504 188l18-6M506 196h20M504 204l18 6" stroke="' + TU + '" stroke-width="2.4" stroke-linecap="round" opacity="' + (sch === 'hell' ? .7 : .45) + '"/>';
  return s;
}
function pedalSvg(x, y, A) {
  var f = A.pedalfarbe || TU, sw = ' stroke="' + TU + '" stroke-width="2.4" stroke-linejoin="round"';
  if (A.pedale === 'breit') {
    var s = '<rect x="' + (x - 19) + '" y="' + (y - 6) + '" width="38" height="12" rx="3" fill="' + f + '"' + sw + '/>';
    [-12, 0, 12].forEach(function (d) { s += '<circle cx="' + (x + d) + '" cy="' + y + '" r="1.6" fill="' + (hell(f) ? TU : PA) + '"/>'; });
    return s;
  }
  if (A.pedale === 'block') return '<rect x="' + (x - 15) + '" y="' + (y - 7) + '" width="30" height="14" rx="2" fill="' + f + '"' + sw + '/><rect x="' + (x + 7) + '" y="' + (y - 4) + '" width="5" height="8" rx="1" fill="#e2a23b"/><rect x="' + (x - 12) + '" y="' + (y - 4) + '" width="5" height="8" rx="1" fill="#e2a23b"/>';
  return rohr('M' + (x - 14) + ' ' + y + 'h28', 7, f);
}
function pedaleSvg(A) {
  return '<g class="c6s-r-kurbel" style="transform-origin:282px 286px"><circle cx="282" cy="286" r="26" fill="' + PA + '" stroke="' + TU + '" stroke-width="3"/><circle cx="282" cy="286" r="5" fill="' + TU + '"/>' +
    '<path d="M282 286L318 324M282 286L246 248" stroke="' + TU + '" stroke-width="5" stroke-linecap="round"/>' + pedalSvg(318, 326, A) + pedalSvg(246, 248, A) + '</g>';
}
function teilSvg(id, A) {
  switch (id) {
    case 'rahmen': return rahmenSvg(A);
    case 'hinterrad': return laufradSvg(140, 272, A);
    case 'vorderrad': return laufradSvg(462, 272, A);
    case 'kette': return ketteSvg(A);
    case 'sattel': return sattelSvg(A);
    case 'lenker': return lenkerSvg(A);
    case 'klingel': return klingelSvg(A);
    case 'korb': return korbSvg(A);
    case 'licht': return lichtSvg(A);
    case 'pedale': return pedaleSvg(A);
  }
  return '';
}
// Reihenfolge von hinten nach vorn
var LAGEN = ['hinterrad', 'vorderrad', 'kette', 'licht', 'rahmen', 'korb', 'sattel', 'lenker', 'klingel', 'pedale'];
function radSvg() {
  var g = '';
  LAGEN.forEach(function (id) {
    var radCls = id === 'hinterrad' ? ' c6s-r-rad c6s-r-hinten' : id === 'vorderrad' ? ' c6s-r-rad c6s-r-vorne' : '';
    var o = id === 'hinterrad' ? ' style="transform-origin:140px 272px"' : id === 'vorderrad' ? ' style="transform-origin:462px 272px"' : '';
    g += '<g class="c6s-r-teil' + radCls + '" data-teil="' + id + '"' + o + '></g>';
  });
  return '<svg class="c6s-r-svg" viewBox="0 0 600 380" role="img" aria-label="Dein Fahrrad">' +
    '<defs><filter id="c6s-r-weich" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>' +
    '<g class="c6s-r-boden"><path d="M-400 362H1000" stroke="' + TU + '" stroke-width="2.4"/>' +
    '<g class="c6s-r-schatten" filter="url(#c6s-r-weich)" opacity=".13"><ellipse class="c6s-r-sch-h" cx="140" cy="364" rx="84" ry="6" fill="' + TU + '"/><ellipse class="c6s-r-sch-v" cx="462" cy="364" rx="84" ry="6" fill="' + TU + '"/><g class="c6s-r-sch-rahmen"></g></g>' +
    '<g class="c6s-r-spur"><path d="M-380 372h26M-300 370h14M-220 373h30M-130 371h18M-40 372h24M50 370h16M130 373h28M220 371h14M300 372h22M390 370h18M470 373h26M560 371h14M640 372h20M720 370h18" stroke="' + TU + '" stroke-width="2" stroke-linecap="round" opacity=".45"/></g></g>' +
    '<g class="c6s-r-ganz">' + g + '<g class="c6s-r-glanz"><path class="c6s-r-glanz-h" d="M96 212A88 88 0 0 1 128 186" style="transform-origin:140px 272px"/><path class="c6s-r-glanz-v" d="M418 212A88 88 0 0 1 450 186" style="transform-origin:462px 272px"/><path d="M262 154L404 150" stroke-width="2.2"/></g><g class="c6s-r-leit"></g></g></svg>';
}
// Bildchen eines Teils in einer Variante (für die Auswahl im Blatt)
function bildchen(teilId, A) {
  var t = NACH[teilId], box = t.box, id = teilId === 'hinterrad' ? 'vorderrad' : teilId, pre = '';
  if (teilId === 'klingel') { var k = lenkerForm(A).k; box = (k[0] - 22) + ' ' + (k[1] - 30) + ' 44 34'; }
  if (teilId === 'lenker') pre = '';
  return '<svg viewBox="' + box + '" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">' + pre + teilSvg(id, A) + '</svg>';
}

var SYMBOL = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M6 16l4-7h6l2 7M10 9l2 7h-6M15 6h3"/></g></svg>';
var FAEHNCHEN = '<svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M3 13V2M3 2.5h8l-2 3 2 3H3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Der Hof hinter dem Rad, in drei Tiefen: fern (Himmel, Hügel, Wolken, Sonne), mitte (Zaun, Wimpel, Vogel), nah (Gras).
// Bleistiftleise, damit das Rad das Bild bleibt.
var BL = '#cfc5b3';
function sonneSvg() {
  return '<svg class="c6s-f-sonne-bild" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<circle class="c6s-f-sonne-hof" cx="60" cy="60" r="56" fill="#f6e6b8" opacity=".35"/>' +
    '<g class="c6s-f-sonne-tag"><circle cx="60" cy="60" r="26" fill="#f6ecd2" stroke="' + BL + '" stroke-width="2"/>' +
    '<path d="M60 20v-6M60 106v-6M20 60h-6M106 60h-6M32 32l-4-4M92 92l-4-4M32 88l-4 4M92 28l-4 4" stroke="' + BL + '" stroke-width="2" stroke-linecap="round"/></g>' +
    '<g class="c6s-f-sonne-nacht"><circle cx="60" cy="60" r="24" fill="#fbf7f0" stroke="' + BL + '" stroke-width="2"/><circle cx="72" cy="52" r="21" fill="var(--papier,#f4eee4)"/></g>' +
    '</svg>';
}
function wolkeSvg(n) {
  return '<svg class="c6s-f-wolke c6s-f-wolke' + n + '" data-tiefe="fern" viewBox="0 0 120 50" aria-hidden="true" focusable="false">' +
    (n === 1
      ? '<path d="M20 40c4-14 24-16 30-6c8-6 26 0 24 12H10c-2-6 4-8 10-6z" fill="#fbf7f0" stroke="' + BL + '" stroke-width="2" stroke-linejoin="round"/>'
      : '<path d="M28 42c2-10 16-14 24-8c4-10 22-12 28-2c10-4 22 2 20 10H18c-2-4 4-6 10 0z" fill="#fbf7f0" stroke="' + BL + '" stroke-width="2" stroke-linejoin="round"/>') +
    '</svg>';
}
function huegelSvg() {
  return '<svg class="c6s-f-huegel" data-tiefe="fern" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
    '<path d="M0 120V70C80 40 160 36 240 58C300 74 360 60 420 44C500 24 560 40 600 64V120Z" fill="#ece3d2" stroke="' + BL + '" stroke-width="2" vector-effect="non-scaling-stroke"/>' +
    '<path d="M0 120V92C120 70 220 78 320 94C420 108 520 92 600 100V120Z" fill="#e4dac6" stroke="' + BL + '" stroke-width="2" vector-effect="non-scaling-stroke"/>' +
    '<path d="M470 68q4-10 8 0M486 60q4-10 8 0M120 64q4-10 8 0" fill="none" stroke="' + BL + '" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
    '</svg>';
}
function wimpelSvg() {
  // zwei kleine Wimpel an den Zaunpfosten, sie flattern im Wind
  return '<svg class="c6s-f-wimpel" data-tiefe="mitte" viewBox="0 0 60 40" aria-hidden="true" focusable="false">' +
    '<path d="M12 40V4M44 40V8" stroke="' + BL + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path class="c6s-f-fahne c6s-f-fahne1" style="transform-origin:12px 6px" d="M12 4L30 8L12 14Z" fill="#c8463d" stroke="' + TU + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path class="c6s-f-fahne c6s-f-fahne2" style="transform-origin:44px 10px" d="M44 8L58 12L44 18Z" fill="#e2b93b" stroke="' + TU + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '</svg>';
}
function vogelSvg() {
  // ein kleiner Vogel, eigener Entwurf: Kieselkörper, Punktauge, Schnabel
  return '<svg class="c6s-f-vogel" data-tiefe="mitte" viewBox="0 0 44 34" aria-hidden="true" focusable="false">' +
    '<g class="c6s-f-vogel-leib"><path d="M8 24C6 14 14 8 24 9C32 10 36 16 34 24C32 30 24 32 16 30C10 29 8 27 8 24Z" fill="#fbf7f0" stroke="' + TU + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M6 26L1 31M8 23L2 24" stroke="' + TU + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M14 18C18 14 26 14 30 18C26 20 18 20 14 18Z" fill="#e4d6bd" stroke="' + TU + '" stroke-width="1.5"/>' +
    '<g class="c6s-f-vogel-kopf" style="transform-origin:30px 12px"><circle cx="31" cy="11" r="7" fill="#fbf7f0" stroke="' + TU + '" stroke-width="2"/><circle cx="33" cy="10" r="1.6" fill="' + TU + '"/><path d="M37 11L43 12L37 14Z" fill="#e2b93b" stroke="' + TU + '" stroke-width="1.4" stroke-linejoin="round"/></g></g>' +
    '<path d="M18 31v3M24 31v3" stroke="' + TU + '" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';
}
function grasSvg() {
  return '<svg class="c6s-f-grasbueschel" data-tiefe="nah" viewBox="0 0 120 40" aria-hidden="true" focusable="false">' +
    '<g class="c6s-f-halme" style="transform-origin:60px 40px" fill="none" stroke="' + BL + '" stroke-width="2.2" stroke-linecap="round">' +
    '<path d="M20 40q-2-14 4-24M28 40q0-12 8-18M64 40q-4-12 0-22M72 40q2-10 10-16M104 40q-4-10-2-20M110 40q0-10 8-14"/></g></svg>';
}
function schluesselSvg() {
  // Carls Maulschlüssel: ein Stiel, ein offenes Maul; liegt neben ihm, wackelt, wenn er schraubt
  return '<svg class="c6s-f-schluessel" viewBox="0 0 80 30" aria-hidden="true" focusable="false">' +
    '<path d="M22 11L72 7Q78 8 78 13Q78 18 72 19L22 19Q17 19 17 15Q17 11 22 11Z" fill="#c9c4ba" stroke="' + TU + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M26 14L68 11" stroke="#fbf7f0" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M22 11C12 2 2 6 2 12L10 12L10 18L2 18C2 24 12 28 22 19Z" fill="#c9c4ba" stroke="' + TU + '" stroke-width="2" stroke-linejoin="round"/>' +
    '</svg>';
}
function tageszeit(h) {
  h = h == null ? new Date().getHours() : h;
  if (h >= 5 && h < 11) return 'morgen';
  if (h >= 11 && h < 16) return 'mittag';
  if (h >= 16 && h < 21) return 'abend';
  return 'nacht';
}

C6.raum({
  id: 'fahrrad', name: 'Fahrrad', reihe: 3, symbol: SYMBOL,
  bauen: function (buehne) {
    buehne.classList.add('c6s-fahrrad');
    buehne.innerHTML =
      '<div class="c6s-f-innen">' +
      '  <div class="c6s-f-szene">' +
      '    <div class="c6s-f-hof" aria-hidden="true"><i class="c6s-f-himmel" data-tiefe="fern"></i><i class="c6s-f-waerme"></i>' + huegelSvg() + wolkeSvg(1) + wolkeSvg(2) +
      '      <div class="c6s-f-sonne" data-tiefe="fern" data-c6-sonne>' + sonneSvg() + '</div>' +
      '      <i class="c6s-f-zaun" data-tiefe="nah"></i>' + wimpelSvg() + vogelSvg() + grasSvg() + '<i class="c6s-f-gras" data-tiefe="nah"></i></div>' +
      '    <div class="c6s-f-rad" data-tiefe="mitte">' + radSvg() + '<div class="c6s-f-punkte" role="group" aria-label="Die Teile deines Rads"></div></div>' +
      schluesselSvg() +
      '    <div class="c6s-f-carl"></div>' +
      '  </div>' +
      '  <div class="c6s-f-blatt" role="dialog" aria-modal="false" hidden data-c6-kein-wisch></div>' +
      '  <button type="button" class="c6s-f-bmx"><span class="c6s-f-bmx-bild" aria-hidden="true"></span><span class="c6s-f-bmx-text"><b>Während ich arbeite, fährst du.</b><span>Kieselpark</span></span></button>' +
      '</div>';
    var innen = buehne.querySelector('.c6s-f-innen');
    // Unten liegen Dock, Leiste und, wenn Carl fragt, die Antwort-Chips. Knopf und Blatt bleiben immer darüber.
    function untenMessen() {
      var c6 = document.getElementById('c6'); if (!c6) return;
      var b = buehne.getBoundingClientRect(), oben = Infinity;
      ['.c6k-chips', '.c6k-dock', '.c6k-leiste'].forEach(function (sel) {
        var el = c6.querySelector(sel); if (!el) return;
        if (sel === '.c6k-chips' && !c6.hasAttribute('data-chips')) return;
        var cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
        var r = el.getBoundingClientRect(); if (r.height) oben = Math.min(oben, r.top);
      });
      if (oben === Infinity || !b.height) return;
      buehne.style.setProperty('--c6s-unten', Math.round(Math.max(0, b.bottom - oben) + 16) + 'px');
    }
    try {
      var c6El = document.getElementById('c6');
      if (c6El && 'MutationObserver' in window) new MutationObserver(function () { requestAnimationFrame(untenMessen); }).observe(c6El, { attributes: true, attributeFilter: ['data-chips', 'data-dock-zu', 'data-ohne-dock', 'data-ohne-leiste-raum'] });
    } catch (e) {}
    var szene = buehne.querySelector('.c6s-f-szene'), radBox = buehne.querySelector('.c6s-f-rad'), svg = radBox.querySelector('svg');
    var carlBox = buehne.querySelector('.c6s-f-carl'), punkteBox = buehne.querySelector('.c6s-f-punkte');
    var blatt = buehne.querySelector('.c6s-f-blatt'), bmxKnopf = buehne.querySelector('.c6s-f-bmx');
    var leitG = svg.querySelector('.c6s-r-leit');
    var ctl = null, faehrt = false, aktiv = null, warZehn = alleGebunden(), sitzt = false;
    var gTeil = {}; Array.prototype.forEach.call(svg.querySelectorAll('.c6s-r-teil'), function (g) { gTeil[g.dataset.teil] = g; });

    // kleines BMX-Bild im Knopf
    (function () {
      var c = document.createElement('canvas'), d = Math.min(3, window.devicePixelRatio || 1);
      c.width = 64 * d; c.height = 44 * d; c.style.width = '64px'; c.style.height = '44px';
      buehne.querySelector('.c6s-f-bmx-bild').appendChild(c);
      function mal() {
        try {
          var x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
          x.setTransform(d * 0.98, 0, 0, -d * 0.98, d * 32, d * 41);
          C6.kieselpark.zeichneRad(x, { tinte: '#fbf7f0', papier: '#2b2722', aus: C6.kieselpark.ausstattung(), rad: .4, kurbel: .9, lw: .75 });
        } catch (e) {}
      }
      mal(); if (C6.bus) C6.bus.on('rad', mal);
    })();
    bmxKnopf.onclick = function () {
      if (!C6.ruhig) { try { bmxKnopf.animate([{ transform: 'scale(1)' }, { transform: 'scale(.955)', offset: .3 }, { transform: 'scale(1.025)', offset: .65 }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
      setTimeout(function () { if (C6.kieselpark) C6.kieselpark.auf(); }, C6.ruhig ? 0 : 140);
    };

    // ---------- Zeichnen ----------
    var probe = null; // {art, id}: Vorschau am Rad, noch nicht gewählt
    function ausMitProbe() { var a = aus(); if (probe) { var k = katalog()[probe.art]; if (k) { var t = null; k.teile.forEach(function (x) { if (x.id === probe.id) t = x; }); if (t) a[probe.art] = k.was === 'farbe' ? (t.farbe === undefined ? null : t.farbe) : t.id; } } return a; }
    var gSchRahmen = svg.querySelector('.c6s-r-sch-rahmen');
    function zeichneAlles() {
      var A = ausMitProbe();
      LAGEN.forEach(function (id) { gTeil[id].innerHTML = teilSvg(id, A); });
      // Schatten des Rahmens: dieselben Rohre, flach auf den Boden gelegt
      gSchRahmen.innerHTML = '<path d="' + (RAHMEN[A.rahmenform] || RAHMEN.diamant) + 'M420 132L434 190L462 272" fill="none" stroke="' + TU + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="140" cy="272" r="88" fill="none" stroke="' + TU + '" stroke-width="10"/><circle cx="462" cy="272" r="88" fill="none" stroke="' + TU + '" stroke-width="10"/>';
      setzePunkte(A);
      licht();
    }

    // ---------- Licht: die Sonne nach Tageszeit, Schatten laufen vom Licht weg ----------
    var sonneEl = buehne.querySelector('.c6s-f-sonne'), letzteZeit = null;
    function licht(zeit) {
      zeit = zeit || tageszeit();
      var pc = C6.geraet === 'computer';
      var ys = pc ? 0 : .2; // am iPhone liegt die Blase oben: die Sonne steht darunter, über den Hügeln
      var Q = { morgen: { x: .2, y: .1 + ys, warm: .75, staerke: .7, hoehe: .4 }, mittag: { x: .5, y: .05 + ys, warm: .5, staerke: .85, hoehe: .9 }, abend: { x: pc ? .8 : .62, y: .12 + ys, warm: .95, staerke: .7, hoehe: .35 }, nacht: { x: pc ? .72 : .58, y: .1 + ys, warm: .15, staerke: .45, hoehe: .6 } }[zeit];
      var q = { x: Q.x, y: Q.y, art: zeit === 'nacht' ? 'mond' : 'sonne', warm: Q.warm, staerke: Q.staerke, hoehe: Q.hoehe };
      if (zeit !== letzteZeit) {
        letzteZeit = zeit;
        buehne.setAttribute('data-zeit', zeit);
        try { C6.lichtquelle && C6.lichtquelle.setze('fahrrad', q); } catch (e) {}
        buehne.style.setProperty('--c6s-sonne-x', (q.x * 100).toFixed(1) + '%');
        buehne.style.setProperty('--c6s-sonne-y', (q.y * 100).toFixed(1) + '%');
      }
      // Bodenschatten im Rad-SVG: Ellipsen unter den Rädern, Rahmen flach vom Licht weg
      var s = (q.x - .5) * 1.1, len = .16 * (1 - q.hoehe) + .06;
      var dx = -(q.x - .5) * 46;
      [['.c6s-r-sch-h', 140], ['.c6s-r-sch-v', 462]].forEach(function (p) { var e = svg.querySelector(p[0]); e.setAttribute('cx', (p[1] + dx).toFixed(1)); e.setAttribute('rx', (84 + 30 * (1 - q.hoehe)).toFixed(1)); });
      gSchRahmen.setAttribute('transform', 'matrix(1 0 ' + s.toFixed(3) + ' ' + (-len).toFixed(3) + ' ' + (-362 * s).toFixed(1) + ' ' + (362 * (1 + len)).toFixed(1) + ')');
      svg.querySelector('.c6s-r-schatten').setAttribute('opacity', (0.06 + 0.12 * q.staerke).toFixed(2));
      // Lichtreflex an den Felgen: zur Sonne hin gedreht
      var a = ((q.x - .5) * 110).toFixed(1);
      Array.prototype.forEach.call(svg.querySelectorAll('.c6s-r-glanz-h,.c6s-r-glanz-v'), function (e) { e.style.transform = 'rotate(' + a + 'deg)'; });
    }
    C6.fahrradZeit = function (h) { licht(h == null ? null : tageszeit(h)); };

    // ---------- Tipp-Punkte am Rad ----------
    var punkte = {};
    TEILE.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'c6s-f-pkt'; b.dataset.teil = t.id;
      b.innerHTML = '<span class="c6s-f-pkt-kern" aria-hidden="true"></span><span class="c6s-f-pkt-name" aria-hidden="true">' + t.name + '</span>';
      b.onclick = function (e) { e.stopPropagation(); oeffne(t.id); };
      b.onmouseenter = function () { if (!aktiv) markiere(t.id); };
      b.onmouseleave = function () { if (!aktiv) markiere(null); };
      b.onfocus = function () { var fv = false; try { fv = b.matches(':focus-visible'); } catch (e) {} if (!aktiv && fv) markiere(t.id); };
      b.onblur = function () { if (!aktiv) markiere(null); };
      punkteBox.appendChild(b); punkte[t.id] = b;
    });
    function setzePunkte(A) {
      var neu = []; try { neu = C6.kieselpark ? C6.kieselpark.neu() : []; } catch (e) {}
      TEILE.forEach(function (t) {
        var p = punktVon(t.id, A), b = punkte[t.id], f = faden(t.id);
        b.style.left = (p[0] / 600 * 100) + '%'; b.style.top = (p[1] / 380 * 100) + '%';
        b.classList.toggle('c6s-gebunden', !!f);
        b.style.setProperty('--c6s-faden', f ? (f.farbe || '#2f5f8a') : '');
        var hatNeu = neu.some(function (l) { var art = l.split(':')[0]; return t.reihen.indexOf(art) >= 0; });
        b.classList.toggle('c6s-neu', hatNeu);
        b.setAttribute('aria-label', t.name + (f ? ', dein Space „' + f.titel + '“' : '') + (hatNeu ? ', etwas Neues aus dem Kieselpark' : '') + '. Ändern');
      });
      // Die Klingel ist klein; ihr Punkt sitzt etwas darüber und zeigt mit einem Bleistiftstrich auf sie
      var k = lenkerForm(A).k, pk = punktVon('klingel', A);
      leitG.innerHTML = '<path d="M' + (pk[0] - 6) + ' ' + (pk[1] + 7) + 'L' + (k[0] + 9) + ' ' + (k[1] - 13) + '" stroke="#a39b8e" stroke-width="1.4" stroke-linecap="round"/>';
    }

    // Antippen am Bild (nicht auf einem Punkt): das nächste Teil
    function svgPunkt(e) {
      var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      var m = svg.querySelector('.c6s-r-ganz').getScreenCTM(); if (!m) return null;
      return p.matrixTransform(m.inverse());
    }
    function naechstes(p) {
      var A = aus(), best = null, bd = 1e9;
      TEILE.forEach(function (t) { var q = punktVon(t.id, A), dx = q[0] - p.x, dy = q[1] - p.y, d = dx * dx + dy * dy; if (t.id === 'hinterrad' || t.id === 'vorderrad') { dx = (t.id === 'hinterrad' ? 140 : 462) - p.x; dy = 272 - p.y; d = Math.max(0, Math.sqrt(dx * dx + dy * dy) - 60); d *= d; } if (d < bd) { bd = d; best = t; } });
      return bd < 115 * 115 ? best : null;
    }
    function drehAn() {
      if (C6.ruhig || faehrt) return;
      try {
        Array.prototype.forEach.call(svg.querySelectorAll('.c6s-r-rad'), function (g) { g.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(300deg)' }], { duration: 2000, easing: 'cubic-bezier(.15,.65,.25,1)' }); });
        var k = svg.querySelector('.c6s-r-kurbel'); if (k) k.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(170deg)' }], { duration: 2000, easing: 'cubic-bezier(.15,.65,.25,1)' });
        var sp = svg.querySelector('.c6s-r-spur'); if (sp) sp.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-40px)' }], { duration: 2000, easing: 'cubic-bezier(.15,.65,.25,1)' });
      } catch (e) {}
    }
    var wachT = null;
    function wach(an) {
      buehne.classList.toggle('c6s-wach', !!an);
      if (wachT) { clearTimeout(wachT); wachT = null; }
      if (an) wachT = setTimeout(function () { buehne.classList.remove('c6s-wach'); wachT = null; }, 5000);
    }
    radBox.addEventListener('click', function (e) {
      wach(true);
      if (e.target.closest('.c6s-f-pkt')) return;
      drehAn();
      var p = svgPunkt(e); if (!p) return;
      var t = naechstes(p); if (t) oeffne(t.id);
    });
    radBox.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || aktiv || e.target.closest('.c6s-f-pkt')) return;
      var p = svgPunkt(e); if (!p) return;
      var t = naechstes(p); markiere(t ? t.id : null);
    });
    radBox.addEventListener('pointerleave', function () { if (!aktiv) markiere(null); });

    function markiere(id) {
      var rad2 = id === 'hinterrad' || id === 'vorderrad';
      LAGEN.forEach(function (k) { gTeil[k].classList.toggle('c6s-hell', k === id || (rad2 && (k === 'hinterrad' || k === 'vorderrad'))); });
      svg.classList.toggle('c6s-r-fokus', !!id);
      Object.keys(punkte).forEach(function (k) { punkte[k].classList.toggle('c6s-hell', k === id); });
    }

    // ---------- Das Blatt am Teil ----------
    function spaces() {
      var l = [];
      try { if (C6.space && C6.space.alle) l = (C6.space.alle() || []).map(function (s) { return { id: s.stringId, titel: s.titel, farbe: s.farbe }; }); } catch (e) {}
      if (!l.length) { try { l = ((C6.strings && C6.strings.alle()) || []).map(function (s) { return { id: s.id, titel: s.titel, farbe: s.farbe }; }); } catch (e) {} }
      return l.filter(function (s) { return s.id && s.titel; });
    }
    function oeffneSpace(sid) {
      schliesse(true);
      try { if (C6.space && C6.space.oeffne) { C6.space.oeffne(sid); return; } } catch (e) {}
      try { C6.strings && C6.strings.zeig && C6.strings.zeig(sid); } catch (e) {}
    }
    function neuerSpace(teilId) {
      var t = NACH[teilId];
      schliesse(true);
      Promise.resolve(C6.frag(satz('fahrrad.spaceName', 'Wie soll der Space ' + t.am + ' heißen?'), [], { frei: true, id: 'rad-' + teilId })).then(function (w) {
        w = typeof w === 'string' ? w.trim() : '';
        if (!w) return;
        var sid = null;
        try { if (C6.space && C6.space.neu) sid = C6.space.neu(w); } catch (e) {}
        if (sid && typeof sid === 'object') sid = sid.id || sid.stringId;
        if (!sid && C6.strings) { var n = C6.strings.neu({ titel: w, art: 'projekt' }); sid = n && n.id; if (sid) setTimeout(function () { try { C6.strings.zeig && C6.strings.zeig(sid); } catch (e) {} }, 300); }
        if (sid) binde(teilId, sid);
      });
    }

    function opt(t, art, A, k) {
      var h = C6.kieselpark.herkunft(art, t.id), hat = C6.kieselpark.besitzt(art, t.id);
      var Av = {}; for (var x in A) Av[x] = A[x];
      Av[art] = k.was === 'farbe' ? (t.farbe === undefined ? null : t.farbe) : t.id;
      var inhalt = k.was === 'farbe'
        ? '<span class="c6s-f-farbe" style="background:' + (t.farbe || TU) + '"></span>'
        : (art === 'korb' && t.id === 'ohne') ? '<span class="c6s-f-wort">ohne</span>'
        : '<span class="c6s-f-bild">' + bildchen(aktiv, Av) + '</span>';
      var marke = '';
      if (!hat && h.preis) marke = '<span class="c6s-f-marke">' + (C6.muenzen ? C6.muenzen.muenze(14) : '') + h.preis + '</span>';
      else if (!hat) marke = '<span class="c6s-f-marke c6s-f-park">' + FAEHNCHEN + '</span>';
      var neu = false; try { neu = C6.kieselpark.neu().indexOf(art + ':' + t.id) >= 0; } catch (e) {}
      if (neu) marke = '<span class="c6s-f-marke c6s-f-neu">neu</span>';
      var lbl = t.name + (!hat && h.preis ? ', ' + h.preis + ' Münzen' : !hat ? ', im Kieselpark zu gewinnen' : '') + (neu ? ', neu' : '');
      return '<button type="button" class="c6s-f-opt' + (hat ? '' : ' c6s-zu') + '" data-art="' + art + '" data-id="' + t.id + '" aria-label="' + esc(lbl) + '" title="' + esc(t.name) + '">' + inhalt + marke + '</button>';
    }
    function gewaehlt(art) {
      var w = C6.kieselpark.wahl(art), k = katalog()[art];
      if (art === 'rahmenfarbe' && !w) { var f = aus().rahmen, m = null; k.teile.forEach(function (t) { if (!m && t.farbe === f) m = t.id; }); return m; }
      return w || (k && k.teile[0].id);
    }
    function malBlatt() {
      var t = NACH[aktiv]; if (!t) return;
      var A = aus(), f = faden(aktiv), K = katalog();
      var h = '<div class="c6s-f-bkopf"><h3 class="c6s-f-btitel">' + t.name + '</h3><button type="button" class="c6s-f-zu" aria-label="Schließen"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>';
      // Dein Space hier
      h += '<section class="c6s-f-space" aria-label="Dein Space hier"><span class="c6s-f-klein">Dein Space hier</span>';
      if (f) {
        h += '<div class="c6s-f-sp"><i style="background:' + (f.farbe || '#2f5f8a') + '"></i><b>' + esc(kurz(f.titel, 44)) + '</b></div>' +
          '<div class="c6s-f-sp-tun"><button type="button" class="c6s-knopf c6s-f-handeln" data-tun="auf">Space öffnen</button><button type="button" class="c6s-knopf c6s-leise" data-tun="los">Lösen</button></div>';
      } else {
        var frei = {}; TEILE.forEach(function (x) { var id = rad().teile[x.id]; if (id) frei[id] = true; });
        var l = spaces().filter(function (s) { return !frei[s.id]; }).slice(-3).reverse();
        h += '<p class="c6s-f-leer">Hier hängt noch nichts.</p><div class="c6s-f-sp-tun"><button type="button" class="c6s-knopf c6s-f-handeln" data-tun="neu">Neuer Space</button>' +
          l.map(function (s) { return '<button type="button" class="c6s-f-binden" data-tun="binde" data-sid="' + esc(s.id) + '"><i style="background:' + (s.farbe || '#2f5f8a') + '"></i>' + esc(kurz(s.titel, 22)) + '</button>'; }).join('') + '</div>';
      }
      h += '</section>';
      // Das Teil selbst
      t.reihen.forEach(function (art) {
        var k = K[art]; if (!k) return;
        var w = gewaehlt(art), wn = ''; k.teile.forEach(function (x) { if (x.id === w) wn = x.name; });
        h += '<div class="c6s-f-reihe" data-art="' + art + '"><span class="c6s-f-klein">' + k.titel + ' · <span class="c6s-f-wahl">' + esc(wn) + '</span></span><div class="c6s-f-opts" role="group" aria-label="' + esc(k.titel) + '">' +
          k.teile.map(function (x) { return opt(x, art, A, k); }).join('') + '</div></div>';
      });
      h += '<div class="c6s-f-hinweis" aria-live="polite" hidden></div>';
      blatt.innerHTML = h;
      blatt.setAttribute('aria-label', t.name);
      markiereWahl();
      blatt.querySelector('.c6s-f-zu').onclick = function () { schliesse(); };
      Array.prototype.forEach.call(blatt.querySelectorAll('[data-tun]'), function (b) {
        b.onclick = function () {
          var tun = b.dataset.tun, id = aktiv;
          if (tun === 'auf' && f) oeffneSpace(f.id);
          if (tun === 'los') { loese(id); malBlatt(); }
          if (tun === 'neu') neuerSpace(id);
          if (tun === 'binde') { binde(id, b.dataset.sid); malBlatt(); }
        };
      });
      Array.prototype.forEach.call(blatt.querySelectorAll('.c6s-f-opt'), function (b) { b.onclick = function () { waehle(b.dataset.art, b.dataset.id, b); }; });
    }
    function malBlattStill() { var sc = blatt.scrollTop; malBlatt(); blatt.scrollTop = sc; }
    function markiereWahl() {
      Array.prototype.forEach.call(blatt.querySelectorAll('.c6s-f-reihe'), function (r) {
        var art = r.dataset.art, w = gewaehlt(art), K = katalog()[art];
        Array.prototype.forEach.call(r.querySelectorAll('.c6s-f-opt'), function (b) {
          var an = b.dataset.id === w, pr = !!probe && probe.art === art && probe.id === b.dataset.id;
          b.classList.toggle('c6s-an', an && !(probe && probe.art === art)); b.classList.toggle('c6s-probe', pr);
          b.setAttribute('aria-pressed', an);
        });
        var name = ''; var zeig = probe && probe.art === art ? probe.id : w; K.teile.forEach(function (x) { if (x.id === zeig) name = x.name; });
        r.querySelector('.c6s-f-wahl').textContent = name;
      });
    }
    function hinweis(html, knopf) {
      var el = blatt.querySelector('.c6s-f-hinweis'); if (!el) return;
      if (!html) { el.hidden = true; el.innerHTML = ''; return; }
      el.innerHTML = '<span>' + html + '</span>' + (knopf || '');
      el.hidden = false;
      var b = el.querySelector('button'); if (b) b.onclick = knopfTun;
      try { el.scrollIntoView({ block: 'nearest', behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) {}
    }
    function knopfTun(e) {
      var b = e.currentTarget, art = b.dataset.art, id = b.dataset.id;
      if (b.dataset.tun === 'kaufen') {
        if (C6.kieselpark.kaufe(art, id)) { probe = null; nachWahl(art); malBlattStill(); hinweis(esc(satz('fahrrad.gekauft', 'Gehört jetzt dir.'))); }
        else hinweis('Dafür reichen die Münzen noch nicht. Im Kieselpark liegen welche.');
      }
      if (b.dataset.tun === 'park') { var park = b.dataset.park; schliesse(); if (C6.kieselpark) C6.kieselpark.auf(park ? { park: park } : {}); }
    }
    function waehle(art, id, knopf) {
      var K = katalog()[art], t = null; K.teile.forEach(function (x) { if (x.id === id) t = x; });
      if (!t) return;
      if (C6.kieselpark.besitzt(art, id)) {
        probe = null;
        C6.kieselpark.waehle(art, id);
        nachWahl(art);
        hinweis(null);
        return;
      }
      // Noch nicht deins: am Rad zeigen, sagen, wo es das gibt
      probe = { art: art, id: id };
      zeichneAlles(); huepf(); markiereWahl();
      var h = C6.kieselpark.herkunft(art, id);
      if (h.preis) {
        hinweis('<b>' + esc(t.name) + '</b> kostet ' + h.preis + ' Münzen.', '<button type="button" class="c6s-knopf c6s-f-handeln" data-tun="kaufen" data-art="' + art + '" data-id="' + id + '">Kaufen · ' + (C6.muenzen ? C6.muenzen.muenze(18, 'c6s-hell') : '') + h.preis + '</button>');
      } else if (h.park) {
        hinweis('<b>' + esc(t.name) + '</b> gewinnst du im Kieselpark: ' + esc(h.parkName) + ' · ' + esc(h.text) + '.', '<button type="button" class="c6s-knopf c6s-leise" data-tun="park" data-park="' + h.park + '">Hinfahren</button>');
      }
    }
    function nachWahl(art) {
      zeichneAlles(); huepf(); markiereWahl();
      // die Bildchen der anderen Reihen zeigen jetzt die neue Wahl mit
      Array.prototype.forEach.call(blatt.querySelectorAll('.c6s-f-reihe'), function (r) {
        if (r.dataset.art === art) return;
        var A = aus(), K = katalog()[r.dataset.art];
        Array.prototype.forEach.call(r.querySelectorAll('.c6s-f-opt'), function (b) {
          var x = null; K.teile.forEach(function (q) { if (q.id === b.dataset.id) x = q; });
          var bild = b.querySelector('.c6s-f-bild'); if (!bild || !x) return;
          var Av = {}; for (var k in A) Av[k] = A[k]; Av[r.dataset.art] = x.id;
          bild.innerHTML = bildchen(aktiv, Av);
        });
      });
      Array.prototype.forEach.call(blatt.querySelectorAll('.c6s-f-neu'), function (m) { if (m.parentNode.dataset.art === art) m.remove(); });
      try { ctl && ctl.stimmung && ctl.stimmung('froh'); setTimeout(function () { try { ctl && ctl.stimmung('ruhig'); } catch (e) {} }, 1200); } catch (e) {}
    }
    function huepf() {
      if (C6.ruhig || !aktiv) return;
      var ids = aktiv === 'hinterrad' || aktiv === 'vorderrad' ? ['hinterrad', 'vorderrad'] : [aktiv];
      ids.forEach(function (id) { var g = gTeil[id]; try { g.firstChild && g.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)', offset: .4 }, { transform: 'translateY(0)' }], { duration: 360, easing: 'cubic-bezier(.3,.7,.3,1)', composite: 'add' }); } catch (e) {} });
    }

    var perTaste = false;
    document.addEventListener('keydown', function () { perTaste = true; }, true);
    document.addEventListener('pointerdown', function () { perTaste = false; }, true);
    function oeffne(teilId) {
      if (C6.rundgang && C6.rundgang.an) return;
      var war = aktiv;
      if (probe) { probe = null; zeichneAlles(); }
      aktiv = teilId; markiere(teilId);
      if (!war) { try { C6.schweig && C6.schweig(); } catch (e) {} }
      malBlatt();
      buehne.classList.add('c6s-blatt-auf');
      blatt.hidden = false;
      groesse(); if (C6.geraet !== 'computer') lege();
      if (!war) { try { blatt.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: C6.ruhig ? 0 : 260, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
      try { ctl && ctl.schau && zeigeBlick(teilId); } catch (e) {}
      // was neu aus dem Kieselpark kam, ist jetzt gesehen
      var neu = []; try { neu = C6.kieselpark.neu().filter(function (l) { return NACH[teilId].reihen.indexOf(l.split(':')[0]) >= 0; }); } catch (e) {}
      if (neu.length) setTimeout(function () { try { C6.kieselpark.gesehen(neu); setzePunkte(aus()); } catch (e) {} }, 600);
      if (perTaste) setTimeout(function () { var z = blatt.querySelector('.c6s-f-zu'); try { z && z.focus({ preventScroll: true }); } catch (e) {} }, 30);
    }
    function schliesse(still, taste) {
      if (!aktiv) return;
      var id = aktiv;
      aktiv = null; probe = null;
      zeichneAlles(); markiere(null);
      blatt.hidden = true; blatt.innerHTML = '';
      buehne.classList.remove('c6s-blatt-auf');
      blatt.style.left = blatt.style.top = '';
      groesse();
      if (!still && taste) { try { punkte[id] && punkte[id].focus({ preventScroll: true }); } catch (e) {} }
    }
    // Computer: das Blatt schwebt neben dem Teil. iPhone: es liegt unter dem Rad, das Rad rückt nach oben.
    function lege() {
      blatt.style.left = blatt.style.top = '';
      if (true) return;
      requestAnimationFrame(function () {
        if (!aktiv) return;
        var p = punktVon(aktiv, aus()), ir = innen.getBoundingClientRect(), sr = szene.getBoundingClientRect(), rr = svg.getBoundingClientRect();
        var x = rr.left - ir.left + p[0] / 600 * rr.width, y = rr.top - ir.top + p[1] / 380 * rr.height;
        var x0 = sr.left - ir.left, y0 = sr.top - ir.top, x1 = x0 + sr.width, y1 = y0 + sr.height;
        var w = blatt.offsetWidth, hh = blatt.offsetHeight, l = x + 44;
        if (l + w > x1 - 8) l = x - 44 - w;
        l = Math.max(x0 + 8, Math.min(x1 - w - 8, l));
        var t = Math.max(y0 + 8, Math.min(y1 - hh - 8, y - hh * 0.35));
        blatt.style.left = Math.round(l) + 'px'; blatt.style.top = Math.round(t) + 'px';
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !aktiv || C6.jetzt !== 'fahrrad') return;
      if (C6.kieselpark && C6.kieselpark.offen) return;
      e.preventDefault(); e.stopPropagation(); schliesse(false, true);
    }, true);
    // Tipp daneben schließt das Blatt (nicht auf Rad, Punkte, Blatt)
    szene.addEventListener('click', function (e) { if (aktiv && !e.target.closest('.c6s-f-rad,.c6s-f-blatt,.c6s-f-carl,.c6s-f-fund')) schliesse(); });

    function binde(teilId, stringId) {
      aendern(function (s) { rad(); s.rad.teile[teilId] = stringId; });
      zeichneAlles();
      emit('rad', { was: 'faden', teil: teilId, id: stringId });
      pruefeZehn();
      if (!C6.ruhig && punkte[teilId]) { try { punkte[teilId].animate([{ transform: 'translate(-50%,-50%) scale(.4)' }, { transform: 'translate(-50%,-50%) scale(1.25)', offset: .6 }, { transform: 'translate(-50%,-50%) scale(1)' }], { duration: 520, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
    }
    function loese(teilId) {
      aendern(function (s) { rad(); delete s.rad.teile[teilId]; });
      zeichneAlles();
      emit('rad', { was: 'los', teil: teilId });
      pruefeZehn();
    }
    function zeigeBlick(teilId) {
      var r = svg.getBoundingClientRect(), p = punktVon(teilId, aus());
      ctl.schau(r.left + p[0] / 600 * r.width, r.top + p[1] / 380 * r.height);
      setTimeout(function () { try { ctl.schau(); } catch (e) {} }, 1600);
    }

    // ---------- Carl ----------
    function figur() {
      if (ctl || !C6.figur) return;
      ctl = C6.figur.male(carlBox, { groesse: 200 });
      try { ctl.kleid(C6.laden ? C6.laden.an() : {}); } catch (e) {}
      if (C6.geheim) C6.geheim.alles(ctl);
      if (ctl.gewohnheiten) { try { ctl.gewohnheiten(['schrauben', 'umsehen']); } catch (e) {} }
      groesse();
    }
    // Wartezeit: ein Vogel landet auf dem Zaun, Carl schraubt ein bisschen, der Schlüssel wackelt
    var vogel = buehne.querySelector('.c6s-f-vogel'), schluessel = buehne.querySelector('.c6s-f-schluessel'), vogelDa = false, schraubt = false;
    function vogelLandet() {
      if (vogelDa) return; vogelDa = true;
      vogel.classList.add('c6s-da');
      if (!C6.ruhig) {
        try { vogel.animate([{ transform: 'translate(-140px,-110px) rotate(-10deg)', opacity: 0 }, { transform: 'translate(-70px,-50px) rotate(-6deg)', opacity: 1, offset: .45 }, { transform: 'translate(-14px,-10px) rotate(2deg)', offset: .85 }, { transform: 'translate(0,0) rotate(0)', opacity: 1 }], { duration: 1500, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
      }
      if (ctl && ctl.schau) { var r = vogel.getBoundingClientRect(); setTimeout(function () { try { ctl.schau(r.left + r.width / 2, r.top + r.height / 2); setTimeout(function () { try { ctl.schau(); } catch (e) {} }, 2200); } catch (e) {} }, 1200); }
    }
    function vogelWeg() {
      if (!vogelDa) return; vogelDa = false;
      if (C6.ruhig) { vogel.classList.remove('c6s-da'); return; }
      try { var a = vogel.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(90px,-120px) rotate(8deg)', opacity: 0 }], { duration: 800, easing: 'cubic-bezier(.4,0,.6,1)' }); a.onfinish = function () { vogel.classList.remove('c6s-da'); }; } catch (e) { vogel.classList.remove('c6s-da'); }
    }
    function schraubenAn() {
      if (schraubt || !ctl || aktiv || sitzt) return; schraubt = true;
      if (!ctl.gewohnheiten) { try { ctl.stimmung('arbeitet'); zeigeBlick('kette'); } catch (e) {} }
      if (!C6.ruhig) { try { schluessel.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-9deg)', offset: .2 }, { transform: 'rotate(7deg)', offset: .45 }, { transform: 'rotate(-4deg)', offset: .7 }, { transform: 'rotate(0)' }], { duration: 1300, easing: 'ease-in-out', delay: 400 }); } catch (e) {} }
    }
    function schraubenAus() {
      if (!schraubt) return; schraubt = false;
      if (ctl && !ctl.gewohnheiten) { try { ctl.stimmung('ruhig'); } catch (e) {} }
    }
    function groesse() {
      var h = szene.clientHeight, w = szene.clientWidth;
      if (!h || !w) return;
      var pc = C6.geraet === 'computer';
      // Rad: am iPhone so breit es geht (Tipp-Punkte ≥ 44 px auseinander), immer ganz im Bild
      var frei = h - (pc ? 16 : 30), bw = pc ? Math.min(w * 0.64, frei * 600 / 380) : Math.min(w * 0.96, frei * 600 / 380);
      radBox.style.width = Math.round(Math.max(200, bw)) + 'px';
      if (!ctl) return;
      if (pc) {
        ctl.groesse(Math.round(Math.max(140, Math.min(h * 0.62, 400))));
        carlBox.style.bottom = '';
      } else {
        // Carl steht hinten im Hof, über dem Rad; seine Füße auf dem Zaun-Weg
        var radH = bw * 380 / 600, platz = h - radH - 24;
        var px = Math.max(110, Math.min(platz * 0.92, 190));
        ctl.groesse(Math.round(px));
        carlBox.style.bottom = Math.round(Math.max(0, radH - 28)) + 'px';
        szene.style.setProperty('--c6s-zaun', Math.round(radH + 10) + 'px');
      }
      if (sitzt) setzeAufsRad(0);
    }

    // Bei 10 von 10 fährt Carl
    function pruefeZehn() {
      var zehn = alleGebunden();
      if (zehn && !warZehn) setTimeout(function () { try { C6.sag('Alle zehn. Halt dich fest.'); } catch (e) {} }, 300);
      warZehn = zehn;
      fahren(zehn);
    }
    function setzeAufsRad(ms) {
      if (!ctl) return;
      var r = svg.getBoundingClientRect(), c = ctl.el.getBoundingClientRect();
      if (!r.width || !c.width) return;
      var sk = Math.min(1, (r.width * 0.3) / (c.width / (ctl.skala || 1)));
      var zielX = r.left + 236 / 600 * r.width, zielUnten = r.top + 158 / 380 * r.height;
      var jetztX = c.left + c.width / 2 - (ctl.x || 0), jetztUnten = c.bottom - (ctl.y || 0) * 1;
      var h0 = c.height / (ctl.skala || 1);
      var dx = zielX - jetztX, dy = zielUnten - (jetztUnten - h0 * (1 - sk) / 2);
      ctl.geh(dx, ms, { skala: sk, y: dy });
    }
    function fahren(an) {
      if (an === faehrt) return;
      faehrt = an;
      buehne.classList.toggle('c6s-faehrt', an);
      if (!ctl) return;
      if (an) { sitzt = true; setTimeout(function () { setzeAufsRad(C6.ruhig ? 0 : 700); try { ctl.stimmung('froh'); } catch (e) {} }, C6.ruhig ? 0 : 760); }
      else { sitzt = false; ctl.geh(0, C6.ruhig ? 0 : 700, { skala: 1, y: 0 }); }
    }

    if (C6.bus) {
      C6.bus.on('strings', function () { setzePunkte(aus()); });
      C6.bus.on('rad', function (d) { if (d && d.was === 'teil' && aktiv) return; zeichneAlles(); if (aktiv && d && (d.was === 'lohn' || d.was === 'zu')) malBlatt(); });
      C6.bus.on('kleid', function (o) { try { ctl && ctl.kleid(o); } catch (e) {} });
      C6.bus.on('tastatur', function () { requestAnimationFrame(untenMessen); });
      C6.bus.on('muenzen', function () { if (aktiv && C6.jetzt === 'fahrrad') { var hw = blatt.querySelector('.c6s-f-hinweis'); if (hw && hw.hidden) malBlatt(); } });
      C6.bus.on('warte', function (d) { if (C6.jetzt !== 'fahrrad' || !d || (C6.kieselpark && C6.kieselpark.offen)) return; if (d.stufe === 2) { vogelLandet(); schraubenAn(); } });
      C6.bus.on('wach', function () { if (C6.jetzt !== 'fahrrad') return; vogelWeg(); schraubenAus(); });
      C6.bus.on('licht', function (d) { if (d && d.raum === 'fahrrad' && C6.jetzt === 'fahrrad') licht(); });
    }
    window.addEventListener('resize', function () { setTimeout(untenMessen, 150); });
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(function () { groesse(); }) : null;
    if (ro) ro.observe(szene);
    zeichneAlles();
    var erstesMal = true;

    // Einmal am Tag liegt eine Kiesel-Münze neben dem Rad. Kein Zählen, kein Verpassen.
    var fund = document.createElement('button');
    fund.type = 'button'; fund.className = 'c6s-f-fund'; fund.hidden = true;
    fund.setAttribute('aria-label', 'Da liegt eine Münze');
    fund.innerHTML = C6.muenzen ? C6.muenzen.muenze(30, 'c6s-muenze-glanzt') : '';
    szene.appendChild(fund);
    function heute() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function fundZeigen() { fund.hidden = !C6.muenzen || S().fundTag === heute() || (C6.rundgang && C6.rundgang.an); }
    fund.onclick = function () {
      aendern(function (st) { st.fundTag = heute(); });
      fund.classList.add('c6s-weg');
      if (C6.muenzen) C6.muenzen.plus(1, 'fund', fund);
      setTimeout(function () { fund.hidden = true; fund.classList.remove('c6s-weg'); }, 400);
    };

    // Für Prüfungen und andere Räume
    C6.fahrrad = { oeffne: function (id) { if (C6.jetzt !== 'fahrrad') C6.geh('fahrrad'); setTimeout(function () { oeffne(id); }, C6.jetzt === 'fahrrad' ? 0 : 500); }, schliesse: function () { schliesse(); }, get offen() { return aktiv; }, punkt: punktVon, teile: TEILE };

    return {
      betreten: function (o) {
        o = o || {};
        figur();
        if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'fahrrad');
        try { ctl && ctl.kleid(C6.laden ? C6.laden.an() : {}); } catch (e) {}
        zeichneAlles();
        fundZeigen();
        buehne.classList.add('c6s-sichtbar'); buehne.classList.remove('c6s-ruht');
        untenMessen(); setTimeout(untenMessen, 400);
        groesse(); licht();
        // die Tipp-Punkte pulsen einmal, dann sind sie ruhig
        if (!C6.ruhig && !buehne.classList.contains('c6s-einladen')) { buehne.classList.remove('c6s-puls'); void buehne.offsetWidth; buehne.classList.add('c6s-puls'); setTimeout(function () { buehne.classList.remove('c6s-puls'); }, 1700); }
        if (alleGebunden()) { faehrt = false; fahren(true); }
        if (o.teil && NACH[o.teil]) setTimeout(function () { oeffne(o.teil); }, 350);
        if (erstesMal && !o.rundgang && !(C6.rundgang && C6.rundgang.an)) {
          erstesMal = false;
          if (!S().radGesehen) {
            aendern(function (s) { s.radGesehen = Date.now(); });
            buehne.classList.add('c6s-einladen');
            setTimeout(function () { buehne.classList.remove('c6s-einladen'); }, C6.ruhig ? 0 : 3400);
            setTimeout(function () {
              if (C6.jetzt !== 'fahrrad' || aktiv) return;
              try { C6.sag(satz('fahrradTeil', 'Tipp ein Teil an. Daran binde ich, woran du gerade baust.')); } catch (e) {}
            }, 600);
          }
        }
      },
      verlassen: function () { buehne.classList.remove('c6s-sichtbar'); buehne.classList.add('c6s-ruht'); schliesse(true); vogelWeg(); schraubenAus(); wach(false); },
      groesse: groesse
    };
  }
});
