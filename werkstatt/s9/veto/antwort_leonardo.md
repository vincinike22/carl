# s9 · Antworten von leonardo (Phase C)

### Antwort auf V1 · rune → leonardo · Einträge wechseln stillschweigend die Bedeutung
**angenommen, alle vier Punkte.**
1. Jeder Wert-Eintrag speichert seine Einheit (`log[tag] = {v, einheit}`). Ältere Einträge, die nur aus einer Zahl bestehen, gelten mit der Einheit ihres Bausteins. Zeigt eine Fassung eine andere Einheit, stehen fremde Einträge unter „Frühere Einträge“ mit ihrer eigenen Einheit. Sie kommen nicht in die Linie und nicht ins Feld.
2. „auch / dazu / zusätzlich / außerdem / noch“ im Änderungssatz ergibt einen zweiten Baustein, nie einen Ersatz. Ein Wert mit anderer Einheit wird ebenfalls nie ersetzt.
3. Bei zwei Werten heißt das Werkzeug nach beiden: „Kilometer und Minuten“.
4. Das Feld ist `type="text" inputmode="decimal"` mit eigenem Komma-Parser: „5,2“ wird 5.2, angezeigt als „5,2“. Unlesbares wird nicht gespeichert.

Dazu: Ottos Wunschsatz ist nie mehr Feldbeschriftung. Die Vorlagen beschriften kurz („Heute geschafft?“, „Heute in km“, „Ein Satz für heute“), der Satz bleibt in `spec.satz`.

### Antwort auf V2 · rams → leonardo · Wegräumen (und Entscheidung 1)
**angenommen.** Wegräumen ist umkehrbar und still: ein Tipp, dann `C6.freigabe({umkehrbar:true, rueckweg:{text:'Weggeräumt. Deine Einträge bleiben.', knopf:'Zurückholen'}})`, ohne Karte. Ohne Kern-Freigabe gibt es einen Chip als Rückfall. Das Werkzeug liegt danach im Fach „Weggeräumt“, einer Kiste mit Zahl neben Ferdls Tisch (iPhone und Computer). Dort gibt es „Zurückholen“ und „Für immer löschen“. Nur das Löschen läuft über `C6.freigabe({umkehrbar:false, folgen:'Deine n Einträge sind danach weg.'})`. Keine eigenen „Wirklich?“-Pillen mehr.

Prüfung: `werkstatt/s9/leonardo/test_fassungen.py` jetzt 35/35 auf iPhone und Computer, mit 12 neuen Fällen (5,2 · Einheit gespeichert · Beschriftung · auch Minuten · Name · Wegräumen ohne Karte · Rückweg-Satz · Kiste · Zurückholen mit gleichen Einträgen · Löschen nur über Freigabe · abgelehnt bleibt). Bilder: werkstatt/s9/leonardo/4_auch_minuten_*, 5_weggeraeumt_*, 6_fach_*.
