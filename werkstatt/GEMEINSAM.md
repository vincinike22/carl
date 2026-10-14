# Nachtschicht Carl 6 · für alle Meister (08.10.2026, 01:15 → 07:00)

PFLICHT lesen, in dieser Reihenfolge:
1. /home/claude/carl/n6/werkstatt/VISION.md – nicos Spaziergang-Gedanken und die neue Dimension (das Wichtigste)
2. /home/claude/carl/n6/werkstatt/ENTSCHEIDUNGEN.md – was Rune für nico entschieden hat
3. /home/claude/carl/n6/werkstatt/KERN.md – der gemeinsame Vertrag (API, Zustand, wer was besitzt)
4. /home/claude/carl/werkstatt/n1/NICO_FEEDBACK_0800.md – nicos Feedback von heute Nacht (gilt weiter)
5. Faktenliste/Regeln: /home/claude/carl/werkstatt/AUFTRAG.md (Abschnitte Faktenliste + Regeln). Tokens: /home/claude/carl/werkstatt/r3/rothko/TOKENS.md. Stimme: /home/claude/carl/werkstatt/u2/shakespeare/TEXTE4.md. Alte Figur zur Inspiration: /home/claude/carl/werkstatt/u2/miyazaki/FIGUR.md + proportionsblatt.png.
Das alte Werk (/home/claude/carl/u3/proto5/*.js) ist Steinbruch zur Inspiration, nicht Grundlage. Nichts davon kopieren, was neu besser geht.

## Wie wir uns nicht stören (goldene Mitte)
- Gemeinsamer Ordner /home/claude/carl/n6. **Du schreibst NUR deine eigenen Dateien** (in KERN.md/unten steht, welche). Fremde Dateien nur lesen.
- **Kreuzungsblatt** /home/claude/carl/n6/werkstatt/KREUZUNG.md: Vor dem ersten Code hängst du deinen Abschnitt an (`cat >>`), mit deinen Dateien, den neuen C6-Namen und S-Schlüsseln und dem, was du von anderen brauchst. Lies vorher die anderen Abschnitte. Brauchst du etwas von jemandem, schreib es als Wunsch dort hinein („Wunsch an raffael: …“). Lies das Blatt jede Stunde neu und erfülle die Wünsche an dich.
- Konflikt: Baue so, dass beide Absichten bestehen. Geht das nicht, entscheidet Vitruvian. Melde es in der Rückmeldung als „Kreuzung“.
- Der Kern (src/kern.js) ist anfangs ein Platzhalter. raffael ersetzt ihn im Laufe der Nacht, die API bleibt gleich. Programmiere nur gegen die API in KERN.md, nie gegen Innereien.
- Jede Datei wird beim Bauen in try/catch gehüllt. Trotzdem: keine Konsolenfehler, keine Endlosschleifen, rAF stoppen, wenn der Raum verlassen wird.
- Klassen/IDs mit deinem Präfix: raffael `c6k-`, miyazaki `c6z-`, hokusai `c6w-`, warhol `c6s-`, jung `c6r-`, stanlee `c6p-`.

## Bauen & sehen
- Bauen: `python3 /home/claude/carl/n6/tools/bau.py` → /home/claude/carl/n6/carl6.html (fürs Artifact) + carl6-test.html (lokal). Andere bauen gleichzeitig. Das ist ok, dann einfach neu bauen.
- Für eigene Tests darfst du in deinem Ordner /home/claude/carl/n6/werkstatt/<name>/ eigene Bauten und Bilder ablegen. Zum Beispiel mit `python3 tools/bau.py /home/claude/carl/n6/werkstatt/<name>/probe.html` (schreibt aber carl6-test.html mit; ok).
- Bild: `python3 /home/claude/carl/n6/tools/bild.py iphone|computer "<JS>" <png>`. Es lädt carl6-test.html, öffnet einen Raum mit `C6.geh('werkstatt')` und gibt Konsolenfehler aus. Bilder SELBST ANSEHEN (Read). Playwright mit has_touch für Wischen.
- Ziel: iPhone 390×844 und Computer 1440×900. Tippziele ≥ 44 px, Kontrast AA, nichts überdeckt, kein seitliches Scrollen der Seite.

## Maßstab
Schönheit wie ein Kinderbuch von einem Meister: einfach, rein und lebendig. Magie statt Erklärung, keine Technikwörter, kein Zahnrad, nichts Gestricheltes, kein Text über Text. Jede Bewegung weich (Easing, kein Ruck), ohne Neuladen. Stil „Briefe“ (Papier, Tusche, Fraunces für Carls Stimme, Figtree für die Oberfläche, Caveat für Notizen). Orange nur für Handeln, die rote Nadel #d62a26 für den wahren Satz. Keine fremden Marken, Figuren oder Namen und kein Pastiche. Keine erfundenen Nutzer oder Zahlen. Keine Meisternamen im Werk.

## Rückmeldung (letzter Text, Deutsch, kompakt)
Werk (Dateien) · was neu ist gegenüber v5 · Kreuzungen · Streichungen · Erfundenes · Selbstprüfung mit Bildpfaden (iPhone + Computer) · was fehlt.
