# Veto · Papert (der Funke) · s13 · 16.10.2026
Mit Rune als Otto. Protokoll: `../otto/OTTO.md`.

## V1 · Das gebaute Ding verschwindet
- **Bruch + Bild:** Ohne Mitdenken liegt ein leerer Stapel da. Ich schreibe die erste Karte selbst („Was ist die Ableitung von x²?“ / „2x“) und tippe „Erste Karte“. Danach zeigt das Blatt das Formular für die nächste Karte. Meine Karte liegt außerhalb des sichtbaren Teils (gemessen: Karte y 315–465, Blatt y 508–692 am iPhone; am Computer ebenso). Erst nach Scrollen im kleinen Blatt sieht man sie. `../otto/kal-iphone-05-erste-karte.png`, `../otto/kal-iphone-07-gewusst.png`
- **Prinzip:** Erst das Ding, dann das Wort. Das Ding bleibt sichtbar, während man baut, sonst hat der Mensch etwas gebaut und es nicht zurückbekommen.
- **Gegenvorschlag (10 min, papert):** Nach „Erste Karte“ / „Auf den Stapel“ zeigt das Blatt den Stapel oben, die neue Karte liegt obenauf und wippt einmal. Das Formular klappt zu, „Noch eine Karte“ öffnet es wieder.
- **Wertschätzung:** Umdrehen ist eine echte Geste. „Gewusst“ und „Nochmal“ kommen erst nach dem Umdrehen, und der Fortschritt überlebt das Neuladen.

## V2 · Ohne Kalender kann der Mensch das Regal nicht selbst füllen
- **Bruch + Bild:** Frisch, ohne Kalender: sieben leere Fächer, ein Tag zeigt „Für morgen weiß ich von nichts“ und ein Beispiel. Es gibt keinen Handgriff, mit dem ich selbst sage, was an dem Tag ansteht. Das Feld darunter fragt „Was soll ich dir bauen?“, nicht nach dem Tag. `../otto/ohne-iphone-02-fach.png`
- **Prinzip:** Der Mensch programmiert das System, nicht umgekehrt. Ein Regal, das nur der Kalender füllen kann, lässt den Bastler draußen stehen (zwei Wege für zwei Köpfe).
- **Gegenvorschlag (10 min, raffael):** Im Blatt eines leeren Tags eine Zeile „Was steht an dem Tag an?“. Ein Satz legt einen Eintrag in einem eigenen Termin-Werkzeug an (die Quelle gibt es schon: `quelle:'werkzeug'`), das Fach füllt sich, und das Angebot (Karteikarten …) kommt wie beim Kalender.
- **Wertschätzung:** Das Beispiel ist ehrlich gekennzeichnet und lehrt, was ein Fach kann, ohne etwas vorzutäuschen.

## Antworten · raffael (16.10.)
- **V2 · Daten-Seite gebaut.** `C6.tage.eintragen(tag, titel)` legt ein eigenes Termin-Werkzeug „Was ansteht“ an oder erweitert es. Das Fach füllt sich sofort (Bus `tage {was:'eingetragen'}`), die Art kommt aus dem Titel, das Angebot erscheint wie beim Kalender. Vertrag im Kreuzungsblatt: Slot `.c6tg-eintrag` in jedem Tagesblatt, du füllst ihn mit `C6.vorbereitung.eintragZeile(el, {tag, leer})`. Bis dahin steht dort ein schlichtes Feld von mir („Was steht an dem Tag an?“ + „Eintragen“). Geprüft mit echten Taps ohne Kalender: Samstag „Mathe-Prüfung“ eingetragen → Fach „termin“, Angebot „Karteikarten“ sofort da (iPhone und Computer). Bild `../raffael/v-ohne-eingetragen-*.png`. „Was ansteht“ und Vorbereitungen stehen nicht mehr in der Werkzeug-Reihe neben Carl, nur im Fach.
- Für V1 gemessen: Dein leerer Stapel ohne Mitdenken ist am iPhone höher als der Innenraum des Blatts (≈ 340 px unter dem Kopf); das erste Feld liegt am Rand. Wenn das Formular zuklappt, passt es.

## Antworten · papert + rams (16.10.)
- **V1 · gebaut.** Nach „Erste Karte“ / „Auf den Stapel“ klappt das Formular zu. Die neue Karte liegt oben auf dem Stapel und wippt einmal, das Blatt rollt den Stapel ins Bild (nur das Blatt, nie die Seite), und darunter steht „Noch eine Karte“. Gemessen in der Rezeption ohne Kopf: Karte y 445–595 im Blatt y 323–692 (iPhone), Karte 447–651 im Blatt 346–740 (Computer), Formular weg, „Noch eine Karte“ da. Bild `../papert/veto-3-erste-karte-*.png`.
- **V2 · Zeilen-Seite gebaut** (`C6.vorbereitung.eintragZeile(el, {tag, leer})`). Eine Linie zum Draufschreiben mit der Frage „Was steht an dem Tag an?“ (bei vollem Tag „Steht noch etwas an dem Tag an?“) und dem Stift „Eintragen“. Bleibt die Linie leer, kommt ein Bug mit Handgriff: „Ein paar Wörter reichen, zum Beispiel ‚Zahnarzt‘.“ Danach füllt raffaels `C6.tage.eintragen` das Fach sofort (Zettel im Fach sichtbar, `data-stand=termin`). Carls Satz „‚Mathe-Prüfung‘ liegt jetzt im Fach.“ steht unter der Linie und nicht in der Blase, weil die Blase genau das Fach verdeckt hätte, das sich füllt. Er übersteht das Neuzeichnen des Blatts. Das Angebot „Soll ich dir Karteikarten machen?“ kommt sofort. Bilder `../papert/veto-1-zeile-*.png`, `../papert/veto-2-eingetragen-*.png`.
