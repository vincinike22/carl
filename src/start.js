/* Start: fehlende Teile still ersetzen, dann den ersten Raum öffnen */
var C6 = window.C6;
if (!C6.figur) C6.figur = {
  male: function (el, o) {
    var d = document.createElement('div');
    d.className = 'c6k-kiesel';
    d.setAttribute('role', 'img');
    d.setAttribute('aria-label', 'Carl');
    d.innerHTML = '<svg viewBox="0 0 120 110" aria-hidden="true"><path d="M60 22c-6-12-20-16-26-10 8 2 14 6 18 14M60 22c6-12 20-16 26-10-8 2-14 6-18 14" fill="#8ea37a" stroke="#2b2722" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="60" cy="66" rx="44" ry="34" fill="#d9d0c2" stroke="#2b2722" stroke-width="2.5"/><circle cx="46" cy="62" r="5" fill="#2b2722"/><circle cx="74" cy="62" r="5" fill="#2b2722"/><circle cx="47.5" cy="60.5" r="1.6" fill="#f0a830"/><circle cx="75.5" cy="60.5" r="1.6" fill="#f0a830"/><path d="M52 78q8 6 16 0" fill="none" stroke="#2b2722" stroke-width="2.5" stroke-linecap="round"/></svg>';
    var px = (o && o.groesse) || 120;
    d.style.cssText = 'width:' + px + 'px;cursor:pointer';
    el.appendChild(d);
    var noop = function () {};
    return { el: d, schau: noop, stimmung: noop, huepf: noop, geh: noop, groesse: function (p) { d.style.width = p + 'px'; }, teile: noop, kleid: noop, weg: function () { d.remove(); } };
  }
};
if (!C6.projektor) C6.projektor = { auf: function () {}, zu: function () {} };
if (!C6.muenzen) C6.muenzen = { plus: function () {}, stand: function () { return C6.S.muenzen || 0; } };
if (!C6.nadel) C6.nadel = { modus: function () {} };
if (!C6.strings) C6.strings = {
  alle: function () { return Array.isArray(C6.S.strings) ? C6.S.strings : []; },
  neu: function () { return null; }, perle: function () {}, knoten: function () {}
};

setTimeout(function () {
  var R = C6.raeume, ziel = null;
  var m = location.hash.match(/raum=([\w-]+)/);
  var fertig = !!(C6.S.du && C6.S.du.fertig);
  var eigene = 0; try { eigene = C6.werkzeug && C6.werkzeug.alle ? C6.werkzeug.alle().length : 0; } catch (e) { eigene = 0; }
  // Ein Fremder (kein Rundgang gemacht, kein eigenes Werkzeug) kommt an die Rezeption; der Rundgang startet nur über #raum=rundgang
  if (m && R[m[1]]) ziel = m[1];
  else if (!fertig && !eigene && R.rezeption) ziel = 'rezeption';
  else if (C6.S.ort && R[C6.S.ort.raum] && C6.S.ort.raum !== 'rundgang') ziel = C6.S.ort.raum;
  else if (R.zuhause) ziel = 'zuhause';
  else { var k = Object.keys(R); ziel = k[0] || null; }
  if (ziel) C6.geh(ziel, { start: true });
}, 0);
