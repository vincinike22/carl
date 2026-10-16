# s13 · Otto-Probe (Rune mit Rams und Papert) · 16.10.2026

**Stand:** `carl6-test.html`, frisch gebaut nach den Partien (Quelle: Branch carl6, ungespeicherte Arbeit aller Partien; mein letzter Bau nach dem Nachtrag in `stimme.js`). In den letzten 10 Minuten vor der Probe hat keine andere Partie mehr in `src/` geschrieben.
**Werkzeug:** Playwright/Chromium. Echte Taps (iPhone 390×844, Touch, Faktor 2) und echte Klicks (Computer 1440×900). Jeder Lauf mit frischem Speicher. Auf der Leinwand des Himmels wird an den Ort des Planeten getippt, nicht der Knopf gerufen.
**Läufe:** 4 = 2 Geräte × {mit Fake-Kalender (Mathe-Prüfung in 4 Tagen 09:00, Zahnarzt in 2 Tagen 15:30), ohne Kalender (`claude.use('mcp')` = null)}. Skript: `/tmp/claude-0/-home-claude/e40f4e8f-b3a0-54da-8cc4-cfa60717fbf9/scratchpad/ot_lauf.py`, Rohdaten: `otto.json`, Bilder: `werkstatt/s13/otto/*.png`.
**Fluss** (ENTSCHEIDUNGEN, letzter Absatz): frisch → Rezeption → Fach → Karteikarten → zurück → Neuladen → Brief öffnen → Garage → Katalog blättern und zuklappen → Zuhause: Satz → neuer Space → Zettel → zwei Vorschläge (Weiterdenken + Machen) → Los → Himmel → Planet.
**Konsolenfehler:** 0 in allen 4 Läufen.
**Ungeprüft:** echtes iPhone; echtes Mitdenken (Claude); echter Google-Kalender und die Fehlerzweige `server_not_connected`, `needs_reauth`, `approval_required` (der Fake liefert nur Daten); Katalog-Kauf (0 Münzen); Antwort auf den Brief als Zettel; Carl schwebt (nicht gemessen); reduzierte Bewegung; Tastatur-Bedienung.

## Urteil je Teil (Maßstab der Stoppuhr: 1 Geste · 2 wahr je Zustand · 3 leise bis zur Frage · 4 endet im Gedächtnis · 5 jede Kante)

| Teil | 1 | 2 | 3 | 4 | 5 | Urteil | Warum (Bild) |
|---|---|---|---|---|---|---|---|
| Fächerregal der Tage | ✓ | ✓ | ✓ | ✓ | ✗ | **nicht erfüllt** | Tippen öffnet den Tag, das Fach wird umrandet, der gebaute Stapel liegt im Fach und ist nach dem Neuladen noch da. Kante: Das Tagesblatt ist zu klein (Rams V1). `kal-iphone-02-fach`, `kal-computer-02-fach` |
| Tagesblatt mit Angebot | ✓ | ✓ | ✓ | ✓ | ✗ | **nicht erfüllt** | Der Satz „„Mathe-Prüfung“ ist in 4 Tagen. Soll ich dir Karteikarten machen?“ stimmt. Am iPhone ragen „Ja, bitte“ 11 px, „Nicht nötig“ 59 px und „Zu den Karten“ 22 px unter den Rand (gemessen). Ohne Kalender steht die Kalender-Wahrheit unter dem Falz (Rune V2). |
| Karteikarten (leer, ohne Mitdenken) | ✓ | ✓ | ✓ | ✓ | ✗ | **nicht erfüllt** | Umdrehen und „Gewusst“ funktionieren, und das Gewusste bleibt nach dem Neuladen gespeichert. Aber die eben geschriebene Karte ist danach nicht zu sehen (Papert V1). Am Computer ist das Blatt nur 102 px hoch, Karte und Ablagen sind abgeschnitten. `kal-iphone-05`, `kal-computer-06-umdrehen` |
| Postfach & Brief | ✓ | ✓ | ✓ | (✓) | ✓ | **erfüllt** (Antwort-Zettel ungeprüft) | Mit Kalender stehen im Brief nur Neues, das Vorbereitete und die eine Frage, dazu „Woher ich das weiß: dein Kalender“. Ohne Kalender kommt der ehrliche erste Brief. `kal-iphone-11-brief`, `ohne-iphone-06-brief` |
| Katalog als Heft (Garage) | ✓ | ✓ | ✓ | – | ✓ | **erfüllt** (Kauf ungeprüft) | Das Heft liegt im Raum, man blättert mit dem Eselsohr, Register am Rand, die Stempel stimmen („leuchtet“). Es lässt sich zuklappen. `kal-iphone-15-blaettern` |
| Vier Vorschläge im Space | ✓ | ✗ | ✓ | ✗ | ✗ | **nicht erfüllt** | Mehrfachwahl und Los gehen. Weiterdenken hängt die Antwort als Zettel. Machen fragt bei zwei gewählten Karten nie: „1 hängt. Noch kein Schritt …“, der nächste Satz wird ein gewöhnlicher Zettel, das Schild bleibt leer (Rune V1). `kal-iphone-20`, `-21` |
| Planet von oben | ✓ | ✓ | ✓ | ✓ | ✓ | **erfüllt** | „4 Zettel von dir, noch kein Kernsatz. Ein nächster Schritt fehlt.“ ist wahr, dazu Zuletzt, Pflanze und die vier Karten. Der alte Himmelssatz „dann fliegen wir hin“ stimmte nicht mehr; ich habe ihn selbst korrigiert, siehe unten. `kal-computer-23-planet` |

## Was Rune selbst behoben hat (aus der Probe, in `stimme.js`)
- `vorb.keinKopf.karteikarten|packliste|merkzettel` auf einen Satz gekürzt („Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen.“). Der alte Satz („Ich leg dir einen leeren Stapel hin“) stand noch in der Blase, als schon Karten im Stapel lagen, und wiederholte das Tagesblatt.
- `vorschlag.weiter.frage` → „Was folgt aus „{t}“?“ (vorher „„…fahren.“. Was folgt daraus?“). Bleibt: Der Punkt in {t} gehört abgeschnitten, das ist ein Wunsch an papert.
- `himmel.raum` → „… Tipp einen Planeten an, dann schauen wir ihn von oben an.“ Seit AUFTRAG 9 fliegt ein Tipp nicht mehr hin, sondern öffnet „von oben“. Der Ersatzsatz in `netz.js:2166` sagt noch „fliegen wir hin“ (papert).

## Vetos (je höchstens drei)
- Rune: `veto/rune.md` – V1 Machen bei Mehrfachwahl lügt · V2 Kalender-Wahrheit unter dem Falz
- Rams: `veto/rams.md` – V1 Tagesblatt zu klein, Knöpfe abgeschnitten (B3 offen) · V2 drei Nein-Wege im Brief
- Papert: `veto/papert.md` – V1 die gebaute Karte verschwindet · V2 ohne Kalender kann der Mensch das Regal nicht selbst füllen

## Protokoll (Zeit seit Start des Laufs · Gerät · Lauf · Schritt · Carls Blase · Messung/Bild)

| Zeit | Lauf | Schritt | Carl sagt | Messung · Bild |
|---|---|---|---|---|
| 0.3 s | iphone · kal | frisch | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Kalender: verbunden · `kal-iphone-01-frisch.png` |
| 2.3 s | iphone · kal | fach | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  {"blatt": [508, 692], "abgeschnitten": ["Ja, bitte ragt 11px", "Nicht nötig ragt 59px"], "blaseDecktFaecher": 0} · `kal-iphone-02-fach.png` |
| 5.5 s | iphone · kal | ja-bitte | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  {"blatt": [508, 692], "abgeschnitten": ["Zu den Karten ragt 22px"], "blaseDecktFaecher": 0} · `kal-iphone-03-ja-bitte.png` |
| 7.4 s | iphone · kal | zu-den-karten | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  · `kal-iphone-04-zu-den-karten.png` |
| 9.9 s | iphone · kal | erste-karte | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  {"karte": [315, 465], "sichtbar": false} · `kal-iphone-05-erste-karte.png` |
| 11.3 s | iphone · kal | umdrehen | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  · `kal-iphone-06-umdrehen.png` |
| 13.0 s | iphone · kal | gewusst | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  · `kal-iphone-07-gewusst.png` |
| 14.3 s | iphone · kal | zuklappen | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  · `kal-iphone-08-zuklappen.png` |
| 17.5 s | iphone · kal | neu-geladen | Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins. | Karten nach Neuladen: ja · `kal-iphone-09-neu-geladen.png` |
| 19.4 s | iphone · kal | fach-nach-laden | Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins. |  · `kal-iphone-10-fach-nach-laden.png` |
| 23.0 s | iphone · kal | brief | Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins. |  · `kal-iphone-11-brief.png` |
| 24.3 s | iphone · kal | brief-zu | Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins. |  · `kal-iphone-12-brief-zu.png` |
| 26.8 s | iphone · kal | garage | Dein Rad. Tipp es an. |  · `kal-iphone-13-garage.png` |
| 29.2 s | iphone · kal | katalog |  |  · `kal-iphone-14-katalog.png` |
| 30.9 s | iphone · kal | blaettern |  |  · `kal-iphone-15-blaettern.png` |
| 32.9 s | iphone · kal | katalog-zu |  |  · `kal-iphone-16-katalog-zu.png` |
| 49.1 s | iphone · kal | space-zettel | Noch ein Zettel, dann keimt er. |  · `kal-iphone-17-space-zettel.png` |
| 50.9 s | iphone · kal | zwei-gewaehlt | Noch ein Zettel, dann keimt er. |  · `kal-iphone-18-zwei-gewaehlt.png` |
| 54.0 s | iphone · kal | los | Was folgt aus „Ich will im Frühling mit dem Rad nach Krems fahren.“? |  · `kal-iphone-19-los.png` |
| 57.8 s | iphone · kal | antwort-weiterdenken | „Schlauch“ stand schon auf deinem Zettel vom 16. Oktober: „Der Schlauch vom Hinterrad ist kaputt.“. |  · `kal-iphone-20-antwort-weiterdenken.png` |
| 61.5 s | iphone · kal | antwort-machen | Hängt an der Leine. |  Schild: „Nächster Schritt Was ist der nächste Schritt?“ · `kal-iphone-21-antwort-machen.png` |
| 65.4 s | iphone · kal | himmel |  |  · `kal-iphone-22-himmel.png` |
| 69.6 s | iphone · kal | planet |  |  · `kal-iphone-23-planet.png` |
| | | Konsolenfehler: 0 | | |
| 0.4 s | iphone · ohne | frisch | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Kalender: nicht-verbunden · `ohne-iphone-01-frisch.png` |
| 2.3 s | iphone · ohne | fach | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  {"blatt": [508, 692], "abgeschnitten": [], "blaseDecktFaecher": 0} · `ohne-iphone-02-fach.png` |
| 4.2 s | iphone · ohne | beispiel | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Fach heute · `ohne-iphone-03-beispiel.png` |
| 5.4 s | iphone · ohne | zuklappen | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  · `ohne-iphone-04-zuklappen.png` |
| 8.5 s | iphone · ohne | neu-geladen | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Karten nach Neuladen: keine (richtig, nichts gebaut) · `ohne-iphone-05-neu-geladen.png` |
| 11.3 s | iphone · ohne | brief | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  · `ohne-iphone-06-brief.png` |
| 12.7 s | iphone · ohne | brief-zu | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  · `ohne-iphone-07-brief-zu.png` |
| 15.0 s | iphone · ohne | garage | Dein Rad. Tipp es an. |  · `ohne-iphone-08-garage.png` |
| 17.4 s | iphone · ohne | katalog |  |  · `ohne-iphone-09-katalog.png` |
| 19.2 s | iphone · ohne | blaettern |  |  · `ohne-iphone-10-blaettern.png` |
| 21.2 s | iphone · ohne | katalog-zu |  |  · `ohne-iphone-11-katalog-zu.png` |
| 37.2 s | iphone · ohne | space-zettel | Noch ein Zettel, dann keimt er. |  · `ohne-iphone-12-space-zettel.png` |
| 39.1 s | iphone · ohne | zwei-gewaehlt | Noch ein Zettel, dann keimt er. |  · `ohne-iphone-13-zwei-gewaehlt.png` |
| 42.2 s | iphone · ohne | los | Was folgt aus „Ich will im Frühling mit dem Rad nach Krems fahren.“? |  · `ohne-iphone-14-los.png` |
| 46.1 s | iphone · ohne | antwort-weiterdenken | „Schlauch“ stand schon auf deinem Zettel vom 16. Oktober: „Der Schlauch vom Hinterrad ist kaputt.“. |  · `ohne-iphone-15-antwort-weiterdenken.png` |
| 49.7 s | iphone · ohne | antwort-machen | Hängt an der Leine. |  Schild: „Nächster Schritt Was ist der nächste Schritt?“ · `ohne-iphone-16-antwort-machen.png` |
| 53.7 s | iphone · ohne | himmel |  |  · `ohne-iphone-17-himmel.png` |
| 58.0 s | iphone · ohne | planet |  |  · `ohne-iphone-18-planet.png` |
| | | Konsolenfehler: 0 | | |
| 0.2 s | computer · kal | frisch | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Kalender: verbunden · `kal-computer-01-frisch.png` |
| 2.0 s | computer · kal | fach | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  {"blatt": [638, 740], "abgeschnitten": [], "blaseDecktFaecher": 0} · `kal-computer-02-fach.png` |
| 5.1 s | computer · kal | ja-bitte | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  {"blatt": [637, 740], "abgeschnitten": [], "blaseDecktFaecher": 0} · `kal-computer-03-ja-bitte.png` |
| 7.0 s | computer · kal | zu-den-karten | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  · `kal-computer-04-zu-den-karten.png` |
| 9.2 s | computer · kal | erste-karte | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  {"karte": [329, 533], "sichtbar": false} · `kal-computer-05-erste-karte.png` |
| 10.5 s | computer · kal | umdrehen | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  · `kal-computer-06-umdrehen.png` |
| 12.1 s | computer · kal | gewusst | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  · `kal-computer-07-gewusst.png` |
| 13.2 s | computer · kal | zuklappen | Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen. |  · `kal-computer-08-zuklappen.png` |
| 16.2 s | computer · kal | neu-geladen | Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins. | Karten nach Neuladen: ja · `kal-computer-09-neu-geladen.png` |
| 18.0 s | computer · kal | fach-nach-laden | Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins. |  · `kal-computer-10-fach-nach-laden.png` |
| 21.4 s | computer · kal | brief | Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins. |  · `kal-computer-11-brief.png` |
| 22.6 s | computer · kal | brief-zu | Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins. |  · `kal-computer-12-brief-zu.png` |
| 24.8 s | computer · kal | garage | Dein Rad. Tipp es an. |  · `kal-computer-13-garage.png` |
| 27.1 s | computer · kal | katalog |  |  · `kal-computer-14-katalog.png` |
| 29.0 s | computer · kal | blaettern |  |  · `kal-computer-15-blaettern.png` |
| 30.8 s | computer · kal | katalog-zu | Dein Rad. Tipp es an. |  · `kal-computer-16-katalog-zu.png` |
| 46.9 s | computer · kal | space-zettel | Noch ein Zettel, dann keimt er. |  · `kal-computer-17-space-zettel.png` |
| 48.6 s | computer · kal | zwei-gewaehlt | Noch ein Zettel, dann keimt er. |  · `kal-computer-18-zwei-gewaehlt.png` |
| 51.7 s | computer · kal | los | Was folgt aus „Ich will im Frühling mit dem Rad nach Krems fahren.“? |  · `kal-computer-19-los.png` |
| 55.4 s | computer · kal | antwort-weiterdenken | „Schlauch“ stand schon auf deinem Zettel vom 16. Oktober: „Der Schlauch vom Hinterrad ist kaputt.“. |  · `kal-computer-20-antwort-weiterdenken.png` |
| 58.8 s | computer · kal | antwort-machen | Hängt an der Leine. |  Schild: „Nächster Schritt Was ist der nächste Schritt?“ · `kal-computer-21-antwort-machen.png` |
| 62.8 s | computer · kal | himmel |  |  · `kal-computer-22-himmel.png` |
| 66.9 s | computer · kal | planet |  |  · `kal-computer-23-planet.png` |
| | | Konsolenfehler: 0 | | |
| 0.2 s | computer · ohne | frisch | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Kalender: nicht-verbunden · `ohne-computer-01-frisch.png` |
| 2.0 s | computer · ohne | fach | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  {"blatt": [582, 740], "abgeschnitten": [], "blaseDecktFaecher": 0} · `ohne-computer-02-fach.png` |
| 3.8 s | computer · ohne | beispiel | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Fach heute · `ohne-computer-03-beispiel.png` |
| 4.9 s | computer · ohne | zuklappen | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  · `ohne-computer-04-zuklappen.png` |
| 7.8 s | computer · ohne | neu-geladen | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Karten nach Neuladen: keine (richtig, nichts gebaut) · `ohne-computer-05-neu-geladen.png` |
| 10.6 s | computer · ohne | brief | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  · `ohne-computer-06-brief.png` |
| 11.7 s | computer · ohne | brief-zu | Ich bin Carl, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. |  · `ohne-computer-07-brief-zu.png` |
| 14.0 s | computer · ohne | garage | Dein Rad. Tipp es an. |  · `ohne-computer-08-garage.png` |
| 16.3 s | computer · ohne | katalog |  |  · `ohne-computer-09-katalog.png` |
| 18.0 s | computer · ohne | blaettern |  |  · `ohne-computer-10-blaettern.png` |
| 19.9 s | computer · ohne | katalog-zu | Dein Rad. Tipp es an. |  · `ohne-computer-11-katalog-zu.png` |
| 35.8 s | computer · ohne | space-zettel | Noch ein Zettel, dann keimt er. |  · `ohne-computer-12-space-zettel.png` |
| 37.6 s | computer · ohne | zwei-gewaehlt | Noch ein Zettel, dann keimt er. |  · `ohne-computer-13-zwei-gewaehlt.png` |
| 40.6 s | computer · ohne | los | Was folgt aus „Ich will im Frühling mit dem Rad nach Krems fahren.“? |  · `ohne-computer-14-los.png` |
| 44.3 s | computer · ohne | antwort-weiterdenken | „Schlauch“ stand schon auf deinem Zettel vom 16. Oktober: „Der Schlauch vom Hinterrad ist kaputt.“. |  · `ohne-computer-15-antwort-weiterdenken.png` |
| 47.7 s | computer · ohne | antwort-machen | Hängt an der Leine. |  Schild: „Nächster Schritt Was ist der nächste Schritt?“ · `ohne-computer-16-antwort-machen.png` |
| 51.7 s | computer · ohne | himmel |  |  · `ohne-computer-17-himmel.png` |
| 55.7 s | computer · ohne | planet |  |  · `ohne-computer-18-planet.png` |
| | | Konsolenfehler: 0 | | |