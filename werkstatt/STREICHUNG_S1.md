
## s1 · miyazaki + monet · Space, Bausteine, Beamer, Wetter
| Was | Wo | Warum |
|---|---|---|
| Beamer-Modul (ganzer Baustein mit Leinwand, Bildern, Seiten, Anbindungs-Platzhalter) | `src/module/beamer.js` → abgelegt als `werkstatt/s1/miyazaki/abgelegt/beamer.js.txt` | Overkill (nico). Der Projektor bleibt. Platzhalter `C6.beamer` in kern.js fängt Aufrufe ab; werkstatt.js `hatBeamer()` ist jetzt immer false. |
| Platz für ein späteres echtes Artifact | `space.js` dingZeigen: Ergebnis-Blätter tragen unten einen ehrlichen Satz | statt eigenem Baustein |
| Regal mit Bausteinen (Computer neben dem Pfahl, iPhone unter den Schildern) | `space.js` (regal, bsFeld, Binden) | Bausteine lagen frei in der Landschaft, ohne Bezug zur Schleife |
| Bausteine Essen, Schlaf, Kalender-Ansicht (Monatsraster), Zu-tun-Liste, Begleiter mit 14-Tage-Punkten | `bausteine.js` | ersetzt durch Nächster Schritt (genau einer), Termin (bis wann), Gewohnheit (heute antippen) |
| Fremde Bausteine („Carl bringt’s bei“ aus lehre.js, Beamer) | `C6.bausteine.registriere` ist jetzt leer | drei Bausteine, nicht mehr; die Lehre bleibt in der Werkstatt erreichbar |
| Ziehen aus dem Regal, Verschieben in der Landschaft, Zurück-ins-Regal | `bausteine.js` | kein Drag & Drop ohne Sinn; Anhänger hängen an der Leine |
| Anbindungen (Whoop, Fitbit, Strava) | nur noch in stimme.js (ungenutzte Sätze) | Platzhalter ohne Nutzen |
| Wetter aus Planet + Art (Dauerregen, Dauerschnee, Dauernebel) | `space.js` STUNDE/WETTER | Hell ist der Normalfall |
| Tageszeit aus Art/Farbe/Name (Ideen-Spaces dauernd nachts/Dämmerung) | `space.js` ZEIT_STICH, STUNDE | Tageszeit folgt der echten Uhr |
| Nachtdach und Sternwarte im Zufallspool für Ideen | `space.js` POOL/START | dunkle Places nur noch, wenn der Name es sagt oder man sie selbst wählt |
| Wetter in der Unterzeile („Projekt · am Morgen · draußen Schnee“) | `space.js` | Unterzeile nur noch Art · Tageszeit |
| „Wisch, dann gehen wir hin“ beim neuen Space; Place-Satz beim Betreten | `space.js` begruessen | Carl sagt beim Betreten, wo du stehst, und bietet genau eins an |
| „Sag mir, woran du hier denkst“ im leeren Gespräch | `space.js` | doppelte Einladung neben Carls Satz |
| Beamer-CSS (`c6w-bm-*`), Regal-/Landschafts-CSS (`c6z-bs-*`) | `src/kern.css` | bleibt als toter Text liegen (kern.css nicht angefasst); kann beim nächsten Aufräumen raus |

## rothko + jung · Freundschaftsbuch (Entscheidung 5) und Karte des Wissens (Entscheidung 6)
| Was | Wo | Warum |
|---|---|---|
| Seite „Inhalt“ (Inhaltsverzeichnis) | `src/module/atlas.js` | zehn Seiten brauchen kein Verzeichnis; Blättern und die Fußzeile genügen |
| Seite „Das bin ich“ (Lieblingsort, Essen, Kann ich, Lernen, Traum, Lieblingsfarbe) | `atlas.js` | doppelt neben „Du“; das Buch fragt nur noch, was Carl wirklich braucht (wer du bist, woran du baust, Ton). Alte Einträge bleiben in `S.atlas.du` liegen, nichts wird gelöscht |
| Sieben Einzelseiten „Wer du bist / Woran du baust / Was ich tun soll / Was ich nie tun soll / Dein Ton / Damals / Begleiter“ | `atlas.js` | zusammengelegt zu „Du“ und „Was ich für dich tue“; „Damals“ sammelt jetzt selbst gemeinsame Momente |
| Kapitel „Begleiter“ im Buch | `atlas.js` | gehört nicht ins Freundebuch; bleibt in der Bibliothek (Brücke: `bibliothek.js` ueberAuf öffnet nur Kapitel, die das Buch hat) |
| Seiten „Was mich stärker macht“ und „Mitdenken“ als eigene Seiten | `atlas.js` | zu einer Anhang-Seite „Carl stärker machen“ zusammengelegt (Stand „Gerade jetzt“ steht dort in einer Zeile); Gerät und Claude Code bleiben als Anhang-Seiten |
| Gestreifte Leinen-Textur auf dem Einband | `kern.css` (überschrieben in `atlas.css`) | Textur-Imitat; Tiefe kommt jetzt aus drei Rosé-Tönen |
| Weg als fertige rote Linie, die nur nachgezogen wird; Carl in gerader Linie | `src/raeume/lesesaal.js` | ersetzt durch Bleistiftspur → Feder zieht in Tinte nach; Carl geht den Weg selbst entlang |
| Carl-Abstand von 72 Karten-Einheiten neben der Station (stand am iPhone im Meer) | `lesesaal.js` kartePunkt | ersetzt durch gemessenen Stand neben dem Haus |
