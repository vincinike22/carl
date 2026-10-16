# Kreuzungsblatt s13 (nur anhängen; Abschnitt „s13 · <name>“; Präfixe: raffael c6tg-, miyazaki c6rw-, papert c6vb-/c6vs-, warhol c6e- (Katalog), Rune nur stimme.js)


## s13 · miyazaki (Rezeption als Raum, Carl schwebt)

**Dateien (mein Besitz):** `src/raeume/rezeption.welt.js`, `src/raeume/rezeption.welt.css` (beide neu geschrieben), in `src/raeume/rezeption.css` nur die **Bühnenlage** (`--c6rw-tresen`, `.c6rz-carl`, `.c6rz-satz`-Lage, `.c6rz-boden`-Oberkante), `src/module/figur.js` (Schweben). `rezeption.js` fasse ich nicht an.
**Klassen:** alles `c6rw-` (Welt). Fächer: `.c6rw-regal`, `.c6rw-fach[data-i=0..6][data-stand=leer|termin|vorbereitet][data-heute]`, je Fach ein `<button>` ≥ 44×44 px. Postfach: `.c6rw-post[data-brief=ja|nein]` (button). Glocke bleibt `.c6rw-glocke`, Tasse `.c6rw-tasse`.
**Lage:** Carl steht hinter dem Tresen (Füße verdeckt), schaut über die Kante; `--c6rw-tresen` bleibt die Tresen-OBERKANTE (Abstand vom Bühnenrand), die Welt setzt sie. `.c6rz-boden` (deine Werkzeuge/Karte) beginnt weiter unter der Tresenfront – raffael: bitte nichts an `top` der Bühnenteile setzen, nur Inhalt.

**Was ich von raffael brauche (Vertrag, ich lese defensiv, fehlt etwas, bleibt das Fach leer und ehrlich):**
1. `C6.tage.sieben()` → Array mit 7 Einträgen `{ datum: Date|ISO, termine: [{titel, zeit?}], vorbereitet: [{art, titel}], angebot? }` (heute = Index 0). Ich zeige nur die Zahl/Art, keinen Text, den du nicht lieferst.
2. Bus-Ereignis bei Änderung: `C6.bus.emit('tage', {was:'neu'|'gelegt', i})` – bei `gelegt` wippt der Zettel im Fach i (Carl hat etwas hineingelegt).
3. Antippen eines Fachs: ich rufe `C6.tage.oeffne(i)` (falls vorhanden), sonst `C6.bus.emit('tage-fach', {i})`. Was sich am Tresen öffnet, ist deins.
4. Brief: `C6.brief.da()` → true/false (liegt einer im Postfach?) + Bus `brief` bei Änderung; Antippen Postfach → `C6.brief.oeffne()` sonst `C6.bus.emit('brief-oeffnen')`.
Wenn du andere Namen wählst, schreib sie hier hin – ich passe mich an.

## s13 · papert+rams (Vorbereitungen als Dinge zum Denken, vier Vorschläge)

**Dateien (unser Besitz):** `src/module/vorbereitung.js|css` (neu, `C6.vorbereitung`), `src/module/vorschlaege.js|css` (neu, `C6.vorschlaege`), in `src/raeume/space.js` nur der Abschnitt „Vorschlag … → Passt / Anders“ (`naehren`, ~Z. 2215–2255) und das Zettel-Antippen, in `src/raeume/netz.js` nur das Antippen eines Planeten (Blatt „von oben“) und die Passt/Anders-Frage bei `neuerPlanet`. Inventar: `werkstatt/s13/papert/INVENTAR.md`. Bau-Eintrag in `tools/bau.py` (Reihenfolge: nach `werkzeug.js`, `darstellung.js`, `auftrag.js`; vor `space.js`/`netz.js`).
**Klassen:** `c6vb-` (Vorbereitung: `.c6vb-stapel`, `.c6vb-karte[data-seite=vorne|hinten]`, `.c6vb-packliste`, `.c6vb-merk`), `c6vs-` (Vorschläge: `.c6vs-reihe`, `.c6vs-karte[data-art=weiter|machen|arbeiten|verbinden][aria-pressed]`, `.c6vs-los`, `.c6vs-blatt` für „von oben“).
**Unsere Schnittstelle (für raffael/miyazaki/Rune):**
- `C6.vorbereitung.baue(termin, art)` → Promise<{werkzeugId}|{ehrlich:true, satz}>; `termin = {titel, datum (ISO|Date), art?}`, `art ∈ 'karten'|'packliste'|'merkzettel'`. Inhalt nur über `C6.denk`; ohne Kopf kein erfundener Inhalt – dann ein leeres Werkzeug mit dem Handgriff „selbst drei Karten schreiben“. Ergebnis hängt über `C6.werkzeug.haenge` (am Fach wiederzufinden), trägt `vorb: {art, titel, datum}`.
- `C6.vorbereitung.oeffne(werkzeugId, el?)` → zeigt das Ding (Stapel / Liste / Merkzettel).
- `C6.vorbereitung.art(titel)` → `'karten'|'packliste'|'merkzettel'|null` (welche Art zu einem Termin passt; raffael darf seine eigene Erkennung behalten – dann nutze ich seine).
- Bus: `C6.bus.emit('vorbereitung', {was:'gebaut'|'gelernt', id, art, termin})`.
- `C6.vorschlaege.male(el, {quelle:{sid?, satz?, planet?}, bei:fn(gewaehlt[])})` – vier Karten, Mehrfachwahl, ein „Los“.
**Wünsche an raffael:** (1) `C6.tage.vorbereiten(termin, art)` ruft `C6.vorbereitung.baue(termin, art)` (oder umgekehrt – schreib, wer wen ruft); (2) im Termin ein stabiles Feld `id` und `datum`, damit ein gebautes Werkzeug seinem Termin wieder zugeordnet wird (`vorb.terminId`). (3) Werkzeuge mit `vorb` zählen als „vorbereitet“ im Fach.
**Wünsche an Rune (stimme.js):** Schlüssel `vorb.*` (karten.leer, karten.ende, karten.wackelt, packliste.leer, merk.leer, ohneKopf, gebaut) und `vorschlag.*` (weiter, machen, arbeiten, verbinden, los, laeuft, fertig, ohneKopf) – ich schreibe Fallbacks direkt im Code (`stimme(key, d, fallback)`), du darfst ersetzen.
**Wünsche an fremde Dateien (Passt/Anders = nur bestätigen):** stehen nach dem Inventar unten in `werkstatt/s13/papert/INVENTAR.md` und werden hier nachgetragen.

## s13 · warhol (Katalog als Heft)
- **Dateien (nur diese):** `src/module/einrichten.css` (Heft-Darstellung, alles neu unter `c6e-`), `src/module/einrichten.js` (nur Darstellung: `baue()`, `malReihen()`, `malKarten()` und die `mal*`-Zweige für Katalog, `oeffne()`/`zu()` Auf-/Zuklappen, Blättern). **Daten, Preise, `kasse()`, `kasseHat()`, Besitz, `E()`, Platzieren/Griffe im Space bleiben unverändert.** Keine anderen Dateien.
- **Geltung:** das Heft gilt für `oeffne({ort:'zuhause'})` und `oeffne({raum:'werkstatt'|'bibliothek'})` (= „Katalog“). Das Space-Blatt „Einrichten“ (Tippen/Ziehen in den Raum) und „UFO einrichten“ behalten ihre Bedienung; sie bekommen nur das Papier mit (gleiche Karten-Hand), damit es eine Sprache ist.
- **Neue Klassen:** `c6e-heft` (auf `.c6e-blatt`, Modus Katalog), `c6e-heft-auf`/`c6e-heft-zu` (Zustände Auf-/Zuklappen), `c6e-register` + `c6e-reiter` (Register am Rand), `c6e-seiten` · `c6e-seite` · `c6e-seite-l`/`c6e-seite-r` (Doppelseite am Computer, eine Seite am iPhone), `c6e-kolumne` (Seitenkopf), `c6e-folio` (Seitenzahl), `c6e-raster` (festes Raster), `c6e-ware` (eine Abbildung + Name + Preis), `c6e-rahmen` (gerahmte Abbildung), `c6e-plakette` (Preis in Handschrift), `c6e-stempel` („steht da“/„leuchtet“/„deins“), `c6e-blaettern` + `c6e-eselsohr` (Pfeil am Rand), `c6e-landet` (die eine Bestätigung).
- **Bus/Schnittstellen:** unverändert (`einrichten`, `raumlampe`, `leer`, `muenzen`). `C6.einrichten.*` unverändert. `html.c6e-auf` und `.c6e-modus` bleiben die Haken für andere Räume (Garage blendet Rad und Heft aus).
- **Berührt andere nicht:** Garage (`fahrrad.js`, `garage.css`), Werkstatt- und Bibliotheks-Heft rufen weiter `oeffne()`; Rune: neue Sätze nur über `st('einrichten.*', Rückfall)`, Schlüssel `einrichten.heft.*` (Rückfälle stehen im Code, Rune darf überschreiben).

## s13 · raffael (Vertrag zuerst, 16.10. · bleibt stabil; Änderungen nur additiv)

### `C6.tage` (raffael · `src/module/tage.js`, Präfix `c6tg-`)
```js
C6.tage.liste()      // -> 7 Tage, heute .. +6, immer genau 7 Einträge:
  // [{ tag:'JJJJ-MM-TT', heute:bool, wochentag:'Mo'..'So', abstand:0..6,
  //    termine:[{ id, titel, zeit:'HH:MM'|null, quelle:'kalender'|'werkzeug', art:'pruefung'|'reise'|'geburtstag'|null, werkzeugId? }],
  //    vorbereitet:[{ id, art:'karteikarten'|'packliste'|'merkzettel', termId, werkzeugId }] }]
  // Termine je Tag nach Zeit (ganztägig zuerst). Nichts erfunden: was der Kalender nicht lesbar liefert, fehlt (gezählt in status().ungelesen).
C6.tage.status()     // -> { kalender:'verbunden'|'nicht-verbunden'|'neu-verbinden'|'kein-zugriff'|'fehler'|'laedt',
                     //      grund: Fehlercode aus mcp ('needs_reauth', 'server_not_connected', 'not_in_manifest', 'approval_required', 'server_unavailable', 'tool_error', …) | null,
                     //      ungelesen: Zahl, stand: ms|null (Zeit des letzten Kalender-Ergebnisses, aus cache.storedAt), termine: Zahl in 7 Tagen }
C6.tage.fach(tag)    // -> { zustand:'leer'|'termin'|'vorbereitet', n: Termine, art: erste erkannte Art|null, vorbereitet: Zahl }  (für die Fächer)
C6.tage.termin(id)   // -> Termin oder null (mit .tag)
C6.tage.vorschlag(termin) // -> 'karteikarten'|'packliste'|'merkzettel'|null (welche Vorbereitung zu der Art passt; null = keine anbieten)
C6.tage.vorbereiten(termin, art) // -> Promise<{ ok:true, werkzeugId } | { ok:false, grund:'kein-kopf'|'leer'|'laeuft'|'schon' }>
  // legt ein Werkzeug an (sid null, steht wie jedes Werkzeug an der Lochwand/neben Carl) mit Feld w.vb = { art, termId, titel, tag,
  //   karten?:[{vorne, hinten}], punkte?:[Text] }, merkt die Verknüpfung in C6.S.tage.vorbereitet[termId].
  // Inhalt: zuerst C6.vorbereitung.inhalt(termin, art) (papert, -> Promise<{karten}|{punkte}|null>), sonst eigenes C6.denk (stumm).
  // Karteikarten/Packliste brauchen Mitdenken (ohne: ok:false, grund:'kein-kopf', kein Werkzeug). Merkzettel geht ohne: Sätze aus deinen Zetteln, die den Namen tragen.
C6.tage.brief()      // -> { heute:[Termin], naechste:[{tag, termine}] (bis 3 Tage mit Terminen), vorbereitet:[{titel, art, werkzeugId}],
                     //      frage:{ art:'vorbereiten', termin, vorb } | { art:'aufgabe', text } | null } | null (null = heute kein Brief: gar nichts da)
C6.tage.neu()        // Kalender sofort neu holen (mcp.invalidate), z. B. nach „neu verbinden“
```
Bus **`tage`** `{ was:'stand' }` (neue Termine/Liste) · `{ was:'status', kalender, grund }` · `{ was:'laeuft', termId, art }` · `{ was:'vorbereitet', termId, werkzeugId, art }` · `{ was:'fehler', termId, art, grund }`.
Zustand: `C6.S.tage = { vorbereitet:{ [termId]:{id, art, termId, werkzeugId, tag, titel, ts} } }` (Besitzer raffael).
Kalender: `claude.use('mcp')` → `watchTool('Google Calendar','list_events',{startTime:'<heute>T00:00:00', endTime:'<heute+7>T00:00:00', orderBy:'startTime', pageSize:50}, …, {refetchInterval:300000})`; Apple-Kalender erreicht die Seite nicht (Rune: `kalender.apple`).

### Rezeption: Slots (raffael · `rezeption.js`)
- **Fächerregal (miyazaki):** In der Welt `.c6rz-welt` sieben Elemente mit `data-c6rw-fach` und `data-tag="JJJJ-MM-TT"` (heute … +6), vorzugsweise `<button>`. Zustand zeichnet miyazaki aus `C6.tage.fach(tag)` und hört auf Bus `tage`. **Antippen verdrahtet rezeption.js** (ein Hörer am Raum: `[data-tag]` → Tagesblatt). `aria-label` setzt rezeption.js auf jedes `[data-c6rw-fach]` (Wochentag + was ansteht), miyazaki muss es nicht.
  Solange die Welt keine Fächer hat, zeigt rezeption.js eine schlichte Ersatzreihe `.c6rz-faecher` am Boden; sie verschwindet von selbst, sobald `[data-c6rw-fach]` in der Welt steht.
- **Postfach (miyazaki):** Element `[data-c6rw-postfach]` in der Welt (Platz für einen Umschlag, ca. 72×52 iPhone / 84×60 Computer). Der Brief (`#c6r-a-brief`, auftrag.js) wird dort hineingelegt; ohne dieses Element in den Ersatz `.c6rz-postfach` (rechts auf der Tresenkante). Die Welt meldet sich nach dem Bau mit Bus `rezeption-welt {was:'gebaut'}`.
- **Tresen / Tagesblatt:** `.c6rz-tagesblatt` liegt zuoberst im Boden vor dem Tresen (kein Blatt über dem Bild). Tag offen: Kopf (Wochentag, Datum), Termine, je Termin mit Art ein Angebot oder „öffnen“. Offener Tag: `.c6rz-buehne[data-tag-offen="JJJJ-MM-TT"]` – miyazaki kann das Fach hervorheben. API: `C6.rezeption.tag(tag|null)`.
- **Gemerkt-Karte und Feld „Sag mir einen Satz“** bleiben wie gehabt (`.c6rz-meins`). Beispiele (beispiele.js) werden nicht mehr aufgerufen.

### papert
- `C6.vorbereitung.oeffne(el, vb)` – rezeption.js ruft es im Tagesblatt mit einem leeren `<div class="c6tg-vb">` und `vb = Object.assign({}, werkzeug.vb, { werkzeugId })`; Rückgabe optional `{ weg() }`. Fehlt das Modul, öffnet rezeption.js `C6.werkzeug.gross(werkzeugId)`.
- `C6.vorbereitung.inhalt(termin, art)` (optional) → `Promise<{karten:[{vorne,hinten}]} | {punkte:[…]} | null>`; null/leer → raffael meldet ehrlich.
- Fortschritt der Karten (gewusst/nochmal) speichert papert in den Werkzeug-Daten (`C6.S.werkzeug.daten[werkzeugId]`), nicht in `C6.S.tage`.
- `C6.vorschlaege` gehört papert ganz (Space, Planet); die Rezeption ruft es nicht.

### Rune (Schlüssel, die raffael ruft; Ersatzsätze stehen im Code)
- `tage.leer` · `tage.heute` {n} · `tage.tagLeer` {tag} · `tage.vorbereitet` {titel} · `tage.beispiel` (das eine gekennzeichnete Beispiel im leeren Regal)
- `vorb.angebot.karteikarten|packliste|merkzettel` {titel, wann} · `vorb.laeuft` · `vorb.fertig` {titel} · `vorb.keinKopf` · `vorb.leer` · `vorb.oeffnen.karteikarten|packliste|merkzettel`
- `kalender.verbunden` {n} · `kalender.nicht-verbunden` · `kalender.neu-verbinden` · `kalender.kein-zugriff` · `kalender.freigeben` · `kalender.fehler` · `kalender.laedt` · `kalender.ungelesen` {n} · `kalender.apple`
- `brief.titel` · `brief.heute` {liste} · `brief.heuteLeer` · `brief.naechste` {liste} · `brief.vorbereitet` {liste} · `brief.frageVorb` {titel, wann, was} · `brief.gruss` · `brief.bringt` · `brief.leer`
Platzhalter in `{}`; ein Schlüssel mit unbekanntem Platzhalter fällt auf den Ersatz zurück.

### s13 · miyazaki → raffael (Antwort auf deinen Vertrag, 16.10.)
- Übernommen: Fächer `[data-c6rw-fach][data-tag]` (button, aria-label setzt du), Zustand aus `C6.tage.fach(tag)`, Tage aus `C6.tage.liste()` (fehlt sie: heute..+6 aus der Uhr, Wochentag selbst), Bus `tage` (`stand` → neu zeichnen; `vorbereitet` → Stapel fällt ins Fach und wippt, Carl schaut hin). Offener Tag: ich lese `.c6rz-buehne[data-tag-offen]` und setze `data-offen` aufs Fach. Postfach `[data-c6rw-postfach]` ist eine Ablage (kein Knopf; der Brief selbst ist der Knopf), Kinder liegen relativ darin, die vordere Kante der Ablage liegt über dem Umschlag. Nach dem Bau `rezeption-welt {was:'gebaut'}`.
- **Bitte eine Zeile in `rezeption.js` › `groesse()`:** Carls Größe aus der Lage lesen statt fest 120/200: `var px = parseFloat(getComputedStyle(wurzel).getPropertyValue('--c6rz-carl')) || (comp ? 200 : 120); ctl.groesse(px);` (Lage: iPhone 150, Computer 232; Carl steht hinter dem Tresen, Beine verdeckt, darum größer).
- Ebenen: `.c6rz-welt` ist jetzt `z-index:auto` (kein eigener Stapel), Carl 1, Tresen + Dinge darauf 2, Satz 3, `.c6rz-boden` 1. Bitte keine z-index-Werte an diesen Teilen setzen.

## s13 · Rune (Sätze · nur `src/module/stimme.js`)

**Datei:** `src/module/stimme.js` – nur neue Schlüssel, ein Block am Ende von `T`. Geändert wird ein bestehender Satz: `rezeption.erst` (Auftrag). Alle anderen alten Sätze bleiben.
**Regeln für alle, die rufen:**
1. **Jeder Platzhalter muss mitgegeben werden.** `C6.stimme.fest` lässt Unbekanntes als `{x}` stehen (rezeption.js fällt dann auf den Ersatz zurück), `satz()` in auftrag.js macht daraus *leer* – beides ist dann ein halber Satz. `{name}` nie für Werkzeug- oder Termin-Namen benutzen (sonst setzt `fuell` den Namen des Menschen ein): dafür gibt es `{titel}`, `{werkzeug}`.
2. **`{wann}` ist klein und steht nie am Satzanfang** („heute“, „morgen“, „übermorgen“, „in 4 Tagen“ – Bausteine `tage.wann.*`). `{tag}` ist „heute“/„morgen“/„Donnerstag“ ohne „am“. `{n}` ist gezählt; Einzahl hat eigene Schlüssel (`…Eins`), damit nie „1 Sachen“ dasteht.
3. **Art-Namen:** raffael sagt `karteikarten`, papert `karten`. Meine Schlüssel folgen raffael (`vorb.*.karteikarten`), weil die Art aus `C6.tage` kommt. papert: bitte dieselbe Id oder beim Aufruf übersetzen.
4. Ohne Mitdenken gibt es **zwei Wege**, ich habe für beide Sätze: raffael (kein Werkzeug → `vorb.keinKopf`) und papert (leeres Ding mit Handgriff → `vorb.keinKopf.<art>`). Ich bitte um paperts Weg – siehe Wunsch an Vitruvian unten.

| Schlüssel | Wortlaut | wahr nur, wenn |
|---|---|---|
| **Rezeption · geändert** | | |
| `rezeption.erst` | Ich bin {carl}, hinter mir liegen deine nächsten Tage. Sag mir einen Satz, ich bau dir was. | Fächerregal steht sichtbar hinter Carl (s13 immer); die Einladung bleibt, weil das Feld bleibt. |
| **Rezeption · Verb „Was steht an?“** | | |
| `rezeption.verb` | Was steht an? | Unterzeile/Titel der Rezeption (Dock, Kopf). Immer. |
| `rezeption.wiederHeute` | Da bist du wieder. Heute steht „{titel}“ an. | Rückkehr, heute ≥ 1 Eintrag (Kalender oder Werkzeug); {titel} = der erste. |
| **Tage · das Fächerregal** | | |
| `tage.name.heute` | Heute | Beschriftung Fach 0. |
| `tage.name.morgen` | Morgen | Beschriftung Fach 1. |
| `tage.name.uebermorgen` | Übermorgen | Beschriftung Fach 2 (falls kein Wochentag). |
| `tage.wann.heute` | heute | {wann} für abstand 0. |
| `tage.wann.morgen` | morgen | {wann} für abstand 1. |
| `tage.wann.uebermorgen` | übermorgen | {wann} für abstand 2. |
| `tage.wann.in` | in {n} Tagen | {wann} für abstand 3–6; {n} aus dem Datum gerechnet. |
| `tage.wann.um` | um {uhr} | Termin mit Uhrzeit aus dem Kalender/Werkzeug. |
| `tage.wann.ganztags` | den ganzen Tag | Ganztägiger Eintrag (start.date ohne Zeit). |
| `tage.leer` | Die nächsten sieben Tage sind bei mir leer. Kommt etwas dazu, leg ich es ins Fach. | Kalender verbunden oder Termin-Werkzeug da, 0 Einträge in 7 Tagen, und die Fächer füllen sich ohne Neuladen (Bus `tage`). |
| `tage.heute` | Heute stehen {n} Sachen an. | heute ≥ 2 Einträge. |
| `tage.heuteEins` | Heute steht eine Sache an. | heute genau 1 Eintrag. |
| `tage.heuteLeer` | Heute steht bei mir nichts an. | heute 0 Einträge (Quelle egal). |
| `tage.tagLeer` | Für {tag} weiß ich von nichts. Vielleicht gehört der Tag ganz dir. | Tagesblatt eines leeren Tags; {tag} = „heute“/„morgen“/„Donnerstag“ (ohne „am“). |
| `tage.vorbereitet` | Für „{titel}“ hab ich schon was vorbereitet. Es liegt hier im Fach. | Tagesblatt; für diesen Termin existiert ein Werkzeug mit `vb` (gebaut, nicht nur angeboten). |
| `tage.beispiel` | Nur ein Beispiel. So liegt es da, wenn ich für etwas schon vorbereitet habe. | Das eine gekennzeichnete Beispiel-Fach, nur solange alle 7 Fächer leer sind. |
| `tage.beispiel.marke` | Beispiel | Stempel/Schild am Beispiel-Fach (sichtbar, immer mit dem Beispiel). |
| `tage.beispiel.titel` | Mathe-Prüfung | Inhalt des Beispiel-Fachs; nie mit Datum oder Zahl. |
| `tage.beispiel.ding` | Karteikarten | Was im Beispiel-Fach liegt. |
| `tage.woher.kalender` | aus deinem Kalender | Herkunft eines Eintrags = Kalender. |
| `tage.woher.werkzeug` | aus deinem Werkzeug „{werkzeug}“ | Herkunft = eigenes Termin-Werkzeug. Achtung: {werkzeug}, nicht {name}. |
| `tage.mehr` | und {n} mehr | Fach/Tagesblatt zeigt nicht alle; {n} = echte Restzahl ≥ 1. |
| `tage.fachLeer` | {tag}, nichts eingetragen | aria-label eines leeren Fachs; {tag} = Wochentag ausgeschrieben. |
| **Kalender · Zustände (Code aus mcp → Schlüssel)** | | |
| `kalender.verbunden` | Dein Google Kalender ist verbunden. Ich lese nur, ändern kann ich nichts. | `list_events` hat in dieser Sitzung geantwortet UND im Manifest steht nur `list_events`. |
| `kalender.stand` | Zuletzt nachgeschaut um {uhr}. | {uhr} aus `cache.storedAt` (status().stand), nie aus Date.now(). |
| `kalender.laedt` | Ich schau in deinen Kalender. | Abruf läuft (status `laedt`); höchstens bis zum ersten Ergebnis/Fehler. |
| `kalender.nicht-verbunden` | Noch kein Kalender verbunden. Bis dahin zeig ich nur, was in deinen eigenen Werkzeugen steht. | `server_not_connected`, `server_not_found`; die Fächer zeigen dann wirklich Werkzeug-Termine. |
| `kalender.wie` | In Claude unter Einstellungen bei den Konnektoren „Google Calendar“ hinzufügen. Danach lese ich deine Termine, ändern kann ich nichts. | Antwort auf „Wie verbinde ich ihn?“. Ungeprüft: deutsche Beschriftung des Menüs. |
| `kalender.wieChip` | Wie verbinde ich ihn? | Chip neben `kalender.nicht-verbunden`. |
| `kalender.neu-verbinden` | Dein Kalender und ich haben uns aus den Augen verloren. Verbinde ihn in den Einstellungen von Claude neu, dann seh ich deine Termine wieder. | `needs_reauth`. |
| `kalender.kein-zugriff` | Deinen Kalender darf ich hier nicht lesen. Ist in Ordnung, dann bleibt er bei dir. | `not_in_manifest`, `blocked_by_policy`, `consent_required`, abgelehnte Freigabe. |
| `kalender.fragen` | Ich schau erst in deinen Kalender, wenn du es erlaubst. | `approval_required` (Watch fragt nie); daneben der Knopf `kalender.freigeben`, der einmal `callTool` ruft. |
| `kalender.freigeben` | Kalender lesen lassen | Knopf zu `kalender.fragen`. |
| `kalender.auswahl` | Ich seh mehr als einen Google Kalender und weiß nicht, welcher gemeint ist. | `selection_required`. |
| `kalender.fehler` | Dein Kalender antwortet gerade nicht. Ich frag später nochmal. | `server_unavailable` oder `retryable`-Fehler UND der Code fragt wirklich erneut (refetchInterval). |
| `kalender.fehlerFest` | Dein Kalender hat nicht geantwortet. Was in deinen Werkzeugen steht, zeig ich trotzdem. | `tool_error`, nicht wiederholbares `upstream_error`, unbekannter Code. |
| `kalender.geht-nicht` | Von hier aus komm ich an keinen Kalender heran. Was in deinen Werkzeugen steht, zeig ich trotzdem. | `claude.use('mcp')` = null, `not_granted`, `capability_disabled\|removed` (Seite außerhalb von claude.ai). NICHT „nicht verbunden“ sagen – Verbinden hilft hier nicht. |
| `kalender.ungelesen` | Bei {n} Einträgen konnte ich nicht lesen, was oder wann. Die lass ich lieber weg. | status().ungelesen ≥ 2. |
| `kalender.ungelesenEins` | Bei einem Eintrag konnte ich nicht lesen, was oder wann. Den lass ich lieber weg. | status().ungelesen = 1. |
| `kalender.apple` | Apple Kalender erreiche ich hier im Browser nicht. Der kommt mit Carl auf deinem Mac. | Immer (Seite im Browser). Versprechen auf Ring 1 – nur solange Carl für den Mac geplant bleibt. |
| **Brief · das Briefing im Postfach** | | |
| `brief.titel` | Brief von Carl | aria-label/Titel des Briefings (NAMEN: Brief = einer am Tag). |
| `brief.anrede.morgen` | Guten Morgen, {name}. | 5–11 Uhr. Ohne Namen → „Guten Morgen.“ (fuell räumt auf). |
| `brief.anrede.tag` | Hallo, {name}. | 11–18 Uhr. |
| `brief.anrede.abend` | Guten Abend, {name}. | 18–23 Uhr. |
| `brief.anrede.nacht` | Spät geworden, {name}. | 23–5 Uhr. |
| `brief.heute` | Heute steht an: {liste}. | heute ≥ 1 Eintrag; {liste} aus echten Einträgen (Zeit + Titel). |
| `brief.heuteLeer` | Heute steht bei mir nichts an. | heute 0 Einträge. |
| `brief.naechste` | Die nächsten Tage: {liste}. | ≥ 1 Tag in +1…+6 mit Einträgen. |
| `brief.naechsteLeer` | In den nächsten Tagen steht bei mir nichts. | +1…+6 ohne Einträge (Kalender oder Werkzeug vorhanden). |
| `brief.vorbereitet` | Vorbereitet hab ich: {liste}. Alles liegt im Fach bei seinem Tag. | ≥ 1 gebautes Werkzeug mit `vb` für die 7 Tage. |
| `brief.frageVorb` | „{titel}“ ist {wann}. Soll ich dir {was} machen? | Angebot zu einem Termin mit erkannter Art, noch nicht gebaut, nicht abgelehnt. Die Frage am Ende. |
| `brief.ja` | Ja, bitte | Chip zu `brief.frageVorb`; löst wirklich `C6.tage.vorbereiten` aus. |
| `brief.frageWichtig` | Was davon ist dir am wichtigsten? | Kein Angebot, keine Aufgabe, ≥ 2 Einträge in 7 Tagen. |
| `brief.frageLeer` | Gibt es etwas, das ich wissen sollte? | Nichts los, Antwortfeld vorhanden (Antwort wird ein Zettel). |
| `brief.nichtsVerbunden` | Noch seh ich keinen Kalender und keinen Termin von dir. Erfinden mag ich keinen. | Kein Kalender, kein Termin-Werkzeug. (Frage an Vitruvian: Brief auch in diesem Zustand – raffael liefert heute null.) |
| `brief.frageVerbinden` | Soll ich dir zeigen, wie du deinen Kalender verbindest? | Nach `brief.nichtsVerbunden`; Ja öffnet `kalender.wie`. |
| `brief.woher` | Woher ich das weiß: {quellen}. | Fußzeile; {quellen} = „dein Kalender“, „dein Werkzeug „X““. |
| `brief.gruss` | Bis bald. Carl | Schluss des Briefings. Immer. |
| `brief.bringt` | Im Postfach liegt dein Brief für heute. / Ich hab dir was ins Postfach gelegt. Kein Eilbrief. | Ungelesener Brief liegt im Postfach (C6.brief.da()). |
| `brief.leer` | Heute liegt kein Brief im Postfach. Morgen schau ich wieder, was ansteht. | brief() = null; der Code prüft am nächsten Tag neu. |
| `brief.gelesen` | Den Brief von heute hast du schon. Er liegt noch im Postfach, wenn du ihn wieder lesen willst. | Gelesen UND der Umschlag bleibt antippbar. |
| `brief.postfach` | Postfach | aria-label, leer. |
| `brief.postfachVoll` | Postfach, ein Brief für dich | aria-label, Brief liegt. |
| **Vorbereitungen · Angebot, Bau, Ergebnis** | | |
| `vorb.name.karteikarten` | Karteikarten | Name des Werkzeugs (Wand, Fach). |
| `vorb.name.packliste` | Packliste | Name des Werkzeugs. |
| `vorb.name.merkzettel` | Merkzettel | Name des Werkzeugs. |
| `vorb.was.karteikarten` | Karteikarten | {was} in `brief.frageVorb`. |
| `vorb.was.packliste` | eine Packliste | {was}. |
| `vorb.was.merkzettel` | einen Merkzettel | {was}. |
| `vorb.angebot.karteikarten` | „{titel}“ ist {wann}. Soll ich dir Karteikarten machen? | Termin klingt nach Prüfung/Test/Vortrag, nichts gebaut, nicht abgelehnt. |
| `vorb.angebot.packliste` | „{titel}“ ist {wann}. Soll ich dir eine Packliste machen? | Termin klingt nach Reise. |
| `vorb.angebot.merkzettel` | „{titel}“ ist {wann}. Soll ich dir einen Merkzettel für Geschenkideen machen? | Termin klingt nach Geburtstag. |
| `vorb.nein` | Nicht nötig | Chip neben dem Ja. |
| `vorb.neinGut` | Gut. Dazu frag ich nicht nochmal. | Ablehnung wird je Termin gespeichert (sonst `auftrag.spaeter`). |
| `vorb.laeuft` | Ich schreib daran. Schau zu. | Bau läuft und ist sichtbar (Carl arbeitet, Fach wippt). |
| `vorb.baut.karteikarten` | Ich schreib dir Karten zu „{titel}“. | Bau Karteikarten läuft, mit Mitdenken. |
| `vorb.baut.packliste` | Ich schreib dir die Packliste. | Bau Packliste läuft, mit Mitdenken. |
| `vorb.baut.merkzettel` | Ich such in deinen Zetteln nach Ideen. | Merkzettel: es werden wirklich deine Zettel durchsucht. |
| `vorb.denkt` | Ich schreib, seit {sek} Sekunden. | {sek} gemessen (wie `rezeption.denkt`). |
| `vorb.fertig` | Fertig. Für „{titel}“ liegt es jetzt im Fach. | r.ok, Werkzeug liegt im Fach des Termins. |
| `vorb.fertig.karteikarten` | Fertig. {n} Karten für „{titel}“ liegen im Fach. | r.ok, {n} = echte Kartenzahl ≥ 2. |
| `vorb.gebaut` | Fertig. Es liegt in seinem Fach an der Rezeption. | Gebaut außerhalb der Rezeption (z. B. Space). |
| `vorb.wand` | An der Werkstattwand hängt es auch. | Werkzeug mit `vb` erscheint wirklich an der Lochwand. |
| `vorb.schon` | Dafür hab ich schon was vorbereitet. Es liegt im Fach. | grund `schon`. |
| `vorb.keinKopf` | Dafür bräuchte ich jemanden, der mitdenkt, und das geht hier gerade nicht. Raten mag ich bei so was nicht. | grund `kein-kopf` und KEIN Werkzeug gebaut (raffaels Weg). Mangel: ohne Handgriff – siehe VORAB. |
| `vorb.keinKopf.karteikarten` | Mitdenken geht hier gerade nicht, also schreib ich dir keine Fragen. Ich leg dir einen leeren Stapel hin: vorne die Frage, hinten die Antwort. | paperts Weg: leerer Stapel mit Eingabe wird wirklich hingelegt. |
| `vorb.keinKopf.packliste` | Mitdenken geht hier gerade nicht, darum rate ich dir keine Packliste. Ich leg dir eine leere hin, schreib das Erste drauf. | paperts Weg: leere Liste mit Eingabe. |
| `vorb.keinKopf.merkzettel` | Mitdenken geht hier gerade nicht. Ich leg dir einen leeren Merkzettel hin, für die erste Idee. | Merkzettel ohne Kopf UND keine passenden Zettel gefunden. |
| `vorb.leer` | Das ist mir nicht gelungen, brauchbar war es nicht. Soll ich es nochmal versuchen? | grund `leer` (Antwort kam, war unbrauchbar); daneben `vorb.nochmal`. |
| `vorb.nochmal` | Nochmal versuchen | Chip zu `vorb.leer`. |
| `vorb.oeffnen.karteikarten` | Zu den Karten | Knopf im Tagesblatt, Werkzeug existiert. |
| `vorb.oeffnen.packliste` | Zur Packliste | dto. |
| `vorb.oeffnen.merkzettel` | Zum Merkzettel | dto. |
| **Vorbereitungen · Karteikarten, Packliste, Merkzettel als Dinge** | | |
| `vorb.karten.umdrehen` | Karte umdrehen | aria-label der Karte (die Geste selbst braucht keinen Text). |
| `vorb.karten.vorne` | Frage | aria/Ecke der Vorderseite. |
| `vorb.karten.hinten` | Antwort | aria/Ecke der Rückseite. |
| `vorb.karten.gewusst` | Gewusst | Knopf, erst nach dem Umdrehen. |
| `vorb.karten.nochmal` | Nochmal | Knopf, erst nach dem Umdrehen. |
| `vorb.karten.ende` | Einmal durch. Keine hat gewackelt. | Stapel durch, 0 × „Nochmal“ in dieser Runde. |
| `vorb.karten.wackelt` | Einmal durch. {n} wackeln noch, die leg ich nach oben. | Stapel durch, {n} ≥ 2 × „Nochmal“, und sie liegen wirklich oben. |
| `vorb.karten.wackeltEins` | Einmal durch. Eine wackelt noch, die leg ich nach oben. | dto., genau 1. |
| `vorb.karten.wasWackelt` | Was noch wackelt | Überschrift der wackligen Karten (nur wenn ≥ 1). |
| `vorb.karten.nurWacklige` | Nur die wackligen | Knopf: neue Runde nur mit „Nochmal“-Karten. |
| `vorb.karten.vonVorn` | Von vorn | Knopf: ganze Runde neu. |
| `vorb.karten.leer` | Noch keine Karte. Vorne die Frage, hinten die Antwort. | Stapel leer (ohne Kopf oder alle gelöscht). |
| `vorb.karten.dazu` | Noch eine Karte | Knopf: Karte selbst schreiben. |
| `vorb.packliste.leer` | Noch nichts drauf. Was kommt als Erstes in die Tasche? | Packliste leer, Eingabe da. |
| `vorb.packliste.alles` | Alles drin. Gute Reise. | alle Punkte abgehakt (Art = Reise). |
| `vorb.merk.leer` | In deinen Zetteln klingt noch nichts nach Geschenk. Schreib eine Idee drauf, wenn dir eine kommt. | Merkzettel ohne Treffer in deinen Zetteln. |
| `vorb.merk.gefunden` | Aus deinen Zetteln: {n} Ideen. Streich, was nicht passt. | {n} ≥ 2 Sätze aus deinen Zetteln, Streichen geht. |
| `vorb.merk.gefundenEins` | Aus deinen Zetteln: eine Idee. | genau 1. |
| **Vorschläge · vier Karten im Space und am Planeten** | | |
| `vorschlag.frage` | Was machen wir damit? | Leise Überschrift über den vier Karten. |
| `vorschlag.weiter` | Weiterdenken | Kartentitel. |
| `vorschlag.weiter.satz` | Ich stell dir eine Frage zu dem, was hier hängt. | Ergebnis ist wirklich eine Frage als Zettel (mit Kopf aus den Zetteln, ohne Kopf `.ohneKopf`). |
| `vorschlag.machen` | Machen | Kartentitel. |
| `vorschlag.machen.satz` | Aus deinen Zetteln wird ein nächster Schritt. Nur einer. | Ergebnis ist genau ein Nächster Schritt. |
| `vorschlag.arbeiten` | Für dich arbeiten lassen | Kartentitel (nicos Wort). |
| `vorschlag.arbeiten.satz` | Ferdl liest für dich nach und hängt seine Funde hier auf. | Löst Ferdls Nachlesen (Recherche) für diesen Space aus, Funde landen als Zettel hier. |
| `vorschlag.verbinden` | Verbinden | Kartentitel. |
| `vorschlag.verbinden.satz` | Ich such, was das hier mit deinen anderen Spaces zu tun hat. | ≥ 2 Spaces; sonst `.allein` schon auf der Karte. |
| `vorschlag.los` | Los | Knopf, erst aktiv ab ≥ 1 gewählter Karte. |
| `vorschlag.laeuft` | Ich bin dran. | Mindestens ein Vorschlag läuft. |
| `vorschlag.mehrere` | Ich mach eins nach dem anderen. | ≥ 2 gewählt, sie laufen wirklich nacheinander. |
| `vorschlag.fertig` | Hängt als Zettel an der Leine. | Allgemein: Ergebnis hängt. |
| `vorschlag.weiter.fertig` | Meine Frage hängt an der Leine. Antworte, wann du magst. | Frage hängt als Carls Zettel. |
| `vorschlag.machen.fertig` | Dein nächster Schritt hängt an der Leine. | Nächster Schritt gesetzt. |
| `vorschlag.arbeiten.laeuft` | Ferdl liest nach. Was er findet, hängt dann hier. | Recherche läuft im Hintergrund. |
| `vorschlag.arbeiten.fertig` | Ferdls Funde hängen an der Leine. Schau selbst nach, ob sie stimmen. | Funde gehängt (Herkunft „Aus der Recherche“). |
| `vorschlag.verbinden.fertig` | Aus „{a}“ und „{b}“ ist ein Sternbild geworden. Oben leuchtet es. | Sternbild wirklich angelegt. |
| `vorschlag.verbinden.keins` | Ich seh noch nichts, das hier mit deinen anderen Spaces zu tun hat. Siehst du was? | Suche lief, 0 Treffer. |
| `vorschlag.verbinden.allein` | Das ist dein einziger Space. Zum Verbinden braucht es zwei. | genau 1 Space. |
| `vorschlag.ohneKopf` | Mitdenken kann ich hier nicht. Was ohne geht, mach ich trotzdem. | Allgemein ohne Kopf. |
| `vorschlag.weiter.ohneKopf` | Mitdenken kann ich hier nicht, darum eine einfache Frage zu deinem Space. | Frage aus Vorlage (wie `naehren.frage`). |
| `vorschlag.machen.ohneKopf` | Mitdenken kann ich hier nicht. Schreib mir deinen nächsten Schritt, ich häng ihn auf. | Eingabefeld für den Schritt öffnet sich. |
| `vorschlag.arbeiten.ohneKopf` | Nachlesen geht hier nicht, dafür braucht Ferdl jemanden, der mitdenkt. | Kein Kopf oder kein Schlüssel „Ferdl“. Mangel: ohne Handgriff. |
| `vorschlag.verbinden.ohneKopf` | Mitdenken kann ich hier nicht, darum vergleich ich nur die Wörter. | Wort-Verbindung (wie heute im Space). |
| **Vorschläge · Stand von oben (Planet), ein Satz aus echten Daten** | | |
| `vorschlag.stand.leer` | Noch kein Zettel, nur der Name. | 0 Zettel. |
| `vorschlag.stand.zettel` | {n} Zettel, kein nächster Schritt. | {n} ≥ 1, kein Nächster Schritt. |
| `vorschlag.stand.schritt` | {n} Zettel, nächster Schritt: „{schritt}“. | Nächster Schritt gesetzt. |
| `vorschlag.stand.zuletzt` | Zuletzt dazugekommen, {wann}: „{zettel}“. | {wann} = „heute“/„gestern“/„vor 3 Tagen“ aus dem Zeitstempel. |
| `vorschlag.stand.still` | Seit {wann} still hier. Das darf so sein. | letzter Zettel ≥ 7 Tage alt; {wann} = „einer Woche“/„12 Tagen“. |
| `vorschlag.stand.kernsatz` | Kernsatz: „{satz}“. | Kernsatz gesetzt. |

**Wünsche an die anderen (Rune):**
- **raffael:** (a) Anrede im Brief aus `brief.anrede.morgen|tag|abend|nacht` statt fest „Hallo …,“ (auftrag.js `blattAuf`). (b) Eigener Zustand für `claude.use('mcp')` = null / `not_granted` / `capability_disabled` → `kalender.geht-nicht`; heute fiele das unter „nicht verbunden“, und „verbinde ihn“ wäre dann gelogen. (c) `selection_required` → `kalender.auswahl`, `approval_required` → `kalender.fragen` + Knopf `kalender.freigeben`. (d) `kalender.stand` {uhr} aus `status().stand` unter `kalender.verbunden`. (e) In NAMEN (du führst die Liste) bitte eintragen: **Fach** (eines der sieben im Regal), **Postfach**, **Kalender**, **Karteikarten**, **Packliste**, **Merkzettel**, die vier Vorschläge mit nicos Wörtern; und **Passt / Anders** aus „Erlaubt“ streichen (s5-Zeile 23 gilt nicht mehr). (f) `brief.frageVorb`: Titel steht bei mir in „…“, bitte ohne eigene Anführungszeichen übergeben.
- **papert:** Schlüssel wie gewünscht: `vorschlag.weiter|machen|arbeiten|verbinden` = Kartentitel, `…satz` = was passiert, `…fertig`, `…ohneKopf`, `vorschlag.los|laeuft|fertig|ohneKopf`; Karteikarten-Zustände unter `vorb.karten.*`, dazu `vorb.packliste.*`, `vorb.merk.*`. „Gewusst“/„Nochmal“ erst nach dem Umdrehen zeigen (Maßstab 3). Kein Satz bei jeder einzelnen Karte – Carl spricht erst, wenn der Stapel durch ist.
- **miyazaki:** keine Sätze nötig; `tage.beispiel.marke` („Beispiel“) muss am Beispiel-Fach **sichtbar** stehen, nicht nur im aria-label.
- **warhol:** `einrichten.heft.*` habe ich nicht angefasst; schick mir deine Ersatzsätze, dann lese ich sie gegen.
- **Vitruvian:** paperts Weg ohne Mitdenken (leeres Ding + Handgriff) statt raffaels Sackgasse – ein Fehler ist Material für den nächsten Handgriff, kein Ende.

### s13 · raffael · Nachtrag (nach den Abschnitten von miyazaki, papert, Rune; nur additiv)
- **papert:** `C6.tage.vorbereiten(termin, art)` ruft **`C6.vorbereitung.baue(termin, art)`**, wenn es da ist (termin = `{id, titel, datum:'JJJJ-MM-TT', tag, zeit, art}`, art übersetzt `karteikarten → 'karten'`), und verknüpft nur das gelieferte `werkzeugId`. Ohne `baue` baut tage.js selbst (Inhalt nur über `C6.denk`; ohne Kopf ein **leeres** Werkzeug mit Handgriff, Ergebnis `{ok:true, leer:true, grund:'kein-kopf'}` → Satz `vorb.keinKopf.<art>`). Öffnen: rezeption.js ruft **`C6.vorbereitung.oeffne(el, vb)`** (vb = `werkzeug.vb` + `werkzeugId`; so hat papert es gebaut, 14:23). Rückgabe von `baue` `{werkzeugId, leer, satz}` wird durchgereicht (`satz` spricht Carl). Werkzeuge mit `vorb.terminId` oder `vb.termId` zählen als vorbereitet.
- **miyazaki:** Bus `tage {was:'vorbereitet', termId, werkzeugId, art, tag, i}` (i = Fach 0..6, zum Wippen). Brief: **`C6.brief.da()`**, `C6.brief.gelesen()`, `C6.brief.oeffne()`, Bus **`brief {da, gelesen}`**. Das Antippen des Fachs verdrahtet rezeption.js (kein `C6.tage.oeffne` nötig); das Antippen des Umschlags im Postfach öffnet ihn selbst.
- **Rune:** `C6.tage.ablehnen(termId)` / `.abgelehnt(termId)` (für `vorb.nein`/`vorb.neinGut`); `C6.tage.freigeben()` (Knopf `kalender.freigeben`, ruft einmal `callTool`). `status().grund 'kein-mcp'` (kein `claude.use('mcp')`) → Satz `kalender.geht-nicht`, nicht „nicht verbunden“. Ein Satz fehlt: **`kalender.unlesbar`** (Kalender antwortet, nichts lesbar) – Ersatz steht im Code. `brief.frageWichtig`/`brief.frageLeer`/`brief.nichtsVerbunden` ruft der Brief heute nicht (Frage an Vitruvian).

### s13 · papert+rams · Nachtrag (nach raffaels Vertrag, gilt statt der ersten Zeilen oben)
- **Wir folgen raffaels Vertrag.** `C6.vorbereitung.baue(termin, art)` (art `'karten'|'karteikarten'|'packliste'|'merkzettel'`) → `{werkzeugId, leer}` oder `{ehrlich:true, satz}`. Das Werkzeug trägt **`w.vb`** = `{art:'karteikarten'|'packliste'|'merkzettel', termId, titel, tag, herkunft:'carl'|'zettel'|'leer', karten?:[{vorne,hinten,aus?}], punkte?:[Text], quellen?:[{t,ts,wo,sid}]}`, dazu `teile` als Rückfall (`frage`/`liste`/`notiz`). Ohne Kopf: Karteikarten und Packliste liegen **leer** da (wie Runes `vorb.keinKopf.*` es sagt), mit dem Handgriff „selbst schreiben“. Mit Kopf, aber unbrauchbar: `{ehrlich:true}`, und es wird nichts hingelegt. Merkzettel nur aus deinen Zetteln (Namen aus dem Titel), jede Idee mit ihrer Quelle.
- `C6.vorbereitung.oeffne(el, vb)` (vb mit `werkzeugId`) zeichnet das Ding, `C6.vorbereitung.inhalt(termin, art)` liefert nur den Inhalt, `C6.vorbereitung.klein(w)` gibt einen Satz für Fach und Wand („3 Karten · 1 gewusst“). Den Fortschritt (Reihe, gewusst, wackelt, eigene Karten/Punkte, abgehakt) speichern wir in `C6.S.werkzeug.daten[id].vb`. Bus `vorbereitung` `{was:'gebaut'|'gelernt'|'geschrieben'|'abgehakt', id, art}`.
- **Fremde Datei, minimal angefasst:** `src/module/werkzeug.js` – `male()` gibt Werkzeuge mit `vb` an `C6.vorbereitung` weiter (groß: das Ding, klein: der Satz). `gross()` setzt die Klasse `c6wz-blatt-vb`, darüber blendet `vorbereitung.css` Verlauf, Wunschsatz, Carl-Zeile und „Anders“ aus. Beides ist mit `if` geschützt, ohne unser Modul bleibt alles wie vorher.
- `tools/bau.py` bleibt unverändert, es baut die Dateien nach Glob (vorbereitung/vorschlaege laden vor werkzeug.js, rufen es aber erst zur Laufzeit).
- **Rune · Schlüssel, die wir rufen** (Ersatzsätze im Code): `vorschlag.{weiter|machen|arbeiten|verbinden}` (Namen), `.was` (Versprechen mit {t}/{s}/{b}), `.ohneKopf`, `.fertig`, `verbinden.allein|frage|platz|offen|neuFrage|neuPlatz|keinZweiter`, `weiter.frage|platz|offen|deins`, `machen.wasWerkzeug|leer|vorlage|werkzeug|offen`, `arbeiten.ohne|nichts`, `los`, `losEins`, `losViele`, `laeuft`, `mehrere`, `fertigViele`, `fertigTeils`, `bezug`, `vorschlag.lage`, `zettel.gemeint` (space-Stimme, mit {t}), `naehren.kernAufgehaengt`, `naehren.kernDeiner` {satz}, `himmel.standLeer`, `himmel.hinein`; `vorb.karten.{dreiSelbst|aus|vonCarl|deine|stand|platzVorne|platzHinten|legen|erste|fehltVorne|fehltHinten|klein|kleinEins|kleinLeer}`, `vorb.packliste.{vonCarl|platz|klein}`, `vorb.merk.{platz|klein|deinZettel}`, `vorb.deins`, `vorb.kleinLeer`. **Bitte prüfen:** `vorschlag.weiter.fertig` sagt „Meine Frage …“ – Weiterdenken hängt jetzt wirklich eine Frage auf (Prompt angepasst). `vorschlag.machen.fertig` („hängt an der Leine“) stimmt nicht ganz, der Schritt steht auf dem Schild. Unser Ersatz: „Das Schild sagt jetzt: ‚{s}‘.“ `vorschlag.arbeiten.*` nennt Ferdl beim Namen, das ist in Ordnung (Figur im Werk, kein Meister).
- **Wünsche an raffael:** (1) Im Tagesblatt nach `{ok:true, leer:true}` den Satz `r.satz` (Runes `vorb.keinKopf.<art>`) zeigen und gleich `C6.vorbereitung.oeffne` aufrufen, denn der erste Handgriff steht im Ding. (2) `werkzeug.js:385` „Passt“ → „Neben mich stellen“ (siehe Inventar 7).
- **Passt/Anders in fremden Dateien:** Wünsche 6–12 in `werkstatt/s13/papert/INVENTAR.md` (darstellung.js, werkzeug.js, bibliothek.js, zuhause.js, kern.js, bausteine.js, rundgang.js, stimme.js).

### s13 · raffael · Abstimmung zur neuen Komposition (B1–B3, Antworten 1–5 aus ENTSCHEIDUNGEN.md)
- **miyazaki (B2, verdichten nach unten):** Carls Größe liest rezeption.js jetzt aus **`--c6rz-carl`** (auf `.c6rz`, auch bei jedem Gerätewechsel); du setzt nur die Variable. Das **Tagesblatt liegt nicht mehr im Boden**, sondern ist ein eigenes Ding am Tresen: unten über dem Feld verankert (`bottom: --c6-unten + 8px`), seine Oberkante höchstens bei **`--c6rz-blatt-oben`** (Standard: Tresenkante − 8 px). Wenn du den Tresen auf 60–64 % legst, setz `--c6rz-blatt-oben` auf die Unterkante des Regals + 8 px, damit das offene Fach sichtbar bleibt. Was Carl und seine Blase tun, solange `.c6rz-buehne[data-tag-offen]` steht, gehört dir. Ist der Inhalt höher als der Platz, rollt das Blatt in sich (fester Kopf mit ✕, Ende mit Rand immer sichtbar, kein Verlauf mehr über Knöpfen). `.c6rz-boden` trägt nur noch Ersatz-Fächer und deine Werkzeuge.
- **papert:** neue Arten im Termin: `art:'vortrag'` → `karteikarten` (Stichworte), `art:'bewerbung'` → `merkzettel` (Fragen, die kommen könnten, nur mit Kopf). `baue(termin, art)` bekommt `termin.art`; bitte im Inhalt danach unterscheiden (Merkzettel bei Bewerbung = keine Geschenkideen).
- **Rune:** neue Schlüssel (Ersatz steht im Code): `vorb.angebot.karteikarten.vortrag`, `vorb.angebot.merkzettel.bewerbung`, `brief.erster`, `brief.spaceName` („Was ansteht“), `brief.zettel` {titel}, `brief.zettelNeu` {titel}. Gerufen werden jetzt auch `brief.nichtsVerbunden`, `brief.frageLeer`, `brief.frageWichtig`.
- **Brief (Antworten 2, 3, 5):** nennt nur, was in keinem Brief eines früheren Tages stand (heute steht immer drin), dazu das Vorbereitete und die eine Frage (`C6.tage.nenne(b)` beim Öffnen, `C6.S.tage.genannt`). Gibt es nichts, kommt einmal der ehrliche erste Brief (`brief().erster`), danach nur an Tagen mit Inhalt. Freie Frage: ≥ 2 Einträge → `frageWichtig`, sonst `frageLeer`; die Antwort wird ein Zettel im zuletzt benutzten Space, ohne Space im neuen Space „Was ansteht“ (`C6.auftrag.beantwortet()`, einmal am Tag).

### s13 · miyazaki → raffael (B1/B2, 16.10.)
- Neue Lage: Tresenkante iPhone `max(oben+340px, 60%)`, Computer `max(oben+420px, 61%)`; Carl 176 / 290 (`--c6rz-carl`, danke für die Zeile); Carl steht mit `top: Tresen + 0,32 × Größe` – Beine und Bauchband liegen auch beim höchsten Schweben hinter der Kante.
- Ich setze in der Lage `--c6rz-blatt-oben: calc(var(--c6rw-tresen) + 2px)`: dein Tagesblatt liegt damit auf dem Tresen (ab seiner Kante), Carls Gesicht bleibt frei. Der Boden davor ist kürzer; das Blatt rollt bei viel Inhalt. Wenn du mehr Höhe brauchst, sag es – dann rücke ich den Tresen am iPhone auf 58 %.
- Glocke am Computer: nach dem Klingeln stand kurz „Im Postfach liegt dein Brief für heute.“ in der Blase (dein Brief-Satz kam nach dem Glockensatz) – bitte prüfen, ob der Briefsatz den Glockensatz überschreiben soll.

### s13 · papert+rams · Nachtrag 2 (Vitruvian ENTSCHEIDUNGEN 7–9)
- **Besitz übertragen (nur diese Stellen):** `darstellung.js` Knopfzeile (`c6d-wahl`: „In ‚Space‘ hängen“ / „Anders legen“, `haengenText`), `werkzeug.js` Knopfzeile nach dem Bauen („Neben mich stellen“ an der Rezeption, „Aufstellen“ im Space, „Anders bauen“ – Stimme `werkzeug.nebenMich|aufstellen|andersBauen`), `bibliothek.js:1296` („‚Gemessene Zeiten‘ anlegen“ / „Anderer Name“), `zuhause.js` Knäuel und `kern.js` Satz-Name („So nennen“ / „Anderer Name“), `bausteine.js` Schild („Neu schreiben“), `rundgang.js` („So heißt er“). Kein bloßes „Passt“ mehr in `src/`.
- **„Machen“ mit Schritt:** „‚…‘. Geschafft?“ → „Geschafft“ (`bausteine.erledige`, wird Zettel) oder „Ein Werkzeug dazu bauen“ (nur auf Wunsch); daneben tippen = bleibt. Rune: neue Schlüssel `vorschlag.machen.wasGeschafft|geschafftFrage|geschafft|werkzeugWahl|abgehakt|nochNicht`.
- **Art:** überall `karteikarten`. raffael: `paperts()` darf `'karteikarten'` direkt übergeben (der Alias `'karten'` wird noch angenommen).
- Rune: `stimme.js` `naehren.ja|anders|kernsatz|schritt` sind jetzt ohne Aufrufer (Inventar 12).

## s13 · Rune · Nachtrag (nach ENTSCHEIDUNGEN.md und den Nachträgen; geändert oder neu)

- `rezeption.erst` → „Ich bin {carl}, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was.“ (Regal hängt jetzt über Carl, Bild `probe/rz-kal-iphone.png`).
- Gestrichen (ohne Aufrufer, teils unwahr – Ferdl liest nicht, Carl liest): `vorschlag.weiter|machen|arbeiten|verbinden.satz`, `vorschlag.arbeiten.laeuft`, `vorschlag.verbinden.ohneKopf|keins`.
- **papert:** `vorschlag.fertigTeils` schreibe ich bewusst nicht: dein Ersatz hat ein Leerzeichen am Ende, `fest()` schneidet es ab („1 hängt.Nachlesen …“). Bitte das Leerzeichen im Code anfügen, dann liefere ich den Satz.
- Entscheidung 5: `brief.naechste` sagt „Neu für die nächsten Tage“, `brief.naechsteLeer` „nichts Neues“ – denn der Brief nennt nur Neues; „steht nichts“ wäre falsch gewesen.

| Schlüssel | Wortlaut | wahr nur, wenn |
|---|---|---|
| `brief.naechste` | Neu für die nächsten Tage: {liste}. | Brief nennt nur, was in keinem früheren Brief stand (C6.tage.nenne); ≥ 1 neuer Eintrag in +1…+6. |
| `brief.naechsteLeer` | Für die nächsten Tage nichts Neues. | heute ≥ 1 Eintrag, aber nichts Neues in +1…+6 (auch wahr, wenn dort gar nichts steht). |
| `vorschlag.machen.fertig` | Auf dem Schild steht jetzt: „{s}“. | Nächster Schritt gesetzt (Entscheidung 9: Schild, nicht Leine). |
| `vorschlag.arbeiten.fertig` | Was ich gefunden hab, hängt an der Leine. Schau selbst nach, ob es stimmt. | Fund gehängt, Herkunft „Aus der Recherche“. Carl liest, nicht Ferdl. |
| `vorschlag.verbinden.allein` | Das ist dein einziger Space. Zum Verbinden braucht es zwei, den zweiten nennst du. | genau 1 Space; danach fragt `verbinden.neuFrage`. |
| `vorschlag.weiter.ohneKopf` | Ohne Mitdenken frag ich dich, was aus „{t}“ folgt. Deine Antwort hängt dann an der Leine. | Karte ohne Kopf; {t} = gemeinter Zettel/Kernsatz. |
| `vorschlag.machen.ohneKopf` | Du schreibst den nächsten Schritt, ich häng ihn als Schild auf. | Karte ohne Kopf. |
| `vorschlag.arbeiten.ohneKopf` | Nachlesen geht nur, wenn jemand mitdenkt. Hier ist gerade keiner. | Karte ohne Kopf (Versprechen). |
| `brief.erster` | Das ist dein Postfach. An jedem Tag, an dem etwas ansteht, liegt hier ein Brief von mir. | Einmal: der ehrliche erste Brief, wenn nichts ansteht (brief().erster); danach nur Tage mit Inhalt. |
| `brief.spaceName` | Was ansteht | Name des neuen Space, wenn die Antwort auf den Brief keinen Space findet. |
| `brief.zettel` | Hängt als Zettel in „{titel}“. | Antwort hing im zuletzt benutzten Space. |
| `brief.zettelNeu` | Das ist der erste Zettel in deinem neuen Space „{titel}“. Du findest ihn im Zuhause am Brett. | Space neu angelegt UND Zuhause zeigt das Brett mit Spaces. |
| `vorb.angebot.karteikarten.vortrag` | „{titel}“ ist {wann}. Soll ich dir Karteikarten mit Stichworten machen? | Termin klingt nach Vortrag/Referat/Präsentation. |
| `vorb.angebot.merkzettel.bewerbung` | „{titel}“ ist {wann}. Soll ich dir Fragen aufschreiben, die dort kommen könnten? | Termin klingt nach Bewerbung/Vorstellungsgespräch UND jemand denkt mit (sonst kein Angebot). |
| `kalender.unlesbar` | Dein Kalender hat geantwortet, aber nichts davon konnte ich sicher lesen. Lieber zeig ich nichts als etwas Falsches. | Antwort kam, 0 lesbare Einträge, ≥ 1 unlesbarer. |
| `tage.beispielBlatt` | Steht „{titel}“ in einem Fach, frag ich dich, ob ich dir {ding} machen soll. Sagst du ja, liegen sie danach im Fach. | Tagesblatt des gekennzeichneten Beispiel-Fachs. |
| `tage.vorbereitetLeer` | Für „{titel}“ hab ich dir was Leeres ins Fach gelegt. Den ersten Eintrag schreibst du. | Werkzeug mit `vb` ohne Inhalt (ohne Kopf); heißt nie „vorbereitet“. |
| `brief.ablage` | Hier liegt dein Brief. Tipp ihn an, dann mach ich ihn auf. | Antippen der Ablage, Brief liegt. |
| `brief.ablageLeer` | Heute liegt hier noch kein Brief. Steht etwas an, liegt hier einer. | Antippen der leeren Ablage. |
| `vorschlag.weiter.was` | Ich denk an „{t}“ weiter und häng dir eine Frage an die Leine. | Karte mit Kopf. |
| `vorschlag.weiter.frage` | „{t}“. Was folgt daraus? | Frage nach Los (ohne Kopf). |
| `vorschlag.weiter.platz` | Dein nächster Gedanke … | Platzhalter. |
| `vorschlag.weiter.offen` | Noch kein Gedanke. Tipp die Karte noch einmal, wenn dir einer kommt. | Frage ohne Antwort geschlossen. |
| `vorschlag.weiter.deins` | Dein Gedanke hängt an der Leine. | Antwort hängt als Zettel. |
| `vorschlag.machen.was` | Ich schlag dir einen nächsten Schritt vor. Du sagst, bis wann. | Karte mit Kopf, noch kein Schritt. |
| `vorschlag.machen.wasGeschafft` | Auf dem Schild steht „{s}“. Ist er geschafft, hak ich ihn ab. | Karte, wenn schon ein Schritt steht (Entscheidung 7). |
| `vorschlag.machen.geschafftFrage` | „{s}“. Geschafft? | nach Los, Schritt steht. |
| `vorschlag.machen.geschafft` | Geschafft | Knopf. |
| `vorschlag.machen.werkzeugWahl` | Ein Werkzeug dazu bauen | Knopf, nur auf Wunsch. |
| `vorschlag.machen.abgehakt` | „{s}“ ist geschafft. Er hängt jetzt als Zettel an der Leine. | `bausteine.erledige` lief, Zettel hängt. |
| `vorschlag.machen.nochNicht` | „{s}“ bleibt auf dem Schild, bis du ihn abhakst. | daneben getippt. |
| `vorschlag.machen.offen` | Noch kein Schritt. Weißt du einen, tipp das Schild „Nächster Schritt“ an. | ohne Eingabe geschlossen. |
| `vorschlag.machen.leer` | Daraus wurde kein Werkzeug. Sag mir unten in einem Satz, was es können soll. | Werkzeugbau leer. |
| `vorschlag.machen.vorlage` | „{n}“ steht neben mir, aus einer Vorlage, weil hier gerade keiner mitdenkt. | Werkzeug aus Vorlage. |
| `vorschlag.machen.werkzeug` | „{n}“ steht neben mir. | Werkzeug gebaut. |
| `vorschlag.arbeiten.was` | Ich lese zu „{t}“ nach und häng dir, was ich finde, an die Leine. Bitte selbst prüfen. | Karte mit Kopf. |
| `vorschlag.arbeiten.ohne` | Nachlesen geht nur, wenn jemand mitdenkt, und hier ist gerade keiner. Häng dir eine Quelle selbst an die Leine. | nach Los ohne Kopf. |
| `vorschlag.arbeiten.nichts` | Beim Nachlesen kam ich nicht weiter, darum hängt nichts. Versuch es später noch einmal. | mit Kopf, leer. |
| `vorschlag.verbinden.was` | Mit „{b}“. Du sagst in einem Satz, was die beiden verbindet. | Karte, ≥ 2 Spaces. |
| `vorschlag.verbinden.frage` | Was verbindet „{a}“ und „{b}“? | nach Los. |
| `vorschlag.verbinden.platz` | Ein Satz, deiner | Platzhalter. |
| `vorschlag.verbinden.offen` | Noch kein Satz. Im Himmel ziehst du „{b}“ jederzeit selbst heran. | ohne Satz geschlossen. |
| `vorschlag.verbinden.neuFrage` | Zum Verbinden braucht es einen zweiten Gedanken. Wie heißt er? | nur 1 Space, nach Los. |
| `vorschlag.verbinden.neuPlatz` | Name des zweiten Gedankens … | Platzhalter. |
| `vorschlag.verbinden.keinZweiter` | Ohne zweiten Gedanken gibt es nichts zu verbinden. | kein Name gegeben. |
| `vorschlag.bezug` | zu „{t}“ | gemeinter Zettel über den Karten. |
| `vorschlag.losEins` | Los: {n} | eine Karte gewählt; {n} = ihr Name. |
| `vorschlag.losViele` | Los, {n} nacheinander | ≥ 2 gewählt. |
| `vorschlag.fertigViele` | Fertig. {n} Sachen hängen jetzt hier. | ≥ 2 gelungen. |
| `vorschlag.lage` | Der Kernsatz steht. Was machen wir als Nächstes? | Kernsatz gerade gesetzt, Karten wippen. |
| `zettel.gemeint` | „{t}“. Die Vorschläge unten meinen jetzt diesen Zettel. | Zettel angetippt, Karten beziehen sich wirklich darauf. |
| `naehren.kernAufgehaengt` | Ich hab dir einen Kernsatz vorgeschlagen, er hängt an der Leine. Tipp ihn an, wenn er trägt. | Vorschlag hängt als Carls Zettel. |
| `naehren.kernDeiner` | Vielleicht trägt „{satz}“ diesen Space. Tipp den Zettel an, wenn er der Kernsatz ist. | ohne Kopf, Satz aus deinen Zetteln. |
| `himmel.standLeer` | Noch leer. Der erste Zettel ist der Samen. | Planet von oben, 0 Zettel. |
| `himmel.hinein` | Hineingehen | Knopf im Blatt „von oben“. |
| `vorb.karten.dreiSelbst` | Schreib dir selbst drei, dann lohnt sich der Stapel. | leerer Stapel. |
| `vorb.karten.aus` | von Carl, aus deinem Zettel „{z}“ · bitte prüfen | Karte von Carl mit Quelle. |
| `vorb.karten.vonCarl` | von Carl geschrieben · bitte prüfen | Karte von Carl ohne Quelle. |
| `vorb.karten.deine` | deine Karte | selbst geschrieben. |
| `vorb.karten.stand` | {n} im Stapel · {g} gewusst · {w} nochmal | echte Zählung der Runde. |
| `vorb.karten.platzVorne` | Was willst du gefragt werden? | Platzhalter. |
| `vorb.karten.platzHinten` | Und was ist die Antwort? | Platzhalter. |
| `vorb.karten.legen` | Auf den Stapel | Knopf, Stapel hat ≥ 1. |
| `vorb.karten.erste` | Erste Karte | Knopf, Stapel leer. |
| `vorb.karten.fehltVorne` | Vorne fehlt noch die Frage. | Eingabe ohne Frage. |
| `vorb.karten.fehltHinten` | Hinten fehlt noch die Antwort. Ohne sie kannst du dich nicht prüfen. | Eingabe ohne Antwort. |
| `vorb.karten.klein` | {n} Karten · {g} gewusst | Kurzsatz Fach/Wand, n ≥ 2. |
| `vorb.karten.kleinEins` | eine Karte · {g} gewusst | n = 1. |
| `vorb.karten.kleinLeer` | noch keine Karte | n = 0. |
| `vorb.packliste.vonCarl` | Von Carl vorgeschlagen. Streich, was du nicht brauchst. | Inhalt mit Kopf. |
| `vorb.packliste.platz` | Noch etwas … | Platzhalter. |
| `vorb.packliste.klein` | {n} noch einpacken | Kurzsatz, n ≥ 1. |
| `vorb.merk.platz` | Noch eine Idee … | Platzhalter. |
| `vorb.merk.klein` | {n} Ideen | Kurzsatz. |
| `vorb.merk.deinZettel` | dein Zettel | Quelle einer Idee. |
| `vorb.deins` | von dir | eigener Eintrag. |
| `vorb.kleinLeer` | noch leer | Kurzsatz, leer. |

### s13 · Rune · nach der Otto-Probe (stimme.js, nur Wortlaut)
- `vorb.keinKopf.karteikarten|packliste|merkzettel`: jetzt je ein Satz, der wahr bleibt, auch wenn danach Karten im Stapel liegen („Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen.“). Was im Fach liegt, sagt `tage.vorbereitetLeer`.
- `vorschlag.weiter.frage` → „Was folgt aus „{t}“?“. **papert:** Bitte den Schlusspunkt von {t} abschneiden.
- `himmel.raum` → „In der Mitte bist du. Tipp einen Planeten an, dann schauen wir ihn von oben an.“ (AUFTRAG 9). **papert:** Der Ersatz in `netz.js:2166` sagt noch „fliegen wir hin“.
- Vetos: `werkstatt/s13/veto/{rune,rams,papert}.md`, Protokoll `werkstatt/s13/otto/OTTO.md`.

### s13 · raffael · nach der Veto-Runde (Rune V2, Rams V1+V2, Papert V2)
- **`C6.tage.eintragen(tag, titel)`** → Termin `{id:'w:<werkzeugId>:<k>', titel, zeit:null, quelle:'werkzeug', art, werkzeugId, tag}` oder `null`. Legt beim ersten Mal ein eigenes Termin-Werkzeug **„Was ansteht“** an (`w.wasAnsteht = true`, Bausteine `t:'datum'`) und erweitert es danach. Das Fach füllt sich sofort (Bus `tage {was:'eingetragen', termId, tag, i, werkzeugId}` und danach `{was:'stand'}`), die Art kommt aus dem Titel, das Angebot erscheint wie beim Kalender.
- **Zeile im Tagesblatt (papert):** rezeption.js legt in jedem Tagesblatt `<div class="c6tg-eintrag" data-tag="JJJJ-MM-TT">` an und ruft, wenn vorhanden, **`C6.vorbereitung.eintragZeile(el, {tag, leer})`**. Bleibt `el` danach leer oder fehlt die Funktion, steht dort ein schlichtes Feld von mir („Was steht an dem Tag an?“ / bei vollem Tag „Steht noch etwas an dem Tag an?“ + „Eintragen“). Wenn das Blatt rollt, steht die Zeile fest am unteren Rand. Während ein Ding offen ist (`.c6rz-tb-vb-aktiv`), treten Zeile, Kalenderzeile, Herkunft, Angebot und die anderen Termine zurück. Rune: `tage.eintrag`, `tage.eintragMehr`, `tage.eintragPlatz`, `tage.eintragen`, `tage.eingetragen` {titel} (Ersatz steht im Code).
- **Mit miyazaki (Rams V1):** Solange ein Tag offen ist, setzt rezeption.js `--c6rz-blatt-oben` inline auf `.c6rz` = gemessene Unterkante von `.c6rw-regal` + 8 px. Setzt die Welt **`--c6rz-blatt-oben-offen`** auf `.c6rz`, gilt dieser Wert statt der Messung. Carl zur Seite oder kleiner und die Blase still bei `.c6rz-buehne[data-tag-offen]`: miyazaki. Das Blatt ist unten verankert und nur so hoch wie sein Inhalt. Gemessen: iPhone y 303–692 (389 px) im höchsten Fall, Computer y 314–740.
- **Rune V2:** Ohne verbundenen Kalender und mit allen Fächern leer steht die Kalenderzeile als erste Zeile unter dem Kopf. Den Apple-Satz sagt Carl einmal je Sitzung (in dem Tag, in dem er zuerst stand).
- **Rams V2:** Im Brief gibt es nur „Ja, bitte“ / „Später“. „Nicht nötig“ steht nur im Tagesblatt.
- Vorbereitungen und „Was ansteht“ stehen nicht mehr in der Werkzeug-Reihe neben Carl; sie liegen in ihren Fächern (ein Ding, ein Ort).

### s13 · miyazaki · Rams V1 (16.10.)
- Ich setze kein `--c6rz-blatt-oben-offen`; deine Messung (Regal-Unterkante + 8 px) gilt.
- Bei `.c6rz-buehne[data-tag-offen]`: Carl schwebt in 420 ms hinauf auf den Kranz des Regals (iPhone rechts der Leuchte, Maßstab 0,46; Computer links, 0,38) und schaut hinunter aufs Blatt (`C6.carl.blick`). Seine Blase ist still (`opacity:0`). Beim Schließen kommt er zurück an den Tresen. Bei `C6.ruhig` / reduzierter Bewegung springt er ohne Weg. Gemessen: Carl überlappt das Blatt nie (iPhone Carl y 82–163, Blatt ab 303; Computer Carl y 10–120, Blatt ab 489). Das offene Fach bleibt sichtbar und markiert.
- Nur CSS in `rezeption.css` (Lage) + Blick in `rezeption.welt.js`; nichts in rezeption.js.

### s13 · papert+rams · nach der Veto-Runde
- `C6.vorbereitung.eintragZeile(el, {tag, leer})` ist gebaut: eine Linie mit Stift, ruft `C6.tage.eintragen`. Carls Satz steht unter der Linie (die Blase würde das Fach verdecken) und übersteht das Neuzeichnen des Tagesblatts (8 s).
- Der leere Stapel ist jetzt eine beschreibbare Karte. Er passt ins Tagesblatt, ohne zu rollen (iPhone 303–692).
- `C6.vorschlaege.laeuft()` ist neu. `darstellung.js` `neuerZettel` schweigt, solange ein Vorschlag läuft oder irgendeine Frage offen ist.
- raffael (Rune V2, Vorbehalt in `otto/NACH.md`): Lokal meldet `status().kalender` `nicht-verbunden`, das Blatt zeigt aber den Satz für „kein Zugang“ ohne Chip. Bitte prüfen, ob Status und Satz zusammenpassen.
