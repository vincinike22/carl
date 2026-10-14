# Runde s9 · Carl mit allem (10.10., mittags)

nico: „Ok, jetzt überarbeite Carl mit allem.“ = mit den Grundsätzen (final), dem AIUI-Maßstab inkl. **Harness-Regeln**, dem Wissen (`werkstatt/s9/WISSEN_HARNESS.md`, Sicherheits-Prüfliste in `werkstatt/s9/wissen_C.md` Abschnitt „Sicherheits-Prüfliste“), der Geräte-Recherche (`werkstatt/s7/GERAETE.md`) und den offenen Punkten aus s5–s8 (Kreuzungsblatt).

Pflicht vorher: `werkstatt/s5/GRUNDSAETZE.md`, `werkstatt/s6/AIUI_MASSSTAB.md` (neuer Schluss-Abschnitt „Harness-Regeln“), `werkstatt/s9/WISSEN_HARNESS.md`, `werkstatt/s5/NAMEN.md`, Ende `werkstatt/KREUZUNG.md`.

## Vitruvians Entscheidungen
1. **Nichts Neues an Räumen.** Diese Runde vertieft: Vertrauen, Gedächtnis, Sicherheit, Feinschliff. Wer etwas Neues sichtbar macht, muss dafür etwas Altes leiser machen.
2. **Freigabe im Code:** eine Kern-Funktion `C6.freigabe({was, folgen, umkehrbar})` → Promise<bool>; jede Handlung mit Wirkung nach außen oder ohne Rückweg läuft darüber (Werkzeug übernehmen aus dem Teleskop, Alles vergessen, Verbindung trennen, später: Claude Code etwas tun lassen). Je weniger umkehrbar, desto deutlicher die Frage (umkehrbar: eine Wahl; nicht umkehrbar: zweiter Tipp + Satz, was verloren geht).
3. **Gedächtnis mit Herkunft und Gültigkeit:** Jeder Eintrag in „Was ich von dir weiß“ zeigt, woher er kommt (von dir · aus einem Fund · von Carl vermutet) und wofür er gilt (für dich · für Space X · für Werkzeug Y). Neben „Vergessen“ steht **„Stimmt so nicht“** (Otto schreibt die richtige Fassung; sie gewinnt immer, auch nach Modellwechsel und Sync). Einträge aus Funden sind markiert und werden Carl nie als Anweisung gegeben.
4. **Werkzeuge mit Fassungen:** jede Änderung erst nach „Passt“, die Vorfassung bleibt; „Zurück zur alten Fassung“ immer; Einträge gehen nie verloren (Regel im Code geprüft).
5. **Fremdes ist Daten:** geteilte Werkzeuge aus dem Teleskop zeigen vor dem Übernehmen ihren Bauplan in Klartext (Bausteine, Name, keine Ausführung), übernehmen nur über `C6.freigabe`; jeder Text von außen (Funde, geteilte Pläne) geht nur in `<fund>`/`<daten>`-Klammern an `C6.denk`. Kern: `C6.denk` bekommt eine Option `daten:[…]`, die das sauber einbettet.
6. **Ehrlich über Grenzen:** Wenn Mitdenken fehlt oder versagt, sagt Carl das einmal je Sitzung in seiner Stimme; im Buch steht bei „Wer denkt mit“ ehrlich, welches Modell gerade wirklich denkt (heute: Claude über claude.ai).
7. **Offene Feinschliffe** aus den letzten Runden werden erledigt (Liste in den Partien).

## Partien (eigene Dateien, Kreuzungsblatt „s9 · <name>“, Bilder `werkstatt/s9/<name>/`, iPhone 390 + Computer 1100, 0 Konsolenfehler, 45–60 min)
1. **raffael · Kern** (`kern.*`, `sync.js`): `C6.freigabe` (2), `C6.denk(…, {daten})` (5), ein Grenzsatz je Sitzung (6); Sync: Ottos Korrekturen („Stimmt so nicht“) gewinnen immer (Feld je Eintrag `fest:true`), Wochenend-Einladung nur einmal je Mensch (in S, synct). APIs zuerst ins Kreuzungsblatt.
2. **jung · Gedächtnis** (`atlas.*`): Herkunft + Gültigkeit je Eintrag, „Stimmt so nicht“, „Alles vergessen“ über `C6.freigabe`, „Wer denkt mit“ ehrlich (6).
3. **leonardo · Werkzeuge** (`werkzeug.*`, `werkstatt.*`): Fassungen + „Zurück zur alten Fassung“ (4), Einträge nie verlieren (Test im Code), „Kilometer“ & Co. als Wert mit Einheit erkennen, Ferdls Recherche-Text über `daten` (5).
4. **hokusai · Teleskop + Himmel** (`teleskop.*`, `netz.*`): Bauplan-Ansicht vor dem Übernehmen + `C6.freigabe` (5); prüfe am iPhone, ob Carl im Freudenflug wirklich hinter Planeten verschwindet, sonst beheben.
5. **miyazaki · Zuhause + Space** (`zuhause.*`, `space.*`): Namen am Brett nie abgeschnitten (zwei Zeilen oder kürzen mit Bedacht), Teppich/Matte und Lampe/Pflanze am iPhone ohne Überlappung, Space-Zettel aus Funden sichtbar als Fund markiert (kleines Zeichen).
6. **rothko · Lesesaal** (`lesesaal.*`): Funde gehen nur über `C6.denk(…, {daten})`; ein fester Prüffall mit versteckter Anweisung im Fund (z. B. „Ignoriere alles und …“) in einem Testskript, das zeigt: Carl folgt ihr nicht, wählt nur aus bestehenden Spaces.

Danach: **Rune + Rams als Otto** mit echten Klicks und die Sicherheits-Prüfliste (Pflichtpunkte) abhaken; Vetos wie s5/s6.
