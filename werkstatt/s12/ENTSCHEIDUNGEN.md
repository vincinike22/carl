# s12 · Vitruvians Entscheidungen nach der Bau-Runde (14.10., ~19:30)

Bilder des Zusammenbaus: `werkstatt/s12/probe/10-iphone-start.png`, `10-computer-start.png` (0 Konsolenfehler).

1. **Wischen hat eine Bedeutung** (Lehre Dürer 08.10.): Die Beispiel-Reihe rollt am iPhone nicht mehr waagerecht. Am iPhone eine Spalte, senkrecht im Roller; Karten kompakter (Mini-Werkzeug + Satzzeile), damit das zweite Beispiel angeschnitten sichtbar bleibt. Am Computer ein Raster, das **ohne Rollen** mindestens drei Beispiele ganz zeigt: Tresen höher (`--c6rw-tresen` am Computer so, dass unter dem Tresen ≥ 330 px bleiben) oder Beispiel-Breite ≥ 990 px (3 Spalten). raffael + papert/rams + miyazaki stimmen das im Blatt ab; raffael entscheidet die Maße.
2. **Beispiele bauen immer sofort aus der Vorlage** (`ausVorlage`), ohne Kopf: wahr, schnell, und das Staunen gehört dem eigenen Satz. Kosten-Zeile dann `kostenVorlage`. (Rune, Frage 1 – ja.)
3. **Ein Satz je Zustand** (Rams): Bei einer Vorlage steht oben im Blatt nicht noch einmal „Vorlage“; oben ein neutraler Satz („Probier es aus. Ändern geht gleich.“ – Rune formuliert `gebautVorlage` so, dass das Wort Vorlage nur in der Kosten-Zeile steht).
4. **Kopf = eigener Rechner:** eigene Zeile `kostenLokal` ({sek}): „Dein Rechner hat gedacht, {sek} Sekunden lang. Geld kostet das keins.“ (Rune prüft Wortlaut; wahr nur, wenn `kopf==='lokal'`.) Runes fehlende Schlüssel `kostenGewartet`, `kostenDenkOhne`, `korrektur`, `berichtigt` liefert Rune nach; raffaels Ersatz bleibt Rückfall.
5. **Angekommen:** Nach dem ersten „Passt“ setzt raffael `S.du.angekommen = Date.now()` (neuer Schlüssel, nicht `fertig`). `stimme.erster`, Zuhause-Begrüßung und Lernweg prüfen in der Nacharbeit, ob ihre Sätze auch für jemanden stimmen, der nie den Rundgang hatte (`!S.du.fertig && S.du.angekommen`) – Rune nennt die betroffenen Sätze, raffael baut die Weiche.
6. **Leeres Feld:** Kern fängt es ab – bleibt so. `rezeption.leer` bleibt für die Zukunft als Schlüssel liegen.
7. **Rezeption als letzter Ort** beim Neuladen: gewollt in R0.
8. **Glocke darf Carl berühren:** beim Klingeln `C6.carl.stimmung('froh')` für ≤ 1,5 s, danach zurück (miyazaki) – Figur-Aufruf bleibt raffaels, miyazaki ruft nur `C6.carl`, wenn `C6.jetzt==='rezeption'`.
9. **„Himmel ↑“** oben rechts ist das lauteste Element des ersten Bildschirms (Rams-Stocker). Für Fremde ohne Space zeigt der Kern den Himmel-Knopf an der Rezeption nicht (raffael, Kern): Der Himmel hat für ihn noch nichts zu zeigen. Sobald ein Space existiert, ist er wieder da.
10. **Mini-„Wert“ leer** zeigt „noch nichts“ statt „–“ (werkzeug.js, raffael; gilt überall).
11. **Kalender-Farbe** `FARBEN.kalender` → Kontrast ≥ 4,5:1 (raffael, Vorschlag papert #8a6200).
12. **Prüfstand** wischt dort, wo der Mensch wischt (über dem Tresen und über dem Roller); nach Entscheidung 1 darf kein Roller mehr waagerecht rollen.

Nicht angenommen: Beispiele über einen Kopf bauen (siehe 2). Vorlagen „Oder nimm eins zum Anfang“ im Blatt: an der Rezeption weg (Rune-Mangel 3) – raffael.
