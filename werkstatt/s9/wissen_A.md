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
