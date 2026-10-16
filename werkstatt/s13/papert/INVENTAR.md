# Inventar s13 · Wo „Passt / Anders“ nur „bestätigen“ heißt (papert + rams, 16.10.2026)

Maßstab (Rams): Ein Knopf trägt eine Handlung. „Passt“ trägt keine eigene Handlung, es nickt nur ab, was Carl schon entschieden hat. „Anders“ ist dann ein Knopf, wenn danach ein echter Wunsch eingegeben wird. Wenn er nur „nein“ heißt, ist er keiner.
Geprüft mit `grep` über `src/` (Stand v31, Branch carl6) und mit echten Klicks im Space und im Himmel.

## Gebaut (in space.js und netz.js, unser Teil)

| # | Stelle | Vorher | Urteil | Jetzt |
|---|---|---|---|---|
| 1 | `space.js` `naehreKern` (≥3 Zettel, kein Kernsatz) | „Vielleicht ist das dein Kernsatz: … Passt / Anders“ | nur bestätigen | Mit Mitdenken hängt Carls Vorschlag als Carl-Zettel an der Leine, einmal je Space (`x.kernVorschlag`). Antippen → „Wird der Kernsatz“. Ohne Mitdenken zuckt dein eigener Satz an der Leine, Carl sagt, welcher. Bei keinem von beiden gibt es einen Bestätigungsknopf. |
| 2 | `space.js` `naehreSchritt` (Kernsatz steht, kein Schritt) | „Ein nächster Schritt könnte sein: … Passt das? Passt / Anders“ | nur bestätigen | gestrichen. Carl sagt einen Satz zur Lage, und die vier Karten am Boden wippen. Den Schritt macht die Karte „Machen“ (Vorschlag → „Bis wann?“, das ist eine echte Frage). |
| 3 | `space.js` `zettelFrage` (Zettel antippen) | „Hängen lassen / Wird der Kernsatz / Abnehmen“ | „Hängen lassen“ heißt „nichts tun“ | „Hängen lassen“ gestrichen, denn wer daneben tippt, lässt ihn hängen. Die vier Karten meinen jetzt diesen Zettel (rot umrandet, „zu ‚…‘“ über den Karten). Geblieben sind „Wird der Kernsatz“ und „Abnehmen“, weil nur ein einzelner Zettel das kann. |
| 4 | `netz.js` `ersterFragen` (erster Planet aus „du baust …“) | „Soll das dein erster Planet werden? Passt / Anders“ | Bestätigung mit Namen | Die Chips sagen jetzt, was sie tun: „‚…‘ aufgehen lassen“ / „Einen anderen Namen“. |
| 5 | `netz.js` Planet antippen | flog sofort hinein | – (nicos Wunsch) | Blatt „von oben“: Pflanze, Zuletzt (echte Geschichte), Carls Stand-Satz (nur gezählt), die vier Karten, „Hineingehen“. |

## Wünsche an fremde Dateien – 6–11 am 16.10. selbst gebaut (Besitz übertragen), 12 bei Rune

| # | Datei · Stelle | Was dort steht | Urteil | Vorschlag |
|---|---|---|---|---|
| 6 | `darstellung.js:669` (Waage, Skizze, Zwei Wege, Schritte …) | „Passt“ hängt die Darstellung in den Space, „Anders“ fragt nach | „Passt“ = nur bestätigen | Die Darstellung hängt gleich als Ding im Space, mit Rückweg „Abnehmen“ wie beim Zettel. Darunter liegen die vier Karten (`C6.vorschlaege.male(el,{quelle:{sid, satz: titel}})`). „Anders“ bleibt als Bleistift am Ding, weil danach ein echter Wunsch eingegeben wird. |
| 7 | `werkzeug.js:385` (nach dem Bauen, Rezeption und Space) | „Passt / Anders“ | „Passt“ = nur bestätigen, „Anders“ = echter Wunsch | „Passt“ → „Neben mich stellen“ (Rezeption) bzw. „Aufhängen“ (Space), dann sagt der Knopf, was er tut. „Anders“ bleibt. (raffael, Rezeption) |
| 8 | `bibliothek.js:1296` (Sanduhr → kein Space) | „Soll ich einen anlegen: ‚Gemessene Zeiten‘? Passt / Anders“ | Bestätigung mit Namen | „‚Gemessene Zeiten‘ anlegen“ / „Anderer Name“ |
| 9 | `zuhause.js:828` (Knäuel) und `kern.js:2148` (Satz-Name) | „Ich nenn ihn ‚…‘? Passt / Anders“ | Bestätigung mit Namen | „So nennen“ / „Anderer Name“. Besser noch: Der Name steht im Feld, Enter übernimmt ihn, und wer tippt, ändert ihn. |
| 10 | `bausteine.js:134` (Schild antippen) | „Geschafft / Anders / Abnehmen“ | echt (drei Handlungen) | bleibt. Nur „Anders“ → „Neu schreiben“, weil das tut, was der Knopf sagt. |
| 11 | `rundgang.js:15` (Name im Rundgang) | Chip „Passt“ | Bestätigung | „So heißt er“ |
| 12 | `stimme.js` `naehren.ja`, `naehren.anders`, `naehren.kernsatz`, `naehren.schritt` | Sätze für 1 und 2 | werden nicht mehr gerufen | Rune: streichen oder für `naehren.kernAufgehaengt` / `naehren.kernDeiner` / `vorschlag.lage` umschreiben (neue Schlüssel, Ersatzsätze im Code). |

Nicht betroffen (echte Eingabe): `werkzeug.js` „Anders“ im großen Blatt (`umbauen`) · `darstellung.js` „Anders“-Feld · `space.js` „Nimm ihn / Ich schreib selbst“ beim Kernsatz-Vorschlag auf eigene Frage (der Mensch hat danach gefragt) · `werkstatt.js` Zeile 2105 `passt()` (Rechenfunktion, kein Knopf).
