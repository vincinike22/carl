# Inventar der Rezeption (Rams, s12, vor dem Bau)

## Gebrauchsliste (wofür der Fremde kommt, in seiner Reihenfolge)
1. **Verstehen** (zehn Sekunden): ein Wesen, ein Satz, ein Feld, Beispiele zum Anfassen.
2. **Sagen**: einen Satz ins Feld – oder ein Beispiel antippen.
3. **Zusehen**: Carl baut; wie lange, und wer gedacht hat.
4. **Entscheiden**: Passt / Anders.
5. **Haben**: das eigene Werkzeug steht neben Carl, benutzbar; „Das hab ich mir gemerkt“.

## Inventar (jedes Element → Handlung → bleibt/fällt)
| Element | Besitzer | Handlung | Entscheid | Grund |
|---|---|---|---|---|
| Carl, wach, an der Rezeption | raffael | 1 | bleibt | das Wesen; ohne ihn ist es ein Formular |
| Carls erster Satz (`rezeption.erst`) | Rune/raffael | 1, 2 | bleibt | die Einladung; der einzige Text, der erklärt |
| Feld unten (geliehenes Dock-Feld, Platzhalter) | raffael | 2 | bleibt | die Stelle, an der der Mensch dem System etwas sagt |
| Senden-Knopf (orange) | Kern | 2 | bleibt | die eine laute Stelle des Bildschirms |
| Beispiel-Reihe (`c6bs-reihe`) | wir | 1, 2 | bleibt | Beispiele als Dinge, nicht als Text |
| Beispiel-Karte (`c6bs-karte`), sechs Stück | wir | 1, 2 | bleibt | je eine Baustein-Art; der Fremde findet sich in einer wieder |
| Kennzeichen „Beispiel“ (`c6bs-kennz`) | wir (Satz Rune) | 1 | bleibt | Wahrheit: das ist nicht deins, nicht gespeichert |
| Mini-Werkzeug in der Karte (`C6.werkzeug.male` klein) | wir/werkzeug.js | 1 | bleibt | das Ding zum Denken: echt, bedienbar, wahrer Zustand |
| Satz im Knopf (`c6bs-satz`) | wir | 2 | bleibt | zeigt, woraus es entstand = lehrt, was man sagen kann |
| Verb im Knopf (`c6bs-verb`, „So eins für mich“) | wir (Satz Rune) | 2 | bleibt | sagt ohne Hilfetext, was Antippen tut |
| Überschrift über den Beispielen („Zum Beispiel:“ o. ä.) | – | – | **fällt** | das Kennzeichen an jeder Karte sagt es schon; zweites Element für dieselbe Sache |
| Pfeil/„Wischen“-Hinweis | – | – | **fällt** | die angeschnittene nächste Karte zeigt es |
| Zweiter Knopf je Karte („Ansehen“, „Mehr“) | – | – | **fällt** | ein Knopf je Karte; Ansehen ist das Mini-Werkzeug selbst |
| Zähler „6 Beispiele“ / Punkte-Indikator | – | – | **fällt** | Zahl ohne Handlung |
| Erklärtext „Carl baut aus Bausteinen …“ | – | – | **fällt** | Vortrag vor dem Ding; die Karte zeigt es |
| Uhr beim Bau (`c6bs-uhr`, gemessene Sekunden) | wir (Einbau raffael) | 3 | bleibt | ehrlich statt Spinner; eine Zahl, die stimmt |
| Kosten-Zeile nach dem Bau (Sekunden, Kopf) | raffael/Rune | 3 | bleibt | Entscheidung 5; nur gemessen, nie erfunden |
| Passt / Anders | werkzeug.js | 4 | bleibt | die eine Antwort auf jeden Vorschlag |
| Eigenes Werkzeug neben Carl (`.c6rz-meins`) | raffael | 5 | bleibt | der Erfolg ist ein Ding, kein Satz |
| „Das hab ich mir gemerkt“ (Satz, Name, „Stimmt so nicht“) | raffael/Rune | 5 | bleibt | Gedächtnis gehört dem Menschen; der Rückweg ist dabei |
| Konfetti / Ton / Abzeichen nach dem Bau | – | – | **fällt** | Belohnung ohne Inhalt |
| Tutorial, Pfeile, Onboarding-Text | – | – | **fällt** | Entscheidung 6; die Form spricht |

Regel für die Karte: **drei Dinge, ein Knopf** – Kennzeichen, Werkzeug, Satz-als-Knopf. Nichts weiter.

## Farb- und Zustandstabelle (aus `kern.css`; Grundton + höchstens eine Farbe je Funktion)
| Farbe | Variable | Bedeutet (überall gleich) | Wo an der Karte |
|---|---|---|---|
| Papier `#f4eee4` | `--papier` | der Raum | hinter der Reihe |
| Karte `#fbf7f0` | `--karte` | ein Ding, das man anfassen darf | Kartengrund |
| Feld `#fffdf9` | `--feld` | hier kann ich etwas sagen/tun | Grund des Satz-Knopfs |
| Tusche `#2b2722` | `--tusche` | Text, Rand des Bedienbaren | Satz, Rand des Knopfs |
| Leise `#6f6a61` | `--leise` | Nebensache, Kennzeichen | „Beispiel“, Uhr |
| Linie `#d8cfc0` | `--linie` | Begrenzung ohne Handlung | Kartenrand |
| Gedrückt `#efe7da` | `--gedrueckt` | gerade berührt | Knopf `:active` |
| Fokus `#b4460c` | `--fokus` | Tastatur-Fokus | `:focus-visible`, nur dort |
| Orange `#e8621a` | `--orange` | **die** Hauptbedienung des Bildschirms (Senden) | **nicht** an der Karte – die Karte ist leise |
| Baustein-Farbe (werkzeug.js `FARBEN`, je Art eine) | `--wz` | die Art des Werkzeugs (Haken grün, Zähler blau …) | nur im Mini-Werkzeug: Oberkante, Zeichen, Plus – wie überall im Werk |

Verstoß gesucht: keine zweite Rot-/Orange-Fläche an der Rezeption außer dem Senden-Knopf; `--faden` (Rot) bleibt den Nadeln, `--keim` den Pflanzen.

## Zustände des einen Knopfs (`c6bs-nimm`)
| Zustand | Aussehen |
|---|---|
| Ruhe | Feld-Grund, 1,5 px Tusche-Rand, Satz in Handschrift (Caveat, wie jeder Satz des Menschen im Werk), Verb klein in Figtree |
| Berührung (hover, Maus) | Rand wird 2 px, keine Farbe |
| Gedrückt | `--gedrueckt`, 1 px nach unten |
| Fokus (Tastatur) | `--fokus`-Ring, 2 px Abstand |
| Deaktiviert (kein `bauen` übergeben) | es gibt keinen Knopf: der Satz steht als Text da |
| Bau läuft (nach Antippen) | Karte `aria-busy`, Knopf `disabled`, Verb zeigt die laufende Uhr („… 3 s“), bis das Blatt übernimmt; `neu()` setzt zurück |

## Zehn-Sekunden-Probe
Wird nach dem Bau am Bild geschrieben (unten in dieser Datei, Abschnitt „Probe“).

## Probe (Rams, am echten Bild `05-iphone-rezeption.png`, 14.10. abends)
**Zehn Sekunden, iPhone, Fremder:** Ich sehe ein Wesen mit Sprossen am Fenster, das sagt „Ich bin Carl. Sag mir einen Satz, ich bau dir was.“ Darunter eine Karte „EIN BEISPIEL“: ein kleines Ding „Draußen?“ mit einem leeren Kreis „heute“, darunter in Handschrift der Satz „Ich will jeden Tag sehen, ob ich draußen war.“ und klein „So eins für mich“. Rechts ist eine zweite Karte angeschnitten. Unten ein Feld „Was soll ich dir bauen?“ mit orangem Pfeil. **Was ist das:** Ein Wesen baut mir aus einem Satz ein kleines Werkzeug. **Was kann ich tun:** Einen Satz unten schreiben, oder das Beispiel nehmen, oder den Kreis „heute“ antippen und sehen, dass es echt ist. → **bestanden** für die Gebrauchshandlungen 1 und 2.
**Stocker (notiert, nicht unser Element):** „Himmel ↑“ oben rechts ist das Lauteste neben dem Pfeil und sagt dem Fremden nichts (Kern/raffael). Die Tasse und die Glocke (miyazaki) liegen am iPhone hinter der Reihe – das eine Ding zum Denken der Welt ist nicht sichtbar (Lage, raffael/miyazaki).
**Zehn Sekunden, Computer (`06-computer-rezeption.png`):** Sechs Karten im Raster, alle sechs Sätze lesbar, jede mit wahrem Leerzustand (heute leer · 0 · – · noch leer · 16. Oktober · erste Frage). Verstanden in zehn Sekunden: ja. Stocker: „–“ beim Wert (siehe Kreuzungsblatt).
**Farbprobe am Bild:** eine orange Fläche (Senden), sonst Tusche, Leise, Karte, Feld; je Mini-Werkzeug eine Baustein-Farbe nur an Oberkante, Zeichen, Plus – wie im übrigen Werk. Kein Verstoß.
**Zehn-Prinzipien-Probe (Kurzfassung):** nützlich ja (zwei Handlungen pro Karte) · verständlich ja (Verb statt Hilfetext) · unaufdringlich ja (Karte leise, Werkzeug trägt Farbe) · ehrlich ja (Kennzeichen, wahre Zustände, Uhr misst) · langlebig ja (Papier, Linie, Handschrift – nichts Modisches) · konsequent **teils**: kein eigener Fehlerzustand, weil die Fehler im Feld und Blatt liegen (raffael); Rückweg nach Antippen = Schließen des Blatts gibt die Karte frei (geprüft) · Detail bis zur Kante: 390 px ohne Überlauf, 81-px-Knopf, Fokusring, `aria-busy`, `aria-live` an der Uhr.
**Selbstprüfung (Rams, Grenze 8):** Habe ich aus Liebe zur Ruhe Lebendiges gestrichen? Nein – gestrichen sind Überschrift, Pfeil, Zähler, zweiter Knopf, Erklärtext; Carl, Welt und das Mini-Werkzeug bleiben. Die Reihe ist leiser als der Satz und das Feld, wie verlangt.
**Nachtrag nach dem Tresen-Umbau (Bild 05 neu):** Glocke und Tasse stehen jetzt frei neben Carl auf der Kante, die Reihe darunter; der Stocker „Glocke verdeckt“ ist am iPhone weg. Am Computer (Bild 06) sieht der Fremde ohne Scrollen zwei Beispiele – zu wenig, siehe Kreuzungsblatt.
