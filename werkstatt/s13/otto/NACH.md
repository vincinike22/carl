# s13 · Nachprüfung der sechs Vetos (Rams, 16.10.)

Geprüft mit echten Taps (iPhone 390×844, Touch) und Klicks (Computer 1440×900), frischer Speicher, ohne Kalender und ohne Mitdenken (`carl6-test.html`, nach `tools/bau.py`, nach raffaels und miyazakis Nacharbeit laut Kreuzungsblatt). 0 Konsolenfehler in allen Läufen. Skripte: `scratchpad/s13/papert/{nach,veto}.py`.

| Veto | Urteil | Messung · Beleg | Bild |
|---|---|---|---|
| **Rune V1** · Machen fragt nie | **grün** | Weiterdenken + Machen → Los → „Was folgt aus ‚Hinterrad eiert‘?“ → Antwort → „Was ist der nächste Schritt? Einer, nicht zehn.“ → „Schlauch flicken“ → „Bis wann?“ → „Morgen“. Das Schild sagt **„Schlauch flicken · bis morgen“**. Kein Leinen-Satz dazwischen. Beide Geräte. | `../papert/veto-4-machen-fragt-*.png`, `../papert/veto-5-schild-*.png` |
| **Rune V2** · Kalender-Wahrheit unter dem Falz | **grün** (ein Vorbehalt) | Leerer Tag: Die Kalenderzeile steht als erste Zeile unter dem Kopf und ist ganz sichtbar (iPhone y 353, Computer y 527). Der Apple-Satz steht einmal dabei. **Vorbehalt:** `C6.tage.status().kalender` meldet in der lokalen Datei `nicht-verbunden`, der Satz lautet aber „Von hier aus komm ich an keinen Kalender heran“, und der Chip „Wie verbinde ich ihn?“ erscheint nicht. Im claude.ai-Zustand ist das ungeprüft (raffael bitte ansehen, ob Status und Satz zusammenpassen). | `nach-1-leer-*.png` |
| **Rams V1** · Tagesblatt zu klein | **grün** | In vier Zuständen (leer · Termin · nach „Ja, bitte“ · Karteikarten offen) ragt kein Knopf und kein Feld unter das Blatt oder unter das Dock. iPhone: Blatt y 303–692, Dock 722. Computer: Blatt y 417–740, Dock 768. Carl überlappt das Blatt nie (iPhone y 82–163, Computer y 10–120). Beim offenen leeren Stapel ragten die Felder zuerst noch 27–115 px heraus; behoben durch die beschreibbare Karte (papert, siehe unten). | `nach-2-termin-*.png`, `nach-3-ja-*.png`, `nach-4-karten-*.png` |
| **Rams V2** · Brief: zwei Arten Nein | **grün** | Brief (echter Tipp aufs Postfach) mit Angebot: Die Knöpfe sind nur „Ja, bitte“ und „Später“. | `nach-5-brief-*.png` |
| **Papert V1** · eigene Karte unsichtbar | **grün** | Nach „Erste Karte“ liegt die Karte oben im Blatt (iPhone Karte y 445–595 in Blatt 323–692, Computer 447–651 in 346–740). Das Formular ist zu, „Noch eine Karte“ steht da. | `../papert/veto-3-erste-karte-*.png` |
| **Papert V2** · Fach selbst füllen | **grün** | Leerer Tag → Linie „Was steht an dem Tag an?“ → leer abgeschickt: „Ein paar Wörter reichen, zum Beispiel ‚Zahnarzt‘.“ → „Mathe-Prüfung“ → Fach `data-stand=termin`, Zettel im Fach sichtbar, unter der Linie „‚Mathe-Prüfung‘ liegt jetzt im Fach.“, Angebot Karteikarten sofort da. | `../papert/veto-1-zeile-*.png`, `../papert/veto-2-eingetragen-*.png` |

Kleine Funde: `netz.js` „fliegen wir hin“ → „schauen wir ihn von oben an“ **grün**. Schlusspunkt in `vorschlag.weiter.frage` {t} abgeschnitten („Was folgt aus ‚Hinterrad eiert‘?“) **grün**. Schlusszeichen im Zitat des Leinen-Satzes abgeschnitten **grün** (nicht eigens geklickt, nur im Code).

## Ungeprüft / gesehen, nicht beanstandet
- Echter Kalender, echtes iPhone, echtes Mitdenken.
- Der Brief zeigt nach 1,5 s nur „16. Oktober · Hallo, Otto.“, die Zeilen darunter sind noch leer (vermutlich die Schreib-Animation). Nicht abgewartet.
- „Abgeschnittene Blase“ (kleiner Fund): In meinen Läufen war keine Blase abgeschnitten. Die Blase im Space blendet ihr letztes Wort beim Schreiben ein; das ist die Animation, kein Schnitt. Ohne genauen Ort nicht weiter geprüft.
