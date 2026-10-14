# Runde s4 · Jeder Bildschirm, ein Ökosystem (09.10.)

Stand: Version 14. Quellen `/home/claude/carl/n13/src`. Pflicht vorher: `werkstatt/REINE_FORM.md`, `werkstatt/s2/AUFTRAG.md` und `werkstatt/s3/AUFTRAG.md` (nicos Feedback wörtlich, gilt weiter **im Detail**), Ende von `werkstatt/KREUZUNG.md`, Screenshots `werkstatt/s3/nico/`.

## nico wörtlich
„Alles schon viel besser, aber nichts exzellent! Nimm dir nochmal mein vorheriges Feedback und arbeite die Dinge im Detail durch und aus, dass es zum Gesamtökosystem verschmilzt. Cut out ‚unnecessary‘ things – better too much rather than too little. Du solltest dir eine Stunde nehmen und jeden Bildschirm überarbeiten. Danach gehe ich im Detail Bildschirm für Bildschirm mit Kommentarfunktion durch, aber es ist so viel zu verbessern, dass ich denke, du schaffst viel allein – damit es später detaillierter und tiefer sein kann.“

## Maßstab: exzellent statt besser
Für jeden Bildschirm, den du hast, in dieser Reihenfolge:
1. **Streichen zuerst (Haltung von rubin, lade den Skill `anthropic-skills:rubin`).** Alles, was nicht der einen Sache des Bildschirms dient, fällt weg: doppelte Knöpfe, erklärende Texte, die das Bild schon sagt, Dekor ohne Bedeutung, zweite Wege, leere Zustände mit Floskeln. Lieber zu viel als zu wenig. Jede Streichung als eine Zeile in `werkstatt/STREICHUNG_S4.md` (Bildschirm · was · warum). Funktionen, die nico ausdrücklich wollte (s. Feedback), bleiben erreichbar.
2. **Die eine Mitte:** Jeder Bildschirm hat einen Blickfang und eine Haupthandlung. Alles andere ist leiser.
3. **Ökosystem:** Der Bildschirm ist ein Teil der einen Welt (siehe unten), kein eigenes Programm.
4. **Detail und Leben:** Licht von einer Quelle, Schatten, Material, kleine Bewegung, Übergänge ohne Schnitt. Carl gehört in jeden Raum und reagiert.
5. **iPhone und Computer** (nicos Computer-Ansicht ≈ 990–1150 px breit): beide ansehen.

## Das Ökosystem (für alle verbindlich)
- **Ein Faden durch alles:** Was irgendwo entsteht, kann als **Perle auf einen Faden/Space** (Fund aus der Schreibstube, Buch/Fund aus dem Lesesaal, Ergebnis eines Gerüsts, Brief). Nutzt den bestehenden Weg (`C6.faden`/`C6.space.legeHin`/Perle), keinen neuen.
- **Carl trägt Dinge zwischen den Räumen:** Wenn etwas für einen anderen Ort bestimmt ist, sagt Carl es in einem Satz und bietet **eine** Wahl zum Hingehen (Einzelwahl-Pfeil von raffael).
- **Münzen** kommen aus dem Kieselpark und Geheimnissen und gehen in die Garage. Nirgends sonst Zahlen-Druck.
- **Eine Bildsprache:** Papier, Tusche, warmes Licht, Fraunces/Figtree, Carls Briefe-Ton. Keine eigenen Farb- oder Schriftwelten pro Raum.
- **Vorschläge:** raffaels `C6.frag` (Einzelwahl / Mehrfachwahl, `hinweis`-Zeilen) wo Carl fragt; höchstens drei Wahlen.

## Partien (60 min, keine Prüfstandläufe, nur bauen + Bilder, 0 Konsolenfehler, nur eigene Dateien, eigene CSS, Kreuzungsblatt „s4 · <name>“, Bilder `werkstatt/s4/<name>/` mit vorher/nachher)
1. **shakespeare · Anfang, Rundgang, Carls Stimme** (`src/raeume/rundgang.*`, `src/module/stimme.js`): erster Eindruck kurz und magisch, jeder Satz trägt, Texte im ganzen Produkt kürzen (in stimme.js), Floskeln raus.
2. **miyazaki · Zuhause + Space** (`zuhause.*`, `space.*`, `space.orte.js`): Zuhause als Herz (von hier alles erreichbar, nichts doppelt), Space der Ort der Schleife (Zettel, nächster Schritt, Kernsatz, Carl denkt mit); am iPhone der Wegweiser ebenfalls in der Szene, wenn irgend möglich.
3. **hokusai · Himmel + Teleskop + Carl** (`netz.*`, `teleskop.*`, `figur.js`): Himmel = Fäden verbinden, Teleskop = Gerüste finden; alles Überzählige weg; Carl-Figur weiter feinschleifen.
4. **leonardo · Werkstatt + Schreibstube** (`werkstatt.*`): Gerüste nehmen → arbeiten → Ergebnis wird Perle; Schreibstube-Fund wird Perle.
5. **rothko · Bibliothek + Lesesaal** (`bibliothek.*`, `lesesaal.*`): Geheimtür schwingt als Teil der Regalwand (nicht als getrenntes Drittel), Wandbibliothek ruhiger, Funde/Bücher können als Perle auf einen Faden.
6. **jung · Freundschaftsbuch** (`atlas.*`): jede Seite mit klarer Mitte, Überzähliges weg, Inhalte fließen zurück ins Ökosystem (Pläne → nächster Schritt in einem Space, Sprachmodell → Carl sagt es beim Mitdenken).
7. **stan-lee · Garage** (`fahrrad.*`, `laden.*`, `garage.css`): exzellent statt gut; Carl im Schrank steht vor dem Spiegel (nicht auf der Couch).
8. **warhol · Kieselpark** (`kieselpark.*`): Gefühl, Lesbarkeit, Menü, Ende-Karte; Münzen klar zurück in die Garage.
9. **raffael · Kern: Dock, Gespräch, Projektor, Nadel, Post, Kopfzeile, Höhen-Leiste** (`kern.*`, `nadel.*`, `post.*`, `projektor.*`, `wahl.css`, `slash.css`): Rahmen der Welt so ruhig wie möglich; doppelte Navigation (Brotkrumen + Zurück + Höhen-Leiste + Dock) bereinigen, Sprechblase und Dock verschmelzen mit der Szene.
