# s14 · Rune · Sätze (Schlüssel → Satz → Zustand)

Quelle: `src/module/stimme.js` (gewinnt vor jedem Rückfall im Code). `{n|eins|# viele}` = Zahlform, `#` ist die Zahl; nur dort, wo der Aufrufer den Wert mitgibt (Katalog). Rune, 16.10.

## Katalog (Garage)

| Schlüssel | Satz | Zustand |
|---|---|---|
| `einrichten.heft.unter` | Lampen, Sessel und Dinge für deine Räume und Spaces | Kopf des Inhalts, immer |
| `einrichten.heft.tasche` | Du hast | Seite mit Preisen, vor ◉ n |
| `einrichten.heft.holen` | Holen | Ware nicht deins, Münzen reichen (danach · ◉ n) |
| `einrichten.heft.hin` | Hinstellen | Ware deins, steht nicht |
| `einrichten.heft.einrichten` | Einrichten | Ware ist ein Space |
| `einrichten.heft.steht` | steht bei dir | steht/hängt jetzt bei dir |
| `einrichten.heft.deins` | deins | gehört dir, steht nicht |
| `einrichten.heft.dort` | {n¦Ein Ding¦# Dinge} für diesen Ort | Space-Ware, n ≥ 1 Dinge für seinen Ort (eins/viele) |
| `einrichten.heft.fehlt` | {n¦Dir fehlt noch eine Münze¦Dir fehlen noch # Münzen}. Im Kieselpark gibt es welche. | Münzen reichen nicht, n fehlen (eins/viele) |
| `einrichten.spaces.hinweis` | Lampen und Dinge holst du für einen Space. Such dir einen aus. | Reiter „Spaces“, mindestens ein Space |
| `einrichten.katalog.auf` | Lampen und Dinge holst du für einen Space. Welchen richten wir ein? | Katalog bei „Spaces“ aufgeschlagen |
| `zuhause.sessel` | Mein Sessel. Einen anderen holst du dir im Katalog in der Garage. | Sessel im Zuhause halten |
| `zuhause.sesselKatalog` | Den Katalog hab ich in die Garage gelegt. Dort liegt alles, was mich und meine Räume verändert. | Sessel im Zuhause antippen |
| `bib.lampe.katalog` | Andere Lampen für hier liegen im Katalog in der Garage. | einmal je Sitzung an der Bibliothekslampe |

## Himmel

| Schlüssel | Satz | Zustand |
|---|---|---|
| `himmel.tat` | Jeder Planet hier oben ist einer deiner Spaces, mit seinem Stand darunter. Gehören zwei zusammen, zieh den einen zum anderen. | ≥ 2 Spaces, Überblick, kein Blatt offen |
| `himmel.tatEins` | Der Planet hier oben ist „{t}“, mit seinem Stand darunter. Verbinden geht ab zwei Spaces, den nächsten fängst du im Zuhause an. | genau 1 Space |
| `himmel.leerTat` | Hier oben stehen später deine Spaces, jeder als Planet. Anfangen tust du im Zuhause: Sag mir dort, woran du denkst. | kein Space |
| `himmel.heim` | Ins Zuhause | Knopf im leeren Himmel |
| `himmel.wahl` | Tipp den Planeten an, der zu „{t}“ gehört. | nach „Verbinden …“, bis zum zweiten Tipp |
| `himmel.standKurzLeer` | noch kein Zettel | Standzeile, 0 Zettel |
| `himmel.standKurzStill` | still seit {n} Tagen | Standzeile, ≥ 3 Tage still (n ≥ 3, immer viele) |
| `himmel.standKurzSchritt` | Schritt fehlt | Standzeile, kein Schritt („n Zettel · …“) |
| `himmel.standKurzKern` | Kernsatz steht | Standzeile, Schritt steht, kein Werkzeug, Kernsatz steht |
| `himmel.standStill` | Seit {n} Tagen ist hier nichts dazugekommen. Das darf so sein. | Planetenblatt, ≥ 3 Tage still |
| `himmel.zuletzt` | Zuletzt | Kopf der letzten Bewegung im Blatt |
| `himmel.verbinden` | Verbinden … | Planetenblatt, ≥ 2 Spaces |
| `himmel.zettelLeer` | Ein Satz reicht, deiner. | leer abgeschickt |
| `himmel.zettelHaengt` | Hängt jetzt als Zettel in „{t}“. | nach dem ersten Zettel im Blatt |
| `himmel.schonVerbunden` | Die beiden sind schon ein Sternbild. | Paar ist schon ein Sternbild |
| `himmel.sternbild.kopf` | Sternbild | Blatt eines Sternbilds |
| `himmel.sternbild.neu` | Neues Sternbild | Satz-Frage nach dem Ziehen |
| `himmel.sternbild.frage` | Was verbindet „{a}“ und „{b}“? | dito |
| `himmel.sternbild.label` | Was die beiden verbindet | Feldname |
| `himmel.sternbild.platz` | Ein Satz, deiner | Platzhalter |
| `himmel.sternbild.leer` | Was haben die beiden gemeinsam? Ein Satz reicht. | leer abgeschickt |
| `himmel.sternbild.los` | Verbinden | Knopf |

## Space

| Schlüssel | Satz | Zustand |
|---|---|---|
| `space.bauweg` | Ein Werkzeug für „{titel}“? | kein Werkzeug im Space |
| `space.bauwegWo` | Baust du dir in der Werkstatt | zweite Zeile, führt in die Werkstatt |
| `space.keiner` | Noch hängt kein Space am Brett. Ein neuer fängt im Zuhause an. | kein einziger Space |
| `space.keinerHin` | Ins Zuhause | Chip dazu |
| `zettel.gemeint` | „{t}“. Die Karten gelten jetzt diesem Zettel. | Zettel angetippt (Karten offen, iPhone unten, Computer links) |
| `werkzeug.steht` | „{werkzeug}“ steht jetzt in „{titel}“. | Werkzeug in einen Space gestellt |
| `vorschlag.machen.werkzeug` | „{n}“ steht jetzt hier im Space. | Machen hat ein Werkzeug gebaut (mit Mitdenken) |
| `vorschlag.machen.vorlage` | „{n}“ steht jetzt hier im Space, aus einer Vorlage, weil gerade keiner mitdenkt. | dito, ohne Mitdenken |
| `vorschlag.verbinden.neuFrage` | Zum Verbinden braucht es einen zweiten Space. Wie soll er heißen? | Verbinden, nur ein Space |
| `vorschlag.verbinden.neuPlatz` | Name des zweiten Space … | dito, Platzhalter |
| `vorschlag.verbinden.keinZweiter` | Ohne zweiten Space gibt es nichts zu verbinden. | kein Name gegeben |

## Der eine Vorschlag · Machen

| Schlüssel | Satz | Zustand |
|---|---|---|
| `vorschlag.einer.zettel` | Den ersten Zettel schreiben | 0 eigene Zettel |
| `vorschlag.einer.zettelWas` | Ein Satz reicht. Er hängt als erster Zettel an der Leine. | dito |
| `vorschlag.einer.schritt` | Den nächsten Schritt finden | kein Schritt |
| `vorschlag.einer.geschafft` | „{s}“ geschafft? | Schritt steht |
| `vorschlag.einer.geschafftWas` | Hakst du ihn am Schild ab, hängt er als Zettel an der Leine. | dito |
| `vorschlag.einer.abgenommen` | „{s}“ ist vom Schild abgenommen. | nach „Abnehmen“ über den Himmel |
| `vorschlag.machen.wasWerkzeugFuer` | Ich bau dir ein Werkzeug für „{s}“. Den Schritt selbst hakst du am Schild ab. | Karte Machen, Schritt steht, mit Mitdenken/unklar |
| `vorschlag.machen.wasWerkzeugVorlage` | Ich bau dir ein Werkzeug für „{s}“, aus einer Vorlage, weil gerade keiner mitdenkt. Den Schritt selbst hakst du am Schild ab. | dito, ohne Mitdenken |
| `vorschlag.machen.wasVielleicht` | Ich such dir einen nächsten Schritt. Denkt gerade keiner mit, schreibst du ihn, und ich häng ihn als Schild auf. | Machen ohne Schritt, ob jemand mitdenkt ist noch unklar |
| `vorschlag.machen.keinBau` | Werkzeuge bauen geht hier gerade nicht. | ohne Werkzeug-Modul |

## Rezeption · Schalter

| Schlüssel | Satz | Zustand |
|---|---|---|
| `brief.aus` | Gut. Ich bring dir keinen Brief mehr, bis du ihn im Buch wieder anschaltest. | Brief-Schalter → aus, man steht an der Rezeption |
| `brief.wiederAn` | Dein Brief liegt wieder im Postfach. | → an, und der Brief liegt sichtbar |
| `brief.ablageAus` | Den Brief hast du ausgeschaltet, darum liegt hier keiner. Der Schalter steht in unserem Buch. | Postfach halten, Brief aus |
| `brief.ablageLeer` | Heute liegt hier noch kein Brief. Steht etwas an, liegt hier einer. | Postfach halten, an, kein Brief |
| `tage.schalterAus` | Gut, in deinen Kalender schau ich nicht mehr. Was ich darin gelesen hab, hab ich vergessen. | Kalender-Schalter → aus, an der Rezeption |
| `tage.schalterAn` | Gut, ich schau wieder in deinen Kalender. | → an |
| `kalender.aus` | In deinen Kalender schau ich nicht, so steht der Schalter. Termine von dort zeig ich hier keine. | Tagesblatt, status().kalender = aus |
| `kalender.zumSchalter` | Zum Schalter im Buch | Knopf dazu → Buch S. 5 |

## Unser Buch

| Schlüssel | Satz | Zustand |
|---|---|---|
| `bib.buch.staunen` | Unser Buch. Vorn steht, was drin ist: was ich kann, was ich für dich tue, was ich von dir weiß. Die Schalter darin gehören dir. | Buch halten |
| `bib.lampe.an` | Die Lampe ist an. Fass sie an, dann geht sie aus. Schau, wohin ihr Licht fällt. | Lampe an halten |
| `bib.lampe.aus` | Die Lampe ist aus. Fass sie an, dann geht sie an und wirft ihr Licht auf den Tisch. | Lampe aus halten |
| `buch.darf.alle` | Alle Schlüssel liegen bei mir. Jeden nimmst du mit einem Schalter zurück. | alle Schlüssel bei Carl |
| `buch.darf.helfer` | Was meine Helfer dürfen | Zeile/Seite im Buch |
| `buch.darf.rechner` | Auf deinem Rechner | Zeile/Seite im Buch |
| `buch.darf.reden` | Wer außer dir mit mir reden darf | Zeile/Seite im Buch |
| `buch.darf.redenKommt` | kommt mit WhatsApp | Zeile/Seite im Buch |
| `buch.darf.redenSatz` | Heute nur du, hier in Carl. | Zeile/Seite im Buch |
| `buch.darf.weg` | Bei dir liegen die Schlüssel für:  | mindestens einer zurückgenommen |
| `buch.erreichen.hier` | Was du mir sagst, liegt zuerst auf diesem Gerät. | Zeile/Seite im Buch |
| `buch.erreichen.hierZu` | du bist hier | Zeile/Seite im Buch |
| `buch.erreichen.home` | In Safari unten „Teilen“, dann „Zum Home-Bildschirm“ und „Hinzufügen“. | iPhone |
| `buch.erreichen.qr` | Mit der iPhone-Kamera scannen, in Safari „Teilen“ und „Zum Home-Bildschirm“. Einmal bei Claude anmelden. | Computer |
| `buch.erreichen.rechner` | Mit deinem Rechner verbunden, sehe ich, ob dort ein Helfer läuft. | Rechner nicht verbunden |
| `buch.erreichen.unter` | Überall derselbe Carl, wenn du bei Claude angemeldet bist. | Zeile/Seite im Buch |
| `buch.kann.aus` | Aus: Das tue ich nicht, bis du es wieder anschaltest. | Schalter aus (allgemein) |
| `buch.kann.brauchtAus` | Mitdenken ist gerade aus. Sein Schalter steht oben auf dieser Seite. | braucht Mitdenken, Mitdenken aus (Schalter oben auf S. 5) |
| `buch.kann.brauchtFehlt` | Gerade denkt niemand mit. Wer mitdenken kann, steht auf „Wer mitdenkt“. | braucht Mitdenken, keiner denkt |
| `buch.kann.darstellung` | Zwei Wege, Skizze, Rückblick, Schritte oder Vergleich aus deinen Zetteln. | Zeile/Seite im Buch |
| `buch.kann.darstellungAus` | Aus: keine Darstellungen, bis du sie wieder anschaltest. | Zeile/Seite im Buch |
| `buch.kann.ferdl` | Ferdl liest für dich nach, seine Funde hängen als Zettel im Space. | Zeile/Seite im Buch |
| `buch.kann.ferdlAus` | Aus: Ferdl liest nichts nach, bis du ihn wieder anschaltest. | Zeile/Seite im Buch |
| `buch.kann.kalenderAus` | Aus: Ich schaue nicht in deinen Kalender. | Kalender aus |
| `buch.kann.kommtTitel` | Kommt mit Carl auf deinem Mac | Zeile/Seite im Buch |
| `buch.kann.lesesaal` | Was du im Lesesaal hinlegst, fasse ich zusammen. | Zeile/Seite im Buch |
| `buch.kann.lesesaalAus` | Aus: Im Lesesaal fasse ich nichts zusammen. | Zeile/Seite im Buch |
| `buch.kann.mitKalender` | mit deinem Kalender | Kalender verbunden |
| `buch.kann.nichtVerbunden` | nicht verbunden | Rechner nicht verbunden |
| `buch.kann.ohneKalender` | ohne Kalender nur Termine aus deinen Werkzeugen | nicht verbunden/aus |
| `buch.kann.rechner` | Ich sehe nur nach, ob dort ein Helfer läuft. Steuern kann ich nichts. | Zeile/Seite im Buch |
| `buch.kann.rechnerAus` | Aus: Ich sehe auf deinem Rechner nicht nach. | Schlüssel Rechner aus |
| `buch.kann.spaces` | Aus einem Satz von dir wird ein Space mit Zetteln. | Zeile/Seite im Buch |
| `buch.kann.spacesLeer` | Noch kein Space. | 0 Spaces |
| `buch.kann.unter` | Was ich kann, ob es an ist, und wo es wohnt. | Zeile/Seite im Buch |
| `buch.kann.verbinden` | Zwei Spaces im Himmel zusammenziehen: ein Sternbild. | Zeile/Seite im Buch |
| `buch.kann.verbindenSeite` | Verbinden: Seite | Zeile/Seite im Buch |
| `buch.kann.verbindenZwei` | braucht zwei Spaces | < 2 Spaces, kein Sternbild |
| `buch.kann.verweis` | Was ich für dich tue | Zeile/Seite im Buch |
| `buch.kann.vorbereiten` | Karteikarten, Packliste oder Merkzettel vor einem Termin, wenn du ja sagst. | Zeile/Seite im Buch |
| `buch.kann.werDenkt` | Wer mitdenkt: Seite | Zeile/Seite im Buch |
| `buch.kann.werkzeug` | Ein kleines Werkzeug aus deinem Satz: abhaken, zählen, merken. | Zeile/Seite im Buch |
| `buch.kann.werkzeugAus` | Aus: Ich baue nur aus Vorlagen und denke dabei nicht mit. | Zeile/Seite im Buch |
| `buch.kann.werkzeugLeer` | Noch keins gebaut. | 0 Werkzeuge |
| `buch.kann.werkzeugVorlage` | ohne Mitdenken aus Vorlagen | ohne Mitdenken oder Schlüssel aus |
| `buch.kommt.apple` | Eine Seite im Browser kommt da nicht hin. | Zeile/Seite im Buch |
| `buch.kommt.macapp` | Dann wohn ich auch auf deinem Mac, nicht nur im Browser. | Zeile/Seite im Buch |
| `buch.kommt.whatsapp` | Schreib mir dort, wie du einem Freund schreibst. | Zeile/Seite im Buch |
| `buch.mit.an` | Ist es an, denkt Claude über claude.ai oder dein Rechner mit, wenn du mir etwas sagst. | immer auf S. 5, auf S. 8 nur an |
| `buch.mit.aus` | Aus: Ich lege nur Beispiele hin und schicke nichts zum Mitdenken. | Zeile/Seite im Buch |
| `buch.mit.niemand` | Gerade denkt niemand mit, weil Mitdenken aus ist. | Mitdenken aus |
| `buch.mit.schalterSeite` | Schalter auf Seite | Zeile/Seite im Buch |
| `buch.mit.unter` | Wer gerade mit mir denkt, und wer es sein soll. | Zeile/Seite im Buch |
| `buch.seite` | auf Seite | Zeile/Seite im Buch |
| `buch.tut.anhalten` | Anhalten | Zeile/Seite im Buch |
| `buch.tut.arbeitTitel` | Gerade bei der Arbeit | Zeile/Seite im Buch |
| `buch.tut.brief` | Steht etwas an, leg ich dir an der Rezeption einen Brief hin. Einer am Tag, solange der Schalter an ist. | immer (wahr an und aus) |
| `buch.tut.briefAus` | Aus: Ich bringe keinen Brief, bis du ihn wieder anschaltest. | Brief aus |
| `buch.tut.briefHeute` | Heute gebracht | heute gebracht (+ Uhrzeit) |
| `buch.tut.briefNoch` | Heute noch keiner | heute noch keiner |
| `buch.tut.briefOhne` | noch ohne Schalter | Modul ohne Schalter |
| `buch.tut.briefZuletzt` | Zuletzt gebracht | früher gebracht / aus |
| `buch.tut.erlauben` | Erlauben | Zeile/Seite im Buch |
| `buch.tut.gelesen` | gelesen | Zeile/Seite im Buch |
| `buch.tut.jetzt` | Jetzt nachsehen | Zeile/Seite im Buch |
| `buch.tut.kal.fehler` | Beim letzten Nachsehen hat es nicht geklappt. | hakt |
| `buch.tut.kal.kein-zugriff` | In deinen Kalender schau ich erst, wenn du es erlaubst. | braucht dein Ja |
| `buch.tut.kal.laedt` | Ich schaue gerade nach. | schaut gerade |
| `buch.tut.kal.neu-verbinden` | Dein Kalender und ich haben uns aus den Augen verloren. Verbinde ihn neu, dann seh ich deine Termine wieder. | Anmeldung abgelaufen |
| `buch.tut.kal.nicht-verbunden` | Ohne Verbindung sehe ich keine Termine. | Kalender nicht verbunden |
| `buch.tut.kalSchalter` | Schalter auf Seite | Zeile/Seite im Buch |
| `buch.tut.kalender` | Ist er verbunden und der Schalter an, schau ich alle 5 Minuten in die nächsten 7 Tage. Hineinschreiben tu ich nie. | immer (wahr verbunden/nicht, an/aus) |
| `buch.tut.keiner` | Gerade arbeitet kein Helfer. | kein Helfer läuft |
| `buch.tut.laeuft` | arbeitet | Zeile/Seite im Buch |
| `buch.tut.neu` | Neu verbinden | Zeile/Seite im Buch |
| `buch.tut.schaut` | Ich schaue … | Zeile/Seite im Buch |
| `buch.tut.ungelesen` | noch nicht gelesen | Zeile/Seite im Buch |
| `buch.tut.unter` | Was von selbst passiert. Nach außen geht nichts ohne dein Ja. | Zeile/Seite im Buch |
| `buch.tut.zuletzt` | zuletzt | Zeile/Seite im Buch |

## Wörter, die nicht mehr wandern

| Schlüssel | Satz | Zustand |
|---|---|---|
| `quest.freund3.satz` | Was du bestätigst, steht in unserem Buch, und ich muss nicht mehr raten. | Quest-Tafel |
| `quest.sternbild.titel` | Zwei Spaces zu einem Sternbild verbinden | Quest-Tafel (Garage: „Spaces“, nicht „Planeten“) |

## Gestrichen (niemand ruft sie mehr)

| Schlüssel | war | warum |
|---|---|---|
| `himmel.leer` | Noch still hier oben. Woran denkst du gerade? | ersetzt durch `himmel.leerTat` |
| `himmel.raum` | In der Mitte bist du. Tipp einen Planeten an … | ersetzt durch `himmel.tat` |
| `himmel.ersterFrage` | … Soll das dein erster Planet werden? | neuer Space nur im Zuhause |
| `himmel.neu` | (stand nie in stimme.js) | „+ Neuer Planet“ ist weg |
| `vorschlag.machen.wasGeschafft` · `.geschafftFrage` · `.geschafft` · `.werkzeugWahl` | „Geschafft?“ an der Karte Machen | „Geschafft“ fragt nur das Schild |
| `vorschlag.stand.*` (6) | Stand von oben als Satz | der Himmel baut den Stand selbst (`standSatz`) |

## Gerichtet (war unwahr)

| Schlüssel | vorher | jetzt | warum |
|---|---|---|---|
| `zettel.gemeint` | … Die Vorschläge unten meinen jetzt diesen Zettel. | … Die Karten gelten jetzt diesem Zettel. | am Computer liegen sie links |
| `werkzeug.steht` | … steht jetzt in „{titel}“, neben mir. | … steht jetzt in „{titel}“. | im Space steht es in der Mitte bzw. unter der Szene |
| `vorschlag.machen.werkzeug` / `.vorlage` | „{n}“ steht neben mir … | „{n}“ steht jetzt hier im Space … | dito |
| `quest.sternbild.titel` | Zwei Planeten … | Zwei Spaces … | Planet nur im Himmel, die Tafel hängt in der Garage |
| `quest.freund3.satz` | … Freundschaftsbuch … | … unserem Buch … | das Buch heißt „Unser Buch“ |
| `vorschlag.verbinden.neuFrage/neuPlatz/keinZweiter` | zweiter Gedanke | zweiter Space | es entsteht ein Space |
| `buch.kann.brauchtAus` (Rückfall) | Anschalten kannst du es auf „Wer mitdenkt“. | Sein Schalter steht oben auf dieser Seite. | der Schalter wohnt seit jung · 2. Gang auf S. 5 |
| `buch.kann.verweis` (Rückfall) | Was ich von selbst tue | Was ich für dich tue | der Name der Seite |
| `buch.kann.werDenkt` (Rückfall) | Wer gerade denkt: Seite | Wer mitdenkt: Seite | dito |
| `buch.tut.kal.kein-zugriff` (Rückfall) | Diese Seite darf deinen Kalender erst lesen … | In deinen Kalender schau ich erst, wenn du es erlaubst. | „Seite“ hieß im Buch die Buchseite |
| `buch.tut.brief`, `buch.tut.kalender`, `buch.mit.an` (Rückfall) | Behauptung | Bedingung („solange der Schalter an ist“) | standen wörtlich neben „Aus: …“ |
| `buch.kommt.macapp` (Rückfall) | Ohne Terminal. | Dann wohn ich auch auf deinem Mac, nicht nur im Browser. | Technikwort |
| `bib.buch.staunen` (Rückfall) | … Du darfst alles ändern. | … Die Schalter darin gehören dir. | nicht alles ist änderbar |
| `tage.schalterAus` (Rückfall) | In den Fächern liegt nur, was du selbst einträgst. | Was ich darin gelesen hab, hab ich vergessen. | Vorbereitungen bleiben liegen; vergessen ist, was der Code tut |
| `brief.aus` (Rückfall) | Ab jetzt bring ich dir keinen Brief mehr. | … bis du ihn im Buch wieder anschaltest. | sagt, wo der Weg zurück ist |
| `himmel.standStill` (Rückfall) | Seit {n} Tagen ist hier nichts dazugekommen. | … Das darf so sein. | still ist kein Mangel |
