# s14 · Veto-Runde „Die reine Form“ (16.10.2026, spät)

Prüfer: Rune (Wahrheit) · Rams (Reinheit) · Papert (Funke). Am heutigen Zusammenbau (`python3 tools/bau.py`, `carl6-test.html`), Playwright-Chromium, iPhone 390×844 (dpr 2, touch) und Computer 1440×900, leer und mit Leben (`inventar/leben.json`), Abend und Nacht, mit echten Tipps in allen Räumen (Rezeption, Zuhause, Werkstatt, Space, Bibliothek + Buch alle zehn Seiten, Garage + Katalog mit Holen und zu wenig Münzen, Himmel mit Antippen/Verbinden/Ziehen, Teleskop). 0 Konsolenfehler. Kein Code geändert. Einzelberichte: `veto/RUNE.md`, `veto/RAMS.md`, `veto/PAPERT.md`; alle Bilder in `veto/`.

## Vetos nach Schwere

### Bricht Vertrauen
1. **Rune 1 · Dieselben Zettel, zwei Zahlen.** Buch „Gitarre lernen · 4 Zettel“, Himmel und Space 3 – das Buch zählt das Sternbild-Ding als Zettel. → `atlas.js:378` `+ (x.dinge||[]).length` weg; eine Zählung für Buch, Planet, Planetenblatt. Bilder `b-iphone-leben-07.png`, `z-iphone-leben-netz.png`.
2. **Rune 2 · Fremde Marken und Versprechen im Buch.** „Claude · ChatGPT · Gemini“ als Wahl (ChatGPT/Gemini gehen nicht), „kommt · WhatsApp“, „Carl als App auf deinem Mac · kommt“, WhatsApp unter „Kommt mit Carl auf deinem Mac“. → `atlas.js:141–144, 678, 927, 978`, `stimme.js:640`: raus; das Buch sagt, was ist. Entscheidung nico, falls „kommt“ im Grundkonstrukt ausdrücklich als Buchzeile gewollt ist. Bilder `b-iphone-leben-06/08/09.png`.

### Stört
3. **Rams 1 · Angeflogene Planeten abgeschnitten** (Kugel mit senkrechten Kanten). → `netz.js` › `kugel()`: Zeichenquadrat abseits der Bildmitte um den Ellipsen-Faktor vergrößern. Bild `h-computer-01-ausschnitt-planet.png`.
4. **Rams 2 · Karten decken das Werkzeug (iPhone).** → `space.css:227`: solange `.c6z-sp-vs-auf`, Schild zurück, Kartenblatt an seinen Platz unter das Werkzeug. Bild `s-iphone-02-carl-tipp.png`.
5. **Rams 3 · Zwei Knöpfe, ein Ziel:** im Space aus dem Himmel „‹ Himmel“ und „Himmel ↑“. → `kern.js` (Faden `.c6k-fd-hoch` / Höhenknopf `hkWort` Z. 691): gleiches Ziel → ein Knopf. Bild `h-computer-08-hineingehen.png`.
6. **Rune 3 · Das Feld spricht Bastler, das Wort wandert:** Werkstatt „Oder / für ein Werkzeug“, Rezeption „Was soll ich dir bauen?“. → `kern.js:1668` Werkstatt-Feld „Was soll ich dir bauen?“ ohne „/“; `stimme.js:100` Rezeption „Was steht an?“. Bilder `z-computer-leben-werkstatt.png`, `z-iphone-leben-rezeption.png`.
7. **Papert 1 · Der Himmel erklärt für immer.** Der lange Satz bleibt, auch wenn schon ein Sternbild steht. → `netz.js` › `grundSatz()`: nur bis zum ersten Sternbild; einmal tastet ein goldener Faden vor (nie bei `C6.ruhig`). Bild `z-iphone-leben-netz.png`.
8. **Papert 2 · Erster Fehler beim Sternbild halb unsichtbar:** leer abgeschickt → nur der Platzhalter ändert sich, am iPhone abgeschnitten („… gemeinsam? Ei…“). → `netz.js` › `frageKnoten()` › `onsubmit`: eigene Statuszeile unter dem Feld. Bild `h-iphone-03-04-feld-vorher-nachher.png`.
9. **Papert 3 · Carl fragt bei jedem Betreten** (Portugal: dreimal, drei neue Fragen). → `space.js` › `lage()` (`naehren.frage`): höchstens einmal je Space und Tag; sonst wartet die Frage hinter „Carl antippen“. Bild `s-iphone-w1-Portugal.png`.

### Feinschliff (gesehen, ohne Veto)
- Leerer Space: Schild „Dein erster Space“ ↔ Carl „Noch hängt kein Space am Brett.“ (`space.js:1115`, `veto/z-iphone-leer-space.png`).
- Katalog: Fußsatz „Tipp eine an.“ bleibt neben leuchtender Probe; „Neues Licht in der Stube.“ – zweites Wort für Zuhause (`einrichten.js:352`).
- Buch Inhalt „Was ich kann · 8 an“ ohne Bezugswort.
- Himmel herausgezoomt (iPhone): Sternbild-Knoten liegt auf „Gitarre lernen“, der Tipp öffnet das Sternbild statt den Planeten (`veto/h-iphone-07-gitarre-tipp.png`).
- Werkstatt-Schild „für „Bachelorarbeit schrei…““ abgeschnitten, Nagel auf dem „r“.
- Nadel-Knopf in jedem Raum (offen bei nico).

## Was trägt (je drei Zeilen)
**Rune:** Katalog sagt die Wahrheit über Geld ohne Rot und mit Weg · Himmel zählt echt, Planet und Blatt sagen dasselbe · Buch nennt jeden Schalter einmal und zeigt sonst nur hin („Schalter auf Seite 5 ›“).
**Rams:** Ein Katalog, ein Ort (Garage), eine Tat in Orange, Probe = Geste · Farbe als Funktion hält (Faden Tusche/Space-Farbe, Sternbild Gold, Rot nur Nadel), Papier bleibt nachts Papier · Zuhause ruhig: Kulisse ohne Schild, Brett mit ganzen Namen, ein Weg „+ Neuer Space“.
**Papert:** Ziehen im Himmel ist ein echtes Ding zum Denken (goldener Faden, schnurrt ohne Urteil zurück) · Ottos Werkzeug steht groß in der Mitte des Space · Erstkontakt „Ein Satz, und es wird ein Space“ → „Ich nenn ihn …?“ lässt Otto entscheiden.

## Staunt ein Fremder – und versteht er, was Carl für ihn tut?
Er staunt – an drei Stellen sicher: wenn im Himmel aus seinen Spaces Planeten werden und ein goldener Faden zwischen ihnen hält, wenn im Katalog die Lampe beim Antippen angeht, und wenn aus einem Satz im Zuhause ein Space mit eigenem Zimmer wird. Ob er versteht, was Carl für ihn tut, entscheidet sich an zwei Orten: an der Rezeption (der Brief, die Fächer) versteht er es in zehn Sekunden; im Buch steht es jetzt geordnet – aber genau dort, wo er Carl am meisten glauben soll, sagt eine Zahl etwas anderes als der Himmel und verspricht eine Seite Dinge, die es nicht gibt (WhatsApp, Mac-App, fremde Modelle). Das kostet mehr Vertrauen, als jede schöne Form zurückgibt. Und an mehreren Stellen erklärt Carl noch, statt das Ding sprechen zu lassen (Himmel-Satz, Frage beim Betreten, „/ Werkzeug“). Urteil der drei: Staunen ja; Verstehen fast – nach Vetos 1 und 2 und den drei Papert-Vetos wäre es ein Ja, das der Otto-Test mit einem echten Menschen noch bestätigen muss.

## Ungeprüft (alle drei)
- Nur Playwright-Chromium; kein echtes iPhone/Safari, kein echter Finger, kein echtes Mitdenken, kein echter Kalender.
- 820–1199 px, 375×667, Querformat, große Schrift, Bildschirmleser, Tastatur, reduzierte Bewegung: nicht geprüft. Morgen/Mittag nicht angesehen.
- Ob ein Fremder das Ziehen ohne den Himmel-Satz findet: Hypothese (Otto-Test mit einem Menschen).
- „kommt“-Zeilen: Beschluss im Grundkonstrukt nicht selbst nachgelesen.
