// Kleiderladen · Carl probiert an
var C6 = window.C6 = window.C6 || {};

function S() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(fn);
  else { fn(S()); try { C6.speichern && C6.speichern(); } catch (e) {} }
}
function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function satz(k, rueck) { try { var t = C6.stimme && C6.stimme.sag(k); if (t) return t; } catch (e) {} return rueck; }

var T = '#2b2722', SW = 'stroke="' + T + '" stroke-width=".12" stroke-linejoin="round" stroke-linecap="round"';
function ton(hex, amt) {
  var m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return hex;
  var n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function k(v) { return Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt)))); }
  return '#' + ((1 << 24) + (k(r) << 16) + (k(g) << 8) + k(b)).toString(16).slice(1);
}
var FARBWORT = { rot: '#c8463d', blau: '#4f7cac', hellblau: '#8db4d6', dunkelblau: '#2f4b7c', gruen: '#6f9a5b', 'grün': '#6f9a5b', gelb: '#e2b93b', orange: '#e0813a', lila: '#8a6bb0', violett: '#8a6bb0', rosa: '#e39aae', pink: '#d96a95', schwarz: '#2f2b28', weiss: '#f3efe8', 'weiß': '#f3efe8', grau: '#9a948b', braun: '#8a5f3f', 'türkis': '#3fa3a0', tuerkis: '#3fa3a0', beige: '#d8c3a0', senf: '#c9a03a' };
function lieblingsfarbe() {
  var v = S().du && S().du.socken;
  if (typeof v === 'string') { if (/^#[0-9a-f]{6}$/i.test(v)) return v; var w = FARBWORT[v.trim().toLowerCase()]; if (w) return w; }
  return '#5d86b0';
}

// ---------- Zeichnungen (Einheit m, Ursprung = Anker) ----------
function socke(f, innen, bund) {
  var d = ton(f, -0.2);
  return '<g>' +
    '<path d="M-.55 -2.05H.55V-.62H-.55Z" fill="' + f + '" ' + SW + '/>' +
    '<ellipse cx="0" cy="-.45" rx=".88" ry=".48" fill="' + f + '" ' + SW + '/>' +
    '<rect x="-.49" y="-.9" width=".98" height=".5" fill="' + f + '"/>' +
    (innen || '') +
    '<rect x="-.62" y="-2.12" width="1.24" height="' + (bund || .38) + '" rx=".08" fill="' + d + '" ' + SW + '/>' +
    '</g>';
}
function ringel(f2) { var s = ''; [-1.55, -1.12].forEach(function (y) { s += '<rect x="-.49" y="' + y + '" width=".98" height=".22" fill="' + f2 + '"/>'; }); return s + '<path d="M-.84 -.42Q0 -.2 .84 -.42" fill="none" stroke="' + f2 + '" stroke-width=".2"/>'; }
function punkte(f2) { return [[-.22, -1.5], [.22, -1.15], [-.2, -.8], [.32, -.55], [-.5, -.42], [.1, -.32]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".11" fill="' + f2 + '"/>'; }).join(''); }
function sternchen(f2) { return [[-.2, -1.45], [.22, -1.0], [-.5, -.45], [.4, -.42]].map(function (p) { return '<path d="M' + p[0] + ' ' + (p[1] - .17) + 'L' + (p[0] + .05) + ' ' + (p[1] - .05) + 'L' + (p[0] + .17) + ' ' + p[1] + 'L' + (p[0] + .05) + ' ' + (p[1] + .05) + 'L' + p[0] + ' ' + (p[1] + .17) + 'L' + (p[0] - .05) + ' ' + (p[1] + .05) + 'L' + (p[0] - .17) + ' ' + p[1] + 'L' + (p[0] - .05) + ' ' + (p[1] - .05) + 'Z" fill="' + f2 + '"/>'; }).join(''); }
function zehen(fs) {
  var s = '', xs = [-.62, -.31, 0, .31, .62];
  xs.forEach(function (x, i) { s += '<ellipse cx="' + x + '" cy="-.2" rx=".19" ry=".22" fill="' + fs[i % fs.length] + '" ' + SW.replace('.12', '.09') + '/>'; });
  return s;
}
function wolle(f) {
  var d = ton(f, -0.22), s = '<rect x="-.7" y="-2.25" width="1.4" height=".72" rx=".16" fill="' + d + '" ' + SW + '/>';
  [-.42, -.14, .14, .42].forEach(function (x) { s += '<path d="M' + x + ' -2.12V-1.66" stroke="' + ton(f, 0.25) + '" stroke-width=".07" stroke-linecap="round"/>'; });
  return s;
}

// Mützen: Ursprung = Kuppe am Stiel, der Körper ist 0,3 m weiter links mittig
function beanie(f, ripp) {
  var d = ton(f, -0.18);
  var s = '<path d="M-3.6 1.6C-3.75 -.55 -1.9 -.8 -.3 -.8C1.4 -.8 3.15 -.55 3.05 1.45Q-.3 1.95 -3.6 1.6Z" fill="' + f + '" ' + SW + '/>' +
    '<path d="M-3.62 1.62Q-.3 2.02 3.07 1.46L3.0 .86Q-.3 1.36 -3.56 1.0Z" fill="' + d + '" ' + SW + '/>';
  if (ripp) for (var x = -3.1; x < 2.8; x += .48) s += '<path d="M' + x.toFixed(2) + ' ' + (1.12 + .1 * Math.cos(x / 3)).toFixed(2) + 'v.42" stroke="' + ton(f, 0.3) + '" stroke-width=".07" stroke-linecap="round"/>';
  return s;
}
function zipfel(f) {
  return '<path d="M-2.4 -.2C-3.2 -1.6 -4.6 -2.4 -5.4 -1.2C-4.7 -1.6 -3.9 -1.0 -3.5 .4Z" fill="' + f + '" ' + SW + '/>' + beanie(f, false) +
    '<circle cx="-5.4" cy="-1.15" r=".5" fill="#fbf7f0" ' + SW + '/>';
}
function sonnenhut(f) {
  var d = ton(f, -0.2);
  return '<ellipse cx="-.3" cy="1.05" rx="4.9" ry=".85" fill="' + f + '" ' + SW + '/>' +
    '<path d="M-2.7 1.1C-2.9 -.6 -1.6 -1.05 -.3 -1.05C1.0 -1.05 2.3 -.6 2.1 1.05Q-.3 1.45 -2.7 1.1Z" fill="' + f + '" ' + SW + '/>' +
    '<path d="M-2.75 .62Q-.3 1.0 2.15 .58L2.14 1.04Q-.3 1.45 -2.72 1.1Z" fill="#b8333a" ' + SW + '/>' +
    '<path d="M-4.2 1.25Q-.3 1.75 3.6 1.2" fill="none" stroke="' + d + '" stroke-width=".08"/>';
}
function schieber(f) {
  var d = ton(f, -0.2);
  return '<path d="M1.2 1.15Q3.6 .9 4.5 1.55Q3.0 2.0 1.0 1.75Z" fill="' + d + '" ' + SW + '/>' +
    '<path d="M-3.55 1.55C-3.7 .1 -2.0 -.45 -.2 -.5C1.8 -.55 3.3 .1 3.1 1.35Q-.3 1.85 -3.55 1.55Z" fill="' + f + '" ' + SW + '/>' +
    '<path d="M-2.6 .6Q-.4 -.1 2.2 .5" fill="none" stroke="' + ton(f, 0.25) + '" stroke-width=".08"/>';
}
function baske(f) {
  return '<g transform="rotate(-9 -.4 .2)"><ellipse cx="-.6" cy=".25" rx="3.9" ry="1.15" fill="' + f + '" ' + SW + '/>' +
    '<path d="M-3.9 .6Q-.6 1.6 2.7 .6" fill="none" stroke="' + ton(f, -0.25) + '" stroke-width=".1"/></g>';
}

// Schal: Ursprung = unteres Körperdrittel
function schal(f, f2, art) {
  var d = ton(f, -0.18);
  var band = '<path d="M-3.35 -.6Q0 -.15 3.35 -.8L3.42 .42Q0 .95 -3.35 .55Z" fill="' + f + '" ' + SW + '/>';
  var deko = '';
  if (art === 'streifen') for (var x = -2.7; x < 3.1; x += 1.1) deko += '<path d="M' + x.toFixed(2) + ' ' + (-.4 - x * .03).toFixed(2) + 'L' + (x + .1).toFixed(2) + ' ' + (.68 - x * .03).toFixed(2) + '" stroke="' + f2 + '" stroke-width=".34"/>';
  if (art === 'wolle') for (var y = -.2; y < .5; y += .28) deko += '<path d="M-3.1 ' + (y + .03).toFixed(2) + 'Q0 ' + (y + .42).toFixed(2) + ' 3.1 ' + (y - .14).toFixed(2) + '" fill="none" stroke="' + ton(f, 0.28) + '" stroke-width=".06"/>';
  var enden = '<path d="M1.95 .3L2.65 .2L2.45 2.35L1.75 2.35Z" fill="' + d + '" ' + SW + '/>' +
    '<path d="M2.55 .25L3.2 .25L3.45 2.05L2.8 2.15Z" fill="' + f + '" ' + SW + '/>' +
    '<path d="M1.85 2.35v.25M2.1 2.35v.28M2.35 2.35v.25M2.9 2.15v.25M3.15 2.12v.27M3.4 2.07v.24" stroke="' + T + '" stroke-width=".07"/>' +
    '<ellipse cx="2.55" cy=".25" rx=".55" ry=".45" fill="' + d + '" ' + SW + '/>';
  if (art === 'tuch') {
    return '<path d="M-3.35 -.45Q0 -.05 3.35 -.65L3.4 .05Q0 .6 -3.35 .3Z" fill="' + f + '" ' + SW + '/>' +
      '<path d="M-1.6 .2L1.5 .05L-.1 1.75Z" fill="' + f + '" ' + SW + '/>' +
      [[-.7, .45], [.4, .4], [-.1, 1.0], [-1.1, .3], [.9, .25]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".1" fill="#fbf7f0"/>'; }).join('');
  }
  return band + deko + enden;
}

// Anker der Figur, live gelesen (die Figur darf sich ändern). Punkte {x,y}, m = Einheit.
function anker(ctl) {
  var a = null;
  try { if (ctl && ctl.anker) a = ctl.anker(); } catch (e) {}
  try { if (!a && C6.figur && C6.figur.anker) a = typeof C6.figur.anker === 'function' ? C6.figur.anker() : C6.figur.anker; } catch (e) {}
  a = a || {};
  function pt(v, d) { if (!v) return d; if (Array.isArray(v)) return { x: +v[0], y: +v[1] }; return { x: +v.x, y: +v.y }; }
  var m = +(a.m || (C6.figur && C6.figur.m)) || 20;
  var G = (C6.figur && C6.figur._G) || {};
  return {
    m: m,
    kopf: pt(a.kopf, { x: 126, y: 80 }), augen: pt(a.augen, { x: 120.5, y: 165.5 }),
    hals: pt(a.hals, { x: 120, y: 204 }), koerper: pt(a.koerper, { x: 120, y: 162 }),
    // halbe Körperbreite und Augenabstand, wenn die Figur sie verrät
    kb: (+G.kb || 80) / m, ab: (G.aug && +G.aug.ab ? G.aug.ab / m : 1.19), hoch: (G.aug && +G.aug.hoch ? G.aug.hoch / m : .15)
  };
}
function f2(v) { return Math.round(v * 100) / 100; }

// Brille: Ursprung = Mitte zwischen den Augen (Augenabstand aus der Figur)
function brille(art, A) {
  A = A || anker();
  var ab = A.ab, dh = A.hoch / 2, AL = [-ab, dh], AR = [ab, -dh];
  var r1 = Math.max(.95, Math.min(1.25, ab * .9)), r2 = r1 * 1.06, br = '';
  function steg(y) { return 'M' + f2(AL[0] + r1 * .95) + ' ' + y + 'Q0 ' + (y - .3) + ' ' + f2(AR[0] - r2 * .95) + ' ' + y; }
  function buegel(y) { return 'M' + f2(AL[0] - r1) + ' ' + y + 'L' + f2(AL[0] - r1 - .7) + ' ' + (y - .3) + 'M' + f2(AR[0] + r2) + ' ' + y + 'L' + f2(AR[0] + r2 + .7) + ' ' + (y - .3); }
  if (art === 'rund') return '<g fill="#fbf7f0" fill-opacity=".14" stroke="' + T + '" stroke-width=".15">' +
    '<ellipse cx="' + f2(AL[0]) + '" cy="' + f2(AL[1]) + '" rx="' + f2(r1) + '" ry="' + f2(r1 + .08) + '"/><ellipse cx="' + f2(AR[0]) + '" cy="' + f2(AR[1]) + '" rx="' + f2(r2) + '" ry="' + f2(r2 + .08) + '"/>' +
    '<path fill="none" d="' + steg(-.45) + buegel(-.1) + '"/></g>';
  if (art === 'sonne') return '<g stroke="' + T + '" stroke-width=".14">' +
    '<path d="M' + f2(AL[0] - r1 - .05) + ' -.85H' + f2(AL[0] + r1) + 'V.35Q' + f2(AL[0] + r1 - .1) + ' 1.2 ' + f2(AL[0]) + ' 1.2Q' + f2(AL[0] - r1) + ' 1.2 ' + f2(AL[0] - r1 - .05) + ' .35Z" fill="#2b2722" fill-opacity=".62"/>' +
    '<path d="M' + f2(AR[0] - r2) + ' -.95H' + f2(AR[0] + r2) + 'V.25Q' + f2(AR[0] + r2 - .05) + ' 1.15 ' + f2(AR[0]) + ' 1.15Q' + f2(AR[0] - r2 + .1) + ' 1.15 ' + f2(AR[0] - r2) + ' .25Z" fill="#2b2722" fill-opacity=".62"/>' +
    '<path fill="none" d="M' + f2(AL[0] + r1) + ' -.65H' + f2(AR[0] - r2) + buegel(-.75) + '"/>' +
    '<path fill="none" stroke="#fbf7f0" stroke-opacity=".6" stroke-width=".1" d="M' + f2(AL[0] - .6) + ' -.55l.4 .35M' + f2(AR[0] - .6) + ' -.65l.4 .35"/></g>';
  if (art === 'lese') return '<g transform="translate(0,-.3)">' + brille('lese0', A) + '</g>';
  if (art === 'lese0') return '<g stroke="' + T + '" stroke-width=".14" fill="#fbf7f0" fill-opacity=".2">' +
    '<path d="M' + f2(AL[0] - r1) + ' .35H' + f2(AL[0] + r1) + 'Q' + f2(AL[0] + r1 - .1) + ' 1.35 ' + f2(AL[0]) + ' 1.35Q' + f2(AL[0] - r1 + .1) + ' 1.35 ' + f2(AL[0] - r1) + ' .35Z"/>' +
    '<path d="M' + f2(AR[0] - r2) + ' .2H' + f2(AR[0] + r2) + 'Q' + f2(AR[0] + r2 - .05) + ' 1.25 ' + f2(AR[0]) + ' 1.25Q' + f2(AR[0] - r2 + .07) + ' 1.25 ' + f2(AR[0] - r2) + ' .2Z"/>' +
    '<path fill="none" d="M' + f2(AL[0] + r1) + ' .35Q0 .1 ' + f2(AR[0] - r2) + ' .2' + buegel(.3) + '"/></g>';
  if (art === 'taucher') { var w = ab + r1 + .4; return '<g>' +
    '<path d="M' + f2(-w) + ' -.3L' + f2(-w - .9) + ' -.1M' + f2(w) + ' -.4L' + f2(w + .9) + ' -.25" stroke="#3f6f9a" stroke-width=".42" stroke-linecap="round"/>' +
    '<ellipse cx="0" cy="0" rx="' + f2(w) + '" ry="1.5" fill="#8db4d6" fill-opacity=".28" stroke="#3f6f9a" stroke-width=".32"/>' +
    '<ellipse cx="0" cy="0" rx="' + f2(w) + '" ry="1.5" fill="none" stroke="' + T + '" stroke-width=".1"/>' +
    '<path d="M' + f2(-w * .7) + ' -.85Q' + f2(-w * .45) + ' -1.15 ' + f2(-w * .22) + ' -1.05" fill="none" stroke="#fbf7f0" stroke-width=".14" stroke-linecap="round"/></g>'; }
  return '';
}

// Jacke + Fellmuster: im Körper (absolute Figur-Koordinaten aus den Ankern), vom Umriss geschnitten
function jacke(f, art, A) {
  A = A || anker();
  // Offene Jacke: zwei Seitenteile rahmen das Gesicht, vorn bleibt Carl frei. Der Umriss schneidet den Rest.
  var d = ton(f, -0.2), l = ton(f, 0.3), m = A.m, X = A.koerper.x, ey = A.augen.y;
  var B = (A.kb + 1.5) * m, oben = ey - 5 * m, unten = Math.max(A.hals.y, ey + 3 * m) + 3 * m;
  var innen = A.ab + 1.25; // Abstand der Vorderkante von der Mitte (m), knapp außerhalb der Augen
  var sw = ' stroke="' + T + '" stroke-width="' + f2(.12 * m) + '" stroke-linejoin="round" stroke-linecap="round"';
  function Y(v) { return f2(ey + v * m); }
  function seite(sg) {
    function x(v) { return f2(X + sg * v * m); }
    var kante = 'M' + x(innen + .9) + ' ' + Y(-4.6) + 'Q' + x(innen - .1) + ' ' + Y(-1.2) + ' ' + x(innen - .5) + ' ' + Y(1.6) + 'L' + x(innen - .6) + ' ' + f2(unten);
    var s = '<path d="M' + f2(X + sg * B) + ' ' + f2(oben) + 'L' + x(innen + .9) + ' ' + Y(-4.6) + 'Q' + x(innen - .1) + ' ' + Y(-1.2) + ' ' + x(innen - .5) + ' ' + Y(1.6) + 'L' + x(innen - .6) + ' ' + f2(unten) + 'L' + f2(X + sg * B) + ' ' + f2(unten) + 'Z" fill="' + f + '"' + sw + '/>';
    // Aufschlag entlang der Vorderkante
    s += '<path d="M' + x(innen + .9) + ' ' + Y(-4.6) + 'Q' + x(innen - .1) + ' ' + Y(-1.2) + ' ' + x(innen - .5) + ' ' + Y(1.6) + 'L' + x(innen + .2) + ' ' + Y(1.2) + 'Q' + x(innen + .7) + ' ' + Y(-1.4) + ' ' + x(innen + 1.7) + ' ' + Y(-4.2) + 'Z" fill="' + d + '"' + sw + '/>';
    if (art === 'regen') s += '<path d="M' + x(innen + .9) + ' ' + Y(.6) + 'h' + f2(sg * 1.3 * m) + 'v' + f2(.9 * m) + 'h' + f2(-sg * 1.3 * m) + 'z" fill="' + d + '"' + sw + '/>';
    if (art === 'strick' && sg < 0) [-1.6, -.4, .8].forEach(function (v) { s += '<circle cx="' + x(innen + .2 - v * .12) + '" cy="' + Y(v) + '" r="' + f2(.2 * m) + '" fill="' + l + '" stroke="' + T + '" stroke-width="' + f2(.07 * m) + '"/>'; });
    if (art === 'daune') [-2.6, -1.2, .2, 1.6].forEach(function (v) { s += '<path d="M' + x(innen + .2) + ' ' + Y(v) + 'Q' + x(innen + 2) + ' ' + Y(v + .35) + ' ' + f2(X + sg * B) + ' ' + Y(v - .2) + '" fill="none" stroke="' + d + '" stroke-width="' + f2(.1 * m) + '"/>'; });
    if (art === 'cord') { var r = ''; for (var v = innen + .9; v < A.kb + 1.5; v += .42) r += 'M' + x(v) + ' ' + Y(-5) + 'L' + x(v - .2) + ' ' + f2(unten); s += '<path d="' + r + '" stroke="' + d + '" stroke-width="' + f2(.07 * m) + '"/>'; if (sg < 0) [-1.2, .4].forEach(function (v) { s += '<circle cx="' + x(innen + .1) + '" cy="' + Y(v) + '" r="' + f2(.2 * m) + '" fill="#8a5f3f" stroke="' + T + '" stroke-width="' + f2(.07 * m) + '"/>'; }); }
    return s + '<path d="' + kante + '" fill="none"' + sw + '/>';
  }
  return seite(-1) + seite(1);
}
function fellMuster(art, f, A) {
  A = A || anker();
  var k = A.kb / 4.2, m = A.m;
  var s = '<g transform="translate(' + f2(A.koerper.x) + ',' + f2(A.koerper.y) + ') scale(' + f2(m * k) + ')" fill="' + f + '" fill-opacity=".38">';
  if (art === 'sprenkel') [[-2.4, -2.1], [-.9, -2.9], [1.0, -2.4], [2.7, -1.6], [-3.3, -.4], [3.4, .1], [-2.6, 1.2], [2.6, 1.5], [-.6, -1.6], [.9, -3.3], [-1.6, -.2]].forEach(function (p, i) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (.16 + (i % 3) * .07) + '"/>'; });
  if (art === 'streifen') [-3.2, -2.0, -.8, .4, 1.6, 2.8].forEach(function (x) { s += '<path d="M' + x + ' -4.2Q' + (x + .5) + ' -2 ' + (x - .1) + ' 0Q' + (x - .5) + ' 1.6 ' + (x + .2) + ' 3.5L' + (x + .55) + ' 3.5Q' + (x + .05) + ' 1.6 ' + (x + .4) + ' 0Q' + (x + .9) + ' -2 ' + (x + .35) + ' -4.2Z"/>'; });
  if (art === 'flecken') s += '<path d="M-3.9 -1.6C-3.2 -2.6 -1.6 -2.4 -1.8 -1.4C-2 -.5 -3.2 -.2 -3.8 -.8Z"/><path d="M1.2 -3.8C2.4 -3.9 3.2 -2.9 2.6 -2.2C2 -1.6 .8 -2.1 .9 -3.0Z"/><path d="M2.6 .6C3.4 .2 4.2 1.0 3.8 1.8C3.4 2.4 2.4 2.0 2.4 1.3Z"/>';
  return s + '</g>';
}

// Wimpern: Ursprung = Augenmitte, fürs rechte Auge gezeichnet (außen = +x, oben = −y), Einheit m
var AUGE = { rx: .74, ry: .82 };
function wimper(grad, len, krumm, farbe, w, unten) {
  var rx = AUGE.rx + .02, ry = AUGE.ry + .02, th = grad * Math.PI / 180;
  var x = rx * Math.sin(th), y = (unten ? 1 : -1) * ry * Math.cos(th);
  var nx = x / (rx * rx), ny = y / (ry * ry), nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
  var dr = (unten ? 1 : -1) * krumm, cx = nx * Math.cos(dr) - ny * Math.sin(dr), cy = nx * Math.sin(dr) + ny * Math.cos(dr);
  var ex = x + cx * len, ey = y + cy * len;
  return '<path d="M' + f2(x) + ' ' + f2(y) + 'Q' + f2(x + cx * len * .45 + .05) + ' ' + f2(y + cy * len * .6) + ' ' + f2(ex) + ' ' + f2(ey) + '" fill="none" stroke="' + (farbe || T) + '" stroke-width="' + (w || .11) + '" stroke-linecap="round"/>';
}
function wimpernSvg(art) {
  if (art === 'lang') return [24, 46, 68].map(function (g, i) { return wimper(g, [.42, .56, .48][i], .38); }).join('');
  if (art === 'dicht') return [14, 30, 46, 62, 78].map(function (g) { return wimper(g, .3, .3, null, .1); }).join('');
  if (art === 'schwung') return wimper(56, .62, .7, null, .12) + wimper(76, .5, .8, null, .11);
  if (art === 'oben-unten') return [26, 47, 68].map(function (g) { return wimper(g, .32, .32); }).join('') + [52, 72].map(function (g) { return wimper(g, .18, .2, null, .08, true); }).join('');
  if (art === 'bunt') return [18, 34, 50, 66, 82].map(function (g, i) { return wimper(g, .4, .4, ['#c8463d', '#e2b93b', '#6f9a5b', '#4f7cac', '#8a6bb0'][i], .12); }).join('');
  return [26, 47, 68].map(function (g, i) { return wimper(g, [.26, .32, .28][i], .32); }).join('');
}

// ---------- Gefährte: worin Carl sitzt, wenn er oben ist (Einheit m, Ursprung = Anker koerper, y nach unten) ----------
// Jedes Stück ist eine Einheit derselben Serie: gleiche Sitzhöhe (+3,3 m = Körperboden im Sitzen), gleiche Tusche,
// gleicher Schwebe-Takt. Nur das Ding wechselt. `hinten` liegt hinter Körper und Beinchen, `vorn` vor den Beinchen.
var GW = ' stroke="' + T + '" stroke-width=".12" stroke-linejoin="round" stroke-linecap="round"';
function gefCouch() {
  var f = '#c9805a', s = '#dc966d', h = '#e8b08c';
  return {
    hinten: '<g>' +
      '<path d="M-6.6 3.4C-7 .2 -4.2 -1.7 0 -1.7C4.2 -1.7 7 .2 6.6 3.4Z" fill="' + f + '"' + GW + '/>' +
      '<path d="M-4.6 .4C-3 -.7 -1.4 -1 .2 -.95" fill="none" stroke="' + h + '" stroke-width=".4" stroke-linecap="round" opacity=".6"/>' +
      '<circle cx="0" cy=".9" r=".32" fill="#8ea37a"' + GW.replace('.12', '.1') + '/>' +
      '<path d="M-6.4 3.1C-6.4 2.5 -5.6 2.4 -4.4 2.6L4.4 2.6C5.6 2.4 6.4 2.5 6.4 3.1L6.4 4.4C6.4 4.9 6 5.1 5.4 5.1L-5.4 5.1C-6 5.1 -6.4 4.9 -6.4 4.4Z" fill="' + s + '"' + GW + '/>' +
      '<path d="M-4.6 3.2C-1.6 3.05 1.6 3.05 4.6 3.2" fill="none" stroke="#f0bf9c" stroke-width=".3" stroke-linecap="round" opacity=".7"/>' +
      '<defs><linearGradient id="c6s-gfe-l" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".2"/><stop offset=".6" stop-color="#2b2722" stop-opacity="0"/></linearGradient><linearGradient id="c6s-gfe-r" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".2"/><stop offset=".6" stop-color="#2b2722" stop-opacity="0"/></linearGradient><linearGradient id="c6s-gfe-u" x1="0" x2="0" y1="0" y2="1"><stop offset=".35" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".22"/></linearGradient></defs>' + '<path class="c6s-gf-eigen c6s-gf-eigen-l" d="M-6.6 3.4C-7 .2 -4.2 -1.7 0 -1.7C4.2 -1.7 7 .2 6.6 3.4L6.4 3.1C6.4 2.5 5.6 2.4 4.4 2.6L-4.4 2.6C-5.6 2.4 -6.4 2.5 -6.4 3.1L-6.4 4.4C-6.4 4.9 -6 5.1 -5.4 5.1L5.4 5.1C6 5.1 6.4 4.9 6.4 4.4Z" fill="url(#c6s-gfe-l)"/><path class="c6s-gf-eigen c6s-gf-eigen-r" d="M-6.6 3.4C-7 .2 -4.2 -1.7 0 -1.7C4.2 -1.7 7 .2 6.6 3.4L6.4 3.1C6.4 2.5 5.6 2.4 4.4 2.6L-4.4 2.6C-5.6 2.4 -6.4 2.5 -6.4 3.1L-6.4 4.4C-6.4 4.9 -6 5.1 -5.4 5.1L5.4 5.1C6 5.1 6.4 4.9 6.4 4.4Z" fill="url(#c6s-gfe-r)"/><path class="c6s-gf-eigen c6s-gf-eigen-u" d="M-6.6 3.4C-7 .2 -4.2 -1.7 0 -1.7C4.2 -1.7 7 .2 6.6 3.4L6.4 3.1C6.4 2.5 5.6 2.4 4.4 2.6L-4.4 2.6C-5.6 2.4 -6.4 2.5 -6.4 3.1L-6.4 4.4C-6.4 4.9 -6 5.1 -5.4 5.1L5.4 5.1C6 5.1 6.4 4.9 6.4 4.4Z" fill="url(#c6s-gfe-u)"/>' +
      '</g>',
    vorn: '<g>' +
      '<path d="M-7.6 3.2C-7.8 1.6 -6.8 1 -5.6 1.2C-4.6 1.4 -4.4 2.4 -4.6 3.6C-4.8 4.6 -5.4 5.1 -6.2 5.1C-7.2 5.1 -7.6 4.4 -7.6 3.2Z" fill="' + f + '"' + GW + '/>' +
      '<path d="M7.6 3.2C7.8 1.6 6.8 1 5.6 1.2C4.6 1.4 4.4 2.4 4.6 3.6C4.8 4.6 5.4 5.1 6.2 5.1C7.2 5.1 7.6 4.4 7.6 3.2Z" fill="' + f + '"' + GW + '/>' +
      '<path d="M-7 2C-6.7 1.6 -6.2 1.5 -5.7 1.6M5.7 1.6C6.2 1.5 6.7 1.6 7 2" fill="none" stroke="' + h + '" stroke-width=".26" stroke-linecap="round" opacity=".6"/>' +
      '</g>',
    sitz: { dy: .7, beine: 'baumeln' }, schwebt: true
  };
}
function gefUfo() {
  var lichter = [-3.4, 0, 3.4].map(function (x, i) {
    return '<circle cx="' + x + '" cy="5.05" r=".8" fill="#f0a830" opacity=".28" class="c6s-gf-licht" style="animation-delay:' + (i * 1.3) + 's"/>' +
      '<circle cx="' + x + '" cy="5.05" r=".36" fill="#f0a830"' + GW.replace('.12', '.09') + '/>';
  }).join('');
  return {
    hinten: '<g>' +
      '<path d="M-6.2 3.2A6.2 6.2 0 0 1 6.2 3.2Z" fill="#dbe7f0" fill-opacity=".34"' + GW + '/>' +
      '<path d="M-4.9 1.2C-4.2 -.9 -2.8 -2 -1.2 -2.6" fill="none" stroke="#fff" stroke-width=".26" stroke-linecap="round" opacity=".75"/>' +
      '<ellipse cx="0" cy="3.6" rx="8" ry="1.7" fill="#fbf7f0"' + GW + '/>' +
      '<defs><linearGradient id="c6s-gfe-l" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".2"/><stop offset=".6" stop-color="#2b2722" stop-opacity="0"/></linearGradient><linearGradient id="c6s-gfe-r" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".2"/><stop offset=".6" stop-color="#2b2722" stop-opacity="0"/></linearGradient><linearGradient id="c6s-gfe-u" x1="0" x2="0" y1="0" y2="1"><stop offset=".35" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".22"/></linearGradient></defs>' + '<path class="c6s-gf-eigen c6s-gf-eigen-l" d="M-6.2 3.2A6.2 6.2 0 0 1 6.2 3.2Z" fill="url(#c6s-gfe-l)"/><path class="c6s-gf-eigen c6s-gf-eigen-r" d="M-6.2 3.2A6.2 6.2 0 0 1 6.2 3.2Z" fill="url(#c6s-gfe-r)"/><path class="c6s-gf-eigen c6s-gf-eigen-u" d="M-6.2 3.2A6.2 6.2 0 0 1 6.2 3.2Z" fill="url(#c6s-gfe-u)"/>' +
      '</g>',
    vorn: '<g>' +
      '<path d="M-8 3.6A8 1.7 0 0 0 8 3.6C8.2 4.7 6.4 5.65 4.6 5.7L-4.6 5.7C-6.4 5.65 -8.2 4.7 -8 3.6Z" fill="#fbf7f0"' + GW + '/>' +
      '<path d="M-6.6 4.7C-3.4 5.3 3.4 5.3 6.6 4.7C6.2 5.2 5.5 5.6 4.6 5.7L-4.6 5.7C-5.5 5.6 -6.2 5.2 -6.6 4.7Z" fill="#3d3732"/>' +
      '<path d="M-7.2 3.7C-4 4.1 4 4.1 7.2 3.7" fill="none" stroke="#fff" stroke-width=".22" stroke-linecap="round" opacity=".8"/>' +
      lichter + '<path class="c6s-gf-eigen c6s-gf-eigen-l" d="M-8 3.6A8 1.7 0 0 0 8 3.6C8.2 4.7 6.4 5.65 4.6 5.7L-4.6 5.7C-6.4 5.65 -8.2 4.7 -8 3.6Z" fill="url(#c6s-gfe-l)"/><path class="c6s-gf-eigen c6s-gf-eigen-r" d="M-8 3.6A8 1.7 0 0 0 8 3.6C8.2 4.7 6.4 5.65 4.6 5.7L-4.6 5.7C-6.4 5.65 -8.2 4.7 -8 3.6Z" fill="url(#c6s-gfe-r)"/><path class="c6s-gf-eigen c6s-gf-eigen-u" d="M-8 3.6A8 1.7 0 0 0 8 3.6C8.2 4.7 6.4 5.65 4.6 5.7L-4.6 5.7C-6.4 5.65 -8.2 4.7 -8 3.6Z" fill="url(#c6s-gfe-u)"/>' +
      '</g>',
    sitz: { dy: .9, beine: 'weg' }, schwebt: true
  };
}
function gefWolke() {
  var w = '#fbf7f0', sch = '#e9e0d1';
  return {
    hinten: '<g>' +
      '<path d="M-7 4.4C-7.8 3 -6.6 1.6 -5.2 1.9C-5 .2 -3 -.4 -2 .8C-1.2 -.6 1.2 -.6 2 .8C3 -.4 5 .2 5.2 1.9C6.6 1.6 7.8 3 7 4.4C7.4 5.2 6.6 5.6 5.8 5.5L-5.8 5.5C-6.6 5.6 -7.4 5.2 -7 4.4Z" fill="' + w + '"' + GW + '/>' +
      '<path d="M-5.2 2.4C-5.6 3.2 -5.2 4 -4.4 4.3" fill="none" stroke="' + sch + '" stroke-width=".3" stroke-linecap="round"/>' +
      '<defs><linearGradient id="c6s-gfe-l" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".2"/><stop offset=".6" stop-color="#2b2722" stop-opacity="0"/></linearGradient><linearGradient id="c6s-gfe-r" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".2"/><stop offset=".6" stop-color="#2b2722" stop-opacity="0"/></linearGradient><linearGradient id="c6s-gfe-u" x1="0" x2="0" y1="0" y2="1"><stop offset=".35" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".22"/></linearGradient></defs>' + '<path class="c6s-gf-eigen c6s-gf-eigen-l" d="M-7 4.4C-7.8 3 -6.6 1.6 -5.2 1.9C-5 .2 -3 -.4 -2 .8C-1.2 -.6 1.2 -.6 2 .8C3 -.4 5 .2 5.2 1.9C6.6 1.6 7.8 3 7 4.4C7.4 5.2 6.6 5.6 5.8 5.5L-5.8 5.5C-6.6 5.6 -7.4 5.2 -7 4.4Z" fill="url(#c6s-gfe-l)"/><path class="c6s-gf-eigen c6s-gf-eigen-r" d="M-7 4.4C-7.8 3 -6.6 1.6 -5.2 1.9C-5 .2 -3 -.4 -2 .8C-1.2 -.6 1.2 -.6 2 .8C3 -.4 5 .2 5.2 1.9C6.6 1.6 7.8 3 7 4.4C7.4 5.2 6.6 5.6 5.8 5.5L-5.8 5.5C-6.6 5.6 -7.4 5.2 -7 4.4Z" fill="url(#c6s-gfe-r)"/><path class="c6s-gf-eigen c6s-gf-eigen-u" d="M-7 4.4C-7.8 3 -6.6 1.6 -5.2 1.9C-5 .2 -3 -.4 -2 .8C-1.2 -.6 1.2 -.6 2 .8C3 -.4 5 .2 5.2 1.9C6.6 1.6 7.8 3 7 4.4C7.4 5.2 6.6 5.6 5.8 5.5L-5.8 5.5C-6.6 5.6 -7.4 5.2 -7 4.4Z" fill="url(#c6s-gfe-u)"/>' +
      '</g>',
    vorn: '<g>' +
      '<path d="M-5.6 5.1C-6 4 -5 3.2 -3.9 3.5C-3.6 2.4 -2 2.2 -1.4 3.1C-.6 2.2 1 2.2 1.6 3.1C2.3 2.3 3.9 2.5 4.1 3.6C5.2 3.3 6.1 4.1 5.7 5.1C5.9 5.6 5.4 5.9 4.8 5.8L-4.8 5.8C-5.4 5.9 -5.9 5.6 -5.6 5.1Z" fill="' + w + '"' + GW + '/>' +
      '<path d="M-4.2 4.4C-3.2 4 -2.4 4.1 -1.9 4.6M1.1 4.5C2 4 3 4.1 3.6 4.6" fill="none" stroke="' + sch + '" stroke-width=".28" stroke-linecap="round"/>' +
      '</g>',
    sitz: { dy: 1.1, beine: 'weg' }, schwebt: true
  };
}
function gefTasse() {
  var p = '#fbf7f0', tee = '#c88a4a', rosa = '#e7b9a6';
  return {
    hinten: '<g>' +
      '<ellipse cx="0" cy="7" rx="8.2" ry="1.5" fill="' + p + '"' + GW + '/>' +
      '<path d="M-6 2.4C-6.2 5 -4.5 7 0 7C4.5 7 6.2 5 6 2.4Z" fill="' + p + '"' + GW + '/>' +
      '<ellipse cx="0" cy="2.4" rx="6" ry="1.2" fill="#efe7da"' + GW + '/>' +
      '<ellipse cx="0" cy="2.45" rx="5.3" ry=".95" fill="' + tee + '"/>' +
      '<path class="c6s-gf-dampf" d="M-5.2 1.4C-5.9 .6 -5.1 -.2 -5.6 -1.1" fill="none" stroke="#cfc5b3" stroke-width=".22" stroke-linecap="round"/>' +
      '<path class="c6s-gf-dampf" style="animation-delay:1.6s" d="M5.3 1.2C5.9 .4 5.1 -.4 5.6 -1.3" fill="none" stroke="#cfc5b3" stroke-width=".22" stroke-linecap="round"/>' +
      '</g>',
    vorn: '<g>' +
      '<path d="M6.1 3.3C8.9 3 9.2 6 6.3 6.1" fill="none" stroke="' + T + '" stroke-width="1.05" stroke-linecap="round"/>' +
      '<path d="M6.1 3.3C8.9 3 9.2 6 6.3 6.1" fill="none" stroke="' + p + '" stroke-width=".78" stroke-linecap="round"/>' +
      '<path d="M-6 2.4A6 1.2 0 0 0 6 2.4C6.2 5 4.5 7 0 7C-4.5 7 -6.2 5 -6 2.4Z" fill="' + p + '"' + GW + '/>' +
      '<path d="M-5.9 4.2C-2 5.1 2 5.1 5.9 4.2L5.6 5.1C2 6 -2 6 -5.6 5.1Z" fill="' + rosa + '"/>' +
      '<path d="M-5.3 3.1C-3.6 3.6 -1.8 3.75 0 3.75" fill="none" stroke="#fff" stroke-width=".22" stroke-linecap="round" opacity=".8"/>' +
      '<defs><linearGradient id="c6s-gfe-l" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".2"/><stop offset=".6" stop-color="#2b2722" stop-opacity="0"/></linearGradient><linearGradient id="c6s-gfe-r" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".2"/><stop offset=".6" stop-color="#2b2722" stop-opacity="0"/></linearGradient><linearGradient id="c6s-gfe-u" x1="0" x2="0" y1="0" y2="1"><stop offset=".35" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".22"/></linearGradient></defs>' + '<path class="c6s-gf-eigen c6s-gf-eigen-l" d="M-6 2.4A6 1.2 0 0 0 6 2.4C6.2 5 4.5 7 0 7C-4.5 7 -6.2 5 -6 2.4Z" fill="url(#c6s-gfe-l)"/><path class="c6s-gf-eigen c6s-gf-eigen-r" d="M-6 2.4A6 1.2 0 0 0 6 2.4C6.2 5 4.5 7 0 7C-4.5 7 -6.2 5 -6 2.4Z" fill="url(#c6s-gfe-r)"/><path class="c6s-gf-eigen c6s-gf-eigen-u" d="M-6 2.4A6 1.2 0 0 0 6 2.4C6.2 5 4.5 7 0 7C-4.5 7 -6.2 5 -6 2.4Z" fill="url(#c6s-gfe-u)"/>' +
      '</g>',
    sitz: { dy: .9, beine: 'weg' }, schwebt: true
  };
}
// Kleiner Carl fürs Kartenbild (Einheit m, sitzt dy tiefer)
function miniCarl(sitz) {
  var dy = sitz ? sitz.dy : 0, beine = !sitz || sitz.beine === 'baumeln';
  var s = '<g transform="translate(0,' + f2(dy) + ')">';
  if (beine) s += '<path d="M-1.8 2.4V4.1M1.4 2.4V4.1" stroke="#3d3732" stroke-width=".42" stroke-linecap="round"/><ellipse cx="-1.75" cy="4.25" rx=".82" ry=".44" fill="#5d86b0"' + GW.replace('.12', '.1') + '/><ellipse cx="1.45" cy="4.25" rx=".82" ry=".44" fill="#5d86b0"' + GW.replace('.12', '.1') + '/>';
  s += '<path d="M-4 .6C-4 -2.6 -2.2 -3.6 0 -3.6C2.4 -3.6 4 -2.4 4 .4C4 1.9 2.6 2.6 0 2.6C-2.6 2.6 -4 1.9 -4 .6Z" fill="#ece4d6"' + GW + '/>' +
    '<path d="M-3.9 1.4C-2 1.75 2 1.75 3.95 1.2C3.8 2.1 2.6 2.6 0 2.6C-2.6 2.6 -3.8 2.2 -3.9 1.4Z" fill="#3d3732"/>' +
    '<ellipse cx="-1.25" cy="0" rx=".62" ry=".7" fill="#e9a23b"' + GW.replace('.12', '.1') + '/><ellipse cx="1.3" cy="-.1" rx=".66" ry=".74" fill="#e9a23b"' + GW.replace('.12', '.1') + '/>' +
    '<circle cx="-1.15" cy=".1" r=".3" fill="#3a2516"/><circle cx="1.4" cy="0" r=".32" fill="#3a2516"/>' +
    '<path d="M-.4 1.05Q.1 1.4 .6 1.05" fill="none" stroke="' + T + '" stroke-width=".12" stroke-linecap="round"/>' +
    '<path d="M.3 -3.5q-.1 -.5 .1 -.95" fill="none" stroke="' + T + '" stroke-width=".3" stroke-linecap="round"/>' +
    '<path d="M.4 -4.4C-.6 -4.6 -1.4 -5.4 -1 -6.2C-.2 -6 .3 -5.3 .4 -4.4Z M.4 -4.4C1.3 -4.7 2.2 -5.5 1.8 -6.5C.9 -6.3 .5 -5.4 .4 -4.4Z" fill="#8ea37a"' + GW.replace('.12', '.1') + '/>' +
    '</g>';
  return s;
}
var GEFAEHRT = { 'g-couch': gefCouch, 'g-ufo': gefUfo, 'g-wolke': gefWolke, 'g-tasse': gefTasse };
function gefaehrtVon(id) {
  var mk = GEFAEHRT[id]; if (!mk) return null;
  var g = mk(); g.id = id; g.name = NACH[id] ? NACH[id].name : id; return g;
}

// ---------- Katalog ----------
var KAT = [
  { id: 'socken', name: 'Socken', vb: '-1.3 -2.5 2.6 2.75' },
  { id: 'muetze', name: 'Mützen', vb: '-6.1 -2.7 11.2 5.2' },
  { id: 'schal', name: 'Schals', vb: '-3.9 -1.6 7.8 4.6' },
  { id: 'brille', name: 'Brillen', vb: '-4.1 -2.0 8.2 4.0' },
  { id: 'jacke', name: 'Jacken', vb: '30 70 180 160' },
  { id: 'fell', name: 'Fell', vb: '30 70 180 170' },
  { id: 'wimpern', name: 'Wimpern', vb: '-1.25 -1.85 3.1 2.9' },
  { id: 'gefaehrt', name: 'Gefährt', vb: '-9.6 -7.2 19.2 14.2' }
];
function A(id, kat, name, preis, o) { var a = { id: id, kat: kat, name: name, preis: preis }; for (var k in o) a[k] = o[k]; return a; }
var ARTIKEL = [
  A('s-lieb', 'socken', 'Deine Farbe', 0, { lieb: true }),
  A('s-ringel', 'socken', 'Ringel', 0, { svg: function () { return socke('#fbf7f0', ringel('#c8463d')); } }),
  A('s-punkte', 'socken', 'Punkte', 0, { svg: function () { return socke('#3f6f9a', punkte('#fbf7f0')); } }),
  A('s-wolle', 'socken', 'Wollsocken', 0, { svg: function () { return socke('#b7852a', wolle('#b7852a'), .01); } }),
  A('s-zehen', 'socken', 'Zehensocken', 6, { svg: function () { return socke('#7d4a74', zehen(['#e2b93b', '#6f9a5b', '#4f7cac', '#c8463d', '#e39aae'])); } }),
  A('s-stern', 'socken', 'Sternchen', 8, { svg: function () { return socke('#2f3a6b', sternchen('#e2b93b')); } }),
  A('m-strick', 'muetze', 'Strickmütze', 0, { svg: function () { return beanie('#5f7f3e', true); } }),
  A('m-baske', 'muetze', 'Baskenmütze', 0, { svg: function () { return baske('#2f4b7c'); } }),
  A('m-schieber', 'muetze', 'Schiebermütze', 0, { svg: function () { return schieber('#8a6a3c'); } }),
  A('m-zipfel', 'muetze', 'Zipfelmütze', 5, { svg: function () { return zipfel('#b8333a'); } }),
  A('m-sonne', 'muetze', 'Sonnenhut', 7, { svg: function () { return sonnenhut('#e3c88a'); } }),
  A('h-tuch', 'schal', 'Halstuch', 0, { svg: function () { return schal('#3f6f9a', null, 'tuch'); } }),
  A('h-wolle', 'schal', 'Wollschal', 0, { svg: function () { return schal('#a95f33', null, 'wolle'); } }),
  A('h-streifen', 'schal', 'Streifenschal', 0, { svg: function () { return schal('#e2b93b', '#2c7a6e', 'streifen'); } }),
  A('h-kirsch', 'schal', 'Kirschtuch', 5, { svg: function () { return schal('#b8333a', null, 'tuch'); } }),
  A('b-rund', 'brille', 'Runde Brille', 0, { svg: function (a) { return brille('rund', a); } }),
  A('b-lese', 'brille', 'Lesebrille', 0, { svg: function (a) { return brille('lese', a); } }),
  A('b-sonne', 'brille', 'Sonnenbrille', 0, { svg: function (a) { return brille('sonne', a); } }),
  A('b-taucher', 'brille', 'Taucherbrille', 7, { svg: function (a) { return brille('taucher', a); } }),
  A('j-strick', 'jacke', 'Strickjacke', 0, { svg: function (a) { return jacke('#6f9a5b', 'strick', a); } }),
  A('j-regen', 'jacke', 'Regenjacke', 0, { svg: function (a) { return jacke('#e2b93b', 'regen', a); } }),
  A('j-daune', 'jacke', 'Daunenweste', 0, { svg: function (a) { return jacke('#2f5f8a', 'daune', a); } }),
  A('j-cord', 'jacke', 'Cordjacke', 7, { svg: function (a) { return jacke('#a4492e', 'cord', a); } }),
  A('f-wie', 'fell', 'Wie immer', 0, { fell: { farbe: null } }),
  A('f-sand', 'fell', 'Sand', 0, { fell: { farbe: '#e6d3b0' } }),
  A('f-abend', 'fell', 'Abendblau', 0, { fell: { farbe: '#cdd3e6' } }),
  A('f-moos', 'fell', 'Moos', 0, { fell: { farbe: '#d3dcc0' } }),
  A('f-sprenkel', 'fell', 'Sprenkel', 4, { fell: { farbe: null, muster: 'sprenkel', mf: '#8a6a3c' } }),
  A('f-streifen', 'fell', 'Streifen', 6, { fell: { farbe: '#e9d9bd', muster: 'streifen', mf: '#a95f33' } }),
  A('f-flecken', 'fell', 'Flecken', 6, { fell: { farbe: null, muster: 'flecken', mf: '#2b2722' } }),
  A('w-fein', 'wimpern', 'Fein', 0, { wimpern: null }),
  A('w-lang', 'wimpern', 'Lang', 0, { wimpern: 'lang' }),
  A('w-dicht', 'wimpern', 'Dicht', 0, { wimpern: 'dicht' }),
  A('w-schwung', 'wimpern', 'Schwung', 0, { wimpern: 'schwung' }),
  A('w-keine', 'wimpern', 'Keine', 0, { wimpern: 'keine' }),
  A('w-oben-unten', 'wimpern', 'Oben und unten', 4, { wimpern: 'oben-unten' }),
  A('w-bunt', 'wimpern', 'Bunt', 6, { wimpern: 'bunt' }),
  A('g-fuss', 'gefaehrt', 'Zu Fuß', 0, { gefaehrt: null }),
  A('g-couch', 'gefaehrt', 'Schwebende Couch', 0, { gefaehrt: 'g-couch' }),
  A('g-wolke', 'gefaehrt', 'Wolkenkissen', 0, { gefaehrt: 'g-wolke' }),
  A('g-ufo', 'gefaehrt', 'Kleines UFO', 8, { gefaehrt: 'g-ufo' }),
  A('g-tasse', 'gefaehrt', 'Teetasse', 6, { gefaehrt: 'g-tasse' })
];
var NACH = {}; ARTIKEL.forEach(function (a) { NACH[a.id] = a; });

// Woher die Münzen kommen: Schlüssel aus C6.stimme, sonst eigener Satz
function woherMuenzen() {
  var k = ['laden.muenzen', 'muenzen', 'muenzeWoher'];
  for (var i = 0; i < k.length; i++) { try { var t = C6.stimme && C6.stimme.fest(k[i]); if (t) return t; } catch (e) {} }
  return 'Eine Münze liegt jeden Tag am Fahrrad. Die anderen sind versteckt.';
}

function laden() {
  var s = S();
  if (!s.laden || typeof s.laden !== 'object') s.laden = {};
  if (!Array.isArray(s.laden.besitz)) s.laden.besitz = [];
  if (!s.laden.an || typeof s.laden.an !== 'object') s.laden.an = { socken: 's-lieb' };
  // Die geschenkte Couch ist von Anfang an sein Platz oben; „Zu Fuß“ bleibt wählbar (dann steht hier 'g-fuss')
  if (s.laden.an.gefaehrt === undefined) s.laden.an.gefaehrt = 'g-couch';
  return s.laden;
}
function hat(id) { var a = NACH[id]; return !!a && (a.preis === 0 || laden().besitz.indexOf(id) >= 0); }

function wert(a, A) {
  if (!a) return null;
  if (a.lieb) return { farbe: lieblingsfarbe() };
  if (a.kat === 'wimpern') { if (!a.wimpern) return null; if (a.wimpern === 'keine') return 'keine'; return { svg: wimpernSvg(a.wimpern) }; }
  if (a.kat === 'gefaehrt') return a.gefaehrt ? gefaehrtVon(a.gefaehrt) : null;
  if (a.fell) { if (!a.fell.farbe && !a.fell.muster) return null; return { farbe: a.fell.farbe || null, muster: a.fell.muster ? fellMuster(a.fell.muster, a.fell.mf, A) : null }; }
  return { svg: a.svg(A) };
}
function kleidVon(an, ctl, mitGefaehrt) {
  var o = {}, A = anker(ctl);
  KAT.forEach(function (k) { if (k.id === 'gefaehrt' && !mitGefaehrt) return; o[k.id] = wert(NACH[an[k.id]], A); });
  if (!o.socken) o.socken = null;
  return o;
}

C6.laden = {
  katalog: ARTIKEL, kategorien: KAT,
  // Kleidung ohne Gefährt: am Boden trägt Carl keins (Vertrag 7); Himmel und Laden holen es mit gefaehrt()
  an: function () { return kleidVon(laden().an); },
  // Worin Carl oben sitzt: Kleid-Objekt {id, name, hinten, vorn, sitz, schwebt} oder null (zu Fuß)
  gefaehrt: function () { var id = laden().an.gefaehrt; return id && hat(id) ? wert(NACH[id]) : null; },
  hat: hat
};
// „Deine Farbe“ hängt an S.du.socken (Rundgang, Bibliothek). Ändert sie sich, erfahren alle Räume davon über bus 'kleid'.
(function () {
  var letzt = null;
  function pruefe() {
    var f = lieblingsfarbe() + '|' + JSON.stringify(laden().an);
    if (letzt === null) { letzt = f; return; }
    if (f === letzt) return;
    letzt = f;
    try { C6.bus && C6.bus.emit('kleid', C6.laden.an()); } catch (e) {}
  }
  try { pruefe(); } catch (e) {}
  if (C6.bus) { C6.bus.on('zustand', function () { try { pruefe(); } catch (e) {} }); C6.bus.on('rundgang', function () { setTimeout(function () { try { pruefe(); } catch (e) {} }, 50); }); }
})();

// Anker des kleinen Kiesels auf der Karte
var KARTE_A = { m: 20, kb: 4, ab: 1.1, hoch: .15, kopf: { x: 120, y: 80 }, augen: { x: 120, y: 150 }, hals: { x: 120, y: 206 }, koerper: { x: 120, y: 156 } };
// Kartenbild eines Artikels
function kartenBild(a) {
  var k = null; KAT.forEach(function (x) { if (x.id === a.kat) k = x; });
  var innen;
  if (a.kat === 'jacke' || a.kat === 'fell') {
    // auf einem kleinen Kiesel
    var f = a.fell ? (a.fell.farbe || '#ece4d6') : '#ece4d6';
    var leib = 'M40 158C40 104 76 78 120 78C164 78 200 100 200 158C200 200 168 224 120 224C72 224 40 202 40 158Z';
    var cid = 'c6sk-' + a.id;
    innen = '<clipPath id="' + cid + '"><path d="' + leib + '"/></clipPath><path d="' + leib + '" fill="' + f + '"/>' +
      '<g clip-path="url(#' + cid + ')">' + (a.fell ? (a.fell.muster ? fellMuster(a.fell.muster, a.fell.mf, KARTE_A) : '') : a.svg(KARTE_A)) + '</g>' +
      '<ellipse cx="98" cy="151" rx="8" ry="9" fill="' + T + '"/><ellipse cx="142" cy="149" rx="8.5" ry="9.5" fill="' + T + '"/>' +
      '<path d="' + leib + '" fill="none" stroke="' + T + '" stroke-width="2.6"/>';
  } else if (a.kat === 'wimpern') {
    innen = '<ellipse cx="0" cy="0" rx=".74" ry=".82" fill="#e9a23b" stroke="' + T + '" stroke-width=".16"/><ellipse cx=".04" cy=".08" rx=".42" ry=".48" fill="#3a2516"/><ellipse cx="-.22" cy="-.3" rx=".2" ry=".18" fill="#fffdf6"/>' +
      (a.wimpern === 'keine' ? '' : wimpernSvg(a.wimpern));
  } else if (a.kat === 'gefaehrt') {
    var g = a.gefaehrt ? gefaehrtVon(a.gefaehrt) : null;
    innen = (g ? g.hinten : '') + miniCarl(g && g.sitz) + (g ? g.vorn : '');
    if (!g) innen += '<path d="M-3.2 5.2H3.6" stroke="#cfc5b3" stroke-width=".16" stroke-linecap="round" stroke-dasharray=".3 .5"/>';
  } else if (a.lieb) innen = socke(lieblingsfarbe());
  else innen = a.svg();
  return '<svg viewBox="' + k.vb + '" width="84" height="62" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' + innen + '</svg>';
}

var SYMBOL = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 5.5a2 2 0 1 1 2 2c-1 0-2 .7-2 1.7v.6M12 9.8L3.5 15.6c-.8.6-.4 1.9.6 1.9h15.8c1 0 1.4-1.3.6-1.9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// ---------- Das Ankleidezimmer: Schrank, Kommode mit Lampe, Spiegel, Bett ----------
var HOLZ = '#c99a6b', HOLZ_D = '#a9784c', HOLZ_H = '#dcb489', TI = ' stroke="' + T + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
function schrankSvg() {
  // offener Kleiderschrank, drinnen hängen Jacke, Schal, Weste auf Bügeln, oben liegt eine Mütze
  function buegel(x, f, art) {
    var d = ton(f, -0.2), s = '<path d="M' + x + ' 64v-8q0-6 6-6" fill="none" stroke="' + T + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M' + (x - 22) + ' 76L' + x + ' 64L' + (x + 22) + ' 76" fill="none" stroke="' + T + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
    if (art === 'schal') return s + '<path d="M' + (x - 14) + ' 72h28v6h-28zM' + (x - 12) + ' 78h9v62h-9zM' + (x + 3) + ' 78h9v52h-9z" fill="' + f + '"' + TI.replace('3"', '2.2"') + '/>';
    return s + '<path d="M' + (x - 24) + ' 78Q' + x + ' 70 ' + (x + 24) + ' 78L' + (x + 28) + ' 160H' + (x - 28) + 'Z" fill="' + f + '"' + TI.replace('3"', '2.4"') + '/>' +
      '<path d="M' + x + ' 76V160M' + (x - 8) + ' 74L' + x + ' 96L' + (x + 8) + ' 74" fill="none" stroke="' + d + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  return '<svg viewBox="0 0 230 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
    '<path d="M10 296V30Q10 14 26 12H174Q190 14 190 30V296Z" fill="' + HOLZ + '"' + TI + '/>' +
    '<path d="M22 300V44H178V300Z" fill="#6f5038"' + TI.replace('3"', '2.4"') + '/>' +
    '<path d="M24 58H176" stroke="' + T + '" stroke-width="3.4" stroke-linecap="round"/>' +
    buegel(56, '#6f9a5b', 'jacke') + buegel(102, '#3f6f9a', 'schal') + buegel(146, '#e2b93b', 'jacke') +
    '<path d="M24 236H176" stroke="' + T + '" stroke-width="2.4"/><path d="M40 236l6-12h22l6 12M90 236l4-9h20l4 9M132 236l6-12h22l6 12" fill="#8a5f3f" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    // Eigenschatten: die lichtabgewandte Seite des Korpus wird einen Hauch dunkler (Richtung setzt der Raum)
    '<defs><linearGradient id="c6s-eg-schrank" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".16"/></linearGradient></defs>' +
    '<path d="M10 296V30Q10 14 26 12H174Q190 14 190 30V296Z" fill="url(#c6s-eg-schrank)"/>' +
    // offene Tür: schwingt beim Antippen am Scharnier (x=190)
    '<g class="c6s-l-tuer" style="transform-origin:190px 160px"><path d="M190 22L226 34V290L190 298Z" fill="' + HOLZ_H + '"' + TI + '/><path d="M198 50L218 56V250L198 256Z" fill="none" stroke="' + HOLZ_D + '" stroke-width="2.4"/><circle cx="196" cy="166" r="3.4" fill="#e2b93b" stroke="' + T + '" stroke-width="1.6"/></g>' +
    // Mütze oben drauf
    '<path d="M64 12C62 -6 104 -8 110 8Z" fill="#5f7f3e"' + TI.replace('3"', '2.4"') + '/><path d="M60 13Q86 6 114 9" fill="none" stroke="' + T + '" stroke-width="2.4"/>' +
    '</svg>';
}
function kommodeSvg(n) {
  n = n || '';
  return '<svg viewBox="0 0 200 220" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
    '<defs><radialGradient id="c6s-ll' + n + '" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd58a" stop-opacity=".55"/><stop offset=".5" stop-color="#ffd58a" stop-opacity=".2"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6s-eg-kommode' + n + '" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".14"/></linearGradient></defs>' +
    // Lampenlicht: ein warmer Hof um den Schirm, der leise atmet
    '<ellipse class="c6s-l-lampenlicht" cx="88" cy="66" rx="78" ry="62" fill="url(#c6s-ll' + n + ')"/>' +
    // Lampe
    '<path d="M74 110h28" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/><path d="M88 110V70" stroke="' + T + '" stroke-width="3"/>' +
    '<path d="M64 72L74 34H102L112 72Z" fill="#f3dfae"' + TI + '/>' +
    '<path d="M78 40L72 66" stroke="#fff6dc" stroke-width="3" stroke-linecap="round" opacity=".8"/>' +
    // Socken, gerollt: kullern beim Antippen
    '<g class="c6s-l-rollen"><ellipse cx="140" cy="104" rx="14" ry="8" fill="#5d86b0"' + TI.replace('3"', '2.2"') + '/><path d="M131 101q9 -6 18 0" fill="none" stroke="#fbf7f0" stroke-width="1.6" opacity=".7"/>' +
    '<ellipse cx="160" cy="105" rx="12" ry="7" fill="#c8463d"' + TI.replace('3"', '2.2"') + '/><path d="M152 103q8 -5 16 0" fill="none" stroke="#fbf7f0" stroke-width="1.6" opacity=".7"/></g>' +
    '<path d="M14 112H186V214H14Z" fill="' + HOLZ + '"' + TI + '/><path d="M14 112H186V214H14Z" fill="url(#c6s-eg-kommode' + n + ')"/><path d="M8 112H192" stroke="' + T + '" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M24 124H176V156H24ZM24 166H176V202H24Z" fill="' + HOLZ_H + '"' + TI.replace('3"', '2.4"') + '/>' +
    '<circle cx="100" cy="140" r="4" fill="#e2b93b" stroke="' + T + '" stroke-width="1.8"/><circle cx="100" cy="184" r="4" fill="#e2b93b" stroke="' + T + '" stroke-width="1.8"/>' +
    '<path d="M22 214v6M178 214v6" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/></svg>';
}
function bettSvg() {
  // Carls Bett: Kopfteil wie ein Kiesel, Flickendecke, Kissen
  var flicken = '', farben = ['#e3c88a', '#8db4d6', '#e39aae', '#a7c08f', '#f3efe8', '#e0a879'];
  for (var i = 0; i < 6; i++) flicken += '<path d="M' + (78 + i * 30) + ' 98h30v34h-30z" fill="' + farben[i] + '" stroke="' + T + '" stroke-width="1.6"/>';
  return '<svg viewBox="0 0 270 170" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
    '<path d="M8 150V60C8 30 30 18 52 18C76 18 92 34 92 62V150Z" fill="' + HOLZ + '"' + TI + '/>' +
    '<path d="M60 96H262V146H60Z" fill="#f3efe8"' + TI + '/>' + flicken +
    '<path d="M70 98H262V134H70Z" fill="none"' + TI.replace('3"', '2.4"') + '/>' +
    '<path d="M66 94C62 80 84 72 106 78C122 84 118 98 102 100C88 102 70 102 66 94Z" fill="#fbf7f0"' + TI.replace('3"', '2.4"') + '/>' +
    '<path d="M60 146v20M252 146v20" stroke="' + T + '" stroke-width="5" stroke-linecap="round"/></svg>';
}
function truheSvg() {
  // niedrige Truhe mit kurzer Lampe und Sockenrollen (iPhone, das freie Feld unter den Karten)
  return '<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
    '<defs><radialGradient id="c6s-ll2" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd58a" stop-opacity=".55"/><stop offset=".5" stop-color="#ffd58a" stop-opacity=".2"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6s-eg-kommode2" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".14"/></linearGradient></defs>' +
    // ein Kissen statt Lampe (die Lampe hängt an der Wand)
    '<path d="M40 70C36 56 52 50 68 54C84 50 100 56 96 70Z" fill="#e39aae"' + TI.replace('3"', '2.2"') + '/>' +
    '<g class="c6s-l-rollen"><ellipse cx="128" cy="66" rx="14" ry="8" fill="#5d86b0"' + TI.replace('3"', '2.2"') + '/><path d="M119 63q9 -6 18 0" fill="none" stroke="#fbf7f0" stroke-width="1.6" opacity=".7"/>' +
    '<ellipse cx="152" cy="67" rx="12" ry="7" fill="#c8463d"' + TI.replace('3"', '2.2"') + '/><path d="M144 65q8 -5 16 0" fill="none" stroke="#fbf7f0" stroke-width="1.6" opacity=".7"/></g>' +
    '<path d="M14 74H186V142H14Z" fill="' + HOLZ + '"' + TI + '/><path d="M14 74H186V142H14Z" fill="url(#c6s-eg-kommode2)"/><path d="M8 74H192" stroke="' + T + '" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M26 86H174V130H26Z" fill="' + HOLZ_H + '"' + TI.replace('3"', '2.4"') + '/><circle cx="100" cy="108" r="4" fill="#e2b93b" stroke="' + T + '" stroke-width="1.8"/>' +
    '<path d="M22 142v6M178 142v6" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/></svg>';
}
function wandlampeSvg() {
  // kleine Wandlampe (iPhone): Schirm, Arm, warmer Hof – die Lichtquelle des Zimmers, wo keine Kommode steht
  return '<svg viewBox="0 0 120 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' +
    '<defs><radialGradient id="c6s-ll3" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd58a" stop-opacity=".55"/><stop offset=".5" stop-color="#ffd58a" stop-opacity=".2"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient></defs>' +
    '<ellipse class="c6s-l-lampenlicht" cx="52" cy="48" rx="60" ry="50" fill="url(#c6s-ll3)" style="transform-origin:52px 48px"/>' +
    '<path d="M96 30v40" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/><path d="M96 48H66" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M32 58L42 26H64L74 58Z" fill="#f3dfae"' + TI + '/><path d="M45 31L40 53" stroke="#fff6dc" stroke-width="3" stroke-linecap="round" opacity=".8"/>' +
    '<circle cx="96" cy="48" r="5" fill="#e2b93b" stroke="' + T + '" stroke-width="2"/>' +
    '</svg>';
}
function hockerSvg() {
  // kleiner Hocker, darauf liegt eine Mütze
  return '<svg viewBox="0 0 120 110" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
    '<path d="M18 60H102L96 104H24Z" fill="' + HOLZ + '"' + TI + '/><path d="M12 60H108" stroke="' + T + '" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M30 70V96M90 70V96" stroke="' + HOLZ_D + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M34 58C30 36 50 22 66 24C84 26 96 40 90 56Q62 62 34 58Z" fill="#8a6bb0"' + TI.replace('3"', '2.4"') + '/><path d="M32 56Q62 62 92 54L91 48Q62 55 33 50Z" fill="#6f559a"' + TI.replace('3"', '2.2"') + '/>' +
    '</svg>';
}
function pflanzeSvg() {
  // Topfpflanze: drei Blätter, die im Luftzug der Tür leise wippen
  return '<svg viewBox="0 0 110 150" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
    '<g class="c6s-l-blaetter" style="transform-origin:56px 112px">' +
    '<path d="M56 112C40 96 26 74 34 50C50 62 58 84 56 112Z" fill="#8ea37a"' + TI.replace('3"', '2.4"') + '/>' +
    '<path d="M56 112C56 84 60 60 82 44C84 72 72 96 56 112Z" fill="#a4b68f"' + TI.replace('3"', '2.4"') + '/>' +
    '<path d="M56 112C50 92 52 70 66 56C70 80 64 98 56 112Z" fill="#7d9468"' + TI.replace('3"', '2.4"') + '/>' +
    '<path d="M44 64Q52 86 56 108M78 52Q70 80 58 108" fill="none" stroke="#5d7150" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></g>' +
    '<path d="M28 108H84L78 146H34Z" fill="#c9805a"' + TI + '/><path d="M22 108H90" stroke="' + T + '" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M40 118Q56 122 72 118" fill="none" stroke="#e8b08c" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
    '</svg>';
}
function staenderSvg() {
  // Kleiderständer: ein Stab mit drei Haken, Schal und Tuch hängen daran
  return '<svg viewBox="0 0 90 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
    '<path d="M45 24V290" stroke="' + T + '" stroke-width="4.5" stroke-linecap="round"/><path d="M45 24V290" stroke="' + HOLZ + '" stroke-width="2"/>' +
    '<path d="M18 292Q45 282 72 292" fill="none" stroke="' + T + '" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M45 34Q26 30 20 42M45 34Q64 30 70 42M45 60Q26 56 22 68" fill="none" stroke="' + T + '" stroke-width="3.2" stroke-linecap="round"/>' +
    '<path d="M64 42l-4 60h10z" fill="#e2b93b"' + TI.replace('3"', '2.2"') + '/><path d="M60 102L72 112L60 130L50 118Z" fill="#2c7a6e"' + TI.replace('3"', '2.2"') + '/>' +
    '<path d="M18 68L12 150L28 150Z" fill="#3f6f9a"' + TI.replace('3"', '2.2"') + '/>' +
    '</svg>';
}
var HERZ = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>';

// Was Carl sagt, wenn er etwas anzieht (kurz, nicht jedes Mal)
var SAGT = {
  socken: ['Warme Füße, klarer Kopf.', 'Die passen zu meinen Beinchen.'],
  muetze: ['Jetzt seh ich aus, als hätte ich einen Plan.', 'Mein Keimblatt mag es warm.'],
  schal: ['Weich. Ich bleib so.', 'Damit komm ich durch jeden Wind.'],
  brille: ['Jetzt seh ich dich noch schärfer.', 'Sieht klug aus. Bin ich auch, manchmal.'],
  jacke: ['Taschen. Ich hab jetzt Taschen.', 'Fühlt sich an wie eine Umarmung.'],
  fell: ['Neue Farbe, gleicher Carl.', 'Ich erkenn mich kaum. Schön.'],
  wimpern: ['Ich klimper mal.', 'Jetzt schau ich freundlicher. Oder?']
};
var LIEB_START = { muetze: 'm-strick', schal: 'h-tuch', socken: 's-lieb' };

C6.raum({
  id: 'laden', name: 'Laden', reihe: 4, symbol: SYMBOL,
  bauen: function (buehne) {
    buehne.classList.add('c6s-laden');
    buehne.innerHTML =
      '<div class="c6s-l-zimmer">' +
      '  <i class="c6s-l-wand" data-tiefe="fern" aria-hidden="true"></i><i class="c6s-l-licht" data-tiefe="fern" aria-hidden="true"></i><i class="c6s-l-boden" data-tiefe="fern" aria-hidden="true"></i>' +
      '  <div class="c6s-l-ding c6s-l-staender c6s-l-fuss-schatten" data-tiefe="mitte" aria-hidden="true">' + staenderSvg() + '</div>' +
      '  <button type="button" class="c6s-l-ding c6s-l-schrank c6s-l-fuss-schatten" data-tiefe="mitte" data-kat="jacke" aria-label="Kleiderschrank: Jacken">' + schrankSvg() + '</button>' +
      '  <button type="button" class="c6s-l-ding c6s-l-kommode c6s-l-fuss-schatten" data-tiefe="mitte" data-kat="socken" aria-label="Kommode: Socken">' + kommodeSvg() + '</button>' +
      '  <div class="c6s-l-bett c6s-l-fuss-schatten" data-tiefe="mitte" aria-hidden="true">' + bettSvg() + '</div>' +
      '  <i class="c6s-l-teppich" data-tiefe="nah" aria-hidden="true"></i>' +
      '  <button type="button" class="c6s-l-ding c6s-l-spiegel c6s-l-fuss-schatten" data-tiefe="mitte" aria-label="Spiegel: Carl schaut hinein"><span class="c6s-l-glas"><span class="c6s-l-bildchen"><span class="c6s-l-bildfigur"></span></span><i class="c6s-l-glanz"></i></span><i class="c6s-l-fuss"></i></button>' +
      '  <div class="c6s-l-ding c6s-l-kommode2 c6s-l-fuss-schatten" data-tiefe="nah" aria-hidden="true">' + truheSvg() + '</div>' +
      '  <div class="c6s-l-ding c6s-l-hocker c6s-l-fuss-schatten" data-tiefe="nah" aria-hidden="true">' + hockerSvg() + '</div>' +
      '  <div class="c6s-l-ding c6s-l-pflanze c6s-l-fuss-schatten" data-tiefe="nah" aria-hidden="true">' + pflanzeSvg() + '</div>' +
      '  <div class="c6s-l-wandlampe" data-tiefe="fern" aria-hidden="true">' + wandlampeSvg() + '</div>' +
      '  <button type="button" class="c6s-l-lieb"><span class="c6s-l-haken" aria-hidden="true"></span><span class="c6s-l-schild">' + HERZ + 'Was magst du?</span></button>' +
      '</div>' +
      '<div class="c6s-l-innen">' +
      '  <div class="c6s-l-carl"><i class="c6s-l-schweb" aria-hidden="true"></i><div class="c6s-l-figur"></div></div>' +
      '  <div class="c6s-l-kats" role="tablist" aria-label="Was Carl anprobiert" data-c6-kein-wisch></div>' +
      '  <div class="c6s-l-karten" role="list" data-c6-kein-wisch></div>' +
      '  <div class="c6s-l-tun"><div class="c6s-l-stand"></div><button type="button" class="c6s-knopf c6s-l-haupt" hidden></button><button type="button" class="c6s-knopf c6s-leise c6s-l-zurueck" hidden>Rückgängig</button></div>' +
      '</div>';
    var kats = buehne.querySelector('.c6s-l-kats'), karten = buehne.querySelector('.c6s-l-karten');
    var figurPlatz = buehne.querySelector('.c6s-l-figur'), carlBox = buehne.querySelector('.c6s-l-carl');
    var haupt = buehne.querySelector('.c6s-l-haupt'), zurueckB = buehne.querySelector('.c6s-l-zurueck');
    var spiegel = buehne.querySelector('.c6s-l-spiegel'), bildchen = buehne.querySelector('.c6s-l-bildfigur'), schweb = buehne.querySelector('.c6s-l-schweb');
    var schrank = buehne.querySelector('.c6s-l-schrank');
    buehne.querySelector('.c6s-l-stand').appendChild(C6.muenzen ? C6.muenzen.anzeige() : document.createElement('span'));

    var kat = 'socken', probe = null, verlauf = [], ctl = null, bild = null, gesagt = false, zuletztGesagt = 0;

    KAT.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'c6s-l-kat'; b.setAttribute('role', 'tab'); b.dataset.kat = k.id;
      b.textContent = k.name;
      b.onclick = function () { waehleKat(k.id, true); };
      kats.appendChild(b);
    });
    var kartenJe = {};
    ARTIKEL.forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'c6s-l-karte'; b.dataset.id = a.id; b.dataset.kat = a.kat; b.setAttribute('role', 'listitem');
      b.innerHTML = '<span class="c6s-l-bild">' + kartenBild(a) + '</span><span class="c6s-l-name">' + a.name + '</span><span class="c6s-l-preis"></span>';
      b.onclick = function () { probiere(a.id); };
      karten.appendChild(b);
      kartenJe[a.id] = b;
    });

    // Carl und sein Spiegelbild
    function beide(fn) { [ctl, bild].forEach(function (c) { if (c) { try { fn(c); } catch (e) {} } }); }
    function figur() {
      if (ctl || !C6.figur) return;
      ctl = C6.figur.male(figurPlatz, { groesse: 260 });
      try { ctl.kleid(C6.laden.an()); } catch (e) {}
      if (C6.geheim) C6.geheim.alles(ctl);
      try { bild = C6.figur.male(bildchen, { groesse: 120 }); bild.kleid(C6.laden.an()); } catch (e) { bild = null; }
      if (ctl.gewohnheiten) { try { ctl.gewohnheiten(['umsehen', 'summen', 'sitzen']); } catch (e) {} }
      // Antippen heißt hier: dreh dich (nicht: Tastatur auf)
      figurPlatz.addEventListener('click', function () { tippCarl(); });
      groesse();
    }
    function groesse() {
      var r = buehne.getBoundingClientRect();
      if (ctl) {
        var h = carlBox.clientHeight, w = carlBox.clientWidth, pc = C6.geraet === 'computer';
        // Am iPhone bleibt über Carl Luft für seine Blase
        var px = Math.max(140, Math.min(h * (pc ? 0.8 : 0.74), w * 0.62, pc ? 400 : 300, pc ? 1e9 : h - 200));
        ctl.groesse(Math.round(px));
        buehne.style.setProperty('--c6s-carl', Math.round(px) + 'px');
      }
      // Fußboden: die Linie, auf der Carl steht, liegt ein Stück unter der Wandkante
      var cb = carlBox.getBoundingClientRect();
      if (cb.height && r.height) {
        var fuss = cb.bottom - r.top, tief = C6.geraet === 'computer' ? 74 : 54;
        buehne.style.setProperty('--c6s-fuss', Math.round(fuss) + 'px');
        buehne.style.setProperty('--c6s-hz', Math.round(fuss - tief) + 'px');
      }
      if (bild) { var g = spiegel.querySelector('.c6s-l-glas').clientHeight; bild.groesse(Math.max(60, Math.round(g * 0.62))); }
    }
    function anJetzt() { var a = {}, l = laden().an; for (var k in l) a[k] = l[k]; return a; }
    function zeige() {
      var an = anJetzt();
      if (probe) an[NACH[probe].kat] = probe;
      beide(function (c) { c.kleid(kleidVon(an, c, true)); });
      schwebe(an.gefaehrt && NACH[an.gefaehrt] ? wert(NACH[an.gefaehrt]) : null);
    }
    // ---------- Anprobe des Gefährts: Carl hebt ab und sitzt darin ----------
    // Mit der Figur-Ebene (ctl.sitzIn) trägt die Figur es selbst. Ohne sie liegen zwei eigene Lagen um die Figur.
    var schwebt = null;
    function lage(c, g) {
      var el = c && c.el; if (!el) return;
      var alt = el.querySelectorAll('.c6s-gf-lage'); Array.prototype.forEach.call(alt, function (x) { x.remove(); });
      if (!g) return;
      function svg(cls, inhalt) {
        var e = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        e.setAttribute('viewBox', '0 0 240 270'); e.setAttribute('class', 'c6s-gf-lage ' + cls); e.setAttribute('aria-hidden', 'true');
        e.innerHTML = '<g transform="translate(120,156) scale(20)">' + inhalt + '</g>';
        return e;
      }
      el.insertBefore(svg('c6s-gf-hinten', g.hinten), el.firstChild);
      el.appendChild(svg('c6s-gf-vorn', g.vorn));
    }
    function schwebe(g) {
      var id = g ? g.id : null;
      if (id === (schwebt && schwebt.id) && !!g === !!schwebt) return;
      schwebt = g;
      beide(function (c) {
        var eigen = typeof c.sitzIn === 'function';
        if (eigen) { try { c.kleid({ gefaehrt: g }); c.sitzIn(!!g); } catch (e) {} }
        else { lage(c, g); try { c.sitz && c.sitz(!!g); } catch (e) {} }
      });
      [figurPlatz, bildchen].forEach(function (el) {
        var war = el.classList.contains('c6s-schwebt');
        el.classList.toggle('c6s-schwebt', !!g);
        el.classList.toggle('c6s-landet', !g && war);
        if (!g && war) setTimeout(function () { el.classList.remove('c6s-landet'); }, 700);
      });
      schweb.classList.toggle('c6s-an', !!g);
      carlBox.classList.toggle('c6s-eigen-lage', !!g && !(ctl && typeof ctl.sitzIn === 'function'));
    }
    function waehleKat(id, fokus) {
      kat = id;
      Array.prototype.forEach.call(kats.children, function (b) { var on = b.dataset.kat === id; b.classList.toggle('c6s-an', on); b.setAttribute('aria-selected', on); });
      Array.prototype.forEach.call(karten.children, function (b) { b.hidden = b.dataset.kat !== id; });
      karten.scrollLeft = 0;
      var aktiv = kats.querySelector('.c6s-an');
      if (aktiv && fokus) { var ziel = aktiv.offsetLeft - (kats.clientWidth - aktiv.offsetWidth) / 2; try { kats.scrollTo({ left: Math.max(0, ziel), behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) { kats.scrollLeft = Math.max(0, ziel); } }
      if (probe && NACH[probe].kat !== id) { probe = null; zeige(); }
      auffrischen();
    }

    // ---------- Mit Carl ----------
    function froh(ms) { beide(function (c) { c.stimmung && c.stimmung('froh'); }); setTimeout(function () { beide(function (c) { c.stimmung && c.stimmung('ruhig'); }); }, ms || 1400); }
    function huepf(n) { if (C6.ruhig) return; beide(function (c) { c.huepf && c.huepf(n); }); }
    function sag(t, immer) {
      var jetzt = Date.now();
      if (!immer && jetzt - zuletztGesagt < 7000) return;
      zuletztGesagt = jetzt;
      try { C6.sag(t); } catch (e) {}
    }
    function drehen() {
      spiegel.classList.remove('c6s-blitz'); void spiegel.offsetWidth; spiegel.classList.add('c6s-blitz');
      if (C6.ruhig) { huepf(10); return; }
      [figurPlatz, bildchen].forEach(function (el, i) {
        try { el.animate([{ transform: 'scaleX(1) translateY(0)' }, { transform: 'scaleX(.06) translateY(-10px)', offset: .25 }, { transform: 'scaleX(-1) translateY(-14px)', offset: .5 }, { transform: 'scaleX(.06) translateY(-10px)', offset: .75 }, { transform: 'scaleX(1) translateY(0)' }], { duration: 760, easing: 'cubic-bezier(.4,0,.3,1)', composite: 'add' }); } catch (e) {}
      });
    }
    function posieren() {
      // Carl schaut in den Spiegel, das Spiegelbild schaut zurück
      var r = spiegel.getBoundingClientRect(), c = ctl && ctl.el.getBoundingClientRect();
      if (ctl && ctl.schau) ctl.schau(r.left + r.width / 2, r.top + r.height * 0.4);
      if (bild && bild.schau && c) bild.schau(c.left + c.width / 2, c.top + c.height * 0.4);
      spiegel.classList.remove('c6s-blitz'); void spiegel.offsetWidth; spiegel.classList.add('c6s-blitz');
      froh(1600); huepf(8);
      setTimeout(function () { beide(function (x) { x.schau && x.schau(); }); }, 1700);
    }
    var tipps = [];
    // Antippen heißt wie überall: er hört zu (der Kern öffnet das Dock). Dreimal schnell: kitzeln.
    function tippCarl() {
      var t = Date.now(); tipps = tipps.filter(function (x) { return t - x < 1200; }); tipps.push(t);
      if (tipps.length >= 3) { tipps = []; froh(1800); huepf(14); sag('Hihi. Das kitzelt.', true); }
    }
    function lieblinge() {
      var oft = laden().oft || {}, set = {}, ausVerlauf = false;
      KAT.forEach(function (k) {
        var best = null, n = 0;
        ARTIKEL.forEach(function (a) { if (a.kat === k.id && hat(a.id) && (oft[a.id] || 0) > n) { n = oft[a.id]; best = a.id; } });
        if (best && n >= 2) { set[k.id] = best; ausVerlauf = true; }
      });
      if (!ausVerlauf) for (var k in LIEB_START) set[k] = LIEB_START[k];
      return { set: set, ausVerlauf: ausVerlauf };
    }
    function zeigLieblinge() {
      var l = lieblinge();
      probe = null;
      verlauf.push(anJetzt()); if (verlauf.length > 12) verlauf.shift();
      aendern(function (s) { laden(); for (var k in l.set) s.laden.an[k] = l.set[k]; });
      zeige(); auffrischen(); emit('kleid', C6.laden.an());
      drehen(); setTimeout(posieren, 520);
      sag(l.ausVerlauf ? satz('laden.lieblinge', 'Das trag ich am liebsten. Du hast es mir oft gegeben.') : satz('laden.lieblingeNeu', 'Mütze, Halstuch, deine Socken. So mag ich mich. Frag mich in einer Woche nochmal.'), true);
    }
    buehne.querySelector('.c6s-l-lieb').onclick = zeigLieblinge;
    spiegel.onclick = function () {
      drehen(); setTimeout(posieren, 520);
      if (!S().ladenDreh) { aendern(function (s) { s.ladenDreh = Date.now(); }); setTimeout(function () { sag('So sieht es von hinten aus. Auch gut, finde ich.', true); }, 900); }
      else sag('Ich seh gut aus. Du hast ein Auge dafür.');
    };
    function federTuer(b) {
      var t = b.querySelector('.c6s-l-tuer'); if (!t || C6.ruhig) return;
      try { t.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.42)', offset: .32 }, { transform: 'scaleX(1.06)', offset: .7 }, { transform: 'scaleX(.97)', offset: .86 }, { transform: 'scaleX(1)' }], { duration: 900, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
    }
    function kullern(b) {
      var r = b.querySelector('.c6s-l-rollen'); if (!r || C6.ruhig) return;
      try { r.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-9px,-7px) rotate(-6deg)', offset: .3 }, { transform: 'translate(-14px,0) rotate(-12deg)', offset: .55 }, { transform: 'translate(-10px,-2px) rotate(-9deg)', offset: .75 }, { transform: 'translate(0,0)' }], { duration: 1100, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
      var p = buehne.querySelector('.c6s-l-pflanze .c6s-l-blaetter');
      if (p) { try { p.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-4deg)', offset: .35 }, { transform: 'rotate(2.5deg)', offset: .7 }, { transform: 'rotate(0)' }], { duration: 1400, easing: 'ease-in-out' }); } catch (e) {} }
    }
    Array.prototype.forEach.call(buehne.querySelectorAll('.c6s-l-ding[data-kat]'), function (b) {
      b.onclick = function () {
        waehleKat(b.dataset.kat, true);
        if (b.classList.contains('c6s-l-schrank')) federTuer(b);
        else if (b.classList.contains('c6s-l-kommode') || b.classList.contains('c6s-l-kommode2')) kullern(b);
        else { try { b.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)', offset: .4 }, { transform: 'translateY(0)' }], { duration: 320, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
        if (ctl && ctl.schau) { var r = b.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height * .4); setTimeout(function () { try { ctl.schau(); } catch (e) {} }, 1500); }
      };
    });

    // ---------- Licht und Schatten: die Lampe auf der Kommode ----------
    function lampe() {
      var pc = C6.geraet === 'computer', k = buehne.querySelector(pc ? '.c6s-l-kommode' : '.c6s-l-wandlampe');
      var r = buehne.getBoundingClientRect(), q = { x: pc ? .3 : .68, y: pc ? .36 : .3, art: 'lampe', warm: .9, staerke: .7, hoehe: .55 };
      if (k && r.width) { var kr = k.getBoundingClientRect(); if (kr.width) { q.x = (kr.left + kr.width * (pc ? .44 : .45) - r.left) / r.width; q.y = (kr.top + kr.height * (pc ? .22 : .45) - r.top) / r.height; } }
      try { C6.lichtquelle && C6.lichtquelle.setze('laden', q); } catch (e) {}
      buehne.style.setProperty('--c6s-lx', (q.x * 100).toFixed(1) + '%'); buehne.style.setProperty('--c6s-ly', (q.y * 100).toFixed(1) + '%');
      return q;
    }
    function schatten() {
      var r = buehne.getBoundingClientRect(); if (!r.width) return;
      var q = lampe();
      Array.prototype.forEach.call(buehne.querySelectorAll('.c6s-l-fuss-schatten'), function (el) {
        var cs = getComputedStyle(el); if (cs.display === 'none') return;
        var b = el.getBoundingClientRect(); if (!b.width) return;
        var x = (b.left + b.width / 2 - r.left) / r.width, y = (b.bottom - r.top) / r.height, sch = null;
        try { sch = C6.lichtquelle && C6.lichtquelle.schatten(x, y, b.height); } catch (e) {}
        if (!sch) { var dx = x - q.x, dy = y - q.y, l = Math.hypot(dx, dy) || 1; sch = { dx: dx / l * 14, dy: Math.max(1, dy / l * 6), a: .2, skala: 1.2 }; }
        el.style.setProperty('--c6s-sdx', Math.round(sch.dx) + 'px'); el.style.setProperty('--c6s-sdy', Math.round(Math.min(6, sch.dy)) + 'px');
        el.style.setProperty('--c6s-sa', (sch.a * .9).toFixed(2)); el.style.setProperty('--c6s-ssk', Math.min(1.5, sch.skala || 1.2).toFixed(2));
        // Eigenschatten: die lichtabgewandte Seite
        var g = el.querySelector('linearGradient'); if (g) { var links = x < q.x; g.setAttribute('x1', links ? 1 : 0); g.setAttribute('x2', links ? 0 : 1); }
      });
      var tp = buehne.querySelector('.c6s-l-teppich');
      if (tp) { var tdx = ((.5 - q.x) * 10).toFixed(1); tp.style.boxShadow = tdx + 'px 3px 0 rgba(43,39,34,.12)'; }
      if (schweb && ctl) { var cb = ctl.el.getBoundingClientRect(), cx = (cb.left + cb.width / 2 - r.left) / r.width; schweb.style.setProperty('--c6s-sdx', Math.round((cx - q.x) * 40) + 'px'); }
    }

    // ---------- Wartezeit: Carl setzt sich (Computer aufs Bett, iPhone auf den Teppich) ----------
    var sitztWarte = false;
    function setzDich() {
      if (!ctl || schwebt || sitztWarte || (ctl.gewohnheiten)) return;
      sitztWarte = true;
      var bett = buehne.querySelector('.c6s-l-bett'), pc = C6.geraet === 'computer';
      if (pc && bett && getComputedStyle(bett).display !== 'none' && ctl.geh) {
        var br = bett.getBoundingClientRect(), cr = ctl.el.getBoundingClientRect();
        var zielX = br.left + br.width * .62, zielUnten = br.top + br.height * .56;
        var dx = zielX - (cr.left + cr.width / 2 - (ctl.x || 0)), dy = zielUnten - (cr.bottom - (ctl.y || 0));
        try { ctl.geh(dx, C6.ruhig ? 0 : 900, { y: dy, skala: .8 }); } catch (e) {}
        setTimeout(function () { if (sitztWarte) { try { ctl.sitz(true); } catch (e) {} } }, C6.ruhig ? 0 : 950);
      } else { try { ctl.sitz(true); } catch (e) {} }
      sag(satz('laden.sitzen', 'Ich setz mich kurz. Du entscheidest trotzdem.'));
    }
    function stehAuf() {
      if (!ctl) return;
      // die Figur setzt sich bei Wartezeit selbst (Gewohnheit 'sitzen'); aufstehen lässt sie der Raum
      if (!sitztWarte) { if (!schwebt && ctl.sitztJetzt) { try { ctl.sitz(false); } catch (e) {} } return; }
      sitztWarte = false;
      try { ctl.sitz(false); } catch (e) {}
      try { ctl.geh && ctl.geh(0, C6.ruhig ? 0 : 700, { y: 0, skala: 1 }); } catch (e) {}
    }

    function probiere(id) {
      var a = NACH[id];
      var l = laden().an;
      // Was dir gehört (geschenkt oder gekauft), zieht Carl sofort an. Nochmal tippen: wieder aus (Socken bleiben dran).
      if (hat(id)) {
        if (l[a.kat] === id) { probe = null; if (a.kat === 'socken' || a.kat === 'wimpern' || a.kat === 'gefaehrt') { auffrischen(); huepf(8); } else ziehAus(a.kat); return; }
        ziehAn(id);
        froh(); huepf(10);
        setTimeout(posieren, 380);
        if (a.kat === 'gefaehrt') { gefaehrtSatz(id); return; }
        var s = SAGT[a.kat]; if (s && Math.random() < .5) sag(s[Math.floor(Math.random() * s.length)]);
        return;
      }
      if (l[a.kat] === id && !probe) { auffrischen(); huepf(8); return; }
      // Beim ersten Stück, das Münzen kostet, sagt Carl, wo die Münzen herkommen (einmal je Gerät)
      var gefNeu = a.kat === 'gefaehrt' && !(S().ladenGefaehrt || {})[id];
      if (!S().ladenMuenzen && !gefNeu) { aendern(function (s) { s.ladenMuenzen = Date.now(); }); setTimeout(function () { if (C6.jetzt === 'laden') sag(woherMuenzen(), true); }, 450); }
      probe = (l[a.kat] === id) ? null : id;
      zeige();
      froh(); huepf(10);
      setTimeout(posieren, 380);
      auffrischen();
      if (a.kat === 'gefaehrt' && probe) gefaehrtSatz(id);
    }
    // Beim ersten Anprobieren je Gefährt sagt Carl einen Satz (leise, einer über sich selbst)
    var GEF_SATZ = {
      'g-ufo': ['gefaehrt.anprobe', 'Ein UFO. Ich hab noch nie Platz gehabt zum Sitzen da oben.'],
      'g-couch': ['gefaehrt.couch', 'Eine Couch, die fliegt. Ich bleib trotzdem sitzen, versprochen.'],
      'g-wolke': ['gefaehrt.wolke', 'Weich. Ich versink ein bisschen, das soll so.'],
      'g-tasse': ['gefaehrt.tasse', 'Eine Tasse. Dann bin ich wohl der Tee.']
    };
    function gefaehrtSatz(id) {
      var g = GEF_SATZ[id]; if (!g) return;
      var gesagtSchon = (S().ladenGefaehrt || {})[id];
      if (gesagtSchon) return;
      aendern(function (s) { s.ladenGefaehrt = s.ladenGefaehrt || {}; s.ladenGefaehrt[id] = Date.now(); });
      var t = '';
      try { if (C6.stimme && C6.stimme.gefaehrt) t = C6.stimme.gefaehrt(id.replace(/^g-/, ''), 'anprobe', { name: NACH[id].name }); } catch (e) {}
      if (!t) t = satz(g[0], g[1]);
      setTimeout(function () { if (C6.jetzt === 'laden') sag(t, true); }, 500);
    }
    function ziehAn(id) {
      var a = NACH[id];
      verlauf.push(anJetzt()); if (verlauf.length > 12) verlauf.shift();
      aendern(function (s) { laden(); s.laden.an[a.kat] = id; s.laden.oft = s.laden.oft || {}; s.laden.oft[id] = (s.laden.oft[id] || 0) + 1; });
      probe = null; zeige(); auffrischen();
      emit('kleid', C6.laden.an());
    }
    function ziehAus(k) {
      verlauf.push(anJetzt());
      aendern(function (s) { laden(); s.laden.an[k] = null; });
      probe = null; zeige(); auffrischen();
      emit('kleid', C6.laden.an());
    }
    haupt.onclick = function () {
      var id = haupt.dataset.id, art = haupt.dataset.art;
      if (art === 'kaufen') {
        var a = NACH[id];
        if (!C6.muenzen || !C6.muenzen.ausgeben(a.preis)) {
          sag(satz('laden.zuwenig', 'Dafür reichen die Münzen noch nicht. Es läuft nicht weg.'), true);
          return;
        }
        aendern(function (s) { laden(); if (s.laden.besitz.indexOf(id) < 0) s.laden.besitz.push(id); });
        ziehAn(id);
        sag(satz('laden.gekauft', 'Steht mir. Sag nichts.'), true);
        huepf(16); setTimeout(posieren, 400);
      } else if (art === 'an') ziehAn(id);
      else if (art === 'aus') ziehAus(NACH[id].kat);
    };
    zurueckB.onclick = function () {
      if (probe) { probe = null; zeige(); auffrischen(); return; }
      var v = verlauf.pop(); if (!v) return;
      aendern(function (s) { laden(); s.laden.an = v; });
      zeige(); auffrischen();
      emit('kleid', C6.laden.an());
    };
    function auffrischen() {
      var l = laden().an;
      ARTIKEL.forEach(function (a) {
        var b = kartenJe[a.id], p = b.querySelector('.c6s-l-preis');
        var traegt = l[a.kat] === a.id || (a.kat === 'wimpern' && !l.wimpern && a.id === 'w-fein') || (a.kat === 'gefaehrt' && !l.gefaehrt && a.id === 'g-fuss'), besitz = hat(a.id);
        b.classList.toggle('c6s-traegt', traegt);
        b.classList.toggle('c6s-probe', probe === a.id);
        b.setAttribute('aria-pressed', probe === a.id || (traegt && !probe));
        if (traegt) p.innerHTML = '<span class="c6s-l-zeichen">trag ich</span>';
        else if (a.preis === 0) p.textContent = 'geschenkt';
        else if (besitz) p.textContent = 'deins';
        else p.innerHTML = (C6.muenzen ? C6.muenzen.muenze(18) : '') + '<span>' + a.preis + '</span>';
        b.setAttribute('aria-label', a.name + (traegt ? ', trag ich' : a.preis === 0 ? ', geschenkt' : besitz ? ', deins' : ', ' + a.preis + ' Münzen'));
      });
      var sel = probe || null;
      if (sel) {
        var a = NACH[sel];
        haupt.hidden = false; haupt.dataset.id = sel;
        if (hat(sel)) { haupt.dataset.art = 'an'; haupt.textContent = 'Anziehen'; haupt.classList.remove('c6s-zuwenig'); }
        else {
          haupt.dataset.art = 'kaufen';
          haupt.innerHTML = 'Kaufen · ' + (C6.muenzen ? C6.muenzen.muenze(18, 'c6s-hell') : '') + a.preis;
          haupt.classList.toggle('c6s-zuwenig', !C6.muenzen || C6.muenzen.stand() < a.preis);
        }
      } else {
        var tr = l[kat];
        if (tr && kat !== 'fell' && kat !== 'socken' && kat !== 'wimpern' && kat !== 'gefaehrt') { haupt.hidden = false; haupt.dataset.id = tr; haupt.dataset.art = 'aus'; haupt.textContent = 'Ausziehen'; haupt.classList.remove('c6s-zuwenig'); }
        else haupt.hidden = true;
      }
      zurueckB.hidden = !(probe || verlauf.length);
      if (C6.muenzen) C6.muenzen.auffrischen();
    }

    waehleKat('socken', false);
    if (C6.bus) {
      C6.bus.on('muenzen', function () { if (C6.jetzt === 'laden') auffrischen(); });
      C6.bus.on('kleid', function (o) { beide(function (c) { c.kleid(o); }); if (C6.jetzt === 'laden') { auffrischen(); zeige(); } });
      C6.bus.on('warte', function (d) { if (C6.jetzt !== 'laden' || !d) return; if (d.stufe === 2) setzDich(); });
      C6.bus.on('wach', function () { if (C6.jetzt === 'laden') stehAuf(); });
      C6.bus.on('raum', function (id) { if (id === 'laden') setTimeout(schatten, 60); });
    }
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(function () { groesse(); schatten(); }) : null;
    if (ro) { ro.observe(carlBox); ro.observe(buehne); }

    return {
      betreten: function (o) {
        o = o || {};
        figur();
        if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'laden');
        buehne.classList.remove('c6s-ruht');
        auffrischen();
        beide(function (c) { c.kleid(C6.laden.an()); });
        groesse(); setTimeout(groesse, 300);
        if (o.reihe && KAT.some(function (k) { return k.id === o.reihe; })) waehleKat(o.reihe, true);
        zeige(); schatten(); setTimeout(schatten, 350);
        if (!gesagt && !o.rundgang && !(C6.rundgang && C6.rundgang.an)) {
          gesagt = true;
          setTimeout(function () {
            if (C6.jetzt !== 'laden') return;
            try {
              var erst = !S().ladenZimmer;
              if (erst) aendern(function (s) { s.ladenZimmer = Date.now(); });
              C6.sag(erst ? 'Mein Ankleidezimmer. ' + satz('laden.spiegel', 'Tipp den Spiegel an, dann dreh ich mich.') : satz('laden.rein', 'Ich probier gern an. Du entscheidest.'));
              zuletztGesagt = Date.now();
            } catch (e) {}
          }, 500);
        }
      },
      verlassen: function () { if (probe) { probe = null; zeige(); } stehAuf(); buehne.classList.add('c6s-ruht'); schwebe(null); },
      groesse: groesse
    };
  }
});
