// Quests: belohnt wird Verstehen und Selbst-Einrichten, geprüft am Zustand – nie das bloße Ja zu einem Recht
var C6 = window.C6 = window.C6 || {};
(function () {
  function S() { return C6.S || (C6.S = {}); }
  function Q() { var s = S(); if (!s.quest || typeof s.quest !== 'object' || Array.isArray(s.quest)) s.quest = {}; return s.quest; }
  function aendern(fn) {
    if (typeof C6.aendern === 'function') C6.aendern(function (s) { if (!s.quest || typeof s.quest !== 'object' || Array.isArray(s.quest)) s.quest = {}; fn(s.quest, s); });
    else { fn(Q(), S()); try { C6.speichern && C6.speichern(); } catch (e) {} }
  }
  function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
  function worte(t) { return String(t || '').replace(/[^\wäöüÄÖÜß\s-]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 1; }); }
  function norm(t) { return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  function obj(x) { return x && typeof x === 'object' ? x : {}; }
  var NUR_JA = /^(ja|jo|ok|okay|passt|klar|gerne|gern|sicher|darf er|darfst du|alles|ja klar|mach)[.!\s]*$/i;

  function spaces() { var sp = obj(S().spaces); return Object.keys(sp).map(function (k) { return obj(sp[k]); }); }
  function knoten() {
    try { if (C6.strings && typeof C6.strings.knotenAlle === 'function') return C6.strings.knotenAlle() || []; } catch (e) {}
    var st = obj(S().strings); return Array.isArray(st.knoten) ? st.knoten : [];
  }
  function werkzeuge() { var w = obj(S().werkzeug); return (Array.isArray(w.liste) ? w.liste : []).filter(function (x) { return x && !x.weg; }); }
  function funde() { var l = obj(S().lesesaal); return Array.isArray(l.funde) ? l.funde : []; }
  function beleg(id) { return obj(Q()._beleg)[id] || null; }

  /* Die Liste: Titel und Satz sind Vorschläge; die Quest-Tafel darf sie über C6.quest.texte überschreiben */
  var LISTE = [
    { id: 'samen', wo: 'zuhause', kann: 'Jeder Satz, den du sagst, findet seinen Ort.', titel: 'Den ersten Samen pflanzen', satz: 'Sag Carl einen Satz und häng ihn in einen Space.', muenzen: 3,
      pruef: function () { return spaces().some(function (x) { return Array.isArray(x.notizen) && x.notizen.some(function (n) { return n && n.von !== 'carl' && n.von !== 'fund' && String(n.t || '').trim(); }); }); } },
    { id: 'freund3', wo: 'zuhause', kann: 'Carl redet mit dir, ohne zu raten.', titel: 'Carl drei Dinge über dich sagen', satz: 'Schreib drei Dinge über dich ins Freundschaftsbuch.', muenzen: 5,
      pruef: function () {
        var du = obj(S().du), n = 0;
        ['name', 'arbeit', 'baut', 'tun', 'nie', 'ton', 'mag', 'wohnt', 'liebt', 'lernt'].forEach(function (k) {
          var v = du[k]; if (Array.isArray(v) ? v.filter(Boolean).length : String(v == null ? '' : v).trim().length >= 2) n++;
        });
        var best = Array.isArray(du.bestaetigt) ? du.bestaetigt.filter(function (b) { return b && worte(b.t || b).length >= 2; }).length : 0;
        return n >= 3 || best >= 3;
      } },
    { id: 'sternbild', wo: 'netz', kann: 'Du siehst, was bei dir zusammengehört.', titel: 'Das erste Sternbild', satz: 'Verbinde im Himmel zwei Planeten mit deinem Satz.', muenzen: 5,
      pruef: function () { return knoten().some(function (k) { return k && k.a && k.b && String(k.satz || '').trim(); }); } },
    { id: 'werkzeug', wo: 'werkstatt', kann: 'Du baust dir Werkzeuge mit Worten.', titel: 'Ein Werkzeug in eigenen Worten', satz: 'Beschreib Carl ein Werkzeug, das du brauchst – er baut es mit dir.', muenzen: 5,
            // nur aus eigenen Worten: mindestens drei Wörter, und kein Satz einer Vorlage (ein Tipp auf eine Vorlage ist kein Verstehen)
      pruef: function () {
        var vorlagen = []; try { vorlagen = ((C6.werkzeug && C6.werkzeug.vorlagen) || []).map(function (v) { return norm(v && (v.satz || v.text || v.name)); }); } catch (e) {}
        return werkzeuge().some(function (w) { var t = w.satz || w.wunsch; return w.von !== 'vorlage' && worte(t).length >= 3 && vorlagen.indexOf(norm(t)) < 0; });
      } },
    { id: 'fund', wo: 'lesesaal', kann: 'Du entscheidest, was stimmt – nicht Carl.', titel: 'Einen Fund prüfen', satz: 'Lies einen Fund im Lesesaal und sag: stimmt – oder stimmt so nicht.', muenzen: 5,
            // zu prüfen gibt es nur echtes Material (eingefügter Text, Zahlenreihe, Datei mit Notiz) – oder Otto widerspricht mit eigenen Worten
      pruef: function () {
        return funde().some(function (f) {
          if (!f) return false;
          var material = f.art === 'text' || f.art === 'zahlen' || (f.art === 'datei' && worte(f.notiz).length >= 3);
          if ((f.urteil === 'stimmt' || f.urteil === 'stimmtNicht') && material) return true;
          return f.urteil === 'stimmtNicht' && worte(f.korrektur).length >= 3;
        });
      } },
    { id: 'ferdl', wo: 'werkstatt', kann: 'Ferdl liest für dich nach.', titel: 'Ferdl einen Auftrag geben', satz: 'Gib Ferdl in der Werkstatt ein Thema, dem er nachgehen soll.', muenzen: 5,
      pruef: function () {
        var f = obj(obj(S().werkstatt).ferdl);
        if (Array.isArray(f.auftraege) && f.auftraege.some(function (a) { return a && worte(a.thema || a.t).length >= 2; })) return true;
        var b = beleg('ferdl'); return !!(b && worte(b.thema).length >= 2);
      } },
    { id: 'rechte', wo: 'fahrrad', kann: 'Du weißt, was Carl an deinem Rechner darf.', titel: 'Sagen, was Carl am Rechner darf', satz: 'Bevor du verbindest: sag in deinen Worten, was Carl auf deinem Rechner tun darf.', muenzen: 5,
      pruef: function () {
        var v = obj(S().verbindung), r = obj(v.rechteSatz), t = String(r.t || obj(v.rechte).satz || '').trim();
        return worte(t).length >= 5 && !NUR_JA.test(t);
      } },
    { id: 'rechner', wo: 'fahrrad', kann: 'Carl weiß, dass bei dir ein Helfer läuft.', titel: 'Carl mit deinem Rechner verbinden', satz: 'Richte die Verbindung ein; Carl prüft den Code.', muenzen: 8, braucht: 'rechte',
      // geprüft heißt: der Code wurde verglichen (codeGeprueft) – oder der Stand „verbunden“, den nur der Code-Vergleich setzt
      pruef: function () { var v = obj(S().verbindung); return !!v.codeGeprueft || (v.status === 'verbunden' && !!v.wer && !!v.seit); } },
    { id: 'modell', wo: 'fahrrad', kann: 'Carl denkt auf deinem Rechner mit.', titel: 'Carl auf deinem Rechner mitdenken lassen', satz: 'Lass Carl auf deinem Rechner mitdenken und mach die Probe.', muenzen: 8,
      // nur eine echte, nicht leere Antwort des eigenen Modells zählt – nie das bloße Einschalten
      pruef: function () { var l = obj(S().lokal), p = obj(obj(S().verbindung).probe); return !!((l.url && l.modell && (l.probeOk || l.zuletzt)) || p.ts); } },
    { id: 'github', wo: 'fahrrad', titel: 'GitHub verbinden', satz: 'Kommt – sobald Carl es wirklich prüfen kann.', muenzen: 0, kommt: true,
      pruef: function () { return false; } }
  ];
  var NACH_ID = {}; LISTE.forEach(function (q) { NACH_ID[q.id] = q; });

  function fest(k) { try { var v = C6.stimme && (typeof C6.stimme.fest === 'function' ? C6.stimme.fest(k) : C6.stimme.sag(k)); return v && v !== k ? String(v) : ''; } catch (e) { return ''; } }
  function text(q) {
    var t = obj(obj(C6.quest && C6.quest.texte)[q.id]);
    return { titel: t.titel || fest('quest.' + q.id + '.titel') || q.titel, satz: t.satz || fest('quest.' + q.id + '.satz') || q.satz, hin: t.hin || fest('quest.' + q.id + '.hin') || '', kann: t.kann || fest('quest.' + q.id + '.kann') || q.kann || '' };
  }
  function zustand(q) {
    var e = obj(Q()[q.id]);
    var t = text(q);
    return { id: q.id, titel: t.titel, satz: t.satz, hin: t.hin, kann: t.kann, wo: q.wo || null, muenzen: q.muenzen, erfuellt: !!e.am, erledigt: e.am || null, am: e.am || null, belohnt: e.belohnt || 0, kommt: !!q.kommt, braucht: q.braucht || null };
  }
  function istErfuellt(q) {
    if (q.kommt) return false;
    if (q.braucht && !(obj(Q()[q.braucht]).am || pruefeRoh(NACH_ID[q.braucht]))) return false;
    return pruefeRoh(q);
  }
  function pruefeRoh(q) { if (!q) return false; try { return !!q.pruef(); } catch (e) { return false; } }

  /* Münzen: einmal je Quest; nimmt die Kasse sie (noch) nicht, bleibt die Belohnung offen und kommt später */
  function zahle(q) {
    var e = obj(Q()[q.id]);
    if (!e.am || e.belohnt || !q.muenzen) return 0;
    var m = C6.muenzen;
    if (!m || typeof m.plus !== 'function' || typeof m.stand !== 'function') return 0;
    var vor = +m.stand() || 0, nach = vor;
    try { nach = +m.plus(q.muenzen, 'quest:' + q.id) || 0; } catch (x) { return 0; }
    if (nach > vor) { aendern(function (st) { st[q.id] = Object.assign({}, obj(st[q.id]), { belohnt: nach - vor }); }); return nach - vor; }
    return 0;
  }

  function erfuellt(id) {
    var q = NACH_ID[id]; if (!q) return false;
    var e = obj(Q()[id]);
    if (e.am) { if (!e.belohnt) zahle(q); return true; }
    if (!istErfuellt(q)) return false;
    aendern(function (st) { st[id] = { am: Date.now(), belohnt: 0 }; });
    var n = zahle(q);
    emit('quest', { id: id, neu: true, muenzen: n, titel: text(q).titel, kann: text(q).kann });
    return true;
  }
  function pruef() { var neu = []; LISTE.forEach(function (q) { var war = !!obj(Q()[q.id]).am; if (erfuellt(q.id) && !war) neu.push(q.id); }); return neu; }

  C6.quest = {
    texte: (C6.quest && C6.quest.texte) || {},
    alle: function () { return LISTE.map(zustand); },
    hol: function (id) { return NACH_ID[id] ? zustand(NACH_ID[id]) : null; },
    erfuellt: erfuellt,
    // der Weg dorthin: in den Raum der Quest, Carl sagt den einen Satz, wie es geht
    geh: function (id) {
      var q = NACH_ID[id]; if (!q || !q.wo || typeof C6.geh !== 'function') return false;
      try { C6.geh(q.wo); } catch (e) { return false; }
      var h = text(q).hin; if (h && C6.sag) setTimeout(function () { try { C6.sag(h); } catch (e) {} }, 700);
      return true;
    },
    pruef: pruef,
    _bald: function () { bald(); },
    stand: function () {
      var l = LISTE.filter(function (q) { return !q.kommt; });
      var e = l.filter(function (q) { return obj(Q()[q.id]).am; });
      return { erfuellt: e.length, gesamt: l.length, muenzen: e.reduce(function (s, q) { return s + (obj(Q()[q.id]).belohnt || 0); }, 0) };
    }
  };

  /* Belege, die nur als Ereignis kommen (Ferdls Auftrag): der Kern schreibt das Thema in den Zustand, geprüft wird dort */
  var uhr = null;
  function bald() { if (uhr) return; uhr = setTimeout(function () { uhr = null; try { pruef(); } catch (e) {} }, 700); }
  function an() {
    if (!C6.bus || typeof C6.bus.on !== 'function') return;
    C6.bus.on('helfer', function (d) {
      if (!d || d.was !== 'auftrag' || worte(d.thema).length < 2) return;
      aendern(function (st) { st._beleg = obj(st._beleg); if (!st._beleg.ferdl) st._beleg.ferdl = { thema: String(d.thema).slice(0, 160), ts: Date.now() }; });
      bald();
    });
    ['gespraech', 'raum', 'knoten', 'perle', 'gehaengt', 'verbindung', 'lokal', 'space', 'muenzen', 'fund', 'lesesaal', 'werkzeug', 'atlas', 'strings', 'himmel'].forEach(function (n) { C6.bus.on(n, bald); });
    bald();
  }
  if (C6.bus) an(); else setTimeout(an, 0);
})();
