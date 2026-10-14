# s12 · Veto-Runde · Vitruvians Entscheidungen (14.10., 20:35)

11 Vetos (raffael 3, papert 3, rams 3, miyazaki 2, Rune 3 – raffaels drei schon angenommen und gebaut). Kein Veto abgelehnt. Zusammengeführt zu EINER Nacharbeit:

| Nr | Veto (von → an) | Entscheidung | Baut |
|---|---|---|---|
| 1 | miyazaki V1 + rams V2: Gemerkt-Blase vier Zeilen, wiederholt die Karte, deckt das Fenster | **angenommen.** `rezeption.gemerkt` → kurz, ohne {satz}/{name}: „Das hab ich mir gemerkt. Beides gehört dir.“ (Rune formuliert); die Karte zeigt *was*. `beispielGebaut` ebenso kurz. | Rune (Satz), raffael (Aufruf) |
| 2 | rams V1 + Rune V3b: Karte sagt „Dein Satz“ über Carls Beispielsatz | **angenommen.** Bei `bei`: `<dt>` „Mein Beispiel“ (Carls Stimme), sonst „Dein Satz“. | raffael |
| 3 | papert V1 + Rune V2: „Anders“ klebt „. Anders: …“ an Satz und Name; ohne Kopf identisches Werkzeug, aber „Probier es aus“ | **angenommen.** `sp.satz` bleibt der Originalsatz, Änderungswünsche getrennt in `anders[]` (gespeichert, Karte zeigt „Dein Satz“ + „Anders: …“ darunter nur wenn vorhanden); Spec-Vergleich nach dem Bau: gleich → `rezeption.gleich` (Rune hat ihn), nichts anhängen. | raffael |
| 4 | papert V2 + Rune (Mangel): nach Neuladen mit Werkzeugen wieder „Ich bin Carl …“ | **angenommen.** `rezeption.wieder` (Rune liefert; ohne Vorstellung, mit Einladung), Weiche `alle().length>0 || S.du.angekommen`. | Rune, raffael |
| 5 | papert V3: `nameAus` „wie lange ich gelesen hab“ → „Messen“ | **angenommen.** Fünfte Regel: Verb/Partizip am Satzende („gelesen hab“, „gelaufen bin“) → „Gelesen“, „Gelaufen?“ bei Haken. | raffael |
| 6 | rams V3: „Ins Teleskop hängen“ am leeren ersten Werkzeug | **angenommen.** Link erst ab einem Eintrag (`eintraegeZaehlen > 0`), gilt überall. | raffael |
| 7 | miyazaki V2: Gruß-Blase bleibt, während das Blatt baut; zwei Sätze zu zwei Momenten | **angenommen.** Tür setzt die feste Blase: `baut` → `gebaut`/`gebautVorlage`/`gleich` → nach Passt `gemerkt`, nach `rezeption-zu` zurück zum Gruß (`erst`/`wieder`); `stimmung('arbeitet')` während des Baus, danach `ruhig`. Blattkopf ohne doppelten Satz, **aber der Satz des Menschen steht oben im Blatt** (AUFTRAG 3, Rune-Mangel). | raffael |
| 8 | Rune V1: Zuhause verschluckt das Werkzeug | **angenommen.** raffael gibt `C6.rezeption.meine(el)` (die kleine Reihe der Werkzeuge ohne Space) frei; Zuhause zeigt sie klein an einer stillen Stelle (miyazaki, Besitzer Zuhause) und Carl sagt beim ersten Besuch nach dem Ankommen einmal `rezeption.zuhause` (Rune hat ihn). | raffael (API), miyazaki (Zuhause) |
| 9 | Rune V3a: Sätze überleben ihren Zustand (zurück aus Zuhause steht „Gut. So merk ich es mir.“) | **angenommen.** `betreten()` setzt die Blase neu (Gruß/`wieder`), rollt den Boden nach oben; nach Passt rollt die Karte am iPhone ins Bild (Kosten-Zeile und „Stimmt so nicht“ lagen unter dem Feld). | raffael |
| 10 | Rune Tabelle (Entscheidung 5): Sätze, die für `!fertig && angekommen` falsch sind | **angenommen, Mindestmaß:** `stimme.erster()` kennt das Werkzeug (Rune liefert den Satz); `werkzeug.ohneSpace` → „Es steht neben mir an der Rezeption.“; Lernweg Station 4 gilt als geschafft **mit einem Satz, der es sagt** (nichts still abhaken – Wochenend-Kalender Sonntag 1 ebenso: nur mit Satz, sonst nicht); `lernweg.samstag` ohne „Morgen bauen wir“. `rg.*` bleibt (nur im Rundgang). | Rune (Sätze), raffael (Weiche) |
| 11 | Vitruvian: `stimme.js` Zeile ~68 trägt einen Meisternamen im Kommentar | **Verstoß.** Entfernen; danach `grep -niE 'miyazaki|raffael|papert|rams|rune|rothko|monet|hokusai|feynman' src/` muss leer sein (außer Zeichenketten, die keine Meister sind). | Rune |

Nicht gebaut in s12 (ins Protokoll, s13/s14): Zuhause als Raum mit Verb („Was gibt's heute?“) – s13; Glocke am echten iPhone; reduzierte Bewegung; Denk-Pfad nur simuliert.

Danach: raffael baut, `pruef6 --nur rezeption,zuhause`, Rams prüft die elf Punkte mit echten Klicks nach (derselbe Prüfer an denselben Stellen), dann Vitruvian: eigene Bilder, v26.
