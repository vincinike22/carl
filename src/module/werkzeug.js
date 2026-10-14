// Eigene Werkzeuge: Otto sagt in einem Satz, was er braucht, Carl baut es aus wenigen Bausteinen.
// Ein Werkzeug lebt im Space des Menschen (am Pfosten neben Carl), nicht im Rahmen der App.
(function () {
  var C6 = window.C6; if (!C6) return;
  var D = document;
  var T = '#2b2722', P = '#fbf7f0';
  function esc(t) { return C6.strings && C6.strings.esc ? C6.strings.esc(t) : String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function kurz(t, n) { t = String(t == null ? '' : t).trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
  // Carls Sätze kommen aus stimme.js (werkzeug.*); die Ersatzsätze hier gelten nur, wenn ein Schlüssel fehlt
  function stimme(k, w, ersatz) { try { var t = C6.stimme && C6.stimme.fest ? C6.stimme.fest('werkzeug.' + k, w || {}) : ''; if (t && !/\{[a-z]+\}/.test(t)) return t; } catch (e) {} return ersatz; }
  function bus(was, d) { try { C6.bus && C6.bus.emit('werkzeug-eigen', Object.assign({ was: was }, d || {})); } catch (e) {} }
  function S() { var s = C6.S || (C6.S = {}); if (!s.werkzeug || typeof s.werkzeug !== 'object') s.werkzeug = { liste: [], daten: {} }; if (!Array.isArray(s.werkzeug.liste)) s.werkzeug.liste = []; if (!s.werkzeug.daten) s.werkzeug.daten = {}; return s.werkzeug; }
  function merken() { try { C6.speichern && C6.speichern(); } catch (e) {} }
  function neueId() { return 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  function tag(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var WT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  function datumText(iso) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso || ''); if (!m) return ''; return (+m[3]) + '. ' + MON[+m[2] - 1]; }
  var FARBEN = { wert: '#4f7fa8', tag: '#8a6a3c', haken: '#5f7f3e', zaehler: '#2f5f8a', liste: '#a95f33', kalender: '#b7852a', notiz: '#7d4a74', frage: '#2c7a6e' };

  /* ---------- Zeichen (48er-Feld, eine Hand mit den Wandzeichen) ---------- */
  var ZEICHEN = {
    haken: function (f) { return '<rect x="7" y="7" width="34" height="34" rx="8" fill="' + P + '" stroke="' + T + '" stroke-width="2.5"/><path d="M14 25 l7 7 l14 -16" fill="none" stroke="' + f + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'; },
    zaehler: function (f) { return '<circle cx="24" cy="24" r="17" fill="' + P + '" stroke="' + T + '" stroke-width="2.5"/><path d="M17 31 V17 l-3 3 M24 17 h7 l-6 14" fill="none" stroke="' + f + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'; },
    liste: function (f) { return '<rect x="9" y="5" width="30" height="38" rx="3" fill="' + P + '" stroke="' + T + '" stroke-width="2.5"/><path d="M15 16 l2.5 2.5 l4 -5 M15 26 l2.5 2.5 l4 -5" fill="none" stroke="' + f + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 16 h9 M25 26 h9 M17 35 h17" stroke="' + T + '" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>'; },
    kalender: function (f) { return '<rect x="6" y="9" width="36" height="33" rx="3" fill="' + P + '" stroke="' + T + '" stroke-width="2.5"/><path d="M6 12 a3 3 0 0 1 3 -3 h30 a3 3 0 0 1 3 3 v6 H6 z" fill="' + f + '" stroke="' + T + '" stroke-width="2.5"/><path d="M15 5 v8 M33 5 v8" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/><circle cx="31" cy="31" r="5" fill="' + f + '"/>'; },
    notiz: function (f) { return '<path d="M9 6 h22 l8 8 v28 H9 z" fill="' + P + '" stroke="' + T + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M31 6 v8 h8" fill="none" stroke="' + T + '" stroke-width="2.5"/><path d="M15 22 h18 M15 29 h18 M15 36 h11" stroke="' + f + '" stroke-width="3" stroke-linecap="round"/>'; },
    wert: function (f) { return '<rect x="6" y="8" width="36" height="32" rx="4" fill="' + P + '" stroke="' + T + '" stroke-width="2.5"/><path d="M11 32 L19 24 L25 28 L36 15" fill="none" stroke="' + f + '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="15" r="3" fill="' + f + '"/>'; },
    tag: function (f) { return '<rect x="8" y="6" width="32" height="36" rx="3" fill="' + P + '" stroke="' + T + '" stroke-width="2.5"/><path d="M8 14 h32" stroke="' + f + '" stroke-width="4"/><path d="M14 23 h20 M14 30 h14" stroke="' + T + '" stroke-width="2.4" stroke-linecap="round" opacity=".6"/><circle cx="33" cy="33" r="4" fill="' + f + '"/>'; },
    frage: function (f) { return '<path d="M6 10 a4 4 0 0 1 4 -4 h28 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 H20 l-9 8 v-8 h-1 a4 4 0 0 1 -4 -4 z" fill="' + P + '" stroke="' + T + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M19 15 a5 5 0 1 1 6 5 v3" fill="none" stroke="' + f + '" stroke-width="3.4" stroke-linecap="round"/><circle cx="25" cy="28" r="2" fill="' + f + '"/>'; }
  };
  // Jeder Baustein trägt einen festen Schlüssel (k); seine Einträge hängen daran, nicht an der Reihenfolge.
  function schl(t, i) { return (t && t.k) || ('t' + i); }
  function neuK() { return 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  function zeichen(art, farbe) { var z = ZEICHEN[art] || ZEICHEN.notiz; return '<svg viewBox="0 0 48 48" aria-hidden="true">' + z(farbe || FARBEN[art] || T) + '</svg>'; }

  /* ---------- Bauen: aus einem Satz eine Beschreibung ---------- */
  var ARTEN = ['haken', 'zaehler', 'wert', 'tag', 'liste', 'datum', 'notiz', 'frage'];
  function bereinige(sp, satz) {
    if (!sp || typeof sp !== 'object') return null;
    var teile = (Array.isArray(sp.teile) ? sp.teile : []).filter(function (x) { return x && ARTEN.indexOf(x.t) >= 0; }).slice(0, 3).map(function (x) {
      var t = { t: x.t, text: kurz(x.text || '', 80) };
      if (x.t === 'wert') t.einheit = kurz(x.einheit || '', 12);
      if (x.t === 'zaehler' && +x.ziel > 0) t.ziel = Math.min(9999, Math.round(+x.ziel));
      if (x.t === 'liste') t.punkte = (Array.isArray(x.punkte) ? x.punkte : []).map(function (p) { return kurz(p, 60); }).filter(Boolean).slice(0, 12);
      if (x.t === 'datum') t.wann = /^\d{4}-\d\d-\d\d$/.test(x.wann || '') ? x.wann : tag(new Date(Date.now() + 7 * 864e5));
      if (x.t === 'frage') t.fragen = (Array.isArray(x.fragen) ? x.fragen : []).map(function (p) { return kurz(p, 120); }).filter(Boolean).slice(0, 5);
      return t;
    });
    if (!teile.length) return null;
    var z = sp.zeichen in ZEICHEN ? sp.zeichen : ({ wert: 'wert', tag: 'tag', haken: 'haken', zaehler: 'zaehler', liste: 'liste', datum: 'kalender', notiz: 'notiz', frage: 'frage' })[teile[0].t];
    return { name: kurz(sp.name || 'Mein Werkzeug', 28), zeichen: z, farbe: FARBEN[z], teile: teile, satz: kurz(satz, 200) };
  }
  // Datum aus dem Satz: „am 20.“, „am 20.10.“, „Montag“, „morgen“, „in 3 Tagen“
  function datumAus(s) {
    var d = new Date(), m;
    if ((m = /(\d{1,2})\.\s*(\d{1,2})\.?(\d{2,4})?/.exec(s))) { var j = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : d.getFullYear(); var x = new Date(j, +m[2] - 1, +m[1]); if (x < d && !m[3]) x.setFullYear(j + 1); return tag(x); }
    if ((m = /am\s+(\d{1,2})\./i.exec(s))) { var y = new Date(d.getFullYear(), d.getMonth(), +m[1]); if (y < d) y.setMonth(y.getMonth() + 1); return tag(y); }
    if (/übermorgen/i.test(s)) return tag(new Date(Date.now() + 2 * 864e5));
    if (/morgen/i.test(s)) return tag(new Date(Date.now() + 864e5));
    if ((m = /in\s+(\d+)\s+tag/i.exec(s))) return tag(new Date(Date.now() + +m[1] * 864e5));
    var tage = ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag'];
    for (var i = 0; i < 7; i++) if (new RegExp(tage[i], 'i').test(s)) { var n = (i - d.getDay() + 7) % 7 || 7; return tag(new Date(Date.now() + n * 864e5)); }
    return tag(new Date(Date.now() + 7 * 864e5));
  }
  function gross1(w) { return w ? w.charAt(0).toUpperCase() + w.slice(1) : w; }
  // Ottos Wort wird der Name: „ob ich gelaufen bin“ → „Gelaufen?“, „an das Geschenk für Mama“ → „Geschenk für Mama“
  function nameAus(s, ersatz) {
    var t = String(s).replace(/[„“"!.]/g, ' ').replace(/\s+/g, ' ').trim(), m;
    if ((m = /\bob ich (?:heute |schon )?((?:\S+ ){0,2}?\S+?) (?:bin|habe|hab|war|hatte)\b/i.exec(t)) || (m = /\bob ich (?:heute |schon )?([a-zäöüß]+)/i.exec(t))) return gross1(kurz(m[1], 26)) + '?';
    if ((m = /\ban (?:das|den|die|dem|meine[nmr]?|mein) ([A-ZÄÖÜ][\wäöüß]+(?: (?:für|von|mit) [\wäöüß]+)?)/.exec(t))) return kurz(m[1], 28);
    if ((m = /\bwie viele ([A-ZÄÖÜ][\wäöüß]+)/.exec(t))) return m[1];
    if ((m = /\bfür (?:den|die|das) ([A-ZÄÖÜ][\wäöüß]+)/.exec(t))) return m[1];
    return nameAusAlt(s, ersatz);
  }
  function nameAusAlt(s, ersatz) {
    var w = String(s).replace(/[„“"!?.,]/g, ' ').split(/\s+/).filter(function (x) { return x.length > 3 && /^[A-ZÄÖÜ]/.test(x) && !/^(Ich|Jeden|Jede|Jedes|Wenn|Dann|Mama|Papa|Carl|Erinnere|Erinner|Eine|Einen|Liste|Abend|Morgen|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|Fragen|Frage|Zähle|Zähl)$/.test(x); });
    return w.length ? w.slice(0, 2).join(' ') : ersatz;
  }
  function ausVorlage(satz) {
    var s = String(satz || '');
    var sp;
    var einh = (/(?:^|[\s\d])(kg|kilo(?:gramm)?|km|kilometer[n]?|meter[n]?|stunden?|std|h|liter[n]?|l|minuten?|min|schritte[n]?|euro|€|grad|°c|seiten|gläser|glas|tassen?|cm|zentimeter[n]?)(?=$|[\s.,!?])/i.exec(s) || [])[1] || '';
    var EINH = { kilo: 'kg', kilogramm: 'kg', kilometer: 'km', kilometern: 'km', meter: 'm', metern: 'm', stunde: 'h', stunden: 'h', std: 'h', liter: 'l', litern: 'l', minute: 'min', minuten: 'min', schritte: 'Schritte', schritten: 'Schritte', euro: '€', grad: '°C', '°c': '°C', seiten: 'Seiten', gläser: 'Gläser', glas: 'Gläser', tasse: 'Tassen', tassen: 'Tassen', zentimeter: 'cm', zentimetern: 'cm' };
    einh = EINH[einh.toLowerCase()] || einh;
    // Zählbares ohne Maß (Seiten, Gläser, Tassen) bleibt ein Zähler
    if (/^(Seiten|Gläser|Tassen)$/.test(einh) && !/wiege|messen/i.test(s)) einh = '';
    if (einh || /wiege|gewicht|geschlafen|schlaf|puls|blutdruck|messen|wie lange|wie weit|wie schwer|\d+\s*(kg|km|h|min)\b/i.test(s)) sp = { name: nameAus(s, 'Messen'), teile: [{ t: 'wert', text: 'Heute' + (einh ? ' in ' + einh : ''), einheit: einh || (/schlaf/i.test(s) ? 'h' : /wiege|gewicht/i.test(s) ? 'kg' : '') }] };
    else if (/satz am tag|satz des tages|tagebuch|was heute war|jeden abend einen satz|jeden tag einen satz|foto des tages/i.test(s)) sp = { name: nameAus(s, 'Ein Satz am Tag'), teile: [{ t: 'tag', text: 'Ein Satz für heute' }] };
    else if (/frage|rückblick|rueckblick|reflekt/i.test(s)) sp = { name: nameAus(s, 'Fragen'), teile: [{ t: 'frage', text: '', fragen: ['Was war heute gut?', 'Was hat gehakt?', 'Was nimmst du mit?'] }] };
    else if (/jeden tag|täglich|taeglich|jeden morgen|jeden abend|gewohnheit|immer wenn|gelaufen|getrunken|meditier|geübt|geuebt/i.test(s)) sp = { name: nameAus(s, 'Jeden Tag'), teile: [{ t: 'haken', text: 'Heute geschafft?' }] };
    else if (/termin|erinner|am \d|\d\.\s*\d|geburtstag|bis zum|bis montag|bis dienstag|bis mittwoch|bis donnerstag|bis freitag|morgen|deadline/i.test(s)) sp = { name: nameAus(s, 'Termin'), teile: [{ t: 'datum', text: '', wann: datumAus(s) }] };
    else if (/wie oft|zähl|zaehl|anzahl|wie viele|seiten|kilometer|gläser|glaeser/i.test(s)) sp = { name: nameAus(s, 'Zähler'), teile: [{ t: 'zaehler', text: 'Heute' }] };
    else if (/liste|einkauf|packen|sammeln|ideen für|ideen fuer|mitnehmen/i.test(s)) sp = { name: nameAus(s, 'Liste'), teile: [{ t: 'liste', text: '', punkte: [] }] };
    else sp = { name: nameAus(s, 'Notiz'), teile: [{ t: 'notiz', text: '' }] };
    var r = bereinige(sp, satz); r.von = 'vorlage'; return r;
  }
  var VORLAGEN = [
    { id: 'gewohnheit', name: 'Gewohnheit', satz: 'Ich will jeden Tag sehen, ob ich gelaufen bin.', kurzname: 'Laufen', hinweis: 'Jeden Tag ein Haken' },
    { id: 'termin', name: 'Termin', satz: 'Erinnere mich am Freitag an das Geschenk für Mama.', kurzname: 'Geschenk für Mama', hinweis: 'Carl erinnert dich im Brief' },
    { id: 'zaehler', name: 'Zähler', satz: 'Ich will zählen, wie viele Seiten ich lese.', hinweis: 'Plus eins, wenn es passiert' },
    { id: 'liste', name: 'Liste', satz: 'Eine Liste, was ich für den Urlaub packen muss.', hinweis: 'Abhaken, was erledigt ist' }
  ];
  function baue(satz) {
    satz = String(satz || '').trim();
    if (!satz) return Promise.resolve(null);
    var bitte = 'Ein Mensch ohne Technikwissen wünscht sich ein kleines Werkzeug: „' + kurz(satz, 300) + '“. Baue es aus höchstens drei Bausteinen. Antworte NUR mit JSON, ohne weitere Worte:\n' +
      '{"name":"<höchstens drei Wörter, Deutsch>","zeichen":"haken|zaehler|liste|kalender|notiz|frage","teile":[ … ]}\n' +
      'Bausteine: {"t":"haken","text":"…"} (jeden Tag abhaken) · {"t":"zaehler","text":"…","ziel":Zahl oder weglassen} · {"t":"wert","text":"…","einheit":"kg|km|h|…"} (einen Wert am Tag messen) · {"t":"tag","text":"…"} (ein Satz am Tag) · {"t":"liste","text":"…","punkte":["…"]} · {"t":"datum","text":"…","wann":"JJJJ-MM-TT"} (heute ist ' + tag() + ') · {"t":"notiz","text":"…"} · {"t":"frage","text":"…","fragen":["…"]}.';
    var p = C6.denk ? Promise.resolve(C6.denk(bitte, { kontext: 'Werkstatt, ein Werkzeug bauen', stumm: true })).catch(function () { return ''; }) : Promise.resolve('');
    var zeit = new Promise(function (r) { setTimeout(function () { r(''); }, 25000); });
    return Promise.race([p, zeit]).then(function (t) {
      var m = /\{[\s\S]*\}/.exec(String(t || '')), sp = null;
      if (m) { try { sp = bereinige(JSON.parse(m[0]), satz); } catch (e) { sp = null; } }
      if (sp) { sp.von = 'denk'; return sp; }
      return ausVorlage(satz);
    });
  }

  /* ---------- Speichern ---------- */
  function alle(sid) { var l = S().liste.filter(function (w) { return !w.weg; }); return sid ? l.filter(function (w) { return w.sid === sid; }) : l; }
  function hol(id) { return S().liste.filter(function (w) { return w.id === id && !w.weg; })[0] || null; }
  function haenge(spec, sid) {
    if (!spec) return null;
    var w = Object.assign({}, spec, { id: spec.id || neueId(), sid: sid || null, ts: Date.now() });
    w.teile = (w.teile || []).map(function (t, i) { return t.k ? t : Object.assign({}, t, { k: 't' + i }); });
    var st = S(); st.liste = st.liste.filter(function (x) { return x.id !== w.id; }); st.liste.push(w);
    if (spec._daten) { st.daten[w.id] = spec._daten; delete w._daten; }
    merken(); bus('gehaengt', { id: w.id, sid: w.sid });
    return w;
  }
  // Wegräumen ist umkehrbar: das Werkzeug liegt im Fach „Weggeräumt“, die Einträge bleiben
  function entferne(id) { var w = hol(id); if (!w) return; w.weg = Date.now(); merken(); bus('weg', { id: id }); }
  function zurueckholen(id) { var w = S().liste.filter(function (x) { return x.id === id; })[0]; if (!w) return false; delete w.weg; merken(); bus('gehaengt', { id: id, sid: w.sid }); return true; }
  function weggeraeumt() { return S().liste.filter(function (w) { return w.weg; }); }
  // nur das hier ist endgültig – und läuft deshalb über die Freigabe mit zweitem Tipp
  function fuerImmer(id) {
    var w = S().liste.filter(function (x) { return x.id === id; })[0]; if (!w) return Promise.resolve(false);
    var n = eintraegeZaehlen(id);
    var frag = C6.freigabe ? C6.freigabe({ was: '„' + w.name + '“ für immer löschen?', folgen: n ? 'Deine ' + n + ' Einträge sind danach weg.' : 'Es ist danach weg.', umkehrbar: false, ja: 'Für immer löschen' }) : Promise.resolve(false);
    return Promise.resolve(frag).then(function (ja) { if (!ja) return false; var st = S(); st.liste = st.liste.filter(function (x) { return x.id !== id; }); delete st.daten[id]; merken(); bus('weg', { id: id, fuerImmer: true }); return true; });
  }
  function teilen(id, an) { var w = hol(id); if (!w) return; w.teleskop = an !== false; merken(); bus('geteilt', { id: id, sid: w.sid }); }
  function daten(spec) {
    if (spec.id && hol(spec.id)) { var st = S(); return st.daten[spec.id] || (st.daten[spec.id] = {}); }
    return spec._daten || (spec._daten = {});
  }
  function erinnerungen() {
    var heute = tag(), bis = tag(new Date(Date.now() + 3 * 864e5)), r = [];
    alle().forEach(function (w) { (w.teile || []).forEach(function (t) { if (t.t === 'datum' && t.wann >= heute && t.wann <= bis) r.push({ id: w.id, name: w.name, sid: w.sid, text: t.text, wann: t.wann }); }); });
    return r.sort(function (a, b) { return a.wann < b.wann ? -1 : 1; });
  }

  /* ---------- Malen: das Werkzeug lebt ---------- */
  function teilHtml(t, i, d, klein) {
    var k = schl(t, i), dd = d[k] || {};
    if (t.t === 'haken') {
      var h = '', heute = new Date();
      for (var j = klein ? 0 : 6; j >= 0; j--) {
        var x = new Date(heute.getTime() - j * 864e5), id = tag(x), an = !!(dd.tage && dd.tage[id]);
        h += '<button type="button" class="c6wz-tag' + (j === 0 ? ' c6wz-heute' : '') + '" data-i="' + i + '" data-tag="' + id + '" aria-pressed="' + an + '" aria-label="' + (j === 0 ? 'Heute' : WT[x.getDay()]) + (an ? ', erledigt' : '') + '"><span class="c6wz-tag-kreis">' + (an ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.8l3.6 3.7L15.8 5.6"/></svg>' : '') + '</span><small>' + (j === 0 ? 'heute' : WT[x.getDay()]) + '</small></button>';
      }
      return '<div class="c6wz-teil c6wz-haken">' + (klein ? '' : '<p class="c6wz-text">' + esc(t.text) + '</p>') + '<div class="c6wz-tage">' + h + '</div></div>';
    }
    if (t.t === 'zaehler') {
      var n = dd.n || 0;
      return '<div class="c6wz-teil c6wz-zaehler">' + (klein ? '' : '<p class="c6wz-text">' + esc(t.text) + '</p>') + '<div class="c6wz-zahl-zeile"><button type="button" class="c6wz-rund" data-i="' + i + '" data-d="-1" aria-label="Eins weniger">−</button><span class="c6wz-zahl" aria-live="polite">' + n + (t.ziel ? '<small> von ' + t.ziel + '</small>' : '') + '</span><button type="button" class="c6wz-rund c6wz-plus" data-i="' + i + '" data-d="1" aria-label="Eins mehr">+</button></div></div>';
    }
    if (t.t === 'wert') {
      var lw = dd.log || {}, he = lw[tag()], hw = wertV(he), heE = wertE(he, t);
      var ein = heE ? ' ' + esc(heE) : '';
      if (klein) return '<div class="c6wz-teil"><p class="c6wz-gross">' + (hw != null ? esc(zahlText(hw)) + ein : '–') + '</p></div>';
      return '<div class="c6wz-teil c6wz-wert"><p class="c6wz-text">' + esc(t.text) + '</p><form class="c6wz-wert-form" data-i="' + i + '"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Wert für heute' + (t.einheit ? ' in ' + esc(t.einheit) : '') + '" placeholder="heute" value="' + (hw != null && heE === (t.einheit || '') ? esc(zahlText(hw)) : '') + '">' + (t.einheit ? '<span class="c6wz-einheit">' + esc(t.einheit) + '</span>' : '') + '<button type="submit" class="c6wz-rund c6wz-plus" aria-label="Eintragen">✓</button></form></div>';
    }
    if (t.t === 'tag') {
      var lt = dd.log || {}, ht = lt[tag()] || '';
      if (klein) return '<div class="c6wz-teil"><p class="c6wz-text">' + (ht ? esc(kurz(ht, 34)) : 'heute noch nichts') + '</p></div>';
      return '<div class="c6wz-teil c6wz-tagsatz"><p class="c6wz-text">' + esc(t.text) + '</p><form class="c6wz-tag-form" data-i="' + i + '"><input type="text" maxlength="200" placeholder="Ein Satz für heute" aria-label="Ein Satz für heute" value="' + esc(ht) + '"><button type="submit" class="c6wz-rund c6wz-plus" aria-label="Behalten">✓</button></form></div>';
    }
    if (t.t === 'liste') {
      var pk = (dd.punkte || t.punkte || []), erl = dd.erl || {};
      if (klein) { var offen = pk.filter(function (p, j) { return !erl[j]; }).length; return '<div class="c6wz-teil"><p class="c6wz-text">' + (pk.length ? (offen ? offen + ' offen' : 'alles erledigt') : 'noch leer') + '</p></div>'; }
      return '<div class="c6wz-teil c6wz-liste"><p class="c6wz-text">' + esc(t.text) + '</p><ul>' + pk.map(function (p, j) { return '<li><label><input type="checkbox" data-i="' + i + '" data-j="' + j + '"' + (erl[j] ? ' checked' : '') + '> <span>' + esc(p) + '</span></label></li>'; }).join('') + '</ul>' +
        '<form class="c6wz-dazu" data-i="' + i + '"><input type="text" maxlength="60" placeholder="Noch etwas …" aria-label="Noch etwas auf die Liste"><button type="submit" class="c6wz-rund" aria-label="Dazu">+</button></form></div>';
    }
    if (t.t === 'datum') {
      var w = dd.wann || t.wann;
      return '<div class="c6wz-teil c6wz-datum"><p class="c6wz-gross">' + esc(datumText(w)) + '</p>' + (klein ? '' : '<p class="c6wz-text">' + esc(t.text) + '</p><label class="c6wz-klein">Anderer Tag <input type="date" data-i="' + i + '" value="' + esc(w) + '"></label><p class="c6wz-leise">Ich erinnere dich im Brief, drei Tage vorher.</p>') + '</div>';
    }
    if (t.t === 'notiz') {
      if (klein) return '<div class="c6wz-teil"><p class="c6wz-text">' + esc(kurz(dd.t || t.text, 40)) + '</p></div>';
      return '<div class="c6wz-teil c6wz-notiz"><p class="c6wz-text">' + esc(t.text) + '</p><textarea data-i="' + i + '" rows="3" placeholder="Schreib hier …" aria-label="' + esc(t.text) + '">' + esc(dd.t || '') + '</textarea></div>';
    }
    if (t.t === 'frage') {
      var fr = t.fragen && t.fragen.length ? t.fragen : [t.text], a = dd.a || [], q = Math.min(a.length, fr.length - 1);
      if (klein) return '<div class="c6wz-teil"><p class="c6wz-text">' + esc(kurz(fr[0], 40)) + '</p></div>';
      return '<div class="c6wz-teil c6wz-frage"><p class="c6wz-text">' + esc(fr[q]) + '</p><form class="c6wz-antwort" data-i="' + i + '" data-q="' + q + '"><input type="text" maxlength="200" placeholder="Ein Satz reicht." aria-label="' + esc(fr[q]) + '" value="' + esc(a[q] || '') + '"><button type="submit" class="c6wz-rund" aria-label="Weiter">→</button></form>' +
        (a.length ? '<p class="c6wz-leise">' + a.length + ' von ' + fr.length + ' beantwortet</p>' : '') + '</div>';
    }
    return '';
  }
  // Werte: ein Eintrag ist {v, einheit} (alte Einträge: nur die Zahl, Einheit des Bausteins von damals)
  function wertV(x) { return x == null ? null : (typeof x === 'object' ? x.v : x); }
  function wertE(x, t) { return x && typeof x === 'object' && x.einheit != null ? x.einheit : ((t && t.einheit) || ''); }
  function zahlAus(s) { s = String(s == null ? '' : s).trim().replace(/\s/g, ''); if (!/^-?\d+([.,]\d+)?$/.test(s)) return null; var v = parseFloat(s.replace(',', '.')); return isFinite(v) ? v : null; }
  function zahlText(v) { return String(v).replace('.', ','); }
  // Rückblick je Werkzeug: sanft, ohne Serie, ohne Zahl-Druck – nur sehen, wie es war
  function rueckblick(spec, d) {
    var h = '';
    (spec.teile || []).forEach(function (t, i) {
      var dd = d[schl(t, i)] || {}, heute = new Date(), z = '';
      if (t.t === 'haken') {
        for (var j = 27; j >= 0; j--) { var x = new Date(heute.getTime() - j * 864e5); z += '<i class="' + (dd.tage && dd.tage[tag(x)] ? 'an' : '') + '" title="' + x.getDate() + '.' + (x.getMonth() + 1) + '."></i>'; }
        h += '<div class="c6wz-rb"><p class="c6wz-rb-kopf">Die letzten vier Wochen</p><div class="c6wz-rb-punkte">' + z + '</div></div>';
      } else if (t.t === 'zaehler' || t.t === 'wert') {
        var lg = dd.log || {}, werte = [], max = 0, min = Infinity, fremd = [];
        if (t.t === 'wert') Object.keys(lg).sort().forEach(function (y) { var e = wertE(lg[y], t); if (e !== (t.einheit || '')) fremd.push(datumText(y) + ': ' + zahlText(wertV(lg[y])) + (e ? ' ' + e : '')); });
        for (var k = 13; k >= 0; k--) { var y = tag(new Date(heute.getTime() - k * 864e5)), roh = lg[y], v = wertV(roh); if (t.t === 'wert' && roh != null && wertE(roh, t) !== (t.einheit || '')) v = null; werte.push(v); if (v != null) { max = Math.max(max, v); min = Math.min(min, v); } }
        if (fremd.length) h += '<div class="c6wz-rb"><p class="c6wz-rb-kopf">Frühere Einträge</p><p class="c6wz-leise">' + esc(fremd.slice(-4).join(' · ')) + '</p></div>';
        if (!werte.some(function (v) { return v != null; })) return;
        if (t.t === 'zaehler') {
          z = werte.map(function (v) { return '<i style="height:' + (v ? Math.max(8, Math.round(v / (max || 1) * 100)) : 4) + '%"' + (v ? '' : ' class="leer"') + '></i>'; }).join('');
          h += '<div class="c6wz-rb"><p class="c6wz-rb-kopf">Die letzten zwei Wochen</p><div class="c6wz-rb-balken">' + z + '</div></div>';
        } else {
          if (werte.filter(function (v) { return v != null; }).length < 2) { h += '<div class="c6wz-rb"><p class="c6wz-rb-kopf">Bisher</p><p class="c6wz-leise">Ein Eintrag: ' + esc(zahlText(max)) + (t.einheit ? ' ' + esc(t.einheit) : '') + '. Ab dem zweiten siehst du hier den Verlauf.</p></div>'; return; }
          var sp = max - min || 1, pts = [];
          werte.forEach(function (v, n) { if (v != null) pts.push((n * (200 / 13)).toFixed(1) + ',' + (54 - (v - min) / sp * 44).toFixed(1)); });
          h += '<div class="c6wz-rb"><p class="c6wz-rb-kopf">Die letzten zwei Wochen' + (t.einheit ? ' · ' + esc(t.einheit) : '') + '</p><svg class="c6wz-rb-linie" viewBox="-6 0 212 60" aria-hidden="true"><polyline points="' + pts.join(' ') + '" fill="none" stroke="' + esc(spec.farbe || T) + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
            pts.map(function (p) { var q = p.split(','); return '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3.4" fill="' + esc(spec.farbe || T) + '"/>'; }).join('') + '</svg><p class="c6wz-leise">zwischen ' + esc(zahlText(min)) + ' und ' + esc(zahlText(max)) + (t.einheit ? ' ' + esc(t.einheit) : '') + '</p></div>';
        }
      } else if (t.t === 'tag') {
        var ks = Object.keys(dd.log || {}).sort().reverse().slice(0, 5);
        if (!ks.length) return;
        h += '<div class="c6wz-rb"><p class="c6wz-rb-kopf">Deine Sätze</p><ul class="c6wz-rb-saetze">' + ks.map(function (k2) { return '<li><small>' + esc(datumText(k2)) + '</small> ' + esc(dd.log[k2]) + '</li>'; }).join('') + '</ul></div>';
      }
    });
    return h;
  }
  function male(el, spec, o) {
    o = o || {};
    if (!el || !spec) return null;
    var klein = !!o.klein;
    function zeichne() {
      var d = daten(spec);
      var teile = klein ? (spec.teile || []).slice(0, 1) : (spec.teile || []);
      el.innerHTML = '<div class="c6wz-werkzeug' + (klein ? ' c6wz-klein-form' : '') + '" style="--wz:' + esc(spec.farbe || T) + '">' +
        '<div class="c6wz-kopf">' + (klein ? '<button type="button" class="c6wz-name-knopf" aria-label="' + esc(spec.name) + ' groß öffnen">' : '') + '<span class="c6wz-zeichen">' + zeichen(spec.zeichen, spec.farbe) + '</span><b class="c6wz-name">' + esc(spec.name) + '</b>' + (klein ? '</button>' : '') + '</div>' +
        teile.map(function (t, i) { return teilHtml(t, i, d, klein); }).join('') + (o.rueckblick && !klein ? rueckblick(spec, d) : '') + '</div>';
      binde(d);
    }
    function benutzt() { if (spec.id && hol(spec.id)) merken(); bus('benutzt', { id: spec.id || null, sid: spec.sid || null }); }
    function binde(d) {
      [].forEach.call(el.querySelectorAll('.c6wz-tag'), function (b) {
        b.onclick = function () { var k = schl(spec.teile[+b.dataset.i], +b.dataset.i); d[k] = d[k] || {}; d[k].tage = d[k].tage || {}; var id = b.dataset.tag; if (d[k].tage[id]) delete d[k].tage[id]; else d[k].tage[id] = 1; benutzt(); zeichne(); var nb = el.querySelector('.c6wz-tag[data-tag="' + id + '"]'); if (nb && d[k].tage[id] && !C6.ruhig && nb.animate) nb.animate([{ transform: 'scale(.8)' }, { transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' }); };
      });
      [].forEach.call(el.querySelectorAll('.c6wz-zahl-zeile .c6wz-rund'), function (b) {
        b.onclick = function () { var k = schl(spec.teile[+b.dataset.i], +b.dataset.i); d[k] = d[k] || {}; var vor = d[k].n || 0; d[k].n = Math.max(0, vor + (+b.dataset.d)); d[k].log = d[k].log || {}; d[k].log[tag()] = Math.max(0, (d[k].log[tag()] || 0) + (d[k].n - vor)); benutzt(); zeichne(); };
      });
      [].forEach.call(el.querySelectorAll('.c6wz-liste input[type=checkbox]'), function (c) {
        c.onchange = function () { var k = schl(spec.teile[+c.dataset.i], +c.dataset.i); d[k] = d[k] || {}; d[k].erl = d[k].erl || {}; if (c.checked) d[k].erl[c.dataset.j] = 1; else delete d[k].erl[c.dataset.j]; benutzt(); };
      });
      [].forEach.call(el.querySelectorAll('.c6wz-dazu'), function (f) {
        f.onsubmit = function (e) { e.preventDefault(); var v = f.querySelector('input').value.trim(); if (!v) return; var i = f.dataset.i, k = schl(spec.teile[+i], +i); d[k] = d[k] || {}; d[k].punkte = (d[k].punkte || (spec.teile[i].punkte || []).slice()); d[k].punkte.push(kurz(v, 60)); benutzt(); zeichne(); var n = el.querySelector('.c6wz-dazu[data-i="' + i + '"] input'); if (n) n.focus(); };
      });
      [].forEach.call(el.querySelectorAll('.c6wz-datum input[type=date]'), function (x) {
        x.onchange = function () { if (!/^\d{4}-\d\d-\d\d$/.test(x.value)) return; var k = schl(spec.teile[+x.dataset.i], +x.dataset.i); d[k] = d[k] || {}; d[k].wann = x.value; spec.teile[+x.dataset.i].wann = x.value; benutzt(); zeichne(); };
      });
      [].forEach.call(el.querySelectorAll('.c6wz-notiz textarea'), function (x) {
        x.oninput = function () { var k = schl(spec.teile[+x.dataset.i], +x.dataset.i); d[k] = d[k] || {}; d[k].t = x.value.slice(0, 2000); clearTimeout(x._u); x._u = setTimeout(benutzt, 500); };
      });
      [].forEach.call(el.querySelectorAll('.c6wz-antwort'), function (f) {
        f.onsubmit = function (e) { e.preventDefault(); var v = f.querySelector('input').value.trim(); if (!v) return; var k = schl(spec.teile[+f.dataset.i], +f.dataset.i); d[k] = d[k] || {}; d[k].a = d[k].a || []; d[k].a[+f.dataset.q] = kurz(v, 200); benutzt(); zeichne(); };
      });
      [].forEach.call(el.querySelectorAll('.c6wz-wert-form'), function (f) {
        f.onsubmit = function (e) { e.preventDefault(); var v = zahlAus(f.querySelector('input').value); if (v == null) { f.querySelector('input').focus(); return; } var tt = spec.teile[+f.dataset.i], k = schl(tt, +f.dataset.i); d[k] = d[k] || {}; d[k].log = d[k].log || {}; d[k].log[tag()] = { v: Math.round(v * 100) / 100, einheit: tt.einheit || '' }; benutzt(); zeichne(); };
      });
      [].forEach.call(el.querySelectorAll('.c6wz-tag-form'), function (f) {
        f.onsubmit = function (e) { e.preventDefault(); var v = f.querySelector('input').value.trim(); if (!v) return; var k = schl(spec.teile[+f.dataset.i], +f.dataset.i); d[k] = d[k] || {}; d[k].log = d[k].log || {}; d[k].log[tag()] = kurz(v, 200); benutzt(); zeichne(); };
      });
      var nk = el.querySelector('.c6wz-name-knopf'); if (nk) nk.onclick = function () { gross(spec.id); };
    }
    zeichne();
    return { el: el, neu: zeichne };
  }

  /* ---------- Der Ablauf „Neues Werkzeug“ (ein Blatt über dem Raum) ---------- */
  var blatt = null, sitzung = 0;
  var leihe = null;
  function feldZurueck() { if (leihe) { var z = leihe; leihe = null; try { z(); } catch (e) {} } }
  // das eine Feld unten fragt, was das Blatt braucht; ohne Kern-Leihe bleibt das Feld im Blatt (Rückfall)
  function feldLeihen(platz, nimm) {
    feldZurueck();
    if (!(C6.feld && typeof C6.feld.leihen === 'function')) return false;
    try { leihe = C6.feld.leihen({ platzhalter: platz, nimm: function (t) { leihe = null; nimm(t); return false; } }); return true; } catch (e) { leihe = null; return false; }
  }
  function zu() { feldZurueck(); if (!blatt) return; var b = blatt; blatt = null; b.classList.remove('c6wz-an'); setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, C6.ruhig ? 0 : 260); }
  function blattAuf(titel) {
    zu();
    var b = D.createElement('div'); b.className = 'c6wz-blatt'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', titel);
    b.innerHTML = '<button type="button" class="c6wz-zu" aria-label="Schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><p class="c6wz-kicker">' + esc(titel) + '</p><div class="c6wz-inhalt"></div>';
    (D.getElementById('c6') || D.body).appendChild(b);
    b.querySelector('.c6wz-zu').onclick = zu;
    blatt = b; void b.offsetWidth; b.classList.add('c6wz-an');
    return b.querySelector('.c6wz-inhalt');
  }
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && blatt) { e.preventDefault(); e.stopPropagation(); zu(); } }, true);
  if (C6.bus) C6.bus.on('raum', function () { zu(); });

  function oeffne(o) {
    o = o || {};
    var nr = ++sitzung;
    var el = blattAuf('Neues Werkzeug');
    var frageT = stimme('wunsch', null, 'Was soll dein Werkzeug können?');
    var geliehen = feldLeihen(frageT, function (t) { bauen(t, o.sid, nr); });
    el.innerHTML = '<h3 class="c6wz-titel">' + esc(frageT) + '</h3>' +
      (geliehen ? '<p class="c6wz-leise c6wz-unten">Schreib es unten ins Feld. Ein Satz reicht.</p>' : '<form class="c6wz-wunsch"><input type="text" maxlength="200" placeholder="Ein Satz reicht." aria-label="' + esc(stimme('wunsch', null, 'Was soll dein Werkzeug können?')) + '" value="' + esc(o.satz || '') + '"><button type="submit" class="c6wz-knopf c6wz-haupt">Bauen</button></form>') +
      '<p class="c6wz-leise">Oder nimm eins zum Anfang:</p><div class="c6wz-vorlagen">' + VORLAGEN.slice(0, 2).map(function (v) { return '<button type="button" class="c6wz-vorlage" data-v="' + v.id + '">' + zeichen(v.id === 'gewohnheit' ? 'haken' : 'kalender') + '<span><b>' + esc(v.name) + '</b><small>„' + esc(v.satz) + '“</small></span></button>'; }).join('') + '</div>';
    var f = el.querySelector('form'), inp = f ? f.querySelector('input') : null;
    if (f) f.onsubmit = function (e) { e.preventDefault(); var s = inp.value.trim(); if (!s) { inp.focus(); return; } bauen(s, o.sid, nr); };
    [].forEach.call(el.querySelectorAll('.c6wz-vorlage'), function (b) { b.onclick = function () { var v = VORLAGEN.filter(function (x) { return x.id === b.dataset.v; })[0]; if (inp) inp.value = v.satz; bauen(v.satz, o.sid, nr); }; });
    if (o.satz) bauen(o.satz, o.sid, nr); else if (inp) setTimeout(function () { try { if (C6.geraet === 'computer') inp.focus(); } catch (e) {} }, 300);
  }
  function bauen(satz, sid, nr) {
    if (!blatt || nr !== sitzung) return;
    feldZurueck();
    var el = blatt.querySelector('.c6wz-inhalt');
    el.innerHTML = '<h3 class="c6wz-titel">„' + esc(kurz(satz, 90)) + '“</h3><p class="c6wz-baut" aria-live="polite">' + esc(stimme('baut', null, 'Ich bau es dir …')) + '</p>';
    baue(satz).then(function (sp) {
      if (!blatt || nr !== sitzung) return;
      if (!sp) { oeffne({ sid: sid }); return; }
      bus('gebaut', {});
      el.innerHTML = '<p class="c6wz-leise">' + esc(sp.von === 'vorlage' ? stimme('vorlage', null, 'Mitdenken kann ich hier noch nicht, darum aus einer Vorlage. Probier es aus.') : stimme('gebaut', null, 'So hab ich es gebaut. Probier es aus.')) + '</p>' +
        '<div class="c6wz-vorschau"></div>' +
        '<div class="c6wz-wahl"><button type="button" class="c6wz-knopf c6wz-haupt" data-w="passt">Passt</button><button type="button" class="c6wz-knopf" data-w="anders">Anders</button></div>';
      male(el.querySelector('.c6wz-vorschau'), sp);
      el.querySelector('[data-w=passt]').onclick = function () { wohin(sp, sid, nr); };
      el.querySelector('[data-w=anders]').onclick = function () {
        var w = el.querySelector('.c6wz-wahl');
        var andersT = stimme('anders', null, 'Was soll anders sein?');
        if (feldLeihen(andersT, function (a) { bauen(satz + '. Anders: ' + a, sid, nr); })) { w.outerHTML = '<p class="c6wz-leise c6wz-unten">' + esc(andersT) + ' Schreib es unten ins Feld.</p>'; return; }
        w.outerHTML = '<form class="c6wz-wunsch c6wz-anders"><input type="text" maxlength="200" placeholder="' + esc(stimme('anders', null, 'Was soll anders sein?')) + '" aria-label="' + esc(stimme('anders', null, 'Was soll anders sein?')) + '"><button type="submit" class="c6wz-knopf c6wz-haupt">Neu bauen</button></form>';
        var af = el.querySelector('.c6wz-anders'), ai = af.querySelector('input'); ai.focus();
        af.onsubmit = function (e) { e.preventDefault(); var a = ai.value.trim(); if (!a) { ai.focus(); return; } bauen(satz + '. Anders: ' + a, sid, nr); };
      };
    });
  }
  function wohin(sp, sid, nr) {
    var el = blatt.querySelector('.c6wz-inhalt');
    var ziele = []; try { ziele = (C6.space && C6.space.alle ? C6.space.alle() : []).slice(0, 2); } catch (e) { ziele = []; }
    if (sid) ziele = ziele.filter(function (z) { return z.stringId === sid; }).concat(ziele.filter(function (z) { return z.stringId !== sid; })).slice(0, 2);
    var kopf = '<div class="c6wz-mini"></div>';
    if (!ziele.length) {
      var w = haenge(sp, null);
      el.innerHTML = kopf + '<p class="c6wz-satz">' + esc(stimme('ohneSpace', null, 'Fertig. Sobald du einen Space hast, stell ich es neben mich.')) + '</p>';
      male(el.querySelector('.c6wz-mini'), w, { klein: true });
      return;
    }
    el.innerHTML = kopf + '<h3 class="c6wz-titel">' + esc(stimme('wohin', null, 'Wo soll es stehen?')) + '</h3><div class="c6wz-ziele">' + ziele.map(function (z, i) { return '<button type="button" class="c6wz-knopf' + (i ? '' : ' c6wz-haupt') + '" data-sid="' + esc(z.stringId) + '">In „' + esc(kurz(z.titel, 20)) + '“ stellen</button>'; }).join('') +
      (C6.space && C6.space.neu ? '<button type="button" class="c6wz-knopf" data-neu="1">Neuer Space</button>' : '') + '</div>';
    var nk = el.querySelector('[data-neu]');
    if (nk) nk.onclick = function () { var s = C6.space.neu(sp.name, { oeffnen: false }); if (s) { nk.setAttribute('data-sid', s); nk.onclick = null; stellen(nk); } };
    male(el.querySelector('.c6wz-mini'), sp, { klein: true });
    [].forEach.call(el.querySelectorAll('[data-sid]'), function (b) { b.onclick = function () { stellen(b); }; });
    function stellen(b) {
        var s = b.getAttribute('data-sid'), f = C6.strings && C6.strings.hol(s);
        var w = haenge(sp, s);
        el.innerHTML = kopf + '<p class="c6wz-satz">' + esc(stimme('steht', { werkzeug: w.name, titel: kurz(f ? f.titel : '', 30) }, '„' + w.name + '“ steht jetzt in „' + kurz(f ? f.titel : '', 30) + '“, neben mir.')) + '</p>' +
          '<div class="c6wz-wahl"><button type="button" class="c6wz-knopf c6wz-haupt" data-w="hin">Hingehen</button><button type="button" class="c6wz-link" data-w="tele">Ins Teleskop hängen</button></div>';
        male(el.querySelector('.c6wz-mini'), w, { klein: true });
        el.querySelector('[data-w=hin]').onclick = function () { zu(); if (C6.space && C6.space.oeffne) C6.space.oeffne(s); };
        var tb = el.querySelector('[data-w=tele]');
        tb.onclick = function () { teilen(w.id, true); tb.disabled = true; tb.textContent = stimme('geteilt', null, 'Hängt im Teleskop. Andere dürfen es sich nehmen.'); };
    }
  }
  function gross(id) {
    var w = hol(id); if (!w) return;
    var el = blattAuf('Werkzeug');
    el.innerHTML = '<div class="c6wz-gross-platz"></div><div class="c6wz-wahl"><button type="button" class="c6wz-knopf" data-w="anders">Anders</button>' + ((w.fassungen || []).length ? '<button type="button" class="c6wz-link" data-w="alt">Zurück zur alten Fassung</button>' : '') + ((w.spaeter || []).length ? '<button type="button" class="c6wz-link" data-w="neuer">Wieder die neuere</button>' : '') + '<button type="button" class="c6wz-link" data-w="tele">' + (w.teleskop ? 'Aus dem Teleskop nehmen' : 'Ins Teleskop hängen') + '</button><button type="button" class="c6wz-link" data-w="weg">Wegräumen</button></div>';
    male(el.querySelector('.c6wz-gross-platz'), w, { rueckblick: true });
    el.querySelector('[data-w=anders]').onclick = function () { umbauen(w); };
    var altK = el.querySelector('[data-w=alt]'); if (altK) altK.onclick = function () { if (zurueckZurAlten(id)) gross(id); };
    var neuK2 = el.querySelector('[data-w=neuer]'); if (neuK2) neuK2.onclick = function () { if (wiederNeuer(id)) gross(id); };
    el.querySelector('[data-w=tele]').onclick = function () { teilen(w.id, !w.teleskop); gross(id); };
    el.querySelector('[data-w=weg]').onclick = function () {
      entferne(id); zu();
      var rw = { text: 'Weggeräumt. Deine Einträge bleiben.', knopf: 'Zurückholen', tun: function () { zurueckholen(id); } };
      if (C6.freigabe) { try { C6.freigabe({ was: 'Wegräumen', umkehrbar: true, rueckweg: rw }); return; } catch (e) {} }
      Promise.resolve(C6.frag ? C6.frag(rw.text, [{ text: rw.knopf, wert: 'z' }], { frei: false, leise: true, id: 'c6wz-weg' }) : null).then(function (a) { if (a === 'z') zurueckholen(id); });
    };
  }

  /* ---------- Fassungen: jede Änderung erst nach „Passt“, die Vorfassung bleibt ---------- */
  function abbild(w) { return { name: w.name, zeichen: w.zeichen, farbe: w.farbe, satz: w.satz, teile: JSON.parse(JSON.stringify(w.teile || [])), ts: Date.now() }; }
  function fassungMerken(w) {
    // alten Bausteinen ohne Schlüssel einmal ihren bisherigen geben, damit ihre Einträge an ihnen hängen bleiben
    (w.teile || []).forEach(function (t, i) { if (!t.k) t.k = 't' + i; });
    w.fassungen = (w.fassungen || []).concat([abbild(w)]).slice(-10);
  }
  function zurueckZurAlten(id) {
    var w = hol(id); if (!w || !(w.fassungen || []).length) return false;
    var vor = w.fassungen.pop(), jetzt = abbild(w);
    w.name = vor.name; w.zeichen = vor.zeichen; w.farbe = vor.farbe; w.satz = vor.satz; w.teile = vor.teile;
    w.spaeter = (w.spaeter || []).concat([jetzt]).slice(-10); // die verlassene Fassung bleibt auch erreichbar
    pruefeEintraege(w); merken(); bus('benutzt', { id: w.id, sid: w.sid });
    return true;
  }
  function wiederNeuer(id) {
    var w = hol(id); if (!w || !(w.spaeter || []).length) return false;
    var n = w.spaeter.pop();
    w.fassungen = (w.fassungen || []).concat([abbild(w)]).slice(-10);
    w.name = n.name; w.zeichen = n.zeichen; w.farbe = n.farbe; w.satz = n.satz; w.teile = n.teile;
    pruefeEintraege(w); merken(); bus('benutzt', { id: w.id, sid: w.sid });
    return true;
  }
  // Regel: Einträge gehen nie verloren. Jeder Datenschlüssel gehört zur aktuellen Fassung oder zu einer aufbewahrten.
  function pruefeEintraege(w) {
    var d = S().daten[w.id] || {}, bekannt = {};
    [w].concat(w.fassungen || [], w.spaeter || []).forEach(function (f) { (f.teile || []).forEach(function (t, i) { bekannt[schl(t, i)] = 1; }); });
    var waisen = Object.keys(d).filter(function (k) { return !bekannt[k] && d[k] && Object.keys(d[k]).length; });
    if (waisen.length) {
      // nicht löschen, sondern als eigene Fassung aufheben, damit sie zurückgeholt werden können
      w.fassungen = (w.fassungen || []).concat([{ name: w.name + ' (aufbewahrt)', zeichen: w.zeichen, farbe: w.farbe, satz: w.satz, teile: waisen.map(function (k) { return { t: 'notiz', text: 'Aufbewahrte Einträge', k: k }; }), ts: Date.now() }]);
    }
    return waisen.length === 0;
  }
  function eintraegeZaehlen(w) {
    var d = S().daten[(w && w.id) || w] || {}, n = 0;
    Object.keys(d).forEach(function (k) { var x = d[k] || {}; n += Object.keys(x.tage || {}).length + Object.keys(x.log || {}).length + Object.keys(x.erl || {}).length + (x.a || []).length + (x.t ? 1 : 0) + (x.punkte || []).length; });
    return n;
  }

  // Das Fach „Weggeräumt“ (in der Werkstatt): zurückholen oder – endgültig – für immer löschen
  function fachOeffnen() {
    var l = weggeraeumt(); var el = blattAuf('Weggeräumt');
    if (!l.length) { el.innerHTML = '<p class="c6wz-satz">Hier liegt nichts.</p>'; return; }
    el.innerHTML = '<p class="c6wz-leise">Deine Einträge sind noch da.</p><ul class="c6wz-fach">' + l.map(function (w) { return '<li><span class="c6wz-zeichen">' + zeichen(w.zeichen, w.farbe) + '</span><b>' + esc(w.name) + '</b><button type="button" class="c6wz-knopf" data-z="' + esc(w.id) + '">Zurückholen</button><button type="button" class="c6wz-link" data-f="' + esc(w.id) + '">Für immer löschen</button></li>'; }).join('') + '</ul>';
    [].forEach.call(el.querySelectorAll('[data-z]'), function (b) { b.onclick = function () { zurueckholen(b.dataset.z); fachOeffnen(); }; });
    [].forEach.call(el.querySelectorAll('[data-f]'), function (b) { b.onclick = function () { fuerImmer(b.dataset.f).then(function (ok) { if (ok) fachOeffnen(); }); }; });
  }
  // „Anders“ jederzeit: Otto sagt, was anders sein soll; Name, Ort und alles Eingetragene bleiben, wo die Teile gleich sind
  function umbauen(w) {
    var el = blatt && blatt.querySelector('.c6wz-inhalt'); if (!el) return;
    var andersT = stimme('anders', null, 'Was soll anders sein?'), nr = ++sitzung;
    function los(a) {
      if (!blatt || nr !== sitzung) return;
      el.innerHTML = '<h3 class="c6wz-titel">„' + esc(kurz(a, 90)) + '“</h3><p class="c6wz-baut" aria-live="polite">' + esc(stimme('baut', null, 'Ich bau es dir …')) + '</p>';
      baue((w.satz || w.name) + '. Anders: ' + a).then(function (sp) {
        if (!blatt || nr !== sitzung || !sp) return;
        // ohne Mitdenken: der Wunsch wird ein Baustein dazu (gleiche Art ersetzt), der Rest bleibt
        if (sp.von === 'vorlage') {
          var neuT = ausVorlage(a).teile[0], teile = (w.teile || []).slice(), j = -1;
          teile.forEach(function (u, i) { if (u.t === neuT.t) j = i; });
          var dazu = /\b(auch|dazu|zusätzlich|außerdem|noch)\b/i.test(a), nm = w.name;
          if (j >= 0 && !dazu && !(neuT.t === 'wert' && teile[j].einheit && neuT.einheit !== teile[j].einheit)) teile[j] = neuT;
          else { teile.push(neuT); var zus = neuT.einheit ? ({ km: 'Kilometer', kg: 'Kilo', h: 'Stunden', min: 'Minuten', l: 'Liter', m: 'Meter', cm: 'Zentimeter' })[neuT.einheit] || neuT.einheit : nameAus(a, ''); if (zus && nm.indexOf(zus) < 0) nm = kurz(nm.replace(/\?$/, '') + ' und ' + zus, 28); }
          var WORT = { km: 'Kilometer', kg: 'Kilo', h: 'Stunden', min: 'Minuten', l: 'Liter', m: 'Meter', cm: 'Zentimeter' };
          var wt = teile.slice(-3).filter(function (x) { return x.t === 'wert' && x.einheit; });
          if (wt.length >= 2) nm = kurz(wt.map(function (x) { return WORT[x.einheit] || x.einheit; }).join(' und '), 28);
          sp = Object.assign({}, sp, { name: nm, zeichen: w.zeichen, farbe: w.farbe, teile: teile.slice(-3), satz: w.satz });
        }
        // gleiche Art behält den Schlüssel des alten Bausteins und damit alle Einträge; neue bekommen einen eigenen
        var alt = S().daten[w.id] || {}, vergeben = {};
        sp.teile = sp.teile.map(function (t) {
          var n = Object.assign({}, t), j = -1;
          (w.teile || []).forEach(function (u, jj) { if (j < 0 && u.t === t.t && !vergeben[jj]) j = jj; });
          if (j >= 0) { vergeben[j] = 1; n.k = schl(w.teile[j], j); } else n.k = neuK();
          return n;
        });
        var neu = {}; Object.keys(alt).forEach(function (k) { neu[k] = alt[k]; });
        var probe = Object.assign({}, sp, { _daten: JSON.parse(JSON.stringify(neu)) });
        el.innerHTML = '<div class="c6wz-vorschau"></div><div class="c6wz-wahl"><button type="button" class="c6wz-knopf c6wz-haupt" data-w="passt">Passt</button><button type="button" class="c6wz-link" data-w="zurueck">Lieber wie vorher</button></div>';
        male(el.querySelector('.c6wz-vorschau'), probe);
        el.querySelector('[data-w=passt]').onclick = function () {
          var x = hol(w.id); if (!x) return;
          fassungMerken(x); if (x.spaeter && x.spaeter.length) { x.fassungen = x.fassungen.concat(x.spaeter).slice(-10); x.spaeter = []; }
          // Einträge der alten Bausteine bleiben im Werkzeug liegen (nie gelöscht), dazu was in der Vorschau probiert wurde
          var d = S().daten[w.id] || (S().daten[w.id] = {}), pd = probe._daten || {};
          Object.keys(pd).forEach(function (k) { d[k] = pd[k]; });
          x.name = sp.name || w.name; x.zeichen = sp.zeichen; x.farbe = sp.farbe; x.teile = sp.teile; x.satz = sp.satz;
          pruefeEintraege(x); merken(); bus('benutzt', { id: w.id, sid: w.sid }); gross(w.id);
        };
        el.querySelector('[data-w=zurueck]').onclick = function () { gross(w.id); };
      });
    }
    if (feldLeihen(andersT, los)) { var wa = el.querySelector('.c6wz-wahl'); if (wa) wa.outerHTML = '<p class="c6wz-leise c6wz-unten">' + esc(andersT) + ' Schreib es unten ins Feld.</p>'; return; }
    var wb = el.querySelector('.c6wz-wahl');
    wb.outerHTML = '<form class="c6wz-wunsch c6wz-anders"><input type="text" maxlength="200" placeholder="' + esc(andersT) + '" aria-label="' + esc(andersT) + '"><button type="submit" class="c6wz-knopf c6wz-haupt">Neu bauen</button></form>';
    var af = el.querySelector('.c6wz-anders'), ai = af.querySelector('input'); ai.focus();
    af.onsubmit = function (e) { e.preventDefault(); var a = ai.value.trim(); if (a) los(a); };
  }

  C6.werkzeug = {
    baue: baue, male: male, alle: alle, hol: hol, haenge: haenge, entferne: entferne, zeichen: zeichen,
    vorlagen: VORLAGEN, oeffne: oeffne, gross: gross, zu: zu, erinnerungen: erinnerungen,
    zurueckholen: zurueckholen, weggeraeumt: weggeraeumt, fuerImmer: fuerImmer,
    fach: function () { fachOeffnen(); },
    fassungen: function (id) { var w = hol(id); return w ? (w.fassungen || []).slice() : []; }, zurueck: zurueckZurAlten,
    pruefe: function (id) { var w = hol(id); return w ? pruefeEintraege(w) : true; }, eintraege: eintraegeZaehlen,
    teilen: teilen, geteilt: function () { return alle().filter(function (w) { return w.teleskop; }); },
    get offen() { return !!blatt; }
  };
})();
