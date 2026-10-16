// Der nächste Schritt eines Space: genau einer, an der Leine neben dem Kernsatz, auf Wunsch mit „bis wann“.
// Erledigt wird er ein Zettel an der Leine. Nichts wird gezählt, nichts mahnt; Carl erinnert höchstens im Brief.
var C6 = window.C6 = window.C6 || {};
function kurz(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
function spaeter(fn, ms) { return setTimeout(function () { try { fn(); } catch (e) { console.error('bausteine', e); } }, ms || 0); }
function bus(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function tagKey(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function tagVon(key) { var p = String(key).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
var WT = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
function tageBis(key) { return Math.round((tagVon(key) - tagVon(tagKey())) / 864e5); }
function wann(key) {
  var n = tageBis(key), d = tagVon(key);
  if (n < 0) return 'seit ' + d.getDate() + '.' + (d.getMonth() + 1) + '.';
  if (n === 0) return 'heute';
  if (n === 1) return 'morgen';
  if (n < 7) return WT[d.getDay()];
  return d.getDate() + '.' + (d.getMonth() + 1) + '.';
}
function sag(t) { if (t && C6.sag) { try { C6.sag(t, { merken: false }); } catch (e) {} } return t; }
function frag(t, opt, o) { return C6.frag ? Promise.resolve(C6.frag(t, opt || [], o || {})) : Promise.resolve(null); }
function text(a) { return typeof a === 'string' ? a.trim() : ''; }
function carlFroh() {
  var c = C6.carl; if (!c) return;
  try { c.stimmung('froh'); spaeter(function () { c.stimmungJetzt === 'froh' && c.stimmung('ruhig'); }, 1500); } catch (e) {}
}
// was erledigt ist, hängt als Zettel an der Leine des Space
function alsZettel(sid, t) {
  try { if (C6.space && C6.space.zettel) { C6.space.zettel(sid, t); return; } } catch (e) {}
  try { C6.strings && C6.strings.perle && C6.strings.perle(sid, t); } catch (e) {}
}
function tastatur() { try { C6.eingabe && C6.eingabe.fokus && C6.eingabe.fokus(); } catch (e) {} }

var ZEICHEN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18c4-1 6-5 9-9" fill="none" stroke="#2b2722" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 8.5l3.3.3.3 3.3" fill="none" stroke="#2b2722" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="6" r="2.4" fill="#d62a26" stroke="#2b2722" stroke-width="1.4"/></svg>';

/* ---------- Zustand: S.spaces[sid].bausteine = [{id, art:'naechster', daten:{t, tag?}}] ---------- */
function St() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(function (s) { if (!s.spaces || typeof s.spaces !== 'object') s.spaces = {}; fn(s); });
  else { var s = St(); if (!s.spaces) s.spaces = {}; fn(s); }
}
function roh(sid) { var s = St(); var r = s.spaces && s.spaces[sid]; return (r && Array.isArray(r.bausteine)) ? r.bausteine : []; }
function schritt(sid) {
  var b = roh(sid).filter(function (q) { return q.art === 'naechster'; })[0];
  if (b) return b;
  // ein alter Termin wird zum Schritt mit Datum (einmal, ohne etwas zu verlieren)
  var t = roh(sid).filter(function (q) { return q.art === 'termin' && q.daten && q.daten.t; })[0];
  return t ? { id: t.id, art: 'naechster', daten: { t: t.daten.t, tag: t.daten.tag } } : null;
}
function neueId() { return 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36); }
function setze(sid, daten) {
  if (!sid) return null;
  var id = neueId();
  aendern(function (s) {
    var x = s.spaces[sid]; if (!x) return;
    x.bausteine = (x.bausteine || []).filter(function (b) { return b.art !== 'naechster' && b.art !== 'termin'; });
    x.bausteine.push({ id: id, art: 'naechster', daten: daten || {}, ts: Date.now() });
  });
  bus('baustein', { was: 'neu', sid: sid, id: id, art: 'naechster' });
  return id;
}
function weg(sid) {
  aendern(function (s) { var x = s.spaces[sid]; if (x && x.bausteine) x.bausteine = x.bausteine.filter(function (q) { return q.art !== 'naechster' && q.art !== 'termin'; }); });
  bus('baustein', { was: 'weg', sid: sid, art: 'naechster' });
}

/* ---------- An der Leine ---------- */
function anhaenger(sid) {
  var b = schritt(sid); if (!b) return [];
  var d = b.daten || {}, n = d.tag ? tageBis(d.tag) : null;
  var oben = d.tag ? (n < 0 ? 'war ' + wann(d.tag) : 'bis ' + wann(d.tag)) : 'Nächster Schritt';
  return [{ art: 'naechster', zeichen: ZEICHEN, name: 'Nächster Schritt', oben: oben, text: d.t || '', bald: n != null && n <= 1,
    aria: 'Nächster Schritt: ' + (d.t || '') + (d.tag ? ' (' + oben + ')' : '') }];
}

/* ---------- Anlegen: was, dann auf Wunsch bis wann ---------- */
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
function bisWann(sid, t, vorher) {
  var fr = naechsterTag(5);
  var opt = [{ text: 'Ohne Datum', wert: '__ohne' }, { text: 'Morgen', wert: plusTage(1) }, { text: wann(fr) === 'morgen' ? 'Samstag' : 'Freitag', wert: wann(fr) === 'morgen' ? naechsterTag(6) : fr }];
  // ein Satz zur Zeit: was nicht verstanden wurde, steht in der Frage selbst (nie davor, wo die Frage es überschreibt)
  return frag((vorher ? vorher + ' ' : '') + 'Bis wann?', opt, { frei: true, id: 'schritt-tag:' + sid, platzhalter: 'Oder ein Datum, z. B. 24.10.' }).then(function (a) {
    if (a == null) return null;
    if (a === '__ohne') { setze(sid, { t: t }); return sag('Hängt an der Leine.'); }
    var tag = /^\d{4}-\d\d-\d\d$/.test(String(a)) ? a : leseTag(a);
    if (!tag) return bisWann(sid, t, 'Das Datum hab ich nicht verstanden. Versuch es mit 24.10. oder „Freitag“.');
    setze(sid, { t: t, tag: tag });
    var w = wann(tag); return sag('Bis ' + w + (/\.$/.test(w) ? '' : '.') + ' Wenn es nah ist, steht es in meinem Brief.');
  });
}
function anlegen(sid) {
  if (!sid) return Promise.resolve(null);
  tastatur();
  return frag('Was ist der nächste Schritt? Einer, nicht zehn.', [], { frei: true, id: 'schritt:' + sid, platzhalter: 'Der nächste Schritt …' }).then(function (a) {
    var t = kurz(text(a), 140); if (!t) return null;
    return bisWann(sid, t);
  });
}

/* ---------- Antippen und Erledigen ---------- */
function erledige(sid) {
  var b = schritt(sid); if (!b) return Promise.resolve(null);
  var d = b.daten || {};
  weg(sid); alsZettel(sid, 'Geschafft: ' + d.t); carlFroh();
  // der erste geschaffte Schritt lässt die Pflanze des Space blühen; sie welkt nie
  aendern(function (st) { var x = st.spaces[sid]; if (x) x.bluete = true; });
  bus('baustein', { was: 'erledigt', sid: sid, art: 'naechster' });
  tastatur();
  return frag('Geschafft. Es hängt als Zettel an der Leine. Und der nächste Schritt?', [{ text: 'Später', wert: '__spaeter' }], { frei: true, id: 'schritt:' + sid, platzhalter: 'Der nächste Schritt …' }).then(function (n) {
    var t = kurz(text(n), 140); if (t && n !== '__spaeter') return bisWann(sid, t);
  });
}
function tippe(sid) {
  var b = schritt(sid); if (!b) return anlegen(sid);
  var d = b.daten || {};
  return frag('Nächster Schritt: „' + kurz(d.t, 80) + '“' + (d.tag ? ', bis ' + wann(d.tag) : '') + '.', [{ text: 'Geschafft', wert: 'ok' }, { text: 'Neu schreiben', wert: 'neu' }, { text: 'Abnehmen', wert: 'weg' }], { leise: true }).then(function (a) {
    if (a === 'ok') return erledige(sid);
    if (a === 'neu') return anlegen(sid);
    if (a === 'weg') { weg(sid); sag('Abgenommen.'); }
  });
}

/* ---------- Für Carl: wo du stehst, und was im Brief steht ---------- */
function stand(sid) {
  var b = schritt(sid), d = b ? b.daten || {} : null;
  return { naechster: d ? d.t : null, tag: d && d.tag ? { tag: d.tag, wann: wann(d.tag), tage: tageBis(d.tag) } : null };
}
function erinnerung() {
  var s = St(), beste = null;
  Object.keys(s.spaces || {}).forEach(function (sid) {
    var b = schritt(sid); if (!b || !b.daten || !b.daten.tag) return;
    var n = tageBis(b.daten.tag); if (n > 2 || n < -3) return;
    if (!beste || n < beste.n) beste = { n: n, t: b.daten.t, tag: b.daten.tag };
  });
  if (!beste) return '';
  return '„' + kurz(beste.t, 60) + '“ ' + (beste.n < 0 ? 'war ' + wann(beste.tag) + ' dran.' : 'ist bis ' + wann(beste.tag) + ' dran.');
}

C6.bausteine = {
  arten: function () { return [{ id: 'naechster', name: 'Nächster Schritt', zeichen: ZEICHEN }]; },
  katalog: function () { return this.arten(); },
  registriere: function () {},
  alle: function (sid) { var b = schritt(sid); return b ? [Object.assign({}, b)] : []; },
  anhaenger: anhaenger,
  anlegen: function (sid) { return anlegen(sid); },
  mitText: function (sid, t) { t = kurz(t, 140); return t ? bisWann(sid, t) : anlegen(sid); },
  tippe: function (sid) { return tippe(sid); },
  erledige: function (sid) { return erledige(sid); },
  stand: stand,
  erinnerung: erinnerung,
  setze: function (sid, art, o) { return setze(sid, (o && o.daten) || {}); },
  entferne: function (sid) { weg(sid); return true; },
  frei: function (sid) { return schritt(sid) ? [] : ['naechster']; }
};
