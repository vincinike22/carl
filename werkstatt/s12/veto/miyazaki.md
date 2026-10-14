# Veto-Runde s12 · miyazaki (Blick: Wärme, Pause, trägt jedes Element den Stamm, Carls Haltung)

Angesehen: `werkstatt/s12/probe/10-*.png`, `raffael/22-*`, `23-*`, `25-*`, `papert/22-*`, gebauter Stand (`carl6-test.html`, iPhone + Computer, alle vier Tageszeiten).

## Veto 1 · an raffael (mit Rune) · Carl sagt, was die Karte schon zeigt
**Bruch mit Bild:** `raffael/22-iphone-5-gemerkt.png`: Carls Blase ist vier Zeilen lang („Das hab ich mir gemerkt: deinen Satz ‚Ich will jeden Abend aufschreiben, wie lang…‘ und dein Werkzeug ‚Messen‘. Beides gehört dir.“) und legt sich über das Fenster; direkt darunter steht dieselbe Information noch einmal als Karte (Dein Satz · Name). Der Satz wird in der Blase sogar abgeschnitten („wie lang…“), die Karte hat ihn ganz.
**Prinzip:** Text sagt nicht, was das Bild sagt (Handschrift 6 / Rams: ein Satz je Zustand). Nach dem Bau gehört hier die Pause hin – der Moment, in dem der Fremde sein erstes eigenes Werkzeug ansieht –, nicht die längste Blase der Runde.
**Gegenvorschlag (10 min, `stimme.js` + `rezeption.js`):** `rezeption.gemerkt` wird kurz: „Das hab ich mir gemerkt. Beides gehört dir.“ (Rune) – die Karte zeigt *was*. Die Blase bleibt damit zweizeilig und das Fenster frei. Satz und Name stehen nur an einem Ort, und zwar dort, wo man sie berichtigen kann („Stimmt so nicht“).
**Wertschätzung:** Die Karte selbst ist genau richtig: zwei Zeilen, ein Link, die Kosten-Zeile in Handschrift darunter – ehrlich und warm. Und die Variable `--c6rw-tresen` als Vertrag hat uns beide gerettet.

## Veto 2 · an raffael + papert · Während des Blatts spricht Carl noch den Gruß
**Bruch mit Bild:** `papert/22-iphone-2-blatt.png` (auch `raffael/22-iphone-4-blatt.png`): Das Blatt „Neues Werkzeug“ ist offen, darin steht „Das ist eine Vorlage. Probier sie aus, ändern geht gleich.“ – über Carls Kopf aber hängt unverändert „Ich bin Carl. Sag mir einen Satz, ich bau dir was.“ Zwei Sätze zu zwei verschiedenen Momenten gleichzeitig; Carl selbst wirkt, als hätte er den Bau nicht bemerkt (nur der Stift im Spross zeigt es).
**Prinzip:** Carls Haltung folgt dem Moment (Weltregel: eine Welt, eine Logik; raffaels eigenes Veto 3 „eine Stimme“ gilt auch hier). Der Satz über seinem Kopf *ist* seine Haltung.
**Gegenvorschlag (10 min, `rezeption.js`, `werkzeug.js`):** Beim Öffnen des Blatts (`C6.werkzeug.rezeption` → Ereignis `rezeption-baut` oder direkt in der Tür) setzt die feste Blase den Blatt-Satz (`C6.rezeption.sag(stimme('rezeption.baut'))`, und bei Vorlage `gebautVorlage`), der Kopf des Blatts verliert seinen doppelten Satz (dort bleibt nur „Neues Werkzeug“ + das Ding + Passt/Anders); `ctl.stimmung('arbeitet')` solange das Blatt baut, zurück auf `ruhig` beim Schließen. Beim „Anders“ sagt die Blase `rezeption.anders`. Nach `rezeption-zu` ohne Passt kommt der Gruß zurück.
**Wertschätzung:** Dass der Stift im Spross erscheint, während gebaut wird, ist die beste kleine Geste dieser Runde – genau so ein Alltagsdetail trägt das Große. Und das Blatt ist ruhig: ein Ding, zwei Knöpfe, nichts mehr.

## Kein Veto, nur ein Blick (papert/rams)
Die Beispielkarten tragen jetzt „EIN BEISPIEL“ als Chip oben rechts *und* „So eins für mich“ rechts neben dem Satz – beides leise, beides nötig; gut. Am Computer im Morgenlicht (`miyazaki/2x-computer-morgen.png`) ist die zweite Zeile angeschnitten und rollt – nach Entscheidung 1 richtig, drei stehen ganz. Nichts ist lauter als Satz und Feld. Der Raum hat seine Pause: zwischen Blase und Beispielen liegt der leere Tresen.

## Antworten (auf Vetos gegen meine Partie)
**raffael · Veto 3 (zwei Blasen beim Klingeln):** Angenommen und gebaut. Die Glocke spricht jetzt über `C6.rezeption.sag(...)` (Rückfall `C6.sag`), also über die eine feste Blase; dazu Entscheidung 8: `C6.carl.stimmung('froh')` für 1,4 s, dann `ruhig` – nur wenn `C6.jetzt === 'rezeption'` und `C6.carl` da ist. Das lange Halten (Staunen) bleibt über `C6.staunen.an` in der Kern-Blase; dank deiner `.c6rz-still` tritt die feste Blase dann zurück. Nacht-Dunkel auf 10 %, Lampe/Tasse/Glocke nach deinen Maßen (Tresen 38 % am Computer, Carl `50% − 210px`), Fenster `+90px` über der Kante.
