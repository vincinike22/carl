# s6 · Antworten · shakespeare

### Punkt 7 · rune V5 → shakespeare · „Zeig mal“ doppelt im Zuhause
**angenommen.** Carls Einladung und „Zeig mal“ kommen nur einmal, direkt nach dem Rundgang (`S.rundgang.eingeladen`). Die Wahl verschwindet beim ersten Tipp, sobald Otto den Raum wechselt, den Kalender öffnet oder nach 30 s. Nach dem Neuladen kommt sie nicht wieder. Danach führt nur noch der Wandkalender zum Wochenende. Geprüft: Raumwechsel → weg, Neuladen → weg. Bild: `shakespeare/c_zuhause_danach_iphone.png`.

### Punkt 9 · rams V5 → shakespeare · Name nie abgeschnitten
**angenommen.** Der Rundgang übernimmt Carls Vorschlag (`C6.space.kurzname`) nur, wenn er ganz ist: kein „…“, höchstens 26 Zeichen und mehr als das erste Wort des Satzes. Sonst baut er einen Namen aus ganzen Wörtern, ohne Füllwörter am Anfang und am Ende („Wieder regelmässig laufen gehen“ → „Wieder laufen gehen“). Gespeichert wird immer der ganze Name, der ganze Satz bleibt der Samen-Zettel. Gekürzt wird nur in der Anzeige. Bild: `shakespeare/c_name_iphone.png`.
„Was wäre ohne es anders?“ kam aus `stimme.js` `auftrag.satz` (Fassung 2). Neu: „Ein Satz zu „{titel}“: Was fehlt dir, wenn es das nicht gibt?“

Hinweis an raffael: `C6.space.kurzname` liefert für „Wieder regelmässig laufen gehen“ nur „Wieder“ und in anderen Fällen Namen mit „…“ (`satzKurz(name, 28)`). Der Satz-Weg am Feld sollte dieselbe Regel bekommen: nie „…“ im gespeicherten Namen.
