# Rams (mit Papert) · Nachprüfung der elf Punkte aus `werkstatt/s12/VETO.md` (14.10., nach raffaels/miyazakis/Runes Nacharbeit, Vitruvians Vorlagen-Reihenfolge)

Derselbe Prüfer, dieselben Stellen, echte Klicks: Playwright, iPhone 390×844 Touch (`tap`) + Computer 1440×900 (`click`), frischer Speicher (`localStorage.clear()` + Neuladen), neu gebaut mit `tools/bau.py`. **0 Konsolenfehler** auf beiden Geräten, in beiden Läufen. Bilder: `werkstatt/s12/otto/nach/<nr>-<geraet>.png`. Keine Umbauten.

| Nr | Punkt | iPhone | Computer | Befund (ein Satz) | Bild |
|---|---|---|---|---|---|
| 1 | Gemerkt-Blase kurz, ohne Satz/Name, deckt das Fenster nicht | grün | grün | Blase sagt „Das hab ich mir gemerkt. Beides gehört dir.“ (eigener Satz) bzw. „Das hab ich mir gemerkt. War mein Beispiel, jetzt ist es deins.“ (Beispiel) – drei Zeilen, das Fenster bleibt frei; die Karte darunter zeigt, *was*. | `01-gemerkt-*` |
| 2 | Karte sagt „Mein Beispiel“ statt „Dein Satz“ bei Carls Beispiel | grün | grün | `<dt>` „Mein Beispiel“ über „Zähl mit, wie viele Gläser …“; beim eigenen Satz „Dein Satz“. | `02-meinbeispiel-*` |
| 3 | „Anders“ klebt nichts an Satz und Name; `anders[]` getrennt; gleich → `gleich` | grün | grün | Nach „in Minuten, nicht Stunden“ heißt das Werkzeug weiter „Gelesen“, `w.satz` ist der Originalsatz, `w.anders = ["in Minuten, nicht Stunden"]`, Karte zeigt „Dein Satz / Anders / Name“; „bitte schöner“ auf dem Rezeptionspfad → Carl: „Gleich geblieben, mitdenken kann ich hier nicht. Anders wird es mit Wörtern wie „jeden Tag“, „zählen“, „Liste“ oder „Termin“.“ | `03a-anders-*`, `03-anders-passt-*`, `03c-gleich-*` |
| 4 | Nach Neuladen mit Werkzeugen `wieder` statt „Ich bin Carl“ | grün | grün | „Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins.“ – Rezeption bleibt letzter Ort, zwei Werkzeuge neben Carl. | `04-neuladen-*` |
| 5 | `nameAus`: Verb am Satzende | grün | grün | „… wie lange ich gelesen hab.“ → „Gelesen“ (Wert); Beispiel „ob ich draußen war“ → „Draußen?“ unverändert. Vitruvians Reihenfolge: „Jeden Abend aufschreiben, wie viele Seiten ich gelesen hab.“ → „Seiten“, Zähler (Zählen schlägt Gewohnheit). | `05-name-*` |
| 6 | „Ins Teleskop hängen“ erst ab einem Eintrag | grün | grün | Leeres Werkzeug: „Anders · Wegräumen“; nach einem „+“: „Anders · Ins Teleskop hängen · Wegräumen“ und Rückblick „Die letzten zwei Wochen“. | `06a-leer-*`, `06b-eintrag-*` |
| 7 | Feste Blase folgt dem Bau; Satz des Menschen oben im Blatt; Rückweg zum Gruß | grün | grün | Blatt offen: Kopf „„Zähl mit, wie viele Gläser …““, Blase „Probier es aus. Ändern geht gleich.“ (kein doppeltes „Vorlage“); Schließen ohne Passt → Blase wieder „Ich bin Carl …“. `baut` selbst nicht sichtbar, weil der Beispiel-Bau sofort ist – richtig so. | `07a-blatt-*` |
| 8 | Zuhause zeigt die Werkzeuge ohne Space; Carl sagt `zuhause` einmal | grün | grün | Zuhause: kleine Reihe „Gelesen · noch nichts“ unten rechts, Blase „Hier wohn ich. Dein Werkzeug steht an der Rezeption; aus einem Satz hier wird ein Space.“ genau einmal im Gespräch. Stocker: am iPhone ist nur das jüngste Werkzeug sichtbar, das zweite liegt unter dem Feld (`C6.rezeption.meine` liefert beide). | `08-zuhause-*` |
| 9 | Sätze überleben ihren Zustand nicht; Karte am iPhone im Bild | grün | grün | Zurück aus Zuhause: „Da bist du wieder …“ (nicht „Gut. So merk ich es mir.“), Boden oben (`scrollTop 0`); nach Passt endet die Gemerkt-Karte am iPhone bei 696 px, Dock beginnt bei 722 – Kosten-Zeile und „Stimmt so nicht“ sichtbar. | `09-zurueck-*`, `09b-karte-*` |
| 10 | Sätze für `!fertig && angekommen` (Mindestmaß) | grün | grün | `S.du.angekommen` gesetzt, `fertig` false; `stimme.erster()` = „Dein Werkzeug „Gelesen“ steht an der Rezeption. Was soll ich dir als Nächstes bauen?“; `werkzeug.ohneSpace` = „Fertig. Es steht neben mir an der Rezeption.“; `lernweg.samstag` ohne „Morgen bauen wir“. Nicht geprüft: der Satz, mit dem Station 4 als geschafft gilt (Wochenend-Kalender zeigt Samstag leer – nichts still abgehakt). | – |
| 11 | Keine Meisternamen im Quelltext | grün | grün | `grep -niE 'miyazaki|raffael|papert|rams|rune|rothko|monet|hokusai|feynman' src/` liefert nur „Katsushika Hokusai“ (Künstler des Holzschnitts in der Bibliothek, kein Meister) und „Runes“ in einem wörtlichen Carlyle-Zitat. | – |

**Prüfstand** `pruef6 --nur rezeption,zuhause`: Rezeption überall „–“ (beide Geräte, beide Wisch-Tests grün). Zuhause: zwei Altlasten, nicht aus s12 – Himmel-Knopf `.c6k-hk` 101×38 (< 44 px) und am iPhone Blase/Chips über Fenster bzw. Fadenknäuel (53 % / 48 %).

## Zehn-Sekunden-Probe am Startbild (`00-start-iphone.png`, frisch)
Wesen auf dem Tresen mit Lampe, Tasse, Glocke; Blase „Ich bin Carl. Sag mir einen Satz, ich bau dir was.“; darunter zwei Beispiel-Karten ganz (Haken „Draußen?/heute“, Zähler „Gläser − 0 +“), jede mit Satz in Handschrift und „So eins für mich“; Feld „Was soll ich dir bauen?“; kein Himmel-Knopf. Ein Fremder sagt: „Er baut mir aus einem Satz ein kleines Werkzeug – ich schreibe unten oder nehme ein Beispiel.“ **Bestanden.**

## Inventar vorher/nachher (sichtbare Bedienelemente)
| | iPhone | Computer |
|---|---|---|
| Start, fremd | 18 | 24 |
| Nach dem Fluss, neu geladen (2 Werkzeuge) | 20 | 28 |
Unverändert gegenüber der ersten Prüfung; dazugekommen ist nur die Bedienung der eigenen Werkzeuge. Kein Element ohne Handlung.

## Nicht als Rot, nur notiert
- Zuhause am iPhone: zweites Werkzeug der kleinen Reihe liegt unter dem Feld (miyazaki, Lage).
- Zuhause zeigt dem Fremden ohne Space den Himmel-Knopf (Entscheidung 9 galt nur der Rezeption).
- Station 4 / Sonntag 1 „nur mit Satz“ nicht mit Klicks geprüft (Lernweg nicht im Fluss).
