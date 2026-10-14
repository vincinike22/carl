# Kern-Vertrag Carl 6 (alle Module halten sich daran)

Eine Datei `carl6.html` wird gebaut mit `python3 /home/claude/carl/n6/tools/bau.py`: Sie nimmt `src/kern.css` und `src/kern.js` und hängt danach `src/module/*.css|js` und `src/raeume/*.css|js` alphabetisch an. Ausgabe: `/home/claude/carl/n6/carl6.html`. Externe Skripte sind verboten, Schriften kommen von Google Fonts (Fraunces, Figtree, Caveat).

Zeichenregel: Bühnen werden **einmal** aufgebaut. Danach ändert man nur gezielt Knoten (Text setzen, Klassen umschalten), es gibt nie ein globales Neu-Zeichnen und nie `innerHTML` auf die ganze Bühne. Übergänge laufen mit CSS-Transitions/WAAPI ≤ 450 ms. Bei `C6.ruhig` (prefers-reduced-motion) gibt es keine Dauerbewegung.

## Globale API `window.C6` (Besitzer: raffael · `src/kern.js`)
```js
C6.S                      // Zustand, wird automatisch in localStorage 'carl6' gespeichert (try/catch)
C6.speichern()            // sofort sichern (sonst gedrosselt nach C6.aendern)
C6.aendern(fn)            // fn(S) ändert den Zustand → speichert, sendet bus 'zustand'
C6.bus.on(name, fn) / C6.bus.emit(name, daten)
C6.geraet                 // 'iphone' | 'computer'  (breit ≥ 820px → computer)
C6.ruhig                  // true bei reduzierter Bewegung

C6.raum(def)              // Raum anmelden:
  // { id, name, hoehe:'boden'|'vogel'|'teleskop', reihe:Zahl (Reihenfolge am Boden),
  //   symbol: '<svg…>' (klein, 24px), bauen(buehne, api) -> {betreten?(opts), verlassen?(), groesse?()} }
  // bauen wird beim ersten Betreten EINMAL aufgerufen; buehne ist ein <section class="c6-buehne">.
C6.geh(id, opts)          // weich in einen Raum (am Boden: seitliches Gleiten; Höhe: Kamerafahrt hoch/runter)
C6.jetzt                  // id des aktuellen Raums
C6.zurueck()

// Carl (Figur von miyazaki, src/module/figur.js)
C6.figur.male(el, opts)   // -> ctl {el, schau(x,y), stimmung('ruhig'|'froh'|'denkt'|'arbeitet'|'staunt'|'schlaeft'),
                          //         huepf(), geh(xPx, ms), groesse(px), teile(0..5) (Zusammenbau), kleid(obj), weg()}
C6.carl                   // ctl der Figur im aktuellen Raum (jeder Raum, in dem Carl steht, ruft C6.figur.male und meldet: C6.setzeCarl(ctl, raumId))

// Sprechen (raffael baut die Sprechblase an Carl, weich, Wort für Wort, ohne Layout-Sprung)
C6.sag(text, {warte?:ms}) -> Promise          // Carl sagt etwas im aktuellen Raum
C6.frag(text, optionen[], {frei?:bool, mehr?:bool, id?:string}) -> Promise<antwort>
  // Antwort-Chips am Boden des Raums (wischbar), optional freies Feld (Text bleibt erhalten, Entwurf je id)
C6.denk(eingabe, {kontext?}) -> Promise<text>  // echte Antwort über sample (claude.use('sample')), sonst Beispielsatz; onText-Streaming in die Sprechblase
C6.eingabe                // das Eingabe-Dock unten (immer da am Boden): Carl antippen = fokussieren

// Projektor (miyazaki): C6.projektor.auf({titel, inhalt: el|fn(el)}), C6.projektor.zu()
// Münzen (warhol): C6.muenzen.plus(n, grund), C6.muenzen.stand()
// Nadel/Post (stanlee): C6.nadel.modus(true|false)
// Strings (hokusai): C6.strings.alle(), .neu({titel, art}), .perle(stringId, text), .knoten(a,b,satz)

// s11 · Magie (raffael, Kern; Einzelheiten im Kreuzungsblatt „s11 · raffael“)
C6.staunen.text(id, satz) / .sag(id, satz?) -> bool / .gesehen(id) / .alle() / .vergiss(id?) / .an(el, id, satz?) -> zurueck
  // „Wie geht das?“: ein ehrlicher Satz je Ding, einmal je Ding und Sitzung, in Carls Blase; Bus 'staunen' {id, satz}
C6.halten(el, fn, {ms:600, bewegung:8}) -> zurueck   // Lang-Halten (Maus, Finger, Stift, Enter/Leertaste); bricht bei > 8 px ab,
  // Kontextmenü aus, Klasse c6k-haelt während, nächster click geschluckt; fn(el, {x, y, art})
C6.tageszeit() -> 'morgen'|'mittag'|'abend'|'nacht'  // 6–11 / 11–17 / 17–21 / sonst; Bus 'tageszeit' {jetzt, vorher} je Minute geprüft;
  // #c6[data-tageszeit]; .setze(x|null) nur für Prüfstände; .stunde()
C6.staub(el, {dichte, farbe:'r,g,b', tempo, raum, mischen}) -> {zurueck(), dichte(n)}  // kleines Canvas, gemeinsamer Takt, pausiert verborgen,
  // nur im sichtbaren Raum; bei reduzierter Bewegung Standbild
```

## Zustand `C6.S` (Schlüssel gehören ihren Besitzern)
- `S.du` (jung): `{name, carlName, arbeit, baut, tun[], nie[], ton, socken, fertig:bool}`
- `S.strings` (hokusai): `[{id, titel, art:'projekt'|'idee'|'gewohnheit', farbe, perlen:[{t, ts}], erstellt}]`, `S.knoten: [{a, b, satz, ts}]`, `S.nadeln: [{satz, stringId, ts}]` (die roten Wahrheits-Nadeln)
- `S.gespraech` (raffael): `[{von:'du'|'carl', t, ts, raum}]` (höchstens 200)
- `S.muenzen`, `S.laden:{besitz[], an:{}}`, `S.bmx:{parks:{}, teile:{}}` (warhol)
- `S.geruest` (hokusai): eigene Gerüste `[{id, name, aus, schritte[], ts}]`
- `S.rad` (warhol/hokusai): `{teile:{rahmen:stringId,…}}`

## Räume (Besitzer)
- boden/`zuhause` (miyazaki): Carls Stube, Gesprächsplatz, Projektor
- boden/`werkstatt` (hokusai): Gerüste/Werkzeuge an Wand, Bank, Regal
- boden/`bibliothek` (hokusai): Über mich, Damals, Begleiter
- boden/`fahrrad` (warhol): das Rad mit Teilen ↔ Strings, Knopf „Kieselpark“
- boden/`laden` (warhol): Kleiderladen
- vogel/`netz` (hokusai): Strings von oben, Knoten, rote Nadeln
- teleskop/`teleskop` (hokusai): geteilte Gerüste (Beispiel)
- `rundgang` (jung): erstes Öffnen → Rundgang durch die Räume, Carl baut sich zusammen
- Ebene `nadel` + Raum `post` (stanlee)

## Navigation (raffael)
Unten eine wischbare **Raumleiste** (Zuhause · Werkstatt · Bibliothek · Fahrrad · Laden). Oben rechts ein **Höhenregler** mit drei Punkten: Boden · Vogel · Teleskop (antippen oder senkrecht ziehen; am Computer Mausrad mit Alt). Esc = zurück. Ganz oben links nur Carls Name/Raumname. Keine Menüs, keine Zahnräder.

## Prüfen
`python3 /home/claude/carl/n6/tools/pruef6.py` (raffael/duerer bauen es: iPhone 390×844 + Computer 1440×900, Konsolenfehler, Überdeckung, Tippziele ≥ 44, horizontal kein Überlauf, Bilder je Raum). Bis es steht: `python3 /home/claude/carl/n6/tools/bild.py <iphone|computer> "<JS>" out.png`.
