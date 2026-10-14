/* Carl 6 · Der rote Faden: oben in jedem Raum der Weg von Zuhause bis hierher.
   Jede Station antippbar, „‹“ geht eine Ebene höher. Tiefer gleitet von rechts, höher von links. */
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
  var r = (C6.S.spaces || {})[sid] || {}, pid = r.jetzt || (r.places || [])[0];
  var P = C6.space && C6.space.places && pid ? C6.space.places[pid] : null;
  if (P && P.name) w.push({ name: P.name });
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
var ol = mach('ol', 'c6k-fd-weg', nav);
var mehr = mach('li', 'c6k-fd-stelle c6k-fd-mehr', null);
var mehrK = mach('button', 'c6k-fd-punkt', mehr);
mehrK.type = 'button';
mehrK.setAttribute('aria-label', 'Den ganzen Weg zeigen');
mach('span', 'c6k-fd-name', mehrK, '…');
mehr.hidden = true;
mehrK.addEventListener('click', function () { voll = true; kuerze(); ol.scrollLeft = 0; gerollt(); });
C6.kopf.insertBefore(nav, C6.kopf.firstChild);
D.getElementById('c6').setAttribute('data-faden', '');

var richtung = null; // 'hoch' | 'tiefer' (gesetzt, wenn der Faden selbst führt)
var gezeigt = []; // [{key, li}]

function geh(stelle, wohin) {
  if (!stelle || typeof stelle.tun !== 'function') return;
  richtung = wohin || 'hoch';
  try { stelle.tun(); } catch (e) { try { console.error('Carl6 · faden', e); } catch (_) {} }
  setTimeout(function () { richtung = null; }, 60);
}

function zeichne() {
  var w = weg();
  var an = !!C6.jetzt;
  nav.hidden = !an;
  if (!an) return;
  var vorher = w.length > 1 ? w[w.length - 2] : null;
  hoch.hidden = !vorher;
  if (vorher) {
    hoch.setAttribute('aria-label', 'Eine Ebene höher: ' + vorher.name);
    hoch.title = vorher.name + ' (Esc)';
  }
  nav.toggleAttribute('data-allein', w.length < 2);
  // gemeinsamer Anfang bleibt stehen, der Rest geht oder kommt
  var neuKeys = w.map(function (s, i) { return i + '|' + s.name + '|' + (s.farbe || ''); });
  var gleich = 0;
  while (gleich < gezeigt.length && gleich < neuKeys.length && gezeigt[gleich].key === neuKeys[gleich]) gleich++;
  var weg_ = gezeigt.splice(gleich);
  weg_.forEach(function (x) {
    var li = x.li;
    li.classList.add('c6k-fd-geht');
    li.setAttribute('aria-hidden', 'true');
    li.querySelectorAll('button').forEach(function (b) { b.tabIndex = -1; });
    setTimeout(function () { if (li.parentNode) li.parentNode.removeChild(li); }, C6.ruhig ? 0 : 240);
  });
  for (var i = gleich; i < w.length; i++) {
    var s = w[i], li = mach('li', 'c6k-fd-stelle', null);
    var istHier = i === w.length - 1;
    var el = mach(istHier ? 'span' : 'button', istHier ? 'c6k-fd-hier' : 'c6k-fd-punkt', li);
    if (!istHier) { el.type = 'button'; (function (st) { el.addEventListener('click', function () { geh(st, 'hoch'); }); })(s); }
    else el.setAttribute('aria-current', 'location');
    var nm = mach('span', 'c6k-fd-name', el);
    if (s.farbe) { var p = mach('i', 'c6k-fd-farbe', nm); p.style.background = s.farbe; }
    if (i === 0 && s.id === 'zuhause') {
      // Zuhause als kleines Haus, sobald es nicht die letzte Station ist (Platz für den Weg)
      var hs = mach('i', 'c6k-fd-haus', nm);
      hs.setAttribute('aria-hidden', 'true');
      hs.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 11.5 12 4.5l8 7M6.5 9.8V19.5h11V9.8"/><path d="M10.2 19.5v-5h3.6v5"/></svg>';
      el.setAttribute('aria-label', s.name);
    }
    mach('span', 'c6k-fd-wort', nm, s.name);
    // vor die abgehenden Stationen setzen, damit die Reihenfolge stimmt
    var vor = null;
    for (var k = 0; k < ol.children.length; k++) if (ol.children[k].classList.contains('c6k-fd-geht')) { vor = ol.children[k]; break; }
    ol.insertBefore(li, vor);
    if (!C6.ruhig && gezeigt.length + weg_.length > 0) {
      li.classList.add('c6k-fd-kommt');
      li.style.animationDelay = ((i - gleich) * 55) + 'ms';
    }
    gezeigt.push({ key: neuKeys[i], li: li });
  }
  // die „hier“-Station: nur die letzte ist Text, alle davor sind Knöpfe
  gezeigt.forEach(function (x, j) {
    var b = x.li.firstChild, letzte = j === gezeigt.length - 1;
    if (letzte && b.tagName === 'BUTTON' || !letzte && b.tagName !== 'BUTTON') {
      // Rolle hat sich geändert (z. B. Station wurde zur letzten): neu bauen
      var st = w[j], nb = mach(letzte ? 'span' : 'button', letzte ? 'c6k-fd-hier' : 'c6k-fd-punkt', null);
      if (!letzte) { nb.type = 'button'; nb.addEventListener('click', function () { geh(st, 'hoch'); }); } else nb.setAttribute('aria-current', 'location');
      while (b.firstChild) nb.appendChild(b.firstChild);
      x.li.replaceChild(nb, b);
    }
  });
  // am Ende des Wegs stehen (lange Wege scrollen nach links weg, der Anfang verblasst)
  voll = false;
  requestAnimationFrame(function () { kuerze(); gerollt(); });
}

hoch.addEventListener('click', function () { C6.faden.hoch(); });
/* passt der Weg nicht, ruhen die ersten Stationen hinter „…“ (antippen zeigt alle) */
var voll = false;
function kuerze() {
  try {
    var st = [].filter.call(ol.children, function (li) { return li !== mehr && li.classList.contains('c6k-fd-stelle') && !li.classList.contains('c6k-fd-geht'); });
    st.forEach(function (li) { li.classList.remove('c6k-fd-ruht'); });
    if (mehr.parentNode) mehr.parentNode.removeChild(mehr);
    var k0 = 0, n = 0;
    if (!voll) {
      while (ol.scrollWidth > ol.clientWidth + 27 && n < st.length - 2) { st[n].classList.add('c6k-fd-ruht'); n++; }
    }
    mehr.hidden = n === k0;
    if (n > k0) ol.insertBefore(mehr, st[n]);
    else if (mehr.parentNode) mehr.parentNode.removeChild(mehr);
    // nur so weit rollen, dass die letzte Station ganz da ist (der auslaufende Faden darf fehlen)
    ol.scrollLeft = Math.max(0, ol.scrollWidth - ol.clientWidth - 26);
  } catch (e) {}
}
function gerollt() { nav.toggleAttribute('data-gerollt', ol.scrollLeft > 2); }
ol.addEventListener('scroll', gerollt, { passive: true });

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
