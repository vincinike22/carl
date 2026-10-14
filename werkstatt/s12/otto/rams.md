# Rams als Otto · s12 · echte Klicks durch die Rezeption (14.10., nach der Nacharbeit, v25-Stand)

Werkzeug: Playwright, iPhone 390×844 (Touch, `tap`), Computer 1440×900 (`click`); frischer Speicher (`localStorage.clear()` + Neuladen). Zeit = vom Tipp bis der Bildschirm 600 ms ruhig war (Bau-Schritte: bis „Passt“ erschien). 0 Konsolenfehler auf beiden Geräten. Bilder `werkstatt/s12/papert/22-iphone-*.png`, `22-computer-*.png`. Rohdaten im Protokoll des Laufs.

## Der Fluss (iPhone; Computer in Klammern, wo abweichend)
| # | Schritt | ms | Was Otto sieht | Stocker |
|---|---|---|---|---|
| 1 | Start, frisch | 614 (610) | Fenster, Lampe, Carl auf dem Tresen, Tasse, Glocke; Blase „Ich bin Carl. Sag mir einen Satz, ich bau dir was.“; unter dem Tresen zwei Beispiel-Karten ganz, dritte angeschnitten (Computer: drei ganz); Feld „Was soll ich dir bauen?“; Dock mit fünf Orten, Rezeption markiert. Kein „Himmel“-Knopf mehr. | Blase deckt am iPhone das Fenster halb ab (Bild 22-iphone-3) – Lage, nicht Text. |
| 2 | Beispiel „Gläser“ antippen | 743 (689) | Blatt „Neues Werkzeug“: „Das ist eine Vorlage. Probier sie aus, ändern geht gleich.“, Zähler − 0 +, Passt / Anders. Sofort, keine Uhr. | – |
| 3 | Passt | 1298 (1271) | Blatt zu; „Gläser“ steht klein neben Carl; Karte „Das hab ich mir gemerkt“ mit **„Dein Satz“** „Zähl mit …“, Name, Kosten-Zeile „Gedacht hab ich hier nicht …“, „Stimmt so nicht“; Blase: „Das hab ich mir gemerkt: „Gläser“, aus meinem Beispiel. Jetzt ist es deins.“ | **Blase sagt „aus meinem Beispiel“, Karte sagt „Dein Satz“** – zwei Wahrheiten für einen Satz (Veto 1). |
| 4 | Werkzeug groß (Name antippen) | 687 (643) | Blatt „Werkzeug“: Zähler groß, „Anders“, „Ins Teleskop hängen“, „Wegräumen“. | **„Ins Teleskop hängen“ am leeren ersten Werkzeug** (Veto 3). |
| 5 | Schließen (×) | 575 (551) | zurück zur Rezeption, alles wie in 3. | – |
| 6 | eigener Satz ins Feld: „Ich will jeden Abend aufschreiben, wie lange ich gelesen hab.“ | 559 (522) | Blatt: „Das ist eine Vorlage …“, Werkzeug **„Messen“**, Wert „Heute“ ohne Einheit, ✓, Passt / Anders. | Name „Messen“ statt Ottos Wort (Papert Veto 3). |
| 7 | Bau fertig | 208 (209) | wie 6. Sofort (kein Kopf da, keine Uhr – richtig so). | – |
| 8 | Anders | 687 (658) | Blatt behält das alte Werkzeug gedämpft, „Was soll anders sein? Schreib es unten ins Feld.“; Feld-Platzhalter „Was soll anders sein?“ | – (ein Satz, ein Handgriff: richtig) |
| 9 | „in Minuten, nicht Stunden“ ins Feld | 543 (532) | Blatt: Werkzeug **„Anders: Minuten“**, „Heute in min“, Passt / Anders. | **Fugenwort im Namen** (Papert Veto 1). |
| 10 | Passt (zweite Fassung) | 1271 (1243) | „Anders: Minuten“ steht über „Gläser“ neben Carl; Karte „Dein Satz“: „… gelesen hab.. Anders: in Minuten, nicht Stunden“; Blase: „… deinen Satz „Ich will jeden Abend aufschreiben, wie lang…“ und dein Werkzeug „Anders: Minuten““. | **Blase zerschneidet den Satz („lang…“)** und wiederholt, was die Karte ganz zeigt (Veto 2). |
| 11 | Zuhause (Dock) | 1345 (1325) | Zuhause, Feld „Woran denkst du gerade?“; Werkzeuge nicht sichtbar (ohne Space). | Wo sind meine zwei Werkzeuge? – nur an der Rezeption (gewollt R0, notiert). |
| 12 | zurück zur Rezeption (Dock) | 1331 (1303) | alles wie in 10, Blase noch mit „gemerkt“-Satz. | – |
| 13 | neu laden | 2032 (1935) | Rezeption (letzter Ort), zwei Werkzeuge neben Carl, darunter die Beispiele (gebautes „Gläser“ ganz hinten); Blase: **„Ich bin Carl. Sag mir einen Satz …“** | Zweite Vorstellung (Papert Veto 2). Gemerkt-Karte weg – richtig, sie gehört zum Augenblick. |

Gesamt vom Start bis zum ersten eigenen Werkzeug neben Carl (Schritte 1–3): **≈ 2,7 s** Maschine, dazu Ottos Lesen – unter einer Minute mit Lesen und Tippen. Maßstab der Runde erfüllt.

## Zehn-Sekunden-Probe (Bild 22-iphone-1-start)
Ein Wesen auf einem Tresen, ein Satz („Sag mir einen Satz, ich bau dir was“), ein Feld, zwei Beispiel-Karten mit kleinen Dingen (Haken „Draußen?/heute“, Zähler „Gläser − 0 +“) und je einem Handschrift-Satz mit „So eins für mich“. Ein Fremder sagt: „Das Ding baut mir aus einem Satz ein kleines Werkzeug. Ich kann unten schreiben oder eines der Beispiele nehmen.“ **Bestanden.** Staunt er? Beim Antippen des Kreises „heute“ im Beispiel ja – es reagiert, ohne dass er etwas gespeichert hat. Versteht er, was Carl für ihn tut? Nach „Passt“ ja: das Ding steht neben Carl, Carl sagt, was er sich gemerkt hat.

## Zehn-Prinzipien-Probe (Ja/Nein mit Grund)
1. Innovativ – **Ja**: ein Satz wird vor den Augen ein bedienbares Ding; Beispiele sind Dinge, nicht Text.
2. Nützlich – **Ja**: zwei Handlungen je Karte, zwei Wege (Feld, Beispiel), Anders in einem Satz.
3. Ästhetisch – **Ja**: eine Schriftfamilie je Rolle (Fraunces Namen, Caveat Mensch, Figtree Bedienung), Papierfarben, Welt leiser als der Satz.
4. Verständlich – **Ja**, mit Abzug: Verb statt Hilfetext; aber „Dein Satz“ bei Carls Beispiel widerspricht der Blase (Veto 1).
5. Unaufdringlich – **Ja**: Orange nur am Senden, Karten leise, Welt hinter allem.
6. Ehrlich – **Teils**: Kosten-Zeile und Zustände wahr; aber „Anders: Minuten“ als Name und „… hab.. Anders: …“ als „Dein Satz“ legen dem Menschen Worte in den Mund (Papert Veto 1); „Ich bin Carl“ beim Wiedersehen (Papert Veto 2).
7. Langlebig – **Ja**: nichts Modisches; Holz, Papier, Handschrift.
8. Konsequent bis ins Detail – **Teils**: Fehlerzustände (leer, kurz, Anders, Uhr) gebaut; Blase zerschneidet den Satz am iPhone (Veto 2); Blase über dem Fenster.
9. Umweltfreundlich (hier: sparsam) – **Ja**: Beispiele bauen ohne Kopf, sofort; keine Dauerbewegung außer Dampf.
10. So wenig Design wie möglich – **Ja**: gestrichen wurden Überschrift, Pfeil, Zähler, zweiter Knopf, Erklärtext, Himmel-Knopf; es bleibt, was Handlung trägt.

## Inventar-Nachzählung (sichtbare Bedienelemente im Bild, ohne Welt)
| | iPhone | Computer |
|---|---|---|
| Start, fremd (Schritt 1) | 18 | 24 |
| Nach dem Fluss, neu geladen (Schritt 13) | 20 | 28 |
Vorher: Feld + Senden (2), Dock 5, Glocke 1, je sichtbarer Beispiel-Karte Knopf + Mini-Werkzeug-Bedienung (Namen-Knopf, heute / − +). Nachher kommen die Bedienung der zwei eigenen Werkzeuge dazu (Namen-Knopf, − +), die sichtbaren Beispiele rücken nach unten. Kein Element ohne Handlung dazugekommen; die Rezeption ist nach dem Fluss nicht lauter als vorher, nur voller mit Eigenem – richtig.

## Nicht als Veto, nur notiert
- Zuhause zeigt Werkzeuge ohne Space nicht (R0 gewollt); der Fremde, der nach „Zuhause“ wischt, sucht sein Ding. Für R1: ein kleines Regal in Zuhause oder der Hinweis im Dock.
- Carls Blase am iPhone verdeckt das Fenster (Lage, raffael/miyazaki).
- „Messen“ als Ersatzname (Papert Veto 3).
