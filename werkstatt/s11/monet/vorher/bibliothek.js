// Bibliothek: Über mich, Damals, Begleiter und das Meister-Regal
(function () {
  var C6 = window.C6;
  if (!C6 || !C6.raum) return;
  var esc = function (t) { return C6.strings.esc(t); };
  var T = '#2b2722', GOLD = '#e6c987', TAG = 86400000, MAX_MEISTER = 10;

  function satz(k, ersatz, w) { try { return (C6.stimme && C6.stimme.sag(k, w)) || ersatz; } catch (e) { return ersatz; } }
  function S() { return C6.S || (C6.S = {}); }
  function du() { return S().du || {}; }
  function meister() { return (S().meister || []).slice(); }
  function aendere(fn) {
    if (C6.aendern) C6.aendern(fn); else fn(S());
  }
  function setzeDu(fn) { aendere(function (s) { s.du = s.du || {}; fn(s.du); }); }
  function setzeMeister(fn) { aendere(function (s) { s.meister = (s.meister || []).slice(); fn(s.meister); }); }
  function kopie(x) { return JSON.parse(JSON.stringify(x == null ? null : x)); }

  // ——— Bücher über dich (Leder, Goldprägung) ———
  var BUECHER = [
    { id: 'du', titel: 'Wer du bist', farbe: '#2c3d5c', fach: 0 },
    { id: 'baut', titel: 'Woran du baust', farbe: '#7a3a2c', fach: 0 },
    { id: 'ton', titel: 'Dein Ton', farbe: '#4f3550', fach: 0 },
    { id: 'tun', titel: 'Was ich tun soll', farbe: '#2f5244', fach: 0 },
    { id: 'nie', titel: 'Was ich nie tun soll', farbe: '#3d3f45', fach: 1 },
    { id: 'damals', titel: 'Damals', farbe: '#7b5a2e', fach: 1 },
    { id: 'begleiter', titel: 'Begleiter', farbe: '#44582f', fach: 1 }
  ];
  var TOENE = ['Leise', 'Direkt', 'Verspielt', 'Genau'];
  var LEDER = ['#5c2f27', '#2e3b52', '#4a3a26', '#30473c', '#5b4630', '#3f3346', '#6a4a2a', '#283a35', '#58302e', '#3b3b3f'];

  // Regale nach Carlyle, erneuert
  var REGALE = [
    { id: 'ursprung', name: 'Ursprung', farbe: '#5c2f27' },
    { id: 'vision', name: 'Visionär:in', farbe: '#2e3b52' },
    { id: 'dichtung', name: 'Dichter:in', farbe: '#4f3550' },
    { id: 'lehre', name: 'Lehrer:in', farbe: '#30473c' },
    { id: 'schrift', name: 'Schreibende', farbe: '#6a4a2a' },
    { id: 'macher', name: 'Macher:in', farbe: '#3b3b3f' }
  ];
  function regalVon(id) { return REGALE.filter(function (r) { return r.id === id; })[0] || REGALE[3]; }

  // Grundbestand: gemeinfreie Bücher über Meister. Zitate nur, wo sie belegt sind.
  var GRUND = [
    { id: 'carlyle', kurz: 'CARLYLE', titel: 'On Heroes', autor: 'Thomas Carlyle', regal: 'schrift', farbe: '#5c2f27', laenge: 186,
      was: 'Sechs Vorträge über Helden, gehalten 1840 in London.',
      zitate: [
        { t: 'Odin’s Runes were the first form of the work of a Hero; Books, written words, are still miraculous Runes, the latest form!', q: 'Thomas Carlyle, On Heroes (1840), Vortrag V. Longmans 1906, S. 154' },
        { t: 'King is Kön-ning, Kan-ning, Man that knows or cans', q: 'Thomas Carlyle, On Heroes (1840). Longmans 1906, S. 12' }
      ] },
    { id: 'emerson', kurz: 'EMERSON', titel: 'Representative Men', autor: 'Ralph Waldo Emerson', regal: 'schrift', farbe: '#2e3b52', laenge: 164,
      was: 'Sechs Lebensbilder großer Menschen, 1850.' },
    { id: 'aurel', kurz: 'MARC AUREL', titel: 'Selbstbetrachtungen', autor: 'Marc Aurel', regal: 'lehre', farbe: '#30473c', laenge: 176,
      was: 'Notizen eines Kaisers an sich selbst.' },
    { id: 'plutarch', kurz: 'PLUTARCH', titel: 'Parallelbiografien', autor: 'Plutarch', regal: 'schrift', farbe: '#6a4a2a', laenge: 194,
      was: 'Lebensbeschreibungen, je ein Grieche neben einem Römer.' },
    { id: 'vasari', kurz: 'VASARI', titel: 'Künstlerviten', autor: 'Giorgio Vasari', regal: 'schrift', farbe: '#4f3550', laenge: 158,
      was: 'Lebensbeschreibungen der Maler, Bildhauer und Architekten, 1550.' },
    { id: 'leonardo', kurz: 'LEONARDO', titel: 'Notizbücher', autor: 'Leonardo da Vinci', regal: 'vision', farbe: '#3b3b3f', laenge: 170,
      was: 'Aus seinen Notizbüchern, herausgegeben von Jean Paul Richter, 1883.' }
  ];

  var SYMBOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 4h4v16H4zM9 6h4v14H9z"/><path d="M14 7l3.6-1 3 13.4-3.6 1z"/><path d="M3 20h18"/></svg>';

  // ——— „Damals“: ein früherer eigener Satz, der zu heute passt ———
  function woerter(t) { return String(t || '').toLowerCase().split(/[^a-zäöüß0-9]+/).filter(function (w) { return w.length > 3; }); }
  function damals() {
    var s = S(), jetzt = Date.now(), alt = [], heute = [];
    (s.gespraech || []).forEach(function (z) {
      if (z.von !== 'du' || !z.t || z.t.length < 6 || z.chip) return;
      if (z.ts < jetzt - TAG) alt.push({ t: z.t, ts: z.ts }); else heute = heute.concat(woerter(z.t));
    });
    C6.strings.alle().forEach(function (st) {
      heute = heute.concat(woerter(st.titel));
      (st.perlen || []).forEach(function (p) { if (p.ts < jetzt - TAG) alt.push({ t: p.t, ts: p.ts, faden: st.titel }); else heute = heute.concat(woerter(p.t)); });
    });
    if (!alt.length) return null;
    var best = null, bs = -1;
    alt.forEach(function (a, i) {
      var w = woerter(a.t), sc = 0;
      w.forEach(function (x) { if (heute.indexOf(x) >= 0) sc += 2; });
      sc += ((i * 7 + new Date().getDate()) % 5) * 0.1;
      if (sc > bs) { bs = sc; best = a; }
    });
    best.passt = bs >= 2;
    return best;
  }

  function markdown() {
    var d = du(), z = ['# Über mich', ''];
    z.push('## Wer du bist'); z.push((d.name ? 'Name: ' + d.name : 'Name: –')); if (d.carlName) z.push('Du nennst mich: ' + d.carlName); if (d.arbeit) z.push('Was du machst: ' + d.arbeit); z.push('');
    z.push('## Woran du baust'); z.push(d.baut || '–'); z.push('');
    z.push('## Was ich tun soll'); (d.tun && d.tun.length ? d.tun : ['–']).forEach(function (x) { z.push('- ' + x); }); z.push('');
    z.push('## Was ich nie tun soll'); (d.nie && d.nie.length ? d.nie : ['–']).forEach(function (x) { z.push('- ' + x); }); z.push('');
    z.push('## Dein Ton'); z.push(d.ton || '–'); z.push('');
    var g = C6.strings.gewohnheiten();
    z.push('## Begleiter'); (g.length ? g : [{ titel: '–' }]).forEach(function (s) { z.push('- ' + s.titel); }); z.push('');
    var f = C6.strings.alle().filter(function (s) { return s.art !== 'gewohnheit'; });
    if (f.length) { z.push('## Deine Fäden'); f.forEach(function (s) { z.push('- ' + s.titel + (s.art === 'idee' ? ' (Idee)' : '')); }); z.push(''); }
    var m = meister();
    if (m.length) {
      z.push('## Meister');
      m.forEach(function (x) {
        z.push('- ' + x.name + ' (' + regalVon(x.regal).name + ')');
        if (x.zieht) z.push('  Was mich anzieht: ' + x.zieht);
        if (x.haltung) z.push('  Haltung: ' + x.haltung);
        if (x.zitat) z.push('  ' + (x.quelle ? '„' + x.zitat + '“ (' + x.quelle + ')' : 'Sinngemäß: ' + x.zitat));
        if (x.du) z.push('  Schon in mir: ' + x.du);
      });
    }
    return z.join('\n');
  }

  // Zeilen umbrechen (für Text im Bild)
  function umbruch(t, max, zeilen) {
    var w = String(t || '').split(/\s+/).filter(Boolean), z = [], cur = '';
    w.forEach(function (x) { if (cur && (cur + ' ' + x).length > max) { z.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x; });
    if (cur) z.push(cur);
    if (zeilen && z.length > zeilen) { z = z.slice(0, zeilen); z[zeilen - 1] = z[zeilen - 1].replace(/[\s,.;:]*$/, '') + ' …'; }
    return z;
  }
  function zufall(n) { var x = Math.sin(n * 91.7 + 13.1) * 43758.5; return x - Math.floor(x); }

  // Das eine Licht der Bibliothek: der Schirm der Schreibtischlampe (Szenen-Koordinaten, wird in stelle() gesetzt)
  var LICHT = { x: 1136, y: 352 };
  // Kontaktschatten eines Dings, das bei (cx, b) auf etwas steht: Ellipse, versetzt und gestreckt vom Licht weg
  function kschatten(cx, b, rx, h, a) {
    var dx = cx - LICHT.x, dy = b - LICHT.y, l = Math.hypot(dx, dy) || 1, len = Math.min(h * 0.34, 10 + h * 0.18);
    var ox = dx / l * len, oy = Math.max(1, dy / l * len * 0.3), sx = 1 + Math.min(0.45, Math.abs(dx / l) * 0.4);
    return '<ellipse cx="' + (cx + ox).toFixed(1) + '" cy="' + (b + oy).toFixed(1) + '" rx="' + (rx * sx).toFixed(1) + '" ry="' + Math.max(2.5, rx * 0.22).toFixed(1) + '" fill="#140d09" style="opacity:calc(var(--c6-schatten-a,.2) * ' + (a || 1) + ')" pointer-events="none"/>';
  }


  // ——— Lexikon: Carl bereitet sich auf ein Thema vor ———
  function mappen() { return (S().lexikon || []).slice(); }
  function spaces() {
    try { return (C6.strings.alle() || []).filter(function (f) { return f.art !== 'gewohnheit'; }); } catch (e) { return []; }
  }
  function fadenVon(sid) { return spaces().filter(function (f) { return f.id === sid; })[0] || null; }
  function gliederung(thema, raum) {
    if (raum && raum.trim().toLowerCase() === thema.trim().toLowerCase()) raum = '';
    return [
      'Worum es geht',
      '- Was ist „' + thema + '“ in einem Satz, in deinen Worten?',
      '- Woher kommt es, und seit wann gibt es das?',
      'Was wir klären sollten',
      '- Wer hat das Thema geprägt, und wer arbeitet heute daran?',
      '- Wo sind sich Leute uneinig?',
      '- Welche zwei, drei Begriffe muss man kennen?',
      'Für dich',
      raum ? '- Was davon braucht „' + raum + '“ zuerst?' : '- Wofür brauchst du es, und bis wann?',
      '- Was weißt du schon, und was wäre eine Überraschung?'
    ].join('\n');
  }
  function auftragText(thema, raum) {
    return 'Bereite dich für mich auf ein Thema vor: „' + thema + '“' + (raum ? ', für mein Vorhaben „' + raum + '“' : '') + '.\n' +
      'Schreib eine kurze Mappe auf Deutsch, höchstens 230 Wörter, genau mit diesen vier Überschriften, jede auf eigener Zeile:\n' +
      'Worum es geht\nGrundbegriffe\nOffene Fragen\nWo man nachschlägt\n' +
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
      if (z.length < 40 && !/[.?!]$/.test(z)) h += '<h4>' + esc(z.replace(/:$/, '')) + '</h4>';
      else h += '<p>' + esc(z) + '</p>';
    });
    if (liste) h += '</ul>';
    return '<div class="c6w-mappe">' + h + '</div><p class="c6w-herkunft">' + esc(m.herkunft) + '</p>';
  }

  // ——— Zeichnen: Teile der Szene als SVG-Strings ———
  var DEFS = '<defs>' +
    '<linearGradient id="c6w-wand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7dbc3"/><stop offset=".55" stop-color="#dccaa9"/><stop offset="1" stop-color="#cfb991"/></linearGradient>' +
    '<linearGradient id="c6w-holz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4e3424"/><stop offset=".5" stop-color="#5d3f2b"/><stop offset="1" stop-color="#4a3122"/></linearGradient>' +
    '<linearGradient id="c6w-fach" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f150f"/><stop offset=".35" stop-color="#2d1f16"/><stop offset="1" stop-color="#3a281c"/></linearGradient>' +
    '<linearGradient id="c6w-brett" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5638"/><stop offset="1" stop-color="#5a3d29"/></linearGradient>' +
    '<linearGradient id="c6w-boden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4b33"/><stop offset="1" stop-color="#4f3624"/></linearGradient>' +
    '<linearGradient id="c6w-fenster" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27335a"/><stop offset=".55" stop-color="#6a5a7a"/><stop offset="1" stop-color="#e2a46e"/></linearGradient>' +
    '<linearGradient id="c6w-seiteL" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#d9ccb2"/><stop offset=".12" stop-color="#f3ead8"/><stop offset="1" stop-color="#fbf5e8"/></linearGradient>' +
    '<linearGradient id="c6w-seiteR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9ccb2"/><stop offset=".12" stop-color="#f3ead8"/><stop offset="1" stop-color="#fbf5e8"/></linearGradient>' +
    '<radialGradient id="c6w-schein" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".55"/><stop offset=".5" stop-color="#ffd590" stop-opacity=".22"/><stop offset="1" stop-color="#ffd590" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6w-rahmen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6c987"/><stop offset=".5" stop-color="#b48b45"/><stop offset="1" stop-color="#8a6524"/></linearGradient>' +
    '<linearGradient id="c6w-bildlicht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9b5" stop-opacity=".22"/><stop offset=".5" stop-color="#ffe9b5" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".12"/></linearGradient>' +
    '<linearGradient id="c6w-tuerlicht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd98a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="c6w-lampenschein" cx=".5" cy=".3" r=".5"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="c6w-glanz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff0c8" stop-opacity=".35"/><stop offset="1" stop-color="#fff0c8" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="c6w-aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".95"/><stop offset=".5" stop-color="#ffd78c" stop-opacity=".36"/><stop offset="1" stop-color="#ffd78c" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6w-nacht" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d4373"/><stop offset=".55" stop-color="#1e2e52"/><stop offset="1" stop-color="#16223d"/></linearGradient>' +
    '<linearGradient id="c6w-goldschnitt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d78e"/><stop offset=".5" stop-color="#c9a24f"/><stop offset="1" stop-color="#e8c87a"/></linearGradient>' +
    '<linearGradient id="c6w-zauber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d8"/><stop offset=".5" stop-color="#ffd98a"/><stop offset="1" stop-color="#c98a3a"/></linearGradient>' +
    '<radialGradient id="c6w-aura-rose" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd9c8" stop-opacity=".9"/><stop offset=".5" stop-color="#ffc7b0" stop-opacity=".32"/><stop offset="1" stop-color="#ffc7b0" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6w-messing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c27c"/><stop offset="1" stop-color="#b48b45"/></linearGradient>' +
    '</defs>';

  function goldBaender(x, w, oben, unten) {
    return '<path d="M' + (x + 4) + ' ' + (oben + 10) + ' H' + (x + w - 4) + ' M' + (x + 4) + ' ' + (oben + 15) + ' H' + (x + w - 4) +
      ' M' + (x + 4) + ' ' + (unten - 10) + ' H' + (x + w - 4) + ' M' + (x + 4) + ' ' + (unten - 15) + ' H' + (x + w - 4) + '" stroke="' + GOLD + '" stroke-width="1.6" opacity=".9"/>';
  }
  function leder(x, w, h, farbe) {
    return '<rect x="' + x + '" y="' + (-h) + '" width="' + w + '" height="' + h + '" rx="3" fill="' + farbe + '" stroke="#140d09" stroke-width="1.6"/>' +
      '<rect x="' + (x + 2.5) + '" y="' + (-h + 2) + '" width="' + Math.max(3, w * 0.26) + '" height="' + (h - 4) + '" rx="2" fill="#fff" opacity=".09"/>' +
      '<rect x="' + (x + w * 0.74) + '" y="' + (-h + 2) + '" width="' + (w * 0.24) + '" height="' + (h - 4) + '" rx="2" fill="#000" opacity=".18"/>';
  }
  // Füllbücher ohne Titel
  function fueller(x0, n, seed, hmax) {
    var h = '', x = x0;
    for (var i = 0; i < n; i++) {
      var r = zufall(seed + i * 3.1), b = 15 + Math.round(r * 10), hh = Math.round(hmax * (0.66 + zufall(seed + i * 7.7) * 0.3));
      var f = LEDER[Math.floor(zufall(seed * 2 + i) * LEDER.length)];
      h += '<g transform="translate(0,0)">' + leder(x, b, hh, f) + goldBaender(x, b, -hh, 0) + '</g>';
      x += b + 1.5;
    }
    return { svg: h, breite: x - x0 };
  }
  function fuellerBreite(n, seed) { var w = 0; for (var i = 0; i < n; i++) w += 15 + Math.round(zufall(seed + i * 3.1) * 10) + 1.5; return w; }



  // Das Lexikon: ein einziges Buch ohne Schrift, das von innen leuchtet
  var LEX_W = 156;
  function lexikon(x, boden, H) {
    var cw = 100, sp = 14, d = 9, cx = x + sp + cw / 2, cy = boden - H / 2, r = Math.min(30, cw * 0.3);
    var stern = '';
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4, l = i % 2 ? r * 0.62 : r * 0.95;
      stern += 'M' + cx + ' ' + cy + ' L' + (cx + Math.cos(a - 0.16) * r * 0.32) + ' ' + (cy + Math.sin(a - 0.16) * r * 0.32) + ' L' + (cx + Math.cos(a) * l) + ' ' + (cy + Math.sin(a) * l) + ' L' + (cx + Math.cos(a + 0.16) * r * 0.32) + ' ' + (cy + Math.sin(a + 0.16) * r * 0.32) + ' Z ';
    }
    var punkte = '';
    for (var k = 0; k < 12; k++) { var b = k * Math.PI / 6 + 0.26; punkte += '<circle cx="' + (cx + Math.cos(b) * (r + 9)) + '" cy="' + (cy + Math.sin(b) * (r + 9)) + '" r="' + (k % 3 ? 1.3 : 2.2) + '"/>'; }
    var x0 = x + sp, x1 = x0 + cw, y0 = boden - H;
    var ecke = function (ex, ey, sx, sy) { return '<path d="M' + ex + ' ' + (ey + sy * 16) + ' Q' + ex + ' ' + ey + ' ' + (ex + sx * 16) + ' ' + ey + ' M' + (ex + sx * 5) + ' ' + (ey + sy * 11) + ' q' + (sx * 3) + ' ' + (-sy * 3) + ' ' + (sx * 6) + ' ' + (-sy * 6) + '" fill="none" stroke="url(#c6w-messing)" stroke-width="1.8" stroke-linecap="round"/>'; };
    return '<g class="c6w-ding c6w-lexikon' + (((C6.S || {}).lesesaal || {}).tuerAuf ? '' : ' c6w-lex-schimmer') + '" data-id="lexikon" tabindex="0" role="button" aria-label="Das blaue Lexikon. Zieh daran">' +
      '<ellipse class="c6w-aura" cx="' + cx + '" cy="' + (cy + 6) + '" rx="' + (cw * 0.95) + '" ry="' + (H * 0.62) + '" fill="url(#c6w-aura)"/>' +
      '<rect x="' + (x - 4) + '" y="' + (y0 - 16) + '" width="' + (cw + sp + d + 12) + '" height="' + (H + 18) + '" fill="transparent"/>' +
      '<g class="c6w-ding-innen">' +
      // Schnitt oben und rechts (vergoldet)
      '<path d="M' + x0 + ' ' + y0 + ' L' + (x0 + d) + ' ' + (y0 - d) + ' L' + (x1 + d) + ' ' + (y0 - d) + ' L' + x1 + ' ' + y0 + ' Z" fill="#f1e2bd" stroke="#140d09" stroke-width="1.2"/>' +
      '<path d="M' + x1 + ' ' + y0 + ' L' + (x1 + d) + ' ' + (y0 - d) + ' L' + (x1 + d) + ' ' + (boden - d) + ' L' + x1 + ' ' + boden + ' Z" fill="url(#c6w-goldschnitt)" stroke="#140d09" stroke-width="1.2"/>' +
      // Rücken
      '<rect x="' + x + '" y="' + y0 + '" width="' + sp + '" height="' + H + '" fill="#121c33" stroke="#140d09" stroke-width="1.4"/>' +
      '<path d="M' + (x + 2) + ' ' + (y0 + 22) + ' H' + (x + sp - 2) + ' M' + (x + 2) + ' ' + (y0 + H * 0.38) + ' H' + (x + sp - 2) + ' M' + (x + 2) + ' ' + (y0 + H * 0.62) + ' H' + (x + sp - 2) + ' M' + (x + 2) + ' ' + (boden - 22) + ' H' + (x + sp - 2) + '" stroke="' + GOLD + '" stroke-width="2"/>' +
      // Deckel
      '<rect x="' + x0 + '" y="' + y0 + '" width="' + cw + '" height="' + H + '" rx="2" fill="url(#c6w-nacht)" stroke="#140d09" stroke-width="1.6"/>' +
      '<rect x="' + (x0 + 7) + '" y="' + (y0 + 7) + '" width="' + (cw - 14) + '" height="' + (H - 14) + '" fill="none" stroke="url(#c6w-messing)" stroke-width="1.6"/>' +
      '<rect x="' + (x0 + 11) + '" y="' + (y0 + 11) + '" width="' + (cw - 22) + '" height="' + (H - 22) + '" fill="none" stroke="' + GOLD + '" stroke-width=".8" opacity=".7"/>' +
      ecke(x0 + 11, y0 + 11, 1, 1) + ecke(x1 - 11, y0 + 11, -1, 1) + ecke(x0 + 11, boden - 11, 1, -1) + ecke(x1 - 11, boden - 11, -1, -1) +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 3) + '" fill="none" stroke="url(#c6w-messing)" stroke-width="1.6"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 15) + '" fill="none" stroke="' + GOLD + '" stroke-width=".8" opacity=".6"/>' +
      '<g fill="' + GOLD + '">' + punkte + '</g>' +
      '<path d="' + stern + '" fill="url(#c6w-messing)" stroke="#8a6a2e" stroke-width=".6"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="3.2" fill="#fff3cf"/>' +
      '<rect x="' + (x0 + 2) + '" y="' + (y0 + 2) + '" width="' + (cw * 0.3) + '" height="' + (H - 4) + '" fill="#fff" opacity=".07"/>' +
      // Lesebändchen
      '<path d="M' + (cx + 22) + ' ' + (boden - 2) + ' v24 l5 -6 5 6 v-24 Z" fill="#a3332a" stroke="#140d09" stroke-width="1"/>' +
      '</g></g>';
  }


  // Unser Freundschaftsbuch: Leinen, Titel von Hand (das Buch selbst baut jung)
  var ATLAS_W = 70;
  // Die versteckte Tür: ein schmales Regalteil, dahinter ein Gang in Schwarzweiß, nur der Faden ist rot

  // ——— Über mich: Kapitel, die im Freundschaftsbuch wohnen (C6.bibliothek.du) ———
  var KAPITEL = [
    { id: 'du', titel: 'Wer du bist' }, { id: 'baut', titel: 'Woran du baust' }, { id: 'tun', titel: 'Was ich tun soll' },
    { id: 'nie', titel: 'Was ich nie tun soll' }, { id: 'ton', titel: 'Dein Ton' }, { id: 'damals', titel: 'Damals' }, { id: 'begleiter', titel: 'Begleiter' }
  ];
  // male(id, el, {zurueck:bool, geaendert:fn}) zeichnet ein Kapitel in el; mit eigenem Rückgängig (ein Schritt)
  function maleKapitel(id, el, o) {
    o = o || {};
    var vor = kopie(du()), sp = 'c6w-du-' + Math.random().toString(36).slice(2, 7);
    el.innerHTML = '';
    var w = document.createElement('div'); w.className = 'c6w-du'; el.appendChild(w);
    function satzP(t) { w.insertAdjacentHTML('beforeend', '<p class="c6w-satz">' + esc(t) + '</p><span class="c6w-zier" aria-hidden="true"></span>'); }
    var zur = null;
    function geaendert() { if (zur) zur.hidden = false; if (o.geaendert) try { o.geaendert(); } catch (e) {} }
    function feldD(lab, key, lang) {
      var fid = sp + '-' + key, wert = du()[key] || '';
      w.insertAdjacentHTML('beforeend', '<label class="c6w-lab" for="' + fid + '">' + esc(lab) + '</label>' +
        (lang ? '<textarea id="' + fid + '" class="c6w-feld c6w-hand" rows="2" maxlength="300">' + esc(wert) + '</textarea>' : '<input id="' + fid + '" class="c6w-feld c6w-hand" maxlength="60" value="' + esc(wert) + '">'));
      var f = w.querySelector('#' + fid);
      f.oninput = function () { var v = f.value; setzeDu(function (d) { d[key] = v; }); geaendert(); };
      return f;
    }
    function listeD(key, leer) {
      var box = document.createElement('div'); box.className = 'c6w-liste'; w.appendChild(box);
      (function male() {
        var a = (du()[key] || []).slice();
        box.innerHTML = (a.length ? '' : '<p class="c6w-leise">' + esc(leer) + '</p>') + a.map(function (t, i) {
          return '<div class="c6w-zeile"><input class="c6w-feld c6w-hand" data-i="' + i + '" maxlength="120" value="' + esc(t) + '" aria-label="Eintrag ' + (i + 1) + '"><button class="c6w-weg" data-i="' + i + '" aria-label="Streichen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></div>';
        }).join('') + '<button class="c6w-knopf c6w-dazu">Noch etwas</button>';
        [].forEach.call(box.querySelectorAll('input'), function (f) { f.oninput = function () { var v = f.value; setzeDu(function (d) { d[key] = (d[key] || []).slice(); d[key][+f.dataset.i] = v; }); geaendert(); }; });
        [].forEach.call(box.querySelectorAll('.c6w-weg'), function (b) { b.onclick = function () { setzeDu(function (d) { d[key] = (d[key] || []).filter(function (_, i) { return i !== +b.dataset.i; }); }); geaendert(); male(); }; });
        box.querySelector('.c6w-dazu').onclick = function () { setzeDu(function (d) { d[key] = (d[key] || []).concat(['']); }); geaendert(); male(); var fs = box.querySelectorAll('input'); if (fs.length) fs[fs.length - 1].focus(); };
      })();
    }
    if (id === 'du') { satzP('Das weiß ich über dich. Ändern darf ich nur mit deinem Ja.'); feldD('Dein Name', 'name'); feldD('Wie du mich nennst', 'carlName'); feldD('Was du machst', 'arbeit', true); }
    else if (id === 'baut') { satzP('Woran baust du gerade?'); feldD('In einem Satz', 'baut', true); }
    else if (id === 'tun') { satzP('Wobei soll ich dir helfen?'); listeD('tun', 'Noch steht hier nichts. Schreib mir, wobei ich helfen darf.'); }
    else if (id === 'nie') { satzP('Was soll ich nie tun?'); listeD('nie', 'Noch steht hier nichts. Was ich nie tun soll, halte ich ein.'); }
    else if (id === 'ton') {
      var t = du().ton || '';
      satzP('Wie soll ich klingen?');
      w.insertAdjacentHTML('beforeend', '<div class="c6w-arten" role="radiogroup" aria-label="Ton">' + TOENE.map(function (x) { return '<button type="button" role="radio" aria-checked="' + (t === x) + '">' + x + '</button>'; }).join('') + '</div>');
      var f = feldD('Oder in deinen Worten', 'ton'); if (TOENE.indexOf(t) >= 0) f.value = '';
      [].forEach.call(w.querySelectorAll('[role=radio]'), function (b) {
        b.onclick = function () { setzeDu(function (d) { d.ton = b.textContent; }); geaendert(); f.value = ''; [].forEach.call(w.querySelectorAll('[role=radio]'), function (x) { x.setAttribute('aria-checked', x === b); }); };
      });
      f.addEventListener('input', function () { [].forEach.call(w.querySelectorAll('[role=radio]'), function (x) { x.setAttribute('aria-checked', 'false'); }); });
    }
    else if (id === 'damals') {
      var d = damals();
      if (!d) { satzP('Hier hebe ich deine Sätze auf.'); w.insertAdjacentHTML('beforeend', '<p class="c6w-leise">Ab morgen kann ich dir einen davon wieder vorlesen, wenn er zu heute passt.</p>'); }
      else {
        satzP(d.passt ? 'Ich dachte, das passt zu heute.' : 'Das lag ganz hinten im Buch. Klingt es heute anders?');
        w.insertAdjacentHTML('beforeend', '<p class="c6w-leise">Am ' + C6.strings.datum(d.ts) + ' hast du geschrieben' + (d.faden ? ', bei „' + esc(d.faden) + '“' : '') + ':</p><blockquote class="c6w-zitat">' + esc(d.t) + '</blockquote>');
      }
    }
    else if (id === 'begleiter') {
      var g = C6.strings.gewohnheiten();
      satzP('Abends frag ich dich leise nach einer Sache. Ohne Zahl, ohne Kette.');
      w.insertAdjacentHTML('beforeend', '<ul class="c6w-baender">' + g.map(function (s) {
        var p = (s.perlen || []).slice(-3).reverse();
        return '<li style="--f:' + s.farbe + '"><span class="c6w-band"></span><span><b>' + esc(s.titel) + '</b>' + (p.length ? p.map(function (x) { return '<span class="c6w-perle-t"><i class="c6w-perle" style="background:' + s.farbe + '"></i>' + esc(x.t) + '</span>'; }).join('') : '<span class="c6w-leise">Noch keine Perle.</span>') + '</span></li>';
      }).join('') + '</ul><form class="c6w-neu-gew"><label class="c6w-lab" for="' + sp + '-gew">Eine Gewohnheit, die ich begleiten darf</label><input id="' + sp + '-gew" class="c6w-feld c6w-hand" maxlength="40" placeholder="Zum Beispiel: abends lesen"><button class="c6w-knopf" type="submit">Als Lesezeichen einlegen</button></form>' +
        (C6.strings.abendDran() ? '<button class="c6w-knopf c6w-haupt c6w-abend">Von heute erzählen</button>' : ''));
      w.querySelector('form').onsubmit = function (e) { e.preventDefault(); var v = w.querySelector('#' + sp + '-gew').value.trim(); if (!v) return; C6.strings.neu({ titel: v, art: 'gewohnheit' }); maleKapitel('begleiter', el, o); };
      var ab = w.querySelector('.c6w-abend'); if (ab) ab.onclick = function () { if (o.zu) o.zu(); C6.strings.abendfrage(); };
    }
    if (o.zurueck !== false && id !== 'damals' && id !== 'begleiter') {
      w.insertAdjacentHTML('beforeend', '<p class="c6w-buch-fuss"><button class="c6w-knopf c6w-leicht c6w-zurueck" hidden>Rückgängig</button></p>');
      zur = w.querySelector('.c6w-zurueck');
      zur.onclick = function () {
        setzeDu(function (d) { Object.keys(d).forEach(function (k) { if (!(k in vor)) delete d[k]; }); Object.keys(vor).forEach(function (k) { d[k] = kopie(vor[k]); }); });
        maleKapitel(id, el, o);
      };
    }
    return w;
  }

  // ——— Gegenstände eines liebevoll verrückten Genies (antippbar, ohne Pflichten) ———
  function ding(id, label, innen, hit) {
    return '<g class="c6w-ding c6w-genie" data-id="ding:' + id + '" tabindex="0" role="button" aria-label="' + esc(label) + '">' +
      '<rect x="' + hit[0] + '" y="' + hit[1] + '" width="' + hit[2] + '" height="' + hit[3] + '" fill="transparent"/>' +
      '<g class="c6w-ding-innen c6w-g-' + id + '">' + innen + '</g></g>';
  }
  function sanduhrSchoen(x, b) {
    var cx = x + 24, h = 84, t = b - h;
    var inn = '<rect x="' + (cx - 22) + '" y="' + (t) + '" width="44" height="9" rx="3" fill="#7a5638" stroke="#140d09" stroke-width="1.4"/>' +
      '<rect x="' + (cx - 22) + '" y="' + (b - 9) + '" width="44" height="9" rx="3" fill="#7a5638" stroke="#140d09" stroke-width="1.4"/>' +
      '<path d="M' + (cx - 18) + ' ' + (t + 9) + ' V' + (b - 9) + ' M' + (cx + 18) + ' ' + (t + 9) + ' V' + (b - 9) + '" stroke="#b48b45" stroke-width="3"/>' +
      '<path d="M' + (cx - 13) + ' ' + (t + 10) + ' C' + (cx - 13) + ' ' + (t + 34) + ', ' + (cx - 2) + ' ' + (t + 38) + ', ' + (cx - 2) + ' ' + (t + 42) + ' C' + (cx - 2) + ' ' + (t + 46) + ', ' + (cx - 13) + ' ' + (t + 50) + ', ' + (cx - 13) + ' ' + (b - 10) + ' H' + (cx + 13) + ' C' + (cx + 13) + ' ' + (t + 50) + ', ' + (cx + 2) + ' ' + (t + 46) + ', ' + (cx + 2) + ' ' + (t + 42) + ' C' + (cx + 2) + ' ' + (t + 38) + ', ' + (cx + 13) + ' ' + (t + 34) + ', ' + (cx + 13) + ' ' + (t + 10) + ' Z" fill="#dfeef0" fill-opacity=".35" stroke="#f3ead2" stroke-width="1.4"/>' +
      '<path d="M' + (cx - 10) + ' ' + (t + 24) + ' Q' + cx + ' ' + (t + 30) + ' ' + (cx + 10) + ' ' + (t + 24) + ' L' + (cx + 3) + ' ' + (t + 38) + ' H' + (cx - 3) + ' Z" fill="#e8b85a"/>' +
      '<path class="c6w-sand c6m-rieselt" d="M' + cx + ' ' + (t + 40) + ' V' + (b - 22) + '" stroke="#e8b85a" stroke-width="1.4" stroke-dasharray="2 4"/>' +
      '<path d="M' + (cx - 12) + ' ' + (b - 10) + ' Q' + cx + ' ' + (b - 26) + ' ' + (cx + 12) + ' ' + (b - 10) + ' Z" fill="#e8b85a"/>' +
      '<path d="M' + (cx - 9) + ' ' + (t + 14) + ' q-2 10 2 18" stroke="#fff" stroke-width="1.6" opacity=".55" fill="none"/>';
    return { w: 50, svg: kschatten(cx, b, 24, h, 0.9) + ding('sanduhr', 'Eine Sanduhr', inn, [x - 10, t - 4, 70, h + 6]) };
  }
  function pendel(x, b) {
    var inn = '<path d="M' + (x + 4) + ' ' + b + ' H' + (x + 74) + '" stroke="#5a3d29" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M' + (x + 10) + ' ' + b + ' V' + (b - 62) + ' H' + (x + 68) + ' V' + b + '" fill="none" stroke="#b48b45" stroke-width="3"/>';
    for (var i = 0; i < 5; i++) {
      var kx = x + 21 + i * 9;
      inn += '<g class="c6w-k' + (i + 1) + '" style="transform-origin:' + kx + 'px ' + (b - 62) + 'px"><path d="M' + kx + ' ' + (b - 62) + ' V' + (b - 22) + '" stroke="#d9cfbf" stroke-width="1"/><circle cx="' + kx + '" cy="' + (b - 18) + '" r="4.6" fill="#c9ccd1" stroke="#140d09" stroke-width="1"/><circle cx="' + (kx - 1.5) + '" cy="' + (b - 19.5) + '" r="1.3" fill="#fff"/></g>';
    }
    return { w: 80, svg: kschatten(x + 39, b, 36, 62, 0.8) + ding('pendel', 'Eine kleine Maschine mit Kugeln', inn, [x, b - 70, 80, 72]) };
  }
  function glaeser(x, b) {
    var inn = '', farben = [['#c8a46a', '#6b4a2a'], ['#9fb07c', '#3d5a2c'], ['#d9b9a0', '#8a4a3a']];
    [[0, 52], [24, 62], [48, 46]].forEach(function (g, i) {
      var gx = x + g[0], hh = g[1];
      inn += '<rect x="' + gx + '" y="' + (b - hh) + '" width="22" height="' + hh + '" rx="5" fill="#e8f1ef" fill-opacity=".28" stroke="#efe6d4" stroke-width="1.3"/>' +
        '<rect x="' + (gx + 2) + '" y="' + (b - hh * 0.55) + '" width="18" height="' + (hh * 0.55 - 2) + '" rx="3" fill="' + farben[i][0] + '"/>' +
        '<g fill="' + farben[i][1] + '">' + [0, 1, 2, 3, 4, 5].map(function (k) { return '<circle cx="' + (gx + 5 + (k * 7) % 14) + '" cy="' + (b - 5 - Math.floor(k / 2) * 6) + '" r="1.6"/>'; }).join('') + '</g>' +
        '<rect x="' + (gx + 3) + '" y="' + (b - hh - 6) + '" width="16" height="8" rx="2" fill="#a07a50" stroke="#140d09" stroke-width="1"/>' +
        '<rect x="' + (gx + 4) + '" y="' + (b - hh * 0.8) + '" width="14" height="9" fill="#f4ead2" stroke="#8a7a5c" stroke-width=".8"/>';
    });
    return { w: 74, svg: kschatten(x + 35, b, 36, 56, 0.8) + ding('samen', 'Gläser mit Samen', inn, [x - 2, b - 72, 76, 74]) };
  }
  function fernrohr(x, b) {
    var cx = x + 34;
    var inn = '<path d="M' + (cx - 18) + ' ' + b + ' L' + cx + ' ' + (b - 50) + ' L' + (cx + 18) + ' ' + b + ' M' + cx + ' ' + (b - 50) + ' V' + b + '" stroke="#5a3d29" stroke-width="3" fill="none"/>' +
      '<g transform="rotate(-28 ' + cx + ' ' + (b - 54) + ')"><rect x="' + (cx - 34) + '" y="' + (b - 60) + '" width="62" height="12" rx="3" fill="url(#c6w-messing)" stroke="#140d09" stroke-width="1.2"/>' +
      '<rect x="' + (cx + 26) + '" y="' + (b - 63) + '" width="14" height="18" rx="3" fill="#b48b45" stroke="#140d09" stroke-width="1.2"/>' +
      '<rect x="' + (cx - 42) + '" y="' + (b - 58) + '" width="10" height="8" rx="2" fill="#8a6a2e" stroke="#140d09" stroke-width="1"/>' +
      '<path d="M' + (cx - 20) + ' ' + (b - 60) + ' V' + (b - 48) + ' M' + (cx + 6) + ' ' + (b - 60) + ' V' + (b - 48) + '" stroke="#7a5a28" stroke-width="1.2"/></g>';
    return { w: 74, svg: kschatten(cx, b, 22, 50, 0.8) + ding('fernrohr', 'Ein Fernrohr', inn, [x - 6, b - 96, 84, 98]) };
  }
  function periodensystem(x, b) {
    var w = 112, h = 84, t = b - h, cw = 5.2, ch = 6.6, ox = x + 9, oy = t + 10, z = '';
    var fam = function (r, c) { if (c === 0) return r === 0 ? '#e3d8bd' : '#d98f78'; if (c === 1) return '#e2b26d'; if (c >= 2 && c <= 11) return '#d8c08a'; if (c === 17) return '#9fb7c9'; if (c === 16) return '#b8cf98'; return '#e9dfc5'; };
    for (var r = 0; r < 7; r++) for (var c = 0; c < 18; c++) {
      var da = (r === 0 && (c === 0 || c === 17)) || ((r === 1 || r === 2) && (c < 2 || c > 11)) || r >= 3;
      if (da) z += '<rect x="' + (ox + c * cw).toFixed(1) + '" y="' + (oy + r * ch).toFixed(1) + '" width="' + (cw - .8) + '" height="' + (ch - .9) + '" fill="' + fam(r, c) + '"/>';
    }
    for (var r2 = 0; r2 < 2; r2++) for (var c2 = 0; c2 < 15; c2++) z += '<rect x="' + (ox + (c2 + 2.5) * cw).toFixed(1) + '" y="' + (oy + (7.6 + r2) * ch).toFixed(1) + '" width="' + (cw - .8) + '" height="' + (ch - .9) + '" fill="' + (r2 ? '#c9b3d4' : '#dcc3d9') + '"/>';
    var inn = '<g transform="rotate(-3 ' + (x + w / 2) + ' ' + b + ')"><rect x="' + x + '" y="' + t + '" width="' + w + '" height="' + h + '" rx="2" fill="#6b4a31" stroke="#140d09" stroke-width="1.6"/>' +
      '<rect x="' + (x + 5) + '" y="' + (t + 5) + '" width="' + (w - 10) + '" height="' + (h - 10) + '" fill="#f4ead2"/>' + z + '</g>';
    return { w: w + 6, svg: kschatten(x + w / 2, b, w * 0.5, h, 0.7) + ding('periodensystem', 'Eine Tafel mit allen Elementen', inn, [x - 2, t - 4, w + 6, h + 6]) };
  }
  function globusD(x, b) {
    var cx = x + 40;
    var inn = '<g transform="translate(' + cx + ',' + b + ')"><path d="M-22 0 H22 M0 0 V-14" stroke="#b48b45" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M-38 -56 A40 40 0 0 0 30 -24" fill="none" stroke="#b48b45" stroke-width="3"/>' +
      '<circle cx="0" cy="-54" r="34" fill="#3b5a6a" stroke="#140d09" stroke-width="1.6"/>' +
      '<clipPath id="c6m-globus-clip"><circle cx="0" cy="-54" r="33"/></clipPath>' +
      '<g clip-path="url(#c6m-globus-clip)"><g class="c6w-land"><path d="M-18 -74 q10 6 4 16 q-10 4 -6 14 q8 2 12 -6 M10 -80 q8 10 18 8 M6 -40 q8 -6 16 0 q4 8 -4 12" fill="#8e8a5a" stroke="#140d09" stroke-width="1.2" opacity=".9"/>' +
      '<path d="M-86 -74 q10 6 4 16 q-10 4 -6 14 q8 2 12 -6 M-58 -80 q8 10 18 8 M-62 -40 q8 -6 16 0 q4 8 -4 12" fill="#8e8a5a" stroke="#140d09" stroke-width="1.2" opacity=".9"/></g></g>' +
      '<ellipse cx="0" cy="-54" rx="14" ry="34" fill="none" stroke="#e6c987" stroke-width="1" opacity=".5"/><circle cx="-12" cy="-66" r="10" fill="#fff" opacity=".12"/></g>';
    return { w: 80, svg: kschatten(cx, b, 24, 90, 0.9) + ding('globus', 'Ein Globus', inn, [x, b - 92, 80, 94]) };
  }
  function atlasLiegend(x, b) {
    var inn = '<rect x="' + (x + 6) + '" y="' + (b - 16) + '" width="84" height="16" rx="2" fill="#4a3a26" stroke="#140d09" stroke-width="1.4"/>' +
      '<rect x="' + x + '" y="' + (b - 36) + '" width="92" height="20" rx="2" fill="#2f4d44" stroke="#140d09" stroke-width="1.4"/>' +
      '<rect x="' + (x + 2) + '" y="' + (b - 34) + '" width="88" height="4" fill="#fff" opacity=".1"/>' +
      '<path d="M' + (x + 14) + ' ' + (b - 30) + ' q8 -2 12 3 q6 4 14 0 M' + (x + 52) + ' ' + (b - 24) + ' q8 -4 16 0 q6 2 10 -2" fill="none" stroke="' + GOLD + '" stroke-width="1.3"/>' +
      '<circle cx="' + (x + 74) + '" cy="' + (b - 28) + '" r="4" fill="none" stroke="' + GOLD + '" stroke-width="1"/>';
    return { w: 96, svg: kschatten(x + 46, b, 46, 36, 0.7) + ding('landkarte', 'Eine Landkarte', inn, [x - 2, b - 72, 96, 74]) };
  }
  // „Wen bewunderst du?“: eine kleine Galerie mit leeren Rahmen
  function galerie(x, b, ms) {
    var ini = function (m) { return String(m && m.name || '').trim().split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase(); };
    var gross = '<rect x="' + (x + 30) + '" y="' + (b - 128) + '" width="66" height="86" rx="3" fill="url(#c6w-messing)" stroke="#140d09" stroke-width="1.6"/>' +
      '<rect x="' + (x + 37) + '" y="' + (b - 121) + '" width="52" height="72" fill="#2a1d14"/>' +
      '<ellipse cx="' + (x + 63) + '" cy="' + (b - 85) + '" rx="24" ry="32" fill="url(#c6w-aura)" opacity=".75"/>' +
      (ms[0] ? '<text class="c6w-gal-ini" x="' + (x + 63) + '" y="' + (b - 79) + '" text-anchor="middle">' + esc(ini(ms[0])) + '</text>' : '<path d="M' + (x + 63) + ' ' + (b - 98) + ' v20 M' + (x + 53) + ' ' + (b - 88) + ' h20" stroke="' + GOLD + '" stroke-width="1.6" opacity=".8"/>');
    var oval = function (ox, oy, m) {
      return '<ellipse cx="' + ox + '" cy="' + oy + '" rx="17" ry="22" fill="url(#c6w-messing)" stroke="#140d09" stroke-width="1.4"/><ellipse cx="' + ox + '" cy="' + oy + '" rx="12" ry="17" fill="#2a1d14"/>' +
        (m ? '<text class="c6w-gal-ini c6w-gal-klein" x="' + ox + '" y="' + (oy + 5) + '" text-anchor="middle">' + esc(ini(m)) + '</text>' : '<ellipse cx="' + ox + '" cy="' + oy + '" rx="8" ry="12" fill="url(#c6w-aura)" opacity=".45"/>');
    };
    var inn = '<path d="M' + (x + 63) + ' ' + (b - 150) + ' L' + (x + 40) + ' ' + (b - 128) + ' M' + (x + 63) + ' ' + (b - 150) + ' L' + (x + 86) + ' ' + (b - 128) + '" stroke="#b48b45" stroke-width="1.2"/><circle cx="' + (x + 63) + '" cy="' + (b - 150) + '" r="2.4" fill="#b48b45"/>' +
      gross + oval(x + 14, b - 98, ms[1]) + oval(x + 112, b - 98, ms[2]) +
      '<rect x="' + (x + 36) + '" y="' + (b - 32) + '" width="54" height="16" rx="2" fill="url(#c6w-messing)" stroke="#140d09" stroke-width="1"/>' +
      '<text class="c6w-gal-schild" x="' + (x + 63) + '" y="' + (b - 21) + '" text-anchor="middle">Meister</text>';
    return { w: 132, svg: '<g class="c6w-ding c6w-galerie" data-id="' + (ms.length ? 'meister' : 'meister-neu') + '" tabindex="0" role="button" aria-label="Deine Meister">' +
      '<rect x="' + (x - 6) + '" y="' + (b - 156) + '" width="138" height="158" fill="transparent"/><g class="c6w-ding-innen">' + inn + '</g></g>' };
  }

  // Der Gang hinter der Bücherwand: warmes Zauberlicht, Stufen, Funken, der rote Faden
  function gang(x, y, w, h) {
    var mx = x + w / 2, b = y + h, f = '';
    for (var i = 0; i < 5; i++) f += '<circle cx="' + (x + 10 + zufall(i * 3) * (w - 20)).toFixed(1) + '" cy="' + (y + 10 + zufall(i * 7 + 1) * (h - 30)).toFixed(1) + '" r="' + (1 + zufall(i) * 1.8).toFixed(1) + '" fill="#fff4d0"/>';
    f = '<g class="c6w-funke">' + f + '</g>';
    return '<g class="c6w-gang" aria-hidden="true">' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#1a1210"/>' +
      '<path d="M' + (mx - w * 0.3) + ' ' + b + ' V' + (y + h * 0.3) + ' A' + (w * 0.3) + ' ' + (w * 0.3) + ' 0 0 1 ' + (mx + w * 0.3) + ' ' + (y + h * 0.3) + ' V' + b + ' Z" fill="url(#c6w-zauber)"/>' +
      [0, 1, 2, 3].map(function (k) { var sy = b - k * 14, sw = w * (0.62 - k * 0.08); return '<rect x="' + (mx - sw / 2) + '" y="' + (sy - 14) + '" width="' + sw + '" height="14" fill="#3a2a1f" stroke="#140d09" stroke-width="1"/>'; }).join('') +
      '<ellipse cx="' + mx + '" cy="' + (y + h * 0.45) + '" rx="' + (w * 0.6) + '" ry="' + (h * 0.5) + '" fill="url(#c6w-aura)" opacity=".7"/>' +
      f +
      '<path d="M' + (mx + 6) + ' ' + b + ' C ' + (mx + w * 0.2) + ' ' + (b - h * 0.2) + ', ' + (mx - w * 0.15) + ' ' + (y + h * 0.5) + ', ' + mx + ' ' + (y + h * 0.36) + '" fill="none" stroke="#d62a26" stroke-width="2.2" stroke-linecap="round"/>' +
      '</g>';
  }

  // Die Bücherwand. Der rechte Teil (ab D) ist die Geheimtür; das blaue Lexikon ist ihr Hebel.
  function wandSVG(L, ms) {
    var rand = 16, brett = 16, innenX = L.x + rand, innenW = L.w - 2 * rand;
    var fachH = (L.h - 2 * rand - 2 * brett) / 3, D = innenX + innenW - 192;
    var boeden = [0, 1, 2].map(function (f) { return L.y + rand + f * (fachH + brett) + fachH; });
    var hh = Math.min(158, fachH - 8);
    var links = '', rechts = '';
    function setze(r, b, x, ziel) { var s = '<g>' + r.svg.replace(/^/, '') + '</g>'; if (ziel === 'r') rechts += s; else links += s; return x + r.w; }
    function fuell(x, bis, seed, b, ziel, faktor) {
      var n = 0; while (n < 30 && fuellerBreite(n + 1, seed) < bis - x) n++;
      if (!n) return x;
      var s = '<g transform="translate(0,' + b + ')">' + fueller(x, n, seed, hh * (faktor || 1)).svg + '</g>';
      if (ziel === 'r') rechts += s; else links += s;
      return x + fuellerBreite(n, seed);
    }
    // Eine Wand, durchgehend Bücher. Nur drei Dinge stehen dazwischen: die Sanduhr, die Meister, das blaue Lexikon (der Hebel der Tür).
    var b0 = boeden[0], x = innenX + 6;
    var linksW = D - innenX - 12, mitte = innenX + 6 + Math.max(60, linksW * 0.5 - 30);
    x = fuell(x, mitte, 5, b0); x = setze(sanduhrSchoen(x + 4, b0), b0, x + 4) + 4; fuell(x, D - 6, 12, b0, null, 0.9);
    fuell(D + 6, innenX + innenW - 4, 31, b0, 'r', 0.92);
    var b1 = boeden[1]; x = innenX + 6;
    fuell(x, D - 6, 41, b1, null, 0.95);
    x = fuell(D + 6, D + 14, 44, b1, 'r', 0.9);
    rechts += lexikon(D + 10, b1, Math.min(150, fachH - 10));
    fuell(D + 10 + 14 + 104, innenX + innenW - 4, 46, b1, 'r', 0.88);
    var b2 = boeden[2]; x = innenX + 8;
    fuell(x, D - 6, 53, b2, null, 0.95);
    fuell(D + 6, innenX + innenW - 4, 57, b2, 'r', 0.9);
    // Rahmen, Rückwände, Bretter
    var basis = '<rect x="' + (L.x - 12) + '" y="' + (L.y - 22) + '" width="' + (L.w + 24) + '" height="24" rx="3" fill="#4a3122" stroke="' + T + '" stroke-width="2"/>' +
      '<rect x="' + (L.x - 6) + '" y="' + (L.y - 8) + '" width="' + (L.w + 12) + '" height="10" fill="#6b4a31" stroke="' + T + '" stroke-width="1.6"/>' +
      '<rect x="' + L.x + '" y="' + L.y + '" width="' + L.w + '" height="' + L.h + '" fill="url(#c6w-holz)" stroke="' + T + '" stroke-width="2"/>' +
      '<rect x="' + (L.x - 8) + '" y="' + (L.y + L.h) + '" width="' + (L.w + 16) + '" height="20" rx="2" fill="#3e2a1d" stroke="' + T + '" stroke-width="2"/>';
    var tx = D - 4, tw = L.x + L.w - 6 - tx, ty = L.y + 6, th = L.h - 6;
    basis += gang(tx, ty, tw, th);
    var fachL = '', fachR = '', brL = '', brR = '';
    boeden.forEach(function (by) {
      fachL += '<rect x="' + innenX + '" y="' + (by - fachH) + '" width="' + (D - 4 - innenX) + '" height="' + fachH + '" fill="url(#c6w-fach)"/>';
      fachR += '<rect x="' + D + '" y="' + (by - fachH) + '" width="' + (innenX + innenW - D) + '" height="' + fachH + '" fill="url(#c6w-fach)"/>';
      brL += '<rect x="' + (L.x + 4) + '" y="' + by + '" width="' + (D - 4 - L.x - 4) + '" height="' + brett + '" fill="url(#c6w-brett)" stroke="' + T + '" stroke-width="1.6"/>';
      brR += '<rect x="' + (D - 4) + '" y="' + by + '" width="' + (L.x + L.w - 4 - D + 4) + '" height="' + brett + '" fill="url(#c6w-brett)" stroke="' + T + '" stroke-width="1.6"/>';
    });
    var leaf = '<g class="c6w-tuerblatt">' +
      '<rect x="' + tx + '" y="' + ty + '" width="' + (L.x + L.w - tx) + '" height="' + th + '" fill="url(#c6w-holz)"/>' +
      fachR + rechts + brR +
      '<rect class="c6w-tuer-schatten" x="' + tx + '" y="' + ty + '" width="' + (L.x + L.w - tx) + '" height="' + th + '" fill="#140d09"/>' +
      '<path d="M' + (L.x + L.w) + ' ' + L.y + ' V' + (L.y + L.h) + '" stroke="' + T + '" stroke-width="2"/></g>' +
      '<path class="c6w-tuer-spalt" d="M' + (tx + 1) + ' ' + (ty + 4) + ' V' + (L.y + L.h - 2) + '" stroke="#ffe3a0" stroke-width="3" stroke-linecap="round"/>' +
      // Staub, der aus der Fuge rieselt, und Licht, das durch die offene Tür auf den Boden fällt
      '<g class="c6w-tuer-staub" aria-hidden="true">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { return '<circle style="animation-delay:' + (k * 0.09).toFixed(2) + 's" cx="' + (tx + 4 + zufall(k * 3) * 26).toFixed(1) + '" cy="' + (ty + 6 + zufall(k * 7) * 30).toFixed(1) + '" r="' + (1 + zufall(k) * 1.6).toFixed(1) + '" fill="#e9d6ae"/>'; }).join('') + '</g>' +
      '<path class="c6w-tuer-licht" aria-hidden="true" d="M' + tx + ' ' + (L.y + L.h + 2) + ' L' + (tx + tw) + ' ' + (L.y + L.h + 2) + ' L' + (tx + tw * 1.9) + ' ' + (L.y + L.h + 96) + ' L' + (tx - tw * 0.5) + ' ' + (L.y + L.h + 96) + ' Z" fill="url(#c6w-tuerlicht)"/>';
    // Lesebändchen des Lexikons läuft als roter Faden zum Boden
    return '<g class="c6w-wand">' + basis + fachL + links + brL + leaf + '</g>';
  }

  // Carls Schreibtisch mit dem glühenden Freundschaftsbuch
  function freundschaftsbuch(cx, y, w, glueht) {
    var h = w * 0.34, x0 = cx - w / 2;
    return '<g class="c6w-ding c6w-fbuch' + (glueht ? ' c6w-leuchtet' : '') + '" data-id="atlas" tabindex="0" role="button" aria-label="Unser Freundschaftsbuch">' +
      '<ellipse class="c6w-aura c6w-aura-rose" cx="' + cx + '" cy="' + (y - h * 0.5) + '" rx="' + (w * 0.85) + '" ry="' + (h * 1.6) + '" fill="url(#c6w-aura-rose)"/>' +
      kschatten(cx, y, w * 0.52, h + 12, 0.9) +
      '<g class="c6m-seite" style="transform-origin:' + (x0 + w * 0.1) + 'px ' + (y - 12 - h) + 'px"><path d="M' + (x0 + w * 0.12) + ' ' + (y - 14) + ' L' + (x0 + w * 0.2) + ' ' + (y - 10 - h) + ' L' + (x0 + w * 0.86) + ' ' + (y - 10 - h) + ' L' + (x0 + w - 14) + ' ' + (y - 14) + ' Z" fill="#fbf5e8" stroke="#8a7a5c" stroke-width="1"/><path d="M' + (x0 + w * 0.3) + ' ' + (y - 20 - h * 0.55) + ' h' + (w * 0.36) + ' M' + (x0 + w * 0.3) + ' ' + (y - 20 - h * 0.3) + ' h' + (w * 0.3) + '" stroke="#cdbd9c" stroke-width="1.2"/></g>' +
      '<rect x="' + (x0 - 10) + '" y="' + (y - h - 24) + '" width="' + (w + 20) + '" height="' + (h + 28) + '" fill="transparent"/>' +
      '<g class="c6w-ding-innen">' +
      '<path d="M' + (x0 + 4) + ' ' + y + ' L' + (x0 + w - 4) + ' ' + y + ' L' + (x0 + w) + ' ' + (y - 12) + ' L' + x0 + ' ' + (y - 12) + ' Z" fill="#f3e8d2" stroke="#140d09" stroke-width="1.2"/>' +
      '<path d="M' + (x0 + 8) + ' ' + (y - 4) + ' H' + (x0 + w - 8) + ' M' + (x0 + 6) + ' ' + (y - 8) + ' H' + (x0 + w - 6) + '" stroke="#d9c9a8" stroke-width="1"/>' +
      '<path d="M' + x0 + ' ' + (y - 12) + ' L' + (x0 + w * 0.1) + ' ' + (y - 12 - h) + ' L' + (x0 + w * 0.92) + ' ' + (y - 12 - h) + ' L' + (x0 + w) + ' ' + (y - 12) + ' Z" fill="#c99a8e" stroke="#140d09" stroke-width="1.6"/>' +
      '<path d="M' + (x0 + 12) + ' ' + (y - 16) + ' L' + (x0 + w * 0.13) + ' ' + (y - 8 - h) + ' L' + (x0 + w * 0.9) + ' ' + (y - 8 - h) + ' L' + (x0 + w - 12) + ' ' + (y - 16) + ' Z" fill="none" stroke="#f6e3c8" stroke-width="1.4" opacity=".9"/>' +
      '<path d="M' + cx + ' ' + (y - 16 - h * 0.18) + ' c-9 -6 -12 -14 -6 -18 c4 -2 6 0 6 3 c0 -3 2 -5 6 -3 c6 4 3 12 -6 18 Z" fill="#d62a26" stroke="#140d09" stroke-width=".9"/>' +
      '<path d="M' + (x0 + w * 0.7) + ' ' + (y - 12) + ' v22 l5 -6 5 6 v-22" fill="#d62a26" stroke="#140d09" stroke-width=".9"/>' +
      '<path d="M' + (x0 + w * 0.14) + ' ' + (y - 14 - h) + ' L' + (x0 + w * 0.5) + ' ' + (y - 14 - h) + '" stroke="#fff" stroke-width="2" opacity=".25"/>' +
      '</g></g>';
  }
  function tee(x, y) {
    var inn = '<path d="M' + (x - 13) + ' ' + (y - 22) + ' H' + (x + 13) + ' L' + (x + 10) + ' ' + (y - 3) + ' Q' + x + ' ' + (y + 1) + ' ' + (x - 10) + ' ' + (y - 3) + ' Z" fill="#f4ead2" stroke="#140d09" stroke-width="1.4"/>' +
      '<path d="M' + (x + 13) + ' ' + (y - 18) + ' q8 0 6 7 q-2 5 -8 4" fill="none" stroke="#140d09" stroke-width="1.4"/>' +
      '<ellipse cx="' + x + '" cy="' + y + '" rx="18" ry="3.5" fill="#e6dac0" stroke="#140d09" stroke-width="1.2"/>' +
      '<g class="c6m-dampf"><path d="M' + (x - 5) + ' ' + (y - 26) + ' q-4 -8 1 -14" stroke="#e8dcc6" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M' + x + ' ' + (y - 27) + ' q4 -9 -1 -17" stroke="#e8dcc6" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M' + (x + 5) + ' ' + (y - 26) + ' q-4 -8 1 -15" stroke="#e8dcc6" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".5"/></g>';
    return kschatten(x, y, 17, 24, 0.8) + ding('tee', 'Eine Tasse Tee', inn, [x - 34, y - 70, 68, 74]);
  }
  function tinte(x, y) {
    return '<g aria-hidden="true">' + kschatten(x, y, 9, 16, 0.8) + '<path d="M' + (x - 8) + ' ' + y + ' V' + (y - 10) + ' Q' + x + ' ' + (y - 16) + ' ' + (x + 8) + ' ' + (y - 10) + ' V' + y + ' Z" fill="#1d2a44" stroke="#140d09" stroke-width="1.2"/>' +
      '<path d="M' + (x + 2) + ' ' + (y - 13) + ' Q' + (x + 18) + ' ' + (y - 40) + ' ' + (x + 30) + ' ' + (y - 52) + ' Q' + (x + 22) + ' ' + (y - 34) + ' ' + (x + 4) + ' ' + (y - 12) + '" fill="#f4ead2" stroke="#140d09" stroke-width="1"/></g>';
  }
  function skizzen(x, y, w) {
    var inn = '<g transform="rotate(-4 ' + (x + 30) + ' ' + (y + 40) + ')"><rect x="' + x + '" y="' + y + '" width="64" height="80" fill="#f4ead2" stroke="#8a7a5c" stroke-width="1"/>' +
      '<circle cx="' + (x + 18) + '" cy="' + (y + 54) + '" r="10" fill="none" stroke="#5f5345" stroke-width="1.2"/><circle cx="' + (x + 46) + '" cy="' + (y + 54) + '" r="10" fill="none" stroke="#5f5345" stroke-width="1.2"/>' +
      '<path d="M' + (x + 18) + ' ' + (y + 54) + ' L' + (x + 28) + ' ' + (y + 40) + ' L' + (x + 42) + ' ' + (y + 40) + ' L' + (x + 46) + ' ' + (y + 54) + ' M' + (x + 28) + ' ' + (y + 40) + ' L' + (x + 32) + ' ' + (y + 54) + '" fill="none" stroke="#5f5345" stroke-width="1.2"/>' +
      '<path d="M' + (x + 8) + ' ' + (y + 14) + ' h30 M' + (x + 8) + ' ' + (y + 22) + ' h22" stroke="#9a8a6a" stroke-width="1"/><circle cx="' + (x + 32) + '" cy="' + (y + 3) + '" r="3" fill="#d62a26"/></g>' +
      '<g transform="rotate(5 ' + (x + 40) + ' ' + (y + 120) + ')"><rect x="' + (x + 10) + '" y="' + (y + 90) + '" width="58" height="64" fill="#efe3c8" stroke="#8a7a5c" stroke-width="1"/>' +
      '<ellipse cx="' + (x + 39) + '" cy="' + (y + 126) + '" rx="16" ry="14" fill="none" stroke="#5f5345" stroke-width="1.2"/><path d="M' + (x + 39) + ' ' + (y + 112) + ' q-6 -10 -12 -8 M' + (x + 39) + ' ' + (y + 112) + ' q6 -10 12 -8" fill="none" stroke="#7a9a5a" stroke-width="1.2"/>' +
      '<circle cx="' + (x + 34) + '" cy="' + (y + 126) + '" r="1.6" fill="#5f5345"/><circle cx="' + (x + 44) + '" cy="' + (y + 126) + '" r="1.6" fill="#5f5345"/><circle cx="' + (x + 39) + '" cy="' + (y + 92) + '" r="3" fill="#b48b45"/></g>';
    return ding('skizzen', 'Skizzen an der Wand', inn, [x - 6, y - 6, (w || 80), 168]);
  }
  var GENIE = {
    sanduhr: ['Ich dreh sie um, wenn ein Gedanke zu lange dauert.', 'Die Zeit läuft. Ich lauf lieber mit.'],
    pendel: ['Klack, klack. Ich könnte da stundenlang zuhören.', 'Eine Kugel stößt an, die letzte fliegt. Gefällt mir.'],
    samen: ['Samen. Aus jedem kann was werden. Bei manchen dauert es.', 'Ich sammle sie. Für später.'],
    fernrohr: ['Damit schau ich, was hinter morgen liegt. Meistens Wolken.', 'Man sieht weiter, wenn man stillhält.'],
    periodensystem: ['Alles, woraus die Welt gebaut ist, auf einer Tafel. Ordnung, die überrascht.', 'Ich mag die Kästchen ganz rechts. Die bleiben gern für sich.'],
    globus: ['Einmal rundherum, bitte.', 'Irgendwo da drauf bist du gerade.'],
    landkarte: ['Eine Karte für Orte, an denen ich noch nicht war. Also fast alle.'],
    tee: ['Noch warm. Für dich?', 'Tee hilft beim Denken. Sagt der Tee.'],
    skizzen: ['Meine Skizzen. Die eine ist ein Fahrrad. Die andere bin ich, glaube ich.']
  };

  // Regal: L = {x, y, w, h}


  function fenster(x, y, w, h) {
    var r = w / 2;
    return '<g aria-hidden="true">' +
      '<path d="M' + (x - 8) + ' ' + (y + h + 8) + ' V' + (y + r) + ' A' + (r + 8) + ' ' + (r + 8) + ' 0 0 1 ' + (x + w + 8) + ' ' + (y + r) + ' V' + (y + h + 8) + ' Z" fill="#5d3f2b" stroke="' + T + '" stroke-width="2"/>' +
      '<path d="M' + x + ' ' + (y + h) + ' V' + (y + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + w) + ' ' + (y + r) + ' V' + (y + h) + ' Z" fill="url(#c6w-fenster)"/>' +
      '<circle cx="' + (x + w * 0.68) + '" cy="' + (y + r * 0.9) + '" r="2" fill="#fff6dc"/><circle cx="' + (x + w * 0.3) + '" cy="' + (y + r * 1.5) + '" r="1.5" fill="#fff6dc" opacity=".8"/>' +
      '<path d="M' + (x + w / 2) + ' ' + y + ' V' + (y + h) + ' M' + x + ' ' + (y + h * 0.55) + ' H' + (x + w) + '" stroke="#5d3f2b" stroke-width="5"/>' +
      '<rect x="' + (x - 14) + '" y="' + (y + h + 6) + '" width="' + (w + 28) + '" height="12" rx="2" fill="#6b4a31" stroke="' + T + '" stroke-width="1.6"/></g>';
  }

  // aufgeschlagenes Buch auf einem Pult. Mitte cx, Unterkante y, Breite w

  function lampe(fx, fy, sx, sy, spiegel) {
    // Fuß bei (fx,fy), Schirm-Mitte bei (sx,sy)
    var gx = fx + (spiegel ? 10 : 6), gy = (fy + sy) / 2 - 20;
    var staub = '';
    for (var i = 0; i < 4; i++) staub += '<circle cx="' + (sx + (zufall(i * 3 + 1) - 0.5) * 120).toFixed(1) + '" cy="' + (sy + 40 + zufall(i * 7 + 2) * 150).toFixed(1) + '" r="' + (1 + zufall(i) * 1.2).toFixed(1) + '" fill="#fff4d6"/>';
    return '<g aria-hidden="true">' + kschatten(fx, fy + 4, 26, 30, 0.8) + '<g class="c6m-staub">' + staub + '</g>' +
      '<ellipse cx="' + fx + '" cy="' + fy + '" rx="26" ry="7" fill="url(#c6w-messing)" stroke="#140d09" stroke-width="1.6"/>' +
      '<path d="M' + fx + ' ' + (fy - 4) + ' L' + gx + ' ' + gy + ' L' + sx + ' ' + (sy - 10) + '" fill="none" stroke="#b48b45" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + gx + '" cy="' + gy + '" r="5" fill="#b48b45" stroke="#140d09" stroke-width="1.2"/>' +
      '<path d="M' + (sx - 34) + ' ' + (sy + 10) + ' Q' + (sx - 30) + ' ' + (sy - 22) + ' ' + sx + ' ' + (sy - 24) + ' Q' + (sx + 30) + ' ' + (sy - 22) + ' ' + (sx + 34) + ' ' + (sy + 10) + ' Z" fill="#2f5a45" stroke="#140d09" stroke-width="1.8"/>' +
      '<path d="M' + (sx - 26) + ' ' + (sy - 6) + ' Q' + sx + ' ' + (sy - 20) + ' ' + (sx + 10) + ' ' + (sy - 18) + '" stroke="#fff" stroke-width="2" opacity=".18" fill="none"/>' +
      '<ellipse cx="' + sx + '" cy="' + (sy + 10) + '" rx="30" ry="5" fill="#ffe7b0"/></g>';
  }

  function tisch(x, y, w, hb) {
    return '<g aria-hidden="true">' + kschatten(x + w / 2, y + hb, w * 0.5, hb + 20, 0.7) +
      '<path d="M' + (x + 16) + ' ' + (y + 18) + ' V' + (y + hb) + ' M' + (x + w - 16) + ' ' + (y + 18) + ' V' + (y + hb) + '" stroke="#3e2a1d" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + (x + 16) + ' ' + (y + hb * 0.7) + ' H' + (x + w - 16) + '" stroke="#3e2a1d" stroke-width="6"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="20" rx="3" fill="#6b4a31" stroke="' + T + '" stroke-width="2"/>' +
      '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (w - 4) + '" height="5" rx="2" fill="#fff" opacity=".1"/></g>';
  }

  function teppich(cx, cy, rx, ry) {
    return '<g aria-hidden="true"><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#6e2a25" stroke="' + T + '" stroke-width="2"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (rx - 18) + '" ry="' + (ry - 8) + '" fill="none" stroke="#c99b55" stroke-width="2.5"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (rx - 34) + '" ry="' + (ry - 15) + '" fill="#7d3530"/></g>';
  }

  // ——— Gerahmte Karikaturen gemeinfreier Bilder, Carl in der Hauptrolle (eigene Zeichnung, nicht abgemalt) ———
  // Carl in Kleinformat: Kieselkörper, zwei Keimblätter, Augen. bl = Blickrichtung (-1 … 1), ohneGesicht = von hinten
  function minicarl(cx, by, s, o) {
    o = o || {};
    var w = 30 * s, h = 26 * s, t = by - h, bl = (o.blick || 0) * 3 * s;
    var g = '<g>' +
      '<path d="M' + (cx - w / 2) + ' ' + by + ' C' + (cx - w / 2) + ' ' + (t + 2 * s) + ' ' + (cx - w * 0.3) + ' ' + t + ' ' + cx + ' ' + t + ' C' + (cx + w * 0.3) + ' ' + t + ' ' + (cx + w / 2) + ' ' + (t + 2 * s) + ' ' + (cx + w / 2) + ' ' + by + ' Z" fill="' + (o.koerper || '#f2efe6') + '" stroke="#2b2722" stroke-width="' + (1.1 * s).toFixed(2) + '"/>' +
      '<path d="M' + cx + ' ' + t + ' q-1 ' + (-5 * s) + ' ' + (-1 * s) + ' ' + (-7 * s) + '" stroke="#5f7f3e" stroke-width="' + (1.1 * s).toFixed(2) + '" fill="none"/>' +
      '<path d="M' + (cx - s) + ' ' + (t - 6 * s) + ' q' + (-7 * s) + ' ' + (-1 * s) + ' ' + (-8 * s) + ' ' + (-6 * s) + ' q' + (6 * s) + ' ' + (-1 * s) + ' ' + (8 * s) + ' ' + (6 * s) + 'z" fill="#8ea37a" stroke="#2b2722" stroke-width="' + (0.8 * s).toFixed(2) + '"/>' +
      '<path d="M' + (cx - s) + ' ' + (t - 6 * s) + ' q' + (7 * s) + ' ' + (-2 * s) + ' ' + (9 * s) + ' ' + (-7 * s) + ' q' + (-7 * s) + ' ' + (0) + ' ' + (-9 * s) + ' ' + (7 * s) + 'z" fill="#a7bb8f" stroke="#2b2722" stroke-width="' + (0.8 * s).toFixed(2) + '"/>';
    if (!o.ohneGesicht) g +=
      '<circle cx="' + (cx - 6 * s + bl) + '" cy="' + (t + 10 * s) + '" r="' + (3 * s) + '" fill="#e39a2a" stroke="#2b2722" stroke-width="' + (0.6 * s).toFixed(2) + '"/><circle cx="' + (cx - 6 * s + bl * 1.3) + '" cy="' + (t + 10 * s) + '" r="' + (1.3 * s) + '" fill="#2b2722"/>' +
      '<circle cx="' + (cx + 6 * s + bl) + '" cy="' + (t + 10 * s) + '" r="' + (3 * s) + '" fill="#e39a2a" stroke="#2b2722" stroke-width="' + (0.6 * s).toFixed(2) + '"/><circle cx="' + (cx + 6 * s + bl * 1.3) + '" cy="' + (t + 10 * s) + '" r="' + (1.3 * s) + '" fill="#2b2722"/>' +
      '<path d="M' + (cx - 3 * s + bl) + ' ' + (t + 16 * s) + ' q' + (3 * s) + ' ' + (o.laecheln ? 1.6 * s : 2.6 * s) + ' ' + (6 * s) + ' 0" stroke="#2b2722" stroke-width="' + (0.8 * s).toFixed(2) + '" fill="none" stroke-linecap="round"/>';
    return g + '</g>';
  }
  var BILDER = {
    mona: { titel: 'Mona Lisa', w: 92, h: 126, innen: function (w, h) {
      return '<rect width="' + w + '" height="' + h + '" fill="#6f6a43"/>' +
        '<path d="M0 ' + h * 0.42 + ' C' + w * 0.2 + ' ' + h * 0.3 + ' ' + w * 0.35 + ' ' + h * 0.5 + ' ' + w * 0.5 + ' ' + h * 0.38 + ' S' + w * 0.85 + ' ' + h * 0.3 + ' ' + w + ' ' + h * 0.4 + ' V0 H0z" fill="#9aa27a" opacity=".75"/>' +
        '<path d="M' + w * 0.08 + ' ' + h * 0.62 + ' C' + w * 0.2 + ' ' + h * 0.5 + ' ' + w * 0.1 + ' ' + h * 0.44 + ' ' + w * 0.22 + ' ' + h * 0.4 + '" stroke="#c7b27a" stroke-width="1.6" fill="none"/>' +
        '<path d="M' + w * 0.92 + ' ' + h * 0.6 + ' C' + w * 0.8 + ' ' + h * 0.5 + ' ' + w * 0.92 + ' ' + h * 0.46 + ' ' + w * 0.8 + ' ' + h * 0.4 + '" stroke="#5f8a8a" stroke-width="2" fill="none" opacity=".7"/>' +
        '<path d="M' + w * 0.1 + ' ' + h + ' C' + w * 0.15 + ' ' + h * 0.72 + ' ' + w * 0.3 + ' ' + h * 0.66 + ' ' + w * 0.5 + ' ' + h * 0.66 + ' S' + w * 0.85 + ' ' + h * 0.72 + ' ' + w * 0.9 + ' ' + h + 'z" fill="#3a2f22"/>' +
        minicarl(w / 2, h * 0.7, 1.5, { laecheln: true, blick: 0.25 }) +
        '<path d="M' + w * 0.32 + ' ' + h * 0.82 + ' q' + w * 0.18 + ' ' + (-h * 0.05) + ' ' + w * 0.36 + ' 0" stroke="#5a4630" stroke-width="5" stroke-linecap="round" fill="none"/>' +
        '<path d="M' + w * 0.3 + ' ' + h * 0.48 + ' q' + w * 0.2 + ' ' + (-h * 0.06) + ' ' + w * 0.4 + ' 0" stroke="#1d1912" stroke-width=".8" fill="none" opacity=".6"/>';
    } },
    perle: { titel: 'Das Mädchen mit dem Perlenohrring', w: 88, h: 110, innen: function (w, h) {
      return '<rect width="' + w + '" height="' + h + '" fill="#1a1813"/>' +
        '<ellipse cx="' + w * 0.5 + '" cy="' + h * 0.55 + '" rx="' + w * 0.45 + '" ry="' + h * 0.45 + '" fill="#2c2a22" opacity=".8"/>' +
        '<path d="M' + w * 0.18 + ' ' + h + ' C' + w * 0.22 + ' ' + h * 0.8 + ' ' + w * 0.4 + ' ' + h * 0.78 + ' ' + w * 0.55 + ' ' + h * 0.8 + ' S' + w * 0.85 + ' ' + h * 0.88 + ' ' + w * 0.88 + ' ' + h + 'z" fill="#b48b45"/>' +
        minicarl(w * 0.52, h * 0.84, 1.55, { blick: -0.8 }) +
        '<path d="M' + w * 0.29 + ' ' + h * 0.5 + ' C' + w * 0.3 + ' ' + h * 0.32 + ' ' + w * 0.72 + ' ' + h * 0.3 + ' ' + w * 0.76 + ' ' + h * 0.5 + ' C' + w * 0.6 + ' ' + h * 0.44 + ' ' + w * 0.42 + ' ' + h * 0.44 + ' ' + w * 0.29 + ' ' + h * 0.5 + 'z" fill="#3d64a8" stroke="#1d1912" stroke-width=".8"/>' +
        '<path d="M' + w * 0.6 + ' ' + h * 0.34 + ' C' + w * 0.72 + ' ' + h * 0.3 + ' ' + w * 0.86 + ' ' + h * 0.4 + ' ' + w * 0.8 + ' ' + h * 0.62 + ' C' + w * 0.76 + ' ' + h * 0.5 + ' ' + w * 0.7 + ' ' + h * 0.44 + ' ' + w * 0.66 + ' ' + h * 0.42 + 'z" fill="#e3b23c" stroke="#1d1912" stroke-width=".8"/>' +
        '<circle cx="' + w * 0.27 + '" cy="' + h * 0.74 + '" r="3.4" fill="#eef0f2" stroke="#8a8f96" stroke-width=".6"/><circle cx="' + (w * 0.27 - 1) + '" cy="' + (h * 0.74 - 1.2) + '" r="1" fill="#fff"/>' +
        '<path d="M' + w * 0.27 + ' ' + (h * 0.74 - 3.4) + ' v-3" stroke="#8a8f96" stroke-width=".6"/>';
    } },
    welle: { titel: 'Die große Welle vor Kanagawa', w: 150, h: 102, innen: function (w, h) {
      return '<rect width="' + w + '" height="' + h + '" fill="#efe0bd"/>' +
        '<path d="M' + w * 0.6 + ' ' + h * 0.72 + ' L' + w * 0.68 + ' ' + h * 0.6 + ' L' + w * 0.76 + ' ' + h * 0.72 + 'z" fill="#3d5f87"/><path d="M' + w * 0.655 + ' ' + h * 0.625 + ' L' + w * 0.68 + ' ' + h * 0.6 + ' L' + w * 0.705 + ' ' + h * 0.625 + 'z" fill="#fff"/>' +
        '<path d="M0 ' + h + ' V' + h * 0.6 + ' C' + w * 0.12 + ' ' + h * 0.2 + ' ' + w * 0.36 + ' ' + h * 0.08 + ' ' + w * 0.5 + ' ' + h * 0.2 + ' C' + w * 0.58 + ' ' + h * 0.28 + ' ' + w * 0.52 + ' ' + h * 0.42 + ' ' + w * 0.44 + ' ' + h * 0.38 + ' C' + w * 0.4 + ' ' + h * 0.5 + ' ' + w * 0.5 + ' ' + h * 0.7 + ' ' + w * 0.62 + ' ' + h * 0.78 + ' C' + w * 0.8 + ' ' + h * 0.86 + ' ' + w * 0.9 + ' ' + h * 0.8 + ' ' + w + ' ' + h * 0.76 + ' V' + h + 'z" fill="#1e3f6e"/>' +
        '<path d="M' + w * 0.06 + ' ' + h * 0.5 + ' C' + w * 0.18 + ' ' + h * 0.24 + ' ' + w * 0.36 + ' ' + h * 0.14 + ' ' + w * 0.48 + ' ' + h * 0.22 + '" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        [0, 1, 2, 3, 4].map(function (k) { var x = w * (0.4 + k * 0.03), y = h * (0.2 + (k % 2) * 0.04); return '<circle cx="' + x + '" cy="' + y + '" r="2.4" fill="#fff"/>'; }).join('') +
        '<path d="M' + w * 0.12 + ' ' + h * 0.7 + ' C' + w * 0.2 + ' ' + h * 0.5 + ' ' + w * 0.3 + ' ' + h * 0.5 + ' ' + w * 0.36 + ' ' + h * 0.62 + '" stroke="#8fb3d4" stroke-width="1.6" fill="none"/>' +
        '<path d="M' + w * 0.24 + ' ' + h * 0.82 + ' q' + w * 0.12 + ' ' + h * 0.06 + ' ' + w * 0.24 + ' 0 l-4 6 h-' + (w * 0.24 - 8) + 'z" fill="#c9a774" stroke="#2b2722" stroke-width=".8"/>' +
        minicarl(w * 0.36, h * 0.82, 0.85, { blick: 0.6 });
    } },
    stern: { titel: 'Die Sternennacht', w: 150, h: 102, innen: function (w, h) {
      var o = '<rect width="' + w + '" height="' + h + '" fill="#1f3a78"/>' +
        '<path d="M' + w * 0.1 + ' ' + h * 0.4 + ' C' + w * 0.3 + ' ' + h * 0.24 + ' ' + w * 0.5 + ' ' + h * 0.56 + ' ' + w * 0.7 + ' ' + h * 0.36 + ' S' + w * 0.9 + ' ' + h * 0.3 + ' ' + w + ' ' + h * 0.38 + '" stroke="#8fb3e8" stroke-width="3" fill="none"/>' +
        '<path d="M' + w * 0.3 + ' ' + h * 0.36 + ' a9 7 0 1 1 14 4" stroke="#cfe0f5" stroke-width="2" fill="none"/>' +
        '<circle cx="' + w * 0.86 + '" cy="' + h * 0.18 + '" r="9" fill="#f2c94c"/><circle cx="' + w * 0.86 + '" cy="' + h * 0.18 + '" r="13" fill="none" stroke="#f2c94c" stroke-width="1.6" opacity=".6"/>';
      [[0.2, 0.14], [0.42, 0.12], [0.6, 0.2], [0.72, 0.1], [0.12, 0.26], [0.52, 0.32]].forEach(function (p) { o += '<circle cx="' + w * p[0] + '" cy="' + h * p[1] + '" r="3.2" fill="#f7e27a"/><circle cx="' + w * p[0] + '" cy="' + h * p[1] + '" r="6" fill="none" stroke="#f7e27a" stroke-width="1" opacity=".55"/>'; });
      o += '<path d="M0 ' + h + ' V' + h * 0.72 + ' C' + w * 0.3 + ' ' + h * 0.64 + ' ' + w * 0.6 + ' ' + h * 0.74 + ' ' + w + ' ' + h * 0.66 + ' V' + h + 'z" fill="#2c3f5c"/>' +
        [0.4, 0.5, 0.6, 0.7].map(function (k, i) { return '<rect x="' + w * k + '" y="' + (h * 0.8 - i % 2 * 3) + '" width="9" height="7" fill="#46505e" stroke="#1a1f29" stroke-width=".6"/><rect x="' + (w * k + 3) + '" y="' + (h * 0.8 - i % 2 * 3 + 2) + '" width="2.6" height="2.6" fill="#f2c94c"/>'; }).join('') +
        '<path d="M' + w * 0.12 + ' ' + h + ' C' + w * 0.08 + ' ' + h * 0.6 + ' ' + w * 0.16 + ' ' + h * 0.3 + ' ' + w * 0.18 + ' ' + h * 0.12 + ' C' + w * 0.22 + ' ' + h * 0.4 + ' ' + w * 0.26 + ' ' + h * 0.7 + ' ' + w * 0.24 + ' ' + h + 'z" fill="#1b2a1c"/>' +
        minicarl(w * 0.84, h * 0.86, 0.75, { blick: -0.5 });
      return o;
    } },
    wanderer: { titel: 'Der Wanderer über dem Nebelmeer', w: 92, h: 120, innen: function (w, h) {
      return '<rect width="' + w + '" height="' + h + '" fill="#cfd6d8"/>' +
        '<path d="M0 ' + h * 0.5 + ' L' + w * 0.2 + ' ' + h * 0.38 + ' L' + w * 0.34 + ' ' + h * 0.46 + ' L' + w * 0.56 + ' ' + h * 0.32 + ' L' + w * 0.8 + ' ' + h * 0.44 + ' L' + w + ' ' + h * 0.36 + ' V' + h * 0.62 + ' H0z" fill="#9aa7ae"/>' +
        '<path d="M0 ' + h * 0.6 + ' C' + w * 0.2 + ' ' + h * 0.54 + ' ' + w * 0.4 + ' ' + h * 0.66 + ' ' + w * 0.6 + ' ' + h * 0.58 + ' S' + w * 0.9 + ' ' + h * 0.62 + ' ' + w + ' ' + h * 0.56 + ' V' + h * 0.78 + ' H0z" fill="#eef1f0"/>' +
        '<path d="M' + w * 0.2 + ' ' + h + ' L' + w * 0.36 + ' ' + h * 0.8 + ' L' + w * 0.5 + ' ' + h * 0.76 + ' L' + w * 0.66 + ' ' + h * 0.82 + ' L' + w * 0.82 + ' ' + h + 'z" fill="#2e2a26"/>' +
        minicarl(w * 0.5, h * 0.79, 1.35, { ohneGesicht: true, koerper: '#ebe6da' }) +
        '<path d="M' + (w * 0.5 - 20) + ' ' + h * 0.79 + ' h40" stroke="#2b2722" stroke-width="6" opacity=".9"/>' +
        '<path d="M' + (w * 0.5 + 14) + ' ' + h * 0.76 + ' l10 18" stroke="#5a4630" stroke-width="1.6"/>';
    } }
  };
  var BILD_SATZ = {
    mona: 'Mona Lisa, Leonardo da Vinci, um 1503 bis 1519. Er hat sehr lange an ihr gemalt. Ich lächle seitdem etwas rätselhafter.',
    perle: 'Das Mädchen mit dem Perlenohrring, Johannes Vermeer, um 1665. Ich habe keine Ohren. Die Perle hält trotzdem.',
    welle: 'Die große Welle vor Kanagawa, Katsushika Hokusai, um 1830 bis 1832. Ein Holzschnitt. Ich bin sehr froh über mein Boot.',
    stern: 'Die Sternennacht, Vincent van Gogh, 1889. Er hat den Himmel gemalt, wie er sich anfühlt.',
    wanderer: 'Der Wanderer über dem Nebelmeer, Caspar David Friedrich, um 1818. Von hinten sehe ich nachdenklicher aus. Glaube ich.'
  };
  function gerahmt(id, X, Y, sk) {
    var b = BILDER[id], w = b.w, h = b.h, r = 7, x = 0, y = 0; sk = sk || 1;
    var inn = '<rect x="' + (x - r - 2) + '" y="' + (y - r - 2) + '" width="' + (w + 2 * r + 4) + '" height="' + (h + 2 * r + 4) + '" fill="#2b2722" opacity=".22" transform="translate(4 5)"/>' +
      '<rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + (w + 2 * r) + '" height="' + (h + 2 * r) + '" rx="1.5" fill="url(#c6w-rahmen)" stroke="#5a3d17" stroke-width="1.4"/>' +
      '<rect x="' + (x - 2) + '" y="' + (y - 2) + '" width="' + (w + 4) + '" height="' + (h + 4) + '" fill="none" stroke="#7a5a24" stroke-width="1.2"/>' +
      '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" overflow="hidden">' + b.innen(w, h) +
      '<rect width="' + w + '" height="' + h + '" fill="url(#c6w-bildlicht)"/></svg>' +
      '<rect x="' + (x + w / 2 - 14) + '" y="' + (y + h + r + 3) + '" width="28" height="6" rx="1" fill="url(#c6w-rahmen)" stroke="#5a3d17" stroke-width=".7"/>';
    return '<g class="c6w-ding c6w-genie c6w-gemaelde" data-id="ding:bild-' + id + '" tabindex="0" role="button" aria-label="' + esc(b.titel) + ', mit Carl">' +
      '<g transform="translate(' + X + ' ' + Y + ') scale(' + sk + ')"><rect x="' + (x - r - 4) + '" y="' + (y - r - 4) + '" width="' + (w + 2 * r + 8) + '" height="' + (h + 2 * r + 18) + '" fill="transparent"/><g class="c6w-ding-innen">' + inn + '</g></g></g>';
  }
  // Wandlampe aus Messing mit warmem Schein auf der Wand
  function wandlampe(x, y) {
    return '<g aria-hidden="true" class="c6w-wandlampe"><ellipse cx="' + x + '" cy="' + (y + 40) + '" rx="90" ry="80" fill="url(#c6w-lampenschein)"/>' +
      '<rect x="' + (x - 4) + '" y="' + (y - 14) + '" width="8" height="18" rx="2" fill="#9a7434" stroke="#2b2722" stroke-width="1"/>' +
      '<path d="M' + x + ' ' + (y - 6) + ' q14 -2 18 10" stroke="#9a7434" stroke-width="2.4" fill="none"/>' +
      '<path d="M' + (x + 8) + ' ' + (y + 4) + ' h20 l5 12 h-30z" fill="#2f5244" stroke="#2b2722" stroke-width="1.2"/>' +
      '<ellipse cx="' + (x + 18) + '" cy="' + (y + 16) + '" rx="14" ry="2.4" fill="#ffe7a8"/></g>';
  }
  var GALERIE = {
    quer: { lampen: [[812, 30], [1092, 34]], bilder: [['mona', 774, 62], ['wanderer', 774, 236], ['welle', 1032, 76], ['stern', 1032, 214]] },
    hoch: { lampen: [], bilder: [['mona', 511, 322, 0.8], ['perle', 513, 470, 0.8]] }
  };
  function galerieSVG(art) {
    var g = GALERIE[art]; if (!g) return '';
    return g.lampen.map(function (l) { return wandlampe(l[0], l[1]); }).join('') + g.bilder.map(function (b) { return gerahmt(b[0], b[1], b[2], b[3]); }).join('');
  }

  // Zwei Aufstellungen: quer (Computer) und hochkant (iPhone)
  var AUF = {
    quer: {
      w: 1200, h: 700, boden: 640, carl: [800, 694], carlH: 262, blick: [0.95, 0.15],
      regal: { x: 40, y: 50, w: 700, h: 570 }, fenster: [905, 96, 100, 250], skizzen: [772, 110],
      tuer: { ziel: [628, 632], skala: 0.6 }, faden: 'M640 640 C 660 662, 700 650, 730 672 S 780 700, 806 690',
      tisch: [876, 580, 318, 110], buch: [1010, 578, 190], tee: [1136, 578], tinte: [904, 578], lampe: [1186, 580, 1136, 352, true],
      schein: [1030, 500, 260, 150], teppich: [900, 690, 300, 24]
    },
    hoch: {
      w: 600, h: 1000, boden: 624, carl: [486, 986], carlH: 236, blick: [-0.95, 0.25],
      regal: { x: 22, y: 56, w: 470, h: 540 }, fenster: null, skizzen: [512, 290],
      tuer: { ziel: [380, 610], skala: 0.48 }, faden: 'M392 618 C 400 680, 450 700, 470 760 S 520 880, 500 968',
      tisch: [20, 880, 372, 112], buch: [206, 876, 172], tee: [334, 876], tinte: [92, 876], lampe: [44, 878, 72, 742, false],
      schein: [206, 820, 230, 120], teppich: [300, 934, 292, 60]
    }
  };

  C6.raum({
    id: 'bibliothek', name: 'Bibliothek', reihe: 2, symbol: SYMBOL,
    bauen: function (buehne) {
      buehne.classList.add('c6w-bibliothek');
      buehne.innerHTML = '<div class="c6w-schieber"><div class="c6w-raum">' +
        '<svg class="c6w-szene" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMax meet" role="group" aria-label="Carls Bibliothek"></svg>' +
        '<div class="c6w-carl-platz"></div></div></div>' +
        '<div class="c6w-buch" role="dialog" aria-modal="false" aria-label="Aufgeschlagenes Buch" hidden><div class="c6w-buch-seiten"></div></div>';
      var schieber = buehne.querySelector('.c6w-schieber');
      var raum = buehne.querySelector('.c6w-raum');
      var svg = buehne.querySelector('.c6w-szene');
      var platz = buehne.querySelector('.c6w-carl-platz');
      var buch = buehne.querySelector('.c6w-buch');
      var seiten = buch.querySelector('.c6w-buch-seiten');
      var ctl = null, imRundgang = false, offen = null, vorher = null, auf = AUF.quer, aufName = '';

      svg.innerHTML = DEFS + '<g class="c6w-g-wand" data-tiefe="fern"></g><g class="c6w-g-raum" data-tiefe="mitte"></g><g class="c6w-g-regal" data-tiefe="mitte"></g><g class="c6w-g-ecke" data-tiefe="nah"></g>';
      var gWand = svg.querySelector('.c6w-g-wand'), gRaum = svg.querySelector('.c6w-g-raum'), gRegal = svg.querySelector('.c6w-g-regal'), gEcke = svg.querySelector('.c6w-g-ecke');
      platz.setAttribute('data-tiefe', 'mitte');

      function zeichneRaum() {
        var a = auf, W = a.w;
        gWand.innerHTML =
          '<rect x="-1400" y="-2000" width="' + (W + 2800) + '" height="' + (2000 + a.boden) + '" fill="url(#c6w-wand)"/>' +
          '<rect x="-1400" y="' + (a.boden - 64) + '" width="' + (W + 2800) + '" height="64" fill="#c4ab82" opacity=".55"/>' +
          '<path d="M-1400 ' + (a.boden - 64) + ' H' + (W + 1400) + '" stroke="#a88c62" stroke-width="2"/>' +
          '<ellipse cx="' + a.schein[0] + '" cy="' + a.schein[1] + '" rx="' + (a.schein[2] * 1.6) + '" ry="' + (a.schein[3] * 1.8) + '" fill="url(#c6w-glanz)"/>' +
          (a.fenster ? fenster(a.fenster[0], a.fenster[1], a.fenster[2], a.fenster[3]) : '') +
          galerieSVG(aufName);
        gRaum.innerHTML =
          '<rect x="-1400" y="' + a.boden + '" width="' + (W + 2800) + '" height="1400" fill="url(#c6w-boden)"/>' +
          '<path d="M-1400 ' + a.boden + ' H' + (W + 1400) + '" stroke="' + T + '" stroke-width="2.5"/>' +
          '<path d="M-1400 ' + (a.boden + 40) + ' H' + (W + 1400) + ' M-1400 ' + (a.boden + 96) + ' H' + (W + 1400) + ' M-1400 ' + (a.boden + 170) + ' H' + (W + 1400) + '" stroke="#3e2a1d" stroke-width="1.4" opacity=".6"/>' +
          teppich(a.teppich[0], a.teppich[1], a.teppich[2], a.teppich[3]) +
          '<path class="c6w-rfaden" d="' + a.faden + '" fill="none" stroke="#d62a26" stroke-width="2.6" stroke-linecap="round"/>';
      }
      function zeichneRegal() { gRegal.innerHTML = wandSVG(auf.regal, meister()); }
      function zeichneEcke() {
        var a = auf, dam = damals();
        gEcke.innerHTML = tisch(a.tisch[0], a.tisch[1], a.tisch[2], a.tisch[3]) +
          lampe(a.lampe[0], a.lampe[1], a.lampe[2], a.lampe[3], a.lampe[4]) +
          tinte(a.tinte[0], a.tinte[1]) +
          freundschaftsbuch(a.buch[0], a.buch[1], a.buch[2], !!(dam && dam.passt)) +
          tee(a.tee[0], a.tee[1]) +
          '<ellipse class="c6w-schein" cx="' + a.schein[0] + '" cy="' + a.schein[1] + '" rx="' + a.schein[2] + '" ry="' + a.schein[3] + '" fill="url(#c6w-schein)" pointer-events="none"/>';
      }
      function stelle() {
        var neu = buehne.clientWidth < 600 ? 'hoch' : 'quer';
        if (neu === aufName) return;
        aufName = neu; auf = AUF[neu];
        LICHT = { x: auf.lampe[2], y: auf.lampe[3] };
        svg.setAttribute('viewBox', '0 0 ' + auf.w + ' ' + auf.h);
        zeichneRaum(); zeichneRegal(); zeichneEcke();
      }
      function auffrischen() { if (!aufName) return; zeichneRegal(); zeichneEcke(); }
      // Das eine Licht des Raums für den Kern (Carl liest es für seinen Schatten)
      function lichtSetzen() {
        if (!C6.lichtquelle || !C6.lichtquelle.setze) return;
        var W = buehne.clientWidth, Hh = buehne.clientHeight; if (!W || !Hh) return;
        try { C6.lichtquelle.setze('bibliothek', { x: (ox + LICHT.x * skala) / W, y: (oy + LICHT.y * skala) / Hh, art: 'lampe', warm: 0.9, staerke: 0.85, hoehe: 0.5 }); } catch (e) {}
      }

      // ——— Maße ———
      var skala = 1, ox = 0, oy = 0;
      function groesse() {
        stelle();
        var W = buehne.clientWidth, Hh = buehne.clientHeight;
        var unten = parseFloat(getComputedStyle(buehne).getPropertyValue('--c6-unten')) || 0;
        var sicht = Math.max(200, Hh - unten);
        schieber.style.height = sicht + 'px';
        var hoch = sicht;
        raum.style.width = W + 'px'; raum.style.height = hoch + 'px';
        skala = Math.min(W / auf.w, hoch / auf.h);
        ox = (W - auf.w * skala) / 2; oy = hoch - auf.h * skala;
        platz.style.left = (ox + auf.carl[0] * skala) + 'px';
        platz.style.top = (oy + auf.carl[1] * skala) + 'px';
        if (ctl && ctl.groesse) ctl.groesse(Math.round(auf.carlH * skala));
        lichtSetzen();
        liest();
      }
      function carlMalen() {
        if (ctl || !C6.figur || !C6.figur.male) return;
        try {
          ctl = C6.figur.male(platz, { groesse: Math.round(auf.carlH * skala), stimmung: 'ruhig', teile: 5 });
          if (C6.laden && C6.laden.an && ctl.kleid) ctl.kleid(C6.laden.an());
          if (typeof ctl.gewohnheiten === 'function') ctl.gewohnheiten(['lesen', 'umsehen']);
        } catch (e) { ctl = null; }
        liest();
      }
      // ——— Leises Eigenleben: die Sanduhr dreht sich alle paar Minuten, eine Seite flattert bei Wartezeit ———
      var sandUhr = null, seiteLaeuft = false;
      function sanduhrDrehen() {
        if (C6.jetzt !== 'bibliothek' || C6.ruhig || document.hidden) return;
        var el = svg.querySelector('[data-id="ding:sanduhr"]'); if (!el || el.classList.contains('c6w-tipp')) return;
        el.classList.add('c6m-dreht'); setTimeout(function () { el.classList.remove('c6m-dreht'); }, 1400);
        if (ctl && ctl.schau) { try { var r = el.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height / 2); setTimeout(function () { liest(); }, 1800); } catch (e) {} }
      }
      function seiteFlattert() {
        if (seiteLaeuft || C6.jetzt !== 'bibliothek' || offen || gehtDurch || document.hidden) return;
        var sg = svg.querySelector('.c6m-seite'); if (!sg) return;
        seiteLaeuft = true;
        var fb = svg.querySelector('.c6w-fbuch');
        if (ctl && ctl.schau && fb) { try { var r = fb.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height * 0.4); } catch (e) {} }
        if (C6.ruhig || !sg.animate) { sg.style.opacity = '1'; setTimeout(function () { sg.style.opacity = ''; seiteLaeuft = false; liest(); }, 1600); return; }
        var a = sg.animate([
          { transform: 'translateY(0) rotate(0)', opacity: 0 },
          { transform: 'translateY(-14px) rotate(-6deg)', opacity: 1, offset: 0.3 },
          { transform: 'translateY(-22px) rotate(4deg) scaleX(.6)', opacity: 1, offset: 0.55 },
          { transform: 'translateY(-10px) rotate(-2deg) scaleX(1)', opacity: 1, offset: 0.8 },
          { transform: 'translateY(0) rotate(0)', opacity: 0 }
        ], { duration: 2200, easing: 'cubic-bezier(.35,.1,.3,1)' });
        a.onfinish = function () { seiteLaeuft = false; liest(); };
      }
      function pendelSchwingt() {
        var el = svg.querySelector('[data-id="ding:pendel"]'); if (!el || C6.ruhig || C6.jetzt !== 'bibliothek') return;
        el.classList.remove('c6m-schwingt'); void el.getBoundingClientRect(); el.classList.add('c6m-schwingt');
        setTimeout(function () { el.classList.remove('c6m-schwingt'); }, 5200);
      }
      if (C6.bus) {
        C6.bus.on('warte', function (d) {
          if (!d || C6.jetzt !== 'bibliothek') return;
          if (d.stufe === 1) pendelSchwingt();
          if (d.stufe === 2) seiteFlattert();
        });
        C6.bus.on('raum', function (id) { if (id === 'bibliothek') setTimeout(pendelSchwingt, 900); });
      }
      // Carl liest mit: Blick aufs Buch, solange keins aufgeschlagen ist
      function liest() { if (ctl && ctl.blick && !offen) try { ctl.blick(auf.blick[0], auf.blick[1]); } catch (e) {} }
      function stimmung(s) { if (ctl && ctl.stimmung) try { ctl.stimmung(s); } catch (e) {} }

      // ——— Buch öffnen ———
      function buchInfo(id) {
        var b = KAPITEL.filter(function (x) { return x.id === id; })[0];
        if (b) return { titel: b.titel, farbe: '#b9837a' };
        if (id === 'text') return { titel: 'Über mich', farbe: '#5c2f27' };
        if (id === 'lexikon' || id.indexOf('mappe:') === 0) return { titel: 'Das Lexikon', farbe: '#1e2e52' };
        if (id === 'atlas') return { titel: 'Unser Freundschaftsbuch', farbe: '#b9837a' };
        if (id === 'meister' || id === 'meister-neu') return { titel: 'Meister-Regal', farbe: '#2e3b52' };
        if (id === 'grund' || id === 'carlyle') return { titel: 'Alte Bücher über Meister', farbe: '#5c2f27' };
        if (id.indexOf('quelle:') === 0) { var g = GRUND.filter(function (x) { return 'quelle:' + x.id === id; })[0]; return { titel: g ? g.titel : 'Buch', farbe: g ? g.farbe : '#5c2f27' }; }
        if (id.indexOf('meister:') === 0) { var m = findeMeister(id.slice(8)); return { titel: m ? (m.name || 'Meister') : 'Meister', farbe: m ? regalVon(m.regal).farbe : '#2e3b52' }; }
        return { titel: 'Über mich', farbe: '#5c2f27' };
      }
      function findeMeister(mid) { return meister().filter(function (m) { return m.id === mid; })[0]; }

      function aufschlagen(id, still) {
        if (id === 'lexikon' || id.indexOf('mappe:') === 0) { zuBuch(id); return; }
        if (id === 'carlyle') id = 'quelle:carlyle';
        if (id === 'meister-neu' && meister().length >= MAX_MEISTER) id = 'meister';
        var info = buchInfo(id);
        var neu = !offen;
        offen = id;
        if (neu || !vorher) {
          vorher = { du: kopie(du()), meister: kopie(S().meister || []) };
          aendere(function (s) { s.buchVorher = vorher; });
        }
        seiten.innerHTML = '<button class="c6w-zu" aria-label="Buch schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>' +
          '<div class="c6w-doppel"><div class="c6w-links"><p class="c6w-kapitel">' + esc(info.titel) + '</p><p class="c6w-flues" aria-live="polite"></p><div class="c6w-links-inhalt"></div></div>' +
          '<div class="c6w-rechts"><div class="c6w-seite"></div><p class="c6w-buch-fuss"><button class="c6w-knopf c6w-leicht c6w-zurueck" hidden>Rückgängig</button></p></div></div>';
        seiten.querySelector('.c6w-zu').onclick = zuklappen;
        seiten.querySelector('.c6w-zurueck').onclick = rueckgaengig;
        var links = seiten.querySelector('.c6w-links-inhalt'), s = seiten.querySelector('.c6w-seite');
        var fn = SEITE[id] || (id.indexOf('meister:') === 0 ? SEITE.meisterKarte : id.indexOf('quelle:') === 0 ? SEITE.quelle : id.indexOf('mappe:') === 0 ? SEITE.mappe : SEITE.text);
        fn(s, links, id);
        if (geaendertSeit()) zeigeZurueck();
        buch.style.setProperty('--buch', info.farbe);
        buch.hidden = false;
        buehne.classList.add('c6w-liest');
        seiten.scrollTop = 0;
        requestAnimationFrame(function () { buch.classList.add('c6w-an'); });
        if (ctl && ctl.blick) try { ctl.blick(auf === AUF.hoch ? 0 : -0.8, -0.4); } catch (e) {}
        if (neu && !still) stimmung('staunt');
        setTimeout(function () { var f = s.querySelector('[data-fokus]'); if (f && C6.geraet === 'computer') f.focus(); }, 380);
      }
      function zuklappen() {
        offen = null; vorher = null;
        buch.classList.remove('c6w-an');
        buehne.classList.remove('c6w-liest');
        setTimeout(function () { if (!buch.classList.contains('c6w-an')) buch.hidden = true; }, 340);
        stimmung('ruhig'); liest();
        auffrischen();
      }
      function geaendertSeit() { return vorher && (JSON.stringify(vorher.du) !== JSON.stringify(du()) || JSON.stringify(vorher.meister) !== JSON.stringify(S().meister || [])); }
      function zeigeZurueck() { var r = seiten.querySelector('.c6w-zurueck'); if (r) r.hidden = false; }
      function geaendert() { zeigeZurueck(); }
      function rueckgaengig() {
        var v = vorher; if (!v) return;
        aendere(function (s) {
          s.du = s.du || {};
          var d = s.du;
          Object.keys(d).forEach(function (k) { if (!(k in v.du)) delete d[k]; });
          Object.keys(v.du || {}).forEach(function (k) { d[k] = kopie(v.du[k]); });
          s.meister = kopie(v.meister || []);
        });
        var id = offen;
        if (id && id.indexOf('meister:') === 0 && !findeMeister(id.slice(8))) id = 'meister';
        vorher = null; offen = null;
        aufschlagen(id, true);
        auffrischen();
        flues(satz('rueckgaengig', 'Zurückgelegt. Es steht wieder wie vorher.'));
      }


      // ——— Die versteckte Tür ———
      var gehtDurch = false, tuerZiel = null;
      function hinter() { var z = Object.assign({ durch: true }, tuerZiel || {}); tuerZiel = null; return z; }
      function tuerZu() {
        gehtDurch = false;
        svg.classList.remove('c6w-auf', 'c6w-zieht');
        platz.style.opacity = '';
        if (ctl && ctl.geh) try { ctl.geh(0, 0, { y: 0, skala: 1 }); } catch (e) {}
      }
      function durchDieTuer() {
        if (gehtDurch) return;
        if (offen) zuklappen();
        gehtDurch = true;
        svg.classList.add('c6w-zieht');
        if (!(S().lesesaal || {}).tuerAuf) { aendere(function (s) { s.lesesaal = s.lesesaal || {}; s.lesesaal.tuerAuf = Date.now(); }); var lx = svg.querySelector('.c6w-lex-schimmer'); if (lx) lx.classList.remove('c6w-lex-schimmer'); }
        setTimeout(function () { if (gehtDurch) svg.classList.add('c6w-auf'); }, C6.ruhig ? 0 : 420);
        try { C6.schweig && C6.schweig(); } catch (e) {}
        var ziel = auf.tuer.ziel, ruhig = C6.ruhig || !ctl || !ctl.geh;
        var dx = (ziel[0] - auf.carl[0]) * skala, dy = (ziel[1] - auf.carl[1]) * skala;
        setTimeout(function () {
          if (C6.jetzt !== 'bibliothek') return;
          if (ruhig) { C6.geh('lesesaal', hinter()); return; }
          try { ctl.stimmung('froh'); } catch (e) {}
          try { ctl.geh(dx, 1300, { y: dy, skala: auf.tuer.skala }); } catch (e) {}
          platz.style.transition = 'opacity .5s ease 1s';
          platz.style.opacity = '0';
          setTimeout(function () { platz.style.transition = ''; if (C6.jetzt === 'bibliothek' && gehtDurch) C6.geh('lesesaal', hinter()); }, 1600);
        }, ruhig ? 250 : 1250);
      }
      // Das Meister-Regal wohnt hinter der Tür, im Lesesaal (ein Regal, nicht zwei)
      function zuDenMeistern(id) { if (offen) zuklappen(); tuerZiel = { meister: id.indexOf('meister:') === 0 ? id.slice(8) : true }; if (C6.jetzt === 'bibliothek') durchDieTuer(); else C6.geh('lesesaal', tuerZiel); }
      function atlasAuf() {
        if (C6.atlas && typeof C6.atlas.oeffne === 'function') { try { if (offen) zuklappen(); C6.atlas.oeffne(); return; } catch (e) {} }
        aufschlagen('atlas');
      }

      // ——— Felder ———
      function feld(el, lab, key, lang, platzhalter) {
        var id = 'c6w-b-' + key;
        var wert = du()[key] || '';
        el.insertAdjacentHTML('beforeend', '<label class="c6w-lab" for="' + id + '">' + esc(lab) + '</label>' +
          (lang ? '<textarea id="' + id + '" data-fokus class="c6w-feld c6w-hand" rows="2" maxlength="300"' + (platzhalter ? ' placeholder="' + esc(platzhalter) + '"' : '') + '>' + esc(wert) + '</textarea>'
            : '<input id="' + id + '" data-fokus class="c6w-feld c6w-hand" maxlength="60" value="' + esc(wert) + '"' + (platzhalter ? ' placeholder="' + esc(platzhalter) + '"' : '') + '>'));
        var f = el.querySelector('#' + id);
        f.oninput = function () { var v = f.value; setzeDu(function (d) { d[key] = v; }); geaendert(); };
        return f;
      }
      function mFeld(el, m, lab, key, lang, platzhalter) {
        var id = 'c6w-m-' + key;
        var wert = m[key] || '';
        el.insertAdjacentHTML('beforeend', '<label class="c6w-lab" for="' + id + '">' + esc(lab) + '</label>' +
          (lang ? '<textarea id="' + id + '" class="c6w-feld c6w-hand" rows="2" maxlength="400"' + (platzhalter ? ' placeholder="' + esc(platzhalter) + '"' : '') + '>' + esc(wert) + '</textarea>'
            : '<input id="' + id + '" class="c6w-feld c6w-hand" maxlength="' + (key === 'name' ? 40 : 160) + '" value="' + esc(wert) + '"' + (platzhalter ? ' placeholder="' + esc(platzhalter) + '"' : '') + '>'));
        var f = el.querySelector('#' + id);
        f.oninput = function () {
          var v = f.value;
          setzeMeister(function (a) { a.forEach(function (x, i) { if (x.id === m.id) { a[i] = Object.assign({}, x); a[i][key] = v; } }); });
          geaendert();
          if (key === 'name') { var k = seiten.querySelector('.c6w-kapitel'); if (k) k.textContent = v || 'Meister'; }
          if (key === 'zitat' || key === 'quelle') zitatHinweis();
        };
        return f;
      }
      var zitatHinweis = function () {};
      function listeFeld(el, key, leer) {
        var box = document.createElement('div'); box.className = 'c6w-liste'; el.appendChild(box);
        function male() {
          var a = (du()[key] || []).slice();
          box.innerHTML = (a.length ? '' : '<p class="c6w-leise">' + esc(leer) + '</p>') + a.map(function (t, i) {
            return '<div class="c6w-zeile"><input class="c6w-feld c6w-hand" data-i="' + i + '" maxlength="120" value="' + esc(t) + '" aria-label="Eintrag ' + (i + 1) + '"><button class="c6w-weg" data-i="' + i + '" aria-label="Streichen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></div>';
          }).join('') + '<button class="c6w-knopf c6w-dazu">Noch etwas</button>';
          [].forEach.call(box.querySelectorAll('input'), function (f) {
            f.oninput = function () { var v = f.value; setzeDu(function (d) { d[key] = (d[key] || []).slice(); d[key][+f.dataset.i] = v; }); geaendert(); };
          });
          [].forEach.call(box.querySelectorAll('.c6w-weg'), function (b) {
            b.onclick = function () { setzeDu(function (d) { d[key] = (d[key] || []).filter(function (_, i) { return i !== +b.dataset.i; }); }); geaendert(); male(); };
          });
          box.querySelector('.c6w-dazu').onclick = function () {
            setzeDu(function (d) { d[key] = (d[key] || []).concat(['']); }); geaendert(); male();
            var fs = box.querySelectorAll('input'); if (fs.length) fs[fs.length - 1].focus();
          };
        }
        male();
      }
      function carlSatz(links, t) { links.insertAdjacentHTML('beforeend', '<p class="c6w-satz">' + esc(t) + '</p>'); }
      // Carl flüstert im Buch (statt einer Blase über den Seiten)
      function flues(t) {
        var p = seiten.querySelector('.c6w-flues'); if (!p) return;
        p.textContent = t; p.classList.remove('c6w-flues-an'); void p.offsetWidth; p.classList.add('c6w-flues-an');
      }
      function zierde(links) { links.insertAdjacentHTML('beforeend', '<span class="c6w-zier" aria-hidden="true"></span>'); }

      function neuerMeister(vorlage) {
        var m = Object.assign({ id: 'm' + Date.now().toString(36), name: '', regal: 'lehre', zieht: '', haltung: '', zitat: '', quelle: '', du: '', ts: Date.now() }, vorlage || {});
        setzeMeister(function (a) { if (a.length < MAX_MEISTER) a.push(m); });
        geaendert();
        return m;
      }
      function regalKnoepfe(el, wahl, onWahl) {
        el.insertAdjacentHTML('beforeend', '<p class="c6w-lab">Welches Regal</p><div class="c6w-arten c6w-regale" role="radiogroup" aria-label="Regal">' +
          REGALE.map(function (r) { return '<button type="button" role="radio" data-r="' + r.id + '" aria-checked="' + (r.id === wahl) + '"><i style="background:' + r.farbe + '"></i>' + r.name + '</button>'; }).join('') + '</div>');
        var knoepfe = el.querySelectorAll('.c6w-regale [role=radio]');
        [].forEach.call(knoepfe, function (b) {
          b.onclick = function () {
            [].forEach.call(knoepfe, function (x) { x.setAttribute('aria-checked', x === b); });
            onWahl(b.dataset.r);
          };
        });
      }

      var SEITE = {
        du: function (el) { maleKapitel('du', el, { zurueck: false, geaendert: geaendert, zu: zuklappen }); },
        baut: function (el) { maleKapitel('baut', el, { zurueck: false, geaendert: geaendert, zu: zuklappen }); },
        tun: function (el) { maleKapitel('tun', el, { zurueck: false, geaendert: geaendert, zu: zuklappen }); },
        nie: function (el) { maleKapitel('nie', el, { zurueck: false, geaendert: geaendert, zu: zuklappen }); },
        ton: function (el) { maleKapitel('ton', el, { zurueck: false, geaendert: geaendert, zu: zuklappen }); },
        damals: function (el) { maleKapitel('damals', el, { zurueck: false, geaendert: geaendert, zu: zuklappen }); stimmung('froh'); },
        begleiter: function (el) { maleKapitel('begleiter', el, { zurueck: false, geaendert: geaendert, zu: zuklappen }); },
        text: function (el, links) {
          var d = du(), g = C6.strings.gewohnheiten(), m = meister();
          function abschnitt(t, inhalt, leer) { return '<section class="c6w-abschnitt"><h3>' + esc(t) + '</h3>' + (inhalt || '<p class="c6w-leise">' + esc(leer || 'Noch leer.') + '</p>') + '</section>'; }
          function hand(t) { return t ? '<p class="c6w-handzeile">' + esc(t) + '</p>' : ''; }
          function liste(a) { a = (a || []).filter(function (x) { return String(x || '').trim(); }); return a.length ? '<ul class="c6w-handliste">' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : ''; }
          links.innerHTML = '<p class="c6w-name">' + esc(d.name || 'Noch ohne Namen') + '</p>' + (d.carlName && d.carlName !== 'Carl' ? '<p class="c6w-leise">Du nennst mich ' + esc(d.carlName) + '.</p>' : '') + hand(d.arbeit) + zierHTML() +
            abschnitt('Woran du baust', hand(d.baut)) + abschnitt('Dein Ton', hand(d.ton));
          el.innerHTML = abschnitt('Was ich tun soll', liste(d.tun)) + abschnitt('Was ich nie tun soll', liste(d.nie)) +
            abschnitt('Begleiter', liste(g.map(function (s) { return s.titel; })), 'Noch keine Gewohnheit.') +
            abschnitt('Meister', liste(m.map(function (x) { return x.name; })), 'Noch steht keiner im Regal.') +
            '<button class="c6w-knopf c6w-kopie">Als Text kopieren</button>';
          el.querySelector('.c6w-kopie').onclick = function () {
            var k = this;
            try { navigator.clipboard.writeText(markdown()).then(function () { k.textContent = 'Kopiert'; }, function () { k.textContent = 'Kopieren ging nicht'; }); } catch (e) { k.textContent = 'Kopieren ging nicht'; }
          };
        },
        meister: function (el, links) {
          var m = meister();
          carlSatz(links, 'Stell Menschen hinein, von denen du lernen willst. Berühmt oder nah. Drei bis zehn.'); zierde(links);
          links.insertAdjacentHTML('beforeend', '<p class="c6w-leise">Bewundern ist eine Landkarte, kein Ziel.</p>');
          el.innerHTML = (m.length ? '<ul class="c6w-mliste">' + m.map(function (x) {
            var r = regalVon(x.regal);
            return '<li><button data-m="' + esc(x.id) + '"><i style="background:' + r.farbe + '"></i><span><b>' + esc(x.name || 'Ohne Namen') + '</b><small>' + esc(r.name) + '</small></span></button></li>';
          }).join('') + '</ul>' : '<p class="c6w-leise">Noch steht keiner im Regal.</p>') +
            (m.length < MAX_MEISTER ? '<button class="c6w-knopf c6w-haupt c6w-mneu">Einen Meister hinstellen</button>' : '<p class="c6w-leise">Zehn stehen. Für einen neuen nimm erst einen heraus.</p>') +
            '<p class="c6w-lab c6w-abstand">Alte Bücher über Meister</p><ul class="c6w-mliste c6w-gliste">' + GRUND.map(function (g) {
              return '<li><button data-g="' + g.id + '"><i style="background:' + g.farbe + '"></i><span><b>' + esc(g.titel) + '</b><small>' + esc(g.autor) + '</small></span></button></li>';
            }).join('') + '</ul>';
          [].forEach.call(el.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { aufschlagen('meister:' + b.dataset.m); }; });
          [].forEach.call(el.querySelectorAll('[data-g]'), function (b) { b.onclick = function () { aufschlagen('quelle:' + b.dataset.g); }; });
          var n = el.querySelector('.c6w-mneu'); if (n) n.onclick = function () { aufschlagen('meister-neu'); };
        },
        'meister-neu': function (el, links, id, vorlage) {
          vorlage = vorlage || {};
          carlSatz(links, 'Wen bewunderst du? Eine Lehrerin, ein Großvater, jemand aus einem Buch.'); zierde(links);
          var regal = vorlage.regal || 'lehre';
          el.innerHTML = '<form class="c6w-mform"><label class="c6w-lab" for="c6w-m-neu">Name</label>' +
            '<input id="c6w-m-neu" data-fokus class="c6w-feld c6w-hand" maxlength="40" value="' + esc(vorlage.name || '') + '" placeholder="Wie heißt er oder sie?"></form>';
          var form = el.querySelector('form');
          regalKnoepfe(form, regal, function (r) { regal = r; });
          form.insertAdjacentHTML('beforeend', '<button class="c6w-knopf c6w-haupt" type="submit">Ins Regal stellen</button>');
          form.onsubmit = function (e) {
            e.preventDefault();
            var name = el.querySelector('#c6w-m-neu').value.trim();
            if (!name) { el.querySelector('#c6w-m-neu').focus(); return; }
            var m = neuerMeister({ name: name, regal: regal });
            aufschlagen('meister:' + m.id, true);
            stimmung('froh');
            flues(satz('bib.meisterNeu', 'Steht im Regal. Was zieht dich an? In deinen Worten.'));
          };
        },
        meisterKarte: function (el, links, id) {
          var m = findeMeister(id.slice(8));
          if (!m) { SEITE.meister(el, links); return; }
          var r = regalVon(m.regal);
          links.innerHTML = '<div class="c6w-karte-links"></div>';
          var kl = links.querySelector('.c6w-karte-links');
          mFeld(kl, m, 'Name', 'name');
          regalKnoepfe(kl, m.regal, function (rid) {
            setzeMeister(function (a) { a.forEach(function (x, i) { if (x.id === m.id) { a[i] = Object.assign({}, x, { regal: rid }); } }); });
            geaendert();
          });
          mFeld(kl, m, 'Was dich anzieht, in deinen Worten', 'zieht', true, 'Was hast du bei ihm oder ihr gesehen?');
          el.innerHTML = '';
          mFeld(el, m, 'Die Haltung in einem Satz', 'haltung', true);
          mFeld(el, m, 'Ein Zitat, wörtlich', 'zitat', true, 'Nur, wenn du es wörtlich hast.');
          mFeld(el, m, 'Quelle', 'quelle', false, 'Buch, Jahr, Seite');
          el.insertAdjacentHTML('beforeend', '<p class="c6w-zitathinweis c6w-leise" aria-live="polite"></p>');
          zitatHinweis = function () {
            var x = findeMeister(m.id) || {}, p = el.querySelector('.c6w-zitathinweis');
            if (!p) return;
            p.textContent = x.zitat && !String(x.quelle || '').trim() ? 'Ohne Quelle steht es als sinngemäß da.' : '';
          };
          zitatHinweis();
          el.insertAdjacentHTML('beforeend', '<div class="c6w-frage"><p class="c6w-frage-satz">' + esc(satz('bib.meisterFrage', 'Und du? Was davon ist schon in dir?')) + '</p></div>');
          var frage = el.querySelector('.c6w-frage');
          var f = mFeld(frage, m, 'Deine Antwort', 'du', true);
          f.previousElementSibling.classList.add('c6w-nur-lesbar');
          el.insertAdjacentHTML('beforeend', '<button class="c6w-knopf c6w-leicht c6w-raus">Aus dem Regal nehmen</button>');
          el.querySelector('.c6w-raus').onclick = function () {
            setzeMeister(function (a) { for (var i = a.length - 1; i >= 0; i--) if (a[i].id === m.id) a.splice(i, 1); });
            geaendert();
            offen = 'meister';
            var l = seiten.querySelector('.c6w-links-inhalt'), s = seiten.querySelector('.c6w-seite');
            l.innerHTML = ''; s.innerHTML = '';
            seiten.querySelector('.c6w-kapitel').textContent = 'Meister-Regal';
            SEITE.meister(s, l);
            flues(satz('bib.meisterRaus', 'Herausgenommen. Rückgängig geht noch.'));
          };
        },
        atlas: function (el, links) {
          carlSatz(links, 'Ein Buch über uns zwei. Was dich ausmacht, was ich mag, und was mich stärker macht.'); zierde(links);
          el.innerHTML = '<p class="c6w-leise">Das Buch wird gerade gebunden. Bald kannst du hier blättern und hineinschreiben.</p>';
        },
        grund: function (el, links) {
          carlSatz(links, 'Alte Bücher über Menschen, von denen andere gelernt haben. Frei für alle.'); zierde(links);
          el.innerHTML = '<ul class="c6w-mliste c6w-gliste">' + GRUND.map(function (g) {
            return '<li><button data-g="' + g.id + '"><i style="background:' + g.farbe + '"></i><span><b>' + esc(g.titel) + '</b><small>' + esc(g.autor) + '</small></span></button></li>';
          }).join('') + '</ul>';
          [].forEach.call(el.querySelectorAll('[data-g]'), function (b) { b.onclick = function () { aufschlagen('quelle:' + b.dataset.g); }; });
        },
        quelle: function (el, links, id) {
          var g = GRUND.filter(function (x) { return 'quelle:' + x.id === id; })[0] || GRUND[0];
          links.innerHTML = '<p class="c6w-autor">' + esc(g.autor) + '</p><p class="c6w-leise">' + esc(g.was) + '</p>';
          zierde(links);
          var schon = meister().some(function (m) { return (m.name || '').trim().toLowerCase() === g.autor.toLowerCase(); });
          el.innerHTML = (g.zitate ? g.zitate.map(function (z) {
            return '<figure class="c6w-beleg"><blockquote lang="en">' + esc(z.t) + '</blockquote><figcaption>' + esc(z.q) + '</figcaption></figure>';
          }).join('') : '<p class="c6w-leise">Hier steht noch kein Satz daraus. Ich lege nur hin, was ich wörtlich belegen kann.</p>') +
            (schon ? '<p class="c6w-leise">Steht schon in deinem Regal.</p>' : meister().length < MAX_MEISTER ? '<button class="c6w-knopf c6w-gneu">' + esc(g.autor) + ' ins Regal stellen</button>' : '') +
            '<button class="c6w-knopf c6w-leicht c6w-galle">Alle alten Bücher</button>';
          var n = el.querySelector('.c6w-gneu');
          if (n) n.onclick = function () {
            var m = neuerMeister({ name: g.autor, regal: g.regal });
            aufschlagen('meister:' + m.id, true);
            stimmung('froh');
          };
          el.querySelector('.c6w-galle').onclick = function () { aufschlagen('grund'); };
        }
      };
      function zierHTML() { return '<span class="c6w-zier" aria-hidden="true"></span>'; }

      // ——— Antippen ———
      var genieZ = {};
      function genie(k) {
        if (k.indexOf('bild-') === 0) { var bid = k.slice(5); GENIE[k] = GENIE[k] || [BILD_SATZ[bid] || 'Ein Bild.']; }
        var el = svg.querySelector('[data-id="ding:' + k + '"]');
        if (el) { el.classList.remove('c6w-tipp'); void el.getBoundingClientRect(); el.classList.add('c6w-tipp'); setTimeout(function () { el.classList.remove('c6w-tipp'); }, 1600); }
        if (el && k === 'globus') { el.classList.remove('c6m-dreht'); void el.getBoundingClientRect(); el.classList.add('c6m-dreht'); setTimeout(function () { el.classList.remove('c6m-dreht'); }, 2800); }
        var l = GENIE[k] || ['Hm.']; genieZ[k] = ((genieZ[k] == null ? -1 : genieZ[k]) + 1) % l.length;
        stimmung('froh'); if (ctl && ctl.huepf && !C6.ruhig) try { ctl.huepf(8); } catch (e) {}
        if (C6.sag) C6.sag(satz('bib.ding.' + k, l[genieZ[k]]));
      }
      function ueberAuf(id) {
        var imBuch = id === 'text' || (C6.atlas && (C6.atlas.kapitel || []).some(function (k) { return k.id === id; }));
        if (imBuch && C6.atlas.ueber && typeof C6.atlas.oeffne === 'function') { try { if (offen) zuklappen(); C6.atlas.oeffne({ seite: 'ueber:' + id }); return; } catch (e) {} }
        aufschlagen(id);
      }
      function zuBuch(id) {
        if (!id) return;
        if (id === 'atlas') atlasAuf();
        else if (id === 'text' || KAPITEL.some(function (k) { return k.id === id; })) ueberAuf(id);
        else if (id === 'lexikon' || id.indexOf('mappe:') === 0) C6.geh('lesesaal', { funde: true });
        else if (id === 'meister' || id === 'meister-neu' || id.indexOf('meister:') === 0) zuDenMeistern(id);
        else aufschlagen(id);
      }
      function tippe(id) { if (id === 'lexikon') durchDieTuer(); else if (id === 'meister' || id === 'meister-neu' || id.indexOf('meister:') === 0) zuDenMeistern(id); else if (id.indexOf('ding:') === 0) genie(id.slice(5)); else if (id === 'atlas') atlasAuf(); else aufschlagen(id); }
      svg.addEventListener('click', function (e) { var d = e.target.closest && e.target.closest('.c6w-ding[data-id]'); if (d) tippe(d.dataset.id); });
      svg.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var d = e.target.closest && e.target.closest('.c6w-ding[data-id]'); if (!d) return; e.preventDefault(); tippe(d.dataset.id);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && offen && C6.jetzt === 'bibliothek') { e.stopPropagation(); e.preventDefault(); zuklappen(); }
      }, true);
      if (C6.bus) {
        C6.bus.on('strings', function () { if (!offen) auffrischen(); });
        C6.bus.on('kleid', function () { if (ctl && ctl.kleid && C6.laden && C6.laden.an) ctl.kleid(C6.laden.an()); });
        C6.bus.on('rundgang', function (an) {
          if (an) return;
          imRundgang = false;
          if (C6.jetzt === 'bibliothek') { carlMalen(); platz.style.visibility = ''; if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'bibliothek'); }
        });
      }
      buehne.classList.add('c6m-still');
      var ro = window.ResizeObserver ? new ResizeObserver(function () { groesse(); }) : null;
      if (ro) ro.observe(buehne);
      // Antwort-Chips heben das untere Maß: der Raum passt sich an, statt hinter ihnen zu verschwinden
      var wurzel = buehne.closest('[data-geraet]') || document.documentElement, mUhr = 0;
      if (window.MutationObserver) new MutationObserver(function () {
        if (C6.jetzt !== 'bibliothek') return;
        cancelAnimationFrame(mUhr); mUhr = requestAnimationFrame(groesse);
      }).observe(wurzel, { attributes: true, attributeFilter: ['data-chips', 'style'] });

      return {
        betreten: function (o) {
          o = o || {};
          imRundgang = !!(o.rundgang || (C6.rundgang && C6.rundgang.an));
          schieber.scrollTop = 0;
          tuerZu();
          groesse(); auffrischen();
          if (!imRundgang) carlMalen();
          platz.style.visibility = imRundgang ? 'hidden' : '';
          if (ctl && C6.setzeCarl && !imRundgang) C6.setzeCarl(ctl, 'bibliothek');
          groesse();
          if ((o.zeig === 'sessel' || o.zeig === 'lesepult') && raum.offsetHeight > schieber.clientHeight + 2) schieber.scrollTo({ top: raum.offsetHeight, behavior: C6.ruhig ? 'auto' : 'smooth' });
          if (o.zeig === 'damals') setTimeout(function () { zuBuch('damals'); }, 450);
          if (o.buch) setTimeout(function () { zuBuch(o.buch); }, 300);
          if (o.tuer) setTimeout(durchDieTuer, 500);
          if (!imRundgang && !o.zeig && !o.buch && C6.strings.abendDran()) setTimeout(function () { if (C6.jetzt === 'bibliothek' && !offen) C6.strings.abendfrage(); }, 1400);
          buehne.classList.remove('c6m-still');
          clearInterval(sandUhr); sandUhr = setInterval(sanduhrDrehen, 240000);
          setTimeout(lichtSetzen, 60);
        },
        verlassen: function () { if (offen) zuklappen(); clearInterval(sandUhr); sandUhr = null; buehne.classList.add('c6m-still'); },
        groesse: groesse
      };
    }
  });
  C6.bibliothek = { kapitel: KAPITEL.slice(), du: { kapitel: KAPITEL.slice(), male: maleKapitel }, oeffne: function (id) { C6.geh('bibliothek', { buch: id }); }, markdown: markdown };
})();
