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
  var vor = letzteArt(), start = vor ? (ARTEN.indexOf(vor) + 1) % ARTEN.length : 0;
  var x = null, art = 'satz';
  for (var i = 0; i < ARTEN.length && !x; i++) { art = ARTEN[(start + i) % ARTEN.length]; x = versuch(art, f); }
  if (!x) { art = 'satz'; x = versuch('satz', f); }
  var a = { id: neueId('a'), tag: k, art: art, sid: f.id, sid2: x.sid2 || null, titel: f.titel, text: x.text, zitat: x.zitat || null, ts: Date.now(), ding: null, erledigt: null };
  aendern(function (st) {
    st.tage[k] = a;
    var ks = Object.keys(st.tage).sort();
    while (ks.length > 30) delete st.tage[ks.shift()];
  });
  // auch im Space liegt der Brief
  try {
    if (C6.space && C6.space.legeHin) {
      var dingId = C6.space.legeHin(f.id, { art: 'karte', titel: satz('auftrag.titel', null, true), text: a.text + '\n' + satz('auftrag.gruss', null, true), farbe: f.farbe || null });
      if (dingId) aendern(function (st) { if (st.tage[k]) st.tage[k].ding = dingId; });
    }
  } catch (e) {}
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
  try { C6.strings && C6.strings.perle && C6.strings.perle(a.sid, t); } catch (e) {}
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
function oeffne() {
  var a = heute();
  if (!a || fragt) return Promise.resolve(null);
  if (a.erledigt) { try { C6.sag && C6.sag(satz('auftrag.schon', { t: kurz(a.erledigt.t, 80) })); } catch (e) {} return Promise.resolve(null); }
  if (!C6.frag) return Promise.resolve(null);
  fragt = true;
  try { C6.carl && C6.carl.stimmung && C6.carl.stimmung('froh'); } catch (e) {}
  var ps = ''; try { ps = C6.bausteine && C6.bausteine.erinnerung ? C6.bausteine.erinnerung() : ''; } catch (e) { ps = ''; }
  return Promise.resolve(C6.frag((ps ? ps + ' ' : '') + a.text, [{ text: 'Später', wert: '__spaeter' }], { frei: true, id: 'auftrag', platzhalter: satz('auftrag.platzhalter', null, true) })).then(function (x) {
    fragt = false;
    var w = x && typeof x === 'object' ? (x.wert != null ? x.wert : x.text) : x;
    if (w == null) return null;
    if (w === '__spaeter') { try { C6.sag && C6.sag(satz('auftrag.spaeter')); } catch (e) {} return null; }
    return erledigt(w) ? w : null;
  }, function () { fragt = false; return null; });
}

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
var BRIEF = function (farbe) {
  return '<svg viewBox="0 0 72 52" aria-hidden="true">' +
    '<rect x="3" y="5" width="66" height="44" rx="3" fill="#fbf7f0" stroke="#2b2722" stroke-width="2.4"/>' +
    '<path d="M4,7 L36,31 L68,7" fill="none" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M4,48 L28,26 M68,48 L44,26" fill="none" stroke="#2b2722" stroke-width="1.4" opacity=".35"/>' +
    '<circle class="c6r-a-siegel" cx="36" cy="31" r="7" fill="' + farbe + '" stroke="#2b2722" stroke-width="1.8"/>' +
    '<path d="M33,31 q3,-4 6,0 q-3,4 -6,0z" fill="#fbf7f0" opacity=".85"/>' +
    '</svg>';
};
var briefEl = null, briefTag = '', briefSchon = {};
function buehneZuhause() { try { return C6.gebaut ? C6.gebaut('zuhause') : null; } catch (e) { return null; } }
function briefBauen() {
  var b = buehneZuhause();
  if (!b) return null;
  if (briefEl && briefEl.parentNode === b) return briefEl;
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
    el.querySelector('.c6r-a-umschlag').innerHTML = BRIEF(f.farbe || '#b7852a');
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
  oeffne: function () { return oeffne(); },
  funde: funde,
  legeFund: legeFund,
  herkunft: herkunft,
  _sammle: sammle
};
// Rückgabe von oeffne geht durch die öffentliche Hülle, damit der Brief immer aufsteigt
var _oeffne = oeffne;
oeffne = function () { return _oeffne().then(function (x) { if (x) briefWeg(); return x; }); };

if (C6.bus) hoeren();
else setTimeout(hoeren, 0);
setTimeout(zuhauseBrief, 400);
window.addEventListener('resize', function () { setTimeout(lageBrief, 120); });
