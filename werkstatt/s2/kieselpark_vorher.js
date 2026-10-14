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
  var g = { p: [y0], zonen: [], rails: [], deko: [], y: y0 };
  g.x = function () { return (this.p.length - 1) * STEP; };
  g.kurve = function (len, f) { var y0 = this.y, n = Math.max(1, Math.round(len / STEP)); for (var i = 1; i <= n; i++) this.p.push(y0 + f(i / n)); this.y = this.p[this.p.length - 1]; return this; };
  g.flach = function (len) { return this.kurve(len, function () { return 0; }); };
  g.s = function (len, h) { return this.kurve(len, function (t) { return h * (1 - Math.cos(Math.PI * t)) / 2; }); };
  g.kicker = function (len, h, rueck) { this.kurve(len, function (t) { return h * Math.pow(t, 2.1); }); if (rueck) this.s(rueck, -h); return this; };
  g.viertelHoch = function (R) { var c = 0.985; return this.kurve(R * c, function (t) { return R * (1 - Math.sqrt(1 - Math.pow(t * c, 2))); }); };
  g.viertelRunter = function (R) { var c = 0.985, h = R * (1 - Math.sqrt(1 - c * c)); return this.kurve(R * c, function (t) { return -h + R * (1 - Math.sqrt(1 - Math.pow((1 - t) * c, 2))); }); };
  g.loch = function (w, tief) { var y0 = this.y; this.p.push(y0 - tief); var n = Math.round(w / STEP); for (var i = 1; i < n; i++) this.p.push(y0 - tief); this.p.push(y0); this.y = y0; return this; };
  g.rail = function (len, h) { var x = this.x(); this.rails.push({ x1: x, x2: x + len, y1: this.y + h, y2: this.y + h }); return this; };
  g.zone = function (z) { this.zonen.push(z); return this; };
  g.deko_ = function (art, extra) { var d = { art: art, x: this.x(), y: this.y }; for (var k in extra) d[k] = extra[k]; this.deko.push(d); return this; };
  return g;
}

var PARKS = {
  hof: {
    name: 'Hof', unter: 'zwischen den Häusern', nacht: false, kappe: 380,
    bau: function () {
      var g = Bau(0);
      g.flach(240).deko_('baum').flach(60);
      var k1 = g.x(); g.kicker(70, 34, 18);
      g.flach(230);
      var kv = g.x(); g.kicker(84, 42); var ktop = g.x(); g.deko_('kiste', { w: 170, h: 42 }); g.flach(170); var kend = g.x(); g.s(96, -42);
      g.zone({ id: 'kiste', von: kv + 30, bis: ktop + 4, ueber: kend - 24 });
      g.flach(170).deko_('leine').flach(30);
      g.rail(190, 24).flach(190);
      g.flach(200);
      g.s(70, 30).flach(40).s(70, -30);
      g.flach(200);
      g.kicker(62, 28, 16);
      g.flach(250);
      return g;
    },
    ch: [
      { id: 'drei', text: 'Drei Sprünge in einer Fahrt', lohn: 'reifen:ziegel', m: 3 },
      { id: 'kiste', text: 'Über die ganze Kiste', lohn: 'band:kirsch', m: 3 },
      { id: 'salto', text: 'Einen Salto landen', lohn: 'klingel:gelb', m: 4 }
    ]
  },
  dach: {
    name: 'Dachpark', unter: 'über der Stadt', nacht: false, abend: true, kappe: 400,
    bau: function () {
      var g = Bau(0);
      g.flach(260).deko_('kamin').flach(120);
      var kv = g.x(); g.kicker(76, 32); var lip = g.x();
      g.loch(124, 260); var lend = g.x();
      g.zone({ id: 'luecke', von: kv + 20, bis: lip + 4, ueber: lend + 2, loch: { von: lip, bis: lend, zurueck: kv - 260 } });
      g.s(40, -12).flach(200).deko_('antenne').flach(40);
      g.rail(300, 30).flach(300);
      g.flach(150);
      g.s(90, 40).flach(150).deko_('kamin').flach(60);
      g.kicker(64, 28, 16);
      g.flach(180);
      g.s(130, -28);
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
    name: 'Halfpipe', unter: 'unterm Sternenhimmel', nacht: true, kappe: 740,
    bau: function () {
      var g = Bau(190);
      g.flach(110);
      g.viertelRunter(230);
      g.flach(380);
      g.viertelHoch(230);
      g.flach(110);
      return g;
    },
    start: 110 + 226 + 190,
    kante: 190,
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
  var G = 980, PED = 540, HOP = 330, DT = 1 / 120;
  var ebene, cv, cx, ui = {}, W = 0, H = 0, dpr = 1, k = 1, raf = 0, tLetzt = 0, acc = 0;
  var lauf = false, pause = true, parkId = 'hof', P = null, gel = null, L = 1, zeit = 0;
  var b = null, cam = { x: 0, y: 0 }, teilchen = [], hinweisAn = false, punkte = 0, aus = null;
  var fahrt = { lufte: 0 }, eingabe = { treten: false, bremsen: false, zeiger: {} };
  var farben = {};
  var sterne = [];

  function mod(x) { return ((x % L) + L) % L; }
  function gy(x) {
    var xm = mod(x) / STEP, i = Math.floor(xm), f = xm - i, p = gel.p;
    var a = p[i], c = p[Math.min(p.length - 1, i + 1)];
    return a + (c - a) * f;
  }
  function ga(x) { return Math.atan2(gy(x + 3) - gy(x - 3), 6); }
  function wd(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }

  function neuesRad(x) {
    var y = gy(x);
    b = { x: x, y: y, v: 0, vx: 0, vy: 0, st: 'boden', f: 1, th: ga(x), basis: ga(x), spin: 0, spinZiel: 0, dreh: 0, drehAn: false, dreher: 0, wende: 0,
      rad: 0, kurbel: 0, druck: 0, luft: null, sturz: 0, rail: null, zielW: 0, zielT: 0, nachSturz: 0 };
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
      '<div class="c6s-park-kopf" aria-live="off"><span class="c6s-park-name"></span><span class="c6s-park-punkte"></span></div>' +
      '<div class="c6s-park-trick" aria-live="polite"></div>' +
      '<div class="c6s-park-geschafft" aria-live="polite" hidden></div>' +
      '<div class="c6s-park-hilfe" aria-hidden="true"></div>' +
      '<div class="c6s-park-karte" hidden>' +
      '  <div class="c6s-park-karte-kopf"><p class="c6s-park-titel">Kieselpark</p><p class="c6s-park-satz">Während ich arbeite, fährst du.</p></div>' +
      '  <button type="button" class="c6s-knopf c6s-park-weiter" hidden>Weiter fahren</button>' +
      '  <div class="c6s-park-reihe" role="list"></div>' +
      '  <div class="c6s-park-rad"><canvas class="c6s-park-vorschau" aria-hidden="true"></canvas><div class="c6s-park-teile"></div></div>' +
      '</div>';
    document.body.appendChild(ebene);
    cv = ebene.querySelector('.c6s-park-cv'); cx = cv.getContext('2d');
    ['kopf', 'name', 'punkte', 'trick', 'geschafft', 'hilfe', 'karte', 'weiter', 'reihe', 'teile', 'vorschau', 'satz'].forEach(function (n) { ui[n] = ebene.querySelector('.c6s-park-' + n); });
    ebene.querySelector('.c6s-park-zu').onclick = function () { C6.kieselpark.zu(); };
    ebene.querySelector('.c6s-park-pause').onclick = function () { pause ? (P ? weiter() : 0) : zeigeKarte(true); };
    ui.weiter.onclick = function () { weiter(); };
    // Parks als Karten nebeneinander
    REIHE.forEach(function (id) {
      var p = PARKS[id];
      var a = document.createElement('div');
      a.className = 'c6s-park-wahl' + (p.nacht ? ' c6s-nachtkarte' : '');
      a.setAttribute('role', 'listitem');
      a.dataset.park = id;
      a.innerHTML = '<div class="c6s-park-bild" aria-hidden="true">' + parkBild(id) + '</div>' +
        '<p class="c6s-park-wahl-name">' + p.name + '</p><p class="c6s-park-wahl-unter">' + p.unter + '</p>' +
        '<ul class="c6s-park-ch">' + p.ch.map(function (c) { return '<li data-ch="' + c.id + '"><span class="c6s-haken" aria-hidden="true"></span><span>' + c.text + '</span></li>'; }).join('') + '</ul>' +
        '<button type="button" class="c6s-knopf c6s-park-los">Hier fahren</button>';
      a.querySelector('.c6s-park-los').onclick = function () { starte(id); };
      ui.reihe.appendChild(a);
    });
    // Eingaben
    cv.addEventListener('pointerdown', zeigerAb);
    cv.addEventListener('pointermove', zeigerZieh);
    cv.addEventListener('pointerup', zeigerAuf);
    cv.addEventListener('pointercancel', zeigerAuf);
    ebene.addEventListener('touchmove', function (e) { if (e.target === cv) e.preventDefault(); }, { passive: false });
    ebene.addEventListener('contextmenu', function (e) { if (e.target === cv) e.preventDefault(); });
  }

  function parkBild(id) {
    var t = '#2b2722', s = 'stroke="' + t + '" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    if (id === 'hof') return '<svg viewBox="0 0 120 60" width="120" height="60"><path ' + s + ' d="M4 52h112"/><path ' + s + ' d="M10 52V18h26v34M18 26h4M28 26h4M18 36h4M28 36h4"/><path ' + s + ' d="M48 52c10 0 16-8 22-16h22v16"/><path ' + s + ' d="M100 52V42M108 52V42M96 42h16"/><circle cx="98" cy="14" r="7" ' + s + '/></svg>';
    if (id === 'dach') return '<svg viewBox="0 0 120 60" width="120" height="60"><path ' + s + ' d="M4 34h40c8 0 12-5 14-9M66 34h50M4 34v22M58 25v31M66 34v22M116 34v22"/><path ' + s + ' d="M20 34V22h8v12M88 34V16M84 20h8"/><path ' + s + ' d="M76 28h30M78 28v6M104 28v6"/></svg>';
    return '<svg viewBox="0 0 120 60" width="120" height="60"><path stroke="#eef0ff" stroke-width="2" fill="none" stroke-linecap="round" d="M6 14h10c0 20 6 36 22 38h44c16-2 22-18 22-38h10"/><circle cx="60" cy="16" r="2" fill="#eef0ff"/><circle cx="34" cy="10" r="1.4" fill="#eef0ff"/><circle cx="88" cy="22" r="1.4" fill="#eef0ff"/><path stroke="#eef0ff" stroke-width="2" fill="none" d="M96 6a7 7 0 1 0 6 10 6 6 0 0 1-6-10z"/></svg>';
  }

  function zeigeKarte(alsPause) {
    pause = true; eingabe.treten = false; eingabe.bremsen = false; eingabe.zeiger = {};
    ui.weiter.hidden = !(alsPause && P);
    ui.satz.textContent = alsPause && P ? (P.name + ' · ' + punkte + ' Punkte') : 'Während ich arbeite, fährst du.';
    aktualisiereKarte();
    ui.karte.hidden = false;
    ebene.classList.add('c6s-karte-auf');
    setTimeout(function () { try { (ui.weiter.hidden ? ui.reihe.querySelector('.c6s-park-wahl[data-park="' + parkId + '"] .c6s-park-los') : ui.weiter).focus({ preventScroll: true }); } catch (e) {} }, 30);
    var w = ui.reihe.querySelector('[data-park="' + parkId + '"]');
    if (w) ui.reihe.scrollLeft = Math.max(0, w.offsetLeft - 16);
    if (!raf) { zeichne(); }
  }
  function weiter() {
    ui.karte.hidden = true; ebene.classList.remove('c6s-karte-auf');
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
    });
    // Teile wählen
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
    // Gesperrte zeigen, wo es sie gibt
    REIHE.forEach(function (pid) { PARKS[pid].ch.forEach(function (c) {
      var p = c.lohn.split(':'), bt = ui.teile.querySelector('.c6s-chip[data-art="' + p[0] + '"][data-id="' + p[1] + '"]');
      if (bt && bt.disabled) bt.title = PARKS[pid].name + ': ' + c.text;
    }); });
    aus = ausstattung();
    vorschau();
  }
  function vorschau() {
    var c = ui.vorschau, w = 132, h = 72, d = Math.min(3, window.devicePixelRatio || 1);
    c.width = w * d; c.height = h * d; c.style.width = w + 'px'; c.style.height = h + 'px';
    var x = c.getContext('2d');
    x.setTransform(d * 2, 0, 0, -d * 2, d * w / 2, d * (h - 6));
    x.clearRect(-100, -100, 300, 300);
    zeichneRad(x, { tinte: '#2b2722', papier: '#fbf7f0', aus: aus || ausstattung(), rad: 0.3, kurbel: 0.8, lw: 0.5 });
  }

  // ----- Start eines Parks -----
  function starte(id) {
    parkId = id; P = PARKS[id]; gel = P.bau(); L = (gel.p.length - 1) * STEP;
    farben = P.nacht ? { papier: '#141a33', karte: '#1d2445', tinte: '#eef0ff', leise: '#aab2dc', boden: '#1d2445', strich: '#3a4370' }
      : P.abend ? { papier: '#f3e8da', karte: '#fbf7f0', tinte: '#2b2722', leise: '#6f6a61', boden: '#e9dccb', strich: '#d8cfc0' }
      : { papier: '#f4eee4', karte: '#fbf7f0', tinte: '#2b2722', leise: '#6f6a61', boden: '#ebe3d5', strich: '#d8cfc0' };
    ebene.classList.toggle('c6s-nacht', !!P.nacht);
    neuesRad(P.start || 120);
    cam.x = b.x; cam.y = b.y + 40;
    punkte = 0; fahrt = { lufte: 0 }; teilchen = [];
    aus = ausstattung();
    ui.name.textContent = P.name;
    ui.punkte.textContent = '';
    sterne = [];
    for (var i = 0; i < 120; i++) sterne.push({ x: Math.random(), y: Math.random(), r: Math.random() < .12 ? 1.7 : .9, p: Math.random() * 6 });
    hilfe(true);
    weiter();
  }
  function hilfe(an) {
    hinweisAn = an;
    if (an) {
      var touch = C6.geraet === 'iphone' || matchMedia('(pointer: coarse)').matches;
      ui.hilfe.innerHTML = touch
        ? '<span class="c6s-h-rechts">rechts halten: treten</span><span class="c6s-h-hoch">nach oben wischen: springen</span><span class="c6s-h-luft">in der Luft wischen: drehen</span>'
        : '<span>→ treten · ← bremsen</span><span>↑ oder Leertaste: springen</span><span>in der Luft ← → ↓: drehen</span>';
      ui.hilfe.classList.remove('c6s-weg');
    } else ui.hilfe.classList.add('c6s-weg');
  }

  // ----- Eingaben -----
  function zeigerAb(e) {
    if (pause) return;
    e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    var r = cv.getBoundingClientRect();
    var z = { x: e.clientX, y: e.clientY, t: performance.now(), spur: [{ x: e.clientX, y: e.clientY, t: performance.now() }], rechts: (e.clientX - r.left) > r.width / 2, sperre: 0 };
    eingabe.zeiger[e.pointerId] = z;
    erneuereTreten();
  }
  function zeigerZieh(e) {
    var z = eingabe.zeiger[e.pointerId]; if (!z || pause) return;
    var t = performance.now();
    z.spur.push({ x: e.clientX, y: e.clientY, t: t });
    while (z.spur.length > 2 && t - z.spur[0].t > 240) z.spur.shift();
    if (t < z.sperre) return;
    var a = z.spur[0], dx = e.clientX - a.x, dy = e.clientY - a.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d > 26) {
      var r = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'rechts' : 'links') : (dy < 0 ? 'hoch' : 'runter');
      z.spur = [{ x: e.clientX, y: e.clientY, t: t }];
      if (r === z.letzte) return;
      wisch(r); z.letzte = r;
      z.sperre = t + 90;
    }
  }
  function zeigerAuf(e) { delete eingabe.zeiger[e.pointerId]; erneuereTreten(); }
  function erneuereTreten() {
    var t = false; for (var id in eingabe.zeiger) if (eingabe.zeiger[id].rechts) t = true;
    eingabe.tretenTouch = t;
  }
  function wisch(r) {
    if (r === 'hoch') return hopp();
    if (b.st === 'luft') {
      if (r === 'links') return salto(1);
      if (r === 'rechts') return salto(-1);
      if (r === 'runter') return drehe();
    }
  }
  function taste(e) {
    if (!C6.kieselpark.offen) return;
    var k = e.key, ab = e.type === 'keydown';
    if (k === 'Escape' && ab) { e.preventDefault(); e.stopImmediatePropagation(); C6.kieselpark.zu(); return; }
    if (pause) {
      if ((k === 'p' || k === 'P') && ab && P) { e.preventDefault(); weiter(); }
      return;
    }
    var nimm = true;
    if (k === 'ArrowRight' || k === 'd') { eingabe.treten = ab; if (ab && !e.repeat && b.st === 'luft') salto(-1); }
    else if (k === 'ArrowLeft' || k === 'a') { eingabe.bremsen = ab; if (ab && !e.repeat && b.st === 'luft') salto(1); }
    else if (k === 'ArrowUp' || k === ' ' || k === 'w') { if (ab && !e.repeat) hopp(); }
    else if (k === 'ArrowDown' || k === 's') { if (ab && !e.repeat && b.st === 'luft') drehe(); }
    else if ((k === 'p' || k === 'P') && ab) zeigeKarte(true);
    else nimm = false;
    if (nimm) { e.preventDefault(); e.stopImmediatePropagation(); }
  }

  function hopp() {
    if (hinweisAn) hilfe(false);
    if (b.st !== 'boden' && b.st !== 'rail') return;
    var a = b.st === 'rail' ? b.rail.a : ga(b.x);
    var vx = b.v * Math.cos(a), vy = b.v * Math.sin(a);
    var nx = -Math.sin(a), ny = Math.cos(a);
    abheben(vx + nx * HOP * 0.12, vy + Math.max(0.75, ny) * HOP, a);
    b.y += 1;
  }
  function salto(richtung) {
    if (b.st !== 'luft') return;
    if (hinweisAn) hilfe(false);
    var rest = b.spinZiel - b.spin;
    if (Math.abs(rest) > Math.PI * 1.2 && Math.sign(rest) === richtung) return; // höchstens einer in der Schlange
    b.spinZiel += richtung * Math.PI * 2;
  }
  function drehe() { if (b.st !== 'luft' || b.drehAn) return; b.drehAn = true; b.dreh = 0; }

  // ----- Physik -----
  function abheben(vx, vy, a) {
    var steil = Math.abs(a) > 1.1;
    b.st = 'luft'; b.vx = vx; b.vy = vy;
    if (steil && P.kante != null) { b.vx = -Math.sign(vx || 1) * Math.min(Math.abs(vx), 34); } // an der Kante zurück in die Rampe
    b.basis = a; b.spin = 0; b.spinZiel = 0; b.dreh = 0; b.drehAn = false; b.dreher = 0;
    b.luft = { t: 0, x0: b.x, xm0: mod(b.x), maxY: b.y, salti: 0 };
    b.zielT = 0;
  }
  function landePunkt() {
    var x = b.x, y = b.y, vx = b.vx, vy = b.vy, h = 1 / 30;
    for (var i = 0; i < 90; i++) { vy -= G * h; x += vx * h; y += vy * h; if (y <= gy(x)) return x; }
    return x;
  }
  function schritt(dt) {
    var treten = eingabe.treten || eingabe.tretenTouch;
    if (treten && hinweisAn && zeit > 3) hilfe(false);
    b.druck = Math.max(0, b.druck - dt * 5);
    if (b.wende) { b.wende = Math.min(1, b.wende + dt / 0.28); if (b.wende >= 1) { b.wende = 0; b.f = -b.f; } }
    if (b.st === 'boden') {
      var a = b.v >= 0 ? Math.atan2(gy(b.x) - gy(b.x - 5), 5) : Math.atan2(gy(b.x + 5) - gy(b.x), 5);
      b.v += -G * Math.sin(a) * dt;
      if (treten && b.v * b.f < P.kappe && !b.wende && Math.abs(a) < 0.45) { b.v += b.f * PED * dt; b.kurbel += dt * 9; }
      if (eingabe.bremsen) b.v -= b.v * 2.6 * dt;
      b.v -= b.v * 0.1 * dt + Math.sign(b.v) * 4 * dt;
      if (Math.abs(b.v) < 2 && !treten) b.v = 0;
      var vx = b.v * Math.cos(a), vy = b.v * Math.sin(a);
      var nx = b.x + vx * dt, ny = gy(nx);
      var yb = b.y + vy * dt - 0.5 * G * dt * dt;
      if (ny < yb - 0.35 && Math.abs(b.v) > 70) { b.x = nx; b.y = yb; abheben(vx, vy, a); }
      else { b.x = nx; b.y = ny; }
      b.th = ga(b.x); b.basis = b.th;
      b.rad -= (vx * dt) / 11;
      if (b.y < -30) { var lz2 = lochZone(); if (lz2) { sturz(lz2); return; } }
      if (b.v * b.f < -10 && !b.wende && parkId === 'pipe') b.wende = 0.001;
      fahrtStill(dt);
    } else if (b.st === 'luft') {
      var L0 = b.luft; L0.t += dt;
      b.vy -= G * dt;
      var py = b.y;
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.y > L0.maxY) L0.maxY = b.y;
      // Wende in der Luft (Halfpipe)
      if (parkId === 'pipe' && Math.sign(b.vx) !== b.f && Math.abs(b.vx) > 12 && !b.wende) b.wende = 0.001;
      // Salto
      var rest = b.spinZiel - b.spin, w = Math.PI * 2 / 0.46 * dt;
      if (Math.abs(rest) <= w) b.spin = b.spinZiel; else b.spin += Math.sign(rest) * w;
      if (b.drehAn) { b.dreh += dt / 0.42; if (b.dreh >= 1) { b.dreh = 0; b.drehAn = false; b.dreher++; } }
      // Ausrichten zur Landung
      b.zielT -= dt; if (b.zielT <= 0) { b.zielW = ga(landePunkt()); b.zielT = 0.08; }
      b.basis += wd(b.zielW - b.basis) * Math.min(1, 3.2 * dt);
      b.th = b.basis + b.spin;
      b.rad -= (b.vx * dt) / 11 * 0.6;
      // Loch (Dachpark)
      var z = lochZone(); if (z && b.y < gy(b.x) - 1 && b.y < -40) { sturz(z); return; }
      // Geländer
      if (b.vy < 0) {
        var xm = mod(b.x);
        for (var i = 0; i < gel.rails.length; i++) {
          var r = gel.rails[i];
          if (xm >= r.x1 && xm <= r.x2) {
            var ry = r.y1 + (r.y2 - r.y1) * (xm - r.x1) / (r.x2 - r.x1), ra = Math.atan2(r.y2 - r.y1, r.x2 - r.x1);
            if (py >= ry - 0.5 && b.y <= ry + 0.5 && Math.abs(wd(b.th - ra)) < 0.7 && Math.abs(b.spinZiel - b.spin) < 0.6 && !b.drehAn) {
              b.spin = b.spinZiel;
              b.st = 'rail'; b.y = ry; b.v = b.vx * Math.cos(ra) + b.vy * Math.sin(ra);
              if (Math.sign(b.v) !== b.f && Math.abs(b.v) > 5) b.v = b.f * Math.abs(b.v);
              b.rail = { r: r, a: ra, start: (b.f > 0 ? (xm - r.x1) : (r.x2 - xm)) / (r.x2 - r.x1), lap: Math.floor(b.x / L) };
              b.th = ra; b.basis = ra;
              landungWertung(true);
              return;
            }
          }
        }
      }
      var g0 = gy(b.x);
      if (b.y <= g0) { b.y = g0; landung(); }
    } else if (b.st === 'rail') {
      var R = b.rail, ra2 = R.a;
      b.v += -G * Math.sin(ra2) * dt;
      b.v -= b.v * 0.22 * dt;
      b.x += b.v * Math.cos(ra2) * dt;
      var xm2 = b.x - Math.floor(b.x / L) * L + (Math.floor(b.x / L) - Math.floor(b.x / L)) * 0; xm2 = mod(b.x);
      var r2 = R.r;
      if (Math.random() < 0.5) funke();
      punkte += Math.abs(b.v) * dt * 0.12;
      if (xm2 < r2.x1 || xm2 > r2.x2 || Math.abs(b.v) < 6) {
        var ganz = R.start < 0.4 && ((b.v > 0 && xm2 > r2.x2) || (b.v < 0 && xm2 < r2.x1));
        if (ganz) ereignis({ art: 'rail' });
        abheben(b.v * Math.cos(ra2), b.v * Math.sin(ra2) + 30, ra2);
      } else b.y = r2.y1 + (r2.y2 - r2.y1) * (xm2 - r2.x1) / (r2.x2 - r2.x1);
    } else if (b.st === 'sturz') {
      b.sturz += dt;
      var a3 = ga(b.x);
      b.v -= b.v * 3 * dt;
      if (!b.zurueck) { b.x += b.v * Math.cos(a3) * dt; b.y = gy(b.x); }
      var p = Math.min(1, b.sturz / 0.28);
      b.th = a3 + b.f * -1.25 * (1 - Math.pow(1 - p, 3));
      if (b.sturz > 0.85) {
        if (b.zurueck != null) { b.x = b.zurueck; b.y = gy(b.x); b.v = b.f * 140; b.zurueck = null; }
        b.st = 'boden'; b.th = ga(b.x); b.basis = b.th; b.spin = b.spinZiel = 0; b.dreh = 0; b.drehAn = false;
        b.v = b.f * Math.max(60, Math.abs(b.v));
        b.nachSturz = 0.5;
      }
    }
  }
  var still = 0;
  function fahrtStill(dt) {
    if (Math.abs(b.v) < 8) { still += dt; if (still > 1.6 && fahrt.lufte) { fahrt = { lufte: 0 }; } } else still = 0;
  }
  function lochZone() {
    var xm = mod(b.x);
    for (var i = 0; i < gel.zonen.length; i++) { var z = gel.zonen[i]; if (z.loch && xm >= z.loch.von - 2 && xm <= z.loch.bis + 2) return z; }
    return null;
  }
  function landung() {
    var lz = lochZone(); if (lz) { sturz(lz); return; }
    var a = ga(b.x);
    var rest = b.spinZiel - b.spin;
    var ok = Math.abs(rest) < 0.95 && !(b.drehAn && b.dreh > 0.22 && b.dreh < 0.78);
    if (ok) {
      b.spin = b.spinZiel; if (b.drehAn) { b.drehAn = false; b.dreh = 0; b.dreher++; }
      var diff = Math.abs(wd(b.basis - a));
      if (diff > 1.0) ok = false;
    }
    var vt = b.vx * Math.cos(a) + b.vy * Math.sin(a);
    var vn = -(b.vx * -Math.sin(a) + b.vy * Math.cos(a));
    b.druck = Math.min(1, Math.max(0, vn / 520));
    staub(b.x, b.y, Math.min(1, vn / 500));
    if (!ok) { b.v = vt; sturz(null); return; }
    if (parkId !== 'pipe' && vt * b.f < 60) vt = b.f * 60;
    b.st = 'boden'; b.v = vt; b.th = a; b.basis = a;
    if (b.v * b.f < -10 && !b.wende && parkId === 'pipe') b.wende = 0.001;
    landungWertung(false, Math.abs(rest) > 0.45);
  }
  function landungWertung(aufRail, wackel) {
    var L0 = b.luft; if (!L0) return;
    var salti = Math.round(Math.abs(b.spinZiel) / (Math.PI * 2));
    var rueck = salti && (Math.sign(b.spinZiel) * b.f > 0);
    var dreher = b.dreher;
    if (L0.t < 0.22 && !salti && !dreher) { b.luft = null; return; }
    var pk = 10 + Math.round(L0.t * 30) + salti * 60 + dreher * 45 + (salti >= 2 ? 120 : 0);
    if (wackel) pk = Math.round(pk / 2);
    punkte += pk;
    var name = [];
    if (salti === 1) name.push(rueck ? 'Rückwärtssalto' : 'Salto');
    if (salti === 2) name.push('Doppelsalto');
    if (salti > 2) name.push(salti + '-fach Salto');
    if (dreher === 1) name.push('Dreher'); else if (dreher > 1) name.push(dreher + '× Dreher');
    if (!name.length) name.push(L0.t > 0.7 ? 'Weit' : 'Sprung');
    trick(name.join(' + ') + (wackel ? ' · wacklig' : '') + '  +' + pk);
    if (salti || dreher) fahrt.tricks = (fahrt.tricks || 0) + 1;
    if (!aufRail) {
      fahrt.lufte++;
      ereignis({ art: 'landung', salti: salti, dreher: dreher, t: L0.t, x0: L0.x0, xm0: L0.xm0, x1: b.x, maxY: L0.maxY, wackel: wackel });
    } else {
      fahrt.lufte++;
      ereignis({ art: 'landung', salti: salti, dreher: dreher, t: L0.t, x0: L0.x0, xm0: L0.xm0, x1: b.x, maxY: L0.maxY, rail: true });
    }
    b.luft = null;
    b.dreher = 0;
  }
  function sturz(zone) {
    b.st = 'sturz'; b.sturz = 0; b.luft = null; b.drehAn = false;
    b.zurueck = zone ? zone.loch.zurueck + Math.floor(b.x / L) * L : null;
    if (zone) { b.y = Math.max(b.y, -40); }
    fahrt = { lufte: 0 };
    trick(zone ? 'Fast. Nochmal.' : 'Hoppla.');
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
    if (punkte) {
      ui.punkte.textContent = Math.round(punkte) + ' Punkte';
    }
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
    setTimeout(function () { ui.geschafft.classList.add('c6s-weg'); setTimeout(naechsteMeldung, 380); }, 2600);
  }
  var trickZeit = 0;
  function trick(t) {
    ui.trick.textContent = t;
    ui.trick.classList.remove('c6s-weg');
    if (!ruhig()) { try { ui.trick.animate([{ transform: 'translate(-50%,6px) scale(.92)', opacity: 0 }, { transform: 'translate(-50%,0) scale(1)', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {} }
    trickZeit = zeit + 1.4;
  }

  // ----- Teilchen (ohne Wackeln des Bildes) -----
  function staub(x, y, s) {
    if (s < 0.15) return;
    for (var i = 0; i < 5; i++) teilchen.push({ x: x + (Math.random() - .5) * 30, y: y + 2, vx: (Math.random() - .5) * 60, vy: 20 + Math.random() * 30, r: 2 + Math.random() * 3 * s, t: 0, max: 0.5 + Math.random() * .3, art: 'staub' });
  }
  function funke() { teilchen.push({ x: b.x - b.f * 12, y: b.y, vx: -b.v * 0.2 + (Math.random() - .5) * 40, vy: 20 + Math.random() * 50, r: 2.5, t: 0, max: 0.3, art: 'funke' }); }

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
      for (var i = teilchen.length - 1; i >= 0; i--) { var p = teilchen[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= 120 * dt; if (p.t > p.max) teilchen.splice(i, 1); }
      // Kamera folgt weich
      var vor = b.f * Math.min(W / k * 0.16, 120);
      cam.x += (b.x + vor - cam.x) * Math.min(1, dt * 3.2);
      var zy = parkId === 'pipe' ? 90 + (b.y - 90) * 0.55 : b.y + 30;
      cam.y += (zy - cam.y) * Math.min(1, dt * (b.st === 'luft' ? 1.8 : 3));
      if (zeit > trickZeit && trickZeit) { ui.trick.classList.add('c6s-weg'); trickZeit = 0; }
      if (punkte) ui.punkte.textContent = Math.round(punkte) + ' Punkte';
    }
    zeichne();
    if (!pause) raf = requestAnimationFrame(schleife);
  }

  function zeichne() {
    if (!P || !b) return;
    var c = cx, F = farben;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = F.papier; c.fillRect(0, 0, W, H);
    // Himmel
    if (P.nacht) {
      sterne.forEach(function (s) {
        c.globalAlpha = ruhig() ? .7 : .45 + .35 * Math.sin(zeit * 1.1 + s.p);
        c.fillStyle = F.tinte;
        var x = (((s.x * W * 1.6) - cam.x * k * 0.08) % W + W) % W;
        c.beginPath(); c.arc(x, s.y * H * 0.7, s.r, 0, 7); c.fill();
      });
      c.globalAlpha = 1;
      c.strokeStyle = F.tinte; c.lineWidth = 2; c.fillStyle = F.karte;
      c.beginPath(); c.arc(W * 0.24, H * 0.16, 30, 0, 7); c.fill(); c.stroke();
      c.fillStyle = F.papier; c.beginPath(); c.arc(W * 0.24 + 13, H * 0.16 - 9, 26, 0, 7); c.fill();
    } else {
      c.strokeStyle = F.strich; c.lineWidth = 2;
      c.beginPath(); c.arc(W * 0.22, H * 0.16, P.abend ? 40 : 24, 0, 7); c.stroke();
    }
    var lw = 1 / k, oy = H * (W < H ? 0.6 : 0.62);
    c.setTransform(dpr * k, 0, 0, -dpr * k, dpr * (W / 2 - cam.x * k), dpr * (oy + cam.y * k));
    var xl = cam.x - W / 2 / k - 20, xr = cam.x + W / 2 / k + 20;
    var yUnten = cam.y - (H - oy) / k - 20;
    hintergrund(c, xl, xr, yUnten, lw);
    // Boden
    c.beginPath();
    var x0 = Math.floor(xl / STEP) * STEP;
    c.moveTo(x0, yUnten);
    for (var x = x0; x <= xr; x += STEP) c.lineTo(x, gy(x));
    c.lineTo(xr, yUnten); c.closePath();
    c.fillStyle = F.boden; c.fill();
    c.beginPath();
    for (x = x0; x <= xr; x += STEP) { var yy = gy(x); x === x0 ? c.moveTo(x, yy) : c.lineTo(x, yy); }
    c.strokeStyle = F.tinte; c.lineWidth = 2.4 * lw; c.lineJoin = 'round'; c.stroke();
    // Schraffur auf Rampen
    c.lineWidth = 1.2 * lw; c.strokeStyle = F.tinte; c.globalAlpha = .55;
    c.beginPath();
    for (x = Math.floor(xl / 9) * 9; x <= xr; x += 9) {
      var s1 = gy(x + 2) - gy(x - 2);
      if (Math.abs(s1) > 0.5 && Math.abs(s1) < 12) { var y1 = gy(x); c.moveTo(x, y1 - 3); c.lineTo(x - 7, y1 - 12); }
    }
    c.stroke(); c.globalAlpha = 1;
    // Bodentextur: Pflaster, Ziegel, Bretter
    c.strokeStyle = F.strich; c.lineWidth = 1.6 * lw; c.beginPath();
    var reihen = [26, 58, 94, 134];
    for (var ri = 0; ri < reihen.length; ri++) {
      var tief = reihen[ri], schritt = parkId === 'hof' ? 34 : parkId === 'dach' ? 46 : 60, ver = (ri % 2) * schritt / 2;
      for (x = Math.floor((xl - ver) / schritt) * schritt + ver; x <= xr; x += schritt) {
        var gy0 = gy(x) - tief;
        if (gy0 < yUnten) continue;
        if (Math.abs(gy(x + 8) - gy(x)) > 6) continue;
        if (parkId === 'hof') { c.moveTo(x - 9, gy0); c.quadraticCurveTo(x, gy0 + 5, x + 9, gy0); }
        else if (parkId === 'dach') { c.moveTo(x - 16, gy0); c.quadraticCurveTo(x, gy0 - 9, x + 16, gy0); }
        else { c.moveTo(x, gy0 + 6); c.lineTo(x, gy0 - 6); }
      }
    }
    c.stroke();
    // Geländer
    gel.rails.forEach(function (r) {
      var k0 = Math.floor((xl - r.x2) / L), k1 = Math.ceil((xr - r.x1) / L);
      for (var q = k0; q <= k1; q++) {
        var o = q * L;
        c.strokeStyle = F.tinte; c.lineWidth = 2.6 * lw;
        c.beginPath(); c.moveTo(r.x1 + o, r.y1); c.lineTo(r.x2 + o, r.y2); c.stroke();
        c.lineWidth = 1.8 * lw;
        c.beginPath();
        for (var px = r.x1 + 10; px < r.x2; px += Math.max(40, (r.x2 - r.x1) / 4)) { c.moveTo(px + o, r.y1); c.lineTo(px + o, gy(px + o)); }
        c.moveTo(r.x2 - 6 + o, r.y2); c.lineTo(r.x2 - 6 + o, gy(r.x2 - 6 + o));
        c.stroke();
      }
    });
    // Vordergrund-Deko
    deko(c, xl, xr, lw);
    // Teilchen
    teilchen.forEach(function (p) {
      var a = 1 - p.t / p.max;
      c.globalAlpha = Math.max(0, a);
      c.strokeStyle = F.tinte; c.lineWidth = 1.2 * lw;
      if (p.art === 'funke') { c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); c.stroke(); }
      else { c.beginPath(); c.arc(p.x, p.y, p.r * (1 + p.t * 2), 0, 7); c.stroke(); }
    });
    c.globalAlpha = 1;
    // Schatten unter dem Rad: folgt auf der Bahn, wird in der Luft kleiner und blasser;
    // die Sonne steht fest oben rechts, also fällt er nach links, im Sprung weiter weg
    (function () {
      var g0 = gy(b.x), hoch = Math.max(0, b.y - g0), w = Math.max(0.35, 1 - hoch / 260);
      var weg = -(5 + Math.min(60, hoch * 0.35));
      c.save(); c.translate(b.x, g0 + 0.5); c.rotate(ga(b.x));
      c.globalAlpha = 0.16 * Math.max(0.3, w);
      c.fillStyle = F.tinte;
      c.beginPath(); c.ellipse(weg, 0, 38 * w, 5 * w, 0, 0, 7); c.fill();
      c.restore(); c.globalAlpha = 1;
    })();
    // Rad
    c.save();
    c.translate(b.x, b.y);
    c.rotate(b.th);
    var sx = b.f;
    if (b.wende) sx = b.f * Math.cos(Math.PI * b.wende);
    if (b.drehAn) sx *= Math.cos(Math.PI * 2 * b.dreh);
    if (Math.abs(sx) < 0.06) sx = 0.06 * (sx < 0 ? -1 : 1);
    c.scale(sx, 1);
    if (b.st === 'sturz' && b.sturz > 0.6) c.globalAlpha = 1 - (b.sturz - 0.6) / 0.4 * 0.5;
    if (b.nachSturz > 0 && !ruhig()) c.globalAlpha = 0.55 + 0.45 * (Math.sin(zeit * 30) > 0 ? 1 : 0.3);
    zeichneRad(c, { tinte: F.tinte, papier: F.papier, aus: aus, rad: b.rad, kurbel: b.kurbel, lw: lw, druck: b.druck });
    c.restore();
    c.globalAlpha = 1;
  }

  function wieder(xl, xr, per, f) { var a = Math.floor(xl / per) - 1, e = Math.ceil(xr / per) + 1; for (var i = a; i <= e; i++) f(i * per); }
  function hintergrund(c, xl, xr, yU, lw) {
    var F = farben;
    c.save();
    // Parallaxe: Ebene bewegt sich halb so schnell
    var par = 0.5, cxp = cam.x * (1 - par);
    c.translate(cxp, cam.y * 0.4);
    var l2 = xl - cxp, r2 = xr - cxp;
    c.strokeStyle = F.strich; c.lineWidth = 2 * lw; c.lineJoin = 'round'; c.lineCap = 'round';
    if (parkId === 'hof') {
      wieder(l2, r2, 520, function (o) {
        c.beginPath();
        c.rect(o + 20, 0, 150, 190); c.rect(o + 200, 0, 120, 150); c.rect(o + 350, 0, 160, 220);
        for (var i = 0; i < 3; i++) for (var j = 0; j < 4; j++) { c.rect(o + 40 + i * 44, 30 + j * 40, 18, 24); }
        for (i = 0; i < 2; i++) for (j = 0; j < 3; j++) c.rect(o + 222 + i * 50, 30 + j * 38, 20, 22);
        for (i = 0; i < 3; i++) for (j = 0; j < 4; j++) c.rect(o + 372 + i * 48, 40 + j * 44, 20, 26);
        c.moveTo(o + 20, 190); c.lineTo(o + 95, 226); c.lineTo(o + 170, 190);
        c.stroke();
      });
    } else if (parkId === 'dach') {
      wieder(l2, r2, 460, function (o) {
        c.beginPath();
        var hs = [120, 170, 90, 210, 140];
        for (var i = 0; i < 5; i++) { var x = o + i * 92; c.moveTo(x, -60); c.lineTo(x, hs[i]); c.lineTo(x + 80, hs[i]); c.lineTo(x + 80, -60); c.moveTo(x + 54, hs[i]); c.lineTo(x + 54, hs[i] + 22); c.lineTo(x + 66, hs[i] + 22); c.lineTo(x + 66, hs[i]); }
        c.moveTo(o + 300, 210); c.lineTo(o + 300, 262); c.moveTo(o + 292, 246); c.lineTo(o + 308, 246);
        c.stroke();
      });
    } else {
      c.strokeStyle = F.strich;
      wieder(l2, r2, 700, function (o) {
        c.beginPath();
        for (var x = 0; x <= 720; x += 20) { var yy = 60 + 26 * Math.sin(x / 700 * Math.PI * 2) + 14 * Math.sin(x / 700 * Math.PI * 6); x ? c.lineTo(o + x, yy) : c.moveTo(o + x, yy); }
        c.stroke();
      });
    }
    c.restore();
  }
  function deko(c, xl, xr, lw) {
    var F = farben;
    c.strokeStyle = F.tinte; c.lineWidth = 1.8 * lw; c.lineCap = 'round'; c.lineJoin = 'round';
    gel.deko.forEach(function (d) {
      var k0 = Math.floor((xl - d.x - 200) / L), k1 = Math.ceil((xr - d.x + 200) / L);
      for (var q = k0; q <= k1; q++) {
        var x = d.x + q * L, y = d.y;
        c.beginPath();
        if (d.art === 'baum') {
          c.moveTo(x - 40, y); c.lineTo(x - 40, y + 70);
          c.moveTo(x - 40, y + 70); c.arc(x - 40, y + 92, 26, -Math.PI / 2, Math.PI * 1.5);
          c.moveTo(x - 52, y + 98); c.arc(x - 56, y + 98, 4, 0, 7);
        } else if (d.art === 'kiste') {
          c.moveTo(x + 6, y - d.h * 0.45); c.lineTo(x + d.w - 6, y - d.h * 0.45);
          c.moveTo(x + d.w * 0.5, y - 4); c.lineTo(x + d.w * 0.5, y - d.h * 0.45);
        } else if (d.art === 'leine') {
          c.moveTo(x - 60, y); c.lineTo(x - 60, y + 110); c.moveTo(x + 150, y); c.lineTo(x + 150, y + 110);
          c.moveTo(x - 60, y + 104); c.quadraticCurveTo(x + 45, y + 88, x + 150, y + 104);
          c.moveTo(x - 10, y + 97); c.lineTo(x - 10, y + 72); c.lineTo(x + 16, y + 72); c.lineTo(x + 16, y + 95);
          c.moveTo(x + 60, y + 95); c.lineTo(x + 56, y + 76); c.lineTo(x + 80, y + 76); c.lineTo(x + 78, y + 96);
        } else if (d.art === 'kamin') {
          c.rect(x - 30, y, 24, 46); c.moveTo(x - 34, y + 46); c.lineTo(x - 2, y + 46);
        } else if (d.art === 'antenne') {
          c.moveTo(x - 20, y); c.lineTo(x - 20, y + 80); c.moveTo(x - 36, y + 64); c.lineTo(x - 4, y + 64); c.moveTo(x - 32, y + 74); c.lineTo(x - 8, y + 74);
        }
        c.stroke();
      }
    });
  }

  function groesse() {
    if (!ebene) return;
    dpr = Math.min(3, window.devicePixelRatio || 1);
    W = ebene.clientWidth || innerWidth; H = ebene.clientHeight || innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    k = W < H ? Math.max(0.8, Math.min(W / 330, 1.6)) : Math.max(0.7, Math.min(W / 440, H / 420, 1.8));
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
      groesse();
      if (!P) { starteStill('hof'); }
      if (o.park && PARKS[o.park]) starte(o.park);
      else zeigeKarte(false);
      emit('spiel', { was: 'kieselpark', offen: true });
    },
    zu: function () {
      if (!this.offen) return;
      this.offen = false; lauf = false; pause = true;
      if (raf) cancelAnimationFrame(raf); raf = 0;
      eingabe.zeiger = {}; eingabe.treten = eingabe.bremsen = eingabe.tretenTouch = false;
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
    _zustand: function () { return { park: parkId, b: b, pause: pause, punkte: punkte, fahrt: fahrt, cam: cam, k: k }; },
    _schritt: function (n, eing) { eing = eing || {}; eingabe.treten = !!eing.treten; for (var i = 0; i < n; i++) schritt(DT); return b; },
    _hopp: function () { hopp(); }, _gel: function () { return gel; }, _salto: function (r) { salto(r); }, _drehe: function () { drehe(); }
  };
  function starteStill(id) {
    parkId = id; P = PARKS[id]; gel = P.bau(); L = (gel.p.length - 1) * STEP;
    farben = { papier: '#f4eee4', karte: '#fbf7f0', tinte: '#2b2722', leise: '#6f6a61', boden: '#ebe3d5', strich: '#d8cfc0' };
    neuesRad(120); cam.x = b.x; cam.y = b.y + 40; aus = ausstattung();
    ui.name.textContent = P.name;
  }
})();
