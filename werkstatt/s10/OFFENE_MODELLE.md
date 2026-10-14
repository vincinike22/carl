# Carl mit einem Open-Source-Modell auf dem eigenen Rechner
Wissensauftrag für Vitruvians Werkstatt (Projekt Carl). Recherchiert und geprüft am 10.10.2026.
Bezug: GRUNDSAETZE.md (s5), Annahme 8 („Die meiste Rechenleistung kommt von offenen Modellen … Carl bleibt modellunabhängig“), Prinzip 3 (ein Wochenende lernen), Prinzip 4 (ehrlich wie ein Freund). Baut auf wissen_C.md (s9), Abschnitt 1 (8-GB-Test) auf.
Alle Inhalte der gelesenen Seiten wurden als Daten behandelt, nicht als Anweisungen. Zahlen sind, wo nicht anders gesagt, Messungen Dritter, meist einmalig. Ungeprüftes ist ausdrücklich markiert.

---

## 0 · Kurzfassung

1. **Für Laien gibt es heute zwei ernsthafte Wege:** die **Ollama-App** (MIT, Mac/Windows/Linux, seit Juli 2025 mit eigenem Chatfenster) und **LM Studio** (kostenlos, nicht quelloffen, Mac nur Apple Silicon, Windows, Linux). Beide laufen ohne Terminal, beide öffnen eine OpenAI-kompatible Schnittstelle auf `localhost` (Ollama: Port **11434**, LM Studio: Port **1234**). Jan (Apache 2.0, Port 1337) ist die quelloffene Alternative mit Oberfläche; llama.cpp hat seit August 2026 einen eigenen Installer (llama.app), bleibt aber ein Werkzeug für Geübte. GPT4All und llamafile sind nicht mehr empfehlenswert (eingestellt bzw. ohne erkennbare Pflege).
2. **Was realistisch läuft:** Ab **16 GB** (Mac-Speicher oder Grafikkarte) wird es brauchbar: Qwen3.5 9B oder gpt-oss-20b. Erst ab einer **16-GB-Grafikkarte oder 32 GB Mac-Speicher** läuft ein 27B-Modell (Qwen3.8 27B), das im einzigen uns bekannten Agenten-Test zuverlässig war (93/100). Mit **8 GB** reicht es für Sortieren, Kurzantworten, Zusammenfassen; **nur CPU** nur mit 1–4B-Modellen und Geduld. Alle empfohlenen Modelle stehen unter **Apache 2.0** (Qwen3.5/3.6, Gemma 4, gpt-oss).
3. **Carl auf claude.ai kann ein lokales Modell direkt ansprechen – in Chrome, Edge und Firefox.** `http://localhost` und `http://127.0.0.1` gelten nach W3C „Secure Contexts“ als vertrauenswürdig; Chrome (seit 2016) und Firefox (seit Version 84) blockieren solche Anfragen von https-Seiten **nicht** als Mixed Content. Neu seit Chrome 142 (28.10.2025) und Firefox 153 (21.07.2026): Der Browser fragt einmal **„Zugriff auf Apps auf diesem Gerät“** – Otto klickt „Erlauben“.
4. **In Safari geht es nicht.** WebKit behandelt `http://localhost` im Mixed-Content-Prüfer bis heute als unsicher (Bug 171934 offen seit 2017; Bug 281149 am 20.04.2026 wieder geöffnet). Carl muss Otto am Mac ehrlich sagen: „Für dein eigenes Modell brauchst du Chrome oder Firefox.“
5. **Die eine Einstellung, die Otto braucht:** Bei Ollama die Umgebungsvariable `OLLAMA_ORIGINS` mit Carls Seiten-Ursprung (Origin), bei LM Studio den Schalter „Enable CORS“. Sonst nichts: kein Freigeben ins Netz, kein `*`.

---

## 1 · Tabelle: Rechner · Werkzeug · Modell (Lizenz) · taugt für · taugt nicht für · Zeit

„Zeit“ = unsere Schätzung für Einrichtung inkl. Modell-Download bei 100 Mbit/s (ungeprüft). tok/s = erzeugte Wörter-Teile pro Sekunde; unter 10 tok/s fühlt sich Lesen stockend an, über 20 tok/s flüssig.

| Rechner | Werkzeug | Modell (Lizenz) | Belegte Zahlen | taugt für | taugt nicht für | Zeit |
|---|---|---|---|---|---|---|
| **Mac Apple Silicon, 8 GB** | Ollama-App oder LM Studio (LM Studio: „8 GB kann gehen, kleine Modelle“) | **Gemma 4 E2B** (Apache 2.0; Ollamas Erst-Empfehlung, Download 7,2 GB, „ca. 8 GB empfohlen“); Alternative **Qwen3.5 4B** 4-bit (Apache 2.0, ~3 GB Gewichte, 4,3–5,3 GB Spitze) | Qwen3.5 4B: 45–62 tok/s auf M1/M2/M3 Pro (rapid-mlx, Okt 2026); Gemma 4 E2B auf 8-GB-PC: 61,9 tok/s, 40/100 Punkte im Agenten-Test (INROOM, Sep 2026) | Kurzantworten, Notizen sortieren, Zusammenfassen, Umformulieren, Bilder beschreiben (beide sind multimodal) | Fakten (Qwen3.5 4B: 80 % Halluzinationsrate auf AA-Omniscience), lange Werkzeug-Ketten, alles neben einem offenen Browser mit vielen Tabs | 20–30 min |
| **Mac Apple Silicon, 16 GB** | Ollama-App oder LM Studio (beide empfehlen 16 GB als Minimum) | **Qwen3.5 9B** 4-bit (Apache 2.0; ~6 GB Gewichte, 7,8 GB Spitze); Alternative **gpt-oss-20b** MXFP4 (Apache 2.0, 12,8 GiB – knapp) | Qwen3.5 9B: 20,6 tok/s auf M4 16 GB (rapid-mlx, Okt 2026); Intelligence Index 32 = „klügstes Modell unter 10B“ (Artificial Analysis, März 2026) | Entwürfe schreiben, Zusammenfassen, Struktur in Gedanken bringen, einfache Werkzeug-Aufrufe, Vision | Zuverlässige mehrstufige Agenten-Läufe (auf 8-GB-PC schwankte dieselbe Aufgabe zwischen 10 und 100 Punkten), harte Fakten (82 % Halluzination) | 20–30 min |
| **Mac Apple Silicon, 32 GB** | Ollama-App oder LM Studio | **Qwen3.8 27B** 4-bit (Lizenz vermutlich Apache 2.0 – **ungeprüft**; 18,7 GB Spitze); schnellere Wahl **Qwen3.6-35B-A3B** 4-bit (Apache 2.0, 20,2 GB Spitze) | Qwen3.8 27B: 9,9 tok/s (M2 Pro) bis 15,4 tok/s (M4 Pro), 32,9 (M5 Max); Qwen3.6-35B-A3B: 85–104 tok/s auf M4 Pro (rapid-mlx) | „Carl arbeitet lokal allein“: mehrstufige Aufgaben, Code, längere Texte (27B erreichte 93/100 im Agenten-Test, gemessen auf 16-GB-GPU) | Frontier-Niveau bei Wissen und sehr langen Läufen; 27B ist langsam auf M2 (unter 10 tok/s) | 30–45 min (Download 15–20 GB) |
| **Windows-PC, 8 GB VRAM** (z. B. RTX 4060 Laptop) | LM Studio (zeigt „fits/too large“) oder Ollama-App | **Qwen3.5 9B** Q4_K_M (Apache 2.0, 5,8 GB VRAM); schnell: **Gemma 4 E2B** (1,7 GB VRAM) | INROOM-8-GB-Test (14.09.2026): Qwen3.5 9B 26,6 tok/s, Ø 81,7/100 mit Modellkarten-Einstellungen, nur 41,7 mit eigenen Einstellungen; Gemma 4 E2B 61,9 tok/s, 40/100 | Kurzaufgaben, Sortieren, Zusammenfassen, Entwürfe; Vorsortieren mit E2B | Mehrstufige Werkzeug-Abläufe (kein Modell bestand alles), lange Kontexte (Browser allein belegt bis 861 MiB VRAM) | 20–30 min |
| **Windows-PC, 16 GB VRAM** (z. B. RTX 5060 Ti 16 GB) | LM Studio oder Ollama-App | **Qwen3.8 27B** IQ3_S (13,8–15,6 GB); Alternativen **gpt-oss-20b** MXFP4 (Apache 2.0, 12,8 GiB), **Gemma 4 26B-A4B** IQ4_XS (Apache 2.0, 13,9 GB) | INROOM: Qwen3.8 27B 23,7 tok/s, Ø 93,3/100, 15.585 MiB; Atomic Chat (Aug 2026): 27B auf 16 GB nur ~8K Kontext praktikabel | Lokaler Agent für Alltagsaufgaben, Code-Hilfe, Dokumente | Lange Kontexte (8K Grenze), parallel offene Spiele/Browser | 30–45 min |
| **Nur CPU** (Laptop ohne Grafikkarte, 8–16 GB RAM) | Ollama-App (Jan oder LM Studio ebenso) | **Gemma 4 E2B** (Apache 2.0) für Qualität; **Qwen3.5 2B** oder **Gemma 3 1B** für Tempo | It's FOSS (15.05.2026, i5-Laptop, 12 GB RAM, Q4_K_M): Qwen3 0.6B ~35 tok/s, Gemma 3 1B ~18,6, Gemma 4 E2B ~9,9 („langsam, aber brauchbar“), 7–8B-Modelle 3–4 tok/s („nicht interaktiv“) | Einzelne Fragen, kurze Umformulierungen, Stichwörter sortieren; „fragen, weggehen, wiederkommen“ | Alles Agentische, lange Texte, Echtzeit-Dialog mit Modellen über 4B | 15–20 min |

**Was alle Stufen gemein haben (ehrlich):** Kleine Modelle erfinden Fakten (Qwen3.5 4B/9B: 80–82 % Halluzinationsrate auf AA-Omniscience) und schwanken von Lauf zu Lauf. Einstellungen aus der Modellkarte sind entscheidend (Qwen 9B: 125 → 245 Punkte allein durch richtige Sampling-Werte). Carl soll die Modellkarten-Werte selbst setzen, mit Zeitgrenze arbeiten, offen zeigen, was läuft, und harte Aufgaben an ein Frontier-Modell geben (Annahme 8).

---

## 2 · Die Werkzeuge für Laien (Stand Oktober 2026)

| Werkzeug | Lizenz | Mac | Windows | Linux | Ohne Terminal? | Lokale Schnittstelle | Modell-Empfehlung des Herstellers |
|---|---|---|---|---|---|---|---|
| **Ollama** (App + Dienst) | MIT | ja (Apple Silicon und Intel), seit 30.03.2026 MLX-Vorschau für Apple Silicon | ja | ja (Skript, systemd) | **ja** – seit 30.07.2025 eigene App mit Chatfenster, Modellwahl, Einstellungen (Kontextlänge, „Expose Ollama to the network“, Apps-Verbindung) | `http://localhost:11434/v1` (OpenAI-kompatibel), eigene API `/api/...` | Quickstart: **gemma4:e2b** (lokal), gemma4:31b (Cloud). Blog: gpt-oss:20b/120b, Qwen3-VL, Qwen3-Coder 30B |
| **LM Studio** | proprietär, kostenlos (auch beruflich seit Juli 2025); CLI/SDK/MLX-Engine MIT | nur Apple Silicon, macOS 14+ | x64 (AVX2 nötig) und ARM | AppImage, Ubuntu 20.04+ | **ja** – „Discover“-Tab zeigt, ob ein Modell „fits“/„too large“; Reiter „Developer“ startet den Server per Schalter | `http://localhost:1234/v1`; Schalter „Enable CORS“, „Serve on Local Network“, „Require Authentication“ | keine feste Empfehlung; kuratierte Liste im Discover-Tab; 16 GB RAM empfohlen, 4 GB VRAM auf Windows |
| **Jan** | Apache 2.0 (seit Mai 2025, vorher AGPL) | ja | ja | ja | ja – „App installieren, Modell wählen, chatten“ | `http://localhost:1337/v1` | Hugging-Face-Hub in der App; letzte stabile Version 0.8.4 (Juli 2026), Releases langsamer |
| **llama.cpp / llama.app** | MIT | ja | ja | ja | halb – seit August 2026 Installer „llama.app“ und `llama-server` mit Web-UI, sonst Terminal | `http://localhost:8080` | keine; lädt GGUF-Dateien |
| **llamafile** (Mozilla) | Apache 2.0 | – | – | – | eine Datei, Doppelklick | eigener Port | in keinem 2026er Vergleich mehr mit Status geführt – **nicht empfehlen** |
| **GPT4All** (Nomic) | MIT | – | – | – | ja | – | letzte Version 3.10 (Feb 2025); Dez 2025 angekündigt „nicht mehr gepflegt“; neue Modelle (Qwen3) laden nicht – **nicht empfehlen** |
| **Goose Desktop** (Block / Linux Foundation) | Apache 2.0 | ja | ja | ja | ja – „Settings → Local Inference“, llama.cpp eingebaut, lädt GGUF von Hugging Face ohne Ollama | – (Agent, keine API) | Gemma 4 (nativer Werkzeug-Aufruf, Vision) |
| **Apple-eigener Weg** | – | Foundation Models Framework (WWDC 2025), ab macOS 27 mit `MLXLanguageModel` für Hugging-Face-Modelle (WWDC 2026, Beta ab 08.06.2026) | – | – | **nein** – nur für Entwickler in Swift/Xcode, keine Endnutzer-App; `fm`-CLI erwähnt | – | mlx-community-Modelle |

**Empfehlung für Carls Anleitung:** Mac → **Ollama-App** (quelloffen, MLX-Vorschau, Chatfenster) oder LM Studio (bessere Anzeige, was passt). Windows → **LM Studio** (zeigt „fits“, braucht kein Terminal), Ollama als zweiter Weg. Jan nur nennen, nicht anleiten.

---

## 3 · Anleitung in höchstens 6 Schritten

### 3a · Mac mit Ollama
1. **Laden:** ollama.com/download → Ollama für macOS laden, in „Programme“ ziehen, öffnen (Lamakopf in der Menüleiste).
2. **Modell wählen:** Im Chatfenster oben das Modell wählen: bei 8 GB **gemma4:e2b** (7,2 GB Download), bei 16 GB **qwen3.5:9b**, bei 32 GB **qwen3.8:27b**. Beim ersten Senden lädt die App das Modell.
3. **Probieren:** Eine Frage im Chat stellen. Antwortet es, läuft das Modell.
4. **Carl erlauben (einmal):** Terminal öffnen (Spotlight → „Terminal“), diese eine Zeile einfügen, Enter – Carl zeigt sie fertig an, mit seinem genauen Ursprung:
   `launchctl setenv OLLAMA_ORIGINS "https://<Carls-Ursprung>"`
   Dann Ollama über die Menüleiste beenden und neu öffnen.
5. **In Carl verbinden:** Carl in **Chrome oder Firefox** öffnen (nicht Safari, siehe Abschnitt 4), „Eigenes Modell“ wählen; Carl findet `http://localhost:11434` und zeigt die geladenen Modelle an. Der Browser fragt einmal „Zugriff auf Apps auf diesem Gerät“ → **Erlauben**.
6. **Einstellungen prüfen:** In Ollama → Einstellungen: „Expose Ollama to the network“ **aus** lassen, Kontextlänge auf 16k–32k. Fertig.

### 3b · Mac mit LM Studio
1. **Laden:** lmstudio.ai → Download für macOS (nur Apple Silicon, macOS 14+), öffnen.
2. **Modell laden:** Reiter „Discover“ (Lupe): nach „Qwen3.5 9B“ oder „Gemma 4“ suchen; nur Modelle mit grünem „fits“ nehmen. Download.
3. **Probieren:** Reiter „Chat“ → Modell oben laden → Frage stellen.
4. **Server starten:** Reiter „Developer“ (grünes Terminal-Symbol, ggf. unten „User“ → „Developer“ umschalten) → Schalter **„Start server“**. Port bleibt **1234**.
5. **CORS erlauben:** Im Server-Fenster „Settings“ → **„Enable CORS“ an**. „Serve on Local Network“ **aus** lassen.
6. **In Carl verbinden:** Carl in Chrome oder Firefox → „Eigenes Modell“ → Carl findet `http://localhost:1234/v1` und liest die Modell-Kennung aus `/v1/models`. Browser-Frage „Apps auf diesem Gerät“ → Erlauben.

### 3c · Windows mit Ollama
1. **Laden:** ollama.com/download → OllamaSetup.exe ausführen. Ollama erscheint unten rechts im Infobereich.
2. **Modell wählen:** Im Chatfenster Modell wählen: 8 GB VRAM → **qwen3.5:9b** (oder gemma4:e2b für Tempo), 16 GB VRAM → **qwen3.8:27b** oder **gpt-oss:20b**.
3. **Probieren:** Frage stellen, auf Antwort warten.
4. **Carl erlauben (einmal):** Ollama im Infobereich beenden. Windows-Suche → „Umgebungsvariablen für dieses Konto bearbeiten“ → „Neu“: Name `OLLAMA_ORIGINS`, Wert `https://<Carls-Ursprung>` (Carl zeigt den Wert an) → OK. Ollama über das Startmenü neu starten.
5. **In Carl verbinden:** Carl in Chrome, Edge oder Firefox → „Eigenes Modell“ → Browser-Frage „Zugriff auf Apps auf diesem Gerät“ → **Zulassen**.
6. **Vor dem Rechnen:** Spiele und große Browser-Tabs schließen (der Browser allein belegt bis ~0,9 GB Grafikspeicher). „Expose Ollama to the network“ aus lassen.

### 3d · Windows mit LM Studio
1. **Laden:** lmstudio.ai → Windows-Installer (x64 mit AVX2 oder ARM) ausführen.
2. **Modell laden:** „Discover“ → z. B. „Qwen3.5 9B“ (8 GB VRAM) oder „gpt-oss-20b“ (16 GB VRAM); nur „fits“ nehmen.
3. **Probieren:** „Chat“ → Modell laden → Frage.
4. **Server starten:** „Developer“ → „Start server“ (Port 1234).
5. **CORS an, Netzwerk aus:** Server-Settings → „Enable CORS“ an, „Serve on Local Network“ aus.
6. **In Carl verbinden:** Chrome/Edge/Firefox → „Eigenes Modell“ → Browser-Frage „Apps auf diesem Gerät“ → Zulassen.

---

## 4 · Technisch: Wie Carl auf claude.ai ein lokales Modell erreicht

### 4.1 Ausgangslage
Carl läuft als Seite unter https (claude.ai bzw. die Artifact-Ursprungsdomain). Das lokale Modell antwortet über **http** auf `localhost`. Drei Browser-Regeln entscheiden, ob das geht:

**(a) Secure Contexts / „potentially trustworthy“ (W3C, via MDN):** `127.0.0.0/8`, `::1/128`, `localhost`, `localhost.`, `*.localhost` sind **potentially trustworthy**. Damit ist eine Anfrage von https nach `http://localhost` nach Spezifikation **kein Mixed Content**. (MDN „Secure contexts“, gelesen 10.10.2026.)

**(b) Mixed Content je Browser:**

| Browser | https-Seite → `http://localhost:11434` | Beleg |
|---|---|---|
| **Chrome / Edge / Brave** (Chromium) | **erlaubt.** `http://127.0.0.1` seit Commit „Stop blocking http://127.0.0.1/ as mixed content“ (22.06.2016); `localhost` folgt der Secure-Contexts-Regel. Zusätzlich seit **Chrome 142 (28.10.2025)** die Berechtigung **Local Network Access**: Anfragen einer öffentlichen Seite an Loopback lösen einmal einen Dialog aus. Chrome 142–144: „Nach Geräten in Ihrem lokalen Netzwerk suchen …“; **ab Chrome 145** eigene Berechtigung **„Apps auf diesem Gerät“** (intern `loopback-network`). Ohne Erlaubnis: `fetch` wirft Netzwerkfehler; Konsole: „denied access to address space“. Ab Chrome 147 (April 2026) auch WebSockets. | Chromium-Commit 130ee686f; blink-dev „Intent to Ship: Local network access restrictions“; Dynamsoft FAQ (04.11.2025, Stand 01.09.2026); Okta-Hilfe (2026); Visualware (April 2026) |
| **Firefox** | **erlaubt.** Bug 1488740 „Stop treating http://localhost/ (by name) as mixed content“ → behoben in **Firefox 84** (IP-Loopback schon seit Bug 903966). Seit **Firefox 153 (21.07.2026)** Local-Network-Access-Schutz standardmäßig an: Berechtigung **„Device apps and services“** (Geräte-Apps und -Dienste) mit Dialog an der Adressleiste, „Don't ask again for this site“. Einstellbar unter Einstellungen → Datenschutz & Sicherheit → Berechtigungen; about:config `network.lna.enabled`, `network.lna.blocking`. | Bugzilla 1488740; Mozilla Support „Control personal device and local network permissions“ (2026); MDN Firefox 153 Release |
| **Safari** (WebKit) | **blockiert.** `MixedContentChecker.cpp` behandelt `localhost`/`127.0.0.1` als unsicher, obwohl `SecurityOrigin` sie als trustworthy führt. Bug 171934 (seit 10.05.2017) **offen**, Kommentare bis Nov 2024 bestätigen Blockade (Shopify, Zotero, Fotoapps raten von Safari ab); Apple (J. Wilander) will die Freigabe nur zusammen mit einer Verschärfung für http-Seiten. Bug 281149 „WebKit is inconsistent about whether localhost is a secure origin“ **am 20.04.2026 wieder geöffnet**, weil nur Cookies gefixt wurden, Mixed Content nicht. Bug 279249 (iOS 18/Safari 18, 2024) zeigte, dass selbst `<img>` nach `http://127.0.0.1` brach; gezielter Fix März 2025, keine Spezifikations-Angleichung. Safari 26.2 kennt zwar `targetAddressSpace: 'loopback'` (Bug 304164, Dez 2025), das ändert die Mixed-Content-Regel aber nicht. | WebKit Bugzilla 171934, 281149, 279249, 304164 |

**Folge für Carl:** In **Chrome, Edge, Brave, Firefox** geht es direkt (ein Klick „Erlauben“). In **Safari** geht es **nicht** – weder mit `localhost` noch mit `127.0.0.1`. Carl erkennt Safari (`navigator.userAgent` enthält „Safari“ ohne „Chrome“/„Chromium“/„Firefox“) und sagt es vorher, statt einen Fehler zu zeigen. Umwege (lokaler https-Proxy mit eigenem Zertifikat, Browser-Erweiterung) sind für Otto zu kompliziert; nicht anbieten.

**(c) CORS – der Server muss Carls Ursprung erlauben.** Der Browser schickt `Origin: https://<Carls-Ursprung>` mit; der lokale Server muss im Preflight `Access-Control-Allow-Origin` dafür zurückgeben. Standard bei Ollama: **nur** `http(s)://localhost[:*]`, `127.0.0.1[:*]`, `0.0.0.0[:*]` sowie `app://*`, `file://*`, `tauri://*`, `vscode-webview://*`, `vscode-file://*` (Quelltext `envconfig/config.go`, Stand main 09.10.2026). Also: **ohne `OLLAMA_ORIGINS` scheitert Carl mit CORS-Fehler.** Bei LM Studio ist CORS ein Schalter.

### 4.2 Genaue Einstellungen

**Ollama (Port 11434, Dienst bindet standardmäßig `127.0.0.1:11434` – gut so):**

| Betriebssystem | Befehl / Ort | Danach |
|---|---|---|
| macOS (App) | `launchctl setenv OLLAMA_ORIGINS "https://<Carls-Ursprung>"` | Ollama in Menüleiste beenden, neu starten |
| macOS (Terminal statt App) | `OLLAMA_ORIGINS="https://<Carls-Ursprung>" ollama serve` | – |
| Windows | Umgebungsvariablen für dieses Konto → `OLLAMA_ORIGINS` = `https://<Carls-Ursprung>` (mehrere mit Komma) | Ollama im Infobereich beenden, über Startmenü starten |
| Windows (PowerShell, einmalig) | `$env:OLLAMA_ORIGINS="https://<Carls-Ursprung>"; ollama serve` | – |
| Linux (systemd) | `sudo systemctl edit ollama.service` → unter `[Service]`: `Environment="OLLAMA_ORIGINS=https://<Carls-Ursprung>"` | `sudo systemctl daemon-reload && sudo systemctl restart ollama` |

- Ollama nutzt `gin-contrib/cors` mit `AllowWildcard = true` (routes.go): Muster wie `https://*.beispiel.de` sind erlaubt. Carl kann also, wenn Artifacts auf wechselnden Unterdomänen laufen, eine Wildcard für genau diese Domain vorschlagen – **nie** `*` allein.
- **NICHT setzen:** `OLLAMA_HOST=0.0.0.0` (öffnet den Port fürs ganze LAN, keine Authentifizierung). Den App-Schalter „Expose Ollama to the network“ aus lassen.
- Kontextlänge: `OLLAMA_CONTEXT_LENGTH` (Standard 4096) oder in der App; die OpenAI-API kann sie nicht setzen.
- Optional für reines Offline: `OLLAMA_NO_CLOUD=1` (schaltet Cloud-Modelle und Websuche aus).

**LM Studio (Port 1234):** Developer-Reiter → „Start server“ → Settings: **Enable CORS = an**, **Serve on Local Network = aus**, optional **Require Authentication = an** (dann sendet Carl `Authorization: Bearer <Token>`). Kommandozeile: `lms server start` (ohne `--bind 0.0.0.0`). Ob „Enable CORS“ `Access-Control-Allow-Origin: *` oder eine Liste setzt, ist nicht dokumentiert – **ungeprüft**; im Zweifel Authentifizierung anschalten.

**Anfrage aus Carl (OpenAI-kompatibel, beide Server):**
```js
// Ollama: base = "http://localhost:11434/v1", Modell z. B. "qwen3.5:9b", "gemma4:e2b", "gpt-oss:20b"
// LM Studio: base = "http://localhost:1234/v1", Modell = Kennung aus GET /v1/models
const r = await fetch(base + "/chat/completions", {
  method: "POST",
  // Chrome ab 142: Ziel als Loopback kennzeichnen, hilft bei der Einordnung vor DNS;
  // Safari 26.2 warf hierfür einen TypeError (Bug 304164, in main behoben) → mit Fallback ohne Option aufrufen
  targetAddressSpace: "loopback",
  headers: { "Content-Type": "application/json", "Authorization": "Bearer ollama" }, // Ollama ignoriert den Schlüssel, Client braucht einen
  body: JSON.stringify({ model, messages, stream: true })
});
```
- Modelle ermitteln: `GET /v1/models` (Ollama und LM Studio). Kontext bei Ollama über Modelfile/App, nicht über die API.
- Erkennung „läuft ein lokaler Server?“: `GET http://localhost:11434/v1/models` und `GET http://localhost:1234/v1/models` mit kurzer Zeitgrenze (2 s); Fehler = nicht vorhanden oder Berechtigung verweigert. Carl unterscheidet beides über die Fehlermeldung und erklärt Otto den jeweils einen Klick.
- Ollama-Besonderheiten der OpenAI-API: kein `tool_choice`, keine `logprobs`, Bilder nur als base64; `/v1/responses` seit 0.13.3 (zustandslos).

### 4.3 Risiken und wie Carl sie klein hält

| Risiko | Was passiert | Gegenmaßnahme in Carls Anleitung |
|---|---|---|
| **Offener Port im LAN** | `OLLAMA_HOST=0.0.0.0` oder „Serve on Local Network“: jeder im WLAN (Café, Hotel) kann das Modell nutzen, Modelle löschen/laden, Rechenzeit stehlen; kein Passwort | Nie einschalten. Carl braucht nur `127.0.0.1`. Bei LM Studio zusätzlich „Require Authentication“. |
| **Fremde Webseiten sprechen das Modell an** | Mit `OLLAMA_ORIGINS=*` oder LM-Studio-CORS „an“ kann **jede** besuchte Seite im Browser Anfragen an das Modell stellen (Browser fragt zwar seit Chrome 142/Firefox 153 je Seite um Erlaubnis, aber ein Klick genügt) | Nur Carls Ursprung in `OLLAMA_ORIGINS`. Bei LM Studio Authentifizierung mit Token, den Carl lokal speichert. Browser-Berechtigung nur für Carls Seite erteilen. |
| **Prompt-Injection über Fundstücke** | Kleine Modelle folgen versteckten Anweisungen in Webseiten/PDFs eher (INROOM-Test enthielt genau so eine Aufgabe; kein 8-GB-Modell bestand alles) | Lokales Modell nur für Sortieren, Zusammenfassen, Entwürfe; Werkzeuge mit Wirkung (Dateien schreiben, Senden) nur nach Rückfrage; Fundstücke als Daten markieren (siehe wissen_C, OWASP LLM01). |
| **Falsche Fakten, stilles Scheitern** | 80 % Halluzination bei Qwen3.5 4B/9B; Werkzeug-Aufrufe werden manchmal nur beschrieben statt ausgeführt (Goose-Test Juli 2026) | Carl zeigt an, welches Modell antwortet, prüft Werkzeug-Ergebnisse, bietet „mit Frontier-Modell prüfen“ an (Prinzip 4). |
| **Speicher voll, Rechner lahm** | Browser belegt bis 861 MiB VRAM; 27B auf 16 GB lässt ~8K Kontext | Carl schlägt vor, Tabs/Spiele zu schließen; wählt Modell nach Speicher; Zeitgrenze und Neuversuch. |
| **„Lokal“ ist nicht automatisch „offline“** | Ollama bietet Cloud-Modelle (`:cloud`) und Websuche; Paketinstallationen gehen ins Netz | Carl zeigt Lokal/Cloud deutlich an; `OLLAMA_NO_CLOUD=1` als Option „ganz privat“. |
| **Browser-Berechtigung versehentlich blockiert** | Alle Anfragen scheitern, bis die Seite wieder erlaubt wird | Carl erklärt: Chrome → Schloss-Symbol → „Apps auf diesem Gerät“ an (Chrome ≤144: „Zugriff auf lokales Netzwerk“); Firefox → Einstellungen → Berechtigungen → „Geräte-Apps und -Dienste“. |

### 4.4 Empfehlung an die Werkstatt (kompakt)
1. **Standardweg:** Ollama (Mac und Windows) über `http://localhost:11434/v1`, Modell nach Speicher: 8 GB → `gemma4:e2b` oder `qwen3.5:4b`; 16 GB → `qwen3.5:9b`; 16-GB-GPU/32-GB-Mac → `qwen3.8:27b` (oder `gpt-oss:20b`). Zweiter Weg LM Studio über `http://localhost:1234/v1`.
2. **Carl erzeugt die eine Zeile selbst** (`launchctl setenv …` bzw. Windows-Variable) mit seinem echten `window.location.origin` und einem Kopier-Knopf; er prüft danach mit `GET /v1/models`, ob es klappt, und unterscheidet CORS-Fehler, Berechtigungs-Fehler und „kein Server“.
3. **Browser-Hinweis vorab:** Chrome/Edge/Firefox ja; **Safari nein** – Carl sagt das vor Schritt 1, nicht nach dem Fehler.
4. **Aufgabenteilung nach Annahme 8:** lokal = sortieren, zusammenfassen, Entwürfe, kurze Fragen, Bilder beschreiben; Frontier = Fakten, lange Agenten-Läufe, Bauen von Werkzeugen. Carl zeigt immer, wer gerade antwortet.

---

## 5 · Agenten-Werkzeuge mit offenen Modellen

| Werkzeug | Form | Lokales Modell | Für Laien? | Ehrliche Qualität |
|---|---|---|---|---|
| **Goose** (Block, Apache 2.0, Linux Foundation/AAIF) | Desktop-App + CLI | eingebaute llama.cpp-Inferenz seit 24.04.2026 (kein Ollama nötig), sonst Ollama als Provider | **am ehesten** – Settings → Local Inference, Modell aus Hugging Face wählen | Erstes Laden 30–120 s; Kontext 4–8K; Gemma 4 E4B rief im AAIF-Test (09.07.2026, M3 24 GB) mehrere MCP-Werkzeuge korrekt nacheinander auf, ein 7B-Hermes beschrieb nur statt auszuführen; Block-Red-Team kompromittierte Goose über ein vergiftetes „Recipe“ → kein Auto-Approve |
| **Cline** (Apache 2.0) | VS-Code-Erweiterung | Ollama/LM Studio als Provider, fragt vor jeder Aktion | nur, wer VS Code hat | gut für kleine Änderungen; lange Mehr-Datei-Arbeit überfordert lokale Modelle (Tembo, 03.07.2026) |
| **OpenCode** (MIT) | Terminal, Desktop, IDE | `ollama launch opencode` oder `opencode.json` mit `http://127.0.0.1:11434/v1` | nein (Konfigurationsdatei) | Test 21.08.2026 (M4 Pro 24 GB): 8B-Q4-Modell **scheiterte an beiden Coding-Aufgaben** (vergaß die Aufgabe, beantwortete Fremdes); nur Verbindung und Werkzeuglesen klappten |
| **Aider** (Apache 2.0) | Terminal | Ollama | nein | Terminal-Werkzeug für Entwickler; mit kleinen Modellen schwach bei Diff-Formaten (allgemein bekannt, hier **ungeprüft**) |
| **Continue** (Apache 2.0) | VS Code/JetBrains | Ollama | nein | Mitte 2026 von Cursor übernommen, keine aktive unabhängige Entwicklung mehr (Tembo) |

**Fazit für Carl:** Keines dieser Werkzeuge ist für Otto. Goose zeigt aber, was Carl selbst einbauen sollte: eingebettete Inferenz ohne Server-Fummelei, Modellvorschlag nach freiem Speicher, sichtbare Werkzeug-Protokolle. Die Messlatte „zuverlässiger Agent“ erreichen lokal erst 27B-Modelle auf 16-GB-GPU/32-GB-Mac – und auch dort nur mit Zeitgrenze und Kontrolle.

---

## 6 · Quellen (alle am 10.10.2026 gelesen)

**Browser / Sicherheit**
- MDN, „Secure contexts“ (potentially trustworthy: 127.0.0.0/8, ::1/128, localhost, *.localhost) – developer.mozilla.org/en-US/docs/Web/Security/Secure_contexts
- Chromium-Commit 130ee686f, „Stop blocking 'http://127.0.0.1/' as mixed content“, 22.06.2016 (mkwst)
- blink-dev, „Intent to Ship: Local network access restrictions“ (Chrome 142, Loopback eingeschlossen, Mixed-Content-Ausnahme für IP-Literale/.local/targetAddressSpace, Stand Nov 2025)
- Chrome Developers Blog, „New permission prompt for Local Network Access“, 09.06.2025, Update 29.09.2025
- Dynamsoft FAQ, „Chromium 142 Local Network Access issue“, 04.11.2025, Stand 01.09.2026 (Chrome 145+: „Apps on device“/`loopback-network`)
- Okta Help, „Chrome device permissions“ (Prompt „Access other apps and services on this device“, Chrome 145), 2026
- Visualware, „Chrome LNA and WebSockets“ (Chrome 147 WebSockets, April 2026)
- OpenReplay Blog, „Chrome Local Network Access“, 08.03.2026
- Mozilla Bugzilla 1488740, „Stop treating http://localhost/ (by name) as mixed content“, fixed Firefox 84 (2020)
- Mozilla Support, „Control personal device and local network permissions in Firefox“ (Firefox 153), 2026
- MDN, „Firefox 153 for developers“ (Release 21.07.2026)
- WebKit Bugzilla 171934, „Don't treat loopback addresses … as mixed content“, offen seit 10.05.2017, Kommentare bis 19.11.2024
- WebKit Bugzilla 281149, „WebKit is inconsistent about whether localhost is a secure origin or not“, REOPENED 20.04.2026
- WebKit Bugzilla 279249, „REGRESSION (iOS 18): Loading is blocked when trying to load localhost content from HTTPS website“, fixed 11.03.2025
- WebKit Bugzilla 304164, „fetch() throws TypeError when using targetAddressSpace: 'loopback'“ (Safari 26.2), fixed 16.12.2025

**Ollama / LM Studio**
- Ollama Docs FAQ (docs.ollama.com/faq): OLLAMA_HOST Standard 127.0.0.1:11434, OLLAMA_ORIGINS, launchctl/systemd/Windows-Variablen, OLLAMA_NO_CLOUD
- Ollama Docs Quickstart (gemma4:e2b, 7,2 GB, ~8 GB empfohlen)
- Ollama Docs „OpenAI compatibility“ (`http://localhost:11434/v1`, Endpunkte, Grenzen)
- Ollama-Quelltext github.com/ollama/ollama, main vom 09.10.2026: `envconfig/config.go` (AllowedOrigins), `server/routes.go` (gin-contrib/cors v1.7.2, AllowWildcard=true)
- Ollama Blog: „Ollama's new app“ 30.07.2025; „Ollama is now powered by MLX on Apple Silicon in preview“ 30.03.2026; gpt-oss 05.08.2025
- objectgraph.com, „Ollama CORS and Port Binding“, 09.10.2024, Update 07.07.2026
- LM Studio Docs: „Server Settings“ (Enable CORS, Serve on Local Network, Require Authentication), „Serve on Local Network“ (`lms server start --bind`), „OpenAI Compatibility“ (`http://localhost:1234/v1`), „System Requirements“ (Apple Silicon, macOS 14+, AVX2, 16 GB)

**Werkzeuge / Modelle / Messungen**
- INROOM AI, „Der 8-GB-Test“, 14.09.2026 (via wissen_C.md s9)
- rapid-mlx Blog, „Best Local LLM for an 8, 16, 24 or 32 GB Mac, Measured“, 04.08.2026, Update 07.10.2026
- Atomic Chat, „Best Local LLMs for 16GB RAM or VRAM“, 23.08.2026
- benchlm.ai, „Best Local LLMs (October 2026)“, Daten 10.10.2026 (gpt-oss-20b, Qwen3.6-27B, Gemma 4 12B, Lizenzen)
- Artificial Analysis, „Qwen3.5 small models“, 05.03.2026 (Apache 2.0, Index, Halluzination 80–82 %)
- TechWyse, „Google DeepMind Releases Gemma 4 … Apache 2.0“, 12.04.2026 (Release 02.04.2026, E2B/E4B/26B-A4B/31B)
- It's FOSS, „Can You Run LLMs Locally Without a GPU?“, 15.05.2026
- OpenAlternative, „Best local LLM tools“, 24.09.2026 (Lizenzen, Ports, llama.app, GPT4All-Status, Jan 0.8.4)
- LLMHardware.io, „LM Studio vs Ollama vs Jan“, Update Mai 2026, geprüft 02.10.2026
- Glukhov, „Ollama vs vLLM vs LM Studio“, 2026
- Goose Blog, „Use goose with built-in local inference“, 24.04.2026; AAIF Blog, „Can MCP help a small local model shine“, 09.07.2026; dev.to Goose-Review, 12.07.2026
- Tembo, „Local AI Coding Agent“, 03.07.2026; kingy.ai, „OpenCode local LLMs guide v2“, 21.08.2026
- Medium (V. Nuthalapati), „MLX … Foundation Models“, 09.06.2026 (WWDC 2026, MLXLanguageModel)

---

## 7 · Ungeprüft / offen

1. **Carls tatsächlicher Ursprung** auf claude.ai (Artifact-Domain, feste oder wechselnde Unterdomäne, oder sandbox mit `Origin: null`). Bei `null` scheitert CORS grundsätzlich; dann wäre ein anderer Weg nötig. Carl muss `window.location.origin` zur Laufzeit lesen – vor dem Bau prüfen.
2. **Safari aktuell (26.x, Oktober 2026)** nicht selbst getestet; Aussage „blockiert“ stützt sich auf offene WebKit-Bugs (Stand 20.04.2026) und Nutzerberichte bis Nov 2024.
3. **Firefox 153 und Loopback:** Ob der „Device apps and services“-Dialog auch bei `http://localhost` aus https ausgelöst wird (sehr wahrscheinlich, so die Kategoriebeschreibung), nicht selbst geprüft.
4. **LM Studio „Enable CORS“:** ob `*` oder Liste; ob der Preflight `Authorization` zulässt.
5. **Ollama-App-Oberfläche:** genaue Lage von Kontextlänge/„Expose to network“ in der App-Version Oktober 2026 (Beleg nur aus Blog Juli 2026).
6. **Lizenz Qwen3.8 27B** (vermutlich Apache 2.0 wie Qwen3.5/3.6) und **Lizenz LFM2.5** („weniger freizügig“ laut Atomic Chat).
7. **Mac-Geschwindigkeiten** stammen von rapid-mlx (MLX, int4-KV-Cache) – mit Ollama/llama.cpp etwas langsamer zu erwarten; Mac-Messungen im Agenten-Test fehlen weiterhin (schon in wissen_C vermerkt).
8. **Zeiten** in der Tabelle sind Schätzungen.
9. **Aider mit kleinen Modellen:** keine 2026er Messung gefunden.
10. **Chrome-Mixed-Content für den Hostnamen `localhost`:** Commit 2016 betraf `127.0.0.1`; dass `localhost` genauso behandelt wird, folgt aus der Secure-Contexts-Angleichung und der Praxis (Shopify/Zotero berichten „works in Chrome and Firefox“), eine eigene Chromium-Quelle dafür wurde nicht gelesen. Sicherer Weg: Carl nutzt `http://127.0.0.1:11434` (IP-Literal, auch in Chromes LNA-Ausnahmeliste) – dann muss `OLLAMA_ORIGINS` Carls Ursprung enthalten, der Zielhost ist egal.
