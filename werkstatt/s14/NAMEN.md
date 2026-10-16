# Namen s14 (ein Ding, ein Name; neue Wörter hier eintragen, Rune prüft)

Gilt weiter: werkstatt/s5/NAMEN.md, werkstatt/s12/NAMEN.md.


## s14 · raffael (Katalog)
| Wort | Bedeutet | Schlüssel (Rückfall im Code) |
|---|---|---|
| **Katalog** | das eine Heft in der Garage (Lampen, Sessel, Dinge für die Spaces) | – |
| **Holen · n** | die eine Handlung unter einer Ware, die noch nicht deins ist: zahlt n Münzen und stellt sie hin | `einrichten.heft.holen` („Holen“) |
| **Hinstellen** | die Handlung, wenn die Ware schon deins ist | `einrichten.heft.hin` |
| **Einrichten** | bei einem Space im Katalog: öffnet ihn mit dem Einrichten-Blatt | `einrichten.heft.einrichten` |
| **steht bei dir** | Tusche-Punkt: genau das steht/hängt jetzt in deinem Raum oder Space | `einrichten.heft.steht` |
| **deins** | gehört dir, steht aber gerade nicht | `einrichten.heft.deins` |
| **Du hast ◉ n** | Münzen in der Tasche, oben auf jeder Katalogseite mit Preisen | `einrichten.heft.tasche` („Du hast“) |
| (Satz) | „Noch {n} Münzen. Im Kieselpark gibt es welche.“ | `einrichten.heft.fehlt` {n} |
| (Satz) | „{n} Dinge für diesen Ort“ | `einrichten.heft.dort` {n} |
| (Satz) | „Lampen, Sessel und Dinge für deine Räume“ | `einrichten.heft.unter` |
Nicht mehr: „leuchtet“/„steht da“ als Stempel, „frei“ im Katalog.

## jung · Bibliothek und Buch (s14)
| Wort | Bedeutet | Wo |
|---|---|---|
| **Unser Buch** | das Buch in der Bibliothek (bisher „Freundschaftsbuch“/„Freundschaftsatlas“ im sichtbaren Text) – das Verzeichnis des Ganzen. Steht auf dem Schild am Deckel. | Bibliothek, Dialog-Name |
| **Inhalt** | die erste Seite des Buchs: Wort · Punkte · Seitenzahl, darunter leise der Stand | Buch S. 1, Reiter |
| **Wir · Was ich tue · Was ich weiß · Wo und wer** | die vier Abschnitte im Inhalt **und** die Reiter (dieselben Wörter) | Buch |
| **Was ich kann** | Fähigkeiten von heute, je Zeile Name · Zustand · (Schalter) · Ort | Buch S. 5 |
| **Was ich für dich tue** | was von selbst passiert (Brief, Kalender), „Gerade bei der Arbeit“ mit Anhalten | Buch S. 6 |
| **Wer mitdenkt** | Schalter „Mitdenken“, „Wer gerade denkt“, „Mein Sprachmodell“ (war Teil von „Was ich von dir weiß“) | Buch S. 8 |
| **Wo du mich erreichst** | hier · Abgleich · iPhone (QR am Computer) · dein Rechner · Für Bastler · was kommt | Buch S. 9 |
| **an · aus · braucht Mitdenken · kommt** | die vier Zustände einer Zeile (genau diese Wörter) | Buch |
| **kommt mit Carl auf deinem Mac** | Überschrift für alles, was es noch nicht gibt (nur R1-Pläne aus dem Grundkonstrukt: Apple Kalender/Health, auf dem Mac arbeiten, WhatsApp, Brief auf WhatsApp, Mac-App) | Buch |
| **Mein Sprachmodell** | ersetzt „Dein Kopf“ (Kopf als Technikwort war schon verboten, s12) | Buch |
| **Gedanken festhalten · Werkzeuge bauen · Vorbereiten · Nachlesen lassen · Darstellungen · Zusammenfassen · Verbinden** | die Zeilennamen auf „Was ich kann“ | Buch |
| **Ein Brief am Tag · In deinen Kalender schauen** | die Zeilennamen auf „Was ich für dich tue“ | Buch |

Stimme-Schlüssel (alle mit Rückfall im Code; Rune ersetzt): `buch.kann.{unter,spaces,spacesLeer,werkzeug,werkzeugLeer,werkzeugVorlage,werkzeugAus,vorbereiten,mitKalender,ohneKalender,ferdl,ferdlAus,darstellung,darstellungAus,lesesaal,lesesaalAus,verbinden,verbindenZwei,aus,brauchtAus,brauchtFehlt,kommtTitel,verweis}` · `buch.tut.{unter,brief,briefHeute,briefNoch,briefOhne,gelesen,ungelesen,kalender,zuletzt,jetzt,schaut,erlauben,neu,arbeitTitel,keiner,laeuft,anhalten}` · `buch.tut.kal.{nicht-verbunden,neu-verbinden,kein-zugriff,laedt,fehler}` · `buch.mit.{unter,an,aus,niemand}` · `buch.erreichen.{unter,hier,hierZu,qr,home,rechner}` · `buch.kommt.{apple,whatsapp,macapp}` · Bibliothek: `bib.lampe.{an,aus,katalog}` (der eine Verweis auf den Katalog in der Garage), `bib.buch.staunen`.

## s14 · miyazaki (Space, Zuhause) – neue Sätze, alle mit Rückfall im Code
| Schlüssel | Rückfall | Wann |
|---|---|---|
| `space.bauweg` {titel} | Ein Werkzeug für „{titel}“? | Umriss in der Mitte eines Space ohne Werkzeug |
| `space.bauwegWo` | Baust du dir in der Werkstatt | zweite Zeile darunter (führt in die Werkstatt) |
| `space.keiner` | Noch hängt kein Space am Brett. Ein neuer fängt im Zuhause an. | Space-Raum ohne einen einzigen Space |
| `space.keinerHin` | Ins Zuhause | Chip dazu |
| (aria) | Neuer Space, im Zuhause am Brett | Knopf „Neuer Space“ in „Deine Spaces“ |
Wörter: **Reiter** sind sichtbar nur die Namen der Werkzeuge (kein neues Wort).

## s14 · friedrich + papert (Himmel) · neue Stellen (Rückfall steht im Code `netz.js`, Rune ersetzt über `C6.stimme`)
| Schlüssel | Rückfall | wann |
|---|---|---|
| `himmel.tat` | Hier oben siehst du, wie es um jeden deiner Spaces steht. Gehören zwei zusammen, zieh den einen zum anderen. | Carls Satz oben, ≥ 2 Spaces, Überblick (bleibt stehen, solange kein Blatt offen ist) |
| `himmel.tatEins` | Hier oben siehst du, wie es um „{t}“ steht. Verbinden geht erst mit zwei Spaces, den nächsten fängst du im Zuhause an. | genau 1 Space |
| `himmel.leerTat` | Hier oben stehen später deine Spaces, jeder als Planet. Anfangen tust du unten im Zuhause: Sag mir dort, woran du denkst. | kein Space (ersetzt `himmel.leer`, das „+ Neuer Planet“ voraussetzte) |
| `himmel.wahl` | Tipp den Planeten an, der zu „{t}“ gehört. | nach „Verbinden …“, bis zum zweiten Tipp / daneben / Esc |
| `himmel.standKurzLeer` | noch kein Zettel | Standzeile unter dem Planetennamen |
| `himmel.standKurzStill` | still seit {n} Tagen | Standzeile, letzte Bewegung ≥ 3 Tage |
| `himmel.standKurzSchritt` | Schritt fehlt | Standzeile („3 Zettel · Schritt fehlt“) |
| `himmel.standKurzKern` | Kernsatz steht | Standzeile, Schritt steht, kein Werkzeug |
| `himmel.standStill` | Seit {n} Tagen ist hier nichts dazugekommen. | Satz im Planetenblatt, ≥ 3 Tage |
| `himmel.vsZettel` | Den ersten Zettel schreiben | der eine Vorschlag, 0 Zettel (Feld + „An die Leine“) |
| `himmel.vsSchritt` | Den nächsten Schritt finden | der eine Vorschlag, kein Schritt (ruft `C6.vorschlaege.fuehre(…, ['machen'])`) |
| `himmel.vsGeschafft` | „{s}“ geschafft? | der eine Vorschlag, Schritt steht |
| `himmel.verbinden` | Verbinden … | leiser Weg im Planetenblatt (≥ 2 Spaces) |
| `himmel.zuletzt` | Zuletzt | Kopf der letzten Bewegung im Blatt |
| `himmel.zettelLeer` | Ein Satz reicht, deiner. | Platzhalter nach leerem Abschicken |
| `himmel.zettelHaengt` | Hängt jetzt als Zettel in „{t}“. | Carls Satz im Blatt nach dem Zettel |
| `himmel.schonVerbunden` | Die beiden sind schon ein Sternbild. | Ziehen/Wahl auf ein Paar, das schon verbunden ist |
| `himmel.sternbild.kopf` · `.neu` · `.frage` · `.label` · `.platz` · `.leer` · `.los` | Sternbild · Neues Sternbild · Was verbindet „{a}“ und „{b}“? · Was die beiden verbindet · Ein Satz, deiner · Was haben die beiden gemeinsam? Ein Satz reicht. · Verbinden | Satz-Frage nach dem Ziehen |
`himmel.heim` → „Ins Zuhause“ (Knopf im leeren Himmel, gleiches Wort wie `space.keinerHin`). „Neuer Planet“ / „Dein erster Planet“ / „Aufgehen lassen“ kommen im Himmel nicht mehr vor (neuer Space nur im Zuhause). Nicht mehr gerufen: `himmel.raum`, `himmel.leer`, `himmel.ersterFrage`, `himmel.neu` (Rune kann sie streichen).

## s14 · papert+rams (2. Gang) · neue Sätze (Rückfall im Code)
| Schlüssel | Rückfall | wann |
|---|---|---|
| `vorschlag.machen.wasWerkzeugFuer` {s} | Ich bau dir ein Werkzeug für „{s}“. Abhaken tust du ihn am Schild. | Karte Machen, ein Schritt steht |
| `vorschlag.machen.wasWerkzeugVorlage` {s} | Ich bau dir ein Werkzeug für „{s}“, aus einer Vorlage, weil gerade keiner mitdenkt. Abhaken tust du ihn am Schild. | dasselbe, ohne Mitdenken |
| `vorschlag.machen.wasVielleicht` | Ich such dir einen nächsten Schritt. Denkt gerade keiner mit, schreibst du ihn, und ich häng ihn als Schild auf. | Machen ohne Schritt, solange Carl nicht weiß, ob jemand mitdenkt |
| `vorschlag.machen.keinBau` | Werkzeuge bauen geht hier gerade nicht. | ohne Werkzeug-Modul |
| `vorschlag.einer.zettel` · `.zettelWas` | Den ersten Zettel schreiben · Ein Satz reicht. Er hängt als erster Zettel an der Leine. | der eine Vorschlag, kein Zettel |
| `vorschlag.einer.schritt` | Den nächsten Schritt finden | kein Schritt (Versprechen = Machen ohne Schritt) |
| `vorschlag.einer.geschafft` {s} · `.geschafftWas` | „{s}“ geschafft? · Hakst du ihn ab, hängt er als Zettel an der Leine. | Schritt steht; gefragt wird am Schild |
| `vorschlag.einer.abgenommen` {s} | „{s}“ ist vom Schild abgenommen. | nach „Abnehmen“ über den Himmel |
| `brief.aus` · `brief.wiederAn` | Gut. Ab jetzt bring ich dir keinen Brief mehr. · Dein Brief liegt wieder im Postfach. | Brief-Schalter, wenn man an der Rezeption steht |
| `tage.schalterAus` · `tage.schalterAn` | Gut, in deinen Kalender schau ich nicht mehr. In den Fächern liegt nur, was du selbst einträgst. · Gut, ich schau wieder in deinen Kalender. | Kalender-Schalter, an der Rezeption |
Wörter: **Schalter** (an/aus, wie im Buch), kein neues Wort. „Geschafft“ fragt nur das **Schild** „Nächster Schritt“.

### jung · 2. Gang
| Wort | Bedeutet |
|---|---|
| **Kalender lesen** | ersetzt „In deinen Kalender schauen“ (Zeile auf „Was ich kann“, mit Schalter) |
| **auf Seite n ›** / **Schalter auf Seite n ›** | Verweis statt zweitem Schalter |
| **Auf deinem Rechner nachsehen** | Fähigkeit mit Schlüssel `verbindung` |
| **Wer außer dir mit mir reden darf** | Zeile auf „Wer bei uns was darf“, Zustand „kommt mit WhatsApp“ |
Neue Schlüssel: `buch.seite`, `buch.kann.{kalenderAus,rechner,rechnerAus,nichtVerbunden,verbindenSeite,werDenkt}`, `buch.tut.{briefZuletzt,briefAus,kalSchalter}`, `buch.mit.schalterSeite`, `buch.darf.{helfer,weg,alle,rechner,reden,redenSatz,redenKommt}`.

## s14 · Rune (Prüfung „ein Wort, das nie wandert“)
Neue Schlüssel: `brief.ablageAus` (Postfach, Brief aus) · `kalender.aus` (Tagesblatt, Kalender aus) · `kalender.zumSchalter` „Zum Schalter im Buch“. Zahlform in stimme.js: `{n|eins|# viele}`.
Gesetz (Raum = Buch = Carls Stimme): **Space** überall, **Planet** nur im Himmel · **Katalog** nur in der Garage · **unser Buch** (nie „Freundschaftsbuch“) · **Schalter** an/aus · **Karten** = die vier im Space (nicht „Vorschläge unten“) · **zweiter Space** (nicht „zweiter Gedanke“) · **neu verbinden** (nicht „neu anmelden“). Offene Widersprüche in fremden Dateien: KREUZUNG „s14 · Rune“.
