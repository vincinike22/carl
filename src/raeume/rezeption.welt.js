/* Rezeption · der Raum hinter allem.
   Füllt den Slot .c6rz-welt beim ersten Betreten: Rückwand mit Lichtfleck, hinter Carl das Fächerregal der Tage
   (sieben Fächer, heute bis +6), der Tresen vor ihm (Oberseite und Front, Carl steht dahinter), darauf Postfach,
   Tasse und Glocke; davor der Boden der Halle. Am Computer dazu Fenster, Wanduhr und Pflanze.
   Die Fächer zeichnen nur, was C6.tage sagt; was sie beim Antippen tun, verdrahtet die Rezeption. */
(function () {
  if (typeof C6 === 'undefined' || !C6.bus) return;
  var T = '#2b2722', RAUM = 'rezeption', D = document;
  var root = null, glocke = null, regal = null, post = null, geklingelt = 0, warteUhr = null, warteBis = 0, uhrTakt = null;
  var faecher = [], fachSchl = [], erstGemalt = false;

  function zeit() {
    try { if (typeof C6.tageszeit === 'function') { var t = C6.tageszeit(); if (/^(morgen|mittag|abend|nacht)$/.test(t)) return t; } } catch (e) {}
    var h = new Date().getHours();
    return h >= 6 && h < 11 ? 'morgen' : h >= 11 && h < 17 ? 'mittag' : h >= 17 && h < 21 ? 'abend' : 'nacht';
  }
  function satz(k, ersatz, w) {
    try { if (C6.stimme && C6.stimme.fest) { var s = C6.stimme.fest(k, w || {}); if (s && !/\{[a-z]+\}/i.test(s)) return s; } } catch (e) {}
    return ersatz.replace(/\{(\w+)\}/g, function (m, x) { return w && w[x] != null ? String(w[x]) : m; });
  }
  function comp() { return C6.geraet === 'computer'; }
  function ruhig() { return !!C6.ruhig; }
  function el(tag, cls, vater, html) { var e = D.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (vater) vater.appendChild(e); return e; }

  // ---------- Tage: aus C6.tage, sonst ehrlich leer aus der Uhr ----------
  var WT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function tage() {
    var l = null;
    try { if (C6.tage && typeof C6.tage.liste === 'function') l = C6.tage.liste(); } catch (e) { l = null; }
    var out = [], h = new Date(); h.setHours(12, 0, 0, 0);
    for (var i = 0; i < 7; i++) {
      var d = new Date(h.getTime()); d.setDate(h.getDate() + i);
      var x = l && l[i] && /^\d{4}-\d\d-\d\d$/.test(l[i].tag || '') ? l[i] : null;
      var tag = x ? x.tag : iso(d), dd = x ? new Date(x.tag + 'T12:00:00') : d;
      out.push({ tag: tag, heute: x ? !!x.heute : i === 0, wt: (x && x.wochentag) || WT[dd.getDay()], nr: dd.getDate() });
    }
    return out;
  }
  function fachStand(tag) {
    var f = null;
    try { if (C6.tage && typeof C6.tage.fach === 'function') f = C6.tage.fach(tag); } catch (e) { f = null; }
    if (!f || !/^(leer|termin|vorbereitet)$/.test(f.zustand || '')) return { zustand: 'leer', n: 0, vorbereitet: 0 };
    return { zustand: f.zustand, n: Math.max(0, +f.n || 0), vorbereitet: Math.max(0, +f.vorbereitet || 0) };
  }

  // ---------- Bilder (Tuschelinie, warme Flächen, Licht von links) ----------
  // ein Kärtchen im Fach: steht schräg an der Rückwand, zwei Bleistiftstriche statt Schrift
  function kaertchen(x, r, farbe) {
    return '<g transform="rotate(' + r + ' ' + (x + 13) + ' 50)">' +
      '<rect x="' + x + '" y="16" width="26" height="34" rx="1.6" fill="#fbf7f0" stroke="' + T + '" stroke-width="1.7"/>' +
      '<rect x="' + x + '" y="16" width="26" height="5" rx="1" fill="' + farbe + '" stroke="' + T + '" stroke-width="1.4"/>' +
      '<path d="M' + (x + 5) + ' 28h15M' + (x + 5) + ' 34h11" stroke="#8a8174" stroke-width="1.5" stroke-linecap="round"/></g>';
  }
  // vorbereitet: ein kleiner Kartenstapel mit rotem Bändchen und Schleife
  function stapel() {
    return '<g class="c6rw-stapel"><ellipse cx="25" cy="52" rx="17" ry="2" fill="rgba(43,39,34,.28)"/>' +
      '<path d="M9 47h32v4H9z" fill="#efe6d4" stroke="' + T + '" stroke-width="1.5"/>' +
      '<path d="M8 43h32v4H8z" fill="#fbf7f0" stroke="' + T + '" stroke-width="1.5" transform="rotate(-2 24 45)"/>' +
      '<path d="M10 39h31v4H10z" fill="#f6efe2" stroke="' + T + '" stroke-width="1.5" transform="rotate(1.5 25 41)"/>' +
      '<path d="M24 38.5v13" stroke="#c4372d" stroke-width="3"/>' +
      '<path d="M24 38c-6 -5 -9 -2 -6 1zM24 38c6 -5 9 -2 6 1z" fill="#d6463a" stroke="' + T + '" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<circle cx="24" cy="38.3" r="1.7" fill="#c4372d" stroke="' + T + '" stroke-width="1"/></g>';
  }
  function fachBild(s) {
    var g = '';
    if (s.zustand === 'termin' || (s.zustand === 'vorbereitet' && s.n)) {
      var n = Math.min(3, Math.max(1, s.n || 1));
      if (n >= 3) g += kaertchen(19, 9, '#8ea37a');
      if (n >= 2) g += kaertchen(15, 4, '#e2b93b');
      g += kaertchen(s.zustand === 'vorbereitet' ? 13 : 10, -6, '#5d84a8');
    }
    if (s.zustand === 'vorbereitet') g += stapel();
    return '<svg viewBox="0 0 48 56" aria-hidden="true" focusable="false"><g class="c6rw-inhalt">' + g + '</g></svg>';
  }
  // die Bilderleuchte über dem Regal: Messingarm, grüner Schirm
  function leuchteBild() {
    return '<svg viewBox="0 0 120 40" aria-hidden="true" focusable="false">' +
      '<path d="M60 38V22" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/><rect x="52" y="32" width="16" height="7" rx="2" fill="#c9a24e" stroke="' + T + '" stroke-width="2"/>' +
      '<path d="M18 20 Q60 2 102 20 L98 27 H22 Z" fill="#3f6b55" stroke="' + T + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M30 15 Q60 6 84 12" stroke="#7fa58c" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".8"/>' +
      '<path class="c6rw-birne" d="M24 27 H96" stroke="#f0d9a0" stroke-width="3" stroke-linecap="round"/></svg>';
  }
  function pflanzeKlein() {
    return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
      '<path d="M20 26c-2-7-9-9-12-7 2 5 7 7 12 7zM20 26c1-8 7-12 11-10-1 6-6 9-11 10zM20 25c0-7 1-12 0-16" fill="#8ea37a" stroke="' + T + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M11 26h18l-2 12h-14z" fill="#c98b6b" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/><path d="M10 25h20v3H10z" fill="#d79e7f" stroke="' + T + '" stroke-width="1.8"/></svg>';
  }
  function tasseBild() {
    return '<svg viewBox="0 0 48 60" aria-hidden="true" focusable="false">' +
      '<path class="c6rw-dampf" d="M18 30 c-4 -6 4 -8 0 -14 c-3 -5 2 -8 2 -11"/>' +
      '<path class="c6rw-dampf" d="M28 31 c-4 -6 4 -8 0 -14 c-3 -5 2 -8 2 -11"/>' +
      '<ellipse cx="22" cy="56" rx="18" ry="3" fill="#2b2722" opacity=".16"/>' +
      '<ellipse cx="22" cy="55" rx="17" ry="3.4" fill="#e9e1d2" stroke="' + T + '" stroke-width="1.8"/>' +
      '<path d="M8 34 h28 v10 a14 14 0 0 1 -28 0 z" fill="#fbf7f0" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M36 37 q10 1 8 9 q-2 6 -9 6" fill="none" stroke="' + T + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M12 40 q1 8 7 10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>' +
      '<ellipse cx="22" cy="34" rx="14" ry="3" fill="#a86d3c" stroke="' + T + '" stroke-width="2"/>' +
      '</svg>';
  }
  function glockeBild() {
    return '<svg viewBox="0 0 52 44" aria-hidden="true" focusable="false">' +
      '<circle class="c6rw-ring" cx="26" cy="24" r="18"/><circle class="c6rw-ring" cx="26" cy="24" r="18"/>' +
      '<ellipse cx="26" cy="41" rx="22" ry="3" fill="#2b2722" opacity=".16"/>' +
      '<path d="M6 40 h40 a2 2 0 0 0 0 -4 h-40 a2 2 0 0 0 0 4 z" fill="#3a332c" stroke="' + T + '" stroke-width="2"/>' +
      '<g class="c6rw-kuppel"><path d="M8 36 Q8 14 26 12 Q44 14 44 36 Z" fill="#e0b964" stroke="' + T + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M26 36 Q26 14 44 36 Z" fill="#2b2722" opacity=".12"/><path d="M13 30 Q15 18 24 15" fill="none" stroke="#fff3c4" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>' +
      '<g class="c6rw-knopf"><rect x="23" y="6" width="6" height="8" rx="1.5" fill="#2b2722"/><circle cx="26" cy="6" r="4" fill="#e0b964" stroke="' + T + '" stroke-width="2"/></g>' +
      '</svg>';
  }
  // die Ablage für Post: ein flacher Holzkasten, hinten die Rückwand, vorne die Kante (liegt über dem Umschlag)
  function ablageHinten() {
    return '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path d="M6 10 H94 L98 34 H2 Z" fill="#8f6440" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M10 14 H90" stroke="#b3845a" stroke-width="2" stroke-linecap="round"/></svg>';
  }
  function ablageVorne() {
    return '<svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<ellipse cx="50" cy="18" rx="50" ry="2.4" fill="rgba(43,39,34,.18)"/>' +
      '<path d="M1 2 H99 L97 16 H3 Z" fill="#c08d5c" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M6 6 H94" stroke="#e2b98a" stroke-width="2" stroke-linecap="round" opacity=".8"/>' +
      '<rect x="40" y="7" width="20" height="6" rx="1.5" fill="#d9b25c" stroke="' + T + '" stroke-width="1.4"/></svg>';
  }
  // Computer: die linke Seitenwand in Flucht, mit dem Fenster, aus dem das Licht kommt (Laibung an der fernen Seite sichtbar).
  // ws = Breite bis zur Ecke, hw = Sockel der Rückwand, (vx, vy) = Fluchtpunkt; nachts brennt in einem Haus gegenüber Licht.
  function seiteBild(ws, hw, vx, vy, oben, tz) {
    function y(x, y0, x0) { return vy + (y0 - vy) * (vx - x) / (vx - x0); }
    function f(n) { return n.toFixed(1); }
    var yb = hw + (hw - vy) / (vx - ws) * ws, xa = ws * 0.2, xb = ws * 0.84, rv = ws * 0.07;
    var t0 = oben + 66, b0 = hw - 96, P = function (x, y0) { return f(x) + ' ' + f(y(x, y0, xa)); };
    var s = '<svg viewBox="0 0 ' + ws + ' ' + f(yb + 2) + '" width="' + ws + '" height="' + f(yb + 2) + '" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="c6rw-himmel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="c6rw-h1"/><stop offset="1" class="c6rw-h2"/></linearGradient>' +
      '<clipPath id="c6rw-glas"><path d="M' + P(xa, t0) + ' L' + P(xb - rv, t0) + ' L' + P(xb - rv, b0) + ' L' + P(xa, b0) + 'Z"/></clipPath>' +
      '<linearGradient id="c6rw-seitlich" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b2722" stop-opacity=".1"/><stop offset="1" stop-color="#2b2722" stop-opacity="0"/></linearGradient></defs>';
    s += '<path d="M0 0 H' + ws + ' V' + hw + ' L0 ' + f(yb) + 'Z" class="c6rw-seitenwand"/>';
    s += '<path d="M0 0 H' + ws + ' V' + hw + ' L0 ' + f(yb) + 'Z" fill="url(#c6rw-seitlich)"/>';
    s += '<path d="M0 ' + f(yb - 14 - (yb - hw) * 0) + ' L' + ws + ' ' + (hw - 14) + ' V' + hw + ' L0 ' + f(yb) + 'Z" fill="#a98058" stroke="#2b2722" stroke-width="2.4" stroke-linejoin="round"/>';
    s += '<path d="M' + ws + ' 0 V' + hw + '" stroke="#2b2722" stroke-width="2.4" opacity=".75"/>';
    // Rahmen, dann Glas mit Himmel und Stadt, dann Laibung, Sprossen, Fensterbank
    var fa = xa - 9, fb = xb + 6;
    s += '<path d="M' + f(fa) + ' ' + f(y(fa, t0 - 12, xa)) + ' L' + f(fb) + ' ' + f(y(fb, t0 - 12, xa)) + ' L' + f(fb) + ' ' + f(y(fb, b0 + 10, xa)) + ' L' + f(fa) + ' ' + f(y(fa, b0 + 10, xa)) + 'Z" fill="#efe4d0" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>';
    var gx = xa, gw = xb - rv - xa, gt = y(xb - rv, t0, xa), gb = y(xb - rv, b0, xa);
    s += '<g clip-path="url(#c6rw-glas)"><rect x="' + f(xa - 4) + '" y="' + f(t0 - 4) + '" width="' + f(gw + 8) + '" height="' + f(b0 - t0 + 8) + '" fill="url(#c6rw-himmel)"/>';
    var su = tz === 'morgen' ? [0.3, 0.62] : tz === 'abend' ? [0.6, 0.7] : [0.55, 0.22];
    s += '<g class="c6rw-sonne" transform="translate(' + f(gx + gw * su[0]) + ' ' + f(t0 + (b0 - t0) * su[1]) + ')"><circle r="' + f(gw * 0.3) + '" fill="#fff6cf" opacity=".3"/><circle r="' + f(gw * 0.16) + '" fill="#fff3c2"/></g>';
    s += '<g class="c6rw-mond" transform="translate(' + f(gx + gw * 0.62) + ' ' + f(t0 + (b0 - t0) * 0.2) + ')"><circle r="' + f(gw * 0.13) + '" fill="#f3e6b8"/><circle cx="' + f(gw * 0.06) + '" cy="' + f(-gw * 0.05) + '" r="' + f(gw * 0.11) + '" class="c6rw-mondschatten"/></g>';
    s += '<g class="c6rw-sterne" fill="#f6ecc4">';
    [[0.2, 0.08], [0.5, 0.14], [0.8, 0.1], [0.34, 0.3], [0.7, 0.36], [0.16, 0.46]].forEach(function (p) { s += '<circle cx="' + f(gx + gw * p[0]) + '" cy="' + f(t0 + (b0 - t0) * p[1]) + '" r="1.4"/>'; });
    s += '</g>';
    var sb = Math.max(gb, y(xa, b0, xa)), dach = function (cls, h0, schritt) {
      var d = 'M' + f(xa - 6) + ' ' + f(sb + 6), x = xa - 6, i = 0;
      while (x < xb + 6) { var hh = h0 + ((i * 37) % 3) * 12; d += ' V' + f(sb - hh) + ' l' + f(schritt / 2) + ' ' + f(-schritt * 0.45) + ' l' + f(schritt / 2) + ' ' + f(schritt * 0.45) + ' V' + f(sb - hh + 10); x += schritt; i++; }
      return '<path class="' + cls + '" d="' + d + ' V' + f(sb + 6) + 'Z"/>';
    };
    s += dach('c6rw-stadt2', 74, gw * 0.42) + dach('c6rw-stadt', 46, gw * 0.5);
    s += '<rect class="c6rw-licht-haus" x="' + f(gx + gw * 0.36) + '" y="' + f(sb - 34) + '" width="' + f(gw * 0.07) + '" height="9" rx="1"/>';
    s += '</g>';
    s += '<path d="M' + P(xb - rv, t0) + ' L' + P(xb, t0 - 2) + ' L' + P(xb, b0 + 2) + ' L' + P(xb - rv, b0) + 'Z" fill="#d6c4a6" stroke="#2b2722" stroke-width="1.6" stroke-linejoin="round"/>';
    s += '<path d="M' + P(xa, t0) + ' L' + P(xb - rv, t0) + ' L' + P(xb - rv, b0) + ' L' + P(xa, b0) + 'Z" fill="none" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>';
    var xm = xa + (xb - rv - xa) * 0.52;
    var sp = 'M' + f(xm) + ' ' + f(y(xm, t0, xa)) + ' V' + f(y(xm, b0, xa));
    [0.36, 0.68].forEach(function (k) { var yy = t0 + (b0 - t0) * k; sp += ' M' + P(xa, yy) + ' L' + P(xb - rv, yy); });
    s += '<path d="' + sp + '" stroke="#efe4d0" stroke-width="5"/><path d="' + sp + '" stroke="#2b2722" stroke-width="1.4" opacity=".55"/>';
    var sa = xa - 16, sbx = xb + 12;
    s += '<path d="M' + f(sa) + ' ' + f(y(sa, b0 + 12, xa)) + ' L' + f(sbx) + ' ' + f(y(sbx, b0 + 12, xa)) + ' L' + f(sbx) + ' ' + f(y(sbx, b0 + 22, xa)) + ' L' + f(sa) + ' ' + f(y(sa, b0 + 24, xa)) + 'Z" fill="#d9c3a2" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>';
    return s + '</svg>';
  }
  function uhrBild() {
    var s = '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<ellipse cx="54" cy="56" rx="44" ry="44" fill="rgba(43,39,34,.12)"/>' +
      '<circle cx="50" cy="50" r="44" fill="#c9a24e" stroke="' + T + '" stroke-width="2.6"/>' +
      '<circle cx="50" cy="50" r="37" fill="#fbf7f0" stroke="' + T + '" stroke-width="1.8"/>';
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6, r1 = i % 3 ? 32 : 29, r2 = 34;
      s += '<path d="M' + (50 + Math.sin(a) * r1).toFixed(1) + ' ' + (50 - Math.cos(a) * r1).toFixed(1) + 'L' + (50 + Math.sin(a) * r2).toFixed(1) + ' ' + (50 - Math.cos(a) * r2).toFixed(1) + '" stroke="' + T + '" stroke-width="' + (i % 3 ? 1.4 : 2.6) + '" stroke-linecap="round"/>';
    }
    return s + '<path class="c6rw-zeiger-h" d="M50 52V31" stroke="' + T + '" stroke-width="3.6" stroke-linecap="round"/>' +
      '<path class="c6rw-zeiger-m" d="M50 53V21" stroke="' + T + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="50" cy="50" r="3" fill="#c4372d" stroke="' + T + '" stroke-width="1.4"/>' +
      '<path d="M32 24 Q44 16 58 16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg>';
  }
  function pflanzeGross() {
    return '<svg viewBox="0 0 140 240" aria-hidden="true" focusable="false">' +
      '<g class="c6rw-blattwerk">' +
      '<path d="M70 170 C66 130 60 96 44 70" fill="none" stroke="' + T + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M72 170 C76 124 86 90 104 60" fill="none" stroke="' + T + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M70 168 C70 120 70 70 72 30" fill="none" stroke="' + T + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M44 70 C20 66 8 84 12 104 C30 106 48 92 44 70Z" fill="#7d9a6b" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M104 60 C128 52 138 72 134 92 C114 96 98 82 104 60Z" fill="#8ea37a" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M72 30 C56 14 60 -2 72 2 C86 -2 90 14 72 30Z" fill="#8ea37a" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M66 118 C40 112 26 128 30 146 C50 150 66 136 66 118Z" fill="#8ea37a" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M76 104 C100 92 118 104 116 124 C96 132 78 122 76 104Z" fill="#7d9a6b" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M18 98 C26 90 34 84 42 74M128 86 C120 80 112 72 106 62M72 26 C70 18 70 10 72 4M34 142 C44 136 56 128 64 120M110 120 C100 116 90 112 78 106" fill="none" stroke="#5f7a52" stroke-width="1.4" stroke-linecap="round"/>' +
      '</g>' +
      '<ellipse cx="70" cy="234" rx="52" ry="5" fill="rgba(43,39,34,.18)"/>' +
      '<path d="M32 172 H108 L98 232 H42 Z" fill="#c98b6b" stroke="' + T + '" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M28 164 H112 V178 H28 Z" fill="#d79e7f" stroke="' + T + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M44 186 L52 226" stroke="#e6b597" stroke-width="5" stroke-linecap="round" opacity=".6"/></svg>';
  }

  // Tresen und Boden werden nach Maß gezeichnet (keine gedehnten Paneele): w × h in Bildschirmpunkten
  function tresenBild(w, h, tiefe, randlos) {
    var plinth = Math.round(h * 0.1), kante = Math.max(7, Math.round(h * 0.08)), front0 = tiefe + kante, front1 = h - plinth;
    var ein = randlos ? 0 : 6, n = Math.max(2, Math.round((w - 2 * ein) / (h * 1.3))), pw = (w - 2 * ein) / n;
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="c6rw-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="c6rw-holz1"/><stop offset="1" class="c6rw-holz2"/></linearGradient>' +
      '<linearGradient id="c6rw-oben" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="c6rw-platte1"/><stop offset="1" class="c6rw-platte2"/></linearGradient></defs>';
    var e = randlos ? -4 : 0, rw = randlos ? w + 8 : w;
    // Oberseite in Aufsicht (hinten schmaler), Kante, Front mit Füllungen, Sockel zurückgesetzt
    s += '<path d="M' + (e + tiefe * 1.1) + ' 1.2 H' + (e + rw - tiefe * 1.1) + ' L' + (e + rw) + ' ' + tiefe + ' H' + e + ' Z" fill="url(#c6rw-oben)" stroke="' + T + '" stroke-width="2.4" stroke-linejoin="round"/>';
    s += '<path d="M' + (e + tiefe * 1.6) + ' ' + (tiefe * 0.45).toFixed(1) + ' H' + (e + rw * 0.42) + 'M' + (e + rw * 0.55) + ' ' + (tiefe * 0.62).toFixed(1) + ' H' + (e + rw - tiefe * 2) + '" stroke="#f2d4a8" stroke-width="1.6" stroke-linecap="round" opacity=".75"/>';
    s += '<rect x="' + e + '" y="' + tiefe + '" width="' + rw + '" height="' + kante + '" fill="#a77447" stroke="' + T + '" stroke-width="2.4"/>';
    s += '<rect x="' + (e + ein) + '" y="' + front0 + '" width="' + (rw - 2 * ein) + '" height="' + (front1 - front0) + '" fill="url(#c6rw-front)" stroke="' + T + '" stroke-width="2.4"/>';
    s += '<rect x="' + (e + ein) + '" y="' + front0 + '" width="' + (rw - 2 * ein) + '" height="' + Math.round((front1 - front0) * 0.22) + '" fill="rgba(43,39,34,.16)"/>';
    var pad = Math.max(8, Math.round(h * 0.11)), py0 = front0 + pad + 2, py1 = front1 - pad;
    for (var i = 0; i < n; i++) {
      var x0 = ein + i * pw + pad * 0.8, x1 = ein + (i + 1) * pw - pad * 0.8;
      if (i) s += '<path d="M' + (ein + i * pw).toFixed(1) + ' ' + front0 + ' V' + front1 + '" stroke="' + T + '" stroke-width="1.6" opacity=".5"/>';
      s += '<rect x="' + x0.toFixed(1) + '" y="' + py0 + '" width="' + (x1 - x0).toFixed(1) + '" height="' + (py1 - py0) + '" rx="2" fill="rgba(255,240,214,.10)" stroke="' + T + '" stroke-width="1.5" opacity=".9"/>' +
        '<path d="M' + (x0 + 2).toFixed(1) + ' ' + (py1 - 1) + ' V' + (py0 + 2) + ' H' + (x1 - 2).toFixed(1) + '" fill="none" stroke="#f0cf9e" stroke-width="2" opacity=".55"/>' +
        '<path d="M' + (x0 + 2).toFixed(1) + ' ' + (py1 - 1.5) + ' H' + (x1 - 1.5).toFixed(1) + ' V' + (py0 + 2) + '" fill="none" stroke="#6e4b2e" stroke-width="2" opacity=".35"/>';
    }
    s += '<rect x="' + (e + ein + 8) + '" y="' + front1 + '" width="' + (rw - 2 * ein - 16) + '" height="' + plinth + '" fill="#6e4b2e" stroke="' + T + '" stroke-width="2.2"/>';
    s += '<path d="M' + (e + ein + 10) + ' ' + (front1 + 3) + ' H' + (e + rw - ein - 10) + '" stroke="#c9a24e" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>';
    return s + '</svg>';
  }
  function bodenBild(w, h, hy, vx, rug) {
    // Dielen laufen zum Fluchtpunkt auf Carls Augenhöhe; Querfugen werden nach hinten dichter
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" aria-hidden="true" focusable="false" preserveAspectRatio="none">';
    s += '<rect width="' + w + '" height="' + h + '" class="c6rw-dielen"/>';
    var d = 92, g = '';
    for (var x = vx - Math.ceil((vx + w * 3) / d) * d; x < w * 4; x += d) {
      g += 'M' + (vx + (x - vx) * 0.08).toFixed(1) + ' 0 L' + x.toFixed(1) + ' ' + h + ' ';
    }
    s += '<path d="' + g + '" stroke="rgba(43,39,34,.13)" stroke-width="1.4" fill="none"/>';
    var q = '';
    for (var k = 1; k < 9; k++) { var y = h * (1 - 1 / (1 + k * 0.55)); q += 'M0 ' + y.toFixed(1) + ' H' + w + ' '; }
    s += '<path d="' + q + '" stroke="rgba(43,39,34,.06)" stroke-width="1.2" fill="none"/>';
    if (rug) {
      // ein Läufer vor dem Tresen, in Aufsicht nach hinten schmaler; er endet vor dem Feld, vorne mit Fransen
      var b0 = rug.b0, b1 = rug.b1, y0 = rug.y0, y1 = Math.max(y0 + 40, rug.y1), k = (y1 - y0) / Math.max(1, h - y0), bx = b0 + (b1 - b0) * k;
      s += '<ellipse cx="' + vx + '" cy="' + (y1 + 2) + '" rx="' + (bx + 6) + '" ry="5" fill="rgba(43,39,34,.12)"/>';
      s += '<path d="M' + (vx - b0) + ' ' + y0 + ' L' + (vx + b0) + ' ' + y0 + ' L' + (vx + bx) + ' ' + y1 + ' L' + (vx - bx) + ' ' + y1 + 'Z" class="c6rw-laeufer" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>';
      var i0 = 10, i1 = 13, ym = y0 + 7, yn = y1 - 8, kn = (yn - y0) / Math.max(1, h - y0), bn = b0 + (b1 - b0) * kn;
      s += '<path d="M' + (vx - b0 + i0) + ' ' + ym + ' L' + (vx + b0 - i0) + ' ' + ym + ' L' + (vx + bn - i1) + ' ' + yn + ' L' + (vx - bn + i1) + ' ' + yn + 'Z" class="c6rw-laeufer-rand" fill="none" stroke-width="2.4"/>';
      // ein Rautenband in der Mitte, nach hinten kleiner
      var m = '', yc = (ym + yn) / 2, bc = b0 + (b1 - b0) * ((yc - y0) / Math.max(1, h - y0)), nR = 11, rw = (bc - 30) * 2 / nR, rh = Math.min(6, (yn - ym) * 0.08);
      for (var r = 0; r < nR; r++) { var cx = vx - bc + 30 + rw * (r + 0.5); m += 'M' + (cx - rw * 0.32).toFixed(1) + ' ' + yc.toFixed(1) + ' L' + cx.toFixed(1) + ' ' + (yc - rh).toFixed(1) + ' L' + (cx + rw * 0.32).toFixed(1) + ' ' + yc.toFixed(1) + ' L' + cx.toFixed(1) + ' ' + (yc + rh).toFixed(1) + 'Z '; }
      s += '<path d="' + m + '" class="c6rw-laeufer-muster" stroke="' + T + '" stroke-width="1.2" opacity=".85"/>';
      var fr = '';
      for (var j = 0; j <= 22; j++) { var xx = vx - bx + 5 + j * (2 * bx - 10) / 22; fr += 'M' + xx.toFixed(1) + ' ' + y1 + ' l' + ((xx - vx) * 0.02).toFixed(1) + ' 7 '; }
      s += '<path d="' + fr + '" stroke="#ecd3ac" stroke-width="2" stroke-linecap="round"/>';
    }
    return s + '</svg>';
  }

  // ---------- Fächer ----------
  function malFach(b, t, s, legt) {
    b.setAttribute('data-tag', t.tag);
    b.setAttribute('data-stand', s.zustand);
    b.toggleAttribute('data-heute', !!t.heute);
    if (t.heute) b.setAttribute('aria-current', 'date'); else b.removeAttribute('aria-current');
    if (!b.hasAttribute('aria-label')) b.setAttribute('aria-label', (t.heute ? 'Heute, ' : '') + t.wt + ' ' + t.nr + '.');
    b.querySelector('.c6rw-fach-loch').innerHTML = fachBild(s);
    var sch = b.querySelector('.c6rw-schild');
    sch.innerHTML = '<span class="c6rw-wt">' + (t.heute ? 'heute' : t.wt) + '</span><span class="c6rw-nr">' + t.nr + '.</span>';
    if (legt && !ruhig()) {
      b.classList.remove('c6rw-legt'); void b.offsetWidth; b.classList.add('c6rw-legt');
      setTimeout(function () { b.classList.remove('c6rw-legt'); }, 1300);
      carlSchaut(b);
    }
  }
  function malFaecher(neu) {
    if (!faecher.length) return;
    var l = tage();
    for (var i = 0; i < 7; i++) {
      var s = fachStand(l[i].tag), k = l[i].tag + '|' + s.zustand + '|' + s.n + '|' + s.vorbereitet + '|' + l[i].heute;
      if (k === fachSchl[i] && !neu) continue;
      var alt = fachSchl[i] ? fachSchl[i].split('|') : null;
      // gelegt: am selben Tag kam etwas dazu (nicht beim ersten Zeichnen, nicht beim Tageswechsel)
      var legt = erstGemalt && alt && alt[0] === l[i].tag && (+s.n + +s.vorbereitet) > (+alt[2] + +alt[3]);
      fachSchl[i] = k;
      malFach(faecher[i], l[i], s, legt);
    }
    erstGemalt = true;
    offenMarkieren();
  }
  function wippe(tag) {
    var b = regal && regal.querySelector('[data-tag="' + tag + '"]');
    if (!b || ruhig()) return;
    b.classList.remove('c6rw-legt'); void b.offsetWidth; b.classList.add('c6rw-legt');
    setTimeout(function () { b.classList.remove('c6rw-legt'); }, 1300);
    carlSchaut(b);
  }
  function carlSchaut(b) {
    try {
      if (C6.jetzt !== RAUM || !C6.carl || typeof C6.carl.schau !== 'function') return;
      var r = b.getBoundingClientRect(); C6.carl.schau(r.left + r.width / 2, r.top + r.height / 2);
      setTimeout(function () { try { if (C6.carl && C6.carl.blick) C6.carl.blick(); } catch (e) {} }, 1800);
    } catch (e) {}
  }
  var warOffen = false;
  function offenMarkieren() {
    var b = root && root.closest('.c6rz-buehne'), t = b ? b.getAttribute('data-tag-offen') : null;
    faecher.forEach(function (f) { f.toggleAttribute('data-offen', !!t && f.getAttribute('data-tag') === t); });
    // Carl sitzt dann oben auf dem Regal (Lage in rezeption.css) und schaut hinunter aufs Blatt; danach wieder geradeaus
    if (!!t !== warOffen) {
      warOffen = !!t;
      try { if (C6.jetzt === RAUM && C6.carl && C6.carl.blick) { if (t) C6.carl.blick(0.15, 0.9); else C6.carl.blick(); } } catch (e) {}
    }
  }

  // ---------- Glocke: wahr je Zustand ----------
  function glockeSatz() {
    var n = zeit() === 'nacht';
    if (!geklingelt) return n
      ? satz('rezeption.glocke.nacht', 'Nachts klingelt die Glocke leiser. Wach bin ich trotzdem. Sag mir deinen Satz, mehr braucht es nicht.')
      : satz('rezeption.glocke', 'Die Glocke klingelt nur hier auf dem Tresen. Ich bin schon da. Sag mir deinen Satz, mehr braucht es nicht.');
    return satz('rezeption.glocke.geklingelt', 'Die Glocke hat geklingelt, mehr tut sie nicht. Gesehen hab ich dich vorher schon.');
  }
  var frohUhr = null;
  function carlFreut() {
    try {
      if (C6.jetzt !== RAUM || !C6.carl || typeof C6.carl.stimmung !== 'function') return;
      C6.carl.stimmung('froh');
      if (frohUhr) clearTimeout(frohUhr);
      frohUhr = setTimeout(function () { frohUhr = null; try { if (C6.jetzt === RAUM && C6.carl && C6.carl.stimmung) C6.carl.stimmung('ruhig'); } catch (e) {} }, 1400);
    } catch (e) {}
  }
  function klingeln() {
    if (!glocke) return;
    geklingelt++;
    glocke.classList.remove('c6rw-klingt'); void glocke.offsetWidth; glocke.classList.add('c6rw-klingt');
    glocke.setAttribute('aria-label', 'Tischglocke, hat geklingelt');
    setTimeout(function () { if (glocke) glocke.classList.remove('c6rw-klingt'); }, 800);
    var t = glockeSatz();
    try { if (C6.staunen) { if (C6.staunen.zu) C6.staunen.zu('rz-glocke'); C6.staunen.text('rz-glocke', t); } } catch (e) {}
    try { if (C6.rezeption && typeof C6.rezeption.sag === 'function') C6.rezeption.sag(t); else if (C6.sag) C6.sag(t, { merken: false }); } catch (e) {}
    carlFreut();
    try { C6.bus.emit('rezeption-welt', { was: 'glocke', n: geklingelt }); } catch (e) {}
  }
  // die leere Ablage sagt ehrlich, dass nichts da ist (nur auf Nachfrage: Halten / Drüberfahren)
  function postSatz() {
    var da = post && post.querySelector('#c6r-a-brief:not([hidden])');
    var aus = false; try { aus = !!(C6.brief && typeof C6.brief.an === 'function' && C6.brief.an() === false); } catch (e) { aus = false; }
    if (!da && aus) return satz('brief.ablageAus', 'Den Brief hast du ausgeschaltet, darum liegt hier keiner. Der Schalter steht in unserem Buch.');
    return da ? satz('brief.ablage', 'Hier liegt dein Brief. Tipp ihn an, dann mach ich ihn auf.')
      : satz('brief.ablageLeer', 'Heute liegt hier noch kein Brief. Steht etwas an, liegt hier einer.');
  }
  function postPruefen() {
    if (!post) return;
    var da = !!post.querySelector('#c6r-a-brief:not([hidden])');
    if (post.getAttribute('data-brief') !== (da ? 'ja' : 'nein')) {
      post.setAttribute('data-brief', da ? 'ja' : 'nein');
      try { if (C6.staunen) { C6.staunen.zu && C6.staunen.zu('rz-post'); C6.staunen.text('rz-post', postSatz()); } } catch (e) {}
    }
  }

  // ---------- Licht und Uhr ----------
  function licht(tz) {
    var q;
    if (tz === 'nacht' || tz === 'abend') {
      var r = regal && regal.getBoundingClientRect(), sr = root.getBoundingClientRect();
      var x = r && sr.width ? (r.left + r.width / 2 - sr.left) / sr.width : 0.5, y = r && sr.height ? (r.top - sr.top) / sr.height : 0.15;
      q = { x: x, y: y, art: 'lampe', warm: 0.9, staerke: tz === 'nacht' ? 0.75 : 0.6, hoehe: 0.7 };
    } else q = tz === 'morgen' ? { x: comp() ? 0.12 : -0.05, y: 0.25, art: 'fenster', warm: 0.72, staerke: 0.85, hoehe: 0.45 } : { x: comp() ? 0.14 : 0, y: 0.15, art: 'fenster', warm: 0.5, staerke: 0.8, hoehe: 0.75 };
    try { if (C6.lichtquelle && C6.lichtquelle.setze) C6.lichtquelle.setze(RAUM, q); } catch (e) {}
  }
  function setzeZeit() {
    if (!root) return;
    var tz = zeit();
    if (root.getAttribute('data-zeit') !== tz) {
      root.setAttribute('data-zeit', tz);
      try { if (C6.staunen && C6.staunen.text) C6.staunen.text('rz-glocke', glockeSatz()); } catch (e) {}
    }
    lage(); licht(tz); uhr();
    // nach Mitternacht wandert das Regal um einen Tag weiter
    malFaecher();
  }
  function uhr() {
    var u = root && root.querySelector('.c6rw-uhr'); if (!u) return;
    var d = new Date(), m = d.getMinutes(), h = d.getHours() % 12 + m / 60;
    var zh = u.querySelector('.c6rw-zeiger-h'), zm = u.querySelector('.c6rw-zeiger-m');
    if (zh) zh.setAttribute('transform', 'rotate(' + (h * 30).toFixed(1) + ' 50 50)');
    if (zm) zm.setAttribute('transform', 'rotate(' + (m * 6) + ' 50 50)');
    u.setAttribute('aria-label', 'Wanduhr, ' + d.getHours() + ':' + ('0' + m).slice(-2));
  }

  // ---------- Lage nach Maß ----------
  var lageSchl = '';
  function lage() {
    if (!root) return;
    var w = root.clientWidth, h = root.clientHeight; if (!w || !h) return;
    var c = comp();
    root.classList.toggle('c6rw-computer', c);
    var tr = root.querySelector('.c6rw-tresen'), bo = root.querySelector('.c6rw-boden'), se = root.querySelector('.c6rw-seite');
    var tw = tr.clientWidth, th = tr.clientHeight, tz = zeit();
    var schl = w + 'x' + h + '|' + tw + 'x' + th + '|' + c + '|' + tz;
    if (schl === lageSchl) return; lageSchl = schl;
    if (tw && th) tr.innerHTML = tresenBild(tw, th, c ? 20 : 13, !c);
    var bh = bo.clientHeight, br = bo.getBoundingClientRect(), rr = root.getBoundingClientRect(), tb = tr.getBoundingClientRect();
    if (bh) {
      var vx = w * 0.5, y0 = Math.max(0, tb.bottom - br.top);
      var unten = 140; try { var ue = D.querySelector('.c6k-unten'); if (ue) { var ur = ue.getBoundingClientRect(); if (ur.height > 0) unten = br.bottom - ur.top; } } catch (e) {}
      bo.innerHTML = bodenBild(w, bh, 0, vx, { b0: Math.min(w * 0.4, c ? 330 : 132), b1: Math.min(w * 0.56, c ? 470 : 186), y0: Math.round(y0 + (c ? 14 : 8)), y1: Math.round(bh - unten - (c ? 6 : 10)) });
    }
    if (c && se && se.clientWidth) {
      var sock = bo.getBoundingClientRect().top - rr.top, tt = tb.top - rr.top;
      se.innerHTML = seiteBild(se.clientWidth, sock, w / 2, tt - 70, parseFloat(getComputedStyle(root).getPropertyValue('--c6-oben')) || 54, tz);
    } else if (se) se.innerHTML = '';
    licht(tz);
  }

  function baue(slot) {
    if (root || !slot) return;
    root = el('div', 'c6rw', null);
    root.setAttribute('data-zeit', zeit());
    var f = '';
    for (var i = 0; i < 7; i++) f += '<button type="button" class="c6rw-fach" data-c6rw-fach data-i="' + i + '" data-stand="leer"><span class="c6rw-fach-loch"></span><span class="c6rw-schild"></span></button>';
    root.innerHTML =
      '<div class="c6rw-wand" aria-hidden="true"><i class="c6rw-leiste"></i><i class="c6rw-sockel"></i></div>' +
      '<div class="c6rw-boden" aria-hidden="true"></div>' +
      '<div class="c6rw-fleck" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
      '<div class="c6rw-seite" aria-hidden="true"></div>' +
      '<div class="c6rw-uhr" role="img" aria-label="Wanduhr">' + uhrBild() + '</div>' +
      '<div class="c6rw-regal" role="group" aria-label="Die nächsten sieben Tage">' +
        '<div class="c6rw-regal-pflanze" aria-hidden="true">' + pflanzeKlein() + '</div>' +
        '<div class="c6rw-regal-holz">' + f + '</div>' +
        '<div class="c6rw-leuchte" aria-hidden="true">' + leuchteBild() + '</div>' +
      '</div>' +
      '<div class="c6rw-dunkel" aria-hidden="true"></div>' +
      '<div class="c6rw-tresen" aria-hidden="true"></div>' +
      '<div class="c6rw-pflanze" aria-hidden="true">' + pflanzeGross() + '</div>' +
      '<div class="c6rw-post" data-c6rw-postfach data-brief="nein"><span class="c6rw-post-hinten" aria-hidden="true">' + ablageHinten() + '</span><span class="c6rw-post-vorne" aria-hidden="true">' + ablageVorne() + '</span></div>' +
      '<div class="c6rw-tasse" aria-hidden="true">' + tasseBild() + '</div>' +
      '<button type="button" class="c6rw-glocke" data-c6rw-ding="glocke" aria-label="Tischglocke">' + glockeBild() + '</button>';
    slot.appendChild(root);
    regal = root.querySelector('.c6rw-regal');
    faecher = [].slice.call(root.querySelectorAll('.c6rw-fach'));
    post = root.querySelector('.c6rw-post');
    glocke = root.querySelector('.c6rw-glocke');
    glocke.addEventListener('click', klingeln);
    try { if (C6.staunen && C6.staunen.an) { C6.staunen.an(glocke, 'rz-glocke', glockeSatz()); C6.staunen.an(post, 'rz-post', postSatz()); } } catch (e) {}
    // der Brief wird von der Rezeption in die Ablage gelegt (oder wieder herausgenommen)
    if ('MutationObserver' in window) new MutationObserver(postPruefen).observe(post, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    // der Brief-Schalter ändert, was über der leeren Ablage wahr ist, auch wenn sich an ihr nichts bewegt
    if (!C6.__rwBriefGelauscht) try { C6.__rwBriefGelauscht = true; C6.bus.on('brief', function (d) { if (d && d.was === 'schalter' && C6.staunen && C6.staunen.text) C6.staunen.text('rz-post', postSatz()); }); } catch (e) {}
    var b = slot.closest('.c6rz-buehne');
    if (b && 'MutationObserver' in window) new MutationObserver(offenMarkieren).observe(b, { attributes: true, attributeFilter: ['data-tag-offen'] });
    if ('ResizeObserver' in window) new ResizeObserver(function () { lage(); }).observe(root);
    malFaecher(true); postPruefen(); uhr();
    setTimeout(lage, 0);
    C6.bus.on('tageszeit', setzeZeit);
    C6.bus.on('geraet', function () { lageSchl = ''; setTimeout(lage, 60); });
    C6.bus.on('tage', function (d) {
      if (d && d.was === 'vorbereitet' && d.termId) {
        var t = null; try { t = C6.tage && C6.tage.termin ? C6.tage.termin(d.termId) : null; } catch (e) {}
        malFaecher(); if (t && t.tag) wippe(t.tag);
        return;
      }
      malFaecher();
    });
    // die Uhr geht, solange jemand an der Rezeption ist (eine Minute genau reicht)
    C6.bus.on('raum', function (id) {
      if (uhrTakt) { clearInterval(uhrTakt); uhrTakt = null; }
      if ((id && id.id || id) === RAUM) { uhr(); malFaecher(); uhrTakt = setInterval(uhr, 20000); }
    });
    if (C6.jetzt === RAUM) uhrTakt = setInterval(uhr, 20000);
    try { C6.bus.emit('rezeption-welt', { was: 'gebaut' }); } catch (e) {}
  }

  function slotVon() {
    var b = D.querySelector('.c6-buehne[data-raum="' + RAUM + '"]');
    return b ? b.querySelector('.c6rz-welt') : null;
  }
  function versuche() { if (root) return true; var s = slotVon(); if (s) { baue(s); return true; } return false; }
  // Der Slot entsteht, wenn die Rezeption gebaut wird; kommt er einen Takt später, warten wir kurz (höchstens 2 s)
  function wenn(id) {
    var r = id && typeof id === 'object' ? id.id : id;
    if (r !== RAUM || root) return;
    if (versuche()) return;
    warteBis = Date.now() + 2000;
    if (warteUhr) return;
    (function tick() { warteUhr = null; if (versuche() || Date.now() > warteBis) return; warteUhr = setTimeout(tick, 80); })();
  }
  C6.bus.on('gebaut', wenn);
  C6.bus.on('raum', wenn);
  if (C6.jetzt === RAUM) wenn(RAUM);
})();
