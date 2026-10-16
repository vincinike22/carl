# s14 · Otto-Probe „Die reine Form“ (Rune mit Rams und Papert) · 17.10.2026, kurz nach Mitternacht

**Stand:** `carl6-test.html`, frisch gebaut mit `tools/bau.py` vor der Probe. Am Code ist nichts geändert.
**Werkzeug:** Playwright/Chromium. Echte Taps am iPhone (390×844, Touch, Faktor 2; Ziehen als echter Touch-Strich über CDP `Input.dispatchTouchEvent`) und echte Klicks am Computer (1440×900, Maus gedrückt halten und ziehen). `evaluate` nur zum Lesen und für `localStorage.clear()` beim Start. Neu laden = `page.reload()`.
**Läufe:** 4 = 2 Geräte × {mit Schein-Kalender (Zahnarzt in 2 Tagen 15:30, Mathe-Prüfung in 4 Tagen 09:00), ohne Kalender (`claude.use('mcp')` = null)}. Die vier Läufe liefen gleichzeitig, darum sind die Zeiten etwas langsamer als bei einem Einzellauf. Dazu eine Nachprobe im Himmel (`probe-*`): erst halten, dann ziehen.
**Skript:** `/tmp/claude-0/-home-claude/e40f4e8f-b3a0-54da-8cc4-cfa60717fbf9/scratchpad/s14o/lauf.py` (Helfer `ot_lib.py`, Ziehen `zieh.py`, Nachprobe `p1.py`). Rohdaten: `kal-iphone.json`, `ohne-iphone.json`, `kal-computer.json`, `ohne-computer.json`, `probe-*.json`. Bilder: `werkstatt/s14/otto/<lauf>-<gerät>-<nr>-<schritt>.png`.
**Konsolenfehler:** 0 in allen vier Läufen und in der Nachprobe.
**Ganzer Fluss:** in allen vier Läufen bis zum Ende ohne Abbruch, rund 5 Minuten je Lauf (iPhone mit Kalender 302,7 s, ohne 287,3 s; Computer 302,8 s und 288,7 s).

## Tabelle der Schritte
Zeit = Sekunden seit dem Öffnen, in der Reihenfolge iPhone mit Kalender · iPhone ohne · Computer mit · Computer ohne („–“ heißt, der Schritt gehört nicht zu diesem Lauf). „Weiß ich, was ich tun soll?“: ✓ ja · ~ nach Zögern · ✗ nein.

| Schritt | Zeit | Carl sagt (wörtlich) | Otto denkt | Weiß ich's? | Bild (iPhone mit Kalender, sonst angegeben) |
|---|---|---|---|---|---|
| Frisch, Rezeption | 1,1 · 1,2 · 0,9 · 0,5 | „Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was.“ | Über ihm hängen Fächer mit Daten, in zwei liegt ein Zettel. Ich tippe ein Fach an. | ✓ | `kal-iphone-01-frisch` |
| Fach „Mo 19.“ antippen | 4,7 · 4,3 · 3,7 · 3,4 | (Blase weg, Carl hüpft aufs Regal.) Blatt: „Montag 19. Oktober · übermorgen · 15:30 Zahnarzt · aus deinem Kalender · Steht noch etwas an dem Tag an?“ | Er klettert aufs Regal, hübsch. Stimmt mit meinem Kalender. | ✓ | `kal-iphone-02-fach-so18` (der Name stammt aus der Planung: getippt wird das dritte Fach, nach Mitternacht war das Mo 19.); ohne: ehrlich „Von hier aus komm ich an keinen Kalender heran …“, dazu ein Kasten BEISPIEL (`ohne-iphone-02`), viel Text |
| Tag zuklappen | 7,2 · 6,3 · 5,7 · 5,4 | Begrüßung kommt zurück | | ✓ | `-03-fach-zu` |
| Brief öffnen | 13,8 · 12,1 · 12,2 · 11,2 | Brief: „Spät geworden. Heute steht bei mir nichts an. Neu für die nächsten Tage: Mo 19. 15:30 Zahnarzt · Mi 21. 09:00 Mathe-Prüfung. ‚Mathe-Prüfung‘ ist in 4 Tagen. Soll ich dir Karteikarten machen? Woher ich das weiß: dein Kalender.“ | Ein Brief, der sagt, woher er es weiß. Wahr. | ✓ | `-04-brief`; ohne: „Noch seh ich keinen Kalender und keinen Termin von dir. Erfinden mag ich keinen.“ (`ohne-iphone-04-brief`) |
| Brief zurücklegen | 16,7 · 14,6 · 15,1 · 13,6 | | | ✓ | `-05-brief-zu` |
| Zuhause (Dock) | 21,9 · 19,1 · 19,0 · 17,7 | (still) Feld: „Woran denkst du gerade?“ | Das Feld lädt ein. | ✓ | `-06-zuhause` |
| „Ich will Gitarre lernen“ | 27,4 · 26,2 · 25,4 · 23,7 | „Wohin damit?“ Chip „Neuer Space“ | Wo ist mein Satz hin? Ah, er wartet. | ~ | `-07-satz-gitarre` |
| Chip „Neuer Space“ | 31,6 · 30,6 · 29,4 · 28,7 | „Ich nenn ihn ‚Gitarre lernen‘?“ | Er hat mich verstanden. | ✓ | `-08` |
| „So nennen“ | 36,1 · 36,9 · 34,7 · 33,7 | „Der Space ‚Gitarre lernen‘ ist da. Dein Satz ist sein Samen.“ Karte hängt am Brett. | | ✓ | `-09-so-nennen` |
| „Durch Portugal reisen“ | 40,9 · 43,2 · 41,3 · 40,5 | „Wohin damit?“ Chips „In ‚Gitarre lernen‘ hängen“ / „Neuer Space“ | Gut, er fragt, wohin. | ✓ | `-10` |
| Neuer Space, So nennen | 50,1 · 54,0 · 50,7 · 50,4 | „Ich nenn ihn ‚Portugal reisen‘?“ → „Der Space ‚Portugal reisen‘ ist da.“ | Das „Durch“ ist weg, egal. | ✓ | `-12-so-nennen-2` |
| Karte „Gitarre lernen“ antippen | 55,8 · 59,7 · 57,9 · 56,0 | „Was hat dich auf ‚Gitarre lernen‘ gebracht?“ | Ein Musikzimmer! Für mein Thema. | ✓ | `-13-karte-gitarre` |
| Zettel 1 „Im Keller steht noch eine alte Gitarre“ | 63,9 · 67,1 · 66,4 · 63,5 | „‚Gitarre‘ stand schon auf deinem Zettel vom 17. Oktober: ‚Ich will Gitarre lernen‘.“ | „Vom 17. Oktober“, das war vor einer Minute. Klingt nach Akte statt nach „eben“. | ✓ | `-14-zettel-1` |
| Zettel 2 „Jeden Abend zehn Minuten üben“ | 71,2 · 73,9 · 74,4 · 71,5 | „Er keimt. Ein Kernsatz, dann kommt die Knospe.“ Die Pflanze wächst. | Es wächst etwas, weil ich schreibe. | ✓ | `-15-zettel-2` |
| Carl antippen | 75,1 · 78,0 · 78,8 · 76,3 | „Was machen wir damit?“ Vier Karten. | | ✓ | `-16-carl-antippen` |
| Karte wählen | 79,2 · 82,1 · 81,4 · 79,5 | Machen: „Ich such dir einen nächsten Schritt. Denkt gerade keiner mit, schreibst du ihn …“ · Weiterdenken: „Ich denk an ‚Gitarre lernen‘ weiter und häng dir eine Frage an die Leine.“ | Die Karte sagt, was sie tut. | ✓ | `-17-wahl-machen`, `ohne-iphone-17-wahl-weiterdenken` |
| Los | 85,1 · 88,1 · 87,9 · 86,8 | Machen: „Was ist der nächste Schritt? Einer, nicht zehn.“, darunter „Ich bin dran.“ · Weiterdenken: „Was folgt aus ‚Ich will Gitarre lernen‘?“, darunter „Ich bin dran.“ | Er ist dran? Er fragt doch mich. Und wo ist die Frage an der Leine? | ~ | `-18-los` · **Stolperstein 3, 4** |
| (ohne) Antwort schreiben | – · 102,6 · – · 99,1 | Unter den Karten: „Dein Gedanke hängt an der Leine.“ Blase bleibt: „Was folgt aus …?“ | Beantwortet, aber er fragt immer noch. | ~ | `ohne-iphone-20-antwort` |
| (mit) Schritt schreiben, „Morgen“ | 95,0 / 101,8 · – · 96,0 / 101,6 · – | „Bis wann?“ → „Bis morgen. Wenn es nah ist, steht es in meinem Brief.“ Unter den Karten: „Auf dem Schild steht jetzt: …“ | Welches Schild? Die Karten liegen drauf. | ~ | `-20-morgen` · **Stolperstein 4** |
| Daneben tippen | 105,4 · 105,9 · 104,2 · 101,9 | Karten gehen, Schild sichtbar, „bis morgen“ in Rot | Ach, da ist es. | ✓ | `-21-daneben` |
| „Ein Werkzeug für ‚Gitarre lernen‘? Baust du dir in der Werkstatt ›“ | 112,4 · 111,8 · 110,1 · 108,1 | (still) Wand „für ‚Gitarre lernen‘“: Zwei Wege, Wochenrückblick, Skizze, Neues Werkzeug; „Hier hängen bald deine Werkzeuge“ | Welches davon ist mein Werkzeug? Ich nehm das große. | ~ | `-22-werkzeug-weg` |
| (mit) Wochenrückblick | 117,1 · – · 115,5 · – | Blatt „Deine Woche. 4 Zettel in 2 Spaces.“ Leere Tage, der heutige Tag ist am iPhone nicht zu sehen; „In ‚Gitarre lernen‘ hängt noch kein Zettel. Das hier ist ganz neu.“ | Doch, da hängen drei! | ✗ | `-23-rueckblick` · **Stolperstein 1** |
| (mit) „In ‚Gitarre lernen‘ hängen“ | 122,2 · – · 121,9 · – | „Hängt jetzt als Rückblick in ‚Gitarre lernen‘.“ Kein Knopf zurück | Wie komm ich hin? Übers Zuhause. | ~ | `-24` |
| (mit) Space mit Rückblick | 132,3 · – · 133,5 · – | „Vielleicht trägt ‚Ich will Gitarre lernen‘ diesen Space. Tipp den Zettel an, wenn er der Kernsatz ist.“ Rückblick liegt klein und schief am Boden, der Werkzeug-Weg steht noch da. | Hab ich nicht gerade eins gebaut? Und den Zettel seh ich nicht, der steckt im „+2“. | ✗ | `-26-space-mit-rueckblick` · **Stolperstein 2** |
| Neues Werkzeug | 142,0 · 117,1 · 144,5 · 112,1 | Blatt „Was soll dein Werkzeug können? Schreib es unten ins Feld. Ein Satz reicht.“ + zwei Beispiele | Klar. | ✓ | `-28-neues-werkzeug` |
| „Ich will jeden Tag sehen, ob ich geübt habe“ | 152,0 · 127,9 · 153,6 · 122,2 | „Mitdenken kann ich hier noch nicht, darum aus einer Vorlage. Probier es aus.“ Werkzeug „Geübt?“ mit 7 Ringen | Ehrlich und sofort da. | ✓ | `-29-werkzeug-satz` |
| Aufstellen → In „Gitarre lernen“ stellen → Hingehen | 157–170 · 132–144 · 159–170 · 128–141 | „Wo soll es stehen?“ → „‚Geübt?‘ steht jetzt in ‚Gitarre lernen‘.“ → im Space: „Wer sollte von ‚Gitarre lernen‘ wissen?“ | Mein Werkzeug steht groß in der Mitte. Oben steht aber „‹ Werkstatt“, unten leuchtet „Werkstatt“. | ✓ (~ wo bin ich) | `-32-hingehen` |
| „heute“ abhaken | 173,3 · 148,2 · 175,4 · 147,6 | (Blase gleich) Ring wird grün | Es merkt sich's. | ✓ | `-33-heute-abhaken` |
| Himmel | 180,1 · 156,2 · 182,9 · 157,4 | „Jeder Planet hier oben ist einer deiner Spaces, mit seinem Stand darunter. Gehören zwei zusammen, zieh den einen zum anderen.“ Planeten: „3 Zettel · 1 Werkzeug“, „1 Zettel · Schritt fehlt“ | Ich seh meine zwei Sachen von oben und weiß, was ich hier tun kann. | ✓ | `-34-himmel` |
| Planet antippen | 186,9 · 163,8 · 190,3 · 166,4 | Blatt: „3 Zettel von dir und ein Werkzeug, noch kein Kernsatz. Nächster Schritt: ‚Gitarre aus dem Keller holen und stimmen‘, morgen.“ Ein orangener Knopf „… geschafft?“, „Hineingehen“, „Verbinden …“ | Stimmt alles. | ✓ | `-35-planet-tippen` |
| „‹ Himmel“ | 194,4 · 172,5 · 197,1 · 173,7 | Satz von oben kommt wieder | (In der Erkundung schloss ein Tipp daneben das Blatt nicht.) | ✓ | `-36` |
| Portugal auf Gitarre ziehen | 204,2 · 184,6 · 208,4 · 187,3 | Goldener Faden folgt dem Finger, beide Planeten bekommen einen Ring; „Neues Sternbild · Was verbindet ‚Portugal reisen‘ und ‚Gitarre lernen‘?“ | Wow. | ✓ | `-37-ziehen` |
| Satz „Für beides brauche ich den Sommer“, Verbinden | 217,7 · 197,1 · 222,6 · 202,4 | Der Satz leuchtet in Handschrift am Himmel, der Faden bleibt. | Das ist meins. | ✓ | `-38-sternbild` |
| Bibliothek | 227,0 · 205,3 · 231,3 · 210,3 | (still) Rosa Buch „Unser Buch“ steht aufrecht am Tisch | Das Buch find ich sofort. | ✓ | `-39-bibliothek` |
| Buch öffnen | 234,1 · 212,5 · 237,5 · 215,6 | Inhalt: „Was ich kann 5 · 5 an · 4 brauchen Mitdenken … Wer mitdenkt 8 · gerade niemand … Wo du mich erreichst · nur dieses Gerät“ | Ein Verzeichnis mit Stand, gut. | ✓ | `-40-buch` |
| „Was ich kann“ | 240,1 · 218,2 · 244,2 · 220,0 | „Mitdenken [an] · Ist es an, denkt Claude über claude.ai oder dein Rechner mit …“; „Werkzeuge bauen [an] · 1 Werkzeug · ohne Mitdenken aus Vorlagen“ | Ist Mitdenken jetzt an oder denkt gerade niemand? | ~ | `-41-was-ich-kann` · **Stolperstein 3** |
| Schalter „Werkzeuge bauen“ umlegen | 246,2 · 222,7 · 248,3 · 225,3 | „aus · Aus: Ich baue nur aus Vorlagen und denke dabei nicht mit.“ | Das tut er doch eh schon. Was hab ich ausgeschaltet? | ~ | `-42-schalter-umlegen` |
| Neu laden, Bibliothek, Buch, „Was ich kann“ | 250,7–274,6 · 225,5–250,7 · 250,6–273,6 · 229,0–251,7 | Schalter steht noch auf **aus** (alle vier Läufe). Inhalt jetzt: „8 an · 1 ausgeschaltet“, „brauchen Mitdenken“ ist weg, „Wer mitdenkt“ ohne Stand. | Der Schalter hat gehalten. Aber warum kann er nach dem Laden plötzlich mehr? | ✓ / ✗ | `-46-buch-2`, `-47-was-ich-kann-2` · **Stolperstein 3** |
| Garage | 286,2 · 263,7 · 287,0 · 264,1 | „Dein Rad. Tipp es an.“ Heft „Katalog“ lehnt am Spiegel | Da steht „Katalog“ drauf. | ✓ | `-49-garage` |
| Katalog öffnen | 289,9 · 268,2 · 290,8 · 268,8 | Seite „Für deine Spaces“ mit meinen zwei Spaces als Bild (Musikzimmer, Am Meer); Hand: „Lampen und Dinge holst du für einen Space. Such dir einen aus.“ | Meine Sachen sind schon drin. | ✓ | `-50-katalog` |
| Reiter „Zuhause“, Papierlaterne antippen | 292,7 / 296,0 · 272,9 / 278,4 · 293,4 / 296,7 · 272,7 / 277,9 | Laterne leuchtet zur Probe; eine Zeile „Papierlaterne · Holen · 4“ (Orange) | Ich seh, wie sie leuchtet, und was sie kostet. | ✓ | `-52-probe-papierlaterne` |
| Holen | 299,4 · 282,8 · 299,8 · 284,0 | „● steht bei dir“, Münzen 8 → 4, Hand: „Neues Licht in der Stube.“ | Gekauft. | ✓ | `-53-holen` |
| Katalog zuklappen | 302,7 · 287,3 · 302,8 · 288,7 | | | ✓ | `-54` |

Zu wenig Münzen: In einem früheren, verworfenen Lauf (das Sternbild war dort am Skript gescheitert, Otto hatte 3 Münzen) sagte das Blatt bei der Papierlaterne „Dir fehlt noch eine Münze. Im Kieselpark gibt es welche.“. Der Satz war wahr. Das Bild davon ist überschrieben, der Satz steht in diesem Protokoll als gesehen, aber ohne Beleg.

## Die 5 schlimmsten Stolpersteine

**1 · Der Wochenrückblick lügt, und am iPhone fehlt der heutige Tag** (Rune: Wahrheit, Rams: Kante)
Bild `kal-iphone-23-rueckblick.png` (Computer: `kal-computer-23-rueckblick.png`).
Unter „Woher ich das weiß“ steht „In ‚Gitarre lernen‘ hängt noch kein Zettel. Das hier ist ganz neu.“ In dem Space hängen aber drei Zettel. Ursache in `src/module/darstellung.js:333–336`: Im Bleistift-Zweig wird `hatZ` berechnet, aber nicht benutzt. Außerdem: Die Kopfzeile sagt „Gitarre lernen“, die Zahl „4 Zettel in 2 Spaces.“ zählt aber beide Spaces. Am iPhone schiebt sich „Aus deinen Zetteln, mit Bleistift“ (`darstellung.js:349`) über die Zeile „Fr 16.10.“, und der heutige Tag mit allen vier Zetteln liegt unter dem Fuß. Otto sieht also nur leere Striche. Am Computer ist der Tag zu sehen.

**2 · Zwei Arten „Werkzeug“ an derselben Wand. Was man baut, landet nicht in der Mitte** (Rams: ein Ding, ein Wort, Papert: das Ding)
Bilder `kal-iphone-22-werkzeug-weg.png`, `kal-iphone-24-rueckblick-haengen.png`, `kal-iphone-26-space-mit-rueckblick.png`.
Der Weg aus dem Space heißt „Ein Werkzeug für …“. An der Werkzeugwand hängen Zwei Wege, Wochenrückblick, Skizze und Neues Werkzeug gleichrangig nebeneinander. Otto nimmt das größte, den Wochenrückblick. Der ist eine Darstellung und kein Werkzeug. Nach „hängen“ gibt es keinen Weg zurück in den Space. Dort liegt der Rückblick dann klein und schief am Boden („Rückblick: Dein…“). Der gestrichelte Weg „Ein Werkzeug für ‚Gitarre lernen‘? Baust du dir in der Werkstatt ›“ steht weiter da. Für Otto ist das eine Lüge, denn er hat gerade etwas „gebaut“. Erst über „Neues Werkzeug“ entsteht „Geübt?“, und das steht dann wirklich groß in der Mitte. Dateien: Wand `src/raeume/werkstatt.js` (um 1616–1640), Werkzeug-Weg `src/raeume/space.js` (`.c6z-sp-bauweg`).

**3 · Ob jemand mitdenkt, hängt vom Zeitpunkt ab, und Carl sagt beides** (Rune: Lüge je Zustand)
Bilder `ohne-iphone-17-wahl-weiterdenken.png`, `ohne-iphone-18-los.png`, `ohne-iphone-20-antwort.png`, `kal-iphone-40-buch.png` gegen `kal-iphone-46-buch-2.png`, `kal-iphone-41-was-ich-kann.png`.
- Space: Die Karte Weiterdenken verspricht „Ich denk an ‚Gitarre lernen‘ weiter und häng dir eine Frage an die Leine.“ Es denkt aber niemand mit. Carl stellt dann selbst die Frage in der Blase, an der Leine hängt nichts. Nach Ottos Antwort steht unter den Karten „Dein Gedanke hängt an der Leine.“, die Blase fragt aber weiter „Was folgt aus …?“. `src/module/vorschlaege.js:64` (`ohneKopf()` meldet zu diesem Zeitpunkt noch „Kopf da“).
- Buch: Vor dem Neuladen steht im Inhalt „5 an · 4 brauchen Mitdenken“ und „Wer mitdenkt · gerade niemand“. Nach dem Neuladen, ohne dass sich etwas geändert hat, steht dort „8 an · 1 ausgeschaltet“, und „Wer mitdenkt“ hat keinen Stand mehr. Eine der beiden Fassungen ist falsch. `src/module/atlas.js:706, 823` (`C6.mitdenken().echt` ist beim Aufschlagen vermutlich noch nicht geprüft; ungeprüft).
- Dazu der Schalter „Mitdenken [an]“ mit dem Satz „Ist es an, denkt Claude … mit“, während niemand denkt. Ein Schalter für die Erlaubnis sieht für Otto aus wie ein Zustand.

**4 · Die vier Karten decken, wovon sie reden, und „Ich bin dran“ steht da, wenn Otto dran ist** (Rams: Sichtbarkeit, Rune: Satz je Zustand)
Bilder `kal-iphone-18-los.png`, `kal-iphone-20-morgen.png`, `kal-iphone-21-daneben.png`.
Nach „Los“ fragt Carl „Was ist der nächste Schritt? Einer, nicht zehn.“, und unter den Karten steht „Ich bin dran.“ (`src/module/stimme.js:404`, gesetzt in `vorschlaege.js:262`). Dran ist aber Otto. Nach „Morgen“ steht auf dem Kartenblatt „Auf dem Schild steht jetzt: ‚Gitarre aus dem Keller holen und stimmen‘.“ Am iPhone liegt das Blatt genau über dem Schild. Otto sieht das Schild erst, nachdem er daneben getippt hat, und das errät er nur. Dort steht „bis morgen“ in Rot. Nach E3 gehört Rot nur zur Nadel und zu Entscheidungen.

**5 · Im Himmel: Wer erst hält und dann zieht, bekommt keinen Faden** (Papert: das Ding reagiert nicht wie die Hand erwartet)
Bilder `probe-iphone-02-halten-dann-ziehen.png`, `probe-computer-02-halten-dann-ziehen.png`.
Carl sagt „zieh den einen zum anderen“. Wer den Planeten 0,8 s gedrückt hält und dann zieht (so fasst ein vorsichtiger Mensch etwas an), bekommt keinen goldenen Faden. Stattdessen sagt Carl „Ein Planet ist ein Space von oben. Was unten wächst, wächst hier mit.“ Das ist die Antwort aufs Halten („Wie geht das?“, `src/raeume/netz.js:1758–1760` und `los()` mit `g.gehalten`). Otto glaubt, Ziehen geht nicht. Ein schnelles Ziehen (0,4 s) klappt in allen vier Läufen. Daneben, kleiner: Beim Heranfliegen trägt ein Mond die Aufschrift „Hörsaal“ (`probe-iphone-03-planet-nah.png`), obwohl Otto nie einen Hörsaal hatte.

**Weitere, kleiner:** Carls Hinweis „Tipp den Zettel an, wenn er der Kernsatz ist“ zeigt auf einen Zettel, der unsichtbar im Stapel „+2“ steckt (`kal-iphone-26`). Wer über die Werkstatt in den Space kommt, sieht „‹ Werkstatt“ und im Dock „Werkstatt“ (`kal-iphone-32`), wo bin ich? „Zettel vom 17. Oktober“ für einen Zettel von vor einer Minute. Ohne Kalender ist das Tagesblatt lang (fünf Sätze und ein Beispielkasten, `ohne-iphone-02`). Der Satz von Hand im Katalog („Die Lampe neben dem Sessel. Tipp eine an.“) bleibt stehen, während die Papierlaterne zur Probe leuchtet (`kal-iphone-52`). Der Schalter „Werkzeuge bauen: aus“ ändert für Otto nichts Sichtbares, weil ohnehin nur aus Vorlagen gebaut wird.

## Die 5 schönsten Momente
1. **Das Sternbild.** Otto zieht einen Planeten zum anderen, ein goldener Faden folgt dem Finger, beide bekommen einen Ring, und danach leuchtet sein eigener Satz „Für beides brauche ich den Sommer“ in Handschrift am Himmel (`kal-iphone-37-ziehen.png`, `kal-iphone-38-sternbild.png`, `kal-computer-38-sternbild.png`). Ein Ding zum Denken, das ihm gehört.
2. **Der Himmel ist ohne Blatt lesbar.** Ein Satz sagt die Tat. Unter jedem Planeten steht ein wahrer Stand („3 Zettel · 1 Werkzeug“, „1 Zettel · Schritt fehlt“). Otto weiß nach dem ersten Blick, was er hier tut (`kal-iphone-34-himmel.png`). E3/E6 sind erfüllt.
3. **Ein Satz wird ein Werkzeug, und es steht in der Mitte.** „Ich will jeden Tag sehen, ob ich geübt habe“ wird „Geübt?“ mit sieben Ringen. Carl sagt ehrlich „Mitdenken kann ich hier noch nicht, darum aus einer Vorlage.“ Im Space steht das Werkzeug groß unter Carl, der Ring wird grün (`kal-iphone-29-werkzeug-satz.png`, `kal-iphone-33-heute-abhaken.png`). E7 ist erfüllt.
4. **Jeder Space bekommt seinen Raum.** Gitarre wird ein Musikzimmer, Portugal bekommt „Am Meer“ mit Leuchtturm. Die Pflanze wächst vom Samen zum Keim, weil Otto schreibt (`kal-iphone-13-karte-gitarre.png`, `kal-iphone-15-zettel-2.png`, `kal-iphone-50-katalog.png`).
5. **Rezeption und Katalog sprechen wahr und in Carls Hand.** Öffnet man ein Fach, hüpft Carl aufs Regal. Der Brief sagt „Woher ich das weiß: dein Kalender“, ohne Kalender sagt er „Erfinden mag ich keinen“. Im Katalog leuchtet die Lampe zur Probe, es gibt eine einzige Handlung in Orange („Holen · 4“), danach „● steht bei dir“ und „Neues Licht in der Stube.“ (`kal-iphone-02`, `kal-iphone-04`, `ohne-iphone-04`, `kal-iphone-52`, `kal-iphone-53`). E1/E2 sind erfüllt: Den Katalog gibt es nur in der Garage, er ist leicht zu finden, und von den Heften in Bibliothek, Werkstatt und Space ist keins mehr zu sehen.

## Staunt ein Fremder – und versteht er, was Carl für ihn tut?
**Staunen: ja.** Otto staunt an fünf Stellen ohne Erklärung: Carl auf dem Regal, das Musikzimmer, die wachsende Pflanze, das Werkzeug aus einem Satz und am stärksten das Sternbild.
**Verstehen: teilweise, darum nicht erfüllt.** An der Rezeption, im Himmel, im Buch und im Katalog sagt jeder Satz, was Carl tut und woher er es weiß. Diese Räume haben die reine Form erreicht. In der Kette Space → Werkstatt → Space verliert Otto den Faden: zwei Arten „Werkzeug“, ein Rückblick, der lügt, ein Werkzeug-Weg, der nach dem Bauen weiter wirbt, und Karten, die das Schild verdecken. Bei der wichtigsten Frage („denkt jemand mit mir?“) hört er je nach Zeitpunkt Ja und Nein. Wer nicht weiß, ob Carl mitdenkt, versteht auch nicht, was Carl für ihn tut.
Vorschlag für die Vetos (höchstens drei je Prüfer, Entscheidung bei Vitruvian): Rune → Stolperstein 1 und 3, Rams → Stolperstein 2 und 4, Papert → Stolperstein 5.

## Ungeprüft
- Echtes iPhone und Safari (nur Chromium mit Touch-Nachbildung). Echte Fingerbewegung beim Ziehen (nur gerader Strich in 12 Schritten).
- Echtes Mitdenken (Claude): Alle Läufe liefen ohne `complete()`. Was „Machen“, „Weiterdenken“ und „Neues Werkzeug“ mit echtem Kopf tun, ist nicht gesehen.
- Echter Google-Kalender und die Fehlerzweige (`server_not_connected`, `needs_reauth`, `approval_required`). Der Schein-Kalender liefert nur Daten.
- Ob die geholte Papierlaterne wirklich im Zuhause neben dem Sessel steht (nicht hingegangen).
- Ob „Werkzeuge bauen: aus“ das Bauen in der Werkstatt tatsächlich sperrt oder verändert (nach dem Umlegen nichts mehr gebaut).
- Die Ursache von Stolperstein 3 (Zeitpunkt der Prüfung `C6.mitdenken()`) ist vermutet, nicht im Code nachgewiesen.
- Zu welchem Planeten der Mond „Hörsaal“ gehört und woher er kommt.
- „Verbinden …“ über zwei Tipps, Verbinden mit der Tastatur, Teleskop, Lesesaal, UFO, Kieselpark, Schrank, Antwort auf den Brief, „Ja, bitte“ zu den Karteikarten (in s13 geprüft, hier nicht).
- Breiten 820–1199 px, Querformat, große Schrift, Bildschirmleser, reduzierte Bewegung, langsames Gerät.
- Die Läufe begannen um 00:0x Uhr am 17.10. („Spät geworden“, Nacht-Fenster). Tageszeit-Zweige wurden nicht geprüft.
- Münzen: Die Zahl hängt vom Stand der Quests ab (3 in einem verworfenen Lauf, 8 in den gültigen). Woher genau die Münzen kommen, ist nicht untersucht.
- Carls Blase wird über `.c6rz-satz, [class*=blase], .c6w-stimme.c6w-an` gelesen. Sätze in anderen Elementen (Blätter, Hand im Katalog) stehen hier nach dem Bild, nicht nach Messung.
- Zwei Messungen (Überdeckung Karten/Schild, Blase/Werkzeug) lieferten wegen falscher Selektoren `null`. Die Urteile dazu stützen sich auf die Bilder.
