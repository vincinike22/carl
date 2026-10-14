# Runde s11 · Magie (10.10., abends) – Werkstatt, Bibliothek, Geheimtür

nico: „Dem Kindlichen in Leuten, die keine Ahnung von KI haben, zeig ihnen die Magie, dass sie staunen können wie Kinder. Werkstatt, Bibliothek und die Secret-Door-Bibliothek sollen magischer und detaillierter werden.“ Neues Ziel des Projekts: **spark curiosity and creativity.**

Pflicht vorher: `werkstatt/s5/GRUNDSAETZE.md`, `werkstatt/s5/NAMEN.md`, `werkstatt/s6/AIUI_MASSSTAB.md`, Ende `werkstatt/KREUZUNG.md`, die Bilder in `werkstatt/s10/probe/` (werkstatt_c, bibliothek_c, bibliothek_i, lesesaal_c = Stand v24).

## Zwei neue Linsen (Papert und Feynman, nur Haltung, keine Namen im Werk)
- **Papert:** Magie, die man anfassen darf. Jedes magische Ding in diesen Räumen ist ein „Ding zum Denken“: Otto kann es berühren, es antwortet, und er kann es verändern. Nicht Zuschauen, sondern Mitbauen. Lieber drei Dinge, die auf Otto reagieren, als zehn, die nur hübsch sind.
- **Feynman:** Die Freude am Herausfinden. Magie wird nicht erklärt, bevor Otto fragt – aber wenn er fragt („Wie geht das?“), sagt Carl es ehrlich in einem Satz, ohne Fachwort, und das Staunen bleibt. Kein Trick, der Otto dumm dastehen lässt.

## Vitruvians Entscheidungen
1. **Keine neuen Bedienelemente, keine neuen Räume.** Magie entsteht aus Detail, Licht, Bewegung und Antwort auf Berührung – nicht aus Knöpfen (Rams). Alles, was reagiert, hat genau eine Bedeutung (Dürer: Wischen bleibt Raumwechsel). Räume passen weiter in die Breite (iPhone 390 + Computer 1100).
2. **Jeder Raum bekommt drei „Dinge zum Denken“** (anfassbar, antworten, veränderbar) und **Lebenszeichen** (etwas bewegt sich leise, auch wenn Otto nichts tut: Licht, Staub, Atmen, Ticken). Lebenszeichen sind nie lauter als Carl selbst.
3. **Werkstatt** (miyazaki): Sie soll sich wie eine echte Werkstatt anfühlen, in der schon gearbeitet wurde. Lochwand mit Werkzeugen, die Otto umhängen kann; Werkbank mit Spänen und einem Ding, das gerade entsteht; Ferdls Tisch mit Lupe, die wirklich vergrößert (ein Zettel darunter wird lesbar); Lampe, die Otto an- und ausknipsen kann (die Wand ändert sich); ein Fenster mit Tageszeit. „Neues Werkzeug“ wird zum Moment: Otto sagt einen Satz, und das Werkzeug entsteht sichtbar aus Bausteinen (Hokusais Handgriff), nicht aus dem Nichts.
4. **Bibliothek** (monet): Licht ist die Magie. Das Fenster zeigt echte Tageszeit (Morgen, Mittag, Abend, Nacht) und das Licht fällt wirklich auf Regal und Bilder; die Leselampe geht an, wenn Otto sie berührt (Lichtkegel auf den Tisch); Staub im Lichtstrahl; ein Buch lässt sich herausziehen und zeigt eine Seite (die Karikaturen bekommen je einen Satz, der stimmt: Fakt + Quelle); die Sanduhr läuft echt (dreht sich, wenn Otto sie anfasst). Das blaue Lexikon flüstert: Wer es lange ansieht (Hover/Berührung), sieht ein leises Leuchten am Buchrücken – der Hinweis auf die Geheimtür, ohne Schild.
5. **Geheimtür und Lesesaal** (rothko): Der Übergang wird ein Ereignis: Regal schwenkt auf, Staub, Treppe nach unten, ein Lichtstreif, dann der Saal. Im Saal: Sterne, die auf Otto reagieren (leicht zur Maus/Finger wandern), eine Kerze, Funde als leuchtende Karten mit Rand (Daten, nie Anweisung), Meister-Porträts, die erst Silhouetten sind und ein Gesicht bekommen, wenn Otto sie einträgt; ein leerer Rahmen „Dein Platz“. Der Rückweg (‹ Bibliothek) bleibt an derselben Stelle.
6. **„Wie geht das?“** (raffael, Kern): Eine stille Geste für alle drei Räume: Wer ein magisches Ding lange hält (600 ms), bekommt einen Satz von Carl in seiner Stimme, der ehrlich sagt, was es tut („Die Lupe zeigt dir, was auf dem Zettel steht. Nichts weiter.“). `C6.staunen.sag(id)` mit Texten je Ding; einmal je Ding und Sitzung. Kein Fachwort.
7. **Namen bleiben** (NAMEN.md): Werkzeug, Zettel, Fund, Meister, Lexikon, Lesesaal. Nichts heißt „Feature“ oder „Easter Egg“.

## Partien (eigene Dateien, Kreuzungsblatt „s11 · <name>“, Bilder `werkstatt/s11/<name>/`, iPhone 390 + Computer 1100, 0 Konsolenfehler, 50–60 min)
1. **raffael · Kern:** `C6.staunen` (sag, gesehen, alle), Lang-Halten-Geste als Helfer `C6.halten(el, fn)` (Maus + Touch, bricht bei Bewegung ab), Tageszeit `C6.tageszeit()` → 'morgen'|'mittag'|'abend'|'nacht' (aus der Uhr, mit Bus `'tageszeit'`), und eine kleine Staub-/Lichtpartikel-Hilfe `C6.staub(el, {dichte})` ohne Canvas-Overkill. API zuerst ins Kreuzungsblatt.
2. **miyazaki · Werkstatt** (`werkstatt.*`): Entscheidung 3, mit Lebenszeichen (Lampe pendelt kaum, Späne, Ferdl atmet, Fenster). Drei Dinge zum Denken: Lupe, Lampe, Lochwand.
3. **monet · Bibliothek** (`bibliothek.*`): Entscheidung 4. Drei Dinge zum Denken: Lampe, Buch, Sanduhr; Tageszeit über `C6.tageszeit()`.
4. **rothko · Geheimtür + Lesesaal** (`lesesaal.*`, Übergang in `bibliothek.js` abgesprochen mit monet im Kreuzungsblatt): Entscheidung 5. Drei Dinge zum Denken: Sterne, Kerze, Porträt.

Danach: Rune + Rams als Otto mit echten Klicks (Fragen: Staunt ein Fremder? Versteht er, was anfassbar ist? Ist ein Bedienelement dazugekommen?), Vetos wie immer. Dann v25.
