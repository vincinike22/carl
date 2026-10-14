# OpenAI Codex für Otto · Recherche (Stand 10.10.2026)

Zweck: Carls Blatt „Mit deinem Rechner verbinden“ soll für Codex dieselbe Qualität haben wie für Claude Code (vgl. `werkstatt/s7/GERAETE.md`, `werkstatt/s8/AUFTRAG.md`). Alles unten ist am 10.10.2026 geprüft; die Codex-Fassung 0.162.1 wurde im Container selbst installiert und befragt (`codex --version`, `codex --help`, `codex login --help`). Was nicht belegbar war, steht unter „Ungeprüft“.

## Drei Dinge, die 2026 anders sind als gedacht
1. **Es gibt keine eigene „Codex-App“ mehr.** Codex steckt seit 9.7.2026 in der **ChatGPT-Desktop-App** (Mac, Windows; Linux seit 11.8.2026 als Vorschau). Die Handy-Seite ist die normale **ChatGPT-App** mit dem Reiter „Codex“ [Q6][Q7][Q8][Q13].
2. **Kostenlos heißt nur Desktop-App.** Free und Go dürfen Codex in der Desktop-App probieren („subject to rollout“). Das Terminal-Werkzeug (CLI), Codex Cloud und die Handy-Fernsteuerung stehen in der Tabelle erst ab Plus (20 $/Monat). Mit einem API-Schlüssel geht die CLI auch ohne Abo, dann zahlt Otto pro Nutzung [Q3].
3. **Codex fragt weniger, ist aber eingezäunt.** Standard in einem Git-Ordner ist „Auto“: Codex ändert Dateien im Projektordner **ohne zu fragen**, fragt aber vor allem außerhalb (Netz, fremde Ordner). Der Zaun ist technisch (macOS Seatbelt, Linux bubblewrap, Windows-Sandbox). Für Anfänger, die „erst fragen“ wollen, gibt es die Stufe **Read-only** [Q4][Q5].

---

## Übersichtstabelle

| Gerät | Installation | Anmeldung | Versionsbefehl | Freigabe-Modus für Otto | Hürde | Zeit |
|---|---|---|---|---|---|---|
| **Mac** (Apple Silicon oder Intel) | Terminal: `curl -fsSL https://chatgpt.com/codex/install.sh \| sh` · oder `brew install --cask codex` · oder ChatGPT-Desktop-App von chatgpt.com/download [Q1][Q2][Q6] | `codex` tippen → „Sign in with ChatGPT“ → Browser öffnet sich [Q2][Q9] | `codex --version` → z. B. `codex-cli 0.162.1` [Q10] | Beim ersten Start: Ordner als vertraut bestätigen, dann `/permissions` → Read-only [Q4][Q5] | niedrig | 20–30 min |
| **Windows 10/11** | PowerShell (neu öffnen): `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 \| iex"` · oder Desktop-App [Q1][Q2][Q11] | wie Mac; Codex läuft nativ in PowerShell, kein WSL nötig [Q11] | `codex --version` [Q10] | wie Mac. Windows-Sandbox braucht Windows 11 (empfohlen) oder Win 10 ab 1809 [Q11] | niedrig–mittel | 30–45 min |
| **Linux** (Ubuntu/Debian/Fedora/Arch) | Terminal: `curl -fsSL https://chatgpt.com/codex/install.sh \| sh` · Desktop-App als .deb/.rpm (Vorschau) [Q1][Q2][Q8] | wie Mac | `codex --version` [Q10] | wie Mac. Sandbox braucht `bubblewrap` (`bwrap`); Ubuntu kann einen AppArmor-Handgriff brauchen [Q5] | mittel | 30–60 min |
| **Server / VPS** (Linux, per SSH, kein Bildschirm) | Terminal auf dem Server: `curl -fsSL https://chatgpt.com/codex/install.sh \| sh` [Q1][Q2] | `codex login --device-auth` (Beta; vorher in ChatGPT-Einstellungen „Sicherheit“ einschalten). Notlösung: `ssh -L 1455:localhost:1455 user@server` und dann `codex login` [Q9] | `codex --version` [Q10] | Im Terminal `codex --sandbox read-only --ask-for-approval on-request`; oder in `~/.codex/config.toml` festschreiben [Q4][Q5] | mittel–hoch | 45–90 min |

„Zeit“: Otto zum ersten Mal, ohne Vorwissen, inkl. Abo-Abschluss. Das Terminal muss er einmal finden (Mac: Programme → Dienstprogramme → Terminal; Windows: Start → „PowerShell“; Linux: Strg+Alt+T).

Fachwörter in einem Satz:
- **CLI / Terminal:** Das Textfenster, in dem man Befehle tippt. Codex „CLI“ ist Codex in diesem Fenster.
- **Sandbox:** Ein Zaun um Codex. Innerhalb darf es arbeiten, außerhalb muss es fragen oder darf gar nicht.
- **Freigabe (Approval):** Codex hält an und fragt: „Darf ich das?“
- **Git-Ordner / versioniert:** Ein Projektordner mit Verlauf (man kann jede Änderung rückgängig machen). Codex vertraut solchen Ordnern mehr.
- **Device-Code:** Anmeldung ohne Browser auf dem Gerät: Codex zeigt einen Link und einen kurzen Code; Otto öffnet den Link am Handy und tippt den Code ein.
- **SSH:** Sicherer Fernzugang zu einem gemieteten Rechner.
- **API-Schlüssel:** Eine lange Zeichenkette statt Anmeldung per Konto; Abrechnung pro Nutzung statt Abo.

---

## Anleitungen (höchstens 6 Schritte je Gerät)

### Mac
Voraussetzung: ChatGPT-Konto mit Plus oder höher (für die CLI) [Q3]. Ohne Abo: Desktop-App ausprobieren (Free/Go, „subject to rollout“) oder API-Schlüssel.
1. Terminal öffnen (Programme → Dienstprogramme → Terminal, oder Spotlight: „Terminal“).
2. Diese Zeile einfügen, Enter: `curl -fsSL https://chatgpt.com/codex/install.sh | sh` [Q1][Q2]. (Alternative für Homebrew-Nutzer: `brew install --cask codex`.)
3. Terminal schließen, neu öffnen, `codex --version` tippen. Erwartet: `codex-cli 0.16x.x` [Q10]. Diese Zeile ist auch Carls Verbinden-Prüfung.
4. In den Projektordner wechseln (`cd ~/Carl-Werkstatt`), `codex` tippen, „Sign in with ChatGPT“ wählen; der Browser öffnet sich, anmelden, zurück ins Terminal [Q2][Q9].
5. Codex fragt beim ersten Start nach dem Ordner (vertrauen ja/nein). Dann `/permissions` tippen und **Read-only** wählen: Codex liest und schlägt vor, ändert aber nichts ohne Ja [Q4][Q5].
6. Wahlweise ChatGPT-Desktop-App von chatgpt.com/download laden: dort liegt Codex ohne Terminal, und unter Einstellungen → Verbindungen → „Control this Mac or PC“ wird das iPhone zur Fernbedienung (QR-Code scannen) [Q6][Q7].

### Windows
1. Start-Menü → „PowerShell“ tippen → öffnen (ein neues Fenster, keine alte Sitzung) [Q2].
2. Zeile einfügen, Enter: `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"` [Q1][Q2]. Das Wort „ByPass“ hebt nur für diesen einen Befehl die Skript-Sperre auf. Alternative mit Node.js: `npm install -g @openai/codex`.
3. PowerShell schließen, neu öffnen, `codex --version` [Q10].
4. `cd` in den Projektordner, `codex`, „Sign in with ChatGPT“, Browser bestätigt [Q2][Q9].
5. `/permissions` → Read-only [Q4]. Codex läuft nativ in PowerShell mit Windows-Sandbox; WSL ist nicht nötig. Windows 11 empfohlen; Windows 10 nur ab Version 1809 [Q11].
6. Wahlweise ChatGPT-Desktop-App (chatgpt.com/download), dann Handy koppeln wie beim Mac [Q6][Q7]. Auf Firmen-PCs kann die Sandbox-Einrichtung („elevated“) durch die IT gesperrt sein [Q11].

### Linux (Laptop)
1. Terminal öffnen (Strg+Alt+T).
2. `curl -fsSL https://chatgpt.com/codex/install.sh | sh` [Q1][Q2].
3. Neues Terminal, `codex --version` [Q10].
4. Sandbox-Hilfsprogramm sicherstellen: Ubuntu/Debian `sudo apt install bubblewrap`. Codex nimmt das erste `bwrap` im PATH, sonst einen mitgelieferten Helfer, der „unprivileged user namespaces“ braucht. Auf neuen Ubuntu-Versionen kann AppArmor im Weg stehen; OpenAI nennt dafür das Profil `bwrap-userns-restrict` oder als letzte Lösung `kernel.apparmor_restrict_unprivileged_userns=0` [Q5].
5. `cd` in den Projektordner, `codex`, „Sign in with ChatGPT“, `/permissions` → Read-only [Q2][Q4][Q9].
6. Wahlweise ChatGPT-Desktop-App als Vorschau: Ubuntu 24.04/26.04, Debian 13, Fedora 43/44, Arch; `.deb` mit `sudo apt install ./chatgpt_amd64.deb`, Fedora `sudo dnf install ./chatgpt.x86_64.rpm`. Ohne Computer Use, Wayland experimentell [Q8]. Die Handy-Kopplung („Control this Mac or PC“) ist laut Doku nur für Mac- und Windows-Hosts beschrieben [Q7].

### Server / VPS (Linux, per SSH, ohne Bildschirm)
Ein VPS ist ein gemieteter Computer im Rechenzentrum, der Tag und Nacht läuft. Hier gibt es keinen Browser, deshalb ist die Anmeldung der Knackpunkt.
1. Vorher am Handy oder Computer in ChatGPT: Einstellungen → Sicherheit → Device-Code-Anmeldung einschalten (Beta; bei Firmen-Workspaces muss das ein Admin tun) [Q9][Q14].
2. Per SSH auf den Server (`ssh root@<Adresse>` im Mac-Terminal oder in PowerShell), dort `curl -fsSL https://chatgpt.com/codex/install.sh | sh`, neu einloggen, `codex --version` [Q1][Q2][Q10].
3. `codex login --device-auth` tippen. Codex zeigt einen Link und einen Code (Form `ABCD-1234`). Link am Handy öffnen, anmelden, Code eintippen, warten bis das Terminal „angemeldet“ meldet [Q9][Q14]. Prüfen: `codex login status`.
4. Falls Device-Code nicht geht: Verbindung neu aufbauen mit `ssh -L 1455:localhost:1455 root@<Adresse>`, dann `codex login`; die angezeigte Adresse im Browser **des eigenen Rechners** öffnen. Oder: am eigenen Rechner anmelden und `~/.codex/auth.json` auf den Server kopieren (vorher `mkdir -p ~/.codex`; die Datei ist ein Passwort, nie teilen) [Q9].
5. Sandbox: `sudo apt install bubblewrap` [Q5]. Codex starten mit `codex --sandbox read-only --ask-for-approval on-request`, oder dauerhaft in `~/.codex/config.toml` eintragen (siehe unten) [Q4][Q5].
6. Fernbedienung vom Handy: Codex CLI hat kein offizielles Gegenstück zu Claudes `/remote-control`. Der dokumentierte Weg geht über die ChatGPT-Desktop-App auf Mac/Windows: Einstellungen → Verbindungen → SSH-Host hinzufügen (der Server braucht einen Eintrag in `~/.ssh/config` und ein installiertes, angemeldetes `codex`); das Handy steuert dann über den Desktop-Host [Q7]. Damit die Sitzung ohne offenes Terminal weiterläuft, braucht es `tmux` oder `screen` (ungeprüft, s. u.).

---

## Sicherheit: „Erst fragen, dann ändern“ setzen

Die drei Stufen (Codex nennt sie `sandbox_mode`) [Q4][Q5][Q10]:

| Stufe | Was Codex darf | Für wen |
|---|---|---|
| `read-only` | Dateien lesen; **jede Änderung und jeder Befehl braucht ein Ja** | Otto am Anfang |
| `workspace-write` („Auto“, Standard im Git-Ordner) | Im Projektordner ändern und Befehle ausführen ohne Nachfrage; fragt vor Netzzugriff und fremden Ordnern | wer dem Ordner vertraut |
| `danger-full-access` | kein Zaun, keine Fragen | nur in Wegwerf-Umgebungen; OpenAI: „nicht empfohlen“ |

Dazu `approval_policy`: `on-request` (fragt, wenn es den Zaun verlassen will; Standard) oder `never` (fragt nie). Die alte Stufe `untrusted` („vor jedem Befehl fragen“) ist **abgeschafft**; wer sie noch in der Konfiguration hat, verhindert den Start. Ersatz: `approval_policy` weglassen und unter `[projects."/pfad/zum/ordner"]` `trust_level = "untrusted"` setzen [Q4].

Drei Wege, Read-only zu setzen:
1. **Im Gespräch:** `/permissions` tippen, Read-only wählen; `/status` zeigt die aktuelle Stufe [Q2][Q4].
2. **Beim Start:** `codex --sandbox read-only --ask-for-approval on-request` (Kurzform `-s read-only -a on-request`) [Q10].
3. **Dauerhaft** in `~/.codex/config.toml` (Textdatei; Ordner `~/.codex` ist Codex' Zuhause, veränderbar über die Umgebungsvariable `CODEX_HOME`) [Q4][Q9]:
   ```toml
   sandbox_mode    = "read-only"
   approval_policy = "on-request"
   ```
   Wenn Otto später Vertrauen hat, `sandbox_mode = "workspace-write"` (das „Auto“-Preset) [Q4].

Nie empfehlen: `--dangerously-bypass-approvals-and-sandbox` (Spitzname `--yolo`) [Q4][Q10]. Carl sollte das Wort gar nicht zeigen.

Hinweise für Carl: Codex fragt beim ersten Öffnen eines Ordners, ob es ihm vertrauen soll, und startet in nicht-versionierten Ordnern (ohne Git) ohnehin read-only [Q4]. Carls Ordner „Carl-Werkstatt“ ist zunächst kein Git-Ordner, also startet Codex dort vorsichtig. Netzzugriff ist in `workspace-write` standardmäßig aus [Q4]. Die Pfade `.git`, `.agents`, `.codex` bleiben auch im Schreibmodus geschützt [Q4].

---

## Was Otto an Codex anders merkt als an Claude Code

| Thema | Claude Code (laut GERAETE.md Q1–Q7) | Codex (Oktober 2026) |
|---|---|---|
| **Kosten** | Pro, Max, Team, Enterprise oder Console-Konto; Free reicht nicht | Free/Go: nur Desktop-App probieren („subject to rollout“); CLI, Cloud, Handy-Fernbedienung ab Plus 20 $; Pro 100/200/500 $; Business 25 $ (es heißt „Business“, nicht „Team“); API-Schlüssel pro Nutzung [Q3] |
| **Rechte** | Fragt standardmäßig vor Dateiänderungen und Befehlen; Zaun ist die Frage | Standard „Auto“: ändert im Projektordner ohne zu fragen, der Zaun ist technisch (Sandbox); „vor jedem Befehl fragen“ gibt es nicht mehr, dafür Read-only [Q4][Q5] |
| **Installation** | `curl … claude.ai/install.sh \| bash`; Desktop-App mit Reiter „Code“ ohne Terminal | `curl … chatgpt.com/codex/install.sh \| sh`, PowerShell-Einzeiler, Homebrew-Cask, npm; Desktop-App heißt **ChatGPT**, nicht Codex [Q1][Q2][Q6] |
| **Anmeldung** | Browser; VPS-Login ungeprüft | Browser; auf dem Server Device-Code (Beta, muss aktiviert werden) [Q9] |
| **Versionsbefehl** | `claude --version` | `codex --version` → `codex-cli 0.162.1` (Wort „codex-cli“ davor!) [Q10] |
| **Terminal-Bedienung** | `/remote-control`, `/mcp`, CLAUDE.md | `/permissions`, `/status`, `/model`, `/review`, `/init` erzeugt `AGENTS.md`; `codex resume`; `codex exec "…"` für Skripte; `codex update`; `codex doctor` prüft die Installation [Q2][Q10][Q12] |
| **Handy** | Claude-App, Remote Control direkt aus der CLI | ChatGPT-App (iOS; Android laut Doku für Remote Connections) → „Codex“; Kopplung nur aus der **Desktop-App** per QR, nicht aus der CLI [Q7][Q13] |
| **MCP** | `claude mcp add` | `codex mcp add <name> --url …` oder `[mcp_servers.<name>]` in config.toml; Desktop-App: Einstellungen → MCP servers [Q15] |
| **Cloud** | claude.ai/code, braucht GitHub | Codex Cloud in ChatGPT (Web/Desktop/Handy), Umgebungen aus GitHub-Repos; Anmeldung nur mit ChatGPT-Konto, nicht mit API-Schlüssel [Q3][Q9][Q16] |
| **Linux-Sandbox** | – | braucht `bubblewrap`; sonst Fehlermeldung oder AppArmor-Handgriff [Q5] |

Weitere Fakten, kompakt: Codex-Nicht-interaktiv heißt `codex exec "<Aufgabe>"`, Standard dort ist read-only, Schreiben mit `--sandbox workspace-write`; `--full-auto` ist veraltet und warnt [Q12]. IDE-Erweiterung gibt es für VS Code, Cursor, Windsurf, Xcode, JetBrains [Q17]. Die Handy-App kann Aufgaben starten, Freigaben erteilen, Diffs ansehen; der Rechner muss wach und online bleiben [Q13]. Codex Cloud: jede Aufgabe bekommt einen eigenen Arbeitsplatz, läuft weiter, wenn der Rechner schläft [Q16]. Aktuelle stabile CLI: 0.161.0 vom 7.10.2026 (GitHub Releases), über npm kam am 10.10. bereits 0.162.1 [Q10][Q18].

---

## Ungeprüft (vor Verwendung prüfen)
1. **Genaue deutsche Menütexte** in ChatGPT-App und Desktop-App („Control this Mac or PC“, „Sign in with Device Code“, Einstellungen → Sicherheit → Device-Code). Die Quellen waren englisch; der Schalter heißt laut Zweitquelle [Q14] „Allow device code login“, OpenAI selbst sagt nur „ChatGPT security settings“ [Q9].
2. **Die exakten Namen der `/permissions`-Auswahl in der CLI** (Read-only / Auto / Full access oder „Ask for approval / Approve for me / Full access“). Die Doku beschreibt die Stufen nach Funktion; die Desktop-App zeigt „Ask for approval“, „Approve for me“, „Full access“ [Q4][Q5]. Ich konnte die CLI im Container nicht interaktiv starten.
3. **Wortlaut der Vertrauensfrage** beim ersten Öffnen eines Ordners [Q4].
4. **Free/Go in der CLI:** Die Preisseite listet Free/Go nur mit Desktop-App; ob „Sign in with ChatGPT“ in der CLI mit Free scheitert oder nur stark begrenzt ist, steht nicht da [Q3]. GERAETE.md sagt „Codex ist im kostenlosen Plan enthalten“: das stimmt nur für die Desktop-App.
5. **Codex auf Android:** Die Remote-Connections-Doku nennt iOS **und** Android als Handy [Q7], die Mobile-Doku nur iOS [Q13], die Preisseite nur iOS [Q3]. Welche Codex-Funktionen Android hat, ist offen.
6. **Intel-Mac für die Desktop-App:** Die App-Seite verlinkt nur den Apple-Silicon-Download; die CLI gibt es als Intel-Binärdatei [Q1][Q6].
7. **`codex remote-control`** existiert im Quellcode als „[experimental]“-Unterbefehl [Q10]; ob er das Handy ohne Desktop-App an einen VPS bindet, ist nicht dokumentiert.
8. **Weiterlaufen auf dem Server ohne offenes Terminal** (tmux/screen) ist nicht in der Codex-Doku beschrieben.
9. **Device-Code-Anmeldung** konnte im Container nicht bis zum Code-Bildschirm getestet werden (kein Netz); Befehl und Ablauf stammen aus der offiziellen Auth-Seite [Q9] und dem Quellcode [Q10].
10. **Zeitangaben** sind Schätzungen, nicht gemessen.
11. **Mindestversionen** von macOS und Node.js (für den npm-Weg) nennt OpenAI nicht.
12. **Ungefähre Preise** und Modellnamen ändern sich laufend; GPT-5.5 wird am 14.10.2026 aus Codex entfernt [Q3][Q18].

---

## Quellen (alle am 10.10.2026 abgerufen; Seiten von learn.chatgpt.com tragen kein Datum)
- Q1 GitHub `openai/codex`, README „Lightweight coding agent that runs in your terminal“ (Installationsbefehle Mac/Linux/Windows/npm/Homebrew, Binärdateien): https://github.com/openai/codex
- Q2 „Codex CLI | ChatGPT Learn“ (Install-Tabs, Update, erste Schritte, Slash-Befehle): https://learn.chatgpt.com/docs/codex/cli
- Q3 „Pricing | ChatGPT Learn“ (Pläne Free/Go/Plus/Pro/Business/Enterprise, Funktionsmatrix, Grenzen, GPT-5.5-Abschaltung 14.10.2026): https://learn.chatgpt.com/docs/pricing
- Q4 „Agent approvals & security | ChatGPT Learn“ (approval_policy, sandbox_mode, Standards, `untrusted` abgeschafft, Plattform-Sandboxen, Flags): https://learn.chatgpt.com/docs/agent-approvals-security
- Q5 „Sandbox | ChatGPT Learn“ (Stufen, Presets, bubblewrap/AppArmor, Desktop-Menü „Ask for approval / Approve for me / Full access“): https://learn.chatgpt.com/docs/sandboxing
- Q6 „Desktop app | ChatGPT Learn“ (Download chatgpt.com/download, `codex app`, Anmeldung): https://learn.chatgpt.com/docs/app
- Q7 „Remote connections | ChatGPT Learn“ (Handy-Kopplung per QR aus der Desktop-App, SSH-Hosts, Hosts nur Mac/Windows, Handy iOS/Android): https://learn.chatgpt.com/docs/remote-connections
- Q8 „ChatGPT desktop app for Linux | ChatGPT Learn“ (Vorschau; Ubuntu 24.04/26.04, Debian 13, Fedora 43/44, Arch; apt/dnf-Befehle; kein Computer Use): https://learn.chatgpt.com/docs/linux/linux-app · Zweitquelle: OMG! Ubuntu, „ChatGPT desktop app is now available for Linux (in preview)“, 11.8.2026: https://www.omgubuntu.co.uk/2026/08/chatgpt-desktop-app-linux-preview
- Q9 „Authentication | ChatGPT Learn“ (Sign in with ChatGPT vs. API-Schlüssel, `codex login status`, `codex logout`, `~/.codex/auth.json`, `CODEX_HOME`, Abschnitt „Login on headless devices“: Device-Code (Beta), auth.json kopieren, `ssh -L 1455:localhost:1455`): https://learn.chatgpt.com/docs/auth (Weiterleitung von https://developers.openai.com/codex/auth)
- Q10 Eigener Test im Container, 10.10.2026: `npm install @openai/codex` → `codex --version` = `codex-cli 0.162.1`; `codex --help` (`-s/--sandbox` mit read-only/workspace-write/danger-full-access; `-a/--ask-for-approval` mit on-request/never; `--dangerously-bypass-approvals-and-sandbox`; Unterbefehle exec, mcp, update, doctor, resume, cloud); `codex login --help` (`status`, `--with-api-key`); `codex login status` → „Not logged in“. Quellcode `codex-rs/cli/src/main.rs` (LoginCommand `--device-auth`, `app` nur macOS/Windows, `remote-control` experimentell): https://raw.githubusercontent.com/openai/codex/main/codex-rs/cli/src/main.rs
- Q11 „Windows sandbox | ChatGPT Learn“ (nativ in PowerShell, kein WSL nötig; Windows 11 empfohlen, Win 10 ab 1809; mxc/elevated/unelevated; Firmengeräte): https://learn.chatgpt.com/docs/windows/windows-sandbox
- Q12 „Non-interactive mode | ChatGPT Learn“ (`codex exec`, Standard read-only, `--sandbox workspace-write`, `--full-auto` veraltet, `--json`, `CODEX_API_KEY`): https://learn.chatgpt.com/docs/non-interactive-mode
- Q13 „Codex on mobile | ChatGPT Learn“ (ChatGPT-App iOS → Codex; Kopplung Einstellungen → Connections → Control this Mac or PC; Rechner wach halten): https://learn.chatgpt.com/docs/mobile
- Q14 Daniel Vaughan, „Codex CLI Authentication: OAuth, Device Code, API Keys, and CI/CD Credential Management“, 1.4.2026, aktualisiert 9.10.2026 (Zweitquelle: Schalter „Allow device code login“ unter ChatGPT Settings → Security, Code-Form `ABCD-1234`, URL auth.openai.com/device, 8-Tage-Ablauf): https://codex.danielvaughan.com/2026/04/01/codex-cli-authentication-flows-credential-management/
- Q15 „Model Context Protocol | ChatGPT Learn“ (`codex mcp add`, `[mcp_servers.*]`, `codex mcp login`, Desktop-App-Einstellungen): https://learn.chatgpt.com/docs/mcp
- Q16 „Codex Cloud | ChatGPT Learn“ (Umgebungen aus GitHub-Repos, Web/Desktop/Handy): https://learn.chatgpt.com/docs/cloud
- Q17 „IDE extension | ChatGPT Learn“ (VS Code, Cursor, Windsurf, Xcode, JetBrains): https://learn.chatgpt.com/docs/ide
- Q18 „Changelog | ChatGPT Learn“ (9.7.2026 Codex in der ChatGPT-Desktop-App Mac/Windows; 11.8.2026 Linux-Vorschau; 5.9.2026 `codex mcp-server` entfernt; 6.7.2026 iOS SSH-Hosts; 8.10.2026 neueste Einträge): https://learn.chatgpt.com/docs/changelog · GitHub Releases (0.161.0 „Latest“ 7.10.2026, 0.162.0-alpha): https://github.com/openai/codex/releases
- Ergänzend: OpenAI-Hilfe „Codex in ChatGPT“ (Codex in allen Plänen inkl. Free/Go; Orte: Desktop-App, CLI, IDE, Web; `/status` zeigt Nutzung): https://help.openai.com/en/articles/11369540-codex-in-chatgpt · Engadget, „OpenAI brings its Codex coding app to Windows“, 4.3.2026: https://engadget.com/ai/openai-brings-its-codex-coding-app-to-windows-195345429.html · The New Stack, „OpenAI's ChatGPT/Codex desktop app is now on Linux“, 11.8.2026: https://thenewstack.io/openais-chatgpt-desktop-linux/
