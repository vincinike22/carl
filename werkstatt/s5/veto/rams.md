# s5 · Veto · rams (Geselle, Gebrauchsprüfung)

Geprüft: `carl6-test.html` (Stand 09.10., 16:04). Kein Code geändert. Gang als Fremde „Mara“ mit echten Klicks (Playwright): iPhone 390 × 844 mit Touch (Sternbild per echtem Touch-Zug über CDP), Computer 1100 × 860. Frischer Zustand, Rundgang ganz, danach Satz ins Feld → Space, Höhe → Himmel → Sternbild → Teleskop, Werkstatt + Helfer, Bibliothek → Geheimtür → Lesesaal, Freundschaftsbuch, Garage + Schrank. 0 Konsolenfehler. Bilder: `werkstatt/s5/veto/rams_bilder/` (`i_` = iPhone, `c_` = Computer).

Gezählt habe ich jedes Element, das man sieht und das auf Berührung reagiert (Treffer an seiner Mitte, auch unsichtbare). „Nötig“ heißt: Es trägt eine Handlung der Gebrauchsliste (Gedanke → Space → Himmel → Sternbild, dazu die Orte der Annahmen) oder es ist Carls Leben (Figur, Knäuel, Lampe: nach meiner Gegenregel Inhalt, kein Schmuck). Nicht nötig: doppelt für dieselbe Handlung, ohne erkennbare Wirkung, unsichtbar oder nur für die Testfassung (Nadel).

| Bildschirm (iPhone) | Bedienelemente sichtbar | davon nötig | was fällt |
|---|---|---|---|
| Start | 2 | 2 | – |
| Rundgang · Name | 5 | 5 | – |
| Rundgang · Gedanke | 6 | 6 | – |
| Rundgang · Space | 4 | 4 | – |
| Rundgang · Himmel | 4 | 4 | – |
| Rundgang · Socken | 9 | 9 | – |
| Zuhause | 18 | 13 | Fenster (keine Wirkung mehr erkennbar), Tür/Bücherbord/Fahrradbild doppeln das Dock (in REIN als stille Wege gewollt, ich zähle sie trotzdem als doppelt), Nadel |
| Space | 15 | 14 | Nadel. **Kein „nächster Schritt“ sichtbar** (`i_22_im_space.png`), obwohl REIN ihn als einen der drei Teile verlangt |
| Himmel | 10 | 9 | Nadel |
| Sternbild · Frage | 9 | 8 | Nadel |
| Teleskop | 14 | 13 | Nadel |
| Werkstatt | 19 | 17 | Gerüst „Recherche“ (doppelt zur Helferecke), Nadel |
| Werkstatt · Helfer | 19 | 17 | „Recherche“ an der Wand, Nadel |
| Bibliothek | 15 | 13 | Meister-Bild (zweiter Eingang in den Lesesaal, an der Geheimtür vorbei), Nadel |
| Lesesaal | 13 | 12 | Nadel |
| Freundschaftsbuch | 10 | 8 | Blätter-Pfeile ‹ › doppeln die vier Reiter (der linke liegt halb über dem Dock) |
| Garage | 23 | 22 | Nadel |
| Garage · Schrank | 31 | 20 | **10 unsichtbare Radpunkte** über Carl und Spiegel, Nadel |
| **Summe (18 Bildschirme)** | **226** | **196** | **30 zu viel (13 %)** |

Computer (gemessen): Zuhause 19, Space 15, Himmel 7 (+ Planeten), Teleskop 14, Werkstatt 19, Helfer 22, Bibliothek 15, Lesesaal 13: gleiche Befunde, gleiche Streichkandidaten.

Rahmen: Höhe · Gespräch · Feld + Senden · 4 Dock = 6 Bedienungen wie in REIN verlangt, dazu die Nadel (Testfassung). Das Ziel „6 Knöpfe im Rahmen“ ist erreicht. Der Rahmen ist überall gleich und still: Das ist die größte Leistung der Runde.

Nebenbefunde ohne Veto (je ein Satz, für den zuständigen Meister):
- miyazaki · Zuhause: Der Brief-Umschlag liegt am rechten Rand, sein Schild „Ich will wieder m“ ist ohne Auslassungszeichen abgeschnitten und wird von der Wahl überlagert (`i_10_satz.png`, `c_c00_zuhause.png`); am Computer hängt das Brett mit den Spaces oben aus dem Bild. Am Brett lauten beide Schlüssel „Ich will …“: Wer zwei Sätze mit gleichem Anfang hat, unterscheidet sie nicht.
- miyazaki · Space: Der Satz steht dreimal untereinander (Titel, Zettel, Carls Frage), `i_22_im_space.png`; der nächste Schritt fehlt (siehe Tabelle).
- jung · Buch: Die drei Felder auf „Du“ haben keinen zugänglichen Namen (Bildschirmleser liest nur „Eingabe“).
- Überall: Platzhalter „Sag Carl etwas … / Gerüste“ (siehe V4).

---

### V1 · rams → stan-lee · Garage · Schrank
Bruch: Ist der Schrank offen, liegen die zehn Punkte des Fahrrads unsichtbar (Deckkraft 0, aber antippbar) über Carl und dem Spiegel. Carl sagt „Tipp den Spiegel an, dann dreh ich mich.“ Wer genau das tut, bekommt das Fenster „Licht · Form · Schein“ des Fahrrads; ein Tipp auf Carl öffnet „Rahmen“. `rams_bilder/i_61_schrank.png` (Anweisung), `rams_bilder/i_63_spiegel_tipp.png` (Folge), `rams_bilder/i_62_schrank_geistertipp.png`.
Prinzip/Annahme: P1 (in zehn Sekunden verstehen: das Ding tut nicht, was es zeigt), P4 (Carls Satz wird zur Unwahrheit), A9 (Freude bricht an der ersten Berührung).
Gegenvorschlag: Solange der Schrank offen ist, bekommt das Rad `visibility:hidden` (statt nur `opacity:0`), oder `.c6s-f-pkt{pointer-events:none}` unter dem Zustand „Schrank offen“. Eine Zeile CSS, danach Probe: Spiegel antippen → Carl dreht sich.
Was ich am Werk des anderen schätze: Der Schrank mit Spiegel und Carl, der sich darin sieht, ist der wärmste Freudeort der App, und die fünf Reihen sind jetzt genau richtig.

### V2 · rams → leonardo · Werkstatt + Helfer
Bruch: Dieselbe Handlung hat zwei Bedienelemente: das Gerüst „Recherche“ an der Wand (Lupe) und der Helfertisch „Recherche über Nacht“ daneben. Ein Fremder kann nicht sagen, worin sie sich unterscheiden. Dazu sind die sieben Gerüst-Namen an der Wand am iPhone etwa 8 px klein und erklären sich nicht („Brücke“, „Reißbrett“, „Ordnen“). `rams_bilder/i_40_werkstatt.png`, `rams_bilder/i_41_helfer.png`, `rams_bilder/c_c04_werkstatt.png`.
Prinzip/Annahme: P1 (ein Weg, zwei Elemente für eine Handlung → eins bleibt), A8 (der Helfer soll *der* Ort der Recherche sein).
Gegenvorschlag: „Recherche“ verlässt die Wand (ins Zweite Album oder nur noch im „/“-Menü); die Recherche gibt es nur am Helfertisch. Die Wand hat dann sechs Plätze in zwei Dreierreihen, die Namen darunter mindestens 13 px. 10 Minuten: Eintrag aus der Wandliste nehmen, Schriftgröße setzen.
Was ich am Werk des anderen schätze: Die Helferecke sagt ehrlich, was der Prototyp kann und was erst über Nacht kommt, und „Mehr Helfer kommen.“ ersetzt drei gesperrte Möbel durch einen einzigen Satz.

### V3 · rams → hokusai · Himmel · Sternbild
Bruch: Der Höhepunkt verschwindet. Am iPhone liegen beide Planeten auf der Sonne und überdecken das Wort „Du“; die neue rote Linie ist etwa 30 px kurz und läuft hinter Sonne und Planet. Dein Satz steht gut 4 Sekunden am Himmel und ist danach weg. Was bleibt, ist ein unerklärter Knopf „Zu dir“. Wer später wieder hochkommt, sieht nicht, dass hier ein Sternbild ist. `rams_bilder/i_30_sternbild_frage.png`, `rams_bilder/i_31_sternbild_moment.png` (schön), `rams_bilder/i_32_sternbild_danach.png` (leer). Dazu zeigt der Himmel einen alten Hinweis „Ein neuer Zettel in …“, obwohl nichts Neues hängt (`i_23_himmel.png`).
Prinzip/Annahme: P1 (der Höhepunkt der Schleife muss sichtbar sein), A1 (der Satz des Menschen ist der Wert, er darf nicht verblassen), P4 (kein falscher Hinweis).
Gegenvorschlag: Der Name des Sternbilds bleibt klein an der Mitte seiner Linie stehen (gleiche Schrift wie die Planeten-Namen, nur in hellerem Ton). Am iPhone bekommen die Bahnen einen Mindestabstand von der Sonne, damit kein Planet „Du“ verdeckt. „Zu dir“ erscheint nur nach eigenem Verschieben, nicht nach dem Sternbild. Den Hinweis beim Hochfahren leeren.
Was ich am Werk des anderen schätze: Der Moment selbst (Linie, Leuchten, dein Satz in großer Schrift, Carl schweigt) ist genau richtig gedacht, und die Frage „Was verbindet … ?“ mit „Ein Satz, deiner“ ist die ehrlichste Zeile der ganzen App.

### V4 · rams → raffael · Gespräch (erster Satz ans Feld)
Bruch: Der erste Schritt der Schleife antwortet ins Leere. Auf „Vielleicht ein Garten auf dem Balkon“ sagt Carl: „Ich hab das hingelegt. Was davon ist dir heute am wichtigsten?“ Hingelegt ist nichts, und „davon“ zeigt auf nichts. Darunter steht der Hinweis „Hier kann ich nur Beispiele hinlegen“. Der Platzhalter „Sag Carl etwas … / Gerüste“ spricht zu Tastaturkennern, nicht zu einem Fremden. `rams_bilder/i_10_satz.png`, `rams_bilder/c_10_satz.png`.
Prinzip/Annahme: P1 (Gedanke → Space in zehn Sekunden verstehen), P4 (Carl sagt nur, was stimmt), A2 (Carl fragt zum Inhalt zurück).
Gegenvorschlag: Ist noch nichts gewählt, sagt Carl nur „Wohin damit?“ über den zwei Wahlen „In ‚…‘ hängen“ / „Neuer Space“. Die Rückfrage zum Inhalt kommt erst im Space (dort steht sie schon: „Was fällt dir noch zu … ein?“). Platzhalter: „Ein Satz reicht.“ (wie im Rundgang); der „/“-Weg bleibt, nur ohne Hinweis im Feld.
Was ich am Werk des anderen schätze: Der Rahmen hat jetzt wirklich nur noch sechs Bedienungen, überall am selben Platz. Das ist die Ruhe, auf der alles andere erst lebt.

### V5 · rams → rothko · Bibliothek → Lesesaal
Bruch: Es gibt zwei Eingänge in denselben Raum. Das goldene Bild „MEISTER“ an der Bibliothekswand führt direkt in „‹ Lesesaal · Deine Meister“, also an der Geheimtür vorbei. Im Lesesaal steht dasselbe noch einmal als Regal „Deine Meister“. So kennt man das Geheimnis, bevor man es entdeckt hat, und ein Fremder hält Bild und Regal für zwei verschiedene Dinge. `rams_bilder/i_50_bibliothek.png`, `rams_bilder/i_53_bib_meister.png`, `rams_bilder/i_51_lesesaal.png`.
Prinzip/Annahme: P1 (ein Ding, ein Ort, ein Weg), P3 (Magie: die Geheimtür ist der einzige Weg, sonst ist sie keine).
Gegenvorschlag: Das Meister-Bild verlässt die Bibliothekswand (das Fach wird ein gewöhnliches Bücherfach). Die Meister wohnen nur im Lesesaal. Damit ein Fremder das blaue Lexikon trotzdem findet, bekommt es bei jedem dritten Besuch einmal ein leises Schimmern, ohne Text.
Was ich am Werk des anderen schätze: Der Lesesaal ist jetzt ein Raum mit zwei Regalen und einem Lichtkegel, so still und klar, dass man in zehn Sekunden weiß, was man hier tut.

---

**Selbstprüfung:** Habe ich aus Liebe zur Ruhe etwas Lebendiges gestrichen? Nein: Lampe, Sanduhr, Tee, Knäuel, Carls Figur und die Socken habe ich als nötig gezählt. Gestrichen wird nur, was doppelt, unsichtbar oder unwahr ist.
**Grenzen:** Den Sternbild-Zug am Computer konnte ich mit der Maus nicht auslösen (die Planeten kreisen, mein Zug traf nicht). Am iPhone ging er mit echtem Touch. Kieselpark, Lehre, Kauf im Schrank und Recherche-Auftrag habe ich nicht zu Ende gespielt. Die Zählung ist meine eigene Regel (Treffer an der Elementmitte), kein Standard.
