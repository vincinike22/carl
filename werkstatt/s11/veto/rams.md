# Rams · Veto s11 (Gebrauch) · 10.10., abends
Geprüft als Otto mit echten Klicks (Computer 1100) und echten Berührungen (iPhone 390, CDP-Touch): `werkstatt/s11/otto/otto.py computer|iphone`, Bilder und Logs daneben (`otto_*.log` mit Zeitstempeln). 0 Konsolenfehler auf beiden Geräten.

## Zählung der Bedienelemente (role=button/tabindex, sichtbar, Computer 1100; `scratchpad/inv.py` gegen v24-Quellen aus `*/vorher/`)
| Raum | v24 | jetzt | dazu |
|---|---|---|---|
| Werkstatt | 8 | 10 | Fenster (Tipp: Carl schaut hin), Lupe (vorher Teil von Ferdl) |
| Bibliothek | 8 | 11 | Fenster, Buch „Was an der Wand hängt“, Leselampe |
| Lesesaal | 2 | 9 | Kerze, 5 Porträt-Ovale, „Dein Platz“ |
| **Summe** | **18** | **30** | **+12**, dazu Halten (600 ms) auf 17 Dingen |
Vitruvians Entscheidung 1 („keine neuen Bedienelemente“) ist dem Buchstaben nach nicht gehalten; dem Sinn nach halb: Lampe, Kerze, Sanduhr, Lupe sind Dinge mit einer Antwort (gut). Fenster-Tipp, fünf Ovale und „Dein Platz“ sind Knöpfe, die eine schon vorhandene Handlung doppeln (Regal → Meister-Blatt) oder nur einen Satz über sich selbst sagen.

## Veto 1 · Lampe aus = Rückweg weg (Computer)
- **Bruch:** Werkstatt, Lampe antippen → das Band `c6w-aus-raum` legt sich auch über die Leiste; „Zuhause / Bibliothek / Garage“ sind grau auf grau, nur „Werkstatt“ lesbar. Bild: `otto/w5_lampe_aus_computer.png` (20,7 s), Ausschnitt Dock geprüft. Am iPhone bleibt die Leiste hell (richtig).
- **Prinzip:** 8 (Rückweg, Kante so ernst wie der Hauptbildschirm) und 5 (Werkzeug tritt zurück, nie der Mensch). Ein Lichtschalter darf nie die Navigation ausschalten.
- **Gegenvorschlag (10 min):** `werkstatt.css:123` – das Dunkel endet an `--c6-unten` (Band nur auf der Szene, `bottom: var(--c6-unten)`), oder die Leiste bekommt unter `.c6w-aus-raum` ihre volle Farbe zurück (`.c6w-aus-raum .c6k-leiste{filter:none;opacity:1}`), wie es am iPhone schon ist.
- **Wertschätzung:** Dass Fenster und Ferdls Tischlampe als einzige Lichter übrig bleiben, ist genau richtig gedacht – der Raum erklärt die Lampe von selbst.

## Veto 2 · Das Fenster gibt es am iPhone nicht
- **Bruch:** Werkstatt hochkant: vom Fenster ist nur das Brett mit der Pflanze zu sehen (Fenster-Treffer liegt bei y = −9 px, oberhalb der Bühne); Halten erreicht es nicht (Log iPhone 39,9 s: kein Staunen), Tageszeit (Morgen/Nacht) ist unsichtbar: `otto/w12_morgen_iphone.png`, `w0_ankunft_iphone.png`. Dazu ist das Schild „Hier hängen bald deine Werkzeuge“ links abgeschnitten („ier hängen …“).
- **Prinzip:** 8 (kleinste Breite) und 7 (System: das Ding, das am Computer die Tageszeit trägt, fehlt am Gerät, das Otto in der Hand hat).
- **Gegenvorschlag (10 min):** `werkstatt.js:1437` hochkant `fenster: 'translate(60,-150) scale(.8)'` → y so, dass die Scheibe ganz unter dem Kopf liegt (z. B. `translate(60,-40) scale(.7)`), Wandbrett 40 px tiefer; Schild: der kurze Text „Bald deine Werkzeuge“ steht schon in Zeile 1366, aber `stelle()` (Zeile 1565) zeichnet beim Wechsel auf hochkant Wand, Bank, Wurf und Tür neu – nicht die Ecke; `zeichneEcke()` dort dazunehmen.
- **Wertschätzung:** Die Hobelbank hinter Carl und die Lochwand links unten sitzen am iPhone jetzt richtig – das war v24 nicht so.

## Veto 3 · Tippziele unter 44 px und doppelte Wege
- **Bruch:** iPhone: Lochwand-Anhänger 24×35, Porträt-Ovale 33×41, Lupe 35×32, Buchrücken 24×96, „Dein Platz“ 41×40 (Log iPhone). Computer: Lupe 57×53, Buch 33×135. Dazu fünf Ovale + Regal + Plakette = sieben Knöpfe für eine Handlung (Meister-Blatt). Bilder: `otto/w8_gezogen_iphone.png`, `l0_ankunft_iphone.png`.
- **Prinzip:** 7 (System vor Einzelstück: raffaels eigener Kern-Hinweis sagt ≥ 44 px) und Inventarregel „zwei Elemente für dieselbe Handlung → eins bleibt“.
- **Gegenvorschlag (10 min):** Treffer-Rechtecke (nicht die Zeichnung) auf ≥ 44 px vergrößern: `werkstatt.js:1363` Anhänger-Treffer, `lesesaal.js:162` Oval-Treffer, Buch-Rect `bibliothek.js:403` breiter als der Rücken. Die Ovale als eine Gruppe binden (ein Treffer = Regal) oder nur das erste leere Oval tippbar lassen.
- **Wertschätzung:** Das Halten ist sauber: In 17 Proben hat kein Tipp mitgefeuert (Lupe blieb auf, Lampe/Kerze blieben, Sanduhr 0°, kein Blatt). Ziehen bleibt Ziehen, Wischen bleibt Wischen. Das ist die Systemarbeit, die ich mir gewünscht habe.

## Kleine Mängel (P2)
- `src/raeume/lesesaal.js:309` – das Dunkel-Rect (`url(#c6w-ls-dunkel)`) liegt über dem `c6w-ls-himmelgriff` und schluckt Pointer: **Halten auf dem Himmel feuert nie** (beide Geräte, `elementFromPoint` = klassenloses rect). `pointer-events="none"` auf das Rect, oder Griff danach zeichnen. Damit ist eins der drei „Dinge zum Denken“ im Saal nur zur Hälfte da (Sterne wandern zwar).
- `src/raeume/bibliothek.js:660` – `aria-pressed="false"` ist fest ins Markup geschrieben; nach `zeichneEcke()` ist die Lampe an, aber `aria-pressed` bleibt false (Bildschirmleser hört das Gegenteil). `String(lampeAn())` beim Zeichnen.
- `src/raeume/bibliothek.js:1445` – Fenster-Tipp sagt einen Satz; in der Werkstatt schaut Carl nur hin. Ein Ding, eine Antwort – in beiden Räumen dieselbe.
- `src/raeume/lesesaal.css:18` – `c6w-ls-platztext` 8,5 px: „Dein Platz“ ist am Computer ~7 px, am iPhone unlesbar. Entweder lesbar (≥ 11 px) oder weg (die Plakette trägt dann nichts).
- `src/kern.js` Staub-Standardfarbe Ocker (`214,160,64`) auf der Werkstattwand: bei Tag sind es orange Punkte mit Hof auf heller Wand, kein Staub (Ausschnitt `w0_ankunft_computer.png` 560–760/100–300). Orange ist im System die Senden-Farbe. Staub nur im Lichtkegel oder in Wandfarbe abgedunkelt.
- Bibliothek Computer 1100: das Buch listet fünf Bilder, an der Wand hängen vier (Perle fehlt); iPhone: zwei. Entweder Liste nach Wand filtern oder im Buch sagen, dass nicht alle an jede Wand passen.
- `src/raeume/werkstatt.js` Bau aus Bausteinen: an der Lochwand ist das Werkzeug 21 px groß, die Klötzchen sind am Computer in `w7_bau_mitten_computer.png` nicht erkennbar – der Moment findet unterhalb der Sichtbarkeit statt.
- Übergangsdauer gemessen (iPhone): Treppe ab 0,26 s, Saal bei 1,6 s, Overlay weg bei 2,8 s; Abbruch per Tipp sofort (beide Geräte). Passt zur Ansage; nur beim zweiten und dritten Mal ist es Wartezeit – ein Zähler je Sitzung (ab dem zweiten Gang die kurze Fassung) wäre der ehrlichere Gebrauch.
