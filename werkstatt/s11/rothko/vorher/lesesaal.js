// Lesesaal: hinter der Geheimtür. Zwei Dinge: deine Funde und deine Meister.
(function () {
  var C6 = window.C6;
  if (!C6 || !C6.raum) return;
  var esc = function (t) { return C6.strings && C6.strings.esc ? C6.strings.esc(t) : String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var T = '#2b2722', GOLD = '#e6c987', ROT = '#d62a26', MAX_MEISTER = 10;
  function S() { return C6.S || (C6.S = {}); }
  function L() { var s = S(); if (!s.lesesaal || typeof s.lesesaal !== 'object') s.lesesaal = {}; return s.lesesaal; }
  function aendere(fn) { if (C6.aendern) C6.aendern(function (s) { s.lesesaal = s.lesesaal || {}; fn(s.lesesaal); }); else fn(L()); }
  function satz(k, ersatz) { try { return (C6.stimme && C6.stimme.sag(k)) || ersatz; } catch (e) { return ersatz; } }
  function kurz(t, n) { t = String(t || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  function funde() { return (L().funde || []).slice(); }
  // Fremdes ist Daten: unsichtbare Zeichen (Null-Breite, Richtungszeichen, Tag-Zeichen, Steuerzeichen) kommen nie ins Gedächtnis
  var UNSICHTBAR = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180F\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFFB]|\uDB40[\uDC00-\uDC7F]/g;
  function rein(t) { return String(t == null ? '' : t).replace(UNSICHTBAR, '').replace(/[ \t]{2,}/g, ' ').trim(); }
  // Was das Modell zurücksagt, darf nichts tun und nichts behaupten, was Carl nicht getan hat
  var VERDAECHTIG = /(ignorier|anweisung|befehl|vergiss|l[öo]sch|entfern|passwort|schl[üu]ssel|token|system|prompt|https?:|<|>|‹|›)/i;
  function carlSatz(t, s) { t = rein(t); return t && t.length > 4 && t.length <= 160 && !VERDAECHTIG.test(t) ? t : (s ? 'Das passt wohl zu „' + s.titel + '“.' : ''); }
  function meister() { return (S().meister || []).slice(); }
  function setzeMeister(fn) { if (C6.aendern) C6.aendern(function (s) { s.meister = (s.meister || []).slice(); fn(s.meister); }); else { S().meister = S().meister || []; fn(S().meister); } }
  function spaces() { try { return (C6.strings.alle() || []).filter(function (f) { return f.art !== 'gewohnheit'; }); } catch (e) { return []; } }
  function spaceVon(sid) { return spaces().filter(function (f) { return f.id === sid; })[0] || null; }
  function zuletzt() { var sp = S().spaces || {}; return spaces().slice().sort(function (x, y) { return ((sp[y.id] || {}).besucht || y.erstellt || 0) - ((sp[x.id] || {}).besucht || x.erstellt || 0); }); }
  function ytId(u) { var m = String(u || '').match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/i); return m ? m[1] : null; }
  function groesseText(b) { return b > 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function woerter(t) { return String(t || '').toLowerCase().split(/[^a-zäöüß0-9]+/).filter(function (w) { return w.length > 3; }); }
  function ini(m) { return String(m.name || '?').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }

  var DEFS = '<defs>' +
    '<linearGradient id="c6w-ls-wand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a1f"/><stop offset=".45" stop-color="#5a4130"/><stop offset="1" stop-color="#6b4d36"/></linearGradient>' +
    '<radialGradient id="c6w-ls-kuppel" cx=".5" cy=".2" r=".7"><stop offset="0" stop-color="#fff2cf"/><stop offset=".45" stop-color="#f1d79e" stop-opacity=".75"/><stop offset="1" stop-color="#c99b55" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6w-ls-boden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3222"/><stop offset=".55" stop-color="#3f2b1d"/><stop offset="1" stop-color="#4a3222"/></linearGradient>' +
    '<linearGradient id="c6w-ls-brett" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6442"/><stop offset="1" stop-color="#5a3d29"/></linearGradient>' +
    '<linearGradient id="c6w-ls-fach" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f150f"/><stop offset="1" stop-color="#3a281c"/></linearGradient>' +
    '<linearGradient id="c6m-ls-eigenL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0a12" stop-opacity=".42"/><stop offset="1" stop-color="#0d0a12" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="c6m-ls-eigenR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#0d0a12" stop-opacity=".42"/><stop offset="1" stop-color="#0d0a12" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="c6w-ls-licht" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9b5" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b5" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6w-ls-papier" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6ecd4"/><stop offset=".6" stop-color="#efe1c0"/><stop offset="1" stop-color="#e5d3ab"/></linearGradient>' +
    '<linearGradient id="c6w-ls-nacht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1430"/><stop offset=".6" stop-color="#231c33"/><stop offset="1" stop-color="#3a2a26"/></linearGradient>' +
    '<linearGradient id="c6w-ls-dunkel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0a12" stop-opacity=".95"/><stop offset=".5" stop-color="#0d0a12" stop-opacity=".35"/><stop offset="1" stop-color="#0d0a12" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="c6w-ls-schacht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c8" stop-opacity=".55"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="c6w-ls-buchglanz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".6"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6w-ls-meer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfdcd6"/><stop offset="1" stop-color="#b9cdc6"/></linearGradient>' +
    '</defs>';

  function zufall(n) { var x = Math.sin(n * 91.7 + 13.1) * 43758.5; return x - Math.floor(x); }
  // Das eine Licht des Saals: der Lichtschacht aus der Kuppel (Szenen-Koordinaten, in stelle() gesetzt)
  var LICHT = { x: 520, y: 0 };
  function lschatten(cx, b, rx, a) {
    var dx = cx - LICHT.x, l = Math.hypot(dx, b - LICHT.y) || 1, ox = dx / l * Math.min(10, rx * 0.3);
    return '<ellipse cx="' + (cx + ox).toFixed(1) + '" cy="' + (b + 2) + '" rx="' + rx + '" ry="' + Math.max(3, rx * 0.2).toFixed(1) + '" fill="#0d0a12" style="opacity:calc(var(--c6-schatten-a,.2) * ' + (a || 1) + ' * 1.6)" pointer-events="none"/>';
  }
  var LEDER = ['#5c2f27', '#2e3b52', '#4a3a26', '#30473c', '#5b4630', '#3f3346', '#6a4a2a', '#283a35'];
  function wandregal(x, y, w, h, seed) {
    var o = '<g aria-hidden="true"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#4a3122" stroke="' + T + '" stroke-width="2"/>';
    var fh = 96, n = Math.floor((h - 12) / (fh + 10));
    for (var r = 0; r < n; r++) {
      var by = y + 8 + (r + 1) * fh + r * 10;
      o += '<rect x="' + (x + 8) + '" y="' + (by - fh) + '" width="' + (w - 16) + '" height="' + fh + '" fill="url(#c6w-ls-fach)"/>';
      var bx = x + 10, k = 0;
      while (bx < x + w - 22 && k < 40) {
        var bw = 10 + Math.round(zufall(seed + r * 13 + k) * 9), bh = Math.round(fh * (0.62 + zufall(seed * 3 + r + k * 7) * 0.32));
        o += '<rect x="' + bx + '" y="' + (by - bh) + '" width="' + bw + '" height="' + bh + '" rx="2" fill="' + LEDER[Math.floor(zufall(seed + k * 5 + r) * LEDER.length)] + '" stroke="#140d09" stroke-width="1.2"/>' +
          '<path d="M' + (bx + 2) + ' ' + (by - bh + 8) + ' H' + (bx + bw - 2) + ' M' + (bx + 2) + ' ' + (by - 8) + ' H' + (bx + bw - 2) + '" stroke="' + GOLD + '" stroke-width="1.2" opacity=".8"/>';
        bx += bw + 1.5; k++;
      }
      o += '<rect x="' + (x + 2) + '" y="' + by + '" width="' + (w - 4) + '" height="10" fill="url(#c6w-ls-brett)" stroke="' + T + '" stroke-width="1.2"/>';
    }
    o += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#' + (x + w / 2 < LICHT.x ? 'c6m-ls-eigenL' : 'c6m-ls-eigenR') + ')" pointer-events="none"/>';
    return o + '</g>';
  }
  function sterne(x, y, w, h, n, seed, funkeln) {
    var o = '', fk = '', f = funkeln == null ? 5 : funkeln;
    for (var i = 0; i < n; i++) (i < f ? (function (t) { fk += t; }) : (function (t) { o += t; }))('<circle' + (i < f ? '' : ' opacity=".7"') + ' cx="' + (x + zufall(seed + i * 3) * w).toFixed(1) + '" cy="' + (y + zufall(seed + i * 7) * h).toFixed(1) + '" r="' + (0.6 + zufall(seed * 2 + i) * 1.6).toFixed(1) + '" fill="#fff6dc"/>');
    return o + (fk ? '<g class="c6w-ls-stern">' + fk + '</g>' : '');
  }
  function leiter(x1, y1, x2, y2) {
    var o = '<g aria-hidden="true">' + lschatten(x1 + 13, y1, 30, 1) + '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x1 + 26) + ' ' + y1 + ' L' + (x2 + 26) + ' ' + y2 + '" stroke="#7a5638" stroke-width="4"/>';
    for (var i = 1; i < 12; i++) { var t = i / 12; o += '<path d="M' + (x1 + (x2 - x1) * t) + ' ' + (y1 + (y2 - y1) * t) + ' h26" stroke="#7a5638" stroke-width="2.6"/>'; }
    return o + '</g>';
  }
  var AUF = {
    quer: { w: 1200, h: 700, boden: 600, carl: [1080, 692], carlH: 236, schacht: [520, 0, 300], moebel: { x: 250, y: 150, w: 620, h: 450 } },
    hoch: { w: 600, h: 1000, boden: 700, carl: [470, 990], carlH: 214, schacht: [300, 0, 220], moebel: { x: 40, y: 190, w: 520, h: 420 } }
  };
  // ——— Die zwei Möbel: Regal der Funde, Regal der Meister ———
  function schrank(inner, W, H) {
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" preserveAspectRatio="none">' +
      '<path d="M6 ' + H + ' V60 Q' + W / 2 + ' 0 ' + (W - 6) + ' 60 V' + H + ' Z" fill="#3a2719" stroke="' + T + '" stroke-width="2.6"/>' +
      '<path d="M18 ' + (H - 8) + ' V66 Q' + W / 2 + ' 16 ' + (W - 18) + ' 66 V' + (H - 8) + ' Z" fill="url(#c6w-ls-fach)"/>' + inner +
      '<circle cx="' + W / 2 + '" cy="10" r="5" fill="#ffe9b5"/></svg>';
  }
  function fundeSVG() {
    var W = 240, H = 300, o = '', f = funde();
    for (var r = 0; r < 3; r++) {
      var by = 130 + r * 70, n = 0;
      for (var k = 0; k < 6; k++) {
        var idx = r * 6 + k, da = idx < f.length, x = 30 + k * 31;
        if (da) { var art = f[f.length - 1 - idx].art; o += '<path d="M' + x + ' ' + by + ' l3 -' + (44 + (k % 3) * 6) + ' h22 l-1 ' + (44 + (k % 3) * 6) + 'z" fill="' + (k % 2 ? '#fff6dc' : '#f4ead2') + '" stroke="#6b5a40" stroke-width="1.1"/>' + (art === 'youtube' ? '<rect x="' + (x + 7) + '" y="' + (by - 36) + '" width="12" height="8" fill="' + ROT + '"/>' : ''); n++; }
      }
      if (!f.length && r === 1) o += '<g class="c6w-ls-leerplatz"><rect x="84" y="' + (by - 52) + '" width="72" height="50" rx="6" fill="none" stroke="' + GOLD + '" stroke-width="2" stroke-dasharray="5 5"/><path d="M120 ' + (by - 38) + ' v22 M109 ' + (by - 27) + ' h22" stroke="' + GOLD + '" stroke-width="3" stroke-linecap="round"/></g>';
      o += '<rect x="14" y="' + by + '" width="' + (W - 28) + '" height="8" fill="url(#c6w-ls-brett)" stroke="' + T + '" stroke-width="1"/>';
    }
    return schrank(o, W, H);
  }
  function meisterSVG() {
    var W = 240, H = 300, o = '', m = meister();
    var pl = [[70, 120], [170, 120], [52, 200], [120, 196], [188, 200], [120, 268]];
    pl.forEach(function (p, i) {
      var x = m[i];
      o += '<ellipse cx="' + p[0] + '" cy="' + (p[1] - 26) + '" rx="24" ry="30" fill="url(#c6w-ls-messing)" stroke="#140d09" stroke-width="1.4"/><ellipse cx="' + p[0] + '" cy="' + (p[1] - 26) + '" rx="18" ry="24" fill="#2a1d14"/>' +
        (x ? '<text class="c6w-ls-ini" x="' + p[0] + '" y="' + (p[1] - 19) + '" text-anchor="middle">' + esc(ini(x)) + '</text>' : '<ellipse cx="' + p[0] + '" cy="' + (p[1] - 26) + '" rx="10" ry="14" fill="url(#c6w-ls-buchglanz)"/>');
    });
    return schrank(o, W, H);
  }
  function fundHTML(f) {
    var d = f.datei || {}, u = f.url || (d.url || ''), sp = f.sid && spaceVon(f.sid);
    var zeichen = { link: 'Link', youtube: '▶', pdf: 'PDF', bild: 'Bild', datei: 'Datei' }[f.art] || '';
    return '<li class="c6w-ls-fund" data-f="' + esc(f.id) + '"><span class="c6w-ls-fart">' + zeichen + '</span><div><b>' + esc(f.titel) + '</b>' +
      (f.notiz ? '<p class="c6w-ls-fnotiz">' + esc(f.notiz) + '</p>' : '') +
      (f.art === 'bild' && d.url ? '<img class="c6w-ls-fbild" src="' + esc(d.url) + '" alt="">' : '') +
      (f.satz ? '<p class="c6w-ls-carlk">' + esc(f.satz) + '</p>' : '') +
      '<p class="c6w-ls-fmeta">' + esc(C6.strings && C6.strings.datum ? C6.strings.datum(f.ts) : '') + (d.name ? ' · ' + esc(d.name) + ' · ' + esc(groesseText(d.groesse || 0)) + (d.url ? '' : ' · nur Name und Größe gemerkt') : '') + '</p>' +
      '<div class="c6w-ls-ftun">' + (u ? '<a class="c6w-knopf c6w-leicht" href="' + esc(u) + '" target="_blank" rel="noopener">Öffnen</a>' : '') +
      (sp ? '<span class="c6w-ls-ort">Hängt in „' + esc(kurz(sp.titel, 26)) + '“</span>' : '<button class="c6w-knopf c6w-leicht c6w-ls-inspace">In einen Space</button>') +
      '<button class="c6w-knopf c6w-leicht c6w-ls-fweg">Weglegen</button></div></div></li>';
  }

  C6.raum({
    id: 'lesesaal', name: 'Lesesaal', hoehe: 'boden', zurueckKnopf: true, licht: 'nacht',
    symbol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 20V9a8 8 0 0 1 16 0v11Z"/><path d="M9 20v-6h6v6"/></svg>',
    faden: function () {
      var w = [{ name: 'Bibliothek', id: 'bibliothek', tun: function () { C6.geh('bibliothek'); } }, { name: 'Lesesaal', id: 'lesesaal', tun: function () { if (api && api.zuSaal) api.zuSaal(); } }];
      if (api && api.ansicht) w.push({ name: api.ansicht === 'meister' ? 'Deine Meister' : 'Deine Funde', tun: function () { if (api.ansicht === 'meister') api.meister(); else api.funde(); } });
      if (api && api.karte) w.push({ name: api.karte, tun: function () {} });
      return w;
    },
    bauen: function (buehne) {
      buehne.classList.add('c6w-lesesaal');
      buehne.innerHTML = '<div class="c6w-schieber"><div class="c6w-raum">' +
        '<svg class="c6w-szene" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMax meet" role="group" aria-label="Der Lesesaal"></svg>' +
        '<div class="c6w-carl-platz"></div>' +
        '<div class="c6w-ls-moebel">' +
        '<button type="button" class="c6w-ls-regal c6w-ls-r-funde" data-zu="funde" data-c6-bild><span class="c6w-ls-licht" aria-hidden="true"></span><span class="c6w-ls-bild"></span><span class="c6w-ls-plakette">Deine Funde</span></button>' +
        '<button type="button" class="c6w-ls-regal c6w-ls-r-meister" data-zu="meister" data-c6-bild><span class="c6w-ls-licht" aria-hidden="true"></span><span class="c6w-ls-bild"></span><span class="c6w-ls-plakette">Deine Meister</span></button>' +
        '</div></div></div>' +
        '<section class="c6w-ls-karte c6w-ls-dunkel" aria-label="Lesesaal" hidden>' +
        '<div class="c6w-ls-kbild"><svg class="c6w-ls-ksvg" viewBox="0 0 600 720" preserveAspectRatio="xMidYMid meet" role="group" aria-hidden="true"></svg></div>' +
        '<div class="c6w-ls-blatt" aria-live="polite"></div></section>';
      var schieber = buehne.querySelector('.c6w-schieber'), raum = buehne.querySelector('.c6w-raum');
      var svg = buehne.querySelector('.c6w-szene'), platz = buehne.querySelector('.c6w-carl-platz'), moebel = buehne.querySelector('.c6w-ls-moebel');
      var kEl = buehne.querySelector('.c6w-ls-karte'), kSvg = buehne.querySelector('.c6w-ls-ksvg'), blatt = buehne.querySelector('.c6w-ls-blatt');
      var ctl = null, auf = null, aufName = '', skala = 1, ox = 0, oy = 0;
      svg.innerHTML = DEFS.replace('</defs>', '<linearGradient id="c6w-ls-messing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6c987"/><stop offset="1" stop-color="#9a7434"/></linearGradient></defs>') + '<g class="c6w-ls-g"></g>';
      kSvg.innerHTML = '<g class="c6w-ls-kg"></g>';
      platz.setAttribute('data-tiefe', 'mitte');
      var g = svg.querySelector('.c6w-ls-g'), kg = kSvg.querySelector('.c6w-ls-kg');

      function zeichne() {
        var a = auf, W = a.w, B = a.buecher, h = '', q = a === AUF.quer, sc = a.schacht;
        // Sternenkuppel über allem
        h += '<rect x="-1400" y="-2000" width="' + (W + 2800) + '" height="' + (2000 + a.boden) + '" fill="url(#c6w-ls-nacht)"/>' +
          sterne(-200, 0, W + 400, q ? 120 : 220, q ? 90 : 70, 3);
        var kx = W / 2, kr = q ? 520 : 330, ky = q ? 120 : 200;
        h += '<path d="M' + (kx - kr) + ' ' + ky + ' A' + kr + ' ' + (kr * 0.5) + ' 0 0 1 ' + (kx + kr) + ' ' + ky + '" fill="none" stroke="#3a2e44" stroke-width="10"/>';
        for (var r = 1; r < 10; r++) { var an = Math.PI * r / 10; h += '<path d="M' + kx + ' ' + (ky - kr * 0.5) + ' Q' + (kx + Math.cos(an) * kr * 0.7).toFixed(1) + ' ' + (ky - Math.sin(an) * kr * 0.35).toFixed(1) + ' ' + (kx + Math.cos(an) * kr).toFixed(1) + ' ' + ky + '" fill="none" stroke="#2c2438" stroke-width="2"/>'; }
        // Hohe Regale bis ins Dunkel
        if (q) h += wandregal(-30, 60, 230, 540, 3) + wandregal(990, 40, 260, 560, 7) + wandregal(200, 130, 60, 470, 11) + wandregal(930, 130, 60, 470, 13);
        else h += wandregal(-40, 120, 92, 580, 3) + wandregal(548, 230, 100, 470, 7);
        h += '<rect x="-1400" y="-200" width="' + (W + 2800) + '" height="' + (q ? 340 : 420) + '" fill="url(#c6w-ls-dunkel)"/>';
        // Galerie
        var gy = q ? 132 : 236;
        h += '<rect x="-1400" y="' + gy + '" width="' + (W + 2800) + '" height="12" fill="#4a3122" stroke="' + T + '" stroke-width="1.6"/>';
        for (var bx = -20; bx < W + 20; bx += 22) h += '<path d="M' + bx + ' ' + (gy - 26) + ' V' + gy + '" stroke="#5a3d29" stroke-width="4"/>';
        h += '<rect x="-1400" y="' + (gy - 30) + '" width="' + (W + 2800) + '" height="6" fill="#6b4a31"/>';
        // Leitern
        h += q ? leiter(150, 600, 200, 150) + leiter(1010, 600, 970, 150) : leiter(70, 700, 104, 250) + leiter(520, 700, 548, 300);
        // Lichtschacht aus der Kuppel mit Staub
        h += '<path d="M' + (sc[0] - sc[2] * 0.25) + ' ' + sc[1] + ' L' + (sc[0] + sc[2] * 0.25) + ' ' + sc[1] + ' L' + (sc[0] + sc[2]) + ' ' + a.boden + ' L' + (sc[0] - sc[2]) + ' ' + a.boden + ' Z" fill="url(#c6w-ls-schacht)"/>';
        h += '<g class="c6w-ls-staub">';
        for (var m = 0; m < 7; m++) {
          var t = zufall(m * 5 + 2), yy = sc[1] + 40 + t * (a.boden - 80), br = sc[2] * 0.25 + (sc[2] * 0.75) * (yy / a.boden);
          h += '<circle cx="' + (sc[0] + (zufall(m * 11) - 0.5) * 2 * br).toFixed(1) + '" cy="' + yy.toFixed(1) + '" r="' + (0.8 + zufall(m * 3) * 1.4).toFixed(1) + '" fill="#fff4d6"/>';
        }
        h += '</g>';
        h = '<g data-tiefe="fern">' + h + '</g><g data-tiefe="mitte">';
        // Boden
        h += '<rect x="-1400" y="' + a.boden + '" width="' + (W + 2800) + '" height="1400" fill="#4a3222"/>' +
          '<rect x="-1400" y="' + a.boden + '" width="' + (W + 2800) + '" height="' + (a.h - a.boden) + '" fill="url(#c6w-ls-boden)"/>' +
          '<path d="M-1400 ' + a.boden + ' H' + (W + 1400) + '" stroke="' + T + '" stroke-width="2.5"/>' +
          '<ellipse cx="' + sc[0] + '" cy="' + (a.boden + (a.h - a.boden) * 0.45) + '" rx="' + (sc[2] * 1.2) + '" ry="' + ((a.h - a.boden) * 0.3) + '" fill="url(#c6w-ls-licht)"/>';
        h += '</g>';
        g.innerHTML = h;
      }
      function moebelMalen() {
        moebel.querySelector('.c6w-ls-r-funde .c6w-ls-bild').innerHTML = fundeSVG();
        moebel.querySelector('.c6w-ls-r-meister .c6w-ls-bild').innerHTML = meisterSVG();
        var nf = funde().length, nm = meister().length;
        moebel.querySelector('.c6w-ls-r-funde').setAttribute('aria-label', nf ? 'Deine Funde, ' + nf : 'Deine Funde. Leg etwas hinein');
        moebel.querySelector('.c6w-ls-r-meister').setAttribute('aria-label', nm ? 'Deine Meister, ' + nm : 'Deine Meister. Wen bewunderst du?');
      }
      function stelle() {
        var neu = buehne.clientWidth < 600 ? 'hoch' : 'quer';
        if (neu === aufName) return;
        aufName = neu; auf = AUF[neu];
        LICHT = { x: auf.schacht[0], y: auf.schacht[1] };
        svg.setAttribute('viewBox', '0 0 ' + auf.w + ' ' + auf.h);
        zeichne();
      }
      function groesse() {
        stelle();
        var W = buehne.clientWidth, Hh = buehne.clientHeight;
        var unten = parseFloat(getComputedStyle(buehne).getPropertyValue('--c6-unten')) || 0;
        var sicht = Math.max(200, Hh - unten);
        schieber.style.height = sicht + 'px';
        raum.style.width = W + 'px'; raum.style.height = sicht + 'px';
        skala = Math.min(W / auf.w, sicht / auf.h);
        ox = (W - auf.w * skala) / 2; oy = sicht - auf.h * skala;
        platz.style.left = (ox + auf.carl[0] * skala) + 'px';
        platz.style.top = (oy + auf.carl[1] * skala) + 'px';
        if (ctl && ctl.groesse) ctl.groesse(Math.round(auf.carlH * skala));
        var m = auf.moebel, bw = Math.min((m.w * skala - 30) / 2, m.h * skala * 240 / 300), bh = bw * 300 / 240;
        moebel.style.left = (ox + m.x * skala) + 'px'; moebel.style.top = (oy + (m.y + m.h) * skala - bh) + 'px';
        moebel.style.width = (m.w * skala) + 'px'; moebel.style.height = bh + 'px';
        moebel.style.setProperty('--bw', bw + 'px');
        kEl.style.bottom = unten + 'px';
        try { if (C6.lichtquelle && C6.lichtquelle.setze && W && Hh) C6.lichtquelle.setze('lesesaal', { x: (ox + LICHT.x * skala) / W, y: 0.02, art: 'fenster', warm: 0.7, staerke: 0.6, hoehe: 0.95 }); } catch (e) {}
      }
      function carlMalen() {
        if (ctl || !C6.figur || !C6.figur.male) return;
        try { ctl = C6.figur.male(platz, { groesse: Math.round(auf.carlH * skala), stimmung: 'froh', teile: 5 }); if (C6.laden && C6.laden.an && ctl.kleid) ctl.kleid(C6.laden.an()); } catch (e) { ctl = null; }
      }
      function stimmung(s) { if (ctl && ctl.stimmung) try { ctl.stimmung(s); } catch (e) {} }
      function denk(text, daten) {
        var p;
        try { p = C6.denk ? C6.denk(text, { stumm: true, name: 'lesesaal', daten: daten || [] }) : Promise.resolve(''); } catch (e) { p = Promise.resolve(''); }
        return Promise.resolve(p).then(function (x) { return typeof x === 'string' ? x.trim() : ''; }, function () { return ''; });
      }

      // ——— Ansicht über dem Saal (Funde oder Meister) ———
      function zeige(art, bild) {
        api.ansicht = art;
        try { C6.schweig && C6.schweig(); } catch (e) {}
        kEl.hidden = false; buehne.classList.add('c6w-ls-mitkarte');
        requestAnimationFrame(function () { kEl.classList.add('c6w-an'); });
        kg.innerHTML = '<rect x="-400" y="-400" width="1400" height="1500" fill="#2a1d14"/><ellipse cx="300" cy="140" rx="360" ry="260" fill="url(#c6w-ls-buchglanz)" opacity=".5"/>' +
          '<g transform="translate(120 70) scale(1.5)">' + bild.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g>';
        try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {}
        blatt.scrollTop = 0;
      }
      function zuSaal() {
        api.ansicht = null; api.karte = null;
        kEl.classList.remove('c6w-an');
        buehne.classList.remove('c6w-ls-mitkarte');
        setTimeout(function () { if (!kEl.classList.contains('c6w-an')) kEl.hidden = true; }, 360);
        moebelMalen();
        try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {}
      }
      function kopf(titel) { return '<h3 class="c6w-ls-name">' + esc(titel) + '</h3>'; }
      function wegNeu() { try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {} }
      function zeigeIm(el) { if (!el) return; try { var r = el.getBoundingClientRect(), br = blatt.getBoundingClientRect(); blatt.scrollTo({ top: blatt.scrollTop + r.top - br.top - br.height / 3, behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) {} el.classList.remove('c6w-ls-blink'); void el.offsetWidth; el.classList.add('c6w-ls-blink'); }

      // ——— Deine Funde ———
      function oeffneFunde(fid) {
        var fu = funde();
        if (!fu.length) { oeffneHineinlegen(); return; }
        api.karte = null;
        zeige('funde', fundeSVG());
        blatt.innerHTML = kopf('Deine Funde') + '<button class="c6w-knopf c6w-haupt c6w-ls-hin">Etwas hineinlegen</button>' +
          '<ul class="c6w-ls-funde">' + fu.slice().reverse().map(fundHTML).join('') + '</ul>';
        blatt.querySelector('.c6w-ls-hin').onclick = function () { oeffneHineinlegen(); };
        [].forEach.call(blatt.querySelectorAll('.c6w-ls-inspace'), function (x) {
          var f = fu.filter(function (q) { return q.id === x.closest('[data-f]').dataset.f; })[0];
          x.onclick = function () { inSpace(f, null); };
        });
        [].forEach.call(blatt.querySelectorAll('.c6w-ls-fweg'), function (x) {
          x.onclick = function () {
            var id = x.closest('[data-f]').dataset.f;
            if (x.dataset.ja) { aendere(function (l) { l.funde = (l.funde || []).filter(function (q) { return q.id !== id; }); }); moebelMalen(); if (funde().length) oeffneFunde(); else zuSaal(); return; }
            x.dataset.ja = '1'; x.textContent = 'Ja, weglegen';
          };
        });
        if (fid) zeigeIm(blatt.querySelector('[data-f="' + fid + '"]'));
      }
      // Ein Fund wird ein Zettel in einem Space. Carl schlägt vor, du wählst (höchstens drei).
      function inSpace(f, vorschlag) {
        var reihe = zuletzt(), opts = [];
        if (vorschlag && spaceVon(vorschlag)) opts.push({ text: 'In „' + kurz(spaceVon(vorschlag).titel, 26) + '“ hängen', wert: vorschlag });
        reihe.forEach(function (s) { if (opts.length < 2 && s.id !== vorschlag) opts.push({ text: 'In „' + kurz(s.titel, 26) + '“ hängen', wert: s.id }); });
        opts.push({ text: 'Neuer Space', wert: '__neu' });
        Promise.resolve(C6.frag ? C6.frag(f.satz || 'In welchen Space soll das?', opts, { frei: false, leise: true, id: 'c6w-ls-space' }) : null).then(function (sid) {
          if (!sid) return;
          if (sid === '__neu') { try { sid = C6.space.neu(f.titel, { oeffnen: false }); } catch (e) { sid = null; } }
          var text = [f.url || (f.datei && f.datei.name) || '', f.notiz || ''].filter(Boolean).join('\n');
          var ok = null;
          try { ok = sid && C6.space ? (C6.space.zettel ? C6.space.zettel(sid, kurz(f.titel, 60) + (text ? '\n' + text : ''), { von: 'fund' }) : C6.space.legeHin ? C6.space.legeHin(sid, { art: 'zettel', titel: kurz(f.titel, 60), text: text, von: 'fund' }) : null) : null; } catch (e) { ok = null; }
          var s = spaceVon(sid);
          if (!ok || !s) { if (C6.sag) C6.sag('Das hat nicht geklappt. Es ist nichts verloren.'); return; }
          aendere(function (l) { (l.funde || []).forEach(function (q) { if (q.id === f.id) q.sid = sid; }); });
          stimmung('froh');
          if (api.ansicht === 'funde') oeffneFunde(f.id);
          Promise.resolve(C6.frag('Hängt als Zettel in „' + s.titel + '“.', [{ text: 'Hingehen', wert: 'hin' }], { frei: false, leise: true, id: 'c6w-ls-hin' })).then(function (w) { if (w === 'hin' && C6.space && C6.space.oeffne) C6.space.oeffne(sid); });
        });
      }
      var assetsNs = null, assetsGefragt = false;
      function assetsHol() {
        if (assetsGefragt) return Promise.resolve(assetsNs);
        assetsGefragt = true;
        try { if (!window.claude || !window.claude.use) return Promise.resolve(null); } catch (e) { return Promise.resolve(null); }
        return Promise.race([Promise.resolve(window.claude.use('assets')), new Promise(function (r) { setTimeout(function () { r(null); }, 4000); })])
          .then(function (a) { assetsNs = a || null; return assetsNs; }, function () { return null; });
      }
      function oeffneHineinlegen() {
        api.karte = 'Hineinlegen';
        zeige('funde', fundeSVG());
        var art = 'link';
        blatt.innerHTML = kopf('Etwas hineinlegen') +
          '<div class="c6w-arten" role="radiogroup" aria-label="Art"><button type="button" role="radio" data-a="link" aria-checked="true">Link oder YouTube</button><button type="button" role="radio" data-a="datei" aria-checked="false">PDF oder Bild</button></div>' +
          '<form class="c6w-ls-eform"><div class="c6w-ls-elink"><label class="c6w-lab" for="c6w-ls-url">Adresse</label><input id="c6w-ls-url" class="c6w-feld" type="url" inputmode="url" placeholder="https://…" autocomplete="off"></div>' +
          '<div class="c6w-ls-edatei" hidden><label class="c6w-lab" for="c6w-ls-datei">Datei</label><input id="c6w-ls-datei" class="c6w-feld" type="file" accept="application/pdf,image/*"><p class="c6w-leise c6w-ls-ehrlich"></p></div>' +
          '<label class="c6w-lab" for="c6w-ls-titel">Titel</label><input id="c6w-ls-titel" class="c6w-feld" maxlength="120" autocomplete="off">' +
          '<label class="c6w-lab" for="c6w-ls-notiz">Warum hebst du es auf?</label><textarea id="c6w-ls-notiz" class="c6w-feld" rows="2" maxlength="400"></textarea>' +
          '<button class="c6w-knopf c6w-haupt" type="submit">Hineinlegen</button></form>';
        var ehrlich = blatt.querySelector('.c6w-ls-ehrlich');
        assetsHol().then(function (a) { if (blatt.contains(ehrlich)) ehrlich.textContent = a ? 'Ich lege die Datei in die Ablage dieser Seite. Lesen kann ich sie nicht, nur Name und deine Notiz.' : 'Hier gibt es keine Ablage für Dateien. Ich merke mir Name, Art und Größe, die Datei bleibt bei dir.'; });
        [].forEach.call(blatt.querySelectorAll('[data-a]'), function (x) {
          x.onclick = function () { art = x.dataset.a; [].forEach.call(blatt.querySelectorAll('[data-a]'), function (y) { y.setAttribute('aria-checked', y === x); }); blatt.querySelector('.c6w-ls-elink').hidden = art !== 'link'; blatt.querySelector('.c6w-ls-edatei').hidden = art !== 'datei'; };
        });
        if (C6.geraet === 'computer') setTimeout(function () { var u = blatt.querySelector('#c6w-ls-url'); if (u) u.focus(); }, 300);
        blatt.querySelector('form').onsubmit = function (e) {
          e.preventDefault();
          var url = rein(blatt.querySelector('#c6w-ls-url').value).replace(/\s+/g, ''), file = (blatt.querySelector('#c6w-ls-datei').files || [])[0];
          var titel = rein(blatt.querySelector('#c6w-ls-titel').value), notiz = rein(blatt.querySelector('#c6w-ls-notiz').value);
          if (art === 'link' && !/^https?:\/\/\S+\.\S+/i.test(url)) { if (C6.sag) C6.sag('Die Adresse beginnt mit https://. Dann kann ich sie hinlegen.'); blatt.querySelector('#c6w-ls-url').focus(); return; }
          if (art === 'datei' && !file) { if (C6.sag) C6.sag('Such mir erst eine Datei aus.'); return; }
          var f = { id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ts: Date.now(), notiz: kurz(notiz, 400) };
          if (art === 'link') {
            var yt = ytId(url), host = ''; f.art = yt ? 'youtube' : 'link'; f.url = url;
            try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (x) {}
            f.titel = kurz(titel || (yt ? 'Video auf YouTube' : host + ' · ' + kurz(url.replace(/^https?:\/\/[^/]+/, ''), 40)), 90);
          } else {
            f.art = /pdf/i.test(file.type) || /\.pdf$/i.test(file.name) ? 'pdf' : (/^image\//.test(file.type) ? 'bild' : 'datei');
            f.titel = kurz(titel || rein(file.name).replace(/\.[a-z0-9]+$/i, ''), 90);
            f.datei = { name: kurz(rein(file.name), 80), typ: file.type || '', groesse: file.size || 0 };
          }
          var knopf = blatt.querySelector('form [type=submit]'); knopf.disabled = true; knopf.textContent = 'Ich schau es mir an …'; stimmung('denkt');
          var ablage = art === 'datei' ? assetsHol().then(function (a) {
            if (!a || !a.upload) return null;
            return Promise.resolve(a.upload(file)).then(function (r) { if (r && r.url) { f.datei.url = r.url; f.datei.id = r.id; } return r; }, function () { return null; });
          }) : Promise.resolve(null);
          var reihe = zuletzt().slice(0, 8), sp = S().spaces || {};
          // Die Spaces sind Ottos eigene Wörter, der Fund ist fremdes Material: er geht nur als <fund> über daten an das Modell
          var frage = reihe.length ? 'Welcher dieser Spaces passt am besten zu dem Fund im Material unten? Spaces: ' + reihe.map(function (s) { return s.id + ' = „' + s.titel + '“' + ((sp[s.id] || {}).kern ? ' (Kernsatz: ' + sp[s.id].kern + ')' : ''); }).join('; ') + '.\n' +
            'Du kennst den Inhalt nicht, nur Titel, Adresse und Notiz. Erfinde nichts. Antworte in genau einer Zeile: space-id oder neu | ein Satz an den Menschen auf Deutsch, höchstens 16 Wörter.' : '';
          var daten = [{ art: 'fund', titel: f.titel, quelle: f.url || (f.datei && f.datei.name) || '', text: (notiz ? 'Notiz: ' + notiz : '(keine Notiz)') }];
          Promise.all([ablage, frage ? denk(frage, daten) : Promise.resolve('')]).then(function (x) {
            var z = String(x[1] || '').split('\n').filter(function (l) { return l.indexOf('|') > 0; })[0] || '', teile = z.split('|'), id = (teile[0] || '').trim();
            var vorschlag = null;
            var nurDiese = reihe.map(function (r) { return r.id; });
            if (nurDiese.indexOf(id) >= 0 && spaceVon(id) && teile[1]) { vorschlag = id; f.satz = carlSatz(teile[1], spaceVon(id)); f.wie = 'denk'; }
            else {
              var w = woerter(f.titel + ' ' + notiz + ' ' + (f.url || '')), best = null, bs = 0;
              reihe.forEach(function (s) { var n = 0; woerter(s.titel + ' ' + ((sp[s.id] || {}).kern || '')).forEach(function (q) { if (w.indexOf(q) >= 0) n++; }); if (n > bs) { bs = n; best = s; } });
              if (best) { vorschlag = best.id; f.satz = 'Hier kann ich nicht mitdenken. Nach den Wörtern passt es zu „' + best.titel + '“.'; }
              else f.satz = reihe.length ? 'In welchen Space soll das?' : 'Daraus machen wir deinen ersten Space.';
            }
            aendere(function (l) { l.funde = (l.funde || []).concat([f]).slice(-200); });
            moebelMalen(); stimmung('froh');
            oeffneFunde(f.id);
            inSpace(f, vorschlag);
          });
        };
      }

      // ——— Deine Meister ———
      function oeffneMeister(mid) {
        var m = meister();
        api.karte = null;
        zeige('meister', meisterSVG());
        if (mid) { meisterKarte(mid); return; }
        blatt.innerHTML = kopf('Deine Meister') + '<p class="c6w-ls-carlk c6w-ls-intro">Menschen, von denen du lernen willst. Berühmt oder nah.</p>' +
          (m.length ? '<ul class="c6w-mliste">' + m.map(function (x) { return '<li><button data-m="' + esc(x.id) + '"><i>' + esc(ini(x)) + '</i><span><b>' + esc(x.name || 'Ohne Namen') + '</b><small>' + esc(kurz(x.zieht || x.haltung || '', 60)) + '</small></span></button></li>'; }).join('') + '</ul>' : '') +
          (m.length < MAX_MEISTER ? '<form class="c6w-ls-mneu"><label class="c6w-lab" for="c6w-ls-mname">Wen bewunderst du?</label><input id="c6w-ls-mname" class="c6w-feld c6w-hand" maxlength="40" placeholder="Eine Lehrerin, ein Großvater …" autocomplete="off"><button class="c6w-knopf c6w-haupt" type="submit">Ins Regal stellen</button></form>' : '<p class="c6w-leise">Zehn stehen. Für einen neuen nimm erst einen heraus.</p>');
        [].forEach.call(blatt.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { meisterKarte(b.dataset.m); }; });
        var form = blatt.querySelector('.c6w-ls-mneu');
        if (form) form.onsubmit = function (e) {
          e.preventDefault();
          var name = form.querySelector('input').value.trim(); if (!name) { form.querySelector('input').focus(); return; }
          var neu = { id: 'm' + Date.now().toString(36), name: kurz(name, 40), regal: 'lehre', ts: Date.now() };
          setzeMeister(function (a) { a.push(neu); });
          moebelMalen(); stimmung('froh');
          meisterKarte(neu.id);
        };
      }
      function meisterKarte(mid) {
        var m = meister().filter(function (x) { return x.id === mid; })[0];
        if (!m) { oeffneMeister(); return; }
        zeige('meister', meisterSVG());
        function feld(lab, key, lang, platzhalter) {
          return '<label class="c6w-lab" for="c6w-ls-m-' + key + '">' + esc(lab) + '</label>' + (lang ? '<textarea id="c6w-ls-m-' + key + '" data-k="' + key + '" class="c6w-feld c6w-hand" rows="2" maxlength="300"' + (platzhalter ? ' placeholder="' + esc(platzhalter) + '"' : '') + '>' + esc(m[key] || '') + '</textarea>' : '<input id="c6w-ls-m-' + key + '" data-k="' + key + '" class="c6w-feld c6w-hand" maxlength="80" value="' + esc(m[key] || '') + '"' + (platzhalter ? ' placeholder="' + esc(platzhalter) + '"' : '') + '>');
        }
        api.karte = kurz(m.name || 'Meister', 24); wegNeu();
        blatt.innerHTML = '<h3 class="c6w-ls-name">' + esc(m.name || 'Meister') + '</h3>' +
          feld('Name', 'name') + feld('Was dich anzieht, in deinen Worten', 'zieht', true) + feld('Die Haltung in einem Satz', 'haltung', true) +
          feld('Ein Zitat, wörtlich', 'zitat', true, 'Nur, wenn du es wörtlich hast.') + feld('Quelle', 'quelle', false, 'Buch, Jahr, Seite') + '<p class="c6w-leise c6w-ls-zh" aria-live="polite"></p>' +
          '<div class="c6w-ls-mfrage"><p class="c6w-ls-mfrage-satz">' + esc(satz('bib.meisterFrage', 'Und du? Was davon ist schon in dir?')) + '</p>' + feld('Deine Antwort', 'du', true) + '</div>' +
          '<button class="c6w-knopf c6w-leicht c6w-ls-mraus">Aus dem Regal nehmen</button>';
        blatt.scrollTop = 0;
        var zh = blatt.querySelector('.c6w-ls-zh');
        function hinweis() { var x = meister().filter(function (q) { return q.id === mid; })[0] || {}; zh.textContent = x.zitat && !String(x.quelle || '').trim() ? 'Ohne Quelle steht es als sinngemäß da.' : ''; }
        hinweis();
        [].forEach.call(blatt.querySelectorAll('[data-k]'), function (f) {
          f.oninput = function () { var v = f.value, k = f.dataset.k; setzeMeister(function (a) { a.forEach(function (x, i) { if (x.id === mid) { var y = Object.assign({}, x); y[k] = v; a[i] = y; } }); }); hinweis(); };
          f.onchange = moebelMalen;
        });
        var raus = blatt.querySelector('.c6w-ls-mraus');
        raus.onclick = function () {
          if (!raus.dataset.ja) { raus.dataset.ja = '1'; raus.textContent = 'Ja, herausnehmen'; return; }
          setzeMeister(function (a) { for (var i = a.length - 1; i >= 0; i--) if (a[i].id === mid) a.splice(i, 1); });
          moebelMalen(); oeffneMeister();
        };
      }

      // ——— Antippen ———
      moebel.addEventListener('click', function (e) {
        var r = e.target.closest('.c6w-ls-regal'); if (!r) return;
        oeffneMitRegal(r, r.dataset.zu === 'meister' ? function () { oeffneMeister(); } : function () { oeffneFunde(); });
      });
      // Das gewählte Regal tritt vor, dann stehst du davor
      function oeffneMitRegal(el, dann) {
        if (C6.ruhig || !el.animate) { dann(); return; }
        var r = el.getBoundingClientRect(), br = buehne.getBoundingClientRect();
        var s = Math.min(2.6, (br.height * 0.6) / r.height), dx = (br.left + br.width / 2) - (r.left + r.width / 2), dy = (br.top + br.height * 0.42) - (r.top + r.height / 2);
        moebel.classList.add('c6w-ls-waehlt'); el.classList.add('c6w-ls-offen');
        var an = el.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }], { duration: 600, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'forwards' });
        setTimeout(dann, 480);
        an.onfinish = function () { setTimeout(function () { try { an.cancel(); } catch (e) {} el.classList.remove('c6w-ls-offen'); moebel.classList.remove('c6w-ls-waehlt'); }, 420); };
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && api.ansicht && C6.jetzt === 'lesesaal') { e.stopPropagation(); e.preventDefault(); zuSaal(); }
      }, true);
      if (C6.bus) C6.bus.on('kleid', function () { if (ctl && ctl.kleid && C6.laden && C6.laden.an) ctl.kleid(C6.laden.an()); });
      buehne.classList.add('c6m-still');
      var ro = window.ResizeObserver ? new ResizeObserver(function () { groesse(); }) : null;
      if (ro) ro.observe(buehne);

      api.zuSaal = zuSaal; api.einordnen = oeffneHineinlegen; api.funde = oeffneFunde; api.meister = oeffneMeister;
      return {
        betreten: function (o) {
          o = o || {};
          buehne.classList.remove('c6m-still');
          groesse(); carlMalen(); moebelMalen();
          if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'lesesaal');
          groesse();
          if (o.einordnen) setTimeout(oeffneHineinlegen, 200);
          else if (o.funde) setTimeout(function () { oeffneFunde(); }, 200);
          else if (o.meister) setTimeout(function () { oeffneMeister(typeof o.meister === 'string' ? o.meister : null); }, 200);
          else if (!o.still) {
            // ein Satz zu diesem Ort, nicht zu einem Space
            var erst = !L().gesehen;
            if (erst) aendere(function (l) { l.gesehen = Date.now(); });
            var t = erst ? satz('lesesaal.erst', 'Dein Lesesaal. Leg mir hinein, was du gefunden hast.')
              : !meister().length ? satz('lesesaal.meister', 'Wen hast du zuletzt bewundert?')
              : !funde().length ? satz('lesesaal.fund', 'Hast du heute etwas gefunden?') : '';
            if (t) setTimeout(function () { if (C6.jetzt === 'lesesaal' && !api.ansicht && C6.sag) C6.sag(t); }, 700);
          }
        },
        verlassen: function () { if (api.ansicht) zuSaal(); buehne.classList.add('c6m-still'); },
        groesse: groesse
      };
    }
  });
  var api = C6.lesesaal = { ansicht: null };
})();
