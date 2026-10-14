/* Zweites Album · Keimflug (aus src/module/muenzen.js, s5 gestrichen: zweites Spiel neben dem Kieselpark).
   Zurückholen: diesen Block wieder ans Ende von muenzen.js hängen; das Fenster im Zuhause braucht data-c6s="fenster". */
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
