/* Rezeption · die Welt hinter allem.
   Füllt den Slot .c6rz-welt der Rezeption beim ersten Betreten: Wand, Fenster nach der Uhr, Tresen, Lampe,
   eine Tasse Tee (das eine Lebenszeichen) und die Tischglocke (das eine Ding zum Denken).
   Fasst weder Carl noch das Feld an; Licht meldet sie dem Kern, damit Schatten im Raum stimmen. */
(function () {
  if (typeof C6 === 'undefined' || !C6.bus) return;
  var T = '#2b2722', RAUM = 'rezeption';
  var root = null, glocke = null, geklingelt = 0, warteUhr = null, warteBis = 0;

  function zeit() {
    try { if (typeof C6.tageszeit === 'function') { var t = C6.tageszeit(); if (/^(morgen|mittag|abend|nacht)$/.test(t)) return t; } } catch (e) {}
    var h = new Date().getHours();
    return h >= 6 && h < 11 ? 'morgen' : h >= 11 && h < 17 ? 'mittag' : h >= 17 && h < 21 ? 'abend' : 'nacht';
  }
  function satz(k, ersatz) {
    try { if (C6.stimme && C6.stimme.fest) { var s = C6.stimme.fest(k, {}); if (s) return s; } } catch (e) {}
    return ersatz;
  }

  // Bilder: einfache Formen, eine Tuschelinie, warme Flächen
  function fensterBild() {
    return '<svg viewBox="0 0 160 150" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="c6rw-himmel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="c6rw-himmel-1"/><stop offset="1" class="c6rw-himmel-2"/></linearGradient></defs>' +
      '<rect x="0" y="0" width="160" height="140" rx="6" fill="url(#c6rw-himmel)" stroke="' + T + '" stroke-width="3"/>' +
      '<g style="clip-path:inset(2px round 5px)">' +
      '<circle class="c6rw-sonne" cx="118" cy="40" r="15" fill="#fff6cf" opacity="0"/>' +
      '<g class="c6rw-abendlicht"><circle cx="126" cy="88" r="14" fill="#ffd48a"/><path d="M0 96 H160" stroke="#f7c58e" stroke-width="2" opacity=".6"/></g>' +
      '<g class="c6rw-mond"><circle cx="116" cy="38" r="13" fill="#f3e6b8"/><circle cx="122" cy="33" r="11" fill="#243052"/></g>' +
      '<g class="c6rw-sterne" fill="#f3e6b8"><circle cx="34" cy="28" r="1.8"/><circle cx="60" cy="54" r="1.4"/><circle cx="20" cy="60" r="1.2"/><circle cx="92" cy="20" r="1.3"/><circle cx="72" cy="30" r="1"/></g>' +
      '<path class="c6rw-huegel" d="M0 112 q40 -26 85 -8 t75 -6 V140 H0 Z" opacity=".95"/>' +
      '</g>' +
      '<path d="M80 0 V140 M0 70 H160" stroke="' + T + '" stroke-width="3"/>' +
      '<rect x="-8" y="137" width="176" height="11" rx="2" fill="#c99e66" stroke="' + T + '" stroke-width="2"/>' +
      '</svg>';
  }
  function lampeBild() {
    return '<div class="c6rw-glut"></div><svg viewBox="0 0 60 92" aria-hidden="true" focusable="false">' +
      '<ellipse class="c6rw-lampenschein" cx="30" cy="40" rx="20" ry="14" fill="#ffe3a0" opacity="0"/>' +
      '<path d="M22 88 h16 l-3 -6 h-10 z" fill="#2f5f8a" stroke="' + T + '" stroke-width="2"/>' +
      '<path d="M30 82 V30" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M8 36 Q30 -6 52 36 Z" fill="#2f5f8a" stroke="' + T + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M30 36 Q30 -6 52 36 Z" fill="#2b2722" opacity=".14"/>' +
      '<circle class="c6rw-birne" cx="30" cy="38" r="6" fill="#f0d9a0" stroke="' + T + '" stroke-width="2"/>' +
      '</svg>';
  }
  function tasseBild() {
    return '<svg viewBox="0 0 48 60" aria-hidden="true" focusable="false">' +
      '<path class="c6rw-dampf" d="M18 30 c-4 -6 4 -8 0 -14 c-3 -5 2 -8 2 -11"/>' +
      '<path class="c6rw-dampf" d="M28 31 c-4 -6 4 -8 0 -14 c-3 -5 2 -8 2 -11"/>' +
      '<ellipse cx="22" cy="56" rx="18" ry="3" fill="#2b2722" opacity=".12"/>' +
      '<path d="M8 34 h28 v10 a14 14 0 0 1 -28 0 z" fill="#fbf7f0" stroke="' + T + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M36 37 q10 1 8 9 q-2 6 -9 6" fill="none" stroke="' + T + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<ellipse cx="22" cy="34" rx="14" ry="3" fill="#c9884a" stroke="' + T + '" stroke-width="2"/>' +
      '</svg>';
  }
  function glockeBild() {
    return '<svg viewBox="0 0 52 44" aria-hidden="true" focusable="false">' +
      '<circle class="c6rw-ring" cx="26" cy="24" r="18"/><circle class="c6rw-ring" cx="26" cy="24" r="18"/>' +
      '<ellipse cx="26" cy="41" rx="22" ry="3" fill="#2b2722" opacity=".14"/>' +
      '<path d="M6 40 h40 a2 2 0 0 0 0 -4 h-40 a2 2 0 0 0 0 4 z" fill="#2b2722" stroke="' + T + '" stroke-width="2"/>' +
      '<g class="c6rw-kuppel"><path d="M8 36 Q8 14 26 12 Q44 14 44 36 Z" fill="#e0b964" stroke="' + T + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M26 36 Q26 14 44 36 Z" fill="#2b2722" opacity=".12"/><path d="M13 30 Q15 18 24 15" fill="none" stroke="#fff3c4" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>' +
      '<g class="c6rw-knopf"><rect x="23" y="6" width="6" height="8" rx="1.5" fill="#2b2722"/><circle cx="26" cy="6" r="4" fill="#e0b964" stroke="' + T + '" stroke-width="2"/></g>' +
      '</svg>';
  }

  // Die Glocke antwortet: wahr je Zustand (vor dem ersten Klingeln, danach, nachts)
  function glockeSatz() {
    var n = zeit() === 'nacht';
    if (!geklingelt) return n
      ? satz('rezeption.glocke.nacht', 'Nachts klingelt die Glocke leiser. Wach bin ich trotzdem. Sag mir deinen Satz, mehr braucht es nicht.')
      : satz('rezeption.glocke', 'Die Glocke klingelt nur hier auf dem Tresen. Ich bin schon da. Sag mir deinen Satz, mehr braucht es nicht.');
    return satz('rezeption.glocke.geklingelt', 'Die Glocke hat geklingelt, mehr tut sie nicht. Gesehen hab ich dich vorher schon.');
  }
  // Beim Klingeln spricht Carl über die eine Blase am Tresen und freut sich kurz (höchstens 1,5 s), dann steht er wieder ruhig
  var frohUhr = null;
  function carlFreut() {
    try {
      if (C6.jetzt !== RAUM || !C6.carl || typeof C6.carl.stimmung !== 'function') return;
      C6.carl.stimmung('froh');
      if (frohUhr) clearTimeout(frohUhr);
      frohUhr = setTimeout(function () { frohUhr = null; try { if (C6.jetzt === RAUM && C6.carl && C6.carl.stimmung) C6.carl.stimmung('ruhig'); } catch (e) {} }, 1400);
    } catch (e) {}
  }
  function klingeln() {
    if (!glocke) return;
    geklingelt++;
    glocke.classList.remove('c6rw-klingt');
    void glocke.offsetWidth;
    glocke.classList.add('c6rw-klingt');
    glocke.setAttribute('aria-label', 'Tischglocke, hat geklingelt');
    setTimeout(function () { if (glocke) glocke.classList.remove('c6rw-klingt'); }, 800);
    var t = glockeSatz();
    try { if (C6.staunen) { if (C6.staunen.zu) C6.staunen.zu('rz-glocke'); C6.staunen.text('rz-glocke', t); } } catch (e) {}
    try {
      if (C6.rezeption && typeof C6.rezeption.sag === 'function') C6.rezeption.sag(t);
      else if (C6.sag) C6.sag(t, { merken: false });
    } catch (e) {}
    carlFreut();
    try { C6.bus.emit('rezeption-welt', { was: 'glocke', n: geklingelt }); } catch (e) {}
  }

  // Licht: am Tag kommt es vom Fenster links oben, abends und nachts von der Lampe links auf dem Tresen
  function licht(tz) {
    var comp = C6.geraet === 'computer';
    var q = tz === 'nacht' ? { x: comp ? 0.26 : 0.14, y: 0.3, art: 'lampe', warm: 0.9, staerke: 0.7, hoehe: 0.5 }
      : tz === 'abend' ? { x: comp ? 0.26 : 0.14, y: 0.3, art: 'lampe', warm: 0.85, staerke: 0.65, hoehe: 0.55 }
      : tz === 'morgen' ? { x: 0.12, y: 0.14, art: 'fenster', warm: 0.7, staerke: 0.85, hoehe: 0.7 }
      : { x: 0.14, y: 0.12, art: 'fenster', warm: 0.5, staerke: 0.8, hoehe: 0.75 };
    try { if (C6.lichtquelle && C6.lichtquelle.setze) C6.lichtquelle.setze(RAUM, q); } catch (e) {}
  }
  function setzeZeit() {
    if (!root) return;
    var tz = zeit();
    if (root.getAttribute('data-zeit') === tz) return;
    root.setAttribute('data-zeit', tz);
    licht(tz);
    try { if (C6.staunen && C6.staunen.text) C6.staunen.text('rz-glocke', glockeSatz()); } catch (e) {}
  }

  function baue(slot) {
    if (root || !slot) return;
    root = document.createElement('div');
    root.className = 'c6rw';
    root.setAttribute('data-zeit', zeit());
    root.innerHTML =
      '<div class="c6rw-wand" aria-hidden="true"></div>' +
      '<div class="c6rw-boden" aria-hidden="true"></div>' +
      '<div class="c6rw-schein" aria-hidden="true"></div>' +
      '<div class="c6rw-fenster" aria-hidden="true">' + fensterBild() + '</div>' +
      '<div class="c6rw-tresen" aria-hidden="true"><div class="c6rw-kante"></div><div class="c6rw-front"></div><div class="c6rw-sockel"></div></div>' +
      '<div class="c6rw-lampe" aria-hidden="true">' + lampeBild() + '</div>' +
      '<div class="c6rw-tasse" aria-hidden="true">' + tasseBild() + '</div>' +
      '<button type="button" class="c6rw-glocke" data-c6rw-ding="glocke" aria-label="Tischglocke">' + glockeBild() + '</button>';
    slot.appendChild(root);
    glocke = root.querySelector('.c6rw-glocke');
    glocke.addEventListener('click', klingeln);
    try { if (C6.staunen && C6.staunen.an) C6.staunen.an(glocke, 'rz-glocke', glockeSatz()); } catch (e) {}
    licht(zeit());
    C6.bus.on('tageszeit', setzeZeit);
  }

  function slotVon() {
    var b = document.querySelector('.c6-buehne[data-raum="' + RAUM + '"]');
    return b ? b.querySelector('.c6rz-welt') : null;
  }
  function versuche() {
    if (root) return true;
    var s = slotVon();
    if (s) { baue(s); return true; }
    return false;
  }
  // Der Slot entsteht, wenn die Rezeption gebaut wird; kommt er einen Takt später, warten wir kurz (höchstens 2 s)
  function wenn(id) {
    var r = id && typeof id === 'object' ? id.id : id;
    if (r !== RAUM || root) return;
    if (versuche()) return;
    warteBis = Date.now() + 2000;
    if (warteUhr) return;
    (function tick() {
      warteUhr = null;
      if (versuche() || Date.now() > warteBis) return;
      warteUhr = setTimeout(tick, 80);
    })();
  }
  C6.bus.on('gebaut', wenn);
  C6.bus.on('raum', wenn);
  if (C6.jetzt === RAUM) wenn(RAUM);
})();
