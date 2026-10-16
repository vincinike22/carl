// Lesesaal: hinter der Geheimtür. In der Mitte der Tisch der Funde, an der Seite das Regal deiner Meister.
(function () {
  var C6 = window.C6;
  if (!C6 || !C6.raum) return;
  var esc = function (t) { return C6.strings && C6.strings.esc ? C6.strings.esc(t) : String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var T = '#2b2722', GOLD = '#e6c987', ROT = '#d62a26', MAX_MEISTER = 10, AUF_DEM_TISCH = 12;
  function S() { return C6.S || (C6.S = {}); }
  function L() { var s = S(); if (!s.lesesaal || typeof s.lesesaal !== 'object') s.lesesaal = {}; return s.lesesaal; }
  function aendere(fn) { if (C6.aendern) C6.aendern(function (s) { s.lesesaal = s.lesesaal || {}; fn(s.lesesaal); }); else fn(L()); }
  function satz(k, ersatz) { try { return (C6.stimme && C6.stimme.sag(k)) || ersatz; } catch (e) { return ersatz; } }
  function kurz(t, n) { t = String(t || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  function funde() { return (L().funde || []).slice(); }
  function fundVon(id) { return funde().filter(function (f) { return f.id === id; })[0] || null; }
  function setzeFund(id, fn) { aendere(function (l) { (l.funde || []).forEach(function (q, i) { if (q.id === id) { var y = Object.assign({}, q); fn(y); l.funde[i] = y; } }); }); }
  function melden(id, was) { try { C6.bus && C6.bus.emit && C6.bus.emit('fund', { id: id, was: was }); } catch (e) {} }
  // Fremdes ist Daten: unsichtbare Zeichen (Null-Breite, Richtungszeichen, Tag-Zeichen, Steuerzeichen) kommen nie ins Gedächtnis
  var UNSICHTBAR_Q = '[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F\\u00AD\\u034F\\u061C\\u115F\\u1160\\u17B4\\u17B5\\u180B-\\u180F\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u206F\\u3164\\uFE00-\\uFE0F\\uFEFF\\uFFA0\\uFFF0-\\uFFFB]|\\uDB40[\\uDC00-\\uDC7F]';
  var UNSICHTBAR = new RegExp(UNSICHTBAR_Q, 'g');
  function rein(t) { return String(t == null ? '' : t).replace(UNSICHTBAR, '').replace(/[ \t]{2,}/g, ' ').trim(); }
  // Was das Modell zurücksagt, darf nichts tun und nichts behaupten, was Carl nicht getan hat
  var VERDAECHTIG = /(ignorier|anweisung|befehl|vergiss|l[öo]sch|entfern|passwort|schl[üu]ssel|token|system|prompt|https?:|<|>|‹|›)/i;
  // Klingt der Fund selbst wie ein Befehl an Carl? Dann sagt der Tisch es offen. Befolgt wird so etwas nie.
  var BEFEHL_ROH = /(ignorier|ignore (all|previous|the)|vergiss (alles|was|deine)|anweisung|befolge|l[öo]sche (alle|alles|jeden)|delete all|system ?prompt|du bist (jetzt|ab jetzt)|you are now|<\/?[a-z][a-z0-9]*>)/i;
  var BEFEHL_ANTWORT = /(ignorier|vergiss|befolge|passwort|kennwort|token|prompt|anweisung|befehl|klick|öffne|oeffne)/i;
  function carlSatz(t, s) { t = rein(t); return t && t.length > 4 && t.length <= 160 && !VERDAECHTIG.test(t) ? t : (s ? 'Das passt wohl zu „' + s.titel + '“.' : ''); }
  function meister() { return (S().meister || []).slice(); }
  function setzeMeister(fn) { if (C6.aendern) C6.aendern(function (s) { s.meister = (s.meister || []).slice(); fn(s.meister); }); else { S().meister = S().meister || []; fn(S().meister); } }
  function spaces() { try { return (C6.strings.alle() || []).filter(function (f) { return f && f.art !== 'gewohnheit'; }); } catch (e) { return []; } }
  function spaceVon(sid) { return sid ? spaces().filter(function (f) { return f.id === sid; })[0] || null : null; }
  function zuletzt() { var sp = S().spaces || {}; return spaces().slice().sort(function (x, y) { return ((sp[y.id] || {}).besucht || y.erstellt || 0) - ((sp[x.id] || {}).besucht || x.erstellt || 0); }); }
  function ytId(u) { var m = String(u || '').match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/i); return m ? m[1] : null; }
  function hostVon(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  function groesseText(b) { return b > 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function woerter(t) { return String(t || '').toLowerCase().split(/[^a-zäöüß0-9]+/).filter(function (w) { return w.length > 3; }); }
  var STOPP = ' nicht diese dieser dieses einen einem einer eines haben werden wurde wurden sind auch oder aber wenn dann noch schon mehr sehr über unter nach durch gegen zwischen immer heute morgen https http html sein seine seiner ihre ihren ihrem kann können muss müssen soll sollte damit dass weil jetzt ganz etwas alles wird hatte habe hast hier dort wieder einmal welche welcher welches ohne beim vom zum zur eine einer euch mich mein meine deine dein unsere ';
  function stichwoerter(t) { var s = {}; woerter(t).forEach(function (w) { if (w.length > 4 && STOPP.indexOf(' ' + w + ' ') < 0 && !/^\d+$/.test(w)) s[w] = 1; }); return Object.keys(s); }
  function ini(m) { return String(m.name || '?').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }
  function hashVon(t) { var h = 7; t = String(t || ''); for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return h; }
  function datum(ts) { try { if (C6.strings && C6.strings.datum) return C6.strings.datum(ts); } catch (e) {} var d = new Date(ts); return d.getDate() + '.' + (d.getMonth() + 1) + '.'; }
  function uhr(ts) { var d = new Date(ts); return d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }
  function wann(ts) { var d = new Date(ts), h = new Date(); return (d.toDateString() === h.toDateString() ? 'heute' : datum(ts)) + ', ' + uhr(ts); }
  function zahlText(n) { if (!isFinite(n)) return ''; var r = Math.round(n * 100) / 100, s = String(Math.abs(r)).split('.'), g = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return (r < 0 ? '−' : '') + g + (s[1] ? ',' + s[1] : ''); }
  // Kern-Helfer, defensiv: der Saal läuft auch ohne sie
  function tageszeit() { try { if (typeof C6.tageszeit === 'function') return C6.tageszeit() || 'nacht'; } catch (e) {} var h = new Date().getHours(); return h >= 6 && h < 11 ? 'morgen' : h >= 11 && h < 17 ? 'mittag' : h >= 17 && h < 21 ? 'abend' : 'nacht'; }
  var staunenLokal = {};
  function staunText(id, t) { try { if (C6.staunen && C6.staunen.text) { C6.staunen.text(id, t); return; } } catch (e) {} staunenLokal[id] = t; }
  function staune(id) { try { if (C6.staunen && C6.staunen.sag) return C6.staunen.sag(id); } catch (e) {} if (staunenLokal[id] && C6.sag) { var t = staunenLokal[id]; staunenLokal[id] = null; C6.sag(t, { merken: false }); } }
  function halten(el, fn) { try { if (typeof C6.halten === 'function') return C6.halten(el, fn); } catch (e) {} return function () {}; }
  function ruhig() { return !!C6.ruhig; }
  function denk(text, daten) {
    var p;
    try { p = typeof C6.denk === 'function' ? C6.denk(text, { stumm: true, name: 'lesesaal', daten: daten || [] }) : Promise.resolve(''); } catch (e) { p = Promise.resolve(''); }
    return Promise.resolve(p).then(function (x) { return typeof x === 'string' ? x.trim() : ''; }, function () { return ''; });
  }

  // ——— Was Otto schickt, wird ein Fund: Link, Text oder Zahlenreihe ———
  function zahl(s) {
    s = String(s).replace(/['’]/g, '');
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');
    else s = s.replace(',', '.');
    var n = parseFloat(s); return isFinite(n) ? n : null;
  }
  // Nur, wenn der Text wirklich vor allem aus Zahlen besteht. Jahreszahlen zwischen den Werten werden Beschriftung, nie Wert.
  function zahlenAus(t) {
    var roh = String(t || '').match(/-?\d[\d.,'’]*\d|-?\d/g);
    if (!roh || roh.length < 3) return null;
    var ziffern = roh.join('').length, sonst = String(t).replace(/\s/g, '').length || 1;
    var worte = (String(t).replace(/-?\d[\d.,'’]*\d|-?\d/g, ' ').match(/[a-zäöüß]{2,}/gi) || []).length;
    if (!(ziffern / sonst >= 0.45 || roh.length >= worte * 1.5)) return null;
    var w = roh.map(zahl).filter(function (n) { return n != null; });
    var jahre = w.filter(function (n) { return n === Math.round(n) && n >= 1900 && n <= 2100; });
    var marken = null;
    if (jahre.length >= 2 && Math.abs(jahre.length * 2 - w.length) <= 1 && jahre.length < w.length) {
      var werte = [], m = [];
      for (var i = 0; i < w.length; i++) { var j = w[i] === Math.round(w[i]) && w[i] >= 1900 && w[i] <= 2100; if (j && i + 1 < w.length) { m.push(String(w[i])); werte.push(w[i + 1]); i++; } }
      if (werte.length >= 3) { w = werte; marken = m; }
    }
    if (w.length < 3) return null;
    return { werte: w.slice(0, 400), marken: marken ? marken.slice(0, 400) : null };
  }
  // Titel aus Ottos Zeile: bis zum ersten Satzende, Komma oder Gedankenstrich (nicht bei „vs.“, „z. B.“, „ca.“), nie mitten im Wort
  var ABK = /\b(vs|bzw|ca|z|b|u|a|d|h|usw|etc|evtl|ggf|inkl|Nr|Dr|St|Hr|Fr|vgl|bspw)\.$/i;
  function ersterSatz(t, n) {
    n = n || 60; var z = String(t || '').split(/\n/)[0].trim(), cut = -1;
    for (var i = 0; i < z.length; i++) {
      if (cut >= 0) break;
      var c = z[i];
      if ((c === '.' || c === '!' || c === '?') && !ABK.test(z.slice(0, i + 1)) && !/\d/.test(z[i + 1] || '')) { cut = i + (c === '.' ? 0 : 1); break; }
      // ein zu kurzer erster Teil („Das will ich lesen,“) nimmt den nächsten mit
      if ((c === ',' || c === ';' || c === ':' || c === '–' || c === '—' || (c === '-' && z[i - 1] === ' ' && z[i + 1] === ' ')) && i >= 22) { cut = i; break; }
    }
    var tt = (cut > 0 ? z.slice(0, cut) : z).trim();
    if (tt.length < 4) tt = z;
    if (tt.length > n) { tt = tt.slice(0, n); var l = tt.lastIndexOf(' '); if (l > n * 0.5) tt = tt.slice(0, l); tt = tt.replace(/[\s,;:–-]+$/, '') + '…'; }
    return tt;
  }
  function fundAnlegen(text, o) {
    o = o || {};
    var roh = String(text == null ? '' : text), t = rein(roh).replace(/\r\n?/g, '\n');
    if (t.replace(/\s/g, '').length < 3) return null;
    if (t.length > 6000) t = t.slice(0, 6000);
    var f = { id: 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ts: Date.now(), quelle: kurz(rein(o.quelle || 'feld'), 30) };
    f.unsichtbar = UNSICHTBAR.test(roh); UNSICHTBAR.lastIndex = 0;
    f.seltsam = BEFEHL_ROH.test(t);
    if (o.sid && spaceVon(o.sid)) f.hier = o.sid;
    var m = t.match(/https?:\/\/[^\s<>"'„“”«»]+/i);
    var titel = o.titel ? kurz(rein(o.titel), 90) : '';
    // ein Satz mit Link ist ein Link-Fund; ein langer Text, in dem auch ein Link steht, bleibt ein Text (der Link wird gemerkt)
    var mLang = m && t.replace(m[0], ' ').replace(/\s{2,}/g, ' ').trim().length > 220;
    if (mLang) f.url = m[0].replace(/[.,;:!?)\]»]+$/, '');
    if (m && !mLang) {
      var url = m[0].replace(/[.,;:!?)\]»]+$/, ''), worte = t.replace(m[0], ' ').replace(/\s{2,}/g, ' ').trim(), host = hostVon(url);
      f.art = ytId(url) ? 'youtube' : 'link'; f.url = url; f.text = worte;
      var zl = zahlenAus(worte); if (zl) { f.zahlen = zl.werte; if (zl.marken) f.marken = zl.marken; }
      f.titel = titel || (worte.length >= 4 ? ersterSatz(worte, 80) : (f.art === 'youtube' ? 'Video auf YouTube' : host + kurz(url.replace(/^https?:\/\/[^/]+/, ''), 36)));
    } else {
      var z = zahlenAus(t);
      if (z) {
        f.art = 'zahlen'; f.zahlen = z.werte; if (z.marken) f.marken = z.marken; f.text = t;
        var w = t.replace(/-?\d[\d.,'’]*\d|-?\d/g, ' ').replace(/[;:|·•,\/\-–]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
        f.titel = titel || (w.length >= 3 ? kurz(w, 60) : 'Zahlenreihe');
      } else { f.art = 'text'; f.text = t; f.titel = titel || ersterSatz(t, 80); }
    }
    aendere(function (l) { l.funde = (l.funde || []).concat([f]).slice(-200); });
    melden(f.id, 'neu');
    zusammenfassen(f.id);
    return f;
  }
  // Ehrlich ohne Mitdenken: nur, was sich zählen und ablesen lässt
  function bleistift(f, verworfen) {
    if (f.zahlen && f.zahlen.length >= 2 && (f.art === 'zahlen' || f.url)) {
      var w = f.zahlen, mx = Math.max.apply(null, w), mn = Math.min.apply(null, w), a = w[0], b = w[w.length - 1];
      return (f.url ? 'Die Seite selbst kann ich nicht öffnen. In deinem Satz stehen ' : '') + w.length + ' Zahlen, von ' + zahlText(a) + ' bis ' + zahlText(b) + '. Die höchste ist ' + zahlText(mx) + ', die tiefste ' + zahlText(mn) + '. ' + (b > a ? 'Am Ende höher als am Anfang.' : b < a ? 'Am Ende tiefer als am Anfang.' : 'Am Ende gleich wie am Anfang.');
    }
    if (f.art === 'link' || f.art === 'youtube') {
      var h = hostVon(f.url);
      return 'Die Seite selbst kann ich nicht öffnen. Gemerkt hab ich die Adresse' + (h ? ' (' + h + ')' : '') + ((f.text || f.notiz) ? ' und deine Worte dazu.' : '.');
    }
    if (f.art === 'pdf' || f.art === 'bild' || f.art === 'datei') return 'Lesen kann ich die Datei nicht. Ich kenne ihren Namen' + (f.notiz ? ' und deine Notiz.' : '.');
    var tx = String(f.text || ''), n = (tx.match(/\S+/g) || []).length;
    return (verworfen ? 'Hier fasse ich lieber nicht zusammen. ' : 'Zusammenfassen kann ich hier nicht. ') + n + (n === 1 ? ' Wort' : ' Wörter') + ', es beginnt mit „' + kurz((tx.match(/\S+/g) || []).slice(0, 8).join(' '), 70) + '“.';
  }
  function material(f) {
    if (f.art === 'link' || f.art === 'youtube') return 'Adresse: ' + (f.url || '') + '\nWorte des Menschen dazu: ' + ((f.text || f.notiz) || '(keine)');
    if (f.art === 'pdf' || f.art === 'bild' || f.art === 'datei') return 'Datei: ' + ((f.datei || {}).name || '') + '\nNotiz des Menschen: ' + (f.notiz || '(keine)');
    return f.text || '';
  }
  function datenVon(f) {
    var t = material(f);
    if (f.urteil === 'stimmtNicht') t += '\n\nDer Mensch sagt zu deiner Zusammenfassung: stimmt so nicht' + (f.korrektur ? ' – ' + f.korrektur : '') + '.';
    else if (f.urteil === 'stimmt' && f.zus) t += '\n\nZusammenfassung, vom Menschen bestätigt: ' + f.zus;
    return { art: 'fund', titel: f.titel, quelle: f.url || (f.datei && f.datei.name) || f.quelle || '', text: t };
  }
  // Zahlen in Carls Sätzen müssen im Fund stehen, sonst fällt der Satz weg
  function zahlenIn(t) { return (String(t || '').match(/\d[\d.,]*\d|\d/g) || []).map(function (z) { return zahl(z); }).filter(function (n) { return n != null; }); }
  function zusRein(antwort, f, ids) {
    var zeilen = String(antwort || '').split(/\n+/), vor = [];
    var sl = zeilen.filter(function (z) { return /^\s*spaces?\s*:/i.test(z); })[0];
    if (sl) sl.split(':').slice(1).join(':').split(/[,;\s]+/).forEach(function (x) { x = x.replace(/[^\w-]/g, ''); if (ids.indexOf(x) >= 0 && vor.indexOf(x) < 0 && vor.length < 2) vor.push(x); });
    var t = zeilen.filter(function (z) { return z !== sl && z.indexOf('|') < 0; }).join(' ');
    t = rein(t).replace(/https?:\/\/\S+|www\.\S+/gi, ' \u0001 ');
    try { if (typeof C6.ehrlich === 'function') t = C6.ehrlich(t, true); } catch (e) {}
    var bekannt = zahlenIn(material(f) + ' ' + f.titel).concat(f.zahlen || []);
    var saetze = (t.match(/[^.!?…]+[.!?…]*/g) || []).map(function (z) { return z.replace(/\s+/g, ' ').trim(); }).filter(function (z) {
      if (z.length < 12 || z.indexOf(' ') < 0 || z.indexOf('\u0001') >= 0) return false;
      if (/[<>‹›{}\[\]`]/.test(z) || BEFEHL_ANTWORT.test(z)) return false;
      return zahlenIn(z).every(function (n) { return bekannt.some(function (b) { return Math.abs(b - n) < 1e-9; }); });
    }).slice(0, 3);
    var zus = saetze.join(' ');
    if (zus.length > 420) zus = kurz(zus, 420);
    return { zus: zus, vor: vor };
  }
  var laeuft = {};
  function zusammenfassen(id) {
    var f = fundVon(id); if (!f || laeuft[id]) return Promise.resolve(null);
    laeuft[id] = true;
    var reihe = zuletzt().slice(0, 10), sp = S().spaces || {}, ids = reihe.map(function (s) { return s.id; });
    var frage = 'Fasse den Fund im Material unten für den Menschen zusammen.\n' +
      (f.art === 'link' || f.art === 'youtube' ? 'Du kannst die Seite nicht öffnen. Du kennst nur die Adresse und die Worte des Menschen; sag in einem Satz, was ihm daran wichtig scheint, nur aus seinen Worten.\n' : '') +
      (f.zahlen ? 'Darin steht eine Zahlenreihe. Beschreib nur, was sich aus genau diesen Zahlen ablesen lässt (Anfang, Ende, höchste, tiefste, Richtung). Keine Vorhersage, kein Rat.\n' : '') +
      (f.art === 'pdf' || f.art === 'bild' || f.art === 'datei' ? 'Du kannst die Datei nicht lesen, nur Name und Notiz.\n' : '') +
      'Höchstens drei kurze Sätze auf Deutsch, in deinen eigenen Worten. Nichts erfinden, keine Zahlen, die nicht im Material stehen, keine Adressen.\n' +
      (ids.length ? 'Dann eine letzte Zeile, genau so: „Spaces: “ und die Kennungen der Spaces aus dieser Liste, zu denen der Fund passt (höchstens zwei, mit Komma), oder „Spaces: keiner“. Liste: ' +
        reihe.map(function (s) { return s.id + ' = „' + s.titel + '“' + ((sp[s.id] || {}).kern ? ' (Kernsatz: ' + sp[s.id].kern + ')' : ''); }).join('; ') + '.' : '');
    melden(id, 'liest');
    return denk(frage, [datenVon(f)]).then(function (antwort) {
      var r = antwort ? zusRein(antwort, f, ids) : { zus: '', vor: [] };
      var vor = r.vor.slice();
      // ohne Vorschlag des Mitdenkens: nach gleichen Wörtern, dazu der Space, in dem Otto gerade war
      if (!vor.length) {
        var w = stichwoerter(f.titel + ' ' + String(f.text || '').replace(/https?:\/\/\S+/g, ' ') + ' ' + (f.notiz || '')), best = null, bs = 0;
        reihe.forEach(function (s) { var n = 0; stichwoerter(s.titel + ' ' + ((sp[s.id] || {}).kern || '')).forEach(function (q) { if (w.indexOf(q) >= 0) n++; }); if (n > bs) { bs = n; best = s; } });
        if (best) vor.push(best.id);
      }
      if (f.hier && vor.indexOf(f.hier) < 0) vor.unshift(f.hier);
      setzeFund(id, function (q) {
        q.vor = vor.slice(0, 2);
        if (r.zus) { q.zus = r.zus; q.zusWie = 'denk'; q.zusNotiz = null; }
        else { q.zus = bleistift(q, !!antwort); q.zusWie = 'bleistift'; q.zusNotiz = antwort ? 'Meine Zusammenfassung hab ich weggelassen. Sie hielt sich nicht an das, was dasteht.' : null; }
        q.zusTs = Date.now();
      });
      laeuft[id] = false; melden(id, 'zus');
      return fundVon(id);
    }, function () { laeuft[id] = false; return null; });
  }
  // Verwandt sind Funde mit gleichen Wörtern, derselben Seite oder demselben Space – gezählt, nicht geraten
  function verwandt(f, alle) {
    // nur Ottos eigene Wörter (Titel, Text, Notiz), nie Carls Etiketten wie „Adresse“ oder „Worte des Menschen“
    function seine(x) { return stichwoerter(x.titel + ' ' + String(x.text || '').replace(/https?:\/\/\S+/g, ' ') + ' ' + (x.notiz || '')); }
    var a = seine(f), h = hostVon(f.url), raus = [];
    (alle || funde()).forEach(function (g) {
      if (g.id === f.id) return;
      var b = seine(g), gleich = a.filter(function (w) { return b.indexOf(w) >= 0; });
      if (gleich.length >= 2) raus.push({ id: g.id, grund: 'gleiche Wörter: ' + gleich.slice(0, 3).join(', ') });
      else if (h && h === hostVon(g.url)) raus.push({ id: g.id, grund: 'dieselbe Seite' });
      else if (f.sid && f.sid === g.sid && spaceVon(f.sid)) raus.push({ id: g.id, grund: 'beide in „' + spaceVon(f.sid).titel + '“' });
    });
    return raus.slice(0, 3);
  }
  // Ein kleiner gezeichneter Verlauf, nur aus Ottos Zahlen
  function verlaufSVG(werte, W, H, gross) {
    if (!werte || werte.length < 2) return '';
    var mx = Math.max.apply(null, werte), mn = Math.min.apply(null, werte), px = gross ? 14 : 3, py = gross ? 16 : 3, sp = mx - mn || 1;
    var pts = werte.map(function (v, i) { return [px + (W - 2 * px) * i / (werte.length - 1), mx === mn ? H / 2 : py + (H - 2 * py) * (1 - (v - mn) / sp)]; });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var flaeche = d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (H - 1) + ' L' + pts[0][0].toFixed(1) + ' ' + (H - 1) + ' Z';
    var iMx = werte.indexOf(mx), iMn = werte.indexOf(mn), o = '';
    o += '<svg class="c6w-ls-verlauf-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Verlauf aus ' + werte.length + ' Zahlen, von ' + zahlText(werte[0]) + ' bis ' + zahlText(werte[werte.length - 1]) + '">';
    if (gross) for (var r = 1; r < 4; r++) o += '<path d="M' + px + ' ' + (py + (H - 2 * py) * r / 4).toFixed(1) + ' H' + (W - px) + '" stroke="#d9ccb2" stroke-width="1" vector-effect="non-scaling-stroke"/>';
    o += '<path d="' + flaeche + '" fill="#e2b768" opacity="' + (gross ? '.28' : '.35') + '"/>';
    o += '<path d="' + d + '" fill="none" stroke="#5a2e17" stroke-width="' + (gross ? 2.4 : 1.6) + '" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>';
    if (gross) {
      o += '<circle cx="' + pts[iMx][0].toFixed(1) + '" cy="' + pts[iMx][1].toFixed(1) + '" r="3.5" fill="#2c6a4f"/><circle cx="' + pts[iMn][0].toFixed(1) + '" cy="' + pts[iMn][1].toFixed(1) + '" r="3.5" fill="#9a3a1b"/>';
      o += '<circle cx="' + pts[pts.length - 1][0].toFixed(1) + '" cy="' + pts[pts.length - 1][1].toFixed(1) + '" r="4.5" fill="#fbf5e8" stroke="#5a2e17" stroke-width="2"/>';
    }
    return o + '</svg>';
  }

  var DEFS = '<defs>' +
    '<linearGradient id="c6w-ls-wand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a1f"/><stop offset=".45" stop-color="#5a4130"/><stop offset="1" stop-color="#6b4d36"/></linearGradient>' +
    '<linearGradient id="c6w-ls-boden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3222"/><stop offset=".55" stop-color="#3f2b1d"/><stop offset="1" stop-color="#4a3222"/></linearGradient>' +
    '<linearGradient id="c6w-ls-brett" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6442"/><stop offset="1" stop-color="#5a3d29"/></linearGradient>' +
    '<linearGradient id="c6w-ls-fach" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f150f"/><stop offset="1" stop-color="#3a281c"/></linearGradient>' +
    '<linearGradient id="c6m-ls-eigenL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0a12" stop-opacity=".42"/><stop offset="1" stop-color="#0d0a12" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="c6m-ls-eigenR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#0d0a12" stop-opacity=".42"/><stop offset="1" stop-color="#0d0a12" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="c6w-ls-licht" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9b5" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b5" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6w-ls-nacht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1430"/><stop offset=".6" stop-color="#231c33"/><stop offset="1" stop-color="#3a2a26"/></linearGradient>' +
    '<linearGradient id="c6w-ls-dunkel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0a12" stop-opacity=".95"/><stop offset=".5" stop-color="#0d0a12" stop-opacity=".35"/><stop offset="1" stop-color="#0d0a12" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="c6w-ls-schacht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c8" stop-opacity=".55"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="c6w-ls-buchglanz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".6"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient>' +
    // Gesichter aus Licht: vier Lichtfamilien, keine Person
    ['#ffe3a1', '#ffcdb8', '#d2e2ff', '#e4f1bd'].map(function (c, i) { return '<radialGradient id="c6w-ls-gesicht' + i + '" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#fffaf0"/><stop offset=".45" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>'; }).join('') +
    '<radialGradient id="c6w-ls-kerzenschein" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".62"/><stop offset=".4" stop-color="#ffb35c" stop-opacity=".3"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="c6w-ls-flammenlicht" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff1c4" stop-opacity=".9"/><stop offset=".5" stop-color="#ffc46a" stop-opacity=".35"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="c6w-ls-flamme" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff9a2e"/><stop offset=".55" stop-color="#ffd86a"/><stop offset="1" stop-color="#fff6d2"/></linearGradient>' +
    '<linearGradient id="c6w-ls-wachs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8dcc0"/><stop offset=".5" stop-color="#fff5de"/><stop offset="1" stop-color="#d9c9a6"/></linearGradient>' +
    '<linearGradient id="c6w-ls-karte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8e4"/><stop offset="1" stop-color="#f0dfb8"/></linearGradient>' +
    '<radialGradient id="c6w-ls-kartenlicht" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient>' +
    // Der Tisch: Nussholz, darauf grünes Tuch mit Messinglinie
    '<linearGradient id="c6w-ls-tholz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e4930"/><stop offset="1" stop-color="#4c3020"/></linearGradient>' +
    '<linearGradient id="c6w-ls-tkante" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6c45"/><stop offset=".35" stop-color="#6b4429"/><stop offset="1" stop-color="#3e2618"/></linearGradient>' +
    '<linearGradient id="c6w-ls-tschuerze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2e1d"/><stop offset="1" stop-color="#2e1c12"/></linearGradient>' +
    '<linearGradient id="c6w-ls-tbein" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2416"/><stop offset=".45" stop-color="#7a5234"/><stop offset="1" stop-color="#2e1c12"/></linearGradient>' +
    '<linearGradient id="c6w-ls-filz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22382d"/><stop offset=".6" stop-color="#2c4a3a"/><stop offset="1" stop-color="#335441"/></linearGradient>' +
    '<radialGradient id="c6w-ls-filzlicht" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd58a" stop-opacity=".42"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient>' +
    '</defs>';
  // Licht je Tageszeit: Himmel durch die Kuppel, der Lichtschacht, wie viele Sterne man sieht
  var ZEIT = {
    morgen: { himmel: ['#2c3366', '#3a2f58', '#473229'], schacht: ['#ffe9cf', 0.5], boden: '#ffe0b5', sterne: 0.45 },
    mittag: { himmel: ['#394a86', '#3d3764', '#4a3630'], schacht: ['#fff7e2', 0.6], boden: '#ffeec8', sterne: 0.25 },
    abend: { himmel: ['#1c1a45', '#2e1e3b', '#3e2a28'], schacht: ['#ffd7a0', 0.5], boden: '#ffd9a0', sterne: 0.72 },
    nacht: { himmel: ['#0f1430', '#231c33', '#3a2a26'], schacht: ['#e3e8ff', 0.36], boden: '#e9e4d0', sterne: 1 }
  };

  function zufall(n) { var x = Math.sin(n * 91.7 + 13.1) * 43758.5; return x - Math.floor(x); }
  // Das eine Licht des Saals: der Lichtschacht aus der Kuppel (Szenen-Koordinaten, in stelle() gesetzt)
  var LICHT = { x: 520, y: 0 };
  function lschatten(cx, b, rx, a) {
    var dx = cx - LICHT.x, l = Math.hypot(dx, b - LICHT.y) || 1, ox = dx / l * Math.min(10, rx * 0.3);
    return '<ellipse cx="' + (cx + ox).toFixed(1) + '" cy="' + (b + 2) + '" rx="' + rx + '" ry="' + Math.max(3, rx * 0.2).toFixed(1) + '" fill="#0d0a12" style="opacity:calc(var(--c6-schatten-a,.2) * ' + (a || 1) + ' * 1.6)" pointer-events="none"/>';
  }
  var LEDER = ['#5c2f27', '#2e3b52', '#4a3a26', '#30473c', '#5b4630', '#3f3346', '#6a4a2a', '#283a35'];
  function wandregal(x, y, w, h, seed, frei) {
    var o = '<g aria-hidden="true"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#4a3122" stroke="' + T + '" stroke-width="2"/>';
    var fh = 96, n = Math.floor((h - 12) / (fh + 10));
    for (var r = 0; r < n; r++) {
      var by = y + 8 + (r + 1) * fh + r * 10;
      o += '<rect x="' + (x + 8) + '" y="' + (by - fh) + '" width="' + (w - 16) + '" height="' + fh + '" fill="url(#c6w-ls-fach)"/>';
      var bx = x + 10, k = 0;
      while (bx < x + w - 22 && k < 160) {
        var bw = 10 + Math.round(zufall(seed + r * 13 + k) * 9), bh = Math.round(fh * (0.62 + zufall(seed * 3 + r + k * 7) * 0.32));
        if (frei && frei.reihe === r && bx + bw > frei.x0 && bx < frei.x1) { bx = frei.x1 + 2; k++; continue; }
        // hier und da ein Buch, das sich anlehnt
        if (zufall(seed * 7 + r * 31 + k) > 0.94 && bx + 40 < x + w - 22) {
          o += '<g transform="rotate(-14 ' + (bx + bw) + ' ' + by + ')"><rect x="' + bx + '" y="' + (by - bh) + '" width="' + bw + '" height="' + bh + '" rx="2" fill="' + LEDER[(k + r) % LEDER.length] + '" stroke="#140d09" stroke-width="1.2"/></g>';
          bx += bw + 14; k++; continue;
        }
        o += '<rect x="' + bx + '" y="' + (by - bh) + '" width="' + bw + '" height="' + bh + '" rx="2" fill="' + LEDER[Math.floor(zufall(seed + k * 5 + r) * LEDER.length)] + '" stroke="#140d09" stroke-width="1.2"/>' +
          '<path d="M' + (bx + 2) + ' ' + (by - bh + 8) + ' H' + (bx + bw - 2) + ' M' + (bx + 2) + ' ' + (by - 8) + ' H' + (bx + bw - 2) + '" stroke="' + GOLD + '" stroke-width="1.2" opacity=".8"/>';
        bx += bw + 1.5; k++;
      }
      o += '<rect x="' + (x + 2) + '" y="' + by + '" width="' + (w - 4) + '" height="10" fill="url(#c6w-ls-brett)" stroke="' + T + '" stroke-width="1.2"/>';
    }
    o += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#' + (x + w / 2 < LICHT.x ? 'c6m-ls-eigenL' : 'c6m-ls-eigenR') + ')" pointer-events="none"/>';
    return o + '</g>';
  }
  function sterne(x, y, w, h, n, seed, funkeln) {
    var o = '', fk = '', f = funkeln == null ? 5 : funkeln;
    for (var i = 0; i < n; i++) (i < f ? (function (t) { fk += t; }) : (function (t) { o += t; }))('<circle' + (i < f ? '' : ' opacity=".7"') + ' cx="' + (x + zufall(seed + i * 3) * w).toFixed(1) + '" cy="' + (y + zufall(seed + i * 7) * h).toFixed(1) + '" r="' + (0.6 + zufall(seed * 2 + i) * 1.6).toFixed(1) + '" fill="#fff6dc"/>');
    return '<g class="c6w-ls-himmel">' + o + (fk ? '<g class="c6w-ls-stern">' + fk + '</g>' : '') + '</g>';
  }
  // Die Kerze: Messingleuchter, Wachs, Flamme. Ein Ding zum Denken (antippen = an/aus). Sie steht auf dem Tisch.
  function kerzeSVG(x, y, an, sk) {
    return '<g class="c6w-ding c6w-ls-kerze' + (an ? ' c6w-ls-brennt' : '') + '" data-id="kerze" role="button" tabindex="0" aria-pressed="' + (an ? 'true' : 'false') + '" aria-label="Die Kerze. Tipp sie an" transform="translate(' + x + ' ' + y + ') scale(' + (sk || 1.15) + ')">' +
      '<ellipse cx="0" cy="2" rx="26" ry="5" fill="#0d0a12" style="opacity:calc(var(--c6-schatten-a,.2) * 1.5)"/>' +
      '<g class="c6w-ding-innen">' +
      '<circle class="c6w-ls-flammenlicht" cx="0" cy="-118" r="150" fill="url(#c6w-ls-flammenlicht)" pointer-events="none"/>' +
      '<path d="M-22 0 Q-22 -8 -8 -10 L-5 -18 H5 L8 -10 Q22 -8 22 0 Z" fill="url(#c6w-ls-messing)" stroke="#5a3d17" stroke-width="1.2"/>' +
      '<rect x="-3.5" y="-56" width="7" height="40" fill="url(#c6w-ls-messing)" stroke="#5a3d17" stroke-width="1"/>' +
      '<path d="M-12 -56 H12 L10 -66 H-10 Z" fill="url(#c6w-ls-messing)" stroke="#5a3d17" stroke-width="1.2"/>' +
      '<rect x="-8" y="-104" width="16" height="40" rx="1.5" fill="url(#c6w-ls-wachs)" stroke="#8a7656" stroke-width="1"/>' +
      '<path d="M-8 -96 q3 6 0 12 M8 -100 q-3 8 0 14" stroke="#fff8e8" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M0 -104 v-5" stroke="#2b2722" stroke-width="1.6" stroke-linecap="round"/>' +
      '<g class="c6w-ls-flamme"><path d="M0 -131 C7 -122 7 -112 0 -108 C-7 -112 -7 -122 0 -131 Z" fill="url(#c6w-ls-flamme)"/><path d="M0 -121 C3 -117 3 -112 0 -110 C-3 -112 -3 -117 0 -121 Z" fill="#fff9e0" opacity=".9"/></g>' +
      '<path class="c6w-ls-rauch" d="M0 -110 c-4 -8 4 -14 0 -22 c-3 -6 3 -10 1 -16" stroke="#cfc6b8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0"/>' +
      '<rect x="-38" y="-144" width="76" height="152" fill="transparent"/>' +
      '</g></g>';
  }
  // Ein Gesicht aus Licht (kein Mensch): Kopf, Schultern, zwei helle Punkte – Lichtfamilie aus dem Namen
  function gesichtSVG(cx, cy, m) {
    var fam = hashVon(m.id + (m.name || '')) % 4, g = 'url(#c6w-ls-gesicht' + fam + ')';
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="18" ry="24" fill="' + g + '" opacity=".35"/>' +
      '<path d="M' + (cx - 16) + ' ' + (cy + 24) + ' q0 -14 10 -16 q6 -2 6 -6 h0 q0 4 6 6 q10 2 10 16 Z" fill="' + g + '" opacity=".75"/>' +
      '<ellipse cx="' + cx + '" cy="' + (cy - 6) + '" rx="9.5" ry="12" fill="' + g + '"/>' +
      '<circle cx="' + (cx - 3.5) + '" cy="' + (cy - 7) + '" r="1.5" fill="#fffdf5"/><circle cx="' + (cx + 3.5) + '" cy="' + (cy - 7) + '" r="1.5" fill="#fffdf5"/>';
  }
  function silhouetteSVG(cx, cy) {
    return '<path d="M' + (cx - 15) + ' ' + (cy + 24) + ' q0 -13 9 -15 q5 -2 5 -6 q-6 -4 -6 -12 q0 -10 7 -10 q7 0 7 10 q0 8 -6 12 q0 4 5 6 q9 2 9 15 Z" fill="#17100b" opacity=".92"/>';
  }
  function leiter(x1, y1, x2, y2) {
    var o = '<g aria-hidden="true">' + lschatten(x1 + 13, y1, 30, 1) + '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x1 + 26) + ' ' + y1 + ' L' + (x2 + 26) + ' ' + y2 + '" stroke="#7a5638" stroke-width="4"/>';
    for (var i = 1; i < 12; i++) { var t = i / 12; o += '<path d="M' + (x1 + (x2 - x1) * t) + ' ' + (y1 + (y2 - y1) * t) + ' h26" stroke="#7a5638" stroke-width="2.6"/>'; }
    return o + '</g>';
  }
  // tisch: x, w, hinten (Hinterkante der Platte), vorn (Vorderkante), schuerze (Zarge), bein (Fuß der Vorderbeine), karte (Kartengröße auf dem Tuch)
  // Der Saal als eine Komposition: Bücherwand rundum, in ihr die Skizzen der Meister; die Treppe, über die Otto kam;
  // in der Mitte der Riesenschreibtisch im Lichtschacht, die Kerze darauf
  var AUF = {
    quer: { w: 1200, h: 700, boden: 600, carl: [1084, 694], carlH: 236, schacht: [620, 0, 320], griff: 132,
      tisch: { x: 300, w: 640, hinten: 466, vorn: 560, schuerze: 26, bein: 690, karte: [92, 64] }, meister: { x: -999, y: 0, w: 1, h: 1 }, kerze: [376, 500, 0.7],
      wand: { y: 146, h: 454 }, nische: { x0: 40, x1: 440, reihe: 1 }, treppe: { oben: [1006, 144], unten: [1196, 600], stufen: 13 } },
    hoch: { w: 600, h: 1000, boden: 700, carl: [492, 994], carlH: 214, schacht: [300, 0, 230], griff: 236,
      tisch: { x: 34, w: 532, hinten: 606, vorn: 694, schuerze: 22, bein: 846, karte: [84, 58] }, meister: { x: -999, y: 0, w: 1, h: 1 }, kerze: [96, 640, 0.62],
      wand: { y: 250, h: 450 }, nische: { x0: 236, x1: 590, reihe: 1 }, treppe: { oben: [176, 250], unten: [-4, 700], stufen: 12 } }
  };
  // Plätze der Karten auf dem Tuch (u quer, v nach vorn), die neueste liegt vorn in der Mitte
  var PLAETZE = [[0.52, 0.66, -3], [0.3, 0.5, 4], [0.74, 0.46, -5], [0.15, 0.78, 6], [0.88, 0.76, -2], [0.43, 0.24, 2], [0.64, 0.2, -4]];
  function tischSVG(a) {
    var t = a.tisch, x = t.x, w = t.w, hb = t.hinten, vf = t.vorn, sz = t.schuerze, bn = t.bein, o = '';
    var eck = Math.round(w * 0.045), kante = 7, unterkante = vf + kante + sz;
    o += lschatten(x + w / 2, bn, w * 0.55, 1.2);
    // Hinterbeine, dunkler und kürzer
    [x + eck + 26, x + w - eck - 26].forEach(function (bx) { o += '<rect x="' + (bx - 5) + '" y="' + (unterkante - 4) + '" width="10" height="' + (bn - unterkante - 26) + '" fill="#2a190f"/>'; });
    // Platte, Tuch, Kante, Zarge
    o += '<path d="M' + (x + eck) + ' ' + hb + ' H' + (x + w - eck) + ' L' + (x + w) + ' ' + vf + ' H' + x + ' Z" fill="url(#c6w-ls-tholz)" stroke="#20140c" stroke-width="1.6" stroke-linejoin="round"/>';
    var fi = { l0: x + eck + 16, r0: x + w - eck - 16, y0: hb + 6, l1: x + 14, r1: x + w - 14, y1: vf - 6 };
    o += '<path class="c6w-ls-filz" d="M' + fi.l0 + ' ' + fi.y0 + ' H' + fi.r0 + ' L' + fi.r1 + ' ' + fi.y1 + ' H' + fi.l1 + ' Z" fill="url(#c6w-ls-filz)"/>';
    o += '<path d="M' + (fi.l0 + 4) + ' ' + (fi.y0 + 3) + ' H' + (fi.r0 - 4) + ' L' + (fi.r1 - 6) + ' ' + (fi.y1 - 2.5) + ' H' + (fi.l1 + 6) + ' Z" fill="none" stroke="#c9a24f" stroke-width="1" opacity=".55"/>';
    o += '<ellipse class="c6w-ls-filzschein" cx="' + (x + w * 0.26) + '" cy="' + ((hb + vf) / 2) + '" rx="' + (w * 0.42) + '" ry="' + ((vf - hb) * 0.9) + '" fill="url(#c6w-ls-filzlicht)" pointer-events="none"/>';
    o += '<rect x="' + x + '" y="' + vf + '" width="' + w + '" height="' + kante + '" rx="2" fill="url(#c6w-ls-tkante)" stroke="#20140c" stroke-width="1.2"/>';
    o += '<path d="M' + (x + 3) + ' ' + (vf + 1.4) + ' H' + (x + w - 3) + '" stroke="#c99a6a" stroke-width="1" opacity=".7"/>';
    o += '<rect x="' + (x + 10) + '" y="' + (vf + kante) + '" width="' + (w - 20) + '" height="' + sz + '" fill="url(#c6w-ls-tschuerze)" stroke="#20140c" stroke-width="1.2"/>';
    o += '<path d="M' + (x + 18) + ' ' + (vf + kante + sz - 5) + ' H' + (x + w - 18) + '" stroke="#6b4429" stroke-width="1" opacity=".6"/>';
    // Schublade mit Messingknopf links und rechts der Plakette
    [x + w * 0.2, x + w * 0.8].forEach(function (sx) { o += '<rect x="' + (sx - w * 0.09) + '" y="' + (vf + kante + 3) + '" width="' + (w * 0.18) + '" height="' + (sz - 7) + '" rx="1.5" fill="none" stroke="#20140c" stroke-width="1" opacity=".7"/><circle cx="' + sx + '" cy="' + (vf + kante + sz / 2 - 0.5) + '" r="2.4" fill="url(#c6w-ls-messing)" stroke="#5a3d17" stroke-width=".6"/>'; });
    // Vorderbeine: gedrechselt
    [x + 22, x + w - 22].forEach(function (bx) {
      var y0 = unterkante, hh = bn - y0;
      o += '<path d="M' + (bx - 8) + ' ' + y0 + ' H' + (bx + 8) + ' V' + (y0 + hh * 0.12) + ' Q' + (bx + 12) + ' ' + (y0 + hh * 0.2) + ' ' + (bx + 7) + ' ' + (y0 + hh * 0.3) +
        ' L' + (bx + 5) + ' ' + (y0 + hh * 0.72) + ' Q' + (bx + 11) + ' ' + (y0 + hh * 0.8) + ' ' + (bx + 6) + ' ' + (y0 + hh * 0.9) + ' L' + (bx + 8) + ' ' + (bn - 3) + ' H' + (bx - 8) + ' L' + (bx - 6) + ' ' + (y0 + hh * 0.9) +
        ' Q' + (bx - 11) + ' ' + (y0 + hh * 0.8) + ' ' + (bx - 5) + ' ' + (y0 + hh * 0.72) + ' L' + (bx - 7) + ' ' + (y0 + hh * 0.3) + ' Q' + (bx - 12) + ' ' + (y0 + hh * 0.2) + ' ' + (bx - 8) + ' ' + (y0 + hh * 0.12) + ' Z" fill="url(#c6w-ls-tbein)" stroke="#20140c" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<ellipse cx="' + bx + '" cy="' + (bn - 1) + '" rx="9" ry="2.6" fill="#20140c"/>';
    });
    // ein geschlossenes Buch hinten rechts, wie zuletzt gelesen
    var bx2 = fi.r0 - 54, by2 = fi.y0 + 2;
    o += '<path d="M' + bx2 + ' ' + (by2 + 10) + ' l46 -6 l10 6 l-46 6 Z" fill="#5c2f27" stroke="#20140c" stroke-width="1"/><path d="M' + bx2 + ' ' + (by2 + 10) + ' v5 l46 -6 v-5 Z" fill="#3a1d18" stroke="#20140c" stroke-width="1"/><path d="M' + (bx2 + 10) + ' ' + (by2 + 16) + ' l46 -6 v-5" fill="none" stroke="#f3e4bf" stroke-width="2" opacity=".85"/>';
    o += '<g class="c6w-ls-tischkarten">' + kartenAufDemTisch(a, fi) + '</g>';
    // Treffer: der ganze Tisch ist ein Ding
    o += '<rect class="c6w-ls-tischgriff" x="' + (x - 12) + '" y="' + (hb - 26) + '" width="' + (w + 24) + '" height="' + (bn - hb + 30) + '" fill="transparent"/>';
    var n = funde().length;
    return '<g class="c6w-ding c6w-ls-tisch" data-id="tisch" role="button" tabindex="0" aria-label="' + (n ? 'Der Tisch der Funde, ' + n + (n === 1 ? ' Fund' : ' Funde') : 'Der Tisch der Funde. Noch leer') + '"><g class="c6w-ding-innen">' + o + '</g></g>';
  }
  var tischFi = null;
  function kartenAufDemTisch(a, fi) {
    fi = fi || tischFi; if (!fi) return ''; tischFi = fi;
    var fu = funde().slice(-PLAETZE.length).reverse(), kw = a.tisch.karte[0], kh = a.tisch.karte[1], o = '', mitten = {};
    function ort(u, v) { var l = fi.l0 + (fi.l1 - fi.l0) * v, r = fi.r0 + (fi.r1 - fi.r0) * v; return [l + (r - l) * u, fi.y0 + (fi.y1 - fi.y0) * v, 0.84 + 0.16 * v]; }
    if (!fu.length) {
      var p0 = ort(0.55, 0.55);
      return '<g transform="translate(' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ') scale(1 .4)" class="c6w-ls-leerplatz"><rect x="' + (-kw / 2) + '" y="' + (-kh / 2) + '" width="' + kw + '" height="' + kh + '" rx="4" fill="none" stroke="' + GOLD + '" stroke-width="2.2" stroke-dasharray="6 5"/><path d="M0 -14 v28 M-14 0 h28" stroke="' + GOLD + '" stroke-width="3.4" stroke-linecap="round"/></g>';
    }
    // zuerst die Fäden zwischen verwandten Funden, darunter die Karten
    fu.forEach(function (f, i) { var p = PLAETZE[i]; mitten[f.id] = ort(p[0], p[1]); });
    var faeden = '', alle = funde();
    fu.forEach(function (f) { verwandt(f, alle).forEach(function (r) { if (mitten[r.id] && f.id < r.id) { var a1 = mitten[f.id], b1 = mitten[r.id], mx = (a1[0] + b1[0]) / 2, my = Math.min(a1[1], b1[1]) - 6; faeden += '<path d="M' + a1[0].toFixed(1) + ' ' + a1[1].toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + b1[0].toFixed(1) + ' ' + b1[1].toFixed(1) + '" fill="none" stroke="#e8c27a" stroke-width="1.1" opacity=".75"/>'; } }); });
    fu.forEach(function (f, i) {
      var p = PLAETZE[i], q = mitten[f.id], s = q[2], r = p[2], nicht = f.urteil === 'stimmtNicht';
      o += '<g class="c6w-ls-tk" data-f="' + esc(f.id) + '" transform="translate(' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ') scale(' + s.toFixed(3) + ' ' + (s * 0.4).toFixed(3) + ') rotate(' + r + ')">' +
        '<rect x="' + (-kw / 2 + 2) + '" y="' + (-kh / 2 + 4) + '" width="' + kw + '" height="' + kh + '" rx="3" fill="#0d0a12" opacity=".35"/>' +
        '<rect x="' + (-kw / 2) + '" y="' + (-kh / 2) + '" width="' + kw + '" height="' + kh + '" rx="3" fill="url(#c6w-ls-karte)"' + (nicht ? ' opacity=".7"' : '') + '/>';
      if (f.zahlen && f.zahlen.length >= 2) o += '<g transform="translate(' + (-kw / 2 + 8) + ' ' + (-kh / 2 + 10) + ')">' + verlaufSVG(f.zahlen, kw - 16, kh - 20, false).replace('<svg', '<svg width="' + (kw - 16) + '" height="' + (kh - 20) + '"') + '</g>';
      else o += '<path d="M' + (-kw / 2 + 8) + ' ' + (-kh / 2 + 12) + ' h' + (kw * 0.6) + ' M' + (-kw / 2 + 8) + ' ' + (-kh / 2 + 22) + ' h' + (kw * 0.72) + ' M' + (-kw / 2 + 8) + ' ' + (-kh / 2 + 32) + ' h' + (kw * 0.45) + '" stroke="#8a7656" stroke-width="2.4" stroke-linecap="round"/>' +
        (f.art === 'link' || f.art === 'youtube' ? '<rect x="' + (kw / 2 - 18) + '" y="' + (kh / 2 - 14) + '" width="11" height="8" rx="1.5" fill="' + (f.art === 'youtube' ? ROT : '#2e5a7a') + '"/>' : '');
      if (f.urteil === 'stimmt') o += '<circle cx="' + (kw / 2 - 9) + '" cy="' + (-kh / 2 + 9) + '" r="6" fill="none" stroke="#2c6a4f" stroke-width="2"/><path d="M' + (kw / 2 - 12) + ' ' + (-kh / 2 + 9) + ' l2.5 2.5 l4.5 -5" stroke="#2c6a4f" stroke-width="2" fill="none"/>';
      if (f.werkstatt) o += '<rect x="' + (-kw / 2 + 6) + '" y="' + (kh / 2 - 9) + '" width="16" height="5" rx="1" fill="#b98f3c"/>';
      o += '</g>';
    });
    var mehr = funde().length - fu.length;
    if (mehr > 0) { var pm = ort(0.06, 0.2); o += '<g transform="translate(' + pm[0].toFixed(1) + ' ' + pm[1].toFixed(1) + ') scale(.8 .32)">' + [0, 1, 2].map(function (k) { return '<rect x="' + (-kw / 2 + k * 2) + '" y="' + (-kh / 2 - k * 5) + '" width="' + kw + '" height="' + kh + '" rx="3" fill="url(#c6w-ls-karte)" stroke="#a88a5a" stroke-width="1.5"/>'; }).join('') + '</g>'; }
    return faeden + o;
  }
  // ——— Das Regal der Meister ———
  function schrank(inner, W, H) {
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" preserveAspectRatio="none">' +
      '<path d="M6 ' + H + ' V60 Q' + W / 2 + ' 0 ' + (W - 6) + ' 60 V' + H + ' Z" fill="#3a2719" stroke="' + T + '" stroke-width="2.6"/>' +
      '<path d="M18 ' + (H - 8) + ' V66 Q' + W / 2 + ' 16 ' + (W - 18) + ' 66 V' + (H - 8) + ' Z" fill="url(#c6w-ls-fach)"/>' + inner +
      '<circle cx="' + W / 2 + '" cy="10" r="5" fill="#ffe9b5"/></svg>';
  }
  function meisterSVG() {
    var W = 240, H = 300, o = '', m = meister();
    var pl = [[70, 120], [170, 120], [52, 200], [120, 196], [188, 200]], frei = m.length < pl.length;
    // Die fünf Ovale sind ein Ding: ein Tipp auf irgendeines führt zu den Meistern (leeres Oval = „Meister eintragen“)
    o += '<g class="c6w-ls-ovale" data-m="ovale" role="button" tabindex="0" aria-label="' + (frei ? 'Deine Meister. Wen bewunderst du?' : 'Deine Meister') + '">' +
      '<rect x="18" y="70" width="204" height="150" fill="transparent"/>';
    pl.forEach(function (p, i) {
      var x = m[i], cx = p[0], cy = p[1] - 26;
      o += '<g class="c6w-ls-portraet' + (x ? ' c6w-ls-hatlicht' : '') + '">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="24" ry="30" fill="url(#c6w-ls-messing)" stroke="#140d09" stroke-width="1.4"/><ellipse cx="' + cx + '" cy="' + cy + '" rx="18" ry="24" fill="' + (x ? '#2a1d14' : '#3a2a1f') + '"/>' +
        (x ? gesichtSVG(cx, cy, x) : silhouetteSVG(cx, cy)) + '</g>';
    });
    o += '</g>';
    // Dein Platz: ein leerer Rahmen, mit Absicht leer
    o += '<g class="c6w-ls-platz" data-m="platz" role="button" tabindex="0" aria-label="Dein Platz. Der Rahmen bleibt leer">' +
      '<rect x="56" y="222" width="128" height="72" fill="transparent"/>' +
      '<rect x="80" y="224" width="80" height="48" rx="3" fill="url(#c6w-ls-messing)" stroke="#140d09" stroke-width="1.4"/><rect x="86" y="230" width="68" height="36" fill="#2a1d14"/>' +
      '<rect x="86" y="250" width="68" height="16" fill="url(#c6w-ls-kartenlicht)" opacity=".7"/>' +
      '<rect x="64" y="275" width="112" height="19" rx="2.5" fill="url(#c6w-ls-messing)" stroke="#5a3d17" stroke-width=".8"/><text class="c6w-ls-platztext" x="120" y="289" text-anchor="middle">Dein Platz</text></g>';
    return schrank(o, W, H);
  }

  // ——— Skizzen der Meister: eigene Bleistiftzeichnungen, kein Abbild – Kopf, Schultern, ein paar Striche, Ottos Wort darunter ———
  var BLEI = '#4a4238';
  function skizze(cx, cy, w, h, m, seed) {
    var r = ((hashVon(seed + (m ? m.id + m.name : 'leer')) % 9) - 4) * 0.9, o = '';
    o += '<g transform="translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') rotate(' + r.toFixed(1) + ')">';
    o += '<rect x="' + (-w / 2 + 2) + '" y="' + (-h / 2 + 3) + '" width="' + w + '" height="' + h + '" fill="#0d0a12" opacity=".35"/>';
    o += '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" fill="#efe4c8" stroke="#b9a57e" stroke-width=".8"/>';
    o += '<path d="M' + (-w / 2 + 3) + ' ' + (-h / 2 + 3) + ' h' + (w - 6) + '" stroke="#fff8e6" stroke-width="1" opacity=".7"/>';
    var kx = 0, ky = -h * 0.12, rx = w * 0.19, ry = h * 0.17, sw = Math.max(0.7, w / 70);
    if (!m) {
      o += '<ellipse cx="' + kx + '" cy="' + ky + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="' + BLEI + '" stroke-width="' + sw + '" stroke-dasharray="2 3" opacity=".45"/>' +
        '<text x="0" y="' + (h * 0.36) + '" text-anchor="middle" class="c6w-ls-skname" style="font-size:' + (h * 0.15).toFixed(1) + 'px" opacity=".55">?</text>';
      return o + '</g>';
    }
    var v = hashVon(m.id + (m.name || '')), haar = v % 5, brille = (v >> 3) % 3 === 0, blick = ((v >> 5) % 3 - 1) * rx * 0.12;
    // Schultern und Hals
    o += '<path d="M' + (-w * 0.36) + ' ' + (h * 0.32) + ' Q' + (-w * 0.3) + ' ' + (h * 0.1) + ' ' + (-w * 0.08) + ' ' + (h * 0.07) + ' L' + (-w * 0.06) + ' ' + (ky + ry * 0.9) + ' M' + (w * 0.06) + ' ' + (ky + ry * 0.9) + ' L' + (w * 0.08) + ' ' + (h * 0.07) + ' Q' + (w * 0.3) + ' ' + (h * 0.1) + ' ' + (w * 0.36) + ' ' + (h * 0.32) + '" fill="none" stroke="' + BLEI + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
    // Kopf: zwei leicht versetzte Linien, wie mit der Hand
    o += '<ellipse cx="' + kx + '" cy="' + ky + '" rx="' + rx + '" ry="' + ry + '" fill="#f5ecd6" stroke="' + BLEI + '" stroke-width="' + sw + '"/>' +
      '<ellipse cx="' + (kx + rx * 0.06) + '" cy="' + (ky - ry * 0.04) + '" rx="' + (rx * 0.97) + '" ry="' + (ry * 1.02) + '" fill="none" stroke="' + BLEI + '" stroke-width="' + (sw * 0.5) + '" opacity=".5"/>';
    // Haar
    if (haar === 0) o += '<circle cx="' + kx + '" cy="' + (ky - ry * 1.15) + '" r="' + (rx * 0.38) + '" fill="none" stroke="' + BLEI + '" stroke-width="' + sw + '"/><path d="M' + (-rx) + ' ' + ky + ' Q' + (-rx * 0.9) + ' ' + (ky - ry * 1.05) + ' 0 ' + (ky - ry) + ' Q' + (rx * 0.9) + ' ' + (ky - ry * 1.05) + ' ' + rx + ' ' + ky + '" fill="none" stroke="' + BLEI + '" stroke-width="' + sw + '"/>';
    else if (haar === 1) o += '<path d="M' + (-rx * 1.02) + ' ' + (ky - ry * 0.1) + ' Q' + (-rx * 0.8) + ' ' + (ky - ry * 1.3) + ' ' + (rx * 0.2) + ' ' + (ky - ry * 1.12) + ' Q' + (rx * 1.05) + ' ' + (ky - ry * 0.9) + ' ' + (rx * 1.02) + ' ' + (ky - ry * 0.05) + '" fill="none" stroke="' + BLEI + '" stroke-width="' + (sw * 1.4) + '"/>';
    else if (haar === 2) o += '<path d="M' + (-rx * 1.05) + ' ' + (ky + ry * 0.9) + ' Q' + (-rx * 1.25) + ' ' + (ky - ry * 1.2) + ' 0 ' + (ky - ry * 1.1) + ' Q' + (rx * 1.25) + ' ' + (ky - ry * 1.2) + ' ' + (rx * 1.05) + ' ' + (ky + ry * 0.9) + '" fill="none" stroke="' + BLEI + '" stroke-width="' + sw + '"/>';
    else if (haar === 3) for (var k = 0; k < 5; k++) o += '<path d="M' + (-rx * 0.8 + k * rx * 0.4) + ' ' + (ky - ry * 0.85) + ' q' + (rx * 0.12) + ' ' + (-ry * 0.35) + ' ' + (rx * 0.25) + ' 0" fill="none" stroke="' + BLEI + '" stroke-width="' + sw + '"/>';
    else o += '<path d="M' + (-rx * 0.9) + ' ' + (ky - ry * 0.5) + ' Q0 ' + (ky - ry * 1.05) + ' ' + (rx * 0.9) + ' ' + (ky - ry * 0.5) + '" fill="none" stroke="' + BLEI + '" stroke-width="' + (sw * 0.6) + '" opacity=".6"/>';
    // Gesicht: Augen, Nase, Mund – drei, vier Striche
    var ay = ky - ry * 0.05;
    o += '<path d="M' + (-rx * 0.45 + blick) + ' ' + ay + ' h' + (rx * 0.22) + ' M' + (rx * 0.23 + blick) + ' ' + ay + ' h' + (rx * 0.22) + ' M' + (blick * 0.6) + ' ' + (ay + ry * 0.12) + ' l' + (-rx * 0.06) + ' ' + (ry * 0.28) + ' h' + (rx * 0.1) + ' M' + (-rx * 0.22) + ' ' + (ky + ry * 0.55) + ' q' + (rx * 0.22) + ' ' + (ry * 0.12) + ' ' + (rx * 0.44) + ' 0" fill="none" stroke="' + BLEI + '" stroke-width="' + (sw * 0.8) + '" stroke-linecap="round"/>';
    if (brille) o += '<circle cx="' + (-rx * 0.34 + blick) + '" cy="' + ay + '" r="' + (rx * 0.2) + '" fill="none" stroke="' + BLEI + '" stroke-width="' + (sw * 0.7) + '"/><circle cx="' + (rx * 0.34 + blick) + '" cy="' + ay + '" r="' + (rx * 0.2) + '" fill="none" stroke="' + BLEI + '" stroke-width="' + (sw * 0.7) + '"/>';
    // Schraffur auf der Schattenseite (das Licht kommt von der Kerze)
    for (var j = 0; j < 5; j++) o += '<path d="M' + (rx * 0.35 + j * rx * 0.13) + ' ' + (ky + ry * 0.75) + ' l' + (rx * 0.25) + ' ' + (-ry * 0.7) + '" stroke="' + BLEI + '" stroke-width="' + (sw * 0.5) + '" opacity=".45"/>';
    o += '<text x="0" y="' + (h * 0.45) + '" text-anchor="middle" class="c6w-ls-skname" style="font-size:' + Math.max(7, h * 0.12).toFixed(1) + 'px">' + esc(kurz(m.name || '', 16)) + '</text>';
    return o + '</g>';
  }
  // Die Nische in der Bücherwand: bis zu fünf Skizzen, dann ein leeres Blatt als „Dein Platz“
  function nischeSVG(a) {
    var n = a.nische, wd = a.wand, fh = 96, r = n.reihe, by = wd.y + 8 + (r + 1) * fh + r * 10, top = by - fh, ms = meister(), q = a === AUF.quer;
    var anz = 6, sw = (n.x1 - n.x0) / anz, w = Math.min(sw - 8, 64), h = Math.min(fh - 14, w * 1.3), o = '';
    o += '<rect x="' + (n.x0 - 4) + '" y="' + top + '" width="' + (n.x1 - n.x0 + 8) + '" height="' + fh + '" fill="#2b1d14"/>';
    o += '<ellipse cx="' + ((n.x0 + n.x1) / 2) + '" cy="' + (top + fh * 0.4) + '" rx="' + ((n.x1 - n.x0) * 0.55) + '" ry="' + (fh * 0.7) + '" fill="url(#c6w-ls-buchglanz)" opacity=".45" class="c6w-ls-nischenlicht"/>';
    for (var i = 0; i < anz; i++) {
      var cx = n.x0 + sw * (i + 0.5), cy = by - h / 2 - 3;
      if (i === anz - 1) {
        // Dein Platz: ein leerer Messingrahmen
        o += '<g class="c6w-ls-platz" data-m="platz"><rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="2" fill="#2a1d14" stroke="url(#c6w-ls-messing)" stroke-width="' + (w * 0.09).toFixed(1) + '"/><text x="' + cx + '" y="' + (cy + h * 0.06) + '" text-anchor="middle" class="c6w-ls-skname" style="font-size:' + (h * 0.13).toFixed(1) + 'px;fill:#e6c987">Dein Platz</text></g>';
      } else o += skizze(cx, cy, w, h, ms[i] || null, i);
    }
    o += '<text x="' + ((n.x0 + n.x1) / 2) + '" y="' + (by + 9) + '" text-anchor="middle" class="c6w-ls-nischentitel" style="font-size:' + (q ? 11 : 12) + 'px">Deine Meister</text>';
    o += '<rect x="' + (n.x0 - 6) + '" y="' + (top - 4) + '" width="' + (n.x1 - n.x0 + 12) + '" height="' + (fh + 18) + '" fill="transparent"/>';
    var nm = ms.length;
    return '<g class="c6w-ding c6w-ls-nische" data-id="meister" data-c6-bild role="button" tabindex="0" aria-label="' + (nm ? 'Deine Meister, ' + nm + ' Skizzen' : 'Deine Meister. Wen bewunderst du?') + '"><g class="c6w-ding-innen">' + o + '</g></g>';
  }
  // Das Bild über dem Blatt der Meister: ein Stück Bücherwand, darin die Skizzen groß
  function skizzenwandSVG() {
    var ms = meister(), o = '<rect x="0" y="0" width="240" height="300" fill="#2b1d14"/><ellipse cx="120" cy="120" rx="160" ry="140" fill="url(#c6w-ls-buchglanz)" opacity=".45"/>';
    for (var r = 0; r < 2; r++) {
      var by = 140 + r * 130;
      o += '<rect x="0" y="' + by + '" width="240" height="9" fill="url(#c6w-ls-brett)" stroke="#2b2722" stroke-width="1"/>';
      for (var i = 0; i < 3; i++) {
        var n = r * 3 + i, cx = 42 + i * 78, cy = by - 52;
        if (n === 5) o += '<g><rect x="' + (cx - 30) + '" y="' + (cy - 40) + '" width="60" height="80" rx="2" fill="#2a1d14" stroke="url(#c6w-ls-messing)" stroke-width="5"/><text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" class="c6w-ls-skname" style="font-size:12px;fill:#e6c987">Dein Platz</text></g>';
        else o += skizze(cx, cy, 62, 84, ms[n] || null, n);
      }
    }
    return '<svg viewBox="0 0 240 300">' + o + '</svg>';
  }
  // Die Treppe, über die Otto herunterkam: Wange, Stufen, Geländer; oben warmes Licht aus dem Gang
  function treppeSzene(a) {
    var t = a.treppe, o = t.oben, u = t.unten, n = t.stufen, dx = (u[0] - o[0]) / n, dy = (u[1] - o[1]) / n, s = '', links = dx < 0;
    s += '<ellipse cx="' + o[0] + '" cy="' + (o[1] + 10) + '" rx="90" ry="60" fill="url(#c6w-ls-kerzenschein)" opacity=".55"/>';
    // Stufen von oben nach unten (vorne die unteren)
    for (var i = 0; i < n; i++) {
      var x = o[0] + dx * i, y = o[1] + dy * (i + 1), bw = Math.abs(dx) + 34;
      s += '<rect x="' + (links ? x + dx - 6 : x - 6).toFixed(1) + '" y="' + (y - 7).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="9" rx="1.5" fill="' + (i % 2 ? '#6b4a31' : '#77543a') + '" stroke="#20140c" stroke-width="1"/>' +
        '<rect x="' + (links ? x + dx - 6 : x - 6).toFixed(1) + '" y="' + (y + 2).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (Math.abs(dy) - 9).toFixed(1) + '" fill="#3a2719"/>';
    }
    // Wange und Geländer
    s += '<path d="M' + o[0] + ' ' + (o[1] + 12) + ' L' + u[0] + ' ' + (u[1] + 12) + '" stroke="#4a3122" stroke-width="10" stroke-linecap="round"/>';
    var gh = 70;
    s += '<path d="M' + (o[0] + (links ? -14 : 14)) + ' ' + (o[1] - gh + 18) + ' L' + (u[0] + (links ? 14 : -14)) + ' ' + (u[1] - gh) + '" stroke="#b88a4a" stroke-width="4.5" stroke-linecap="round"/>';
    for (var k = 1; k < n; k += 1) { var px = o[0] + dx * k, py = o[1] + dy * k; s += '<path d="M' + px.toFixed(1) + ' ' + (py + 4).toFixed(1) + ' V' + (py - gh + 22).toFixed(1) + '" stroke="#6b4a31" stroke-width="2"/>'; }
    s += '<path d="M' + (u[0] + (links ? 14 : -14)) + ' ' + (u[1] - gh) + ' V' + (u[1] + 6) + '" stroke="#b88a4a" stroke-width="7" stroke-linecap="round"/><circle cx="' + (u[0] + (links ? 14 : -14)) + '" cy="' + (u[1] - gh - 4) + '" r="6" fill="url(#c6w-ls-messing)"/>';
    return '<g class="c6w-ls-treppeszene" aria-hidden="true">' + s + '</g>';
  }

  // ——— Der Weg hinab: eine Treppe, die vor dir nach unten führt; am Ende das warme Licht des Saals ———
  // Vertrag für die Bibliothek: C6.bibliothek.geheimtuer(fn) – fn(ziel, {svg, buehne}) übernimmt, sobald das Regal aufschwingt.
  // Erstes Mal ≤ 1,2 s, danach ≈ 0,7 s; ruhige Bewegung: nur eine Blende. Ein Tipp bringt Otto sofort hinunter.
  var hinabLauf = null, gaenge = 0;
  var TR = { vx: 500, hor: 300, f: 520, auge: 1.55, stufe: 0.17, tritt: 0.29, d0: 0.75, breit: 1.05, decke: 2.3, n: 17 };
  TR.vy = TR.hor + TR.f * TR.stufe / TR.tritt;
  // hochkant zeigt weniger dunkle Decke und mehr Treppe
  TR.box = function () { var W = window.innerWidth || 1000, H = window.innerHeight || 1000; return H > W * 1.2 ? [0, 140, 1000, 860] : [0, 0, 1000, 1000]; };
  function treppeSVG() {
    var t = TR, o = '', i;
    function Y(d, h) { return t.hor + t.f * h / d; }
    function X(d, s) { return t.vx + t.f * s / d; }
    function hoehe(d) { return t.auge + t.stufe * (d - t.d0) / t.tritt; }
    function misch(a, b, k) { return 'rgb(' + a.map(function (c, j) { return Math.round(c + (b[j] - c) * k); }).join(',') + ')'; }
    var dEnde = t.d0 + t.n * t.tritt, hEnde = t.auge + t.n * t.stufe, dn = 0.32;
    var vb = TR.box();
    o += '<svg xmlns="http://www.w3.org/2000/svg" width="' + vb[2] + '" height="' + vb[3] + '" viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
      '<linearGradient id="c6w-ls-twL" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + t.vx + '" y2="0"><stop offset="0" stop-color="#140d09"/><stop offset=".7" stop-color="#3e2a1c"/><stop offset="1" stop-color="#8a6038"/></linearGradient>' +
      '<linearGradient id="c6w-ls-twR" gradientUnits="userSpaceOnUse" x1="1000" y1="0" x2="' + t.vx + '" y2="0"><stop offset="0" stop-color="#140d09"/><stop offset=".7" stop-color="#3a2719"/><stop offset="1" stop-color="#7d5633"/></linearGradient>' +
      '<linearGradient id="c6w-ls-tdecke" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + t.vy + '"><stop offset="0" stop-color="#0e0907"/><stop offset=".75" stop-color="#2a1c13"/><stop offset="1" stop-color="#6b4a2c"/></linearGradient>' +
      '<radialGradient id="c6w-ls-tbogen" cx=".5" cy=".62" r=".7"><stop offset="0" stop-color="#ffe2a8"/><stop offset=".45" stop-color="#e0a35c"/><stop offset="1" stop-color="#7a4c2a"/></radialGradient>' +
      '<radialGradient id="c6w-ls-tschein" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd58e" stop-opacity=".5"/><stop offset="1" stop-color="#ffd58e" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="c6w-ls-tlampe" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd690" stop-opacity=".55"/><stop offset="1" stop-color="#ffd690" stop-opacity="0"/></radialGradient>' +
      '</defs><rect width="1000" height="1000" fill="#120c08"/>';
    // Decke und Wände: gerade Linien, die alle zum selben Punkt unten hinlaufen
    var cL0 = [X(dn, -t.breit), Y(dn, hoehe(dn) - t.decke)], cR0 = [X(dn, t.breit), cL0[1]], cL1 = [X(dEnde, -t.breit), Y(dEnde, hEnde - t.decke)], cR1 = [X(dEnde, t.breit), cL1[1]];
    var fL0 = [X(dn, -t.breit), Y(dn, hoehe(dn))], fR0 = [X(dn, t.breit), fL0[1]], fL1 = [X(dEnde, -t.breit), Y(dEnde, hEnde)], fR1 = [X(dEnde, t.breit), fL1[1]];
    function pt(p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
    o += '<path d="M' + pt(cL0) + ' L' + pt(cR0) + ' L' + pt(cR1) + ' L' + pt(cL1) + ' Z" fill="url(#c6w-ls-tdecke)"/>';
    o += '<path d="M' + pt(cL0) + ' L' + pt(cL1) + ' L' + pt(fL1) + ' L' + pt(fL0) + ' Z" fill="url(#c6w-ls-twL)"/>';
    o += '<path d="M' + pt(cR0) + ' L' + pt(cR1) + ' L' + pt(fR1) + ' L' + pt(fR0) + ' Z" fill="url(#c6w-ls-twR)"/>';
    // Gewölberippen an der Decke
    for (i = 1; i < 6; i++) {
      var dr = t.d0 + i * 0.95, hr = hoehe(dr) - t.decke, k = i / 6;
      o += '<path d="M' + X(dr, -t.breit).toFixed(1) + ' ' + Y(dr, hr + 0.18).toFixed(1) + ' Q' + t.vx + ' ' + Y(dr, hr - 0.32).toFixed(1) + ' ' + X(dr, t.breit).toFixed(1) + ' ' + Y(dr, hr + 0.18).toFixed(1) + '" fill="none" stroke="' + misch([40, 27, 18], [138, 98, 58], k) + '" stroke-width="' + (18 / dr).toFixed(1) + '" opacity=".9"/>';
    }
    // Wandlampe links, Handlauf rechts
    var dl = t.d0 + 6.2 * t.tritt, lx = X(dl, -t.breit + 0.03), ly = Y(dl, hoehe(dl) - 1.55), lr = t.f * 0.75 / dl;
    o += '<ellipse cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" rx="' + lr.toFixed(1) + '" ry="' + (lr * 1.3).toFixed(1) + '" fill="url(#c6w-ls-tlampe)"/>' +
      '<path d="M' + lx.toFixed(1) + ' ' + (ly + 18).toFixed(1) + ' q14 0 16 -12" stroke="#2a1a10" stroke-width="3" fill="none"/>' +
      '<path d="M' + (lx + 10).toFixed(1) + ' ' + (ly - 4).toFixed(1) + ' c4 -6 4 -10 0 -16 c-4 6 -4 10 0 16 Z" fill="#ffd27a"/>';
    var hl0 = [X(dn + 0.25, t.breit - 0.06), Y(dn + 0.25, hoehe(dn + 0.25) - 0.9)], hl1 = [X(dEnde, t.breit - 0.06), Y(dEnde, hEnde - 0.9)];
    o += '<path d="M' + pt(hl0) + ' L' + pt(hl1) + '" stroke="#2a1a10" stroke-width="14" stroke-linecap="round"/><path d="M' + pt(hl0) + ' L' + pt(hl1) + '" stroke="#b88a4a" stroke-width="5" stroke-linecap="round"/>';
    // Der Bogen am Ende: dahinter der Saal mit Regalen, Tisch und Kerze
    var bl = X(dEnde, -t.breit * 0.86), br = X(dEnde, t.breit * 0.86), bo = Y(dEnde, hEnde - t.decke * 0.92), bu = Y(dEnde, hEnde), bw = br - bl;
    o += '<ellipse cx="' + t.vx + '" cy="' + ((bo + bu) / 2).toFixed(1) + '" rx="' + (bw * 2.4).toFixed(1) + '" ry="' + ((bu - bo) * 1.9).toFixed(1) + '" fill="url(#c6w-ls-tschein)"/>';
    var bogen = 'M' + bl.toFixed(1) + ' ' + bu.toFixed(1) + ' V' + (bo + bw / 2).toFixed(1) + ' A' + (bw / 2).toFixed(1) + ' ' + (bw / 2).toFixed(1) + ' 0 0 1 ' + br.toFixed(1) + ' ' + (bo + bw / 2).toFixed(1) + ' V' + bu.toFixed(1) + ' Z';
    o += '<path class="c6w-ls-tor" d="' + bogen + '" fill="url(#c6w-ls-tbogen)"/>';
    var sh = (bu - bo) * 0.62, sw = bw * 0.2;
    o += '<rect x="' + (bl + bw * 0.04).toFixed(1) + '" y="' + (bu - sh).toFixed(1) + '" width="' + sw.toFixed(1) + '" height="' + sh.toFixed(1) + '" fill="#5a3a22" opacity=".75"/><rect x="' + (br - bw * 0.04 - sw).toFixed(1) + '" y="' + (bu - sh).toFixed(1) + '" width="' + sw.toFixed(1) + '" height="' + sh.toFixed(1) + '" fill="#5a3a22" opacity=".75"/>';
    for (i = 1; i < 4; i++) { var ry = bu - sh * i / 4; o += '<path d="M' + (bl + bw * 0.04).toFixed(1) + ' ' + ry.toFixed(1) + ' h' + sw.toFixed(1) + ' M' + (br - bw * 0.04 - sw).toFixed(1) + ' ' + ry.toFixed(1) + ' h' + sw.toFixed(1) + '" stroke="#3a2416" stroke-width="' + Math.max(1, bw * 0.012).toFixed(1) + '"/>'; }
    var tw = bw * 0.38, ty = bu - (bu - bo) * 0.2;
    o += '<rect x="' + (t.vx - tw / 2).toFixed(1) + '" y="' + ty.toFixed(1) + '" width="' + tw.toFixed(1) + '" height="' + (bw * 0.03).toFixed(1) + '" fill="#4a2e1d"/><path d="M' + (t.vx - tw / 2 + 3).toFixed(1) + ' ' + ty.toFixed(1) + ' V' + bu.toFixed(1) + ' M' + (t.vx + tw / 2 - 3).toFixed(1) + ' ' + ty.toFixed(1) + ' V' + bu.toFixed(1) + '" stroke="#4a2e1d" stroke-width="' + Math.max(1.2, bw * 0.02).toFixed(1) + '"/>' +
      '<circle cx="' + (t.vx - tw * 0.3).toFixed(1) + '" cy="' + (ty - bw * 0.05).toFixed(1) + '" r="' + Math.max(1.4, bw * 0.022).toFixed(1) + '" fill="#fff4d0"/>';
    // Die Stufen: jede ein Streifen bis zur Kante, hell zum Saal hin, die nahe Stufe unten am Rand
    var stufen = '', yVor = 1200;
    for (i = 0; i < t.n; i++) {
      var dv = t.d0 + i * t.tritt, dh = dv + t.tritt, h = t.auge + i * t.stufe;
      var yO = Y(dh, h), yU = Math.min(yVor, 1200), dU = t.f * h / Math.max(1, yU - t.hor);
      var wO = t.f * t.breit / dh, wU = t.f * t.breit / dU, li = Math.pow(i / (t.n - 1), 1.25);
      var tritt = misch([46, 31, 21], [176, 128, 78], li), kante = misch([92, 64, 42], [236, 196, 140], li), schatten = misch([18, 12, 8], [96, 66, 40], li);
      stufen += '<path d="M' + (t.vx - wU).toFixed(1) + ' ' + yU.toFixed(1) + ' L' + (t.vx + wU).toFixed(1) + ' ' + yU.toFixed(1) + ' L' + (t.vx + wO).toFixed(1) + ' ' + yO.toFixed(1) + ' L' + (t.vx - wO).toFixed(1) + ' ' + yO.toFixed(1) + ' Z" fill="' + tritt + '"/>';
      var sh2 = Math.max(0.8, (yU - yO) * 0.22);
      stufen += '<path d="M' + (t.vx - wU).toFixed(1) + ' ' + yU.toFixed(1) + ' L' + (t.vx + wU).toFixed(1) + ' ' + yU.toFixed(1) + ' L' + (t.vx + wU * 0.99).toFixed(1) + ' ' + (yU - sh2).toFixed(1) + ' L' + (t.vx - wU * 0.99).toFixed(1) + ' ' + (yU - sh2).toFixed(1) + ' Z" fill="' + schatten + '" opacity=".55"/>';
      stufen += '<path d="M' + (t.vx - wO).toFixed(1) + ' ' + yO.toFixed(1) + ' H' + (t.vx + wO).toFixed(1) + '" stroke="' + kante + '" stroke-width="' + Math.max(0.8, 26 / dh).toFixed(1) + '"/>';
      yVor = yO;
    }
    o += stufen;
    // Der Boden des Saals hinter der letzten Stufe, im Licht
    o += '<path d="M' + (t.vx - t.f * t.breit / dEnde).toFixed(1) + ' ' + yVor.toFixed(1) + ' H' + (t.vx + t.f * t.breit / dEnde).toFixed(1) + ' L' + br.toFixed(1) + ' ' + bu.toFixed(1) + ' H' + bl.toFixed(1) + ' Z" fill="#d6a868" opacity=".9"/>';
    return o + '</svg>';
  }
  // Die Treppe wird einmal als Bild gemalt (still, im Voraus), dann bewegt sich nur noch dieses Bild: kein Ruckeln
  var treppeCache = {};
  function treppeBild() {
    var k = TR.box().join(',');
    if (treppeCache[k]) return treppeCache[k].p;
    var img = new Image(), e = { img: null };
    e.p = new Promise(function (r) {
      img.onload = function () { var d = img.decode ? img.decode() : Promise.resolve(); d.then(function () { e.img = img; r(img); }, function () { e.img = img; r(img); }); };
      img.onerror = function () { r(null); };
    });
    img.alt = ''; img.decoding = 'async';
    try { img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(treppeSVG()); } catch (x) { return Promise.resolve(null); }
    treppeCache[k] = e;
    return e.p;
  }
  function treppeFertig() { var e = treppeCache[TR.box().join(',')]; return e && e.img ? e.img : null; }
  function vorbereiten() { if (ruhig()) return; var f = function () { try { treppeBild(); } catch (e) {} }; if (window.requestIdleCallback) requestIdleCallback(f, { timeout: 1500 }); else setTimeout(f, 400); }
  function spiel(el, kf, opt) {
    try { if (el && el.animate) return el.animate(kf, opt); } catch (e) {}
    try { var z = kf[kf.length - 1]; Object.keys(z).forEach(function (k) { if (k !== 'offset' && k !== 'easing') el.style[k] = z[k]; }); } catch (e) {}
    return null;
  }
  function hinab(ziel, o) {
    o = o || {};
    if (hinabLauf) return hinabLauf.p;
    var el = document.createElement('div'), ru = ruhig() || !el.animate, gegangen = !!o.schon, fertig = false, uhren = [];
    var zweiter = !ru && ++gaenge > 1 && !o.halt;
    var W = window.innerWidth || 1000, H = window.innerHeight || 1000;
    var tor = !ru && o.tor && o.tor.w > 20 && o.tor.h > 20 ? o.tor : null;
    // auf: aus dem Durchgang aufziehen · gang: die Stufen hinab · blende: das Licht des Saals füllt das Bild ·
    // dann entsteht der Saal (das kann einen Augenblick dauern – das Bild steht dabei still) · aus: die Treppe blendet weg
    var Z = ru ? { ein: 160, blende: [0, 0], aus: 260 }
      : zweiter ? { ein: 120, auf: tor ? 150 : 0, gang: 340, blende: [220, 140], aus: 180 }
      : { ein: 180, auf: tor ? 220 : 0, gang: 560, blende: [400, 180], aus: 220 };
    el.className = 'c6w-ls-hinab' + (ru ? ' c6w-ls-hruhig' : ''); el.setAttribute('aria-hidden', 'true');
    var bild = ru ? null : treppeFertig();
    el.innerHTML = '<div class="c6w-ls-hgrund"></div>' + (ru || bild ? '' : treppeSVG()) + '<div class="c6w-ls-hblende"></div>';
    if (bild) { bild = bild.cloneNode(); bild.className = 'c6w-ls-hbild'; el.insertBefore(bild, el.firstChild.nextSibling); }
    if (tor) el.classList.add('c6w-ls-htor');
    document.body.appendChild(el);
    var svg = bild || el.querySelector('svg'), blende = el.querySelector('.c6w-ls-hblende'), grund = el.querySelector('.c6w-ls-hgrund');
    function geh() { if (gegangen) return; gegangen = true; try { C6.geh('lesesaal', Object.assign({ sofort: true, durch: true }, ziel || {})); } catch (e) {} }
    var p = new Promise(function (erfuellt) {
      function ende(schnell) {
        if (fertig) return; fertig = true;
        uhren.forEach(clearTimeout);
        geh();
        var a = spiel(el, [{ opacity: 1 }, { opacity: 0 }], { duration: schnell ? 200 : Z.aus, easing: 'ease-out', fill: 'forwards' });
        var weg = function () { if (el.parentNode) el.parentNode.removeChild(el); hinabLauf = null; };
        if (a) a.onfinish = weg; else weg();
        setTimeout(weg, (schnell ? 200 : Z.aus) + 200);
        erfuellt();
      }
      el.addEventListener('pointerdown', function (e) { e.preventDefault(); ende(true); });
      // erst, wenn die Treppe gemalt ist, beginnt die Bewegung (sonst springt sie ins Bild)
      requestAnimationFrame(function () { requestAnimationFrame(los); });
      function los() {
        if (fertig) return;
        spiel(el, [{ opacity: 0 }, { opacity: 1 }], { duration: tor ? 140 : Z.ein, easing: 'ease-out', fill: 'forwards' });
        if (ru) { uhren.push(setTimeout(function () { ende(false); }, Z.ein + 20)); return; }
        // Fluchtpunkt der gemalten Treppe auf dem Bildschirm
        var vb = TR.box(), s = Math.max(W / vb[2], H / vb[3]);
        var px = W / 2 + (TR.vx - vb[0] - vb[2] / 2) * s, py = H / 2 + (TR.vy - vb[1] - vb[3] / 2) * s, k1 = zweiter ? 1.45 : 1.75;
        function m(k, fx, fy) { return 'translate(' + (fx - k * px).toFixed(1) + 'px,' + (fy - k * py).toFixed(1) + 'px) scale(' + k.toFixed(4) + ')'; }
        var dauer = Z.auf + Z.gang, kf = [];
        if (tor) {
          // erstes Bild: im offenen Durchgang, Fluchtpunkt dort, wo er in der Bibliothek war; dann wächst die Treppe zum ganzen Bild
          var k0 = Math.min(tor.w / W, tor.h / H) * 1.12;
          kf.push({ offset: 0, transform: m(k0, tor.fx, tor.fy), easing: 'cubic-bezier(.4,0,.2,1)' });
          kf.push({ offset: Z.auf / dauer, transform: m(1, px, py), easing: 'cubic-bezier(.3,.1,.3,1)' });
          // das Dunkel des Gangs legt sich über die Bibliothek, während die Treppe wächst
          spiel(grund, [{ opacity: 0 }, { opacity: 1 }], { duration: Z.auf, easing: 'cubic-bezier(.5,0,.5,1)', fill: 'forwards' });
        } else kf.push({ offset: 0, transform: m(1, px, py), easing: 'cubic-bezier(.3,.1,.3,1)' });
        kf.push({ offset: 1, transform: m(k1, px, py) });
        if (svg) { svg.style.transformOrigin = '0 0'; spiel(svg, kf, { duration: dauer, fill: 'forwards' }); }
        var ab = Z.auf + Z.blende[0];
        uhren.push(setTimeout(function () { spiel(blende, [{ opacity: 0 }, { opacity: 1 }], { duration: Z.blende[1], easing: 'ease-in', fill: 'forwards' }); }, ab));
        if (o.halt !== 'licht') uhren.push(setTimeout(function () { ende(false); }, ab + Z.blende[1] + 30)); // halt: nur für Prüfstände
      }
    });
    hinabLauf = { p: p, el: el };
    return p;
  }
  // Der ganze Weg aus der Bibliothek (Vertrag der Bibliothek): das Regal gleitet auf, dann zieht die Treppe aus dem Durchgang auf.
  // Ein Tipp während des Öffnens geht sofort hinab.
  function ausDerBibliothek(ziel, w) {
    w = w || {};
    if (hinabLauf) return true;
    var svg = w.svg, ru = ruhig(), los = false, zweiter = gaenge > 0;
    try { C6.schweig && C6.schweig(); } catch (e) {}
    try { if (!L().tuerAuf) { aendere(function (l) { l.tuerAuf = Date.now(); }); var lx = svg && svg.querySelector('.c6w-lex-schimmer'); if (lx) lx.classList.remove('c6w-lex-schimmer'); } } catch (e) {}
    function weiter() {
      if (los) return; los = true;
      if (w.buehne) w.buehne.removeEventListener('pointerdown', abbruch, true);
      if (C6.jetzt !== 'bibliothek' || hinabLauf) return;
      var t = null; try { if (typeof w.tor === 'function') t = w.tor(); } catch (e) { t = null; }
      hinab(ziel, { kurz: true, tor: t });
    }
    function abbruch() { weiter(); }
    if (w.buehne && !ru) w.buehne.addEventListener('pointerdown', abbruch, true);
    var offen = null;
    try { if (typeof w.oeffne === 'function') offen = w.oeffne(); } catch (e) { offen = null; }
    if (offen && typeof offen.then === 'function') {
      offen.then(weiter, weiter);
      setTimeout(weiter, 2600); // nur Notbremse, falls das Regal klemmt; sonst startet die Treppe genau auf w.oeffne()
    } else {
      if (svg) { svg.classList.add('c6w-zieht'); if (ru || zweiter) svg.classList.add('c6w-auf'); else setTimeout(function () { if (C6.jetzt === 'bibliothek') svg.classList.add('c6w-auf'); }, 300); }
      setTimeout(weiter, ru ? 0 : zweiter ? 60 : 420);
    }
    return true;
  }
  var angemeldet = false;
  function melde() { if (angemeldet) return; try { if (C6.bibliothek && typeof C6.bibliothek.geheimtuer === 'function') { angemeldet = true; C6.bibliothek.geheimtuer(ausDerBibliothek); } } catch (e) {} }
  melde();
  if (C6.bus) C6.bus.on('raum', function () { melde(); if (C6.jetzt === 'bibliothek') vorbereiten(); });

  var saal = null; // wird gesetzt, sobald der Saal gebaut ist
  var gezeigt = {}; // je Sitzung: welche Funde schon wieder aufgetaucht sind
  C6.raum({
    id: 'lesesaal', name: 'Lesesaal', hoehe: 'boden', zurueckKnopf: true, licht: 'nacht',
    symbol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 20V9a8 8 0 0 1 16 0v11Z"/><path d="M9 20v-6h6v6"/></svg>',
    faden: function () {
      var w = [{ name: 'Bibliothek', id: 'bibliothek', tun: function () { C6.geh('bibliothek'); } }, { name: 'Lesesaal', id: 'lesesaal', tun: function () { if (api && api.zuSaal) api.zuSaal(); } }];
      if (api && api.ansicht) w.push({ name: api.ansicht === 'meister' ? 'Deine Meister' : 'Tisch der Funde', tun: function () { if (api.ansicht === 'meister') api.meister(); else api.tisch(); } });
      if (api && api.karte) w.push({ name: api.karte, tun: function () {} });
      return w;
    },
    bauen: function (buehne) {
      buehne.classList.add('c6w-lesesaal');
      buehne.innerHTML = '<div class="c6w-schieber"><div class="c6w-raum">' +
        '<svg class="c6w-szene" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMax meet" role="group" aria-label="Der Lesesaal"></svg>' +
        '<span class="c6w-ls-tischschild" aria-hidden="true">Deine Funde</span>' +
        '<div class="c6w-carl-platz"></div>' +
        '<div class="c6w-ls-moebel">' +
        '<button type="button" class="c6w-ls-regal c6w-ls-r-meister" data-zu="meister" data-c6-bild><span class="c6w-ls-licht" aria-hidden="true"></span><span class="c6w-ls-bild"></span><span class="c6w-ls-plakette">Deine Meister</span></button>' +
        '</div></div></div>' +
        '<section class="c6w-ls-karte c6w-ls-dunkel" aria-label="Lesesaal" hidden>' +
        '<div class="c6w-ls-kbild"><svg class="c6w-ls-ksvg" viewBox="0 0 600 720" preserveAspectRatio="xMidYMid meet" role="group" aria-hidden="true"></svg>' +
        '<div class="c6w-ls-platte" role="group" aria-label="Der Tisch der Funde" data-c6-leer hidden><div class="c6w-ls-pinnen" data-c6-leer><svg class="c6w-ls-pfaeden" aria-hidden="true"></svg><svg class="c6w-ls-pweg" aria-hidden="true"></svg><svg class="c6w-ls-tdeko" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="21" fill="#ffd27a" opacity=".22" class="c6w-ls-tflamme"/><circle cx="23" cy="23" r="13" fill="#c9a24f" stroke="#5a3d17" stroke-width="1.2"/><circle cx="23" cy="23" r="9" fill="#9a7434"/><circle cx="23" cy="23" r="6" fill="#f6ecd4" stroke="#8a7656" stroke-width=".8"/><circle cx="23" cy="23" r="2.4" fill="#fff3c4" class="c6w-ls-tflamme"/></svg><div class="c6w-ls-wanderer" aria-hidden="true"></div><div class="c6w-ls-stags" data-c6-leer></div><div class="c6w-ls-fks" data-c6-leer></div></div></div></div>' +
        '<div class="c6w-ls-blatt" aria-live="polite" data-c6-ding></div></section>';
      var schieber = buehne.querySelector('.c6w-schieber'), raum = buehne.querySelector('.c6w-raum');
      var svg = buehne.querySelector('.c6w-szene'), platz = buehne.querySelector('.c6w-carl-platz'), moebel = buehne.querySelector('.c6w-ls-moebel'), schild = buehne.querySelector('.c6w-ls-tischschild');
      var kEl = buehne.querySelector('.c6w-ls-karte'), kSvg = buehne.querySelector('.c6w-ls-ksvg'), blatt = buehne.querySelector('.c6w-ls-blatt');
      var pweg = buehne.querySelector('.c6w-ls-pweg'), wanderer = buehne.querySelector('.c6w-ls-wanderer');
      var platte = buehne.querySelector('.c6w-ls-platte'), pinnen = buehne.querySelector('.c6w-ls-pinnen'), pfaeden = buehne.querySelector('.c6w-ls-pfaeden'), stags = buehne.querySelector('.c6w-ls-stags'), fks = buehne.querySelector('.c6w-ls-fks');
      var ctl = null, auf = null, aufName = '', skala = 1, ox = 0, oy = 0, gewaehlt = null;
      svg.innerHTML = DEFS.replace('</defs>', '<linearGradient id="c6w-ls-messing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6c987"/><stop offset="1" stop-color="#9a7434"/></linearGradient></defs>') + '<g class="c6w-ls-g"></g>';
      kSvg.innerHTML = '<g class="c6w-ls-kg"></g>';
      platz.setAttribute('data-tiefe', 'mitte');
      var g = svg.querySelector('.c6w-ls-g'), kg = kSvg.querySelector('.c6w-ls-kg');

      function zeichne() {
        var a = auf, W = a.w, h = '', q = a === AUF.quer, sc = a.schacht;
        // Sternenkuppel über allem
        h += '<rect x="-1400" y="-2000" width="' + (W + 2800) + '" height="' + (2000 + a.boden) + '" fill="url(#c6w-ls-nacht)"/>' +
          sterne(-200, 0, W + 400, q ? 120 : 220, q ? 90 : 70, 3);
        var kx = W / 2, kr = q ? 520 : 330, ky = q ? 120 : 200;
        h += '<path d="M' + (kx - kr) + ' ' + ky + ' A' + kr + ' ' + (kr * 0.5) + ' 0 0 1 ' + (kx + kr) + ' ' + ky + '" fill="none" stroke="#3a2e44" stroke-width="10"/>';
        for (var r = 1; r < 10; r++) { var an = Math.PI * r / 10; h += '<path d="M' + kx + ' ' + (ky - kr * 0.5) + ' Q' + (kx + Math.cos(an) * kr * 0.7).toFixed(1) + ' ' + (ky - Math.sin(an) * kr * 0.35).toFixed(1) + ' ' + (kx + Math.cos(an) * kr).toFixed(1) + ' ' + ky + '" fill="none" stroke="#2c2438" stroke-width="2"/>'; }
        // Hohe Regale bis ins Dunkel
        // Die Bücherwand zieht sich rundum: oben hinter der Galerie, unten bis zum Boden; in ihr die Nische der Meister
        // oben bleibt über dem Schreibtisch die Kuppel offen: von dort fällt das Licht
        var lu = sc[0] - sc[2] * 0.75, ru = sc[0] + sc[2] * 0.75;
        h += wandregal(-60, q ? -70 : 20, lu + 60, q ? 200 : 215, 5) + wandregal(ru, q ? -70 : 20, W + 60 - ru, q ? 200 : 215, 9) + wandregal(-60, a.wand.y, W + 120, a.wand.h, 3, a.nische);
        h += '<rect x="-1400" y="-200" width="' + (W + 2800) + '" height="' + (q ? 340 : 420) + '" fill="url(#c6w-ls-dunkel)" pointer-events="none"/>';
        // Galerie
        var gy = q ? 132 : 236;
        h += '<rect x="-1400" y="' + gy + '" width="' + (W + 2800) + '" height="12" fill="#4a3122" stroke="' + T + '" stroke-width="1.6"/>';
        for (var bx = -20; bx < W + 20; bx += 22) h += '<path d="M' + bx + ' ' + (gy - 26) + ' V' + gy + '" stroke="#5a3d29" stroke-width="4"/>';
        h += '<rect x="-1400" y="' + (gy - 30) + '" width="' + (W + 2800) + '" height="6" fill="#6b4a31"/>';
        // Leitern
        if (q) h += leiter(470, 600, 486, 150);
        h += '<g class="c6w-ls-nischenplatz">' + nischeSVG(a) + '</g>';
        h += treppeSzene(a);
        // Lichtschacht aus der Kuppel mit Staub – er fällt auf den Tisch
        h += '<path d="M' + (sc[0] - sc[2] * 0.25) + ' ' + sc[1] + ' L' + (sc[0] + sc[2] * 0.25) + ' ' + sc[1] + ' L' + (sc[0] + sc[2]) + ' ' + a.boden + ' L' + (sc[0] - sc[2]) + ' ' + a.boden + ' Z" fill="url(#c6w-ls-schacht)" pointer-events="none"/>';
        h += '<g class="c6w-ls-staub">';
        for (var m = 0; m < 7; m++) {
          var t = zufall(m * 5 + 2), yy = sc[1] + 40 + t * (a.boden - 80), br = sc[2] * 0.25 + (sc[2] * 0.75) * (yy / a.boden);
          h += '<circle cx="' + (sc[0] + (zufall(m * 11) - 0.5) * 2 * br).toFixed(1) + '" cy="' + yy.toFixed(1) + '" r="' + (0.8 + zufall(m * 3) * 1.4).toFixed(1) + '" fill="#fff4d6"/>';
        }
        h += '</g>';
        // der Himmel ist anfassbar (Halten = „Wie geht das?“), zuoberst in der Ferne; Antippen bleibt ohne zweite Bedeutung
        h += '<rect class="c6w-ls-himmelgriff" x="-1400" y="-200" width="' + (W + 2800) + '" height="' + (a.griff + 200) + '" fill="transparent" data-id="sterne" aria-hidden="true"/>';
        h = '<g data-tiefe="fern">' + h + '</g><g data-tiefe="mitte">';
        // Boden
        h += '<rect x="-1400" y="' + a.boden + '" width="' + (W + 2800) + '" height="1400" fill="#4a3222"/>' +
          '<rect x="-1400" y="' + a.boden + '" width="' + (W + 2800) + '" height="' + (a.h - a.boden) + '" fill="url(#c6w-ls-boden)"/>' +
          '<path d="M-1400 ' + a.boden + ' H' + (W + 1400) + '" stroke="' + T + '" stroke-width="2.5"/>' +
          '<ellipse cx="' + sc[0] + '" cy="' + (a.boden + (a.h - a.boden) * 0.45) + '" rx="' + (sc[2] * 1.2) + '" ry="' + ((a.h - a.boden) * 0.3) + '" fill="url(#c6w-ls-licht)"/>';
        // Der Tisch der Funde in der Mitte
        h += tischSVG(a);
        // Ohne Kerze ist der Saal kühl; mit Kerze legt sich warmes Licht über Tisch, Boden und Wand
        var kz = a.kerze;
        h += '<rect class="c6w-ls-kalt" x="-1400" y="-2000" width="' + (W + 2800) + '" height="4000" fill="#0f1430" pointer-events="none"/>' +
          '<ellipse class="c6w-ls-kerzenschein" cx="' + kz[0] + '" cy="' + (kz[1] - 50) + '" rx="' + (q ? 700 : 480) + '" ry="' + (q ? 480 : 560) + '" fill="url(#c6w-ls-kerzenschein)" pointer-events="none"/>' +
          kerzeSVG(kz[0], kz[1], !!L().kerze, kz[2]);
        h += '</g>';
        g.innerHTML = h;
        zeit(tageszeit());
        kerzeZeige();
        bindeDinge();
      }
      function tischNeu() {
        var k = svg.querySelector('.c6w-ls-tischkarten'), ti = svg.querySelector('.c6w-ls-tisch');
        if (k && auf) k.innerHTML = kartenAufDemTisch(auf);
        var n = funde().length;
        if (ti) ti.setAttribute('aria-label', n ? 'Der Tisch der Funde, ' + n + (n === 1 ? ' Fund' : ' Funde') : 'Der Tisch der Funde. Noch leer');
      }
      // ——— Licht je Tageszeit (Kuppel, Schacht, Boden) ———
      var zeitJetzt = null;
      function zeit(t) {
        var z = ZEIT[t] || ZEIT.nacht; zeitJetzt = t;
        buehne.setAttribute('data-zeit', t);
        try {
          var st = svg.querySelectorAll('#c6w-ls-nacht stop'); z.himmel.forEach(function (c, i) { if (st[i]) st[i].setAttribute('stop-color', c); });
          var sch = svg.querySelectorAll('#c6w-ls-schacht stop'); if (sch[0]) { sch[0].setAttribute('stop-color', z.schacht[0]); sch[0].setAttribute('stop-opacity', z.schacht[1]); } if (sch[1]) sch[1].setAttribute('stop-color', z.schacht[0]);
          var bo = svg.querySelectorAll('#c6w-ls-licht stop'); [].forEach.call(bo, function (x) { x.setAttribute('stop-color', z.boden); });
          var hi = svg.querySelector('.c6w-ls-himmel'); if (hi) hi.style.opacity = z.sterne;
        } catch (e) {}
        licht();
      }
      function licht() {
        var W = buehne.clientWidth, Hh = buehne.clientHeight, an = !!L().kerze, z = ZEIT[zeitJetzt] || ZEIT.nacht;
        try { if (C6.lichtquelle && C6.lichtquelle.setze && W && Hh) C6.lichtquelle.setze('lesesaal', { x: (ox + LICHT.x * skala) / W, y: 0.02, art: 'fenster', warm: an ? 0.9 : (zeitJetzt === 'nacht' ? 0.35 : 0.7), staerke: an ? 0.7 : Math.max(0.35, z.schacht[1]), hoehe: 0.95 }); } catch (e) {}
      }
      // ——— Die Kerze: an oder aus, der Saal (und der Tisch) antwortet mit Licht ———
      function kerzeZeige() {
        var an = !!L().kerze, k = svg.querySelector('.c6w-ls-kerze');
        buehne.classList.toggle('c6w-ls-kerze-an', an);
        if (k) { k.classList.toggle('c6w-ls-brennt', an); k.setAttribute('aria-pressed', an ? 'true' : 'false'); }
        staunText('lesesaal.kerze', an ? satz('lesesaal.staunen.kerze', 'Die Kerze macht den Saal warm. Mehr tut sie nicht. Ob sie brennt, merk ich mir.') : satz('lesesaal.staunen.kerzeAus', 'Die Kerze ist aus. Tipp sie an, dann wird es warm. Mehr tut sie nicht.'));
        licht();
      }
      var warmGesagt = false;
      function kerzeTipp() {
        var an = !L().kerze, k = svg.querySelector('.c6w-ls-kerze'), erstes = an && !L().kerzeErst;
        aendere(function (l) { l.kerze = an; });
        if (k && !an && !ruhig()) { k.classList.remove('c6w-ls-blaest'); void k.getBoundingClientRect(); k.classList.add('c6w-ls-blaest'); setTimeout(function () { k.classList.remove('c6w-ls-blaest'); }, 1600); }
        kerzeZeige();
        stimmung(an ? 'froh' : 'ruhig');
        try { if (C6.staunen && C6.staunen.zu) C6.staunen.zu('lesesaal.kerze'); } catch (e) {}
        if (an && !L().kerzeErst) { aendere(function (l) { l.kerzeErst = Date.now(); }); if (C6.sag && !api.ansicht) setTimeout(function () { if (C6.jetzt === 'lesesaal' && L().kerze) C6.sag(satz('lesesaal.kerze', 'Schön. Jetzt ist es warm hier.'), { merken: false }); }, 500); }
        else if (!an && warmGesagt) { warmGesagt = false; if (C6.sag && !api.ansicht) C6.sag(satz('lesesaal.kerzeAus', 'Kalt. Aber du weißt ja, wo die Kerze steht.'), { merken: false }); }
        if (erstes) warmGesagt = true;
      }
      // ——— Sterne, die leise zur Hand wandern ———
      var sternLauf = null, sternZiel = null, sternRuhe = 0;
      function sternListe() { return [].map.call(svg.querySelectorAll('.c6w-ls-himmel circle'), function (c) { if (c._bx == null) { c._bx = +c.getAttribute('cx'); c._by = +c.getAttribute('cy'); c._x = 0; c._y = 0; } return c; }); }
      function sternSchritt() {
        sternLauf = null;
        var ls = sternListe(), R = auf === AUF.quer ? 460 : 340, MAXW = 14, still = true, z = sternZiel;
        for (var i = 0; i < ls.length; i++) {
          var c = ls[i], tx = 0, ty = 0;
          if (z) { var dx = z.x - c._bx, dy = z.y - c._by, d = Math.hypot(dx, dy) || 1, f = Math.max(0, 1 - d / R); if (f > 0) { var w = MAXW * f * f; tx = dx / d * w; ty = dy / d * w; } }
          var nx = c._x + (tx - c._x) * 0.05, ny = c._y + (ty - c._y) * 0.05;
          if (Math.abs(nx - c._x) > 0.02 || Math.abs(ny - c._y) > 0.02) still = false;
          c._x = nx; c._y = ny;
          c.setAttribute('transform', 'translate(' + nx.toFixed(2) + ' ' + ny.toFixed(2) + ')');
        }
        if (!still || z) sternLauf = requestAnimationFrame(sternSchritt);
      }
      function sternZu(e) {
        if (ruhig() || !auf || C6.jetzt !== 'lesesaal') return;
        var r = buehne.getBoundingClientRect();
        sternZiel = { x: (e.clientX - r.left - ox) / skala, y: (e.clientY - r.top - oy) / skala };
        clearTimeout(sternRuhe); sternRuhe = setTimeout(function () { sternZiel = null; }, 2600);
        if (!sternLauf) sternLauf = requestAnimationFrame(sternSchritt);
      }
      function sternLos() { sternZiel = null; clearTimeout(sternRuhe); if (!sternLauf) sternLauf = requestAnimationFrame(sternSchritt); }
      raum.addEventListener('pointermove', sternZu, { passive: true });
      raum.addEventListener('pointerdown', sternZu, { passive: true });
      raum.addEventListener('pointerleave', sternLos, { passive: true });
      // ——— Dinge zum Denken anbinden (nach jedem Zeichnen) ———
      var loeser = [];
      function bindeDinge() {
        loeser.forEach(function (f) { try { f(); } catch (e) {} }); loeser = [];
        var k = svg.querySelector('.c6w-ls-kerze'), hg = svg.querySelector('.c6w-ls-himmelgriff'), ti = svg.querySelector('.c6w-ls-tisch');
        if (k) {
          k.addEventListener('click', function (e) { e.stopPropagation(); kerzeTipp(); });
          k.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); kerzeTipp(); } });
          loeser.push(halten(k, function () { staune('lesesaal.kerze'); }));
        }
        if (ti) {
          ti.addEventListener('click', function (e) { e.stopPropagation(); var c = e.target.closest && e.target.closest('[data-f]'); oeffneTisch(c ? c.getAttribute('data-f') : null); });
          ti.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); oeffneTisch(); } });
          loeser.push(halten(ti, function () { staune('lesesaal.tisch'); }));
        }
        if (hg) loeser.push(halten(hg, function () { staune('lesesaal.sterne'); }));
        bindeNische();
      }
      var nischeLoeser = null;
      function bindeNische() {
        if (nischeLoeser) { try { nischeLoeser(); } catch (e) {} nischeLoeser = null; }
        var ni = svg.querySelector('.c6w-ls-nische');
        if (ni) {
          ni.addEventListener('click', function (e) {
            e.stopPropagation();
            var p = e.target.closest && e.target.closest('[data-m]');
            if (p && p.getAttribute('data-m') === 'platz') { stimmung('froh'); if (C6.sag) C6.sag(satz('lesesaal.platz', 'Der bleibt leer. Das ist dein Platz.'), { merken: false }); return; }
            oeffneMeister(null, meister().length < 5);
          });
          ni.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); oeffneMeister(); } });
          nischeLoeser = halten(ni, function (el, o) { var t = o && document.elementFromPoint ? document.elementFromPoint(o.x, o.y) : null, p = t && t.closest ? t.closest('[data-m]') : null; staune(p && p.getAttribute('data-m') === 'platz' ? 'lesesaal.platz' : 'lesesaal.portraet'); });
        }
      }
      staunText('lesesaal.sterne', satz('lesesaal.staunen.sterne', 'Die Sterne gehen ein Stück mit deiner Hand. Nur ein Stück. Dann bleiben sie, wo sie sind.'));
      staunText('lesesaal.portraet', satz('lesesaal.staunen.skizze', 'Das sind Skizzen deiner Meister, mit Bleistift. Keine echten Gesichter, nur wie ich sie mir denke. Ein leeres Blatt wartet auf einen Namen.'));
      staunText('lesesaal.platz', satz('lesesaal.staunen.platz', 'Der Rahmen bleibt leer. Das ist dein Platz. Ich mal da nichts hinein.'));
      staunText('lesesaal.tisch', satz('lesesaal.staunen.tisch', 'Was du mir tagsüber schickst, leg ich hier hin. Ich fass es zusammen, du sagst, ob es stimmt. Ohne dein Ja passiert damit nichts.'));
      if (C6.bus) C6.bus.on('tageszeit', function (d) { if (auf) zeit((d && d.jetzt) || tageszeit()); });
      function moebelMalen() {
        var np = svg.querySelector('.c6w-ls-nischenplatz');
        if (np && auf) { np.innerHTML = nischeSVG(auf); bindeNische(); }
        moebel.querySelector('.c6w-ls-r-meister .c6w-ls-bild').innerHTML = meisterSVG();
        var nm = meister().length;
        moebel.querySelector('.c6w-ls-r-meister').setAttribute('aria-label', nm ? 'Deine Meister, ' + nm : 'Deine Meister. Wen bewunderst du?');
      }
      function stelle() {
        var neu = buehne.clientWidth < 600 ? 'hoch' : 'quer';
        if (neu === aufName) return;
        aufName = neu; auf = AUF[neu];
        LICHT = { x: auf.schacht[0], y: auf.schacht[1] };
        svg.setAttribute('viewBox', '0 0 ' + auf.w + ' ' + auf.h);
        zeichne();
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
        var m = auf.meister;
        moebel.style.left = (ox + m.x * skala) + 'px'; moebel.style.top = (oy + m.y * skala) + 'px';
        moebel.style.width = (m.w * skala) + 'px'; moebel.style.height = (m.h * skala) + 'px';
        moebel.style.setProperty('--bw', (m.w * skala) + 'px');
        var t = auf.tisch;
        schild.style.left = (ox + (t.x + t.w / 2) * skala) + 'px'; schild.style.top = (oy + (t.vorn + 7 + t.schuerze / 2) * skala) + 'px';
        schild.style.setProperty('--sk', skala);
        kEl.style.bottom = Math.max(unten, ueberFeld()) + 'px';
        licht();
        if (api.ansicht === 'tisch') faedenMalen();
      }
      // wie weit Feld und Dock von unten in die Bühne ragen (gemessen, falls --c6-unten das Feld nicht mitzählt)
      function ueberFeld() {
        var br = buehne.getBoundingClientRect(), top = br.bottom;
        [].forEach.call(document.querySelectorAll('.c6k-feld, .c6k-dock'), function (e) { var r = e.getBoundingClientRect(), cs = getComputedStyle(e); if (r.width > 40 && r.height > 10 && cs.display !== 'none' && cs.visibility !== 'hidden' && r.top < br.bottom && r.bottom > br.bottom - 260) top = Math.min(top, r.top); });
        return Math.max(0, Math.round(br.bottom - top + 6));
      }
      function carlMalen() {
        if (ctl || !C6.figur || !C6.figur.male) return;
        try { ctl = C6.figur.male(platz, { groesse: Math.round(auf.carlH * skala), stimmung: 'froh', teile: 5 }); if (C6.laden && C6.laden.an && ctl.kleid) ctl.kleid(C6.laden.an()); } catch (e) { ctl = null; }
      }
      function stimmung(s) { if (ctl && ctl.stimmung) try { ctl.stimmung(s); } catch (e) {} }

      // ——— Ansicht über dem Saal (Tisch oder Meister) ———
      function oeffneAnsicht(art) {
        api.ansicht = art;
        try { C6.schweig && C6.schweig(); } catch (e) {}
        kEl.hidden = false; kEl.setAttribute('data-ansicht', art); buehne.classList.add('c6w-ls-mitkarte');
        try { var un = parseFloat(getComputedStyle(buehne).getPropertyValue('--c6-unten')) || 0; kEl.style.bottom = Math.max(un, ueberFeld()) + 'px'; } catch (e) {}
        kSvg.style.display = art === 'tisch' ? 'none' : '';
        platte.hidden = art !== 'tisch';
        requestAnimationFrame(function () { kEl.classList.add('c6w-an'); });
      }
      function zeige(art, bild) {
        oeffneAnsicht(art);
        kg.innerHTML = '<rect x="-400" y="-400" width="1400" height="1500" fill="#2a1d14"/><ellipse cx="300" cy="140" rx="360" ry="260" fill="url(#c6w-ls-buchglanz)" opacity=".5"/>' +
          '<g transform="translate(120 70) scale(1.5)">' + bild.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g>';
        try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {}
        blatt.scrollTop = 0;
      }
      function zuSaal() {
        if (!api.ansicht && kEl.hidden) return;
        api.ansicht = null; api.karte = null; gewaehlt = null;
        kEl.classList.remove('c6w-an');
        buehne.classList.remove('c6w-ls-mitkarte');
        setTimeout(function () { if (!kEl.classList.contains('c6w-an')) kEl.hidden = true; }, 360);
        moebelMalen(); tischNeu();
        try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {}
      }
      function kopf(titel) { return '<h3 class="c6w-ls-name">' + esc(titel) + '</h3>'; }
      function wegNeu() { try { C6.faden && C6.faden.neu && C6.faden.neu(); } catch (e) {} }
      function zeigeIm(el) { if (!el) return; try { var r = el.getBoundingClientRect(), br = blatt.getBoundingClientRect(); blatt.scrollTo({ top: blatt.scrollTop + r.top - br.top - br.height / 3, behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) {} el.classList.remove('c6w-ls-blink'); void el.offsetWidth; el.classList.add('c6w-ls-blink'); }

      // ——— Der Tisch der Funde, von oben ———
      function herkunft(f) {
        var q = { feld: 'Ins Feld geschrieben', hineinlegen: 'Hingelegt', werkzeug: 'Aus einem Werkzeug' }[f.quelle] || (f.quelle ? kurz(f.quelle, 24) : 'Hingelegt');
        var art = { link: 'Link', youtube: 'Video', text: 'Text', zahlen: 'Zahlen', pdf: 'PDF', bild: 'Bild', datei: 'Datei' }[f.art] || 'Fund';
        var h = hostVon(f.url);
        return art + (h ? ' · ' + h : '') + ' · ' + q + ' · ' + wann(f.ts);
      }
      function zeichen(f) {
        if (f.art === 'link') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        if (f.art === 'youtube') return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3" fill="#b3261e"/><path d="M10 9.5v5l4.5-2.5Z" fill="#fff"/></svg>';
        if (f.art === 'zahlen') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17l5-5 4 3 7-8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        if (f.art === 'pdf' || f.art === 'bild' || f.art === 'datei') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7Z M14 3v4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 10h14M5 14h10M5 18h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      }
      function karteHTML(f, i) {
        var r = ((hashVon(f.id) % 7) - 3) * 0.8, an = f.id === gewaehlt;
        return '<button type="button" data-c6-ding class="c6w-ls-fk c6w-ls-fk-' + esc(f.art) + (f.urteil === 'stimmtNicht' ? ' c6w-ls-fk-nicht' : '') + '" data-f="' + esc(f.id) + '" aria-pressed="' + (an ? 'true' : 'false') + '" style="--r:' + r.toFixed(1) + 'deg;--i:' + i + '">' +
          '<span class="c6w-ls-fk-kopf"><i class="c6w-ls-fk-art">' + zeichen(f) + '</i><small>' + esc(datum(f.ts)) + '</small></span>' +
          '<b>' + esc(kurz(f.titel, 64)) + '</b>' +
          (f.zahlen && f.zahlen.length >= 2 ? '<span class="c6w-ls-fk-verlauf">' + verlaufSVG(f.zahlen, 100, 30, false) + '</span>' : '') +
          '<span class="c6w-ls-fk-fuss">' + (laeuft[f.id] ? '<em>Ich lese …</em>' : f.urteil === 'stimmt' ? '<em class="c6w-ls-ok">✓ stimmt</em>' : f.urteil === 'stimmtNicht' ? '<em class="c6w-ls-nein">stimmt so nicht</em>' : f.zus && f.zusWie === 'denk' ? '<em>Noch nicht geprüft</em>' : '') +
          (f.werkstatt ? '<em class="c6w-ls-ws">Werkstatt</em>' : '') + '</span></button>';
      }
      function platteMalen() {
        var fu = funde().reverse(), auf_ = fu.slice(0, AUF_DEM_TISCH), ids = {};
        auf_.forEach(function (f) { if (f.sid && spaceVon(f.sid)) ids[f.sid] = 'fest'; (f.vor || []).forEach(function (s) { if (spaceVon(s) && !ids[s]) ids[s] = 'vor'; }); });
        var sl = Object.keys(ids).slice(0, 5);
        stags.innerHTML = sl.map(function (sid) { var s = spaceVon(sid); return '<span class="c6w-ls-stag" data-s="' + esc(sid) + '" style="--f:' + esc(s.farbe || '#c9a24f') + '">' + esc(kurz(s.titel, 22)) + '</span>'; }).join('');
        stags.hidden = !sl.length;
        fks.innerHTML = auf_.map(karteHTML).join('') + '<button type="button" class="c6w-ls-fk c6w-ls-fk-neu" data-c6-ding data-neu="1"><span aria-hidden="true">+</span><b>Etwas hinlegen</b></button>';
        platte.classList.toggle('c6w-ls-kerzenlicht', !!L().kerze);
        requestAnimationFrame(faedenMalen);
      }
      // Fäden: fest zu den Spaces, in denen der Fund hängt; gestrichelt, wo Carl nur vorschlägt; fein zwischen verwandten Funden
      function faedenMalen() {
        if (platte.hidden) return;
        var pr = pinnen.getBoundingClientRect(), W = pinnen.scrollWidth, H = pinnen.scrollHeight, o = '';
        if (!pr.width) return;
        pfaeden.setAttribute('viewBox', '0 0 ' + W + ' ' + H); pfaeden.style.width = W + 'px'; pfaeden.style.height = H + 'px';
        function mitte(el, oben) { var r = el.getBoundingClientRect(); return [r.left - pr.left + r.width / 2, r.top - pr.top + (oben ? 4 : r.height / 2)]; }
        function unten(el) { var r = el.getBoundingClientRect(); return [r.left - pr.left + r.width / 2, r.bottom - pr.top - 2]; }
        var karten = {}; [].forEach.call(fks.querySelectorAll('[data-f]'), function (k) { karten[k.getAttribute('data-f')] = k; });
        var tags = {}; [].forEach.call(stags.querySelectorAll('[data-s]'), function (t) { tags[t.getAttribute('data-s')] = t; });
        var alle = funde();
        Object.keys(karten).forEach(function (id) {
          var f = fundVon(id); if (!f) return;
          var a = mitte(karten[id], true), an = id === gewaehlt;
          var ziele = [];
          if (f.sid && tags[f.sid]) ziele.push([f.sid, 'fest']);
          (f.vor || []).forEach(function (s) { if (s !== f.sid && tags[s]) ziele.push([s, 'vor']); });
          ziele.forEach(function (z) { var b = unten(tags[z[0]]), my = (a[1] + b[1]) / 2; o += '<path class="c6w-ls-pf c6w-ls-pf-' + z[1] + (an ? ' c6w-ls-pf-an' : '') + '" d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' C' + a[0].toFixed(1) + ' ' + my.toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + my.toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '"/>'; });
          verwandt(f, alle).forEach(function (r) {
            if (!karten[r.id] || id > r.id) return;
            var p = mitte(karten[id]), q2 = mitte(karten[r.id]), mx = (p[0] + q2[0]) / 2, my2 = (p[1] + q2[1]) / 2 + 18;
            o += '<path class="c6w-ls-pf c6w-ls-pf-fund' + (an || r.id === gewaehlt ? ' c6w-ls-pf-an' : '') + '" d="M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my2.toFixed(1) + ' ' + q2[0].toFixed(1) + ' ' + q2[1].toFixed(1) + '"/>';
          });
        });
        pfaeden.innerHTML = o;
      }
      function oeffneTisch(fid) {
        api.karte = null;
        oeffneAnsicht('tisch');
        var fu = funde();
        gewaehlt = fid && fundVon(fid) ? fid : (fu.length ? fu[fu.length - 1].id : null);
        platteMalen(); blattMalen();
        wegNeu();
        wPos = [27, 50]; pweg.innerHTML = ''; wSetzen(wPos);
        var ziel = gewaehlt;
        if (ziel) setTimeout(function () { if (api.ansicht === 'tisch' && gewaehlt === ziel) wandere(ziel, null); }, ruhig() ? 0 : 380);
        else wanderer.style.visibility = 'hidden';
        if (ziel) wanderer.style.visibility = '';
        // nur das Tuch scrollt zur Karte, nie die Seite
        if (fid) setTimeout(function () { var k = fks.querySelector('[data-f="' + fid + '"]'); if (k) { var r = k.getBoundingClientRect(), pr = platte.getBoundingClientRect(); if (r.bottom > pr.bottom || r.top < pr.top) platte.scrollTop += r.top - pr.top - 12; } }, 60);
      }
      // ——— Der Spaziergang über den Schreibtisch: Carl geht von Fund zu Fund, die Feder zieht den Weg in Tinte nach ———
      var wCtl = null, wPos = null, wRaf = 0, wNr = 0;
      function wGr() { return C6.geraet === 'computer' ? 74 : 56; }
      function wCarl() {
        if (!wCtl && C6.figur && C6.figur.male) { try { wCtl = C6.figur.male(wanderer, { groesse: wGr(), stimmung: 'froh', teile: 5, still: false }); if (C6.laden && C6.laden.an && wCtl.kleid) wCtl.kleid(C6.laden.an()); } catch (e) { wCtl = null; } }
        return wCtl;
      }
      function imTuch(el) { var r = el.getBoundingClientRect(), p = pinnen.getBoundingClientRect(); return { l: r.left - p.left, t: r.top - p.top, r: r.right - p.left, b: r.bottom - p.top, w: r.width, h: r.height }; }
      function standBei(id) { var k = id && fks.querySelector('[data-f="' + id + '"]'); if (!k) return null; var q = imTuch(k); return [q.r - q.w * 0.16, q.b + 2]; }
      function wSetzen(p) { wPos = p; wanderer.style.transform = 'translate(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px)'; }
      function wach(id) {
        var k = fks.querySelector('[data-f="' + id + '"]'); if (!k) return;
        k.classList.remove('c6w-ls-fk-wach'); void k.offsetWidth; k.classList.add('c6w-ls-fk-wach');
        try { if (wCtl) { wCtl.stimmung && wCtl.stimmung('froh'); if (wCtl.huepf && !ruhig()) wCtl.huepf(10); } } catch (e) {}
      }
      function tritt(x, y, w, links) {
        var e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'), o = links ? 3 : -3, nx = -Math.sin(w), ny = Math.cos(w);
        e.setAttribute('class', 'c6w-ls-tritt'); e.setAttribute('cx', (x + nx * o).toFixed(1)); e.setAttribute('cy', (y + ny * o).toFixed(1)); e.setAttribute('rx', '3'); e.setAttribute('ry', '1.7');
        e.setAttribute('transform', 'rotate(' + (w * 180 / Math.PI).toFixed(0) + ' ' + (x + nx * o).toFixed(1) + ' ' + (y + ny * o).toFixed(1) + ')');
        pweg.appendChild(e); setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 3200);
      }
      function wandere(zu, von) {
        var nr = ++wNr;
        if (!wCarl()) return;
        var b = standBei(zu); if (!b) return;
        var W = pinnen.scrollWidth, H = pinnen.scrollHeight;
        pweg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); pweg.style.width = W + 'px'; pweg.style.height = H + 'px';
        var a = wPos || (von && standBei(von)) || [18, 10];
        cancelAnimationFrame(wRaf);
        if (ruhig() || Math.hypot(b[0] - a[0], b[1] - a[1]) < 6) { wSetzen(b); wach(zu); return; }
        // ein Bogen über das Tuch, zwischen den Karten hindurch
        var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, bo = Math.min(60, l * 0.28);
        var c1 = [mx - dy / l * bo, my + dx / l * bo];
        var d = 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' Q' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
        [].forEach.call(pweg.querySelectorAll('.c6w-ls-tinte'), function (x) { x.classList.add('c6w-ls-tinte-alt'); setTimeout(function () { if (x.parentNode) x.parentNode.removeChild(x); }, 1600); });
        pweg.insertAdjacentHTML('beforeend', '<path class="c6w-ls-blei" d="' + d + '"/><path class="c6w-ls-tinte" d="' + d + '"/>' +
          '<g class="c6w-ls-feder"><path d="M0 0 L5 -9" stroke="#2b2722" stroke-width="1.6" stroke-linecap="round"/><path d="M3 -6 Q9 -30 32 -46 Q27 -22 7 -4 Z" fill="#f6ecd4" stroke="#2b2722" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 -8 Q14 -26 28 -40" fill="none" stroke="#8a7a5c" stroke-width=".9"/><circle r="2.2" fill="#7a1512"/></g>');
        var ps = pweg.querySelectorAll('.c6w-ls-tinte'), tinte = ps[ps.length - 1], fs = pweg.querySelectorAll('.c6w-ls-feder'), feder = fs[fs.length - 1], bl = pweg.querySelectorAll('.c6w-ls-blei');
        [].forEach.call(bl, function (x, i) { if (i < bl.length - 1 && x.parentNode) x.parentNode.removeChild(x); });
        [].forEach.call(fs, function (x, i) { if (i < fs.length - 1 && x.parentNode) x.parentNode.removeChild(x); });
        var L = 0; try { L = tinte.getTotalLength(); } catch (e) { L = l; }
        tinte.style.strokeDasharray = L + ' ' + L; tinte.style.strokeDashoffset = L;
        var ms = Math.round(Math.min(1700, 650 + L * 2.2)), t0 = performance.now(), spur = 0, fuss = 0, dir = b[0] >= a[0] ? 1 : -1;
        try { wCtl.stimmung && wCtl.stimmung('ruhig'); wCtl.blick && wCtl.blick(dir * 0.8, 0); wCtl.geh && wCtl.geh(dir * 60, ms, { y: 0 }); } catch (e) {}
        function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
        function schritt(jetzt) {
          if (nr !== wNr) return;
          var u = Math.min(1, (jetzt - t0) / ms), e = ease(u), lc = L * e, lf = Math.min(L, lc + 28);
          tinte.style.strokeDashoffset = (L - lf).toFixed(1);
          var pf = tinte.getPointAtLength(lf), pc = tinte.getPointAtLength(lc), pv = tinte.getPointAtLength(Math.min(L, lc + 3));
          feder.setAttribute('transform', 'translate(' + pf.x.toFixed(1) + ' ' + pf.y.toFixed(1) + ')');
          // die Figur macht ihre Schritte selbst (geh); der Behälter folgt dem Weg und zieht ihren Versatz ab
          var fx = 0, fy = 0; try { fx = wCtl.x || 0; fy = wCtl.y || 0; } catch (e) {}
          wanderer.style.transform = 'translate(' + (pc.x - fx).toFixed(1) + 'px,' + (pc.y - fy).toFixed(1) + 'px)'; wPos = [pc.x, pc.y];
          if (lc - spur > 13 && u < 0.96) { spur = lc; fuss = 1 - fuss; tritt(pc.x, pc.y, Math.atan2(pv.y - pc.y, pv.x - pc.x), !!fuss); }
          if (u < 1) wRaf = requestAnimationFrame(schritt);
          else { tinte.style.strokeDashoffset = 0; feder.classList.add('c6w-ls-feder-weg'); wSetzen(b); try { wCtl.geh && wCtl.geh(0, 0, { y: 0 }); wCtl.blick && wCtl.blick(); } catch (e) {} wach(zu); }
        }
        wRaf = requestAnimationFrame(schritt);
      }
      function waehle(id) {
        var vorher = gewaehlt;
        gewaehlt = id;
        requestAnimationFrame(function () { wandere(id, vorher); });
        [].forEach.call(fks.querySelectorAll('[data-f]'), function (k) { k.setAttribute('aria-pressed', k.getAttribute('data-f') === id ? 'true' : 'false'); });
        faedenMalen(); blattMalen(); blatt.scrollTop = 0;
        var f = fundVon(id); api.karte = f ? kurz(f.titel, 24) : null; wegNeu();
      }
      fks.addEventListener('click', function (e) {
        var k = e.target.closest('.c6w-ls-fk'); if (!k) return;
        e.stopPropagation();
        if (k.dataset.neu) { oeffneHineinlegen(); return; }
        waehle(k.getAttribute('data-f'));
      });
      // die Space-Etiketten am Tuch sind nur Beschriftung: ein Tipp darauf zählt als leere Stelle
      // Tipp auf eine leere Stelle der Ansicht (Tuch, Rand) schließt sie
      kEl.addEventListener('click', function (e) {
        if (!api.ansicht) return;
        var t = e.target;
        if (t === kEl || t.classList.contains('c6w-ls-kbild') || t === platte || t === pinnen || t === fks || t === stags || t === kSvg) zuSaal();
      });
      function blattMalen() {
        var f = gewaehlt && fundVon(gewaehlt);
        if (!f) {
          blatt.innerHTML = kopf('Dein Tisch der Funde') +
            '<p class="c6w-ls-carlk c6w-ls-intro">Was du mir tagsüber schickst, leg ich hier hin. Ich fasse zusammen, du sagst, ob es stimmt.</p>' +
            '<ul class="c6w-ls-wege"><li><i>' + zeichen({ art: 'link' }) + '</i><span><b>Ein Satz mit Link</b><small>„Das will ich lesen: https://…“</small></span></li>' +
            '<li><i>' + zeichen({ art: 'text' }) + '</i><span><b>Ein Text</b><small>Ein Absatz aus einem Buch, einer Zeitung, einer Nachricht</small></span></li>' +
            '<li><i>' + zeichen({ art: 'zahlen' }) + '</i><span><b>Eine Zahlenreihe</b><small>Daraus zeichne ich einen kleinen Verlauf</small></span></li></ul>' +
            '<p class="c6w-leise">Schreib es einfach ins Feld unten. Oder leg es gleich hier hin.</p>' +
            '<button class="c6w-knopf c6w-haupt c6w-ls-hin">Etwas hinlegen</button>';
          blatt.querySelector('.c6w-ls-hin').onclick = function () { oeffneHineinlegen(); };
          return;
        }
        var sp = f.sid && spaceVon(f.sid), vor = (f.vor || []).filter(function (s) { return s !== f.sid && spaceVon(s); }), rel = verwandt(f);
        var h = '<p class="c6w-ls-schritt">' + esc(herkunft(f)) + '</p>' + kopf(f.titel);
        if (f.zahlen && f.zahlen.length >= 2) {
          var w = f.zahlen, mx = Math.max.apply(null, w), mn = Math.min.apply(null, w);
          h += '<figure class="c6w-ls-verlauf"><div class="c6w-ls-vbild">' + verlaufSVG(w, 360, 120, true) + '</div>' +
            '<figcaption><span>' + w.length + ' Zahlen' + (f.marken ? ' · ' + esc(f.marken[0]) + '–' + esc(f.marken[f.marken.length - 1]) : '') + '</span><span>von <b>' + zahlText(w[0]) + '</b> bis <b>' + zahlText(w[w.length - 1]) + '</b></span><span><i class="c6w-ls-p-hoch"></i>höchste ' + zahlText(mx) + '</span><span><i class="c6w-ls-p-tief"></i>tiefste ' + zahlText(mn) + '</span></figcaption></figure>';
        }
        if (f.seltsam || f.unsichtbar) h += '<p class="c6w-ls-seltsam">' + (f.seltsam ? 'Im Text steht etwas, das wie ein Befehl an mich klingt. Ich befolge so etwas nie, es bleibt Material.' : 'Im Text waren unsichtbare Zeichen. Die hab ich weggelassen.') + '</p>';
        // Carls Zusammenfassung: Tinte, wenn er mitgedacht hat; Bleistift, wenn nicht
        if (laeuft[f.id] && !f.zus) h += '<div class="c6w-ls-zus c6w-lesend"><span class="c6w-ls-wer">Carl liest</span><p>Ich lese<span class="c6w-punkte" aria-hidden="true"><i></i><i></i><i></i></span></p></div>';
        else if (f.zus) h += '<div class="c6w-ls-zus c6w-ls-zus-' + (f.zusWie === 'denk' ? 'tinte' : 'bleistift') + (f.urteil === 'stimmtNicht' ? ' c6w-ls-zus-nicht' : '') + '"><span class="c6w-ls-wer">' + (f.zusWie === 'denk' ? (f.url ? 'Carl fasst zusammen, nur aus deinem Satz' : 'Carl fasst zusammen') : 'Carl, mit Bleistift') + '</span><p>' + esc(f.zus) + '</p>' +
          (f.zusNotiz ? '<small>' + esc(f.zusNotiz) + '</small>' : '') + (f.urteil === 'stimmtNicht' && f.korrektur ? '<p class="c6w-ls-korr">' + esc(f.korrektur) + '</p>' : '') + '</div>';
        if (f.zus && f.zusWie !== 'denk' && !f.urteil) h += '<p class="c6w-leise c6w-ls-ohne">Prüfen kannst du, sobald ich mitdenken darf. Bis dahin zähle ich nur.</p>';
        if (f.zus && (f.zusWie === 'denk' || f.urteil)) h += '<div class="c6w-ls-urteil" role="group" aria-label="Stimmt das?"><button type="button" class="c6w-ls-u" data-u="stimmt" aria-pressed="' + (f.urteil === 'stimmt') + '">Stimmt</button><button type="button" class="c6w-ls-u" data-u="stimmtNicht" aria-pressed="' + (f.urteil === 'stimmtNicht') + '">Stimmt so nicht</button></div>' +
          (f.urteil === 'stimmtNicht' ? '<label class="c6w-lab" for="c6w-ls-korr">Was stimmt nicht? In deinen Worten</label><textarea id="c6w-ls-korr" class="c6w-feld c6w-hand" rows="2" maxlength="300">' + esc(f.korrektur || '') + '</textarea>' : '');
        // Eine leichte Frage: wofür Otto es wiederfinden will. Die Wahl hängt den Fund als Zettel in den Space (nur auf seinen Tipp).
        if (sp) h += '<p class="c6w-ls-ort">Wiederzufinden in „' + esc(kurz(sp.titel, 30)) + '“, dort hängt er als Zettel</p>';
        else {
          var wahl = vor.slice(0, 2); zuletzt().forEach(function (x) { if (wahl.length < 3 && wahl.indexOf(x.id) < 0) wahl.push(x.id); });
          h += '<p class="c6w-ls-frage2">Wofür willst du das wiederfinden?</p><div class="c6w-ls-flinks">' +
            wahl.map(function (s2) { return '<button type="button" class="c6w-ls-w' + (vor.indexOf(s2) >= 0 ? ' c6w-ls-vor' : '') + '" data-s="' + esc(s2) + '"><i style="background:' + esc(spaceVon(s2).farbe || '#c9a24f') + '"></i>' + esc(kurz(spaceVon(s2).titel, 24)) + '</button>'; }).join('') +
            '<button type="button" class="c6w-ls-w c6w-ls-wneu">Neuer Space</button></div>' +
            (vor.length ? '<p class="c6w-leise c6w-ls-wwarum">Gestrichelt: mein Vorschlag' + (f.hier && vor.indexOf(f.hier) >= 0 ? ', weil du gerade dort warst.' : ', nach gleichen Wörtern.') + '</p>' : '');
        }
        if (rel.length) h += '<ul class="c6w-ls-rel">' + rel.map(function (r) { var g2 = fundVon(r.id); return '<li><button type="button" data-zu="' + esc(r.id) + '"><b>' + esc(kurz(g2.titel, 48)) + '</b><small>' + esc(r.grund) + '</small></button></li>'; }).join('') + '</ul>';
        // In die Werkstatt geben: nur auf Ottos Tipp; steht klebend unten im Blatt, nie unter Feld oder Dock
        var fuss = f.werkstatt ? '<div class="c6w-ls-ws-da"><p>Liegt in der Werkstatt, seit ' + esc(wann(f.werkstatt)) + '.</p><button type="button" class="c6w-knopf c6w-leicht c6w-ls-wshin">Hingehen</button></div>'
          : '<button type="button" class="c6w-knopf c6w-haupt c6w-ls-gib">In die Werkstatt geben</button><p class="c6w-leise c6w-ls-gibwarum">Damit die Werkstatt versteht, was du bauen willst.</p>';
        h += '<details class="c6w-ls-roh"><summary>Was du geschickt hast</summary>' + (material(f) && f.art !== 'link' && f.art !== 'youtube' ? '<p>' + esc(f.text || f.notiz || '') + '</p>' : (f.text || f.notiz ? '<p>' + esc(f.text || f.notiz) + '</p>' : '')) +
          (f.url ? '<a class="c6w-knopf c6w-leicht" href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">Öffnen</a>' : '') + (f.datei && f.datei.name ? '<p class="c6w-ls-fmeta">' + esc(f.datei.name) + ' · ' + esc(groesseText(f.datei.groesse || 0)) + '</p>' : '') + '</details>';
        h += '<button type="button" class="c6w-knopf c6w-leicht c6w-ls-fweg">Weglegen</button>';
        h += '<div class="c6w-ls-efuss c6w-ls-wsfuss">' + fuss + '</div>';
        blatt.innerHTML = h;
        [].forEach.call(blatt.querySelectorAll('.c6w-ls-u'), function (b) { b.onclick = function () { urteil(f.id, b.dataset.u); }; });
        var ko = blatt.querySelector('#c6w-ls-korr');
        if (ko) { ko.oninput = function () { var v = rein(ko.value).slice(0, 300); setzeFund(f.id, function (q) { q.korrektur = v; }); }; ko.onchange = function () { melden(f.id, 'urteil'); }; }
        [].forEach.call(blatt.querySelectorAll('.c6w-ls-w[data-s]'), function (b) { b.onclick = function () { haenge(f.id, b.dataset.s); }; });
        var wneu = blatt.querySelector('.c6w-ls-wneu'); if (wneu) wneu.onclick = function () { var sid = null; try { sid = C6.space.neu(f.titel, { oeffnen: false }); } catch (e) { sid = null; } if (sid) haenge(f.id, sid); };
        [].forEach.call(blatt.querySelectorAll('[data-zu]'), function (b) { b.onclick = function () { waehle(b.dataset.zu); }; });
        var gib = blatt.querySelector('.c6w-ls-gib'); if (gib) gib.onclick = function () { gibInDieWerkstatt(f.id); };
        var wsh = blatt.querySelector('.c6w-ls-wshin'); if (wsh) wsh.onclick = function () { C6.geh('werkstatt'); };
        var weg = blatt.querySelector('.c6w-ls-fweg');
        weg.onclick = function () {
          if (!weg.dataset.ja) { weg.dataset.ja = '1'; weg.textContent = 'Ja, weglegen'; return; }
          aendere(function (l) { l.funde = (l.funde || []).filter(function (q) { return q.id !== f.id; }); });
          melden(f.id, 'weg');
          var rest = funde(); gewaehlt = rest.length ? rest[rest.length - 1].id : null;
          platteMalen(); blattMalen(); tischNeu();
        };
      }
      function urteil(id, u) {
        var f = fundVon(id); if (!f) return;
        var neu = f.urteil === u ? null : u;
        setzeFund(id, function (q) { q.urteil = neu; q.urteilTs = neu ? Date.now() : null; });
        melden(id, 'urteil');
        stimmung(neu === 'stimmt' ? 'froh' : 'ruhig');
        platteMalen(); blattMalen(); tischNeu();
        if (neu === 'stimmtNicht') setTimeout(function () { var k = blatt.querySelector('#c6w-ls-korr'); if (k) { try { k.focus({ preventScroll: true }); } catch (e) {} zeigeIm(k); } }, 80);
      }
      function haenge(id, sid) {
        var f = fundVon(id), s = spaceVon(sid); if (!f || !s) return;
        var text = [f.url || (f.datei && f.datei.name) || '', f.art === 'zahlen' ? (f.zahlen || []).map(zahlText).join(' · ') : '', f.urteil !== 'stimmtNicht' && f.zus && f.zusWie === 'denk' ? f.zus : '', f.notiz || ''].filter(Boolean).join('\n');
        var ok = null;
        try { ok = C6.space ? (C6.space.zettel ? C6.space.zettel(sid, kurz(f.titel, 60) + (text ? '\n' + kurz(text, 400) : ''), { von: 'fund' }) : C6.space.legeHin ? C6.space.legeHin(sid, { art: 'zettel', titel: kurz(f.titel, 60), text: text, von: 'fund' }) : null) : null; } catch (e) { ok = null; }
        if (!ok) { if (C6.sag) C6.sag('Das hat nicht geklappt. Es ist nichts verloren.'); return; }
        setzeFund(id, function (q) { q.sid = sid; });
        melden(id, 'space'); stimmung('froh');
        if (api.ansicht === 'tisch') { platteMalen(); blattMalen(); }
        Promise.resolve(C6.frag ? C6.frag('Hängt als Zettel in „' + s.titel + '“.', [{ text: 'Hingehen', wert: 'hin' }], { frei: false, leise: true, id: 'c6w-ls-hin' }) : null).then(function (w) { if (w === 'hin' && C6.space && C6.space.oeffne) C6.space.oeffne(sid); });
      }
      function gibInDieWerkstatt(id) {
        var f = fundVon(id); if (!f) return;
        setzeFund(id, function (q) { q.werkstatt = Date.now(); });
        melden(id, 'werkstatt'); stimmung('froh');
        if (api.ansicht === 'tisch') { platteMalen(); blattMalen(); }
        tischNeu();
        // eine Frage zur Zeit: erst Ottos Ja, dann zeigt die Werkstatt, was sich daraus bauen lässt – dort, nicht über dem Tisch
        Promise.resolve(C6.frag ? C6.frag('Liegt jetzt in der Werkstatt. Soll ich dir dort zeigen, was sich daraus bauen lässt?', [{ text: 'Ja, zeig es mir', wert: 'zeig' }, { text: 'Später', wert: 'spaeter' }], { frei: false, leise: true, id: 'c6w-ls-ws' }) : null).then(function (w) {
          if (w !== 'zeig') return;
          var g = fundVon(id); if (!g) return;
          // erst wenn die Werkstatt wirklich da ist (Raumwechsel kann dauern), genau einmal
          var gezeigtWs = false;
          function zeigDort() {
            if (gezeigtWs || C6.jetzt !== 'werkstatt') return; gezeigtWs = true;
            try {
              if (C6.darstellung && typeof C6.darstellung.frag === 'function')
                C6.darstellung.frag('Zeig mir den Fund „' + kurz(g.titel, 60) + '“ so, dass ich sehe, was ich daraus bauen kann.', { daten: [datenVon(g)], sid: g.sid || (g.vor || [])[0] || null, bezug: { fund: id, titel: g.titel }, quelle: 'lesesaal' });
            } catch (e) {}
          }
          try { C6.geh('werkstatt'); } catch (e) {}
          [ruhig() ? 120 : 520, 1200, 2500].forEach(function (ms) { setTimeout(zeigDort, ms); });
        });
      }
      // Ein Fund wird ein Zettel in einem Space. Carl schlägt vor, du wählst (höchstens drei).
      function inSpace(f, vorschlag) {
        if (!f) return;
        var reihe = zuletzt(), opts = [];
        if (vorschlag && spaceVon(vorschlag)) opts.push({ text: 'In „' + kurz(spaceVon(vorschlag).titel, 26) + '“ hängen', wert: vorschlag });
        reihe.forEach(function (s) { if (opts.length < 2 && s.id !== vorschlag) opts.push({ text: 'In „' + kurz(s.titel, 26) + '“ hängen', wert: s.id }); });
        opts.push({ text: 'Neuer Space', wert: '__neu' });
        Promise.resolve(C6.frag ? C6.frag(f.satz || 'In welchen Space soll das?', opts, { frei: false, leise: true, id: 'c6w-ls-space' }) : null).then(function (sid) {
          if (!sid) return;
          if (sid === '__neu') { try { sid = C6.space.neu(f.titel, { oeffnen: false }); } catch (e) { sid = null; } }
          if (sid) haenge(f.id, sid);
        });
      }
      var assetsNs = null, assetsGefragt = false;
      function assetsHol() {
        if (assetsGefragt) return Promise.resolve(assetsNs);
        assetsGefragt = true;
        try { if (!window.claude || !window.claude.use) return Promise.resolve(null); } catch (e) { return Promise.resolve(null); }
        return Promise.race([Promise.resolve(window.claude.use('assets')), new Promise(function (r) { setTimeout(function () { r(null); }, 4000); })])
          .then(function (a) { assetsNs = a || null; return assetsNs; }, function () { return null; });
      }
      function oeffneHineinlegen() {
        oeffneTisch(gewaehlt);
        api.karte = 'Hinlegen'; wegNeu();
        var art = 'link';
        blatt.innerHTML = kopf('Etwas hinlegen') +
          '<div class="c6w-arten" role="radiogroup" aria-label="Art"><button type="button" role="radio" data-a="link" aria-checked="true">Link</button><button type="button" role="radio" data-a="text" aria-checked="false">Text oder Zahlen</button><button type="button" role="radio" data-a="datei" aria-checked="false">PDF oder Bild</button></div>' +
          '<form class="c6w-ls-eform"><div class="c6w-ls-elink"><label class="c6w-lab" for="c6w-ls-url">Adresse</label><input id="c6w-ls-url" class="c6w-feld" type="url" inputmode="url" placeholder="https://…" autocomplete="off"></div>' +
          '<div class="c6w-ls-etext" hidden><label class="c6w-lab" for="c6w-ls-text">Text oder Zahlen</label><textarea id="c6w-ls-text" class="c6w-feld" rows="5" maxlength="6000" placeholder="Ein Absatz, eine Nachricht – oder Zahlen, z. B. 182, 185, 181, 190"></textarea></div>' +
          '<div class="c6w-ls-edatei" hidden><label class="c6w-lab" for="c6w-ls-datei">Datei</label><input id="c6w-ls-datei" class="c6w-feld" type="file" accept="application/pdf,image/*"><p class="c6w-leise c6w-ls-ehrlich"></p></div>' +
          '<label class="c6w-lab" for="c6w-ls-titel">Titel</label><input id="c6w-ls-titel" class="c6w-feld" maxlength="120" autocomplete="off">' +
          '<div class="c6w-ls-enotiz"><label class="c6w-lab" for="c6w-ls-notiz">Warum hebst du es auf?</label><textarea id="c6w-ls-notiz" class="c6w-feld" rows="2" maxlength="400"></textarea></div>' +
          '<div class="c6w-ls-efuss"><button class="c6w-knopf c6w-haupt" type="submit">Auf den Tisch legen</button></div></form>';
        var ehrlich = blatt.querySelector('.c6w-ls-ehrlich');
        assetsHol().then(function (a) { if (blatt.contains(ehrlich)) ehrlich.textContent = a ? 'Ich lege die Datei in die Ablage dieser Seite. Lesen kann ich sie nicht, nur Name und deine Notiz.' : 'Hier gibt es keine Ablage für Dateien. Ich merke mir Name, Art und Größe, die Datei bleibt bei dir.'; });
        [].forEach.call(blatt.querySelectorAll('[data-a]'), function (x) {
          x.onclick = function () { art = x.dataset.a; [].forEach.call(blatt.querySelectorAll('[data-a]'), function (y) { y.setAttribute('aria-checked', y === x); }); blatt.querySelector('.c6w-ls-elink').hidden = art !== 'link'; blatt.querySelector('.c6w-ls-etext').hidden = art !== 'text'; blatt.querySelector('.c6w-ls-edatei').hidden = art !== 'datei'; blatt.querySelector('.c6w-ls-enotiz').hidden = art === 'text'; };
        });
        if (C6.geraet === 'computer') setTimeout(function () { var u = blatt.querySelector('#c6w-ls-url'); if (u) u.focus(); }, 300);
        blatt.querySelector('form').onsubmit = function (e) {
          e.preventDefault();
          var url = rein(blatt.querySelector('#c6w-ls-url').value).replace(/\s+/g, ''), file = (blatt.querySelector('#c6w-ls-datei').files || [])[0];
          var titel = rein(blatt.querySelector('#c6w-ls-titel').value), notiz = rein(blatt.querySelector('#c6w-ls-notiz').value);
          if (art === 'text') {
            var tx = blatt.querySelector('#c6w-ls-text').value;
            var nf = fundAnlegen(tx, { quelle: 'hineinlegen', titel: titel });
            if (!nf) { if (C6.sag) C6.sag('Da steht noch nichts. Schreib oder kleb etwas hinein.'); blatt.querySelector('#c6w-ls-text').focus(); return; }
            stimmung('froh'); tischNeu(); oeffneTisch(nf.id);
            return;
          }
          if (art === 'link' && !/^https?:\/\/\S+\.\S+/i.test(url)) { if (C6.sag) C6.sag('Die Adresse beginnt mit https://. Dann kann ich sie hinlegen.'); blatt.querySelector('#c6w-ls-url').focus(); return; }
          if (art === 'datei' && !file) { if (C6.sag) C6.sag('Such mir erst eine Datei aus.'); return; }
          var f = { id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ts: Date.now(), notiz: kurz(notiz, 400), quelle: 'hineinlegen' };
          if (art === 'link') {
            var yt = ytId(url), host = hostVon(url); f.art = yt ? 'youtube' : 'link'; f.url = url;
            f.titel = kurz(titel || (yt ? 'Video auf YouTube' : host + ' · ' + kurz(url.replace(/^https?:\/\/[^/]+/, ''), 40)), 90);
          } else {
            f.art = /pdf/i.test(file.type) || /\.pdf$/i.test(file.name) ? 'pdf' : (/^image\//.test(file.type) ? 'bild' : 'datei');
            f.titel = kurz(titel || rein(file.name).replace(/\.[a-z0-9]+$/i, ''), 90);
            f.datei = { name: kurz(rein(file.name), 80), typ: file.type || '', groesse: file.size || 0 };
          }
          f.seltsam = BEFEHL_ROH.test(f.titel + ' ' + notiz);
          var knopf = blatt.querySelector('form [type=submit]'); knopf.disabled = true; knopf.textContent = 'Ich schau es mir an …'; stimmung('denkt');
          var ablage = art === 'datei' ? assetsHol().then(function (a) {
            if (!a || !a.upload) return null;
            return Promise.resolve(a.upload(file)).then(function (r) { if (r && r.url) { f.datei.url = r.url; f.datei.id = r.id; } return r; }, function () { return null; });
          }) : Promise.resolve(null);
          var reihe = zuletzt().slice(0, 8), sp = S().spaces || {};
          // Die Spaces sind Ottos eigene Wörter, der Fund ist fremdes Material: er geht nur als <fund> über daten an das Modell
          var frage = reihe.length ? 'Welcher dieser Spaces passt am besten zu dem Fund im Material unten? Spaces: ' + reihe.map(function (s) { return s.id + ' = „' + s.titel + '“' + ((sp[s.id] || {}).kern ? ' (Kernsatz: ' + sp[s.id].kern + ')' : ''); }).join('; ') + '.\n' +
            'Du kennst den Inhalt nicht, nur Titel, Adresse und Notiz. Erfinde nichts. Antworte in genau einer Zeile: space-id oder neu | ein Satz an den Menschen auf Deutsch, höchstens 16 Wörter.' : '';
          var daten = [{ art: 'fund', titel: f.titel, quelle: f.url || (f.datei && f.datei.name) || '', text: (notiz ? 'Notiz: ' + notiz : '(keine Notiz)') }];
          Promise.all([ablage, frage ? denk(frage, daten) : Promise.resolve('')]).then(function (x) {
            var z = String(x[1] || '').split('\n').filter(function (l) { return l.indexOf('|') > 0; })[0] || '', teile = z.split('|'), id = (teile[0] || '').trim();
            var vorschlag = null;
            var nurDiese = reihe.map(function (r) { return r.id; });
            if (nurDiese.indexOf(id) >= 0 && spaceVon(id) && teile[1]) { vorschlag = id; f.satz = carlSatz(teile[1], spaceVon(id)); f.wie = 'denk'; }
            else {
              var w = woerter(f.titel + ' ' + notiz + ' ' + (f.url || '')), best = null, bs = 0;
              reihe.forEach(function (s) { var n = 0; woerter(s.titel + ' ' + ((sp[s.id] || {}).kern || '')).forEach(function (q) { if (w.indexOf(q) >= 0) n++; }); if (n > bs) { bs = n; best = s; } });
              if (best) { vorschlag = best.id; f.satz = 'Hier kann ich nicht mitdenken. Nach den Wörtern passt es zu „' + best.titel + '“.'; }
              else f.satz = reihe.length ? 'In welchen Space soll das?' : 'Daraus machen wir deinen ersten Space.';
            }
            if (vorschlag) f.vor = [vorschlag];
            aendere(function (l) { l.funde = (l.funde || []).concat([f]).slice(-200); });
            melden(f.id, 'neu');
            stimmung('froh'); tischNeu();
            oeffneTisch(f.id);
            zusammenfassen(f.id);
            inSpace(f, vorschlag);
          });
        };
      }

      // ——— Deine Meister ———
      function oeffneMeister(mid, neu) {
        var m = meister();
        api.karte = null;
        zeige('meister', skizzenwandSVG());
        if (mid) { meisterKarte(mid); return; }
        if (neu) setTimeout(function () { var i = blatt.querySelector('#c6w-ls-mname'); if (i) { try { i.focus({ preventScroll: true }); } catch (e) { i.focus(); } zeigeIm(i.closest('form')); } }, 420);
        blatt.innerHTML = kopf('Deine Meister') + '<p class="c6w-ls-carlk c6w-ls-intro">Menschen, von denen du lernen willst. Berühmt oder nah.</p>' +
          (m.length ? '<ul class="c6w-mliste">' + m.map(function (x) { return '<li><button data-m="' + esc(x.id) + '"><i>' + esc(ini(x)) + '</i><span><b>' + esc(x.name || 'Ohne Namen') + '</b><small>' + esc(kurz(x.zieht || x.haltung || '', 60)) + '</small></span></button></li>'; }).join('') + '</ul>' : '') +
          (m.length < MAX_MEISTER ? '<form class="c6w-ls-mneu"><label class="c6w-lab" for="c6w-ls-mname">Wen bewunderst du?</label><input id="c6w-ls-mname" class="c6w-feld c6w-hand" maxlength="40" placeholder="Eine Lehrerin, ein Großvater …" autocomplete="off"><button class="c6w-knopf c6w-haupt" type="submit">Ins Regal stellen</button></form>' : '<p class="c6w-leise">Zehn stehen. Für einen neuen nimm erst einen heraus.</p>');
        [].forEach.call(blatt.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { meisterKarte(b.dataset.m); }; });
        var form = blatt.querySelector('.c6w-ls-mneu');
        if (form) form.onsubmit = function (e) {
          e.preventDefault();
          var name = form.querySelector('input').value.trim(); if (!name) { form.querySelector('input').focus(); return; }
          var neu = { id: 'm' + Date.now().toString(36), name: kurz(name, 40), regal: 'lehre', ts: Date.now() };
          setzeMeister(function (a) { a.push(neu); });
          moebelMalen(); stimmung('froh');
          meisterKarte(neu.id);
        };
      }
      function meisterKarte(mid) {
        var m = meister().filter(function (x) { return x.id === mid; })[0];
        if (!m) { oeffneMeister(); return; }
        zeige('meister', skizzenwandSVG());
        function feld(lab, key, lang, platzhalter) {
          return '<label class="c6w-lab" for="c6w-ls-m-' + key + '">' + esc(lab) + '</label>' + (lang ? '<textarea id="c6w-ls-m-' + key + '" data-k="' + key + '" class="c6w-feld c6w-hand" rows="2" maxlength="300"' + (platzhalter ? ' placeholder="' + esc(platzhalter) + '"' : '') + '>' + esc(m[key] || '') + '</textarea>' : '<input id="c6w-ls-m-' + key + '" data-k="' + key + '" class="c6w-feld c6w-hand" maxlength="80" value="' + esc(m[key] || '') + '"' + (platzhalter ? ' placeholder="' + esc(platzhalter) + '"' : '') + '>');
        }
        api.karte = kurz(m.name || 'Meister', 24); wegNeu();
        blatt.innerHTML = '<h3 class="c6w-ls-name">' + esc(m.name || 'Meister') + '</h3>' +
          feld('Name', 'name') + feld('Was dich anzieht, in deinen Worten', 'zieht', true) + feld('Die Haltung in einem Satz', 'haltung', true) +
          feld('Ein Zitat, wörtlich', 'zitat', true, 'Nur, wenn du es wörtlich hast.') + feld('Quelle', 'quelle', false, 'Buch, Jahr, Seite') + '<p class="c6w-leise c6w-ls-zh" aria-live="polite"></p>' +
          '<div class="c6w-ls-mfrage"><p class="c6w-ls-mfrage-satz">' + esc(satz('bib.meisterFrage', 'Und du? Was davon ist schon in dir?')) + '</p>' + feld('Deine Antwort', 'du', true) + '</div>' +
          '<button class="c6w-knopf c6w-leicht c6w-ls-mraus">Aus dem Regal nehmen</button>';
        blatt.scrollTop = 0;
        var zh = blatt.querySelector('.c6w-ls-zh');
        function hinweis() { var x = meister().filter(function (q) { return q.id === mid; })[0] || {}; zh.textContent = x.zitat && !String(x.quelle || '').trim() ? 'Ohne Quelle steht es als sinngemäß da.' : ''; }
        hinweis();
        [].forEach.call(blatt.querySelectorAll('[data-k]'), function (f) {
          f.oninput = function () { var v = f.value, k = f.dataset.k; setzeMeister(function (a) { a.forEach(function (x, i) { if (x.id === mid) { var y = Object.assign({}, x); y[k] = v; a[i] = y; } }); }); hinweis(); };
          f.onchange = moebelMalen;
        });
        var raus = blatt.querySelector('.c6w-ls-mraus');
        raus.onclick = function () {
          if (!raus.dataset.ja) { raus.dataset.ja = '1'; raus.textContent = 'Ja, herausnehmen'; return; }
          setzeMeister(function (a) { for (var i = a.length - 1; i >= 0; i--) if (a[i].id === mid) a.splice(i, 1); });
          moebelMalen(); oeffneMeister();
        };
      }

      // ——— Antippen ———
      moebel.addEventListener('click', function (e) {
        var r = e.target.closest('.c6w-ls-regal'); if (!r) return;
        var p = e.target.closest('[data-m]'), mid = p ? p.getAttribute('data-m') : null;
        if (mid === 'platz') { stimmung('froh'); if (C6.sag) C6.sag(satz('lesesaal.platz', 'Der bleibt leer. Das ist dein Platz.'), { merken: false }); return; }
        oeffneMitRegal(r, function () { oeffneMeister(null, mid === 'ovale' && meister().length < 5); });
      });
      halten(moebel.querySelector('.c6w-ls-r-meister'), function (el, o) {
        var t = o && document.elementFromPoint ? document.elementFromPoint(o.x, o.y) : null, p = t && t.closest ? t.closest('[data-m]') : null;
        staune(p && p.getAttribute('data-m') === 'platz' ? 'lesesaal.platz' : 'lesesaal.portraet');
      });
      // Das gewählte Regal tritt vor, dann stehst du davor
      function oeffneMitRegal(el, dann) {
        if (C6.ruhig || !el.animate) { dann(); return; }
        var r = el.getBoundingClientRect(), br = buehne.getBoundingClientRect();
        var s = Math.min(2.6, (br.height * 0.6) / r.height), dx = (br.left + br.width / 2) - (r.left + r.width / 2), dy = (br.top + br.height * 0.42) - (r.top + r.height / 2);
        moebel.classList.add('c6w-ls-waehlt'); el.classList.add('c6w-ls-offen');
        var an = el.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }], { duration: 600, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'forwards' });
        setTimeout(dann, 480);
        an.onfinish = function () { setTimeout(function () { try { an.cancel(); } catch (e) {} el.classList.remove('c6w-ls-offen'); moebel.classList.remove('c6w-ls-waehlt'); }, 420); };
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && api.ansicht && C6.jetzt === 'lesesaal') { e.stopPropagation(); e.preventDefault(); zuSaal(); }
      }, true);
      if (C6.bus) {
        C6.bus.on('kleid', function () { if (ctl && ctl.kleid && C6.laden && C6.laden.an) ctl.kleid(C6.laden.an()); });
        // Tipp auf eine leere Stelle: Karte, Blatt, Tisch-Ansicht schließen
        C6.bus.on('leer', function (e) { if (C6.jetzt === 'lesesaal' && api.ansicht && (!e || !e.raum || e.raum === 'lesesaal')) zuSaal(); });
        C6.bus.on('fund', function (d) {
          if (!auf) return;
          tischNeu();
          if (api.ansicht === 'tisch' && d && d.was !== 'urteil') {
            var fokus = document.activeElement && blatt.contains(document.activeElement) && /INPUT|TEXTAREA/.test(document.activeElement.tagName);
            platteMalen(); if (!fokus && api.karte !== 'Hinlegen' && (d.id === gewaehlt || !gewaehlt)) blattMalen();
          }
        });
      }
      buehne.classList.add('c6m-still');
      var ro = window.ResizeObserver ? new ResizeObserver(function () { groesse(); }) : null;
      if (ro) ro.observe(buehne);

      api.zuSaal = zuSaal; api.einordnen = oeffneHineinlegen; api.tisch = oeffneTisch; api.meister = oeffneMeister;
      saal = { tischNeu: tischNeu };
      return {
        betreten: function (o) {
          o = o || {};
          var warte = null;
          // Kommt Otto durch die Geheimtür, ohne dass die Bibliothek den Abstieg schon spielt: hier spielen, der Saal wartet darunter
          if (o.durch && !hinabLauf && !o.sofort) warte = hinab(null, { schon: true });
          else if (hinabLauf) warte = hinabLauf.p;
          buehne.classList.remove('c6m-still');
          groesse(); carlMalen(); moebelMalen(); tischNeu();
          if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'lesesaal');
          groesse();
          function dann(fn, ms) { if (warte) warte.then(function () { setTimeout(fn, ms); }); else setTimeout(fn, ms); }
          if (o.einordnen) dann(oeffneHineinlegen, 200);
          else if (o.fund) dann(function () { oeffneTisch(typeof o.fund === 'string' ? o.fund : null); }, 200);
          else if (o.funde) dann(function () { oeffneTisch(); }, 200);
          else if (o.meister) dann(function () { oeffneMeister(typeof o.meister === 'string' ? o.meister : null); }, 200);
          else if (!o.still) {
            var erst = !L().gesehen;
            if (erst) aendere(function (l) { l.gesehen = Date.now(); });
            var offen = funde().filter(function (f) { return f.zus && !f.urteil; }).length;
            var t = erst ? satz('lesesaal.tisch.erst', 'Dein Lesesaal. Auf den Tisch leg ich, was du mir schickst.')
              : offen ? (offen === 1 ? 'Auf dem Tisch liegt ein Fund. Stimmt, was ich dazu schreibe?' : 'Auf dem Tisch liegen ' + offen + ' Funde, die du noch nicht geprüft hast.')
              : !funde().length ? satz('lesesaal.fund', 'Hast du heute etwas gefunden?')
              : !meister().length ? satz('lesesaal.meister', 'Wen hast du zuletzt bewundert?')
              : !L().kerze && !L().kerzeErst ? satz('lesesaal.tisch.dunkel', 'Dunkel hier. Die Kerze steht auf dem Tisch.') : '';
            if (t) dann(function () { if (C6.jetzt === 'lesesaal' && !api.ansicht && C6.sag) C6.sag(t); }, 700);
          }
        },
        verlassen: function () { if (api.ansicht) zuSaal(); buehne.classList.add('c6m-still'); },
        groesse: groesse
      };
    }
  });
  var api = C6.lesesaal = {
    ansicht: null, hinab: hinab, _treppe: treppeSVG,
    // Kern (sortiere → fund): legt einen Fund auf den Tisch. Nichts geschieht damit ohne Ottos Tipp.
    fund: function (text, o) {
      var f = null;
      o = Object.assign({}, o || {});
      // auch als Objekt aus dem Kern: {typ, text, url, zahlen, sid}
      if (text && typeof text === 'object') {
        var x = text; text = String(x.text || '');
        if (x.url && text.indexOf(x.url) < 0) text = (text ? text + ' ' : '') + x.url;
        if (!text && Array.isArray(x.zahlen)) text = x.zahlen.filter(function (n) { return typeof n === 'number' && isFinite(n); }).join(' ');
        if (x.sid && !o.sid) o.sid = x.sid;
        if (x.titel && !o.titel) o.titel = x.titel;
        o.quelle = o.quelle || x.quelle || 'feld';
      }
      try { f = fundAnlegen(text, o); } catch (e) { f = null; }
      if (!f) return null;
      return { id: f.id, art: f.art, satz: f.art === 'zahlen' ? 'Deine Zahlen liegen auf dem Tisch im Lesesaal. Ich zeichne sie dir.' : 'Das leg ich dir auf den Tisch im Lesesaal.' };
    },
    funde: function () { return funde(); },
    futter: function () {
      return funde().filter(function (f) { return f.werkstatt; }).map(function (f) {
        return { id: f.id, art: f.art, titel: f.titel, zus: f.urteil === 'stimmtNicht' ? null : f.zus, korrektur: f.korrektur || null, text: f.text || f.notiz || '', zahlen: f.zahlen || null, url: f.url || null, quelle: f.quelle, sid: f.sid || null, urteil: f.urteil || null, daten: datenVon(f) };
      });
    },
    // Wiederauftauchen mit Takt: höchstens ein Fund je Besuch, nur passend zum offenen Space, mit Bezug „weil du am … hingelegt hast“
    passend: function (sid) {
      if (!sid || gezeigt.__einer) return null;
      var f = funde().reverse().filter(function (q) { return q.urteil !== 'stimmtNicht' && (q.sid === sid || (q.vor || []).indexOf(sid) >= 0) && !gezeigt[q.id]; })[0];
      if (!f) return null;
      gezeigt[f.id] = 1; gezeigt.__einer = 1;
      return { id: f.id, titel: f.titel, art: f.art, zus: f.zusWie === 'denk' && f.urteil !== 'stimmtNicht' ? f.zus : null, satz: 'Weil du am ' + datum(f.ts) + ' „' + kurz(f.titel, 50) + '“ hingelegt hast.' };
    },
    oeffne: function (id) { if (C6.jetzt === 'lesesaal' && api.tisch) api.tisch(id || null); else C6.geh('lesesaal', id ? { fund: id } : { funde: true }); },
    _zahlen: zahlenAus, _rein: zusRein
  };
})();
