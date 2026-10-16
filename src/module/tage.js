// Die nächsten sieben Tage: was ansteht (dein Kalender, deine Termin-Werkzeuge) und was Carl dafür schon vorbereitet hat.
// Nur Gelesenes, nichts erfunden: Was der Kalender nicht lesbar liefert, fehlt und wird gezählt.
(function () {
  var C6 = window.C6; if (!C6 || !C6.bus) return;
  var SERVER = 'Google Calendar', WERKZEUG = 'list_events', TAG_MS = 864e5;
  var WT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  var MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var VORB = { pruefung: 'karteikarten', vortrag: 'karteikarten', reise: 'packliste', geburtstag: 'merkzettel', bewerbung: 'merkzettel' };

  function zwei(n) { return ('0' + n).slice(-2); }
  function tagVon(d) { return d.getFullYear() + '-' + zwei(d.getMonth() + 1) + '-' + zwei(d.getDate()); }
  function heute() { return tagVon(new Date()); }
  function plus(k, n) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(k); var d = new Date(+m[1], +m[2] - 1, +m[3] + n); return tagVon(d); }
  function abstand(k) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(k || ''), h = /^(\d{4})-(\d\d)-(\d\d)$/.exec(heute()); if (!m) return null; return Math.round((new Date(+m[1], +m[2] - 1, +m[3]) - new Date(+h[1], +h[2] - 1, +h[3])) / TAG_MS); }
  function kurz(t, n) { t = String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
  function hash(s) { s = String(s); var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function emit(d) { try { C6.bus.emit('tage', d); } catch (e) {} }
  function S() { var s = C6.S || (C6.S = {}); if (!s.tage || typeof s.tage !== 'object') s.tage = {}; if (!s.tage.vorbereitet || typeof s.tage.vorbereitet !== 'object') s.tage.vorbereitet = {}; return s.tage; }

  // Art aus dem Titel (und dem Ereignistyp des Kalenders); unsicher → null, dann wird nichts angeboten
  function artVon(titel, typ) {
    var t = String(titel || '');
    if (typ === 'BIRTHDAY' || /(geburtstag|birthday|\bb-?day\b)/i.test(t)) return 'geburtstag';
    if (/(prüfung|pruefung|klausur|examen|\bexam\b|test\b|testat|matura|\bquiz\b)/i.test(t)) return 'pruefung';
    if (/(bewerbung|vorstellungsgespr|jobinterview|job-interview)/i.test(t)) return 'bewerbung';
    if (/(vortrag|referat|präsentation|praesentation|presentation|\bpitch\b)/i.test(t)) return 'vortrag';
    if (/(\bflug\b|abflug|reise|urlaub|ferien|\btrip\b|flight|travel|vacation|holiday)/i.test(t)) return 'reise';
    return null;
  }

  /* ---------- Kalender (Connector der Seite) ---------- */
  var kal = { status: 'laedt', grund: null, ungelesen: 0, stand: null, termine: [], ab: null, tag: '', mcp: null, versucht: 0 };
  var RETRAKT = { needs_reauth: 1, server_not_connected: 1, blocked_by_policy: 1, approval_required: 1, not_in_manifest: 1, consent_required: 1, selection_required: 1, server_not_found: 1, not_granted: 1, capability_disabled: 1, capability_removed: 1 };
  function zustandVon(code) {
    if (code === 'needs_reauth') return 'neu-verbinden';
    if (code === 'server_not_connected' || code === 'selection_required' || code === 'server_not_found' || code === 'not_granted' || code === 'capability_disabled' || code === 'capability_removed') return 'nicht-verbunden';
    if (code === 'not_in_manifest' || code === 'blocked_by_policy' || code === 'consent_required' || code === 'approval_required') return 'kein-zugriff';
    return 'fehler';
  }
  function setze(st, grund) {
    var alt = kal.status + '|' + kal.grund;
    kal.status = st; kal.grund = grund || null;
    if (alt !== st + '|' + kal.grund) emit({ was: 'status', kalender: st, grund: kal.grund });
  }
  function eingabe() { var h = heute(); return { startTime: h + 'T00:00:00', endTime: plus(h, 7) + 'T00:00:00', orderBy: 'startTime', pageSize: 50 }; }

  // Ergebnis lesen, ohne das Format zu kennen: Liste direkt oder unter events/items; Unlesbares zählen
  function liste(res) {
    var p = res && typeof res === 'object' ? (res.payload !== undefined ? res.payload : res.structuredContent) : res;
    if (typeof p === 'string') { try { p = JSON.parse(p); } catch (e) { p = null; } }
    if (p == null && res && Array.isArray(res.content)) {
      var tb = res.content.filter(function (c) { return c && c.type === 'text'; })[0];
      if (tb) { try { p = JSON.parse(tb.text); } catch (e) { p = null; } }
    }
    if (Array.isArray(p)) return p;
    if (p && typeof p === 'object') {
      var k = ['events', 'items', 'result', 'data'];
      for (var i = 0; i < k.length; i++) {
        var x = p[k[i]];
        if (Array.isArray(x)) return x;
        if (x && typeof x === 'object' && (Array.isArray(x.events) || Array.isArray(x.items))) return x.events || x.items;
      }
    }
    return null;
  }
  function zeitpunkt(v) {
    if (v && typeof v === 'object') v = v.dateTime || v.date_time || v.date || null;
    if (typeof v !== 'string' || !v) return null;
    if (/^\d{4}-\d\d-\d\d$/.test(v)) return { tag: v, zeit: null, ganz: true };
    var ms = Date.parse(v); if (isNaN(ms)) return null;
    var d = new Date(ms);
    return { tag: tagVon(d), zeit: zwei(d.getHours()) + ':' + zwei(d.getMinutes()), ganz: false };
  }
  function lies(res) {
    var l = liste(res), aus = [], unl = 0;
    if (!l) return null;
    var von = heute(), bis = plus(von, 6);
    l.forEach(function (e) {
      if (!e || typeof e !== 'object') { unl++; return; }
      if (e.status === 'cancelled') return;
      var titel = kurz(e.summary || e.title || e.name || '', 80);
      var a = zeitpunkt(e.start != null ? e.start : (e.startTime || e.start_time || e.begin));
      if (!titel || !a) { unl++; return; }
      var basis = 'k:' + (e.id || e.eventId || e.iCalUID || hash(titel + '|' + a.tag + '|' + (a.zeit || '')));
      var art = artVon(titel, e.eventType);
      // ganztägig über mehrere Tage (Urlaub): an jedem Tag im Fenster, an dem er läuft
      var ende = a.ganz ? zeitpunkt(e.end != null ? e.end : (e.endTime || e.end_time)) : null;
      var letzter = ende && ende.ganz && ende.tag > a.tag ? plus(ende.tag, -1) : a.tag;
      for (var k = a.tag < von ? von : a.tag, n = 0; k <= letzter && k <= bis && n < 7; k = plus(k, 1), n++) {
        if (k < von) continue;
        aus.push({ id: basis, titel: titel, zeit: a.zeit, quelle: 'kalender', art: art, tag: k });
      }
    });
    return { termine: aus, ungelesen: unl };
  }
  function stamp(res) { var c = res && res.cache; return c && c.storedAt ? c.storedAt : Date.now(); }
  function annehmen(res) {
    var r = lies(res);
    if (!r) { kal.termine = []; kal.ungelesen = 0; kal.stand = stamp(res); setze('fehler', 'unlesbar'); emit({ was: 'stand' }); return; }
    kal.termine = r.termine; kal.ungelesen = r.ungelesen; kal.stand = stamp(res);
    setze('verbunden', null);
    emit({ was: 'stand' });
  }
  function fehler(err) {
    var code = (err && err.code) || 'upstream_error';
    if (code === 'cancelled') return;
    if (code === 'user_changed') { stop(); kal.termine = []; setze('nicht-verbunden', code); emit({ was: 'stand' }); return; }
    if (RETRAKT[code]) { kal.termine = []; kal.ungelesen = 0; kal.stand = null; setze(zustandVon(code), code); emit({ was: 'stand' }); return; }
    // vorübergehend: was zuletzt gut war, bleibt sichtbar; ein einziger Versuch nach kurzer Pause, wenn erlaubt
    if (kal.status === 'verbunden' && kal.stand) { kal.grund = code; emit({ was: 'status', kalender: 'verbunden', grund: code }); }
    else setze('fehler', code);
    if (err && err.retryable && kal.versucht < 1 && kal.mcp && kal.mcp.invalidate) {
      kal.versucht++;
      setTimeout(function () { try { kal.mcp.invalidate(SERVER, WERKZEUG).catch(function () {}); } catch (e) {} }, Math.min(60000, (err.retryAfterMs || 0) + 1500 + Math.random() * 2500));
    }
  }
  function stop() { if (kal.ab) { try { kal.ab(); } catch (e) {} kal.ab = null; } }
  function beobachte() {
    if (!kal.mcp || typeof kal.mcp.watchTool !== 'function') return;
    stop();
    kal.tag = heute(); kal.versucht = 0;
    try {
      kal.ab = kal.mcp.watchTool(SERVER, WERKZEUG, eingabe(), function (ev) {
        if (!ev) return;
        if (ev.type === 'data') { kal.versucht = 0; annehmen(ev.result); }
        else if (ev.type === 'error') fehler(ev.error);
      }, { refetchInterval: 300000 });
    } catch (e) { fehler({ code: 'bad_request' }); }
  }
  function verbinden() {
    var cl = window.claude;
    if (!cl || typeof cl.use !== 'function') { setze('nicht-verbunden', 'kein-mcp'); emit({ was: 'stand' }); return; }
    setze('laedt', null);
    var p; try { p = cl.use('mcp'); } catch (e) { p = null; }
    Promise.resolve(p).then(function (m) {
      if (!m) { setze('nicht-verbunden', 'kein-mcp'); emit({ was: 'stand' }); return; }
      kal.mcp = m; beobachte();
    }, function () { setze('nicht-verbunden', 'kein-mcp'); emit({ was: 'stand' }); });
  }
  // ein neuer Tag: neues Fenster (die Eingabe trägt das Datum)
  var tagJetzt = heute();
  function tagPruef() { if (tagJetzt === heute()) return; tagJetzt = heute(); if (kal.mcp) beobachte(); emit({ was: 'stand' }); }
  C6.bus.on('tageszeit', tagPruef);
  setInterval(tagPruef, 60000);

  /* ---------- deine Termin-Werkzeuge ---------- */
  function ausWerkzeugen() {
    var r = [], von = heute(), bis = plus(von, 6);
    try {
      (C6.werkzeug && C6.werkzeug.alle ? C6.werkzeug.alle() : []).forEach(function (w) {
        (w.teile || []).forEach(function (t, i) {
          if (!t || t.t !== 'datum' || !t.wann || t.wann < von || t.wann > bis) return;
          var titel = kurz(t.text || w.name || '', 80); if (!titel) return;
          r.push({ id: 'w:' + w.id + ':' + (t.k || 't' + i), titel: titel, zeit: null, quelle: 'werkzeug', art: artVon(w.wasAnsteht ? titel : titel + ' ' + (w.name || '') + ' ' + (w.satz || '')), werkzeugId: w.id, tag: t.wann });
        });
      });
    } catch (e) {}
    return r;
  }

  /* ---------- Die sieben Tage ---------- */
  function lebt(id) { try { return !!(id && C6.werkzeug && C6.werkzeug.hol && C6.werkzeug.hol(id)); } catch (e) { return false; } }
  function alleTermine() { return kal.termine.concat(ausWerkzeugen()); }
  // Verknüpfungen: was hier vorbereitet wurde (C6.S.tage) und Werkzeuge, die selbst sagen, zu welchem Termin sie gehören
  function verknuepft() {
    var r = {}, vb = S().vorbereitet;
    Object.keys(vb).forEach(function (k) { if (vb[k] && lebt(vb[k].werkzeugId)) r[k] = vb[k]; });
    try {
      (C6.werkzeug && C6.werkzeug.alle ? C6.werkzeug.alle() : []).forEach(function (w) {
        var v = w.vb || w.vorb; var tid = v && (v.termId || v.terminId); if (!tid || r[tid]) return;
        var art = v.art === 'karten' ? 'karteikarten' : v.art;
        r[tid] = { id: 'w' + w.id, art: art, termId: tid, werkzeugId: w.id, tag: v.tag || (typeof v.datum === 'string' ? v.datum.slice(0, 10) : ''), titel: v.titel || w.name };
      });
    } catch (e) {}
    return r;
  }
  function tageListe() {
    var h = heute(), alle = alleTermine(), vb = verknuepft(), aus = [];
    for (var i = 0; i < 7; i++) {
      var k = plus(h, i), m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(k), d = new Date(+m[1], +m[2] - 1, +m[3]);
      var termine = alle.filter(function (t) { return t.tag === k; }).sort(function (a, b) { return (a.zeit || '') < (b.zeit || '') ? -1 : (a.zeit || '') > (b.zeit || '') ? 1 : 0; })
        .map(function (t) { var o = { id: t.id, titel: t.titel, zeit: t.zeit, quelle: t.quelle, art: t.art || null }; if (t.werkzeugId) o.werkzeugId = t.werkzeugId; return o; });
      var ids = {}; termine.forEach(function (t) { ids[t.id] = 1; });
      var vor = [];
      Object.keys(vb).forEach(function (tid) {
        var v = vb[tid]; if (!v) return;
        // am Tag des Termins; ist der Termin (gerade) nicht lesbar, liegt die Vorbereitung trotzdem an ihrem Tag
        if (ids[tid] ? true : (v.tag === k && !alle.some(function (t) { return t.id === tid; }))) vor.push({ id: v.id, art: v.art, termId: tid, werkzeugId: v.werkzeugId, titel: v.titel });
      });
      aus.push({ tag: k, heute: i === 0, wochentag: WT[d.getDay()], abstand: i, termine: termine, vorbereitet: vor });
    }
    return aus;
  }
  function fach(k) {
    var t = tageListe().filter(function (x) { return x.tag === k; })[0];
    if (!t) return { zustand: 'leer', n: 0, art: null, vorbereitet: 0 };
    var art = null; t.termine.forEach(function (x) { if (!art && x.art) art = x.art; });
    return { zustand: t.vorbereitet.length ? 'vorbereitet' : t.termine.length ? 'termin' : 'leer', n: t.termine.length, art: art, vorbereitet: t.vorbereitet.length };
  }
  function termin(id) { var a = alleTermine(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return Object.assign({}, a[i]); return null; }
  function vorschlag(t) { return t && t.art && VORB[t.art] ? VORB[t.art] : null; }
  function vorbereitungVon(termId) { return verknuepft()[termId] || null; }

  /* ---------- Vorbereiten: aus einem Termin wird ein Werkzeug ---------- */
  var laeuft = {};
  function datumText(k) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(k || ''); return m ? (+m[3]) + '. ' + MON[+m[2] - 1] : ''; }
  function zeilen(t) { return String(t || '').split(/\n+/).map(function (z) { return z.replace(/^\s*(?:[-–•*]|\d+[.)])\s*/, '').replace(/\*+/g, '').trim(); }).filter(Boolean); }
  function eigeneSaetze() {
    var s = C6.S || {}, r = [];
    (s.gespraech || []).forEach(function (z) { if (z && z.von === 'du' && z.t) r.push(String(z.t)); });
    var sp = s.spaces || {};
    Object.keys(sp).forEach(function (k) { ((sp[k] || {}).notizen || []).forEach(function (n) { if (n && n.t) r.push(String(n.t)); }); });
    (s.strings || []).forEach(function (f) { (f && f.perlen || []).forEach(function (p) { if (p && p.t) r.push(String(p.t)); }); });
    return r;
  }
  // Merkzettel: Sätze aus deinen eigenen Zetteln, die einen Namen aus dem Termin tragen
  function ausDeinenZetteln(titel) {
    var namen = (String(titel).match(/[A-ZÄÖÜ][a-zäöüß]{2,}/g) || []).filter(function (w) { return !/^(Geburtstag|Birthday|Party|Feier|Fest)$/i.test(w); });
    if (!namen.length) return [];
    var gesehen = {};
    return eigeneSaetze().filter(function (z) {
      var k = z.trim(); if (gesehen[k] || k.length < 6) return false;
      var ok = namen.some(function (n) { return new RegExp('(^|[^A-Za-zÄÖÜäöüß])' + n + '(s|\'s)?([^A-Za-zÄÖÜäöüß]|$)').test(k); });
      if (ok) gesehen[k] = 1; return ok;
    }).slice(-8).map(function (z) { return kurz(z, 60); });
  }
  function denk(auf) {
    var p = null;
    try { p = C6.denk ? C6.denk(auf, { stumm: true, was: 'Vorbereitung' }) : null; } catch (e) { p = null; }
    return Promise.resolve(p).then(function (t) { return String(t || ''); }, function () { return ''; });
  }
  function eigenerInhalt(t, art) {
    var wann = datumText(t.tag);
    if (art === 'karteikarten' && t.art === 'vortrag') {
      return denk('Mach 8 Karteikarten mit Stichworten für „' + t.titel + '“ am ' + wann + '. Je Zeile eine Karte im Format: Stichwort | ein Satz dazu. Nur die Liste. Schreib nichts, was du nicht sicher weißt.').then(function (x) {
        var k = zeilen(x).map(function (z) { var p = z.split(/\s*\|\s*/); return p.length >= 2 && p[0] && p[1] ? { vorne: kurz(p[0], 140), hinten: kurz(p.slice(1).join(' | '), 240) } : null; }).filter(Boolean).slice(0, 12);
        return k.length >= 2 ? { karten: k, herkunft: 'carl' } : null;
      });
    }
    if (art === 'merkzettel' && t.art === 'bewerbung') {
      return denk('Für „' + t.titel + '“ am ' + wann + ': Schreib sechs Fragen, die im Gespräch kommen könnten, je Zeile eine, mit „- “ davor. Nichts über die Firma behaupten.').then(function (x) {
        var p = zeilen(x).filter(function (z) { return z.length <= 120; }).slice(0, 8);
        return p.length >= 2 ? { punkte: p, herkunft: 'carl' } : null;
      });
    }
    if (art === 'karteikarten') {
      return denk('Mach 8 Karteikarten zur Vorbereitung auf „' + t.titel + '“ am ' + wann + '. Je Zeile eine Karte im Format: Vorderseite | Rückseite. Vorne eine kurze Frage, hinten die knappe Antwort. Nur die Liste, keine Einleitung. Schreib nichts, was du nicht sicher weißt; sagt der Titel zu wenig über den Stoff, nimm Grundlagen des Fachs.').then(function (x) {
        var k = zeilen(x).map(function (z) { var p = z.split(/\s*\|\s*/); return p.length >= 2 && p[0] && p[1] ? { vorne: kurz(p[0], 140), hinten: kurz(p.slice(1).join(' | '), 240) } : null; }).filter(Boolean).slice(0, 12);
        return k.length >= 2 ? { karten: k, herkunft: 'carl' } : null;
      });
    }
    if (art === 'packliste') {
      return denk('Schreib eine Packliste für „' + t.titel + '“ am ' + wann + '. Höchstens 12 Dinge, je Zeile eines, mit „- “ davor. Nur die Liste.').then(function (x) {
        var p = zeilen(x).filter(function (z) { return z.length <= 60; }).slice(0, 12);
        return p.length >= 3 ? { punkte: p, herkunft: 'carl' } : null;
      });
    }
    if (art === 'merkzettel') {
      var aus = ausDeinenZetteln(t.titel);
      if (aus.length) return Promise.resolve({ punkte: aus, herkunft: 'zettel' });
      return denk('Für „' + t.titel + '“: Schreib fünf kurze Geschenkideen, je Zeile eine, mit „- “ davor. Nichts Teures, nichts Ausgedachtes über die Person.').then(function (x) {
        var p = zeilen(x).filter(function (z) { return z.length <= 60; }).slice(0, 6);
        // ohne Ideen bleibt der Zettel leer: du schreibst selbst drauf
        return { punkte: p, herkunft: p.length ? 'carl' : 'leer' };
      });
    }
    return Promise.resolve(null);
  }
  var NAME = { karteikarten: 'Karteikarten', packliste: 'Packliste', merkzettel: 'Merkzettel' };
  function vorbereiten(t, art) {
    if (t && typeof t === 'string') t = termin(t);
    art = art || vorschlag(t);
    if (!t || !t.id || !NAME[art]) return Promise.resolve({ ok: false, grund: 'leer' });
    var alt = vorbereitungVon(t.id);
    if (alt) return Promise.resolve({ ok: false, grund: 'schon', werkzeugId: alt.werkzeugId });
    if (laeuft[t.id]) return Promise.resolve({ ok: false, grund: 'laeuft' });
    laeuft[t.id] = art;
    emit({ was: 'laeuft', termId: t.id, art: art });
    var V = C6.vorbereitung;
    if (V && typeof V.baue === 'function') return mitModul(t, art);
    var quelle = null;
    try { if (V && typeof V.inhalt === 'function') quelle = V.inhalt(Object.assign({}, t), art); } catch (e) { quelle = null; }
    return Promise.resolve(quelle).then(function (x) { return x && ((x.karten && x.karten.length) || x.punkte) ? x : eigenerInhalt(t, art); }, function () { return eigenerInhalt(t, art); }).then(function (x) {
      delete laeuft[t.id];
      var ohneKopf = !!(C6.mitdenken && C6.mitdenken().echt === false);
      if (!x && !ohneKopf) { emit({ was: 'fehler', termId: t.id, art: art, grund: 'leer' }); return { ok: false, grund: 'leer' }; }
      // ohne Mitdenken nichts Erfundenes: ein leeres Ding, das du selbst füllst
      if (!x) x = art === 'karteikarten' ? { karten: [], herkunft: 'leer' } : { punkte: [], herkunft: 'leer' };
      var vb = { art: art, termId: t.id, titel: t.titel, tag: t.tag, herkunft: x.herkunft || 'carl' };
      var teil;
      if (art === 'karteikarten' && x.karten.length) { vb.karten = x.karten; teil = { t: 'frage', text: NAME[art] + ' für „' + kurz(t.titel, 40) + '“', fragen: x.karten.map(function (k) { return k.vorne; }) }; }
      else if (art === 'karteikarten') { vb.karten = []; teil = { t: 'liste', text: 'Deine Fragen für „' + kurz(t.titel, 40) + '“', punkte: [] }; }
      else { vb.punkte = (x.punkte || []).slice(0, 12); teil = { t: 'liste', text: NAME[art] + ' für „' + kurz(t.titel, 40) + '“', punkte: vb.punkte.slice() }; }
      var w = null;
      try {
        w = C6.werkzeug && C6.werkzeug.haenge ? C6.werkzeug.haenge({ name: kurz(NAME[art] + ' · ' + t.titel, 28), zeichen: art === 'karteikarten' ? 'frage' : 'liste', farbe: art === 'karteikarten' ? '#2c7a6e' : '#a95f33', teile: [teil], vb: vb }, null) : null;
      } catch (e) { w = null; }
      if (!w) { emit({ was: 'fehler', termId: t.id, art: art, grund: 'leer' }); return { ok: false, grund: 'leer' }; }
      merke(t, art, w.id);
      return { ok: true, werkzeugId: w.id, leer: vb.herkunft === 'leer', n: (vb.karten || vb.punkte || []).length, grund: vb.herkunft === 'leer' ? 'kein-kopf' : null };
    });
  }
  function merke(t, art, wid) {
    var eintrag = { id: 'v' + Date.now().toString(36), art: art, termId: t.id, werkzeugId: wid, tag: t.tag, titel: t.titel, ts: Date.now() };
    try { C6.aendern(function (st) { if (!st.tage || typeof st.tage !== 'object') st.tage = {}; if (!st.tage.vorbereitet) st.tage.vorbereitet = {}; st.tage.vorbereitet[t.id] = eintrag; }, { schluessel: 'tage', wer: 'carl' }); } catch (e) { S().vorbereitet[t.id] = eintrag; }
    emit({ was: 'vorbereitet', termId: t.id, werkzeugId: wid, art: art, tag: t.tag, i: abstand(t.tag) });
    emit({ was: 'stand' });
  }
  // das Vorbereitungs-Modul baut das Ding (Inhalt nur über Mitdenken, ohne Kopf leer mit Handgriff); hier wird nur verknüpft
  function mitModul(t, art) {
    var p;
    try { p = C6.vorbereitung.baue({ id: t.id, titel: t.titel, datum: t.tag, tag: t.tag, zeit: t.zeit || null, art: t.art || null }, art === 'karteikarten' ? 'karten' : art); } catch (e) { p = Promise.reject(e); }
    return Promise.resolve(p).then(function (r) {
      delete laeuft[t.id];
      if (r && r.werkzeugId && lebt(r.werkzeugId)) {
        merke(t, art, r.werkzeugId);
        var w = C6.werkzeug.hol(r.werkzeugId), v = (w && w.vb) || {};
        return { ok: true, werkzeugId: r.werkzeugId, leer: !!r.leer, satz: r.satz || null, n: (v.karten || v.punkte || []).length, grund: r.leer ? 'kein-kopf' : null };
      }
      var grund = r && r.ehrlich ? (C6.mitdenken && C6.mitdenken().echt === false ? 'kein-kopf' : 'leer') : 'leer';
      emit({ was: 'fehler', termId: t.id, art: art, grund: grund, satz: r && r.satz });
      return { ok: false, grund: grund, satz: r && r.satz };
    }, function () { delete laeuft[t.id]; emit({ was: 'fehler', termId: t.id, art: art, grund: 'leer' }); return { ok: false, grund: 'leer' }; });
  }

  /* ---------- Der Brief: das Briefing des Tages ---------- */
  // schon in einem Brief eines früheren Tages genannt? Dann nennt ihn der Brief nicht noch einmal
  function alt(k) { var g = S().genannt; return !!(g && g[k] && g[k] < heute()); }
  function nenne(b) {
    if (!b) return;
    var h = heute(), ks = [];
    b.heute.forEach(function (x) { ks.push(x.id); });
    b.naechste.forEach(function (d) { d.termine.forEach(function (x) { ks.push(x.id); }); });
    b.vorbereitet.forEach(function (v) { ks.push('v:' + v.werkzeugId); });
    try { C6.aendern(function (st) { if (!st.tage || typeof st.tage !== 'object') st.tage = {}; var g = st.tage.genannt = st.tage.genannt || {}; ks.forEach(function (k) { if (!g[k]) g[k] = h; }); if (b.erster) st.tage.ersterBrief = h; if (!st.tage.briefSchon) st.tage.briefSchon = h; var alle = Object.keys(g); if (alle.length > 300) alle.sort(function (a, c) { return g[a] < g[c] ? -1 : 1; }).slice(0, alle.length - 300).forEach(function (k) { delete g[k]; }); }, { schluessel: 'tage' }); } catch (e) {}
  }
  function brief() {
    var l = tageListe(), h = l[0], alleN = 0;
    l.forEach(function (d) { alleN += d.termine.length; });
    var heuteNeu = h.termine; // was heute ist, steht immer drin – heute ist es neu
    var naechste = l.slice(1).map(function (d) { return { tag: d.tag, abstand: d.abstand, wochentag: d.wochentag, termine: d.termine.filter(function (x) { return !alt(x.id); }) }; }).filter(function (d) { return d.termine.length; }).slice(0, 3);
    var vor = []; l.forEach(function (d) { d.vorbereitet.forEach(function (v) { if (!alt('v:' + v.werkzeugId)) vor.push({ titel: v.titel, art: v.art, werkzeugId: v.werkzeugId, tag: d.tag }); }); });
    var frage = null;
    for (var i = 0; i < l.length && !frage; i++) {
      for (var j = 0; j < l[i].termine.length; j++) {
        var t = l[i].termine[j], vs = vorschlag(t);
        if (vs && !vorbereitungVon(t.id) && !laeuft[t.id] && !(S().abgelehnt && S().abgelehnt[t.id])) { frage = { art: 'vorbereiten', termin: Object.assign({ tag: l[i].tag, abstand: l[i].abstand }, t), vorb: vs }; break; }
      }
    }
    if (!frage) {
      try { var a = C6.auftrag && C6.auftrag.heute ? C6.auftrag.heute() : null; if (a && !a.erledigt && a.text) frage = { art: 'aufgabe', text: a.text }; } catch (e) {}
    }
    var neu = heuteNeu.length || naechste.length || vor.length || (frage && frage.art !== 'aufgabe');
    var beantwortet = false; try { beantwortet = !!(C6.auftrag && C6.auftrag.beantwortet && C6.auftrag.beantwortet()); } catch (e) {}
    // die freie Frage nur, wenn der Brief sonst nichts fragt: viel los → was am wichtigsten ist; wenig → was ich wissen sollte
    if (!frage && neu && !beantwortet) frage = { art: alleN >= 2 ? 'wichtig' : 'leer' };
    if (!neu && !frage) {
      // einmal, ganz am Anfang: ein ehrlicher erster Brief, der das Postfach vorstellt (nichts erfunden)
      var eb = S().ersterBrief;
      if (!S().briefSchon || eb === heute()) return { tag: h.tag, erster: true, heute: [], naechste: [], vorbereitet: [], frage: beantwortet ? null : { art: 'leer' } };
      return null;
    }
    return { tag: h.tag, heute: heuteNeu, naechste: naechste, vorbereitet: vor, frage: frage };
  }

  // Selbst eintragen, ohne Kalender: ein eigenes Termin-Werkzeug „Was ansteht“ (wird angelegt oder erweitert)
  function eintragen(k, titel) {
    titel = kurz(titel, 80);
    if (!titel || !/^\d{4}-\d\d-\d\d$/.test(k || '') || !(C6.werkzeug && C6.werkzeug.haenge)) return null;
    var W = C6.werkzeug, w = (W.alle() || []).filter(function (x) { return x.wasAnsteht; })[0];
    var tk = 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
    var teil = { t: 'datum', text: titel, wann: k, k: tk };
    try {
      if (w) { w.teile = (w.teile || []).concat([teil]); C6.speichern && C6.speichern(); C6.bus.emit('werkzeug-eigen', { was: 'benutzt', id: w.id, sid: w.sid }); }
      else w = W.haenge({ name: 'Was ansteht', zeichen: 'kalender', farbe: '#8a6200', teile: [teil], wasAnsteht: true }, null);
    } catch (e) { return null; }
    if (!w) return null;
    var id = 'w:' + w.id + ':' + tk;
    emit({ was: 'eingetragen', termId: id, tag: k, i: abstand(k), werkzeugId: w.id });
    emit({ was: 'stand' });
    return Object.assign({ tag: k }, termin(id) || { id: id, titel: titel, zeit: null, quelle: 'werkzeug', art: artVon(titel), werkzeugId: w.id });
  }
  C6.tage = {
    liste: tageListe,
    status: function () { return { kalender: kal.status, grund: kal.grund, ungelesen: kal.ungelesen, stand: kal.stand, termine: kal.termine.length }; },
    fach: fach,
    termin: termin,
    vorschlag: vorschlag,
    vorbereitung: vorbereitungVon,
    laeuft: function (termId) { return laeuft[termId] || null; },
    vorbereiten: vorbereiten,
    ablehnen: function (termId) { if (!termId) return; try { C6.aendern(function (st) { if (!st.tage || typeof st.tage !== 'object') st.tage = {}; st.tage.abgelehnt = st.tage.abgelehnt || {}; st.tage.abgelehnt[termId] = Date.now(); }, { schluessel: 'tage' }); } catch (e) {} emit({ was: 'stand' }); },
    abgelehnt: function (termId) { var a = S().abgelehnt; return !!(a && a[termId]); },
    brief: brief,
    nenne: nenne,
    eintragen: eintragen,
    datum: datumText,
    abstand: abstand,
    // nach „neu verbinden“ oder für einen frischen Blick: Kalender neu holen
    neu: function () {
      if (!kal.mcp) { verbinden(); return; }
      kal.versucht = 0;
      try { var p = kal.mcp.invalidate && kal.mcp.invalidate(SERVER, WERKZEUG); if (p && p.catch) p.catch(function () { beobachte(); }); else beobachte(); } catch (e) { beobachte(); }
    },
    // „braucht deine Freigabe“: einmal mit der Geste des Menschen fragen (die Beobachtung fragt nie selbst)
    freigeben: function () {
      if (!kal.mcp || typeof kal.mcp.callTool !== 'function') return Promise.resolve(false);
      setze('laedt', kal.grund);
      return kal.mcp.callTool(SERVER, WERKZEUG, eingabe()).then(function (res) { annehmen(res); return true; }, function (err) { fehler(err); return false; });
    }
  };
  C6.bus.on('werkzeug-eigen', function (d) { if (d && (d.was === 'gehaengt' || d.was === 'weg' || d.was === 'benutzt')) emit({ was: 'stand' }); });
  verbinden();
})();
