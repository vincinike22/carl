# s12 · Rune · Vor der Probe (14.10.2026, abends)

Gelesen: AUFTRAG s12, KREUZUNG s12 (Vertrag), NAMEN s5, GRUNDSAETZE, `stimme.js` ganz, `werkzeug.js` (baue, haenge, oeffne, bauen, wohin), `kern.js` (C6.denk, C6.mitdenken, C6.fest, Speichern). Noch kein Raum-Code von raffael, papert, miyazaki vorhanden – die Fragen gelten dem Vertrag und dem, was heute schon im Code liegt.

## Die vier Fragen

**1 · Was davon ist Bewunderung eines Meisters und noch nicht unser eigenes?**
Die Rezeptionskarte (Satz oben, Ding, Passt/Anders) ist unser eigenes Blatt aus s11 – gut, dass sie wiederverwendet wird. Die Beispiel-Karten als „Dinge zum Denken“ sind Paperts Lehre; sie werden unser, wenn jede Karte wirklich bedienbar ist und nach dem Antippen *genau dieses* Werkzeug entsteht. Bleiben es Bildchen mit Satz, ist es Bewunderung. Die Kosten-Zeile ist ganz unser: kein Vorbild zeigt gemessene Denkzeit ohne Geldzahl. Sie muss darum besonders wahr sein.

**2 · Wo bläht es sich auf?**
Auf der Karte nach dem Bau stehen heute drei Sätze von mir übereinander: *gebaut* (oben), *gemerkt* (nach Passt), *kosten* (unten). Dazu die Vorlagen-Reihe aus `werkzeug.js` („Oder nimm eins zum Anfang“, zwei Vorlagen) – an der Rezeption sind die Beispiel-Karten schon da; die zwei Vorlagen im Blatt sind dann ein zweites Beispiel-Regal und müssen für die Rezeption weg. Und: *gebautVorlage* und *kostenVorlage* sagen beide „Vorlage“ – auf einer Karte zweimal. Ich habe *gebautVorlage* darum auf „probier sie aus“ gedreht; Rams prüft, ob eine der beiden Zeilen fällt.

**3 · Was versteht ein Mensch nicht, der Carl zum ersten Mal sieht?**
„Werkzeug“ – ein Fremder hat noch nie ein „Werkzeug“ aus einem Satz gesehen. Der erste Satz sagt darum „ich bau dir was“, nicht „ein Werkzeug“; das Wort kommt erst, wenn das Ding da ist (*gemerkt*). „Vorlage“ versteht er. „Claude (über claude.ai)“ versteht er nicht – aber es ist die Wahrheit über den Kopf, und sie steht nur in der kleinen Zeile. „Passt / Anders“ versteht er, wenn das Ding dazwischen echt ist. Was er nicht versteht, wenn es fehlt: **dass das Feld unten zur Rezeption gehört.** Der Platzhalter „Was soll ich dir bauen?“ muss im geliehenen Dock-Feld sichtbar sein, nicht nur im Blatt.

**4 · Wo staunt er – und wo wird ihm die Magie vorab erklärt oder untergejubelt?**
Staunen: wenn aus *seinem* Satz vor seinen Augen etwas entsteht, das er sofort anfassen kann. Vorab erklärt: kein Onboarding-Text – gut. Untergejubelt wäre: ein Werkzeug, das ohne „Passt“ gespeichert wird (heute hängt `wohin()` erst nach Passt – bleibt so); ein Beispiel, das wie Daten aussieht (Zahlen, Namen); ein Spinner, der „denkt“ sagt, während nur eine Vorlage kommt. Die Zeile *baut* („Ich bau es dir. Schau zu.“) verspricht darum kein Denken, nur Bauen – das ist in beiden Zuständen wahr.

## Ist die Kosten-Zahl wahr in jedem Zustand?
Heute gibt es **drei** Zustände, der Vertrag kennt nur zwei (`von: 'denk' | 'vorlage'`):
1. Ein Kopf hat geantwortet, Antwort brauchbar → `von = 'denk'`, `C6.mitdenken().wer` gesetzt, Zeit gemessen → **kostenDenk** ist wahr.
2. Kein Kopf (kein `window.claude.use('sample')`, `stumm: true` → `beispiel()` liefert sofort `''`) → `ausVorlage`, `von = 'vorlage'`, `C6.mitdenken().echt === false`, Zeit ≈ 0 → **kostenVorlage** („Gedacht hab ich hier nicht, gekostet nichts“) ist wahr.
3. Ein Kopf hat geantwortet, aber kein brauchbares JSON, oder die 25-Sekunden-Wache hat zugeschlagen → ebenfalls `von = 'vorlage'`, aber **gedacht wurde, bis zu 25 Sekunden, und es hat gekostet.** Hier wäre *kostenVorlage* eine Lüge. Dafür gibt es den neuen Schlüssel **kostenDenkVorlage** ({sek}, {kopf}). raffael muss diesen Zustand erkennen: `von === 'vorlage'` **und** (`C6.mitdenken().echt === true` oder gemessene Zeit > 1 s). Besser: `baue()` gibt `von: 'vorlage-nach-denk'` zurück, wenn `C6.mitdenken().echt` nach dem Versuch wahr ist.
Gefahr dabei: `md` im Kern ist **klebrig**. Erfolg setzt `echt = true`, kein Kopf (`beispiel()`) setzt `echt = false` – aber ein **Fehler** von Claude (Zeile ~2587: nur `md.grund = code`) lässt `echt` auf dem alten Wert stehen, und `nochmal()` versucht es im Hintergrund weiter. Ein früherer Erfolg im Gespräch kann also „Claude hat gedacht“ melden, obwohl dieser Bau gescheitert ist. Darum darf raffael `C6.mitdenken()` nicht allein befragen: Wahr ist nur, was `baue()` selbst weiß – kam ein Text zurück (dann hat der Kopf gedacht, Zeit = gemessen) oder nicht (Zeit ≈ 0 → Zustand 2; Zeit groß, kein Text → Zustand 3, Kopf = der, den `bus 'denkt' {kopf}` beim Start gemeldet hat).
Nach Timeout (`Promise.race`) läuft die Anfrage im Hintergrund weiter und setzt `md` später – wer `C6.mitdenken()` erst nach „Passt“ liest, kann den falschen Kopf erwischen. Darum: `kopf` und `gedacht` **einmal** beim Eintreffen von `baue()` festhalten und im `rezeption-gebaut`-Ereignis mitgeben (so steht es im Vertrag – gut).
{sek}: `Math.round(ms/100)/10`, mit Komma („3,8“); bei < 0,1 s steht „0,0 Sekunden“ – dann ist es ohnehin Zustand 2.

## Ist „Das hab ich mir gemerkt“ wahr?
`haenge(spec, sid)` speichert: `name`, `zeichen`, `farbe`, `teile` (Bausteine mit Schlüsseln), `satz` (gekürzt auf 200 Zeichen), `von`, `id`, `sid = null`, `ts`. Dann `C6.speichern()` → `localStorage`; mit Anmeldung zusätzlich privat unter `data/users/<id>/carl` (sync.js). Nichts geht an Dritte, nichts ins Teleskop ohne Tipp.
Mein Satz nennt **Satz und Werkzeug** und sagt „Beides gehört dir“ – das ist wahr. Er sagt nicht „mehr nicht“, weil Carl auch die Bausteine und die Uhrzeit behält.
Zwei Haken: (a) **Satz über 200 Zeichen** wird gekürzt gespeichert – dann zeigt *gemerkt* den ganzen Satz, gemerkt ist aber der gekürzte. raffael soll `w.satz` (das Gespeicherte) einsetzen, nicht die Eingabe. (b) `C6.fest` („Stimmt so nicht“) kennt heute nur Schlüssel aus dem Freundschaftsbuch; ein Werkzeug-Name ist dort nicht als Schlüssel vorgesehen. „Stimmt so nicht“ an der Gemerkt-Karte muss also in `werkzeug.js` landen (Name ändern = `umbauen`/Fassung), sonst ist der Link ein Versprechen ohne Tür.

## Mängel für diese Runde (die Meister beheben)
1. **Dritter Kosten-Zustand** (Kopf gefragt, Vorlage bekommen): `baue()`/`C6.werkzeug.rezeption` muss ihn liefern; dann *kostenDenkVorlage*. Sonst lügt die Zeile bis zu 25 Sekunden. (raffael)
2. **`{name}` in *gemerkt*** wird von `stimme.js` automatisch mit dem Namen des Menschen gefüllt, wenn der Aufrufer kein `name` mitgibt → „dein Werkzeug „““. Immer `{satz: w.satz, name: w.name}` mitgeben. (raffael)
3. **Die zwei Vorlagen im Blatt** („Oder nimm eins zum Anfang“) sind an der Rezeption ein doppeltes Beispiel-Regal und tragen erfundene Sätze mit „Mama“ – an der Rezeption weg oder durch Paperts Beispiele ersetzt. (raffael, papert)
4. **„Stimmt so nicht“ braucht eine Tür**: an der Gemerkt-Karte muss er den Namen ändern lassen (bestehendes `umbauen` oder ein Feld), nicht ins Freundschaftsbuch führen. (raffael)
5. **Platzhalter im Dock-Feld**: `C6.feld.leihen` mit `rezeption.feld`, sichtbar auch auf iPhone über der Tastatur. Ohne das versteht der Fremde nicht, wo der Satz hin soll. (raffael)
6. **`unsinn` nur bei wirklich Unbaubarem** (keine Buchstaben, ein Zeichen): ein einzelnes Wort wie „Laufen“ ist baubar (Vorlage „Jeden Tag“) – lieber bauen und „Anders“ anbieten als fragen. Fehler sind Spielzeug. (papert)
7. **Beispiele ohne Daten**: Haken leer, Zähler 0, Liste ohne Punkte, Termin ohne echtes Datum (oder sichtbar „Beispiel“). Keine Namen, keine Zahlen, die echt aussehen. (papert, rams)
8. **Die Baut-Zeit sichtbar, nicht als Spinner**: Paperts Uhr mit *denkt* ({sek}); nach dem Timeout *gewartet* („25 Sekunden sind um“ – die 25 stehen so in `baue()`; ändert jemand die Wache, muss der Satz mit). (raffael, papert)
9. **Nach Passt kein „Wo soll es stehen?“** – `wohin()` fragt heute nach Spaces, sobald es welche gibt. Die Rezeptions-Tür muss `haenge(sp, null)` direkt rufen. (raffael)
10. **Ein Satz je Zustand, nie zwei**: Vorlage-Karte zeigt *gebautVorlage* oben und *kostenVorlage* unten – Rams entscheidet, ob eine fällt; ich halte *kostenVorlage* für die wichtigere (sie ist die Kosten-Zeile und sagt die Wahrheit über das Denken). (rams)
11. **Nach einem Beispiel ist der Satz nicht „dein Satz“**: Tippt der Fremde eine Beispiel-Karte an, war der Satz Carls. *gemerkt* („deinen Satz“) wäre dann eine Lüge – bei `bei` gesetzt *beispielGebaut* ({name}) nehmen. (raffael)
12. **Nach „Anders“ ist der gespeicherte Satz zusammengeklebt** (`satz + '. Anders: ' + a`, werkzeug.js `bauen`). *gemerkt* zeigt dann „Ich will … . Anders: ohne Zahl“. Wahr, aber hässlich – entweder so zeigen (wahr) oder `w.satz` = letzter ganzer Wunsch speichern und das Anders als eigene Fassung. Nicht: den ersten Satz zeigen und den geklebten speichern. (raffael)
13. **„So eins für mich“ an der Beispiel-Karte**: mit einem Kopf kann das gebaute Werkzeug vom gezeigten abweichen („genau dieses“ aus Entscheidung 2 wäre dann falsch). Entweder Beispiele immer über `ausVorlage` bauen (sofort, wahr: „Gedacht hab ich hier nicht“) oder der Knopf sagt „So eins“ und die Karte zeigt, was wirklich kam. Frage an Vitruvian. (raffael, papert)

## Ungeprüft
- Ob `C6.feld.leihen` den Platzhalter auf iPhone über der Tastatur hält – erst mit raffaels Raum prüfbar.
- Ob `Claude (über claude.ai)` in der Kosten-Zeile einen Fremden abschreckt oder beruhigt – Otto-Probe.
- Mein Satz „Was das kostet, weiß ich noch nicht“ beim eigenen Rechner: dort kostet es kein Geld, nur Strom. Ob die Zeile dann anders lauten soll, entscheidet Vitruvian (siehe Rückmeldung).
