# s14 · Inventar (Geselle Rams) · 16.10.2026

Auftrag: `werkstatt/s14/AUFTRAG.md`. Kein Code geändert. Bau: `python3 tools/bau.py` (Stand dieses Abends), geprüft an `carl6-test.html`.

**Wie gesehen:** Playwright/Chromium, iPhone 390×844 (dpr 2, touch) und Computer 1440×900. Jeder Raum **leer** (frischer Otto, `{du:{fertig:true,name:'Otto'}}`) und **mit Leben** (über die echten Schnittstellen angelegt: `C6.space.neu` ×3 – „Gitarre lernen“, „Durch Portugal reisen“, „Bachelorarbeit schreiben“ –, `C6.space.zettel` ×6, ein Kernsatz, `C6.strings.knoten` Gitarre↔Bachelorarbeit, zwei Werkzeuge über `C6.werkzeug.ausVorlage`+`haenge` („Üben“ in Gitarre, „Urlaub“-Liste in Portugal); Zustand liegt in `inventar/leben.json`). Rezeption zusätzlich mit dem Schein-Kalender aus `ot_lib.py` (Mathe-Prüfung in 4 Tagen, Zahnarzt in 2). Danach echte Tipps (Touch am iPhone, Maus am Computer) auf die Dinge.
Alle Bilder: `werkstatt/s14/inventar/` (137 Dateien). Namensschema: `<raum>-<gerät>-<leer|leben>.png` (Standbilder) und `<lauf>-<gerät>-<nr>-<schritt>.png` (Klickfolgen). Sichtbare Knöpfe je Bild mit Lage und Größe: `inventar/sicht.json`, `inventar/sicht2.json`. Alle Aufnahmen um ca. 20 Uhr Ortszeit, also Tageszeit **Abend**.
Konsolenfehler: in keinem der 36 Standbilder und keiner Klickfolge (alle Listen leer).

Urteile: **trägt** · **leiser** · **weg aus dem Bild** (→ wohin die Funktion geht) · **doppelt** (wo noch) · **generisch** (warum) · **kaputt** (was genau). Ein Urteil gilt fürs Bild, nie für die Funktion: keine Funktion fällt weg (Auftrag, Antwort 2).

Rahmen, der in **jedem** Raum steht (einmal hier, nicht je Raum wiederholt):
| Ding | Wo | Urteil |
|---|---|---|
| Feld unten („Woran denkst du gerade?“ / raumeigener Platzhalter), Gesprächsknopf links, oranger Senden-Knopf | `kern.js` `.c6k-feld`, `.c6k-dk`, `.c6k-senden` | **trägt** (das eine Feld). Senden-Orange ist richtig (Handeln); im Ruhezustand blass, wirkt deaktiviert. |
| Dock: Rezeption · Zuhause · Werkstatt · Bibliothek · Garage | `kern.js` `.c6k-raumknopf` | **trägt** |
| Höhenknopf „Himmel ↑“ / „Boden ↓“ oben rechts | `kern.js:164` `.c6k-hk` | **trägt** |
| Nadel-Knopf (rote Nadel im Kreis) unter dem Höhenknopf (iPhone) bzw. unten rechts (Computer), Menü „Nadel stecken · Nachricht an die Werkstatt“ | `module/nadel.js:205` `#c6p-knopf` | **leiser / weg aus dem Bild für Fremde** (Schnitt 11): zweiter Chrome-Knopf in jedem Raum; „Nadel“ heißt in Carl schon die Entscheidungsnadel (`strings.nadel`), „Werkstatt“ heißt schon ein Raum. Ist im ausgelieferten `carl6.html` mit drin (25 Treffer). |
| Carls Sprechblase | `kern.js` `.c6k-sprech` | **trägt**; an mehreren Stellen **kaputt** (Blase vor dem Ding, s. Räume). |
| „Unser Gespräch“ (Blatt über dem Feld) | `kern.js:2323` `.c6k-vl`, Glas `kern.css:300` (`backdrop-filter:blur(14px)`) | **generisch**: Milchglas mit Unschärfe statt Papier/Tusche/Versatzschatten; einziges Blatt mit Glas. Bild `zu-iphone-03-k_c6kdk.png`. |

---

## 1 · Rezeption („Was steht an?“)
Bilder: `rezeption-*-{leer,leben}.png`, `rez-iphone-0{1..5}-*.png`, `rez-computer-0{1..5}-*.png`.

**Mitte:** das Fächerregal der sieben Tage (heute + 6). Geste: Fach antippen → Tagesblatt. Im Bild **sofort erkennbar** (iPhone oben, Computer über dem Tresen); die Zettel in den Fächern (So 18., Di 20.) lesen sich als „da steht was“. Zweite starke Stelle: der Brief im Postfach, auf den Carl zeigt („Im Postfach liegt dein Brief für heute“). Das ist gut: ein Ding (Regal), ein Satz (Brief). Beides zusammen besteht die Zehn-Sekunden-Probe.

| Ding | Datei / Klasse | Urteil |
|---|---|---|
| Fächerregal, 7 Fächer mit Tagesschild | `rezeption.welt.js` `.c6rw-regal`, `.c6rw-fach` | **trägt** (Mitte) |
| Schild „heute 16.“ in Rot unterstrichen | `.c6rw-fach` / `.c6rw-schild` | **Farbe falsch**: Nadelrot markiert „heute“, keine Entscheidung (Querschnitt c) |
| Zettel im Fach (Termin) | `.c6rw-legt` | **trägt** |
| Tagesblatt „Heute · 16. Oktober“ mit Feld „z. B. Mathe-Prüfung“ und schwarzem „Eintragen“ | `rezeption.js` `.c6rz-tagesblatt` | **trägt**. Platzhalter in Caveat (Carls Handschrift) für Ottos Eingabe – Schriftregel (Querschnitt b). Bild `rez-iphone-04-k_c6rwfach.png` |
| Brief im Postfach „an Otto“ | `rezeption.js` `.c6r-a-brief` | **trägt** (Morgenbrief) |
| Brief offen: liniertes Blatt in Caveat, „Woher ich das weiß: dein Kalender.“ sehr blass; darunter Chips „Ja, bitte“ / „Später“ (Karteikarten) | Brief-Blatt in `rezeption.js` | **trägt**; Herkunftszeile **leiser als lesbar** (Kontrast zu gering, `rez-iphone-03-k_c6rabrief.png`) |
| Carl hinter dem Tresen | Figur | **trägt** |
| Tischglocke („Ja? Ich bin da. Sag mir einen Satz.“) | `.c6rw-glocke` | **trägt als Ding zum Denken**, aber Handlung **doppelt** zum Feld (beides: „sag mir einen Satz“). Bleibt (Magie), braucht keinen eigenen Satz, der das Feld wiederholt. |
| Tasse mit Dampf | `.c6rw-tasse`, `.c6rw-dampf` | Kulisse, **leiser ok** (still) |
| Wanduhr | `.c6rw-uhr` | Kulisse; ob sie die echte Zeit zeigt: **ungeprüft** (zeigte ca. 20:00) |
| Topfpflanze oben auf dem Regal / großer Topf rechts (Computer) | `rezeption.welt.js` | Kulisse, **trägt** (Grün = Wachstum, ruhig) |
| Lampe über dem Regal | `rezeption.welt.js` | Kulisse |
| Lichtfleck des Fensters auf der Wand (abends kräftig orange) | `.c6rw-fleck`, `rezeption.welt.css:12` (`--fleck:rgba(247,170,104,.5)`) | **leiser**: abends die größte orange Fläche im Bild, größer als jedes Handeln-Orange |
| Fenster (Computer links, Stadt bei Abend) | `.c6rw-himmel`, `.c6rw-stadt` | Kulisse, **trägt** (Tageszeit) |
| Teppich mit Rauten | `.c6rw-boden` | Kulisse, **leiser ok** |
| Feld-Platzhalter „Was soll ich dir bauen?“ | `rezeption.js` | **trägt** laut Grundkonstrukt („Sag mir einen Satz, ich bau dir was“); spricht aber das Werkstatt-Verb. Für Vitruvian: gewollt so? |

**Harness-Teil:** Zeitpläne/Heartbeat (Morgenbrief), Kanal Kalender (Connector), Vorbereitungen (ein Werkzeug auf Tipp). Doppelt anderswo: „Sag mir einen Satz, ich bau dir was“ steht auch in der Werkstatt (Feld „/ für ein Werkzeug“, Wand „Neues Werkzeug“). „Das hab ich mir gemerkt“ (Grundkonstrukt) war in diesen Bildern nicht zu sehen – **ungeprüft**, ob es erst nach einem Bau erscheint.

---

## 2 · Zuhause („Deine Gedanken“)
Bilder: `zuhause-*-{leer,leben}.png`, `zu-*-0{1..4}-*.png`, `knaeuel-*.png`.

**Mitte:** das Brett mit den Spaces (Schlüsselanhänger mit Pflanzenstufe). Geste: Anhänger antippen → Space. Im Bild **erkennbar am Computer** (Brett oben mittig), **am iPhone schwächer**: das Brett liegt ganz oben, die Mitte des Bildes ist Carl auf der Couch (riesig, 2/3 der Höhe). Leer zeigt das Brett nur die Karte „+ Neuer Space“ – die Mitte ist dann nicht „deine Gedanken“, sondern ein Knopf.

| Ding | Datei / Klasse | Urteil |
|---|---|---|
| Brett mit Space-Anhängern, Pflanze je Space, „+1“-Überlauf (iPhone) | `zuhause.js` `.c6z-sb-brett`, `.c6z-sb-schl`, `.c6z-sb-pflanze` | **trägt** (Mitte). iPhone: nur zwei Anhänger + „+1“ – der dritte Gedanke ist versteckt. |
| Karte „+ Neuer Space“ am Brett (orange) | `.c6z-sb-schl` | **doppelt** mit Knäuel (gleiche Handlung), mit „Neuer Space“ in der Spaces-Liste (`space.js:~2009`) und „Neuer Planet“ im Himmel (Schnitt 9) |
| Knäuel auf dem Teppich (rollt, roter Faden, „Ein Satz, und es wird ein Space.“) | `zuhause.js:196`, `:786–916` `.c6z-knaeuel` | **trägt als Magie**, Handlung **doppelt** zur Karte; der Faden ist **Nadelrot** (Querschnitt c). Bild `knaeuel-iphone-02-*.png` |
| Wandkalender „Dein Wochenende“ (roter Kopf, Häkchen grün) → Blatt mit 6 Schritten | `zuhause.js:743`, `module/lernweg.js` | **doppelt** mit Quest-Tafel und Rad in der Garage (drei Fortschrittssysteme, Schnitt 5). Roter Kopf: Nadelrot ohne Entscheidung. |
| Fenster mit Tageszeit, Tasse, Pflänzchen | `.c6z-ding` „Fenster“ | Kulisse, **trägt** |
| Stehlampe (knipsbar, aus dem Katalog tauschbar) | `zuhause.js:189,345–413` `.c6z-lampe` | **trägt** |
| Sessel (Tipp: „Einen anderen holst du dir im Katalog in der Garage“) | `zuhause.js:764–783,867` | **trägt**; erfüllt E1 schon (ein Satz, Verweis Garage) |
| Couch mit Carl, Teppich | Figur/Kulisse | **trägt** (Darsteller) |
| Tür „Werkstatt“ | `.c6z-ding` aria „Werkstatt“ | **doppelt** mit Dock-Knopf Werkstatt |
| Computer: Bild „Zum Fahrrad“ und Wandregal „Zur Bibliothek“ | `zuhause.js:184–185` `.c6z-bild`, `.c6m-regal` | **doppelt** mit Dock (Garage, Bibliothek); **kaputt** am Computer leer: der Wochenend-Kalender hängt **vor** dem Bild „Zum Fahrrad“ (`zuhause-computer-leer.png`, Bild schaut links hinter dem Kalender hervor) |
| Topfpflanze (Computer) | Kulisse | trägt |
| Konstante `HEFT` (Katalog-Heft auf dem Sessel) | `zuhause.js:65–70` | **toter Code**: nur definiert, nirgends benutzt (grep) – beim Schnitt E1 mit aufräumen |

**Harness-Teil:** Sitzungen/Projekte (Spaces), Gespräch (Sitzungsverlauf, „Unser Gespräch“), Lernweg (Onboarding). Spaces tauchen auch im Himmel (Planeten), im Katalog („Für deine Spaces“), im Buch („Woran du baust“) und in der Spaces-Liste auf – als Anzeige ok; **anlegen** an vier Stellen ist zu viel.

---

## 3 · Werkstatt („Bau mir was“)
Bilder: `werkstatt-*-{leer,leben}.png`, `wst-*-0{1..5}-*.png`, `kiste-*-0{1..3}-*.png`.

**Mitte:** die Lochwand mit Gerüsten und der Karte „Neues Werkzeug“, darunter „Deine Werkzeuge“. Geste: „Neues Werkzeug“ antippen (oder einen Satz ins Feld) → Blatt „Was soll dein Werkzeug können?“ mit Vorlagen. **Erkennbar** – die Wand ist das größte Ding, das „+“ ist orange (Handeln). Gut. Aber auf der Wand hängen drei fertige Gerüste („Zwei Wege“, „Wochenrückblick“, „Skizze“) gleichrangig neben „Neues Werkzeug“; ein Fremder liest „vier Werkzeuge“, nicht „bau eins“.

| Ding | Datei / Klasse | Urteil |
|---|---|---|
| Lochwand, Schild „für „Bachelorarbeit schrei…““ (Space-Wahl) | `werkstatt.js` `data-id="fuer"` | **trägt**; **kaputt**: Name abgeschnitten, das Schild liegt am iPhone über der Fensterbank, am Computer überdeckt ein Punkt das „fü“ (`werkstatt-computer-leben.png`) |
| Gerüste „Zwei Wege“, „Wochenrückblick“, „Skizze“ | `werkstatt.js` (Gerüst-Karten) | **doppelt**: „Zwei Wege“ und „Wochenrückblick“ liegen auch als Sterne im Teleskop; dazu die Vorlagen „Gewohnheit/Termin…“ im Neues-Werkzeug-Blatt (`werkzeug.js:103` `VORLAGEN`). Drei Orte für „fertige Beispiele“ (Schnitt 8). Wochenrückblick-Symbol: roter Kreis = Nadelrot für „heute“. |
| Karte „Neues Werkzeug“ (+ orange) | `werkstatt.js` | **trägt** (Mitte) |
| Leiste „Deine Werkzeuge“ (Haken-, Listen-Symbol) / leer „Hier hängen bald deine Werkzeuge“ | `werkstatt.js` | **trägt** |
| Blatt „Neues Werkzeug“: „Was soll dein Werkzeug können? Schreib es unten ins Feld“ + Vorlagen | `werkzeug.js` | **trägt**; Blatt-Sprache gut (Papier, Tusche, Versatz) |
| Werkzeug groß (Üben): Kopf „Werkzeug · steht in „Gitarre lernen“ · seit 16. Oktober“, Tagesringe, „Dein Satz“, vier Wochen, Carl-Satz, „Dein letzter Zettel dort“ | `werkzeug.js` `.c6wz-werkzeug` | **trägt**; roter Kreis um heute im Monatsraster (Nadelrot) und rote Linie unter „Dein letzter Zettel dort“ (Querschnitt c). Bild `wst-iphone-04-*.png` |
| Ferdl am Schreibtisch, Name „Ferdl“ in Caveat, Lupe | `werkstatt.js` `data-id="lupe"` | **trägt** (Helfer). Blatt „Nachlesen lassen“ mit „Auftrag geben“ – gut; unten Link „Dein Wochenende“ ohne Bezug **weg aus dem Blatt** (Wochenende wohnt im Zuhause). Bild `wst-iphone-03-*.png` |
| Hobelbank mit Wasserwaage, Stifte, Heft „Katalog“ (aufgestellt) | `werkstatt.js:1616–1631` `.c6w-heft` (`data-id="heft"`), `data-id="waage"`, `"stift"` | Waage/Stifte: Magie, **leiser ok**. **Heft: weg aus dem Bild** (E1) → Lampen „Für die Werkstatt“ im Garage-Katalog |
| Sägebock („sägt ein Stück“) | `data-id="saege"` | Magie, leiser ok |
| Werkzeugkiste (auf/zu) | `data-id="kiste"` | Magie ohne Funktion, **leiser** (am iPhone unten links im Bild, groß, rot-braun) |
| Werkstattlampe (knipsbar, aus Katalog) | `data-id="lampe"`, `werkstatt.js:1809–1813` | **trägt** |
| Fenster („draußen ist Abend“) | `data-id="fenster"` | Kulisse, trägt |
| Späne am Boden | `data-id="wurf"` | Kulisse |
| Feld-Platzhalter „Woran denkst du? / Werkzeug“ (iPhone) bzw. „… Oder / für ein Werkzeug“ (Computer) | Kern/Werkstatt | **generisch** für Fremde: Schrägstrich-Befehl ist Bastler-Syntax im Platzhalter |

**Harness-Teil:** Werkzeuge (Tools/Skills bauen), Helfer (Subagent Ferdl), Vorlagen (Skill-Sammlung). Doppelt: Beispiele im Teleskop; Helfer auch als Space-Karte „Für dich arbeiten lassen“ und Wochenende-Schritt 5 (als Weg dorthin ok, wenn alle in **dasselbe** Ferdl-Blatt führen – **ungeprüft**). Die Schreibstube (Morgenbrief · Bote · Helfer mit Ausschalter, Grundkonstrukt) ist im Bild nicht als drei Tische zu sehen; nur Ferdl.

---

## 4 · Space („Benutz dein Ding“)
Bilder: `space-*-{leer,leben}.png`, `spgit-*-0{1..5}-*.png`, `sptitel-*-0{1..3}-*.png`.

**Mitte (laut Verb):** das eigene Werkzeug. **Im Bild nicht die Mitte.** Mitte ist Carl auf dem Ort-Möbel; das Werkzeug „Üben“ liegt am iPhone als kleine Karte im unteren Drittel und wird von Carls Blase überdeckt (`spgit-iphone-02-js.png`). Um Carl herum konkurrieren zwölf Dinge: Schild mit Space-Namen, Leine mit Zetteln, Kernsatz-Zettel, „+2“, Perlen, Ding „Sternbild mit …“, Pflanze, Katalog-Kiste, Schild „Nächster Schritt“, Werkzeugkarte, vier Vorschlagskarten, Chip „Später“. Zehn-Sekunden-Probe: man versteht „mein Ort mit Zetteln“, nicht „hier benutze ich mein Ding“.

| Ding | Datei / Klasse | Urteil |
|---|---|---|
| Schild „Gitarre lernen ⌄“ (Holz, öffnet „Deine Spaces“) | `space.js:1110` `.c6k-sp-titel` | **trägt** |
| „‹ Zuhause“ oben links | `.c6k-fd-hoch` | trägt (Rückweg); Dock zeigt gleichzeitig „Zuhause“ aktiv – ok |
| Leine mit Zetteln (Caveat), Kernsatz-Zettel „Der Kernsatz fehlt noch.“ mit Nadel, „+2“, „+ Etwas aufhängen“ | `.c6z-sp-leine`, `.c6z-sp-zettel`, `.c6z-sp-kern` | **trägt** (Gedächtnis des Space). Leer ist die Leine **Nadelrot** (`space-computer-leer.png`) |
| Perlen auf der Leine (blau, Space-Farbe) | `.c6z-sp-perle` | trägt, leiser ok |
| Ding am Boden „Sternbild mit „Bachelorarb…““ (gefaltetes Blatt) | `.c6z-sp-ding`, `space.js:~375` `dingBild` | **leiser**; Name **abgeschnitten**; rote Unterlinie (Nadelrot für eine Verbindung) |
| Pflanze im Topf (Samen→Blüte) | `.c6z-sp-pflanze` | **trägt** (Grün = Wachstum, eine Wahrheit mit Brett und Himmel) |
| **Katalog-Kiste** (Holzkiste, Heft mit rotem Kopf, pulsiert „neu“) | `space.js:168–177` `KISTE`, `:618–620` `.c6z-sp-katalog`, `:1713–1734` | **weg aus dem Bild** (E1) → Einrichten über „Deine Spaces › Einrichten“ und das Register „Für deine Spaces“ im Garage-Katalog |
| Blatt „Einrichten“ (aus der Kiste): roter Kopfstreifen, 8 Reiter als unterstrichene Wörter, Kacheln mit Münzpreis, „Fertig“ schwarz mit orangem Schatten | `module/einrichten.js` `.c6e-blatt` (nicht `.c6e-heft`) | **doppelt** mit dem Katalog-Heft (zweite Katalog-Oberfläche, andere Sprache) und **generisch** (Versandhaus-Reiter). Bild `spgit-iphone-03-*.png` |
| Schild „Nächster Schritt · Was ist der nächste Schritt?“ (gestrichelt) | `.c6z-sp-schritt` | **trägt**; überschneidet sich mit der Karte „Machen“ (beide: das Nächste tun) – **ungeprüft**, ob sie dasselbe auslösen |
| Werkzeugkarte „Üben · heute ○“ am Pfosten | `.c6z-sp-wz`, `.c6z-sp-pfosten` | **trägt – gehört in die Mitte** (Schnitt 6) |
| Vier Karten „Weiterdenken · Machen · Für dich arbeiten lassen · Verbinden“ mit Erklärzeile + „Los“ | `module/vorschlaege.js` `.c6vs-karte` | **trägt** (Grundkonstrukt), **leiser**: vier gleich laute Karten ständig im Bild; **doppelt** im Himmel-Planetenblatt |
| Chip „Später“ | `kern.js` `.c6k-chip` | trägt (Antwort auf Carls Frage) |
| Carl auf dem Ort-Möbel, Ort-Kulisse (Musikzimmer: Notenpult, Plattenspieler, Lampe, Vorhang, Noten) | `space.orte.js`, `space.js` | **trägt** (Magie, Monde = Orte) |
| Blase „Ein Satz zu „Bachelorarbeit schreiben“…“ im Space „Gitarre lernen“ | Kern-Blase | **kaputt (nur über API gesehen)**: nach `C6.space.oeffne(...)` blieb Carls Frage aus dem vorigen Space stehen. Mit echtem Tipp über „Deine Spaces“ war der Satz richtig (`sptitel-iphone-03-*.png`). |
| Blatt „Deine Spaces“: **drei orange gefüllte Großknöpfe** „Ort wechseln · jetzt Schreibtisch“, „Einrichten“ (mit Schloss), „Neuer Space“ über der Liste | `space.js:1938–2010`, `kern.css:2419` `.c6k-sp-neu` | **leiser** (Schnitt 10): dreimal lautes Orange, die Liste (das Ding) rutscht unter die Knöpfe. „Neuer Space“ hat links leeren Raum (Symbol fehlt?, `sptitel-iphone-02-*.png`) – **kaputt?** ungeprüft |

**Harness-Teil:** Arbeitsbereich mit eigenem Gedächtnis (Zettel, Kernsatz), angebundene Werkzeuge, die vier Wege des Harness (Lernschleife/Weiterdenken, Werkzeug/Machen, Helfer+Zeitplan/Für dich arbeiten lassen, Verbindung/Verbinden). Doppelt: die vier Karten im Himmel; Einrichten an zwei Stellen (Kiste, Liste) plus Garage-Katalog.

---

## 5 · Bibliothek („Was weißt du über mich?“) mit Lesesaal und Buch
Bilder: `bibliothek-*-{leer,leben}.png`, `bib-*-0{1..4}-*.png`, `lesesaal-*-{leer,leben}.png`.

**Mitte (laut Verb):** das Freundschaftsbuch auf dem Lesetisch. **Im Bild nicht die Mitte**: Das Regal füllt am iPhone 55 % der Höhe, das stärkste Ding darin ist das blaue Lexikon (Tür zum Lesesaal, goldener Kompass); das Buch liegt klein und rosa im unteren Drittel neben Sanduhr, Lampe und Tee. Geste „Buch antippen → aufschlagen“ funktioniert, und das offene Buch ist schön und klar (Seiten „Du“, „Carl“, Reiter) – genau das, was nico als nicht-generisch bestätigt hat.

| Ding | Datei / Klasse | Urteil |
|---|---|---|
| Freundschaftsbuch (Herz, rotes Lesezeichen) → offenes Buch, Reiter Du · Carl · Damals · Was ich weiß | `bibliothek.js` `data-id="atlas"`, `module/atlas.js:954` `REITER`, `.c6r-at` | **trägt (Mitte), aber zu klein**. Herz + Lesezeichen in Nadelrot. Laut E5 soll es das Verzeichnis des Ganzen werden; heute fehlen die Seiten „was Carl kann / für dich tut / wer mitdenkt / wo du ihn erreichst“ (es gibt nur `NAMEN` du/carl/damals/wissen/schluessel, `atlas.js:755`) |
| Blaues Lexikon („Zieh daran“ → Tür, Lesesaal) | `data-id="lexikon"` | **trägt** als Tür, **leiser** (zieht das Auge vom Buch weg) |
| Buch „Was an der Wand hängt“ im Regal → Blatt mit Bildern, Künstler, Museum | `data-id="bildbuch"` | trägt (Magie, Fakten). Blatt: brauner Lederrahmen, X innen – eigene Blattsprache (Querschnitt b) |
| **Katalog-Heft** am Ende des untersten Fachs | `bibliothek.js:653–660` `.c6w-katalog`, `:1349`, `:1833` | **weg aus dem Bild** (E1) → Lampen „Für die Bibliothek“ im Garage-Katalog |
| Vier Bilder „mit Carl“ (Computer), eins am iPhone | `bibliothek.js` Galerie | trägt (Magie) |
| Fenster (Tag/Nacht), Schnitzwerk am Schrank | `data-id="fenster"` | Kulisse |
| Leselampe (knipsbar, Katalog), Sanduhr (misst), Tasse Tee | `data-id="lampe"`, `"ding:sanduhr"` | Magie, leiser ok |
| **Roter Faden am Boden** (vom Regal zu Carl) | `bibliothek.js:1061` `.c6w-rfaden` `stroke="#d62a26"` | **leiser / Farbe falsch**: Nadelrot ohne Entscheidung, ohne Funktion |
| Roter Teppich | Kulisse | leiser ok |
| Lesesaal: Reihe „Deine Meister“ (5 Karten „?“ + „Dein Platz“), Tisch „Deine Funde“, Kerze, Leiter, Lichtkegel | `lesesaal.js` | **trägt**; Blase „Dein Lesesaal…“ liegt **vor** der Meister-Reihe (`lesesaal-iphone-leben.png`) – **kaputt** (Blase vor Ding). „Deine Funde“ **doppelt** mit Funden als Zettel im Space (Ferdl) – als Ansicht ok. |

**Harness-Teil:** Gedächtnis (USER/MEMORY: „Was ich von dir weiß“), Persona (Seite „Carl“: Ton), Rechte („Wer bei uns was darf“), Funde von Helfern (Lesesaal). Doppelt: Rechte auch als Quests „Sagen, was ich auf deinem Rechner darf“ / „Mich mit deinem Rechner verbinden“ (Garage) und das UFO.

---

## 6 · Garage = `fahrrad` („Schau, was du kannst“; Katalog liegt hier)
Bilder: `fahrrad-*-{leer,leben}.png`, `garage-*-0{1..8}-*.png`, `rad-*-0{1..3}-*.png`.

**Mitte (laut Grundkonstrukt):** das Rad als Fähigkeiten-Landkarte. **Im Bild nicht als Landkarte erkennbar:** Im leeren Zustand ist das Rad **vollständig** gezeichnet (`fahrrad-iphone-leer.png`); ein Teil antippen öffnet ein **Gestaltungsblatt** („Rahmen · Form · Farbe“, „Lenker · Form · Griffe“), keine Challenge. Im Code gibt es keine Challenge-Logik am Rad (`fahrrad.js` grep „challenge/freigeschalt“: nichts; nur Münzpreise `:688`). Die Challenges stehen auf der **Quest-Tafel** (9 Quests, „2 von 9“). Dazu Schrank, Spiegel, Kieselpark-Tor, UFO, Münzglas, Katalog, Werkbank: acht Dinge mit eigener Geste. „Schau, was du kannst“ hat zwei Mitten (Rad und Tafel).

| Ding | Datei / Klasse | Urteil |
|---|---|---|
| Rad auf dem Montageständer, 10 Punkte (44 px) | `fahrrad.js` `.c6s-f-rad`, `.c6s-f-pkt` | **trägt**, aber nicht als Landkarte (s. oben). Blase „Dein Rad. Tipp es an.“ liegt am iPhone **über** dem Rad (Oberrohr) |
| Teil-Blatt „Rahmen“/„Lenker“ (Form, Farbe; Fähnchen = gesperrt) | `.c6s-f-blatt` | **trägt** (Gestalten). Am Computer: X hat orangen Ring (vermutlich Fokus nach Esc) |
| Quest-Tafel (Kreidetafel, gelbe Häkchen) → Blatt „Quests · 2 von 9“ mit Münzen | `fahrrad.js:452` `.c6s-g-tafel`, `.c6s-g-tafelblatt`, `module/quest.js` | **doppelt** mit Rad (Landkarte) und „Dein Wochenende“ (Zuhause). Häkchen **gelb**, im Wochenende **grün**: „geschafft“ hat zwei Farben |
| Kieselpark-Tor mit großem schwarzem Schild + orangem Versatz | `.c6s-g-tor`, `.c6s-g-schild` | trägt (Spiel); Schild **leiser** – am iPhone größer als das Tor selbst |
| Carls Schrank + Spiegel → Blatt „Was magst du?“ (Socken, Mützen …) | `.c6s-g-ding`, `.c6s-g-kleid`, `laden.js` | trägt (Magie, Belohnung) |
| UFO (Schloss) → „Das UFO schläft. Es wacht auf, wenn dein Rechner mir einmal Hallo sagt.“ + „Zeig mir, wie“ | `.c6s-g-ufo`, `fahrrad.js:848` | trägt; Harness „Gerät/Node“ – **doppelt** mit Quest „Mich mit deinem Rechner verbinden“ und Rad-Teil „Hinterrad = Carl auf dem Mac“ (Grundkonstrukt) |
| Münzglas („8 Münzen im Glas.“) | `.c6s-g-glas` | trägt (leise) |
| **Katalog-Heft** am Spiegelfuß (klein) → Heft „Katalog“ | `fahrrad.js:450,487–492` `.c6s-g-heft`, `einrichten.js:323` `HEFT_SVG` | **trägt – der eine Ort** (E1). Heft selbst **generisch** (Querschnitt a/b). Am Ding: roter Rücken (Nadelrot) |
| Werkbank mit Lochwand, Hängelampe | `.c6s-g-bank` | Kulisse; am iPhone fast ganz verdeckt (Carl, Spiegel) – ok |

**Harness-Teil:** Fähigkeiten/Lernschleife (Rad, Quests), Belohnung (Münzen, Schrank, Park), Personalisierung (Katalog), Gerät koppeln (UFO). Doppelt: Fortschritt dreimal (Rad, Tafel, Wochenende); Rechner-Kopplung dreimal (UFO, Quest, Rad-Teil).

---

## 7 · Himmel = `netz` („Sieh von oben“)
Bilder: `netz-*-{leer,leben}.png`, `himmel-*-0{1..4}-*.png`.

**Mitte:** „Du“ als Sonne, Spaces als Planeten auf Bahnen, Monde = Orte des Space, ein roter Bogen = Sternbild (Knoten) mit Satz. Geste laut Blase: „Tipp einen Planeten an, dann schauen wir ihn von oben an.“ **Was man hier tut, bleibt unklar** (nicos Befund bestätigt): (1) Der Tipp öffnet ein dunkles Blatt, das am iPhone die untere Hälfte deckt – **der angetippte Planet verschwindet hinter dem Blatt**, „von oben sehen“ sieht man also gerade nicht (`himmel-iphone-02/03-*.png`). (2) Das Blatt wiederholt die **vier Karten des Space** und hat als Hauptknopf „Hineingehen“ – also: zurück auf den Boden. (3) Zeichen ohne Erklärung: schwarze Plaketten auf den Planeten (Pflanzenstufe: Punkt, Knospe, Keim), Monde, Bahnen in Space-Farbe. Die eine eigene Tat des Himmels (Planeten verbinden = Sternbild, Grundkonstrukt Lenker-Challenge „zwei Spaces verbunden“) hat **kein sichtbares Ding** – ungeprüft, ob sie per Ziehen geht.

| Ding | Datei / Klasse | Urteil |
|---|---|---|
| Sonne „Du“, Carl auf Mini-Couch an der Bahn | `netz.js` (Canvas) | trägt; am Computer verdeckt Carl die Beschriftung „Du“ halb |
| Planeten mit Namen | `netz.js:617–706` `kuerze()` | trägt; Namen **abgeschnitten** („Durch Portugal reis…“, „Bachelorarbeit schr…“) – **kaputt** am iPhone und Computer |
| Plaketten auf Planeten (Pflanzenstufe) | `netz.js` | **leiser / unerklärt** (eine Wahrheit mit Space-Pflanze – gut –, aber schwarzer Kreis liest sich als Knopf) |
| Monde (Orte), Monde-Namen nur am angeflogenen Planeten (`netz.js:785`) | `strings.js:145` `monde` | leiser ok |
| Roter Bogen + Satz „„Beides braucht jeden Tag ein bisschen.““ in rosa Kursiv | `netz.js`, `strings.knoten` | **trägt** (Sternbild), **Farbe falsch** (Nadelrot für Verbindung), Satz am iPhone abgeschnitten („Beides brauch…“) |
| „+ Neuer Planet“ / leer „Dein erster Planet“ | `.c6w-knopf` (iPhone: Knopf 1×48 px laut Messung!) | **doppelt** (vierter Ort für „neuer Space“); Trefferfläche des Knopfs am iPhone **kaputt?** (1 px breit gemessen, Kreis daneben gezeichnet) – ungeprüft, ob der Canvas den Tipp nimmt |
| Teleskop unten rechts (Fernrohr + Wort) | `.c6w-h-teleskop` | trägt |
| Blase oben „In der Mitte bist du …“ / leer „Noch still hier oben. Woran denkst du gerade?“ (navy mit lila Rand) | Kern-Blase Nachtvariante | trägt |
| Planetenblatt „Von oben · seit 16. Oktober · Gitarre lernen“: Pflanze, „Ein Keim“, „Zuletzt · 16. Oktober“ (olivgrau, sehr schwach auf Navy), Satz zum Sternbild, „3 Zettel von dir und ein Werkzeug, noch kein Kernsatz. Ein nächster Schritt fehlt.“, vier Karten, „Hineingehen“ | `netz.js:1874–1881` `.c6w-blatt`, `.c6w-oben-hin` | **Mitte verdeckt / doppelt / kaputt**: deckt den Planeten, Karten doppelt zum Space, Kontrast der Kopfzeilen zu gering. Der Zählsatz („3 Zettel … ein Werkzeug … Schritt fehlt“) ist das Wertvollste – das *ist* „von oben“ |
| Kein Dock-Feld im Himmel (kein Eingabefeld) | Kern | ok (Höhe ohne Feld) |

**Harness-Teil:** Übersicht über alle Sitzungen/Projekte und ihre Verbindungen (Graph). Doppelt: Space-Vorschläge; Anlegen eines Space.

---

## 8 · Teleskop
Bilder: `teleskop-*-{leer,leben}.png`, `tele-*-0{1..3}-*.png`.

**Mitte:** die runde Linse voller Sterne; jeder Stern ist ein Beispiel-Werkzeug („Prüfungsfahrplan“, „Erstes Gespräch“, „Lied in drei Abenden“, „Wochenrückblick“, „Leere Seite“, „Zwei Wege“, „Kiste für Kiste“). Geste: Stern antippen → Vorschau „Beispiel von mir · 3 Schritte … Übernehmen“.
**Kaputt (schwer):** Die Sterne sind **unsichtbar**. Die Linse zeigt nur Pünktchen, obwohl sieben Knöpfe darin liegen (Messung `sicht.json`; ein blinder Tipp öffnet die Vorschau, `tele-iphone-03-*.png`). Ursache gefunden: `src/raeume/bibliothek.css:70` setzt global `.c6w-sterne{opacity:0}` (gemeint für die Nachtsterne im Bibliotheksfenster, nur unter `.c6w-bibliothek[data-tageszeit=nacht]` wieder 1); das Teleskop benutzt dieselbe Klasse (`teleskop.js:18` `<div class="c6w-sterne">`). Nachgemessen: `.c6w-sterne` opacity 0 im Teleskop, Stern selbst opacity 1. Ein Fremder sieht eine leere Linse und den Satz „Hier liegen Werkzeuge … Nimm mit, was dich anstößt.“ – der nicht stimmt, solange man nichts sieht.

| Ding | Datei / Klasse | Urteil |
|---|---|---|
| Linse mit Ring und Kerben | `teleskop.js` `.c6w-rohr` | trägt |
| Sterne (Beispiel-Werkzeuge) | `teleskop.js:99` `.c6w-stern`, `kern.css:2674` | **kaputt** (unsichtbar, s. oben); **doppelt** mit den Gerüsten an der Werkstatt-Wand und den Vorlagen im Neues-Werkzeug-Blatt |
| Etikett „von dir“ an eigenen Sternen in Orange | `kern.css:2686` `.c6w-eigen .c6w-stern-art{color:#f08a4b}` | **Farbe falsch** (Orange als Etikett, kein Handeln) |
| Vorschau „Beispiel von mir · 3 Schritte · Bauplan · Übernehmen“ | `teleskop.css:2` `.c6w-t-vorschau` | trägt; Blatt-Sprache Navy (eigene Nachtfassung) |
| Carl auf Mini-Couch am Rand | Figur | trägt |
| „‹ Himmel“ + „Boden ↓“ | `.c6k-fd-hoch`, `.c6k-hk` | trägt (zwei Rückwege, verschieden: ok) |

**Harness-Teil:** geteilte/fertige Fähigkeiten (das, was bei den Vorbildern ein Skill-Verzeichnis ist). Doppelt: Werkstatt-Wand, Neues-Werkzeug-Blatt.

---

## Querschnitt (a) · Wo der Katalog im Bild auftaucht

| # | Ort | Ding | Datei : Zeile | Öffnet | E1 |
|---|---|---|---|---|---|
| 1 | Garage | Heft lehnt am Spiegelfuß (`.c6s-g-heft`, Bild aus `C6.einrichten.heft`) | `raeume/fahrrad.js:450`, `:487–492`; Zeichnung `module/einrichten.js:321–325` (`HEFT_SVG`, roter Rücken `#d62a26`) | Heft `c6e-heft` (`einrichten.js:756 ff.`) mit Inhaltsverzeichnis und 5 Registern | **bleibt** (der eine Ort) |
| 2 | Bibliothek | Heft lehnt am Ende des untersten Fachs (`.c6w-katalog`, `data-id="katalog"`) | `raeume/bibliothek.js:653–660`; Staunen `:1349`; `katalogAuf` `:1833`, `tippe` `:1842` | Heft, aufgeschlagen bei „Für die Bibliothek“ | weg |
| 3 | Werkstatt | Heft aufgestellt auf der Hobelbank (`.c6w-heft`, `data-id="heft"`) | `raeume/werkstatt.js:1616–1631`; Staunen `:1133` | Heft bei „Für die Werkstatt“ | weg |
| 4 | Space | Holzkiste mit Heft (`.c6z-sp-katalog`), pulsiert bei neuen Münzen | `raeume/space.js:168–177` (`KISTE`), `:618–620`, `:1713–1734`; Carls Hinweissatz `:2249–2251`; „vom Katalog im Zuhause hergeschickt“ `:2309` | **anderes** Blatt: „Einrichten“ (`c6e-blatt`, 8 Reiter) | weg (Funktion: Liste „Deine Spaces › Einrichten“ `space.js:2009` + Register „Für deine Spaces“ im Heft) |
| 5 | Garage → Heft → „Für deine Spaces“ | Kacheln je Space („Schreibtisch · 7 Dinge“) | `module/einrichten.js:577–588` | springt in den Space und öffnet dort das Einrichten-Blatt | bleibt (Weg vom einen Katalog in den Space) |
| 6 | Zuhause | Sessel-Satz „Einen anderen holst du dir im Katalog in der Garage“ | `raeume/zuhause.js:771`, `:783`, `:867` | – (Verweis) | bleibt (erfüllt „höchstens einmal sagen“) |
| 7 | Zuhause | Konstante `HEFT` (Heft auf dem Sessel) | `raeume/zuhause.js:65–70` | **unbenutzt** (toter Code) | aufräumen |
| 8 | Garage | UFO einrichten (`C6.einrichten.oeffne({ort:'ufo'})`) | `raeume/fahrrad.js:848`, `:899` | Einrichten für das UFO | **ungeprüft** (UFO verschlossen) |

Zwei Katalog-Oberflächen also: das **Heft** (1–3, 5) und das **Einrichten-Blatt** (4, über 5 auch von der Garage aus). Kette heute: Garage-Heft → Register Spaces → Space → Einrichten-Blatt. Für E2 heißt das: beide Oberflächen brauchen dieselbe neue Sprache, oder das Einrichten-Blatt wird eine Seite des Hefts.

Was am Heft **generisch** ist (gesehen in `bib-iphone-02`, `wst-iphone-02`, `garage-*-02`): roter Einband als Rahmen um das ganze Blatt (`einrichten.css:91` `--e-einband:#c23d30`), roter Deckelrücken (`:205` `#d62a26`); fünf bunte Register-Reiter (`einrichten.js:762–767`: `#a9bf8f`, `#e8c26e`, `#9db5aa`, `#d39a7c`, `#bfa9d8`); Produktfotos in Studiorahmen mit Lichtverlauf und Bodenkante (`einrichten.css:119–132` `.c6e-rahmen`, `.c6e-rahmen-licht`, `.c6e-rahmen-foto`); roter Stempel „LEUCHTET“ mit Doppelrand und Stempel-Animation (`:144–148` `.c6e-stempel`, `--e-stempel:#b23a1e`); Eselsohren mit Pfeilen; Seitenzahl kursiv; Namen brechen falsch („Bachelorarbei / schreiben“, `garage-iphone-02-*.png`). Was schon in der Sprache ist: Papierton, Tusche-Plakette mit Münze (`.c6e-plakette`), Fraunces-Namen, Caveat-Satz „Die Lampe auf dem Lesetisch. Tipp eine an.“ (Carls Hand – richtig).

## Querschnitt (b) · Blätter und Overlays über dem Bild

Maßstab (Designsprache): Papier `#fbf7f0`, Tusche-Rand 1,5 px, harter Versatzschatten, Fraunces-Titel, Figtree-Text, Schließen-X innen oben rechts.

| Blatt | Datei / Klasse | Spricht die Sprache? |
|---|---|---|
| Tagesblatt (Rezeption) | `rezeption.js` `.c6rz-tagesblatt` | **ja** (Maßstab). Nur: Platzhalter in Caveat |
| Brief (Rezeption) | `rezeption.js` | ja, eigene Briefform (liniert, Caveat = Carls Hand) – gewollt |
| Neues Werkzeug / Werkzeug groß | `module/werkzeug.js` | **ja** |
| Ferdl „Nachlesen lassen“ | `raeume/werkstatt.js` (Auftrag selbst: `module/auftrag.js`) | **ja** |
| Dein Wochenende | `module/lernweg.js` | **ja** (Schritte mit Versatz, grüne Haken) |
| Rad-Teil (Rahmen, Lenker) | `fahrrad.js` `.c6s-f-blatt` | **ja** |
| Schrank „Was magst du?“ | `laden.js` / `.c6s-g-kleid` | ja; Etikett „Was magst du?“ mit Herz als orange Handschrift-Plakette – Orange ohne Handeln |
| Quests | `.c6s-g-tafelblatt` | **eigen**: dunkelgrüne Kreidetafel im Holzrahmen, gelbe Haken. Als Ding stimmig, als Blatt Sonderling |
| Freundschaftsbuch | `module/atlas.js` `.c6r-at` | **eigen** (Leineneinband rosa, Reiter, Eselsohr, X außen im Kreis) – laut nico nicht generisch, bleibt |
| Bildbuch „Was an der Wand hängt“ | `bibliothek.js` | **eigen** (brauner Lederrahmen, X innen, Goldraute) |
| Katalog-Heft | `einrichten.js` `.c6e-heft` | **nein – generisch** (s. a) und **gleiche Reiter-Mechanik wie das Freundschaftsbuch**: zwei Bücher mit bunten Seitenreitern, eines soll bleiben, eines ist der Versandkatalog |
| Einrichten (Space) | `einrichten.js` `.c6e-blatt` | **nein**: roter Kopfstreifen, Reiter als unterstrichene Wörter in zwei bis vier Zeilen, „Fertig“ schwarz mit orangem Schatten |
| Deine Spaces | `space.js:1938 ff.` | **halb**: Liste ist Papier/Tusche, Knöpfe orange gefüllt (dreimal), ganzseitig ohne Rand |
| Planetenblatt (Himmel) | `netz.js:1874` `.c6w-blatt` | Nachtfassung (Navy, lila Rand) – folgerichtig für die Höhe; Kopfzeilen zu blass |
| Teleskop-Vorschau | `teleskop.css:2` | Nachtfassung, ja |
| Unser Gespräch | `kern.js:2323` `.c6k-vl`, `kern.css:300,1179` | **nein – generisch**: Milchglas mit Blur, kein Versatz |
| Nadel-Menü | `nadel.js` `.c6p-*` | ja (Papier, Tusche, Versatz) |
| Leinwand/Projektor | `module/projektor.js` | **ungeprüft** (in dieser Runde nicht ausgelöst) |
| Carls Blase | Kern | ja; liegt mehrfach **vor** dem Ding (Space-Werkzeug, Lesesaal-Meister, Garage-Rad) |

Schrift nebenbei (gehört zur Blatt-Sprache): Caveat steht weit über „Carls Handschrift“ hinaus – Ottos Zettel an der Leine, Space-Namen am Brett und im Buch („Woran du baust“), Name „Otto“, Wandbeschriftungen der Werkstatt, „Ferdl“, „Quests“, „Kieselpark“, „Katalog“-Aufschriften, Tagesschilder der Fächer, Platzhalter im Tagesblatt, „Nächster Schritt“-Text. Ob Ottos Zettel als „Handschrift“ gelten sollen, ist eine Entscheidung für Vitruvian, kein Fund.

## Querschnitt (c) · Farben gegen „Orange = Handeln · Nadelrot = Entscheidung · Grün = Wachstum“

**Kernbefund:** Im Kern ist `--faden:#d62a26` (`kern.css:1`) **dieselbe Farbe wie die Nadel** (`.c6w-nadel-z` `kern.css:1247`, `--p-rot`, `--at-rot`). Der „rote Faden“ ist ein Leitmotiv – damit ist Nadelrot überall, wo ein Faden, eine Verbindung oder „heute“ ist. Rot heißt im Bild also drei Dinge.

Nadelrot ohne Entscheidung (gesehen):
1. Leine im leeren Space (`space-computer-leer.png`), Punkt im Schild „Dein erster Space“.
2. Knäuel-Faden im Zuhause (`zuhause.js:786–802`).
3. Roter Faden am Boden der Bibliothek (`bibliothek.js:1061`).
4. Sternbild-Bogen im Himmel und rosa Satz daran (`netz.js`); Unterlinie am Ding „Sternbild mit …“ im Space; Rezeption-Bildfaden `kern.css:2035–2036` `.c6r-faden`, `.c6r-knoten`.
5. „heute“ im Fächerregal (rot unterstrichen) und `.c6z-bs-heute` (`kern.css:663`); roter Kreis um heute im Werkzeug-Monatsraster und im Wochenrückblick-Symbol; rote Linie „Dein letzter Zettel dort“.
6. Kopf „Dein Wochenende“ (Zuhause).
7. Katalog: Einband, Deckelrücken, Heft-Rücken an allen Katalog-Dingen, Stempel „LEUCHTET“, Kopfstreifen des Einrichten-Blatts, Unterstrich des aktiven Reiters.
8. Freundschaftsbuch: Herz und Lesezeichen auf dem Deckel (`bibliothek.js:754–755`).
9. `kern.css:3095–3102`, `3146` (`.c6k-fg-*`, `.c6k-lauf-punkt`): Faden-Rot als Rand/Füllung im Frage-Blatt und im Lauf-Punkt – **ungeprüft** im Bild (nicht ausgelöst).
Nadelrot **richtig**: der Nadel-Knopf selbst, Kernsatz-Nadel an der Leine (Entscheidung „das trägt“), Nadeln im Himmel (`.c6w-ls-war .c6m-punkt` `kern.css:1835`, nicht gesehen).

Orange ohne Handeln:
1. Etikett „von dir“ im Teleskop (`kern.css:2686`).
2. Lichtfleck abends in der Rezeption (`rezeption.welt.css:12`).
3. Plakette „Was magst du?“ im Schrank-Blatt.
4. Fokusringe sind `#b4460c`/`#f08a4b` (`--fokus`) – Fokus ist ein Zustand, vertretbar, aber dieselbe Farbfamilie.
Orange **inkonsequent als Handeln**: Hauptknöpfe sind meist **Tusche-schwarz gefüllt** („Eintragen“, „Auftrag geben“, „Los“, „Fertig“, „Übernehmen“ weiß auf Navy), das Senden ist **orange gefüllt**, „Fertig“ und „Kieselpark“ haben **orangen Versatz**, die Spaces-Liste hat **drei orange gefüllte** Knöpfe. Handeln hat damit drei Gestalten.

Grün:
- richtig: Pflanzen (Space, Brett, Planetenblatt, Rezeption), Haken im Wochenende und im Werkzeug „Üben“ (Wachstum/geschafft).
- uneinheitlich: Haken der Quest-Tafel **gelb** (gleiche Bedeutung „geschafft“); Werkzeug-Kopfleiste grün (Farbe der Vorlage `--wz`, nicht Wachstum); Register „Spaces“ im Katalog und Reiter „Carl“ im Buch grün (Schmuck); grüne Kreuze im Wochenrückblick-Symbol.

---

## Die 12 wichtigsten Schnitte (nach Wirkung)

1. **Katalog nur in der Garage** – Hefte in Bibliothek (`bibliothek.js:653`) und Werkstatt (`werkstatt.js:1616`), Kiste im Space (`space.js:618`) aus dem Bild, toten `HEFT` in `zuhause.js:65` mit raus; warum: viermal dasselbe Ding, nicos Befund; Funktion: Lampen je Raum im Garage-Heft (Register bleiben), Space-Einrichten über „Deine Spaces › Einrichten“ und Register „Für deine Spaces“.
2. **Ein Katalog, eine Blattsprache** – Heft (`.c6e-heft`) und Einrichten-Blatt (`.c6e-blatt`) zusammenführen; roter Einband/Rücken, bunte Reiter, Studiorahmen, Stempel „LEUCHTET“ weg (`einrichten.css:91–148,177,205`); warum: generisch und gleiche Reiter wie das Freundschaftsbuch; Funktion: Sortimente bleiben als Seiten, „steht da“ als ruhiges Zeichen statt Stempel, Preis bleibt Plakette.
3. **Himmel: das Blatt deckt den Planeten nicht mehr, die vier Karten verlassen den Himmel** (`netz.js:1874–1881`); warum: „von oben sehen“ ist im Moment des Tipps unsichtbar, Karten doppelt zum Space, „Hineingehen“ ist keine Tat des Himmels; Funktion: Karten im Space, Zählsatz („3 Zettel … Schritt fehlt“) bleibt als die eine Auskunft, „Hineingehen“ als Tipp auf den Planeten selbst; die Tat (E3) entscheidet Vitruvian.
4. **Teleskop-Sterne sichtbar machen** – Klassen-Kollision `.c6w-sterne{opacity:0}` aus `bibliothek.css:70` trifft `teleskop.js:18`; warum: die Linse wirkt leer, Carls Satz stimmt nicht; Funktion unverändert (eigener Klassenname je Raum).
5. **Fortschritt an einem Ort** – Quest-Tafel (`.c6s-g-tafel`), Rad (`.c6s-f-pkt`) und „Dein Wochenende“ (`lernweg.js`) zeigen drei Fortschritte; warum: „Schau, was du kannst“ hat zwei Mitten, Haken gelb vs. grün; Funktion: die Quests werden die Radteile (Grundkonstrukt: fehlendes Teil = Challenge, leeres Rad zeigt nur Freigeschaltetes), Tafel weg aus dem Bild, Wochenende verweist darauf oder ist sein Anfang.
6. **Space: das Werkzeug in die Mitte, die vier Karten leiser** (`.c6z-sp-wz` vs. `.c6vs-karte`, `.c6z-sp-schritt`); warum: Verb „Benutz dein Ding“, aber das Ding ist eine kleine Karte unter Carls Blase; Funktion: Karten erscheinen auf Bedarf (z. B. nach Tipp auf Carl oder unter einem Knopf), Schild und Karte „Machen“ nicht doppelt.
7. **Rot entwirren: `--faden` ≠ Nadelrot** (`kern.css:1`, `bibliothek.js:1061`, Zuhause-Knäuel, Space-Leine leer, Himmel-Bogen, „heute“-Marken, Wochenende-Kopf, Katalog, Buch-Herz); warum: Rot heißt heute Faden, Heute und Entscheidung; Funktion bleibt, nur Farbe (Faden in Space-Farbe oder Tusche, „heute“ in Tusche fett).
8. **Fertige Beispiele an einem Ort** – Gerüste an der Werkstatt-Wand, `VORLAGEN` im Neues-Werkzeug-Blatt (`werkzeug.js:103`), Sterne im Teleskop (`teleskop.js:99`); warum: „Zwei Wege“/„Wochenrückblick“ zweimal, an der Wand gleich laut wie „Neues Werkzeug“; Funktion: ein Regal der Beispiele (Vitruvian wählt Wand oder Teleskop), die Wand zeigt dann nur „Neues Werkzeug“ + „Deine Werkzeuge“.
9. **„Neuer Space“ einmal** – Karte am Brett, Knäuel, Knopf in „Deine Spaces“ (`space.js:~2009`), „Neuer Planet“ im Himmel; warum: vier Gesten für eine Handlung; Funktion: Zuhause ist der Ort (Karte oder Knäuel – eins bleibt als Geste, der Knäuel darf als Magie liegen), Himmel und Liste verweisen nur.
10. **„Deine Spaces“: Liste oben, Knöpfe leise** (`space.js:1938–2010`, `kern.css:2419`); warum: drei orange gefüllte Großknöpfe über dem eigentlichen Ding; Funktion: Ort wechseln, Einrichten, Neuer Space bleiben als Tusche-Umrisse unter der Liste.
11. **Nadel-Knopf aus dem Bild für Fremde** (`nadel.js:205` `#c6p-knopf`); warum: zweiter Chrome-Knopf in jedem Raum, Wort „Nadel“ und „Werkstatt“ je doppelt belegt; Funktion: für nico/Bastler erreichbar (z. B. hinter der Personaltür oder per Halten) – Entscheidung Vitruvian.
12. **Zuhause: zweite Navigation aus dem Bild, Kalender nicht vor dem Bild** (`zuhause.js:184–185` „Zum Fahrrad“/„Zur Bibliothek“, Tür „Werkstatt“); warum: doppelt zum Dock, am Computer hängt „Dein Wochenende“ vor dem Fahrradbild; Funktion: Dock trägt die Wege, Bild/Regal/Tür bleiben als Kulisse ohne Ziel oder mit Staunen-Satz.

Knapp darunter (nicht in den 12): Glas-Blatt „Unser Gespräch“ auf Papier (`kern.css:300,1179`); abgeschnittene Namen (Himmel `netz.js:620`, Werkstatt-Schild, Katalog „Bachelorarbei“, Space-Ding); Blasen vor Dingen (Space-Werkzeug, Lesesaal-Meister, Garage-Rad); Freundschaftsbuch größer/zentraler in der Bibliothek, Lexikon leiser; Feld-Platzhalter ohne „/“; Ferdl-Blatt ohne Link „Dein Wochenende“; Werkzeugkiste der Werkstatt leiser; Kieselpark-Schild am iPhone kleiner als das Tor.

---

## Ungeprüft
- **Tageszeit:** alle Bilder um 20 Uhr (Abend). Morgen, Mittag, Nacht nicht gesehen (Lichtfleck, Bibliotheksfenster, Nachtsterne).
- **Breiten:** nur 390 und 1440. Dazwischen (820–1199, Heft einseitig/zweiseitig ab 1200 px) nicht.
- **Esc als Schließen:** In den Klickfolgen habe ich Blätter mit Escape geschlossen. Bei `spgit-*-05` stand danach das Zuhause im Bild – vermutlich hat Esc den Space verlassen; das Ding „Sternbild mit …“ im Space ist deshalb **nicht** angetippt geprüft.
- **Stale-Frage im Space** („Ein Satz zu „Bachelorarbeit schreiben““ im Space „Gitarre lernen“) nur nach `C6.space.oeffne()` über die Schnittstelle gesehen, nicht nach echtem Tipp nachgestellt.
- **Himmel:** Planeten per Text-Locator angetippt (Canvas); Verbinden zweier Planeten (Ziehen) nicht versucht; ob „+ Neuer Planet“ am iPhone mit 1-px-Knopf trotzdem den Tipp nimmt, nicht geprüft.
- **Kalender:** nur der Schein-Kalender aus `ot_lib.py`; der echte Google-Kalender-Weg nicht.
- Nicht ausgelöst: Leinwand/Projektor, Frage-Blatt mit Faden-Rot (`.c6k-fg-*`), Buch-Seiten „Damals“, „Was ich weiß“, „Wer bei uns was darf“, Lesesaal „Meister wählen“, Kieselpark-Spiel, Anprobe im Schrank, Werkstatt-Waage/-Säge/-Fenster, Zuhause-Fenster und -Lampe, UFO-Einrichten, „Das hab ich mir gemerkt“ an der Rezeption, Schritt „Nächster Schritt“ und Karte „Machen“ (ob dasselbe).
- Ob die Wanduhr der Rezeption die echte Zeit zeigt.
- Große Schrift, Bildschirmleser, Tastatur, offline, langsames Gerät: nicht geprüft.
- Leerer Zustand der Garage-Quests („0 von 9“) nur im Standbild, nicht aufgeklappt.
- Ob der Nadel-Knopf für Fremde gedacht ist oder nur für nico (Label „An die Werkstatt“) – Annahme, nicht geprüft.
- Wo Bild und Code sich widersprechen könnten: Klassen und Zeilen stammen aus grep im heutigen `src/`; einzelne Zeilennummern können sich mit dem nächsten Bau verschieben.
