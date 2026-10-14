# Zweites Album · raffael (s5)
- `post.js` + `post.css` · der Post-Raum (Briefe an die Werkstatt als Zettel an einer Leine, Briefkasten, Satzanfänge). Ersetzt durch „Nachricht an die Werkstatt“ im Nadel-Knopf. Zurück: Datei nach `src/raeume/post.js`, CSS ans Ende von `src/kern.css`, in nadel.js `postAuf` wieder `cfg.post()` rufen lassen.
- `keimflug.js` + `keimflug.css` · das Keimflug-Spiel hinter dem Fenster im Zuhause (zweites Spiel neben dem Kieselpark). Zurück: Block ans Ende von `src/module/muenzen.js`, CSS ans Ende von `kern.css`.
- Drei Höhenpunkte (Boden · Himmel · Teleskop) mit Ziehen und Wink „Himmel“ · ersetzt durch einen Knopf „Himmel ↑ / Boden ↓“. Code-Stand vorher: `werkstatt/s5/raffael/vorher_src/kern.js` (Abschnitte „Höhenregler: auch senkrecht ziehen“, `winkVogel`).
- Münzen aus Geheimnissen, Funden, Aufgaben · `C6.muenzen.plus` zählt nur noch Gründe, die mit `kieselpark` beginnen. Zurück: die eine Zeile in `plus` streichen.
- Gerüst „Festhalten“ in der „/“-Liste · jeder Satz ans Feld bietet jetzt selbst „In ‚X‘ hängen / Neuer Space“.
