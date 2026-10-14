# s9 · Veto · rams (Geselle, Gebrauchsprüfung als Otto)

Geprüft: `carl6-test.html` (Stand 10.10., 10:44). Kein Code geändert. Gang als „Otto“ ohne Vorwissen mit echten Klicks (Playwright), iPhone 390 × 844 mit Touch, dazu Teleskop und Verbinden-Blatt am Computer 1100 × 860. Frischer Zustand, Rundgang ganz („Ich will wieder regelmässig laufen gehen“), dann:
- Werkzeug über „/neu …“ bauen, Haken setzen, in den Space stellen, groß öffnen.
- Anders („Ich will auch die Kilometer eintragen“) → Passt → „Zurück zur alten Fassung“ → „Wieder die neuere“, dann Wegräumen.
- Himmel → Teleskop → „Zwei Wege“ → Bauplan → Übernehmen → Freigabe-Karte.
- Buch → „Was ich weiß“ → „Stimmt so nicht“ → einzeln Vergessen → „Alles vergessen“ (Freigabe nicht umkehrbar, zwei Tipps).
- „Verbinden ›“ → Verbinden-Blatt.

0 Konsolenfehler. Bilder: `werkstatt/s9/veto/rams_bilder/` (`i_` = iPhone, `c_` = Computer).

Erledigt seit s6, ohne Veto, nur zur Kenntnis:
- Ein Feld: „Anders“ sagt jetzt „Schreib es unten ins Feld“.
- Der Space-Name ist ganz („Wieder laufen gehen“).
- Im Buch sind die Blätter-Pfeile weg.
- Die Werkstattwand hat keine Recherche mehr.

| Neue Fläche (iPhone) | Bedienelemente sichtbar | davon nötig | was fällt |
|---|---|---|---|
| Werkzeug groß | 25 | 17 | Nadel, Brett/Kalender dahinter |
| Werkzeug · Anders (Hinweis) | 22 | 14 | dahinter |
| Werkzeug · Anders-Vorschau (km) | 27 | 16 | dahinter |
| Werkzeug · neue Fassung | 25 | 18 | dahinter |
| Werkzeug · alte Fassung | 26 | 16 | dahinter |
| Teleskop · Bauplan | 9 | 8 | Nadel |
| Freigabe-Karte · umkehrbar („Zwei Wege“ übernehmen?) | 2 | **0** | die ganze Karte: Die Entscheidung fiel schon mit „Übernehmen“ im Bauplan (V1) |
| Freigabe-Karte · nicht umkehrbar (Alles vergessen) | 2 | 2 | – (richtig: Folgen-Satz, zweiter Tipp „Wirklich: Alles vergessen“) |
| Was ich von dir weiß (ganz gerollt) | 20 | 19 | „Verbinden ›“ ganz oben (V3) |
| … mit „Stimmt so nicht“ offen | 23 | 23 | – |
| Verbinden-Blatt | 10 | 7 | „Codex“, „Server“, Shell-Zeile (V4) |
| **Summe (11 Flächen)** | **191** | **140** | **51 zu viel; 41 davon sind Bühne hinter dem Werkzeug-Blatt, 10 sind Vertrauens-Bedienung** |

## Hält Carl seinen Maßstab? Ist Vertrauen ruhig oder Bürokratie?

| Harness-Regel | Befund |
|---|---|
| Passt/Anders ist die Freigabestelle | **ja**: Werkzeug ändert sich erst nach „Passt“, „Lieber wie vorher“ ist da (`i_13_anders_vorschau.png`) |
| Werkzeuge mit Fassungen, Einträge nie verloren | **ja** beim Ändern: „Zurück zur alten Fassung“ / „Wieder die neuere“, ruhig als Link (`i_14`, `i_15`). **Nein** beim Wegräumen: weg ohne Satz und ohne Rückweg (V2) |
| Otto setzt fest | **ja**: „Stimmt so nicht“ → „So stimmt es“ → „Deine Fassung gilt vor allem, was ich vermute …“ (`i_32_stimmt_nicht.png`): ein Satz, ein Feld, gut |
| Gedächtnis zeigt, wo es gilt | **ja, aber laut**: dieselbe Zeile „von dir · gilt für dich“ fünfmal, und je Eintrag zwei Knöpfe (V3) |
| Je weniger umkehrbar, desto mehr Bestätigung | **halb**: Nicht umkehrbar ist richtig abgestuft. Umkehrbar fragt trotzdem mit einer Karte nach, und es gibt drei verschiedene Formen der Bestätigung (V1) |
| Fremdes ist Daten | **ja** am Teleskop: Bauplan in Klartext, „Es tut nichts von selbst und verschickt nichts.“ (`i_21_stern.png`). Das ist die beste Vertrauensfläche der App |
| Ehrlich über Grenzen | **ja**: „Ob jemand mitdenkt, weiß ich, sobald du mir etwas sagst. Hier ginge es nur mit Claude über claude.ai.“ |
| Keine Technikwörter (P3) | **nein** im Verbinden-Blatt (V4), und „#d62a26“ im Gedächtnis (V3) |

**Urteil:** Vertrauen ist dort ruhig, wo es in die Handlung eingebaut ist: Bauplan, Fassungen, „Stimmt so nicht“. Zur Bürokratie wird es, wo es als eigene Schicht obendrauf liegt: die zweite Karte nach „Übernehmen“, die Herkunftszeile, die nichts unterscheidet, drei Formen von „Wirklich?“. Die Regel, die ich vorschlage: **Vertrauen zeigt nur die Ausnahme.** Das Normale (von dir, für dich, umkehrbar) ist still. Laut wird nur, was fremd, vermutet oder endgültig ist.

Nebenbefunde ohne Veto:
- leonardo: In der Anders-Vorschau wird Ottos Wunschsatz „Ich will auch die Kilometer eintragen“ zur Beschriftung des km-Felds. „Kilometer heute“ würde reichen (`i_13`).
- jung: Das ✕ des Buchs liegt weiter über dem Knopf „Himmel“ (`i_30_wissen.png`). Der Eintrag „Früher notiert: Woran du baust“ ist schwer zu lesen.
- Prüfgrenze: Am iPhone-Test war „Linux“ vorgewählt. Das liegt wohl an der Kennung des Testbrowsers; mit einem echten iPhone habe ich es nicht geprüft.

---

### V1 · rams → raffael · Freigabe (`C6.freigabe`) · Teleskop und das ganze System
Bruch:
1. Otto liest den Bauplan von „Zwei Wege“ und tippt „Übernehmen“. Darüber legt sich eine zweite Karte: „„Zwei Wege“ übernehmen? … Du kannst es jederzeit wieder abnehmen. [Lieber nicht] [Übernehmen]“. Die Karte verdeckt den Bauplan, den er gerade gelesen hat. Für eine umkehrbare Handlung ohne Wirkung nach außen fragt Carl also zweimal dasselbe.
2. Die erste Stufe der Karte sieht für „umkehrbar“ und „nicht umkehrbar“ gleich aus.
3. Daneben gibt es zwei weitere Bestätigungsformen: die Pille „Wirklich?“ (einzeln Vergessen) und den Link „Wirklich wegräumen?“ (Werkzeug).

Bilder: `rams_bilder/i_21_stern.png` → `rams_bilder/i_21_bauplan.png`, `rams_bilder/i_34_alles_vergessen.png`, `rams_bilder/i_33_vergessen_einzeln.png`, `rams_bilder/i_16_wegraeumen.png`.
Prinzip/Annahme: AIUI-Harness-Regel „Je weniger umkehrbar, desto mehr Bestätigung. Kleine Entscheidungen still“; AUFTRAG 2 („umkehrbar: eine Wahl“); P1; System (ein Zustand, eine Form).
Gegenvorschlag: `C6.freigabe({umkehrbar:true})` zeigt keine Karte. Der Knopf, den Otto schon gedrückt hat (im Bauplan: „Übernehmen“), ist die eine Wahl, und danach kommt ein Satz mit Rückweg: „Hängt an deiner Wand. [Abnehmen]“. Die Karte gibt es nur für `umkehrbar:false`, dann immer mit Folgen-Satz und zweitem Tipp, wie heute bei „Alles vergessen“. Einzel-Vergessen und Wegräumen rufen beide `C6.freigabe` statt eigener Formen. So gibt es zwei Stufen und zwei Formen in der ganzen App.
Was ich am Werk des anderen schätze: Die Karte für „Alles vergessen“ ist genau richtig. Ein Satz sagt, was verloren geht, ein zweiter „Das lässt sich nicht rückgängig machen.“, und der Knopf wird erst beim zweiten Tipp zu „Wirklich: Alles vergessen“. Mehr Vertrauen braucht es nicht.

### V2 · rams → leonardo · Werkzeug · Wegräumen
Bruch: „Wegräumen“ wird beim ersten Tipp zu „Wirklich wegräumen?“, beim zweiten ist „Gelaufen?“ weg. Es kommt kein Satz, was mit den Einträgen der letzten vier Wochen geschieht, und kein „Zurückholen“. Im Space steht danach nichts mehr, `C6.werkzeug.alle()` ist leer. Ob die Daten intern bleiben, sieht Otto nicht. Der Link sieht genauso aus wie „Ins Teleskop hängen“ und „Zurück zur alten Fassung“. `rams_bilder/i_16_wegraeumen.png`, `rams_bilder/i_17_weggeraeumt.png`.
Prinzip/Annahme: AIUI-Harness-Regel „Einträge gehen nie verloren“, P4 (Otto weiß nicht, was er verliert), AUFTRAG 2 (nicht umkehrbar → Satz, was verloren geht).
Gegenvorschlag: Wegräumen wird umkehrbar und damit still. Ein Tipp, dann sagt Carl: „Weggeräumt. Deine Einträge bleiben. [Zurückholen]“. Das Werkzeug liegt danach in der Werkstatt in einem Fach „Weggeräumt“ (Daten bleiben, wie heute schon im Zustand). Nur „Für immer löschen“ dort läuft über `C6.freigabe({umkehrbar:false})`.
Was ich am Werk des anderen schätze: Die Fassungen sind vorbildlich still: Die neue Fassung erscheint erst nach „Passt“, und „Zurück zur alten Fassung“ / „Wieder die neuere“ sind leise Links statt Dialoge. So soll Vertrauen aussehen.

### V3 · rams → jung · Buch · „Was ich von dir weiß“
Bruch:
- Fünf Einträge tragen fünfmal dieselbe Zeile „von dir · gilt für dich“, und unter jedem stehen „Stimmt so nicht“ und „Vergessen“. Die Seite hat 20 Bedienelemente und ist wie ein Formular aufgebaut. Die Herkunft unterscheidet hier nichts, weil alles von Otto kommt.
- Die Sockenfarbe steht als „#d62a26“ da.
- Ganz oben, vor allem, was Carl weiß, steht „Deine Geräte · Abgleich · Dein Rechner · Verbinden ›“.

`rams_bilder/i_30_wissen.png`, `rams_bilder/i_31_wissen_1.png`, `rams_bilder/i_31_wissen_2.png`.
Prinzip/Annahme: P1 (in zehn Sekunden: „das weiß Carl über mich“), P3 (kein Technikwort), A10, Harness-Regel „Gedächtnis zeigt, wo es gilt“: Sie wirkt nur, wenn die Ausnahme sichtbar wird.
Gegenvorschlag:
- Die Überschrift „Von dir · gilt für dich“ steht einmal über der Gruppe. Eine Herkunftszeile bekommt nur ein Eintrag, der abweicht („aus einem Fund“ mit Zeichen, „von Carl vermutet“, „gilt für ‚Wieder laufen gehen‘“).
- „Stimmt so nicht / Vergessen“ erscheinen erst, wenn Otto einen Eintrag antippt.
- Die Socken zeigen einen Farbpunkt und „Rot“.
- „Deine Geräte“ rückt ans Ende vor „Alles vergessen“.
Was ich am Werk des anderen schätze: „Stimmt so nicht“ ist die menschlichste Bedienung der App: ein Feld „So stimmt es“ und der Satz „Deine Fassung gilt vor allem, was ich vermute. Auch auf deinen anderen Geräten und mit jedem Modell.“ Daran ist nichts zu streichen.

### V4 · rams → stan-lee · Verbinden-Blatt
Bruch: Aus dem Buch heraus („Verbinden ›“) bekommt Otto ein Blatt mit diesen Teilen:
- die Wahlen „Claude Code / Codex“ und „Mac / Windows / Linux / Server“,
- „Öffne ein Terminal-Fenster (oft Strg + Alt + T)“,
- eine unlesbare Shell-Zeile zum Einfügen (`claude --version >/dev/null 2>&1 && printf … sha256sum | cut -c1-8 …`),
- als Lohn: „und das UFO in der Garage wacht auf“.

Der beruhigende Satz „Die Zeile ändert nichts an deinem Rechner, sie rechnet nur.“ bringt Otto eine Gewohnheit bei, die die Sicherheits-Prüfliste fürchtet: Code einfügen, den man nicht lesen kann, weil eine App es verspricht. `rams_bilder/i_40_verbinden.png`, `rams_bilder/c_40_verbinden.png`.
Prinzip/Annahme: P3 (Raum statt Programm, keine Technikwörter), P4 und Prüfliste A3/C10 (nichts ausführen, was Otto nicht versteht und freigibt), A6 (gelernte Gewohnheiten binden, auch die schlechten), A9 ohne Köder (Belohnung für einen Terminalbefehl).
Gegenvorschlag:
- Das Blatt kommt nur noch über den Bastler-Weg (unten im Buch steht schon „Für Bastler: Carl auf deinem Computer ›“; wohin der Link heute führt, habe ich nicht geprüft), nicht mehr über die erste Zeile im Buch.
- Der UFO-Satz fällt weg. Das UFO darf aufwachen, aber angekündigt wird es nicht.
- „Codex“ und „Server“ fallen weg, solange Otto sie nicht kennt.
- Die Zeile steht zugeklappt unter „Zeile ansehen“, darüber ein Satz in Ottos Worten: „Diese Zeile fragt nur, ob Claude Code da ist, und rechnet daraus sechs Ziffern.“

10 Minuten: Text, zwei Chips und ein `<details>`.
Was ich am Werk des anderen schätze: Der Weg ist ehrlich gebaut. Die Zeile sagt wirklich nur, ob Claude Code da ist, und der sechsstellige Carl-Code ist eine kluge, sichere Brücke ohne Konto und ohne Passwort.

---

**Selbstprüfung:** Habe ich aus Liebe zur Ruhe Vertrauen gestrichen? Nein. Keine Freigabe fällt weg, wo etwas endgültig ist oder nach außen wirkt. Ich verlege nur die Lautstärke: still für das Umkehrbare und Eigene, deutlich für das Fremde und Endgültige. Das UFO bleibt, nur der Köder fällt.
**Grenzen:** Ein geteiltes Werkzeug eines anderen Menschen (`wz:`-Stern) gab es für einen frischen Otto nicht. Geprüft habe ich deshalb den Bauplan eines Denk-Werkzeugs. Einen Fund mit versteckter Anweisung, „Trennen“ und die Freigabe für Claude Code habe ich nicht geklickt; dafür gibt es rothkos Prüffall. Das Freigabe-Bild am Computer ist gemacht, die Karte selbst habe ich dort nicht weitergeklickt.
