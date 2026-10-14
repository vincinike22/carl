// Beispiele an der Rezeption: sechs kleine, echte Werkzeuge, jedes aus einem alltäglichen Satz.
// Ein Beispiel ist nie gespeichert: es hat keine id, seine Einträge leben nur, solange die Karte da ist.
// Antippen des Satzes = Carl baut genau dieses für den Menschen (Rückruf `bauen` vom Raum).
(function () {
  var C6 = window.C6; if (!C6) return;
  var D = document;
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function stimme(k, w, ersatz) { try { var t = C6.stimme && C6.stimme.fest ? C6.stimme.fest('rezeption.' + k, w || {}) : ''; if (t && !/\{[a-z]+\}/.test(t)) return t; } catch (e) {} return ersatz; }

  // Die sechs Sätze: eigene, alltägliche Wünsche – keine Namen, keine Zahlen, je eine Baustein-Art.
  var BEISPIELE = [
    { id: 'draussen', art: 'haken', satz: 'Ich will jeden Tag sehen, ob ich draußen war.' },
    { id: 'glaeser', art: 'zaehler', satz: 'Zähl mit, wie viele Gläser Wasser ich heute trinke.' },
    { id: 'kilometer', art: 'wert', satz: 'Wie viele Kilometer ich heute gelaufen bin.' },
    { id: 'wandern', art: 'liste', satz: 'Eine Liste, was ich zum Wandern mitnehmen muss.' },
    { id: 'blumen', art: 'datum', satz: 'Erinnere mich übermorgen an die Blumen auf dem Balkon.' },
    { id: 'rueckblick', art: 'frage', satz: 'Jeden Abend ein kleiner Rückblick auf den Tag.' }
  ];

  // Jede Karte zeigt genau das, was der Bau ohne Mitdenken aus dem Satz macht – dieselbe Vorlage, die später baut.
  function spec(b) {
    var sp = null;
    try { if (C6.werkzeug && typeof C6.werkzeug.ausVorlage === 'function') sp = C6.werkzeug.ausVorlage(b.satz); } catch (e) { sp = null; }
    if (!sp) return null;
    sp.teile = (sp.teile || []).map(function (t, i) { return Object.assign({ k: 'b' + i }, t); });
    return sp; // keine id → werkzeug.male hält Einträge nur im Speicher
  }

  /* ---------- Die Prüfung vor dem Bau: ein Bug, ein Handgriff ---------- */
  // Ein einzelnes Wort ist ein Samen und wird gebaut; „kurz“ ist nur, was kein Wort mit drei Buchstaben hat.
  function pruefe(satz) {
    var s = String(satz == null ? '' : satz).trim();
    if (!s) return { grund: 'leer', schluessel: 'rezeption.leer', satz: stimme('leer', null, 'Ein Satz reicht. Was fehlt dir?') };
    if (!/[a-zäöüß]{3,}/i.test(s)) return { grund: 'kurz', schluessel: 'rezeption.unsinn', satz: stimme('unsinn', null, 'Da kann ich noch nichts draus bauen. Was willst du zählen, abhaken oder nicht vergessen?') };
    return null;
  }

  /* ---------- Die Uhr: gemessene Sekunden, kein Spinner ---------- */
  // Zeigt nur, dass gedacht wird, wenn wirklich ein Kopf gefragt ist (Satz `rezeption.denkt`); sonst der neutrale Satz.
  function uhr(el, o) {
    o = o || {};
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now(), takt = null;
    var k = o.schluessel || 'denkt', ersatz = o.ersatz || 'Ich bau … {sek} s';
    function sek() { var t = (window.performance && performance.now) ? performance.now() : Date.now(); return Math.max(0, Math.round((t - t0) / 1000)); }
    function schreib() { if (!el) return; var n = String(sek()); el.textContent = stimme(k, { sek: n }, ersatz.replace('{sek}', n)); }
    if (el) { el.classList.add('c6bs-uhr'); el.setAttribute('aria-live', 'polite'); schreib(); takt = setInterval(schreib, 1000); }
    return { sek: sek, weg: function () { if (takt) clearInterval(takt); takt = null; } };
  }

  /* ---------- Malen ---------- */
  function male(el, o) {
    o = o || {};
    if (!el) return null;
    var leer = { neu: function () {}, weg: function () {}, frei: function () {} };
    if (!(C6.werkzeug && typeof C6.werkzeug.male === 'function' && typeof C6.werkzeug.ausVorlage === 'function')) return leer; // kein Werkzeug → kein Bild davon
    var bauen = typeof o.bauen === 'function' ? o.bauen : null;
    var kennz = stimme('beispiel', null, 'Beispiel'), verb = stimme('nimm', null, 'So eins für mich');
    var reihe = null;
    function zeichne() {
      weg();
      reihe = D.createElement('div'); reihe.className = 'c6bs-reihe'; reihe.setAttribute('role', 'list');
      BEISPIELE.forEach(function (b) {
        var sp = spec(b); if (!sp) return;
        var k = D.createElement('article'); k.className = 'c6bs-karte'; k.setAttribute('role', 'listitem'); k.dataset.art = b.art; k.dataset.id = b.id;
        k.style.setProperty('--wz', sp.farbe || '#2b2722');
        k.innerHTML = '<div class="c6bs-werkzeug"></div><span class="c6bs-kennz">' + esc(kennz) + '</span>' +
          (bauen ? '<button type="button" class="c6bs-nimm"><span class="c6bs-satz">„' + esc(b.satz) + '“</span><span class="c6bs-verb">' + esc(verb) + '</span></button>'
                 : '<p class="c6bs-nimm c6bs-nur-text"><span class="c6bs-satz">„' + esc(b.satz) + '“</span></p>');
        C6.werkzeug.male(k.querySelector('.c6bs-werkzeug'), sp, { klein: true });
        var kn = k.querySelector('button.c6bs-nimm');
        if (kn) {
          kn.setAttribute('aria-label', verb + ': ' + b.satz);
          kn.onclick = function () {
            if (kn.disabled) return;
            kn.disabled = true; k.setAttribute('aria-busy', 'true');
            try { bauen(b.satz, b.id); } catch (e) { kn.disabled = false; k.removeAttribute('aria-busy'); }
          };
        }
        reihe.appendChild(k);
      });
      el.appendChild(reihe);
    }
    // Blatt zu oder gebaut → die Karte ist wieder frei (Bus aus werkzeug.js, s. Kreuzungsblatt)
    function frei() {
      if (!reihe) return;
      [].forEach.call(reihe.querySelectorAll('.c6bs-karte[aria-busy]'), function (k) { k.removeAttribute('aria-busy'); var kn = k.querySelector('button.c6bs-nimm'); if (kn) kn.disabled = false; });
    }
    // Gebaut aus einem Beispiel → diese Karte rückt ans Ende; der Mensch sieht zuerst, was er noch nicht hat
    function gebaut(d) { frei(); if (!reihe || !d || !d.bei) return; var k = reihe.querySelector('.c6bs-karte[data-id="' + String(d.bei).replace(/"/g, '') + '"]'); if (k && k !== reihe.lastElementChild) reihe.appendChild(k); }
    function weg() { frei(); if (reihe && reihe.parentNode) reihe.parentNode.removeChild(reihe); reihe = null; }
    var ab = [];
    if (C6.bus && C6.bus.on) [['rezeption-gebaut', gebaut], ['rezeption-zu', frei], ['raum', frei]].forEach(function (p) { try { var z = C6.bus.on(p[0], p[1]); if (typeof z === 'function') ab.push(z); } catch (e) {} });
    zeichne();
    return { neu: zeichne, weg: function () { weg(); ab.forEach(function (z) { try { z(); } catch (e) {} }); ab = []; }, frei: frei };
  }

  C6.beispiele = {
    male: male,
    liste: function () { return BEISPIELE.map(function (b) { return { id: b.id, satz: b.satz, art: b.art }; }); },
    pruefe: pruefe,
    uhr: uhr
  };
})();
