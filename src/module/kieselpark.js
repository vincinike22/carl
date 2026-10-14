// Kieselpark · Finger-BMX mit deinem eigenen Rad
var C6 = window.C6 = window.C6 || {};

function S() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(fn);
  else { fn(S()); try { C6.speichern && C6.speichern(); } catch (e) {} }
}
function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function ruhig() { return !!C6.ruhig; }

// ---------- Teile fürs Rad ----------
// Jede Reihe ändert genau eine Sache an genau einem Teil (zu = Teil am Rad, was = 'form' | 'farbe').
// Ein Stück ist geschenkt (frei), kostet Münzen (preis) oder wird im Kieselpark gewonnen (sonst).
var TEILE = {
  rahmenform: { titel: 'Form', zu: 'rahmen', was: 'form', teile: [
    { id: 'diamant', name: 'Klassisch', frei: true },
    { id: 'tief', name: 'Tiefer Einstieg', frei: true },
    { id: 'mixte', name: 'Zwei Rohre', frei: true }
  ] },
  rahmenfarbe: { titel: 'Farbe', zu: 'rahmen', was: 'farbe', teile: [
    { id: 'tusche', name: 'Tusche', farbe: '#2b2722', frei: true },
    { id: 'see', name: 'Seeblau', farbe: '#2f5f8a', frei: true },
    { id: 'moos', name: 'Moos', farbe: '#5f7f3e', frei: true },
    { id: 'ziegel', name: 'Ziegel', farbe: '#a4492e', frei: true },
    { id: 'senf', name: 'Senf', farbe: '#c9a03a', frei: true },
    { id: 'creme', name: 'Creme', farbe: '#eadfc8', frei: true },
    { id: 'kupfer', name: 'Kupfer', farbe: '#b0673a', preis: 6 }
  ] },
  reifen: { titel: 'Reifen', zu: 'rad', was: 'farbe', teile: [
    { id: 'tusche', name: 'Tusche', farbe: '#2b2722', frei: true },
    { id: 'sand', name: 'Sand', farbe: '#c8b58f', frei: true },
    { id: 'ziegel', name: 'Ziegelrot', farbe: '#a4492e' },
    { id: 'see', name: 'Seeblau', farbe: '#2f5f8a' },
    { id: 'moos', name: 'Moos', farbe: '#5f7f3e' }
  ] },
  profil: { titel: 'Profil', zu: 'rad', was: 'form', teile: [
    { id: 'glatt', name: 'Glatt', frei: true },
    { id: 'rillen', name: 'Rillen', frei: true },
    { id: 'stollen', name: 'Stollen' },
    { id: 'doppelt', name: 'Doppelt' }
  ] },
  felge: { titel: 'Speichen', zu: 'rad', was: 'form', teile: [
    { id: 'viele', name: 'Viele', frei: true },
    { id: 'wenige', name: 'Wenige', frei: true },
    { id: 'scheibe', name: 'Scheibe', preis: 6 }
  ] },
  sattel: { titel: 'Form', zu: 'sattel', was: 'form', teile: [
    { id: 'schlank', name: 'Schlank', frei: true },
    { id: 'gefedert', name: 'Gefedert', frei: true },
    { id: 'sport', name: 'Sportlich', frei: true }
  ] },
  sattelfarbe: { titel: 'Bezug', zu: 'sattel', was: 'farbe', teile: [
    { id: 'tusche', name: 'Tusche', farbe: '#2b2722', frei: true },
    { id: 'leder', name: 'Leder', farbe: '#8a5f3f', frei: true },
    { id: 'creme', name: 'Creme', farbe: '#eadfc8', frei: true },
    { id: 'kirsch', name: 'Kirsch', farbe: '#b8333a', preis: 4 }
  ] },
  lenker: { titel: 'Form', zu: 'lenker', was: 'form', teile: [
    { id: 'geschwungen', name: 'Geschwungen', frei: true },
    { id: 'gerade', name: 'Gerade', frei: true },
    { id: 'hoch', name: 'Hoch', frei: true },
    { id: 'renn', name: 'Rennbügel', frei: true }
  ] },
  band: { titel: 'Griffe', zu: 'lenker', was: 'farbe', teile: [
    { id: 'ohne', name: 'Tusche', farbe: null, frei: true },
    { id: 'leder', name: 'Leder', farbe: '#8a5f3f', frei: true },
    { id: 'kirsch', name: 'Kirsch', farbe: '#b8333a' },
    { id: 'wiese', name: 'Wiese', farbe: '#5f7f3e' }
  ] },
  klingelform: { titel: 'Form', zu: 'klingel', was: 'form', teile: [
    { id: 'glocke', name: 'Glocke', frei: true },
    { id: 'daumen', name: 'Daumenklingel', frei: true },
    { id: 'hupe', name: 'Hupe', preis: 5 }
  ] },
  klingel: { titel: 'Farbe', zu: 'klingel', was: 'farbe', teile: [
    { id: 'silber', name: 'Silber', farbe: '#c9c4ba', frei: true },
    { id: 'himmel', name: 'Himmel', farbe: '#8db4d6', frei: true },
    { id: 'gelb', name: 'Gelb', farbe: '#d9a62e' },
    { id: 'kirsch', name: 'Kirsch', farbe: '#b8333a' }
  ] },
  korb: { titel: 'Korb', zu: 'korb', was: 'form', teile: [
    { id: 'weide', name: 'Weide', frei: true },
    { id: 'draht', name: 'Draht', frei: true },
    { id: 'kiste', name: 'Kiste', frei: true },
    { id: 'ohne', name: 'Ohne', frei: true }
  ] },
  korbinhalt: { titel: 'Darin', zu: 'korb', was: 'form', teile: [
    { id: 'leer', name: 'Nichts', frei: true },
    { id: 'buch', name: 'Ein Buch', frei: true },
    { id: 'aepfel', name: 'Äpfel', frei: true },
    { id: 'blumen', name: 'Blumen', preis: 4 }
  ] },
  licht: { titel: 'Form', zu: 'licht', was: 'form', teile: [
    { id: 'eckig', name: 'Eckig', frei: true },
    { id: 'rund', name: 'Rund', frei: true },
    { id: 'laterne', name: 'Laterne', preis: 6 }
  ] },
  schein: { titel: 'Schein', zu: 'licht', was: 'form', teile: [
    { id: 'warm', name: 'Warm', frei: true },
    { id: 'hell', name: 'Hell', frei: true },
    { id: 'aus', name: 'Aus', frei: true }
  ] },
  pedale: { titel: 'Form', zu: 'pedale', was: 'form', teile: [
    { id: 'schlicht', name: 'Schlicht', frei: true },
    { id: 'breit', name: 'Breit', frei: true },
    { id: 'block', name: 'Mit Rückstrahler', frei: true }
  ] },
  pedalfarbe: { titel: 'Farbe', zu: 'pedale', was: 'farbe', teile: [
    { id: 'tusche', name: 'Tusche', farbe: '#2b2722', frei: true },
    { id: 'silber', name: 'Silber', farbe: '#9a948b', frei: true },
    { id: 'ziegel', name: 'Ziegel', farbe: '#a4492e', frei: true },
    { id: 'gold', name: 'Gold', farbe: '#c9a03a', preis: 4 }
  ] },
  kette: { titel: 'Farbe', zu: 'kette', was: 'farbe', teile: [
    { id: 'tusche', name: 'Tusche', farbe: '#2b2722', frei: true },
    { id: 'silber', name: 'Silber', farbe: '#9a948b', frei: true },
    { id: 'gold', name: 'Gold', farbe: '#c9a03a', preis: 5 }
  ] },
  kettenschutz: { titel: 'Schutz', zu: 'kette', was: 'form', teile: [
    { id: 'ohne', name: 'Offen', frei: true },
    { id: 'mit', name: 'Kettenschutz', frei: true }
  ] }
};
// Im Park-Menü stehen nur die Reihen, in denen es etwas zu gewinnen gibt
var PARKREIHEN = ['reifen', 'profil', 'band', 'klingel'];
function teil(art, id) { var a = TEILE[art].teile; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return a[0]; }
function bmx() {
  var s = S();
  if (!s.bmx || typeof s.bmx !== 'object') s.bmx = {};
  var b = s.bmx;
  if (!b.parks) b.parks = {};
  if (!b.teile || typeof b.teile !== 'object') b.teile = {};
  Object.keys(TEILE).forEach(function (art) { if (art !== 'rahmenfarbe' && !b.teile[art]) b.teile[art] = TEILE[art].teile[0].id; });
  if (!Array.isArray(b.besitz)) b.besitz = [];
  if (!Array.isArray(b.neu)) b.neu = [];
  return b;
}
function besitzt(art, id) {
  var t = teil(art, id); if (t.frei || bmx().besitz.indexOf(art + ':' + id) >= 0) return true;
  try { return !!(C6.muenzen && typeof C6.muenzen.hat === 'function' && C6.muenzen.hat('rad:' + art + ':' + id)); } catch (e) { return false; }
}
function rahmenFarbe() {
  var b = bmx().teile;
  if (b.rahmenfarbe) return teil('rahmenfarbe', b.rahmenfarbe).farbe;
  // noch nie gewählt: die Farbe des Spaces am Rahmen, sonst Tusche
  try { var sid = S().rad && S().rad.teile && S().rad.teile.rahmen; var st = sid && C6.strings && C6.strings.hol(sid); if (st && st.farbe) return st.farbe; } catch (e) {}
  return '#2b2722';
}
function ausstattung() {
  var b = bmx().teile, a = {};
  Object.keys(TEILE).forEach(function (art) {
    var t = teil(art, b[art]);
    a[art] = TEILE[art].was === 'farbe' ? (t.farbe === undefined ? null : t.farbe) : t.id;
  });
  a.rahmen = rahmenFarbe();
  return a;
}
// Woher ein Stück kommt: {frei} · {preis} · {park, parkName, text}
function herkunft(art, id) {
  var t = teil(art, id);
  if (t.frei) return { frei: true };
  if (t.preis) return { preis: t.preis };
  var l = art + ':' + id, r = null;
  Object.keys(PARKS).forEach(function (pid) { PARKS[pid].ch.forEach(function (c) { if (!r && c.lohn === l) r = { park: pid, parkName: PARKS[pid].name, text: c.text }; }); });
  return r || {};
}
function waehle(art, id) {
  if (!TEILE[art] || !besitzt(art, id)) return false;
  aendern(function (s) { var b = bmx(); b.teile[art] = id; b.neu = b.neu.filter(function (x) { return x !== art + ':' + id; }); });
  emit('rad', { was: 'teil', art: art, id: id });
  return true;
}
function kaufe(art, id) {
  var t = teil(art, id);
  if (!t.preis || besitzt(art, id)) return waehle(art, id);
  var ok = false;
  try {
    if (C6.muenzen && typeof C6.muenzen.kaufe === 'function') ok = C6.muenzen.kaufe('rad:' + art + ':' + id, t.preis, { art: 'rad', name: TEILE[art].titel + ' ' + t.name });
    else if (C6.muenzen) ok = C6.muenzen.ausgeben(t.preis);
  } catch (e) { ok = false; }
  if (!ok) return false;
  aendern(function (s) { var b = bmx(); if (b.besitz.indexOf(art + ':' + id) < 0) b.besitz.push(art + ':' + id); });
  return waehle(art, id);
}

// ---------- Parks ----------
var STEP = 4;
function gel0(g, x) { return g.p[Math.min(g.p.length - 1, Math.round(x / STEP))]; }
function Bau(y0) {
  var g = { p: [y0], zonen: [], rails: [], deko: [], holz: [], kisten: [], loecher: [], muenzen: [], y: y0, ziel: null };
  g.x = function () { return (this.p.length - 1) * STEP; };
  g.kurve = function (len, f) { var y0 = this.y, n = Math.max(1, Math.round(len / STEP)); for (var i = 1; i <= n; i++) this.p.push(y0 + f(i / n)); this.y = this.p[this.p.length - 1]; return this; };
  g.flach = function (len) { return this.kurve(len, function () { return 0; }); };
  g.s = function (len, h) { return this.kurve(len, function (t) { return h * (1 - Math.cos(Math.PI * t)) / 2; }); };
  g.kicker = function (len, h, rueck) { this.kurve(len, function (t) { return h * Math.pow(t, 2.1); }); if (rueck) this.s(rueck, -h); return this; };
  g.viertelHoch = function (R) { var c = 0.992; return this.kurve(R * c, function (t) { return R * (1 - Math.sqrt(1 - Math.pow(t * c, 2))); }); };
  g.viertelRunter = function (R) { var c = 0.992, h = R * (1 - Math.sqrt(1 - c * c)); return this.kurve(R * c, function (t) { return -h + R * (1 - Math.sqrt(1 - Math.pow((1 - t) * c, 2))); }); };
  g.loch = function (w, tief) { var y0 = this.y, lx = this.x(); this.loecher.push({ von: lx, bis: lx + w + STEP }); this.p.push(y0 - tief); var n = Math.round(w / STEP); for (var i = 1; i < n; i++) this.p.push(y0 - tief); this.p.push(y0); this.y = y0; return this; };
  // Stufe: senkrecht (ein Schritt breit) um h, dann flach
  g.stufe = function (h, breite) { this.p.push(this.y + h); this.y += h; return this.flach(breite); };
  g.treppe = function (n, breite, h) { var x0 = this.x(), y0 = this.y; for (var i = 0; i < n; i++) this.stufe(h, breite); return { x1: x0, y1: y0, x2: this.x(), y2: this.y }; };
  // Rails: art 'rail' (Geländer, auch schräg) | 'kante' (Bank aus Stein, Körper mit grindbarer Oberkante)
  g.rail = function (len, h, art) { var x = this.x(); this.rails.push({ x1: x, x2: x + len, y1: this.y + h, y2: this.y + h, y: this.y + h, art: art || 'rail', boden: this.y }); return this; };
  g.railVon = function (x1, y1, x2, y2) { this.rails.push({ x1: x1, x2: x2, y1: y1, y2: y2, y: Math.max(y1, y2), art: 'rail', boden: Math.min(y1, y2) - 30 }); return this; };
  g.kiste = function (w, h) { this.kisten.push({ x: this.x(), y: this.y, w: w, h: h }); return this; };
  g.zone = function (z) { this.zonen.push(z); return this; };
  g.deko_ = function (art, extra) { var d = { art: art, x: this.x(), y: this.y }; for (var k in extra) d[k] = extra[k]; this.deko.push(d); return this; };
  g.holz_ = function (von, bis, extra) { var h = { von: von, bis: bis }; for (var k in extra) h[k] = extra[k]; this.holz.push(h); return this; };
  g.ziel_ = function () { this.ziel = this.x(); return this.deko_('ziel'); };
  // Münze im Park: dx vor der aktuellen Stelle, h über dem jetzigen Boden (oder absolut mit muenzeBei)
  g.muenze_ = function (dx, h, geheim) { this.muenzen.push({ x: this.x() + dx, y: this.y + h, geheim: !!geheim }); return this; };
  g.muenzeBei = function (x, y, geheim) { this.muenzen.push({ x: x, y: y, geheim: !!geheim }); return this; };
  return g;
}

var PARKS = {
  hof: {
    name: 'Hof', unter: 'Treppen und Geländer', nacht: false, kappe: 300, lauf: 75,
    bau: function () {
      var g = Bau(64);
      g.flach(230).muenze_(-50, 34).deko_('baum').flach(60);
      var t = g.treppe(5, 18, -12);
      g.railVon(t.x1 - 6, t.y1 + 26, t.x2 + 6, t.y2 + 26);
      g.muenzeBei((t.x1 + t.x2) / 2, (t.y1 + t.y2) / 2 + 62);
      g.flach(150).deko_('laterne').flach(60);
      var a = g.x(); g.kicker(70, 34, 22); g.holz_(a, g.x()); g.muenze_(34, 104);
      g.flach(170);
      var kv = g.x(); g.kicker(84, 42); var ktop = g.x(); g.flach(150); var kend = g.x(); g.s(96, -42);
      g.muenzeBei(ktop + 75, gel0(g, ktop) + 36);
      g.holz_(kv, g.x(), { kiesel: true });
      g.zone({ id: 'kiste', von: kv - 20, bis: ktop + 4, ueber: kend - 24 });
      g.flach(150).deko_('leine').flach(60);
      g.rail(170, 22, 'kante').muenze_(85, 60).flach(170);
      g.flach(110).kiste(36, 24).flach(36).flach(130).deko_('baum', { gross: true });
      var h = g.x(); g.s(70, 30).flach(40).muenze_(-20, 92).s(70, -30); g.holz_(h, g.x(), { erde: true });
      g.flach(150);
      var t2 = g.treppe(4, 20, -12);
      g.railVon(t2.x1 - 6, t2.y1 + 26, t2.x2 + 6, t2.y2 + 26);
      g.flach(140).deko_('laterne').flach(50);
      var k2 = g.x(); g.kicker(62, 30, 18); g.holz_(k2, g.x());
      g.flach(120).ziel_().flach(260);
      return g;
    },
    ch: [
      { id: 'drei', text: 'Drei Sprünge in einer Fahrt', lohn: 'reifen:ziegel', m: 3 },
      { id: 'kiste', text: 'Über die ganze Kiste', lohn: 'band:kirsch', m: 3 },
      { id: 'salto', text: 'Einen Salto sauber landen', lohn: 'klingel:gelb', m: 4 }
    ]
  },
  dach: {
    name: 'Dachpark', unter: 'Lücken zwischen den Dächern', nacht: false, abend: true, kappe: 330, lauf: 75,
    bau: function () {
      var g = Bau(0);
      g.flach(260).deko_('kamin').flach(160).muenze_(0, 34).flach(80);
      var kv = g.x(); g.kicker(80, 36); var lip = g.x(); g.holz_(kv, lip, { offen: true });
      g.muenze_(48, 58);
      g.loch(90, 300); var lend = g.x();
      g.zone({ id: 'luecke', von: kv - 40, bis: lip + 4, ueber: lend + 2 });
      var ld = g.x(); g.s(48, -36); g.holz_(ld, g.x(), { offen: true });
      g.flach(150).deko_('antenne').flach(60);
      g.rail(240, 30, 'rail').muenze_(150, 72).flach(240);
      g.flach(90);
      var l2 = g.x(); g.loch(84, 300); var l2e = g.x();
      g.muenzeBei((l2 + l2e) / 2, g.y + 52);
      g.zone({ id: 'luecke', von: l2 - 160, bis: l2 + 2, ueber: l2e + 2 });
      g.p[g.p.length - 1] -= 40; g.y -= 40;
      g.flach(120).deko_('tank').flach(40);
      var st = g.x(); g.s(90, 46); g.holz_(st, g.x(), { stufe: true }); g.muenze_(30, 36);
      g.flach(110).kiste(30, 30).flach(30).flach(120).deko_('antenne').flach(40);
      var l3 = g.x(); g.loch(110, 300); var l3e = g.x();
      g.railVon(l3 - 30, g.y + 4, l3e + 30, g.y + 4);
      g.muenzeBei((l3 + l3e) / 2, g.y + 50);
      g.zone({ id: 'luecke', von: l3 - 160, bis: l3 + 2, ueber: l3e + 2 });
      g.flach(150);
      var k2 = g.x(); g.kicker(64, 28, 16); g.holz_(k2, g.x());
      g.flach(130).ziel_().flach(260);
      return g;
    },
    ch: [
      { id: 'rail', text: 'Ein Geländer ganz entlang', lohn: 'profil:stollen', m: 4 },
      { id: 'luecke', text: 'Über die Lücke', lohn: 'reifen:see', m: 4 },
      { id: 'kombi', text: 'Salto und Dreher in einem Sprung', lohn: 'band:wiese', m: 5 }
    ]
  },
  pipe: {
    name: 'Bowl', unter: 'unterm Sternenhimmel', nacht: true, kappe: 460, pipe: true, lauf: 60,
    bau: function () {
      var g = Bau(200);
      g.flach(120);
      g.viertelRunter(220);
      g.flach(150);
      g.muenze_(-75, 34);
      var sp = g.x(); g.s(70, 46).muenze_(0, 64).s(70, -46); g.holz_(sp, g.x(), { spine: true });
      g.flach(150).muenze_(-75, 34);
      g.viertelHoch(220);
      g.flach(120);
      // ganz oben, wo der Mond steht: nur mit viel Schwung erreichbar
      g.muenzeBei(g.x() - 120 - 18, 200 + 86, true);
      return g;
    },
    start: 120 + 218 + 60,
    kante: 200,
    ch: [
      { id: 'kante', text: 'Hoch über die Kante', lohn: 'klingel:kirsch', m: 4 },
      { id: 'fuenf', text: 'Fünf Tricks in einer Fahrt', lohn: 'reifen:moos', m: 4 },
      { id: 'doppel', text: 'Ein Doppelsalto', lohn: 'profil:doppelt', m: 6 }
    ]
  }
};
var REIHE = ['hof', 'dach', 'pipe'];
function lohnName(l) { var p = l.split(':'); return TEILE[p[0]].titel + ' ' + teil(p[0], p[1]).name.toLowerCase(); }

// ---------- Zeichnen des Rads (Seitenansicht, Weltkoordinaten y nach oben, Blick nach rechts) ----------
function zeichneRad(c, o) {
  // o: {tinte, papier, aus, rad (Raddrehung), kurbel, lw, druck}
  var T = o.tinte, A = o.aus || {}, lw = o.lw, R = 11, P = o.papier;
  var dr = o.druck || 0; // Federn beim Landen
  function fb(f) { return !f || f === '#2b2722' ? T : f; }
  c.lineCap = 'round'; c.lineJoin = 'round';
  function linie(pts, w, farbe) {
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.strokeStyle = farbe; c.lineWidth = w; c.stroke();
  }
  function rad(x, y) {
    c.save(); c.translate(x, y);
    if (A.felge === 'scheibe') { c.fillStyle = P; c.beginPath(); c.arc(0, 0, R - 3.6, 0, 7); c.fill(); }
    // Reifen
    c.strokeStyle = fb(A.reifen); c.lineWidth = 3.2 * lw;
    c.beginPath(); c.arc(0, 0, R - 1.2, 0, 7); c.stroke();
    if (A.profil === 'stollen') {
      c.lineWidth = 1.6 * lw;
      for (var i = 0; i < 16; i++) { var a = o.rad + i / 16 * Math.PI * 2; c.beginPath(); c.moveTo(Math.cos(a) * (R - .3), Math.sin(a) * (R - .3)); c.lineTo(Math.cos(a) * (R + 1.3), Math.sin(a) * (R + 1.3)); c.stroke(); }
    } else if (A.profil === 'doppelt') {
      c.lineWidth = 1.1 * lw; c.beginPath(); c.arc(0, 0, R - 3.4, 0, 7); c.stroke();
    } else if (A.profil === 'rillen') {
      c.strokeStyle = P; c.lineWidth = 0.6 * lw; c.setLineDash([1.2, 1.4]); c.lineDashOffset = -o.rad * 8;
      c.beginPath(); c.arc(0, 0, R - 1.2, 0, 7); c.stroke(); c.setLineDash([]);
    }
    // Felge + Speichen
    c.strokeStyle = T; c.lineWidth = 1.2 * lw;
    c.beginPath(); c.arc(0, 0, R - 3.6, 0, 7); c.stroke();
    if (A.felge === 'scheibe') {
      c.lineWidth = 0.7 * lw; c.beginPath(); c.arc(0, 0, R - 6, o.rad, o.rad + 1.4); c.stroke();
    } else {
      var n = A.felge === 'wenige' ? 4 : 6;
      c.lineWidth = (A.felge === 'wenige' ? 1.3 : 0.9) * lw;
      for (var j = 0; j < n; j++) { var b = o.rad + j / n * Math.PI * 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(b) * (R - 3.6), Math.sin(b) * (R - 3.6)); c.stroke(); }
    }
    c.fillStyle = T; c.beginPath(); c.arc(0, 0, 1.4, 0, 7); c.fill();
    c.restore();
  }
  var fh = o.federH || 0, fv = o.federV || 0;
  rad(-19, R + fh); rad(19, R + fv);
  c.save(); c.translate(0, -dr * 2.5);
  var rahmen = fb(A.rahmen);
  var tret = [-2, 13], kopfO = [13.5, 30], kopfU = [15.5, 25], sitz = [-8, 27], hint = [-19, R + dr * 2.5 + fh];
  // Kette (unter dem Rahmen)
  var kf = fb(A.kette);
  c.strokeStyle = kf; c.lineWidth = 0.9 * lw;
  c.beginPath(); c.arc(tret[0], tret[1], 3.4, 0, 7); c.stroke();
  linie([[tret[0], tret[1] + 3.4], [hint[0], hint[1] + 1.6]], 0.8 * lw, kf);
  if (A.kettenschutz === 'mit') { linie([[tret[0] + 1, tret[1] + 4.2], [hint[0] + 3, hint[1] + 2.6]], 2.2 * lw, rahmen); }
  // Rahmen nach Form
  var w = 2.6 * lw;
  if (A.rahmenform === 'tief') {
    c.strokeStyle = rahmen; c.lineWidth = w;
    c.beginPath(); c.moveTo(kopfU[0], kopfU[1]); c.quadraticCurveTo(2, 15, tret[0], tret[1]); c.stroke();
    c.beginPath(); c.moveTo(kopfO[0] + .4, kopfO[1] - 1.5); c.quadraticCurveTo(0, 21, -5.5, 19); c.stroke();
    linie([[tret[0], tret[1]], [sitz[0], sitz[1]]], w, rahmen);
    linie([[tret[0], tret[1]], hint, [sitz[0], sitz[1]]], w, rahmen);
  } else if (A.rahmenform === 'mixte') {
    linie([[kopfU[0], kopfU[1]], tret, sitz], w, rahmen);
    linie([kopfO, [sitz[0] + 2, sitz[1] - 4], hint], w * .8, rahmen);
    linie([tret, hint], w, rahmen);
  } else {
    linie([kopfU, tret, sitz, kopfO], w, rahmen);
    linie([tret, hint, sitz], w, rahmen);
  }
  // Gabel + Steuerrohr
  linie([kopfO, kopfU, [19, R + dr * 2.5 + fv]], 2.4 * lw, rahmen);
  // Korb vorn (wenn einer dran ist)
  if (A.korb && A.korb !== 'ohne') {
    c.fillStyle = A.korb === 'kiste' ? '#d9b98a' : P; c.strokeStyle = T; c.lineWidth = 0.9 * lw;
    c.beginPath(); c.moveTo(17, 30); c.lineTo(26.5, 30); c.lineTo(25.5, 25.5); c.lineTo(18, 25.5); c.closePath();
    if (A.korb !== 'draht') c.fill(); c.stroke();
    if (A.korbinhalt === 'blumen' || A.korbinhalt === 'aepfel') { c.fillStyle = A.korbinhalt === 'blumen' ? '#b8333a' : '#a4492e'; c.beginPath(); c.arc(20, 31.2, 1.2, 0, 7); c.arc(23.4, 31.4, 1.2, 0, 7); c.fill(); }
    if (A.korbinhalt === 'buch') { c.fillStyle = '#2f5f8a'; c.fillRect(20.5, 29.5, 2, 3.6); }
  }
  // Licht
  if (A.schein && A.schein !== 'aus') {
    c.fillStyle = A.schein === 'hell' ? 'rgba(255,246,200,.55)' : 'rgba(246,217,138,.5)';
    c.beginPath(); c.moveTo(18, 24); c.lineTo(30, 27); c.lineTo(30, 19); c.closePath(); c.fill();
  }
  c.fillStyle = A.licht === 'laterne' ? '#c9a03a' : P; c.strokeStyle = T; c.lineWidth = 0.9 * lw;
  c.beginPath(); if (A.licht === 'rund') c.arc(17.6, 23, 1.6, 0, 7); else c.rect(16.4, 21.8, 2.6, 2.6); c.fill(); c.stroke();
  // Vorbau + Lenker nach Form
  c.strokeStyle = T; c.lineWidth = 2.2 * lw;
  var griff;
  c.beginPath(); c.moveTo(kopfO[0], kopfO[1]);
  if (A.lenker === 'gerade') { c.lineTo(13, 37); c.lineTo(8.5, 37.4); griff = [[10.8, 37.3], [8.5, 37.4]]; }
  else if (A.lenker === 'hoch') { c.lineTo(13, 38); c.quadraticCurveTo(12.6, 43, 9.5, 42.4); c.lineTo(7.4, 41.4); griff = [[9.4, 42.2], [7.4, 41.4]]; }
  else if (A.lenker === 'renn') { c.lineTo(13, 36); c.lineTo(10.5, 36.2); c.quadraticCurveTo(8, 36, 8.2, 33.8); c.quadraticCurveTo(8.4, 32.4, 10, 32.6); griff = [[10.4, 36.2], [8.2, 34]]; }
  else { c.lineTo(12.5, 36); c.lineTo(8.5, 41); griff = [[10.6, 38.4], [8.3, 41.3]]; }
  c.stroke();
  if (A.band) {
    linie(griff, 3.4 * lw, A.band);
  }
  // Klingel
  c.fillStyle = A.klingel || '#c9c4ba'; c.strokeStyle = T; c.lineWidth = 1.1 * lw;
  c.beginPath();
  if (A.klingelform === 'daumen') c.arc(12.6, 37.6, 1.3, 0, 7);
  else if (A.klingelform === 'hupe') { c.moveTo(11.4, 37); c.lineTo(15.4, 38.6); c.lineTo(15.4, 36.2); c.closePath(); }
  else { c.arc(12.8, 37.2, 2.2, Math.PI, 0); c.closePath(); }
  c.fill(); c.stroke();
  // Sattel
  c.strokeStyle = T; c.lineWidth = 2 * lw;
  c.beginPath(); c.moveTo(sitz[0], sitz[1]); c.lineTo(-9.2, 30); c.stroke();
  c.fillStyle = fb(A.sattelfarbe); c.strokeStyle = T; c.lineWidth = 0.6 * lw;
  c.beginPath();
  if (A.sattel === 'gefedert') { c.moveTo(-15, 31.2); c.quadraticCurveTo(-9, 34.6, -4.6, 31.6); c.quadraticCurveTo(-9, 29.4, -15, 31.2); }
  else if (A.sattel === 'sport') { c.moveTo(-14, 31.4); c.quadraticCurveTo(-8, 33, -2.6, 31.2); c.quadraticCurveTo(-8, 30.2, -14, 31.4); }
  else { c.moveTo(-14.5, 31.2); c.quadraticCurveTo(-9, 33.6, -4, 31.4); c.quadraticCurveTo(-9, 29.6, -14.5, 31.2); }
  c.fill(); c.stroke();
  // Kurbel + Pedale
  var k = o.kurbel, pf = fb(A.pedalfarbe);
  for (var s = 0; s < 2; s++) {
    var a = k + s * Math.PI, px = tret[0] + Math.cos(a) * 6, py = tret[1] + Math.sin(a) * 6;
    linie([tret, [px, py]], 2 * lw, T);
    var pw = A.pedale === 'breit' ? 3.4 : 2.6;
    linie([[px - pw, py], [px + pw, py]], (A.pedale === 'schlicht' ? 2 : 2.8) * lw, pf);
    if (A.pedale === 'block') { c.fillStyle = '#e2a23b'; c.fillRect(px + pw - .8, py - .6, 1.2, 1.2); }
  }
  c.restore();
}

// ---------- Das Spiel ----------
(function () {
  var DT = 1 / 60, LAUF = 60, HOP = 410, ZWEIPI = Math.PI * 2;
  var ebene, cv, cx, ui = {}, W = 0, H = 0, dpr = 1, kB = 1, k = 1, oy = 0, raf = 0, tLetzt = 0, acc = 0;
  var lauf = false, pause = true, parkId = 'hof', P = null, gel = null, L = 1, SL = 1, zeit = 0, wrap = true;
  var b = null, cam = { x: 0, y: 0, z: 1 }, teilchen = [], punkte = 0, aus = null;
  var fahrt = { lufte: 0, tricks: 0 }, combo = { n: 0, p: 0, namen: [] }, bodenZeit = 0, rest = LAUF, laufAn = false, laufNeu = [], still = 0;
  var eingabe = { r: false, l: false, vor: false, bremse: false, lehneT: 0, zwei: false, lade: false, ladeT: 0, zug: 0, dSpin: 0, finger: false, zeiger: {} };
  var F = {}, sterne = [], korn = null, hinweisAn = false, landeText = null;

  function klemm(v, a, c) { return v < a ? a : v > c ? c : v; }
  function wd(a) { while (a > Math.PI) a -= ZWEIPI; while (a < -Math.PI) a += ZWEIPI; return a; }
  function hash(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); }
  function mod(x) { return ((x % L) + L) % L; }
  function xm(x) { return wrap ? mod(x) : klemm(x, 0, L); }
  function idx(x) { var q = xm(x) / STEP, i = Math.min(gel.p.length - 2, Math.floor(q)); return [i, q - i]; }
  function gy(x) { var r = idx(x), p = gel.p; return p[r[0]] + (p[r[0] + 1] - p[r[0]]) * r[1]; }
  function knotW(i) {
    var p = gel.p, n = p.length;
    if (wrap && (i === 0 || i === n - 1)) return Math.atan2(p[1] - p[n - 2], 2 * STEP);
    var a = Math.max(0, i - 1), c = Math.min(n - 1, i + 1);
    return Math.atan2(p[c] - p[a], (c - a) * STEP);
  }
  function segW(i) {
    var p = gel.p, n = p.length;
    if (i < 0) { if (!wrap) i = 0; else i += n - 1; }
    if (i > n - 2) { if (!wrap) i = n - 2; else i -= n - 1; }
    return Math.atan2(p[i + 1] - p[i], STEP);
  }
  // Steigung: zwischen ähnlichen Segmenten weich, an Kanten (Absprung, Lücke, Rampenlippe) scharf
  function ga(x) {
    var r = idx(x), i = r[0], f = r[1], a = segW(i);
    if (f < 0.5) { var v = segW(i - 1); if (Math.abs(v - a) < 0.5) return a + (v - a) * (0.5 - f); }
    else { var n2 = segW(i + 1); if (Math.abs(n2 - a) < 0.5) return a + (n2 - a) * (f - 0.5); }
    return a;
  }
  function sVon(x) { var lap = wrap ? Math.floor(x / L) : 0, r = idx(x), s = gel.s; return s[r[0]] + (s[r[0] + 1] - s[r[0]]) * r[1] + lap * SL; }
  function xVon(s) {
    var lap = wrap ? Math.floor(s / SL) : 0, sm = s - lap * SL; if (!wrap) sm = klemm(sm, 0, SL);
    var A = gel.s, lo = 0, hi = A.length - 1;
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (A[m] <= sm) lo = m; else hi = m; }
    return (lo + (sm - A[lo]) / ((A[lo + 1] - A[lo]) || 1)) * STEP + lap * L;
  }

  // ----- Körperwelt (planck.js) -----
  // Einheiten: Spiel 20 = 1 m. Das Rad ist ein Rahmen mit zwei Rädern an Feder-Dämpfer-Gelenken,
  // Carl hängt an einem Hüftgelenk mit Motor (Gewicht verlagern). Beim Sturz löst es sich, Beine und Arm werden Glieder.
  var SC = 20, GRAV = -22, schrittN = 0, laufMuenzen = 0, pl = null, wl = null, kr = null, glieder = [], hist = [], histT = 0, luftT = 0, einT = 0, wheelie = { art: null, t: 0 }, zielDa = false;
  function V(x, y) { return pl.Vec2(x / SC, y / SC); }
  function neuesRad(x) {
    b = { x: x, y: gy(x), v: 0, vx: 0, vy: 0, st: 'boden', f: 1, th: ga(x), spinSum: 0, dreh: 0, drehAn: false, dreher: 0, wende: 0,
      rad: 0, kurbel: 0.6, druck: 0, luft: null, sturz: 0, rail: null, nachSturz: 0, wackel: 0, jubel: 0, feder: { l: 0, r: 0 }, lehne: 0, zx: x, zy: gy(x), frei: 0, freiN: 0 };
  }
  function baueWelt() {
    pl = window.planck;
    if (!pl) return false;
    wl = new pl.World({ gravity: pl.Vec2(0, GRAV), continuousPhysics: false });
    var bo = wl.createBody();
    var pts = [V(0, gel.p[0] + 900)];
    for (var i = 0; i < gel.p.length; i++) pts.push(V(i * STEP, gel.p[i]));
    pts.push(V(L, gel.p[gel.p.length - 1] + 900));
    bo.createFixture(pl.Chain(pts, false), { friction: 0.9, userData: 'boden' });
    gel.kisten.forEach(function (q) { bo.createFixture(pl.Box(q.w / 2 / SC, q.h / 2 / SC, V(q.x + q.w / 2, q.y + q.h / 2), 0), { friction: 0.8, userData: 'boden' }); });
    gel.rails.forEach(function (r) {
      if (r.art === 'kante') bo.createFixture(pl.Box((r.x2 - r.x1) / 2 / SC, (r.y - r.boden) / 2 / SC, V((r.x1 + r.x2) / 2, (r.y + r.boden) / 2), 0), { friction: 0.2, userData: r });
      else bo.createFixture(pl.Edge(V(r.x1, r.y1), V(r.x2, r.y2)), { friction: 0.12, userData: r });
    });
    wl.on('begin-contact', function (ct) { kontakt(ct, 1); });
    wl.on('end-contact', function (ct) { kontakt(ct, -1); });
    // Geländer und Kanten tragen nur von oben und nur die Räder (Einweg-Flächen); wer darauf rollt, grindet
    wl.on('pre-solve', function (ct) {
      if (!kr) return;
      var fa = ct.getFixtureA(), fb = ct.getFixtureB(), r = fa.getUserData(), o = fb;
      if (!(r && typeof r === 'object')) { r = fb.getUserData(); o = fa; }
      if (!(r && typeof r === 'object')) return;
      var ou = o.getUserData(), body = o.getBody();
      if (ou !== 'rad') { if (r.art === 'rail') ct.setEnabled(false); return; }
      var p = body.getPosition(), x = p.x * SC, y = p.y * SC;
      var ry = r.art === 'kante' ? r.y : r.y1 + (r.y2 - r.y1) * klemm((x - r.x1) / (r.x2 - r.x1), 0, 1);
      if (y < ry + 6) { if (r.art === 'rail') ct.setEnabled(false); return; }
      var w = body === kr.rl ? 'l' : 'r';
      kr.railT[w] = schrittN; kr.railObj = r;
    });
    return true;
  }
  function istBoden(u) { return u === 'boden' || (u && typeof u === 'object'); }
  function kontakt(ct, d) {
    if (!kr) return;
    var fa = ct.getFixtureA(), fb = ct.getFixtureB();
    [[fa, fb], [fb, fa]].forEach(function (q) {
      var mein = q[0].getUserData(), fremd = q[1].getUserData(), body = q[0].getBody();
      if (!istBoden(fremd)) return;
      if (mein === 'rad') {
        var w = body === kr.rl ? 'l' : body === kr.rr ? 'r' : null; if (!w) return;
        if (typeof fremd === 'object') return; // Geländer und Kanten zählen über pre-solve
        kr.kon[w] = Math.max(0, kr.kon[w] + d);
      } else if (mein === 'kopf' && d > 0 && body === kr.to && (fremd === 'boden' || fremd.art === 'kante')) kr.kopfStoss = true;
      else if (mein === 'rahmen' && d > 0) kr.rahmenStoss = (kr.rahmenStoss || 0) + 1;
    });
  }
  function baueRad(x, f, vx0) {
    var y = gy(x) + 0.5, a = ga(x), cs = Math.cos(a), sn = Math.sin(a), grp = -1;
    function wp(lx, ly) { return V(x + lx * cs - ly * sn, y + lx * sn + ly * cs); }
    var ch = wl.createDynamicBody({ position: V(x, y), angle: a, angularDamping: 0.05, linearDamping: 0.04 });
    ch.createFixture(pl.Polygon([V(-15, 15), V(15, 15), V(14, 31), V(-12, 31)]), { density: 1.1, friction: 0.3, filterGroupIndex: grp, userData: 'rahmen' });
    var rl = wl.createDynamicBody({ position: wp(-19, 11) }), rr = wl.createDynamicBody({ position: wp(19, 11) });
    [rl, rr].forEach(function (r) { r.createFixture(pl.Circle(11 / SC), { density: 1.2, friction: 1.5, filterGroupIndex: grp, userData: 'rad' }); });
    var axis = pl.Vec2(-sn, cs);
    var jl = wl.createJoint(pl.WheelJoint({ enableMotor: false, maxMotorTorque: 26, frequencyHz: 7, dampingRatio: 0.7 }, ch, rl, rl.getPosition(), axis));
    var jr = wl.createJoint(pl.WheelJoint({ enableMotor: false, maxMotorTorque: 26, frequencyHz: 7, dampingRatio: 0.7 }, ch, rr, rr.getPosition(), axis));
    var to = wl.createDynamicBody({ position: wp(-1.5 * f, 47), angle: a });
    to.createFixture(pl.Circle(11 / SC), { density: 0.9, friction: 0.7, filterGroupIndex: grp, userData: 'kopf' });
    kr = { ch: ch, rl: rl, rr: rr, jl: jl, jr: jr, to: to, hj: null, f: f, kon: { l: 0, r: 0 }, railT: { l: -9, r: -9 }, railObj: null, kopfStoss: false };
    huefte();
    if (vx0) [ch, rl, rr, to].forEach(function (q) { q.setLinearVelocity(pl.Vec2(vx0 * cs / SC, vx0 * sn / SC)); });
    b.f = f; b.st = 'boden'; b.wende = 0; b.luft = null; b.rail = null; b.frei = 0; b.freiN = 0; luftT = -0.3;
    sync();
  }
  function huefte() {
    if (kr.hj) { wl.destroyJoint(kr.hj); kr.hj = null; }
    var a = kr.ch.getAngle(), cs = Math.cos(a), sn = Math.sin(a), p = kr.ch.getPosition();
    var lx = -1.5 * kr.f / SC, ly = 47 / SC;
    kr.to.setPosition(pl.Vec2(p.x + lx * cs - ly * sn, p.y + lx * sn + ly * cs)); kr.to.setAngle(a);
    kr.to.setLinearVelocity(kr.ch.getLinearVelocity());
    kr.hj = wl.createJoint(pl.RevoluteJoint({ enableLimit: true, lowerAngle: -0.55, upperAngle: 0.55, enableMotor: true, maxMotorTorque: 70, motorSpeed: 0 }, kr.ch, kr.to, kr.ch.getWorldPoint(V(-6.5 * kr.f, 36))));
  }
  function alleKoerper() { var a = kr ? [kr.ch, kr.rl, kr.rr, kr.to] : []; return a.concat(glieder.map(function (g) { return g.k; })); }
  function wegRad() {
    if (!wl) return;
    alleKoerper().forEach(function (q) { try { wl.destroyBody(q); } catch (e) {} });
    kr = null; glieder = [];
  }
  function impuls(dvx, dvy) { // gleiche Geschwindigkeitsänderung für alle Teile, keine Gelenkstöße
    if (!kr) return;
    [kr.ch, kr.rl, kr.rr, kr.to].forEach(function (q) { var m = q.getMass(); q.applyLinearImpulse(pl.Vec2(dvx * m / SC, dvy * m / SC), q.getWorldCenter(), true); });
  }
  // Den ganzen Verbund (Rahmen, Räder, Carl) starr um den gemeinsamen Schwerpunkt drehen
  function drehAlle(w) {
    var tl = [kr.ch, kr.rl, kr.rr, kr.to], m = 0, cx2 = 0, cy2 = 0, vx2 = 0, vy2 = 0;
    tl.forEach(function (q) { var mm = q.getMass(), c = q.getWorldCenter(), v = q.getLinearVelocity(); m += mm; cx2 += c.x * mm; cy2 += c.y * mm; vx2 += v.x * mm; vy2 += v.y * mm; });
    cx2 /= m; cy2 /= m; vx2 /= m; vy2 /= m;
    var dw = w - kr.ch.getAngularVelocity();
    tl.forEach(function (q) {
      var c = q.getWorldCenter();
      q.setLinearVelocity(pl.Vec2(vx2 - w * (c.y - cy2), vy2 + w * (c.x - cx2)));
      q.setAngularVelocity(q.getAngularVelocity() + dw);
    });
  }
  function wende() {
    if (!kr || b.st === 'sturz') return;
    kr.f = -kr.f; huefte();
    b.wende = 0.001;
  }
  function sync() {
    if (!kr) return;
    var p = kr.ch.getPosition(), v = kr.ch.getLinearVelocity();
    b.x = p.x * SC; b.y = p.y * SC; b.th = kr.ch.getAngle(); b.vx = v.x * SC; b.vy = v.y * SC; b.v = b.vx;
    var ll = kr.ch.getLocalPoint(kr.rl.getPosition()), lr = kr.ch.getLocalPoint(kr.rr.getPosition());
    b.feder.l = ll.y * SC - 11; b.feder.r = lr.y * SC - 11;
    b.rad = kr.rl.getAngle();
    b.lehne = kr.hj ? kr.hj.getJointAngle() : 0;
    if (b.st === 'sturz') { var t = kr.to.getPosition(); b.zx = t.x * SC; b.zy = t.y * SC; } else { b.zx = b.x; b.zy = b.y; }
  }
  // Gelenkfigur beim Sturz: Beine (Ober-, Unterschenkel) und ein Arm entstehen aus der Pose, Hüfte löst sich
  function gliedK(p1, p2, breit) {
    var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2, l = Math.max(0.05, Math.hypot(p2.x - p1.x, p2.y - p1.y));
    var k = wl.createDynamicBody({ position: pl.Vec2(mx, my), angle: Math.atan2(p2.y - p1.y, p2.x - p1.x), angularDamping: 0.6 });
    k.createFixture(pl.Box(l / 2, breit / SC), { density: 1.0, friction: 0.8, filterGroupIndex: -1, userData: 'glied' });
    k.setLinearVelocity(kr.to.getLinearVelocity());
    var g = { k: k, l: l * SC, breit: breit }; glieder.push(g); return g;
  }
  function gelenk(a, c, p, lo, hi) { wl.createJoint(pl.RevoluteJoint({ enableLimit: true, lowerAngle: lo, upperAngle: hi }, a, c, p)); }
  function puppe() {
    if (kr.hj) { wl.destroyJoint(kr.hj); kr.hj = null; }
    var to = kr.to, w = function (lx, ly) { return kr.ch.getWorldPoint(V(lx * kr.f, ly)); };
    var hip = to.getWorldPoint(V(-5 * kr.f, -9)), sh = to.getWorldPoint(V(7 * kr.f, -6));
    for (var s = 0; s < 2; s++) {
      var a = b.kurbel + s * Math.PI, fuss = w(-2 + Math.cos(a) * 6, 15 + Math.sin(a) * 6);
      var kn = pl.Vec2((hip.x + fuss.x) / 2 + 0.2 * kr.f, (hip.y + fuss.y) / 2 + 0.1);
      var o = gliedK(hip, kn, 1.8), u = gliedK(kn, fuss, 1.7);
      gelenk(to, o.k, hip, -2.2, 1.2); gelenk(o.k, u.k, kn, -2.4, 0.1);
      o.s = s; u.s = s; o.typ = 'bein'; u.typ = 'fuss';
    }
    var gr = w(9.4, 39.6), el = pl.Vec2((sh.x + gr.x) / 2, (sh.y + gr.y) / 2 - 0.1);
    var oa = gliedK(sh, el, 1.3), ua = gliedK(el, gr, 1.2);
    gelenk(to, oa.k, sh, -2.6, 2.6); gelenk(oa.k, ua.k, el, -2.4, 0.2);
    oa.typ = 'arm'; ua.typ = 'hand';
    // ein kleiner Schubs, damit Carl wirklich fällt
    to.applyLinearImpulse(pl.Vec2(kr.ch.getLinearVelocity().x * 0.15 * to.getMass(), 2.2 * to.getMass()), to.getWorldCenter(), true);
    to.setAngularVelocity(-kr.f * 4);
  }

  // ----- Bauen der Ebene -----
  function bau() {
    ebene = document.createElement('div');
    ebene.className = 'c6s-park';
    ebene.hidden = true;
    ebene.setAttribute('role', 'dialog');
    ebene.setAttribute('aria-label', 'Kieselpark');
    ebene.innerHTML =
      '<canvas class="c6s-park-cv" aria-hidden="true"></canvas>' +
      '<button class="c6s-rund c6s-park-pause" type="button" aria-label="Pause"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>' +
      '<button class="c6s-rund c6s-park-zu" type="button" aria-label="Kieselpark schließen"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>' +
      '<div class="c6s-park-kopf" aria-live="off"><span class="c6s-park-punkte"></span><span class="c6s-park-kiesel" role="img"></span></div>' +
      '<div class="c6s-park-combo" aria-hidden="true"></div>' +
      '<div class="c6s-park-trick" aria-live="polite"></div>' +
      '<div class="c6s-park-geschafft" aria-live="polite" hidden></div>' +
      '<div class="c6s-park-hilfe" aria-hidden="true"></div>' +
      '<div class="c6s-park-ende" role="group" aria-label="Lauf vorbei" hidden></div>' +
      '<div class="c6s-park-karte" hidden>' +
      '  <div class="c6s-park-karte-kopf"><canvas class="c6s-park-vorschau" aria-hidden="true"></canvas><div><p class="c6s-park-titel">Kieselpark</p><p class="c6s-park-satz"></p><button type="button" class="c6s-park-garage">Rad umbauen in der Garage</button></div></div>' +
      '  <div class="c6s-park-pausetun"><button type="button" class="c6s-knopf c6s-park-weiter" hidden>Weiter fahren</button><button type="button" class="c6s-knopf c6s-leise c6s-park-fertig" hidden>Punkte zählen</button></div>' +
      '  <div class="c6s-park-reihe" role="list"></div>' +
      '</div>';
    document.body.appendChild(ebene);
    cv = ebene.querySelector('.c6s-park-cv'); cx = cv.getContext('2d');
    ['kopf', 'punkte', 'kiesel', 'combo', 'trick', 'geschafft', 'hilfe', 'ende', 'karte', 'weiter', 'fertig', 'reihe', 'vorschau', 'satz', 'garage'].forEach(function (n) { ui[n] = ebene.querySelector('.c6s-park-' + n); });
    ebene.querySelector('.c6s-park-zu').onclick = function () { C6.kieselpark.zu(); };
    ebene.querySelector('.c6s-park-pause').onclick = function () { pause ? (P && ui.ende.hidden ? weiter() : zeigeKarte(false)) : zeigeKarte(true); };
    ui.weiter.onclick = function () { weiter(); };
    ui.fertig.onclick = function () { ui.karte.hidden = true; ebene.classList.remove('c6s-karte-auf'); laufEnde(false); };
    ui.garage.onclick = function () { zurGarage(); };
    REIHE.forEach(function (id) {
      var p = PARKS[id];
      var a = document.createElement('div');
      a.className = 'c6s-park-wahl' + (p.nacht ? ' c6s-nachtkarte' : '') + (p.abend ? ' c6s-abendkarte' : '');
      a.setAttribute('role', 'listitem');
      a.dataset.park = id;
      a.innerHTML = '<div class="c6s-park-bild" aria-hidden="true">' + parkBild(id) + '</div>' +
        '<p class="c6s-park-wahl-name">' + p.name + '</p><p class="c6s-park-wahl-unter">' + p.unter + '<span class="c6s-park-beste"></span></p>' +
        '<ul class="c6s-park-ch">' + p.ch.map(function (c) { return '<li data-ch="' + c.id + '"><span class="c6s-haken" aria-hidden="true"></span><span>' + c.text + lohnZeile(c) + '</span></li>'; }).join('') + '</ul>' +
        '<button type="button" class="c6s-knopf c6s-park-los">Fahren</button>';
      a.querySelector('.c6s-park-los').onclick = function () { starte(id); };
      ui.reihe.appendChild(a);
    });
    cv.addEventListener('pointerdown', zeigerAb);
    cv.addEventListener('pointermove', zeigerZieh);
    cv.addEventListener('pointerup', zeigerAuf);
    cv.addEventListener('pointercancel', zeigerAuf);
    ebene.addEventListener('touchmove', function (e) { if (e.target === cv) e.preventDefault(); }, { passive: false });
    ebene.addEventListener('contextmenu', function (e) { if (e.target === cv) e.preventDefault(); });
  }

  function lohnZeile(c) {
    var q = c.lohn.split(':'), t = teil(q[0], q[1]);
    return '<small class="c6s-ch-lohn">' + (t.farbe ? '<i style="background:' + t.farbe + '"></i>' : '') + ({ reifen: 'Reifen', profil: 'Profil', band: 'Griffe', klingel: 'Klingel' }[q[0]] || TEILE[q[0]].titel) + ' ' + t.name.toLowerCase() + ' · ' + c.m + ' Münzen</small>';
  }
  function zurGarage() {
    try { if (C6.geh) C6.geh('fahrrad'); } catch (e) {}
    C6.kieselpark.zu();
  }
  function parkBild(id) {
    var t = '#2b2722', s = 'stroke="' + t + '" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    if (id === 'hof') return '<svg viewBox="0 0 120 60" width="120" height="60"><rect x="0" y="0" width="120" height="60" rx="8" fill="#efe4cf"/><circle cx="98" cy="14" r="8" fill="#f2cf86"/><path d="M8 52V20h28v32" fill="#e3d2b6" ' + s + '/><path d="M6 20l16-10 16 10" fill="#b98a6a" ' + s + '/><path d="M16 28h5M27 28h5M16 38h5M27 38h5" ' + s + '/><path d="M46 52c10 0 16-8 22-16h22v16z" fill="#d4ad79" ' + s + '/><path d="M98 52V42h14v10" fill="#cfc6b8" ' + s + '/><path d="M2 52h116" ' + s + '/></svg>';
    if (id === 'dach') return '<svg viewBox="0 0 120 60" width="120" height="60"><rect x="0" y="0" width="120" height="60" rx="8" fill="#f0d2b4"/><circle cx="92" cy="30" r="13" fill="#eea36d" opacity=".9"/><path d="M4 34h40c8 0 12-5 14-9v31H4z" fill="#d6b49c" ' + s + '/><path d="M66 34h50v22H66z" fill="#d6b49c" ' + s + '/><path d="M20 34V22h8v12M88 34V16M84 20h8" ' + s + '/><path d="M76 28h30M78 28v6M104 28v6" ' + s + '/></svg>';
    return '<svg viewBox="0 0 120 60" width="120" height="60"><rect x="0" y="0" width="120" height="60" rx="8" fill="#141a33"/><path d="M6 16h10c0 20 6 34 22 36h44c16-2 22-16 22-36h10v40H6z" fill="#5b4a3c"/><path stroke="#eef0ff" stroke-width="2" fill="none" stroke-linecap="round" d="M6 16h10c0 20 6 34 22 36h44c16-2 22-16 22-36h10"/><circle cx="60" cy="14" r="1.6" fill="#eef0ff"/><circle cx="34" cy="9" r="1.2" fill="#eef0ff"/><circle cx="76" cy="22" r="1.2" fill="#eef0ff"/><path fill="#f6e7b6" d="M96 6a7 7 0 1 0 6 10 6 6 0 0 1-6-10z"/></svg>';
  }

  function zeigeKarte(alsPause) {
    pause = true; loslassen();
    ui.ende.hidden = true;
    ui.weiter.hidden = !(alsPause && P);
    ui.fertig.hidden = !(alsPause && P && laufAn && !zielDa);
    ui.satz.textContent = alsPause && P ? (P.name + ' · ' + Math.round(punkte) + ' Punkte') : '';
    ui.satz.hidden = !(alsPause && P);
    aktualisiereKarte();
    ui.karte.hidden = false;
    ebene.classList.add('c6s-karte-auf');
    setTimeout(function () { try { (ui.weiter.hidden ? ui.reihe.querySelector('.c6s-park-wahl[data-park="' + parkId + '"] .c6s-park-los') : ui.weiter).focus({ preventScroll: true }); } catch (e) {} }, 30);
    var w = ui.reihe.querySelector('[data-park="' + parkId + '"]');
    if (w) ui.reihe.scrollLeft = Math.max(0, w.offsetLeft - 16);
    if (!raf) zeichne();
  }
  function weiter() {
    ui.karte.hidden = true; ui.ende.hidden = true; ebene.classList.remove('c6s-karte-auf', 'c6s-ende-auf');
    pause = false; tLetzt = performance.now(); acc = 0;
    if (!raf) raf = requestAnimationFrame(schleife);
  }
  function aktualisiereKarte() {
    var bm = bmx();
    REIHE.forEach(function (id) {
      var el = ui.reihe.querySelector('[data-park="' + id + '"]');
      var pd = bm.parks[id] || {};
      PARKS[id].ch.forEach(function (c) {
        var li = el.querySelector('[data-ch="' + c.id + '"]');
        var ok = !!(pd.ch && pd.ch[c.id]);
        li.classList.toggle('c6s-ok', ok);
        li.setAttribute('aria-label', c.text + (ok ? ', geschafft' : ''));
      });
      el.querySelector('.c6s-park-beste').textContent = pd.beste ? ' · Bestwert ' + pd.beste : '';
    });
    // eine Hauptwahl: der Park, in dem noch etwas offen ist (in der Pause: der aktuelle)
    var haupt = null;
    if (P && !ui.weiter.hidden) haupt = parkId;
    REIHE.forEach(function (id) { var ch = (bm.parks[id] && bm.parks[id].ch) || {}; if (!haupt && PARKS[id].ch.some(function (c) { return !ch[c.id]; })) haupt = id; });
    haupt = haupt || parkId;
    REIHE.forEach(function (id) { var bt = ui.reihe.querySelector('[data-park="' + id + '"] .c6s-park-los'); bt.classList.toggle('c6s-leise', id !== haupt || !ui.weiter.hidden); });
    aus = ausstattung();
    vorschau();
  }
  function vorschau() {
    var c = ui.vorschau, w = 150, h = 122, d = Math.min(3, window.devicePixelRatio || 1);
    if (!c) return;
    c.width = w * d; c.height = h * d; c.style.width = w + 'px'; c.style.height = h + 'px';
    var x = c.getContext('2d');
    x.setTransform(d * 1.45, 0, 0, -d * 1.45, d * w / 2, d * (h - 10));
    x.clearRect(-100, -100, 300, 300);
    x.fillStyle = 'rgba(43,39,34,.12)'; x.beginPath(); x.ellipse(-2, 0, 34, 2.6, 0, 0, 7); x.fill();
    fahrerTeil(x, 'hinten', { kurbel: 0.8, druck: 0, aus: aus || ausstattung(), lw: 0.7, v: 0, augen: 1 });
    zeichneRad(x, { tinte: '#2b2722', papier: '#fbf7f0', aus: aus || ausstattung(), rad: 0.3, kurbel: 0.8, lw: 0.7 });
    fahrerTeil(x, 'vorn', { kurbel: 0.8, druck: 0, aus: aus || ausstattung(), lw: 0.7, v: 0, augen: 1 });
  }

  // ----- Start eines Parks -----
  function farbenFuer(p) {
    if (p.nacht) return { nacht: true, himmel: ['#0c1029', '#1a2150', '#2b3266'], tinte: '#eef0ff', linie: '#0b0e22', leise: '#aab2dc',
      boden: '#4a3d33', bodenTief: '#1b1720', oberfl: '#8a7058', holz: '#6b5442', holzHell: '#8d6f55', strich: 'rgba(238,240,255,.16)',
      fern: '#1b2149', mitte: '#232a58', vorn: '#05070f', schatten: 'rgba(0,0,0,.45)', papier: '#141a33', staub: '#c9c2d8' };
    if (p.abend) return { himmel: ['#e8b9a0', '#f2cfae', '#f7e3c6'], tinte: '#2b2722', linie: '#2b2722', leise: '#6f6a61',
      boden: '#c9a48b', bodenTief: '#8e6c5c', oberfl: '#eadbc8', holz: '#c99a6a', holzHell: '#e0b989', strich: 'rgba(43,39,34,.18)',
      fern: '#d9b0a0', mitte: '#c49582', vorn: '#2b2722', schatten: 'rgba(70,40,30,.22)', papier: '#f3e8da', staub: '#f6ead8' };
    return { himmel: ['#dfe6e2', '#ece9de', '#f6efe2'], tinte: '#2b2722', linie: '#2b2722', leise: '#6f6a61',
      boden: '#d8cab2', bodenTief: '#b7a78e', oberfl: '#efe6d6', holz: '#d2a874', holzHell: '#e6c391', strich: 'rgba(43,39,34,.16)',
      fern: '#d2d4c8', mitte: '#e2d3bb', vorn: '#2b2722', schatten: 'rgba(60,45,30,.2)', papier: '#f4eee4', staub: '#fbf6ec' };
  }
  function ladePark(id) {
    parkId = id; P = PARKS[id]; gel = P.bau(); L = (gel.p.length - 1) * STEP; wrap = false;
    gel.s = [0]; for (var i = 1; i < gel.p.length; i++) gel.s.push(gel.s[i - 1] + Math.sqrt(STEP * STEP + Math.pow(gel.p[i] - gel.p[i - 1], 2)));
    SL = gel.s[gel.s.length - 1];
    F = farbenFuer(P);
    ebene.classList.toggle('c6s-nacht', !!P.nacht);
    ebene.classList.toggle('c6s-abend', !!P.abend);
    neuesRad(P.start || 120);
    wegRad(); wl = null; if (baueWelt()) baueRad(P.start || 120, 1, 0);
    hist = []; zielDa = false; wheelie = { art: null, t: 0 };
    cam.x = b.x + 60; cam.y = b.y + 30; cam.z = 1;
    teilchen = [];
    aus = ausstattung();
    sterne = [];
    for (var j = 0; j < 140; j++) sterne.push({ x: Math.random(), y: Math.random(), r: Math.random() < .12 ? 1.6 : .8, p: Math.random() * 6 });
  }
  function starte(id) {
    ladePark(id);
    punkte = 0; fahrt = { lufte: 0, tricks: 0 }; combo = { n: 0, p: 0, namen: [] }; rest = P.lauf || LAUF; laufAn = false; laufNeu = []; landeText = null;
    ui.punkte.textContent = '0';
    zeigeKiesel(); zeigeCombo();
    var bm0 = bmx(); hilfe((bm0.laeufe || 0) < 3);
    aendern(function () { var x = bmx(); x.laeufe = (x.laeufe || 0) + 1; });
    laufMuenzen = 0;
    weiter();
  }
  function istTouch() { return C6.geraet === 'iphone' || matchMedia('(pointer: coarse)').matches; }
  function hilfe(an) {
    hinweisAn = an;
    if (an) {
      ui.hilfe.innerHTML = istTouch()
        ? '<span><i class="c6s-g c6s-g-wisch"></i>nach vorn wischen: Schwung</span><span><i class="c6s-g c6s-g-tipp"></i>tippen: Sprung · in der Luft: freihändig</span><span><i class="c6s-g c6s-g-dreh"></i>halten, zur Seite: Salto · runterwischen: Dreher</span>'
        : '<span><kbd>↑</kbd> treten · <kbd>↓</kbd> bremsen</span><span><kbd>Leertaste</kbd> Sprung (halten: höher)</span><span>in der Luft: <kbd>←</kbd><kbd>→</kbd> Salto · <kbd>↓</kbd> Dreher · <kbd>↑</kbd> freihändig</span>';
      ui.hilfe.classList.remove('c6s-weg');
    } else ui.hilfe.classList.add('c6s-weg');
  }
  function los() { if (!laufAn) { laufAn = true; } if (hinweisAn && zeit > 0) setTimeout(function () { if (laufAn) hilfe(false); }, 2600); }

  // ----- Eingaben -----
  function loslassen() { eingabe.zeiger = {}; eingabe.r = eingabe.l = eingabe.vor = eingabe.bremse = eingabe.zwei = eingabe.lade = eingabe.finger = false; eingabe.zug = 0; eingabe.ladeT = 0; eingabe.lehneT = 0; }
  function zahlZeiger() { var n = 0; for (var id in eingabe.zeiger) n++; return n; }
  function zeigerAb(e) {
    if (pause) return;
    e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    var t = performance.now();
    eingabe.zeiger[e.pointerId] = { x0: e.clientX, y0: e.clientY, ox: e.clientX, oy: e.clientY, weit: 0, lx: e.clientX, ly: e.clientY, lt: t, tief: e.clientY, t: t, sx: e.clientX, sy: e.clientY, st: t, sprung: false, wisch: false };
    eingabe.finger = true;
    eingabe.zwei = zahlZeiger() >= 2;
    if (eingabe.zwei) { los(); eingabe.lehneT = 0; }
  }
  function zeigerZieh(e) {
    var z = eingabe.zeiger[e.pointerId]; if (!z || pause) return;
    var t = performance.now(), vor = { x: z.lx, y: z.ly, t: z.lt };
    z.lx = e.clientX; z.ly = e.clientY; z.lt = t;
    z.weit = Math.max(z.weit, Math.hypot(e.clientX - z.ox, e.clientY - z.oy));
    if (eingabe.zwei) return;
    // Halten und zur Seite ziehen = Gewicht verlagern (in der Luft: drehen)
    var dxh = e.clientX - z.x0;
    eingabe.lehneT = klemm(dxh / 70, -1, 1);
    if (b.st === 'luft') {
      if (t - z.st > 240) { z.sx = vor.x; z.sy = vor.y; z.st = vor.t; }
      var ddy = e.clientY - z.sy, ddx = e.clientX - z.sx;
      if (ddy > 46 && ddy > Math.abs(ddx) * 1.4) { drehe(); z.sx = e.clientX; z.sy = e.clientY; z.st = t; }
      z.tief = e.clientY; z.y0 = e.clientY;
      return;
    }
    if (e.clientY > z.tief) z.tief = e.clientY;
    var zug = klemm((z.tief - z.y0 - 6) / 70, 0, 1);
    eingabe.zug = zug;
    if (!z.sprung && z.tief - e.clientY > 24 && (b.st === 'boden' || b.st === 'rail')) {
      z.sprung = true; los();
      hopp(0.42 + 0.58 * zug);
      eingabe.zug = 0; z.tief = e.clientY; z.y0 = e.clientY;
      return;
    }
    if (t - z.st > 260) { z.sx = vor.x; z.sy = vor.y; z.st = vor.t; }
    var wx = e.clientX - z.sx, wy = e.clientY - z.sy;
    if (Math.abs(wx) > 34 && Math.abs(wx) > Math.abs(wy) * 1.5 && zug < 0.25) {
      var tempo = Math.abs(wx) / Math.max(16, t - z.st) * 1000;
      if (tempo > 380) { z.wisch = true; eingabe.lehneT = 0; z.x0 = e.clientX; if (Math.sign(wx) === b.f) schwung(tempo); else bremse(); }
      z.sx = e.clientX; z.sy = e.clientY; z.st = t;
    }
  }
  function zeigerAuf(e) {
    var z = eingabe.zeiger[e.pointerId];
    delete eingabe.zeiger[e.pointerId];
    eingabe.zwei = zahlZeiger() >= 2;
    eingabe.finger = zahlZeiger() > 0;
    if (!eingabe.finger) eingabe.lehneT = 0;
    var tipp = z && !z.sprung && !z.wisch && z.weit < 14 && performance.now() - z.t < 280;
    if (z && !z.sprung && eingabe.zug > 0.2 && (b.st === 'boden' || b.st === 'rail') && !pause) { los(); hopp(0.42 + 0.58 * eingabe.zug); }
    else if (tipp && !pause) tippen();
    eingabe.zug = 0;
  }
  // Tippen: am Boden ein Sprung, in der Luft freihändig, nach einem Sturz sofort weiter
  function tippen() {
    if (!b) return;
    if (b.st === 'sturz') { if (b.sturz > 0.2) neuStart(); return; }
    los();
    if (b.st === 'luft') freihaendig();
    else hopp(0.62);
  }
  function freihaendig() { if (b.st !== 'luft' || b.frei > 0) return; b.frei = 0.001; }
  function schwung(tempo) {
    if (!kr || b.st === 'luft' || b.st === 'sturz') return;
    los();
    var vf = b.vx * b.f; if (vf > P.kappe) return;
    var dv = klemm(40 + tempo * 0.06, 50, 120), a = b.th;
    impuls(b.f * dv * Math.cos(a), b.f * dv * Math.sin(a));
    b.tritt = 0.3;
    staub(b.x - b.f * 18, gy(b.x), 0.35, -b.f);
  }
  function bremse() {
    if (!kr || b.st === 'luft' || b.st === 'sturz') return;
    if (Math.abs(b.vx) < 60) { wende(); return; }
    impuls(-b.vx * 0.4, 0); staub(b.x + b.f * 12, gy(b.x), 0.5, b.f);
  }
  function taste(e) {
    if (!C6.kieselpark.offen) return;
    var kk = e.key, ab = e.type === 'keydown';
    if (kk === 'Escape' && ab) { e.preventDefault(); e.stopImmediatePropagation(); C6.kieselpark.zu(); return; }
    if (pause) {
      if ((kk === 'p' || kk === 'P') && ab && P && ui.ende.hidden) { e.preventDefault(); weiter(); }
      if (kk === 'Enter' && ab && !ui.ende.hidden) { e.preventDefault(); starte(parkId); }
      return;
    }
    var nimm = true;
    if (ab && !e.repeat && b && b.st === 'sturz' && b.sturz > 0.2 && /^(Arrow|w|a|s|d|W|A|S|D| |f|F)/.test(kk)) { neuStart(); e.preventDefault(); e.stopImmediatePropagation(); return; }
    if ((kk === 'f' || kk === 'F') && ab && !e.repeat) { freihaendig(); }
    else if (kk === 'ArrowUp' || kk === 'w' || kk === 'W') { eingabe.vor = ab; if (ab) los(); if (ab && !e.repeat && b.st === 'luft') freihaendig(); }
    else if (kk === 'ArrowDown' || kk === 's' || kk === 'S') { eingabe.bremse = ab && b.st !== 'luft'; if (ab && !e.repeat && b.st === 'luft') drehe(); if (ab && !e.repeat && b.st === 'boden' && Math.abs(b.vx) < 30) wende(); }
    else if (kk === 'ArrowRight' || kk === 'd' || kk === 'D') { eingabe.r = ab; if (ab) los(); }
    else if (kk === 'ArrowLeft' || kk === 'a' || kk === 'A') { eingabe.l = ab; }
    else if (kk === ' ') {
      if (ab && !e.repeat) { eingabe.lade = true; eingabe.ladeT = 0; los(); }
      if (!ab && eingabe.lade) { eingabe.lade = false; if (b.st === 'boden' || b.st === 'rail') hopp(0.42 + 0.58 * klemm(eingabe.ladeT / 0.45, 0, 1)); eingabe.ladeT = 0; }
    }
    else if ((kk === 'p' || kk === 'P') && ab) zeigeKarte(true);
    else nimm = false;
    if (nimm) { e.preventDefault(); e.stopImmediatePropagation(); }
  }
  function hopp(kraft) {
    if (!kr || (b.st !== 'boden' && b.st !== 'rail')) return;
    var a = b.th, h0 = (120 + 150 * kraft);
    impuls(-Math.sin(a) * h0 * 0.35, Math.max(0.75, Math.cos(a)) * h0);
    kr.ch.applyAngularImpulse(0.6 * kraft * b.f, true);
    staub(b.x, gy(b.x), 0.4 + kraft * 0.4, 0);
  }
  function drehe() { if (b.st !== 'luft' || b.drehAn) return; b.drehAn = true; b.dreh = 0; }

  // ----- Ein Schritt -----
  function schritt(dt) {
    if (!kr) return;
    var lean = klemm((eingabe.r ? 1 : 0) - (eingabe.l ? 1 : 0) + eingabe.lehneT, -1, 1);
    var treten = eingabe.vor || eingabe.zwei;
    if (eingabe.lade) eingabe.ladeT = Math.min(0.6, eingabe.ladeT + dt);
    var ziel = eingabe.lade ? klemm(eingabe.ladeT / 0.45, 0, 1) : eingabe.zug;
    b.druck = ziel > b.druck ? b.druck + (ziel - b.druck) * Math.min(1, dt * 14) : Math.max(ziel, b.druck - dt * 4);
    if (b.wende) { b.wende = Math.min(1, b.wende + dt / 0.26); if (b.wende >= 1) { b.wende = 0; b.f = kr.f; } }
    b.wackel = Math.max(0, b.wackel - dt * 1.4); b.jubel = Math.max(0, b.jubel - dt); b.tritt = Math.max(0, (b.tritt || 0) - dt);
    var amBoden = kr.kon.l > 0 || kr.kon.r > 0 || schrittN - kr.railT.l <= 2 || schrittN - kr.railT.r <= 2;
    if (b.st !== 'sturz') {
      var mj = kr.f > 0 ? kr.jl : kr.jr, fj = kr.f > 0 ? kr.jr : kr.jl, vf = b.vx * kr.f;
      if (eingabe.bremse && amBoden) { [mj, fj].forEach(function (j) { j.enableMotor(true); j.setMotorSpeed(0); j.setMaxMotorTorque(16); }); }
      else if (treten && vf < P.kappe) { mj.enableMotor(true); mj.setMotorSpeed(-kr.f * (P.kappe / SC) / 0.55); mj.setMaxMotorTorque(15); fj.enableMotor(false); b.kurbel += dt * 11; }
      else if (laufAn && !P.pipe && vf < 70 && amBoden) { mj.enableMotor(true); mj.setMotorSpeed(-kr.f * (95 / SC) / 0.55); mj.setMaxMotorTorque(8); fj.enableMotor(false); b.kurbel += dt * 4; }
      else { mj.enableMotor(false); fj.enableMotor(false); }
      if (b.tritt > 0) b.kurbel += dt * 14;
      // Gewicht verlagern: Carl lehnt sich (Hüftmotor), der Rahmen bekommt ein Drehmoment
      var av = kr.ch.getAngularVelocity();
      if (lean && amBoden) kr.ch.applyTorque(-lean * 30, true);
      else if (lean) drehAlle(av + (-lean * 10 - av) * Math.min(1, dt * 12));
      else if (amBoden) {
        // Lageausgleich am Boden: ohne Eingabe kippt das Rad nicht nach hinten oder vorn über
        var neig = wd(b.th - ga(b.x));
        if (Math.abs(neig) > 0.12) kr.ch.applyTorque(-klemm(neig, -1, 1) * 46 - av * 6, true);
      } else {
        // in der Luft ohne Eingabe: nahe der Lage dreht das Rad sanft zur Landefläche, sonst läuft der Schwung weiter
        var lx = b.x + b.vx * 0.25, rest2 = wd(ga(lx) - b.th);
        if (Math.abs(rest2) < 1.3) drehAlle(av + (klemm(rest2 * 5, -6, 6) - av) * Math.min(1, dt * 9));
        else drehAlle(av * (1 - dt * 1.2));
      }

      if (kr.hj) kr.hj.setMotorSpeed(klemm((-lean * 0.45 - kr.hj.getJointAngle()) * 10, -9, 9));
    }
    wl.step(dt, 8, 3); schrittN++;
    sync();
    if (b.st === 'sturz') {
      b.sturz += dt;
      if (b.sturz > 1.25) neuStart();
      return;
    }
    sammle();
    var rlA = schrittN - kr.railT.l <= 2, rrA = schrittN - kr.railT.r <= 2;
    var aufRail = rlA || rrA;
    amBoden = kr.kon.l > 0 || kr.kon.r > 0 || aufRail;
    // Sturz: Carl berührt den Boden, oder das Rad liegt verkehrt, oder fällt in die Tiefe
    if (kr.kopfStoss) { sturz('kopf'); return; }
    if (!P.pipe && b.y < -140) { sturz('tief'); return; }
    if (amBoden && Math.abs(wd(b.th - ga(b.x))) > 1.7) { einT += dt; if (einT > 0.35) { sturz('kopf'); return; } } else einT = 0;
    if (!amBoden) {
      luftT += dt;
      if (b.st !== 'luft' && luftT > 0.08) abheben();
    } else {
      luftT = 0;
      if (b.st === 'luft') landung(aufRail);
      else if (aufRail && b.st !== 'rail') grindStart();
      else if (!aufRail && b.st === 'rail') { grindEnde(); b.st = 'boden'; }
    }
    if (b.st === 'luft') {
      var Lf = b.luft; Lf.t += dt; if (b.y > Lf.maxY) Lf.maxY = b.y;
      b.spinSum += kr.ch.getAngularVelocity() * dt;
      if (b.drehAn) { b.dreh += dt / 0.4; if (b.dreh >= 1) { b.dreh = 0; b.drehAn = false; b.dreher++; } }
      if (b.frei > 0) { b.frei += dt / 0.55; if (b.frei >= 1) { b.frei = 0; b.freiN++; } }
      if (Math.sign(b.vx) !== kr.f && Math.abs(b.vx) > 40 && P.pipe) wende();
    } else if (b.st === 'rail') {
      b.rail.weg += Math.abs(b.vx) * dt;
      if (Math.random() < 0.9) funke(1); if (Math.random() < 0.4) funke(1);
    } else {
      bodenZeit += dt;
      if (combo.n && bodenZeit > 0.9) bank();
      if (Math.abs(b.vx) < 8) { still += dt; if (still > 1.6) fahrt = { lufte: 0, tricks: 0 }; } else still = 0;
      if (P.pipe && b.vx * kr.f < -70 && Math.abs(ga(b.x)) < 0.25 && !b.wende) wende();
      // Wheelie (nur hinten) und Manual (nur vorn)
      var hinten = kr.f > 0 ? 'l' : 'r', vorn2 = kr.f > 0 ? 'r' : 'l', art = null;
      if (kr.kon[hinten] && !kr.kon[vorn2] && Math.abs(b.vx) > 50) art = 'Wheelie';
      else if (kr.kon[vorn2] && !kr.kon[hinten] && Math.abs(b.vx) > 50) art = 'Manual';
      if (art === wheelie.art) wheelie.t += dt;
      else { if (wheelie.art && wheelie.t > 0.6) { comboDazu(wheelie.art, Math.round(wheelie.t * 50), 'sauber'); fahrt.tricks++; } wheelie = { art: art, t: 0 }; }
      // Kontrollpunkt
      histT += dt;
      if (histT > 0.25 && kr.kon.l && kr.kon.r && Math.abs(ga(b.x)) < 0.15 && Math.abs(gy(b.x + 60) - gy(b.x)) < 6 && Math.abs(gy(b.x - 60) - gy(b.x)) < 6) {
        histT = 0; hist.push({ x: b.x, f: kr.f, v: Math.abs(b.vx), t: zeit }); if (hist.length > 40) hist.shift();
      }
      if (Math.abs(b.vx) > 200 && Math.random() < dt * 14) teilchen.push({ x: b.x - b.f * 20, y: gy(b.x) + 1, vx: -b.vx * 0.1, vy: 10 + Math.random() * 14, r: 1.5 + Math.random() * 2, t: 0, max: 0.45, art: 'staub' });
    }
    // Ziel
    if (!P.pipe && gel.ziel && !zielDa && b.x >= gel.ziel) {
      zielDa = true; bank();
      var bonus = 100;
      punkte += bonus; ui.punkte.textContent = Math.round(punkte);
      trick('Ziel!', '+' + bonus, 'bank');
      for (var i = 0; i < 26; i++) teilchen.push({ x: gel.ziel + (Math.random() - .5) * 60, y: gy(gel.ziel) + 90 + Math.random() * 40, vx: (Math.random() - .5) * 160, vy: Math.random() * 120, r: 2, t: 0, max: 1.2, art: 'konfetti', farbe: ['#b8333a', '#2f5f8a', '#c9a03a', '#5f7f3e'][i % 4] });
      setTimeout(function () { if (C6.kieselpark.offen && zielDa && !pause) laufEnde(true); }, 1500);
    }
  }
  // ----- Münzen im Park -----
  function sammle() {
    if (!gel || !gel.muenzen.length || !kr) return;
    var a = b.th, cs = Math.cos(a), sn = Math.sin(a), mx = b.x - 20 * sn, my = b.y + 20 * cs, tp = kr.to.getPosition(), hx = tp.x * SC, hy = tp.y * SC;
    for (var i = 0; i < gel.muenzen.length; i++) {
      var m = gel.muenzen[i]; if (m.weg) continue;
      if (Math.abs(m.x - b.x) > 80) continue;
      var r = m.geheim ? 26 : 22;
      if (Math.hypot(m.x - mx, m.y - my) < r || Math.hypot(m.x - hx, m.y - hy) < r) nimm(i);
    }
  }
  function schirm(x, y) { return { x: W / 2 + (x - cam.x) * k, y: oy + (cam.y - y) * k }; }
  function nimm(i) {
    var m = gel.muenzen[i], schon = !!gefunden(parkId)[i];
    m.weg = true; m.wegT = zeit;
    for (var j = 0; j < 10; j++) teilchen.push({ x: m.x, y: m.y, vx: Math.cos(j / 10 * ZWEIPI) * 90, vy: Math.sin(j / 10 * ZWEIPI) * 90 + 30, r: 1, t: 0, max: 0.4, art: 'funke' });
    if (schon) { punkte += 25; ui.punkte.textContent = Math.round(punkte); return; }
    aendern(function () { var x = bmx(); x.muenzen = x.muenzen || {}; x.muenzen[parkId] = x.muenzen[parkId] || {}; x.muenzen[parkId][i] = Date.now(); });
    zeigeKiesel();
    var slot = ui.kiesel && ui.kiesel.querySelector('[data-i="' + i + '"]'), wo = schirm(m.x, m.y);
    if (slot) { var rr = slot.getBoundingClientRect(); wo.ziel = { x: rr.left + rr.width / 2, y: rr.top + rr.height / 2 }; }
    laufMuenzen += m.geheim ? 2 : 1;
    try {
      if (m.geheim && C6.muenzen && C6.muenzen.geheimnis) { C6.muenzen.geheimnis('kp-' + parkId + '-oben', 2, wo); trick('Ganz oben!', 'Eine versteckte Münze', 'bank'); }
      else if (C6.muenzen) C6.muenzen.plus(1, 'kieselpark:muenze:' + parkId + ':' + i, wo);
    } catch (e) {}
  }
  function abheben() {
    b.st = 'luft'; b.spinSum = 0; b.dreh = 0; b.drehAn = false; b.dreher = 0; b.frei = 0; b.freiN = 0;
    wheelie = { art: null, t: 0 };
    b.luft = { t: 0, x0: b.x, xm0: b.x, maxY: b.y, y0: b.y, quart: P.pipe && Math.abs(ga(b.x)) > 0.9 };
    if (b.rail) { grindEnde(); }
  }
  function landung(aufRail) {
    var a = ga(b.x), d = Math.abs(wd(b.th - a));
    if (b.drehAn) d += (b.dreh > 0.18 && b.dreh < 0.82) ? 1.1 : 0.25;
    if (b.frei > 0) { d += b.frei > 0.15 && b.frei < 0.85 ? 0.5 : 0.15; if (b.frei > 0.6) b.freiN++; b.frei = 0; }
    staub(b.x, gy(b.x), Math.min(1, Math.abs(b.vy) / 420), 0);
    if (!ruhig()) cam.y += Math.min(12, Math.abs(b.vy) / 40);
    if (d > 1.15) { sturz('landung'); return; }
    if (b.drehAn) { b.drehAn = false; if (b.dreh > 0.6) b.dreher++; b.dreh = 0; }
    var stufe = d < 0.34 ? 'sauber' : 'wackelig';
    if (stufe === 'wackelig') b.wackel = 1; else b.jubel = 0.6;
    b.st = 'boden'; bodenZeit = 0;
    wertung(stufe, aufRail);
    if (aufRail) grindStart();
  }
  function wertung(stufe, aufRail) {
    var Lf = b.luft; if (!Lf) return; b.luft = null;
    var turns = Math.round(b.spinSum / ZWEIPI), salti = Math.abs(turns);
    if (salti && Math.abs(b.spinSum) < ZWEIPI * salti - 1.2) salti--;
    var rueck = salti && (turns * kr.f > 0);
    var dreher = b.dreher; b.dreher = 0;
    var frei = b.freiN; b.freiN = 0;
    var hoehe = Lf.maxY - Lf.y0;
    if (Lf.t < 0.32 && !salti && !dreher && !frei) return;
    var pk = 10 + Math.round(Lf.t * 40) + salti * 100 + (salti >= 2 ? 150 : 0) + dreher * 70 + frei * 60 + (Lf.quart ? Math.round(Math.max(0, hoehe) * 0.5) : 0);
    var name = [];
    if (salti === 1) name.push(rueck ? 'Rückwärtssalto' : 'Salto');
    if (salti === 2) name.push('Doppelsalto');
    if (salti > 2) name.push(salti + '-fach Salto');
    if (dreher === 1) name.push('Dreher'); else if (dreher > 1) name.push(dreher + '× Dreher');
    if (frei === 1) name.push('Freihändig'); else if (frei > 1) name.push(frei + '× Freihändig');
    if (!name.length) name.push(Lf.quart ? (Lf.maxY > P.kante + 45 ? 'Hoher Air' : 'Air') : (Lf.t > 0.75 ? 'Weiter Sprung' : 'Sprung'));
    if (stufe === 'wackelig') pk = Math.round(pk / 2);
    fahrt.lufte++;
    if (salti || dreher || frei) fahrt.tricks++;
    comboDazu(name.join(' + '), pk, stufe);
    ereignis({ art: 'landung', salti: salti, dreher: dreher, frei: frei, t: Lf.t, x0: Lf.x0, xm0: Lf.xm0, x1: b.x, maxY: Lf.maxY, wackel: stufe === 'wackelig', rail: aufRail });
    if (stufe === 'wackelig' && !aufRail) bank();
  }
  function grindStart() {
    var R = kr.railObj; if (!R) return;
    b.st = 'rail'; bodenZeit = 0;
    var x = b.x, fr = (x - R.x1) / Math.max(1, R.x2 - R.x1);
    b.rail = { r: R, start: b.vx >= 0 ? fr : 1 - fr, weg: 0 };
    for (var i = 0; i < 8; i++) funke(1.6);
  }
  function grindEnde() {
    var Rr = b.rail; if (!Rr) return;
    var R = Rr.r, x = b.x;
    var ganz = Rr.start < 0.4 && ((b.vx > 0 && x >= R.x2 - 30) || (b.vx < 0 && x <= R.x1 + 30));
    if (Rr.weg > 20) {
      var pk = 20 + Math.round(Rr.weg * 0.6) + (ganz ? 60 : 0);
      comboDazu(R.art === 'kante' ? 'Kanten-Grind' : 'Geländer-Grind', pk, 'sauber');
      fahrt.tricks++;
      if (ganz) ereignis({ art: 'rail' });
    }
    b.rail = null;
  }
  function sturz(grund) {
    if (b.st === 'sturz' || !kr) return;
    b.st = 'sturz'; b.sturz = 0; b.luft = null; b.drehAn = false; b.rail = null; b.grund = grund;
    kr.jl.enableMotor(false); kr.jr.enableMotor(false);
    puppe();
    fahrt = { lufte: 0, tricks: 0 };
    var weg = combo.n;
    combo = { n: 0, p: 0, namen: [] }; zeigeCombo();
    zeigeLandung('sturz', grund === 'tief' ? 'Fast. Nochmal.' : (weg ? 'Combo weg' : 'Hoppla'));
  }
  function neuStart() {
    if (!b || b.st !== 'sturz') return;
    var cp = null;
    for (var i = hist.length - 1; i >= 0; i--) { if (hist[i].t < zeit - 2.6) { cp = hist[i]; break; } }
    if (!cp) cp = hist[0] || { x: P.start || 120, f: 1, v: 0 };
    wegRad();
    baueRad(cp.x, cp.f, Math.min(P.kappe * 0.9, cp.v) * cp.f);
    hist = hist.filter(function (h) { return h.t <= cp.t; });
    b.nachSturz = 0.8;
  }

  // ----- Punkte und Combo -----
  function comboDazu(name, pk, stufe) {
    combo.n++; combo.p += pk; combo.namen.push(name);
    bodenZeit = 0;
    trick(name, '+' + pk, stufe);
    zeigeCombo();
  }
  function bank() {
    if (!combo.n) return;
    var g = combo.p * combo.n;
    punkte += g;
    ui.punkte.textContent = Math.round(punkte);
    if (combo.n > 1) trick('Combo ×' + combo.n, '+' + g, 'bank');
    if (!ruhig()) { try { ui.punkte.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
    combo = { n: 0, p: 0, namen: [] };
    zeigeCombo();
  }
  function zeigeCombo() {
    if (!ui.combo) return;
    if (combo.n < 1) { ui.combo.classList.add('c6s-weg'); return; }
    ui.combo.innerHTML = '<b>×' + combo.n + '</b><span>' + combo.p + '</span>';
    ui.combo.classList.remove('c6s-weg');
  }
  // Die Münzen dieses Parks als Reihe: gefüllt = schon gefunden, Umriss = liegt noch irgendwo. Keine Uhr, kein Druck.
  function gefunden(pid) { var m = bmx().muenzen; return (m && m[pid]) || {}; }
  function zeigeKiesel() {
    if (!ui.kiesel || !gel) return;
    var g = gefunden(parkId), html = '', n = 0, da = 0;
    gel.muenzen.forEach(function (m, i) {
      if (m.geheim && !g[i]) return;
      n++; if (g[i]) da++;
      html += '<i class="c6s-pk' + (g[i] ? ' c6s-pk-da' : '') + (m.geheim ? ' c6s-pk-geheim' : '') + '" data-i="' + i + '">' + (g[i] && C6.muenzen && C6.muenzen.muenze ? C6.muenzen.muenze(18) : '') + '</i>';
    });
    ui.kiesel.innerHTML = html;
    ui.kiesel.setAttribute('aria-label', da + ' von ' + n + ' Münzen in diesem Park gefunden');
  }
  function zeigeZeit() {}

  // ----- Herausforderungen -----
  function ereignis(e) {
    var pd = bmx().parks[parkId] || {};
    var fertig = pd.ch || {};
    P.ch.forEach(function (c) {
      if (fertig[c.id]) return;
      var ja = false;
      if (parkId === 'hof') {
        if (c.id === 'drei') ja = e.art === 'landung' && fahrt.lufte >= 3;
        if (c.id === 'salto') ja = e.art === 'landung' && e.salti >= 1 && !e.wackel;
        if (c.id === 'kiste') ja = e.art === 'landung' && zoneUeber('kiste', e);
      } else if (parkId === 'dach') {
        if (c.id === 'rail') ja = e.art === 'rail';
        if (c.id === 'luecke') ja = e.art === 'landung' && zoneUeber('luecke', e);
        if (c.id === 'kombi') ja = e.art === 'landung' && e.salti >= 1 && e.dreher >= 1;
      } else if (parkId === 'pipe') {
        if (c.id === 'kante') ja = e.art === 'landung' && e.maxY > P.kante + 45;
        if (c.id === 'fuenf') ja = e.art === 'landung' && fahrt.tricks >= 5;
        if (c.id === 'doppel') ja = e.art === 'landung' && e.salti >= 2;
      }
      if (ja) geschafft(c);
    });
  }
  function zoneUeber(id, e) {
    for (var i = 0; i < gel.zonen.length; i++) {
      var z = gel.zonen[i]; if (z.id !== id) continue;
      if (e.xm0 >= z.von && e.xm0 <= z.bis && e.xm0 + (e.x1 - e.x0) >= z.ueber) return true;
    }
    return false;
  }
  var warteschlange = [], zeigt = false, neuJetzt = 0;
  var IM = { hof: 'Im Hof', dach: 'Im Dachpark', pipe: 'In der Halfpipe' };
  function geschafft(c) {
    neuJetzt++;
    laufNeu.push(c.id); laufMuenzen += c.m;
    var p = c.lohn.split(':');
    aendern(function (s) {
      var bm = bmx();
      bm.parks[parkId] = bm.parks[parkId] || {};
      bm.parks[parkId].ch = bm.parks[parkId].ch || {};
      bm.parks[parkId].ch[c.id] = Date.now();
      if (bm.besitz.indexOf(c.lohn) < 0) bm.besitz.push(c.lohn);
      bm.teile[p[0]] = p[1];
      if (bm.neu.indexOf(c.lohn) < 0) bm.neu.push(c.lohn);
    });
    aus = ausstattung();
    try { C6.muenzen && C6.muenzen.plus(c.m, 'kieselpark:' + parkId + ':' + c.id, { x: innerWidth / 2, y: innerHeight * 0.3 }); } catch (e) {}
    emit('rad', { was: 'lohn', lohn: c.lohn });
    warteschlange.push('<b>' + c.text + '</b><span>Dein Rad hat jetzt: ' + lohnName(c.lohn) + '</span>');
    if (!zeigt) naechsteMeldung();
  }
  function naechsteMeldung() {
    var m = warteschlange.shift();
    if (!m) { zeigt = false; ui.geschafft.hidden = true; return; }
    zeigt = true;
    ui.geschafft.innerHTML = '<span class="c6s-haken c6s-gross" aria-hidden="true"></span><div>' + m + '</div>';
    ui.geschafft.hidden = false;
    ui.geschafft.classList.remove('c6s-weg');
    setTimeout(function () { ui.geschafft.classList.add('c6s-weg'); setTimeout(naechsteMeldung, 380); }, 2800);
  }
  var trickZeit = 0;
  var STUFE = { sauber: 'sauber', wackelig: 'wackelig', sturz: 'Sturz', bank: '' };
  function trick(name, plus, stufe) {
    ui.trick.innerHTML = '<span class="c6s-t-name">' + name + '</span>' +
      '<span class="c6s-t-zeile">' + (STUFE[stufe] ? '<em class="c6s-t-' + stufe + '">' + STUFE[stufe] + '</em>' : '') + (plus ? '<b>' + plus + '</b>' : '') + '</span>';
    ui.trick.classList.remove('c6s-weg');
    if (!ruhig()) { try { ui.trick.animate([{ transform: 'translate(-50%,8px) scale(.9)', opacity: 0 }, { transform: 'translate(-50%,0) scale(1)', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
    trickZeit = zeit + 1.5;
  }
  function zeigeLandung(stufe, extra) { trick(extra || '', '', stufe); }

  // ----- Lauf zu Ende -----
  function laufEnde(imZiel) {
    bank();
    pause = true; loslassen();
    var bm = bmx(), alt = (bm.parks[parkId] && bm.parks[parkId].beste) || 0, p = Math.round(punkte);
    if (p > alt) aendern(function () { var x = bmx(); x.parks[parkId] = x.parks[parkId] || {}; x.parks[parkId].beste = p; });
    var pd = bmx().parks[parkId] || {}, ch = pd.ch || {};
    // Münzen fürs Glas in der Garage: eine je 300 Punkte, höchstens drei pro Lauf (dazu die der Herausforderungen)
    var mz = Math.min(3, Math.floor(p / 300));
    if (mz) { try { C6.muenzen && C6.muenzen.plus(mz, 'kieselpark:lauf', { x: innerWidth / 2, y: innerHeight * 0.42 }); } catch (e) {} laufMuenzen += mz; }
    var offen = P.ch.filter(function (c) { return !ch[c.id]; });
    ui.ende.innerHTML = '<p class="c6s-e-klein">' + P.name + (imZiel ? ' · im Ziel' : '') + '</p>' +
      '<p class="c6s-e-punkte">' + p + '<small> Punkte</small></p>' +
      (p ? '<p class="c6s-e-beste">' + (p > alt ? 'Neuer Bestwert' : 'Bestwert ' + alt) + '</p>' : '') +
      (laufMuenzen ? '<p class="c6s-e-muenzen">' + (C6.muenzen && C6.muenzen.muenze ? C6.muenzen.muenze(24) : '') + '+' + laufMuenzen + (laufMuenzen === 1 ? ' Münze' : ' Münzen') + ' fürs Glas in der Garage</p>' : '') +
      (laufNeu.length || offen.length ? '<ul class="c6s-park-ch">' + P.ch.filter(function (c) { return laufNeu.indexOf(c.id) >= 0 || !ch[c.id]; }).map(function (c) { var neu = laufNeu.indexOf(c.id) >= 0; return '<li class="' + (neu ? 'c6s-ok c6s-neu' : '') + '"><span class="c6s-haken" aria-hidden="true"></span><span>' + c.text + (neu ? ' <em>geschafft</em>' : '') + '</span></li>'; }).join('') + '</ul>' : '') +
      '<div class="c6s-e-knoepfe"><button type="button" class="c6s-knopf c6s-e-nochmal">Nochmal</button>' +
      (laufMuenzen ? '<button type="button" class="c6s-knopf c6s-leise c6s-e-garage">In die Garage</button>' : '<button type="button" class="c6s-knopf c6s-leise c6s-e-parks">Anderer Park</button>') + '</div>';
    ui.ende.querySelector('.c6s-e-nochmal').onclick = function () { starte(parkId); };
    var eg = ui.ende.querySelector('.c6s-e-garage'), ep = ui.ende.querySelector('.c6s-e-parks');
    if (eg) eg.onclick = zurGarage;
    if (ep) ep.onclick = function () { zeigeKarte(false); };
    ui.ende.hidden = false;
    ebene.classList.add('c6s-ende-auf');
    setTimeout(function () { try { ui.ende.querySelector('.c6s-e-nochmal').focus({ preventScroll: true }); } catch (e) {} }, 40);
  }

  // ----- Teilchen -----
  function staub(x, y, s, richtung) {
    if (s < 0.12) return;
    var n = Math.round(4 + s * 8);
    for (var i = 0; i < n; i++) {
      var r = richtung || (Math.random() < .5 ? -1 : 1);
      teilchen.push({ x: x + (Math.random() - .5) * 26, y: y + 1, vx: r * (20 + Math.random() * 90) * s, vy: 12 + Math.random() * 40 * s, r: 2 + Math.random() * 4 * s, t: 0, max: 0.55 + Math.random() * .4, art: 'staub' });
    }
  }
  function funke(st) {
    teilchen.push({ x: b.x + (Math.random() - .5) * 30, y: b.y + 1, vx: -b.v * (0.2 + Math.random() * 0.4) + (Math.random() - .5) * 80 * st, vy: 30 + Math.random() * 90 * st, r: 1, t: 0, max: 0.25 + Math.random() * 0.25, art: 'funke' });
  }

  // ----- Schleife -----
  function schleife(t) {
    raf = 0;
    if (!lauf) return;
    var dt = Math.min(0.05, (t - tLetzt) / 1000); tLetzt = t;
    if (!pause) {
      acc += dt; zeit += dt;
      var n = 0;
      while (acc >= DT && n < 8) { schritt(DT); acc -= DT; n++; }
      if (b.nachSturz > 0) b.nachSturz -= dt;
      for (var i = teilchen.length - 1; i >= 0; i--) { var p = teilchen[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= (p.art === 'funke' ? 500 : 60) * dt; p.vx *= 1 - dt * 1.5; if (p.t > p.max) teilchen.splice(i, 1); }
      if (teilchen.length > 220) teilchen.splice(0, teilchen.length - 220);
      kamera(dt);
      if (zeit > trickZeit && trickZeit) { ui.trick.classList.add('c6s-weg'); trickZeit = 0; }
      if (laufAn) rest -= dt;
    }
    zeichne();
    if (!pause) raf = requestAnimationFrame(schleife);
  }
  function kamera(dt) {
    var g0 = gy(b.zx), hoch = Math.max(0, b.zy - g0);
    if (b.st === 'rail') hoch = 0;
    var zz = 1 / (1 + hoch / 230 + Math.abs(b.v || b.vx || 0) / 2600);
    if (P.pipe) zz = 1 / (1 + Math.max(0, b.zy - 60) / 260);
    cam.z += (zz - cam.z) * Math.min(1, dt * (zz < cam.z ? 2.6 : 1.4));
    k = kB * cam.z;
    var tempo = b.st === 'luft' ? b.vx : (b.v || 0) * Math.cos(b.th || 0);
    var vor = klemm(tempo * 0.32, -W / k * 0.22, W / k * 0.22);
    var zx = b.zx + vor;
    if (P.pipe) zx = L / 2 + (b.zx - L / 2) * 0.82;
    cam.x += (zx - cam.x) * Math.min(1, dt * 3);
    var zy = P.pipe ? b.zy * 0.65 + 70 : g0 + hoch * 0.55 + 34;
    cam.y += (zy - cam.y) * Math.min(1, dt * (b.st === 'luft' ? 2.2 : 3.4));
  }
  // ----- Carl auf dem Rad (Radkoordinaten: y nach oben, Blick nach rechts) -----
  function sockenFarbe() { var s = C6.S && C6.S.du && C6.S.du.socken; return typeof s === 'string' && /^#[0-9a-f]{3,8}$/i.test(s) ? s : '#5d86b0'; }
  function griffPunkt(A) { return A.lenker === 'gerade' ? [9.6, 37.4] : A.lenker === 'hoch' ? [8.6, 41.8] : A.lenker === 'renn' ? [9.4, 35.8] : [9.4, 39.6]; }
  function knie(h, f, l1, l2, vorn) {
    var dx = f[0] - h[0], dy = f[1] - h[1], d = Math.sqrt(dx * dx + dy * dy) || 1, dd = Math.min(d, l1 + l2 - 0.2);
    var a = (l1 * l1 - l2 * l2 + dd * dd) / (2 * dd), hh = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    var mx = h[0] + dx / d * a, my = h[1] + dy / d * a;
    return [mx + (-dy / d) * hh * vorn, my + (dx / d) * hh * vorn];
  }
  function glied(c, pts, w, farbe, lw) {
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.strokeStyle = '#2b2722'; c.lineWidth = w + 1.6 * lw; c.stroke();
    c.strokeStyle = farbe; c.lineWidth = w; c.stroke();
  }
  // teil: 'hinten' (fernes Bein und Arm) | 'vorn' (nahes Bein, Körper, Arm)
  function fahrerTeil(c, teil, o) {
    var A = o.aus || {}, lw = o.lw, dr = o.druck || 0, kb = o.kurbel;
    var tret = [-2, 13 - dr * 2.5], hueft = [-6.5, 36 - dr * 5.5], schulter = [7.5, 41.5 - dr * 5], gr = griffPunkt(A);
    gr = [gr[0], gr[1] - dr * 2.5];
    var fr = o.frei || 0;
    var sock = sockenFarbe();
    function bein(s, farbe) {
      var a = kb + s * Math.PI, p = [tret[0] + Math.cos(a) * 6, tret[1] + Math.sin(a) * 6 + 1.6];
      var kn = knie(hueft, p, 11.5, 11, 1);
      glied(c, [hueft, kn, p], 3.6, farbe, lw);
      c.fillStyle = farbe; c.strokeStyle = '#2b2722'; c.lineWidth = 0.9 * lw;
      c.beginPath(); c.ellipse(p[0] + 1.4, p[1] + 0.4, 3.3, 1.9, 0, 0, 7); c.fill(); c.stroke();
    }
    function arm(farbe, sch, hoch) {
      sch = sch || schulter;
      var el = knie(sch, gr, 3.6, 3.6, -1), hd = gr;
      // freihändig: der Arm geht nach oben und ein wenig nach außen (Hand weit über dem Kopf)
      if (fr && hoch) {
        var ez = [sch[0] + hoch[0] * 0.45, sch[1] + hoch[1] * 0.55], hz = [sch[0] + hoch[0], sch[1] + hoch[1]];
        el = [el[0] + (ez[0] - el[0]) * fr, el[1] + (ez[1] - el[1]) * fr];
        hd = [gr[0] + (hz[0] - gr[0]) * fr, gr[1] + (hz[1] - gr[1]) * fr];
      }
      c.lineCap = 'round'; c.beginPath(); c.moveTo(sch[0], sch[1]); c.lineTo(el[0], el[1]); c.lineTo(hd[0], hd[1]);
      c.strokeStyle = farbe; c.lineWidth = 1.7 * lw + 0.6; c.stroke();
      c.fillStyle = '#ece4d6'; c.strokeStyle = '#2b2722'; c.lineWidth = 0.8 * lw;
      c.beginPath(); c.arc(hd[0], hd[1] + 0.3, fr && hoch ? 1.7 + 0.4 * fr : 1.7, 0, 7); c.fill(); c.stroke();
    }
    if (teil === 'hinten') { bein(1, mische(sock, '#2b2722', 0.35)); if (!fr) arm('#5b544c'); return; }
    bein(0, sock);
    // Körper: der Kiesel aus Filz
    var ln = o.lehne || 0, cl = Math.cos(ln), sl = Math.sin(ln);
    function dreh(p) { var dx = p[0] - hueft[0], dy = p[1] - hueft[1]; return [hueft[0] + dx * cl - dy * sl, hueft[1] + dx * sl + dy * cl]; }
    var mc = dreh([-1.5, 47 - dr * 5.2]);
    c.save(); c.translate(mc[0], mc[1]); c.rotate(-0.12 - dr * 0.12 + ln);
    koerper(c, o);
    c.restore();
    schulter = dreh(schulter);
    if (fr) arm('#2b2722', dreh([-7.5, 44 - dr * 5]), [-5, 16]);
    arm('#2b2722', schulter, [5, 15]);
  }
  function koerper(c, o) {
    var lw = o.lw, rx = 12.5, ry = 10.6, i;
    var gk = c.createRadialGradient(-4, 4, 1, 0, 0, 15);
    gk.addColorStop(0, '#fbf8f1'); gk.addColorStop(0.55, '#ece4d6'); gk.addColorStop(1, '#c4b7a2');
    c.beginPath();
    for (i = 0; i <= 40; i++) {
      var t = i / 40 * Math.PI * 2, cs = Math.cos(t), sn = Math.sin(t), n = sn > 0 ? 2.25 : 3.1;
      var x = rx * (cs < 0 ? -1 : 1) * Math.pow(Math.abs(cs), 2 / n), y = (sn > 0 ? ry : ry * 0.85) * (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 2 / n);
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.closePath(); c.fillStyle = gk; c.fill(); c.strokeStyle = '#2b2722'; c.lineWidth = 1.1 * lw + 0.25; c.stroke();
    // Filzkorn
    c.fillStyle = 'rgba(120,100,80,.12)';
    for (i = 0; i < 9; i++) { c.beginPath(); c.arc(-8 + hash(i, 9) * 16, -6 + hash(i, 8) * 12, 0.5, 0, 7); c.fill(); }
    // Wange
    c.fillStyle = 'rgba(240,122,98,.35)'; c.beginPath(); c.ellipse(8.8, -2.2, 2.4, 1.4, 0, 0, 7); c.fill();
    // Augen
    var zu = o.augen === 0;
    [[3.2, 1.4, 2.5], [8.6, 1.8, 2.7]].forEach(function (a) {
      if (zu) { c.strokeStyle = '#2b2722'; c.lineWidth = 0.9 * lw + .2; c.beginPath(); c.moveTo(a[0] - 2, a[1] + .4); c.quadraticCurveTo(a[0], a[1] - 1.2, a[0] + 2, a[1] + .4); c.stroke(); return; }
      var gi = c.createRadialGradient(a[0], a[1] - 0.8, 0.2, a[0], a[1], a[2] * 1.15);
      gi.addColorStop(0, '#ffe2a0'); gi.addColorStop(0.5, '#f6b44c'); gi.addColorStop(1, '#c77a26');
      c.fillStyle = gi; c.strokeStyle = '#2b2722'; c.lineWidth = 0.7 * lw + .15;
      c.beginPath(); c.ellipse(a[0], a[1], a[2] * 0.9, a[2], 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#2a1709'; c.beginPath(); c.arc(a[0] + 0.7, a[1] - 0.1, a[2] * 0.45, 0, 7); c.fill();
      c.fillStyle = '#fffdf6'; c.beginPath(); c.arc(a[0] - 0.2, a[1] + 0.9, a[2] * 0.3, 0, 7); c.fill();
    });
    // Mund
    c.strokeStyle = '#2b2722'; c.lineWidth = 0.7 * lw + .15;
    c.beginPath();
    if (o.jubel) { c.fillStyle = '#6a2a20'; c.moveTo(4.6, -2.6); c.quadraticCurveTo(6.4, -5.6, 8.2, -2.6); c.closePath(); c.fill(); c.stroke(); }
    else { c.moveTo(5, -3.2); c.quadraticCurveTo(6.3, -4.2, 7.6, -3.2); c.stroke(); }
    // Keimblätter, vom Fahrtwind nach hinten gelegt
    var wind = klemm((o.v || 0) / 420, 0, 1), wipp = Math.sin((o.zeit || 0) * 14) * 0.12 * wind;
    var top = [1.8, ry - 0.4];
    c.strokeStyle = '#7d9468'; c.lineWidth = 1.2 * lw + .2;
    var stiel = [top[0] - 2.2 * wind, top[1] + 5.2 - wind * 0.8];
    c.beginPath(); c.moveTo(top[0], top[1]); c.quadraticCurveTo(top[0] - 0.5, top[1] + 3, stiel[0], stiel[1]); c.stroke();
    [[-1, 9.5, 3.8, 0.5 + wind * 0.9 + wipp], [1, 8, 3.3, -0.4 + wind * 1.1 - wipp]].forEach(function (bl) {
      c.save(); c.translate(stiel[0], stiel[1]); c.rotate(bl[3] + (bl[0] < 0 ? 0.25 : 0));
      var gb = c.createLinearGradient(0, 0, bl[0] * bl[1], bl[2]);
      gb.addColorStop(0, '#6c8559'); gb.addColorStop(1, '#b4c69b');
      c.fillStyle = gb; c.strokeStyle = '#2b2722'; c.lineWidth = 0.7 * lw + .1;
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(bl[0] * bl[1] * 0.5, bl[2] * 1.6, bl[0] * bl[1], bl[2] * 0.4); c.quadraticCurveTo(bl[0] * bl[1] * 0.5, -bl[2] * 0.5, 0, 0); c.fill(); c.stroke();
      c.restore();
    });
  }
  function mische(a, z, t) {
    function h(x) { x = x.replace('#', ''); if (x.length === 3) x = x.split('').map(function (q) { return q + q; }).join(''); return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]; }
    var p = h(a), q = h(z); return 'rgb(' + p.map(function (v, i) { return Math.round(v + (q[i] - v) * t); }).join(',') + ')';
  }

  // ----- Zeichnen -----
  function welt(c, p, ks, py) { c.setTransform(dpr * ks, 0, 0, -dpr * ks, dpr * (W / 2 - cam.x * p * ks), dpr * (oy + cam.y * py * ks)); }
  function wieder(l, r, per, f) { var a = Math.floor(l / per) - 1, e = Math.ceil(r / per) + 1; for (var i = a; i <= e; i++) f(i * per, i); }
  function grenzen(p, ks, py) { var x0 = cam.x * p; return { l: x0 - W / 2 / ks - 40, r: x0 + W / 2 / ks + 40, u: cam.y * py - (H - oy) / ks - 40, o: cam.y * py + oy / ks + 40 }; }

  function zeichne() {
    if (!P || !b) return;
    var c = cx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    himmel(c);
    // Ferne Ebene
    var kf = kB * (0.26 + 0.08 * cam.z), kmi = kB * (0.4 + 0.16 * cam.z);
    welt(c, 0.12, kf, 0.12); fern(c, grenzen(0.12, kf, 0.12));
    welt(c, 0.36, kmi, 0.3); mitte(c, grenzen(0.36, kmi, 0.3));
    // Spielebene
    welt(c, 1, k, 1);
    var g = grenzen(1, k, 1);
    bodenMalen(c, g);
    deko(c, g);
    muenzenMalen(c, g);
    schienen(c, g);
    teilchenMalen(c, 'staub');
    schatten(c);
    radMalen(c);
    teilchenMalen(c, 'funke');
    teilchenMalen(c, 'konfetti');
    // Vordergrund und Licht im Bildraum
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    vorn(c);
    licht(c);
  }

  var cache = { himmel: null, deck: null, schl: '' };
  function leinwand() { var q = document.createElement('canvas'); q.width = Math.max(1, Math.round(W * dpr)); q.height = Math.max(1, Math.round(H * dpr)); var x = q.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); return [q, x]; }
  function caches() {
    var schl = W + 'x' + H + '@' + dpr + ':' + parkId;
    if (cache.schl === schl) return;
    cache.schl = schl;
    var a = leinwand(); himmelStill(a[1]); cache.himmel = a[0];
    var d = leinwand(); deckStill(d[1]); cache.deck = d[0];
  }
  function himmel(c) {
    caches();
    c.drawImage(cache.himmel, 0, 0, W, H);
    if (P.nacht) {
      sterne.forEach(function (s) {
        c.globalAlpha = ruhig() ? .7 : .45 + .35 * Math.sin(zeit * 1.1 + s.p);
        c.fillStyle = '#eef0ff';
        var x = (((s.x * W * 1.6) - cam.x * 0.05) % W + W) % W;
        c.fillRect(x - s.r, s.y * H * 0.62 - s.r, s.r * 2, s.r * 2);
      });
      c.globalAlpha = 1;
      return;
    }
    c.fillStyle = P.abend ? 'rgba(251,232,214,.75)' : 'rgba(255,253,247,.8)';
    for (var i = 0; i < 4; i++) {
      var wx = ((i * 0.31 + 0.1) * W * 1.4 - cam.x * 0.04 - zeit * 3) % (W * 1.4); if (wx < -200) wx += W * 1.4;
      var wy = H * (0.1 + 0.07 * (i % 3)), s = 0.8 + 0.3 * (i % 2);
      c.beginPath(); c.ellipse(wx, wy, 60 * s, 12 * s, 0, 0, 7); c.ellipse(wx + 24 * s, wy - 9 * s, 30 * s, 14 * s, 0, 0, 7); c.ellipse(wx - 20 * s, wy - 5 * s, 22 * s, 10 * s, 0, 0, 7); c.fill();
    }
  }
  function himmelStill(c) {
    var h = F.himmel, gr = c.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, h[0]); gr.addColorStop(0.55, h[1]); gr.addColorStop(1, h[2]);
    c.fillStyle = gr; c.fillRect(0, 0, W, H);
    var sx = W * 0.78, sy = H * (P.abend ? 0.34 : 0.17);
    if (P.nacht) {
      var mx = W * 0.24, my = H * 0.15, glow = c.createRadialGradient(mx, my, 10, mx, my, 120);
      glow.addColorStop(0, 'rgba(246,231,182,.35)'); glow.addColorStop(1, 'rgba(246,231,182,0)');
      c.fillStyle = glow; c.fillRect(mx - 120, my - 120, 240, 240);
      var mc = document.createElement('canvas'); mc.width = mc.height = Math.round(60 * dpr); var m2 = mc.getContext('2d'); m2.scale(dpr, dpr);
      m2.fillStyle = '#f6e7b6'; m2.beginPath(); m2.arc(30, 30, 24, 0, 7); m2.fill();
      m2.fillStyle = 'rgba(214,196,140,.5)'; m2.beginPath(); m2.arc(22, 36, 4, 0, 7); m2.arc(30, 44, 2.5, 0, 7); m2.fill();
      m2.globalCompositeOperation = 'destination-out'; m2.beginPath(); m2.arc(41, 23, 21, 0, 7); m2.fill();
      c.drawImage(mc, mx - 30, my - 30, 60, 60);
      return;
    }
    var rs = P.abend ? 70 : 34, gs = c.createRadialGradient(sx, sy, rs * 0.4, sx, sy, rs * 5);
    gs.addColorStop(0, P.abend ? 'rgba(244,170,110,.55)' : 'rgba(250,224,160,.55)'); gs.addColorStop(1, 'rgba(250,224,160,0)');
    c.fillStyle = gs; c.fillRect(0, 0, W, H);
    c.fillStyle = P.abend ? '#efa46f' : '#f4d590';
    c.beginPath(); c.arc(sx, sy, rs, 0, 7); c.fill();
  }

  function fern(c, g) {
    c.fillStyle = F.fern;
    if (parkId === 'hof') {
      wieder(g.l, g.r, 140, function (o, i) {
        var h = 70 + hash(i, 1) * 70, w = 90 + hash(i, 2) * 40;
        c.beginPath(); c.moveTo(o, -900); c.lineTo(o, h); c.lineTo(o + w * 0.5, h + 26 * hash(i, 3)); c.lineTo(o + w, h); c.lineTo(o + w, -900); c.fill();
        if (hash(i, 4) < .2) { c.fillRect(o + w * 0.4, h, 14, 70); c.beginPath(); c.moveTo(o + w * 0.4 - 3, h + 70); c.lineTo(o + w * 0.4 + 7, h + 104); c.lineTo(o + w * 0.4 + 17, h + 70); c.fill(); }
        if (hash(i, 5) < .5) { c.beginPath(); c.arc(o + w + 20, h - 10, 28, 0, 7); c.fill(); }
      });
    } else if (parkId === 'dach') {
      wieder(g.l, g.r, 120, function (o, i) {
        var h = 40 + hash(i, 1) * 150, w = 70 + hash(i, 2) * 40;
        c.fillRect(o, -900, w, 900 + h);
        if (hash(i, 3) < .25) { c.fillRect(o + w * 0.45, h, 6, 60); }
        if (hash(i, 6) < .15) { c.beginPath(); c.moveTo(o + 10, h); c.lineTo(o + w / 2, h + 50); c.lineTo(o + w - 10, h); c.fill(); }
      });
    } else {
      c.beginPath(); c.moveTo(g.l, -900);
      for (var x = Math.floor(g.l / 20) * 20; x <= g.r; x += 20) c.lineTo(x, 120 + 50 * Math.sin(x / 260) + 26 * Math.sin(x / 90 + 1));
      c.lineTo(g.r, -900); c.fill();
      c.fillStyle = 'rgba(255,214,140,.7)';
      wieder(g.l, g.r, 90, function (o, i) { if (hash(i, 2) < .35) c.fillRect(o + hash(i, 3) * 60, 60 + hash(i, 4) * 60, 2.2, 2.2); });
    }
  }

  var WAND = ['#e8dcc6', '#e3cfb4', '#ddd0bd', '#ead9c0', '#d9c7ad'], DACH = ['#b98a6a', '#a77b62', '#8f8478', '#b4927a'];
  function mitte(c, g) {
    var lw = 1.6 / kB;
    if (parkId === 'hof') {
      wieder(g.l, g.r, 230, function (o, i) {
        var w = 150 + hash(i, 1) * 50, h = 130 + hash(i, 2) * 120, x = o + hash(i, 3) * 26;
        haus(c, x, w, h, WAND[Math.floor(hash(i, 4) * 5)], DACH[Math.floor(hash(i, 5) * 4)], hash(i, 6) < .55, i, lw, false);
      });
    } else if (parkId === 'dach') {
      wieder(g.l, g.r, 210, function (o, i) {
        var w = 110 + hash(i, 1) * 60, h = 30 + hash(i, 2) * 150, x = o + hash(i, 3) * 30;
        haus(c, x, w, h, ['#cfa58e', '#c39a86', '#d6b39b', '#bf9179'][Math.floor(hash(i, 4) * 4)], '#8e6c5c', false, i, lw, true);
        if (hash(i, 7) < .5) { c.fillStyle = '#9b7765'; c.fillRect(x + w * 0.7, h, 16, 30); c.strokeStyle = 'rgba(43,39,34,.4)'; c.lineWidth = lw; c.strokeRect(x + w * 0.7, h, 16, 30); }
      });
    } else {
      // Zaun und Laternen im Dunkel
      c.strokeStyle = '#2f3870'; c.lineWidth = 2.4 / kB * 1.4;
      c.beginPath(); c.moveTo(g.l, 40); c.lineTo(g.r, 40); c.moveTo(g.l, 22); c.lineTo(g.r, 22);
      wieder(g.l, g.r, 24, function (o) { c.moveTo(o, -100); c.lineTo(o, 46); });
      c.stroke();
      wieder(g.l, g.r, 300, function (o, i) {
        var x = o + 60;
        c.fillStyle = '#0b0e22'; c.fillRect(x - 2, -100, 4, 210);
        var gl = c.createRadialGradient(x, 108, 2, x, 108, 90);
        gl.addColorStop(0, 'rgba(255,214,140,.55)'); gl.addColorStop(1, 'rgba(255,214,140,0)');
        c.fillStyle = gl; c.fillRect(x - 90, 18, 180, 180);
        c.fillStyle = '#ffe2a8'; c.beginPath(); c.arc(x, 108, 5, 0, 7); c.fill();
      });
    }
  }
  function haus(c, x, w, h, wand, dach, giebel, i, lw, abend) {
    c.fillStyle = wand; c.fillRect(x, -900, w, 900 + h);
    c.fillStyle = 'rgba(80,58,40,.12)'; c.fillRect(x, -900, 12, 900 + h);
    c.fillStyle = 'rgba(255,250,240,.25)'; c.fillRect(x + w - 6, -900, 6, 900 + h);
    c.strokeStyle = 'rgba(43,39,34,.45)'; c.lineWidth = lw;
    c.strokeRect(x, -900, w, 900 + h);
    if (giebel) {
      c.fillStyle = dach; c.beginPath(); c.moveTo(x - 8, h); c.lineTo(x + w / 2, h + 46 + w * 0.08); c.lineTo(x + w + 8, h); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(0,0,0,.08)'; c.beginPath(); c.moveTo(x - 8, h); c.lineTo(x + w / 2, h + 46 + w * 0.08); c.lineTo(x + w / 2, h); c.fill();
    } else { c.fillStyle = dach; c.fillRect(x - 4, h, w + 8, 8); c.strokeRect(x - 4, h, w + 8, 8); }
    var spalten = Math.max(1, Math.floor((w - 26) / 36)), zeilen = Math.max(0, Math.floor((h + (abend ? 400 : 0) - 46) / 46));
    var ox = x + (w - spalten * 36 + 14) / 2;
    for (var zi = 0; zi < zeilen; zi++) for (var si = 0; si < spalten; si++) {
      var fx = ox + si * 36, fy = h - 30 - zi * 46 - 26;
      if (fy < -260) continue;
      var an = abend && hash(i * 7 + si, zi) < 0.45;
      c.fillStyle = an ? '#f6c77c' : (P.abend ? '#b88b78' : '#f4ede0');
      c.fillRect(fx, fy, 22, 26);
      if (!an && !P.abend) { c.fillStyle = 'rgba(140,170,180,.25)'; c.fillRect(fx, fy + 13, 22, 13); }
      c.strokeRect(fx, fy, 22, 26);
      c.beginPath(); c.moveTo(fx + 11, fy); c.lineTo(fx + 11, fy + 26); c.stroke();
      c.fillStyle = 'rgba(80,58,40,.18)'; c.fillRect(fx - 2, fy - 3, 26, 3);
    }
  }

  function bodenPfad(c, g) {
    var x0 = Math.floor(g.l / STEP) * STEP;
    c.beginPath(); c.moveTo(x0, g.u - 60);
    for (var x = x0; x <= g.r; x += STEP) c.lineTo(x, gy(x));
    c.lineTo(g.r, g.u - 60); c.closePath();
  }
  function kantePfad(c, g, dy) {
    var x0 = Math.floor(g.l / STEP) * STEP; c.beginPath();
    for (var x = x0; x <= g.r; x += STEP) { var y = gy(x) + dy; x === x0 ? c.moveTo(x, y) : c.lineTo(x, y); }
  }
  function bodenMalen(c, g) {
    var lw = 1 / k;
    bodenPfad(c, g);
    var gr = c.createLinearGradient(0, cam.y + 20, 0, cam.y - (H - oy) / k - 40);
    gr.addColorStop(0, F.boden); gr.addColorStop(1, F.bodenTief);
    c.fillStyle = gr; c.fill();
    // Textur unter der Oberfläche
    c.save(); bodenPfad(c, g); c.clip();
    c.strokeStyle = F.strich; c.lineWidth = 1.3 * lw;
    if (parkId === 'pipe') {
      c.beginPath();
      for (var x = Math.floor(g.l / 40) * 40; x <= g.r; x += 40) { c.moveTo(x, gy(x) - 4); c.lineTo(x, g.u - 60); }
      for (var d = 14; d < 260; d += 14) { kanteSub(c, g, -d); }
      c.stroke();
      c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 3 * lw; c.beginPath();
      for (x = Math.floor(g.l / 160) * 160; x <= g.r; x += 160) { c.moveTo(x, gy(x) - 10); c.lineTo(x + 80, gy(x + 80) - 120); }
      c.stroke();
    } else {
      var reihen = parkId === 'hof' ? [12, 26, 41, 57, 75, 95] : [10, 24, 40, 58, 80];
      c.beginPath();
      for (var ri = 0; ri < reihen.length; ri++) {
        var tief = reihen[ri], sch = parkId === 'hof' ? 18 + ri * 2 : 26, ver = (ri % 2) * sch / 2;
        for (x = Math.floor((g.l - ver) / sch) * sch + ver; x <= g.r; x += sch) {
          var y0 = gy(x) - tief;
          if (Math.abs(gy(x + 8) - gy(x)) > 5) continue;
          if (parkId === 'hof') { c.moveTo(x - sch * 0.42, y0); c.quadraticCurveTo(x, y0 + 5, x + sch * 0.42, y0); }
          else { c.moveTo(x - 12, y0); c.quadraticCurveTo(x, y0 - 7, x + 12, y0); }
        }
      }
      c.stroke();
    }
    // Kiesel im Boden
    if (parkId !== 'pipe') {
      var kq = Math.floor(g.l / 22);
      for (var ki = kq; ki * 22 < g.r; ki++) {
        if (hash(ki, 11) < 0.45) continue;
        var kx = ki * 22 + hash(ki, 12) * 18, kt = 8 + hash(ki, 13) * 70, ky = gy(kx) - kt;
        if (Math.abs(gy(kx + 6) - gy(kx)) > 5) continue;
        var kr = 2.2 + hash(ki, 14) * 3.2;
        c.fillStyle = 'rgba(60,45,30,.14)'; c.beginPath(); c.ellipse(kx - kr * 0.3, ky - kr * 0.45, kr * 1.4, kr * 0.8, 0, 0, 7); c.fill();
        c.fillStyle = parkId === 'dach' ? ['#a88a78', '#9a7c6a', '#b59886', '#8d705f'][Math.floor(hash(ki, 15) * 4)] : ['#b9ab93', '#a8987e', '#c4b59c', '#968770'][Math.floor(hash(ki, 15) * 4)];
        c.beginPath(); c.ellipse(kx, ky, kr * 1.4, kr, hash(ki, 16) - 0.5, 0, 7); c.fill();
        c.fillStyle = 'rgba(255,252,244,.2)'; c.beginPath(); c.ellipse(kx + kr * 0.4, ky + kr * 0.35, kr * 0.5, kr * 0.3, 0, 0, 7); c.fill();
      }
    }
    // Tiefe: die Erde wird nach unten dunkler, unter der Kante liegt Schatten
    kantePfad(c, g, -9); c.strokeStyle = 'rgba(0,0,0,.07)'; c.lineWidth = 10; c.stroke();
    c.restore();
    // Holzkörper der Rampen
    holz(c, g, lw);
    // Oberfläche: helle Deckkante, dann Tusche
    kantePfad(c, g, -2.4); c.strokeStyle = F.oberfl; c.lineWidth = 4.2; c.lineJoin = 'round'; c.stroke();
    kantePfad(c, g, -5.2); c.strokeStyle = 'rgba(0,0,0,.08)'; c.lineWidth = 2; c.stroke();
    kantePfad(c, g, 0); c.strokeStyle = F.linie === '#0b0e22' ? '#e9dcc6' : F.linie; c.lineWidth = Math.max(2.2 * lw, 0.9); c.stroke();
    if (P.pipe) { // Kantenrohr (Coping)
      [120, L - 120].forEach(function (x) {
        c.fillStyle = '#c9ccd8'; c.strokeStyle = '#0b0e22'; c.lineWidth = 1;
        c.beginPath(); c.arc(x, P.kante + 2, 3.4, 0, 7); c.fill(); c.stroke();
      });
    }
    // Lücke im Dachpark: Tiefe und Straßenlicht
    (gel.loecher || []).forEach(function (z) {
      var a = z.von, e = z.bis;
      if (e < g.l || a > g.r) return;
      var oben = gy(a - 2), unten = gy(a + 8);
      var gg = c.createLinearGradient(0, oben, 0, unten);
      gg.addColorStop(0, 'rgba(60,40,40,.12)'); gg.addColorStop(1, 'rgba(30,18,26,.85)');
      c.fillStyle = gg; c.fillRect(a, unten, e - a, oben - unten);
      c.fillStyle = 'rgba(246,199,124,.55)'; c.fillRect(a + (e - a) * 0.25, oben - 120, 9, 13); c.fillRect(a + (e - a) * 0.62, oben - 170, 9, 13); c.fillRect(a + (e - a) * 0.4, oben - 230, 9, 13);
      c.strokeStyle = 'rgba(43,39,34,.6)'; c.lineWidth = 1.4 * lw;
      c.beginPath(); c.moveTo(a, oben); c.lineTo(a, unten); c.moveTo(e, gy(e + 2)); c.lineTo(e, unten); c.stroke();
    });
  }
  function kanteSub(c, g, dy) { var x0 = Math.floor(g.l / 8) * 8; for (var x = x0; x <= g.r; x += 8) { var y = gy(x) + dy; x === x0 ? c.moveTo(x, y) : c.lineTo(x, y); } }
  function holz(c, g, lw) {
    gel.holz.forEach(function (h) {
      var q0 = Math.floor((g.l - h.bis) / L), q1 = Math.ceil((g.r - h.von) / L);
      for (var q = q0; q <= q1; q++) {
        var a = h.von + q * L, e = h.bis + q * L;
        if (e < g.l || a > g.r) continue;
        var basis = Math.min(gy(a), gy(e)) - (h.offen ? 0 : 0);
        c.beginPath(); c.moveTo(a, basis);
        for (var x = a; x <= e; x += STEP) c.lineTo(x, gy(x));
        c.lineTo(e, basis); c.closePath();
        var top = basis; for (x = a; x <= e; x += 12) top = Math.max(top, gy(x));
        if (top - basis < 2) continue;
        var gr = c.createLinearGradient(0, top, 0, basis);
        gr.addColorStop(0, h.erde ? '#c8b48f' : F.holzHell); gr.addColorStop(1, h.erde ? '#a8946f' : F.holz);
        c.fillStyle = gr; c.fill();
        c.save(); c.clip();
        c.strokeStyle = 'rgba(80,50,25,.28)'; c.lineWidth = 1.1 * lw;
        c.beginPath();
        if (h.erde) { for (var d = 6; d < 40; d += 8) { for (x = a; x <= e; x += 10) { var yy = gy(x) - d; c.moveTo(x, yy); c.lineTo(x + 3, yy); } } }
        else {
          for (d = 7; d < top - basis + 4; d += 7) { for (x = a; x <= e; x += STEP) { var y2 = Math.max(basis, gy(x) - d); x === a ? c.moveTo(x, y2) : c.lineTo(x, y2); } }
          for (x = a + 30; x < e - 10; x += 60) { c.moveTo(x, basis); c.lineTo(x, gy(x) - 2); }
        }
        c.stroke();
        // Lichtseite: die Sonne steht rechts
        var ls = c.createLinearGradient(a, 0, e, 0); ls.addColorStop(0, 'rgba(0,0,0,.12)'); ls.addColorStop(0.6, 'rgba(0,0,0,0)'); ls.addColorStop(1, 'rgba(255,240,210,.18)');
        c.fillStyle = ls; c.fillRect(a, basis, e - a, top - basis + 2);
        if (h.kiesel) kieselZeichen(c, (a + e) / 2 + 4, basis + (top - basis) * 0.45, lw);
        c.restore();
        c.strokeStyle = F.linie === '#0b0e22' ? '#e9dcc6' : '#2b2722'; c.lineWidth = 1.6 * lw;
        c.beginPath(); c.moveTo(a, basis); c.lineTo(a, gy(a)); c.moveTo(e, basis); c.lineTo(e, gy(e)); c.stroke();
      }
    });
  }
  function kieselZeichen(c, x, y, lw) {
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(43,39,34,.55)';
    c.beginPath(); c.ellipse(0, 0, 12, 9, 0, 0, 7); c.fill();
    c.strokeStyle = 'rgba(43,39,34,.55)'; c.lineWidth = 1.6 * lw;
    c.beginPath(); c.moveTo(1, 9); c.lineTo(1, 13); c.stroke();
    c.beginPath(); c.ellipse(-4, 15, 5, 2.4, -0.4, 0, 7); c.ellipse(5.5, 15.5, 4.4, 2.2, 0.4, 0, 7); c.fill();
    c.restore();
  }
  function schienen(c, g) {
    var lw = 1 / k;
    gel.rails.forEach(function (r) {
      var q0 = Math.floor((g.l - r.x2) / L), q1 = Math.ceil((g.r - r.x1) / L);
      for (var q = q0; q <= q1; q++) {
        var o = q * L, a = r.x1 + o, e = r.x2 + o, h = r.y - r.boden;
        // Schlagschatten nach links
        if (r.art === 'kante') { c.fillStyle = F.schatten;
        c.beginPath(); c.moveTo(a, r.boden); c.lineTo(e, r.boden); c.lineTo(e - h * 0.9, r.boden - 3); c.lineTo(a - h * 0.9, r.boden - 3); c.fill(); }
        if (r.art === 'kante') {
          var gr = c.createLinearGradient(0, r.y, 0, r.boden); gr.addColorStop(0, '#d6cfc3'); gr.addColorStop(1, '#b3aa9b');
          c.fillStyle = gr; c.fillRect(a, r.boden, e - a, h);
          c.fillStyle = '#efe9df'; c.fillRect(a - 2, r.y - 3, e - a + 4, 3);
          c.strokeStyle = '#2b2722'; c.lineWidth = 1.6 * lw; c.strokeRect(a, r.boden, e - a, h);
          c.strokeStyle = 'rgba(43,39,34,.2)'; c.beginPath(); for (var x = a + 42; x < e; x += 42) { c.moveTo(x, r.boden); c.lineTo(x, r.y - 3); } c.stroke();
          c.strokeStyle = '#6f6a61'; c.lineWidth = 2.2 * lw; c.beginPath(); c.moveTo(a - 2, r.y); c.lineTo(e + 2, r.y); c.stroke();
        } else {
          var yA = r.y1 != null ? r.y1 : r.y, yE = r.y2 != null ? r.y2 : r.y, planke = false;
          for (x = a; x <= e; x += 12) if (gy(x) < Math.min(yA, yE) - 80) planke = true;
          if (planke) {
            c.fillStyle = '#b98a5e'; c.strokeStyle = '#2b2722'; c.lineWidth = 1.4 * lw;
            c.beginPath(); c.moveTo(a, yA); c.lineTo(e, yE); c.lineTo(e, yE - 5); c.lineTo(a, yA - 5); c.closePath(); c.fill(); c.stroke();
            c.strokeStyle = 'rgba(80,50,25,.35)'; c.beginPath(); c.moveTo(a + 4, yA - 2.5); c.lineTo(e - 4, yE - 2.5); c.stroke();
          } else {
            c.strokeStyle = '#2b2722'; c.lineWidth = Math.max(2 * lw, 1.6);
            c.beginPath();
            var schr = Math.max(40, (e - a) / 5);
            for (x = a + 8; x < e - 4; x += schr) { var yr = yA + (yE - yA) * (x - a) / (e - a); c.moveTo(x, gy(x)); c.lineTo(x, yr); }
            c.moveTo(e - 6, gy(e - 6)); c.lineTo(e - 6, yA + (yE - yA) * (e - 6 - a) / (e - a));
            c.stroke();
            c.lineWidth = 3.2; c.beginPath(); c.moveTo(a, yA); c.lineTo(e, yE); c.stroke();
            c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(a + 2, yA + 0.8); c.lineTo(e - 2, yE + 0.8); c.stroke();
          }
        }
      }
    });
  }
  function deko(c, g) {
    var lw = 1 / k, T = '#2b2722';
    gel.kisten.forEach(function (q) {
      if (q.x + q.w < g.l || q.x > g.r) return;
      c.fillStyle = F.schatten; c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x - q.h * 0.8, q.y - 3); c.lineTo(q.x + q.w - q.h * 0.8, q.y - 3); c.lineTo(q.x + q.w, q.y); c.fill();
      c.fillStyle = F.holz; c.fillRect(q.x, q.y, q.w, q.h);
      c.fillStyle = F.holzHell; c.fillRect(q.x, q.y + q.h - 4, q.w, 4);
      c.strokeStyle = '#2b2722'; c.lineWidth = 1.5 * lw; c.strokeRect(q.x, q.y, q.w, q.h);
      c.beginPath(); c.moveTo(q.x + 2, q.y + 2); c.lineTo(q.x + q.w - 2, q.y + q.h - 2); c.moveTo(q.x + q.w - 2, q.y + 2); c.lineTo(q.x + 2, q.y + q.h - 2); c.strokeStyle = 'rgba(80,50,25,.45)'; c.stroke();
    });
    gel.deko.forEach(function (d) {
      var q0 = Math.floor((g.l - d.x - 260) / L), q1 = Math.ceil((g.r - d.x + 260) / L);
      for (var q = q0; q <= q1; q++) {
        var x = d.x + q * L, y = d.y;
        c.lineWidth = 1.6 * lw; c.strokeStyle = T; c.lineCap = 'round'; c.lineJoin = 'round';
        if (d.art === 'ziel') {
          c.fillStyle = '#4a4540'; c.fillRect(x - 46, y, 4, 120); c.fillRect(x + 42, y, 4, 120);
          c.strokeStyle = T; c.beginPath(); c.moveTo(x - 44, y + 116); c.quadraticCurveTo(x, y + 104, x + 44, y + 116); c.stroke();
          for (var wi = 0; wi < 7; wi++) {
            var wx2 = x - 38 + wi * 12.5, wy2 = y + 114 - Math.sin(Math.PI * (wi + 0.5) / 7) * 10 + (ruhig() ? 0 : Math.sin(zeit * 3 + wi) * 1.2);
            c.fillStyle = ['#b8333a', '#efe4c8', '#2f5f8a', '#c9a03a'][wi % 4];
            c.beginPath(); c.moveTo(wx2 - 5, wy2); c.lineTo(wx2 + 5, wy2); c.lineTo(wx2, wy2 - 12); c.closePath(); c.fill(); c.stroke();
          }
          kieselZeichen(c, x, y + 132, lw);
          continue;
        }
        if (d.art === 'baum') {
          var s = d.gross ? 1.35 : 1, bx = x - 40;
          c.fillStyle = F.schatten; c.beginPath(); c.ellipse(bx - 30 * s, y - 1, 46 * s, 4, 0, 0, 7); c.fill();
          c.fillStyle = '#8a6b4e'; c.beginPath(); c.moveTo(bx - 4 * s, y); c.lineTo(bx - 2.5 * s, y + 70 * s); c.lineTo(bx + 2.5 * s, y + 70 * s); c.lineTo(bx + 4 * s, y); c.closePath(); c.fill(); c.stroke();
          [[0, 96, 30], [-22, 82, 22], [22, 84, 22], [-8, 112, 22], [12, 108, 20]].forEach(function (k2, j) {
            c.fillStyle = j % 2 ? '#93a87c' : '#a7b98e';
            c.beginPath(); c.arc(bx + k2[0] * s, y + k2[1] * s, k2[2] * s, 0, 7); c.fill();
          });
          c.fillStyle = 'rgba(60,80,40,.22)'; c.beginPath(); c.arc(bx - 12 * s, y + 86 * s, 26 * s, 0, 7); c.fill();
          c.fillStyle = 'rgba(255,250,220,.35)'; c.beginPath(); c.arc(bx + 14 * s, y + 106 * s, 14 * s, 0, 7); c.fill();
        } else if (d.art === 'laterne') {
          c.fillStyle = '#4a4540'; c.fillRect(x - 1.6, y, 3.2, 120);
          c.beginPath(); c.moveTo(x, y + 120); c.quadraticCurveTo(x, y + 132, x + 14, y + 130); c.stroke();
          c.fillStyle = '#f6e2a8'; c.beginPath(); c.moveTo(x + 8, y + 128); c.lineTo(x + 20, y + 128); c.lineTo(x + 17, y + 121); c.lineTo(x + 11, y + 121); c.closePath(); c.fill(); c.stroke();
        } else if (d.art === 'leine') {
          c.fillStyle = '#7a6250'; c.fillRect(x - 62, y, 4, 110); c.fillRect(x + 148, y, 4, 110);
          c.beginPath(); c.moveTo(x - 60, y + 106); c.quadraticCurveTo(x + 45, y + 90, x + 150, y + 106); c.stroke();
          [['#d8a7a0', -20, 28, 26], ['#a9c0cf', 18, 22, 30], ['#efe4c8', 56, 30, 22], ['#c9a03a', 96, 18, 26]].forEach(function (t2) {
            var tx = x + t2[1], ty = y + 99 - Math.abs(t2[1] - 45) * -0.03 - 4 + Math.sin(zeit * 2 + t2[1]) * (ruhig() ? 0 : 1.2);
            c.fillStyle = t2[0]; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + t2[2], ty); c.lineTo(tx + t2[2] - 2, ty - t2[3]); c.lineTo(tx + 2, ty - t2[3]); c.closePath(); c.fill(); c.stroke();
          });
        } else if (d.art === 'kamin') {
          c.fillStyle = '#b06a4e'; c.fillRect(x - 30, y, 24, 52); c.strokeRect(x - 30, y, 24, 52);
          c.fillStyle = '#8f5440'; c.fillRect(x - 33, y + 52, 30, 6); c.strokeRect(x - 33, y + 52, 30, 6);
          c.strokeStyle = 'rgba(43,39,34,.3)'; c.beginPath(); for (var yy = y + 8; yy < y + 52; yy += 8) { c.moveTo(x - 30, yy); c.lineTo(x - 6, yy); } c.stroke();
          if (!ruhig()) { c.fillStyle = 'rgba(250,240,230,.5)'; for (var r2 = 0; r2 < 3; r2++) { var ph = (zeit * 0.4 + r2 / 3) % 1; c.beginPath(); c.arc(x - 18 + ph * 20, y + 64 + ph * 50, 5 + ph * 9, 0, 7); c.fill(); } }
        } else if (d.art === 'antenne') {
          c.lineWidth = 1.8 * lw; c.beginPath(); c.moveTo(x - 20, y); c.lineTo(x - 20, y + 90); c.moveTo(x - 38, y + 72); c.lineTo(x - 2, y + 72); c.moveTo(x - 33, y + 82); c.lineTo(x - 7, y + 82); c.moveTo(x - 28, y + 90); c.lineTo(x - 12, y + 90); c.stroke();
        } else if (d.art === 'tank') {
          c.fillStyle = '#9b7765'; c.fillRect(x - 70, y, 4, 40); c.fillRect(x - 30, y, 4, 40);
          var gt = c.createLinearGradient(x - 76, 0, x - 20, 0); gt.addColorStop(0, '#a07f6a'); gt.addColorStop(1, '#d1b29a');
          c.fillStyle = gt; c.fillRect(x - 76, y + 40, 56, 54); c.strokeRect(x - 76, y + 40, 56, 54);
          c.beginPath(); c.moveTo(x - 80, y + 94); c.lineTo(x - 48, y + 112); c.lineTo(x - 16, y + 94); c.closePath(); c.fillStyle = '#8e6c5c'; c.fill(); c.stroke();
        }
      }
    });
  }
  // Die Münze im Park: dasselbe Motiv wie im Glas (Kiesel mit Keimling), dreht sich langsam
  var MP = null;
  function muenzPfade() {
    if (MP || typeof Path2D === 'undefined') return MP;
    MP = {
      kiesel: new Path2D('M6 21c-1-8 5-15 14-15.5 9-.4 15 5 14.5 13.5C34 28 27 34.5 19 34.3 11 34 6.8 29 6 21z'),
      glanz: new Path2D('M10.5 21.5c-.4-5.6 3.8-10.6 10-10.9'),
      stiel: new Path2D('M20 28v-7'),
      bl1: new Path2D('M20 21.5c-4.6.3-7.4-2-7.6-5.6 3.9-.4 6.8 1.6 7.6 5.6z'),
      bl2: new Path2D('M20 21c3.6-.8 6.7-3.6 6.4-7.3-3.8.2-6.6 3-6.4 7.3z')
    };
    return MP;
  }
  function muenzenMalen(c, g) {
    if (!gel || !gel.muenzen.length || !muenzPfade()) return;
    var schon = gefunden(parkId), lw = 1 / k;
    gel.muenzen.forEach(function (m, i) {
      if (m.x < g.l - 30 || m.x > g.r + 30) return;
      var pop = 0;
      if (m.weg) { pop = (zeit - (m.wegT || 0)) / 0.3; if (pop >= 1) return; }
      var alt = !!schon[i] && !m.weg, sx = ruhig() ? 1 : Math.cos(zeit * 2.4 + i * 1.7), sk = 0.62 * (1 + pop * 0.8);
      var hub = ruhig() ? 0 : Math.sin(zeit * 2 + i) * 2;
      c.save();
      c.translate(m.x, m.y + hub + pop * 14);
      c.globalAlpha = (alt ? 0.42 : 1) * (1 - pop);
      if (m.geheim && !m.weg) {
        var gl = c.createRadialGradient(0, 0, 2, 0, 0, 34);
        gl.addColorStop(0, P.nacht ? 'rgba(246,231,182,.55)' : 'rgba(255,240,190,.6)'); gl.addColorStop(1, 'rgba(246,231,182,0)');
        c.fillStyle = gl; c.beginPath(); c.arc(0, 0, 34, 0, 7); c.fill();
      }
      c.scale(sk * (Math.abs(sx) < 0.08 ? 0.08 * (sx < 0 ? -1 : 1) : sx), -sk);
      c.translate(-20, -20);
      c.lineJoin = 'round'; c.lineCap = 'round';
      c.fillStyle = alt ? 'rgba(0,0,0,0)' : '#e4d6bd'; c.fill(MP.kiesel);
      c.strokeStyle = P.nacht && alt ? '#eef0ff' : '#2b2722'; c.lineWidth = 2.2; c.stroke(MP.kiesel);
      if (!alt) {
        c.strokeStyle = '#fbf7f0'; c.lineWidth = 2; c.stroke(MP.glanz);
        c.strokeStyle = '#2b2722'; c.lineWidth = 2; c.stroke(MP.stiel);
        c.fillStyle = '#8ea37a'; c.lineWidth = 1.6; c.fill(MP.bl1); c.stroke(MP.bl1); c.fill(MP.bl2); c.stroke(MP.bl2);
      }
      c.restore();
    });
    c.globalAlpha = 1;
  }
  function teilchenMalen(c, art) {
    var lw = 1 / k;
    if (art === 'funke') c.globalCompositeOperation = 'lighter';
    teilchen.forEach(function (p) {
      if (p.art !== art) return;
      var a = Math.max(0, 1 - p.t / p.max);
      if (art === 'konfetti') { c.globalAlpha = a; c.fillStyle = p.farbe; c.save(); c.translate(p.x, p.y); c.rotate(p.t * 9 + p.vx); c.fillRect(-2.5, -1.2, 5, 2.4); c.restore(); return; }
      if (art === 'funke') {
        c.globalAlpha = a; c.strokeStyle = a > .5 ? '#ffe7a3' : '#ff9a3c'; c.lineWidth = 1.6 * lw + 0.4;
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * 0.025, p.y - p.vy * 0.025); c.stroke();
      } else {
        c.globalAlpha = a * 0.85; c.fillStyle = F.staub;
        c.beginPath(); c.arc(p.x, p.y + p.t * 8, p.r * (1 + p.t * 2.2), 0, 7); c.fill();
        c.globalAlpha = a * 0.35; c.strokeStyle = F.nacht ? '#aab2dc' : '#8a8378'; c.lineWidth = 0.9 * lw; c.stroke();
      }
    });
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  }
  function schatten(c) {
    var g0 = b.st === 'rail' && b.rail ? b.rail.r.boden : gy(b.x), hoch = Math.max(0, b.y - g0), w = Math.max(0.3, 1 - hoch / 220);
    var weg = -(4 + Math.min(70, hoch * 0.4));
    c.save(); c.translate(b.x + weg, g0 + 0.3); c.rotate(ga(b.x));
    c.globalAlpha = (P.nacht ? 0.5 : 0.28) * Math.max(0.3, w);
    var sg = c.createRadialGradient(0, 0, 2, 0, 0, 40 * w);
    sg.addColorStop(0, '#000'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sg; c.scale(1, 0.12); c.beginPath(); c.arc(0, 0, 40 * w, 0, 7); c.fill();
    c.restore(); c.globalAlpha = 1;
  }
  function radMalen(c) {
    var lw = Math.max(0.5, 1.25 / k), tinte = '#2b2722', papier = '#fbf7f0';
    var tempo = Math.abs(b.st === 'luft' ? b.vx : b.v);
    // Fahrtlinien
    if (tempo > 280 && !ruhig() && b.st !== 'sturz') {
      c.save(); c.translate(b.x, b.y); c.rotate(b.th);
      c.strokeStyle = P.nacht ? 'rgba(238,240,255,.35)' : 'rgba(43,39,34,.22)'; c.lineWidth = 1.2 * lw;
      c.beginPath();
      for (var i = 0; i < 3; i++) { var yy = 14 + i * 14, l0 = 20 + (tempo - 280) * 0.12 * (1 - i * 0.2); c.moveTo(-b.f * 36, yy); c.lineTo(-b.f * (36 + l0), yy); }
      c.stroke(); c.restore();
    }
    // Aufladen: Bogen um das Rad
    if (b.druck > 0.05 && (b.st === 'boden' || b.st === 'rail') && (eingabe.lade || eingabe.zug > 0)) {
      c.save(); c.translate(b.x, b.y + 30);
      c.strokeStyle = P.nacht ? 'rgba(238,240,255,.25)' : 'rgba(43,39,34,.15)'; c.lineWidth = 2.4 * lw + 0.6;
      c.beginPath(); c.arc(0, 0, 44, 0, 7); c.stroke();
      c.strokeStyle = b.druck > 0.95 ? '#c8463d' : (P.nacht ? '#f6e7b6' : '#2b2722');
      c.beginPath(); c.arc(0, 0, 44, Math.PI / 2, Math.PI / 2 - b.druck * Math.PI * 2, true); c.stroke();
      c.restore();
    }
    c.save();
    c.translate(b.x, b.y);
    var wack = b.wackel > 0 && !ruhig() ? Math.sin(zeit * 38) * 0.09 * b.wackel : 0;
    c.rotate(b.th + wack);
    var sx = b.f;
    if (b.wende) sx = b.f * Math.cos(Math.PI * b.wende);
    if (b.drehAn) sx *= Math.cos(Math.PI * 2 * b.dreh);
    if (Math.abs(sx) < 0.06) sx = 0.06 * (sx < 0 ? -1 : 1);
    if (b.nachSturz > 0 && !ruhig()) c.globalAlpha = 0.55 + 0.45 * (Math.sin(zeit * 30) > 0 ? 1 : 0.3);
    c.scale(sx, 1);
    var o = { aus: aus, lw: lw, kurbel: b.kurbel, druck: b.druck, v: tempo, zeit: zeit, jubel: b.jubel > 0 || (b.st === 'luft' && b.luft && b.luft.t > 0.25), augen: b.st === 'sturz' ? 0 : 1, lehne: b.lehne * (sx > 0 ? 1 : -1), frei: b.frei > 0 ? Math.sin(Math.PI * Math.min(1, b.frei * 1.25)) : 0 };
    if (o.frei) o.jubel = true;
    var carlWeg = b.st === 'sturz';
    if (!carlWeg) fahrerTeil(c, 'hinten', o);
    zeichneRad(c, { tinte: tinte, papier: papier, aus: aus, rad: b.rad * (sx > 0 ? 1 : -1), kurbel: b.kurbel, lw: lw, druck: b.druck * 0.5, federH: sx > 0 ? b.feder.l : b.feder.r, federV: sx > 0 ? b.feder.r : b.feder.l });
    // Glanz auf dem Rahmen
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 0.7 * lw; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-6, 26.4 - b.druck * 1.25); c.lineTo(12.6, 29.6 - b.druck * 1.25); c.stroke();
    if (!carlWeg) fahrerTeil(c, 'vorn', o);
    c.restore();
    c.globalAlpha = 1;
    // Carl als Gelenkfigur nach dem Sturz
    if (carlWeg && kr) {
      var sock = sockenFarbe();
      glieder.forEach(function (g) {
        var p = g.k.getPosition(), a = g.k.getAngle(), h = g.l / 2, ca = Math.cos(a) * h, sa = Math.sin(a) * h;
        var farbe = g.typ === 'bein' || g.typ === 'fuss' ? (g.s ? mische(sock, '#2b2722', 0.35) : sock) : '#2b2722';
        glied2(c, [[p.x * SC - ca, p.y * SC - sa], [p.x * SC + ca, p.y * SC + sa]], g.typ === 'arm' || g.typ === 'hand' ? 1.8 : 3.6, farbe, lw);
        if (g.typ === 'fuss') { c.fillStyle = farbe; c.strokeStyle = '#2b2722'; c.lineWidth = 0.9 * lw; c.beginPath(); c.ellipse(p.x * SC + ca, p.y * SC + sa, 3.3, 1.9, a, 0, 7); c.fill(); c.stroke(); }
      });
      var tp = kr.to.getPosition();
      c.save(); c.translate(tp.x * SC, tp.y * SC); c.rotate(kr.to.getAngle() - 0.12); c.scale(kr.f, 1);
      koerper(c, { lw: lw, v: 0, zeit: zeit, augen: 0 });
      c.restore();
    }
  }
  function glied2(c, pts, w, farbe, lw) { glied(c, pts, w, farbe, lw); }
  function vorn(c) {
    // Vordergrund: dunkle Schattenrisse, die schneller vorbeiziehen
    var p = 1.6, ks = k * 1.4, basis = H + 4 + Math.min(40, Math.max(-20, (cam.y - gy(cam.x) - 34) * 0.3));
    var l = cam.x * p - W / 2 / ks - 80, r = cam.x * p + W / 2 / ks + 80;
    c.fillStyle = F.vorn; c.globalAlpha = P.nacht ? 0.95 : 0.88;
    wieder(l, r, 260, function (o, i) {
      var sx = W / 2 + (o + hash(i, 2) * 120 - cam.x * p) * ks;
      var art = hash(i, 1);
      if (art < 0.45) { // Gras
        c.beginPath(); c.moveTo(sx - 30, basis);
        for (var j = 0; j < 9; j++) { var gx = sx - 28 + j * 7, gh = 30 + hash(i * 9 + j, 3) * 44; c.quadraticCurveTo(gx + 2, basis - gh * 0.6, gx + 4 + hash(j, i) * 5, basis - gh); c.quadraticCurveTo(gx + 4, basis - gh * 0.4, gx + 7, basis); }
        c.closePath(); c.fill();
      } else if (art < 0.65) { // Poller oder Zaunpfahl
        c.beginPath(); c.moveTo(sx - 9, basis); c.lineTo(sx - 13, basis - 74); c.quadraticCurveTo(sx, basis - 90, sx + 13, basis - 74); c.lineTo(sx + 9, basis); c.fill();
      }
    });
    c.globalAlpha = 1;
  }
  function licht(c) { caches(); c.drawImage(cache.deck, 0, 0, W, H); }
  function deckStill(c) {
    if (!korn) {
      korn = document.createElement('canvas'); korn.width = korn.height = 160;
      var q = korn.getContext('2d'), d = q.createImageData(160, 160);
      for (var i = 0; i < d.data.length; i += 4) { var v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 16; }
      q.putImageData(d, 0, 0);
    }
    c.globalAlpha = P.nacht ? 0.35 : 0.55;
    c.fillStyle = c.createPattern(korn, 'repeat'); c.fillRect(0, 0, W, H);
    c.globalAlpha = 1;
    var v = c.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.max(W, H) * 0.8);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, P.nacht ? 'rgba(0,0,8,.45)' : P.abend ? 'rgba(90,40,30,.2)' : 'rgba(70,55,35,.14)');
    c.fillStyle = v; c.fillRect(0, 0, W, H);
  }

  function groesse() {
    if (!ebene) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = ebene.clientWidth || innerWidth; H = ebene.clientHeight || innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    kB = W < H ? klemm(W / 205, 1.5, 2.6) : klemm(Math.min(W / 520, H / 300), 1.4, 2.7);
    if (P && P.pipe) kB *= 0.9;
    oy = H * (W < H ? 0.7 : 0.62);
    k = kB * cam.z;
    if (pause) zeichne();
  }
  function sichtbar() { if (document.hidden && C6.kieselpark.offen && !pause) zeigeKarte(true); }

  var vorherFokus = null;
  C6.kieselpark = {
    offen: false,
    parks: PARKS,
    teile: TEILE,
    ausstattung: ausstattung,
    herkunft: herkunft,
    waehle: waehle,
    kaufe: kaufe,
    neu: function () { return bmx().neu.slice(); },
    gesehen: function (liste) { if (!liste || !liste.length) return; aendern(function () { var b = bmx(); b.neu = b.neu.filter(function (x) { return liste.indexOf(x) < 0; }); }); },
    wahl: function (art) { var b = bmx().teile; return b[art] || null; },
    zeichneRad: zeichneRad,
    besitzt: besitzt,
    auf: function (o) {
      o = o || {};
      if (C6.keimflug && C6.keimflug.offen) C6.keimflug.zu();
      if (!ebene) bau();
      vorherFokus = document.activeElement;
      this.offen = true; lauf = true;
      ebene.hidden = false; ebene.classList.remove('c6s-zu');
      document.documentElement.classList.add('c6s-spiel-auf', 'c6s-park-auf');
      window.addEventListener('keydown', taste, true);
      window.addEventListener('keyup', taste, true);
      window.addEventListener('resize', groesse);
      document.addEventListener('visibilitychange', sichtbar);
      if (!P) ladePark('hof');
      if (o.park && PARKS[o.park]) { ladePark(o.park); groesse(); starte(o.park); }
      else { groesse(); zeigeKarte(false); }
      emit('spiel', { was: 'kieselpark', offen: true });
    },
    zu: function () {
      if (!this.offen) return;
      this.offen = false; lauf = false; pause = true;
      if (raf) cancelAnimationFrame(raf); raf = 0;
      loslassen();
      window.removeEventListener('keydown', taste, true);
      window.removeEventListener('keyup', taste, true);
      window.removeEventListener('resize', groesse);
      document.removeEventListener('visibilitychange', sichtbar);
      document.documentElement.classList.remove('c6s-spiel-auf', 'c6s-park-auf');
      var e = ebene; e.classList.add('c6s-zu');
      setTimeout(function () { if (!C6.kieselpark.offen) e.hidden = true; }, 320);
      if (neuJetzt) {
        neuJetzt = 0;
        var bm = bmx(), wo = null;
        REIHE.forEach(function (id) { if (wo || id === parkId) return; var ch = (bm.parks[id] && bm.parks[id].ch) || {}; if (PARKS[id].ch.some(function (c) { return !ch[c.id]; })) wo = id; });
        if (wo) setTimeout(function () { try { C6.sag && C6.sag(IM[wo] + ' wartet was Neues.'); } catch (x) {} }, 500);
      }
      if (punkte) aendern(function (s) { var bm = bmx(); bm.parks[parkId] = bm.parks[parkId] || {}; bm.parks[parkId].beste = Math.max(bm.parks[parkId].beste || 0, Math.round(punkte)); });
      try { vorherFokus && vorherFokus.focus && vorherFokus.focus({ preventScroll: true }); } catch (x) {}
      emit('spiel', { was: 'kieselpark', offen: false });
      emit('rad', { was: 'zu' });
    },
    // für Prüfungen
    _zustand: function () { return { park: parkId, b: b, pause: pause, punkte: punkte, combo: combo, rest: rest, laufAn: laufAn, fahrt: fahrt, cam: cam, k: k, raf: raf }; },
    _schritt: function (n, eing) { eing = eing || {}; eingabe.vor = !!eing.treten; eingabe.r = !!eing.r; eingabe.l = !!eing.l; for (var i = 0; i < n; i++) schritt(DT); eingabe.vor = eingabe.r = eingabe.l = false; return b; },
    _hopp: function (kraft) { los(); hopp(kraft || 1); }, _gel: function () { return gel; }, _welt: function () { return { wl: wl, kr: kr }; },
    _salto: function (r) { if (kr && b.st === 'luft') drehAlle((r || 1) * 9); }, _drehe: function () { drehe(); }, _sturz: function () { sturz('kopf'); },
    _setze: function (o) { if (o.punkte != null) punkte = o.punkte; if (o.rest != null) { rest = o.rest; laufAn = true; } if (o.x != null) { wegRad(); baueRad(o.x, o.f || 1, o.v || 0); cam.x = b.x; cam.y = b.y + 34; } }
  };
})();
