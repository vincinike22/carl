// Rezeption: Was steht an? Die sieben Fächer der Tage, der Brief im Postfach, und ein Satz von dir wird ein Werkzeug neben Carl.
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
// ein Satz aus Carls Stimme mit vollem Schlüssel (tage.*, vorb.*, kalender.*); Ersatz, wenn er fehlt
function sp(k, w, ersatz) {
  try { var t = C6.stimme && C6.stimme.fest ? C6.stimme.fest(k, w || {}) : ''; if (t && !/\{[a-z]+\}/i.test(t)) return t; } catch (e) {}
  return ersatz.replace(/\{(\w+)\}/g, function (m, s) { return w && w[s] != null ? String(w[s]) : m; });
}
var WT_LANG = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };
var VNAME = { karteikarten: 'Karteikarten', packliste: 'Packliste', merkzettel: 'Merkzettel' };
function wannText(n) { return n === 0 ? sp('tage.wann.heute', null, 'heute') : n === 1 ? sp('tage.wann.morgen', null, 'morgen') : n === 2 ? sp('tage.wann.uebermorgen', null, 'übermorgen') : sp('tage.wann.in', { n: n }, 'in {n} Tagen'); }
function tageDa() { return !!(C6.tage && typeof C6.tage.liste === 'function'); }
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

// Vorbereitungen und „Was ansteht“ liegen in ihren Fächern; neben Carl steht nur, was du dir hast bauen lassen
function meine() { try { return (C6.werkzeug && C6.werkzeug.alle ? C6.werkzeug.alle() : []).filter(function (w) { return !w.sid && !w.vb && !w.vorb && !w.wasAnsteht; }); } catch (e) { return []; } }
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
      '<div class="c6rz-welt"></div>' +
      '<div class="c6rz-postfach" aria-label="Postfach"></div>' +
      '<div class="c6rz-carl"></div>' +
      '<p class="c6rz-satz" aria-live="polite"><span class="c6rz-satz-text"></span><i class="c6rz-zipfel" aria-hidden="true">' + ZIPFEL + '</i></p>' +
      '<div class="c6rz-boden">' +
        '<div class="c6rz-faecher" role="group" aria-label="Die nächsten sieben Tage" hidden></div>' +
        '<div class="c6rz-meins" hidden></div>' +
      '</div>' +
      '<section class="c6rz-tagesblatt" hidden></section>';
    function q(s) { return wurzel.querySelector(s); }
    var el = { tresen: q('.c6rz-boden'), carl: q('.c6rz-carl'), satz: q('.c6rz-satz-text'), meins: q('.c6rz-meins'), welt: q('.c6rz-welt'), postfach: q('.c6rz-postfach'), faecher: q('.c6rz-faecher'), blatt: q('.c6rz-tagesblatt') };
    var hier = false, leiheZurueck = null, ctl = null, karteFuer = null;

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
      var s0 = String(satz == null ? '' : satz).trim();
      if (!s0) return { satz: stimme('leer', null, 'Ein Satz reicht. Was fehlt dir?') };
      if (!/[a-zäöüß]{3,}/i.test(s0)) return { satz: stimme('unsinn', null, 'Da kann ich noch nichts draus bauen. Was willst du zählen, abhaken oder nicht vergessen?') };
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

    // ---------- Was steht an: die sieben Fächer, das Tagesblatt am Tresen, das Postfach ----------
    var offen = null, blattSchl = '', vbCtl = null;
    function weltFaecher() { return el.welt.querySelectorAll('[data-c6rw-fach][data-tag]'); }
    // Postfach: das der Welt, wenn sie eins hat; sonst der Schlitz vorn im Tresen
    function postfachEl() { return el.welt.querySelector('[data-c6rw-postfach]') || el.postfach; }
    function weltPruef() {
      var welt = !!el.welt.querySelector('[data-c6rw-postfach]');
      el.postfach.hidden = welt;
      el.faecher.hidden = !tageDa() || weltFaecher().length > 0;
    }
    C6.rezeption.postfach = postfachEl;

    function tagListe() { try { return tageDa() ? C6.tage.liste() : []; } catch (e) { return []; } }
    function datumLang(t) { return WT_LANG[t.wochentag] + ', ' + (C6.tage.datum ? C6.tage.datum(t.tag) : t.tag); }
    function fachLabel(t) {
      var was = t.termine.length ? t.termine.map(function (x) { return x.titel; }).join(', ') : 'nichts';
      var vb = t.vorbereitet.map(function (v) { return (VNAME[v.art] || v.art) + ' liegen bereit'; });
      return (t.heute ? 'Heute, ' : '') + datumLang(t) + ': ' + was + (vb.length ? '. ' + vb.join(', ') : '');
    }
    var ersatzSchl = '';
    function faecherZeichnen() {
      if (!tageDa()) return;
      var l = tagListe(), map = {};
      l.forEach(function (t) { map[t.tag] = t; });
      // die Fächer der Welt bekommen ihre Ansage hier; zeichnen tut sie die Welt selbst
      [].forEach.call(weltFaecher(), function (f) {
        var t = map[f.getAttribute('data-tag')]; if (!t) return;
        f.setAttribute('aria-label', fachLabel(t));
        f.setAttribute('aria-expanded', String(offen === t.tag));
      });
      weltPruef();
      if (el.faecher.hidden) return;
      var schl = JSON.stringify(l.map(function (t) { return [t.tag, t.termine.length, t.vorbereitet.length, t.termine.map(function (x) { return x.titel; }).join('|')]; })) + offen;
      if (schl === ersatzSchl) return;
      ersatzSchl = schl;
      el.faecher.textContent = '';
      l.forEach(function (t) {
        var b = mach('button', 'c6rz-fach', el.faecher);
        b.type = 'button';
        b.setAttribute('data-tag', t.tag);
        b.setAttribute('data-zustand', t.vorbereitet.length ? 'vorbereitet' : t.termine.length ? 'termin' : 'leer');
        if (t.heute) b.classList.add('c6rz-fach-heute');
        b.setAttribute('aria-label', fachLabel(t));
        b.setAttribute('aria-expanded', String(offen === t.tag));
        var punkte = '';
        for (var i = 0; i < Math.min(3, t.termine.length); i++) punkte += '<i></i>';
        b.innerHTML = '<span class="c6rz-fach-wt" aria-hidden="true">' + (t.heute ? 'heute' : esc(t.wochentag)) + '</span><span class="c6rz-fach-nr" aria-hidden="true">' + (+t.tag.slice(8)) + '</span><span class="c6rz-fach-drin" aria-hidden="true">' + punkte + (t.vorbereitet.length ? '<b></b>' : '') + '</span>';
      });
    }

    // Die Zeile über den Kalender: wahr je Zustand; leise, solange alles geht
    var appleGesagt = false;
    function kalenderZeile(box, oben) {
      var st = C6.tage.status(), z = null, knopf = null, g = st.grund;
      // aus = der Schalter „Kalender lesen“ im Buch steht auf aus: ehrlich sagen und auf den einen Schalter zeigen (kein zweiter hier)
      if (st.kalender === 'aus') { z = sp('kalender.aus', null, 'In deinen Kalender schau ich nicht, der Schalter steht auf aus. Hier liegt nur, was du selbst einträgst.'); if (C6.atlas && typeof C6.atlas.oeffne === 'function') knopf = { t: sp('kalender.zumSchalter', null, 'Zum Schalter im Buch'), f: function () { try { C6.atlas.oeffne({ seite: 'kann' }); } catch (e) {} } }; }
      else if (st.kalender === 'laedt') z = sp('kalender.laedt', null, 'Ich schau in deinen Kalender.');
      else if (st.kalender === 'nicht-verbunden' && (g === 'kein-mcp' || g === 'not_granted' || /^capability_/.test(g || '') || g === 'user_changed')) z = sp('kalender.geht-nicht', null, 'Von hier aus komm ich an keinen Kalender heran. Was in deinen Werkzeugen steht, zeig ich trotzdem.');
      else if (st.kalender === 'nicht-verbunden' && g === 'selection_required') z = sp('kalender.auswahl', null, 'Ich seh mehr als einen Google Kalender und weiß nicht, welcher gemeint ist.');
      else if (st.kalender === 'nicht-verbunden') { z = sp('kalender.nicht-verbunden', null, 'Noch kein Kalender verbunden. Bis dahin zeig ich nur, was in deinen eigenen Werkzeugen steht.'); knopf = { t: sp('kalender.wieChip', null, 'Wie verbinde ich ihn?'), f: function (p) { p.textContent = sp('kalender.wie', null, 'In Claude unter Einstellungen bei den Konnektoren „Google Calendar“ hinzufügen. Danach lese ich deine Termine, ändern kann ich nichts.'); } }; }
      else if (st.kalender === 'neu-verbinden') { z = sp('kalender.neu-verbinden', null, 'Verbinde deinen Kalender in den Einstellungen von Claude neu, dann seh ich deine Termine wieder.'); knopf = { t: 'Nochmal nachschauen', f: function () { C6.tage.neu(); } }; }
      else if (st.kalender === 'kein-zugriff' && g === 'approval_required') { z = sp('kalender.fragen', null, 'Ich schau erst in deinen Kalender, wenn du es erlaubst.'); knopf = { t: sp('kalender.freigeben', null, 'Kalender lesen lassen'), f: function () { C6.tage.freigeben(); } }; }
      else if (st.kalender === 'kein-zugriff') z = sp('kalender.kein-zugriff', null, 'Deinen Kalender darf ich hier nicht lesen.');
      else if (st.kalender === 'fehler' && g === 'unlesbar') z = sp('kalender.unlesbar', null, 'Dein Kalender hat geantwortet, aber lesen konnte ich nichts davon. Erfinden mag ich nichts.');
      else if (st.kalender === 'fehler' && (g === 'server_unavailable' || g === 'rate_limited')) { z = sp('kalender.fehler', null, 'Dein Kalender antwortet gerade nicht. Ich frag später nochmal.'); knopf = { t: 'Jetzt nachschauen', f: function () { C6.tage.neu(); } }; }
      else if (st.kalender === 'fehler') z = sp('kalender.fehlerFest', null, 'Dein Kalender hat nicht geantwortet. Was in deinen Werkzeugen steht, zeig ich trotzdem.');
      else if (st.ungelesen === 1) z = sp('kalender.ungelesenEins', null, 'Einen Eintrag konnte ich nicht lesen, den lass ich weg.');
      else if (st.ungelesen) z = sp('kalender.ungelesen', { n: st.ungelesen }, '{n} Einträge konnte ich nicht lesen, die lass ich weg.');
      if (!z) return;
      var p = mach('p', 'c6rz-tb-kalender' + (oben ? ' c6rz-tb-kalender-oben' : ''), box, z);
      p.setAttribute('data-kalender', st.kalender);
      if (knopf) { var b = mach('button', 'c6rz-link', p, knopf.t); b.type = 'button'; b.onclick = function (e) { e.stopPropagation(); knopf.f(p); }; }
      // Apple nur dort, wo man nach einem Kalender fragt: wenn keiner verbunden ist
      if (st.kalender === 'nicht-verbunden' && (!appleGesagt || appleGesagt === offen)) { appleGesagt = offen; mach('span', 'c6rz-tb-apple', p, ' ' + sp('kalender.apple', null, 'Apple Kalender erreiche ich hier im Browser nicht.')); }
    }

    function eintragZeile(box, t) {
      if (!C6.tage.eintragen) return;
      var z = mach('div', 'c6tg-eintrag', box);
      z.setAttribute('data-tag', t.tag);
      var V = C6.vorbereitung;
      if (V && typeof V.eintragZeile === 'function') { try { V.eintragZeile(z, { tag: t.tag, leer: !t.termine.length }); if (z.childNodes.length) return; } catch (e) {} }
      var f = mach('form', 'c6rz-tb-eintrag', z);
      var frage = t.termine.length ? sp('tage.eintragMehr', null, 'Steht noch etwas an dem Tag an?') : sp('tage.eintrag', null, 'Was steht an dem Tag an?');
      var lab = mach('label', null, f); mach('span', 'c6rz-tb-eintrag-frage', lab, frage);
      var inp = mach('input', null, lab); inp.type = 'text'; inp.maxLength = 80; inp.placeholder = sp('tage.eintragPlatz', null, 'z. B. Mathe-Prüfung');
      var bt = mach('button', 'c6rz-knopf', f, sp('tage.eintragen', null, 'Eintragen')); bt.type = 'submit';
      f.addEventListener('click', function (e) { e.stopPropagation(); });
      f.onsubmit = function (e) {
        e.preventDefault(); e.stopPropagation();
        var v = inp.value.trim(); if (!v) { inp.focus(); return; }
        var r = C6.tage.eintragen(t.tag, v);
        if (r) sag(sp('tage.eingetragen', { titel: kurz(r.titel, 40) }, '„{titel}“ liegt jetzt im Fach.'));
      };
    }
    function vbWeg() { if (vbCtl && vbCtl.weg) { try { vbCtl.weg(); } catch (e) {} } vbCtl = null; }
    // eine Vorbereitung öffnen: als Ding zum Denken (eigenes Modul), sonst das große Werkzeug-Blatt
    function vbOeffnen(li, v) {
      var w = C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(v.werkzeugId) : null;
      if (!w) return;
      if (!(C6.vorbereitung && typeof C6.vorbereitung.oeffne === 'function')) { try { C6.werkzeug.gross(v.werkzeugId); } catch (e) {} return; }
      var alt = li.querySelector('.c6tg-vb');
      vbWeg();
      if (alt) { alt.remove(); li.classList.remove('c6rz-tb-vb-offen'); el.blatt.classList.remove('c6rz-tb-vb-aktiv'); setTimeout(blattLage, 0); return; }
      [].forEach.call(el.blatt.querySelectorAll('.c6tg-vb'), function (x) { x.remove(); });
      var box = mach('div', 'c6tg-vb', li);
      li.classList.add('c6rz-tb-vb-offen'); el.blatt.classList.add('c6rz-tb-vb-aktiv');
      try { vbCtl = C6.vorbereitung.oeffne(box, Object.assign({}, w.vb || {}, { werkzeugId: w.id })) || null; } catch (e) { box.remove(); try { C6.werkzeug.gross(v.werkzeugId); } catch (e2) {} }
      if (!box.childNodes.length && box.parentNode) { box.remove(); li.classList.remove('c6rz-tb-vb-offen'); } // das Ding hat sich woanders geöffnet
      // das Ding beginnt gleich unter dem Kopf des Blatts: so passt es ganz, ohne dass ein Knopf am Rand hängt
      setTimeout(function () { blattLage(); try { var kp = el.blatt.querySelector('.c6rz-tb-kopf'), kb = kp ? kp.getBoundingClientRect().bottom : el.blatt.getBoundingClientRect().top; el.blatt.scrollTop += box.getBoundingClientRect().top - kb - 6; } catch (e) {} }, 30);
    }
    var fehlerBei = {};
    function vorbereiten(t, art, knopf) {
      knopf.disabled = true; knopf.textContent = sp('vorb.laeuft', null, 'Ich mach mich dran …');
      if (ctl) { try { ctl.stimmung('arbeitet'); } catch (e) {} }
      C6.tage.vorbereiten(t, art).then(function (r) {
        if (ctl) { try { ctl.stimmung(r && r.ok ? 'froh' : 'ruhig'); if (r && r.ok && !C6.ruhig) ctl.huepf(10); } catch (e) {} }
        if (r && r.ok && r.leer && r.satz) { delete fehlerBei[t.id]; sag(r.satz); }
        else if (r && r.ok && r.leer) { delete fehlerBei[t.id]; sag(sp('vorb.keinKopf.' + art, null, 'Mitdenken geht hier gerade nicht, darum erfinde ich nichts. Ich leg dir ein leeres hin, du schreibst das Erste drauf.')); }
        else if (r && r.ok) { delete fehlerBei[t.id]; sag(art === 'karteikarten' && r.n > 1 ? sp('vorb.fertig.karteikarten', { n: r.n, titel: kurz(t.titel, 40) }, 'Fertig. {n} Karten für „{titel}“ liegen im Fach.') : sp('vorb.fertig', { titel: kurz(t.titel, 40) }, 'Fertig. Für „{titel}“ liegt es jetzt im Fach.')); }
        else if (r && r.grund === 'schon') sag(sp('vorb.schon', null, 'Dafür hab ich schon was vorbereitet. Es liegt im Fach.'));
        else if (r && r.grund !== 'laeuft') { fehlerBei[t.id] = r.grund; if (r.satz) sag(r.satz); }
        blattZeichnen(true);
      });
    }
    // Das Tagesblatt liegt am Tresen: der Tag, seine Termine, je Termin, was Carl tun kann oder getan hat
    function blattZeichnen(neu) {
      if (!offen || !tageDa()) { el.blatt.hidden = true; return; }
      var l = tagListe(), t = l.filter(function (x) { return x.tag === offen; })[0];
      if (!t) { tag(null); return; }
      var st = C6.tage.status();
      var schl = JSON.stringify(t) + st.kalender + st.grund + st.ungelesen + JSON.stringify(fehlerBei) + JSON.stringify(t.termine.map(function (x) { return C6.tage.laeuft(x.id); }));
      if (!neu && schl === blattSchl) return;
      if (schl === blattSchl && el.blatt.querySelector('.c6tg-vb')) return; // eine offene Vorbereitung bleibt offen, solange sich nichts ändert
      blattSchl = schl;
      vbWeg();
      var b = el.blatt;
      b.textContent = ''; b.hidden = false;
      b.setAttribute('aria-label', (t.heute ? 'Heute, ' : '') + datumLang(t));
      var kopf = mach('header', 'c6rz-tb-kopf', b);
      mach('p', 'c6rz-tb-tag', kopf, t.heute ? 'Heute' : WT_LANG[t.wochentag]);
      mach('p', 'c6rz-tb-datum', kopf, (C6.tage.datum ? C6.tage.datum(t.tag) : t.tag) + (t.abstand > 0 ? ' · ' + wannText(t.abstand) : ''));
      var zu = mach('button', 'c6rz-tb-zu', kopf); zu.type = 'button'; zu.setAttribute('aria-label', 'Tag zuklappen');
      zu.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      zu.onclick = function (e) { e.stopPropagation(); tag(null); };
      // ohne Kalender zuerst die Wahrheit, warum die Fächer so leer sind (nicht unter dem Falz)
      var kalOben = C6.tage.status().kalender !== 'verbunden' && !l.some(function (d) { return d.termine.length || d.vorbereitet.length; });
      if (kalOben) kalenderZeile(b, true);
      var vbVon = {}; t.vorbereitet.forEach(function (v) { vbVon[v.termId] = v; });
      if (t.termine.length) {
        var ul = mach('ul', 'c6rz-tb-termine', b);
        t.termine.forEach(function (x) {
          var li = mach('li', 'c6rz-tb-termin', ul);
          li.setAttribute('data-art', x.art || '');
          var zeile = mach('p', 'c6rz-tb-zeile', li);
          mach('span', 'c6rz-tb-zeit', zeile, x.zeit || 'ganztags');
          mach('span', 'c6rz-tb-titel', zeile, x.titel);
          var wzN = x.werkzeugId && C6.werkzeug && C6.werkzeug.hol ? (C6.werkzeug.hol(x.werkzeugId) || {}).name : '';
          mach('small', 'c6rz-tb-quelle', li, x.quelle === 'kalender' ? sp('tage.woher.kalender', null, 'aus deinem Kalender') : sp('tage.woher.werkzeug', { werkzeug: wzN || '' }, 'aus deinem Werkzeug „{werkzeug}“'));
          var v = vbVon[x.id], art = C6.tage.vorschlag(x);
          if (v) {
            var vw = C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(v.werkzeugId) : null, leer = !!(vw && vw.vb && vw.vb.herkunft === 'leer');
            // ein leer hingelegtes Ding ist noch nicht „vorbereitet“: das sagt Carl auch so
            mach('p', 'c6rz-tb-angebot', li, leer ? sp('tage.vorbereitetLeer', { titel: x.titel }, 'Für „{titel}“ liegt ein leeres im Fach. Das Erste schreibst du drauf.') : sp('tage.vorbereitet', { titel: x.titel }, 'Für „{titel}“ hab ich schon was vorbereitet. Es liegt hier im Fach.'));
            var ob = mach('button', 'c6rz-knopf c6rz-tb-auf', li, sp('vorb.oeffnen.' + v.art, null, (VNAME[v.art] || 'Vorbereitung') + ' ansehen'));
            ob.type = 'button'; ob.onclick = function (e) { e.stopPropagation(); vbOeffnen(li, v); };
          } else if (art && !C6.tage.abgelehnt(x.id)) {
            var tt = Object.assign({ tag: t.tag, abstand: t.abstand }, x);
            var satzA = fehlerBei[x.id] === 'kein-kopf' ? sp('vorb.keinKopf', null, 'Dafür brauche ich jemanden, der mitdenkt. Hier denkt gerade keiner mit.')
              : fehlerBei[x.id] ? sp('vorb.leer', null, 'Daraus ist nichts Brauchbares geworden. Ich lass es lieber, als dir Unsinn hinzulegen.')
              : x.art === 'vortrag' || x.art === 'bewerbung' ? sp('vorb.angebot.' + art + '.' + x.art, { titel: x.titel, wann: wannText(t.abstand) }, x.art === 'vortrag' ? '„{titel}“ ist {wann}. Soll ich dir Karteikarten mit Stichworten machen?' : '„{titel}“ ist {wann}. Soll ich dir einen Merkzettel mit Fragen machen, die kommen könnten?')
              : sp('vorb.angebot.' + art, { titel: x.titel, wann: wannText(t.abstand) }, { karteikarten: 'Soll ich dir Karteikarten dafür machen?', packliste: 'Soll ich dir eine Packliste machen?', merkzettel: 'Soll ich dir einen Merkzettel machen, mit dem, was du schon aufgeschrieben hast?' }[art]);
            mach('p', 'c6rz-tb-angebot', li, satzA);
            if (fehlerBei[x.id] !== 'kein-kopf') {
              var lauf = C6.tage.laeuft(x.id);
              var kb = mach('button', 'c6rz-knopf c6rz-haupt c6rz-tb-ja', li, lauf ? sp('vorb.laeuft', null, 'Ich mach mich dran …') : (fehlerBei[x.id] ? 'Noch einmal versuchen' : sp('brief.ja', null, 'Ja, mach das')));
              kb.type = 'button'; kb.disabled = !!lauf;
              kb.onclick = function (e) { e.stopPropagation(); vorbereiten(tt, art, kb); };
              if (!lauf) {
                var nb = mach('button', 'c6rz-link c6rz-tb-nein', li, sp('vorb.nein', null, 'Nicht nötig'));
                nb.type = 'button'; nb.onclick = function (e) { e.stopPropagation(); C6.tage.ablehnen(x.id); sag(sp('vorb.neinGut', null, 'Gut. Dazu frag ich nicht nochmal.')); };
              }
            }
          }
        });
      } else {
        var tagW = t.abstand === 0 ? sp('tage.wann.heute', null, 'heute') : t.abstand === 1 ? sp('tage.wann.morgen', null, 'morgen') : WT_LANG[t.wochentag];
        mach('p', 'c6rz-tb-leer', b, sp('tage.tagLeer', { tag: tagW }, 'Für {tag} weiß ich von nichts.').replace(/^./, function (c) { return c.toUpperCase(); }));
        // ganz leeres Regal: ein einziges, gekennzeichnetes Beispiel, wie ein vorbereitetes Fach aussieht
        if (!l.some(function (d) { return d.termine.length || d.vorbereitet.length; })) {
          var bs = mach('p', 'c6rz-tb-beispiel', b);
          mach('b', null, bs, sp('tage.beispiel.marke', null, 'Beispiel'));
          // das Blatt zeigt kein Bild: darum ein Satz, der ohne „so liegt es da“ stimmt
          bs.appendChild(D.createTextNode(' ' + sp('tage.beispielBlatt', { titel: sp('tage.beispiel.titel', null, 'Mathe-Prüfung'), ding: sp('tage.beispiel.ding', null, 'Karteikarten') }, 'Steht in einem Fach „{titel}“, frag ich dich, ob ich dir {ding} machen soll. Die liegen dann im Fach.')));
        }
      }
      // selbst eintragen: was an diesem Tag ansteht, ohne Kalender (ein eigenes Termin-Werkzeug)
      eintragZeile(b, t);
      if (!kalOben) kalenderZeile(b);
      setTimeout(blattLage, 0);
    }
    // das Blatt liegt über dem Feld: wenn sein Inhalt höher ist als der Platz, rollt es in sich, und sein Ende bleibt sichtbar
    function blattLage() {
      var b = el.blatt;
      // offen: Oberkante = Unterkante des Regals + 8 px (gemessen); die Welt darf es mit --c6rz-blatt-oben-offen selbst bestimmen
      try {
        if (!offen || !b || b.hidden) wurzel.style.removeProperty('--c6rz-blatt-oben');
        else {
          var eigen = getComputedStyle(wurzel).getPropertyValue('--c6rz-blatt-oben-offen').trim();
          var rg = el.welt.querySelector('.c6rw-regal'), wr = wurzel.getBoundingClientRect();
          if (eigen) wurzel.style.setProperty('--c6rz-blatt-oben', eigen);
          else if (rg) { var rr = rg.getBoundingClientRect(); if (rr.height) wurzel.style.setProperty('--c6rz-blatt-oben', Math.round(rr.bottom - wr.top + 8) + 'px'); }
        }
      } catch (e) {}
      if (!b || b.hidden) return;
      b.classList.toggle('c6rz-tb-rollt', b.scrollHeight > b.clientHeight + 2);
    }
    if ('ResizeObserver' in window) { try { new ResizeObserver(function () { blattLage(); }).observe(el.blatt); } catch (e) {} }
    function tag(k) {
      var neuK = k && k !== offen ? k : null;
      if (k && k === offen) neuK = null;
      offen = neuK;
      buehne.toggleAttribute('data-tag-offen', !!offen);
      if (offen) buehne.setAttribute('data-tag-offen', offen);
      blattSchl = '';
      blattZeichnen(true);
      faecherZeichnen();
      if (offen) { try { el.blatt.scrollTop = 0; el.blatt.focus({ preventScroll: true }); } catch (e) {} }
      blattLage();
      try { C6.bus.emit('rezeption-tag', { tag: offen }); } catch (e) {}
    }
    el.blatt.tabIndex = -1;
    C6.rezeption.tag = function (k) { if (k === null) { if (offen) tag(offen); } else tag(k); };
    wurzel.addEventListener('click', function (e) {
      var f = e.target && e.target.closest ? e.target.closest('[data-c6rw-fach][data-tag], .c6rz-fach[data-tag]') : null;
      if (!f || !wurzel.contains(f)) return;
      e.stopPropagation();
      tag(f.getAttribute('data-tag'));
    });
    el.blatt.addEventListener('keydown', function (e) { if (e.key === 'Escape' && offen) { e.stopPropagation(); var k = offen; tag(k); var f = wurzel.querySelector('[data-tag="' + k + '"]'); if (f) try { f.focus(); } catch (x) {} } });
    C6.bus.on('tage', function (d) {
      if (!d) return;
      faecherZeichnen();
      if (offen && (d.was === 'stand' || d.was === 'status' || d.was === 'vorbereitet' || d.was === 'fehler' || d.was === 'laeuft')) blattZeichnen(false);
    });
    C6.bus.on('rezeption-welt', function (d) { if (d && d.was === 'gebaut') { weltPruef(); faecherZeichnen(); } });

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
      // Carls Größe gehört der Komposition (CSS --c6rz-carl), nicht dem Code
      var px = 0; try { px = parseFloat(getComputedStyle(wurzel).getPropertyValue('--c6rz-carl')) || 0; } catch (e) {}
      if (ctl) { try { ctl.groesse(px || (comp ? 232 : 150)); } catch (e) {} }
      blattLage();
    }

    erster(); groesse(); meinsZeichnen(); weltPruef(); faecherZeichnen();
    return {
      betreten: function () {
        hier = true;
        // der Gruß steht wieder; nach einem Bau rollt der Boden nach oben (die Karte darf nicht mitten im Bild hängen), sonst bleibt die Lage wie verlassen
        erster(); if (karteFuer) { try { el.tresen.scrollTop = 0; } catch (e0) {} }
        groesse(); meinsZeichnen(); weltPruef(); faecherZeichnen(); if (offen) blattZeichnen(true);
        if (ctl) { try { if (ctl.stimmungJetzt === 'schlaeft') ctl.stimmung('ruhig'); ctl.blick(0.2, 0.1); setTimeout(function () { ctl && ctl.blick(); }, 1400); } catch (e) {} }
        setTimeout(feldLeihen, 0);
      },
      verlassen: function () { hier = false; feldZurueck(); vbWeg(); },
      groesse: groesse
    };
  }
});
