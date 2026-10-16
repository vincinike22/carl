# s14 · Veto · Rune (Wahrheit)

Geprüft am heutigen Zusammenbau (`python3 tools/bau.py`, 16.10. spät, `carl6-test.html`), Playwright-Chromium, iPhone 390×844 (dpr 2, touch) und Computer 1440×900, leer und mit Leben (`inventar/leben.json`), Abend und Nacht. Echte Tipps: Buch alle zehn Seiten (› geblättert), Himmel (Planet, Verbinden …, zweiter Tipp, Ziehen), Space über die Karte am Brett, Katalog über das Heft in der Garage. Kein Code geändert. Bilder in diesem Ordner.

Frage je Satz und Ding: Lügt es in irgendeinem Zustand? Ist es nicos – oder OpenClaws?

## Veto 1 · Dieselben Zettel, zwei Zahlen — **bricht Vertrauen**
- **Was:** Das Buch sagt auf „Was ich von dir weiß“ „Gitarre lernen · 4 Zettel, noch ohne Kernsatz“ (`b-iphone-leben-07.png`). Der Himmel sagt „Gitarre lernen · 3 Zettel · Schritt fehlt“ (`z-iphone-leben-netz.png`), der Space zeigt drei Zettel an der Leine (`s-computer-01-space-ruhig.png`), und das Buch selbst sagt auf S. 5 „3 Spaces · 6 Zettel“ (3 + 2 + 1). Der vierte „Zettel“ ist das Sternbild-Ding am Boden.
- **Warum:** Wahr je Zustand. Das Buch ist das Verzeichnis, dem Otto glauben soll („Nichts erfunden: Zustände nur aus `C6.S`“, ENTSCHEIDUNGEN 9). Eine Zahl, die an zwei Orten verschieden ist, macht beide unglaubwürdig – und das in dem Buch, das „Was ich von dir weiß“ heißt.
- **Tun:** `src/module/atlas.js:378` zählt `eigene = notizen − funde + (x.dinge || []).length`. Dinge sind keine Zettel: `+ (x.dinge||[]).length` streichen. Besser: eine Zählung für alle (dieselbe Regel wie `netz.js` › `zahlen()`: eigene Notizen ohne `von` und ohne „Fund ·“), z. B. `C6.space.zahlen(sid)`, die Buch, Planet und Planetenblatt lesen. Danach prüfen: Buch S. 5, S. 7, Planet, Planetenblatt sagen für jeden Space dieselbe Zahl.

## Veto 2 · Fremde Marken und Versprechen im eigenen Buch — **bricht Vertrauen**
- **Was:** S. 8 „Wer mitdenkt › Mein Sprachmodell: Claude · ChatGPT · Gemini · Auf meinem Rechner“ (`b-iphone-leben-08.png`); ChatGPT und Gemini haben eigens gezeichnete Zeichen und sagen beim Antippen „merke ich mir. Verbinden kann ich mich damit im Prototyp noch nicht.“ S. 6, S. 9, S. 10: „kommt · Der Brief am Morgen auf WhatsApp“, „WhatsApp · kommt“, „Carl als App auf deinem Mac · kommt“, „Wer außer dir mit mir reden darf · kommt mit WhatsApp“ (`b-iphone-leben-06.png`, `b-iphone-leben-09.png`). Auf S. 6 steht WhatsApp sogar unter der Überschrift „Kommt mit Carl auf deinem Mac“ – die Zuordnung stimmt nicht.
- **Warum:** Projektgesetz „keine fremden Marken, Figuren, Logos“. Und Genom 7 (Funke): „Täusche nie.“ Ein Buch, das beschreibt, was Carl für Otto tut, darf nicht beschreiben, was Carl vielleicht einmal tun wird; „kommt“ ist ein Versprechen ohne Datum, das niemand in der App halten oder prüfen kann. Ein Fremder liest „WhatsApp“ und sucht danach.
- **Tun:** `src/module/atlas.js:141–144` ChatGPT und Gemini aus der Wahl nehmen (es bleiben „Claude“ – der echte Mitdenker – und „Auf meinem Rechner“); `atlas.js:678` (`buch.darf.reden` mit `zuText` „kommt mit WhatsApp“), `:927` und `:978` (`kommtListe`) ganz aus dem Buch; `stimme.js:640` `buch.darf.redenKommt` streichen. „Wer außer dir mit mir reden darf“ sagt nur, was gilt: „Nur du, hier in Carl.“ Was kommt, gehört in STAND/Grundkonstrukt, nicht in Ottos Buch. **Entscheidung nico**, falls „kommt“ im Grundkonstrukt (REVERSE R1) ausdrücklich als Zeile im Buch gewollt ist – dann ohne Markennamen und nie unter falscher Überschrift.

## Veto 3 · Das Feld spricht Bastler, und das Wort wandert — **stört**
- **Was:** In der Werkstatt sagt das eine Feld „Woran denkst du gerade? Oder / für ein Werkzeug“ (Computer, `z-computer-leben-werkstatt.png`) bzw. „Woran denkst du? / Werkzeug“ (iPhone, `z-iphone-leben-werkstatt.png`). An der Rezeption sagt es „Was soll ich dir bauen?“ (`z-iphone-leben-rezeption.png`) – das Verb der Werkstatt („Bau mir was“) steht im Raum „Was steht an?“.
- **Warum:** Ist es nicos – oder OpenClaws? Der Schrägstrich ist die Befehlszeile von Hermes/OpenClaw und Claude Code; für Menschen ohne KI-Erfahrung ist er ein Zeichen ohne Sinn (Namen sind nicht Wissen). Leitbild der Runde: jedes Teil ein Ort, ein Wort. Hier trägt die Rezeption das Wort der Werkstatt, und die Werkstatt erklärt eine Syntax statt ihr Verb.
- **Tun:** `src/kern.js:1668` – in der Werkstatt den Platzhalter auf das Werkstatt-Wort stellen: `st('werkstatt.feld', 'Was soll ich dir bauen?')` (ohne „/“; der Schrägstrich funktioniert weiter, er wird nur nicht beworben – „Für Bastler“ im Buch darf ihn erklären). `src/module/stimme.js:100` `rezeption.feld` → „Was steht an?“ (das Verb der Rezeption laut GRUNDKONSTRUKT/ENTSCHEIDUNGEN). Prüfen: jedes Feld nennt das Verb seines Raums, kein Feld zeigt „/“.

## Was trägt
- Der Katalog sagt die Wahrheit über Geld, ohne Rot und mit Weg: „Dir fehlen noch 3 Münzen. Im Kieselpark gibt es welche.“ (`k-iphone-arm-03-probe.png`, `k-computer-arm-03-probe.png`).
- Der Himmel zählt echt: jede Standzeile („2 Zettel · Schritt fehlt“) kommt aus `C6.S`, und das Planetenblatt sagt dasselbe als Satz (`h-iphone-01-portugal-tipp.png`).
- Das Buch nennt jeden Schalter genau einmal und zeigt von anderen Seiten nur hin („Schalter auf Seite 5 ›“); „Gerade arbeitet kein Helfer.“ ist ein guter, leiser, wahrer Satz (`b-iphone-leben-06.png`).

## Auch gesehen (kein Veto, für die Liste)
- Leerer Space: Schild „Dein erster Space“, während Carl sagt „Noch hängt kein Space am Brett.“ (`z-iphone-leer-space.png`, `space.js:1115`) – das Schild behauptet einen Space, den es nicht gibt. Nur über `C6.geh('space')` erreicht, nicht über einen sichtbaren Weg.
- Katalog: Fußsatz „Die Lampe neben dem Sessel. Tipp eine an.“ bleibt stehen, wenn schon eine zur Probe leuchtet (`k-iphone-leben-03-probe.png`); nach dem Holen „Neues Licht in der Stube.“ (`einrichten.js:352`) – „Stube“ ist ein zweites Wort für Zuhause.
- Buch Inhalt „Was ich kann · 8 an“ – acht was? (`b-iphone-leben-01.png`).

## Ungeprüft
- Echtes Mitdenken (claude.ai), echter Kalender, echtes iPhone/Safari: nicht gesehen. Bildschirmleser, große Schrift: nicht.
- Ob „kommt“ im Grundkonstrukt ausdrücklich als Buchzeile beschlossen ist, habe ich nicht im Grundkonstrukt selbst nachgelesen (nur KREUZUNG jung, 2. Gang: „stützt sich auf Grundkonstrukt/REVERSE (R1)“).
- Zettel-Zahl nur am Testzustand gezählt (ein Sternbild-Ding); Spaces mit Funden oder mehreren Dingen nicht.
