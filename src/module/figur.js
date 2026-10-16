// Carl · die Figur. Ein Kiesel aus Filz mit Keimblattpaar: er atmet, schaut, blinzelt, verlagert sein Gewicht und freut sich.
var C6 = window.C6 = window.C6 || {};
var NS = 'http://www.w3.org/2000/svg';
var W = 240, H = 270, CX = 120, BODEN = 258, M = 20;
var RUHIG = function () { return !!C6.ruhig; };

// Gestalt (Figur-Einheiten, m = 20 = Körperbreite / 8)
var G = { kb: 80, kOben: 68, kUnten: 56, nOben: 2.25, nUnten: 3.1, kuppe: 9, lean: 0.05, taper: 0, bein: 50, huefte: 32, aug: { rx: 15, ry: 17, dy: -6, ab: 26, rr: 1.08, hoch: 4 }, blattR: 40, blattL: 33, stiel: 19 };
G.unten = BODEN - G.bein;            // Unterkante Körper
G.kMitte = G.unten - G.kUnten;       // Teilung Kuppe / Boden
var STEIN = '#ece4d6', BAND = '#3d3732', TUSCHE = '#2b2722';

function sg(v) { return v < 0 ? -1 : 1; }
function f1(v) { return Math.round(v * 10) / 10; }
function klemm(v, a, b) { return v < a ? a : v > b ? b : v; }

// Umriss des Kiesels: oben Kuppe (rechts höher, leicht nach rechts geneigt), unten breit und satt
function umriss(N) {
  var p = [];
  for (var i = 0; i < N; i++) {
    var t = i / N * Math.PI * 2, c = Math.cos(t), s = Math.sin(t), oben = s < 0;
    var n = oben ? G.nOben : G.nUnten, b = oben ? G.kOben : G.kUnten;
    var x = G.kb * sg(c) * Math.pow(Math.abs(c), 2 / n);
    var y = b * sg(s) * Math.pow(Math.abs(s), 2 / n);
    if (oben) { x *= 1 + G.taper * Math.abs(s); y -= G.kuppe * 0.5 * (x / G.kb) * Math.abs(s); }
    x += G.lean * Math.min(0, y) * -1;
    p.push([CX + x, G.kMitte + y]);
  }
  return p;
}
function glatt(p) { // geschlossene Catmull-Rom-Kurve
  var n = p.length, d = 'M' + f1(p[0][0]) + ',' + f1(p[0][1]);
  for (var i = 0; i < n; i++) {
    var a = p[(i - 1 + n) % n], b = p[i], c = p[(i + 1) % n], e = p[(i + 2) % n];
    d += 'C' + f1(b[0] + (c[0] - a[0]) / 6) + ',' + f1(b[1] + (c[1] - a[1]) / 6) + ' ' + f1(c[0] - (e[0] - b[0]) / 6) + ',' + f1(c[1] - (e[1] - b[1]) / 6) + ' ' + f1(c[0]) + ',' + f1(c[1]);
  }
  return d + 'Z';
}
var PUNKTE = umriss(96), KOERPER = glatt(PUNKTE);
function obenBei(x) { var best = 999; PUNKTE.forEach(function (p) { if (Math.abs(p[0] - x) < 5 && p[1] < best) best = p[1]; }); return best; }
function breiteBei(y) { var l = 999, r = -999; PUNKTE.forEach(function (p) { if (Math.abs(p[1] - y) < 4) { l = Math.min(l, p[0]); r = Math.max(r, p[0]); } }); return [l, r]; }
var KX = CX + 6;
var KOPF = { x: KX, y: Math.round(obenBei(KX) + 2) };
// Gesicht: viel Stirn, Augen tief und nah, groß und hell (ganz Bernstein), kleiner Mund
var GV = { rx: 14.8, ry: 16.4, ab: 24, dy: 4, hoch: 1.2, rr: 1.02, pup: 0.45, glanz: 0.4, my: 0.4, mw: 1.1, wx: 14, wy: 1 };
G.aug = { rx: GV.rx, ry: GV.ry, dy: GV.dy, ab: GV.ab, rr: GV.rr, hoch: GV.hoch };
var AUG = (function () {
  var a = G.aug, my = G.kMitte + a.dy, mx = CX + 2;
  return {
    L: { x: f1(mx - a.ab), y: f1(my + a.hoch / 2), rx: a.rx, ry: a.ry },
    R: { x: f1(mx + a.ab), y: f1(my - a.hoch / 2), rx: f1(a.rx * a.rr), ry: f1(a.ry * a.rr) },
    m: { x: f1(mx), y: f1(my) }
  };
})();
var MUND = { x: AUG.m.x + 1, y: f1(AUG.m.y + G.aug.ry + GV.my) };
var WANGE = { L: { x: f1(AUG.L.x - GV.wx), y: f1(MUND.y - GV.wy + 2), rx: 11.5, ry: 7.2 }, R: { x: f1(AUG.R.x + GV.wx + 1), y: f1(MUND.y - GV.wy + 1), rx: 12, ry: 7.4 } };
var ANKER = {
  kopf: KOPF, augen: { x: AUG.m.x, y: AUG.m.y },
  hals: { x: CX, y: Math.round(G.unten - 14) },
  wimpern: { L: { x: AUG.L.x, y: AUG.L.y }, R: { x: AUG.R.x, y: AUG.R.y }, rx: f1(AUG.L.rx / M * 100) / 100, ry: f1(AUG.L.ry / M * 100) / 100 },
  koerper: { x: CX, y: Math.round(G.kMitte + 4) },
  fussL: { x: CX - G.huefte, y: BODEN }, fussR: { x: CX + G.huefte, y: BODEN }
};
ANKER.gefaehrt = { x: ANKER.koerper.x, y: ANKER.koerper.y, m: M };

// Farbe heller/dunkler
function ton(hex, amt) {
  var m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return hex;
  var n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function k(v) { return Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt)))); }
  return '#' + ((1 << 24) + (k(r) << 16) + (k(g) << 8) + k(b)).toString(16).slice(1);
}
var FARBWORT = { rot: '#c8463d', blau: '#4f7cac', hellblau: '#8db4d6', dunkelblau: '#2f4b7c', gruen: '#6f9a5b', 'grün': '#6f9a5b', gelb: '#e2b93b', orange: '#e0813a', lila: '#8a6bb0', violett: '#8a6bb0', rosa: '#e39aae', pink: '#d96a95', schwarz: '#2f2b28', weiss: '#f3efe8', 'weiß': '#f3efe8', grau: '#9a948b', braun: '#8a5f3f', 'türkis': '#3fa3a0', tuerkis: '#3fa3a0', beige: '#d8c3a0', senf: '#c9a03a' };
function farbe(v, ersatz) {
  if (!v) return ersatz;
  if (typeof v === 'object') v = v.farbe;
  if (typeof v !== 'string') return ersatz;
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  return FARBWORT[v.trim().toLowerCase()] || ersatz;
}

// Keimblatt: fleischig, löffelförmig, Grundpunkt (0,0), zeigt nach oben
function blattPfad(L, w) {
  return 'M0,0C' + f1(w * 0.55) + ',' + f1(-L * 0.12) + ' ' + f1(w * 1.12) + ',' + f1(-L * 0.42) + ' ' + f1(w * 1.02) + ',' + f1(-L * 0.74) +
    'C' + f1(w * 0.92) + ',' + f1(-L * 1.02) + ' ' + f1(-w * 0.55) + ',' + f1(-L * 1.05) + ' ' + f1(-w * 0.86) + ',' + f1(-L * 0.74) +
    'C' + f1(-w * 1.08) + ',' + f1(-L * 0.46) + ' ' + f1(-w * 0.42) + ',' + f1(-L * 0.12) + ' 0,0Z';
}

// Haltung je Stimmung: Blätter (Grad von der Senkrechten), Oberlid/Unterlid (0..1), Lidneigung (Grad, + = außen tiefer)
// Mund m: [halbe Breite, offen 0..1, Lächeln -1..1, rund 0..1, seitlich]
var STIMMUNG = {
  ruhig: { bR: 56, bL: -62, lid: 0, unter: 0, lw: 0, dl: 0, wange: 0.42, neig: 0, auf: 0, gross: 1, m: [7, 0, 0.8, 0, 0] },
  hoert: { bR: 30, bL: -34, lid: 0, unter: 0, lw: 0, dl: 0, wange: 0.42, neig: -3, auf: 0.015, gross: 1.05, m: [5, 0.3, 0.35, 0.5, 0] },
  froh: { bR: 44, bL: -48, lid: 0, unter: 0.26, lw: 0, dl: 0, wange: 0.7, neig: 0, auf: 0.02, gross: 1, m: [11, 0.85, 1, 0, 0] },
  denkt: { bR: 80, bL: -18, lid: 0.06, unter: 0.04, lw: 1, dl: 0.04, wange: 0.38, neig: 6, auf: 0, gross: 1, m: [4, 0.16, 0, 0.75, 4] },
  arbeitet: { bR: 22, bL: -56, lid: 0.05, unter: 0.1, lw: 2, dl: 0, wange: 0.42, neig: 3, auf: 0, gross: 1, m: [6, 0, 0.45, 0, 2.5] },
  staunt: { bR: 18, bL: -22, lid: 0, unter: 0, lw: 0, dl: 0, wange: 0.46, neig: -3, auf: 0.035, gross: 1.1, m: [6.2, 1.15, 0, 1, 0] },
  zieht: { bR: 96, bL: -44, lid: 0.06, unter: 0.2, lw: 2, dl: 0, wange: 0.55, neig: -4, auf: 0.01, gross: 1, m: [8.5, 0.32, 0.2, 0, 0] },
  schlaeft: { bR: 112, bL: -118, lid: 1.04, unter: 0, lw: 0, dl: 0, wange: 0.3, neig: -3, auf: -0.02, gross: 1, m: [3.4, 0.22, 0, 0.9, 0] }
};
// Gewohnheiten, die ein Raum erlauben kann (Dauer in Sekunden)
var GEWOHNHEIT = { lesen: 9, gaehnen: 2.8, summen: 7, schrauben: 7, umsehen: 3.3, sitzen: 0 };

// Mund: zwei weiche Bögen zwischen zwei Mundwinkeln; geschlossen ist es ein Strich
function mundD(w, auf, lach, rund) {
  auf = Math.max(0, auf); rund = Math.max(0, Math.min(1, rund));
  var ecke = -lach * 2.6 * (1 - rund), k = 0.55 + rund * 0.45;
  var o = lach * 3.4 * (1 - rund) - auf * rund * 7.5 + auf * (1 - rund) * 0.4;
  var u = o + auf * (11 - rund * 3.5);
  return 'M' + f1(-w) + ',' + f1(ecke) + 'C' + f1(-w * k) + ',' + f1(o) + ' ' + f1(w * k) + ',' + f1(o) + ' ' + f1(w) + ',' + f1(ecke) +
    'C' + f1(w * k) + ',' + f1(u) + ' ' + f1(-w * k) + ',' + f1(u) + ' ' + f1(-w) + ',' + f1(ecke) + 'Z';
}

var GF_T = 'translate(' + ANKER.koerper.x + ',' + ANKER.koerper.y + ') scale(' + M + ')';
var zaehler = 0;
function markup(id, opt) {
  opt = opt || {};
  var u = function (n) { return n + '-' + id; };
  var st = STIMMUNG[opt.stimmung] || STIMMUNG.ruhig;
  var klein = !!opt.klein, K = klein ? 1.9 : 1, ES = klein ? 1.22 : 1;
  var strich = f1(2.4 * K);
  // Das Innere des Auges: klar, hell, ohne dunklen Rand
  function augInnen(rx, ry) {
    return '<ellipse rx="' + f1(rx) + '" ry="' + f1(ry) + '" fill="#e79a3a"/>' +
      '<g class="c6z-pupille"><ellipse rx="' + f1(rx * 1.25) + '" ry="' + f1(ry * 1.2) + '" fill="url(#' + u('iris') + ')"/>' +
      '<circle r="' + f1(rx * GV.pup) + '" cy="' + f1(ry * 0.06) + '" fill="#2a1709"/></g>';
  }
  function mund() {
    var m = st.m, w = m[0] * GV.mw * (klein ? 1.5 : 1), d = mundD(w, m[1], m[2], m[3]);
    return '<g class="c6z-mund" transform="translate(' + f1(MUND.x + m[4]) + ',' + MUND.y + ')">' +
      '<clipPath id="' + u('mc') + '"><path class="c6z-mund-c" d="' + d + '"/></clipPath>' +
      '<path class="c6z-mund-f" d="' + d + '" fill="#6a2a20"/>' +
      '<ellipse class="c6z-zunge" clip-path="url(#' + u('mc') + ')" cx="0" cy="' + f1(5 + m[1] * 6) + '" rx="' + f1(w * 0.62) + '" ry="5" fill="#ee8c78"/>' +
      '<path class="c6z-mund-s" d="' + d + '" fill="none" stroke="' + TUSCHE + '" stroke-width="' + f1(2.5 * K) + '" stroke-linejoin="round" stroke-linecap="round"/></g>';
  }
  // Drei feine Wimpern am äußeren oberen Rand, leicht nach oben geschwungen
  function wimpern(rx, ry, sx) {
    var d = '';
    [[26, 5.2], [47, 6.4], [68, 5.6]].forEach(function (w) {
      var th = w[0] * Math.PI / 180, x = rx * Math.sin(th), y = -ry * Math.cos(th);
      var nx = x / (rx * rx), ny = y / (ry * ry), nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
      var dr = -0.32, cx = nx * Math.cos(dr) - ny * Math.sin(dr), cy = nx * Math.sin(dr) + ny * Math.cos(dr);
      var ex = x + cx * w[1], ey = y + cy * w[1];
      d += 'M' + f1(sx * x) + ',' + f1(y) + 'Q' + f1(sx * (x + cx * w[1] * 0.45 + 0.9)) + ',' + f1(y + cy * w[1] * 0.6) + ' ' + f1(sx * ex) + ',' + f1(ey);
    });
    return '<path class="c6z-w-std" d="' + d + '" fill="none" stroke="' + TUSCHE + '" stroke-width="2.2" stroke-linecap="round"/>';
  }
  function auge(a, k) {
    var rx = a.rx * ES, ry = a.ry * ES, lw = k === 'L' ? -st.lw : st.lw, p = Math.min(1.04, st.lid + (k === 'L' ? st.dl : 0));
    var c = ry * 0.28, e = -ry - 2, ue = ry + 1.5, c2 = ry * 0.3, X = rx + 6;
    var lidKante = 'M' + f1(-X) + ',' + f1(e + c) + 'Q0,' + f1(e - c) + ' ' + f1(X) + ',' + f1(e + c);
    var unterKante = 'M' + f1(-X) + ',' + f1(ue + c2) + 'Q0,' + f1(ue - c2) + ' ' + f1(X) + ',' + f1(ue + c2);
    var tO = 'rotate(' + lw + ') translate(0,' + f1(p * (ry * 2 + 3)) + ')', tU = 'rotate(' + lw + ') translate(0,' + f1(-st.unter * ry * 1.4) + ')';
    return '<g class="c6z-auge" data-a="' + k + '" transform="translate(' + a.x + ',' + a.y + ')">' +
      '<clipPath id="' + u('ac' + k) + '"><ellipse rx="' + f1(rx) + '" ry="' + f1(ry) + '"/></clipPath>' +
      '<clipPath id="' + u('ao' + k) + '"><path class="c6z-lid" transform="' + tO + '" d="' + lidKante + 'L' + f1(X) + ',' + f1(ry * 4) + 'L' + f1(-X) + ',' + f1(ry * 4) + 'Z"/></clipPath>' +
      '<clipPath id="' + u('au' + k) + '"><path class="c6z-unter" transform="' + tU + '" d="' + unterKante + 'L' + f1(X) + ',' + f1(-ry * 4) + 'L' + f1(-X) + ',' + f1(-ry * 4) + 'Z"/></clipPath>' +
      '<g clip-path="url(#' + u('ac' + k) + ')"><g clip-path="url(#' + u('ao' + k) + ')"><g clip-path="url(#' + u('au' + k) + ')">' +
      augInnen(rx, ry) +
      '<g class="c6z-glanz"><ellipse cx="' + f1(-rx * 0.3) + '" cy="' + f1(-ry * 0.36) + '" rx="' + f1(rx * GV.glanz) + '" ry="' + f1(rx * GV.glanz * 0.92) + '" fill="#fffdf6"/>' +
      '<circle cx="' + f1(rx * 0.36) + '" cy="' + f1(ry * 0.34) + '" r="' + f1(rx * 0.14) + '" fill="#fffdf6" opacity=".9"/></g>' +
      '<ellipse rx="' + f1(rx) + '" ry="' + f1(ry) + '" fill="none" stroke="' + TUSCHE + '" stroke-width="' + f1(3.2 * K) + '"/>' +
      '</g></g>' +
      '<path class="c6z-lidkante" transform="' + tO + '" d="' + lidKante + '" fill="none" stroke="' + TUSCHE + '" stroke-width="' + f1(2.5 * K) + '" stroke-linecap="round" opacity="' + (p > 0.05 ? 1 : 0) + '"/>' +
      '<path class="c6z-zu" d="M' + f1(-rx * 0.82) + ',' + f1(ry * 0.02) + 'Q0,' + f1(ry * 0.62) + ' ' + f1(rx * 0.82) + ',' + f1(ry * 0.02) + '" fill="none" stroke="' + TUSCHE + '" stroke-width="' + f1(3.2 * K) + '" stroke-linecap="round" opacity="' + (p > 0.9 ? 1 : 0) + '"/>' +
      '<path class="c6z-unterkante" transform="' + tU + '" d="' + unterKante + '" fill="none" stroke="' + TUSCHE + '" stroke-width="' + f1(1.8 * K) + '" stroke-linecap="round" opacity="' + (st.unter > 0.2 ? 0.6 : 0) + '"/>' +
      '</g>' +
      '<g class="c6z-wimpern" transform="rotate(' + lw + ') translate(0,' + f1(p * (ry + 3)) + ')">' + (klein ? '' : wimpern(rx, ry, k === 'L' ? -1 : 1)) +
      '<g class="c6z-k-wimpern" transform="scale(' + (k === 'L' ? -M : M) + ',' + M + ')"></g></g>' +
      '</g>';
  }
  function bein(seite, x) {
    var aus = seite === 'L' ? -1 : 1, top = G.unten - 16, fy = BODEN - 7.5, fx = x + aus * 3;
    // Schattenseite der Socke: eine Hälfte, die zur lichtabgewandten Seite gespiegelt wird
    var schatt = klein ? '' : '<g class="c6z-sockschatt" fill="' + TUSCHE + '" opacity="0"><rect class="c6z-ss-r" x="' + x + '" y="' + f1(BODEN - 30) + '" width="9.2" height="' + f1(fy - 3 - (BODEN - 30)) + '"/>' +
      '<path class="c6z-ss-f" d="M' + fx + ',' + f1(fy - 8.2) + 'A16,8.2 0 0 1 ' + f1(fx + 16) + ',' + fy + 'A16,8.2 0 0 1 ' + fx + ',' + f1(fy + 8.2) + 'Z"/></g>';
    return '<g class="c6z-bein" data-b="' + seite + '">' +
      '<g class="c6z-teil" data-t="3">' +
      '<path d="M' + f1(x - 8.5) + ',' + top + ' C' + f1(x - 9) + ',' + f1(top + 22) + ' ' + f1(x - 8) + ',' + f1(fy - 14) + ' ' + f1(x - 8) + ',' + f1(fy - 2) + ' L' + f1(x + 8) + ',' + f1(fy - 2) + ' C' + f1(x + 8) + ',' + f1(fy - 14) + ' ' + f1(x + 9) + ',' + f1(top + 22) + ' ' + f1(x + 8.5) + ',' + top + 'Z" fill="' + BAND + '"/>' +
      '<path d="M' + f1(x - 5.5) + ',' + f1(G.unten + 2) + ' L' + f1(x - 5) + ',' + f1(fy - 10) + '" stroke="#fff" stroke-opacity=".13" stroke-width="2.4" stroke-linecap="round"/>' +
      '<ellipse class="c6z-fuss" cx="' + f1(fx) + '" cy="' + fy + '" rx="16.5" ry="8.4" fill="' + BAND + '"/>' +
      '<ellipse cx="' + f1(fx - 6) + '" cy="' + f1(fy - 3.6) + '" rx="6.5" ry="2.2" fill="#fff" opacity=".13"/></g>' +
      '<g class="c6z-teil c6z-socke" data-t="5">' +
      '<path class="c6z-sockenstoff" d="M' + f1(x - 9.4) + ',' + f1(BODEN - 30) + ' L' + f1(x + 9.4) + ',' + f1(BODEN - 30) + ' L' + f1(x + 9.2) + ',' + f1(fy - 3) + ' L' + f1(x - 9.2) + ',' + f1(fy - 3) + 'Z" stroke="' + TUSCHE + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<ellipse class="c6z-sockenstoff" cx="' + f1(fx) + '" cy="' + fy + '" rx="16" ry="8.2" stroke="' + TUSCHE + '" stroke-width="2"/>' +
      '<rect class="c6z-sockenstoff" x="' + f1(x - 9.2) + '" y="' + f1(fy - 9) + '" width="18.4" height="8"/>' +
      schatt +
      '<rect class="c6z-sockenbund" x="' + f1(x - 10.4) + '" y="' + f1(BODEN - 32) + '" width="20.8" height="7" rx="2" stroke="' + TUSCHE + '" stroke-width="2"/>' +
      '<ellipse cx="' + f1(fx - 6) + '" cy="' + f1(fy - 3.4) + '" rx="5.5" ry="2" fill="#fff" opacity=".28"/>' +
      '<path d="M' + f1(x - 5) + ',' + f1(BODEN - 22) + ' L' + f1(x - 5) + ',' + f1(fy - 9) + '" stroke="#fff" stroke-opacity=".2" stroke-width="2.2" stroke-linecap="round"/>' +
      '</g>' +
      '<g class="c6z-k-socken' + seite + '" transform="translate(' + x + ',' + BODEN + ') scale(' + M + ')"></g>' +
      '</g>';
  }
  var bl = blattPfad, wR = G.blattR * 0.36, wL = G.blattL * 0.36;
  var bandY = G.unten - 22, bandB = breiteBei(bandY);
  function blattVerlauf(n) { return '<linearGradient id="' + u(n) + '" x1="0" y1="1" x2=".3" y2="0"><stop offset="0" stop-color="#6c8559"/><stop offset=".7" stop-color="#97ad7f"/><stop offset="1" stop-color="#b4c69b"/></linearGradient>'; }
  var s = '<svg class="c6z-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="' + NS + '" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<radialGradient id="' + u('stein') + '" class="c6z-g-stein" cx="38%" cy="30%" r="76%"><stop offset="0" class="c6z-st0" stop-color="#faf6ee"/><stop offset=".55" class="c6z-st1" stop-color="' + STEIN + '"/><stop offset="1" class="c6z-st2" stop-color="#cbbfac"/></radialGradient>' +
    '<radialGradient id="' + u('iris') + '" cx="50%" cy="70%" r="62%"><stop offset="0" stop-color="#ffe2a0"/><stop offset=".42" stop-color="#f6b44c"/><stop offset=".8" stop-color="#e0902e"/><stop offset="1" stop-color="#c77a26"/></radialGradient>' +
    '<radialGradient id="' + u('wange') + '"><stop offset="0" stop-color="#f07a62" stop-opacity=".8"/><stop offset=".6" stop-color="#f07a62" stop-opacity=".38"/><stop offset="1" stop-color="#f07a62" stop-opacity="0"/></radialGradient>' +
    blattVerlauf('blattR') + blattVerlauf('blattL') +
    '<radialGradient id="' + u('eigen') + '" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7d6c55" stop-opacity=".3"/><stop offset=".55" stop-color="#7d6c55" stop-opacity=".14"/><stop offset="1" stop-color="#7d6c55" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="' + u('saum') + '" gradientUnits="userSpaceOnUse" x1="' + (CX - 80) + '" y1="' + (G.kMitte - 70) + '" x2="' + (CX + 80) + '" y2="' + (G.unten) + '"><stop offset="0" stop-color="#fffdf8" stop-opacity="1"/><stop offset=".5" stop-color="#fffaf0" stop-opacity=".55"/><stop offset="1" stop-color="#fff0d6" stop-opacity=".7"/></linearGradient>' +
    '<filter id="' + u('weich') + '" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4"/></filter>' +
    '<clipPath id="' + u('koerper') + '"><path d="' + KOERPER + '"/></clipPath>' +
    '</defs>' +
    '<ellipse class="c6z-schatten" cx="' + CX + '" cy="' + (BODEN + 1) + '" rx="66" ry="6.5" fill="' + TUSCHE + '" opacity=".14"/>' +
    '<g class="c6z-wurzel">' +
    '<g class="c6z-gfh"><g class="c6z-gf-hinten" transform="' + GF_T + '"></g></g>' +
    '<g class="c6z-beine">' + bein('L', CX - G.huefte) + bein('R', CX + G.huefte) + '</g>' +
    '<g class="c6z-oben">' +
    '<g class="c6z-koerper">' +
    '<g class="c6z-teil" data-t="0">' +
    '<path class="c6z-leib" d="' + KOERPER + '" fill="url(#' + u('stein') + ')"/>' +
    '<g clip-path="url(#' + u('koerper') + ')">' +
    '<ellipse class="c6z-eigen" cx="' + CX + '" cy="' + G.kMitte + '" rx="104" ry="84" fill="url(#' + u('eigen') + ')" transform="translate(30,24)"/>' +
    (klein ? '' : '<path d="' + KOERPER + '" fill="none" stroke="url(#' + u('saum') + ')" stroke-width="18" filter="url(#' + u('weich') + ')"/>') +
    '<g class="c6z-k-fell"></g><g class="c6z-k-jacke"></g>' +
    '<path class="c6z-band" d="M' + (bandB[0] - 6) + ',' + f1(bandY + 1) + ' C' + f1(CX - 40) + ',' + f1(bandY + 7) + ' ' + f1(CX + 40) + ',' + f1(bandY + 5) + ' ' + (bandB[1] + 6) + ',' + f1(bandY - 3) + ' L' + (bandB[1] + 6) + ',' + (G.unten + 10) + ' L' + (bandB[0] - 6) + ',' + (G.unten + 10) + 'Z" fill="' + BAND + '"/>' +
    '<path d="M' + f1(bandB[0] + 8) + ',' + f1(bandY + 5) + ' C' + f1(CX - 40) + ',' + f1(bandY + 10) + ' ' + f1(CX + 40) + ',' + f1(bandY + 8) + ' ' + f1(bandB[1] - 8) + ',' + f1(bandY + 1) + '" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2" stroke-linecap="round"/>' +
    '</g>' +
    '<path d="' + KOERPER + '" fill="none" stroke="' + TUSCHE + '" stroke-width="' + strich + '" stroke-linejoin="round"/>' +
    '</g>' +
    '<g class="c6z-fd-schal"><g class="c6z-k-schal" transform="translate(' + ANKER.hals.x + ',' + ANKER.hals.y + ') scale(' + M + ')"></g></g>' +
    '<g class="c6z-gesicht">' +
    '<g class="c6z-teil" data-t="2"><ellipse class="c6z-wange" cx="' + WANGE.L.x + '" cy="' + WANGE.L.y + '" rx="' + WANGE.L.rx + '" ry="' + WANGE.L.ry + '" fill="url(#' + u('wange') + ')" opacity="' + st.wange + '"/>' +
    '<ellipse class="c6z-wange" cx="' + WANGE.R.x + '" cy="' + WANGE.R.y + '" rx="' + WANGE.R.rx + '" ry="' + WANGE.R.ry + '" fill="url(#' + u('wange') + ')" opacity="' + st.wange + '"/></g>' +
    '<g class="c6z-teil" data-t="1">' + auge(AUG.L, 'L') + auge(AUG.R, 'R') + '</g><g class="c6z-teil" data-t="4">' + mund() + '</g>' +
    '<g class="c6z-k-brille" transform="translate(' + ANKER.augen.x + ',' + ANKER.augen.y + ') scale(' + M + ')"></g>' +
    '</g>' +
    (klein ? '' : '<g class="c6z-lesen" opacity="0"><path d="M-28,-20 L26,-23 L30,19 L-24,23 Z" fill="#fbf7f0" stroke="' + TUSCHE + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M-18,-9 L16,-11 M-17,-1 L18,-2.5 M-16,7 L10,6 M-15,15 L14,14" fill="none" stroke="#8a8378" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path d="M30,19 L22,11 L19,20 Z" fill="#e9e1d2" stroke="' + TUSCHE + '" stroke-width="1.6" stroke-linejoin="round"/></g>') +
    '<g class="c6z-fd-muetze"><g class="c6z-k-muetze" transform="translate(' + KOPF.x + ',' + KOPF.y + ') scale(' + M + ')"></g></g>' +
    '<g class="c6z-teil" data-t="3"><g class="c6z-stiel">' +
    '<path d="M' + KOPF.x + ',' + (KOPF.y + 3) + 'q-2,' + f1(-G.stiel * 0.55) + ' 1,' + (-G.stiel) + '" fill="none" stroke="' + TUSCHE + '" stroke-width="' + f1(6.6 * Math.min(K, 1.4)) + '" stroke-linecap="round"/>' +
    '<path d="M' + KOPF.x + ',' + (KOPF.y + 3) + 'q-2,' + f1(-G.stiel * 0.55) + ' 1,' + (-G.stiel) + '" fill="none" stroke="#7d9468" stroke-width="2.8" stroke-linecap="round"/>' +
    '<g class="c6z-rotor"><ellipse class="c6z-scheibe" cx="' + (KOPF.x + 1) + '" cy="' + (KOPF.y - G.stiel) + '" rx="' + (G.blattR + 6) + '" ry="6" fill="#a9bd90" opacity="0"/>' +
    '<g class="c6z-blatt" data-l="R" transform="translate(' + (KOPF.x + 1) + ',' + (KOPF.y - G.stiel) + ')"><g class="c6z-dreh" transform="rotate(' + st.bR + ')"><g class="c6z-spitze">' +
    '<path d="' + bl(G.blattR, wR) + '" fill="url(#' + u('blattR') + ')" stroke="' + TUSCHE + '" stroke-width="' + f1(2.3 * Math.min(K, 1.5)) + '" stroke-linejoin="round"/>' +
    (klein ? '' : '<path d="M0,-3 Q' + f1(wR * 0.2) + ',' + f1(-G.blattR * 0.5) + ' ' + f1(wR * 0.05) + ',' + f1(-G.blattR * 0.85) + '" fill="none" stroke="#5d7150" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M' + f1(-wR * 0.55) + ',' + f1(-G.blattR * 0.3) + ' Q' + f1(-wR * 0.85) + ',' + f1(-G.blattR * 0.6) + ' ' + f1(-wR * 0.45) + ',' + f1(-G.blattR * 0.86) + '" fill="none" stroke="#e8efd9" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>') +
    '<g class="c6z-werkzeug" opacity="0" transform="translate(4,' + (-G.blattR + 4) + ') rotate(35)"><rect x="-2.6" y="-17" width="5.2" height="20" rx="1.2" fill="#e2b93b" stroke="' + TUSCHE + '" stroke-width="1.6"/><path d="M-2.6,3 L0,9 L2.6,3Z" fill="#f1dcb4" stroke="' + TUSCHE + '" stroke-width="1.4" stroke-linejoin="round"/><path d="M-.9,7.2 L0,9 L.9,7.2Z" fill="' + TUSCHE + '"/><rect x="-2.6" y="-19" width="5.2" height="3.4" rx="1" fill="#d98a8a" stroke="' + TUSCHE + '" stroke-width="1.4"/></g>' +
    '</g></g></g>' +
    '<g class="c6z-blatt" data-l="L" transform="translate(' + (KOPF.x + 1) + ',' + (KOPF.y - G.stiel) + ')"><g class="c6z-dreh" transform="rotate(' + st.bL + ')"><g class="c6z-spitze">' +
    '<g class="c6z-glatt"' + (opt.stimmung === 'denkt' ? ' opacity="0"' : '') + '><path d="' + bl(G.blattL, wL) + '" transform="scale(-1,1)" fill="url(#' + u('blattL') + ')" stroke="' + TUSCHE + '" stroke-width="' + f1(2.3 * Math.min(K, 1.5)) + '" stroke-linejoin="round"/>' +
    (klein ? '' : '<path d="M0,-3 Q' + f1(-wL * 0.2) + ',' + f1(-G.blattL * 0.5) + ' ' + f1(-wL * 0.05) + ',' + f1(-G.blattL * 0.85) + '" fill="none" stroke="#5d7150" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M' + f1(wL * 0.55) + ',' + f1(-G.blattL * 0.3) + ' Q' + f1(wL * 0.85) + ',' + f1(-G.blattL * 0.6) + ' ' + f1(wL * 0.45) + ',' + f1(-G.blattL * 0.86) + '" fill="none" stroke="#e8efd9" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>') + '</g>' +
    '<g class="c6z-kringel" opacity="' + (opt.stimmung === 'denkt' ? 1 : 0) + '"><path d="M0,0 C-9,-4 -12,-14 -9,-20 C-6,-27 3,-27 4,-21 C5,-16 -1,-14 -3,-17" fill="none" stroke="' + TUSCHE + '" stroke-width="7.4" stroke-linecap="round"/>' +
    '<path d="M0,0 C-9,-4 -12,-14 -9,-20 C-6,-27 3,-27 4,-21 C5,-16 -1,-14 -3,-17" fill="none" stroke="#97ab82" stroke-width="3.4" stroke-linecap="round"/></g>' +
    '</g></g></g>' +
    '</g></g></g>' +
    '<text class="c6z-zzz" x="' + (CX + 70) + '" y="' + (G.kMitte - 64) + '" opacity="0">z</text>' +
    '</g></g>' +
    '<g class="c6z-gfv"><g class="c6z-gf-vorn" transform="' + GF_T + '"></g></g>' +
    '</g></svg>';
  return s;
}

// ---------- Federn ----------
function feder(x, k, d) { return { x: x, v: 0, z: x, k: k, d: d }; }
function schritt(f, dt) { var a = -f.k * (f.x - f.z) - f.d * f.v; f.v += a * dt; f.x += f.v * dt; }
function ruht(f) { return Math.abs(f.x - f.z) < 0.002 && Math.abs(f.v) < 0.01; }

// ---------- gemeinsamer Takt: ein Hörer im Takt des Kerns, sonst ein eigener Rahmen ----------
var alle = [], laeuft = false, letzt = 0, zeiger = { x: 0, y: 0, t: -1e9 }, taktAb = null;
function schlag(t, dt) {
  var weiter = false;
  for (var i = 0; i < alle.length; i++) { var f = alle[i]; if (f.sicht && !document.hidden) f.lies(); }
  var oben = C6.hoeheJetzt && C6.hoeheJetzt !== 'boden';
  for (i = 0; i < alle.length; i++) {
    f = alle[i];
    if (!f.sicht || document.hidden) continue;
    if (oben) { var r = raumVon(f); if (r && r !== C6.jetzt) continue; }
    try { if (f.tick(t, dt)) weiter = true; } catch (e) { f.sicht = false; }
  }
  return weiter;
}
function raumVon(f) {
  if (f.raum === undefined) { var r = f.el.closest && f.el.closest('[data-raum]'); f.raum = r ? r.getAttribute('data-raum') : null; }
  return f.raum;
}
function eigenerTakt(ts) {
  if (!laeuft) return;
  var dt = Math.min(0.05, Math.max(0.001, (ts - (letzt || ts)) / 1000)); letzt = ts;
  if (schlag(ts / 1000, dt)) requestAnimationFrame(eigenerTakt); else { laeuft = false; letzt = 0; }
}
function wecke() {
  if (document.hidden) return;
  var T = C6.takt;
  if (T && typeof T.on === 'function') {
    if (!taktAb) { try { taktAb = T.on(function (t, dt) { return schlag(t, Math.min(0.05, Math.max(0.001, dt || 0.016))); }, { ruhig: true }); } catch (e) { taktAb = null; } }
    if (taktAb) { try { T.wecke(); } catch (e) { } return; }
  }
  if (!laeuft) { laeuft = true; letzt = 0; requestAnimationFrame(eigenerTakt); }
}
document.addEventListener('visibilitychange', function () { if (!document.hidden) wecke(); });
try { if (C6.bus) { C6.bus.on('raum', function () { setTimeout(wecke, 0); }); C6.bus.on('hoehe', function () { setTimeout(wecke, 0); }); } } catch (e) { }
window.addEventListener('pointermove', function (e) { zeiger.x = e.clientX; zeiger.y = e.clientY; zeiger.t = performance.now(); if (laeuft === false) wecke(); }, { passive: true });
window.addEventListener('pointerdown', function (e) { zeiger.x = e.clientX; zeiger.y = e.clientY; zeiger.t = performance.now(); wecke(); }, { passive: true });

var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
  es.forEach(function (e) { var f = e.target.__c6z; if (f) { f.sicht = e.isIntersecting; if (f.sicht) { f.mess = 0; wecke(); } } });
}) : null;

// Figuren, die im genannten Raum stehen (ohne Raum: im aktuellen) und auf Ereignisse reagieren dürfen
function figurenIn(raum) {
  raum = raum || C6.jetzt;
  return alle.filter(function (f) { if (!f.sicht || f.still) return false; var r = raumVon(f); return !r || !raum || r === raum; });
}

function male(el, opt) {
  opt = opt || {};
  var id = 'c6z' + (++zaehler);
  var still = opt.still != null ? !!opt.still : (opt.groesse != null && opt.groesse < 60);
  var klein = !!opt.klein || (opt.groesse != null && opt.groesse <= 52);
  var wrap = document.createElement('div');
  wrap.className = 'c6z-figur';
  wrap.setAttribute('role', 'img');
  wrap.setAttribute('aria-label', 'Carl');
  wrap.innerHTML = markup(id, { klein: klein, stimmung: 'ruhig' });
  el.appendChild(wrap);
  var svg = wrap.firstChild;
  function q(s) { return svg.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(svg.querySelectorAll(s)); }
  var n = {
    wurzel: q('.c6z-wurzel'), oben: q('.c6z-oben'), koerper: q('.c6z-koerper'), gesicht: q('.c6z-gesicht'), schatten: q('.c6z-schatten'),
    beine: q('.c6z-beine'), beinL: q('.c6z-bein[data-b=L]'), beinR: q('.c6z-bein[data-b=R]'), stiel: q('.c6z-stiel'),
    blattR: q('.c6z-blatt[data-l=R] .c6z-dreh'), blattL: q('.c6z-blatt[data-l=L] .c6z-dreh'),
    spitzeR: q('.c6z-blatt[data-l=R] .c6z-spitze'), spitzeL: q('.c6z-blatt[data-l=L] .c6z-spitze'),
    augen: qa('.c6z-auge'), pupillen: qa('.c6z-pupille'), glanz: qa('.c6z-glanz'), wangen: qa('.c6z-wange'),
    werkzeug: q('.c6z-werkzeug'), kringel: q('.c6z-kringel'), rotor: q('.c6z-rotor'), scheibe: q('.c6z-scheibe'),
    mund: q('.c6z-mund'), mundP: qa('.c6z-mund-c,.c6z-mund-f,.c6z-mund-s'), zunge: q('.c6z-zunge'), glatt: q('.c6z-glatt'), zzz: q('.c6z-zzz'),
    teile: qa('.c6z-teil'), stoff: qa('.c6z-sockenstoff'), bund: qa('.c6z-sockenbund'), sockschatt: qa('.c6z-sockschatt'),
    st0: qa('.c6z-st0'), st1: qa('.c6z-st1'), st2: qa('.c6z-st2'), band: q('.c6z-band'),
    gStein: q('.c6z-g-stein'), gBlattR: q('#blattR-' + id), gBlattL: q('#blattL-' + id), eigen: q('.c6z-eigen'),
    lesen: q('.c6z-lesen'), fdM: q('.c6z-fd-muetze'), fdS: q('.c6z-fd-schal'), gfh: q('.c6z-gfh'), gfv: q('.c6z-gfv'), gfHinten: q('.c6z-gf-hinten'), gfVorn: q('.c6z-gf-vorn')
  };
  n.augen.forEach(function (o) {
    o.__lid = Array.prototype.slice.call(o.querySelectorAll('.c6z-lid,.c6z-lidschatten,.c6z-lidkante'));
    o.__lk = o.querySelector('.c6z-lidkante'); o.__wim = o.querySelector('.c6z-wimpern'); o.__wstd = o.querySelector('.c6z-w-std'); o.__wk = o.querySelector('.c6z-k-wimpern');
    o.__unt = Array.prototype.slice.call(o.querySelectorAll('.c6z-unter,.c6z-unterkante')); o.__uk = o.querySelector('.c6z-unterkante'); o.__zu = o.querySelector('.c6z-zu');
  });
  var kleidG = {};
  ['socken' + 'L', 'socken' + 'R', 'muetze', 'schal', 'brille', 'jacke', 'fell'].forEach(function (k) { kleidG[k] = q('.c6z-k-' + k); });
  var ES = klein ? 1.22 : 1;

  var z = {
    st: STIMMUNG.ruhig, name: 'ruhig',
    sx: feder(1, 260, 12), sy: feder(1, 260, 12), neig: feder(0, 90, 14), hop: feder(0, 200, 18),
    bR: feder(56, 110, 6.5), bL: feder(-62, 110, 6.5), stiel: feder(0, 140, 9), tipR: feder(0, 240, 9), tipL: feder(0, 240, 9),
    gx: feder(0, 300, 30), gy: feder(0, 300, 30), lid: feder(0.2, 260, 30), unter: feder(0.08, 160, 22), lw: feder(5, 120, 18), dl: feder(0, 120, 18),
    wange: feder(0.36, 60, 14), gross: feder(1, 220, 16), kringel: feder(0, 120, 20), werk: feder(0, 140, 22), sitz: feder(0, 90, 11), sitzP: feder(0, 55, 10), sitzen: false,
    atem: Math.random() * 6, wind: Math.random() * 100, blinzel: 2.5 + Math.random() * 2, blinzelT: -1, blink: 0,
    idleZiel: { x: 0, y: 0 }, idleT: 0, schau: null, front: 0, kurz: null,
    x: 0, y: 0, skala: 1, gang: null, schritt: 0, huepf: null, druck: false, sprich: false, spT: 0,
    vx: 0, rect: null, mess: 0, zzzT: 0, groesse: opt.groesse || 220,
    mw: feder(7, 260, 22), ma: feder(0, 300, 20), ml: feder(0.8, 200, 20), mr: feder(0, 200, 20), mx: feder(0, 120, 18), spM: 0, spW: 1,
    fliegt: false, flug: feder(0, 16, 6.4), rotor: feder(0, 9, 5), rphi: 0, pL: feder(0, 50, 3.2), pR: feder(0, 50, 3.6), flugOk: [], gelandet: true,
    // Gewicht: auf welchem Bein er steht (-1 links im Bild, 0 mittig, 1 rechts) und wann er wieder umlagert
    stand: feder(0, 26, 7), standT: 5 + Math.random() * 6,
    // kleine Eigenhandlungen in Ruhe (zupfen, Schritt zur Seite, recken) und der seitliche Versatz dazu
    seit: feder(0, 70, 12), eh: null, ehT: 4 + Math.random() * 5, bdauer: 1,
    // Kleidung mit eigener Feder (Mütze dreht und wippt, Schal schwingt)
    fdM: feder(0, 170, 9), fdMy: feder(0, 230, 11), fdS: feder(0, 120, 7),
    // Gewohnheiten und Wartezeit
    gewListe: ['umsehen'], gew: null, nickt: false, nick: feder(0, 24, 8), nickPh: null, lese: feder(0, 150, 11), leseW: feder(0, 120, 9), hoertBis: 0,
    // Gefährt
    gefaehrt: null, imGf: false, gfP: feder(0, 40, 9), gfY: feder(0, 14, 4.4), gfNeig: feder(0, 40, 7), gfBeine: 'baumeln', gfSchwebt: true,
    // Licht: Richtung zur Quelle (Figur-Einheiten, Länge 1), Deckkraft, Höhe – gedrosselt gelesen, weich nachgeführt
    // leises Schweben als Grundzustand (landet beim Sitzen, Gehen, Schlafen, im Gefährt) · Sitz-Szenen · Schielen
    schweb: feder(0, 22, 8), schwebAn: opt.schweben === true ? true : opt.schweben === false || opt.rundgang ? false : null, sz: null, szT: 5, szLetzt: '', plumps: 0, schiel: feder(0, 150, 18),
    licht: { lx: -0.6, ly: -0.8, a: 0.14, hoehe: 0.7, st: 0.8 }, lz: { lx: -0.6, ly: -0.8, a: 0.14, hoehe: 0.7, st: 0.8 }, lichtT: 0, buehne: null, buehneR: null
  };

  var f = {
    sicht: !io, el: wrap, still: still, raum: undefined, ctl: null,
    lies: function () {
      if (z.mess-- <= 0) {
        var r = wrap.getBoundingClientRect(); z.rect = { x: r.left + r.width / 2, y: r.top + r.height * 0.5, w: r.width, h: r.height, l: r.left, t: r.top };
        if (z.buehne === null) z.buehne = (wrap.closest && wrap.closest('.c6-buehne')) || false;
        if (z.buehne) { var b = z.buehne.getBoundingClientRect(); z.buehneR = { l: b.left, t: b.top, w: b.width, h: b.height }; }
        z.mess = (z.gang || z.fliegt) ? 6 : 20;
      }
    },
    tick: tick
  };
  wrap.__c6z = f;
  f.ohneKleid = !!opt.rundgang;
  alle.push(f);
  if (io) io.observe(wrap);

  function setT(node, t) { if (node && node.__t !== t) { node.setAttribute('transform', t); node.__t = t; } }
  function setO(node, o) { o = Math.round(o * 100) / 100; if (node && node.__o !== o) { node.setAttribute('opacity', o); node.__o = o; } }
  function setA(node, k, v) { if (node && node['__' + k] !== v) { node.setAttribute(k, v); node['__' + k] = v; } }
  function r3(v) { return Math.round(v * 1000) / 1000; }
  function r2(v) { return Math.round(v * 100) / 100; }

  // Licht lesen: Quelle des Raums in Bühnen-Anteilen → Richtung von Carl zur Quelle (Bildschirm-Pixel)
  function liesLicht() {
    var q = null, raum = raumVon(f) || C6.jetzt;
    try { if (C6.lichtquelle && C6.lichtquelle.hol) q = C6.lichtquelle.hol(raum); } catch (e) { q = null; }
    if (!q) q = { x: 0.25, y: 0.12, staerke: 0.8, hoehe: 0.7 };
    var lz = z.lz, b = z.buehneR, r = z.rect;
    if (z.kl && z.kl.dir) { lz.lx = z.kl.dx; lz.ly = z.kl.dy; lz.st = z.kl.st; lz.hoehe = 0.5; lz.a = 0.2; return; }
    if (z.kl && z.kl.hat && r) {
      var kdx = z.kl.x - r.x, kdy = z.kl.y - (r.y + r.h * 0.1), kl = Math.hypot(kdx, kdy) || 1;
      lz.lx = kdx / kl; lz.ly = kdy / kl; lz.st = z.kl.st; lz.hoehe = 0.5; lz.a = 0.2;
      return;
    }
    if (b && r) {
      var px = b.l + q.x * b.w, py = b.t + q.y * b.h, dx = px - r.x, dy = py - (r.y + r.h * 0.2), l = Math.hypot(dx, dy) || 1;
      lz.lx = dx / l; lz.ly = dy / l;
    } else { lz.lx = -0.6; lz.ly = -0.8; }
    var a = null;
    if (z.buehne) { try { a = parseFloat(getComputedStyle(z.buehne).getPropertyValue('--c6-schatten-a')); } catch (e) { a = null; } }
    lz.a = (a != null && !isNaN(a)) ? a : 0.08 + 0.2 * (q.staerke == null ? 0.8 : q.staerke);
    lz.hoehe = q.hoehe == null ? 0.7 : q.hoehe; lz.st = q.staerke == null ? 0.8 : q.staerke;
  }
  // Licht auf die Figur schreiben: Steinverlauf, Eigenschatten, Augenglanz, Blätter, Socken (wenige Werte, nur bei Änderung)
  function schreibLicht(L) {
    var lx = L.lx, ly = L.ly;
    if (n.gStein) { setA(n.gStein, 'cx', Math.round(50 + lx * 26) + '%'); setA(n.gStein, 'cy', Math.round(40 + ly * 22) + '%'); }
    setT(n.eigen, 'translate(' + f1(-lx * 46) + ',' + f1(-ly * 34) + ')');
    [[n.gBlattR, z.bR.x, 1], [n.gBlattL, z.bL.x, -1]].forEach(function (p) {
      var g = p[0]; if (!g) return;
      var a = p[1] * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      var ux = (lx * c + ly * s) * p[2], uy = -lx * s + ly * c;
      setA(g, 'x1', r2(0.5 - ux * 0.5)); setA(g, 'y1', r2(0.5 - uy * 0.5)); setA(g, 'x2', r2(0.5 + ux * 0.5)); setA(g, 'y2', r2(0.5 + uy * 0.5));
    });
    var so = klein ? 0 : 0.09 * L.st;
    n.sockschatt.forEach(function (g, k) {
      var x = k ? CX + G.huefte : CX - G.huefte, fx = x + (k ? 3 : -3);
      if (!g.__r) { g.__r = g.querySelector('.c6z-ss-r'); g.__f = g.querySelector('.c6z-ss-f'); }
      setT(g.__r, lx > 0 ? 'translate(' + f1(2 * x) + ',0) scale(-1,1)' : '');
      setT(g.__f, lx > 0 ? 'translate(' + f1(2 * fx) + ',0) scale(-1,1)' : '');
      setO(g, so * Math.min(1, Math.abs(lx) * 1.6 + 0.3));
    });
    if (KL) klSchreib(L);
  }

  // Körperlicht: ein Raum mit einer Lichtquelle (Himmel: „Du“) gibt Carl Licht- und Schattenseite,
  // Randlicht, Gegenlicht aus dem Raum und einen Schlagschatten aufs Gefährt. Nur Verläufe, keine Filter.
  var KL = null;
  function neu(tag, at, eltern) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (eltern) eltern.appendChild(e); return e; }
  function verlauf(tag, kid, at, liste, defs) {
    var g = neu(tag, Object.assign({ id: kid }, at), defs);
    g.__s = liste.map(function (s) { return neu('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': 0 }, g); });
    g.__a = liste.map(function (s) { return s[2]; });
    return g;
  }
  function klBau() {
    if (KL || klein) return;
    var defs = svg.querySelector('defs'), kc = svg.querySelector('g[clip-path="url(#koerper-' + id + ')"]');
    if (!defs || !kc) return;
    var N = '#0c0f26', S2 = '#141838', W2 = '#ffd99a', B2 = '#8796e0';
    KL = { st: -1 };
    KL.gs = verlauf('radialGradient', 'kls-' + id, { gradientUnits: 'userSpaceOnUse', r: 128, cx: CX, cy: G.kMitte }, [[0, S2, 0], [0.4, S2, 0], [0.7, S2, 0.55], [0.9, N, 0.8], [1, N, 0.64]], defs);
    KL.gr = verlauf('linearGradient', 'klr-' + id, { gradientUnits: 'userSpaceOnUse' }, [[0, W2, 1], [0.3, W2, 0], [0.8, B2, 0], [1, B2, 0.42]], defs);
    KL.gg = verlauf('linearGradient', 'klg-' + id, { gradientUnits: 'userSpaceOnUse' }, [[0, W2, 0.24], [0.42, W2, 0], [0.56, S2, 0], [1, N, 0.6]], defs);
    KL.gw = verlauf('radialGradient', 'klw-' + id, {}, [[0, N, 0.62], [0.55, N, 0.38], [1, N, 0]], defs);
    KL.clip = neu('clipPath', { id: 'klc-' + id }, defs);
    KL.schatt = neu('rect', { x: CX - 110, y: G.kMitte - 100, width: 220, height: 200, fill: 'url(#kls-' + id + ')', 'class': 'c6z-kl' }, kc);
    KL.rand = neu('path', { d: KOERPER, fill: 'none', stroke: 'url(#klr-' + id + ')', 'stroke-width': 9, 'class': 'c6z-kl' }, kc);
    KL.saum = svg.querySelector('path[stroke="url(#saum-' + id + ')"]');
    if (KL.saum) KL.saum.setAttribute('opacity', '.3');
    KL.clipV = neu('clipPath', { id: 'klcv-' + id }, defs);
    KL.gfh = neu('g', { transform: GF_T, 'class': 'c6z-kl' }, n.gfh);
    KL.gfv = neu('g', { transform: GF_T, 'class': 'c6z-kl' }, n.gfv);
    // eine Fläche je Ebene, auf die Umrisse des Gefährts beschnitten (Überlappungen dunkeln nicht doppelt)
    KL.gfhF = neu('rect', { x: -11, y: -4, width: 22, height: 12, fill: 'url(#klg-' + id + ')', 'clip-path': 'url(#klc-' + id + ')' }, KL.gfh);
    KL.gfvF = neu('rect', { x: -11, y: -4, width: 22, height: 12, fill: 'url(#klg-' + id + ')', 'clip-path': 'url(#klcv-' + id + ')' }, KL.gfv);
    KL.wurf = neu('ellipse', { rx: 4.4, ry: 3.3, fill: 'url(#klw-' + id + ')', 'clip-path': 'url(#klc-' + id + ')' }, KL.gfh);
    klGf();
  }
  // Das Gefährt bekommt dieselbe Licht- und Schattenseite: Abbilder seiner Flächen mit dem Lichtverlauf darüber
  function klGf() {
    if (!KL) return;
    KL.clip.innerHTML = ''; KL.clipV.innerHTML = '';
    function flaechen(von, clip) {
      if (!von) return;
      Array.prototype.forEach.call(von.querySelectorAll('path,ellipse,circle,rect'), function (e) {
        var fi = e.getAttribute('fill') || '', cl = e.getAttribute('class') || '';
        if (/gf-eigen/.test(cl)) { e.style.display = 'none'; return; }
        if (!fi || fi === 'none' || /^url/.test(fi) || +(e.getAttribute('fill-opacity') || 1) < 0.6 || e.closest('defs')) return;
        var k = e.cloneNode(false), tr = [], v = e;
        while (v && v !== von) { if (v.getAttribute && v.getAttribute('transform')) tr.unshift(v.getAttribute('transform')); v = v.parentNode; }
        if (tr.length) k.setAttribute('transform', tr.join(' '));
        ['fill', 'stroke', 'stroke-width', 'class', 'style', 'opacity', 'stroke-linejoin', 'stroke-linecap'].forEach(function (a) { k.removeAttribute(a); });
        clip.appendChild(k);
      });
    }
    flaechen(n.gfHinten, KL.clip); flaechen(n.gfVorn, KL.clipV);
    KL.gfh.style.display = KL.clip.firstChild ? '' : 'none';
    KL.gfv.style.display = KL.clipV.firstChild ? '' : 'none';
    KL.st = -1; z.lichtNeu = true;
  }
  function klSchreib(L) {
    var d = ((z.kl && z.kl.dreh) || 0) * Math.PI / 180, c = Math.cos(d), s = Math.sin(d);
    var lx = L.lx * c + L.ly * s, ly = -L.lx * s + L.ly * c, st = r2((z.kl ? z.kl.st : 0.85));
    if (KL.st !== st) {
      KL.st = st;
      [KL.gs, KL.gr, KL.gg, KL.gw].forEach(function (g) { g.__s.forEach(function (e, i) { e.setAttribute('stop-opacity', r2(g.__a[i] * st)); }); });
    }
    setA(KL.gs, 'cx', f1(CX + lx * 38)); setA(KL.gs, 'cy', f1(G.kMitte + ly * 30));
    setA(KL.gr, 'x1', f1(CX + lx * 84)); setA(KL.gr, 'y1', f1(G.kMitte + ly * 66)); setA(KL.gr, 'x2', f1(CX - lx * 84)); setA(KL.gr, 'y2', f1(G.kMitte - ly * 66));
    setA(KL.gg, 'x1', r2(lx * 7.5)); setA(KL.gg, 'y1', r2(2 + ly * 3.6)); setA(KL.gg, 'x2', r2(-lx * 7.5)); setA(KL.gg, 'y2', r2(2 - ly * 3.6));
    var sdy = z.gefaehrt && z.gefaehrt.sitz ? +z.gefaehrt.sitz.dy || 0 : 0;
    setA(KL.wurf, 'cx', r2(-lx * 2.3)); setA(KL.wurf, 'cy', r2(0.8 + sdy - ly * 1.5));
  }
  function klAus() {
    if (!KL) return;
    [KL.gs, KL.gr, KL.gg, KL.gw, KL.clip, KL.clipV, KL.schatt, KL.rand, KL.gfh, KL.gfv].forEach(function (e) { if (e && e.parentNode) e.parentNode.removeChild(e); });
    if (KL.saum) KL.saum.removeAttribute('opacity');
    Array.prototype.forEach.call(svg.querySelectorAll('.c6s-gf-eigen'), function (e) { e.style.display = ''; });
    KL = null;
  }

  // Blick: aus einem Bildschirmpunkt eine Richtung (-1..1) machen
  function richtung(x, y) {
    var r = z.rect || (function () { var b = wrap.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height * 0.5, w: b.width }; })();
    var dx = x - r.x, dy = y - r.y, d = Math.hypot(dx, dy) || 1, s = Math.min(1, d / (r.w * 1.6 + 60));
    return { x: dx / d * s, y: dy / d * s };
  }
  function zuckBlaetter(v) { z.bR.v -= v; z.bL.v += v; }

  // Gewohnheiten: kleine Szenen, die Ziele im Takt überlagern; nie Text
  function gewStart(name, ok) {
    if (!(name in GEWOHNHEIT)) { ok && ok(false); return false; }
    if (name === 'sitzen') { ctl.sitz(true); ok && ok(true); return true; }
    if (z.gew) gewEnde(false);
    z.gew = { name: name, t0: performance.now(), dauer: GEWOHNHEIT[name] * 1000, zeile: -1, ok: ok, p: 0 };
    wrap.setAttribute('data-gewohnheit', name);
    if (!RUHIG()) { if (name === 'umsehen') zuckBlaetter(70); if (name === 'gaehnen') z.sy.v += 0.5; }
    wecke(); return true;
  }
  function gewEnde(ganz) {
    var g = z.gew; if (!g) return; z.gew = null; wrap.removeAttribute('data-gewohnheit');
    if (ganz && !RUHIG()) {
      if (g.name === 'gaehnen') { z.neig.v += 16; zuckBlaetter(-150); z.blinzel = 0.05; z.doppel = true; }
      if (g.name === 'lesen' || g.name === 'schrauben') { z.sy.v += 0.9; zuckBlaetter(60); }
    }
    g.ok && g.ok(!!ganz);
  }
  function darfGewohnheit(name) {
    if (z.gang || z.fliegt && !z.imGf || z.huepf || z.sprich || z.druck || z.nickt) return false;
    if (z.name === 'schlaeft' || z.name === 'arbeitet' || z.name === 'denkt' || z.name === 'zieht') return false;
    if (z.imGf && name && name !== 'umsehen') return false;   // im Gefährt nur umsehen (und einnicken)
    return true;
  }
  function einnicken() {
    if (z.nickt || !darfGewohnheit('umsehen')) return;
    if (z.gew) gewEnde(false);
    z.nickt = true; z.nick.z = 1; wrap.setAttribute('data-nickt', '1'); wecke();
  }
  function aufwachen(mitSchuetteln) {
    if (!z.nickt) return;
    z.nickt = false; z.nick.z = 0; wrap.removeAttribute('data-nickt');
    if (mitSchuetteln !== false && !RUHIG()) { z.neig.v += 34; z.sy.v += 1.8; zuckBlaetter(-220); z.fdM.v += 60; z.blinzel = 0.05; z.doppel = true; z.glueh = performance.now() + 900; z.front = performance.now() + 1400; }
    else if (RUHIG()) z.nick.x = 0;
    wecke();
  }

  function imGfJetzt() { return z.imGf; }
  function tick(t, dt) {
    var ruhig = RUHIG() || still, aktiv = false;
    var jetzt = performance.now(), st = (z.name === 'ruhig' && z.hoertBis > jetzt) ? STIMMUNG.hoert : z.st;
    var gew = z.gew, gp = 0, gn = gew ? gew.name : '';
    if (gew) { gp = (jetzt - gew.t0) / gew.dauer; if (gp >= 1 || !darfGewohnheit(gew.name)) { gewEnde(gp >= 1); gew = null; gn = ''; } else aktiv = true; }
    // Atem (beim Einnicken langsamer und tiefer)
    var nk = klemm(z.nick.x, 0, 1);
    var atemTempo = z.name === 'schlaeft' ? 0.2 : 0.3 - 0.12 * nk;
    if (!ruhig) z.atem += dt * Math.PI * 2 * atemTempo;
    var a = ruhig ? 0 : Math.sin(z.atem), atemTief = z.name === 'schlaeft' ? 1.6 : 1 + 0.5 * nk;
    // Gang
    var bob = 0, schrittL = 0, schrittR = 0, gangNeig = 0;
    if (z.gang) {
      var g = z.gang, u = Math.max(0, Math.min(1, (jetzt - g.t0) / g.ms));
      var e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      var nx = g.x0 + (g.x1 - g.x0) * e, ns = g.s0 + (g.s1 - g.s0) * e;
      z.vx = (nx - z.x) / dt; z.x = nx; z.skala = ns; z.y = g.y0 + (g.y1 - g.y0) * e;
      if (g.flug) { z.y += -Math.sin(Math.PI * u) * g.bogen; gangNeig = sg(g.x1 - g.x0) * 7 * Math.sin(Math.PI * u); }
      else if (!ruhig && Math.abs(g.x1 - g.x0) > 4) {
        z.schritt += dt * Math.PI * 2 * 3.2 * Math.sin(Math.PI * Math.min(1, u * 1.15));
        var ph = z.schritt; schrittL = Math.max(0, Math.sin(ph)) * 8; schrittR = Math.max(0, -Math.sin(ph)) * 8;
        bob = -Math.abs(Math.sin(ph)) * 3; gangNeig = Math.sin(ph) * 2.2 + sg(g.x1 - g.x0) * 3.5 * Math.sin(Math.PI * u);
      }
      wrap.style.transform = 'translate3d(' + f1(z.x) + 'px,' + f1(z.y) + 'px,0) scale(' + r3(z.skala) + ')';
      if (u >= 1) {
        var fertig = g.fertig, richt = sg(g.x1 - g.x0); z.gang = null; z.vx = 0;
        // Abbremsen: der Körper wippt nach, Blätter und Mütze laufen hinterher
        if (!ruhig && Math.abs(g.x1 - g.x0) > 4) { z.neig.v -= richt * 16; z.sy.v -= 0.9; z.bR.v -= richt * 150; z.bL.v -= richt * 150; z.fdM.v -= richt * 50; z.fdS.v -= richt * 40; z.pL.v += richt * 30; z.pR.v += richt * 30; }
        fertig && fertig();
      }
      aktiv = true;
    }
    // Hüpfer: erst in die Knie, dann hoch, dann weich landen
    var hopY = 0;
    if (z.huepf) {
      var hz = z.huepf, el = (jetzt - hz.t0) / 1000, hoch = hz.h;
      if (el < 0.1) { z.sy.z = 0.86; z.sx.z = 1.1; }
      else if (el < 0.5) {
        var p = (el - 0.1) / 0.4; hopY = -hoch * 4 * p * (1 - p);
        z.sy.z = p < 0.35 ? 1.1 : p < 0.7 ? 1.02 : 0.98; z.sx.z = p < 0.35 ? 0.93 : p < 0.7 ? 0.99 : 1.02;
        if (!hz.ab) { hz.ab = true; z.bR.v += 240; z.bL.v -= 240; z.fdMy.v -= 40; }
      } else if (!hz.land) { hz.land = true; z.sy.z = 1; z.sx.z = 1; z.sy.v -= 4.2; z.sx.v += 3.2; z.bR.v -= 320; z.bL.v += 320; z.pL.v += 55; z.pR.v -= 55; z.fdMy.v += 70; z.fdS.v += 40; }
      else if (el > 0.8) { var fz = hz.fertig; z.huepf = null; fz && fz(); }
      aktiv = true;
    }
    if (z.druck) { z.sx.z = 1.1; z.sy.z = 0.88; }
    else if (!z.huepf) { z.sx.z = 1; z.sy.z = 1; }
    if (z.sprich && !ruhig) { z.spT += dt; if (z.spT > 0.3) { z.spT = 0; z.bR.v += 60 * (Math.random() - 0.3); z.bL.v -= 60 * (Math.random() - 0.3); z.sy.v += 0.2; } aktiv = true; }
    var klopf = 0;
    if ((z.name === 'arbeitet' || gn === 'schrauben') && !ruhig) { klopf = Math.max(0, Math.sin(t * 7.5)) * 16; aktiv = true; }
    // Blätter: Ziel + Wind + Trägheit (+ Gewohnheit)
    z.wind += dt;
    var wind = ruhig ? 0 : Math.sin(z.wind * 1.1) * 2.4 + Math.sin(z.wind * 2.7 + 1) * 1.1;
    var schl = z.name === 'schlaeft' ? Math.sin(z.atem) * 3 : 0;
    var bRz = st.bR + wind + a * 1.6 + schl - klopf, bLz = st.bL + wind * 0.8 - a * 1.6 - schl;
    var neigZ = 0, gxG = null, gyG = null, lidG = 0, mG = null, syG = 0, wangeG = 0;
    if (gew) {
      if (gn === 'lesen') {
        var zl = Math.floor(gp * 6), lp = (gp * 6) % 1;
        gxG = -0.42 + lp * 0.86; gyG = 0.62; neigZ = 2.6; bRz -= 12; bLz += 12; lidG = 0.12; mG = [6, 0, 0.5, 0, 0];
        if (zl !== gew.zeile) { gew.zeile = zl; if (!ruhig) { z.sy.v -= 0.35; z.gx.x = -0.42; z.leseW.v += zl % 2 ? 40 : -40; } }
      } else if (gn === 'gaehnen') {
        // erst öffnet sich der Mund, dann fallen die Augen zu (nie ein halbes Lid über offenem Blick)
        var qq = gp < 0.35 ? gp / 0.35 : gp < 0.7 ? 1 : (1 - gp) / 0.3; qq = klemm(qq, 0, 1);
        var ql = klemm(gp < 0.35 ? (gp - 0.08) / 0.27 : gp < 0.7 ? 1 : (0.86 - gp) / 0.14, 0, 1);   // die Augen gehen vor dem Mund wieder auf
        mG = [5, 1.25 * qq, 0, 1, 0]; lidG = 1.02 * ql * ql; bRz += 42 * qq; bLz -= 44 * qq; syG = 0.035 * qq; neigZ = -3.5 * qq; gxG = 0; gyG = -0.5 * qq; wangeG = 0.1 * qq;
      } else if (gn === 'summen') {
        var tt = (jetzt - gew.t0) / 1000;
        mG = [4.5, 0.2 + 0.1 * Math.sin(tt * 9) + 0.08 * Math.sin(tt * 5.3), 0.55, 0.7, 0];
        neigZ = Math.sin(tt * 2.1) * 2.4; syG = 0.012 * Math.sin(tt * 4.2); bRz += Math.sin(tt * 2.1) * 7; bLz += Math.sin(tt * 2.1 + 0.9) * 6; gxG = 0.3; gyG = -0.28;
      } else if (gn === 'schrauben') {
        neigZ = 5; gxG = 0.5; gyG = 0.62; bRz = 24 + wind - klopf; bLz = -56 + wind * 0.8; mG = [6, 0, 0.45, 0, 2.5]; syG = -klopf * 0.0008;
      } else if (gn === 'umsehen') {
        var ab = gp < 0.33 ? 0 : gp < 0.66 ? 1 : 2;
        gxG = [-0.72, 0.78, 0.05][ab]; gyG = [-0.1, -0.22, -0.62][ab]; bRz -= 14; bLz += 14; neigZ = gxG * 2.5;
        if (ab !== gew.zeile) { gew.zeile = ab; z.blinzel = Math.min(z.blinzel, 0.04); }
      }
    }
    if (z.gang || z.sitzen || z.imGf || z.fliegt) z.seit.z = 0;   // wer geht, sitzt oder fliegt, steht wieder mittig
    // Eigenhandlungen: in Ruhe alle 6–13 s etwas Kleines, nie während Gang, Flug, Gespräch oder Gewohnheit
    var eh = z.eh;
    if (!ruhig && !klein) {
      var frei = !z.gang && !(z.fliegt && !imGfJetzt()) && !z.huepf && !z.sprich && !z.druck && !gew && !z.nickt && nk < 0.1 &&
        (z.name === 'ruhig' || z.name === 'staunt' || z.name === 'hoert' || z.name === 'froh') && jetzt - zeiger.t > 2200;
      if (eh && !frei && eh.art !== 'schritt') { z.eh = eh = null; }
      if (!eh && frei) {
        z.ehT -= dt;
        if (z.ehT <= 0) {
          z.ehT = 6 + Math.random() * 7;
          var wahl = Math.random(), sitzt = z.sitzen || z.imGf;
          var art = sitzt ? (wahl < 0.6 ? 'zupfen' : 'umsehen') : wahl < 0.3 ? 'zupfen' : wahl < 0.58 ? 'schritt' : wahl < 0.78 ? 'recken' : wahl < 0.94 ? 'umsehen' : 'gaehnen';
          if (art === 'umsehen' || art === 'gaehnen') { if (darfGewohnheit(art)) gewStart(art); }
          else {
            z.eh = eh = { art: art, t0: jetzt, dauer: art === 'zupfen' ? 1500 : art === 'recken' ? 1900 : 900, ok: false };
            if (art === 'schritt') {
              var hin = Math.abs(z.seit.z) > 4 ? -sg(z.seit.z) : (Math.random() < 0.5 ? -1 : 1);
              eh.r = hin; z.seit.z = klemm(z.seit.z + hin * (7 + Math.random() * 5), -13, 13);
            }
          }
        }
      }
      if (eh) {
        var ep = (jetzt - eh.t0) / eh.dauer;
        if (ep >= 1) { z.eh = eh = null; }
        else {
          aktiv = true;
          if (eh.art === 'zupfen') {
            // er schielt hoch zu seinen Blättern und schüttelt sie einmal kurz, wie ein Hund das Ohr
            gxG = 0.12; gyG = -0.85; neigZ += -2 * Math.sin(Math.PI * ep);
            if (!eh.ok && ep > 0.32) { eh.ok = true; z.bR.v += 300; z.bL.v -= 300; z.tipR.v += 90; z.tipL.v -= 90; z.stiel.v += 50; z.sy.v += 0.7; }
            if (ep > 0.75) { gxG = 0.05; gyG = 0.1; }
          } else if (eh.art === 'recken') {
            var rk = Math.sin(Math.PI * Math.min(1, ep * 1.15));
            syG += 0.05 * rk; lidG = Math.max(lidG, 0.55 * rk); bRz -= 26 * rk; bLz += 26 * rk; gyG = -0.4 * rk; gxG = 0;
            mG = rk > 0.5 ? [6, 0.25 * rk, 0.6, 0.3, 0] : mG;
          } else if (eh.art === 'schritt') {
            // ein Beinchen hebt sich, der Körper folgt, das andere zieht nach
            var sp1 = Math.sin(Math.PI * klemm(ep / 0.55, 0, 1)), sp2 = Math.sin(Math.PI * klemm((ep - 0.4) / 0.55, 0, 1));
            var schwK = 1 - 0.8 * klemm(z.schweb.x, 0, 1);   // schwebt er, gleitet er seitwärts, statt zu steigen
            if (eh.r > 0) { schrittR += 7 * sp1 * schwK; schrittL += 6 * sp2 * schwK; } else { schrittL += 7 * sp1 * schwK; schrittR += 6 * sp2 * schwK; }
            bob -= 2 * (sp1 + sp2) * 0.5; neigZ += eh.r * 3 * sp1; gxG = eh.r * 0.55; gyG = 0.2;
          }
        }
      }
    }
    // Schweben: ein leiser Grundzustand in jedem Raum, wo Carl steht (nicos Wunsch vom 11.10.: „die ganze Zeit ein bisschen“),
    // nie lauter als Carl selbst (≈ 7 Einheiten, ein Atemzug von 4,6 s). Er landet, wenn er sitzt, geht, schläft, nickt,
    // im Gefährt ist oder fliegt; der Kontaktschatten bleibt am Boden und wird nur kleiner und blasser.
    // Bei reduzierter Bewegung steht er still auf dem Boden (ein Standbild schwebt nicht). opt.schweben === false schaltet es ab.
    var schwebDarf = z.schwebAn !== false;
    z.schweb.z = (schwebDarf && !ruhig && !klein && !z.sitzen && !z.imGf && !z.fliegt && !(z.gang && !z.gang.flug) && z.name !== 'schlaeft' && !z.nickt) ? 1 : 0;
    var sw = klemm(z.schweb.x, 0, 1.15), swPh = t * Math.PI * 2 / 4.6;
    var schwebLift = sw * (7 + (ruhig ? 0 : Math.sin(swPh) * 2.2));
    if (!ruhig && sw > 0.01) neigZ += Math.sin(swPh + 0.8) * 0.6 * sw;
    // Sitzen: erst plumpst er aufs Polster, dann kleine Szenen (seufzen, Blatt wegpusten, Fuß tippen, wippen)
    var szHop = 0, szBL = 0, szBR = 0, szSchiel = 0, szStiel = 0, spJetzt = klemm(z.sitzP.x, 0, 1);
    if (z.plumps) {
      var pe = (jetzt - z.plumps) / 1000;
      if (ruhig || klein || pe > 1) z.plumps = 0;
      else {
        aktiv = true;
        if (pe < 0.42) szHop = -15 * Math.sin(Math.PI * pe / 0.42);
        else if (!z.plLand) { z.plLand = true; z.sy.v -= 3.4; z.sx.v += 2.6; z.bR.v -= 280; z.bL.v += 280; z.fdMy.v += 60; z.fdS.v += 40; z.pL.v += 70; z.pR.v -= 70; z.blinzel = 0.04; }
        if (pe < 0.2) { bRz -= 18; bLz += 18; gyG = 0.5; gxG = 0; }
      }
    }
    var szFrei = z.sitzen && !ruhig && !klein && spJetzt > 0.85 && !z.plumps && !gew && !z.nickt && !z.sprich && !z.druck && !z.huepf &&
      (z.name === 'ruhig' || z.name === 'froh' || z.name === 'hoert') && jetzt - zeiger.t > 1800;
    if (z.sz && !szFrei) z.sz = null;
    if (!z.sz && szFrei) {
      z.szT -= dt;
      if (z.szT <= 0) {
        var szL = ['seufzen', 'pusten', 'tippen', 'wippen'].filter(function (x) { return x !== z.szLetzt; });
        var szA = szL[Math.floor(Math.random() * szL.length)];
        z.sz = { art: szA, t0: jetzt, dauer: { seufzen: 3400, pusten: 3600, tippen: 3200, wippen: 2300 }[szA], ok: false }; z.szLetzt = szA;
        z.szT = 4.5 + Math.random() * 4;
      }
    }
    if (z.sz) {
      var sz = z.sz, q2 = (jetzt - sz.t0) / sz.dauer;
      if (q2 >= 1) z.sz = null;
      else {
        aktiv = true;
        var hb = function (a, b) { return klemm((q2 - a) / (b - a), 0, 1); }, glatt2 = function (v) { return v * v * (3 - 2 * v); };
        if (sz.art === 'seufzen') {
          // tief einatmen, Blick nach oben … und ganz lange aus: die Blätter sinken mit
          var ein = glatt2(hb(0, 0.32)) * (1 - glatt2(hb(0.42, 0.62))), aus = glatt2(hb(0.42, 0.6)) * (1 - glatt2(hb(0.82, 1)));
          syG += 0.065 * ein - 0.045 * aus; gyG = -0.35 * ein + 0.25 * aus; gxG = 0.05;
          bRz -= 12 * ein - 46 * aus; bLz += 12 * ein - 48 * aus; lidG = Math.max(lidG, 0.5 * aus); neigZ += -3 * aus;
          mG = ein > 0.2 ? [4, 0.35 * ein, 0, 1, 0] : aus > 0.15 ? [5, 0.55 * aus, 0, 1, 0] : [8, 0.05, 0.9, 0, 0];
        } else if (sz.art === 'pusten') {
          // das rechte Blatt kippt ihm in die Stirn, er schielt hoch, bläst die Backen auf – pff! – und es schnellt zurück
          var kipp = glatt2(hb(0.04, 0.34)) * (q2 < 0.56 ? 1 : 0), backe = glatt2(hb(0.36, 0.52)) * (q2 < 0.58 ? 1 : 0), stolz = glatt2(hb(0.62, 0.72)) * (1 - glatt2(hb(0.9, 1)));
          if (q2 < 0.56) { bRz = st.bR - 118 * kipp + wind * 0.4; bLz += 14 * kipp; szStiel = -30 * kipp; }
          szSchiel = q2 < 0.6 ? glatt2(hb(0.1, 0.3)) : 0;
          if (q2 < 0.6) { gxG = 0.12; gyG = -0.95 * glatt2(hb(0.06, 0.26)); }
          if (backe > 0) { mG = [3, 0.06, 0, 1, 0]; wangeG += 0.45 * backe; syG += 0.03 * backe; }
          if (q2 >= 0.56 && !sz.ok) { sz.ok = true; z.bR.v += 620; z.tipR.v += 120; z.bL.v -= 140; z.sy.v -= 1.1; z.neig.v += 18; z.blinzel = 0.03; }
          if (q2 >= 0.56 && q2 < 0.64) mG = [4.5, 0.7, 0, 1, 0];
          if (stolz > 0) { mG = [10.5, 0.5 * stolz, 1, 0, 0]; gxG = 0; gyG = 0.12; wangeG += 0.2 * stolz; }
        } else if (sz.art === 'tippen') {
          // ein Fuß tippt einen Takt, der Kopf nickt mit, er summt mit halb geschlossenen Augen
          var takt = Math.sin(q2 * Math.PI * 2 * 4.5), an = glatt2(hb(0, 0.12)) * (1 - glatt2(hb(0.88, 1)));
          szBL = Math.max(0, takt) * 9 * an; neigZ += Math.max(0, -takt) * 2.2 * an;
          mG = [4.5, (0.18 + 0.1 * Math.max(0, takt)) * an, 0.6, 0.7, 0]; lidG = Math.max(lidG, 0.42 * an); gxG = 0.25; gyG = -0.15;
        } else if (sz.art === 'wippen') {
          // er prüft das Polster: boing, boing
          var w2 = Math.sin(Math.PI * klemm(q2 / 0.8, 0, 1) * 2), w3 = Math.abs(w2);
          szHop = -9 * w3; syG += q2 < 0.8 ? (w3 < 0.2 ? -0.05 : 0.02) : 0; bRz += 22 * w3; bLz -= 22 * w3;
          szBL = szBR = 5 * w3; mG = [11, 0.85, 1, 0, 0]; wangeG += 0.25; gyG = -0.1; gxG = 0;
        }
      }
    }
    z.schiel.z = szSchiel;
    // Einnicken: Blätter hängen, Lider halb, der Kopf sinkt
    var lwG = 0, nickDrop = 0;
    if (nk > 0.001) {
      bRz += 46 * nk; bLz -= 48 * nk; neigZ += 3 * nk; wangeG -= 0.1 * nk; lwG = 5 * nk;
      var lidN = 0.8;
      // Mikro-Schlaf: der Kopf sinkt langsam, dann schreckt er kurz hoch, dann wieder Ruhe
      if (z.nickt && !ruhig) {
        var ph = z.nickPh || (z.nickPh = { was: 'ruhe', t0: jetzt, dauer: 2500 + Math.random() * 2500 });
        var pp = (jetzt - ph.t0) / ph.dauer;
        if (ph.was === 'ruhe' && pp >= 1) { z.nickPh = { was: 'sinkt', t0: jetzt, dauer: 3200 }; }
        else if (ph.was === 'sinkt') {
          var e2 = Math.min(1, pp) * Math.min(1, pp);
          neigZ += 7 * e2 * nk; nickDrop = 6 * e2 * nk; lidN = 0.8 + 0.24 * e2;
          if (pp >= 1) { z.nickPh = { was: 'schreck', t0: jetzt, dauer: 700 }; z.neig.v -= 70; z.sy.v += 1.3; zuckBlaetter(-160); z.fdM.v -= 40; }
        } else if (ph.was === 'schreck') {
          lidN = 0.22 + 0.58 * Math.min(1, pp); gxG = 0.15; gyG = -0.25 + 0.6 * Math.min(1, pp);
          if (pp >= 1) z.nickPh = { was: 'ruhe', t0: jetzt, dauer: 2500 + Math.random() * 3000 };
        }
      }
      lidG = Math.max(lidG, lidN * nk);
    } else if (z.nickPh) z.nickPh = null;
    z.bR.z = bRz; z.bL.z = bLz;
    // Flug: das Keimblattpaar legt sich waagrecht und dreht sich wie ein kleiner Rotor (nicht im Gefährt)
    var imGf = z.imGf, gfP = klemm(z.gfP.x, 0, 1.1);
    var rot = Math.max(0, Math.min(1, z.rotor.x));
    if (z.fliegt || z.flug.x > 0.04) { z.bR.z = z.bR.z * (1 - rot) + 88 * rot; z.bL.z = z.bL.z * (1 - rot) + -88 * rot; }
    z.rotor.z = (!imGf && (z.fliegt || z.flug.x > 0.05)) ? 1 : 0;
    z.flug.z = (!imGf && z.fliegt && z.rotor.x > 0.55) ? 1 : 0;
    if (!z.fliegt && !z.gelandet && z.flug.x < 0.03) { z.gelandet = true; z.sy.v -= 2.6; z.sx.v += 2; z.bR.v -= 260; z.bL.v += 260; z.pL.v += 70; z.pR.v -= 60; z.fdMy.v += 60; z.fdS.v += 50; }
    if (z.fliegt && z.flug.x > 0.1) z.gelandet = false;
    if (!ruhig) z.rphi += dt * Math.PI * 2 * 3.1 * rot;
    var ax = (z.vx - (z.vxAlt || 0)) / dt; z.vxAlt = z.vx;
    if (Math.abs(ax) < 20000) { z.bR.v -= ax * 0.004; z.bL.v -= ax * 0.004; z.stiel.v -= ax * 0.003; z.fdM.v -= ax * 0.0025; z.fdS.v -= ax * 0.003; }
    z.stiel.z = wind * 0.6 + szStiel;
    // Gewicht verlagern: beim Stehen alle 8–14 s leise von einem Bein aufs andere
    if (!ruhig && !z.gang && !z.fliegt && !z.sitzen && !imGf && !z.huepf && z.name !== 'schlaeft' && nk < 0.5) {
      z.standT -= dt;
      if (z.standT <= 0) {
        z.standT = 5 + Math.random() * 5;
        var w = [-1, 0, 1].filter(function (v) { return v !== z.stand.z; }); z.stand.z = w[Math.floor(Math.random() * w.length)];
        zuckBlaetter(-(z.stand.z - (z.standAlt || 0)) * 40); z.standAlt = z.stand.z; z.fdM.v += (z.stand.z) * 18;
      }
    } else if (z.stand.z !== 0 && (z.gang || z.fliegt || z.sitzen || imGf)) z.stand.z = 0;
    var stand = z.stand.x;
    // Blick: ausdrücklich · kurzer Blick aufs Ereignis · nach vorn · zum Zeiger · in Ruhe Sakkaden mit Pausen
    var gx = 0, gy = 0;
    if (z.kurz && z.kurz.bis < jetzt) z.kurz = null;
    if (z.schau) { gx = z.schau.x; gy = z.schau.y; }
    else if (gxG != null) { gx = gxG; gy = gyG; }
    else if (z.kurz) { gx = z.kurz.x; gy = z.kurz.y; }
    else if (z.front > jetzt) { gx = 0; gy = 0.15; }
    else if (opt.blick !== false && jetzt - zeiger.t < 3500 && z.rect) {
      var rz = richtung(zeiger.x, zeiger.y); gx = rz.x; gy = rz.y;
    } else if (!ruhig && nk < 0.5) {
      if (jetzt > z.idleT) {
        var art = Math.random();
        z.idleT = jetzt + 700 + Math.random() * 3800;
        if (art < 0.3) z.idleZiel = { x: 0, y: 0.1 };
        else if (art < 0.6) z.idleZiel = { x: klemm(z.idleZiel.x + (Math.random() - 0.5) * 0.35, -0.8, 0.8), y: klemm(z.idleZiel.y + (Math.random() - 0.5) * 0.25, -0.5, 0.5) };
        else z.idleZiel = { x: (Math.random() - 0.5) * 1.5, y: (Math.random() - 0.5) * 0.8 };
        if (art >= 0.6 || Math.random() < 0.4) z.blinzel = Math.min(z.blinzel, 0.05);
        if (art >= 0.6 && Math.abs(z.idleZiel.x) > 0.5) zuckBlaetter(-sg(z.idleZiel.x) * 14);
      }
      gx = z.idleZiel.x; gy = z.idleZiel.y;
    }
    if (z.name === 'denkt') { gx = 0.6; gy = -0.75; }
    if (z.name === 'arbeitet') { gx = gx * 0.3 + 0.35; gy = 0.55; }
    if (z.name === 'schlaeft') { gx = 0; gy = 0; }
    if (nk > 0.3 && gxG == null && !z.schau) { gx = 0.1 * nk; gy = 0.5 * nk; }
    if (z.gang) { gx = sg(z.gang.x1 - z.gang.x0) * 0.8; gy = 0.05; }
    z.gx.z = Math.max(-1, Math.min(1, gx)); z.gy.z = Math.max(-1, Math.min(1, gy));
    // Blinzeln: das Oberlid fällt, das Unterlid kommt ein wenig entgegen
    if (!ruhig && z.name !== 'schlaeft' && nk < 0.9) {
      z.blinzel -= dt;
      if (z.blinzel <= 0 && z.blinzelT < 0) { z.blinzelT = 0; z.blinzel = Math.random() < 0.2 ? 0.9 + Math.random() * 1.2 : 2.6 + Math.random() * 5.5; z.bdauer = Math.random() < 0.12 ? 2.2 : 1; if (Math.random() < 0.14) z.doppel = true; }
      if (z.blinzelT >= 0) {
        z.blinzelT += dt; var bt = z.blinzelT / (z.bdauer || 1);
        z.blink = bt < 0.05 ? bt / 0.05 : bt < 0.09 ? 1 : bt < 0.17 ? 1 - (bt - 0.09) / 0.08 : 0;
        if (bt > 0.17) { z.blinzelT = -1; z.blink = 0; if (z.doppel) { z.doppel = false; z.blinzel = 0.1; } }
      }
    } else z.blink = 0;
    z.lid.z = Math.max(0, st.lid + Math.max(0, z.gy.z) * 0.04 + lidG);
    // Mund: Stimmung, beim Sprechen Silben, in Gewohnheiten die Szene
    var mm = mG || st.m;
    if (z.sprich && z.name !== 'schlaeft') {
      z.spT2 = (z.spT2 || 0) - dt;
      if (z.spT2 <= 0) { z.spT2 = 0.08 + Math.random() * 0.1; z.spM = Math.random() < 0.18 ? 0.08 : 0.3 + Math.random() * 0.6; z.spW = 0.75 + Math.random() * 0.3; }
      z.ma.z = z.spM; z.mw.z = Math.max(5, mm[0]) * z.spW; z.ml.z = 0.55; z.mr.z = 0.25; z.mx.z = mm[4] * 0.3;
    } else { z.mw.z = mm[0] - 1.5 * nk; z.ma.z = mm[1] + (z.name === 'schlaeft' ? a * 0.08 : 0) + 0.1 * nk; z.ml.z = mm[2] * (1 - 0.5 * nk); z.mr.z = Math.max(mm[3], 0.6 * nk); z.mx.z = mm[4]; }
    // Flug: Schweben mit Nachwippen, Beinchen baumeln · Gefährt: schwebt mit eigener Feder, ohne Rotor
    var fh = Math.max(0, z.flug.x), lift = fh * 44 + (ruhig ? 0 : Math.sin(t * Math.PI * 2 * 0.85) * 3.2 * Math.min(1, fh * 1.4));
    var bau = ruhig ? 0 : Math.sin(t * Math.PI * 2 * 0.85 - 0.9);
    var gfSchweb = imGf && z.gfSchwebt ? gfP : 0;
    z.gfY.z = gfSchweb ? (ruhig ? 0 : Math.sin(t * Math.PI * 2 / 3.4) * 2.4) : 0;
    var gfLift = gfSchweb * 10 + z.gfY.x * gfSchweb;
    var baum = imGf && z.gfBeine !== 'weg' ? gfP : 0, bauGf = ruhig ? 0 : Math.sin(t * Math.PI * 2 / 3.4 - 1.2);
    var vxK = Math.max(-12, Math.min(12, z.vx * 0.02));
    var bauS = ruhig ? 0 : Math.sin(swPh - 1.1);
    z.pL.z = fh * (6 + bau * 4) - vxK * fh + baum * (8 + bauGf * 3) - vxK * baum + sw * (2.6 + bauS * 1.6);
    z.pR.z = fh * (-6 + bau * 3.4) - vxK * fh + baum * (-7 + bauGf * 2.6) - vxK * baum + sw * (-2.4 + bauS * 1.3);
    z.gfP.z = imGf ? 1 : 0;
    z.gfNeig.z = imGf ? klemm(z.vx * 0.02, -7, 7) + (ruhig ? 0 : Math.sin(t * Math.PI * 2 / 5.1) * 0.8 * gfSchweb) : 0;
    z.unter.z = st.unter; z.lw.z = st.lw + lwG; z.dl.z = st.dl;
    z.wange.z = st.wange + (z.glueh > jetzt ? 0.25 : 0) + wangeG;
    z.kringel.z = z.name === 'denkt' ? 1 : 0;
    z.werk.z = (z.name === 'arbeitet' || gn === 'schrauben') ? 1 : 0;
    var wiegen = ruhig ? 0 : Math.sin(z.atem * 0.5 + 0.7) * 0.9;   // ein langsames Wiegen mit dem halben Atem
    z.neig.z = st.neig + gangNeig + z.gx.x * (z.schau || jetzt - zeiger.t < 3500 ? 3.2 : 2) + stand * 1.7 + neigZ + wiegen + (imGf ? z.gfNeig.x * 0.5 : 0);
    z.gross.z = st.gross;
    z.sitz.z = (z.teileK != null && z.teileK < 3) ? G.bein - 3 : 0;
    z.sitzP.z = z.sitzen ? 1 : 0;
    // Kopplung: was der Körper tut, läuft in Blätter, Spitzen, Mütze und Schal nach
    var dNeig = z.neig.v - (z.neigVAlt || 0), dSy = z.sy.v - (z.syVAlt || 0); z.neigVAlt = z.neig.v; z.syVAlt = z.sy.v;
    if (!ruhig) {
      z.bR.v -= dNeig * 1.6; z.bL.v -= dNeig * 1.6; z.stiel.v -= dNeig * 0.6; z.fdM.v -= dNeig * 0.9; z.fdS.v -= dNeig * 0.5;
      z.bR.v += dSy * 90; z.bL.v -= dSy * 90; z.fdMy.v -= dSy * 60;
      z.tipR.v -= z.bR.v * dt * 1.1; z.tipL.v -= z.bL.v * dt * 1.1;
    }
    z.tipR.z = 0; z.tipL.z = 0; z.fdM.z = 0; z.fdMy.z = 0; z.fdS.z = 0; z.lese.z = gn === 'lesen' ? 1 : 0; z.leseW.z = 0;
    var fl = [z.sitz, z.gross, z.sx, z.sy, z.neig, z.bR, z.bL, z.stiel, z.tipR, z.tipL, z.gx, z.gy, z.lid, z.unter, z.lw, z.dl, z.wange, z.kringel, z.werk, z.mw, z.ma, z.ml, z.mr, z.mx, z.flug, z.rotor, z.pL, z.pR, z.sitzP, z.stand, z.fdM, z.fdMy, z.fdS, z.nick, z.gfP, z.gfY, z.gfNeig, z.lese, z.leseW, z.seit, z.schweb, z.schiel];
    var unruhig = false;
    for (var i = 0; i < fl.length; i++) {
      if (ruhig) { fl[i].x = fl[i].z; fl[i].v = 0; continue; }
      var sub = 2; for (var j = 0; j < sub; j++) schritt(fl[i], dt / sub);
      if (!ruht(fl[i])) unruhig = true;
    }
    // Licht: gedrosselt lesen, weich nachführen
    z.lichtT -= dt;
    if (z.lichtT <= 0) { z.lichtT = 0.25; liesLicht(); }
    var L = z.licht, LZ = z.lz, k = ruhig ? 1 : Math.min(1, dt * 5);
    var dl = Math.abs(L.lx - LZ.lx) + Math.abs(L.ly - LZ.ly) + Math.abs(L.a - LZ.a) + Math.abs(L.hoehe - LZ.hoehe);
    if (dl > 0.002) { L.lx += (LZ.lx - L.lx) * k; L.ly += (LZ.ly - L.ly) * k; L.a += (LZ.a - L.a) * k; L.hoehe += (LZ.hoehe - L.hoehe) * k; L.st = LZ.st; z.lichtNeu = true; unruhig = true; }
    if (z.lichtNeu || z.lichtB === undefined || Math.abs(z.lichtB - z.bR.x) > 1.5) { z.lichtNeu = false; z.lichtB = z.bR.x; schreibLicht(L); }
    // Schreiben
    var sx = z.sx.x * (1 - 0.015 * a * atemTief), sy = z.sy.x * (1 + 0.026 * a * atemTief + st.auf + syG);
    setT(n.wurzel, 'translate(' + f1(z.seit.x) + ',' + f1(hopY + szHop + bob - lift - gfLift - schwebLift) + ')');
    if (z.flugOk.length && Math.abs(z.flug.x - z.flug.z) < 0.03 && Math.abs(z.flug.v) < 0.2 && (z.fliegt && !imGf ? z.rotor.x > 0.9 : z.rotor.x < 0.2)) { var ok = z.flugOk; z.flugOk = []; ok.forEach(function (c) { c(); }); }
    var rs = 1 - rot + rot * Math.cos(z.rphi), RX = KOPF.x + 1, RY = KOPF.y - G.stiel;
    setT(n.rotor, rot > 0.01 ? 'translate(' + RX + ',' + RY + ') scale(' + r3(rs * (1 + rot * 0.15)) + ',' + r3(1 - rot * 0.15) + ') translate(' + (-RX) + ',' + (-RY) + ')' : '');
    setO(n.scheibe, ruhig ? 0 : rot * 0.32);
    var mw = z.mw.x * GV.mw * (klein ? 1.5 : 1), md = mundD(mw, z.ma.x, z.ml.x, z.mr.x);
    if (n.mund && n.mund.__d !== md) { n.mund.__d = md; n.mundP.forEach(function (p) { p.setAttribute('d', md); }); setT(n.zunge, 'translate(0,' + f1(z.ma.x * 3) + ')'); }
    setT(n.mund, 'translate(' + f1(MUND.x + z.mx.x) + ',' + MUND.y + ')');
    // Sitzen: der Körper sinkt ein wenig ein, die Beinchen kommen nach vorn (kürzer im Bild) und wippen · Gefährt: Körper sinkt dy
    var sp = Math.max(0, Math.min(1.1, z.sitzP.x)), wip = ruhig ? 0 : Math.sin(t * Math.PI * 2 * 0.55);
    var gfDy = imGf && z.gefaehrt && z.gefaehrt.sitz ? (+z.gefaehrt.sitz.dy || 0) * M * gfP : 0;
    setT(n.oben, 'translate(' + f1(stand * 2.6) + ',' + f1(z.sitz.x + sp * 14 + gfDy + nickDrop) + ')');
    var wipA = ruhig ? 1 : 1 + 0.45 * Math.sin(t * 0.37);   // das Baumeln wird mal größer, mal kleiner
    var sitzL = sp * (16 + wip * 2.4 * wipA) + szBL, sitzR = sp * (16 - wip * 2.4 * wipA) + szBR;
    setT(n.koerper, 'translate(' + CX + ',' + G.unten + ') rotate(' + f1(z.neig.x) + ') scale(' + r3(sx) + ',' + r3(sy) + ') translate(' + (-CX) + ',' + (-G.unten) + ')');
    // Kontaktschatten: vom Licht weg versetzt und gestreckt, beim Flug kleiner und blasser, beim Sitzen flacher, im schwebenden Gefährt aus
    var hs = Math.max(0.45, 1 + (hopY + szHop - lift - schwebLift * 1.8) / 90), tief = 1 - L.hoehe;
    var sdx = -L.lx * (8 + 34 * tief) * (1 - fh * 0.5), sks = 1 + 0.5 * tief * Math.abs(L.lx), skv = (1 + 0.3 * tief) * (1 - sp * 0.3) * (1 - fh * 0.3);
    setO(n.schatten, L.a * (1 - fh * 0.45) * (1 - gfSchweb) * (1 - sw * 0.22) * (klein ? 1.1 : 1));
    setT(n.schatten, 'translate(' + f1(CX + sdx + stand * 1.2 + z.seit.x) + ',' + BODEN + ') scale(' + r2(hs * sks) + ',' + r2(skv) + ') translate(' + (-CX) + ',' + (-BODEN) + ')');
    var hebL = stand > 0 ? stand * 1.6 : 0, hebR = stand < 0 ? -stand * 1.6 : 0;   // das entlastete Bein hebt die Ferse
    setT(n.beinL, 'translate(0,' + f1(-schrittL - sitzL - hebL + gfDy * 0.35) + ') rotate(' + f1(z.pL.x + sp * wip * 4 + hebL * 1.5) + ' ' + (CX - G.huefte) + ' ' + (G.unten - 10) + ')');
    setT(n.beinR, 'translate(0,' + f1(-schrittR - sitzR - hebR + gfDy * 0.35) + ') rotate(' + f1(z.pR.x - sp * wip * 4 - hebR * 1.5) + ' ' + (CX + G.huefte) + ' ' + (G.unten - 10) + ')');
    setO(n.beine, imGf && z.gfBeine === 'weg' ? 1 - gfP : 1);
    setT(n.gesicht, 'translate(' + f1(z.gx.x * 5) + ',' + f1(z.gy.x * 3) + ')');
    n.pupillen.forEach(function (p, k) { var A = k ? AUG.R : AUG.L; setT(p, 'translate(' + f1(z.gx.x * A.rx * 0.32 * ES + (k ? -1 : 1) * z.schiel.x * A.rx * 0.38) + ',' + f1(z.gy.x * A.ry * 0.3 * ES) + ')'); });
    n.glanz.forEach(function (p) { setT(p, 'translate(' + f1(z.gx.x * 1.2 + (L.lx + 0.6) * 3.2) + ',' + f1(z.gy.x * 1 + (L.ly + 0.8) * 2.2) + ')'); });
    var gs = z.gross.x, bl = z.blink || 0;
    n.augen.forEach(function (o, k) {
      var A = k ? AUG.R : AUG.L, ry = A.ry * ES, w = f1(k ? z.lw.x : -z.lw.x);
      var ly = Math.max(-0.05, Math.min(1.04, z.lid.x + (k ? 0 : z.dl.x)));
      var tO = 'rotate(' + w + ') translate(0,' + f1(ly * (ry * 2 + 3)) + ')';
      var uu = Math.max(0, z.unter.x), tU = 'rotate(' + w + ') translate(0,' + f1(-uu * ry * 1.4) + ')';
      o.__lid.forEach(function (p) { setT(p, tO); }); o.__unt.forEach(function (p) { setT(p, tU); });
      setO(o.__uk, Math.max(0, Math.min(0.6, (z.unter.x - 0.18) * 3)));
      setO(o.__zu, Math.max(0, Math.min(1, Math.max((ly - 0.82) * 6, (bl - 0.55) * 3))));
      setO(o.__lk, Math.max(0, Math.min(1, (ly - 0.04) * 7)));
      setT(o.__wim, 'rotate(' + w + ') translate(0,' + f1(Math.min(1, ly) * (ry + 3)) + ')');
    });
    n.augen.forEach(function (o, k) { var A = k ? AUG.R : AUG.L; setT(o, 'translate(' + A.x + ',' + A.y + ') scale(' + r3(gs) + ',' + r3(gs * (1 - 0.84 * bl)) + ')'); });
    n.wangen.forEach(function (o) { setO(o, Math.max(0, z.wange.x)); });
    setT(n.stiel, 'rotate(' + f1(z.stiel.x) + ' ' + KOPF.x + ' ' + KOPF.y + ')');
    setT(n.blattR, 'rotate(' + f1(z.bR.x) + ')'); setT(n.blattL, 'rotate(' + f1(z.bL.x) + ')');
    setT(n.spitzeR, 'skewX(' + f1(klemm(z.tipR.x, -16, 16)) + ')'); setT(n.spitzeL, 'skewX(' + f1(klemm(z.tipL.x, -16, 16)) + ')');
    setT(n.fdM, 'translate(0,' + f1(klemm(z.fdMy.x, -6, 6)) + ') rotate(' + f1(klemm(z.fdM.x, -14, 14)) + ' ' + KOPF.x + ' ' + KOPF.y + ')');
    setT(n.fdS, 'rotate(' + f1(klemm(z.fdS.x, -10, 10)) + ' ' + ANKER.hals.x + ' ' + (ANKER.hals.y - 10) + ')');
    var gfT = imGf || gfP > 0.01 ? 'translate(0,' + f1(-z.gfY.x * gfSchweb * 0.35) + ') rotate(' + f1(z.gfNeig.x) + ' ' + ANKER.koerper.x + ' ' + (ANKER.koerper.y + 30) + ')' : '';
    setT(n.gfh, gfT); setT(n.gfv, gfT);
    setO(n.kringel, z.kringel.x); setO(n.glatt, 1 - z.kringel.x); setO(n.werkzeug, z.werk.x);
    if (n.lesen) {
      var ls = klemm(z.lese.x, 0, 1.15), LX = CX + 2, LY = G.unten - 12;
      setO(n.lesen, Math.min(1, ls * 1.3));
      setT(n.lesen, 'translate(' + LX + ',' + LY + ') rotate(' + f1(-7 + klemm(z.leseW.x, -8, 8) + z.gx.x * 2) + ') scale(' + r3(0.2 + 0.8 * ls) + ') translate(0,' + f1((1 - ls) * 10) + ')');
    }
    if (z.name === 'schlaeft' && !ruhig) {
      z.zzzT = (z.zzzT + dt / 3.2) % 1; var zt = z.zzzT;
      setT(n.zzz, 'translate(' + f1(zt * 14) + ',' + f1(-zt * 34) + ')'); setO(n.zzz, Math.sin(Math.PI * zt) * 0.7);
    } else setO(n.zzz, 0);
    if (ruhig) return aktiv || unruhig;
    return true;
  }

  // ---------- Steuerung ----------
  var ctl = {
    el: wrap,
    get x() { return z.x; }, get y() { return z.y; }, get skala() { return z.skala; }, get stimmungJetzt() { return z.name; },
    schau: function (x, y) {
      if (x == null) { z.schau = null; return ctl; }
      z.schau = richtung(x, y); wecke(); return ctl;
    },
    blick: function (dx, dy) { z.schau = dx == null ? null : { x: +dx || 0, y: +dy || 0 }; wecke(); return ctl; },
    // Kurzer Blick auf einen Punkt (Bildschirm-Pixel) oder eine Richtung {dx,dy}; danach wieder frei
    blickZu: function (x, y, ms) {
      var r = (x && typeof x === 'object') ? { x: klemm(+x.dx || 0, -1, 1), y: klemm(+x.dy || 0, -1, 1) } : richtung(+x || 0, +y || 0);
      if (x && typeof x === 'object' && ms == null) ms = y;
      var alt = z.kurz || z.schau || { x: z.gx.x, y: z.gy.x }, weit = Math.hypot(r.x - alt.x, r.y - alt.y);
      z.kurz = { x: r.x, y: r.y, bis: performance.now() + (ms == null ? 1600 : +ms) };
      // nur ein großer Blicksprung bekommt Blinzeln und ein Zucken der Blätter (sonst werden Ereignisse zum Tick)
      if (!RUHIG() && weit > 0.35) { z.blinzel = Math.min(z.blinzel, 0.06); zuckBlaetter(-sg(r.x) * Math.min(40, Math.abs(r.x) * 60)); }
      if (z.gew && z.gew.name !== 'lesen') gewEnde(false);
      if (z.nickt) aufwachen(true);
      wecke(); return ctl;
    },
    stimmung: function (s) {
      if (!STIMMUNG[s]) s = 'ruhig';
      var vorher = z.name; z.name = s; z.st = STIMMUNG[s];
      if (s === 'froh' && vorher !== 'froh') { z.glueh = performance.now() + 1400; if (!RUHIG()) ctl.huepf(10); }
      if (s === 'staunt' && vorher !== 'staunt') { z.sy.v += 2.2; z.bR.v -= 200; z.bL.v += 200; z.lid.v -= 3; }
      if (s === 'denkt') { z.bL.v += 120; }
      if (z.gew && (s !== 'ruhig' || vorher !== 'ruhig')) gewEnde(false);
      if (s !== 'ruhig' && z.nickt) aufwachen(s !== 'schlaeft');
      wrap.setAttribute('data-stimmung', s);
      wecke(); return ctl;
    },
    huepf: function (h) {
      return new Promise(function (ok) {
        if (RUHIG()) { z.sy.x = 0.94; z.glueh = performance.now() + 900; wecke(); setTimeout(ok, 200); return; }
        if (z.huepf) { var alt = z.huepf.fertig; z.huepf.fertig = function () { alt && alt(); ok(); }; return; }
        z.huepf = { t0: performance.now(), h: h || 22, fertig: ok }; wecke();
      });
    },
    geh: function (x, ms, o) {
      o = o || {};
      return new Promise(function (ok) {
        x = +x || 0; ms = ms == null ? 600 : +ms;
        var s1 = o.skala != null ? +o.skala : z.skala, y1 = o.y != null ? +o.y : z.y;
        if (z.gang && z.gang.fertig) z.gang.fertig();
        if (z.gew) gewEnde(false);
        if (RUHIG() || ms <= 0) { z.x = x; z.y = y1; z.skala = s1; wrap.style.transform = 'translate3d(' + f1(x) + 'px,' + f1(y1) + 'px,0) scale(' + s1 + ')'; z.gang = null; z.mess = 0; wecke(); ok(); return; }
        z.gang = { x0: z.x, x1: x, y0: z.y, y1: y1, s0: z.skala, s1: s1, t0: performance.now(), ms: Math.max(60, ms), fertig: ok };
        wecke();
      });
    },
    groesse: function (px) {
      px = Math.max(20, +px || 220); z.groesse = px;
      wrap.style.height = px + 'px'; wrap.style.width = Math.round(px * W / H) + 'px'; z.mess = 0; return ctl;
    },
    teile: function (k) {
      k = Math.max(0, Math.min(5, k == null ? 5 : +k));
      n.teile.forEach(function (g) {
        var t = +g.getAttribute('data-t'), sichtbar = t <= k, war = g.style.display !== 'none';
        g.style.display = sichtbar ? '' : 'none';
        if (sichtbar && !war && !RUHIG() && g.animate) {
          g.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1.14)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 440, easing: 'cubic-bezier(.3,.7,.4,1)' });
        }
      });
      if (k >= 3 && z.teileK != null && z.teileK < 3) { z.sitz.v -= 60; setTimeout(function () { ctl.huepf(10); }, 520); }
      z.teileK = k; wecke(); return ctl;
    },
    kleid: function (o) {
      o = o || {};
      function setze(g, wert) { if (!g) return; g.innerHTML = (wert && typeof wert === 'object' && wert.svg) ? String(wert.svg) : ''; }
      if ('socken' in o) {
        var sk = o.socken, eigene = sk && typeof sk === 'object' && sk.svg;
        setze(kleidG.sockenL, eigene ? sk : null); setze(kleidG.sockenR, eigene ? sk : null);
        n.teile.forEach(function (g) { if (g.classList.contains('c6z-socke')) g.style.visibility = (!sk || eigene) ? 'hidden' : ''; });
        var c = farbe(sk, null);
        if (c) { n.stoff.forEach(function (p) { p.setAttribute('fill', c); }); n.bund.forEach(function (p) { p.setAttribute('fill', ton(c, -0.18)); }); }
      }
      ['muetze', 'schal', 'brille', 'jacke'].forEach(function (k) { if (k in o) setze(kleidG[k], o[k]); });
      if ('wimpern' in o) {
        var wi = o.wimpern, eig = wi && typeof wi === 'object' && wi.svg, keine = wi === 'keine' || (wi && wi.keine);
        n.augen.forEach(function (a) {
          if (a.__wk) a.__wk.innerHTML = eig ? String(wi.svg) : '';
          if (a.__wstd) a.__wstd.style.display = (eig || keine) ? 'none' : '';
        });
      }
      if ('fell' in o || 'farbe' in o) {
        var fe = o.fell || (o.farbe ? { farbe: o.farbe } : null), fc = farbe(fe, STEIN);
        n.st0.forEach(function (s) { s.setAttribute('stop-color', ton(fc, 0.6)); });
        n.st1.forEach(function (s) { s.setAttribute('stop-color', fc); });
        n.st2.forEach(function (s) { s.setAttribute('stop-color', ton(fc, -0.15)); });
        setze(kleidG.fell, fe && fe.muster ? { svg: fe.muster } : null);
      }
      if ('gefaehrt' in o) {
        var gf = o.gefaehrt && typeof o.gefaehrt === 'object' ? o.gefaehrt : null;
        z.gefaehrt = gf;
        if (n.gfHinten) n.gfHinten.innerHTML = gf && gf.hinten ? String(gf.hinten) : '';
        if (n.gfVorn) n.gfVorn.innerHTML = gf && gf.vorn ? String(gf.vorn) : '';
        z.gfBeine = gf && gf.sitz && gf.sitz.beine === 'weg' ? 'weg' : 'baumeln';
        z.gfSchwebt = gf ? gf.schwebt !== false : true;
        wrap.toggleAttribute('data-gefaehrt', !!gf);
        if (!gf && z.imGf) ctl.sitzIn(false);
        if (KL) klGf();
        wecke();
      }
      return ctl;
    },
    // Körperlicht: {dx, dy} = Richtung zur Lichtquelle oder {x, y} = Lichtquelle in Bildschirm-Pixeln
    // (sonst die Quelle des Raums), staerke 0..1,
    // dreh = Drehung der Figur in Grad (damit das Licht im Raum bleibt); null schaltet es aus
    licht: function (o) {
      if (!o) { z.kl = null; klAus(); z.lichtNeu = true; wecke(); return ctl; }
      var k = z.kl || (z.kl = { st: 0.85, dreh: 0, hat: false, x: 0, y: 0 }), neuBau = !KL;
      if (o.x != null && o.y != null) { k.hat = true; k.x = +o.x || 0; k.y = +o.y || 0; }
      if (o.dx != null && o.dy != null) {
        var dl = Math.hypot(+o.dx || 0, +o.dy || 0) || 1;
        k.dir = true; k.dx = (+o.dx || 0) / dl; k.dy = (+o.dy || 0) / dl;
        z.lz.lx = z.licht.lx = k.dx; z.lz.ly = z.licht.ly = k.dy;
      }
      if (o.staerke != null) k.st = klemm(+o.staerke || 0, 0, 1);
      if (o.dreh != null) k.dreh = +o.dreh || 0;
      if (neuBau) { klBau(); z.lichtT = 0; z.mess = 0; }
      z.lichtNeu = true; wecke(); return ctl;
    },
    get sitztIm() { return z.imGf; },
    // Carl setzt sich ins Gefährt (oder steht wieder auf)
    sitzIn: function (an) {
      an = an == null ? true : (an === 'aus' || an === 'false' || an === 'nein') ? false : !!an;
      if (an && !z.gefaehrt) return ctl;
      if (an === z.imGf) return ctl;
      if (an && z.sitzen) ctl.sitz(false);
      if (z.gew) gewEnde(false);
      z.imGf = an;
      if (!RUHIG()) { z.sy.v -= an ? 1.6 : -1.2; z.gfY.v += an ? -14 : 10; zuckBlaetter(an ? 160 : -120); z.pL.v += an ? 60 : -40; z.pR.v -= an ? 50 : -40; }
      else { z.gfP.x = z.gfP.z = an ? 1 : 0; z.gfP.v = 0; }
      if (an) { z.rotor.z = 0; z.flug.z = 0; }
      wrap.toggleAttribute('data-sitzt-im', an);
      wecke(); return ctl;
    },
    anker: function () {
      var a = JSON.parse(JSON.stringify(ANKER)); a.m = M; a.svg = svg; a.ab = G.aug.ab / M; a.kb = G.kb / M; a.hoch = G.aug.hoch / M; a.clip = 'url(#koerper-' + id + ')'; return a;
    },
    drueck: function () {
      z.druck = true; wecke();
      setTimeout(function () { los(true); }, 150);
      return ctl;
    },
    sprich: function (an) { z.sprich = !!an; if (!an) z.spT2 = 0; if (an && z.gew) gewEnde(false); if (an && z.nickt) aufwachen(true); wecke(); return ctl; },
    get fliegtJetzt() { return z.fliegt; },
    // leises Schweben als Grundzustand an/aus (z. B. wo Carl fest auf etwas stehen soll)
    schweben: function (an) { z.schwebAn = an == null ? null : an !== false; wecke(); return ctl; },
    get schwebtJetzt() { return z.schweb.x > 0.5; },
    get szeneJetzt() { return z.sz ? z.sz.art : null; },
    get sitztJetzt() { return z.sitzen; },
    sitz: function (an) {
      an = an == null ? true : (an === 'aus' || an === 'false' || an === 'nein') ? false : !!an;
      if (an && z.fliegt) ctl.flieg(false);
      if (an && z.imGf) return ctl;
      if (an && !z.sitzen && !RUHIG() && !klein) { z.plumps = performance.now(); z.plLand = false; z.szT = 4 + Math.random() * 2; }
      if (!an) { z.sz = null; z.plumps = 0; }
      if (an !== z.sitzen && !RUHIG()) { z.sy.v -= an ? 1.4 : -1.2; z.pL.v += an ? 30 : -20; z.pR.v -= an ? 24 : -20; z.fdMy.v += an ? 30 : -20; }
      z.sitzen = an;
      if (RUHIG()) { z.sitzP.x = z.sitzP.z = an ? 1 : 0; z.sitzP.v = 0; }
      wecke(); return ctl;
    },
    flieg: function (an) {
      an = an == null ? true : (an === 'aus' || an === 'false' || an === 'nein') ? false : !!an;
      return new Promise(function (ok) {
        if (z.imGf) { z.fliegt = an; z.gelandet = !an; wecke(); setTimeout(function () { ok(ctl); }, 0); return; }
        if (z.fliegt === an && Math.abs(z.flug.x - (an ? 1 : 0)) < 0.03) { ok(ctl); return; }
        if (an && z.gew) gewEnde(false);
        if (an && !z.fliegt && !RUHIG()) { z.sy.v -= 1.6; z.sx.v += 1.2; }
        z.fliegt = an;
        if (RUHIG()) { z.flug.x = z.flug.z = an ? 1 : 0; z.rotor.x = z.rotor.z = an ? 1 : 0; z.flug.v = z.rotor.v = 0; z.gelandet = !an; wecke(); setTimeout(function () { ok(ctl); }, 0); return; }
        z.flugOk.push(function () { ok(ctl); }); wecke();
      });
    },
    fliegZu: function (x, y, ms, o) {
      o = o || {};
      var war = z.fliegt || z.imGf;
      x = +x || 0; y = y == null ? z.y : +y;
      var dist = Math.hypot(x - z.x, y - z.y);
      ms = ms == null ? Math.min(1600, 520 + dist * 1.1) : +ms;
      if (RUHIG() || ms <= 0) { ctl.geh(x, 0, { y: y, skala: o.skala }); return ctl.flieg(o.landen != null ? !o.landen : war).then(function () { return ctl; }); }
      if (!z.imGf) ctl.flieg(true);
      if (z.gew) gewEnde(false);
      return new Promise(function (ok) {
        if (z.gang && z.gang.fertig) z.gang.fertig();
        z.gang = { x0: z.x, x1: x, y0: z.y, y1: y, s0: z.skala, s1: o.skala != null ? +o.skala : z.skala, t0: performance.now() + (war ? 0 : 260), ms: Math.max(120, ms), flug: true, bogen: Math.min(46, dist * 0.18), fertig: ok };
        wecke();
      }).then(function () { return (!z.imGf && (o.landen != null ? o.landen : !war)) ? ctl.flieg(false) : ctl; }).then(function () { return ctl; });
    },
    // Gewohnheiten: der Raum sagt, was hier passt; eine sofort anstoßen
    gewohnheiten: function (liste) {
      if (typeof liste === 'string') liste = [liste];
      liste = (liste || []).filter(function (x) { return x in GEWOHNHEIT; });
      z.gewListe = liste.length ? liste : ['umsehen']; return ctl;
    },
    gewohnheit: function (name) {
      return new Promise(function (ok) {
        if (!name) { var l = z.gewListe; name = l[Math.floor(Math.random() * l.length)]; }
        if (name === 'einnicken' || name === 'nicken') { einnicken(); ok(z.nickt); return; }
        if (!darfGewohnheit(name) && name !== 'sitzen') { ok(false); return; }
        if (!gewStart(name, ok)) ok(false);
      });
    },
    get gewohnheitJetzt() { return z.gew ? z.gew.name : (z.nickt ? 'nickt' : null); },
    get nicktJetzt() { return z.nickt; },
    nick: function () { einnicken(); return ctl; },
    wach: function () { aufwachen(true); return ctl; },
    weg: function () {
      var i = alle.indexOf(f); if (i >= 0) alle.splice(i, 1);
      if (io) io.unobserve(wrap);
      wrap.remove();
    }
  };
  f.ctl = ctl;
  // Antippen: kurz gedrückt wie ein Kuscheltier, dann schaut er dich an
  wrap.addEventListener('pointerdown', function () { z.druck = true; if (z.gew) gewEnde(false); wecke(); });
  function los(immer) { if (!z.druck && !immer) return; z.druck = false; z.sy.v += 2.4; z.sx.v -= 1.8; z.bR.v += 200; z.bL.v -= 200; z.fdMy.v += 50; z.pL.v += 30; z.pR.v -= 30; z.front = performance.now() + 1600; z.hoertBis = performance.now() + 1800; z.glueh = performance.now() + 900; z.blinzel = 0.25; if (z.nickt) aufwachen(true); wecke(); }
  wrap.addEventListener('pointerup', function () { los(); }); wrap.addEventListener('pointercancel', function () { los(); }); wrap.addEventListener('pointerleave', function () { los(); });

  ctl.groesse(opt.groesse || 220);
  var S = C6.S || {};
  var sockenFarbe = farbe(S.du && S.du.socken, '#5d86b0');
  ctl.kleid({ socken: { farbe: sockenFarbe } });
  try { if (C6.laden && C6.laden.an) ctl.kleid(C6.laden.an() || {}); } catch (e) { }
  if (opt.kleid) ctl.kleid(opt.kleid);
  if (opt.gewohnheiten) ctl.gewohnheiten(opt.gewohnheiten);
  ctl.teile(opt.teile == null ? 5 : opt.teile);
  z.sitz.x = z.sitz.z = z.teileK < 3 ? G.bein - 3 : 0; z.sitz.v = 0;
  ctl.stimmung(opt.stimmung || 'ruhig');
  wecke();
  return ctl;
}

// ---------- Ereignisse: Carl schaut hin, wartet, nickt ein ----------
(function () {
  if (!C6.bus || !C6.bus.on) return;
  var D = document;
  function punktVon(d) {
    if (!d) return null;
    try {
      if (d.el && d.el.getBoundingClientRect) { var r = d.el.getBoundingClientRect(); if (r.width || r.height) return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
      if (d.rect && d.rect.width != null) return { x: d.rect.left + d.rect.width / 2, y: d.rect.top + d.rect.height / 2 };
      if (typeof d.x === 'number' && typeof d.y === 'number' && (d.x > 1 || d.y > 1)) return { x: d.x, y: d.y };
    } catch (e) { }
    return null;
  }
  function dock() { var el = D.querySelector('.c6k-dock') || (C6.eingabe && C6.eingabe.el); if (el && el.getBoundingClientRect) { var r = el.getBoundingClientRect(); if (r.width) return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; } return { x: innerWidth / 2, y: innerHeight - 60 }; }
  function hinschauen(raum, punkt, richt, ms) {
    figurenIn(raum).forEach(function (f) {
      var c = f.ctl; if (!c) return;
      if (punkt) c.blickZu(punkt.x, punkt.y, ms); else if (richt) c.blickZu({ dx: richt[0], dy: richt[1] }, ms);
    });
  }
  C6.bus.on('gespraech', function (z) { var p = punktVon(z); if (z && z.von === 'du') hinschauen(null, p || dock(), null, 1500); else hinschauen(null, p, [0, 0.15], 1200); });
  C6.bus.on('blase', function (d) { hinschauen(null, punktVon(d), [0, 0.12], 900); });
  C6.bus.on('gesagt', function (d) { hinschauen(d && d.raum, punktVon(d) || dock(), null, 1300); });
  ['baustein', 'geruest', 'auftrag'].forEach(function (n) { C6.bus.on(n, function (d) { hinschauen(d && d.raum, punktVon(d), [0.55, -0.2], 1500); }); });
  C6.bus.on('space', function (d) { hinschauen(null, punktVon(d), [0.6, -0.1], 1200); });
  ['muenzen', 'muenze'].forEach(function (n) { C6.bus.on(n, function (d) { hinschauen(null, punktVon(d), [0.7, -0.7], 1400); }); });
  C6.bus.on('projektor', function (d) { var offen = d && (d.offen !== false); hinschauen(null, punktVon(d), offen ? [0.85, -0.15] : [0, 0.1], 1300); });
  // Licht: nur wenn die Quelle wirklich wandert (Lampe an, Sonne weiter), nicht bei jedem Flackern; höchstens alle 4 s
  var lichtAlt = {};
  C6.bus.on('licht', function (d) {
    var q = d && d.quelle; if (!q) return;
    var k = d.raum || '-', a = lichtAlt[k], jetzt = Date.now();
    var neu = !a || a.art !== q.art || Math.hypot(a.x - q.x, a.y - q.y) > 0.08;
    lichtAlt[k] = { x: q.x, y: q.y, art: q.art, t: a ? a.t : 0 };
    if (!neu || jetzt - (a ? a.t : 0) < 4000) return;
    lichtAlt[k].t = jetzt;
    figurenIn(d.raum).forEach(function (f) {
      var c = f.ctl, b = f.el.closest && f.el.closest('.c6-buehne'); if (!c) return;
      if (b) { var r = b.getBoundingClientRect(); c.blickZu(r.left + q.x * r.width, r.top + q.y * r.height, 1200); }
      else c.blickZu({ dx: (q.x - 0.5) * 2, dy: (q.y - 0.5) * 2 }, 1200);
    });
  });
  // Kleidung: was Carl im Laden anzieht, trägt er in jedem Raum (Mütze, Schal, Brille, Jacke, Socken); das Gefährt bleibt Sache des Raums
  function kleidAlle(k) {
    if (!k || typeof k !== 'object') { try { k = C6.laden && typeof C6.laden.an === 'function' ? C6.laden.an() : null; } catch (e) { k = null; } }
    if (!k || typeof k !== 'object') return;
    var o = {}, s = '';
    ['socken', 'muetze', 'schal', 'brille', 'jacke', 'wimpern', 'fell'].forEach(function (x) { if (x in k) o[x] = k[x]; });
    try { s = JSON.stringify(o); } catch (e) { return; }
    alle.forEach(function (f) { if (!f.ctl || f.ohneKleid || f.kleidS === s) return; f.kleidS = s; try { f.ctl.kleid(o); } catch (e) { } });
  }
  C6.bus.on('kleid', function (k) { kleidAlle(k); });
  // Tipp auf die Bühne (nicht auf Carl): er schaut dorthin
  window.addEventListener('pointerdown', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    if (t.closest('.c6z-figur')) return;
    var b = t.closest('.c6-buehne'); if (!b) return;
    var raum = b.getAttribute('data-raum');
    figurenIn(raum).forEach(function (f) { if (f.ctl) f.ctl.blickZu(e.clientX, e.clientY, 1800); });
  }, { passive: true, capture: true });
  // Wartezeit: 1 umsehen · 2 Gewohnheit des Raums · 3 einnicken; wach beim nächsten Zeichen
  // Stufe 2 kommt mit Verzögerung: erst darf der Raum sein kleines Ereignis zeigen (Vogel, Seite), dann Carls Gewohnheit
  C6.bus.on('warte', function (d) {
    var stufe = d && d.stufe, raum = d && d.raum, seit = C6.warte && C6.warte.seit ? C6.warte.seit() : 0;
    function los() {
      if (C6.warte && C6.warte.seit && C6.warte.seit() < seit) return;   // inzwischen berührt
      figurenIn(raum).forEach(function (f) {
        var c = f.ctl; if (!c) return;
        if (stufe === 1) c.gewohnheit('umsehen');
        else if (stufe === 2) { if (c.stimmungJetzt === 'ruhig' || c.stimmungJetzt === 'hoert') c.gewohnheit(); }
        else if (stufe === 3) c.nick();
      });
    }
    if (stufe === 2) setTimeout(los, 2800); else los();
  });
  C6.bus.on('wach', function (d) { figurenIn(d && d.raum).forEach(function (f) { if (f.ctl && f.ctl.nicktJetzt) f.ctl.wach(); }); });
})();

// Stehendes Bild als SVG-Text (ohne Bewegung)
function bild(px, o) {
  o = o || {};
  var hpx = px || 64, wpx = Math.round(hpx * W / H);
  var id = 'c6zb' + (++zaehler), s = markup(id, { stimmung: o.stimmung, klein: hpx <= 52 });
  s = s.replace('<svg class="c6z-svg"', '<svg class="c6z-svg c6z-bild" width="' + wpx + '" height="' + hpx + '"');
  var c = farbe(C6.S && C6.S.du && C6.S.du.socken, '#5d86b0');
  s = s.replace(/class="c6z-sockenstoff"/g, 'class="c6z-sockenstoff" fill="' + c + '"').replace(/class="c6z-sockenbund"/g, 'class="c6z-sockenbund" fill="' + ton(c, -0.18) + '"');
  return s;
}

C6.figur = { male: male, bild: bild, anker: ANKER, m: M, _G: G, gewohnheiten: Object.keys(GEWOHNHEIT) };
