// Bausteine: drei kleine Dinge an der Leine eines Space, neben den Zetteln.
// Nächster Schritt (genau einer), Gewohnheit (einmal am Tag antippen), Termin (bis wann).
// Was erledigt ist, wird eine Perle auf dem Faden. Nichts wird gezählt, nichts mahnt.
var C6 = window.C6 = window.C6 || {};
function kurz(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
function spaeter(fn, ms) { return setTimeout(function () { try { fn(); } catch (e) { console.error('bausteine', e); } }, ms || 0); }
function bus(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function tagKey(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function tagVon(key) { var p = String(key).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
var WT = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
function tageBis(key) { var h = tagVon(tagKey()); return Math.round((tagVon(key) - h) / 864e5); }
function wann(key) {
  var n = tageBis(key), d = tagVon(key);
  if (n < 0) return 'seit ' + d.getDate() + '.' + (d.getMonth() + 1) + '.';
  if (n === 0) return 'heute';
  if (n === 1) return 'morgen';
  if (n < 7) return WT[d.getDay()];
  return d.getDate() + '.' + (d.getMonth() + 1) + '.';
}
function sag(key, w, rueckfall) {
  var t = '';
  try { t = C6.stimme && C6.stimme.sag ? C6.stimme.sag(key, w) : ''; } catch (e) { t = ''; }
  t = t || rueckfall || '';
  if (t && C6.sag) { try { C6.sag(t, { merken: false }); } catch (e) {} }
  return t;
}
function frag(t, opt, o) { return C6.frag ? Promise.resolve(C6.frag(t, opt || [], o || {})) : Promise.resolve(null); }
function text(a) { return typeof a === 'string' ? a.trim() : ''; }
function carlFroh() {
  var c = C6.carl; if (!c) return;
  try { c.stimmung('froh'); spaeter(function () { c.stimmungJetzt === 'froh' && c.stimmung('ruhig'); }, 1500); } catch (e) {}
}
function perle(sid, t) { try { C6.strings && C6.strings.perle && C6.strings.perle(sid, t); } catch (e) {} }
function tastatur() { try { C6.eingabe && C6.eingabe.fokus && C6.eingabe.fokus(); } catch (e) {} }

/* ---------- Zeichen (Tusche, 24 × 24) ---------- */
var Tf = 'fill="none" stroke="#2b2722" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
var ZEICHEN = {
  naechster: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18c4-1 6-5 9-9" ' + Tf + '/><path d="M10 8.5l3.3.3.3 3.3" ' + Tf + '/><circle cx="18" cy="6" r="2.4" fill="#d62a26" stroke="#2b2722" stroke-width="1.4"/></svg>',
  gewohnheit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20v-8" ' + Tf + '/><path d="M12 15c-4 0-6-3-6-6 4 0 6 2.5 6 6zM12 12c4 0 6-3 6-6-4 0-6 2.5-6 6z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  termin: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="2" fill="#fbf7f0" stroke="#2b2722" stroke-width="1.8"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" ' + Tf + '/><circle cx="12" cy="15" r="1.8" fill="#d62a26"/></svg>'
};
var ARTEN = {
  naechster: { name: 'Nächster Schritt' },
  gewohnheit: { name: 'Gewohnheit' },
  termin: { name: 'Termin' }
};
var REIHE = ['naechster', 'termin', 'gewohnheit'];

/* ---------- Zustand: S.spaces[sid].bausteine = [{id, art, daten, ts}], je Art höchstens einer ---------- */
function St() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(function (s) { if (!s.spaces || typeof s.spaces !== 'object') s.spaces = {}; fn(s); });
  else { var s = St(); if (!s.spaces) s.spaces = {}; fn(s); }
}
function roh(sid) { var s = St(); var r = s.spaces && s.spaces[sid]; return (r && Array.isArray(r.bausteine)) ? r.bausteine : []; }
function liste(sid) { return roh(sid).filter(function (b) { return ARTEN[b.art]; }); }
function von(sid, art) { return liste(sid).filter(function (b) { return b.art === art; })[0] || null; }
function neueId() { return 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36); }

// Alte Bausteine (Zu tun, Kalender, Begleiter) werden einmal in die neuen drei übernommen; der Rest bleibt still liegen.
function umziehen(sid) {
  var r = St().spaces && St().spaces[sid];
  if (!r || r.bsUmzug || !Array.isArray(r.bausteine)) return;
  aendern(function (s) {
    var x = s.spaces[sid]; if (!x || !Array.isArray(x.bausteine)) return;
    x.bsUmzug = 1;
    var hat = function (a) { return x.bausteine.some(function (b) { return b.art === a; }); };
    x.bausteine.slice().forEach(function (b) {
      var d = b.daten || {};
      if (b.art === 'todo' && !hat('naechster')) {
        var z = (d.zettel || []).filter(function (q) { return !q.ok; })[0];
        if (z) x.bausteine.push({ id: neueId(), art: 'naechster', daten: { t: z.t }, ts: Date.now() });
      } else if (b.art === 'kalender' && !hat('termin')) {
        var k = (d.termine || []).filter(function (q) { return q.tag >= tagKey(); }).sort(function (a, c) { return a.tag < c.tag ? -1 : 1; })[0];
        if (k) x.bausteine.push({ id: neueId(), art: 'termin', daten: { t: k.t, tag: k.tag }, ts: Date.now() });
      } else if (b.art === 'gewohnheit' && b.daten && !b.daten.umgezogen) {
        b.daten.umgezogen = 1;
      }
    });
  });
}

function setze(sid, art, daten) {
  if (!sid || !ARTEN[art]) return null;
  var id = neueId();
  aendern(function (s) {
    var x = s.spaces[sid]; if (!x) return;
    x.bausteine = (x.bausteine || []).filter(function (b) { return b.art !== art; });
    x.bausteine.push({ id: id, art: art, daten: daten || {}, ts: Date.now() });
  });
  bus('baustein', { was: 'neu', sid: sid, id: id, art: art });
  return id;
}
function aendereDaten(sid, art, fn) {
  aendern(function (s) { var x = s.spaces[sid]; var b = x && (x.bausteine || []).filter(function (q) { return q.art === art; })[0]; if (b) { b.daten = b.daten || {}; fn(b.daten); } });
  bus('baustein', { was: 'daten', sid: sid, art: art });
}
function weg(sid, art) {
  aendern(function (s) { var x = s.spaces[sid]; if (x && x.bausteine) x.bausteine = x.bausteine.filter(function (q) { return q.art !== art; }); });
  bus('baustein', { was: 'weg', sid: sid, art: art });
}
function heuteGetan(b) { return !!(b && b.daten && b.daten.tage && b.daten.tage[tagKey()]); }

/* ---------- Was an der Leine hängt ---------- */
function anhaenger(sid) {
  umziehen(sid);
  return REIHE.map(function (art) {
    var b = von(sid, art); if (!b) return null;
    var d = b.daten || {}, o = { art: art, zeichen: ZEICHEN[art], name: ARTEN[art].name };
    if (art === 'naechster') { o.oben = 'Als Nächstes'; o.text = d.t || ''; }
    if (art === 'termin') { var n = tageBis(d.tag); o.oben = n < 0 ? 'war ' + wann(d.tag) : 'bis ' + wann(d.tag); o.text = d.t || ''; o.bald = n <= 1; }
    if (art === 'gewohnheit') { var g = heuteGetan(b); o.oben = g ? 'heute ✓' : 'heute?'; o.text = d.was || ''; o.getan = g; }
    o.aria = o.name + ': ' + o.text + ' (' + o.oben.replace('✓', 'erledigt') + ')';
    return o;
  }).filter(Boolean);
}

/* ---------- Anlegen ---------- */
function anlegen(sid, art) {
  if (!sid || !ARTEN[art]) return Promise.resolve(null);
  tastatur();
  if (art === 'naechster') {
    return frag('Was ist der nächste Schritt? Einer, nicht zehn.', [], { frei: true, id: 'schritt:' + sid, platzhalter: 'Der nächste Schritt …' }).then(function (a) {
      var t = kurz(text(a), 140); if (!t) return null;
      setze(sid, 'naechster', { t: t });
      return sag('baustein.naechster.anlegen', null, 'Hängt an der Leine. Wenn er erledigt ist, tipp ihn an.');
    });
  }
  if (art === 'gewohnheit') {
    return frag('Welche eine Sache, jeden Tag? Ohne Zahl, ohne Kette.', [], { frei: true, id: 'gewohnheit:' + sid, platzhalter: 'Zum Beispiel: zehn Minuten skizzieren' }).then(function (a) {
      var t = kurz(text(a), 80); if (!t) return null;
      setze(sid, 'gewohnheit', { was: t, tage: {} });
      return sag('baustein.gewohnheit.anlegen', { name: t }, 'Hängt. Tipp sie an, wenn sie heute war. Ich zähl nicht, ich freu mich nur.');
    });
  }
  return frag('Was soll fertig sein?', [], { frei: true, id: 'termin:' + sid, platzhalter: 'Was bis wann …' }).then(function (a) {
    var t = kurz(text(a), 120); if (!t) return null;
    return bisWann(sid, t);
  });
}
function naechsterTag(wd) { var d = new Date(); var n = (wd - d.getDay() + 7) % 7 || 7; return tagKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)); }
function plusTage(n) { var d = new Date(); return tagKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)); }
function leseTag(t) {
  t = String(t || '').trim().toLowerCase();
  if (!t) return null;
  if (/^heute/.test(t)) return plusTage(0);
  if (/^übermorgen|^uebermorgen/.test(t)) return plusTage(2);
  if (/^morgen/.test(t)) return plusTage(1);
  for (var i = 0; i < 7; i++) if (t.indexOf(WT[i].toLowerCase().slice(0, 2)) === 0) return naechsterTag(i);
  var m = t.match(/(\d{1,2})\.\s*(\d{1,2})\.?\s*(\d{2,4})?/);
  if (m) {
    var j = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : new Date().getFullYear();
    var d = new Date(j, +m[2] - 1, +m[1]);
    if (!m[3] && tagKey(d) < tagKey()) d = new Date(j + 1, +m[2] - 1, +m[1]);
    if (!isNaN(d)) return tagKey(d);
  }
  var w = t.match(/(\d+)\s*(tag|woche)/);
  if (w) return plusTage(+w[1] * (w[2] === 'woche' ? 7 : 1));
  return null;
}
function bisWann(sid, t) {
  var fr = naechsterTag(5);
  var opt = [{ text: 'Morgen', wert: plusTage(1) }, { text: wann(fr) === 'morgen' ? 'Samstag' : 'Freitag', wert: wann(fr) === 'morgen' ? naechsterTag(6) : fr }, { text: 'In einer Woche', wert: plusTage(7) }, { text: 'In zwei Wochen', wert: plusTage(14) }];
  return frag('Bis wann?', opt, { frei: true, id: 'termin-tag:' + sid, platzhalter: 'Oder ein Datum, z. B. 24.10.' }).then(function (a) {
    var tag = /^\d{4}-\d\d-\d\d$/.test(String(a)) ? a : leseTag(a);
    if (a == null) return null;
    if (!tag) { C6.sag && C6.sag('Das Datum hab ich nicht verstanden. Versuch es mit 24.10. oder „Freitag“.', { merken: false }); return bisWann(sid, t); }
    var alt = von(sid, 'termin');
    if (alt) aendereDaten(sid, 'termin', function (d) { d.t = t; d.tag = tag; });
    else setze(sid, 'termin', { t: t, tag: tag });
    return sag('baustein.termin.anlegen', null, 'Bis ' + wann(tag) + '. Ich erinnere dich im Brief, wenn es nah ist.');
  });
}

/* ---------- Antippen ---------- */
function tippe(sid, art) {
  var b = von(sid, art); if (!b) return Promise.resolve(null);
  var d = b.daten || {};
  if (art === 'gewohnheit') {
    if (!heuteGetan(b)) {
      aendereDaten(sid, art, function (x) { x.tage = x.tage || {}; x.tage[tagKey()] = true; });
      perle(sid, d.was);
      carlFroh();
      return Promise.resolve(sag('baustein.gewohnheit.punkt', { name: d.was }, '„' + kurz(d.was, 40) + '“ war heute. Eine Perle mehr auf deinem Faden.'));
    }
    return frag('„' + kurz(d.was, 50) + '“ war heute schon.', [{ text: 'Gut so', wert: 'gut' }, { text: 'Doch nicht', wert: 'zurueck' }, { text: 'Abnehmen', wert: 'weg' }], { leise: true }).then(function (a) {
      if (a === 'zurueck') aendereDaten(sid, art, function (x) { if (x.tage) delete x.tage[tagKey()]; });
      if (a === 'weg') { weg(sid, art); sag('baustein.weg', null, 'Abgenommen.'); }
    });
  }
  if (art === 'naechster') {
    return frag('Nächster Schritt: „' + kurz(d.t, 80) + '“', [{ text: 'Erledigt', wert: 'ok' }, { text: 'Anders', wert: 'neu' }, { text: 'Abnehmen', wert: 'weg' }], { leise: true }).then(function (a) {
      if (a === 'ok') return erledige(sid, art);
      if (a === 'neu') return anlegen(sid, 'naechster');
      if (a === 'weg') { weg(sid, art); sag('baustein.weg', null, 'Abgenommen.'); }
    });
  }
  return frag('„' + kurz(d.t, 70) + '“, ' + (tageBis(d.tag) < 0 ? 'war ' : 'bis ') + wann(d.tag) + '.', [{ text: 'Geschafft', wert: 'ok' }, { text: 'Verschieben', wert: 'schieb' }, { text: 'Abnehmen', wert: 'weg' }], { leise: true }).then(function (a) {
    if (a === 'ok') return erledige(sid, art);
    if (a === 'schieb') return bisWann(sid, d.t);
    if (a === 'weg') { weg(sid, art); sag('baustein.weg', null, 'Abgenommen.'); }
  });
}

// Erledigt: abnehmen, eine Perle auf den Faden, beim Nächsten Schritt gleich nach dem nächsten fragen
function erledige(sid, art) {
  var b = von(sid, art); if (!b || art === 'gewohnheit') return tippe(sid, art);
  var d = b.daten || {};
  weg(sid, art); perle(sid, 'Geschafft: ' + d.t); carlFroh();
  bus('baustein', { was: 'erledigt', sid: sid, art: art });
  if (art === 'termin') return Promise.resolve(sag('baustein.termin.fertig', null, 'Geschafft. Eine Perle mehr auf deinem Faden.'));
  tastatur();
  return frag('Erledigt, eine Perle mehr. Und der nächste Schritt?', [{ text: 'Später', wert: '__spaeter' }], { frei: true, id: 'schritt:' + sid, platzhalter: 'Der nächste Schritt …' }).then(function (n) {
    var t = kurz(text(n), 140); if (t && n !== '__spaeter') { setze(sid, 'naechster', { t: t }); sag('baustein.naechster.anlegen', null, 'Hängt.'); }
  });
}

/* ---------- Für Carl: wo du stehst, und was im Brief steht ---------- */
function stand(sid) {
  var n = von(sid, 'naechster'), t = von(sid, 'termin'), g = von(sid, 'gewohnheit');
  return {
    naechster: n ? n.daten.t : null,
    termin: t ? { t: t.daten.t, tag: t.daten.tag, wann: wann(t.daten.tag), tage: tageBis(t.daten.tag) } : null,
    gewohnheit: g ? { was: g.daten.was, heute: heuteGetan(g) } : null
  };
}
function erinnerung() {
  var s = St(), beste = null;
  Object.keys(s.spaces || {}).forEach(function (sid) {
    var t = von(sid, 'termin'); if (!t) return;
    var n = tageBis(t.daten.tag); if (n > 2 || n < -3) return;
    if (!beste || n < beste.n) beste = { n: n, t: t.daten.t, tag: t.daten.tag };
  });
  if (!beste) return '';
  return beste.n < 0 ? 'Übrigens: „' + kurz(beste.t, 60) + '“ war ' + wann(beste.tag) + ' dran.' : 'Übrigens: „' + kurz(beste.t, 60) + '“ ist bis ' + wann(beste.tag) + ' dran.';
}

C6.bausteine = {
  arten: function () { return REIHE.map(function (a) { return { id: a, name: ARTEN[a].name, zeichen: ZEICHEN[a] }; }); },
  katalog: function () { return this.arten(); },
  // andere Module melden sich hier nicht mehr an: drei Bausteine, nicht mehr
  registriere: function () {},
  alle: function (sid) { return liste(sid).map(function (b) { return Object.assign({}, b); }); },
  anhaenger: anhaenger,
  anlegen: anlegen,
  tippe: tippe,
  erledige: erledige,
  stand: stand,
  erinnerung: erinnerung,
  setze: function (sid, art, o) { return setze(sid, art, (o && o.daten) || {}); },
  entferne: function (sid, art) { weg(sid, art); return true; },
  frei: function (sid) { return REIHE.filter(function (a) { return !von(sid, a); }); }
};
