// Münzen, kleine Geheimnisse und der Keimflug
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
  var ziel = null, els = document.querySelectorAll('[data-c6s-stand]');
  for (var i = 0; i < els.length; i++) { var rr = els[i].getBoundingClientRect(); if (rr.width && rr.top >= 0 && rr.top < innerHeight) { ziel = rr; break; } }
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

C6.muenzen = {
  muenze: muenze,
  stand: stand,
  plus: function (n, grund, wo) {
    n = Math.max(0, Math.floor(+n || 0));
    if (!n) return stand();
    aendern(function (s) { s.muenzen = (isFinite(+s.muenzen) ? Math.floor(+s.muenzen) : 0) + n; });
    if (stand() === n) zeigeStaende();   // vorher null: die Anzeige erscheint, die Münze fliegt hinein
    flug(n, wo);
    emit('muenzen', { stand: stand(), plus: n, grund: grund || '' });
    return stand();
  },
  ausgeben: function (n) {
    n = Math.max(0, Math.floor(+n || 0));
    if (stand() < n) return false;
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

// ---------- Keimflug: Carl flattert durch Fadenschlaufen ----------
(function () {
  var ebene = null, cv = null, cx = null, raf = 0, lauf = false, pause = false;
  var W = 0, H = 0, dpr = 1, t0 = 0, zeit = 0;
  var carl, schlaufen, sterne, faden, gefaedelt, halten, knoten, hinweis, letzte, naechste, KS = 0.4;
  var NACHT = '#141a33', TINTE = '#eef0ff', LEISE = '#aab2dc';

  function farben() {
    var f = [];
    try { (C6.strings && C6.strings.alle() || []).forEach(function (s) { if (s.farbe) f.push(s.farbe); }); } catch (e) {}
    if (!f.length) f = ['#6f9ccf', '#5fb3a3', '#d6a84a', '#8fb36a', '#b58ac0', '#d08a5c'];
    return f.map(hell);
  }
  // Fadenfarben nachts etwas aufhellen
  function hell(h) {
    var m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return h;
    var n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r + (255 - r) * .35); g = Math.round(g + (255 - g) * .35); b = Math.round(b + (255 - b) * .35);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function bau() {
    ebene = document.createElement('div');
    ebene.className = 'c6s-flug';
    ebene.tabIndex = -1;
    ebene.setAttribute('role', 'dialog');
    ebene.setAttribute('aria-label', 'Keimflug');
    ebene.innerHTML =
      '<canvas class="c6s-flug-cv" aria-hidden="true"></canvas>' +
      '<button class="c6s-rund c6s-flug-pause" type="button" aria-label="Pause"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>' +
      '<button class="c6s-rund c6s-flug-zu" type="button" aria-label="Schließen"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>' +
      '<div class="c6s-flug-zahl" aria-live="polite"></div>' +
      '<div class="c6s-flug-hinweis">Halten: flattern · Loslassen: gleiten</div>' +
      '<div class="c6s-flug-karte" hidden><p class="c6s-flug-titel">Keimflug</p><p class="c6s-flug-text">Fädel die Schlaufen auf. Daraus wird ein Faden.</p><button type="button" class="c6s-knopf c6s-flug-weiter">Weiter fliegen</button><button type="button" class="c6s-knopf c6s-leise c6s-flug-ende">Landen</button></div>';
    document.body.appendChild(ebene);
    cv = ebene.querySelector('canvas'); cx = cv.getContext('2d');
    ebene.querySelector('.c6s-flug-zu').onclick = function () { C6.keimflug.zu(); };
    ebene.querySelector('.c6s-flug-pause').onclick = function () { setzePause(!pause); };
    ebene.querySelector('.c6s-flug-weiter').onclick = function () { setzePause(false); };
    ebene.querySelector('.c6s-flug-ende').onclick = function () { C6.keimflug.zu(); };
    function drueck(e) {
      if (e.target.closest('button,.c6s-flug-karte')) return;
      e.preventDefault(); if (pause) return; halten = true; hinweisWeg();
    }
    function los() { halten = false; }
    cv.addEventListener('pointerdown', drueck);
    ebene.addEventListener('pointerup', los);
    ebene.addEventListener('pointercancel', los);
    ebene.addEventListener('touchstart', function (e) { if (!e.target.closest('button')) e.preventDefault(); }, { passive: false });
  }
  function hinweisWeg() { if (hinweis) { hinweis = false; var h = ebene.querySelector('.c6s-flug-hinweis'); h.classList.add('c6s-weg'); } }
  function taste(e) {
    if (!C6.keimflug.offen) return;
    if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); C6.keimflug.zu(); return; }
    if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); e.stopImmediatePropagation(); if (e.type === 'keydown') { if (!pause) { halten = true; hinweisWeg(); } } else halten = false; }
    if ((e.key === 'p' || e.key === 'P') && e.type === 'keydown') setzePause(!pause);
  }
  function sichtbar() { if (document.hidden && C6.keimflug.offen) setzePause(true); }
  function groesse() {
    dpr = Math.min(3, window.devicePixelRatio || 1);
    W = ebene.clientWidth; H = ebene.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    KS = Math.max(0.36, Math.min(0.62, Math.min(W, H) / 950));
  }
  function setzePause(p) {
    pause = p;
    var k = ebene.querySelector('.c6s-flug-karte');
    k.hidden = !p;
    if (p) { halten = false; ebene.querySelector('.c6s-flug-weiter').focus({ preventScroll: true }); }
    else { t0 = performance.now(); if (!raf) raf = requestAnimationFrame(schritt); }
  }

  function neu() {
    var h = Math.max(1, H);
    carl = { x: Math.min(W * 0.28, 160), y: h * 0.45, vy: 0, schlag: 0, phase: 0, wipp: 0, federn: 0 };
    schlaufen = []; faden = []; gefaedelt = 0; knoten = []; naechste = 0; halten = false; hinweis = true; letzte = null;
    sterne = [];
    for (var i = 0; i < 90; i++) sterne.push({ x: Math.random(), y: Math.random() * 0.8, r: Math.random() < 0.15 ? 1.6 : 0.9, p: Math.random() * 6 });
    zahl();
  }
  function zahl() {
    var z = ebene.querySelector('.c6s-flug-zahl');
    z.textContent = gefaedelt ? (gefaedelt === 1 ? 'eine Schlaufe' : gefaedelt + ' Schlaufen') : '';
  }

  var FARB = [];
  function setzeSchlaufe() {
    var h = H, rand = 90;
    var y = rand + Math.random() * (h - rand * 2 - 40);
    if (letzte != null) y = Math.max(rand, Math.min(h - rand - 40, letzte + (Math.random() - .5) * h * 0.5));
    letzte = y;
    schlaufen.push({ x: W + 60, y: y, r: (48 + Math.random() * 10) * KS / 0.42, farbe: FARB[Math.floor(Math.random() * FARB.length)], dreh: Math.random() * 6, durch: false, zu: 0 });
  }

  function schritt(t) {
    raf = 0;
    if (!lauf || pause) return;
    var dt = Math.min(0.033, (t - (t0 || t)) / 1000); t0 = t; zeit += dt;
    var tempo = Math.max(110, Math.min(170, W * 0.22));
    // Flattern: Halten hebt, Loslassen gleitet
    if (halten) { carl.vy -= 1250 * dt; carl.schlag = Math.min(1, carl.schlag + dt * 6); carl.federn = Math.min(1, carl.federn + dt * 8); }
    else { carl.schlag = Math.max(0, carl.schlag - dt * 3); carl.federn = Math.max(0, carl.federn - dt * 4); }
    if (carl.wipp > 0) carl.wipp = Math.max(0, carl.wipp - dt * 1.6);
    carl.vy += 480 * dt;                     // Schwere
    if (!halten && carl.vy > 90) carl.vy -= (carl.vy - 90) * 3.2 * dt; // Gleiten bremst den Fall
    carl.vy = Math.max(-300, Math.min(260, carl.vy));
    carl.y += carl.vy * dt;
    carl.phase += dt * (halten ? 26 : 5);
    if (carl.y < 46) { carl.y = 46; carl.vy = Math.abs(carl.vy) * 0.3; }
    if (carl.y > H - 46) { carl.y = H - 46; if (carl.vy > 40) carl.wipp = 1; carl.vy = -Math.abs(carl.vy) * 0.45 - 60; }
    // Schlaufen
    naechste -= dt;
    if (naechste <= 0) { setzeSchlaufe(); naechste = 1.35 + Math.random() * 0.6; }
    for (var i = schlaufen.length - 1; i >= 0; i--) {
      var s = schlaufen[i];
      s.x -= tempo * dt; s.dreh += dt;
      if (s.durch) s.zu = Math.min(1, s.zu + dt * 3);
      if (!s.durch && Math.abs(s.x - carl.x) < 16 && Math.abs(s.y - carl.y) < s.r - 4) {
        s.durch = true; gefaedelt++;
        faden.push({ x: s.x, y: s.y, farbe: s.farbe });
        zahl();
        if (gefaedelt % 10 === 0) {
          knoten.push({ x: s.x, y: s.y, t: zeit });
          C6.muenzen.plus(1, 'keimflug', { x: s.x + ebene.getBoundingClientRect().left, y: s.y });
        }
      }
      if (s.x < -80) schlaufen.splice(i, 1);
    }
    faden.forEach(function (p) { p.x -= tempo * dt; });
    while (faden.length > 2 && faden[1].x < -200) faden.shift();
    knoten.forEach(function (k) { k.x -= tempo * dt; });
    zeichne();
    raf = requestAnimationFrame(schritt);
  }

  function zeichne() {
    var c = cx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = NACHT; c.fillRect(0, 0, W, H);
    // Sterne
    sterne.forEach(function (s) {
      var a = ruhig() ? .7 : .45 + .35 * Math.sin(zeit * 1.3 + s.p);
      c.globalAlpha = a; c.fillStyle = TINTE;
      var x = ((s.x * W - zeit * 8) % W + W) % W;
      c.beginPath(); c.arc(x, s.y * H, s.r, 0, 7); c.fill();
    });
    c.globalAlpha = 1;
    // Mond
    c.strokeStyle = TINTE; c.lineWidth = 2;
    c.beginPath(); c.arc(W * 0.66, 110, 26, 0, 7); c.fillStyle = '#1d2445'; c.fill(); c.stroke();
    c.beginPath(); c.arc(W * 0.66 + 12, 102, 22, 0, 7); c.fillStyle = NACHT; c.fill();
    // Hügel unten
    c.beginPath(); c.moveTo(0, H);
    for (var x = 0; x <= W + 20; x += 20) c.lineTo(x, H - 26 - 10 * Math.sin((x + zeit * 30) / 90));
    c.lineTo(W, H); c.closePath(); c.fillStyle = '#1d2445'; c.fill(); c.stroke();
    // Faden hinter Carl
    if (faden.length) {
      c.lineWidth = 2.4; c.lineCap = 'round';
      var pts = faden.concat([{ x: carl.x - 10, y: carl.y + 6, farbe: faden[faden.length - 1].farbe }]);
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i];
        c.strokeStyle = b.farbe || a.farbe;
        c.beginPath(); c.moveTo(a.x, a.y);
        var mx = (a.x + b.x) / 2, my = Math.max(a.y, b.y) + 26;
        c.quadraticCurveTo(mx, my, b.x, b.y); c.stroke();
      }
    }
    knoten.forEach(function (k) {
      c.fillStyle = TINTE; c.beginPath(); c.arc(k.x, k.y, 6, 0, 7); c.fill();
      c.strokeStyle = NACHT; c.lineWidth = 1.5; c.beginPath(); c.arc(k.x, k.y, 3, 0, 7); c.stroke();
    });
    // Schlaufen
    schlaufen.forEach(function (s) { schlaufe(c, s); });
    figur(c, carl.x, carl.y);
  }
  function schlaufe(c, s) {
    var r = s.r * (1 - s.zu * 0.75);
    c.save(); c.translate(s.x, s.y);
    c.strokeStyle = s.farbe; c.lineWidth = 3; c.lineCap = 'round';
    c.beginPath();
    for (var i = 0; i <= 40; i++) {
      var a = i / 40 * Math.PI * 2;
      var w = 1 + 0.06 * Math.sin(a * 3 + s.dreh * 2);
      var px = Math.cos(a) * r * 0.62 * w, py = Math.sin(a) * r * w;
      i ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.stroke();
    // Schwänzchen des Fadens
    c.beginPath(); c.moveTo(r * 0.1, r); c.quadraticCurveTo(r * 0.5, r + 14, r * 0.15 + Math.sin(s.dreh * 2) * 4, r + 26); c.stroke();
    c.restore();
  }
  function figur(c, x, y) {
    var k = KS;
    c.save(); c.translate(x, y);
    var neig = Math.max(-0.35, Math.min(0.35, carl.vy / 700));
    c.rotate(neig);
    // Federung: beim Flattern drückt jeder Schlag den Kiesel ein wenig, nach einer Landung wippt er nach
    var sq = ruhig() ? 0 : 0.05 * Math.sin(carl.phase) * carl.federn + 0.14 * carl.wipp * Math.sin((1 - carl.wipp) * Math.PI * 3) * carl.wipp;
    c.scale(k * (1 + sq), k * (1 - sq));
    // Keimblätter (schlagen)
    // Körper
    c.beginPath();
    c.moveTo(-80, 6);
    c.bezierCurveTo(-82, -40, -40, -66, 4, -64);
    c.bezierCurveTo(50, -64, 84, -40, 80, 6);
    c.bezierCurveTo(78, 46, 40, 58, 0, 58);
    c.bezierCurveTo(-44, 58, -78, 44, -80, 6);
    c.closePath();
    c.fillStyle = '#ebe5db'; c.fill(); c.lineWidth = 7; c.strokeStyle = '#0b0f22'; c.stroke();
    // Stiel + Keimblätter (schlagen)
    var auf = halten ? (0.5 + 0.5 * Math.sin(carl.phase)) : 0.15 + 0.08 * Math.sin(carl.phase);
    c.strokeStyle = '#0b0f22'; c.lineWidth = 9; c.lineCap = 'round';
    c.beginPath(); c.moveTo(6, -60); c.quadraticCurveTo(4, -74, 8, -84); c.stroke();
    c.strokeStyle = '#6f8460'; c.lineWidth = 4; c.stroke();
    blatt(c, 8, -84, -1, auf, 48, 19);
    blatt(c, 8, -84, 1, auf, 58, 22);
    // Wangen
    c.fillStyle = 'rgba(232,98,26,.3)';
    c.beginPath(); c.ellipse(-48, 16, 12, 7, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(54, 12, 12, 7, 0, 0, 7); c.fill();
    // Augen
    var froh = halten;
    auge(c, -22, -4, 15, froh); auge(c, 26, -10, 17, froh);
    // Beinchen baumeln
    c.strokeStyle = '#0b0f22'; c.lineWidth = 7; c.lineCap = 'round';
    var b = Math.sin(carl.phase * 0.5) * 6;
    c.beginPath(); c.moveTo(-30, 54); c.lineTo(-34 + b, 92); c.stroke();
    c.beginPath(); c.moveTo(30, 54); c.lineTo(34 - b, 92); c.stroke();
    var sock = sockenFarbe();
    c.fillStyle = sock; c.beginPath(); c.ellipse(-38 + b, 94, 15, 9, 0, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(38 - b, 94, 15, 9, 0, 0, 7); c.fill(); c.stroke();
    c.restore();
  }
  function sockenFarbe() {
    try { var a = S().laden && S().laden.an; if (a && a.sockenFarbe) return a.sockenFarbe; } catch (e) {}
    var f = S().du && S().du.socken; return (f && /^#/.test(f)) ? f : '#e8621a';
  }
  function blatt(c, x, y, seite, auf, len, w) {
    c.save(); c.translate(x, y);
    // auf = 0: Blatt weit offen (fast waagrecht), 1: hochgeschlagen
    c.rotate(seite * (1.25 - auf * 0.95));
    c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(w * 1.1, -len * 0.18, w * 1.05, -len * 0.78, w * 0.12, -len);
    c.bezierCurveTo(-w * 0.55, -len * 0.86, -w * 1.0, -len * 0.42, 0, 0);
    c.fillStyle = '#a8bc9a'; c.fill(); c.lineWidth = 6; c.strokeStyle = '#0b0f22'; c.lineJoin = 'round'; c.stroke();
    c.beginPath(); c.moveTo(0, -4); c.quadraticCurveTo(w * 0.25, -len * 0.5, w * 0.1, -len * 0.85); c.lineWidth = 2.5; c.strokeStyle = '#6f8460'; c.stroke();
    c.restore();
  }
  function auge(c, x, y, r, froh) {
    if (froh) {
      c.strokeStyle = '#0b0f22'; c.lineWidth = 7; c.beginPath(); c.arc(x, y + 4, r * 0.8, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); return;
    }
    c.fillStyle = '#f2a83a'; c.beginPath(); c.ellipse(x, y, r * 0.85, r, 0, 0, 7); c.fill();
    c.lineWidth = 5; c.strokeStyle = '#0b0f22'; c.stroke();
    c.fillStyle = '#3b2412'; c.beginPath(); c.arc(x + 3, y - 2, r * 0.45, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x + 6, y - 6, r * 0.18, 0, 7); c.fill();
  }

  var vorherFokus = null;
  C6.keimflug = {
    offen: false,
    auf: function () {
      if (this.offen) return;
      if (C6.kieselpark && C6.kieselpark.offen) C6.kieselpark.zu();
      if (!ebene) bau();
      vorherFokus = document.activeElement;
      this.offen = true; lauf = true; pause = false; zeit = 0;
      FARB = farben();
      ebene.hidden = false; ebene.classList.remove('c6s-zu');
      document.documentElement.classList.add('c6s-spiel-auf');
      groesse(); neu();
      ebene.querySelector('.c6s-flug-hinweis').classList.remove('c6s-weg');
      ebene.querySelector('.c6s-flug-karte').hidden = true;
      window.addEventListener('keydown', taste, true);
      window.addEventListener('keyup', taste, true);
      window.addEventListener('resize', groesse);
      document.addEventListener('visibilitychange', sichtbar);
      var erst = C6.muenzen.geheimnis('keimflug', 5, { x: innerWidth / 2, y: innerHeight * 0.3 });
      if (erst) { var h = ebene.querySelector('.c6s-flug-hinweis'); h.textContent = 'Du hast mein Fenster gefunden. Halten: flattern · Loslassen: gleiten'; }
      else ebene.querySelector('.c6s-flug-hinweis').textContent = 'Halten: flattern · Loslassen: gleiten';
      t0 = performance.now();
      raf = requestAnimationFrame(schritt);
      setTimeout(function () { try { ebene.focus({ preventScroll: true }); } catch (e) {} }, 50);
      emit('spiel', { was: 'keimflug', offen: true });
    },
    zu: function () {
      if (!this.offen) return;
      this.offen = false; lauf = false; halten = false;
      if (raf) cancelAnimationFrame(raf); raf = 0;
      window.removeEventListener('keydown', taste, true);
      window.removeEventListener('keyup', taste, true);
      window.removeEventListener('resize', groesse);
      document.removeEventListener('visibilitychange', sichtbar);
      document.documentElement.classList.remove('c6s-spiel-auf');
      var e = ebene;
      e.classList.add('c6s-zu');
      setTimeout(function () { if (!C6.keimflug.offen) e.hidden = true; }, 320);
      if (gefaedelt >= 3) { try { C6.sag && C6.sag(gefaedelt + ' Schlaufen. Ich häng den Faden ans Fenster.'); } catch (x) {} }
      try { vorherFokus && vorherFokus.focus && vorherFokus.focus({ preventScroll: true }); } catch (x) {}
      emit('spiel', { was: 'keimflug', offen: false });
    }
  };

  // Fenster im Zuhause (oder sonstwo) öffnet den Keimflug
  document.addEventListener('click', function (e) {
    var f = e.target && e.target.closest && e.target.closest('[data-c6s="fenster"]');
    if (f && !f.__c6sEigen) { C6.keimflug.auf(); }
  });
})();
