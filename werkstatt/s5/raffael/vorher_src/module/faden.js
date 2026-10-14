/* Carl 6 · Der Weg zurück: oben links ein Knopf „‹ wohin“ (eine Ebene höher, auch Esc).
   In Räumen der Leiste bleibt der Kopf leer; die Leiste zeigt, wo du bist. */
var C6 = window.C6;
if (!C6 || !C6.raum || !C6.kopf) return;
var D = document;

function mach(tag, cls, eltern, txt) {
  var e = D.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  if (eltern) eltern.appendChild(e);
  return e;
}
function R() { return C6.raeume || {}; }
function hoeheVon(id) { var d = R()[id]; return d && (d.hoehe === 'vogel' || d.hoehe === 'teleskop') ? d.hoehe : 'boden'; }
function ersterDerHoehe(h) { var k = Object.keys(R()).filter(function (x) { return hoeheVon(x) === h && x !== 'rundgang'; }); return k[0] || null; }
function name(id, ersatz) { var d = R()[id]; return (d && d.name) || ersatz || id; }
function kurz(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }

var extra = {}; // raumId -> [{name, tun?, farbe?}] (Räume hängen eigene Stationen an)

var blick = null; // Planet, zu dem der Himmel gerade geflogen ist
function zumUeberblick(id) {
  if (C6.jetzt !== id) { C6.geh(id); return; }
  blick = null;
  // schon im Himmel: zurück auf den Überblick („Zu dir“)
  C6.geh(id, { ueberblick: true });
  var b = C6.gebaut && C6.gebaut(id), m = b && b.querySelector('[data-tu="mitte"]');
  if (m && !m.hidden) m.click();
  bald();
}
function himmel() {
  var id = ersterDerHoehe('vogel');
  return id ? { name: name(id, 'Himmel'), id: id, tun: function () { zumUeberblick(id); } } : null;
}
function planetStation(sid, hid) {
  var f = null;
  try { f = sid && C6.strings && C6.strings.hol ? C6.strings.hol(sid) : null; } catch (e) { f = null; }
  if (!f) return null;
  return { name: kurz(f.titel, 26), farbe: f.farbe, tun: function () {
    if (hid) C6.geh(hid, { faden: sid });
    else if (C6.space && C6.space.oeffne) C6.space.oeffne(sid);
  } };
}
function spaceStationen() {
  var w = [], h = himmel();
  if (h) w.push(h);
  var sid = null;
  try { sid = C6.space && C6.space.jetzt ? C6.space.jetzt() : null; } catch (e) { sid = null; }
  // der Planet: von oben, im Himmel (dorthin fliegt die Kamera)
  var pl = planetStation(sid, h && h.id);
  if (!pl) { w.push({ name: 'Neuer Space' }); return w; }
  w.push(pl);
  return w;
}

/* Der Weg zum Raum id (Standard: der aktuelle) */
function weg(id) {
  id = id || C6.jetzt;
  var d = R()[id];
  var w = [];
  var heim = R().zuhause ? 'zuhause' : null;
  if (heim) w.push({ name: name(heim, 'Zuhause'), id: heim, tun: function () { C6.geh(heim); } });
  if (!d || id === heim) return w.concat(extra[id] || []);
  var h = hoeheVon(id);
  if (typeof d.faden === 'function') {
    var eigen = null;
    try { eigen = d.faden(); } catch (e) { eigen = null; }
    if (Array.isArray(eigen)) return w.concat(eigen, extra[id] || []);
  }
  if (id === 'space') w = w.concat(spaceStationen());
  else if (h === 'vogel') {
    w.push({ name: name(id, 'Himmel'), id: id, tun: function () { zumUeberblick(id); } });
    var bp = blick && planetStation(blick, id);
    if (bp) w.push(bp);
  }
  else if (h === 'teleskop') { var hm = himmel(); if (hm) w.push(hm); w.push({ name: name(id, 'Teleskop'), id: id, tun: function () { C6.geh(id); } }); }
  else w.push({ name: name(id), id: id, tun: function () { C6.geh(id); } });
  return w.concat(extra[id] || []);
}
function tiefe(id) { return weg(id).length; }

/* ---------- Zeichnen ---------- */
var nav = mach('nav', 'c6k-fd', null);
nav.setAttribute('aria-label', 'Wo du bist');
var hoch = mach('button', 'c6k-fd-hoch', nav);
hoch.type = 'button';
hoch.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>';
var hochWort = mach('span', 'c6k-fd-wohin', hoch);
C6.kopf.insertBefore(nav, C6.kopf.firstChild);
D.getElementById('c6').setAttribute('data-faden', '');

var richtung = null; // 'hoch' | 'tiefer' (gesetzt, wenn der Faden selbst führt)

function geh(stelle, wohin) {
  if (!stelle || typeof stelle.tun !== 'function') return;
  richtung = wohin || 'hoch';
  try { stelle.tun(); } catch (e) { try { console.error('Carl6 · faden', e); } catch (_) {} }
  setTimeout(function () { richtung = null; }, 60);
}

function zeichne() {
  var w = weg();
  var id = C6.jetzt, d = R()[id];
  var vorher = w.length > 1 ? w[w.length - 2] : null;
  // Räume aus der Leiste brauchen oben nichts: die Leiste zeigt, wo du bist, und führt überallhin
  var inLeiste = !!d && typeof d.reihe === 'number' && !d.umleiten && hoeheVon(id) === 'boden' && w.length <= 2;
  // „‹ Zuhause“ sagt dasselbe wie das Haus in der Leiste: nur zeigen, wenn die Leiste fehlt
  var leisteDa = !D.getElementById('c6').hasAttribute('data-ohne-leiste') && !(d && d.leiste === false);
  var nachHause = !!vorher && vorher.id === 'zuhause' && leisteDa;
  var an = !!id && !!vorher && !!vorher.tun && !inLeiste && !nachHause && id !== 'rundgang';
  nav.hidden = !an;
  if (!an) return;
  var nm = vorher.name;
  hoch.setAttribute('aria-label', 'Zurück: ' + nm);
  hoch.title = nm + ' (Esc)';
  if (hochWort.textContent !== nm) {
    hochWort.textContent = nm;
    if (!C6.ruhig) { hoch.classList.remove('c6k-fd-kommt'); void hoch.offsetWidth; hoch.classList.add('c6k-fd-kommt'); }
  }
}
hoch.addEventListener('click', function () { C6.faden.hoch(); });
var uhr = null;
function bald() { if (!uhr) uhr = setTimeout(function () { uhr = null; zeichne(); }, 30); }

C6.faden = {
  el: nav,
  weg: function (id) { return weg(id).map(function (s) { return { name: s.name, farbe: s.farbe || null, tun: s.tun || null }; }); },
  tiefe: tiefe,
  /* eine Ebene höher; false, wenn es nichts darüber gibt */
  hoch: function () {
    var w = weg();
    if (w.length < 2) return false;
    var z = w[w.length - 2];
    if (!z.tun) return false;
    geh(z, 'hoch');
    return true;
  },
  /* Räume hängen eigene Stationen an (z. B. ein laufendes Gerüst): [{name, tun?, farbe?}] oder null */
  setze: function (raumId, stationen) {
    if (!raumId) return;
    if (Array.isArray(stationen) && stationen.length) extra[raumId] = stationen.filter(function (s) { return s && s.name; }).map(function (s) { return { name: kurz(s.name, 28), tun: s.tun, farbe: s.farbe }; });
    else delete extra[raumId];
    if (raumId === C6.jetzt) bald();
  },
  richtung: function () { return richtung; },
  neu: bald
};

C6.bus.on('raum', function (id) { if (hoeheVon(id) !== 'vogel' && id !== 'space') blick = null; zeichne(); });
C6.bus.on('himmel', function (d) { if (d && d.was === 'flug') { blick = d.id; bald(); } else if (d && d.was === 'ueberblick') { blick = null; bald(); } });
D.addEventListener('click', function (e) {
  var t = e.target && e.target.closest && e.target.closest('[data-tu="mitte"]');
  if (t && blick && hoeheVon(C6.jetzt) === 'vogel') { blick = null; bald(); }
}, true);
C6.bus.on('space', bald);
C6.bus.on('strings', bald);
C6.bus.on('rundgang', bald);
C6.bus.on('benannt', bald);
