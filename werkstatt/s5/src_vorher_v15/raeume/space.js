// Space: zu jedem Faden ein eigener Ort. Licht, Tageszeit und Wetter kommen aus seinem Planeten und seiner Art;
// quer durch den Ort hängt der Faden als Leine (Perlen, Zettel, die rote Nadel mit dem Kernsatz), und was dort entsteht, bleibt liegen.
var C6 = window.C6 = window.C6 || {};
var D = document;
function mach(tag, cls, vater, text) { var e = D.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (vater) vater.appendChild(e); return e; }
function spaeter(fn, ms) { return setTimeout(function () { try { fn(); } catch (e) { console.error('space', e); } }, ms || 0); }
function kurz(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
function hash(s) { s = String(s || ''); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ---------- Place-Katalog (Daten) ----------
   name, bei, tut, grund (Papierton), satz (Carls erster Satz dort), luft (Hinweis fürs Denken),
   oben (Ton über der Zeichnung, wenn der Ort höher ist als das Bild), draussen (Himmel sichtbar), schnitt (Bild füllt statt Himmel darüber) */
var PLACES = {
  garage: { name: 'Garage', mini: '100 120 170 170', bei: 'in der Garage', tut: 'schraubt', grund: '#f9efe0', draussen: 1, satz: 'Garage. Hier darf was kaputtgehen, dann bauen wir es neu.', luft: 'Ein Ort zum Bauen und Ausprobieren. Antworte praktisch: der nächste Handgriff, ein kleiner Versuch.' },
  kaffeehaus: { name: 'Kaffeehaus', mini: '140 30 200 200', bei: 'im Kaffeehaus', tut: 'liest', grund: '#efe4d4', satz: 'Kaffeehaus. Ich bestell nichts, ich hör nur zu.', luft: 'Ein Ort zum Plaudern und langsamen Denken. Antworte gesellig, mit einer guten Frage.' },
  schreibtisch: { name: 'Schreibtisch', mini: '290 70 170 170', bei: 'am Schreibtisch', tut: 'schreibt', grund: '#f4eee4', draussen: 1, satz: 'Am Schreibtisch. Ein Satz nach dem anderen.', luft: 'Ein Ort zum Schreiben und Ordnen. Antworte klar und hilf beim nächsten Satz.' },
  wald: { name: 'Wald', mini: '100 60 240 240', bei: 'im Wald', tut: 'lauscht', grund: '#eaf1e4', draussen: 1, satz: 'Im Wald denkt es sich leiser. Ich lausche mit.', luft: 'Ein Ort für Ruhe und Abstand. Antworte leise und lass Raum.' },
  meer: { name: 'Am Meer', mini: '330 60 170 170', bei: 'am Meer', tut: 'sammelt Muscheln', grund: '#e6f2f6', draussen: 1, satz: 'Am Meer. Was die Flut nicht mitnimmt, bleibt.', luft: 'Ein Ort für Weite. Antworte mit Blick aufs Ganze: was bleibt, was gehen darf.' },
  garten: { name: 'Garten', bei: 'im Garten', tut: 'gießt', grund: '#f6f3e2', draussen: 1, satz: 'Im Garten wächst es, wenn man gießt. Ich gieße.', luft: 'Ein Ort für Gewohnheiten und Geduld. Antworte freundlich und ohne Druck, mit dem, was heute dran ist.' },
  kueche: { name: 'Küche', bei: 'in der Küche', tut: 'rührt', grund: '#f6efe4', oben: '#efe3cc', satz: 'Küche. Hier wird gerührt, bis es schmeckt.', luft: 'Ein Ort zum Mischen. Antworte mit Zutaten: was zusammenkommen könnte.' },
  musik: { name: 'Musikzimmer', mini: '300 110 170 170', bei: 'im Musikzimmer', tut: 'nickt mit', grund: '#f8eeee', satz: 'Musikzimmer. Ich nicke im Takt, mehr kann ich nicht.', luft: 'Ein Ort für Rhythmus und Stimmung. Antworte mit Gefühl für Takt und Pause.' },
  hoersaal: { name: 'Hörsaal', mini: '80 0 230 230', bei: 'im Hörsaal', tut: 'schreibt mit', grund: '#e9ecef', satz: 'Hörsaal. Ich schreib mit, du erklärst es mir.', luft: 'Ein Ort zum Lernen. Antworte Schritt für Schritt und frag nach, was schon klar ist.' },
  saeulen: { name: 'Säulenhalle', bei: 'in der Säulenhalle', tut: 'fragt nach', grund: '#eef3f2', draussen: 1, satz: 'Säulenhalle. Hier wird gefragt, bis es trägt.', luft: 'Ein Ort für Fragen und Gegenrede. Antworte ehrlich, gern mit einer Gegenfrage.' },
  bergweg: { name: 'Bergweg', bei: 'auf dem Bergweg', tut: 'wandert', grund: '#f2f7fa', draussen: 1, satz: 'Bergweg. Ein Schritt, dann der nächste.', luft: 'Ein Ort für lange Wege. Antworte mit dem nächsten Schritt, nicht mit dem Gipfel.' },
  lesesaal: { name: 'Lesesaal', bei: 'im Lesesaal', tut: 'blättert', grund: '#ecebe7', satz: 'Lesesaal. Ich bin leise, das kann ich gut.', luft: 'Ein Ort für Quellen. Antworte mit dem, was man nachlesen könnte, und erfinde nichts.' },
  sternwarte: { name: 'Sternwarte', mini: '300 120 170 170', bei: 'in der Sternwarte', tut: 'schaut weit', grund: '#141a33', nacht: true, draussen: 1, satz: 'Sternwarte. Von hier sieht man, was weit weg ist.', luft: 'Ein Ort für das Neue und Ferne. Antworte neugierig, aus einem anderen Blickwinkel.' },
  nacht: { name: 'Nachtdach', mini: '290 30 160 160', bei: 'auf dem Dach bei Nacht', tut: 'liest leise', grund: '#15131d', nacht: true, draussen: 1, satz: 'Nachts. Schreib es hin, dann kann der Kopf schlafen.', luft: 'Ein Ort für späte Gedanken. Antworte ruhig, damit der Kopf abgeben kann.' },
  florenz: { name: 'Florenz', mini: '200 60 170 170', bei: 'in Florenz', tut: 'skizziert', grund: '#f6e7cf', draussen: 1, satz: 'Florenz. Hier haben andere groß gedacht. Wir dürfen das auch.', luft: 'Ein Ort für Handwerk und große Vorbilder. Antworte mit Blick auf Meisterschaft im Kleinen.' }
};
Object.keys(PLACES).forEach(function (k) { PLACES[k].id = k; PLACES[k].farbe = PLACES[k].grund; });
// Welche Places zu welcher Art passen; der erste wird, wenn der Name nichts anderes sagt, aus dem Faden gelost
var POOL = {
  projekt: ['garage', 'schreibtisch', 'kaffeehaus', 'florenz', 'bergweg', 'hoersaal', 'musik'],
  idee: ['kaffeehaus', 'meer', 'saeulen', 'lesesaal', 'florenz', 'garten', 'schreibtisch'],
  gewohnheit: ['garten', 'kueche', 'wald', 'bergweg', 'meer', 'musik']
};
var STICH = [
  [/lied|musik|song|band|gitarr|klavier|sing|chor|melod/i, 'musik'],
  [/lern|prüf|pruef|studi|uni\b|kurs|schule|klausur|sprache|vokab/i, 'hoersaal'],
  [/buch|lese|roman|bibliothek|quelle/i, 'lesesaal'],
  [/schreib|text|brief|blog|artikel|essay|tagebuch/i, 'schreibtisch'],
  [/lauf|wander|berg|sport|fit|jogg|klettern|marathon/i, 'bergweg'],
  [/koch|back|essen|rezept|küche|kueche|ernähr/i, 'kueche'],
  [/garten|pflanz|blume|gemüse|balkon/i, 'garten'],
  [/meer|segel|schwimm|urlaub|reise|surf/i, 'meer'],
  [/stern|weltall|kosmos|zukunft|vision/i, 'sternwarte'],
  [/schlaf|nacht|abend|träum|traeum/i, 'nacht'],
  [/philosoph|frage|warum|sinn|ethik/i, 'saeulen'],
  [/kunst|mal|zeichn|design|skizz|foto|bild/i, 'florenz'],
  [/wald|ruhe|medit|atem|achtsam|stille/i, 'wald'],
  [/café|cafe|kaffee|treffen|freund|gespräch/i, 'kaffeehaus'],
  [/bau|bastel|repar|fahrrad|werk|holz|code|app|prototyp|maschin|carl/i, 'garage']
];
var START = { projekt: ['garage', 'kaffeehaus', 'schreibtisch'], idee: ['kaffeehaus', 'meer', 'schreibtisch'], gewohnheit: ['garten', 'kueche', 'wald'] };
var ART = { projekt: 'ein Projekt', idee: 'eine Idee', gewohnheit: 'eine Gewohnheit' };
var ART_KURZ = { projekt: 'Projekt', idee: 'Idee', gewohnheit: 'Gewohnheit' };
function waehlePlaces(f) {
  if (!f) return START.projekt.slice();
  var art = POOL[f.art] ? f.art : 'projekt', pool = POOL[art].slice(), s = hash(f.id + '|places'), erst = null, titel = String(f.titel || '');
  for (var i = 0; i < STICH.length; i++) if (STICH[i][0].test(titel)) { erst = STICH[i][1]; break; }
  // gemischt nach dem Faden, damit zwei Spaces derselben Art nicht dieselben Orte bekommen
  for (var j = pool.length - 1; j > 0; j--) { s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0; var k = s % (j + 1), t = pool[j]; pool[j] = pool[k]; pool[k] = t; }
  if (!erst) erst = pool[0];
  var aus = [erst];
  pool.forEach(function (p) { if (aus.length < 3 && aus.indexOf(p) < 0) aus.push(p); });
  return aus;
}

/* ---------- Klima: Licht, Tageszeit, Wetter ----------
   Die Tageszeit folgt der echten Uhr, der Planet gibt den Farbklang. Hell ist der Normalfall, dunkel nur nachts.
   Regen oder Schnee kommen selten und kurz, als Ereignis. Nebel liegt nur über einem lange nicht besuchten Space
   und hebt sich, sobald man ihn betritt. */
var ZEIT = {
  frueh: { name: 'früh am Morgen', o: '#b9a9d2', u: '#f6cfae', a: 0.30, glanz: '#ffd6a8', gx: 0.16, gy: 0.70 },
  morgen: { name: 'am Morgen', o: '#a9c6e2', u: '#f4e6c8', a: 0.22, glanz: '#fff0c8', gx: 0.24, gy: 0.34 },
  mittag: { name: 'am Mittag', o: '#bfdcf0', u: '#fff3d4', a: 0.12, glanz: '#fffbe6', gx: 0.50, gy: 0.06 },
  nachmittag: { name: 'am Nachmittag', o: '#e2c98f', u: '#f6e2b8', a: 0.24, glanz: '#ffdd94', gx: 0.78, gy: 0.30 },
  abend: { name: 'am Abend', o: '#d5795a', u: '#f2bf8c', a: 0.38, glanz: '#ffa865', gx: 0.84, gy: 0.58 },
  daemmerung: { name: 'in der Dämmerung', o: '#4e4c8c', u: '#d99482', a: 0.50, glanz: '#f3a089', gx: 0.14, gy: 0.72 },
  nacht: { name: 'bei Nacht', o: '#0e1431', u: '#2b2f5e', a: 0.68, glanz: '#ffcf78', gx: 0.5, gy: 0.9, nacht: true }
};
var WETTER_NAME = { klar: 'klar', wolken: 'Wolken', wind: 'Wind', regen: 'Regen', nebel: 'Nebel', schnee: 'Schnee', sterne: 'Sterne' };
// die echte Stunde
function zeitJetzt(d) {
  d = d || new Date();
  var h = d.getHours() + d.getMinutes() / 60;
  return h < 5 ? 'nacht' : h < 7 ? 'frueh' : h < 10.5 ? 'morgen' : h < 14 ? 'mittag' : h < 17.5 ? 'nachmittag' : h < 20 ? 'abend' : h < 21.5 ? 'daemmerung' : 'nacht';
}
// Ein Schauer ist ein Ereignis: selten, kurz, dann wieder klar. Nebel nur nach langer Stille, bis er sich hebt.
var SCHAUER = {}, NEBEL = {};
function rgb(h) { h = String(h || '#888').replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function hex(c) { return '#' + c.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
function mische(a, b, t) { var x = rgb(a), y = rgb(b); return hex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; })); }
function familie(farbe) {
  var c = rgb(farbe), r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, d = mx - mn;
  if (d < 0.04) return 'warm';
  if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  if (h >= 160 && h < 260) return 'kuehl';
  if (h >= 60 && h < 160) return 'gruen';
  if (h >= 260 && h < 345) return 'violett';
  return 'warm';
}
function fuelle(r, f) {
  if (!r) return 0;
  var n = (r.notizen || []).length + ((f && f.perlen) || []).length + (r.dinge || []).length * 2 + (r.kern ? 3 : 0);
  Object.keys(r.chats || {}).forEach(function (k) { n += (r.chats[k] || []).filter(function (z) { return z.von === 'du'; }).length / 3; });
  return n;
}
function klima(sid) {
  var f = faden(sid);
  if (!f) return null;
  var r = roh(sid) || {}, fam = familie(f.farbe), art = ART[f.art] ? f.art : 'projekt', jetzt = Date.now();
  var zeit = zeitJetzt(), Z = ZEIT[zeit], nacht = !!Z.nacht;
  // am Tag meist klar, manchmal ein paar Wolken oder Wind (nach Faden und Tag, damit es nicht flackert)
  var s = hash(f.id + '|' + new Date().toDateString()) % 10;
  var wetter = s < 6 ? 'klar' : s < 9 ? 'wolken' : 'wind';
  var sch = SCHAUER[sid];
  if (sch && sch.bis > jetzt) wetter = sch.art;
  if (wetter === 'klar' && (nacht || zeit === 'daemmerung')) wetter = 'sterne';
  var ruht = NEBEL[sid] && NEBEL[sid] > jetzt;
  if (ruht) wetter = 'nebel';
  var voll = fuelle(r, f);
  var zustand = r.kern ? 'klar' : (voll < 2 ? 'neu' : 'waechst');
  var o = mische(Z.o, f.farbe || '#888', nacht ? 0.22 : 0.26), u = mische(Z.u, f.farbe || '#888', 0.08);
  var papier = nacht ? mische('#141a33', f.farbe || '#888', 0.16) : mische('#f4eee4', mische(Z.u, Z.o, 0.25), zeit === 'daemmerung' ? 0.30 : 0.24);
  return {
    zeit: zeit, tageszeit: Z.name, wetter: wetter, wetterName: WETTER_NAME[wetter], nacht: nacht, familie: fam,
    himmel: [o, u], licht: Z.glanz, staerke: Z.a, gx: Z.gx, gy: Z.gy, papier: papier,
    zustand: zustand, ruht: !!ruht, fuelle: voll, farbe: f.farbe || '#d62a26', art: art
  };
}

var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="c6k-sp-pin-nadel" d="M12.6 11.4 6 18"/><circle class="c6k-sp-pin-kopf" cx="15" cy="9" r="4.2"/></svg>';
var PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5v13M5.5 12h13"/></svg>';
var PFEIL_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>';
var PFEIL_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5"/></svg>';
var ZU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>';
var KLAMMER = '<svg class="c6z-sp-klammer" viewBox="0 0 10 22" aria-hidden="true"><rect x="1.5" y="1" width="7" height="20" rx="2"/><path d="M5 4v14"/></svg>';
// Ferne Hügel (draußen) bzw. Fußleiste und Fenster (drinnen), in derselben Tusche, sehr leise
// Carls Sitz je Place: eigene kleine Möbel, Boden = Unterkante (180 × 40 Figur-Einheiten, Sitzfläche oben)
var T_ = 'stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"';
var SITZ = {
  kiste: '<rect x="22" y="4" width="136" height="35" rx="2" fill="#c99d63" ' + T_ + '/><path d="M24 16H156M24 28H156" fill="none" ' + T_ + ' stroke-opacity=".55"/><path d="M38 6V37M142 6V37" fill="none" stroke="#2b2722" stroke-width="2.2" stroke-opacity=".7"/><path d="M28 9H70" stroke="#fff" stroke-opacity=".35" stroke-width="2.2" stroke-linecap="round"/>',
  kissen: '<path d="M10 30C10 9 40 5 90 5S170 9 170 30C170 40 140 39 90 39S10 40 10 30Z" fill="var(--sitz-f,#b0566a)" ' + T_ + '/><path d="M30 14C60 9 120 9 150 14" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.4" stroke-linecap="round"/><circle cx="90" cy="22" r="3.2" fill="#2b2722" fill-opacity=".55"/>',
  stumpf: '<path d="M32 9V37C32 40 148 40 148 37V9" fill="#8a6a48" ' + T_ + '/><ellipse cx="90" cy="9" rx="58" ry="6.5" fill="#e3c99b" ' + T_ + '/><ellipse cx="90" cy="9" rx="34" ry="3.6" fill="none" stroke="#2b2722" stroke-opacity=".35" stroke-width="1.6"/><path d="M52 18V34M84 20V37M118 17V33" fill="none" stroke="#2b2722" stroke-opacity=".35" stroke-width="1.8" stroke-linecap="round"/>',
  stein: '<path d="M18 39C10 30 22 9 60 6S150 4 162 20C170 32 160 39 150 39Z" fill="#bdb7a9" ' + T_ + '/><path d="M44 14C70 9 110 8 138 13" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round"/><path d="M120 30q10-4 18 0" fill="none" stroke="#2b2722" stroke-opacity=".3" stroke-width="1.6" stroke-linecap="round"/>',
  stapel: '<rect x="26" y="28" width="132" height="11" rx="2" fill="#2f5f8a" ' + T_ + '/><rect x="18" y="16" width="140" height="12" rx="2" fill="#a4492e" ' + T_ + '/><rect x="32" y="4" width="122" height="12" rx="2" fill="#5f7f3e" ' + T_ + '/><path d="M150 8V14M150 20V26M152 31V37" stroke="#f4eee4" stroke-width="2" stroke-linecap="round"/>',
  trommel: '<path d="M30 9V35C30 41 150 41 150 35V9" fill="#c8463d" ' + T_ + '/><path d="M30 13L50 34L70 13L90 34L110 13L130 34L150 13" fill="none" stroke="#f1dcb4" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="90" cy="9" rx="60" ry="6.5" fill="#f4eadb" ' + T_ + '/>',
  schemel: '<path d="M40 14L32 39M140 14L148 39M60 14L58 36M120 14L122 36" fill="none" stroke="#2b2722" stroke-width="5.5" stroke-linecap="round"/><path d="M40 14L32 39M140 14L148 39" fill="none" stroke="#b98a55" stroke-width="2.6" stroke-linecap="round"/><rect x="24" y="4" width="132" height="11" rx="5" fill="#c99d63" ' + T_ + '/>',
  topf: '<path d="M44 4H136L150 39H30Z" fill="#c8744a" ' + T_ + '/><path d="M36 26H144L150 39H30Z" fill="#b5613a" ' + T_ + '/><path d="M60 9L56 22" stroke="#fff" stroke-opacity=".3" stroke-width="2.4" stroke-linecap="round"/>',
  stufe: '<rect x="6" y="5" width="168" height="34" rx="3" fill="var(--sitz-f,#d9d2c4)" ' + T_ + '/><path d="M8 11H172" stroke="#fff" stroke-opacity=".45" stroke-width="2.4"/><path d="M70 20l6 8M120 16l-4 7" fill="none" stroke="#2b2722" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round"/>',
  decke: '<path d="M16 26C16 14 36 10 90 10S164 14 164 26V34C164 40 150 39 90 39S16 40 16 34Z" fill="#4a528a" ' + T_ + '/><path d="M16 26C40 31 140 31 164 26" fill="none" stroke="#2b2722" stroke-width="2" stroke-opacity=".6"/><path d="M22 19C44 15 130 14 158 19" fill="none" stroke="#e2b93b" stroke-width="2" stroke-opacity=".7"/>'
};
var SITZ_JE = { garage: ['kiste'], kaffeehaus: ['kissen', '#a0485a'], schreibtisch: ['stapel'], wald: ['stumpf'], meer: ['stein'], garten: ['topf'], kueche: ['schemel'],
  musik: ['trommel'], hoersaal: ['stufe', '#d9d2c4'], saeulen: ['stufe', '#e6e1d4'], bergweg: ['stein'], lesesaal: ['stapel'], sternwarte: ['kissen', '#3d4a86'], nacht: ['decke'], florenz: ['stufe', '#e7d3ab'] };
function sitzSvg(pid) {
  var j = SITZ_JE[pid] || ['kissen'];
  return '<svg viewBox="0 0 180 40" aria-hidden="true"' + (j[1] ? ' style="--sitz-f:' + j[1] + '"' : '') + '>' + SITZ[j[0]] + '</svg>';
}
var WEITE_LAND = '<svg class="c6z-sp-w-huegel" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true">' +
  '<path d="M0 62 C120 30 230 34 330 50 S560 70 690 42 S930 18 1040 40 S1160 58 1200 50 V90 H0Z" class="c6z-sp-w-h1"/>' +
  '<path d="M0 74 C160 56 300 60 430 70 S700 84 840 64 S1080 52 1200 66 V90 H0Z" class="c6z-sp-w-h2"/></svg>' +
  '<svg class="c6z-sp-w-baeume" viewBox="0 0 240 60" aria-hidden="true"><g class="c6z-sp-w-baum"><path d="M40 58V40"/><ellipse cx="40" cy="30" rx="11" ry="14"/></g>' +
  '<g class="c6z-sp-w-baum"><path d="M62 58V44"/><ellipse cx="62" cy="36" rx="8" ry="10"/></g><g class="c6z-sp-w-baum"><path d="M196 58V42"/><ellipse cx="196" cy="32" rx="10" ry="13"/></g></svg>' +
  '<svg class="c6z-sp-w-fenster" viewBox="0 0 90 110" aria-hidden="true"><rect x="5" y="5" width="80" height="100" rx="4" class="c6z-sp-w-glas"/><path d="M45 5V105M5 55H85"/><rect x="5" y="5" width="80" height="100" rx="4" fill="none"/><path d="M0 108H90"/></svg>';
var WOLKE = '<svg viewBox="0 0 120 40" aria-hidden="true"><path d="M8 34 q4 -16 22 -12 q8 -16 28 -8 q18 -6 22 12 q14 2 10 12 z"/></svg>';
// Gestirn der Weite: Sonne oder Mond, dort, wo das Licht herkommt
var SONNE = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="c6z-sp-sonne-hof" cx="32" cy="32" r="30"/><circle class="c6z-sp-sonne-kreis" cx="32" cy="32" r="17"/></svg>';
var MOND = '<svg viewBox="0 0 64 64" aria-hidden="true"><path class="c6z-sp-mond-kreis" d="M38 12a20 20 0 1 0 14 34 16 16 0 0 1-14-34z"/></svg>';
// Gras im Wind (drei Büschel in zwei Gruppen), Baumkronen wiegen in derselben Tusche
var GRAS = '<svg class="c6z-sp-gras-svg" viewBox="0 0 160 40" aria-hidden="true"><g class="c6z-sp-halm c6z-sp-halm-a"><path d="M20 40c-2-9-7-13-12-17M22 40c0-10 3-16 7-21M25 40c2-8 7-11 12-13"/></g>' +
  '<g class="c6z-sp-halm c6z-sp-halm-b"><path d="M84 40c-3-8-6-12-11-15M87 40c0-11 2-15 5-22M90 40c3-7 6-10 11-12"/></g>' +
  '<g class="c6z-sp-halm c6z-sp-halm-a"><path d="M140 40c-2-7-5-10-9-13M143 40c0-9 2-13 4-18M146 40c2-6 5-9 9-11"/></g></svg>';
// drinnen: ein Vorhang am Fenster der Weite, Staub im Fensterlicht
var VORHANG = '<svg class="c6z-sp-vorhang-svg" viewBox="0 0 40 120" aria-hidden="true" preserveAspectRatio="none"><path class="c6z-sp-vorhang-stoff" d="M4 2h30c-2 20 2 40-2 60s2 40-4 56H6c4-18-2-36 2-56S2 22 4 2z"/><path class="c6z-sp-vorhang-falte" d="M14 4c1 20-3 40 1 58s-3 38 0 54M24 4c-2 20 3 40 0 58s2 38-1 54"/></svg>';
var STAUB = '<svg class="c6z-sp-staub-svg" viewBox="0 0 80 120" aria-hidden="true"><g class="c6z-sp-staub-g"><circle cx="14" cy="20" r="1.6"/><circle cx="46" cy="52" r="1.3"/><circle cx="28" cy="84" r="1.5"/><circle cx="62" cy="104" r="1.2"/><circle cx="58" cy="14" r="1.1"/></g></svg>';
// kleine Ereignisse: ein Vogel (eigener Strich, Kreis und Keil), ein fallendes Blatt
var VOGEL = '<svg viewBox="0 0 40 30" aria-hidden="true"><g class="c6z-sp-vogel-koerper"><path d="M8 20c2-8 10-11 18-9 4 1 6 4 6 7-1 5-8 7-15 6-5-1-9-2-9-4z" fill="#5c6b8a" stroke="#2b2722" stroke-width="1.6" stroke-linejoin="round"/><circle cx="29" cy="12" r="5.5" fill="#6f7f9e" stroke="#2b2722" stroke-width="1.6"/><path d="M34 12l5 1.5-5 1.5z" fill="#f0a830" stroke="#2b2722" stroke-width="1.2" stroke-linejoin="round"/><circle cx="30.5" cy="11" r="1.1" fill="#2b2722"/><path d="M8 20l-6 3M8 20l-5-1" fill="none" stroke="#2b2722" stroke-width="1.4" stroke-linecap="round"/><path class="c6z-sp-vogel-fluegel" d="M14 17c3-6 9-8 14-6-2 5-7 8-12 8z" fill="#8a98b4" stroke="#2b2722" stroke-width="1.4" stroke-linejoin="round"/><path d="M19 25v4M24 25v4" fill="none" stroke="#2b2722" stroke-width="1.4" stroke-linecap="round"/></g></svg>';
var BLATT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20C4 10 10 4 21 3c-1 11-7 17-18 17z" fill="#c9a24e" stroke="#2b2722" stroke-width="1.4" stroke-linejoin="round"/><path d="M4 19L18 6" fill="none" stroke="#2b2722" stroke-width="1" stroke-linecap="round"/></svg>';
// Leises Eigenleben drinnen, als Zeichnung über dem Bild (Bildmaß 480 × 300): Uhrzeiger, Kreidestaub, Noten, Staub im Fensterlicht
var LT = 'fill="none" stroke="#2b2722" stroke-width="1.6" stroke-linecap="round"';
var LEBEN = {
  hoersaal: '<g transform="translate(440 40)"><g class="c6z-sp-l-zeiger"><path d="M0 3V-13" ' + LT + ' stroke-width="2"/></g></g><g class="c6z-sp-l-flieger"><path d="M0 0l26-8-14 12-4-3zM12 4l-2 8" fill="#fbf7f0" ' + LT + ' stroke-width="1.3"/></g><g transform="translate(446 68)"><rect x="0" y="0" width="30" height="118" rx="2" fill="#dfe8ef" ' + LT + ' stroke-opacity=".6"/><path d="M15 0v118M0 59h30" ' + LT + ' stroke-opacity=".5"/><g class="c6z-sp-l-vorhang"><path d="M-4 -3h16c-2 22 2 44-1 66s3 36-2 58H-6c3-22-1-44 1-66s-3-36 1-58z" fill="#e8d2b6" ' + LT + ' stroke-opacity=".6" stroke-width="1.4"/><path d="M4 0c1 24-3 48 0 72s-2 30 0 46" ' + LT + ' stroke-opacity=".25" stroke-width="1"/></g></g><g class="c6z-sp-l-staub"><circle cx="150" cy="80" r="1.8"/><circle cx="210" cy="110" r="1.5"/><circle cx="260" cy="70" r="1.7"/><circle cx="180" cy="140" r="1.4"/><circle cx="320" cy="96" r="1.5"/></g>',
  kueche: '<ellipse class="c6z-sp-l-sch" cx="118" cy="217" rx="25" ry="3.6"/><ellipse class="c6z-sp-l-sch" cx="364" cy="210" rx="20" ry="2.6"/>' +
    '<g transform="translate(240 50)"><g class="c6z-sp-l-zeiger"><path d="M0 2V-17" ' + LT + ' stroke-width="2"/></g></g>' +
    '<path d="M192 135h106" ' + LT + ' stroke-width="2.2"/><circle cx="192" cy="135" r="2.6" fill="#2b2722"/><circle cx="298" cy="135" r="2.6" fill="#2b2722"/>' +
    '<g class="c6z-sp-l-vorhang"><path d="M195 136h17c-2 14 2 26-1 38s3 16-1 30h-16c3-12-1-18 1-30s-3-24 0-38z" fill="#e7b9a6" ' + LT + ' stroke-opacity=".7" stroke-width="1.4"/><path d="M203 138c1 14-2 26 0 38s-2 18 0 28" ' + LT + ' stroke-opacity=".3" stroke-width="1"/>' +
    '<path d="M278 136h17c2 14-2 26 1 38s-3 16 1 30h-16c-3-12 1-18-1-30s3-24 0-38z" fill="#e7b9a6" ' + LT + ' stroke-opacity=".7" stroke-width="1.4"/><path d="M287 138c-1 14 2 26 0 38s2 18 0 28" ' + LT + ' stroke-opacity=".3" stroke-width="1"/></g>' +
    '<path d="M376 209v-30c0-4-3-6-7-6h-9v6" ' + LT + ' stroke-width="2.4"/><path d="M342 210q22 6 44 0" ' + LT + ' stroke-opacity=".45"/>' +
    '<g class="c6z-sp-l-tropfen"><path d="M360 181c-1.8 2.8-2.8 4.3-2.8 5.6a2.8 2.8 0 0 0 5.6 0c0-1.3-1-2.8-2.8-5.6z" fill="#a9cde0" ' + LT + ' stroke-width="1"/></g>' +
    '<g transform="translate(118 214)"><path d="M-22 -14h44l-4 16h-36z" fill="#8a8378" ' + LT + '/><path d="M-26 -14h52" ' + LT + '/><path d="M-26 -12h-5M26 -12h5" ' + LT + ' stroke-width="2.4"/>' +
    '<g class="c6z-sp-l-dampf"><path d="M-11 -18c3-7-3-11 1-18s-2-10 1-15M1 -19c3-7-3-11 1-18s-2-10 1-15M12 -17c3-6-2-9 1-15s-2-8 0-12" ' + LT + ' stroke-width="2" stroke-opacity=".6"/></g>' +
    '<g class="c6z-sp-l-wolke"><path d="M-12 -30q-1-8 7-8q3-7 11-3q8-2 9 6q6 1 4 7z" fill="#fffdf8" fill-opacity=".92" ' + LT + ' stroke-width="1.3" stroke-opacity=".55"/></g></g>',
  musik: '<ellipse class="c6z-sp-l-sch" cx="97" cy="251" rx="62" ry="4"/><ellipse class="c6z-sp-l-sch" cx="228" cy="251" rx="30" ry="3.4"/><ellipse class="c6z-sp-l-sch" cx="178" cy="251" rx="16" ry="2.6"/><ellipse class="c6z-sp-l-sch" cx="389" cy="251" rx="64" ry="4.4"/>' +
    '<g class="c6z-sp-l-vorhang c6z-sp-l-vorhang-lang"><path d="M-4 -2h34c-4 40 5 80-1 124s6 80-1 128H-4z" fill="#a0485a" ' + LT + ' stroke-opacity=".7" stroke-width="1.4"/><path d="M10 2c3 40-4 82 1 124s-4 80-1 122M21 2c-3 40 4 82-1 124s3 80 1 122" ' + LT + ' stroke-opacity=".28" stroke-width="1.1"/></g>' +
    '<path class="c6z-sp-l-schein" d="M333 146L300 250h82z" fill="#f6d98a"/>' +
    '<g class="c6z-sp-l-zug"><g transform="translate(40 76)"><path d="M0 0v-15" ' + LT + '/><ellipse cx="-3.5" cy="1" rx="4" ry="2.8" fill="#2b2722"/></g><g transform="translate(78 68)"><path d="M0 0v-16l9-3v16" ' + LT + '/><ellipse cx="-3.5" cy="1" rx="4" ry="2.8" fill="#2b2722"/><ellipse cx="5.5" cy="-2" rx="4" ry="2.8" fill="#2b2722"/></g><g transform="translate(118 74)"><path d="M0 0v-15c3 2 7 4 6 9" ' + LT + '/><ellipse cx="-3.5" cy="1" rx="4" ry="2.8" fill="#2b2722"/></g></g>' +
    '<g transform="translate(178 250)"><path d="M-11 0l11-12 11 12M0 -12v-34" ' + LT + '/><g class="c6z-sp-l-wipp"><path d="M-16 -44h32l-3-24h-26z" fill="#fbf7f0" ' + LT + ' stroke-width="1.4"/><path d="M-11 -62h22M-11 -57h22M-11 -52h20" ' + LT + ' stroke-width=".9" stroke-opacity=".5"/><path d="M-16 -44h32" ' + LT + ' stroke-width="2.2"/></g></g>' +
    '<g transform="translate(372 196)"><g class="c6z-sp-l-note c6z-sp-l-note-a"><path d="M0 0v-16l9-3v16" ' + LT + '/><ellipse cx="-3.5" cy="1" rx="4" ry="2.8" fill="#2b2722"/><ellipse cx="5.5" cy="-2" rx="4" ry="2.8" fill="#2b2722"/></g></g><g transform="translate(410 190)"><g class="c6z-sp-l-note c6z-sp-l-note-b"><path d="M0 0v-14" ' + LT + '/><ellipse cx="-3.5" cy="1" rx="3.8" ry="2.6" fill="#2b2722"/></g></g>',
  bergweg: '<g transform="translate(361 14)"><path d="M0 0v28" ' + LT + '/><path class="c6z-sp-l-fahne" d="M0 2l24 6-24 7z" fill="#d62a26" ' + LT + ' stroke-width="1.2"/></g><g class="c6z-sp-l-gras"><path d="M120 246c-2-7-5-10-9-13M123 246c0-9 2-13 4-18M126 246c2-6 5-9 9-11" ' + LT + ' stroke-opacity=".55"/><path d="M300 250c-2-6-5-9-8-11M303 250c0-8 2-12 4-16M306 250c2-6 4-8 8-10" ' + LT + ' stroke-opacity=".55"/><path d="M420 244c-2-6-4-9-8-11M423 244c0-8 2-12 4-16M426 244c2-5 4-8 7-10" ' + LT + ' stroke-opacity=".55"/><path d="M60 252c-2-7-5-10-9-13M63 252c0-9 2-13 4-18M66 252c2-6 5-9 9-11" ' + LT + ' stroke-opacity=".55"/><path d="M360 248c-2-6-5-9-8-11M363 248c0-8 2-12 4-16M366 248c2-6 4-8 8-10" ' + LT + ' stroke-opacity=".55"/></g>',
  kaffeehaus: '<ellipse class="c6z-sp-l-sch" cx="70" cy="251" rx="30" ry="3.6"/><ellipse class="c6z-sp-l-sch" cx="420" cy="251" rx="30" ry="3.6"/><ellipse class="c6z-sp-l-sch" cx="118" cy="251" rx="12" ry="2.6"/>' +
    '<g transform="translate(290 149)"><circle r="28" fill="#d5dee3"/><path d="M-15 27L0 0l15 27" ' + LT + ' stroke-width="2.2"/><g class="c6z-sp-l-rad"><circle r="25" ' + LT + ' stroke-width="2"/><path d="M0-25V25M-25 0H25M-17.7-17.7L17.7 17.7M-17.7 17.7L17.7-17.7" ' + LT + ' stroke-width="1.2"/>' +
    '<circle cx="0" cy="-25" r="3.4" fill="#d6a24a" ' + LT + ' stroke-width="1.1"/><circle cx="25" cy="0" r="3.4" fill="#c75b4a" ' + LT + ' stroke-width="1.1"/><circle cx="0" cy="25" r="3.4" fill="#5c7fa8" ' + LT + ' stroke-width="1.1"/><circle cx="-25" cy="0" r="3.4" fill="#6e9a62" ' + LT + ' stroke-width="1.1"/></g><circle r="2.6" fill="#2b2722"/></g>' +
    '<g transform="translate(378 58)"><g class="c6z-sp-l-vorhang"><path d="M-3 -2h16c-2 16 2 30-1 44s3 24-2 40H-5c3-16-1-30 1-44s-3-24 1-40z" fill="#e8d2b6" ' + LT + ' stroke-opacity=".6" stroke-width="1.4"/></g></g>' +
    '<path d="M50 205l5-4h19l-1 4z" fill="#f3efe6" ' + LT + ' stroke-width="1.2"/><path d="M57 203h12" ' + LT + ' stroke-width=".8" stroke-opacity=".5"/>' +
    '<g class="c6z-sp-l-seite"><path d="M73 205l1-4h18l-4 4z" fill="#fbf8f1" ' + LT + ' stroke-width="1.2"/><path d="M77 203h10" ' + LT + ' stroke-width=".8" stroke-opacity=".5"/></g>' +
    '<path d="M128 22v14M128 30H84v2" ' + LT + ' stroke-width="2.2"/><circle cx="128" cy="29" r="3" fill="#2b2722"/>' +
    '<g class="c6z-sp-l-pendel"><path class="c6z-sp-l-schein" d="M74 67L40 203h88L94 67z" fill="#f6d98a"/><path d="M84 30V50" ' + LT + ' stroke-width="1.4"/><path d="M71 64l6-14h14l6 14z" fill="#3f6a5c" ' + LT + ' stroke-width="1.6"/><circle cx="84" cy="65" r="3.4" fill="#fff1c4" ' + LT + ' stroke-width="1"/></g>' +
    '<g transform="translate(420 197)"><g class="c6z-sp-l-dampf"><path d="M-4 -4c3-6-3-9 1-15s-2-8 1-12M5 -5c3-6-3-9 1-15s-2-8 1-12" ' + LT + ' stroke-width="1.8" stroke-opacity=".55"/></g></g>',
  wald: '<g class="c6z-sp-l-blatt"><path d="M0 0c2-9 9-13 18-13-1 9-7 14-18 13z" fill="#c9a24e" ' + LT + ' stroke-width="1.2"/></g>',
  nacht: '<g class="c6z-sp-l-schnuppe"><path d="M0 0l34 12" stroke="#fff6d8" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="12" r="2.2" fill="#fff6d8"/></g>',
  sternwarte: '<g class="c6z-sp-l-satellit"><circle r="2.4" fill="#fff6d8"/><path d="M-7 0h14" stroke="#fff6d8" stroke-width="1.2" stroke-opacity=".7"/></g>',
  lesesaal: '<ellipse class="c6z-sp-l-sch" cx="240" cy="252" rx="92" ry="4.4"/><ellipse class="c6z-sp-l-sch" cx="299" cy="211" rx="9" ry="2"/><ellipse class="c6z-sp-l-sch" cx="205" cy="211" rx="22" ry="2.4"/>' +
    '<g class="c6z-sp-l-schein"><path d="M162 70h46l38 180h-48z" fill="#fff6da"/><path d="M273 70h46l34 180h-46z" fill="#fff6da"/></g>' +
    '<g class="c6z-sp-l-staub"><circle cx="190" cy="110" r="2.2"/><circle cx="214" cy="150" r="1.8"/><circle cx="200" cy="190" r="2"/><circle cx="300" cy="100" r="1.9"/><circle cx="318" cy="160" r="2.1"/><circle cx="296" cy="200" r="1.7"/></g>' +
    '<g transform="translate(205 209)"><path d="M-20 0l2-4q9-2 18 1q9-3 18-1l2 4q-10-2-20 1q-10-3-20-1z" fill="#fbf7f0" ' + LT + ' stroke-width="1.2"/><path d="M-15-2h10M5-2h10" ' + LT + ' stroke-width=".7" stroke-opacity=".45"/>' +
    '<g class="c6z-sp-l-seite"><path d="M0-3q9-3 18-1l2 4q-10-2-20 1z" fill="#fffdf6" ' + LT + ' stroke-width="1.1"/></g></g>' +
    '<g transform="translate(250 158)"><g class="c6z-sp-l-schwebe"><path d="M-18 2l18 3 18-3v-3l-18 3-18-3z" fill="#b4553f" ' + LT + ' stroke-width="1.3"/><path d="M-16 0q7-7 16-2q9-5 16 2l-16 2z" fill="#fbf7f0" ' + LT + ' stroke-width="1.2"/><path d="M0-2v4M-11-1q5-3 9-1M2-2q4-2 9 1" ' + LT + ' stroke-width=".8" stroke-opacity=".45"/></g></g>',
  garage: '<g class="c6z-sp-l-staub"><circle cx="160" cy="120" r="1.2"/><circle cx="200" cy="150" r="1"/><circle cx="240" cy="110" r="1.1"/></g>',
  schreibtisch: '<g class="c6z-sp-l-staub"><circle cx="120" cy="90" r="1.1"/><circle cx="160" cy="120" r="1"/><circle cx="90" cy="130" r="1.2"/></g>'
};
// Licht drinnen: wo im Bild (480 × 300) Fenster oder Lampe des Place hängen; daraus Kontaktschatten unter den Dingen
var LICHT_ORT = { kueche: { x: 245, y: 160, art: 'fenster' }, musik: { x: 340, y: 140, art: 'lampe' }, kaffeehaus: { x: 84, y: 66, art: 'lampe' }, lesesaal: { x: 240, y: 70, art: 'fenster' } };
// höchstens so viele bewegte Teile je Art im Bild (Dauerbewegung ≤ 8 je Place)
var LEBEN_MAX = { 'c6k-a-wolke': 1, 'c6k-a-funkel': 2, 'c6k-a-dampf': 2, 'c6k-a-flamme': 2 };
// Gewohnheiten, die Carl je Place hat (die Figur bietet sie an, sonst schaut er sich nur um)
var GEWOHN = { garage: ['schrauben', 'umsehen'], kaffeehaus: ['summen', 'umsehen'], schreibtisch: ['lesen', 'gaehnen'], wald: ['umsehen', 'summen'], meer: ['umsehen'], garten: ['umsehen', 'summen'],
  kueche: ['summen', 'umsehen'], musik: ['summen'], hoersaal: ['lesen', 'umsehen'], saeulen: ['umsehen'], bergweg: ['umsehen', 'gaehnen'], lesesaal: ['lesen', 'gaehnen'], sternwarte: ['umsehen', 'gaehnen'], nacht: ['gaehnen', 'umsehen'], florenz: ['umsehen', 'summen'] };
// Lichtquelle je Stunde (warm = Bernstein-Hauch, hoehe = kurzer Schatten)
var LICHT = { frueh: { warm: 0.8, staerke: 0.7 }, morgen: { warm: 0.55, staerke: 0.8 }, mittag: { warm: 0.45, staerke: 0.9 }, nachmittag: { warm: 0.7, staerke: 0.85 }, abend: { warm: 0.9, staerke: 0.75 }, daemmerung: { warm: 0.6, staerke: 0.5 }, nacht: { warm: 0.15, staerke: 0.45 } };

/* ---------- Zustand ---------- */
function St() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(function (s) { if (!s.spaces || typeof s.spaces !== 'object') s.spaces = {}; fn(s); });
  else { var s = St(); if (!s.spaces) s.spaces = {}; fn(s); }
}
function faden(id) { try { return C6.strings && C6.strings.hol ? C6.strings.hol(id) : null; } catch (e) { return null; } }
function faeden() { try { return (C6.strings && C6.strings.alle ? C6.strings.alle() : []) || []; } catch (e) { return []; } }
function roh(sid) { var s = St(); return s.spaces && s.spaces[sid]; }
// Space-Datensatz holen; fehlt er, wird er still mit passenden Places angelegt
function rec(sid) {
  if (!sid) return null;
  var r = roh(sid);
  if (r && Array.isArray(r.places)) return r;
  var f = faden(sid);
  if (!f) return null;
  var neu = { places: waehlePlaces(f), chats: {}, notizen: [], dinge: [], kern: '', jetzt: null, erstellt: Date.now() };
  aendern(function (s) { if (!s.spaces[sid] || !Array.isArray(s.spaces[sid].places)) s.spaces[sid] = neu; });
  return roh(sid) || neu;
}
function zuletzt(sid) {
  var r = roh(sid), t = 0;
  if (r) {
    Object.keys(r.chats || {}).forEach(function (k) { var c = r.chats[k]; if (c && c.length) t = Math.max(t, c[c.length - 1].ts || 0); });
    (r.notizen || []).forEach(function (n) { t = Math.max(t, n.ts || 0); });
    (r.dinge || []).forEach(function (n) { t = Math.max(t, n.ts || 0); });
    t = Math.max(t, r.besucht || 0);
  }
  var f = faden(sid);
  return Math.max(t, (f && f.erstellt) || 0);
}

/* ---------- Bilder ---------- */
var bildNr = 0;
function inneres(pid) {
  var b = (C6.space && C6.space._bilder) || {};
  var inner = b[pid] || b.schreibtisch || '';
  var n = ++bildNr;
  // Verläufe tragen eine Kennung: je Bild eindeutig machen, damit Vorschau und Bühne sich nicht stören
  return inner.replace(/id="([^"]+)"/g, 'id="$1-sp' + n + '"').replace(/url\(#([^)]+)\)/g, 'url(#$1-sp' + n + ')');
}
function bild(pid, cls, klein) {
  var p = PLACES[pid] || PLACES.schreibtisch;
  var vb = klein && p.mini ? p.mini : '0 0 480 300';
  return '<svg class="' + (cls || 'c6k-sp-bild') + '" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="480" height="300" fill="' + p.grund + '"/>' + inneres(pid) + '</svg>';
}
// das Bild in der Bühne steht unten; darüber geht der Himmel (oder die Wand) weiter
function buehnenBild(pid) {
  var p = PLACES[pid] || PLACES.schreibtisch;
  return '<svg class="c6z-sp-zeichnung" viewBox="0 0 480 300" preserveAspectRatio="' + (p.schnitt ? 'xMidYMax slice' : 'xMidYMax meet') + '" aria-hidden="true" focusable="false"><rect width="480" height="300" fill="' + p.grund + '"/>' + inneres(pid) + '</svg>';
}
// kleine Dinge, die im Space liegen bleiben
function dingBild(d) {
  var f = d.farbe || '#2f5f8a';
  var zeichen = '';
  try { if (d.geruest && C6.geruest && C6.geruest.zeichen) zeichen = C6.geruest.zeichen(d.geruest, f); } catch (e) { zeichen = ''; }
  var innen = zeichen ? zeichen.replace(/^<svg[^>]*>|<\/svg>$/g, '') : '<circle cx="24" cy="24" r="9" fill="' + f + '" stroke="#2b2722" stroke-width="2.5"/>';
  // ein gefaltetes Blatt, darauf das Zeichen des Gerüsts
  return '<svg viewBox="0 0 64 56" aria-hidden="true"><path d="M6 14 L40 6 L58 40 L22 50 Z" fill="#fbf7f0" stroke="#2b2722" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M40 6 L44 18 L58 40" fill="none" stroke="#2b2722" stroke-width="1.4" stroke-linejoin="round" opacity=".55"/>' +
    '<g transform="translate(17 14) scale(.5) rotate(-10 24 24)">' + innen + '</g></svg>';
}
// die Pflanze des Space wächst mit dem, was dort entsteht (fünf Stufen)
function pflanze(stufe, farbe) {
  var topf = '<path d="M14 46 h28 l-3 16 h-22 z" fill="#c9774e" stroke="#2b2722" stroke-width="2" stroke-linejoin="round"/><path d="M12 44 h32 v5 h-32 z" fill="#d98a5f" stroke="#2b2722" stroke-width="2" stroke-linejoin="round"/>';
  var erde = '<path d="M16 46 q12 -4 24 0" fill="none" stroke="#5a4636" stroke-width="2"/>';
  var s = '';
  if (stufe <= 0) s = '<circle cx="28" cy="43" r="2.4" fill="#8a6a3c" stroke="#2b2722" stroke-width="1.2"/>';
  if (stufe >= 1) s += '<path d="M28 45 V' + (stufe >= 2 ? 26 : 36) + '" stroke="#5f7f3e" stroke-width="2.4" stroke-linecap="round"/>';
  if (stufe === 1) s += '<path d="M28 37 q-9 -2 -10 -9 q8 0 10 9 z M28 37 q9 -2 10 -9 q-8 0 -10 9 z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.5"/>';
  if (stufe >= 2) s += '<path d="M28 36 q-11 -1 -13 -9 q10 -1 13 9 z M28 31 q11 -1 13 -9 q-10 -1 -13 9 z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.5"/><path d="M28 27 q-7 -2 -7 -9 q7 1 7 9 z M28 27 q7 -2 7 -9 q-7 1 -7 9 z" fill="#a7bb8f" stroke="#2b2722" stroke-width="1.5"/>';
  if (stufe >= 3) s += '<path d="M28 40 q-14 2 -18 -6 q12 -3 18 6 z" fill="#7f9a68" stroke="#2b2722" stroke-width="1.5"/><path d="M28 26 V14" stroke="#5f7f3e" stroke-width="2.2" stroke-linecap="round"/>';
  if (stufe === 3) s += '<ellipse cx="28" cy="12" rx="3.6" ry="5" fill="' + farbe + '" stroke="#2b2722" stroke-width="1.5"/>';
  if (stufe >= 4) {
    s += '<g transform="translate(28 11)">';
    for (var i = 0; i < 5; i++) s += '<ellipse rx="3.6" ry="6.4" cy="-6" fill="' + farbe + '" stroke="#2b2722" stroke-width="1.3" transform="rotate(' + (i * 72) + ')"/>';
    s += '<circle r="3.4" fill="#f0a830" stroke="#2b2722" stroke-width="1.3"/></g>';
  }
  return '<svg viewBox="0 0 56 64" aria-hidden="true">' + s + topf + erde + '</svg>';
}
// die Pflanze wächst mit der Zeit, die der Space alt ist (Tage), nicht mit einem Zähler
function stufeAus(tage) { return tage < 2 ? 0 : tage < 7 ? 1 : tage < 21 ? 2 : tage < 60 ? 3 : 4; }
function alterTage(sid) { var x = roh(sid), f = faden(sid), t0 = (x && x.erstellt) || (f && f.erstellt) || Date.now(); return Math.max(0, (Date.now() - t0) / 864e5); }

/* ---------- Öffentliche Schnittstelle ---------- */
var raumApi = null, wartend = null, anflug = null;
var api = C6.space = C6.space || {};
api.places = PLACES;
api.arten = ['ergebnis', 'geruest', 'karte', 'zettel', 'faden'];
api.bild = function (pid, klein) { return bild(pid, null, !!klein); };
api.hol = function (sid) { return rec(sid); };
api.klima = function (sid) { var k = klima(sid); return k ? { tageszeit: k.zeit, name: k.tageszeit, wetter: k.wetter, himmel: k.himmel.slice(), licht: k.licht, nacht: k.nacht, zustand: k.zustand } : null; };
api.alle = function () {
  return faeden().map(function (f) {
    var r = roh(f.id) || {};
    return { stringId: f.id, titel: f.titel, farbe: f.farbe, art: f.art, places: (r.places || waehlePlaces(f)).slice(), kern: r.kern || '', zuletzt: zuletzt(f.id) };
  }).sort(function (a, b) { return b.zuletzt - a.zuletzt; });
};
api.dinge = function (sid) { var r = roh(sid); return ((r && r.dinge) || []).slice(); };
api.legeHin = function (sid, ding) {
  if (!sid || !faden(sid) || !ding) return null;
  var x = rec(sid);
  if (!x) return null;
  var id = 'd' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
  var d = {
    id: id, art: api.arten.indexOf(ding.art) >= 0 ? ding.art : 'ergebnis',
    titel: kurz(ding.titel || 'Ergebnis', 60), text: String(ding.text || '').slice(0, 6000),
    geruest: ding.geruest || null, farbe: ding.farbe || null, mit: ding.mit || null,
    place: (ding.place && PLACES[ding.place]) ? ding.place : (x.jetzt && PLACES[x.jetzt] ? x.jetzt : x.places[0]), ts: Date.now()
  };
  aendern(function (s) {
    var y = s.spaces[sid]; if (!y) return;
    y.dinge = y.dinge || [];
    // gleiche id = ersetzen (ein Gerüst, das noch einmal läuft, legt sein Blatt neu hin)
    if (ding.id) { var alt = y.dinge.filter(function (q) { return q.id === ding.id; })[0]; if (alt) { d.id = id = ding.id; y.dinge.splice(y.dinge.indexOf(alt), 1); } }
    y.dinge.push(d);
    if (y.dinge.length > 40) y.dinge.splice(0, y.dinge.length - 40);
    if (y.places.indexOf(d.place) < 0) y.places.push(d.place);
  });
  try { C6.bus.emit('space', { was: 'ding', stringId: sid, id: id }); } catch (e) {}
  return id;
};
api.oeffne = function (sid, o) {
  o = o || {};
  if (sid && !faden(sid)) sid = null;
  var opts = { string: sid || null, place: o.place || null, neu: !!o.neu, liste: !!o.liste, mit: o.mit || null };
  if (!C6.raeume || !C6.raeume.space) { wartend = opts; return false; }
  // schon im Space: nur den Ort tauschen
  if (C6.jetzt === 'space' && raumApi) { raumApi._wechsel(opts); return true; }
  return C6.geh('space', opts);
};
api.neu = function (titel, o) {
  o = o || {};
  titel = kurz(titel, 48);
  if (!titel || !C6.strings || !C6.strings.neu) return null;
  var f = C6.strings.neu({ titel: titel, art: o.art || 'projekt' });
  if (!f) return null;
  rec(f.id);
  if (o.oeffnen !== false) api.oeffne(f.id, { neu: true });
  return f.id;
};
api.frageNeu = function () {
  if (!C6.frag) return Promise.resolve(null);
  var du = St().du || {}, opt = [];
  var b = du.baut && String(du.baut).trim();
  if (b && !faeden().some(function (f) { return f.titel === kurz(b, 48); })) opt.push({ text: kurz(b, 40), wert: b });
  return C6.frag('Wie heißt der Gedanke, für den wir einen Ort bauen? Ein Name reicht.', opt, { frei: true, id: 'space-neu', platzhalter: opt.length ? 'Oder ein anderer Name …' : 'Name deines Gedankens …' }).then(function (a) {
    return (typeof a === 'string' && a.trim()) ? api.neu(a) : null;
  });
};
api.jetzt = function () { return raumApi ? raumApi._sid() : null; };
try { C6.bus.on('himmel', function (d) { if (d && d.was === 'oeffne') anflug = { id: d.id, t: Date.now() }; }); } catch (e) {}

/* ---------- Der Raum ---------- */
if (!C6.raum) return;
var DEF = {
  id: 'space', name: 'Space', hoehe: 'boden', zurueckKnopf: true, licht: 'tag', weiter: false,
  symbol: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  bauen: function (buehne) {
    var grund = mach('div', 'c6z-sp-grund', buehne);
    // Die Weite: dieselbe Luft, derselbe Boden laufen hinter allem weiter bis an jeden Rand
    var wLuft = mach('div', 'c6z-sp-w-luft', grund);
    var wGlanz = mach('div', 'c6z-sp-w-glanz', grund);
    var wWetter = mach('div', 'c6z-sp-w-wetter', grund);
    var sonne = mach('i', 'c6z-sp-sonne', null); grund.insertBefore(sonne, wWetter);
    var wLand = mach('div', 'c6z-sp-w-land', grund);
    wLand.innerHTML = WEITE_LAND;
    var vorhang = mach('div', 'c6z-sp-vorhang', wLand); vorhang.innerHTML = VORHANG;
    var staub = mach('div', 'c6z-sp-staub', wLand); staub.innerHTML = STAUB;
    var wBoden = mach('div', 'c6z-sp-w-boden', grund);
    mach('div', 'c6z-sp-w-flur', wBoden);
    var gras = mach('div', 'c6z-sp-gras', wBoden); gras.innerHTML = GRAS;
    [wLuft, wGlanz, wWetter, wLand, wBoden, sonne].forEach(function (e) { e.setAttribute('aria-hidden', 'true'); });
    grund.setAttribute('data-tiefe', 'fern');
    var wurzel = mach('div', 'c6k-sp', buehne);
    wurzel.setAttribute('data-tiefe', 'mitte');

    // Die Welt: Places nebeneinander, darüber Luft, Wetter, Leine, Pflanze, Carl
    var welt = mach('div', 'c6k-sp-buehne c6z-sp-welt', wurzel);
    var orte = mach('div', 'c6k-sp-orte', welt);
    orte.setAttribute('data-c6-kein-wisch', '');
    var luft = mach('div', 'c6z-sp-luft', welt);
    var glanz = mach('div', 'c6z-sp-glanz', welt);
    var strahl = mach('div', 'c6z-sp-strahl', welt);
    var wetterEl = mach('div', 'c6z-sp-wetter', welt);
    var gestirn = mach('i', 'c6z-sp-gestirn', welt);
    var leine = mach('div', 'c6z-sp-leine', welt);
    var leineSvg = D.createElementNS('http://www.w3.org/2000/svg', 'svg');
    leineSvg.setAttribute('class', 'c6z-sp-leine-svg'); leineSvg.setAttribute('aria-hidden', 'true');
    leine.appendChild(leineSvg);
    var haken = mach('div', 'c6z-sp-haken', leine);
    var topf = mach('button', 'c6z-sp-pflanze', welt); topf.type = 'button';
    mach('i', 'c6z-sp-kontakt', topf);
    var carlPlatz = mach('div', 'c6k-sp-carl', welt);
    var sitzEl = mach('div', 'c6z-sp-sitz', carlPlatz); sitzEl.setAttribute('aria-hidden', 'true');
    var sitzSchatten = mach('i', 'c6z-sp-kontakt c6z-sp-sitz-kontakt', carlPlatz);
    var ereignisEl = mach('div', 'c6z-sp-ereignis', welt); ereignisEl.setAttribute('aria-hidden', 'true');
    var mitEl = mach('div', 'c6z-sp-mit', welt); mitEl.hidden = true;
    var vor = mach('button', 'c6k-sp-blaettern c6k-sp-vor', welt); vor.type = 'button'; vor.innerHTML = PFEIL_L; vor.setAttribute('aria-label', 'Voriger Place');
    var nach = mach('button', 'c6k-sp-blaettern c6k-sp-nach', welt); nach.type = 'button'; nach.innerHTML = PFEIL_R; nach.setAttribute('aria-label', 'Nächster Place');
    var anflugEl = mach('div', 'c6z-sp-anflug', welt);

    // Der Titel steht auf einem Holzbrett im Bild
    var kopf = mach('header', 'c6k-sp-kopf', wurzel);
    var brett = mach('div', 'c6z-sp-brett', kopf);
    var titelK = mach('button', 'c6k-sp-titel', brett); titelK.type = 'button';
    var punkt = mach('i', 'c6k-sp-punkt', titelK);
    var titelT = mach('span', 'c6k-sp-titel-text', titelK);
    var titelPf = mach('span', 'c6k-sp-titel-pfeil', titelK); titelPf.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>';
    var unterT = mach('p', 'c6z-sp-unter', kopf);

    // Die Places: Holzschilder am Wegweiser (Computer) bzw. an einer Leine (iPhone), „+ Place“ als leeres Schild
    var wahl = mach('nav', 'c6k-sp-wahl c6z-sp-pfahl', wurzel);
    wahl.setAttribute('aria-label', 'Places');
    wahl.setAttribute('data-c6-kein-wisch', '');
    var pfahlStamm = mach('i', 'c6z-sp-stamm', wahl);
    var pfahlSchatten = mach('i', 'c6z-sp-kontakt c6z-sp-pfahl-kontakt', wahl);
    var wahlSpur = mach('div', 'c6k-sp-wahl-spur', wahl);
    var plusK = mach('button', 'c6k-sp-plus c6z-sp-schild c6z-sp-schild-leer', null); plusK.type = 'button';
    plusK.innerHTML = PLUS + '<span>Place</span>'; plusK.setAttribute('aria-label', 'Place hinzufügen');

    wahl.setAttribute('data-c6-bild', ''); brett.setAttribute('data-c6-bild', '');
    var fuss = mach('div', 'c6z-sp-fuss', wurzel); fuss.hidden = true;

    var pult = mach('section', 'c6k-sp-pult', wurzel);
    pult.setAttribute('aria-label', 'Gespräch');
    var faden_ = mach('ol', 'c6k-sp-faden', pult);

    var blatt = mach('div', 'c6k-sp-blatt', wurzel);
    blatt.hidden = true;
    blatt.setAttribute('role', 'dialog');
    var blattKopf = mach('div', 'c6k-sp-blatt-kopf', blatt);
    var blattT = mach('h2', 'c6k-sp-blatt-titel', blattKopf);
    var blattZu = mach('button', 'c6k-sp-blatt-zu', blattKopf); blattZu.type = 'button'; blattZu.innerHTML = ZU; blattZu.setAttribute('aria-label', 'Schließen');
    var blattInhalt = mach('div', 'c6k-sp-blatt-inhalt', blatt);
    blattInhalt.setAttribute('data-c6-kein-wisch', 'senkrecht');

    var ctl = null;
    try { ctl = C6.figur && C6.figur.male ? C6.figur.male(carlPlatz, { groesse: 150 }) : null; } catch (e) { ctl = null; }
    if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'space');

    var fuehre = null, sid = null, place = null, hier = false, gesagt = {}, scrollUhr = null, ortNodes = [], wahlNodes = [], blattArt = null, modus = null, K = null, leineSchl = '', dingSchl = '';

    function r() { return sid ? rec(sid) : null; }
    function placesJetzt() { var x = r(); return x ? x.places.filter(function (p) { return PLACES[p]; }) : ['schreibtisch']; }
    function P() { return PLACES[place] || PLACES.schreibtisch; }
    function comp() { return C6.geraet === 'computer'; }

    // Bausteine hängen an der Leine: ändert sich einer, wird die Leine neu behängt
    C6.bus.on('baustein', function (d) { if (!hier || !d || d.sid !== sid) return; leineSchl = ''; leineZeichnen(); if (d.was === 'neu' && ctl && ctl.blickZu) { var a = haken.querySelector('.c6z-sp-anh[data-art="' + d.art + '"]'); if (a) { var rr = a.getBoundingClientRect(); try { ctl.blickZu(rr.left + rr.width / 2, rr.top + rr.height / 2, 1400); } catch (e) {} } } });

    /* ----- Licht: Quelle des Space (Sonne, Mond, Fenster) und Kontaktschatten der Dinge ----- */
    function lichtQuelle() {
      if (!K) return null;
      var p = P(), L = LICHT[K.zeit] || LICHT.mittag, q;
      if (!p.draussen) q = { x: 0.86, y: 0.3, art: K.nacht || p.nacht ? 'lampe' : 'fenster', warm: K.nacht || p.nacht ? 0.85 : L.warm, staerke: 0.7, hoehe: 0.55 };
      if (!p.draussen && LICHT_ORT[place]) {
        var lo = LICHT_ORT[place], pt = ortPunkt(lo.x, lo.y);
        if (pt) { q.x = +pt.x.toFixed(3); q.y = +pt.y.toFixed(3); q.art = K.nacht || p.nacht ? 'lampe' : lo.art; if (lo.art === 'lampe') { q.warm = Math.max(q.warm, 0.75); q.hoehe = 0.62; } }
      }
      else q = { x: K.gx, y: Math.max(0.04, K.gy * 0.55), art: K.nacht || p.nacht ? 'mond' : 'sonne', warm: p.nacht ? 0.2 : L.warm, staerke: p.nacht ? 0.45 : L.staerke, hoehe: Math.max(0.2, 1 - K.gy) };
      return q;
    }
    // ein Punkt im Bild des jetzigen Place (480 × 300) als Bühnenmaß 0..1; unabhängig davon, wie weit die Orte gerade gerollt sind
    function ortPunkt(vx, vy) {
      var o = orte.querySelector('.c6k-sp-ort[data-place="' + place + '"]'), sv = o && o.querySelector('.c6z-sp-leben');
      if (!sv) return null;
      var br = buehne.getBoundingClientRect(), cr = orte.getBoundingClientRect(), or = o.getBoundingClientRect(), r = sv.getBoundingClientRect();
      if (!br.width || !r.width || !r.height) return null;
      var sl = /slice/.test(sv.getAttribute('preserveAspectRatio') || ''), sk = sl ? Math.max(r.width / 480, r.height / 300) : Math.min(r.width / 480, r.height / 300);
      var X = cr.left - br.left + (r.left - or.left) + (r.width - 480 * sk) / 2 + vx * sk, Y = cr.top - br.top + (r.top - or.top) + (r.height - 300 * sk) + vy * sk;
      return { x: X / br.width, y: Y / br.height, s: sk };
    }
    // Kontaktschatten der gezeichneten Dinge im Place (Ellipsen im Bildmaß), vom Licht weg
    function ortSchatten() {
      if (!C6.lichtquelle || !C6.lichtquelle.schatten) return;
      var o = orte.querySelector('.c6k-sp-ort[data-place="' + place + '"]');
      if (!o) return;
      Array.prototype.forEach.call(o.querySelectorAll('.c6z-sp-l-sch'), function (el) {
        var pt = ortPunkt(+el.getAttribute('cx'), +el.getAttribute('cy')), sch;
        if (!pt) return;
        try { sch = C6.lichtquelle.schatten(pt.x, pt.y, Math.max(16, +el.getAttribute('rx') * 1.1) * pt.s); } catch (e) { sch = null; }
        if (!sch) return;
        el.style.setProperty('--sp-l-dx', ((sch.dx || 0) / pt.s).toFixed(1) + 'px');
        el.style.setProperty('--sp-l-dy', (Math.max(0.6, (sch.dy || 0) / pt.s * 0.5)).toFixed(1) + 'px');
        el.style.setProperty('--sp-l-sk', (sch.skala || 1).toFixed(2));
        el.style.setProperty('--sp-l-sch-a', Math.min(0.3, (sch.a || 0.16) * 0.85).toFixed(2));
      });
    }
    var lichtSchl = '';
    function lichtQuelleSetzen() {
      var q = lichtQuelle(); if (!q) return;
      var schl = [q.x, q.y, q.art, q.warm].join('|');
      // Eigenschatten der Bilder: die lichtabgewandte Seite wird einen Hauch dunkler
      [wurzel.style, grund.style].forEach(function (s) {
        s.setProperty('--sp-eigen-von', q.x < 0.5 ? 'left' : 'right');
        s.setProperty('--sp-eigen-a', (0.05 + 0.12 * (1 - q.hoehe)).toFixed(3));
      });
      // Sonne oder Mond in der Weite, dort, wo die Quelle liegt
      var gestirnArt = q.art === 'mond' ? 'mond' : (q.art === 'sonne' ? 'sonne' : '');
      if (sonne._art !== gestirnArt) { sonne._art = gestirnArt; sonne.innerHTML = gestirnArt === 'mond' ? MOND : (gestirnArt ? SONNE : ''); }
      sonne.hidden = !gestirnArt || !!(K && K.leer);
      // Die Sonne steht über der Landschaft: im Bild, solange die Quelle über dem Bild liegt, sonst in der Weite daneben
      var br = buehne.getBoundingClientRect(), wr = welt.getBoundingClientRect();
      var sx = q.x * br.width, sy = q.y * br.height, imBild = !comp() || (sx < wr.right - br.left - 40);
      if (imBild) {
        if (sonne.parentNode !== welt) welt.insertBefore(sonne, wetterEl);
        sonne.style.left = Math.round(Math.max(30, sx - (wr.left - br.left))) + 'px';
        // nicht ins Band von Titel und Leine (iPhone), nicht über das Bild hinaus
        sonne.style.top = Math.round(Math.max(comp() ? 40 : 190, Math.min(sy - (wr.top - br.top), (wr.height - (letztBildH || 0)) + 10))) + 'px';
      } else {
        if (sonne.parentNode !== grund) grund.insertBefore(sonne, wWetter);
        sonne.style.left = (q.x * 100).toFixed(1) + '%';
        sonne.style.top = (q.y * 100).toFixed(1) + '%';
      }
      grund.style.setProperty('--sp-wgx', (q.x * 100).toFixed(1) + '%');
      grund.style.setProperty('--sp-wgy', (q.y * 100).toFixed(1) + '%');
      if (lichtSchl === schl) return;
      lichtSchl = schl;
      try { if (C6.lichtquelle && C6.lichtquelle.setze) C6.lichtquelle.setze('space', q); } catch (e) {}
    }
    // Kontaktschatten unter allem, was auf dem Boden steht: vom Licht weg, mit Deckkraft der Quelle
    function schattenAn(el, hPx) {
      if (!el || !C6.lichtquelle || !C6.lichtquelle.schatten) return;
      var br = buehne.getBoundingClientRect(), rr = el.getBoundingClientRect();
      if (!br.width || !rr.width) return;
      var x = (rr.left + rr.width / 2 - br.left) / br.width, y = (rr.bottom - br.top) / br.height, s;
      try { s = C6.lichtquelle.schatten(x, y, hPx || 40); } catch (e) { s = null; }
      if (!s) return;
      el.style.setProperty('--sch-dx', (s.dx || 0).toFixed(1) + 'px');
      el.style.setProperty('--sch-dy', (s.dy || 0).toFixed(1) + 'px');
      el.style.setProperty('--sch-a', (s.a || 0.16).toFixed(2));
      el.style.setProperty('--sch-sk', (s.skala || 1).toFixed(2));
    }
    var schattenUhr = 0;
    function schattenLegen() {
      if (!hier) return;
      cancelAnimationFrame(schattenUhr);
      schattenUhr = requestAnimationFrame(function () {
        schattenAn(carlPlatz, 36); schattenAn(topf, 48);
        if (comp()) schattenAn(wahl, 120);
        ortSchatten();
        Array.prototype.forEach.call(welt.querySelectorAll('.c6z-sp-ding'), function (b) { schattenAn(b, 40); });
      });
    }
    C6.bus.on('licht', function (d) { if (hier && d && d.raum === 'space') schattenLegen(); });

    /* ----- Licht: die Hülle des Space ----- */
    // noch kein Space: ein Bauplatz im Frühdunst, die Leine ist schon gespannt
    function leerKlima() {
      var z = zeitJetzt(), Z = ZEIT[z];
      return { zeit: z, tageszeit: Z.name, wetter: Z.nacht ? 'sterne' : 'klar', wetterName: '', nacht: !!Z.nacht, himmel: [mische(Z.o, '#d62a26', 0.12), Z.u], licht: Z.glanz, staerke: Z.a, gx: Z.gx, gy: Z.gy,
        papier: mische('#f4eee4', Z.u, 0.2), zustand: 'neu', ruht: false, fuelle: 0, farbe: '#d62a26', art: 'projekt', leer: true };
    }
    function lichtSetzen() {
      K = sid ? klima(sid) : leerKlima();
      var st = wurzel.style, gs = grund.style;
      var p = P(), a = K.staerke;
      if (p.nacht) a = Math.min(a, 0.22);
      [st, gs].forEach(function (s) {
        s.setProperty('--sp-papier', K.papier);
        s.setProperty('--sp-o', K.himmel[0]);
        s.setProperty('--sp-u', K.himmel[1]);
        s.setProperty('--sp-licht', K.licht);
        s.setProperty('--sp-a', String(a));
        s.setProperty('--sp-akzent', K.farbe);
        s.setProperty('--sp-gx', Math.round(K.gx * 100) + '%');
        s.setProperty('--sp-gy', Math.round(K.gy * 100) + '%');
      });
      wurzel.setAttribute('data-zeit', K.zeit);
      wurzel.setAttribute('data-wetter', K.wetter);
      wurzel.setAttribute('data-zustand', K.ruht ? 'ruht' : K.zustand);
      wurzel.classList.toggle('c6z-sp-nachts', K.nacht);
      wurzel.classList.toggle('c6z-sp-drinnen', !p.draussen);
      wurzel.classList.toggle('c6k-sp-nacht', !!p.nacht);
      grund.classList.toggle('c6z-sp-nachts', K.nacht);
      grund.classList.toggle('c6z-sp-drinnen', !p.draussen);
      grund.classList.toggle('c6z-sp-ortnacht', !!p.nacht && !K.nacht);
      grund.style.setProperty('--sp-ort', p.oben || p.grund || '#f4eee4');
      grund.setAttribute('data-wetter', K.wetter);
      gestirn.style.setProperty('--sp-planet', K.farbe);
      gestirn.hidden = !!K.leer;
      nachtKopf(K.nacht || !!p.nacht);
      wetterBauen();
      lichtQuelleSetzen();
      schattenLegen();
      // drinnen sieht man das Wetter nicht, man weiß es nur
      if (!K.leer) unterT.textContent = ART_KURZ[K.art] + ' · ' + K.tageszeit;
    }
    function nachtKopf(an) {
      var soll = an ? 'nacht' : 'tag';
      if (C6.licht) { try { C6.licht('space', soll); return; } catch (e) {} }
      if (DEF.licht !== soll) { DEF.licht = soll; if (hier && C6.benenne) C6.benenne('space', DEF.name); }
    }
    // Wetter in derselben Tusche wie die Zeichnungen: Wolken mit Kontur, Regenstriche, Schneeflocken, Nebelbänder
    function wetterBauen() {
      var w = K ? K.wetter + '|' + (K.ruht ? 'r' : '') + K.zustand : '';
      if (wetterEl._w === w) return;
      wetterEl._w = w;
      wetterEl.textContent = '';
      wWetter.textContent = '';
      if (!K) return;
      weiteWetter();
      var s = hash((sid || 'leer') + 'w');
      if (K.wetter === 'wolken' || K.wetter === 'wind' || K.wetter === 'regen' || K.wetter === 'schnee') {
        var n = (K.wetter === 'wolken' || K.wetter === 'wind') ? 2 : 1;
        for (var i = 0; i < n; i++) {
          var c = mach('div', 'c6z-sp-wolke', wetterEl);
          c.innerHTML = WOLKE;
          c.style.setProperty('--x', ((s >>> (i * 4)) % 70 + i * 12) + '%');
          c.style.setProperty('--y', (((s >>> (i * 3 + 2)) % 26) - i * 22) + 'px');
          c.style.setProperty('--b', (K.wetter === 'regen' || K.wetter === 'schnee' ? 150 : 96) + i * 26 + 'px');
          c.style.setProperty('--d', (K.wetter === 'wind' ? 22 : 40) + i * 12 + 's');
          c.style.setProperty('--v', -((s >>> i) % 30) + 's');
        }
      }
      if (K.wetter === 'regen') mach('div', 'c6z-sp-regen', wetterEl);
      if (K.wetter === 'schnee') mach('div', 'c6z-sp-schnee', wetterEl);
      if (K.wetter === 'sterne') mach('div', 'c6z-sp-sterne', wetterEl);
      if (K.wetter === 'nebel' || K.ruht) mach('div', 'c6z-sp-nebel c6z-sp-nebel-a', wetterEl);
    }

    // Wetter geht leise: erst ausblenden, dann neu setzen
    function wetterGeht() {
      if (!hier) { lichtSetzen(); return; }
      [wetterEl, wWetter].forEach(function (e) { e.classList.add('c6z-sp-w-geht'); });
      spaeter(function () { [wetterEl, wWetter].forEach(function (e) { e.classList.remove('c6z-sp-w-geht'); }); if (sid) lichtSetzen(); }, C6.ruhig ? 0 : 1700);
    }
    // beim Betreten: Nebel nach langer Stille hebt sich; selten zieht ein kurzer Schauer durch
    var wetterUhr = 0;
    function wetterBeimBetreten(warBesucht) {
      clearTimeout(wetterUhr);
      if (!sid) return;
      var jetzt = Date.now(), id = sid;
      if (warBesucht && jetzt - warBesucht > 21 * 864e5) {
        NEBEL[id] = jetzt + 60000;
        wetterUhr = spaeter(function () { delete NEBEL[id]; if (sid === id) wetterGeht(); }, C6.ruhig ? 400 : 2600);
        return;
      }
      var z = zeitJetzt(), m = new Date().getMonth();
      if (ZEIT[z].nacht || C6.ruhig) return;
      var los = hash(id + '|' + new Date().toDateString() + '|' + new Date().getHours()) % 11 === 0;
      if (!los || (SCHAUER[id] && jetzt - SCHAUER[id].bis < 3 * 3600e3)) return;
      SCHAUER[id] = { art: (m === 11 || m <= 1) ? 'schnee' : 'regen', bis: jetzt + 24000 };
      wetterUhr = spaeter(function () { if (sid === id) wetterGeht(); }, 24000);
    }

    // In der Weite: ein, zwei ferne Wolken, die sehr langsam ziehen; Regen, Schnee, Sterne und Nebel wie im Ort, nur leiser
    function weiteWetter() {
      var s = hash((sid || 'leer') + 'weite'), n = 0;
      for (var i = 0; i < n; i++) {
        var c = mach('div', 'c6z-sp-wolke c6z-sp-w-wolke', wWetter);
        c.innerHTML = WOLKE;
        c.style.setProperty('--x', (8 + (s >>> (i * 5)) % 50 + i * 30) + '%');
        c.style.setProperty('--y', (14 + ((s >>> (i * 3)) % 40) + i * 34) + 'px');
        c.style.setProperty('--b', (84 + i * 30) + 'px');
        c.style.setProperty('--d', (95 + i * 30) + 's');
        c.style.setProperty('--v', -((s >>> i) % 60) + 's');
      }
      // die Weite ist fern: nur Sterne und Nebel, Regen und Schnee fallen im Bild (Dauerbewegung ≤ 8)
      if (K.wetter === 'sterne' || K.nacht) mach('div', 'c6z-sp-sterne', wWetter);
      if (K.wetter === 'nebel') mach('div', 'c6z-sp-nebel c6z-sp-nebel-a', wWetter);
    }
    // Horizont der Weite = Boden der Zeichnung (dort, wo Carl steht, und ein Stück dahinter)
    // Boden der Zeichnung lesen: die letzte breite Fläche unten gibt Farbe, die erste ab der Bildmitte die Höhe
    var bodenCache = {}, letztBildH = 0;
    function bodenVon(pid) {
      if (bodenCache[pid] !== undefined) return bodenCache[pid];
      var svg = (C6.space._bilder || {})[pid] || '', re = /<rect([^>]*)>/g, m, erst = null, letzt = null;
      while ((m = re.exec(svg))) {
        var a = m[1], w = /width="([\d.]+)"/.exec(a), y = /\sy="([\d.]+)"/.exec(a), f = /fill="(#[0-9a-fA-F]{6})"/.exec(a);
        if (!w || +w[1] < 400 || !y || +y[1] < 140 || !f) continue;
        if (!erst) erst = { y: +y[1], f: f[1] }; letzt = { y: +y[1], f: f[1] };
      }
      return (bodenCache[pid] = erst ? { y: erst.y, f: letzt.f } : null);
    }
    function weiteMessen(bildH) {
      var bt = buehne.getBoundingClientRect(), wr = welt.getBoundingClientRect();
      if (!bt.height || !wr.height) return;
      var b = bodenVon(place), anteil = b ? (300 - b.y) / 300 : 0.3;
      var hor = Math.round(wr.bottom - bt.top - bildH * anteil);
      var gs = grund.style;
      gs.setProperty('--sp-horizont', hor + 'px');
      gs.setProperty('--sp-bu', Math.max(30, Math.round(wr.bottom - bt.top - hor)) + 'px');
      if (P().nacht) { gs.removeProperty('--sp-boden'); gs.removeProperty('--sp-boden-hell'); }
      else if (b && !(K && K.nacht)) {
        gs.setProperty('--sp-boden', 'color-mix(in srgb,' + b.f + ' 82%,var(--sp-papier))');
        gs.setProperty('--sp-boden-hell', 'color-mix(in srgb,' + b.f + ' 36%,var(--sp-papier))');
      } else { gs.removeProperty('--sp-boden'); gs.setProperty('--sp-boden-hell', 'color-mix(in srgb,var(--sp-boden) 70%,var(--sp-papier))'); }
    }

    // Oberkante des Bodens im Bild (0..1 der Welt): Bausteine stehen nicht höher als hier
    function bodenMin() {
      var b = bodenVon(place), h = welt.clientHeight || 300, bildH = letztBildH || h * 0.6;
      var anteil = b ? (300 - b.y) / 300 : 0.3;
      return Math.max(0.5, Math.min(0.9, 1 - (bildH * anteil) / h + 0.03));
    }

    /* ----- Carls Sitz: nach etwas Ruhe setzt er sich, bei jeder Regung steht er auf ----- */
    var ruheSeit = Date.now(), sitzUhr = 0, sitzPid = null;
    function sitzSetzen() { if (place && place !== sitzPid) { sitzPid = place; sitzEl.innerHTML = sitzSvg(place); } }
    function aufstehen() { ruheSeit = Date.now(); try { if (ctl && ctl.sitztJetzt) ctl.sitz(false); } catch (e) {} }
    function sitzPruefen() {
      if (!hier || !ctl || !ctl.sitz || D.hidden) return;
      var still = !(C6.projektor && C6.projektor.offen) && !(C6.denktGerade && C6.denktGerade()) && blatt.hidden && Math.abs(ctl.x || 0) < 2 && Math.abs(ctl.y || 0) < 2 && !ctl.fliegtJetzt && mitEl.hidden;
      if (!still) { if (ctl.sitztJetzt) aufstehen(); return; }
      if (!ctl.sitztJetzt && Date.now() - ruheSeit > 7000) { try { ctl.stimmungJetzt === 'froh' || ctl.stimmung('ruhig'); ctl.sitz(true); } catch (e) {} }
    }
    carlPlatz.addEventListener('pointerdown', aufstehen);
    // Carls Gewohnheiten je Place, wenn die Figur sie anbietet
    function gewohnheitenSetzen() {
      if (!ctl) return;
      var g = GEWOHN[place] || ['umsehen'];
      try { if (typeof ctl.gewohnheiten === 'function') ctl.gewohnheiten(g.slice()); } catch (e) {}
    }

    /* ----- Kleine Ereignisse, wenn man eine Weile nur schaut: ein Vogel landet, ein Blatt fällt, der Vorhang hebt sich ----- */
    var ereignisNr = 0, ereignisLaeuft = false;
    function carlSchautZu(x, y, ms) {
      if (!ctl) return;
      try { if (ctl.blickZu) ctl.blickZu(x, y, ms || 2200); else ctl.schau(x, y); } catch (e) {}
    }
    function vogelLandet() {
      if (ereignisLaeuft || C6.ruhig) return;
      ereignisLaeuft = true;
      var w = welt.clientWidth || 390, h = welt.clientHeight || 300, c = comp();
      // Sitzplatz: auf der Leine, rechts von den Zetteln
      var zx = Math.round(w * (c ? 0.62 : 0.74)), zy = Math.round((c ? 64 : 100) + (c ? 34 : 18) * 4 * (zx / w) * (1 - zx / w)) - 24;
      var v = mach('div', 'c6z-sp-vogel', ereignisEl); v.innerHTML = VOGEL;
      var vonRechts = (ereignisNr % 2) === 0, x0 = vonRechts ? w + 50 : -50, y0 = Math.max(10, zy - 70 - h * 0.15);
      v.style.left = zx + 'px'; v.style.top = zy + 'px';
      if (!vonRechts) v.classList.add('c6z-sp-vogel-links');
      var wr = welt.getBoundingClientRect();
      var an = v.animate([
        { transform: 'translate(' + (x0 - zx) + 'px,' + (y0 - zy) + 'px) rotate(' + (vonRechts ? -4 : 4) + 'deg)', opacity: 0 },
        { transform: 'translate(' + ((x0 - zx) * 0.45) + 'px,' + ((y0 - zy) * 0.5 - 18) + 'px) rotate(' + (vonRechts ? -8 : 8) + 'deg)', opacity: 1, offset: 0.5 },
        { transform: 'translate(0,-10px) rotate(0)', offset: 0.86 },
        { transform: 'translate(0,2px)', offset: 0.95 },
        { transform: 'translate(0,0)' }
      ], { duration: 1500, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards' });
      spaeter(function () { carlSchautZu(wr.left + zx + 16, wr.top + zy + 12, 3600); }, 700);
      an.onfinish = function () {
        v.classList.add('c6z-sp-vogel-sitzt');
        spaeter(function () {
          if (!v.parentNode) return;
          v.classList.remove('c6z-sp-vogel-sitzt');
          var weg = v.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(' + (vonRechts ? -30 : 30) + 'px,-26px) rotate(' + (vonRechts ? 6 : -6) + 'deg)', offset: 0.3 }, { transform: 'translate(' + (vonRechts ? -w * 0.6 : w * 0.6) + 'px,' + (-h * 0.5) + 'px) rotate(' + (vonRechts ? 10 : -10) + 'deg)', opacity: 0 }], { duration: 1100, easing: 'cubic-bezier(.5,0,.8,.6)', fill: 'forwards' });
          weg.onfinish = function () { v.remove(); ereignisLaeuft = false; };
        }, 4200 + (ereignisNr % 3) * 800);
      };
    }
    function blattFaellt() {
      if (ereignisLaeuft || C6.ruhig) return;
      ereignisLaeuft = true;
      var w = welt.clientWidth || 390, h = welt.clientHeight || 300;
      var b = mach('div', 'c6z-sp-blattfall', ereignisEl); b.innerHTML = BLATT;
      var x = Math.round(w * (0.2 + ((ereignisNr * 37) % 60) / 100)), y0 = Math.round(h * 0.12), y1 = Math.round(h * 0.95);
      b.style.left = x + 'px'; b.style.top = y0 + 'px';
      var wr = welt.getBoundingClientRect();
      var an = b.animate([
        { transform: 'translate(0,0) rotate(0)', opacity: 0 }, { transform: 'translate(18px,' + ((y1 - y0) * 0.25) + 'px) rotate(40deg)', opacity: 1, offset: 0.25 },
        { transform: 'translate(-14px,' + ((y1 - y0) * 0.5) + 'px) rotate(-30deg)', offset: 0.5 }, { transform: 'translate(16px,' + ((y1 - y0) * 0.78) + 'px) rotate(50deg)', offset: 0.78 },
        { transform: 'translate(2px,' + (y1 - y0) + 'px) rotate(10deg)', opacity: 1 }
      ], { duration: 4200, easing: 'ease-in-out', fill: 'forwards' });
      spaeter(function () { carlSchautZu(wr.left + x, wr.top + y0 + (y1 - y0) * 0.5, 3000); }, 600);
      an.onfinish = function () { var w2 = b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1600, delay: 1200, fill: 'forwards' }); w2.onfinish = function () { b.remove(); ereignisLaeuft = false; }; };
    }
    function vorhangHebtSich() {
      if (ereignisLaeuft || C6.ruhig || !vorhang.animate) return;
      ereignisLaeuft = true;
      var vr = vorhang.getBoundingClientRect();
      vorhang.animate([{ transform: 'skewX(0)' }, { transform: 'skewX(-7deg) translateX(-6px)', offset: 0.4 }, { transform: 'skewX(3deg) translateX(2px)', offset: 0.75 }, { transform: 'skewX(0)' }], { duration: 2600, easing: 'ease-in-out' });
      staub.classList.add('c6z-sp-staub-an'); spaeter(function () { staub.classList.remove('c6z-sp-staub-an'); }, 6000);
      carlSchautZu(vr.left + vr.width / 2, vr.top + vr.height / 2, 2400);
      spaeter(function () { ereignisLaeuft = false; }, 2800);
    }
    function ereignis() {
      if (!hier || !sid || D.hidden) return;
      ereignisNr++;
      var p = P();
      if (!p.draussen) { vorhangHebtSich(); return; }
      if (K && (K.wetter === 'wind' || K.wetter === 'wolken') && ereignisNr % 3 === 0) blattFaellt(); else vogelLandet();
    }
    C6.bus.on('warte', function (d) { if (!hier || !d || (d.raum && d.raum !== 'space')) return; if (d.stufe === 2) ereignis(); });
    // Gras und Baum wippen, wenn man sie antippt
    function wippe(el, grad) {
      if (!el || C6.ruhig || !el.animate) return;
      el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(' + (-grad) + 'deg)' }, { transform: 'rotate(' + (grad * 0.6) + 'deg)' }, { transform: 'rotate(' + (-grad * 0.25) + 'deg)' }, { transform: 'rotate(0)' }], { duration: 900, easing: 'ease-out' });
    }
    gras.addEventListener('pointerdown', function (e) { var g = e.target.closest ? e.target.closest('.c6z-sp-halm') : null; wippe(g || gras.querySelector('.c6z-sp-halm'), 9); });
    wLand.addEventListener('pointerdown', function (e) { var b = e.target.closest ? e.target.closest('.c6z-sp-w-baum') : null; if (b) wippe(b, 4); });
    ['gespraech', 'projektor', 'werkzeug', 'geruest', 'verlauf'].forEach(function (n) { try { C6.bus.on(n, function () { if (hier) aufstehen(); }); } catch (e) {} });
    D.addEventListener('keydown', function () { if (hier) ruheSeit = Date.now(); });

    /* ----- Größe ----- */
    function groesse() {
      var c = comp();
      wurzel.classList.toggle('c6k-sp-computer', c);
      grund.classList.toggle('c6z-sp-w-computer', c);
      // Computer: Pfahl und Regal stehen unten rechts auf dem Boden; iPhone: Schilder an der Leine unter dem Bild, Regal in der Landschaft
      // Computer: ein durchgehender Ort; der Wegweiser steht am Weg neben Carl, die Zeichnung füllt die ganze Bühne
      if (c) { if (wahl.parentNode !== welt) welt.insertBefore(wahl, anflugEl); fuss.hidden = true; }
      // iPhone: auch hier steht der Wegweiser am Weg neben Carl, in der Szene
      else { if (wahl.parentNode !== welt) welt.insertBefore(wahl, anflugEl); fuss.hidden = true; }
      spaeter(schattenLegen, 80);
      var h = welt.clientHeight || 300, w = welt.clientWidth || 390;
      // Carl steht auf dem Boden der Zeichnung: Höhe des Bildes = Breite × 300/480
      var bildH = Math.min(h, w * 0.625);
      var px = Math.round(c ? Math.min(h * 0.38, 280) : Math.min(bildH * 0.52, w * 0.34, 132));
      if (ctl) ctl.groesse(Math.max(96, px));
      welt.style.setProperty('--sp-carl', Math.max(96, px) + 'px');
      ganzesBild(c);
      welt.style.setProperty('--sp-bild-h', Math.round(bildH) + 'px');
      letztBildH = bildH; weiteMessen(bildH);
      var i = placesJetzt().indexOf(place);
      if (i >= 0 && orte.clientWidth) orte.scrollLeft = i * orte.clientWidth;
      leineSchl = '';
      leineZeichnen();
    }

    // am Computer füllt jede Zeichnung die Bühne (keine Ränder in anderer Farbe); am iPhone wie gezeichnet
    function ganzesBild(c) {
      Array.prototype.forEach.call(orte.querySelectorAll('svg.c6z-sp-zeichnung'), function (svg) {
        if (!svg.hasAttribute('data-par')) svg.setAttribute('data-par', svg.getAttribute('preserveAspectRatio') || '');
        svg.setAttribute('preserveAspectRatio', c ? 'xMidYMax slice' : svg.getAttribute('data-par'));
      });
    }

    /* ----- Kopf ----- */
    function kopfZeichnen() {
      var f = sid ? faden(sid) : null;
      wurzel.classList.toggle('c6k-sp-leer', !f);
      if (f) {
        titelT.textContent = f.titel;
        punkt.style.background = f.farbe || 'var(--faden)';
        titelK.setAttribute('aria-label', f.titel + ' · Deine Spaces');
        if (C6.benenne) C6.benenne('space', f.titel);
        leineSchl = '';
      } else {
        titelT.textContent = 'Dein erster Space';
        punkt.style.background = 'var(--faden)';
        titelK.setAttribute('aria-label', 'Deine Spaces');
        unterT.textContent = 'Ein Ort für einen Gedanken.';
        if (C6.benenne) C6.benenne('space', 'Space');
      }
    }

    /* ----- Die Leine: der Faden quer durch den Ort ----- */
    function leineZeichnen() {
      var x = r(), f = sid ? faden(sid) : null;
      var w = welt.clientWidth || 390, h = welt.clientHeight || 300, c = comp();
      var nz = (x && x.notizen) || [], kern = (x && x.kern) || '', perlen = ((f && f.perlen) || []).length;
      var anhAlle = anhListe();
      var schl = [sid, w, h, c, nz.length, nz.length ? nz[nz.length - 1].ts : 0, kern, perlen, K && K.nacht, JSON.stringify(anhAlle.map(function (a) { return [a.art, a.oben, a.text]; }))].join('|');
      if (leineSchl === schl) return;
      leineSchl = schl;
      haken.textContent = '';
      leineSvg.textContent = '';
      // Lage: unter dem Titel, rechts frei für Höhenregler und Nadel (iPhone)
      var kb = c ? 0 : Math.round(kopf.getBoundingClientRect().bottom - welt.getBoundingClientRect().top);
      var kl = c ? Math.round(kopf.getBoundingClientRect().left - welt.getBoundingClientRect().left) : w;
      var y0 = c ? 64 : Math.max(106, kb + 6), lw = c ? Math.min(w + 4, kl + 27) : w + 4, rechts = c ? Math.min(w - 24, lw - 58) : w - 74, links = c ? 28 : 12, sack = c ? 34 : 18;
      leine.style.top = '0px';
      leineSvg.setAttribute('viewBox', '0 0 ' + w + ' ' + Math.round(y0 + sack + 20));
      leineSvg.setAttribute('width', w); leineSvg.setAttribute('height', Math.round(y0 + sack + 20));
      function yBei(px) { var t = px / (lw - 4); return y0 + sack * 4 * t * (1 - t) - (c ? 0 : 6) * t; }
      var NS = 'http://www.w3.org/2000/svg';
      var pfad = D.createElementNS(NS, 'path');
      pfad.setAttribute('d', 'M-4 ' + y0 + ' Q' + (lw / 2) + ' ' + (y0 + sack * 2 - (c ? 0 : 3)) + ' ' + lw + ' ' + (y0 - (c ? 0 : 6)));
      pfad.setAttribute('class', 'c6z-sp-schnur');
      leineSvg.appendChild(pfad);
      if (!f) return;

      // was an der Leine hängt: Kernsatz (rote Nadel), dann die Bausteine (Nächster Schritt, Termin, Gewohnheit),
      // dann Zettel, neueste zuerst, dann ein leerer Zettel
      var kernB = c ? 196 : (anhAlle.length ? 124 : 146), zB = c ? 112 : 78, plusB = 50, abst = c ? 18 : 10, anhB = c ? 136 : 100;
      var frei = rechts - links - kernB - abst - plusB - abst;
      // die dringendsten Anhänger zuerst; was nicht passt, liegt im Blatt „An der Leine“
      var anh = anhAlle.slice(0, Math.max(0, Math.min(anhAlle.length, Math.floor((frei + abst) / (anhB + abst)))));
      frei -= anh.length * (anhB + abst);
      var platz = Math.max(0, Math.floor((frei + abst) / (zB + abst)));
      var zeigen = nz.slice().reverse().slice(0, platz), rest = nz.length - zeigen.length + (anhAlle.length - anh.length);
      var xPos = links, belegt = [];
      function haenge(el, breite, dreh) {
        var mx = xPos + breite / 2, y = yBei(mx);
        el.style.left = Math.round(xPos) + 'px';
        el.style.top = Math.round(y - 5) + 'px';
        el.style.width = breite + 'px';
        el.style.setProperty('--r', dreh + 'deg');
        belegt.push([xPos, xPos + breite]);
        xPos += breite + abst;
      }
      var kk = mach('button', 'c6z-sp-kern' + (kern ? '' : ' c6z-sp-kern-leer'), haken); kk.type = 'button';
      var kn = mach('span', 'c6z-sp-nadel', kk); kn.innerHTML = PIN;
      mach('span', 'c6z-sp-kern-text', kk, kern ? '„' + kern + '“' : 'Der eine Satz fehlt noch.');
      kk.setAttribute('aria-label', kern ? 'Der eine Satz: ' + kern : 'Den einen Satz festlegen');
      kk.addEventListener('click', kernFrage);
      haenge(kk, kernB, -1.2);
      anh.forEach(function (a) { haenge(anhKnopf(a, haken), anhB, ((hash(a.art) % 5) - 2) * 0.8); });
      zeigen.forEach(function (n, j) {
        var z = mach('button', 'c6z-sp-zettel', haken); z.type = 'button';
        z.innerHTML = KLAMMER;
        mach('span', 'c6z-sp-zettel-text', z, n.t);
        z.setAttribute('aria-label', 'Zettel: ' + n.t);
        z.addEventListener('click', function () { zettelFrage(n); });
        haenge(z, zB, ((hash(n.ts + '') % 7) - 3) * 0.9);
      });
      var pk = mach('button', 'c6z-sp-zettel c6z-sp-zettel-neu', haken); pk.type = 'button';
      pk.innerHTML = KLAMMER + (rest > 0 ? '<span class="c6z-sp-zettel-text">+' + rest + '</span>' : PLUS);
      pk.setAttribute('aria-label', rest > 0 ? 'Alles an der Leine (' + (nz.length + anhAlle.length) + ')' : 'Etwas aufhängen');
      pk.addEventListener('click', function () { if (rest > 0) oeffneBlatt('zettel'); else aufhaengen(); });
      haenge(pk, plusB, 2);

      // Perlen: in den Lücken aufgefädelt, in der Farbe des Fadens
      var luecken = [];
      var vorher = 4;
      belegt.concat([[lw - 8, lw]]).forEach(function (b) { if (b[0] - vorher > 22) luecken.push([vorher + 9, b[0] - 9]); vorher = b[1]; });
      var stellen = [];
      luecken.forEach(function (l) { for (var px = l[0]; px <= l[1]; px += 15) stellen.push(px); });
      // gleichmäßig verteilt, höchstens so viele, wie Platz ist
      var n = Math.min(perlen, stellen.length, 24);
      for (var i = 0; i < n; i++) {
        var px = stellen[Math.round((i + 0.5) * stellen.length / n - 0.5)];
        var ci = D.createElementNS(NS, 'circle');
        ci.setAttribute('cx', px.toFixed(1)); ci.setAttribute('cy', (yBei(px) + 0.5).toFixed(1));
        ci.setAttribute('r', c ? 6 : 5);
        ci.setAttribute('class', 'c6z-sp-perle');
        ci.setAttribute('fill', i % 3 === 2 ? mische(K ? K.farbe : '#d62a26', '#ffffff', 0.35) : (K ? K.farbe : '#d62a26'));
        leineSvg.appendChild(ci);
      }
    }

    /* ----- Dinge, die im Place liegen ----- */
    function dingeZeichnen() {
      var x = r(), dl = (x && x.dinge) || [];
      var schl = (sid || '') + '|' + dl.length + '|' + placesJetzt().join(',');
      if (dingSchl === schl) return;
      dingSchl = schl;
      ortNodes.forEach(function (o) {
        var pid = o.getAttribute('data-place');
        var box = o.querySelector('.c6z-sp-dinge');
        if (!box) box = mach('div', 'c6z-sp-dinge', o);
        box.textContent = '';
        dl.filter(function (d) { return d.place === pid; }).slice(-4).forEach(function (d, j) {
          var b = mach('button', 'c6z-sp-ding' + (d.art === 'faden' ? ' c6z-sp-ding-faden' : ''), box); b.type = 'button';
          b.innerHTML = dingBild(d);
          mach('i', 'c6z-sp-kontakt', b);
          b.style.setProperty('--r', ((hash(d.id) % 9) - 4) * 2 + 'deg');
          if (d.art === 'faden' && d.mit && d.mit.farbe) b.style.setProperty('--sp-ding-faden', d.mit.farbe);
          b.setAttribute('aria-label', d.titel + ' · lesen');
          var nm = mach('span', 'c6z-sp-ding-name', b, kurz(d.titel, 16));
          // Namensschilder nebeneinander liegender Dinge versetzen, damit sie sich nicht überlagern
          nm.style.setProperty('--n', String(j % 2));
          b.addEventListener('click', function () { dingZeigen(d, b); });
        });
      });
      spaeter(schattenLegen, 40);
    }
    function dingZeigen(d, el) {
      var ev = { was: 'dingTipp', stringId: sid, id: d.id, ding: d, el: el, genommen: false };
      try { C6.bus.emit('space', ev); } catch (e) {}
      if (ev.genommen) return;
      if (!C6.projektor || !C6.projektor.auf) { if (C6.sag) C6.sag(kurz(d.text, 200), { merken: false }); return; }
      meinProjektor = true;
      C6.projektor.auf({
        titel: d.titel,
        inhalt: function (el) {
          String(d.text || '').split(/\n{1,}/).filter(Boolean).slice(0, 40).forEach(function (abs) { mach('p', null, el, abs); });
          if (!d.text) mach('p', null, el, 'Noch leer.');
          if (d.art === 'ergebnis') mach('p', 'c6z-sp-lw-spaeter', el, 'Später kann hier ein echtes kleines Programm laufen, das ich dir baue. Noch zeige ich dir das Blatt.');
          if (d.art === 'faden' && d.mit) {
            var zp = mach('button', 'c6z-sp-zum-planeten', el, 'Zum Planeten ›'); zp.type = 'button';
            zp.addEventListener('click', function () { try { C6.projektor.zu(); } catch (e) {} try { C6.geh('netz', { faden: d.mit }); } catch (e) {} });
          }
        }
      });
    }
    var meinProjektor = false;
    function projektorZu() { if (meinProjektor) { meinProjektor = false; try { C6.projektor.zu(); } catch (e) {} } }
    C6.bus.on('projektor', function (d) { if (d && d.offen === false) meinProjektor = false; });
    function pflanzeZeichnen() {
      var x = r();
      topf.hidden = !sid;
      if (!sid) return;
      var st = stufeAus(alterTage(sid));
      if (topf._st === st + '|' + (K && K.farbe)) return;
      var war = topf._st;
      topf._st = st + '|' + (K && K.farbe);
      topf.innerHTML = pflanze(st, K ? K.farbe : '#d62a26');
      topf.setAttribute('aria-label', ['Ein Samen', 'Ein Keimling', 'Ein Pflänzchen', 'Eine Knospe', 'Eine Blüte'][st]);
      if (war && war !== topf._st && !C6.ruhig && topf.animate) topf.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.3,.7,.4,1)' });
    }
    topf.addEventListener('click', function () {
      if (!C6.sag || !K) return;
      var st = stufeAus(alterTage(sid));
      var s = ['Ein Samen. Der Ort ist noch ganz neu.', 'Ein Keimling. Zwei Blätter, wie bei mir.', 'Sie wächst, während dein Ort älter wird.', 'Eine Knospe. Bald weißt du, worum es hier geht.', 'Sie blüht. In der Farbe deines Fadens.'][st];
      C6.sag(s, { merken: false });
      if (!C6.ruhig && topf.animate) topf.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(4deg)' }, { transform: 'none' }], { duration: 700, easing: 'ease-in-out' });
    });

    /* ----- Bühne mit Places ----- */
    function orteZeichnen() {
      var ps = placesJetzt();
      var schl = ps.join(',') + '|' + (sid || '');
      if (orte._schl === schl) return;
      orte._schl = schl;
      orte.textContent = '';
      wahlSpur.textContent = '';
      ortNodes = []; wahlNodes = []; dingSchl = '';
      ps.forEach(function (pid) {
        var p = PLACES[pid];
        var o = mach('div', 'c6k-sp-ort' + (p.schnitt ? ' c6z-sp-schnitt' : '') + (p.draussen ? ' c6z-sp-draussen' : ''), orte);
        o.setAttribute('data-place', pid);
        o.style.setProperty('--ort-oben', p.oben || p.grund);
        o.innerHTML = buehnenBild(pid) + (LEBEN[pid] ? '<svg class="c6z-sp-zeichnung c6z-sp-leben" viewBox="0 0 480 300" preserveAspectRatio="' + (p.schnitt ? 'xMidYMax slice' : 'xMidYMax meet') + '" aria-hidden="true" focusable="false">' + LEBEN[pid] + '</svg>' : '');
        Object.keys(LEBEN_MAX).forEach(function (cls) { Array.prototype.slice.call(o.querySelectorAll('.' + cls), 0, LEBEN_MAX[cls]).forEach(function (el) { el.classList.add('c6z-sp-lebt-el'); }); });
        ortNodes.push(o);
        var k = mach('button', 'c6k-sp-wahl-k c6z-sp-schild', wahlSpur); k.type = 'button';
        k.setAttribute('data-place', pid);
        mach('i', 'c6z-sp-schild-nadel', k).innerHTML = PIN;
        var mini = mach('span', 'c6k-sp-mini', k); mini.innerHTML = bild(pid, 'c6k-sp-mini-bild', true);
        mach('span', 'c6k-sp-wahl-name', k, p.name);
        k.addEventListener('click', function () { schildSchwingt(k); geheZu(pid, true); });
        wahlNodes.push(k);
      });
      vor.hidden = nach.hidden = !sid || ps.length < 2;
      wahl.hidden = !sid;
      wahlSpur.appendChild(plusK);
      fuss.hidden = !sid || !comp();
      dingeZeichnen();
      ganzesBild(comp());
      spaeter(schattenLegen, 60);
    }
    // ein Schild, das man antippt, schwingt kurz nach (Gewicht, Federung)
    function schildSchwingt(k) {
      if (C6.ruhig || !k.animate) return;
      var c = comp();
      k.animate(c ? [{ transform: 'rotate(0)' }, { transform: 'rotate(-1.6deg) translateX(2px)' }, { transform: 'rotate(1deg)' }, { transform: 'rotate(0)' }] : [{ transform: 'rotate(0)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(3.5deg)' }, { transform: 'rotate(-1.5deg)' }, { transform: 'rotate(0)' }], { duration: c ? 520 : 760, easing: 'ease-in-out' });
    }
    plusK.addEventListener('click', function () { schildSchwingt(plusK); });
    function markiere() {
      var ps = placesJetzt(), i = ps.indexOf(place);
      ortNodes.forEach(function (o, j) { o.classList.toggle('c6k-sp-ort-jetzt', j === i); });
      wahlNodes.forEach(function (k, j) { if (j === i) k.setAttribute('aria-current', 'true'); else k.removeAttribute('aria-current'); });
      vor.disabled = i <= 0; nach.disabled = i >= ps.length - 1;
      lichtSetzen();
      if (wahlNodes[i] && wahl.scrollWidth > wahl.clientWidth + 2) {
        var b = wahlNodes[i], l = b.offsetLeft - (wahl.clientWidth - b.offsetWidth) / 2;
        try { wahl.scrollTo({ left: Math.max(0, l), behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) { wahl.scrollLeft = l; }
      }
      platzhalter();
    }
    function geheZu(pid, weich) {
      var ps = placesJetzt(), i = ps.indexOf(pid);
      if (i < 0) return;
      var w = orte.clientWidth || 1;
      fuehre = { pid: pid, bis: Date.now() + 900 };
      if (weich && !C6.ruhig) { try { orte.scrollTo({ left: i * w, behavior: 'smooth' }); } catch (e) { orte.scrollLeft = i * w; } }
      else orte.scrollLeft = i * w;
      setzePlace(pid, true);
    }
    function setzePlace(pid, vomMenschen) {
      if (!pid || pid === place) { markiere(); return; }
      var war = place;
      place = pid;
      if (sid) aendern(function (s) { var x = s.spaces[sid]; if (x) { x.jetzt = pid; x.besucht = Date.now(); } });
      markiere();
      sitzSetzen(); aufstehen();
      gewohnheitenSetzen();
      if (letztBildH) weiteMessen(letztBildH);
      fadenZeichnen(true);
      try { C6.bus.emit('space', { stringId: sid, place: pid }); } catch (e) {}
      if (war && war !== pid) projektorZu();
      if (vomMenschen && war && hier) ankommen();
    }
    function ankommen() {
      if (ctl) {
        try { ctl.huepf(14); ctl.stimmung('froh'); } catch (e) {}
        spaeter(function () { try { ctl && ctl.stimmungJetzt === 'froh' && ctl.stimmung('ruhig'); } catch (e) {} }, 1400);
      }
      var key = (sid || '') + ':' + place;
      if (!gesagt[key] && C6.sag) { gesagt[key] = 1; C6.sag(P().satz, { merken: false }); }
      else if (C6.schweig) C6.schweig();
    }
    orte.addEventListener('scroll', function () {
      clearTimeout(scrollUhr);
      scrollUhr = setTimeout(function () {
        var w = orte.clientWidth || 1, i = Math.round(orte.scrollLeft / w), ps = placesJetzt();
        // während einer geführten Fahrt zählt nur das Ziel
        if (fuehre && Date.now() < fuehre.bis) { if (ps[i] === fuehre.pid) fuehre = null; return; }
        fuehre = null;
        if (ps[i] && ps[i] !== place) setzePlace(ps[i], true);
      }, 110);
    }, { passive: true });
    vor.addEventListener('click', function () { var ps = placesJetzt(), i = ps.indexOf(place); if (i > 0) geheZu(ps[i - 1], true); });
    nach.addEventListener('click', function () { var ps = placesJetzt(), i = ps.indexOf(place); if (i < ps.length - 1) geheZu(ps[i + 1], true); });
    // waagerechtes Wischen am Trackpad über der Bühne blättert die Places
    welt.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });

    /* ----- Gespräch ----- */
    function chat() { var x = r(); return (x && x.chats && x.chats[place]) || []; }
    function fadenZeichnen(wechsel) {
      var c = chat();
      var schl = (sid || '') + place + c.length;
      if (faden_._schl === schl && !wechsel) return;
      faden_._schl = schl;
      faden_.textContent = '';
      pult.setAttribute('aria-label', 'Gespräch ' + P().bei);
      if (!sid) return;
      pult.toggleAttribute('data-leer', !c.length);
      if (!c.length) mach('li', 'c6k-sp-still', faden_, 'Noch ist es still ' + P().bei + '.');
      c.slice(-40).forEach(function (z) {
        var li = mach('li', z.von === 'du' ? 'c6k-sp-du' : 'c6k-sp-er', faden_);
        li.textContent = z.t;
      });
      if (wechsel && !C6.ruhig && faden_.animate) faden_.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      spaeter(function () { faden_.scrollTop = faden_.scrollHeight; }, 20);
    }
    function platzhalter() {
      if (!C6.eingabe || !C6.eingabe.platzhalter || !hier) return;
      if (!sid) C6.eingabe.platzhalter('Wie heißt dein Gedanke?');
      else if (modus === 'zettel') C6.eingabe.platzhalter('Ein Zettel für die Leine …');
      else C6.eingabe.platzhalter(P().bei.charAt(0).toUpperCase() + P().bei.slice(1) + ' …');
    }
    function merkeChat(von, t) {
      if (!sid || !t) return;
      var p = place, z = { von: von, t: String(t).slice(0, 2000), ts: Date.now() };
      aendern(function (s) {
        var x = s.spaces[sid]; if (!x) return;
        x.chats = x.chats || {};
        var c = x.chats[p] = x.chats[p] || [];
        c.push(z);
        if (c.length > 120) c.splice(0, c.length - 120);
      });
      fadenZeichnen(false);
    }
    function kontext() {
      var f = faden(sid) || {}, x = r() || {}, p = P(), z = [];
      z.push('Ihr seid im Space „' + f.titel + '“ (' + (ART[f.art] || 'ein Vorhaben') + ' des Menschen), ' + p.bei + (K ? ', ' + K.tageszeit : '') + '. Dort ' + p.tut + ' Carl gern. ' + p.luft);
      if (x.kern) z.push('Der eine Satz dieses Space, vom Menschen selbst: ' + x.kern);
      var nz = (x.notizen || []).slice(-6).map(function (n) { return n.t; });
      if (nz.length) z.push('Seine Zettel hier: ' + nz.join(' · '));
      var dl = (x.dinge || []).slice(-3).map(function (d) { return d.titel + ': ' + kurz(d.text, 160); });
      if (dl.length) z.push('Was hier liegt (Ergebnisse): ' + dl.join(' · '));
      var c = chat().slice(-9, -1);
      if (c.length) z.push('Was ihr ' + p.bei + ' zuletzt gesagt habt:\n' + c.map(function (q) { return (q.von === 'du' ? 'Mensch: ' : 'Carl: ') + String(q.t).slice(0, 300); }).join('\n'));
      return z.join('\n');
    }
    function antworte(t) {
      merkeChat('du', t);
      if (ctl) { try { ctl.stimmung('denkt'); } catch (e) {} }
      var s0 = sid, p0 = place;
      return C6.denk(t, { kontext: kontext() }).then(function (a) {
        if (!a) return;
        try { C6.gespraech && C6.gespraech('carl', a); } catch (e) {}
        if (sid === s0 && place === p0) merkeChat('carl', a);
        else aendern(function (s) { var x = s.spaces[s0]; if (x) { x.chats = x.chats || {}; (x.chats[p0] = x.chats[p0] || []).push({ von: 'carl', t: a, ts: Date.now() }); } });
        auffrischen();
      });
    }
    // nach jedem Wort kann der Ort sich ändern (Pflanze, Licht)
    function auffrischen() { if (!sid) return; lichtSetzen(); leineZeichnen(); pflanzeZeichnen(); dingeZeichnen(); }

    /* ----- Zettel ----- */
    // Das Plus an der Leine: ein Zettel, oder einer der drei Bausteine, die noch fehlen
    function aufhaengen() {
      if (!sid || !C6.frag) { zettelNeu(); return; }
      var frei = [];
      try { frei = C6.bausteine && C6.bausteine.frei ? C6.bausteine.frei(sid) : []; } catch (e) { frei = []; }
      if (!frei.length) { zettelNeu(); return; }
      var NAME = { naechster: 'Nächster Schritt', termin: 'Termin', gewohnheit: 'Gewohnheit' };
      try { C6.eingabe && C6.eingabe.fokus && C6.eingabe.fokus(); } catch (e) {}
      var s0 = sid;
      C6.frag('Was hängen wir auf? Schreib einen Zettel, oder nimm eins davon.', frei.map(function (a) { return { text: NAME[a], wert: '__' + a }; }), { frei: true, id: 'zettel:' + sid, platzhalter: 'Ein Zettel …' }).then(function (a) {
        if (sid !== s0 || a == null) return;
        if (typeof a === 'string' && /^__(naechster|termin|gewohnheit)$/.test(a)) { C6.bausteine.anlegen(sid, a.slice(2)); return; }
        if (typeof a === 'string' && a.trim()) notiere(a);
      });
    }
    function anhKnopf(a, vater) {
      var k = mach('button', 'c6z-sp-anh c6z-sp-anh-' + a.art + (a.getan ? ' c6z-sp-anh-getan' : '') + (a.bald ? ' c6z-sp-anh-bald' : ''), vater); k.type = 'button';
      k.setAttribute('data-art', a.art);
      k.innerHTML = KLAMMER;
      var ob = mach('span', 'c6z-sp-anh-oben', k);
      mach('i', 'c6z-sp-anh-zeichen', ob).innerHTML = a.zeichen;
      mach('span', null, ob, a.oben);
      mach('span', 'c6z-sp-anh-text', k, a.text);
      k.setAttribute('aria-label', a.aria);
      k.addEventListener('click', function () {
        aufstehen();
        if (blattArt === 'zettel') schliesseBlatt();
        if (a.art === 'gewohnheit' && !a.getan) anhPuls(k);
        try { C6.bausteine.tippe(sid, a.art); } catch (e) {}
      });
      return k;
    }
    function anhListe() {
      var anh = [];
      try { anh = (sid && C6.bausteine && C6.bausteine.anhaenger) ? C6.bausteine.anhaenger(sid) : []; } catch (e) { anh = []; }
      var rang = function (a) { return a.art === 'termin' ? (a.bald ? 0 : 3) : a.art === 'naechster' ? 1 : (a.getan ? 4 : 2); };
      return anh.sort(function (a, b) { return rang(a) - rang(b); });
    }
    function anhPuls(el) {
      if (C6.ruhig || !el.animate) return;
      el.animate([{ transform: 'rotate(var(--r))' }, { transform: 'translateY(4px) rotate(calc(var(--r) - 5deg))', offset: 0.35 }, { transform: 'translateY(-1px) rotate(calc(var(--r) + 3deg))', offset: 0.7 }, { transform: 'rotate(var(--r))' }], { duration: 620, easing: 'cubic-bezier(.3,.7,.4,1)' });
    }
    function zettelNeu() {
      modus = 'zettel';
      // im Klick fokussieren, damit iOS die Tastatur zeigt
      try { C6.eingabe && C6.eingabe.fokus && C6.eingabe.fokus(); } catch (e) {}
      platzhalter();
      if (C6.sag) C6.sag('Schreib es drauf, ich häng es an die Leine.', { merken: false });
    }
    function notiere(t) {
      t = kurz(t, 400);
      if (!t || !sid) return;
      aendern(function (s) { var x = s.spaces[sid]; if (x) { x.notizen = x.notizen || []; x.notizen.push({ t: t, ts: Date.now(), place: place }); } });
      try { C6.strings && C6.strings.perle && C6.strings.perle(sid, t); } catch (e) {}
      auffrischen();
      var neu = haken.querySelector('.c6z-sp-zettel:not(.c6z-sp-zettel-neu)');
      if (neu && !C6.ruhig && neu.animate) neu.animate([{ transform: 'translateY(-26px) rotate(-8deg)', opacity: 0 }, { transform: 'translateY(3px) rotate(var(--r))', opacity: 1, offset: 0.7 }, { transform: 'rotate(var(--r))', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.3,.7,.4,1)' });
      if (C6.sag) C6.sag('Hängt. Und eine Perle mehr auf deinem Faden.', { merken: false });
    }
    function zettelFrage(n) {
      if (!C6.frag) return;
      C6.frag('„' + kurz(n.t, 60) + '“. Was machen wir damit?', [{ text: 'Hängen lassen', wert: 'b' }, { text: 'Wird der eine Satz', wert: 'k' }, { text: 'Abnehmen', wert: 'w' }]).then(function (a) {
        if (a === 'w') {
          aendern(function (s) { var x = s.spaces[sid]; if (x) x.notizen = (x.notizen || []).filter(function (m) { return m.ts !== n.ts; }); });
          auffrischen();
          if (blattArt === 'zettel') oeffneBlatt('zettel');
          C6.sag('Abgenommen. Ich hab nicht hingeschaut.', { merken: false });
        } else if (a === 'k') { schliesseBlatt(); setzeKern(n.t); }
      });
    }
    function setzeKern(t) {
      t = kurz(String(t || '').replace(/^[„"»]+|[“"«]+$/g, ''), 200);
      if (!t || !sid) return;
      var alt = (r() || {}).kern;
      aendern(function (s) { var x = s.spaces[sid]; if (x) x.kern = t; });
      // eine Nadel je Space: ein ersetzter Satz steckt nicht doppelt
      if (alt !== t) { try { C6.strings && C6.strings.nadel && C6.strings.nadel(t, sid); } catch (e) {} }
      auffrischen();
      var kk = haken.querySelector('.c6z-sp-kern');
      if (kk) { kk.classList.remove('c6z-sp-steckt'); void kk.offsetWidth; kk.classList.add('c6z-sp-steckt'); }
      var satz = (C6.stimme && C6.stimme.fest && C6.stimme.fest('nadel')) || 'Da steckt die Nadel. Das ist der Satz, der übrig bleibt.';
      C6.sag(satz, { merken: false });
    }
    function kernFrage() {
      if (!sid) { api.frageNeu(); return; }
      var x = r() || {}, gibt = Object.keys(x.chats || {}).some(function (k) { return (x.chats[k] || []).length > 1; }) || (x.notizen || []).length > 0;
      var opt = gibt ? [{ text: 'Schlag mir einen vor', wert: '__vorschlag' }] : [];
      C6.frag(x.kern ? 'Trägt der Satz noch? Schreib ihn neu, wenn nicht.' : 'Welcher eine Satz trägt diesen Space?', opt, { frei: true, id: 'kern:' + sid }).then(function (a) {
        if (a === '__vorschlag') return vorschlag();
        if (typeof a === 'string' && a.trim()) setzeKern(a);
      });
    }
    function vorschlag() {
      var x = r() || {}, zeilen = [];
      Object.keys(x.chats || {}).forEach(function (k) { (x.chats[k] || []).slice(-8).forEach(function (q) { if (q.von === 'du') zeilen.push(q.t); }); });
      (x.notizen || []).slice(-8).forEach(function (n) { zeilen.push(n.t); });
      C6.sag('Ich lese nach, was du hier gesagt hast.', { merken: false });
      C6.denk('Fasse in genau einem kurzen Satz (höchstens 14 Wörter, Du-Form oder Ich-Form des Menschen, ohne Anführungszeichen) zusammen, worum es in diesem Space im Kern geht. Nur der Satz.\n\n' + zeilen.join('\n'), { stumm: true, kontext: kontext() }).then(function (v) {
        v = String(v || '').split('\n')[0].replace(/^[-–•\s]+/, '').trim();
        if (!v) {
          var du = zeilen.filter(function (z) { return z.split(/\s+/).length >= 4; });
          v = du.length ? du[du.length - 1] : '';
        }
        if (!v) { C6.sag('Ich finde ihn noch nicht. Erzähl mir noch ein bisschen.', { merken: false }); return; }
        C6.frag('„' + kurz(v, 120) + '“', [{ text: 'Nimm ihn', wert: 'ja' }, { text: 'Ich schreib selbst', wert: 'selbst' }]).then(function (a) {
          if (a === 'ja') setzeKern(v);
          else if (a === 'selbst') C6.frag('Dann in deinen Worten.', [], { frei: true, id: 'kern:' + sid }).then(function (b) { if (typeof b === 'string' && b.trim()) setzeKern(b); });
        });
      });
    }

    /* ----- Blatt: Place hinzufügen · Deine Spaces · Alle Zettel ----- */
    function oeffneBlatt(art) {
      projektorZu();
      blattArt = art;
      blattInhalt.textContent = '';
      blatt.setAttribute('data-art', art);
      if (art === 'places') {
        blattT.textContent = 'Wohin noch?';
        blatt.setAttribute('aria-label', 'Place hinzufügen');
        var da = placesJetzt();
        var g = mach('div', 'c6k-sp-raster', blattInhalt);
        Object.keys(PLACES).forEach(function (pid) {
          if (da.indexOf(pid) >= 0) return;
          var p = PLACES[pid];
          var k = mach('button', 'c6k-sp-karte', g); k.type = 'button';
          k.innerHTML = bild(pid, 'c6k-sp-karte-bild');
          var unter = mach('span', 'c6k-sp-karte-unter', k);
          mach('b', null, unter, p.name);
          mach('small', null, unter, 'Carl ' + p.tut);
          k.addEventListener('click', function () { fuegeHinzu(pid); });
        });
        if (!g.childNodes.length) mach('p', 'c6k-sp-still', blattInhalt, 'Alle Places stehen schon hier.');
      } else if (art === 'zettel') {
        blattT.textContent = 'An der Leine';
        blatt.setAttribute('aria-label', 'Alle Zettel');
        var nk = mach('button', 'c6k-sp-neu', blattInhalt); nk.type = 'button';
        nk.innerHTML = PLUS + '<span>Aufhängen</span>';
        nk.addEventListener('click', function () { schliesseBlatt(); aufhaengen(); });
        var w = mach('div', 'c6z-sp-zettelwand', blattInhalt);
        anhListe().forEach(function (a) { var k = anhKnopf(a, w); k.classList.add('c6z-sp-anh-gross'); k.style.setProperty('--r', ((hash(a.art) % 5) - 2) * 0.8 + 'deg'); });
        ((r() || {}).notizen || []).slice().reverse().forEach(function (n) {
          var z = mach('button', 'c6z-sp-zettel c6z-sp-zettel-gross', w); z.type = 'button';
          z.innerHTML = KLAMMER;
          mach('span', 'c6z-sp-zettel-text', z, n.t);
          z.style.setProperty('--r', ((hash(n.ts + '') % 7) - 3) * 0.9 + 'deg');
          z.addEventListener('click', function () { zettelFrage(n); });
        });
      } else {
        blattT.textContent = 'Deine Spaces';
        blatt.setAttribute('aria-label', 'Deine Spaces');
        var liste = mach('div', 'c6k-sp-liste', blattInhalt);
        var neuK = mach('button', 'c6k-sp-neu', liste); neuK.type = 'button';
        neuK.innerHTML = PLUS + '<span>Neuer Space</span>';
        neuK.addEventListener('click', function () { schliesseBlatt(); spaeter(function () { api.frageNeu(); }, 180); });
        api.alle().forEach(function (s) {
          var k = mach('button', 'c6k-sp-zeile', liste); k.type = 'button';
          if (s.stringId === sid) k.setAttribute('aria-current', 'true');
          var kl = klima(s.stringId);
          var bi = mach('span', 'c6k-sp-zeile-bild c6z-sp-zeile-licht', k); bi.innerHTML = bild(s.places[0], 'c6k-sp-mini-bild', true);
          if (kl) { bi.style.setProperty('--sp-o', kl.himmel[0]); bi.style.setProperty('--sp-u', kl.himmel[1]); bi.style.setProperty('--sp-a', String(Math.min(kl.staerke, 0.6))); }
          var tx = mach('span', 'c6k-sp-zeile-text', k);
          var b = mach('b', null, tx); var pk = mach('i', 'c6k-sp-punkt', b); pk.style.background = s.farbe || 'var(--faden)'; b.appendChild(D.createTextNode(s.titel));
          mach('small', null, tx, s.kern ? '„' + kurz(s.kern, 60) + '“' : (kl ? ART_KURZ[kl.art] + ' · ' + kl.tageszeit + ' · ' : '') + s.places.map(function (p) { return (PLACES[p] || {}).name; }).filter(Boolean).join(', '));
          k.addEventListener('click', function () { schliesseBlatt(); if (s.stringId !== sid) api.oeffne(s.stringId); });
        });
        if (sid) {
          var um = mach('button', 'c6k-sp-leise', blattInhalt, 'Diesen Space umbenennen'); um.type = 'button';
          um.addEventListener('click', function () {
            schliesseBlatt();
            C6.frag('Wie soll er heißen?', [], { frei: true, id: 'name:' + sid }).then(function (a) {
              if (typeof a === 'string' && a.trim() && C6.strings && C6.strings.umbenennen) { C6.strings.umbenennen(sid, a); kopfZeichnen(); C6.sag('Neuer Name, gleicher Ort.', { merken: false }); }
            });
          });
        }
      }
      blatt.hidden = false;
      void blatt.offsetWidth;
      blatt.setAttribute('data-an', '');
      wurzel.classList.add('c6k-sp-blatt-auf');
      if (C6.schweig) C6.schweig();
    }
    function schliesseBlatt() {
      if (blatt.hidden) return;
      blatt.removeAttribute('data-an');
      wurzel.classList.remove('c6k-sp-blatt-auf');
      blattArt = null;
      spaeter(function () { if (!blatt.hasAttribute('data-an')) blatt.hidden = true; }, C6.ruhig ? 0 : 280);
    }
    function fuegeHinzu(pid) {
      if (!sid || !PLACES[pid]) return;
      aendern(function (s) { var x = s.spaces[sid]; if (x && x.places.indexOf(pid) < 0) x.places.push(pid); });
      schliesseBlatt();
      orteZeichnen();
      spaeter(function () { geheZu(pid, true); }, C6.ruhig ? 0 : 200);
    }
    plusK.addEventListener('click', function () { oeffneBlatt('places'); });
    titelK.addEventListener('click', function () { oeffneBlatt('spaces'); });
    blattZu.addEventListener('click', schliesseBlatt);
    C6.bus.on('esc', function (ev) { if (hier && !blatt.hidden) { schliesseBlatt(); ev.erledigt = true; } });

    /* ----- Ankommen: aus dem Himmel in der Farbe des Planeten, mit einem Gerüst unter dem Arm ----- */
    function anfliegen() {
      var f = faden(sid);
      if (!f || C6.ruhig) return;
      anflugEl.style.setProperty('--sp-planet', f.farbe || '#2f5f8a');
      anflugEl.classList.remove('c6z-an', 'c6z-weg');
      void anflugEl.offsetWidth;
      anflugEl.classList.add('c6z-an');
      // erst wenn die Kamera unten ist, öffnet sich die Farbe zum Ort
      spaeter(function () { anflugEl.classList.add('c6z-weg'); }, 480);
      spaeter(function () { anflugEl.classList.remove('c6z-an', 'c6z-weg'); }, 2000);
    }
    function mitbringen(mit) {
      mitEl.hidden = !mit;
      mitEl.textContent = '';
      if (!mit) return;
      var d = { geruest: mit.geruest, farbe: mit.farbe };
      mitEl.innerHTML = dingBild(d);
      mitEl.setAttribute('aria-hidden', 'true');
      if (!C6.ruhig && mitEl.animate) mitEl.animate([{ transform: 'translate(-40px,-30px) rotate(-20deg)', opacity: 0 }, { transform: 'translate(0,4px) rotate(-6deg)', opacity: 1, offset: 0.7 }, { transform: 'rotate(-6deg)', opacity: 1 }], { duration: 640, easing: 'cubic-bezier(.3,.7,.4,1)', delay: 260, fill: 'backwards' });
      if (ctl) { try { ctl.stimmung('arbeitet'); } catch (e) {} }
      var s0 = sid, p0 = place;
      spaeter(function () {
        if (!hier || sid !== s0) return;
        try { C6.bus.emit('space', { was: 'angekommen', stringId: s0, place: p0, mit: mit }); } catch (e) {}
      }, C6.ruhig ? 60 : 900);
    }
    C6.bus.on('space', function (d) {
      if (!d || !hier || d.stringId !== sid) return;
      if (d.was === 'ding') {
        auffrischen();
        mitEl.hidden = true;
        var x = r(), dd = ((x && x.dinge) || []).filter(function (q) { return q.id === d.id; })[0];
        if (dd && dd.place !== place) geheZu(dd.place, true);
        spaeter(function () {
          var o = ortNodes[placesJetzt().indexOf(dd ? dd.place : place)], b = o && o.querySelector('.c6z-sp-ding:last-child');
          if (b && !C6.ruhig && b.animate) b.animate([{ transform: 'translateY(-40px) rotate(-14deg)', opacity: 0 }, { transform: 'translateY(2px) rotate(var(--r))', opacity: 1, offset: 0.75 }, { transform: 'rotate(var(--r))', opacity: 1 }], { duration: 560, easing: 'cubic-bezier(.3,.7,.4,1)' });
        }, 80);
      }
    });

    /* ----- Anzeigen ----- */
    function zeige(neuSid, o) {
      o = o || {};
      if (neuSid && !faden(neuSid)) neuSid = null;
      if (!neuSid && !o.leer) {
        var a = api.alle();
        neuSid = (sid && faden(sid)) ? sid : (a[0] && a[0].stringId) || null;
      }
      var anderer = neuSid !== sid;
      sid = neuSid;
      var x = r();
      var ps = placesJetzt();
      var ziel = o.place && ps.indexOf(o.place) >= 0 ? o.place : (anderer || !place || ps.indexOf(place) < 0 ? ((x && x.jetzt && ps.indexOf(x.jetzt) >= 0) ? x.jetzt : ps[0]) : place);
      if (anderer) { place = null; modus = null; schliesseBlatt(); leineSchl = ''; dingSchl = ''; }
      kopfZeichnen();
      orteZeichnen();
      setzePlace(ziel, false);
      fadenZeichnen(true);
      groesse();
      auffrischen();
      spaeter(function () { geheZu(ziel, false); }, 0);
      if (sid && (anderer || frisch)) wetterBeimBetreten(x && x.besucht);
      if (sid) aendern(function (s) { var y = s.spaces[sid]; if (y) y.besucht = Date.now(); });
      if (sid && (anderer || frisch)) lichtSetzen();
      frisch = false;
    }

    var frisch = false, uhrZeit = 0;
    function kleid() { try { if (ctl && C6.laden && C6.laden.an) ctl.kleid(C6.laden.an() || {}); } catch (e) {} }
    C6.bus.on('kleid', kleid);
    C6.bus.on('strings', function (d) {
      if (!hier || !d || d.id !== sid) return;
      if (d.was === 'titel') kopfZeichnen();
      auffrischen();
    });
    C6.bus.on('geraet', function () { if (hier) spaeter(groesse, 40); });

    // Beim Betreten: ein Satz, wo du stehst, und genau ein Angebot
    var letzteLage = {};
    function lage() {
      var x = r() || {}, f = faden(sid) || {}, st = {};
      try { st = C6.bausteine && C6.bausteine.stand ? C6.bausteine.stand(sid) : {}; } catch (e) { st = {}; }
      var nz = (x.notizen || []).length, gespr = Object.keys(x.chats || {}).some(function (k) { return (x.chats[k] || []).some(function (q) { return q.von === 'du'; }); });
      var B = C6.bausteine;
      if (st.termin && st.termin.tage <= 1) return { satz: '„' + kurz(st.termin.t, 60) + '“ ' + (st.termin.tage < 0 ? 'war ' + st.termin.wann + ' dran.' : 'ist bis ' + st.termin.wann + ' dran.'), chip: 'Geschafft', tun: function () { B.erledige(sid, 'termin'); } };
      if (st.naechster) return { satz: 'Nächster Schritt: „' + kurz(st.naechster, 70) + '“.', chip: 'Erledigt', tun: function () { B.erledige(sid, 'naechster'); } };
      if (st.gewohnheit && !st.gewohnheit.heute) return { satz: 'Heute schon „' + kurz(st.gewohnheit.was, 50) + '“?', chip: 'Ja, heute', tun: function () { B.tippe(sid, 'gewohnheit'); } };
      if (!x.kern && (nz >= 2 || gespr)) return { satz: (nz ? (nz === 1 ? 'Ein Zettel hängt' : nz + ' Zettel hängen') + ', der eine Satz fehlt noch.' : 'Wir haben hier geredet, der eine Satz fehlt noch.'), chip: 'Den Satz finden', tun: kernFrage };
      if (x.kern) return { satz: 'Der Satz steht: „' + kurz(x.kern, 70) + '“. Was ist der nächste Schritt?', chip: 'Nächsten Schritt aufhängen', tun: function () { B.anlegen(sid, 'naechster'); } };
      return { satz: nz ? 'Ein Zettel hängt schon. Was fällt dir noch zu „' + kurz(f.titel, 30) + '“ ein?' : 'Was fällt dir zu „' + kurz(f.titel, 30) + '“ ein? Ich häng es an die Leine.', zettel: true };
    }
    function sagLage() {
      var s0 = sid, l = lage();
      letzteLage[s0] = { ts: Date.now(), satz: l.satz };
      if (l.zettel || !C6.frag) { modus = 'zettel'; platzhalter(); C6.sag(l.satz, { merken: false }); return; }
      C6.frag(l.satz, [{ text: l.chip, wert: 'ja' }], { leise: true }).then(function (a) { if (a === 'ja' && sid === s0 && hier) l.tun(); });
    }
    function begruessen(o) {
      var neu = o.neu;
      if (ctl) { try { ctl.stimmung('ruhig'); if (!C6.ruhig) spaeter(function () { ctl && ctl.huepf(10); }, 300); } catch (e) {} }
      if (!sid) { spaeter(function () { api.frageNeu(); }, 520); platzhalter(); return; }
      if (o.mit) { mitbringen(o.mit); return; }
      mitbringen(null);
      gesagt[sid + ':' + place] = 1;
      if (!neu && letzteLage[sid] && Date.now() - letzteLage[sid].ts < 90000 && letzteLage[sid].satz === lage().satz) return;
      var s0 = sid;
      spaeter(function () { if (hier && sid === s0) sagLage(); }, 520);
    }

    raumApi = {
      _sid: function () { return sid; },
      _wechsel: function (o) {
        var andere = o.string && o.string !== sid;
        zeige(o.string || sid, { place: o.place });
        if (andere) anfliegen();
        if (o.liste) { oeffneBlatt('spaces'); return; }
        begruessen(o);
      },
      betreten: function (o) {
        o = o || {};
        if (wartend) { o = { string: o.string || wartend.string, place: o.place || wartend.place, neu: o.neu || wartend.neu, liste: o.liste || wartend.liste, mit: o.mit || wartend.mit }; wartend = null; }
        hier = true;
        buehne.classList.add('c6z-sp-lebt');
        ruheSeit = Date.now(); clearInterval(sitzUhr); sitzUhr = setInterval(sitzPruefen, 1000);
        kleid();
        gewohnheitenSetzen();
        frisch = true;
        clearInterval(uhrZeit); uhrZeit = setInterval(function () { if (hier && sid && K && K.zeit !== zeitJetzt()) lichtSetzen(); }, 60000);
        zeige(o.string || null, { place: o.place });
        if (sid && anflug && anflug.id === sid && Date.now() - anflug.t < 3000) anfliegen();
        anflug = null;
        nachtKopf(!!(K && K.nacht) || !!P().nacht);
        if (o.liste) { spaeter(function () { if (hier) oeffneBlatt('spaces'); }, C6.ruhig ? 0 : 200); platzhalter(); return; }
        spaeter(groesse, 360);
        begruessen(o);
        platzhalter();
      },
      verlassen: function () {
        hier = false;
        buehne.classList.remove('c6z-sp-lebt');
        ereignisEl.textContent = ''; ereignisLaeuft = false;
        clearInterval(sitzUhr); sitzUhr = 0; aufstehen();
        clearInterval(uhrZeit); uhrZeit = 0; clearTimeout(wetterUhr);
        modus = null;
        projektorZu();
        schliesseBlatt();
        if (C6.eingabe && C6.eingabe.platzhalter) C6.eingabe.platzhalter(null);
      },
      groesse: groesse,
      hoert: function (t) {
        spaeter(platzhalter, 30);
        if (!sid) { api.neu(t); return true; }
        if (modus === 'zettel') { modus = null; notiere(t); return true; }
        antworte(t);
        return true;
      }
    };
    return raumApi;
  }
};
C6.raum(DEF);
if (wartend) spaeter(function () { if (wartend) api.oeffne(wartend.string, wartend); }, 0);
