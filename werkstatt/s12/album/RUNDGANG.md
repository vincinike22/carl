# Zweites Album · s12

| Gestrichen | Wo es lebt | Wie man es zurückholt |
|---|---|---|
| Rundgang als Startbildschirm (schlafender Carl, Name, Gedanke, Space, Himmel, Socken) | `src/raeume/rundgang.js` bleibt im Code, Raum `rundgang` erreichbar über `#raum=rundgang` | In `src/start.js` die Regel „Fremder → rezeption“ auf `rundgang` zurückstellen. Geplant: in s14 als Challenge „Carl kennenlernen“ zurück. |
| Vorlagen „Oder nimm eins zum Anfang“ im Bau-Blatt an der Rezeption | Werkstatt-Pfad (`C6.werkzeug.oeffne`) unverändert | In `werkzeug.js` die Tür `rezeption()` den Wunsch-Schritt nicht überspringen lassen. |
| Himmel-Knopf an der Rezeption für Fremde ohne Space | Kern: `def.regler` als Funktion | In `rezeption.js` `regler: true` setzen. |
