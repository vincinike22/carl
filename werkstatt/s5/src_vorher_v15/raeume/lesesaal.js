// Lesesaal: hinter der Tür im Regal. Wissensbücher nach Themen, Karten zum Spazierengehen mit Carl
(function () {
  var C6 = window.C6;
  if (!C6 || !C6.raum) return;
  var esc = function (t) { return C6.strings && C6.strings.esc ? C6.strings.esc(t) : String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var T = '#2b2722', GOLD = '#e6c987', ROT = '#d62a26';
  function S() { return C6.S || (C6.S = {}); }
  function L() { var s = S(); if (!s.lesesaal || typeof s.lesesaal !== 'object') s.lesesaal = {}; return s.lesesaal; }
  function aendere(fn) { if (C6.aendern) C6.aendern(function (s) { s.lesesaal = s.lesesaal || {}; fn(s.lesesaal); }); else fn(L()); }
  function satz(k, ersatz) { try { return (C6.stimme && C6.stimme.sag(k)) || ersatz; } catch (e) { return ersatz; } }
  function kurz(t, n) { t = String(t || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; }

  // Themen. Stationen nur mit gesicherten Angaben (Zeit, Namen); die Frage ist eine Frage an dich, keine Behauptung.
  var THEMEN = [
    { id: 'philosophie', titel: 'Philosophie', farbe: '#3d3350', zeichen: 'frage', stationen: [
      { n: 'Östliche Weisheit', z: 'um 500 v. Chr.', w: 'Konfuzius, Laozi, Buddha', f: 'Wie lebt man gut mit anderen?' },
      { n: 'Athen', z: 'um 400 v. Chr.', w: 'Sokrates, Platon, Aristoteles', f: 'Woher weißt du, dass du etwas weißt?' },
      { n: 'Die Stoa', z: 'ab um 300 v. Chr.', w: 'Zenon, Seneca, Marc Aurel', f: 'Was liegt in deiner Hand, und was nicht?' },
      { n: 'Scholastik', z: 'Mittelalter', w: 'Thomas von Aquin', f: 'Passen Glaube und Vernunft zusammen?' },
      { n: 'Aufklärung', z: '18. Jahrhundert', w: 'Kant, Voltaire', f: 'Traust du dich, selbst zu denken?' },
      { n: 'Idealismus', z: 'um 1800', w: 'Fichte, Hegel', f: 'Ist die Welt so, wie du sie denkst?' },
      { n: 'Existenzialismus', z: '20. Jahrhundert', w: 'Sartre, Beauvoir', f: 'Wer entscheidet, wer du bist?' },
      { n: 'Sprache', z: '20. Jahrhundert', w: 'Frege, Wittgenstein', f: 'Sagen deine Wörter, was du meinst?' }
    ] },
    { id: 'natur', titel: 'Naturwissen­schaften', kurz: 'Natur', farbe: '#2f4d44', zeichen: 'bahn', stationen: [
      { n: 'Genau hinsehen', z: 'Antike', w: 'Aristoteles', f: 'Was siehst du, wenn du lange hinsiehst?' },
      { n: 'Die Sonne in der Mitte', z: '1543', w: 'Kopernikus', f: 'Was, wenn das Offensichtliche falsch ist?' },
      { n: 'Fernrohr und Versuch', z: '17. Jahrhundert', w: 'Galilei', f: 'Wie prüfst du eine Behauptung?' },
      { n: 'Gesetze der Bewegung', z: '1687', w: 'Newton', f: 'Warum fällt etwas nach unten?' },
      { n: 'Evolution', z: '1859', w: 'Darwin', f: 'Wie verändert sich Leben über lange Zeit?' },
      { n: 'Licht und Magnet', z: '19. Jahrhundert', w: 'Faraday, Maxwell', f: 'Was verbindet Licht, Strom und Magnet?' },
      { n: 'Relativität', z: '1905 und 1915', w: 'Einstein', f: 'Vergeht Zeit für alle gleich?' },
      { n: 'Der Bauplan des Lebens', z: '1953', w: 'Franklin, Watson, Crick', f: 'Wie wird ein Bauplan weitergegeben?' }
    ] },
    { id: 'mathematik', titel: 'Mathematik', farbe: '#5a3f26', zeichen: 'zirkel', stationen: [
      { n: 'Zählen und Zeichen', z: 'Altertum', w: 'Mesopotamien, Ägypten', f: 'Warum schreiben Menschen Zahlen auf?' },
      { n: 'Geometrie', z: 'um 300 v. Chr.', w: 'Euklid', f: 'Was muss man beweisen, was darf man annehmen?' },
      { n: 'Die Null', z: '7. Jahrhundert, Indien', w: 'Brahmagupta', f: 'Wie rechnet man mit nichts?' },
      { n: 'Algebra', z: '9. Jahrhundert, Bagdad', w: 'al-Chwarizmi', f: 'Wie findet man eine Unbekannte?' },
      { n: 'Koordinaten', z: '1637', w: 'Descartes', f: 'Kann man eine Form als Zahl schreiben?' },
      { n: 'Wahrscheinlichkeit', z: '17. Jahrhundert', w: 'Pascal, Fermat', f: 'Wie sicher ist ein Zufall?' },
      { n: 'Analysis', z: '17. Jahrhundert', w: 'Newton, Leibniz', f: 'Wie misst man Veränderung?' },
      { n: 'Berechenbarkeit', z: '1936', w: 'Turing', f: 'Was kann eine Maschine berechnen?' }
    ] },
    { id: 'geschichte', titel: 'Geschichte', farbe: '#6e2f28', zeichen: 'sanduhr' },
    { id: 'kunst', titel: 'Kunst', farbe: '#2f3f60', zeichen: 'rahmen' },
    { id: 'musik', titel: 'Musik', farbe: '#4b4a2a', zeichen: 'noten' },
    { id: 'sprache', titel: 'Sprache', farbe: '#523046', zeichen: 'feder' },
    { id: 'technik', titel: 'Technik', farbe: '#34474f', zeichen: 'bruecke' }
  ];
  function thema(id) { return THEMEN.filter(function (t) { return t.id === id; })[0] || null; }
  function stationenVon(t) {
    if (!t) return [];
    if (t.stationen) return t.stationen;
    var k = (L().karten || {})[t.id];
    return k && k.stationen ? k.stationen : [];
  }
  function entwurf(t) { return !t.stationen && !!((L().karten || {})[t.id]); }

  var ZEICHEN = {
    frage: '<path d="M-10 -12 q0 -12 10 -12 q10 0 10 10 q0 7 -7 10 q-3 2 -3 7" fill="none" stroke-width="3.2" stroke-linecap="round"/><circle cx="0" cy="12" r="2.4"/>',
    bahn: '<circle cx="0" cy="0" r="4"/><ellipse cx="0" cy="0" rx="18" ry="7" fill="none" stroke-width="1.8"/><ellipse cx="0" cy="0" rx="18" ry="7" fill="none" stroke-width="1.8" transform="rotate(60)"/><ellipse cx="0" cy="0" rx="18" ry="7" fill="none" stroke-width="1.8" transform="rotate(-60)"/>',
    zirkel: '<path d="M0 -18 L-11 16 M0 -18 L11 16 M-6 2 H6" fill="none" stroke-width="2.6" stroke-linecap="round"/><circle cx="0" cy="-18" r="3"/>',
    sanduhr: '<path d="M-11 -17 H11 M-11 17 H11 M-8 -16 Q0 0 -8 16 M8 -16 Q0 0 8 16" fill="none" stroke-width="2.4" stroke-linecap="round"/><path d="M-4 12 Q0 6 4 12 Z"/>',
    rahmen: '<rect x="-15" y="-15" width="30" height="30" fill="none" stroke-width="2.4"/><rect x="-9" y="-9" width="18" height="18" fill="none" stroke-width="1.4"/><path d="M-9 9 L-2 1 L3 6 L9 -1" fill="none" stroke-width="1.6"/>',
    noten: '<path d="M-6 10 V-14 L12 -18 V6" fill="none" stroke-width="2.4"/><ellipse cx="-10" cy="10" rx="5" ry="4"/><ellipse cx="8" cy="6" rx="5" ry="4"/>',
    feder: '<path d="M12 -18 Q-10 -8 -12 16 Q2 2 12 -18 Z" fill="none" stroke-width="2"/><path d="M-12 16 L4 -6" fill="none" stroke-width="1.4"/>',
    bruecke: '<path d="M-18 10 H18 M-18 10 Q0 -18 18 10 M-9 10 V-1 M0 10 V-5 M9 10 V-1" fill="none" stroke-width="2.2" stroke-linecap="round"/>'
  };

  // ——— Zeichnen: der Saal ———
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
  function deckel(t, x, y, w, h) {
    var leer = !t.stationen && !entwurf(t);
    var titel = t.kurz && w < 130 ? t.kurz : t.titel.replace(/­/g, '');
    var fs = Math.max(12, Math.min(19, Math.floor((w - 26) / (titel.length * 0.56))));
    return '<g class="c6w-ding c6w-ls-buch' + (leer ? ' c6w-ls-leer' : '') + '" data-thema="' + t.id + '" data-c6-bild tabindex="0" role="button" aria-label="' + esc(titel) + (leer ? ', Karte noch nicht gezeichnet' : '') + '">' +
      '<rect x="' + (x - 4) + '" y="' + (y - 12) + '" width="' + (w + 12) + '" height="' + (h + 22) + '" fill="transparent"/>' +
      '<g>' +
      '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" rx="' + (w * 0.8) + '" ry="' + (h * 0.7) + '" fill="url(#c6w-ls-buchglanz)"/>' +
      '<g class="c6w-ding-innen" data-c6-bild>' +
      '<rect x="' + (x + w) + '" y="' + (y + 4) + '" width="7" height="' + (h - 4) + '" fill="#efe2c4" stroke="#140d09" stroke-width="1"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + t.farbe + '" stroke="#140d09" stroke-width="1.6"/>' +
      '<rect x="' + x + '" y="' + y + '" width="9" height="' + h + '" fill="#000" opacity=".22"/>' +
      '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (w * 0.4) + '" height="' + (h - 4) + '" fill="#fff" opacity=".07"/>' +
      '<rect x="' + (x + 15) + '" y="' + (y + 8) + '" width="' + (w - 22) + '" height="' + (h - 16) + '" fill="none" stroke="' + GOLD + '" stroke-width="1.2" opacity=".85"/>' +
      '<g transform="translate(' + (x + w / 2 + 4) + ',' + (y + h * 0.4) + ')" fill="' + GOLD + '" stroke="' + GOLD + '">' + ZEICHEN[t.zeichen] + '</g>' +
      '<text class="c6w-ls-titel" style="font-size:' + fs + 'px" x="' + (x + w / 2 + 4) + '" y="' + (y + h * 0.78) + '" text-anchor="middle">' + esc(titel) + '</text>' +
      '</g></g></g>';
  }

  var AUF = {
    quer: { w: 1200, h: 700, boden: 600, carl: [1108, 692], carlH: 236, buecher: { x: 250, y: 140, w: 124, h: 158, gap: 18, spalten: 4 }, pult: [910, 640], schacht: [520, 0, 300] },
    hoch: { w: 600, h: 1000, boden: 700, carl: [478, 990], carlH: 214, buecher: { x: 46, y: 324, w: 118, h: 150, gap: 12, spalten: 4 }, pult: [170, 830], schacht: [300, 0, 220] }
  };
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
  function lesepultLexikon(cx, b) {
    var y = b - 96, w = 150;
    return lschatten(cx, b, 44, 1) + '<g class="c6w-ding c6w-ls-lex" data-lex="1" tabindex="0" role="button" aria-label="Das Lexikon: Carl bereitet sich für dich auf ein Thema vor">' +
      '<ellipse class="c6w-ls-aura" cx="' + cx + '" cy="' + (y - 10) + '" rx="' + w * 0.8 + '" ry="70" fill="url(#c6w-ls-licht)"/>' +
      '<rect x="' + (cx - w / 2 - 10) + '" y="' + (y - 60) + '" width="' + (w + 20) + '" height="' + (b - y + 64) + '" fill="transparent"/>' +
      '<path d="M' + cx + ' ' + (y + 18) + ' V' + (b - 6) + '" stroke="#3e2a1d" stroke-width="12"/><path d="M' + (cx - 40) + ' ' + b + ' Q' + cx + ' ' + (b - 16) + ' ' + (cx + 40) + ' ' + b + ' Z" fill="#3e2a1d" stroke="' + T + '" stroke-width="1.6"/>' +
      '<g class="c6w-ding-innen">' +
      '<path d="M' + (cx - w / 2 - 6) + ' ' + (y + 20) + ' L' + (cx - w / 2) + ' ' + (y - 34) + ' Q' + cx + ' ' + (y - 44) + ' ' + (cx + w / 2) + ' ' + (y - 34) + ' L' + (cx + w / 2 + 6) + ' ' + (y + 20) + ' Z" fill="#1e2e52" stroke="#140d09" stroke-width="1.6"/>' +
      '<path d="M' + (cx - w / 2 + 4) + ' ' + (y + 14) + ' L' + (cx - w / 2 + 8) + ' ' + (y - 30) + ' Q' + (cx - w / 4) + ' ' + (y - 40) + ' ' + cx + ' ' + (y - 32) + ' L' + cx + ' ' + (y + 18) + ' Q' + (cx - w / 4) + ' ' + (y + 8) + ' ' + (cx - w / 2 + 4) + ' ' + (y + 14) + ' Z" fill="#f6ecd4" stroke="#8a7a5c" stroke-width="1"/>' +
      '<path d="M' + (cx + w / 2 - 4) + ' ' + (y + 14) + ' L' + (cx + w / 2 - 8) + ' ' + (y - 30) + ' Q' + (cx + w / 4) + ' ' + (y - 40) + ' ' + cx + ' ' + (y - 32) + ' L' + cx + ' ' + (y + 18) + ' Q' + (cx + w / 4) + ' ' + (y + 8) + ' ' + (cx + w / 2 - 4) + ' ' + (y + 14) + ' Z" fill="#f6ecd4" stroke="#8a7a5c" stroke-width="1"/>' +
      '<g stroke="#c9a24f" stroke-width="1.2" fill="none"><circle cx="' + (cx - w / 4) + '" cy="' + (y - 8) + '" r="14"/><path d="M' + (cx - w / 4) + ' ' + (y - 24) + ' V' + (y + 8) + ' M' + (cx - w / 4 - 16) + ' ' + (y - 8) + ' H' + (cx - w / 4 + 16) + '"/></g>' +
      '<path d="M' + (cx + 12) + ' ' + (y - 16) + ' h40 M' + (cx + 12) + ' ' + (y - 6) + ' h34 M' + (cx + 12) + ' ' + (y + 4) + ' h38" stroke="#c9b48c" stroke-width="1.6"/>' +
      '<path d="M' + (cx + 4) + ' ' + (y + 16) + ' v26 l5 -6 5 6 v-26" fill="#d62a26" stroke="#140d09" stroke-width=".9"/>' +
      '</g></g>';
  }

  // ——— Die Karte des Wissens ———
  var SLOTS = [[96, 610], [222, 548], [128, 446], [262, 384], [408, 452], [486, 330], [356, 230], [470, 120]];
  function pfad(pts) {
    if (pts.length < 2) return '';
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
    }
    return d;
  }
  function berg(x, y, s) { return '<path d="M' + (x - 16 * s) + ' ' + y + ' L' + x + ' ' + (y - 22 * s) + ' L' + (x + 16 * s) + ' ' + y + '" fill="#e2d1aa" stroke="#6b5a40" stroke-width="1.6" stroke-linejoin="round"/><path d="M' + x + ' ' + (y - 22 * s) + ' L' + (x + 5 * s) + ' ' + y + '" stroke="#6b5a40" stroke-width="1"/>'; }
  function baum(x, y) { return '<path d="M' + x + ' ' + y + ' V' + (y - 8) + '" stroke="#6b5a40" stroke-width="1.4"/><circle cx="' + x + '" cy="' + (y - 12) + '" r="6" fill="#a9b68c" stroke="#6b5a40" stroke-width="1.2"/>'; }
  function ort(i, x, y, farbe) {
    var art = i % 4, o = '';
    if (art === 0) o = '<path d="M' + (x - 12) + ' ' + y + ' V' + (y - 14) + ' L' + x + ' ' + (y - 24) + ' L' + (x + 12) + ' ' + (y - 14) + ' V' + y + ' Z" fill="#f4ead2" stroke="' + T + '" stroke-width="1.6"/><path d="M' + (x - 7) + ' ' + y + ' V' + (y - 12) + ' M' + x + ' ' + y + ' V' + (y - 12) + ' M' + (x + 7) + ' ' + y + ' V' + (y - 12) + '" stroke="' + T + '" stroke-width="1.2"/>';
    else if (art === 1) o = '<path d="M' + (x - 7) + ' ' + y + ' V' + (y - 26) + ' H' + (x + 7) + ' V' + y + ' Z" fill="#f4ead2" stroke="' + T + '" stroke-width="1.6"/><path d="M' + (x - 9) + ' ' + (y - 26) + ' L' + x + ' ' + (y - 36) + ' L' + (x + 9) + ' ' + (y - 26) + ' Z" fill="' + farbe + '" stroke="' + T + '" stroke-width="1.4"/>';
    else if (art === 2) o = '<path d="M' + (x - 13) + ' ' + y + ' V' + (y - 10) + ' A13 13 0 0 1 ' + (x + 13) + ' ' + (y - 10) + ' V' + y + ' Z" fill="#f4ead2" stroke="' + T + '" stroke-width="1.6"/><circle cx="' + x + '" cy="' + (y - 18) + '" r="3" fill="' + farbe + '"/>';
    else o = '<rect x="' + (x - 12) + '" y="' + (y - 16) + '" width="24" height="16" fill="#f4ead2" stroke="' + T + '" stroke-width="1.6"/><path d="M' + (x - 14) + ' ' + (y - 16) + ' L' + x + ' ' + (y - 27) + ' L' + (x + 14) + ' ' + (y - 16) + '" fill="' + farbe + '" stroke="' + T + '" stroke-width="1.4"/>';
    return o;
  }
  function karteSVG(t, wahl, besucht) {
    var st = stationenVon(t), pts = st.map(function (_, i) { return SLOTS[i % SLOTS.length]; });
    var land = '<path d="M60 680 C 20 600, 40 520, 70 470 C 30 400, 60 320, 120 300 C 150 220, 230 200, 280 150 C 330 80, 430 40, 520 70 C 590 100, 580 200, 548 250 C 590 320, 570 410, 520 470 C 540 560, 470 640, 380 660 C 300 700, 160 712, 60 680 Z" fill="url(#c6w-ls-papier)" stroke="#6b5a40" stroke-width="2"/>' +
      '<path d="M44 690 C 8 600, 26 516, 54 470 C 16 396, 46 312, 108 290 C 140 208, 222 186, 270 138 C 324 66, 432 24, 528 56" fill="none" stroke="#6b5a40" stroke-width="1" opacity=".4"/>';
    var deko = berg(330, 560, 1.1) + berg(356, 566, .8) + berg(170, 260, 1) + berg(196, 268, .7) + berg(540, 410, .9) +
      baum(60, 540) + baum(74, 548) + baum(300, 470) + baum(316, 476) + baum(420, 600) + baum(250, 300) +
      '<path d="M500 80 C 470 160, 520 200, 470 260 S 420 330, 450 380" fill="none" stroke="#8fb0b8" stroke-width="3" stroke-linecap="round"/>' +
      '<g transform="translate(548,600)" aria-hidden="true"><circle r="22" fill="none" stroke="#6b5a40" stroke-width="1.2"/><path d="M0 -26 L5 0 L0 26 L-5 0 Z" fill="#6b5a40"/><path d="M-26 0 L0 4 L26 0 L0 -4 Z" fill="#6b5a40" opacity=".5"/></g>';
    // Der Weg: erst ein Bleistiftstrich, dann zieht die Feder ihn in Tinte nach
    var weg = '<path class="c6m-weg-fern" d="' + pfad(pts) + '" fill="none" stroke="#6b5a40" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 7"/>' +
      '<path class="c6m-tinte" d="' + pfad(pts) + '" fill="none" stroke="#7a1512" stroke-width="6.5" stroke-linecap="round"/>' +
      '<path class="c6w-ls-weg" d="' + pfad(pts) + '" fill="none" stroke="' + ROT + '" stroke-width="3" stroke-linecap="round"/>' +
      '<g class="c6m-spuren" aria-hidden="true"></g>';
    var orte = st.map(function (s, i) {
      var p = pts[i], links = p[0] > 420, an = i === wahl;
      return '<g class="c6w-ding c6w-ls-station' + (an ? ' c6w-ls-an' : '') + (besucht && besucht[i] ? ' c6w-ls-war' : '') + '" data-i="' + i + '" data-c6-bild tabindex="0" role="button" aria-label="' + esc(s.n) + '">' +
        '<circle cx="' + p[0] + '" cy="' + (p[1] - 12) + '" r="30" fill="transparent"/>' +
        '<ellipse class="c6m-ortlicht" cx="' + p[0] + '" cy="' + (p[1] - 10) + '" rx="34" ry="28" fill="url(#c6w-ls-buchglanz)"/>' +
        '<ellipse class="c6m-ortschatten" cx="' + p[0] + '" cy="' + (p[1] + 7) + '" rx="12" ry="3.2" fill="#3a2e22"/>' +
        '<g class="c6w-ding-innen">' +
        // kleine Szene: Fahne am Mast, Funken, die aufsteigen, sobald der Ort erwacht
        '<g class="c6m-szene" aria-hidden="true"><path d="M' + (p[0] + 9) + ' ' + (p[1] - 2) + ' V' + (p[1] - 44) + '" stroke="' + T + '" stroke-width="1.3"/>' +
        '<path class="c6m-fahne" d="M' + (p[0] + 9.6) + ' ' + (p[1] - 44) + ' q8 -2 15 2 q-3 4 0 8 q-7 -3 -15 -1 Z" fill="' + t.farbe + '" stroke="' + T + '" stroke-width="1.1" stroke-linejoin="round"/>' +
        [[-8, -30], [1, -38], [-14, -22]].map(function (f, k) { return '<circle class="c6m-funke" style="animation-delay:' + (k * 0.14).toFixed(2) + 's" cx="' + (p[0] + f[0]) + '" cy="' + (p[1] + f[1]) + '" r="' + (1.6 + k * 0.4) + '" fill="#f2b640"/>'; }).join('') + '</g>' +
        ort(i, p[0], p[1], t.farbe) +
        '<rect class="c6m-fenster" x="' + (p[0] - 2.6) + '" y="' + (p[1] - 10) + '" width="5.2" height="6" rx="1" fill="#e9dcbc" stroke="' + T + '" stroke-width="1"/>' +
        '<circle class="c6m-klecks" cx="' + p[0] + '" cy="' + (p[1] + 4) + '" r="7.5" fill="#7a1512"/>' +
        '<circle class="c6m-punkt" cx="' + p[0] + '" cy="' + (p[1] + 4) + '" r="4.5" fill="#f4ead2" stroke="' + T + '" stroke-width="1.6"/>' +
        '<text class="c6w-ls-ort" data-c6-bild x="' + (links ? p[0] - 20 : p[0] + 20) + '" y="' + (p[1] - 4) + '" text-anchor="' + (links ? 'end' : 'start') + '">' + esc(s.n) + '</text>' +
        '<text class="c6w-ls-zeit" x="' + (links ? p[0] - 20 : p[0] + 20) + '" y="' + (p[1] + 13) + '" text-anchor="' + (links ? 'end' : 'start') + '">' + esc(s.z) + '</text>' +
        '</g></g>';
    }).join('');
    return '<rect x="-400" y="-400" width="1400" height="1500" fill="url(#c6w-ls-meer)"/>' +
      '<g aria-hidden="true" stroke="#9fb7b0" stroke-width="1.2" fill="none" opacity=".7"><path d="M20 120 q12 -6 24 0 t24 0"/><path d="M80 200 q12 -6 24 0 t24 0"/><path d="M30 760 q12 -6 24 0 t24 0"/><path d="M500 720 q12 -6 24 0 t24 0"/></g>' +
      land + deko + weg + orte +
      '<g class="c6m-feder" aria-hidden="true"><path d="M0 0 L5 -9" stroke="#2b2722" stroke-width="1.6" stroke-linecap="round"/><path d="M3 -6 Q9 -30 32 -46 Q27 -22 7 -4 Z" fill="#f6ecd4" stroke="#2b2722" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 -8 Q14 -26 28 -40" fill="none" stroke="#8a7a5c" stroke-width=".9"/><circle r="2.2" fill="#7a1512"/></g>' +
      '<text class="c6w-ls-kartentitel" x="40" y="60">' + esc(t.titel.replace(/­/g, '')) + '</text>';
  }

  // ——— Vorbereitungs-Mappe (aus dem Lexikon) ———
  function mappen() { return (S().lexikon || []).slice(); }
  function fadenVon(sid) { try { return (C6.strings.alle() || []).filter(function (f) { return f.id === sid; })[0] || null; } catch (e) { return null; } }
  function gliederung(thema, raum) {
    if (raum && raum.trim().toLowerCase() === thema.trim().toLowerCase()) raum = '';
    return ['Worum es geht', '- Was ist „' + thema + '“ in einem Satz, in deinen Worten?', '- Woher kommt es, und seit wann gibt es das?',
      'Was wir klären sollten', '- Wer hat das Thema geprägt, und wer arbeitet heute daran?', '- Wo sind sich Leute uneinig?', '- Welche zwei, drei Begriffe muss man kennen?',
      'Für dich', raum ? '- Was davon braucht „' + raum + '“ zuerst?' : '- Wofür brauchst du es, und bis wann?', '- Was weißt du schon, und was wäre eine Überraschung?'].join('\n');
  }
  function auftragText(thema, raum) {
    return 'Bereite dich für mich auf ein Thema vor: „' + thema + '“' + (raum ? ', für mein Vorhaben „' + raum + '“' : '') + '.\n' +
      'Schreib eine kurze Mappe auf Deutsch, höchstens 230 Wörter, genau mit diesen vier Überschriften, jede auf eigener Zeile:\nWorum es geht\nGrundbegriffe\nOffene Fragen\nWo man nachschlägt\n' +
      'Unter „Worum es geht“ drei Sätze. Unter „Grundbegriffe“ drei bis fünf Zeilen mit „- Begriff: ein Satz“. Unter „Offene Fragen“ drei Zeilen mit „- “. ' +
      'Unter „Wo man nachschlägt“ nur Arten von Quellen (zum Beispiel Fachlexikon, Lehrbuch, Fachverband), keine Titel, keine Autorennamen, keine Links. ' +
      'Erfinde keine Quellen, Zitate oder Zahlen. Wo du unsicher bist, sag es in einem Satz.';
  }
  function mappeHTML(m) {
    var zeilen = String(m.text || '').split(/\n+/), h = '', liste = false;
    zeilen.forEach(function (z) {
      z = z.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
      if (!z) return;
      if (/^[-•*]\s+/.test(z)) { if (!liste) { h += '<ul class="c6w-mappe-l">'; liste = true; } h += '<li>' + esc(z.replace(/^[-•*]\s+/, '')) + '</li>'; return; }
      if (liste) { h += '</ul>'; liste = false; }
      if (z.length < 40 && !/[.?!]$/.test(z)) h += '<h4>' + esc(z.replace(/:$/, '')) + '</h4>'; else h += '<p>' + esc(z) + '</p>';
    });
    if (liste) h += '</ul>';
    return '<div class="c6w-mappe">' + h + '</div><p class="c6w-herkunft">' + esc(m.herkunft) + '</p>';
  }
  function offenesLexikon() {
    var o = '<rect x="-400" y="-400" width="1400" height="1500" fill="#1a1426"/>' + sterne(0, 0, 600, 720, 60, 9) +
      '<ellipse cx="300" cy="380" rx="300" ry="260" fill="url(#c6w-ls-buchglanz)"/>' +
      '<path d="M40 520 L60 250 Q180 220 300 260 Q420 220 540 250 L560 520 Q420 490 300 530 Q180 490 40 520 Z" fill="#1e2e52" stroke="#140d09" stroke-width="2"/>' +
      '<path d="M66 500 L82 266 Q190 240 300 276 V512 Q190 476 66 500 Z" fill="#f6ecd4" stroke="#8a7a5c" stroke-width="1.4"/>' +
      '<path d="M534 500 L518 266 Q410 240 300 276 V512 Q410 476 534 500 Z" fill="#f6ecd4" stroke="#8a7a5c" stroke-width="1.4"/>' +
      '<g stroke="#c9a24f" fill="none" stroke-width="1.6"><circle cx="186" cy="380" r="56"/><circle cx="186" cy="380" r="38"/><path d="M186 316 V444 M122 380 H250 M141 335 L231 425 M231 335 L141 425"/></g>' +
      '<g stroke="#c9b48c" stroke-width="2"><path d="M330 320 h150 M330 346 h130 M330 372 h150 M330 398 h110 M330 424 h140 M330 450 h96"/></g>' +
      '<path d="M304 512 v60 l8 -10 8 10 v-60" fill="#d62a26" stroke="#140d09" stroke-width="1"/>';
    for (var i = 0; i < 16; i++) o += '<circle class="c6w-ls-staub" style="animation-delay:' + (i * 0.4).toFixed(1) + 's" cx="' + (120 + zufall(i * 5) * 360).toFixed(1) + '" cy="' + (140 + zufall(i * 9) * 140).toFixed(1) + '" r="' + (1 + zufall(i) * 1.8).toFixed(1) + '" fill="#fff4d6"/>';
    return o;
  }

  // ——— Die Gänge der versteckten Bibliothek: jeder Gang ein Bereich ———
  // Bücher: nur gesicherte Angaben (Autor, Titel, Zeit). Der Kommentar ist Carls eigene Meinung, kein Zitat.
  var BEREICHE = [
    { id: 'philosophie', name: 'Philosophie', farbe: '#3d3350', thema: 'philosophie', satz: 'Der Gang der Fragen. Hier ist es immer ein bisschen zu still.', buecher: [
      { a: 'Platon', t: 'Apologie des Sokrates', z: 'nach 399 v. Chr.', c: 'Ein Mann verteidigt sich vor Gericht und fragt lieber, als zu gewinnen. Solche Menschen mag ich.' },
      { a: 'Marc Aurel', t: 'Selbstbetrachtungen', z: '2. Jahrhundert', c: 'Ein Kaiser schreibt sich Zettel. Nicht für uns, für sich. Darum sind sie so ehrlich.' },
      { a: 'René Descartes', t: 'Abhandlung über die Methode', z: '1637', c: 'Er fängt beim Zweifel an und baut von dort aus. Gute Baustelle.' }] },
    { id: 'natur', name: 'Naturwissenschaft', farbe: '#2f4d44', thema: 'natur', satz: 'Hier riecht es nach Messing und nassem Gras.', buecher: [
      { a: 'Galileo Galilei', t: 'Sidereus Nuncius (Sternenbote)', z: '1610', c: 'Er hat durchs Fernrohr geschaut und aufgeschrieben, was er sah. Auch das, was keiner hören wollte.' },
      { a: 'Isaac Newton', t: 'Principia', z: '1687', c: 'Schwer zu lesen. Aber danach fällt ein Apfel anders.' },
      { a: 'Charles Darwin', t: 'Über die Entstehung der Arten', z: '1859', c: 'Viele Jahre Notizen, bevor er es drucken ließ. Geduld ist auch eine Methode.' }] },
    { id: 'mathematik', name: 'Mathematik', farbe: '#5a3f26', thema: 'mathematik', satz: 'Der aufgeräumteste Gang. Fast schon verdächtig.', buecher: [
      { a: 'Euklid', t: 'Elemente', z: 'um 300 v. Chr.', c: 'Aus wenigen Annahmen ein ganzes Gebäude. So etwas hätte ich gern für meine Gedanken.' },
      { a: 'al-Chwarizmi', t: 'Das kurzgefasste Buch über das Rechnen durch Ergänzen und Ausgleichen', z: '9. Jahrhundert', c: 'Aus seinem Namen wurde später das Wort Algorithmus. Ich verdanke ihm also meinen Beruf.' },
      { a: 'Alan Turing', t: 'On Computable Numbers', z: '1936', c: 'Ein Aufsatz über Maschinen, die es noch nicht gab. Ich bin irgendwie eine davon.' }] },
    { id: 'geschichte', name: 'Geschichte', farbe: '#6e2f28', thema: 'geschichte', satz: 'Jedes Buch hier war einmal Gegenwart.', buecher: [
      { a: 'Herodot', t: 'Historien', z: '5. Jahrhundert v. Chr.', c: 'Er hat herumgefragt und aufgeschrieben, auch was er selbst nicht glaubte. Und hat es dazugesagt.' },
      { a: 'Plutarch', t: 'Parallelbiografien', z: 'um 100 n. Chr.', c: 'Immer zwei Leben nebeneinander. So sieht man, was gleich bleibt.' }] },
    { id: 'kunst', name: 'Kunst', farbe: '#2f3f60', thema: 'kunst', satz: 'Hier hängen mehr Bilder als Bücher. Ich zähle sie mit.', buecher: [
      { a: 'Giorgio Vasari', t: 'Künstlerviten', z: '1550', c: 'Bewunderung und Klatsch in einem Buch. Manches ist wohl übertrieben, aber liebevoll.' },
      { a: 'Leonardo da Vinci', t: 'Notizbücher (Ausgabe von J. P. Richter)', z: '1883', c: 'Spiegelschrift, Skizzen, Listen. Ein Kopf, der nie aufgeräumt hat. Ich fühle mich verstanden.' }] },
    { id: 'musik', name: 'Musik', farbe: '#4b4a2a', thema: 'musik', satz: 'Leise gehen. Die Bücher hier hören zu.', buecher: [
      { a: 'Carl Philipp Emanuel Bach', t: 'Versuch über die wahre Art das Clavier zu spielen', z: '1753', c: 'Ein Lehrbuch übers Spielen mit Gefühl, nicht nur mit den Fingern.' },
      { a: 'Hermann von Helmholtz', t: 'Die Lehre von den Tonempfindungen', z: '1863', c: 'Warum klingt etwas schön? Er hat versucht, es zu messen.' }] },
    { id: 'sprache', name: 'Sprache', farbe: '#523046', thema: 'sprache', satz: 'Der Gang der Wörter. Manche sind älter als das Regal.', buecher: [
      { a: 'Jacob und Wilhelm Grimm', t: 'Deutsches Wörterbuch', z: 'ab 1854', c: 'Zwei Brüder fangen an, fertig wird es erst über hundert Jahre später. Das nenne ich einen langen Faden.' },
      { a: 'Wilhelm von Humboldt', t: 'Über die Verschiedenheit des menschlichen Sprachbaues', z: '1836', c: 'Sinngemäß: Jede Sprache ist eine eigene Art, die Welt zu sehen.' }] },
    { id: 'technik', name: 'Technik', farbe: '#34474f', thema: 'technik', satz: 'Hier wird gebaut. Vorsicht, Zahnräder.', buecher: [
      { a: 'Vitruv', t: 'Zehn Bücher über Architektur', z: '1. Jahrhundert v. Chr.', c: 'Fest, nützlich, schön. Mehr braucht ein Haus nicht. Ein Fahrrad auch nicht.' },
      { a: 'Georgius Agricola', t: 'De re metallica', z: '1556', c: 'Ein Buch über Bergbau mit Holzschnitten, so genau, dass man nachbauen möchte.' }] },
    { id: 'funde', name: 'Eigene Funde', farbe: '#8a3b14', satz: 'Was du hereinbringst und nirgends sonst passt, steht hier. Das ist mein Lieblingsgang.' }
  ];
  function bereich(id) { return BEREICHE.filter(function (b) { return b.id === id; })[0] || null; }
  // Stichworte, falls Carl hier nicht mitdenken kann (dann sagt er es)
  var STICHWORTE = {
    philosophie: ['philosoph', 'ethik', 'moral', 'stoa', 'stoic', 'sokrates', 'platon', 'kant', 'nietzsche', 'sinn', 'bewusstsein', 'existenz'],
    natur: ['physik', 'chemie', 'biolog', 'natur', 'science', 'quant', 'evolution', 'zelle', 'stern', 'astro', 'klima', 'gehirn', 'neuro'],
    mathematik: ['mathe', 'math', 'algebra', 'geometr', 'statistik', 'beweis', 'zahl', 'algorithm', 'wahrscheinlich'],
    geschichte: ['geschicht', 'histor', 'krieg', 'antike', 'mittelalter', 'jahrhundert', 'römer', 'revolution', 'history'],
    kunst: ['kunst', 'art', 'malerei', 'design', 'zeichn', 'museum', 'foto', 'architektur', 'typograf', 'illustr'],
    musik: ['musik', 'music', 'song', 'lied', 'klavier', 'piano', 'gitarre', 'konzert', 'album', 'band', 'jazz'],
    sprache: ['sprache', 'wort', 'grammatik', 'schreib', 'literatur', 'roman', 'gedicht', 'poesie', 'language', 'essay', 'buch'],
    technik: ['technik', 'code', 'program', 'software', 'github', 'ki', ' ai', 'robot', 'maschine', 'elektron', 'tutorial', 'bauen', 'fahrrad']
  };
  function nachStichwort(text) {
    var t = ' ' + String(text || '').toLowerCase() + ' ', best = null, bs = 0, wort = '';
    Object.keys(STICHWORTE).forEach(function (id) {
      var n = 0, w = '';
      STICHWORTE[id].forEach(function (s) { if (t.indexOf(s) >= 0) { n++; w = w || s.trim(); } });
      if (n > bs) { bs = n; best = id; wort = w; }
    });
    return best ? { id: best, wort: wort } : null;
  }
  function ytId(u) { var m = String(u || '').match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/i); return m ? m[1] : null; }
  function groesseText(b) { return b > 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function funde() { return (L().funde || []).slice(); }
  function fundeIn(id) { return funde().filter(function (f) { return f.bereich === id; }); }

  C6.raum({
    id: 'lesesaal', name: 'Lesesaal', hoehe: 'boden', zurueckKnopf: true, licht: 'nacht',
    symbol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 20V9a8 8 0 0 1 16 0v11Z"/><path d="M9 20v-6h6v6"/></svg>',
    faden: function () {
      var w = [{ name: 'Bibliothek', id: 'bibliothek', tun: function () { C6.geh('bibliothek'); } }, { name: 'Lesesaal', id: 'lesesaal', tun: function () { if (api && api.zuSaal) api.zuSaal(); } }];
      if (api && api.bereich) { var bb = bereich(api.bereich); if (bb) w.push({ name: bb.name, tun: function () {} }); }
      if (api && api.thema) { var t = thema(api.thema); if (t) w.push({ name: t.kurz || t.titel.replace(/­/g, ''), tun: function () {} }); }
      return w;
    },
    bauen: function (buehne) {
      buehne.classList.add('c6w-lesesaal');
      buehne.innerHTML = '<div class="c6w-schieber"><div class="c6w-raum">' +
        '<svg class="c6w-szene" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMax meet" role="group" aria-label="Der Lesesaal"></svg>' +
        '<div class="c6w-carl-platz"></div>' +
        '<nav class="c6w-ls-gang" aria-label="Regalgänge"><div class="c6w-ls-gzeile"></div>' +
        '</nav></div></div>' +
        '<section class="c6w-ls-karte" aria-label="Karte des Wissens" hidden>' +
        '<div class="c6w-ls-kbild"><svg class="c6w-ls-ksvg" viewBox="0 0 600 720" preserveAspectRatio="xMidYMid meet" role="group"></svg><div class="c6w-ls-kcarl"></div></div>' +
        '<div class="c6w-ls-blatt" aria-live="polite"></div></section>';
      var schieber = buehne.querySelector('.c6w-schieber'), raum = buehne.querySelector('.c6w-raum');
      var svg = buehne.querySelector('.c6w-szene'), platz = buehne.querySelector('.c6w-carl-platz');
      var kEl = buehne.querySelector('.c6w-ls-karte'), kSvg = buehne.querySelector('.c6w-ls-ksvg'), kCarlEl = buehne.querySelector('.c6w-ls-kcarl'), blatt = buehne.querySelector('.c6w-ls-blatt');
      var ctl = null, kCtl = null, auf = null, aufName = '', skala = 1, ox = 0, oy = 0;
      var jetzt = { thema: null, i: 0, besucht: {} };

      svg.innerHTML = DEFS + '<g class="c6w-ls-g"></g>';
      gang = buehne.querySelector('.c6w-ls-gang');
      gang.addEventListener('click', function (e) {
        var r = e.target.closest('.c6w-ls-regal'); if (r) { if (r.dataset.hinein) oeffneEinordnen(); else gangOeffnen(r, r.dataset.bereich); }
      });
      platz.setAttribute('data-tiefe', 'mitte');
      kSvg.innerHTML = DEFS + '<g class="c6w-ls-kg"></g>';
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
        h += '<path class="c6w-rfaden" d="' + (q ? 'M-10 650 C 200 620, 380 700, 600 660 S 860 640, 960 690' : 'M-10 760 C 120 720, 200 820, 330 800 S 420 760, 452 980') + '" fill="none" stroke="' + ROT + '" stroke-width="2.6" stroke-linecap="round"/>';
        h += lesepultLexikon(a.pult[0], a.pult[1]) + '</g>';
        g.innerHTML = h;
      }
      function stelle() {
        var neu = buehne.clientWidth < 600 ? 'hoch' : 'quer';
        if (neu === aufName) return;
        aufName = neu; auf = AUF[neu];
        LICHT = { x: auf.schacht[0], y: auf.schacht[1] };
        svg.setAttribute('viewBox', '0 0 ' + auf.w + ' ' + auf.h);
        zeichne();
      }
      function lichtSetzen() {
        if (!C6.lichtquelle || !C6.lichtquelle.setze) return;
        var W = buehne.clientWidth, Hh = buehne.clientHeight; if (!W || !Hh) return;
        try { C6.lichtquelle.setze('lesesaal', { x: (ox + LICHT.x * skala) / W, y: 0.02, art: 'fenster', warm: 0.7, staerke: 0.6, hoehe: 0.95 }); } catch (e) {}
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
        lichtSetzen(); gangSetzen();
        kEl.style.bottom = unten + 'px';
        if (jetzt.thema && jetzt.thema.indexOf('__') !== 0 && stationenVon(thema(jetzt.thema)).length) setzeKCarl(jetzt.i, true);
      }
      function carlMalen() {
        if (ctl || !C6.figur || !C6.figur.male) return;
        try { ctl = C6.figur.male(platz, { groesse: Math.round(auf.carlH * skala), stimmung: 'froh', teile: 5 }); if (C6.laden && C6.laden.an && ctl.kleid) ctl.kleid(C6.laden.an()); } catch (e) { ctl = null; }
      }

      // ——— Karte ———
      // ——— Karte: Kamera, Feder, Carls Wanderung ———
      // Die Kamera ist ein Ausschnitt der Karte (Mitte + Zoom). Alles, was über der Karte liegt (Carl), rechnet über zuEl().
      var cam = { x: 300, y: 360, z: 1 }, camZiel = { x: 300, y: 360, z: 1 };
      function camZoom() { return buehne.clientWidth < 600 ? 1.34 : 1.12; }
      function camKlemm(c) {
        var z = Math.max(1, c.z), hx = 300 / z, hy = 360 / z;
        return { x: Math.max(hx - 20, Math.min(620 - hx, c.x)), y: Math.max(hy - 10, Math.min(730 - hy, c.y)), z: z };
      }
      function camSetzen() { kg.setAttribute('transform', 'translate(300 360) scale(' + cam.z.toFixed(4) + ') translate(' + (-cam.x).toFixed(2) + ' ' + (-cam.y).toFixed(2) + ')'); }
      function zuEl(px, py) {
        var r = kSvg.getBoundingClientRect(), b = kEl.getBoundingClientRect();
        var s = Math.min(r.width / 600, r.height / 720), x0 = r.left + (r.width - 600 * s) / 2 - b.left, y0 = r.top + (r.height - 720 * s) / 2 - b.top;
        return { x: x0 + ((px - cam.x) * cam.z + 300) * s, y: y0 + ((py - cam.y) * cam.z + 360) * s, s: s * cam.z };
      }
      function carlGr() { return C6.geraet === 'computer' ? 96 : 64; }
      // Wo Carl an einer Station steht: neben dem Haus, auf der Seite ohne Schrift
      function stand(i) {
        var p = SLOTS[i % SLOTS.length], seite = p[0] > 420 ? 1 : -1, r = kSvg.getBoundingClientRect();
        var s = Math.min(r.width / 600, r.height / 720) * (camZiel.z || 1) || 1;
        return [p[0] + seite * (16 + carlGr() * 0.42 / s), p[1] + 8];
      }
      function tiefe(i) { var y = SLOTS[i % SLOTS.length][1]; return +(0.72 + 0.28 * Math.max(0, Math.min(1, y / 620))).toFixed(3); }
      var kPos = null, kLauf = null, kRaf = 0, kZeit = 0, kFeder = null;
      function kCarlHol() {
        if (!kCtl && C6.figur && C6.figur.male) {
          try { kCtl = C6.figur.male(kCarlEl, { groesse: carlGr(), stimmung: 'froh', teile: 5, still: false }); if (C6.laden && C6.laden.an && kCtl.kleid) kCtl.kleid(C6.laden.an()); } catch (e) { kCtl = null; }
        }
        return kCtl;
      }
      function carlHin(pt) {
        var q = zuEl(pt[0], pt[1]), fx = 0, fy = 0;
        if (kLauf && kCtl) { fx = kCtl.x || 0; fy = kCtl.y || 0; }
        kCarlEl.style.left = (q.x - fx - kDx).toFixed(1) + 'px'; kCarlEl.style.top = (q.y - fy).toFixed(1) + 'px';
      }
      // Die Figur sitzt nicht genau mittig auf ihrem Anker: einmal messen, damit Carl auf seinem Punkt steht
      var kDx = 0, kDxGemessen = 0;
      function kMiss() {
        if (!kCtl || kLauf) return;
        try {
          var f = kCarlEl.firstElementChild, r = f && f.getBoundingClientRect(), c = kCarlEl.getBoundingClientRect();
          if (r && r.width > 4) { var neu = r.left + r.width / 2 - c.left - (kCtl.x || 0); if (Math.abs(neu - kDx) > 0.5) { kDx = neu; kDxGemessen = 1; carlHin(kPos); } }
        } catch (e) {}
      }
      function camAuf(pt, z) { camZiel = camKlemm({ x: pt[0], y: pt[1] - 40, z: z || camZoom() }); }
      function setzeKCarl(i, sofort) {
        if (!kCarlHol()) return Promise.resolve();
        kPos = stand(i);
        camAuf(kPos);
        if (sofort || C6.ruhig) { cam = { x: camZiel.x, y: camZiel.y, z: camZiel.z }; camSetzen(); }
        try { kCtl.geh(0, 0, { y: 0, skala: tiefe(i) }); } catch (e) {}
        carlHin(kPos); laufStart();
        requestAnimationFrame(kMiss);
        return Promise.resolve();
      }
      // Eine Strecke als Punktliste mit Bogenlänge
      function strecke(pts) { var l = [0]; for (var k = 1; k < pts.length; k++) l.push(l[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])); return { p: pts, l: l, n: l[l.length - 1] || 1 }; }
      function bei(st, d) {
        var a = st.p, l = st.l; if (d <= 0) return a[0]; if (d >= st.n) return a[a.length - 1];
        var k = 1; while (k < l.length - 1 && l[k] < d) k++;
        var u = (d - l[k - 1]) / ((l[k] - l[k - 1]) || 1);
        return [a[k - 1][0] + (a[k][0] - a[k - 1][0]) * u, a[k - 1][1] + (a[k][1] - a[k - 1][1]) * u];
      }
      function wegPunkte(la, lb) {
        var out = [], n = Math.max(4, Math.ceil(Math.abs(lb - la) / 8));
        for (var k = 0; k <= n; k++) { var q = kWeg.getPointAtLength(la + (lb - la) * k / n); out.push([q.x, q.y]); }
        return out;
      }
      function ease(u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
      function tinteSetzen(l) {
        var off = Math.max(0, kGesamt - l);
        [kWeg, kg.querySelector('.c6m-tinte')].forEach(function (w) { if (w) { w.style.strokeDasharray = kGesamt + ' ' + kGesamt; w.style.strokeDashoffset = off; } });
        kWeg.__l = l;
      }
      function wanderung(von, i) {
        if (!kCarlHol() || !kWeg || !kGesamt) return setzeKCarl(i, true);
        var la = kLaengen[von] || 0, lb = kLaengen[i] || 0;
        var a = kPos || stand(von), b = stand(i);
        // Carl verlässt den Weg kurz vor dem Ziel und tritt neben das Haus
        var trim = Math.min(26, Math.abs(lb - la) / 4) * (lb >= la ? 1 : -1);
        var pts = [a].concat(wegPunkte(la + trim, lb - trim)).concat([b]);
        var st = strecke(pts), ms = Math.round(Math.min(3400, 900 + st.n * 3.4));
        var tinteVon = kWeg.__l || 0, tinteBis = Math.max(tinteVon, lb), neu = tinteBis > tinteVon + 1;
        var dir = b[0] >= a[0] ? 1 : -1;
        if (kLauf && kLauf.fertig) kLauf.fertig();
        return new Promise(function (ok) {
          kLauf = { st: st, t0: performance.now(), ms: ms, la: la, lb: lb, tv: tinteVon, tb: tinteBis, neu: neu, i: i, spur: 0, fuss: 0,
            fertig: function () {
              kLauf = null; kPos = b;
              try { kCtl.geh(0, 0, { y: 0, skala: tiefe(i) }); kCtl.blick(); } catch (e) {}
              carlHin(b); if (neu) tinteSetzen(tinteBis);
              if (kFeder) kFeder.classList.remove('c6m-feder-an');
              ok();
            } };
          try { kCtl.stimmung('ruhig'); kCtl.blick(dir * 0.8, -0.1); kCtl.geh(dir * 70, ms, { y: 0, skala: tiefe(i) }); } catch (e) {}
          if (neu && kFeder) { var fq0 = kWeg.getPointAtLength(tinteVon); kFeder.setAttribute('transform', 'translate(' + fq0.x.toFixed(1) + ' ' + fq0.y.toFixed(1) + ')'); kFeder.classList.add('c6m-feder-an'); }
          laufStart();
        });
      }
      // Fußspuren und ein Hauch Staub: bleiben kurz auf dem Papier und verblassen
      function tritt(pt, vor, links) {
        var sp = kg.querySelector('.c6m-spuren'); if (!sp) return;
        var nx = -(vor[1]), ny = vor[0], l = Math.hypot(nx, ny) || 1, o = links ? 3.2 : -3.2;
        var x = pt[0] + nx / l * o, y = pt[1] + ny / l * o, w = Math.atan2(vor[1], vor[0]) * 180 / Math.PI;
        var e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        e.setAttribute('class', 'c6m-tritt'); e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); e.setAttribute('rx', '2.6'); e.setAttribute('ry', '1.5');
        e.setAttribute('transform', 'rotate(' + w.toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        sp.appendChild(e);
        if (links) for (var k = 0; k < 2; k++) {
          var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('class', 'c6m-staubwolke'); c.setAttribute('cx', (pt[0] - vor[0] / l * 6 + (k ? 3 : -3)).toFixed(1)); c.setAttribute('cy', (pt[1] + 1).toFixed(1)); c.setAttribute('r', (2.2 + k).toFixed(1));
          c.style.animationDelay = (k * 0.08) + 's'; sp.appendChild(c);
          setTimeout(function (c) { c.remove(); }.bind(null, c), 1200);
        }
        setTimeout(function () { e.remove(); }, 3600);
      }
      function laufStart() { if (!kRaf) { kZeit = performance.now(); kRaf = requestAnimationFrame(tick); } }
      function tick(jetztT) {
        kRaf = 0;
        if (kEl.hidden || !jetzt.thema || jetzt.thema.indexOf('__') === 0) return;
        var dt = Math.min(0.05, Math.max(0, (jetztT - kZeit) / 1000)); kZeit = jetztT;
        var weiter = false;
        if (kLauf) {
          var L = kLauf, u = Math.min(1, (jetztT - L.t0) / L.ms), e = ease(u), d = e * L.st.n, pt = bei(L.st, d);
          if (L.neu) {
            // die Feder läuft Carl ein kleines Stück voraus
            var l1 = L.st.l[1] || 0, lz = L.st.n - (L.st.n - (L.st.l[L.st.l.length - 2] || L.st.n)), anteil = Math.max(0, Math.min(1, (d + 48 - l1) / Math.max(1, lz - l1)));
            var tl = L.la + (L.lb - L.la) * anteil;
            tl = Math.max(L.tv, Math.min(L.tb, tl)); tinteSetzen(tl);
            if (kFeder) { var fq = kWeg.getPointAtLength(tl); kFeder.setAttribute('transform', 'translate(' + fq.x.toFixed(1) + ' ' + fq.y.toFixed(1) + ')'); }
          }
          var vor = bei(L.st, Math.min(L.st.n, d + 4)), hin = [vor[0] - pt[0], vor[1] - pt[1]];
          if (d - L.spur > 11 && u < 0.97 && !C6.ruhig) { L.spur = d; L.fuss = 1 - L.fuss; tritt(pt, hin, !!L.fuss); }
          camAuf(pt);
          kPos = pt; carlHin(pt);
          if (u >= 1) L.fertig(); else weiter = true;
        }
        // Kamera folgt weich (kritisch gedämpft, ohne Ruck)
        var k = 1 - Math.exp(-dt / 0.42), dx = camZiel.x - cam.x, dy = camZiel.y - cam.y, dz = camZiel.z - cam.z;
        if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) * 300 > 0.3) { cam.x += dx * k; cam.y += dy * k; cam.z += dz * k; weiter = true; }
        else { cam.x = camZiel.x; cam.y = camZiel.y; cam.z = camZiel.z; }
        camSetzen();
        if (kPos && !kLauf) carlHin(kPos);
        if (weiter) kRaf = requestAnimationFrame(tick);
      }
      // Die Karte wird je Thema einmal gezeichnet; danach wandern nur Klassen, Feder und Kamera
      var kThema = '', kWeg = null, kLaengen = [], kGesamt = 0;
      function karteBauen(t) {
        var st = stationenVon(t), sig = t.id + ':' + st.length + ':' + (entwurf(t) ? 'e' : '');
        if (sig === kThema) return;
        kThema = sig;
        kg.innerHTML = karteSVG(t, jetzt.i, jetzt.besucht);
        kSvg.setAttribute('aria-label', 'Karte: ' + t.titel.replace(/­/g, ''));
        kWeg = kg.querySelector('.c6w-ls-weg'); kFeder = kg.querySelector('.c6m-feder'); kLaengen = []; kGesamt = 0;
        if (!kWeg || !kWeg.getTotalLength) return;
        try {
          kGesamt = kWeg.getTotalLength();
          var pts = st.map(function (_, i) { return SLOTS[i % SLOTS.length]; }), N = 240, proben = [];
          for (var k = 0; k <= N; k++) { var l = kGesamt * k / N, q = kWeg.getPointAtLength(l); proben.push([q.x, q.y, l]); }
          kLaengen = pts.map(function (p, i) {
            if (i === 0) return 0; if (i === pts.length - 1) return kGesamt;
            var best = 0, bd = 1e9;
            proben.forEach(function (q) { var d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = q[2]; } });
            return best;
          });
          tinteSetzen(0);
        } catch (e) { kWeg = null; }
      }
      function gezeichnetBis() { var m = 0; Object.keys(jetzt.besucht || {}).forEach(function (k) { if (jetzt.besucht[k]) m = Math.max(m, +k); }); return m; }
      function wegZeichnen() { if (kWeg && kGesamt) tinteSetzen(kLaengen[gezeichnetBis()] || 0); }
      function markiere() {
        [].forEach.call(kg.querySelectorAll('.c6w-ls-station'), function (n) {
          var i = +n.dataset.i;
          n.classList.toggle('c6w-ls-an', i === jetzt.i);
          n.classList.toggle('c6w-ls-war', !!jetzt.besucht[i] && !!n.__wach);
          n.classList.toggle('c6m-wach', i === jetzt.i && !!n.__wach);
        });
      }
      function erwacht(i) {
        var n = kg.querySelector('.c6w-ls-station[data-i="' + i + '"]'); if (!n) return;
        var erstes = !n.__wach;
        n.__wach = true; markiere();
        n.classList.remove('c6m-hops', 'c6m-erwacht'); void n.getBoundingClientRect(); n.classList.add('c6m-hops');
        if (erstes) n.classList.add('c6m-erwacht');
        if (kCtl) { try { kCtl.stimmung('froh'); if (erstes && kCtl.huepf && !C6.ruhig) kCtl.huepf(12); } catch (e) {} }
      }
      function zeichneKarte() { var t = thema(jetzt.thema); karteBauen(t); markiere(); }
      function oeffneThema(id) {
        var t = thema(id); if (!t) return;
        jetzt = { thema: id, i: 0, besucht: { 0: true } };
        api.thema = id; api.bereich = null;
        try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {}
        try { C6.schweig && C6.schweig(); } catch (e) {}
        kEl.hidden = false; kEl.classList.remove('c6w-ls-dunkel');
        buehne.classList.add('c6w-ls-mitkarte');
        try { C6.licht && C6.licht('lesesaal', 'tag'); } catch (e) {}
        requestAnimationFrame(function () { kEl.classList.add('c6w-an'); });
        if (!stationenVon(t).length) { kg.innerHTML = karteLeer(t); kCarlEl.style.visibility = 'hidden'; zeigeLeer(t); return; }
        kCarlEl.style.visibility = '';
        kThema = ''; kPos = null; zeichneKarte();
        // erst die ganze Karte, dann gleitet der Blick zu Carl, und der erste Ort erwacht
        cam = { x: 300, y: 360, z: 1 }; camSetzen();
        requestAnimationFrame(function () {
          setzeKCarl(0, false);
          if (C6.ruhig) { cam = { x: camZiel.x, y: camZiel.y, z: camZiel.z }; camSetzen(); }
          setTimeout(function () { if (jetzt.thema === id) { wegZeichnen(); erwacht(0); } }, C6.ruhig ? 0 : 520);
        });
        zeigeStation(0);
      }
      function karteLeer(t) {
        return '<rect x="-400" y="-400" width="1400" height="1500" fill="url(#c6w-ls-meer)"/>' +
          '<path d="M90 640 C 40 520, 80 380, 160 320 C 220 200, 360 140, 470 170 C 560 220, 560 360, 510 460 C 470 580, 300 660, 90 640 Z" fill="url(#c6w-ls-papier)" stroke="#6b5a40" stroke-width="2"/>' +
          '<text class="c6w-ls-kartentitel" x="40" y="60">' + esc(t.titel.replace(/­/g, '')) + '</text>' +
          '<text class="c6w-ls-leertext" x="300" y="410" text-anchor="middle">noch nicht gezeichnet</text>';
      }
      function zuSaal() {
        jetzt.thema = null; api.thema = null; api.bereich = null; gangBauen();
        try { C6.licht && C6.licht('lesesaal', 'nacht'); } catch (e) {}
        kEl.classList.remove('c6w-an');
        buehne.classList.remove('c6w-ls-mitkarte');
        setTimeout(function () { if (!kEl.classList.contains('c6w-an')) kEl.hidden = true; }, 360);
        try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {}
      }
      function geheZu(i) {
        if (i === jetzt.i) { zeigeStation(i); return; }
        var von = jetzt.i;
        jetzt.i = i; jetzt.besucht[i] = true;
        zeichneKarte();
        zeigeStation(i);
        if (C6.ruhig) { wegZeichnen(); setzeKCarl(i, true); erwacht(i); return; }
        wanderung(von, i).then(function () { if (jetzt.i === i) erwacht(i); });
      }

      // ——— Blatt einer Station ———
      function spaces() { try { return (C6.strings.alle() || []).filter(function (f) { return f.art !== 'gewohnheit'; }); } catch (e) { return []; } }
      function kopfHTML(t) {
        return '<div class="c6w-ls-bkopf"><button class="c6w-knopf c6w-leicht c6w-ls-alle">‹ Alle Bücher</button>' +
          '<span class="c6w-ls-bthema"><i style="background:' + t.farbe + '"></i>' + esc(t.titel.replace(/­/g, '')) + (entwurf(t) ? ' · Carls Entwurf, ungeprüft' : '') + '</span></div>';
      }
      function zeigeLeer(t) {
        blatt.innerHTML = kopfHTML(t) + '<h3 class="c6w-ls-name">' + esc(t.titel.replace(/­/g, '')) + '</h3>' +
          '<p class="c6w-satz">Diese Karte ist noch nicht gezeichnet. Sollen wir sie zusammen entwerfen?</p>' +
          '<p class="c6w-leise">Ich schlage dir Stationen vor. Das ist ein Entwurf aus meinem Wissen, ungeprüft, ohne Quellen.</p>' +
          '<button class="c6w-knopf c6w-haupt c6w-ls-entwurf">Karte entwerfen</button><p class="c6w-ls-antwort"></p>';
        blatt.querySelector('.c6w-ls-alle').onclick = zuSaal;
        blatt.querySelector('.c6w-ls-entwurf').onclick = function () {
          var k = this, ant = blatt.querySelector('.c6w-ls-antwort');
          k.disabled = true; k.textContent = 'Ich zeichne …';
          denk('Schlage acht Stationen für eine Wissenskarte zum Thema „' + t.titel.replace(/­/g, '') + '“ vor, in zeitlicher Reihenfolge. Genau acht Zeilen, jede so: Name | Zeit | ein bis drei bekannte Namen | eine kurze Frage an mich. Nur gut gesicherte Angaben, keine Zahlen, bei denen du unsicher bist. Keine weiteren Zeilen.').then(function (txt) {
            var st = String(txt || '').split(/\n+/).map(function (z) { return z.replace(/^[\s\d.\-–•*]+/, '').split('|').map(function (x) { return x.trim(); }); })
              .filter(function (x) { return x.length >= 3 && x[0]; }).slice(0, 8).map(function (x) { return { n: kurz(x[0], 30), z: kurz(x[1] || '', 30), w: kurz(x[2] || '', 50), f: kurz(x[3] || 'Was weißt du schon darüber?', 90) }; });
            if (st.length < 3) {
              k.disabled = false; k.textContent = 'Karte entwerfen';
              ant.textContent = 'Hier kann ich nicht mitdenken. Darum zeichne ich keine Stationen, die ich nicht belegen kann. Im echten Carl entwerfen wir sie zusammen.';
              return;
            }
            aendere(function (l) { l.karten = l.karten || {}; l.karten[t.id] = { stationen: st, ts: Date.now() }; });
            zeichne();
            oeffneThema(t.id);
          });
        };
      }
      function zeigeStation(i) {
        var t = thema(jetzt.thema), s = stationenVon(t)[i]; if (!s) return;
        var st = stationenVon(t);
        blatt.innerHTML = kopfHTML(t) +
          '<p class="c6w-ls-schritt">Station ' + (i + 1) + ' von ' + st.length + '</p>' +
          '<h3 class="c6w-ls-name">' + esc(s.n) + '</h3>' +
          '<p class="c6w-ls-fakt">' + esc(s.z) + (s.w ? ' · ' + esc(s.w) : '') + '</p>' +
          '<p class="c6w-ls-frage">' + esc(s.f) + '</p>' +
          '<div class="c6w-ls-tun"><button class="c6w-knopf c6w-ls-lies">Lies mit mir</button><button class="c6w-knopf c6w-ls-red">Was denkst du?</button></div>' +
          '<div class="c6w-ls-mehr"></div>' +
          '<div class="c6w-ls-weiter">' + (i > 0 ? '<button class="c6w-knopf c6w-leicht c6w-ls-zur">‹ ' + esc(kurz(st[i - 1].n, 18)) + '</button>' : '<span></span>') +
          (i < st.length - 1 ? '<button class="c6w-knopf c6w-ls-vor">Weiter: ' + esc(kurz(st[i + 1].n, 18)) + ' ›</button>' : '<button class="c6w-knopf c6w-leicht c6w-ls-alle2">Ende der Karte · Alle Bücher</button>') + '</div>';
        blatt.scrollTop = 0;
        blatt.querySelector('.c6w-ls-alle').onclick = zuSaal;
        var z = blatt.querySelector('.c6w-ls-zur'); if (z) z.onclick = function () { geheZu(i - 1); };
        var v = blatt.querySelector('.c6w-ls-vor'); if (v) v.onclick = function () { geheZu(i + 1); };
        var a2 = blatt.querySelector('.c6w-ls-alle2'); if (a2) a2.onclick = zuSaal;
        blatt.querySelector('.c6w-ls-lies').onclick = function () { lies(t, s); };
        blatt.querySelector('.c6w-ls-red').onclick = function () { rede(t, s); };
      }
      function denk(text) {
        var p;
        try { p = C6.denk ? C6.denk(text, { stumm: true, name: 'lesesaal' }) : Promise.resolve(''); } catch (e) { p = Promise.resolve(''); }
        return Promise.resolve(p).then(function (x) { return typeof x === 'string' ? x.trim() : ''; }, function () { return ''; });
      }
      function warte(el) { el.innerHTML = '<p class="c6w-satz c6w-lesend">Ich lese nach<span class="c6w-punkte" aria-hidden="true"><i></i><i></i><i></i></span></p>'; if (kCtl) try { kCtl.stimmung('denkt'); } catch (e) {} }
      function fertigCarl() { if (kCtl) try { kCtl.stimmung('froh'); } catch (e) {} }
      function lies(t, s) {
        var m = blatt.querySelector('.c6w-ls-mehr'); warte(m);
        denk('Erzähl mir in höchstens 120 Wörtern, worum es bei „' + s.n + '“ geht (' + t.titel.replace(/­/g, '') + ', ' + s.z + (s.w ? ', ' + s.w : '') + '). Einfach, wie einem neugierigen Freund, auf Deutsch. Keine Zitate, keine Buchtitel, keine Zahlen außer Jahrhunderten. Wo du unsicher bist, sag es. Am Ende eine Frage an mich.').then(function (txt) {
          if (!blatt.contains(m)) return;
          fertigCarl();
          if (txt.length > 30) {
            m.innerHTML = '<div class="c6w-ls-text">' + txt.split(/\n+/).map(function (z) { return '<p>' + esc(z) + '</p>'; }).join('') + '</div><p class="c6w-herkunft">Aus Carls Wissen, nicht nachgeschlagen. Ungeprüft, ohne Quellen.</p>' + notizHTML();
            verdrahteNotiz(t, s, txt, 'Carl (ungeprüft)');
          } else {
            m.innerHTML = '<p class="c6w-leise">Hier kann ich nicht nachlesen. Ich erfinde dir nichts. Lass uns mit Fragen anfangen:</p><ul class="c6w-ls-fragen"><li>' + esc(s.f) + '</li><li>Was weißt du schon über „' + esc(s.n) + '“?</li><li>Wo begegnet dir das heute?</li></ul>' + notizHTML();
            verdrahteNotiz(t, s, '', '');
          }
        });
      }
      function rede(t, s) {
        var m = blatt.querySelector('.c6w-ls-mehr');
        m.innerHTML = '<label class="c6w-lab" for="c6w-ls-ged">Dein Gedanke zu „' + esc(s.f) + '“</label><textarea id="c6w-ls-ged" class="c6w-feld" rows="3" maxlength="600" placeholder="Ein Satz reicht."></textarea>' +
          '<button class="c6w-knopf c6w-haupt c6w-ls-sag">Carl fragen</button><div class="c6w-ls-antw"></div>';
        var f = m.querySelector('textarea'); if (C6.geraet === 'computer') f.focus();
        m.querySelector('.c6w-ls-sag').onclick = function () {
          var ged = f.value.trim(); if (!ged) { f.focus(); return; }
          var an = m.querySelector('.c6w-ls-antw'); warte(an);
          aendere(function (l) { l.gedanken = (l.gedanken || []).concat([{ thema: t.id, station: s.n, t: ged, ts: Date.now() }]).slice(-60); });
          denk('Wir gehen zusammen durch „' + s.n + '“ (' + t.titel.replace(/­/g, '') + ', ' + s.z + '). Die Frage war: ' + s.f + '\nMein Gedanke: ' + ged + '\nAntworte mir als ehrlicher Freund in höchstens 90 Wörtern auf Deutsch: was du daran stark findest, wo du widersprechen würdest, und eine Frage zurück. Keine Zitate, keine Quellen erfinden.').then(function (txt) {
            if (!blatt.contains(an)) return;
            fertigCarl();
            if (txt.length > 20) {
              an.innerHTML = '<div class="c6w-ls-text">' + txt.split(/\n+/).map(function (z) { return '<p>' + esc(z) + '</p>'; }).join('') + '</div><p class="c6w-herkunft">Carls Antwort, ungeprüft.</p>' + notizHTML();
              verdrahteNotiz(t, s, 'Mein Gedanke: ' + ged + '\n\nCarl (ungeprüft): ' + txt, '');
            } else {
              an.innerHTML = '<p class="c6w-leise">Hier kann ich nicht mitdenken. Deinen Gedanken hab ich aufgeschrieben, er geht nicht verloren.</p>' + notizHTML();
              verdrahteNotiz(t, s, 'Mein Gedanke: ' + ged, '');
            }
          });
        };
      }
      // ——— Ein Faden durch alles: was hier gefunden wird, kann in einen Space ———
      function faedenFuerWahl() {
        var sp = S().spaces || {};
        return spaces().slice().sort(function (x, y) { return ((sp[y.id] || {}).besucht || y.erstellt || 0) - ((sp[x.id] || {}).besucht || x.erstellt || 0); }).slice(0, 3);
      }
      function aufFaden(titel, text, knopf, fertig) {
        var fs = faedenFuerWahl(), sp = S().spaces || {};
        var opts = fs.map(function (f) { return { text: kurz(f.titel, 28), wert: f.id, hinweis: (sp[f.id] && sp[f.id].kern) ? kurz(sp[f.id].kern, 48) : '' }; });
        if (!opts.length) opts = [{ text: 'Neuer Space', wert: '__neu', hinweis: kurz(titel, 40) }];
        if (knopf) knopf.disabled = true;
        Promise.resolve(C6.frag ? C6.frag('Auf welchen Faden?', opts, { frei: false, leise: true, id: 'c6w-ls-faden' }) : null).then(function (sid) {
          if (knopf) knopf.disabled = false;
          if (!sid) return;
          if (sid === '__neu') { try { sid = C6.space.neu(titel, { oeffnen: false }); } catch (e) { sid = null; } }
          var ok = null;
          try { ok = sid && C6.space && C6.space.legeHin ? C6.space.legeHin(sid, { art: 'karte', titel: kurz(titel, 60), text: text }) : null; } catch (e) { ok = null; }
          var f = sid && spaces().filter(function (x) { return x.id === sid; })[0];
          if (!ok || !f) { if (C6.sag) C6.sag('Das hat nicht geklappt. Es ist nichts verloren.'); return; }
          if (fertig) fertig(sid, f);
          if (knopf) { knopf.textContent = 'Liegt in „' + kurz(f.titel, 22) + '“'; knopf.classList.add('c6w-ls-gelegt'); }
          Promise.resolve(C6.frag('Liegt jetzt in „' + f.titel + '“.', [{ text: 'Hingehen', wert: 'hin' }], { frei: false, leise: true, id: 'c6w-ls-hin' })).then(function (w) { if (w === 'hin' && C6.space && C6.space.oeffne) C6.space.oeffne(sid); });
        });
      }
      function notizHTML() { return '<button class="c6w-knopf c6w-ls-leg">Auf einen Faden</button>'; }
      function verdrahteNotiz(t, s, text) {
        var k = blatt.querySelectorAll('.c6w-ls-leg'); k = k[k.length - 1]; if (!k) return;
        var body = s.n + ' (' + s.z + (s.w ? ', ' + s.w : '') + ')\nFrage: ' + s.f + (text ? '\n\n' + text : '');
        k.onclick = function () { aufFaden(s.n, body, k, function (sid) { aendere(function (l) { l.notizen = (l.notizen || []).concat([{ thema: t.id, station: s.n, t: body, sid: sid, ts: Date.now() }]).slice(-60); }); }); };
      }

      // ——— Vorbereitungs-Mappe ———
      var lexLauf = 0;
      function oeffneMappe(mid) {
        jetzt = { thema: '__mappe', i: 0, besucht: {} }; api.thema = null;
        try { C6.schweig && C6.schweig(); } catch (e) {}
        kEl.hidden = false; buehne.classList.add('c6w-ls-mitkarte');
        requestAnimationFrame(function () { kEl.classList.add('c6w-an'); });
        kg.innerHTML = offenesLexikon(); kCarlEl.style.visibility = 'hidden'; kEl.classList.add('c6w-ls-dunkel');
        var m = mid && mappen().filter(function (x) { return x.id === mid; })[0];
        if (m) zeigeMappe(m); else mappeForm();
      }
      function mappeKopf() {
        return '<div class="c6w-ls-bkopf"><button class="c6w-knopf c6w-leicht c6w-ls-alle">‹ Lesesaal</button><span class="c6w-ls-bthema"><i style="background:#1e2e52"></i>Das Lexikon</span></div>';
      }
      function mappeForm() {
        var fs = spaces(), sj = null;
        try { sj = C6.space && C6.space.jetzt && C6.space.jetzt(); } catch (e) { sj = null; }
        var wahl = (sj && fadenVon(sj)) ? sj : (fs[0] ? fs[0].id : '__neu');
        var alt = mappen().slice(-4).reverse();
        blatt.innerHTML = mappeKopf() + '<h3 class="c6w-ls-name">Worüber soll ich mich vorbereiten?</h3>' +
          '<p class="c6w-leise">Ich lese nach und lege dir eine Mappe in deinen Space. Was ich schreibe, ist ungeprüft, und ich nenne nur Quellen, die es wirklich gibt.</p>' +
          '<form class="c6w-lexform"><label class="c6w-lab" for="c6w-ls-thema">Thema</label><input id="c6w-ls-thema" class="c6w-feld c6w-hand" maxlength="80" placeholder="Zum Beispiel: Wie lernen Kinder lesen?">' +
          '<p class="c6w-lab">Für welchen Space</p><div class="c6w-arten c6w-ls-raeume" role="radiogroup" aria-label="Space">' +
          fs.slice(0, 8).map(function (f) { return '<button type="button" role="radio" data-s="' + f.id + '" aria-checked="' + (f.id === wahl) + '"><i style="background:' + f.farbe + '"></i>' + esc(kurz(f.titel, 26)) + '</button>'; }).join('') +
          '<button type="button" role="radio" data-s="__neu" aria-checked="' + (wahl === '__neu') + '">Neuer Space</button></div>' +
          '<button class="c6w-knopf c6w-haupt" type="submit">Vorbereiten</button></form>' +
          (alt.length ? '<p class="c6w-lab">Deine Mappen</p><ul class="c6w-mliste">' + alt.map(function (m) { var f = fadenVon(m.sid); return '<li><button data-mp="' + esc(m.id) + '"><i style="background:' + (f ? f.farbe : '#1e2e52') + '"></i><span><b>' + esc(m.thema) + '</b><small>' + esc(f ? f.titel : 'ohne Space') + '</small></span></button></li>'; }).join('') + '</ul>' : '');
        blatt.querySelector('.c6w-ls-alle').onclick = zuSaal;
        var kn = blatt.querySelectorAll('.c6w-ls-raeume [role=radio]');
        [].forEach.call(kn, function (b) { b.onclick = function () { wahl = b.dataset.s; [].forEach.call(kn, function (x) { x.setAttribute('aria-checked', x === b); }); }; });
        [].forEach.call(blatt.querySelectorAll('[data-mp]'), function (b) { b.onclick = function () { var m = mappen().filter(function (x) { return x.id === b.dataset.mp; })[0]; if (m) zeigeMappe(m); }; });
        blatt.querySelector('form').onsubmit = function (e) {
          e.preventDefault();
          var f = blatt.querySelector('#c6w-ls-thema'), th = f.value.trim();
          if (!th) { f.focus(); return; }
          vorbereiten(th, wahl);
        };
        if (C6.geraet === 'computer') setTimeout(function () { var f = blatt.querySelector('#c6w-ls-thema'); if (f) f.focus(); }, 300);
      }
      function zeigeMappe(m, fluester) {
        var f = fadenVon(m.sid);
        blatt.innerHTML = mappeKopf() + (fluester ? '<p class="c6w-flues c6w-flues-an">' + esc(fluester) + '</p>' : '') +
          '<h3 class="c6w-ls-name">' + esc(m.thema) + '</h3>' + (f ? '<p class="c6w-leise">Liegt in „' + esc(f.titel) + '“.</p>' : '') +
          mappeHTML(m) + (f && C6.space && C6.space.oeffne ? '<button class="c6w-knopf c6w-haupt c6w-zumspace">Im Space ansehen</button>' : '') +
          '<button class="c6w-knopf c6w-leicht c6w-ls-noch">Noch ein Thema</button>';
        blatt.scrollTop = 0;
        blatt.querySelector('.c6w-ls-alle').onclick = zuSaal;
        blatt.querySelector('.c6w-ls-noch').onclick = mappeForm;
        var z = blatt.querySelector('.c6w-zumspace'); if (z) z.onclick = function () { C6.space.oeffne(m.sid); };
      }
      function vorbereiten(th, wahl) {
        var sid = wahl, nr = ++lexLauf;
        if (sid === '__neu' || !fadenVon(sid)) { sid = null; try { sid = C6.space && C6.space.neu ? C6.space.neu(th, { oeffnen: false }) : null; } catch (e) { sid = null; } }
        var f = fadenVon(sid), raumT = f ? f.titel : '';
        blatt.innerHTML = mappeKopf() + '<p class="c6w-satz c6w-lesend">Ich lese nach<span class="c6w-punkte" aria-hidden="true"><i></i><i></i><i></i></span></p><p class="c6w-leise">„' + esc(th) + '“' + (raumT ? ' für „' + esc(raumT) + '“' : '') + '</p>';
        blatt.querySelector('.c6w-ls-alle').onclick = zuSaal;
        if (ctl && ctl.stimmung) try { ctl.stimmung('denkt'); } catch (e) {}
        denk(auftragText(th, raumT)).then(function (text) {
          var echt = text.length > 40;
          var m = { id: 'x' + Date.now().toString(36), thema: th, sid: sid || null, ts: Date.now(), art: echt ? 'denk' : 'fragen',
            text: echt ? text.slice(0, 3000) : gliederung(th, raumT),
            herkunft: echt ? 'Aus Carls Wissen, nicht nachgeschlagen. Ungeprüft, ohne Quellenangaben.' : 'Hier kann ich nicht nachlesen. Darum liegen nur Fragen und eine Gliederung in der Mappe, keine Antworten.' };
          if (C6.aendern) C6.aendern(function (st) { st.lexikon = (st.lexikon || []).concat([m]).slice(-20); });
          if (sid) {
            try { if (C6.space && C6.space.legeHin) C6.space.legeHin(sid, { art: 'ergebnis', titel: 'Mappe · ' + th, text: m.text + '\n\n' + m.herkunft, farbe: f ? f.farbe : null }); } catch (e) {}
            try {
              if (C6.auftrag && C6.auftrag.legeFund) {
                var kt = m.text.split(/\n+/).filter(function (z) { return z.trim() && !/^[-•*]/.test(z.trim()) && z.length > 40; })[0] || ('Mappe zu „' + th + '“: ' + (echt ? 'Überblick, Begriffe, offene Fragen.' : 'Fragen und Gliederung.'));
                C6.auftrag.legeFund(sid, { text: kt, titel: 'Mappe · ' + th, herkunft: 'carl', zu: th, hinlegen: false });
              }
            } catch (e) {}
          }
          if (ctl && ctl.stimmung) try { ctl.stimmung('froh'); } catch (e) {}
          if (nr !== lexLauf || jetzt.thema !== '__mappe') return;
          zeigeMappe(m, echt ? satz('bib.lexikonFertig', 'Fertig. Die Mappe liegt in deinem Space.') : satz('bib.lexikonFragen', 'Ich hab dir die Fragen hingelegt, mit denen wir anfangen.'));
        });
      }

      // ——— Die Regalgänge: an der Wand entlanggehen (seitlich wischen), einen Gang antippen ———
      var LEDER2 = ['#5c2f27', '#2e3b52', '#4a3a26', '#30473c', '#5b4630', '#3f3346', '#6a4a2a', '#283a35'];
      function ruecken(x, by, n, seed, farbe, fh, bis) {
        var o = '', bx = x;
        for (var k = 0; k < n; k++) {
          if (bis && bx > bis - 12) break;
          var bw = 11 + Math.round(zufall(seed + k * 3) * 8), bh = Math.round(fh * (0.6 + zufall(seed * 7 + k) * 0.36));
          var f = k % 3 === 1 && farbe ? farbe : LEDER2[Math.floor(zufall(seed + k * 11) * LEDER2.length)];
          o += '<rect x="' + bx + '" y="' + (by - bh) + '" width="' + bw + '" height="' + bh + '" rx="1.5" fill="' + f + '" stroke="#140d09" stroke-width="1"/>' +
            '<path d="M' + (bx + 2) + ' ' + (by - bh + 7) + ' H' + (bx + bw - 2) + ' M' + (bx + 2) + ' ' + (by - 7) + ' H' + (bx + bw - 2) + '" stroke="' + GOLD + '" stroke-width="1" opacity=".75"/>';
          bx += bw + 1;
        }
        return o;
      }
      // Ein Regal der Galerie: Bogen, drei Fächer, ein Lämpchen. Das Schild ist Text (lesbar auf jedem Gerät).
      var KURZ = { karten: 'Karten', natur: 'Natur', mathematik: 'Mathe', funde: 'Funde' };
      function regalSVG(b, i) {
        var W = 200, H = 260, fh = 54, o = '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" preserveAspectRatio="none">';
        o += '<path d="M6 ' + H + ' V54 Q100 0 194 54 V' + H + ' Z" fill="#3a2719" stroke="' + T + '" stroke-width="2.6"/>';
        o += '<path d="M18 ' + (H - 8) + ' V60 Q100 14 182 60 V' + (H - 8) + ' Z" fill="url(#c6w-ls-fach)"/>';
        o += '<g class="c6w-ls-rinnen">';
        for (var r = 0; r < 3; r++) {
          var by = 118 + r * (fh + 10);
          if (b.id === 'funde' && r === 0) {
            for (var z = 0; z < 5; z++) o += '<path d="M' + (32 + z * 30) + ' ' + by + ' l4 -40 h20 l-2 40z" fill="' + (z % 2 ? '#fff6dc' : '#f4ead2') + '" stroke="#6b5a40" stroke-width="1.1"/>';
          } else o += ruecken(22, by, 13, i * 17 + r * 5, b.farbe, fh, 178);
          o += '<rect x="12" y="' + by + '" width="176" height="8" fill="url(#c6w-ls-brett)" stroke="' + T + '" stroke-width="1"/>';
        }
        var n = Math.min(5, fundeIn(b.id).length);
        for (var z2 = 0; z2 < n; z2++) o += '<path d="M' + (44 + z2 * 24) + ' 118 l8 -2 3 18 -8 2z" fill="#fff6dc" stroke="#6b5a40" stroke-width="1"/>';
        o += '</g>';
        // zwei Türflügel aus Glas und Holz: sie öffnen sich, wenn du den Gang betrittst
        o += '<g class="c6w-ls-fluegel c6w-ls-fl-l"><path d="M18 ' + (H - 8) + ' V60 Q58 26 100 22 V' + (H - 8) + ' Z" fill="rgba(255,233,181,.07)" stroke="#5a3d29" stroke-width="3"/></g>';
        o += '<g class="c6w-ls-fluegel c6w-ls-fl-r"><path d="M182 ' + (H - 8) + ' V60 Q142 26 100 22 V' + (H - 8) + ' Z" fill="rgba(255,233,181,.07)" stroke="#5a3d29" stroke-width="3"/></g>';
        o += '<circle cx="100" cy="10" r="5" fill="#ffe9b5"/>';
        return o + '</svg>';
      }
      var gang;
      function gangBauen() {
        if (!gang) return;
        var zeile = gang.querySelector('.c6w-ls-gzeile');
        zeile.innerHTML = BEREICHE.map(function (b, i) {
          var n = fundeIn(b.id).length;
          return '<button type="button" class="c6w-ls-regal" data-bereich="' + b.id + '" aria-label="' + esc(b.name) + (n ? ', ' + n + ' eigene Funde' : '') + '"><span class="c6w-ls-licht" aria-hidden="true"></span>' + regalSVG(b, i) +
            '<span class="c6w-ls-plakette">' + esc(KURZ[b.id] || b.name) + '</span>' + (n ? '<span class="c6w-ls-zahl">' + n + '</span>' : '') + '</button>';
        }).join('') + '<button type="button" class="c6w-ls-regal c6w-ls-hinein" data-hinein="1" aria-label="Etwas hineinlegen: Link, YouTube, PDF oder Bild"><span class="c6w-ls-hplus" aria-hidden="true">+</span><span>Etwas hineinlegen</span></button>';
        gangSetzen();
      }
      // Alle Gänge auf einen Blick: am Computer zwei Reihen im flachen Halbkreis, am iPhone drei Reihen zu viert
      function gangSetzen() {
        if (!gang || !auf) return;
        var hoch = aufName === 'hoch', r = hoch ? { x: 10, y: 130, w: 580, h: 545 } : { x: 60, y: 84, w: 740, h: 518 };
        gang.style.left = (ox + r.x * skala) + 'px'; gang.style.top = (oy + r.y * skala) + 'px';
        gang.style.width = (r.w * skala) + 'px'; gang.style.height = (r.h * skala) + 'px';
        var kn = gang.querySelectorAll('.c6w-ls-regal'), N = kn.length, spalten = hoch ? 4 : 5, reihen = Math.ceil(N / spalten);
        var gap = 10 * skala, W = r.w * skala, Hh = r.h * skala;
        var bw = Math.min((W - gap * (spalten - 1)) / spalten, ((Hh - gap * (reihen - 1)) / reihen) * 200 / 260), bh = bw * 260 / 200;
        [].forEach.call(kn, function (el, k) {
          var zr = Math.floor(k / spalten), sp = k % spalten, inReihe = Math.min(spalten, N - zr * spalten);
          var breite = inReihe * bw + (inReihe - 1) * gap, x0 = (W - breite) / 2;
          var u = inReihe > 1 ? sp / (inReihe - 1) * 2 - 1 : 0, bogen = hoch ? 0 : u * u;
          var sk = 1 - 0.1 * bogen;
          el.style.width = bw + 'px'; el.style.height = bh + 'px';
          el.style.left = (x0 + sp * (bw + gap)) + 'px';
          el.style.top = (zr * (bh + gap) - bogen * 14 * skala + (Hh - reihen * bh - (reihen - 1) * gap)) + 'px';
          el.style.setProperty('--sk', sk.toFixed(3));
          el.style.zIndex = String(10 - Math.round(bogen * 5));
        });
      }
      // Ein Gang öffnet sich: das Regal tritt nach vorn, die Flügel gehen auf, dann stehst du davor
      var oeffnetSich = false;
      function gangOeffnen(el, id) {
        if (oeffnetSich) return;
        if (C6.ruhig || !el.animate) { oeffneBereich(id); return; }
        oeffnetSich = true;
        var r = el.getBoundingClientRect(), br = buehne.getBoundingClientRect();
        var zielH = br.height * 0.62, s = Math.min(3.2, zielH / r.height), dx = (br.left + br.width / 2) - (r.left + r.width / 2), dy = (br.top + br.height * 0.42) - (r.top + r.height / 2);
        gang.classList.add('c6w-ls-waehlt'); el.classList.add('c6w-ls-offen');
        var an = el.animate([{ transform: 'translate(0,0) scale(var(--sk,1))' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }], { duration: 640, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'forwards' });
        setTimeout(function () { oeffneBereich(id); }, 520);
        an.onfinish = function () { setTimeout(function () { try { an.cancel(); } catch (e) {} el.classList.remove('c6w-ls-offen'); gang.classList.remove('c6w-ls-waehlt'); oeffnetSich = false; }, 420); };
      }

      // ——— Ein Bereich: das Regal von nah, Bücher mit Carls Kommentar, eigene Funde ———
      var FUNDZ = { link: '🔗', youtube: '▶', pdf: 'PDF', bild: 'Bild', datei: 'Datei' };
      function regalNah(b) {
        var o = '<rect x="-400" y="-400" width="1400" height="1500" fill="#2a1d14"/>' +
          '<ellipse cx="300" cy="120" rx="360" ry="240" fill="url(#c6w-ls-buchglanz)" opacity=".55"/>' +
          '<rect x="30" y="70" width="540" height="640" fill="#3a2719" stroke="' + T + '" stroke-width="3"/><rect x="48" y="88" width="504" height="622" fill="url(#c6w-ls-fach)"/>' +
          '<path d="M210 30 h180 l8 18 -8 18 h-180 l-8 -18z" fill="#c9a24f" stroke="#5a3d17" stroke-width="2"/><text x="300" y="56" text-anchor="middle" class="c6w-ls-schild c6w-ls-schild-g">' + esc(b.name) + '</text>';
        var reihe = [], bx = 64, by = 270, fach = 0;
        function setze(w, h) { if (bx + w > 536) { fach++; bx = 64; by = 270 + fach * 200; } var p = [bx, by, w, h]; bx += w + 4; return p; }
        (b.buecher || []).forEach(function (bu, k) {
          var p = setze(46 + (k % 2) * 6, 170 - (k % 3) * 8);
          reihe.push('<g class="c6w-ding c6w-ls-rbuch" data-buch="' + k + '" tabindex="0" role="button" aria-label="' + esc(bu.t) + '"><rect x="' + p[0] + '" y="' + (p[1] - p[3]) + '" width="' + p[2] + '" height="' + p[3] + '" rx="3" fill="' + (k % 2 ? b.farbe : LEDER2[(k * 3) % 8]) + '" stroke="#140d09" stroke-width="1.4"/><path d="M' + (p[0] + 4) + ' ' + (p[1] - p[3] + 12) + ' h' + (p[2] - 8) + ' M' + (p[0] + 4) + ' ' + (p[1] - 12) + ' h' + (p[2] - 8) + '" stroke="' + GOLD + '" stroke-width="1.4"/><text class="c6w-ls-rtitel c6w-ls-rgold" transform="translate(' + (p[0] + p[2] / 2 + 5) + ' ' + (p[1] - 22) + ') rotate(-90)">' + esc(kurz(bu.a, 16)) + '</text></g>');
        });
        if (b.thema && thema(b.thema)) {
          var t = thema(b.thema), p = setze(120, 30);
          reihe.push('<g class="c6w-ding c6w-ls-rolle" data-karte="' + t.id + '" tabindex="0" role="button" aria-label="Karte des Wissens: ' + esc(b.name) + '"><ellipse cx="' + (p[0] + 60) + '" cy="' + (p[1] - 20) + '" rx="80" ry="40" fill="url(#c6w-ls-buchglanz)"/><path d="M' + p[0] + ' ' + p[1] + ' l10 -26 h100 l10 26z" fill="' + t.farbe + '" stroke="#140d09" stroke-width="1.4"/><path d="M' + (p[0] + 14) + ' ' + (p[1] - 24) + ' h92" stroke="' + GOLD + '" stroke-width="1.4"/><text class="c6w-ls-rtitel" x="' + (p[0] + 60) + '" y="' + (p[1] - 34) + '" text-anchor="middle">Karte</text></g>');
        }
        fundeIn(b.id).slice(-12).forEach(function (f, k) {
          var p = setze(40, 120 + (k % 3) * 12);
          reihe.push('<g class="c6w-ding c6w-ls-rfund" data-fund="' + esc(f.id) + '" tabindex="0" role="button" aria-label="' + esc(f.titel) + '"><rect x="' + p[0] + '" y="' + (p[1] - p[3]) + '" width="' + p[2] + '" height="' + p[3] + '" rx="2" fill="#f4ead2" stroke="#6b5a40" stroke-width="1.4"/><rect x="' + (p[0] + 6) + '" y="' + (p[1] - p[3] + 10) + '" width="' + (p[2] - 12) + '" height="16" fill="' + (f.art === 'youtube' ? '#d62a26' : '#8a3b14') + '"/><text class="c6w-ls-rtitel c6w-ls-rtinte" transform="translate(' + (p[0] + p[2] / 2 + 5) + ' ' + (p[1] - 10) + ') rotate(-90)">' + esc(kurz(f.titel, 14)) + '</text></g>');
        });
        // der Rest jedes Fachs: alte Bände ohne Namen, damit das Regal voll und bewohnt aussieht
        var fueller = '';
        for (var r2 = 0; r2 < 3; r2++) {
          var start = r2 < fach ? 536 : (r2 === fach ? bx + 10 : 64), yy = 270 + r2 * 200;
          if (start < 500) { var nn = Math.floor((536 - start) / 20); fueller += '<g opacity=".72" transform="translate(' + start + ' ' + yy + ') scale(1.6) translate(' + (-start) + ' ' + (-yy) + ')">' + ruecken(start, yy, Math.max(1, Math.floor(nn / 1.6)), r2 * 31 + b.id.length * 7, b.farbe, 100) + '</g>'; }
        }
        for (var r = 0; r < 3; r++) o += '<rect x="40" y="' + (270 + r * 200) + '" width="520" height="14" fill="url(#c6w-ls-brett)" stroke="' + T + '" stroke-width="1.4"/>';
        return o + fueller + reihe.join('');
      }
      function bereichKopf(b) {
        return '<div class="c6w-ls-bkopf"><button class="c6w-knopf c6w-leicht c6w-ls-alle">‹ Alle Gänge</button><span class="c6w-ls-bthema"><i style="background:' + b.farbe + '"></i>' + esc(b.name) + '</span></div>';
      }
      function fundHTML(f) {
        var d = f.datei || {}, u = f.url || (d.url || '');
        var bild = f.art === 'bild' && d.url ? '<img class="c6w-ls-fbild" src="' + esc(d.url) + '" alt="">' : '';
        return '<li class="c6w-ls-fund" data-f="' + esc(f.id) + '"><span class="c6w-ls-fart">' + (FUNDZ[f.art] || '') + '</span><div><b>' + esc(f.titel) + '</b>' +
          (f.notiz ? '<p class="c6w-ls-fnotiz">' + esc(f.notiz) + '</p>' : '') + bild +
          (f.satz ? '<p class="c6w-ls-carlk">' + esc(f.satz) + '</p>' : '') +
          '<p class="c6w-ls-fmeta">' + esc(C6.strings && C6.strings.datum ? C6.strings.datum(f.ts) : '') + (d.name ? ' · ' + esc(d.name) + ' · ' + esc(groesseText(d.groesse || 0)) + (d.url ? '' : ' · nur Name und Größe gemerkt') : '') + '</p>' +
          '<div class="c6w-ls-ftun">' + (u ? '<a class="c6w-knopf c6w-leicht" href="' + esc(u) + '" target="_blank" rel="noopener">Öffnen</a>' : '') + '<button class="c6w-knopf c6w-leicht c6w-ls-ffaden">Auf einen Faden</button>' +
          '<button class="c6w-knopf c6w-leicht c6w-ls-fweg">Weglegen</button></div></div></li>';
      }
      function oeffneBereich(id, fid) {
        var b = bereich(id); if (!b) return;
        jetzt = { thema: '__bereich', i: 0, besucht: {} }; api.thema = null; api.bereich = id;
        try { C6.schweig && C6.schweig(); } catch (e) {}
        try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {}
        kEl.hidden = false; buehne.classList.add('c6w-ls-mitkarte'); kEl.classList.add('c6w-ls-dunkel');
        requestAnimationFrame(function () { kEl.classList.add('c6w-an'); });
        kThema = ''; kg.removeAttribute('transform'); kg.innerHTML = regalNah(b); kCarlEl.style.visibility = 'hidden';
        kSvg.setAttribute('aria-label', 'Gang: ' + b.name);
        var fu = fundeIn(id);
        var h = bereichKopf(b) + '<h3 class="c6w-ls-name">' + esc(b.name) + '</h3><p class="c6w-ls-carlk c6w-ls-intro">' + esc(b.satz) + '</p>';
        if (b.thema && thema(b.thema) && stationenVon(thema(b.thema)).length) h += '<button class="c6w-knopf c6w-haupt c6w-ls-zurkarte" data-karte="' + b.thema + '">Mit Carl über die Karte gehen</button>';
        if (b.buecher) h += '<h4 class="c6w-ls-zw">Bücher in diesem Gang</h4><ul class="c6w-ls-buecher">' + b.buecher.map(function (bu, k) { return '<li data-b="' + k + '"><b>' + esc(bu.t) + '</b><span class="c6w-ls-fmeta">' + esc(bu.a) + ' · ' + esc(bu.z) + '</span><p class="c6w-ls-carlk">' + esc(bu.c) + '</p><button class="c6w-knopf c6w-leicht c6w-ls-bfaden" data-bf="' + k + '">Auf einen Faden</button></li>'; }).join('') + '</ul>';
        if (fu.length) h += '<h4 class="c6w-ls-zw">Deine Funde hier</h4><ul class="c6w-ls-funde">' + fu.slice().reverse().map(fundHTML).join('') + '</ul>';
        blatt.innerHTML = h; blatt.scrollTop = 0;
        blatt.querySelector('.c6w-ls-alle').onclick = zuSaal;
        [].forEach.call(blatt.querySelectorAll('[data-bf]'), function (x) { var bu = b.buecher[+x.dataset.bf]; x.onclick = function () { aufFaden(bu.t, bu.a + ', ' + bu.t + ' (' + bu.z + ')\n\nCarl: ' + bu.c, x); }; });
        [].forEach.call(blatt.querySelectorAll('.c6w-ls-ffaden'), function (x) {
          var fid2 = x.closest('[data-f]').dataset.f, f = funde().filter(function (q) { return q.id === fid2; })[0]; if (!f) return;
          x.onclick = function () { aufFaden(f.titel, [f.titel, f.url || (f.datei && f.datei.name) || '', f.notiz || ''].filter(Boolean).join('\n'), x, function (sid) { aendere(function (l) { (l.funde || []).forEach(function (q) { if (q.id === fid2) q.sid = sid; }); }); }); };
        });
        [].forEach.call(blatt.querySelectorAll('[data-karte]'), function (x) { x.onclick = function () { oeffneThema(x.dataset.karte); }; });
        [].forEach.call(blatt.querySelectorAll('.c6w-ls-fweg'), function (x) {
          x.onclick = function () {
            var li = x.closest('[data-f]'), fid2 = li.dataset.f;
            if (x.dataset.ja) { aendere(function (l) { l.funde = (l.funde || []).filter(function (q) { return q.id !== fid2; }); }); oeffneBereich(id); return; }
            x.dataset.ja = '1'; x.textContent = 'Ja, weglegen';
          };
        });
        if (fid) zeigeIm(blatt.querySelector('[data-f="' + fid + '"]'));
      }
      function zeigeIm(el) { if (!el) return; try { var r = el.getBoundingClientRect(), br = blatt.getBoundingClientRect(); blatt.scrollTo({ top: blatt.scrollTop + r.top - br.top - br.height / 3, behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) {} el.classList.remove('c6w-ls-blink'); void el.offsetWidth; el.classList.add('c6w-ls-blink'); }

      // ——— Einordnen: Carl liest Titel und Notiz und stellt es in den passenden Gang ———
      var assetsNs = null, assetsGefragt = false;
      function assetsHol() {
        if (assetsGefragt) return Promise.resolve(assetsNs);
        assetsGefragt = true;
        try { if (!window.claude || !window.claude.use) return Promise.resolve(null); } catch (e) { return Promise.resolve(null); }
        return Promise.race([Promise.resolve(window.claude.use('assets')), new Promise(function (r) { setTimeout(function () { r(null); }, 4000); })])
          .then(function (a) { assetsNs = a || null; return assetsNs; }, function () { return null; });
      }
      function oeffneEinordnen() {
        if (jetzt.thema !== '__bereich') { jetzt = { thema: '__bereich', i: 0, besucht: {} }; kEl.hidden = false; buehne.classList.add('c6w-ls-mitkarte'); kEl.classList.add('c6w-ls-dunkel'); requestAnimationFrame(function () { kEl.classList.add('c6w-an'); }); kThema = ''; kg.removeAttribute('transform'); kg.innerHTML = regalNah(bereich('funde')); kCarlEl.style.visibility = 'hidden'; }
        api.bereich = null;
        var art = 'link';
        blatt.innerHTML = '<div class="c6w-ls-bkopf"><button class="c6w-knopf c6w-leicht c6w-ls-alle">‹ Alle Gänge</button><span class="c6w-ls-bthema">Einordnen</span></div>' +
          '<h3 class="c6w-ls-name">Was bringst du mit?</h3><p class="c6w-ls-carlk c6w-ls-intro">Leg es mir hin. Ich lese Titel und deine Notiz und stell es in den passenden Gang.</p>' +
          '<div class="c6w-arten" role="radiogroup" aria-label="Art"><button type="button" role="radio" data-a="link" aria-checked="true">Link oder YouTube</button><button type="button" role="radio" data-a="datei" aria-checked="false">PDF oder Bild</button></div>' +
          '<form class="c6w-ls-eform"><div class="c6w-ls-elink"><label class="c6w-lab" for="c6w-ls-url">Adresse</label><input id="c6w-ls-url" class="c6w-feld" type="url" inputmode="url" placeholder="https://…" autocomplete="off"></div>' +
          '<div class="c6w-ls-edatei" hidden><label class="c6w-lab" for="c6w-ls-datei">Datei</label><input id="c6w-ls-datei" class="c6w-feld" type="file" accept="application/pdf,image/*"><p class="c6w-leise c6w-ls-ehrlich"></p></div>' +
          '<label class="c6w-lab" for="c6w-ls-titel">Titel (wenn du ihn weißt)</label><input id="c6w-ls-titel" class="c6w-feld" maxlength="120" autocomplete="off">' +
          '<label class="c6w-lab" for="c6w-ls-notiz">Deine Notiz: Worum geht es, warum hebst du es auf?</label><textarea id="c6w-ls-notiz" class="c6w-feld" rows="2" maxlength="400"></textarea>' +
          '<button class="c6w-knopf c6w-haupt" type="submit">Carl, ordne das ein</button></form><div class="c6w-ls-eerg" aria-live="polite"></div>';
        blatt.scrollTop = 0;
        blatt.querySelector('.c6w-ls-alle').onclick = zuSaal;
        var ehrlich = blatt.querySelector('.c6w-ls-ehrlich');
        assetsHol().then(function (a) { if (blatt.contains(ehrlich)) ehrlich.textContent = a ? 'Die Datei lege ich in die Ablage dieser Seite. Lesen kann ich sie nicht, nur Name und deine Notiz.' : 'Hier gibt es keine Ablage für Dateien. Ich merke mir nur Name, Art und Größe, die Datei selbst bleibt bei dir.'; });
        [].forEach.call(blatt.querySelectorAll('[data-a]'), function (x) {
          x.onclick = function () { art = x.dataset.a; [].forEach.call(blatt.querySelectorAll('[data-a]'), function (y) { y.setAttribute('aria-checked', y === x); }); blatt.querySelector('.c6w-ls-elink').hidden = art !== 'link'; blatt.querySelector('.c6w-ls-edatei').hidden = art !== 'datei'; };
        });
        blatt.querySelector('form').onsubmit = function (e) {
          e.preventDefault();
          var url = blatt.querySelector('#c6w-ls-url').value.trim(), file = (blatt.querySelector('#c6w-ls-datei').files || [])[0];
          var titel = blatt.querySelector('#c6w-ls-titel').value.trim(), notiz = blatt.querySelector('#c6w-ls-notiz').value.trim();
          var erg = blatt.querySelector('.c6w-ls-eerg');
          if (art === 'link' && !/^https?:\/\/\S+\.\S+/i.test(url)) { erg.innerHTML = '<p class="c6w-leise">Die Adresse beginnt mit https:// – dann kann ich sie hinlegen.</p>'; blatt.querySelector('#c6w-ls-url').focus(); return; }
          if (art === 'datei' && !file) { erg.innerHTML = '<p class="c6w-leise">Such mir erst eine Datei aus.</p>'; return; }
          var f = { id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ts: Date.now(), notiz: kurz(notiz, 400) };
          if (art === 'link') {
            var yt = ytId(url); f.art = yt ? 'youtube' : 'link'; f.url = url;
            var host = ''; try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (x) {}
            f.titel = kurz(titel || (yt ? 'Video auf YouTube' : host + ' · ' + kurz(url.replace(/^https?:\/\/[^/]+/, ''), 40)), 90);
          } else {
            f.art = /pdf/i.test(file.type) || /\.pdf$/i.test(file.name) ? 'pdf' : (/^image\//.test(file.type) ? 'bild' : 'datei');
            f.titel = kurz(titel || file.name.replace(/\.[a-z0-9]+$/i, ''), 90);
            f.datei = { name: kurz(file.name, 80), typ: file.type || '', groesse: file.size || 0 };
          }
          var knopf = blatt.querySelector('form [type=submit]'); knopf.disabled = true; knopf.textContent = 'Ich schau es mir an …';
          erg.innerHTML = '';
          var ablage = art === 'datei' ? assetsHol().then(function (a) {
            if (!a || !a.upload) return null;
            return Promise.resolve(a.upload(file)).then(function (r) { if (r && r.url) { f.datei.url = r.url; f.datei.id = r.id; } return r; }, function () { f.datei.fehler = true; return null; });
          }) : Promise.resolve(null);
          var namen = BEREICHE;
          var frage = 'Ordne diesen Fund genau einem Bereich einer Bibliothek zu. Bereiche: ' + namen.map(function (b) { return b.id + ' (' + b.name + ')'; }).join(', ') + '.\n' +
            'Fund: ' + ({ link: 'Link', youtube: 'YouTube-Video', pdf: 'PDF', bild: 'Bild', datei: 'Datei' })[f.art] + '\nTitel: ' + f.titel + (f.url ? '\nAdresse: ' + f.url : '') + (f.datei ? '\nDateiname: ' + f.datei.name : '') + (notiz ? '\nNotiz des Menschen: ' + notiz : '') +
            '\nDu kennst den Inhalt nicht, nur diese Angaben. Erfinde nichts über den Inhalt. Antworte in genau einer Zeile: bereich-id | ein Satz an den Menschen auf Deutsch, warum es dort hingehört, höchstens 20 Wörter, warm und kurz.';
          Promise.all([ablage, denk(frage)]).then(function (x) {
            var txt = x[1], z = String(txt || '').split('\n').filter(function (l) { return l.indexOf('|') > 0; })[0] || '', teile = z.split('|');
            var id = (teile[0] || '').replace(/[^a-z]/gi, '').toLowerCase();
            if (bereich(id) && teile[1] && teile[1].trim().length > 4) { f.bereich = id; f.satz = kurz(teile[1].trim(), 200); f.wie = 'denk'; }
            else {
              var s2 = nachStichwort(f.titel + ' ' + (f.url || '') + ' ' + notiz + ' ' + (f.datei ? f.datei.name : ''));
              f.wie = 'stichwort';
              if (s2) { f.bereich = s2.id; f.satz = 'Hier kann ich nicht mitdenken. Ich hab nach dem Stichwort „' + s2.wort + '“ sortiert, ohne hineinzuschauen.'; }
              else { f.bereich = 'funde'; f.satz = 'Hier kann ich nicht mitdenken, und ein Stichwort fand ich auch nicht. Es steht erst mal bei deinen Funden.'; }
            }
            aendere(function (l) { l.funde = (l.funde || []).concat([f]).slice(-200); });
            gangBauen();
            if (!blatt.contains(erg)) return;
            var b = bereich(f.bereich);
            kg.innerHTML = regalNah(b);
            var neuB = kg.querySelector('[data-fund="' + f.id + '"]'); if (neuB) neuB.classList.add('c6w-ls-neu');
            erg.innerHTML = '<div class="c6w-ls-eok"><p class="c6w-lab">Steht jetzt im Gang</p><h3 class="c6w-ls-name"><i style="background:' + b.farbe + '"></i>' + esc(b.name) + '</h3><p class="c6w-ls-carlk">' + esc(f.satz) + '</p>' +
              (f.datei && !f.datei.url ? '<p class="c6w-leise">' + (f.datei.fehler ? 'Die Ablage hat die Datei nicht genommen. ' : '') + 'Von der Datei merke ich mir nur Name, Art und Größe.</p>' : '') +
              '<button class="c6w-knopf c6w-haupt c6w-ls-hin">Hingehen</button><p class="c6w-lab">Oder lieber in einen anderen Gang:</p><div class="c6w-arten c6w-ls-umstellen">' +
              namen.filter(function (q) { return q.id !== f.bereich; }).map(function (q) { return '<button type="button" data-u="' + q.id + '">' + esc(q.name) + '</button>'; }).join('') + '</div></div>';
            erg.querySelector('.c6w-ls-hin').onclick = function () { oeffneBereich(f.bereich, f.id); };
            [].forEach.call(erg.querySelectorAll('[data-u]'), function (u) { u.onclick = function () { aendere(function (l) { (l.funde || []).forEach(function (q) { if (q.id === f.id) { q.bereich = u.dataset.u; q.satz = 'Du hast es hierher gestellt. Gut, du kennst es besser.'; } }); }); gangBauen(); oeffneBereich(u.dataset.u, f.id); }; });
            knopf.textContent = 'Noch etwas einordnen'; knopf.disabled = false;
            blatt.querySelector('form').onsubmit = function (ev) { ev.preventDefault(); oeffneEinordnen(); };
            zeigeIm(erg.firstChild);
          });
        };
      }

      // ——— Antippen ———
      svg.addEventListener('click', function (e) { if (!e.target.closest) return; var d = e.target.closest('.c6w-ls-buch'); if (d) { oeffneThema(d.dataset.thema); return; } if (e.target.closest('.c6w-ls-lex')) oeffneMappe(); });
      kSvg.addEventListener('click', function (e) { if (jetzt.thema === '__bereich') { var rb = e.target.closest && e.target.closest('[data-karte],[data-buch],[data-fund]'); if (!rb) return; if (rb.dataset.karte) oeffneThema(rb.dataset.karte); else zeigeIm(blatt.querySelector(rb.dataset.fund ? '[data-f="' + rb.dataset.fund + '"]' : '[data-b="' + rb.dataset.buch + '"]')); return; } if (jetzt.thema === '__mappe') return; var d = e.target.closest && e.target.closest('.c6w-ls-station'); if (d) geheZu(+d.dataset.i); });
      [svg, kSvg].forEach(function (el) {
        el.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          var d = e.target.closest && e.target.closest('[role=button]'); if (!d) return; e.preventDefault(); d.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && jetzt.thema && C6.jetzt === 'lesesaal') { e.stopPropagation(); e.preventDefault(); zuSaal(); }
      }, true);
      if (C6.bus) C6.bus.on('kleid', function () { [ctl, kCtl].forEach(function (c) { if (c && c.kleid && C6.laden && C6.laden.an) c.kleid(C6.laden.an()); }); });
      buehne.classList.add('c6m-still');
      var ro = window.ResizeObserver ? new ResizeObserver(function () { groesse(); }) : null;
      if (ro) ro.observe(buehne);

      api.zuSaal = zuSaal; api.bereich = null; api.oeffneBereich = oeffneBereich; api.einordnen = oeffneEinordnen;
      return {
        betreten: function (o) {
          o = o || {};
          buehne.classList.remove('c6m-still');
          groesse(); carlMalen(); gangBauen();
          if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'lesesaal');
          groesse();
          if (o.thema && thema(o.thema)) setTimeout(function () { oeffneThema(o.thema); }, 200);
          else if (o.bereich && bereich(o.bereich)) setTimeout(function () { oeffneBereich(o.bereich); }, 200);
          else if (o.einordnen) setTimeout(oeffneEinordnen, 200);
          else if (o.vorbereiten || o.mappe) setTimeout(function () { oeffneMappe(o.mappe || null); }, 200);
          else if (!o.still && !L().gesehen) {
            aendere(function (l) { l.gesehen = Date.now(); });
            setTimeout(function () { if (C6.jetzt === 'lesesaal' && !jetzt.thema && C6.sag) C6.sag(satz('lesesaal.erst', 'Hier wohnt, was Menschen herausgefunden haben. Geh die Gänge entlang. Oder leg mir etwas hinein, ich stell es an seinen Platz.')); }, 700);
          }
        },
        verlassen: function () { if (jetzt.thema) zuSaal(); buehne.classList.add('c6m-still'); },
        groesse: groesse
      };
    }
  });
  var api = C6.lesesaal = { bereiche: function () { return BEREICHE.map(function (b) { return { id: b.id, name: b.name }; }); }, themen: function () { return THEMEN.map(function (t) { return { id: t.id, titel: t.titel.replace(/­/g, ''), karte: !!stationenVon(t).length }; }); }, thema: null };
})();
