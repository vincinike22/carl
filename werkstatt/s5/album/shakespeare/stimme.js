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
  'geruestGeteilt': ['Dein Gerüst steht jetzt im Teleskop. Nur der Bauplan, nichts Privates.'],
  'nadel': ['Die Nadel steckt. Das ist der Satz, der bleibt.', 'Alles andere darf gehen. Das hier bleibt.'],
  'perle': ['Eine Perle mehr auf deinem Faden.', 'Hab ich auf deinen Faden gefädelt.'],
  'teleskop': ['Gerüste von anderen. Nimm mit, was dich anstößt.'],
  'tippen': ['Ich hör zu.'],
  'nichtDa': ['Nicht da. Na gut, doch.'],
  'platzhalter': ['Ein Satz reicht.'],

  // Räume (ein Satz, wenn man ankommt oder etwas antippt)
  'raum.post': ['Hier hängt, was du der Werkstatt geschrieben hast. Sie liest nachts.'],
  'post.leer': ['Noch kein Brief. Schreib, was hakt oder dich freut.'],
  'fahrradTeil': ['Tipp ein Teil an. Daran binde ich, woran du gerade baust.'],
  'himmel.leer': ['Noch still hier oben. Woran denkst du gerade?'],
  'himmel.raum': ['In der Mitte bist du. Tipp einen Planeten an, dann fliegen wir hin.'],
  'bib.meisterFrage': ['Und du? Was davon ist schon in dir?'],
  'lesesaal.erst': ['Hier wohnt, was Menschen herausgefunden haben. Tipp einen Gang an, oder leg mir etwas hinein.'],
  'werkstatt.bankLeer': ['Hier liegt bald, woran du baust.'],
  'blatt.weiter': ['Ich denk weiter. Einen Moment.'],
  'blatt.beispiel': ['Ausarbeiten kann ich hier noch nicht. Das Blatt bleibt trotzdem.'],

  // Der Rundgang (erstes Öffnen). Jede Antwort schenkt Carl ein Stück von sich.
  'rg.wecken': ['tipp ihn an'],
  'rg.wach': ['Oh. Du. Ich hab geschlafen wie ein Stein.'],
  'rg.name': ['Ich bin {carl}. Und du?'],
  'rg.nameDanke': ['{name}. Jetzt werd ich rot.', 'Gut. Ich werd trotzdem rot.'],
  'rg.fahrrad': ['Von diesem Rad hat einmal ein Mädchen geträumt.'],
  'rg.baut': ['Woran baust du gerade?'],
  'rg.bautDanke': ['„{baut}“. Da wächst mir gleich was.', 'Dann fangen wir leer an. Mir wächst trotzdem was.'],
  'rg.werkstatt': ['Hier bau ich dir Werkzeuge.'],
  'rg.hilfe': ['Wobei soll ich helfen?'],
  'rg.hilfeDanke': ['Jetzt kann ich lachen. Komm mit.'],
  'rg.hilfeLeer': ['Dann schau ich erst mal zu. Lachen kann ich trotzdem.'],
  'rg.bibliothek': ['Hier schreib ich auf, was ich von dir weiß.'],
  'rg.ton': ['Wie soll ich klingen?'],
  'rg.tonDanke': ['So. Jetzt schreib ich mit Tinte.'],
  'rg.vogel': ['Dein Himmel. Wo zwei Gedanken sich treffen, wird es hell.'],
  'rg.vogelLeer': ['Hier oben wohnen bald deine Gedanken. Wo zwei sich treffen, wird es hell.'],
  'rg.socken': ['Eins fehlt noch. Welche Farbe haben meine Socken?'],
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
  'auftrag.danke': ['Liegt auf deinem Faden. Ich freu mich, das sieht man.', 'Aufgefädelt. Das war ein guter Satz.'],
  'auftrag.dankeKnoten': ['Jetzt hängen „{a}“ und „{b}“ zusammen. Oben am Himmel leuchtet es.'],
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
  'baustein.gewohnheit.anlegen': ['Hängt. Tipp sie an, wenn sie heute war.', 'Hängt. Keine Kette, kein Druck, nur Perlen.'],
  'baustein.gewohnheit.punkt': ['Eine Perle mehr. Ich zähl nicht, ich fädel.'],
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
  'lehre.nochNicht': ['Das gibt es noch nicht. Lieber sag ich das, als so zu tun.']
};

// Was im Rundgang die Antworten anbietet (höchstens drei Wahlen, wo Carl fragt)
var WAHL = {
  hilfe: ['Ordnen', 'Erinnern', 'Widersprechen'],
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
    var ganz = du.fertig && !rg.uebersprungen;
    var n = du.name || '';
    var vor = ganz ? (n ? n + ', ' : '') : (n ? 'Da bin ich, ' + n + '. ' : 'Da bin ich. ');
    var gross = function (f) { return vor && !/[.]\s$/.test(vor) ? f.charAt(0).toLowerCase() + f.slice(1) : f; };
    var b = (du.baut || '').trim(), f;
    if (b && b.length <= 48) f = 'Was ist bei „' + b + '“ als Nächstes dran?';
    else if (b) f = 'Was ist bei deinem Vorhaben als Nächstes dran?';
    else {
      var m = { Ordnen: 'Was soll ich zuerst für dich ordnen?', Erinnern: 'Woran soll ich dich erinnern?', Widersprechen: 'Bei welcher Idee soll ich dir widersprechen?', Nachschlagen: 'Was soll ich für dich nachschlagen?', Abfragen: 'Was soll ich dich abfragen?', Schreiben: 'Woran schreibst du gerade?' };
      f = (du.tun && du.tun.length && m[du.tun[0]]) || 'Was geht dir heute nicht aus dem Kopf?';
    }
    return vor + gross(f);
  }
};
