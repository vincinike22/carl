// Brief von Carl: höchstens eine kleine Aufgabe am Tag, aus einem deiner Fäden. Und Funde zu dem, was du suchst.
// Nichts zählt mit, nichts mahnt. Wer nicht antwortet, dem passiert nichts.
var C6 = window.C6 = window.C6 || {};
var D = document;

var ARTEN = ['satz', 'verbindung', 'gegenspieler', 'damals'];
var TAG_MS = 86400000;
var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
var RUECK = {
  'auftrag.titel': ['Brief von Carl'],
  'auftrag.satz': ['Schreib mir einen Satz, warum „{titel}“ dir wichtig ist.'],
  'auftrag.verbindung': ['Was haben „{a}“ und „{b}“ miteinander zu tun? Ein Satz reicht.'],
  'auftrag.verbindungPerlen': ['Auf „{titel}“ liegen „{a}“ und „{b}“. Was verbindet die beiden?'],
  'auftrag.gegenspieler': ['Jemand hält „{titel}“ für eine schlechte Idee. Schreib seinen besten Satz auf.'],
  'auftrag.damals': ['Am {datum} hast du geschrieben: „{zitat}“. Stimmt das heute noch?'],
  'auftrag.gruss': ['Bis bald. Carl'],
  'auftrag.bringt': ['Ich hab dir was mitgebracht. Es liegt da, wenn du magst.'],
  'auftrag.danke': ['Liegt jetzt auf deinem Faden.'],
  'auftrag.dankeKnoten': ['Jetzt hängen „{a}“ und „{b}“ zusammen.'],
  'auftrag.spaeter': ['Gut. Der Brief liegt da und läuft nicht weg.'],
  'auftrag.schon': ['Für heute hast du mir schon geschrieben: „{t}“.'],
  'auftrag.platzhalter': ['Ein Satz reicht.'],
  'fund.du': ['Du hast am {datum} geschrieben: „{zitat}“'],
  'fund.herkunft.du': ['Aus deinen eigenen Sätzen'],
  'fund.herkunft.carl': ['Carls Gedanke, nicht nachgeprüft'],
  'fund.herkunft.recherche': ['Aus der Recherche, bitte selbst prüfen'],
  'fund.bringt': ['Ich hab dir was dazu gesammelt. Es liegt hier am Boden.']
};
var NIX = { der: 1, die: 1, das: 1, und: 1, oder: 1, aber: 1, eine: 1, einen: 1, einem: 1, einer: 1, eines: 1, nicht: 1, noch: 1, auch: 1, schon: 1, dann: 1, wenn: 1, weil: 1, dass: 1, mich: 1, mir: 1, dich: 1, dir: 1, sich: 1, sein: 1, seine: 1, mein: 1, meine: 1, dein: 1, deine: 1, ich: 1, wir: 1, ihr: 1, sie: 1, ist: 1, sind: 1, war: 1, hat: 1, habe: 1, haben: 1, wird: 1, werden: 1, kann: 1, soll: 1, will: 1, muss: 1, mit: 1, von: 1, für: 1, fuer: 1, auf: 1, aus: 1, bei: 1, nach: 1, über: 1, unter: 1, zum: 1, zur: 1, den: 1, dem: 1, des: 1, wie: 1, was: 1, wer: 1, wo: 1, warum: 1, welche: 1, welcher: 1, welches: 1, heute: 1, gerade: 1, immer: 1, mal: 1, sehr: 1, viel: 1, etwas: 1, nur: 1, man: 1, hier: 1, jetzt: 1, also: 1, doch: 1, eben: 1 };

function S() { return C6.S || (C6.S = {}); }
function sicher(s) {
  if (!s.auftrag || typeof s.auftrag !== 'object') s.auftrag = {};
  var a = s.auftrag;
  if (!a.tage || typeof a.tage !== 'object') a.tage = {};
  if (!a.funde || typeof a.funde !== 'object') a.funde = {};
  if (!a.gesehen || typeof a.gesehen !== 'object') a.gesehen = {};
  return a;
}
function A() { return sicher(S()); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(function (s) { fn(sicher(s)); });
  else fn(A());
}
function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function tag(ts) { var d = new Date(ts || Date.now()); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function datum(ts) { var d = new Date(ts); return d.getDate() + '. ' + MONATE[d.getMonth()]; }
function kurz(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).replace(/[\s,.;:–-]+$/, '') + '…' : t; }
function hash(s) { s = String(s); var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function ruhig() { return !!C6.ruhig; }
function neueId(p) { return p + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36); }
function istSatz(t) { t = String(t || '').trim(); return t.split(/\s+/).length >= 4 || t.length >= 24; }

// ein Satz aus Carls Stimme; Variante je Tag fest (wechselt nicht beim Neuladen)
function satz(k, w, fest) {
  var v = (C6.stimme && C6.stimme.alle && C6.stimme.alle[k]) || RUECK[k] || [''];
  var t = v[fest ? 0 : hash(tag() + k) % v.length];
  w = w || {};
  var du = S().du || {};
  return t.replace(/\{(\w+)\}/g, function (m, n) { return n === 'name' ? (du.name || '') : (w[n] != null ? String(w[n]) : ''); }).replace(/\s{2,}/g, ' ').trim();
}
function herkunft(h) { return satz('fund.herkunft.' + (h === 'du' || h === 'recherche' ? h : 'carl'), null, true); }

function faeden() { try { return (C6.strings && C6.strings.alle ? C6.strings.alle() : (S().strings || [])).filter(function (f) { return f && f.id && f.titel; }); } catch (e) { return []; } }
function faden(id) { var a = faeden(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
function zuletzt(f) {
  var t = f.erstellt || 0;
  (f.perlen || []).forEach(function (p) { t = Math.max(t, p.ts || 0); });
  try { var r = S().spaces && S().spaces[f.id]; if (r && r.besucht) t = Math.max(t, r.besucht); } catch (e) {}
  return t;
}

// Deine eigenen Sätze (nie Carls): Gespräch, Perlen deiner Fäden, Zettel in Spaces
function eigeneSaetze() {
  var s = S(), r = [];
  (s.gespraech || []).forEach(function (z) { if (z && z.von === 'du' && !z.chip && istSatz(z.t)) r.push({ t: z.t, ts: z.ts || 0, sid: null }); });
  var sp = s.spaces || {};
  Object.keys(sp).forEach(function (sid) {
    var x = sp[sid] || {};
    (x.notizen || []).forEach(function (n) { if (n && istSatz(n.t)) r.push({ t: n.t, ts: n.ts || 0, sid: sid }); });
    var ch = x.chats || {};
    Object.keys(ch).forEach(function (p) { (ch[p] || []).forEach(function (z) { if (z && z.von === 'du' && istSatz(z.t)) r.push({ t: z.t, ts: z.ts || 0, sid: sid }); }); });
  });
  // Antworten auf frühere Briefe sind ebenfalls deine
  var tg = A().tage;
  Object.keys(tg).forEach(function (k) { var x = tg[k]; if (x && x.erledigt && istSatz(x.erledigt.t)) r.push({ t: x.erledigt.t, ts: x.erledigt.ts, sid: x.sid }); });
  var gesehen = {};
  return r.filter(function (x) { var k = x.t.trim(); if (gesehen[k]) return false; gesehen[k] = 1; return true; });
}

// ---------- Aufgabe des Tages ----------
function waehleFaden() {
  var a = faeden();
  if (!a.length) return null;
  var echte = a.filter(function (f) { return f.art === 'projekt'; });
  if (!echte.length) echte = a.filter(function (f) { return f.art === 'idee'; });
  if (!echte.length) echte = a;
  var zahl = {};
  var tg = A().tage;
  Object.keys(tg).forEach(function (k) { var x = tg[k]; if (x && x.sid) zahl[x.sid] = (zahl[x.sid] || 0) + 1; });
  return echte.slice().sort(function (x, y) { return ((zahl[x.id] || 0) - (zahl[y.id] || 0)) || (zuletzt(y) - zuletzt(x)); })[0];
}
function letzteArt() {
  var tg = A().tage, ks = Object.keys(tg).sort();
  for (var i = ks.length - 1; i >= 0; i--) if (ks[i] !== tag() && tg[ks[i]] && tg[ks[i]].art) return tg[ks[i]].art;
  return null;
}
function versuch(art, f) {
  var t = kurz(f.titel, 40);
  if (art === 'satz') return { text: satz('auftrag.satz', { titel: t }) };
  if (art === 'gegenspieler') return { text: satz('auftrag.gegenspieler', { titel: t }) };
  if (art === 'verbindung') {
    var andere = faeden().filter(function (g) { return g.id !== f.id; }).sort(function (x, y) { return zuletzt(y) - zuletzt(x); });
    if (andere.length) return { sid2: andere[0].id, text: satz('auftrag.verbindung', { a: t, b: kurz(andere[0].titel, 40) }) };
    var p = (f.perlen || []).filter(function (x) { return x && x.t; });
    if (p.length >= 2) return { text: satz('auftrag.verbindungPerlen', { titel: t, a: kurz(p[p.length - 2].t, 50), b: kurz(p[p.length - 1].t, 50) }) };
    return null;
  }
  if (art === 'damals') {
    var alt = Date.now() - 2 * TAG_MS;
    var es = eigeneSaetze().filter(function (x) { return x.ts && x.ts < alt; });
    var passend = es.filter(function (x) { return x.sid === f.id; });
    var z = (passend.length ? passend : es).sort(function (x, y) { return x.ts - y.ts; });
    if (!z.length) return null;
    var w = z[hash(tag()) % z.length];
    return { zitat: kurz(w.t, 90), text: satz('auftrag.damals', { datum: datum(w.ts), zitat: kurz(w.t, 90) }) };
  }
  return null;
}
// ---------- Was wirklich war: der Brief greift zuerst Ottos echte Einträge auf, erst danach eine Vorlage ----------
function schonGenutzt(quelle) {
  var tg = A().tage;
  return Object.keys(tg).some(function (k) { return k !== tag() && tg[k] && tg[k].quelle === quelle; });
}
function wannText(k) {
  var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(k || ''); if (!m) return '';
  var n = Math.round((new Date(+m[1], +m[2] - 1, +m[3]) - new Date(tag() + 'T00:00:00')) / TAG_MS);
  return n < 0 ? 'seit ' + (+m[3]) + '.' + (+m[2]) + '.' : n === 0 ? 'heute' : n === 1 ? 'morgen' : 'bis ' + (+m[3]) + '.' + (+m[2]) + '.';
}
function echterBrief() {
  var W = C6.werkzeug, sieben = tag(Date.now() - 6 * TAG_MS);
  // 1 · ein eigenes Werkzeug mit neuen Einträgen: Carl rechnet im Code, was da steht
  try {
    var kand = [];
    (W && W.alle ? W.alle() : []).forEach(function (w) {
      var tage = W.benutztTage ? W.benutztTage(w.id) : [], l = tage[tage.length - 1];
      if (l && l >= sieben) kand.push({ w: w, l: l, n: tage.filter(function (k) { return k >= sieben; }).length });
    });
    // das zuletzt benutzte zuerst; was schon einmal mit demselben Stand im Brief stand, kommt nicht wieder
    kand.sort(function (a, b) { return a.l < b.l ? 1 : a.l > b.l ? -1 : b.n - a.n; });
    for (var i = 0; i < kand.length && W.aufgreifen; i++) {
      var c = kand[i], q = 'w:' + c.w.id + ':' + c.l, f = (c.w.sid && faden(c.w.sid)) || waehleFaden();
      var satzW = W.aufgreifen(c.w.id);
      if (f && satzW && !schonGenutzt(q)) return { art: 'verlauf', quelle: q, sid: f.id, text: '„' + kurz(c.w.name, 30) + '“: ' + satzW + ' Was ist dir dabei aufgefallen? Ein Satz reicht.' };
    }
  } catch (e) {}
  // 2 · ein Nächster Schritt, der fällig ist
  try {
    var schritte = [];
    faeden().forEach(function (f) { var b = C6.bausteine && C6.bausteine.alle ? C6.bausteine.alle(f.id)[0] : null; if (b && b.daten && b.daten.t) schritte.push({ f: f, t: b.daten.t, tag: b.daten.tag || '', id: b.id }); });
    schritte.sort(function (a, b) { return (a.tag || '9') < (b.tag || '9') ? -1 : 1; });
    var sc = schritte.filter(function (x) { return x.tag && x.tag <= tag(Date.now() + TAG_MS); })[0] || schritte[0];
    if (sc) {
      var q2 = 's:' + sc.id + ':' + tag();
      var alt = 's:' + sc.id;
      var schon = Object.keys(A().tage).some(function (k) { var x = A().tage[k]; return k !== tag() && x && String(x.quelle || '').indexOf(alt) === 0 && k >= tag(Date.now() - 3 * TAG_MS); });
      if (!schon) return { art: 'schritt', quelle: q2, sid: sc.f.id, text: 'Dein nächster Schritt in „' + kurz(sc.f.titel, 30) + '“: „' + kurz(sc.t, 90) + '“' + (sc.tag ? ' (' + wannText(sc.tag) + ')' : '') + '. Was brauchst du noch dafür?' };
    }
  } catch (e) {}
  // 3 · ein Fund, den Otto hingelegt und noch nicht geprüft hat
  try {
    var fu = (C6.lesesaal && C6.lesesaal.funde ? C6.lesesaal.funde() : []).filter(function (x) { return x && !x.urteil && x.ts && Date.now() - x.ts < 7 * TAG_MS; }).slice(-1)[0];
    if (fu) {
      var q3 = 'f:' + (fu.id || fu.ts), ff = (fu.sid && faden(fu.sid)) || (fu.hier && faden(fu.hier)) || waehleFaden();
      if (ff && !schonGenutzt(q3)) return { art: 'fund', quelle: q3, sid: ff.id, text: 'Du hast am ' + datum(fu.ts) + ' „' + kurz(fu.titel || fu.text || fu.url || 'einen Fund', 50) + '“ hingelegt. Was wolltest du daraus?' };
    }
  } catch (e) {}
  // 4 · eine Frage von gestern oder vorgestern, über die wir gesprochen haben
  try {
    var g = (S().gespraech || []).filter(function (z) { return z && z.von === 'du' && /\?\s*$/.test(String(z.t || '')) && z.ts && Date.now() - z.ts > 2 * 3600e3 && Date.now() - z.ts < 3 * TAG_MS && String(z.t).split(/\s+/).length >= 3; }).slice(-1)[0];
    if (g) {
      var q4 = 'q:' + g.ts, fq = waehleFaden();
      if (fq && !schonGenutzt(q4)) return { art: 'frage', quelle: q4, sid: fq.id, text: 'Am ' + datum(g.ts) + ' hast du gefragt: „' + kurz(g.t, 90) + '“ ' + (/\boder\b/i.test(g.t) ? 'Hast du dich entschieden?' : 'Was ist daraus geworden?') };
    }
  } catch (e) {}
  return null;
}
function bereit() {
  var s = S();
  if (C6.rundgang && C6.rundgang.an) return false;
  return !!(s.du && s.du.fertig);
}
function heute() {
  var tg = A().tage, k = tag();
  if (tg[k]) return tg[k];
  if (!bereit()) return null;
  var f = waehleFaden();
  if (!f) return null;
  var x = null, art = 'satz';
  var echt = echterBrief();
  if (echt && faden(echt.sid)) { x = echt; art = echt.art; f = faden(echt.sid); }
  else {
    var vor = letzteArt(), start = vor ? (ARTEN.indexOf(vor) + 1) % ARTEN.length : 0;
    // die Vorlage „Jemand hält … für eine schlechte Idee“ nur, wenn der Space schon etwas trägt
    var arten = ARTEN.filter(function (a0) { return a0 !== 'gegenspieler' || (f.perlen || []).length >= 3; });
    if (start >= arten.length) start = 0;
    for (var i = 0; i < arten.length && !x; i++) { art = arten[(start + i) % arten.length]; x = versuch(art, f); }
    if (!x) { art = 'satz'; x = versuch('satz', f); }
  }
  var a = { id: neueId('a'), tag: k, art: art, quelle: x.quelle || null, sid: f.id, sid2: x.sid2 || null, titel: f.titel, text: x.text, zitat: x.zitat || null, ts: Date.now(), ding: null, erledigt: null };
  aendern(function (st) {
    st.tage[k] = a;
    var ks = Object.keys(st.tage).sort();
    while (ks.length > 30) delete st.tage[ks.shift()];
  });
  emit('auftrag', { was: 'neu', sid: f.id, stringId: f.id, sid2: a.sid2, id: a.id });
  return A().tage[k];
}
function offen() { var a = heute(); return a && !a.erledigt ? a : null; }

// Carl fliegt, wenn er es schon kann; sonst hüpft er
function carlFreut(wo) {
  var c = C6.carl;
  if (!c) return;
  try { c.stimmung && c.stimmung('froh'); } catch (e) {}
  if (ruhig()) return;
  try {
    if (typeof c.flieg === 'function') { c.flieg('an'); setTimeout(function () { try { c.flieg('aus'); } catch (e) {} }, 1300); }
    else if (typeof c.huepf === 'function') c.huepf(16);
  } catch (e) {}
}

function erledigt(antwort) {
  var t = String(antwort == null ? '' : antwort).trim();
  var a = heute();
  if (!t || !a || a.erledigt) return false;
  var f = faden(a.sid);
  if (!f) return false;
  // eine Wahrheit oben wie unten: als Zettel an die Leine (setzt auch die Perle); sonst nur die Perle
  try { if (C6.space && typeof C6.space.zettel === 'function') C6.space.zettel(a.sid, t); else if (C6.strings && C6.strings.perle) C6.strings.perle(a.sid, t); } catch (e) {}
  var knoten = false;
  if (a.art === 'verbindung' && a.sid2 && faden(a.sid2)) { try { knoten = !!(C6.strings && C6.strings.knoten && C6.strings.knoten(a.sid, a.sid2, t)); } catch (e) {} }
  var k = a.tag;
  aendern(function (st) { if (st.tage[k]) st.tage[k].erledigt = { t: kurz(t, 240), ts: Date.now() }; });
  var brief = D.getElementById('c6r-a-brief');
  try { C6.muenzen && C6.muenzen.plus && C6.muenzen.plus(1, 'auftrag', brief && !brief.hidden ? brief : undefined); } catch (e) {}
  emit('auftrag', { was: 'erledigt', sid: a.sid, stringId: a.sid, sid2: a.sid2, id: a.id, knoten: knoten });
  carlFreut();
  var danke = knoten ? satz('auftrag.dankeKnoten', { a: kurz(f.titel, 30), b: kurz((faden(a.sid2) || {}).titel, 30) }) : satz('auftrag.danke');
  try { C6.sag && setTimeout(function () { C6.sag(danke); }, ruhig() ? 0 : 420); } catch (e) {}
  return true;
}

// Carl stellt die Aufgabe: freies Feld, ein leiser Chip „Später“
var fragt = false;
function oeffne(o) {
  o = o || {};
  var a = heute();
  if (!a || fragt) return Promise.resolve(null);
  if (a.erledigt) { try { C6.sag && C6.sag(satz('auftrag.schon', { t: kurz(a.erledigt.t, 80) })); } catch (e) {} return Promise.resolve(null); }
  if (!C6.frag) return Promise.resolve(null);
  fragt = true;
  try { C6.carl && C6.carl.stimmung && C6.carl.stimmung('froh'); } catch (e) {}
  var blatt = o.still ? null : blattAuf(a);
  return Promise.resolve(C6.frag(blatt ? '' : a.text, [{ text: 'Später', wert: '__spaeter' }], { frei: true, id: 'auftrag', platzhalter: satz('auftrag.platzhalter', null, true) })).then(function (x) {
    fragt = false;
    var w0 = x && typeof x === 'object' ? (x.wert != null ? x.wert : x.text) : x;
    // das Blatt bleibt liegen, wenn nur eine andere Frage dazwischenkam; es geht mit Antwort, „Später“ oder ✕
    if (w0 != null) blattZu();
    else if (blattEl) { var b = blattEl.querySelector('.c6r-a-antwort'); if (b) b.hidden = false; }
    var w = x && typeof x === 'object' ? (x.wert != null ? x.wert : x.text) : x;
    if (w == null) return null;
    if (w === '__spaeter') { try { C6.sag && C6.sag(satz('auftrag.spaeter')); } catch (e) {} return null; }
    return erledigt(w) ? w : null;
  }, function () { fragt = false; blattZu(); return null; });
}

// Das Blatt: Der Umschlag öffnet sich, das Siegel bricht, das Papier gleitet heraus und faltet sich auf.
// Handschrift, Datum, Gruß. Antworten geht unten im Feld (oder „Später“); ✕/Esc legt den Brief zurück.
var blattEl = null;
function blattAuf(a) {
  if (!a || !D.body) return null;
  blattZu(true);
  var f = faden(a.sid) || {}, du = (C6.S && C6.S.du) || {}, farbe = f.farbe || '#b7852a';
  var d = new Date(a.ts || Date.now());
  var w = mk('div', 'c6r-a-lage'); w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', satz('auftrag.titel', null, true));
  var um = mk('div', 'c6r-a-gross', w);
  um.innerHTML = '<svg class="c6r-a-gross-hinten" viewBox="0 0 320 210" aria-hidden="true"><rect x="4" y="4" width="312" height="202" rx="8" fill="#e6cfa7" stroke="#2b2722" stroke-width="3"/>' +
    '<path d="M6,204 L130,110 M314,204 L190,110" stroke="#2b2722" stroke-opacity=".25" stroke-width="2" fill="none"/></svg>';
  var papier = mk('div', 'c6r-a-papier', um);
  var kopf = mk('div', 'c6r-a-papier-kopf', papier);
  mk('span', 'c6r-a-datum', kopf, d.getDate() + '. ' + MONATE[d.getMonth()]);
  var zu = mk('button', 'c6r-a-zu', kopf); zu.type = 'button'; zu.setAttribute('aria-label', 'Brief zurücklegen');
  zu.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  zu.addEventListener('click', function () { try { C6.schweig && C6.schweig(); } catch (e) {} blattZu(); });
  mk('p', 'c6r-a-anrede', papier, (du.name ? 'Hallo ' + du.name + ',' : 'Hallo,'));
  mk('p', 'c6r-a-text', papier, a.text);
  var gr = mk('p', 'c6r-a-gruss', papier, satz('auftrag.gruss', null, true));
  var bl = mk('span', 'c6r-a-blatt-zeichen', gr); bl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20v-7M12 13c-4 0-6-3-6-6 4 0 6 2.5 6 6zM12 13c4 0 6-3 6-6-4 0-6 2.5-6 6z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  if (f.titel) mk('p', 'c6r-a-zu-space', papier, 'zu „' + kurz(f.titel, 30) + '“');
  var ant = mk('button', 'c6r-a-antwort', papier, 'Antworten'); ant.type = 'button'; ant.hidden = true;
  ant.addEventListener('click', function () { if (!fragt) { blattZu(true); oeffne(); } });
  var vorn = mk('div', 'c6r-a-gross-vorn', um);
  vorn.innerHTML = '<svg viewBox="0 0 320 210" aria-hidden="true"><path d="M4,96 L160,150 L316,96 V200 a6,6 0 0 1 -6,6 H10 a6,6 0 0 1 -6,-6 Z" fill="#efdcb8" stroke="#2b2722" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M6,204 L132,128 M314,204 L188,128" stroke="#2b2722" stroke-opacity=".22" stroke-width="2" fill="none"/></svg>';
  var lasche = mk('div', 'c6r-a-gross-lasche', um);
  lasche.innerHTML = '<svg viewBox="0 0 320 120" aria-hidden="true"><path d="M4,4 L160,112 L316,4 Z" fill="#ecd8b4" stroke="#2b2722" stroke-width="3" stroke-linejoin="round"/></svg>';
  var siegel = mk('div', 'c6r-a-gross-siegel', um);
  siegel.innerHTML = '<svg viewBox="-20 -20 40 40" aria-hidden="true">' + wachs(farbe, 0, 0, 15) + '</svg>';
  D.body.appendChild(w);
  blattEl = w; blattRaum = C6.jetzt;
  w.addEventListener('keydown', function (e) { if (e.key === 'Escape') { try { C6.schweig && C6.schweig(); } catch (x) {} blattZu(); } });
  // Ablauf: Siegel bricht (0,35 s) → Lasche klappt auf (0,45 s) → Papier gleitet heraus und wird groß
  w.classList.add('c6r-a-an');
  if (ruhig()) { w.classList.add('c6r-a-offen', 'c6r-a-gelesen'); }
  else {
    setTimeout(function () { w.classList.add('c6r-a-bricht'); }, 260);
    setTimeout(function () { w.classList.add('c6r-a-offen'); }, 620);
    setTimeout(function () { w.classList.add('c6r-a-gelesen'); }, 1180);
  }
  papier.tabIndex = -1;
  setTimeout(function () { try { papier.focus({ preventScroll: true }); } catch (e) {} }, ruhig() ? 0 : 1300);
  return w;
}
function blattZu(sofort) {
  var w = blattEl; if (!w) return;
  blattEl = null;
  if (sofort || ruhig()) { w.remove(); return; }
  w.classList.add('c6r-a-weg');
  setTimeout(function () { w.remove(); }, 420);
}
var blattRaum = null;
var letzterRaum = null;
try { C6.bus.on('raum', function (r) { r = (r && r.id) || r; if (r && r !== letzterRaum) { fragt = false; if (blattEl && r !== blattRaum) blattZu(true); } letzterRaum = r; }); } catch (e) {}
function mk(tag, cls, vater, text) { var e = D.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (vater) vater.appendChild(e); return e; }

// ---------- Funde ----------
function legeFund(sid, o) {
  o = o || {};
  var f = faden(sid), text = kurz(o.text, 400);
  if (!f || !text) return null;
  var h = o.herkunft === 'du' || o.herkunft === 'recherche' ? o.herkunft : (o.quelle ? 'recherche' : 'carl');
  var liste = A().funde[sid] || [];
  for (var i = 0; i < liste.length; i++) if (liste[i].text === text) return liste[i];
  var fd = { id: neueId('u'), titel: kurz(o.titel || text, 40), text: text, herkunft: h, quelle: o.quelle ? kurz(o.quelle, 160) : herkunft(h), zu: o.zu ? kurz(o.zu, 120) : null, ts: Date.now(), ding: null };
  aendern(function (st) {
    var l = st.funde[sid] = st.funde[sid] || [];
    l.push(fd);
    if (l.length > 30) l.splice(0, l.length - 30);
  });
  if (o.hinlegen !== false) {
    try {
      if (C6.space && C6.space.legeHin) {
        var body = (fd.zu ? 'Zu „' + fd.zu + '“:\n' : '') + text + '\n' + (h === 'recherche' && o.quelle ? herkunft('recherche') + ' · ' + fd.quelle : fd.quelle);
        var id = C6.space.legeHin(sid, { art: 'karte', titel: 'Fund · ' + kurz(fd.titel, 22), text: body, farbe: f.farbe || null });
        if (id) aendern(function (st) { (st.funde[sid] || []).forEach(function (x) { if (x.id === fd.id) x.ding = id; }); });
      }
    } catch (e) {}
  }
  emit('auftrag', { was: 'fund', sid: sid, stringId: sid, id: fd.id });
  return fd;
}
function funde(sid) { return (A().funde[sid] || []).slice(); }

function woerter(t) {
  return (String(t || '').toLowerCase().match(/[a-zäöüß]{4,}/g) || []).filter(function (w) { return !NIX[w]; });
}
// ohne Mitdenken: nur, was du selbst schon einmal geschrieben hast und zur Frage passt
function ausDeinenSaetzen(frage, sid) {
  var q = woerter(frage);
  if (!q.length) return null;
  var jetzt = Date.now(), best = null, bp = 0;
  eigeneSaetze().forEach(function (x) {
    if (!x.ts || jetzt - x.ts < 120000 || x.t.trim() === frage.trim()) return;
    var w = woerter(x.t), p = 0;
    q.forEach(function (a) { if (w.some(function (b) { return b === a || (a.length >= 5 && b.length >= 5 && (b.indexOf(a.slice(0, 5)) === 0)); })) p++; });
    if (p && x.sid === sid) p += 0.5;
    if (p > bp) { bp = p; best = x; }
  });
  return best;
}
function liste(t, n) {
  return String(t || '').split(/\n+/).map(function (z) { return z.replace(/^\s*(?:[-–•*]|\d+[.)])\s*/, '').replace(/\*+/g, '').trim(); }).filter(function (z) { return z.length > 8; }).slice(0, n);
}
var sammelt = {};
function sammle(frage, sid) {
  var f = faden(sid);
  if (!f || !frage) return;
  var jetzt = Date.now();
  if (sammelt[sid] && jetzt - sammelt[sid] < 600000) return;      // nicht nach jeder Frage
  var heuteZahl = funde(sid).filter(function (x) { return tag(x.ts) === tag(); }).length;
  if (heuteZahl >= 4) return;
  sammelt[sid] = jetzt;
  var aufforderung = 'Der Mensch fragt in seinem Vorhaben „' + f.titel + '“: „' + kurz(frage, 300) + '“. Lege zwei kurze Hinweise hin, wo er weiterdenken kann. Als Liste mit „- “, je ein Satz. Keine Quellen, keine Buchtitel, keine Namen von Personen, keine Zahlen, keine Zitate. Wo du unsicher bist, sag es im Satz.';
  var p = null;
  try { p = C6.denk ? C6.denk(aufforderung, { stumm: true }) : null; } catch (e) { p = null; }
  Promise.resolve(p).then(function (t) {
    var l = liste(t, 2);
    if (l.length) { l.forEach(function (z) { legeFund(sid, { text: z, herkunft: 'carl', zu: frage }); }); return true; }
    var x = ausDeinenSaetzen(frage, sid);
    if (x) { legeFund(sid, { text: satz('fund.du', { datum: datum(x.ts), zitat: kurz(x.t, 160) }, true), titel: kurz(x.t, 40), herkunft: 'du', zu: frage }); return true; }
    return false;
  }).then(function (gelegt) {
    if (gelegt && C6.jetzt === 'space') carlFreut();
  }, function () {});
}

// Fragen im Space → Carl sammelt; fertige Recherche → Funde mit ehrlicher Herkunft
function spaceJetzt() { try { return C6.jetzt === 'space' && C6.space && C6.space.jetzt ? C6.space.jetzt() : null; } catch (e) { return null; } }
function hoeren() {
  if (!C6.bus || hoeren.an) return;
  hoeren.an = true;
  C6.bus.on('gesagt', function (d) {
    var t = d && d.t;
    if (!t || !/\?\s*$/.test(String(t).trim()) || woerter(t).length < 1) return;
    var sid = spaceJetzt();
    if (sid) setTimeout(function () { sammle(String(t).trim(), sid); }, 900);
  });
  C6.bus.on('geruest', function (d) {
    if (!d || d.was !== 'fertig' || d.id !== 'recherche' || !d.sid || !d.ding) return;
    var q = d.ding.t || '';
    var teile = Array.isArray(d.ding.teile) ? d.ding.teile : [];
    teile.slice(0, 3).forEach(function (z) {
      if (typeof z === 'string' && z.trim()) legeFund(d.sid, { text: z, herkunft: 'recherche', zu: q, hinlegen: false });
    });
  });
  // Im Space: der Brief wird nicht nur gelesen, man kann ihn beantworten
  C6.bus.on('space', function (d) {
    if (!d || d.was !== 'dingTipp') return;
    var a = heute();
    if (a && !a.erledigt && d.id && d.id === a.ding) { d.genommen = true; oeffne(); }
  });
  C6.bus.on('rundgang', function () { setTimeout(zuhauseBrief, 60); });
  C6.bus.on('raum', function () { setTimeout(zuhauseBrief, 80); });
  C6.bus.on('strings', function () { if (C6.jetzt === 'zuhause') setTimeout(zuhauseBrief, 80); });
  C6.bus.on('geraet', function () { setTimeout(lageBrief, 120); });
}
D.addEventListener('click', function (e) {
  var b = e.target && e.target.closest && e.target.closest('.c6z-sp-ding');
  if (!b) return;
  var a = A().tage[tag()];
  if (!a || a.erledigt || C6.jetzt !== 'space') return;
  var titel = satz('auftrag.titel', null, true);
  if ((b.getAttribute('aria-label') || '').indexOf(titel) !== 0) return;
  if (spaceJetzt() !== a.sid) return;
  e.preventDefault(); e.stopPropagation();
  oeffne();
}, true);

// ---------- Der Brief im Zuhause ----------
// Der Umschlag: Packpapier, Lasche, Wachssiegel mit Carls zwei Keimblättern, eine Briefmarke mit Stempel
function wachs(farbe, cx, cy, r) {
  return '<g class="c6r-a-siegel">' +
    '<path d="M' + (cx - r) + ',' + cy + ' q' + (r * 0.1) + ',' + (-r * 0.95) + ' ' + r + ',' + (-r) + ' q' + (r * 1.05) + ',' + (r * 0.05) + ' ' + r + ',' + (r * 0.95) + ' q' + (-r * 0.05) + ',' + (r * 1.05) + ' ' + (-r * 1.02) + ',' + (r * 1.02) + ' q' + (-r * 0.9) + ',' + (-r * 0.1) + ' ' + (-r * 0.98) + ',' + (-r * 0.97) + 'z" fill="' + farbe + '" stroke="#2b2722" stroke-width="1.6"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.68) + '" fill="none" stroke="#2b2722" stroke-opacity=".35" stroke-width="1"/>' +
    '<path d="M' + cx + ',' + (cy + r * 0.42) + ' v' + (-r * 0.5) + ' M' + cx + ',' + (cy - r * 0.08) + ' q' + (-r * 0.5) + ',' + (-r * 0.05) + ' ' + (-r * 0.5) + ',' + (-r * 0.42) + ' q' + (r * 0.42) + ',' + (r * 0.02) + ' ' + (r * 0.5) + ',' + (r * 0.42) + 'z M' + cx + ',' + (cy - r * 0.08) + ' q' + (r * 0.5) + ',' + (-r * 0.05) + ' ' + (r * 0.5) + ',' + (-r * 0.42) + ' q' + (-r * 0.42) + ',' + (r * 0.02) + ' ' + (-r * 0.5) + ',' + (r * 0.42) + 'z" fill="#fbf7f0" fill-opacity=".8" stroke="#2b2722" stroke-opacity=".5" stroke-width=".9"/>' +
    '<ellipse cx="' + (cx - r * 0.35) + '" cy="' + (cy - r * 0.45) + '" rx="' + (r * 0.28) + '" ry="' + (r * 0.12) + '" fill="#fff" fill-opacity=".35" transform="rotate(-30 ' + (cx - r * 0.35) + ' ' + (cy - r * 0.45) + ')"/></g>';
}
function marke(x, y, farbe) {
  var w = 15, h = 18, z = '';
  for (var i = 0; i <= 5; i++) z += '<circle cx="' + (x + i * 3) + '" cy="' + y + '" r=".9" fill="#c9a979"/><circle cx="' + (x + i * 3) + '" cy="' + (y + h) + '" r=".9" fill="#c9a979"/>';
  for (var j = 0; j <= 6; j++) z += '<circle cx="' + x + '" cy="' + (y + j * 3) + '" r=".9" fill="#c9a979"/><circle cx="' + (x + w) + '" cy="' + (y + j * 3) + '" r=".9" fill="#c9a979"/>';
  return '<g class="c6r-a-marke"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#fffaf0" stroke="#2b2722" stroke-width=".9"/>' + z +
    '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (w - 4) + '" height="' + (h - 4) + '" fill="' + farbe + '" fill-opacity=".22"/>' +
    '<path d="M' + (x + 7.5) + ',' + (y + 14) + ' v-5 M' + (x + 7.5) + ',' + (y + 10) + ' q-3,0 -3.4,-3 q3,0 3.4,3z M' + (x + 7.5) + ',' + (y + 10) + ' q3,0 3.4,-3 q-3,0 -3.4,3z" fill="#8ea37a" stroke="#2b2722" stroke-width=".8"/>' +
    '<path d="M' + (x + 3) + ',' + (y + 15.5) + ' q4.5,-2 9,0" fill="none" stroke="#2b2722" stroke-width=".7"/></g>' +
    '<g class="c6r-a-stempel" fill="none" stroke="#5a4c78" stroke-opacity=".55" stroke-width=".9"><circle cx="' + (x - 3) + '" cy="' + (y + 11) + '" r="7"/><path d="M' + (x - 9) + ',' + (y + 9) + ' q6,-3 12,0 M' + (x - 9) + ',' + (y + 13) + ' q6,-3 12,0"/></g>';
}
var BRIEF = function (farbe, an) {
  return '<svg viewBox="0 0 72 52" aria-hidden="true">' +
    '<defs><linearGradient id="c6r-a-papier" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e2c3"/><stop offset="1" stop-color="#e6cfa7"/></linearGradient></defs>' +
    '<rect x="3" y="5" width="66" height="44" rx="2.5" fill="url(#c6r-a-papier)" stroke="#2b2722" stroke-width="2.2"/>' +
    '<path d="M4,48 L29,27 M68,48 L43,27" fill="none" stroke="#2b2722" stroke-width="1.1" opacity=".3"/>' +
    '<path class="c6r-a-lasche" d="M4,6.5 L36,31 L68,6.5" fill="#ecd8b4" stroke="#2b2722" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M10,10 L36,29" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>' +
    marke(50, 9, farbe) +
    '<text x="9" y="44" font-family="Caveat,cursive" font-weight="700" font-size="8.5" fill="#2b2722" fill-opacity=".8">' + (an ? 'an ' + an : '') + '</text>' +
    wachs(farbe, 36, 31, 6.4) +
    '</svg>';
};
var briefEl = null, briefTag = '', briefSchon = {};
function buehneZuhause() { try { return C6.gebaut ? C6.gebaut('zuhause') : null; } catch (e) { return null; } }
function briefBauen() {
  var b = buehneZuhause();
  if (!b) return null;
  // das Zuhause darf den Brief in seine Ablage legen: dann bleibt es derselbe Brief (nie ein zweiter mit gleicher id)
  if (briefEl && b.contains(briefEl)) return briefEl;
  var alt = D.getElementById('c6r-a-brief'); if (alt && alt !== briefEl && alt.parentNode) alt.parentNode.removeChild(alt);
  briefEl = D.createElement('button');
  briefEl.type = 'button';
  briefEl.id = 'c6r-a-brief';
  briefEl.className = 'c6r-a-brief';
  briefEl.hidden = true;
  briefEl.innerHTML = '<span class="c6r-a-umschlag"></span><span class="c6r-a-fuer"></span>';
  briefEl.addEventListener('click', function (e) {
    e.stopPropagation();
    try { var c = C6.carl; if (c && c.schau) { var r = briefEl.getBoundingClientRect(); c.schau(r.left + r.width / 2, r.top + r.height / 2); } } catch (x) {}
    oeffne();
  });
  b.appendChild(briefEl);
  return briefEl;
}
function lageBrief() {
  if (!briefEl || briefEl.hidden) return;
  if (briefEl.parentNode && briefEl.parentNode.hasAttribute && briefEl.parentNode.hasAttribute('data-c6-ablage')) { briefEl.style.left = ''; briefEl.style.top = ''; return; }
  var b = buehneZuhause(); if (!b) return;
  var br = b.getBoundingClientRect(); if (!br.width) return;
  var comp = C6.geraet === 'computer';
  var w = comp ? 84 : 72, h = briefEl.offsetHeight || (comp ? 86 : 78);
  var tp = b.querySelector('.c6z-teppich'), tr = tp ? tp.getBoundingClientRect() : null;
  var c = b.querySelector('.c6z-carl'), cr = c ? c.getBoundingClientRect() : null;
  var x, y;
  // am rechten Rand des Teppichs, neben Carls Füßen
  if (tr && tr.width) { x = tr.right - br.left - w * (comp ? 1.35 : 1.05); y = tr.top - br.top + tr.height * 0.5 - h * 0.62; }
  else if (cr && cr.width) { x = cr.right - br.left; y = cr.bottom - br.top - h; }
  else { x = br.width * 0.7; y = br.height * 0.7; }
  // nie aufs Dock
  try { var ue = D.querySelector('.c6k-unten'); if (ue) { var ur = ue.getBoundingClientRect(); if (ur.height > 0) y = Math.min(y, ur.top - br.top - h - 10); } } catch (e) {}
  x = Math.max(8, Math.min(br.width - w - 10, x));
  y = Math.max(80, Math.min(br.height - 120, y));
  briefEl.style.left = Math.round(x) + 'px';
  briefEl.style.top = Math.round(y) + 'px';
}
function zuhauseBrief() {
  var a = null;
  try { a = (C6.jetzt === 'zuhause' || buehneZuhause()) ? heute() : null; } catch (e) { a = null; }
  var el = briefBauen();
  if (!el) return;
  var zeigen = !!(a && !a.erledigt && !(C6.rundgang && C6.rundgang.an));
  if (!zeigen) { el.hidden = true; return; }
  var f = faden(a.sid) || {};
  if (briefTag !== a.id) {
    briefTag = a.id;
    var du0 = (C6.S && C6.S.du) || {};
    el.querySelector('.c6r-a-umschlag').innerHTML = BRIEF(f.farbe || '#b7852a', kurz(du0.name || '', 10).replace(/[<&]/g, ''));
    el.querySelector('.c6r-a-fuer').textContent = kurz(f.titel || '', 18);
    el.setAttribute('aria-label', satz('auftrag.titel', null, true) + ': ' + a.text);
  }
  var neu = el.hidden;
  el.hidden = false;
  lageBrief();
  if (C6.jetzt !== 'zuhause' || !neu) return;
  // beim ersten Sehen am Tag schwebt der Brief herunter: Carl hat ihn von oben mitgebracht
  var k = a.tag;
  if (A().gesehen[k]) return;
  aendern(function (st) { st.gesehen = {}; st.gesehen[k] = Date.now(); });
  if (!ruhig() && el.animate) {
    el.classList.add('c6r-a-fliegt');
    setTimeout(function () { el.classList.remove('c6r-a-fliegt'); }, 1500);
    el.animate([
      { transform: 'translate(-40px,-340px) rotate(-18deg)', opacity: 0 },
      { transform: 'translate(20px,-200px) rotate(10deg)', opacity: 1, offset: 0.35 },
      { transform: 'translate(-12px,-70px) rotate(-7deg)', opacity: 1, offset: 0.7 },
      { transform: 'translate(0,0) rotate(-3deg)', opacity: 1 }
    ], { duration: 1800, easing: 'cubic-bezier(.35,.1,.3,1)' });
  }
  setTimeout(function () {
    try { var c = C6.carl; if (c && c.schau) { var r = el.getBoundingClientRect(); c.schau(r.left + r.width / 2, r.top + r.height / 2); } } catch (e) {}
    carlFreut();
  }, ruhig() ? 0 : 1500);
  // ein Satz, nur wenn gerade niemand redet
  if (!briefSchon[k]) {
    briefSchon[k] = 1;
    setTimeout(function () {
      if (C6.jetzt !== 'zuhause' || el.hidden || fragt) return;
      if (C6.denktGerade && C6.denktGerade()) return;
      var g = S().gespraech || [], l = g[g.length - 1];
      if (l && Date.now() - (l.ts || 0) < 5000) return;
      try { C6.sag && C6.sag(satz('auftrag.bringt'), { merken: false }); } catch (e) {}
    }, ruhig() ? 600 : 2600);
  }
}
// Erledigt: der Brief steigt auf, zum Himmel
function briefWeg() {
  if (!briefEl || briefEl.hidden) return;
  var el = briefEl;
  if (ruhig() || !el.animate) { el.hidden = true; return; }
  el.classList.add('c6r-a-fliegt');
  var an = el.animate([
    { transform: 'translate(0,0) rotate(-3deg)', opacity: 1 },
    { transform: 'translate(-10px,-120px) rotate(8deg) scale(.8)', opacity: 1, offset: 0.4 },
    { transform: 'translate(20px,-420px) rotate(-6deg) scale(.4)', opacity: 0 }
  ], { duration: 1200, easing: 'cubic-bezier(.4,0,.6,1)' });
  an.onfinish = function () { el.hidden = true; };
}

C6.auftrag = {
  heute: heute,
  offen: offen,
  erledigt: function (t) { var ok = erledigt(t); if (ok) briefWeg(); return ok; },
  oeffne: function (o) { return oeffne(o); },
  funde: funde,
  legeFund: legeFund,
  herkunft: herkunft,
  _sammle: sammle
};
// Rückgabe von oeffne geht durch die öffentliche Hülle, damit der Brief immer aufsteigt
var _oeffne = oeffne;
oeffne = function (o) { return _oeffne(o).then(function (x) { if (x) briefWeg(); return x; }); };

if (C6.bus) hoeren();
else setTimeout(hoeren, 0);
setTimeout(zuhauseBrief, 400);
window.addEventListener('resize', function () { setTimeout(lageBrief, 120); });
