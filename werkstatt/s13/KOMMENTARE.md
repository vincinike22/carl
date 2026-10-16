# s13 · Alle 37 Kommentar-Threads gegen den heutigen Stand

Prüferinnen: Rune (Wahrheit) mit Rams (Gebrauch) · 16.10.2026
Geprüft: `carl6-test.html` (Branch carl6, Stand v30). Das Live-Artifact (Version 1792147723-e1be) trägt dieselben v30-Merkmale (Katalog in der Garage, Reiter brechen um, Satz am Sessel). Was gebaut ist, ist also auch live.
Werkzeug: Playwright mit echten Taps (iPhone 390×844, Touch) und Klicks (Computer 1440×900), frischer Speicher je Lauf. Bilder: `werkstatt/s13/bilder/`. Am Code wurde nichts geändert.
Ungeprüft für alle Zeilen: echtes iPhone, echtes Mitdenken (Claude), Flüssigkeit von Animationen auf echter Hardware.

## Warum nico „nichts sieht“ – drei Befunde vorweg

1. **Vier von fünf offenen Threads enden mit einer Frage von Claude an nico.** Die Rezeptions-Frage (ba64c378: „eigener Raum oder Tresen im Zuhause?“) blockiert nach eigener Aussage (11035b78) die ganze Runde s13 „Räume mit Verb“. nico liest „Ich melde mich“, Claude wartet auf nico. Seit 10:55 ist nichts gebaut.
2. **Stille Rückbauten.** Was am 08. und 11.10. als „gebaut“ gemeldet wurde, ist teilweise wieder weg: Schweben, Wimpern-Reihe, Weltkarte und Wissensbücher, Lexikon-Mappe, Ankleidezimmer, sichtbare Schreibtische. Keiner dieser Threads hat einen Satz bekommen, dass es zurückgebaut wurde.
3. **Zwei Versionszählungen.** Am 11.10. meldet Claude „Version 29/31/32“, am 16.10. „Version 27–30“. nico kann nicht nachvollziehen, was zuerst kam.

## Tabelle (chronologisch)

| Thread | Datum | Ort | Was nico wollte (seine Worte) | Zugesagt / „gebaut“ | Befund heute (Bild) | Urteil |
|---|---|---|---|---|---|---|
| fd626b07 | 08.10. | Rundgang, Carl beim Namen | „er hat keine beine beim namen geben bekommen und fragen“ | v5: Beine ab dem Aufwachen, der Mund kommt später | Rundgang nur noch über `#raum=rundgang`. Beim Namen-Geben ist Carl ein Kiesel mit Augen, **ohne Beine und ohne Keimblätter** (Stationen `teile:1/2`). Rückfall. `13c-rundgang-01.png`, `13d-rundgang-02.png` | kaputt |
| 393daef6 | 08.10. | Rundgang-Chip | „überschneidet sich“ | v6: Antworten auf eigenem Blatt, geprüft in 13 Schritten | Ein Fremder kommt heute gar nicht mehr in den Rundgang. In Schritt 1–2 überschneidet sich nichts, die Schritte 3–13 sind ungeprüft. `13c-rundgang-01.png` | erfüllt |
| 168edd66 | 08.10. | Werkstatt | „Agents Werkstatt mit schreibtischen … grau ‚nicht freigeschalten‘ wie in video spielen“ | v6: Tür zur Schreibstube, vier Tische, gesperrte grau mit Schloss | Keine Tür sichtbar. Ferdl antippen öffnet nur den ersten Tisch („Nachlesen lassen“). Morgenbrief, Bote und eigener Helfer liegen versteckt im DOM (`hidden`), ohne graue Tische und ohne Schloss. `17-schreibstube-iphone.png` | nicht da |
| 5fb73ed4 | 08.10. | Bibliothek, Lexikon | „wunderschönes wissenslexikon … ohne Text … carl dazu auffordern wissen zu recherchieren“ | v6: Klickfehler behoben, ein leuchtendes Lexikon, Carl schreibt eine Mappe | Das Lexikon leuchtet, trägt keine Schrift und lässt sich treffen. Ein Tipp öffnet aber die Geheimtür. Die Mappen-Funktion (`auftragText`) wird von nirgends mehr aufgerufen. Recherche gibt es nur noch bei Ferdl. `00-bibliothek-computer.png` | halb |
| eeaea023 | 08.10. | Garage, Fahrrad | „das ist schon sehr nah an meisterwerk“ | bleibt so | Das Rad steht unverändert in der Garage. `00-fahrrad-iphone.png` | erfüllt |
| e1d4cb2d | 08.10. | Laden | „mehr charme … schlafzimmer mäßiges ankleidezimmer“ | v6: Ankleidezimmer mit Tapete, Kommode, Spiegel, Bett; Carl dreht sich, kichert | Der Laden ist in der Garage aufgegangen: Schrank und Spiegel sind da (Carl dreht sich: „So sieht es von hinten aus“). Tapete, Kommode und Bett sind weg. Kichern und „Was magst du?“ sind ungeprüft. `12-garage-spiegel-iphone.png` | halb |
| 0d6eb614 | 08.10. | Zuhause / Spaces | „gib ihm sowas ähnliches wie die couch … auch natürlich in einen eigenen space“ | v6 Filzsofa, v7 ein Sitz je Space | Sofa im Zuhause; in jedem der 15 Space-Orte eine eigene Couch mit Lehne (`COUCH`). `00-zuhause-iphone.png`, `09-space-2-zettel-iphone.png` | erfüllt |
| f9c8eaef | 08.10. | Carl / Laden | „ihm fehlen einfach wimpern – füge wimpern arten bei ‚laden‘ hinzu“ | v6: Wimpern, Blinzeln ohne schiefes Lid, Laden-Reihe „Wimpern“ mit 7 Arten | Carl hat Wimpern und schaut freundlich. Die **Reihe „Wimpern“ fehlt** im Schrank (Reiter: Socken, Mützen, Schals, Brillen, Gefährt), obwohl `figur.js` Wimpern-Arten noch kann. `12-garage-schrank-iphone.png` | halb |
| c34cb3a7 | 08.10. | Computer, rechte Seite | „rechte bildschirm … animation vom linken weiterführen“ | v6: Milchglas, Szene läuft unter dem Gespräch weiter | Die geteilte Ansicht gibt es nicht mehr. Das Gespräch liegt als Milchglas-Blatt über der Szene, und die Szene scheint durch. `17-gespraech-computer.png` | erfüllt |
| f4d4a098 | 08.10. | alle Räume | „den ganzen backround weiterführend … verschmelzen mit UI“ | v6: Boden und Licht bis an die Kanten | Am iPhone stimmt es. Am Computer enden Werkstatt und Lesesaal bei y≈748 mit **harter Kante** zum Band unter dem Dock; nachts steht Dunkelblau gegen Beige. `11-nacht-werkstatt-lampe-an-computer.png`, `00-werkstatt-computer.png` | halb |
| 22066b3b | 08.10. | Bibliothek → Lesesaal | „versteckte tür … roter faden … spaziergang mit carl in einer weltkarte … zum herumstöbern“ | v7: Tür, schwarzweißer Gang mit rotem Faden, 8 Wissensbücher, Weltkarte (Athen → Stoa …) | Tür (jetzt hinter dem Lexikon), roter Faden bis zu Carls Füßen und Treppe sind da. Der Gang ist warm-braun statt schwarzweiß, und im Gang ist kein Faden zu sehen. **Wissensbücher und Weltkarte gibt es nicht mehr** (kein Code), an ihrer Stelle steht der Tisch der Funde (jüngerer Wunsch d8a95ba5). `06-lexikon-folge-iphone.png` | halb |
| 052db550 | 08.10. | Bibliothek, Buch | „freundschaftsbuch … zum durchblättern … specs … LLM … claude code“ | v7: Atlas mit 8 Seiten, 7 Claude-Code-Schritte | Das rosé Leinenbuch mit Herz ist da, jetzt mit 5 Seiten (Du, Carl, Damals, Was ich von dir weiß, Wer bei uns was darf). Geräte, Kopf und „Für Bastler“ sind auf einer Seite zusammengelegt. Die Blätterpfeile sind per CSS versteckt, Reiter gibt es nur für 4 der 5 Seiten: „Wer bei uns was darf“ erreicht man nur durch Wischen oder mit der Pfeiltaste. `08b-atlas-iphone-3.png`, `08b-atlas-computer-3.png` | halb |
| 1eb2bd65 | 10.10. | Zuhause, Stehlampe | „an und aus klicken verändert kamera pov … pro hub space mindestens 5 neue artikel“ | v29: 0 px Bewegung, 67 Dinge, je Ort Lampen | Beim Knipsen gemessen 0 px Verschiebung (Carl, Fenster, Tür, Knäuel). Der Katalog hat Lampen je Raum und je Space-Ort die Reiter Möbel, Pflanzen, Lampen, Bilder, Teppiche, Kleinigkeiten. Die Zahl 67 ist nicht nachgezählt. `02-zuhause-lampe-an-iphone.png`, `10-space-katalog-iphone.png` | erfüllt |
| 348e7447 | 10.10. | Zuhause, Sessel | „stuhl sieht … fehl am platz aus … im store zu holen“ | v29: Lesesessel in Ocker mit Strickdecke, fünf Sessel zum Holen | Ocker-Sessel mit Decke; der Reiter „Sessel“ im Katalog (jetzt Garage) bietet Ohrensessel 5, Schaukelstuhl 6 und mehr. `01-garage-katalog-sessel-iphone.png` | erfüllt |
| be681877 | 10.10. | Werkstatt, Ferdl | „noch mehr wie ein komisches nerdiges und langweiliges wesen“ | v29: Strickjacke, geflickte Brille, Kamillentee, Stempeln | Brille, Strickjacke und Tee sind zu sehen, dazu langweilige Sprüche („Büroklammern … alle silbern“). Am iPhone lässt er sich treffen. Das Stempeln ist ungeprüft. `04-werkstatt-ferdl-tap-279-513.png` | erfüllt |
| 5c0cc312 | 10.10. | Werkstatt, Wand | „vl wochenrück, zwei wege, skizze, neues werkzeug … antwort … visuell dargestellt“ | v29: nur diese 4; Antworten als Darstellung mit „Woher ich das weiß“ | An der Wand hängen genau diese 4. „Soll ich morgens mit dem Rad oder der Bahn fahren?“ ergibt eine Waage mit „Woher ich das weiß“ (Bleistift, ohne Mitdenken). Darunter stehen Passt/Anders, die nico am 16.10. ablehnt. `14-werkstatt-frage-iphone.png` | erfüllt |
| cd4ee1c3 | 10.10. | Bibliothek, Schrank | „schrank schön aber langweilig“ | v29: Bogen, Ranken, Medaillon, Knospen, Wurzelfüße | Bogen, Ranken und Medaillon mit zwei Blättern sind zu sehen. Ob die Nischen bei brennender Lampe leuchten, ist ungeprüft. `00-bibliothek-computer.png` | erfüllt |
| 2247376e | 10.10. | Bibliothek, Sanduhr | „stopuhr beim drüber hovern … beim klicken stoppt und misst … notiz schreiben“ | v29: fest auf dem Tisch, kopfüber Stoppuhr, Notiz wird Zettel | Mit echten Taps vollständig geprüft: Tipp dreht sie, Halten (Finger) bzw. Drüberfahren (Maus) zeigt „0:05“, Tipp stoppt („6 Sekunden. Notiz dazu?“), Notiz → „Gemessene Zeiten“ wird angelegt → „Hängt als Zettel …“. `05-sanduhr-3-stopp-computer.png`, `05b-sanduhr-halten-iphone.png` | erfüllt |
| a1b4e44b | 11.10. | Carl | „wäre nice wenn carl auch verschiedene sachen anhat“ | v29: trägt Gekauftes in allen Räumen | Pilzhut und Fliegerbrille sind in allen 7 Räumen sichtbar. `12-kleid-alle.png` | erfüllt |
| 36cca286 | 11.10. | Lexikon → Lesesaal | „animation … unpleasant … treppen auf der decke“ | v29: Lichtspalt, Regal gleitet, Treppe nach unten, Blende | Bildfolge: Spalt (150 ms), Treppe am Boden (550 ms), Saal (800–1100 ms), kein Sprung. Am Computer liegt ~300 ms lang ein leeres braunes Bild. `06-lexikon-folge-iphone.png`, `06-lexikon-folge-computer.png` | erfüllt |
| d8a95ba5 | 11.10. | Lesesaal, Mitte | „zusammenfassungen und verknüpfungen … nahrung für deine werkstatt“ | v29: Tisch der Funde, Zusammenfassung, Fäden, „In die Werkstatt geben“ | Link eingefügt → Karte auf dem Tisch → Blatt mit Carls ehrlichem Satz („Die Seite selbst kann ich nicht öffnen“) und „In die Werkstatt geben“. Zusammenfassung und Fäden sind ohne Mitdenken ungeprüft. `14b-lesesaal-karte.png` | erfüllt |
| 38ae437f | 11.10. | überall | „wenn man auf etwas leeres drückt, man aus der sprechblase … rauskommt“ | v29: Leertipp schließt alles | In allen 8 Räumen auf beiden Geräten bestätigt; auch die Werkzeug-Blätter schließen so. `02-zuhause-leertipp2-iphone.png`, `04-werkstatt-zweiwege-leer-iphone.png` | erfüllt |
| bd3f9b70 | 11.10. | Carl | „er soll die ganze zeit ein bisschen herumfliegen, seine couch im space … aufgemotzt“ | v29: schwebt leise alle 4–5 s, Ruhe-Szenen, Sitzmöbel je Ort | `figur.js` lässt ihn nur im Himmel/Teleskop schweben oder kurz vor Freude („Schweben nur, wo es Sinn hat“). In der Werkstatt hat er sich 5,4 s lang um 0 px bewegt. Die Couch je Ort ist da; die Ruhe-Szenen stehen im Code, gesehen habe ich sie nicht. | halb |
| d9c4b86c | 11.10. | Raumleiste | „fix“ | v29: 3 Fehler behoben, Rückfrage, was gemeint war | Die Leiste ist überall lesbar, der Ort ist markiert (Lesesaal → Bibliothek, Space → Zuhause), die Lage ist gleich. Die Rückfrage ist unbeantwortet. `07-nav-bibliothek-ausschnitt.png` | offen-Frage |
| fdfa3a11 | 11.10. | Werkzeug-Blatt | „unfertig und un detailverliebt … werkzeuge haben absolut keinen nutzen“ | v29: Kalenderblätter mit Kreuzen, dein Satz, Carls Satz | Werkzeug gebaut und geöffnet: 7 Kreise, 4-Wochen-Kalender, dein Satz, Carls Satz („Diese Woche ein Kreuz, letzte Woche keins“). Die Form stimmt. Am Nutzen zweifelt nico am 16.10. noch („productivity map“). `15b-werkzeug-blatt.png` | halb |
| 50531a62 | 11.10. | Space, „Etwas aufhängen“ | „dann hängen die notizen nämlich einfach da und bringen genau 0“ | v29: Wort-Verbindung mit Datum, Skizze, einmal je Besuch | Die Verbindung greift nur bei Wörtern ab 7 Buchstaben oder großgeschriebenen Wörtern: „Krems“ ja, „Rad“ nein. Auf Wunsch kommt eine Skizze. Einen Zettel antippen bietet „Hängen lassen / Wird der Kernsatz / Abnehmen“. nico am 16.10.: der Space „bringt absolut nichts“. `09b-space-skizze-iphone.png` | halb |
| 6c332614 | 11.10. | Werkzeug-Blatt | „zb hier“ | v29: Blatt neu gestaltet | Wie fdfa3a11: das Blatt ist neu und detailreich. Der Bezug zum letzten Zettel ist ungeprüft (kein Space im Test). `15b-werkzeug-blatt.png` | erfüllt |
| 6b81c56d | 11.10. | Werkstatt, Wand | „ind das meine ich mit unnötig“ | v29: Wand auf 4 Dinge | Es sind 4. `00-werkstatt-iphone.png` | erfüllt |
| 9f7d5472 | 11.10. | Katalog | „füge ihn in der werkstatt hinzu … lampen … für zuhause, werkstatt & bibliothek“ | v31: Reiter je Raum mit 5 Lampen, Hefte in Werkstatt und Bibliothek | Heft auf der Hobelbank, Heft im untersten Fach; Reiter „Für Zuhause/Werkstatt/Bibliothek“ mit Lampen (Stehlampe, Papierlaterne 4, Bunte Glaslampe 5 …). `01-garage-katalog-iphone.png` | erfüllt |
| 71121f0e | 11.10. | Nacht / Werkstattlampe | „nacht animation komisch & lampe in werkstatt … das licht“ | v32: gleicher Takt, Werkstattlicht als weicher Kegel | Werkstatt nachts gut: warmer Kegel nach unten, Ferdls Lampe glimmt. Das **Zuhause wird nachts kaum dunkler** (Helligkeit 206 → 189 von 255); nur das Fenster ist Nacht. Die Garage nachts ist gut. `11-nacht-folge-iphone.png`, `11-nacht-werkstatt-iphone.png` | halb |
| b627048a | 16.10. | Katalog-Blatt | „alles komisch überschnitten, absolut nicht clean“ | v28: Blase schweigt, Titel + Fertig in einer Zeile | Bestätigt (iPhone): Fertig ganz sichtbar, keine Blase hinter dem Blatt. `01-garage-katalog-iphone.png`, `10-space-katalog-iphone.png` | erfüllt |
| ba64c378 | 16.10. | Rezeption | „zu sehr productivity map … aus apple health … Carl steht auf der wand … unlebendig“ | Neubau zugesagt, erst nach nicos Antwort: eigener Raum oder Tresen im Zuhause? | Unverändert: sechs Zähler-Karten, Carl steht auf dem Tresen, die Karten liegen wie ein Formular darunter. Die Frage ist unbeantwortet. `00-rezeption-iphone.png`, `00-rezeption-computer.png` | offen-Frage |
| 11035b78 | 16.10. | Lesesaal | „passe funktionen an unser jetziges reines personalized AI an“ | s13 „Räume mit Verb“, Start nach Antwort in ba64c378 | Nichts gebaut, wartet auf die Antwort. `00-lesesaal-computer.png` | offen-Frage |
| 3344e8fe | 16.10. | Buch, „Wer bei uns was darf“ | „sieht noch zu unliebevoll aus … man findet auch nicht funktionen was carl könnte … alles hier übersichtlich organisiert“ | Plan s13/s14 (Gedächtnis-Seiten, Fähigkeiten am Rad), „Ich melde mich, wenn gebaut“ | Nicht gebaut. Das Buch ist wie oben; gerade die kommentierte Seite hat keinen Reiter. `08b-atlas-iphone-3.png` | nicht da |
| bad2d314 | 16.10. | Katalog-Ort | „katalog … eher in ‚garage‘ … alle an einem ort“ | v29: Heft in der Garage, Sessel verweist dorthin | Bestätigt: Das Heft lehnt am Spiegel und öffnet den Katalog. Der Sessel sagt: „Den Katalog hab ich in die Garage gelegt …“ `00-fahrrad-iphone.png`, `02-zuhause-sessel-iphone.png` | erfüllt |
| d93d3a91 | 16.10. | Katalog-Reiter | „bug und fehlansicht von überschneidungen … kommt zu sessel nicht rüber“ | v30: Reihe bricht um, Blase schweigt | Bestätigt: alle 5 Reiter im Bild, auf beiden Geräten. Kleinigkeit: In der Garage öffnet der Katalog auf „Für Zuhause“ mit „Welche Lampe soll **hier** leuchten?“, obwohl man in der Garage steht. `01-garage-katalog-iphone.png`, `01-garage-katalog-spaces-computer.png` | erfüllt |
| 532d34dc | 16.10. | Space | „bringt absolut nichts … ‚passt & anders‘ absolut unnötig … vier vorschläge … planeten funktionen kompleet neu“ | Vorschlag: vier Karten (Weiterdenken/Machen/Arbeiten lassen/Verbinden), Zettel groß, Planet von oben; Bau nach Ja | Nicht gebaut. Passt/Anders stehen weiter an Skizze, Waage, Werkzeugbau und Space-Wahl der Sanduhr. Ein Planet antippen fliegt direkt in den Space. `16-himmel-planet.png`, `09b-space-skizze-iphone.png` | offen-Frage |

**Anzahl je Urteil:** erfüllt 20 · halb 10 · nicht da 2 · kaputt 1 · offen-Frage 4 = 37

## A · Zugesagt, aber nicht da oder kaputt (nach Priorität)

**P0 – blockiert alles**
0. **Die Rückfragen sind nicht bei nico angekommen.** Vier Threads (ba64c378, 11035b78, 532d34dc, d9c4b86c) warten auf ihn; 11035b78 hängt die ganze Runde s13 an die Rezeptions-Frage. Vitruvian muss diese Fragen einmal gesammelt und sichtbar stellen, nicht in vier Threads verstreut.

**P1 – nicos jüngste ausdrückliche Wünsche**
1. **Passt/Anders raus, vier wählbare Vorschläge** (532d34dc). Betrifft Skizze, Waage, Werkzeugbau in der Rezeption und Sanduhr → Space. Dazu: der Space muss etwas tun.
2. **Das Buch als ein Ort für „was Carl kann, wie ich es einstelle, was er dann tut“, mit Liebe gemacht** (3344e8fe). Zugesagt, nicht gebaut. Sofort lösbar: Reiter für „Wer bei uns was darf“; heute fehlt ausgerechnet für die kommentierte Seite der Reiter.
3. **Rezeption lebendig, Beispiele als „Carl weiß etwas und fragt“** (ba64c378). Wartet auf die Antwort.

**P2 – als gebaut gemeldet, still zurückgebaut**
4. **Carl schwebt die ganze Zeit ein bisschen** (bd3f9b70). Gemeldet „gebaut v29“, heute nur im Himmel und im Teleskop. nico hat das nie zurückgenommen.
5. **Schreibstube mit sichtbaren gesperrten Tischen** (168edd66). Gemeldet v6, heute unsichtbar (siehe C4).
6. **Wimpern-Reihe im Schrank** (f9c8eaef). Gemeldet v6 mit 7 Arten, heute fehlt die Reihe.
7. **Lexikon: Carl bereitet sich auf ein Thema vor (Mappe)** (5fb73ed4). Gemeldet v6, heute ist das Lexikon nur die Tür. Die Funktion lebt bei Ferdl weiter, aber nico wurde nichts gesagt.
8. **Weltkarte, Wissensbücher, schwarzweißer Gang mit rotem Faden** (22066b3b). Gemeldet v7. Die Mitte wurde zu Recht durch die Funde ersetzt (C5), aber auch das ist nicht gesagt worden. Der Gang ist nicht schwarzweiß.
9. **Ankleidezimmer mit Charme** (e1d4cb2d). Aufgegangen in der Garage; Bett, Kommode und Tapete sind weg, ohne Wort an nico.

**P3 – Kanten**
10. **Harte Kante am Computer** zwischen Bühne und Band unter dem Dock (f4d4a098), am deutlichsten nachts in der Werkstatt, auch im Lesesaal.
11. **Das Zuhause wird nachts nicht Nacht** (71121f0e): Nur das Fenster wechselt, der Raum bleibt fast taghell.
12. **Atlas-Blätterpfeile versteckt**, Seite 5 nur durch Wischen erreichbar (052db550/3344e8fe). Am Computer weiß man das nicht.
13. **Rundgang: Carl ohne Beine beim Namen-Geben** (fd626b07). Rückfall auf den Stand vor v5. Niedrig, weil der Rundgang für Fremde nicht mehr erreichbar ist; wird er wieder eingebaut, ist es ein Veto.
14. Kleinigkeit: Der Katalog in der Garage fragt „Welche Lampe soll **hier** leuchten?“ auf dem Reiter „Für Zuhause“ (d93d3a91).

## B · Erfüllt, aber noch nicht „exzellent“ (kurz)

Maßstab ist die Sanduhr (fünf Punkte siehe unten). Was fehlt:
- **Wort-Verbindung im Space** (50531a62): wahr und belegt, aber zufällig. Kurze Wörter („Rad“, „Zug“) verbinden nie, und der Mensch sieht nicht, warum etwas verbindet oder nicht. Die Sanduhr zeigt ihren Zustand immer; die Leine nicht.
- **Werkzeug-Blatt** (fdfa3a11): schön und ehrlich, endet aber im Blatt. Die Sanduhr endet im Leben (Zettel in einem Space); das Werkzeug-Kreuz führt nirgendwohin.
- **Darstellungen** (5c0cc312): Die Waage reagiert, doch der Abschluss ist Passt/Anders, eine Formularfrage statt eines Handgriffs.
- **Tisch der Funde** (d8a95ba5): Ohne Mitdenken bleibt ein Link eine Adresse; der Satz ist ehrlich, aber für einen Fremden ist das Erste, was er sieht, „kann ich nicht öffnen“.
- **Lexikon-Übergang** (36cca286): ruhig, aber am Computer mit einem leeren braunen Bild von ~300 ms.
- **Ferdl, Schrank, Kleidung, Couch**: liebevoll gezeichnet, aber Schauwerk. Es sind Dinge zum Anschauen, nicht zum Denken; keins davon hat einen zweiten Zustand.
- **Katalog** (b627048a/d93d3a91): sauber, aber ein Blatt mit fünf Reitern und einer Kachelreihe. Der Gegenstand im Raum (Heft) ist gut, das Blatt selbst ist Verwaltung.

## C · Widersprüche zwischen Wünschen (der jüngste Wunsch gilt)

1. **Katalog: Zuhause (Sessel, 10./11.10.) → Werkstatt und Bibliothek dazu (11.10.) → Garage, „alle an einem Ort“ (16.10.).** Gültig: Garage. Umgesetzt. Offen bleibt, ob die Abkürzungshefte in Werkstatt und Bibliothek bleiben; Claude hat gefragt, nico hat nicht geantwortet.
2. **Passt/Anders: als Abschluss jeder Darstellung gebaut („Passt hängt sie in den Space“, 11.10.) → „absolut unnötig, vier Vorschläge, einer oder mehrere wählbar“ (16.10.).** Gültig: vier Vorschläge. Nicht umgesetzt.
3. **Bibliothek: Sanduhr als Stoppuhr (10.10.), von nico heute „exzellent“ genannt → „Funktionen an reines personalized AI anpassen“ (16.10.).** Claudes Antwort in 11035b78 kündigt an, „Sanduhr, Karikaturen und Buch als Selbstzweck“ ins Zweite Album zu schieben. **Das wäre falsch.** nicos jüngster Satz verlangt anpassen, nicht entfernen, und die Sanduhr ist bereits persönlich: Jede Messung wird ein Zettel im Gedächtnis. Gültig: behalten und mit dem Gedächtnis verbinden.
4. **Schreibstube: sichtbare graue Tische wie Level in Spielen (08.10.) → Grundkonstrukt 14.10.: „unsichtbarer Personalbereich“.** Das Grundkonstrukt ist jünger und von nico entschieden. Gültig: unsichtbar. nico sollte aber erfahren, dass die Tische deshalb weg sind; sein Spielgedanke (freischalten) lebt laut Grundkonstrukt im Rad und in den Toren weiter.
5. **Lesesaal-Mitte: Wissensbücher mit Weltkarte (08.10.) → „das in der Mitte … echt schlecht … hier sollten zusammenfassungen … sein“ (11.10.).** Gültig: Tisch der Funde. Umgesetzt (16.10.: „hier siehts wieder besser aus“).
6. **Lexikon: Recherche-Auftrag (08.10.) → Tür in den Lesesaal (vorausgesetzt in nicos Kommentar vom 11.10.).** Gültig: Tür. Die Recherche gehört zu Ferdl („Nachlesen lassen“); nico wurde das nie gesagt.
7. **Buch: Freundebuch mit Geräten, Modellen und Claude Code (08.10.) → „alles hier übersichtlich organisiert: was Carl kann, wie ich es einstelle, was er dann tut“ (16.10.).** Gültig: der jüngere Wunsch, und zwar „**hier**“ im Buch. Claudes Plan in 3344e8fe verlegt „Was Carl kann“ in die Garage ans Rad, und das Buch verweist nur. **Das widerspricht nicos Wort „hier“.** Vor dem Bau klären oder beides tun: am Rad freischalten, im Buch nachschlagen.
8. **Laden als Ankleidezimmer (08.10.) → Garage als ein Ort für Carls Erscheinung (Grundkonstrukt 14.10., Kommentar 16.10.).** Gültig: Garage. Der Charme des Ankleidezimmers (Spiegel, Posieren) ist zum Teil mitgekommen.
9. **Carl schwebt die ganze Zeit (11.10.) → keine jüngere Aussage von nico.** Die Einschränkung auf den Himmel war eine Werkstatt-Entscheidung, keine von nico. Gültig: nicos Wunsch; zurückbauen oder ihn fragen.
10. **Rezeption als eigener Raum (s12) ↔ Carls erster Satz im Zuhause.** Noch kein Wunsch von nico, nur Claudes Frage. Offen.

## Was an der Sanduhr exzellent ist (Maßstab für alle Meister)

1. **Die Geste ist die Bedeutung.** Umdrehen heißt Messen beginnen, Antippen heißt Anhalten. Wer eine Sanduhr kennt, versteht es ohne ein Wort. Kein Knopf, kein Menü; das Glas dreht sich um seine eigene Mitte, und der Sand fällt immer nach unten.
2. **Wahr in jedem Zustand.** Aufrecht läuft sie wirklich drei Minuten, kopfüber misst sie wirklich. Der Satz dazu wechselt mit dem Zustand (der alte geht, der neue liegt bereit), und das Zustandslabel spricht für Finger und Maus verschieden („Halt den Finger drauf“ / „Fahr mit der Maus drüber“).
3. **Zeigt erst, wenn man fragt.** Das Zeitschild erscheint nur beim Drüberfahren, Halten oder gleich nach dem Stopp. Erst Staunen, dann die Zahl; nichts drängt, nichts zählt ungefragt.
4. **Sie endet im Leben des Menschen.** „6 Sekunden. Notiz dazu?“ → der Satz wird ein Zettel in einem Space (ist keiner da, legt Carl einen an). Aus dem Spielzeug wird Gedächtnis; die Messungen bleiben gespeichert (die letzten 12) und überstehen das Neuladen.
5. **Jede Kante ist bedacht.** Kein Space → Angebot; ein Space → direkt; mehrere → Auswahl; „Ohne Notiz“; daneben tippen behält die Zeit; Tastatur (Fokus zeigt die Zeit); reduzierte Bewegung; sie steht fest auf dem Tisch, als Ding im Raum und nicht als Blatt darüber.

Die Prüffrage für jeden Meister lautet deshalb: *Ist mein Ding ein echter Gegenstand mit Geste, wahr in jedem Zustand, leise bis zur Frage, endet es in deinem Gedächtnis, und hält es an jeder Kante?*

## Ungeprüft (ehrlich)
- Echtes iPhone und echte Hardware; alles hier ist Chromium mit Touch-Emulation.
- Alles mit Mitdenken: Zusammenfassungen am Tisch der Funde, Ferdls Nachlesen, Darstellungen mit echtem Kopf.
- Rundgang ab Schritt 3 (393daef6).
- Ruhe-Szenen von Carl (plumps, pff), Ferdls Stempeln, Kichern vor dem Spiegel, Nischenlicht im Schrank.
- Die Zahl „67 Dinge“ im Katalog.
- Bezug des Werkzeug-Blatts zum letzten Zettel.
- Ob die Live-Fassung byte-gleich mit `carl6-test.html` ist: Die Merkmale stimmen überein, die Größe weicht um ~330 Byte ab (wahrscheinlich die Hülle).
