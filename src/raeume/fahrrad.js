// Die Garage · links das Rad (jedes Teil lässt sich antippen und mit Münzen aus dem Kieselpark umbauen),
// hinten Werkbank und Tor zum Kieselpark, rechts Carls Schrank mit Spiegel (laden.js)
var C6 = window.C6 = window.C6 || {};

function S() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(fn);
  else { fn(S()); try { C6.speichern && C6.speichern(); } catch (e) {} }
}
function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function satz(k, rueck) { try { var t = C6.stimme && C6.stimme.sag(k); if (t) return t; } catch (e) {} return rueck; }
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
    staenderSvg() + '<g class="c6s-r-ganz"><g class="c6s-r-treffer" fill="none" stroke="none"><circle cx="140" cy="272" r="96"/><circle cx="462" cy="272" r="96"/><path d="M184 84H292V138H350V56H580V190H500L470 300H190L184 160Z"/></g>' + g + '<g class="c6s-r-glanz"><path class="c6s-r-glanz-h" d="M96 212A88 88 0 0 1 128 186" style="transform-origin:140px 272px"/><path class="c6s-r-glanz-v" d="M418 212A88 88 0 0 1 450 186" style="transform-origin:462px 272px"/><path d="M262 154L404 150" stroke-width="2.2"/></g><g class="c6s-r-leit"></g></g></svg>';
}
// Montageständer: Dreibein, Stange, Klemme am Sitzrohr. Steht hinter dem Rad und hält es.
function staenderSvg() {
  var sw = ' stroke="' + TU + '" stroke-linecap="round" stroke-linejoin="round"';
  return '<g class="c6s-r-staender">' +
    '<path d="M300 336L244 364M300 336L356 364M300 336L304 368" fill="none"' + sw + ' stroke-width="7"/>' +
    '<path d="M300 336L244 364M300 336L356 364" fill="none" stroke="#6b645a" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M300 340V204Q300 196 292 196H262" fill="none"' + sw + ' stroke-width="9"/>' +
    '<path d="M300 340V204Q300 196 292 196H262" fill="none" stroke="#6b645a" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M300 300h8M300 270h8" stroke="' + TU + '" stroke-width="2" stroke-linecap="round"/>' +
    '<rect x="248" y="184" width="22" height="24" rx="5" fill="#c8463d"' + sw + ' stroke-width="2.6"/>' +
    '<path d="M270 190h8v12h-8" fill="#e2b93b"' + sw + ' stroke-width="2.2"/>' +
    '</g>';
}

// ---------- Die Garage: Werkbank mit Lochwand, Hängelampe, Münzglas, Tor ----------
function werkbankSvg() {
  var sw = ' stroke="' + TU + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"', loch = '';
  for (var y = 14; y < 124; y += 14) for (var x = 34; x < 290; x += 14) loch += 'M' + x + ' ' + y + 'h.1';
  return '<svg viewBox="0 0 320 262" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
    // Lochwand
    '<path d="M22 2H298V132H22Z" fill="#d9bb8e"' + sw + '/>' +
    '<path d="' + loch + '" stroke="#a5835a" stroke-width="3.4" stroke-linecap="round"/>' +
    // Werkzeug an der Wand: Hammer, Schraubendreher, Zange, Schlüssel, Klebeband
    '<path d="M58 30V104" stroke="' + TU + '" stroke-width="9" stroke-linecap="round"/><path d="M58 30V104" stroke="#b07a46" stroke-width="5" stroke-linecap="round"/><path d="M40 24H76V38H40Z" fill="#8c867c"' + sw + '/>' +
    '<path d="M100 28V60" stroke="' + TU + '" stroke-width="2.6"/><path d="M93 60H107V98Q100 104 93 98Z" fill="#c8463d"' + sw + '/>' +
    '<path d="M136 26L130 64L140 98M150 26L156 64L146 98" fill="none" stroke="' + TU + '" stroke-width="4"/><circle cx="143" cy="64" r="4" fill="#8c867c"' + sw + '/>' +
    '<path d="M136 80L130 100M150 80L156 100" stroke="#3f6f9a" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M182 30V96M198 30V86M214 30V76" stroke="' + TU + '" stroke-width="7" stroke-linecap="round"/><path d="M182 30V96M198 30V86M214 30V76" stroke="#c9c4ba" stroke-width="3.6" stroke-linecap="round"/>' +
    '<circle cx="256" cy="56" r="20" fill="#e2b93b"' + sw + '/><circle cx="256" cy="56" r="8" fill="#d9bb8e"' + sw + '/>' +
    // Bank
    '<path d="M24 164V258M296 164V258" stroke="' + TU + '" stroke-width="9" stroke-linecap="round"/><path d="M24 164V258M296 164V258" stroke="#a9784c" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M24 228H296" stroke="' + TU + '" stroke-width="6" stroke-linecap="round"/><path d="M24 228H296" stroke="#a9784c" stroke-width="2.4"/>' +
    '<path d="M40 228V214H86V228ZM196 228V208H222V228Z" fill="#c99a6b"' + sw + '/>' +
    '<path d="M180 164H286V194H180Z" fill="#dcb489"' + sw + '/><path d="M222 179h22" stroke="' + TU + '" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M4 148H316V166H4Z" fill="#c99a6b"' + sw + '/><path d="M12 153H308" stroke="#dcb489" stroke-width="2.4" stroke-linecap="round"/>' +
    // Schraubstock links auf der Bank
    '<path d="M30 148V128H52V120H74V148Z" fill="#6f9a5b"' + sw + '/><path d="M44 136H84" stroke="' + TU + '" stroke-width="3"/><circle cx="86" cy="136" r="3.4" fill="#c9c4ba"' + sw + '/>' +
    // Eigenschatten der Bank (Richtung setzt das Licht)
    '<path d="M4 166H316V176H4Z" fill="' + TU + '" opacity=".12"/>' +
    '</svg>';
}
// Betonboden mit Fugen, die zur Mitte hin zusammenlaufen (Tiefe)
function bodenSvg() {
  var d = '', i;
  for (i = -6; i <= 6; i++) d += 'M' + (50 + i * 9) + ' 0L' + (50 + i * 34) + ' 100';
  [7, 17, 31, 50, 76].forEach(function (y) { d += 'M-200 ' + y + 'H300'; });
  return '<svg class="c6s-g-boden" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
    '<defs><linearGradient id="c6s-g-bd" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c7b497"/><stop offset=".55" stop-color="#d8c8ad"/><stop offset="1" stop-color="#e2d4bd"/></linearGradient></defs>' +
    '<rect x="0" y="0" width="100" height="100" fill="url(#c6s-g-bd)"/>' +
    '<path d="' + d + '" stroke="#2b2722" stroke-opacity=".1" stroke-width="1.5" vector-effect="non-scaling-stroke" fill="none"/>' +
    '<ellipse cx="34" cy="62" rx="7" ry="2.4" fill="#2b2722" opacity=".06"/>' +
    '</svg>';
}
function lampeSvg() {
  return '<svg viewBox="0 0 120 150" aria-hidden="true" focusable="false">' +
    '<path d="M60 0V80" stroke="' + TU + '" stroke-width="2.4"/>' +
    '<circle cx="60" cy="112" r="11" fill="#fff6d6" stroke="' + TU + '" stroke-width="2"/>' +
    '<path d="M24 112L46 80H74L96 112Z" fill="#2f5f5a" stroke="' + TU + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M24 112Q60 120 96 112" fill="none" stroke="' + TU + '" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M50 84L38 106" stroke="#7fa79f" stroke-width="3" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M52 72H68V80H52Z" fill="#8c867c" stroke="' + TU + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '</svg>';
}
function muenzglasSvg(n) {
  n = Math.max(0, n | 0);
  var m = '', k = Math.min(n, 14), i;
  for (i = 0; i < k; i++) { var r = Math.floor(i / 4), c = i % 4; m += '<ellipse cx="' + (20 + c * 8 + (r % 2) * 4) + '" cy="' + (66 - r * 6) + '" rx="5.4" ry="2.6" fill="#e2b93b" stroke="' + TU + '" stroke-width="1.4"/>'; }
  return '<svg viewBox="0 0 60 80" aria-hidden="true" focusable="false">' +
    '<path d="M12 18H48V70Q48 76 42 76H18Q12 76 12 70Z" fill="#eaf0ee" fill-opacity=".55" stroke="' + TU + '" stroke-width="2.4" stroke-linejoin="round"/>' +
    m +
    '<path d="M10 10H50V18H10Z" fill="#c8463d" stroke="' + TU + '" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M18 26V60" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
    '<path d="M22 34H42V50H22Z" fill="#fbf7f0" stroke="' + TU + '" stroke-width="1.6"/>' +
    '<text x="32" y="47" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="15" fill="' + TU + '">' + n + '</text>' +
    '</svg>';
}

// Bildchen eines Teils in einer Variante (für die Auswahl im Blatt)
function bildchen(teilId, A) {
  var t = NACH[teilId], box = t.box, id = teilId === 'hinterrad' ? 'vorderrad' : teilId, pre = '';
  if (teilId === 'klingel') { var k = lenkerForm(A).k; box = (k[0] - 22) + ' ' + (k[1] - 30) + ' 44 34'; }
  if (teilId === 'lenker') pre = '';
  return '<svg viewBox="' + box + '" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">' + pre + teilSvg(id, A) + '</svg>';
}

// ---------- Die Quest-Tafel: eine Kreidetafel an der Wand. Was dort steht, macht uns beide klüger. ----------
// Reihenfolge, Münzen und „kommt“ nur als Rückfall; gilt ist, was C6.quest.alle() sagt. Texte: erst stimme.js (quest.<id>.titel/.satz), dann diese.
var QUESTS = [
  { id: 'samen', muenzen: 3, titel: 'Deinen ersten Samen pflanzen', satz: 'Dann weiß ich, woran du gerade denkst.' },
  { id: 'freund3', muenzen: 5, titel: 'Mir drei Dinge über dich erzählen', satz: 'Was du bestätigst, steht in unserem Freundschaftsbuch, und ich muss nicht mehr raten.' },
  { id: 'sternbild', muenzen: 5, titel: 'Zwei Planeten zu einem Sternbild verbinden', satz: 'Dann sehe ich, was bei dir zusammengehört.' },
  { id: 'werkzeug', muenzen: 5, titel: 'Ein Werkzeug in deinen Worten bauen', satz: 'Dann weiß ich, wie du arbeiten willst, nicht nur was.' },
  { id: 'fund', muenzen: 5, titel: 'Einen Fund prüfen: stimmt oder stimmt so nicht', satz: 'Dein Urteil wiegt mehr als meine Zusammenfassung.' },
  { id: 'ferdl', muenzen: 5, titel: 'Ferdl einen Auftrag geben', satz: 'Was er für dich nachliest, macht mich in deinem Thema klüger.' },
  { id: 'rechte', muenzen: 5, titel: 'Sagen, was ich auf deinem Rechner darf', satz: 'Dann verbindest du, weil du es verstehst, nicht weil ich frage.' },
  { id: 'rechner', muenzen: 8, titel: 'Mich mit deinem Rechner verbinden', satz: 'Dann weiß ich, dass dort ein Helfer läuft, und das UFO wacht auf.' },
  { id: 'modell', muenzen: 8, titel: 'Carl auf deinem Rechner mitdenken lassen', satz: 'Dann denke ich direkt bei dir mit, gratis und privat.' },
  { id: 'github', muenzen: 0, kommt: true, titel: 'GitHub verbinden', satz: 'Kommt, sobald ich dort wirklich etwas für dich tun und es prüfen kann.' }
];
var QNACH = {}; QUESTS.forEach(function (q) { QNACH[q.id] = q; });
// Die Tafel setzt ihre Wörter auch für den Kern (C6.quest.texte), damit überall gleich gesprochen wird – „Modell“ heißt sichtbar nur die eine Wahl-Stelle
var TAFEL_TEXTE = { modell: { titel: QNACH.modell.titel, satz: QNACH.modell.satz } };
function tafelTexteSetzen() { try { if (C6.quest && typeof C6.quest === 'object') { C6.quest.texte = C6.quest.texte || {}; Object.keys(TAFEL_TEXTE).forEach(function (id) { if (!C6.quest.texte[id]) C6.quest.texte[id] = TAFEL_TEXTE[id]; }); } } catch (e) {} }
function questText(id, feld, rueck) {
  try { var o = C6.quest && C6.quest.texte && C6.quest.texte[id]; if (o && o[feld]) return String(o[feld]); } catch (e) {}
  try { var t = C6.stimme && C6.stimme.fest && C6.stimme.fest('quest.' + id + '.' + feld); if (t) return t; } catch (e) {}
  return rueck;
}
// Was der Rückfall ohne C6.quest selbst sicher weiß: nur die Verbinden-Quests (am Zustand geprüft, nie am Ja)
function questRueckfall(id) {
  var v = S().verbindung || {};
  if (id === 'rechte' && v.rechteSatz && v.rechteSatz.ts) return v.rechteSatz.ts;
  if (id === 'rechner' && v.codeGeprueft) return v.codeGeprueft;
  if (id === 'modell' && v.probe && v.probe.ts) return v.probe.ts;
  return null;
}
function questListe() {
  tafelTexteSetzen();
  var roh = null;
  try { if (C6.quest && typeof C6.quest.alle === 'function') roh = C6.quest.alle(); } catch (e) { roh = null; }
  var nach = {}, liste = [];
  if (roh && roh.length) roh.forEach(function (q) { if (q && q.id) nach[q.id] = q; });
  var ids = QUESTS.map(function (q) { return q.id; });
  if (roh && roh.length) roh.forEach(function (q) { if (q && q.id && ids.indexOf(q.id) < 0) ids.splice(ids.length - 1, 0, q.id); });
  ids.forEach(function (id) {
    var e = QNACH[id] || {}, r = nach[id];
    if (roh && roh.length && !r) return; // der Kern kennt sie nicht: nicht zeigen
    var kommt = r ? !!r.kommt : !!e.kommt;
    var am = r ? (r.erfuellt ? (r.am || Date.now()) : null) : questRueckfall(id);
    liste.push({
      id: id, kommt: kommt, am: kommt ? null : am,
      muenzen: kommt ? 0 : (r && r.muenzen != null ? +r.muenzen || 0 : e.muenzen || 0),
      titel: questText(id, 'titel', e.titel || (r && r.titel) || id),
      satz: questText(id, 'satz', e.satz || (r && r.satz) || '')
    });
  });
  // die Kommenden immer zuletzt
  return liste.filter(function (q) { return !q.kommt; }).concat(liste.filter(function (q) { return q.kommt; }));
}
function datum(ts) { var d = new Date(ts); return d.getDate() + '.' + (d.getMonth() + 1) + '.'; }
var KREIDE = '#f1ede4';
function haekchen(x, y, s) { return 'M' + (x + s * .18) + ' ' + (y + s * .52) + 'L' + (x + s * .42) + ' ' + (y + s * .78) + 'L' + (x + s * .9) + ' ' + (y + s * .12); }
function tafelSvg(liste, neuId) {
  var zaehl = liste.filter(function (q) { return !q.kommt; });
  var n = zaehl.length, reihe1 = Math.ceil(n / 2), s = 15, gap = 6, k = '';
  zaehl.forEach(function (q, i) {
    var r = i < reihe1 ? 0 : 1, j = r ? i - reihe1 : i, inR = r ? n - reihe1 : reihe1;
    var x = 80 - (inR * s + (inR - 1) * gap) / 2 + j * (s + gap), y = r ? 80 : 59;
    k += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + s + '" height="' + s + '" rx="2.5" fill="none" stroke="' + KREIDE + '" stroke-width="1.8" opacity="' + (q.am ? '.95' : '.6') + '"/>';
    if (q.am) k += '<path class="c6s-g-haken' + (q.id === neuId ? ' c6s-g-haken-neu' : '') + '" d="' + haekchen(x - 1, y - 3, s + 3) + '" fill="none" stroke="#f3df9e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>';
  });
  return '<svg viewBox="0 0 160 124" aria-hidden="true" focusable="false">' +
    // Nagel und Schnur
    '<path d="M80 6L26 30M80 6L134 30" fill="none" stroke="' + TU + '" stroke-width="1.6" stroke-linecap="round"/><circle cx="80" cy="6" r="3.4" fill="#8c867c" stroke="' + TU + '" stroke-width="1.6"/>' +
    // Rahmen, Schiefer, Kreidestaub
    '<rect x="8" y="26" width="144" height="88" rx="5" fill="#9a6a40" stroke="' + TU + '" stroke-width="2.6"/>' +
    '<rect x="16" y="33" width="128" height="72" rx="2" fill="#2f3e38" stroke="' + TU + '" stroke-width="1.6"/>' +
    '<path d="M22 98Q60 92 96 99T138 95" fill="none" stroke="' + KREIDE + '" stroke-width="5" stroke-linecap="round" opacity=".08"/>' +
    '<text x="80" y="53" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="19" fill="' + KREIDE + '">Quests</text>' + k +
    // Ablage mit Kreide und Schwamm
    '<path d="M12 114H148" stroke="' + TU + '" stroke-width="2.6" stroke-linecap="round"/><rect x="18" y="108" width="124" height="7" rx="2" fill="#b98a5c" stroke="' + TU + '" stroke-width="2"/>' +
    '<rect x="104" y="104" width="16" height="5" rx="2.4" fill="' + KREIDE + '" stroke="' + TU + '" stroke-width="1.4"/>' +
    '<rect x="32" y="101" width="22" height="8" rx="2" fill="#d9b04a" stroke="' + TU + '" stroke-width="1.6"/><path d="M32 105h22" stroke="#6b5a3a" stroke-width="1.2"/>' +
    '</svg>';
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
function tageszeit(h) {
  if (h == null) { try { h = C6.tageszeit && typeof C6.tageszeit.stunde === 'function' ? C6.tageszeit.stunde() : null; } catch (e) { h = null; } }
  h = h == null ? new Date().getHours() : h;
  if (h >= 5 && h < 11) return 'morgen';
  if (h >= 11 && h < 16) return 'mittag';
  if (h >= 16 && h < 21) return 'abend';
  return 'nacht';
}

C6.raum({
  id: 'fahrrad', name: 'Garage', reihe: 3, symbol: SYMBOL,
  bauen: function (buehne) {
    buehne.classList.add('c6s-fahrrad', 'c6s-garage');
    buehne.innerHTML =
      '<div class="c6s-g-raum" aria-hidden="true"><i class="c6s-g-wand"></i>' + bodenSvg() + '<i class="c6s-g-kegel"></i><i class="c6s-g-licht"></i><div class="c6s-g-lampe">' + lampeSvg() + '</div></div>' +
      '<div class="c6s-f-innen">' +
      '  <div class="c6s-f-szene" data-c6-leer>' +
      '    <div class="c6s-g-moebel">' +
      '      <button type="button" class="c6s-g-tor" aria-label="Tor zum Kieselpark: fahren und Münzen sammeln">' +
      '        <span class="c6s-g-aussen c6s-f-hof" aria-hidden="true"><i class="c6s-f-himmel"></i>' + huegelSvg() + wolkeSvg(1) + wolkeSvg(2) +
      '          <span class="c6s-f-sonne" data-c6-sonne>' + sonneSvg() + '</span><i class="c6s-g-weg"></i>' + wimpelSvg() + vogelSvg() + '</span>' +
      '        <span class="c6s-g-rolle" aria-hidden="true"></span>' +
      '        <span class="c6s-g-schild"><b>Kieselpark</b>' + (C6.muenzen ? C6.muenzen.muenze(18, 'c6s-hell') : '') + '</span>' +
      '      </button>' +
      '      <div class="c6s-g-bank">' + werkbankSvg() + '</div>' +
      '      <div class="c6s-g-schrankplatz"></div>' +
      '      <button type="button" class="c6s-g-glas" aria-label="Münzglas"></button>' +
      '      <button type="button" class="c6s-g-heft" aria-label="Katalog: Lampen, Dinge und Sessel für deine Räume. Antippen öffnet ihn" data-c6-schild></button>' +
      '      <button type="button" class="c6s-g-ufo" aria-label="UFO"></button>' +
      '      <button type="button" class="c6s-g-tafel" aria-label="Quest-Tafel" data-c6-schild></button>' +
      '    </div>' +
      '    <div class="c6s-f-rad" data-tiefe="mitte">' + radSvg() + '<div class="c6s-f-punkte" role="group" aria-label="Die Teile deines Rads"></div></div>' +
      '    <div class="c6s-f-carl"></div>' +
      '  </div>' +
      '  <div class="c6s-f-blatt" role="dialog" aria-modal="false" hidden data-c6-kein-wisch></div>' +
      '  <div class="c6s-f-blatt c6s-g-kleid" role="dialog" aria-modal="false" aria-label="Carls Schrank" hidden data-c6-kein-wisch data-c6-bild></div>' +
      '  <div class="c6s-f-blatt c6s-g-tafelblatt" role="dialog" aria-modal="false" aria-label="Quests" hidden data-c6-kein-wisch data-c6-ding></div>' +
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
    var blatt = buehne.querySelector('.c6s-f-blatt'), bmxKnopf = buehne.querySelector('.c6s-g-tor');
    var kleidBlatt = buehne.querySelector('.c6s-g-kleid'), raum = buehne.querySelector('.c6s-g-raum'), lampeEl = buehne.querySelector('.c6s-g-lampe');
    var ufoEl = buehne.querySelector('.c6s-g-ufo');
    var tafelEl = buehne.querySelector('.c6s-g-tafel'), tafelBlatt = buehne.querySelector('.c6s-g-tafelblatt');
    var torEl = bmxKnopf, bankEl = buehne.querySelector('.c6s-g-bank'), glasEl = buehne.querySelector('.c6s-g-glas'), schrankPlatz = buehne.querySelector('.c6s-g-schrankplatz');
    // Der Katalog (seit 16.10. hier, nicht mehr im Zuhause): ein Heft, das am Schrank lehnt – alles, was Carl und seine Räume verändert, an einem Ort
    var heftEl = buehne.querySelector('.c6s-g-heft');
    if (heftEl) {
      try { heftEl.innerHTML = (C6.einrichten && C6.einrichten.heft) || ''; } catch (e) {}
      heftEl.hidden = !(C6.einrichten && typeof C6.einrichten.oeffne === 'function');
      heftEl.addEventListener('click', function () { try { C6.einrichten.oeffne({ ort: 'zuhause' }); } catch (e) {} });
    }
    var leitG = svg.querySelector('.c6s-r-leit');
    var ctl = null, aktiv = null;
    var gTeil = {}; Array.prototype.forEach.call(svg.querySelectorAll('.c6s-r-teil'), function (g) { gTeil[g.dataset.teil] = g; });

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

    // ---------- Licht: eine Hängelampe über der Werkbank; draußen im Tor geht der Tag wie die Uhr ----------
    var letzteZeit = null, lampe = { x: .5, y: .2, px: 0 };
    function licht(zeit) {
      zeit = zeit || tageszeit();
      var pc = C6.geraet === 'computer';
      if (zeit !== letzteZeit) {
        letzteZeit = zeit;
        buehne.setAttribute('data-zeit', zeit);
        var S0 = { morgen: [.24, .3], mittag: [.5, .18], abend: [.78, .34], nacht: [.7, .22] }[zeit];
        buehne.style.setProperty('--c6s-sonne-x', (S0[0] * 100).toFixed(1) + '%');
        buehne.style.setProperty('--c6s-sonne-y', (S0[1] * 100).toFixed(1) + '%');
      }
      var q = { x: lampe.x, y: lampe.y, art: 'lampe', warm: .85, staerke: .8, hoehe: .72 }, schl = q.x.toFixed(2) + '|' + q.y.toFixed(2);
      if (schl !== lampe.gesetzt) { lampe.gesetzt = schl; try { C6.lichtquelle && C6.lichtquelle.setze('fahrrad', q); } catch (e) {} }
      // Bodenschatten im Rad-SVG: vom Licht weg, gemessen an der Radmitte
      var rr = svg.getBoundingClientRect(), rel = rr.width ? (lampe.px - (rr.left + rr.width / 2)) / rr.width : 0;
      rel = Math.max(-.7, Math.min(.7, rel));
      var s = rel * 1.1, len = .16 * (1 - q.hoehe) + .06, dx = -rel * 46;
      [['.c6s-r-sch-h', 140], ['.c6s-r-sch-v', 462]].forEach(function (p) { var e = svg.querySelector(p[0]); e.setAttribute('cx', (p[1] + dx).toFixed(1)); e.setAttribute('rx', (84 + 30 * (1 - q.hoehe)).toFixed(1)); });
      gSchRahmen.setAttribute('transform', 'matrix(1 0 ' + s.toFixed(3) + ' ' + (-len).toFixed(3) + ' ' + (-362 * s).toFixed(1) + ' ' + (362 * (1 + len)).toFixed(1) + ')');
      svg.querySelector('.c6s-r-schatten').setAttribute('opacity', (0.06 + 0.12 * q.staerke).toFixed(2));
      var a = (rel * 110).toFixed(1);
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
        var p = punktVon(t.id, A), b = punkte[t.id];
        b.style.left = (p[0] / 600 * 100) + '%'; b.style.top = (p[1] / 380 * 100) + '%';
        var hatNeu = neu.some(function (l) { var art = l.split(':')[0]; return t.reihen.indexOf(art) >= 0; });
        b.classList.toggle('c6s-neu', hatNeu);
        b.setAttribute('aria-label', t.name + (hatNeu ? ', etwas Neues aus dem Kieselpark' : '') + '. Ändern');
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
      if (C6.ruhig) return;
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
    radBox.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !aktiv) wach(true); });
    radBox.addEventListener('click', function (e) {
      if (schrankOffen()) return;
      var warWach = buehne.classList.contains('c6s-wach');
      wach(true);
      if (!warWach && !aktiv && !e.target.closest('.c6s-f-pkt')) { drehAn(); return; }
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
      var A = aus(), K = katalog();
      var h = '<div class="c6s-f-bkopf"><h3 class="c6s-f-btitel">' + t.name + '</h3><button type="button" class="c6s-f-zu" aria-label="Schließen"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>';
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
        var preis = 0; try { preis = +(C6.kieselpark.herkunft(art, id) || {}).preis || 0; } catch (x) {}
        var von = glasMitte(), teilJetzt = aktiv;
        if (C6.kieselpark.kaufe(art, id)) { probe = null; muenzenFliegen(preis, von, teilJetzt); nachWahl(art); malBlattStill(); hinweis(esc(satz('fahrrad.gekauft', 'Gehört jetzt dir.'))); }
        else {
          var fehlt = Math.max(1, preis - stand());
          hinweis(fehlt === 1 ? 'Dafür fehlt dir noch eine Münze.' : 'Dafür fehlen dir noch ' + fehlt + ' Münzen.');
          torZeigen();
        }
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
      zeichneAlles(); huepf(); markiereWahl(); nachdrehen();
      try { var w = C6.kieselpark.wahl(art); if (w && !C6.kieselpark.herkunft(art, w).frei) neuAmRad = { art: art, id: w, teil: aktiv }; } catch (e) {}
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
      if (schrankOffen()) schrankZu(true);
      if (tafelOffen) tafelZu(true);
      var war = aktiv;
      if (probe) { probe = null; zeichneAlles(); }
      aktiv = teilId; markiere(teilId);
      staunenZu('garage.rad');
      if (!war) { try { C6.schweig && C6.schweig(); } catch (e) {} }
      malBlatt();
      buehne.classList.add('c6s-blatt-auf');
      blatt.hidden = false;
      groesse();
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
      groesse();
      if (!still && taste) { try { punkte[id] && punkte[id].focus({ preventScroll: true }); } catch (e) {} }
      if (!still) setTimeout(spiegelSchaut, C6.ruhig ? 0 : 420);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || C6.jetzt !== 'fahrrad') return;
      if (C6.kieselpark && C6.kieselpark.offen) return;
      if (!aktiv && tafelOffen) { e.preventDefault(); e.stopPropagation(); tafelZu(false, true); return; }
      if (!aktiv && schrankOffen()) { e.preventDefault(); e.stopPropagation(); schrankZu(); return; }
      if (!aktiv) return;
      e.preventDefault(); e.stopPropagation(); schliesse(false, true);
    }, true);
    // Tipp daneben schließt das Blatt (nicht auf Rad, Punkte, Blatt)
    szene.addEventListener('click', function (e) {
      if (aktiv && !e.target.closest('.c6s-f-rad,.c6s-f-blatt,.c6s-f-carl')) schliesse();
      if (tafelOffen && !e.target.closest('.c6s-f-blatt,.c6s-g-tafel') && Date.now() - tafelSeit > 300) tafelZu();
    });

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
      spiegelKoppeln();
      groesse();
    }
    // Das Spiegelbild macht mit: Stimmung, Hüpfer und Blick gehen auch ans Bild im Glas (dort seitenverkehrt).
    // Braucht vom Schrank (laden.js) schrank.bild() → die Figur im Spiegel; fehlt es, bleibt alles wie es ist.
    function spiegelBildCtl() { try { return schrank && typeof schrank.bild === 'function' ? schrank.bild() : null; } catch (e) { return null; } }
    function spiegelKoppeln() {
      if (!ctl || ctl._c6sSpiegelt) return; ctl._c6sSpiegelt = true;
      ['stimmung', 'huepf', 'schau'].forEach(function (n) {
        var orig = ctl[n]; if (typeof orig !== 'function') return;
        ctl[n] = function () {
          var r = orig.apply(ctl, arguments), b = spiegelBildCtl();
          if (b && b !== ctl && typeof b[n] === 'function') { try { b[n].apply(b, arguments); } catch (e) {} }
          return r;
        };
      });
    }
    // Das UFO unter der Decke: verschlossen, bis Carl mit Claude Code oder Codex verbunden ist
    function verbunden() { try { return !!(C6.verbindung && C6.verbindung.verbunden()); } catch (e) { return false; } }
    function ufoMalen() {
      if (!ufoEl || !C6.einrichten) { if (ufoEl) ufoEl.hidden = true; return; }
      var an = verbunden();
      ufoEl.innerHTML = C6.einrichten.ufoSvg(C6.einrichten.ufo(), !an);
      ufoEl.classList.toggle('c6s-g-ufo-zu', !an);
      ufoEl.setAttribute('aria-label', an ? 'Dein UFO: einrichten' : 'UFO, noch verschlossen');
    }
    // Freude: das UFO wacht auf (Lichter an, hüpft, dreht sich einmal, Funken), Carl staunt
    function ufoWacht() {
      ufoMalen();
      ufoEl.classList.remove('c6s-g-ufo-wacht'); void ufoEl.offsetWidth; ufoEl.classList.add('c6s-g-ufo-wacht');
      setTimeout(function () { ufoEl.classList.remove('c6s-g-ufo-wacht'); }, 2200);
      try { if (ctl) { ctl.stimmung && ctl.stimmung('staunt'); var r = ufoEl.getBoundingClientRect(); ctl.schau && ctl.schau(r.left + r.width / 2, r.top + r.height / 2); setTimeout(function () { try { ctl.stimmung('froh'); ctl.huepf && ctl.huepf(14); ctl.schau(); } catch (x) {} }, 1300); } } catch (x) {}
      setTimeout(function () { try { C6.sag((C6.stimme && C6.stimme.sag('ufo.wach')) || 'Das UFO ist wach. Tipp es an, dann richten wir es ein.'); } catch (x) {} }, 900);
    }
    ufoMalen();
    ufoEl.onclick = function (e) {
      e.stopPropagation();
      if (!verbunden()) {
        if (!C6.ruhig) { try { ufoEl.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], { duration: 360 }); } catch (x) {} }
        if (aktiv) schliesse(true);
        try {
          Promise.resolve(C6.frag(satz('ufo.zu', 'Das UFO schläft. Es wacht auf, wenn dein Rechner mir einmal Hallo sagt. Steuern kann ich ihn nicht.'), [{ t: 'Zeig mir, wie', wert: 'ufo-wie' }], { id: 'garage-ufo' })).then(function (w) {
            if (w === 'ufo-wie' || (w && w.wert === 'ufo-wie')) { try { C6.verbindung && C6.verbindung.oeffne && C6.verbindung.oeffne(); } catch (x) {} }
          });
        } catch (x) {}
        return;
      }
      if (aktiv) schliesse(true);
      if (schrankOffen()) schrankZu(true);
      C6.einrichten.oeffne({ ort: 'ufo' });
    };
    if (C6.bus) {
      C6.bus.on('einrichten', function (d) { if (d && d.ort === 'ufo') ufoMalen(); });
      C6.bus.on('verbindung', function (d) { ufoMalen(); staunenZu('garage.ufo'); if (C6.jetzt === 'fahrrad' && verbunden() && d && d.wach) ufoWacht(); });
    }

    // ---------- Die Quest-Tafel an der Wand: antippen zeigt die Quests, eine Quest antippen führt genau dorthin ----------
    var tafelOffen = false, tafelSeit = 0;
    var ZU_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    var HAKEN_SVG = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 13l5 6L21 4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    function tafelMalen(neuId) {
      var l = questListe(), zahl = l.filter(function (q) { return !q.kommt; }), ab = zahl.filter(function (q) { return q.am; }).length;
      tafelEl.innerHTML = tafelSvg(l, neuId);
      tafelEl.setAttribute('aria-label', 'Quest-Tafel: ' + ab + ' von ' + zahl.length + ' abgehakt');
      if (tafelOffen) malTafelBlatt();
    }
    function rechteWorte() { var v = S().verbindung || {}; return v.rechteSatz && v.rechteSatz.t ? String(v.rechteSatz.t) : ''; }
    function malTafelBlatt() {
      var l = questListe(), zahl = l.filter(function (q) { return !q.kommt; }), ab = zahl.filter(function (q) { return q.am; }).length;
      var muenze = C6.muenzen && C6.muenzen.muenze ? C6.muenzen.muenze(18) : '';
      var h = '<div class="c6s-f-bkopf c6s-g-tkopf"><h3 class="c6s-f-btitel">Quests</h3><span class="c6s-g-tzahl">' + ab + ' von ' + zahl.length + '</span><button type="button" class="c6s-f-zu" aria-label="Schließen">' + ZU_SVG + '</button></div>' +
        '<p class="c6s-g-tsatz">Jede macht uns beide klüger. Münzen gibt es fürs Verstehen, nie fürs bloße Ja.</p><ul class="c6s-g-qs">';
      l.forEach(function (q) {
        var worte = q.id === 'rechte' && q.am && rechteWorte() ? '<span class="c6s-g-qworte">Deine Worte: „' + esc(rechteWorte()) + '“</span>' : '';
        var lohn = q.kommt ? '<span class="c6s-g-qlohn c6s-g-kommt">kommt</span>' : '<span class="c6s-g-qlohn">' + muenze + '<b>' + q.muenzen + '</b></span>';
        var innen = '<span class="c6s-g-qbox" aria-hidden="true">' + (q.am ? HAKEN_SVG : '') + '</span>' +
          '<span class="c6s-g-qtext"><b class="c6s-g-qtitel">' + esc(q.titel) + '</b><i class="c6s-g-qsatz">' + esc(q.satz) + '</i>' +
          (q.am ? '<em class="c6s-g-qam">abgehakt am ' + datum(q.am) + '</em>' : '') + worte + '</span>' + lohn;
        if (q.kommt) h += '<li class="c6s-g-q c6s-g-q-kommt">' + innen + '</li>';
        else h += '<li><button type="button" class="c6s-g-q' + (q.am ? ' c6s-g-q-ab' : '') + '" data-q="' + esc(q.id) + '" aria-label="' + esc(q.titel + (q.am ? ', abgehakt am ' + datum(q.am) : ', ' + q.muenzen + ' Münzen') + '. Dorthin gehen') + '">' + innen + '</button></li>';
      });
      // leise unten: wer nur spielen und Carl einkleiden will, findet hier seinen Weg (kein Zähler, kein Druck)
      function weg(id, t) { return '<button type="button" class="c6s-g-tweg" data-weg="' + id + '">' + esc(t) + '</button>'; }
      h += '</ul><div class="c6s-g-tmehr"><p class="c6s-g-tklein">Spielen</p><div class="c6s-g-twege">' +
        weg('park', 'Kieselpark: fahren und Münzen sammeln') + weg('allein', 'Im Schrank liegt etwas ganz allein.') + '</div>' +
        '<p class="c6s-g-tklein">Wofür Münzen?</p><div class="c6s-g-twege">' +
        weg('schrank', 'Kleider für mich') + weg('rad', 'Teile fürs Rad') + weg('ufo', 'Das UFO') + weg('zuhause', 'Dinge fürs Zuhause') + '</div></div>';
      tafelBlatt.innerHTML = h;
      tafelBlatt.querySelector('.c6s-f-zu').onclick = function () { tafelZu(false, perTaste); };
      Array.prototype.forEach.call(tafelBlatt.querySelectorAll('.c6s-g-tweg'), function (b) { b.onclick = function () { tafelWeg(b.dataset.weg); }; });
      Array.prototype.forEach.call(tafelBlatt.querySelectorAll('.c6s-g-q[data-q]'), function (b) { b.onclick = function () { questHin(b.dataset.q); }; });
    }
    function tafelWeg(id) {
      tafelZu(true);
      if (id === 'park') { if (C6.kieselpark) C6.kieselpark.auf(); return; }
      if (id === 'allein' || id === 'schrank') { schrankAuf(); return; }
      if (id === 'rad') { oeffne('rahmen'); return; }
      if (id === 'ufo') { try { ufoEl.onclick({ stopPropagation: function () {} }); } catch (e) {} return; }
      if (id === 'zuhause') {
        try { C6.geh('zuhause'); } catch (e) {}
        setTimeout(function () { try { C6.einrichten && C6.einrichten.oeffne && C6.einrichten.oeffne({ ort: 'zuhause', platz: 'sessel' }); } catch (e) {} }, C6.ruhig ? 60 : 750);
      }
    }
    function tafelSchwingt() {
      if (C6.ruhig) return;
      try { tafelEl.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-3.5deg)', offset: .25 }, { transform: 'rotate(2.2deg)', offset: .55 }, { transform: 'rotate(-.8deg)', offset: .8 }, { transform: 'rotate(0)' }], { duration: 900, easing: 'ease-out' }); } catch (e) {}
    }
    function tafelAuf() {
      if (C6.rundgang && C6.rundgang.an) return;
      if (aktiv) schliesse(true);
      if (schrankOffen()) schrankZu(true);
      var war = tafelOffen;
      if (!war) { try { C6.schweig && C6.schweig(); } catch (e) {} }
      tafelOffen = true; tafelSeit = Date.now();
      malTafelBlatt();
      tafelBlatt.hidden = false;
      buehne.classList.add('c6s-g-tafel-auf');
      groesse();
      staunenZu('garage.tafel');
      if (!war) { try { tafelBlatt.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: C6.ruhig ? 0 : 260, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
      if (perTaste) setTimeout(function () { var z = tafelBlatt.querySelector('.c6s-f-zu'); try { z && z.focus({ preventScroll: true }); } catch (e) {} }, 30);
    }
    function tafelZu(still, taste) {
      if (!tafelOffen) return;
      tafelOffen = false;
      tafelBlatt.hidden = true; tafelBlatt.innerHTML = '';
      buehne.classList.remove('c6s-g-tafel-auf');
      groesse();
      if (!still && taste) { try { tafelEl.focus({ preventScroll: true }); } catch (e) {} }
    }
    // Wo die Quest zu tun ist. Carl sagt dort in einem Satz, was zu tun ist (nur, wo ein Satz hilft).
    function questHin(id) {
      tafelZu(true);
      function geh(r, o) { try { if (C6.jetzt !== r) return C6.geh(r, o); } catch (e) {} return true; }
      function dann(fn, ms) { setTimeout(function () { try { fn(); } catch (e) {} }, C6.ruhig ? 60 : (ms || 650)); }
      function sagDort(rueck, ms) { dann(function () { try { C6.sag(questText(id, 'hin', rueck)); } catch (e) {} }, ms || 900); }
      switch (id) {
        case 'samen': geh('zuhause'); sagDort('Schreib unten einen Satz, an den du gerade denkst. Er wird dein Samen.'); dann(function () { C6.eingabe && C6.eingabe.fokus && C6.eingabe.fokus(); }, 1000); break;
        case 'freund3': geh('bibliothek'); dann(function () { C6.atlas && typeof C6.atlas.oeffne === 'function' && C6.atlas.oeffne({}); }, 750); break;
        case 'sternbild': geh('netz'); sagDort('Hier oben verbindest du zwei Planeten zu einem Sternbild.'); break;
        case 'werkzeug': geh('werkstatt'); sagDort('An der Wand hängt „Neues Werkzeug“. Sag mir in deinen Worten, was es tun soll.'); break;
        case 'ferdl': geh('werkstatt'); sagDort('Ferdl wartet auf Arbeit. Gib ihm ein Thema zum Nachlesen.'); break;
        case 'fund':
          if (C6.lesesaal && typeof C6.lesesaal.oeffne === 'function') { try { C6.lesesaal.oeffne(); } catch (e) {} }
          else if (geh('lesesaal') === false) geh('bibliothek');
          sagDort('Auf dem Tisch liegen deine Funde. Sag bei einem: stimmt, oder stimmt so nicht.', 1300); break;
        case 'rechte': case 'rechner': try { C6.verbindung && C6.verbindung.oeffne({}); } catch (e) {} break;
        case 'modell': try { C6.verbindung && C6.verbindung.oeffneLokal({}); } catch (e) {} break;
        default: try { C6.quest && typeof C6.quest.geh === 'function' && C6.quest.geh(id); } catch (e) {}
      }
    }
    tafelMalen();
    tafelEl.onclick = function (e) {
      e.stopPropagation();
      tafelSchwingt();
      if (tafelOffen) tafelZu(false, perTaste); else tafelAuf();
    };
    if (C6.bus) {
      C6.bus.on('quest', function (d) {
        var neu = d && d.neu ? d.id : null;
        tafelMalen(neu);
        if (neu && C6.jetzt === 'fahrrad') { staunenZu('garage.tafel'); tafelSchwingt(); }
      });
      C6.bus.on('verbindung', function () { tafelMalen(); });
      // Tipp auf eine leere Stelle: jedes offene Blatt der Garage geht zu (nicht der Tipp, der es eben geöffnet hat)
      C6.bus.on('leer', function (d) {
        if (C6.jetzt !== 'fahrrad' || (d && d.raum && d.raum !== 'fahrrad')) return;
        if (C6.kieselpark && C6.kieselpark.offen) return;
        var z = d && d.ziel; if (z && z.closest && z.closest('.c6s-f-blatt,.c6v-blatt,.c6s-g-tafel')) return;
        if (Date.now() - tafelSeit < 300) return;
        if (aktiv) schliesse();
        if (tafelOffen) tafelZu();
        if (schrankOffen()) schrankZu();
      });
    }

    // Carls Schrank mit Spiegel (Anprobieren, Kaufen mit Münzen, Wimpern, Gefährt: laden.js)
    try {
      if (C6.laden && C6.laden.schrank) schrank = C6.laden.schrank({ platz: schrankPlatz, panel: kleidBlatt, figurEl: carlBox, ctl: function () { figur(); return ctl; }, auf: function () { schrankAuf(); }, zu: function () { schrankZu(); } });
    } catch (e) { try { console.warn('Schrank', e); } catch (x) {} }
    carlBox.addEventListener('click', function () { if (schrankOffen()) schrank.tipp(); });
    // Das Münzglas auf der Werkbank: so viele Münzen liegen drin
    function glasMalen() { var n = 0; try { n = C6.muenzen ? C6.muenzen.stand() : 0; } catch (e) {} glasEl.innerHTML = muenzglasSvg(n); glasEl.setAttribute('aria-label', 'Münzglas: ' + n + (n === 1 ? ' Münze' : ' Münzen')); }
    glasMalen();
    var glasStand = null, parkStand = null;
    function stand() { try { return C6.muenzen ? C6.muenzen.stand() : 0; } catch (e) { return 0; } }
    function glasHuepf() {
      if (C6.ruhig) return;
      try { glasEl.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-10px) rotate(-4deg)', offset: .35 }, { transform: 'translateY(0) rotate(2deg)', offset: .7 }, { transform: 'none' }], { duration: 620, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
    }
    if (C6.bus) {
      C6.bus.on('muenzen', function () { var n = stand(); if (glasStand !== null && n > glasStand && C6.jetzt === 'fahrrad') glasHuepf(); if (glasStand !== n) staunenZu('garage.glas'); glasStand = n; });
      C6.bus.on('spiel', function (d) {
        if (!d || d.was !== 'kieselpark') return;
        if (d.offen) { parkStand = stand(); return; }
        var mehr = parkStand === null ? 0 : stand() - parkStand; parkStand = null;
        if (mehr <= 0 || C6.jetzt !== 'fahrrad') return;
        setTimeout(function () {
          glasHuepf();
          Promise.resolve(C6.frag((mehr === 1 ? 'Eine Münze' : mehr + ' Münzen') + ' mehr im Glas.', [{ t: 'Zum Schrank', wert: 'schrank' }], { id: 'garage-muenzen' })).then(function (w) {
            if (w === 'schrank' || (w && w.wert === 'schrank') || w === 'Zum Schrank') schrankAuf();
          });
        }, 500);
      });
    }
    glasStand = stand();
    glasEl.onclick = function (e) {
      e.stopPropagation();
      var n = 0; try { n = C6.muenzen ? C6.muenzen.stand() : 0; } catch (x) {}
      if (!C6.ruhig) { try { glasEl.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)', offset: .3 }, { transform: 'rotate(5deg)', offset: .6 }, { transform: 'rotate(0)' }], { duration: 520, easing: 'ease-in-out' }); } catch (x) {} }
      // leer: der Satz sagt, woher; das Tor zeigt den Weg. Voll: nur, wie viele.
      try { C6.sag(n === 0 ? 'Das Glas ist leer. ' + (schrank ? schrank.muenzSatz() : '') : n === 1 ? 'Eine Münze im Glas.' : n + ' Münzen im Glas.'); } catch (x) {}
      if (n === 0) torZeigen();
    };

    // ---------- Zeigen statt sagen: Münzen fliegen, das Tor leuchtet, das Vorderrad dreht nach, der Spiegel schaut mit ----------
    function staunenZu(id) { try { C6.staunen && typeof C6.staunen.zu === 'function' && C6.staunen.zu(id); } catch (e) {} }
    function glasMitte() { var r = glasEl.getBoundingClientRect(); var sv = glasEl.querySelector('svg'), q = sv ? sv.getBoundingClientRect() : r; return { x: q.left + q.width / 2, y: q.top + q.height * 0.55 }; }
    function teilMitte(id) { var r = svg.getBoundingClientRect(), p = punktVon(id || 'rahmen', aus()); return { x: r.left + p[0] / 600 * r.width, y: r.top + p[1] / 380 * r.height }; }
    // genau so viele Münzen, wie das Teil kostet, eine nach der anderen vom Glas zum Teil
    function muenzenFliegen(n, von, teilId) {
      n = Math.max(0, n | 0); if (!n || !von) return;
      var nach = teilMitte(teilId);
      buehne.classList.add('c6s-g-zahlt');
      var ende = 0;
      for (var i = 0; i < n; i++) (function (i) {
        var d = document.createElement('div');
        d.className = 'c6s-g-flug'; d.setAttribute('aria-hidden', 'true'); d.setAttribute('data-c6s-flug', String(i + 1));
        d.innerHTML = C6.muenzen ? C6.muenzen.muenze(22) : '';
        d.style.left = von.x + 'px'; d.style.top = von.y + 'px';
        document.body.appendChild(d);
        var dx = nach.x - von.x, dy = nach.y - von.y, hoch = Math.min(-40, dy * 0.5 - 60);
        var dauer = C6.ruhig ? 500 : 760, warte = i * (C6.ruhig ? 60 : 140);
        ende = Math.max(ende, dauer + warte);
        var k = C6.ruhig
          ? [{ opacity: 0, transform: 'translate(-50%,-50%)' }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .8, transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px))' }, { opacity: 0, transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px))' }]
          : [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.6)' },
             { opacity: 1, offset: .12, transform: 'translate(-50%,-50%) translateY(-8px) scale(1)' },
             { opacity: 1, offset: .55, transform: 'translate(calc(-50% + ' + (dx * .5) + 'px),calc(-50% + ' + hoch + 'px)) scale(1)' },
             { opacity: 1, offset: .9, transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(.8)' },
             { opacity: 0, transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(.4)' }];
        try { var a = d.animate(k, { duration: dauer, delay: warte, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'both' }); a.onfinish = function () { d.remove(); }; }
        catch (e) { setTimeout(function () { d.remove(); }, dauer + warte); }
      })(i);
      setTimeout(function () { buehne.classList.remove('c6s-g-zahlt'); }, ende + 200);
    }
    // „Zu wenig Münzen“: das Glas wackelt, das Tor leuchtet einmal auf. Der Handgriff wird gezeigt, nicht beschrieben.
    var torT = null;
    function torZeigen() {
      if (!C6.ruhig) { try { glasEl.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)', offset: .3 }, { transform: 'rotate(5deg)', offset: .6 }, { transform: 'rotate(0)' }], { duration: 520, easing: 'ease-in-out' }); } catch (x) {} }
      buehne.classList.remove('c6s-g-tor-zeigt'); void torEl.offsetWidth; buehne.classList.add('c6s-g-tor-zeigt');
      clearTimeout(torT); torT = setTimeout(function () { buehne.classList.remove('c6s-g-tor-zeigt'); }, C6.ruhig ? 2400 : 2600);
    }
    // Lebenszeichen nach einer Änderung: das Vorderrad dreht ein Stück und kommt zur Ruhe. Einmal, nie von selbst.
    function nachdrehen() {
      if (C6.ruhig) return;
      var g = svg.querySelector('.c6s-r-vorne'); if (!g) return;
      try { g.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(34deg)', offset: .55 }, { transform: 'rotate(28deg)', offset: .8 }, { transform: 'rotate(30deg)' }], { duration: 1500, easing: 'cubic-bezier(.2,.7,.3,1)' }); } catch (e) {}
    }
    // Der Spiegel ist das Publikum: Ist am Rad etwas neu, schaut Carl es mit dir an. Einmal je neuem Teil.
    var neuAmRad = null;
    function spiegelSchaut() {
      var n = neuAmRad; neuAmRad = null;
      if (!n || C6.jetzt !== 'fahrrad' || aktiv || schrankOffen()) return;
      var schl = n.art + ':' + n.id, sah = S().spiegelSah || [];
      if (sah.indexOf(schl) >= 0) return;
      aendern(function (s) { s.spiegelSah = (s.spiegelSah || []).concat([schl]).slice(-80); });
      var K = katalog()[n.art], name = ''; if (K) K.teile.forEach(function (x) { if (x.id === n.id) name = x.name; });
      var t = NACH[n.teil] || null;
      var sp = schrankPlatz.querySelector('.c6s-g-spiegel'), gl = sp && sp.querySelector('.c6s-l-glas');
      if (gl && !C6.ruhig) { try { gl.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.18)', offset: .3 }, { filter: 'brightness(1)' }], { duration: 900, easing: 'ease-out' }); } catch (e) {} }
      try {
        if (ctl) {
          var p = teilMitte(n.teil);
          ctl.schau && ctl.schau(p.x, p.y);
          ctl.stimmung && ctl.stimmung('staunt');
          setTimeout(function () { try { if (sp && ctl.schau) { var r = sp.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height * .4); } ctl.stimmung('froh'); } catch (e) {} }, 1100);
          setTimeout(function () { try { ctl.schau(); ctl.stimmung('ruhig'); } catch (e) {} }, 2600);
        }
      } catch (e) {}
      if (t && name) { try { C6.sag('Neu ' + t.am + ': ' + name + '. Der Spiegel und ich haben es gesehen.'); } catch (e) {} }
    }

    // ---------- „Wie geht das?“: Halten sagt in einem Satz, was das Ding tut. Halten öffnet nie etwas. ----------
    var gehaltenBis = 0;
    function ding(el, id, text) {
      if (!el || typeof C6.halten !== 'function' || !C6.staunen || typeof C6.staunen.sag !== 'function') return;
      try {
        if (typeof C6.staunen.text === 'function') C6.staunen.text(id, text);
        C6.halten(el, function () { gehaltenBis = Date.now() + 700; if (aktiv && el === radBox) return; try { C6.staunen.sag(id, text); } catch (e) {} });
      } catch (e) {}
    }
    // der Klick, der auf ein Halten folgt, erreicht kein Ding in der Garage (auch nicht die, deren Tipp ein anderes Modul hört)
    buehne.addEventListener('click', function (e) { if (Date.now() < gehaltenBis) { gehaltenBis = 0; e.stopPropagation(); e.preventDefault(); } }, true);
    ding(radBox, 'garage.rad', 'Jeder Punkt am Rad ist ein Teil. Was du wählst, siehst du sofort am Rad.');
    ding(glasEl, 'garage.glas', 'Im Glas liegt, was du im Kieselpark gesammelt hast. Nichts anderes.');
    ding(torEl, 'garage.tor', 'Durchs Tor geht es in den Kieselpark. Dort fährst du und sammelst Münzen.');
    ding(tafelEl, 'garage.tafel', 'Die Tafel zeigt, was uns beide klüger macht. Münzen gibt es fürs Verstehen, nie fürs bloße Ja.');
    ding(ufoEl, 'garage.ufo', 'Das UFO ist ein Zeichen. Es wacht auf, wenn dein Rechner mir einmal Hallo sagt.');
    ding(schrankPlatz.querySelector('.c6s-g-spiegel'), 'garage.spiegel', 'Der Spiegel schaut mit, wenn an deinem Rad etwas neu ist. Und er hilft mir beim Anziehen.');

    // Wartezeit: ein Vogel landet auf dem Zaun, Carl schraubt ein bisschen, der Schlüssel wackelt
    var vogel = buehne.querySelector('.c6s-f-vogel'), vogelDa = false, schraubt = false;
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
      if (schraubt || !ctl || aktiv) return; schraubt = true;
      if (!ctl.gewohnheiten) { try { ctl.stimmung('arbeitet'); zeigeBlick('kette'); } catch (e) {} }
    }
    function schraubenAus() {
      if (!schraubt) return; schraubt = false;
      if (ctl && !ctl.gewohnheiten) { try { ctl.stimmung('ruhig'); } catch (e) {} }
    }
    // ---------- Raum vermessen: eine Naht zwischen Wand und Boden, alles steht darauf ----------
    function setze(el, l, u, b, hh) {
      if (!el) return;
      el.style.left = Math.round(l) + 'px'; el.style.bottom = Math.round(u) + 'px'; el.style.width = Math.round(b) + 'px';
      if (hh != null) el.style.height = Math.round(hh) + 'px';
    }
    var carlMitte = 0, spiegelBild = 0;
    function groesse() {
      var h = szene.clientHeight, w = szene.clientWidth;
      if (!h || !w) return;
      var pc = C6.geraet === 'computer', sa = schrankOffen(), ba = !!aktiv;
      var bw, bh, naht, cs, cx, lx;
      // Carl steht immer am Boden links neben dem Spiegel; das Spiegelbild ist so groß wie er (Tiefe 0,85)
      var SP = 0.85;
      if (pc) {
        bw = Math.min(w * 0.48, (h - 8) * 600 / 380 * 0.86); bh = bw * 380 / 600;
        naht = h - Math.max(90, Math.min(h * 0.24, bh * 0.5));
        cs = Math.round(Math.max(130, Math.min(h * 0.3, 220)));
        setze(radBox, w * 0.01, 0, bw);
        radBox.style.right = 'auto';
        var tb = Math.min(w * 0.27, 320);
        setze(torEl, w * 0.025, h - naht, tb, Math.min(naht * 0.8, tb * 1.25));
        var bb = Math.min(w * 0.3, 340);
        setze(bankEl, w * 0.5 - bb / 2, h - naht - 2, bb);
        var sb = Math.min(w * 0.17, 210);
        setze(schrankPlatz.querySelector('.c6s-g-schrank'), w * 0.985 - sb, h - naht - 16, sb);
        if (heftEl) { var hb = Math.max(44, Math.min(64, sb * 0.3)); setze(heftEl, w * 0.985 - sb - hb - 6, h - naht - 14, hb); }
        var gb = cs * SP, gl = w * 0.985 - sb - gb - w * 0.008;
        setze(schrankPlatz.querySelector('.c6s-g-spiegel'), gl, h - naht - 26, gb);
        cx = gl - cs * 0.3;
        lx = w * 0.5;
        carlBox.style.bottom = Math.round(h - naht - 34) + 'px';
      } else {
        bw = Math.min(w * 0.96, (h - 30) * 600 / 380 * 0.62); bh = bw * 380 / 600;
        if (ba) { bw = Math.min(w * 0.96, (h - 30) * 600 / 380); bh = bw * 380 / 600; }
        naht = sa ? h - 40 : h - bh - 8;
        cs = sa ? Math.round(Math.max(100, Math.min(h * 0.42, 140))) : Math.round(Math.max(90, Math.min(naht * 0.36, 130)));
        setze(radBox, (w - bw) / 2, 10, bw);
        radBox.style.right = 'auto';
        var tbi = w * 0.3;
        setze(torEl, w * 0.02, h - naht, tbi, Math.min(naht * 0.78, tbi * 1.9));
        var bbi = w * 0.38;
        setze(bankEl, w * 0.33 - bbi / 2 + w * 0.12, h - naht - 1, bbi);
        var sbi = sa ? w * 0.34 : w * 0.27;
        setze(schrankPlatz.querySelector('.c6s-g-schrank'), w * 0.99 - sbi, h - naht - 4, sbi);
        if (heftEl) { var hbi = Math.max(44, Math.min(56, sbi * 0.4)); setze(heftEl, w * 0.99 - sbi - hbi - 2, h - naht - 2, hbi); }
        var gbi = cs * SP, gli = w * 0.99 - sbi - gbi - 2;
        setze(schrankPlatz.querySelector('.c6s-g-spiegel'), gli, h - naht - (sa ? 12 : 10), gbi);
        cx = gli - cs * 0.3;
        lx = w * 0.5;
        carlBox.style.bottom = Math.round(h - naht - (sa ? 16 : 24)) + "px";
      }
      spiegelBild = Math.round(cs * SP);
      radBox.style.width = Math.round(Math.max(200, bw)) + 'px';
      carlMitte = cx;
      carlBox.style.left = Math.round(cx) + 'px';
      // Raum-Ebene (ganze Bühne): Naht und Lampe in Bühnen-Pixeln
      var br = buehne.getBoundingClientRect(), sr = szene.getBoundingClientRect();
      var nahtB = sr.top - br.top + naht, lxB = sr.left - br.left + lx, lyB = Math.max(sr.top - br.top + 30, sr.top - br.top + naht * (pc ? 0.3 : 0.26));
      buehne.style.setProperty('--g-naht', Math.round(nahtB) + 'px');
      buehne.style.setProperty('--g-lx', Math.round(lxB) + 'px');
      buehne.style.setProperty('--g-ly', Math.round(lyB) + 'px');
      lampeEl.style.left = Math.round(lxB) + 'px'; lampeEl.style.height = Math.round(lyB + 22) + 'px';
      lampe.x = br.width ? lxB / br.width : .5; lampe.y = br.height ? lyB / br.height : .2; lampe.px = br.left + lxB;
      // Das UFO hängt schlafend an einer Schnur unter der Decke, rechts von der Lampe: weg von Tor und Schild
      var uw = pc ? Math.round(Math.max(96, Math.min(140, w * 0.11))) : Math.round(Math.max(64, Math.min(84, w * 0.19)));
      var oben = pc ? Math.max(70, naht * 0.16) : Math.max(64, naht * 0.2);
      ufoEl.style.width = uw + 'px'; ufoEl.style.left = Math.round(w * (pc ? 0.71 : 0.72)) + 'px';
      ufoEl.style.bottom = 'auto'; ufoEl.style.top = Math.round(oben) + 'px';
      // Die Quest-Tafel hängt an einem Nagel: am Computer zwischen Tor und Lampe über der Lochwand, am iPhone über dem Tor
      var tl, tw, tu, frei;
      if (pc) {
        var torR = w * 0.025 + Math.min(w * 0.27, 320), bbT = Math.min(w * 0.3, 340);
        tl = torR + 18; frei = lx - 34 - tl;
        tw = Math.max(96, Math.min(186, frei));
        // unten darf sie die leere obere Lochreihe der Lochwand ein wenig verdecken (der Hammer beginnt tiefer)
        tu = (h - naht - 2) + bbT * 262 / 320 * (1 - 0.07);
        tl += Math.max(0, (frei - tw) / 2);
      } else {
        var torB = w * 0.3, torH = Math.min(naht * 0.78, torB * 1.9);
        tw = Math.min(torB + 14, 150);
        tu = (h - naht) + torH + 10;
        tl = w * 0.02 + (torB - tw) / 2;
      }
      var tPlatz = h - 8 - tu;
      if (tw * 124 / 160 > tPlatz) tw = tPlatz * 160 / 124;
      tafelEl.hidden = tw < 72;
      tafelEl.style.left = Math.round(tl) + 'px'; tafelEl.style.bottom = Math.round(tu) + 'px';
      tafelEl.style.width = Math.round(tw) + 'px'; tafelEl.style.height = Math.round(tw * 124 / 160) + 'px';
      // Das Münzglas steht oben auf Carls Schrank: am iPhone und am Computer sichtbar, auch bei offenem Schrank
      var sEl = schrankPlatz.querySelector('.c6s-g-schrank');
      if (sEl) {
        var sl = parseFloat(sEl.style.left) || 0, su = parseFloat(sEl.style.bottom) || 0, sw = parseFloat(sEl.style.width) || 100;
        // sichtbar so groß wie es zum Schrank passt, antippbar mindestens 44 × 44
        var gw = Math.max(30, Math.min(52, sw * 0.24));
        glasEl.style.width = Math.round(Math.max(44, gw)) + 'px';
        glasEl.style.height = Math.round(Math.max(44, gw / 0.75)) + 'px';
        glasEl.style.setProperty('--c6s-glas-w', Math.round(gw) + 'px');
        // iPhone mit offenem Blatt: der Schrank ist weg, das Glas steht dann unten rechts an der Wand (sichtbar nur beim Zahlen)
        glasEl.style.top = '';
        if (!pc && ba) { glasEl.style.left = Math.round(w * 0.88) + 'px'; glasEl.style.bottom = 'auto'; glasEl.style.top = Math.round(Math.max(4, radBox.offsetTop + radBox.offsetHeight * 0.08 - 44)) + 'px'; }
        glasEl.style.left = Math.round(sl + sw * 0.66) + 'px';
        glasEl.style.bottom = Math.round(su + sw * 300 / 230 * (286 / 300) - 2) + 'px';
      }
      if (schrank) schrank.groesse(spiegelBild);
      if (!ctl) return;
      ctl.groesse(cs);
      try { licht(); } catch (e) {}
    }

    // ---------- Carls Schrank (rechts) ----------
    function schrankOffen() { return !!(schrank && schrank.offen); }
    var schrank;
    function wandern(fn, ms) {
      // vorher/nachher messen, dann läuft Carl den Weg (die Figur geht, der Kasten springt)
      var vor = carlMitte; fn();
      if (!ctl) return;
      var d = vor - carlMitte;
      if (Math.abs(d) < 4 || C6.ruhig) { try { ctl.geh(0, 0, { skala: 1, y: 0 }); } catch (e) {} return; }
      try { ctl.geh(d, 0, { skala: 1, y: 0 }); ctl.geh(0, ms || 760, { skala: 1, y: 0 }); } catch (e) {}
    }
    function schrankAuf(reihe) {
      if (!schrank) return;
      if (aktiv) schliesse(true);
      if (tafelOffen) tafelZu(true);
      var war = schrank.offen;
      wandern(function () { buehne.classList.add('c6s-g-schrank-auf'); schrank.auf(reihe); groesse(); });
      if (!war) { try { kleidBlatt.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: C6.ruhig ? 0 : 260, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
      setTimeout(function () { try { var r = schrankPlatz.querySelector('.c6s-g-spiegel').getBoundingClientRect(); ctl && ctl.schau && ctl.schau(r.left + r.width / 2, r.top + r.height * .4); setTimeout(function () { try { ctl.schau(); } catch (e) {} }, 1400); } catch (e) {} }, 800);
    }
    function schrankZu(still) {
      if (!schrankOffen()) return;
      schrank.zu();
      wandern(function () { buehne.classList.remove('c6s-g-schrank-auf'); groesse(); }, still ? 0 : 760);
    }

    if (C6.bus) {
      C6.bus.on('rad', function (d) { if (d && d.was === 'teil' && aktiv) return; zeichneAlles(); if (aktiv && d && (d.was === 'lohn' || d.was === 'zu')) malBlatt(); });
      C6.bus.on('kleid', function (o) { try { ctl && ctl.kleid(o); } catch (e) {} });
      C6.bus.on('tastatur', function () { requestAnimationFrame(untenMessen); });
      C6.bus.on('tageszeit', function () { try { licht(); } catch (e) {} });
      C6.bus.on('muenzen', function () { if (aktiv && C6.jetzt === 'fahrrad') { var hw = blatt.querySelector('.c6s-f-hinweis'); if (hw && hw.hidden) malBlatt(); } });
      C6.bus.on('warte', function (d) { if (C6.jetzt !== 'fahrrad' || !d || (C6.kieselpark && C6.kieselpark.offen)) return; if (d.stufe === 2) { vogelLandet(); schraubenAn(); } });
      C6.bus.on('wach', function () { if (C6.jetzt !== 'fahrrad') return; vogelWeg(); schraubenAus(); });
      C6.bus.on('muenzen', glasMalen);
    }
    window.addEventListener('resize', function () { setTimeout(untenMessen, 150); });
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(function () { groesse(); }) : null;
    if (ro) ro.observe(szene);
    zeichneAlles();
    var erstesMal = true;

    // Für Prüfungen und andere Räume
    C6.fahrrad = { schrank: { auf: function (reihe) { if (C6.jetzt !== 'fahrrad') C6.geh('fahrrad', { schrank: true, reihe: reihe }); else schrankAuf(reihe); }, zu: function () { schrankZu(); }, get offen() { return schrankOffen(); } }, oeffne: function (id) { if (C6.jetzt !== 'fahrrad') C6.geh('fahrrad'); setTimeout(function () { oeffne(id); }, C6.jetzt === 'fahrrad' ? 0 : 500); }, schliesse: function () { schliesse(); }, get offen() { return aktiv; }, punkt: punktVon, teile: TEILE,
      tafel: { auf: function () { if (C6.jetzt !== 'fahrrad') C6.geh('fahrrad', { tafel: true }); else tafelAuf(); }, zu: function () { tafelZu(); }, get offen() { return tafelOffen; }, quests: questListe } };

    return {
      betreten: function (o) {
        o = o || {};
        figur();
        if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'fahrrad');
        try { ctl && ctl.kleid(C6.laden ? C6.laden.an() : {}); } catch (e) {}
        zeichneAlles();
        buehne.classList.add('c6s-sichtbar'); buehne.classList.remove('c6s-ruht');
        untenMessen(); setTimeout(untenMessen, 400);
        groesse(); licht();
        if (o.ufoWach) setTimeout(ufoWacht, C6.ruhig ? 0 : 500);
        if (o.schrank) schrankAuf(o.reihe);
        else if (schrankOffen()) schrankZu(true);
        glasMalen(); tafelMalen();
        if (o.tafel) setTimeout(tafelAuf, C6.ruhig ? 0 : 350);
        if (o.teil && NACH[o.teil]) setTimeout(function () { oeffne(o.teil); }, 350);
        if (erstesMal && !o.rundgang && !(C6.rundgang && C6.rundgang.an)) {
          erstesMal = false;
          if (!S().radGesehen) {
            aendern(function (s) { s.radGesehen = Date.now(); });
            setTimeout(function () {
              if (C6.jetzt !== 'fahrrad' || aktiv) return;
              try { C6.sag(satz('garage.rad.erst', 'Dein Rad. Tipp es an.')); } catch (e) {}
            }, 600);
          } else if (!S().garageGesehen && !o.schrank) {
            aendern(function (s) { s.garageGesehen = Date.now(); });
            setTimeout(function () {
              if (C6.jetzt !== 'fahrrad' || aktiv) return;
              try { C6.sag(satz('garage.erst', 'Meine Garage. Rechts steht mein Schrank, und durchs Tor geht es in den Kieselpark.')); } catch (e) {}
            }, 600);
          }
        }
      },
      verlassen: function () { buehne.classList.remove('c6s-sichtbar'); buehne.classList.add('c6s-ruht'); schliesse(true); schrankZu(true); tafelZu(true); vogelWeg(); schraubenAus(); wach(false); },
      groesse: groesse
    };
  }
});
