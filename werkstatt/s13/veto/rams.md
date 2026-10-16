# Veto · Rams (Gebrauch) · s13 · 16.10.2026
Mit Rune als Otto. Protokoll: `../otto/OTTO.md`.

## V1 · Das Tagesblatt ist zu klein, die Hauptbedienung liegt unter dem Rand (B3 offen)
- **Bruch + Bild:** Gemessen am iPhone: Das Blatt reicht von y 508 bis 692 (184 px). „Ja, bitte“ ragt 11 px darunter, „Nicht nötig“ 59 px, nach dem Ja „Zu den Karten“ 22 px. Am Computer ist das Blatt 102 px hoch (y 638–740), darüber liegen rund 300 px leere Wand zwischen Blase und Tresen. Die Karteikarte, die Ablagen „Nochmal“/„Gewusst“ und die Zeile „1 im Stapel …“ sind abgeschnitten. `../otto/kal-iphone-02-fach.png`, `../otto/kal-iphone-06-umdrehen.png`, `../otto/kal-computer-06-umdrehen.png`
- **Prinzip:** Die Hauptbedienung ist die eine laute Stelle und immer in Reichweite. Die schlechteste Kante bestimmt den Wert.
- **Gegenvorschlag (10 min, raffael + miyazaki):** Bei offenem Tag `--c6rz-blatt-oben` = Unterkante des Regals + 8 px (am Computer ≈ 320 px statt der Tresenkante). Carl tritt zur Seite, die Blase schweigt, solange das Blatt offen ist. Prüfen mit derselben Messung: Kein Knopf ragt über den Rand.
- **Wertschätzung:** Die Fächer selbst sind vorbildlich: ein Tipp, ein Rahmen, ein Stapel, der wippt. Keine Zahl, kein roter Punkt.

## V2 · Drei Wege für eine Antwort im Brief
- **Bruch + Bild:** Das Briefing mit Angebot zeigt „Ja, bitte“, „Nicht nötig“ und „Später“. Für einen Fremden sind das zwei Arten, Nein zu sagen, und er weiß nicht, welche ihn nie wieder fragt. (Fake-Kalender, Brief vor dem Bau.) `../otto/beleg-iphone-01-brief-drei-wege.png`
- **Prinzip:** Zwei Elemente für dieselbe Handlung, eins bleibt.
- **Gegenvorschlag (10 min, raffael):** Im Brief nur „Ja, bitte“ und „Später“. „Nicht nötig“ (merkt die Ablehnung) bleibt im Tagesblatt, wo man den Termin vor sich hat.
- **Wertschätzung:** Der Brief selbst ist ruhig. Er nennt nur Neues, das Vorbereitete und eine Frage, und die Quelle steht klein darunter.

## Antworten · raffael (16.10.)
- **V1 · gebaut, mit miyazaki abgestimmt (Kreuzungsblatt, „nach der Veto-Runde“).** Bei offenem Tag reicht das Blatt bis zur gemessenen Unterkante des Regals + 8 px; die Welt kann den Wert mit `--c6rz-blatt-oben-offen` selbst setzen. Das Blatt ist so hoch wie sein Inhalt. Rollt es, bleiben Kopf (mit ✕) und Eintrag-Zeile fest stehen, und der Rand ist sichtbar. Ist eine Vorbereitung offen, treten die anderen Zeilen zurück, und das Ding beginnt gleich unter dem Kopf. Gemessen (Knopf oder Feld halb über dem Rand):
  - iPhone, Angebot: 0 (Blatt 353–692, „Ja, bitte“ 497–541, „Nicht nötig“ 545–589).
  - iPhone, nach „Ja“: 0. Ohne Kalender, nach dem Eintragen: 0.
  - Computer, alle Zustände: 0.
  - **Offen:** iPhone, leerer Stapel ohne Mitdenken: das erste Feld des Formulars („Was willst du gefragt werden?“, y 675–719) liegt am Rand 692. Paperts leerer Stapel (Platzhalterkarte + Satz + zwei Felder + Knopf) ist höher als die 340 px Innenraum am iPhone. Das gehört zu Paperts V1 (Formular klappt zu, Stapel oben); danach messe ich noch einmal.
  - Carl zur Seite und die Blase still, solange ein Tag offen ist: miyazaki.
  - Bilder `../raffael/v-kal-*-{iphone,computer}.png`, Skript im Scratchpad `s13_veto.py`.
- **V2 · gebaut.** Im Brief gibt es nur noch „Ja, bitte“ und „Später“ (gemessen: genau diese zwei sichtbar, iPhone und Computer). „Nicht nötig“ gibt es nur im Tagesblatt, beim Termin.
