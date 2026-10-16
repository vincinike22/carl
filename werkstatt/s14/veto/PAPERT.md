# s14 · Veto · Papert (der Funke)

Geprüft am heutigen Zusammenbau (16.10. spät), Playwright-Chromium, iPhone 390×844 (dpr 2, touch) und Computer 1440×900, als Otto mit echten Tipps: Erstkontakt im leeren Zuhause („+ Neuer Space“ → leer senden → Satz → „So nennen / Anderer Name“, `e-*`), Himmel (Planet, „Verbinden …“, zweiter Tipp, leer abschicken, ins Leere ziehen, `h-*`), Space (Carl antippen, daneben, Zettel antippen, dreimal betreten, `s-*`), Katalog (Probe, Holen, zu wenig Münzen, `k-*`). Kein Code geändert.

Frage: Ist das Ding zum Denken da? Was passiert beim ersten Fehler? Programmiert Otto das System – oder das System Otto?

## Veto 1 · Der Himmel erklärt für immer, statt das Ding zeigen zu lassen — **stört**
- **Was:** Oben steht dauerhaft „Jeder Planet hier oben ist einer deiner Spaces, mit seinem Stand darunter. Gehören zwei zusammen, zieh den einen zum anderen.“ – auch wenn Otto längst ein Sternbild gezogen hat (`z-iphone-leben-netz.png`: das Sternbild „Beides braucht jeden Tag ein bisschen.“ steht schon darunter; `z-computer-leben-netz.png`).
- **Warum:** Erst das Ding, dann das Wort; Staunen vor Erklären. Das Ziehen ist das beste Ding der Runde (goldener Faden, schnurrt zurück, wenn man danebenzieht) – aber der Satz nimmt die Entdeckung vorweg und bleibt als Gebrauchsanweisung stehen. Ein Satz, der nach dem Zustandswechsel (erstes Sternbild) noch steht, lehrt nichts mehr; er ist Rauschen über dem Ding.
- **Tun:** `src/raeume/netz.js` › `grundSatz()` (Z. ~1862, `himmel.tat`): den langen Satz nur, solange noch **kein** Sternbild existiert (`C6.strings.knotenAlle().length === 0`); danach oben nur leise, was neu ist (oder nichts). Und das Ding selbst zeigen lassen: beim ersten Besuch mit ≥ 2 Planeten und 0 Sternbildern tastet einmal ein dünner goldener Faden von einem Planeten zum nächsten und schnurrt zurück (≤ 1,2 s, nie bei `C6.ruhig`) – der Finger versteht es, bevor der Satz zu Ende gelesen ist. Rune prüft danach den kürzeren Satz.

## Veto 2 · Der erste Fehler beim Sternbild bleibt halb unsichtbar — **stört**
- **Was:** Zwei Planeten gewählt → „Was verbindet „A“ und „B“?“ → Otto drückt leer auf „Verbinden“/Enter. Das Einzige, was geschieht: der Platzhalter wechselt von „Ein Satz, deiner“ zu „Was haben die beiden gemeinsam? Ein Satz reicht.“ – am iPhone abgeschnitten zu „Was haben die beiden gemeinsam? Ei…“ (`h-iphone-03-04-feld-vorher-nachher.png`, `h-iphone-04-leer-abgeschickt.png`). Der nächste Handgriff („Ein Satz reicht“) ist genau der Teil, der fehlt; die Frage wiederholt nur die Überschrift.
- **Warum:** Ein Fehler ist ein Bug mit nächstem Handgriff, und der Handgriff muss sichtbar sein. Ein Hinweis im Platzhalter verschwindet beim ersten Buchstaben und ist auf 390 px nicht ganz lesbar.
- **Tun:** `src/raeume/netz.js` › `frageKnoten()` › `onsubmit` (Z. ~2110–2117): bei leerem Feld eine eigene Zeile **unter** dem Feld (`role="status"`, Himmel-Grau `#aab2dc`): „Ein Satz reicht – zum Beispiel, was beide brauchen.“; Fokus bleibt im Feld; Platzhalter bleibt „Ein Satz, deiner“. Kein Rot, kein Wackeln. Prüfen am iPhone: Zeile ganz sichtbar bei offener Tastatur.

## Veto 3 · Carl fragt bei jedem Betreten – das System programmiert Otto — **stört**
- **Was:** Space „Durch Portugal reisen“ dreimal über die Karte am Brett betreten: jedes Mal eine neue Frage in der Blase – „Was hat dich auf „Durch Portugal reisen“ gebracht?“, „Wer sollte von „Durch Portugal reisen“ wissen?“, „Was wäre an „Durch Portugal reisen“ das Schönste?“ (`s-iphone-w1-Portugal.png`). Im Space „Gitarre lernen“ beim ersten Betreten ebenfalls sofort eine Frage mit „Später“ (`s-computer-01-space-ruhig.png`).
- **Warum:** Maßstab der Stoppuhr: **leise bis zur Frage** – Ottos Frage, nicht Carls. Wer jedes Mal beim Hereinkommen befragt wird, antwortet bald nur noch – das ist die Umkehrung von „der Mensch programmiert das System“. Seit s14 gibt es dafür die richtige Geste: Carl antippen öffnet „Was machen wir damit?“ mit den Karten. Die Nähr-Frage gehört dorthin, nicht vor die Tür.
- **Tun:** `src/raeume/space.js` › `lage()` (Z. ~2316–2318, `naehren.frage`): die Nähr-Frage höchstens **einmal je Space und Tag** sprechen (`S.spaces[sid].gefragtAm`), sonst schweigt Carl beim Betreten (bzw. sagt nur einen Stand-Satz ohne Frage); die Frage wartet, bis Otto Carl antippt, und steht dann über den Karten. Die anderen Fälle in `lage()` (Schritt heute dran, Brief, Fund, Ort geraten) bleiben – sie sagen etwas Neues.

## Was trägt
- **Ein echtes Ding zum Denken:** im Himmel von Planet zu Planet ziehen – goldener Faden, Ring um Start und Ziel, ins Leere losgelassen schnurrt er ohne Urteil zurück (`h-iphone-05-ziehen-leer-mitten.png`, `h-iphone-06-ziehen-leer-los.png`). Anfassbar, exakt, liebbar.
- **Ottos Ding ist die Mitte:** im Space steht das eigene Werkzeug groß und bedienbar unter Carl (`s-iphone-01-space-ruhig.png`) – hier sagt Otto dem System etwas („heute geschafft“) und sieht die Wirkung.
- **Die Probe im Katalog:** antippen = die Lampe geht an, ihr eigenes Licht; zu wenig Münzen ist kein Urteil, sondern ein Weg („Im Kieselpark gibt es welche“). Erstkontakt „+ Neuer Space“ → „Ein Satz, und es wird ein Space.“ → „Ich nenn ihn „Spanisch lernen“?“ ist kurz und lässt Otto entscheiden (`e-iphone-03-satz.png`).

## Kultur (ein Monat, ohne uns im Raum)
Otto geht morgens an die Rezeption, abends ins Zuhause, und ab und zu hoch. Im Himmel zieht er zwei-, dreimal Fäden – wenn der Satz oben nicht mehr erklärt, sondern das Ding selbst lockt, wird das Verbinden ein Spiel, das man Freunden zeigt („schau, meine Sternbilder“). Fragt Carl weiter bei jedem Betreten, lernt Otto, Spaces zu meiden, in denen er nichts Neues zu sagen hat. Das Publikum fehlt noch: es gibt kein Zeigen, Teilen oder Fest für ein Sternbild oder ein Werkzeug (s15-Frage).

## Lernbericht
Ich hielt die stehende Frage im Space zuerst für eine liegengebliebene Blase aus dem vorigen Space (mein Skript las eine ausgeblendete Blase mit `innerText`). Erst das Bild zeigte: Gitarre schweigt beim zweiten Mal, Portugal fragt jedes Mal neu – der Grund steht in `lage()` als Absicht („Carl nährt den Samen“), nicht als Fehler. Das Veto richtet sich gegen die Absicht, nicht gegen einen Bug.

## Ungeprüft
- Echtes Mitdenken (Carl schlägt selbst vor), echtes iPhone mit Finger (Trägheit beim Ziehen), Tastaturweg „Verbinden …“: nicht.
- Ob ein Fremder das Ziehen **ohne** den Satz findet: Hypothese, braucht einen Menschen, der es zum ersten Mal sieht.
- Die Nähr-Frage nur in zwei Spaces und drei Runden gesehen.
