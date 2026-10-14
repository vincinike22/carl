// Aus lernweg.js (s6) genommen, für das Freundschaftsbuch („Für Bastler: Carl auf deinem Computer“).
// Braucht: mk(tag, klasse, eltern, text), S().geraet ('mac'|'win'|'linux'), die Klassen c6lw-code/-befehl/-quelle und kopiere(b).
  var INSTALL = { mac: 'curl -fsSL https://claude.ai/install.sh | bash', win: 'irm https://claude.ai/install.ps1 | iex' };
  function station6(re) {
    var l = S(), g = l.geraet, m = pruefe6();
    var w1 = mk('div', 'c6lw-wahl', re); w1.setAttribute('role', 'radiogroup'); w1.setAttribute('aria-label', 'Womit du arbeitest');
    GERAETE.forEach(function (x) {
      var b = mk('button', 'c6lw-chip', w1, x[1]); b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', g === x[0] ? 'true' : 'false');
      b.setAttribute('data-lw', 'geraet'); b.setAttribute('data-wert', x[0]);
    });
    var mz = mk('p', 'c6lw-modell', re);
    if (m) mz.textContent = 'Dein Modell: ' + m.name + '. ' + m.satz;
    else { mz.textContent = 'Noch kein Modell gewählt. '; var mb = mk('button', 'c6lw-link', mz, 'Im Freundschaftsbuch wählen'); mb.type = 'button'; mb.setAttribute('data-lw', 'modell'); }
    if (!g) return;
    if (g === 'handy') { mk('p', 'c6lw-carl', re, 'Mit dem Handy geht alles hier im Carl. Claude Code braucht einen Computer; das zeige ich dir, wenn du einen hast.'); return; }
    var cmd = g === 'win' ? INSTALL.win : INSTALL.mac;
    var box = mk('details', 'c6lw-code', re);
    mk('summary', null, box, 'Claude Code auf deinem ' + (g === 'mac' ? 'Mac' : g === 'win' ? 'Windows-PC' : 'Linux-Rechner') + ' einrichten');
    var ol = mk('ol', 'c6lw-schritte c6lw-klein', box);
    var schritte = [
      ['Ein passendes Konto haben: Pro, Max, Team, Enterprise oder Console. Der kostenlose Plan reicht nicht.'],
      [g === 'win' ? 'PowerShell öffnen.' : g === 'mac' ? 'Das Programm „Terminal“ öffnen.' : 'Ein Terminal öffnen.'],
      ['Claude Code installieren:', cmd],
      ['Ein neues Fenster öffnen und prüfen:', 'claude --version'],
      ['Im Ordner deines Projekts starten, beim ersten Mal im Browser anmelden:', 'claude'],
      ['Mich anschließen: Diesen Schritt gibt es noch nicht. Im Prototyp reden Claude Code und ich nicht miteinander.']
    ];
    schritte.forEach(function (s) {
      var li = mk('li', null, ol, s[0]);
      if (s[1]) { var k = mk('button', 'c6lw-befehl', li); k.type = 'button'; k.setAttribute('data-lw', 'kopie'); k.setAttribute('aria-label', 'Befehl kopieren: ' + s[1]); mk('code', null, k, s[1]); }
    });
    var q = mk('p', 'c6lw-quelle', box);
    q.innerHTML = 'Befehle wörtlich aus der <a href="https://code.claude.com/docs/en/setup" target="_blank" rel="noopener">Claude Code Doku</a>, geprüft am 8. Oktober 2026.';
  }
  function kopiere(b) {
    var t = (b.querySelector('code') || b).textContent;
    Promise.resolve().then(function () { return navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(t) : Promise.reject(); })
      .then(function () { b.classList.add('c6lw-kopiert'); setTimeout(function () { b.classList.remove('c6lw-kopiert'); }, 1400); }, function () {
        try { var r = D.createRange(); r.selectNodeContents(b.querySelector('code')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {}
      });
  }
