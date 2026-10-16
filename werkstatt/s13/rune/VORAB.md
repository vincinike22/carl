# s13 · Rune · vor der Probe (16.10.2026)

Gelesen: AUFTRAG s13, KOMMENTARE (37 Threads), Kreuzungsblatt (raffael, miyazaki, papert+rams, warhol), `stimme.js` ganz, `auftrag.js` (raffaels Briefing-Umbau inbegriffen), `tage.js`-Vertrag, `kern.js` (`C6.denk`, `C6.mitdenken`), NAMEN s5 + s12, Vertrag der `mcp`-Fähigkeit (Fehlercodes).
Geschrieben: 144 neue Schlüssel + `rezeption.erst` neu. Tabelle „wahr nur, wenn“ im Kreuzungsblatt, Abschnitt „s13 · Rune“.

## Die vier Fragen vor der Probe

**1 · Was davon ist Bewunderung eines Meisters und noch nicht unser eigenes?**
Das Fächerregal ist das Schlüsselbrett eines Hotels – geliehen, aber es trägt echte Daten, das macht es zu unserem. Noch geliehen ist der Katalog als „Versandkatalog“: ein schönes Zitat aus Warhols Welt, aber was daran ist *Carl*? Prüffrage für warhol: Steht im Heft irgendwo, wofür *dieser* Mensch das Ding braucht – oder nur, was es kostet?

**2 · Wo bläht sich das Werk auf?**
Drei Dinge zeigen dasselbe: das Fächerregal, das Tagesblatt am Tresen und der Brief („heute … die nächsten Tage …“). Wer den Brief liest und dann das Regal sieht, liest alles zweimal. Vorschlag: Der Brief nennt nur, was *neu* ist seit gestern und was Carl vorbereitet hat, plus die eine Frage; das Regal trägt den Rest. Dazu: 144 Sätze sind viel. Jeder Zustand braucht einen Satz – aber nicht jeder Zustand braucht einen eigenen Raum auf dem Bildschirm.

**3 · Was versteht ein Mensch nicht, der Carl zum ersten Mal sieht?**
Ohne Kalender sind sieben Fächer leer. Ein Fremder sieht dann ein leeres Regal und ein Beispiel – und versteht nicht, *woher* Carl je etwas wissen soll. Der eine Satz `kalender.nicht-verbunden` plus der Chip „Wie verbinde ich ihn?“ müssen am leeren Regal stehen, nicht im Buch. Zweitens: „Für dich arbeiten lassen“ – wer ist „du“, wer arbeitet? Darum nennt der Satz Ferdl. Hat der Fremde Ferdl noch nie gesehen, ist das ein Name ohne Gesicht.

**4 · Wo staunt er – und wo wird ihm die Magie vorab erklärt oder untergejubelt?**
Staunen: Carl hat für die Prüfung schon Karten *angeboten*, und ein Tipp legt einen Stapel ins Fach, der wippt. Das darf ohne Erklärung passieren. Vorab erklärt wird es, wenn der erste Satz an der Rezeption sagt, was das Regal *kann* – darum sagt `rezeption.erst` nur „hinter mir liegen deine nächsten Tage“, nicht „ich zeig dir Termine aus deinem Kalender“. Untergejubelt wäre es, wenn Carl Karten baut, ohne gefragt zu haben (AUFTRAG 4 verbietet das, gut so), oder wenn ein leeres Beispiel-Fach wie ein echtes aussieht.

## Konkrete Mängel (für die Veto-Runde)

1. **Sackgasse ohne Mitdenken (raffael ↔ papert).** raffael: Karteikarten/Packliste ohne Kopf → `ok:false`, kein Werkzeug, Satz `vorb.keinKopf`. Das ist ehrlich, aber endet ohne nächsten Handgriff. papert: leerer Stapel mit „vorne die Frage, hinten die Antwort“. Ich habe beide Sätze geschrieben; nur paperts Weg erfüllt „Fehler sind Spielzeug“. Entscheidung Vitruvian.
2. **„Nicht verbunden“ kann lügen.** Läuft die Seite außerhalb von claude.ai (`claude.use('mcp')` = null, `not_granted`), hilft Verbinden nicht. raffaels Status kennt dafür keinen Zustand. Neuer Schlüssel `kalender.geht-nicht`; raffael braucht den Zweig.
3. **Anrede fest verdrahtet.** auftrag.js schreibt „Hallo {name},“ fest. Ein Briefing am Morgen sagt „Guten Morgen“. Schlüssel `brief.anrede.*` liegen bereit.
4. **„Nichts verbunden“ = kein Brief.** `C6.tage.brief()` gibt null, wenn gar nichts da ist. Dann liegt nie ein Brief im Postfach, und ein Fremder lernt das Postfach nie kennen. Vorschlag: ein ehrlicher erster Brief (`brief.nichtsVerbunden` + `brief.frageVerbinden`), höchstens einmal. Frage an Vitruvian.
5. **Doppelte Art-Namen** `karteikarten` (raffael) / `karten` (papert). Muss eins werden, sonst greift kein Satz.
6. **`satz()` in auftrag.js leert unbekannte Platzhalter**, `fest()` lässt sie stehen. Zwei Verhalten für denselben Fehler. Ein Satz mit fehlendem `{titel}` wird in der Rezeption zum Ersatz, im Brief zu „„“ ist morgen.“ – Vorschlag raffael: in `satz()` bei unbekanntem Platzhalter wie rezeption.js auf den Ersatz fallen.
7. **„Für dich arbeiten lassen“ ohne Kopf** (`vorschlag.arbeiten.ohneKopf`) hat keinen Handgriff. Ehrlich, aber leer. Besser wäre: Thema notieren, Ferdl liest nach, sobald jemand mitdenkt – nur wenn der Code das wirklich speichert.
8. **Markennamen.** „Google Kalender“, „Apple Kalender“, „Mac“ stehen im Werk. Ich halte das für nötig (der Mensch muss wissen, *was* er verbindet), kein Logo, keine Farben. Grundsatz „keine fremden Marken“ – nico oder Vitruvian bitte bestätigen.
9. **Ungeprüft:** die deutsche Beschriftung in den Claude-Einstellungen („Konnektoren“?) für `kalender.wie`; ob die Recherche Ferdls im Space wirklich startet; das Ergebnisformat von `list_events` (Werkstatt hatte „Forbidden“). Dass die Zustandssätze im echten Zustand erscheinen, prüfe ich erst als Otto mit echten Klicks.

Rune, 16.10.
