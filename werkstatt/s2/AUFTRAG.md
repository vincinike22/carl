# Runde s2 · UI verbessern (09.10., 2 Stunden), danach Kieselpark als Herzensprojekt

Stand: Version 12 (s1), Quellen in `/home/claude/carl/n13/src`. Pflicht vorher: `werkstatt/REINE_FORM.md` (Prinzip: Einfachheit, ein Weg, nichts überladen) und das Ende von `werkstatt/KREUZUNG.md`.

## nico wörtlich (Screenshots: Himmel mit schraffierten Planeten-Schattenseiten, Werkstatt mit Wahl-Chips „Nach probe / Nach he / Hier in der Werkstatt“, Kieselpark-Dachpark)
„Nutz das Limit aus für die nächsten 2 Stunden, um alles zu verbessern.
- Freundschaftsbuch mit mehreren Seiten und Animation etc.
- ‚Versteckte Bibliothek‘ auch mehr mit tatsächlichen Regalen, wie in einer Zauberschule, entlanggehen und in die Bereiche klicken. Dort sind Bücher hinterlegt und Carls individueller Kommentar. Dort kann man auch PDFs, Links, YouTube-Videos etc. hochladen und einordnen lassen, je nachdem, was ihr Inhalt ist.
- Passe Zuhause an: Bild von Fahrrad hinter Tür fast zur Hälfte versteckt, Wollknäuel liegt über Notizen, Raum sieht etwas ‚leer‘ aus, mach vielleicht einen größeren Teppich oder bewusstere Einrichtungs-Hintergründe.
- Leiter ist unnötig. ‚/‘ ist das, wie man Skills abruft, denke ich, aber mach’s gerne intuitiver.
- Schattenseite der Planeten ist immer noch ‚unfertig gerendert‘ mit Linien (siehe Screenshot).
- Teleskop macht auch wenig Sinn, wenn man keine ‚Hover‘-Funktion hat, mit der man einen ‚Preview‘ und eine kurze Introduction zum ‚Star‘ bekommt.
- Werkstatt: Das Problem ist, dass er in dem Screen nach dem Klick auf ein ‚Item‘ aufhängt und man nicht in der Werkstatt herumgehen kann. Und es sind auch immer genau dieselben Fragen/Auswahlmöglichkeiten.
- Ihr braucht nicht unbedingt Prüfrunden machen, aber schaut, dass alles ‚nützlich‘ wird und nicht einfach nur overengineered.
- Falls danach noch Zeit & Credits: Alle Spiele sollen wirklich so funktionieren wie ihre Inspiration. Z. B. das Fahrrad-Game ist noch immer extrem weit hinten in der Designkunst im Gegensatz zum Rest, und auch die Mechanik ist echt schlecht. 2 Stunden nur UI verbessern, die strengen Überprüfungen könnt ihr lassen. Dann um Bicycle kümmern, 15 min intensiv als Herzensprojekt.“

## Regeln dieser Runde
- **Zeit:** 60–75 Minuten je Partie. **Keine Prüfstandläufe**, nur bauen (`cd /home/claude/carl/n13 && python3 tools/bau.py`), ein bis drei Bilder iPhone + Computer selbst ansehen (`python3 tools/bild.py iphone|computer "<JS>" out.png`, das Werkzeug zeigt Konsolenfehler) und **null Konsolenfehler**.
- **Nützlich vor schön, einfach vor viel.** Keine neuen Systeme, wenn ein bestehendes reicht. Fremde Marken, Figuren und Orte werden nicht nachgebaut (die Zauberschule ist nur Stimmung, nicht ihr Aussehen).
- Nur eigene Dateien. Neue CSS-Regeln gehören in eigene `.css`-Dateien neben die eigene `.js` (sie laden nach `kern.css`). Kreuzungsblatt-Abschnitt „s2 · <name>“, Bilder in `werkstatt/s2/<name>/`.
- Ehrlichkeit: Was der Prototyp nicht kann, sagt Carl in seiner Stimme. Keine erfundenen Quellen.

## Partien
1. **jung · Freundschaftsbuch** (`src/module/atlas.*`): Es bekommt mehrere Seiten, die sich zu füllen lohnen, etwa Freundebuch-Seiten wie Lieblingsdinge, „Das mag ich an dir“, Pläne und „Unser Jahr“, dazu Damals und Briefe. Das Blättern wird eine echte Seitenkurve mit Wölbung und Schatten, statt nur zu drehen. Kleine Animationen beim Einkleben und Schreiben.
2. **rothko · Versteckte Bibliothek** (`src/raeume/lesesaal.*`, Brücke in `bibliothek.js` nur wo nötig):
   - Echte Regalgänge, an denen man entlanggeht, seitlich wischen bzw. scrollen. Jeder Gang ist ein Bereich (Philosophie, Naturwissenschaft, Kunst, Eigene Funde …), und ein Klick auf einen Bereich führt dort hinein.
   - Dort stehen Bücher mit Carls persönlichem Kommentar.
   - **Einordnen:** Links, YouTube-Links und Dateien (PDF, Bild) lassen sich hineinlegen. Carl liest Titel und Notiz (sample, `C6.denk(…,{stumm:true})`) und ordnet sie dem passenden Bereich zu, mit einem Satz dazu.
   - Dateien: Gibt es `claude.use('assets')` (Upload ins Artifact), dann dort ablegen, sonst nur Name, Typ und Größe lokal. Das wird ehrlich gesagt.
   - Die Karten des Wissens bleiben als ein Bereich erhalten.
3. **miyazaki · Zuhause** (`src/raeume/zuhause.*`): Ordnung und Wärme.
   - Das Fahrradbild hängt frei, nicht halb hinter der Tür.
   - Das Wollknäuel liegt nicht über den Notizen.
   - Ein größerer Teppich und eine bewusste Einrichtung: Bücherbord, Pflanze, Lampe, Bilder, ein Fensterbrett mit Kleinkram. So ist der Raum gefüllt, aber nicht vollgestopft.
   - Carl hat seinen Platz.
4. **raffael · Gerüste im Gespräch** (`src/kern.*`):
   - Der Leiter-Knopf im Dock entfällt.
   - Stattdessen öffnet ein **„/“** im Feld eine kleine Liste der Gerüste mit Zeichen und einem Satz dazu, filterbar beim Weitertippen, so wie man Befehle aufruft. Dazu ein leiser Hinweis im leeren Feld: „Sag Carl etwas … oder / für ein Gerüst“.
   - Auch die Leiter-Zeichen der Gerüste in Werkstatt und Gesprächsliste prüfen: Jedes Gerüst bekommt ein eigenes, sprechendes Zeichen statt immer derselben Leiter. Die Zeichen-Daten liegen dort, wo die Gerüste definiert sind; das ist mit leonardo abzusprechen.
5. **hokusai · Himmel + Teleskop** (`src/raeume/netz.*`, `src/raeume/teleskop.*`):
   - Die Schattenseite der Planeten wird sauber und weich gerendert, ohne Schraffur-Linien: weicher Terminator, Nachtseite dunkel-farbig, leichtes Randlicht.
   - Teleskop: Hover am Computer bzw. Antippen am iPhone zeigt eine Vorschau-Karte am Stern mit Name, kurzer Einführung und „Übernehmen“.
6. **leonardo · Werkstatt** (`src/raeume/werkstatt.*`):
   - Nach dem Klick auf ein Gerüst hängt nichts mehr fest. Man kann die Frage jederzeit wegtippen, weiter herumgehen und ein anderes Ding anfassen; Esc, Zurück und Wischen funktionieren.
   - Fragen und Auswahl werden lebendig und passend: Carl fragt je nach Gerüst, Projekt und letzter Arbeit anders. Die Ziele werden mit Bedeutung beschriftet („Zu ‚probe‘ – da fehlt noch der Kernsatz“) statt immer „Nach …“. Höchstens drei Wahlen, die beste zuerst.
   - Die Wochenrückblick-, Leere-Seite-, Zwei-Wege- und Kiste-Leitern bekommen eigene Zeichen (siehe raffael).
7. **warhol · Kieselpark, Herzensprojekt** (`src/module/kieselpark.*`), läuft gleichzeitig mit den anderen, 60 Minuten:
   - Die Mechanik soll sich anfühlen wie ein gutes Finger-BMX-Spiel. Eigener Name und eigene Grafik, keine fremde Marke.
   - Steuerung: Zwei Finger bzw. Wischen geben Schwung, Ziehen nach oben ist ein Bunny-Hop mit Aufladen, Drehen in der Luft macht Tricks. Die Landung wird bewertet: sauber, wackelig oder Sturz. Dazu Grinds auf Kanten und Rails, Rampen mit echter Kurvenphysik und einen Kamera-Zoom bei Höhe.
   - Design auf dem Niveau des Rests: gezeichnete Parks mit Tiefe (Vorder-, Mittel- und Hintergrund), Licht und Schatten, Staub und Funken, das eigene Rad in voller Pracht. Dazu ein Fahrer: Carl oder eine Hand, nach Wahl, aber schön.
   - Klarer Spielablauf: Lauf, Punkte, Combo und Challenge erfüllt.
