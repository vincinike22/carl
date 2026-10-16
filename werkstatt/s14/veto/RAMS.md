# s14 · Veto · Rams (Reinheit im Gebrauch)

Geprüft am heutigen Zusammenbau (16.10. spät, `carl6-test.html`), Playwright-Chromium, iPhone 390×844 (dpr 2, touch) und Computer 1440×900, leer und mit Leben, Abend und Nacht (`C6.tageszeit.setze('nacht')`). Alle zehn Räume/Blätter im Standbild (`z-*`), dazu echte Klickfolgen: Himmel (`h-*`), Space (`s-*`), Katalog mit Holen und mit zu wenig Münzen (`k-*`), Buch alle Seiten (`b-*`), Erstkontakt „Neuer Space“ (`e-*`). 0 Konsolenfehler in allen Läufen. Kein Code geändert.

Frage je Element: Welche Handlung trägt es? Ein Ort, ein Wort, eine Geste? Hält es an der Kante?

## Veto 1 · Der angeflogene Himmel zeigt kaputte Planeten — **stört**
- **Was:** Planet antippen (Computer) → die Kamera fliegt nah; der Nachbarplanet „Gitarre lernen“ und seine Monde sind **links und rechts senkrecht abgeschnitten**, eine Kugel mit geraden Kanten (`h-computer-01-portugal-tipp.png`, Ausschnitt `h-computer-01-ausschnitt-planet.png`).
- **Warum:** Konsequent bis ins letzte Detail – die schlechteste Kante bestimmt den Wert. Der Himmel ist der Ort „von oben sehen“; im Moment, in dem man hinsieht, sieht ein Ding kaputt aus. Ein Fremder hält es für einen Fehler (er hat recht).
- **Tun:** `src/raeume/netz.js` › `kugel()` (Z. ~286–293) rechnet `R = F·r/√(z²−r²)` – das stimmt für eine Kugel in der Bildmitte. Abseits der Mitte ist das Bild einer Kugel eine Ellipse, die radial breiter ist als `R`; das Quadrat, auf das der Shader zeichnet, schneidet sie ab. Das Zeichenquadrat um den Abstand zur Bildmitte vergrößern (z. B. `R·(1 + |s−Mitte|/F)` oder die Ellipsen-Halbachse `R·√(1+(d/F)²)`), Shader-Rand unverändert. Prüfen: Computer, Planet am Bildrand nah angeflogen, alle Kugeln rund.

## Veto 2 · Die Karten decken das Ding der Mitte (iPhone) — **stört**
- **Was:** Im Space Carl antippen → das Blatt mit den vier Karten liegt über dem unteren Drittel des Werkzeugs „Üben“; die Tagesreihe ist halb verdeckt, „heute“ abgeschnitten (`s-iphone-02-carl-tipp.png`).
- **Warum:** ENTSCHEIDUNGEN 7: „Steht ein Werkzeug, ist es das größte Ding neben Carl, nie unter seiner Blase.“ Dasselbe gilt für die Karten: die Antwort auf „Was machen wir damit?“ darf das „damit“ nicht zudecken. Zwei Dinge auf einer Stelle – keins ist ganz bedienbar.
- **Tun:** `src/raeume/space.css:227` (`.c6k-sp:not(.c6k-sp-computer)>.c6vs-platz{position:absolute;…;bottom:10px}`). Solange `.c6z-sp-vs-auf` gilt, das Schild „Nächster Schritt“ zurücktreten lassen (wie der Bauweg) und das Kartenblatt **an seinen Platz** unter das Werkzeug legen (oben = Unterkante `.c6z-sp-mitte` + 8 px), statt es von unten über das Werkzeug zu schieben. Prüfen am iPhone 390×844 und 375×667: Werkzeug ganz sichtbar, Karten ganz sichtbar, Feld frei.

## Veto 3 · Zwei Knöpfe, ein Ziel — **stört**
- **Was:** Vom Himmel „Hineingehen“ in einen Space: oben links „‹ Himmel“, oben rechts „Himmel ↑“ – zwei Knöpfe mit demselben Wort führen an denselben Ort (`h-computer-08-hineingehen.png`).
- **Warum:** Ein Ort, ein Wort, **eine Geste**. Zwei gleiche Wege lassen den Fremden fragen, worin sie sich unterscheiden („Welches ist richtig?“) – und es gibt keinen Unterschied, den er sehen könnte.
- **Tun:** `src/kern.js` – Faden-Rückweg (`.c6k-fd-hoch`) und Höhenknopf (`.c6k-hk`, Wort aus `hkWort`, Z. 691): zeigt der Faden auf die Höhe, die der Höhenknopf ohnehin nennt, steht nur der Höhenknopf (oder nur der Faden – eins). Danach im Space aus dem Himmel: ein Knopf nach oben; im Space aus dem Zuhause bleibt „‹ Zuhause“ + „Himmel ↑“ (verschiedene Ziele, beide nötig).

## Was trägt
- **Ein Katalog, ein Ort, eine Tat:** nur in der Garage; Papier, Tusche, Wörter statt bunter Reiter; antippen = die Lampe leuchtet zur Probe, darunter genau ein Orange „Holen · 4“, danach „● steht bei dir“ (`k-iphone-leben-03-probe.png`, `k-iphone-leben-04-holen.png`).
- **Farbe als Funktion hält:** Fäden Tusche bzw. Space-Farbe, Sternbild Gold, Rot nur noch an der Nadel; Orange nur, wo man handelt (Holen, Den nächsten Schritt finden, Verbinden). Nachts bleibt Papier Papier.
- **Das Zuhause ist ruhig:** Bild, Bücherbord, Tür sind Kulisse ohne Schild, das Brett trägt die Namen ganz, ein Weg „+ Neuer Space“ (`z-iphone-leben-zuhause.png`); das Buch nennt jeden Schalter genau einmal.

## Auch gesehen (kein Veto)
- Nadel-Knopf steht weiter in jedem Raum (offen bei nico, ENTSCHEIDUNGEN 10).
- Buch: die Reiter sind vierfarbig (Pfirsich, Grün, Lila, Blau) – dieselbe Geste, die im Katalog als „generisch“ ging; Abschnittsköpfe in Rostbraun `#8a3b14` (Orange-Familie ohne Handlung). nico hat das Buch ausdrücklich nicht „generisch“ genannt – nur zur Kenntnis.
- Himmel nach Herauszoomen (iPhone): der Sternbild-Knoten liegt auf „Gitarre lernen“, der Tipp auf den Planeten öffnet das Sternbild (`h-iphone-07-gitarre-tipp.png`); im Überblick traf jeder Tipp richtig (je zweimal, beide Geräte).
- Werkstatt-Schild „für „Bachelorarbeit schrei…““ weiter abgeschnitten, der Nagel sitzt auf dem „r“ (`z-computer-leben-werkstatt.png`).

## Ungeprüft
- 820–1199 px, 375×667, Querformat, große Schrift, Bildschirmleser, Tastatur: nicht.
- Echtes iPhone/Safari; das Abschneiden der Kugel nur in Chromium gesehen (Shader-Geometrie, vermutlich überall).
- Morgen/Mittag nicht angesehen; Nacht nur als Standbild.
