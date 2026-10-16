// Vorbereitungen als Dinge: ein Stapel Karteikarten (antippen dreht um, „Gewusst“ legt sie rechts ab, „Nochmal“ links – einmal durch, dann siehst du, was wackelt),
// eine Packliste (abhaken), ein Merkzettel (Ideen aus deinen eigenen Zetteln, jede mit ihrer Herkunft).
// Inhalt kommt nur aus dem Mitdenken; ohne Kopf liegt das Ding leer da, und der erste Handgriff ist deiner.
(function () {
  var C6 = window.C6; if (!C6) return;
  var D = document;
  var ART = { karten: 'karteikarten', karteikarten: 'karteikarten', packliste: 'packliste', merkzettel: 'merkzettel' };
  var NAME = { karteikarten: 'Karteikarten', packliste: 'Packliste', merkzettel: 'Merkzettel' };
  var MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function kurz(t, n) { t = String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
  function stimme(k, w, ersatz) {
    try { var t = C6.stimme && C6.stimme.fest ? C6.stimme.fest('vorb.' + k, w || {}) : ''; if (t && !/\{[a-z]+\}/i.test(t)) return t; } catch (e) {}
    return String(ersatz || '').replace(/\{(\w+)\}/g, function (m, x) { return w && w[x] != null ? w[x] : ''; });
  }
  function bus(d) { try { C6.bus && C6.bus.emit('vorbereitung', d); } catch (e) {} }
  function ohneKopf() { try { var m = C6.mitdenken ? C6.mitdenken() : null; return !!m && m.echt === false; } catch (e) { return false; } }
  function tagKey(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function datumText(k) { var m = /^(\d{4})-(\d\d)-(\d\d)/.exec(String(k || '')); return m ? (+m[3]) + '. ' + MON[+m[2] - 1] : ''; }
  function tsText(ts) { var d = new Date(ts); return isNaN(d) ? '' : d.getDate() + '. ' + MON[d.getMonth()]; }

  /* ---------- Speicher: Fortschritt liegt in den Daten des Werkzeugs ---------- */
  function wz(id) { try { return C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(id) : null; } catch (e) { return null; } }
  function daten(id) {
    var s = C6.S || (C6.S = {});
    if (!s.werkzeug || typeof s.werkzeug !== 'object') s.werkzeug = { liste: [], daten: {} };
    if (!s.werkzeug.daten) s.werkzeug.daten = {};
    var d = s.werkzeug.daten[id] || (s.werkzeug.daten[id] = {});
    if (!d.vb || typeof d.vb !== 'object') d.vb = {};
    return d.vb;
  }
  function merken() { try { C6.speichern && C6.speichern(); } catch (e) {} }

  /* ---------- Was der Mensch selbst geschrieben hat (für Merkzettel und Bezug) ---------- */
  function alleZettel() {
    var s = C6.S || {}, sp = s.spaces || {}, r = [];
    Object.keys(sp).forEach(function (sid) {
      var f = null; try { f = C6.strings.hol(sid); } catch (e) { f = null; }
      ((sp[sid] || {}).notizen || []).forEach(function (n) { if (n && n.t && !n.von && !/^Fund\s*·/.test(n.t)) r.push({ t: String(n.t), ts: n.ts, sid: sid, wo: f ? f.titel : '' }); });
    });
    return r;
  }
  var STOPP = /^(Geburtstag|Birthday|Party|Feier|Fest|Prüfung|Pruefung|Klausur|Test|Reise|Fahrt|Urlaub|Termin|Vortrag|Treffen|Abgabe|Mein|Meine|Der|Die|Das|Am|Im|In|Zum|Zur|Von|Und)$/;
  function namenAus(titel) { return (String(titel || '').match(/[A-ZÄÖÜ][a-zäöüß]{2,}/g) || []).filter(function (w) { return !STOPP.test(w); }); }
  function wortRegex(n) { return new RegExp('(^|[^A-Za-zÄÖÜäöüß])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(s|\'s)?([^A-Za-zÄÖÜäöüß]|$)', 'i'); }
  // Zettel, die zum Termin gehören: tragen sie einen Namen aus dem Titel oder stehen sie in einem Space mit diesem Wort
  function passendeZettel(titel) {
    var namen = namenAus(titel); if (!namen.length) return [];
    return alleZettel().filter(function (z) { return namen.some(function (n) { var re = wortRegex(n); return re.test(z.t) || re.test(z.wo); }); }).slice(-12);
  }

  /* ---------- Inhalt: nur aus dem Mitdenken (und deinen Zetteln) ---------- */
  function denk(bitte, zettel) {
    if (!C6.denk) return Promise.resolve('');
    var d = zettel.length ? [{ art: 'daten', titel: 'Zettel des Menschen', text: zettel.map(function (z, i) { return (i + 1) + '. ' + z.t; }).join('\n'), quelle: 'Otto' }] : [];
    return Promise.resolve(C6.denk(bitte, { stumm: true, was: 'Vorbereitung', kontext: 'Vorbereitung auf einen Termin', daten: d })).then(function (t) { return String(t || ''); }, function () { return ''; });
  }
  function json(t) { var m = /\{[\s\S]*\}/.exec(String(t || '')); if (!m) return null; try { return JSON.parse(m[0]); } catch (e) { return null; } }
  function inhalt(termin, art) {
    art = ART[art] || art;
    var t = termin || {}, titel = kurz(t.titel, 80), wann = datumText(t.tag || t.datum), z = passendeZettel(titel);
    if (art === 'karteikarten') {
      return denk('Mach Karteikarten zur Vorbereitung auf „' + titel + '“' + (wann ? ' am ' + wann : '') + '. ' + (z.length ? 'Nimm den Stoff aus den Zetteln des Menschen (Daten-Klammer); was dort steht, wackelt bei ihm. ' : '') +
        'Antworte NUR mit JSON: {"karten":[{"vorne":"kurze Frage","hinten":"knappe Antwort","zettel":Nummer oder 0}]}. Höchstens 10 Karten. Schreib nichts, was du nicht sicher weißt; sagt der Titel zu wenig über den Stoff, mach weniger Karten.', z).then(function (x) {
        var j = json(x), k = (j && Array.isArray(j.karten) ? j.karten : []).map(function (c) { return c && c.vorne && c.hinten ? { vorne: kurz(c.vorne, 140), hinten: kurz(c.hinten, 260), aus: +c.zettel > 0 && z[+c.zettel - 1] ? kurz(z[+c.zettel - 1].t, 80) : '' } : null; }).filter(Boolean).slice(0, 12);
        return k.length ? { karten: k, herkunft: 'carl' } : null;
      });
    }
    if (art === 'packliste') {
      return denk('Schreib eine Packliste für „' + titel + '“' + (wann ? ' am ' + wann : '') + '. Antworte NUR mit JSON: {"punkte":["…"]}, höchstens 12 Dinge, je höchstens vier Wörter. ' + (z.length ? 'Was in den Zetteln des Menschen steht, kommt zuerst.' : ''), z).then(function (x) {
        var j = json(x), p = (j && Array.isArray(j.punkte) ? j.punkte : []).map(function (q) { return kurz(q, 50); }).filter(Boolean).slice(0, 12);
        return p.length ? { punkte: p, herkunft: 'carl' } : null;
      });
    }
    if (art === 'merkzettel') {
      // nur aus deinen Zetteln: jede Idee zeigt, woher sie kommt; ohne Kopf die Sätze selbst, im Code gefunden
      if (!z.length) return Promise.resolve({ punkte: [], quellen: [], herkunft: 'leer' });
      var roh = function () { return { punkte: z.slice(-8).map(function (q) { return kurz(q.t, 60); }), quellen: z.slice(-8).map(quelle), herkunft: 'zettel' }; };
      if (ohneKopf()) return Promise.resolve(roh());
      return denk('Für „' + titel + '“ sammelst du Geschenkideen, aber NUR aus den Zetteln des Menschen (Daten-Klammer). Erfinde nichts dazu. Antworte NUR mit JSON: {"ideen":[{"idee":"höchstens fünf Wörter","zettel":Nummer}]}. Gibt kein Zettel eine Idee her, antworte {"ideen":[]}.', z).then(function (x) {
        var j = json(x); if (!j || !Array.isArray(j.ideen)) return roh();
        var p = [], q = [];
        j.ideen.forEach(function (i) { var n = +(i && i.zettel); if (i && i.idee && n > 0 && z[n - 1] && p.length < 8) { p.push(kurz(i.idee, 50)); q.push(quelle(z[n - 1])); } });
        return { punkte: p, quellen: q, herkunft: p.length ? 'zettel' : 'leer' };
      });
    }
    return Promise.resolve(null);
  }
  function quelle(z) { return { t: kurz(z.t, 80), ts: z.ts || null, wo: z.wo || '', sid: z.sid || null }; }

  // Bauen: das Ergebnis ist ein Werkzeug (sid null), am Fach und an der Werkstattwand wiederzufinden
  var baut = {};
  function baue(termin, art) {
    art = ART[art] || art;
    var t = termin || {};
    if (!NAME[art] || !t.titel) return Promise.resolve({ ehrlich: true, satz: stimme('leer', null, 'Das ist mir nicht gelungen.') });
    var k = (t.id || t.titel) + '|' + art;
    if (baut[k]) return baut[k];
    var p = Promise.resolve(inhalt(t, art)).catch(function () { return null; }).then(function (x) {
      delete baut[k];
      var leer = !x || !((x.karten && x.karten.length) || (x.punkte && x.punkte.length));
      // mit Kopf, aber unbrauchbar: nichts hinlegen, ehrlich sagen (der Mensch kann es noch einmal versuchen)
      if (leer && !ohneKopf() && art !== 'merkzettel') return { ehrlich: true, satz: stimme('leer', null, 'Das ist mir nicht gelungen, brauchbar war es nicht.') };
      x = x || {};
      var vb = { art: art, termId: t.id || null, titel: kurz(t.titel, 80), tag: t.tag || (typeof t.datum === 'string' ? t.datum.slice(0, 10) : t.datum ? tagKey(new Date(t.datum)) : null), herkunft: leer ? 'leer' : (x.herkunft || 'carl') };
      var teil;
      if (art === 'karteikarten') { vb.karten = (x.karten || []).slice(0, 12); teil = vb.karten.length ? { t: 'frage', text: 'Karteikarten für „' + kurz(t.titel, 40) + '“', fragen: vb.karten.slice(0, 5).map(function (c) { return c.vorne; }) } : { t: 'notiz', text: 'Deine Karten für „' + kurz(t.titel, 40) + '“' }; }
      else { vb.punkte = (x.punkte || []).slice(0, 12); if (x.quellen) vb.quellen = x.quellen.slice(0, 12); teil = { t: 'liste', text: NAME[art] + ' für „' + kurz(t.titel, 40) + '“', punkte: vb.punkte.slice() }; }
      var w = null;
      try { w = C6.werkzeug.haenge({ name: kurz(NAME[art] + ' · ' + t.titel, 28), zeichen: art === 'karteikarten' ? 'frage' : 'liste', farbe: art === 'karteikarten' ? '#2c7a6e' : art === 'packliste' ? '#a95f33' : '#b0476a', teile: [teil], vb: vb, satz: kurz(t.titel, 120) }, null); } catch (e) { w = null; }
      if (!w) return { ehrlich: true, satz: stimme('leer', null, 'Das ist mir nicht gelungen.') };
      bus({ was: 'gebaut', id: w.id, art: art, termin: t.id || null, leer: leer });
      return { werkzeugId: w.id, leer: leer, satz: leer ? stimme('keinKopf.' + art, null, 'Mitdenken geht hier gerade nicht. Ich leg es dir leer hin, der erste Eintrag ist deiner.') : null };
    });
    baut[k] = p;
    return p;
  }

  /* ---------- Die Dinge ---------- */
  function karten(w) { var vb = (w && w.vb) || {}, eig = daten(w.id).eigene || []; return (vb.karten || []).map(function (c) { return Object.assign({ von: 'carl' }, c); }).concat(eig.map(function (c) { return Object.assign({ von: 'du' }, c); })); }
  function kopfHtml(vb, w) {
    var tag = datumText(vb.tag), bis = '';
    if (vb.tag) { var n = Math.round((new Date(vb.tag + 'T00:00:00') - new Date(tagKey() + 'T00:00:00')) / 864e5); bis = n === 0 ? 'heute' : n === 1 ? 'morgen' : n > 1 ? 'in ' + n + ' Tagen' : ''; }
    return '<p class="c6vb-kopf"><b>' + esc(stimme('name.' + vb.art, null, NAME[vb.art])) + '</b> für „' + esc(kurz(vb.titel || (w && w.name) || '', 50)) + '“' + (tag ? '<span>' + esc(tag) + (bis ? ' · ' + bis : '') + '</span>' : '') + '</p>';
  }
  // Karteikarten: der Stapel ist das Ding. Ein Tipp dreht die oberste Karte um; erst dann kommen „Gewusst“ und „Nochmal“.
  function stapel(el, w) {
    var id = w.id, vb = w.vb || {}, d = daten(id);
    var flip = false, schreibt = false;
    function alle() { return karten(w); }
    function reihe() {
      var n = alle().length;
      if (!Array.isArray(d.reihe)) d.reihe = [];
      d.reihe = d.reihe.filter(function (i) { return i < n; });
      // neue Karten (eigene, nachgeschriebene) kommen oben auf den Stapel, wenn sie weder liegen noch gewusst sind
      d.gewusst = d.gewusst || {};
      d.wackelt = d.wackelt || {};
      for (var i = 0; i < n; i++) if (d.reihe.indexOf(i) < 0 && !d.gewusst[i] && !d.wackelt[i]) d.reihe.push(i);
      return d.reihe;
    }
    function zeichne() {
      var k = alle(), r = reihe(), oben = r.length ? k[r[0]] : null, gew = Object.keys(d.gewusst || {}).filter(function (i) { return i < k.length; }).length;
      var h = kopfHtml(vb, w);
      if (!k.length) {
        // leer: kein erfundener Inhalt – der erste Handgriff ist deiner
        // die leere Karte ist das Formular: man schreibt direkt auf sie, vorne die Frage, unter dem Strich die Antwort
        h += '<p class="c6vb-satz">' + esc(stimme('karten.leer', null, 'Noch keine Karte. Vorne die Frage, hinten die Antwort.')) + ' ' + esc(stimme('karten.dreiSelbst', null, 'Schreib dir selbst drei, dann lohnt sich der Stapel.')) + '</p>' + formHtml(0);
        el.innerHTML = h; binde(); return;
      }
      if (!oben) {
        // einmal durch: was noch wackelt, steht da; daraus wird die nächste Runde
        var wack = Object.keys(d.wackelt || {}).map(Number).filter(function (i) { return i < k.length; });
        var satz = !wack.length ? stimme('karten.ende', null, 'Einmal durch. Keine hat gewackelt.') : wack.length === 1 ? stimme('karten.wackeltEins', null, 'Einmal durch. Eine wackelt noch, die leg ich nach oben.') : stimme('karten.wackelt', { n: wack.length }, 'Einmal durch. {n} wackeln noch, die leg ich nach oben.');
        h += '<div class="c6vb-tisch c6vb-tisch-ende"><div class="c6vb-ablage c6vb-ablage-nochmal" aria-hidden="true">' + stapelchen(wack.length) + '<small>' + esc(stimme('karten.nochmal', null, 'Nochmal')) + '</small></div><div class="c6vb-ablage c6vb-ablage-gewusst" aria-hidden="true">' + stapelchen(gew) + '<small>' + esc(stimme('karten.gewusst', null, 'Gewusst')) + '</small></div></div><p class="c6vb-satz" role="status">' + esc(satz) + '</p>' +
          (wack.length ? '<p class="c6vb-unter">' + esc(stimme('karten.wasWackelt', null, 'Was noch wackelt')) + '</p><ul class="c6vb-wackelt">' + wack.map(function (i) { return '<li>' + esc(k[i].vorne) + '</li>'; }).join('') + '</ul>' : '') +
          '<div class="c6vb-knoepfe">' + (wack.length ? '<button type="button" class="c6vb-knopf c6vb-haupt" data-w="wacklig">' + esc(stimme('karten.nurWacklige', null, 'Nur die wackligen')) + '</button>' : '') + '<button type="button" class="c6vb-knopf' + (wack.length ? '' : ' c6vb-haupt') + '" data-w="vorn">' + esc(stimme('karten.vonVorn', null, 'Von vorn')) + '</button></div>' + formHtml(k.length, true);
        el.innerHTML = h; binde(); return;
      }
      var hinter = Math.min(3, r.length - 1), wn = Object.keys(d.wackelt || {}).filter(function (i) { return i < k.length; }).length;
      h += '<div class="c6vb-tisch"><div class="c6vb-ablage c6vb-ablage-nochmal" aria-hidden="true">' + stapelchen(wn) + '<small>' + esc(stimme('karten.nochmal', null, 'Nochmal')) + '</small></div><div class="c6vb-stapel" style="--hinter:' + hinter + '">' +
        [3, 2, 1].filter(function (x) { return x <= hinter; }).map(function (x) { return '<i class="c6vb-unten" style="--i:' + x + '" aria-hidden="true"></i>'; }).join('') +
        '<button type="button" class="c6vb-karte" data-seite="' + (flip ? 'hinten' : 'vorne') + '" aria-label="' + esc((flip ? stimme('karten.hinten', null, 'Antwort') + ': ' + oben.hinten : stimme('karten.vorne', null, 'Frage') + ': ' + oben.vorne) + '. ' + stimme('karten.umdrehen', null, 'Karte umdrehen')) + '">' +
          '<span class="c6vb-seite c6vb-vorne"><small>' + esc(stimme('karten.vorne', null, 'Frage')) + '</small><em>' + esc(oben.vorne) + '</em></span>' +
          '<span class="c6vb-seite c6vb-hinten"><small>' + esc(stimme('karten.hinten', null, 'Antwort')) + '</small><em>' + esc(oben.hinten) + '</em>' + (oben.von === 'carl' ? '<i class="c6vb-von">' + esc(oben.aus ? stimme('karten.aus', { z: kurz(oben.aus, 40) }, 'von Carl, aus deinem Zettel „{z}“ · bitte prüfen') : stimme('karten.vonCarl', null, 'von Carl geschrieben · bitte prüfen')) + '</i>' : '<i class="c6vb-von">' + esc(stimme('karten.deine', null, 'deine Karte')) + '</i>') + '</span>' +
        '</button></div><div class="c6vb-ablage c6vb-ablage-gewusst" aria-hidden="true">' + stapelchen(gew) + '<small>' + esc(stimme('karten.gewusst', null, 'Gewusst')) + '</small></div></div>' +
        '<p class="c6vb-zaehler">' + esc(stimme('karten.stand', { n: r.length, g: gew, w: wn }, '{n} im Stapel · {g} gewusst · {w} nochmal')) + '</p>' +
        '<div class="c6vb-knoepfe c6vb-wahl"' + (flip ? '' : ' hidden') + '><button type="button" class="c6vb-knopf" data-w="nochmal">' + esc(stimme('karten.nochmal', null, 'Nochmal')) + '</button><button type="button" class="c6vb-knopf c6vb-haupt" data-w="gewusst">' + esc(stimme('karten.gewusst', null, 'Gewusst')) + '</button></div>' +
        formHtml(k.length, true);
      el.innerHTML = h; binde();
    }
    function stapelchen(n) { var s = ''; for (var i = 0; i < Math.min(n, 6); i++) s += '<i style="--i:' + i + '"></i>'; return s + (n ? '<b>' + n + '</b>' : ''); }
    function formHtml(n, zu) {
      if (zu && !schreibt) return '<button type="button" class="c6vb-link" data-w="schreib">' + esc(stimme('karten.dazu', null, 'Noch eine Karte')) + '</button>';
      return '<form class="c6vb-form"><div class="c6vb-form-karte"><label><small>' + esc(stimme('karten.vorne', null, 'Frage')) + '</small><input name="v" maxlength="140" autocomplete="off" placeholder="' + esc(stimme('karten.platzVorne', null, 'Was willst du gefragt werden?')) + '"></label>' +
        '<label><small>' + esc(stimme('karten.hinten', null, 'Antwort')) + '</small><input name="h" maxlength="260" autocomplete="off" placeholder="' + esc(stimme('karten.platzHinten', null, 'Und was ist die Antwort?')) + '"></label></div>' +
        '<button type="submit" class="c6vb-knopf c6vb-haupt">' + esc(n ? stimme('karten.legen', null, 'Auf den Stapel') : stimme('karten.erste', null, 'Erste Karte')) + '</button><p class="c6vb-bug" role="status" hidden></p></form>';
    }
    function weg(gewusst) {
      var r = reihe(), i = r[0]; if (i == null) return;
      var k = el.querySelector('.c6vb-karte');
      var fertig = function () {
        r.shift();
        if (gewusst) { d.gewusst[i] = Date.now(); if (d.wackelt && d.wackelt[i]) delete d.wackelt[i]; }
        else { d.wackelt = d.wackelt || {}; d.wackelt[i] = (d.wackelt[i] || 0) + 1; }
        d.zuletzt = Date.now(); merken(); flip = false; zeichne();
        bus({ was: 'gelernt', id: id, art: 'karteikarten', gewusst: !!gewusst });
        var nk = el.querySelector('.c6vb-karte'); if (nk) nk.focus();
      };
      if (C6.ruhig || !k || !k.animate) { fertig(); return; }
      var a = gewusst ? k.animate([{ transform: 'rotateY(180deg)' }, { transform: 'translate(70%, 8%) rotateY(180deg) rotate(8deg) scale(.6)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.4,0,.6,1)' })
        : k.animate([{ transform: 'rotateY(180deg)' }, { transform: 'translate(-70%, 8%) rotateY(180deg) rotate(-8deg) scale(.6)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.4,0,.6,1)' });
      a.onfinish = fertig;
    }
    function zeigeStapel() {
      var st = el.querySelector('.c6vb-stapel'), k = el.querySelector('.c6vb-karte');
      if (!st) return;
      // das nächste Blatt, das rollt, bringt den Stapel ins Bild (ohne die Seite selbst zu rollen)
      for (var p = st.parentElement; p && p !== D.body; p = p.parentElement) {
        var cs = getComputedStyle(p);
        if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 2) { var dr = st.getBoundingClientRect().top - p.getBoundingClientRect().top; p.scrollTop = Math.max(0, p.scrollTop + dr - 56); break; }
      }
      if (k) { try { k.focus({ preventScroll: true }); } catch (e) {} if (!C6.ruhig && k.animate) k.animate([{ transform: 'translateY(-18px) rotate(-3deg)' }, { transform: 'translateY(2px) rotate(1deg)', offset: 0.6 }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.3,.7,.4,1)' }); }
    }
    function binde() {
      var k = el.querySelector('.c6vb-karte');
      if (k) k.onclick = function () {
        flip = !flip;
        k.setAttribute('data-seite', flip ? 'hinten' : 'vorne');
        var oben = alle()[reihe()[0]] || {};
        k.setAttribute('aria-label', (flip ? stimme('karten.hinten', null, 'Antwort') + ': ' + oben.hinten : stimme('karten.vorne', null, 'Frage') + ': ' + oben.vorne) + '. ' + stimme('karten.umdrehen', null, 'Karte umdrehen'));
        var wl = el.querySelector('.c6vb-wahl'); if (wl) wl.hidden = !flip;
      };
      var g = el.querySelector('[data-w=gewusst]'); if (g) g.onclick = function () { weg(true); };
      var n = el.querySelector('[data-w=nochmal]'); if (n) n.onclick = function () { weg(false); };
      var v = el.querySelector('[data-w=vorn]'); if (v) v.onclick = function () { d.reihe = []; d.gewusst = {}; d.wackelt = {}; d.runde = (d.runde || 0) + 1; merken(); zeichne(); };
      var wk = el.querySelector('[data-w=wacklig]'); if (wk) wk.onclick = function () { var wack = Object.keys(d.wackelt || {}).map(Number); d.reihe = wack; d.gewusst = {}; alle().forEach(function (c, i) { if (wack.indexOf(i) < 0) d.gewusst[i] = Date.now(); }); d.wackelt = {}; d.runde = (d.runde || 0) + 1; merken(); zeichne(); };
      var sb = el.querySelector('[data-w=schreib]'); if (sb) sb.onclick = function () { schreibt = true; zeichne(); var i = el.querySelector('.c6vb-form input'); if (i) i.focus(); };
      var f = el.querySelector('.c6vb-form');
      if (f) f.onsubmit = function (e) {
        e.preventDefault();
        var vi = f.querySelector('[name=v]'), hi = f.querySelector('[name=h]'), bug = f.querySelector('.c6vb-bug'), vv = vi.value.trim(), hh = hi.value.trim();
        // ein Bug zur Zeit: erst die Frage, dann die Antwort
        if (!vv || !hh) { bug.hidden = false; bug.textContent = !vv ? stimme('karten.fehltVorne', null, 'Vorne fehlt noch die Frage.') : stimme('karten.fehltHinten', null, 'Hinten fehlt noch die Antwort. Ohne sie kannst du dich nicht prüfen.'); (!vv ? vi : hi).focus(); return; }
        d.eigene = (d.eigene || []).concat([{ vorne: kurz(vv, 140), hinten: kurz(hh, 260), ts: Date.now() }]);
        var neu = alle().length - 1; reihe(); d.reihe = [neu].concat(d.reihe.filter(function (x) { return x !== neu; }));
        // das Ding zuerst: die neue Karte liegt oben auf dem Stapel und wippt, das Formular klappt zu
        merken(); flip = false; schreibt = false; zeichne();
        zeigeStapel();
        bus({ was: 'geschrieben', id: id, art: 'karteikarten' });
      };
    }
    zeichne();
    return { weg: function () { el.innerHTML = ''; } };
  }
  // Packliste und Merkzettel: ein Blatt Papier mit Kästchen; abhaken streicht durch, nichts verschwindet
  function liste(el, w) {
    var id = w.id, vb = w.vb || {}, d = daten(id), merk = vb.art === 'merkzettel';
    function punkte() { return (vb.punkte || []).map(function (t, i) { return { t: t, von: merk ? ((vb.quellen || [])[i] || herkunftSuchen(t)) : null, k: 'c' + i }; }).concat((d.eigene || []).map(function (t, i) { return { t: t, von: 'du', k: 'e' + i }; })); }
    function zeichne() {
      var p = punkte(), erl = d.erl || {}, alleDrin = p.length && p.every(function (q) { return erl[q.k]; });
      var satz = !p.length ? (merk ? stimme('merk.leer', null, 'In deinen Zetteln klingt noch nichts nach Geschenk. Schreib eine Idee drauf, wenn dir eine kommt.') : stimme('packliste.leer', null, 'Noch nichts drauf. Was kommt als Erstes in die Tasche?'))
        : merk ? (vb.punkte || []).length === 1 ? stimme('merk.gefundenEins', null, 'Aus deinen Zetteln: eine Idee.') : (vb.punkte || []).length ? stimme('merk.gefunden', { n: (vb.punkte || []).length }, 'Aus deinen Zetteln: {n} Ideen. Streich, was nicht passt.') : ''
        : alleDrin ? stimme('packliste.alles', null, 'Alles drin. Gute Reise.') : '';
      el.innerHTML = kopfHtml(vb, w) + '<div class="c6vb-blatt' + (merk ? ' c6vb-merk' : ' c6vb-pack') + '"><ul>' + p.map(function (q) {
        var an = !!erl[q.k], gleich = q.von && typeof q.von === 'object' && kurz(q.von.t, 60) === kurz(q.t, 60);
        var her = q.von && q.von !== 'du' && typeof q.von === 'object' ? '<small class="c6vb-her">' + esc((gleich ? stimme('merk.deinZettel', null, 'dein Zettel') : 'aus „' + kurz(q.von.t, 60) + '“') + (q.von.wo ? ' in „' + kurz(q.von.wo, 24) + '“' : '') + (q.von.ts ? ', ' + tsText(q.von.ts) : '')) + '</small>' : q.von === 'du' ? '<small class="c6vb-her">' + esc(stimme('deins', null, 'von dir')) + '</small>' : (vb.herkunft === 'carl' ? '' : '');
        return '<li><button type="button" class="c6vb-punkt" data-k="' + q.k + '" aria-pressed="' + an + '"><i class="c6vb-kasten" aria-hidden="true"></i><span>' + esc(q.t) + her + '</span></button></li>';
      }).join('') + '</ul>' +
        (!merk && vb.herkunft === 'carl' && (vb.punkte || []).length ? '<p class="c6vb-unter">' + esc(stimme('packliste.vonCarl', null, 'Von Carl vorgeschlagen. Streich, was du nicht brauchst.')) + '</p>' : '') +
        '<form class="c6vb-dazu"><input maxlength="60" autocomplete="off" aria-label="' + esc(merk ? 'Noch eine Idee' : 'Noch etwas einpacken') + '" placeholder="' + esc(merk ? stimme('merk.platz', null, 'Noch eine Idee …') : stimme('packliste.platz', null, 'Noch etwas …')) + '"><button type="submit" class="c6vb-knopf">+</button></form></div>' +
        (satz ? '<p class="c6vb-satz" role="status">' + esc(satz) + '</p>' : '');
      [].forEach.call(el.querySelectorAll('.c6vb-punkt'), function (b) {
        b.onclick = function () { d.erl = d.erl || {}; var k = b.dataset.k; if (d.erl[k]) delete d.erl[k]; else d.erl[k] = Date.now(); merken(); zeichne(); var nb = el.querySelector('.c6vb-punkt[data-k="' + k + '"]'); if (nb) { nb.focus(); if (d.erl[k] && !C6.ruhig && nb.animate) nb.querySelector('.c6vb-kasten').animate([{ transform: 'scale(.7)' }, { transform: 'scale(1.15)' }, { transform: 'none' }], { duration: 300 }); } bus({ was: 'abgehakt', id: id, art: vb.art }); };
      });
      var f = el.querySelector('.c6vb-dazu');
      f.onsubmit = function (e) { e.preventDefault(); var i = f.querySelector('input'), v = i.value.trim(); if (!v) { i.focus(); return; } d.eigene = (d.eigene || []).concat([kurz(v, 60)]); merken(); zeichne(); var ni = el.querySelector('.c6vb-dazu input'); if (ni) ni.focus(); };
    }
    zeichne();
    return { weg: function () { el.innerHTML = ''; } };
  }
  // ältere Merkzettel ohne gespeicherte Herkunft: der Satz wird in deinen Zetteln gesucht (genau, nichts geraten)
  function herkunftSuchen(t) { var z = alleZettel().filter(function (q) { return kurz(q.t, 60) === t || q.t === t; })[0]; return z ? quelle(z) : null; }

  function oeffne(el, vb) {
    if (!el) return null;
    vb = vb || {};
    var id = vb.werkzeugId || vb.id, w = id ? wz(id) : null;
    if (!w) w = { id: id || 'probe', vb: vb, name: vb.titel || '' };
    if (!w.vb) w.vb = vb;
    el.classList.add('c6vb');
    var art = ART[w.vb.art] || 'packliste';
    el.setAttribute('data-art', art);
    return art === 'karteikarten' ? stapel(el, w) : liste(el, w);
  }
  // klein (an der Wand, im Fach): ein Satz, was da liegt
  function klein(w) {
    var vb = (w && w.vb) || {}, d = daten(w.id);
    if (ART[vb.art] === 'karteikarten') { var n = karten(w).length, g = Object.keys(d.gewusst || {}).length; return n ? (n === 1 ? stimme('karten.kleinEins', { g: g }, 'eine Karte · {g} gewusst') : stimme('karten.klein', { n: n, g: g }, '{n} Karten · {g} gewusst')) : stimme('karten.kleinLeer', null, 'noch keine Karte'); }
    var p = (vb.punkte || []).length + (d.eigene || []).length, e = Object.keys(d.erl || {}).length;
    return p ? (ART[vb.art] === 'packliste' ? stimme('packliste.klein', { n: p - e }, '{n} noch einpacken') : stimme('merk.klein', { n: p }, '{n} Ideen')) : stimme('kleinLeer', null, 'noch leer');
  }
  // Die Zeile im Tagesblatt: ohne Kalender sagst du selbst, was an dem Tag ansteht. Geschrieben wird auf eine Linie, wie in einen Kalender.
  var eingetragen = null;   // {tag, satz, ts}: das Tagesblatt wird nach dem Eintragen neu gezeichnet, der Satz bleibt stehen
  function eintragZeile(el, o) {
    if (!el || !C6.tage || typeof C6.tage.eintragen !== 'function') return;
    o = o || {};
    var tsp = function (k, w, e) { try { var t = C6.stimme && C6.stimme.fest ? C6.stimme.fest('tage.' + k, w || {}) : ''; if (t && !/\{[a-z]+\}/i.test(t)) return t; } catch (x) {} return String(e).replace(/\{(\w+)\}/g, function (m, x) { return w && w[x] != null ? w[x] : ''; }); };
    var frage = o.leer === false ? tsp('eintragMehr', null, 'Steht noch etwas an dem Tag an?') : tsp('eintrag', null, 'Was steht an dem Tag an?');
    el.innerHTML = '<form class="c6vb-zeile"><label><span class="c6vb-zeile-frage">' + esc(frage) + '</span><span class="c6vb-zeile-linie"><input maxlength="80" autocomplete="off" enterkeyhint="done" placeholder="' + esc(tsp('eintragPlatz', null, 'z. B. Mathe-Prüfung')) + '"><button type="submit" class="c6vb-zeile-stift" aria-label="' + esc(tsp('eintragen', null, 'Eintragen')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 6.6l3.4 3.4" stroke="currentColor" stroke-width="2"/></svg><span>' + esc(tsp('eintragen', null, 'Eintragen')) + '</span></button></span></label><p class="c6vb-bug" role="status" hidden></p></form>';
    var f = el.querySelector('form'), inp = f.querySelector('input'), bug = f.querySelector('.c6vb-bug');
    f.addEventListener('click', function (e) { e.stopPropagation(); });
    if (eingetragen && eingetragen.tag === o.tag && Date.now() - eingetragen.ts < 8000) { bug.hidden = false; bug.classList.add('c6vb-zeile-satz'); bug.textContent = eingetragen.satz; }
    f.onsubmit = function (e) {
      e.preventDefault(); e.stopPropagation();
      var v = inp.value.trim();
      bug.classList.remove('c6vb-zeile-satz');
      if (!v) { bug.hidden = false; bug.textContent = tsp('eintragLeer', null, 'Ein paar Wörter reichen, zum Beispiel „Zahnarzt“.'); inp.focus(); return; }
      // vorher merken: das Eintragen zeichnet das Tagesblatt sofort neu, die neue Zeile zeigt dann den Satz
      eingetragen = { tag: o.tag, satz: tsp('eingetragen', { titel: kurz(v, 40) }, '„{titel}“ liegt jetzt im Fach.'), ts: Date.now() };
      var r = null; try { r = C6.tage.eintragen(o.tag, v); } catch (x) { r = null; }
      if (!r) { eingetragen = null; bug.hidden = false; bug.textContent = tsp('eintragFehler', null, 'Das konnte ich nicht eintragen. Versuch es noch einmal.'); return; }
      // die Linie trägt jetzt deine Schrift; das Fach füllt sich über den Kern (Bus „tage“)
      f.classList.add('c6vb-zeile-steht'); inp.value = ''; inp.blur();
      // Carls Satz steht unter der Linie, nicht in der Blase: die würde das Fach verdecken, das sich gerade füllt
      bug.hidden = false; bug.classList.add('c6vb-zeile-satz'); bug.textContent = tsp('eingetragen', { titel: kurz(r.titel, 40) }, '„{titel}“ liegt jetzt im Fach.');
      eingetragen = { tag: o.tag, satz: bug.textContent, ts: Date.now() };
      bus({ was: 'eingetragen', tag: o.tag, titel: r.titel });
    };
  }
  C6.vorbereitung = { eintragZeile: eintragZeile, baue: baue, inhalt: inhalt, oeffne: oeffne, klein: klein, art: function (t) { try { return C6.tage && C6.tage.vorschlag ? C6.tage.vorschlag(t) : null; } catch (e) { return null; } } };
})();
