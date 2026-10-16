# RECHERCHE s14 · Wie OpenClaw und Hermes ihre Oberflächen ordnen – und wo nicht

Recherche-Agent für Vitruvian, 16.10.2026. Thema: die **Ordnung der Oberflächen für den Nutzer**, nicht die Technik darunter (die steht in `REVERSE.md`). Primärquellen: die Doku-Dateien beider Projekte direkt aus ihren GitHub-Repos (Stand `main`, 16.10.2026), dazu Release-Notes, Issues und Reviews.

## Kurzfassung

1. Beide Projekte haben 2026 viel Ordnung nachgerüstet: OpenClaw hat mit v2026.8.1 die Control UI „chat-first“ umgebaut (Seitenleiste mit **Pages · Sessions · Users**, ein **Inbox** für alles, was Aufmerksamkeit braucht), Hermes hat eine offizielle **Hermes Desktop**-App mit einem **Simple**-Modus bekommen.
2. Trotzdem bekommt bei beiden fast jedes Harness-Teil **mehrere Orte und mehrere Wörter**: Gedächtnis liegt bei OpenClaw als Reiter auf der Agents-Seite, in den Settings, unter „Memory → Dreams → Diary“ und auf einer Importseite; bei Hermes in der Dashboard-Seite System, im Config-Formular, in der Star Map (`/journey`), in den Desktop-Settings und hinter `/memory pending`.
3. Die Wörter sind nicht stabil. OpenClaw sagt in derselben Doku „session“, „thread“, „conversation“ und „task“ für dasselbe Ding und hat die Umbenennung „session → thread“ in einem Release vollzogen, während die Seitenleiste weiter „Sessions“ heißt. Hermes nennt Zeitpläne „Cron“, „Scheduled jobs“, „Cronjobs“ und „Routines“, und „heartbeat“ meint dort drei verschiedene Dinge.
4. Hermes verteilt die gleiche Verwaltung auf **vier Oberflächen** (CLI, TUI, Web-Dashboard, Desktop) mit unterschiedlichem Umfang. Die Slash-Befehls-Referenz hat 167 Tabellenzeilen. Einige Befehle gibt es nur in der CLI, andere nur in der TUI. Wann eine Änderung wirkt, ist je nach Bereich verschieden: in der nächsten Session, nach einem Gateway-Neustart oder sofort.
5. Belegte Nutzerklagen gibt es vor allem zu OpenClaws Einstellungen („deeply nested“, „raw config editors“, „too many clicks“). Zu Hermes gibt es eher Klagen über Unfertiges und Verstecktes („completely hidden“). Für Carl heißt das: Die Lücke liegt nicht in fehlenden Funktionen, sondern darin, dass es **je Teil genau einen Ort und genau ein Wort** geben sollte.

## 1 · OpenClaw: Control UI, macOS-App, iOS-App

**Control UI** (`openclaw dashboard`, Browser; dieselbe Oberfläche steckt in der macOS-App und in der Tauri-Desktop-App): Links steht eine **Icon-Leiste** mit drei Ansichten: **Pages** (eingebaute Seiten, Dashboards, Plugin-Ziele), **Sessions** (Gespräche, Kopf-Filter **My sessions / Involving me / All owners**) und **Users**. Oben sitzt der Avatar des aktiven Agenten mit Agent-Menü (**New agent**, **See all agents**, „What can Harbor do?“). Darunter folgen **+ New conversation** und die Befehlssuche (⌘K). Unten liegen **Home** (das Home-Panel des Agenten), **Inbox** (Badge bei fehlgeschlagenen oder überfälligen Cron-Jobs, ablaufender Modell-Anmeldung, offenen Freigaben, Updates) und das Konto-Menü (**Settings, Updates, Usage**, Pairing, Hilfe). Eine Top-Leiste gibt es nicht: „The sidebar is the only navigation chrome on desktop“ (settings.md).

**Seiten (laut Feature-Referenz):**
- **Threads/Sessions** (`/sessions`, Reiter **Worktrees**): Kacheln (Anzahl, laufende Runs, ungelesen, Tokens, archiviert), eine Tabelle mit Statuspunkt, Kontext-Meter, Gruppieren nach eigenen Gruppen, Kanal, Art, Agent oder Datum, die Filter **Active / Snoozed / Archived / All**, außerdem Fork, Snooze und Umbenennen.
- **Automations** (= Cron): Kacheln (Anzahl, fehlschlagend, Scheduler-Zustand, nächstes Aufwachen), Reiter **Automations / Run history**, Filter All/Active/Paused, Starter-Vorschläge. Die Detailseite hat einen Active/Paused-Schalter, **Run now** und die Reiter Settings/Run history.
- **Usage**: Tokens und geschätzte Kosten je Session, Tag, Stunde, Modell und Werkzeug, Provider-Karten mit Kontingent und Budget, CSV/JSON-Export.
- **Agents** (Übersicht der eingerichteten Agenten: Status, letzte Aktivität, Vorschau), **Dashboards** (Galerie der Widget-Boards je Thread), **Workboard**, **Channels**, **Skills**, **Plugins** (mit ClawHub), **Devices**, **Systems**, **Approvals**, **Debug** und **Logs**.

**Settings** haben eine eigene Seitenleiste mit Suche: oben Ask OpenClaw, Profile, Appearance, Notifications. Dann die Gruppen **Connections** (Gateway, Channels, Communications, Talk, Devices), **Agents & Tools** (Agents, Labs, Models, MCP, Memory, Automation), **Privacy & Security** (Security, Secrets, Approvals) und **System** (Infrastructure, Advanced, Debug, Logs, About). **Settings → Agents** hat je Agent die Reiter Overview, Files, Tools, Skills, Channels, Automations und Memory. Das Gedächtnis selbst (Dreaming-Schalter, „Dream Diary“, Memory Wiki) ist „a tab on the Agents page“. Subagents erscheinen nicht als eigene Seite, sondern als Seitenpanel **Subagents** in Home oder im Gespräch, dazu **Processes**, ein „parallel-tasks view“ für Swarms und `/subagents list`.

**macOS-App**: eine „menu bar companion“ mit Menüleisten-Status, **Quick Chat** (⌥Space), Rechte-Dialogen und Freigabe-Prompts. „the Dashboard owns all settings UI“, und zusätzlich gibt es die Settings-Gruppe **This Mac**. **iOS-App**: Chat als „single text-and-voice surface“, **All Sessions…** mit Active/Snoozed/Archived, eine native **Approvals**-Inbox. **Settings** öffnet die Web-Settings des Dashboards (dafür braucht man `operator.admin`).

## 2 · Hermes Agent: Web-Dashboard, Desktop, TUI/CLI

Die Doku nennt selbst vier Frontends: „Desktop App“, „CLI (`hermes`) and TUI (`hermes --tui`)“ und „Web Dashboard (`hermes dashboard`) — a browser admin panel“ (desktop.md).

**Web-Dashboard** (Seitenleiste, 15 Seiten): **Status** (Gateway, die letzten 20 Sessions mit Modell und Tokens), **Chat** (die eingebettete TUI), **Config** (Formular zu `config.yaml` in Kategorien wie model, memory, approvals …), **API Keys**, **Sessions** (Reiter Chats/Automation/All, Suche, Prune), **Logs**, **Analytics** (7/30/90 Tage: Tokens, Cache, Kosten je Modell), **Cron** (Zeile: Name, Schedule, Badge enabled/paused/error, letzter und nächster Lauf; „Cost isn't shown here“), **Profiles**, **Skills** (Installed / Toolsets / Browse hub), **MCP**, **Webhooks**, **Pairing**, **Channels** und **System**. System ist eine Sammelseite für Host, Nous Portal, **Skill curator**, Gateway, **Memory**, Credential pool, Operations, Checkpoints und Shell hooks.

**Hermes Desktop** (offiziell, macOS/Windows/Linux): ein chat-zentriertes Hauptfenster. Links stehen die Tabs **Sessions | Bots** (ein Bot je Profil mit **Bot Chat** und **Routines**), darunter eine Profil-Leiste, und dann **Artifacts, Scheduled jobs, Command Center, Memory Graph, Skills, Capabilities, Messaging** (plus Kanban per Plugin). Über dem Eingabefeld sitzen **Tasks** und **Subagents**, in der Statusleiste der YOLO-Schalter und das Kontext-Meter. Rechts liegen Dateien, Terminal und Review. Es gibt die Modi **Advanced** (Standard) und **Simple**, und in Simple „rest out of the way“ Statusleiste, Terminal, Tool-Ansicht sowie Artifacts und Scheduled jobs. Settings: Appearance, Model, Providers, Chat, Workspace, Advanced, Keyboard Shortcuts, Gateways, About. Pro Profil kommen Safety, Memory & Context, Voice und Tools & Keys mit dem Chip **Applies to** dazu.

**TUI/CLI**: Alles läuft über Befehle. `/journey` (alias `/learning`, `/memory-graph`) ist die Zeitleiste dessen, was Hermes gelernt hat; in der CLI ist sie Text, in der TUI ein Overlay, im Desktop die Star Map. `/agents` (alias `/tasks`) ist der Subagent-Baum, `/skills` dient zur Suche und als Freigabe-Tor (`/skills pending`). `/curator` hat `status`, `run`, `pin` und `archive`, die Berichte liegen als `REPORT.md` unter `~/.hermes/logs/curator/`. `/usage` und `/insights` zeigen Kosten und Analytics, dazu kommen `/cron`, `/heartbeat`, `/loop`, `/goal`, `/suggestions` und `/blueprint`.

## 3 · Community-Oberflächen (belegt)

- **OpenClaw**: `openclaw-mission-control` (github.com/abhi1693/openclaw-mission-control). Ein Guide nennt es für „a team console, or reporting features that the official interface does not provide“ (verdent.ai).
- **Hermes**: Laut Bitdoze-Übersicht (Stand 14.07.2026) gibt es **Hermes WebUI** (nesquena), **Hermes Workspace** (outsourc-e), **Hermes Studio** (EKKOLearnAI, BSL-1.1), **Hermes Control Interface** (xaspx), **Scarf** (macOS, awizemann) und **Hermes One** (fathah/hermes-desktop). Hermes One lief früher selbst unter dem Namen „Hermes Desktop“ (hongkiat: „This is not an official Nous Research desktop app“). Dazu kommen Android- und iOS-Clients, denn „There is no official mobile app from Nous Research“.

## 4 · Belegte Klagen über Ordnung und Auffindbarkeit

- OpenClaw Issue #13142: „Settings are deeply nested and hard to navigate“, „No clear indication of what's important vs. advanced“, „Many sections feel like raw config editors rather than purpose-built UI“, „Current UI feels like editing a JSON file with extra steps“.
- OpenClaw Issue #138569 (nach dem Umbau): „Routine operations—such as switching sessions, tweaking parameters, or navigating settings—require too many clicks“, „The current layout lacks a clear visual hierarchy, making the screen feel crowded and difficult to parse quickly.“
- OpenClaw Issue #42463: „couldn't find the Control UI settings as a new user.“ „It's too obscure.“
- Kilo-Blog (19.03.2026) zur alten Settings-Ansicht: „It's the kind of cleanup that only matters once you notice how cluttered the old version was.“
- Hermes, r/hermesagent (u/Final_Ad_7431): „certain things like context compression seem completely hidden which i dislike“. Level1Techs (anakronox, 08.06.2026): „I couldn’t find a way to hide the TG information in the sidebar.“, und am 09.06.: „The desktop app did get de-cluttered.“
- Unordnung, die die Primär-Doku selbst zeigt:
  - Hermes: „Profile switching doesn't change which profile the gateway or cron scheduler uses“.
  - Hermes: „Skill toggles apply on the next session. MCP enable/disable and channel changes apply on the gateway restart.“
  - OpenClaw: Allein der Abschnitt „Navigation and sidebar“ der Release-Notes v2026.8.1 hat 158 Einträge, darunter „Rename chat creation to threads“, „Complete the Control UI session-to-thread rename“, „Make Control UI chat-first and retire Overview“ und „Restore sidebar navigation“.

## 5 · Tabelle: Harness-Teil → OpenClaw → Hermes → was ungeordnet ist

| Harness-Teil | OpenClaw | Hermes | Unordnung |
|---|---|---|---|
| **Gespräche/Sessions** | Rail „Sessions“; Seite „Threads“ unter `/sessions`; iOS „All Sessions…“; Home-Panel | Dashboard **Sessions** + **Status**; Desktop **Sessions \| Bots**; `/sessions`, `/resume`, `/branch` | OC: vier Wörter (session/thread/conversation/task), dazu der „Main Thread“. Hermes: Bot-Chat und Session sind zweierlei, und `/sessions` verhält sich in CLI und TUI verschieden. |
| **Werkzeuge/Skills** | Seite **Skills**, **Plugins** (ClawHub), **MCP** (Settings), Reiter Tools/Skills je Agent, Skill Workshop, `$` im Eingabefeld | Dashboard **Skills** (3 Reiter) + **MCP**; Desktop **Skills** + **Capabilities → Plugins**; `/skills`, `/tools`, `/toolsets`, `/bundles`, `/plugins` | Skill, Plugin, Tool, Toolset, MCP und Bundle sind sechs Wörter für „was er kann“, und zwar an je 3–5 Orten. |
| **Gedächtnis** | Reiter **Memory** auf der Agents-Seite (Dreams/Diary/Wiki); Settings → Memory; `/memory-import` | Dashboard **System → Memory** + Config „memory“; Desktop **Memory Graph** (`/journey`) + Settings „Memory & Context“; `/memory pending` | Anschauen, Einstellen, Freigeben und Korrigieren liegen jeweils an einem anderen Ort. |
| **Zeitpläne/Heartbeat/Cron** | Seite **Automations**; Heartbeat als „system-owned“ Automation ohne eigene Seite (ungeprüft); Doku-Wahl zwischen Automations, Heartbeat, Hooks, Webhooks, Standing Orders, Lobster | Dashboard **Cron**; Desktop **Scheduled jobs** / **Routines** / **Cronjobs**; `/cron`, `/heartbeat`, `/loop`, `/goal`, `/suggestions`, `/blueprint` | Viele Mechanismen und Namen für „er tut etwas von selbst“. Bei Hermes heißt „heartbeat“ dreierlei (Session-Befehl, Scheduler-Ticker, Gateway-Puls). |
| **Helfer/Subagents** | Panel **Subagents** (Home/Gespräch), **Processes**, parallel-tasks view, Kinder in der Seitenleiste; `/subagents` | Desktop: Rahmen **Subagents** über dem Eingabefeld, **Agents** und **Command Center**; TUI `/agents` (Ctrl+T); **Kanban** | OC: „Agents“ (eingerichtete) und „Subagents“ (Kinder) liegen nah beieinander. Hermes: „Agents“ meint im Desktop Orchestrierung, `/agents` meint Subagents, und Bots sind Profile. |
| **Kanäle** | Seite **Channels**; Settings → Connections → Channels; Reiter Channels je Agent; Advanced → Communication → Channels | Dashboard **Channels** + **Pairing** + **Webhooks**; Desktop **Messaging**; `/platforms` (alias `/gateway`) | OC: bis zu vier Orte. Hermes: Kanal, Pairing und Gateway-Neustart sind getrennt, und Änderungen wirken erst nach dem Neustart. |
| **Modelle** | Settings → **Models** (Defaults, Provider, 30-Tage-Ausgaben); Overview-Reiter je Agent; Modellwahl im Chat | Dashboard **Config** + **API Keys**; Desktop Settings **Model** + **Providers**; `/model`; die Curator-Doku verweist auf einen „dashboard Models tab“, den die Dashboard-Seitenliste nicht nennt | Schlüssel und Modell sind getrennt (`.env` vs. `config.yaml`); Defaults für alle, je Agent und je Session liegen an drei Stellen. |
| **Freigaben/Sicherheit** | **Inbox** + Seite **Approvals** (30-Tage-Verlauf); Settings → Privacy & Security; iOS-Approvals-Inbox; Exec-Allowlists | `/approvals`, `/yolo`, YOLO in der Statusleiste; Desktop Settings **Safety**; Config „approvals“; `/skills pending`, `/memory pending`; **Pairing** | OC hat **einen** Eingang (Inbox), das ist gut. Hermes hat 4–5 getrennte Freigabe-Tore ohne gemeinsamen Eingang (ungeprüft, ob Desktop sie bündelt). |
| **Kosten** | Seite **Usage**; Models-Seite (30 Tage); Tokens-Spalte in Sessions; Profile → Usage statistics | Dashboard **Analytics** + **Status**; `/usage`, `/insights`, `/topup`; Desktop: Kontext-Meter und Cache-Rate in der Statusleiste | Bei beiden sieht man an Cron/Automations keine Kosten je Job (Hermes wörtlich: „Cost isn't shown here“; OC ungeprüft). |
| **Lernschleife** | Dreaming/Diary im Memory-Reiter; Skill Workshop; Memory Wiki (Plugin) | **Skill curator** (Dashboard System; `/curator`; `REPORT.md` als Datei); `/journey`/Star Map; `/refine`, `/learn`, `/suggestions` | Das Lernen ist verstreut. Der Bericht des Curators liegt bei Hermes als Datei im Log-Ordner und nicht in der Oberfläche. |

## Was Carl daraus lernt

1. **Ein Teil, ein Raum.** Bei beiden ist dasselbe Ding Seite, Settings-Eintrag, Agent-Reiter und Befehl zugleich. Carl braucht je Harness-Teil genau einen Ort. Andere Räume dürfen höchstens auf diesen Ort *zeigen*, ihn aber nicht noch einmal enthalten.
2. **Ein Wort, das nie wandert.** OpenClaw hat „session → thread“ mitten im Betrieb umbenannt, Hermes hat vier Namen für Zeitpläne. Carls Namen-Liste muss ein Gesetz sein: ein Wort je Teil, gleich in Raum, Buch, Carls Stimme und Fehlermeldung.
3. **Ein Briefkasten für alles, was dich braucht.** OpenClaws **Inbox** ist das beste Muster aus beiden Welten: Freigaben, fehlgeschlagene Jobs und ablaufende Schlüssel landen an einer Stelle und zeigen jeweils auf ihren Ort. Bei Carl wäre das die Rezeption.
4. **Zustand und Schalter in derselben Zeile.** Gut gemacht sind die Cron-Zeile bei Hermes (Badge, letzter/nächster Lauf) und die Automations-Kacheln bei OpenClaw (fehlschlagend, nächstes Aufwachen). Was fehlt, sind die Kosten je Job. Carl zeigt pro Ding: was es tut, ob es läuft, wann zuletzt, was es kostet, und einen Schalter.
5. **Die Wirkung sofort sichtbar machen.** Bei Hermes greift eine Änderung „next session“ oder „gateway restart“, und das muss der Nutzer wissen. Carl erledigt das im Personalbereich und sagt höchstens: „gilt ab jetzt“.
6. **Simple ist kein zweites Menü.** Hermes’ Simple-Modus blendet aus, und dadurch entsteht ein zweites Layout mit eigener Speicherung. Carl hat stattdessen eine Form, die von sich aus einfach ist (Ring 0 → 1 → 2), und blendet keine Modi um.
7. **Lernen gehört in den Raum, nicht in eine Datei.** Der Curator-Bericht als Datei und die Star Map hinter einem Befehl sind das Gegenteil von Staunen. Carl zeigt im Buch, was er gelernt, verworfen und geändert hat, und man kann es dort zurücknehmen.
8. **Gesten statt Befehle.** 167 Zeilen Slash-Befehle bedeuten, dass man sich die Befehle merken muss. Carl bietet je Raum ein Verb und eine Geste an. Die Befehlspalette darf es für Bastler geben, sie ist aber nie der einzige Weg.

## Ungeprüft

- **Nicht selbst angesehen:** Ich habe keine der Oberflächen selbst geöffnet, alles stammt aus Doku und Berichten. Die Doku beider Projekte ist sehr detailliert und ändert sich schnell, kann also vom ausgelieferten Stand abweichen.
- **docs.openclaw.ai** war per WebFetch nicht erreichbar (Freigabe nicht rechtzeitig beantwortet). Gelesen habe ich stattdessen die gleichnamigen Markdown-Dateien in `openclaw/openclaw` (`main`). Die Hermes-Doku habe ich auf der Website (zwei Seiten) und als Markdown aus `NousResearch/hermes-agent` (`main`) gelesen.
- **Seitenliste der OpenClaw-Pages:** Eine vollständige Liste der „Pages“ gibt es nicht als eigene Tabelle. Ich habe sie aus der Feature-Referenz und den Settings-Texten zusammengesetzt.
- **Heartbeat bei OpenClaw:** Dass er in der Control UI keine eigene Seite hat, folgt nur daraus, dass ich ihn in den gelesenen UI-Dokus nirgends gefunden habe. Belegt ist nur, dass „Control UI and WebChat history hide heartbeat prompts“ und dass Debug den Heartbeat zeigt.
- **Kosten je Automation bei OpenClaw:** In der Doku steht nichts dazu. Dass sie fehlen, ist nicht belegt.
- **Freigabe-Bündelung im Hermes Desktop:** Ob der Desktop die Freigabe-Tore an einem Ort bündelt, ist nicht geprüft.
- **Issues:** Bei #13142, #42463 und #138569 kenne ich weder Datum noch Autor noch Status (GitHub-API und HTML waren gesperrt, gelesen nur über WebFetch). Die Zitate stammen aus dieser Zusammenfassung des Abrufwerkzeugs und nicht aus meiner eigenen Ansicht der Seite.
- **Reddit:** Den r/hermesagent-Thread habe ich nur über einen Spiegel gelesen (r.datuan.dev, Datum dort „27d ago“). Den r/openclaw-Thread zu Mission Control konnte ich nicht lesen (gesperrt).
- **Community-Projekte:** Die Liste der Hermes-Community-Oberflächen kommt aus einer einzigen Sekundärquelle (Bitdoze). Die Repos selbst habe ich nicht geöffnet. Auch zu openclaw-mission-control habe ich nur den Guide gelesen, nicht das Repo.
- **Eigene Zählungen:** 167 Slash-Zeilen und 158 Release-Einträge sind meine eigenen Zählungen per grep. Die 167 Zeilen enthalten Doppelungen zwischen der CLI- und der Messaging-Tabelle.
- **„Models tab“ bei Hermes:** Dass der Verweis der Curator-Doku ins Leere geht, kann auch heißen, dass die Dashboard-Seitenliste veraltet ist.

## Quellen (abgerufen 16.10.2026)

- github.com/openclaw/openclaw, `main`: `docs/web/control-ui.md`, `docs/web/control-ui/{sessions-and-sidebar,settings,feature-reference,panels,chat}.md`, `docs/web/dashboard.md`, `docs/web/dashboards.md`, `docs/platforms/macos.md`, `docs/platforms/ios.md`, `docs/automation/index.md`, `docs/gateway/heartbeat.md`, `docs/tools/skills.md`, `docs/concepts/memory.md`, `docs/releases/2026.8.1/the-new-web-ui.md`
- app.unpkg.com/openclaw@2026.9.2/files/skills/control-ui/SKILL.md
- github.com/openclaw/openclaw/issues/13142 · /issues/42463 · /issues/138569
- github.com/NousResearch/hermes-agent, `main`: `website/docs/user-guide/{desktop,tui,cli}.md`, `website/docs/user-guide/features/{web-dashboard,curator,skills,memory,cron,delegation}.md`, `website/docs/reference/{slash-commands,cli-commands}.md`
- hermes-agent.nousresearch.com/docs/user-guide/desktop · /docs/user-guide/features/web-dashboard
- blog.kilo.ai/p/openclaws-ui-just-got-a-quiet-overhaul (19.03.2026)
- verdent.ai/guides/openclaw/mission-control
- bitdoze.com/best-hermes-dashboards/ (22.04.2026, aktualisiert 14.07.2026)
- hongkiat.com/blog/hermes-desktop-gui-for-hermes-agent/
- forum.level1techs.com/t/llms-and-hermes-agent/250694?page=2
- r.datuan.dev/r/hermesagent/comments/1tuvyke/ (Spiegel von r/hermesagent)
- betterclaw.io/blog/hermes-agent-bugs-fixes
- community.umbrel.com/t/openclaw-on-umbrel-massive-configuration-pain/25031
