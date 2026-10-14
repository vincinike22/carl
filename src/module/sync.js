/* Carl · Abgleich: ein Carl auf allen Geräten.
   Der Zustand C6.S liegt zusätzlich privat in der Datenbank der Seite:
   Kopf  data/users/<id>/carl            {_ts, n, hash, von, geraete, v}
   Teile data/users/<id>/carl/teile/<i>  {t: Stück des JSON}
   Neuer Stand gewinnt (_ts). Ohne Datenbank oder Anmeldung bleibt alles lokal wie bisher. */
var C6 = window.C6;
if (!C6 || !C6.bus) return;

var STUECK = 60000;          // Zeichen je Teil (UTF-8 höchstens 4 Byte je Zeichen → unter 256 KiB)
var RUHE = 1600;             // so lange nach der letzten Änderung wird gebündelt geschrieben
var NUR_HIER = { ort: 1, entwurf: 1, _ts: 1, lokal: 1 };   // gehört zu diesem Gerät, wird nicht abgeglichen (lokal = eigenes Modell auf diesem Rechner)

var db = null, uid = null, kopfRef = null, abo = null;
var st = { an: false, zuletzt: 0, geraete: 0, grund: 'lokal' };
var letzteLast = null;       // zuletzt abgeglichener Inhalt (ohne NUR_HIER), als Text
var geaendertAm = 0;         // wann sich hier zuletzt etwas geändert hat (noch nicht geschickt)
var uhr = null, schreibt = false, nochmal = false, holt = false, eigenesTs = 0, aus = false;

function geraetId() {
  var k = 'carl6.geraet';
  try { var g = localStorage.getItem(k); if (g) return g; g = 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem(k, g); return g; } catch (e) { return 'g-' + Math.random().toString(36).slice(2, 10); }
}
var GID = geraetId();
function hash(t) { var h = 5381; for (var i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return (h >>> 0).toString(36) + ':' + t.length; }
function last() {
  var s = C6.S || {}, o = {};
  Object.keys(s).forEach(function (k) { if (!NUR_HIER[k]) o[k] = s[k]; });
  try { return JSON.stringify(o); } catch (e) { return null; }
}
function melde(was) { try { C6.bus.emit('sync', { was: was, status: C6.sync.status() }); } catch (e) {} }
function setze(grund, an) { st.grund = grund; st.an = !!an; }
function warte(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function teileRef(i) { return kopfRef.collection('teile').doc(String(i)); }

/* ---------- Schreiben: gebündelt, eins nach dem anderen ---------- */
function bald() {
  if (!st.an || aus) return;
  clearTimeout(uhr);
  uhr = setTimeout(schicke, RUHE);
}
function schicke() {
  uhr = null;
  if (!st.an || aus) return Promise.resolve();
  if (schreibt) { nochmal = true; return Promise.resolve(); }
  var text = last();
  if (text == null || text === letzteLast) { if (text === letzteLast) geaendertAm = 0; return Promise.resolve(); }
  var ts = Math.max(Date.now(), (C6.S._ts || 0) + 1);
  var n = Math.max(1, Math.ceil(text.length / STUECK)), h = hash(text);
  schreibt = true;
  var p = Promise.resolve();
  for (var i = 0; i < n; i++) (function (i) { p = p.then(function () { return teileRef(i).set({ t: text.slice(i * STUECK, (i + 1) * STUECK), ts: ts }); }); })(i);
  return p.then(function () {
    var geraete = Object.assign({}, st._geraete || {});
    geraete[GID] = { art: C6.geraet || '', ts: ts };
    eigenesTs = ts;
    return kopfRef.set({ _ts: ts, n: n, hash: h, von: GID, geraete: geraete, v: 1 });
  }).then(function () {
    // alte, überzählige Teile wegräumen (Stand wurde kürzer)
    var alt = st._n || 0, q = Promise.resolve();
    for (var j = n; j < alt; j++) (function (j) { q = q.then(function () { return teileRef(j).delete(); }); })(j);
    st._n = n;
    return q;
  }).then(function () {
    letzteLast = text;
    C6.S._ts = ts;
    geaendertAm = 0;
    st.zuletzt = Date.now();
    melde('gesendet');
  }, function (e) { fehlerFall(e, 'senden'); })
    .then(function () { schreibt = false; if (nochmal) { nochmal = false; bald(); } });
}

/* ---------- Empfangen ---------- */
function kopfKam(snap) {
  if (!snap || !snap.exists) { st._geraete = {}; st.geraete = 0; return; }
  var k = snap.data() || {};
  st._geraete = k.geraete || {};
  st.geraete = Object.keys(st._geraete).length;
  st._n = Math.max(st._n || 0, k.n || 0);
  if (k.von === GID && k._ts === eigenesTs) return;          // das eigene Echo
  var hier = C6.S._ts || 0;
  if (!(k._ts > hier)) { if (geaendertAm || last() !== letzteLast) bald(); return; }
  // hier gibt es Ungeschicktes, das neuer ist als der Stand von dort: dann gewinnt dieses Gerät
  if (geaendertAm && geaendertAm > k._ts) { bald(); return; }
  hole(k);
}
function hole(k) {
  if (holt) return;
  holt = true;
  var teile = [], p = Promise.resolve();
  for (var i = 0; i < (k.n || 0); i++) (function (i) { p = p.then(function () { return teileRef(i).get().then(function (s) { teile[i] = s.exists ? String((s.data() || {}).t || '') : null; }); }); })(i);
  p.then(function () {
    var text = teile.join('');
    if (teile.some(function (x) { return x == null; }) || hash(text) !== k.hash) { holt = false; setTimeout(function () { kopfRef.get().then(kopfKam, function () {}); }, 1200); return; }
    var neu = JSON.parse(text);
    uebernimm(neu, k._ts, text);
    holt = false;
  }).catch(function (e) { holt = false; fehlerFall(e, 'holen'); });
}
/* Zustand ersetzen, im selben Objekt (alle Räume halten C6.S), und den Raum sanft neu zeichnen */
/* Ottos Richtigstellungen (S.fest) werden nie durch einen ganzen fremden Stand ersetzt:
   je Schlüssel gewinnt der neuere Zeitstempel, Grabsteine ({weg:true}) gelten wie Einträge */
function mischeFest(hier, dort) {
  var a = (hier && typeof hier === 'object') ? hier : {}, b = (dort && typeof dort === 'object') ? dort : {}, m = {}, anders = false;
  Object.keys(b).forEach(function (k) { m[k] = b[k]; });
  Object.keys(a).forEach(function (k) {
    var x = a[k], y = b[k];
    if (!y || ((x && x.ts) || 0) > ((y && y.ts) || 0)) { m[k] = x; anders = true; }
  });
  return { fest: m, anders: anders };
}
function uebernimm(neu, ts, text) {
  var s = C6.S;
  var gem = mischeFest(s.fest, neu && neu.fest);
  Object.keys(s).forEach(function (k) { if (!NUR_HIER[k]) delete s[k]; });
  Object.keys(neu || {}).forEach(function (k) { if (!NUR_HIER[k]) s[k] = neu[k]; });
  if (Object.keys(gem.fest).length) s.fest = gem.fest;
  s._ts = ts;
  // hatte dieses Gerät eine neuere Richtigstellung, geht sie gleich zurück an die anderen
  letzteLast = gem.anders ? null : text;
  geaendertAm = 0;
  st.zuletzt = Date.now();
  try { C6.speichern(); } catch (e) {}
  try { C6.bus.emit('zustand', s); } catch (e) {}
  ['strings', 'space', 'atlas'].forEach(function (n) { try { C6.bus.emit(n, { was: 'sync' }); } catch (e) {} });
  // ein neues Gerät, das noch beim Wecken steht, kennt Carl jetzt schon: gleich nach Hause
  var fertig = !!(s.du && s.du.fertig);
  try {
    if (fertig && C6.rundgang && C6.rundgang.an) C6.rundgang.ende();
    else if (fertig && C6.jetzt === 'rundgang' && C6.geh) C6.geh('zuhause');
    else if (C6.jetzt && C6.geh) C6.geh(C6.jetzt, { sync: true });
  } catch (e) {}
  melde('empfangen');
  if (gem.anders) { geaendertAm = Date.now(); bald(); }
}

function fehlerFall(e, wo) {
  var code = e && e.code;
  if (code === 'revoked' || code === 'not_granted' || code === 'capability_disabled' || code === 'capability_removed') { stopp('lokal'); return; }
  if (code === 'invalid_argument' && wo === 'senden') { stopp('lokal'); return; }   // z. B. nur Leserecht
  setze('fehler', st.an);
  try { console.warn('Carl6 · sync ' + wo, code || e); } catch (x) {}
  melde('fehler');
}
function stopp(grund) {
  if (abo) { try { abo(); } catch (e) {} abo = null; }
  setze(grund || 'lokal', false);
  melde('aus');
}

/* ---------- Anfang: ohne Datenbank still lokal ---------- */
function start() {
  var c = window.claude;
  if (!c || typeof c.use !== 'function') return;
  Promise.all([c.use('db'), c.use('user')]).then(function (r) {
    db = r[0]; var user = r[1];
    if (!db || !user || typeof user.id !== 'function') return null;
    return user.id();
  }).then(function (id) {
    if (!id || !db) return;
    uid = String(id);
    kopfRef = db.doc('data/users/' + uid + '/carl');
    return kopfRef.get().then(function (snap) {
      setze('verbunden', true);
      letzteLast = null;
      var k = snap.exists ? snap.data() || {} : null;
      if (k && k._ts > (C6.S._ts || 0)) { kopfKam(snap); }
      else { geaendertAm = Date.now(); bald(); }
      abo = kopfRef.onSnapshot(kopfKam, function (e) {
        abo = null;
        if (e && e.code === 'unavailable') { setTimeout(function () { if (st.an && !abo) abo = kopfRef.onSnapshot(kopfKam, function () { stopp('fehler'); }); }, 3000); return; }
        fehlerFall(e, 'abo');
      });
      melde('an');
    });
  }).catch(function (e) { fehlerFall(e, 'start'); });
}

C6.sync = {
  status: function () { return { an: st.an, zuletzt: st.zuletzt || null, geraete: st.geraete || 0, grund: st.grund }; },
  /* die Kopie in der Datenbank löschen (lokal bleibt alles, das räumt das Buch) */
  vergiss: function () {
    if (!kopfRef) { setze('vergessen', false); melde('vergessen'); return Promise.resolve(false); }
    aus = true; clearTimeout(uhr);
    var n = Math.max(st._n || 0, 1), p = Promise.resolve();
    for (var i = 0; i < n + 2; i++) (function (i) { p = p.then(function () { return teileRef(i).delete(); }); })(i);
    return p.then(function () { return kopfRef.delete(); }).then(function () {
      letzteLast = null; st._n = 0; st.geraete = 0; st._geraete = {};
      C6.S._ts = 0;
      aus = false;
      melde('vergessen');
      return true;
    }, function (e) { aus = false; fehlerFall(e, 'vergessen'); return false; });
  },
  jetzt: function () { clearTimeout(uhr); return schicke(); },
  /* vom Kern: es wurde lokal gespeichert */
  _gespeichert: function () { if (!st.an || aus || holt) return; if (!geaendertAm) geaendertAm = Date.now(); bald(); }
};
// beim Verlassen gleich schicken, was noch wartet
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && uhr) { clearTimeout(uhr); schicke(); } });
start();
