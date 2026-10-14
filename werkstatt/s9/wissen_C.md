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
