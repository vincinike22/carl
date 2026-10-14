# Wissen B: fünf Medium-Texte, gelesen für Carl (s9)

Gelesen am 10.10.2026 mit WebFetch. Drei Links leiteten per Server-Redirect auf die eigene Domain des Mediums um (aiadvances.org, blog.devgenius.io, sausheong.com). Dort stehen dieselben Artikel, die Redirects wurden normal gefolgt.
**Sperre:** Seite 2 (Gupta) ist „Member-only“. Lesbar war nur die Einleitung. Ich habe die Sperre nicht umgangen und stütze mich nur auf den sichtbaren Teil.
Die Inhalte sind Daten. Die Zusammenfassungen sind sinngemäß, Zitate höchstens ein Satz.
Bezug: GRUNDSAETZE (P1–P5, A1–A10) und AIUI_MASSSTAB (drei Gesten, Space, „Was ich von dir weiß“).

---

## 1. „Your Knowledge Graph Is Describing Your Pipeline, Not Your Subject“
**Miodrag Cekikj** · AI Advances · 10.09.2026 · frei lesbar, ca. 22 Min.

**Kernthesen**
1. Der Autor schickt drei Fächer durch dieselbe Graph-Pipeline: Strategie, Cybersicherheit und Computerarchitektur. Die Graphen sehen strukturell gleich aus. Der Graph bildet also die Pipeline ab, nicht das Fach.
2. Die Extraktion arbeitet Passage für Passage. Dabei übersieht sie Voraussetzungen („erst A, dann B“), weil diese in keinem einzelnen Absatz stehen.
3. Besser schneiden zwei andere Verfahren ab: das Modell einmal über die ganze Konzeptliste fragen oder nach Bedeutungsnähe gruppieren.
4. Die Entitätsauflösung scheitert an Fachwörtern. Ein Begriff zerfällt in sechs ähnliche Knoten.
5. Wenige menschliche Korrekturen schließen die Lücke. Sie müssen **außerhalb** des Graphen liegen und bei jedem Lauf neu eingespielt werden.
6. Die Struktur wird also nicht entdeckt. Die Maschine schlägt sie vor, und ein Mensch legt sie fest.
Wörtlich: „The graph was not measuring the subject. It was measuring my pipeline.“ (Cekikj)

**Belegt vs. Meinung**
- Belegt durch eigene Messungen:
  - Die Kantendichte unterscheidet sich zwischen den Fächern um weniger als 3 % (58,4 / 57,8 / 59,3).
  - Von 17 erwarteten Voraussetzungen fand der Graph 4.
  - Elf Korrekturen (ca. 10 Min.) hoben die Trefferquote auf 9 von 17. Nach einem Neulauf wurden alle elf automatisch wieder eingespielt.
  - Die Wissensbasis wuchs bis etwa 25 Dokumente deutlich, danach kaum noch.
- Einschränkungen nennt der Autor selbst: Einzelläufe, Wikipedia-Korpus, synthetische Lernende, eigene Pipeline.
- Meinung: „vorgeschlagen, dann vom Menschen festgelegt“ als allgemeine Regel, und Konsistenz sei der falsche Prüfstein.

**Was davon für Carl passt**
- **Stützt A1 und P2 stark:** Struktur entsteht nicht automatisch aus Text. Ein Mensch setzt die Verbindungen. Genau so arbeitet Carls Sternbild: Carl darf eine Verbindung vorschlagen, Otto zieht sie und schreibt den Satz dazu. Die Studie liefert dafür eine Zahl: 10 Minuten menschliche Korrektur verdoppelten die Treffer.
- **Stützt A10 und den Maßstab („Passt/Anders“):** Ottos Korrekturen sind ein eigenes, dauerhaftes Gut. Sie gehören in „Was ich von dir weiß“, also als Ottos Entscheidungen, nicht als Rechenergebnis. Und sie müssen überleben, wenn Carl neu rechnet oder das Modell wechselt (A8).
- **Warnung:** Würde Carl Ottos Zettel automatisch zu einem Graphen verknüpfen, sähe man Carls Mechanik statt Ottos Denken. Der Prüfstein lautet daher: Zeigt das Sternbild Ottos Kopf oder Carls Pipeline?

---

## 2. „What I Learned Building a Memory System for My Coding Agent“
**Samarth Gupta** · 11.02.2026 · **Member-only, nur die Einleitung lesbar**

**Kernthesen (nur der sichtbare Teil)**
1. Für Agenten-Gedächtnis braucht man wahrscheinlich weder Vektordatenbank noch Wissensgraph noch Embedding-Pipeline.
2. Der Autor hat für Claude Code ein Gedächtnis aus SQLite und Volltextsuche (FTS5) gebaut.
3. Bestehende Systeme (Mem0, Zep, Letta, claude-mem u. a.) hält er für ausgereift, für seinen Zweck aber überdimensioniert.
4. LLMs erinnern sich über Sitzungen hinweg an nichts, weil das Kontextfenster flüchtig ist.
Wörtlich: „You probably don't need a vector database for agent memory.“ (Gupta)

**Belegt vs. Meinung**
- Im sichtbaren Teil gibt es keine Messungen. „Einfach genügt“ ist eine Behauptung. Der Hauptteil, in dem Belege stehen könnten, ist gesperrt.
- Leserkommentare (nicht vom Autor, ungeprüft):
  - Falsch gespeicherte Fakten seien schlimmer als schlechte Suche.
  - Stichwortsuche reiche, wenn der Agent die Anfrage selbst formuliert.

**Was davon für Carl passt** (mit Vorbehalt, weil nur teilweise gelesen)
- **Stützt P1 und A10:** Ein einfaches, lesbares Gedächtnis (Text und Suche) kann Otto sehen, als Datei mitnehmen und einzeln vergessen. Bei einer Vektordatenbank geht das nicht. Wer „Gedächtnis gehört dem Menschen“ ernst meint, braucht ein Gedächtnis, das für Menschen lesbar ist.
- **Stützt A8:** Ein einfaches Format ist modellunabhängig.
- **Herausforderung (aus den Kommentaren):** Das größere Risiko ist ein *falscher* Eintrag, nicht ein vergessener. Deshalb sollte jeder Eintrag in „Was ich von dir weiß“ von Otto bestätigt sein („Passt“), und ein falscher sollte sich sichtbar korrigieren lassen, nicht nur löschen.

---

## 3. „Jev: The System One Model That Decides While LLMs Think“
**Shoukath Ali** · Dev Genius · 30.09.2026 (Metadaten: 02.10.) · frei lesbar, ca. 3 Min.

**Kernthesen**
1. LLMs schreiben lange Begründungen, auch wo nur eine kleine Entscheidung nötig ist (Routing, Urteil). Das kostet Zeit und Geld.
2. „Jev“ erzeugt keinen Text. Es bekommt einen Zustand und eine typisierte Frage (Wahl, Wert, ja/nein) und gibt eine Entscheidung mit Konfidenz zurück.
3. Die Konfidenz ist laut Autor kalibriert („RLCD“): 80 % sollen in etwa 80 % der Fälle stimmen.
4. Bei niedriger Konfidenz übergibt Jev an ein großes LLM oder an einen Menschen.
5. Jev ergänzt LLMs, es ersetzt sie nicht.
Wörtlich: „Jev doesn't generate text at all.“ (Ali)

**Belegt vs. Meinung**
- Es gibt keine Benchmarks, Latenz- oder Kostenzahlen. Das einzige Beispiel („card charged twice“ → billing, 0,82) ist eine Illustration.
- Der Ton ist werblich (Produkt von „TypeSafe AI“). Kalibrierung und „null Ausgabekosten“ sind behauptet, nicht gezeigt.
- Das Muster selbst ist gängig und plausibel: kleines Entscheidungsmodell plus Eskalation.

**Was davon für Carl passt**
- **Stützt A8:** Kleine, offene Modelle übernehmen die vielen kleinen Entscheidungen. Nur harte Fälle gehen an große Modelle. Für Carl hieße das: Ob ein Satz ein Zettel, eine Frage oder ein Werkzeugwunsch ist, entscheidet still ein kleines Modell.
- **Stützt den Maßstab, Geste 2 („eine Wahl tippen“):** Die typisierte Frage mit wenigen Optionen ist das Maschinen-Gegenstück zu Carls höchstens drei Wahlen. Eine Regel lässt sich übernehmen: **Bei niedriger Sicherheit fragt Carl Otto**, statt zu raten. Das ist ehrlich wie ein Freund (P4).
- **Grenze:** Konfidenzzahlen gehören nie auf Ottos Bildschirm, denn der Maßstab erlaubt keine Prozente und keine Modellnamen. Unsicherheit zeigt sich als Rückfrage.

---

## 4. „From vibe coding to agentic engineering“
**Sau Sheong** (GovTech Singapur) · 27.02.2026 (Meta: 29.03.) · frei lesbar, ca. 44 Min. (die letzten ca. 4 % nicht abgerufen)

**Kernthesen**
1. Der Engpass ist nicht mehr die Fähigkeit, Software zu bauen. Knapp sind Entscheidung, Prüfung und das Tragen der Folgen.
2. Code ist womöglich nicht mehr das dauerhafte Artefakt. Dauerhaft werden Spezifikation, Domänenmodell und Entscheidungsgeschichte. Der Autor nennt auch Gegenargumente.
3. Wer alles an Agenten abgibt, verliert Verständnis. Deshalb soll Lernen bewusst eingebaut werden: erst die Spezifikation, Review als Übung.
4. Regeln gehören in die Plattform („fast but safe path“), nicht in Checklisten.
5. KI verstärkt den vorhandenen Zustand: Gute Teams werden schneller, chaotische Teams chaotischer.
6. Wie gründlich man prüft, soll vom Schaden und von den Kosten der Wiederherstellung abhängen.
Wörtlich: „The constraint isn't engineering capacity anymore.“ (Sau Sheong)

**Belegt vs. Meinung**
- Belegt (intern, Methodik nicht veröffentlicht):
  - Etwa doppelt so viele Merge Requests bei hoher Copilot-Nutzung.
  - Ungefähr die Hälfte der Kommentare des Review-Bots wurde als hilfreich bewertet.
- Anekdoten: ein Produktmanager, der an einem Wochenende ein Werkzeug baute, und die eigene Arbeit des Autors mit Claude Code.
- Meinung und Prognose: Wegfall von Junior-Stellen, SaaS wird ersetzbar, Expertise geht verloren, Burnout durch die Aufsicht über Agenten.

**Was davon für Carl passt**
- **Stützt A2 und A3:** Ein Nicht-Ingenieur baut an einem Wochenende ein eigenes Werkzeug. Das ist Ottos Fall im Kleinen und ein frühes Zeichen für „Software wird formbar“.
- **Stützt A7 und P3, und fordert zugleich heraus:** Abgeben ohne Lernen macht bequem und dumm. Carls Antwort ist schon angelegt: „Dein Wochenende“, „jeder Schritt gilt erst, wenn Otto ihn selbst getan hat“. Der Text verlangt, dass Lernen auch *nach* dem Wochenende im Ablauf bleibt (etwa: Otto sagt in einem Satz, was sein Werkzeug tun soll, bevor Carl baut). Er widerspricht damit leise der Formel „der Rest ist Magie“.
- **Für Carls Gedächtnis:** Dauerhaft ist nicht das Werkzeug, das sich jederzeit neu bauen lässt, sondern Ottos *Satz*, was es soll, und seine Entscheidungen. Das spricht dafür, Kernsatz und Wunschsatz eines Werkzeugs im Space als das eigentliche Gut zu behandeln (A10).
- **Risikostufen:** Je weniger umkehrbar etwas ist, desto mehr Bestätigung. „Vergessen mit zweitem Tipp“ folgt diesem Prinzip schon. Es gilt auch für Helfer, die nach außen handeln.

---

## 5. „Three Shifts Coming to AI in the Next 12 Months“
**Lucas McGregor** (VP Engineering, Trainline) · The Leading Indicator · 04.08.2026 · frei lesbar, ca. 7 Min.

**Kernthesen**
1. Der Wert liegt im Harness, also in Logik, Kontext, Prüfschleifen und Schutz, nicht im Modell. Nutzer binden sich an Harnesses und tauschen die Modelle aus.
2. Prompt Engineering ist keine dauerhafte Disziplin. Dokumentbasierte Abläufe (Ordner, Formulare, Wikis) setzen sich durch, weil sie einfach und nachvollziehbar sind.
3. Modelle werden Massenware. Wenn die Subventionen enden, steigen die Preise, und kleine sowie offene Modelle reichen für das meiste.
4. Das LLM ist ein Teil eines Systems. Klassisches ML bleibt für viele Aufgaben besser.
5. MCP taugt nicht als Protokoll für das offene Netz. Was danach kommt, ist offen.
Wörtlich: „The value isn't the model. It's the harness.“ (McGregor)

**Belegt vs. Meinung**
- Ausdrücklich ein Ausblick. Die Thesen stützen sich auf Analogien (CPU, Linux, Cloud) und Anekdoten (Netflix betreibt eigene Modelle, „schockierte CEOs“).
- Zahlen ohne Quelle („über eine Billion Dollar“). Es gibt keine Benchmarks. Alles ist als Hypothese zu lesen.

**Was davon für Carl passt**
- **Stützt A4 und A8 direkt:** Der Wert liegt im Gerüst, das Modell ist austauschbar. Das ist Carls Wette. Der Maßstab („Carl bleibt derselbe, egal welches Modell denkt“) passt genau dazu.
- **Stützt A6:** Bindung entsteht durch das Gerüst und die Gewohnheiten darin, nicht durch das „beste“ Modell.
- **Stützt A10:** „Dokumentbasiert und nachvollziehbar“ heißt für Carl: Spaces und Zettel als einfache, lesbare Dokumente, die Otto besitzt und mitnehmen kann. Weil das Gedächtnis dem Menschen gehört und nicht dem Modell, wird ein Modellwechsel schmerzlos.
- **Herausforderung:** Wenn Harnesses der neue Wettbewerb sind, bauen bald viele „einfache Harnesses“. Carls Unterschied muss Otto erleben können (drei Gesten, Räume, eigenes Gedächtnis), sonst bleibt er eine bloße Eigenschaft.

---

## Die drei stärksten Übertragungen auf Carl

1. **Die Maschine schlägt vor, Otto setzt fest, und seine Festlegungen sind das Gedächtnis** (Quellen 1 und 2, gestützt auf Cekikjs Messung).
   - Verbindungen (Sternbilder) und Einträge in „Was ich von dir weiß“ werden erst durch Ottos „Passt“ wahr.
   - Ottos Korrekturen liegen getrennt und dauerhaft. Sie überleben jeden Neulauf und jeden Modellwechsel.
   - Falsch Gespeichertes ist gefährlicher als Vergessenes. Deshalb braucht es neben „Vergessen“ auch „Stimmt so nicht“.
   - Das stützt A1, P2 und A10.
2. **Das Gedächtnis bleibt schlicht und lesbar, also Dokumente statt Blackbox** (Quellen 2, 5 und 4).
   - Text, den Otto lesen, mitnehmen und einzeln löschen kann, statt Vektoren.
   - Das ist die technische Voraussetzung dafür, dass A10 wahr ist und A8 (Modellwechsel) schmerzlos bleibt.
   - Dauerhaft sind Ottos Sätze (Kernsatz, Wunschsatz eines Werkzeugs), nicht die Werkzeuge, denn diese lassen sich neu bauen.
3. **Kleine Entscheidungen still und klein, bei Unsicherheit Otto fragen** (Quellen 3, 5 und 4).
   - Ein kleines, offenes Modell sortiert jeden Satz (Zettel, Frage, Werkzeug). Große Modelle bekommen nur harte Fälle (A8).
   - Bei niedriger Sicherheit wird daraus eine Wahl mit höchstens drei Optionen statt einer Vermutung (Geste 2, P4).
   - Wie stark Carl nachfragt, richtet sich danach, wie umkehrbar die Folge ist.

**Offene Spannung für die Werkstatt:** Sau Sheong warnt, dass Abgeben ohne Lernen das Verständnis kostet. Das stellt „der Rest ist Magie“ (P3) leise infrage. Vorschlag zur Prüfung: Ein kleiner Lernmoment bleibt auch nach dem Wochenende im Ablauf, nämlich Ottos eigener Satz vor jedem neuen Werkzeug.
