// Strings, Knoten, rote Nadeln und Gerüste
var C6 = window.C6 = window.C6 || {};

var FARBEN = ['#2f5f8a', '#2c7a6e', '#b7852a', '#5f7f3e', '#7d4a74', '#a95f33', '#4f7fa8', '#8a6a3c'];

function S() { return C6.S || (C6.S = {}); }
function sicher(s) {
  if (!Array.isArray(s.strings)) s.strings = [];
  if (!Array.isArray(s.knoten)) s.knoten = [];
  if (!Array.isArray(s.nadeln)) s.nadeln = [];
  if (!Array.isArray(s.geruest)) s.geruest = [];
  if (!Array.isArray(s.wand)) s.wand = [];
  return s;
}
function wb(s) {
  if (!s.werkbank || typeof s.werkbank !== 'object') s.werkbank = {};
  if (!Array.isArray(s.werkbank.laeufe)) s.werkbank.laeufe = [];
  return s.werkbank;
}
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(function (s) { fn(sicher(s)); });
  else { fn(sicher(S())); try { C6.speichern && C6.speichern(); } catch (e) {} }
}
function melde(was, id) { try { C6.bus && C6.bus.emit('strings', { was: was, id: id }); } catch (e) {} }
function neueId(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function kurz(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }

function tag(ts) {
  var d = new Date(ts || Date.now());
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}
var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
function datum(ts) { var d = new Date(ts); return d.getDate() + '. ' + MONATE[d.getMonth()]; }

C6.strings = {
  farben: FARBEN,
  tag: tag,
  datum: datum,
  kurz: kurz,
  alle: function () { return sicher(S()).strings; },
  knotenAlle: function () { return sicher(S()).knoten; },
  nadelnAlle: function () { return sicher(S()).nadeln; },
  hol: function (id) { var a = this.alle(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; },
  neu: function (o) {
    o = o || {};
    var a = this.alle();
    var vor = a.length ? a[a.length - 1] : null;
    var farbe = o.farbe;
    if (!farbe) {
      farbe = FARBEN[a.length % FARBEN.length];
      if (vor && vor.farbe === farbe) farbe = FARBEN[(a.length + 1) % FARBEN.length];
    }
    var s = {
      id: neueId('f'),
      titel: kurz(o.titel || 'Ein neuer Space', 48),
      art: /^(projekt|idee|gewohnheit)$/.test(o.art) ? o.art : 'projekt',
      farbe: farbe,
      perlen: [],
      erstellt: Date.now(),
      nach: vor ? vor.id : null
    };
    aendern(function (st) { st.strings.push(s); });
    melde('neu', s.id);
    return s;
  },
  umbenennen: function (id, titel) {
    aendern(function (st) { st.strings.forEach(function (s) { if (s.id === id) s.titel = kurz(titel, 48); }); });
    melde('titel', id);
  },
  perle: function (id, text) {
    var p = { t: kurz(text, 240), ts: Date.now() };
    aendern(function (st) { st.strings.forEach(function (s) { if (s.id === id) { s.perlen = s.perlen || []; s.perlen.push(p); } }); });
    melde('perle', id);
    return p;
  },
  // Was Otto abnimmt, ist überall weg (auch oben am Planeten). Gibt die Perle zurück, damit sie zurückgehängt werden kann.
  // wer: der Text des Zettels (die jüngste Perle mit diesem Text) oder {ts} (genau diese)
  perleWeg: function (id, wer) {
    var weg = null;
    var ts = wer && typeof wer === 'object' ? wer.ts : null, t = ts == null ? kurz(wer, 240) : null;
    aendern(function (st) {
      st.strings.forEach(function (s) {
        if (s.id !== id || !Array.isArray(s.perlen)) return;
        for (var i = s.perlen.length - 1; i >= 0; i--) {
          var p = s.perlen[i];
          if (ts != null ? p.ts === ts : p.t === t) { weg = s.perlen.splice(i, 1)[0]; break; }
        }
      });
    });
    if (weg) melde('perle-weg', id);
    return weg;
  },
  // Rückweg: die Perle hängt wieder an ihrer alten Stelle (nach Zeit geordnet), nie doppelt
  perleZurueck: function (id, p) {
    if (!p || !p.t) return null;
    var da = null;
    aendern(function (st) {
      st.strings.forEach(function (s) {
        if (s.id !== id) return;
        s.perlen = s.perlen || [];
        if (s.perlen.some(function (x) { return x.ts === p.ts && x.t === p.t; })) { da = p; return; }
        var neu = { t: kurz(p.t, 240), ts: +p.ts || Date.now() };
        var i = 0; while (i < s.perlen.length && s.perlen[i].ts <= neu.ts) i++;
        s.perlen.splice(i, 0, neu); da = neu;
      });
    });
    if (da) melde('perle', id);
    return da;
  },
  knoten: function (a, b, satz, o) {
    if (!a || !b || a === b) return null;
    var k = { a: a, b: b, satz: kurz(satz, 240), ts: Date.now() };
    aendern(function (st) { st.knoten.push(k); });
    // wie oben, so unten: das Sternbild liegt in beiden Spaces als Faden zum anderen
    if (!(o && o.unten === false)) this.unten(k);
    melde('knoten', a);
    return k;
  },
  unten: function (k) {
    var sp = C6.space;
    if (!sp || typeof sp.legeHin !== 'function') return;
    var art = Array.isArray(sp.arten) && sp.arten.indexOf('faden') >= 0 ? 'faden' : 'karte';
    var self = this;
    [[k.a, k.b], [k.b, k.a]].forEach(function (p) {
      var hier = self.hol(p[0]), dort = self.hol(p[1]);
      if (!hier || !dort) return;
      try { sp.legeHin(p[0], { art: art, titel: 'Sternbild mit „' + kurz(dort.titel, 40) + '“', text: k.satz, farbe: dort.farbe, mit: p[1], knoten: k.ts }); } catch (e) {}
    });
  },
  // Sternbild-Ding aus dem Himmel (kein Echo zurück nach oben); ältere heißen noch „Faden zu …“
  vonOben: function (d) { return !!d && (!!d.mit || !!d.knoten || /^(Faden zu|Sternbild mit) „/.test(d.titel || '')); },
  nadel: function (satz, stringId) {
    var n = { satz: kurz(satz, 240), stringId: stringId || null, ts: Date.now() };
    aendern(function (st) { st.nadeln.push(n); });
    melde('nadel', stringId);
    return n;
  },
  zeig: function (id) { if (C6.geh) C6.geh('netz', { faden: id }); },
  art: function (id, art) {
    if (!/^(projekt|idee|gewohnheit)$/.test(art)) return;
    aendern(function (st) { st.strings.forEach(function (s) { if (s.id === id) s.art = art; }); });
    melde('art', id);
  },
  // Places eines Strings (aus dem Space, nur lesend) – im Himmel sind sie Monde
  monde: function (id) {
    var sp = S().spaces && S().spaces[id];
    var p = sp && Array.isArray(sp.places) ? sp.places : [];
    return p.filter(function (x) { return typeof x === 'string' || (x && x.id); }).map(function (x) { return typeof x === 'string' ? x : x.id; }).slice(0, 8);
  },
  // Planeten-Daten für den Himmel: ein String = ein Planet auf seiner Bahn
  planeten: function () {
    var self = this, kn = this.knotenAlle(), nd = this.nadelnAlle();
    var rad = (S().rad && S().rad.teile) || {};
    return this.alle().map(function (s, i) {
      var teil = '';
      for (var k in rad) if (rad[k] === s.id) { teil = k.charAt(0).toUpperCase() + k.slice(1); break; }
      var sp = (S().spaces && S().spaces[s.id]) || {};
      var monde = self.monde(s.id);
      var chats = 0; if (sp.chats) for (var c in sp.chats) chats += (sp.chats[c] || []).length;
      var menge = (s.perlen || []).length + (sp.notizen || []).length + monde.length * 1.5 + Math.min(6, chats / 2);
      return {
        id: s.id, titel: s.titel, farbe: s.farbe, art: s.art, bahn: i,
        groesse: Math.min(1, menge / 12), monde: monde,
        nadeln: nd.filter(function (n) { return n.stringId === s.id; }).length,
        knoten: kn.filter(function (x) { return x.a === s.id || x.b === s.id; }).map(function (x) { return x.a === s.id ? x.b : x.a; }),
        rad: teil, kern: sp.kern || ''
      };
    });
  },
  // Wenn das Netz leer ist: Carl zieht den ersten Faden aus dem, woran du baust.
  erster: function () {
    if (this.alle().length) return null;
    var du = S().du || {};
    var t = du.baut && String(du.baut).trim();
    if (!t || t.length < 2) return null; // ohne Antwort kein Faden, das Netz bleibt leer
    return this.neu({ titel: t, art: 'projekt' });
  },
  // Wo taucht der Faden auf: Knoten und Nadeln eines Strings
  geschichte: function (id) {
    var s = this.hol(id); if (!s) return [];
    var g = [{ ts: s.erstellt, art: 'anfang', t: 'Angefangen' }];
    (s.perlen || []).forEach(function (p) { g.push({ ts: p.ts, art: 'perle', t: p.t }); });
    var self = this;
    this.knotenAlle().forEach(function (k) {
      if (k.a === id || k.b === id) {
        var o = self.hol(k.a === id ? k.b : k.a);
        g.push({ ts: k.ts, art: 'knoten', t: k.satz, mit: o ? o.titel : '' });
      }
    });
    this.nadelnAlle().forEach(function (n) { if (n.stringId === id) g.push({ ts: n.ts, art: 'nadel', t: n.satz }); });
    g.sort(function (x, y) { return x.ts - y.ts; });
    return g;
  },
  // Begleiter: abends eine leise Frage zu einer Gewohnheit
  gewohnheiten: function () { return this.alle().filter(function (s) { return s.art === 'gewohnheit'; }); },
  abendDran: function () {
    var h = new Date().getHours();
    var b = S().begleiter || {};
    return h >= 18 && this.gewohnheiten().length > 0 && b.tag !== tag();
  },
  abendfrage: function () {
    var self = this;
    if (!this.abendDran() || !C6.frag) return Promise.resolve(null);
    var g = this.gewohnheiten();
    var s = g[(new Date().getDate()) % g.length];
    aendern(function (st) { st.begleiter = { tag: tag() }; });
    return C6.frag('Wie war heute „' + s.titel + '“? Ein Wort reicht.', ['War dabei', 'Heute nicht', 'Morgen wieder'], { frei: true, id: 'c6w-abend' })
      .then(function (a) {
        if (!a) return null;
        var t = typeof a === 'string' ? a : (a.text || a.t || '');
        if (!t) return null;
        self.perle(s.id, t);
        if (C6.sag) C6.sag('Hängt als Zettel in „' + s.titel + '“.');
        return s;
      });
  }
};

// ——— Gerüste ———
var FERTIG = [
  { id: 'bruecke', name: 'Brücke', ort: 'wand', farbe: '#2f5f8a',
    satz: 'Ich leg dir zwei ferne Gedanken hin, und du findest den Satz dazwischen.',
    schritte: ['Zwei ferne Gedanken hinlegen', 'Du schreibst, was sie verbindet', 'Der Satz wird ein Knoten'] },
  { id: 'gegen', name: 'Gegenspieler', ort: 'wand', farbe: '#a95f33',
    satz: 'Ich halte freundlich dagegen, bis dein Satz fester steht.',
    schritte: ['Du sagst deinen Satz', 'Ich halte dagegen', 'Du entscheidest, was bleibt'] },
  { id: 'recherche', name: 'Recherche', ort: 'wand', farbe: '#2c7a6e',
    satz: 'Ich geh für dich nachschauen und bring dir drei Funde mit.',
    schritte: ['Du stellst die Frage', 'Ich bring drei Funde', 'Du behältst, was trägt'] },
  { id: 'skizze', name: 'Skizze', ort: 'wand', farbe: '#7d4a74',
    satz: 'Ich zeichne dir drei grobe Fassungen, und du nimmst eine.',
    schritte: ['Du sagst, worum es geht', 'Drei grobe Fassungen', 'Du nimmst eine'] },
  { id: 'reiss', name: 'Reißbrett', ort: 'wand', farbe: '#4f7fa8',
    satz: 'Wir legen Ideen hin, du behältst die guten, und dann formen wir eine.',
    schritte: ['Ideen hinlegen', 'Behalten oder weglegen', 'Eine formen'] },
  { id: 'ordnen', name: 'Ordnen', ort: 'boden', farbe: '#b7852a',
    satz: 'Kipp dein Durcheinander hinein. Wir brennen den Heuhaufen ab, bis die Nadel rot daliegt.',
    schritte: ['Alles hineinkippen', 'Den Heuhaufen abbrennen', 'Die rote Nadel stecken'] },
  { id: 'fest', name: 'Festhalten', ort: 'regal', farbe: '#5f7f3e',
    satz: 'Ich heb deinen Gedanken auf und häng ihn als Zettel in deinen Space.',
    schritte: ['Du sagst den Gedanken', 'Ich such den Space', 'Er hängt als Zettel'] },
  { id: 'morgen', name: 'Morgenbrief', ort: 'regal', farbe: '#8a6a3c',
    satz: 'Morgen früh liegt ein Brief da, mit zwei deiner Gedanken.',
    schritte: ['Zwei Gedanken aussuchen', 'Den Brief schreiben', 'Morgen früh hinlegen'] }
];

// Vorlagen, die Carl gebaut hat (Beispiele im Teleskop, kein Mensch dahinter)
var VORLAGEN = [
  { id: 'v-pruefung', name: 'Prüfungsfahrplan', farbe: '#2f5f8a', schritte: ['Was kommt dran?', 'Was sitzt schon, was nicht?', 'Ein Plan bis zum Tag'] },
  { id: 'v-kunde', name: 'Erstes Gespräch', farbe: '#a95f33', schritte: ['Wen willst du fragen?', 'Drei offene Fragen', 'Was du danach anders machst'] },
  { id: 'v-lied', name: 'Lied in drei Abenden', farbe: '#7d4a74', schritte: ['Eine Zeile, die bleibt', 'Ein Refrain drumherum', 'Einmal ganz singen'] },
  { id: 'v-woche', name: 'Wochenrückblick', farbe: '#5f7f3e', schritte: ['Was war gut?', 'Was hat gehakt?', 'Eine Sache für nächste Woche'] },
  { id: 'v-seite', name: 'Leere Seite', farbe: '#b7852a', schritte: ['Ein Satz, ganz schlecht', 'Drei Sätze, etwas besser', 'Der erste Absatz'] },
  { id: 'v-entscheid', name: 'Zwei Wege', farbe: '#2c7a6e', schritte: ['Weg A in einem Satz', 'Weg B in einem Satz', 'Was du in einem Jahr bereust'] },
  { id: 'v-umzug', name: 'Kiste für Kiste', farbe: '#8a6a3c', schritte: ['Was liegt alles herum?', 'Eine Kiste je Sache', 'Die erste Kiste zu'] }
];

C6.geruest = {
  fertig: FERTIG,
  vorlagen: VORLAGEN,
  eigene: function () { return sicher(S()).geruest; },
  alle: function () {
    var w = sicher(S()).wand;
    var ueber = VORLAGEN.filter(function (v) { return w.indexOf(v.id) >= 0; }).map(function (v) {
      return { id: v.id, name: v.name, farbe: v.farbe, schritte: v.schritte, aus: 'teleskop', ort: 'wand' };
    });
    return FERTIG.concat(this.eigene().map(function (g) { g.ort = 'wand'; return g; }), ueber);
  },
  hol: function (id) {
    var a = this.alle(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i];
    for (var j = 0; j < VORLAGEN.length; j++) if (VORLAGEN[j].id === id) return VORLAGEN[j];
    return null;
  },
  // Ein Gerüst benutzen. o.stringId: im Space dieses Projekts (Carl trägt es hinüber), o.text: Antwort auf die erste Frage
  starte: function (id, o) {
    o = o || {};
    if (C6.werkstatt && C6.werkstatt.starte) return C6.werkstatt.starte(id, o);
    if (C6.geh) C6.geh('werkstatt', { starte: id, text: o.text });
  },
  trage: function (id, stringId, o) { if (C6.werkstatt && C6.werkstatt.trage) return C6.werkstatt.trage(id, stringId, o || {}); },
  // ——— Spuren: jeder Durchlauf bleibt im Gedächtnis der Werkbank ———
  laeufe: function () { return wb(S()).laeufe.slice(); },
  merke: function (l) {
    if (!l) return null;
    l.id = l.id || neueId('l'); l.ts = l.ts || Date.now();
    aendern(function (st) {
      var w = wb(st), da = false;
      w.laeufe.forEach(function (x, i) { if (x.id === l.id) { w.laeufe[i] = l; da = true; } });
      if (!da) w.laeufe.push(l);
      if (w.laeufe.length > 60) w.laeufe.splice(0, w.laeufe.length - 60);
    });
    melde('lauf', l.g);
    return l;
  },
  inSpace: function (sid) {
    return this.laeufe().filter(function (l) { return l.sid === sid; }).sort(function (a, b) { return b.ts - a.ts; });
  },
  runde: function (id, sid) { return this.laeufe().filter(function (l) { return l.g === id && l.sid === sid; }).length + 1; },
  spuren: function (id) {
    var ls = this.laeufe().filter(function (l) { return l.g === id; }).sort(function (a, b) { return b.ts - a.ts; });
    var je = {}, spaces = [];
    ls.forEach(function (l) {
      if (!l.sid) return;
      if (!je[l.sid]) { var f = C6.strings.hol(l.sid); if (!f) return; je[l.sid] = { sid: l.sid, farbe: f.farbe, titel: f.titel, n: 0 }; spaces.push(je[l.sid]); }
      je[l.sid].n++;
    });
    return { n: ls.length, spaces: spaces, zuletzt: ls[0] || null };
  },
  // Blätter ohne Projekt (lose auf der Werkbank), neueste zuerst
  lose: function () { return this.laeufe().filter(function (l) { return !l.sid; }).sort(function (a, b) { return b.ts - a.ts; }); },
  blatt: function (id) { var a = this.laeufe(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; },
  // ein Blatt ergänzen (Ausarbeitung, Beispiel-Vermerk), ohne es neu zu legen
  ergaenze: function (id, patch) {
    var da = null;
    aendern(function (st) { wb(st).laeufe.forEach(function (x) { if (x.id === id) { Object.keys(patch || {}).forEach(function (k) { x[k] = patch[k]; }); da = x; } }); });
    if (da) melde('lauf', da.g);
    return da;
  },
  // das Blatt als Text (für Space und Beamer): Ergebnis zuerst, dann Frage, Fassungen, Ausarbeitung
  text: function (l) {
    if (!l) return '';
    var z = [l.t || ''];
    if (l.frage) z.push('Frage: ' + l.frage);
    if (l.teile && l.teile.length) z.push((l.teileName || 'Fassungen') + ': ' + l.teile.map(function (x, i) { return (i + 1) + '. ' + x; }).join(' · '));
    (l.mehr || []).forEach(function (m) { z.push(m); });
    if (l.beispiel) z.push('Im Prototyp sind das Beispiele von mir.');
    z.push(datum(l.ts) + ' · ' + (l.titel || 'Werkzeug') + (l.runde > 1 ? ' · ' + l.runde + '. Runde' : ''));
    return z.filter(Boolean).join('\n');
  },
  // ein offener Lauf (für den Fall, dass die Seite neu lädt): {g, sid, raum, name, ts} oder null
  offen: function (l) {
    if (l === undefined) return wb(S()).offen || null;
    aendern(function (st) { wb(st).offen = l || null; });
    return l || null;
  },
  zeigeBlatt: function (id, o) { if (C6.werkstatt && C6.werkstatt.blatt) return C6.werkstatt.blatt(id, o); },
  // letzte Arbeit je Projekt, neueste zuerst
  letzte: function () {
    var je = {}, a = [];
    this.laeufe().forEach(function (l) { if (l.sid && C6.strings.hol(l.sid) && (!je[l.sid] || je[l.sid].ts < l.ts)) je[l.sid] = l; });
    for (var k in je) a.push({ sid: k, lauf: je[k] });
    return a.sort(function (x, y) { return y.lauf.ts - x.lauf.ts; });
  },
  speichern: function (g) {
    aendern(function (st) {
      var da = false;
      st.geruest.forEach(function (x, i) { if (x.id === g.id) { st.geruest[i] = g; da = true; } });
      if (!da) st.geruest.push(g);
    });
    melde('geruest', g.id);
    return g;
  },
  // Carl baut einen Vorschlag: kurzer Name + drei Schritte
  neu: function (aufgabe) {
    var self = this;
    var auf = kurz(aufgabe, 160);
    var bitte = 'Baue ein kleines Gerüst für genau diese Aufgabe: „' + auf + '“. Antworte nur so, ohne weitere Worte:\nName: <höchstens drei Wörter>\n1. <Schritt, höchstens sechs Wörter>\n2. <Schritt>\n3. <Schritt>';
    var p = C6.denk ? C6.denk(bitte, { kontext: 'Ein Gerüst bauen', stumm: true }) : Promise.resolve('');
    var zeit = new Promise(function (r) { setTimeout(function () { r(''); }, 20000); });
    return Promise.race([p, zeit]).then(function (t) { return self.lies(String(t || ''), auf); }, function () { return self.lies('', auf); });
  },
  lies: function (t, auf) {
    var name = (t.match(/Name\s*:\s*(.+)/i) || [])[1];
    var schritte = [];
    t.split(/\n/).forEach(function (z) {
      var m = z.match(/^\s*[1-3][.)]\s*(.+)/);
      if (m) schritte.push(kurz(m[1].replace(/[*_]/g, ''), 48));
      else if (!name && z.trim() && z.trim().length < 40 && !schritte.length) name = z.trim();
    });
    if (!name || schritte.length < 3) {
      var STOP = /^(für|fuer|meine?n?|mein|am|im|die|der|das|den|dem|ein|eine[nm]?|zu|und|mit|auf|an|in|bis|von|ich|will|soll|muss|wie|was|wenn)$/i;
      var w = String(auf || '').replace(/[^\wäöüÄÖÜß\s-]/g, ' ').split(/\s+/).filter(function (x) { return x.length > 2 && !STOP.test(x); });
      var gross = w.filter(function (x) { return /^[A-ZÄÖÜ]/.test(x); });
      name = (gross.length ? gross : w).slice(0, 2).join(' ') || 'Mein Werkzeug';
      schritte = [];
      var basis = ['Sag mir, wo du gerade stehst', 'Ich leg dir drei Wege hin', 'Du nimmst den nächsten Schritt'];
      while (schritte.length < 3) schritte.push(basis[schritte.length]);
    }
    name = kurz(name.replace(/[*_„“"]/g, ''), 28);
    var n = this.eigene().length;
    return { id: neueId('g'), name: name, aus: auf, schritte: schritte.slice(0, 3), farbe: FARBEN[(n + 3) % FARBEN.length], ts: Date.now(), teleskop: false };
  },
  insTeleskop: function (id, an) {
    aendern(function (st) { st.geruest.forEach(function (g) { if (g.id === id) g.teleskop = an !== false; }); });
    melde('teleskop', id);
  },
  anDieWand: function (vid) {
    aendern(function (st) { if (st.wand.indexOf(vid) < 0) st.wand.push(vid); });
    melde('wand', vid);
  },
  vonDerWand: function (vid) {
    aendern(function (st) { st.wand = st.wand.filter(function (x) { return x !== vid; }); });
    melde('wand', vid);
  }
};

// Zeichen der Gerüste (klein, für Teleskop und Projektor)
C6.geruest.zeichen = function (id, farbe) {
  var f = farbe || '#2b2722';
  var Z = {
    bruecke: '<path d="M4 30 Q24 6 44 30" fill="none" stroke="' + f + '" stroke-width="5"/><path d="M4 30h40M12 30v-9M24 30v-14M36 30v-9" stroke="#2b2722" stroke-width="2.5"/>',
    gegen: '<path d="M24 4 L42 10 V24 Q42 38 24 44 Q6 38 6 24 V10 Z" fill="' + f + '" stroke="#2b2722" stroke-width="2.5"/><path d="M24 12 V36" stroke="#fbf7f0" stroke-width="3"/>',
    recherche: '<circle cx="20" cy="20" r="12" fill="#fbf7f0" stroke="' + f + '" stroke-width="5"/><path d="M29 29 L42 42" stroke="#2b2722" stroke-width="6" stroke-linecap="round"/>',
    skizze: '<rect x="8" y="6" width="28" height="36" rx="2" fill="#fbf7f0" stroke="#2b2722" stroke-width="2.5"/><path d="M13 30 Q18 18 23 26 T32 18" fill="none" stroke="' + f + '" stroke-width="3"/><path d="M38 8 L44 14 L28 40 L22 42 L24 36 Z" fill="' + f + '" stroke="#2b2722" stroke-width="2"/>',
    reiss: '<rect x="4" y="8" width="40" height="32" rx="2" fill="#fbf7f0" stroke="#2b2722" stroke-width="2.5"/><path d="M10 34 L24 14 L38 34 Z" fill="none" stroke="' + f + '" stroke-width="3"/>',
    ordnen: '<path d="M6 42 Q10 18 24 12 Q38 18 42 42 Z" fill="' + f + '" stroke="#2b2722" stroke-width="2.5"/><path d="M14 40 L20 22 M24 40 V18 M32 40 L28 24" stroke="#2b2722" stroke-width="1.6"/><path d="M34 4 L18 44" stroke="#d62a26" stroke-width="3" stroke-linecap="round"/><circle cx="33" cy="7" r="2.2" fill="none" stroke="#d62a26" stroke-width="1.6"/>',
    fest: '<rect x="12" y="4" width="24" height="7" rx="2" fill="' + f + '" stroke="#2b2722" stroke-width="2.5"/><path d="M10 12 h28 v26 q0 6 -6 6 h-16 q-6 0 -6 -6 z" fill="#fbf7f0" stroke="#2b2722" stroke-width="2.5"/><circle cx="24" cy="28" r="6" fill="' + f + '"/>',
    morgen: '<rect x="4" y="12" width="40" height="28" rx="2" fill="#fbf7f0" stroke="#2b2722" stroke-width="2.5"/><path d="M4 14 L24 30 L44 14" fill="none" stroke="#2b2722" stroke-width="2.5"/><circle cx="36" cy="9" r="6" fill="' + f + '" stroke="#2b2722" stroke-width="2"/>'
  };
  var inner = Z[id] || ('<path d="M12 44 V4 M36 44 V4" stroke="#2b2722" stroke-width="6" stroke-linecap="round"/><path d="M12 44 V4 M36 44 V4" stroke="' + f + '" stroke-width="3" stroke-linecap="round"/><path d="M12 14 H36 M12 24 H36 M12 34 H36" stroke="' + f + '" stroke-width="4.5" stroke-linecap="round"/>');
  return '<svg viewBox="0 0 48 48" aria-hidden="true">' + inner + '</svg>';
};

// Zeichen: escapen
C6.strings.esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
