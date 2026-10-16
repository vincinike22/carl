# Zweites Album · s13

| Gestrichen | Wo es lebt | Wie man es zurückholt |
|---|---|---|
| Sechs Zähler-Beispiele an der Rezeption („Ein Beispiel / So eins für mich“, nico: „zu sehr Productivity Map“) – ersetzt durch die sieben Fächer der Tage | `src/module/beispiele.js` + `beispiele.css` bleiben im Code; `C6.beispiele.male()` ruft niemand mehr. Weiter in Gebrauch: `C6.beispiele.uhr()` (Sekunden-Uhr beim Bauen, `werkzeug.js`). Die Prüfung vor dem Bau (`pruefe`) steht jetzt direkt in `rezeption.js` (gleiche Sätze `rezeption.leer`/`rezeption.unsinn`). | In `rezeption.js` einen Platz `<div id="c6rz-beispiele">` im Boden anlegen und `C6.beispiele.male(el, {bauen})` beim Betreten rufen (Stand v31, `beispieleMalen`). |
| Brief-Ablage im Zuhause (Boden rechts vom Teppich, `C6.zuhause.ablage`) – der Brief liegt jetzt im Postfach der Rezeption | nichts mehr im Zuhause; der Brief (`auftrag.js`) sucht `C6.rezeption.postfach()` | Nicht zurückholen: ein Brief, ein Ort (Entscheidung 1). |
