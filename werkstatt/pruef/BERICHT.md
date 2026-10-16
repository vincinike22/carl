# Prüfbericht Carl 6

16.10.2026 12:48

**Gesamt: nicht grün**

Datei: `/home/claude/carl/carl6-test.html`

## iphone

Start: `rezeption`

| Raum | Fehler | Überlauf | Tippziele < 44 | Überdeckt | Kontrast | Blase/Chips | Scroll | Bild |
|---|---|---|---|---|---|---|---|---|
| zuhause | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | Blase ← button.c6z-ding.c6z-fenster „Fenster“ (30 %)<br>Chips ← button.c6z-ding.c6z-knaeuel „Knäuel“ (29 %) | – | `pruef/iphone-zuhause.png` |
| fahrrad | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | button.c6s-f-pkt „Rahmen. Ändern“ ← path<br>button.c6s-f-pkt „Hinterrad. Ändern“ ← circle<br>button.c6s-f-pkt „Vorderrad. Ändern“ ← circle<br>button.c6s-f-pkt „Sattel. Ändern“ ← path<br>button.c6s-f-pkt „Lenker. Ändern“ ← path<br>button.c6s-f-pkt „Klingel. Ändern“ ← path<br>… +4 | – | – | – | `pruef/iphone-fahrrad.png` |
| space | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | – | – | `pruef/iphone-space.png` |

| Test | Ergebnis | Messung |
|---|---|---|
| Blase hält ihre Größe beim Schreiben | grün | 74 74 74 74 74 74 74 74 74 74 74 74 |
| Antwort-Chips: sichtbar, Wahl kommt an | grün | {"n": 3, "sicht": "visible", "a": "Müde"} |
| Text tippen, Raum wechseln, zurück: Text noch da | grün | {"dock": "Ein Satz, der bleibt", "raum": null, "scroll": 120, "gespeichert": "Ein Satz, der bleibt"} |
| #c6 scrollt nicht nach Tippen und Raumwechsel | grün | 0/0 |
| Wischen oben (y=250): nach links und zurück | grün | rezeption→zuhause→rezeption |
| Wischen unten (y=560): nach links und zurück | grün | rezeption→zuhause→rezeption |
| Wischen: nach links, zurück, Zupfer bleibt, senkrecht bleibt; Nachbar lugt herein | grün | rezeption→zuhause→rezeption (1 Zug/Züge zurück), Zupfer rezeption, senkrecht rezeption, Nachbar mitten im Wischen: an x=255 |
| Wischen: genau ein Zug je Raumwechsel | grün | 1 Zug/Züge zurück |
| Wischen: langsamer Zug blättert, Zug über Carl blättert | grün | langsam → zuhause, über Carl → zuhause |
| #c6 scrollt nicht nach Gesten | grün | 0/0 |
| #c6 bleibt bei scrollIntoView/scrollLeft von außen fest | grün | [0, 0] |
| Höhenfahrt Boden → Vogelflug → Boden | grün | vogel → boden |
| Keine Konsolenfehler in den Tests | grün |  |

## computer

Start: `rezeption`

| Raum | Fehler | Überlauf | Tippziele < 44 | Überdeckt | Kontrast | Blase/Chips | Scroll | Bild |
|---|---|---|---|---|---|---|---|---|
| zuhause | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | button.c6z-ding.c6z-bild „Zum Fahrrad“ ← rect | – | – | – | `pruef/computer-zuhause.png` |
| fahrrad | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | button.c6s-f-pkt „Rahmen. Ändern“ ← path<br>button.c6s-f-pkt „Hinterrad. Ändern“ ← circle<br>button.c6s-f-pkt „Vorderrad. Ändern“ ← circle<br>button.c6s-f-pkt „Sattel. Ändern“ ← path<br>button.c6s-f-pkt „Lenker. Ändern“ ← path<br>button.c6s-f-pkt „Klingel. Ändern“ ← path<br>… +4 | – | – | – | `pruef/computer-fahrrad.png` |
| space | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | – | – | `pruef/computer-space.png` |

| Test | Ergebnis | Messung |
|---|---|---|
| Blase hält ihre Größe beim Schreiben | grün | 79 79 79 79 79 79 79 79 79 79 79 79 |
| Antwort-Chips: sichtbar, Wahl kommt an | grün | {"n": 3, "sicht": "visible", "a": "Müde"} |
| Text tippen, Raum wechseln, zurück: Text noch da | grün | {"dock": "Ein Satz, der bleibt", "raum": null, "scroll": 61, "gespeichert": "Ein Satz, der bleibt"} |
| #c6 scrollt nicht nach Tippen und Raumwechsel | grün | 0/0 |
| Höhenfahrt Boden → Vogelflug → Boden | grün | vogel → boden |
| Keine Konsolenfehler in den Tests | grün |  |
