// Carls Stimme: feste Sätze je Raum und Lage. Eine Quelle für alle Räume.
// Regeln: höchstens zwei kurze Sätze, höchstens eine Frage (am Ende), Ich-Form, du,
// leise (kein Ausrufezeichen), ein Witz über mich, nie über dich, keine Technikwörter.
var C6 = window.C6 = window.C6 || {};

var T = {
  // Begrüßung je Tageszeit (Zuhause, wenn du zurückkommst)
  'gruss.morgen': ['Guten Morgen, {name}. Ich hab die Socken schon an.', 'Morgen, {name}. Was liegt heute oben?', 'Da bist du. Ich hab geträumt, ich wär ein Fahrrad.'],
  'gruss.mittag': ['Da bist du, {name}. Woran sitzt du gerade?', 'Da bist du wieder. Ich hab aufgeräumt, so gut es mit zwei Blättern geht.'],
  'gruss.abend': ['Guten Abend, {name}. Was war heute gut?', 'Abend, {name}. Leg ab, was dich noch beschäftigt.'],
  'gruss.nacht': ['Noch wach, {name}? Ich auch. Schreib\u2019s mir, dann kann der Kopf schlafen.', 'Spät. Ein Satz, dann ist Ruhe?'],

  // Arbeit
  'warten': ['Moment, ich such.', 'Ich denk kurz nach. Das dauert bei Steinen.', 'Ich bin dran.'],
  'fertig': ['Fertig. Willst du sehen, was ich gefunden hab?', 'Ich bin durch. Es liegt für dich bereit.', 'Erledigt. Ich hab nichts geändert, nur hingelegt.'],
  'nichtVerstanden': ['Das hab ich nicht verstanden. Sagst du es mir anders?', 'Da komm ich nicht mit. Ein Beispiel hilft mir.'],
  'offline': ['Ich komm gerade nicht raus. Was du schreibst, heb ich auf.', 'Gerade keine Verbindung. Ich merk mir alles und mach weiter, sobald es geht.'],
  'nichtGesichert': ['Ich hab das gerade nicht sichern können. Tipp nochmal, ich versuch’s.'],
  'gespeichert': ['Liegt bei mir.', 'Aufgehoben.'],
  'rueckgaengig': ['Zurückgelegt. Wie vorher.'],
  'leer': ['Hier liegt noch nichts. Erzähl mir was, dann wächst es.'],
  'beispiel': ['Das ist ein Beispiel von mir, kein echter Mensch.'],
  'probe': ['Im Prototyp antworte ich mit Beispielsätzen. Das sag ich lieber gleich.'],

  // Dinge, die geschehen
  'muenze': ['Eine Münze. Ich hab nicht gefragt, wo du sie gefunden hast.', 'Gefunden. Ich leg sie zu den anderen.'],
  'geruest': ['Ich hab dir ein Gerüst gebaut. Es gehört dir, mal es an, wie du willst.', 'Da steht dein Gerüst. Wo soll es hin?'],
  'geruestGeteilt': ['Dein Gerüst steht jetzt im Teleskop. Nur der Bauplan, nichts Privates.'],
  'nadel': ['Da steckt die Nadel. Das ist der Satz, der übrig bleibt.', 'Alles andere ist verbrannt. Das hier bleibt.'],
  'nadelSetzen': ['Tipp dorthin, wo es hakt. Ich steck die Nadel.'],
  'nadelDanke': ['Danke. Ich hab’s an die Werkstatt geschickt.', 'Steckt. Die Werkstatt liest es.'],
  'perle': ['Eine Perle mehr auf deinem Faden.', 'Hab ich auf deinen Faden gefädelt.'],
  'begleiter': ['Eine Sache von heute, die bleiben soll?'],
  'knoten': ['Hier treffen sich zwei deiner Gedanken. Was verbindet sie?'],
  'damals': ['Das hast du mal geschrieben. Passt es noch?'],
  'teleskop': ['Das sind Gerüste zum Anschauen. Nimm mit, was dich anstößt.'],
  'socken': ['Neue Socken. Ich lauf heute nur auf Zehenspitzen.', 'Die sitzen. Fast.'],
  'kieselpark': ['Während ich arbeite, fährst du. Im Kieselpark.'],
  'laden.rein': ['Ich probier gern an. Du entscheidest.'],
  'laden.gekauft': ['Steht mir. Sag nichts.'],
  'laden.zuwenig': ['Dafür reichen die Münzen noch nicht. Es läuft nicht weg.'],
  'tippen': ['Du kannst mich antippen. Dann hör ich zu.'],
  'antippen': ['Du kannst mich antippen. Dann hör ich zu.'],
  'nichtDa': ['Nicht da. Na gut, doch.'],
  'daBinIch': ['Da bin ich.'],
  'zweiGedanken': ['Ich leg dir zwei Gedanken hin, und du findest den Satz dazwischen.'],
  'platzhalter': ['Ein Satz reicht.'],
  'abschied': ['Bis gleich. Ich pass auf alles auf.'],

  // Was in jedem Raum für dich geschieht (ein Satz)
  'raum.zuhause': ['Hier wohne ich. Hier reden wir.'],
  'raum.fahrrad': ['Ein Mädchen hat einmal von diesem Fahrrad geträumt. Jetzt ist es deins.'],
  'fahrradTeil': ['Tipp ein Teil an. Daran binde ich, woran du gerade baust.'],
  'fahrradTeilLeer': ['Tipp ein Teil an. Dann sag mir, was es tragen soll.'],
  'raum.werkstatt': ['Hier bau ich dir kleine Werkzeuge, nur für dich.'],
  'raum.bibliothek': ['Hier steht, was ich über dich weiß. Du darfst alles umschreiben.'],
  'raum.laden': ['Mein Kleiderschrank. Bezahlt wird mit Münzen, die du findest.'],
  'raum.netz': ['Das ist dein Himmel. Jeder Gedanke ein Planet, und wo sie sich treffen, wird es hell.'],
  'himmel.leer': ['Dein Himmel ist noch still. Woran denkst du gerade? Daraus wird dein erster Planet.'],
  'himmel.erster': ['Dein erster Planet. Ich häng ihn dir hoch, du gibst ihm den Namen.'],
  'bib.meisterFrage': ['Und du? Was davon ist schon in dir?'],
  'raum.teleskop': ['Durchs Teleskop siehst du, was andere gebaut haben. Nimm mit, was dich anstößt.'],
  'raum.post': ['Hier hängt, was du der Werkstatt geschrieben hast. Sie liest nachts.'],

  // Der Rundgang (erstes Öffnen)
  'rg.wecken': ['tipp ihn an'],
  'rg.wach': ['Oh. Du. Ich hab geschlafen wie ein Stein.'],
  'rg.name': ['Wie soll ich dich nennen?'],
  'rg.nameDanke': ['{name}. Schön. Jetzt werd ich rot.', 'Gut. Ich werd trotzdem rot.'],
  'rg.carlName': ['Ich heiße Carl. Darf das so bleiben?'],
  'rg.baut': ['Woran baust du gerade?'],
  'rg.bautDanke': ['„{baut}“. Da wächst mir gleich was.', 'Dann fangen wir leer an. Mir wächst trotzdem was.'],
  'rg.hilfe': ['Wobei soll ich dir helfen?'],
  'rg.hilfeDanke': ['Jetzt kann ich lachen. Komm mit.'],
  'rg.hilfeLeer': ['Dann schau ich zu. Lachen kann ich trotzdem.'],
  'rg.ton': ['Wie soll ich klingen?'],
  'rg.tonDanke': ['So. Jetzt schreib ich mit Tinte.'],
  'rg.vogel': ['Das ist dein Himmel. Jeder Gedanke wird ein Planet, und wo sie sich treffen, wird es hell.'],
  'rg.vogelLeer': ['Hier oben wird später dein Himmel sein. Jeder Gedanke ein Planet, und wo sie sich treffen, wird es hell.'],
  'rg.socken': ['Eins fehlt noch. Welche Farbe sollen meine Socken haben?'],
  'rg.ganz': ['Jetzt bin ich ganz.'],

  // Brief von Carl: höchstens eine kleine Aufgabe am Tag, immer aus einem deiner Fäden
  'auftrag.titel': ['Brief von Carl'],
  'auftrag.satz': ['Schreib mir einen Satz, warum „{titel}“ dir wichtig ist.', 'Ein Satz zu „{titel}“: Was wäre ohne es anders?'],
  'auftrag.verbindung': ['Was haben „{a}“ und „{b}“ miteinander zu tun? Ein Satz reicht.', '„{a}“ und „{b}“ wohnen bei dir nebeneinander. Was verbindet die zwei?'],
  'auftrag.verbindungPerlen': ['Auf „{titel}“ liegen „{a}“ und „{b}“. Was verbindet die beiden?'],
  'auftrag.gegenspieler': ['Jemand hält „{titel}“ für eine schlechte Idee. Schreib seinen besten Satz auf.', 'Was würde der klügste Zweifler zu „{titel}“ sagen? Ein Satz, in seiner Stimme.'],
  'auftrag.damals': ['Am {datum} hast du geschrieben: „{zitat}“. Stimmt das heute noch?', 'Das hast du am {datum} geschrieben: „{zitat}“. Was würdest du heute dazuschreiben?'],
  'auftrag.gruss': ['Bis bald. Carl'],
  'auftrag.bringt': ['Ich hab dir was mitgebracht. Es liegt da, wenn du magst.', 'Post von mir. Kein Eilbrief.'],
  'auftrag.danke': ['Liegt jetzt auf deinem Faden. Ich hab mich gefreut, das sieht man mir an.', 'Aufgefädelt. Das war ein guter Satz.'],
  'auftrag.dankeKnoten': ['Jetzt hängen „{a}“ und „{b}“ zusammen. Oben am Himmel leuchtet es.'],
  'auftrag.spaeter': ['Gut. Der Brief liegt da und läuft nicht weg.', 'Kein Eilbrief. Er wartet.'],
  'auftrag.schon': ['Für heute hast du mir schon geschrieben: „{t}“. Morgen bring ich wieder was, wenn du magst.'],
  'auftrag.platzhalter': ['Ein Satz reicht.'],

  // Funde: was Carl zu deiner Suche sammelt. Herkunft steht immer dabei.
  'fund.du': ['Du hast am {datum} geschrieben: „{zitat}“'],
  'fund.herkunft.du': ['Aus deinen eigenen Sätzen'],
  'fund.herkunft.carl': ['Carls Gedanke, nicht nachgeprüft'],
  'fund.herkunft.recherche': ['Aus der Recherche, bitte selbst prüfen'],
  // Freundschaftsatlas
  'atlas.auf': ['Unser Buch. Ich hab schon reingeschrieben, du darfst trotzdem zuerst.', 'Blätter ruhig. Ich hab die Seiten nummeriert, damit ich mich nicht verlaufe.'],
  'atlas.antwort': ['Hab ich gelesen. Zweimal.', 'Das kleb ich mir ins Gedächtnis.', 'Steht drin. Mit Tinte, nicht mit Bleistift.'],
  'atlas.stempel': ['Den hätte ich auch genommen.'],
  'fund.bringt': ['Ich hab dir was dazu gesammelt. Es liegt hier am Boden.'],

  // Bausteine im Space (allgemein, {name} = Name des Bausteins; besondere Sätze je Baustein darunter)
  'baustein.anlegen': ['„{name}“ steht jetzt in deiner Landschaft. Wo soll es hin?', 'Ich hab „{name}“ hingestellt. Verschieb es, wie du magst.'],
  'baustein.auf': ['Das ist „{name}“. Was trägst du ein?'],
  'baustein.weg': ['„{name}“ ist zurück im Regal. Nichts ist verloren.'],
  'baustein.erste': ['Deine erste Eintragung. Ich heb sie auf.'],
  'baustein.leer': ['Hier steht noch nichts. Fang mit heute an?'],
  'baustein.gewohnheit.anlegen': ['Ein Begleiter für eine Gewohnheit. Ich zähle nicht, ich geh nur mit.', 'Steht. Keine Kette, kein Druck, nur Perlen.'],
  'baustein.gewohnheit.auf': ['Welche Gewohnheit soll ich begleiten?'],
  'baustein.gewohnheit.erste': ['Die erste Perle. Ich hab sie aufgefädelt, nicht gezählt.'],
  'baustein.gewohnheit.leer': ['Noch keine Perle. Der Faden wartet, er hat Zeit.'],
  'baustein.gewohnheit.weg': ['Der Begleiter ist zurück im Regal. Deine Perlen bleiben bei mir.'],
  'baustein.essen.anlegen': ['Eine Liste fürs Essen. Ich schreib nur auf, was du mir sagst.'],
  'baustein.essen.auf': ['Was hast du gegessen? Ein Wort reicht mir.'],
  'baustein.essen.erste': ['Aufgeschrieben. Ich selbst ess nur Licht, als Stein.'],
  'baustein.essen.leer': ['Noch nichts aufgeschrieben. Was war das Letzte?'],
  'baustein.schlaf.anlegen': ['Hier schreib ich auf, wie du geschlafen hast. Ich frag nicht nach Zahlen, nur wie es war.'],
  'baustein.schlaf.auf': ['Wie hast du geschlafen?'],
  'baustein.schlaf.erste': ['Hab ich mir gemerkt. Ich schlaf ja wie ein Stein, das zählt nicht.'],
  'baustein.schlaf.leer': ['Noch nichts. Wie war die letzte Nacht?'],
  'baustein.kalender.anlegen': ['Ein Kalender für deine Landschaft. Er zeigt, was du hineinschreibst, nicht mehr.'],
  'baustein.kalender.auf': ['Was steht an, und wann?'],
  'baustein.kalender.erste': ['Steht drin. Ich erinnere dich leise, nicht laut.'],
  'baustein.kalender.leer': ['Noch leer. Was ist das Nächste, das ansteht?'],
  'baustein.todo.anlegen': ['„Zu tun“ steht. Abhaken darfst du, zählen tu ich nicht.'],
  'baustein.todo.auf': ['Was ist als Erstes dran?'],
  'baustein.todo.erste': ['Steht drauf. Eins nach dem anderen.'],
  'baustein.todo.leer': ['Noch nichts zu tun aufgeschrieben. Was willst du als Erstes loswerden?'],
  // Anbindungen (Whoop, Fitbit, Strava): nur ein Satz in der ganzen App, er steht beim Beamer (beamer.anbindung)
  'baustein.beamer.anlegen': ['Dein Beamer steht. Alles, was du mir gibst, leg ich hier auf.'],
  'baustein.beamer.auf': ['Das ist dein Beamer. Was soll ich dir zeigen?'],
  'baustein.beamer.leer': ['Noch nichts auf dem Beamer. Ein Bild, eine Adresse oder ein Ergebnis aus der Werkstatt passt hierher.'],
  'baustein.harness.anlegen': ['Hier bring ich dir bei, wie ein Helfer für dich arbeitet. Drei kleine Seiten.'],
  'baustein.harness.auf': ['Welche Seite zuerst?'],
  'baustein.harness.leer': ['Noch kein Haken. Fang mit der ersten Seite an?'],
  'baustein.ziehen': ['Du kannst ihn auch ziehen. Nimm ihn und leg ihn ab, wo er hingehört.'],
  'baustein.hingelegt': ['Liegt in deiner Landschaft.'],
  'baustein.gewohnheit.punkt': ['Eine Perle mehr. Ich zähl nicht, ich fädel.'],
  'baustein.todo.fertig': ['Abgehakt. Eins weniger zu tun.'],

  // Beamer: was auf der Leinwand liegt
  'beamer.leer': ['Der Beamer ist an, aber es liegt nichts drauf. Gib mir ein Bild oder eine Adresse.'],
  'beamer.seite': ['Das ist eine fremde Seite. Ich zeig sie nur, ich hab sie nicht gebaut.'],
  'beamer.erst': ['Das ist mein Beamer. Was ich dir zeigen will, wirft er an die Wand.'],
  'beamer.bild': ['Dein Bild liegt auf dem Beamer. Es bleibt auf diesem Gerät.'],
  'beamer.ergebnis': ['Das Ergebnis aus der Werkstatt liegt jetzt hier oben. Es bleibt.'],
  'beamer.anbindung': ['Hier kommt später an, was Whoop, Fitbit oder Strava über dich wissen. Noch nicht, ich halte nur den Platz frei.'],
  'beamer.nichtEinbettbar': ['Diese Seite lässt sich hier nicht hineinlegen. Ich öffne sie dir in einem eigenen Fenster.'],

  // Gefährt: worin Carl im Himmel sitzt
  'gefaehrt.anprobe': ['Ich probier „{name}“ an. Du entscheidest, ob ich darin fliege.'],
  'gefaehrt.himmel': ['Hier oben sitz ich besser, als ich stehe. Sieh dich um.'],
  'gefaehrt.zuFuss': ['Zu Fuß. Die Keimblätter tragen mich auch, nur nicht lange.'],
  'gefaehrt.ufo.anprobe': ['Ein kleines Flugding, nur für mich. Ich bin froh, dass ich nicht mehr selbst schweben muss.'],
  'gefaehrt.couch.anprobe': ['Eine Couch, die schwebt. Ich glaub, ich steh nie wieder auf.'],
  'gefaehrt.wolke.anprobe': ['Ein Wolkenkissen. Weicher, als ich es für einen Stein verdient habe.'],

  // Wartezeit: nur ein leiser Satz, wenn Carl aus Stufe 3 aufwacht. Stufe 1 und 2 bleiben wortlos.
  'warte.3': ['Oh. Ich war kurz weg. Wo waren wir?', 'Ich bin eingenickt. Was war noch?'],

  // Gewohnheiten: fast nie ein Satz. Zwei Halbsätze für Räume, die einen brauchen.
  'gewohnheit.schrauben': ['Ich schraub nur ein bisschen. Das Rad merkt nichts.'],
  'gewohnheit.lesen': ['Ich les nur eine Seite. Erzähl ruhig weiter.'],

  // Lektionen: Carl bringt es bei
  'lehre.auf': ['Drei Seiten, auf denen ich dir zeig, wie ein Helfer für dich arbeitet. Welche zuerst?', 'Drei Seiten. Nimm dir eine.'],
  'lehre.schritt': ['Ein Schritt, ein Ergebnis daneben. So geht es weiter.'],
  'lehre.uebung': ['Jetzt du. Die Übung machst du in der App, nicht auf der Seite.'],
  'lehre.geschafft': ['Du hast es gemacht. Der Haken bleibt, auch wenn du die App zumachst.', 'Haken dran. Das war deine Arbeit, nicht meine.'],
  'lehre.wartet': ['Die Übung wartet. Ich schau nach, sobald du es getan hast.'],
  'lehre.nochNicht': ['Das gibt es noch nicht. Ich sag es lieber, als dass ich so tue.'],

  // Wünsche der anderen Räume (Kreuzungsblatt m1): kurze Sätze, meist ein Halbsatz, nie drängend
  'zuhause.vogel': ['Ein Vogel. Still, sonst fliegt er.'],
  'bib.seite': ['Die Seite hat sich von selbst umgeblättert. Das macht sie manchmal.'],
  'himmel.gefaehrt': ['Hier oben hab ich meinen Platz. Von hier sieht man alles.'],
  'himmel.sternschnuppe': [''],
  'teleskop.carl': ['Ich schau mit. Da drüben leuchtet eins, das dich anstößt.'],
  'blatt.liegt': ['Das Blatt bleibt liegen. Auf der Bank und in deinem Space.'],
  'blatt.weiter': ['Ich denk weiter. Einen Moment.'],
  'blatt.beispiel': ['Ausarbeiten kann ich hier noch nicht. Das Blatt bleibt trotzdem.'],
  'beamer.fremd': ['Eine fremde Seite. Ich zeig sie nur, ich kenn sie nicht.'],
  'gefaehrt.couch': ['Eine Couch, die schwebt. Ich glaub, ich steh nie wieder auf.'],
  'gefaehrt.wolke': ['Ein Wolkenkissen. Weicher, als ich es für einen Stein verdient habe.'],
  'gefaehrt.tasse': ['Eine Tasse als Sitz. Wenn du rührst, sag Bescheid.'],
  'gefaehrt.zuwenig': ['Dafür reichen die Münzen noch nicht. Ich bleib solange zu Fuß.'],
  'laden.sitzen': ['Ich setz mich kurz. Du entscheidest trotzdem.'],
  'laden.spiegel': ['Tipp den Spiegel an, dann dreh ich mich.'],
  'laden.taschen': ['Taschen. Ich hab jetzt Taschen.'],
  'werkstatt.beispiel': ['Hier im Prototyp sind das Beispiele von mir.'],
  'fahrrad.schrauben': ['Ich schraub nur ein bisschen. Es klappert nichts, das ist Gewohnheit.'],
  'fahrrad.vogel': ['Ein Vogel auf dem Lenker. Ich halt still.'],
  'baustein.neu': ['Steht. Ich stell ihn dir hin.'],
  'baustein.todoFertig': ['Abgehakt. Eins weniger zu tun.'],
  'baustein.gewohnheitPunkt': ['Eine Perle mehr. Ich zähl nicht, ich fädel.'],
  'space.vogel': ['Ein Vogel in deiner Landschaft. Er bleibt, solange es still ist.'],

  // Post als Raum
  'post.leer': ['Hier hängt noch kein Brief. Schreib mir, was hakt, bremst oder dich freut.'],
  'post.liegtHier': ['Der Brief liegt hier bei mir. Zur Werkstatt komm ich gerade nicht durch.'],
  'post.briefkasten': ['Eingesteckt. Er geht raus, sobald ich wieder durchkomme.'],
  'post.raus': ['Ist raus. Die Werkstatt liest nachts.'],
  'post.danke': ['Danke. Ich häng ihn an die Leine, dann sehen wir beide, was du geschrieben hast.'],
  'post.nadelDa': ['Diese Nadel steckt in einem anderen Raum. Soll ich dich hinbringen?'],
  'post.fenster': ['Das Licht kommt vom Fenster. Darum liegen die Schatten alle nach rechts.']
};

// Was im Rundgang die Antworten anbietet (Daten, damit alle dieselben Wörter sehen)
var WAHL = {
  hilfe: ['Ordnen', 'Erinnern', 'Widersprechen', 'Nachschlagen', 'Abfragen', 'Schreiben'],
  ton: [['leise', 'Leise und kurz'], ['warm', 'Warm'], ['trocken', 'Trocken, mit Witz'], ['ehrlich', 'Ehrlich, auch wenn’s piekst']],
  socken: [['#d62a26', 'Rot'], ['#e8621a', 'Orange'], ['#e3b23c', 'Senf'], ['#8ea37a', 'Moos'], ['#3f6fa8', 'Blau'], ['#2b2722', 'Schwarz']],
  bautAnfang: ['Gerade baue ich ', 'Ich lerne für ', 'Ich schreibe an ']
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
  // ohne Namen sauber bleiben: ", ." / "Morgen, ." / "{name}. " am Anfang
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
  gruss: function (d) {
    var h = (d || new Date()).getHours();
    var k = h < 5 ? 'nacht' : h < 11 ? 'morgen' : h < 17 ? 'mittag' : h < 22 ? 'abend' : 'nacht';
    return C6.stimme.sag('gruss.' + k);
  },
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
  // Carls erster Satz nach dem Rundgang: konkret, aus deinen Antworten, mit offener Frage
  erster: function () {
    var du = S().du || {}, rg = S().rundgang || {};
    // „ganz“ nur, wenn der Rundgang zu Ende gegangen ist; sonst ohne Vorgeschichte
    var ganz = du.fertig && !rg.uebersprungen;
    var vor = ganz ? (du.name ? du.name + ', ich bin ganz. ' : 'Ich bin ganz. ') : (du.name ? 'Da bin ich, ' + du.name + '. ' : 'Da bin ich. ');
    var b = (du.baut || '').trim();
    if (b && b.length <= 48) return vor + 'Was ist bei „' + b + '“ diese Woche dran?';
    if (b) return vor + 'Was ist bei deinem Vorhaben diese Woche als Erstes dran?';
    var f = { Ordnen: 'Was soll ich zuerst für dich ordnen?', Erinnern: 'Woran soll ich dich zuerst erinnern?', Widersprechen: 'Bei welcher Idee soll ich dir zuerst widersprechen?', Nachschlagen: 'Was soll ich zuerst für dich nachschlagen?', Abfragen: 'Was soll ich dich zuerst abfragen?', Schreiben: 'Woran schreibst du gerade?' };
    if (du.tun && du.tun.length && f[du.tun[0]]) return vor + f[du.tun[0]];
    return vor + 'Was geht dir heute nicht aus dem Kopf?';
  }
};
