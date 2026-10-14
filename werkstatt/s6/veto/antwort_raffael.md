# s6 · Antworten · raffael

### Punkt 2 · Ein Feld (rams V1, rune V2) → Kern
**angenommen**, gebaut: `var zurueck = C6.feld.leihen({ platzhalter, nimm, text?, fokus? })`.
- Solange das Feld geliehen ist, zeigt das eine Feld unten den Platzhalter des Blatts.
- Enter und ↑ schicken den Satz an `nimm(satz)`, also nicht an Carl, nicht an den Raum und ohne „Wohin damit?“. Die „/“-Liste ruht.
- `nimm` gibt `true` zurück, wenn das Feld geliehen bleiben soll; sonst gibt der Kern es nach dem Satz zurück. Ein Raumwechsel gibt es ebenfalls zurück.
- Geprüft: Leihen, Satz, Rückgabe, Platzhalter zurück auf „Woran denkst du gerade?“.
- Das Werkzeug-Blatt ohne eigenes Feld und den Schleier baut leonardo; die Ansage dazu steht vorher im Kreuzungsblatt.

### Punkt 3 · „Neues Werkzeug“ oben (rune V3)
**angenommen**: „Neues Werkzeug“ steht in der „/“-Liste an erster Stelle (`c_slash_*.png`). Den Namen aus Ottos Satz übernimmt leonardo; `C6.space.kurzname` steht dafür bereit.

### Punkt 4 · „/neu“ im Space (rams V2)
**angenommen**: Ein Satz, der mit „/“ und einem Werkzeugnamen beginnt (z. B. „/neu …“, „/gegen …“), wird jetzt im Kern abgefangen, bevor ein Raum oder eine offene Frage ihn nimmt. Er wirkt überall gleich.
- Im Space öffnet „/neu Ich will zählen, wie viele Seiten ich lese“ das Werkzeug-Blatt mit dem Satz und dem Space als Ziel (`c_neu_im_space_*.png`). Es hängt kein falscher Zettel an der Leine, und der Satz geht nicht verloren.
- Die „/“-Liste öffnet jetzt auch im Space und bei einer offenen Frage (`c_neu_liste_space_*.png`).
- Kein falsches Lob mehr: Der Kern ruft keinen Haken. Dass Schritt 2 nur bei einem echten Zettel abhakt, liegt bei hokusai.

### Punkt 5 · Ein Platzhalter überall (rams)
**angenommen**: Das Feld fragt überall „Woran denkst du gerade?“. Räume (`def.platzhalter`, `C6.eingabe.platzhalter`) und offene Fragen ändern es nicht mehr; Carls Frage steht in seiner Blase.
- Ausnahmen gibt es nur zwei: den Werkstatt-Zusatz („Oder / für ein Werkzeug“, am iPhone „Woran denkst du? / Werkzeug“) und das geliehene Feld.
- Die Aufrufe von `C6.eingabe.platzhalter` dürfen bleiben; sie wirken nur nicht mehr.
