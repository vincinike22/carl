// Brief von Carl, im Postfach der Rezeption: einer am Tag. Was heute und in den nächsten Tagen ansteht, was Carl schon
// vorbereitet hat, und eine Frage (eine Vorbereitung oder eine kleine Aufgabe aus einem deiner Fäden). Dazu Funde zu dem, was du suchst.
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
  'fund.bringt': ['Ich hab dir was dazu gesammelt. Es liegt hier am Boden.'],
  'brief.titel': ['Brief von Carl'],
  'brief.heute': ['Heute: {liste}.'],
  'brief.heuteLeer': ['Heute steht nichts an.'],
  'brief.naechste': ['Danach: {liste}.'],
  'brief.vorbereitet': ['Schon vorbereitet: {liste}.'],
  'brief.frageVorb': ['{titel}, {wann}. Soll ich dir {was} machen?'],
  'brief.ja': ['Ja, mach das'],
  'brief.gruss': ['Bis bald. Carl'],
  'brief.bringt': ['Im Postfach liegt ein Brief. Was ansteht, steht drin.'],
  'vorb.laeuft': ['Ich mach mich dran. Einen Moment.'],
  'vorb.fertig': ['Fertig. Es liegt im Fach bei „{titel}“.'],
  'vorb.keinKopf': ['Dafür brauche ich jemanden, der mitdenkt. Hier denkt gerade keiner mit.'],
  'vorb.leer': ['Daraus ist nichts Brauchbares geworden. Ich lass es lieber, als dir Unsinn hinzulegen.'],
  'vorb.keinKopf.karteikarten': ['Mitdenken geht hier gerade nicht, also schreib ich dir keine Fragen. Ich leg dir einen leeren Stapel hin.'],
  'vorb.keinKopf.packliste': ['Mitdenken geht hier gerade nicht, darum rate ich dir keine Packliste. Ich leg dir eine leere hin.'],
  'vorb.keinKopf.merkzettel': ['In deinen Zetteln stand noch nichts dazu. Ich leg dir einen leeren Merkzettel hin.'],
  'vorb.fertig.karteikarten': ['Fertig. {n} Karten für „{titel}“ liegen im Fach.'],
  'vorb.schon': ['Dafür hab ich schon was vorbereitet. Es liegt im Fach.'],
  'vorb.nein': ['Nicht nötig'],
  'vorb.neinGut': ['Gut. Dazu frag ich nicht nochmal.'],
  'brief.naechsteLeer': ['In den nächsten Tagen steht bei mir nichts.'],
  'brief.woher': ['Woher ich das weiß: {quellen}.'],
  'brief.erster': ['Das ist dein Postfach. Hier liegt an jedem Tag, an dem etwas ansteht, ein Brief von mir: was kommt und was ich dafür schon vorbereitet habe.'],
  'brief.nichtsVerbunden': ['Noch seh ich keinen Kalender und keinen Termin von dir. Erfinden mag ich keinen.'],
  'brief.frageLeer': ['Gibt es etwas, das ich wissen sollte?'],
  'brief.frageWichtig': ['Was davon ist dir am wichtigsten?'],
  'brief.spaceName': ['Was ansteht'],
  'brief.zettel': ['Hängt als Zettel in „{titel}“.'],
  'brief.aus': ['Gut. Ab jetzt bring ich dir keinen Brief mehr.'],
  'brief.wiederAn': ['Dein Brief liegt wieder im Postfach.'],
  'brief.zettelNeu': ['Hängt als erster Zettel in einem neuen Space, „{titel}“. Du findest ihn im Zuhause am Brett.']
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
// Der Schalter (im Buch): aus = kein Brief im Postfach, Carl bringt keinen und sagt nichts dazu
function briefAn() { return A().aus !== true; }
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
  if (!briefAn()) return null;
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
function tageBrief() { try { return C6.tage && C6.tage.brief ? C6.tage.brief() : null; } catch (e) { return null; } }
var WAS = { karteikarten: 'Karteikarten', packliste: 'eine Packliste', merkzettel: 'einen Merkzettel' };
function wannVon(n) { return n === 0 ? 'heute' : n === 1 ? 'morgen' : n === 2 ? 'übermorgen' : 'in ' + n + ' Tagen'; }
function frageVorbText(f) { return satz('brief.frageVorb', { titel: f.termin.titel, wann: wannVon(f.termin.abstand), was: WAS[f.vorb] || f.vorb }, true); }
function oeffne(o) {
  o = o || {};
  if (fragt || !briefAn()) return Promise.resolve(null);
  // das Briefing (an der Rezeption): ohne Aufgabe, oder mit der Frage nach einer Vorbereitung
  var b = o.still || o.aufgabe ? null : tageBrief();
  if (b) {
    briefGelesen(b);
    if (b.frage && b.frage.art === 'vorbereiten') return vorbFrage(b);
    if (b.frage && (b.frage.art === 'wichtig' || b.frage.art === 'leer')) return freieFrage(b);
    if (!(b.frage && b.frage.art === 'aufgabe')) { blattAuf(null, b); return Promise.resolve(null); }
  }
  var a = heute();
  if (!a) return Promise.resolve(null);
  if (a.erledigt) { try { C6.sag && C6.sag(satz('auftrag.schon', { t: kurz(a.erledigt.t, 80) })); } catch (e) {} return Promise.resolve(null); }
  if (!C6.frag) return Promise.resolve(null);
  fragt = true;
  try { C6.carl && C6.carl.stimmung && C6.carl.stimmung('froh'); } catch (e) {}
  var blatt = o.still ? null : blattAuf(a, b);
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

function vorbFrage(b) {
  var f = b.frage;
  if (!C6.frag || !C6.tage) { blattAuf(null, b); return Promise.resolve(null); }
  fragt = true;
  try { C6.carl && C6.carl.stimmung && C6.carl.stimmung('froh'); } catch (e) {}
  blattAuf(null, b);
  return Promise.resolve(C6.frag('', [{ text: satz('brief.ja', null, true), wert: '__ja' }, { text: 'Später', wert: '__spaeter' }], { id: 'brief' })).then(function (x) {
    fragt = false;
    var w = x && typeof x === 'object' ? (x.wert != null ? x.wert : x.text) : x;
    if (w == null) return null;
    blattZu();
    if (w === '__nein') { try { C6.tage.ablehnen(f.termin.id); C6.sag && C6.sag(satz('vorb.neinGut', null, true)); } catch (e) {} postBrief(); return null; }
    if (w !== '__ja') { try { C6.sag && C6.sag(satz('auftrag.spaeter')); } catch (e) {} return null; }
    try { C6.sag && C6.sag(satz('vorb.laeuft', null, true), { merken: false }); } catch (e) {}
    try { C6.carl && C6.carl.stimmung && C6.carl.stimmung('arbeitet'); } catch (e) {}
    return C6.tage.vorbereiten(f.termin, f.vorb).then(function (r) {
      try { C6.carl && C6.carl.stimmung && C6.carl.stimmung(r && r.ok ? 'froh' : 'ruhig'); } catch (e) {}
      var ti = kurz(f.termin.titel, 40);
      var t = r && r.ok && r.leer ? satz('vorb.keinKopf.' + f.vorb, null, true)
        : r && r.ok ? (f.vorb === 'karteikarten' && r.n > 1 ? satz('vorb.fertig.karteikarten', { n: r.n, titel: ti }, true) : satz('vorb.fertig', { titel: ti }, true))
        : r && r.grund === 'schon' ? satz('vorb.schon', null, true)
        : (r && r.satz) || satz(r && r.grund === 'kein-kopf' ? 'vorb.keinKopf' : 'vorb.leer', null, true);
      try { C6.sag && C6.sag(t); } catch (e) {}
      if (r && r.ok) carlFreut();
      postBrief();
      return null;
    });
  }, function () { fragt = false; blattZu(); return null; });
}
function freieFrage(b) {
  if (!C6.frag) { blattAuf(null, b); return Promise.resolve(null); }
  fragt = true;
  blattAuf(null, b);
  return Promise.resolve(C6.frag('', [{ text: 'Später', wert: '__spaeter' }], { frei: true, id: 'brief', platzhalter: satz('auftrag.platzhalter', null, true) })).then(function (x) {
    fragt = false;
    var w = x && typeof x === 'object' ? (x.wert != null ? x.wert : x.text) : x;
    if (w == null) return null;
    blattZu();
    if (w === '__spaeter') { try { C6.sag && C6.sag(satz('auftrag.spaeter')); } catch (e) {} return null; }
    var t = String(w).trim(); if (!t) return null;
    var f = waehleFaden(), neu = false;
    if (!f) { try { f = C6.strings && C6.strings.neu ? C6.strings.neu({ titel: satz('brief.spaceName', null, true), art: 'idee' }) : null; neu = !!f; } catch (e) { f = null; } }
    var sid = f && (f.id || f);
    if (sid) { try { if (C6.space && typeof C6.space.zettel === 'function') C6.space.zettel(sid, t); else if (C6.strings && C6.strings.perle) C6.strings.perle(sid, t); } catch (e) {} }
    var k = tag();
    aendern(function (st) { st.antwort = st.antwort || {}; st.antwort[k] = { t: kurz(t, 240), ts: Date.now(), sid: sid || null }; });
    var ft = sid ? (faden(sid) || {}).titel || satz('brief.spaceName', null, true) : '';
    try { C6.sag && C6.sag(sid ? satz(neu ? 'brief.zettelNeu' : 'brief.zettel', { titel: kurz(ft, 30) }, true) : satz('auftrag.danke')); } catch (e) {}
    carlFreut();
    postBrief();
    return t;
  }, function () { fragt = false; blattZu(); return null; });
}
function briefGelesen(b) {
  var k = tag();
  try { C6.tage && C6.tage.nenne && C6.tage.nenne(b); } catch (e) {}
  if (A().gelesen === k) return;
  aendern(function (st) { st.gelesen = k; });
  if (briefEl) briefEl.classList.add('c6r-a-ist-gelesen');
  emit('brief', { da: !!(briefEl && !briefEl.hidden), gelesen: true });
}

// Das Blatt: Der Umschlag öffnet sich, das Siegel bricht, das Papier gleitet heraus und faltet sich auf.
// Handschrift, Datum, Gruß. Antworten geht unten im Feld (oder „Später“); ✕/Esc legt den Brief zurück.
var blattEl = null;
function terminText(t, mitTag) {
  var vor = mitTag ? t.wochentag + ' ' + (+t.tag.slice(8)) + '.' : '';
  return t.termine.map(function (x) { return (vor ? vor + ' ' : '') + (x.zeit ? x.zeit + ' ' : '') + x.titel; }).join(' · ');
}
var VNAME = { karteikarten: 'Karteikarten', packliste: 'Packliste', merkzettel: 'Merkzettel' };
function briefing(papier, b) {
  if (b.erster) {
    mk('p', 'c6r-a-text c6r-a-heute', papier, satz('brief.erster', null, true));
    var st = null; try { st = C6.tage.status(); } catch (e) {}
    if (st && st.kalender !== 'verbunden') mk('p', 'c6r-a-text', papier, satz('brief.nichtsVerbunden', null, true));
    if (b.frage) mk('p', 'c6r-a-text c6r-a-frage', papier, satz('brief.frageLeer', null, true));
    return;
  }
  var h = b.heute.map(function (x) { return (x.zeit ? x.zeit + ' ' : '') + x.titel; }).join(' · ');
  mk('p', 'c6r-a-text c6r-a-heute', papier, h ? satz('brief.heute', { liste: h }, true) : satz('brief.heuteLeer', null, true));
  if (b.naechste.length) mk('p', 'c6r-a-text c6r-a-naechste', papier, satz('brief.naechste', { liste: b.naechste.map(function (d) { return terminText(d, true); }).join(' · ') }, true));
  else if (h) mk('p', 'c6r-a-text c6r-a-naechste', papier, satz('brief.naechsteLeer', null, true));
  if (b.vorbereitet.length) mk('p', 'c6r-a-text c6r-a-vorb', papier, satz('brief.vorbereitet', { liste: b.vorbereitet.map(function (v) { return (VNAME[v.art] || v.art) + ' für „' + kurz(v.titel, 40) + '“'; }).join(' · ') }, true));
  if (b.frage && b.frage.art === 'vorbereiten') mk('p', 'c6r-a-text c6r-a-frage', papier, frageVorbText(b.frage));
  if (b.frage && (b.frage.art === 'wichtig' || b.frage.art === 'leer')) mk('p', 'c6r-a-text c6r-a-frage', papier, satz(b.frage.art === 'wichtig' ? 'brief.frageWichtig' : 'brief.frageLeer', null, true));
  // woher Carl es weiß: nur die Quellen, die wirklich im Brief stehen
  var q = {}, alle = b.heute.slice(); b.naechste.forEach(function (d) { alle = alle.concat(d.termine); });
  alle.forEach(function (x) { if (x.quelle === 'kalender') q['dein Kalender'] = 1; else if (x.werkzeugId) { var w = C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(x.werkzeugId) : null; q[w ? 'dein Werkzeug „' + kurz(w.name, 24) + '“' : 'deine Werkzeuge'] = 1; } });
  var ql = Object.keys(q);
  if (ql.length) mk('p', 'c6r-a-woher', papier, satz('brief.woher', { quellen: ql.join(', ') }, true));
}
function anrede(name) {
  var z = 'tag'; try { z = ({ morgen: 'morgen', mittag: 'tag', abend: 'abend', nacht: 'nacht' })[C6.tageszeit ? C6.tageszeit() : ''] || 'tag'; } catch (e) {}
  var t = ''; try { t = C6.stimme && C6.stimme.fest ? C6.stimme.fest('brief.anrede.' + z, {}) : ''; } catch (e) { t = ''; }
  if (t && !/\{/.test(t)) return t;
  return name ? 'Hallo ' + name + ',' : 'Hallo,';
}
function blattAuf(a, b) {
  if ((!a && !b) || !D.body) return null;
  blattZu(true);
  var f = (a && faden(a.sid)) || {}, du = (C6.S && C6.S.du) || {}, farbe = f.farbe || '#b7852a';
  var d = new Date((a && a.ts) || Date.now());
  var w = mk('div', 'c6r-a-lage'); w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', satz(b ? 'brief.titel' : 'auftrag.titel', null, true));
  var um = mk('div', 'c6r-a-gross', w);
  um.innerHTML = '<svg class="c6r-a-gross-hinten" viewBox="0 0 320 210" aria-hidden="true"><rect x="4" y="4" width="312" height="202" rx="8" fill="#e6cfa7" stroke="#2b2722" stroke-width="3"/>' +
    '<path d="M6,204 L130,110 M314,204 L190,110" stroke="#2b2722" stroke-opacity=".25" stroke-width="2" fill="none"/></svg>';
  var papier = mk('div', 'c6r-a-papier', um);
  var kopf = mk('div', 'c6r-a-papier-kopf', papier);
  mk('span', 'c6r-a-datum', kopf, d.getDate() + '. ' + MONATE[d.getMonth()]);
  var zu = mk('button', 'c6r-a-zu', kopf); zu.type = 'button'; zu.setAttribute('aria-label', 'Brief zurücklegen');
  zu.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  zu.addEventListener('click', function () { try { C6.schweig && C6.schweig(); } catch (e) {} blattZu(); });
  mk('p', 'c6r-a-anrede', papier, b ? anrede(du.name) : (du.name ? 'Hallo ' + du.name + ',' : 'Hallo,'));
  if (b) briefing(papier, b);
  if (a && !a.erledigt) mk('p', 'c6r-a-text c6r-a-aufgabe', papier, a.text);
  var gr = mk('p', 'c6r-a-gruss', papier, satz(b ? 'brief.gruss' : 'auftrag.gruss', null, true));
  var bl = mk('span', 'c6r-a-blatt-zeichen', gr); bl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20v-7M12 13c-4 0-6-3-6-6 4 0 6 2.5 6 6zM12 13c4 0 6-3 6-6-4 0-6 2.5-6 6z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  if (f.titel && a && !a.erledigt) mk('p', 'c6r-a-zu-space', papier, 'zu „' + kurz(f.titel, 30) + '“');
  var ant = mk('button', 'c6r-a-antwort', papier, 'Antworten'); ant.type = 'button'; ant.hidden = true;
  if (!a || a.erledigt) ant.remove();
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
  C6.bus.on('rundgang', function () { setTimeout(postBrief, 60); });
  C6.bus.on('raum', function () { setTimeout(postBrief, 80); });
  C6.bus.on('strings', function () { setTimeout(postBrief, 80); });
  C6.bus.on('tage', function (d) { if (d && (d.was === 'stand' || d.was === 'vorbereitet')) setTimeout(postBrief, 0); });
  C6.bus.on('rezeption-welt', function (d) { if (d && d.was === 'gebaut') setTimeout(postBrief, 0); });
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

// ---------- Der Brief im Postfach der Rezeption ----------
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
function postfach() { try { return C6.rezeption && typeof C6.rezeption.postfach === 'function' ? C6.rezeption.postfach() : null; } catch (e) { return null; } }
function briefBauen() {
  var b = postfach();
  if (!b) return null;
  if (briefEl && briefEl.parentNode === b) return briefEl;
  if (!briefEl) {
    var alt = D.getElementById('c6r-a-brief'); if (alt && alt.parentNode) alt.parentNode.removeChild(alt);
    briefEl = D.createElement('button');
    briefEl.type = 'button';
    briefEl.id = 'c6r-a-brief';
    briefEl.className = 'c6r-a-brief';
    briefEl.hidden = true;
    briefEl.innerHTML = '<span class="c6r-a-umschlag"></span>';
    briefEl.addEventListener('click', function (e) {
      e.stopPropagation();
      try { var c = C6.carl; if (c && c.schau) { var r = briefEl.getBoundingClientRect(); c.schau(r.left + r.width / 2, r.top + r.height / 2); } } catch (x) {}
      oeffne();
    });
  }
  // derselbe Brief zieht um, wenn das Postfach der Welt nach dem Ersatz kommt (nie ein zweiter mit gleicher id)
  b.appendChild(briefEl);
  return briefEl;
}
// Was heute im Brief steht: das Briefing (C6.tage) oder, ohne es, die Aufgabe des Tages
function briefStand() {
  if (C6.rundgang && C6.rundgang.an) return null;
  if (!briefAn()) return null;
  var b = tageBrief(), a = null;
  try { a = heute(); } catch (e) { a = null; }
  if (b) return { schl: b.tag + '|' + JSON.stringify([b.heute.length, b.naechste.length, b.vorbereitet.length, b.frage && (b.frage.art + (b.frage.termin ? b.frage.termin.id : ''))]) + '|' + (a && !a.erledigt ? a.id : ''), b: b, a: a && !a.erledigt ? a : null, farbe: (a && faden(a.sid) || {}).farbe };
  if (a && !a.erledigt) return { schl: a.id, b: null, a: a, farbe: (faden(a.sid) || {}).farbe };
  return null;
}
function postBrief() {
  var el = briefBauen();
  if (!el) return;
  var x = briefStand();
  if (!x) { el.hidden = true; briefMelden(); return; }
  if (briefTag !== x.schl) {
    briefTag = x.schl;
    var du0 = (C6.S && C6.S.du) || {};
    el.querySelector('.c6r-a-umschlag').innerHTML = BRIEF(x.farbe || '#b7852a', kurz(du0.name || '', 10).replace(/[<&]/g, ''));
    var n = x.b ? x.b.heute.length : 0;
    el.setAttribute('aria-label', satz(x.b ? 'brief.titel' : 'auftrag.titel', null, true) + (x.b ? (n ? ', heute ' + (n === 1 ? 'ein Termin' : n + ' Termine') : '') + (x.b.frage ? ', mit einer Frage' : '') : ': ' + x.a.text));
  }
  el.classList.toggle('c6r-a-ist-gelesen', A().gelesen === tag());
  var neu = el.hidden;
  el.hidden = false;
  briefMelden();
  if (C6.jetzt !== 'rezeption' || !neu) return;
  // beim ersten Sehen am Tag fällt der Brief ins Postfach: Carl hat ihn mitgebracht
  var k = tag();
  if (A().gesehen[k]) return;
  aendern(function (st) { st.gesehen = {}; st.gesehen[k] = Date.now(); st.zuletzt = Date.now(); });
  if (!ruhig() && el.animate) {
    el.classList.add('c6r-a-fliegt');
    setTimeout(function () { el.classList.remove('c6r-a-fliegt'); }, 1300);
    el.animate([
      { transform: 'translate(-30px,-160px) rotate(-14deg)', opacity: 0 },
      { transform: 'translate(12px,-90px) rotate(8deg)', opacity: 1, offset: 0.4 },
      { transform: 'translate(-6px,-24px) rotate(-5deg)', opacity: 1, offset: 0.75 },
      { transform: 'translate(0,0) rotate(-3deg)', opacity: 1 }
    ], { duration: 1200, easing: 'cubic-bezier(.35,.1,.3,1)' });
  }
  setTimeout(function () {
    try { var c = C6.carl; if (c && c.schau) { var r = el.getBoundingClientRect(); c.schau(r.left + r.width / 2, r.top + r.height / 2); } } catch (e) {}
  }, ruhig() ? 0 : 1200);
  // ein Satz, nur wenn gerade niemand redet
  if (!briefSchon[k]) {
    briefSchon[k] = 1;
    setTimeout(function () {
      if (C6.jetzt !== 'rezeption' || el.hidden || fragt) return;
      if (C6.denktGerade && C6.denktGerade()) return;
      var g = S().gespraech || [], l = g[g.length - 1];
      if (l && Date.now() - (l.ts || 0) < 5000) return;
      try { if (C6.rezeption && C6.rezeption.sag) C6.rezeption.sag(satz(x.b ? 'brief.bringt' : 'auftrag.bringt', null, true)); } catch (e) {}
    }, ruhig() ? 600 : 1800);
  }
}
// Erledigt: der Brief steigt auf, zum Himmel
function briefWeg() {
  if (!briefEl || briefEl.hidden) return;
  // steht noch etwas an, bleibt der Brief im Postfach (ohne Frage); nur ein leerer Brief steigt auf
  if (briefStand()) { briefTag = ''; postBrief(); return; }
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

// das Postfach fragt: liegt ein Brief da? (Bus 'brief' bei jeder Änderung)
var briefDa = null;
function briefMelden() { var da = !!(briefEl && !briefEl.hidden); if (da !== briefDa) { briefDa = da; emit('brief', { da: da, gelesen: A().gelesen === tag() }); } }
function briefSchalte(an) {
  an = !!an;
  if (an === briefAn()) return an;
  aendern(function (st) { if (an) delete st.aus; else st.aus = true; });
  if (!an && blattEl) blattZu(true);
  briefTag = '';
  postBrief();
  // an der Rezeption gilt Carls Satz zum Brief dann nicht mehr: er sagt, was jetzt stimmt
  if (!fragt && C6.jetzt === 'rezeption') {
    try { C6.schweig && C6.schweig(); } catch (e) {}
    var jetztDa = !!(briefEl && !briefEl.hidden);
    try { if (C6.rezeption && C6.rezeption.sag && (!an || jetztDa)) C6.rezeption.sag(satz(an ? 'brief.wiederAn' : 'brief.aus', null, true)); } catch (e) {}
  }
  emit('brief', { was: 'schalter', an: an });
  return an;
}
C6.brief = { beantwortet: function () { var a = A().antwort; return !!(a && a[tag()]); }, da: function () { return !!(briefEl && !briefEl.hidden); }, gelesen: function () { return A().gelesen === tag(); }, oeffne: function () { return oeffne(); },
  // der Schalter (Bus 'brief' {was:'schalter', an}); zuletzt = wann Carl zuletzt einen Brief gebracht hat (ms, bleibt gespeichert)
  an: briefAn, setze: briefSchalte, zuletzt: function () { var a = A(); if (a.zuletzt) return a.zuletzt; var g = a.gesehen || {}, m = 0; Object.keys(g).forEach(function (k) { m = Math.max(m, +g[k] || 0); }); return m || null; } };
C6.auftrag = {
  heute: heute,
  offen: offen,
  erledigt: function (t) { var ok = erledigt(t); if (ok) briefWeg(); return ok; },
  oeffne: function (o) { return oeffne(o); },
  funde: funde,
  legeFund: legeFund,
  herkunft: herkunft,
  _sammle: sammle,
  beantwortet: function () { var a = A().antwort; return !!(a && a[tag()]); }
};
// Rückgabe von oeffne geht durch die öffentliche Hülle, damit der Brief immer aufsteigt
var _oeffne = oeffne;
oeffne = function (o) { return _oeffne(o).then(function (x) { if (x) briefWeg(); return x; }); };

if (C6.bus) hoeren();
else setTimeout(hoeren, 0);
setTimeout(postBrief, 400);
