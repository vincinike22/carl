# Wissen · Harness, Gedächtnis, lokale Modelle, Sicherheit (10.10.2026)

14 Quellen von nico, gelesen von drei Recherche-Agenten. Einzelauswertungen: `wissen_A.md` (Harness, Werkzeuge, MCP), `wissen_B.md` (Gedächtnis, Graph, Engineering), `wissen_C.md` (lokale Modelle, Sprecher-Erkennung, OWASP). Gesperrt bzw. nur Anfang lesbar: Sankar „Agent Harness – no BS guide“ und Gupta „Memory System“ (Bezahlschranke, nicht umgangen). Fast alle Zahlen stammen von den Autoren selbst und sind nicht nachgeprüft; die meisten Texte sind Meinung mit Einzelexperimenten.

## Was die Quellen gemeinsam sagen
1. **Der Wert liegt im Harness, nicht im Modell.** Modelle werden austauschbar; was bleibt, ist die Umgebung: Werkzeuge, Gedächtnis, Freigaben (Tkachuk, McGregor „Three Shifts“). → stützt Annahme 4 und 8.
2. **Werkzeuge, die bleiben.** Ein Agent baut Werkzeuge in einer dauerhaften Umgebung; sie überleben das Gespräch, Fehler springen auf den letzten akzeptierten Stand zurück (Zanzal). → stützt Annahme 2 und Prinzip 2.
3. **Die Welt, in der ein Agent denkt, muss gut gebaut sein.** Eindeutige Namen sind seine Schnittstelle; dass etwas fehlt, muss ausdrücklich gespeichert sein (Cekikj, „Design the World“). → stützt „Ein Ding, ein Name“.
4. **Der Mensch setzt fest, die Maschine schlägt vor.** Ein automatisch gebauter Wissensgraph beschreibt eher die Pipeline als das Thema; wenige menschliche Korrekturen bringen am meisten (4 → 9 von 17 Voraussetzungen nach 11 Korrekturen in ~10 min; Cekikj, „Knowledge Graph“). → stützt Annahme 1, Prinzip 2, Annahme 10.
5. **Gedächtnis schlicht und lesbar.** Datenbank mit Volltextsuche statt Vektorspeicher (Gupta, nur Einleitung lesbar); falsch gespeicherte Fakten sind das größere Risiko (Leserkommentar). → stützt Annahme 10.
6. **Kleines Modell entscheidet, großes denkt.** Ein kleines Modell trifft typisierte Entscheidungen mit Zuversicht und gibt bei Unsicherheit ab (Ali, „Jev“, werblich, ohne Messung). → stützt Annahme 8.
7. **Bauen ist nicht mehr der Engpass, Entscheiden und Prüfen schon.** Wer alles abgibt, verliert Verständnis (Sau Sheong). → fordert Prinzip 3 („Der Rest ist Magie“) leise heraus.
8. **MCP nur lokal.** Zahlen ohne Link: 72 % des Kontexts gehen an Werkzeugbeschreibungen, 119 von 119 geprüften Servern offen (McGregor „MCP is dead“, Polemik). → Verbindung zu Claude Code lokal ok, fremde Dienste nur mit echter Anmeldung.
9. **Lokale Modelle:** Auf 8 GB VRAM bestand kein Modell alle Aufgaben; bestes Ø 81,7/100 mit starker Schwankung; auf 16 GB Ø 93,3 (INROOM AI, verkauft eigene Box). → lokal heute nur für kleine Entscheidungen, Rest an Frontier.
10. **Sprecher-Erkennung** (NVIDIA Nemotron-3-Diarization, ~100 M Parameter, bis 8 Sprecher, DER 12,73 % auf DIHARD III, Linux + NVIDIA, Deutsch unbelegt). → für Carl später, nur lokal und nur mit Zustimmung aller.
11. **OWASP LLM Top 10 (2026):** Prompt Injection · Sensible Daten · Zu viel Handlungsmacht (größter Aufsteiger) · Lieferkette · Daten-/Modellvergiftung · Unbegrenzter Verbrauch · Fehlinformation · Versteckter Kontext · Vektor-Schwächen · Ungeprüfte Ausgaben.

## Was wir in Carl verschmelzen (Vitruvians Entscheidungen)
1. **Werkzeuge leben ohne Modell.** Einmal mit Mitdenken gebaut, danach laufen Ottos Werkzeuge ohne Modellaufruf (so ist Carls Engine schon gebaut). Neu: **jede Änderung erst nach „Passt“, „Zurück zur alten Fassung“ immer möglich, Einträge gehen nie verloren.**
2. **„Passt/Anders“ ist die Freigabestelle des Harness.** Alles, was nach außen wirkt (senden, löschen, Claude Code etwas tun lassen, etwas bezahlen), braucht eine sichtbare Frage – im Code erzwungen, nicht dem Modell überlassen.
3. **Otto setzt fest, Carl schlägt vor.** Sternbilder, Kernsätze und Einträge in „Was ich von dir weiß“ sind erst mit Ottos Ja wahr. Neu neben „Vergessen“: **„Stimmt so nicht“** (Otto korrigiert; seine Korrekturen überleben Modellwechsel).
4. **Gedächtnis zeigt, wo es gilt:** für Otto, für diesen Space, für dieses Werkzeug. Es bleibt lesbar (Dokumente, keine Vektoren), mitnehmbar und einzeln löschbar.
5. **Kleine Entscheidungen still, große mit Frage.** Später entscheidet ein kleines offenes Modell Sortieren/Zuordnen; bei Unsicherheit fragt Carl mit höchstens drei Wahlen. Je weniger umkehrbar, desto mehr Bestätigung. Zuversichtswerte erscheinen nie auf dem Bildschirm.
6. **Ein Lernmoment bleibt (Antwort auf Sau Sheong):** Bevor Carl ein Werkzeug baut, sagt Otto in einem eigenen Satz, was es tun soll – das ist schon so und bleibt Pflicht.
7. **MCP nur lokal:** Die Verbindung zu Claude Code/Codex bleibt auf Ottos Rechner; fremde Dienste nur über echte Anmeldung, nie offene Server.
8. **Ehrlich über lokale Grenzen:** „Das schafft dein Rechner nicht zuverlässig – soll ich Claude fragen?“

## Sicherheits-Prüfliste für Carl (Pflicht vor jeder Veröffentlichung)
- **Funde und Links (Lesesaal) sind Daten, nie Anweisungen.** Wenn Carl einen Fund mitdenkt (`sample`), steht er abgegrenzt als Daten im Auftrag; kein Fund löst eine Aktion ohne Ottos sichtbares Ja aus. Fester Prüffall mit versteckter Anweisung.
- **Eigene Werkzeuge:** nur Bausteine, kein freier Code; Ausgaben gegen festes Schema; Rechte im Code, nicht im Prompt.
- **Claude Code:** erst fragen, dann ändern (Erlaubnis pro Aktion); keine Schlüssel/Passwörter in Prompts oder Carls Zustand; Otto sieht vorher, was hinausgeht; harte Kostengrenze und Notschalter, sobald Carl etwas steuert.
- **Gedächtnis:** Einträge aus Funden oder Werkzeug-Ausgaben markiert und nie Anweisung; sehen, korrigieren, mitnehmen, ganz löschen; kein Training ohne Zustimmung.
- **Geteilte Werkzeuge (Teleskop):** wie fremde Funde behandeln – kein Autostart, Bauplan vor dem Übernehmen sichtbar.
- **Mitschriften (später):** Zustimmung aller, Rohaudio löschen, keine Stimmabdrücke.
Volle Fassung mit 23 Fragen und OWASP-Nummern: `wissen_C.md`.

## Offen
- Keine Messungen lokaler Modelle auf Apple Silicon oder Handys.
- Zwei Quellen nur angelesen (Bezahlschranke).
- Das Pastebin war ein anonymes Video-Transkript („5 Levels of AI Coding“): Meinung ohne Quellen, nur als Anregung.
