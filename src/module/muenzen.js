// Münzen (aus Spiel und Aufgaben), die Kasse und kleine Geheimnisse an Carl
var C6 = window.C6 = window.C6 || {};

function S() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(fn);
  else { fn(S()); try { C6.speichern && C6.speichern(); } catch (e) {} }
}
function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function satz(k, rueck) { try { var t = C6.stimme && C6.stimme.sag(k); if (t) return t; } catch (e) {} return rueck; }
function ruhig() { return !!C6.ruhig; }

// ---------- Das Motiv: ein Kiesel mit Keimling ----------
function muenze(px, extra) {
  px = px || 24;
  return '<svg class="c6s-muenze' + (extra ? ' ' + extra : '') + '" width="' + px + '" height="' + px + '" viewBox="0 0 40 40" aria-hidden="true">' +
    '<path d="M6 21c-1-8 5-15 14-15.5 9-.4 15 5 14.5 13.5C34 28 27 34.5 19 34.3 11 34 6.8 29 6 21z" fill="#e4d6bd" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M10.5 21.5c-.4-5.6 3.8-10.6 10-10.9" fill="none" stroke="#fbf7f0" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M20 28v-7" stroke="#2b2722" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M20 21.5c-4.6.3-7.4-2-7.6-5.6 3.9-.4 6.8 1.6 7.6 5.6z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M20 21c3.6-.8 6.7-3.6 6.4-7.3-3.8.2-6.6 3-6.4 7.3z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.6" stroke-linejoin="round"/>' +
    (/glanzt/.test(extra || '') ? '<ellipse class="c6s-muenze-glanz" cx="14" cy="14" rx="3.2" ry="5" fill="#fffdf6" opacity=".85" transform="rotate(-35 14 14)"/>' : '') +
    '</svg>';
}

function stand() { var n = +S().muenzen; return isFinite(n) && n > 0 ? Math.floor(n) : 0; }

// Der Zähler zählt weich hoch (die Zahl rollt), statt zu springen
var rollt = null;
function zeigeStaende() {
  var n = stand();
  var els = document.querySelectorAll('[data-c6s-stand]');
  for (var i = 0; i < els.length; i++) {
    var z = els[i].querySelector('.c6s-stand-zahl');
    if (z) {
      var von = +z.textContent;
      if (!isFinite(von) || ruhig() || Math.abs(n - von) < 2 || n < von) z.textContent = n;
      else rolle(z, von, n);
    }
    els[i].setAttribute('aria-label', n === 1 ? 'Eine Münze' : n + ' Münzen');
    // Ein Stand von null ist keine Zahl, die jemand lesen will: erst zeigen, wenn es etwas gibt
    els[i].hidden = n === 0;
  }
}
function rolle(z, von, bis) {
  var t0 = null, ms = Math.min(900, 300 + Math.abs(bis - von) * 60);
  function schritt(t) {
    if (t0 == null) t0 = t;
    var u = Math.min(1, (t - t0) / ms), k = 1 - Math.pow(1 - u, 3);
    z.textContent = Math.round(von + (bis - von) * k);
    if (u < 1) return true;
    z.textContent = bis; return false;
  }
  try {
    if (C6.takt && C6.takt.on) { C6.takt.on(function (t) { return schritt(t * 1000); }); return; }
  } catch (e) {}
  (function raf(t) { if (schritt(t == null ? performance.now() : t)) requestAnimationFrame(raf); })();
}

// Kleine Münze steigt auf, wo es passiert ist
function flug(n, wo) {
  var x = innerWidth / 2, y = innerHeight * 0.42;
  if (wo && typeof wo.x === 'number') { x = wo.x; y = wo.y; }
  else if (wo && wo.getBoundingClientRect) { var r = wo.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height * 0.25; }
  var d = document.createElement('div');
  d.className = 'c6s-flug-muenze';
  d.setAttribute('aria-hidden', 'true');
  d.innerHTML = muenze(30) + '<span>+' + n + '</span>';
  d.style.left = x + 'px'; d.style.top = y + 'px';
  document.body.appendChild(d);
  // Ziel: ein vom Aufrufer genannter Punkt, sonst die oberste sichtbare Anzeige (Ebenen liegen später im Dokument)
  var ziel = null, els = document.querySelectorAll('[data-c6s-stand]');
  if (wo && wo.ziel && typeof wo.ziel.x === 'number') ziel = { left: wo.ziel.x - 14, top: wo.ziel.y - 12, width: 1 };
  for (var i = els.length - 1; i >= 0 && !ziel; i--) { var rr = els[i].getBoundingClientRect(); if (rr.width && rr.top >= 0 && rr.top < innerHeight && !els[i].closest('[hidden]')) { ziel = rr; break; } }
  var dx = ziel ? (ziel.left + 14 - x) : 0, dy = ziel ? (ziel.top + 12 - y) : -70;
  var k = [
    { transform: 'translate(-50%,-50%) scale(.4)', opacity: 0 },
    { transform: 'translate(-50%,-50%) translateY(-26px) scale(1.08)', opacity: 1, offset: .32 },
    { transform: 'translate(-50%,-50%) translateY(-30px) scale(1)', opacity: 1, offset: .55 },
    { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + dy + 'px) scale(.55)', opacity: 0 }
  ];
  var dauer = ruhig() ? 900 : 1300;
  if (ruhig()) k = [{ opacity: 0, transform: 'translate(-50%,-50%)' }, { opacity: 1, offset: .3, transform: 'translate(-50%,-50%)' }, { opacity: 1, offset: .75, transform: 'translate(-50%,-50%)' }, { opacity: 0, transform: 'translate(-50%,-50%)' }];
  try {
    var a = d.animate(k, { duration: dauer, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'forwards' });
    a.onfinish = function () { d.remove(); poppe(); };
  } catch (e) { setTimeout(function () { d.remove(); poppe(); }, dauer); }
}
function poppe() {
  zeigeStaende();
  if (ruhig()) return;
  var els = document.querySelectorAll('[data-c6s-stand]');
  for (var i = 0; i < els.length; i++) {
    try { els[i].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' }); } catch (e) {}
  }
}

// ---------- Die Kasse: was du dir geholt hast ----------
function kasse() {
  var s = S();
  if (!s.kasse || typeof s.kasse !== 'object') s.kasse = {};
  if (!s.kasse.besitz || typeof s.kasse.besitz !== 'object') s.kasse.besitz = {};
  if (!s.kasse.quest || typeof s.kasse.quest !== 'object') s.kasse.quest = {};
  return s.kasse;
}
function gueltigeId(id) { return typeof id === 'string' && id.length > 0 && id.length <= 80 && /^[\w:.\-äöüß]+$/i.test(id); }
var zuletztFehlt = 0;
// Münzen kommen nur aus zwei Quellen: Spiel (Kieselpark, Spiele, Geheimnisse) und Aufgaben (je Aufgabe einmal)
function quelle(grund) {
  grund = String(grund || '');
  if (/^(kieselpark|spiel|geheimnis)(:|$)/.test(grund)) return 'spiel';
  if (/^quest:[\w.\-]+$/.test(grund)) return 'quest';
  return null;
}

C6.muenzen = {
  muenze: muenze,
  stand: stand,
  plus: function (n, grund, wo) {
    var q = quelle(grund);
    if (!q) return stand();
    n = Math.max(0, Math.min(50, Math.floor(+n || 0)));
    if (!n) return stand();
    if (q === 'quest') {
      var qid = String(grund).slice(6);
      if (kasse().quest[qid]) return stand();
      aendern(function (s) { kasse(); s.kasse.quest[qid] = Date.now(); });
    }
    aendern(function (s) { s.muenzen = (isFinite(+s.muenzen) ? Math.floor(+s.muenzen) : 0) + n; });
    if (stand() === n) zeigeStaende();   // vorher null: die Anzeige erscheint, die Münze fliegt hinein
    flug(n, wo);
    emit('muenzen', { stand: stand(), plus: n, grund: grund || '' });
    return stand();
  },
  // Kaufen: offen, ohne Druck. Schon Gekauftes kostet nie zweimal.
  kaufe: function (id, preis, o) {
    o = o || {};
    if (!gueltigeId(id)) return false;
    if (this.hat(id)) return true;
    preis = Math.max(0, Math.floor(+preis || 0));
    if (stand() < preis) { zuletztFehlt = preis - stand(); return false; }
    zuletztFehlt = 0;
    var art = String(o.art || id.split(':')[0] || '').slice(0, 24), name = String(o.name || '').slice(0, 60);
    aendern(function (s) {
      kasse();
      s.muenzen = stand() - preis;
      s.kasse.besitz[id] = { preis: preis, art: art, name: name, t: Date.now() };
    });
    zeigeStaende();
    emit('muenzen', { stand: stand(), plus: -preis, grund: 'kasse:' + id });
    emit('gekauft', { id: id, preis: preis, art: art, name: name, stand: stand() });
    return true;
  },
  // Gleiche Kasse in Objektform: C6.muenzen.kasse({id, preis, name, art, wo}) → true|false (wo: Element, von dem die Münzen abgehen)
  kasse: function (o) {
    o = o || {};
    var vorher = stand(), ok = this.kaufe(o.id, o.preis, { art: o.art, name: o.name });
    if (ok && vorher > stand() && o.wo && !ruhig()) { try { o.wo.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' }); } catch (e) {} }
    return ok;
  },
  hat: function (id) { return !!(gueltigeId(id) && kasse().besitz[id]); },
  besitz: function (art) {
    var b = kasse().besitz, l = [];
    for (var id in b) { if (!art || b[id].art === art) l.push({ id: id, art: b[id].art, preis: b[id].preis, name: b[id].name, t: b[id].t }); }
    return l.sort(function (a, c) { return (a.t || 0) - (c.t || 0); });
  },
  warum: function () { return { fehlt: zuletztFehlt }; },
  // Altcode (bitte kaufe benutzen): bucht ab, merkt sich aber nichts
  ausgeben: function (n) {
    n = Math.max(0, Math.floor(+n || 0));
    if (stand() < n) { zuletztFehlt = n - stand(); return false; }
    aendern(function (s) { s.muenzen = stand() - n; });
    zeigeStaende();
    emit('muenzen', { stand: stand(), plus: -n, grund: 'laden' });
    return true;
  },
  geheimnis: function (id, n, wo) {
    var g = S().geheim || {};
    if (g[id]) return false;
    aendern(function (s) { s.geheim = s.geheim || {}; s.geheim[id] = Date.now(); });
    if (n) this.plus(n, 'geheimnis:' + id, wo);
    return true;
  },
  gefunden: function (id) { return !!(S().geheim && S().geheim[id]); },
  // kleine Anzeige: <button data-c6s-stand>…</button>
  anzeige: function (cls) {
    var b = document.createElement('div');
    b.className = 'c6s-stand' + (cls ? ' ' + cls : '');
    b.setAttribute('data-c6s-stand', '');
    b.setAttribute('role', 'status');
    b.innerHTML = muenze(22) + '<span class="c6s-stand-zahl">' + stand() + '</span>';
    b.setAttribute('aria-label', stand() + ' Münzen');
    b.hidden = stand() === 0;
    return b;
  },
  auffrischen: zeigeStaende
};

// ---------- Geheimnisse an Carl: Niesen (5× schnell) und Kitzeln (Wischen) ----------
function fig(ctl) { return ctl && (ctl.el || ctl); }
function wackel(el, art) {
  if (!el || ruhig()) return;
  var k = art === 'nies'
    ? [{ transform: 'none' }, { transform: 'translateY(2px) scale(1.04,.94)', offset: .3 }, { transform: 'translateY(-6px) scale(.96,1.06) rotate(-4deg)', offset: .5 }, { transform: 'translateY(0) rotate(2deg)', offset: .72 }, { transform: 'none' }]
    : [{ transform: 'none' }, { transform: 'rotate(-5deg)', offset: .2 }, { transform: 'rotate(5deg)', offset: .4 }, { transform: 'rotate(-4deg)', offset: .6 }, { transform: 'rotate(3deg)', offset: .8 }, { transform: 'none' }];
  try { el.animate(k, { duration: art === 'nies' ? 620 : 760, easing: 'ease-out' }); } catch (e) {}
}
function pustel(el) {
  if (!el) return;
  var r = el.getBoundingClientRect();
  for (var i = 0; i < 7; i++) {
    var p = document.createElement('i');
    p.className = 'c6s-puste';
    p.style.left = (r.left + r.width * (0.55 + Math.random() * 0.1)) + 'px';
    p.style.top = (r.top + r.height * (0.38 + Math.random() * 0.12)) + 'px';
    var s = 4 + Math.random() * 7; p.style.width = p.style.height = s + 'px';
    document.body.appendChild(p);
    var ang = (-40 + Math.random() * 80) * Math.PI / 180, dist = 40 + Math.random() * 50;
    (function (p) {
      try {
        var a = p.animate([{ transform: 'translate(0,0) scale(.4)', opacity: .9 }, { transform: 'translate(' + Math.cos(ang) * dist + 'px,' + Math.sin(ang) * dist + 'px) scale(1.2)', opacity: 0 }], { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
        a.onfinish = function () { p.remove(); };
      } catch (e) { p.remove(); }
    })(p);
  }
}

C6.geheim = {
  niesen: function (ctl) {
    var el = fig(ctl); if (!el || el.__c6sNies) return;
    el.__c6sNies = true;
    var zeiten = [], letzterKlick = 0;
    // Schnelles Antippen ist Spiel, kein Gesprächswunsch: ab dem zweiten Tippen kein Fokus aufs Feld
    var huelle = el.parentNode;
    if (huelle) huelle.addEventListener('click', function (e) {
      var t = performance.now(), schnell = t - letzterKlick < 650;
      letzterKlick = t;
      if (!schnell || !el.contains(e.target)) return;
      e.stopPropagation();
      var a = document.activeElement;
      if (a && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT') && !String(a.value || '').trim()) { try { a.blur(); } catch (x) {} }
    }, true);
    el.addEventListener('pointerup', function () {
      var t = performance.now();
      zeiten.push(t); zeiten = zeiten.filter(function (z) { return t - z < 1700; });
      if (zeiten.length >= 5) {
        zeiten = [];
        try { ctl.stimmung && ctl.stimmung('staunt'); } catch (e) {}
        setTimeout(function () {
          wackel(el, 'nies'); pustel(el);
          var erst = C6.muenzen.geheimnis('niesen', 3, el);
          try { C6.sag && C6.sag(erst ? 'Hatschi. Entschuldige, das war Sockenstaub.' : 'Hatschi. Schon wieder.'); } catch (e) {}
          setTimeout(function () { try { ctl.stimmung && ctl.stimmung('froh'); } catch (e) {} }, 700);
        }, 260);
      }
    });
  },
  // Kitzeln = senkrechtes Hin-und-Her über Carl. Waagrecht bleibt dem Kern (Raumwechsel).
  kitzeln: function (ctl) {
    var el = fig(ctl); if (!el || el.__c6sKitzel) return;
    el.__c6sKitzel = true;
    var spur = null, ruhe = 0;
    function start(e) { spur = { x0: e.clientX, y: e.clientY, dir: 0, wechsel: 0, weg: 0, quer: 0, t: performance.now(), id: e.pointerId }; }
    function zieh(e) {
      if (!spur || e.pointerId !== spur.id) return;
      var dy = e.clientY - spur.y; spur.y = e.clientY;
      spur.quer = Math.max(spur.quer, Math.abs(e.clientX - spur.x0));
      if (spur.quer > 40) { spur = null; return; }       // das ist ein Wisch, kein Kitzeln
      if (Math.abs(dy) < 2) return;
      spur.weg += Math.abs(dy);
      var d = dy > 0 ? 1 : -1;
      if (spur.dir && d !== spur.dir) spur.wechsel++;
      spur.dir = d;
      if (spur.wechsel >= 3 && spur.weg > 100 && performance.now() - spur.t < 1800 && performance.now() > ruhe) {
        spur = null; ruhe = performance.now() + 2500;
        wackel(el, 'kitzel');
        try { ctl.stimmung && ctl.stimmung('froh'); } catch (e) {}
        var erst = C6.muenzen.geheimnis('kitzeln', 3, el);
        try { C6.sag && C6.sag(erst ? satz('nichtDa', 'Nicht da. Na gut, doch.') : 'Du weißt genau, wo.'); } catch (e) {}
      }
    }
    function ende() { spur = null; }
    el.addEventListener('pointerdown', start);
    el.addEventListener('pointermove', zieh);
    el.addEventListener('pointerup', ende);
    el.addEventListener('pointercancel', ende);
    // pan-x: waagrechtes Wischen geht an den Kern, senkrecht bleiben die Zeiger-Ereignisse bei Carl
    el.style.touchAction = 'pan-x';
  },
  alles: function (ctl) { this.niesen(ctl); this.kitzeln(ctl); }
};
