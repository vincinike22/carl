# Carl auf Ottos Geräten · 10 Kombinationen
Recherche für Vitruvians Werkstatt · Stand 10.10.2026 · alle Quellen am 10.10.2026 geprüft (Abschnitt „Quellen“ am Ende; Kürzel wie [Q3] verweisen dorthin).

Annahme: Carl ist eine Webseite (ein veröffentlichtes Artifact oder eine eigene Adresse). „Carl als App“ heißt daher: Otto legt die Seite als eigenes Symbol in Dock, Taskleiste oder Home-Bildschirm. „Coding-Werkzeug“ heißt Claude Code oder OpenAI Codex.

Zwei Sätze, die für alle Kombinationen gelten:
- **Claude Code kostet ein Abo.** Es braucht Pro, Max, Team, Enterprise oder ein Console-Konto; der kostenlose Plan reicht nicht [Q1]. Codex ist laut OpenAI auch im kostenlosen ChatGPT-Plan enthalten, mit kleinen Grenzen [Q12].
- **Das Handy ist nur eine Fernbedienung.** Die Claude-App für iOS und Android führt keinen Code aus. Sie steuert eine Sitzung in der Cloud oder auf Ottos eigenem Rechner [Q4].

## Übersicht

| # | Kombination | Carl-App Desktop | Carl-App Handy | Coding-Werkzeug | Hürde | Zeit |
|---|---|---|---|---|---|---|
| 1 | Mac + iPhone | Safari „Zum Dock hinzufügen“ | Safari „Zum Home-Bildschirm“ | Claude Desktop (Reiter Code), Handy per Fernsteuerung | niedrig | 30–45 min |
| 2 | Windows-PC + Android | Chrome/Edge „Als App installieren“ | Chrome „Installieren“ | Claude Desktop (Code); Codex als Alternative | niedrig–mittel | 40–60 min |
| 3 | Windows + iPhone | Chrome/Edge „Als App installieren“ | Safari „Zum Home-Bildschirm“ | wie 2; iPhone als Fernbedienung | niedrig–mittel | 40–60 min |
| 4 | nur iPhone | – | Safari „Zum Home-Bildschirm“ | nur Cloud-Sitzungen in der Claude-App, nur mit GitHub | hoch | 45–90 min |
| 5 | nur Android | – | Chrome „Installieren“ | wie 4 | hoch | 45–90 min |
| 6 | Mac + iPad | Safari „Zum Dock hinzufügen“ | Safari „Zum Home-Bildschirm“ (iPad) | Claude Desktop auf dem Mac, iPad als Fernbedienung | niedrig | 30–45 min |
| 7 | Chromebook + Android | Chrome „Als App installieren“ | Chrome „Installieren“ | Claude Code im Linux-Bereich des Chromebooks, sonst Cloud | mittel–hoch | 60–90 min |
| 8 | Linux-Laptop + Android | Chrome/Chromium „Als App installieren“ | Chrome „Installieren“ | Claude Desktop (Beta, nur Ubuntu/Debian) oder Claude Code im Terminal | mittel | 45–75 min |
| 9 | Firmenlaptop (gesperrt) + iPhone | Browser-Lesezeichen; „Als App installieren“ nur, wenn erlaubt | Safari „Zum Home-Bildschirm“ | oft nicht erlaubt: IT fragen; sonst Cloud im Browser/Handy | hoch (Regeln, nicht Technik) | 15 min bis Tage |
| 10 | Mac + iPhone + gemieteter VPS | Safari „Zum Dock hinzufügen“ | Safari „Zum Home-Bildschirm“ | Claude Desktop → SSH auf den VPS; iPhone als Fernbedienung | mittel | 60–120 min |

„Zeit“ heißt: Otto braucht so lange, wenn er zum ersten Mal und ohne Vorwissen einrichtet. Abo-Abschluss und GitHub-Konto sind eingerechnet, Wartezeiten der Firmen-IT nicht.

---

## 1 · Mac + iPhone
**(a) Carl als App.** Auf dem Mac in Safari: Ablage → „Zum Dock hinzufügen“ (ab macOS Sonoma 14). Die Web-App läuft getrennt von Safari, hat eigene Cookies und eine eigene Anmeldung [Q5]. Auf dem iPhone in Safari: Teilen → „Zum Home-Bildschirm“. Ab iOS 26 gibt es dabei den Schalter „Als Web-App öffnen“ [Q6].
**(b) Coding-Werkzeug.** Claude Desktop für macOS hat Claude Code im Reiter „Code“ schon eingebaut, ohne Terminal und ohne Node.js [Q2][Q3]. Vom iPhone aus steuert Otto die Sitzung mit „Remote Control“ (im Reiter Code der Claude-App). Der Mac muss dafür an bleiben [Q4][Q7]. Codex gibt es ebenfalls als Mac-App (nur Apple Silicon) [Q13].
**(c) Grenzen.** Ohne Bezahl-Abo gibt es keinen Reiter „Code“ [Q3]. Die Web-App im Dock teilt keine Anmeldung mit Safari, Otto meldet sich also einmal neu an [Q5].
**(d) Anleitung.**
1. Claude von claude.com/download laden und öffnen, anmelden.
2. Oben auf „Code“ klicken, „Lokal“ wählen, einen Ordner „Carl-Werkstatt“ anlegen und auswählen.
3. Carl in Safari öffnen → Ablage → „Zum Dock hinzufügen“ → „Hinzufügen“.
4. Auf dem iPhone die Claude-App laden und mit demselben Konto anmelden.
5. Carl in Safari öffnen → Teilen → „Zum Home-Bildschirm“ → „Als Web-App öffnen“ an → „Hinzufügen“.
6. Am Mac in der Code-Sitzung `/remote-control` eingeben; auf dem iPhone unter „Code“ die Sitzung antippen.
**(e) Zeit:** 30–45 min. **(f) Quellen:** Q1–Q7, Q13.

## 2 · Windows-PC + Android
**(a)** In Chrome: Menü (drei Punkte) → „Streamen, speichern und teilen“ → „Seite als App installieren …“ [Q8]. In Edge heißt der Weg ähnlich (siehe „Ungeprüft“). Auf Android in Chrome: Menü → „Installieren und Verknüpfung erstellen“ → „Installieren“ [Q9].
**(b)** Claude Desktop für Windows gibt es für x64 und ARM64, mit eingebautem Reiter „Code“ [Q3]. Wer lieber das Terminal nutzt: Claude Code läuft unter Windows 10 (ab 1809) und Windows 11, ohne Admin-Rechte. Git für Windows ist nur empfohlen, nicht Pflicht [Q1]. Codex lässt sich per PowerShell installieren und mit „Sign in with ChatGPT“ anmelden [Q11]. Das Android-Handy steuert per Remote Control [Q7].
**(c)** Ohne Admin-Rechte installiert sich Claude Desktop zwar, aber ohne Cowork [Q14]. Ob Carl in Chrome auf Android als echte App oder nur als Verknüpfung landet, hängt von der Seite ab (siehe „Ungeprüft“).
**(d)**
1. Claude von claude.com/download installieren, anmelden, Reiter „Code“ öffnen.
2. „Lokal“ wählen und einen Ordner „Carl-Werkstatt“ auswählen.
3. Carl in Chrome öffnen → drei Punkte → „Streamen, speichern und teilen“ → „Seite als App installieren“.
4. Auf dem Handy die Claude-App aus dem Play Store laden, mit demselben Konto anmelden.
5. Carl in Chrome öffnen → drei Punkte → „Installieren und Verknüpfung erstellen“ → „Installieren“.
6. Am PC `/remote-control` eingeben; auf dem Handy unter „Code“ die Sitzung öffnen.
**(e)** 40–60 min. **(f)** Q1, Q3, Q7–Q9, Q11, Q14.

## 3 · Windows + iPhone
**(a)** Auf dem Desktop wie bei 2, auf dem Handy wie bei 1 (Safari).
**(b)** Wie bei 2. Das iPhone ist die Fernbedienung [Q4][Q7].
**(c)** Die Kombination ist kein Problem, weil alles über das gleiche Claude-Konto läuft. Nur „Zum Dock“ gibt es unter Windows nicht; dort heißt es „als App installieren“.
**(d)** Schritte 1–3 wie bei 2; Schritte 4–6 wie bei 1.
**(e)** 40–60 min. **(f)** Q1, Q3, Q6–Q8.

## 4 · Nur iPhone
**(a)** Safari → Teilen → „Zum Home-Bildschirm“ → „Als Web-App öffnen“ [Q6].
**(b)** Nur über Cloud-Sitzungen: In der Claude-App wählt Otto unter „Code“ einen GitHub-Speicherort und beschreibt die Aufgabe. Die Arbeit läuft auf Anthropics Rechnern weiter, auch wenn das Handy weggelegt ist [Q4][Q10]. Codex Cloud ist laut OpenAI auch auf dem Handy nutzbar [Q11][Q12].
**(c)** Ohne GitHub-Konto geht es praktisch nicht, denn Cloud-Sitzungen holen und speichern ihren Code über GitHub [Q10]. Lokale Erweiterungen (MCP-Server, eigene Programme) laufen auf dem Handy nicht. Das Fachwort „GitHub“ lässt sich nicht vermeiden; es ist ein Online-Regal für Projektdateien.
**(d)**
1. Claude-App laden, Pro-Abo abschließen.
2. Auf github.com ein kostenloses Konto anlegen und einen leeren Speicherort „carl-werkstatt“ anlegen.
3. In der Claude-App unter „Code“ GitHub verbinden (die App führt durch die Freigabe).
4. Speicherort wählen, Aufgabe in einfachen Worten schreiben, absenden.
5. Ergebnis in der Sitzung ansehen, mit Nachrichten nachsteuern.
6. Carl in Safari als Web-App auf den Home-Bildschirm legen.
**(e)** 45–90 min (das meiste ist GitHub). **(f)** Q4, Q6, Q10–Q12.

## 5 · Nur Android
**(a)** Chrome → Menü → „Installieren und Verknüpfung erstellen“ [Q9].
**(b)** Wie bei 4 über die Claude-App für Android [Q4].
**(c)** Wie bei 4. Ob es eine Codex-App für Android gibt, ist ungeprüft.
**(d)** Wie bei 4; Schritt 6 mit Chrome statt Safari.
**(e)** 45–90 min. **(f)** Q4, Q9, Q10.

## 6 · Mac + iPad
**(a)** Wie bei 1. Auf dem iPad gilt derselbe Weg wie auf dem iPhone. Die Claude-App ist auf dem iPad dieselbe iOS-App [Q4].
**(b)** Der Mac arbeitet, das iPad steuert per Remote Control [Q7].
**(c)** Auf dem iPad selbst läuft kein Claude Code.
**(d)** Wie bei 1, „iPhone“ durch „iPad“ ersetzen.
**(e)** 30–45 min. **(f)** Q1–Q7.

## 7 · Chromebook + Android
**(a)** Chrome → „Seite als App installieren“ [Q8]. Auf Android wie bei 5.
**(b)** Otto schaltet unter Einstellungen → Über ChromeOS → Entwickler die „Linux-Entwicklungsumgebung“ ein. Das ist ein Debian-System im Chromebook und braucht etwa 10 Minuten Einrichtung [Q15]. Dort installiert er Claude Code mit dem Installationsbefehl, denn Claude Code läuft auf Debian 10+ mit mindestens 4 GB RAM [Q1]. Gelingt das nicht: Cloud-Sitzungen über claude.ai/code im Browser [Q10].
**(c)** Auf Schul- oder Firmen-Chromebooks ist Linux oft gesperrt [Q15]. Cowork der Desktop-App läuft unter ChromeOS nicht [Q16]. Günstige Chromebooks mit 4 GB RAM sind an der Grenze. Die Desktop-App unter ChromeOS ist ungeprüft.
**(d)**
1. Einstellungen → Über ChromeOS → Entwickler → Linux „Einrichten“ (etwa 10 min warten).
2. Im Terminal-Fenster `curl -fsSL https://claude.ai/install.sh | bash` einfügen, Enter.
3. Neues Terminal öffnen, `claude` eingeben, Anmeldung im Browser bestätigen.
4. Carl in Chrome als App installieren.
5. In Claude Code `/remote-control` eingeben; Handy als Fernbedienung.
6. Falls Schritt 1 gesperrt ist: claude.ai/code im Browser nutzen (wie 4).
**(e)** 60–90 min. **(f)** Q1, Q8–Q10, Q15, Q16.

## 8 · Linux-Laptop + Android
**(a)** Chrome oder Chromium → „Seite als App installieren“ [Q8]. Firefox hat keinen solchen Weg (siehe „Ungeprüft“).
**(b)** Claude Desktop für Linux ist Beta und läuft nur auf Ubuntu 22.04+ oder Debian 12+ (x86_64/arm64). Installiert wird per apt [Q16]. Auf anderen Systemen (Fedora, Arch) nutzt Otto Claude Code im Terminal [Q1][Q16]. Codex läuft unter Linux ebenfalls [Q11].
**(c)** Unter Linux fehlen Computer Use und Diktat, und die App aktualisiert sich nicht selbst [Q16]. Für Otto ist Linux ungewöhnlich, wer es hat, kennt meist das Terminal.
**(d)**
1. Terminal öffnen.
2. `curl -fsSL https://claude.ai/install.sh | bash` einfügen, Enter.
3. `claude` eingeben, im Browser anmelden.
4. (Ubuntu/Debian, wahlweise) Claude Desktop per apt nach [Q16] installieren.
5. Carl in Chrome als App installieren.
6. Android-Handy: Claude-App, `/remote-control`.
**(e)** 45–75 min. **(f)** Q1, Q8, Q11, Q16.

## 9 · Firmenlaptop mit gesperrten Rechten + iPhone
**(a)** Der Browser-Weg (Lesezeichen oder „Als App installieren“) klappt oft, wenn die IT das nicht abgeschaltet hat (siehe „Ungeprüft“). Auf dem iPhone wie bei 1.
**(b)** Technisch braucht Claude Code unter Windows keine Admin-Rechte [Q1]. Auch Claude Desktop installiert sich ohne Admin, dann aber ohne Cowork [Q14]. Firmen sperren Programme aber oft per Regel (AppLocker), und Netzwerk-Proxys können Downloads blockieren [Q14]. Bei Team- und Enterprise-Konten muss ein Admin Remote Control und Cloud-Sitzungen erst einschalten [Q7][Q10].
**(c)** Ehrlich: Hier entscheidet nicht Otto, sondern die IT. Firmendaten an eine KI zu geben, kann gegen Firmenregeln verstoßen. Carl soll in diesem Fall nichts umgehen.
**(d)**
1. Die IT fragen: „Darf ich Claude Desktop oder Claude Code benutzen?“
2. Wenn ja: Claude von claude.com/download installieren, ohne Admin-Rechte.
3. Wenn nein: Carl und Claude privat auf dem iPhone nutzen (wie 4), ohne Firmendaten.
4. Carl auf dem iPhone als Web-App auf den Home-Bildschirm legen.
5. Beruf und Privat trennen: eigenes privates Konto.
6. Nichts mit Tricks umgehen.
**(e)** 15 min bis mehrere Tage (Wartezeit der IT). **(f)** Q1, Q7, Q10, Q14.

## 10 · Mac + iPhone + gemieteter VPS
Ein VPS ist ein gemieteter Computer im Rechenzentrum, der Tag und Nacht läuft.
**(a)** Wie bei 1.
**(b)** Der einfachste Weg: In Claude Desktop (Reiter Code) wählt Otto die Umgebung „SSH“ → „Add SSH connection…“. Dort trägt er einen Namen, `benutzer@adresse`, den Port (22) und wahlweise einen Schlüssel ein. Desktop installiert Claude Code beim ersten Verbinden selbst auf dem VPS. Der VPS muss Linux oder macOS haben [Q17]. Ohne Desktop geht es mit `ssh benutzer@adresse` im Mac-Terminal und dem Installationsbefehl [Q1]. Läuft auf dem VPS `claude remote-control`, steuert das iPhone die Arbeit, und der Mac darf aus sein [Q7]. Für Notfälle bieten Anbieter wie Hetzner eine Konsole im Browser [Q18].
**(c)** SSH ist ein Fachwort, das sich nicht vermeiden lässt; es ist ein sicherer Fernzugang zum gemieteten Rechner. Damit die Sitzung weiterläuft, wenn Otto das Terminal schließt, braucht es ein Hilfsprogramm (z. B. tmux). Das ist ungeprüft, ob Remote Control das selbst löst. Für den VPS braucht Otto Pflege (Updates, Sicherheit), das sprengt eher das Wochenende.
**(d)**
1. VPS mieten (Linux, z. B. Ubuntu); Adresse und Passwort aus der Mail notieren.
2. Claude Desktop → Code → Umgebung „SSH“ → „Add SSH connection…“.
3. Namen „Werkstatt-Server“, Host `root@<Adresse>` eintragen, speichern, verbinden.
4. Warten, bis Desktop Claude Code auf dem Server eingerichtet hat; im Browser anmelden.
5. Auf dem Server `claude remote-control` starten lassen.
6. iPhone: Claude-App → Code → Sitzung öffnen.
**(e)** 60–120 min. **(f)** Q1, Q7, Q17, Q18.

---

## MCP lokal (gilt für 1, 2, 3, 6, 8, 10)
- **Claude Desktop:** Claude-Menü → Einstellungen → Entwickler → „Edit Config“ öffnet `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/`, Windows: `%APPDATA%\Claude\`). Viele Server brauchen Node.js; nach dem Speichern die App ganz neu starten [Q19].
- **Claude Code:** `claude mcp add <name> -- <befehl>`. Mit `claude mcp add-from-claude-desktop` übernimmt Otto die Desktop-Einträge, aber nur unter macOS und WSL [Q20].
- **Handy:** Lokale MCP-Server laufen dort nicht. Über Remote Control nutzt das Handy aber die MCP-Server auf Ottos Rechner [Q7].

## Was Carl daraus lernen sollte
Es gibt drei Wege, und Carl sollte Otto beim ersten Treffen nur fragen: „Hast du einen Computer, der an bleiben darf?“ Mit Mac oder Windows ist Claude Desktop mit dem Reiter Code der eine Weg ohne Terminal, und das Handy wird zur Fernbedienung. Das trägt für die Mehrheit der Kombinationen (1, 2, 3, 6). Wer nur ein Handy hat, braucht GitHub und die Cloud, und das sollte Carl ehrlich als den schwereren Weg benennen. Bei Firmengeräten ist die richtige Antwort „frag deine IT“, nicht ein Trick. Carl selbst sollte als Web-App mit sauberer Installierbarkeit gebaut sein, damit „Zum Dock“ und „Zum Home-Bildschirm“ überall ein echtes App-Gefühl geben.

## Ungeprüft (nicht belegt, vor Verwendung prüfen)
1. Genaue Menüpfade in Edge („Apps → Diese Website als App installieren“) und die deutschen Menütexte in Chrome, Safari und Claude Desktop. Die Quellen waren englisch, die deutschen Namen sind sinngemäß übersetzt.
2. Ob eine Carl-Seite auf claude.ai (Artifact) als echte Web-App installierbar ist oder nur als Verknüpfung; das hängt davon ab, ob die Seite ein Web-App-Manifest hat. Ebenso, ob private Artifacts in der Dock-Web-App die Anmeldung behalten.
3. Ob Artifacts sich in den Claude-Apps (Desktop/iOS/Android) „anheften“ lassen. Der Hilfeartikel nennt nur Ansehen und Veröffentlichen in allen Apps [Q21]. Anheften in der claude.ai-Seitenleiste kennt das Artifact-Werkzeug dieser Sitzung, öffentlich belegt ist es nicht.
4. iOS-Schritte „Als Web-App öffnen“ stützen sich auf eine Zweitquelle (ithinkdiff) [Q6]. Die Apple-Hilfe war beim Abruf nicht lesbar.
5. Mindestversionen von iOS und Android für die Claude-App. Codex auf Android. Genaue Codex-Windows-Unterstützung (nativ oder WSL) und die Codex-Windows-App.
6. Ob Claude Desktop unter ChromeOS-Linux (Debian 12) läuft.
7. Wie der Login von Claude Code auf einem VPS ohne Bildschirm abläuft (vermutlich Link zum Kopieren). Ob Remote Control ohne tmux dauerhaft weiterläuft.
8. SSH vom iPhone direkt (Apps wie Termius) wurde nicht geprüft und nicht empfohlen.
9. Codex-Preise und -Grenzen ändern sich laufend [Q12]. Die Modellnamen auf der Preisseite wurden nicht gegengeprüft.
10. Zeitangaben sind Schätzungen, nicht gemessen.

## Quellen (alle geprüft 10.10.2026)
- Q1 Claude Code Setup: https://code.claude.com/docs/en/setup
- Q2 Download-Seite Claude: https://claude.com/download
- Q3 Desktop-Quickstart (Reiter Code, Umgebungen Lokal/Cloud/SSH/WSL): https://code.claude.com/docs/en/desktop-quickstart
- Q4 Claude Code auf dem Handy: https://code.claude.com/docs/en/mobile
- Q5 Apple, Safari-Web-Apps auf dem Mac: https://support.apple.com/en-au/104996
- Q6 iOS 26 Home-Bildschirm (Zweitquelle): https://www.ithinkdiff.com/add-web-app-bookmark-iphone-home-screen-ios-26/
- Q7 Remote Control: https://code.claude.com/docs/en/remote-control
- Q8 Chrome-Hilfe, Web-Apps (Computer): https://support.google.com/chrome/answer/9658361
- Q9 Chrome-Hilfe, Web-Apps (Android): https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid
- Q10 Claude Code in der Cloud: https://code.claude.com/docs/en/claude-code-on-the-web
- Q11 Codex (GitHub-README, Installation, Anmeldung): https://github.com/openai/codex · Quickstart: https://learn.chatgpt.com/docs/quickstart?setup=cli
- Q12 Codex-Preise und Pläne: https://learn.chatgpt.com/docs/pricing
- Q13 Codex-Desktop-App: https://learn.chatgpt.com/docs/app
- Q14 Claude Desktop für Windows bereitstellen: https://support.claude.com/en/articles/12622703
- Q15 Linux auf dem Chromebook: https://support.google.com/chromebook/answer/9145439
- Q16 Claude Desktop unter Linux (Beta): https://code.claude.com/docs/en/desktop-linux
- Q17 Desktop-Referenz, SSH-Sitzungen: https://code.claude.com/docs/en/desktop
- Q18 Hetzner-Konsole im Browser: https://docs.hetzner.com/de/cloud/servers/getting-started/vnc-console
- Q19 Lokale MCP-Server in Claude Desktop: https://modelcontextprotocol.io/docs/develop/connect-local-servers
- Q20 MCP in Claude Code: https://code.claude.com/docs/en/mcp
- Q21 Artifacts veröffentlichen und teilen: https://support.claude.com/en/articles/9547008-discovering-publishing-customizing-and-sharing-artifacts
- Ergänzend: Windows-SSH-Client eingebaut: https://learn.microsoft.com/en-us/windows/terminal/tutorials/ssh
