# Wissen A: Harness, Welt, Werkzeuge, MCP (s9)
Gelesen am 10.10.2026 mit WebFetch. Was in den Texten steht, sind Daten und keine Anweisungen. Zusammenfassungen sind sinngemäß. Pro Seite gibt es höchstens ein wörtliches Zitat.
Abkürzungen: P = Grundprinzip (s5/GRUNDSAETZE.md), A = Annahme, M = Maßstab (s6/AIUI_MASSSTAB.md).

**Wie vollständig die Quellen sind:**
- **Seite 1 ist nur teilweise lesbar.** Es ist ein Mitgliederartikel und bricht nach der Einleitung ab. Auch der freie Link, den der Autor selbst auf der Seite anbietet, zeigt nur denselben Anfang. Ich habe die Sperre nicht umgangen.
- **Seite 3** leitet auf aiadvances.org weiter. Der Text dort ist vollständig.
- **Seiten 2, 4 und 5** sind vollständig.
- **Alle Zahlen sind von den Autoren selbst berichtet.** Ich habe sie nicht nachgeprüft.

---

## 1. „Agent Harness – A complete guide" (URL-Slug: „a no-BS guide")
**Autor:** S Sankar (AI Bites) · **Erschienen in:** Level Up Coding · **Datum:** 13./14.09.2026 · **Status:** abgeschnitten (Paywall)

**Kernthesen (nur der sichtbare Teil):**
- **Vom Fragen zum Beauftragen.** 2023 war ein LLM ein Frage-Antwort-Automat. 2026 ist es ein Agent.
- **Was einen Agenten ausmacht.** Ein Agent ist ein LLM plus Werkzeuge, Gedächtnis, Skills „und vieles mehr". Diese Zusätze nennt der Autor 2026 „unvermeidlich".
- **Das Modellrennen ist gesättigt.** Der Wettbewerb verschiebt sich zu Denken und Kontext. Hier bricht der Text ab.
- **Kein Rahmen sichtbar.** Eine Definition des Harness und eine Liste seiner Bausteine sind nicht zu sehen.
- **Leserkommentare** (keine Aussagen des Autors): Abbruchregeln, Kostenbudgets gegen endlose Agentenschleifen und Checkpoints bei langen Läufen.

**Zitat:** „All these add-ons are what make a simple LLM an AI agent."

**Belegt oder Meinung?** Fast alles ist Meinung oder Rahmung. Die Benchmarks MMLU und SWE-bench werden nur genannt, ohne Zahlen. Quellen gibt es im sichtbaren Teil keine.

**Für Carl:**
- **Stützt A4.** Der Harness bündelt Werkzeuge, Gedächtnis und Skills. Genau diese Schicht soll Carl für Otto unsichtbar machen.
- **Stützt A8.** Wenn das Modellrennen gesättigt ist, entscheidet die Hülle und nicht das Modell.
- **Aus den Kommentaren, für Helfer Ferdl übertragbar:** Jeder Helfer-Auftrag sollte ein Budget und eine Abbruchregel haben. Bei langen Läufen gehört ein Zwischenstand in den Space (Checkpoint als Zettel).
- **Wert insgesamt gering**, weil der Text abgeschnitten ist. Ich empfehle, ihn nicht als Beleg zu zitieren.

---

## 2. „The Harness Is the Product: How Agents Are Actually Built in 2026"
**Autor:** Andrii Tkachuk · **Erschienen in:** Data Science Collective · **Datum:** 02.10.2026 · **Status:** vollständig

**Kernthesen:**
1. **Das Produkt ist der Harness.** Das Modell ist der Motor. Das Produkt entsteht in der Hülle aus Kontext, Gedächtnis, Rechten, Ausführung, Freigaben und Beobachtbarkeit.
2. **Werkzeuge schrittweise entdecken.** Es werden nicht alle Werkzeuge vorab geladen. Der Autor ordnet sie in vier Schichten: Operation (eine Absicht), Tool (eine atomare Aktion), Skill (ein Ablauf), Capability (eine Gruppe von Integrationen). Das Modell sucht und lädt nur, was die Aufgabe braucht.
3. **Gedächtnis braucht eine eigene Architektur.** Arbeitskontext, dauerhaftes Gedächtnis und Abruf werden getrennt. Das Verdichten läuft asynchron. Gedächtnis hat einen Geltungsbereich (Person, Arbeitsraum, Projekt, Skill), damit eine persönliche Vorliebe nicht stillschweigend zur Regel für alle wird.
4. **Für Auswahl reicht oft ein kleines Modell.** Routing, Klassifikation und Reranking brauchen kein generatives Modell. Der Autor nennt Jev als Beispiel, empfiehlt es aber ausdrücklich nicht.
5. **Code ausführen statt Klicks.** Das Modell schreibt Programme, die Werkzeuge gebündelt aufrufen. Die Sandbox ist sein „Arbeitsrechner". Browser-Automation ist nur die Notlösung, wo es keine API gibt.
6. **Zugangsdaten und Regeln liegen außerhalb des Modells.** Das Modell äußert nur eine Absicht. Ein Gateway stuft das Risiko ein, und der Harness löst die menschliche Freigabe aus, nicht das Modell nach eigenem Ermessen.
7. **Die Oberfläche ist austauschbar.** Slack, WhatsApp oder Sprache sind nur Adapter auf dieselbe Laufzeit.

**Zitat:** „The model is the engine, the surface is just a door, and the harness is where the product actually lives."

**Belegt oder Meinung?**
- **Belegt, mit Quellen:** Marktmeldungen, etwa Viktor mit 75 Mio. $ Series A und mehr als 3.000 Integrationen, „dots" von OpenAI und „Muse" von Meta.
- **Meinung:** der Zwölf-Teile-Rahmen und alle Architektur-Empfehlungen.
- **Nur zur Veranschaulichung:** die Code-Beispiele. Eigene Messungen gibt es keine.

**Für Carl:**
- **Stützt A4 und A8 direkt.** Carls Wert ist der Harness, den Otto nie sieht. Das Modell steht laut M auf genau einer Seite im Freundschaftsbuch.
- **Fordert eine Annahme heraus.** Die These „die Oberfläche ist nur eine Tür" widerspricht Carls Anspruch, mit der Oberfläche (AIUI) den Maßstab zu setzen. Daraus folgt eine Schärfung: Carl gewinnt nur, wenn Oberfläche *und* Harness eins sind. Die drei Gesten müssen echte Harness-Funktionen auslösen, etwa „Passt/Anders" als Freigabe-Gateway.
- **Gedächtnis (A10):** Das Scoping überträgt sich 1:1 auf „Was ich von dir weiß". Jedes Wissen sollte zeigen, wo es gilt: nur für dich, nur für diesen Space, nur für dieses Werkzeug. Verdichten heißt dann, dass Carl abends Zettel zusammenfasst. Das geschieht sichtbar und erst nach Ottos Ja (P4).
- **„Passt/Anders" als Risikostufe:** Riskante Aktionen von Helfer Ferdl (senden, löschen, bezahlen) lösen immer eine Frage aus. Das ist Harness-Regel, nicht die Laune des Modells. Das macht das Versprechen „erst fragen, dann ändern" technisch belastbar.
- **Die „/"-Liste als schrittweise Entdeckung:** Otto sieht nur wenige passende Werkzeuge pro Space, nie alle.
- **Kleines Modell für Auswahl:** Das stützt A8 (offene oder kleine Modelle für Routing, Frontier-Modelle nur für Hartes).

---

## 3. „Design the World Your Agent Has to Think In"
**Autor:** Miodrag Cekikj · **Erschienen in:** AI Advances (weitergeleitet auf aiadvances.org) · **Datum:** 04.09.2026 · **Status:** vollständig

**Kernthesen:**
1. **Gleiche Fakten heißt nicht gleiche Nutzbarkeit.** Ein begrenzter Agent mit wenigen Zügen, Werkzeugen und Tokens kann dieselben Fakten in schlechter Form nicht verwenden.
2. **Von den Fragen rückwärts entwerfen.** Die Wissensstruktur (der Graph) richtet sich nach den Fragen, die der Agent beantworten soll, und nach seinem Budget, nicht nach dem Organigramm der Daten.
3. **Was eine Frage benennt, wird ein eigener Knoten.** Was in Eigenschaften vergraben ist, findet der Agent praktisch nicht.
4. **Namen sind die API des Agenten.** Gemeint sind Kanten- und Typnamen. Verbphrasen mit genau einer Bedeutung helfen ihm, das richtige Werkzeug zu wählen.
5. **Eine Kante, eine Aufgabe.** Bequeme Abkürzungsfelder können die echte Struktur verdecken, etwa ein Feld „aktueller Status" statt der Ereignisse.
6. **Abwesenheit ausdrücklich modellieren.** Das Wissen, dass etwas *nicht* da ist, muss auffindbar sein. Weigerungen werden zusammen mit der Genauigkeit bewertet.
7. **Messen und Überarbeiten.** Der Entwurf ist eine Schleife aus beidem; die Schleife ist das eigentliche Ergebnis.

**Zitat:** „factual equivalence does not imply operational equivalence for a bounded reasoner."

**Belegt oder Meinung?**
- **Belegt** durch ein kleines eigenes Experiment: 32 Fragen, synthetische Daten, Cosmos DB, Foundry-Agenten, Gesamtkosten 3,14 $.
- **Weigerungen:** Das naive Design hat 28 von 81 beantwortbaren Fragen fälschlich abgelehnt, das entworfene nur 9.
- **Der Gesamtunterschied liegt im Rauschen.** Bei der Zeitachse gewann sogar das naive Design, wegen eines irreführenden Status-Felds.
- **Großes Modell:** Es ist fast gleich genau, braucht mit Design aber weniger Tool-Aufrufe (5 statt 9) und ist günstiger (1,13 $ statt 1,66 $).
- **Der Autor begrenzt selbst:** eine Domäne, eine Modellfamilie, kleine Daten. Dass das Ergebnis verallgemeinerbar ist, ist Meinung.

**Für Carl:**
- **Stützt A1.** Der Wert liegt darin, dass Gedanken sichtbar und verbunden sind. Carls Welt aus Space, Zettel, Sternbild und Werkzeug ist genau so eine „Welt, in der der Agent denkt". Sie sollte so gebaut sein, dass Carl seine Fragen darin beantworten kann.
- **„Ein Ding, ein Name" (NAMEN.md) ist auch Agenten-Design.** Dieselben eindeutigen Namen, die Otto hilft, helfen dem Modell (Kernthese 4). Daraus folgt eine Regel: Interne Datentypen und Relationen tragen Ottos Wörter, als Verben, etwa „hängt in", „verbindet", „gehört zu".
- **Gedächtnis:** In „Was ich von dir weiß" sollten Personen, Orte und Vorhaben eigene Knoten sein, nicht Fließtext.
- **Kein „Stand"-Feld, das die Geschichte überschreibt.** Der Verlauf eines Spaces bleibt als Zettelfolge erhalten (Kernthese 5).
- **Stützt P4 „Ehrlich wie ein Freund".** Abwesenheit muss modelliert sein: „Darüber weiß ich nichts von dir" ist eine echte, prüfbare Antwort.
- **Weigerung und Treffer zusammen messen.** Carl sollte nicht nur „erfindet nichts" einhalten. Er darf auch nicht zu oft „weiß ich nicht" sagen, wenn die Antwort im Space hängt.
- **Stützt P5.** Messen und Überarbeiten als Schleife passt zu „Fertig ist erst, was für die Ewigkeit ist".

---

## 4. „What if an AI Agent Could Grow Its Own Tools?"
**Autor:** Owen Zanzal · **Erschienen in:** DevOps<>AI · **Datum:** 08.10.2026 · **Status:** vollständig

**Kernthesen:**
1. **Eine lebende Welt statt Shell-Skripte.** Agenten sollten in einer dauerhaften Programmierumgebung arbeiten (einer REPL, im Projekt „bba", Clojure), nicht in einer Shell mit Wegwerf-Skripten. Was der Agent definiert, bleibt bestehen und lässt sich wiederverwenden, ändern und kombinieren.
2. **Zwei Operationen genügen.** `develop_form` ändert eine Definition, `execute_form` führt sie aus.
3. **Denken baut Fähigkeiten, Code nutzt sie wieder.** Inferenz ist Budget. Sie sollte nicht für dasselbe immer wieder ausgegeben werden.
4. **Die Welt bewahrt Fähigkeiten unabhängig vom Gesprächsverlauf.** Die Fähigkeiten überleben Zusammenfassung oder Verlust des Gesprächs.
5. **Checkpoints und Invarianten machen Selbstveränderung beherrschbar.** Bei einem Fehler wird der letzte akzeptierte Stand wiederhergestellt. Invarianten (muss wahr bleiben) sind getrennt von Zielen (soll wahr werden).
6. **Bewährte Fähigkeiten wandern in den Harness.** Ein Hilfswerkzeug zum Verdichten wurde nachträglich in den Harness übernommen. Laut Autor geschah das durch einen Entwickler, nicht autonom.
7. **Offen bleiben:** Sandbox, Nebenwirkungen nach außen, Abbrechen, Speichern des Zustands, Skalierung.

**Zitat:** „Use inference to create capabilities. Use code to reuse them."

**Belegt oder Meinung?**
- **Belegt** mit selbst erhobenen Logs aus *einem* Spike-Projekt:
  - 2.314 Operationen im Verhältnis von etwa 1:11 (Entwickeln zu Ausführen)
  - 44 und 27 lebende Funktionen in zwei Welten
  - Wiederherstellung in 6 bis 147 ms, 43 Lint-Abweisungen, 26 Timeouts
- **Kein kontrollierter Vergleich.** Der Autor sagt selbst, dass sich die Token-Ersparnis nicht belegen lässt.
- **Meinung:** dass Lisp besser passt und dass dies „der nächste Schritt" ist.

**Für Carl:** Das ist der stärkste Text für Carl.
- **Stützt A2 und P2 („baut mit dir die Werkzeuge").** Ottos Werkzeuge sind genau solche lebenden Funktionen in einer Welt. Sie bleiben im Space, auch wenn das Gespräch vergessen ist. Otto baut einmal mit Carl (Inferenz) und benutzt dann ohne Modell (Code). Das ist auch günstig (A8) und funktioniert offline.
- **Zwei Operationen = zwei Gesten.** „Bauen/Ändern" und „Benutzen" sind Ottos Pendant zu develop/execute. Das ist eine gute Probe für den Maßstab: Ein Werkzeug kennt nur „Anders" (ändern) und „Tippen" (benutzen).
- **Checkpoints machen „Anders" angstfrei.** Jede Änderung an einem Werkzeug wird erst mit „Passt" wahr. Vorher gilt die letzte akzeptierte Fassung. Ein „Zurück zur alten Fassung" ist dann geschenkt (P4: erst fragen, dann ändern).
- **Invarianten für Ottos Werkzeuge.** Ein Beispiel: „Der Zähler verliert nie Einträge." Carl prüft das vor jeder Änderung.
- **Ehrliche Grenze (P4).** Wiederherstellen macht äußere Wirkungen nicht rückgängig, etwa eine gesendete Nachricht. Für Helfer Ferdl heißt das: Alles, was die Welt verlässt, braucht vorher ein „Passt".
- **Vom Space in die Werkstatt.** Bewährte Werkzeuge können vom Space ins gemeinsame Regal wandern (Teilen per Teleskop). Das passt zum Teil von A2, das in A2 aufgegangen ist („Teilen von Denkwerkzeugen").

---

## 5. „MCP Is Dead" (Untertitel: „Dropping MCP")
**Autor:** Lucas McGregor · **Erschienen in:** The Leading Indicator · **Datum:** 25.05.2026 laut Byline, 22.06.2026 laut Metadaten · **Status:** vollständig

**Kernthesen:**
1. **MCP ist für den lokalen Gebrauch gebaut.** Ein Agent ruft Werkzeuge auf derselben Maschine auf, in einem vertrauten Umfeld. MCP sollte das lokale Netz nicht verlassen.
2. **APIs lösen das Schwere.** Gemeint ist die Verbindung zu Systemen, die man nicht kontrolliert: Authentifizierung, Rechte, Ratenlimits, Versionierung, Audit, Dienstgüte.
3. **MCPs echte Stärke ist Plug-and-play mit dynamischer Entdeckung.** Für schnelle interne Nutzung räumt der Autor das als wertvoll ein.
4. **Die Schemata kosten viel Kontext.** Laut Perplexity verbrauchen sie 72 % des Kontextfensters, bevor die erste Anfrage läuft.
5. **Das Verbindungsmodell skaliert nicht.** Es hält eine dauerhafte Verbindung offen und hat kein Failover.
6. **Sicherheit ist nachgerüstet.** Knostic fand 1.862 offen erreichbare MCP-Server. Alle 119 manuell geprüften zeigten ihre Werkzeuglisten ohne Anmeldung.
7. **Empfehlung:** MCP lokal lassen und über Vertrauensgrenzen hinweg A2A oder OpenAPI/REST nutzen.

**Zitat:** „MCP is a hack, a naive protocol that should never leave your local network."

**Belegt oder Meinung?**
- **Belegt, aber ohne Link oder Methodik:** die Perplexity-Zahl und die Knostic-Zahlen. Dazu kommen Anekdoten aus dem eigenen Team.
- **Meinung und Polemik:** „dead", „hack", „time bomb".
- **Gegenstimme:** Seite 2 nutzt MCP weiter und löst das Kontextproblem mit schrittweiser Entdeckung. Der Titel ist also zugespitzt.

**Für Carl:**
- **Verbindung zu Claude Code (Sonntag: „Wo Carl wohnt") und Helfer Ferdl.** Der Text stützt eine klare Trennung:
  - **Lokal:** Carl auf Ottos Computer spricht mit Claude Code und lokalen Werkzeugen per MCP. Das ist der Fall, für den MCP gebaut ist.
  - **Über das Internet:** Mail, Kalender und fremde Dienste gehen über ein Gateway mit echter Anmeldung und Ottos Freigabe, nicht über offene MCP-Server.
- **Stützt P4 und A10 (Gedächtnis gehört dir).** Ottos Gedächtnis darf nie hinter einem ungeschützten Werkzeug-Endpunkt liegen.
- **Kontextkosten = Ottos Wartezeit und Geld.** Das stützt die Linie „wenige Werkzeuge pro Space" (siehe Seite 2) und A8 (kleine oder offene Modelle haben kleinere Fenster).
- **Bekräftigt A4.** Das Protokoll wird sich ändern. Carl darf MCP deshalb nie sichtbar machen (Namensverbot „Tool"/„Harness" in M). Unter der Haube bleibt es austauschbar wie das Modell.

---

## Die drei stärksten Übertragungen auf Carl
1. **Ottos Werkzeuge sind lebende Funktionen in seinem Space, nicht Gesprächsergebnisse** (Seite 4, gestützt von Seite 2).
   - Einmal mit dem Modell bauen, dann ohne Modell benutzen.
   - Jede Änderung ist ein Checkpoint, der erst mit „Passt" gilt. „Zurück zur alten Fassung" geht immer.
   - Invarianten schützen Ottos Daten.
   - Das macht A2 und P2 technisch wahr und spart Rechenleistung (A8).
2. **„Passt/Anders" ist das Freigabe-Gateway des Harness, nicht nur eine UI-Geste** (Seite 2, ergänzt durch Seite 5).
   - Riskante oder nach außen wirkende Aktionen von Helfer Ferdl (senden, löschen, bezahlen, fremde Dienste) lösen immer eine Frage aus, nach Regel und nicht nach Ermessen des Modells.
   - MCP nur lokal, etwa zu Claude Code auf Ottos Rechner. Über das Internet geht es mit echter Anmeldung über ein Gateway.
   - Damit ist P4 („erst fragen, dann ändern") technisch abgesichert, und die Oberfläche und der Harness werden eins. Das ist auch die Antwort auf die These „die Oberfläche ist nur eine Tür".
3. **Carls Welt so bauen, dass Carl darin denken kann** (Seite 3, mit Seite 2 zum Gedächtnis).
   - Die Namen aus NAMEN.md gelten auch intern als eindeutige Typen und Relationen.
   - Personen und Vorhaben werden eigene Knoten. Die Geschichte bleibt als Zettelfolge und wird nicht von einem Statusfeld überschrieben.
   - Gedächtnis hat einen sichtbaren Geltungsbereich (du, Space, Werkzeug).
   - „Darüber weiß ich nichts" ist modelliert und wird geprüft. Gemessen werden Treffer *und* falsche Weigerungen.
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
# Wissen C · Lokale Modelle, Sprecher-Erkennung, Sicherheit
Wissensauftrag für Vitruvians Werkstatt (Projekt Carl). Gelesen am 10.10.2026.
Alle Seiten wurden normal geladen, keine war gesperrt. Die OWASP-Seite selbst enthält die Liste nicht. Ich habe sie aus dem dort verlinkten offiziellen Download gelesen (genai.owasp.org/download/56857/).
Bezug: GRUNDSAETZE.md (s5): Annahme 8 (offene Modelle, Carl ist modellunabhängig), Annahme 9 (Dinge zum Anfassen), Annahme 10 (das Gedächtnis gehört dem Menschen), Prinzip 4 (ehrlich wie ein Freund).

---

## 1 · Der 8-GB-Test (INROOM AI)
- **Titel:** „Der 8-GB-Test: nicht zu dumm, zu unzuverlässig“
- **Herausgeber:** INROOM AI, Wien. Die Firma verkauft private, lokale KI. Kein Autor genannt.
- **Datum:** 14.09.2026

**Kernaussagen (gemessen):**
1. **Aufbau:** Laptop mit RTX 4060 und 8 GB (8.188 MiB nutzbar), dazu Ollama 0.30.11, llama.cpp und Hermes Agent, 64k Kontext mit q4_0-KV-Cache. Getestet wurden drei erfundene Büroaufgaben aus einer Arztpraxis, darunter eine mit **versteckter Prompt-Injection**. Jede Aufgabe gibt 100 Punkte, und „bestanden“ heißt, dass alle kritischen Prüfungen erfüllt sind.
2. **Auf 8 GB hat kein Modell im ersten Durchgang alles bestanden** (9 Läufe). Am besten war Qwen3.5 9B (Q4_K_M) mit den Einstellungen der Modellkarte: Ø 81,7 Punkte, 26,6 tok/s, 5.813 MiB VRAM. Mit eigenen Einstellungen kam dasselbe Modell nur auf Ø 41,7 Punkte.
3. **Die übrigen Modelle auf 8 GB:**
   - Gemma 4 E4B: 55,0 Punkte, aber nur 5,8 tok/s
   - Gemma 4 E2B: 40,0 Punkte, 61,9 tok/s, nur 1.664 MiB
   - LFM2.5 8B: 10,0 Punkte, 83,4 tok/s
4. **Zum Vergleich die 16-GB-Box:** Qwen3.8 27B (UD-IQ3_S) erreicht Ø 93,3 Punkte (280/300), 23,7 tok/s und braucht 15.585 MiB.
5. **Unzuverlässig:** Dieselbe Qwen-Einstellung bekam in Aufgabe 2 einmal 100, einmal 10 und einmal 30 Punkte. Aufgabe 1 brauchte bei gleicher Punktzahl 54 s, 83 s und 650 s.
6. **Einstellungen zählen viel:** Mit den Sampling-Werten der Modellkarte stieg Qwen 9B von 125 auf 245 Punkte. repeat_penalty 1,0 statt 1,1 hob Aufgabe 3 von 35 auf 100. Windows-Desktop und Browser belegen über 1 GB VRAM (Brave allein 861 MiB).

**Belegt oder Meinung:** Die Zahlen sind gemessen, aber meist nur **einmal**. Die Autoren sagen selbst, dass Unterschiede unter etwa 15 Punkten Rauschen sein können. Der Prüfer vergleicht nur Dateien, nicht die Qualität des Deutschen und nicht, ob Daten nach außen gehen. Meinung ist der Satz „scheitern eher an Ausdauer als am Denken“. Dahinter steht auch ein **Geschäftsinteresse**, denn der Bericht wirbt für die eigene 16-GB-Box. Die Autoren nehmen ihre frühere Überschrift („die 8-GB-Grenze“) selbst teilweise zurück, das spricht für ihre Redlichkeit.

**Was davon für Carl passt (Annahme 8):**
- **Bis 8 GB VRAM** (übliche Gaming-Laptops, z. B. Fall 2 und 3 in GERAETE.md): Ein 9B-Modell wie Qwen3.5 9B (Q4) läuft. Für einfache, kurze Aufgaben reicht es: Notizen ordnen, zusammenfassen, Entwürfe schreiben. Für mehrstufige Werkzeug-Abläufe ist es **nicht verlässlich**. Carl sollte dort mit Zeitgrenze arbeiten, einen neuen Versuch starten und offen zeigen, was gerade passiert, und Otto ehrlich sagen: „Das kann dauern oder misslingen“ (Prinzip 4).
- **Ab 16 GB** (Grafikkarte mit 16 GB oder eine eigene kleine KI-Box): Erst hier wird ein 27B-Modell wie Qwen3.8 27B (Q3) zuverlässig, mit rund 93 von 100 Punkten. Das ist realistisch die **untere Grenze** für „Carl arbeitet lokal allein“.
- **Handy und kleine Geräte:** Gemma 4 E2B braucht nur 1,7 GB und ist schnell, kam aber nur auf 40 Punkte. Es taugt höchstens für Vorsortieren und Kurzantworten, nicht für Bauaufgaben.
- **Für Ottos Alltag:** Carl stellt die Werte der Modellkarte selbst ein und lässt Otto damit nicht allein. Vor dem lokalen Rechnen schlägt Carl vor, den Browser zu schließen. Harte Aufgaben gehen an ein Frontier-Modell, genau wie Annahme 8 es sagt. Das alles bleibt ehrlich als Messung **eines** Anbieters gekennzeichnet.
- **Nicht übertragbar:** Macs mit gemeinsamem Speicher (Apple Silicon) wurden nicht getestet. Für Fall 1 und 6 in GERAETE.md fehlt also ein Beleg. Ungeprüft.

---

## 2 · Nemotron 3 Diarization (NVIDIA, Hugging Face)
- **Titel:** nvidia/Nemotron-3-Diarization, Modellkarte
- **Herausgeber:** NVIDIA
- **Datum:** veröffentlicht am 23.09.2026, zuletzt aktualisiert am 24.09.2026
- **Lizenz:** OpenMDW-1.1, laut Karte „ready for commercial or non-commercial use“
- **Gelesen:** über das Hugging-Face-Werkzeug (Übersicht und README)

**Kernaussagen (aus der Modellkarte):**
1. **Aufgabe:** Das Modell erkennt, **wer wann spricht**, bei bis zu **8 Sprechern**. Es läuft fortlaufend oder nachträglich, und Aufnahmen können beliebig lang sein. Es transkribiert **nicht** selbst. Dafür wird es mit einer Spracherkennung (ASR) kombiniert.
2. **Klein:** rund **100 M Parameter** (99,2 M), ein Transformer mit 31 Schichten. Eingabe ist Mono-Audio mit 16 kHz (wav, flac, opus, mp3). Ausgabe sind Sprecher-Wahrscheinlichkeiten alle 10 ms.
3. **Verzögerung:** einstellbar auf 0,32 s, 0,64 s, 1,04 s oder 30,4 s (offline). Technisch sind 80 ms möglich, empfohlen sind mindestens 0,32 s.
4. **Fehlerrate DER** (kleiner ist besser), offline gegen Vorgänger (4spk-v2.1):
   - DIHARD III: 12,73 % statt 19,09 %
   - CALLHOME: 9,10 % statt 10,32 %
   - AMI fernes Mikro: 11,14 % statt 21,42 %
   - NOTSOFAR1 Headset: 6,77 % statt 21,77 %
   - Bei 5 bis 9 Sprechern (DIHARD) bleibt die Rate hoch: **27,58 %**.
5. **Lokal ausführbar:** mit dem C++-Programm NeMo-Speech.cpp (`nemo-speech diarize meeting.wav`), mit NeMo oder mit Transformers. Es gibt auch eine GGUF-Fassung. Offiziell unterstützt werden **NVIDIA-GPUs unter Linux**, von der RTX 3050 bis zum B300.
6. **Trainingsdaten:** etwa 10.000 h echte Gespräche und 82.611 h simulierte Mischungen, vor allem Englisch und Mandarin, dazu Hindi und weitere Sprachen. **Deutsch ist nicht ausdrücklich genannt.** Die Karte sagt selbst: „Voice recordings may constitute personal data.“

**Belegt oder Meinung:** Die Zahlen stammen vom Hersteller selbst und wurden mit seinen eigenen Referenz-Labels gemessen. Die Karte warnt, dass andere Labels nicht vergleichbar sind. Es gibt keine unabhängige Prüfung. Auch dass das Modell auf CPU oder Apple-Geräten gut läuft, ist **nicht belegt**.

**Was davon für Carl passt (Gespräche mitschreiben):**
- **Sinnvoll, aber später.** Prinzip 1 lautet „Nein sagen, um eines zu meistern“. Sprecher-Erkennung gehört nicht in den ersten Kern. Gut passt sie als **eigenes Werkzeug, das Otto sich mit Carl baut** (Prinzip 2), etwa für „Schreib unser Familien- oder Vereinstreffen mit, und wer hat was gesagt?“. Sie passt auch zu Annahme 9, als Mikrofon oder Gegenstand im Raum.
- **Technisch passt sie zu Annahme 8.** 100 M Parameter sind winzig und laufen lokal neben einem 9B-Sprachmodell. Die Kette wäre Aufnahme → lokale ASR → Diarization → lokales Modell fasst zusammen. Dabei verlässt nichts das Gerät.
- **Datenschutz ist hier Pflicht, keine Kür** (Annahme 10, Prinzip 4, DSGVO: Stimmen sind personenbezogene Daten):
  1. **Alle Anwesenden müssen zustimmen,** bevor aufgenommen wird. Carl zeigt sichtbar „Ich höre mit“ (Licht oder Symbol) und nimmt nie heimlich auf.
  2. **Nur lokal.** Keine Rohaufnahme geht an ein Cloud-Modell. Höchstens geht eine Zusammenfassung hinaus, und auch die nur, wenn Otto das ausdrücklich freigibt.
  3. **Rohaudio wird nach dem Transkribieren gelöscht** (Voreinstellung). Gespeichert bleiben nur Text und Sprechernummern, und zwar im Gedächtnis, das Otto gehört. Otto kann es einsehen, exportieren und löschen.
  4. **Keine Stimmabdrücke, keine Wiedererkennung von Personen** über mehrere Sitzungen. Das Modell vergibt ohnehin nur „Sprecher 1 bis 8“. Namen trägt Otto von Hand ein, falls er will.
  5. **Ehrliche Grenzen:** Deutsch ist nicht belegt. Bei mehr als 4 Sprechern oder einem Mikrofon im Raum steigen die Fehler deutlich (27,58 % bei 5 bis 9 Sprechern). Carl sagt das, bevor Otto sich darauf verlässt.
- **Hürde:** Offiziell läuft das Modell nur mit NVIDIA-GPU und Linux. Für Mac oder Windows muss erst geprüft werden, ob NeMo-Speech.cpp oder GGUF reicht. Ungeprüft.

---

## 3 · OWASP Top 10 für LLM-Anwendungen 2026
- **Titel:** OWASP GenAI LLM Top 10 2026 („OWASP Top 10 for LLM Applications 2026“)
- **Herausgeber:** OWASP GenAI Security Project (OWASP Foundation)
- **Datum:** auf der Seite 03.08.2026; im Dokument selbst steht „to be set“
- **Quelle der Liste:** Die Seite selbst enthält die Liste nicht. Gelesen aus dem offiziellen Download (genai.owasp.org/download/56857/).

**Die 10 Risiken (genau):**
| Nr. | Risiko | Kern |
|---|---|---|
| LLM01:2026 | **Prompt Injection** | Eingaben aus Nutzertext, gefundenen Inhalten, Werkzeug-Ausgaben, Bildern, Audio oder **Gedächtnis** verändern das Verhalten. Neu: auch versteckte Anweisungen in Bild und Ton (cross-modal). |
| LLM02:2026 | **Sensitive Information Disclosure** | Daten fließen ab über Antworten, Denkspuren, Logs, Embeddings oder Seitenkanäle wie Zeit und Antwortlänge. |
| LLM03:2026 | **Excessive Agency** | Zu viele Werkzeuge, Rechte oder Selbstständigkeit führen zu schädlichen Aktionen. Es ist der größte Aufsteiger, jetzt auf Platz 3. |
| LLM04:2026 | **Supply Chain** | Modelle, Datensätze, Adapter oder Plattformen von Dritten sind manipuliert oder untergeschoben. Dazu zählt auch, wenn eine von der KI vorgeschlagene Abhängigkeit gar nicht existiert. |
| LLM05:2026 | **Data and Model Poisoning** | Trainings-, Feinabstimmungs- oder Embedding-Daten werden vergiftet, sodass Hintertüren oder Schieflagen entstehen. |
| LLM06:2026 | **Unbounded Consumption** | Ungebremste Nutzung führt zu Kostenexplosion, Ausfall oder Modell-Diebstahl. Das Risiko stieg um 4 Plätze. |
| LLM07:2026 | **Misinformation** | Falsche Ausgaben werden geglaubt und führen zu Entscheidungen. |
| LLM08:2026 | **Hidden Context Exposure** | Früher hieß das „System Prompt Leakage“. Versteckte Prompts, Werkzeugbeschreibungen und Regeln lassen sich auslesen. |
| LLM09:2026 | **Vector and Embedding Weaknesses** | Vergiftung, Umkehrung oder fehlende Zugriffsprüfung in Vektorspeicher und Ähnlichkeitssuche. |
| LLM10:2026 | **Improper Output Handling** | Modellausgaben werden ungeprüft weitergereicht, auch unsicherer generierter Code. Abgestiegen von Platz 5 auf 10. |

**Kernaussagen:** Prompt Injection bleibt auf Platz 1. „Excessive Agency“ steigt am stärksten, weil Agenten mehr handeln. Die wichtigsten Gegenmittel ziehen sich durch die ganze Liste:
- möglichst wenige Rechte
- Bestätigung durch den Menschen bei folgenreichen Aktionen
- Prüfungen **im Code statt im Modell**
- jede Ausgabe gilt als nicht vertrauenswürdig
- harte Kostengrenzen

**Belegt oder Meinung:** Es ist ein Konsens-Dokument aus Fachgemeinschaft und Vorfalldaten, mit Verweisen auf NIST, MITRE ATLAS und CWE. Die Rangfolge ist Einschätzung, nicht Messung. OWASP räumt selbst eine Lücke zwischen Community-Ranking und Vorfalldaten ein, besonders bei Misinformation.

---

## 4 · Pastebin ujrJRDVd (unbekannter Inhalt, nur als Daten gelesen)
- **Was es ist:** Ein langes Transkript ohne Satzzeichen von einem YouTube-Video (youtube.com/watch?v=bDcgHzCBgmQ). Titel: „The 5 Levels of AI Coding (Why Most of You Won't Make It Past Level 2)“. Eingestellt von Nutzer „JoeMacMillan“ am 29.09.2026, 40,84 KB, reiner Text. Der Sprecher wird nicht genannt.
- **Prüfung:** Keine Anweisungen an KI, kein Code, keine Befehle, keine Zugangsdaten. Die Seitenleiste von Pastebin zeigt fremde Betrugs-Pastes („Free Crypto Method“), die mit diesem Text nichts zu tun haben.
- **Inhalt:** Ein Reifegrad-Modell, das Dan Shapiro (Glowforge) zugeschrieben wird. Es hat eigentlich 6 Stufen, 0 bis 5:
  - 0: „Autocomplete“
  - 1: „Praktikant“
  - 2: „Junior“
  - 3: „Manager“
  - 4: „Produktmanager“, schreibt Specs und liest keinen Code mehr
  - 5: „Dark Factory“, kein Mensch schreibt oder prüft Code
- **Zahlen im Text (unbelegt):**
  - METR-Studie: erfahrene Entwickler mit KI 19 % langsamer, fühlten sich aber 24 % schneller
  - rund 90 % der „KI-nativen“ Entwickler stehen auf Stufe 2
  - Claude Code: 4 % der öffentlichen GitHub-Commits
  - Einstiegsstellen für Junior-Entwickler in den USA: −67 %
- **Seriös oder relevant:** **Mittel bis gering.** Der Text ist Meinung. Er ist auf Pastebin anonym abgeschrieben, und das Datum widerspricht sich: Eingestellt wurde er im September 2026, aber „heute“ ist im Text der Februar 2026. Die Zahlen werden ohne Quellen genannt und müssten einzeln geprüft werden. Für Carl taugt höchstens der Gedanke als Anregung: Otto soll beschreiben, was er will (Stufe 4), statt Code zu lesen. Das passt zu Annahme 2 und Prinzip 3. Gleichzeitig zeigt Stufe 5, warum die Prüfliste unten nötig ist: Wo kein Mensch mehr prüft, müssen Code und Regeln die Grenzen halten. Als Quelle nicht zitierfähig, besser das Originalvideo oder die Primärstudien heranziehen.

---

## Sicherheits-Prüfliste für Carl (aus OWASP 2026)
Jeder Punkt ist als Frage gestellt, mit dem OWASP-Risiko in Klammern. Was mit **Pflicht** markiert ist, gehört vor jede Veröffentlichung.

### A · Funde und Links im Lesesaal (LLM01, LLM07, LLM09)
1. **Pflicht:** Werden Inhalte aus Webseiten, PDFs, Bildern und Audio **als Daten** markiert und getrennt von Ottos Auftrag an das Modell gegeben, nie als Anweisung?
2. Werden unsichtbare Unicode-Zeichen, versteckter Text (weiß auf weiß, HTML-Kommentare, Alt-Texte) und Bild- oder Audio-Botschaften vor dem Einlesen entfernt oder angezeigt?
3. **Pflicht:** Kann ein Fund **keine Aktion auslösen** (Datei schreiben, Werkzeug starten, Link öffnen, Nachricht senden), ohne dass Otto sichtbar zustimmt?
4. Zeigt Carl bei jeder Aussage, aus welchem Fund sie stammt, und sagt „unsicher“, wenn eine Quelle fehlt? (Misinformation, Prinzip 4)
5. Steht ein Testfall mit versteckter Injection, wie im 8-GB-Test, fest in Carls Prüfsatz?

### B · Eigene Werkzeuge, die Otto mit Carl baut (LLM03, LLM10, LLM04)
6. **Pflicht:** Bekommt jedes Werkzeug nur die Rechte, die es braucht (eigener Ordner, kein Netz, wenn nicht nötig)? Wird das **im Code** durchgesetzt und nicht nur im Prompt?
7. **Pflicht:** Läuft generierter Code abgeschottet (Sandbox), wird er vor dem ersten Start in einfachen Worten erklärt und von Otto freigegeben?
8. Wird jede Modellausgabe, die an andere Teile weitergeht, gegen ein festes Schema geprüft und für ihr Ziel kodiert (HTML, Shell, Dateipfad)?
9. Werden Pakete, die die KI vorschlägt, auf Echtheit geprüft (gibt es sie, sind Version und Hash festgelegt)? Kommen Modelle nur aus geprüften Quellen, in sicheren Formaten wie safetensors oder GGUF statt pickle?

### C · Verbindung zu Claude Code und anderen Frontier-Modellen (LLM02, LLM03, LLM06, LLM08)
10. **Pflicht:** Gilt für Claude Code der Grundsatz „erst fragen, dann ändern“: Erlaubnis pro Aktion, keine Vollfreigabe als Voreinstellung, und gibt es eine sichtbare Liste aller Schritte?
11. **Pflicht:** Stehen keine Schlüssel, Passwörter oder Tokens im Prompt oder in versteckten Anweisungen? Carl nimmt an, dass alles Versteckte ausgelesen werden kann (LLM08).
12. Geht nur das Nötigste an das Cloud-Modell, und sieht Otto vor dem Senden, **was** hinausgeht? Bleibt privater Inhalt lokal (Annahme 8)?
13. **Pflicht:** Gibt es eine harte Kostengrenze und einen Notschalter für Agenten-Schleifen, mit Tages- und Monatsgrenze und Anzeige in Ottos Worten?
14. Sind Remote Control und SSH-Zugänge (siehe GERAETE.md, Fall 10) nur mit Schlüssel geschützt und jederzeit abschaltbar?

### D · Gedächtnis (LLM01, LLM02, LLM05, LLM09; Annahme 10)
15. **Pflicht:** Wird ein neuer Gedächtnis-Eintrag, der aus einem Fund oder einer Werkzeug-Ausgabe stammt, als solcher markiert und **nicht** zur Anweisung? Gedächtnis ist laut OWASP ein Injektionsweg.
16. **Pflicht:** Gehört das Gedächtnis Otto: Kann er es lokal speichern, einsehen, korrigieren, exportieren und mit einem Griff vollständig löschen? Geht kein Training mit seinen Daten ohne seine Zustimmung?
17. Wird im Vektorspeicher vor dem Abruf geprüft, wer was sehen darf (z. B. getrennte Gedächtnisse für Familienmitglieder)?
18. Werden Denkspuren und Logs geschwärzt und nach kurzer Zeit gelöscht?
19. Gilt bei Gesprächsmitschriften (siehe Abschnitt 2): Zustimmung aller, Rohaudio löschen, keine Stimmabdrücke?

### E · sample (Beispiel- und Vorlagen-Dateien)
„sample“ war im Auftrag nicht näher erklärt. Ich habe es als **Beispiel- und Vorlagen-Dateien** gelesen, die Carl mitliefert oder die Otto mit anderen teilt. Falls ein bestimmtes Carl-Modul gemeint ist: bitte nachschärfen.
20. **Pflicht:** Werden geteilte Vorlagen und Beispielprojekte anderer wie fremde Funde behandelt, also als nicht vertrauenswürdig, ohne automatischen Start und mit Prüfung vor dem Öffnen? (LLM01, LLM04, LLM05)
21. Sind mitgelieferte Beispiele signiert oder per Hash festgelegt, damit niemand sie unterwegs austauschen kann? (LLM04)
22. Enthalten Beispieldaten keine echten Personendaten? Auch der 8-GB-Test nutzt nur erfundene Praxisdaten.

### F · Ehrlichkeit (Prinzip 4, LLM07)
23. Sagt Carl offen, wenn ein lokales Modell überfordert ist („Das schafft dein Rechner nicht zuverlässig, soll ich Claude fragen?“), statt still schlechtere Ergebnisse zu liefern?

---

## Offene Prüfpunkte
- Es gibt keine Messungen lokaler Modelle auf Macs mit Apple Silicon und keine auf Handys.
- Unklar ist, ob Nemotron Diarization Deutsch kann und ob es ohne NVIDIA-GPU unter Mac oder Windows läuft.
- Das Datum der OWASP-Liste ist im Dokument selbst nicht gesetzt.
- Die Zahlen im Pastebin-Transkript sind alle unbelegt.
