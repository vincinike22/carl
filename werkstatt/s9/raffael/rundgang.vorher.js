// Rundgang: das erste Öffnen ist die erste Schleife. Ein Kiesel liegt da, du weckst ihn,
// sagst ihm deinen Namen und einen Gedanken; der hängt als erster Zettel in deinem ersten
// Space, von oben ist er dein erster Planet. Carl baut sich dabei zusammen.
// Eine durchsichtige Schicht über den echten Räumen; fehlt ein Raum, steht eine Kulisse da.
var C6 = window.C6;
var ST = function (k, w) { return (C6.stimme && C6.stimme.fest(k, w)) || ''; };
var WAHL = (C6.stimme && C6.stimme.wahl) || { socken: [] };
var NS = 'http://www.w3.org/2000/svg';

// Stationen: raum, wie viele Teile Carl beim Ankommen hat, was gefragt wird
var SCHRITTE = [
  { id: 'wecken', raum: 'zuhause', teile: 0 },
  { id: 'name', raum: 'zuhause', teile: 1, art: 'feld', feld: 'Dein Name', chips: ['Lieber ohne Namen'] },
  { id: 'gedanke', raum: 'zuhause', teile: 2, art: 'feld', feld: 'Ein Satz reicht', chips: ['Später'] },
  { id: 'space', raum: 'space', teile: 4, art: 'feld', feld: 'Ein anderer Name', chips: ['Passt'] },
  { id: 'vogel', raum: 'netz', teile: 4, art: 'knopf', knopf: 'Boden ↓' },
  { id: 'socken', raum: 'zuhause', teile: 4, art: 'farbe' }
];

var R = { an: false, i: 0, ctl: null, el: {}, versteckt: null, token: 0, timer: [], eins: '', feldBlick: 0 };
C6.rundgang = { an: false, start: start, ende: function () { ende(true); } };

function S() { C6.S.du = C6.S.du || {}; C6.S.rundgang = C6.S.rundgang || { schritt: 0, entwurf: {} }; return C6.S; }
var spT = 0;
function sichern() { clearTimeout(spT); spT = setTimeout(function () { C6.speichern && C6.speichern(); }, 250); }
function wart(ms) { var t = R.token; return new Promise(function (ok) { R.timer.push(setTimeout(function () { if (t === R.token) ok(); }, C6.ruhig ? Math.min(ms, 300) : ms)); }); }
function mk(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

// ---------- einmal aufbauen ----------
function bau() {
  if (R.el.schicht) return;
  var wurzel = document.getElementById('c6') || document.body;
  var s = mk('div'); s.id = 'c6r-schicht'; s.hidden = true;
  s.innerHTML =
    '<div class="c6r-kulisse" aria-hidden="true"></div>' +
    '<div class="c6r-schleier" aria-hidden="true"></div>' +
    '<div class="c6r-kopf"><button type="button" class="c6r-zurueck">‹ Zurück</button><button type="button" class="c6r-weg">Überspringen</button></div>' +
    '<div class="c6r-mitte"><div class="c6r-bild" aria-hidden="true"></div><div class="c6r-blase" aria-live="polite"><p class="c6r-satz"></p></div><button type="button" class="c6r-carl" aria-label="Carl"><span class="c6r-figur"></span></button><p class="c6r-hinweis"></p></div>' +
    '<div class="c6r-tafel"><div class="c6r-chips"></div><p class="c6r-notiz"></p><form class="c6r-zeile"><input class="c6r-feld" autocomplete="off" enterkeyhint="next" maxlength="80"><button type="submit" class="c6r-los">Weiter</button></form></div>';
  wurzel.appendChild(s);
  var q = function (c) { return s.querySelector(c); };
  R.el = { schicht: s, kulisse: q('.c6r-kulisse'), schleier: q('.c6r-schleier'), zurueck: q('.c6r-zurueck'), weg: q('.c6r-weg'), mitte: q('.c6r-mitte'), bild: q('.c6r-bild'),
    blase: q('.c6r-blase'), satz: q('.c6r-satz'), carl: q('.c6r-carl'), figur: q('.c6r-figur'), hinweis: q('.c6r-hinweis'), tafel: q('.c6r-tafel'),
    chips: q('.c6r-chips'), notiz: q('.c6r-notiz'), zeile: q('.c6r-zeile'), feld: q('.c6r-feld'), los: q('.c6r-los') };
  try { R.ctl = C6.figur.male(R.el.figur, { groesse: groesse(), rundgang: true }); } catch (e) { R.ctl = null; }
  s.addEventListener('wheel', function (e) { if (e.altKey) e.stopPropagation(); }, { passive: true });
  R.el.zurueck.onclick = zurueck;
  R.el.weg.onclick = function () { ende(false); };
  R.el.carl.onclick = function () { if (SCHRITTE[R.i].id === 'wecken') wecken(); else if (R.ctl && R.ctl.huepf) R.ctl.huepf(); };
  R.el.feld.addEventListener('input', function () {
    S().rundgang.entwurf[SCHRITTE[R.i].id] = R.el.feld.value; sichern(); losZustand();
    var jetzt = Date.now(); if (jetzt - R.feldBlick > 700) { R.feldBlick = jetzt; schau(R.el.feld, 1000); }
  });
  R.el.feld.addEventListener('focus', function () { schau(R.el.feld, 900); });
  // ein gewählter Chip zieht Carls Blick auf sich, danach schaut er wieder frei
  R.el.chips.addEventListener('click', function (e) { var c = e.target && e.target.closest && e.target.closest('.c6r-chip'); if (c) schau(c, 1100); });
  R.el.zeile.addEventListener('submit', function (e) { e.preventDefault(); absenden(); });
  addEventListener('keydown', function (e) { if (R.an && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); zurueck(); } }, true);
  if (window.visualViewport) {
    var vv = function () { if (!R.an) return; s.style.height = visualViewport.height + 'px'; s.style.transform = 'translateY(' + visualViewport.offsetTop + 'px)'; s.classList.toggle('c6r-tast', innerHeight - visualViewport.height > 120); };
    visualViewport.addEventListener('resize', vv); visualViewport.addEventListener('scroll', vv);
  }
  addEventListener('resize', function () { if (R.ctl && R.ctl.groesse) R.ctl.groesse(groesse()); if (R.an) setTimeout(lege, 120); });
}
function groesse() { return innerWidth >= 820 ? 230 : Math.min(170, Math.round(innerHeight * 0.2)); }

// ---------- Kulissen (nur wenn der echte Raum fehlt) ----------
var KUL = {
  zuhause: '<path d="M10 292h380"/><path d="M52 92h86v86H52zM95 92v86M52 135h86"/><path d="M330 292V176M306 176h48l-10-30h-28z"/><path d="M262 292c0-34 40-34 40 0"/><ellipse cx="200" cy="292" rx="92" ry="6"/>',
  fahrrad: '<path d="M10 292h380"/><circle cx="88" cy="226" r="62"/><circle cx="312" cy="226" r="62"/><path d="M88 226l70-96h112l42 96M158 130l42 96h-112M270 130l-70 96M146 116h30M262 100l10 30M252 100h26"/><circle cx="200" cy="226" r="9"/>',
  werkstatt: '<path d="M10 292h380"/><path d="M40 40h320v118H40z"/><path d="M78 62v62M70 62h16M128 60l24 56M128 60l22-6M204 64c-14 24 14 26 0 50M270 60v62m-14 0h28M322 62v44"/><path d="M14 226h110M30 226v66M108 226v66M276 226h110M292 226v66M370 226v66M300 226v-22h30v22"/>',
  bibliothek: '<path d="M10 292h380"/><path d="M24 40v252M124 40v252M24 110h100M24 190h100M24 270h100M276 40v252M376 40v252M276 110h100M276 190h100M276 270h100"/><path d="M40 110V74M54 110V80M68 110V70M96 110V84M44 190v-34M58 190v-28M86 190v-36M50 270v-36M66 270v-30M292 110V78M306 110V72M334 110V84M296 190v-30M324 190v-38M340 190v-26M300 270v-34M352 270v-30"/>',
  space: '<path d="M10 292h380"/><path d="M30 70c90 26 250 26 340 0" class="c6r-faden"/><path d="M150 82v18M146 100h46v40h-46zM250 82v16"/>',
  netz: '<path d="M10 210C90 120 150 250 220 170S330 90 390 120" class="c6r-faden"/><circle cx="220" cy="170" r="6" class="c6r-knoten"/>'
};
function kulisse(id) {
  var k = R.el.kulisse, echt = !!(C6.raeume && C6.raeume[id]);
  k.classList.toggle('c6r-zu', echt); R.el.bild.classList.toggle('c6r-zu', echt);
  if (echt || k.dataset.raum === id) return;
  k.dataset.raum = id;
  var svg = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet"><g fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + (KUL[id] || KUL.zuhause) + '</g>';
  if (id === 'netz') { var b = (S().du.baut || '').slice(0, 28); svg += b ? '<text x="64" y="186" class="c6r-fadenwort">' + b.replace(/[<&>]/g, '') + '</text>' : ''; }
  R.el.bild.innerHTML = svg + '</svg>';
  k.classList.toggle('c6r-oben', id === 'netz'); R.el.bild.classList.toggle('c6r-oben', id === 'netz');
}

// ---------- in einen Raum, ohne dass dessen Carl stört ----------
function geh(st) {
  kulisse(st.raum);
  R.el.schicht.classList.toggle('c6r-vogel', st.raum === 'netz');
  if (C6.raeume && C6.raeume[st.raum] && C6.jetzt !== st.raum) {
    var o = { rundgang: true, zeig: st.zeig };
    if (st.raum === 'space') o.string = S().rundgang.sid || null;
    try { C6.geh(st.raum, o); } catch (e) {}
  }
  still();
  // Räume begrüßen manchmal etwas später; im Rundgang spricht nur dieser Carl
  [80, 700, 1500, 2600].forEach(function (ms) { R.timer.push(setTimeout(still, ms)); });
}
function still() {
  if (!R.an) return;
  if (C6.carl && C6.carl !== R.ctl && C6.carl.el && C6.carl.el !== R.versteckt) {
    if (R.versteckt) R.versteckt.style.visibility = '';
    R.versteckt = C6.carl.el; R.versteckt.style.visibility = 'hidden';
  }
  try { C6.eingabe && C6.eingabe.zeig && C6.eingabe.zeig(false); } catch (e) {}
  if (C6.leiste) C6.leiste.style.visibility = 'hidden';
  if (C6.schweig) try { C6.schweig(); } catch (e) {}
}

// ---------- Carl spricht (Wort für Wort, ohne Sprung) ----------
function sag(text, frage) {
  var b = R.el.blase, p = R.el.satz;
  b.classList.remove('c6r-da');
  return new Promise(function (ok) {
    R.timer.push(setTimeout(function () {
      p.textContent = '';
      var teile = [text, frage].filter(Boolean), n = 0;
      teile.forEach(function (t, j) {
        if (j) p.appendChild(document.createTextNode(' '));
        var span = mk('span', j && frage ? 'c6r-frage' : '');
        t.split(' ').forEach(function (w, k) {
          if (k) span.appendChild(document.createTextNode(' '));
          var wo = mk('span', 'c6r-wort', w); wo.style.transitionDelay = (C6.ruhig ? 0 : n++ * 26) + 'ms'; span.appendChild(wo);
        });
        p.appendChild(span);
      });
      b.hidden = !teile.length;
      lege();
      void b.offsetWidth; b.classList.add('c6r-da');
      R.timer.push(setTimeout(lege, 520)); R.timer.push(setTimeout(lege, 1100));
      R.timer.push(setTimeout(ok, C6.ruhig ? 50 : 220 + n * 26));
    }, b.hidden ? 0 : 160));
  });
}

// ---------- die Blase sucht sich einen Platz, an dem sie keinen Text des Raums verdeckt ----------
function textRects() {
  var raum = C6.gebaut && C6.jetzt ? C6.gebaut(C6.jetzt) : null, r = [];
  if (!raum || R.el.kulisse.classList.contains('c6r-zu') === false) return r;
  var w = document.createTreeWalker(raum, NodeFilter.SHOW_TEXT, null), n, rg = document.createRange();
  while ((n = w.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    var el = n.parentElement; if (!el) continue;
    var cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity < 0.1) continue;
    rg.selectNodeContents(n);
    var q = rg.getBoundingClientRect();
    if (q.width > 2 && q.height > 2 && q.bottom > 0 && q.top < innerHeight) r.push(q);
  }
  return r;
}
function schnitt(a, b) { var x = Math.min(a.right, b.right) - Math.max(a.left, b.left), y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return x > 0 && y > 0 ? x * y : 0; }
function lege() {
  var b = R.el.blase;
  if (b.hidden || R.el.schicht.classList.contains('c6r-vogel') || SCHRITTE[R.i].id === 'wecken') { b.style.transform = ''; b.classList.remove('c6r-frei'); return; }
  // Grundlage ist die Lage ohne Verschiebung
  var alt = b.style.transform, da = b.classList.contains('c6r-da');
  b.style.transition = 'none'; b.style.transform = da ? 'none' : '';
  var a = b.getBoundingClientRect();
  b.style.transform = alt; void b.offsetWidth; b.style.transition = '';
  var setze = function (dx, dy) { var v = (dx || dy) ? 'translate(' + dx + 'px,' + dy + 'px)' : ''; if (b.style.transform !== v) b.style.transform = v; b.classList.toggle('c6r-frei', !!(dx || dy < -20)); };
  var txt = textRects();
  if (!txt.length || !a.width) { setze(0, 0); return; }
  var c = R.el.figur.getBoundingClientRect(), k = R.el.schicht.querySelector('.c6r-kopf').getBoundingClientRect(), t = R.el.tafel.getBoundingClientRect();
  var comp = innerWidth >= 820;
  var dxs = comp ? [0, -(a.width + c.width * 0.8 + 40)] : [0];
  var dys = [30]; for (var d = 0; a.top + d >= k.bottom + 4; d -= 20) dys.push(d); dys.push(Math.round(k.bottom + 6 - a.top));
  var best = null;
  dxs.forEach(function (dx) {
    dys.forEach(function (dy) {
      var q = { left: a.left + dx, right: a.right + dx, top: a.top + dy, bottom: a.bottom + dy };
      if (q.top < k.bottom + 4 || q.left < 8 || q.right > innerWidth - 8 || q.bottom > t.top + 20) return;
      var carl = schnitt(q, { left: c.left + c.width * 0.15, right: c.right - c.width * 0.15, top: c.top + c.height * 0.12, bottom: c.bottom });
      if (carl > 0) return;
      var f = 0; txt.forEach(function (x) {
        var s0 = schnitt(q, x); if (!s0) return;
        var ganz = s0 >= (x.right - x.left) * (x.bottom - x.top) - 1;
        f += ganz ? s0 : (x.right - x.left) * (x.bottom - x.top) * 3;   // halb abgeschnittene Wörter sind schlimmer als verdeckte
      });
      var kosten = f + (Math.abs(dy) + Math.abs(dx) * 0.5) * 2;   // lieber nah bei Carl
      if (!best || kosten < best.k) best = { k: kosten, dx: dx, dy: dy };
    });
  });
  setze(best ? best.dx : 0, best ? best.dy : 0);
}
function teile(n) { try { R.ctl && R.ctl.teile && R.ctl.teile(n); } catch (e) {} R.el.carl.dataset.teile = n; }
function stimmung(s) { try { R.ctl && R.ctl.stimmung && R.ctl.stimmung(s); } catch (e) {} }

// ---------- Tafel: Antworten ----------
// Carl schaut kurz auf das, was gerade passiert (Mitte eines Elements), dann von selbst zurück
function schau(el, ms) {
  try {
    if (!R.an || !R.ctl || !R.ctl.blickZu || !el || el.hidden) return;
    var r = el.getBoundingClientRect(); if (!r.width) return;
    R.ctl.blickZu(r.left + r.width / 2, r.top + r.height / 2, ms);
  } catch (e) {}
}
function chip(text, cls) { var c = mk('button', 'c6r-chip' + (cls ? ' ' + cls : ''), text); c.type = 'button'; return c; }
function tafel(st) {
  var du = S().du, ch = R.el.chips, f = R.el.feld;
  ch.innerHTML = ''; R.el.notiz.textContent = ''; R.el.tafel.hidden = !st.art;
  R.el.tafel.dataset.art = st.art || '';
  R.el.zeile.hidden = !st.feld;
  if (!st.art) return;
  if (st.art === 'feld') st.chips.forEach(function (t) { var c = chip(t); c.onclick = function () { waehle(c, function () { antwort(st, null); }); }; ch.appendChild(c); });
  if (st.art === 'farbe') WAHL.socken.forEach(function (o) {
    var c = chip('', 'c6r-farbe'); c.innerHTML = '<i style="background:' + o[0] + '"></i><span>' + o[1] + '</span>'; if (du.socken === o[0]) c.classList.add('c6r-an');
    c.onclick = function () { waehle(c, function () { antwort(st, o[0]); }); }; ch.appendChild(c);
  });
  if (st.art === 'knopf') { var k = chip(st.knopf, 'c6r-haupt'); k.onclick = function () { antwort(st, null); }; ch.appendChild(k); }
  Array.prototype.forEach.call(ch.children, function (c, i) { c.style.setProperty('--i', i); });
  // Feld: Entwurf bleibt, sonst die schon gegebene Antwort
  var alt = { name: du.name, gedanke: du.baut, space: '' };
  var e = S().rundgang.entwurf[st.id];
  f.value = e != null ? e : (alt[st.id] || '');
  f.placeholder = st.feld || '';
  f.setAttribute('aria-label', st.feld || '');
  losZustand();
}
function losZustand() {
  var st = SCHRITTE[R.i], hat = R.el.feld.value.trim().length > 0;
  R.el.los.disabled = !hat;
}
// wie auf Papier ankreuzen: kurz gefüllt, dann weiter
function waehle(c, f) {
  if (R.el.tafel.classList.contains('c6r-warte')) return;
  R.el.chips.querySelectorAll('.c6r-an').forEach(function (x) { x.classList.remove('c6r-an'); });
  c.classList.add('c6r-an'); R.el.tafel.classList.add('c6r-warte');
  var t = R.token; setTimeout(function () { R.el.tafel.classList.remove('c6r-warte'); if (t === R.token) f(); }, C6.ruhig ? 60 : 300);
}
function absenden() {
  var st = SCHRITTE[R.i]; if (!st.feld || R.el.los.disabled) return;
  var v = R.el.feld.value.trim();
  if (!v) return;
  antwort(st, v);
}

// ---------- eine Antwort: Zustand, ein neues Teil, ein Satz ----------
function antwort(st, v) {
  var tok = ++R.token;
  R.el.tafel.classList.add('c6r-weg');
  try { document.activeElement && document.activeElement.blur && document.activeElement.blur(); } catch (e) {}
  var du = S().du, danke = '', neu = null;
  if (st.id === 'name') { du.name = (v || '').slice(0, 40); neu = 2; danke = du.name ? ST('rg.nameDanke', { name: du.name }) : C6.stimme.alle['rg.nameDanke'][1]; stimmung('froh'); }
  if (st.id === 'gedanke') {
    du.baut = (v || '').slice(0, 80); neu = 3; stimmung('staunt');
    if (du.baut) { danke = ST('rg.gedankeDanke'); ersterSpace(du.baut); } else danke = ST('rg.gedankeLeer');
  }
  if (st.id === 'space') {
    var sid = S().rundgang.sid, eig = (v || '').trim();
    if (eig && sid && C6.strings && C6.strings.umbenennen) try { C6.strings.umbenennen(sid, eig.slice(0, 40)); } catch (e) {}
    danke = ST('rg.spaceDanke'); stimmung('froh');
  }
  if (st.id === 'socken') { du.socken = v; try { R.ctl && R.ctl.kleid && R.ctl.kleid({ socken: v }); } catch (e) {} R.el.carl.style.setProperty('--c6r-socke', v); neu = 5; danke = ST('rg.ganz'); stimmung('froh'); }
  sichern();
  if (neu != null) teile(neu);
  if (neu === 4) R.timer.push(setTimeout(function () { if (tok === R.token) try { R.ctl && R.ctl.huepf && R.ctl.huepf(8); } catch (e) {} }, 480));
  var weiter = function () {
    if (tok !== R.token) return;
    if (st.id === 'socken') return ende(true);
    // ohne Gedanken gibt es noch keinen Space: dann gleich nach oben
    var n = R.i + 1; if (SCHRITTE[n].id === 'space' && !S().rundgang.sid) n++;
    zeig(n);
  };
  if (!danke) return weiter();
  sag(danke).then(function () { return wart(st.id === 'socken' ? 1100 : 500); }).then(weiter);
}
// der erste Gedanke wird der erste Space, der Satz hängt darin als erster Zettel (derselbe Weg wie am Feld)
function ersterSpace(t) {
  var rg = S().rundgang, sid = rg.sid;
  try {
    if (sid && !(C6.strings && C6.strings.hol && C6.strings.hol(sid))) sid = null;
    if (!sid && C6.space && C6.space.neu) sid = C6.space.neu(kurzname(t), { oeffnen: false });
    if (!sid) return;
    rg.sid = sid;
    C6.S.samenErklaert = C6.S.samenErklaert || Date.now();   // Carl nennt den Samen hier, im Space nicht noch einmal
    C6.aendern(function (s) {
      var x = s.spaces && s.spaces[sid]; if (!x) return;
      x.notizen = x.notizen || [];
      var letzt = x.notizen[x.notizen.length - 1];
      if (!letzt || letzt.t !== t) x.notizen.push({ t: t, ts: Date.now(), place: x.jetzt || (x.places || [])[0] || null });
    });
    if (C6.strings && C6.strings.perle) C6.strings.perle(sid, t);
    C6.bus && C6.bus.emit('space', { was: 'zettel', stringId: sid });
  } catch (e) {}
}
// Carls Namensvorschlag für einen Space; ohne die Funktion im Kern: die ersten Wörter
function kurzname(t) {
  var k = '', satz = String(t || '').trim();
  try { if (C6.space && typeof C6.space.kurzname === 'function') k = String(C6.space.kurzname(satz) || '').trim(); } catch (e) { k = ''; }
  // Carls Vorschlag gilt, wenn er ganz ist (kein „…“) und mehr sagt als das erste Wort des Satzes
  var erstes = satz.split(/\s+/)[0] || '';
  if (k && !/…|\.\.\.$/.test(k) && k.length <= 26 && (k.indexOf(' ') > 0 || k.toLowerCase() !== erstes.toLowerCase())) return k;
  // sonst aus dem Satz: ganze Wörter, nie mitten im Wort
  var leer = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|für|mit|und|oder|zu|im|in|am|an|auf|von|vom|zum|zur|ich|wie|was|man|will|möchte|muss|soll)$/i;
  var w = satz.replace(/[.!?,;:„“"]+/g, ' ').split(/\s+/).filter(Boolean);
  while (w.length > 1 && leer.test(w[0])) w.shift();
  var putz = function (a) { a = a.slice(); while (a.length > 1 && leer.test(a[a.length - 1])) a.pop(); return a.join(' '); };
  var n = putz(w);
  if (n.length > 24 && w.length > 3 && w.length <= 5) { var r = putz([w[0]].concat(w.slice(-2))); if (r.length <= 24) n = r; }
  if (n.length > 24) { var g = ''; for (var i = 0; i < w.length; i++) { var x = g ? g + ' ' + w[i] : w[i]; if (x.length > 24 && g) break; g = x; } n = putz(g.split(' ')); }
  n = n || erstes || 'Mein Space';
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function titelVon(sid) { try { var f = C6.strings && C6.strings.hol && C6.strings.hol(sid); return f ? f.titel : ''; } catch (e) { return ''; } }
function kurz(t) { return t.length > 32 ? t.slice(0, 30).replace(/\s+\S*$/, '') + ' …' : t; }

// ---------- eine Station zeigen ----------
function zeig(i) {
  var tok = ++R.token;
  R.timer.forEach(clearTimeout); R.timer = [];
  R.i = Math.max(0, Math.min(SCHRITTE.length - 1, i));
  var st = SCHRITTE[R.i];
  S().rundgang.schritt = R.i; sichern();
  R.el.schicht.dataset.schritt = st.id;
  R.el.zurueck.hidden = R.i < 2;
  // sobald der Gedanke an der Leine hängt, schreibt Carl mit Tinte
  R.el.schicht.classList.toggle('c6r-tinte', ['space', 'vogel', 'socken'].indexOf(st.id) >= 0);
  R.el.tafel.classList.add('c6r-weg');
  R.el.hinweis.textContent = '';
  teile(st.teile);
  geh(st);
  if (st.id === 'wecken') {
    R.el.schleier.classList.remove('c6r-auf'); R.el.blase.hidden = true; R.el.tafel.hidden = true;
    stimmung('schlaeft');
    wart(1400).then(function () { if (tok === R.token) R.el.hinweis.textContent = ST('rg.wecken'); });
    return;
  }
  R.el.schleier.classList.add('c6r-auf');
  if (st.id === 'vogel' && S().du.baut && !S().rundgang.sid && C6.strings && C6.strings.erster) try { C6.strings.erster(); } catch (e) {}
  stimmung(st.id === 'vogel' || st.id === 'space' ? 'staunt' : 'ruhig');
  var satz = { space: ST('rg.space') }[st.id];
  var frage = { name: ST('rg.name'), gedanke: ST('rg.gedanke'), space: ST('rg.spaceName', { kurz: titelVon(S().rundgang.sid) || kurzname(S().du.baut) }), socken: ST('rg.socken') }[st.id];
  if (st.id === 'vogel') satz = S().rundgang.sid || S().du.baut ? ST('rg.vogel') : ST('rg.vogelLeer');
  tafel(st);
  R.el.tafel.hidden = false;
  // Feld und Chips stehen sofort da, Carl spricht daneben (wie ein Blatt mit Frage)
  R.el.tafel.classList.remove('c6r-weg');
  if (st.feld && C6.geraet === 'computer') try { R.el.feld.focus({ preventScroll: true }); } catch (e) {}
  sag(satz, frage);
  // wenn die Chips erscheinen, sieht er kurz hin (sonst zum Feld)
  wart(420).then(function () { if (tok !== R.token) return; var z = R.el.chips.firstElementChild ? R.el.chips : (st.feld ? R.el.feld : null); if (z) schau(z, 1000); });
}

function wecken() {
  var tok = ++R.token;
  R.el.hinweis.textContent = '';
  R.el.carl.classList.add('c6r-wach');
  try { R.ctl && R.ctl.drueck && R.ctl.drueck(); } catch (e) {}
  wart(C6.ruhig ? 0 : 190).then(function () {
    if (tok !== R.token) return;
    teile(1); stimmung('staunt');
    R.el.schleier.classList.add('c6r-auf');
    R.timer.push(setTimeout(function () { if (tok === R.token) try { R.ctl && R.ctl.huepf && R.ctl.huepf(14); } catch (e) {} }, 420));
    return sag(ST('rg.wach')).then(function () { return wart(1100); }).then(function () { if (tok === R.token) zeig(1); });
  });
}

function zurueck() {
  if (!R.an) return;
  if (R.i <= 1) return;
  zeig(R.i - 1);
}

// ---------- Anfang und Ende ----------
// der Schatten des schlafenden Kiesels liest das Licht der Rundgang-Bühne (die Schicht liegt außerhalb der Bühne)
function lichtUebernehmen() {
  var b = R.buehne, z = R.el.schicht; if (!z) return;
  var hat = false;
  if (b) ['dx', 'dy', 'a'].forEach(function (k) {
    var v = b.style.getPropertyValue('--c6-schatten-' + k);
    if (v) { z.style.setProperty('--c6r-schatten-' + k, v.trim()); hat = true; }
  });
  if (hat || !C6.lichtquelle || !C6.lichtquelle.hol) return;
  // Bühne noch nicht gebaut: dieselbe Rechnung wie der Kern, aus der Quelle des Rundgangs
  try {
    var q = C6.lichtquelle.hol('rundgang'), w = window.innerWidth, h = window.innerHeight;
    var dx = (0.5 - q.x) * w, dy = (0.5 - q.y) * h, l = Math.hypot(dx, dy) || 1, len = 8 + 30 * (1 - q.hoehe);
    z.style.setProperty('--c6r-schatten-dx', (dx / l * len).toFixed(1) + 'px');
    z.style.setProperty('--c6r-schatten-dy', Math.max(2, Math.abs(dy / l) * len * 0.5 + 2).toFixed(1) + 'px');
    z.style.setProperty('--c6r-schatten-a', (0.08 + 0.2 * q.staerke).toFixed(2));
  } catch (e) {}
}
function start(opts) {
  bau();
  if (R.an) return;
  lichtUebernehmen();
  R.an = C6.rundgang.an = true;
  document.documentElement.classList.add('c6r-an');
  C6.bus && C6.bus.emit('rundgang', true);
  var rg = S().rundgang; if (!rg.start) rg.start = Date.now();
  R.el.schicht.hidden = false; R.el.schicht.classList.remove('c6r-aus', 'c6r-fertig');
  if (S().du.socken) R.el.carl.style.setProperty('--c6r-socke', S().du.socken);
  var i = opts && opts.neu ? 0 : (rg.schritt || 0);
  if (i > 0) { R.el.carl.classList.add('c6r-wach'); }
  zeig(i);
}

// eine leise Einladung zum Wochenende: eine Wahl, keine Pflicht
function einladen() {
  try {
    var rg = S().rundgang;
    if (rg.eingeladen || !C6.lernweg || !C6.lernweg.oeffne || !C6.frag) return;
    var wl = C6.lernweg.stand ? C6.lernweg.stand() : null;
    if (wl && (wl.fertig || []).length >= (wl.alle || 6)) return;
    rg.eingeladen = Date.now(); sichern();
    var ja = ST('lernweg.einladungJa') || 'Zeig mal', weg = false;
    C6.frag(null, [{ t: ja, wert: 'ja' }], { leise: true, id: 'rg-wochenende' }).then(function (w) {
      weg = true;
      if (w === 'ja') try { C6.lernweg.oeffne(); } catch (e) {}
    });
    // nur dieses eine Mal, gleich nach dem Rundgang: wer weitergeht oder den Kalender nimmt, dem bleibt der Kalender
    var raeumen = function () {
      if (weg) return; weg = true;
      var chip = [].some.call(document.querySelectorAll('.c6k-chip'), function (c) { return c.textContent.trim() === ja; });
      if (chip && C6.schweig) try { C6.schweig(); } catch (e) {}
    };
    if (C6.bus) { C6.bus.on('raum', raeumen); C6.bus.on('lernweg', raeumen); }
    setTimeout(raeumen, 30000);
  } catch (e) {}
}
function ende(ganz) {
  if (!R.an) return;
  ++R.token; R.timer.forEach(clearTimeout); R.timer = [];
  var s = S(), du = s.du, rg = s.rundgang;
  // Text, der noch im Feld steht, geht nicht verloren
  var st = SCHRITTE[R.i], v = R.el.feld.value.trim();
  if (v && !ganz) { if (st.id === 'name') du.name = v; if (st.id === 'gedanke') { du.baut = v.slice(0, 80); ersterSpace(du.baut); } }
  if (!du.carlName) du.carlName = 'Carl';
  du.tun = du.tun || []; du.nie = du.nie || [];
  if (du.name == null) du.name = '';
  if (du.baut == null) du.baut = '';
  if (du.arbeit == null) du.arbeit = '';
  if (du.ton == null) du.ton = '';
  if (du.socken == null) du.socken = '';
  du.fertig = true;
  rg.dauer = Math.round((Date.now() - (rg.start || Date.now())) / 1000);
  rg.uebersprungen = !ganz;
  if (C6.aendern) C6.aendern(function () {}); else C6.speichern && C6.speichern();
  if (du.baut && C6.strings && C6.strings.erster) try { C6.strings.erster(); } catch (e) {}
  teile(5);
  var echt = typeof C6.schweig === 'function' && C6.raeume && C6.raeume.zuhause;
  var fertig = function () {
    R.an = C6.rundgang.an = false;
    document.documentElement.classList.remove('c6r-an');
    if (R.versteckt) { R.versteckt.style.visibility = ''; R.versteckt = null; }
    try { C6.eingabe && C6.eingabe.zeig && C6.eingabe.zeig(true); } catch (e) {}
    if (C6.leiste) C6.leiste.style.visibility = '';
    C6.bus && C6.bus.emit('rundgang', false);
    var satz = C6.stimme.erster();
    if (echt) {
      R.el.schicht.hidden = true;
      if (C6.jetzt !== 'zuhause') C6.geh('zuhause');
      try { if (C6.carl && C6.carl.kleid && du.socken) C6.carl.kleid({ socken: du.socken }); C6.carl && C6.carl.stimmung && C6.carl.stimmung('froh'); } catch (e) {}
      setTimeout(function () { C6.sag(satz); einladen(); }, 250);
    } else {
      // ohne fertigen Kern bleibt Carl hier stehen und sagt seinen ersten Satz selbst
      R.el.schicht.classList.remove('c6r-aus'); R.el.schicht.classList.add('c6r-fertig');
      kulisse('zuhause'); R.el.schicht.classList.remove('c6r-vogel');
      sag(satz);
      try { C6.gespraech && C6.gespraech('carl', satz); } catch (e) {}
      // sobald du antwortest, tritt die Schicht zurück
      if (C6.bus) C6.bus.on('gesagt', function weg() { if (!R.an) R.el.schicht.hidden = true; });
    }
  };
  if (ganz) { R.el.schicht.classList.add('c6r-aus'); setTimeout(fertig, C6.ruhig ? 50 : 420); } else fertig();
}

C6.raum({
  id: 'rundgang', name: 'Rundgang', dock: false, leiste: false,
  bauen: function (buehne) {
    buehne.classList.add('c6r-buehne');
    R.buehne = buehne;
    if (C6.bus) C6.bus.on('licht', function (d) { if (d && d.raum === 'rundgang') lichtUebernehmen(); });
    return {
      betreten: function (o) { start(o); },
      verlassen: function () {}
    };
  }
});
