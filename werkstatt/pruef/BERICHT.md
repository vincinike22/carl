# Prüfbericht Carl 6

17.10.2026 01:32

**Gesamt: nicht grün**

Datei: `/home/claude/carl/carl6-test.html`

## iphone

Start: `rezeption`

| Raum | Fehler | Überlauf | Tippziele < 44 | Überdeckt | Kontrast | Blase/Chips | Scroll | Bild |
|---|---|---|---|---|---|---|---|---|
| rezeption | – | – | – | – | – | – | – | `pruef/iphone-rezeption.png` |
| zuhause | – | – | – | – | – | Chips ← button.c6z-ding.c6z-knaeuel „Knäuel“ (29 %) | – | `pruef/iphone-zuhause.png` |
| werkstatt | – | – | – | – | – | Blase ← g.c6w-ding.c6w-fenster-ding „Fenster: draußen ist Nac“ (40 %)<br>Chips ← g.c6w-ding.c6w-saege „Sägebock mit Brett. Anti“ (45 %)<br>Chips ← g.c6w-ding.c6w-kiste „Werkzeugkiste, zu. Antip“ (47 %) | – | `pruef/iphone-werkstatt.png` |
| bibliothek | – | – | – | – | – | – | – | `pruef/iphone-bibliothek.png` |
| fahrrad | – | – | – | button.c6s-f-pkt „Rahmen. Ändern“ ← path<br>button.c6s-f-pkt „Hinterrad. Ändern“ ← circle<br>button.c6s-f-pkt „Vorderrad. Ändern“ ← circle<br>button.c6s-f-pkt „Sattel. Ändern“ ← path<br>button.c6s-f-pkt „Lenker. Ändern“ ← path<br>button.c6s-f-pkt „Klingel. Ändern“ ← path<br>… +4 | – | – | – | `pruef/iphone-fahrrad.png` |
| laden | – | – | – | – | – | – | – | `pruef/iphone-laden.png` |
| lesesaal | – | – | g „Die Kerze. Tipp sie an“ 36×69 | – | – | – | – | `pruef/iphone-lesesaal.png` |
| netz | – | – | – | – | – | – | – | `pruef/iphone-netz.png` |
| space | – | – | – | – | – | – | – | `pruef/iphone-space.png` |
| teleskop | – | – | – | – | – | – | – | `pruef/iphone-teleskop.png` |
| rundgang | – | – | – | – | – | – | – | `pruef/iphone-rundgang.png` |

| Test | Ergebnis | Messung |
|---|---|---|
| Blase hält ihre Größe beim Schreiben | grün | 74 74 74 74 74 74 74 74 74 74 74 74 |
| Antwort-Chips: sichtbar, Wahl kommt an | grün | {"n": 3, "sicht": "visible", "a": "Müde"} |
| Text tippen, Raum wechseln, zurück: Text noch da | grün | {"dock": "Ein Satz, der bleibt", "raum": null, "scroll": null, "gespeichert": "Ein Satz, der bleibt"} |
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
| rezeption | – | – | – | – | – | – | – | `pruef/computer-rezeption.png` |
| zuhause | – | – | – | – | – | – | – | `pruef/computer-zuhause.png` |
| werkstatt | – | – | – | – | – | – | – | `pruef/computer-werkstatt.png` |
| bibliothek | – | – | – | – | – | – | – | `pruef/computer-bibliothek.png` |
| fahrrad | – | – | – | button.c6s-f-pkt „Rahmen. Ändern“ ← path<br>button.c6s-f-pkt „Hinterrad. Ändern“ ← circle<br>button.c6s-f-pkt „Vorderrad. Ändern“ ← circle<br>button.c6s-f-pkt „Sattel. Ändern“ ← path<br>button.c6s-f-pkt „Lenker. Ändern“ ← path<br>button.c6s-f-pkt „Klingel. Ändern“ ← path<br>… +4 | – | – | – | `pruef/computer-fahrrad.png` |
| laden | – | – | – | button.c6s-g-tor.c6k-haltbar „Tor zum Kieselpark: fahren u“ ← svg<br>button.c6s-g-tafel.c6k-haltbar „Quest-Tafel: 0 von 9 abgehak“ ← ellipse<br>button.c6s-f-pkt „Rahmen. Ändern“ ← div.c6s-g-moebel „Kieselpark z 0 Katalog Quest“<br>button.c6s-f-pkt „Hinterrad. Ändern“ ← div.c6s-g-moebel „Kieselpark z 0 Katalog Quest“<br>button.c6s-f-pkt „Vorderrad. Ändern“ ← div.c6s-g-moebel „Kieselpark z 0 Katalog Quest“<br>button.c6s-f-pkt „Sattel. Ändern“ ← div.c6s-f-blatt.c6s-g-kleid „Carls Schrank“<br>… +6 | b „Kieselpark“ 1.64 (soll 4.5) | – | – | `pruef/computer-laden.png` |
| lesesaal | – | – | – | – | – | Chips ← g.c6w-ding.c6w-ls-tisch „Der Tisch der Funde. Noc“ (100 %) | – | `pruef/computer-lesesaal.png` |
| netz | – | – | – | – | – | – | – | `pruef/computer-netz.png` |
| space | – | – | – | – | – | – | – | `pruef/computer-space.png` |
| teleskop | – | – | – | – | – | – | – | `pruef/computer-teleskop.png` |
| rundgang | – | – | – | – | – | – | – | `pruef/computer-rundgang.png` |

| Test | Ergebnis | Messung |
|---|---|---|
| Blase hält ihre Größe beim Schreiben | grün | 79 79 79 79 79 79 79 79 79 79 79 79 |
| Antwort-Chips: sichtbar, Wahl kommt an | grün | {"n": 3, "sicht": "visible", "a": "Müde"} |
| Text tippen, Raum wechseln, zurück: Text noch da | grün | {"dock": "Ein Satz, der bleibt", "raum": null, "scroll": null, "gespeichert": "Ein Satz, der bleibt"} |
| #c6 scrollt nicht nach Tippen und Raumwechsel | grün | 0/0 |
| Höhenfahrt Boden → Vogelflug → Boden | grün | vogel → boden |
| Keine Konsolenfehler in den Tests | grün |  |
