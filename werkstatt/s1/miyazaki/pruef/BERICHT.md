# Prüfbericht Carl 6

08.10.2026 17:32

**Gesamt: grün**

Datei: `/home/claude/carl/n13/carl6-test.html`

## iphone

Start: `zuhause`

| Raum | Fehler | Überlauf | Tippziele < 44 | Überdeckt | Kontrast | Blase/Chips | Scroll | Bild |
|---|---|---|---|---|---|---|---|---|
| zuhause | – | – | – | – | – | – | – | `pruef/iphone-zuhause.png` |
| space | – | – | – | – | – | – | – | `pruef/iphone-space.png` |

| Test | Ergebnis | Messung |
|---|---|---|
| Blase hält ihre Größe beim Schreiben | grün | 76 76 76 76 76 76 76 76 76 76 76 76 |
| Antwort-Chips: sichtbar, Wahl kommt an | grün | {"n": 3, "sicht": "visible", "a": "Müde"} |
| Text tippen, Raum wechseln, zurück: Text noch da | grün | {"dock": "Ein Satz, der bleibt", "raum": null, "scroll": null, "gespeichert": "Ein Satz, der bleibt"} |
| #c6 scrollt nicht nach Tippen und Raumwechsel | grün | 0/0 |
| Wischen: nach links, zurück, Zupfer bleibt, senkrecht bleibt; Nachbar lugt herein | grün | zuhause→werkstatt→zuhause (1 Zug/Züge zurück), Zupfer zuhause, senkrecht zuhause, Nachbar mitten im Wischen: an x=255 |
| Wischen: genau ein Zug je Raumwechsel | grün | 1 Zug/Züge zurück |
| Wischen: langsamer Zug blättert, Zug über Carl blättert | grün | langsam → werkstatt, über Carl → werkstatt |
| #c6 scrollt nicht nach Gesten | grün | 0/0 |
| #c6 bleibt bei scrollIntoView/scrollLeft von außen fest | grün | [0, 0] |
| Höhenfahrt Boden → Vogelflug → Boden | grün | vogel → boden |
| Keine Konsolenfehler in den Tests | grün |  |

## computer

Start: `zuhause`

| Raum | Fehler | Überlauf | Tippziele < 44 | Überdeckt | Kontrast | Blase/Chips | Scroll | Bild |
|---|---|---|---|---|---|---|---|---|
| zuhause | – | – | – | – | – | – | – | `pruef/computer-zuhause.png` |
| space | – | – | – | – | – | – | – | `pruef/computer-space.png` |

| Test | Ergebnis | Messung |
|---|---|---|
| Blase hält ihre Größe beim Schreiben | grün | 81 81 81 81 81 81 81 81 81 81 81 81 |
| Antwort-Chips: sichtbar, Wahl kommt an | grün | {"n": 3, "sicht": "visible", "a": "Müde"} |
| Text tippen, Raum wechseln, zurück: Text noch da | grün | {"dock": "Ein Satz, der bleibt", "raum": null, "scroll": null, "gespeichert": "Ein Satz, der bleibt"} |
| #c6 scrollt nicht nach Tippen und Raumwechsel | grün | 0/0 |
| Höhenfahrt Boden → Vogelflug → Boden | grün | vogel → boden |
| Keine Konsolenfehler in den Tests | grün |  |
