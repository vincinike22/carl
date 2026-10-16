// Dein Wochenende mit Carl: sechs Stationen, je ein Lehrblatt (links das Ergebnis, rechts die Schritte).
// Abgehakt wird nur durch echtes Tun: die Stationen hören auf Ereignisse im Bus. Kein Streak, kein Druck.
(function () {
  var C6 = window.C6 = window.C6 || {};
  var D = document;
  function S() { var s = C6.S || (C6.S = {}); if (!s.lernweg || typeof s.lernweg !== 'object') s.lernweg = {}; var l = s.lernweg; if (!l.fertig || typeof l.fertig !== 'object') l.fertig = {}; return l; }
  function speichern() { try { if (C6.speichern) C6.speichern(); } catch (e) {} }
  function satz(k, r) { try { var s = C6.stimme && C6.stimme.sag(k); if (s && s !== k) return s; } catch (e) {} return r; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mk(tag, kl, el, txt) { var e = D.createElement(tag); if (kl) e.className = kl; if (txt != null) e.textContent = txt; if (el) el.appendChild(e); return e; }

  // ——— Ergebnis-Bilder: aus Kreis, Quadrat und Linie gebaut; Tusche, Rot nur für die Kernsatz-Nadel, Gold am Himmel, Grün für geschafft ———
  var T = 'stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"';
  var LEINE = '<path d="M14 34Q80 48 146 34" fill="none" stroke="#2b2722" stroke-width="2.4" stroke-linecap="round"/>';
  function zettel(x, y, d, txt) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + d + ')"><path d="M-14 0h28v30h-28z" fill="#fffaf0" ' + T + '/><path d="M-8 9h16M-8 15h16M-8 21h10" stroke="#8a8378" stroke-width="1.6" stroke-linecap="round"/>' + (txt || '') + '</g>'; }
  var BILD = {
    1: '<svg viewBox="0 0 160 120" aria-hidden="true">' + LEINE + zettel(80, 41, -3) +
      '<g transform="translate(80 100)"><ellipse rx="22" ry="5" fill="#e3d7c3"/><path d="M-5 -2q5 -9 10 0q-5 4 -10 0z" fill="#9c7350" ' + T + '/></g></svg>',
    2: '<svg viewBox="0 0 160 120" aria-hidden="true">' + LEINE + zettel(42, 38, -5) + zettel(80, 41, 2) + zettel(118, 38, 5) +
      '<circle cx="80" cy="44" r="4.5" fill="#d62a26" stroke="#2b2722" stroke-width="1.6"/>' +
      '<g transform="translate(80 104)"><ellipse rx="24" ry="5" fill="#e3d7c3"/><path d="M0 0v-18" ' + T + '/><path d="M0 -14c-9 -2 -13 -9 -11 -15c7 1 11 7 11 15zM0 -16c8 -3 12 -10 10 -16c-7 2 -10 8 -10 16z" fill="#97ad7f" ' + T + '/></g></svg>',
    3: '<svg viewBox="0 0 160 120" aria-hidden="true"><rect x="0" y="0" width="160" height="120" rx="12" fill="#1d2445"/>' +
      '<path d="M36 82Q80 22 124 70" fill="none" stroke="#ecd193" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="36" cy="82" r="11" fill="#6f9a5b" stroke="#eef0ff" stroke-width="1.6"/><circle cx="124" cy="70" r="13" fill="#4f7cac" stroke="#eef0ff" stroke-width="1.6"/>' +
      '<path d="M80 46l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#fff"/><text x="80" y="28" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="11" fill="#f6e7c4">„dein Satz“</text></svg>',
    4: '<svg viewBox="0 0 160 120" aria-hidden="true"><rect x="22" y="20" width="116" height="80" rx="10" fill="#fffaf0" ' + T + '/>' +
      '<text x="36" y="42" font-family="Figtree, system-ui, sans-serif" font-weight="600" font-size="11" fill="#2b2722">Gelaufen?</text>' +
      [0, 1, 2, 3, 4, 5, 6].map(function (i) { var x = 36 + i * 13.5, an = i < 4 && i !== 1; return '<rect x="' + x + '" y="56" width="10" height="10" rx="2.5" fill="' + (an ? '#4f8a5b' : '#fffaf0') + '" stroke="#2b2722" stroke-width="1.6"/>' + (an ? '<path d="M' + (x + 2.5) + ' 61l2 2 3.5 -4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' : ''); }).join('') +
      '<path d="M36 82h60" stroke="#8a8378" stroke-width="1.6" stroke-linecap="round"/></svg>',
    5: '<svg viewBox="0 0 160 120" aria-hidden="true"><path d="M30 96h100" ' + T + '/><path d="M40 96V80h80v16" fill="#c9a46a" ' + T + '/>' +
      '<path d="M104 80V54l-14 -10" fill="none" ' + T + '/><path d="M82 40l14 -6 4 10 -14 6z" fill="#e2b93b" ' + T + '/>' +
      '<path d="M76 54l22 22" stroke="#f0d79a" stroke-width="10" stroke-linecap="round" opacity=".45"/>' + zettel(60, 52, -6) + '</svg>',
    6: '<svg viewBox="0 0 160 120" aria-hidden="true">' +
      // Carl in der Mitte, drei Wege zu drei Köpfen: die Wolke (claude.ai), der Rechner mit Terminal, der eigene Rechner mit Modell
      '<path d="M80 72L36 40M80 72V38M80 72l44 -32" fill="none" stroke="#2b2722" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 4"/>' +
      '<g transform="translate(80 96)"><ellipse rx="20" ry="4.5" fill="#e3d7c3"/><path d="M-12 2c0 -11 5 -15 12 -15s12 4 12 15c0 4 -5 5 -12 5s-12 -1 -12 -5z" fill="#ece4d6" ' + T + '/><path d="M0 -13v-6" stroke="#2b2722" stroke-width="2"/><path d="M0 -19c-5 -1 -8 -5 -6 -9c4 0 6 4 6 9zM0 -19c5 -1 8 -5 6 -9c-4 0 -6 4 -6 9z" fill="#97ad7f" stroke="#2b2722" stroke-width="1.4"/><circle cx="-4" cy="-3" r="2" fill="#2b2722"/><circle cx="4" cy="-3" r="2" fill="#2b2722"/></g>' +
      '<path d="M22 44c-8 0 -10 -11 -2 -13c0 -9 12 -11 16 -4c7 -4 14 3 10 9c6 1 6 8 0 8z" fill="#fffaf0" ' + T + '/>' +
      '<rect x="64" y="14" width="32" height="22" rx="3" fill="#2b2722" ' + T + '/><path d="M69 22l4 3 -4 3M76 28h8" fill="none" stroke="#cfe6c4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M72 40h16" stroke="#2b2722" stroke-width="2.2" stroke-linecap="round"/>' +
      '<rect x="112" y="16" width="30" height="24" rx="3" fill="#fffaf0" ' + T + '/><rect x="121" y="22" width="12" height="12" rx="2" fill="#e2b93b" ' + T + '/><path d="M117 26h4M117 30h4M135 26h4M135 30h4M125 18v4M129 18v4M125 34v4M129 34v4" stroke="#2b2722" stroke-width="1.4" stroke-linecap="round"/>' +
      '</svg>'
  };

  // ——— Die sechs Stationen ———
  var ST = [
    { id: 1, tag: 'Samstag', name: 'Einen Samen bringen', ergebnis: 'Dein Gedanke hat einen Ort: einen Space mit dem ersten Zettel an der Leine.',
      schritte: ['Schreib unten ins Feld, woran du gerade denkst. Ein Satz reicht.', 'Carl fragt, wohin damit. Tipp „Neuer Space“.', 'Gib dem Space einen kurzen Namen. Dein Satz hängt als erster Zettel darin.'], tu: 'Gedanken schreiben' },
    { id: 2, tag: 'Samstag', name: 'Den Space nähren', ergebnis: 'Mehr Zettel, ein Kernsatz, ein nächster Schritt. Unten am Pfosten wächst die Pflanze mit.',
      schritte: ['Geh in deinen Space.', 'Häng einen zweiten Zettel an die Leine, oder lass Carl etwas vorschlagen.', 'Setz einen nächsten Schritt oder den Kernsatz, wenn du ihn schon weißt.'], tu: 'In meinen Space' },
    { id: 3, tag: 'Samstag', name: 'Ein Sternbild', ergebnis: 'Zwei Planeten mit deinem Satz verbunden. Er steht als Name am Himmel.',
      schritte: ['Tipp oben rechts auf „Himmel ↑“.', 'Zieh mit dem Finger von einem Planeten zum anderen.', 'Schreib den einen Satz, der beide verbindet.'], tu: 'Zum Himmel', braucht: 'Dafür brauchst du zwei Spaces.' },
    { id: 4, tag: 'Sonntag', name: 'Ein Werkzeug bauen', ergebnis: 'Ein eigenes kleines Werkzeug, zum Beispiel ein Haken für jeden Tag, das in deinem Space steht.',
      schritte: ['Sag in deinen eigenen Worten, was es können soll. Ein Satz reicht.', 'Carl baut es. Probier es gleich aus, dann „Passt“ oder „Anders“.', 'Stell es in einen Space.'], tu: 'Werkzeug bauen' },
    { id: 5, tag: 'Sonntag', name: 'Einen Helfer arbeiten lassen', ergebnis: 'Ein Helfer liest für dich nach. Was er findet, hängt als Zettel in deinem Space.',
      schritte: ['Geh in die Werkstatt zum Tisch mit der Lampe.', 'Schreib ein Thema, über das du mehr wissen willst.', 'Gib den Auftrag. Den Fund hängst du in einen Space.'], tu: 'Zur Helferecke' },
    { id: 6, tag: 'Sonntag', name: 'Wer denkt mit', ergebnis: 'Du weißt, welcher Kopf mit Carl mitdenkt, und hast ihn selbst gewählt.',
      schritte: ['Sieh dir die drei Köpfe an. Einer davon denkt heute schon mit.', 'Such dir einen aus. Jeder sagt dir ehrlich, was er braucht und was er kann.', 'Wenn du magst, hol dir Carl auch aufs iPhone.'], tu: null }
  ];
  function station(id) { return ST.filter(function (s) { return s.id === +id; })[0] || null; }
  function fertig(id) { return !!S().fertig[id]; }
  function hake(id, grund) {
    var l = S(); if (l.fertig[id]) return;
    l.fertig[id] = Date.now(); speichern();
    try { C6.bus && C6.bus.emit('lernweg', { was: 'haken', station: id, grund: grund || '' }); } catch (e) {}
    // nur wer den Lernweg kennt, hört es; ein leiser Satz, keine Zahl – und nie über eine offene Frage
    if (l.gesehen && C6.sag) {
      var st = station(id), alle = ST.every(function (s) { return fertig(s.id); }), samstag = st.tag === 'Samstag' && [1, 2, 3].every(fertig);
      var t = alle ? satz('lernweg.alles', 'Das war dein Wochenende. Alles Weitere wächst aus deinen Ideen.') : samstag ? satz('lernweg.samstag', 'Samstag geschafft. Morgen zeig ich dir den Rest.') : satz('lernweg.haken', 'Ein Haken im Kalender: „{name}“.').replace('{name}', st.name);
      wennStill(function () { try { C6.sag(t, { merken: false }); } catch (e) {} }, 900);
    }
    if (offen && ansicht) zeige(ansicht);
  }

  // Ist gerade eine Frage offen (Chips, freie Antwort, Werkzeug-Blatt) oder ein „Wie geht das?“-Satz? Dann wartet der Haken-Satz.
  function frageOffen() {
    try { if (C6.frag && typeof C6.frag.offen === 'function') { if (C6.frag.offen()) return true; } else { var w = D.getElementById('c6'); if (w && w.hasAttribute('data-chips')) return true; } } catch (e) {}
    try { if (C6.staunen && C6.staunen.offen && C6.staunen.offen()) return true; } catch (e) {}
    try { if (D.querySelector('.c6wz-an, .c6w-blatt.c6w-an')) return true; } catch (e) {}
    // Otto schreibt gerade (das Feld hat den Fokus): dann redet Carl nicht dazwischen
    try { var a = D.activeElement; if (a && a.matches && a.matches('.c6k-feld, textarea, input[type=text], input:not([type])')) return true; } catch (e) {}
    return false;
  }
  function carlSpricht() { try { var b = D.querySelector('.c6k-blase'); return !!(b && b.parentNode && b.parentNode.hasAttribute('data-an')); } catch (e) { return false; } }
  // Ein Satz, der warten kann: nie über eine offene Frage (nach 20 s ohne Lücke fällt er still weg);
  // spricht Carl gerade etwas anderes, darf das erst 6 s stehen
  function wennStill(fn, ab) {
    var t0 = Date.now(), bis = t0 + 20000, ruhe = 0;
    // erst nach anderthalb Sekunden Ruhe: eine eben geschlossene Frage räumt ihre Blase noch weg
    function versuch() {
      var jetzt = Date.now(), belegt = frageOffen() || (carlSpricht() && jetzt - t0 < 6000);
      if (belegt) ruhe = 0; else if (!ruhe) ruhe = jetzt;
      if (!belegt && jetzt - ruhe >= 1500) { fn(); return; }
      if (jetzt < bis) setTimeout(versuch, 400);
    }
    setTimeout(versuch, ab || 0);
  }

  // ——— Hören, was wirklich getan wird ———
  function hoeren() {
    if (!C6.bus || hoeren.an) return; hoeren.an = true;
    C6.bus.on('strings', function (ev) {
      if (!ev) return;
      // Station 1 hängt am Zustand: erst wenn irgendwo ein Zettel an der Leine hängt
      pruefe1Bald();
      if (ev.was === 'perle') naehren('zettel', ev.id);
      if (ev.was === 'nadel') naehren('kernsatz');
      if (ev.was === 'knoten') hake(3, 'sternbild');
    });
    C6.bus.on('space', function (ev) { pruefe1Bald(); if (ev && ev.was === 'zettel') naehren('zettel', ev.stringId); });
    C6.bus.on('zustand', pruefe1Bald);
    C6.bus.on('baustein', function (ev) { if (ev && (ev.was === 'neu' || ev.was === 'erledigt')) naehren('schritt'); });
    C6.bus.on('atlas', function (ev) { if (ev && ev.offen === false) pruefe6(); });
    // Station 4 zählt nur ein Werkzeug aus Ottos eigenen Worten; vor dem ersten Öffnen des Lernwegs (Rezeption) nichts still abhaken – der Haken kommt mit dem Satz
    C6.bus.on('werkzeug-eigen', function (ev) { if (!(ev && ev.was === 'gehaengt' && ausEigenenWorten(ev.id))) return; var l = S(); if (l.gesehen) hake(4, 'werkzeug'); else if (!l.fertig[4]) { l.schonGebaut = true; speichern(); } });
    // Helfer: ein Fund, der in einem Space landet (auftrag.js), oder das eigene Ereignis der Helferecke
    C6.bus.on('auftrag', function (ev) { if (ev && ev.was === 'fund') hake(5, 'fund'); });
    C6.bus.on('helfer', function (ev) { if (ev && (ev.was === 'auftrag' || ev.was === 'fund')) hake(5, 'helfer'); });
  }
  // Nähren zählt erst nach dem Samen: der erste Zettel, der mit dem Space entsteht, ist noch der Samen selbst
  // Ein Zettel zählt nur, wenn er wirklich an der Leine hängt: mehr als der Samen in diesem Space
  // Was Otto nicht getan hat, zählt nicht als seins: Fund-Zettel (Helfer, Lesesaal) hängen, haken aber keine Station
  function vonOtto(n) { return !!n && n.von !== 'fund' && !/^Fund\s*·\s*/.test(String(n.t || '')); }
  function zettelZahl(sid) {
    var n = 0;
    try { var x = C6.S.spaces && C6.S.spaces[sid]; n += x && Array.isArray(x.notizen) ? x.notizen.filter(vonOtto).length : 0; } catch (e) {}
    try { n += (C6.space && C6.space.dinge ? C6.space.dinge(sid) || [] : []).filter(function (d) { return !(C6.strings.vonOben && C6.strings.vonOben(d)) && d.von !== 'fund' && d.art !== 'fund'; }).length; } catch (e) {}
    return n;
  }
  // Station 1: am Zustand geprüft, nicht am Ereignis
  function pruefe1() {
    if (fertig(1)) return true;
    var ids = [];
    try { ids = Object.keys((C6.S && C6.S.spaces) || {}); } catch (e) { ids = []; }
    for (var i = 0; i < ids.length; i++) if (zettelAnDerLeine(ids[i]) >= 1) { hake(1, 'zettel'); return true; }
    return false;
  }
  var p1uhr = 0;
  function pruefe1Bald() { if (fertig(1)) return; clearTimeout(p1uhr); p1uhr = setTimeout(pruefe1, 200); }
  function zettelAnDerLeine(sid) { try { var x = C6.S.spaces && C6.S.spaces[sid]; return x && Array.isArray(x.notizen) ? x.notizen.filter(vonOtto).length : 0; } catch (e) { return 0; } }
  function ausEigenenWorten(id) {
    var w = null; try { w = C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(id) : null; } catch (e) { w = null; }
    var t = w && String(w.satz || '').trim(); if (!t) return false;
    var vor = []; try { vor = (C6.werkzeug && C6.werkzeug.vorlagen) || []; } catch (e) { vor = []; }
    return !vor.some(function (v) { return v && String(v.satz || '').trim() === t; });
  }
  function naehren(grund, sid) {
    var t = S().fertig[1]; if (!t || Date.now() - t < 1500) return;
    if (grund === 'zettel') { setTimeout(function () { if (sid && zettelZahl(sid) >= 2) hake(2, 'zettel'); }, 120); return; }
    hake(2, grund);
  }
  function pruefe6() { var m = null; try { m = C6.atlas && C6.atlas.modell ? C6.atlas.modell() : null; } catch (e) {} if (S().kopf || m) hake(6, 'kopf'); return m; }

  // ——— Ebene ———
  var wurzel = null, offen = false, ansicht = null;
  function bauen() {
    if (wurzel) return;
    wurzel = mk('div', 'c6lw', D.body); wurzel.id = 'c6lw'; wurzel.hidden = true;
    wurzel.setAttribute('role', 'dialog'); wurzel.setAttribute('aria-modal', 'true'); wurzel.setAttribute('aria-label', 'Dein Wochenende mit Carl');
    wurzel.addEventListener('click', function (e) {
      if (e.target === wurzel) { zu(); return; }
      var b = e.target.closest('[data-lw]'); if (!b) return;
      var w = b.getAttribute('data-lw');
      if (w === 'zu') zu();
      else if (w === 'plan') zeige('plan');
      else if (/^st/.test(w)) zeige(+w.slice(2));
      else if (w === 'tu') tun(+b.getAttribute('data-st'));
      else if (w === 'rechner') { zu(); setTimeout(function () { try { C6.verbindung && C6.verbindung.oeffne && C6.verbindung.oeffne({}); } catch (e2) {} }, C6.ruhig ? 0 : 240); }
      else if (w === 'kopf') {
        // dieselbe Wahl wie im Freundschaftsbuch (S.du.modell); die beiden Rechner-Wege öffnen die Verbinden-Blätter
        var v = b.getAttribute('data-wert');
        S().kopf = v; speichern();
        var modell = v === 'rechner' ? 'claude' : v;
        try { if (C6.aendern) C6.aendern(function (st) { st.du = st.du || {}; st.du.modell = modell; }); else { C6.S.du = C6.S.du || {}; C6.S.du.modell = modell; speichern(); } } catch (e2) {}
        pruefe6();
        if (v === 'rechner') { zu(); setTimeout(function () { try { C6.verbindung && C6.verbindung.oeffne && C6.verbindung.oeffne({}); } catch (e3) {} }, C6.ruhig ? 0 : 240); return; }
        if (v === 'lokal') { zu(); setTimeout(function () { try { if (C6.verbindung && C6.verbindung.oeffneLokal) C6.verbindung.oeffneLokal({}); else if (C6.verbindung && C6.verbindung.oeffne) C6.verbindung.oeffne({ was: 'lokal' }); } catch (e3) {} }, C6.ruhig ? 0 : 240); return; }
        zeige(6);
      }
    });
    D.addEventListener('keydown', function (e) { if (offen && e.key === 'Escape') { e.stopPropagation(); if (ansicht !== 'plan') zeige('plan'); else zu(); } }, true);
  }
  function kopf(innen, titel, zurueck) {
    var k = mk('div', 'c6lw-kopf', innen);
    if (zurueck) { var z = mk('button', 'c6lw-zurueck', k, '‹ Wochenende'); z.type = 'button'; z.setAttribute('data-lw', 'plan'); }
    mk('h2', 'c6lw-titel', k, titel);
    var x = mk('button', 'c6lw-x', k); x.type = 'button'; x.setAttribute('data-lw', 'zu'); x.setAttribute('aria-label', 'Schließen');
    x.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  }
  function zeige(was) {
    ansicht = was;
    wurzel.innerHTML = '';
    var blatt = mk('div', 'c6lw-blatt', wurzel);
    if (was === 'plan') return plan(blatt);
    var st = station(was); if (!st) return plan(blatt);
    kopf(blatt, st.name, true);
    var lehr = mk('div', 'c6lw-lehr', blatt);
    // links das Ergebnis, rechts die Schritte (wie ein Lehrblatt)
    var erg = mk('figure', 'c6lw-erg', lehr);
    var bild = mk('div', 'c6lw-bild', erg); bild.innerHTML = BILD[st.id];
    mk('figcaption', null, erg, st.ergebnis);
    var re = mk('div', 'c6lw-rechts', lehr);
    mk('p', 'c6lw-tag', re, st.tag + ' · Schritt ' + st.id);
    var ol = mk('ol', 'c6lw-schritte', re);
    st.schritte.forEach(function (t) { mk('li', null, ol, t); });
    if (st.id === 6) station6(re);
    var fuss = mk('div', 'c6lw-fuss', re);
    if (fertig(st.id)) mk('p', 'c6lw-erledigt', fuss, 'Erledigt. Du hast es selbst getan.');
    else if (st.tu) {
      var zuWenig = st.id === 3 && (C6.strings && C6.strings.alle ? C6.strings.alle().length : 0) < 2;
      var hinweis = zuWenig ? st.braucht : '';
      var b = mk('button', 'c6w-knopf c6w-haupt c6lw-tu', fuss, zuWenig ? 'Einen zweiten Samen bringen' : st.tu); b.type = 'button'; b.setAttribute('data-lw', 'tu'); b.setAttribute('data-st', zuWenig ? 1 : st.id);
      mk('p', 'c6lw-leise', fuss, hinweis || (st.id === 4 ? 'Jetzt du. Sag es in deinen eigenen Worten, dann baut Carl es. Ein fertiges Beispiel zählt hier nicht.' : satz('lernweg.tun', 'Jetzt du. Den Haken setzt du, indem du es tust.')));
    }
    fokus(blatt);
  }
  // Fokus aufs Blatt selbst (für Tastatur und Vorlesen), ohne einen Knopf laut zu umranden
  function fokus(blatt) { blatt.setAttribute('tabindex', '-1'); setTimeout(function () { try { blatt.focus({ preventScroll: true }); } catch (e) {} }, 40); }
  function plan(blatt) {
    kopf(blatt, 'Dein Wochenende mit Carl', false);
    mk('p', 'c6lw-unter', blatt, satz('lernweg.auf', 'Zwei Tage, sechs kleine Schritte. Fang an, wo du magst.'));
    var tage = mk('div', 'c6lw-tage', blatt);
    ['Samstag', 'Sonntag'].forEach(function (tag) {
      var sp = mk('section', 'c6lw-tagspalte', tage);
      mk('h3', null, sp, tag);
      ST.filter(function (s) { return s.tag === tag; }).forEach(function (s) {
        var b = mk('button', 'c6lw-karte' + (fertig(s.id) ? ' c6lw-ja' : ''), sp); b.type = 'button'; b.setAttribute('data-lw', 'st' + s.id);
        b.setAttribute('aria-label', 'Schritt ' + s.id + ': ' + s.name + (fertig(s.id) ? ', erledigt' : ''));
        var z = mk('span', 'c6lw-nr', b, String(s.id));
        z.setAttribute('aria-hidden', 'true');
        mk('span', 'c6lw-kname', b, s.name);
        var h = mk('span', 'c6lw-haken', b); h.setAttribute('aria-hidden', 'true');
        h.innerHTML = fertig(s.id) ? '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '';
      });
    });
    fokus(blatt);
  }
  // Schritt 6: zwei Wahlen, sonst nichts. Technik (Terminal, Befehle) steht für Bastler im Freundschaftsbuch.
  // Die drei Köpfe: jeder mit einem Satz, was er braucht und was er kann; dazu, was gerade wirklich gilt
  var KOEPFE = [
    { id: 'claude', name: 'Claude über claude.ai', satz: 'Denkt heute schon mit, wenn diese Seite es erlaubt. Nichts einzurichten.' },
    { id: 'rechner', name: 'Claude Code oder Codex auf deinem Rechner', satz: 'Ein Programm auf deinem Computer, das für dich arbeiten kann. Carl zeigt dir Schritt für Schritt, wie ihr euch verbindet.' },
    { id: 'lokal', name: 'Dein eigenes Modell', satz: 'Läuft ganz bei dir, nichts verlässt deinen Rechner. Nur in Chrome oder Firefox, und ab 16 GB Arbeitsspeicher wirklich brauchbar. Ein erweiternder Bereich: gut fürs Sortieren und Entwerfen, bei Fakten unsicher.' }
  ];
  function kopfStand(id) {
    var m = null, v = null, l = null;
    try { m = C6.mitdenken ? C6.mitdenken() : null; } catch (e) {}
    try { v = C6.verbindung && C6.verbindung.info ? C6.verbindung.info() : null; } catch (e) {}
    try { l = C6.lokal && C6.lokal.status ? C6.lokal.status() : null; } catch (e) {}
    if (id === 'claude') return m && m.echt === true && m.kopf !== 'lokal' ? 'Denkt gerade mit.' : m && m.echt === false ? 'Gerade nicht erlaubt. Ich lege Beispiele hin.' : 'Ob es geht, weiß ich, sobald du mir etwas sagst.';
    if (id === 'rechner') return v ? 'Verbunden mit ' + (v.name || 'deinem Rechner') + (v.woName ? ' auf ' + v.woName : '') + '.' : 'Noch nicht verbunden.';
    if (id === 'lokal') return l && l.an ? 'Dein Rechner denkt mit: ' + (l.modell || 'eigenes Modell') + '.' : (C6.lokal ? 'Noch nicht eingerichtet.' : 'Kommt noch.');
    return '';
  }
  function station6(re) {
    var l = S(), du = (C6.S && C6.S.du) || {}, jetzt = l.kopf || du.modell || '';
    pruefe6();
    mk('p', 'c6lw-frage', re, 'Wer denkt mit? Such dir einen aus.');
    var w = mk('div', 'c6lw-koepfe', re); w.setAttribute('role', 'radiogroup'); w.setAttribute('aria-label', 'Wer denkt mit');
    KOEPFE.forEach(function (k) {
      var b = mk('button', 'c6lw-kk', w); b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', jetzt === k.id ? 'true' : 'false');
      b.setAttribute('data-lw', 'kopf'); b.setAttribute('data-wert', k.id);
      mk('span', 'c6lw-kk-name', b, k.name);
      mk('span', 'c6lw-kk-satz', b, k.satz);
      mk('span', 'c6lw-kk-stand', b, kopfStand(k.id));
    });
    zumHandy(re);
  }
  // Carl wohnt unter einer Adresse; aufs iPhone holt man ihn am Computer mit dem QR-Code, am iPhone über den Home-Bildschirm
  var ADRESSE = 'https://claude.ai/artifact/EPS4vNiyuWfpjLw4doypcc';
  function qrSvg(text) {
    if (!C6.qrcode) return '';
    var q = C6.qrcode(0, 'M'); q.addData(text); q.make();
    var n = q.getModuleCount(), r = 4, d = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) d += 'M' + (x + r) + ' ' + (y + r) + 'h1v1h-1z';
    return '<svg viewBox="0 0 ' + (n + 2 * r) + ' ' + (n + 2 * r) + '" shape-rendering="crispEdges" role="img" aria-label="QR-Code: Carls Adresse"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#2b2722"/></svg>';
  }
  var HOME = [
    ['Tipp unten in Safari auf „Teilen“.', '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="12" y="18" width="24" height="24" rx="4" fill="#fffaf0" stroke="#2b2722" stroke-width="2.4"/><path d="M24 6v24M17 13l7-7 7 7" fill="none" stroke="#2f6fd6" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'],
    ['Scroll ein Stück und wähl „Zum Home-Bildschirm“.', '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="14" width="40" height="20" rx="5" fill="#fffaf0" stroke="#2b2722" stroke-width="2"/><rect x="31" y="18" width="10" height="12" rx="2.5" fill="none" stroke="#2b2722" stroke-width="1.8"/><path d="M36 21v6M33 24h6" stroke="#2b2722" stroke-width="1.8" stroke-linecap="round"/><path d="M9 22h17M9 27h12" stroke="#8a8378" stroke-width="2" stroke-linecap="round"/></svg>'],
    ['Tipp oben rechts auf „Hinzufügen“. Jetzt wohnt Carl auf deinem Home-Bildschirm.', '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="8" width="28" height="34" rx="6" fill="#fffaf0" stroke="#2b2722" stroke-width="2.2"/><rect x="16" y="14" width="16" height="16" rx="4" fill="#ece4d6" stroke="#2b2722" stroke-width="1.8"/><path d="M24 22v-4M24 18c-3-1-4-3-3-5c2 0 3 2 3 5zM24 18c3-1 4-3 3-5c-2 0-3 2-3 5z" fill="#97ad7f" stroke="#2b2722" stroke-width="1.2"/><path d="M18 36h12" stroke="#2f6fd6" stroke-width="2.4" stroke-linecap="round"/></svg>']
  ];
  function zumHandy(re) {
    var box = mk('div', 'c6lw-handy', re);
    if (C6.geraet === 'computer') {
      mk('p', 'c6lw-frage', box, 'Carl auch auf dein iPhone holen');
      var reihe = mk('div', 'c6lw-qr-reihe', box);
      var qr = mk('div', 'c6lw-qr', reihe); qr.innerHTML = qrSvg(ADRESSE);
      var t = mk('div', null, reihe);
      mk('p', 'c6lw-qr-titel', t, 'Mit dem iPhone scannen');
      mk('p', 'c6lw-leise', t, 'Die Kamera öffnet Carl in Safari. Dann „Teilen“ und „Zum Home-Bildschirm“. Einmal bei Claude anmelden, dann ist es derselbe Carl wie hier.');
    } else {
      mk('p', 'c6lw-frage', box, 'Auf den Home-Bildschirm');
      var ol = mk('ol', 'c6lw-home');
      box.appendChild(ol);
      HOME.forEach(function (h, i) { var li = mk('li', null, ol); var b = mk('span', 'c6lw-home-bild', li); b.innerHTML = h[1]; mk('span', 'c6lw-home-nr', li, String(i + 1)); mk('span', 'c6lw-home-t', li, h[0]); });
      mk('p', 'c6lw-leise', box, 'Einmal bei Claude anmelden, dann ist es derselbe Carl wie am Computer.');
    }
  }
  // „Selbst tun“: der Lernweg geht zur Seite, Carl bringt dich hin
  function tun(id) {
    zu();
    var geh = function (r, o) { try { C6.geh && C6.geh(r, o); } catch (e) {} };
    if (id === 1) { if (C6.hoeheJetzt && C6.hoeheJetzt !== 'boden') geh('zuhause'); setTimeout(function () { var f = D.querySelector('.c6k-feld'); if (f) f.focus(); }, 500); }
    else if (id === 2) { var a = []; try { a = C6.space && C6.space.alle ? C6.space.alle() : []; } catch (e) {} if (a.length) geh('space', { id: a[0].stringId }); else tun(1); }
    else if (id === 3) { try { C6.hoehe && C6.hoehe('vogel'); } catch (e) {} }
    else if (id === 4) { if (C6.werkzeug && C6.werkzeug.oeffne) { try { C6.werkzeug.oeffne({ eigen: true }); } catch (e) { geh('werkstatt'); } } else geh('werkstatt'); }
    else if (id === 5) geh('werkstatt', { zeig: 'helfer' });
  }
  function naechste() { var n = ST.filter(function (s) { return !fertig(s.id); })[0]; return n ? n.id : null; }
  function oeffne(o) {
    o = o || {}; bauen(); hoeren(); pruefe6(); pruefe1();
    var l = S(), erstesMal = !l.gesehen; if (!l.gesehen) { l.gesehen = Date.now(); speichern(); }
    offen = true; C6.lernweg.offen = true;
    if (l.schonGebaut && !l.fertig[4]) {
      delete l.schonGebaut; l.fertig[4] = Date.now(); speichern();
      try { C6.bus && C6.bus.emit('lernweg', { was: 'haken', station: 4, grund: 'rezeption' }); } catch (e) {}
      setTimeout(function () { try { C6.sag(satz('lernweg.schonGebaut', 'Ein Werkzeug bauen – das hast du an der Rezeption schon geschafft. Der Haken ist deiner.'), { merken: false }); } catch (e) {} }, erstesMal ? 900 : 300);
    }
    wurzel.hidden = false; D.documentElement.classList.add('c6lw-auf');
    zeige(o.station ? +o.station : 'plan');
    requestAnimationFrame(function () { wurzel.classList.add('c6lw-an'); });
    try { C6.bus && C6.bus.emit('lernweg', { was: 'offen' }); } catch (e) {}
  }
  function zu() {
    if (!wurzel || !offen) return;
    offen = false; C6.lernweg.offen = false; wurzel.classList.remove('c6lw-an'); D.documentElement.classList.remove('c6lw-auf');
    setTimeout(function () { if (!offen) wurzel.hidden = true; }, C6.ruhig ? 0 : 220);
    try { C6.bus && C6.bus.emit('lernweg', { was: 'zu' }); } catch (e) {}
  }
  function stand() {
    var f = ST.filter(function (s) { return fertig(s.id); }).map(function (s) { return s.id; });
    var n = naechste();
    return { fertig: f, geschafft: f.length, alle: ST.length, naechste: n, tag: n ? station(n).tag : null, samstag: [1, 2, 3].every(fertig), sonntag: [4, 5, 6].every(fertig), stationen: ST.map(function (s) { return { id: s.id, tag: s.tag, name: s.name, fertig: fertig(s.id) }; }) };
  }
  C6.lernweg = { oeffne: oeffne, zu: zu, stand: stand, offen: false, adresse: ADRESSE };
  // schon beim Laden hören, damit auch das Tun vor dem ersten Öffnen zählt
  if (C6.bus) hoeren(); else setTimeout(hoeren, 0);
  try { if (C6.bus) C6.bus.on('raum', function () { if (offen) zu(); }); } catch (e) {}
})();
