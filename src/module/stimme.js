// Carls Stimme: feste Sätze je Raum und Lage. Eine Quelle für alle Räume.
// Wer spricht: ein warmer Großvater mit junger Neugier, ein Kiesel, der dir zuhört.
// Regeln: höchstens zwei kurze Sätze, höchstens eine Frage (am Ende), Ich-Form, du,
// leise (kein Ausrufezeichen), kein Lob für Ideen, ein Witz über mich, nie über dich,
// keine Technikwörter. Was ich nicht kann, sag ich ehrlich und einfach.
var C6 = window.C6 = window.C6 || {};

var T = {
  // Arbeit
  'fertig': ['Fertig. Willst du sehen?', 'Fertig. Es liegt für dich bereit.', 'Fertig. Ich hab nichts geändert, nur hingelegt.'],
  'gespeichert': ['Liegt bei mir.', 'Aufgehoben.'],
  'rueckgaengig': ['Zurückgelegt. Wie vorher.'],

  // Dinge, die geschehen
  'geruestGeteilt': ['Dein Werkzeug hängt jetzt im Teleskop. Nur der Bauplan, nichts Privates.'],
  'nadel': ['Die Nadel steckt. Das ist der Satz, der bleibt.', 'Alles andere darf gehen. Das hier bleibt.'],
  'perle': ['Hängt als Zettel in deinem Space.'],
  'teleskop': ['Hier liegen Werkzeuge, die ich als Beispiel gebaut habe. Nimm mit, was dich anstößt.'],
  'tippen': ['Ich hör zu.'],
  'nichtDa': ['Nicht da. Na gut, doch.'],
  'platzhalter': ['Woran denkst du gerade?'],
  'beispiel': ['Ich leg hier nur Beispiele hin.'],

  // Ein Satz ans Feld wird ein Space ({kurz} = Carls Namensvorschlag, {titel} = Name des Space)
  'satz.wohin': ['Wohin damit?'],
  'satz.name': ['Ich nenn ihn „{kurz}“?'],
  'satz.nameFrei': ['Wie soll er heißen?'],
  'satz.neu': ['„{titel}“ ist da. Dein Satz ist sein Samen.'],
  'satz.haengt': ['Hängt in „{titel}“.'],

  // Was Otto schickt, wird ein Fund auf dem Tisch im Lesesaal
  'fund.link': ['Den Link leg ich dir im Lesesaal auf den Tisch.', 'Liegt im Lesesaal auf dem Tisch. Ich schau ihn mir an.'],
  'fund.text': ['Dein Text liegt jetzt im Lesesaal auf dem Tisch.'],
  'fund.zahlen': ['Deine Zahlen liegen im Lesesaal. Daraus wird ein kleiner Verlauf.'],
  'fund.hin': ['Zum Lesesaal'],
  'fund.wofuer': ['Wofür willst du das wiederfinden?'],

  // Eine gute Antwort darf bleiben: als Carls Zettel an der Leine
  'leine.chip': ['An die Leine'],
  'leine.chipZu': ['An die Leine von „{titel}“'],
  'leine.haengt': ['Hängt an der Leine von „{titel}“. Als mein Zettel, du siehst es ihm an.'],

  // Quests (Texte der Quest-Tafel, wörtlich)
  'quest.samen.titel': ['Deinen ersten Samen pflanzen'],
  'quest.samen.satz': ['Dann weiß ich, woran du gerade denkst.'],
  'quest.samen.hin': ['Schreib unten einen Satz, an den du gerade denkst. Er wird dein Samen.'],
  'quest.freund3.titel': ['Mir drei Dinge über dich erzählen'],
  'quest.freund3.satz': ['Was du bestätigst, steht in unserem Freundschaftsbuch, und ich muss nicht mehr raten.'],
  'quest.sternbild.titel': ['Zwei Planeten zu einem Sternbild verbinden'],
  'quest.sternbild.satz': ['Dann sehe ich, was bei dir zusammengehört.'],
  'quest.sternbild.hin': ['Hier oben verbindest du zwei Planeten zu einem Sternbild.'],
  'quest.werkzeug.titel': ['Ein Werkzeug in deinen Worten bauen'],
  'quest.werkzeug.satz': ['Dann weiß ich, wie du arbeiten willst, nicht nur was.'],
  'quest.werkzeug.hin': ['An der Wand hängt „Neues Werkzeug“. Sag mir in deinen Worten, was es tun soll.'],
  'quest.fund.titel': ['Einen Fund prüfen: stimmt oder stimmt so nicht'],
  'quest.fund.satz': ['Dein Urteil wiegt mehr als meine Zusammenfassung.'],
  'quest.fund.hin': ['Auf dem Tisch liegen deine Funde. Sag bei einem: stimmt, oder stimmt so nicht.'],
  'quest.ferdl.titel': ['Ferdl einen Auftrag geben'],
  'quest.ferdl.satz': ['Was er für dich nachliest, macht mich in deinem Thema klüger.'],
  'quest.ferdl.hin': ['Ferdl wartet auf Arbeit. Gib ihm ein Thema zum Nachlesen.'],
  'quest.rechte.titel': ['Sagen, was ich auf deinem Rechner darf'],
  'quest.rechte.satz': ['Dann verbindest du, weil du es verstehst, nicht weil ich frage.'],
  'quest.rechner.titel': ['Mich mit deinem Rechner verbinden'],
  'quest.rechner.satz': ['Dann weiß ich, dass dort ein Helfer läuft, und das UFO wacht auf.'],
  'quest.modell.titel': ['Carl auf deinem Rechner mitdenken lassen'],
  'quest.modell.satz': ['Dann kann ich auf deinem Rechner mitdenken, gratis und privat.'],
  'quest.github.titel': ['GitHub verbinden'],
  'quest.github.satz': ['Kommt, sobald ich dort wirklich etwas für dich tun und es prüfen kann.'],
  'garage.tafel': ['Die Tafel zeigt, was uns beide klüger macht. Münzen gibt es fürs Verstehen, nie fürs bloße Ja.'],
  'verbinden.rechte.frage': ['Sag es mit deinen Worten. Was darf ich auf deinem Rechner?'],
  'verbinden.rechte.kurz': ['Ein ganzer Satz, bitte. Ich will hören, wie du es sagst.'],
  'verbinden.rechte.abschrift': ['Das sind meine Worte. Ich will deine hören.'],
  'verbinden.rechte.grenze': ['Fast. Ich darf nur eins: wissen, dass es bei dir läuft. Steuern und hineinschauen kann ich nicht. Sag es noch einmal mit deinen Worten?'],
  'verbinden.rechte.gut': ['Genau. Jetzt weißt du es, nicht nur ich.'],

  // Werkzeug bauen: Otto sagt in einem Satz, was ihm fehlt, Carl baut es ({werkzeug}, {titel} mitgeben)
  'werkzeug.erst': ['Sag mir in einem Satz, was dir fehlt. Ich bau dir das Werkzeug dazu.'],
  'werkzeug.wunsch': ['Was soll dein Werkzeug können?'],
  'werkzeug.baut': ['Ich bau es dir …'],
  'werkzeug.gebaut': ['So hab ich es gebaut. Probier es aus.'],
  'werkzeug.vorlage': ['Mitdenken kann ich hier noch nicht, darum aus einer Vorlage. Probier es aus.'],
  'werkzeug.anders': ['Was soll anders sein?'],
  'werkzeug.wohin': ['Wo soll es stehen?'],
  'werkzeug.steht': ['„{werkzeug}“ steht jetzt in „{titel}“, neben mir.'],
  'werkzeug.ohneSpace': ['Fertig. Es steht neben mir an der Rezeption.'],
  'werkzeug.geteilt': ['Hängt im Teleskop. Andere dürfen es sich nehmen.'],
  'werkzeug.benutzt': ['Gemacht. Ich hab’s gesehen.', 'Steht drin.'],

  // Die Rezeption (s12): der erste Raum für einen Fremden. Jede Zeile ist nur in ihrem Zustand wahr –
  // wer sie zeigt, prüft den Zustand (von: 'denk' | 'vorlage', Zeit gemessen, Kopf), nicht die Stimme.
  // {kopf} steht mitten im Satz, klein geschrieben: „dein Rechner (<modell>)“ oder „Claude über claude.ai“.
  // {sek} sind gemessene Sekunden mit einer Stelle hinter dem Komma („3,8“), nie geschätzt.
  // {name} ist der Name des Werkzeugs – immer mitgeben, sonst setzt fuell() den Namen des Menschen ein.
  // s13: die Rezeption hat ihr Verb „Was steht an?“ – Carl zeigt aufs Fächerregal über sich, die Einladung bleibt
  'rezeption.erst': ['Ich bin {carl}, über mir hängen deine nächsten Tage. Sag mir einen Satz, ich bau dir was.'],
  // Rückkehr, wenn schon Werkzeuge neben Carl stehen (oder S.du.angekommen): keine Vorstellung mehr, nur die Einladung
  'rezeption.wieder': ['Da bist du wieder. Sag mir einen Satz, ich bau dir noch eins.'],
  // erster Satz im Zuhause für jemanden ohne Rundgang, der an der Rezeption angekommen ist ({name} = das jüngste Werkzeug)
  'rezeption.erster': ['Dein Werkzeug „{name}“ steht an der Rezeption. Was soll ich dir als Nächstes bauen?'],
  'rezeption.feld': ['Was soll ich dir bauen?'],
  'rezeption.beispiel': ['Ein Beispiel'],
  'rezeption.nimm': ['So eins für mich'],
  'rezeption.baut': ['Ich bau es dir. Schau zu.'],
  'rezeption.denkt': ['Ich denk nach, seit {sek} Sekunden.'],
  'rezeption.gewartet': ['25 Sekunden sind um, länger warte ich nicht. Probier das hier aus, ändern geht gleich.'],
  'rezeption.gebaut': ['So hab ich deinen Satz verstanden. Probier es aus.'],
  'rezeption.gebautVorlage': ['Probier es aus. Ändern geht gleich.'],
  'rezeption.gemerkt': ['Das hab ich mir gemerkt. Beides gehört dir.'],
  'rezeption.beispielGebaut': ['Das hab ich mir gemerkt. War mein Beispiel, jetzt ist es deins.'],
  'rezeption.korrektur': ['So stimmt es'],
  'rezeption.berichtigt': ['Gut. So merk ich es mir.'],
  'rezeption.kostenDenk': ['Gedacht hat {kopf}, {sek} Sekunden lang. Was das kostet, weiß ich noch nicht.'],
  'rezeption.kostenDenkVorlage': ['Gedacht hat {kopf}, {sek} Sekunden lang, brauchbar war es nicht. Darum eine Vorlage.'],
  'rezeption.kostenDenkOhne': ['Gedacht hab ich {sek} Sekunden lang. Wer genau, weiß ich diesmal nicht.'],
  'rezeption.kostenLokal': ['Dein Rechner hat gedacht, {sek} Sekunden lang. Geld kostet das keins.'],
  'rezeption.kostenGewartet': ['Ich hab {sek} Sekunden gewartet, Antwort kam keine. Darum eine Vorlage.'],
  'rezeption.kostenVorlage': ['Gedacht hab ich hier nicht, das ist eine Vorlage. Gekostet hat sie nichts.'],
  'rezeption.leer': ['Das Feld ist noch leer. Ein Satz reicht.'],
  'rezeption.unsinn': ['Da kann ich noch nichts draus bauen. Was willst du zählen, abhaken oder nicht vergessen?'],
  'rezeption.anders': ['Gut. Sag mir, was anders sein soll, dann bau ich es neu.'],
  // nach „Anders“ ohne Mitdenken ist dasselbe herausgekommen – das sagt Carl, statt so zu tun (nur wenn Bausteine und Name gleich blieben)
  'rezeption.gleich': ['Gleich geblieben, mitdenken kann ich hier nicht. Anders wird es mit Wörtern wie „jeden Tag“, „zählen“, „Liste“ oder „Termin“.'],
  // erster Besuch im Zuhause nach der Rezeption (S.du.angekommen, kein Rundgang): wo das Werkzeug ist und was das Feld hier tut
  'rezeption.zuhause': ['Hier wohn ich. Dein Werkzeug steht an der Rezeption; aus einem Satz hier wird ein Space.'],
  'rezeption.stimmtNicht': ['Stimmt so nicht'],
  // die Tischglocke am Tresen: sie löst nichts aus, Carl ist ohnehin da
  'rezeption.glocke': ['Eine Tischglocke. Rufen musst du mich nicht, ich bin ja da.'],
  'rezeption.glocke.geklingelt': ['Ja? Ich bin da. Sag mir einen Satz.'],
  'rezeption.glocke.nacht': ['Spät. Die Lampe brennt, ich bin wach.'],

  // Dein Wochenende: sechs kleine Schritte an zwei Tagen, abgehakt wird nur durchs Tun
  'lernweg.einladung': ['Am Wochenende zeig ich dir, was du brauchst.'],
  'lernweg.einladungJa': ['Zeig mal'],
  'lernweg.auf': ['Zwei Tage, sechs kleine Schritte. Fang an, wo du magst.'],
  'lernweg.tun': ['Jetzt du. Den Haken setzt du, indem du es tust.'],
  'lernweg.haken': ['Ein Haken mehr. Das hast du selbst gemacht.'],
  'lernweg.samstag': ['Samstag geschafft. Morgen zeig ich dir den Rest.'],
  'lernweg.schonGebaut': ['Ein Werkzeug bauen – das hast du an der Rezeption schon geschafft. Der Haken ist deiner.'],
  'lernweg.alles': ['Das war dein Wochenende. Ab jetzt wächst alles aus deinen Ideen.'],

  // Der Verwalter der Werkstatt (eigene Figur, eigene Stimme: kurz, genau, mit Zahlen, schläft gern ein)
  'helfer.name': ['Ferdl'],
  'helfer.wer': ['der Verwalter'],
  'helfer.wach': ['Bin da. War nur kurz die Augen zu.', 'Hm? Ich hab nicht geschlafen. Fast nicht.'],
  'helfer.auftrag': ['Notiert. Ich lies nach.'],
  'helfer.fund': ['Ein Fund zu „{thema}“. Schau lieber selbst nach, ob er stimmt.'],
  'helfer.leer': ['Gib mir ein Thema. Ich lies nach und leg dir hin, was ich finde.'],
  'helfer.ordnet': ['Deine Werkzeuge hängen. Alle an ihrem Platz.'],
  'helfer.mehr': ['Ich krieg bald Verstärkung. Dann bin ich nicht mehr allein hier.'],

  // Einrichten: ein Katalog für alles (Space, UFO). Leine, Zettel und Carl bleiben frei.
  'einrichten.auf': ['Richte es dir ein, wie du magst.'],
  'einrichten.ziehen': ['Auf den Raum ziehen oder antippen.'],
  'einrichten.tippen': ['Tipp in den Raum, wo es stehen soll.'],
  'einrichten.blatt': ['Leg es in den Raum, nicht aufs Blatt.'],
  'einrichten.steht': ['Steht. Schön hier.', 'Passt gut da hin.'],
  'einrichten.weg': ['Weggeräumt.'],
  'einrichten.frei': ['Da steh ich. Ein Stück weiter?'],
  'einrichten.zuwenig': ['Dafür reichen die Münzen noch nicht. Im Kieselpark gibt es welche.'],
  'einrichten.fertig': ['Jetzt ist es deins.'],

  // UFO vor dem Garagentor
  'garage.erst': ['Meine Garage. Rechts steht mein Schrank, und durchs Tor geht es in den Kieselpark.'],
  'garage.rad.erst': ['Dein Rad. Tipp es an.'],
  'ufo.zu': ['Das UFO schläft. Es wacht auf, wenn dein Rechner mir einmal Hallo sagt. Steuern kann ich ihn nicht.'],
  'ufo.wie': ['Wie das geht, zeig ich dir am Sonntag.'],
  'ufo.wach': ['Das UFO ist wach. Tipp es an, dann richten wir es ein.'],
  'ufo.einrichten': ['Wie soll es aussehen?'],
  'ufo.fertig': ['Fertig. Ich steig gleich ein.'],

  // Freudenflug: Carl schweigt im Flug; ein Satz, wenn er heimkommt
  'himmel.freude.heim': ['Da bin ich wieder. Das musste kurz sein.', 'Hui. Ich war nur eine Runde weg.'],

  // Bilder in der Bibliothek: Titel, Maler, Jahr (geprüft), dann ein Satz über mich
  'bib.ding.bild-mona': ['Mona Lisa, Leonardo da Vinci, um 1503 bis 1519. Seitdem lächle ich ein bisschen rätselhafter.'],
  'bib.ding.bild-perle': ['Das Mädchen mit dem Perlenohrring, Johannes Vermeer, um 1665. Ich hab keine Ohren, die Perle hält trotzdem.'],
  'bib.ding.bild-welle': ['Die große Welle vor Kanagawa, Katsushika Hokusai, um 1830 bis 1832. Zum Glück hab ich ein Boot.'],
  'bib.ding.bild-stern': ['Die Sternennacht, Vincent van Gogh, 1889. So fühlt sich mein Himmel nachts an.'],
  'bib.ding.bild-wanderer': ['Der Wanderer über dem Nebelmeer, Caspar David Friedrich, um 1818. Von hinten seh ich nachdenklicher aus.'],

  // Samen → Blume: der erste Zettel ist der Samen, Carl nährt ihn, der Mensch entscheidet.
  'samen.erst': ['Dein erster Zettel ist der Samen. Ich helf ihm wachsen.'],
  'pflanze.samen': ['Noch ein Samen. Was fällt dir dazu ein?'],
  'pflanze.keim': ['Er keimt. Welcher Satz ist der wahrste?'],
  'pflanze.knospe': ['Eine Knospe. Was ist der nächste Schritt?'],
  'pflanze.bluete': ['Er blüht. Das warst du.'],
  'naehren.frage': ['Was hat dich auf „{titel}“ gebracht?', 'Was wäre an „{titel}“ das Schönste?', 'Wer sollte von „{titel}“ wissen?'],
  'naehren.ordnen': ['Ich hab deine Zettel geordnet. Stimmt es so?'],
  'naehren.kernsatz': ['Vielleicht ist das dein Kernsatz: „{satz}“. Du entscheidest.'],
  'naehren.schritt': ['Ein nächster Schritt könnte sein: „{satz}“. Passt das?'],
  'naehren.ja': ['Passt'],
  'naehren.anders': ['Anders'],

  // Räume (ein Satz, wenn man ankommt oder etwas antippt)
  'himmel.leer': ['Noch still hier oben. Woran denkst du gerade?'],
  // s13: ein Planet antippen zeigt ihn erst von oben (Hineingehen ist der zweite Schritt)
  'himmel.raum': ['In der Mitte bist du. Tipp einen Planeten an, dann schauen wir ihn von oben an.'],
  'himmel.ersterFrage': ['Du hast mir gesagt, du baust an „{t}“. Soll das dein erster Planet werden?'],
  'himmel.duLeer': ['Noch keins. Zieh zwei Planeten zusammen.'],
  'bib.meisterFrage': ['Und du? Was davon ist schon in dir?'],
  'lesesaal.erst': ['Dein Lesesaal. Auf den Tisch leg ich, was du mir schickst.'],
  'lesesaal.tisch.erst': ['Dein Lesesaal. Auf den Tisch leg ich, was du mir schickst.'],
  'lesesaal.tisch.dunkel': ['Dunkel hier. Die Kerze steht auf dem Tisch.'],
  'lesesaal.staunen.tisch': ['Was du mir tagsüber schickst, leg ich hier hin. Ich fass es zusammen, du sagst, ob es stimmt. Ohne dein Ja passiert damit nichts.'],
  'blatt.weiter': ['Ich denk weiter. Einen Moment.'],
  'blatt.beispiel': ['Ausarbeiten kann ich hier noch nicht. Das Ergebnis bleibt trotzdem.'],

  // Der Rundgang = die erste Schleife. Jede Antwort schenkt Carl ein Stück von sich.
  'rg.wecken': ['tipp ihn an'],
  'rg.wach': ['Oh. Du. Ich hab geschlafen wie ein Stein.'],
  'rg.name': ['Ich bin {carl}. Und du?'],
  'rg.nameDanke': ['{name}. Jetzt werd ich rot.', 'Gut. Ich werd trotzdem rot.'],
  'rg.gedanke': ['Woran denkst du gerade?'],
  'rg.gedankeDanke': ['Da wächst mir gleich was. Komm mit.'],
  'rg.gedankeLeer': ['Gut, dann später. Mir wächst trotzdem was.'],
  'rg.space': ['Hier wohnt dein Gedanke jetzt, als Samen.'],
  'rg.spaceName': ['Ich nenn den Space „{kurz}“?'],
  'rg.spaceDanke': ['Gut. Komm, wir schauen von oben.'],
  'rg.vogel': ['Von oben ist dein Space ein Planet. Wo zwei sich treffen, wird es ein Sternbild.'],
  'rg.vogelLeer': ['Hier oben wird jeder Gedanke ein Planet. Wo zwei sich treffen, wird es ein Sternbild.'],
  'rg.socken': ['Eins fehlt noch. Welche Farbe haben meine Socken?'],
  'rg.ganz': ['Jetzt bin ich ganz.'],

  // Brief von Carl: höchstens eine kleine Aufgabe am Tag, immer aus einem deiner Fäden
  'auftrag.titel': ['Brief von Carl'],
  'auftrag.satz': ['Schreib mir einen Satz, warum „{titel}“ dir wichtig ist.', 'Ein Satz zu „{titel}“: Was fehlt dir, wenn es das nicht gibt?'],
  'auftrag.verbindung': ['Was haben „{a}“ und „{b}“ miteinander zu tun? Ein Satz reicht.', '„{a}“ und „{b}“ wohnen bei dir nebeneinander. Was verbindet die zwei?'],
  'auftrag.verbindungPerlen': ['In „{titel}“ hängen „{a}“ und „{b}“. Was verbindet die beiden?'],
  'auftrag.gegenspieler': ['Jemand hält „{titel}“ für eine schlechte Idee. Schreib seinen besten Satz auf.', 'Was würde der klügste Zweifler zu „{titel}“ sagen? Ein Satz, in seiner Stimme.'],
  'auftrag.damals': ['Am {datum} hast du geschrieben: „{zitat}“. Stimmt das heute noch?', 'Das hast du am {datum} geschrieben: „{zitat}“. Was würdest du heute dazuschreiben?'],
  'auftrag.gruss': ['Bis bald. Carl'],
  'auftrag.bringt': ['Ich hab dir was mitgebracht. Es liegt da, wenn du magst.', 'Ein Brief von mir. Kein Eilbrief.'],
  'auftrag.danke': ['Hängt als Zettel in deinem Space. Ich freu mich, das sieht man.', 'Hängt. Das war ein guter Satz.'],
  'auftrag.dankeKnoten': ['„{a}“ und „{b}“ sind jetzt ein Sternbild. Oben leuchtet es.'],
  'auftrag.spaeter': ['Gut. Der Brief liegt da und läuft nicht weg.', 'Kein Eilbrief. Er wartet.'],
  'auftrag.schon': ['Heute hast du mir schon geschrieben: „{t}“. Morgen bring ich wieder was.'],
  'auftrag.platzhalter': ['Ein Satz reicht.'],

  // Funde: Herkunft steht immer dabei
  'fund.du': ['Du hast am {datum} geschrieben: „{zitat}“'],
  'fund.herkunft.du': ['Aus deinen eigenen Sätzen'],
  'fund.herkunft.carl': ['Carls Gedanke, nicht nachgeprüft'],
  'fund.herkunft.recherche': ['Aus der Recherche, bitte selbst prüfen'],

  // Freundschaftsbuch
  'atlas.antwort': ['Hab ich gelesen. Zweimal.', 'Das kleb ich mir ins Gedächtnis.', 'Steht drin. Mit Tinte, nicht mit Bleistift.'],

  // Bausteine im Space
  'baustein.weg': ['Abgenommen. Nichts ist verloren.'],
  'baustein.gewohnheit.anlegen': ['Hängt. Tipp sie an, wenn sie heute war.'],
  'baustein.gewohnheit.punkt': ['Heute war sie. Ich zähl nicht.'],
  'baustein.harness.anlegen': ['Drei kleine Seiten: wie ein Helfer für dich arbeitet.'],

  // Gefährt: worin Carl im Himmel sitzt (gefaehrt.<id>.anprobe, sonst gefaehrt.anprobe)
  'gefaehrt.anprobe': ['Ich probier „{name}“ an. Du entscheidest, ob ich darin fliege.'],
  'gefaehrt.ufo.anprobe': ['Ein Flugding, nur für mich. Endlich muss ich nicht selbst schweben.'],
  'gefaehrt.couch.anprobe': ['Eine Couch, die schwebt. Ich glaub, ich steh nie wieder auf.'],
  'gefaehrt.wolke.anprobe': ['Ein Wolkenkissen. Weicher, als ein Stein es verdient.'],
  'gefaehrt.tasse.anprobe': ['Eine Tasse. Dann bin ich wohl der Tee.'],

  // Schrank
  'laden.gekauft': ['Steht mir. Sag nichts.'],
  'laden.zuwenig': ['Dafür reichen die Münzen noch nicht. Es läuft nicht weg.'],
  'laden.spiegel': ['Tipp den Spiegel an, dann dreh ich mich.'],

  // Lektionen: Carl bringt es bei
  'lehre.auf': ['Drei Seiten: wie ein Helfer für dich arbeitet. Welche zuerst?', 'Drei Seiten. Nimm dir eine.'],
  'lehre.uebung': ['Jetzt du. Die Übung machst du in der App, nicht auf der Seite.'],
  'lehre.geschafft': ['Du hast es gemacht. Der Haken bleibt.', 'Haken dran. Das war deine Arbeit, nicht meine.'],
  'lehre.nochNicht': ['Das gibt es noch nicht. Lieber sag ich das, als so zu tun.'],

  // ---- s13 · Werkstatt: Rezeption „Was steht an?“, Tage, Kalender, Brief als Briefing, Vorbereitungen, Vorschläge ----
  // Jede Zeile ist nur in ihrem Zustand wahr (Tabelle: werkstatt/s13/KREUZUNG.md, „s13 · Werkstatt“). Platzhalter immer mitgeben;
  // {wann} kommt klein und nie am Satzanfang („morgen“, „in 4 Tagen“), {n} ist gezählt, nie geschätzt.

  // Rezeption · Verb „Was steht an?“
  'rezeption.verb': ['Was steht an?'],
  'rezeption.wiederHeute': ['Da bist du wieder. Heute steht „{titel}“ an.'],

  // Tage · das Fächerregal
  'tage.name.heute': ['Heute'],
  'tage.name.morgen': ['Morgen'],
  'tage.name.uebermorgen': ['Übermorgen'],
  'tage.wann.heute': ['heute'],
  'tage.wann.morgen': ['morgen'],
  'tage.wann.uebermorgen': ['übermorgen'],
  'tage.wann.in': ['in {n} Tagen'],
  'tage.wann.um': ['um {uhr}'],
  'tage.wann.ganztags': ['den ganzen Tag'],
  'tage.leer': ['Die nächsten sieben Tage sind bei mir leer. Kommt etwas dazu, leg ich es ins Fach.'],
  'tage.heute': ['Heute stehen {n} Sachen an.'],
  'tage.heuteEins': ['Heute steht eine Sache an.'],
  'tage.heuteLeer': ['Heute steht bei mir nichts an.'],
  'tage.tagLeer': ['Für {tag} weiß ich von nichts. Vielleicht gehört der Tag ganz dir.'],
  'tage.vorbereitet': ['Für „{titel}“ hab ich schon was vorbereitet. Es liegt hier im Fach.'],
  'tage.beispiel': ['Nur ein Beispiel. So liegt es da, wenn ich für etwas schon vorbereitet habe.'],
  'tage.beispiel.marke': ['Beispiel'],
  'tage.beispiel.titel': ['Mathe-Prüfung'],
  'tage.beispiel.ding': ['Karteikarten'],
  'tage.woher.kalender': ['aus deinem Kalender'],
  'tage.woher.werkzeug': ['aus deinem Werkzeug „{werkzeug}“'],
  'tage.mehr': ['und {n} mehr'],
  'tage.fachLeer': ['{tag}, nichts eingetragen'],

  // Kalender · Zustände (Code aus mcp → Schlüssel)
  'kalender.verbunden': ['Dein Google Kalender ist verbunden. Ich lese nur, ändern kann ich nichts.'],
  'kalender.stand': ['Zuletzt nachgeschaut um {uhr}.'],
  'kalender.laedt': ['Ich schau in deinen Kalender.'],
  'kalender.nicht-verbunden': ['Noch kein Kalender verbunden. Bis dahin zeig ich nur, was in deinen eigenen Werkzeugen steht.'],
  'kalender.wie': ['In Claude unter Einstellungen bei den Konnektoren „Google Calendar“ hinzufügen. Danach lese ich deine Termine, ändern kann ich nichts.'],
  'kalender.wieChip': ['Wie verbinde ich ihn?'],
  'kalender.neu-verbinden': ['Dein Kalender und ich haben uns aus den Augen verloren. Verbinde ihn in den Einstellungen von Claude neu, dann seh ich deine Termine wieder.'],
  'kalender.kein-zugriff': ['Deinen Kalender darf ich hier nicht lesen. Ist in Ordnung, dann bleibt er bei dir.'],
  'kalender.fragen': ['Ich schau erst in deinen Kalender, wenn du es erlaubst.'],
  'kalender.freigeben': ['Kalender lesen lassen'],
  'kalender.auswahl': ['Ich seh mehr als einen Google Kalender und weiß nicht, welcher gemeint ist.'],
  'kalender.fehler': ['Dein Kalender antwortet gerade nicht. Ich frag später nochmal.'],
  'kalender.fehlerFest': ['Dein Kalender hat nicht geantwortet. Was in deinen Werkzeugen steht, zeig ich trotzdem.'],
  'kalender.geht-nicht': ['Von hier aus komm ich an keinen Kalender heran. Was in deinen Werkzeugen steht, zeig ich trotzdem.'],
  'kalender.ungelesen': ['Bei {n} Einträgen konnte ich nicht lesen, was oder wann. Die lass ich lieber weg.'],
  'kalender.ungelesenEins': ['Bei einem Eintrag konnte ich nicht lesen, was oder wann. Den lass ich lieber weg.'],
  'kalender.apple': ['Apple Kalender erreiche ich hier im Browser nicht. Der kommt mit Carl auf deinem Mac.'],

  // Brief · das Briefing im Postfach
  'brief.titel': ['Brief von Carl'],
  'brief.anrede.morgen': ['Guten Morgen, {name}.'],
  'brief.anrede.tag': ['Hallo, {name}.'],
  'brief.anrede.abend': ['Guten Abend, {name}.'],
  'brief.anrede.nacht': ['Spät geworden, {name}.'],
  'brief.heute': ['Heute steht an: {liste}.'],
  'brief.heuteLeer': ['Heute steht bei mir nichts an.'],
  'brief.naechste': ['Neu für die nächsten Tage: {liste}.'],
  'brief.naechsteLeer': ['Für die nächsten Tage nichts Neues.'],
  'brief.vorbereitet': ['Vorbereitet hab ich: {liste}. Alles liegt im Fach bei seinem Tag.'],
  'brief.frageVorb': ['„{titel}“ ist {wann}. Soll ich dir {was} machen?'],
  'brief.ja': ['Ja, bitte'],
  'brief.frageWichtig': ['Was davon ist dir am wichtigsten?'],
  'brief.frageLeer': ['Gibt es etwas, das ich wissen sollte?'],
  'brief.nichtsVerbunden': ['Noch seh ich keinen Kalender und keinen Termin von dir. Erfinden mag ich keinen.'],
  'brief.frageVerbinden': ['Soll ich dir zeigen, wie du deinen Kalender verbindest?'],
  'brief.woher': ['Woher ich das weiß: {quellen}.'],
  'brief.gruss': ['Bis bald. Carl'],
  'brief.bringt': ['Im Postfach liegt dein Brief für heute.', 'Ich hab dir was ins Postfach gelegt. Kein Eilbrief.'],
  'brief.leer': ['Heute liegt kein Brief im Postfach. Morgen schau ich wieder, was ansteht.'],
  'brief.gelesen': ['Den Brief von heute hast du schon. Er liegt noch im Postfach, wenn du ihn wieder lesen willst.'],
  'brief.postfach': ['Postfach'],
  'brief.postfachVoll': ['Postfach, ein Brief für dich'],

  // Vorbereitungen · Angebot, Bau, Ergebnis
  'vorb.name.karteikarten': ['Karteikarten'],
  'vorb.name.packliste': ['Packliste'],
  'vorb.name.merkzettel': ['Merkzettel'],
  'vorb.was.karteikarten': ['Karteikarten'],
  'vorb.was.packliste': ['eine Packliste'],
  'vorb.was.merkzettel': ['einen Merkzettel'],
  'vorb.angebot.karteikarten': ['„{titel}“ ist {wann}. Soll ich dir Karteikarten machen?'],
  'vorb.angebot.packliste': ['„{titel}“ ist {wann}. Soll ich dir eine Packliste machen?'],
  'vorb.angebot.merkzettel': ['„{titel}“ ist {wann}. Soll ich dir einen Merkzettel für Geschenkideen machen?'],
  'vorb.nein': ['Nicht nötig'],
  'vorb.neinGut': ['Gut. Dazu frag ich nicht nochmal.'],
  'vorb.laeuft': ['Ich schreib daran. Schau zu.'],
  'vorb.baut.karteikarten': ['Ich schreib dir Karten zu „{titel}“.'],
  'vorb.baut.packliste': ['Ich schreib dir die Packliste.'],
  'vorb.baut.merkzettel': ['Ich such in deinen Zetteln nach Ideen.'],
  'vorb.denkt': ['Ich schreib, seit {sek} Sekunden.'],
  'vorb.fertig': ['Fertig. Für „{titel}“ liegt es jetzt im Fach.'],
  'vorb.fertig.karteikarten': ['Fertig. {n} Karten für „{titel}“ liegen im Fach.'],
  'vorb.gebaut': ['Fertig. Es liegt in seinem Fach an der Rezeption.'],
  'vorb.wand': ['An der Werkstattwand hängt es auch.'],
  'vorb.schon': ['Dafür hab ich schon was vorbereitet. Es liegt im Fach.'],
  'vorb.keinKopf': ['Dafür bräuchte ich jemanden, der mitdenkt, und das geht hier gerade nicht. Raten mag ich bei so was nicht.'],
  'vorb.keinKopf.karteikarten': ['Mitdenken geht hier gerade nicht, darum schreib ich dir keine Fragen.'],
  'vorb.keinKopf.packliste': ['Mitdenken geht hier gerade nicht, darum rate ich dir keine Packliste.'],
  'vorb.keinKopf.merkzettel': ['In deinen Zetteln hab ich noch keine Idee gefunden, und mitdenken geht hier gerade nicht.'],
  'vorb.leer': ['Das ist mir nicht gelungen, brauchbar war es nicht. Soll ich es nochmal versuchen?'],
  'vorb.nochmal': ['Nochmal versuchen'],
  'vorb.oeffnen.karteikarten': ['Zu den Karten'],
  'vorb.oeffnen.packliste': ['Zur Packliste'],
  'vorb.oeffnen.merkzettel': ['Zum Merkzettel'],

  // Vorbereitungen · Karteikarten, Packliste, Merkzettel als Dinge
  'vorb.karten.umdrehen': ['Karte umdrehen'],
  'vorb.karten.vorne': ['Frage'],
  'vorb.karten.hinten': ['Antwort'],
  'vorb.karten.gewusst': ['Gewusst'],
  'vorb.karten.nochmal': ['Nochmal'],
  'vorb.karten.ende': ['Einmal durch. Keine hat gewackelt.'],
  'vorb.karten.wackelt': ['Einmal durch. {n} wackeln noch, die leg ich nach oben.'],
  'vorb.karten.wackeltEins': ['Einmal durch. Eine wackelt noch, die leg ich nach oben.'],
  'vorb.karten.wasWackelt': ['Was noch wackelt'],
  'vorb.karten.nurWacklige': ['Nur die wackligen'],
  'vorb.karten.vonVorn': ['Von vorn'],
  'vorb.karten.leer': ['Noch keine Karte. Vorne die Frage, hinten die Antwort.'],
  'vorb.karten.dazu': ['Noch eine Karte'],
  'vorb.packliste.leer': ['Noch nichts drauf. Was kommt als Erstes in die Tasche?'],
  'vorb.packliste.alles': ['Alles drin. Gute Reise.'],
  'vorb.merk.leer': ['In deinen Zetteln klingt noch nichts nach Geschenk. Schreib eine Idee drauf, wenn dir eine kommt.'],
  'vorb.merk.gefunden': ['Aus deinen Zetteln: {n} Ideen. Streich, was nicht passt.'],
  'vorb.merk.gefundenEins': ['Aus deinen Zetteln: eine Idee.'],

  // Vorschläge · vier Karten im Space und am Planeten
  'vorschlag.frage': ['Was machen wir damit?'],
  'vorschlag.weiter': ['Weiterdenken'],
  'vorschlag.machen': ['Machen'],
  'vorschlag.arbeiten': ['Für dich arbeiten lassen'],
  'vorschlag.verbinden': ['Verbinden'],
  'vorschlag.los': ['Los'],
  'vorschlag.laeuft': ['Ich bin dran.'],
  'vorschlag.mehrere': ['Ich mach eins nach dem anderen.'],
  'vorschlag.fertig': ['Hängt als Zettel an der Leine.'],
  'vorschlag.weiter.fertig': ['Meine Frage hängt an der Leine. Antworte, wann du magst.'],
  'vorschlag.machen.fertig': ['Auf dem Schild steht jetzt: „{s}“.'],
  'vorschlag.arbeiten.fertig': ['Was ich gefunden hab, hängt an der Leine. Schau selbst nach, ob es stimmt.'],
  'vorschlag.verbinden.fertig': ['Aus „{a}“ und „{b}“ ist ein Sternbild geworden. Oben leuchtet es.'],
  'vorschlag.verbinden.allein': ['Das ist dein einziger Space. Zum Verbinden braucht es zwei, den zweiten nennst du.'],
  'vorschlag.ohneKopf': ['Mitdenken kann ich hier nicht. Was ohne geht, mach ich trotzdem.'],
  'vorschlag.weiter.ohneKopf': ['Ohne Mitdenken frag ich dich, was aus „{t}“ folgt. Deine Antwort hängt dann an der Leine.'],
  'vorschlag.machen.ohneKopf': ['Du schreibst den nächsten Schritt, ich häng ihn als Schild auf.'],
  'vorschlag.arbeiten.ohneKopf': ['Nachlesen geht nur, wenn jemand mitdenkt. Hier ist gerade keiner.'],

  // Vorschläge · Stand von oben (Planet), ein Satz aus echten Daten
  'vorschlag.stand.leer': ['Noch kein Zettel, nur der Name.'],
  'vorschlag.stand.zettel': ['{n} Zettel, kein nächster Schritt.'],
  'vorschlag.stand.schritt': ['{n} Zettel, nächster Schritt: „{schritt}“.'],
  'vorschlag.stand.zuletzt': ['Zuletzt dazugekommen, {wann}: „{zettel}“.'],
  'vorschlag.stand.still': ['Seit {wann} still hier. Das darf so sein.'],
  'vorschlag.stand.kernsatz': ['Kernsatz: „{satz}“.'],

  // Nachtrag (Rezeption, Brief, Angebote)
  'brief.erster': ['Das ist dein Postfach. An jedem Tag, an dem etwas ansteht, liegt hier ein Brief von mir.'],
  'brief.spaceName': ['Was ansteht'],
  'brief.zettel': ['Hängt als Zettel in „{titel}“.'],
  'brief.zettelNeu': ['Das ist der erste Zettel in deinem neuen Space „{titel}“. Du findest ihn im Zuhause am Brett.'],
  'vorb.angebot.karteikarten.vortrag': ['„{titel}“ ist {wann}. Soll ich dir Karteikarten mit Stichworten machen?'],
  'vorb.angebot.merkzettel.bewerbung': ['„{titel}“ ist {wann}. Soll ich dir Fragen aufschreiben, die dort kommen könnten?'],
  'kalender.unlesbar': ['Dein Kalender hat geantwortet, aber nichts davon konnte ich sicher lesen. Lieber zeig ich nichts als etwas Falsches.'],
  'tage.beispielBlatt': ['Steht „{titel}“ in einem Fach, frag ich dich, ob ich dir {ding} machen soll. Sagst du ja, liegen sie danach im Fach.'],
  'tage.vorbereitetLeer': ['Für „{titel}“ hab ich dir was Leeres ins Fach gelegt. Den ersten Eintrag schreibst du.'],

  // Nachtrag (Postfach)
  'brief.ablage': ['Hier liegt dein Brief. Tipp ihn an, dann mach ich ihn auf.'],
  'brief.ablageLeer': ['Heute liegt hier noch kein Brief. Steht etwas an, liegt hier einer.'],

  // Nachtrag (Vorschläge im Space)
  'vorschlag.weiter.was': ['Ich denk an „{t}“ weiter und häng dir eine Frage an die Leine.'],
  'vorschlag.weiter.frage': ['Was folgt aus „{t}“?'],
  'vorschlag.weiter.platz': ['Dein nächster Gedanke …'],
  'vorschlag.weiter.offen': ['Noch kein Gedanke. Tipp die Karte noch einmal, wenn dir einer kommt.'],
  'vorschlag.weiter.deins': ['Dein Gedanke hängt an der Leine.'],
  'vorschlag.machen.was': ['Ich schlag dir einen nächsten Schritt vor. Du sagst, bis wann.'],
  'vorschlag.machen.wasGeschafft': ['Auf dem Schild steht „{s}“. Ist er geschafft, hak ich ihn ab.'],
  'vorschlag.machen.geschafftFrage': ['„{s}“. Geschafft?'],
  'vorschlag.machen.geschafft': ['Geschafft'],
  'vorschlag.machen.werkzeugWahl': ['Ein Werkzeug dazu bauen'],
  'vorschlag.machen.abgehakt': ['„{s}“ ist geschafft. Er hängt jetzt als Zettel an der Leine.'],
  'vorschlag.machen.nochNicht': ['„{s}“ bleibt auf dem Schild, bis du ihn abhakst.'],
  'vorschlag.machen.offen': ['Noch kein Schritt. Weißt du einen, tipp das Schild „Nächster Schritt“ an.'],
  'vorschlag.machen.leer': ['Daraus wurde kein Werkzeug. Sag mir unten in einem Satz, was es können soll.'],
  'vorschlag.machen.vorlage': ['„{n}“ steht neben mir, aus einer Vorlage, weil hier gerade keiner mitdenkt.'],
  'vorschlag.machen.werkzeug': ['„{n}“ steht neben mir.'],
  'vorschlag.arbeiten.was': ['Ich lese zu „{t}“ nach und häng dir, was ich finde, an die Leine. Bitte selbst prüfen.'],
  'vorschlag.arbeiten.ohne': ['Nachlesen geht nur, wenn jemand mitdenkt, und hier ist gerade keiner. Häng dir eine Quelle selbst an die Leine.'],
  'vorschlag.arbeiten.nichts': ['Beim Nachlesen kam ich nicht weiter, darum hängt nichts. Versuch es später noch einmal.'],
  'vorschlag.verbinden.was': ['Mit „{b}“. Du sagst in einem Satz, was die beiden verbindet.'],
  'vorschlag.verbinden.frage': ['Was verbindet „{a}“ und „{b}“?'],
  'vorschlag.verbinden.platz': ['Ein Satz, deiner'],
  'vorschlag.verbinden.offen': ['Noch kein Satz. Im Himmel ziehst du „{b}“ jederzeit selbst heran.'],
  'vorschlag.verbinden.neuFrage': ['Zum Verbinden braucht es einen zweiten Gedanken. Wie heißt er?'],
  'vorschlag.verbinden.neuPlatz': ['Name des zweiten Gedankens …'],
  'vorschlag.verbinden.keinZweiter': ['Ohne zweiten Gedanken gibt es nichts zu verbinden.'],
  'vorschlag.bezug': ['zu „{t}“'],
  'vorschlag.losEins': ['Los: {n}'],
  'vorschlag.losViele': ['Los, {n} nacheinander'],
  'vorschlag.fertigViele': ['Fertig. {n} Sachen hängen jetzt hier.'],
  'vorschlag.lage': ['Der Kernsatz steht. Was machen wir als Nächstes?'],
  'zettel.gemeint': ['„{t}“. Die Vorschläge unten meinen jetzt diesen Zettel.'],
  'naehren.kernAufgehaengt': ['Ich hab dir einen Kernsatz vorgeschlagen, er hängt an der Leine. Tipp ihn an, wenn er trägt.'],
  'naehren.kernDeiner': ['Vielleicht trägt „{satz}“ diesen Space. Tipp den Zettel an, wenn er der Kernsatz ist.'],
  'himmel.standLeer': ['Noch leer. Der erste Zettel ist der Samen.'],
  'himmel.hinein': ['Hineingehen'],

  // Nachtrag (Vorbereitungen als Dinge)
  'vorb.karten.dreiSelbst': ['Schreib dir selbst drei, dann lohnt sich der Stapel.'],
  'vorb.karten.aus': ['von Carl, aus deinem Zettel „{z}“ · bitte prüfen'],
  'vorb.karten.vonCarl': ['von Carl geschrieben · bitte prüfen'],
  'vorb.karten.deine': ['deine Karte'],
  'vorb.karten.stand': ['{n} im Stapel · {g} gewusst · {w} nochmal'],
  'vorb.karten.platzVorne': ['Was willst du gefragt werden?'],
  'vorb.karten.platzHinten': ['Und was ist die Antwort?'],
  'vorb.karten.legen': ['Auf den Stapel'],
  'vorb.karten.erste': ['Erste Karte'],
  'vorb.karten.fehltVorne': ['Vorne fehlt noch die Frage.'],
  'vorb.karten.fehltHinten': ['Hinten fehlt noch die Antwort. Ohne sie kannst du dich nicht prüfen.'],
  'vorb.karten.klein': ['{n} Karten · {g} gewusst'],
  'vorb.karten.kleinEins': ['eine Karte · {g} gewusst'],
  'vorb.karten.kleinLeer': ['noch keine Karte'],
  'vorb.packliste.vonCarl': ['Von Carl vorgeschlagen. Streich, was du nicht brauchst.'],
  'vorb.packliste.platz': ['Noch etwas …'],
  'vorb.packliste.klein': ['{n} noch einpacken'],
  'vorb.merk.platz': ['Noch eine Idee …'],
  'vorb.merk.klein': ['{n} Ideen'],
  'vorb.merk.deinZettel': ['dein Zettel'],
  'vorb.deins': ['von dir'],
  'vorb.kleinLeer': ['noch leer']
};

// Wahlen mit festen Wörtern, damit alle Orte dieselben zeigen (höchstens drei, wo Carl fragt).
// ton: die eine Ton-Wahl (Freundschaftsbuch), Wert in S.du.ton. socken: Rundgang und Schrank.
var WAHL = {
  ton: [['warm', 'Warm'], ['trocken', 'Trocken, mit Witz'], ['ehrlich', 'Ehrlich, auch wenn’s piekst']],
  socken: [['#d62a26', 'Rot'], ['#e8621a', 'Orange'], ['#e3b23c', 'Senf'], ['#8ea37a', 'Moos'], ['#3f6fa8', 'Blau'], ['#2b2722', 'Schwarz']]
};

var zaehl = {};
function S() { return C6.S || {}; }
function fuell(t, w) {
  var du = S().du || {};
  w = w || {};
  var name = w.name != null ? w.name : (du.name || '');
  var r = t.replace(/\{name\}/g, name).replace(/\{carl\}/g, w.carl || du.carlName || 'Carl').replace(/\{baut\}/g, w.baut != null ? w.baut : (du.baut || ''));
  // weitere Werte, die der Aufrufer mitgibt ({titel}, {a}, {b} …)
  r = r.replace(/\{(\w+)\}/g, function (m, k) { return w[k] != null ? String(w[k]) : m; });
  // ohne Namen sauber bleiben: ", ." / "{name}. " am Anfang
  if (!name) r = r.replace(/,\s*(?=[.?])/g, '').replace(/^\.\s*/, '').replace(/\s+,/g, ',');
  return r.replace(/\s{2,}/g, ' ').trim();
}

C6.stimme = {
  alle: T,
  wahl: WAHL,
  // ein Satz zu einer Lage; Varianten wechseln sich ab
  sag: function (k, w) {
    var v = T[k];
    if (!v) return '';
    var i = (zaehl[k] = (zaehl[k] == null ? -1 : zaehl[k]) + 1) % v.length;
    return fuell(v[i], w);
  },
  // erste Variante, immer gleich (für Stellen, die nicht wechseln sollen)
  fest: function (k, w) { var v = T[k]; return v ? fuell(v[0], w) : ''; },
  // Tagesgruß: gibt es nicht mehr als feste Sätze (Carl begrüßt mit dem, was dran ist); bleibt als leere Stelle
  gruss: function () { return ''; },
  raum: function (id) { return C6.stimme.fest('raum.' + id); },
  // ein Satz zu einem Baustein: erst der besondere (baustein.<id>.<lage>), sonst der allgemeine mit {name}
  baustein: function (id, lage, w) {
    w = w || {};
    if (T['baustein.' + id + '.' + lage]) return C6.stimme.sag('baustein.' + id + '.' + lage, w);
    if (w.name == null) w.name = id;
    return C6.stimme.sag('baustein.' + lage, w);
  },
  // ein Satz zu einem Gefährt: erst gefaehrt.<id>.<lage>, sonst gefaehrt.<lage> mit {name}
  gefaehrt: function (id, lage, w) {
    w = w || {};
    if (T['gefaehrt.' + id + '.' + lage]) return C6.stimme.sag('gefaehrt.' + id + '.' + lage, w);
    if (w.name == null) w.name = id;
    return C6.stimme.sag('gefaehrt.' + lage, w);
  },
  hat: function (k) { return !!T[k]; },
  // Carls erster Satz nach dem Rundgang: eine Frage aus deinen Antworten, die zum nächsten Schritt führt.
  // Nach einem ganzen Rundgang hat er „Jetzt bin ich ganz“ schon gesagt; hier nur noch die Frage.
  erster: function () {
    var du = S().du || {}, rg = S().rundgang || {};
    // ohne Rundgang, aber an der Rezeption angekommen: Carl kennt das jüngste Werkzeug und führt zum nächsten Satz
    if (!du.fertig && du.angekommen) {
      var wz = []; try { wz = C6.werkzeug && C6.werkzeug.alle ? C6.werkzeug.alle() : []; } catch (e) { wz = []; }
      var j = wz.length ? wz[wz.length - 1] : null;
      if (j && j.name) return C6.stimme.fest('rezeption.erster', { name: j.name });
      return C6.stimme.fest('rezeption.wieder');
    }
    var ganz = du.fertig && !rg.uebersprungen;
    var n = du.name || '';
    var vor = ganz ? (n ? n + ', ' : '') : (n ? 'Da bin ich, ' + n + '. ' : 'Da bin ich. ');
    var wl = null; try { wl = C6.lernweg && C6.lernweg.stand ? C6.lernweg.stand() : null; } catch (e) { wl = null; }
    if (wl && (wl.fertig || []).length < (wl.alle || 6)) {
      var ein = C6.stimme.fest('lernweg.einladung');
      return vor + (vor && !/[.]\s$/.test(vor) ? ein.charAt(0).toLowerCase() + ein.slice(1) : ein);
    }
    var gross = function (f) { return vor && !/[.]\s$/.test(vor) ? f.charAt(0).toLowerCase() + f.slice(1) : f; };
    // der Name des ersten Space (aus dem Rundgang), sonst der Gedanke selbst
    var b = '', f;
    try { var sp = rg.sid && C6.strings && C6.strings.hol && C6.strings.hol(rg.sid); if (sp && sp.titel) b = sp.titel; } catch (e) {}
    if (!b) b = (du.baut || '').trim();
    if (b && b.length <= 48) f = 'Was ist bei „' + b + '“ als Nächstes dran?';
    else if (b) f = 'Was ist bei deinem Vorhaben als Nächstes dran?';
    else {
      var m = { Ordnen: 'Was soll ich zuerst für dich ordnen?', Erinnern: 'Woran soll ich dich erinnern?', Widersprechen: 'Bei welcher Idee soll ich dir widersprechen?', Nachschlagen: 'Was soll ich für dich nachschlagen?', Abfragen: 'Was soll ich dich abfragen?', Schreiben: 'Woran schreibst du gerade?' };
      f = (du.tun && du.tun.length && m[du.tun[0]]) || 'Was geht dir heute nicht aus dem Kopf?';
    }
    return vor + gross(f);
  }
};
