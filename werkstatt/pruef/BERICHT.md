# Prüfbericht Carl 6

14.10.2026 21:04

**Gesamt: nicht grün**

Datei: `/home/claude/carl/carl6-test.html`

## iphone

Start: `rezeption`

| Raum | Fehler | Überlauf | Tippziele < 44 | Überdeckt | Kontrast | Blase/Chips | Scroll | Bild |
|---|---|---|---|---|---|---|---|---|
| rezeption | – | – | – | – | – | – | – | `pruef/iphone-rezeption.png` |
| zuhause | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | Blase ← button.c6z-ding.c6z-fenster „Fenster“ (30 %)<br>Chips ← button.c6z-ding.c6z-knaeuel „Knäuel“ (29 %) | – | `pruef/iphone-zuhause.png` |
| werkstatt | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | Blase ← g.c6w-ding.c6w-fenster-ding „Fenster: draußen ist Nac“ (40 %)<br>Chips ← g.c6w-ding.c6w-saege „Sägebock mit Brett. Anti“ (45 %)<br>Chips ← g.c6w-ding.c6w-kiste „Werkzeugkiste, zu. Antip“ (47 %) | – | `pruef/iphone-werkstatt.png` |
| bibliothek | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | – | – | `pruef/iphone-bibliothek.png` |
| fahrrad | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | button.c6s-f-pkt „Rahmen. Ändern“ ← path<br>button.c6s-f-pkt „Hinterrad. Ändern“ ← circle<br>button.c6s-f-pkt „Vorderrad. Ändern“ ← circle<br>button.c6s-f-pkt „Sattel. Ändern“ ← path<br>button.c6s-f-pkt „Lenker. Ändern“ ← path<br>button.c6s-f-pkt „Klingel. Ändern“ ← path<br>… +4 | – | – | – | `pruef/iphone-fahrrad.png` |
| laden | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | – | – | `pruef/iphone-laden.png` |
| lesesaal | – | – | g „Die Kerze. Tipp sie an“ 36×69<br>button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | – | – | `pruef/iphone-lesesaal.png` |
| netz | – | – | button.c6w-knopf.c6w-haupt „Neuer Planet“ 1×48<br>button.c6k-hk „Hinunter auf den Boden“ 92×38 | button.c6w-knopf.c6w-haupt „Neuer Planet“ ← canvas.c6w-h-vorn „Dein Himmel. Du in der Mitte“ | – | – | – | `pruef/iphone-netz.png` |
| space | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | – | – | `pruef/iphone-space.png` |
| teleskop | – | – | button.c6k-hk „Hinunter auf den Boden“ 92×38 | – | – | – | – | `pruef/iphone-teleskop.png` |
| rundgang | – | – | – | – | – | – | – | `pruef/iphone-rundgang.png` |

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
| rezeption | – | – | – | – | – | – | – | `pruef/computer-rezeption.png` |
| zuhause | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | button.c6z-ding.c6z-bild „Zum Fahrrad“ ← rect | – | – | – | `pruef/computer-zuhause.png` |
| werkstatt | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | – | – | `pruef/computer-werkstatt.png` |
| bibliothek | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | – | – | `pruef/computer-bibliothek.png` |
| fahrrad | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | button.c6s-f-pkt „Rahmen. Ändern“ ← path<br>button.c6s-f-pkt „Hinterrad. Ändern“ ← circle<br>button.c6s-f-pkt „Vorderrad. Ändern“ ← circle<br>button.c6s-f-pkt „Sattel. Ändern“ ← path<br>button.c6s-f-pkt „Lenker. Ändern“ ← path<br>button.c6s-f-pkt „Klingel. Ändern“ ← path<br>… +4 | – | – | – | `pruef/computer-fahrrad.png` |
| laden | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | button.c6s-g-tor.c6k-haltbar „Tor zum Kieselpark: fahren u“ ← svg<br>button.c6s-g-tafel.c6k-haltbar „Quest-Tafel: 0 von 9 abgehak“ ← ellipse<br>button.c6s-f-pkt „Rahmen. Ändern“ ← div.c6s-g-moebel „Kieselpark z 0 Quests“<br>button.c6s-f-pkt „Hinterrad. Ändern“ ← div.c6s-g-moebel „Kieselpark z 0 Quests“<br>button.c6s-f-pkt „Vorderrad. Ändern“ ← div.c6s-g-moebel „Kieselpark z 0 Quests“<br>button.c6s-f-pkt „Sattel. Ändern“ ← div.c6s-f-blatt.c6s-g-kleid „Carls Schrank“<br>… +6 | b „Kieselpark“ 1.21 (soll 3) | – | – | `pruef/computer-laden.png` |
| lesesaal | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | – | Chips ← g.c6w-ding.c6w-ls-tisch „Der Tisch der Funde. Noc“ (100 %) | – | `pruef/computer-lesesaal.png` |
| netz | – | – | button.c6k-hk „Hinunter auf den Boden“ 92×38 | – | – | – | – | `pruef/computer-netz.png` |
| space | – | – | button.c6k-hk „Hoch in den Himmel“ 101×38 | – | span.c6k-wort.c6k-da „Name“ 1.40 (soll 4.5) | – | – | `pruef/computer-space.png` |
| teleskop | – | – | button.c6k-hk „Hinunter auf den Boden“ 92×38 | – | – | – | – | `pruef/computer-teleskop.png` |
| rundgang | – | – | – | – | – | – | – | `pruef/computer-rundgang.png` |

| Test | Ergebnis | Messung |
|---|---|---|
| Blase hält ihre Größe beim Schreiben | grün | 79 79 79 79 79 79 79 79 79 79 79 79 |
| Antwort-Chips: sichtbar, Wahl kommt an | grün | {"n": 3, "sicht": "visible", "a": "Müde"} |
| Text tippen, Raum wechseln, zurück: Text noch da | grün | {"dock": "Ein Satz, der bleibt", "raum": null, "scroll": 61, "gespeichert": "Ein Satz, der bleibt"} |
| #c6 scrollt nicht nach Tippen und Raumwechsel | grün | 0/0 |
| Höhenfahrt Boden → Vogelflug → Boden | grün | vogel → boden |
| Keine Konsolenfehler in den Tests | grün |  |
