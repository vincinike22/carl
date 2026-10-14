# Zweites Album · hokusai (s5)

Zurückholen mit einem Satz an Vitruvian, z. B. „Die Art beim neuen Planeten soll wieder da sein.“

1. **Art beim neuen Planeten (Projekt / Idee / Gewohnheit)**, im Blatt „Neuer Planet“ (`src/raeume/netz.js`, `neuerPlanet`). Ging, weil es für den Menschen nur noch Space/Planet gibt. Intern wird weiter `art: 'projekt'` gespeichert. Code:
```js
'<div class="c6w-arten" role="radiogroup" aria-label="Was ist es">' +
'<button type="button" role="radio" aria-checked="true" data-art="projekt">Projekt</button>' +
'<button type="button" role="radio" aria-checked="false" data-art="idee">Idee</button>' +
'<button type="button" role="radio" aria-checked="false" data-art="gewohnheit">Gewohnheit</button></div>' +
// …
[].forEach.call(blatt.querySelectorAll('[data-art]'), function (b) {
  b.onclick = function () { art = b.dataset.art; [].forEach.call(blatt.querySelectorAll('[data-art]'), function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); }); };
});
```
2. **Unterzeile mit der Art am Planeten** („Projekt · 3 Orte“). Ging aus demselben Grund. Code: `var zw = [ARTEN[p.d.art] || 'Projekt'];` mit `var ARTEN = { projekt: 'Projekt', idee: 'Idee', gewohnheit: 'Gewohnheit' };`
3. **Carls Satz nach dem Verbinden** („Ein Sternbild. Jetzt sieht man, dass die beiden zusammengehören.“). Im Sternbild-Moment schweigt Carl jetzt; das Bild sagt es.
