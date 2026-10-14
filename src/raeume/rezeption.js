// Rezeption: der erste Raum. Ein Satz von dir, ein Werkzeug von Carl – es steht sofort neben ihm.
var C6 = window.C6;
if (!C6 || !C6.raum) return;
var D = document;
function mach(tag, cls, vater, text) { var e = D.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (vater) vater.appendChild(e); return e; }
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function kurz(t, n) { t = String(t == null ? '' : t).trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
// Carls Sätze kommen aus stimme.js (rezeption.*); die Ersatzsätze hier gelten nur, wenn ein Schlüssel fehlt
function stimme(k, w, ersatz) {
  try { var t = C6.stimme && C6.stimme.fest ? C6.stimme.fest('rezeption.' + k, w || {}) : ''; if (t && !/\{[a-z]+\}/i.test(t)) return t; } catch (e) {}
  return ersatz.replace(/\{(\w+)\}/g, function (m, s) { return w && w[s] != null ? String(w[s]) : m; });
}
function sekText(ms) { var s = Math.max(0, +ms || 0) / 1000; return (s < 10 ? (Math.round(s * 10) / 10) : Math.round(s)).toString().replace('.', ','); }
function kopfText(d) {
  if (!d) return '';
  if (d.kopf === 'lokal') return 'dein Rechner' + (d.modell ? ' (' + d.modell + ')' : '');
  if (d.kopf === 'claude') return 'Claude über claude.ai';
  return '';
}

/* Tresen mit Glocke, 24 px: das Zeichen der Rezeption in der Raumleiste */
var SYMBOL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18.5h18M5 18.5v-3h14v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 13.5a3.5 3.5 0 0 1 7 0M12 10v-1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 13.5h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var ZIPFEL = '<svg viewBox="0 0 22 14" aria-hidden="true"><path d="M2 1 L7 12 L20 1" fill="var(--karte,#fbf7f0)" stroke="var(--tusche,#2b2722)" stroke-width="1.5" stroke-linejoin="round"/><path d="M3.5 1H18.5" stroke="var(--karte,#fbf7f0)" stroke-width="3"/></svg>';

function meine() { try { return (C6.werkzeug && C6.werkzeug.alle ? C6.werkzeug.alle() : []).filter(function (w) { return !w.sid; }); } catch (e) { return []; } }
C6.rezeption = C6.rezeption || {};
// die kleine Reihe der Werkzeuge ohne Space, für andere Räume (z. B. Zuhause): {neu(), weg()}
C6.rezeption.meine = function (ziel) {
  if (!ziel) return null;
  var schl = '';
  function neu() {
    var l = meine().slice(-3).reverse(), k = l.map(function (w) { return w.id + ':' + w.name; }).join(',');
    if (k === schl) return; schl = k;
    ziel.textContent = ''; ziel.hidden = !l.length;
    l.forEach(function (w) { var h = mach('div', 'c6rz-wz', ziel); try { C6.werkzeug.male(h, w, { klein: true }); } catch (e) { h.remove(); } });
  }
  var ab = C6.bus.on('werkzeug-eigen', function (d) { if (d && (d.was === 'gehaengt' || d.was === 'weg' || d.was === 'benutzt')) neu(); });
  neu();
  return { neu: function () { schl = ''; neu(); }, weg: function () { try { ab(); } catch (e) {} ziel.textContent = ''; } };
};

function spacesDa() { try { return !!(C6.strings && C6.strings.alle && C6.strings.alle().length); } catch (e) { return false; } }

C6.raum({
  id: 'rezeption', name: 'Rezeption', hoehe: 'boden', reihe: 0, symbol: SYMBOL, tageszeit: true, // die Welt zeichnet ihre Nacht selbst (kein Nachtschleier des Kerns)
  // der Himmel hat für einen Fremden ohne Space noch nichts zu zeigen: kein Himmel-Knopf, bis es einen gibt
  regler: function () { return spacesDa(); },
  bauen: function (buehne) {
    buehne.classList.add('c6rz-buehne');
    var wurzel = mach('div', 'c6rz', buehne);
    // Die Welt (ein anderes Modul füllt sie) liegt hinter allem; Carl und sein Satz stehen fest am Tresen; der Boden darunter rollt
    wurzel.innerHTML =
      '<div class="c6rz-welt" aria-hidden="true"></div>' +
      '<div class="c6rz-carl"></div>' +
      '<p class="c6rz-satz" aria-live="polite"><span class="c6rz-satz-text"></span><i class="c6rz-zipfel" aria-hidden="true">' + ZIPFEL + '</i></p>' +
      '<div class="c6rz-boden">' +
        '<div class="c6rz-meins" hidden></div>' +
        '<div id="c6rz-beispiele"></div>' +
      '</div>';
    function q(s) { return wurzel.querySelector(s); }
    var el = { tresen: q('.c6rz-boden'), carl: q('.c6rz-carl'), satz: q('.c6rz-satz-text'), meins: q('.c6rz-meins'), beispiele: q('#c6rz-beispiele') };
    var hier = false, leiheZurueck = null, beispiele = null, ctl = null, karteFuer = null;

    try { ctl = C6.figur.male(el.carl, { groesse: 120 }); } catch (e) { ctl = null; }
    if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'rezeption');

    // ein langer Satz darf am iPhone die ganze Breite nehmen (über dem Fenster), der Zipfel zeigt weiter auf Carl
    function sag(t) { el.satz.textContent = t; el.satz.parentNode.classList.toggle('c6rz-lang', String(t).length > 64); }
    // eine Stimme: spricht Carl über die Blase des Kerns (C6.sag, Staunen), tritt die feste Blase so lange zurück
    (function () {
      var wurzelEl = D.getElementById('c6');
      if (!wurzelEl || !('MutationObserver' in window)) return;
      var pruef = function () { var r = D.querySelector('.c6k-blase-rahmen'); el.satz.parentNode.classList.toggle('c6rz-still', !!(r && r.hasAttribute('data-an') && C6.jetzt === 'rezeption')); };
      // die Blase des Kerns hängt erst beim ersten Sprechen im Baum, darum am Stamm beobachten (nur das eine Attribut)
      new MutationObserver(function (m) { for (var i = 0; i < m.length; i++) if (m[i].target.classList && m[i].target.classList.contains('c6k-blase-rahmen')) { pruef(); return; } }).observe(wurzelEl, { attributes: true, subtree: true, attributeFilter: ['data-an'] });
      C6.bus.on('raum', function () { setTimeout(pruef, 0); });
    })();
    // andere Module der Rezeption (z. B. die Glocke) sprechen über dieselbe Blase
    C6.rezeption = C6.rezeption || {};
    C6.rezeption.sag = function (t) { if (t) sag(String(t)); };
    function schonDa() { try { return !!((C6.werkzeug && C6.werkzeug.alle && C6.werkzeug.alle().length) || (C6.S.du && C6.S.du.angekommen)); } catch (e) { return false; } }
    // der Gruß: ein Fremder bekommt die Vorstellung, wer schon ein Werkzeug hat, nur die Einladung
    function erster() { sag(schonDa() ? stimme('wieder', null, 'Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins.') : stimme('erst', null, 'Sag mir einen Satz, ich bau dir was.')); }

    // ---------- das eine Feld unten: hier fragt es nach deinem Satz ----------
    // vor dem Bau eine Prüfung (ein Bug, ein Handgriff): der Satz bleibt im Feld, Carl sagt, was fehlt
    function pruefe(satz) {
      try { if (C6.beispiele && typeof C6.beispiele.pruefe === 'function') return C6.beispiele.pruefe(satz); } catch (e) {}
      return null;
    }
    function behalte(t) {
      try {
        var f = C6.eingabe && C6.eingabe.feld; if (!f) return;
        f.value = t; f.dispatchEvent(new Event('input', { bubbles: true }));
        f.focus({ preventScroll: true }); f.setSelectionRange(f.value.length, f.value.length);
      } catch (e) {}
    }
    function bauen(satz, bei) {
      satz = String(satz || '').trim();
      if (!satz) return false;
      var p = bei ? null : pruefe(satz);
      if (p && p.satz) { sag(p.satz); return 'behalten'; }
      if (!(C6.werkzeug && typeof C6.werkzeug.rezeption === 'function')) return false;
      if (ctl) { try { ctl.stimmung('arbeitet'); } catch (e) {} }
      var o = {}; if (bei) o.bei = bei;
      return C6.werkzeug.rezeption(satz, o) === true;
    }
    function feldZurueck() { if (leiheZurueck) { var z = leiheZurueck; leiheZurueck = null; try { z(); } catch (e) {} } }
    function feldLeihen() {
      feldZurueck();
      if (!hier || C6.jetzt !== 'rezeption') return;
      if (!(C6.feld && typeof C6.feld.leihen === 'function')) return;
      if (C6.feld.geliehen && !leiheZurueck) return; // ein anderes Blatt hat das Feld gerade (z. B. für „Anders“)
      try {
        leiheZurueck = C6.feld.leihen({ platzhalter: stimme('feld', null, 'Was fehlt dir? Ein Satz reicht.'), fokus: false, sanft: true, nimm: function (t) {
          var r = bauen(t);
          if (r === 'behalten') { behalte(t); return true; } // die Leihe bleibt, der Satz auch
          if (r === true) return true; // das Feld bleibt bei der Rezeption, solange gebaut wird (das Blatt leiht es sich für „Anders“ selbst)
          leiheZurueck = null; return false;
        } });
      } catch (e) { leiheZurueck = null; }
    }
    // Netz unter der Leihe: ein Satz im Feld geht hier immer an den Bau
    try { C6.eingabe && C6.eingabe.hoert && C6.eingabe.hoert(function (t) { var r = bauen(t); if (r === 'behalten') behalte(t); return !!r; }, { raum: 'rezeption' }); } catch (e) {}

    // ---------- deine Werkzeuge ohne Space stehen neben Carl ----------
    var meinsSchl = '';
    function meinsZeichnen(neuId) {
      var l = meine().slice(-3).reverse();
      var schl = l.map(function (w) { return w.id + ':' + w.name; }).join(',') + '|' + (karteFuer ? karteFuer.id : '');
      if (schl === meinsSchl && !neuId) return;
      meinsSchl = schl;
      el.meins.textContent = '';
      el.meins.hidden = !l.length;
      if (!l.length) return;
      var reihe = mach('div', 'c6rz-reihe', el.meins);
      reihe.setAttribute('role', 'group'); reihe.setAttribute('aria-label', 'Deine Werkzeuge');
      l.forEach(function (w) {
        var h = mach('div', 'c6rz-wz' + (neuId === w.id ? ' c6rz-neu' : ''), reihe);
        try { C6.werkzeug.male(h, w, { klein: true }); } catch (e) { h.remove(); }
      });
      if (karteFuer) karte(karteFuer);
    }
    // „Das hab ich mir gemerkt“: nur dein Satz und der Name – und ein Weg, es zu berichtigen
    function karte(d) {
      var w = C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(d.id) : null;
      if (!w) { karteFuer = null; return; }
      var alt = el.meins.querySelector('.c6rz-karte'); if (alt) alt.remove();
      var k = mach('section', 'c6rz-karte', el.meins);
      k.setAttribute('aria-label', 'Das hab ich mir gemerkt');
      var anders = Array.isArray(w.anders) ? w.anders.filter(Boolean) : [];
      var satzDt = d.bei && !anders.length ? 'Mein Beispiel' : 'Dein Satz'; // nach dem ersten „Anders“ ist es sein Satz
      k.innerHTML = '<p class="c6rz-karte-kopf">Das hab ich mir gemerkt</p>' +
        '<dl class="c6rz-karte-liste"><div><dt>' + satzDt + '</dt><dd class="c6rz-karte-satz">„' + esc(kurz(w.satz || d.satz, 200)) + '“</dd></div>' +
        (anders.length ? '<div><dt>Anders</dt><dd class="c6rz-karte-anders">' + esc(anders.join(' · ')) + '</dd></div>' : '') +
        '<div><dt>Name</dt><dd class="c6rz-karte-name">' + esc(w.name) + '</dd></div></dl>' +
        '<p class="c6rz-kosten">' + esc(kosten(d)) + '</p>' +
        '<button type="button" class="c6rz-korr">Stimmt so nicht</button>';
      k.querySelector('.c6rz-korr').onclick = function () { berichtigen(k, w, d); };
    }
    // Eine Zeile, die in jedem Zustand wahr ist: nur Gemessenes, keine erfundene Zahl
    function kosten(d) {
      var kopf = kopfText(d), sek = sekText(d.gedacht);
      if (d.von !== 'denk') {
        if (d.grund === 'zeit') return stimme('kostenGewartet', { sek: sek }, 'Ich hab {sek} Sekunden gewartet, dann eine Vorlage genommen.');
        if (d.grund === 'unbrauchbar' && kopf) return stimme('kostenDenkVorlage', { sek: sek, kopf: kopf }, '{kopf} hat {sek} Sekunden gedacht, brauchbar war es nicht. Darum eine Vorlage.');
        return stimme('kostenVorlage', null, 'Gedacht hab ich hier nicht, das ist eine Vorlage.');
      }
      if (d.kopf === 'lokal' && C6.stimme && C6.stimme.hat && C6.stimme.hat('rezeption.kostenLokal')) return stimme('kostenLokal', { sek: sek, modell: d.modell || '' }, 'Dein Rechner hat gedacht, {sek} Sekunden lang.');
      if (kopf) return stimme('kostenDenk', { sek: sek, kopf: kopf }, 'Gedacht hat {kopf}, {sek} Sekunden lang.');
      return stimme('kostenDenkOhne', { sek: sek }, '{sek} Sekunden gedacht.');
    }
    function berichtigen(k, w, d) {
      if (k.querySelector('.c6rz-korr-form')) return;
      var knopf = k.querySelector('.c6rz-korr'); if (knopf) knopf.hidden = true;
      var f = mach('form', 'c6rz-korr-form', k);
      f.innerHTML = '<p class="c6rz-korr-kopf">' + esc(stimme('korrektur', null, 'So stimmt es')) + '</p>' +
        '<label>' + (d.bei && !(w.anders && w.anders.length) ? 'Der Satz' : 'Dein Satz') + '<input type="text" name="satz" maxlength="200" value="' + esc(w.satz || d.satz || '') + '"></label>' +
        '<label>Name<input type="text" name="name" maxlength="28" value="' + esc(w.name || '') + '"></label>' +
        '<div class="c6rz-korr-wahl"><button type="submit" class="c6rz-knopf c6rz-haupt">So stimmt es</button><button type="button" class="c6rz-link" data-w="lassen">Doch so lassen</button></div>';
      f.querySelector('[data-w=lassen]').onclick = function () { f.remove(); if (knopf) knopf.hidden = false; };
      f.onsubmit = function (e) {
        e.preventDefault();
        var satz = f.elements.satz.value.trim(), name = f.elements.name.value.trim();
        var x = C6.werkzeug.hol(w.id); if (!x) return;
        if (satz && satz !== x.satz) { x.satz = kurz(satz, 200); if (karteFuer && karteFuer.id === x.id) karteFuer.bei = null; } // ein berichtigter Satz ist seiner
        if (name) x.name = kurz(name, 28);
        try { C6.speichern && C6.speichern(); } catch (e2) {}
        try { C6.bus.emit('werkzeug-eigen', { was: 'benutzt', id: x.id, sid: null }); } catch (e3) {}
        meinsSchl = ''; meinsZeichnen();
        sag(stimme('berichtigt', null, 'Gut, so merk ich es mir.'));
      };
      try { f.scrollIntoView({ block: 'nearest', behavior: C6.ruhig ? 'auto' : 'smooth' }); f.elements.satz.focus({ preventScroll: true }); } catch (e4) {}
    }

    // ---------- Beispiele (ein anderes Modul füllt den Platz; fehlt es, bleibt er still leer) ----------
    function beispieleMalen() {
      if (beispiele || !(C6.beispiele && typeof C6.beispiele.male === 'function')) return;
      try { beispiele = C6.beispiele.male(el.beispiele, { bauen: function (satz, id) { bauen(satz, id); } }) || { neu: function () {}, weg: function () {} }; } catch (e) { beispiele = null; }
    }

    // ---------- Rückrufe ----------
    C6.bus.on('rezeption-gebaut', function (d) {
      if (!d || !d.id) return;
      var w = C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(d.id) : null;
      karteFuer = Object.assign({}, d);
      meinsSchl = ''; meinsZeichnen(d.id);
      // nach einem Beispiel war der Satz Carls, nicht „dein Satz“; sonst steht das Gespeicherte (w.satz) in der Blase, gekürzt – die Karte trägt es ganz
      // kurz: die Karte zeigt, was gemerkt ist; die Blase sagt nur, dass
      if (w && d.bei) sag(stimme('beispielGebaut', { name: w.name }, 'Das hab ich mir gemerkt. War mein Beispiel, jetzt ist es deins.'));
      else if (w) sag(stimme('gemerkt', { name: w.name, satz: kurz(w.satz || d.satz || '', 60) }, 'Das hab ich mir gemerkt. Beides gehört dir.'));
      // angekommen: das erste eigene Werkzeug steht (eigener Schlüssel, nicht der Rundgang)
      try { if (!(C6.S.du && C6.S.du.angekommen)) C6.aendern(function (st) { st.du = st.du || {}; st.du.angekommen = Date.now(); }); } catch (e) {}
      if (ctl) { try { ctl.stimmung('froh'); if (!C6.ruhig) ctl.huepf(10); } catch (e) {} }
      if (hier) {
        setTimeout(feldLeihen, 0);
        // die Karte kommt ganz ins Bild (am iPhone lagen Kosten-Zeile und „Stimmt so nicht“ sonst unter dem Feld)
        setTimeout(function () { var k = el.meins.querySelector('.c6rz-karte'); try { if (k) k.scrollIntoView({ block: 'end', behavior: C6.ruhig ? 'auto' : 'smooth' }); else el.tresen.scrollTop = 0; } catch (e2) { el.tresen.scrollTop = 0; } }, 80);
      }
    });
    C6.bus.on('rezeption-frei', function () { if (hier) setTimeout(feldLeihen, 0); });
    // die Blase folgt dem Moment: bauen → gebaut (oder gleich, gewartet) → gemerkt; zu → zurück zum Gruß
    var MOMENT = { baut: 'Ich bau es dir. Schau zu.', gebaut: 'So hab ich deinen Satz verstanden. Probier es aus.', gebautVorlage: 'Probier es aus. Ändern geht gleich.', gleich: 'Gleich geblieben, mitdenken kann ich hier nicht. Anders wird es mit Wörtern wie „jeden Tag“, „zählen“, „Liste“ oder „Termin“.', gewartet: '25 Sekunden sind um, länger warte ich nicht. Probier das hier aus, ändern geht gleich.' };
    C6.bus.on('rezeption-moment', function (d) {
      if (!d || !MOMENT[d.was]) return;
      sag(stimme(d.was, null, MOMENT[d.was]));
      if (ctl) { try { ctl.stimmung(d.was === 'baut' ? 'arbeitet' : 'ruhig'); } catch (e) {} }
    });
    C6.bus.on('rezeption-zu', function () {
      if (ctl) { try { ctl.stimmung('ruhig'); } catch (e) {} }
      erster();
      if (hier) setTimeout(feldLeihen, 0);
    });
    C6.bus.on('werkzeug-eigen', function (d) { if (d && (d.was === 'gehaengt' || d.was === 'weg' || d.was === 'benutzt')) meinsZeichnen(); });
    // der Kern gibt bei jedem Raumwechsel jede Leihe zurück – danach leiht die Rezeption neu
    C6.bus.on('raum', function (id) { if (id === 'rezeption' && hier) setTimeout(feldLeihen, 0); });
    C6.bus.on('geraet', groesse);

    function groesse() {
      var comp = C6.geraet === 'computer';
      wurzel.classList.toggle('c6rz-computer', comp);
      if (ctl) { try { ctl.groesse(comp ? 200 : 120); } catch (e) {} }
    }

    erster(); groesse(); meinsZeichnen();
    return {
      betreten: function () {
        hier = true;
        // der Gruß steht wieder; nach einem Bau rollt der Boden nach oben (die Karte darf nicht mitten im Bild hängen), sonst bleibt die Lage wie verlassen
        erster(); if (karteFuer) { try { el.tresen.scrollTop = 0; } catch (e0) {} }
        groesse(); meinsZeichnen(); beispieleMalen();
        if (ctl) { try { if (ctl.stimmungJetzt === 'schlaeft') ctl.stimmung('ruhig'); ctl.blick(0.2, 0.1); setTimeout(function () { ctl && ctl.blick(); }, 1400); } catch (e) {} }
        setTimeout(feldLeihen, 0);
      },
      verlassen: function () { hier = false; feldZurueck(); },
      groesse: groesse
    };
  }
});
