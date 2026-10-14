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
function besitzt(art, id) { var t = teil(art, id); return !!t.frei || bmx().besitz.indexOf(art + ':' + id) >= 0; }
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
  if (!C6.muenzen || !C6.muenzen.ausgeben(t.preis)) return false;
  aendern(function (s) { var b = bmx(); if (b.besitz.indexOf(art + ':' + id) < 0) b.besitz.push(art + ':' + id); });
  return waehle(art, id);
}

// ---------- Parks ----------
var STEP = 4;
function Bau(y0) {
  var g = { p: [y0], zonen: [], rails: [], deko: [], holz: [], y: y0 };
  g.x = function () { return (this.p.length - 1) * STEP; };
  g.kurve = function (len, f) { var y0 = this.y, n = Math.max(1, Math.round(len / STEP)); for (var i = 1; i <= n; i++) this.p.push(y0 + f(i / n)); this.y = this.p[this.p.length - 1]; return this; };
  g.flach = function (len) { return this.kurve(len, function () { return 0; }); };
  g.s = function (len, h) { return this.kurve(len, function (t) { return h * (1 - Math.cos(Math.PI * t)) / 2; }); };
  g.kicker = function (len, h, rueck) { this.kurve(len, function (t) { return h * Math.pow(t, 2.1); }); if (rueck) this.s(rueck, -h); return this; };
  g.viertelHoch = function (R) { var c = 0.992; return this.kurve(R * c, function (t) { return R * (1 - Math.sqrt(1 - Math.pow(t * c, 2))); }); };
  g.viertelRunter = function (R) { var c = 0.992, h = R * (1 - Math.sqrt(1 - c * c)); return this.kurve(R * c, function (t) { return -h + R * (1 - Math.sqrt(1 - Math.pow((1 - t) * c, 2))); }); };
  g.loch = function (w, tief) { var y0 = this.y; this.p.push(y0 - tief); var n = Math.round(w / STEP); for (var i = 1; i < n; i++) this.p.push(y0 - tief); this.p.push(y0); this.y = y0; return this; };
  // art: 'rail' (Geländer) | 'kante' (Bank aus Stein)
  g.rail = function (len, h, art) { var x = this.x(); this.rails.push({ x1: x, x2: x + len, y: this.y + h, y1: this.y + h, y2: this.y + h, art: art || 'rail', boden: this.y }); return this; };
  g.zone = function (z) { this.zonen.push(z); return this; };
  g.deko_ = function (art, extra) { var d = { art: art, x: this.x(), y: this.y }; for (var k in extra) d[k] = extra[k]; this.deko.push(d); return this; };
  g.holz_ = function (von, bis, extra) { var h = { von: von, bis: bis }; for (var k in extra) h[k] = extra[k]; this.holz.push(h); return this; };
  return g;
}

var PARKS = {
  hof: {
    name: 'Hof', unter: 'zwischen den Häusern', nacht: false, kappe: 400,
    bau: function () {
      var g = Bau(0);
      g.flach(200).deko_('baum').flach(90);
      var a = g.x(); g.kicker(70, 34, 22); g.holz_(a, g.x());
      g.flach(150).deko_('laterne').flach(80);
      var kv = g.x(); g.kicker(84, 42); var ktop = g.x(); g.flach(170); var kend = g.x(); g.s(96, -42);
      g.holz_(kv, g.x(), { kiesel: true });
      g.zone({ id: 'kiste', von: kv + 30, bis: ktop + 4, ueber: kend - 24 });
      g.flach(150).deko_('leine').flach(70);
      g.rail(170, 22, 'kante').flach(170);
      g.flach(150).deko_('baum', { gross: true });
      var h = g.x(); g.s(70, 30).flach(40).s(70, -30); g.holz_(h, g.x(), { erde: true });
      g.flach(170).deko_('laterne').flach(40);
      var k2 = g.x(); g.kicker(62, 30, 18); g.holz_(k2, g.x());
      g.flach(240);
      return g;
    },
    ch: [
      { id: 'drei', text: 'Drei Sprünge in einer Fahrt', lohn: 'reifen:ziegel', m: 3 },
      { id: 'kiste', text: 'Über die ganze Kiste', lohn: 'band:kirsch', m: 3 },
      { id: 'salto', text: 'Einen Salto sauber landen', lohn: 'klingel:gelb', m: 4 }
    ]
  },
  dach: {
    name: 'Dachpark', unter: 'über der Stadt', nacht: false, abend: true, kappe: 460,
    bau: function () {
      var g = Bau(0);
      g.flach(240).deko_('kamin').flach(140);
      var kv = g.x(); g.kicker(76, 32); var lip = g.x(); g.holz_(kv, lip, { offen: true });
      g.loch(108, 260); var lend = g.x();
      g.zone({ id: 'luecke', von: kv + 20, bis: lip + 4, ueber: lend + 2, loch: { von: lip, bis: lend, zurueck: kv - 260 } });
      var ld = g.x(); g.s(44, -32); g.holz_(ld, g.x(), { offen: true });
      g.flach(170).deko_('antenne').flach(70);
      g.rail(300, 30, 'rail').flach(300);
      g.flach(130).deko_('tank').flach(30);
      var st = g.x(); g.s(90, 40); g.holz_(st, g.x(), { stufe: true });
      g.flach(150).deko_('kamin').flach(60);
      var k2 = g.x(); g.kicker(64, 28, 16); g.holz_(k2, g.x());
      g.flach(180);
      g.s(130, -40);
      g.flach(220);
      return g;
    },
    ch: [
      { id: 'rail', text: 'Ein Geländer ganz entlang', lohn: 'profil:stollen', m: 4 },
      { id: 'luecke', text: 'Über die Lücke', lohn: 'reifen:see', m: 4 },
      { id: 'kombi', text: 'Salto und Dreher in einem Sprung', lohn: 'band:wiese', m: 5 }
    ]
  },
  pipe: {
    name: 'Halfpipe', unter: 'unterm Sternenhimmel', nacht: true, kappe: 760, pipe: true,
    bau: function () {
      var g = Bau(200);
      g.flach(120);
      g.viertelRunter(220);
      g.flach(360);
      g.viertelHoch(220);
      g.flach(120);
      return g;
    },
    start: 120 + 218 + 180,
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
  rad(-19, R); rad(19, R);
  c.save(); c.translate(0, -dr * 2.5);
  var rahmen = fb(A.rahmen);
  var tret = [-2, 13], kopfO = [13.5, 30], kopfU = [15.5, 25], sitz = [-8, 27], hint = [-19, R + dr * 2.5];
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
  linie([kopfO, kopfU, [19, R + dr * 2.5]], 2.4 * lw, rahmen);
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
  var G = 980, PED = 430, DT = 1 / 120, LAUF = 60, HOP = 410, ZWEIPI = Math.PI * 2;
  var ebene, cv, cx, ui = {}, W = 0, H = 0, dpr = 1, kB = 1, k = 1, oy = 0, raf = 0, tLetzt = 0, acc = 0;
  var lauf = false, pause = true, parkId = 'hof', P = null, gel = null, L = 1, SL = 1, zeit = 0, wrap = true;
  var b = null, cam = { x: 0, y: 0, z: 1 }, teilchen = [], punkte = 0, aus = null;
  var fahrt = { lufte: 0, tricks: 0 }, combo = { n: 0, p: 0, namen: [] }, bodenZeit = 0, rest = LAUF, laufAn = false, laufNeu = [], still = 0;
  var eingabe = { r: false, l: false, zwei: false, lade: false, ladeT: 0, zug: 0, dSpin: 0, finger: false, zeiger: {} };
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

  function neuesRad(x) {
    b = { x: x, y: gy(x), s: sVon(x), v: 0, vx: 0, vy: 0, st: 'boden', f: 1, th: ga(x), basis: ga(x), spin: 0, w: 0, flick: false,
      dreh: 0, drehAn: false, dreher: 0, wende: 0, rad: 0, kurbel: 0.6, druck: 0, luft: null, sturz: 0, rail: null, nachSturz: 0,
      zielW: 0, zielT: 0, wackel: 0, quart: false, jubel: 0 };
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
      '<div class="c6s-park-kopf" aria-live="off"><span class="c6s-park-name"></span><span class="c6s-park-punkte"></span><span class="c6s-park-zeit"><i></i><b></b></span></div>' +
      '<div class="c6s-park-combo" aria-hidden="true"></div>' +
      '<div class="c6s-park-trick" aria-live="polite"></div>' +
      '<div class="c6s-park-geschafft" aria-live="polite" hidden></div>' +
      '<div class="c6s-park-hilfe" aria-hidden="true"></div>' +
      '<div class="c6s-park-ende" role="group" aria-label="Lauf vorbei" hidden></div>' +
      '<div class="c6s-park-karte" hidden>' +
      '  <div class="c6s-park-karte-kopf"><p class="c6s-park-titel">Kieselpark</p><p class="c6s-park-satz">Während ich arbeite, fährst du.</p></div>' +
      '  <button type="button" class="c6s-knopf c6s-park-weiter" hidden>Weiter fahren</button>' +
      '  <div class="c6s-park-reihe" role="list"></div>' +
      '  <div class="c6s-park-rad"><canvas class="c6s-park-vorschau" aria-hidden="true"></canvas><div class="c6s-park-teile"></div></div>' +
      '</div>';
    document.body.appendChild(ebene);
    cv = ebene.querySelector('.c6s-park-cv'); cx = cv.getContext('2d');
    ['kopf', 'name', 'punkte', 'zeit', 'combo', 'trick', 'geschafft', 'hilfe', 'ende', 'karte', 'weiter', 'reihe', 'teile', 'vorschau', 'satz'].forEach(function (n) { ui[n] = ebene.querySelector('.c6s-park-' + n); });
    ebene.querySelector('.c6s-park-zu').onclick = function () { C6.kieselpark.zu(); };
    ebene.querySelector('.c6s-park-pause').onclick = function () { pause ? (P && ui.ende.hidden ? weiter() : 0) : zeigeKarte(true); };
    ui.weiter.onclick = function () { weiter(); };
    REIHE.forEach(function (id) {
      var p = PARKS[id];
      var a = document.createElement('div');
      a.className = 'c6s-park-wahl' + (p.nacht ? ' c6s-nachtkarte' : '') + (p.abend ? ' c6s-abendkarte' : '');
      a.setAttribute('role', 'listitem');
      a.dataset.park = id;
      a.innerHTML = '<div class="c6s-park-bild" aria-hidden="true">' + parkBild(id) + '</div>' +
        '<p class="c6s-park-wahl-name">' + p.name + '</p><p class="c6s-park-wahl-unter">' + p.unter + '<span class="c6s-park-beste"></span></p>' +
        '<ul class="c6s-park-ch">' + p.ch.map(function (c) { return '<li data-ch="' + c.id + '"><span class="c6s-haken" aria-hidden="true"></span><span>' + c.text + '</span></li>'; }).join('') + '</ul>' +
        '<button type="button" class="c6s-knopf c6s-park-los">Hier fahren</button>';
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
    ui.satz.textContent = alsPause && P ? (P.name + ' · ' + Math.round(punkte) + ' Punkte') : 'Während ich arbeite, fährst du.';
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
    var html = '';
    PARKREIHEN.forEach(function (art) {
      html += '<div class="c6s-teilreihe"><span class="c6s-teilname">' + ({ band: 'Griffe', klingel: 'Klingel' }[art] || TEILE[art].titel) + '</span><div class="c6s-chips">';
      TEILE[art].teile.forEach(function (t) {
        var hat = besitzt(art, t.id), an = bm.teile[art] === t.id;
        var punkt = t.farbe ? '<i style="background:' + t.farbe + '"></i>' : (art === 'band' ? '<i class="c6s-leer"></i>' : '');
        html += '<button type="button" class="c6s-chip' + (an ? ' c6s-an' : '') + '" data-art="' + art + '" data-id="' + t.id + '"' + (hat ? '' : ' disabled') + ' aria-pressed="' + an + '">' + punkt + t.name + '</button>';
      });
      html += '</div></div>';
    });
    ui.teile.innerHTML = html;
    Array.prototype.forEach.call(ui.teile.querySelectorAll('.c6s-chip'), function (bt) {
      bt.onclick = function () {
        var art = bt.dataset.art, id = bt.dataset.id;
        if (!besitzt(art, id)) return;
        aendern(function (s) { var bb = bmx(); bb.teile[art] = id; bb.neu = bb.neu.filter(function (x) { return x !== art + ':' + id; }); });
        aus = ausstattung();
        Array.prototype.forEach.call(ui.teile.querySelectorAll('.c6s-chip[data-art="' + art + '"]'), function (x) { var on = x.dataset.id === id; x.classList.toggle('c6s-an', on); x.setAttribute('aria-pressed', on); });
        vorschau();
        emit('rad', { was: 'teil', art: art, id: id });
      };
    });
    REIHE.forEach(function (pid) { PARKS[pid].ch.forEach(function (c) {
      var p = c.lohn.split(':'), bt = ui.teile.querySelector('.c6s-chip[data-art="' + p[0] + '"][data-id="' + p[1] + '"]');
      if (bt && bt.disabled) bt.title = PARKS[pid].name + ': ' + c.text;
    }); });
    aus = ausstattung();
    vorschau();
  }
  function vorschau() {
    var c = ui.vorschau, w = 150, h = 122, d = Math.min(3, window.devicePixelRatio || 1);
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
    parkId = id; P = PARKS[id]; gel = P.bau(); L = (gel.p.length - 1) * STEP; wrap = !P.pipe;
    gel.s = [0]; for (var i = 1; i < gel.p.length; i++) gel.s.push(gel.s[i - 1] + Math.sqrt(STEP * STEP + Math.pow(gel.p[i] - gel.p[i - 1], 2)));
    SL = gel.s[gel.s.length - 1];
    F = farbenFuer(P);
    ebene.classList.toggle('c6s-nacht', !!P.nacht);
    ebene.classList.toggle('c6s-abend', !!P.abend);
    neuesRad(P.start || 120);
    cam.x = b.x + 60; cam.y = b.y + 30; cam.z = 1;
    teilchen = [];
    aus = ausstattung();
    ui.name.textContent = P.name;
    sterne = [];
    for (var j = 0; j < 140; j++) sterne.push({ x: Math.random(), y: Math.random(), r: Math.random() < .12 ? 1.6 : .8, p: Math.random() * 6 });
  }
  function starte(id) {
    ladePark(id);
    punkte = 0; fahrt = { lufte: 0, tricks: 0 }; combo = { n: 0, p: 0, namen: [] }; rest = LAUF; laufAn = false; laufNeu = []; landeText = null;
    ui.punkte.textContent = '0';
    zeigeZeit(); zeigeCombo();
    hilfe(true);
    weiter();
  }
  function istTouch() { return C6.geraet === 'iphone' || matchMedia('(pointer: coarse)').matches; }
  function hilfe(an) {
    hinweisAn = an;
    if (an) {
      ui.hilfe.innerHTML = istTouch()
        ? '<span><i class="c6s-g c6s-g-wisch"></i>nach vorn wischen: Schwung</span><span><i class="c6s-g c6s-g-zieh"></i>runterziehen, hochschnellen: Sprung</span><span><i class="c6s-g c6s-g-dreh"></i>in der Luft zur Seite ziehen: Salto</span>'
        : '<span><kbd>→</kbd> treten · <kbd>←</kbd> bremsen</span><span><kbd>Leertaste</kbd> halten, loslassen: Sprung</span><span>in der Luft <kbd>←</kbd><kbd>→</kbd> Salto · <kbd>↓</kbd> Dreher</span>';
      ui.hilfe.classList.remove('c6s-weg');
    } else ui.hilfe.classList.add('c6s-weg');
  }
  function los() { if (!laufAn) { laufAn = true; } if (hinweisAn && zeit > 0) setTimeout(function () { if (laufAn) hilfe(false); }, 2600); }

  // ----- Eingaben -----
  function loslassen() { eingabe.zeiger = {}; eingabe.r = eingabe.l = eingabe.zwei = eingabe.lade = eingabe.finger = false; eingabe.zug = 0; eingabe.ladeT = 0; eingabe.dSpin = 0; }
  function zahlZeiger() { var n = 0; for (var id in eingabe.zeiger) n++; return n; }
  function zeigerAb(e) {
    if (pause) return;
    e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    var t = performance.now();
    eingabe.zeiger[e.pointerId] = { x0: e.clientX, y0: e.clientY, lx: e.clientX, ly: e.clientY, tief: e.clientY, t: t, sx: e.clientX, sy: e.clientY, st: t, sprung: false };
    eingabe.finger = true;
    eingabe.zwei = zahlZeiger() >= 2;
    if (eingabe.zwei) los();
  }
  function zeigerZieh(e) {
    var z = eingabe.zeiger[e.pointerId]; if (!z || pause) return;
    var t = performance.now(), dx = e.clientX - z.lx, dy = e.clientY - z.ly, vor = { x: z.lx, y: z.ly, t: z.lt || z.t };
    z.lx = e.clientX; z.ly = e.clientY; z.lt = t;
    if (eingabe.zwei) return;
    if (b.st === 'luft') {
      eingabe.dSpin += -dx * 0.03 * (W < 600 ? 1.15 : 1);
      // schnell nach unten = Dreher
      if (t - z.st > 240) { z.sx = vor.x; z.sy = vor.y; z.st = vor.t; }
      var ddy = e.clientY - z.sy, ddx = e.clientX - z.sx;
      if (ddy > 46 && ddy > Math.abs(ddx) * 1.4) { drehe(); z.sx = e.clientX; z.sy = e.clientY; z.st = t; }
      z.tief = e.clientY;
      return;
    }
    // am Boden: runterziehen lädt, hochschnellen springt
    if (e.clientY > z.tief) z.tief = e.clientY;
    var zug = klemm((z.tief - z.y0 - 6) / 70, 0, 1);
    eingabe.zug = zug;
    if (!z.sprung && z.tief - e.clientY > 24 && (b.st === 'boden' || b.st === 'rail')) {
      z.sprung = true; los();
      hopp(0.42 + 0.58 * zug);
      eingabe.zug = 0; z.tief = e.clientY; z.y0 = e.clientY;
      return;
    }
    // Wischen zur Seite = Schwung / Bremsen
    if (t - z.st > 260) { z.sx = vor.x; z.sy = vor.y; z.st = vor.t; }
    var wx = e.clientX - z.sx, wy = e.clientY - z.sy;
    if (Math.abs(wx) > 34 && Math.abs(wx) > Math.abs(wy) * 1.5 && zug < 0.25) {
      var tempo = Math.abs(wx) / Math.max(16, t - z.st) * 1000;
      if (Math.sign(wx) === b.f) schwung(tempo); else bremse();
      z.sx = e.clientX; z.sy = e.clientY; z.st = t;
    }
  }
  function zeigerAuf(e) {
    var z = eingabe.zeiger[e.pointerId];
    delete eingabe.zeiger[e.pointerId];
    eingabe.zwei = zahlZeiger() >= 2;
    eingabe.finger = zahlZeiger() > 0;
    if (z && !z.sprung && eingabe.zug > 0.2 && (b.st === 'boden' || b.st === 'rail') && !pause) { los(); hopp(0.42 + 0.58 * eingabe.zug); }
    if (b && b.st === 'luft' && !eingabe.finger) b.flick = true;
    eingabe.zug = 0;
  }
  function schwung(tempo) {
    if (b.st !== 'boden' || b.wende) return;
    los();
    var a = ga(b.x); if (Math.abs(a) > 0.7) return;
    var plus = klemm(50 + tempo * 0.07, 60, 150);
    var neu = b.v + b.f * plus;
    if (neu * b.f > P.kappe) neu = b.f * Math.max(P.kappe, Math.abs(b.v));
    b.v = neu; b.tritt = 0.3;
    staub(b.x - b.f * 18, b.y, 0.35, -b.f);
  }
  function bremse() {
    if (b.st !== 'boden') return;
    if (Math.abs(b.v) < 50 && !b.wende) { b.wende = 0.001; b.v = 0; return; }
    b.v *= 0.55; staub(b.x + b.f * 12, b.y, 0.5, b.f);
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
    if (kk === 'ArrowRight' || kk === 'd' || kk === 'D') { eingabe.r = ab; if (!ab) eingabe.sperreR = false; if (ab) los(); }
    else if (kk === 'ArrowLeft' || kk === 'a' || kk === 'A') { eingabe.l = ab; if (!ab) eingabe.sperreL = false; }
    else if (kk === 'ArrowUp' || kk === ' ' || kk === 'w' || kk === 'W') {
      if (ab && !e.repeat) { eingabe.lade = true; eingabe.ladeT = 0; los(); }
      if (!ab && eingabe.lade) { eingabe.lade = false; if (b.st === 'boden' || b.st === 'rail') hopp(0.42 + 0.58 * klemm(eingabe.ladeT / 0.45, 0, 1)); eingabe.ladeT = 0; }
    }
    else if (kk === 'ArrowDown' || kk === 's' || kk === 'S') { if (ab && !e.repeat && b.st === 'luft') drehe(); }
    else if ((kk === 'p' || kk === 'P') && ab) zeigeKarte(true);
    else nimm = false;
    if (nimm) { e.preventDefault(); e.stopImmediatePropagation(); }
  }

  function hopp(kraft) {
    if (b.st === 'rail') { grindEnde(); abheben(b.v, HOP * 0.8 * kraft, 0); b.y += 1; return; }
    if (b.st !== 'boden') return;
    var a = ga(b.x), h0 = HOP * kraft;
    abheben(b.v * Math.cos(a) - Math.sin(a) * h0 * 0.3, b.v * Math.sin(a) + Math.max(0.72, Math.cos(a)) * h0, a);
    b.y += 1;
    staub(b.x, b.y - 1, 0.4 + kraft * 0.4, 0);
  }
  function drehe() { if (b.st !== 'luft' || b.drehAn) return; b.drehAn = true; b.dreh = 0; }

  // ----- Physik -----
  function abheben(vx, vy, a) {
    b.st = 'luft'; b.vx = vx; b.vy = vy; b.quart = false; eingabe.sperreR = eingabe.r; eingabe.sperreL = eingabe.l;
    if (P.pipe && Math.abs(a) > 0.95) { b.vx = -Math.sign(vx || 1) * Math.min(Math.abs(vx), 20); b.quart = true; }
    b.basis = a; b.spin = 0; b.w = 0; b.flick = false; b.dreh = 0; b.drehAn = false; b.dreher = 0;
    b.luft = { t: 0, x0: b.x, xm0: xm(b.x), maxY: b.y, y0: b.y };
    b.zielT = 0;
  }
  function landePunkt() {
    var x = b.x, y = b.y, vx = b.vx, vy = b.vy, h = 1 / 30;
    for (var i = 0; i < 90; i++) { vy -= G * h; x += vx * h; y += vy * h; if (y <= gy(x)) return x; }
    return x;
  }
  function schritt(dt) {
    var treten = eingabe.r || eingabe.zwei;
    if (eingabe.lade) eingabe.ladeT = Math.min(0.6, eingabe.ladeT + dt);
    var ziel = eingabe.lade ? klemm(eingabe.ladeT / 0.45, 0, 1) : eingabe.zug;
    b.druck = ziel > b.druck ? b.druck + (ziel - b.druck) * Math.min(1, dt * 14) : Math.max(ziel, b.druck - dt * 4);
    if (b.wende) { b.wende = Math.min(1, b.wende + dt / 0.26); if (b.wende >= 1) { b.wende = 0; b.f = -b.f; } }
    b.wackel = Math.max(0, b.wackel - dt * 1.4);
    b.jubel = Math.max(0, b.jubel - dt);
    b.tritt = Math.max(0, (b.tritt || 0) - dt);
    if (b.st === 'boden') boden(dt, treten);
    else if (b.st === 'luft') luft(dt);
    else if (b.st === 'rail') grind(dt);
    else sturzSchritt(dt);
  }
  function boden(dt, treten) {
    var a = ga(b.x);
    b.v += -G * Math.sin(a) * dt;
    var flach = Math.abs(a) < 0.5;
    if (treten && flach && b.v * b.f < P.kappe && !b.wende) { b.v += b.f * PED * dt; b.kurbel += dt * 11; }
    if (b.tritt > 0) b.kurbel += dt * 14;
    if (!P.pipe && laufAn && flach && b.v * b.f < 70 && b.v * b.f > -12 && !b.wende) b.v += b.f * 110 * dt;
    if (eingabe.l) b.v -= b.v * 2.4 * dt;
    b.v -= b.v * 0.06 * dt + (Math.abs(b.v) > 1 ? Math.sign(b.v) * 3 * dt : 0);
    if (Math.abs(b.v) < 1.5 && !treten && Math.abs(a) < 0.03) b.v = 0;
    var vx = b.v * Math.cos(a), vy = b.v * Math.sin(a);
    var s2 = b.s + b.v * dt, x2 = xVon(s2), y2 = gy(x2);
    var yb = b.y + vy * dt - 0.5 * G * dt * dt;
    var a2 = ga(x2), knick = b.v > 0 ? a - a2 : a2 - a;
    if (Math.abs(b.v) > 60 && (y2 < yb - 0.4 || knick > 0.45)) { b.x += vx * dt; b.y = Math.max(yb, y2 + 0.5); abheben(vx, vy, a); return; }
    b.s = s2; b.x = x2; b.y = y2;
    if (!wrap && ((b.x <= 2 && b.v < 0) || (b.x >= L - 2 && b.v > 0))) b.v = -b.v * 0.3;
    b.th = ga(b.x); b.basis = b.th;
    b.rad -= b.v * dt / 11;
    if (b.y < -40) { var lz = lochZone(); if (lz) { sturz(lz); return; } }
    if (b.v * b.f < -12 && !b.wende) b.wende = 0.001;
    bodenZeit += dt;
    if (combo.n && bodenZeit > 0.9) bank();
    if (Math.abs(b.v) < 8) { still += dt; if (still > 1.6) fahrt = { lufte: 0, tricks: 0 }; } else still = 0;
    if (Math.abs(b.v) > 240 && Math.random() < dt * 14) teilchen.push({ x: b.x - b.f * 20, y: b.y + 1, vx: -b.v * 0.1, vy: 10 + Math.random() * 14, r: 1.5 + Math.random() * 2, t: 0, max: 0.45, art: 'staub' });
  }
  function luft(dt) {
    var Lf = b.luft; Lf.t += dt;
    b.vy -= G * dt;
    var py = b.y;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (!wrap) { if (b.x < 3) { b.x = 3; b.vx = Math.abs(b.vx) * 0.3; } if (b.x > L - 3) { b.x = L - 3; b.vx = -Math.abs(b.vx) * 0.3; } }
    if (b.y > Lf.maxY) Lf.maxY = b.y;
    if (Math.sign(b.vx) !== b.f && Math.abs(b.vx) > 10 && !b.wende) b.wende = 0.001;
    // Drehen: Finger direkt, Pfeile mit Tempo, losgelassen läuft der Schwung aus und rastet sanft ein
    var kd = (eingabe.l && !eingabe.sperreL ? 1 : 0) - (eingabe.r && !eingabe.sperreR ? 1 : 0);
    if (kd) { b.w += (kd * 8.6 - b.w) * Math.min(1, dt * 16); b.spin += b.w * dt; b.flick = false; b.taste = true; }
    else if (eingabe.finger && !eingabe.zwei) {
      var d = eingabe.dSpin; eingabe.dSpin = 0;
      b.spin += d; b.w = klemm(b.w * 0.86 + (d / dt) * 0.14, -13, 13); b.taste = false;
    } else {
      b.w *= Math.exp(-(b.taste ? 7 : 1.7) * dt);
      b.spin += b.w * dt;
      var r = wd(b.spin);
      if (Math.abs(b.w) < 3 && Math.abs(r) < 0.8) b.spin -= r * Math.min(1, dt * 5.5);
    }
    eingabe.dSpin = 0;
    if (b.drehAn) { b.dreh += dt / 0.4; if (b.dreh >= 1) { b.dreh = 0; b.drehAn = false; b.dreher++; } }
    b.zielT -= dt; if (b.zielT <= 0) { b.zielW = ga(landePunkt()); b.zielT = 0.08; }
    b.basis += wd(b.zielW - b.basis) * Math.min(1, 3.4 * dt);
    b.th = b.basis + b.spin;
    b.rad -= (b.vx * dt) / 11 * 0.5;
    var z = lochZone(); if (z && b.y < -60) { sturz(z); return; }
    if (b.vy < 0) {
      var x = xm(b.x);
      for (var i = 0; i < gel.rails.length; i++) {
        var R = gel.rails[i];
        if (x >= R.x1 && x <= R.x2 && py >= R.y - 0.5 && b.y <= R.y + 0.5) { grindStart(R, x); return; }
      }
    }
    var g0 = gy(b.x);
    if (b.y <= g0) { b.y = g0; landung(); }
  }
  function guete() {
    var r = Math.abs(wd(b.spin));
    if (b.drehAn) r += (b.dreh > 0.18 && b.dreh < 0.82) ? 1.2 : 0.3;
    return r;
  }
  function landung() {
    var lz = lochZone(); if (lz && xm(b.x) < lz.loch.bis - 1) { sturz(lz); return; }
    var a = ga(b.x);
    if (Math.abs(a) > 1.2 && !P.pipe) { b.x += (b.vx >= 0 ? 4 : -4); b.y = gy(b.x); a = ga(b.x); }
    if (b.wende) { b.wende = 0; b.f = -b.f; }
    var q = guete() + Math.max(0, Math.abs(wd(b.basis - a)) - 0.45);
    var vt = b.vx * Math.cos(a) + b.vy * Math.sin(a);
    var vn = -(-b.vx * Math.sin(a) + b.vy * Math.cos(a));
    b.druck = Math.min(1, Math.max(0, vn / 520));
    staub(b.x, b.y, Math.min(1, vn / 480), 0);
    if (q > 0.85) { b.v = vt; sturz(null); return; }
    if (b.drehAn) { b.drehAn = false; if (b.dreh > 0.6) b.dreher++; b.dreh = 0; }
    var stufe = q < 0.3 ? 'sauber' : 'wackelig';
    b.st = 'boden'; b.s = sVon(b.x); b.v = vt; b.th = a; b.basis = a;
    if (!P.pipe && b.v * b.f < 60 && b.v * b.f > -20) b.v = b.f * 60;
    if (b.v * b.f < -12) b.wende = 0.001;
    if (stufe === 'wackelig') b.wackel = 1; else b.jubel = 0.6;
    bodenZeit = 0;
    wertung(stufe, false);
  }
  function wertung(stufe, aufRail) {
    var Lf = b.luft; if (!Lf) return; b.luft = null;
    var turns = Math.round(b.spin / ZWEIPI), salti = Math.abs(turns);
    var rueck = salti && (turns * b.f > 0);
    var dreher = b.dreher; b.dreher = 0;
    var hoehe = Lf.maxY - Lf.y0;
    if (Lf.t < 0.32 && !salti && !dreher) { if (stufe === 'wackelig') zeigeLandung('wackelig'); return; }
    var pk = 10 + Math.round(Lf.t * 40) + salti * 100 + (salti >= 2 ? 150 : 0) + dreher * 70 + (b.quart ? Math.round(Math.max(0, hoehe) * 0.5) : 0);
    var name = [];
    if (salti === 1) name.push(rueck ? 'Rückwärtssalto' : 'Salto');
    if (salti === 2) name.push('Doppelsalto');
    if (salti > 2) name.push(salti + '-fach Salto');
    if (dreher === 1) name.push('Dreher'); else if (dreher > 1) name.push(dreher + '× Dreher');
    if (!name.length) name.push(b.quart ? (Lf.maxY > P.kante + 45 ? 'Hoher Air' : 'Air') : (Lf.t > 0.75 ? 'Weiter Sprung' : 'Sprung'));
    if (stufe === 'wackelig') pk = Math.round(pk / 2);
    fahrt.lufte++;
    if (salti || dreher) fahrt.tricks++;
    comboDazu(name.join(' + '), pk, stufe);
    ereignis({ art: 'landung', salti: salti, dreher: dreher, t: Lf.t, x0: Lf.x0, xm0: Lf.xm0, x1: b.x, maxY: Lf.maxY, wackel: stufe === 'wackelig', rail: aufRail });
    if (stufe === 'wackelig' && !aufRail) bank();
  }
  function grindStart(R, x) {
    var q = guete();
    if (q > 0.7) { b.vy = 120; b.vx *= 0.5; sturz(null); return; }
    if (b.wende) { b.wende = 0; b.f = -b.f; }
    if (b.drehAn) { b.drehAn = false; if (b.dreh > 0.6) b.dreher++; b.dreh = 0; }
    wertung(q < 0.3 ? 'sauber' : 'wackelig', true);
    b.st = 'rail'; b.y = R.y;
    b.v = b.vx; if (Math.sign(b.v) !== b.f) b.v = b.f * Math.abs(b.v); if (Math.abs(b.v) < 110) b.v = b.f * 110;
    b.rail = { r: R, start: (b.f > 0 ? (x - R.x1) : (R.x2 - x)) / (R.x2 - R.x1), weg: 0 };
    b.th = 0; b.basis = 0; b.spin = 0; b.w = 0;
    b.druck = 0.5; bodenZeit = 0;
    for (var i = 0; i < 8; i++) funke(1.6);
  }
  function grind(dt) {
    var Rr = b.rail, R = Rr.r;
    b.v -= b.v * 0.16 * dt;
    b.x += b.v * dt; Rr.weg += Math.abs(b.v * dt);
    b.s = sVon(b.x);
    if (Math.random() < 0.85) funke(1);
    if (Math.random() < 0.3) funke(1);
    var x = xm(b.x);
    if (x < R.x1 || x > R.x2 || Math.abs(b.v) < 30) {
      grindEnde();
      abheben(b.v, 70, 0);
    } else b.y = R.y;
  }
  function grindEnde() {
    var Rr = b.rail; if (!Rr) return;
    var x = xm(b.x), R = Rr.r;
    var ganz = Rr.start < 0.4 && ((b.v > 0 && x >= R.x2 - 2) || (b.v < 0 && x <= R.x1 + 2));
    var pk = 20 + Math.round(Rr.weg * 0.6) + (ganz ? 60 : 0);
    comboDazu(R.art === 'kante' ? 'Kanten-Grind' : 'Geländer-Grind', pk, 'sauber');
    fahrt.tricks++;
    if (ganz) ereignis({ art: 'rail' });
    b.rail = null;
  }
  function sturzSchritt(dt) {
    b.sturz += dt;
    b.v -= b.v * 2.6 * dt;
    if (b.zurueck == null) { b.s += b.v * dt; b.x = xVon(b.s); b.y = gy(b.x); }
    var a3 = ga(b.x), p = Math.min(1, b.sturz / 0.3);
    b.th = a3 + b.f * -1.3 * (1 - Math.pow(1 - p, 3));
    if (b.sturz > 1.0) {
      if (b.zurueck != null) { b.x = b.zurueck; b.y = gy(b.x); b.s = sVon(b.x); b.v = b.f * 140; b.zurueck = null; }
      b.st = 'boden'; b.th = ga(b.x); b.basis = b.th; b.spin = 0; b.w = 0; b.dreh = 0; b.drehAn = false;
      if (!P.pipe) b.v = b.f * Math.max(70, Math.abs(b.v));
      b.nachSturz = 0.6;
    }
  }
  function lochZone() {
    var x = xm(b.x);
    for (var i = 0; i < gel.zonen.length; i++) { var z = gel.zonen[i]; if (z.loch && x >= z.loch.von - 2 && x <= z.loch.bis + 2) return z; }
    return null;
  }
  function sturz(zone) {
    b.st = 'sturz'; b.sturz = 0; b.luft = null; b.drehAn = false; b.rail = null;
    if (!zone) { b.y = gy(b.x); b.s = sVon(b.x); }
    b.zurueck = zone ? zone.loch.zurueck + Math.floor(b.x / L) * L : null;
    b.fallX = b.x; b.fallY = b.y;
    if (zone) b.y = Math.max(b.y, -60);
    fahrt = { lufte: 0, tricks: 0 };
    var weg = combo.n;
    combo = { n: 0, p: 0, namen: [] }; zeigeCombo();
    zeigeLandung('sturz', zone ? 'Fast. Nochmal.' : (weg ? 'Combo weg' : ''));
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
  function zeigeZeit() {
    var s = Math.max(0, Math.ceil(rest));
    ui.zeit.querySelector('b').textContent = Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
    ui.zeit.querySelector('i').style.setProperty('--teil', (rest / LAUF).toFixed(3));
    ui.zeit.classList.toggle('c6s-knapp', rest < 10 && laufAn);
    ui.zeit.classList.toggle('c6s-wartet', !laufAn);
  }

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
    laufNeu.push(c.id);
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
  function zeigeLandung(stufe, extra) { trick(stufe === 'sturz' ? 'Hoppla' : 'Gelandet', extra || '', stufe); }

  // ----- Lauf zu Ende -----
  function laufEnde() {
    bank();
    pause = true; loslassen();
    var bm = bmx(), alt = (bm.parks[parkId] && bm.parks[parkId].beste) || 0, p = Math.round(punkte);
    if (p > alt) aendern(function () { var x = bmx(); x.parks[parkId] = x.parks[parkId] || {}; x.parks[parkId].beste = p; });
    var pd = bmx().parks[parkId] || {}, ch = pd.ch || {};
    ui.ende.innerHTML = '<p class="c6s-e-klein">' + P.name + ' · Lauf vorbei</p>' +
      '<p class="c6s-e-punkte">' + p + '<small> Punkte</small></p>' +
      '<p class="c6s-e-beste">' + (p > alt && alt ? 'Neuer Bestwert (vorher ' + alt + ')' : p > alt ? 'Dein erster Bestwert' : alt ? 'Bestwert ' + alt : 'Schwung nach vorn, dann springen') + '</p>' +
      '<ul class="c6s-park-ch">' + P.ch.map(function (c) { var ok = !!ch[c.id], neu = laufNeu.indexOf(c.id) >= 0; return '<li class="' + (ok ? 'c6s-ok' : '') + (neu ? ' c6s-neu' : '') + '"><span class="c6s-haken" aria-hidden="true"></span><span>' + c.text + (neu ? ' <em>neu</em>' : '') + '</span></li>'; }).join('') + '</ul>' +
      '<div class="c6s-e-knoepfe"><button type="button" class="c6s-knopf c6s-e-nochmal">Nochmal</button><button type="button" class="c6s-knopf c6s-leise c6s-e-parks">Anderer Park</button></div>';
    ui.ende.querySelector('.c6s-e-nochmal').onclick = function () { starte(parkId); };
    ui.ende.querySelector('.c6s-e-parks').onclick = function () { zeigeKarte(false); };
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
      if (laufAn) { rest -= dt; zeigeZeit(); }
      if (laufAn && rest <= 0 && (b.st === 'boden' || b.st === 'sturz')) { zeichne(); laufEnde(); return; }
    }
    zeichne();
    if (!pause) raf = requestAnimationFrame(schleife);
  }
  function kamera(dt) {
    var g0 = gy(b.x), hoch = Math.max(0, b.y - g0);
    if (b.st === 'rail') hoch = 0;
    var zz = 1 / (1 + hoch / 230 + Math.abs(b.v || b.vx || 0) / 2600);
    if (P.pipe) zz = 1 / (1 + Math.max(0, b.y - 60) / 260);
    cam.z += (zz - cam.z) * Math.min(1, dt * (zz < cam.z ? 2.6 : 1.4));
    k = kB * cam.z;
    var tempo = b.st === 'luft' ? b.vx : (b.v || 0) * Math.cos(b.th || 0);
    var vor = klemm(tempo * 0.32, -W / k * 0.22, W / k * 0.22);
    var zx = b.x + vor;
    if (P.pipe) zx = L / 2 + (b.x - L / 2) * 0.82;
    cam.x += (zx - cam.x) * Math.min(1, dt * 3);
    var zy = P.pipe ? b.y * 0.65 + 70 : g0 + hoch * 0.55 + 34;
    if (b.st === 'sturz' && b.zurueck != null) zy = Math.max(zy, -40);
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
    var sock = sockenFarbe();
    function bein(s, farbe) {
      var a = kb + s * Math.PI, p = [tret[0] + Math.cos(a) * 6, tret[1] + Math.sin(a) * 6 + 1.6];
      var kn = knie(hueft, p, 11.5, 11, 1);
      glied(c, [hueft, kn, p], 3.6, farbe, lw);
      c.fillStyle = farbe; c.strokeStyle = '#2b2722'; c.lineWidth = 0.9 * lw;
      c.beginPath(); c.ellipse(p[0] + 1.4, p[1] + 0.4, 3.3, 1.9, 0, 0, 7); c.fill(); c.stroke();
    }
    function arm(farbe) {
      var el = knie(schulter, gr, 3.6, 3.6, -1);
      c.lineCap = 'round'; c.beginPath(); c.moveTo(schulter[0], schulter[1]); c.lineTo(el[0], el[1]); c.lineTo(gr[0], gr[1]);
      c.strokeStyle = farbe; c.lineWidth = 1.7 * lw + 0.6; c.stroke();
      c.fillStyle = '#ece4d6'; c.strokeStyle = '#2b2722'; c.lineWidth = 0.8 * lw;
      c.beginPath(); c.arc(gr[0], gr[1] + 0.3, 1.7, 0, 7); c.fill(); c.stroke();
    }
    if (teil === 'hinten') { bein(1, mische(sock, '#2b2722', 0.35)); arm('#5b544c'); return; }
    bein(0, sock);
    // Körper: der Kiesel aus Filz
    var mx = -1.5, my = 47 - dr * 5.2, rx = 12.5, ry = 10.6;
    c.save(); c.translate(mx, my); c.rotate(-0.12 - dr * 0.12);
    var gk = c.createRadialGradient(-4, 4, 1, 0, 0, 15);
    gk.addColorStop(0, '#fbf8f1'); gk.addColorStop(0.55, '#ece4d6'); gk.addColorStop(1, '#c4b7a2');
    c.beginPath();
    for (var i = 0; i <= 40; i++) {
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
    c.restore();
    arm('#2b2722');
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
    schienen(c, g);
    teilchenMalen(c, 'staub');
    schatten(c);
    radMalen(c);
    teilchenMalen(c, 'funke');
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
    gel.zonen.forEach(function (z) {
      if (!z.loch) return;
      var q0 = Math.floor((g.l - z.loch.bis) / L), q1 = Math.ceil((g.r - z.loch.von) / L);
      for (var q = q0; q <= q1; q++) {
        var a = z.loch.von + q * L, e = z.loch.bis + q * L;
        var gg = c.createLinearGradient(0, gy(a - 2), 0, -260);
        gg.addColorStop(0, 'rgba(60,40,40,.1)'); gg.addColorStop(1, 'rgba(40,24,30,.75)');
        c.fillStyle = gg; c.fillRect(a, -262, e - a, gy(a - 2) + 262);
        c.fillStyle = 'rgba(246,199,124,.5)'; c.fillRect(a + (e - a) * 0.3, -170, 10, 14); c.fillRect(a + (e - a) * 0.6, -120, 10, 14);
        c.strokeStyle = 'rgba(43,39,34,.6)'; c.lineWidth = 1.4 * lw;
        c.beginPath(); c.moveTo(a, gy(a - 2)); c.lineTo(a, -262); c.moveTo(e, gy(e + 2)); c.lineTo(e, -262); c.stroke();
      }
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
        c.fillStyle = F.schatten;
        c.beginPath(); c.moveTo(a, r.boden); c.lineTo(e, r.boden); c.lineTo(e - h * 0.9, r.boden - 3); c.lineTo(a - h * 0.9, r.boden - 3); c.fill();
        if (r.art === 'kante') {
          var gr = c.createLinearGradient(0, r.y, 0, r.boden); gr.addColorStop(0, '#d6cfc3'); gr.addColorStop(1, '#b3aa9b');
          c.fillStyle = gr; c.fillRect(a, r.boden, e - a, h);
          c.fillStyle = '#efe9df'; c.fillRect(a - 2, r.y - 3, e - a + 4, 3);
          c.strokeStyle = '#2b2722'; c.lineWidth = 1.6 * lw; c.strokeRect(a, r.boden, e - a, h);
          c.strokeStyle = 'rgba(43,39,34,.2)'; c.beginPath(); for (var x = a + 42; x < e; x += 42) { c.moveTo(x, r.boden); c.lineTo(x, r.y - 3); } c.stroke();
          c.strokeStyle = '#6f6a61'; c.lineWidth = 2.2 * lw; c.beginPath(); c.moveTo(a - 2, r.y); c.lineTo(e + 2, r.y); c.stroke();
        } else {
          c.strokeStyle = '#2b2722'; c.lineWidth = Math.max(2 * lw, 1.6);
          c.beginPath();
          for (x = a + 8; x < e; x += Math.max(48, (e - a) / 5)) { c.moveTo(x, r.boden); c.lineTo(x, r.y); }
          c.moveTo(e - 6, r.boden); c.lineTo(e - 6, r.y);
          c.stroke();
          c.lineWidth = 3.2; c.beginPath(); c.moveTo(a, r.y); c.lineTo(e, r.y); c.stroke();
          c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(a + 2, r.y + 0.8); c.lineTo(e - 2, r.y + 0.8); c.stroke();
        }
      }
    });
  }
  function deko(c, g) {
    var lw = 1 / k, T = '#2b2722';
    gel.deko.forEach(function (d) {
      var q0 = Math.floor((g.l - d.x - 260) / L), q1 = Math.ceil((g.r - d.x + 260) / L);
      for (var q = q0; q <= q1; q++) {
        var x = d.x + q * L, y = d.y;
        c.lineWidth = 1.6 * lw; c.strokeStyle = T; c.lineCap = 'round'; c.lineJoin = 'round';
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
  function teilchenMalen(c, art) {
    var lw = 1 / k;
    if (art === 'funke') c.globalCompositeOperation = 'lighter';
    teilchen.forEach(function (p) {
      if (p.art !== art) return;
      var a = Math.max(0, 1 - p.t / p.max);
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
    var o = { aus: aus, lw: lw, kurbel: b.kurbel, druck: b.druck, v: tempo, zeit: zeit, jubel: b.jubel > 0 || (b.st === 'luft' && b.luft && b.luft.t > 0.25), augen: b.st === 'sturz' ? 0 : 1 };
    var carlWeg = b.st === 'sturz';
    if (!carlWeg) fahrerTeil(c, 'hinten', o);
    zeichneRad(c, { tinte: tinte, papier: papier, aus: aus, rad: b.rad, kurbel: b.kurbel, lw: lw, druck: b.druck });
    // Glanz auf dem Rahmen
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 0.7 * lw; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-6, 26.4 - b.druck * 2.5); c.lineTo(12.6, 29.6 - b.druck * 2.5); c.stroke();
    if (!carlWeg) fahrerTeil(c, 'vorn', o);
    c.restore();
    c.globalAlpha = 1;
    // Carl purzelt beim Sturz vom Rad und rappelt sich auf
    if (carlWeg) {
      var t = Math.min(1, b.sturz / 0.75), px = b.x + b.f * (10 + t * 46), py = gy(px) + 12 + Math.sin(Math.PI * Math.min(1, t * 1.2)) * 26;
      c.save(); c.translate(px, py - 30); c.rotate(-b.f * t * 5.5); c.scale(b.f, 1); c.translate(0, -16);
      fahrerTeil(c, 'vorn', { aus: aus, lw: lw, kurbel: 1.5, druck: 0.4, v: 0, zeit: zeit, augen: 0 });
      c.restore();
    }
  }
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
    _schritt: function (n, eing) { eing = eing || {}; eingabe.r = !!eing.treten; for (var i = 0; i < n; i++) schritt(DT); return b; },
    _hopp: function (kraft) { los(); hopp(kraft || 1); }, _gel: function () { return gel; },
    _salto: function (r) { if (b.st === 'luft') { b.spin += (r || 1) * ZWEIPI; } }, _drehe: function () { drehe(); },
    _setze: function (o) { if (o.rest != null) { rest = o.rest; laufAn = true; delete o.rest; } for (var q in o) b[q] = o[q]; if (o.x != null) { b.y = gy(b.x); b.s = sVon(b.x); cam.x = b.x; cam.y = b.y + 34; } }
  };
})();
